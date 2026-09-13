---
Document: Option B — Async Queue for Mission Control Items
Type: Operational Guidance (Batch Processing Integration)
Status: [Latest] Active
Version: 1.0
Date: 2026-09-13
Languages Available: English
schema: DWS_DOCUMENT_STANDARD
---

# Option B: Async Queue — Agents Process Work All Day

**Effective:** 2026-09-13  
**For:** HIC + OpenCode agents (batch processing)  
**Purpose:** Queue Mission Control items for overnight/background processing by OpenCode agents  
**Complement to:** Option A (soft failover). A = interactive (right now), B = async (all day/overnight)

---

## How It Works

**Morning (HIC):**

1. Review overdue items in Mission Control.
2. For items you won't handle interactively today → **Queue for async** (checkbox in UI).
3. Add context: "draft reply", "research this", "prepare proposal", etc.
4. Walk away.

**All Day (OpenCode agents):**

- `opencode-all` batch worker picks up queued items every hour.
- Creates a worktree session per item.
- Runs the work (draft reply, research, analysis, etc.) autonomously.
- Hands off result as prepared markdown in `.claude/handoffs/opencode-batch/`.

**Next Morning (HIC):**

- Review overnight results in Mission Control.
- Copy result, send it, or refine it.
- Mark item done.

---

## When to Use Option B

**Use B for:**

- Research tasks ("find NCC AB sustainability team contact")
- Drafting tasks ("draft partnership proposal for One Click LCA")
- Analysis ("compare IFS vs Infor for integration approach")
- Multi-step workflows ("prepare demo environment + send invite link")
- Overnight processing ("generate CSRD report for tomorrow's call")

**Use A (interactive/Grok) for:**

- Quick triage ("is this a new lead or existing follow-up?")
- Immediate replies ("send availability for Friday call")
- Decisions that only you can make ("approve this pricing?")

---

## Queue Mechanics

### Adding to Queue

**In Mission Control UI:**

```
Item: "One Click LCA partnership — bid expires 2026-09-15"

[ ] Hand to Grok (now)
[ ] Take as HIC (now)
[x] Queue for async (add to opencode-all batch)

Context: "Draft partnership proposal covering our output-as-input approach, technical integration, and pilot timeline. Make it concise (1 page) and ready for Simon Sim to send."

[Queue]
```

**Programmatically (if needed):**

```bash
# Add item to opencode-all queue
cat >> .workflows/opencode-all/queue.jsonl <<'EOF'
{"id":"mission-control-20260913-item-xyz","title":"One Click LCA partnership proposal","source":"mission-control","state":"PENDING","createdAt":"2026-09-13T08:00Z","context":"...","handoffPath":".claude/handoffs/opencode-batch/mission-control-xyz.md"}
EOF
```

### Queue State File

```
.workflows/opencode-all/queue.jsonl
```

Each line is one job:

```json
{
  "id": "mission-control-20260913-one-click",
  "title": "One Click LCA partnership proposal",
  "source": "mission-control",
  "state": "PENDING", // PENDING → IN_PROGRESS → DONE
  "createdAt": "2026-09-13T08:00Z",
  "startedAt": null,
  "completedAt": null,
  "context": "Draft partnership proposal...",
  "handoffPath": ".claude/handoffs/opencode-batch/mission-control-xyz.md"
}
```

### Result Handoff

When agent finishes, result lands at:

```
.claude/handoffs/opencode-batch/mission-control-20260913-one-click.md
```

Example result:

```markdown
---
item_id: mission-control-20260913-one-click
status: DONE
completed_at: 2026-09-13T22:15Z
source: opencode-all batch worker
---

# Partnership Proposal: One Click LCA

[Full 1-page draft proposal]

---

**Next steps:**

- Review for tone / accuracy
- Fill in placeholder dates if needed
- Send via Simon Sim to One Click LCA contact

**Time spent:** 45 min research + 30 min drafting
**Sources:** 5 LinkedIn articles, IFS integration docs, Infor comparison

---

Ready for HIC review. Copy to email or request changes.
```

---

## HIC Workflow: Queue → Review → Send

