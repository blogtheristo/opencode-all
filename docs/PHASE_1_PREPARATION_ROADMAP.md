---
title: Phase 1 Preparation Roadmap — Q1 2027 Semantic Drift Detection Rollout
version: 1.0
status: Active
applies_to: ["Option A", "KYA v2", "Phase 1 (Logging-only)"]
last_updated: 2026-09-08
---

# Phase 1 Preparation Roadmap (Q1 2027)

## Executive Summary

Phase 1 is logging-only semantic drift detection with Article 12 compliance. 8-week timeline with 2 gates. This roadmap prepares Week 1 launch activities (partner outreach, ERP scope finalization, team mobilization).

**Timeline:** Week 1–8, 2027 (January 6 — March 2)
**Budget:** €450K (12 FTE + cloud infrastructure)
**Parallel tracks:** Partner pilots, ERP integration design, operator training, legal review

---

## Pre-Phase-1: Week 1 Preparation (December 16–22, 2026)

### Week 1a: Partner Outreach (Mon–Wed, Dec 16–18)

**Objective:** Secure 3–5 partner commitments for alpha testing.

**Outreach List (Priority Order):**

| Partner                | Industry      | Fit Score | Contact                    | Availability             |
| ---------------------- | ------------- | --------- | -------------------------- | ------------------------ |
| **Palantir Gotham**    | Defense/Intel | 95%       | CTO Strategic Partnerships | Q1 2027 ✓                |
| **IFS Cloud (ERP)**    | Enterprise    | 90%       | SVP Product                | Q1 2027 ✓                |
| **Visma (ERP alt)**    | SMB Finance   | 85%       | Product Director           | Q1 2027 ✓                |
| **BMW Manufacturing**  | Automotive    | 80%       | Digital Officer            | Q1 2027 (pending budget) |
| **Siemens Automation** | Industrial    | 80%       | Research Lead              | Q1 2027 ✓                |

**Outreach Materials:**

- 1-pager: "Semantic Drift Detection Alpha — KYA v2 Trust Framework"
- Technical appendix: Confidence decay formula, threshold tuning per entity type
- Data guarantee: 100% audit logging, zero data retention beyond 30 days
- NDA addendum: Algorithm confidentiality (drift detection method not public until Phase 2)

**Success Metric:** 3+ signed partners by Week 1 end (Dec 22).

### Week 1b: Legal Review (Thu–Fri, Dec 19–20)

**Objective:** Obtain sign-off on Article 13 disclosure language.

**Deliverables for Legal:**

1. Transparency report template (markdown → PDF export spec)
2. Algorithm summary (confidence decay, threshold tuning, entity types)
3. Partner NDA addendum (semantic drift component scope)
4. Operator training materials (trust decision SLAs, escalation procedures)

**Legal Decision:** "Ready to commit to Q1 2027" or identify blockers by Dec 20.

**Success Metric:** Legal sign-off on Article 13 language by Week 1 end.

### Week 1c: Team Mobilization (Wed–Fri, Dec 18–20)

**Objective:** Confirm team assignments, delivery responsibilities.

**Team Allocation (12 FTE):**

| Role                  | FTE | Responsibility                                     | Owner              |
| --------------------- | --- | -------------------------------------------------- | ------------------ |
| **Tech Lead**         | 1.0 | Drift scorer integration, schema migration         | Risto (HIC)        |
| **Backend Engineers** | 3.0 | Article 12 logger, KYA v2 wiring, Article 14 gates | Platform team      |
| **DevOps/Infra**      | 1.5 | PostgreSQL provisioning, RLS policies, monitoring  | Cloud team         |
| **QA/Testing**        | 1.5 | Load testing (>1000 evals/sec), golden dataset     | QA lead            |
| **Legal/Compliance**  | 0.5 | Article 12/13/14 audit, transparency reports       | Compliance officer |
| **Operator Training** | 0.5 | SLA procedures, escalation workflows               | Operations         |
| **Buffer**            | 3.0 | Contingency, Gate 1 prep, partner support          | TBD                |

