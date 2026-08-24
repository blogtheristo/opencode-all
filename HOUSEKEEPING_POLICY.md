# DWS Housekeeping Policy

***
# VERSION AND AGENT HISTORY

Version: 1.1

Sessions & Modifications:
  - Version: 1.0 | Tool: Claude Code (Opus 4.6) | Session: e5wXD | Date: 20.02.2026 | Changes: Initial creation — public path enforcement, archive policy, sync exclusion, document lifecycle, Learn/ regeneration, secret rotation, branch hygiene
  - Version: 1.1 | Tool: Claude Code (Opus 4.6) | Session: e5wXD | Date: 21.02.2026 | Changes: Added Learn/ folder inventory, complete workflow audit (20 workflows), housekeeping workflow, sync script fix status update

Session Links & References:
  - Claude Code (e5wXD): https://claude.ai/code/session_01G3jtczbnAPw3ofYVBFYoow
  - View on GitHub: https://github.com/blogtheristo/dws6/blob/main/HOUSEKEEPING_POLICY.md

Document Status:
  - Created: 20.02.2026
  - Last Modified: 21.02.2026
  - Language: English
  - Publication Status: ACTIVE

***

**Version:** 1.1
**Effective Date:** 2026-02-21
**Status:** Active
**Owner:** Development Team

---

## 1. Document Lifecycle

Every `.md` document has a lifecycle status:

| Status | Meaning | Location | Action |
|--------|---------|----------|--------|
| **DRAFT** | Work in progress | `docs/`, source folder | Active development |
| **ACTIVE** | Current, maintained | `docs/`, `Admin/`, repo root | Regular updates |
| **OUTDATED** | Superseded, no longer maintained | `docs/archive/` | Add OUTDATED header, move to archive |
| **ARCHIVED** | Historical record only | `docs/archive/` | No further updates |

### Marking a Document as OUTDATED

Add this block immediately after the title:

```markdown
> **STATUS: OUTDATED** — This document is no longer maintained.
> Superseded by: [link or description]
> Archived: DD.MM.YYYY
```

### Archive Folder Structure

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

---

## 2. Public Path Enforcement (CRITICAL)

**No `.md` files in public deployment paths.** (CLAUDE.md Rule 9)

### Protected Paths

| Path | Deploys To | Must contain ZERO .md files |
|------|-----------|---------------------------|
| `dws10.com/` | Cloudflare Workers | Yes |
| `landing-pages/dws10-com/` | Cloudflare Pages | Yes |
| `dws6.com/` | Cloudflare Pages | Yes |
| `landing-pages/dws6-com/` | Cloudflare Pages | Yes |
| `onelifetime.world/` | Cloudflare Workers | Yes |
| `landing-pages/onelifetime-world/` | Cloudflare Pages | Yes |

### Enforcement

| Method | Frequency | Status |
|--------|-----------|--------|
| Manual audit (`find <path> -name "*.md"`) | Per session | Active |
| CI check in PR workflow (Level 4) | Per PR | **DONE** — added to `ai-pr-review.yml` as Level 4 Standards Check |
| Sync script exclusion | On sync | **DONE** — added `.md` exclusion guard to `sync-landing-pages.js` |

---

## 3. Sync Script .md Exclusion

`scripts/sync-landing-pages.js` copies files from root folders to `landing-pages/`. It MUST exclude `.md` files to prevent reintroduction.

**Applied filter (2026-02-21):**
```javascript
// Rule 9: Never publish .md files to public deployment paths
const EXCLUDED_EXTENSIONS = ['.md'];
// In sync loop:
if (EXCLUDED_EXTENSIONS.some(ext => entry.endsWith(ext))) continue;
```

**Status:** DONE — applied in session e5wXD (2026-02-21).

---

## 4. Learn/ Folder Management

The `Learn/` folder stores internal HTML versions of documents for the morning briefing pipeline and private thesis source files.

### Current Inventory (as of 2026-02-21)

**HTML Files (Generated):**

