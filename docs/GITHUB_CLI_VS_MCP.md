# GitHub CLI (gh) vs GitHub MCP — Version & Translation Cheatsheet

VERSION AND AGENT HISTORY
Version: 1.0
Date: 2026-04-22
Author: Claude Code (Opus 4.7)
Branch: claude/github-version-compatibility-uTOO7
Status: Active

## TL;DR

**gh CLI and GitHub MCP are NOT versioned together.** They are independent products that both wrap the same GitHub REST/GraphQL API. Do not assume a feature in `gh` is in MCP, or vice versa.

|                   | gh CLI                                     | GitHub MCP (this repo)                       |
| ----------------- | ------------------------------------------ | -------------------------------------------- |
| Product           | Standalone Go binary by GitHub             | MCP server built into Claude Code            |
| Latest common ref | 2.54 (summer 2024), 2.x ongoing            | No public semver; tracks Claude Code release |
| Auth              | `gh auth login` — PAT or OAuth device flow | OAuth only (CLAUDE.md rule: **no PAT**)      |
| Config            | `~/.config/gh/`                            | `.mcp.json` forbidden for github; built-in   |
| Interface         | Shell commands                             | JSON-RPC tool calls (`mcp__github__*`)       |
| Scope here        | Not installed in web sandbox               | Restricted to `blogtheristo/dws6`            |
| Release cadence   | Own semver, ~2-4 weeks                     | Opaque; bundled with Claude Code             |

Both hit the same upstream API, so ~90% of features overlap — but there is no version-compatibility mapping.

## Why this matters

- **Don't quote gh changelog features as MCP features.** gh 2.54 adding something does not mean MCP has it.
- **Don't assume `gh` behaviour in MCP.** e.g. gh auto-opens a browser on `gh pr create`; MCP returns a JSON payload.
- **Read MCP tool schema, not gh man page**, when uncertain about arguments.

## Command Translation Map

### Pull Requests

