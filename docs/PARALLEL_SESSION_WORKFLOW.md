# Parallel Session Workflow

**Enable simultaneous work on multiple recovered sessions across different platforms**

---

## Overview

The Session Coordinator allows:

- **One session** resuming in **Claude Code** (interactive, human-driven)
- **Another session** processing in **OpenCode batch** (automated, worker-driven)
- **Coordination** via locks and state tracking to prevent conflicts

All sessions run in parallel on the same repository without interfering.

---

## Quick Start

### Set Up Parallel Workflow

```bash
node scripts/session-coordinator.mjs parallel \
  copilot_deddef51-437 claude-code \
  copilot_dbab1ef1-b88 opencode
```

**Output:**

```
✅ Parallel workflow established:

📌 Session 1 → CLAUDE-CODE
   ID: copilot_deddef51-437
   Branch: kya-baseline-clean
   Events: 2463
   Duration: 7.5h

📌 Session 2 → OPENCODE
   ID: copilot_dbab1ef1-b88
   Branch: main
   Events: 2196
   Duration: 11.5h
```

---

## How It Works

### 1. Claim a Session

```bash
node scripts/session-coordinator.mjs claim <session-id> <platform>
```

**Example:**

```bash
node scripts/session-coordinator.mjs claim copilot_deddef51-437 claude-code
```

Creates a lock file and records the claim in coordinator state.

### 2. Resume on Platform

**For Claude Code:**

```bash
# Session is ready to resume in Claude Code
# You can now work interactively
git checkout kya-baseline-clean
# Continue work...
```

**For OpenCode:**

```bash
# Hand off to batch worker
node scripts/opencode-batch-worker.mjs run --batch 1 --once
```

### 3. Release When Done

```bash
node scripts/session-coordinator.mjs release <session-id> [status]
```

**Example:**

```bash
node scripts/session-coordinator.mjs release copilot_deddef51-437 COMPLETED
```

Status options: `COMPLETED`, `PAUSED`, `ARCHIVED`, `FAILED`

---

## Monitoring

### List Active Sessions

```bash
node scripts/session-coordinator.mjs list
```

**Output:**

```
=== Active Session Claims ===

copilot_deddef51-437
  Platform: claude-code
  Branch: kya-baseline-clean
  State: PROCESSING
  Claimed: 2.5min ago

copilot_dbab1ef1-b88
  Platform: opencode
  Branch: main
  State: PROCESSING
  Claimed: 1.2min ago
```

### Check Session Status

```bash
node scripts/session-coordinator.mjs status <session-id>
```

**Output:**

```
Session copilot_deddef51-437 is claimed by claude-code
Status: PROCESSING
Platform: claude-code
Branch: kya-baseline-clean
Claimed: 2026-08-27T03:22:59.944Z
```

---

## Complete Workflow

### Scenario: 2 Sessions in Parallel

```
Time  │ Claude Code Session              │ OpenCode Batch Session
──────┼─────────────────────────────────┼──────────────────────────
0:00  │ Claim copilot_deddef51-437      │
      │ (kya-baseline-clean, 2463 evt)  │
      │                                  │ Claim copilot_dbab1ef1-b88
      │                                  │ (main, 2196 evt)
──────┼─────────────────────────────────┼──────────────────────────
0:05  │ Interactive work begins         │ Batch worker starts
      │ - Review Copilot decisions      │ - Load session context
      │ - Edit & commit                 │ - Run validation
      │ - Test changes                  │ - Execute changes
──────┼─────────────────────────────────┼──────────────────────────
0:30  │ Still working                   │ Validation passed
      │                                  │ - Reached MERGE_READY
──────┼─────────────────────────────────┼──────────────────────────
1:00  │ Work complete                   │ Awaiting HIC review
      │ Release: COMPLETED              │
      │ - Changes committed             │ Release: PAUSED
      │ - PR ready                      │ - Handoff for review
──────┼─────────────────────────────────┼──────────────────────────
```

---

## Platform Capabilities

### Claude Code (Interactive)

- ✅ Human-driven work
- ✅ Code editing in real-time
- ✅ Testing and validation
- ✅ Decision-making
- ⏱️ Time: Variable (1-8 hours)

### OpenCode Batch (Automated)

- ✅ Automated processing
- ✅ Validation gates
- ✅ State machine management
- ✅ Error handling & retry
- ⏱️ Time: Fixed intervals (5-30 min per batch)

---

## Conflict Prevention

