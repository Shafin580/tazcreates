import type { JsonLdSchema } from "@/lib/seo/schemas";

/**
 * Renders JSON-LD server-side. Mount it from a server component (`page.tsx`,
 * `layout.tsx`) — answer-engine crawlers do not reliably execute JS, so structured
 * data injected from a client component is frequently never seen.
 */
export function JsonLd({ schema }: { schema: JsonLdSchema | JsonLdSchema[] }) {
  const graph = Array.isArray(schema) ? schema : [schema];

  return (
    <>
      {graph.map((node, index) => (
        <script
          key={`${String(node["@type"] ?? "schema")}-${index}`}
          type="application/ld+json"
          // Payload is built from our own config and page props, never from request
          // input. `<` is escaped regardless so a stray "</script>" in copy cannot
          // break out of the tag.
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({ "@context": "https://schema.org", ...node }).replace(
              /</g,
              "\\u003c"
            )
          }}
        />
      ))}
    </>
  );
}
