---
title: Graph Layer Ontology Integration — Option A Deployment
version: 1.0
status: Active
applies_to: ["DWS6", "KYA v2", "Semantic Drift Detection"]
last_updated: 2026-09-07
source_control_url: "https://github.com/blogtheristo/dws6/blob/main/docs/GRAPH_LAYER_ONTOLOGY_INTEGRATION.md"
---

# Graph Layer Ontology Integration

## Overview

Option A (semantic drift detection) integrates with existing DWS ontology through a 4-layer architecture:

```
┌─────────────────────────────────────────────┐
│  Application Layer (KYA v2 Trust Decisions) │
├─────────────────────────────────────────────┤
│  Semantic Drift Scorer (confidence → action)│
├─────────────────────────────────────────────┤
│  Graph Layer (entities, edges, clusters)    │
├─────────────────────────────────────────────┤
│  DWS Ontology (truth standard, roles)       │
└─────────────────────────────────────────────┘
```

## Layer 1: DWS Ontology Foundation

### Truth Standard (§8 Entity Reconciliation)

**DWS_TRUTH_STANDARD.md** defines canonical entity types:

| Entity Type | Definition              | Reconciliation Key         |
| ----------- | ----------------------- | -------------------------- |
| `Agent`     | AI model + workflow     | agent_sku + version        |
| `Role`      | Function/responsibility | role_id + org_context      |
| `Skill`     | Capability + surface    | skill_path + variant       |
| `Org`       | Legal entity            | business_id + jurisdiction |
| `Partner`   | External integration    | partner_code + contract_id |

**Graph Layer Binding:**

- Entity ID = truth standard key (UUID v5 hash of canonical path)
- Properties = truth standard attributes (version-controlled)
- Cluster = reconciliation group (e.g., all instances of "Agent deployment")

### Roles Registry (Access Control)

**DWS_ROLES_REGISTRY.md** gates drift decision authority:

| Role       | Trust Threshold             | Escalation Recipient |
| ---------- | --------------------------- | -------------------- |
| `admin`    | N/A (all decisions allowed) | —                    |
| `operator` | 0.30 (yellow flag)          | Security team        |
| `analyst`  | 0.10 (red flag)             | HIC + Legal          |
| `audit`    | Read-only all scores        | Compliance officer   |

**Graph Layer Binding:**

- `article12_logger.ts` checks role before logging drift events
- Drift escalation routed via `DWS_ROLES_REGISTRY.escalation_recipient`
- Human decision recorded with approver role ID (immutable audit trail)

## Layer 2: Graph Storage & Querying

### Entity Reconciliation Graph

**PostgreSQL Schema:**

```sql
-- Truth standard entities (immutable reference)
CREATE TABLE semantic_entities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  truth_standard_key TEXT NOT NULL UNIQUE,  -- e.g. "Agent:claude-opus-5:v1"
  entity_type VARCHAR(50) NOT NULL,         -- from DWS truth standard
  label TEXT NOT NULL,
  properties JSONB NOT NULL,                -- version-controlled attributes
  confidence NUMERIC(4,3) DEFAULT 1.0,
  cluster_id UUID,
  source_ontology VARCHAR(100),             -- "dws-truth-v1.0", "kya-v2-alpha"
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT valid_type CHECK (entity_type IN (
    'Agent', 'Role', 'Skill', 'Org', 'Partner', 'Document', 'Policy'
  ))
);

-- Semantic relationships (edges)
CREATE TABLE semantic_edges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id UUID NOT NULL REFERENCES semantic_entities(id),
  target_id UUID NOT NULL REFERENCES semantic_entities(id),
  relation VARCHAR(100) NOT NULL,          -- 'implements', 'belongs_to', 'authorizes'
  weight NUMERIC(4,3) NOT NULL,             -- 0.0–1.0 semantic similarity
  direction VARCHAR(20) DEFAULT 'directed',
  evidence TEXT,                            -- citation from truth standard
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(source_id, target_id, relation)
);

-- Entity clusters (reconciliation groups)
CREATE TABLE semantic_clusters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label TEXT NOT NULL UNIQUE,                -- "Agent deployments (2026-Q3)"
  cluster_algorithm VARCHAR(50),             -- "louvain-v1"
  entity_count INT,
  avg_edge_weight NUMERIC(4,3),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Article 12 audit trail (immutable)
CREATE TABLE drift_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_id UUID NOT NULL REFERENCES semantic_entities(id),
  drift_score NUMERIC(5,4) NOT NULL,        -- 0.0000–1.0000
  action VARCHAR(50) NOT NULL,              -- 'PROCEED', 'LOG', 'ESCALATE', 'HALT'
  confidence_chain TEXT NOT NULL,           -- JSON array of scores per step
  reasoning_checkpoints TEXT,               -- raw reasoning path
  approver_role_id VARCHAR(50),             -- from DWS_ROLES_REGISTRY
  approver_decision VARCHAR(50),            -- 'approved', 'deferred', 'rejected'
  created_at TIMESTAMP DEFAULT NOW(),
  is_immutable BOOLEAN DEFAULT TRUE,
  hash_chain_previous UUID,                 -- cryptographic integrity
  CONSTRAINT immutable_audit CHECK (is_immutable = TRUE)
);

-- Indexes for performance
CREATE INDEX idx_semantic_entities_type ON semantic_entities(entity_type);
CREATE INDEX idx_semantic_entities_cluster ON semantic_entities(cluster_id);
CREATE INDEX idx_semantic_edges_source ON semantic_edges(source_id);
CREATE INDEX idx_drift_audit_entity ON drift_audit_log(entity_id, created_at DESC);
```

