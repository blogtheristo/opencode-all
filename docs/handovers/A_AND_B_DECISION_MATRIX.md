---
Document: A + B Decision Matrix — When to Use Each Option
Type: Quick Reference (HIC Decision Guide)
Status: [Latest] Active
Version: 1.0
Date: 2026-09-13
Languages Available: English
schema: DWS_DOCUMENT_STANDARD
---

# Option A vs. Option B — Quick Decision Guide

**For HIC: Choose A or B for each item based on timing + complexity.**

---

## Decision Matrix

| Decision             | Option A (Now)                    | Option B (Async)                         |
| -------------------- | --------------------------------- | ---------------------------------------- |
| **Timing**           | Need result today                 | Can wait until tomorrow                  |
| **HIC availability** | I'm here now (interactive)        | I'll review results tomorrow             |
| **Complexity**       | Simple: triage, quick draft       | Complex: research, multi-step            |
| **Trigger**          | Urgent follow-up, decision needed | Background work, deep draft              |
| **Workflow**         | HIC ↔ Grok (Chat)                 | HIC → Queue → Agent → Handoff            |
| **Grok involved?**   | Yes (anonymized only)             | No (agents work in git)                  |
| **Approval gate**    | Yes (HIC reviews draft)           | Yes (HIC reviews result)                 |
| **Example 1**        | "Is NCC AB a lead or existing?"   | "Draft full NCC AB partnership proposal" |
| **Example 2**        | "Quick reply to investor ping"    | "Research IFS integration approach"      |
| **Example 3**        | "Send availability for call"      | "Prepare CSRD report for Friday"         |

---

## In Practice

### Scenario: NCC AB — Sustainability Director

**You receive:** Email from NCC asking about our approach.

**Decision flow:**

```
Q1: Do I need a reply today?
  └─ YES → Option A (use Grok for quick draft, you send)
  └─ NO → Option B (queue for overnight research + detailed proposal)

Q2: Is the raw email anonymized?
  └─ YES (or HIC-redacted) → Option A (Grok can handle it)
  └─ NO (raw customer content) → Option B (agents work in git, can see raw data)

Q3: How long should the result be?
  └─ 1-2 paragraphs → Option A (Grok draft, you send)
  └─ Full proposal / research → Option B (agent researches overnight)
```

**If you pick A:**

- Copy email → Mission Control or Grok chat
- Tell Grok: "Draft brief reply to NCC asking about timeline for decision"
- Grok drafts → you review → you send via email

**If you pick B:**

- Mission Control → Queue for async
- Context: "Prepare full partnership proposal for NCC: approach, technical approach, pricing, timeline. Make it concise (2 pages) and ready to send."
- Go to sleep
- Next morning: result in Mission Control → copy & send

---

## Examples: When to Use Each

### ✓ Use Option A (Interactive/Grok)

1. **Quick triage**
   - "Is this a real lead or spam?"
   - "What's the next action here?"
   - → Grok answers in 1-2 minutes

2. **Urgent decision**
   - "Should we take this meeting?"
   - "Is this investor credible?"
   - → You decide on Grok's summary

3. **Short reply**
   - "Send availability for Thursday call"
   - "Confirm receipt of bid documents"
   - → Grok drafts 1 paragraph → you send

4. **Real-time feedback**
   - "Refine this email — make it more technical"
   - "Add pricing section to this draft"
   - → Grok refines in chat → you send

### ✓ Use Option B (Async Queue)

1. **Deep research**
   - "Research IFS Cloud integration requirements"
   - "Find top 10 sustainability consultants in Sweden"
   - → Agent researches overnight → results ready morning

2. **Detailed proposal**
   - "Draft full partnership proposal for One Click LCA"
   - "Prepare CSRD report for InvestorX"
   - → Agent researches + writes overnight → you review morning

3. **Multi-step workflow**
   - "Create demo environment for IFS, generate invite link, draft intro email"
   - "Prepare presentation + handout PDFs for Friday meeting"
   - → Agent builds overnight → results ready morning

4. **Analysis & comparison**
   - "Compare Infor vs. IFS for LCA workflows"
   - "Analyze 5 partnership opportunities and rank by fit"
   - → Agent analyzes overnight → you get ranked summary morning

5. **Overnight processing**
   - "Generate CSRD compliance report for tomorrow's board call"
   - "Compile market research on climate fintech startups"
   - → Agent processes while you sleep → ready when you wake up

---

## Mixed Days: A + B Together

**Typical Thursday:**

```
08:00 — Morning (HIC)
  Read new items + overnight results
  Use Option A: Quick triage on 3 urgent items
  Use Option B: Queue 5 complex research tasks for overnight
  Action: Hand to Grok (anonymized) vs. Queue (complex)

10:00 — Mid-morning (Grok + Agents)
  Grok drafts quick replies (Option A)
  OpenCode agents start overnight queue (Option B)

14:00 — Afternoon (HIC)
  Review Grok drafts → send 3 emails
  New urgent item arrives → Hand to Grok (Option A)

18:00 — Evening (Agents)
  Grok finishes daily-ops triage
  OpenCode agents working on 5 complex tasks

22:00–08:00 — Overnight (Agents)
  OpenCode agents continue multi-hour research + drafting
  Results accumulate in .claude/handoffs/opencode-batch/

08:00 — Next morning (HIC)
  Review 5 overnight results
  Send 4 emails, request 1 revision
  Queue new batch for today
  Loop continues
```

---

## How Option B Works (Brief)

1. **HIC queues item** in Mission Control with context
2. **opencode-all batch worker** picks it up (every hour)
3. **Agent processes** in isolated worktree (can take hours/overnight)
4. **Result lands** in `.claude/handoffs/opencode-batch/<item_id>.md`
5. **HIC reviews** next morning → copy & send

See **Option B Async Queue** for full details.

---

## Constraints

### Option A (Grok)

- ✓ Fast (1-2 min turnaround)
- ✓ Interactive (you refine in real-time)
- ✗ Must be anonymized (no raw PII)
- ✗ Limited to Grok's scope (can't deep research)

### Option B (Async Agents)

- ✓ Deep work (research, analysis, multi-step)
- ✓ Can handle raw customer data (git-based, local)
- ✓ Runs overnight (results ready morning)
- ✗ Slower (takes hours, not minutes)
- ✗ No real-time feedback (review happens next morning)

---

## If You Can't Decide

**Default:** Use Option A (interactive). If Grok says "this needs OpenCode", then switch to Option B by using the "Open in OpenCode" button in Mission Control.

Or: Queue it for async if you're unsure — agent will figure it out.

---

## Version History

| Version      | Date       | Changes                            | Author      |
| ------------ | ---------- | ---------------------------------- | ----------- |
| 1.0 [Latest] | 2026-09-13 | A vs. B decision matrix + examples | Claude Code |
