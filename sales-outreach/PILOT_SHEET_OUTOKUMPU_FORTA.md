<!--
VERSION AND AGENT HISTORY
Document: PILOT_SHEET_OUTOKUMPU_FORTA.md
Version: 2.0 — DRAFT (v1.0 reframed CBAM-only -> Sovereign Industrial
         Intelligence; v2.0 adds the five-phase execution plan and the
         network-independence acceptance gate)
Last-Updated: 2026-07-30
Sessions & Modifications:
  - 2.0 | 2026-07-30 | Claude Code (Opus 5), session
         claude/enterprise-ai-harness-0anl7s. Brings the sheet in line with
         the HIC's locked decision of 30.07.2026 (a manufacturing facility is
         dual-use critical infrastructure; loss of connectivity must not stop
         production or the core compliance workflow — see
         kb/wiki/concepts/network-independent-critical-operation.md).
         Adds: the five-phase execution plan replacing the flat 12-week
         milestone list; the deployment mode named and justified per the
         modes-not-tiers decision; KPI 4 (continuity) and the binary
         severed-uplink acceptance gate, which v1.0 lacked entirely; the
         criticality classification of disclosure-pipeline steps; and a price
         reconciliation to the DWS-AEGIS-PILOT-001 list SKU.
         PRICE UNCHANGED at EUR 24,000 — that figure sits in an issued price
         form (bids/OUTOKUMPU/OUTOKUMPU_HINTALOMAKE.md, 27.6.2026) and is not
         renegotiated by a product-catalogue change.
  - 1.0 | 2026-06-22 | Scaffold drafted; commercial values reused from the
         material package + Reply 2 v1.2.
Status: DRAFT. Send-ready when:
        - All [TBD] fields filled in by Risto
        - Reviewed by R05 General Counsel (Lifetime side) or equivalent
        - Forta sub-line confirmed by Outokumpu in Phase 0 scoping
        - Converted to PDF (Pandoc: pandoc PILOT_SHEET_OUTOKUMPU_FORTA.md -o
          PILOT_SHEET_OUTOKUMPU_FORTA.pdf --pdf-engine=xelatex)
Author: Risto Anton Päärni (Lifetime Oy)
Agent: Claude Code (claude-opus-4-7) — scaffold drafted; commercial
       values reused from material package + Reply 2 v1.2. Legal
       framework defaults to Finnish standard practice; legal review
       required before contract execution.
Branch: claude/exa-openclaw-integration-YnDpO
Date: 2026-05-25
Owner: risto.paarni@lifetime.fi
Audience: Ari Hirvonen primary; routable to Outokumpu Procurement
          (R20 / R21), CFO (R23), General Counsel / Legal (R05 / R06).