### Query Patterns (via Article 12 Logger)

**Drift evaluation with ontology binding:**

```typescript
// 1. Fetch entity from truth standard
const entity = await db.query(`SELECT * FROM semantic_entities WHERE truth_standard_key = $1`, [
  `Agent:${agentSku}:${version}`,
]);

// 2. Compute drift through reasoning chain
const drift = await semanticDriftScorer.evaluate({
  entity,
  chain: reasoningSteps, // reasoning trace
  ontologyVersion: "dws-truth-v1.0",
});

// 3. Log to audit trail (Article 12)
await article12Logger.log({
  entity_id: entity.id,
  drift_score: drift.score,
  action: drift.action, // maps to SLA tier
  confidence_chain: drift.checkpoints,
  approver_role_id: user.role_id, // from DWS_ROLES_REGISTRY
  created_at: new Date(),
});

// 4. Route escalation (if drift.action === 'ESCALATE')
const recipient = await rolesRegistry.getEscalationRecipient(user.role_id);
await pubsub.publish("kya-escalations-q1-2027", {
  drift_score: drift.score,
  entity: entity,
  approver_role: user.role_id,
  recipient_role: recipient,
});
```

## Layer 3: Semantic Drift Scorer Integration

### Algorithm: Confidence Decay

For each reasoning step in the chain:

```
confidence(n) = initial_confidence × e^(-λ × n)
```

Where:

- `n` = step number in reasoning chain
- `λ` = decay rate (default 0.3, tunable per entity type)
- Semantic similarity = edge weight between steps

### Drift Score Computation

```
drift_score = 1 - avg(edge_weights) over reasoning path
```

**Interpretation:**

- `drift_score < 0.10`: High confidence (allow → proceed)
- `drift_score 0.10–0.30`: Yellow flag (log + escalate for review)
- `drift_score 0.30–0.70`: Caution (log + monitor)
- `drift_score > 0.70`: Divergence detected (escalate + recommend halt)

### Ontology Binding

**Trust Standard Entity Types** (from DWS_TRUTH_STANDARD.md):

| Entity Type | Decay Rate (λ) | Escalation Threshold | Rationale                                   |
| ----------- | -------------- | -------------------- | ------------------------------------------- |
| `Agent`     | 0.3            | 0.30                 | Model versions may drift; low tolerance     |
| `Skill`     | 0.2            | 0.50                 | Skills more stable; higher tolerance        |
| `Role`      | 0.1            | 0.70                 | Organizational roles stable; high tolerance |
| `Partner`   | 0.4            | 0.20                 | External orgs unpredictable; strict         |

## Layer 4: KYA v2 Trust Decision Workflow

### End-to-End Flow

```
┌──────────────────────────────────┐
│ User queries KYA v2 system       │
└──────────┬───────────────────────┘
           │
           ▼
┌──────────────────────────────────┐
│ Semantic Drift Scorer evaluates  │
│ reasoning chain → drift_score    │
└──────────┬───────────────────────┘
           │
           ▼
┌──────────────────────────────────┐
│ Article 12 Logger immutably logs │
│ drift event to audit_trail       │
└──────────┬───────────────────────┘
           │
           ▼
      Is drift_score >= threshold?
           │
    ┌──────┴──────┐
    │             │
  NO             YES
    │             │
    ▼             ▼
 PROCEED    Lookup DWS_ROLES_REGISTRY
            for user's role → escalation_recipient
            │
            ▼
       Route to recipient
       (Slack/email)
            │
            ▼
       Human review + decision
       (within SLA tier)
            │
            ▼
       Log decision to audit_trail
       → drift_audit_log.approver_decision
            │
            ▼
       Return KYA decision
       (APPROVED / DEFERRED / REJECTED)
```

