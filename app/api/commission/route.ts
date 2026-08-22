import { NextResponse } from "next/server";
import { Resend } from "resend";
import { CommissionRequestEmail } from "@/emails/commission-request";
import { CommissionConfirmationEmail } from "@/emails/commission-confirmation";
import { commissionSchema } from "@/lib/commission-schema";
import { SITE } from "@/content/site";

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
 *   6. confirm     — a copy back to the visitor, best-effort and never fatal
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
  // Cloudflare sets this on every request that reaches the Worker and it cannot be
  // spoofed by the client, so it wins over the forwarded headers below.
  const cfIp = request.headers.get("cf-connecting-ip");
  if (cfIp) return cfIp;

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

    /**
     * The visitor's own confirmation.
     *
     * This is the one send whose recipient DOES come from the payload, which is the
     * whole reason it sits last and behind every check above: Turnstile and the
     * per-IP rate limit are what stop it being a way to mail arbitrary strangers
     * from this domain. It stays a reply to a form the recipient just submitted —
     * nothing about it is a general-purpose send.
     *
     * Best-effort by design. The artist's notification is the one that matters; if
     * this fails the request still succeeded, so it is logged and swallowed rather
     * than turned into a 502 that would make the visitor submit the form twice.
     */
    try {
      const confirmation = await resend.emails.send({
        from: `${SITE.artist.name} <${from}>`,
        to: [data.email],
        replyTo: to,
        subject: SITE.email.client.subject,
        react: CommissionConfirmationEmail({ data })
      });
      if (confirmation.error) {
        console.error("[commission] confirmation not sent", confirmation.error);
      }
    } catch (err) {
      console.error("[commission] confirmation not sent", err);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[commission] unexpected error", err);
    return NextResponse.json({ error: "send_failed" }, { status: 502 });
  }
}
