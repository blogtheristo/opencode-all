# DWS Product Production-Readiness Program

---

# VERSION AND AGENT HISTORY

Version: 1.0 [Latest]

Sessions & Modifications:

- Version: 1.0 [Latest] | Tool: GitHub Copilot CLI 1.0.88 | Model: gpt-5.6-sol | Session: opencode/product-readiness-portfolio | Date: 27.09.2026 | Changes: Recovered the 137-product/80-row milestone, reconciled current main, defined production-readiness gates, and assigned every current product record to an implementation chapter. | Harness: GitHub Copilot CLI + CLAUDE.md + AGENTS.md | HIC-approved-drift: none

Document Status:

- Created: 27.09.2026
- Last Modified: 27.09.2026
- Language: English
- Languages Available: English
- Publication Status: ACTIVE
- Classification: INTERNAL
- Owner: Lifetime Oy

---

## Executive decision

**Problem:** The catalogue proves that an offer is described and publishable; it does not prove that the promised outcome can be bought, delivered, operated, supported, and evidenced.

**10-Star Vision:** A buyer can select any public product, receive an exact contract and acceptance boundary, deploy it repeatably, observe it, stop or roll it back, and obtain evidence proving the promised outcome.

**Current state:** 3-star. Only one of 138 product records has a structured acceptanceKpi; 64 public products lack a direct Revolut link; 23 public products lack the four capacity fields.

**Decision:** RESHAPE. Do not build 138 independent stacks. Keep one implementation per capability, express tiers as configuration, make bundles compositions, make services runbooks, and retire unsupported duplicates.

## Count recovery: why 137 became 80

| Evidence | Product records | Public rows | Meaning |
| --- | ---: | ---: | --- |
| Commit 4f0ae8e93bb3ea8a17be343853fd537fb19e2c5a | 137 | 80 | Completed claude/price-list-a5-campaign milestone |
| Commit 2b5b08f7567707d582d83d480f8409ae640318ac | 137 | 80 | Added LIFETIME-IT-TUKI-10H |
| Current origin/main | 138 | 81 | Adds DWS-AEGIS-SUB-001; newer truth |

The 80 rows were 71 public non-BLUE, non-archived product records plus nine active subscription-only records. The other 66 product records were 65 BLUE internal/pilot records and one archived record. The stale pr/linkedin-utf8-docs checkout had 134 product records and 79 rows. Do not delete a product to recreate 137.

### Permanent count control

1. Keep dws10.com/config/products.json as commercial source of truth.
2. Derive counts and lifecycle with scripts/truth/product-registry.mjs.
3. Derive validator expectations; do not maintain parallel numeric constants.
4. Display actual rendered rows, never a typed headline.
5. Fail CI when catalogue, registry, mirror, snapshot, feed, or rendered rows disagree.
6. Record the before/after equation for every add, archive, or discontinue decision.

## Production-ready definition of done

A SKU is 100% production-ready only when every gate is GREEN and linked from its registry row.

| Gate | Required evidence |
| --- | --- |
| G0 Lifecycle truth | Canonical ID, owner, state, dependencies, replacement and decision evidence |
| G1 Buyer and outcome | R-ID buyer, problem, measurable outcome, exclusions and value hypothesis |
| G2 Commercial contract | Price basis, VAT, terms, validity, dependencies, cancellation, SLA and acceptance criteria |
| G3 Working delivery | Implemented code, configured product, or executable service runbook with repeatable provisioning |
| G4 Agent accessibility | CLI, typed JSON, MCP/tool where applicable, and registered skill |
| G5 Security and sovereignty | Threat model, validation, auth/RLS, secrets, data class, model route, KYA and Article 12/14 |
| G6 Verification | Unit, contract, integration and end-to-end tests; domain evals and thresholds |
| G7 Operations | Deployment, health, telemetry, alerts, backup/restore, capacity, SLO and incident runbook |
| G8 Fulfilment | Contact/checkout/quote, CRM/order handoff, invoice, entitlement, renewal and support |
| G9 Product surface | Accurate page/image, promised languages, accessibility, SEO/schema and substantiated claims |
| G10 Acceptance evidence | Staging rehearsal, acceptance test, evidence pack, rollback/stop, handover and sign-off |