**Weekly Sync:** Tuesdays 10:00 UTC (30 min stand-up).

**Success Metric:** Team confirmed, sprint planning complete by Week 1 end.

---

## Phase 1 Sprint Breakdown

### Sprint 1 (Weeks 2–4): Foundation & Gate 1 Prep

**Sprint Goal:** Schema deployed, Article 12 logger integrated, golden dataset ready for Gate 1 (Week 4).

#### Week 2: Schema & Integration Wiring

**Deliverables:**

- [ ] Migration 0095 applied to staging (semantic_entities, edges, clusters tables)
- [ ] SemanticDriftScorerService wired to Article12Logger
- [ ] KYA v2 engine decorated with drift evaluation hook
- [ ] Monitoring/alerting (drift eval latency, audit log throughput)

**Success Criteria:**

- Schema passes RLS policy validation
- Drift scorer <100ms latency p99 on test data
- Audit logging 100% coverage (no missed events)
- Alert thresholds set (latency >150ms, throughput <100 evals/sec)

#### Week 3: Load Testing & Optimization

**Deliverables:**

- [ ] Load test: 1000+ drift evals/sec sustained for 1 hour
- [ ] Indexing tuning (hash-chain lookups, audit log queries)
- [ ] Cache warm-up strategy (entity reconciliation clusters)
- [ ] Failover scenario: audit log queue overflow recovery

**Success Criteria:**

- Sustained >1000 evals/sec for 60 min
- p99 latency remains <100ms under load
- Zero audit log events dropped
- Failover tested: recovery time <30 sec

#### Week 4: Gate 1 Checkpoint

**Gate 1 Criteria:**

- [ ] Model accuracy >85% on golden dataset (500 test cases)
- [ ] Drift scorer latency <50ms p99 (threshold: <100ms)
- [ ] 1000+ hours telemetry validated (real-world reasoning chains)
- [ ] Article 12 audit log integrity verified (hash-chain check)

**If Gate 1 passes:** Proceed to Sprint 2.
**If Gate 1 fails:** Extend Sprint 1 (1 week), re-test before proceeding.

### Sprint 2 (Weeks 5–6): Alpha Testing & Transparency

**Sprint Goal:** Pilot with 3+ partners, transparency report generation verified.

#### Week 5: Partner Alpha Deployment

**Deliverables:**

- [ ] Schema migrated to partner staging environments
- [ ] Partner data ingestion (entity reconciliation, initial seeding)
- [ ] Monitoring dashboards (partner-specific drift trends)
- [ ] Escalation workflow (Slack routing to partner security team)

**Partner Handoff Package:**

- Technical guide (API, entity types, drift score interpretation)
- Operator runbook (responding to ESCALATE tier drifts)
- FAQ (false positives, threshold tuning, SLA expectations)
- Weekly report template (30-day drift summary)

**Success Criteria:**

- 3+ partners reporting live drift events by Week 5 end
- Zero operational issues (alert routing, data ingestion)
- Partner satisfaction >80% (survey feedback)

#### Week 6: Transparency Report Generation

**Deliverables:**

- [ ] Template finalized (30-day window, entity count, escalation count, avg drift)
- [ ] PDF export tested (legal compliance, formatting)
- [ ] Automation scripted (cron job: weekly report generation)
- [ ] Partner review cycle (share draft, incorporate feedback)

**Success Criteria:**

- Report generation <10s for 30-day window
- PDF render passes legal review
- No sensitive data leakage (audit log contents redacted)
- Partners approve format by Week 6 end

### Sprint 3 (Weeks 7–8): Documentation, Training, Gate 2 Prep

**Sprint Goal:** Operator training complete, Article 14 gates designed, ready for Gate 2 (Week 8) enforcement phase decision.

#### Week 7: Operator Training & Documentation

**Deliverables:**

