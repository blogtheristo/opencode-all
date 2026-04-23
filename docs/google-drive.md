# Google Drive — DWS Archive & NotebookLM

***
# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:
  - Version: 1.0 | Tool: Claude Code | Session: claude/google-drive-docs | Date: 08.03.2026 | Changes: Initial creation — DWS Archive folder structure, risto.paarni2024@lifetime.fi as owner, NotebookLM integration, migration guidance for existing DWS 6 documents

Session Links & References:
  - View on GitHub: https://github.com/blogtheristo/dws6/blob/main/docs/google-drive.md

Document Status:
  - Created: 08.03.2026
  - Last Modified: 08.03.2026
  - Language: EN
  - Languages Available: EN
  - Publication Status: ACTIVE

***

## Table of Contents

1. [Overview](#1-overview)
2. [Account & Ownership](#2-account--ownership)
3. [Directory Structure](#3-directory-structure)
4. [Mapping from Repo to Drive](#4-mapping-from-repo-to-drive)
5. [NotebookLM Integration](#5-notebooklm-integration)
6. [Setup & Automation](#6-setup--automation)
7. [Migration of Existing Documents](#7-migration-of-existing-documents)
8. [Related Documents](#8-related-documents)

---

## 1. Overview

### Purpose

This document defines the Google Drive folder structure for DWS 6 archives, reports, and document distribution. All archives use `risto.paarni2024@lifetime.fi` as the owner. The structure supports:

- **Weekly reports** — PDF outputs from `weekly-report.yml`
- **Investor reports** — PDFs from `src/investor-reports/`
- **Compliance & field notes** — CBAM, CSRD, security assessments
- **Thesis & Learn** — Metropolia thesis, PHD Firehorse, Learn HTML/PDF
- **Archive** — Historical DWS 6 docs (dashboards, deployment, dws10-hero, etc.)
- **NotebookLM** — Curated document sets for AI-assisted research

### Scope

| Item | In Scope |
|------|----------|
| Account | `risto.paarni2024@lifetime.fi` |
| Root folder | `DWS Archive` |
| Automation | `gws` CLI, `scripts/Setup-GoogleDriveFolders.ps1` |
| NotebookLM | Discover Sources → Google Drive search |

---

## 2. Account & Ownership

| Property | Value |
|----------|-------|
| **Owner** | `risto.paarni2024@lifetime.fi` |
| **Use case** | All DWS 6 archives, reports, investor materials |
| **GCP** | Use `admin@dws6.com` for GCP/Cloud Run; use this account for Drive only |

**Rule:** All DWS Archive content lives under this account so NotebookLM (logged in with the same account) can search and add sources via Discover Sources.

---

## 3. Directory Structure

```
Google Drive (risto.paarni2024@lifetime.fi)/
└── DWS Archive/
    ├── Weekly-Reports/           # weekly-report.yml → PDF uploads
    ├── Investor-Reports/         # integration-wrapper.ts PDFs
    ├── Compliance/               # CBAM, CSRD, security assessments
    │   └── Security/             # Vulnerability assessments, field notes
    ├── Thesis/                   # Metropolia + PHD Firehorse
    │   ├── Metropolia/           # V3Thesis_EN, V3Thesis_FI
    │   └── PHD-Firehorse/        # PHD_FIREHORSE_EN, PHD_FIREHORSE_FI
    ├── Learn/                    # Learn/ HTML & PDF exports
    ├── Field-Notes/              # docs/field-notes/
    ├── Architecture/             # docs/architecture/
    ├── Admin/                    # Admin manuals, operational guides
    └── Archive/                  # Historical DWS 6 docs (mirrors docs/archive/)
        ├── dws6-dashboard/
        ├── dws6-deployment/
        ├── dws6-status/
        ├── dws10-hero/
        ├── dws10-docs/
        ├── dws10-misc/
        └── onelifetime-blog/
```

### Folder Descriptions

| Folder | Purpose | Source |
|--------|---------|--------|
| `Weekly-Reports` | Monday weekly status PDFs | `.github/workflows/weekly-report.yml` |
| `Investor-Reports` | Investor report PDFs with attachments | `src/investor-reports/integration-wrapper.ts` |
| `Compliance` | CBAM, CSRD, regulatory reports | Generated reports, `docs/field-notes/` |
| `Compliance/Security` | Security assessments, vulnerability notes | `docs/field-notes/2026-02-21-security-*.md` |
| `Thesis/Metropolia` | Master thesis EN/FI | `docs/metropolia/master-thesis/`, `Learn/V3Thesis_*.html` |
| `Thesis/PHD-Firehorse` | PHD Firehorse EN/FI | `docs/PHD_FIREHORSE_*.md`, `Learn/PHD_FIREHORSE_*.html` |
| `Learn` | Learn HTML & PDF exports | `Learn/` folder, `scripts/Generate-PDFs.ps1` |
| `Field-Notes` | Field notes, tech stack, security | `docs/field-notes/` |
| `Architecture` | Architecture docs | `docs/architecture/` |
| `Admin` | Admin manuals | `Admin/` |
| `Archive` | Historical DWS 6 docs | `docs/archive/` subfolders |

---

## 4. Mapping from Repo to Drive

| Repo Path | Drive Path |
|-----------|------------|
| `docs/` (root docs) | `DWS Archive/` (by category) |
| `docs/field-notes/` | `DWS Archive/Field-Notes/` |
| `docs/architecture/` | `DWS Archive/Architecture/` |
| `docs/archive/dws6-*` | `DWS Archive/Archive/dws6-*/` |
| `docs/archive/dws10-*` | `DWS Archive/Archive/dws10-*/` |
| `docs/archive/onelifetime-blog/` | `DWS Archive/Archive/onelifetime-blog/` |
| `docs/metropolia/` | `DWS Archive/Thesis/Metropolia/` |
| `docs/PHD_FIREHORSE_*.md` | `DWS Archive/Thesis/PHD-Firehorse/` |
| `Learn/` | `DWS Archive/Learn/` |
| `Admin/` | `DWS Archive/Admin/` |

---

## 5. NotebookLM Integration

### How It Works

1. **Upload** reports and docs to Drive under `risto.paarni2024@lifetime.fi`.
2. **In NotebookLM** (same account):
   - Create a notebook.
   - Use **Discover Sources** → **Google Drive**.
   - Search by keyword (e.g. "DWS weekly reports", "investor memos", "security assessment").
   - Add relevant files as sources.
3. **Query** the notebook for summaries, Q&A, citations.

### Supported Formats

- PDF, Google Docs, Google Slides, images, YouTube URLs, audio.

### Limits

- ~50 sources per notebook (more with Google AI Pro/Enterprise).
- ~500k words or 200MB per source.
- Best for curated sets (e.g. last 12 weekly reports, investor deck + memos).

### Suggested Notebooks

| Notebook | Sources | Use Case |
|----------|--------|----------|
| DWS Weekly Status | `Weekly-Reports/` (last 12) | Status summaries, commit trends |
| Investor Materials | `Investor-Reports/` + pitch deck | Investor Q&A, due diligence |
| Compliance & Security | `Compliance/` + `Field-Notes/` | Regulatory readiness, security posture |
| Thesis Research | `Thesis/` | Citation, literature, methodology |

---

## 6. Setup & Automation

### Prerequisites

- **gws** installed: `npm install -g @googleworkspace/cli`
- **Auth**: `gws auth setup` then `gws auth login` with `risto.paarni2024@lifetime.fi`

### Create Folder Structure

Run the setup script from repo root:

```powershell
# PowerShell 7+ (recommended on Windows)
pwsh -File .\scripts\Setup-GoogleDriveFolders.ps1

# Or with dry run first
pwsh -File .\scripts\Setup-GoogleDriveFolders.ps1 -DryRun
```

Or manually via gws:

```bash
# Create root
gws drive files create --json '{"name": "DWS Archive", "mimeType": "application/vnd.google-apps.folder"}'

# Create subfolders (use parent ID from previous output)
gws drive files create --json '{"name": "Weekly-Reports", "mimeType": "application/vnd.google-apps.folder", "parents": ["<DWS_ARCHIVE_ID>"]}'
# ... repeat for each folder
```

### Upload Workflows (Planned)

| Workflow | Trigger | Action |
|----------|---------|--------|
| Weekly report | `weekly-report.yml` | Generate PDF → upload to `Weekly-Reports/` |
| Investor report | `integration-wrapper.ts` | After Resend send → upload to `Investor-Reports/` |
| Sync to Drive | Manual / scheduled | `Sync-ToProton.ps1` pattern → `Sync-ToGoogleDrive.ps1` |

---

## 7. Migration of Existing Documents

### Existing DWS 6 Documents

The repo has many DWS 6–related documents. Migration options:

| Location | Count (approx) | Migration |
|----------|----------------|-----------|
| `docs/archive/` | 50+ | Copy/move to `DWS Archive/Archive/` subfolders |
| `docs/field-notes/` | 15+ | Copy to `DWS Archive/Field-Notes/` |
| `docs/architecture/` | 10+ | Copy to `DWS Archive/Architecture/` |
| `docs/metropolia/` | 5+ | Copy to `DWS Archive/Thesis/Metropolia/` |
| `Learn/` | 30+ HTML/PDF | Copy to `DWS Archive/Learn/` |
| `Admin/` | 20+ | Copy to `DWS Archive/Admin/` |

### Migration Strategy

1. **Create structure** — Run `Setup-GoogleDriveFolders.ps1`.
2. **Batch upload** — Use `gws drive files upload` or Google Drive web UI for initial bulk copy.
3. **Ongoing** — Automate uploads for weekly reports, investor reports; manual for ad-hoc docs.
4. **Do not delete** — Keep repo as source of truth; Drive is archive/distribution.

### Folder Mapping for Archive

| `docs/archive/` subfolder | Drive path |
|---------------------------|------------|
| `dws6-dashboard/` | `DWS Archive/Archive/dws6-dashboard/` |
| `dws6-deployment/` | `DWS Archive/Archive/dws6-deployment/` |
| `dws6-status/` | `DWS Archive/Archive/dws6-status/` |
| `dws10-hero/` | `DWS Archive/Archive/dws10-hero/` |
| `dws10-docs/` | `DWS Archive/Archive/dws10-docs/` |
| `dws10-misc/` | `DWS Archive/Archive/dws10-misc/` |
| `onelifetime-blog/` | `DWS Archive/Archive/onelifetime-blog/` |

---

## 8. Related Documents

| Document | Purpose |
|----------|---------|
| [docs/Google/Google-Services.md](Google/Google-Services.md) | GCP, Cloud Run, Gemini, account structure |
| [docs/CLOUD_ENVIRONMENTS.md](CLOUD_ENVIRONMENTS.md) | US/EU clouds, sovereignty tiers, account separation |
| [AGENTS.md](../AGENTS.md) §16 | Google Workspace CLI (`gws`) usage |
| [DWS_DOCUMENT_STANDARD.md](../DWS_DOCUMENT_STANDARD.md) | Document header, versioning, metadata |

---

**Document Owner:** Platform Operations  
**Related:** [Google Services](Google/Google-Services.md) | [Cloud Environments](CLOUD_ENVIRONMENTS.md)

---

(c) 2026 Lifetime Oy — Google Drive Archive Documentation
