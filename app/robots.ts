import type { MetadataRoute } from "next";
import { SITE_URL } from "@/config/site.config";

/**
 * Single gate for indexability. Every page that needs to opt out of indexing reads
 * this rather than hand-writing a `robots` metadata block.
 *
 * `NEXT_PUBLIC_SEO_INDEX` is an explicit override ("true" / "false"); with it unset,
 * only production builds are indexable, so previews and staging never compete with
 * the live site for the same content.
 */
const INDEX_FLAG = process.env.NEXT_PUBLIC_SEO_INDEX;

export const SHOULD_INDEX = INDEX_FLAG
  ? INDEX_FLAG === "true"
  : process.env.NODE_ENV === "production";

/**
 * Answer-engine crawlers, listed explicitly. A bare `User-agent: *` allow is enough
 * for most of them, but naming them makes the decision to be citable visible and
 * greppable — and makes revoking one a one-line change.
 */
export const AI_CRAWLERS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-Web",
  "PerplexityBot",
  "Google-Extended",
  "CCBot"
] as const;

export default function robots(): MetadataRoute.Robots {
  if (!SHOULD_INDEX) {
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }

  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/api/"] },
      ...AI_CRAWLERS.map((userAgent) => ({ userAgent, allow: "/" }))
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL
  };
}
