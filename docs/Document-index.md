# DWS6 Document Index

---
# VERSION AND AGENT HISTORY

Version: 1.2

Sessions & Modifications:
  - Version: 1.2 | Tool: Claude Code | Date: 11.03.2026 | Changes: Added Acer Veriton GN100 admin manual and three GN100 field notes to the document index
  - Version: 1.0 | Tool: Claude Code (Claude Opus 4.5) | Session: claude/update-docs-qwen3-coder-FFGgN | Date: 04.02.2026 | Changes: Initial creation - comprehensive document index for faster search
  - Version: 1.1 | Tool: Claude Code (Opus 4.6) | Session: claude/research-dws-brand-standard-Rm8Jw | Date: 07.02.2026 | Changes: Added last-modified dates, scripts section, sync tracking info

Session Links & References:
  - Claude Code (claude/update-docs-qwen3-coder-FFGgN): https://github.com/blogtheristo/dws6
  - Claude Code (claude/research-dws-brand-standard-Rm8Jw): https://github.com/blogtheristo/dws6/commits/claude/research-dws-brand-standard-Rm8Jw
  - View on GitHub: https://github.com/blogtheristo/dws6/blob/main/docs/Document-index.md

Document Status:
  - Created: 04.02.2026
  - Last Modified: 11.03.2026
  - Language: English
  - Languages Available: English
  - Publication Status: ACTIVE

---

## Purpose

Centralized index of all documentation in the DWS6 repository for faster search and discovery. This index enables:
- Quick navigation to specific documents
- Status tracking across all documentation
- Identification of gaps and outdated content
- Support for localization planning

---

## Quick Navigation

