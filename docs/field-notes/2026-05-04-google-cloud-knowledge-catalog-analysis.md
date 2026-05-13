# Field Note: Google Cloud Knowledge Catalog — DWS Learning & Implementation Plan

---

# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:

- Version: 1.0 | Tool: Claude Code (claude-sonnet-4-6) | Session: claude/knowledge-catalog-research-J207A | Date: 04.05.2026 | Changes: Initial field note. Triggered by Google Cloud blog post by Chai Pydimukkala and Sam McVeety (Product/Tech Leads, Google Cloud) introducing Knowledge Catalog — an evolution of Dataplex into a universal context engine for AI agents. Full gap analysis vs DWS IQ 6, ontology mapping, connector decision (export adapter only, not ingestion), and implementation plan for DWS Knowledge Catalog v0.1.

Document Status:

- Created: 04.05.2026
- Last Modified: 04.05.2026
- Language: English
- Languages Available: English
- Publication Status: ACTIVE
- Document Type: Field Note / Strategic Analysis / Implementation Plan

Related Documents:

- ONTOLOGY.md (v1.4 — §15 added in same session)
- docs/field-notes/2026-01-21-karp-enterprise-ai-ontology.md
- DWS_DATA_STANDARD.md
- src/agents/kb.agent.ts
- supabase/migrations/047_hybrid_memory_search.sql

---

- **Date:** 04.05.2026
- **Author:** Risto Anton Päärni (risto.paarni@lifetime.fi)
- **Source:** Google Cloud Blog — "Introducing the Google Cloud Knowledge Catalog" by Chai Pydimukkala (Product Lead) and Sam McVeety (Tech Lead), published May 2026.
- **Context:** Evaluating how GC-KC compares to DWS's existing ontology and memory infrastructure, whether DWS should build a connector, and how to close the identified gaps.

## Ontology Tags

- **Geography:** Global > US (Google Cloud) > EU (DWS IQ)
- **Sector:** Infrastructure > AI/ML > Data Governance > Knowledge Management
- **Entities:** Lifetime Oy, DWS IQ 6/7, Google Cloud, Dataplex, Bloomberg Media, Palantir, SAP, Salesforce, Gemini
- **Standards:** EU AI Act, GDPR, CLOUD Act (exposure risk), Gaia-X
- **Products Referenced:** DWS IQ 6, Lifetime World Model, Firehorse Suite
- **Temporal Context:** 2026-Q2, agentic era knowledge management
- **Confidence:** High — GC-KC features sourced from official Google Cloud blog; DWS gaps from direct codebase exploration

---

## 1. What is Google Cloud Knowledge Catalog?

GC-KC is an evolution of **Google Dataplex** into a dynamic, always-on context engine for enterprises. The core premise:

> "Traditional data catalogs were built as manual inventories for technical users, focusing on table structures rather than the deep context that AI agents need. When agents lack business semantics and data relationships, this triggers hallucinations, high latency, and stale insights."

GC-KC is built on three foundational pillars:

### 1.1 Aggregation — Unifying context across the data estate

Pulls metadata from everywhere into a single governed source of truth:

| Source type                  | Examples                                                       |
| ---------------------------- | -------------------------------------------------------------- |
| Google-native data           | BigQuery, AlloyDB, Spanner, Cloud SQL, Firestore, Looker       |
| Third-party catalogs         | Atlan, Collibra, Datahub, Ab Initio, Anomalo                   |
| Enterprise systems (Preview) | Palantir, Salesforce Data360, SAP, ServiceNow, Workday         |
| Semantic models              | BigQuery Measures (programmatic business logic in SQL), LookML |
| Self-contained assets        | Data Products (intent + SLAs + governance constraints bundled) |

### 1.2 Enrichment — Generating meaning through continuous learning

Goes beyond manual curation:

- **Smart Storage & Object Context API**: Tags and embeds files automatically on landing in GCS
- **Deep multimodal metadata extraction**: Gemini extracts entities and maps business relationships from unstructured data
- **Automated context curation**: Generates business glossaries, verified SQL patterns, natural language descriptions
- **Semantic guardrails**: Prevents hallucinated SQL joins with pre-verified query patterns

### 1.3 Search — High-precision, access-control-aware retrieval

- Hybrid search stack (Google Search technology) — sub-second latency
- Access-control-aware: agents only retrieve what they are authorized to see
- Measurable context evaluation: quantitative testing of context quality, not guesswork

### 1.4 Bloomberg Media Use Case

> "By unifying Bloomberg Media's enterprise metadata and business context through the Knowledge Catalog, we successfully launched our Data Access AI Agent. This internal solution empowers stakeholders across the organization to intuitively explore our data lake, translating complex business inquiries into instant, AI-driven narratives."
> — William Anderson, CTO, Bloomberg Media

