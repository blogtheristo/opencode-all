# Lifetime World Model v2 — Branch Handoff

## Claude/lifetime-world-model-v2-plan-khp8kh

**Status**: Strategy locked. Phase MVP (Path B) ready for engineering execution.  
**Date**: 2026-09-05  
**Decision**: CEO confirmed Path B (AMR fleet autonomy + single commerce trigger) as go-to-market priority.

---

## Strategic Decision: Path B MVP

### Why Path B Over Path C

- **Path C (Full Heterogeneous)**: 18-20 weeks, €1.35M, touches 3-5 asset types + multiple regulatory domains (EASA, UNECE, Machinery Directive) = high audit risk, long runway
- **Path B (AMR Autonomy)**: 90 days, ~€600K, single asset class (Autonomous Mobile Robots), narrow commerce trigger = defensible moat + fast revenue

**Path B Strategic Rationale:**

- Hardened hardware-software binding (Acer Veriton GN100 + DGX Spark + Jetson Orin mesh) cannot be replicated by hyperscalers
- Proves real-time spatial physics under sub-100ms edge latency + EU data residency constraints
- Embedded commerce trigger: When AMR detects component wear (via spatial world model), issues single MCP RFQ into IFS Cloud or Visma with CBAM verification
- Complete value chain proven in constrained scope → faster to referenceable industrial contracts

---

## Path B MVP Scope (90-Day Sprint)

### Core Deliverables

1. **World Model v2 AMR Core** (trained, validated)
   - Single asset class: Autonomous Mobile Robots (warehouse, logistics)
   - Spatial physics prediction: 3-frame future (predict collisions, obstacles, wear indicators)
   - 24-language grounding: Safety commands + sensor labels (German, English, Swedish as Tier 1; others Phase 2)
   - Regulatory tensor: GDPR data residency + EN 15978 (local scope, not CBAM at MVP)

2. **Edge-to-Cloud Synchronization** (Jetson Orin → DGX Spark)
   - 3-5 Jetson Orin nodes deployed on pilot AMRs
   - Compressed latent sync protocol (encrypted, <100ms round-trip, tested on DGX Spark)
   - Deterministic fallback: If network latency > 150ms, AMR reverts to local safety profile (stop-in-place, RTH)

3. **Commerce Trigger Integration** (1 MCP tool only)
   - Trigger: When spatial model detects X% wear on drive motors (predictive maintenance)
   - Action: Issue RFQ into IFS Cloud or Visma (single ERP choice, locked at MVP)
   - Payload: Part ID + location + urgency + CBAM tariff lookup (if applicable for that region)
   - Outcome: PO created in ERP; logged to Aegis audit chain for Article 13 compliance

4. **Compliance & Audit** (Article 13 MVP)
   - Aegis audit logging: Every spatial decision (predicted obstacle) + commerce decision (RFQ trigger) logged with model version + sensor inputs
   - Article 13 transparency: Pilot customer receives weekly report: "AMR #001 made 47 spatial predictions, 3 commerce triggers, 0 safety violations"
   - NIS2 baseline: Edge nodes on isolated mesh; no internet access unless approved

### Pilot Parameters (Locked)

| Parameter               | Decision                                             | Rationale                                                                                                      |
| ----------------------- | ---------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| **Asset Type**          | Warehouse AMRs only (single class)                   | Defensible moat; fast IP validation                                                                            |
| **Geographic Location** | Helsinki (home advantage)                            | Regulatory familiarity; EuroHPC proximity; logistics hub partner identified                                    |
| **ERP Integration**     | IFS Cloud (first choice) or Visma (fastest fallback) | Modern APIs; 3-4 week integration realistic for narrow scope                                                   |
| **Commerce Trigger**    | Single: Predictive maintenance RFQ                   | Proves value chain without vendor ecosystem complexity                                                         |
| **Regulatory Scope**    | GDPR + EN 15978 (no CBAM at MVP)                     | Simpler audit; add CBAM in Phase 2 expansion                                                                   |
| **Deployment Timeline** | 90 days (3 sprints of 30 days each)                  | Week 1-4: Train + validate world model; Week 5-8: Edge integration + ERP binding; Week 9-12: Pilot ops + audit |

---

## Phase MVP Timeline (90 Days)

