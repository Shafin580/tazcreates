# agentic-nextjs-project-template

This is a project template of nextjs for agentic programming

## TypeScript

The project uses TypeScript 7 for its command-line typecheck:

```bash
pnpm typecheck
```

Production builds run this native check before Next.js builds the application.

TypeScript 7.0 does not expose a programmatic API. The `typescript` dependency
therefore points to Microsoft's TypeScript 6 compatibility package for tools
such as `typescript-eslint` and Next.js, while `@typescript/native` supplies the
TypeScript 7 `tsc` executable. To compare diagnostics during the transition,
run `pnpm typecheck:compat`.
