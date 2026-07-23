---
name: delegate-local
description: Decision guide for offloading bounded, mechanical, low-risk subtasks to the local LM Studio model (`google/gemma-4-12b-qat`, OpenAI-compatible at `http://localhost:1234/v1`) instead of spending full Claude reasoning on them — a component/type stub from an already-decided shape, a Jest/RTL test skeleton, mechanical renames, docstring/comment passes, format-only rewrites, first-draft `bn` i18n values, file/diff summaries, and draft commit messages. Read this BEFORE starting any task shaped like one of those. Claude always reviews the local model's output against project verification before accepting it — never covers component architecture, React Query/Zustand state design, or auth/permission code, which Claude does directly.
---

# Delegate to local model (Claude-usage efficiency)

The local model is a cheap first-draft generator, not a second opinion. Claude stays the planner,
reviewer, and integrator on every delegated task — treat its output as an untrusted draft until
reviewed.

## When to delegate vs when Claude does it directly

| Task | Action |
|---|---|
| Component/type/DTO stub from an explicit, already-decided shape | Delegate |
| Jest/RTL test skeleton for an existing component | Delegate |
| Mechanical rename, docstring/comment pass, format-only rewrite | Delegate |
| First-draft `bn` i18n values (still needs a linguistic pass later) | Delegate |
| File/diff summary, draft commit message | Delegate |
| Component architecture, hook design, React Query/Zustand wiring | Claude directly |
| Anything touching `@/lib/auth`, permissions, or an API contract | Claude directly |
| Needs whole-repo or cross-file reasoning to get right | Claude directly |
| One-line change Claude already knows how to make | Claude directly, no delegation |
| Summarize/skim a large file Claude doesn't need to edit | Delegate — pipe from disk, don't `Read` first |

## How to call it (Bash)

```bash
curl -s http://localhost:1234/v1/chat/completions \
  -H 'Content-Type: application/json' \
  -d '{"model":"google/gemma-4-12b-qat","messages":[{"role":"user","content":"<task>"}]}'
```

Read `.choices[0].message.content` from the JSON. If unsure the model id still matches what LM Studio
has loaded, confirm with `curl -s http://localhost:1234/v1/models` first. If the server is
unreachable, do the task yourself — never block on it.

**Don't send `temperature` or `max_tokens`.** Both are configured in LM Studio when the model is
loaded; overriding them per request fights that config. Send the model id and the messages, nothing
else. If a draft comes back empty or truncated, check `.choices[0].finish_reason` — a `"length"`
finish with empty `content` means the model spent its configured output budget on reasoning. Raise
the budget in LM Studio, or write it yourself; don't patch the request.

## Delegating file reads (keep large files out of Claude's context)

Not just for writing drafts — also use the local model to READ and digest content Claude doesn't
need verbatim: summarize a large log/doc/config, extract one fact from a big file, skim several
files for "does X exist here". Pipe the file straight from disk into the local model so its raw
content never lands in Claude's own context — only the extracted answer comes back.

```bash
jq -n --rawfile content path/to/file --arg task "Summarize this file in 5 bullet points" \
  '{model:"google/gemma-4-12b-qat", messages:[{role:"user", content: ($task + "\n\n" + $content)}]}' \
  | curl -s http://localhost:1234/v1/chat/completions -H 'Content-Type: application/json' -d @-
```

`jq --rawfile` handles escaping (quotes, newlines, unicode) safely — never hand-build the JSON string
yourself, it breaks on the first quote or backslash in the file.

**Never do this for a file Claude is about to `Edit`.** The `Edit` tool needs Claude to have actually
seen the exact original text to match against — read those with the `Read` tool directly, never
through the local model. This trick is for read-only comprehension (summarize, locate, "does X
exist"), not for files about to be modified.

## Always review (non-negotiable)

Read the draft, run `pnpm tsc --noEmit && pnpm lint` on the touched files, and fix anything wrong
before accepting. Never commit or mark work done on unreviewed local-model output — the review is
Claude's job, never delegated.

## What NOT to do

- Don't delegate anything from the "Claude directly" row above just because it looks small.
- Don't skip verification because the draft "looks fine" — a 12B local model invents imports and
  misreads types more often than it looks like it does.
- Don't send secrets, `.env` values, or real user data in the prompt content.
- Don't chain multiple delegated pieces without reviewing each one — errors compound silently.
