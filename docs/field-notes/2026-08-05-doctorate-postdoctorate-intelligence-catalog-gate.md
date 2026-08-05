# 2026-08-05 — Doctorate/Post-Doctorate Intelligence Catalog Gate

Supersedes `2026-08-05-doctorate-strategy-research-in-progress.md` (research now complete).

## Origin

HIC's own working framing from the loop: _"doctorate-level" must mean reproducible
inquiry and defensible evidence, while "post-doctorate-level" must mean discovering
and validating new enterprise knowledge._ This note converts that into a testable
gate and runs it against the current 121-SKU product catalog. It deliberately reuses
machinery already canonical in the repo rather than inventing new instruments — see
"Grounding" below.

`Strategy_Loop.md` (claimed Copilot/DGX origin) remains unfound after a GitHub-wide
search and a scheduled 10-minute recheck; see the superseded note for the full
verification trail. Nothing in this note depends on that file existing.

## Grounding (what already exists in the repo)

- **KYA four-gate falsifiability criterion** — `docs/PHD_FIREHORSE_EN.md:3557` (§14.42)
  and `standards/kya-open/SPEC.md:60` (§0.6), identical wording: (1) two+ independent
  implementations, (2) a conformance suite an implementation can fail, (3) de jure
  body acceptance or genuine de facto multi-party adoption, (4) change control that
  outlives the originating organisation ("the decisive one").
- **KYA's own self-assessment**: `standards/kya-open/SPEC.md:207-209` — "No
  conformance test suite exists yet... 'KYA-compliant' is an unverified
  self-assertion."
- **DWS_TRUTH_STANDARD row 35 (KYA-S1)**: "self-attestation is not acceptable
  evidence in any domain; Bronze/Silver/Gold differ on revocation + chain-termination
  SLAs." Status: draft, public comment 04.08.2026–04.11.2026.
- **DWS_TRUTH_STANDARD row 29 (MGD)**: a governed decision "counts only when it...
  carries full Article 12 reasoning lineage, and is audit-grade."
- **V1_FEATURE_LIST.md:358**: "⏳ Green ratification — every SKU stays Blue/pilot
  until Risto signs it Green" — the 64-SKU labor-anchored catalog is explicitly
  pre-ratification.
- **Existing PhD RQ set** (`docs/PHD_FIREHORSE_EN.md:158-178`, §1.2): 7 RQs
  (sovereignty frame, ontologies, KYA standard, standardization pathway, agentic
  commerce, EU eWallet, transactions). None of the 7 currently formalizes a
  catalog-wide evidence gate — this proposal is additive, not a replacement for any
  of them.

## Proposed Research Question (draft, not yet added to §1.2 — see HIC action)

> **RQ8 (proposed, catalog-scoped).** What evidentiary and reproducibility criteria
> distinguish a DWS IQ product/service that merely generates enterprise output from
> one that constitutes doctorate-level (reproducible, defensibly-evidenced) or
> post-doctorate-level (novel, independently-validated) enterprise intelligence —
> and what fraction of the current product catalog clears that bar?

This is the KYA four-gate instrument applied one level down: not "is the _standard_
falsifiable" but "does each _product claim_ built on top of it clear the same bar."

## The gate

**Doctorate-level (G1–G4, all required — reproducible inquiry + defensible evidence):**

| Gate                      | Test                                                                                                                       | Canonical anchor                    |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------------- | ----------------------------------- |
| G1 Reproducibility        | Same input reliably reproduces the same defensible output — independently re-derivable, not just a deterministic code path | (new — no existing row)             |
| G2 Evidence chain         | Full Article 12 reasoning lineage, audit-grade; not self-attested                                                          | TRUTH row 29 (MGD), row 35 (KYA-S1) |
| G3 Falsifiability         | An independent conformance check can fail the output                                                                       | KYA SPEC §9 / four-gate #2          |
| G4 Provenance persistence | Versioned, revocable, chain-terminating record survives the single run                                                     | KYA-S1 Bronze/Silver/Gold SLA       |

**Post-doctorate-level (G5–G6, on top of G1–G4 — discovering + validating new
enterprise knowledge):**

| Gate                      | Test                                                                                                                 |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| G5 Novelty                | Output contains a claim not already contained in its inputs (synthesis, not retrieval/summarization)                 |
| G6 Independent validation | The novel claim is checked against ground truth or an independent verifier before surfacing, not generated-and-shown |

## Test result: 121-SKU catalog against G1–G4

