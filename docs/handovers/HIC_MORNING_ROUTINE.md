---
Document: HIC Morning Routine (04:30–07:30)
Type: Operational Guidance (Daily Schedule)
Status: [Latest] Active
Version: 1.1
Date: 2026-09-28
Languages Available: English
schema: DWS_DOCUMENT_STANDARD
---

# HIC Morning Routine: 04:30–07:30

**Your 3-hour window to set work for agents all day.** Then they work while you're away.

**Note (28.09.2026):** Mission Control may still say **Hand to Grok**. That action means the **Win11 daily-ops bot** (VS Code + Copilot Chat / Claude Max) on anonymized packs only — **not Cursor** (Pro cancelled). Raw threads → **Open in OpenCode**. Prompt: `docs/handovers/grok-bot-daily-ops-handover.md`.

---

# VERSION AND AGENT HISTORY

---

- Version: 1.1 [Latest] | Tool: Cursor | Session: docs/cursor-pro-cancel-daily-ops | Date: 28.09.2026 | Changes: Clarify Hand-to-Grok UI = daily-ops bot off Cursor after Pro cancel. | Harness: Cursor CLI (one-shot) + CLAUDE.md | HIC-approved-drift: none
- Version: 1.0 [not latest] | Tool: Cursor | Session: (prior) | Date: 13.09.2026 | Changes: Initial morning routine

---

## Timeline

| Time            | Action                      | System          | Output                                                        |
| --------------- | --------------------------- | --------------- | ------------------------------------------------------------- |
| **04:30**       | Start                       | Coffee          | Awake                                                         |
| **04:35–04:50** | Review overnight results    | Option B        | Check `.claude/handoffs/opencode-batch/` for completed items  |
| **04:50–05:10** | Send overnight results      | Manual          | Copy 3–5 ready drafts/analyses → email/Slack                  |
| **05:10–06:00** | Triage + queue              | Mission Control | Urgent → Hand to daily-ops bot (A); Complex → Queue async (B) |
| **06:00–06:30** | Refine + approve bot drafts | Option A        | Review quick replies, send customer-facing mail               |
| **06:30–07:20** | Queue final batch           | Option B        | Final research/proposals for all-day processing               |
| **07:20–07:30** | Verify queue                | opencode-all    | Confirm items queued; agents will pick up (08:00+ UTC)        |
| **07:30+**      | Leave                       | —               | Agents work all day; you're offline                           |

---

## Step by Step

### 04:35–04:50: Review Overnight Results (15 min)

**Where:** `.claude/handoffs/opencode-batch/`

```bash
# Check what finished overnight
ls -lt .claude/handoffs/opencode-batch/ | head -10

# Read the most recent result
cat .claude/handoffs/opencode-batch/mission-control-xyz.md
```

**What you see:**

- Overnight drafts (proposals, emails, analyses)
- Mark status: ready-to-send, needs-revision, or forwarding-to-Simon

---

### 04:50–05:10: Send Overnight Results (20 min)

**Copy 3–5 finished items from handoff → send via email/Slack/message.**

```
Example:
  ✓ One Click LCA partnership proposal — READY → Copy to email, send to contact
  ✓ IFS vs Infor comparison — READY → Forward to technical team
  ✓ NCC AB follow-up email — NEEDS REVISION → Mark as re-queue in Mission Control
```

**Time estimate:** ~4 min per item (copy, paste, send). 5 items = 20 min.

---

### 05:10–06:00: Triage + Queue (50 min)

**Open Mission Control → sort incoming items into A or B.**

```
Overdue 5 (from morning-brief seed):
  [ T:YPGW53RPFQ ] NCC AB — sustainable architecture
    Status: NEW (researched yesterday)
    Action: QUEUE FOR ASYNC → "Draft partnership proposal; prepare technical approach doc"

  [ T:2764XEMEWX ] One Click LCA — partnerships
    Status: INTRO SENT (2026-08-29)
    Action: QUEUE FOR ASYNC → "Draft follow-up email covering integration + pilot timeline"

  [ T:YBMDRDF4PS ] IFS Cloud — integration demo
    Status: NEW (ISV contact pending)
    Action: QUEUE FOR ASYNC → "Research IFS ISV partner program; prepare Nordic demo offer"

  [ T:2C2HTYTUN5 ] Panu Pasanen follow-up
    Status: INTRO MADE
    Action: HAND TO GROK → "Draft concise follow-up; ready to send via Simon"

  [ T:NUSNSJV2TR ] Anna Gueorguieva — GreeniumDC
    Status: INTRO MADE
    Action: HAND TO GROK → "Propose 30-min call for FCD one-pager; available Thursday?"

Incoming overnight:
  [ NEW ] Investor X — climate tech fund
    Status: FRESH (inquiry yesterday)
    Action: HAND TO GROK → "Quick triage: real opportunity or spam? Known fund?"

  [ NEW ] Partner Y — LCA workflow request
    Status: URGENT (demo scheduled Friday)
    Action: QUEUE FOR ASYNC → "Build demo environment + generate invite link + draft intro"
```

