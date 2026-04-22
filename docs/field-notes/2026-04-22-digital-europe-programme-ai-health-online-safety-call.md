# Field Note: Digital Europe Programme — €63.2M Call for AI in Health, Digital Skills & Online Safety (Deadline 2026-10-01)

---

# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:

- Version: 1.0 | Tool: Claude Code (Opus 4.7) | Session: claude/add-digital-europe-funding-rZaXx | Date: 22.04.2026 | Changes: Initial creation — funding radar note on the seven Digital Europe Programme calls announced April 2026 (€63.2M envelope); deadline 2026-10-01; DWS7 fit assessment for online-safety + AI-in-industry tracks

Session Links & References:

- Claude Code (claude/add-digital-europe-funding-rZaXx): https://github.com/blogtheristo/dws6/commits/claude/add-digital-europe-funding-rZaXx
- Trigger source: European Commission LinkedIn post (22.04.2026) announcing seven #DigitalEuropeProgramme calls
- Announcement link (shortened): https://lnkd.in/eRAGNp_X
- Related roadmap section: DWS7_ROADMAP.md — "EU Funding Programs" (line 703) and "Funding Application Calendar" (line 746)
- Related standards: DWS_STANDARDS_LIBRARY.md (Digital Europe Programme as claimable/target reference)

Document Status:

- Created: 22.04.2026
- Last Modified: 22.04.2026
- Language: English
- Publication Status: INTERNAL — research note, NOT for public sites

---

## 1. Trigger

European Commission LinkedIn post (22.04.2026):

> "€63.2 million are now available to support AI innovation in health and online safety. We have launched seven calls under the #DigitalEuropeProgramme to support work in artificial intelligence, digital health, digital skills, and online safety. The calls are open to research institutions, civil society, fact checkers, technology providers, and other relevant stakeholders. Part of this funding will also support the uptake and deployment of key digital technologies across Europe. The deadline for applications is 1 October 2026."

Source: https://lnkd.in/eRAGNp_X

## 2. Call Parameters (What We Know)

| Field           | Value                                                                     |
| --------------- | ------------------------------------------------------------------------- |
| Programme       | Digital Europe Programme (DIGITAL)                                        |
| Envelope        | €63.2 million total across seven calls                                    |
| Deadline        | 2026-10-01                                                                |
| Eligible        | Research institutions, civil society, fact-checkers, technology providers |
| Thematic focus  | AI, digital health, digital skills, online safety                         |
| Secondary focus | Uptake + deployment of key digital technologies across Europe             |

**Unknowns to resolve before application decision:**

- Per-call envelope split (7 calls × average €9M, or uneven distribution?)
- Consortium vs single-applicant rules per topic
- Co-financing rate (DIGITAL typically 50%, but can be 100% for SME/non-profit tracks)
- Topic IDs on the EU Funding & Tenders Portal (not yet indexed in our radar)

**Action:** Pull topic IDs from EU Funding & Tenders Portal before May 2026 scoping sprint. Owner: Risto.

## 3. DWS7 Fit Assessment

| Call Track (inferred)                   | DWS7 Fit | Angle                                                                                                                       |
| --------------------------------------- | -------- | --------------------------------------------------------------------------------------------------------------------------- |
| **AI in health**                        | Low      | Not our vertical; skip unless consortium partner brings health data                                                         |
| **AI innovation (horizontal)**          | High     | DWS IQ multi-agent compliance platform fits "AI deployment in industry" framing — align with PR 093 carbon ledger narrative |
| **Digital skills**                      | Medium   | Only as consortium partner with Metropolia / training provider; our thesis work demonstrates skills dissemination           |
| **Online safety (fact-checkers, tech)** | Medium   | KYA (Know Your Agent) + Clawdbot incident learnings are directly relevant — agentic safety is an online-safety topic        |
| **Uptake + deployment of key tech**     | High     | DWS IQ 7 sovereignty scoring + CLI deployment story matches "uptake across Europe" framing                                  |

**Top two candidates:**

1. **AI innovation (horizontal industry track)** — lead application; pitch DWS IQ as the EU-sovereign multi-agent platform for ETS/CBAM/CSRD compliance.
2. **Online safety (agentic safety)** — partner application; pitch KYA + TC-4 Leash Snap as an online-safety primitive for autonomous-agent era. Reference the Clawdbot incident and Resend ban as evidence of shipped defensive capability.

## 4. Calendar Fit

The 2026-10-01 deadline collides with the existing EIC Accelerator October 2026 cut-off in the Funding Application Calendar (DWS7_ROADMAP.md §Funding Application Calendar). Both are high-value, but they target different narratives:

| Application           | Narrative                                                     | Writing lead time |
| --------------------- | ------------------------------------------------------------- | ----------------- |
| Digital Europe (this) | EU-sovereign AI deployment across industry + online safety    | 8–12 weeks        |
| EIC Accelerator       | Deep-tech scale-up with market traction, grant + equity blend | 12–16 weeks       |

**Recommendation:** Do both, but start Digital Europe scoping first (shorter lead time, lower equity dilution) and parallelise EIC drafting from June 2026.

## 5. Changes Applied in This Session

CHANGES MADE:

- `DWS7_ROADMAP.md` line 714: updated Digital Europe Programme row in "Active & Upcoming Programs" table with €63.2M envelope, 2026-10-01 deadline, and specific thematic focus (AI in health, digital skills, online safety, fact-checkers).
- `DWS7_ROADMAP.md` "Funding Application Calendar": changed Apr 2026 row to "Review the 7 open calls — shortlist fit"; added new Oct 2026 row for "Submit application (deadline 2026-10-01, AI-in-health / online-safety track)".
- `docs/field-notes/2026-04-22-digital-europe-programme-ai-health-online-safety-call.md`: this field note.

THINGS I DIDN'T TOUCH:

- `DWS_STANDARDS_LIBRARY.md` — Digital Europe Programme is already listed as a reference framework; no entry change needed until we win a grant (then it becomes claimable).
- `National Programs (Finland)` table — this is an EU direct call, not Business Finland.
- Any public site — field notes are internal per the no-.md-in-public-sites rule.

POTENTIAL CONCERNS:

- Seven call topics collapsed into one table row for brevity. If we commit to applying, expand into a per-topic sub-table with Funding & Tenders Portal topic IDs.
- 2026-10-01 is a hard deadline; if EIC Accelerator drafting slips, Digital Europe must be the priority (lower risk, faster turnaround).
- "Civil society + fact-checkers" language suggests at least two of the seven calls are NGO-targeted and not DWS-eligible. Confirm before scoping.

## 6. Next Actions

1. Pull the seven specific topic IDs from the EU Funding & Tenders Portal (owner: Risto, by 2026-05-01).
2. Score each topic against DWS7 fit using the table in §3 and promote one primary + one secondary target.
3. Add a `regulatory-radar` skill run output for this call once topic IDs are known.
4. Flag the 2026-10-01 deadline in `scripts/daily/` calendar output.