Source: `dws10.com/config/products.json` (121 SKUs, byte-identical to the
`landing-pages/` mirror — dual-folder sync intact).

- **29 / 121 SKUs** carry any evidence-trail language (audit / attestation / signed
  / verified / watermark) in their product definition — the only candidates for G2.
- **92 / 121 SKUs** carry none — fail G2 outright by omission.
- Of the 29 candidates, **G3 fails catalog-wide**: they rest on KYA, and KYA's own
  spec admits no conformance suite exists — a SKU cannot clear a gate its evidence
  layer hasn't cleared yet.
- **G4 is catalog-wide aspirational**: the Bronze/Silver/Gold SLA it depends on is
  still in public comment (closes 04.11.2026).
- **Finding: 0 of 121 SKUs currently clear the full doctorate-level gate.** Not a
  product-logic defect — the evidence layer underneath (KYA) hasn't cleared its own
  four gates, so every downstream claim inherits that gap.

### Candidate set (29 SKUs) — blocked only on KYA reaching its own gates, not on product logic

`DWS-AEGIS-PILOT-001`, `DWS-AEGIS-IMPL-001`, `DWS-CLIMATE-001`, `DWS-IQ-006`,
`DWS-IQ-FREE-2026`, `FH-SIGN-001`, `FH-CMS-001`, `FH-SKILL-T3`, `CMP-T0/T1/T2`,
`CMP-OC-STD/ENT`, `SS-T0/T1/T2`, `SS-OC-ENT`, `MO-T0/T1/T2`, `MO-OC-ENT`,
`QG-T1/T2`, `SEO-T1/T2`, `GTM-T3`, `HSE-T3`, `AIS-EU-SOV-OC`, plus the T2 tier of
the ED/SG/LOG/SOV/CSAT/LF/CS bundle family that carries "audit" language.

### Does-not-meet list (92 SKUs) — no evidence/audit/attestation language at all

- **All 9 industry-vertical pods**: IND-MARS, HELIOS, VULCAN, TALOS, GAIA, CERES,
  NEPTUN, PROM, BESS
- **Nearly all consulting/training/coaching SKUs**: consulting-hourly,
  consulting-fit55, aws-consultancy, m365-consultancy, business-mentor-30,
  ai-koulutus-3d, claude-code-coaching-\* (4 SKUs), lean-project, ai-consultant-day,
  firehorse-coach, ai-consulting-agentic
- **Edge hardware resale SKUs**: edge-node-gn100, LF-JETSON-\*, LF-DGX-SPARK,
  LF-IGX-ORIN, LF-NVIDIA-INSTALL
- **Sovereign DB / cloud-migration consulting**: DWS-SOVEREIGN-DB-001,
  sovereignty-cloud-consulting
- **Marketing/comms/design/IT SKUs**: firehorse-flow, omnichannel-multimodal,
  FH-OMNI-001, professional-web-pages, secure-email-proton,
  firehorse-data-services, digital-design-gold, cloud-ready-teams, devops-lead
- **Most single-domain agent SKUs below Pro tier**: Emissions Data, Schedule
  Genius, Logistics, Customer Sat, Lead Feedback, Competitor Surveillance,
  Deepwiki Extractor, Viability, Themis Coordinator (T1)
- **Bundle/report/misc**: LIFETIME-BUNDLE-2026, FH-RPT-001, FLEET-VIP-001,
  DWS-US/EU-STARTER/PILOT, LAND-\* overlay bundles not already listed above,
  AIS-OUTCOME-PILOT, DWS365-CMP-T3, AC365-T3

**Caveat, stated plainly so the list isn't misread**: several "does-not-meet" SKUs
were never meant to carry an evidence-chain claim — hardware resale and
human-delivered consulting are not intelligence claims by design, and "no evidence
language" on those is correct, not a defect. The gate applies to SKUs that _claim_
an intelligence outcome. First remediation step is tagging each SKU with whether it
makes an intelligence claim at all, before treating absence of evidence language as
a finding.

## Reconciliation — `Strategy_Loop.md` (merged main, PR #1795, ~03:36 UTC 05.08.2026)

The claimed file was real, just not findable earlier because it hadn't been
authored yet: it landed on `main` directly (self-merged, no review window) as
`Strategy_Loop.md` + `docs/field-notes/2026-08-05-dws-iq-intelligence-growth-strategy.md`

- `Learn/2026-08-05-dws-iq-intelligence-growth-strategy.html`, authored by
  GitHub Copilot CLI (GPT-5.6 Sol) with Cursor AI as co-author per the commit
  trailer — confirming the HIC's stated origin.