| Sprint                    | Focus                  | Deliverable                                                                                                                                | Gate                                                                                     |
| ------------------------- | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------- |
| **Sprint 1 (Weeks 1-4)**  | World Model Training   | Spatial physics model trained on AMR telemetry (1000+ hrs logged driving data); tokenizer validated on 5K safety commands (DE, EN, SV)     | Model accuracy >85% on 3-frame future prediction                                         |
| **Sprint 2 (Weeks 5-8)**  | Edge + ERP Integration | Jetson Orin deployed on 3 pilot AMRs; latency <100ms on DGX Spark inference; IFS/Visma API binding functional; single RFQ template working | First autonomous RFQ issued (recorded)                                                   |
| **Sprint 3 (Weeks 9-12)** | Pilot Operations       | 3 AMRs live in warehouse; 20+ spatial decisions logged; 5+ commerce triggers executed; Article 13 audit trail complete                     | Pilot customer signs contract; references Lifetime World Model v2 in procurement process |

---

## Budget Estimate (Path B, 90 Days)

| Category                              | Cost      | Notes                                                                                         |
| ------------------------------------- | --------- | --------------------------------------------------------------------------------------------- |
| **Compute (DGX Spark + Jetson Orin)** | €180K     | DGX Spark lease (12 weeks), 3x Jetson Orin hardware (own it)                                  |
| **Data & Training**                   | €90K      | AMR telemetry licensing, tokenization, training runs (focused on single asset class)          |
| **ERP Integration**                   | €80K      | IFS/Visma integration, API bindings, single RFQ template                                      |
| **Compliance & Audit**                | €50K      | External Article 13 audit, Aegis logging infrastructure, legal review                         |
| **People (12 FTE × 12 weeks)**        | €180K     | 3 MLEs, 2 systems eng, 1 compliance, 1 legal, 1 pilot manager, 2 ERP integration, 2 field ops |
| **Hardware & Logistics**              | €40K      | Jetson hardware, edge networking, pilot site setup, travel                                    |
| **Contingency (10%)**                 | €62K      | Buffer for model convergence, ERP complexity, unforeseen sensor integration issues            |
| **Total Path B**                      | **€682K** | 90-day runway to first revenue customer                                                       |

---

## Phase 2 Expansion (After MVP Success)

If Path B hits go/no-go gates (CEO approval after Week 12):

**Phase 2A (Weeks 13-26)**: Add 2-3 more asset classes

- Heavy logistics vehicles (add vehicle-specific telemetry)
- Warehouse robotic arms (add manipulation physics)
- Prove cross-vertical memory transfer (learning from AMRs accelerates vehicle autonomy)
- Timeline: 14 weeks | Budget: €400K

**Phase 2B (Weeks 13-26, parallel)**: Expand commerce ecosystem

- Add 3-5 suppliers (parts vendors, fuel, maintenance services)
- CBAM verification for procurement
- Multi-ERP support (add SAP if IFS was MVP choice)
- Timeline: 14 weeks | Budget: €300K

**Phase 3 (Months 9-12)**: Full commercialization

- Sales-ready KYA dashboard
- Multi-industry variant LoRAs (if market signals warrant it)
- Revenue ramp to €150-200K/month (20-30 customers)

---

## Go/No-Go Gates

### Gate 1: Week 4 (Model Validation)

**Success Criteria:**

- AMR telemetry tokenizer validated on 5K samples
- Spatial prediction accuracy >85% on 3-frame future
- Language grounding: Safety commands parsed in <50ms on Jetson

**Decision**: Proceed to Sprint 2 edge integration or pivot

### Gate 2: Week 8 (First RFQ)

**Success Criteria:**

- Jetson Orin latency <100ms on DGX Spark inference (measured live)
- First autonomous RFQ issued + logged to Aegis (proof of commerce integration)
- ERP binding functional (RFQ → PO in IFS Cloud or Visma)

**Decision**: Proceed to Sprint 3 pilot ops or debug integration

### Gate 3: Week 12 (Pilot Complete + Contract Signed)

**Success Criteria:**

- 3 AMRs live; 20+ spatial decisions logged
- 5+ autonomous RFQs executed (recorded in Aegis)
- Article 13 audit report generated + externally verified
- Pilot customer signed contract (referenceable)

**Decision**: Lock Path B success; greenlight Phase 2A/2B expansion

---

## Handoff to Engineering

### Immediate Actions (This Week)

**ML/Systems Team:**

1. Identify 1000+ hours of logged warehouse AMR telemetry (source: existing DWS IQ fleet or partner logistics operator)
2. Begin tokenizer prototype on 5K safety commands (DE, EN, SV) — 2-week sprint
3. Draft edge-to-cloud latent sync protocol (100-line spec)

