# DWS6 Document Index

***

# VERSION AND AGENT HISTORY

Version: 2.0

Sessions & Modifications:

- Version: 2.0 | Tool: Claude Code (Sonnet 4.6) | Session: claude/fix-document-delimiters-wVtR8 | Date: 28.04.2026 | Changes: Migrated VERSION AND AGENT HISTORY block delimiters from --- to \*\*\* per DWS_DOCUMENT_STANDARD.md §2.1 (Pandoc compatibility); --- is misinterpreted as YAML frontmatter by Pandoc and breaks PDF generation
- Version: 1.9 | Tool: GitHub Copilot CLI (GPT-5.3-Codex) | Session: current | Date: 24.04.2026 | Changes: Updated admin payment documentation index for Revolut + Stripe + Google Merchant payment process refresh
- Version: 1.8 | Tool: GitHub Copilot CLI (GPT-5.3-Codex) | Session: current | Date: 22.04.2026 | Changes: Added missing index entries for local-first CI audit docs (`docs/CI_AUDIT.md`), external audit manual, and CI hygiene field note; refreshed metadata
- Version: 1.7 | Tool: GitHub Copilot CLI (GPT-5.3-Codex) | Session: current | Date: 21.04.2026 | Changes: Added DWS Standards Library and Vesala standards field note entries; synced index metadata for standards/web-content governance updates
- Version: 1.6 | Tool: GitHub Copilot CLI (GPT-5.4) | Session: current | Date: 18.04.2026 | Changes: Added MCP CLI Index field note entry, refreshed field note count, and linked current MCP/CLI package split into the repository index
- Version: 1.5 | Tool: Claude Code (Opus 4.6) | Session: claude/connect-kya-dws-cli-0MMIB | Date: 10.04.2026 | Changes: Catch-up index refresh covering ~127 merge commits from 2026-03-11 through 2026-04-10. Added DWS CLI (`cli/`), LLM Knowledge Base (`kb/` + `src/agents/kb.agent.ts`), `/kya` and `/kb` slash commands, DWS Skills Guide (`docs/DWS_SKILLS_GUIDE.md`), ADMIN*MANUAL Sections 28–33 (Carbon Balance Sheet, DGX Spark, Safety Hooks, External Repos, GitHub Actions & Cron Registry, DWS CLI Operator Reference), Shufti Pro DPA artifacts and IDV integration, PHD Firehorse thesis track (EN/FI), Aspire observability research, Legal/KYA*\* contracts, 2026-03/04 field notes, OneLifetime blog posts (KYA Standard v1, harness engineering investor note, EU sovereignty, validated mock data principle). Updated DWS_SECURITY_STANDARD §18.6 (KYA Control Surfaces), DWS_DATA_STANDARD §4.3 (kb/ classification), Admin/SECURITY_COMPLIANCE (Destructive Action Inventory).
- Version: 1.4 | Tool: Claude Code (Opus 4.6) | Session: claude/dsaas-cli-first-strategy-ePRaw | Date: 13.03.2026 | Changes: Added DSaaS CLI-First Strategy document to Standards & Guidelines section
- Version: 1.2 | Tool: Claude Code | Date: 11.03.2026 | Changes: Added Acer Veriton GN100 admin manual and three GN100 field notes to the document index
  Version: 1.3

Sessions & Modifications:

- Version: 1.3 | Tool: Claude Code (Opus 4.6) | Session: claude/implement-mvp-features-D2e9d | Date: 08.03.2026 | Changes: Added Authentication, Outreach, Climate Assistant & Agent System sections from older feature audit
- Version: 1.2 | Tool: Claude Code (Opus 4.6) | Session: claude/implement-mvp-features-D2e9d | Date: 07.03.2026 | Changes: Added Compliance Engine section with new source files; updated Architecture Docs with middleware files; added MVP Feature List to Miscellaneous
- Version: 1.0 | Tool: Claude Code (Claude Opus 4.5) | Session: claude/update-docs-qwen3-coder-FFGgN | Date: 04.02.2026 | Changes: Initial creation - comprehensive document index for faster search
- Version: 1.1 | Tool: Claude Code (Opus 4.6) | Session: claude/research-dws-brand-standard-Rm8Jw | Date: 07.02.2026 | Changes: Added last-modified dates, scripts section, sync tracking info

Session Links & References:

- Claude Code (claude/update-docs-qwen3-coder-FFGgN): https://github.com/blogtheristo/dws6
- Claude Code (claude/research-dws-brand-standard-Rm8Jw): https://github.com/blogtheristo/dws6/commits/claude/research-dws-brand-standard-Rm8Jw
- View on GitHub: https://github.com/blogtheristo/dws6/blob/main/docs/Document-index.md

Document Status:

- Created: 04.02.2026
- Last Modified: 28.04.2026
- Language: English
- Languages Available: English
- Publication Status: ACTIVE

***

## Purpose

Centralized index of all documentation in the DWS6 repository for faster search and discovery. This index enables:

- Quick navigation to specific documents
- Status tracking across all documentation
- Identification of gaps and outdated content
- Support for localization planning

---

## Quick Navigation