**It supersedes this note as the canonical document.** It is broader (a full
6-level intelligence maturity model 0–5, not a flat pass/fail; a scored
10-point Product Gate 0–3 per gate, ≥24/30 threshold, mandatory production
proof on gates 1/3/6/7/9; a 10-step Strategy Loop; a 90-day programme; an
"Evidence Room" concept), externally grounded (Stanford HAI 2025 AI Index,
McKinsey State of AI 2025, NIST AI RMF, EU AI Act Art. 12/14, OECD), and gives
every flagged SKU a specific qualitative disposition (sunset / infra-enabler /
adoption-service / needs-upgrade / strategic-inconsistency) rather than this
note's binary keyword-presence split. It also already carries a pending HIC
decision (**Q1 — adopt the Intelligence Product Gate from Q4 2026, answer
`Q1 APPROVE` or `Q1 REJECT — <reason>`**) — that decision, not a second one
from this note, is the one the HIC should act on. The "HIC decision needed"
ask originally here is retracted as redundant.

**Cross-validation.** This note's crude "does-not-meet" list (built from a
products.json keyword scan for audit/attestation/signed/verified/watermark)
matched `Strategy_Loop.md`'s qualitative "remove/sunset" list exactly on all
7 SKUs it names: `professional-web-pages`, `secure-email-proton`,
`m365-consultancy`, `digital-design-gold`, `cloud-ready-teams`,
`business-mentor-30`, `FLEET-VIP-001`. Keyword absence was a reliable signal
at the bottom of the distribution.

**Corrections to this note's "candidate set."** Keyword _presence_ was a
noisier signal — `Strategy_Loop.md`'s qualitative read demotes four SKUs this
note had wrongly promoted to "candidate" on surface language alone:

| SKU             | This note said                     | `Strategy_Loop.md` says                                                                       |
| --------------- | ---------------------------------- | --------------------------------------------------------------------------------------------- |
| `AIS-EU-SOV-OC` | candidate (has "audit")            | infrastructure enabler, not an intelligence product                                           |
| `FH-CMS-001`    | candidate (has "audit"/"evidence") | generic assistant — needs contradiction/expiry-impact/evidence-quality/lineage features first |
| `FH-SIGN-001`   | candidate (has "audit"/"signed")   | keep only as a governed-artifact add-on, not a flagship product                               |
| `SEO-T1/T2`     | candidate, T2 (has "audit")        | separate, or connect to causal commercial experiments                                         |

The lesson: a keyword match on "audit"/"verified" in a product's JSON record
is necessary but not sufficient evidence of doctorate-level intelligence —
exactly the point G2–G3 were trying to make, now demonstrated on the tool
itself. Treat this note's candidate-set table above as superseded by
`Strategy_Loop.md` §8; its does-not-meet list stands as corroborated.

**Process gaps this note has, that the superseding document doesn't:** it was
not run through `/truth-check` (its authors' was, per their version history:
"replaced deprecated activity-metric phrases after truth-lint"); it did not
cite external market evidence. **Process gaps the superseding document has,
that this note doesn't:** its own field note records Drive export and
Calendar as N/A ("no connector available in this tool session") — this
session's connectors were available and did complete both (Drive doc:
`https://docs.google.com/document/d/1WYxaxJicFXMZ6kO4KTkkkDbJjam0p77SlO8ZmKJNNvU/edit`).
That Drive doc should be treated as covering this note only, not as the
Learning Standard Drive record for `Strategy_Loop.md` — that record is still
open on the other side.

## Also surfaced this session (parked, not this task's scope)

`docs/blog-drafts/kya-s1-one-signed-page.md` is a drafted-but-unpublished blog post
flagged by the session-stop hook. Parked — not read or acted on here; a separate
`/blog-draft` pass is needed to show the HIC the full text and get `Status:
APPROVED` per Non-Negotiable Rule 13. Not touched in this session (out of scope,
Rule 3 surgical changes).

## Next steps

- HIC answers the decision above.
- If canonicalized: add `DWS_TRUTH_STANDARD` row, register `/catalog-gate` skill in
  `skills/manifest.json`, sync `docs/DWS_SKILLS_GUIDE.md`.
- If RQ8 is wanted in the formal PhD RQ set: that's a **structural thesis edit**
  (new numbered RQ in §1.2) — RED zone, requires explicit HIC go-ahead per the
  Thesis Autonomy Boundary, and the four-file lockstep (master's EN/FI + PhD EN/FI)
  applies once approved.
