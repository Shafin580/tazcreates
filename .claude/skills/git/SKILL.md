---
name: git
description: Policy for any git usage in this project. Read before running any git command. Covers what git operations Claude may and may never run, and how to hand off work for the user to commit.
---

# Git Policy

## Rules (MUST follow)

### No State-Changing Git Actions — Ever

**NEVER run any git command that changes repo state.** This includes (not exhaustive):

- `git add`
- `git commit`
- `git push`
- `git checkout` / `git switch`
- `git reset`
- `git stash`
- `git merge`
- `git rebase`
- `git tag`
- `git config`
- `git clean`
- Any other git subcommand that mutates the working tree, index, refs, or config

The user manages all git operations manually. Agents may edit files on disk and stop there — never stage, commit, push, or otherwise mutate the repo.

### Read-Only Git Is Allowed — and Encouraged

Read-only git commands are safe for analysis and should be used freely:

- `git status`
- `git diff`
- `git log`
- `git show`
- `git blame`

Use these to understand current changes, history, and context before and after making edits.

### What to Do Instead of Committing

After making file changes:

1. List the changed files (from `git status` / `git diff --stat`).
2. Tell the user what to commit and why.
3. If a commit message is wanted, use the `commit-message-generator` skill to compose one — that skill also never runs `git commit`. It hands the user a ready-to-run message; the user commits it themselves.
