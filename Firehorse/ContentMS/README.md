# Firehorse ContentMS — Evidence Vault

***
# VERSION AND AGENT HISTORY

Version: 4.0

Sessions & Modifications:
  - Version: 4.0 | Tool: Claude Code (Opus 4.6) | Session: claude/build-contentms-mvp-Q2nU9 | Date: 23.03.2026 | Changes: Persistent memory (Supabase + fallback), HIL review workflow, audit trail, Blog & Legal content types, artifact publisher (blog → onelifetime.world/posts/, legal → onelifetime.world/legal/), 18 MCP tools, 45 tests
  - Version: 3.0 | Tool: Claude Code (Opus 4.6) | Session: claude/build-contentms-mvp-Q2nU9 | Date: 22.03.2026 | Changes: Rebuild as customer-facing Evidence Vault with Learning. 5 AI agents, secure sharing, expiration tracking, auto-classification, 32 tests.
  - Version: 2.0 | Tool: Claude Code (Opus 4.6) | Session: claude/build-contentms-mvp-Q2nU9 | Date: 22.03.2026 | Changes: MVP implementation — TypeScript service with CRUD, blog publisher, digest generator, REST API, MCP tools, Zod schemas, Vitest tests
  - Version: 1.0 | Tool: Claude Code | Session: N/A (pre-session-tracking) | Date: 27.12.2025 | Changes: Initial README — directory structure and content guidelines

Session Links & References:
  - Claude Code (claude/build-contentms-mvp-Q2nU9): https://github.com/blogtheristo/dws6/commits/claude/build-contentms-mvp-Q2nU9

Document Status:
  - Created: 27.12.2025
  - Last Modified: 23.03.2026
  - Language: English
  - Publication Status: ACTIVE

***

> **Status: SHIPPED** — TypeScript service at `src/contentms/` with 11 modules, 22 API routes at `/api/v1/content`, 18 MCP tools, 5 AI agents (Document Classifier, Expiration Tracker, Search, Access Controller, Archive Manager), HIL review workflow, artifact publisher, Supabase persistence with in-memory fallback. Wired into `src/app.ts` line 258. See `src/__tests__/contentms.test.ts` for 45 tests.

## Overview

Firehorse ContentMS is the **Evidence Vault** for enterprise customers. It stores compliance documents, tracks certificate expiry, enables natural language search, manages secure sharing with auditors, and publishes internal learning content for the customer's team.

**Product ID:** FH-CMS-001 | **Price:** EUR 2,999 | **Category:** Platform

## The 5 Content Agents

| # | Agent | What it does | API |
|---|-------|-------------|-----|
| 1 | **Document Classifier** | Auto-tags uploads by regulation (EU ETS, CBAM, CSRD, ISO, EPD, etc.) | Runs on `POST /api/v1/content` |
| 2 | **Expiration Tracker** | Finds certificates expiring within N days, sends alerts | `GET /api/v1/content/expiring` |
| 3 | **Search Agent** | Natural language search across all documents | `GET /api/v1/content/search` |
| 4 | **Access Controller** | Secure temporary share links for auditors/stakeholders | `POST /api/v1/content/:id/share` |
| 5 | **Archive Manager** | Stats, retention policies, lifecycle management | `GET /api/v1/content/stats` |

## Content Types

| Type | Description | Example |
|------|-------------|---------|
| `document` | Compliance certificates, audit reports, permits, contracts | ISO 14001 cert, CSRD audit report |
| `certificate` | Certificates with expiry dates and issuer tracking | Renewable energy GO, EPD, ISO cert |
| `report` | Generated reports (carbon, compliance, annual) | Q3 Carbon Report, CSRD disclosure |
| `learning` | Internal blog/knowledge articles for customer's team | Safety training guide, onboarding |
| `template` | Reusable document templates | Audit checklist template |
| `blog` | Blog posts published to onelifetime.world/posts/ | EU AI Act article, compliance guide |
| `legal` | Legal documents (privacy, terms, NDA) | Privacy Policy, Terms of Service |

## Architecture

