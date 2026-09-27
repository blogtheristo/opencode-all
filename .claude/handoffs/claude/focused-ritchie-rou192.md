# Handoff — claude/focused-ritchie-rou192

**Branch:** `claude/focused-ritchie-rou192`
**Task:** DWS IQ version of the 12-layer AIP architecture picture + proposed updates; codify "gold standard" = cari.fi colours + IBM Plex.
**State:** READY-FOR-REVIEW
**Date:** 2026-09-27

---

## Version & Agent History

| Version      | Date       | Changes         | Agent       |
| ------------ | ---------- | --------------- | ----------- |
| [Latest] 1.0 | 2026-09-27 | Initial handoff | Claude Code |

---

## State

- **Done:** `docs/architecture/DWS_IQ_REFERENCE_ARCHITECTURE.md` (source) + `dws-iq-reference-architecture.html` (Gold Standard view); `DWS_BRAND_STANDARD.md` v3.14 §2.2 Gold Standard (cari.fi `public/index.html` @ dd2a144 + IBM Plex); `STANDARDS_ROUTING.md` v1.8 trigger row; field note `docs/field-notes/2026-09-27-dws-iq-reference-architecture.md`.
- **HIC decisions 27.09.2026:** IJS first; Ops Manager added as planned (lifecycle ledger); public sites stay Nordic; cari.fi read-only.

## Next steps

1. Build the Inference Jurisdiction Score (`GET /api/v1/kya/inference/:sessionId`) on its own branch.
2. Add superseded-by pointer to `docs/architecture/00-MASTER-BLUEPRINT.md` once HIC approves this draft.