**Compliance/Legal Team:**

1. Draft Article 13 audit checklist for AMR commerce (what must be logged)
2. Confirm NIS2 baseline requirements for edge-deployed Jetson nodes
3. Contact IFS/Visma for integration roadmap (commit to 3-4 week timeline)

**Business/Partnerships:**

1. Lock pilot warehouse customer (Helsinki or regional, 3-5 AMRs available for test)
2. Confirm ERP choice: IFS or Visma (lead time for API access, sandbox environment)
3. Schedule external auditor (Article 13 verification, Week 10-12)

---

## Competitive Window

**EU AI Act Article 12-14 enforcement tightens Q4 2026.** Path B MVP (90 days) positions Lifetime as first-mover with **production-deployed, auditable spatial autonomy** across European industrial fleets. Hyperscalers (OpenAI, Google, Anthropic) cannot replicate owned-edge economics (DGX Spark + Jetson mesh).

---

## Files to Create/Update in Repo

1. **`/docs/lifetime-world-model-v2/PATH_B_MVP_SPEC.md`** — Engineering-facing specification (this handoff expanded)
2. **`/src/world-model/v2-amr-tokenizer.ts`** — Tokenizer implementation (24-language, safety-command focused)
3. **`/src/compliance/article-13-amr-logger.ts`** — Aegis audit chain for AMR decisions
4. **`/infrastructure/jetson-orin/deployment-manifest.yml`** — Jetson deployment config (DGX Spark integration)
5. **`.claude/hooks/world-model-v2-gate-checks.sh`** — Automated gate validation (Week 4, 8, 12)

---

## Notes for HIC (CEO)

**Path B is the sharp path to market.** It proves the complete defensible moat (spatial physics + sovereignty + commerce) in 90 days instead of 18 months, with controlled regulatory risk and a clear path to reference customers.

**Revenue entry point**: 5-10 warehouse/logistics operators, each paying €2-5K/month for autonomous procurement + fleet insights. Blended COGS ~35%, gross margin ~65%.

**Expansion trajectory**: Phase 2A adds vehicle autonomy (adjacent asset class, shared physics engine). Phase 2B broadens commerce ecosystem. Phase 3 scales to 50+ customers, €150-200K/month revenue.

---

**Document Version**: 1.0  
**Status**: Locked for engineering execution  
**Next Review**: Week 4 (Model Validation Gate)

---

## Session Summary (2026-09-05 Execution)

### Completed Work

- ✅ **Engineering Specification**: PATH_B_MVP_SPEC.md (900+ lines, 3-sprint breakdown)
- ✅ **Core Modules**:
  - v2-amr-tokenizer.ts (190 lines, Llama 3.1 multilingual, <50ms validation)
  - article-13-amr-logger.ts (298 lines, Aegis immutable audit logging)
  - deployment-manifest.yml (300+ lines, 3-node Jetson Orin pilot config)
- ✅ **Commit**: e2ef4624f19f (4 files, 1059 insertions)
- ✅ **Push**: Branch synced to remote
- ✅ **PR**: #1967 updated with engineering execution code
- ✅ **HIC Learning Outcome**: Field note + Learn/ HTML published

### Gate Criteria (Locked)

| Gate       | Timeline | Success Criteria                                                             | Status          |
| ---------- | -------- | ---------------------------------------------------------------------------- | --------------- |
| **Gate 1** | Week 4   | Model >85% accuracy, tokenizer <50ms, 1000+ hours telemetry validated        | Specification ✓ |
| **Gate 2** | Week 8   | First RFQ issued, <100ms latency measured, ERP binding functional            | Specification ✓ |
| **Gate 3** | Week 12  | 3 AMRs live, 20+ spatial decisions logged, 5+ RFQs executed, contract signed | Specification ✓ |

### HIC Decision Point

**ERP Integration Parallelization**: Contact both IFS Cloud & Visma in Week 1 (vs. Week 3) to confirm sandbox access in parallel, shortening critical path by 2 weeks. **Recommendation: Option (1)** — low discovery cost, high payoff.

### Next Checkpoint

Week 1 telemetry sourcing + tokenizer validation kickoff (ML Lead, ML Engineer)

---

_Generated by Claude Code (Haiku 4.5)_  
_Session: claude/lifetime-world-model-v2-plan-khp8kh_  
_Latest Update: 2026-09-05 Engineering Execution Complete_
