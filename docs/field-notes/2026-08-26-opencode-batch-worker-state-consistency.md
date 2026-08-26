# Batch Worker State Consistency Fix — OpenCode Fallback Investigation

**Date:** 2026-08-26  
**Branch:** claude/stalled-queue-handoff-investigation-i6gxmo  
**Status:** Complete  
**Evidence:** PR #1903

## Incident

OpenCode batch queue (opencode-all) stalled with 11 FAILED sessions (max retries exhausted), 1 contradictory MERGE_READY session, and 15 QUEUED sessions blocked. Investigation showed:

- 9 sessions failed on OpenCode backend service errors (code -32603, `service: session`)
- 2 sessions had git worktree corruption (broken paths)
- 1 session showed contradictory state: MERGE_READY + failureDetail (OpenCode error) + worktree deleted from filesystem

**Root cause:** Batch worker wrote MERGE_READY state without verifying the worktree still existed. If external process deleted the worktree between validation-passed and queue-write, metadata became impossible to interpret.

## Discovery

Tested the MERGE_READY session by attempting to inspect its worktree:

```bash
find /home -name "ses_fce609dc3ffen8EgwnPwl4zcJp" -type d
→ (no results)

git -C /home/user/dws6 branch -a | grep opencode
→ (no opencode branches; all cleaned up)
```

Queue state: `"worktreeState": "kept-for-review"`, `validation.passed: true`  
Filesystem state: worktree absent, no branches

**Implication:** No work to recover. Batch is unrecoverable without backend health check and queue reset.

## Fix

Two guards added to `scripts/opencode-batch-worker.mjs`:

### Guard 1: MERGE_READY validation (lines 470–493)

Before committing to MERGE_READY after successful validation, verify worktree exists:

```javascript
if (validation.passed) {
  const wtExists = existsSync(worktreePath);
  const wtHasDiff = wtExists && worktreeHasDiff(worktreePath, cur.baselineCommit);
  if (!wtExists) {
    // Fail loud: validation passed but worktree missing (external deletion)
    cur.state = "FAILED";
    cur.failureCode = "validation-passed-worktree-missing";
  } else if (!wtHasDiff) {
    // Valid: cleanup-only session, no changes expected
    cur.state = "MERGE_READY";
    cur.worktreeState = "kept-no-diff-but-valid";
  } else {
    cur.state = "MERGE_READY";
    cur.worktreeState = "kept-for-review";
  }
}
```

**Prevents:** Orphaned queue entries claiming work that doesn't exist.

### Guard 2: Cleanup state consistency (lines 1079–1085)

After error cleanup, verify `worktreeState` was explicitly set (never undefined):

```javascript
const cleanupResult = cleanupWorktreeAfterFailure(cur, wt.resumed);
if (!cur.worktreeState) {
  cur.worktreeState = "unknown-cleanup-state";
  console.error(`[invariant] cleanup did not set worktreeState`);
}
```

**Prevents:** Silent cleanup-function failures leaving metadata blank.

## Design Principle

**Rule 12 (Fail Loud):** State contradictions are caught eagerly, not silently stored. Metadata must always be consistent with filesystem reality, or the inconsistency is captured and surfaced for human review.

## Next Steps

1. **HIC decision:** Confirm backend health (Phase 1 of action plan)
2. **Queue reset:** Delete FAILED entries, restart worker
3. **Long-term:** Integrate worker health checks into batch startup (pre-flight validation of OpenCode service before spawning sessions)

## Worker Design Improvements (Post-Recovery)

The batch worker should add:

1. **Pre-flight health check** before processing any batch
   - Verify OpenCode service responds to `opencode version` or similar
   - Verify git is accessible
   - Verify Supabase session table is readable
2. **Exponential backoff retry** instead of "3 fixed retries, then stuck forever"
   - Failed session: retry after 1 min, then 2 min, then 4 min, cap at 30 min
   - After 3 failures in 30 min: escalate to NEEDS-HUMAN, stop retrying

3. **Worktree consistency audit** on worker startup
   - Reconcile queue state vs. filesystem (orphaned branches, missing worktrees)
   - Report discrepancies before processing new batches

4. **Session isolation timeout guard**
   - Track how long each session has been RUNNING
   - If > N hours (e.g., 6h), mark as stale and escalate to NEEDS-HUMAN
   - Current code has this; good.

## Evidence

- **Handoff:** .claude/handoffs/claude/stalled-queue-handoff-investigation-i6gxmo.md (root cause analysis + action plan)
- **Queue snapshot:** `.workflows/opencode-all/queue.jsonl` (28 sessions, 11 FAILED with contradictory metadata)
- **Worker fix:** scripts/opencode-batch-worker.mjs (commit fc3b0877, 2 guards added)
- **PR:** #1903 (full investigation + fix)

## Conclusion

This was a **hot standby event:** OpenCode (primary runtime) encountered the state consistency bug; Claude Code (standby) investigated, diagnosed, and fixed it. The fix is defensive — it prevents future metadata corruption even if the underlying OpenCode service or external processes delete worktrees unexpectedly.

The batch queue is **not yet recovered** (awaiting backend health confirmation + human reset), but it **cannot get worse** (metadata is now guarded against silent corruption).