| File | Source | Type |
|------|--------|------|
| `ADMIN_MANUAL.html` | `Admin/ADMIN_MANUAL.md` | Non-versioned (overwritten) |
| `ADMIN_MANUAL_AUTHENTICATION.html` | `Admin/ADMIN_MANUAL_AUTHENTICATION.md` | Non-versioned |
| `ADMIN_MANUAL_DWS10_STORE_PAYMENTS.html` | Admin manual | Non-versioned |
| `ADMIN_MANUAL_DWS6_COM.html` | Admin manual | Non-versioned |
| `ADMIN_MANUAL_FILES_AND_FOLDERS.html` | Admin manual | Non-versioned |
| `ADMIN_MANUAL_GAPS_ANALYSIS.html` | Admin manual | Non-versioned |
| `ADMIN_MANUAL_SECURITY_MONITORING.html` | Admin manual | Non-versioned |
| `ADMIN_MANUAL_SECURITY_TESTING.html` | Admin manual | Non-versioned |
| `ADMIN_MANUAL_SUPABASE_EN_v1.html` | Admin manual | Non-versioned |
| `ADMIN_MANUAL_TESTING.html` | Admin manual | Non-versioned |
| `CLAUDE.html` | `CLAUDE.md` | Non-versioned |
| `DWS_DOCUMENT_STANDARD.html` | `DWS_DOCUMENT_STANDARD.md` | Non-versioned |
| `Document-index.html` | `docs/Document-index.md` | Non-versioned |
| `INVESTOR_MEMO.html` | Investor memo | Non-versioned |
| `SALES_AI_AGENT_DESIGN_FI_v1.html` | Sales design doc | Non-versioned |
| `SECURITY_COMPLIANCE.html` | `Admin/SECURITY_COMPLIANCE.md` | Non-versioned |
| `V3-DWS-IQ6-InvestorPD_2026.html` | Investor pitch deck | Non-versioned |
| `V3Thesis_EN.html` | Metropolia thesis (EN) | Non-versioned (stale) |
| `V3Thesis_FI.html` | Metropolia thesis (FI) | Non-versioned (stale) |
| `enterprise-sales.html` | Enterprise sales doc | Non-versioned |
| `investor-pitch-deck.html` | Investor pitch deck | Non-versioned |
| `Kriittinen_havainto_Omnibus_Fit55_analyysi_v3.2.html` | EU analysis | Versioned |
| `V3Thesis_EN_v3.7.html` | Metropolia thesis (EN) v3.7 | Versioned |
| `V3Thesis_FI_v3.7.html` | Metropolia thesis (FI) v3.7 | Versioned |
| `PHD_FIREHORSE_EN_v1.1.html` | PHD Firehorse (EN) v1.1 | Versioned |
| `PHD_FIREHORSE_FI_v1.1.html` | PHD Firehorse (FI) v1.1 | Versioned |

**Markdown Files (Private Source — NEVER deploy publicly):**

| File | Purpose |
|------|---------|
| `README.md` | Learn/ folder documentation |
| `PHD_FIREHORSE_EN.md` | PHD Firehorse thesis (English) — PRIVATE |
| `PHD_FIREHORSE_FI.md` | PHD Firehorse thesis (Finnish) — PRIVATE |
| `AWESOME_LLM_APPS_EXTRACTION_GUIDE.md` | LLM apps guide |
| `DWS_AGENTS_COMPLETE_GUIDE.md` | DWS agents guide |
| `MISSING_AGENTS_ANALYSIS.md` | Agents gap analysis |

### Regeneration Policy

| Trigger | Action | Tool |
|---------|--------|------|
| Thesis version bump | Generate `Learn/<name>_v<version>.html` | `python3 -c "import markdown"` or `pandoc` |
| Admin manual update | Regenerate `Learn/<name>.html` | `Generate-PDFs.ps1` (Windows) |
| New document added | Generate HTML if in script file list | `Generate-PDFs.ps1` |

### Rules

- **NEVER delete old versioned HTML files** — they serve as version history
- Versioned naming: `V3Thesis_EN_v3.7.html`, `PHD_FIREHORSE_EN_v1.1.html`
- Non-versioned files (`ADMIN_MANUAL.html`) are overwritten by the script
- Thesis files are NOT in `Generate-PDFs.ps1` — generate manually or add to script
- PHD Firehorse .md files in Learn/ are PRIVATE — never deploy publicly

### Cross-Platform Generation

