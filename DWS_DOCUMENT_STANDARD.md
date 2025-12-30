# DWS Document Standard

---
# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:
  - Version: 1.0 | Tool: Cursor AI | Session: 2025-12-30 | Date: 30.12.2025 | Changes: Initial creation - DWS document standard with workflow naming conventions

Session Links & References:
  - Cursor AI (2025-12-30): https://github.com/blogtheristo/dws6/commits/main
  - View on GitHub: https://github.com/blogtheristo/dws6/blob/main/DWS_DOCUMENT_STANDARD.md

Document Status:
  - Created: 30.12.2025
  - Last Modified: 30.12.2025
  - Language: English & Finnish (bilingual)
  - Languages Available: English, Suomi
  - Publication Status: ✅ ACTIVE

---

**Version:** 1.0  
**Effective Date:** 2025-12-30  
**Last Updated:** 2025-12-30  
**Status:** Active

---

## Table of Contents

1. [Overview](#1-overview)
2. [Document Header Standard](#2-document-header-standard)
3. [Workflow Naming Standard](#3-workflow-naming-standard)
4. [File Naming Conventions](#4-file-naming-conventions)
5. [Version Control](#5-version-control)
6. [Language Policy](#6-language-policy)
7. [Metadata Requirements](#7-metadata-requirements)
8. [Examples](#8-examples)
9. [Enforcement](#9-enforcement)

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
  - Publication Status: [Status]

---
```

### 2.2 Header Components

| Component | Required | Description | Example |
|-----------|----------|-------------|---------|
| **Version** | ✅ Yes | Semantic version (X.Y) | `1.0`, `1.1`, `2.0` |
| **Tool** | ✅ Yes | AI tool or author | `Cursor AI`, `Claude Code`, `Manual` |
| **Session** | ✅ Yes | Unique session identifier | `2025-12-30`, `QVvDX`, `IjtD0` |
| **Date** | ✅ Yes | Date of modification | `30.12.2025` |
| **Changes** | ✅ Yes | Brief description | `Initial creation`, `Added workflow naming` |
| **Session Links** | ⚠️ Recommended | GitHub commit links | URL to commits |
| **Created** | ✅ Yes | Document creation date | `30.12.2025` |
| **Last Modified** | ✅ Yes | Last modification date | `30.12.2025` |
| **Language** | ✅ Yes | Primary language | `English`, `Finnish`, `Bilingual` |
| **Languages Available** | ✅ Yes | All available languages | `English, Suomi` |
| **Publication Status** | ✅ Yes | Document status | `✅ ACTIVE`, `🚧 DRAFT`, `📦 ARCHIVED` |

### 2.3 Publication Status Values

| Status | Icon | Meaning |
|--------|------|---------|
| **ACTIVE** | ✅ | Document is current and in use |
| **DRAFT** | 🚧 | Document is work in progress |
| **ARCHIVED** | 📦 | Document is superseded but kept for reference |
| **DEPRECATED** | ⚠️ | Document is outdated and should not be used |
| **UNDER REVIEW** | 🔍 | Document is being reviewed |

---

## 3. Workflow Naming Standard

### 3.1 GitHub Actions Workflow Naming

**Format:**
```
[category]-[action]-[frequency]-v[version]-YYYY-MM-DD.yml
```

**Components:**

| Component | Required | Description | Examples |
|-----------|----------|-------------|----------|
| **category** | ✅ Yes | Workflow category | `security`, `backup`, `deploy`, `test`, `audit` |
| **action** | ✅ Yes | Primary action | `scan`, `backup`, `deploy`, `test`, `audit` |
| **frequency** | ⚠️ Optional | Execution frequency | `daily`, `weekly`, `monthly`, `on-demand` |
| **version** | ✅ Yes | Workflow version | `v1`, `v2`, `v3` |
| **date** | ✅ Yes | Creation/update date | `2025-12-30` |

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
    - cron: '[cron expression]'
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

| Version | When to Use | Example |
|---------|-------------|---------|
| **0.1** | Initial draft | First version of document |
| **0.2, 0.3...** | Minor updates | Small changes, corrections |
| **1.0** | First release | Document is complete and approved |
| **1.1, 1.2...** | Minor updates | Updates to released document |
| **2.0** | Major revision | Significant restructuring or rewrite |

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

| Version | Date | Author/Tool | Changes |
|---------|------|-------------|---------|
| 1.0 | 2025-12-30 | Cursor AI | Initial creation |
| 1.1 | 2026-01-15 | Claude Code | Added workflow section |
| 2.0 | 2026-02-01 | Manual | Complete restructure |
```

---

## 6. Language Policy

### 6.1 Supported Languages

| Language | Code | Usage |
|----------|------|-------|
| **English** | `EN` | Primary language for technical documentation |
| **Finnish** | `FI` | Primary language for thesis and local documentation |
| **Bilingual** | `EN_FI` | Documents with both languages |

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

## 8. Examples

### 8.1 Complete Document Example

```markdown
# Admin Manual: DWS6.com Deployment

---
# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:
  - Version: 1.0 | Tool: Cursor AI | Session: 2025-12-30 | Date: 30.12.2025 | Changes: Initial creation

Session Links & References:
  - Cursor AI (2025-12-30): https://github.com/blogtheristo/dws6/commits/main
  - View on GitHub: https://github.com/blogtheristo/dws6/blob/main/ADMIN_MANUAL_DWS6_COM.md

Document Status:
  - Created: 30.12.2025
  - Last Modified: 30.12.2025
  - Language: English & Finnish (bilingual)
  - Languages Available: English, Suomi
  - Publication Status: ✅ ACTIVE

---

**Version:** 1.0  
**Purpose:** Admin and deployment guide for dws6.com  
**Audience:** DevOps, System Administrators  
**Updated:** 30.12.2025

## Table of Contents

[... rest of document ...]
```

### 8.2 Complete Workflow Example

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
    - cron: '0 2 * * *'  # Daily at 02:00 UTC
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

### 8.3 Complete Script Example

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

## 9. Enforcement

### 9.1 Automated Checks

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

### 9.2 Manual Review Checklist

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

### 9.3 Exceptions

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
  - Publication Status: [Status]

---
```

### Workflow Naming Template

```
[category]-[action]-[frequency]-v[version]-YYYY-MM-DD.yml
```

### File Naming Template

```
[CATEGORY]_[NAME]_[LANGUAGE]_v[VERSION].md
```

---

## 📞 Support

### Questions or Issues

- **Documentation Questions:** docs@dws-iq.com
- **Standard Updates:** standards@dws-iq.com
- **Technical Support:** support@dws-iq.com

### Related Documents

- **AI Agent Guidelines:** `AI_AGENT_GUIDELINES.md`
- **Site Quality Standards:** `SITE_QUALITY_STANDARDS.md`
- **Admin Manual - Authentication:** `ADMIN_MANUAL_AUTHENTICATION.md`
- **Admin Manual - DWS6.com:** `ADMIN_MANUAL_DWS6_COM.md`

---

**Version:** 1.0  
**Effective Date:** 30. December 2025  
**Next Review:** Q2 2026

---

## Appendix A: Naming Pattern Reference

### Workflow Categories

| Category | Purpose | Examples |
|----------|---------|----------|
| `security` | Security-related workflows | `security-scan-daily` |
| `backup` | Backup workflows | `backup-site-daily` |
| `deploy` | Deployment workflows | `deploy-production` |
| `test` | Testing workflows | `test-integration-weekly` |
| `audit` | Audit workflows | `audit-security-monthly` |
| `build` | Build workflows | `build-docker-image` |
| `monitor` | Monitoring workflows | `monitor-uptime-hourly` |

### Document Categories

| Category | Purpose | Examples |
|----------|---------|----------|
| `ADMIN_MANUAL` | Administration guides | `ADMIN_MANUAL_DWS6_COM` |
| `THESIS` | Thesis documents | `THESIS_OUTLINE_EN` |
| `TECHNICAL` | Technical specifications | `TECHNICAL_ARCHITECTURE` |
| `WORKFLOW` | Workflow documentation | `WORKFLOW_SECURITY_AUDIT` |
| `GUIDE` | User guides | `GUIDE_DEPLOYMENT` |
| `STANDARD` | Standards documents | `STANDARD_DOCUMENT_NAMING` |

### Frequency Values

| Frequency | Cron Expression | Description |
|-----------|----------------|-------------|
| `hourly` | `0 * * * *` | Every hour |
| `daily` | `0 2 * * *` | Daily at 02:00 UTC |
| `weekly` | `0 2 * * 0` | Weekly on Sunday at 02:00 UTC |
| `monthly` | `0 2 1 * *` | Monthly on 1st at 02:00 UTC |
| `on-demand` | `workflow_dispatch` | Manual trigger only |

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

| Version | Date | Tool/Author | Session | Changes |
|---------|------|-------------|---------|---------|
| 1.0 | 30.12.2025 | Cursor AI | 2025-12-30 | Initial creation |
| 1.1 | 15.01.2026 | Claude Code | QVvDX | Added examples |
| 2.0 | 01.02.2026 | Manual | N/A | Complete restructure |
```

