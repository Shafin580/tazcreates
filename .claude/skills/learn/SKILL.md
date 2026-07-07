---
name: learn
description: Automatically capture implementation learnings from the conversation into structured, categorized, tagged files. Use when the user runs /learn, says "remember this", "capture this decision", "log this learning", or after a nontrivial bug fix / architecture decision / tooling change that should survive beyond this session.
category: documentation
auto_trigger: false
requires_context: true
---

# /learn Skill Definition

## Division of Labor

- `.claude/tasks/lessons.md` — fast corrections log. Append here immediately when the user corrects you mid-task; unstructured, chronological, low-ceremony.
- `.planning/learnings/` — structured knowledge capture, written by this skill (`/learn`). Categorized, tagged, and queryable via `/knowledge`. Use this skill for anything worth surfacing to a future session by topic rather than by timeline.

## Behavior

When `/learn` is invoked, you MUST automatically:

### 1. Extract Learnings from Context

Analyze the ENTIRE conversation (not just recent messages) for:

**Architecture** - System design, patterns, structure:
- Route organization decisions
- Data flow architecture
- Component hierarchy
- State management approach
- API design patterns
- Integration patterns

**Implementation** - Code patterns, techniques:
- Component patterns (hooks, composition, etc.)
- Type safety patterns
- Error handling approaches
- Form handling patterns
- Data fetching strategies
- Reusable utilities created

**Tooling** - Commands, configs, workflows:
- CLI commands used successfully
- Configuration changes made
- Build/test scripts
- Environment setup
- Deployment steps
- Development workflow improvements

**Performance** - Optimizations:
- Performance improvements made
- Bundle size reductions
- Loading time optimizations
- Caching strategies
- Resource optimization

**Security** - Security patterns:
- Authentication/authorization patterns
- Input validation
- Data sanitization
- Security vulnerabilities fixed
- Access control patterns

**Debugging** - Problems and solutions:
- Errors encountered and fixes
- Gotchas discovered
- Common mistakes and solutions
- Workarounds for issues
- Root cause analysis

**Process** - Workflows, practices:
- Development workflow improvements
- Team practices
- Code review patterns
- Testing strategies
- Documentation approaches

**Other** - Anything else valuable:
- Third-party integration insights
- Library-specific learnings
- Migration experiences
- Deprecated patterns to avoid

### 2. Auto-Categorize with Rules

```javascript
// Auto-categorization logic
const rules = {
  architecture: [
    /route|routing|router|navigation/i,
    /architecture|design pattern|system design/i,
    /component hierarchy|data flow/i,
    /state management|zustand|redux/i,
    /API design|endpoint|microservice/i
  ],
  implementation: [
    /hook|useEffect|useState|custom hook/i,
    /component|jsx|tsx|react/i,
    /type|typescript|interface|generic/i,
    /form|validation|zod|react-hook-form/i,
    /query|fetch|api call|tanstack/i
  ],
  tooling: [
    /command|cli|script|npm|pnpm/i,
    /config|configuration|env|environment/i,
    /build|webpack|turbo|bundler/i,
    /test|jest|testing|cypress/i,
    /deploy|docker|kubernetes/i
  ],
  performance: [
    /performance|optimize|optimization/i,
    /cache|caching|memoize/i,
    /lazy load|code split|bundle/i,
    /speed|latency|response time/i
  ],
  security: [
    /security|auth|authentication|authorization/i,
    /xss|csrf|injection|vulnerability/i,
    /sanitize|validate input|escape/i,
    /permission|access control|rbac/i
  ],
  debugging: [
    /error|bug|fix|debug/i,
    /issue|problem|troubleshoot/i,
    /gotcha|mistake|wrong/i,
    /workaround|solution|resolve/i
  ],
  process: [
    /workflow|process|practice/i,
    /team|collaboration|review/i,
    /documentation|comment|readme/i,
    /skill|learn|knowledge/i
  ]
};

// Multi-category: learning can belong to multiple categories
// Always include most specific category
```

### 3. Auto-Generate Tags

Extract tags automatically from:
- Technology names (Next.js, React, TypeScript, etc.)
- Library names (Zustand, TanStack Query, etc.)
- Pattern names (hooks, server-components, etc.)
- Problem types (hydration, performance, security)
- File types (.tsx, .ts, .json, etc.)
- Feature areas (auth, routing, forms, etc.)

Tag format: lowercase, hyphenated, specific
Examples: `nextjs`, `react-query`, `server-components`, `hydration-error`