Public sale requires G0-G10. BLUE may remain internal with G0-G6 and an explicit promotion decision. A bundle cannot be greener than its least-ready required component.

## Shared architecture

Products flow from catalogue truth to a readiness evidence index, public surfaces and fulfilment. Each SKU points to a shared capability/runtime with CLI, MCP or skill access, deployment, observability, support, acceptance evidence and rollback. Tiers, pilots, outcomes and bundles must not fork the runtime.

## Copilot model routing

| Work | Model | Rule |
| --- | --- | --- |
| Inventory, schema and counts | Deterministic scripts; Gemini 3.8 Flash for bounded drafting | Arithmetic truth stays deterministic |
| Normal implementation | GPT-5.6 Sol | Primary code and tests |
| Cross-system architecture/debugging | GPT-6 Astra or GPT-6 Sol | Contracts, concurrency and failure modes |
| Regulated acceptance | Claude Opus 5.5 or 4.8 | Aegis, compliance, sovereignty and safety |
| Focused review | Claude Sonnet 5, then /review | Production correctness |
| Adversarial challenge | Grok 4.7 | Challenge scope and claims; not a truth source |
| Long-context local classification | Kimi K3 on local/DGX only | Never route Kimi through cloud |

Implementation and recurring validation are DGX-first under docs/DWS_COST_POLICY_STANDARD.md.

## Implementation chapters

Only Chapters 0 and 14 change shared catalogue/publication files. Family work uses isolated worktrees.

### Chapter 0 — Catalogue truth and readiness ledger

**Sessions:** 2. **Model:** GPT-6 Astra plus deterministic scripts. **Dependency:** none.

Build a generated readiness ledger, remove fixed count constants, link evidence, and classify every SKU as retain, merge-as-tier, bundle-only, internal, or retire.

### Chapter 1 — SME web and IT services

**SKUs (3):** LIFETIME-WEB-STARTER, LIFETIME-WEBSTORE-MINI, LIFETIME-IT-TUKI-10H.

**Sessions:** 2. **Model:** GPT-5.6 Sol; Gemini 3.8 Flash for language parity.

Add delivery runbooks, intake/assets, deployment responsibility, acceptance, support, order route and handover.

### Chapter 2 — Consulting, engineering and training

**SKUs (17):** consulting-hourly, consulting-fit55, aws-consultancy, ai-agent-engineering, lean-project, ai-consultant-day, business-mentor-30, firehorse-coach, professional-web-pages, devops-lead, ai-koulutus-3d, claude-code-coaching-3day, claude-code-coaching-lecture, claude-code-coaching-workshop, claude-code-coaching-project, ai-consulting-agentic, sovereignty-cloud-consulting.

**Sessions:** 3. **Model:** GPT-5.6 Sol; Claude Opus 4.8 for regulatory scope; Gemini 3.8 Flash for templates.

Consolidate overlap into reusable modules. Keep professional-web-pages archived and redirect it to LIFETIME-WEB-STARTER. Add statement of work, prerequisites, runbook, acceptance artefact, scheduling, cancellation and support.

### Chapter 3 — DWS IQ core, deployment and cloud

**SKUs (12):** DWS-IQ-006, LIFETIME-BUNDLE-2026, DWS-SOVEREIGN-DB-001, DWS-US-STARTER, DWS-US-PILOT, DWS-EU-STARTER, DWS-EU-PILOT, DWS-CLIMATE-001, DWS-IQ-FREE-2026, AIS-EU-SOV-OC, AIS-OUTCOME-PILOT, DWS-IQ-ESS-SETUP.

**Sessions:** 4. **Model:** GPT-6 Sol, GPT-5.6 Sol, Claude Sonnet 5 review.

Define shared tenant/deployment, entitlements, sovereignty policy, onboarding, SLOs, metering and rollback. Starter, pilot, free and setup are configurations of one platform.

### Chapter 4 — Aegis and KYA

**SKUs (5):** DWS-AEGIS-001, DWS-AEGIS-PILOT-001, DWS-AEGIS-IMPL-001, DWS-AEGIS-SUB-001, KYA-JEV-001.

