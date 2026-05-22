# Learn Sprint — Session e5wXD (2026-02-20/21)

***
# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:
  - Version: 1.0 | Tool: Claude Code (Opus 4.6) | Session: claude/automate-pr-workflow-e5wXD | Date: 21.02.2026 | Changes: Initial creation — sprint summary of HIL automation, housekeeping, and standards work

Session Links & References:
  - Claude Code (e5wXD): https://claude.ai/code/session_01G3jtczbnAPw3ofYVBFYoow
  - View on GitHub: https://github.com/blogtheristo/dws6/blob/main/Learn/learn-sprint.md

Document Status:
  - Created: 21.02.2026
  - Last Modified: 21.02.2026
  - Language: English
  - Publication Status: ACTIVE

***

## Sprint Overview

**Session:** e5wXD (2026-02-20 to 2026-02-21)
**Branch:** `claude/automate-pr-workflow-e5wXD`
**Focus:** Automated PR Workflow (HIL Automation) + Housekeeping + Standards

---

## What Was Built

### 1. HIL Automation — 4-Level Automated PR Review

The PR review pipeline now has 4 levels of automated quality gates:

| Level | Reviewer | Purpose | Gate Type |
|-------|----------|---------|-----------|
| **Level 1** | Claude (Anthropic) | Quick sanity check — security, correctness, breaking changes | Advisory |
| **Level 2** | Gemini (Google) | Deep HIL review — replaces human reviewer, strict posture | Mandatory |
| **Level 3** | Copilot (GitHub) | Auto-fix loop — implements required changes from Level 2 | Auto-fix |
| **Level 4** | Standards Check | DWS compliance — Rule 9, secrets, document headers | Enforcement |

**Workflow file:** `.github/workflows/ai-pr-review.yml`
**Auto-merge:** `.github/workflows/pr-auto-merge.yml` — merges when all 4 levels pass

### 2. Housekeeping Policy

Created `HOUSEKEEPING_POLICY.md` — comprehensive operational procedures:

- Document lifecycle (DRAFT → ACTIVE → OUTDATED → ARCHIVED)
- Public path enforcement (Rule 9)
- Sync script .md exclusion
- Learn/ folder inventory (26 HTML + 6 MD files)
- Secret rotation schedule
- Branch hygiene
- Complete workflow audit (20 workflows)
- Incident log

### 3. Weekly Housekeeping Workflow

Created `.github/workflows/housekeeping-weekly.yml`:

- Runs every Sunday at 03:00 UTC
- Audits public paths for .md files (Rule 9)
- Checks Learn/ folder staleness
- Reports branch hygiene
- Inventories docs/archive/
- Creates GitHub issue with report

### 4. DWS Document Standard v1.5

Updated `DWS_DOCUMENT_STANDARD.md` with:

- **OUTDATED** as a formal publication status
- Document lifecycle procedure (sections 2.4-2.5)
- Step-by-step marking procedure
- Archive folder structure reference

### 5. Sync Script Fix

Updated `scripts/sync-landing-pages.js`:

- Added `.md` exclusion guard (Rule 9)
- Prevents .md file reintroduction on future syncs

---

## Files Changed (This Sprint)

### Standards & Policy
| File | Action | Version |
|------|--------|---------|
| `DWS_DOCUMENT_STANDARD.md` | Updated — OUTDATED status + lifecycle | 1.4 → 1.5 |
| `DWS_SECURITY_STANDARD.md` | Updated — HIL automation section 11.1 | +0.1 |
| `Admin/SECURITY_COMPLIANCE.md` | Updated — automated code review controls | 1.3 → 1.4 |
| `SITE_QUALITY_STANDARDS.md` | Updated — code review requirements | +0.1 |
| `HOUSEKEEPING_POLICY.md` | **Created** — operational procedures | 1.0 → 1.1 |
| `CLAUDE.md` | Updated — Rules 8+9, thesis rules, version tracking | +edits |

### Thesis Documents
| File | Action | Version |
|------|--------|---------|
| `docs/metropolia/master-thesis/en/V3Thesis_EN.md` | Updated — Appendix H (HIL automation) | 3.3 → 3.7 |
| `docs/metropolia/master-thesis/fi/V3Thesis_FI.md` | Updated — Liite H (HIL automation) | 3.3 → 3.7 |
| `docs/PHD_FIREHORSE_EN.md` | Updated + moved from public | 1.0 → 1.1 |
| `docs/PHD_FIREHORSE_FI.md` | Updated + moved from public | 1.0 → 1.1 |

### Admin & Manuals
| File | Action | Version |
|------|--------|---------|
| `Admin/ADMIN_MANUAL.md` | Updated — PR workflow section | 2.2 → 2.3 |

### Workflows
| File | Action |
|------|--------|
| `.github/workflows/ai-pr-review.yml` | Updated — Level 4 Standards Check |
| `.github/workflows/housekeeping-weekly.yml` | **Created** — weekly audit |

### Scripts
| File | Action |
|------|--------|
| `scripts/sync-landing-pages.js` | Updated — .md exclusion guard |

### Learn/ Folder
| File | Action |
|------|--------|
| `Learn/V3Thesis_EN_v3.7.html` | **Created** — versioned HTML |
| `Learn/V3Thesis_FI_v3.7.html` | **Created** — versioned HTML |
| `Learn/PHD_FIREHORSE_EN_v1.1.html` | **Created** — versioned HTML |
| `Learn/PHD_FIREHORSE_FI_v1.1.html` | **Created** — versioned HTML |
| `Learn/PHD_FIREHORSE_EN.md` | **Moved** from public path |
| `Learn/PHD_FIREHORSE_FI.md` | **Moved** from public path |
| `Learn/learn-sprint.md` | **Created** — this file |

### Archive (Mass Move)
- **120 .md files** moved from public paths to `docs/archive/` with 7 subfolders

---

## Key Rules Established

| Rule | Location | Summary |
|------|----------|---------|
| **Rule 8** | CLAUDE.md | Never delete files — always `git mv` to archive |
| **Rule 9** | CLAUDE.md | Never publish .md files to public deployment paths |
| **Thesis Rule** | CLAUDE.md | All 4 thesis files are PRIVATE, update together, verify versions with user |
| **OUTDATED Procedure** | DWS_DOCUMENT_STANDARD.md | Formal lifecycle: DRAFT → ACTIVE → OUTDATED → ARCHIVED |

---

## Incidents Discovered & Fixed

| Incident | Root Cause | Fix |
|----------|-----------|-----|
| 124 .md files in public paths | No rule preventing .md in deployment | Moved to docs/archive/, added Rule 9 |
| PHD Firehorse publicly exposed | Thesis in dws10.com/docs/ | Moved to docs/ + Learn/ (PRIVATE) |
| Thesis version drift (3.3→3.7) | AI agents don't cross-check git log | Added version verification rule |
| Sync script can reintroduce .md | No exclusion filter | Added .md exclusion guard |

---

## What's Next

- [ ] Verify housekeeping workflow runs successfully on Sunday
- [ ] Add thesis files to `Generate-PDFs.ps1` file list
- [ ] First quarterly review in May 2026
- [ ] Monitor Level 4 standards check on next PR
- [ ] Rotate secrets marked "Review immediately" in HOUSEKEEPING_POLICY.md
