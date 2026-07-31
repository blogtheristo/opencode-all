---

# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:

- Version: 1.0 | Tool: Claude Code (Opus 4.7) | Session: claude/kya-memory-binding-RuJ0G | Date: 23.04.2026 | Changes: Initial standard — canonical definition of the DWS Article 12 Logging Pipeline (replacing the deprecated "Aiven layer" / "Aiven (EU AI Act)" / "Aiwen layer" terminology). Three-tier mapping (Aegis / Sovereign Infra / Connect). Mandatory schema. Retention minimums. Integration points with KYA and Firehorse. Companion to field notes 2026-04-23-eu-ai-act-compliance-layer-research.md and 2026-04-23-sovereign-cloud-providers-aegis-partner-research.md

Document Status:

- Created: 23.04.2026
- Last Modified: 23.04.2026
- Language: English
- Publication Status: ACTIVE

Code-Version: 1.0
Branch: claude/kya-memory-binding-RuJ0G
Date: 2026-04-23
Owner: Risto Anton Päärni, Lifetime Oy

---

# DWS Article 12 Logging Standard

**Purpose.** Define the canonical record-keeping stack for DWS IQ AI systems under EU AI Act Article 12 (Regulation (EU) 2024/1689). Replaces all legacy references to "Aiven layer", "Aiven (EU AI Act)", and "Aiwen layer" — these were DWS-internal shorthand for the obligation Article 12 defines, but were architecturally confused because Aiven is a managed-Postgres SaaS, not a compliance environment.

**Applies to.** Every DWS IQ 6 agent, workflow, and product that processes data in scope of the EU AI Act as a high-risk system (Annex III) or as a component of one. This is deployment-tier-aware: the same regulatory obligation, implemented with tier-specific vendors.

**Full EU AI Act enforcement for high-risk systems (Annex III standalone):** 2 December 2027 (Omnibus provisional agreement, 7 May 2026; was 2 August 2026). Annex I embedded products (Machinery, Medical Device Regulation): 2 August 2028. Article 12 logging obligations are unchanged — the deferral shifts formal enforcement fines, not the substantive requirement to log.

---

## 1. Regulatory Anchors

| Article           | Requirement                                                                                                                      |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| **Art. 12**       | Automatic logging over the lifetime of the system; events must be sufficient to detect risk situations                           |
| **Art. 12(1)(a)** | Identifying situations that may result in risk within the meaning of Art. 79(1) or substantial modification                      |
| **Art. 12(1)(b)** | Facilitating post-market monitoring under Art. 72                                                                                |
| **Art. 12(1)(c)** | Monitoring operation under Art. 26(5)                                                                                            |
| **Art. 12(2)**    | Biometric identification systems (Annex III §1(a)): minimum fields — use period, reference DB, matched inputs, verifier identity |
| **Art. 14(5)**    | Human oversight identity captured in logs                                                                                        |
| **Art. 26(5)**    | Deployer operational monitoring                                                                                                  |
| **Art. 26(6)**    | **Minimum retention: 6 months** (sectoral/national law may extend)                                                               |
| **Art. 72**       | Post-market monitoring plan — logs are the evidence base                                                                         |
| **Art. 73**       | Incident reporting — serious incidents within 15 days                                                                            |

---

## 2. Canonical Architecture — The Article 12 Logging Pipeline

> **Open standard vs. DWS product.** The Article 12 Logging Pipeline described in this document is an **open architecture**, part of the KYA open standard family. DWS's own **branded, proprietary implementation** of this architecture is named **Themis — The Aegis Control Plane**. Themis bundles the KYA Policy Proxy, Article 12 Logging Pipeline, Systems Inventory, and Reporting Portal into the managed control plane that ships inside every Aegis (Tier 1) deployment. "KYA = the protocol; Themis = DWS's implementation; Aegis = the product customers buy."

The pipeline is a **software stack**, not a cloud environment. It runs alongside DWS IQ workloads on whatever tier-appropriate infrastructure the customer is deployed to.

