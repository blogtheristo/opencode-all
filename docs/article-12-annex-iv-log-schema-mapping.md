# DWS IQ — Article 12 Log Schema Mapping to EU AI Act Annex IV Technical Documentation

***
# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:
  - Version: 1.0 | Tool: Claude Code | Date: 08.03.2026 | Changes: Initial specification — maps DWS IQ sovereignty audit event log schema to EU AI Act Article 12 requirements and Annex IV technical documentation fields. Created for NDA technical-spec calls with robot OEM partners.

Document Status:
  - Created: 08.03.2026
  - Last Modified: 08.03.2026
  - Language: English
  - Publication Status: CONFIDENTIAL — NDA REQUIRED
  - Document Type: Technical Specification / Regulatory Mapping

***

## 1. Purpose

This document maps the DWS IQ sovereignty audit logging layer's event schema to the specific requirements of:

- **EU AI Act Article 12** (Regulation (EU) 2024/1689) — Automatic event logging for high-risk AI systems
- **EU AI Act Annex IV** — Technical documentation requirements for high-risk AI systems
- **EU AI Act Article 14** — Human oversight requirements (cross-referenced in logging)

This is the document to share on NDA calls with robot OEM partners (Tesla/xAI, Boston Dynamics, Agility, Figure, Universal Robots, ABB) who want to evaluate DWS IQ as their Article 12 compliance wrapper.

---

## 2. DWS IQ Sovereignty Audit Event Log Schema

### 2.1 Core Event Structure

```json
{
  "eventId": "uuid-v7",
  "type": "robot.task.execute | robot.safety.estop | ai.decision.made | ai.confidence.below_threshold | human.override.invoked",
  "source": "agent:compliance | agent:sitesense | fleet:optimus-v3-unit-001",
  "timestamp": "2026-03-08T14:23:01.447Z",
  "sessionId": "sess_abc123",
  "correlationId": "workflow_xyz789",
  "orgId": "tenant_eu_industrial_001",
  "priority": "low | normal | high | critical",
  "payload": {
    "taskId": "task_cement_kiln_inspection_042",
    "robotId": "optimus-v3-unit-001",
    "aiDecisionChain": [
      {
        "agentName": "sitesense",
        "model": "qwen3-32b-industry-cement",
        "input": "Check cement kiln for heat loss",
        "output": "Thermal anomaly detected sector 3, insulation degradation 40%",
        "confidenceScore": 0.87,
        "reasoningLineage": "PLC telemetry anomaly → thermal model inference → confidence threshold passed → task plan generated"
      },
      {
        "agentName": "compliance",
        "model": "mistral-large-eu-sovereign",
        "input": "Validate task plan against safety constraints",
        "output": "Task plan approved — no restricted zone entry, human override available",
        "confidenceScore": 0.94,
        "reasoningLineage": "Safety constraint check → zone clearance verified → PPE status confirmed → approval issued"
      }
    ],
    "humanApprovalStatus": "approved | pending | overridden | not_required",
    "humanApprovalBy": "captain_user_opaque_id_001",
    "humanApprovalTimestamp": "2026-03-08T14:23:00.112Z",
    "executionResult": "completed | failed | aborted_by_human | safety_stop",
    "sensorSnapshot": {
      "temperature": "42.3C",
      "humidity": "67%",
      "windSpeed": "3.2m/s"
    }
  },
  "retention": {
    "minimumYears": 7,
    "storageLocation": "on-prem-immutable",
    "exportFormat": "NDJSON"
  }
}
```

### 2.2 Event Types (Robot Operations)

| Event Type | Trigger | Article 12 Relevance |
|-----------|---------|---------------------|
| `robot.task.plan` | AI generates task plan for robot | Decision traceability |
| `robot.task.execute` | Robot begins physical execution | Operation monitoring (Art 26(5)) |
| `robot.task.complete` | Robot finishes task | Post-market monitoring (Art 72) |
| `robot.safety.estop` | Emergency stop triggered (hardware or software) | Risk identification (Art 79(1)) |
| `robot.safety.zone_violation` | Robot approaches restricted zone | Substantial modification detection |
| `ai.decision.made` | Any AI agent produces a decision | Core Article 12 requirement |
| `ai.confidence.below_threshold` | Confidence score < 70% | If-then commitment — triggers human review |
| `human.override.invoked` | Captain overrides AI decision | Human oversight (Art 14) |
| `human.override.estop` | Captain triggers emergency stop | Human oversight (Art 14) |
| `system.model.swap` | Sovereignty button: Grok ↔ Mistral swap | Substantial modification (Art 79(1)) |
| `system.update.applied` | Software update applied during maintenance window | Substantial modification logging |

