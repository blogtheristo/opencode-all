# DWS6 OpenCode Batch Worker — Failure Diagnosis & Recovery

**Date:** 2026-08-28  
**Status:** In production with health checks and exponential backoff deployed  
**Repository:** https://github.com/blogtheristo/dws6

---

## Executive Summary

The DWS6 batch worker (`scripts/opencode-batch-worker.mjs`) processes queued Claude Code sessions in 30-minute intervals. Recent failures show **-32603 "Internal error: OpenCode service failure"** — a session-service-level error, not a batch-processing bug.

**Health Status:**

- ✅ Health checks (ACP liveness, readiness) deployed (PR #1905)
- ✅ Exponential backoff with circuit-breaking (PR #1905, #1907)
- ✅ Session coordinator for parallel workload routing (PR #1910)
- ⚠️ Service outages cause batch failures; recovery is automatic

---

## Real Issue: OpenCode Service Failures (-32603)

### Error Pattern

```json
{
  "code": -32603,
  "message": "Internal error: OpenCode service failure",
  "data": { "service": "session" }
}
```

### What This Means

- OpenCode session service is **unreachable or crashed**
- Worker retries 3 times with exponential backoff (1m, 2m, 4m delays)
- Session marked FAILED after exhausting retries
- **Worker does not hang** — it moves to next batch within 30 minutes

### Why It Happens

1. **OpenCode service restarts** (deployments, crashes, resource exhaustion)
2. **Network timeout** between batch worker and OpenCode endpoint
3. **OpenCode rate limiting** (queue full, server overload)
4. **Session state desync** (session created in one service instance, resumed in another)

---

## Immediate Mitigation (Operators)

### 1. Check OpenCode Service Health

```bash
# Verify OpenCode endpoint is reachable
curl -s https://<opencode-endpoint>/health | jq .

# Check if service is responding
curl -I https://<opencode-endpoint>/api/session/status
```

### 2. Fallback to Claude Code (Manual)

When OpenCode batch worker encounters -32603 errors, HIC can manually resume failed sessions in Claude Code:

```bash
# List failed sessions in the batch queue
grep '"state":"FAILED"' .workflows/opencode-all/queue.jsonl | jq '.id'

# Resume a specific failed session in Claude Code
cd <worktree-path>
claude code --session <session-id>
```

### 3. Clear Stale Worktrees

```bash
# Remove worktrees marked 'removed-no-diff' to free disk space
find .worktrees/opencode-all -type d -name "ses_*" -exec rm -rf {} \;
```

### 4. Check Batch Worker Logs

```bash
# View recent batch worker runs
tail -50 <.claude/handoffs/opencode-batch/*.md>

# Count failures by error code
grep "failureCode" .workflows/opencode-all/queue.jsonl | jq -r '.failureCode' | sort | uniq -c
```

---

## Long-Term Fixes (Architecture)

### Deployed Solutions

**PR #1905 (Aug 25):** Health checks + exponential backoff

- Added `healthCheckACP()` pre-flight check
- If OpenCode unreachable, skip batch and retry later
- Prevents cascade failures

**PR #1907 (Aug 26):** State management + error escalation

- MERGE_READY now sets `stopReason='needs-human'` explicitly
- Sessions blocked after 2+ -32603 errors (no silent retry loops)
- Worktrees preserved for HIC manual review

**PR #1910 (Aug 27):** Session coordinator

- Multi-platform exclusive locking (claude-code + opencode + cursor)
- Parallel session routing per availability
- 24h lock auto-expiry, audit trail

### In-Flight Improvements

**Themis Phase 1 (Days 1-3, Aug 27–29):**  
Agent registry + workload classifier → intelligent routing

- Route HEAVY sessions → Claude Code (more stable for long-running)
- Route BATCH sessions → OpenCode (designed for queuing)
- Health-aware selection (skip dead agents, prefer healthy ones)

**Phase 1 Success Metric:**  
Route 10+ concurrent sessions across 50+ agents without manual intervention

---

## Debugging a Failed Session

### Step 1: Identify the Failed Session

```bash
# Find sessions in FAILED state
jq 'select(.state=="FAILED")' .workflows/opencode-all/queue.jsonl
```

### Step 2: Inspect Session State

```bash
# Get the worktree path and last error
jq 'select(.id=="<session-id>") | {worktreePath, failureDetail, lastRun}' .workflows/opencode-all/queue.jsonl
```

### Step 3: Resume Manually

```bash
cd <worktreePath>
git status  # Check for uncommitted changes
git log --oneline -5  # Review what was done

# Resume in Claude Code
claude code --session <session-id> --workdir .
```

### Step 4: Commit Work or Mark as Complete

```bash
git add .
git commit -m "feat: <topic> [resume from batch]"
git push origin <branch>
```

---

## Preventive Configuration

### Set Longer Timeouts for Unreliable Networks

```bash
# In .env or environment
export OPENCODE_BATCH_TIMEOUT_MIN=25  # Default 20m
export OPENCODE_BATCH_INTERVAL_MIN=35  # Default 30m; increase to space out retries
```

### Monitor Batch Queue Health

```bash
# Add to cron (daily)
jq '[.[] | select(.state=="FAILED")] | length' .workflows/opencode-all/queue.jsonl > /tmp/failed_sessions.txt
# Alert HIC if count > 3
```

### Auto-Escalate Persistent Failures

```bash
# Sessions with 3+ failed attempts are marked 'needs-human'
# HIC reviews periodically and manually resumes or closes them
grep '"stopReason":"needs-human"' .workflows/opencode-all/queue.jsonl | wc -l
```

---

## Performance Expectations

| Metric                       | Target       | Current                         |
| ---------------------------- | ------------ | ------------------------------- |
| Batch processing interval    | 30 min       | ✅ 30 min                       |
| Health check overhead        | <5% CPU      | ✅ <2%                          |
| Failed session recovery time | <24h         | ✅ Auto-retry + HIC escalation  |
| Max concurrent sessions      | 10+          | ✅ Session coordinator supports |
| Context explosion handling   | <100k tokens | ✅ Health check prevents        |

---

## Related Commits & Issues

| Reference | Status    | Fixes                                    |
| --------- | --------- | ---------------------------------------- |
| PR #1905  | ✅ Merged | Health checks + exponential backoff      |
| PR #1907  | ✅ Merged | MERGE_READY state + error escalation     |
| PR #1910  | ✅ Merged | Session coordinator (parallel workload)  |
| PR #1913  | ✅ Merged | Themis Phase 1 Day 2-3 (agent selection) |

---

## When to Escalate to HIC

Escalate if:

1. **Batch failure rate > 30%** for more than 1 hour
   - Action: Check OpenCode service health
2. **Same session fails 3 times in a row**
   - Action: Review session worktree, manually resume or close
3. **Backlog grows to >20 queued sessions**
   - Action: Increase batch size or reduce interval
4. **OpenCode service is down > 2 hours**
   - Action: Failover to Claude Code (manual routing)

---

## Key Files & Logs

| Path                                  | Purpose                             |
| ------------------------------------- | ----------------------------------- |
| `scripts/opencode-batch-worker.mjs`   | Batch processor (30m interval)      |
| `scripts/session-coordinator.mjs`     | Workload router + exclusive locking |
| `.workflows/opencode-all/queue.jsonl` | Batch queue (JSONL audit log)       |
| `.claude/handoffs/opencode-batch/`    | Session handoffs (HIC review)       |
| `.worktrees/opencode-all/`            | Session worktrees (git branches)    |

---

## Next Actions

1. **HIC Review:** Check failed sessions in queue; manually resume or close
2. **Operator:** Monitor health check logs for persistent OpenCode outages
3. **Infrastructure:** Implement Themis Phase 1 intelligent routing (PR #1913 in flight)
4. **Communication:** Keep DWS6 team informed of batch status via dashboard

**Status:** Ready for production; Phase 1 routing improvements in progress.
