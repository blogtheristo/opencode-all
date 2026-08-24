# CLI for Agents — Design Patterns

***
# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:
  - Version: 1.0 | Tool: Claude Code (Opus 4.6) | Session: claude/update-dws-cli-8DAJh | Date: 26.03.2026 | Changes: Initial creation — CLI design patterns for agent-friendly CLIs, based on Eric Zakariasson's recommendations, with DWS CLI audit

Session Links & References:
  - Source: https://x.com/ericzakariasson/status/2036762680401223946
  - Claude Code (claude/update-dws-cli-8DAJh): https://github.com/blogtheristo/dws6/tree/claude/update-dws-cli-8DAJh

Document Status:
  - Created: 26.03.2026
  - Last Modified: 26.03.2026
  - Language: English
  - Publication Status: ACTIVE

***

**Type:** Field Note / Design Reference
**Author:** Eric Zakariasson (source), compiled by Claude Code
**Scope:** DWS CLI (`cli/src/cli.ts`) and all future CLI tooling

---

## Context

Most CLIs were built assuming a human is at the keyboard. Agents get stuck on interactive prompts, can't parse help pages without examples, and struggle with unpredictable output. These patterns make CLIs work better for agents.

Source: Eric Zakariasson (@ericzakariasson), 25 March 2026.

---

## The 11 Patterns

### 1. Make It Non-Interactive

Every input should be passable as a flag. Interactive mode is a fallback when flags are missing, not the primary path.

```bash
# BAD — blocks an agent
$ mycli deploy
? Which environment? (use arrow keys)

# GOOD — works for agents
$ mycli deploy --env staging
```

### 2. Progressive Help Discovery

Don't dump all docs upfront. Agent runs `mycli`, sees subcommands, picks one, runs `mycli deploy --help`, gets what it needs. No wasted context on commands it won't use.

### 3. Useful --help with Examples

Every subcommand gets a `--help`, and every `--help` includes examples. Examples do most of the work — agents pattern-match off concrete invocations faster than reading descriptions.

```bash
$ mycli deploy --help
Options:
  --env     Target environment (staging, production)
  --tag     Image tag (default: latest)
  --force   Skip confirmation

Examples:
  mycli deploy --env staging
  mycli deploy --env production --tag v1.2.3
  mycli deploy --env staging --force
```

### 4. Accept Flags and Stdin for Everything

Agents think in pipelines. They want to chain commands and pipe output between tools. Don't require positional args in weird orders.

```bash
cat config.json | mycli config import --stdin
mycli deploy --env staging --tag $(mycli build --output tag-only)
```

### 5. Fail Fast with Actionable Errors

If a required flag is missing, don't hang. Error immediately and show the correct invocation. Agents self-correct when given something to work with.

```bash
Error: No image tag specified.
  mycli deploy --env staging --tag <image-tag>
  Available tags: mycli build list --output tags
```

### 6. Make Commands Idempotent

Agents retry constantly — network timeouts, context getting lost mid-task. Running the same command twice should return "already done, no-op", not create a duplicate.

### 7. Add --dry-run for Destructive Actions

Agents should be able to preview what a deploy or deletion would do before committing.

```bash
$ mycli deploy --env production --tag v1.2.3 --dry-run
Would deploy v1.2.3 to production
  - Stop 3 running instances
  - Pull image registry.io/app:v1.2.3
  - Start 3 new instances
No changes made.
```

### 8. --yes / --force to Skip Confirmations

Humans get "are you sure?" and agents pass `--yes` to bypass it. Safe path is the default but allow bypassing.

### 9. Predictable Command Structure

If an agent learns `mycli service list`, it should be able to guess `mycli deploy list` and `mycli config list`. Pick a pattern (resource + verb) and use it everywhere.

### 10. Return Data on Success

Show the deploy ID and the URL. Structured output, not just emojis.

```bash
deployed v1.2.3 to staging
url: https://staging.myapp.com
deploy_id: dep_abc123
duration: 34s
```

### 11. JSON Output Mode

When piped or with `--json` flag, output structured JSON instead of human-friendly formatting.

---

## DWS CLI Audit Against These Patterns

Current CLI: `cli/src/cli.ts` (v1.1.0, zero dependencies)

| # | Pattern | DWS CLI Status | Notes |
|---|---------|---------------|-------|
| 1 | Non-interactive | PASS | All commands use flags, `dws init` is the only interactive command (acceptable as setup wizard) |
| 2 | Progressive help | PASS | `dws` shows subcommands, `dws <cmd> --help` shows details |
| 3 | --help with examples | PASS | Every subcommand has `--help` with examples (v1.2.0) |
| 4 | Flags + stdin | PASS | Supports `--stdin`, `--input`, piping between commands |
| 5 | Actionable errors | PASS | All errors include correct invocation hints (v1.2.0) |
| 6 | Idempotent commands | PASS | Read-only commands are naturally idempotent; `run` commands are stateless |
| 7 | --dry-run | PASS | Added for `run`, `workflow`, `kya snap` (v1.2.0) |
| 8 | --yes / --force | PASS | Added for `kya snap`; confirmation gate on destructive actions (v1.2.0) |
| 9 | Predictable structure | PARTIAL | Mix of `dws <resource>` and `dws <verb> <resource>` — e.g., `dws agents` vs `dws run <name>` |
| 10 | Return data on success | PASS | Commands return structured results with IDs, scores, URLs |
| 11 | JSON output | PASS | Auto-detects TTY vs pipe; `--json` flag available |

### Implemented in v1.2.0 (PR this session)

1. **Per-subcommand --help with examples** — 17 subcommands, each with Options + Examples sections
2. **Actionable error messages** — Every error includes hint with correct invocation
3. **--dry-run** — For `dws run`, `dws workflow`, `dws kya snap` — shows preview without executing
4. **--yes / --force** — Skips confirmation on `dws kya snap`; confirmation gate added for destructive actions
5. **dws help <command>** — `dws help run` works alongside `dws run --help`

### Remaining (v1.3.0 candidates)

1. **Standardize command structure** — Consider `dws agent list` / `dws agent run <name>` resource+verb pattern
2. **--dry-run for sovereignty-assess** — Lower priority (read-only assessment)

### Existing Strengths (Already Aligned)

- Zero dependencies (pure Node.js)
- JSON-native output (auto-detect TTY)
- Stdin support (`--stdin` flag)
- Pipeline-friendly (`dws discover | dws run --first`)
- Environment variable configuration (no interactive config required)
- Structured error output

---

## Related Files

- `cli/src/cli.ts` — Main CLI implementation
- `cli/src/format.ts` — Output formatting (colors, tables, spinners)
- `cli/package.json` — Package config with `bin` entry
- `CLAUDE.md` — "Build for Agents" section (CLI requirement rule)
- `AGENTS.md` — Agent registry and CLI integration