---

## 3. Mapping to Article 12 Requirements

### 3.1 Article 12(1) — Automatic Recording of Events

| Article 12 Requirement | DWS IQ Field(s) | Status |
|------------------------|---------------------|--------|
| Automatic recording of events | All events auto-logged by event bus — no manual logging required | **ACTIVE** |
| Over the lifetime of the system | `retention.minimumYears: 7` (exceeds 5-year minimum) | **ACTIVE** |
| Enable traceability of AI system functioning | `aiDecisionChain[]` with full reasoning lineage per agent | **ACTIVE** |
| Appropriate to the intended purpose | Event types tailored to robot + industrial compliance use cases | **ACTIVE** |

### 3.2 Article 12(2) — Traceability for Risk Identification

| Traceability Purpose (Article) | DWS IQ Coverage | Status |
|-------------------------------|---------------------|--------|
| **Identifying risks (Art 79(1))** | `robot.safety.*` events + `ai.confidence.below_threshold` + sensor snapshots | **ACTIVE** |
| **Substantial modifications (Art 79(1))** | `system.model.swap` + `system.update.applied` events with before/after state | **ACTIVE** |
| **Post-market monitoring (Art 72)** | Full event history exportable as NDJSON; filterable by time range, event type, robot unit | **ACTIVE** |
| **Operation monitoring (Art 26(5))** | Real-time event stream + dashboard in Captain's Bridge UI | **ACTIVE** |

### 3.3 Article 12(3) — Annex III Biometric Fields (Conditional)

| Annex III Minimum Field | DWS IQ Coverage | Status |
|-------------------------|---------------------|--------|
| Period of each use | `timestamp` (start) + `executionResult` (end) in event pairs | **ACTIVE** |
| Reference database against which input data has been checked | Not applicable for industrial manipulation tasks. **If camera triggers biometric classification:** reference DB field must be added | **GAP — conditional** |
| Input data for which search has led to a match | Not applicable for industrial manipulation. Biometric classification path: requires addition | **GAP — conditional** |
| Identification of natural persons verifying results (Art 14(5)) | `humanApprovalBy` (opaque ID, GDPR-safe) + `humanApprovalTimestamp` | **ACTIVE** |

**Note:** These biometric fields are only required if Optimus cameras trigger Annex III biometric identification classification. For pure industrial tasks (95% of pilots), these fields are not required.

### 3.4 Article 14 — Human Oversight (Cross-Referenced in Art 12)

| Article 14 Requirement | DWS IQ Coverage | Status |
|------------------------|---------------------|--------|
| Human ability to understand AI output | `aiDecisionChain[].reasoningLineage` — full chain from input to output | **ACTIVE** |
| Human ability to override | `human.override.*` events + physical e-stop relay + software kill (≤1s response) | **ACTIVE** |
| Human ability to intervene or halt | Emergency stop audit trail with `robot.safety.estop` event | **ACTIVE** |
| Human oversight during system lifetime | Captain's Bridge UI with real-time monitoring + historical log access | **ACTIVE** |

---

## 4. Mapping to Annex IV Technical Documentation

| Annex IV Section | Required Content | DWS IQ Delivery | Status |
|-----------------|-----------------|-----------------|--------|
| **1. General description** | Intended purpose, developer identity, version | System manifest per deployment; version tracked in event schema | **ACTIVE** |
| **2. Detailed description of elements** | | | |
| 2(a) Development methods | Training, testing, validation procedures | Model evaluation suite; domain-specific benchmarks per industry vertical | **ACTIVE** |
| 2(b) Design specifications | System architecture, algorithms, data handling | Brain-Memory-Body-Hands architecture doc; 16-LLM conductor pattern | **ACTIVE** |
| 2(c) System architecture | How components interact | MCP JSON-RPC 2.0 coordination; event bus; agent delegation chain | **ACTIVE** |
| 2(d) Computational resources | Hardware requirements | GN-100 NVIDIA Grace Blackwell spec; air-gapped deployment | **ACTIVE** |
| 2(e) Data requirements | Training/validation/testing data | Open-weight models (Qwen, Mistral, Llama); no customer data used for training | **ACTIVE** |
| 2(f) Human oversight measures | Art 14 implementation | Captain's Bridge; e-stop; confidence thresholds; override audit trail | **ACTIVE** |
| **3. Monitoring, functioning, control** | How the system is monitored in production | Sovereignty audit logging layer; real-time dashboard; NDJSON export for authorities | **ACTIVE** |
| **4. Risk management system** | Art 9 requirements | 6-layer security architecture; if-then commitment framework; OWASP LLM Top 10 | **ACTIVE** |
| **5. Changes during lifecycle** | Modifications tracking | `system.model.swap` + `system.update.applied` events; git-tracked config | **ACTIVE** |
| **6. Harmonised standards applied** | List of standards | ISO 27001 (Q3 2026), IEC 62443 (Q1 2027), Machinery Reg 2023/1230 (partner) | **IN PROGRESS** |
| **7. EU declaration of conformity** | Signed declaration | Requires notified body assessment — joint effort with robot OEM partner | **PLANNED** |

