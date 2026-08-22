# Todo — phase 4 (DONE)

## Fixed
- [x] **Site-breaking: all 6 artwork paths were 404.** Photos had moved into
      `public/art/{solo,duo,group}/` but `content/site.ts` still pointed at the old flat
      paths — gallery, all 3 pricing cards and every review thumbnail were broken.
      Also refreshed 2 stale dimension pairs (solo-roses 800² -> 1179², solo-green-dress
      600x800 -> 1180x1572) that would have caused layout shift.
- [x] **WebP**: 18 assets converted, alpha preserved, all verified to decode at original
      dimensions. `public/` 4.4M -> 2.4M. Originals deleted only after verification.
      Note: `next/image` already served WebP (IMAGES binding is configured), so this is a
      deploy/repo-weight win, not a change to what visitors download.
- [x] **Tier galleries**: Solo (5) and Duo (6) open the existing `GalleryLightbox`;
      Group (1 photo) deliberately has NO trigger. Prev/next stays inside the tier.
      `LightboxPhoto` is now a structural type so gallery + pricing share one viewer.
- [x] **Alt text + captions** for the 6 new photos, written by opening each image.
      `duo-3` and `duo-5` are both hand-lettered "Besties" and needed distinguishing.
- [x] **Email broken layout — root cause was a MISSING VIEWPORT META.** Without it mail
      clients lay out at ~980px and scale down, and the `@media (max-width:600px)` block
      can never match. Added via a shared `EmailHead` so the two templates cannot drift.
- [x] Email button overflowed by ~60px: `width:100%` without `box-sizing:border-box`
      added the 32px side padding on top of the full width.
- [x] Email padding was on the `<table>`, not the `<td>`, so text sat flush to the edge.
- [x] Readability: value text 15/24 -> 16/26, labels 12 -> 13, long tokens breakable.
- [x] Measured: 0 overflow at 320/375/390, smallest font 13px, 21px insets, dark mode ok.

## Not a bug
- [x] **Confirmation email**: the code is correct. Verified both sends succeed with the
      real API key and real React templates. The confirmation feature landed at
      2026-08-22 **19:25** (commit c3ee6e8); the screenshot's admin email arrived at
      **9:52 AM** — the tested submission predates the feature.
      The rate-limit hypothesis was tested and disproved (two back-to-back sends both ok).

## Verified
- [x] 0 broken images on the live page (was 6); 18/18 load
- [x] tsc clean; jest 35/35; build clean; prettier clean; 0 lint errors in changed files
- [x] Lighthouse accessibility 100; no horizontal overflow
- [x] `og.png` still PNG at 1200x630 (NOT converted — social scrapers are unreliable with
      WebP OG cards). Satori cannot decode WebP, so the generator now reads a build-only
      JPEG from `assets-source/`, which is never served.

## Open
- [ ] **og.png is still 587K.** Reducing it meaningfully needs JPEG output, which
      `next/og` cannot emit. Options: post-process step, or approve the `sharp` build
      script (`pnpm approve-builds`) so the generator can re-encode. Ask before adding.
- [ ] FAQ/process copy still marked `verify: true` in `content/site.ts` — turnaround,
      revisions, deposit and shipping are drafted, not confirmed, and feed `faqSchema()`.
