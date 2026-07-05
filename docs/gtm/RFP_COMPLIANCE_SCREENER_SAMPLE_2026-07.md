# RFP / Tender Compliance Screener — Manual Rep #1

---

# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:

- Version: 1.0 | Tool: Claude Code (Sonnet 5) | Session: claude/gtm-skills-planning-7ui3kd | Date: 01.07.2026 | Changes: First manual rep of RFP/tender compliance screening per the Skill Codification Rule (GTM_SKILLS_GAP_PLAN_2026.md §2.2). No real tender requirement matrix exists in the repo yet (TED pipeline sources leads, not requirement docs), so this rep uses a representative Nordic public-procurement requirement checklist and screens it against DWS's actual, current certification status from DWS_STANDARDS_LIBRARY.md.

Document Status:

- Created: 01.07.2026
- Last Modified: 01.07.2026
- Language: English
- Languages Available: EN
- Publication Status: DRAFT
- Classification: INTERNAL
- Document Type: GTM Bid/No-Bid Screening

Related Documents:

- docs/gtm/GTM_SKILLS_GAP_PLAN_2026.md (§2.2 RFP/tender compliance screener)
- DWS_STANDARDS_LIBRARY.md
- src/construction-leads/compliance-keywords.ts
- supabase/migrations/036_construction_leads.sql

---

## 0. Honest starting condition

No actual tender requirement matrix (the itemized "must-have" list a real
procurement document contains) is captured anywhere in this repo. The TED
pipeline (`src/construction-leads/`) sources _lead_ metadata — buyer, CPV
code, value, deadline — not the requirement-by-requirement text of a bid
document. So this rep can't screen a real tender yet.

What it does instead: builds a representative requirement checklist from (a)
the keyword categories `compliance-keywords.ts` already searches for
(CSRD, Fit for 55, carbon, ESG, embodied carbon, lifecycle, sustainability,
energy efficiency) and (b) standard clauses that appear in Nordic public
procurement for compliance/software vendors, then screens it against DWS's
**actual current** certification status in `DWS_STANDARDS_LIBRARY.md` —
not aspirational status.

## 1. Representative requirement checklist × DWS status

| #   | Requirement (typical Nordic public tender clause)                                               | DWS status today (01.07.2026)                                                      | Source                        | Verdict                    |
| --- | ----------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- | ----------------------------- | -------------------------- |
| 1   | Vendor holds ISO/IEC 27001 certification                                                        | **NOT YET CERTIFIED** — target Q3 2026, currently at gap-analysis/audit-prep stage | `DWS_STANDARDS_LIBRARY.md` §C | ⚠️ FAIL if hard-mandated   |
| 2   | Vendor holds SOC 2 Type II report                                                               | **NOT YET CERTIFIED** — target Q4 2026, Phase 6 engagement                         | `DWS_STANDARDS_LIBRARY.md` §C | ⚠️ FAIL if hard-mandated   |
| 3   | GDPR compliance / EU data residency                                                             | Active — `DWS_DATA_STANDARD.md`, DPA template, data residency policy               | `DWS_STANDARDS_LIBRARY.md` §A | ✅ PASS                    |
| 4   | NIS2 incident-response posture (if buyer is critical-infra)                                     | Active — positioned as product differentiator                                      | `DWS_STANDARDS_LIBRARY.md` §A | ✅ PASS                    |
| 5   | CSRD / ESRS reporting capability (if the tender is for compliance software specifically)        | Active — 82 ESRS disclosures mapped, `esrs-registry.ts`                            | `DWS_STANDARDS_LIBRARY.md` §A | ✅ PASS                    |
| 6   | CBAM / EU ETS calculation capability                                                            | Active — `cbam-calculator.ts`, `ets-calculator.ts`                                 | `DWS_STANDARDS_LIBRARY.md` §A | ✅ PASS                    |
| 7   | ISO 9001 quality management                                                                     | Considered, not adopted                                                            | `DWS_STANDARDS_LIBRARY.md` §B | ⚠️ FAIL if hard-mandated   |
| 8   | Vendor financial standing / years in operation (common Nordic public-tender eligibility clause) | Not evaluated in this rep — no financial data in this repo to screen against       | —                             | ❓ NEEDS INPUT             |
| 9   | References / prior public-sector deployments                                                    | Kela (government validation, moat #2) exists as a reference                        | `20-MOAT-FORTRESS.md` moat #2 | ✅ PASS (single reference) |

## 2. What this rep actually found

**The real finding, not a hypothetical one:** any tender that hard-mandates
ISO 27001 or SOC 2 as a bid _condition_ (common in larger Nordic public
procurement, not universal) would currently screen as an **automatic-rejection
risk** for DWS, because neither certification exists yet — both are still
Q3/Q4 2026 targets per `DWS_STANDARDS_LIBRARY.md`. This is exactly the
"catch it before spending bid-writing hours" signal
`GTM_SKILLS_GAP_PLAN_2026.md` §2.2 was built to find, and it surfaced on the
very first rep using data already in the repo — no fabricated tender needed
to demonstrate the value.

**Practical implication:** for tenders sourced via the TED pipeline between
now and Q3/Q4 2026 certification completion, a bid/no-bid check should
explicitly ask "does this tender hard-mandate ISO 27001 or SOC 2, or does it
accept 'in progress toward certification' / compensating controls?" **before**
committing bid-writing time — many public tenders accept a certification
roadmap or equivalent controls in lieu of a completed cert, but not all do,
and this repo has no record of which is true for any specific live tender.

## 3. Limits of this rep

- Item #8 (financial standing) needs real company financial data this session
  doesn't have access to — flagged as a gap, not silently skipped (per
  CLAUDE.md Rule 12).
- This checklist is representative, not sourced from one real tender. The
  next rep should run against an actual TED-sourced lead once one reaches
  `outreach_status = 'qualified'` in the `ted_leads` table, so the checklist
  gets validated against real requirement text instead of a generic model.
- No verdict here should be read as legal advice on tender eligibility —
  it's a triage signal for where to spend founder time, per the original gap
  rationale (cost avoidance, not revenue).

## 4. Next rep trigger

First TED-sourced lead that reaches `outreach_status = 'qualified'` with an
actual requirement document attached or linked.