---

## 5. Log Export Format for National Authorities

When a national market surveillance authority requests logs under Article 12, DWS IQ exports:

```
Format:        NDJSON (Newline-Delimited JSON)
Encoding:      UTF-8
Compression:   gzip (optional)
Time range:    Configurable (default: full retention period)
Filters:       Event type, robot unit, org tenant, priority level
Delivery:      Encrypted USB transfer (air-gapped sites) or secure SFTP
Integrity:     SHA-256 hash per export file + chain-of-custody manifest
```

### Export Fields per Event

| Field | Type | Description |
|-------|------|-------------|
| `eventId` | UUID v7 | Globally unique, time-ordered event identifier |
| `type` | string | Dot-notation event classification |
| `source` | string | Originating agent or fleet unit |
| `timestamp` | ISO 8601 | Microsecond precision, UTC |
| `sessionId` | string | Correlation to user session |
| `correlationId` | string | Workflow or multi-step operation trace |
| `orgId` | string | Tenant isolation (multi-tenant deployments) |
| `priority` | enum | low / normal / high / critical |
| `payload.taskId` | string | Task-level correlation |
| `payload.robotId` | string | Physical unit identifier |
| `payload.aiDecisionChain` | array | Full reasoning lineage per agent in chain |
| `payload.humanApprovalStatus` | enum | approved / pending / overridden / not_required |
| `payload.executionResult` | enum | completed / failed / aborted_by_human / safety_stop |

---

## 6. Retention & Storage Architecture

| Parameter | Value | Regulation |
|-----------|-------|-----------|
| Minimum retention | 7 years | Exceeds EU AI Act 5-year minimum |
| Storage type | Append-only, immutable (WORM-style) | Article 12 integrity requirement |
| Location | On-premises at customer site | CLOUD Act-free; GDPR Art 44–49 compliant |
| Encryption at rest | AES-256-GCM | DWS Security Standard Layer 1 |
| Access control | RBAC; Captain + Compliance Officer roles only | Principle of least privilege |
| Backup | Encrypted backup to EU-sovereign secondary (Hetzner Helsinki) | Business continuity |
| Deletion | Not permitted during retention period | Regulatory hold |

---

## 7. Digital Omnibus on AI — Impact on This Specification

The November 2025 Digital Omnibus on AI proposal (trilogue ongoing, March 2026):

- **Does NOT change** Article 12 logging requirements — this spec remains valid regardless of Omnibus outcome
- **May delay** high-risk applicability from August 2026 to December 2027 — timelines tied to availability of harmonised standards/guidance
- **Lighter QMS/doc burden** for SMEs and small mid-caps — DWS qualifies for reduced documentation under Annex IV
- **No registration required** for systems claiming high-risk derogation with human oversight — relevant to DWS's limited-risk self-classification

**DWS position:** Certify early. If the Omnibus delays the deadline, we have a marketing win. If it doesn't, we're compliant on time.

---

## 8. What Robot OEM Partners Need to Provide

For the joint Annex IV technical file, the robot OEM partner supplies:

| Partner Deliverable | DWS IQ Consumes It For |
|--------------------|----------------------|
| Robot hardware safety assessment (Machinery Reg 2023/1230) | Annex IV Section 6 — harmonised standards |
| Sensor data API specification (REST/gRPC) | Annex IV Section 2(c) — system architecture |
| Local control protocol documentation | Annex IV Section 2(b) — design specifications |
| Emergency stop hardware specification | Annex IV Section 3 — monitoring and control |
| CE marking status / notified body engagement | Annex IV Section 7 — declaration of conformity |
| Robot firmware version management process | Annex IV Section 5 — lifecycle changes |

DWS IQ provides everything else: AI system logging, reasoning lineage, human oversight layer, risk management system, monitoring infrastructure, and the complete Article 12 compliance wrapper.

---

## Document Classification

**CONFIDENTIAL — NDA REQUIRED**

This document is shared only under signed NDA with potential robot OEM partners evaluating DWS IQ as their EU AI Act Article 12 compliance layer. Do not distribute externally without Lifetime Oy CEO approval.

**Contact:** risto@onelifetime.world