```
src/contentms/                 # TypeScript service
├── types.ts                   # Zod schemas, enums, TypeScript types
├── service.ts                 # CRUD + 5 agents (Supabase-backed memory)
├── memory.ts                  # Persistent store (Supabase + in-memory fallback)
├── audit.ts                   # Audit trail + HIL review workflow
├── artifact-publisher.ts      # Blog/Legal → HTML artifact publisher
├── blog-publisher.ts          # Learning article → HTML renderer
├── digest.ts                  # Evidence Vault digest (expiring + recent)
├── routes.ts                  # Express REST API (22 endpoints)
├── mcp-tools.ts               # MCP tool definitions (18 tools)
└── index.ts                   # Public exports

src/__tests__/contentms.test.ts  # 45 Vitest tests
```

## Content Status Workflow

```
Draft → Review → [HIL Gate] → Approved → Published → Archived
  ↑       ↓         ↓                        ↓
  └───────┘    (reject→Draft)     Draft ←── Archived
```

### Human-in-the-Loop (HIL) Review

Content must pass through a human review gate before artifact publishing:

1. **Request review** — `POST /:id/hil/request` (creates audit entry)
2. **Approve** — `POST /:id/hil/approve` (unlocks artifact publish, transitions to Approved)
3. **Reject** — `POST /:id/hil/reject` (sends back to Draft with notes)

All actions are immutable audit entries. Pending reviews queryable via `GET /hil/pending`.

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/v1/content` | List content (filterable by type, status, org, tags) |
| GET | `/api/v1/content/stats` | Dashboard stats (by_type, by_status, expiring_soon) |
| GET | `/api/v1/content/search?q=...&organization_id=...` | Search Agent — natural language search |
| GET | `/api/v1/content/expiring?organization_id=...&days=30` | Expiration Tracker — expiring certificates |
| GET | `/api/v1/content/learning?organization_id=...` | Published learning articles |
| GET | `/api/v1/content/shared/:token` | Access shared document via temporary link |
| GET | `/api/v1/content/:id` | Get content item |
| POST | `/api/v1/content` | Upload/create (Document Classifier auto-tags) |
| PATCH | `/api/v1/content/:id` | Update (re-classifies if content changes) |
| POST | `/api/v1/content/:id/transition` | Change status |
| POST | `/api/v1/content/:id/publish` | Publish learning article |
| POST | `/api/v1/content/:id/share` | Generate secure share link |
| POST | `/api/v1/content/digest` | Generate Evidence Vault digest |
| POST | `/api/v1/content/digest/send` | Send digest via email |
| GET | `/api/v1/content/hil/pending` | List pending HIL reviews |
| GET | `/api/v1/content/hil/stats` | Audit statistics |
| GET | `/api/v1/content/:id/audit` | Full audit trail for content item |
| POST | `/api/v1/content/:id/hil/request` | Request human review |
| POST | `/api/v1/content/:id/hil/approve` | Approve after review (unlocks artifacts) |
| POST | `/api/v1/content/:id/hil/reject` | Reject (back to draft) |
| POST | `/api/v1/content/:id/artifact/publish` | Publish as blog or legal artifact |

## MCP Tools (18)

| Tool | Agent | Description |
|------|-------|-------------|
| `contentms_upload` | Classifier | Upload document, auto-tag by regulation |
| `contentms_expiring` | Tracker | Find certificates expiring within N days |
| `contentms_search` | Search | Natural language search |
| `contentms_share` | Access | Generate secure temporary link |
| `contentms_stats` | Archive | Dashboard statistics |
| `contentms_transition` | Archive | Change document status |
| `contentms_list` | — | List/filter content |
| `contentms_get` | — | Get by ID |
| `contentms_update` | — | Update content (re-classifies) |
| `contentms_publish_learning` | — | Publish learning article |
| `contentms_digest` | — | Generate evidence digest |
| `contentms_hil_request` | HIL | Request human review |
| `contentms_hil_approve` | HIL | Approve content after review |
| `contentms_hil_reject` | HIL | Reject content (back to draft) |
| `contentms_hil_pending` | HIL | List pending reviews |
| `contentms_audit_trail` | Audit | Get full audit trail for item |
| `contentms_publish_artifact` | Artifact | Publish blog/legal to site (requires HIL) |

## Auto-Classification Tags

The Document Classifier detects these regulations via keyword matching (MVP) or LLM classification (production):

| Tag | Regulation / Standard |
|-----|----------------------|
| `eu-ets` | EU Emissions Trading System |
| `cbam` | Carbon Border Adjustment Mechanism |
| `csrd` | Corporate Sustainability Reporting Directive |
| `iso-14001` | Environmental Management |
| `iso-27001` | Information Security |
| `iso-45001` | Occupational Health & Safety |
| `en-15978` | Lifecycle Assessment / Embodied Carbon |
| `scope-1/2/3` | GHG Protocol emission scopes |
| `epd` | Environmental Product Declaration |
| `renewable-energy` | Guarantee of Origin certificates |
| `safety` | Construction safety, EN 13001 |
| `gdpr` | EU General Data Protection |
| `eu-ai-act` | EU AI Act compliance |

## Customer Categories

| Category | Topics |
|----------|--------|
| `compliance` | CSRD, ETS, CBAM, Fit for 55 |
| `sustainability` | Carbon, energy, waste, circular economy |
| `safety` | Construction safety, EN 13001, PPE |
| `operations` | Logistics, manufacturing, procurement |
| `training` | Employee education, onboarding |
| `quality` | ISO, testing, inspection |

## Visibility Levels

| Level | Who can see |
|-------|------------|
| `private` | Only the uploader |
| `team` | Customer's organization (default) |
| `shared_link` | Anyone with a temporary link (auditors) |
| `internal` | Published to customer's learning portal |

## CLI Usage

```bash
# Upload a document
dws run contentms --input '{"action":"upload","type":"certificate","title":"ISO 14001"}'

