# HIL Investor Outreach — How-To

***
# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:
  - Version: 1.0 | Tool: Claude Code (Opus 4.7) | Session: claude/investor-outreach-strategy-iwJxq | Date: 2026-04-19 | Changes: Initial release. Codifies the Human-in-Loop (HIL) pattern for the DWS IQ 6 SAFE round — Claude drafts assets, Risto sends from his own inbox. Locks focus doctrine (sell V1 to PE meeting investors + Messe Germany buyers, not entrepreneur networking). Documents the /investor-outreach skill, INTRO file template, exclusion rules, and daily 5-emails-before-10am rhythm.

Session Links & References:
  - Skill: .claude/commands/investor-outreach.md
  - Skills guide: docs/DWS_SKILLS_GUIDE.md §6.4
  - Canonical INTRO template: investor-outreach/INTRO_LAURA_RAGGL_ROI_VENTURES.md
  - HIL tooling: investor-outreach/HIL-README.md
  - Daily tracker: investor-outreach/daily-outreach-tracker.md

Document Status:
  - Created: 2026-04-19
  - Last Modified: 2026-04-19
  - Language: English
  - Languages Available: English
  - Publication Status: ACTIVE — Private (Learn/)

***

## 1. What HIL Means Here

**Human-in-Loop.** The agent prepares the outreach asset. The human sends it. No auto-send, no impersonation, no mass mail.

| Role   | Who      | Job                                                                                                  |
| ------ | -------- | ---------------------------------------------------------------------------------------------------- |
| Agent  | Claude   | Draft INTRO files, triage the pipeline, generate follow-ups, enforce exclusion rules                 |
| Human  | Risto    | Verify match quality, send from personal inbox, handle live replies, update tracker, sign the deal   |

The agent is fast. The human is accountable. Together: 5 emails before 10am, every working day.

## 2. The Focus Doctrine (2026-04-19)

**Who we are pitching**

- Investors at **PE meetings** (captain seats, syndication, anchor checks)
- **German Messe buyers** — industrial CFOs in construction and manufacturing who sign EUR 25K+ contracts
- **Post-Arctic 15 pipe** — Arctic 15 (Helsinki, June 15) is a brand moment. The real commercial push is the German Messe after V1 launch.

**Who we are NOT pitching**

- Entrepreneur-networking circuits
- Generic accelerator demo days
- Competition / prize tracks without a real check attached

**The round**

- EUR 650K SAFE at EUR 3.8M cap
- Captain seat: EUR 50K. Double: EUR 100K. Triple: EUR 150K.
- Messe hook: first German sales data available August 15 — investors who commit pre-Messe enter at seed valuation ahead of that drop.

## 3. The Daily Rhythm

**Morning block, before 10am:**

1. Open `investor-outreach/daily-outreach-tracker.md`
2. Run `/investor-outreach ready` — returns the WARM queue (drafts ready to send, not yet contacted)
3. Send 5 emails from risto@onelifetime.world — copy the **Draft Email** section from each INTRO file, paste into Gmail, attach one-pager
4. Update the INTRO file header: `Status: WARM` → `Status: CONTACTED` with date
5. Tick the day in the tracker

**Afternoon block:**

- Reply to anyone who responded (Calendly link if positive, short traction note if neutral, intro ask if negative)
- Run `/investor-outreach followup` for anyone CONTACTED 5+ days ago with no reply

**Weekly block (Friday):**

- Review weekly goal vs actual in the tracker
- Run `/investor-outreach triage focus="messe-germany"` to re-rank the pipeline
- Flag any INTRO that still reads as "entrepreneur networking" for rewrite

## 4. Pipeline Stages

Each investor moves through five stages. Every INTRO file has a `Status:` header that reflects which stage they are in.

| Stage        | Status      | Who acts | Trigger                                             |
| ------------ | ----------- | -------- | --------------------------------------------------- |
| Match        | WARM / COLD | Human    | Name + firm + LinkedIn + thesis supplied            |
| Drafted      | WARM / COLD | Agent    | INTRO_<NAME>_<FIRM>.md file exists                  |
| Contacted    | CONTACTED   | Human    | Email or DM sent                                    |
| Follow-up    | CONTACTED   | Agent    | 5+ days without reply → generate follow-up          |
| Closed       | DECLINED / COMMITTED | Human | Deal outcome logged                                |
| Parked       | HOLD        | Agent    | Hard blocker (e.g. solo-founder exclusion, founder geography mismatch) — reactivation triggers noted |

## 5. The `/investor-outreach` Skill

| Action     | What it does                                                                              |
| ---------- | ----------------------------------------------------------------------------------------- |
| `add`      | Draft a new INTRO file from supplied match metadata                                       |
| `list`     | Table of all INTRO files with status, filterable                                          |
| `triage`   | Re-rank INTROs against a focus (messe-germany, pe-meeting, sovereignty)                   |
| `ready`    | Show the WARM-and-not-yet-CONTACTED queue — the daily send list                           |
| `followup` | Draft a follow-up for a CONTACTED investor with no reply                                  |
| `status`   | Show one investor's full state — header, history, next-steps                              |

Full spec: `.claude/commands/investor-outreach.md`

## 6. The INTRO File Template

