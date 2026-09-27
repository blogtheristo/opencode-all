# Pilot Kickoff Pack — Aegis Pilot and Outcome-Priced Applied-AI Pilot

---

# VERSION AND AGENT HISTORY

Version: 1.0 [Latest]

Sessions & Modifications:

- Version: 1.0 | Tool: Claude Code | Session: claude/brave-hopper-odb58b | Date: 27.09.2026 | Changes: First kickoff pack for the two highest-value public pilots (DWS-AEGIS-PILOT-001, AIS-OUTCOME-PILOT). Order-to-kickoff sequence, Week 0 checklists, buyer roles, delivery plans and acceptance tests, all taken from `dws10.com/config/products.json`. Records two open delivery gaps for HIC decision. | Harness: Claude Code + CLAUDE.md | HIC-approved-drift: none

Document Status:

- Created: 27.09.2026
- Last Modified: 27.09.2026
- Language: English
- Publication Status: INTERNAL — delivery runbook, not for public-site publication
- Status: PENDING_REVIEW

---

## 1. Purpose and sources

This pack is what the delivery owner opens the day a pilot order is confirmed. It turns the catalogue contract into a first-week plan. It does not change any price, term or promise.

| Fact                                             | Canonical source                                                                      |
| ------------------------------------------------ | ------------------------------------------------------------------------------------- |
| Price, scope, phases, acceptance KPI, exclusions | `dws10.com/config/products.json` (entries `DWS-AEGIS-PILOT-001`, `AIS-OUTCOME-PILOT`) |
| Aegis pilot long-form description                | `Store/PRODUCT_AEGIS_PILOT.md`                                                        |
| Payment verification (manual Revolut/PayPal)     | `docs/runbooks/PRODUCT_ORDER_DEPLOYMENT_RUNBOOK.md` § Manual payment verification     |
| Per-chapter fulfilment owner and SLA             | `docs/runbooks/PRODUCT_FULFILMENT_RUNBOOK.md` Chapters 3 and 4                        |
| Buyer roles (R-IDs)                              | `DWS_ROLES_REGISTRY.md`                                                               |

If this pack and `products.json` disagree, `products.json` wins. Fix this pack.

## 2. Order-to-kickoff sequence (both pilots)

| Step                     | When                             | Who                            | Done when                                                                                                                                                                                              |
| ------------------------ | -------------------------------- | ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1. Order intent recorded | At checkout                      | System                         | `/v1/orders/notify` returned an `order_intent_id`. The checkout page never redirects to a payment provider without one.                                                                                |
| 2. Payment verified      | On provider settlement           | Operator on DGX                | The provider ledger shows the exact amount and currency. `scripts/confirm-product-order-payment.mjs` returns `payment_status: paid`, `fulfilment_status: queued`. Never infer payment from a redirect. |
| 3. Acknowledgement       | Within 1 business day of step 2  | Fulfilment owner               | The buyer has a written acknowledgement from `risto.paarni@lifetime.fi` naming the delivery owner and proposing three kickoff slots.                                                                   |
| 4. Kickoff call          | Within 5 business days of step 2 | Delivery owner + buyer sponsor | The Week 0 checklist (§3.2 or §4.2) is agreed and the acceptance test is signed off in writing.                                                                                                        |
| 5. Calendar              | Same day as step 4               | Delivery owner                 | Kickoff, every phase gate, the acceptance run, the final report and (Aegis) the 6-month credit expiry are in Google Calendar.                                                                          |

For a pilot, the order stays `queued` in the database until the gap in §5.2 is closed. Track delivery progress in the customer folder in the meantime.

## 3. DWS IQ Aegis Pilot (DWS-AEGIS-PILOT-001)

### 3.1 Contract at a glance

- **Price:** €19,990 one-time, 3 months, fixed end date.
- **Scope:** one site, one control-room workflow, one deployment-mode recommendation. Runs on the customer's existing hardware or a compact edge appliance. No DGX purchase is needed.
- **Credit:** the full fee is credited against the €59,990 Aegis licence if the customer proceeds within 6 months. The credit is capped at €19,990 and lapses after 6 months.
- **Owner:** Lifetime Oy — Aegis & KYA Team.
- **Excluded:** LWM integration; hardware procurement; multi-site rollout; custom ERP/BIM/SCADA integrations; the DWS-AEGIS-IMPL-001 programme (€45,000, not credited).

### 3.2 Week 0 checklist (Phase 0, weeks 0–2, no charge)

The customer provides:

- [ ] A named workflow owner who can accept the workflow at the Phase 2 gate.
- [ ] The site, and the one control-room workflow to pilot.
- [ ] Hardware inventory for the target host, or agreement to source an edge appliance (customer cost, excluded from the fee).
- [ ] Read-only access route to the source system the workflow uses.
- [ ] Security contact (R15 CISO or R16 Head of InfoSec) to approve the isolation method for the acceptance test.
- [ ] An agreed evaluation window for the severed-uplink test.

Lifetime Oy delivers by the end of Phase 0:

- [ ] Every workflow step classified as **core** (must survive an outage) or **non-core**.
- [ ] Degradation and reconnect-reconciliation spec, drafted.
- [ ] Isolation method for the acceptance test chosen, with its validity note. The isolation must be enforced above the stack, and egress must be proven to fail.
- [ ] The three acceptance outcomes (§3.4) written into the pilot agreement and signed by both sides.

### 3.3 Delivery plan