| gh command                             | MCP tool                                                                                               |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `gh pr create --title ... --body ...`  | `mcp__github__create_pull_request`                                                                     |
| `gh pr list --state open --base main`  | `mcp__github__list_pull_requests`                                                                      |
| `gh pr view <n>`                       | `mcp__github__pull_request_read` (method: `get`)                                                       |
| `gh pr diff <n>`                       | `mcp__github__pull_request_read` (method: `get_diff`)                                                  |
| `gh pr checks <n>`                     | `mcp__github__pull_request_read` (method: `get_status`)                                                |
| `gh pr view <n> --json files`          | `mcp__github__pull_request_read` (method: `get_files`)                                                 |
| `gh pr review <n> --approve`           | `mcp__github__pull_request_review_write`                                                               |
| `gh pr review <n> --comment -F file`   | `mcp__github__pull_request_review_write` + `mcp__github__add_comment_to_pending_review`                |
| `gh pr comment <n> --body ...`         | `mcp__github__add_issue_comment` (PRs are issues in GitHub's data model)                               |
| _(reply to an existing review thread)_ | `mcp__github__add_reply_to_pull_request_comment` (requires existing comment ID — no direct gh command) |
| `gh pr merge <n> --squash`             | `mcp__github__merge_pull_request`                                                                      |
| `gh pr merge <n> --auto`               | `mcp__github__enable_pr_auto_merge`                                                                    |
| `gh pr edit <n> --title ...`           | `mcp__github__update_pull_request`                                                                     |
| `gh pr update-branch <n>`              | `mcp__github__update_pull_request_branch`                                                              |
| `gh pr ready <n>`                      | `mcp__github__update_pull_request` (draft: false)                                                      |
| `gh search prs "is:open author:@me"`   | `mcp__github__search_pull_requests`                                                                    |

### Issues

| gh command                             | MCP tool                                                     |
| -------------------------------------- | ------------------------------------------------------------ |
| `gh issue create -t ... -b ...`        | `mcp__github__issue_write` (method: `create`)                |
| `gh issue list --label bug`            | `mcp__github__list_issues`                                   |
| `gh issue view <n>`                    | `mcp__github__issue_read`                                    |
| `gh issue view <n> --comments`         | `mcp__github__issue_read` (method: `get_comments`)           |
| `gh issue edit <n> --add-label ...`    | `mcp__github__issue_write` (method: `update`)                |
| `gh issue close <n>`                   | `mcp__github__issue_write` (method: `update`, state: closed) |
| `gh issue comment <n> -b ...`          | `mcp__github__add_issue_comment`                             |
| `gh search issues "is:open label:bug"` | `mcp__github__search_issues`                                 |

### Branches, Commits, Files

| gh command / git                       | MCP tool                                                               |
| -------------------------------------- | ---------------------------------------------------------------------- |
| `gh api repos/.../branches`            | `mcp__github__list_branches`                                           |
| `gh api -X POST repos/.../git/refs`    | `mcp__github__create_branch`                                           |
| `gh api repos/.../commits`             | `mcp__github__list_commits`                                            |
| `gh api repos/.../commits/<sha>`       | `mcp__github__get_commit`                                              |
| `gh api repos/.../contents/<path>`     | `mcp__github__get_file_contents`                                       |
| `gh api -X PUT .../contents/<path>`    | `mcp__github__create_or_update_file`                                   |
| `gh api -X DELETE .../contents/<path>` | `mcp__github__delete_file`                                             |
| _(no direct gh; commit many files)_    | `mcp__github__push_files` ← prefer this over N×`create_or_update_file` |

### Releases, Tags, Labels

| gh command                        | MCP tool                          |
| --------------------------------- | --------------------------------- |
| `gh release list`                 | `mcp__github__list_releases`      |
| `gh release view --latest`        | `mcp__github__get_latest_release` |
| `gh release view <tag>`           | `mcp__github__get_release_by_tag` |
| `gh api repos/.../tags`           | `mcp__github__list_tags`          |
| `gh api repos/.../git/tags/<sha>` | `mcp__github__get_tag`            |
| `gh label list` / `view`          | `mcp__github__get_label`          |

### Repositories, Search, Security

| gh command                          | MCP tool                           |
| ----------------------------------- | ---------------------------------- |
| `gh repo create`                    | `mcp__github__create_repository`   |
| `gh repo fork`                      | `mcp__github__fork_repository`     |
| `gh search repos "topic:ai"`        | `mcp__github__search_repositories` |
| `gh search code "pattern path:src"` | `mcp__github__search_code`         |
| `gh search users`                   | `mcp__github__search_users`        |
| `gh api user`                       | `mcp__github__get_me`              |
| _(no direct gh)_                    | `mcp__github__run_secret_scanning` |

### Teams & Copilot

| gh command                         | MCP tool                                        |
| ---------------------------------- | ----------------------------------------------- |
| `gh api user/teams`                | `mcp__github__get_teams`                        |
| `gh api teams/<id>/members`        | `mcp__github__get_team_members`                 |
| _(gh copilot extension, separate)_ | `mcp__github__assign_copilot_to_issue`          |
| _(gh copilot extension)_           | `mcp__github__create_pull_request_with_copilot` |
| _(gh copilot extension)_           | `mcp__github__get_copilot_job_status`           |

### PR Watch (unique to MCP)

No `gh` equivalent. These are live event streams, not polled reads:

- `mcp__github__subscribe_pr_activity` — receive comment/CI/review webhooks in session
- `mcp__github__unsubscribe_pr_activity`

## What gh CAN do that MCP here CANNOT

| Capability                                                            | Why unavailable                           |
| --------------------------------------------------------------------- | ----------------------------------------- |
| Trigger / rerun Actions workflows (`gh run rerun`, `gh workflow run`) | No `run_*` or `workflow_*` tools exposed  |
| Raw API escape hatch (`gh api` with any endpoint)                     | MCP surface is fixed — no pass-through    |
| Codespaces (`gh codespace`)                                           | No tools                                  |
| Gists (`gh gist`)                                                     | No tools                                  |
| Aliases, config, auth status (`gh alias`, `gh config`, `gh auth`)     | OAuth managed by Claude Code platform     |
| Extensions ecosystem (`gh extension install`)                         | Not applicable                            |
| Cross-repo operations                                                 | MCP is scoped to `blogtheristo/dws6` only |

If you need one of the above, tell the human — do not fabricate a workaround.

## What MCP adds that gh does NOT

- **`subscribe_pr_activity`** — live session-level PR event stream (no polling). This is how Claude reacts to CI failures and review comments in real time.
- **`push_files`** — atomic multi-file commit in one API call. `gh` would need a script around `git` or repeated `api -X PUT`.
- **`run_secret_scanning`** — on-demand content scan without pushing.

## Search Qualifier Syntax (same in both)

Because MCP search tools forward to GitHub's search API, gh's qualifier syntax works unchanged inside `search_pull_requests`, `search_issues`, `search_code`, `search_repositories`, `search_users`:

```
is:open is:pr author:@me review-requested:@me
repo:blogtheristo/dws6 label:bug created:>2026-04-01
path:src/ extension:ts "TODO"
user:blogtheristo followers:>10
```

Knowing gh's qualifier grammar directly improves MCP search call quality.

## Rules of Engagement (from CLAUDE.md)

1. OAuth only. Never add `GITHUB_PERSONAL_ACCESS_TOKEN` to `.mcp.json`. Never re-add `@modelcontextprotocol/server-github`.
2. Scope is `blogtheristo/dws6`. Do not target other repos.
3. Do not fabricate gh feature parity with MCP. If a capability is missing, say so.
4. Prefer `push_files` over multiple `create_or_update_file` calls for atomic commits.
5. Use `subscribe_pr_activity` as soon as a PR is created, so CI + review events flow back automatically.
6. Mobile sessions: never call `gh pr create` (gh not installed) — use `create_pull_request` or the compare-URL fallback.

## Related

- `docs/GITHUB_MCP_TOOLS.md` — full tool reference (48 tools)
- `.claude/commands/gh-to-mcp.md` — slash-command translator
- `CLAUDE.md` § GitHub MCP Tools — OAuth Only
- `AGENTS.md` § 16 — gstack workflow
