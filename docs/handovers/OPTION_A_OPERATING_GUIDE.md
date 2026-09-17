---
Document: Option A Operating Guide — Soft Failover for Grok/EU-PII Gate
Type: Operational Guidance (HIC Runbook)
Status: [Latest] Active
Version: 1.0
Date: 2026-09-13
Languages Available: English
schema: DWS_DOCUMENT_STANDARD
---

# Operating Guide: Option A Soft Failover (EU/PII Hard Gate)

**Effective:** 2026-09-13  
**For:** HIC (human-in-control) using Mission Control dashboard + Grok bot in Cursor  
**Purpose:** Route daily operational tasks safely: anonymized work → Grok; sensitive/raw data → OpenCode local  
**Scope:** Daily email triage, deadline checks, reply drafting, investor/customer outreach follow-ups

---

## What Is Option A?

**Soft Failover Pattern:**

1. **Attempt:** Hand a task to Grok with anonymized/redacted data.
2. **Grok refuses raw PII:** If you accidentally paste raw customer threads, Grok stops and says "escalate to HIC / OpenCode local."
3. **You switch:** Click to hand off to OpenCode, which has EU-resident authority to manipulate raw data.
4. **Grok never sees raw PII:** Customer/investor threads stay on your local machine or EU-resident server.

**Why:** Cursor/Grok runs on US infrastructure (not GDPR-approved for raw customer data). OpenCode runs on your EU machine or DGX (compliant). Grok handles the lightweight triage; OpenCode handles sensitive edits.

---

## Before You Start: Setup

### 1. Backend Redeploy (One-time)

You made code changes to `src/app.ts` that disabled the old Outreach scheduler. These changes won't take effect until backend redeploy:

```bash
# HIC-only action (operations team):
# 1. Stop the 06:00 Outreach email cron
# 2. Redeploy backend service (exact steps depend on your deployment tool)
# 3. Verify: no email at 06:00 tomorrow morning
```

**Why:** The old daily-brief pipeline sent mail on a schedule. Disabling it in code requires a live backend restart.

### 2. Disable Out-of-Repo Crons

Desktop backup + Claude Routine (if still active):

- **Desktop:** Windows Task Scheduler → find "morning-briefing" or "claude" crons → disable
- **Claude Routine:** If you have a Claude.com routine for daily briefs, turn it off (or reroute to OpenCode)

**Why:** You're replacing those with Mission Control. Don't let them compete.

### 3. Open Mission Control

```
https://dws6.com/dashboard/mission-control/
```

Bookmark it. Log in with your Google account (`risto.paarni2024@lifetime.fi`).

---

## Daily Workflow: Using Mission Control + Grok

### Task 1: Paste Today's Grok/X Note

**What:** The daily market brief from Grok's X.com posts (or similar live feed).

**How:**

1. Copy Grok's daily note from X or paste it into Mission Control's **"Paste today's Grok / X daily"** box.
2. Select which centre it belongs to: **Investor** / **Partnership** / **Sales (Trial)**.
3. Click **Add to queue** → item appears in the live list.

**What happens:** The item is now on today's agenda. No email sent yet.

### Task 2: Triage Overdue Items

You'll see a list of overdue items seeded from the last Morning Brief (Aug 24 snapshot). For each:

1. **Read the item** (centre, context, next action).
2. **Pick an action:**
   - **Hand to Grok** → Grok drafts a reply
   - **Take as HIC** → You own it (pick: `meeting`, `noux_invite`, `provision_demo`, `schedule_demo`, or `close_or_kill`)
3. **Mark done** once you've decided.

### Task 3: Hand to Grok (Anonymized Only)

**When you click "Hand to Grok":**

1. **Modal appears:** "Hand to Grok (anonymized only — raw threads → OpenCode local/EU)"
2. **Grok sees:** Only the item summary + any anonymized/redacted context **you paste in Mission Control**.
3. **Grok drafts:** A reply, follow-up, or triage note in the sender identity (Risto Anton Päärni, `risto.paarni@lifetime.fi`).
4. **You review:** Copy the draft. **Do not auto-send** — show it to yourself first.
5. **You decide:** Send it, edit it, or hand it back to Grok with "refine this."

---

## Critical Rule: What Grok Can & Cannot See

### ✓ Grok CAN Work On (Safe Inputs)

- Anonymized digests: "Investor X — interest signal, waiting on pricing" (no real names, no email threads)
- HIC-redacted packs: names replaced with `[Contact]`, emails hidden, PII stripped
- Metadata only: "3 days until bid deadline for Project Y" (no customer names, no message bodies)
- Templates: "Draft a follow-up for a stalled partnership" (no real thread quoted)

