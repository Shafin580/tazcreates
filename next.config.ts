import createNextIntlPlugin from "next-intl/plugin";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

/**
 * next-intl is wired for one reason: the shipped `CustomSelect` primitive (and the
 * other shared components in `components/ui/custom/`) call `useTranslations`, so they
 * need the runtime present even though this site's own copy is English-only and lives
 * in `content/site.ts`.
 *
 * The plugin points at `i18n/request.ts`, which resolves the locale and loads
 * `messages/<locale>.json`. Without it, any route that renders a component reaching
 * for translations fails to prerender with "Couldn't find next-intl config file" —
 * including `/_not-found`, which is generated even when nothing else uses i18n.
 *
 * There is deliberately no `[locale]` route segment and no middleware: routes are
 * unprefixed and `LOCALE_PREFIXED_ROUTES` in `config/router.config.ts` stays false.
 * Introduce both together if a second language is ever shipped.
 */
export default createNextIntlPlugin("./i18n/request.ts")(nextConfig);
