# CI/CD Auto-Enable-Mode Integration

***
# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:
  - Version: 1.0 | Tool: Claude Code (Opus 4.6) | Session: claude/auto-mode-cicd-headless-e1tyZ | Date: 07.03.2026 | Changes: Initial creation — CI/CD headless integration with session handover for Claude Code auto-enable-mode

Session Links & References:
  - Claude Code (claude/auto-mode-cicd-headless-e1tyZ): https://claude.ai/code/session_01P4M8ExCYtjP7GPP4TeFs2n

Document Status:
  - Created: 07.03.2026
  - Last Modified: 07.03.2026
  - Language: English
  - Publication Status: ACTIVE

***

**Version:** 1.0
**Effective Date:** 2026-03-07
**Last Updated:** 2026-03-07
**Status:** Active

---

## Table of Contents

1. [Overview](#1-overview)
2. [Workflows](#2-workflows)
3. [Required Secrets](#3-required-secrets)
4. [Cost Estimates and Budget Guardrails](#4-cost-estimates-and-budget-guardrails)
5. [Session Handover Protocol](#5-session-handover-protocol)
6. [Audit Logging (EU AI Act)](#6-audit-logging-eu-ai-act)
7. [Troubleshooting](#7-troubleshooting)

---

## 1. Overview

This document describes the CI/CD integration for Claude Code's **auto-enable-mode** in the DWS6 repository. Auto-enable-mode allows Claude Code to run headlessly in GitHub Actions, performing automated code fixes and PR reviews without human interaction during execution.

### Architecture

```
PR opened/updated
    |
    v
+-------------------+     +--------------------+
| claude-auto-fix   |     | claude-review      |
| (fixes lint/test) |     | (reviews PR diff)  |
+-------------------+     +--------------------+
    |                           |
    v                           v
  Commit fixes              Post PR comment
  [skip ci]                 with review
```

### Key Principles

- **Headless execution** — No interactive prompts; all input via workflow inputs or defaults.
- **Sandboxed tools** — Only explicitly allowed tools can be used (`--allowedTools`).
- **Livelock prevention** — Bot commits use `[skip ci]` to prevent re-triggering.
- **Audit trail** — All tool executions logged for EU AI Act Article 12 compliance.

---

## 2. Workflows

### 2.1 Claude Auto-Fix (`claude-auto-fix.yml`)

**Trigger:** PR opened/synchronized, or manual `workflow_dispatch`.

**What it does:**
1. Checks out the PR branch
2. Installs dependencies
3. Runs Claude Code with a specified task (default: fix ESLint errors)
4. Commits any changes back to the PR branch with `[skip ci]`

**Manual trigger inputs:**

| Input | Default | Description |
|-------|---------|-------------|
| `task` | "Fix all ESLint errors and run tests" | The task for Claude to perform |
| `allowed_tools` | "Read,Edit,Bash(npm run lint),Bash(npm run test)" | Comma-separated tool allowlist |

**Usage:**
- **Automatic:** Opens on every PR — fixes lint errors automatically.
- **Manual:** Go to Actions > Claude Auto-Fix > Run workflow > specify task.

### 2.2 Claude PR Review (`claude-review.yml`)

**Trigger:** PR opened or marked ready for review.

**What it does:**
1. Generates a diff between the PR branch and base branch
2. Sends the diff to Claude for security, quality, and standards review
3. Posts the review as a PR comment

**Review focus areas:**
- Security issues (hardcoded secrets, XSS, injection)
- Code quality (types, error handling)
- DWS6 standard compliance

---

## 3. Required Secrets

Configure these in GitHub repository Settings > Secrets and variables > Actions:

| Secret | Required | Description |
|--------|----------|-------------|
| `ANTHROPIC_API_KEY` | Yes | Anthropic API key for Claude Code CLI |
| `GITHUB_TOKEN` | Auto | Provided by GitHub Actions (no setup needed) |

**Security notes:**
- Never log or echo the `ANTHROPIC_API_KEY`.
- Use a dedicated API key with spending limits for CI/CD usage.
- Rotate the key quarterly per `DWS_SECURITY_STANDARD.md`.

---

## 4. Cost Estimates and Budget Guardrails

### Estimated Costs

| Workflow | Trigger Frequency | Est. Tokens/Run | Est. Cost/Run |
|----------|-------------------|-----------------|---------------|
| Auto-Fix | Per PR push | ~10K-50K | $0.05-$0.50 |
| PR Review | Per PR open | ~5K-20K | $0.03-$0.20 |

### Budget Guardrails

1. **Timeout limits** — Auto-Fix: 10 min, PR Review: 5 min. Claude is killed if exceeded.
2. **Diff size cap** — PR diffs truncated to 60KB to prevent token explosion.
3. **Skip CI** — Auto-Fix commits include `[skip ci]` to prevent cascading runs.
4. **Bot exclusion** — Both workflows skip when triggered by bot actors.
5. **API key spending limit** — Set a monthly budget on the Anthropic API key (recommended: $50/month for CI/CD).
6. **Concurrency** — GitHub Actions concurrency groups can limit parallel runs per PR.

### Monitoring

- Check GitHub Actions billing: Settings > Billing > Actions.
- Check Anthropic API usage: console.anthropic.com > Usage.
- Set up Anthropic usage alerts at 80% of monthly budget.

---

## 5. Session Handover Protocol

The `scripts/claude-session-handover.sh` script generates a continuation prompt for resuming work in a new Claude Code session.

### Usage

```bash
# Use current branch
./scripts/claude-session-handover.sh

# Specify a branch
./scripts/claude-session-handover.sh claude/feature-branch
```

### What It Does

1. Detects the current branch and last commit
2. Looks up any associated PR via `gh pr view`
3. Checks for uncommitted changes and offers to commit them
4. Lists recently modified files
5. Outputs a ready-to-paste handover prompt

### Output Format

```
JATKA EDELLISTÄ SESSIOTA / CONTINUE PREVIOUS SESSION
Branch: claude/feature | Commit: abc1234 — feat: add feature | PR: https://github.com/...
Done: [fill in] | Remaining: [fill in] | Files: src/app.ts, src/routes.ts
Start: git pull origin claude/feature
```

### Integration with CI/CD

When a CI/CD workflow fails or needs manual continuation:
1. Run `./scripts/claude-session-handover.sh` locally
2. Fill in the "Done" and "Remaining" fields
3. Paste into a new Claude Code session to continue

---

## 6. Audit Logging (EU AI Act)

### EU AI Act Article 12 — Record-Keeping

The PostToolUse audit hook (`.claude/hooks/postooluse-audit.sh`) logs every tool execution during Claude Code sessions for compliance with EU AI Act Article 12 transparency requirements.

### Log Format

Logs are written as JSONL to `.claude/hooks/audit/YYYY-MM-DD.jsonl`:

```json
{"timestamp":"2026-03-07T10:30:00Z","tool":"Edit","session":"local","branch":"claude/feature","mode":"auto-enable"}
```

### Fields

| Field | Description |
|-------|-------------|
| `timestamp` | UTC ISO 8601 timestamp |
| `tool` | Tool name (Read, Edit, Bash, etc.) |
| `session` | Claude session ID or "local" |
| `branch` | Git branch at time of execution |
| `mode` | Execution mode (auto-enable, interactive) |

### Retention

- Audit logs are gitignored (`.claude/hooks/audit/` is local-only).
- For production compliance, forward logs to a centralized logging system (e.g., Supabase, Google Cloud Logging).
- Recommended retention: 12 months per EU AI Act requirements.

### Gitignore

Ensure `.gitignore` includes:
```
.claude/hooks/audit/
```

---

## 7. Troubleshooting

### Workflow Does Not Trigger

- Verify `ANTHROPIC_API_KEY` is set in repository secrets.
- Check that the PR is not from a bot actor (excluded by `if` conditions).
- For auto-fix: ensure the commit message does not contain `[skip ci]`.

### Claude Output Is Empty

- Check the workflow logs for stderr output.
- The `claude-output.json` or `review-output.json` may contain error details.
- Common cause: API key is invalid or has reached its spending limit.

### Auto-Fix Creates No Commit

- Claude may have found no issues to fix — this is expected behavior.
- Check `git status --porcelain` output in the workflow logs.

### Review Comment Is "Review parse error"

- The JSON output from Claude may not have the expected `.result` field.
- Check `review-output.json` in the workflow logs for the raw output.
- This can happen if Claude hits the timeout before producing output.

### Cost Overruns

1. Reduce timeout limits in the workflow files.
2. Lower the diff size cap (currently 60KB).
3. Restrict auto-fix to `workflow_dispatch` only (remove the `pull_request` trigger).
4. Set a lower spending limit on the Anthropic API key.

---

*This document follows the DWS Document Standard v1.7.*
