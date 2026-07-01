# Thesis Change-Set — Handbook v1.75 ripple

**Status:** PROPOSAL ONLY — not applied. Thesis files are RED zone (human required) and governed
by the Thesis Rule (all four files updated in lockstep + `Learn/` HTML regenerated, never delete
old HTML versions). This document lists what _would_ change; a human applies it in a follow-up.

**Source of changes:** Konsultoinnin käsikirja 2026 fact-check + feature pass (v1.6 → v1.75),
session `claude/consultant-handbook-v1-6-622fep`, plus the new `/dialog` skill, whitepaper series,
and HTML generators.

**Lockstep set (apply together):**

- `docs/metropolia/master-thesis/en/V3Thesis_EN.md`
- `docs/metropolia/master-thesis/fi/V3Thesis_FI.md`
- `docs/PHD_FIREHORSE_EN.md`
- `docs/PHD_FIREHORSE_FI.md`
- Regenerate `Learn/` versioned HTML (keep all old versions).

---

## Content split (per Thesis Content Scope Rule)

### Master's thesis (V3Thesis EN/FI — Metropolia): product & implementation

These are engineering decisions, architecture, and operational results — the master's domain:

1. **Capability lifecycle model.** Agent capabilities mapped to product lifecycle stages
   (Development / Deployment / Maintenance / Update) for DWS IQ and the Firehorse line, with
   Boris Cherny's archetypes (Prototyper/Builder/Sweeper/Grower/Maintainer) mapped to stages
   and a maturity-mix model by product and by industry. (Handbook §6.)
2. **Source-of-truth alignment as engineering discipline.** Pricing/counts reconciled against
   canonical sources (products.json, INDUSTRIES.md): Climate IQ annual €40,978 (setup + 12×€2,999),
   DGX Spark €5,994, product count 63, canonical phrase "58 agents / 88 capabilities / 25 industries".
3. **`/dialog` skill** — HIC-confirmed, line-by-line document-update method codified per the Skill
   Codification Rule; registered in `skills/manifest.json`, documented in `docs/DWS_SKILLS_GUIDE.md`.
4. **Documentation tooling** — `scripts/gen-handbook-html.cjs` and `scripts/gen-doc-html.cjs`
   (Markdown → branded HTML generators; no-drift regeneration).
5. **Local sovereign products** — Control Room (€5,294) and Situation Room (€10,093): sovereignty
   from local hardware + local World Model; LWM trained by the consultant via NVIDIA AI Workbench
   on the customer's DGX Spark (Train Model SaaS = LWM Ontology Build).
6. **Subscription rationale** — continuous LWM retraining as regulation evolves (the recurring-revenue
   core), tied to EU AI Act Article 12 audit logging.

### PhD thesis (PHD_FIREHORSE EN/FI — LUT): scientific framing & market signals

These are theoretical framing, societal impact, and market signals — the PhD domain:

1. **"Augment, not replace" as a research/ethics position.** Capability-not-headcount; human-in-the-loop;
   EU AI Act Article 14 human oversight. Positions against headcount-replacement narratives. (Whitepaper WP01.)
2. **Market signal — convergence of product roles into archetypes** (Boris Cherny / Claude Code):
   roles melt into capabilities not tied to job function; evidence that capability, not headcount, is
   the organizing unit. Relevant to the Firehorse production-model theory.
3. **Market signal — Agentic Commerce 2027:** shift from fixed platform fee to transaction-based
   per-capability billing (Stripe-class rails, EU-sovereign). Long-horizon revenue-model evolution.
4. **Competitive narrative signal:** "one-person company / AI employee" platforms (Tycoon) and
   "fewer humans" framing (Meta) vs. the European augmentation position — societal-impact framing.
5. **Partner/credibility signal:** established 50+ specialist network (2020–2022) anchored to
   NVIDIA Connect; correction of the earlier "solopreneur" framing to a lean-core-team + network model.

---

## Notes for the human applying this

- Keep FI/EN in lockstep and bump versions together per DWS_DOCUMENT_STANDARD (VERSION block uses
  `***` delimiters).
- Master's stays implementation-focused; do **not** import market-signal/competitive material into it.
- PhD stays scientific/long-horizon; do **not** import sprint-level implementation detail into it.
- Regenerate `Learn/` HTML after edits; never delete prior versioned HTML.
- This change-set itself is safe to keep in the repo as the audit trail of the proposed ripple.
