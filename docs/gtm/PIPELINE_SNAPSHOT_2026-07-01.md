# Pipeline & Win-Loss Capture — Manual Rep #1

---

# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:

- Version: 1.0 | Tool: Claude Code (Sonnet 5) | Session: claude/gtm-skills-planning-7ui3kd | Date: 01.07.2026 | Changes: First manual rep of win-loss/pipeline capture per the Skill Codification Rule (GTM_SKILLS_GAP_PLAN_2026.md §2.3). Captures current-stage snapshot for all 6 active named GTM motions found in the repo, and defines the win/loss template to be filled the moment any deal actually closes.

Document Status:

- Created: 01.07.2026
- Last Modified: 01.07.2026
- Language: English
- Languages Available: EN
- Publication Status: DRAFT
- Classification: INTERNAL — CONFIDENTIAL (named prospects)
- Document Type: GTM Pipeline Capture

Related Documents:

- docs/gtm/GTM_SKILLS_GAP_PLAN_2026.md (§2.3 Win/loss post-mortem capture)
- sales-outreach/INTRO_ARI_HIRVONEN_OUTOKUMPU.md
- sales-outreach/INTRO_FRIDA_AHLBERG_SIEMENS.md
- sales-outreach/INTRO_MARIA_SEDERHOLM_KEMIRA.md
- docs/partnerships/qantic-deal-proposal-v5.md
- docs/sales/2026-05-28-rightful-oy-partnership-proposal.md
- docs/sales/xAI-Optimus-Partnership-Proposal-v2.0.md

---

## 0. Honest starting condition

**Zero deals in this repo have a documented closed outcome (won or lost) as of
01.07.2026.** Every named motion found is prospecting, draft, or active-pitch
stage. SSAB and Cloudflare entries are explicitly marked "illustrative
target"/"product positioning," not real engagements — they are excluded below.

This means the _win/loss_ half of this capability has nothing to analyze yet.
What this rep actually delivers: (a) a stage/risk snapshot of the real pipeline
today, so drift is visible next time this is run, and (b) the win/loss entry
template, ready to fill the moment any of these motions actually closes.

## 1. Current pipeline snapshot (6 active motions)

| Deal                                    | Contact / Role                 | Stage                                              | Since                      | Blocker / next action                                                                                                                                          | Source                                                      |
| --------------------------------------- | ------------------------------ | -------------------------------------------------- | -------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| Qantic (BESS + compliance API)          | Thomas Kalitzky                | Scoping call held 26.03.2026; no NDA signed        | 26.03.2026                 | Confirm how many of Qantic's ~10 referenced clients are actually CSRD-obligated (claimed 3–5 of ~10) before committing engineering time to the API integration | `docs/partnerships/qantic-deal-proposal-v5.md`              |
| Outokumpu                               | Ari Hirvonen (R02 IP Director) | Outreach sent 18.05.2026, door #1 identified       | 18.05.2026                 | No reply logged yet                                                                                                                                            | `sales-outreach/INTRO_ARI_HIRVONEN_OUTOKUMPU.md`            |
| Siemens SI Building Nordics             | Frida Ahlberg                  | LinkedIn connect sent 20.04.2026                   | 20.04.2026                 | Awaiting reply; follow-up A scheduled if no reply by 25.04.2026 (past due — check if sent)                                                                     | `sales-outreach/INTRO_FRIDA_AHLBERG_SIEMENS.md`             |
| Kemira                                  | Maria Sederholm (R19 CRO lane) | Material package ready, not yet sent               | 24.06.2026                 | Send; co-door Mikko Pohjala (VP Strategy) opener drafted but unsent                                                                                            | `sales-outreach/INTRO_MARIA_SEDERHOLM_KEMIRA.md`            |
| Rightful Oy (partnership, not customer) | Tatu Heiskanen                 | Proposal drafted, not sent                         | 28.05.2026                 | Confirm availability for 30-min discovery call                                                                                                                 | `docs/sales/2026-05-28-rightful-oy-partnership-proposal.md` |
| xAI (Grok + Optimus)                    | —                              | Active pitch, seeking lead investor for €500k SAFE | 27.02.2026 (v2.0 same day) | Seeking Fleet Admiral investor                                                                                                                                 | `docs/sales/xAI-Optimus-Partnership-Proposal-v2.0.md`       |

**Pattern worth flagging on this first rep:** 3 of 6 motions (Kemira, Siemens
follow-up, Rightful) have a drafted or scheduled next action that is **not yet
executed** as of the source document's own timestamp. That's not a win/loss
signal — it's a pipeline-hygiene signal this capture format surfaces for free.

## 2. Win/loss entry template (for the first deal that actually closes)

```
### <Deal name> — WON | LOST | STALLED
Date closed: <date>
Contact / role: <name, R-ID from DWS_ROLES_REGISTRY.md>
Deal size / tier: <e.g. Enterprise Premium €8,950/yr>
Sales cycle length: <first outreach date → close date>
Competitor(s) in the deal, if known: <name>

**What worked:**
- <specific objection handled, moat cited, wedge that landed>

**What didn't:**
- <specific objection NOT handled, missing proof point, pricing friction>

**Verbatim buyer language (for lead-feedback.agent.ts keyword loop):**
- "<quote>"

**Feeds into:**
- Battlecard update (docs/gtm/BATTLECARDS_2026-07.md) if a competitor pattern
- lead-feedback.agent.ts keyword suggestions
- Pricing doc if a pricing objection recurs 3+ times
```

## 3. What this rep tells us about codifying a skill

Per the Skill Codification Rule, this is rep 1 of 3–10. It already surfaced a
real, actionable finding (§1 pattern) without any win/loss data existing yet —
worth continuing manually for the next 2–4 pipeline reviews (roughly biweekly,
matching the pace these deals move at) before templating into a skill. A skill
templated on zero real closes would just be an empty form; better to wait until
at least one entry exists in §2 for real.

**Next rep trigger:** any of the 6 deals above changes stage, or 2 weeks elapse,
whichever is first.
