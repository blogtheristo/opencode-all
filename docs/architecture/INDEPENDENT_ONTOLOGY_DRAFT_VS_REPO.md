# Independent Ontology — Draft vs. Repo Comparison Log

**Purpose:** keep architecture drafts and the repository from blurring together. A draft is a
hypothesis; the repo is the source of truth. This log is where a draft becomes a decision — and
only a recorded decision, never silent adoption, moves something from draft to backlog to shipped.

## Method (HIC, 24.09.2026)

Every comparison observation is recorded in this exact structure:

```text
Luonnos ehdottaa:
<what the architecture draft proposes>

Repossa:
<what actually exists in the repo today — file/PR/commit, or "Ei toteutettu">

Mahdollinen täydennys:
<what a future change would need to add, or "Ei tarvetta">

Päätös:
<Ei muutosta / Backlog / Toteutetaan / Suljettu>
```

No entry implies a requirement. A `Backlog` or `Toteutetaan` decision is what creates one — and
that decision belongs to the HIC, not to the observation itself.

## Three tiers

```text
Taso 1
Toteutettu repossa

Taso 2
Hyväksytty roadmapiin

Taso 3
Arkkitehtuuriluonnos
```

Something moves down a tier (3→2→1) only on an explicit HIC decision recorded here, never by a
session assuming a draft is already agreed.

## Current tier status (HIC, 24.09.2026)

| Item                         | Tier                | Note                                                                                                                  |
| ---------------------------- | ------------------- | --------------------------------------------------------------------------------------------------------------------- |
| Decision Flight Recorder     | 2 → 1 (in progress) | See entry below — event-first `decision_journey` shipped in `#2092`; check completeness before calling Tier 1 closed. |
| Air-gapped Sovereign Runtime | 3                   | Architecture draft only. No repo artifact found.                                                                      |
| Connector Marketplace        | 3 → 2               | HIC 27.09.2026: implement, after the Inference Jurisdiction Score. See entry below.                                   |
| DGX Runtime Bundle           | 3                   | Architecture draft only. No repo artifact found.                                                                      |

## Entries

### Decision Flight Recorder

```text
Luonnos ehdottaa:
Decision Flight Recorder — an event-first, replayable log of every ownership/decision
event in a customer's Active Ontology journey (observation → meaning → ownership →
decision → action → outcome), so a decision can be audited after the fact.

Repossa:
Partially. `#2092` (commit ec584b4) shipped "event-first decision_journey — outcome
evidence for Workflow V2": migration `089_240926_decision_journey.sql`,
`docs/plans/2026-09-24-decision-journey-outcome-evidence.md`,
`docs/field-notes/2026-09-24-outcome-evidence-decision-journey.md`. This branch
(`claude/loving-einstein-fkjj4b`, merged as `#2059`/`#2091`) separately shipped the
Active Ontology ownership stage (LD-2026-09-007): ownership verdicts, verdict-routed
first purchase, evidence panel, `transferred_to_owner` outcome — migrations
`089_240926_website_observations.sql`, `090_240926_website_observations_ownership.sql`,
`091_240926_website_observation_summary.sql`.

Mahdollinen täydennys:
1) Confirm `decision_journey` (from #2092) and `website_observations` +
   `ownership_map` (from #2091) are the same event stream or two that need joining —
   not verified in this session. 2) **Fact check, not a draft item**: both migrations
   are numbered `089_240926_*` — a real filename collision on `main`, not a draft-vs-
   repo gap. `scripts/check-migration-filenames.mjs` only checks files touched in the
   current diff, so it did not catch this across two independently merged PRs. Needs a
   renumber (one of the two → 092+) before either is applied — applying is still RED /
   unapplied as of this log.

Päätös:
Toteutetaan (tier 2→1 in progress) — pending the join/dedup check above. Migration
renumbering flagged separately, not decided here.
```

### Air-gapped Sovereign Runtime

```text
Luonnos ehdottaa:
A fully air-gapped DWS IQ runtime for customers whose sovereignty posture forbids any
outbound network path, including to Cloudflare/Supabase.

Repossa:
Ei toteutettu. No deployment target, Docker/K8s bundle, or product page found for this.

Mahdollinen täydennys:
Deployment target for a future release; would need its own catalogue SKU and
provisioning path once scoped.

Päätös:
Backlog
```

### Connector Marketplace

```text
Luonnos ehdottaa:
A marketplace where third parties register connectors (data sources, MCP servers,
agent tools) against the DWS IQ platform, discoverable and installable by customers.

Repossa:
Ei toteutettu. `mcp-hub/` and `mcp-servers/` exist as internal orchestration, not a
customer-facing marketplace or registry.

Mahdollinen täydennys:
Would need a public registry schema, a review/approval gate, and a listing UI —
none scoped yet.

Päätös:
Backlog → Toteutetaan (HIC, 27.09.2026: "Tier 3 implementation is needed" — Connector
Marketplace chosen; ordered after the Inference Jurisdiction Score). Tier 3 → 2. First step
per `docs/architecture/DWS_IQ_REFERENCE_ARCHITECTURE.md` §5: one MCP manifest per
`src/integrations` connector, listed in the MCP Hub, before any public listing UI.
```

### DGX Runtime Bundle

```text
Luonnos ehdottaa:
A packaged DGX Spark deployment bundle (cron + Ollama + agent runtime) a customer can
run on their own DGX hardware, mirroring the internal DGX-first compute policy
(CLAUDE.md Rule 14).

Repossa:
Ei toteutettu as a customer-facing product. Internal usage exists (`ollama-spark`
skill, `docs/system-config/DWS_COST_POLICY_STANDARD.md` DGX-first policy) but there is
no packaged, sellable bundle.

Mahdollinen täydennys:
Would need packaging, a licence/support model, and a catalogue SKU distinct from the
internal cost-policy usage.

Päätös:
Backlog
```

## Maintenance

Add a new entry each time a draft is compared against the repo. Update the tier table and the
entry's `Päätös` when the HIC makes a decision — do not reclassify a tier without a recorded
decision. This file is the audit trail; it is not itself a roadmap or a requirements list.
