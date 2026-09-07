---
title: Graph Layer Option A — Semantic Drift Detection & Entity Reconciliation
description: Production delivery of universal entity model with semantic drift detection for KYA v2
status: Active
applies_to: ["Platform", "KYA v2", "EU AI Act compliance"]
version: 1.0
last_updated: 2026-09-07
---

# Graph Layer Option A: Delivery & Integration

## Strategic Decision

**Option A** (selected): Expand graph layer to universal entity model with semantic drift detection.

**Why:** Quantifies hallucination risk, detects semantic boundary crossings, enables compliance (Articles 12–14), leverages existing DWS IQ 6 infrastructure.

## Architecture Components

### 1. Semantic Drift Detection (`SemanticDriftScorerService`)

**Location:** `src/agents/semantic-drift-scorer.service.ts`

**Capabilities:**

- Confidence propagation through reasoning chains
- Drift score computation (similarity decay per step)
- Cluster boundary crossing detection
- Trust decision mapping (4-tier SLA)
- Article 12 audit logging integration
- Human oversight recommendation gates

**Algorithm:**

- Community detection (Louvain) on entity graphs
- Edge-weight interpretation as semantic similarity
- Exponential decay function: `confidence(n) = initial × e^(-λn)`
- Boundary crossing: when similarity < threshold

**Deployment:** Logging-only in Phase 1 (Q1 2027), enforcement in Phase 2 (Q2 2027).

### 2. KYA v2 Trust Framework Integration

**Trust Tiers (4-level SLA):**

| Drift Score | Action                      | SLA      | Article |
| ----------- | --------------------------- | -------- | ------- |
| < 0.10      | HALT — revoke access        | < 5min   | Art. 14 |
| 0.10–0.30   | ESCALATE — human review     | < 1hr    | Art. 14 |
| 0.30–0.70   | LOG — continue, monitor     | < 24hr   | Art. 12 |
| > 0.70      | PROCEED — normal operations | No limit | —       |

**Regulatory Mapping:**

- **Article 12 (Automatic logging):** All drift events logged to `article12-logger.ts`
- **Article 13 (Transparency):** Semantic drift component disclosed in transparency reports
- **Article 14 (Human oversight):** Drift scores trigger human review at escalation thresholds

### 3. Ontology Integration

**Entity Model:**

- Universal entity type: `{id, label, type, properties, confidence}`
- Semantic edges: `{source, target, relation, weight, direction}`
- Cluster membership: `{entity_id, cluster_id, center_distance}`

**Connection to DWS Ontology:**

- Maps to existing DWS truth standard (§8 "Entity Reconciliation")
- Leverages DWS roles registry for role-based access control
- Extends DWS knowledge graph with dynamic confidence scoring

**Database Schema:**

```sql
CREATE TABLE semantic_entities (
  id UUID PRIMARY KEY,
  label TEXT NOT NULL,
  entity_type VARCHAR(50),
  properties JSONB,
  confidence NUMERIC(4,3) DEFAULT 0.0,
  cluster_id UUID REFERENCES semantic_clusters(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE semantic_edges (
  id UUID PRIMARY KEY,
  source_id UUID NOT NULL REFERENCES semantic_entities(id),
  target_id UUID NOT NULL REFERENCES semantic_entities(id),
  relation VARCHAR(100),
  weight NUMERIC(4,3),
  direction VARCHAR(20),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE semantic_clusters (
  id UUID PRIMARY KEY,
  label TEXT,
  center_count INT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE drift_audit_log (
  id UUID PRIMARY KEY,
  entity_id UUID REFERENCES semantic_entities(id),
  drift_score NUMERIC(5,4),
  action VARCHAR(50),
  human_decision VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW(),
  audit_reference UUID
);
```

### 4. Article 12 Compliance Logging

**Automatic Logging Trigger:**
Every drift evaluation ≥ 0.30 (yellow flag) is logged to `article12-logger.ts`:

```typescript
await articleLogger.logDriftEvaluation({
  entityId: entity.id,
  driftScore: score,
  action: tier.action,
  confidence: chain.confidence,
  checkpoints: chain.checkpoints,
  timestamp: new Date(),
});
```

**Logged Data:**

