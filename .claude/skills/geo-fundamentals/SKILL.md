---
name: geo-fundamentals
description: Generative Engine Optimization — getting content cited by AI answer engines (ChatGPT, Claude, Perplexity, Gemini). Use when optimizing for AI citation, writing or auditing llms.txt, structuring content for extraction, configuring AI crawler access, or checking AI-citation readiness.
allowed-tools: Read, Glob, Grep
---

# GEO Fundamentals

Optimization for AI-powered answer engines. Distinct from SEO: the goal is being **cited**,
not ranked.

**Boundary:** `seo-optimizer` owns metadata, canonicals, Core Web Vitals, and the crawl
surface. This skill owns what makes content quotable once it has been crawled. They share
the same primitives — `lib/seo/schemas.ts`, `app/robots.ts`, `public/llms.txt`.

## 1. SEO vs GEO

| Aspect | SEO | GEO |
| --- | --- | --- |
| Goal | Rank #1 | Get cited in the answer |
| Platform | Google, Bing | ChatGPT, Claude, Perplexity, Gemini |
| Metric | Position, CTR | Citation rate, share of voice |
| Focus | Keywords | Entities, extractable facts, data |

## 2. Engine landscape

| Engine | Citation style | Opportunity |
| --- | --- | --- |
| Perplexity | Numbered `[1][2]` | Highest citation rate |
| ChatGPT | Inline / footnotes | Search + browsing |
| Claude | Contextual | Long-form, well-structured content |
| Gemini | Sources section | Strong SEO crossover |

## 3. Retrieval factors

Approximate weight in how AI engines select what to cite:

| Factor | Weight |
| --- | --- |
| Semantic relevance | ~40% |
| Keyword match | ~20% |
| Authority signals | ~15% |
| Source diversity | ~15% |
| Freshness | ~10% |

## 4. What gets cited

| Element | Why it works |
| --- | --- |
| Original statistics | Unique and attributable — nothing else to cite |
| Clear definitions | Trivially extractable |
| Comparison tables | Structured, quotable |
| Step-by-step guides | Actionable, self-contained |
| FAQ sections | Question-shaped, matches query form |
| Expert quotes | Authority transfer |

**Find the assets this site actually holds** before optimizing anything: the numbers,
specifications, prices, or process details that exist nowhere else. Those are what get
cited. Make them explicit, specific, and dated. A page with no unique fact on it cannot be
made citable by formatting.

## 5. Content checklist

- [ ] Question-shaped headings (`h2`/`h3`)
- [ ] Summary or TL;DR near the top
- [ ] Original data with a stated source
- [ ] Short paragraphs (2–4 sentences)
- [ ] Clear, standalone definitions
- [ ] FAQ block of 3–5 question/answer pairs
- [ ] "Last updated" date visible
- [ ] Named author or organisation attribution

## 6. Technical checklist

- [ ] `articleSchema()` with `datePublished` **and** `dateModified`
- [ ] `faqSchema()` on question content
- [ ] `organizationSchema()` establishing the entity — mounted in `app/layout.tsx`
- [ ] Server-rendered HTML — AI crawlers do not reliably execute JS
- [ ] Fast load (< 2.5s LCP)
- [ ] `public/llms.txt` present and current

All schema comes from `lib/seo/schemas.ts`, rendered via `JsonLd`
(`components/seo/json-ld.tsx`) from a **server** component. `JsonLd` mounted inside a
`"use client"` tree is the single most common way structured data silently stops being seen.

## 7. AI crawler access

| Crawler | Engine |
| --- | --- |
| `GPTBot`, `OAI-SearchBot`, `ChatGPT-User` | OpenAI / ChatGPT |
| `ClaudeBot`, `Claude-Web` | Claude |
| `PerplexityBot` | Perplexity |
| `Google-Extended` | Gemini training/grounding |
| `CCBot` | Common Crawl (feeds many models) |

`app/robots.ts` lists these explicitly in `AI_CRAWLERS` and allows them when `SHOULD_INDEX`
is true; when it is false, everything is disallowed, so previews and staging never get
crawled. Blocking a crawler forfeits citations from that engine — treat it as a deliberate
trade, not a default.

## 8. llms.txt

`public/llms.txt` is a Markdown entry point for AI crawlers. Keep it current when pages,
services, or products change. It should carry:

- One-paragraph description of the organisation
- Key facts (location, focus, contact)
- Product or service list with specifics
- Annotated links to key pages
- A note on where structured data lives
- Attribution/citation request
- A "Last updated" date

Still an emerging convention with uneven adoption — cheap to maintain, so worth keeping
accurate rather than aspirational.

## 9. Auditing this repo

No script needed. Work through it with Grep/Read:

1. `grep -rn "articleSchema\|faqSchema" app` — which pages carry citation-friendly schema?
2. Check every `articleSchema()` call passes a real `datePublished`, not a build-time `new Date()`.
3. `grep -rLn "JsonLd" app --include=page.tsx` — which routes have no structured data at all?
4. `grep -rn "JsonLd" app | xargs grep -l "use client"` — any schema stranded in a client component?
5. Diff `public/llms.txt` against `LINKS` in `config/router.config.ts` for stale or missing entries.
6. Check `AI_CRAWLERS` in `app/robots.ts` still lists the intended user-agents.
7. Scan page copy for paragraphs longer than ~4 sentences and headings that are not question-shaped.

## 10. Anti-patterns

| Don't | Do |
| --- | --- |
| Publish undated content | Add `datePublished`/`dateModified` |
| "Studies show…" | Name the source |
| Invent statistics to look authoritative | Use real data, or say nothing |
| Wall-of-text paragraphs | 2–4 sentences, then break |
| Client-render the key facts | Server-render them |
| Stuff keywords for density | Improve structure — extraction beats repetition |

Fabricating figures is a trust and compliance problem, not a growth tactic. If a fact is not
in the source material, ask — do not fill the gap.