### 4. Generate Title

Create concise, descriptive titles:
- Use imperative form: "Use X for Y", "Fix Z by doing W"
- Include key technology: "Next.js Route Groups", "Zustand Store Pattern"
- Be specific: Not "API Pattern" but "Type-Safe API Wrapper Pattern"
- Max 60 characters

### 5. Structure Learning Entry

```markdown
## [Auto-Generated Title]
- **Date**: [YYYY-MM-DD]
- **Context**: [What prompted this - extracted from conversation]
- **Decision/Insight**: [The key learning - be specific and actionable]
- **Example**: [Code snippet, command, or concrete example from conversation]
- **Tags**: [auto-generated, comma-separated, tags]
- **Related**: [Link to related learnings if found]

---
```

### 6. Persist to Storage

For EACH learning:

a. **Append to markdown file** (primary path, always do this):
   - File: `.planning/learnings/{category}.md`
   - Insert at end of file (before final `---` if exists)
   - Maintain chronological order

b. **Create knowledge graph entity** (OPTIONAL — only if a memory MCP server is available; skip if not configured):
   ```javascript
   create_entities([{
     name: `learning:${category}:${slug}`,
     entityType: "learning",
     observations: [
       title,
       `Category: ${category}`,
       `Date: ${date}`,
       summary (1-2 sentences),
       `Tags: ${tags.join(', ')}`,
       `File: .planning/learnings/${category}.md`
     ]
   }])
   ```

c. **Create relations** (OPTIONAL — same memory MCP server dependency as 6b):
   - Link to related project entities (frameworks, libraries)
   - Link to related learnings (similar topics)
   - Link to patterns/practices

### 7. Confirmation Output

Provide clear confirmation:
```
✅ Captured [N] learnings:

[Category 1]: [Title 1]
├─ Tags: tag1, tag2, tag3
└─ File: .planning/learnings/[category1].md

[Category 2]: [Title 2]
├─ Tags: tag4, tag5, tag6
└─ File: .planning/learnings/[category2].md

All learnings written to .planning/learnings/ (and indexed in the knowledge graph, if a memory MCP server is available).
Use `/knowledge [query]` to retrieve.
```

## Auto-Learning Mode

When enabled, automatically capture learnings at:
- End of significant conversations (10+ messages)
- After code implementation (5+ file changes)
- After problem resolution (error → solution)
- When user says "remember this" or similar

Check for learnings without user trigger if conversation contains:
- Decision words: "decided", "chose", "selected", "went with"
- Solution words: "fixed", "resolved", "solved", "workaround"
- Pattern words: "pattern", "approach", "strategy", "technique"
- Learning words: "learned", "discovered", "found out", "realized"

## Quality Filters

DO NOT capture:
- Generic knowledge (available in official docs)
- Simple typo fixes
- Obvious best practices
- Temporary hacks (unless documented as "avoid this")
- Incomplete or uncertain decisions

DO capture:
- Project-specific decisions
- "Why we chose X over Y"
- Bugs fixed with root cause
- Performance measurements
- Custom patterns created
- Integration challenges solved

## Examples

### Good Learning Capture

**Conversation**:
"We're using Next.js 16 App Router with route groups. Put auth routes in (auth) for public access and dashboard routes in (module) with middleware protection."

**Extracted Learning**:
```markdown
## Next.js Route Groups for Auth Separation
- **Date**: 2026-01-29
- **Context**: Setting up authentication with public and protected routes
- **Decision/Insight**: Use Next.js 16 App Router route groups: (auth) for public routes (login, signup), (module) for protected routes (dashboard, settings). Middleware enforces auth on (module) group.
- **Example**:
  ```
  app/
  ├── (auth)/
  │   ├── login/
  │   └── forgot-password/
  └── (module)/
      ├── dashboard/
      └── providers/
  ```
- **Tags**: nextjs-16, app-router, route-groups, authentication, middleware
- **Related**: Authentication Pattern
```

### Bad Learning (Don't Capture)

**Conversation**:
"Fixed typo in button text"

**Reason**: Too trivial, no learning value

---

## Implementation Notes

- ALWAYS read existing learning files before appending
- NEVER overwrite existing content
- Check knowledge graph for duplicates before creating (if a memory MCP server is available; otherwise just check the file for the section header)
- Use Edit tool for appending to files
- Create entities in batch for performance (only when the optional memory MCP server is in use)
- Handle multiple learnings in parallel
