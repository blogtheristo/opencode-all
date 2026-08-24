# GitHub MCP Tools Reference

VERSION AND AGENT HISTORY
Version: 1.0
Date: 2026-04-08
Author: Claude Code (Opus 4.6)
Branch: claude/add-github-mcp-tools-LX3O2
Status: Active

## Overview

48 GitHub MCP tools available via OAuth in Claude Code. No personal access token needed — authentication uses the GitHub OAuth built into the Claude Code web environment.

**Scope:** Restricted to `blogtheristo/dws6` repository.

## Tools by Category

### Identity (1 tool)

| Tool     | Description                    |
| -------- | ------------------------------ |
| `get_me` | Get authenticated user profile |

### Issues (7 tools)

| Tool                | Description                                                     |
| ------------------- | --------------------------------------------------------------- |
| `list_issues`       | List issues with filters (state, labels, date, pagination)      |
| `search_issues`     | Search issues using GitHub search syntax                        |
| `issue_read`        | Get issue details, comments, sub-issues, or labels              |
| `issue_write`       | Create or update issues (title, body, assignees, labels, state) |
| `add_issue_comment` | Add a comment to an issue                                       |
| `list_issue_types`  | List supported issue types for an organization                  |
| `sub_issue_write`   | Add, remove, or reprioritize sub-issues                         |

### Pull Requests (16 tools)

| Tool                                | Description                                                                         |
| ----------------------------------- | ----------------------------------------------------------------------------------- |
| `list_pull_requests`                | List PRs with filters (state, base, head, sort)                                     |
| `search_pull_requests`              | Search PRs using GitHub search syntax                                               |
| `pull_request_read`                 | Get PR details, diff, status, files, review comments, reviews, comments, check runs |
| `create_pull_request`               | Create a new PR                                                                     |
| `update_pull_request`               | Update PR title, body, state, draft status, reviewers                               |
| `update_pull_request_branch`        | Sync PR branch with base branch                                                     |
| `merge_pull_request`                | Merge a PR (merge, squash, or rebase)                                               |
| `enable_pr_auto_merge`              | Enable auto-merge for a PR                                                          |
| `disable_pr_auto_merge`             | Disable auto-merge for a PR                                                         |
| `pull_request_review_write`         | Create, submit, or delete pending reviews (APPROVE, REQUEST_CHANGES, COMMENT)       |
| `add_comment_to_pending_review`     | Add line-level comment to a pending review                                          |
| `add_reply_to_pull_request_comment` | Reply to an existing PR comment                                                     |
| `resolve_review_thread`             | Mark a review thread as resolved                                                    |
| `unresolve_review_thread`           | Mark a resolved thread as unresolved                                                |
| `subscribe_pr_activity`             | Watch a PR for comments, CI failures, reviews (live in session)                     |
| `unsubscribe_pr_activity`           | Stop watching a PR                                                                  |

### Branches & Commits (4 tools)

| Tool            | Description                                   |
| --------------- | --------------------------------------------- |
| `list_branches` | List repository branches                      |
| `create_branch` | Create a new branch                           |
| `list_commits`  | List commits on a branch (with author filter) |
| `get_commit`    | Get commit details including diff and stats   |

### Files & Content (4 tools)

| Tool                    | Description                                               |
| ----------------------- | --------------------------------------------------------- |
| `get_file_contents`     | Read file or directory contents from repo                 |
| `create_or_update_file` | Create or update a single file (requires SHA for updates) |
| `delete_file`           | Delete a file from the repo                               |
| `push_files`            | Push multiple files in a single commit                    |

### Releases & Tags (5 tools)

| Tool                 | Description                   |
| -------------------- | ----------------------------- |
| `list_releases`      | List all releases             |
| `get_latest_release` | Get the latest release        |
| `get_release_by_tag` | Get a release by tag name     |
| `list_tags`          | List git tags                 |
| `get_tag`            | Get details of a specific tag |

### Labels (1 tool)

| Tool        | Description                            |
| ----------- | -------------------------------------- |
| `get_label` | Get a specific label from a repository |

### Repositories (3 tools)

| Tool                  | Description                                      |
| --------------------- | ------------------------------------------------ |
| `create_repository`   | Create a new repository                          |
| `fork_repository`     | Fork a repository                                |
| `search_repositories` | Search repositories by name, description, topics |

### Search (3 tools)

| Tool            | Description                              |
| --------------- | ---------------------------------------- |
| `search_code`   | Search code across repositories          |
| `search_issues` | Search issues (also listed under Issues) |
| `search_users`  | Search GitHub users                      |

### Security (1 tool)

| Tool                  | Description                                    |
| --------------------- | ---------------------------------------------- |
| `run_secret_scanning` | Scan file contents or diffs for leaked secrets |

### Teams (2 tools)

| Tool               | Description                    |
| ------------------ | ------------------------------ |
| `get_teams`        | Get teams the user belongs to  |
| `get_team_members` | Get members of a specific team |

### Copilot Integration (3 tools)

| Tool                               | Description                               |
| ---------------------------------- | ----------------------------------------- |
| `assign_copilot_to_issue`          | Assign Copilot agent to work on an issue  |
| `create_pull_request_with_copilot` | Delegate a task to Copilot to create a PR |
| `get_copilot_job_status`           | Check status of a Copilot agent job       |

## Authentication

GitHub MCP tools use **OAuth** — no personal access token required. Authentication is built into Claude Code web/desktop environment. The token is managed by the platform, not stored in any config file.

## Hook Integration

The `settings.local.json` hook `require-tests-for-pr.sh` triggers on `mcp__github__create_pull_request` to enforce tests before PR creation.

## Usage Examples

```
# List open PRs
mcp__github__list_pull_requests(owner: "blogtheristo", repo: "dws6", state: "open")

# Get PR diff
mcp__github__pull_request_read(method: "get_diff", owner: "blogtheristo", repo: "dws6", pullNumber: 123)

# Create issue
mcp__github__issue_write(method: "create", owner: "blogtheristo", repo: "dws6", title: "Bug: ...", body: "...")

# Watch PR for CI and review activity
mcp__github__subscribe_pr_activity(owner: "blogtheristo", repo: "dws6", pullNumber: 123)
```