**Decision rule for each item:**

**Hand to daily-ops bot (A):** Urgent, quick decision, anonymized context

- **Queue for Async (B):** Research, deep draft, can wait until next morning

**Time estimate:** ~2 min per item (read + decide + queue). 10 items = 20 min. Includes filling in context ("what should the agent do?").

---

### 06:00–06:30: Grok Drafts (30 min)

**The daily-ops bot has been processing your Option A items since 05:10.**

```
Grok draft 1: "Panu follow-up email"
  [Review] → looks good
  [Send] → copy to email, send via Simon

Grok draft 2: "Anna availability email"
  [Review] → tweak tone ("more urgent" → "more casual")
  [Refine] → hand back to Grok: "Make it friendlier; we want a call, not pressure"
  [Wait] → Grok refines (2 min)
  [Send] → final copy, send

Grok draft 3: "Is Investor X real?"
  [Review] → summary: "Not a known fund, but plausible. Recommend light research before major pitch."
  [Decide] → queue Investor X for async research, or send polite "thanks for interest, let's talk after you review our platform" reply?
  [Decide → Queue] → "Research Investor X; prepare 1-pager if real"
```

**Time estimate:** ~3 min per Grok draft (review, possibly refine, send). 3–4 drafts = 12–15 min. Leaves 15 min buffer.

---

### 06:30–07:20: Final Batch Queue (50 min)

**Last chance to queue items for all-day processing.**

```
Additional items found:
  [ NEW ] CSRD report due Friday
    → QUEUE: "Generate CSRD compliance report for Friday board call"

  [ FLAGGED ] Demo environment request
    → QUEUE: "Set up demo environment; generate 30-day trial link; draft welcome email"

  [ RESEARCH ] Market analysis for board
    → QUEUE: "Research climate fintech startups; compile top 10 + fit assessment"

Summary:
  Ready to send: 2 emails (from Grok)
  Hand to Grok now: 3 items (quick triage/replies)
  Queue for async: 7 items (complex research/drafts/builds)
```

**Time estimate:** ~5 min per item (read + context + queue). 7 items = 35 min. Leaves 15 min buffer.

---

### 07:20–07:30: Verify Queue (10 min)

**Confirm queue is submitted and agents will pick it up.**

```bash
# Check queue state
tail -5 .workflows/opencode-all/queue.jsonl

# Verify items queued with context
grep "state.*PENDING" .workflows/opencode-all/queue.jsonl | wc -l
# Output: 7 items queued ✓

# Optional: start batch worker manually if not running
# (or let the scheduled cron pick it up at 08:00 UTC)
```

**Checklist:**

- [ ] 3–5 overnight results sent (Option B)
- [ ] 2–3 Grok drafts sent (Option A)
- [ ] 7–10 items queued for all-day processing (Option B)
- [ ] Queue file saved and committed (optional, or auto-commit via hook)

**Then leave.** Agents work 07:30 → 04:30 (next morning). You're offline.

---

## What Happens While You're Away (07:30–04:30)

