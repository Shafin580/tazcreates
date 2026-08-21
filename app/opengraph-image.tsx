import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { SITE } from "@/content/site";

export const alt = `${SITE.artist.name} — ${SITE.artist.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * The social card, generated rather than hand-exported.
 *
 * What this replaces: `SITE_CONFIG.ogImage` used to point at a gallery piece — a
 * 600x800 *portrait* crop. Social platforms lay out a 1.91:1 landscape card, so a
 * portrait image gets letterboxed or centre-cropped through the face. Generating it
 * here keeps the card in the site's own palette and type, and it cannot drift out of
 * sync with `content/site.ts`.
 *
 * Fonts are read off disk rather than fetched: this runs at build time in a Node
 * runtime, and a network fetch here fails the build on an offline machine.
 */
export default async function OpengraphImage() {
  const portrait = await readFile(
    join(process.cwd(), "public", SITE.gallery.items[2].src.replace(/^\//, ""))
  );
  const portraitSrc = `data:image/jpeg;base64,${portrait.toString("base64")}`;

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        background: "#FBF7F4",
        color: "#1A1416",
        position: "relative"
      }}>
      {/* Bloom wash, matching the page's --bloom-rose */}
      <div
        style={{
          position: "absolute",
          top: -180,
          left: -140,
          width: 620,
          height: 620,
          borderRadius: 9999,
          background:
            "radial-gradient(circle at center, rgba(228,150,175,0.45) 0%, rgba(251,247,244,0) 68%)"
        }}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "0 64px",
          width: 700
        }}>
        <div style={{ fontSize: 26, color: "#C9647F", letterSpacing: 1 }}>
          {SITE.artist.greeting}
        </div>
        <div style={{ fontSize: 86, fontWeight: 700, lineHeight: 1, marginTop: 10 }}>
          {SITE.artist.name}
        </div>
        <div style={{ fontSize: 30, color: "rgba(26,20,22,0.72)", marginTop: 24 }}>
          {SITE.artist.tagline}
        </div>
        <div
          style={{
            marginTop: 34,
            fontSize: 21,
            letterSpacing: 3,
            textTransform: "uppercase",
            color: "#7A2E43"
          }}>
          {SITE.pricing.tiers.map((t) => `${t.tier} ${t.price}`).join("   ·   ")}
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", flex: 1, paddingRight: 56 }}>
        {/* Rendered by Satori into a PNG, not by a browser — `next/image` does not
            apply inside an ImageResponse. */}
        <img
          src={portraitSrc}
          alt=""
          width={392}
          height={490}
          style={{ objectFit: "cover", borderRadius: 28, border: "1px solid #E8DCD8" }}
        />
      </div>
    </div>,
    size
  );
}