### Locking Mechanism

Each claimed session gets an exclusive lock:

```
.workflows/sessions/locks/
├── copilot_deddef51-437.lock    (Claude Code)
└── copilot_dbab1ef1-b88.lock    (OpenCode)
```

Lock contains:

- Session ID
- Claiming platform
- Acquisition timestamp

**Automatic expiry:** 24 hours (prevents stale locks)

### State Tracking

Coordinator state stored in `.workflows/sessions/coordinator-state.json`:

```json
{
  "active_claims": {
    "copilot_deddef51-437": {
      "platform": "claude-code",
      "state": "PROCESSING",
      "branch": "kya-baseline-clean",
      "claimed_at": "2026-08-27T03:22:59.944Z"
    }
  },
  "session_history": [
    {
      "session_id": "copilot_deddef51-437",
      "action": "CLAIMED",
      "platform": "claude-code",
      "timestamp": "2026-08-27T03:22:59.944Z"
    }
  ]
}
```

---

## Commands Reference

| Command    | Purpose              | Example                                  |
| ---------- | -------------------- | ---------------------------------------- |
| `claim`    | Claim a session      | `claim copilot_deddef51-437 claude-code` |
| `release`  | Release a session    | `release copilot_deddef51-437 COMPLETED` |
| `list`     | List active claims   | `list`                                   |
| `status`   | Check session status | `status copilot_deddef51-437`            |
| `parallel` | Set up 2 sessions    | `parallel s1 claude-code s2 opencode`    |

---

## Integration with Handoff System

### Resume → Develop → Handoff

```bash
# 1. Set up parallel workflow
node scripts/session-coordinator.mjs parallel \
  copilot_deddef51-437 claude-code \
  copilot_dbab1ef1-b88 opencode

# 2. In Claude Code session: work interactively
git checkout kya-baseline-clean
# ... make changes ...
git commit -m "..."

# 3. When done: release
node scripts/session-coordinator.mjs release copilot_deddef51-437 COMPLETED

# 4. In batch: watch for completion
node scripts/opencode-batch-worker.mjs status

# 5. When batch reaches MERGE_READY, review and merge
gh pr view <pr-number>
gh pr merge <pr-number>
```

---

## State Machine

```
        ┌─────────────────┐
        │   RECOVERED     │
        └────────┬────────┘
                 │
        ┌────────▼────────┐
        │     CLAIMED     │  (exclusive lock acquired)
        └────────┬────────┘
                 │
        ┌────────▼────────┐
        │   PROCESSING    │  (work in progress on platform)
        └────┬──────────┬─┘
             │          │
      ┌──────▼──┐  ┌───▼──────┐
      │ PAUSED  │  │ COMPLETED│
      └──────┬──┘  └───┬──────┘
             │          │
             └──────┬───┘
                    │
             ┌──────▼──────┐
             │  ARCHIVED   │  (lock released)
             └─────────────┘
```

---

## Troubleshooting

### "Session already claimed"

Session lock still held by another platform. Check:

```bash
node scripts/session-coordinator.mjs status <session-id>
```

If stale (>24h old), locks auto-expire. Or manually release:

```bash
node scripts/session-coordinator.mjs release <session-id> PAUSED
```

### "Session file not found"

Run recovery first:

```bash
node scripts/recover-copilot-sessions.mjs
```

### Monitoring Locks

```bash
ls -la .workflows/sessions/locks/
cat .workflows/sessions/coordinator-state.json
```

---

## Next Steps

1. **Set up parallel workflow:**

   ```bash
   node scripts/session-coordinator.mjs parallel \
     copilot_deddef51-437 claude-code \
     copilot_dbab1ef1-b88 opencode
   ```

2. **Start Claude Code session** (interactive work)

3. **Start OpenCode batch** (automated processing)

4. **Monitor progress:**

   ```bash
   node scripts/session-coordinator.mjs list
   ```

5. **Release when done:**
   ```bash
   node scripts/session-coordinator.mjs release copilot_deddef51-437 COMPLETED
   ```

---

## Key Benefits

- ✅ **Parallel processing** — two sessions running simultaneously
- ✅ **No conflicts** — locking prevents race conditions
- ✅ **Independent workflows** — each platform operates autonomously
- ✅ **State tracking** — full audit trail of who did what when
- ✅ **Flexible** — switch between PROCESSING, PAUSED, COMPLETED
- ✅ **Recoverable** — locks auto-expire after 24h