### Morning: Create Queue

```
1. Open Mission Control
2. Review "Overdue 5" + any new items
3. For each item:
   - If urgent/interactive → "Hand to Grok" or "Take as HIC" now
   - If research/draft → [x] Queue for async + add context
4. Submit queue batch (sends all queued items to opencode-all)
5. Walk away (agents work all day/night)
```

### Next Morning: Review Results

```
1. Open Mission Control → "Async Results" tab (or check .claude/handoffs/opencode-batch/)
2. For each completed item:
   - Read the draft / analysis / result
   - [Copy] the content
   - [Send] it (email, Slack, PR comment)
   - [Request Changes] if needed (re-queues to same agent)
   - [Done] mark as complete
```

---

## Agent Responsibilities (opencode-all)

**Each agent session owns one queued item.**

### Input (from Mission Control queue)

```
{
  "id": "...",
  "title": "One Click LCA partnership proposal",
  "context": "Draft partnership proposal covering our output-as-input approach, technical integration, and pilot timeline. Make it concise (1 page) and ready for Simon Sim to send.",
  "handoffPath": ".claude/handoffs/opencode-batch/..."
}
```

### Process

1. **Read context** — understand the task.
2. **Do the work** — research, draft, analyze, code, etc. (full git access, can read repos, APIs, docs).
3. **No raw PII in output** — strip/pseudonymize customer data before committing handoff.
4. **Prepare result** — write markdown to handoff file with:
   - Full task result (draft, analysis, code, etc.)
   - Sources cited (if research)
   - Time spent
   - Next steps / HIC actions
   - Quality: assume HIC will send result as-is (no typos, coherent, professional)

### Output (to Mission Control handoff)

```markdown
---
item_id: ...
status: DONE
completed_at: 2026-09-13T22:15Z
---

[Full result ready for HIC to copy & send]
```

### Guardrails

- **No raw PII in git**: strip customer details before committing
- **No email auto-send**: draft only; HIC sends
- **Handoff guaranteed**: result lands in expected file, even if partial/failed
- **Restart-safe**: if session crashes, can be resumed from the handoff file

---

## Queue Execution (opencode-all batch worker)

**Every hour, the batch worker:**

1. **Read queue** (`.workflows/opencode-all/queue.jsonl`)
2. **Find PENDING items** (not IN_PROGRESS, not DONE)
3. **Create worktree** — isolated git clone per item
4. **Start OpenCode session** — reads item context
5. **Session executes** — agent does the work (up to 48 hours, or until done)
6. **Write handoff** — result to `.claude/handoffs/opencode-batch/<item_id>.md`
7. **Update queue state** → `state: DONE`
8. **HIC reviews** → copy result from handoff, send it

---

## Example: End-to-End Flow

### Morning (HIC Queues)

```
Mission Control → Overdue Items

[T:2C2HTYTUN5] Panu Pasanen (One Click LCA) — intro made
  Status: awaiting follow-up
  Last action: intro email sent 2026-08-29

  [ ] Hand to Grok (now) [Take as HIC] [x] Queue for async

  Context: "Draft concise follow-up email to Panu Pasanen (One Click LCA)
  covering: (1) our Agent-as-a-Service approach for LCA workflows,
  (2) integration with their platform, (3) pilot timeline.
  Keep it to 3 paragraphs. Ready to send via Simon Sim."

  [Queue for async processing]

✓ Queued — agent will work on this overnight
```

### Overnight (OpenCode Agent Processes)

```
OpenCode session #ses_mission-control-xyz starts at 02:00 UTC

Agent reads:
  "Draft concise follow-up email to Panu Pasanen..."

Agent does:
  1. Reads One Click LCA web presence
  2. Reviews Lifetime Oy / Agent-as-a-Service pitch
  3. Drafts 3-paragraph email (concise, professional)
  4. Writes result to .claude/handoffs/opencode-batch/mission-control-xyz.md
  5. Commits: "feat: draft One Click LCA follow-up for Panu Pasanen"

Handoff created:
  .claude/handoffs/opencode-batch/mission-control-xyz.md

Queue updated:
  state: DONE
  completedAt: 2026-09-13T02:47Z
```

