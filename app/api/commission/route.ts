import { NextResponse } from "next/server";
import { Resend } from "resend";
import { CommissionRequestEmail } from "@/emails/commission-request";
import { commissionSchema } from "@/lib/commission-schema";

/**
 * Commission request endpoint.
 *
 * Everything reaching this handler is untrusted: the form is public and the route can be
 * POSTed to directly, so client-side validation counts for nothing here. Order of
 * operations is deliberate — cheapest rejections first, and no email is sent until every
 * check has passed.
 *
 *   1. shape       — re-parse the raw body with the shared zod schema
 *   2. honeypot    — a filled hidden field is a bot; answer 200 so it learns nothing
 *   3. rate limit  — per IP, before spending a Turnstile call
 *   4. Turnstile   — verified server-side against Cloudflare, never trusted from the client
 *   5. send        — `to` is always the configured address, never taken from the payload
 */

export const runtime = "nodejs";

const TURNSTILE_VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

/**
 * In-memory, per-instance rate limit. Adequate for a single-origin portfolio; it resets
 * on deploy and does not coordinate across serverless instances. If this site ever runs
 * at scale, move it to a shared store rather than raising the limit here.
 */
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 3;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) {
    hits.set(ip, recent);
    return true;
  }
  recent.push(now);
  hits.set(ip, recent);
  // Opportunistic sweep so the map cannot grow without bound.
  if (hits.size > 500) {
    for (const [key, times] of hits) {
      if (times.every((t) => now - t >= WINDOW_MS)) hits.delete(key);
    }
  }
  return false;
}

function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]!.trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}

async function verifyTurnstile(token: string, ip: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return false;

  const body = new URLSearchParams({ secret, response: token });
  if (ip !== "unknown") body.set("remoteip", ip);

  try {
    const res = await fetch(TURNSTILE_VERIFY_URL, {
      method: "POST",
      body,
      headers: { "content-type": "application/x-www-form-urlencoded" }
    });
    const result = (await res.json()) as { success?: boolean };
    return result.success === true;
  } catch {
    // A verification outage must fail closed — an unverified submission is not accepted.
    return false;
  }
}

export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL ?? "commissions@tazcreates.site";

  // Not configured yet. Say so plainly so the form can show its mailto fallback rather
  // than looking broken.
  if (!apiKey || !to || !process.env.TURNSTILE_SECRET_KEY) {
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const parsed = commissionSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  }
  const data = parsed.data;

  // Honeypot: report success so a bot gets no signal that it was caught.
  if (data.company) {
    return NextResponse.json({ ok: true });
  }

  const ip = clientIp(request);
  if (rateLimited(ip)) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  if (!(await verifyTurnstile(data.turnstileToken, ip))) {
    return NextResponse.json({ error: "captcha_failed" }, { status: 400 });
  }

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: `Tazcreates <${from}>`,
      // Always the configured recipient. Never `data.email` — that would make this an
      // open relay that anyone could use to send mail to anyone.
      to: [to],
      replyTo: data.email,
      subject: `Commission request — ${data.name} (${data.portraitType})`,
      react: CommissionRequestEmail({ data })
    });

    if (error) {
      console.error("[commission] resend error", error);
      return NextResponse.json({ error: "send_failed" }, { status: 502 });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[commission] unexpected error", err);
    return NextResponse.json({ error: "send_failed" }, { status: 502 });
  }
}
