# Admin Manual — opencode-all (Living Engine)

***

# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:

- Version: 1.0 | Tool: OpenCode (Investor Deck V6 session) | Session: opencode-all-admin-manual | Date: 05.09.2026 | Changes: Initial creation. Documents the opencode-all batch processing system: architecture, queue lifecycle, batch worker operations, tmux launcher, evidence tooling, DGX Spark deployment, troubleshooting, and the DWS Engineering Standard (DDM-v1) policy layer.

Session Links & References:

- Field note (runtime): `docs/field-notes/2026-08-24-opencode-all-living-engine.md`
- Engineering standard: `DWS_ENGINEERING_STANDARD.md`
- Run summary: `opencode-all-summary.md`
- View on GitHub: https://github.com/blogtheristo/dws6/blob/main/Admin/ADMIN_MANUAL_OPENCODE_ALL.md

Document Status:

- Created: 05.09.2026
- Last Modified: 05.09.2026
- Language: English
- Publication Status: ACTIVE

***

## Table of Contents

1. [System Overview](#1-system-overview)
2. [Architecture](#2-architecture)
3. [Components](#3-components)
4. [Queue Lifecycle](#4-queue-lifecycle)
5. [Batch Worker Operations](#5-batch-worker-operations)
6. [Tmux Launcher](#6-tmux-launcher)
7. [Session Migration](#7-session-migration)
8. [Evidence Tooling](#8-evidence-tooling)
9. [DGX Spark Deployment](#9-dgx-spark-deployment)
10. [Policy Layer — DWS Engineering Standard](#10-policy-layer--dws-engineering-standard)
11. [Troubleshooting](#11-troubleshooting)
12. [File Reference](#12-file-reference)

---

## 1. System Overview

**opencode-all** is a batch processing and autonomous agent execution system — a self-hosted "Living Engine" that runs, queues, monitors, and restarts OpenCode coding sessions at scale. It manages a queue of AI agent sessions, each in an isolated git worktree, and cycles them through a pipeline of detection, execution, handoff, and review.

**Purpose:** Run autonomous 48-hour development cycles on the DGX Spark with mandatory audit gates, restart-safe state, and human-in-the-loop boundaries.

**Technology stack:**

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Runtime | OpenCode ACP (Agent Client Protocol) | Session execution via stdio |
| Inference | DGX Spark (Qwen 3 Coder primary, Claude fallback) | Local sovereign LLM inference |
| Isolation | Git worktrees | Per-session code isolation |
| Orchestration | Node.js batch worker (`opencode-batch-worker.mjs`) | Queue management, session resumption |
| State | JSONL files → Supabase (migration ready) | Session queue, lifecycle log |
| Terminal | tmux | Multi-session monitoring |
| Policy | DWS Engineering Standard (DDM-v1) | Audit gates, retry logic, human boundaries |

**Submodule:** `opencode-all/` points to `https://github.com/blogtheristo/opencode-all.git` (fork of `anomalyco/opencode`).

**Version:** 1.18.29 (all packages).

---

## 2. Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    OPENCODE-ALL LIVING ENGINE                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐       │
│  │   DETECT     │───▶│    QUEUE     │───▶│   EXECUTE    │       │
│  │  (enqueue)   │    │ (queue.jsonl)│    │  (run batch) │       │
│  └──────────────┘    └──────────────┘    └──────┬───────┘       │
│                                                   │               │
│                                                   ▼               │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐       │
│  │   REVIEW     │◀───│   HANDOFF    │◀───│  WORKTREE    │       │
│  │  (human)     │    │  (guaranteed)│    │  (isolated)  │       │
│  └──────────────┘    └──────────────┘    └──────────────┘       │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                  LIFECYCLE LOG                            │   │
│  │  [OPENCODE-ALL]:<STATE>:<session>:<timestamp>            │   │
│  │  States: rest | in-use | updating | fixing               │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

**Data flow:**

1. **Detect** — `enqueue` scans for halted sessions (Claude Code, Copilot, or OpenCode) and writes them to `queue.jsonl` with state `QUEUED`.
2. **Isolate** — Each session gets its own git worktree at `.worktrees/opencode-all/<session-id>`.
3. **Execute** — `run --batch N` picks N sessions, resumes them via ACP `session/load` + `session/prompt`, instructing them to finish work and write a handoff file.
4. **Handoff** — Worker guarantees a handoff file exists (fallback: `Status: NEEDS-HUMAN`). Sessions transition to `MERGE_READY` or `FAILED`.
5. **Review** — `opencode-open-all.sh` opens finishing sessions in tmux windows for human review.
6. **Lifecycle** — Engine states tracked with `[OPENCODE-ALL]:STATE:session:timestamp` signals to `lifecycle.jsonl`.

---

## 3. Components

### 3.1 Batch Worker

**File:** `scripts/opencode-batch-worker.mjs` (1431 lines)

**Commands:**

| Command | Description |
|---------|-------------|
| `enqueue` | Detects halted sessions, builds `queue.jsonl` |
| `run --batch N --loop` | Resumes N sessions via ACP, loops until queue empty |
| `run --batch N --lifetime-days 30` | Sets engine lifetime horizon |
| `status` | Shows queue summary (QUEUED / IN_PROGRESS / DONE / FAILED) |
| `lifecycle` | Shows state transition log |

**ACP interface:** Communicates with `opencode acp` via stdio. Uses `session/load` to resume sessions and `session/prompt` to send continuation instructions.

**Handoff guarantee:** If a session does not produce a handoff file, the worker creates one with `Status: NEEDS-HUMAN`. This ensures every session has a reviewable output.

### 3.2 Tmux Launcher

**File:** `scripts/opencode-open-all.sh`

**Commands:**

| Flag | Description |
|------|-------------|
| `--dry-run` | Show what would be opened without opening |
| `--max N` | Limit number of windows opened |
| `--pick <session-id>` | Open specific session only |
| `--kill` | Kill all opencode tmux windows |
| `--status` | Show tmux window status |
| `--watch` | Auto-refresh status every 30s |
| `--auto` | Auto-open sessions needing continuation |

**State:** Stored in `~/.local/state/opencode-all`.

### 3.3 Session Migrators

| Script | Source | Description |
|--------|--------|-------------|
| `scripts/claude-sessions-to-opencode.mjs` | Claude Code JSONL (`~/.claude/projects/`) | Converts Claude Code sessions to OpenCode format |
| `scripts/copilot-sessions-to-opencode.mjs` | Copilot CLI DB (`~/.copilot/session-store.db`) | Converts Copilot sessions with PR/issue state map |

**Idempotency:** Both converters use deterministic session IDs from source UUIDs. Re-running does not create duplicates.

### 3.4 Evidence Tooling

| Script | Purpose |
|--------|---------|
| `scripts/evidence-audit.mjs` | Fails when code files lack `// Evidence:` header |
| `scripts/evidence-stamp.mjs` | Stamps artifacts with provenance; refuses thesis files |

### 3.5 Queue & State Files

| File | Format | Purpose |
|------|--------|---------|
| `.workflows/opencode-all/queue.jsonl` | JSONL | Session queue (id, title, state, attempts, worktreePath, branch) |
| `.workflows/opencode-all/lifecycle.jsonl` | JSONL | State transitions |
| `.workflows/opencode-all/engine.json` | JSON | Engine config (start time, lifetime) |
| `.workflows/opencode-all/review-manifest.jsonl` | JSONL | Review tracking |

---

## 4. Queue Lifecycle

### 4.1 Session States

```
QUEUED ──▶ IN_PROGRESS ──▶ MERGE_READY ──▶ (human review) ──▶ MERGED
   │              │              │
   │              ▼              ▼
   │           FAILED        NEEDS-HUMAN
   │              │              │
   └──────────────┴──────────────┘
              (retry ≤ 3)
```

| State | Meaning |
|-------|---------|
| `QUEUED` | Session detected, awaiting execution |
| `IN_PROGRESS` | Worker has resumed the session |
| `MERGE_READY` | Handoff produced, awaiting human review |
| `MERGED` | Human reviewed and merged |
| `FAILED` | Error after retry exhaustion |
| `NEEDS-HUMAN` | Requires manual intervention |

### 4.2 Engine States

| State | Meaning |
|-------|---------|
| `rest` | No sessions running |
| `in-use` | Sessions executing |
| `updating` | Engine code being updated |
| `fixing` | Recovery from failure |

Transitions logged as: `[OPENCODE-ALL]:<STATE>:<session>:<timestamp>`

### 4.3 Engine Lifetime

- Default: **30 days** from start date
- Stored in `engine.json`: `{"started":"2026-08-24T03:20:41.641Z","lifetimeDays":30}`
- Deadline: ~2026-09-23
- On expiry: engine stops accepting new sessions; existing sessions complete normally

---

## 5. Batch Worker Operations

### 5.1 Enqueue

```bash
cd /home/admin100/dws6
node scripts/opencode-batch-worker.mjs enqueue
```

Scans for halted sessions from:
- Claude Code (`~/.claude/projects/`)
- Copilot CLI (`~/.copilot/session-store.db`)
- OpenCode (local sessions)

Writes to `queue.jsonl` with state `QUEUED`. Preserves existing queue states (idempotent).

### 5.2 Run

```bash
# Run batch of 3 sessions
node scripts/opencode-batch-worker.mjs run --batch 3

# Run in loop mode (continues until queue empty)
node scripts/opencode-batch-worker.mjs run --batch 3 --loop

# Set lifetime
node scripts/opencode-batch-worker.mjs run --batch 3 --lifetime-days 30
```

**Per-session flow:**
1. Load session via ACP `session/load`
2. Send prompt via ACP `session/prompt` instructing agent to finish work
3. Wait for completion or timeout
4. Check for handoff file
5. If no handoff: create fallback with `Status: NEEDS-HUMAN`
6. Transition state to `MERGE_READY` or `FAILED`

### 5.3 Status

```bash
node scripts/opencode-batch-worker.mjs status
```

Shows: total sessions, by-state counts, active sessions, failed sessions.

### 5.4 Lifecycle

```bash
node scripts/opencode-batch-worker.mjs lifecycle
```

Shows state transitions from `lifecycle.jsonl`.

---

## 6. Tmux Launcher

### 6.1 Open Sessions

```bash
# Open all sessions needing continuation
./scripts/opencode-open-all.sh

# Dry run
./scripts/opencode-open-all.sh --dry-run

# Limit to 5 windows
./scripts/opencode-open-all.sh --max 5

# Open specific session
./scripts/opencode-open-all.sh --pick ses_004c81d90ffe0457NK6HHNCaYu
```

### 6.2 Monitor

```bash
# Status
./scripts/opencode-open-all.sh --status

# Watch mode (auto-refresh)
./scripts/opencode-open-all.sh --watch
```

### 6.3 Kill

```bash
./scripts/opencode-open-all.sh --kill
```

Kills all opencode-related tmux windows.

---

## 7. Session Migration

### 7.1 Claude Code → OpenCode

```bash
node scripts/claude-sessions-to-opencode.mjs
```

- Reads `~/.claude/projects/` JSONL transcripts
- Converts to OpenCode import format
- Imports via `opencode import`
- Deterministic IDs from source UUIDs (idempotent)
- Empty transcripts skipped

### 7.2 Copilot → OpenCode

```bash
node scripts/copilot-sessions-to-opencode.mjs
```

- Reads `~/.copilot/session-store.db`
- Applies reviewed PR/issue state map from `.workflows/opencode-all/copilot-resolution.json`
- Merged-PR sessions imported as completed historical context (not queueable)
- Open-issue sessions remain queueable
- Greetings, navigation, help excluded

---

## 8. Evidence Tooling

### 8.1 Evidence Audit

```bash
node scripts/evidence-audit.mjs <paths...>
```

Reports files missing `// Evidence:` header. Accepts `//` and `#` comment prefixes. Fails CI-style (non-zero exit) when files lack the header.

### 8.2 Evidence Stamp

```bash
node scripts/evidence-stamp.mjs <paths...>
```

Stamps code/markdown/HTML artifacts with provenance header:
```
// Evidence: Tool=OpenCode 1.18.29 Model=<provider/model-id> Agent=<agent-name> Date=YYYY-MM-DD
// Audit trail: git log -- <this-file>
```

**Refuses thesis files** (RED zone) unless `--force-thesis` flag is passed.

---

## 9. DGX Spark Deployment

### 9.1 Hardware

| Component | Specification |
|-----------|--------------|
| Platform | Acer Veriton GN100 (DGX Spark) |
| Superchip | NVIDIA GB10 |
| Memory | 128 GB LPDDR5x |
| Inference | 1 PFLOPS FP4 |
| Storage | Local NVMe |

### 9.2 Runtime

- **Primary:** OpenCode with DGX Spark Ollama tunnel
- **Inference:** Qwen 3 Coder (primary), Claude (fallback via LiteLLM)
- **Model budget:** Max 2 models loaded concurrently (VRAM constraint)
- **Network:** `--network none` per container (sovereignty)

### 9.3 Docker Isolation

Per-tenant/agent Docker containers via Dockerode:
- Isolated file systems
- No network access by default
- Container lifecycle managed by `infrastructure/dgx-spark/docker-compose.yml`
- Heartbeat monitoring for zombie cleanup

### 9.4 Cron Jobs

- 31 daily jobs
- 16 weekly jobs
- Managed via `cron` / `ollama-spark` skills

---

## 10. Policy Layer — DWS Engineering Standard

The DWS Engineering Standard (`DWS_ENGINEERING_STANDARD.md`) is the policy layer governing autonomous development. It defines:

### 10.1 Cycle Model

- Bounded **48-hour runs** per session
- Mandatory audit gates (7 gates per cycle)
- Second-pass critic for quality assurance

### 10.2 Mandatory Audit Gates

| Gate | Check |
|------|-------|
| 1. Scope | Does the diff match the task? |
| 2. Compile | Does the code compile? |
| 3. Behavioral | Do tests pass? |
| 4. Diff | Is the diff minimal and correct? |
| 5. Contract | Are API contracts preserved? |
| 6. Provenance | Is the Evidence header present? |
| 7. Human | Does this need HIC approval? |

### 10.3 NEEDS-HUMAN Boundaries

Sessions must stop and request human intervention when:
- Task scope exceeds original specification
- Security-sensitive code is involved
- Public-facing content is modified
- Legal/compliance implications exist
- Model confidence is low

### 10.4 Retry & Stop Conditions

- **Max retries:** 3 per session
- **Stop on:** 3 consecutive failures, scope creep, or human boundary hit
- **Escalation:** FAILED sessions logged, human notified

---

## 11. Troubleshooting

### 11.1 Common Failures

| Error | Cause | Resolution |
|-------|-------|------------|
| `Internal error: OpenCode service failure` | ACP connection or inference timeout | Check DGX Spark status; restart `opencode acp`; verify model availability |
| `Worktree path not found` | Git worktree deleted or corrupted | Re-create worktree: `git worktree add .worktrees/opencode-all/<session-id> <branch>` |
| `session/prompt timeout` | Agent taking too long | Increase timeout; check VRAM budget; reduce batch size |
| `Queue stalled` (no progress) | Worker not running or ACP blocked | Check tmux; restart worker; verify `opencode acp` responds |
| `Handoff file missing` | Agent did not produce handoff | Worker creates fallback NEEDS-HUMAN; check agent logs |

### 11.2 Resource Contention

**Symptom:** Sessions timing out, slow inference.

**Diagnosis:**
```bash
# Check VRAM usage
nvidia-smi

# Check running models
ollama list

# Check tmux windows
tmux list-windows -t dws6
```

**Resolution:**
- Reduce `--batch` size (e.g., from 5 to 2)
- Kill unused tmux windows
- Restart Ollama if models are stuck

### 11.3 Queue Recovery

```bash
# Check queue state
node scripts/opencode-batch-worker.mjs status

# Re-enqueue failed sessions
node scripts/opencode-batch-worker.mjs enqueue

# Force re-run specific session
# Edit queue.jsonl: set state to QUEUED, reset attempts to 0
```

### 11.4 tmux Window Deaths

**Symptom:** tmux windows disappear mid-session.

**Causes:**
- SIGKILL from OOM killer (check `dmesg`)
- tmux server crash
- Session timeout exceeded

**Resolution:**
- Check `dmesg | tail -20` for OOM
- Increase tmux timeout: `tmux set-option -g remain-on-exit on`
- Restart tmux server: `tmux kill-server && tmux new-session -d -s dws6`

---

## 12. File Reference

### 12.1 Core Files

| File | Purpose |
|------|---------|
| `scripts/opencode-batch-worker.mjs` | Living Engine — batch worker |
| `scripts/opencode-open-all.sh` | tmux launcher |
| `scripts/claude-sessions-to-opencode.mjs` | Claude Code session migrator |
| `scripts/copilot-sessions-to-opencode.mjs` | Copilot session migrator |
| `scripts/evidence-audit.mjs` | Evidence header checker |
| `scripts/evidence-stamp.mjs` | Evidence header stamper |
| `DWS_ENGINEERING_STANDARD.md` | Policy layer (DDM-v1) |

### 12.2 State Files

| File | Purpose |
|------|---------|
| `.workflows/opencode-all/queue.jsonl` | Session queue |
| `.workflows/opencode-all/lifecycle.jsonl` | State transitions |
| `.workflows/opencode-all/engine.json` | Engine config |
| `.workflows/opencode-all/review-manifest.jsonl` | Review tracking |
| `opencode-all-summary.md` | Run summary |

### 12.3 Documentation

| File | Purpose |
|------|---------|
| `docs/field-notes/2026-08-24-opencode-all-living-engine.md` | Field note — initial build |
| `docs/OPENCODE_SESSION_STATE_MIGRATION.md` | JSONL → Supabase migration guide |
| `docs/Deputy-Agents-Architecture.md` | Container isolation architecture |
| `opencode-all/AGENTS.md` | Upstream agent guidelines |

### 12.4 External References

| Resource | URL |
|----------|-----|
| Fork repository | https://github.com/blogtheristo/opencode-all |
| Upstream repository | https://github.com/anomalyco/opencode |
| OpenCode documentation | https://opencode.ai |
| DWS Engineering Standard | `DWS_ENGINEERING_STANDARD.md` |

---

**Document Version:** 1.0
**Created:** September 5, 2026
**Owner:** Lifetime Oy
**Classification:** Internal