### Next Morning (HIC Reviews & Sends)

```
Mission Control → Async Results Tab

✓ Panu Pasanen follow-up — DONE (completed 02:47 UTC)

[Read] Draft preview:
  ---
  Dear Panu,

  Following up on Simon's intro — I'm excited about the opportunity
  to integrate Lifetime Oy's Agent-as-a-Service with One Click LCA's
  workflows...
  [rest of draft]
  ---

[Copy] [Edit] [Send] [Request Changes]

👉 Click [Copy] → paste into email → send to Panu via Simon Sim

✓ Mark as sent
```

---

## Monitoring Queue Health

**Check queue status:**

```bash
# See all queued items
tail -20 .workflows/opencode-all/queue.jsonl

# Count by state
grep "state.*PENDING" .workflows/opencode-all/queue.jsonl | wc -l  # waiting
grep "state.*IN_PROGRESS" .workflows/opencode-all/queue.jsonl | wc -l  # running
grep "state.*DONE" .workflows/opencode-all/queue.jsonl | wc -l  # ready for HIC
```

**Watch batch worker log:**

```bash
tmux attach -t opencode-all  # see live sessions
```

**Troubleshoot stuck item:**

```bash
# If item stuck in IN_PROGRESS > 24h, manually reset:
jq '.state = "PENDING" | .startedAt = null' queue.jsonl > queue.jsonl.tmp && mv queue.jsonl.tmp queue.jsonl
```

---

## Option A + Option B Together

**Typical day:**

| Time           | HIC Action                | System       | Result                                          |
| -------------- | ------------------------- | ------------ | ----------------------------------------------- |
| 08:00          | Queue 5 items for async   | opencode-all | Agents work all day                             |
| 10:00          | Interactive triage (Grok) | Option A     | Draft replies ready for approval                |
| 14:00          | Afternoon items arrive    | Option A     | Hand to Grok (if anonymized) or Queue for async |
| 20:00          | Overnight results ready   | Option B     | Handoffs in `.claude/handoffs/opencode-batch/`  |
| 08:30 next day | Review overnight results  | Option B     | Copy & send 5 drafts + analyses                 |
| 09:00 next day | New queue batch           | opencode-all | Agents work all day (repeat)                    |

**Why both?**

- **A**: Fast, interactive, HIC-driven (right now)
- **B**: Async, thorough, agent-driven (all day/night)
- **Together**: 24/7 coverage. HIC sleeps; agents work. Results ready in the morning.

---

## Constraints & Safeguards

### No Raw PII in Handoffs

- Agent must strip/pseudonymize customer data before writing `.claude/handoffs/opencode-batch/*.md`
- HIC spot-checks: if raw PII found, mark item for re-review and flag agent

### No Email Auto-Send

- Agents draft only; never auto-send customer-facing email
- HIC reviews draft, then sends manually

### Restart-Safe Handoffs

- Result file is idempotent: if agent re-runs, overwrites same file (no duplicates)
- HIC can safely reuse result multiple times (it's immutable once done)

### Audit Trail

- Queue state file is append-only (JSONL)
- Handoff files are in git (full audit via `git log -- .claude/handoffs/opencode-batch/`)
- Session logs available via `opencode-all` tmux session + `.ci-audit/runs/`

---

## When Option B Fails

**If a queued item fails:**

1. **Check queue state** → `state: FAILED` or `state: STUCK`
2. **Read agent error** → in `.ci-audit/runs/` for that session
3. **Options:**
   - **Retry:** Reset to `PENDING`, re-queue (agent tries again)
   - **Manual:** Take control with Option A (click "Take as HIC", do it interactively)
   - **Escalate:** Flag for Code Review; may indicate missing capability

---

## Version History

| Version      | Date       | Changes                              | Author      |
| ------------ | ---------- | ------------------------------------ | ----------- |
| 1.0 [Latest] | 2026-09-13 | Option B async queue spec + workflow | Claude Code |

---

**Status:** Ready to integrate with Mission Control UI. Awaiting HIC approval to activate async queue feature.
