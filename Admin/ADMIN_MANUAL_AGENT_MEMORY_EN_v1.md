# Admin Manual: Agent Memory System

**DWS IQ 6/7 — Agent Memory Fact Extraction & Recall**

***
# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:
  - Version: 1.0 | Tool: Claude Code (Opus 4.6) | Session: claude/agent-memory-fact-extraction-gLEss | Date: 23.03.2026 | Changes: Initial creation — Agent memory system documentation covering fact extraction pipeline, dual memory architecture, MCP tools, PR roadmap, KYA governance integration

Session Links & References:
  - View on GitHub: https://github.com/blogtheristo/dws6/blob/main/Admin/ADMIN_MANUAL_AGENT_MEMORY_EN_v1.md

Document Status:
  - Created: 23.03.2026
  - Last Modified: 23.03.2026
  - Language: English
  - Publication Status: ACTIVE

***

## Table of Contents

1. [Overview](#1-overview)
2. [Architecture](#2-architecture)
3. [Fact Extraction Pipeline](#3-fact-extraction-pipeline)
4. [Memory Types & Schema](#4-memory-types--schema)
5. [MCP & Agent Tools](#5-mcp--agent-tools)
6. [KYA Governance Integration](#6-kya-governance-integration)
7. [PR Roadmap](#7-pr-roadmap)
8. [Operations & Monitoring](#8-operations--monitoring)
9. [Troubleshooting](#9-troubleshooting)
10. [Related Documentation](#10-related-documentation)

---

## 1. Overview

The Agent Memory System enables DWS IQ agents to learn from conversations, store structured facts, and recall relevant knowledge across sessions. It implements the non-parametric memory path from the EMPO² framework (arXiv:2602.23008).

**Key files:**

| File | Purpose |
|------|---------|
| `src/agents/memory.types.ts` | Type definitions (MemoryItem, ExtractedFact, etc.) |
| `src/agents/memory.service.ts` | Core service: store, recall, forget, profile |
| `src/agents/fact-extraction.service.ts` | LLM-based fact extraction pipeline |
| `src/agents/tools.ts` | Built-in tool definitions + handlers |
| `src/mcp/agent-server.ts` | MCP tool exposure for external ADEs |
| `src/agents/base.agent.ts` | BaseAgent with `this.memory` integration |
| `supabase/migrations/047_hybrid_memory_search.sql` | Hybrid search SQL function |

---

## 2. Architecture

### 2.1 Dual Memory Model

| Layer | Knowledge Type | Source | Persistence |
|-------|---------------|--------|-------------|
| **LWM (Lifetime World Model)** | Domain knowledge | EU regulations, emission factors, industry models | Parametric (fine-tuned) + RAG (pgvector) |
| **Client Memory** | Relationship knowledge | Conversations, emails, meetings | Non-parametric (semantic_memories table) |

LWM provides *what agents know about the world*. Client memory provides *what agents know about this specific customer*.

### 2.2 Memory Flow

```
Agent conversation
  ↓
Fact Extraction (LLM)
  ↓
Structured facts (subject-predicate-value)
  ↓
Duplicate detection (cosine similarity >0.95)
  ↓
Store in semantic_memories (pgvector embedding)
  ↓
Available for recall via hybrid search
  ↓
Injected into agent context on next interaction
```

### 2.3 Brain-Memory-Body-Hands Mapping

| Architecture Layer | Memory Component |
|-------------------|-----------------|
| **Brain** (DWS IQ 6) | Fact extraction LLM, recall search |
| **Memory** (LWM) | semantic_memories table, pgvector embeddings |
| **Body** (Firehorse) | State machine acting on extracted facts |
| **Hands** (Fleet) | ERP connector data feeding memory |

---

## 3. Fact Extraction Pipeline

### 3.1 How It Works

The `FactExtractionService` extracts structured facts from unstructured text:

1. **Input:** Text string (conversation, document, email)
2. **LLM Call:** Claude Haiku with structured extraction prompt
3. **Output:** Array of `{subject, predicate, value, confidence, category}`
4. **Filtering:** Facts below confidence threshold (default 0.7) are skipped
5. **Dedup:** Cosine similarity check against existing memories (>0.95 = duplicate)
6. **Persist:** Stored as `fact` type in `semantic_memories` table

### 3.2 Fact Categories

| Category | Description | Examples |
|----------|-------------|---------|
| `identity` | Name, location, industry, role | "ACME is in Helsinki" |
| `preference` | Likes, preferred tools, communication style | "prefers weekly reports" |
| `relationship` | Partnerships, team links, client-vendor | "works with Siemens" |
| `metric` | Numbers, KPIs, revenue, headcount | "250 employees" |
| `status` | Current state, progress, phase | "in pilot phase" |
| `other` | Anything else | Catch-all |

### 3.3 Confidence Scoring

| Score | Meaning |
|-------|---------|
| 1.0 | Explicitly stated in text |
| 0.8 | Strongly implied |
| 0.6 | Loosely implied |
| < 0.7 | Not persisted (below default threshold) |

### 3.4 Extraction Prompt

The LLM receives a system prompt that enforces:
- Only explicit facts (never inferred or guessed)
- Snake_case predicates for machine readability
- JSON array output (no markdown, no explanation)
- Six categories with strict definitions

---

## 4. Memory Types & Schema

### 4.1 Supported Memory Types

| Type | Use Case | Typical Source |
|------|----------|---------------|
| `preference` | Customer preferences | Conversations |
| `knowledge` | General domain knowledge | Documents, manuals |
| `procedure` | How-to steps, workflows | Agent learning |
| `episode` | Interaction records | Agent sessions |
| `fact` | Structured facts (SPV triples) | Fact extraction |
| `profile` | Aggregated entity profiles | Profile builder |

### 4.2 Database Table

Table: `semantic_memories` (Supabase PostgreSQL)

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary key |
| `content` | text | Memory content |
| `memory_type` | text | One of the 6 types above |
| `customer_id` | uuid | Optional customer scope |
| `org_id` | text | Tenant isolation (required) |
| `embedding` | vector(1536) | text-embedding-3-small |
| `metadata` | jsonb | Structured data (subject, predicate, value for facts) |
| `confidence` | float | 0-1 confidence score |
| `source` | text | Origin identifier |
| `access_count` | int | Times recalled |
| `accessed_at` | timestamptz | Last recall time |
| `created_at` | timestamptz | Creation time |
| `expired_at` | timestamptz | Soft-delete marker |
| `superseded_by` | uuid | Contradiction resolution link |

### 4.3 Hybrid Search

The `hybrid_memory_search` SQL function combines:
- **Vector search** (cosine similarity via pgvector, weight: 0.7)
- **Text search** (pg_trgm trigram matching, weight: 0.3)

Results are RLS-filtered by `org_id` for tenant isolation.

---

## 5. MCP & Agent Tools

### 5.1 Built-in Agent Tools (tools.ts)

| Tool | Description |
|------|-------------|
| `memory_store` | Store a memory with embedding |
| `memory_recall` | Hybrid search for memories |
| `memory_forget` | Soft-delete a memory |
| `extract_facts` | Extract structured facts from text |

### 5.2 MCP Tools (agent-server.ts)

| Tool | Description |
|------|-------------|
| `dws_memory_store` | Store via MCP |
| `dws_memory_recall` | Search via MCP |
| `dws_memory_forget` | Forget via MCP |
| `dws_memory_profile` | Get entity profile via MCP |
| `dws_extract_facts` | Extract facts via MCP |

### 5.3 Using from BaseAgent

All agents extending `BaseAgent` have access to `this.memory`:

```typescript
// In any agent's execute() method:
const result = await this.memory.store({
  content: 'Customer prefers weekly reports',
  memoryType: 'fact',
  orgId: context.orgId,
  metadata: { subject: 'customer', predicate: 'prefers', value: 'weekly reports' },
});

const recalled = await this.memory.recall({
  query: 'customer report preferences',
  orgId: context.orgId,
  memoryType: 'fact',
});
```

---

## 6. KYA Governance Integration

### 6.1 Current State

KYA Standard versions:
- **Internal:** v1.4 (`Legal/KYA_OPTIMIZATION_v1.4.md`, `Lifetime Fleet/Fleet Admiral/KYA_STANDARD_v1.4_MANIFEST.md`)
- **Public:** v1.1 (`dws10.com/kya-standard/`)

### 6.2 Memory Audit Requirements

Every memory mutation MUST be audit-logged for EU compliance:

| Operation | Required Audit Fields |
|-----------|----------------------|
| Store | agent_id, timestamp, source, confidence, org_id |
| Supersede | old_memory_id, new_memory_id, reason, agent_id, timestamp |
| Forget | memory_id, reason, agent_id, timestamp |
| Extract | source_text_hash, facts_count, agent_id, timestamp |

### 6.3 KYA Memory Audit Trail (Planned)

The KYA governance wrapper will provide:
- Court-defensible provenance: "fact A replaced fact B at timestamp X, approved by agent Y"
- CSRD compliance: audit trail for AI-generated ESG data
- EU AI Act Article 12: logging of automated decisions affecting natural persons
- Integration with Firehorse signed reports

---

## 7. PR Roadmap

Production ordering (KYA-first):

| Priority | PR | Feature | Status | Dependencies |
|----------|-----|---------|--------|-------------|
| 1 | 254 | Fact Extraction | ✅ Shipped | — |
| 2 | 255 | Contradiction Resolution | Planned | Memory store |
| 3 | — | KYA Memory Audit Trail | Planned | Contradiction resolution |
| 4 | 257 | Decay Scoring | Planned | Independent |
| 5 | 256 | Consolidation Cron | Planned | Decay scoring |
| 6 | 259 | Connector Sync | Planned | Stable memory API |
| 7 | 258 | Supermemory MCP Self-Host EU | Planned | Infrastructure |

### 7.1 Why KYA Before Decay/Consolidation

Contradiction resolution (PR-255) without KYA attestation means resolving conflicts in memory with no audit trail for *why* one fact superseded another. For EU compliance audits (CSRD, EU AI Act Article 12), every memory decision needs provenance. KYA wraps that decision before we automate decay and consolidation.

---

## 8. Operations & Monitoring

### 8.1 Cache

The MemoryService uses an LRU cache:
- Max size: 1000 entries
- TTL: 5 minutes
- Invalidated on store/forget operations for the affected org

### 8.2 Embedding Generation

- Provider: OpenAI `text-embedding-3-small` (1536 dimensions)
- API key: `OPENAI_API_KEY` environment variable
- Fallback: text-only search (pg_trgm) if no API key

### 8.3 Performance Targets

| Operation | Target |
|-----------|--------|
| Recall (cached) | < 5ms |
| Recall (hybrid search) | < 200ms |
| Store (with embedding) | < 500ms |
| Fact extraction | < 3s (depends on LLM) |
| Profile build | < 50ms (cached) |

---

## 9. Troubleshooting

| Problem | Check |
|---------|-------|
| No embeddings generated | Verify `OPENAI_API_KEY` is set |
| Hybrid search returns empty | Check `SUPABASE_URL` and `SUPABASE_SERVICE_KEY` |
| Facts not persisting | Check confidence threshold (default 0.7) |
| Duplicate detection too aggressive | Adjust similarity threshold (default 0.95) |
| Cache stale data | Cache TTL is 5 min; call `cache.invalidate(orgId)` |
| MCP tools not showing | Verify agent-server.ts is mounted at `/mcp` |

---

## 10. Related Documentation

| Document | Scope |
|----------|-------|
| `docs/architecture/05-GROUNDING-MEMORY.md` | Memory architecture overview |
| `docs/supermemory.md` | Supermemory research & self-hosting |
| `docs/AGENT_DEVELOPMENT_GUIDE.md` | How to build agents |
| `AGENTS.md` | Agent ecosystem reference |
| `DWS7_ROADMAP.md` | Section 4.5 Agent Memory System |
| `Legal/KYA_STANDARD_v1.md` | KYA governance standard |
| `Legal/KYA_OPTIMIZATION_v1.4.md` | KYA v1.4 optimizations |
| `Admin/ADMIN_MANUAL_SUPABASE_EN_v1.md` | Database management |
| `DWS_SECURITY_STANDARD.md` | Security requirements |

---

*Document footer: Admin Manual Agent Memory System v1.0 | Lifetime Oy | 23.03.2026 | DWS IQ 6/7*