### SLA Compliance Matrix

| Drift Tier           | SLA   | Escalation  | Human Gate          |
| -------------------- | ----- | ----------- | ------------------- |
| PROCEED (< 0.10)     | Auto  | None        | No                  |
| LOG (0.10–0.30)      | <24hr | Operator    | Optional            |
| ESCALATE (0.30–0.70) | <1hr  | Analyst     | Required            |
| HALT (> 0.70)        | <5min | HIC + Legal | Required + Approval |

## Compliance & Governance

### Article 12 (Automatic Logging)

✓ **Implemented in Phase 1:**

- All drift evaluations ≥ 0.30 logged to immutable audit trail
- Cryptographic hash-chain integrity (previous record hash in new record)
- Timestamp + approver identity captured per EU standards
- Weekly transparency reports generated (markdown + PDF export)

### Article 13 (Transparency)

✓ **Disclosure Required:**

- Semantic drift component listed in system transparency report
- Algorithm summary (confidence decay formula) in partner appendix
- Reconciliation with DWS truth standard documented
- Drift threshold tuning parameters disclosed per entity type

### Article 14 (Human Oversight)

✓ **Governance Gates:**

- Drift escalation routed via DWS_ROLES_REGISTRY (authorized escalation recipients)
- Human decision recorded with approver role ID (immutable)
- SLA enforcement (response deadline enforced in workflow)
- KYA v2 consent capture for drift-based revocation (opt-in Phase 2)

## Deployment Steps

### 1. Schema Migration

```bash
psql -U postgres -d dws6_main < migrations/0095_semantic_graph_schema.sql
```

### 2. Environment Configuration

```bash
GRAPH_ENABLED=true
GRAPH_PHASE=logging
DRIFT_THRESHOLD_HALT=0.10
DRIFT_THRESHOLD_ESCALATE=0.30
ARTICLE12_ENABLED=true
KYA_V2_TRUST_FRAMEWORK=true
```

### 3. Service Initialization

```typescript
// src/services/index.ts
import { SemanticDriftScorerService } from "./agents/semantic-drift-scorer.service";
import { Article12Logger } from "./compliance/article-12-amr-logger";
import { DWSRolesRegistry } from "./governance/dws-roles-registry";

const driftScorer = new SemanticDriftScorerService(db);
const article12Logger = new Article12Logger(db);
const rolesRegistry = new DWSRolesRegistry(db);

// Wire to KYA v2 decision engine
kyaV2Engine.onEvaluate(async (chain) => {
  const drift = await driftScorer.evaluate(chain);
  await article12Logger.log(drift);
  if (drift.action === "ESCALATE") {
    await rolesRegistry.routeEscalation(drift);
  }
  return drift;
});
```

### 4. Verification Checklist

- [ ] Schema created (semantic_entities, semantic_edges, drift_audit_log)
- [ ] Article 12 logging <100ms latency p99
- [ ] Transparency report template renders 30-day window
- [ ] DWS_ROLES_REGISTRY escalation routing tested
- [ ] Hash-chain integrity validation passes
- [ ] Load test: >1000 drift evals/sec sustained
- [ ] Legal sign-off (Article 13 disclosure)
- [ ] Partner training complete

## References

- **Semantic Drift Prototype:** `src/agents/semantic-drift-scorer.service.ts`
- **Article 12 Logger:** `src/compliance/article-12-amr-logger.ts`
- **Field Note (Option A Rationale):** `docs/field-notes/2026-09-06-graphs-evidence-dws6-architecture.md`
- **Case Study (Theory + Example):** `docs/2026-09-06-semantic-drift-case-study.md`
- **DWS Truth Standard:** `DWS_TRUTH_STANDARD.md` (§8 Entity Reconciliation)
- **DWS Roles Registry:** `DWS_ROLES_REGISTRY.md` (access control governance)

---

**Status:** ✓ Integration design locked for Q1 2027 Phase 1 rollout (logging-only).