---

## 2. Ontology Connection — This Is Karp's Thesis at Industrial Scale

The Palantir CEO field note (`2026-01-21-karp-enterprise-ai-ontology.md`) predicted exactly this product:

> "Once you build a software layer to orchestrate and manage the LLMs in a language your enterprise understands, you actually can create value."

GC-KC is Google's implementation of that orchestration layer. It IS an ontology runtime. Every GC-KC concept maps directly to an ontology tier:

| GC-KC concept                  | Ontology tier                        | DWS ONTOLOGY.md section                     |
| ------------------------------ | ------------------------------------ | ------------------------------------------- |
| Business glossary              | Tier 1: Controlled vocabulary        | §6 entity taxonomy                          |
| Entity relationship extraction | Tier 2: Class hierarchy + properties | ProfileFact subject-predicate-value         |
| Verified SQL patterns          | Tier 3: Axioms + inference rules     | `hybrid_memory_search()` confidence scoring |
| Data products with SLAs        | Ontology instances with governance   | `AgentResponse` confidence 0–1              |
| Access-control-aware search    | Policy / authorization layer         | RLS + KYA trust score                       |
| Business context curation      | World model enrichment               | Lifetime World Model (LWM) pipeline         |
| Automated metadata extraction  | Knowledge pipeline                   | KB raw → wiki → ephemeral lifecycle         |

**Conclusion:** DWS already has the **philosophy** correct (ONTOLOGY.md v1.3). GC-KC shows what the **runtime implementation** looks like at Google Cloud scale. DWS needs to implement an equivalent EU-sovereign runtime.

---

## 3. DWS Current State — What Exists

DWS IQ 6 has mature metadata and knowledge infrastructure. Codebase exploration revealed:

| Component                 | Status                          | Location                                      |
| ------------------------- | ------------------------------- | --------------------------------------------- |
| Semantic Memory System    | Production                      | `semantic_memories` table + `memory.types.ts` |
| Hybrid Vector+Text Search | Production                      | `hybrid_memory_search()` RPC (Migration 047)  |
| Article 12 Audit Log      | Compliant (append-only, 7-year) | `article12_audit_log`                         |
| Memory Audit Trail        | Production                      | `memory_audit_log` + `supersede_memory()`     |
| Knowledge Base (KB)       | Karpathy-inspired LLM wiki      | `kb.agent.ts` + `kb/` filesystem              |
| Ontology Framework        | Strategic spec                  | `ONTOLOGY.md` v1.3                            |
| Agent Taxonomy            | Three-tier pattern              | `Deputy-Agents-Architecture.md`               |
| Data Temperature Model    | Production                      | `DWS_DATA_STANDARD.md` Hot/Warm/Cold/Archive  |
| Product Metadata          | Canonical JSON                  | `dws10.com/config/products.json`              |

**What DWS does NOT have (yet):**

- Unified metadata API across all five stores
- Automated enrichment from agent execution logs
- Formal "Data Products" concept with SLA + governance bundling
- Connector to or from any external catalog

---

## 4. Gap Analysis — Three Gaps

### Gap 1: Aggregation — Fragmented metadata stores, no unified API

DWS metadata lives in five separate locations with no single governance layer:

| Store                 | What it contains                    | Query method                 |
| --------------------- | ----------------------------------- | ---------------------------- |
| `kb/wiki/`            | Compiled LLM articles, research     | Filesystem glob              |
| `semantic_memories`   | Agent episodic + factual memory     | `hybrid_memory_search()` RPC |
| `ONTOLOGY.md`         | Entity taxonomy, governance rules   | Manual read                  |
| `products.json`       | Product catalog, pricing, metadata  | JSON file read               |
| `article12_audit_log` | Decision lineage, compliance events | SQL query                    |

Agents must query each separately. No cross-store search exists.

### Gap 2: Enrichment — Manual KB compilation

The KB lifecycle (`kb/raw/` → `kb/wiki/`) is triggered manually via the `/kb` skill. No automatic enrichment happens from:

- Agent execution logs (which queries succeeded → verified patterns)
- Schema changes (new table → auto-document entity)
- Field notes landing in `docs/field-notes/` (not auto-ingested into KB)

### Gap 3: Data Products — No formal concept

DWS has `AgentResponse` with confidence scores, but no formal "Data Product" concept that bundles:

- Declared schema (input/output)
- SLA (confidence floor, latency ceiling)
- Governance constraints (which agents can consume it)
- Lineage (which memories + ontology nodes it depends on)

