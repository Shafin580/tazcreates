import { ImageResponse } from "next/og";
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { SITE } from "@/content/site";

/**
 * Build-time generator for the social card, written to `public/og.png`.
 *
 * This used to be `app/opengraph-image.tsx`, a Next metadata route (with `twitter-image`
 * re-exporting it). It rendered the same image, but keeping it a route meant `next/og`
 * stayed in the Worker's module graph, so every deploy shipped Satori's `resvg.wasm`,
 * `yoga.wasm`, a font blob and their JS glue — 820 KB gzipped of a 3 MB Workers script
 * budget — to render a picture that is identical on every request.
 *
 * Emitting it to `public/` at build time makes it a static asset, which Cloudflare serves
 * off the assets store and does not count against the script limit, and takes `next/og`
 * out of the runtime entirely. Same 1200x630 PNG, same pixels.
 *
 * Run by `pnpm og`, and wired into `build` and `build:cf` so the card cannot drift out of
 * sync with `content/site.ts`. The committed `public/og.png` keeps `next dev` honest.
 *
 * Fonts and artwork are read off disk rather than fetched: this is a build step, and a
 * network fetch here would fail the build on an offline machine.
 */

const size = { width: 1200, height: 630 };

const OUT = join(process.cwd(), "public", "og.png");

async function render(): Promise<Buffer> {
  const portrait = await readFile(
    join(process.cwd(), "public", SITE.gallery.items[2].src.replace(/^\//, ""))
  );
  const portraitSrc = `data:image/jpeg;base64,${portrait.toString("base64")}`;

  const image = new ImageResponse(
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

  return Buffer.from(await image.arrayBuffer());
}

async function main() {
  const png = await render();
  await writeFile(OUT, png);
  console.log(`og: wrote public/og.png (${size.width}x${size.height}, ${(png.length / 1024).toFixed(0)} KB)`);
}

void main();