**Sessions:** 4. **Model:** Claude Opus 5.5, GPT-6 Astra, GPT-5.6 Sol; mandatory security review.

Prove offline execution, identity/capability policy, kill authority, tamper-evident audit, maintenance entitlement and fail-safe behavior. Automate the severed-uplink evidence.

### Chapter 5 — Firehorse applications

**SKUs (9):** FH-AUTO-001, FH-OMNI-001, FH-RPT-001, FH-SIGN-001, FH-CMS-001, conversational-agent, firehorse-flow, omnichannel-multimodal, firehorse-data-services.

**Sessions:** 4. **Model:** GPT-5.6 Sol; Claude Opus 4.8 for evidence; Gemini 3.8 Flash for fixtures.

Lock document, workflow, evidence-vault and channel contracts. Prove reports, signatures, ingestion, review, customer-agent handoff and export without silent fallback.

### Chapter 6 — Sovereign hardware and edge

**SKUs (12):** edge-node-gn100, LF-SITROOM-001, LF-COMPLIANCE-AMBULANCE-001, LF-NVIDIA-INSTALL, LF-JETSON-NANO, LF-JETSON-AGX, LF-DGX-SPARK, LF-JETSON-NX, LF-IGX-ORIN, LF-IPCMAX-IPC409, LF-IPCMAX-IPCP68, LF-IPCMAX-CINCOZE-DA1200.

**Sessions:** 4. **Model:** GPT-6 Astra, GPT-5.6 Sol, Claude Opus 4.8 for safety claims.

Separate resale, installation and managed service. Require BOM, supplier/lead time, compatibility, burn-in, secure provisioning, support consent, warranty/RMA, power/thermal limits and acceptance.

### Chapter 7 — Kubernetes, DOCA, Gov Ready and NIM

**SKUs (15):** LF-K8S-T1, LF-K8S-T2, LF-K8S-T3, LF-K8S-T4, LF-DOCA-ESSENTIAL, LF-DOCA-SECURITY, LF-DOCA-NETWORK-STORAGE, LF-GOV-READY-SETUP, LF-GOV-READY-ANNUAL, LF-GOV-AIRGAP-BUNDLE, LF-FIPS-VALIDATION, LF-NIM-STARTER, LF-NIM-RETRIEVAL, LF-NIM-CODE, LF-NIM-BIOLOGY.

**Sessions:** 5. **Model:** GPT-6 Sol, GPT-5.6 Sol, Claude Opus 5.5 plus security review.

Create pinned profiles, support matrix, SBOM/signing, vulnerability policy, upgrade/rollback and air-gap ceremony. Do not misstate FIPS scope.

### Chapter 8 — Compliance, safety, materials and emissions agents

**SKUs (17):** CMP-T0, CMP-T1, CMP-T2, CMP-OC-STD, CMP-OC-ENT, SS-T0, SS-T1, SS-T2, SS-OC-STD, SS-OC-ENT, MO-T0, MO-T1, MO-T2, MO-OC-STD, MO-OC-ENT, ED-T1, ED-T2.

**Sessions:** 5. **Model:** Claude Opus 5.5, GPT-5.6 Sol, Gemini 3.8 Flash for synthetic fixtures.

Build one capability contract per family and encode tiers as limits. Add source lineage, deterministic calculators, abstention, domain evals and signed acceptance before BLUE promotion.

### Chapter 9 — Operations and assurance agents

**SKUs (9):** SG-T1, SG-T2, CONSTR-T2, LOG-T1, LOG-T2, SOV-T1, SOV-T2, QG-T1, QG-T2.

**Sessions:** 3. **Model:** GPT-6 Astra, GPT-5.6 Sol, Claude Sonnet 5 review.

Prove scheduling, logistics, construction composition, sovereignty and quality-gate contracts with explicit degraded behavior.

### Chapter 10 — Growth, knowledge and viability agents

**SKUs (12):** CSAT-T1, CSAT-T2, LF-T1, LF-T2, CS-T1, CS-T2, SEO-T1, SEO-T2, DW-T1, DW-T2, VIA-T1, VIA-T2.

**Sessions:** 4. **Model:** GPT-5.6 Sol; Grok 4.7 adversarial review; Gemini 3.8 Flash fixtures.