```
┌─────────────────────────────────────────────────────────────────────┐
│  DWS IQ AGENT / WORKFLOW / MCP TOOL                                 │
│    │                                                                │
│    └─ OpenTelemetry SDK (auto-instrumented)                         │
│         │                                                           │
│         ▼                                                           │
│  ┌─────────────────────────┐                                        │
│  │  OTel Collector         │  PII redaction • SHA-256 event hash   │
│  │  (self-hosted)          │  • tier-appropriate routing            │
│  └─────────────┬───────────┘                                        │
│                ▼                                                    │
│  ┌─────────────────────────┐                                        │
│  │  KYA Policy Proxy       │  Identity attribution (KYA-S §1)       │
│  │                         │  Capability manifest enforcement       │
│  │                         │  Memory-mutation attestation (§10)     │
│  └─────────────┬───────────┘                                        │
│                ▼                                                    │
│  ┌─────────────────────────┐                                        │
│  │  Append-Only Ledger     │  Aiven Postgres (Aegis) /              │
│  │  + Hash Chain           │  Azure Immutable Blob (Tier 2) /       │
│  │                         │  S3 Object Lock (Tier 3)               │
│  └─────────────┬───────────┘                                        │
│                ▼                                                    │
│  ┌─────────────────────────┐                                        │
│  │  Systems Inventory      │  Annex III classification              │
│  │  & Policy Engine        │  Conformity assessment state           │
│  │                         │  Tier 1: DWS-native (KYA-extended)     │
│  │                         │  Tier 2: Credo AI / Holistic AI (EU)   │
│  │                         │  Tier 3: OneTrust / IBM Watsonx        │
│  └─────────────┬───────────┘                                        │
│                ▼                                                    │
│  ┌─────────────────────────┐                                        │
│  │  Post-Market Monitoring │  Firehorse Report Engine               │
│  │  Portal                 │  Auditor export (JSON, <10 bus. days)  │
│  └─────────────────────────┘                                        │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 3. Mandatory Log Schema

Every DWS-emitted event MUST carry these fields (superset of Article 12(2) minimum, KYA-extended). Additional fields per domain are allowed.

```jsonc
{
  // --- Identity (KYA-S §1) ---
  "agent_id": "uuid", // Cryptographic agent session ID
  "operator_id": "uuid", // KYC-verified human behind session
  "org_id": "string", // Tenant isolation
  "capability_manifest_hash": "sha256",

  // --- Event core ---
  "event_id": "uuid",
  "event_type": "enum", // agent.decide | tool.invoke | memory.store | memory.supersede | memory.forget | human.override | incident
  "timestamp": "iso8601",
  "trace_id": "otel_trace_id",
  "span_id": "otel_span_id",
  "model_version": "string",

  // --- Art. 12(1)(a) — risk-relevant context ---
  "input_digest": "sha256", // hash of inputs; raw inputs per tier policy
  "reasoning_steps": "array|null", // redacted where PII policy applies
  "output_digest": "sha256",
  "confidence": "float",

  // --- Art. 12(2) — biometric minimum (if applicable) ---
  "biometric": {
    "use_period_start": "iso8601",
    "use_period_end": "iso8601",
    "reference_db": "string",
    "match_input_ref": "string|null",
    "verifier_id": "uuid|null", // Art. 14(5)
  },

  // --- Tamper evidence ---
  "prev_hash": "sha256", // chain to previous event in ledger
  "event_hash": "sha256", // = sha256(prev_hash + canonical_event_json)
}
```

**Redaction.** PII fields may be hashed or tokenised before entering the ledger per tier policy. Aegis tier mandates tokenisation. Redaction operations themselves are logged (one event per redaction, immutable).

---

## 4. Retention

| Data class                                       | Minimum retention              | Source                             |
| ------------------------------------------------ | ------------------------------ | ---------------------------------- |
| Risk-relevant events (default)                   | **6 months**                   | Art. 26(6)                         |
| Memory-mutation audit log (KYA-S §10)            | 5 years                        | `Legal/KYA_SECURITY_v1.2.md` §10.4 |
| Identity events (KYA score changes, leash snaps) | 5 years                        | `Legal/KYA_SECURITY_v1.2.md`       |
| Biometric verification logs                      | 6 months + sectoral extensions | Art. 26(6) + national IDV law      |
| Serious-incident reports                         | 10 years                       | Art. 73                            |

Customers operating under CSRD, NIS2, CER, or sectoral law (e.g. financial services) may extend retention. The pipeline honours the longest applicable retention per event.

---

## 5. Tier Mapping

Per `docs/PRODUCT_TIERS.md` — Aegis / Sovereign Infra / Connect. Same pipeline, tier-appropriate vendors.

| Stage              | Tier 1 — Aegis (Full Sovereign)                | Tier 2 — Sovereign Infra (EU-Sovereign)                     | Tier 3 — Connect (Global)                           |
| ------------------ | ---------------------------------------------- | ----------------------------------------------------------- | --------------------------------------------------- |
| Instrumentation    | OpenTelemetry                                  | OpenTelemetry                                               | OpenTelemetry                                       |
| Collector          | Self-hosted on UpCloud / OVH / Scaleway        | Self-hosted or **Red Hat OpenShift Logging** (EU)           | AWS CloudWatch / Azure Monitor / GCP Cloud Logging  |
| Append-only ledger | Aiven Postgres (FI) + hash chain               | Aiven Postgres (EU) or **Azure Immutable Blob** (EU bound.) | S3 Object Lock / Azure Immutable Blob / GCS         |
| Policy engine      | KYA Proxy (DWS-native)                         | KYA Proxy or **Microsoft Azure AI Foundry** (EU)            | KYA Proxy or vendor-native                          |
| Systems inventory  | **DWS-native (KYA-extended)** — see §7 Roadmap | **Credo AI** (US, EU-hosted) / **Holistic AI** (UK, EU)     | OneTrust / IBM Watsonx Governance / Credo AI global |
| Runtime monitoring | Grafana OSS / Prometheus (self-hosted)         | **Fiddler** (EU region) / **Arize** (EU region)             | Fiddler / Galileo / Arize / Helicone                |
| Reporting portal   | Firehorse Report Engine (DWS-native)           | Firehorse + Credo AI reports                                | Firehorse + vendor reports                          |

**Why UpCloud / OVH / Scaleway at Tier 1?** Non-US-owned, outside CLOUD Act. See `docs/field-notes/2026-04-23-sovereign-cloud-providers-aegis-partner-research.md` §2.1.

**Why Red Hat and Azure AI Foundry only on Tier 2+?** US-parent. EU-region contractual delivery is sufficient for Tier 2 GDPR posture but voids Aegis zero-CLOUD-Act claim.

---

## 6. Integration with Existing DWS Standards

| Standard                         | Relationship                                                                                      |
| -------------------------------- | ------------------------------------------------------------------------------------------------- |
| `Legal/KYA_STANDARD_v1.md`       | KYA is the identity and policy layer of the pipeline (§2 above)                                   |
| `Legal/KYA_SECURITY_v1.2.md` §10 | Memory Audit Trail is a specialised event stream emitted into this pipeline                       |
| `DWS_DATA_STANDARD.md`           | Aiven Postgres as the Tier 1 ledger storage (consistent with approved data-platform standard)     |
| `DWS_SECURITY_STANDARD.md`       | Security controls on the pipeline itself (tamper evidence, access control, retention enforcement) |
| `docs/PRODUCT_TIERS.md`          | Three-tier product segmentation drives the tier-specific implementations in §5                    |
| `docs/CLOUD_ENVIRONMENTS.md`     | The pipeline runs _inside_ each cloud environment; not a separate environment                     |

---

## 7. Roadmap Gaps

### 7.1 Tier-1 Systems Inventory (OPEN) — KYA Absorbs as Minimum Sovereign Control Plane

No EU-incorporated equivalent to Credo AI / Holistic AI / OneTrust / IBM Watsonx Governance exists at April 2026. Aegis-tier customers cannot use these for sovereignty reasons — handing the system-of-record for AI inventory and policy gates to a US parent would be a real contradiction with Aegis's zero-CLOUD-Act claim, not a sales footnote.

**Decision:** extend KYA to own systems-inventory and policy-engine responsibilities, **scoped as the minimum sovereign control plane**. KYA must not become a bloated GRC suite; the goal is a tight Aegis-complete feature set, not a OneTrust clone.

**In scope (the six tight pieces):**

1. **AI Systems Registry** — one row per deployed AI system with metadata (owner, version, deployment tier, data categories)
2. **Annex III classification** — EU AI Act high-risk category mapping, stored as a first-class field
3. **Approval flow** — pre-production gate (who signed off, when, conformity-assessment reference)
4. **Lineage** — training data, model version, and dependency chain captured at registration time
5. **Audit trail** — every registry mutation attested via the KYA-S §10 Memory Audit Trail pattern (already shipping)
6. **Policy gate** — runtime enforcement (e.g. "no deploy to Tier 1 without signed-off Annex III classification")

**Explicitly out of scope (avoid GRC swamp):**

- Vendor risk management questionnaires
- Generic ISO 27001 control libraries
- Third-party-assessment workflows
- Board-reporting dashboards
- Compliance-as-a-service marketplace

**Proposed schema extension to KYA:**

```
ai_systems_registry    (system_id, owner_id, name, version, tier, annex_iii_class, conformity_ref, created_at)
approval_records       (approval_id, system_id, approver_id, decision, artefact_ref, timestamp)
governance_policies    (policy_id, name, rule_dsl, target_tier, active)
policy_decisions       (decision_id, policy_id, system_id, result, evaluated_at, event_hash)
```

All four tables inherit the KYA-S §10 audit pattern (`memory_audit_log` analogue). Integration with existing `agents` table via `system_id` foreign key. No new UI framework — reuse the KYA dashboard shell.

**Target:** PR in Q3 2026 to keep pace with Article 12 enforcement from 2 August 2026. Positioning: "minimum sovereign control plane", not "governance suite".

### 7.2 Logs Admissibility (FUTURE)

Court-defensibility of Article 12 logs has not been tested in EU case law as of April 2026. DWS's hash-chain + KYA-attested events exceed the regulatory minimum. A formal legal opinion (Lifetime Oy legal counsel + external review) is open work.

### 7.3 Open-Source Publication (FUTURE)

Aligned with KYA's open-standard path (Agentic AI Foundation / Linux Foundation), the pipeline spec should be publishable as a reference open standard. Out of scope for v1.0 of this document.

---

## 8. Deprecation Notes

| Deprecated term                      | Canonical replacement                                     | Notes                                                           |
| ------------------------------------ | --------------------------------------------------------- | --------------------------------------------------------------- |
| "Aiwen layer" / "Aiwen cloud"        | Article 12 Logging Pipeline                               | "Aiwen" was a typo/hallucination; never real                    |
| "Aiven layer" / "Aiven overlay"      | Article 12 Logging Pipeline                               | Aiven is the **Postgres storage** component, not the layer      |
| "Aiven (EU AI Act)" cloud env.       | Article 12 Logging Pipeline (software stack, not a cloud) | Lives inside existing EU Cloud / Aegis cloud — not separate     |
| "Aiven Article 12 logging"           | Article 12 logging (via Aiven Postgres ledger, Tier 1)    | Disambiguate: Aiven is the **storage**, Article 12 the **what** |
| "Aiven audit" / "Aiven immutability" | Article 12 audit / Article 12 immutability                | The immutability property belongs to Article 12 obligation      |
| "EU AI Act compliance cloud"         | Article 12 Logging Pipeline                               | Not a separate cloud                                            |

Repo sweep to apply these replacements tracked in `claude/kya-memory-binding-RuJ0G`.

---

## 9. Related Documents

- `Legal/KYA_STANDARD_v1.md` — Know Your Agent parent document
- `Legal/KYA_SECURITY_v1.2.md` — KYA security controls incl. §10 Memory Audit Trail
- `docs/PRODUCT_TIERS.md` — DWS 3-tier product architecture
- `docs/CLOUD_ENVIRONMENTS.md` — US / EU / Aegis cloud environments
- `DWS_DATA_STANDARD.md` — Aiven Postgres + TimescaleDB Hypercore data tier
- `DWS_SECURITY_STANDARD.md` — Security controls
- `docs/field-notes/2026-04-23-eu-ai-act-compliance-layer-research.md` — Research basis for this standard
- `docs/field-notes/2026-04-23-sovereign-cloud-providers-aegis-partner-research.md` — Sovereign cloud provider survey

---

**Lifetime Oy** | Helsinki, Finland
**Contact:** risto@onelifetime.world
**Legal Hub:** Legal/
