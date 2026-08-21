/**
 * Coffee cup mark, inline.
 *
 * `lucide-react` v1 removed its brand icons, so there is no Buy Me a Coffee logo to
 * import — the same constraint that produced `instagram-glyph.tsx`. A generic cup keeps
 * the icon set consistent and avoids shipping a guessed brand path.
 */
export function CoffeeGlyph({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}>
      <path d="M4 9h13v6a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V9Z" />
      <path d="M17 10h1.5a2.5 2.5 0 0 1 0 5H17" />
      <path d="M7 2.5c0 1-1 1.5-1 2.5M11 2.5c0 1-1 1.5-1 2.5M15 2.5c0 1-1 1.5-1 2.5" />
    </svg>
  );
}