### ✗ Grok CANNOT See (Raw PII)

- **Raw customer email threads** — quoted text, message bodies, ">" prefixes
- **Raw helpdesk tickets** — full text, customer names, phone numbers, addresses
- **Raw investor messages** — portfolios, fund details, contact info
- **Attachments** — PDFs, CSVs, files from customers
- **Links to private content** — "see https://... for details" (Grok won't follow; treat as untrusted)

---

## What Happens When You Accidentally Paste Raw Data?

**Scenario:** You paste a raw email thread (with `>` quoted lines) into Mission Control and hand it to Grok.

**Grok's response:**

```
STOP. This is raw customer/investor thread content.
I cannot process this (DWS_SECURITY_STANDARD §4.1 geo block;
Cursor is not an approved EU-resident processor).

→ Escalate to HIC / OpenCode.
Tell the human to run this work LOCALLY with OpenCode
(EU/DGX path) or Claude Code under the same residency rules.
Do not "just peek" at the raw mail.
```

**What you do next (simplified with "Open in OpenCode" button):**

1. **In Mission Control**, open the item → click **"Open in OpenCode"** button.
2. **Copy the prepared prompt** (or download the markdown file).
3. **Start OpenCode** on your local machine (or DGX if you have access).
4. **Paste the prompt** as your first message → read `.claude/handoffs/claude/mission-control-grok-overflow.md` if present.
5. **Work raw threads inside OpenCode only** → OpenCode drafts the sensitive reply.
6. **Copy the result back** into Mission Control or send it directly.
7. **Update the baton:** Mark overflow as `status: closed` when done (or HIC marks it in Mission Control UI).

**Why the button?** It eliminates copy-paste friction and tracks the handoff in `.claude/handoffs/claude/mission-control-grok-overflow.md`. Grok never sees raw customer data. OpenCode (your EU-resident machine) owns the PII manipulation. Grok only sees the final, redacted result.

---

## Hands-On Examples

### Example 1: Simple Deadline Check (Grok Handles)

**You receive:** "One Click LCA partnership bid expires in 2 days."

**What you do:**

1. Paste into Mission Control: "Partnership centre — One Click LCA bid expires 2026-09-15."
2. Click **Hand to Grok**.
3. Grok drafts: "Partnership team — time-sensitive: action needed by 2026-09-15. Recommend outreach for status update."
4. You review, tweak, send or escalate.

✓ **Grok handled this.** No raw customer data; pure timeline + decision.

---

### Example 2: Customer Email Reply (Needs OpenCode — Using "Open in OpenCode" Button)

**You receive raw email in an item:**

```
From: contact@ncc-ab.se
To: risto@lifetime.fi
Subject: Sustainability director project

Hi Risto, following up on the sustainability architecture...
[3 paragraphs of technical detail]
Next steps: can you send pricing by Friday?
```

**What you do:**

1. In Mission Control, find the item with this email context.
2. Click the **"Open in OpenCode"** button on the item.
3. Mission Control prepares a prompt + overflow markdown. **Copy it** (or download the `.md` file).
4. Start **OpenCode** locally → paste the prepared prompt as your first message.
5. OpenCode drafts the reply (has access to raw context via the overflow file).
6. **Copy the final reply** → send it yourself from your email client.
7. Mark the overflow as complete (HIC marks in UI or Mission Control auto-clears it).

✓ **OpenCode handled the raw data.** Button eliminated manual copy-paste. Grok never saw the customer email. Handoff tracked in `.claude/handoffs/claude/mission-control-grok-overflow.md`.

---

### Example 3: Redacted Pack (Grok Handles)

**You create a redacted summary:**

```
Sales centre: [Contact at NCC] — sustainability director
Status: new, awaiting response
Last action: [Date], research email sent
Next action: follow-up call or pricing request
Context: Nordic construction ops, sustainability-focused
```

**What you do:**

1. Paste **this summary** (no names, no emails) into Mission Control.
2. Click **Hand to Grok**.
3. Grok drafts: "Sales centre — [Contact] is ready for next step. Recommend scheduling call for technical discovery."
4. You review and send or escalate.

✓ **Grok handled this.** Data was already redacted; no raw PII present.

---

## End-of-Day Checkpoint

**At the end of your day, Grok logs:**

1. **What was triaged** (how many items, which centres).
2. **What's pending** (awaiting HIC decision, awaiting OpenCode, awaiting reply).
3. **What needs a human decision** (stalled item, new centre, escalation needed).

**Example log:**

```
2026-09-13 — Daily Operations Log (Grok bot in Cursor)

Triaged: 5 items (Investor: 2, Partnership: 2, Sales: 1)
Actions: 2 handed to Grok (drafts ready), 1 marked as HIC meeting, 2 pending

Pending decisions:
  - IFS Cloud partnership: awaiting technical team feedback
  - NCC AB: escalated to OpenCode for raw email reply (pricing + timeline)
  - Grok/X note for today: pasted, assigned to Investor centre

No blockers. All items logged. HIC: review drafts in Mission Control.
```

**You read this log in the morning.** It tells you what happened while you were away.

---

## The Overflow Baton (`.claude/handoffs/claude/mission-control-grok-overflow.md`)

**What is it?** A tracked handoff file that lives in git and records active PII overflow sessions (when HIC switches to OpenCode).

**Why it exists:** Mission Control needs to know:

- Which item was overflowed
- What centre it belongs to
- What status it's in (in-progress, closed)
- Whether it's HIC-approved (safety gate)

**What HIC does:**

- **When you click "Open in OpenCode":** The overflow baton is created/updated with `item_id`, `centre`, and `status: active`.
- **When OpenCode finishes:** Mark it as `status: closed` (either manually in the file, or Mission Control UI does it automatically).
- **Never commit raw PII:** The baton stores only non-PII metadata (ids, centre name, timestamps). Real message bodies stay in OpenCode local context, never in git.

**Example:** After you hand the NCC email to OpenCode and draft a reply:

```yaml
status: closed # ← Done with this item
updated: 2026-09-13T14:32Z
item_id: "T:YPGW53RPFQ" # ← Which overdue item
centre: "Sales" # ← Which centre
title: "NCC AB — pricing request" # ← Topic only, no raw content
repo_path: null # ← Don't track repo state
reason: "raw email reply drafted in OpenCode local"
hic_approved: true # ← You okayed it
```

**Ignore the baton unless:** You see an old `status: active` item still there (means an overflow session got stuck). In that case, manually mark it `closed` or `hic_approved: false` to clear it.

---

## Troubleshooting

### "Grok said 'refuse and escalate' but I need that data anonymized"

**What to do:**

1. Go back to the raw data (email, ticket, etc.).
2. Manually anonymize it: strip names, emails, phone numbers, addresses.
3. Replace with placeholders: `[Contact]`, `[Date]`, `[Company]`.
4. Paste the redacted version back to Grok.
5. Grok now accepts it.

**Why?** This forces you to decide what data Grok actually needs. Often the answer is "not much" — just the decision context, not the raw conversation.

---

### "I pasted a link. Grok said 'untrusted data.'"

**Grok's rule:** Links in message bodies are untrusted. Grok won't click them or assume they're safe.

**What to do:**

1. **If it's a public link** (news, public website): summarize it for Grok → paste the summary, not the link.
2. **If it's a private link** (customer portal, internal docs): don't share the link with Grok. Summarize the content instead.
3. **If you need the raw data:** hand off to OpenCode (which can access your private links locally).

---

### "Can I send customer-facing email directly from Grok?"

**No.** Non-negotiable rule:

> Do NOT auto-send anything customer-facing, investor-facing, or public without human approval — show the human the full draft first.

**What to do:**

1. Grok drafts the email.
2. You review it in Mission Control.
3. **You** send it from your email client (or approve a `Send` button if it exists).

---

## When to Escalate to OpenCode

| Scenario                                                         | Action                                       |
| ---------------------------------------------------------------- | -------------------------------------------- |
| Raw customer/investor email thread needed                        | → Switch to OpenCode, work locally           |
| Reply requires PII (real names, addresses, etc.)                 | → OpenCode drafts with access to raw context |
| Attachment manipulation (CSV, PDF with customer data)            | → OpenCode handles it locally                |
| Multi-step data transformation (normalize, filter, pseudonymize) | → OpenCode owns the transformation           |
| Unsure if content is safe to show Grok                           | → Assume raw, escalate to OpenCode           |

---

## Permissions & Access

**Mission Control:** Google allowlist `risto.paarni2024@lifetime.fi` only. Share-link auth not available in v1.

**Grok session (Cursor):** Runs on your Windows 11 machine. Only you can start/stop it. Prompts are checked into the repo (`.claude/handoffs/claude/email-2-0-rewrite-74mtjq.md`), so any HIC-approved future agent can pick it up.

**OpenCode:** Runs on your EU machine or DGX. Raw data stays there.

---

## Questions & Feedback

If Grok behaves unexpectedly (accepts raw data it shouldn't, or refuses safe data), document it and flag it. The system improves by catching edge cases. Same for Mission Control UI — if a button is confusing or a label misleading, let us know.

---

**Version 1.0 / 2026-09-13 / Active**