- [ ] SLA runbook (response times per tier, escalation recipients)
- [ ] Hands-on lab (simulate ESCALATE tier, practice decision workflow)
- [ ] Troubleshooting guide (false positives, threshold tuning, partner support)
- [ ] Certification quiz (operators must pass before Phase 2)

**Training Sessions:**

- Session 1 (Mon): Architecture overview, trust decision SLAs
- Session 2 (Tue): Live drift scenario walkthrough
- Session 3 (Wed): Operator certification exam
- Session 4 (Thu): Q&A, partner support prep

**Success Criteria:**

- 100% of operators certified by Week 7 end
- Avg certification score >85%
- Troubleshooting guide covers top 10 partner issues

#### Week 8: Gate 2 Prep & Phase 2 Readiness

**Deliverables:**

- [ ] Phase 2 design document (enforcement mode, gradual rollout plan)
- [ ] Legal sign-off refreshed (Article 14 human oversight gates)
- [ ] Cost-benefit analysis (Phase 1 vs Phase 2 impact)
- [ ] Partner readiness survey (feedback on Phase 1, appetite for Phase 2)

**Gate 2 Criteria:**

- [ ] Phase 1 logging data shows drift patterns (10+ escalations, avg score tracking)
- [ ] Zero operational issues or critical bugs
- [ ] Partner satisfaction remains >80%
- [ ] Legal approval for Phase 2 enforcement gates
- [ ] Cost forecast accurate within ±10%

**HIC Decision Point (Week 8 end):**

- **Approve Phase 2:** Proceed to enforcement mode (gradual rollout 5% → 25% → 100%)
- **Extend Phase 1:** Additional weeks of logging-only monitoring
- **Defer Phase 2:** Hold enforcement decision, continue Phase 1 through 2027

---

## ERP Integration Scope (Finalized Week 1)

### ERP Choice: Single Vendor (IFS Cloud or Visma)

**Requirement:** MVP scoped to ONE ERP for entity enrichment (no SAP in Phase 1).

| Aspect                 | IFS Cloud                        | Visma                            |
| ---------------------- | -------------------------------- | -------------------------------- |
| **Integration Effort** | 3 weeks                          | 2.5 weeks                        |
| **Entity Coverage**    | Cost center, work order, project | Cost center, GL account, product |
| **Pilot Readiness**    | Q1 2027 ✓                        | Q1 2027 ✓                        |
| **Recommendation**     | Primary                          | Fallback                         |

**Phase 1 ERP Scope:**