| Time        | What's Happening               | Agent    | Output                                                      |
| ----------- | ------------------------------ | -------- | ----------------------------------------------------------- |
| 07:30–12:00 | Grok triage + customer replies | Option A | Drafts ready (you'll see in next morning)                   |
| 12:00–18:00 | OpenCode agents researching    | Option B | Handoffs accumulating in `.claude/handoffs/opencode-batch/` |
| 18:00–00:00 | OpenCode complex drafts/builds | Option B | Proposals, demo environments, reports ready                 |
| 00:00–04:30 | Final overnight processing     | Option B | Last results landing in handoff directory                   |
| 04:30       | You return                     | —        | 7–10 results ready to review + send                         |

---

## Tomorrow Morning (Same Pattern)

```
04:30 → Start again
04:35 → Review 7–10 overnight results
04:50 → Send them (all-day work is done → ship it)
05:10 → New triage + queue for the day
06:00 → Review new Grok drafts
06:30 → Final queue
07:20 → Verify
07:30 → Leave (agents work again)
```

**Loop repeats.** You queue in morning (3 hours). Agents work all day. Next morning you ship results.

---

## Time Budgets

**Your 3-hour window breakdown:**

```
Activity                Time        Items/Output
─────────────────────────────────────────────────
Review overnight        15 min      5 completed
Send results            20 min      5 emails/messages
Triage + queue (A)      20 min      3–4 "Hand to Grok"
Grok review + send      30 min      2–3 Grok drafts
Final queue (B)         50 min      7–10 items queued
Verify queue            10 min      Confirm ready
─────────────────────────────────────────────────
TOTAL                   ~180 min    20–25 items processed
```

**Agents' 21-hour window breakdown:**

```
Activity                Time        Items/Output
─────────────────────────────────────────────────
Grok triage (A)         4–5 hours   Quick replies + drafts
OpenCode research (B)   6–8 hours   Analyses, proposals
OpenCode drafts (B)     6–8 hours   Email drafts, reports
OpenCode builds (B)     2–3 hours   Demo environments, PDFs
Handoff prep (all)      1–2 hours   Final result files ready
─────────────────────────────────────────────────
TOTAL                   ~21 hours   7–10 completed items
```

---

## Tips for Speed

### Fast Triage (05:10–06:00)

- **Pre-written context snippets** → copy + paste (don't re-type)
- **Decision checklist** → A or B? (bookmark A_AND_B_DECISION_MATRIX.md)
- **Skip perfection** → context doesn't need to be polished; agents will refine

### Fast Grok Handoff

- **Grok has already seen the item** → just refine if needed
- **One refinement max** → if Grok draft needs more work, queue for async instead
- **Approve + send** → don't overthink (you can always send a follow-up tomorrow)

### Fast Queue

- **Batch similar items** → "research these 3 investors" (one job, 3 targets)
- **Clear context** → "draft X for Y" (agent won't guess your intent)
- **Trust agents** → if context is clear, they'll deliver

---

## Edge Cases

### "I don't finish by 07:30"

- Queue what's ready
- Grok items still drafting → Grok can finish after you leave (results in handoff)
- Async items in queue → agent will start anyway

### "Overnight result is wrong"

- Mark as "needs revision" in Mission Control
- Agent re-queues (or you do it manually next morning)
- Send something else while waiting

### "New urgent item arrives at 12:00 (while you're offline)"

- It waits until tomorrow morning
- If truly urgent, it goes in tomorrow's "Hand to Grok" queue (short turnaround)

### "Queue is empty at 07:30"

- That's fine; you had fewer items than expected
- Check for new overnight requests (emails, Slack)
- Add them to queue if anything urgent came in

---

## Setup & Automation

**One-time setup:**

```bash
# Ensure opencode-all batch worker is running
# (Check `.worktrees/opencode-all/` exists)
# (Or schedule `npm run opencode-all:start` at 08:00 UTC daily)

# Confirm queue file exists
touch .workflows/opencode-all/queue.jsonl

# Confirm handoff directory exists
mkdir -p .claude/handoffs/opencode-batch/

# Optional: Create morning checklist script
cat > scripts/hic-morning-checklist.sh <<'EOF'
#!/bin/bash
echo "HIC Morning Checklist — 04:30–07:30"
echo "1. Review: ls -lt .claude/handoffs/opencode-batch/ | head -5"
echo "2. Triage: open https://dws6.com/dashboard/mission-control/"
echo "3. Queue: grep PENDING .workflows/opencode-all/queue.jsonl | wc -l"
echo "4. Done: git add .workflows/opencode-all/queue.jsonl && git commit"
EOF
chmod +x scripts/hic-morning-checklist.sh
```

---

## Version History

| Version      | Date       | Changes                                                        | Author      |
| ------------ | ---------- | -------------------------------------------------------------- | ----------- |
| 1.0 [Latest] | 2026-09-13 | HIC morning routine (04:30–07:30) with timeline + time budgets | Claude Code |
