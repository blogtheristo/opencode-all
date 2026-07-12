# DWS Document Standard

---

# VERSION AND AGENT HISTORY

Version: 2.6

Sessions & Modifications:

- Version: 2.6 | Tool: Claude Code (Sonnet 5) | Session: claude/cv-senior-ai-engineer-msjheo | Date: 12.07.2026 | Changes: §22.4 updated — `scripts/render-doc.sh` now passes `--resource-path` so relative image paths resolve against the source .md's own directory (fixes a real bug: pandoc was resolving them against the caller's cwd instead, silently dropping the image). Documented the permanent pandoc install path: `infrastructure/dgx-spark/first-boot.sh` (step 3a) installs it once on the DGX Spark box so it survives across sessions, distinct from the ephemeral cloud-session `apt-get install` fallback. First real-world use: `bids/ORK160826/CV_ORK160826_v165.md` v170 — first image reference in 170 versions, rendered to `.html`/`.docx` with the photo embedded.
- Version: 2.5 | Tool: Claude Code (Sonnet 5) | Session: claude/cv-senior-ai-engineer-msjheo | Date: 12.07.2026 | Changes: Added §22 (Multimodal Document Assets) — canonical asset locations (images/fonts/evidence PDFs), Markdown image reference convention, the Base64-embed rule for downloadable HTML/DOCX (formalizes CLAUDE.md's "Downloadable HTML Rule" here as canonical, via new `scripts/render-doc.sh` pandoc wrapper), video/audio handling (poster-frame + external link, never inline data URI), personnel photo quality bar, and the "never drop silently — HIC decision + shared Drive link" fallback rule for artifacts that can't be embedded. Triggered by discovering `bids/ORK160826/CV_ORK160826_v165.md` had zero image references across 168 versions despite a canonical photo already existing in-repo, and that the existing CV-facing photo (`CV/risto70.png`) has an unprofessional background unsuitable for procurement documents. Added §22 to ToC.
- Version: 2.4 | Tool: Claude Code | Session: claude/risto-cv-lifetime-world-uiqxxo | Date: 02.07.2026 | Changes: Added §20.6 (Customer-facing documents: version block goes at the END) — for documents delivered directly to a customer/evaluator (CVs, bid attachments, proposals, external price lists), the VERSION AND AGENT HISTORY block, Document Status, copyright, and company contact move to the last page instead of the first, so the external reader sees substantive content before internal provenance metadata. Does not apply to internal handbooks/standards/field notes. First applied to `bids/ORK160826/ORK_Risto_CV_FI_164.md` (v164→165).
- Version: 2.3 | Tool: Claude Code | Session: claude/winning-sales-strategy-qb1boj | Date: 28.06.2026 | Changes: Added §21 (Document Formulation Preservation) — codifies the rule that document rewrites must never lose original formulation data (eloquent passages, quotes, philosophical text, mottos, cultural wisdom). Defines formulation categories, rewrite procedure (extract → catalog → rewrite → reintegrate → verify), DOCX export rules, and enforcement as Rule 12 violation. Added §21 to ToC.
- Version: 2.2 | Tool: Claude Code | Session: claude/deepseek-v4-flash-hybrid-0niopt | Date: 27.06.2026 | Changes: Added File Lifecycle Suffixes subsection under §19 File Naming Template — codifies four named suffixes (\_DRAFT, \_DEPRECATED, \_RETIRED, \_ARCHIVE) to replace the ambiguous \_OLD convention. Renamed all ~72 \_OLD files in the repo to their correct suffix. Blog draft rule: \_DRAFT files require explicit approval before promotion. Dual-folder pairs must use the same suffix in the same commit.
- Version: 2.1 | Tool: Claude Code | Session: claude/nvidia-vera-rubin-card-be8g7t | Date: 25.06.2026 | Changes: Added §20 (Whitepaper Versioning) — codifies that customer-facing whitepapers carry a Document Revision (vX.Y) distinct from the subject standard/product version, a visible "Document revision · Last updated" line, a VERSION AND AGENT HISTORY provenance block (\*\*\*-delimited for markdown sources; HTML-comment form for public HTML where .md is forbidden per Non-Negotiable Rule 5), the patch/minor/major increment rule, Learn/ snapshot + dual-folder handling, and an HTML provenance template. Added §20 to the ToC. Triggered by the discovery that the live KYA whitepaper carried only the KYA Standard version and had no document-revision history, so a terminology/security edit (OpenClaw → NVIDIA NemoClaw) went out unrecorded.
- Version: 2.0 | Tool: Claude Code (Haiku 4.5) | Session: claude/sync-version-numbering-adEeB | Date: 28.04.2026 | Changes: Added Section 5.4 (Thesis Version Numbering Format — CRITICAL): documented decimal 0.01 increment rule for all 4 thesis files (V3Thesis_EN/FI + PHD_FIREHORSE_EN/FI), unified version track requirement, rationale for preventing version fork confusion, and implementation guidance; version bump to 2.0 reflects addition of new critical standard for thesis artifact governance
- Version: 1.9 | Tool: Claude Code (Opus 4.6) | Session: claude/plan-postgres-columnar-3bSn6 | Date: 12.03.2026 | Changes: Registered DWS_DATA_STANDARD.md in document ecosystem — new root-level standard for data storage governance, columnar/row policy, extension registry, EU regulatory compliance
- Version: 1.8 | Tool: Codex (GPT-5.3) | Session: cursor/code-versioning-pr-rule | Date: 13.03.2026 | Changes: Added Code Versioning & PR Traceability Standard (§19), syntax-safe code version note templates, and .env schema versioning policy
- Version: 1.7 | Tool: Claude Code (Sonnet 4.6) | Session: claude/add-web-content-index-kxetP | Date: 28.02.2026 | Changes: Added Web Content Index check procedure (§17), Learn HTML generation rule (§18), content-index agent skill; updated morning briefing with Learn artifact links
- Version: 1.6 | Tool: Cursor AI | Session: cursor/update-sql-migration-naming | Date: 27.02.2026 | Changes: Added SQL migration file naming convention using number_ddmmyy_name.sql pattern
- Version: 1.5 | Tool: Claude Code (Opus 4.6) | Session: claude/automate-pr-workflow-e5wXD | Date: 21.02.2026 | Changes: Added OUTDATED status and document lifecycle procedure (sections 2.4-2.5), archive folder structure, marking procedure
- Version: 1.4 | Tool: Claude Code (Opus 4.6) | Session: claude/research-dws-brand-standard-Rm8Jw | Date: 07.02.2026 | Changes: Pandoc compatibility - changed --- to \*\*\* delimiters, updated PDF section with Generate-PDFs.ps1
- Version: 1.3 | Tool: Claude Code (Opus 4.5) | Session: claude/update-docs-qwen3-coder-FFGgN | Date: 04.02.2026 | Changes: Added LLM versioning section (14), localization tracking (15), document index reference
- Version: 1.2 | Tool: Claude Code | Session: claude/show-dws-version-LLEHz | Date: 21.01.2026 | Changes: Added knowledge management strategy, core artifacts, and field notes sections; integrated ontology framework
- Version: 1.1 | Tool: GitHub Copilot | Session: 2025-12-30 | Date: 30.12.2025 | Changes: Added PDF Standard section (8.0) with conversion methods, quality checklist, and automation guidance
- Version: 1.0 | Tool: Cursor AI | Session: 2025-12-30 | Date: 30.12.2025 | Changes: Initial creation - DWS document standard with workflow naming conventions

Session Links & References:

- Cursor AI (2025-12-30): https://github.com/blogtheristo/dws6/commits/main
- Claude Code (claude/show-dws-version-LLEHz): https://github.com/blogtheristo/dws6
- Claude Code (claude/update-docs-qwen3-coder-FFGgN): https://github.com/blogtheristo/dws6
- Claude Code (claude/research-dws-brand-standard-Rm8Jw): https://github.com/blogtheristo/dws6/commits/claude/research-dws-brand-standard-Rm8Jw
- Claude Code (claude/automate-pr-workflow-e5wXD): https://claude.ai/code/session_01G3jtczbnAPw3ofYVBFYoow
- View on GitHub: https://github.com/blogtheristo/dws6/blob/main/DWS_DOCUMENT_STANDARD.md

Document Status:

- Created: 30.12.2025
- Last Modified: 12.07.2026
- Language: English & Finnish (bilingual)
- Languages Available: English, Suomi
- Publication Status: ACTIVE

---

## Table of Contents

1. [Overview](#1-overview)
2. [Document Header Standard](#2-document-header-standard)
3. [Workflow Naming Standard](#3-workflow-naming-standard)
4. [File Naming Conventions](#4-file-naming-conventions)
5. [Version Control](#5-version-control)
6. [Language Policy](#6-language-policy)
7. [Metadata Requirements](#7-metadata-requirements)
8. [PDF Standard](#8-pdf-standard)
9. [Examples](#9-examples)
10. [Knowledge Management & Storage](#10-knowledge-management--storage)
11. [Core Artifacts](#11-core-artifacts)
12. [Field Notes](#12-field-notes)
13. [Enforcement](#13-enforcement)
14. [LLM Model Versioning](#14-llm-model-versioning) ⭐ NEW
15. [Localization & Multi-Language Management](#15-localization--multi-language-management) ⭐ NEW
16. [Document Index](#16-document-index)
17. [Web Content Index Check](#17-web-content-index-check) ⭐ NEW
18. [Learn HTML Generation](#18-learn-html-generation) ⭐ NEW
19. [Code Versioning & PR Traceability](#19-code-versioning--pr-traceability) ⭐ NEW
20. [Whitepaper Versioning](#20-whitepaper-versioning) ⭐ NEW
21. [Document Formulation Preservation](#21-document-formulation-preservation) ⭐ NEW
22. [Multimodal Document Assets](#22-multimodal-document-assets) ⭐ NEW

---

## 1. Overview

### Purpose / Tarkoitus

This document establishes standardized naming conventions, metadata requirements, and versioning practices for all DWS6 project documentation, including workflows, documents, and code artifacts.

Tämä dokumentti määrittää standardoidut nimeämiskäytännöt, metatietovaatimukset ja versiointikäytännöt kaikille DWS6-projektin dokumenteille, mukaan lukien työnkulut, dokumentit ja koodiartefaktit.

### Scope / Soveltamisala

Applies to:

- All markdown documents (`.md`)
- GitHub Actions workflows (`.yml`, `.yaml`)
- Configuration files
- Documentation files
- Admin manuals
- Technical specifications
- Master thesis documents
- PDF documents (`.pdf`)

**Does NOT apply to:**

- `Store/*.md` product files — these use **Store Product Format** (YAML frontmatter with `title`, `price`, `sku`). See `product-catalog/README.md` § "Store Product Format".
- `product-catalog/*/google-merchant-product.json` — these use Google Merchant JSON schema.

### Principles / Periaatteet

1. **Traceability** - Every document must be traceable to its creator and session
2. **Versioning** - All documents must have clear version history
3. **Consistency** - Same format across all document types
4. **Bilingual** - Support for both English and Finnish
5. **Automation-Friendly** - Machine-readable metadata

---

## 2. Document Header Standard

### 2.1 Required Header Block

**ALL documents MUST include this header block at the top:**

> **IMPORTANT: Pandoc Compatibility.** Use `***` (not `---`) as delimiters around
> the VERSION AND AGENT HISTORY block. Pandoc interprets `---` as YAML front matter,
> which causes parse errors because the history block isn't valid YAML.
> Both `***` and `---` render as horizontal rules in markdown, but only `---` triggers
> YAML parsing.

```markdown
# [Document Title]

---

# VERSION AND AGENT HISTORY

Version: X.Y

Sessions & Modifications:

- Version: X.Y | Tool: [Tool Name] | Session: [Session ID] | Date: DD.MM.YYYY | Changes: [Description]

Session Links & References:

- [Tool Name] ([Session ID]): [GitHub commit link]
- View on GitHub: [Document link]

Document Status:

- Created: DD.MM.YYYY
- Last Modified: DD.MM.YYYY
- Language: [Primary Language]
- Languages Available: [List]
- Publication Status: [ACTIVE / DRAFT / OUTDATED / ARCHIVED / DEPRECATED]

---
```

### 2.2 Header Components

| Component               | Required       | Description               | Example                                     |
| ----------------------- | -------------- | ------------------------- | ------------------------------------------- |
| **Version**             | ✅ Yes         | Semantic version (X.Y)    | `1.0`, `1.1`, `2.0`                         |
| **Tool**                | ✅ Yes         | AI tool or author         | `Cursor AI`, `Claude Code`, `Manual`        |
| **Session**             | ✅ Yes         | Unique session identifier | `2025-12-30`, `QVvDX`, `IjtD0`              |
| **Date**                | ✅ Yes         | Date of modification      | `30.12.2025`                                |
| **Changes**             | ✅ Yes         | Brief description         | `Initial creation`, `Added workflow naming` |
| **Session Links**       | ⚠️ Recommended | GitHub commit links       | URL to commits                              |
| **Created**             | ✅ Yes         | Document creation date    | `30.12.2025`                                |
| **Last Modified**       | ✅ Yes         | Last modification date    | `30.12.2025`                                |
| **Language**            | ✅ Yes         | Primary language          | `English`, `Finnish`, `Bilingual`           |
| **Languages Available** | ✅ Yes         | All available languages   | `English, Suomi`                            |
| **Publication Status**  | ✅ Yes         | Document status           | `ACTIVE`, `DRAFT`, `OUTDATED`, `ARCHIVED`   |

### 2.3 Publication Status Values

Use plain text status labels. Emoji icons are optional (display only).

| Status           | Meaning                                                        |
| ---------------- | -------------------------------------------------------------- |
| **ACTIVE**       | Document is current and in use                                 |
| **DRAFT**        | Document is work in progress                                   |
| **OUTDATED**     | Document is superseded, no longer maintained — pending archive |
| **ARCHIVED**     | Document is in `docs/archive/`, kept for historical reference  |
| **DEPRECATED**   | Document is outdated and should not be used                    |
| **UNDER REVIEW** | Document is being reviewed                                     |

> **Pandoc note:** Avoid emoji in publication status if generating PDF via LaTeX.
> HTML engine handles emoji fine. Use text labels (`ACTIVE`, `DRAFT`, etc.) as the
> canonical value; emoji is decorative.

### 2.4 Document Lifecycle

Documents follow this lifecycle:

```
DRAFT → ACTIVE → OUTDATED → ARCHIVED
```

| Transition          | When                           | Who                | Action                                |
| ------------------- | ------------------------------ | ------------------ | ------------------------------------- |
| DRAFT → ACTIVE      | Document complete and approved | Author             | Set `Publication Status: ACTIVE`      |
| ACTIVE → OUTDATED   | Superseded by newer document   | Author or reviewer | Add OUTDATED header block (see below) |
| OUTDATED → ARCHIVED | Moved to `docs/archive/`       | Maintainer         | Move file, update Document Index      |

### 2.5 Marking a Document as OUTDATED (Procedure)

When a document is superseded or no longer maintained, mark it as OUTDATED **before** archiving.

**Step 1:** Add this block immediately after the document title (before `***`):

```markdown
> **STATUS: OUTDATED** — This document is no longer maintained.
> Superseded by: [link to replacement document or description]
> Archived: DD.MM.YYYY
```

**Step 2:** Update the VERSION AND AGENT HISTORY block:

```markdown
Document Status:

- Publication Status: OUTDATED
```

**Step 3:** Move the file to the appropriate `docs/archive/` subfolder:

```
docs/archive/
├── dws10-hero/          — dws10.com Hero campaign docs
├── dws10-docs/          — dws10.com store admin manuals
├── dws10-misc/          — dws10.com READMEs, config docs
├── dws6-deployment/     — dws6.com deployment guides
├── dws6-status/         — dws6.com completion/delivery reports
├── dws6-dashboard/      — dws6.com v7-v9 dashboard architecture
└── onelifetime-blog/    — onelifetime.world blog system docs
```

**Step 4:** Update the Document Index (`docs/Document-index.md`) to reflect the new location and ARCHIVED status.

**Rules:**

- **Never delete** — always move to `docs/archive/` (CLAUDE.md Rule 8)
- Keep `_lp` suffix copies if they exist (preserve git rename history)
- Add a session entry to the version history recording the archive action

---

## 3. Workflow Naming Standard

### 3.1 GitHub Actions Workflow Naming

**Format:**

```
[category]-[action]-[frequency]-v[version]-YYYY-MM-DD.yml
```

**Components:**

| Component     | Required    | Description          | Examples                                        |
| ------------- | ----------- | -------------------- | ----------------------------------------------- |
| **category**  | ✅ Yes      | Workflow category    | `security`, `backup`, `deploy`, `test`, `audit` |
| **action**    | ✅ Yes      | Primary action       | `scan`, `backup`, `deploy`, `test`, `audit`     |
| **frequency** | ⚠️ Optional | Execution frequency  | `daily`, `weekly`, `monthly`, `on-demand`       |
| **version**   | ✅ Yes      | Workflow version     | `v1`, `v2`, `v3`                                |
| **date**      | ✅ Yes      | Creation/update date | `2025-12-30`                                    |

### 3.2 Workflow Naming Examples

✅ **CORRECT:**

```
security-scan-daily-v1-2025-12-30.yml
backup-site-daily-v2-2025-12-26.yml
deploy-production-on-demand-v1-2025-12-15.yml
audit-security-monthly-v1-2025-12-26.yml
test-integration-weekly-v1-2025-12-20.yml
```

❌ **INCORRECT:**

```
security-scan.yml                    ← Missing version and date
daily-backup.yml                     ← Wrong order, missing version/date
deploy.yml                           ← Too generic
test_workflow.yml                    ← Use hyphens, not underscores
SecurityScan-v1.yml                  ← Use lowercase
```

### 3.3 Workflow File Header

**ALL workflow files MUST include this header:**

```yaml
# Workflow: [Workflow Name]
# Version: v[X]
# Created: YYYY-MM-DD
# Last Modified: YYYY-MM-DD
# Purpose: [Brief description]
# Schedule: [Cron expression or trigger]
# Dependencies: [List of dependencies]
# Maintainer: [Team or person]

name: [Workflow Display Name]

on:
  schedule:
    - cron: "[cron expression]"
  workflow_dispatch:

jobs:
  # ... job definitions
```

### 3.4 Workflow Version History

**Include version history in workflow file:**

```yaml
# VERSION HISTORY:
# v1 (2025-12-30): Initial creation
# v2 (2026-01-15): Added error handling
# v3 (2026-02-01): Optimized performance
```

---

## 4. File Naming Conventions

### 4.1 Document Files

**Format:**

```
[CATEGORY]_[NAME]_[LANGUAGE]_v[VERSION].md
```

**Examples:**

```
ADMIN_MANUAL_AUTHENTICATION_EN_v1.md
ADMIN_MANUAL_DWS6_COM_EN_v1.md
OPINNAYTETYO_SUUNNITELMA_FI_v2.md
THESIS_OUTLINE_EN_v1.md
```

### 4.2 Configuration Files

**Format:**

```
[service]-[environment]-config-v[version].yml
```

**Examples:**

```
docker-compose-dev-config-v1.yml
cloudflare-production-config-v2.yml
```

### 4.3 Script Files

**Format:**

```
[action]_[target]_v[version].[ext]
```

**Examples:**

```
security_audit_v1.py
backup_database_v2.sh
deploy_production_v1.js
```

### 4.5 SQL Migration Files (Supabase / Postgres)

Used for `supabase/migrations/*.sql` and any hand-written DDL migrations.

**Format:**

```
[number]_[DDMMYY]_[name].sql
```

- **number**: Zero-padded, 3-digit migration number matching execution order
  - Examples: `002`, `013`, `030`, `036`
- **DDMMYY**: Creation date (day, month, year) in `ddmmyy` format
  - Examples: `270226` = 27.02.2026
- **name**: Short, lowercase, `snake_case` description

**Examples:**

```
002_190126_firehorse_pilot.sql
013_190126_agent_tracking.sql
030_220226_agent_logging_tables.sql
031_220226_supabase_advisor_fixes.sql
036_270226_construction_leads.sql
```

**Rules:**

- Filenames live in the filesystem only – Postgres does **not** read them, but:
  - The **number** communicates migration ordering to humans and tooling.
  - The **DDMMYY** encodes creation context and helps when scanning history.
  - The **name** must be descriptive enough to understand purpose at a glance.
- Always use `_` (underscore) as separator; avoid spaces and mixed separators.
- When renumbering or adding late migrations (e.g. `036_*`), keep the original date to preserve historical traceability.

### 4.4 Prohibited Naming Patterns

❌ **DO NOT USE:**

- Spaces in filenames: `my document.md`
- Special characters: `file@#$.md`
- Inconsistent casing: `MyFile.MD`, `myfile.Md`
- Generic names: `document.md`, `file.txt`
- Dates without context: `2025-12-30.md`

---

## 5. Version Control

### 5.1 Semantic Versioning

**Format:** `MAJOR.MINOR`

| Version         | When to Use    | Example                              |
| --------------- | -------------- | ------------------------------------ |
| **0.1**         | Initial draft  | First version of document            |
| **0.2, 0.3...** | Minor updates  | Small changes, corrections           |
| **1.0**         | First release  | Document is complete and approved    |
| **1.1, 1.2...** | Minor updates  | Updates to released document         |
| **2.0**         | Major revision | Significant restructuring or rewrite |

### 5.2 Version Increment Rules

**Increment MINOR version (0.1 → 0.2) when:**

- Adding new sections
- Updating existing content
- Fixing errors or typos
- Adding examples or clarifications

**Increment MAJOR version (1.0 → 2.0) when:**

- Complete document restructuring
- Changing document purpose or scope
- Breaking changes to standards
- Merging multiple documents

### 5.3 Version History Format

```markdown
## Version History

| Version | Date       | Author/Tool | Changes                |
| ------- | ---------- | ----------- | ---------------------- |
| 1.0     | 2025-12-30 | Cursor AI   | Initial creation       |
| 1.1     | 2026-01-15 | Claude Code | Added workflow section |
| 2.0     | 2026-02-01 | Manual      | Complete restructure   |
```

### 5.4 Thesis Version Numbering Format (CRITICAL)

**Applies to all 4 thesis files (unified track):**

- `docs/metropolia/master-thesis/en/V3Thesis_EN.md`
- `docs/metropolia/master-thesis/fi/V3Thesis_FI.md`
- `docs/PHD_FIREHORSE_EN.md`
- `docs/PHD_FIREHORSE_FI.md`

**Format:** Decimal increment of `0.01` per version bump.

**Sequence:**

- After `.09` comes `.10` (example: `3.09 → 3.10`, `3.19 → 3.20`)
- After `.99` comes major rollover (example: `3.99 → 4.00`, `4.99 → 5.00`)

**Rule:** All 4 thesis files MUST bump in lockstep (unified version track):

- `3.37 → 3.38 → 3.39 → … → 3.99 → 4.00 → 4.01 → …`
- **Never** separate versioning for individual files
- **Never** skip versions in the actual file headers; every underlying bump must be sequential by `0.01` (so no direct header jump like `3.39 → 3.51`)

**Rationale:** Unified versioning ensures that when a supervisor, reviewer, or stakeholder references "version 3.51," all four documents are in sync. This prevents the confusion that arises from forked version tracks (Metropolia at 3.39, PHD at 2.10, etc.).

**Implementation:** When bumping thesis versions, update the `Version: X.YZ` header in all 4 files simultaneously. Add a single entry in the VERSION AND AGENT HISTORY block (per file) documenting the change. The VERSION AND AGENT HISTORY entry may use condensed range notation only as a summary of sequential `0.01` bumps already performed (e.g., "Bumped 3.39 → 3.51" with the note: "12 steps × 0.01 → unified thesis track maintained"). This summary notation does **not** permit skipping intermediate versions in the files themselves.

---

## 6. Language Policy

### 6.1 Supported Languages

| Language      | Code    | Usage                                               |
| ------------- | ------- | --------------------------------------------------- |
| **English**   | `EN`    | Primary language for technical documentation        |
| **Finnish**   | `FI`    | Primary language for thesis and local documentation |
| **Bilingual** | `EN_FI` | Documents with both languages                       |

### 6.2 Language Indicators

**In filename:**

```
DOCUMENT_NAME_EN.md          # English only
DOCUMENT_NAME_FI.md          # Finnish only
DOCUMENT_NAME_EN_FI.md       # Bilingual
```

**In document header:**

```markdown
Document Status:

- Language: English
- Languages Available: English, Suomi
```

### 6.3 Bilingual Document Structure

**For bilingual documents, use this structure:**

```markdown
# Document Title / Dokumentin otsikko

## Section 1 / Osio 1

### English

[English content...]

### Suomi

[Finnish content...]

---

## Section 2 / Osio 2

### English

[English content...]

### Suomi

[Finnish content...]
```

---

## 7. Metadata Requirements

### 7.1 Document Metadata

**ALL documents MUST include:**

```yaml
---
title: [Document Title]
version: [X.Y]
date: [YYYY-MM-DD]
author: [Tool/Person]
language: [EN/FI/EN_FI]
status: [ACTIVE/DRAFT/ARCHIVED]
category: [admin/technical/thesis/workflow]
tags: [tag1, tag2, tag3]
---
```

### 7.2 Workflow Metadata

**ALL workflows MUST include:**

```yaml
# Metadata
# Category: [security/backup/deploy/test/audit]
# Frequency: [daily/weekly/monthly/on-demand]
# Version: v[X]
# Created: YYYY-MM-DD
# Last Run: YYYY-MM-DD
# Status: [active/disabled/deprecated]
# Dependencies: [list]
```

### 7.3 Code Metadata

**ALL scripts MUST include:**

```python
"""
Script: [Script Name]
Version: v[X]
Created: YYYY-MM-DD
Author: [Tool/Person]
Purpose: [Brief description]
Dependencies: [list]
Usage: python script_name.py [args]
"""
```

---

## 8. PDF Standard

### 8.1 Purpose / Tarkoitus

Establishes standardized procedures for creating professional PDF documents from markdown sources, ensuring consistent quality and file size optimization.

Määrittää standardoidut menettelyt ammattimaisten PDF-dokumenttien luomiseksi markdown-lähteistä, varmistaen johdonmukaisen laadun ja tiedostokoon optimoinnin.

### 8.2 File Size Requirements

**MANDATORY:**

- Maximum file size: **10 MB**
- Target file size: **1-5 MB**
- Optimization: Enabled for images and fonts

**RATIONALE:**

- Email compatibility (most servers limit attachments to 10-25 MB)
- Fast download/upload speeds
- Professional distribution
- Cloud storage efficiency

### 8.3 Conversion Methods

#### Method 1: Generate-PDFs.ps1 (Recommended)

**Standard script:** `scripts/Generate-PDFs.ps1` (v1.5)

Converts 16 key markdown files to styled HTML or PDF using pandoc. Runs standalone
or automatically via `Sync-ToProton.ps1 -GeneratePDFs`.

```powershell
# Install pandoc (required)
winget install JohnMacFarlane.Pandoc

# HTML output (default, always works, opens in Edge)
.\scripts\Generate-PDFs.ps1

# PDF output (requires wkhtmltopdf)
winget install wkhtmltopdf
.\scripts\Generate-PDFs.ps1 -Engine wkhtmltopdf

# Open changed files in Edge for review
.\scripts\Generate-PDFs.ps1 -OpenNew

# Preview without generating
.\scripts\Generate-PDFs.ps1 -DryRun
```

**Key pandoc flags for DWS documents:**

```
-f markdown-yaml_metadata_block+smart   # Disable YAML parsing (DWS headers aren't YAML)
--standalone --embed-resources           # Self-contained HTML with embedded CSS
--toc --toc-depth=2                      # Table of contents
--css dws6-pdf-style.css                 # DWS brand styling
```

#### Method 2: Browser Print-to-PDF

1. Generate HTML with Method 1
2. Open `.html` in Edge/Chrome
3. Press `Ctrl+P` > "Save as PDF"
4. Set margins to Minimum, enable Background graphics

#### Method 3: Pandoc CLI (manual)

```powershell
# HTML (always works)
pandoc "input.md" -o "output.html" --standalone --toc -f markdown-yaml_metadata_block+smart

# PDF via wkhtmltopdf (no LaTeX needed)
pandoc "input.md" -o "output.pdf" --pdf-engine=wkhtmltopdf --toc -f markdown-yaml_metadata_block+smart

# PDF via LaTeX (avoid - emoji/Unicode issues)
pandoc "input.md" -o "output.pdf" --pdf-engine=xelatex --toc -f markdown-yaml_metadata_block+smart
```

> **WARNING:** Do NOT use `pdflatex` - it cannot handle Unicode emoji.
> Do NOT use `---` delimiters in document headers - pandoc treats them as YAML.
> Use `***` delimiters instead (see Section 2.1).

### 8.4 HTML Styling Standard (DWS Brand)

**Font loading — two modes based on document classification:**

| Classification                      | Font Loading                                       | Reason                                                                                |
| ----------------------------------- | -------------------------------------------------- | ------------------------------------------------------------------------------------- |
| **Confidential / Sales / Internal** | Self-hosted `@font-face` from `docs/assets/fonts/` | No external network requests — document works offline and in locked-down environments |
| **Public (landing pages, blog)**    | Google Fonts CDN `<link>` tag                      | Performance, caching, CDN delivery                                                    |

**Self-hosted font (confidential documents):**

Font files: `docs/assets/fonts/Inter-{Regular,Medium,SemiBold,Bold}.ttf`

```css
/* Self-hosted Inter — no external network requests (confidential document) */
@font-face {
  font-family: "Inter";
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url("../assets/fonts/Inter-Regular.ttf") format("truetype");
}
@font-face {
  font-family: "Inter";
  font-style: normal;
  font-weight: 500;
  font-display: swap;
  src: url("../assets/fonts/Inter-Medium.ttf") format("truetype");
}
@font-face {
  font-family: "Inter";
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: url("../assets/fonts/Inter-SemiBold.ttf") format("truetype");
}
@font-face {
  font-family: "Inter";
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url("../assets/fonts/Inter-Bold.ttf") format("truetype");
}
```

**Google Fonts (public pages only):**

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
  rel="stylesheet"
/>
```

**DWS brand CSS:**

```css
body {
  font-family:
    "Inter",
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    "Helvetica Neue",
    Arial,
    sans-serif;
  font-size: 10pt;
  line-height: 1.55;
  max-width: 900px;
  margin: 0 auto;
  padding: 40px;
  color: #1a202c;
}
h1 {
  color: #0f172a;
  border-bottom: 3px solid #0066cc;
  padding-bottom: 8px;
}
h2 {
  color: #0f172a;
  border-bottom: 1px solid #e2e8f0;
  padding-bottom: 4px;
}
h3 {
  color: #1e3a5f;
}
code {
  background: #f4f4f4;
  padding: 2px 6px;
  border-radius: 3px;
}
pre {
  background: #f4f4f4;
  padding: 12px;
  border-radius: 4px;
  border: 1px solid #ddd;
}
table {
  border-collapse: collapse;
  width: 100%;
  margin: 12px 0;
}
th,
td {
  border: 1px solid #e2e8f0;
  padding: 8px 12px;
  text-align: left;
}
th {
  background: #0f172a;
  color: white;
}
tr:nth-child(even) {
  background: #f8fafc;
}
a {
  color: #0066cc;
}
blockquote {
  border-left: 4px solid #0066cc;
  padding: 8px 16px;
  background: #f0f7ff;
}
```

**Brand colors reference:**

- Primary: `#0f172a` (dark navy) - headings, table headers
- Secondary: `#1e3a5f` (deep blue) - subheadings, accents
- Accent: `#fbbf24` (gold) - section borders, CTAs
- Enterprise blue: `#0066cc` - links, blockquotes
- Text: `#1a202c` - body text
- Muted: `#64748b` - secondary text, labels

### 8.4.1 Print / A4 PDF Standard (CRITICAL)

All HTML documents intended for browser print-to-PDF MUST include:

**1. Force background printing:**

```css
@media print {
  * {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
    color-adjust: exact !important;
  }
}
```

**2. Explicit A4 page structure** (browser @page CSS is unreliable for headers/footers):

```css
.page {
  width: 210mm;
  min-height: 297mm;
  background: white;
  margin: 10px auto;
  position: relative;
  display: flex;
  flex-direction: column;
  counter-increment: page-counter;
}

@media print {
  .page {
    margin: 0;
    page-break-after: always;
    overflow: visible; /* NEVER overflow: hidden — clips content silently */
  }
  .page:last-child {
    page-break-after: avoid;
  }
}
```

**NEVER use `overflow: hidden` on `.page` or `.page-content` in print mode.** Different browser print engines, font fallback, and user scaling can push content slightly beyond expected bounds. Hidden overflow silently truncates text without visual warning. Use `overflow: visible` and rely on page breaks.

**NEVER use fixed `height: 297mm` on `.page` in print mode.** Use `min-height` only. Fixed height + flex children = content truncation when rendering varies across browsers/DPI.

**3. Visible page headers and footers with CSS counters** (NOT @page CSS — browsers ignore those):

```css
body {
  counter-reset: page-counter;
}
.page {
  counter-increment: page-counter;
}
.page-number::after {
  content: counter(page-counter);
}
```

```html
<div class="page">
  <div class="page-header">
    <span>Lifetime Oy | Document Title</span>
    <span>Confidential | Page <span class="page-number"></span></span>
  </div>
  <div class="page-content"><!-- content --></div>
  <div class="page-footer">
    <span>© Lifetime Oy 2026</span>
    <span>Confidential</span>
  </div>
</div>
```

**NEVER hard-code page numbers** (e.g., "Page 3 of 5"). Use CSS counters so numbers stay accurate when content changes.

**Why:** Browser print-to-PDF ignores CSS `@page` rules for headers, footers, and page counters. Explicit page divs with visible header/footer elements render reliably in Chrome, Edge, and Firefox print-to-PDF.

**Reference implementation:** `docs/briefs/construction-compliance-brief-pia.html`

### 8.5 Conversion Scripts

**Standard script:** `scripts/Generate-PDFs.ps1` (PowerShell, v1.5)

| Feature         | Detail                                               |
| --------------- | ---------------------------------------------------- |
| Engine choice   | `-Engine html` (default) or `-Engine wkhtmltopdf`    |
| Source files    | 16 markdown files (admin manuals, sales, investor)   |
| Output location | `F:\Proton\Proton\My files\2026\generated-pdfs\`     |
| Skip unchanged  | Compares source vs output timestamps                 |
| Auto-open       | `-OpenNew` opens changed files in Edge               |
| DWS branding    | Inline CSS with brand colors                         |
| Pandoc flags    | Disables YAML parsing, enables TOC, smart typography |

**Integration:**

- Called by `Sync-ToProton.ps1 -GeneratePDFs`
- Runs automatically on Windows login via `Startup-DailySync.bat`
- VS Code task: "Generate PDFs (pandoc)" or "Sync + Generate PDFs"

### 8.6 Quality Checklist

Before finalizing any PDF document, verify:

- [ ] File size < 10 MB (preferably 1-5 MB)
- [ ] Inter font loads (self-hosted `@font-face` for confidential docs, Google Fonts CDN for public)
- [ ] No external network requests in confidential documents (no Google Fonts `<link>`)
- [ ] `print-color-adjust: exact` in `@media print` block
- [ ] All backgrounds render in print preview (cover pages, table headers)
- [ ] Explicit `<div class="page">` structure with visible headers/footers (NOT @page CSS)
- [ ] No `overflow: hidden` on `.page` or `.page-content` (clips content silently in print)
- [ ] No fixed `height: 297mm` in print — use `min-height` only
- [ ] Page numbers use CSS counters (never hard-coded)
- [ ] All tables render correctly
- [ ] Page breaks are appropriate (one `page-break-after: always` per page div)
- [ ] Headers and footers are consistent across all pages
- [ ] Images are clear and properly sized
- [ ] Code blocks are formatted and readable
- [ ] Links are preserved (if applicable)
- [ ] Table of contents is accurate
- [ ] Document metadata is included
- [ ] Professional styling applied (Inter font, DWS brand colors)

### 8.7 Naming Convention for PDFs

**Format:** `[CATEGORY]-[Project]-[Type]-[Year]-[Version].pdf`

**Examples:**

- `DWS-IQ6-Investor-Pitch-Deck-2025-OPTIMIZED.pdf`
- `ADMIN-MANUAL-DWS6-COM-2025-v1.pdf`
- `THESIS-OUTLINE-EN-2025-FINAL.pdf`

**Rules:**

- Use hyphens between words
- Include year for version tracking
- Add descriptive suffixes: OPTIMIZED, FINAL, DRAFT
- Maintain consistency with source markdown filename

### 8.8 File Organization

```
project-root/
├── docs/                          # Source markdown files
├── docs-pdf/                      # Generated PDF files
├── scripts/
│   └── create_pdf.py             # Conversion script
└── investor-outreach/
    ├── *.md                       # Markdown sources
    ├── *.html                     # Generated HTML (intermediate)
    ├── *.pdf                      # Final PDFs
    └── PDF_CREATION_GUIDE.md     # Conversion instructions
```

### 8.9 Automation

**For frequent PDF generation, create GitHub Action:**

```yaml
name: Generate PDF Documents

on:
  push:
    paths:
      - "docs/**/*.md"
      - "investor-outreach/**/*.md"
  workflow_dispatch:

jobs:
  generate-pdfs:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup Python
        uses: actions/setup-python@v5
        with:
          python-version: "3.11"
      - name: Install dependencies
        run: pip install markdown weasyprint
      - name: Generate PDFs
        run: python scripts/create_pdf.py
      - name: Commit PDFs
        run: |
          git config user.name "GitHub Actions"
          git config user.email "actions@github.com"
          git add *.pdf
          git commit -m "Auto-generate PDFs from markdown"
          git push
```

### 8.10 Distribution

**For investor and client documents:**

- Store PDFs in appropriate folders (e.g., `investor-outreach/`)
- Keep file sizes optimized for email distribution
- Version control PDFs for audit trail
- Include metadata in filename for easy identification

---

## 9. Examples

### 9.1 Complete Document Example

```markdown
# Admin Manual: DWS6.com Deployment

---

# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:

- Version: 1.0 | Tool: Cursor AI | Session: 2025-12-30 | Date: 30.12.2025 | Changes: Initial creation

Session Links & References:

- Cursor AI (2025-12-30): https://github.com/blogtheristo/dws6/commits/main
- View on GitHub: https://github.com/blogtheristo/dws6/blob/main/Admin/ADMIN_MANUAL_DWS6_COM.md

Document Status:

- Created: 30.12.2025
- Last Modified: 30.12.2025
- Language: English & Finnish (bilingual)
- Languages Available: English, Suomi
- Publication Status: ACTIVE

---

**Version:** 1.0  
**Purpose:** Admin and deployment guide for dws6.com  
**Audience:** DevOps, System Administrators  
**Updated:** 30.12.2025

## Table of Contents

[... rest of document ...]
```

### 9.2 Complete Workflow Example

```yaml
# Workflow: Daily Security Scan
# Version: v1
# Created: 2025-12-30
# Last Modified: 2025-12-30
# Purpose: Automated daily security scanning
# Schedule: Daily at 02:00 UTC
# Dependencies: snyk, npm audit
# Maintainer: Security Team

# VERSION HISTORY:
# v1 (2025-12-30): Initial creation

name: Security Scan - Daily v1

on:
  schedule:
    - cron: "0 2 * * *" # Daily at 02:00 UTC
  workflow_dispatch:

jobs:
  security-scan:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Run security scan
        run: npm audit

      - name: Report results
        run: echo "Security scan completed"
```

### 9.3 Complete Script Example

```python
"""
Script: Security Audit
Version: v1
Created: 2025-12-30
Author: Cursor AI
Purpose: Comprehensive security audit of DWS6 project
Dependencies: python3, requests, pyyaml
Usage: python security_audit_v1.py [--output report.md]

VERSION HISTORY:
v1 (2025-12-30): Initial creation
"""

import sys
import argparse
from datetime import datetime

def main():
    """Main function"""
    print(f"Security Audit v1 - {datetime.now()}")
    # ... audit logic ...

if __name__ == "__main__":
    main()
```

---

## 10. Knowledge Management & Storage

### 10.1 Purpose / Tarkoitus

Establishes the decision framework for where enterprise knowledge should be stored: database vs. document files.

Määrittää päätökehyksen sille, mihin yritystietoa tulisi tallentaa: tietokantaan vai dokumenttitiedostoihin.

### 10.2 The Storage Decision Matrix

Based on the insight that **"off-the-shelf LLMs don't work for enterprise AI"** (Alex Karp, Palantir CEO), we must build an orchestration layer that understands our enterprise-specific knowledge.

**Decision Criteria:**

| Use Case                    | Storage Location              | Reasoning                                                |
| --------------------------- | ----------------------------- | -------------------------------------------------------- |
| **Structured Intelligence** | Database (Supabase)           | Queryable, linkable to objects, searchable in dashboards |
| **Narrative Context**       | Docs Files (.md)              | Flow of argument, white papers, briefings                |
| **Core Artifacts**          | Database with Docs Reference  | Metadata in DB, full content in versioned .md            |
| **Regulatory Documents**    | Docs Files with DB Index      | Audit trail, version control, PDF generation             |
| **Training Data**           | Database (Vector Store)       | Embedding-ready, RAG-optimized                           |
| **Field Notes**             | Hybrid (DB → Docs → Artifact) | Captured in DB, processed to .md, refined to artifact    |

### 10.3 The Hybrid Approach (Recommended)

**For DWS7 and beyond:**

```
┌─────────────┐
│   Capture   │  Database (Supabase)
│  (Real-time)│  - Quick entry via mobile/web
│             │  - Timestamped, geo-tagged
└──────┬──────┘  - Linked to customer/project objects
       │
       ▼
┌─────────────┐
│  Processing │  Docs Files (Markdown)
│   (Daily)   │  - Export to /docs/field-notes/
│             │  - Apply ontology tags
└──────┬──────┘  - Add context and analysis
       │
       ▼
┌─────────────┐
│ Refinement  │  Core Artifacts
│ (Weekly)    │  - Elevated to /artifacts/[CATEGORY]/
│             │  - Enterprise knowledge base
└─────────────┘  - LWM training pipeline
```

### 10.4 Example: User Note from Alex Karp Quote

**Scenario:** You want to save Karp's quote about AI bubbles and enterprise ontology.

**Decision Path:**

1. **Initial Capture:** Database

   ```sql
   INSERT INTO field_notes (author, content, tags, sector)
   VALUES ('you@dws.com', 'Karp quote about...', ARRAY['AI', 'Ontology', 'Enterprise'], 'Strategy');
   ```

2. **Processing:** Markdown Document

   ```markdown
   # Field Note: Palantir CEO on Enterprise AI

   [Full analysis as shown in your message]
   ```

   Saved to: `/docs/field-notes/2026-01-21-karp-enterprise-ai.md`

3. **Refinement:** Core Artifact

   ```markdown
   # Artifact: Enterprise AI Implementation Strategy

   ART-2026-001
   [Extracted principles for DWS implementation]
   ```

   Saved to: `/artifacts/STRATEGY/ART-2026-001-enterprise-ai-ontology.md`

### 10.5 Directory Structure

```
dws6/
├── artifacts/               # Core Artifacts (validated knowledge)
│   ├── FINANCIAL_SERVICES/
│   ├── MANUFACTURING/
│   ├── STRATEGY/
│   ├── COMPLIANCE/
│   └── README.md
├── docs/
│   ├── field-notes/         # Processed daily/weekly notes
│   │   ├── 2026-01-21-karp-enterprise-ai.md
│   │   ├── 2026-01-22-customer-london.md
│   │   └── README.md
│   └── ontology/
│       └── ONTOLOGY.md      # Ontology framework (see Section 11)
└── supabase/
    └── migrations/
        └── 014_ontology_lwm.sql  # Database schema
```

### 10.6 When to Use Database vs. Docs

**Use Database when:**

- Need real-time capture (mobile field notes)
- Require structured queries
- Building dashboards/reports
- Linking to other objects (customers, projects)
- Training AI/LLM models (vector embeddings)

**Use Docs Files when:**

- Writing narrative content
- Creating white papers, briefings
- Need version control history
- Generating PDFs for distribution
- Long-form documentation

**Use Both (Hybrid) when:**

- Capturing enterprise knowledge (field notes → artifacts)
- Building an ontology (metadata in DB, content in .md)
- Regulatory documentation (index in DB, files as .md)

---

## 11. Core Artifacts

### 11.1 Purpose / Tarkoitus

Core Artifacts are **validated pieces of enterprise knowledge** that form the foundation of the Lifetime World Model (LWM). They are the answer to Alex Karp's challenge: building a software layer to orchestrate LLMs "in a language your enterprise understands."

Core Artifacts ovat **validoituja yritystiedon palasia**, jotka muodostavat Lifetime World Model (LWM) -järjestelmän perustan.

### 11.2 What is a Core Artifact?

A Core Artifact is:

- **Validated knowledge** from field experience
- **Enterprise-specific** (not generic AI knowledge)
- **Actionable** (contains orchestration rules)
- **Versioned** (evolves over time)
- **Traceable** (linked to source field notes)

### 11.3 Artifact Naming Convention

**Format:**

```
ART-[YYYY]-[NNN]-[descriptive-name].md
```

**Components:**

| Component            | Required       | Description                     | Examples                |
| -------------------- | -------------- | ------------------------------- | ----------------------- |
| **ART**              | ✅ Yes         | Prefix for all artifacts        | `ART`                   |
| **YYYY**             | ✅ Yes         | Year created                    | `2026`                  |
| **NNN**              | ✅ Yes         | Sequential number (zero-padded) | `001`, `042`, `123`     |
| **descriptive-name** | ⚠️ Recommended | Brief topic description         | `uk-cross-border-rules` |

**Examples:**

```
ART-2026-001-enterprise-ai-ontology.md
ART-2026-002-uk-cross-border-underwriting.md
ART-2026-003-eu-gdpr-updates.md
```

### 11.4 Artifact Categories

**Location:** `/artifacts/[CATEGORY]/`

| Category               | Purpose                                | Examples                         |
| ---------------------- | -------------------------------------- | -------------------------------- |
| **FINANCIAL_SERVICES** | Banking, insurance, underwriting       | Cross-border rules, compliance   |
| **MANUFACTURING**      | Production, quality, supply chain      | Process optimization, safety     |
| **HEALTHCARE**         | Medical, diagnostics, patient care     | Regulatory compliance, protocols |
| **COMPLIANCE**         | Legal, regulatory, audit               | GDPR, FCA rules, SOX             |
| **STRATEGY**           | Business strategy, competitive intel   | Market analysis, partnerships    |
| **TECHNOLOGY**         | Architecture, security, infrastructure | API design, security protocols   |
| **SALES**              | Customer insights, competitive wins    | Objection handling, pricing      |
| **GENERAL**            | Cross-functional knowledge             | Best practices, templates        |

### 11.5 Artifact File Structure

**Required Sections:**

```markdown
# Artifact: [Descriptive Title]

---

## METADATA (The "Coordinates")

- **Artifact ID:** ART-YYYY-NNN
- **Temporal Stamp:** ISO8601 timestamp
- **Ontology Anchors:**
  - Object: [e.g., Financial_Services]
  - Sector: [e.g., Underwriting]
  - Geography: [e.g., UK, London]
  - Regulatory Context: [e.g., FCA 2025 Cross-Border Rules]
- **Safety Status:** ✅ Verified | 🧪 Experimental | ⚠️ Deprecated
- **Confidence Score:** 0.XX (0.0-1.0)
- **Source:** [Field Note reference]

---

## NARRATIVE (The "Divine Story")

### The Observation

[What was learned from the field]

### Why It Failed

[If applicable: why generic AI/process failed]

### The Ground Truth

[Reality that contradicts generic assumptions]

---

## LOGIC (The "Orchestration Rule")

### Proposed Rule

[If-then logic, code, or decision tree]

### LWM Update Instruction

[How this updates the world model]

---

## VALIDATION & FEEDBACK

[Usage history, success rate, confidence updates]

---

## RELATED ARTIFACTS

- **Supersedes:** [Previous artifact IDs]
- **Related:** [Related artifact IDs]
- **References:** [External documents]

---

## VERSION HISTORY

- **v1.0** (YYYY-MM-DD): [Changes]
```

### 11.6 Artifact Lifecycle

```
1. CAPTURE:    Field Note → Database
2. PROCESS:    Database → /docs/field-notes/[date]-[topic].md
3. ELEVATE:    Field Note → Core Artifact (if validated)
4. VALIDATE:   Usage feedback → Confidence score update
5. EVOLVE:     New version if logic changes
6. DEPRECATE:  Mark as deprecated if superseded
```

### 11.7 Quality Standards

**Before creating a Core Artifact:**

- [ ] Validated by at least 2 team members
- [ ] Includes specific business logic (not generic advice)
- [ ] Has clear ontology anchors (geography, sector, etc.)
- [ ] Contains source attribution (field note, regulation, etc.)
- [ ] Assigned initial confidence score (0.5-0.75 for new)
- [ ] Linked to related artifacts or regulations
- [ ] Follows naming convention
- [ ] Stored in correct category folder

**Artifact Review Cycle:**

- **Every 90 days:** Review all artifacts
- **Flag for update:** If used but confidence < 0.7
- **Flag for deprecation:** If unused for 180 days
- **Immediate review:** If world model collision detected

---

## 12. Field Notes

### 12.1 Purpose / Tarkoitus

Field Notes are the **raw sensory input** for the Lifetime World Model. They capture reality from the battlefield (production, customer interactions, incidents) that off-the-shelf LLMs cannot know.

Field Notes ovat **raakaa sensoriinputia** Lifetime World Model -järjestelmälle.

### 12.2 When to Create a Field Note

**Create a field note when:**

- Customer says something unexpected
- LLM/AI fails to handle a situation correctly
- Production incident reveals a knowledge gap
- Regulatory change affects operations
- Competitive intelligence is gathered
- Edge case is discovered

**Time requirement:** Within 24 hours of the event

### 12.3 Field Note Naming Convention

**Format:**

```
YYYY-MM-DD-[brief-topic].md
```

**Examples:**

```
2026-01-21-karp-enterprise-ai.md
2026-01-22-london-customer-cross-border.md
2026-01-23-production-incident-llm-hallucination.md
```

**Location:** `/docs/field-notes/`

### 12.4 Field Note Templates

**Three primary templates:**

1. **Customer Interaction Template**
   - For sales calls, support tickets, feedback
   - Focus: Customer quote, problem/insight, business impact

2. **Production Incident Template**
   - For system failures, AI errors, edge cases
   - Focus: What happened, root cause, prevention

3. **Regulatory Change Template**
   - For new laws, compliance updates, policy changes
   - Focus: Summary, impact, required actions

_Full templates available in ONTOLOGY.md Section 10_

### 12.5 Required Elements

**Every field note MUST include:**

- **Date:** ISO format (YYYY-MM-DD)
- **Author:** Your name/email
- **Location:** Geographic location (if applicable)
- **Context:** Customer/project/system name
- **Ontology Tags:** Geography, sector, entities
- **The Story:** What happened (chronological)
- **The Insight:** Why this matters
- **Next Steps:** Follow-up actions

### 12.6 Ontology Tagging

**Purpose:** Make field notes searchable and linkable.

**Required Tags:**

```markdown
## Ontology Tags

- **Geography:** [Continent > Country > City]
- **Sector:** [Industry > Vertical > Use Case]
- **Entities:** [People, Organizations, Products, Regulations]
- **Temporal Context:** [Date, Regulatory Period, Fiscal Year]
- **Confidence:** High | Medium | Low
```

**Example:**

```markdown
## Ontology Tags

- **Geography:** Europe > UK > London
- **Sector:** Financial_Services > Insurance > Underwriting
- **Entities:** Customer ABC Ltd, FCA, GDPR, DWS-IQ6
- **Temporal Context:** 2026-Q1, Post-2025 UK FCA Rules
- **Confidence:** High
```

### 12.7 From Field Note to Core Artifact

**Elevation Criteria:**

A field note should be elevated to a Core Artifact when:

- ✅ Used 3+ times in decision-making
- ✅ Validated by 2+ team members
- ✅ Contains reusable business logic
- ✅ Addresses a recurring pattern or gap
- ✅ Has regulatory or compliance importance

**Process:**

```
Field Note → Team Review → Draft Artifact → Validate → Publish
```

1. **Team Review:** Weekly review meeting to identify candidates
2. **Draft Artifact:** Use artifact template (Section 11.5)
3. **Validate:** Test the logic on 2-3 cases
4. **Publish:** Add to `/artifacts/`, update database, generate embeddings

---

## 13. Enforcement

### 10.1 Automated Checks

**Pre-commit hooks:**

```bash
# Check document header
if ! grep -q "VERSION AND AGENT HISTORY" "$file"; then
    echo "ERROR: Missing VERSION AND AGENT HISTORY header in $file"
    exit 1
fi

# Check workflow naming
if [[ "$file" =~ \.yml$ ]] && [[ ! "$file" =~ -v[0-9]+-[0-9]{4}-[0-9]{2}-[0-9]{2}\.yml$ ]]; then
    echo "ERROR: Workflow $file does not follow naming standard"
    exit 1
fi
```

### 10.2 Manual Review Checklist

**Before committing any document:**

- [ ] Document header is complete
- [ ] Version number is correct
- [ ] Session/tool information is included
- [ ] Date is in DD.MM.YYYY format
- [ ] Language is specified
- [ ] Publication status is set
- [ ] Filename follows naming convention
- [ ] Metadata is complete

**Before committing any workflow:**

- [ ] Workflow name follows standard
- [ ] Version is included in filename
- [ ] Date is included in filename
- [ ] Workflow header is complete
- [ ] Version history is documented
- [ ] Purpose is clearly stated
- [ ] Dependencies are listed

### 10.3 Exceptions

**Exceptions to this standard:**

1. **Third-party files** - Files from external sources (keep original naming)
2. **Generated files** - Auto-generated files (e.g., `package-lock.json`)
3. **Legacy files** - Existing files (can be gradually migrated)
4. **Binary files** - Images, PDFs, etc. (use descriptive names)

**To request an exception:**

1. Document the reason
2. Get approval from project lead
3. Add exception to `.gitignore` or document in README

---

## 14. LLM Model Versioning

### 14.1 Purpose / Tarkoitus

Establishes standards for tracking which LLM models were used to create or modify documents, ensuring reproducibility and enabling systematic updates when models change.

Määrittää standardit LLM-mallien seurantaan dokumenttien luomisessa ja muokkaamisessa.

### 14.2 Why Track LLM Versions?

1. **Reproducibility** - Know which model produced content for quality analysis
2. **Update Triggers** - Identify documents needing review when LLM capabilities improve
3. **Compliance** - EU AI Act Article 12 requires automatic logging of AI system events
4. **Quality Control** - Track content quality across different model versions
5. **Training Data** - Identify which outputs can be used for LWM training

### 14.3 LLM Model Tracking in Document Header

**Extended header format:**

```markdown
Sessions & Modifications:

- Version: X.Y | Tool: [Tool Name] ([LLM Model]) | Session: [ID] | Date: DD.MM.YYYY | Changes: [Description]
```

**Example:**

```markdown
Sessions & Modifications:

- Version: 1.0 | Tool: Claude Code (Claude Opus 4.5) | Session: claude/feature-xyz | Date: 04.02.2026 | Changes: Initial creation
- Version: 1.1 | Tool: Cursor AI (Claude Sonnet 3.5) | Session: 2026-02-05 | Date: 05.02.2026 | Changes: Added examples
- Version: 1.2 | Tool: Manual | Session: N/A | Date: 06.02.2026 | Changes: Human review
```

### 14.4 Supported LLM Models Registry

**Active Models (as of Q1 2026):**

| Model Family           | Model ID                 | Status          | Use Case                         |
| ---------------------- | ------------------------ | --------------- | -------------------------------- |
| **Claude (Anthropic)** | claude-opus-4-5-20251101 | ✅ Primary      | Complex reasoning, documentation |
| **Claude (Anthropic)** | claude-sonnet-3-5        | ✅ Active       | Code generation, fast tasks      |
| **Gemini (Google)**    | gemini-2.0-flash         | ✅ Active       | Multimodal, fast inference       |
| **Groq**               | llama-3.3-70b            | ✅ Active       | High-speed inference             |
| **Qwen (Alibaba)**     | qwen3-coder-480b         | 🧪 Evaluation   | Agentic coding, local dev        |
| **Local LLM**          | Various                  | ⚠️ Experimental | Edge deployment, privacy         |

### 14.5 LLM Version Update Workflow

**When a new LLM version is released:**

```
1. ASSESS:    Review release notes for capability changes
2. TEST:      Run validation on sample documents
3. IDENTIFY:  Query documents created with previous version
4. PRIORITIZE: Rank by impact (regulatory > customer > internal)
5. UPDATE:    Re-generate or review flagged documents
6. VALIDATE:  Human review for critical documents
7. ARCHIVE:   Keep previous version for audit trail
```

**Database Query for Version Tracking:**

```sql
-- Find documents created with specific LLM model
SELECT filename, version, created_date, llm_model
FROM documents
WHERE llm_model LIKE 'claude-opus-4%'
  AND created_date < '2026-02-01'
ORDER BY priority DESC;
```

### 14.6 LLM Model Deprecation

**When a model is deprecated:**

| Action                   | Timeline        | Responsibility     |
| ------------------------ | --------------- | ------------------ |
| Announce deprecation     | Immediately     | Documentation team |
| Identify affected docs   | Within 1 week   | Automated scan     |
| Review critical docs     | Within 2 weeks  | Human review       |
| Update document registry | Within 1 month  | Database admin     |
| Archive old model info   | Within 3 months | Archive team       |

### 14.7 Product Version Change Workflow

**When DWS IQ 6 version changes (e.g., v6 → v7):**

```
1. CREATE:    New version branch in documentation
2. AUDIT:     Review all product-specific references
3. UPDATE:    Version numbers, screenshots, API examples
4. REGENERATE: Re-run LLM on affected sections (with new model)
5. VALIDATE:  Cross-check with product team
6. PUBLISH:   Release alongside product update
7. REDIRECT:  Update document index and links
```

---

## 15. Localization & Multi-Language Management

### 15.1 Purpose / Tarkoitus

Establishes standards for managing documentation across 27 EU languages, ensuring consistency and enabling efficient translation workflows.

Määrittää standardit dokumentaation hallintaan 27 EU-kielellä.

### 15.2 Supported Languages (EU27 + English)

| Code | Language                | Region               | Priority     |
| ---- | ----------------------- | -------------------- | ------------ |
| `EN` | English                 | International        | ⭐ Primary   |
| `FI` | Finnish (Suomi)         | Finland              | ⭐ Primary   |
| `SV` | Swedish (Svenska)       | Sweden, Finland      | 🔵 High      |
| `DE` | German (Deutsch)        | Germany, Austria     | 🔵 High      |
| `FR` | French (Français)       | France, Belgium      | 🔵 High      |
| `NL` | Dutch (Nederlands)      | Netherlands, Belgium | 🔵 High      |
| `ES` | Spanish (Español)       | Spain                | 🟢 Medium    |
| `IT` | Italian (Italiano)      | Italy                | 🟢 Medium    |
| `PL` | Polish (Polski)         | Poland               | 🟢 Medium    |
| `PT` | Portuguese (Português)  | Portugal             | 🟢 Medium    |
| `CS` | Czech (Čeština)         | Czech Republic       | 🟡 Standard  |
| `DA` | Danish (Dansk)          | Denmark              | 🟡 Standard  |
| `EL` | Greek (Ελληνικά)        | Greece, Cyprus       | 🟡 Standard  |
| `ET` | Estonian (Eesti)        | Estonia              | 🟡 Standard  |
| `HU` | Hungarian (Magyar)      | Hungary              | 🟡 Standard  |
| `LT` | Lithuanian (Lietuvių)   | Lithuania            | 🟡 Standard  |
| `LV` | Latvian (Latviešu)      | Latvia               | 🟡 Standard  |
| `RO` | Romanian (Română)       | Romania              | 🟡 Standard  |
| `SK` | Slovak (Slovenčina)     | Slovakia             | 🟡 Standard  |
| `SL` | Slovenian (Slovenščina) | Slovenia             | 🟡 Standard  |
| `BG` | Bulgarian (Български)   | Bulgaria             | ⚪ On-demand |
| `HR` | Croatian (Hrvatski)     | Croatia              | ⚪ On-demand |
| `GA` | Irish (Gaeilge)         | Ireland              | ⚪ On-demand |
| `MT` | Maltese (Malti)         | Malta                | ⚪ On-demand |

### 15.3 File Naming for Localized Documents

**Format:**

```
[CATEGORY]_[NAME]_[LANG]_v[VERSION].md
```

**Examples:**

```
ADMIN_MANUAL_AUTHENTICATION_EN_v1.md     # English (source)
ADMIN_MANUAL_AUTHENTICATION_FI_v1.md     # Finnish
ADMIN_MANUAL_AUTHENTICATION_DE_v1.md     # German
ADMIN_MANUAL_AUTHENTICATION_SV_v1.md     # Swedish
```

### 15.4 Localization Tracking Database Schema

```sql
CREATE TABLE document_translations (
    id UUID PRIMARY KEY,
    source_doc_id UUID REFERENCES documents(id),
    source_language VARCHAR(5) NOT NULL DEFAULT 'EN',
    target_language VARCHAR(5) NOT NULL,
    translation_status VARCHAR(20) NOT NULL,
    -- Status: PENDING, IN_PROGRESS, TRANSLATED, REVIEWED, PUBLISHED
    source_version VARCHAR(10),
    translated_version VARCHAR(10),
    translator_type VARCHAR(20), -- HUMAN, LLM, HYBRID
    llm_model VARCHAR(50),
    translated_date TIMESTAMP,
    reviewed_by VARCHAR(100),
    reviewed_date TIMESTAMP,
    sync_status VARCHAR(20), -- SYNCED, OUT_OF_SYNC, NEEDS_UPDATE
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Index for finding out-of-sync translations
CREATE INDEX idx_sync_status ON document_translations(sync_status);
CREATE INDEX idx_source_doc ON document_translations(source_doc_id);
```

### 15.5 Translation Status Tracking

| Status        | Icon | Description                              |
| ------------- | ---- | ---------------------------------------- |
| `PENDING`     | ⏳   | Translation not started                  |
| `IN_PROGRESS` | 🔄   | Translation in progress                  |
| `TRANSLATED`  | ✅   | LLM/human translation complete           |
| `REVIEWED`    | 👁️   | Human review completed                   |
| `PUBLISHED`   | 🚀   | Ready for production                     |
| `OUT_OF_SYNC` | ⚠️   | Source updated, translation needs update |
| `DEPRECATED`  | ❌   | No longer maintained                     |

### 15.6 Localization Dashboard Query

```sql
-- Language coverage report
SELECT
    d.filename,
    d.version AS source_version,
    COUNT(DISTINCT dt.target_language) AS languages_translated,
    27 - COUNT(DISTINCT dt.target_language) AS languages_missing,
    SUM(CASE WHEN dt.sync_status = 'OUT_OF_SYNC' THEN 1 ELSE 0 END) AS needs_update
FROM documents d
LEFT JOIN document_translations dt ON d.id = dt.source_doc_id
WHERE d.language = 'EN'
GROUP BY d.id, d.filename, d.version
ORDER BY languages_missing DESC;
```

### 15.7 Translation Workflow

**For new documents:**

```
1. CREATE:     Write source document (EN)
2. REGISTER:   Add to document_translations table
3. PRIORITIZE: Based on language priority (Primary → High → Medium)
4. TRANSLATE:  LLM first pass (Gemini/Claude)
5. REVIEW:     Native speaker review for High priority
6. PUBLISH:    Deploy to localized folder
7. MONITOR:    Track sync status
```

**For document updates:**

```
1. DETECT:     Source document version changed
2. FLAG:       Mark all translations as OUT_OF_SYNC
3. DIFF:       Calculate changed sections
4. TRANSLATE:  Only update changed sections
5. REVIEW:     Human review for significant changes
6. SYNC:       Update translated_version, reset sync_status
```

### 15.8 Directory Structure for Localized Docs

```
docs/
├── en/                           # English (source)
│   ├── admin/
│   ├── field-notes/
│   └── architecture/
├── fi/                           # Finnish
│   ├── admin/
│   ├── field-notes/
│   └── architecture/
├── de/                           # German
│   ├── admin/
│   └── ...
├── localization/
│   ├── TRANSLATION_STATUS.md     # Current status dashboard
│   ├── GLOSSARY_MASTER.json      # Term consistency
│   └── STYLE_GUIDE_[LANG].md     # Per-language style guides
└── _templates/
    └── translation-request.md    # Template for translation requests
```

### 15.9 Glossary Management

**Master glossary location:** `/docs/localization/GLOSSARY_MASTER.json`

**Format:**

```json
{
  "terms": [
    {
      "en": "Lifetime World Model",
      "fi": "Elinikäinen maailmanmalli",
      "de": "Lebenslang-Weltmodell",
      "sv": "Livstidsvärldsmodell",
      "context": "Core AI concept - do not translate literally",
      "abbreviation": "LWM"
    },
    {
      "en": "Climate compliance",
      "fi": "Ilmastovaatimustenmukaisuus",
      "de": "Klimakonformität",
      "context": "EU regulatory term"
    }
  ]
}
```

### 15.10 Quality Assurance for Translations

**Review checklist:**

- [ ] Technical terms match glossary
- [ ] Product names unchanged (DWS IQ 6, Firehorse)
- [ ] Date formats localized (DD.MM.YYYY for EU)
- [ ] Currency formats correct
- [ ] Legal/regulatory terms verified by native speaker
- [ ] Screenshots match target language UI (if applicable)
- [ ] Links updated to localized versions

---

## 16. Document Index

### 16.1 Purpose / Tarkoitus

A centralized index of all documentation for faster search and discovery.

Keskitetty hakemisto kaikista dokumenteista nopeampaa hakua varten.

### 16.2 Master Document Index

**Location:** `/docs/Document-index.md`

This index is auto-generated and manually curated to provide:

- Complete inventory of all markdown files
- Category classification
- Status tracking
- Quick links

**See:** [Document-index.md](/docs/Document-index.md)

### 16.3 Index Update Workflow

**Automated (weekly):**

```bash
# Generate document inventory
find . -name "*.md" -type f | sort > /tmp/md_files.txt
# Compare with current index
diff /tmp/md_files.txt docs/Document-index.md
```

**Manual triggers:**

- New document created → Add to index
- Document deprecated → Update status in index
- Major restructuring → Full index regeneration

---

## 17. Web Content Index Check

### 17.1 Purpose / Tarkoitus

Every document update MUST be followed by a **web content check** — a review of which live web pages are affected by the change.

Jokaisen dokumenttipäivityksen jälkeen TÄYTYY tehdä **verkkosisältötarkistus** — selvittää, mitkä live-verkkosivut muutoksesta vaikuttuvat.

### 17.2 Web Content Index

**Location:** `docs/WEB_CONTENT_INDEX.md`

This index maps every repository document to its corresponding web domain pages (dws10.com, dws6.com, onelifetime.world). It is the authoritative source for:

- Which web pages reflect which documents
- What to review after a document update
- Which pages are web-only (no .md counterpart)

### 17.3 Post-Update Web Check Procedure

**After every document update** (commit or PR), the author MUST:

```
POST-UPDATE WEB CHECK

Step 1 — Look up document in docs/WEB_CONTENT_INDEX.md
Step 2 — For each mapped web page:
          a. Check: does page content reflect the doc change?
          b. If YES → no action, record "reviewed, no change"
          c. If NO  → update the HTML page (root first, then landing-pages/)
Step 3 — Record in PR description:
          "Web check: /page-name reviewed [no change | updated]"
Step 4 — Run: diff <root-page> <landing-pages-copy>  → must be empty
```

**Skip condition:** If the document is internal-only (marked `—` in all web columns), no web check is needed — state "internal only" in PR description.

### 17.4 Agent Skill

Run `/content-index check <document-path>` to look up web impact for any document.

```bash
/content-index check DWS_BRAND_STANDARD.md
# → Lists: dws10.com/gamma/, dws6.com/shared/
# → Instruction: Review these pages for content currency
```

### 17.5 Content-Index Update Trigger

**Update `docs/WEB_CONTENT_INDEX.md` when:**

- A new `.md` document is created that has web counterparts
- A new web page is launched that corresponds to a doc
- A document is archived (remove or mark row)
- A web page is renamed or deleted

---

## 18. Learn HTML Generation

### 18.1 Rule / Sääntö

**Every standards document update MUST produce a new versioned HTML artifact in `Learn/`.**

This ensures:

- AI agents and humans can read the latest standard in rendered HTML
- Morning briefing email links to current standards
- Version history is preserved (never overwrite old versions)

**Jokainen standardidokumentin päivitys TÄYTYY tuottaa uuden versioidun HTML-artefaktin kansioon `Learn/`.**

### 18.2 Which Documents Require Learn/ HTML

| Document                              | Learn/ HTML Required     | Pattern                                          |
| ------------------------------------- | ------------------------ | ------------------------------------------------ |
| `DWS_DOCUMENT_STANDARD.md`            | ✅ Yes                   | `Learn/DWS_DOCUMENT_STANDARD_v{VERSION}.html`    |
| `DWS_BRAND_STANDARD.md`               | ✅ Yes                   | `Learn/DWS_BRAND_STANDARD_v{VERSION}.html`       |
| `DWS_SECURITY_STANDARD.md`            | ✅ Yes                   | `Learn/DWS_SECURITY_STANDARD_v{VERSION}.html`    |
| `Admin/ADMIN_MANUAL.md`               | ✅ Yes                   | `Learn/ADMIN_MANUAL_v{VERSION}.html`             |
| `Admin/SECURITY_COMPLIANCE.md`        | ✅ Yes                   | `Learn/SECURITY_COMPLIANCE_v{VERSION}.html`      |
| `CLAUDE.md`                           | ✅ Yes                   | `Learn/CLAUDE_v{VERSION}.html`                   |
| `docs/Document-index.md`              | ✅ Yes                   | `Learn/Document-index_v{VERSION}.html`           |
| `docs/WEB_CONTENT_INDEX.md`           | ✅ Yes                   | `Learn/WEB_CONTENT_INDEX_v{VERSION}.html`        |
| Field notes (`docs/field-notes/*.md`) | ✅ Yes                   | `Learn/{date}-{slug}.html`                       |
| Thesis files                          | ✅ Yes — see Thesis Rule | `Learn/V3Thesis_EN_v{VERSION}.html` etc.         |
| `Store/*.md` product files            | ❌ No                    | These use YAML — built by build_store.py instead |
| Architecture docs (one-time)          | ⚠️ Optional              | Generate once on initial creation                |

### 18.3 Generation Method

**Preferred: Pandoc (automated)**

```bash
pandoc DWS_DOCUMENT_STANDARD.md \
  -f markdown -t html5 \
  --standalone \
  -o Learn/DWS_DOCUMENT_STANDARD_v1.7.html
```

**Alternative: Manual HTML**

When pandoc is unavailable, generate minimal but valid HTML:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>[Document Title] v[VERSION]</title>
    <style>
      body {
        font-family: system-ui, sans-serif;
        max-width: 900px;
        margin: 2rem auto;
        padding: 0 1rem;
      }
      pre {
        background: #f4f4f4;
        padding: 1rem;
        overflow-x: auto;
      }
      code {
        background: #f4f4f4;
        padding: 0.2em 0.4em;
      }
      h1,
      h2,
      h3 {
        border-bottom: 1px solid #eee;
        padding-bottom: 0.3em;
      }
    </style>
  </head>
  <body>
    <!-- Converted from [source.md] on [date] — DWS IQ 6 -->
    [HTML CONTENT]
  </body>
</html>
```

### 18.4 Versioning Rules

- **NEVER overwrite** an existing versioned file (e.g., `_v1.6.html`)
- **Always create a new file** with the new version number
- **Also update** the unversioned copy (e.g., `Learn/DWS_DOCUMENT_STANDARD.html`) so agents always have a stable URL
- For thesis files: follow the Thesis Update Rule (4 files together)

### 18.5 Morning Briefing Integration

The CEO Cockpit morning brief (06:00 Helsinki) includes a **Learn Artifacts** section showing recently updated HTML files with direct GitHub links.

When you publish a new Learn/ HTML:

- The morning briefing automatically detects files modified in the last 7 days
- It links to: `https://github.com/blogtheristo/dws6/blob/main/Learn/{filename}`

**Skill:** Run `/content-index learn` to see which Learn/ artifacts were published recently.

### 18.6 Learn Artifact Naming

```
Learn/[DOCUMENT_SLUG]_v[MAJOR].[MINOR].html    ← versioned (permanent)
Learn/[DOCUMENT_SLUG].html                      ← latest (overwrite allowed)
```

Examples:

```
Learn/DWS_DOCUMENT_STANDARD_v1.7.html   ← versioned
Learn/DWS_DOCUMENT_STANDARD.html        ← latest (always current)
Learn/WEB_CONTENT_INDEX_v1.0.html       ← versioned
Learn/WEB_CONTENT_INDEX.html            ← latest
```

---

## 19. Code Versioning & PR Traceability

### 19.1 Rule / Sääntö

All net-new production code files and all major rewrites MUST include a **Code Versioning Note** that ties the code to PR and commit lineage.

Jokaisen uuden tuotantokooditiedoston ja merkittävän uudelleenkirjoituksen TÄYTYY sisältää **Code Versioning Note**, joka sitoo koodin PR- ja commit-historiaan.

**Why:** Enables fast forensic search ("where did this come from?"), rollback targeting, and compliance-grade traceability.

### 19.2 Required Fields

Every Code Versioning Note MUST contain:

- `Code-Version` (semantic: `MAJOR.MINOR.PATCH`)
- `Introduced-In` (PR number, e.g. `PR-699`)
- `Branch` (e.g. `claude/pr-699`)
- `Commit` (short SHA at merge point when known)
- `Date` (`YYYY-MM-DD`)
- `Owner` (team or tool)
- `Env-Schema` (e.g. `env-v1.0`) if runtime config is required

### 19.3 Syntax-Safe Templates (CRITICAL)

Use language-appropriate comment syntax. Never insert markdown prose directly into executable syntax.

**TypeScript / JavaScript (`.ts`, `.tsx`, `.js`, `.jsx`):**

```ts
/**
 * CODE VERSIONING NOTE
 * Code-Version: 1.0.0
 * Introduced-In: PR-699
 * Branch: claude/pr-699
 * Commit: abc1234
 * Date: 2026-03-13
 * Owner: DWS Platform / AI Agent
 * Env-Schema: env-v1.0
 */
```

**Python (`.py`):**

```python
"""
CODE VERSIONING NOTE
Code-Version: 1.0.0
Introduced-In: PR-699
Branch: claude/pr-699
Commit: abc1234
Date: 2026-03-13
Owner: DWS Platform / AI Agent
Env-Schema: env-v1.0
"""
```

**SQL migrations (`.sql`):**

```sql
-- CODE VERSIONING NOTE
-- Code-Version: 1.0.0
-- Introduced-In: PR-699
-- Branch: claude/pr-699
-- Commit: abc1234
-- Date: 2026-03-13
-- Owner: DWS Platform / AI Agent
-- Env-Schema: env-v1.0
```

**Shell / YAML / Dockerfile:**

```text
# CODE VERSIONING NOTE
# Code-Version: 1.0.0
# Introduced-In: PR-699
# Branch: claude/pr-699
# Commit: abc1234
# Date: 2026-03-13
# Owner: DWS Platform / AI Agent
# Env-Schema: env-v1.0
```

### 19.4 Increment Rules for `Code-Version`

- Patch (`x.y.Z`): bug fix, no behavior contract change
- Minor (`x.Y.z`): additive behavior, backward compatible
- Major (`X.y.z`): breaking behavior/API/contract change

### 19.5 .env Versioning Policy

Runtime secret files are not versioned in Git, but the schema is.

- Never commit `.env` (secrets)
- Always version `.env.example` structure
- Track schema via `ENV_SCHEMA_VERSION` in `.env.example`
- Bump rules:
  - Major: breaking or renamed required variable
  - Minor: new optional/required variable added
  - Patch: comment/docs clarifications only
- Record schema changes in standards/history and PR description

### 19.6 Enforcement Checklist (Code Reviews)

Before merging code PRs:

- [ ] New/rewritten files include Code Versioning Note
- [ ] `Introduced-In` references current PR number (e.g., `PR-699`)
- [ ] `Code-Version` increment is justified by change scope
- [ ] If config changed: `.env.example` updated and `ENV_SCHEMA_VERSION` bumped
- [ ] No secrets/keys included in version notes

### 19.7 Hunt Queries (Trace Any Code Fast)

Use these repository queries to trace lineage:

```bash
# All code versioning notes
rg "CODE VERSIONING NOTE"

# All artifacts introduced in PR-699
rg "Introduced-In:\\s*PR-699"

# All files using env schema lineage
rg "Env-Schema:\\s*env-v"
```

---

## 21. Document Formulation Preservation

### 21.1 Rule / Sääntö

**NEVER lose original document formulation data when rewriting, updating, or exporting documents.**

When a document is restructured, rewritten, or version-bumped, the agent MUST preserve all eloquent formulations, philosophical passages, key quotes, cultural wisdom, mottos, and narrative voice from earlier versions. A rewrite that strips these passages is a destructive edit — equivalent to data loss.

**Älä KOSKAAN kadota alkuperäistä dokumenttien muotoilutietoa päivittäessä, uudelleenkirjoittaessa tai viedessä dokumentteja.** Kauniit muotoilut, filosofiset kappaleet, lainaukset, kulttuurinen viisaus ja kerronnallinen ääni ovat yrityksen aineetonta pääomaa.

### 21.2 What Counts as Formulation Data

| Category                           | Examples                                                                      |
| ---------------------------------- | ----------------------------------------------------------------------------- |
| **Forewords & preambles**          | Founding philosophy, onboarding welcome text, mission narrative               |
| **Quotes & mottos**                | CEO quotes, cultural proverbs, strategic slogans ("Litet bättre", "Köyhäile") |
| **Philosophical passages**         | Values articulation, ethical reasoning, European identity statements          |
| **Scenario wisdom**                | Strategic foresight passages, future scenario narratives, book references     |
| **Listening & interaction wisdom** | Stakeholder engagement philosophy, customer interaction guidance              |
| **Metaphors**                      | Game metaphors, journey metaphors, strategic framings ("päättymätön peli")    |
| **Voice & tone**                   | The characteristic narrative voice of the document's author/era               |

### 21.3 Procedure for Document Rewrites

```
1. EXTRACT:   Before rewriting, extract all formulation passages from the current version
2. CATALOG:   List each passage with its location and category (quote, motto, philosophy, etc.)
3. REWRITE:   Perform the structural/content rewrite
4. REINTEGRATE: Place each extracted passage into the appropriate section of the new structure
5. VERIFY:    Diff old vs new — confirm zero formulation data was dropped
6. EXPORT:    When generating .docx / .pdf / .html, include all preserved formulations
```

### 21.4 DOCX Export Formulation Rules

When generating `.docx` exports from markdown documents:

- Preserve italic formatting for quotes and philosophical passages
- Maintain bullet/number list structure for wisdom collections
- Keep quote attributions (author, year, source) intact
- Use proper heading hierarchy to frame formulation sections
- Never summarize or paraphrase — preserve verbatim text

### 21.5 Enforcement

- Any agent rewrite that drops formulation data is a **Rule 12 violation** (Fail loud — never hide skipped work)
- Version history MUST note "formulations preserved from vX.Y" when rewriting
- If a passage cannot be placed in the new structure, append it to a "Heritage Passages" section — never delete it

---

## 22. Multimodal Document Assets

### 22.1 Purpose / Tarkoitus

Documents (CVs, whitepapers, customer documents, offers) increasingly carry more than text — photos, diagrams, screenshots, and occasionally video/audio references. This section governs where those assets live, how they are referenced from markdown, and how they get embedded into downloadable HTML/DOCX outputs — so an artifact isn't silently dropped when a document is rendered or re-versioned.

Dokumentit (CV:t, whitepaperit, asiakasdokumentit, tarjoukset) kantavat yhä useammin muutakin kuin tekstiä — valokuvia, kaavioita, kuvakaappauksia ja joskus video-/äänimateriaalia. Tämä osio määrittää, missä nämä varat sijaitsevat, miten niihin viitataan markdownista, ja miten ne upotetaan ladattaviin HTML/DOCX-tulosteisiin.

**Trigger discovery:** this section was added after finding that `bids/ORK160826/CV_ORK160826_v165.md` had never carried any image reference in any of its 168 versions, even though a canonical professional photo already existed in-repo (`dws10.com/static/images/Risto_Malta.png`, used site-wide) — the CV's markdown→HTML/DOCX pipeline had no rule requiring images to be looked for, referenced, or embedded.

### 22.2 Canonical Asset Locations

Before adding any new photo/diagram/screenshot, **check whether it already exists in the repo.** Multiple copies of the same personnel photo were found scattered across `CV/`, `dws10.com/static/images/`, `onelifetime.world/static/images/`, `landing-pages/*/static/images/`, and `kb/raw/images/people/` before this rule existed — treat that as the failure mode to avoid going forward.

| Asset type                                                                | Canonical location                               | Notes                                                                                                         |
| ------------------------------------------------------------------------- | ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------- |
| Personnel photos (site-wide use)                                          | `dws10.com/static/images/`                       | Mirror into `onelifetime.world/static/images/` and both `landing-pages/*/static/images/` per Dual Folder Sync |
| Personnel photos (CV/document-only use)                                   | `CV/`                                            | May differ from the site photo (formal headshot vs. site-brand photo) — see §22.6 for the quality bar         |
| Document/brand fonts                                                      | `docs/assets/fonts/`                             | Referenced in §8.4                                                                                            |
| Source certificate / evidence PDFs (degrees, grades, official statements) | `Learn/evidence/YYYY-MM-DD-descriptive-name.pdf` | Same folder and naming convention as evidence notes (§ below); raw source file, not a summary                 |
| Shared JS/CSS                                                             | `dws10.com/shared-assets/`                       | Governed by `DWS_BRAND_STANDARD.md` §15                                                                       |

### 22.3 Markdown Image Reference Convention

Reference images with standard Markdown syntax, path relative to the `.md` file's own directory:

```markdown
![Risto Anton Päärni](../../dws10.com/static/images/Risto_Malta.png)
```

- Alt text is **required** and must be descriptive (accessibility — ties to `DWS_BRAND_STANDARD.md` §14 WCAG 2.2 AA), not a filename.
- Do not paste raw Base64 into the markdown source — that belongs only in the rendered HTML output (§22.4), not the source of truth.

### 22.4 Embedding Rule for Downloadable Documents (formalizes CLAUDE.md "Downloadable HTML Rule")

Any standalone downloadable HTML document (CV, profile, report) **must** have zero external file references — every image embedded as a Base64 data URL, so the file works fully offline and doesn't break when the source image moves.

**Tooling:** `scripts/render-doc.sh <input.md> [output-basename]` — wraps pandoc with `--standalone --embed-resources --resource-path=<the .md's own directory>` for HTML (auto Base64-embeds every referenced image, resolved relative to the source file so the same path also renders correctly on GitHub) and produces a `.docx` alongside it (images embed natively in DOCX, no flag needed — DOCX is a zip container). Requires `pandoc`.

- **Ephemeral cloud sessions:** `apt-get install -y pandoc` (Debian/Ubuntu) or `winget install JohnMacFarlane.Pandoc` (Windows, per §8.3). **Not persisted** — reinstall at the start of a session if `render-doc.sh` reports it missing.
- **DGX Spark (permanent):** installed once by `infrastructure/dgx-spark/first-boot.sh` (step 3a) — survives across every future session on that box. This is the durable install; the cloud-session `apt-get` above is the ephemeral fallback for containers that aren't the DGX box.

```bash
scripts/render-doc.sh bids/ORK160826/CV_ORK160826_v165.md
# → CV_ORK160826_v165.html (self-contained, images embedded)
# → CV_ORK160826_v165.docx (images embedded natively)
```

### 22.5 Video & Audio Assets

Unlike images, video/audio should **not** be embedded as inline data URIs in HTML/DOCX — the resulting file size breaks the PDF Standard's §8.2 10 MB target almost immediately. Instead:

- Host the source file externally (Google Drive shared-artifact area, or a site's own media hosting) and link to it.
- Embed a static poster-frame/thumbnail image inline (following §22.4) so the document still shows something without a live network fetch.
- Register the asset in a media table in the document or its evidence note: filename, format, duration, canonical URL, transcript/caption availability (accessibility requirement).

### 22.6 Personnel Photo Quality Bar

A photo that is technically embeddable is not automatically appropriate for a government tender, customer document, or investor deck. Minimum bar before a personnel photo goes into a customer-facing or procurement document:

- Professional headshot framing, business-appropriate attire
- **Background must not contain third-party signage, logos, other identifiable people, or anything a procurement evaluator could read as unprofessional** — this rule exists because `CV/risto70.png` (a bar/restaurant setting with visible third-party signage in the background) was found already committed under a CV-facing filename
- Minimum resolution: 600×600 px for headshot crops
- See `DWS_BRAND_STANDARD.md` §15.1 for the canonical photo registry and per-photo approval status

### 22.7 Fallback: Artifact Cannot Be Embedded

If an artifact (video, large audio file, a format pandoc/HTML cannot inline, or anything that would blow the file-size budget) cannot be embedded per §22.4–22.5, the **minimum acceptable fallback is never to drop it silently.** Instead:

1. Upload it to the shared Google Drive artifact storage area, with link-sharing rights enabled ("anyone with the link can view").
2. Present the HIC with the shareable link and an explicit decision point — do not assume it's fine to just reference-and-forget.
3. Record the Drive link in the document's evidence note (or a media table per §22.5) so it survives version bumps.

This mirrors Rule 12 (Fail loud) — a document that silently references an artifact nobody can actually open is a hidden failure, not a completed task.

### 22.8 Enforcement

- A document rewrite/re-version must not drop an existing image reference without an explicit, logged reason (mirrors §21.5 formulation preservation).
- Before adding a new personnel/product photo to a customer-facing document, check §22.2's canonical locations first — do not create a new duplicate copy.
- `scripts/render-doc.sh` output must be spot-checked (`grep -c "data:image" output.html` should be ≥ the number of images referenced) before a document ships.

---

## 📋 Quick Reference

### Document Header Template

```markdown
# [Document Title]

---

# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:

- Version: 1.0 | Tool: [Tool] | Session: [ID] | Date: DD.MM.YYYY | Changes: [Description]

Session Links & References:

- [Tool] ([ID]): [Link]
- View on GitHub: [Link]

Document Status:

- Created: DD.MM.YYYY
- Last Modified: DD.MM.YYYY
- Language: [Language]
- Languages Available: [List]
- Publication Status: [ACTIVE / DRAFT / OUTDATED / ARCHIVED]

---
```

> **Remember:** Use `***` not `---` for pandoc compatibility.

### Workflow Naming Template

```
[category]-[action]-[frequency]-v[version]-YYYY-MM-DD.yml
```

### File Naming Template

```
[CATEGORY]_[NAME]_[LANGUAGE]_v[VERSION].md
```

### File Lifecycle Suffixes

When a file is removed from active use, rename it with one of the following suffixes instead of deleting. Never use `_OLD` — use the suffix that communicates the file's actual status.

| Suffix        | Meaning                                | When to use                                              | Examples                            |
| ------------- | -------------------------------------- | -------------------------------------------------------- | ----------------------------------- |
| `_DRAFT`      | Unpublished, awaiting approval         | Blog posts, proposals, content under review              | `deepseek-v4-flash_DRAFT.html`      |
| `_DEPRECATED` | Replaced, will not return              | Code, scripts, configs, migrations, skills, hooks, infra | `grok-consent.routes_DEPRECATED.ts` |
| `_RETIRED`    | Removed from production site           | HTML pages, product pages, store pages                   | `firehorse-automation_RETIRED.html` |
| `_ARCHIVE`    | Historical snapshot kept for reference | Thesis versions, NDAs, field notes, legal docs           | `NDA_QANTIC_2026_ARCHIVE.md`        |

**Rules:**

1. `_DRAFT` files may be promoted to live by removing the suffix. All other suffixes are permanent.
2. Blog drafts require explicit approval before promotion (CLAUDE.md blog draft rule).
3. Dual-folder pairs (source + `landing-pages/`) must use the same suffix in the same commit.
4. The `artifacts/` directory is exempt — it contains PR worktree snapshots that mirror the main tree.

---

## 20. Whitepaper Versioning

Whitepapers are customer-facing technical documents (sovereignty, KYA, security, industrial intelligence). A serious enterprise reader treats an unversioned, silently-edited whitepaper as untrustworthy. Every whitepaper MUST carry a **document revision** and an auditable change history.

### 20.1 Two versions are not the same thing

A whitepaper references a **subject version** (the standard or product it describes — e.g. "KYA v1.5", "DWS IQ 6"). That is **not** the document revision. The whitepaper file carries its **own Document Revision (`vX.Y`)** that increments when the _document_ changes, independent of the subject.

### 20.2 Required on every whitepaper

1. **Visible revision line** near the title or in the footer:
   `Document revision v1.1 · Last updated 25 Jun 2026`
2. **VERSION AND AGENT HISTORY provenance block:**
   - **Markdown-sourced** whitepapers: the standard `***`-delimited block per §2 / Appendix B.
   - **HTML-only** whitepapers (public-site pages — `.md` is forbidden in public folders per CLAUDE.md Non-Negotiable Rule 5): embed the history as an `<!-- VERSION AND AGENT HISTORY ... -->` HTML comment immediately after `<head>`, plus the visible revision line in §20.2(1).

### 20.3 Increment rule (per §5 table)

| Bump            | When                                           |
| --------------- | ---------------------------------------------- |
| patch (1.0→1.1) | copy edit, factual correction, terminology fix |
| minor (1.1→1.2) | new section / material content addition        |
| major (→2.0)    | restructure or rewrite                         |

A terminology/security correction (e.g. replacing a tool name) is a **patch** bump and MUST be recorded — silent edits are not permitted.

### 20.4 Snapshots and dual-folder

- Private `Learn/` snapshots are filename-versioned `<name>_vX.Y.html`; **never delete** old versions (per §18).
- Public whitepaper revisions sync to the `landing-pages/` mirror in the **same commit** (CLAUDE.md dual-folder rule).
- Live whitepapers are listed in §16 Document Index.

### 20.5 HTML provenance template

```html
<!--
  VERSION AND AGENT HISTORY
  Document revision: v1.1
  Last updated: 25.06.2026
  - v1.1 | Claude Code | claude/<session> | 25.06.2026 | <change summary>
  - v1.0 | <tool> | <session> | <date> | Initial publication
-->
```

### 20.6 Customer-facing documents: version block goes at the END

**Rule:** For documents that are delivered directly to a customer or external evaluator (consultant CVs, tender/bid attachments, proposals, price lists sent externally) — as opposed to internal or general-audience whitepapers — the full `VERSION AND AGENT HISTORY` block, `Document Status` block, copyright line, and company contact details (Lifetime Oy, Y-tunnus, address, email) go on the **last page**, not the first.

**Rationale:** A customer or procurement evaluator opening the document should see the substantive content first (name, summary, offer, capability) — not an internal changelog with session IDs and tooling names. The internal provenance is still mandatory (§2 / §20.2), it just moves to the back, alongside the copyright and contact block that normally closes a professional document.

**Applies to:** `bids/*/`, `sales-outreach/*.md`, `CV/*.md`, and any file whose immediate destination is an external reader. Does **not** apply to internal handbooks, standards, or `Learn/` field notes, where the version block stays at the top per §2 default.

**Layout:**

```
# <Document Title>

---

<substantive content — CV, offer, whitepaper body, etc.>

---

# VERSION AND AGENT HISTORY

Version: X

Sessions & Modifications:
- ...

Document Status:
- ...

---

*Copyright <year> – Tekijänoikeudet <author/company>.*

**Lifetime Oy** | Y-tunnus: 0772407-9 | VAT: FI07724079
<address>
<contact email / phone>
```

First applied: `bids/ORK160826/ORK_Risto_CV_FI_164.md` → v165, moving the block from top to bottom.

---

## 📞 Support

### Questions or Issues

- **Documentation Questions:** docs@dws-iq.com
- **Standard Updates:** standards@dws-iq.com
- **Technical Support:** support@dws-iq.com

### Related Documents

- **Ontology & Lifetime World Model:** `ONTOLOGY.md` ⭐ NEW
- **DWS Brand Standard:** `docs/DWS_BRAND_STANDARD.md` — Gamma design system, colors, typography, navigation, UX guidelines
  - Associated agents/skills: `ui-ux-designer`, `ux-researcher-designer`, `senior-frontend`
- **AI Agent Guidelines:** `AI_AGENT_GUIDELINES.md`
- **Site Quality Standards:** `SITE_QUALITY_STANDARDS.md`
- **Admin Manual - Authentication:** `ADMIN_MANUAL_AUTHENTICATION.md`
- **Admin Manual - DWS6.com:** `ADMIN_MANUAL_DWS6_COM.md`

---

**Version:** 1.8
**Effective Date:** 13. March 2026
**Next Review:** Q2 2026

**Major Changes in v1.8:**

- Added Code Versioning & PR Traceability Standard (Section 19)
- Added syntax-safe per-language templates for code version notes
- Added `.env` schema versioning policy (`ENV_SCHEMA_VERSION` in `.env.example`)
- Added explicit PR-linked requirement (`Introduced-In: PR-<number>`, e.g. `PR-699`)

**Major Changes in v1.7:**

- Added Web Content Index check procedure (Section 17) — post-update web check to detect drift between docs and live pages
- Added Learn HTML Generation rule (Section 18) — every standards update produces a versioned HTML artifact in Learn/
- Created `docs/WEB_CONTENT_INDEX.md` — maps docs to web pages across all three domains
- Created `.claude/commands/content-index.md` — agent skill for web content index
- Added Learn Artifacts section to morning briefing email (06:00 Helsinki)

**Major Changes in v1.6:**

- Added SQL migration file naming convention using number_ddmmyy_name.sql pattern

**Major Changes in v1.5:**

- Added OUTDATED publication status for documents pending archive
- Added document lifecycle (DRAFT → ACTIVE → OUTDATED → ARCHIVED)
- Added marking procedure (sections 2.4-2.5) with step-by-step instructions
- Added `docs/archive/` folder structure reference

**Major Changes in v1.4:**

- Pandoc compatibility: changed `---` to `***` delimiters in document headers
- Updated PDF section (8) with actual Generate-PDFs.ps1 script reference
- DWS brand CSS colors replace generic blue palette
- Publication status: plain text labels (ACTIVE, DRAFT) as canonical values
- Added pandoc CLI flags reference and warnings about YAML/Unicode issues

**Major Changes in v1.3:**

- Added LLM Model Versioning section (14) - track which AI models create documents
- Added Localization & Multi-Language Management (15) - support for 27 EU languages
- Added Document Index reference (16) - centralized document discovery
- Extended header format to include LLM model identification
- Database schemas for translation tracking and version management
- Workflows for LLM version updates and product version changes

**Major Changes in v1.2:**

- Added knowledge management strategy (database vs. docs decision matrix)
- Introduced Core Artifacts framework with naming conventions
- Added Field Notes standards and templates
- Integrated Lifetime World Model (LWM) concepts
- Reference to new ONTOLOGY.md companion document

---

## Appendix A: Naming Pattern Reference

### Workflow Categories

| Category   | Purpose                    | Examples                  |
| ---------- | -------------------------- | ------------------------- |
| `security` | Security-related workflows | `security-scan-daily`     |
| `backup`   | Backup workflows           | `backup-site-daily`       |
| `deploy`   | Deployment workflows       | `deploy-production`       |
| `test`     | Testing workflows          | `test-integration-weekly` |
| `audit`    | Audit workflows            | `audit-security-monthly`  |
| `build`    | Build workflows            | `build-docker-image`      |
| `monitor`  | Monitoring workflows       | `monitor-uptime-hourly`   |

### Document Categories

| Category       | Purpose                  | Examples                   |
| -------------- | ------------------------ | -------------------------- |
| `ADMIN_MANUAL` | Administration guides    | `ADMIN_MANUAL_DWS6_COM`    |
| `THESIS`       | Thesis documents         | `THESIS_OUTLINE_EN`        |
| `TECHNICAL`    | Technical specifications | `TECHNICAL_ARCHITECTURE`   |
| `WORKFLOW`     | Workflow documentation   | `WORKFLOW_SECURITY_AUDIT`  |
| `GUIDE`        | User guides              | `GUIDE_DEPLOYMENT`         |
| `STANDARD`     | Standards documents      | `STANDARD_DOCUMENT_NAMING` |

### Frequency Values

| Frequency   | Cron Expression     | Description                   |
| ----------- | ------------------- | ----------------------------- |
| `hourly`    | `0 * * * *`         | Every hour                    |
| `daily`     | `0 2 * * *`         | Daily at 02:00 UTC            |
| `weekly`    | `0 2 * * 0`         | Weekly on Sunday at 02:00 UTC |
| `monthly`   | `0 2 1 * *`         | Monthly on 1st at 02:00 UTC   |
| `on-demand` | `workflow_dispatch` | Manual trigger only           |

## Appendix B: Version History Format

### Compact Format (for headers)

```markdown
Sessions & Modifications:

- Version: 1.0 | Tool: Cursor AI | Session: 2025-12-30 | Date: 30.12.2025 | Changes: Initial creation
- Version: 1.1 | Tool: Claude Code | Session: QVvDX | Date: 15.01.2026 | Changes: Added examples
```

### Table Format (for detailed history)

```markdown
## Version History

| Version | Date       | Tool/Author | Session    | Changes              |
| ------- | ---------- | ----------- | ---------- | -------------------- |
| 1.0     | 30.12.2025 | Cursor AI   | 2025-12-30 | Initial creation     |
| 1.1     | 15.01.2026 | Claude Code | QVvDX      | Added examples       |
| 2.0     | 01.02.2026 | Manual      | N/A        | Complete restructure |
```