| Category | Count | Description |
|----------|-------|-------------|
| [Admin Manuals](#admin-manuals) | 8 | System administration and deployment guides |
| [Architecture](#architecture-docs) | 12 | Technical architecture blueprints |
| [Field Notes](#field-notes) | 10+ | LWM knowledge capture from real-world events |
| [Firehorse Product](#firehorse-product) | 35+ | Product suite documentation |
| [Standards & Guidelines](#standards--guidelines) | 10+ | Coding and documentation standards |
| [Security](#security) | 5+ | Security policies and compliance |
| [Agent Documentation](#agent-documentation) | 10+ | AI agent tracking and coordination |
| [Deployment & DevOps](#deployment--devops) | 15+ | CI/CD, Docker, Cloudflare guides |
| [Thesis & Academic](#thesis--academic) | 10+ | Metropolia master thesis documents |
| [Configuration](#configuration) | 10+ | Environment and setup guides |

---

## Admin Manuals

System administration and deployment guides. All admin manuals are in `Admin/` folder.

| Document | Path | Status | Last Modified | Description |
|----------|------|--------|---------------|-------------|
| Admin Manual (main) | `/Admin/ADMIN_MANUAL.md` | ACTIVE | 2026-02-07 | Master admin manual (v2.1) |
| Authentication Manual | `/Admin/ADMIN_MANUAL_AUTHENTICATION.md` | ACTIVE | 2026-02-06 | Supabase auth setup |
| Dashboard V8 Manual | `/Admin/ADMIN_MANUAL_DASHBOARD_V8_EN_v1.md` | ACTIVE | 2026-02-06 | Dashboard v8 guide |
| Supabase Manual | `/Admin/ADMIN_MANUAL_SUPABASE_EN_v1.md` | ACTIVE | 2026-02-06 | Supabase configuration |
| Gaps Analysis | `/Admin/ADMIN_MANUAL_GAPS_ANALYSIS.md` | ACTIVE | 2026-02-06 | Documentation gap analysis |
| DWS6.com Manual | `/Admin/ADMIN_MANUAL_DWS6_COM.md` | ACTIVE | 2026-02-06 | Main site deployment |
| DWS10 Store Payments | `/Admin/ADMIN_MANUAL_DWS10_STORE_PAYMENTS.md` | ACTIVE | 2026-02-06 | Revolut Web SDK store |
| Testing Manual | `/Admin/ADMIN_MANUAL_TESTING.md` | ACTIVE | 2026-02-06 | Testing procedures |
| Files & Folders | `/Admin/ADMIN_MANUAL_FILES_AND_FOLDERS.md` | ACTIVE | 2026-02-06 | Repo structure guide |
| Security Compliance | `/Admin/SECURITY_COMPLIANCE.md` | ACTIVE | 2026-02-06 | Security & compliance |
| Security Testing | `/Admin/Security/ADMIN_MANUAL_SECURITY_TESTING.md` | ACTIVE | 2026-02-06 | Security test procedures |
| Security Monitoring | `/Admin/Security/ADMIN_MANUAL_SECURITY_MONITORING.md` | ACTIVE | 2026-02-06 | Monitoring setup |
| Acer Veriton GN100 | `/Admin/Acer-Veriton-GN100/README.md` | ACTIVE | 2026-03-11 | GN100 edge AI device admin manual and runtime notes |
| Documentation Audit | `/ADMIN_DOCUMENTATION_AUDIT_2026-01-11.md` | ARCHIVED | 2026-01-11 | 2026-01 audit results |
| Auth Setup Guide | `/docs/AUTH_SETUP_GUIDE.md` | ACTIVE | - | Authentication setup |

---

## Architecture Docs

Technical architecture blueprints for DWS IQ 6 multi-agent system.

| Document | Path | Status | Description |
|----------|------|--------|-------------|
| 00 Master Blueprint | `/docs/architecture/00-MASTER-BLUEPRINT.md` | ACTIVE | System overview |
| 01 Agent Discovery | `/docs/architecture/01-AGENT-DISCOVERY.md` | ACTIVE | Agent identification patterns |
| 02 Cognitive Architecture | `/docs/architecture/02-COGNITIVE-ARCHITECTURE.md` | ACTIVE | AI reasoning framework |
| 03 Orchestration Layer | `/docs/architecture/03-ORCHESTRATION-LAYER.md` | ACTIVE | Multi-agent coordination |
| 04 Tool Architecture | `/docs/architecture/04-TOOL-ARCHITECTURE.md` | ACTIVE | MCP tools design |
| 05 Grounding Memory | `/docs/architecture/05-GROUNDING-MEMORY.md` | ACTIVE | LWM memory system |
| 06 Prompt Engineering | `/docs/architecture/06-PROMPT-ENGINEERING.md` | ACTIVE | Prompt design patterns |
| 07 Implementation | `/docs/architecture/07-IMPLEMENTATION.md` | ACTIVE | Implementation guide |
| 08 Testing | `/docs/architecture/08-TESTING.md` | ACTIVE | Testing strategy |
| 09 Production Deployment | `/docs/architecture/09-PRODUCTION-DEPLOYMENT.md` | ACTIVE | Production rollout |
| 10 Delivery Launch | `/docs/architecture/10-DELIVERY-LAUNCH.md` | ACTIVE | Launch procedures |
| Summary | `/docs/architecture/SUMMARY.md` | ACTIVE | Architecture summary |

---

## Field Notes

LWM knowledge capture from real-world events - raw sensory input for the Lifetime World Model.

| Document | Path | Date | Topic | Ontology Tags |
|----------|------|------|-------|---------------|
| Karp Enterprise AI | `/docs/field-notes/2026-01-21-karp-enterprise-ai-ontology.md` | 2026-01-21 | Palantir CEO insights | Strategy, AI, Ontology |
| Dashboard V9 Stack | `/docs/field-notes/2026-01-22-dashboard-v9-technical-stack.md` | 2026-01-22 | Technical stack analysis | Technology, React, Vite |
| Design System Audit | `/docs/field-notes/2026-01-23-design-system-audit-navigation-gaps.md` | 2026-01-23 | UI/UX audit | Design, Navigation, Gaps |
| AI Robotics Webinar | `/docs/field-notes/2026-01-27-apply-ai-robotics-manufacturing-webinar.md` | 2026-01-27 | Manufacturing AI | Manufacturing, Robotics |
| EU Tech Sovereignty | `/docs/field-notes/2026-01-28-eu-tech-stack-sovereignty-positioning.md` | 2026-01-28 | EU data sovereignty | Compliance, EU, Strategy |
| FIGBC Working Group | `/docs/field-notes/2026-01-30-figbc-working-group-recruitment.md` | 2026-01-30 | FIGBC recruitment | Construction, Finland |
| Qwen3-Coder LLM | `/docs/field-notes/2026-02-04-qwen3-coder-next-agentic-llm.md` | 2026-02-04 | Qwen3 coding agent | LLM, Agentic, Local Dev |
| Agent Teams vs Subagents | `/docs/field-notes/2026-02-05-claude-code-agent-teams-vs-subagents.md` | 2026-02-05 | Claude Code parallel work | Multi-Agent, Teams, Subagents |
| GN100 NVIDIA GPG Key Fix | `/docs/field-notes/2026-02-27-acer-veriton-gn100-nvidia-gpg-key-fix.md` | 2026-02-27 | NVIDIA Workbench repo key renewal | GN100, NVIDIA, Maintenance |
| GN100 Ollama Dev Environment | `/docs/field-notes/2026-03-01-veriton-gn100-ollama-dev-environment.md` | 2026-03-01 | Ollama, Cursor, Cline, Claude Code setup | GN100, Ollama, Local Dev |
| GN100 Docker CUDA Validation | `/docs/field-notes/2026-03-11-veriton-gn100-docker-cuda-validation.md` | 2026-03-11 | Docker GPU validation and ARM64 container policy | GN100, Docker, CUDA, ARM64 |
| Field Notes README | `/docs/field-notes/README.md` | - | Guidelines | - |

---

## Firehorse Product

Product suite documentation for Firehorse (Reports, Automation, ContentMS, Omnichannel).

### Core Documentation

| Document | Path | Status | Description |
|----------|------|--------|-------------|
| Master Index | `/Firehorse/MASTER_INDEX.md` | ACTIVE | Complete index |
| Product Index | `/Firehorse/INDEX.md` | ACTIVE | Product navigation |
| Quick Start | `/Firehorse/QUICK_START.md` | ACTIVE | Getting started |
| README | `/Firehorse/README.md` | ACTIVE | Overview |
| Product Catalog | `/Firehorse/PRODUCT_CATALOG.md` | ACTIVE | Full product list |
| DWS IQ6 Integration | `/Firehorse/DWS_IQ6_INTEGRATION_GUIDE.md` | ACTIVE | Integration guide |
| System Diagram | `/Firehorse/SYSTEM_DIAGRAM.md` | ACTIVE | Architecture diagram |

### Templates & Standards

| Document | Path | Status | Description |
|----------|------|--------|-------------|
| Document Template Standards | `/Firehorse/DOCUMENT_TEMPLATE_STANDARDS.md` | ACTIVE | Template standards |
| European Templates Index | `/Firehorse/EUROPEAN_TEMPLATES_INDEX.md` | ACTIVE | EU regional templates |
| Finnish Hero Documents | `/Firehorse/FINNISH_HERO_DOCUMENTS.md` | ACTIVE | Finland-specific |
| Hero Documents Complete | `/Firehorse/HERO_DOCUMENTS_COMPLETE.md` | ACTIVE | All hero docs |

### Sub-Products

| Product | Index Path | Description |
|---------|------------|-------------|
| Automation | `/Firehorse/Automation/README.md` | LinkedIn automation, Python scripts |
| ContentMS | `/Firehorse/ContentMS/README.md` | Content management |
| Control | `/Firehorse/Control/README.md` | Construction site control |
| Omnichannel | `/Firehorse/Omnichannel/*/README.md` | Multi-channel outreach |
| Report | `/Firehorse/Report/README.md` | Analytics and reporting |
| Situation | `/Firehorse/Situation/README.md` | Situation rooms |

### Control Views

| View | Path | Audience |
|------|------|----------|
| Engineer View | `/Firehorse/Control/ENGINEER_VIEW.md` | Site engineers |
| Contractor View | `/Firehorse/Control/CONTRACTOR_VIEW.md` | Contractors |
| Constructor View | `/Firehorse/Control/CONSTRUCTOR_VIEW.md` | Constructors |
| Site Chief View | `/Firehorse/Control/SITE_CHIEF_VIEW.md` | Site managers |
| Specialized Roles | `/Firehorse/Control/SPECIALIZED_ROLES_VIEW.md` | Specialists |

### Situation Rooms

| View | Path | Audience |
|------|------|----------|
| Board View | `/Firehorse/Situation/BOARD_VIEW.md` | Board members |
| Finance CXO View | `/Firehorse/Situation/FINANCE_CXO_VIEW.md` | CFO/Finance |
| Managers View | `/Firehorse/Situation/MANAGERS_VIEW.md` | Management |

---

## Standards & Guidelines

Coding, documentation, and process standards.

| Document | Path | Status | Last Modified | Description |
|----------|------|--------|---------------|-------------|
| DWS Document Standard | `/DWS_DOCUMENT_STANDARD.md` | ACTIVE | 2026-02-07 | Master document standard (v1.4) |
| CLAUDE.md | `/CLAUDE.md` | ACTIVE | 2026-02-05 | AI agent guidelines |
| Ontology | `/ONTOLOGY.md` | ACTIVE | 2026-01-21 | LWM ontology framework |
| Copilot Instructions | `/.github/copilot-instructions.md` | ACTIVE | - | GitHub Copilot rules |
| GitHub Copilot Guide | `/.workflows/GITHUB_COPILOT_GUIDE.md` | ACTIVE | - | Copilot workflow guide |
| Ultra Agent Coordinator | `/.workflows/agents/ULTRA_AGENT_COORDINATOR.md` | ACTIVE | - | Agent coordination |
| Agent Signal Instructions | `/.workflows/agents/AGENT_SIGNAL_INSTRUCTIONS.md` | ACTIVE | - | Signal protocols |

---

## Security

Security policies, compliance, and guidelines.

| Document | Path | Status | Description |
|----------|------|--------|-------------|
| Security Compliance | `/Admin/SECURITY_COMPLIANCE.md` | ACTIVE | Compliance overview |
| README Security | `/README_SECURITY.md` | ACTIVE | Security readme |
| AgentFoundry Security | `/AgentFoundry/Security.md` | ACTIVE | Agent security |
| Argus Code Review | `/ARGUS_CODE_REVIEW_SETUP.md` | ACTIVE | Code review security |

---

## Agent Documentation

AI agent tracking and coordination documents.

| Document | Path | Status | Description |
|----------|------|--------|-------------|
| Agents Overview | `/AGENTS.md` | ACTIVE | Agent inventory |
| Agent Tracking Complete | `/AGENT_TRACKING_COMPLETE.md` | ACTIVE | Full tracking |
| Agent Tracking Index | `/AGENT_TRACKING_INDEX.md` | ACTIVE | Tracking index |
| Agent Tracking Implementation | `/AGENT_TRACKING_IMPLEMENTATION.md` | ACTIVE | Implementation guide |
| Connection Status Quick Start | `/AGENT_CONNECTION_STATUS_QUICK_START.md` | ACTIVE | Quick status check |
| Status Template | `/AGENT_STATUS_TEMPLATE_COPY_PASTE.md` | ACTIVE | Copy-paste template |

---

## Deployment & DevOps

CI/CD, Docker, and cloud deployment guides.

| Document | Path | Status | Description |
|----------|------|--------|-------------|
| Domain Deployment Guide | `/DOMAIN_DEPLOYMENT_GUIDE.md` | ACTIVE | Domain setup |
| Cloudflare Deployment | `/CLOUDFLARE_DEPLOYMENT.md` | ACTIVE | Cloudflare Workers |
| Cloudflare Setup Steps | `/CLOUDFLARE_SETUP_STEPS.md` | ACTIVE | Step-by-step |
| Cloudflare Pages Verification | `/CLOUDFLARE_PAGES_VERIFICATION.md` | ACTIVE | Pages verification |
| Cloudflare Sandbox Pilot | `/docs/CLOUDFLARE_SANDBOX_PILOT.md` | ACTIVE | Sandbox testing |
| DWS6 Deployment Plan | `/DWS6_DEPLOYMENT_PLAN.md` | ACTIVE | Deployment plan |
| DWS6 Troubleshooting | `/DWS6_DEPLOYMENT_TROUBLESHOOTING.md` | ACTIVE | Troubleshooting |
| Google Cloud Run Setup | `/AgentFoundry/GOOGLE_CLOUD_RUN_SETUP.md` | ACTIVE | GCR deployment |
| AgentFoundry Deployment | `/AgentFoundry/DEPLOYMENT_GUIDE.md` | ACTIVE | Agent deployment |
| Backup Procedures | `/BACKUP_PROCEDURES.md` | ACTIVE | Backup strategy |
| GitHub Workflows README | `/.github/workflows/README.md` | ACTIVE | CI/CD workflows |

---

## Thesis & Academic

Metropolia master thesis documentation.

| Document | Path | Language | Status |
|----------|------|----------|--------|
| Multi-Agent Coordination EN | `/docs/thesis/MULTI_AGENT_COORDINATION_EN.md` | EN | ACTIVE |
| Multi-Agent Coordination FI | `/docs/thesis/MULTI_AGENT_COORDINATION_FI.md` | FI | ACTIVE |
| Thesis README | `/docs/thesis/README.md` | EN | ACTIVE |
| Master Thesis (EN) | `/docs/metropolia/master-thesis/en/*.md` | EN | ACTIVE |
| Master Thesis (FI) | `/docs/metropolia/master-thesis/fi/*.md` | FI | ACTIVE |

---

## Configuration

Environment and setup configuration guides.

| Document | Path | Status | Description |
|----------|------|--------|-------------|
| ENV Checklist | `/.ENV_CHECKLIST.md` | ACTIVE | Environment checklist |
| ENV Config Options | `/.ENV_CONFIG_OPTIONS.md` | ACTIVE | All config options |
| ENV Setup Guide MVP | `/.ENV_SETUP_GUIDE_MVP.md` | ACTIVE | MVP setup |
| ENV MCP Protection Plan | `/.ENV_MCP_PROTECTION_PLAN.md` | ACTIVE | MCP security |
| ENV MCP Recovery Summary | `/ENV_MCP_AND_GAMMA_RECOVERY_SUMMARY.md` | ARCHIVED | Recovery notes |

---

## Industry Documentation

Industry-specific documentation for 16 EU industries.

| Document | Path | Status | Description |
|----------|------|--------|-------------|
| 16 Industries Overview | `/16-INDUSTRIES.md` | ACTIVE | Full industry coverage |
| 8 Industries Summary | `/8-industries.md` | ACTIVE | Core industries |

---

## Scripts & Automation

PowerShell/Bash automation scripts with version tracking.

| Script | Path | Version | Last Modified | Description |
|--------|------|---------|---------------|-------------|
| Startup Daily Sync | `/scripts/Startup-DailySync.bat` | v1.4 | 2026-02-07 | Login trigger: pull + sync + docs + Supabase |
| Sync to Proton | `/scripts/Sync-ToProton.ps1` | v1.4 | 2026-02-07 | Proton Drive sync (folders, secrets) |
| Generate PDFs | `/scripts/Generate-PDFs.ps1` | v1.5 | 2026-02-07 | Markdown to HTML/PDF (pandoc) |
| Install Startup | `/scripts/Install-StartupSync.ps1` | v1.1 | 2026-02-07 | Creates Startup shortcut |
| Sync to Supabase | `/scripts/Sync-ToSupabase.ps1` | v1.2 | 2026-02-07 | EU cloud backup |

---

## Sales & Marketing

Sales materials and marketing documentation.

| Document | Path | Status | Last Modified | Description |
|----------|------|--------|---------------|-------------|
| Enterprise Sales | `/sales-outreach/enterprise-sales.md` | ACTIVE | 2026-01-06 | Enterprise sales playbook |
| Sales AI Agent | `/sales-outreach/SALES_AI_AGENT_DESIGN_FI_v1.md` | ACTIVE | 2026-01-06 | AI agent sales design |
| Sales Manifesto Q1 2026 | `/DWS_IQ_6_SALES_MANIFESTO_Q1_2026.md` | ACTIVE | - | Q1 sales strategy |
| Campaign Summary | `/CAMPAIGN_SUMMARY.md` | ACTIVE | - | Marketing campaigns |
| Investor Memo | `/investor-outreach/INVESTOR_MEMO.md` | ACTIVE | 2026-01-18 | Investor pitch |
| Investor Pitch Deck | `/investor-outreach/investor-pitch-deck.md` | ACTIVE | 2026-01-06 | Pitch deck |
| Investor PD v3 | `/investor-outreach/V3-DWS-IQ6-InvestorPD_2026.md` | ACTIVE | 2026-01-06 | Investor presentation |
| Investor Profiles | `/Firehorse/Omnichannel/Investors/DWS6_INVESTOR_PROFILES.md` | ACTIVE | - | Target investors |
| Outreach Workflow | `/Firehorse/Omnichannel/Investors/OUTREACH_WORKFLOW.md` | ACTIVE | - | Sales workflow |
| Firehorse Sales Workflow | `/FIREHORSE_SALES_WORKFLOW.md` | ACTIVE | - | Product sales |
| App Store Strategy | `/APP_STORE_STRATEGY.md` | ACTIVE | - | Distribution plan |

---

## Reports & Evaluations

Evaluation reports and weekly summaries.

| Document | Path | Status | Description |
|----------|------|--------|-------------|
| TypeScript React AI SDK Evaluation | `/docs/evaluation/typescript-react-ai-sdk-evaluation.md` | ACTIVE | SDK evaluation |
| Weekly Report 2026-W01 | `/docs/Reports/en/Weekly_Report_2026-W01.md` | ARCHIVED | Week 1 report |
| Work Summary 2025-12-28 | `/COMPREHENSIVE_WORK_SUMMARY_2025-12-28.md` | ARCHIVED | Dec 2025 summary |
| Documentation Update 2025-12-30 | `/DOCUMENTATION_UPDATE_SUMMARY_2025-12-30.md` | ARCHIVED | Dec 2025 docs |
| Session Index 2026-01-11 | `/DOCUMENTATION_INDEX_SESSION_2026-01-11.md` | ARCHIVED | Jan 2026 session |

---

## MCP (Model Context Protocol)

MCP server and orchestration documentation.

| Document | Path | Status | Description |
|----------|------|--------|-------------|
| MCP Configuration Guide | `/docs/MCP_CONFIGURATION.md` | ACTIVE | Complete MCP setup guide |
| MCP Hub | `/mcp-hub/` | ACTIVE | MCP orchestration |
| MCP Servers | `/mcp-servers/` | ACTIVE | Individual servers |

---

## Miscellaneous

Other important documentation.

| Document | Path | Status | Description |
|----------|------|--------|-------------|
| V1 LWM | `/V1_LWM.md` | ACTIVE | LWM version 1 spec |
| V2 Firehorse | `/V2_Firehorse.md` | ACTIVE | Firehorse v2 spec |
| Executive Summary | `/EXECUTIVE_SUMMARY.md` | ACTIVE | Project summary |
| Exit Playbook | `/docs/EXIT_PLAYBOOK.md` | ACTIVE | Exit procedures |
| Implementation Tracker | `/docs/IMPLEMENTATION_TRACKER.md` | ACTIVE | Progress tracking |
| Skills Required | `/docs/SKILLS_REQUIRED.md` | ACTIVE | Team skills |
| ERP Integrations | `/docs/ERP_INTEGRATIONS.md` | ACTIVE | SAP, IFS, Dynamics |
| Trust System 2026 | `/FIELD_NOTE_TRUST_SYSTEM_2026.md` | ACTIVE | Trust framework |
| NVIDIA Inception | `/docs/NVIDIA_INCEPTION_IMPROVEMENTS.md` | ACTIVE | NVIDIA program |
| Create PR Instructions | `/CREATE_PR_INSTRUCTIONS.md` | ACTIVE | PR workflow |

---

## Document Statistics

**Last Updated:** 11.03.2026

| Metric | Value |
|--------|-------|
| Total Markdown Files | 135+ |
| Active Documents | 105+ |
| Archived Documents | 15+ |
| Languages | EN, FI |
| Categories | 14 (added Scripts & Automation) |

### Sync Tracking

Files are synced to three backup locations on each Windows login:

| Destination | Script | Content |
|-------------|--------|---------|
| GitHub (private) | `git push` | All tracked files |
| Proton Drive | `Sync-ToProton.ps1` | Admin, scripts, Firehorse, docs, secrets |
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