Data products are the unit of trust in GC-KC. DWS needs the equivalent for cross-agent consumption.

---

## 5. Connector Decision

### Direct GC-KC ingestion connector: NO

**Reasons:**

1. **Sovereignty risk**: DWS runs EU-sovereign (Supabase + Aiven Finland). GC-KC runs on Google Cloud infrastructure → CLOUD Act exposure. Pushing DWS operational data INTO Google Cloud destroys the sovereignty moat.
2. **Data layer mismatch**: GC-KC requires BigQuery / Spanner / AlloyDB as underlying data stores. DWS uses PostgreSQL/Supabase — there is no native hook.
3. **Vendor lock-in**: Depending on GC-KC for metadata search would make DWS a Google Cloud reseller rather than a sovereign EU platform.

### DWS → GC-KC Export Adapter: YES (future, customer-optional)

Enterprise customers who already run on Google Cloud (BigQuery + SAP stack) may want DWS data products to appear in their GC-KC instance. An export adapter:

- Pushes DWS Data Product metadata to GC-KC's Data Products API
- One-way, push-based, initiated by customer
- DWS data stays in EU; only the metadata descriptor (name, schema, SLA, description) is exported
- Preserves sovereignty: DWS is the source, GC-KC is a customer's view

This adapter opens a Google Cloud enterprise integration story without creating a dependency.

**Future file:** `src/integrations/google/knowledge-catalog-export.ts`

---

## 6. Implementation Plan — DWS Knowledge Catalog v0.1

The DWS equivalent of GC-KC: EU-sovereign, Supabase-native, agent-first.

### Architecture

```
DWS Knowledge Catalog (sovereign)
├── Aggregation Layer (new: knowledge-catalog.agent.ts)
│   ├── kb/wiki/ articles            (filesystem)
│   ├── semantic_memories            (Supabase vector + text)
│   ├── ONTOLOGY.md parsed entities  (on-demand parse)
│   └── products.json data products  (JSON read)
├── Enrichment Layer (extend: kb.agent.ts)
│   ├── Auto-compile KB from agent execution logs
│   ├── Auto-ingest docs/field-notes/ into kb/raw/
│   └── ProfileFact extraction from field notes
└── Data Products Layer (new concept)
    ├── DWSDataProduct schema (TypeScript interface)
    ├── Agent output → auto-generate data product descriptor
    └── Export Adapter (future: GC-KC format push)
```

### Phase 0 — Foundation (this session)

| Deliverable                     | File                                                                     | Status            |
| ------------------------------- | ------------------------------------------------------------------------ | ----------------- |
| Field note (this document)      | `docs/field-notes/2026-05-04-google-cloud-knowledge-catalog-analysis.md` | Done              |
| ONTOLOGY.md §15 — GC-KC mapping | `ONTOLOGY.md` (v1.4)                                                     | Done this session |

### Phase 1 — Knowledge Catalog Agent (Q2 2026, Sprint 1)

**Goal:** Unified metadata search across all five stores.

**File:** `src/agents/knowledge-catalog.agent.ts`

**Operations:**

- `kc_search(query: string, types?: MetadataType[])` → ranked results from all five stores
- `kc_list_data_products()` → all registered DWS data products
- `kc_get_context(topic: string)` → aggregated context package for an agent about to execute

**CLI:** `dws knowledge-catalog search --query "EU ETS carbon price 2025"`

**MCP tool:** `knowledge_catalog_search` → JSON array of ranked results with source, confidence, type

**Supabase view:** `knowledge_catalog_search_v` — union of `semantic_memories` + `article12_audit_log` + product metadata, exposed via `hybrid_memory_search()` extension

**Acceptance criteria:**

- Single RPC returns results from ≥3 metadata stores ranked by relevance
- Sub-500ms for standard queries
- All results include: `source`, `confidence`, `type`, `excerpt`, `ontology_tags`

### Phase 2 — Auto-Enrichment (Q2 2026, Sprint 2)

**Goal:** KB enriches itself from agent activity.

**Changes to `kb.agent.ts`:**

- `kb_ingest_field_note(path: string)` — auto-move new `docs/field-notes/*.md` to `kb/raw/field-notes/`
- `kb_compile_from_logs()` — scan `logs/` for successful agent queries → extract verified patterns → write to `kb/wiki/verified-patterns/`

**New daily script:** `scripts/daily/kb-auto-enrich.ts`

- Runs at 04:00 UTC via DGX Spark day-runner
- Ingests field notes created in last 24h
- Compiles KB if raw count > wiki count by >5 articles

**Acceptance criteria:**

