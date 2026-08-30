# Session Recovery Plan

## Overview

**73 sessions recovered** from DGX Copilot, Claude Code, and Continue stores.
**After validation:** Only **15 sessions are DWS6-relevant and recoverable**.

---

## Session Breakdown

### ✅ Directly Recoverable (12 sessions)

**Copilot GitHub CLI sessions with full event logs**

- Average score: 95/100
- All on dws6 repository
- Have complete transcript and context
- Recent activity (Aug 5-27)

**Top sessions to recover:**

1. `deddef51-4377` — "Fix PR 1851 and Merge" (2,463 events)
2. `dbab1ef1-b889` — (2,196 events)
3. `c459ea34-4500` — (892 events)
4. `b1c5577a-ae6a` — (472 events)

**Action:** `claude claim-session copilot_deddef51-437` to resume

---

### ⚠️ Needs Content Review (3 sessions)

**Copilot sessions with some metadata but unclear scope**

- Scores 60-85/100
- Likely dws6 but require confirmation
- Located in validation report

**Action:** Manually review before claiming

---

### ❌ Not Worth Recovering (58 sessions)

**Other Repositories (3):**

- Different projects
- Archive suggested

**Archive Candidates (35):**

- Claude Code sessions with minimal metadata
- Scores < 30/100
- Low information content

**Claude Code Sessions (55 total):**

- Store only internal state/metadata
- No actual conversation transcripts
- Require manual export from Win11 Claude Code if needed

---

## Recovery Workflow

### Step 1: Validate

```bash
node scripts/session-validate.mjs
```

Produces:

- `.workflows/sessions/validation-report.json` — detailed analysis
- `.workflows/sessions/recovery-manifest.json` — action items

### Step 2: Review High-Priority Sessions

```bash
jq '.dws6_high_priority[].id' .workflows/sessions/recovery-manifest.json
```

### Step 3: Claim for Recovery

```bash
# Resume a Copilot session in Claude Code
claude claim-session copilot_deddef51-437

# Or view all available
claude sessions list --filter dws6
```

### Step 4: Archive Non-Relevant

```bash
# Mark sessions for archival (not implemented yet, manual for now)
# Sessions with score < 30 or non-dws6
```

---

## Key Findings

### What's Actually Usable

**Copilot sessions:** Full event logs with:

- Complete action history
- Model decisions
- Code changes
- Context (branch, commits, repo)

Example structure:

```json
{
  "workspace": {
    "id": "deddef51-4377-4c41-9b35-f20148e25e61",
    "cwd": "/home/admin100/dws6",
    "repository": "blogtheristo/dws6",
    "branch": "kya-baseline-clean",
    "created_at": "2026-08-18T12:55:13.248Z"
  },
  "events": [
    {"type": "session.start", "timestamp": "2026-08-18T12:55:13.296Z"},
    {"type": "model_change", "data": {"newModel": "gpt-5.6-sol"}},
    ...
  ]
}
```

### What's NOT Usable

**Claude Code transcripts:** Store only metadata:

- Session IDs
- Permission settings
- Hook status
- No actual conversation/work content

→ Would need to export directly from Win11 Claude Code if those transcripts are needed

---

## Recommendations

### Immediate (High Value)

1. ✅ Recover the 12 high-priority Copilot sessions
2. ✅ Use `claude claim-session` to resume work
3. ✅ Transition to batch worker via handoff

### Short Term

1. Review the 3 sessions marked "needs review"
2. Archive the 35 low-score Claude sessions
3. Archive the 3 non-dws6 sessions

### Future

1. Export Win11 Claude Code transcripts if needed (requires manual export)
2. Integrate Continue plugin session recovery when available
3. Build Win11 MCP bridge for real-time session sync

---

## Recovery Manifest

`.workflows/sessions/recovery-manifest.json`:

```json
{
  "dws6_recoverable": [12 session IDs with score > 70],
  "dws6_needs_review": [3 session IDs with score 60-70],
  "other_repos": [0 sessions],
  "archive_candidates": [35 sessions with score < 30]
}
```

---

## Quality Metrics

| Metric          | Value        |
| --------------- | ------------ |
| Total Recovered | 73           |
| DWS6 Relevant   | 15 (20%)     |
| Directly Usable | 12 (16%)     |
| Average Score   | 37.4/100     |
| Largest Session | 2,463 events |

---

## Next Steps

1. **NOW:** `claude claim-session copilot_deddef51-437` to resume work
2. **Check:** What was the state of that Copilot session?
3. **Continue:** In Claude Code, OpenCode batch, or Cursor
4. **Handoff:** When done, use `claude handoff-to-batch --mode review`