| Phase                         | Weeks | Exit gate                                                                                                                                                       |
| ----------------------------- | ----- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0 — Scoping and baseline      | 0–2   | Checklist §3.2 complete, acceptance test signed.                                                                                                                |
| 1 — Local substrate           | 3–5   | Execution runtime, model serving, KYA identity, Article 12 log writer and operator kill authority all resolve locally, **proven with the uplink already down**. |
| 2 — Workflow integration      | 6–9   | The workflow runs to completion online and its owner accepts it.                                                                                                |
| 3 — Severed-uplink acceptance | 10–11 | Rehearsal first, fixes applied, then the witnessed run (§3.4).                                                                                                  |
| 4 — Sizing, report, decision  | 12–13 | Production hardware sizing from measured load; deployment mode confirmed; written recommendation, including "do not proceed" where the evidence supports it.    |

### 3.4 Acceptance test (binary)

With the WAN uplink severed for the agreed window, **all three** must hold:

1. The piloted workflow runs to completion without network access.
2. The EU AI Act Article 12 record keeps being written locally, with no gap.
3. An operator can still use kill authority to stop a running agent.

If any one fails, the pilot has delivered a valid negative result about the environment's readiness. It is not a product defect, and the report says so plainly.

### 3.5 Buyer roles to engage

| Role                                         | Why                                                             |
| -------------------------------------------- | --------------------------------------------------------------- |
| R04 CTO / R13 CIO                            | Sponsor; owns the deployment-mode decision.                     |
| R11 Plant Director / R12 Operations Director | Owns the control-room workflow and signs the Phase 2 gate.      |
| R15 CISO / R16 Head of InfoSec               | Approves the isolation method and witnesses the acceptance run. |
| R23 CFO                                      | Signs the licence decision within the 6-month credit window.    |

## 4. Outcome-Priced Applied-AI Pilot (AIS-OUTCOME-PILOT)

### 4.1 Contract at a glance

- **Price:** €9,990 one-time, 6 weeks, fixed price.
- **Promise:** one named KPI; refunded if the KPI does not move.
- **Outcome menu (pick exactly one):** CSRD report cycle time, site-safety incident rate, lead-to-quote latency, or LCA report turnaround.
- **Owner:** Lifetime Oy — DWS IQ Platform Team.
- **Excluded:** custom connectors beyond the documented tier; data migration unless quoted separately; usage beyond documented capacity limits.

### 4.2 Week 0 checklist (before the 6-week clock starts)

- [ ] One outcome chosen from the menu, with its business owner named.
- [ ] **KPI definition written down:** metric, unit, data source, and who measures it.
- [ ] **Baseline measured** from the customer's own data for a period both sides agree on.
- [ ] **"Moved" defined in writing:** the direction, the minimum change that counts, and the measurement window. Both sides sign it before Week 1. See gap §5.1: the catalogue doesn't define this yet.
- [ ] Data access granted (read-only by default) and the processing basis confirmed under GDPR.
- [ ] Refund route agreed: the refund goes to the original payment method, and the operator logs it against the `order_intent_id`.

### 4.3 Delivery plan (proposed; adjust per outcome at kickoff)

| Week | Work                                                         | Exit                                                               |
| ---- | ------------------------------------------------------------ | ------------------------------------------------------------------ |
| 0    | Checklist §4.2                                               | KPI, baseline and "moved" threshold signed.                        |
| 1    | Data connection, agent configuration for the chosen outcome  | Agent runs on real data in a sandbox.                              |
| 2–3  | Agent in the live workflow with human review of every output | The business owner uses it on real work.                           |
| 4–5  | Tuning; KPI measured weekly against the baseline             | Weekly KPI note sent to the buyer.                                 |
| 6    | Final measurement, report, go/no-go on continuation          | KPI result against the signed threshold; refund decision recorded. |

### 4.4 Buyer roles to engage (by outcome)

| Outcome                   | Primary owner                                          |
| ------------------------- | ------------------------------------------------------ |
| CSRD report cycle time    | R08 Head of Sustainability (sponsor R07 CSO)           |
| Site-safety incident rate | R11 Plant Director / R12 Operations Director           |
| Lead-to-quote latency     | R17 Head of Sales Engineering / R18 Head of Commercial |
| LCA report turnaround     | R10 Head of Customer Engineering / R08                 |

## 5. Open delivery gaps — HIC decision needed

### 5.1 AIS-OUTCOME-PILOT: the catalogue acceptance test contradicts the product promise

`products.json` promises "refunded if the named KPI does not move". Its `acceptanceKpi` block, however, is the generic Chapter 3 tenant-provisioning template ("Buyer can log in to a provisioned DWS IQ tenant…"). That template never measures the KPI and never mentions the refund. As a result, the published detail page and the fulfilment runbook show a test that doesn't match what the buyer paid for.

Proposed fix: replace this SKU's `acceptanceKpi` with the rule "KPI, baseline and minimum change are agreed and signed in Week 0; a refund is due if the Week 6 measurement misses the signed threshold". Then regenerate the product page and runbook, and sync the `landing-pages/` mirror. This changes public contract text, so it waits for HIC approval.

### 5.2 No recorded path from `queued` to `fulfilled`

Migration 099 allows `fulfilment_status` values `in_progress`, `fulfilled`, `failed` and `cancelled`. However, no service function, route or operator script moves an order out of `queued`. The event-type constraint also has no fulfilment-progress events. A delivered pilot therefore can't be recorded as delivered in the order ledger.

Proposed fix: an admin-key route plus a DGX operator script, mirroring `confirm-product-order-payment.mjs`. It needs a new migration to widen the event-type constraint, and applying that migration is a RED-zone step. This isn't needed until the first pilot completes (at least 6 weeks after the first order).
