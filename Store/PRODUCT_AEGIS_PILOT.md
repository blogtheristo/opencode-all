---
title: "DWS IQ Aegis Pilot (3 months)"
price: "19990.00"
currency: "EUR"
sku: "DWS-AEGIS-PILOT-001"
availability: "preorder"
condition: "new"
google_product_category: "Software > Business & Productivity Software"
image_link: "https://dws10.com/static/images/firehorse-aegis-head.png"
brand: "DWS IQ"
storeCategory: "platform"
type: "one-time"
priceNote: "€19,990 fixed, 3 months. Credited in full against the €59,990 Aegis onboarding if you proceed within 6 months, leaving €40,000. Credit capped at €19,990; excludes LWM integration, hardware, multi-site rollout and custom ERP/BIM/SCADA integrations."
mpn: "DWS-AEGIS-PILOT-2026"
---

# DWS IQ Aegis Pilot

**Prove the local-first path before you buy the silicon** — a 3-month scoped engagement, part of DWS IQ Aegis

## What it is

A fixed-price, fixed-duration engagement that proves the complete **local-first operational path** for Aegis on infrastructure you already have — or on a compact edge appliance — **before any DGX procurement**.

The pilot exists because the control-room requirement is testable. In manufacturing control rooms, dual-use facilities and air-gapped plants, compliance execution cannot depend on external connectivity. That is either true of a deployment or it is not, and the way to find out is to run it and pull the cable — not to model it in a proposal.

## What it proves

The five requirements that define a control-room deployment, demonstrated rather than asserted:

1. **Local execution and local evidence** — the outcome is produced on site, and the evidence of it is written on site.
2. **Local identity, logs and kill authority** — agent identity, the Article 12 record and the ability to stop an agent all resolve locally.
3. **No network dependency for the core outcome** — the critical path completes with the uplink down.
4. **Cloud only for optional sync, backup or non-critical reporting** — never the outcome, never the evidence chain, never the stop.
5. **Graceful degradation** — specified in advance, then demonstrated, rather than discovered during an incident.

**The acceptance KPI is binary and deliberately blunt.** With the uplink severed for an agreed window: (i) does the piloted workflow run to completion, (ii) is the EU AI Act Article 12 record still being written locally, and (iii) can an operator still stop a running agent? **All three must pass.** A pilot that does not pass has produced a useful negative result — a valid outcome, not a defect — and you will have learned it for €19,990 instead of after a hardware programme.

## What you get

- A scoped architecture for your site, with the deployment mode named (Local / Edge, Hybrid, or EU-Sovereign Cloud) and justified.
- A demonstrated uplink-down run against your own workflow.
- The Article 12 evidence record, produced locally throughout the engagement.
- Hardware sizing for production — informed by measured behaviour on your workload rather than a vendor spec sheet.
- A written recommendation, including the honest one: if your workload does not need local-first, the pilot says so.

## How the three months run

Five phases. The ordering is deliberate: the substrate is proven before the workflow exists, and the acceptance test is rehearsed before it is taken. Each phase has an exit gate, and a gate that does not pass is reported rather than worked around.

### Phase 0 — Scoping and baseline · weeks 0–2 · no charge

**Objective.** Establish what "the core outcome" actually is, precisely enough that it can be tested.

- **We do:** site, workflow and deployment-mode selection workshop; read-only audit of the source systems; **criticality classification** — every step in the workflow marked core (must survive an outage) or non-core; first draft of the degradation and reconciliation spec; baseline measurement of current-state behaviour.
- **You do:** nominate the technical contact, the workflow owner, and the operator who will exercise kill authority; grant read-only access; agree the outage window and its date.
- **Exit gate:** a one-page signed scope — site, workflow, deployment mode, and the three acceptance conditions written in *your* operational language, not ours.
- **This phase fails if** the workflow cannot be described as a terminating sequence with a defined "complete" state. If there is no completion, there is nothing to test, and we say so before you have spent anything.

### Phase 1 — Local substrate · weeks 3–5

**Objective.** Stand up execution, identity, evidence and kill authority on site. Nothing about your workflow yet.

- **We do:** deploy the execution runtime and local model serving on your hardware or a compact edge appliance; issue KYA agent identity that resolves locally, with no reachable control plane; stand up the Article 12 log writer against local durable storage; wire the kill path operator → running agent with no network hop.
- **You do:** hardware placement, power, network segment, operator account provisioning.
- **Exit gate:** the **four locals** demonstrated in isolation with the uplink already down — an agent runs, is identified, writes a record, and can be stopped.
- **Why before the workflow.** Proving the substrate first means a Phase 3 failure is a workflow problem, not a platform problem. If identity or kill authority turns out to need a round-trip, that is the pilot's finding and it is reported at week 5, not discovered at week 11.

