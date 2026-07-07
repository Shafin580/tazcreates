---
name: knowledge
description: Search and retrieve previously captured learnings from .planning/learnings/. Use when the user runs /knowledge, asks "have we solved this before", "what did we decide about X", "why did we choose Y", or wants to browse/recall project-specific decisions, patterns, or past bug fixes before re-solving something from scratch.
category: documentation
auto_trigger: false
requires_context: true
accepts_args: true
---

# /knowledge Skill Definition

## Division of Labor

- `.claude/tasks/lessons.md` — fast corrections log. Appended immediately when the user corrects you mid-task. Unstructured, chronological, low-ceremony.
- `.planning/learnings/` — structured knowledge capture, written via `/learn`. Categorized, tagged, queryable via `/knowledge`. This skill reads from the latter.

## Behavior

When `/knowledge [query]` is invoked, you MUST:

### 1. Parse Query

Understand the intent:

**Query Types**:
- **Topic search**: `/knowledge authentication`
  → Search for learnings about authentication

- **Category filter**: `/knowledge category:architecture`
  → All learnings in architecture category

- **Multiple keywords**: `/knowledge error handling patterns`
  → Learnings matching all keywords

- **Technology search**: `/knowledge zustand`
  → Learnings about specific technology

- **Decision search**: `/knowledge why did we` or `/knowledge why [topic]`
  → Learnings explaining decisions

- **Recent search**: `/knowledge recent` or `/knowledge last week`
  → Recently captured learnings

- **Tag search**: `/knowledge tag:nextjs,auth`
  → Learnings with specific tags

**Query Parsing Logic**:
```javascript
const parseQuery = (query) => {
  const parsed = {
    category: null,
    keywords: [],
    tags: [],
    timeframe: null,
    intent: 'topic' // topic|decision|recent|category|tag
  };

  // Extract category filter
  if (query.match(/category:(\w+)/i)) {
    parsed.category = RegExp.$1;
    parsed.intent = 'category';
  }

  // Extract tag filter
  if (query.match(/tag:([\w,-]+)/i)) {
    parsed.tags = RegExp.$1.split(',');
    parsed.intent = 'tag';
  }

  // Extract timeframe
  if (query.match(/recent|last (week|month|day)/i)) {
    parsed.timeframe = RegExp.$1 || 'week';
    parsed.intent = 'recent';
  }

  // Extract decision intent
  if (query.match(/why|decision|chose|selected/i)) {
    parsed.intent = 'decision';
  }

  // Extract keywords (remaining words)
  parsed.keywords = query
    .replace(/category:\w+/gi, '')
    .replace(/tag:[\w,-]+/gi, '')
    .replace(/recent|last (week|month|day)/gi, '')
    .trim()
    .split(/\s+/)
    .filter(w => w.length > 2);

  return parsed;
};
```

### 2. Search Strategy

Execute search in order of speed:

**Step 1: Knowledge Graph Search** (fastest, OPTIONAL — only if a memory MCP server is available)
```javascript
// Search entities by observations
search_nodes(keywords.join(' '))

// Or read entire graph and filter
read_graph()
  .filter(e => e.entityType === 'learning')
  .filter(e => matchesQuery(e, parsed))
```
If no memory MCP server is configured, skip this step entirely and go straight to the file path below — it is the primary path, not a fallback of last resort.

**Step 2: File Search** (primary path)
```javascript
// Search in specific category file
Read(`.planning/learnings/${parsed.category}.md`)

// Or search all files
for (const category of categories) {
  const content = Read(`.planning/learnings/${category}.md`);
  // Extract matching entries
}
```

**Step 3: Grep Search** (fallback)
```javascript
// Search for keywords in all learning files
Grep({
  pattern: keywords.join('|'),
  path: '.planning/learnings',
  output_mode: 'content',
  context: 3
})
```

### 3. Rank Results

Score and sort results by relevance:

```javascript
const scoreResult = (learning, query) => {
  let score = 0;

  // Title match (highest weight)
  if (learning.title.toLowerCase().includes(query.keywords[0])) {
    score += 10;
  }

  // Multiple keyword matches
  query.keywords.forEach(keyword => {
    if (learning.content.toLowerCase().includes(keyword)) {
      score += 3;
    }
  });

  // Tag matches
  query.tags.forEach(tag => {
    if (learning.tags.includes(tag)) {
      score += 5;
    }
  });

  // Category match
  if (query.category === learning.category) {
    score += 7;
  }

  // Recency (decay over time)
  const ageInDays = (Date.now() - learning.date) / (1000 * 60 * 60 * 24);
  if (ageInDays < 7) score += 2;
  if (ageInDays < 30) score += 1;

  // Decision keyword in query
  if (query.intent === 'decision' && learning.content.includes('chose')) {
    score += 4;
  }

  return score;
};

// Sort by score descending
results.sort((a, b) => scoreResult(b, query) - scoreResult(a, query));
```

### 4. Present Results

Format output clearly and concisely:

```markdown
Found [N] relevant learnings:

---

**1. [Title]** ([category])
   📅 [Date]

   [Summary: 1-2 sentence key insight]

   💡 Key Points:
   • [Point 1]
   • [Point 2]

   ```[language if code example]
   [Code example if relevant]
   ```

   🏷️ Tags: tag1, tag2, tag3
   📄 File: .planning/learnings/[category].md:[line]

---

**2. [Title]** ([category])
   [... same format ...]

---

🔗 Related: [Related learning 1], [Related learning 2]

💡 Tip: Use `/knowledge category:[category]` to see all [category] learnings
```

