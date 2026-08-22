# Todo — commission emails (React Email)

- [x] `emails/shared.tsx` — palette, type stacks, Field/Hairline/GoldRule, button + link styles
- [x] `emails/commission-request.tsx` — artist notification, rebuilt on the new design
- [x] `emails/commission-confirmation.tsx` — new, the visitor's auto-reply
- [x] `content/site.ts` — `SITE.email.{empty,admin,client}`; portrait labels now derive
      from `SITE.pricing.tiers` instead of a map local to the email
- [x] `app/api/commission/route.ts` — confirmation send, last and non-fatal
- [x] Contrast fix: labels `#8A8180` (3.8:1, fails AA) → `#6F6664` (5.6:1)
- [x] `pnpm tsc --noEmit`, `pnpm exec eslint emails/ app/api/... content/site.ts`,
      `pnpm i18n:check` — all clean
- [x] Both templates rendered with sample data and inspected
- [ ] User: verify `tazcreates.site` in Resend Domains, set `CONTACT_FROM_EMAIL`,
      submit the form once against a real key
- [ ] Optional: delete the Draft template in Resend — the HTML files are reference now