| Environment | Tool | Command |
|-------------|------|---------|
| Windows | Pandoc + Generate-PDFs.ps1 | `.\scripts\Generate-PDFs.ps1` |
| Linux/Chromebook | Python markdown | `python3 -c "import markdown; ..."` |
| Mobile | Not available | Push and generate on next desktop session |

---

## 5. Duplicate File Cleanup

The archive contains `_lp` suffix files — landing-pages copies identical to root copies.

| File | Origin | Duplicate |
|------|--------|-----------|
| `DEPLOY_HERO.md` | `dws10.com/Hero/` (source) | `DEPLOY_HERO_lp.md` (landing-pages copy) |

**Policy:** Keep `_lp` files for now (they preserve git rename history). On next quarterly review, verify they're identical and consolidate if so.

---

## 6. Secret Rotation Schedule

| Secret | Rotation | Last Rotated | Next Due |
|--------|----------|-------------|----------|
| `ANTHROPIC_API_KEY` | Quarterly | Unknown | Review immediately |
| `GOOGLE_AI_API_KEY` | Quarterly | Feb 2026 | May 2026 |
| `RESEND_API_KEY` | Quarterly | Unknown | Review immediately |
| `JWT_SECRET` | Semi-annual | Unknown | Review immediately |
| `SUPABASE_SERVICE_KEY` | Semi-annual | Unknown | Review immediately |

**Process:** Rotate in provider dashboard → update GitHub Secrets → update Google Secret Manager → update `.env` files → verify all services work.

---

## 7. Dependency Vulnerability Management

| Check | Frequency | Tool | Current Status |
|-------|-----------|------|---------------|
| npm audit | Weekly | Dependabot + manual | 11 open vulnerabilities |
| Python safety | Weekly | `safety check` | Not scheduled |
| GitHub Dependabot | Continuous | GitHub | Active, alerts open |

**Policy:** Critical/High vulnerabilities must be addressed within 7 days. Moderate within 30 days.

---

## 8. Branch Hygiene

| Policy | Rule |
|--------|------|
| Auto-delete after merge | Enabled (GitHub setting) |
| Stale unmerged branches | Review monthly, close PRs > 30 days old |
| Orphaned worktrees | `git worktree prune` monthly |
| Naming convention | `claude/<feature>-<id>` for AI work |

---

## 9. Version Consistency

### Thesis Version Tracking

| Check | When | How |
|-------|------|-----|
| Verify version number | Before any thesis update | Read file header, ask user if unsure |
| Cross-check EN/FI | After any thesis update | Both must match |
| Git log review | If version seems off | `git log --oneline -- <file>` |

### DWS Standards Version Tracking

All standards files have VERSION AND AGENT HISTORY blocks. On update:
1. Read current version
2. Increment by 0.1
3. Add session entry with date, tool, changes
4. Update footer metadata

---

## 10. GitHub Actions Workflow Audit

**Total Active Workflows: 20** (as of 2026-02-21)

### Housekeeping & Backup Workflows

