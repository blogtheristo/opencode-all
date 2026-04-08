---
VERSION AND AGENT HISTORY
Document: Qantic Integration — After-Call Checklist
Version: 1.1
Created: 2026-03-19
Author: Claude Opus 4.6 (DWS IQ 6 Agent)
Reviewed by: Risto Päärni (Founder & CEO, Lifetime Oy)
Status: FINAL

Sessions & Modifications:
  - Version: 1.1 | Tool: Claude Code (Opus 4.6) | Session: claude/qantic-energy-analysis-Yjg00 | Date: 23.03.2026 | Changes: NDA now sent via DocuSign (digital signature). Updated sequence and pricing to match deal proposal v5.
  - Version: 1.0 | Tool: Claude Code (Opus 4.6) | Session: claude/qantic-energy-analysis-Yjg00 | Date: 19.03.2026 | Changes: Initial after-call checklist.

Document Status:
  - Last Modified: 23.03.2026
  - Classification: INTERNAL — Call Preparation
  - Publication Status: INTERNAL ONLY
---

# After-Call Checklist — If Thomas Says Yes

## Before Sharing API Docs or Test Endpoint

Get two documents signed:

### 1. NDA (Mutual Non-Disclosure Agreement) — Via DocuSign

- **Send via DocuSign** — digital signature, no printing/scanning needed
- Template: `Partners/NDA_TEMPLATE_EU_2026.md` (EU Trade Secrets Directive 2016/943 compliant)
- Integration: `src/integrations/docusign/` + `scripts/verify-nda-signatures.ts`
- Protects: DWS IQ 6 architecture, API specs, pricing model
- Protects: Q-System JSON format, customer list, revenue data
- Mutual: both parties equally protected
- Duration: 5 years (general), indefinite (trade secrets)
- Jurisdiction: Finnish law + EU Directive 2016/943
- Contractual penalty: EUR 250,000 (strategic partner tier)

### 2. LOI (Letter of Intent)

- Template: `docs/partnerships/qantic-loi-template.md`
- Locks: commercial model (Setup €15,990 + API €99/asset/month)
- Locks: integration timeline (4–6 weeks from JSON confirmation)
- Locks: reseller commission (30%)
- Non-binding: either party can walk away
- Purpose: prevents scope creep and "free consulting" trap
- Include: first customer pilot target and success criteria

## Sequence

1. Call happens (20-30 min)
2. Thomas confirms pilot client
3. Risto sends NDA via DocuSign within 1 hour (digital signature)
4. Thomas signs digitally (same day or next business day)
5. Signature verified via `scripts/verify-nda-signatures.ts`
6. Risto sends API documentation + test endpoint
7. Thomas sends sample dispatch JSON
8. LOI sent if commercial terms agreed (within 48 hours)
9. Integration starts

## Do Not

- Do not share API docs before NDA is signed
- Do not share test endpoint before NDA is signed
- Do not start coding Q-System adapter before LOI is signed
- Do not agree to custom pricing verbally without LOI

## If Thomas Pushes Back on Paperwork

Say: "This protects both of us equally. Standard mutual NDA, EU compliant. I'll send it via DocuSign right now — you sign digitally, takes 2 minutes. LOI is non-binding, just confirms what we agreed."
