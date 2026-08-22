import { defineCloudflareConfig } from "@opennextjs/cloudflare";

/**
 * Deliberately minimal.
 *
 * Every page on this site is statically generated (`app/page.tsx` is `force-static`) and
 * nothing uses ISR or `revalidate`, so there is no incremental cache worth wiring to R2 or
 * KV. Add `incrementalCache` here the day a route starts revalidating on a timer.
 */
export default defineCloudflareConfig();