| Workflow | File | Schedule | Purpose | Status |
|----------|------|----------|---------|--------|
| Daily Intellectual Assets Backup | `daily-backup.yml` | 23:55 UTC daily | Backs up marketing, dashboard, auth, docs | Active |
| Daily Claude Session Backup | `daily-claude-backup.yml` | 06:00 UTC daily | Claude Code session data from worktrees | Active |
| Daily Site Backup | `daily-site-backup.yml` | 02:00 UTC daily | All 3 sites + landing-pages as tar.gz | Active |
| Sync DWS6.com Landing Pages | `sync-dws6-landing-pages.yml` | On push to main | rsync all sites to landing-pages/ | Active |
| Update Store Feed | `update-store.yml` | On push to Store/** | Google Merchant Feed + product pages | Active |
| No-Delete Guard | `no-delete-branch-guard.yml` | On branch delete | Auto-restores deleted branches | Active |

### Security Scanning Workflows

| Workflow | File | Schedule | Purpose | Status |
|----------|------|----------|---------|--------|
| Daily Security Scan (ZenFree) | `security-scan-daily.yml` | 02:30 UTC daily | Critical bug scanner | Active |
| Weekly Security Scan (ZenFree) | `security-scan-weekly.yml` | 21:00 UTC Sunday | Full weekly scan, issue creation | Active |
| Enhanced Security Audit | `security-audit-enhanced.yml` | 02:00 UTC Monday | .gitignore, pre-commit, doc audit | Active |
| Monthly Security Audit | `monthly-security-audit-enhanced.yml` | 00:00 UTC 1st | Multi-phase audit + Aikido correlation | Active |
| Bi-Weekly Auth Security Audit | `biweekly-auth-security-audit.yml` | 02:00 UTC 1st/15th | JWT, bcrypt, OWASP Top 10 | Active |
| Dependency Review | `dependency_review.yml` | 00:00 UTC Sunday | pip-audit, safety, SBOM, license | Active |
| PR Security Check (Aikido) | `security-check-pr.yml` | On PR | Aikido vulnerability scan | Active |

### Code Quality & AI Review Workflows

| Workflow | File | Schedule | Purpose | Status |
|----------|------|----------|---------|--------|
| AI Code Review (HIL) | `ai-pr-review.yml` | On PR | Claude + Gemini dual review + Copilot fixes | Active |
| PR Auto-Merge | `pr-auto-merge.yml` | On check_suite/label | Auto-merge `ai-approved` PRs | Active |
| Ruff Linting & Formatting | `ruff.yml` | On PR (*.py) | Python linting | Active |
| Ruff Auto-Fix | `ruff-auto-fix.yml` | Manual dispatch | Auto-fix Python issues | Active |

### Intelligence & Reporting Workflows

| Workflow | File | Schedule | Purpose | Status |
|----------|------|----------|---------|--------|
| Morning Briefing | `morning-briefing.yml` | 03:00-04:00 UTC Mon-Sat | CEO Cockpit email (Helsinki TZ) | Active |
| DWS7 Roadmap Tracker | `roadmap-weekly-tracker.yml` | 08:00 UTC Monday | 247 PR roadmap progress tracking | Active |

### Deployment Workflows

| Workflow | File | Schedule | Purpose | Status |
|----------|------|----------|---------|--------|
| Deploy to Scaleway | `deploy-scaleway.yml` | On push to main (src/**) | Docker build + Scaleway Serverless | Active |

### Workflow Health Monitoring

| Check | Frequency | How |
|-------|-----------|-----|
| Review failed workflow runs | Weekly | GitHub Actions → Filter by "failure" |
| Verify schedule triggers | Monthly | Check that scheduled workflows ran on time |
| Audit workflow secrets | Quarterly | Verify all required secrets are set |
| Review workflow permissions | Quarterly | Ensure minimum required permissions |
| Update action versions | Quarterly | Check for deprecated `actions/*` versions |

---

## 11. Quarterly Review Checklist

**Every quarter (March, June, September, December):**

- [ ] Run public path audit: `find dws10.com dws6.com onelifetime.world landing-pages -name "*.md"`
- [ ] Review `docs/archive/` for files that can be consolidated
- [ ] Remove `_lp` duplicates if verified identical
- [ ] Check Dependabot alerts, close resolved, triage new
- [ ] Rotate secrets per schedule (Section 6)
- [ ] Prune orphaned worktrees: `git worktree prune`
- [ ] Review stale branches: `git branch -r --merged`
- [ ] Regenerate stale Learn/ HTMLs
- [ ] Update this policy if new patterns emerge

---

## 12. Incident Log

| Date | Incident | Root Cause | Fix | Policy Added |
|------|----------|-----------|-----|-------------|
| 2026-02-20 | 124 .md files in public paths | No rule preventing .md in deployment | Moved to docs/archive/, added Rule 9 | Section 2 |
| 2026-02-20 | Thesis version drift (3.3→3.7) | AI agents don't cross-check git log | Added version verification rule | Section 9 |
| 2026-02-20 | PHD Firehorse publicly exposed | Thesis in dws10.com/docs/ | Moved to docs/ + Learn/ | CLAUDE.md Thesis Rule |
| 2026-01 | Worktree security incident | Manual worktree without .env copy | Created automated scripts | CLAUDE.md Section 4 |

---

**Review Cycle:** Quarterly
**Next Review:** May 2026
**Contact:** risto@lifetime.fi
