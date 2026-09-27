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

1. IJS shipped on this branch (`src/identity/inference-jurisdiction.ts`, `src/routes/kya-inference.routes.ts`, `dws kya inference`, 34 tests). Open: push re-score on provider switch; `/api/v1/kya/status` route that `dws kya status` calls does not exist.
2. CONFLICT (surfaced to HIC): this session recorded "Connector Marketplace next, Tier 3 → 2"; the later `#2187` record on main says Connector Marketplace stays Tier 3 and moves Air-gapped Runtime + DGX Runtime Bundle to Tier 2. Merge kept main's table. Do not start Connector Marketplace until the HIC confirms.
3. Add superseded-by pointer to `docs/architecture/00-MASTER-BLUEPRINT.md` once HIC approves this draft.