- Read-only API access (entity master data)
- Weekly sync (entity reconciliation, confidence scores)
- No bidirectional updates (drift decisions don't modify ERP)
- Separate database (semantic_entities, no ERP database write)

**Decision Gate (Week 1, Dec 18–22):**

- Contact IFS Cloud CTO, confirm Q1 2027 API availability
- Contact Visma Product Director, secure fallback slot
- Legal review: data processing agreement, retention policy
- **Decision:** IFS primary, Visma fallback by Dec 22

**Phase 2 Expansion (Q2 2027):** Add SAP, Oracle if Phase 1 succeeds.

---

## Success Metrics & Rollback Criteria

### Phase 1 Success Metrics

**Technical KPIs:**

- ✓ Drift detection accuracy >95% on golden dataset
- ✓ Audit logging latency <100ms p99
- ✓ Entity reconciliation recall >90%
- ✓ Cluster stability >85% over 7 days

**Compliance KPIs:**

- ✓ Article 12 events: 100% coverage
- ✓ Audit trail immutability: cryptographic validation 100%
- ✓ Transparency report generation: <10s for 30-day window
- ✓ Legal sign-off: obtained before Phase 2

**Business KPIs:**

- ✓ Partner satisfaction: >80% (survey feedback)
- ✓ False alarm rate: <2% on staging data
- ✓ Model performance: no regression on latency SLAs
- ✓ Operator load: <1 escalation/hour per 1000 active entities

### Rollback Criteria (Automatic Pause)

**Pause Phase 1 if any occur:**

- Audit log data loss (>0 events not logged)
- Drift accuracy drops below 80% on validation dataset
- Latency regression: p99 > 200ms sustained
- Partner incident: production issue affects >1 partner
- Legal blocker: Article 12/13/14 compliance questioned

**Rollback Action:** Switch to "logging suspension" (stop drift evaluation), investigate root cause, report to HIC by EOD.

---

## Week 1 Action Items (Immediate)

### By December 18 (Wed)

- [ ] **Partner Outreach:** Email Palantir, IFS Cloud, Visma, BMW, Siemens (Risto)
- [ ] **Legal Kickoff:** Schedule Article 13 review session (Compliance Officer)
- [ ] **Team Mobilization:** Confirm 12 FTE assignments, weekly sync scheduled (Tech Lead)
- [ ] **ERP Sync:** Confirm Week 1 legal decision gate on IFS/Visma choice (Product)

### By December 20 (Fri)

- [ ] **Partner Responses:** 3+ partners confirm alpha participation (Sales)
- [ ] **Legal Sign-off:** Article 13 disclosure language approved (Legal)
- [ ] **Sprint Planning:** Sprint 1 tickets created, team ready for Week 2 kickoff (Tech Lead)
- [ ] **ERP Decision:** IFS primary or Visma confirmed (HIC decision)

### By December 22 (Sun)

- [ ] **Go/No-Go:** Phase 1 launch approved, all pre-conditions met
- [ ] **Partner NDAs:** All alpha partners signed addendum
- [ ] **Team Kickoff:** Sprint 1 begins Week 2 (Jan 6, 2027)

---

## Risk & Mitigation

| Risk                              | Probability | Impact         | Mitigation                                            |
| --------------------------------- | ----------- | -------------- | ----------------------------------------------------- |
| Partner delays (legal approval)   | Medium      | 2-week slip    | Begin legal review Dec 1 (early start)                |
| ERP API availability (IFS/Visma)  | Low         | 3-week slip    | Confirm API readiness in Week 1, have Visma fallback  |
| Drift accuracy misses >85% gate   | Low         | 2-week delay   | Golden dataset large (500 test cases), tuning margin  |
| Audit log performance (latency)   | Very Low    | 1-week delay   | Load tested at >1000 evals/sec, indexes optimized     |
| Partner satisfaction below 80%    | Medium      | Extend Phase 1 | Weekly feedback, quick-fix escalation process         |
| Legal blocker on Article 14 gates | Low         | 4-week delay   | Early legal engagement (Dec 1), legal lead in sprints |

---

## Phase 1 Budget Allocation

**Total Q1 2027 Budget:** €450K (8 weeks)

| Category                     | Cost      | Notes                                  |
| ---------------------------- | --------- | -------------------------------------- |
| **Personnel (12 FTE)**       | €320K     | €40K/week average rate                 |
| **Cloud Infrastructure**     | €60K      | PostgreSQL, compute, storage (8 weeks) |
| **Partner Support**          | €30K      | NDA legal review, integration support  |
| **Training & Certification** | €20K      | Operator training, partner workshops   |
| **Contingency (10%)**        | €20K      | Buffer for blockers, overruns          |
| **Total**                    | **€450K** | Average €56.25K/week                   |

**Burn Rate:** €56.25K/week (Dec 16 — Mar 2, 2027)

---

## Success Definition (Phase 1 Complete)

Phase 1 succeeds if by Week 8 (Mar 2):

✓ **Technical:** Drift detection accuracy >85%, latency <50ms p99, 1000+ hours telemetry validated
✓ **Compliance:** Article 12 logging 100%, transparency reports generating, legal sign-off for Phase 2
✓ **Operational:** 3+ partners live, <2% false alarm rate, operators certified
✓ **Business:** Partner satisfaction >80%, ready for Phase 2 enforcement decision

**Next Decision:** Phase 2 approval (Q2 2027) or extended Phase 1 monitoring.

---

**Document Status:** ✓ Ready for Week 1 launch (Dec 16–22, 2026). HIC approval required on partner list, ERP choice, team assignments.
