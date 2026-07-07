# Claude Code — Plugins & MCP Bootstrap

**Purpose:** Portable setup file. On a fresh PC, tell Claude Code: *"Read `plugins-mcp.md` and install everything in it."* Claude should run the commands in the **Claude: run these** blocks.

Requires the `claude` CLI installed and on PATH (`claude --version` to verify). Node.js (for `npx` servers), and optionally Docker + Python `uv` for a couple of MCP servers noted below.

---

## 1. Plugins

Three plugins, from two custom marketplaces plus the official one.

| Plugin | Marketplace | Source |
|---|---|---|
| `token-optimizer` | `alexgreensh-token-optimizer` | github: `alexgreensh/token-optimizer` |
| `caveman` | `caveman` | github: `JuliusBrussee/caveman` |
| `claude-code-setup` | `claude-plugins-official` | official (built-in, no add needed) |

**Claude: run these** (idempotent — safe to re-run):

```bash
# 1. Register the custom marketplaces
claude plugin marketplace add alexgreensh/token-optimizer
claude plugin marketplace add JuliusBrussee/caveman

# 2. Install the plugins
claude plugin install token-optimizer@alexgreensh-token-optimizer
claude plugin install caveman@caveman
claude plugin install claude-code-setup@claude-plugins-official
```

Verify:

```bash
claude plugin list
claude plugin marketplace list
```

> `claude-code-setup` lives in the official marketplace, which ships with Claude Code — no `marketplace add` required for it.

---

## 2. MCP Servers

Add to **user scope** (`-s user`) so they apply on every project. Below is exactly what was configured on the source machine.

> ⚠️ **Placeholders:** several entries had example paths / API keys on the source machine and will NOT connect until you fill in real values. Each is flagged **[NEEDS REAL VALUE]**. Only `chrome-devtools` worked out-of-the-box.

**Claude: run these.** Start with the one that works, then add the rest only if you actually use them / have the prerequisites.

### 2a. Works as-is

```bash
# Chrome DevTools — browser automation / inspection (needs Node + Chrome)
claude mcp add chrome-devtools -s user -- npx -y chrome-devtools-mcp@latest
```

### 2b. Need prerequisites or real values

```bash
# fetch — simple URL fetch tool (Node)
claude mcp add fetch -s user -- npx -y @modelcontextprotocol/server-fetch

# filesystem — [NEEDS REAL VALUE] replace /path/to/allowed/files with a real dir
claude mcp add filesystem -s user -- npx -y @modelcontextprotocol/server-filesystem /path/to/allowed/files

# markitdown — doc→markdown (needs Docker + local image `markitdown-mcp:latest`)
claude mcp add markitdown -s user -- docker run --rm -i markitdown-mcp:latest

# serena — code toolkit [NEEDS REAL VALUE] replace the two /abs/path placeholders (uv binary + serena checkout)
claude mcp add serena -s user -- /abs/path/to/uv run --directory /abs/path/to/serena serena start-mcp-server

# imagesorcery-mcp — image ops (needs `imagesorcery-mcp` binary on PATH)
claude mcp add imagesorcery-mcp -s user -- imagesorcery-mcp
```

### 2c. HTTP server (needs API key)

```bash
# web-search-prime (z.ai) — [NEEDS REAL VALUE] put your real key after "Bearer "
claude mcp add web-search-prime -s user --transport http \
  https://api.z.ai/api/mcp/web_search_prime/mcp \
  --header "Authorization: Bearer YOUR_API_KEY"
```

Verify all:

```bash
claude mcp list          # shows ✓ Connected / ✗ Failed per server
```

---

## 3. Prerequisites summary

| Need | For |
|---|---|
| `claude` CLI | everything |
| Node.js + npx | fetch, chrome-devtools, filesystem |
| Google Chrome | chrome-devtools |
| Docker | markitdown |
| Python `uv` + serena checkout | serena |
| `imagesorcery-mcp` binary | imagesorcery |
| z.ai API key | web-search-prime |
| Node.js + npx | aitmpl components (§5) |

---

## 4. Notes

- On the source machine these MCP servers lived in `~/.mcp.json`; the two custom plugin marketplaces were registered in `~/.claude/settings.json` under `extraKnownMarketplaces` + `enabledPlugins`. The CLI commands above reproduce both.
- Skip any 2b/2c server you don't use — a missing prereq just shows `✗ Failed to connect` and is otherwise harmless.
- After install, restart Claude Code (or reload the window) so plugins and statusline take effect.

---

## 5. aitmpl.com components (claude-code-templates)

Three components from the [claude-code-templates](https://github.com/davila7/claude-code-templates) (aitmpl.com) marketplace — one skill, one agent, one command.

> ⚠️ **Install location = current working directory's `.claude/`.** The CLI has no `--global` flag. To install **globally** (`~/.claude/`), run these **from your home directory**. Only prerequisite is Node.js (`npx`).

**Claude: run these** (from home so they land in the global `~/.claude/`):

```bash
cd ~
npx claude-code-templates@latest --skill development/mcp-builder --yes
npx claude-code-templates@latest --agent performance-testing/react-performance-optimization --yes
npx claude-code-templates@latest --command performance/optimize-bundle-size --yes
```

What each does:
- **`mcp-builder`** (skill) — scaffolds high-quality MCP servers (Python FastMCP or Node/TS SDK).
- **`react-performance-optimization`** (agent) — audits React/Next.js re-renders, memoization, and bundle cost.
- **`optimize-bundle-size`** (command) — analyzes + trims bundle size via code-splitting/config strategies.

Verify: `ls ~/.claude/skills/mcp-builder ~/.claude/agents/react-performance-optimization.md ~/.claude/commands/optimize-bundle-size.md`

> Slug note: the agent is `react-performance-optimization` (not `-optimizer`) and the command is `optimize-bundle-size` (not `optimize-bundle`) — these are the exact repo paths.