| Category                                         | Count | Description                                  |
| ------------------------------------------------ | ----- | -------------------------------------------- |
| [Admin Manuals](#admin-manuals)                  | 8     | System administration and deployment guides  |
| [Architecture](#architecture-docs)               | 12    | Technical architecture blueprints            |
| [Field Notes](#field-notes)                      | 13    | LWM knowledge capture from real-world events |
| [Firehorse Product](#firehorse-product)          | 35+   | Product suite documentation                  |
| [Standards & Guidelines](#standards--guidelines) | 10+   | Coding and documentation standards           |
| [Security](#security)                            | 5+    | Security policies and compliance             |
| [Agent Documentation](#agent-documentation)      | 10+   | AI agent tracking and coordination           |
| [Deployment & DevOps](#deployment--devops)       | 15+   | CI/CD, Docker, Cloudflare guides             |
| [Thesis & Academic](#thesis--academic)           | 10+   | Metropolia master thesis documents           |
| [Configuration](#configuration)                  | 10+   | Environment and setup guides                 |

---

## Admin Manuals

System administration and deployment guides. All admin manuals are in `Admin/` folder.

| Document              | Path                                                  | Status   | Last Modified | Description                                                            |
| --------------------- | ----------------------------------------------------- | -------- | ------------- | ---------------------------------------------------------------------- |
| Admin Manual (main)   | `/Admin/ADMIN_MANUAL.md`                              | ACTIVE   | 2026-02-07    | Master admin manual (v2.1)                                             |
| Authentication Manual | `/Admin/ADMIN_MANUAL_AUTHENTICATION.md`               | ACTIVE   | 2026-02-06    | Supabase auth setup                                                    |
| Dashboard V8 Manual   | `/Admin/ADMIN_MANUAL_DASHBOARD_V8_EN_v1.md`           | ACTIVE   | 2026-02-06    | Dashboard v8 guide                                                     |
| Supabase Manual       | `/Admin/ADMIN_MANUAL_SUPABASE_EN_v1.md`               | ACTIVE   | 2026-02-06    | Supabase configuration                                                 |
| Gaps Analysis         | `/Admin/ADMIN_MANUAL_GAPS_ANALYSIS.md`                | ACTIVE   | 2026-02-06    | Documentation gap analysis                                             |
| DWS6.com Manual       | `/Admin/ADMIN_MANUAL_DWS6_COM.md`                     | ACTIVE   | 2026-02-06    | Main site deployment                                                   |
| DWS10 Store Payments  | `/Admin/ADMIN_MANUAL_DWS10_STORE_PAYMENTS.md`         | ACTIVE   | 2026-04-24    | Revolut + Stripe hybrid process, Google Merchant feed/payment ops      |
| Testing Manual        | `/Admin/ADMIN_MANUAL_TESTING.md`                      | ACTIVE   | 2026-02-06    | Testing procedures                                                     |
| Files & Folders       | `/Admin/ADMIN_MANUAL_FILES_AND_FOLDERS.md`            | ACTIVE   | 2026-02-06    | Repo structure guide                                                   |
| Security Compliance   | `/Admin/SECURITY_COMPLIANCE.md`                       | ACTIVE   | 2026-02-06    | Security & compliance                                                  |
| Security Testing      | `/Admin/Security/ADMIN_MANUAL_SECURITY_TESTING.md`    | ACTIVE   | 2026-02-06    | Security test procedures                                               |
| Security Monitoring   | `/Admin/Security/ADMIN_MANUAL_SECURITY_MONITORING.md` | ACTIVE   | 2026-02-06    | Monitoring setup                                                       |
| Acer Veriton GN100    | `/Admin/Acer-Veriton-GN100/README.md`                 | ACTIVE   | 2026-03-11    | GN100 edge AI device admin manual and runtime notes                    |
| Audit Manual          | `/Admin/ADMIN_MANUAL_AUDIT.md`                        | ACTIVE   | 2026-04-22    | External auditor manual for local-first CI + tamper-evident audit logs |
| Documentation Audit   | `/ADMIN_DOCUMENTATION_AUDIT_2026-01-11.md`            | ARCHIVED | 2026-01-11    | 2026-01 audit results                                                  |
| Auth Setup Guide      | `/docs/AUTH_SETUP_GUIDE.md`                           | ACTIVE   | -             | Authentication setup                                                   |

---

## Architecture Docs

Technical architecture blueprints for DWS IQ 6 multi-agent system.

| Document                  | Path                                              | Status | Description                   |
| ------------------------- | ------------------------------------------------- | ------ | ----------------------------- |
| 00 Master Blueprint       | `/docs/architecture/00-MASTER-BLUEPRINT.md`       | ACTIVE | System overview               |
| 01 Agent Discovery        | `/docs/architecture/01-AGENT-DISCOVERY.md`        | ACTIVE | Agent identification patterns |
| 02 Cognitive Architecture | `/docs/architecture/02-COGNITIVE-ARCHITECTURE.md` | ACTIVE | AI reasoning framework        |
| 03 Orchestration Layer    | `/docs/architecture/03-ORCHESTRATION-LAYER.md`    | ACTIVE | Multi-agent coordination      |
| 04 Tool Architecture      | `/docs/architecture/04-TOOL-ARCHITECTURE.md`      | ACTIVE | MCP tools design              |
| 05 Grounding Memory       | `/docs/architecture/05-GROUNDING-MEMORY.md`       | ACTIVE | LWM memory system             |
| 06 Prompt Engineering     | `/docs/architecture/06-PROMPT-ENGINEERING.md`     | ACTIVE | Prompt design patterns        |
| 07 Implementation         | `/docs/architecture/07-IMPLEMENTATION.md`         | ACTIVE | Implementation guide          |
| 08 Testing                | `/docs/architecture/08-TESTING.md`                | ACTIVE | Testing strategy              |
| 09 Production Deployment  | `/docs/architecture/09-PRODUCTION-DEPLOYMENT.md`  | ACTIVE | Production rollout            |
| 10 Delivery Launch        | `/docs/architecture/10-DELIVERY-LAUNCH.md`        | ACTIVE | Launch procedures             |
| Summary                   | `/docs/architecture/SUMMARY.md`                   | ACTIVE | Architecture summary          |

### Compliance Engine (MVP — added 07.03.2026)

| Document              | Path                                                | Status | Description                                        |
| --------------------- | --------------------------------------------------- | ------ | -------------------------------------------------- |
| ESRS Registry         | `/src/compliance/esrs-registry.ts`                  | ACTIVE | 82 ESRS disclosure requirements (E1-E5, S1-S4, G1) |
| Scoring Engine        | `/src/compliance/scoring-engine.ts`                 | ACTIVE | CSRD/ETS/CBAM deterministic scoring logic          |
| Report Generator      | `/src/compliance/report-generator.ts`               | ACTIVE | Structured JSON compliance reports                 |
| Compliance API Routes | `/src/routes/compliance.routes.ts`                  | ACTIVE | POST /assess, GET /registry endpoints              |
| CSRD Data Model       | `/supabase/migrations/042_csrd_compliance_data.sql` | ACTIVE | Compliance profiles, ESRS data points, assessments |
| Scoring Tests         | `/src/__tests__/compliance-scoring.test.ts`         | ACTIVE | 14 unit tests for scoring engine                   |

### Backend Middleware (MVP — added 07.03.2026)

| Document           | Path                                | Status | Description                                    |
| ------------------ | ----------------------------------- | ------ | ---------------------------------------------- |
| Error Handler      | `/src/middleware/error-handler.ts`  | ACTIVE | Centralized error handling with AppError class |
| Request Validation | `/src/middleware/validate.ts`       | ACTIVE | Zod schema validation middleware               |
| Correlation ID     | `/src/middleware/correlation-id.ts` | ACTIVE | Request tracing middleware                     |
| Env Validation     | `/src/config/validate-env.ts`       | ACTIVE | Startup environment validation                 |

### Dashboard Resilience (MVP — added 07.03.2026)

| Document         | Path                                                   | Status | Description                  |
| ---------------- | ------------------------------------------------------ | ------ | ---------------------------- |
| Error Boundary   | `/dws6.com/dashboard/.../components/ErrorBoundary.tsx` | ACTIVE | Per-section error isolation  |
| Skeleton Loaders | `/dws6.com/dashboard/.../components/Skeleton.tsx`      | ACTIVE | Loading state components     |
| Empty States     | `/dws6.com/dashboard/.../components/EmptyState.tsx`    | ACTIVE | No-data guidance components  |
| API Hook         | `/dws6.com/dashboard/.../hooks/useApi.ts`              | ACTIVE | Centralized fetch with retry |

### Authentication System (Pre-MVP — audited 08.03.2026)

| Document              | Path                                             | Status | Description                                                         |
| --------------------- | ------------------------------------------------ | ------ | ------------------------------------------------------------------- |
| Auth Routes           | `/src/routes/auth.routes.ts`                     | ACTIVE | Register, login, logout, refresh, verify-email, forgot-password     |
| Auth Service          | `/src/services/auth.service.ts`                  | ACTIVE | JWT generation, bcrypt hashing, token blacklist (Redis + in-memory) |
| Auth Middleware       | `/src/middleware/auth.middleware.ts`             | ACTIVE | authenticateToken, requireRole, requireOrgAdmin, loginRateLimit     |
| Redis Token Blacklist | `/src/services/redis-token-blacklist.service.ts` | ACTIVE | Redis-backed token revocation                                       |
| Auth DB Migration     | `/supabase/migrations/007_auth_users_orgs.sql`   | ACTIVE | user_profiles, organizations, org_members, sessions + RLS           |
| JWT Security Tests    | `/src/__tests__/jwt-validation-security.test.ts` | ACTIVE | 7 tests for token validation                                        |

### Outreach & Sales Pipeline (Pre-MVP — refactored 08.03.2026)

| Document            | Path                                                 | Status | Description                                  |
| ------------------- | ---------------------------------------------------- | ------ | -------------------------------------------- |
| Outreach Inbound    | `/src/routes/outreach.routes.ts`                     | ACTIVE | Lead intake API (Supabase SDK)               |
| Outreach Quick-Send | `/src/routes/outreach-send.routes.ts`                | ACTIVE | Prospect email send (Supabase SDK)           |
| Daily Digest        | `/src/outreach/daily-digest.ts`                      | ACTIVE | Aggregated outreach activity digest          |
| Reply Parser        | `/src/outreach/reply-parser.ts`                      | ACTIVE | Email reply intent extraction                |
| Prospect Templates  | `/src/outreach/prospect-email-templates.ts`          | ACTIVE | Cold, followup, consultative email templates |
| Outreach Tests      | `/src/__tests__/sales-outreach-input-compat.test.ts` | ACTIVE | Input normalization tests                    |

### Climate Assistant & AI Agent System (Pre-MVP — audited 08.03.2026)

| Document                  | Path                                                  | Status | Description                                                           |
| ------------------------- | ----------------------------------------------------- | ------ | --------------------------------------------------------------------- |
| Climate Assistant Routes  | `/src/routes/climate-assistant.routes.ts`             | ACTIVE | Chat API with Groq LLM, rate limiting                                 |
| Climate Assistant Service | `/src/services/climate-assistant.service.ts`          | ACTIVE | LLM chat processing, health check, usage stats                        |
| Base Agent                | `/src/agents/base.agent.ts`                           | ACTIVE | Abstract agent with agentic loop, multi-provider LLM, governance      |
| Agent Types               | `/src/agents/types.ts`                                | ACTIVE | AgentContext, AgentResponse, ToolDefinition types                     |
| LLM Client                | `/src/agents/llm-client.ts`                           | ACTIVE | Multi-provider (Anthropic, Groq, OpenAI-compatible)                   |
| Agent Routes              | `/src/agents/routes.ts`                               | ACTIVE | Discovery + execution HTTP routes for 21 agents                       |
| Agent Tools               | `/src/agents/tools.ts`                                | ACTIVE | Built-in tool library (query_database, emit_event, delegate_to_agent) |
| Gated Auth Tests          | `/src/__tests__/climate-assistant-gated-auth.test.ts` | ACTIVE | 10 authentication tests                                               |

---

## Field Notes

LWM knowledge capture from real-world events - raw sensory input for the Lifetime World Model.

| Document                           | Path                                                                              | Date       | Topic                                                                                    | Ontology Tags                                         |
| ---------------------------------- | --------------------------------------------------------------------------------- | ---------- | ---------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| Karp Enterprise AI                 | `/docs/field-notes/2026-01-21-karp-enterprise-ai-ontology.md`                     | 2026-01-21 | Palantir CEO insights                                                                    | Strategy, AI, Ontology                                |
| Dashboard V9 Stack                 | `/docs/field-notes/2026-01-22-dashboard-v9-technical-stack.md`                    | 2026-01-22 | Technical stack analysis                                                                 | Technology, React, Vite                               |
| Design System Audit                | `/docs/field-notes/2026-01-23-design-system-audit-navigation-gaps.md`             | 2026-01-23 | UI/UX audit                                                                              | Design, Navigation, Gaps                              |
| AI Robotics Webinar                | `/docs/field-notes/2026-01-27-apply-ai-robotics-manufacturing-webinar.md`         | 2026-01-27 | Manufacturing AI                                                                         | Manufacturing, Robotics                               |
| EU Tech Sovereignty                | `/docs/field-notes/2026-01-28-eu-tech-stack-sovereignty-positioning.md`           | 2026-01-28 | EU data sovereignty                                                                      | Compliance, EU, Strategy                              |
| FIGBC Working Group                | `/docs/field-notes/2026-01-30-figbc-working-group-recruitment.md`                 | 2026-01-30 | FIGBC recruitment                                                                        | Construction, Finland                                 |
| Qwen3-Coder LLM                    | `/docs/field-notes/2026-02-04-qwen3-coder-next-agentic-llm.md`                    | 2026-02-04 | Qwen3 coding agent                                                                       | LLM, Agentic, Local Dev                               |
| Agent Teams vs Subagents           | `/docs/field-notes/2026-02-05-claude-code-agent-teams-vs-subagents.md`            | 2026-02-05 | Claude Code parallel work                                                                | Multi-Agent, Teams, Subagents                         |
| AI Safety Report 2026              | `/docs/field-notes/2026-02-06-ai-safety-report-2026-field-note.md`                | 2026-02-06 | AI safety research analysis                                                              | AI Safety, Risk, Compliance                           |
| Brockman Agentic Software          | `/docs/field-notes/2026-02-06-brockman-agentic-software-development.md`           | 2026-02-06 | Agentic dev insights                                                                     | Agentic, Software Dev, Strategy                       |
| EU Alden Biesen Single Market      | `/docs/field-notes/2026-02-11-eu-alden-biesen-single-market-info-note.md`         | 2026-02-11 | EU single market retreat                                                                 | EU, Single Market, Policy                             |
| Obsidian CLI + Claude Code         | `/docs/field-notes/2026-04-22-obsidian-cli-claude-code-integration.md`            | 2026-04-22 | CLI vault access benchmarks                                                              | Obsidian, CLI, Knowledge Mgmt                         |
| Research Agent Architecture        | `/docs/field-notes/2026-04-22-research-agent-architecture-lifetime-scope.md`      | 2026-04-22 | 5-capability system design                                                               | Multi-Agent, Content, PhD, Research                   |
| Field Notes README                 | `/docs/field-notes/README.md`                                                     | -          | Guidelines                                                                               | -                                                     |
| Document                           | Path                                                                              | Date       | Topic                                                                                    | Ontology Tags                                         |
| ---------------------------------- | --------------------------------------------------------------------------------- | ---------- | ---------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| Karp Enterprise AI                 | `/docs/field-notes/2026-01-21-karp-enterprise-ai-ontology.md`                     | 2026-01-21 | Palantir CEO insights                                                                    | Strategy, AI, Ontology                                |
| Dashboard V9 Stack                 | `/docs/field-notes/2026-01-22-dashboard-v9-technical-stack.md`                    | 2026-01-22 | Technical stack analysis                                                                 | Technology, React, Vite                               |
| Design System Audit                | `/docs/field-notes/2026-01-23-design-system-audit-navigation-gaps.md`             | 2026-01-23 | UI/UX audit                                                                              | Design, Navigation, Gaps                              |
| AI Robotics Webinar                | `/docs/field-notes/2026-01-27-apply-ai-robotics-manufacturing-webinar.md`         | 2026-01-27 | Manufacturing AI                                                                         | Manufacturing, Robotics                               |
| EU Tech Sovereignty                | `/docs/field-notes/2026-01-28-eu-tech-stack-sovereignty-positioning.md`           | 2026-01-28 | EU data sovereignty                                                                      | Compliance, EU, Strategy                              |
| FIGBC Working Group                | `/docs/field-notes/2026-01-30-figbc-working-group-recruitment.md`                 | 2026-01-30 | FIGBC recruitment                                                                        | Construction, Finland                                 |
| Qwen3-Coder LLM                    | `/docs/field-notes/2026-02-04-qwen3-coder-next-agentic-llm.md`                    | 2026-02-04 | Qwen3 coding agent                                                                       | LLM, Agentic, Local Dev                               |
| Agent Teams vs Subagents           | `/docs/field-notes/2026-02-05-claude-code-agent-teams-vs-subagents.md`            | 2026-02-05 | Claude Code parallel work                                                                | Multi-Agent, Teams, Subagents                         |
| AI Safety Report 2026              | `/docs/field-notes/2026-02-06-ai-safety-report-2026-field-note.md`                | 2026-02-06 | International AI safety report                                                           | AI Safety, Regulation                                 |
| Brockman Agentic Dev               | `/docs/field-notes/2026-02-06-brockman-agentic-software-development.md`           | 2026-02-06 | Retooling teams for agentic software                                                     | Agentic, Teams, Strategy                              |
| EU Alden Biesen Single Market      | `/docs/field-notes/2026-02-11-eu-alden-biesen-single-market-info-note.md`         | 2026-02-11 | EU single market as superpower                                                           | EU, Single Market, Policy                             |
| Unsloth MoE Fine-Tuning            | `/docs/field-notes/2026-02-13-unsloth-moe-fine-tuning-split-lora.md`              | 2026-02-13 | 12x faster MoE fine-tuning with Split LoRA                                               | LLM, Fine-Tuning, MoE                                 |
| MCP CLI Index                      | `/docs/field-notes/mcp-cli-index.md`                                              | 2026-04-18 | Current MCP/CLI split across Win11, DGX, and remote surfaces                             | MCP, CLI, DGX, Win11, Supabase                        |
| Moltworker OpenClaw Assistant      | `/docs/field-notes/2026-02-15-moltworker-openclaw-dws-assistant.md`               | 2026-02-15 | Self-hosted AI agent for DWS                                                             | OpenClaw, Agent, Self-Hosted                          |
| Tech Backlog PyJWT Conflict        | `/docs/field-notes/2026-02-15-tech-backlog-pyjwt-redis-conflict.md`               | 2026-02-15 | PyJWT dependency conflict                                                                | Python, Dependencies, Backlog                         |
| NVIDIA Blackwell Ultra             | `/docs/field-notes/2026-02-16-nvidia-blackwell-ultra-agentic-ai-inference.md`     | 2026-02-16 | 50x agentic AI inference                                                                 | NVIDIA, Blackwell, Inference                          |
| Zvec Embedded Vector DB            | `/docs/field-notes/2026-02-16-zvec-embedded-vector-db-european-alternatives.md`   | 2026-02-16 | EU vector DB for sensors and robots                                                      | Vector DB, EU, IoT                                    |
| Morning Email 0600 Incident        | `/docs/field-notes/2026-02-17-morning-email-0600-eest-incident.md`                | 2026-02-17 | CEO cockpit email failures and fix                                                       | Email, Incident, SES                                  |
| Claude Code Hetzner Incident       | `/docs/field-notes/2026-02-21-claude-code-hetzner-branch-incident.md`             | 2026-02-21 | Allow-once branch incident                                                               | Security, Incident, Claude Code                       |
| Security Vulnerability Assessment  | `/docs/field-notes/2026-02-21-security-vulnerability-assessment-openclaw-dws6.md` | 2026-02-21 | OpenClaw security audit findings                                                         | Security, CORS, Shell, MCP                            |
| MCP Server Expansion               | `/docs/field-notes/2026-02-23-mcp-server-expansion-cloudrun-lwm-claude.md`        | 2026-02-23 | CloudRun, LWM, Claude session sync                                                       | MCP, CloudRun, LWM                                    |
| GN100 NVIDIA GPG Key Fix           | `/docs/field-notes/2026-02-27-acer-veriton-gn100-nvidia-gpg-key-fix.md`           | 2026-02-27 | NVIDIA Workbench repo key renewal                                                        | GN100, NVIDIA, Maintenance                            |
| GN100 Ollama Dev Environment       | `/docs/field-notes/2026-03-01-veriton-gn100-ollama-dev-environment.md`            | 2026-03-01 | Ollama, Cursor, Cline, Claude Code setup                                                 | GN100, Ollama, Local Dev                              |
| Grok LWM Planning                  | `/docs/field-notes/2026-03-04-grok-advice-lwm-planning-multi-tool.md`             | 2026-03-04 | LWM planning phase and multi-tool workflow                                               | LWM, Grok, Planning                                   |
| DGX Spark Hardened Firewall        | `/docs/field-notes/2026-03-06-dgx-spark-hardened-firewall-ollama-ssh.md`          | 2026-03-06 | Firewall hardening, rejecting SSH/Ollama                                                 | DGX Spark, Security, Firewall                         |
| EU AI Act Omnibus Article 12       | `/docs/field-notes/2026-03-08-eu-ai-act-omnibus-optimus-v3-article-12.md`         | 2026-03-08 | Robot industry vs Article 12 compliance                                                  | EU AI Act, Robotics, Compliance                       |
| NVIDIA Connect ISV Approved        | `/docs/field-notes/2026-03-08-nvidia-connect-isv-approved.md`                     | 2026-03-08 | NVIDIA ISV program application approved                                                  | NVIDIA, Partner, ISV                                  |
| Shufti KYA BYO Partner             | `/docs/field-notes/2026-03-09-shufti-kya-byo-partner-access.md`                   | 2026-03-09 | KYA and Bring Your Own framework                                                         | Shufti, KYA, Partnership                              |
| Shufti KYA Technical Reqs          | `/docs/field-notes/2026-03-09-shufti-kya-technical-requirements.md`               | 2026-03-09 | KYA technical requirements for Shufti                                                    | Shufti, KYA, Technical                                |
| Acer-DGX Sandbox Strategy          | `/docs/field-notes/2026-03-10-acer-dgx-sandbox-strategy.md`                       | 2026-03-10 | Zero-budget AI powerhouse strategy                                                       | DGX Spark, Strategy, Hardware                         |
| Grok/Gemini 35% Uplift Validation  | `/docs/field-notes/2026-03-10-grok-gemini-35pct-uplift-validation.md`             | 2026-03-10 | KYA leash-aware uplift claim                                                             | KYA, Validation, Grok                                 |
| Grok/Gemini KYA Review Input       | `/docs/field-notes/2026-03-10-grok-gemini-kya-review-input.md`                    | 2026-03-10 | KYA standard review input                                                                | KYA, Review, Grok, Gemini                             |
| Karpathy Autoresearch              | `/docs/field-notes/2026-03-10-karpathy-autoresearch-nanochat-agent-swarm.md`      | 2026-03-10 | Agent swarms tuning neural networks                                                      | Autoresearch, Agent Swarm, Karpathy                   |
| KYA Financial Projections          | `/docs/field-notes/2026-03-10-kya-financial-projections.md`                       | 2026-03-10 | 20-industry value model                                                                  | KYA, Financial, Projections                           |
| NIST KYA Review Input              | `/docs/field-notes/2026-03-10-nist-kya-grok-gemini-review-input.md`               | 2026-03-10 | NIST submission review                                                                   | KYA, NIST, Review                                     |
| Palantir AIP Partner Outreach      | `/docs/field-notes/2026-03-10-palantir-aip-partner-outreach.md`                   | 2026-03-10 | Partner outreach and connector strategy                                                  | Palantir, AIP, Partnership                            |
| SES DKIM Setup                     | `/docs/field-notes/2026-03-10-ses-dkim-setup-success.md`                          | 2026-03-10 | Amazon SES DKIM for onelifetime.world                                                    | SES, DKIM, Email                                      |
| V1 Aiven Plan Decision             | `/docs/field-notes/2026-03-10-v1-aiven-plan-decision.md`                          | 2026-03-10 | Developer + Startup plan decision                                                        | Aiven, Database, Decision                             |
| GN100 Docker CUDA Validation       | `/docs/field-notes/2026-03-11-veriton-gn100-docker-cuda-validation.md`            | 2026-03-11 | Docker GPU validation and ARM64 container policy                                         | GN100, Docker, CUDA, ARM64                            |
| Postgres Columnar HTAP             | `/docs/field-notes/2026-03-12-postgres-columnar-htap-evaluation.md`               | 2026-03-12 | Columnar and HTAP extension evaluation                                                   | PostgreSQL, Columnar, HTAP                            |
| GN100 Edge PostgreSQL Setup        | `/docs/field-notes/2026-03-13-acer-gn100-edge-postgres-setup.md`                  | 2026-03-13 | TimescaleDB + pg_duckdb + pgvector                                                       | GN100, PostgreSQL, Edge                               |
| DWS Autoresearch Methodology       | `/docs/field-notes/2026-03-13-dws-autoresearch-methodology.md`                    | 2026-03-13 | Karpathy-inspired autonomous validation                                                  | Autoresearch, Methodology                             |
| Agent Browser Native Rust          | `/docs/field-notes/2026-03-14-agent-browser-native-rust-integration.md`           | 2026-03-14 | Native Rust browser integration                                                          | Agent, Browser, Rust                                  |
| OpenClaw Autoresearch Feature Plan | `/docs/field-notes/2026-03-14-openclaw-autoresearch-dws-feature-plan.md`          | 2026-03-14 | DWS 6 and 7 feature plan                                                                 | OpenClaw, Autoresearch, Roadmap                       |
| Investor Materials Audit           | `/docs/field-notes/2026-03-15-investor-materials-audit.md`                        | 2026-03-15 | State of play and MVP feature prompts                                                    | Investor, Audit, MVP                                  |
| NVIDIA GTC 2026 Keynote            | `/docs/field-notes/2026-03-16-nvidia-gtc-2026-keynote-dws-impact.md`              | 2026-03-16 | DWS architecture impact assessment                                                       | NVIDIA, GTC, Architecture                             |
| Pentesting Plan DWS6               | `/docs/field-notes/2026-03-16-pentesting-plan-dws6.md`                            | 2026-03-16 | Full platform penetration testing plan                                                   | Security, Pentesting                                  |
| Shufti EU Compliance DPA           | `/docs/field-notes/2026-03-17-shufti-eu-compliance-dpa-inquiry.md`                | 2026-03-17 | EU compliance and DPA inquiry                                                            | Shufti, GDPR, DPA                                     |
| DocuSign eSignature Integration    | `/docs/field-notes/2026-03-21-docusign-esignature-integration.md`                 | 2026-03-21 | DocuSign developer setup and NDA flow                                                    | DocuSign, NDA, Legal                                  |
| TED eProcurement Lead Sourcing     | `/docs/field-notes/2026-03-21-ted-eprocurement-ontology-lead-sourcing.md`         | 2026-03-21 | Construction lead sourcing via TED                                                       | TED, eProcurement, Leads                              |
| LWM Phase 2 Gap Analysis           | `/docs/field-notes/2026-03-25-lwm-phase2-technical-gap-analysis.md`               | 2026-03-25 | From regulatory intelligence to latent planning                                          | LWM, Gap Analysis, Planning                           |
| Aegis Pricing Study                | `/docs/field-notes/2026-03-26-aegis-pricing-study.md`                             | 2026-03-26 | Pricing study for Aegis                                                                  | Pricing, Aegis, Strategy                              |
| Best Local Models by RAM Tier      | `/docs/field-notes/2026-03-26-best-local-models-by-ram-tier.md`                   | 2026-03-26 | Model recommendations per RAM tier                                                       | LLM, Models, Hardware                                 |
| CLI for Agents Design Patterns     | `/docs/field-notes/2026-03-26-cli-for-agents-design-patterns.md`                  | 2026-03-26 | CLI design patterns for AI agents                                                        | CLI, Agents, Design                                   |
| Post-Incident CLI-First Migration  | `/docs/field-notes/2026-03-26-post-incident-cli-first-migration.md`               | 2026-03-26 | Security reset and CLI-first migration                                                   | Security, Incident, CLI                               |
| SharpSync CAD-ERP BOM              | `/docs/field-notes/2026-03-26-sharpsync-cad-erp-bom-integration.md`               | 2026-03-26 | CAD-to-ERP BOM synchronization                                                           | SharpSync, CAD, ERP, BOM                              |
| DGX Spark Primary Runtime Setup    | `/docs/field-notes/2026-03-29-dgx-spark-primary-runtime-setup.md`                 | 2026-03-29 | DGX Spark 24/7 runtime architecture, failover, model routing                             | GN100, DGX Spark, Infrastructure, Ollama              |
| Shufti DPA Haris Escalation        | `/docs/field-notes/2026-04-01-shufti-dpa-haris-escalation.md`                     | 2026-04-01 | Haris escalated DPA to Shufti Legal/Compliance                                           | Shufti, DPA, GDPR, Partnership                        |
| Siemens Synthetic-Data Wedge       | `/docs/field-notes/2026-04-20-siemens-synthetic-data-partnership-wedge.md`        | 2026-04-20 | SI Building Nordics (Frida Ahlberg) + TechSeed pilot; NeMo DataDesigner Xcelerator wedge | Siemens, TechSeed, NVIDIA, NeMo, CSRD, EPBD, Taxonomy |
| Teemu Vesala Standards Enthusiast  | `/docs/field-notes/2026-04-19-vesala-teemu-standards-enthusiast.md`               | 2026-04-19 | Standards gap mapping for advisor pipeline and ASPICE/SQuaRE expansion                   | Standards, Advisor, ASPICE, SQuaRE, Compliance        |
| CI Hygiene Audit Baseline          | `/docs/field-notes/2026-04-22-ci-hygiene-audit.md`                                | 2026-04-22 | Baseline CI hygiene audit for local-first rollout and failure root-cause mapping         | CI, Audit, Local-First, Security                      |
| Field Notes README                 | `/docs/field-notes/README.md`                                                     | -          | Guidelines                                                                               | -                                                     |

---

## Firehorse Product

Product suite documentation for Firehorse (Reports, Automation, ContentMS, Omnichannel).

### Core Documentation

| Document            | Path                                      | Status | Description          |
| ------------------- | ----------------------------------------- | ------ | -------------------- |
| Master Index        | `/Firehorse/MASTER_INDEX.md`              | ACTIVE | Complete index       |
| Product Index       | `/Firehorse/INDEX.md`                     | ACTIVE | Product navigation   |
| Quick Start         | `/Firehorse/QUICK_START.md`               | ACTIVE | Getting started      |
| README              | `/Firehorse/README.md`                    | ACTIVE | Overview             |
| Product Catalog     | `/Firehorse/PRODUCT_CATALOG.md`           | ACTIVE | Full product list    |
| DWS IQ6 Integration | `/Firehorse/DWS_IQ6_INTEGRATION_GUIDE.md` | ACTIVE | Integration guide    |
| System Diagram      | `/Firehorse/SYSTEM_DIAGRAM.md`            | ACTIVE | Architecture diagram |

### Templates & Standards

| Document                    | Path                                        | Status | Description           |
| --------------------------- | ------------------------------------------- | ------ | --------------------- |
| Document Template Standards | `/Firehorse/DOCUMENT_TEMPLATE_STANDARDS.md` | ACTIVE | Template standards    |
| European Templates Index    | `/Firehorse/EUROPEAN_TEMPLATES_INDEX.md`    | ACTIVE | EU regional templates |
| Finnish Hero Documents      | `/Firehorse/FINNISH_HERO_DOCUMENTS.md`      | ACTIVE | Finland-specific      |
| Hero Documents Complete     | `/Firehorse/HERO_DOCUMENTS_COMPLETE.md`     | ACTIVE | All hero docs         |

### Sub-Products

| Product     | Index Path                           | Description                         |
| ----------- | ------------------------------------ | ----------------------------------- |
| Automation  | `/Firehorse/Automation/README.md`    | LinkedIn automation, Python scripts |
| ContentMS   | `/Firehorse/ContentMS/README.md`     | Content management                  |
| Control     | `/Firehorse/Control/README.md`       | Construction site control           |
| Omnichannel | `/Firehorse/Omnichannel/*/README.md` | Multi-channel outreach              |
| Report      | `/Firehorse/Report/README.md`        | Analytics and reporting             |
| Situation   | `/Firehorse/Situation/README.md`     | Situation rooms                     |

### Control Views

| View              | Path                                           | Audience       |
| ----------------- | ---------------------------------------------- | -------------- |
| Engineer View     | `/Firehorse/Control/ENGINEER_VIEW.md`          | Site engineers |
| Contractor View   | `/Firehorse/Control/CONTRACTOR_VIEW.md`        | Contractors    |
| Constructor View  | `/Firehorse/Control/CONSTRUCTOR_VIEW.md`       | Constructors   |
| Site Chief View   | `/Firehorse/Control/SITE_CHIEF_VIEW.md`        | Site managers  |
| Specialized Roles | `/Firehorse/Control/SPECIALIZED_ROLES_VIEW.md` | Specialists    |

### Situation Rooms

| View             | Path                                       | Audience      |
| ---------------- | ------------------------------------------ | ------------- |
| Board View       | `/Firehorse/Situation/BOARD_VIEW.md`       | Board members |
| Finance CXO View | `/Firehorse/Situation/FINANCE_CXO_VIEW.md` | CFO/Finance   |
| Managers View    | `/Firehorse/Situation/MANAGERS_VIEW.md`    | Management    |

---

## Standards & Guidelines

Coding, documentation, and process standards.

| Document                  | Path                                              | Status | Last Modified | Description                                                                                                                                      |
| ------------------------- | ------------------------------------------------- | ------ | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| DWS Document Standard     | `/DWS_DOCUMENT_STANDARD.md`                       | ACTIVE | 2026-02-07    | Master document standard (v1.4)                                                                                                                  |
| DWS Data Standard         | `/DWS_DATA_STANDARD.md`                           | ACTIVE | 2026-04-10    | Data storage governance, columnar/row policy, extension registry, Aiven-first mandate, §4.3 filesystem content stores (kb/) (v2.1)               |
| DWS Standards Library     | `/DWS_STANDARDS_LIBRARY.md`                       | ACTIVE | 2026-04-21    | Registry of regulatory, process, security, interoperability, and reporting standards with ownership and status                                   |
| DWS Skills Guide          | `/docs/DWS_SKILLS_GUIDE.md`                       | ACTIVE | 2026-04-22    | Complete guide to 25 skills (22 slash commands + 3 discipline skills), gstack workflow, /kya, /kb, /gh-to-mcp (v1.4)                             |
| GitHub CLI vs MCP         | `/docs/GITHUB_CLI_VS_MCP.md`                      | ACTIVE | 2026-04-22    | Translation cheatsheet: `gh` commands ↔ `mcp__github__*` tools, capability deltas, version-independence notice (v1.0)                            |
| DWS CLI README            | `/cli/README.md`                                  | ACTIVE | 2026-04-10    | Full `dws` CLI reference: agents, workflows, MCP, KYA, Knowledge Base, scenarios, piping, zero-dependency                                        |
| DSaaS CLI-First Strategy  | `/docs/DSaaS_CLI_FIRST_STRATEGY.md`               | ACTIVE | 2026-03-13    | Database Sovereignty as a Service — CLI-first mandatory gateway, 30-day build plan, enterprise pricing, Aiven ECE + TimescaleDB Hypercore (v1.0) |
| CLAUDE.md                 | `/CLAUDE.md`                                      | ACTIVE | 2026-02-05    | AI agent guidelines                                                                                                                              |
| Ontology                  | `/ONTOLOGY.md`                                    | ACTIVE | 2026-01-21    | LWM ontology framework                                                                                                                           |
| Copilot Instructions      | `/.github/copilot-instructions.md`                | ACTIVE | -             | GitHub Copilot rules                                                                                                                             |
| GitHub Copilot Guide      | `/.workflows/GITHUB_COPILOT_GUIDE.md`             | ACTIVE | -             | Copilot workflow guide                                                                                                                           |
| Ultra Agent Coordinator   | `/.workflows/agents/ULTRA_AGENT_COORDINATOR.md`   | ACTIVE | -             | Agent coordination                                                                                                                               |
| Agent Signal Instructions | `/.workflows/agents/AGENT_SIGNAL_INSTRUCTIONS.md` | ACTIVE | -             | Signal protocols                                                                                                                                 |

---

## Security

Security policies, compliance, and guidelines.

| Document              | Path                            | Status | Description          |
| --------------------- | ------------------------------- | ------ | -------------------- |
| Security Compliance   | `/Admin/SECURITY_COMPLIANCE.md` | ACTIVE | Compliance overview  |
| README Security       | `/README_SECURITY.md`           | ACTIVE | Security readme      |
| AgentFoundry Security | `/AgentFoundry/Security.md`     | ACTIVE | Agent security       |
| Argus Code Review     | `/ARGUS_CODE_REVIEW_SETUP.md`   | ACTIVE | Code review security |

---

## Agent Documentation

AI agent tracking and coordination documents.

| Document                      | Path                                      | Status | Description          |
| ----------------------------- | ----------------------------------------- | ------ | -------------------- |
| Agents Overview               | `/AGENTS.md`                              | ACTIVE | Agent inventory      |
| Agent Tracking Complete       | `/AGENT_TRACKING_COMPLETE.md`             | ACTIVE | Full tracking        |
| Agent Tracking Index          | `/AGENT_TRACKING_INDEX.md`                | ACTIVE | Tracking index       |
| Agent Tracking Implementation | `/AGENT_TRACKING_IMPLEMENTATION.md`       | ACTIVE | Implementation guide |
| Connection Status Quick Start | `/AGENT_CONNECTION_STATUS_QUICK_START.md` | ACTIVE | Quick status check   |
| Status Template               | `/AGENT_STATUS_TEMPLATE_COPY_PASTE.md`    | ACTIVE | Copy-paste template  |

---

## Deployment & DevOps

CI/CD, Docker, and cloud deployment guides.

| Document                      | Path                                      | Status | Description                                                    |
| ----------------------------- | ----------------------------------------- | ------ | -------------------------------------------------------------- |
| Domain Deployment Guide       | `/DOMAIN_DEPLOYMENT_GUIDE.md`             | ACTIVE | Domain setup                                                   |
| Cloudflare Deployment         | `/CLOUDFLARE_DEPLOYMENT.md`               | ACTIVE | Cloudflare Workers                                             |
| Cloudflare Setup Steps        | `/CLOUDFLARE_SETUP_STEPS.md`              | ACTIVE | Step-by-step                                                   |
| Cloudflare Pages Verification | `/CLOUDFLARE_PAGES_VERIFICATION.md`       | ACTIVE | Pages verification                                             |
| Cloudflare Sandbox Pilot      | `/docs/CLOUDFLARE_SANDBOX_PILOT.md`       | ACTIVE | Sandbox testing                                                |
| DWS6 Deployment Plan          | `/DWS6_DEPLOYMENT_PLAN.md`                | ACTIVE | Deployment plan                                                |
| DWS6 Troubleshooting          | `/DWS6_DEPLOYMENT_TROUBLESHOOTING.md`     | ACTIVE | Troubleshooting                                                |
| Google Cloud Run Setup        | `/AgentFoundry/GOOGLE_CLOUD_RUN_SETUP.md` | ACTIVE | GCR deployment                                                 |
| AgentFoundry Deployment       | `/AgentFoundry/DEPLOYMENT_GUIDE.md`       | ACTIVE | Agent deployment                                               |
| Backup Procedures             | `/BACKUP_PROCEDURES.md`                   | ACTIVE | Backup strategy                                                |
| GitHub Workflows README       | `/.github/workflows/README.md`            | ACTIVE | CI/CD workflows                                                |
| Local-First CI Audit Guide    | `/docs/CI_AUDIT.md`                       | ACTIVE | Local CI runner, hash-chain verifier, and Supabase audit model |

---

## Thesis & Academic

Metropolia master thesis documentation.

| Document                    | Path                                          | Language | Status |
| --------------------------- | --------------------------------------------- | -------- | ------ |
| Multi-Agent Coordination EN | `/docs/thesis/MULTI_AGENT_COORDINATION_EN.md` | EN       | ACTIVE |
| Multi-Agent Coordination FI | `/docs/thesis/MULTI_AGENT_COORDINATION_FI.md` | FI       | ACTIVE |
| Thesis README               | `/docs/thesis/README.md`                      | EN       | ACTIVE |
| Master Thesis (EN)          | `/docs/metropolia/master-thesis/en/*.md`      | EN       | ACTIVE |
| Master Thesis (FI)          | `/docs/metropolia/master-thesis/fi/*.md`      | FI       | ACTIVE |

---

## R&D Activation / Tuotekehitysmenojen aktivointi (Learn/)

Lifetime Oy:n tuotekehitysmenojen aktivointi KPL 5:8 — dokumentaatio kirjanpitäjälle. Kaikki tiedostot `Learn/`-kansiossa. Aktivointi €594 000 (hallituksen päätös 31.12.2025, kirjattu 10.04.2026).

| Document                         | Path                                                    | Language | Status   | Description                                                                  |
| -------------------------------- | ------------------------------------------------------- | -------- | -------- | ---------------------------------------------------------------------------- |
| Oppimispäiväkirja v2.3           | `Learn/Oppimispäiväkirja.md`                            | FI       | ACTIVE   | Pääasiakirja — aikajana 2018-2026, 30+ vahvistettu lähde, evidenssipohja     |
| F — Toimituspaketti Merjalle     | `Learn/F_Dual_Version_Activation_Package.md`            | FI       | ACTIVE   | Virallinen 2-kirjauksen toimituspaketti kirjanpitäjälle (€100k + €494k)      |
| E — CSV-skeema 2018-2024         | `Learn/E_Yearly_Activation_CSV_Schema.md`               | FI       | ACTIVE   | Käänteiskirjaus-metodologia, vuosittaiset CSV-templaatit, eläkerekisteridata |
| 012f — DWS 3 projektiasiakirja   | `Learn/012f_Lifetime_Digital_Workspace_3_DWS3.md`       | FI       | DRAFT    | DWS 3 (AWS) projekti 2020-2023                                               |
| 019 — DD Report 2020 tiivistelmä | `Learn/019_LT_DueDiligence_CleanReport_2020_summary.md` | FI       | ACTIVE   | Due Diligence Clean Report 23.03.2020 faktat                                 |
| D — Konsultin käsikirja          | `Learn/D_Konsultin_Kasikirja.md`                        | FI       | ACTIVE   | Konsultin käsikirja v0.22a (22.02.2022) projektiasiakirja                    |
| B — Pre-Firehorse tuotteet       | `Learn/B_Pre_Firehorse_Digital_Products.md`             | FI       | DRAFT    | Esi-Firehorse digitaaliset tuotteet kandidaattilista                         |
| CSV-templaatit 2018-2024         | `Learn/data/activation/billing-{2018..2024}.csv`        | —        | TEMPLATE | 7 vuosittaista CSV-templaattia R&D-päivien rekonstruktioon                   |

---

## Configuration

Environment and setup configuration guides.

| Document                 | Path                                     | Status   | Description           |
| ------------------------ | ---------------------------------------- | -------- | --------------------- |
| ENV Checklist            | `/.ENV_CHECKLIST.md`                     | ACTIVE   | Environment checklist |
| ENV Config Options       | `/.ENV_CONFIG_OPTIONS.md`                | ACTIVE   | All config options    |
| ENV Setup Guide MVP      | `/.ENV_SETUP_GUIDE_MVP.md`               | ACTIVE   | MVP setup             |
| ENV MCP Protection Plan  | `/.ENV_MCP_PROTECTION_PLAN.md`           | ACTIVE   | MCP security          |
| ENV MCP Recovery Summary | `/ENV_MCP_AND_GAMMA_RECOVERY_SUMMARY.md` | ARCHIVED | Recovery notes        |

---

## Industry Documentation

Industry-specific documentation for 25+ EU industries.

| Document               | Path                | Status | Description            |
| ---------------------- | ------------------- | ------ | ---------------------- |
| 16 Industries Overview | `/16-INDUSTRIES.md` | ACTIVE | Full industry coverage |
| 8 Industries Summary   | `/8-industries.md`  | ACTIVE | Core industries        |

---

## Scripts & Automation

PowerShell/Bash automation scripts with version tracking.

| Script             | Path                               | Version | Last Modified | Description                                  |
| ------------------ | ---------------------------------- | ------- | ------------- | -------------------------------------------- |
| Startup Daily Sync | `/scripts/Startup-DailySync.bat`   | v1.4    | 2026-02-07    | Login trigger: pull + sync + docs + Supabase |
| Sync to Proton     | `/scripts/Sync-ToProton.ps1`       | v1.4    | 2026-02-07    | Proton Drive sync (folders, secrets)         |
| Generate PDFs      | `/scripts/Generate-PDFs.ps1`       | v1.5    | 2026-02-07    | Markdown to HTML/PDF (pandoc)                |
| Install Startup    | `/scripts/Install-StartupSync.ps1` | v1.1    | 2026-02-07    | Creates Startup shortcut                     |
| Sync to Supabase   | `/scripts/Sync-ToSupabase.ps1`     | v1.2    | 2026-02-07    | EU cloud backup                              |

---

## Sales & Marketing

Sales materials and marketing documentation.

| Document                 | Path                                                         | Status | Last Modified | Description               |
| ------------------------ | ------------------------------------------------------------ | ------ | ------------- | ------------------------- |
| Enterprise Sales         | `/sales-outreach/enterprise-sales.md`                        | ACTIVE | 2026-01-06    | Enterprise sales playbook |
| Sales AI Agent           | `/sales-outreach/SALES_AI_AGENT_DESIGN_FI_v1.md`             | ACTIVE | 2026-01-06    | AI agent sales design     |
| Sales Manifesto Q1 2026  | `/DWS_IQ_6_SALES_MANIFESTO_Q1_2026.md`                       | ACTIVE | -             | Q1 sales strategy         |
| Campaign Summary         | `/CAMPAIGN_SUMMARY.md`                                       | ACTIVE | -             | Marketing campaigns       |
| Investor Memo            | `/investor-outreach/INVESTOR_MEMO.md`                        | ACTIVE | 2026-01-18    | Investor pitch            |
| Investor Pitch Deck      | `/investor-outreach/investor-pitch-deck.md`                  | ACTIVE | 2026-01-06    | Pitch deck                |
| Investor PD v3           | `/investor-outreach/V3-DWS-IQ6-InvestorPD_2026.md`           | ACTIVE | 2026-01-06    | Investor presentation     |
| Investor Profiles        | `/Firehorse/Omnichannel/Investors/DWS6_INVESTOR_PROFILES.md` | ACTIVE | -             | Target investors          |
| Outreach Workflow        | `/Firehorse/Omnichannel/Investors/OUTREACH_WORKFLOW.md`      | ACTIVE | -             | Sales workflow            |
| Firehorse Sales Workflow | `/FIREHORSE_SALES_WORKFLOW.md`                               | ACTIVE | -             | Product sales             |
| App Store Strategy       | `/APP_STORE_STRATEGY.md`                                     | ACTIVE | -             | Distribution plan         |

---

## Reports & Evaluations

Evaluation reports and weekly summaries.

| Document                           | Path                                                     | Status   | Description      |
| ---------------------------------- | -------------------------------------------------------- | -------- | ---------------- |
| TypeScript React AI SDK Evaluation | `/docs/evaluation/typescript-react-ai-sdk-evaluation.md` | ACTIVE   | SDK evaluation   |
| Weekly Report 2026-W01             | `/docs/Reports/en/Weekly_Report_2026-W01.md`             | ARCHIVED | Week 1 report    |
| Work Summary 2025-12-28            | `/COMPREHENSIVE_WORK_SUMMARY_2025-12-28.md`              | ARCHIVED | Dec 2025 summary |
| Documentation Update 2025-12-30    | `/DOCUMENTATION_UPDATE_SUMMARY_2025-12-30.md`            | ARCHIVED | Dec 2025 docs    |
| Session Index 2026-01-11           | `/DOCUMENTATION_INDEX_SESSION_2026-01-11.md`             | ARCHIVED | Jan 2026 session |

---

## MCP (Model Context Protocol)

MCP server and orchestration documentation.

| Document                | Path                         | Status | Description              |
| ----------------------- | ---------------------------- | ------ | ------------------------ |
| MCP Configuration Guide | `/docs/MCP_CONFIGURATION.md` | ACTIVE | Complete MCP setup guide |
| MCP Hub                 | `/mcp-hub/`                  | ACTIVE | MCP orchestration        |
| MCP Servers             | `/mcp-servers/`              | ACTIVE | Individual servers       |

---

## Miscellaneous

Other important documentation.

| Document                         | Path                                        | Status | Description                                                      |
| -------------------------------- | ------------------------------------------- | ------ | ---------------------------------------------------------------- |
| V1 LWM                           | `/V1_LWM.md`                                | ACTIVE | LWM version 1 spec                                               |
| V2 Firehorse                     | `/V2_Firehorse.md`                          | ACTIVE | Firehorse v2 spec                                                |
| Executive Summary                | `/EXECUTIVE_SUMMARY.md`                     | ACTIVE | Project summary                                                  |
| Exit Playbook                    | `/docs/EXIT_PLAYBOOK.md`                    | ACTIVE | Exit procedures                                                  |
| MVP Feature List                 | `/docs/MVP_FEATURE_LIST_V1.md`              | ACTIVE | Root-cause MVP analysis                                          |
| Implementation Tracker           | `/docs/IMPLEMENTATION_TRACKER.md`           | ACTIVE | Progress tracking                                                |
| Skills Required                  | `/docs/SKILLS_REQUIRED.md`                  | ACTIVE | Team skills                                                      |
| ERP Integrations                 | `/docs/ERP_INTEGRATIONS.md`                 | ACTIVE | SAP, IFS, Dynamics                                               |
| Trust System 2026                | `/FIELD_NOTE_TRUST_SYSTEM_2026.md`          | ACTIVE | Trust framework                                                  |
| NVIDIA Inception                 | `/docs/NVIDIA_INCEPTION_IMPROVEMENTS.md`    | ACTIVE | NVIDIA program                                                   |
| Create PR Instructions           | `/CREATE_PR_INSTRUCTIONS.md`                | ACTIVE | PR workflow                                                      |
| Ollama (Cloud & Local)           | `/docs/Ollama.md`                           | ACTIVE | Ollama cloud (NVIDIA B300), local edge, OpenClaw integration     |
| DEFINE Application Guide         | `/docs/DEFINE_APPLICATION_GUIDE.md`         | ACTIVE | DEFINE Accelerator & Defence Tech Hub guide                      |
| DEFINE Fundraising Study Note    | `/docs/DEFINE_FUNDRAISING_STUDY_NOTE.md`    | ACTIVE | DEFINE as fundraising catalyst, investor pipeline                |
| Defence Startup Fund Application | `/docs/DEFENCE_STARTUP_FUND_APPLICATION.md` | ACTIVE | Defence Startup Fund hakemus (€20K + €20K matching), Lifetime Oy |

---

## April 2026 Catch-up Additions

_Added: 2026-04-10 | Session: claude/connect-kya-dws-cli-0MMIB | Covers ~127 merge commits from 2026-03-11 through 2026-04-10_

The index had fallen ~100 PRs behind. The additions below are the highest-impact new or materially changed files/folders. Individual files inside these trees are not listed item-by-item — grep the filesystem for the latest state.

### New subsystems

| Area                         | Path                                                                                                      | Notes                                                                                                                                |
| ---------------------------- | --------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------ |
| DWS CLI                      | `/cli/` (`src/cli.ts`, `src/format.ts`, README)                                                           | Zero-dep Node CLI: agents, workflows, MCP, KYA, KB, sovereignty, scenarios. Dual output (JSON when piped). Full reference in README. |
| Knowledge Base agent         | `/kb/`, `/src/agents/kb.agent.ts`                                                                         | Karpathy-style LLM-compiled wiki. Raw sources → summaries/concepts/entities → 3 auto-indexes. Ephemeral research swept after 7 days. |
| KYA runtime safety           | `/src/identity/kya-engine.ts`, `/src/routes/kya-webhook.routes.ts`, `cli kya snap                         | status`                                                                                                                              | 5-layer trust framework, TC-4 Leash Snap, Shufti Pro webhook bridge, timing-safe admin-key auth. |
| Aegis (sovereignty)          | `/docs/research/radiusaas-research-aegis-network-auth.md`, Legal/AEGIS_PLATFORM_TERMS                     | EU-sovereign edge authentication, network-level RadiusAAS integration.                                                               |
| BIM Pipeline                 | `/src/routes/bim.routes.ts` (+`/api/bim`)                                                                 | Construction carbon compliance pipeline.                                                                                             |
| DGX Spark runtime            | `/infrastructure/dgx-spark/`, ADMIN_MANUAL §29                                                            | Primary 24/7 runtime (128 GB unified memory). Day-runner auto-discovers `scripts/daily/`, `scripts/hourly/`, `scripts/on-deploy/`.   |
| OpenClaw / NemoClaw research | `/docs/compare-openclaw-autoresearch.md`, `/docs/research/openclaw-nemoclaw-dws6-integration-research.md` | Open agent framework integration research.                                                                                           |
| Autoresearch runner          | `/src/autoresearch/` (runner, synthetic-kya, kya-tuner)                                                   | Autonomous research loop with KYA tuning.                                                                                            |

### New slash commands (`.claude/commands/`)

| Skill  | File                      | Purpose                                                           |
| ------ | ------------------------- | ----------------------------------------------------------------- |
| `/kya` | `.claude/commands/kya.md` | KYA runtime safety — status, dry-run snap, TC-4 chain termination |
| `/kb`  | `.claude/commands/kb.md`  | Knowledge base — compile, ask, research, ingest, lint, status     |

### New / updated standards

| File                            | Change                                                                                                                                                            |
| ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/DWS_SECURITY_STANDARD.md`     | v2.2 — added §18.6 KYA Control Surfaces (CLI, HTTP, Webhook); §19 Synthetic Data & Model Fine-Tuning Security (v2.0)                                              |
| `/DWS_DATA_STANDARD.md`         | v2.1 — added §4.3 filesystem content store classification (kb/raw/, kb/wiki/, kb/ephemeral/)                                                                      |
| `/docs/DWS_SKILLS_GUIDE.md`     | v1.1 — added §7 Runtime Safety & Knowledge (/kya, /kb); updated skill count 20 → 22                                                                               |
| `/Admin/SECURITY_COMPLIANCE.md` | Added Destructive Action Inventory (KYA snap, sandbox freeze, API key revocation, account freeze) + authorization matrix                                          |
| `/Admin/ADMIN_MANUAL.md`        | v3.4 — added §28 Carbon Balance Sheet, §29 DGX Spark, §30 Safety Hooks, §31 External Repos, §32 GitHub Actions & Cron Registry, §33 DWS CLI Operator Reference    |
| `/CLAUDE.md`                    | Numerous updates — RED/GREEN/YELLOW trust zones, Ollama model rule, script automation rule, repo access rule, email rules (Resend removed), GitHub MCP OAuth rule |

### Thesis track

| File                                               | Language | Version               |
| -------------------------------------------------- | -------- | --------------------- |
| `/docs/metropolia/master-thesis/en/V3Thesis_EN.md` | English  | Metropolia (v3.30.50) |
| `/docs/metropolia/master-thesis/fi/V3Thesis_FI.md` | Finnish  | Metropolia (v3.30.50) |
| `/docs/PHD_FIREHORSE_EN.md`                        | English  | PHD Firehorse (v1.x)  |
| `/docs/PHD_FIREHORSE_FI.md`                        | Finnish  | PHD Firehorse (v1.x)  |

All four thesis files are **PRIVATE** — never published to `dws10.com/`, `landing-pages/`, or `onelifetime.world/`. Versioned HTML only to `Learn/`.

### Legal / KYA contracts

| File                                    | Purpose                                                     |
| --------------------------------------- | ----------------------------------------------------------- |
| `/docs/legal/KYA_PARTNER_AGREEMENT.md`  | KYA partner / IDV provider master agreement                 |
| `/docs/legal/AEGIS_PLATFORM_TERMS.md`   | Aegis platform terms of service                             |
| `/docs/legal/DUAL_USE_EXPORT_NOTICE.md` | EU dual-use export control notice                           |
| `/docs/legal/DPA_SHUFTI_PRINT.html`     | Shufti Pro DPA (print-ready)                                |
| `/docs/KYA_BYO_LIFECYCLE.md`            | KYA Bring-Your-Own agent lifecycle, forensic dump retention |

### OneLifetime blog posts (published)

| Post                                                  | Path                                                                                   |
| ----------------------------------------------------- | -------------------------------------------------------------------------------------- |
| KYA Standard v1                                       | `/onelifetime.world/posts/kya-standard-v1.html`                                        |
| Harness Engineering — Investor Note                   | `/onelifetime.world/posts/harness-engineering-investor-note.html`                      |
| EU Sovereign AI — CLOUD Act Disqualifies US Platforms | `/onelifetime.world/posts/en/eu-sovereign-ai-cloud-act-disqualifies-us-platforms.html` |
| Market Signal — Visma Sale 2026                       | `/onelifetime.world/posts/en/market-signal-visma-sale-2026.html`                       |
| EU AI Act Compliance Ready                            | `/onelifetime.world/posts/eu-ai-act-compliance-ready.html`                             |
| Validated Mock Data Principle                         | `/onelifetime.world/posts/validated-mock-data-principle.html`                          |
| NVIDIA GTC 2026 — DWS Roadmap Impact                  | `/onelifetime.world/posts/nvidia-gtc-2026-dws-roadmap-impact.html`                     |

### Field notes (2026-03 / 2026-04)

Not enumerated individually — see `/docs/field-notes/` for ~40 new notes covering Shufti DPA clause audits, KYA financial projections, autoresearch methodology, OpenClaw integration, DGX Spark sandbox strategy, Acer sandbox, NIST KYA review, Grok/Gemini review inputs, DocuSign integration, Scaleway EU inference setup, RadiusAAS / Aegis research, ASTA scientific analysis, LWM Phase 2 technical gap analysis, GTC 2026 keynote, CLI AI agents research, and pentesting plan.

---

## Document Statistics

**Last Updated:** 10.04.2026

| Metric               | Value                                                                                     |
| -------------------- | ----------------------------------------------------------------------------------------- |
| Total Markdown Files | 250+                                                                                      |
| Active Documents     | 200+                                                                                      |
| Archived Documents   | 20+                                                                                       |
| Languages            | EN, FI                                                                                    |
| Categories           | 22 (+DWS CLI, Knowledge Base, KYA Control Surfaces, DGX Spark Runtime, Aegis/Sovereignty) |

### Sync Tracking

Files are synced to three backup locations on each Windows login:

| Destination      | Script                | Content                                         |
| ---------------- | --------------------- | ----------------------------------------------- |
| GitHub (private) | `git push`            | All tracked files                               |
| Proton Drive     | `Sync-ToProton.ps1`   | Admin, scripts, Firehorse, docs, secrets        |
| Supabase Storage | `Sync-ToSupabase.ps1` | Admin, scripts, src, Firehorse, sales, investor |

Last modified dates in this index are from `git log -1 --format="%ai"` per file.

---

## Maintenance

### Update Workflow

1. **New Document Created** - Add entry to relevant section
2. **Document Deprecated** - Change status to ARCHIVED/DEPRECATED
3. **Major Restructure** - Run full index regeneration script
4. **Weekly Review** - Verify links and status accuracy

### Index Generation Script

```bash
#!/bin/bash
# Generate document inventory
find . -name "*.md" -type f \
  ! -path "./node_modules/*" \
  ! -path "./.git/*" \
  | sort > /tmp/md_inventory.txt

echo "Found $(wc -l < /tmp/md_inventory.txt) markdown files"
```

---

## Related Documents

- **Document Standard:** `/DWS_DOCUMENT_STANDARD.md`
- **Ontology Framework:** `/ONTOLOGY.md`
- **Field Notes Guide:** `/docs/field-notes/README.md`
- **Core Artifacts:** `/artifacts/`

---

**Questions?** Contact docs@dws-iq.com
