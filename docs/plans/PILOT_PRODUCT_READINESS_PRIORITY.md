# Pilot Product Readiness Execution Plan

---

# VERSION AND AGENT HISTORY

Version: 1.1 [Latest]

Sessions & Modifications:

- Version: 1.1 [Latest] | Tool: Claude Code | Session: claude/aegis-pilot-implementation-03ist6 | Date: 28.09.2026 | Changes: DWS-AEGIS-PILOT-001 evidence row now points at the local-first kit (`src/aegis/pilot/`, `npm run aegis:pilot`, runbook `docs/runbooks/AEGIS_PILOT_RUNBOOK.md`). Readiness score unchanged pending HIC. | Harness: Claude Code + CLAUDE.md | HIC-approved-drift: none
- Version: 1.0 [not latest] | Tool: OpenCode | Session: opencode/pilot-readiness-priority | Date: 28.09.2026 | Changes: Created pilot readiness priority plan using immutable price-list v1.33 snapshot as primary source. Enforces 3 active pilots + 1 next + 1 last. Reference pointer to PRODUCT_PRODUCTION_READINESS_PROGRAM.md added. | Harness: OpenCode + CLAUDE.md + AGENTS.md + DWS_DOCUMENT_STANDARD | HIC-approved-drift: none

Document Status:

- Created: 28.09.2026
- Last Modified: 28.09.2026
- Language: English
- Languages Available: English
- Publication Status: ACTIVE
- Classification: INTERNAL
- Owner: Lifetime Oy

---

## Executive decision

**Problem:** The immutable price-list snapshot v1.33 lists 81 active public offers and exactly 5 explicit pilot SKUs. Only 3 can be active at a time. LF-ONTOLOGY-PILOT is not scored and remains in maturation.

**HIC decision 28.09.2026:** LF-ONTOLOGY-PILOT must be LAST in prioritization, not one of the active WIP slots. Active ontology is still maturing.

**Decision:** RESHAPE. Use immutable price-list snapshot v1.33 (dws10.com/price-list/versions/price-list-v1.33.html) as the sole source of commercial terms. Enforce maximum 3 active pilots.

## Term extraction (immutable snapshot v1.33)

| ID                    | Name                                      | Price                       | Unit            | Credited/Refundable                                              |
| --------------------- | ----------------------------------------- | --------------------------- | --------------- | ---------------------------------------------------------------- |
| `DWS-AEGIS-PILOT-001` | DWS IQ Aegis Pilot (3 months)             | €19,990 fixed               | 3 months        | Credited in full against €59,990 Aegis licence (within 6 months) |
| `DWS-US-PILOT`        | DWS IQ — US Cloud Pilot                   | €799/month + €2,490 setup   | monthly + setup | 4-week evaluation period                                         |
| `DWS-EU-PILOT`        | DWS IQ — EU Sovereign Pilot               | €1,499/month + €3,990 setup | monthly + setup | Full EU sovereign evaluation tier                                |
| `AIS-OUTCOME-PILOT`   | Outcome-Priced Applied-AI Pilot (6 weeks) | €9,990                      | one-time        | Refundable if named KPI does not move                            |
| `LF-ONTOLOGY-PILOT`   | Independent Ontology Pilot, one site      | €15,000–€25,000             | 3 months        | 100% credited to first licence year (within 90 days)             |

## Pilot readiness evidence (HIC 28.09.2026)

| ID                    | Group                             | Readiness  | Evidence source                                                                              |
| --------------------- | --------------------------------- | ---------- | -------------------------------------------------------------------------------------------- |
| `DWS-AEGIS-PILOT-001` | DWS IQ platform                   | 56%        | `src/agents/aegis.agent.ts`; Article 12 logging, audit chain, replay protection              |
| `DWS-US-PILOT`        | DWS IQ platform                   | 55%        | Chapter 3 shared tenant/deployment; US Cloud (Supabase + Cloudflare)                         |
| `DWS-EU-PILOT`        | DWS IQ platform                   | 55%        | Chapter 3 shared tenant/deployment; EU sovereign cloud (Aiven PostgreSQL + Hetzner/Scaleway) |
| `AIS-OUTCOME-PILOT`   | Services, consulting and training | 55%        | Chapter 3; outcome-priced SLA with KPI refund                                                |
| `LF-ONTOLOGY-PILOT`   | Independent data products         | Not scored | Active ontology maturing; scored prerequisites pending                                       |

## Priority matrix

| Priority                | ID                    | Group                             | Readiness  | Status                                                   |
| ----------------------- | --------------------- | --------------------------------- | ---------- | -------------------------------------------------------- |
| P0 active               | `DWS-AEGIS-PILOT-001` | DWS IQ platform                   | 56%        | Active WIP slot                                          |
| P0 active               | `AIS-OUTCOME-PILOT`   | Services, consulting and training | 55%        | Active WIP slot                                          |
| P0 active               | `DWS-EU-PILOT`        | DWS IQ platform                   | 55%        | Active WIP slot                                          |
| P1 next                 | `DWS-US-PILOT`        | DWS IQ platform                   | 55%        | Pending activation (first to promote when P0 slot frees) |
| P2 last/maturation hold | `LF-ONTOLOGY-PILOT`   | Independent data products         | Not scored | Maturation hold (G10 only, after first four pilots)      |

