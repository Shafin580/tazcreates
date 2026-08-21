// Twitter/X uses the same 1.91:1 card as Open Graph, so this re-exports the OG image
// rather than maintaining a second layout that would drift from it.
export { default, alt, size, contentType } from "./opengraph-image";