### Phase 2 — Workflow integration · weeks 6–9

**Objective.** Your actual control-room workflow, running on the local substrate.

- **We do:** configure the agent set that workflow requires and no more; read-only source-system integration; map each decision point to the Article 12 record schema; implement the degraded-mode behaviour and the reconnect reconciliation order specified in Phase 0.
- **You do:** the workflow owner validates each decision point; the operator is trained on the kill path.
- **Exit gate:** the workflow runs to completion online, with a complete Article 12 record, accepted by its owner.
- **This phase fails if** a step classified core turns out to need the network. That either reclassifies the step or redesigns it — surfaced here, where it is cheap.

### Phase 3 — Severed-uplink acceptance test · weeks 10–11

**Objective.** The binary KPI, announced, witnessed and recorded.

- **We do:** a **rehearsal run** first under a short window, with findings fixed; then the acceptance run under the agreed window with your witness present; instrumented capture of all three conditions; observation of reconnection behaviour and verification that reconciliation happens in the specified order.
- **You do:** authorise the window; provide the witness; your operator executes the stop.
- **Exit gate — all three, or it is a negative result:** (i) the workflow ran to completion without network access, (ii) the Article 12 record was written locally throughout, with no gap, (iii) the operator stopped a running agent.
- **Why rehearse.** An unrehearsed test measures the deployment engineer's luck, not the architecture. The rehearsal is where problems are meant to appear.

### Phase 4 — Sizing, report and decision · weeks 12–13

**Objective.** Convert measured behaviour into a production decision.

- **We do:** production hardware sizing derived from your measured load, not a vendor spec sheet; deployment mode confirmed or revised against what the test actually showed; before/after report against the baseline; written recommendation and conversion terms.
- **You do:** decide.
- **Exit gate:** report delivered and walked through. The credit terms below run from here.

## Pricing

| | |
| --- | --- |
| **Price** | €19,990 fixed |
| **Duration** | 3 months |
| **Hardware** | None purchased. Runs on existing customer infrastructure or a compact edge appliance. |
| **Credit** | **Credited in full against the €59,990 Aegis onboarding** if you proceed within 6 months |

**One net price, not two.** The pilot is a staged first payment toward Aegis, not a separate fee on top of it. Proceed after the pilot and your total cost to production is the standard €59,990 onboarding — the €19,990 already paid comes off it, leaving €40,000. The pilot lowers the risk of the platform decision; it does not add to its cost.

If you do not proceed, you keep the architecture, the measurements and the evidence record. Nothing further is owed.

### Exactly what is in scope

**The €19,990 includes:** one site, one control-room workflow, and one deployment-mode recommendation; only the agent set that workflow requires; local execution, evidence capture, identity verification, audit logs and human kill authority stood up on your existing hardware or a compact edge appliance; and production hardware sizing derived from measured behaviour on that workload.

**Outside the credit, stated so there is no ambiguity later:** LWM integration; any hardware procurement or appliance supply; multi-site rollout; industries beyond the one piloted; custom ERP, BIM or SCADA integrations; and the separate **DWS IQ Aegis Implementation Programme** (`DWS-AEGIS-IMPL-001`, €45,000, additive and not credited). The credit is capped at €19,990, applies only against Aegis onboarding, and lapses if you do not proceed within 6 months.

### Commercial summary

| Stage | Fee | Credit applied | Balance due at production rollout |
| --- | --- | --- | --- |
| Aegis 3-month pilot | €19,990 | €19,990 (100%) | €40,000 of the €59,990 onboarding |
| Proceed to production | €40,000 | — | €0 — onboarding settled; licence from €999/mo begins |
| **Total cost to production** | **€59,990** | | Unchanged by taking the pilot |

**Why the scope is written this tightly.** A pilot priced at a large fraction of the product stops being a pilot and becomes the product under a lower-commitment name. €19,990 is a bounded subset of onboarding, which is what makes crediting it in full defensible rather than a discount in disguise.

## Who it is for

Manufacturing control rooms, dual-use facilities and other critical sites where a network outage is an operational event rather than an inconvenience — and where somebody has to be able to state, to a regulator or a board, what the system did while the link was down.

## Related

- **DWS IQ Aegis** — the full platform (`DWS-AEGIS-001`), €59,990 onboarding + from €999/mo.
- **DWS IQ Aegis Implementation Programme** — the three-phase engagement (`DWS-AEGIS-IMPL-001`), €45,000, additive and not credited.
- Deployment architecture, modes and the control-room requirement: see the Aegis product page.