**Active limit rule:** Maximum three active pilots simultaneously. LF-ONTOLOGY-PILOT is explicitly excluded from active slots until the first four price-list pilots are closed or HIC explicitly promotes it.

### Timing and phase estimates (HIC 28.09.2026 cadence)

| Phase                        | Scope                                                | Estimated duration |
| ---------------------------- | ---------------------------------------------------- | ------------------ |
| G0-G6 (active WIP)           | First three P0 pilots reach technical readiness      | **4–6 weeks**      |
| G0-G9 (all pilots)           | All five pilots complete gates                       | **8–10 weeks**     |
| G0-G10 (deployment evidence) | First four pilots with customer/deployment evidence  | **14–18 weeks**    |
| G10 (ontology)               | LF-ONTOLOGY-PILOT G10 after first four pilots closed | **22–26 weeks**    |

**Note:** Timing assumes Sunday HIC batches and weekday 1–2h DGX loop gate throughput. First four pilots share Chapter 3/4 implementation effort; LF-ONTOLOGY-PILOT waits for maturity/scoring criteria.

## Next gate definition

For each pilot, include: group, exact terms, readiness, next gate, evidence, conversion target, dependency, stop condition.

### DWS-AEGIS-PILOT-001 — P0 active

| Field                 | Details                                                                                                                                                                                                                                                                             |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Group**             | DWS IQ platform                                                                                                                                                                                                                                                                     |
| **Exact terms**       | €19,990 fixed, 3 months. Credited in full against €59,990 Aegis licence if proceed within 6 months (net cost unchanged at €59,990).                                                                                                                                                 |
| **Readiness**         | 56%                                                                                                                                                                                                                                                                                 |
| **Next gate**         | G0-G6 (Chapter 4) — prove offline execution, identity/capability policy, kill authority, tamper-evident audit, maintenance entitlement, fail-safe behavior                                                                                                                          |
| **Evidence**          | `src/agents/aegis.agent.ts`, Article 12 audit ledger, replay protection, sovereignty monitoring; local-first pilot kit `src/aegis/pilot/` (local ledger, site identity, operator kill authority, automated severed-uplink acceptance test — `docs/runbooks/AEGIS_PILOT_RUNBOOK.md`) |
| **Conversion target** | Aegis onboarding (€59,990 licence)                                                                                                                                                                                                                                                  |
| **Dependency**        | Chapter 4 implementation (shared capability, not fork)                                                                                                                                                                                                                              |
| **Stop condition**    | No active contract renewal after 3 months; cancelled by buyer; converted to permanent licence                                                                                                                                                                                       |

### AIS-OUTCOME-PILOT — P0 active

| Field                 | Details                                                                                      |
| --------------------- | -------------------------------------------------------------------------------------------- |
| **Group**             | Services, consulting and training                                                            |
| **Exact terms**       | €9,990 fixed, 6 weeks. Refundable if named KPI does not move (captain-hat KPI).              |
| **Readiness**         | 55%                                                                                          |
| **Next gate**         | G0-G6 (Chapter 3) — prove outcome definition, KPI measurement, refund trigger, evidence pack |
| **Evidence**          | `src/agents/`; outcome-pricing SLA with KPI refund clause                                    |
| **Conversion target** | Long-term services contract or DWS IQ platform licence                                       |
| **Dependency**        | Chapter 3 shared entitlement/deployment model                                                |
| **Stop condition**    | KPI not moved → full refund; KPI moved → conversion path triggered                           |

### DWS-EU-PILOT — P0 active

| Field                 | Details                                                                                              |
| --------------------- | ---------------------------------------------------------------------------------------------------- |
| **Group**             | DWS IQ platform                                                                                      |
| **Exact terms**       | €1,499/month + €3,990 setup. EU sovereign cloud: Aiven PostgreSQL + Hetzner/Scaleway                 |
| **Readiness**         | 55%                                                                                                  |
| **Next gate**         | G0-G6 (Chapter 3) — prove sovereign infrastructure, EU-only data residency, Article 12/14 compliance |
| **Evidence**          | Chapter 3 shared tenant/deployment, EU sovereignty policy, SLOs, metering                            |
| **Conversion target** | DWS IQ EU licence or extended subscription                                                           |
| **Dependency**        | Chapter 3 shared entitlement/deployment model                                                        |
| **Stop condition**    | Contract cancellation by buyer; sovereignty breach escalates to Article 14 incident                  |

### DWS-US-PILOT — P1 next

