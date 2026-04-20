# Siemens Partnership Wedge via NVIDIA Synthetic Data

```
<!--
VERSION AND AGENT HISTORY
Document: 2026-04-20-siemens-synthetic-data-partnership-wedge.md
Version: 1.0
Last-Updated: 2026-04-20
Author: Risto Anton Päärni (Lifetime Oy)
Agent: Claude Code (claude-opus-4-7)
Purpose: Capture the two-angle Siemens partnership strategy:
         (1) SI Building Nordics pilot via Frida Ahlberg and
         (2) broader Xcelerator / Digital Industries wedge using
         DWS IQ SyntheticDataAgent on NVIDIA NeMo DataDesigner.

Introduced-In: PR-pending (branch claude/add-siemens-integration-jQDhC)
Code-Version: 1.0
Branch: claude/add-siemens-integration-jQDhC
Date: 2026-04-20
Owner: risto.paarni@lifetime.fi
-->
```

## Trigger

On 2026-04-20 Risto connected with **Frida Ahlberg**, Digital Enterprise Sales Professional at **SI Building Nordics** (Siemens Smart Infrastructure Buildings, Nordic unit). Frida sells Siemens digital enterprise for buildings &mdash; Building X, Desigo CC, Navigator, Enlighted &mdash; to exactly the Nordic real-estate / construction customer base now facing CSRD Wave 2, EPBD 2024 recast, and EU Taxonomy reporting on real-estate activities 7.1&ndash;7.7.

Frida's own presentation-line framing: **"We don't need dashboards, we need action from data."** That framing aligns exactly with DWS IQ's value proposition.

## Two-angle strategy

### Angle 1 &mdash; Smart Infrastructure pilot (immediate)

- **Counterparty:** Frida / SI Building Nordics.
- **Pilot target:** 3&ndash;5 Nordic real-estate portfolios, FY2025 CSRD reporting cycle.
- **Value:** Siemens Building X / Desigo CC telemetry &rarr; signed, submission-ready CSRD E1 + EPBD 2024 + EU Taxonomy output &mdash; with KYA-governed writeback (HVAC setpoints, maintenance work orders, renovation-passport triggers). One command, 90 seconds.
- **Link for outreach:** `https://dws10.com/enterprise-integrations/siemens/` (built 2026-04-20).

### Angle 2 &mdash; Xcelerator / Digital Industries wedge (strategic)

- **Counterparty:** to be identified. Targets: Siemens Xcelerator partnership team, Digital Industries AM / NX product line, MindSphere team.
- **Wedge asset:** DWS IQ **SyntheticDataAgent** (`src/agents/synthetic-data.agent.ts`) built on **NVIDIA NeMo DataDesigner**. Lifetime Oy is a confirmed **NVIDIA Connect ISV Partner**.
- **Use cases across Siemens stack:**
    1. Digital Industries &mdash; synthetic fault scenarios, tolerance deviations, process variations for QC model training (NX AM, MindSphere, predictive maintenance).
    2. Smart Infrastructure &mdash; synthetic edge-case building profiles (historic, off-grid, mixed-use) for pre-training CSRD / EPBD reasoning models.
    3. Mobility &mdash; synthetic rolling-stock sensor data for digital-twin training under rare failure modes.
    4. Siemens Energy (JV context) &mdash; synthetic grid-event datasets for ENTSO-E Fit-for-55 scenarios.
- **Link for outreach:** `https://dws10.com/products/synthetic-data/` (built 2026-04-20).

## Why the wedge works

1. **Schema grounding** &mdash; every synthetic record tied to a versioned EU-regulation schema (CBAM, ESRS, EN 15978, EPBD 2024, EU AI Act). Auditor-friendly.
2. **LLM-judge validation** &mdash; statistical plausibility and regulatory relevance scored per record.
3. **EU-sovereign compute** &mdash; Scaleway (Paris), Aiven (Helsinki), UpCloud (Helsinki), NVIDIA DGX Cloud Frankfurt. Zero US routing available in Aegis tier.
4. **NVIDIA partnership alignment** &mdash; co-pitch opportunity with NVIDIA's industrial AI and NeMo DataDesigner partnership teams. Narrative already seeded via `investor-outreach/INTRO_MAARTEN_VAN_SEGBROECK_NVIDIA.md`.

## Open questions / to verify

- [ ] **NVIDIA Connect ISV portal:** which NVIDIA partner logos and badges are we licensed to display? Currently all references are text-only until verified. Action: check partner portal this week.
- [ ] **AspenTech &rarr; Emerson:** AspenTech is now a wholly-owned Emerson subsidiary (acquisition completed 2025). Update all dws10.com / dws6.com references from "AspenTech" standalone to "AspenTech, part of Emerson" or "Emerson Automation Solutions". Nordic relevance for buildings / construction is near zero; de-feature on the catalog.
- [ ] **Siemens partner portal:** check whether SI Building Nordics has a formal partner programme we can enrol in before the pilot conversation matures.
- [ ] **Logo licensing:** until every partner logo is formally licensed, stick to SaaS-industry-standard **text-only "Compatible with" / "Integrates with"** treatment. Logos only after legal approval per partner.

## Assets built today (2026-04-20)

- `dws10.com/enterprise-integrations/siemens/index.html` &mdash; Siemens deep-dive with two angles.
- `dws10.com/products/synthetic-data/index.html` &mdash; SyntheticDataAgent product page.
- `dws10.com/shared-assets/nav/ironclad-nav.js` &mdash; new "Integrations" top-level dropdown.
- `dws10.com/index.html` &mdash; text-only connector strip on homepage.
- `dws6.com/index.html` &mdash; Enterprise Integrations section replaced with teaser pointing to dws10.com.
- `sales-outreach/INTRO_FRIDA_AHLBERG_SIEMENS.md` &mdash; thread log with drafted follow-up variants.
- All files mirrored to `landing-pages/` for Cloudflare production.

## Boardy discussion prompt

Copy-paste prompt prepared in the 2026-04-20 session asks Boardy for:
1. Siemens Xcelerator / Digital Industries partnership contacts (beyond Frida's buildings scope).
2. NVIDIA NeMo DataDesigner / industrial-AI partnership team for a joint Siemens co-pitch.

See `sales-outreach/INTRO_FRIDA_AHLBERG_SIEMENS.md` for the thread state.

## Longer horizon

If the synthetic-data wedge lands with Siemens, the next natural partnerships to pursue under the same model:
- **Schneider Electric** (EcoStruxure) &mdash; same building-automation story, French EU-sovereign counterweight.
- **ABB** (beyond robotics) &mdash; ABB Ability, power grids, energy.
- **Emerson (AspenTech)** &mdash; after DWS IQ has a live Siemens Digital Industries pilot, Emerson becomes a natural process-industry parallel.
- **HP (MJF)**, **EOS**, **Trumpf**, **Stratasys** &mdash; AM ecosystem, synthetic-data-for-QC pitch ports directly.
