---
VERSION AND AGENT HISTORY
Document: Qantic × Lifetime Oy Partnership Business Case
Version: 1.0
Created: 2026-03-19
Author: Claude Opus 4.6 (DWS IQ 6 Agent)
Reviewed by: Risto Päärni (Founder & CEO, Lifetime Oy)
Status: DRAFT
---

# Qantic × Lifetime Oy — Partnership Business Case

## The Gap

Qantic's Q-System answers: **"How much will this BESS asset earn?"**
DWS IQ 6 answers: **"What will compliance cost?"**

Neither tool delivers the full bankability picture alone. Together they do.

## The Problem for BESS Developers and Investors

EU energy storage projects now face two parallel modelling requirements:

1. **Revenue modelling** — multi-market dispatch optimization (day-ahead, intraday, FCR, aFRR, mFRR), degradation-aware cycling, curtailment, hybrid PV+BESS configurations. Qantic's Q-System solves this.

2. **Compliance cost modelling** — CSRD lifecycle disclosure (ESRS E1-6, Scope 1/2/3), ETS allowance obligations for co-located generation assets, EU Taxonomy alignment for green investment classification. DWS IQ 6 solves this.

Today these are modelled in separate silos. Revenue projections ignore compliance costs. Compliance reports lack operational dispatch data. The result: incomplete investment cases and audit risk.

## The Integration

Q-System dispatch outputs become DWS IQ 6 compliance inputs:

| Q-System produces | DWS IQ 6 consumes | Compliance output |
|---|---|---|
| Dispatch schedule (market × hour) | Grid emission factors per time slot | Scope 2 intensity per MWh delivered |
| Cycle count + capacity fade curve | Asset lifecycle parameters | CSRD asset impairment + replacement capex disclosure |
| Curtailment hours + grid restriction profile | Avoided emissions calculation | EU Taxonomy substantial contribution evidence |
| Revenue stack (FCR/aFRR/DA/ID split) | ETS-covered market participation hours | ETS allowance cost for co-located generation assets |
| Roundtrip efficiency losses (9.75% per white paper) | Energy loss → grid consumption delta | Scope 2 carbon cost of storage losses |

**Format:** Q-System exports JSON dispatch schedules. DWS IQ 6 agents ingest structured JSON natively (MCP protocol, JSON-RPC 2.0).

## Revenue Model

**Option A — Referral Partnership**
Qantic refers BESS customers who need compliance reporting → Lifetime Oy closes.
Fee: 15% of first-year contract value (€750–€1,500 per referral based on DWS IQ platform pricing).

**Option B — Integrated Product**
Q-System embeds a "Compliance Cost" module powered by DWS IQ 6 API.
BESS developers see compliance cost as a line item alongside revenue projections.
Fee: API usage-based pricing (per asset modelled) or Alpha-Share (7.5% of verified compliance cost savings).

**Option C — Co-Sell at Conferences**
Joint presence at energy finance events (Ecosummit, RE-Source, Energy Storage Europe).
Shared booth or back-to-back presentations: "Revenue + Compliance = Complete Bankability."
Cost: Split event fees; no contractual commitment required.

## Market Size

- 50,000+ EU companies subject to CSRD (mandatory from 2025)
- EU BESS pipeline: 45 GW by 2030 (SolarPower Europe estimate)
- Every utility-scale BESS project requires both revenue modelling and compliance reporting
- Qantic's existing customer base = pre-qualified leads for DWS IQ 6

## Why Now

| Regulatory driver | Deadline | Impact on BESS |
|---|---|---|
| CSRD mandatory reporting | 2025 (large), 2026 (listed SMEs) | Lifecycle carbon disclosure required for storage assets |
| ETS Phase 4 tightening | 4.4% annual reduction factor | Rising allowance costs for co-located generation |
| EU Taxonomy Delegated Acts | Ongoing | BESS must prove "substantial contribution" for green financing |
| EPBD recast | 2027 (public buildings) | Behind-the-meter BESS needs building-level carbon reporting |

**Qantic white paper finding:** Ignoring battery degradation overestimates BESS revenues by up to 41% (Qantic, "Success Factors in Revenue Modelling for Large-Scale Energy Storage," p. 7). This same degradation data drives CSRD asset impairment and replacement capex disclosures — revenue modelling and compliance reporting share the same technical inputs.

## What Exists Today

| Capability | Status |
|---|---|
| DWS IQ 6 ETS calculator | Built — `src/compliance/ets-calculator.ts` |
| DWS IQ 6 CBAM calculator | Built — `src/compliance/cbam-calculator.ts` |
| DWS IQ 6 CSRD/ESRS scoring (82 disclosures) | Built — `src/compliance/esrs-registry.ts` |
| Helios energy industry agent | Built — `src/agents/workflow/industry/helios.agent.ts` |
| Dispatch schedule ingestion from external systems | Scoped — 4–6 weeks to build once Q-System JSON format is confirmed |
| Q-System JSON export API | To be confirmed with Qantic |

**Estimated integration effort:** 4–6 weeks for the dispatch-to-compliance data pipeline. Work begins once we confirm Q-System's JSON export format in the scoping call.

## Next Step

20-minute scoping call to confirm:
1. Does Q-System have a structured data export (JSON/CSV) for dispatch schedules?
2. Which Qantic customers face CSRD reporting obligations today?
3. Interest level: referral, API integration, or co-sell?

**Contacts:**
- Risto Päärni, Founder & CEO, Lifetime Oy (Espoo) — risto@lifetime.fi
- Thomas Kalitzky, Managing Director, Qantic GmbH (Berlin) — support@qantic.com