# Find expiring certificates
dws run contentms --input '{"action":"expiring","organization_id":"org-001","within_days":30}'

# Search evidence vault
dws run contentms --input '{"action":"search","query":"renewable energy Q3"}'

# Get stats
dws run contentms --input '{"action":"stats","organization_id":"org-001"}'
```

## Evidence Vault Digest

Weekly/daily digest emails for customers:
- Certificates expiring soon (with urgency color coding)
- Recently uploaded documents
- Summary statistics

**Send:** `POST /api/v1/content/digest/send` with `{ to, organization_id, period, language }`

## Development

```bash
# Run tests (45 tests)
npm run test -- src/__tests__/contentms.test.ts

# Start dev server (routes auto-mounted at /api/v1/content)
npm run dev
```

## Integration Points

| System | Integration |
|--------|------------|
| **Supabase** | PostgreSQL storage + pgvector semantic search (persistent memory) |
| **Email Service** | Amazon SES (SMTP) digest delivery — Resend banned per LD-2026-008 |
| **MCP Hub** | 18 tools discoverable via tools/list |
| **DWS IQ Dashboard** | Evidence Vault widget (stats, expiring, recent) |
| **onelifetime.world** | Blog posts → /posts/, Legal docs → /legal/ (via artifact publisher) |

## Persistent Memory

ContentMS uses Supabase for persistent storage with automatic in-memory fallback:

- **Supabase mode:** Data persisted to `contentms_items` table, survives restarts
- **Fallback mode:** In-memory Map when `SUPABASE_URL`/`SUPABASE_SERVICE_ROLE_KEY` missing
- **Hybrid:** Always keeps in-memory cache for fast reads, writes to both stores
- **Hydrate:** On startup, loads all items from Supabase into memory

## Audit Trail

Every content action is logged as an immutable audit entry:

| Action | When |
|--------|------|
| `created` | New content uploaded |
| `updated` | Content modified |
| `status_changed` | Workflow transition |
| `published` | Learning article published |
| `shared` | Share link created |
| `hil_review_requested` | Human review requested |
| `hil_approved` | Human approved content |
| `hil_rejected` | Human rejected (back to draft) |
| `artifact_published` | Blog/legal artifact written to site |

---

**Code Version**: 3.0.0
**Last Updated**: March 23, 2026
