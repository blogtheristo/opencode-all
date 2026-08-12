---
title: B2B2B Outreach — Lessons Captured
status: living document
owner: Founder, CEO (Risto Anton Päärni)
purpose: Stop repeating known mistakes across steel / cement / aluminium / process-industry accounts.
---

## L1 — Sales KAMs are the buyer in B2B2B

**Observation.** Outokumpu, first contact, May 2026. Cold note went to Heidi Peltonen, VP Sustainability. Polite decline. Second-pass thinking proposed segment VPs / Business Area presidents as the "commercial owner." Boardy and Risto then sharpened it further: the right target is one layer deeper — the **Sales Key Account Manager (KAM)**.

**Why KAMs beat segment VPs for this wedge.**

| Dimension                                      | Segment VP / BA President                    | Sales KAM                                                  |
| ---------------------------------------------- | -------------------------------------------- | ---------------------------------------------------------- |
| Distance from the pain                         | Hears it third-hand at QBRs                  | **Sends the apology email when CO2 data is missing**       |
| Authority for no-cost pilot on **one** account | Will delegate to a KAM anyway, +2 weeks      | **Can say yes on the next call**                           |
| KPI alignment                                  | Segment revenue, mix, multi-account strategy | **Win/save the named accounts in their portfolio**         |
| Escalation path                                | We escalate up to them — closed-door         | KAM escalates up internally — open-door                    |
| Procurement / legal block                      | Triggers full vendor onboarding              | One-page MNDA on a single-account pilot rarely triggers it |
| Number of triage emails/day                    | ~200, ours dies                              | ~50, ours stands out                                       |

**Rule going forward.** For any steel / cement / aluminium / chemicals / process-industry account that exports into CBAM-exposed value chains:

1. **Default target:** the Sales KAM who owns one named CBAM-exposed end-customer.
2. **Hard precondition before sending:** identify the **specific end-customer in that KAM's portfolio**. The subject line names that customer. No customer name = no send.
3. **Never default to:** VP/Head of Sustainability, Head of ESG, Chief Sustainability Officer.
4. **Don't lead with:** Business Area president, segment SVP/VP, or Head of KAM. They are the _escalation path_ the KAM will use after the 10-minute call, not the first email.
5. **Sustainability can bless, not sponsor.** Sometimes CC'd at the pilot stage. Never the first email.

**Test before sending.** Three questions:

- _"Does this person own a specific customer relationship in a CBAM-exposed segment?"_ (must be yes)
- _"If they say yes, can they get a no-cost MNDA signed on one of their accounts inside 2 weeks?"_ (must be yes)
- _"Does the win/save of one named order move their personal number?"_ (must be yes)

If any answer is no, wrong person.

## L2 — Pitch frame: customer-of-customer pain, not our product

**Wrong frame** (what we sent first): "We help with CBAM reporting." Reads as a Sustainability tool.

**Right frame:** "Your KAM in Automotive is losing/delaying orders because the fabricator needs verified mill-level CO2 and you can't deliver it on time. We turn the data your mills already produce into the record their declaration needs. Your KAM sends a number, not an apology."

**Rule.** Lead with the **customer's customer pain**, never with our internal capability and never with regulatory acronyms in the first sentence.

## L3 — Ask: 10 minutes, two named days

- 20 minutes = "discovery." Commercial leaders block it.
- 10 minutes = "I respect your calendar and I know what I want to show you."
- Always offer **two named days**, not "next week." Removes scheduling ping-pong.

See `outreach/PLAYBOOK_10MIN.md`.

## L4 — Pilot frame: one account, one pain, one pilot, no cost

- 60 days.
- 2–3 of _their_ accounts where the conversation is already live.
- No cost to them.
- One measured number: **order won or saved**.

Anything more elaborate (multi-stakeholder, tiered, paid PoC) loses the meeting before it starts.

## L5 — Sender identity is non-negotiable

**Observation.** Multiple early drafts truncated the sender name to "Risto Paarni" (no umlauts) and title to "CEO" (missing "Founder,"). After 7 months in this repo. Root cause: `CLAUDE.md` itself had the wrong record. The model was repeating canonical-but-wrong data.

**Fixes applied.**

- `CLAUDE.md` → "Sender Identity" block promoted to top of file.
- `CLAUDE.md` → "Legal Identity Rule" corrected: **Päärni** (both umlauts), **Founder, CEO**, phone **+358 400 319 010**.
- `skills/signature/SKILL.md` → single source of truth for cold / warm / legal / byline sigs.
- `.claude/hooks/check-signature.sh` → pre-commit guard, blocks any `outreach/**/*.md` containing "Paarni" (no umlauts) or "CEO, Lifetime Oy" without "Founder,".

**Rule going forward.** Every external-facing draft uses the cold sig **verbatim** from `skills/signature/SKILL.md`. No improvisation, no shortening to "Risto Paarni / Lifetime Oy," ever.

## L6 — When sustainability replies first, redirect, don't argue

If a Sustainability contact replies politely declining (as Heidi did), do **not**:

- Re-pitch them on the same CBAM angle.
- Argue the value.
- Escalate up the Sustainability chain.

Do:

- Thank them, short and warm.
- Quietly route the next email to the **commercial owner** identified per L1.
- If the commercial owner later forwards it back to Sustainability for blessing, that is fine and expected.

## Open questions (capture, do not guess)

- Confirmed commercial-owner names at Outokumpu (Business Area Europe, Automotive segment, Industrial segment, KAM head) — **research before sending B3B_OUTOKUMPU_COMMERCIAL.md**.
- Same persona research needed for next-target accounts (SSAB, ArcelorMittal Europe, Salzgitter, Aperam, Acerinox).