| Field                 | Details                                                                                          |
| --------------------- | ------------------------------------------------------------------------------------------------ |
| **Group**             | DWS IQ platform                                                                                  |
| **Exact terms**       | €799/month + €2,490 setup. US Cloud (Supabase + Cloudflare). Four-week evaluation.               |
| **Readiness**         | 55%                                                                                              |
| **Next gate**         | G0-G6 (Chapter 3) — prove US infrastructure, data residency warning, migration path to sovereign |
| **Evidence**          | Chapter 3 shared tenant/deployment, US Cloud configuration                                       |
| **Conversion target** | DWS IQ US licence or extended subscription                                                       |
| **Dependency**        | Chapter 3 shared entitlement/deployment model; must wait until P0 active slots free              |
| **Stop condition**    | No active contract renewal; explicit buyer conversion or cancellation                            |

### LF-ONTOLOGY-PILOT — P2 last/maturation hold

| Field                 | Details                                                                                    |
| --------------------- | ------------------------------------------------------------------------------------------ |
| **Group**             | Independent data products                                                                  |
| **Exact terms**       | €15,000–€25,000 per site, 3 months. 100% credited to first licence year within 90 days.    |
| **Readiness**         | Not scored                                                                                 |
| **Next gate**         | Prerequisites for scoring — define maturity metrics, scoring framework, on-site validation |
| **Evidence**          | Active ontology maturing; no readiness score assigned until scoring criteria implemented   |
| **Conversion target** | LF-ONTOLOGY-25 licence (€25,000/year per named site)                                       |
| **Dependency**        | Scoring criteria implemented; HIC explicitly promotes from maturation hold                 |
| **Stop condition**    | HIC explicitly promotes to active slot; scoring criteria met and priority queue updated    |

## Later catalogue-pilot work (absent from price-list v1.33)

The following catalogue SKUs are pilot-class offerings not listed in price-list v1.33 but present in `docs/truth/PRODUCT_LIFECYCLE.md` and `docs/truth/PRODUCT_FULFILMENT.md`:

| ID         | Group                             | Status                                |
| ---------- | --------------------------------- | ------------------------------------- |
| `CMP-T0`   | DWS IQ platform                   | Later wave – pilot definition pending |
| `MO-T0`    | DWS IQ platform                   | Later wave – pilot definition pending |
| `SS-T0`    | DWS IQ platform                   | Later wave – pilot definition pending |
| `LAND-OPS` | Services, consulting and training | Later wave – pilot definition pending |

**Guidance:** These SKUs must follow the same readiness-priority protocol once pilot definitions are finalised. HIC to review and assign priority after the first four pilots are closed.

## Cadence and governance

| Cadence                      | Time                                 | Owner         | Action                                                                                                |
| ---------------------------- | ------------------------------------ | ------------- | ----------------------------------------------------------------------------------------------------- |
| **Sunday HIC batch**         | Sunday 09:00–19:00 EET (10-hour day) | HIC           | Review pilot progression, readiness gates, priorities, maturation updates, approve DGX loop execution |
| **Weekday DGX morning gate** | Weekday 1–2 hours daily              | OpenCode-loop | Autonomous implementation runs, readiness checks, branch sync with main, gate progress                |

**OpenCode-loop specification:**

- Branch: `opencode/pilot-readiness-priority`
- Implementation: Autonomous (no per-step sync gate)
- Output: `docs/plans/PILOT_PRODUCT_READINESS_PRIORITY.md` updated on merge to `main`
- Status logging: `docs/field-notes/YYYY-MM-DD-pilot-readiness-*.md`

**Timing alignment:**

- Sunday batches drive all G0-G10 gate reviews
- Weekday mornings process DGX loop execution results and branch syncs
- Four pilot slots consumed sequentially per timing estimates above

## Price-list snapshot pointer (mandatory)

**Source of truth for commercial terms:** `dws10.com/price-list/versions/price-list-v1.33.html` (immutable snapshot, stamped 2026.Q3 · 2026-09-25, valid until 2026-11-15).

**This plan is derived from that snapshot.** Do not use `dws10.com/config/products.json` for pilot commercial terms; the snapshot is the controlled version for this execution cycle. Readiness evidence uses separate source.

## Product Production Readiness Program integration

**Pointer:** `docs/plans/PRODUCT_PRODUCTION_READINESS_PROGRAM.md`

- **Pilot execution** is Chapter 3 (DWS IQ core) and Chapter 4 (Aegis/KYA) implementation
- **G0-G10 gates** apply to all pilots; readiness scores above reflect partial gate progress
- **Shared architecture** — no pilot forks the runtime; tiers are configurations
- **Implementation chapters** — pilot SKUs distributed across Chapters 3–4

---

**Document version:** v1.1 · **Date:** 28.09.2026 · **Owner:** Lifetime Oy
© 2026 Lifetime Oy (Y-tunnus 0772407-9). All rights reserved.
**Business Confidential.** This document contains confidential and proprietary information of Lifetime Oy. It is disclosed solely to the intended recipient under an applicable NDA or business relationship and may not be copied, distributed, or disclosed to any third party without Lifetime Oy's prior written consent.
