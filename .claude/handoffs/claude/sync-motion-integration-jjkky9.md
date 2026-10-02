---
Branch: claude/sync-motion-integration-jjkky9
Created: 2026-09-21
Last Updated: 2026-09-21
Status: READY_FOR_OUTREACH
Owner: Risto Anton Päärni
---

# Sync Motion Integration — Branch Handoff

## New: DWS Contract Standard (2026-09-21)

Sync Motion's evaluation surfaced a gap: no canonical skeleton existed for partner contracts outside the OT/hardware category (`docs/plans/THEMIS_PARTNER_AGREEMENT_V0.md`). Created `DWS_CONTRACT_STANDARD.md` v0.1 (root level, registered in `DWS_STANDARDS_LIBRARY.md` §7) — the generalized eight-part skeleton (parties/contribution, delivery structure, revenue/license, technical interface, KYA/Capacity Class, audit trail ownership, Partner Captain, termination/existing-installations) any future partner category schedule is drafted against. DRAFT, not legally reviewed. Sync Motion is flagged as the first candidate for a future "data/OT-connectivity" Category Schedule if outreach proceeds.

## Current State

**Strategic assessment complete, split into two documents.** DWS IQ technical + market alignment for the OT-connectivity category is documented generically; named-contact outreach content lives separately. Ready for HIC outreach decision.

### Document Split (2026-09-21)

Per HIC instruction, all named-individual references were removed from the field note and consolidated into a dedicated partner note:

1. **Field note (generic, reusable):** `docs/field-notes/2026-09-21-sync-motion-integration-strategic-assessment.md`
   - Technical architecture mapping (OPC UA/S7/ADS/Modbus → DWS IQ evidence chain)
   - TAM sizing: $300K–$1.2M ARR per integrator channel
   - Phase 0 (POC) + Phase 1 (production) roadmap
   - Risk mitigation (data quality, integrator adoption, compliance admissibility)
   - No personal names, quotes, or contact-specific outreach plans

2. **Partner note (named contact):** `docs/partnerships/sync-motion-tobias-brida.md`
   - Contact: Tobias Brida, Founder @ Sync Motion (LinkedIn link)
   - Founder positioning quote + alignment framing
   - Proposed commercial terms (70/30 / 60/40 splits, 20% integrator margin — DWS IQ opening position, NOT discussed with Tobias)
   - Outreach strategy: 3 options (A: warm intro, B: pre-call positioning, C: integrator prospecting)
   - Recommendation: Option B (1-pager prep → higher confidence call)
   - Status: NOT CONTACTED

### Deliverables Queued

- [ ] 1-pager: "Sync Motion + DWS IQ: Non-Invasive Compliance Automation for DACH Pharma"
- [ ] Data schema draft: `supabase/migrations/sync-motion-tables.sql`
- [ ] Integrator prospect list (DACH Beckhoff/Siemens/ABB SIs, Tobias-mapped)
- [ ] Pilot legal skeleton (term sheet outline)

### Next Owner Actions

**HIC decision required:**

1. Choose outreach option (A, B, or C)
2. If Option B: approve 1-pager messaging + timeline
3. Schedule: LinkedIn intro to Tobias (HIC personal account)

**Parallel track (OpenCode/DWS Ops):**

- Legal: review partner agreement skeleton
- Eng lead: commit to POC technical scope (data schema, Kafka adapter, 3 KYA templates)

## Branch Strategy

**No code commits yet.** This branch holds strategic planning & outreach prep. Once HIC approves outreach:

1. **Add deliverables** (1-pager, schema draft, terms) to `docs/sync-motion/` folder
2. **Create GitHub issue:** "Sync Motion POC Technical Scope" (Phase 0 tracking)
3. **Commit & push** for PR review before cold outreach

**Keep branch open** through negotiation + POC execution (4–6 weeks post-approval). Close after pilot decision (go/no-go).

## Related Files

- Field note (generic, no personal references): `docs/field-notes/2026-09-21-sync-motion-integration-strategic-assessment.md`
- Partner note (named contact, LinkedIn link, outreach plan, proposed terms): `docs/partnerships/sync-motion-tobias-brida.md`
- Similar integrations: `docs/lut/` (funding lane research, academic anchor research — model for partner prospecting structure)
- Convention: named-partner outreach content belongs in `docs/partnerships/`, not `docs/field-notes/` — field notes stay reusable/generic per HIC instruction 2026-09-21

## Budget & Token Tracking

- **Session tokens used:** ~4,000 (research + field note + handoff)
- **Token budget per task:** 4,000 (CLAUDE.md Rule 6)
- **Session budget:** 30,000 (shared across all tasks this session)
- **Status:** ✅ On budget

---

_Handoff created by Risto Anton Päärni, Founder/CEO DWS IQ. Ready for HIC review and outreach decision._