Canonical reference: `investor-outreach/INTRO_LAURA_RAGGL_ROI_VENTURES.md`

Every INTRO file MUST contain:

- **VERSION AND AGENT HISTORY** block (DWS Document Standard)
- **Status** — WARM / COLD / CONTACTED / HOLD / DECLINED / COMMITTED
- **Story Lock** — which story we pitch (Story A carbon / Story B Aegis / mixed)
- **Intro Type** — Warm / Cold / Blocked
- **Target Profile table** — name, role, fund, ticket, stage, focus, location, LinkedIn
- **Fit Assessment** — 3-7 numbered alignment points with concrete thesis matches
- **Drawbacks / Mitigations** — explicit acknowledgment of mandate walls
- **Strategy** — what to lead with, what to hide, attachment policy
- **Draft LinkedIn DM** — short, first touch
- **Draft Email** — long form, one-pager attached
- **Attachments to Send** — checklist including what NOT to send
- **Next Steps** — checkbox list

## 7. Exclusion Rules (Always Enforced)

When drafting the Strategy section, the skill enforces:

| Fund signal                    | Enforcement                                                              |
| ------------------------------ | ------------------------------------------------------------------------ |
| Excludes defense / dual-use    | Suppress Aegis, sovereignty, military, defense language entirely         |
| Excludes climate tools         | Reframe as "regulatory compliance infrastructure" (legal mandate)        |
| Solo-founder blocker           | HOLD the intro, or lead with operator track record + advisors + paying customers |
| Geographic founder preference  | Acknowledge directly, let thesis fit carry the conversation              |

**Do NOT mention:** Boardy, Fleet Admiral, robotics, Jetson, world models in V1-era investor pitches.

## 8. Banned Phrases

| Banned                | Replace with                                  |
| --------------------- | --------------------------------------------- |
| "climate tool"        | "regulatory compliance infrastructure"        |
| "ESG software"        | "EU compliance automation"                    |
| "disrupt"             | delete, replace with a specific claim         |
| "revolutionary"       | delete                                        |
| "save the planet"     | "meet legal reporting deadlines"              |

## 9. What to Attach

**First touch:**

- `INVESTOR_MEMO_ONE_PAGER.md` — single page, paying-customer numbers, ticket options

**After initial interest:**

- `INVESTOR_MEMO.md` (v5.2) — full memo
- `INVESTOR_MEMO_AEGIS.md` — dual-use angle ONLY for funds that allow defense
- `captain-deck.md` — after call scheduled

**Never attach to funds that exclude defense:**

- `INVESTOR_MEMO_AEGIS.md`
- `DEFENSE_SOVEREIGNTY_INVESTORS_2026.md`

## 10. Tracker Integration

`investor-outreach/daily-outreach-tracker.md` is the human accountability layer. One row per day, one column per metric (emails sent, responses, calls scheduled).

**The rule:** tick the day ONLY when all 5 emails are sent. No partial credit.

**The math:** 5 emails × 5 days × 16 weeks = 400 emails. At a 20% response rate: 80 responses → 40 calls → 20 meetings → 3-5 commits.

## 11. Common Pitfalls

1. **Pitching to the wrong list.** If the match source is an entrepreneur community, it is probably not a buyer. Check the fund's mandate before drafting.
2. **Attaching Aegis to a defense-exclusion fund.** One-way trip to the bin. Read the exclusions field in every INTRO.
3. **Sending without reading the Drawbacks section.** The drawback is why they might pass. Address it in the opening, don't hope they won't notice.
4. **Skipping the follow-up.** 60% of replies come on touch #2 or #3. Silence on day 5 is not a no.
5. **Entrepreneur-networking tone.** "Let's grab coffee and chat about the journey" is for demo days, not for closing a EUR 650K SAFE. Lead with traction, check size, and timeline.
6. **Letting the tracker drift.** An un-ticked tracker becomes an un-sent pipeline within a week.

## 12. When To Hold An Intro

Park an INTRO file as `Status: HOLD` — do not send — when any of the following is true:

- Fund has a hard criterion we don't meet (e.g. 2-3 co-founder requirement for a solo-founder round)
- Fund's stated exclusions kill the core thesis (defense-exclusion + our best angle is Aegis)
- Warm channel has a narrow window and we need leverage first (post-Messe traction, named co-founder, inbound intro via portfolio)

Every HOLD file must list **reactivation triggers** — the specific conditions under which the file moves back to ACTIVE.

## 13. Where This Fits in DWS

The `/investor-outreach` skill is a DWS IQ 6 operations skill, registered in `docs/DWS_SKILLS_GUIDE.md` §6.4. It is a workflow skill — it does not invoke a DWS IQ agent. The agent is Claude, the tool is the template, the output is a paste-ready email for Risto's inbox.

The underlying agents (DWS IQ compliance, carbon-analysis, sovereignty-assess) generate the **substance** of what we pitch — MRR, customer counts, compliance coverage, sovereignty posture. The INTRO file is the **shape** of how we pitch it to each specific investor.

## 14. One Rule

If the outreach cannot end with **a check in the EUR 50K - EUR 150K Captain seat range** or **a EUR 25K+ contract at the German Messe**, it is not investor outreach — it is networking. Do it on your own time.