- Entity ID & semantic type
- Drift score & calculation chain
- Confidence per reasoning step
- Decision trigger (threshold crossed)
- Audit trace (who, when, why)

## Implementation Timeline

### Phase 1: Logging & Monitoring (Q1 2027, 8 weeks)

- Week 1–2: Entity reconciliation design, ontology clustering
- Week 3–4: Semantic drift module rollout (logging only)
- Week 5–6: Article 12 audit integration, transparency reporting
- Week 7–8: KYA v2 alpha testing with pilot partners

**Gate 1 (Week 4):** Drift detection accuracy >95% on golden dataset, audit logging <100ms latency

### Phase 2: Enforcement & Trust Decisions (Q2 2027, 8 weeks)

- Week 9–10: Trust decision SLA implementation (4-tier mapping)
- Week 11–12: Human oversight workflow, escalation routing
- Week 13–14: Production readiness (Article 14 gates, consent capture)
- Week 15–16: Gradual rollout (5% → 25% → 100% traffic)

**Gate 2 (Week 12):** Zero false revocations on golden dataset, <1min SLA compliance

## Production Configuration

### Environment Variables

```bash
# Graph layer
GRAPH_ENABLED=true
GRAPH_PHASE=logging  # Phase 1 only; set to 'enforcement' in Q2
DRIFT_THRESHOLD_HALT=0.10
DRIFT_THRESHOLD_ESCALATE=0.30
DRIFT_CONFIDENCE_DECAY_LAMBDA=0.3

# Article 12 logging
ARTICLE12_ENABLED=true
ARTICLE12_BATCH_SIZE=100
ARTICLE12_FLUSH_INTERVAL_MS=5000

# KYA v2 integration
KYA_V2_TRUST_FRAMEWORK=true
KYA_V2_HUMAN_ESCALATION_TOPIC=kya-escalations-q1-2027
```

### Service Dependencies

- `SemanticDriftScorerService` — core drift detection
- `Article12Logger` — compliance logging
- `PostgreSQL 14+` — semantic graph storage
- `Supabase` — RLS-protected access control
- `Kafka/Pub-Sub` — human escalation events

### Deployment Checklist

- [ ] Schema migration (drift_audit_log, semantic_entities tables)
- [ ] Article 12 logger integration testing
- [ ] Load testing (>1000 drift evaluations/sec)
- [ ] Transparency report template (markdown + PDF)
- [ ] KYA v2 escalation workflow (Slack/email routing)
- [ ] Legal review (Article 13 disclosure language)
- [ ] Partner NDA updates (semantic drift algorithm)
- [ ] Operator training (trust decision SLAs)

## Success Metrics

### Technical (Phase 1)

- Drift detection accuracy: >95% on golden dataset
- Audit logging latency: <100ms p99
- Entity reconciliation recall: >90% on test ontology
- Cluster stability: >85% consistency over 7 days

### Compliance (Phase 1)

- Article 12 events logged: 100% coverage
- Audit trail immutability: cryptographic validation passes
- Transparency report generation: <10s for 30-day window
- Legal sign-off: obtained before Phase 2

### Business (Phase 1)

- Partner feedback: >80% confidence in drift scoring
- False alarm rate: <2% on staging data
- Model performance: no regression on latency SLAs
- Operator load: escalations <1/hour per 1000 active entities

## References

- **Field Note:** `docs/field-notes/2026-09-06-graphs-evidence-dws6-architecture.md` (Option A rationale)
- **Case Study:** `docs/2026-09-06-semantic-drift-case-study.md` (theory + real-world example)
- **Prototype:** `src/agents/semantic-drift-scorer.service.ts` (implementation ready for alpha)
- **EU AI Act:** Articles 12–14 (automatic logging, transparency, human oversight)
- **DWS Standards:** `DWS_TRUTH_STANDARD.md` (entity reconciliation), `DWS_ROLES_REGISTRY.md` (access control)

---

**Delivery Status:** ✓ Option A selected and locked for Q1 2027 rollout. KYA v2 alpha testing commences Week 1, 2027.

**Next Decision Point (HIC):** Week 1, 2027 — confirm partner pilot list and ERP integration scope for parallel entity enrichment.
