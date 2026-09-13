---
Document: Test Plan — PR #2005 (Disable Duplicate Flow-*-Outreach Paths)
Type: Operations Checklist
Status: [Latest] Active
Version: 1.0
Date: 2026-09-13
---

# Test Plan: PR #2005 Flow Digests Disablement

**Objective:** Verify flow-*-outreach digests no longer auto-run on day-runner; Grok/Mission Control are sole daily triage owners.

---

## Pre-Merge Verification (Local)

### 1. Files Moved to DEPRECATED ✓

```bash
# Run locally before merge:
ls -la scripts/daily/flow-*-outreach.ts 2>&1
# Expected: "No such file or directory" (files moved to scripts/)

ls -la scripts/flow-*-outreach_DEPRECATED.ts
# Expected: 4 files found
#   - flow-investor-outreach_DEPRECATED.ts
#   - flow-sales-outreach_DEPRECATED.ts
#   - flow-partner-outreach_DEPRECATED.ts
#   - flow-media-outreach_DEPRECATED.ts
```

**Status:** ✓ Verified (files moved)

---

### 2. Early Exit Guard in Place ✓

```bash
# Check each DEPRECATED file has early exit:
grep -n "ALLOW_DEPRECATED_FLOW_DIGEST" scripts/flow-*-outreach_DEPRECATED.ts
# Expected: Each file logs "Early exit: deprecated flow digest (enable with ALLOW_DEPRECATED_FLOW_DIGEST=1)"
```

**Status:** ✓ Verified (guard in place)

---

## Post-Merge Operational Tests (HIC/DGX)

### 3. DGX day-runner Doesn't Discover Flows (Next 06:00 UTC Window)

**When:** Next scheduled day-runner window (06:00 UTC)

**How:**

```bash
# SSH to DGX, check day-runner logs:
tail -100 /var/log/dws6/day-runner.log | grep -i "flow-investor\|flow-sales\|flow-partner\|flow-media"
# Expected: NO matching lines (flows not discovered/executed)

# Also check:
grep "discovered\|running" /var/log/dws6/day-runner.log | tail -20
# Expected: Only these jobs appear:
#   - morning-brief-v2.ts (or disabled, should be off)
#   - outreach-digest.ts (or disabled, should be off)
#   - other non-flow jobs
```

**Acceptance Criteria:**

- ✓ No flow-investor-outreach runs logged
- ✓ No flow-sales-outreach runs logged
- ✓ No flow-partner-outreach runs logged
- ✓ No flow-media-outreach runs logged
- ✓ No duplicate digests received by risto@lifetime.fi

**Reporter:** HIC (after 06:15 UTC next window)

---

### 4. Optional: Backward Compatibility Test (One-Shot)

**When:** Anytime after merge (manual trigger)

**How:**

```bash
# SSH to DGX, run one deprecated flow manually:
cd /repo
ALLOW_DEPRECATED_FLOW_DIGEST=1 npx tsx scripts/flow-investor-outreach_DEPRECATED.ts

# Expected output:
# ✓ No early-exit error
# ✓ Script runs normally
# ✓ Digest email sent to risto@lifetime.fi (one-shot)
# ✓ Log: "Deprecated flow digest — sent manually via ALLOW_DEPRECATED_FLOW_DIGEST=1"
```

**Acceptance Criteria:**

- ✓ Script runs without error
- ✓ One email delivered (manual override works)
- ✓ Proves backward compat for HIC emergency one-shot use

**Reporter:** HIC (optional; only if manual one-shot needed)

---

## Verification Timeline

| Step                           | Timing                | Owner         | Status     |
| ------------------------------ | --------------------- | ------------- | ---------- |
| Pre-merge local checks         | Before merge          | —             | ✓ Done     |
| Merge #2005                    | HIC decision          | HIC           | ⏳ Pending |
| Backend redeploy               | After #2002 merges    | Ops           | ⏳ Pending |
| 06:00 UTC day-runner window    | ~6–12 hrs after merge | DGX scheduler | ⏳ Pending |
| Check logs for duplicate flows | 06:15 UTC             | HIC           | ⏳ Pending |
| Report pass/fail               | After 06:15 UTC       | HIC           | ⏳ Pending |

---

## Pass Criteria

**PASS if:**

- ✓ Day-runner logs show no flow-*-outreach discoveries/runs
- ✓ No duplicate digests in HIC inbox (07:00 UTC window)
- ✓ Grok + Mission Control remain sole triage owners

**FAIL if:**

- ✗ Day-runner still discovers flow-*-outreach.ts files
- ✗ Duplicate digests sent (two copies of same digest)
- ✗ Early-exit guard doesn't work (flows run by accident)

---

## Rollback Plan

If test fails:

1. Revert #2005 (restore flow-*-outreach.ts to scripts/daily/)
2. Disable day-runner until root cause found
3. HIC uses manual Grok triage for that day

---

## Sign-Off

- [ ] Pre-merge checks pass
- [ ] #2005 merged
- [ ] Backend redeployed
- [ ] 06:00 UTC window checked
- [ ] No duplicate flows detected
- [ ] Grok/Mission Control confirmed as sole owners
- [ ] **TEST PLAN COMPLETE** ✓

---

**Version 1.0 / 2026-09-13 / Ready for Execution**
