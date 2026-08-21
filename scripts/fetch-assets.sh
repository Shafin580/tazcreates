#!/usr/bin/env bash
# fetch-assets.sh — pull the artist's own media off the old Canva site into public/.
#
# Source: https://tazcreates.my.canva.site/ (Tazmeen Zabiyaan's portfolio).
# Every file here is her own artwork/photography being moved to her own new site.
# Re-runnable: skips anything already downloaded. Run from the repo root.
set -euo pipefail

BASE="https://tazcreates.my.canva.site/_assets"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

mkdir -p public/art public/photos public/texture public/social assets-source

get() { # get <source-path> <dest>
  local src="$1" dest="$2"
  if [ -s "$dest" ]; then printf '  = %s (cached)\n' "$dest"; return 0; fi
  if curl -fsSL --retry 3 --retry-delay 1 "$BASE/$src" -o "$dest"; then
    printf '  + %s (%s)\n' "$dest" "$(du -h "$dest" | cut -f1)"
  else
    printf '  ! FAILED %s\n' "$src" >&2; return 1
  fi
}

echo "artwork -> public/art/"
get media/d4d0d6e7c7539b6c505698d5949fd1b4.jpg public/art/family-group.jpg
get media/9f5078406a018a267e6dd296b2cb6d24.jpg public/art/couple-duo.jpg
get media/fa3ec23f9dff7be06776e588a774c8ff.jpg public/art/solo-roses.jpg
get media/0b341ef4f5113f51c893cfe301513a59.jpg public/art/besties-graduation.jpg
get media/bb2b1e1ba7f966fe7b063da85c8da39e.jpg public/art/solo-green-dress.jpg
get media/74130bedd85b40011094983445714f7e.jpg public/art/couple-green.jpg

echo "photography -> public/photos/"
get media/770f688faeb779785c7447aa7cc3fea9.jpg public/photos/artist-mural.jpg
get media/71cc78b6b51da21c15c0a89af3cfb9d8.png public/photos/avatar-chibi.png

echo "texture -> public/texture/"
get media/61cb3e7c57790d6a30fe31d1f3e729ff.png public/texture/brush-markers.png
get media/1936d4e345c19a3cc4600a0389a56bcf.png public/texture/oil-pastels.png
get media/b4603946558cc8ba3a32cee324ac8955.png public/texture/glossy-stars.png

echo "social proof -> public/social/"
get media/2efe8956327865bb74928f717ef20afe.png assets-source/frame-decoration.png  # empty frame, no DM content
get media/6709b93bedc486e7dfb9e36367657fab.jpg public/social/dm-collage-tall.jpg

echo "gradients -> assets-source/ (reference only, not shipped by the page)"
get media/157dbee5d12ba703f826a80ce98e31b8.jpg assets-source/aura-pastel.jpg
get media/540e54ba28136df2a49de88f8dd3ffac.jpg assets-source/hero-gradient.jpg
get media/914ebd808ae78e89bd9814d01637354e.jpg assets-source/services-gradient.jpg
get media/0ff165ecf1c9b55e820833eefe05f43c.jpg assets-source/soft-gradient-wide.jpg
get video/1152e794e720cf00c122b01f62ea0b5c.jpg assets-source/hero-video-poster.jpg
get video/6ff9773e5c64640a989d548594400744.jpg assets-source/cta-video-poster.jpg

echo "videos -> assets-source/ (animated gradients; replaced by CSS, kept for reference)"
get video/8445186dfe05d8eb61737505439ee208.mp4 assets-source/hero-gradient.mp4
get video/770182e82d0d07f0ffd9426ee93494d6.mp4 assets-source/cta-gradient.mp4

echo
echo "done. shipped: $(find public/art public/photos public/texture public/social -type f | wc -l) files; archived: $(find assets-source -type f | wc -l)"
