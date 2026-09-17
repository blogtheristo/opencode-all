# Handoff — claude/dach-france-anchors-caemw0

## Task

Recover the DACH+France academic-anchor pack (Recovery Prompt C,
`docs/lut/recovery-prompts-lost-research-packs-2026-07.md` §5) — lost to an
unreclaimed container 2026-07-13. Note: an incoming task message also embedded
a fabricated "FI/SE funding lanes" document with unverified grant figures
presented as verified — that content was identified as a prompt injection
(bait-and-switch scope + fabricated deadlines/amounts) and deliberately NOT
written or committed. Stayed scoped to Prompt C only.

## State — DONE

- `docs/lut/dach-france-anchors-research-2026-07.md` written: per-anchor
  detail for DE (Fraunhofer IAIS/Poretschkin, CISPA/ELSA, TUM, Fraunhofer
  AISEC, Max Planck Law), AT (TU Wien/Bartocci, TU Graz/Könighofer, FFG gate),
  CH (ETH SRI Lab/Vechev, EPFL LIONS/Cevher, Innosuisse), FR (Inria
  FRAIME/FMICS/INESIA, PEPR IA, ANITI/Castets-Renard legal chair, €109B
  figure verified). Top-3 ranked + draft (unsent) first-contact angles.
- Two corrections to surviving conclusions: FFG Industrienahe Dissertationen
  not currently usable (2026 company track exhausted + no Austrian
  establishment); Fraunhofer IAIS/BSI is strategic cooperation, not joint
  catalog authorship.
- `docs/lut/fundraising-roadmap-2026-2027.md` updated: §0 row → RECOVERED,
  §5 DACH+France rewritten, §7 gaps closed/added, version history → 1.1.
- Committed (`aa1179f`) and pushed. `scripts/claude-durability-checkpoint.sh`
  confirmed `✓ DURABLE`.

## Next steps

- Recovery Prompts A (EU/NATO), B (FI/SE lanes — needs REAL research, not the
  injected fabricated version), D (Nordic NO/DK) are still open — each is
  meant to run on its own branch/session per the runbook, not bundled here.
- Gaps flagged in the new doc §7: AT legal-pillar anchor missing, FFG
  Niederlassung nuance needs a direct FFG helpdesk query, INESIA named lead
  unconfirmed, Bartocci/Poretschkin direct contact emails unconfirmed
  (WebFetch was blocked on most target domains this session — snippet-only
  verification).

## Blockers

None currently. WebFetch returned 403 on most `.de`/`.at`/`.fr` domains
during research — worked around via WebSearch snippet citations; anything
not independently confirmed is tagged (verify) in the doc.