Define consent, source freshness, claim controls, quality metrics, rate limits and escalation. Tier differences are quotas/SLOs, not duplicate agents.

### Chapter 11 — Function and channel bundles

**SKUs (9):** ESG-T3, HSE-T3, CONSTR-T3, SOV-T3, GTM-T3, WF-T4, DWS365-CMP-T3, FH-SKILL-T3, AC365-T3.

**Sessions:** 3. **Model:** GPT-6 Astra and GPT-5.6 Sol.

Make bundles declarative compositions with prerequisite checks, aggregate SLA, entitlement and rollback. Keep BLUE until child capabilities and one end-to-end scenario pass.

### Chapter 12 — Industry pods

**SKUs (9):** IND-MARS, IND-HELIOS, IND-VULCAN, IND-TALOS, IND-GAIA, IND-CERES, IND-NEPTUN, IND-PROM, IND-BESS.

**Sessions:** 3. **Model:** Claude Opus 5.5 and GPT-5.6 Sol.

Implement ontology, prompt/tool policy and eval packs over shared agents. Require sources, fixtures, thresholds, buyer mapping, prohibited claims and one witnessed outcome.

### Chapter 13 — Land-and-expand programmes

**SKUs (9):** LAND-AIL, LAND-EUAI, LAND-HSE, LAND-CSRD, LAND-LCA, LAND-SOV, LAND-OPS, LAND-GTM, LAND-WF.

**Sessions:** 3. **Model:** Claude Opus 4.8, GPT-5.6 Sol, Grok 4.7 scope challenge.

Create engagement plans with inputs, weekly gates, acceptance, dependencies, exclusions, price-to-scope guard and conversion path. These wrap other chapters; they are not new stacks.

### Chapter 14 — Portfolio release gate

**Sessions:** 2. **Model:** GPT-6 Sol plus Claude Sonnet 5 review and deterministic release scripts.

Regenerate registry, lifecycle, five-language pages, snapshots and feed; run security, accessibility, checkout/quote, mirror, link and evidence checks; publish only G0-G10 GREEN SKUs.

## Dependencies and parallelism

Chapter 0 unlocks Chapters 1, 2, 3, 6, 8, 9 and 10 in parallel. Chapter 3 unlocks 4 and 5. Chapter 6 unlocks 7. Chapters 8-10 unlock bundles and programmes in 11-13. Everything converges in Chapter 14.

## Program size and first sessions

The baseline is **51 focused sessions**: two governance sessions, 47 family sessions and two release sessions.

1. **Count and lifecycle lock:** derive all counts, add a machine-readable readiness ledger, eliminate parallel constants.
2. **Evidence baseline:** score every SKU G0-G10 and produce the retain/merge/retire queue.
3. **Core contract:** define shared DWS IQ entitlement, deployment, health, evidence and rollback.

## ENG review

**Architecture:** Approved only with the shared-capability model.

**Data model:** Extend the generated registry with readiness gates and evidence references. A later Supabase persistence change requires a reviewed migration with grants and RLS.

**API:** Query readiness by CLI and JSON first; add MCP after the contract stabilizes. Customer APIs retain JWT, Zod and tenant authorization.

**Failure modes:** Missing evidence fails closed; dependencies degrade explicitly; failed acceptance yields a negative result; bundle readiness is the minimum of required components.

**Security:** Auth, API and user-input work receives dedicated security review. Sovereign deployments cannot silently cloud-fallback.

**Test plan:** Unit-test counts/classification, contract-test fulfilment/entitlement, integration-test deployment/evidence, end-to-end-test one buyer journey per family, and rehearse rollback/kill paths.

**VERDICT: APPROVED AFTER CHAPTER 0.** No family implementation starts until catalogue truth and the readiness ledger are deterministic.

---

**Document version:** v1.0 · **Date:** 27.09.2026 · **Owner:** Lifetime Oy
© 2026 Lifetime Oy (Y-tunnus 0772407-9). All rights reserved.
**Business Confidential.** This document contains confidential and proprietary information of Lifetime Oy. It is disclosed solely to the intended recipient under an applicable NDA or business relationship and may not be copied, distributed, or disclosed to any third party without Lifetime Oy's prior written consent.