- Field notes auto-appear in `kb/raw/field-notes/` within 24h of creation
- KB healthScore in `kb.json` auto-updates after each enrichment run

### Phase 3 — Data Products Formal Concept (Q3 2026)

**Goal:** Every agent output is a typed, governed data product.

**New TypeScript interface (`src/agents/data-product.types.ts`):**

```typescript
interface DWSDataProduct {
  id: string; // kebab-case, stable
  name: string; // human display name
  producingAgent: string; // agent name that creates this
  outputSchema: JSONSchema; // declared output shape
  sla: {
    confidenceFloor: number; // minimum acceptable confidence (0-1)
    maxLatencyMs: number; // SLA latency ceiling
    freshnessMaxAgeMs: number; // staleness limit
  };
  governance: {
    allowedConsumerAgents: string[]; // which agents may use this output
    regulationIds: string[]; // regulations this satisfies
    dataResidency: "EU" | "EU+US"; // sovereignty declaration
  };
  ontologyAnchors: string[]; // ONTOLOGY.md entity IDs this relates to
  lineage: {
    memoryIds: string[]; // semantic_memories this depends on
    kbArticles: string[]; // KB wiki articles consulted
  };
}
```

**Acceptance criteria:**

- At least 5 existing agents register a DWSDataProduct descriptor
- `dws knowledge-catalog list-data-products` returns JSON array

### Phase 4 — GC-KC Export Adapter (Q4 2026, customer-optional)

**Goal:** Enterprise customers on Google Cloud can see DWS data products in their GC-KC instance.

**File:** `src/integrations/google/knowledge-catalog-export.ts`

**Behavior:**

- Maps `DWSDataProduct` → GC-KC Data Product API format
- Pushes to customer's GCP project (customer provides credentials — never stored in DWS)
- Dry-run mode by default (requires `--send` flag, same pattern as `send-price-list-email.ts`)
- Logs every export to `logs/gckc-export-audit.jsonl`

**Sovereignty check:** Only metadata descriptors are exported. No raw data, no embeddings, no agent logs.

---

## 7. Strategic Positioning

### Why DWS Knowledge Catalog, not GC-KC?

| Dimension             | GC-KC                        | DWS Knowledge Catalog                        |
| --------------------- | ---------------------------- | -------------------------------------------- |
| Data residency        | Google Cloud (US-controlled) | EU-sovereign (Finland/Germany)               |
| CLOUD Act exposure    | Yes                          | No                                           |
| Underlying data store | BigQuery / Spanner           | PostgreSQL / Supabase                        |
| Regulatory native     | Generic                      | EU AI Act, GDPR, ETS, CBAM, CSRD pre-modeled |
| Agent architecture    | Gemini-centric               | Multi-model (Claude, Gemini, Groq, Ollama)   |
| Enrichment model      | Gemini auto-extract          | LLM-maintained KB (Karpathy-inspired)        |
| Cost model            | GCP consumption              | Fixed EU infrastructure                      |
| Gaia-X compatible     | No                           | Tier-3 path                                  |

DWS Knowledge Catalog is the **Gaia-X native, EU AI Act compliant, regulation-first** answer to GC-KC. The addressable market: EU industrial enterprises that cannot or will not run on US hyperscalers.

---

## 8. Action Items

| #   | Action                                                | Owner       | Sprint |
| --- | ----------------------------------------------------- | ----------- | ------ |
| 1   | ONTOLOGY.md §15 (GC-KC mapping)                       | Claude Code | Done   |
| 2   | `knowledge-catalog.agent.ts` scaffold                 | Claude Code | Q2 S1  |
| 3   | Supabase migration: `knowledge_catalog_search_v` view | Claude Code | Q2 S1  |
| 4   | CLI command: `dws knowledge-catalog`                  | Claude Code | Q2 S1  |
| 5   | MCP tool: `knowledge_catalog_search`                  | Claude Code | Q2 S1  |
| 6   | `kb-auto-enrich.ts` daily script                      | Claude Code | Q2 S2  |
| 7   | `data-product.types.ts` + 5 agent descriptors         | Claude Code | Q3     |
| 8   | GC-KC export adapter (dry-run)                        | Claude Code | Q4     |
| 9   | Add `/knowledge-catalog` skill to `.claude/commands/` | Claude Code | Q2 S1  |

---

---

# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:

- Version: 1.0 | Tool: Claude Code (claude-sonnet-4-6) | Session: claude/knowledge-catalog-research-J207A | Date: 04.05.2026 | Changes: Initial creation. Full analysis of Google Cloud Knowledge Catalog, DWS gap analysis, ontology mapping, connector decision, and DWS Knowledge Catalog v0.1 implementation plan.

---