**For Large Result Sets** (>5 results):
- Show top 5 most relevant
- Summarize remaining: "... and 7 more learnings"
- Suggest refinements: "Try `/knowledge [narrower query]` for more specific results"

**For No Results**:
```markdown
❌ No learnings found for "[query]"

💡 Suggestions:
• Try broader keywords
• Check available categories: [list]
• Try `/knowledge category:[category]` to browse
• Use `/learn` to capture new learnings

📚 Available learning categories:
architecture, implementation, tooling, performance, security, debugging, process, other
```

### 5. Show Context

When showing a specific learning, include:

**Context Information**:
- When it was captured
- What conversation/work led to it
- Related technologies/patterns
- Links to related learnings

**Related Learnings**:
- Query knowledge graph for relations (if a memory MCP server is available)
- Find learnings with similar tags
- Find learnings in related categories
- Show up to 3 most related

**Quick Actions**:
```markdown
📌 Quick Actions:
• View full file: Read .planning/learnings/[category].md
• Related learnings: /knowledge [related tags]
• Update learning: [Instructions to edit if needed]
```

### 6. Special Queries

**List all learnings**:
```
/knowledge all
/knowledge list
```
Show categorized summary of all learnings.

**Browse category**:
```
/knowledge category:architecture
```
Show all learnings in category, chronologically.

**Recent learnings**:
```
/knowledge recent
/knowledge this week
```
Show learnings from last 7 days.

**Stats**:
```
/knowledge stats
```
Show learning statistics:
- Total learnings
- Learnings per category
- Most common tags
- Recent activity

## Output Examples

### Example 1: Specific Topic

**Query**: `/knowledge authentication`

**Output**:
```markdown
Found 3 relevant learnings:

---

**1. Next.js Route Groups for Auth Separation** (architecture)
   📅 2026-01-15

   Use App Router route groups to separate public and protected routes.
   (auth) group for public, (module) group for protected with middleware.

   💡 Key Points:
   • Route groups organize without affecting URLs
   • Middleware applies auth to entire (module) group
   • Clean separation of concerns

   🏷️ Tags: nextjs-16, route-groups, authentication, middleware
   📄 File: .planning/learnings/architecture.md:25

---

**2. Type-Safe Auth API Pattern** (implementation)
   📅 2026-01-16

   Created type-safe wrapper around auth API calls using TypeScript
   generics and zod validation for request/response.

   💡 Key Points:
   • Full type safety from API to component
   • Runtime validation with zod
   • Reusable for all API calls

   ```typescript
   const login = await getAPIResponse<LoginResponse>({
     endpoint: API_PATHS.auth.login,
     method: 'POST',
     body: credentials
   });
   ```

   🏷️ Tags: typescript, api, type-safety, zod, authentication
   📄 File: .planning/learnings/implementation.md:42

---

**3. Fixed Auth Redirect Loop** (debugging)
   📅 2026-01-17

   Middleware was redirecting authenticated users to login, causing loop.
   Fixed by checking auth state before redirect.

   💡 Key Points:
   • Always check current auth state in middleware
   • Use proper redirect logic (don't redirect if already on target)
   • Test edge cases (logged in hitting public routes)

   🏷️ Tags: debugging, middleware, authentication, redirect
   📄 File: .planning/learnings/debugging.md:15

---

🔗 Related: Middleware Pattern, API Pattern, Form Validation

💡 Tip: Use `/knowledge category:architecture` to see all architecture learnings
```

### Example 2: Category Browse

**Query**: `/knowledge category:debugging`

**Output**:
```markdown
Debugging Learnings (5 total)

---

**Fixed Auth Redirect Loop** (2026-01-17)
Middleware redirect logic fix for authenticated users
Tags: middleware, authentication, redirect

**Hydration Error in Layout** (2026-01-20)
Fixed by ensuring server/client HTML match
Tags: nextjs, hydration, ssr

**Type Error in API Response** (2026-01-22)
Added runtime validation with zod schemas
Tags: typescript, api, zod, validation

**Performance Issue in Provider List** (2026-01-25)
Fixed by memoizing expensive calculations
Tags: performance, react, memoization

**Build Error After Dependency Update** (2026-01-28)
Conflicting peer dependencies resolved
Tags: npm, dependencies, build

---

📄 Full details: .planning/learnings/debugging.md
💡 Use `/knowledge [specific topic]` to see detailed information
```

## Implementation Notes

- **Cache Results**: Cache knowledge graph in memory during query (if using the optional memory MCP server)
- **Fast Path**: Use knowledge graph first if available, files second — otherwise files are the primary path
- **Parallel Search**: Search multiple categories in parallel
- **Fuzzy Matching**: Allow minor typos in keywords
- **Smart Ranking**: Prioritize exact matches, recent learnings
- **Related Learnings**: Always suggest related content
- **Format for Readability**: Use emojis, structure, whitespace
- **Handle Empty**: Always provide helpful suggestions when no results

## Error Handling

```markdown
⚠️ Error reading learnings

Possible causes:
• Learning files not found in .planning/learnings/
• Knowledge graph not accessible (optional — only relevant if a memory MCP server is configured)
• File permissions issue

💡 Try:
1. Check `.planning/learnings/` directory exists
2. Run `/learn` to initialize system
3. Verify files are readable
```
