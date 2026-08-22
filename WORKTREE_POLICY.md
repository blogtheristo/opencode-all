# WORKTREE_POLICY.md — Agent Isolation via Git Worktrees

| Field     | Value                              |
| --------- | ---------------------------------- |
| Document  | Git Worktree Policy for Agents     |
| Tool      | opencode (ox-alpha)                |
| SessionID | dws6-design-system-2026-08-22      |
| Version   | 1.0                                |

**Status:** Active policy
**Applies to:** All OpenCode agent sessions (primary runtime per AGENTS.md §Runtime
Selection), and by convention any autonomous coding agent on this machine.

---

## 1. Problem statement

On 2026-08-22, multiple concurrent agents (6 `opencode` processes plus automated
housekeeping sessions) shared the primary checkout at `/home/admin100/dws6`. They also
share one **git index**. Result: a housekeeping commit (`dca623b3c`) swept up another
agent's staged-but-uncommitted design-system work under an unrelated commit message.
Index races like this will recur as long as agents commit from the shared checkout.

## 2. Policy rules

1. **Agents NEVER commit from the primary checkout.** The primary checkout is reserved
   for human review, merges, and repo-level administration.
2. **Every agent task gets its own worktree**, created with:
   ```bash
   scripts/new-opencode-worktree.sh <task-name> [base-branch] [--launch]
   ```
   - Location: `$HOME/.opencode-worktrees/dws6/<task-name>` — **outside the repository**,
     so no scanner, linter, or `git add .` can ever reach it from the primary checkout
   - Branch: `opencode/<task-name>`, cut from `origin/main`
   - venv symlinked; `.env`, `.env.local`, `.mcp.json` copied; `.opencode` settings
     copied (session state/memory intentionally NOT copied); npm install run
3. **One task = one worktree = one branch = one PR.**
4. **Commit only what you staged in your own worktree.** Never use `-a`/`.` blindly;
   verify `git status` before every commit.
5. **Cleanup after merge:**
   ```bash
   git worktree remove ~/.opencode-worktrees/dws6/<task-name>
   git branch -d opencode/<task-name>
   ```
6. **Weekly hygiene (Fridays, with the DWS team cycle):** prune orphans —
   `git worktree prune && git branch --list 'opencode/*'` (delete merged branches).

## 3. Why outside-repo (not `.opencode/worktrees/` inside)

| Option                          | Verdict                                             |
| ------------------------------- | --------------------------------------------------- |
| Outside repo (`~/.opencode-worktrees/`) | ✅ Chosen — zero risk of tooling scanning or committing worktree contents; mirrors the proven `scripts/new-claude-worktree.sh` design |
| In-repo `.opencode/worktrees/`  | ❌ Rejected — must be gitignored forever; grep/lint/audit tooling repeatedly tripped on `.claude/worktrees/` residue historically |
| Shared primary checkout         | ❌ Rejected — caused the 2026-08-22 incident        |

## 4. Claude Code hot standby (per-branch)

Per AGENTS.md §Runtime Selection, Claude Code is the **hot standby** for any branch
OpenCode works with. Worktree isolation must not break failover:

1. **Every `opencode/<task>` branch must be Claude-resumable.** Before a session ends,
   serialize state into `.claude/handoffs/<task>.md` **inside the worktree** (task,
   decisions, next steps). Handoffs are platform-agnostic by design.
2. **Failover procedure:** `cd ~/.opencode-worktrees/dws6/<task-name> && claude`.
   Both platforms share identical MCP server configs (AGENTS.md guarantee), so no
   reconfiguration is needed.
3. **Do not switch platforms mid-commit.** Resume first (handoff), then continue.
4. **Cleanup only after** the PR is merged AND the handoff file is archived
   (`docs/archive/` or deleted — it must not block `git worktree remove`; untracked
   files require `--force`, which is expected).

## 5. Relationship to existing conventions

| Tool         | Convention                              | Script                            |
| ------------ | --------------------------------------- | --------------------------------- |
| Claude Code  | `~/.claude-worktrees/dws6/`             | `scripts/new-claude-worktree.sh`  |
| OpenCode     | `~/.opencode-worktrees/dws6/`           | `scripts/new-opencode-worktree.sh` (this policy) |
| Copilot      | `.copilot-worktrees/` (in-repo, ignored)| IDE-managed                       |
| Cursor       | `.cursor/worktrees.json` setup commands | IDE-managed                       |

## 6. Enforcement

- **Soft (now):** this document + AGENTS.md pointer; session-start guidance tells
  agents to create a worktree before making changes.
- **Hard (proposed follow-up):** an OpenCode permission rule denying `git commit` /
  `git push` when `pwd` resolves to the primary checkout (path allowlist), plus a
  `pre-commit` hook warning when `git rev-parse --git-common-dir` != `$(pwd)/.git`.

## 7. References

- Incident: commit `dca623b3c` (2026-08-22) — cross-agent index sweep
- Prior art: `.claude/hooks/auto-commit_DEPRECATED.sh` (deprecated after the
  2026-04-13 worktree-copy incident)
- Git docs: `git-worktree(1)`

---

**Last Updated:** 2026-08-22