Funnel role: Attachment 1/2 referenced in Reply 2 v1.2 ("Here is the
             detailed pilot sheet and the NVIDIA hardware line items").
             Companion: NVIDIA_HARDWARE_LINE_ITEMS_OUTOKUMPU.md.
Legal note: This is a PILOT PROPOSAL, not a contract. Subject to
            mutual NDA and execution of separate pilot agreement on
            Lifetime Oy standard terms. R05 General Counsel review
            mandatory before signature.
-->

# Pilot Proposal — Europe's Sovereign Industrial Intelligence Stack

> One governed model for operational DNA and regulatory DNA, so industrial systems can perceive, decide, and act inside Europe without giving up sovereignty.

**Customer:** Outokumpu Oyj
**Provider:** Lifetime Oy
**Date issued:** 2026-05-25 _(Risto: update on send date)_
**Version:** 2.0 _(draft — supersedes v1.0; adds the five-phase plan and the network-independence gate)_
**Classification:** Confidential — Outokumpu Oyj and Lifetime Oy only

---

## 1. Parties

| Role                              | Party                                 | Details                                                                                      |
| --------------------------------- | ------------------------------------- | -------------------------------------------------------------------------------------------- |
| **Provider**                      | Lifetime Oy                           | Espoo, Finland. Business ID 0772407-9. VAT FI07724079. Laidunmaanraitti 2 A 25, 02330 Espoo. |
| **Provider primary contact**      | Risto Anton Päärni                    | CEO, Lifetime Oy. risto.paarni@lifetime.fi                                                   |
| **Customer**                      | Outokumpu Oyj                         | Helsinki, Finland. Business ID _[TBD — fill from PRH]_. VAT _[TBD]_.                         |
| **Customer primary contact**      | Ari Hirvonen                          | Patent IP Director, Outokumpu Oyj. ari.hirvonen@outokumpu.com _(verify)_                     |
| **Customer commercial signatory** | _[TBD — typically CFO / Procurement]_ |                                                                                              |

---

## 2. Pilot scope

**What we deploy:** Europe's Sovereign Industrial Intelligence stack — one governed model that internalises both the Operational DNA (thermodynamic profiles, acoustic signatures, shift patterns, process workflows) and the Regulatory DNA (CBAM, CSRD, EU AI Act Art. 12, NIS2) of one Outokumpu production line. The model perceives, decides, and acts inside the plant network. No cloud dependency. No CLOUD Act exposure. Customer controls the stack.

- **Product line in scope:** one Outokumpu Forta sub-line, to be selected by Customer during Phase 0 scoping (candidates: Forta H-series, Forta SX, Forta LDX, or Customer's nominated alternative).
- **Sovereignty guarantee:** air-gapped training and inference on Customer NVIDIA hardware. Finnish jurisdiction only. Per-site unique model trained where the data lives. Customer owns 100% of resulting model weights.
- **Workflow in scope:** KYA-governed CBAM / EPD / Scope-3 disclosure pipeline. Field-level allow / redact / aggregate rules authored by Customer's IP function. Cryptographic human-bound veto path before publication.
- **Source data integration:** melt-shop and EAF historian, energy management system, scrap registry. Read-only; no source-data mutation.
- **Output:** signed CBAM / EPD / Scope-3 disclosure document, attachable to a sales quote, with Article 12 audit log per disclosure. Compliance as a native byproduct of operational awareness, not a separate cost centre.
- **This is not SaaS:** the hardware and trained model stay with Customer after the pilot ends — infrastructure that compounds as the system learns.
- **Out of scope:** other Outokumpu product lines (replicable post-pilot at commercial conversion); upstream supplier disclosure governance (separate workstream, can be added at commercial conversion).

### 2.1 Deployment mode

Aegis is deployed in one of three modes. Mode follows the workload; it is **not** gated by commercial tier.

| Mode | For | What stays on site |
| ---- | --- | ------------------ |
| **Local / edge** | Control rooms, critical and dual-use sites | Core execution, evidence, identity, logs, kill authority. No network dependency for the core outcome. |
| **Hybrid** | Local guarantees plus central visibility | Local execution; optional sync, backup and reporting to EU cloud |
| **EU-sovereign cloud** | Non-critical workloads, reporting, development | Nothing — network-dependent by design, and appropriate where that is acceptable |

**Recommended for this pilot: Local / edge, confirmed in Phase 0.** Tornio is a continuously-operating integrated mill, and under the hybrid-threat assessment a facility of this class is dual-use critical infrastructure — connectivity is an adversary-reachable dependency. The disclosure pipeline in scope is a **core compliance workflow**, so the same requirement that protects production protects it: a signed disclosure and its Article 12 record must remain producible with the uplink down.

### 2.2 Criticality classification

Phase 0 marks every step of the disclosure pipeline **core** or **non-core**. The distinction is operative, not descriptive: core steps must complete with the uplink severed, and a step that needs the network is by definition not core.

| Expected classification | Steps |
| --- | --- |
| **Core — must survive an outage** | Historian and energy-management reads from the plant network; emissions computation; IP-rule evaluation; the IP-function veto gate; disclosure signing; Article 12 record write |
| **Non-core — may degrade** | External benchmark refresh; CBAM registry submission; central reporting and dashboards; off-site backup |

**Degraded mode is specified in Phase 0, not discovered during an incident.** What is lost, what continues, and what reconciles on reconnection — in what order — are written down before the test.

---

## 3. Duration and effort

| Item                          | Value                                                                                                                |
| ----------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| Total duration                | 3 months from contract signature                                                                                     |
| Provider effort               | 50% (~1.5 person-months of senior engineer / CEO time)                                                               |
| **Phase 0 — Scoping**         | Weeks 0–2, **FREE OF CHARGE**. Forta sub-line selection, source-data audit, criticality classification, baseline.    |
| **Phases 1–4 — Execution**    | Weeks 3–13. Local substrate, pipeline integration, severed-uplink acceptance test, sizing and final report.          |
| Start date                    | _[TBD — depends on signature date; default 5 business days after signature]_                                         |

The phase ordering is deliberate. The **local substrate is proven before the disclosure pipeline exists** (Phase 1 before Phase 2), so that a failure at the acceptance test is a pipeline problem rather than a platform problem. The **acceptance test is rehearsed before it is taken** (Phase 3), because an unrehearsed outage test measures the deployment engineer's luck rather than the architecture.

Each phase carries an exit gate. **A gate that does not pass is reported, not worked around** — the pilot's value to Outokumpu is the finding, including an unfavourable one.

---

## 4. Commercial terms

| Item                              | Value                                                                                                                                                                                                                                                                                                                                                        |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Pilot price (Provider effort)** | **€24,000 (ex-VAT)**                                                                                                                                                                                                                                                                                                                                         |
| Currency                          | EUR                                                                                                                                                                                                                                                                                                                                                          |
| Budget source                     | Outokumpu Oyj                                                                                                                                                                                                                                                                                                                                                |
| Payment schedule                  | _[Default: 50% on contract signature, 50% on final-report acceptance (Phase 4, week 13). Adjustable per Customer's standard AP terms.]_                                                                                                                                                                                                                          |
| VAT treatment                     | EU B2B intra-community reverse charge (Customer accounts for VAT)                                                                                                                                                                                                                                                                                            |
| Invoicing                         | Monthly progress invoices acceptable; default per payment schedule above                                                                                                                                                                                                                                                                                     |
| **NVIDIA hardware**               | **Customer CAPEX. Customer purchases, Customer owns. Hardware stays with Customer after the pilot** — durable infrastructure asset whether or not the pilot converts to commercial license. Sourced via NVIDIA EU partner channel at list (or partner discount where available). No Lifetime margin. See attached `NVIDIA_HARDWARE_LINE_ITEMS_OUTOKUMPU.md`. |
| **EU sovereign cloud services**   | OPEX, monthly pass-through (Scaleway Paris and/or Aiven Helsinki). Billed at provider cost, no Lifetime margin. Customer may BYO if existing contracts exist.                                                                                                                                                                                                |
| BYO option (hardware)             | Customer may deploy on existing NVIDIA workstations / servers if equivalent specifications. Lifetime provides configuration + integration only.                                                                                                                                                                                                              |
| BYO option (cloud)                | Customer may use existing Scaleway / Aiven contracts where available. Provider invoices Customer directly.                                                                                                                                                                                                                                                   |
| Cancellation                      | Customer may cancel at any time. Cancellation fee: Provider effort delivered up to cancellation date, pro-rated. No penalty.                                                                                                                                                                                                                                 |

### 4.1 Relationship to the DWS IQ Aegis Pilot list price

Lifetime's catalogue lists a standard **DWS IQ Aegis Pilot at €19,990** (`DWS-AEGIS-PILOT-001`) — one site, one control-room workflow, one deployment-mode recommendation, credited in full against Aegis onboarding.

**This proposal is priced at €24,000 and that figure stands.** It was issued to Outokumpu in the price form of 27.6.2026 (`OUTOKUMPU_HINTALOMAKE.md`) and is not renegotiated by a change to Lifetime's product catalogue. The €4,010 difference is scope, not margin:

| Beyond the standard €19,990 pilot scope | Why |
| --- | --- |
| **Three source-system integrations** (melt-shop / EAF historian, energy management, scrap registry) | The list pilot scopes the agent set for one workflow; it does not assume three read-only industrial integrations |
| **IP-rule schema co-authoring** with Outokumpu's IP function | Field-level allow / redact / aggregate governance is bespoke design work, not configuration |
| **Two measurement regimes** — the efficiency baseline (KPIs 1–3) and the continuity gate (KPI 4) | The list pilot measures continuity only |
| **Bilingual final report** (English + Finnish on request) | |

**Credit treatment is unchanged from the list terms:** the €24,000 is credited in full against Aegis onboarding if Outokumpu proceeds within 6 months of pilot completion. Excluded from the credit, as on the list SKU: LWM integration, hardware, multi-site rollout, product lines beyond the piloted Forta sub-line, and custom ERP / BIM / SCADA integrations. The separate **DWS IQ Aegis Implementation Programme** (`DWS-AEGIS-IMPL-001`, €45,000, three phases) is additive and is **not** credited — it is not part of this proposal.

---

## 5. Deliverables

1. **KYA-governed disclosure pipeline** integrating with Outokumpu's existing source systems (melt-shop historian, energy mgmt, scrap registry).
2. **IP-function veto path:** field-level allow / redact / aggregate rules authored by Customer IP function; cryptographic human-bound gate before publication.
3. **Article 12 audit log** (EU AI Act compliance) for every AI-mediated action in the pipeline.
4. **Before/after measurement report** covering the four KPIs in §7.
5. **Criticality classification and degradation spec:** every pipeline step marked core or non-core; what is lost, what continues, and what reconciles on reconnection — in what order (Phase 0 deliverable, §2.2).
6. **Severed-uplink acceptance record:** the witnessed Phase 3 run, instrumented against all three conditions of KPI 4, with the reconnection and reconciliation behaviour observed.
7. **Production sizing report** derived from measured load on Outokumpu's own workload, not a vendor spec sheet.
8. **Technical documentation:** architecture diagram, KYA configuration, IP-rule schema, integration runbook, operator guide, and the operator kill-authority procedure.
9. **Final pilot report** (English; Finnish translation on request) including commercial-conversion recommendation.

---

## 6. Phase plan

### Phase 0 — Scoping and baseline · weeks 0–2 · free of charge

**Objective.** Establish what the core outcome is, precisely enough that it can be tested.

| | |
| --- | --- |
| **Provider delivers** | Forta sub-line locked; read-only source-data audit (melt-shop / EAF historian, energy management system, scrap registry); **criticality classification** per §2.2; deployment-mode recommendation with justification; degradation and reconnect-reconciliation spec, first draft; baseline measurement of current cycle time, IP-coverage % and sales-engineering hours per disclosure |
| **Customer provides** | Technical contact; IP-function policy owner; the named operator who will exercise kill authority; read-only source-system access; sales-engineering counterpart for baseline; **the agreed outage window, its date, and the isolation method per §6.1** |
| **Exit gate** | A one-page signed scope: sub-line, workflow, deployment mode, the isolation method and its validity note, and the three acceptance conditions of §7 KPI 4 written in Outokumpu's own operational language |
| **Fails if** | The disclosure workflow cannot be expressed as a terminating sequence with a defined "complete" state. Without a completion condition there is nothing to test — and Outokumpu learns this having spent nothing |

### 6.1 Isolation method — agreed in Phase 0, never improvised in week 11

Tornio runs continuously. **Physically pulling the WAN uplink on a live mill is not a reasonable ask**, and a pilot that assumes it will be permitted arrives at week 11 with no test. The isolation method is therefore selected and written down in Phase 0, from this ladder:

| | Method | What it proves about the **network boundary** | Operational disruption |
| --- | --- | --- | --- |
| **A** | Physical disconnect of the WAN uplink | Everything — the boundary is not a configuration | Highest; normally unavailable on a live mill |
| **B** | Deny-all egress on the edge router / firewall WAN interface | The boundary holds under the plant's own enforcement point | Moderate; a change window at the network boundary |
| **C** | VLAN isolation of the Aegis segment | The Aegis segment cannot reach anything beyond it | Low; contained to the pilot segment |
| **D** | Host-level egress block on the Aegis nodes | Only that the workload does not need the network | Lowest |

**Recommended for Tornio: C, with B during a scheduled maintenance window if one falls inside weeks 10–11.**

**The validity rule, which matters more than the choice.** Whichever method is used, it must satisfy both of the following, or KPI 4 measures configuration rather than architecture:

1. **Enforced above the stack.** The block is applied at a layer the Aegis deployment cannot influence — the plant's router, switch or hypervisor, administered by Outokumpu, not by a setting inside the Aegis runtime. A system that is asked to disconnect itself has not been tested.
2. **Verified before the run starts.** An egress attempt is made and shown to fail, and the failure is captured in the acceptance record. An outage that was never confirmed to be an outage proves nothing.

**Methods B–D prove progressively less about the boundary and exactly the same amount about the workload.** That is the honest reading and it is stated in the final report: the acceptance record names the method used, so a reader in three years knows what was and was not demonstrated. Escalating to A or B at commercial conversion, when a production change window is available, remains open.

### Phase 1 — Local substrate · weeks 3–5

**Objective.** Execution, identity, evidence and kill authority standing on the plant network. Nothing about the disclosure pipeline yet.

| | |
| --- | --- |
| **Provider delivers** | Execution runtime and local model serving on Customer NVIDIA hardware (or compact edge appliance); **KYA agent identity resolving locally**, with no reachable control plane; Article 12 log writer against local durable storage; kill path operator → running agent with no network hop |
| **Customer provides** | Hardware placement, power, plant-network segment, operator account provisioning |
| **Exit gate** | The **four locals** demonstrated in isolation with the uplink already down: an agent runs, is identified, writes a record, and can be stopped |
| **Fails if** | Identity issuance or kill authority requires a round-trip. Kill authority that depends on a reachable control plane is not kill authority — and this is reported at week 5, not discovered at week 11 |

### Phase 2 — Disclosure pipeline integration · weeks 6–9

**Objective.** Outokumpu's actual CBAM / EPD / Scope-3 workflow, running on the local substrate.

| | |
| --- | --- |
| **Provider delivers** | The agent set the disclosure workflow requires and no more; read-only integration to historian, energy management and scrap registry; IP-rule schema (joint with Customer IP function); the IP-function veto gate as a **local** cryptographic human-bound stop; each decision point mapped to the Article 12 record schema; degraded-mode behaviour and reconnect reconciliation implemented per the Phase 0 spec |
| **Customer provides** | IP function authors and refines field-level allow / redact / aggregate rules; workflow owner validates each decision point; operator training on the kill path; sales-engineering counterpart triggers disclosure requests |
| **Exit gate** | A signed disclosure generated end-to-end **online**, with a complete Article 12 record, accepted by the IP function |
| **Fails if** | A step classified core in Phase 0 turns out to need the network. That reclassifies the step or redesigns it — surfaced at week 9, where it is cheap |

### Phase 3 — Severed-uplink acceptance test · weeks 10–11

**Objective.** The binary continuity gate (§7 KPI 4), announced, witnessed and recorded.

| | |
| --- | --- |
| **Provider delivers** | Verification that the Phase 0 isolation method is enforced above the stack and that egress actually fails (§6.1); a **rehearsal run** under a short window with findings fixed; then the witnessed acceptance run under the agreed window; instrumented capture of all three conditions; observation of reconnection behaviour and verification that reconciliation occurs in the specified order |
| **Customer provides** | Authorisation of the outage window; a witness present (Operations and/or IP function); the operator executes the stop |
| **Exit gate** | **All three, or a documented negative result:** (i) the disclosure workflow ran to completion without network access, (ii) the Article 12 record was written locally throughout with no gap, (iii) the operator stopped a running agent |
| **Why rehearsed** | An unrehearsed test measures luck. The rehearsal is where problems are meant to appear |

### Phase 4 — Sizing, report and conversion decision · weeks 12–13

**Objective.** Convert measured behaviour into a production decision.

| | |
| --- | --- |
| **Provider delivers** | Production hardware sizing derived from Outokumpu's **measured** load rather than a vendor spec sheet; deployment mode confirmed or revised against what the test showed; before/after analysis on all four KPIs; final pilot report and commercial-conversion recommendation — **including the recommendation not to proceed, where the evidence supports it** |
| **Customer provides** | Measurement-data validation; conversion decision |
| **Exit gate** | Final report delivered and walked through; success criteria of §8 evaluated jointly |

---

## 7. Measurement (KPIs)

All measurements use Customer's actual data from the pilot Forta sub-line. Baseline measured in Phase 0 (weeks 0–2); efficiency performance measured in Phase 2 (weeks 8–9); the continuity gate is measured once, in the witnessed Phase 3 run (week 11).

| #   | KPI                                   | Baseline (industry benchmark; Customer-actual measured in Phase 0)         | Target at pilot exit                                                    | Measurement method                                                                                             |
| --- | ------------------------------------- | -------------------------------------------------------------------------- | ----------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| 1   | **Disclosure cycle time**             | 18–42 days per disclosure (sector benchmark; Customer-actual TBD week 1–2) | **< 2 minutes per disclosure**                                          | Time from sales engineer disclosure request to signed document attached to quote. Sampled across pilot period. |
| 2   | **IP-function coverage rate**         | < 10% (ad-hoc review; Customer-actual TBD week 1–2)                        | **≥ 95%** of pilot-period disclosures pass through IP-review gate       | Pilot pipeline logs % of disclosures gated through IP-rule schema before publication.                          |
| 3   | **Sales-engineering hours reclaimed** | 8–16 hours per disclosure (sector benchmark; Customer-actual TBD week 1–2) | **≥ 240 hours/rep/year extrapolated** (lower bound of sector benchmark) | Time tracking on disclosure-related tasks: before pilot (week 1–2) vs during pilot (week 8–11).                |
| 4   | **Continuity under severed uplink** _(new in v2.0)_ | Not currently testable — the present pipeline has an external dependency at every stage | **Pass / fail, all three conditions** (see below) | Witnessed acceptance run, Phase 3 week 11, under the outage window agreed in Phase 0.                          |

### KPI 4 — the continuity gate, stated in full

KPIs 1–3 measure how much better the workflow gets. **KPI 4 measures whether it exists at all when the network does not.** It is binary by design, because a partial answer is not usable by a board or a regulator.

With the uplink severed for the agreed window — by the isolation method fixed in Phase 0 (§6.1), enforced above the stack and verified to actually block egress before the run begins:

1. **Workflow continuity** — the disclosure workflow runs to completion, producing a signed disclosure, without network access.
2. **Local compliance record** — the EU AI Act Article 12 record continues to be written locally, with no gap for the duration of the outage.
3. **Local control** — an operator invokes human kill authority and stops a running agent, with no reachable control plane.

**All three must pass.** A pilot that fails under a severed uplink has delivered a **valid negative result about environment readiness — it is not a product defect**, and Outokumpu will have learned it for €24,000 rather than after a hardware programme.

**Why this KPI is here and was not in v1.0.** Under the hybrid-threat assessment, a mill of Tornio's class is dual-use critical infrastructure and connectivity is an adversary-reachable dependency. NIS2 and the CER Directive already treat continuity of essential entities as an obligation. And Article 12 requires the record to exist for decisions taken **during** an outage, not to be reconstructed afterwards — a pipeline whose evidence chain pauses when the uplink drops has its gap at precisely the moment the record matters most. That moves this from resilience engineering to compliance engineering.

---

## 8. Success criteria for commercial conversion

If at pilot exit (Phase 4, week 13) the measurements show all four of:

- KPI 1: **≥ 90% cycle-time reduction** from Customer-actual baseline,
- KPI 2: **≥ 95% IP-function coverage rate** of pilot-period disclosures,
- KPI 3: **≥ 240 hours/rep/year reclaimed** (extrapolated from week 8–11 measurement), and
- KPI 4: **the continuity gate passed on all three conditions** (Phase 3 witnessed run),

then Customer has the **option** to convert to a commercial DWS IQ 6 license on terms to be agreed separately. Conversion is at Customer's sole discretion; pilot completion creates no commercial obligation on Customer.

If success criteria are not met, pilot ends with delivery of the final report. No commercial obligation on either party either way.

**KPI 4 is reported separately whatever the other three do.** Efficiency and continuity are different questions for different buyers — KPIs 1–3 answer to Sustainability and Sales Engineering, KPI 4 answers to Operations, the CISO and the board's risk committee. A pilot that reduces cycle time by 95% and fails the continuity gate has produced two findings, both of which Outokumpu needs, and neither of which should be hidden inside a single pass/fail verdict.

---

## 9. Compute and hardware (pass-through, see attached)

See attached `NVIDIA_HARDWARE_LINE_ITEMS_OUTOKUMPU.md` for itemised list. Summary:

- **NVIDIA compute:** Jetson Orin Nano edge units (site-edge inference) and / or DGX Spark cloud capacity (central training / batch inference). Scope-dependent on Phase 0.
- **EU sovereign data services:** Scaleway (Paris) and / or Aiven (Helsinki). Postgres, object storage, optional event streaming.
- All passed through at provider cost. No Lifetime margin.
- Customer may BYO existing contracts where they exist.
- Sovereignty: all infrastructure Tier 1 Full EU Sovereign per `DWS_STANDARDS_LIBRARY.md` §3.6. No US Cloud Act perimeter on Customer data or IP material.

---

## 10. Governance and compliance

- **KYA-attested operator identity** for every AI-mediated action in the pipeline. Cryptographic, human-bound, auditable.
- **EU AI Act Article 12 audit log:** automatic, immutable, per-action.
- **EU AI Act Annex III alignment:** confirmed (high-risk AI use case in regulated industrial disclosure).
- **NIS2:** incident reporting capability built in; 24h early warning, 72h final report flow.
- **GDPR:** data processing limited to Customer's own data; DPA template on request before signature.
- **Trade-secret protection:** all source data and IP-rule schemas treated as Customer trade secret; provider personnel under NDA per §12.

---

## 11. IP ownership

| Asset                                                                               | Owned by                                                                                                              |
| ----------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| DWS IQ 6 platform, KYA framework, agent definitions, methodology                    | Lifetime Oy                                                                                                           |
| Outokumpu source data, IP-rule schemas authored by Outokumpu, generated disclosures | Outokumpu Oyj                                                                                                         |
| Pilot measurement data                                                              | Joint — both parties may use for internal reporting; external publication requires written consent of the other party |
| Improvements to the DWS IQ 6 platform made during the pilot                         | Lifetime Oy (Customer receives the benefit via the platform; no separate licence)                                     |
| Improvements specific to Outokumpu's IP-rule schema                                 | Outokumpu Oyj                                                                                                         |

---

## 12. Legal framework

- **Governing law:** Finland.
- **Jurisdiction:** Helsinki District Court.
- **Mutual NDA:** prerequisite to Phase 0. Lifetime Oy standard mutual NDA on request, or reference existing NDA between the parties if one is in place.
- **Liability cap:** Provider's aggregate liability under this pilot capped at the pilot price (€24,000). Standard exclusions for gross negligence, wilful misconduct, and IP indemnification.
- **Pilot agreement:** This proposal is subject to mutual agreement on Lifetime Oy standard pilot terms, executed via separate pilot agreement document. Material terms (price, scope, duration, KPIs, success criteria) per this proposal carry over to the pilot agreement; legal-framework terms are finalised in the pilot agreement.

---

## 13. Acceptance

**This proposal is valid until 31.12.2026** (HIC decision 30.7.2026, aligning this sheet with the re-issued offer `bids/OUTOKUMPU/OUTOKUMPU_TARJOUKSEN_UUDELLEENANTO.md`). Acceptance by Customer signature below initiates Phase 0 scoping kickoff; legal-framework finalisation (§12) runs in parallel and must be executed before Phase 1 start.

**Validity is not a capacity reservation.** The pilot commits ~1.5 person-months of senior effort across three months, and start slots are allocated in signature order. Signature by 30.9.2026 completes within 2026; signature in Q4 completes in Q1 2027. Where the start date matters to Customer it should be fixed in the pilot agreement rather than assumed from the validity date.

|           | Lifetime Oy              | Outokumpu Oyj    |
| --------- | ------------------------ | ---------------- |
| Signed by | Risto Anton Päärni, CEO  | _[Name + title]_ |
| Date      |                          |                  |
| Email     | risto.paarni@lifetime.fi | _[Email]_        |

---

## Document control

- Sources for commercial terms: `sales-outreach/LETTER_ARI_HIRVONEN_OUTOKUMPU_MATERIAL_PACKAGE.md`, `sales-outreach/LETTER_ARI_HIRVONEN_OUTOKUMPU_REPLY2_CLARIFICATION.md`.
- Sources for measurement baselines: `sales-outreach/CYCLE_TIME_BENCHMARK_OUTOKUMPU_FORTA.md`.
- Sources for sovereignty / compliance: `DWS_STANDARDS_LIBRARY.md` §3.1, §3.3, §3.6.
- Companion document: `sales-outreach/NVIDIA_HARDWARE_LINE_ITEMS_OUTOKUMPU.md`.
- Sources for the continuity requirement and the phase structure (new in v2.0): `kb/wiki/concepts/network-independent-critical-operation.md`, `docs/field-notes/2026-07-30-network-independent-critical-operation.md`, `Store/PRODUCT_AEGIS_PILOT.md` (the €19,990 list SKU whose phase plan this instantiates).
- Price of record: `bids/OUTOKUMPU/OUTOKUMPU_HINTALOMAKE.md` (27.6.2026, €24,000). **This sheet does not change it.**
- v2.0 supersedes v1.0. v1.0 was never issued; the pre-send checklist below was never cleared.

## Pre-send checklist for Risto

- [ ] Fill all `[TBD]` fields in §1, §3, §4, §13
- [ ] Confirm Outokumpu business ID + VAT (PRH lookup)
- [ ] Confirm Customer commercial signatory (likely Outokumpu CFO or Procurement Director — Ari to nominate)
- [ ] Confirm preferred payment schedule (default 50/50 in §4; adjust if Outokumpu standard AP terms differ)
- [ ] R05 General Counsel review of §11 (IP ownership) and §12 (Legal framework) before issue

**New in v2.0 — clear before issue:**

- [ ] **Confirm the €24,000 vs €19,990 reconciliation in §4.1 is one you will defend to procurement.** If Outokumpu's procurement compares against the published list price, the four scope lines are the answer — check they are accurate before they are read back to you.
- [ ] **Confirm KPI 4 is a gate you want in a customer-facing document.** It can fail, and it is written so that failing is a legitimate delivered outcome. That is the honest framing and it is deliberate — but it is a commercial choice, not a technical one.
- [ ] **Agree the isolation method with Operations before Phase 0 closes** (§6.1). The ladder is specified and VLAN isolation (method C) is recommended for Tornio, so this is a selection rather than an open question — but it is Operations' selection, not ours, and it must be signed into the Phase 0 scope. The one thing not to concede: the block must be enforced at Outokumpu's own network layer, not by a setting inside the Aegis runtime.
- [ ] Route to **Operations / Plant Director** as well as Ari — KPI 4 answers to Operations and the CISO, not to the IP function (see `sales-outreach/INTRO_CONTROL_ROOM_OUTOKUMPU_TORNIO.md` for the Operations door).
- [ ] Convert to PDF: `pandoc PILOT_SHEET_OUTOKUMPU_FORTA.md -o PILOT_SHEET_OUTOKUMPU_FORTA.pdf --pdf-engine=xelatex --variable=geometry:a4paper,margin=20mm`
- [ ] Attach PDF (not .md) to the email
