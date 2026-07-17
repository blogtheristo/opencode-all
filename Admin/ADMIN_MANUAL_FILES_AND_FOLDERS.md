# Admin Manual: Files and Folders Structure

---

# VERSION AND AGENT HISTORY

Version: 1.4

Sessions & Modifications:

- Version: 1.0 | Tool: Claude Code | Session: 0131N2quMXnPZg6UAsreazMV | Date: 09.12.2025 | Changes: Initial creation
- Version: 1.1 | Tool: Claude Code | Session: Week 52 | Date: 22.12.2025 | Changes: Agent Foundry Architecture, Construction Vertical Spec, Document Management System integration
- Version: 1.2 | Tool: Claude Code | Session: IjtD0 | Commit: (pending) | Date: 26.12.2025 | Changes: Added Site Quality Standards, Workflow Management System, Daily Backups, Multi-Site Deployment coverage
- Version: 1.3 | Tool: Claude Code | Session: bold-herschel | Commit: (pending) | Date: 13.02.2026 | Changes: Added Claude Session Backup System documentation
- Version: 1.4 | Tool: Cursor | Session: claude/amazon-ses-google-drive | Commit: (pending) | Date: 13.03.2026 | Changes: Added ClaudeCode root-folder policy and secret triage rules (Admin/Claudecode_Secrets)

Session Links & References:

- Claude Code (IjtD0): https://github.com/blogtheristo/dws6/commits/claude/site-quality-standards-IjtD0
- View on GitHub: https://github.com/blogtheristo/dws6/blob/main/Admin/ADMIN_MANUAL_FILES_AND_FOLDERS.md

Document Status:

- Created: 09.12.2025
- Last Modified: 22.04.2026
- Language: English (Suomi thesis included)
- Languages Available: English, Suomi (partial)
- Publication Status: ✅ ACTIVE

---

**Document Version**: 1.4
**Last Updated**: March 13, 2026 (Session claude/amazon-ses-google-drive)
**Maintainer**: Risto Anton Päärni (risto@lifetime.fi)
**Session Update**: ClaudeCode folder policy and secret triage

---

## 📋 Session Week 52 Additions

### New AgentFoundry/ Subdirectories

```
AgentFoundry/
├── AGENT_FOUNDRY_ARCHITECTURE_STANDARD.md      # NEW: Multi-model architecture (LWM, NCC, 8 verticals)
├── CONSTRUCTION_VERTICAL_SPECIFICATION.md      # NEW: Construction industry specs, 6 agents, 12 workflows
├── LIFETIME_AGENT_FOUNDRY_CUSTOMER.md          # NEW: Customer-facing overview (Acer NG100 focus)
├── Calculus_for_Training.md                    # UPDATED: Now complies with DWS6 document management standard
└── [protected local - not on GitHub]           # .gitignore: liiketoimintakriittinen sisältö
```

### New Admin/ Documentation Management

```
Admin/
├── GEMINI_DOCUMENT_WORKFLOW.md                 # NEW: Gemini workflow for document formatting
├── AGENT_SKILLS_STANDARD.md                   # NEW: Microsoft Agent Framework compatible skills
├── WEB_DOCUMENT_PUBLISHING_GUIDE.md            # NEW: Web publishing (.md → .html) standards
├── CLAUDE_SYSTEM_PROMPT.md                    # NEW: Claude.ai system prompt for DWS6 docs
├── dws6_skills.json                           # NEW: Production-ready skill registry
├── dws6_workflows.json                        # NEW: Workflow registry
├── dws6_agent_executor.py                     # NEW: Python executor for skills/workflows
├── AGENT_EXECUTOR_README.md                   # NEW: Quick start guide
├── AGENT_SKILLS_INTEGRATION_SUMMARY.md        # NEW: Integration summary
└── [+ examples and investment docs with updated metadata]
```

### Updated Git Security

```
.gitignore (UPDATED):
  - AgentFoundry/ → protected locally (business-critical)
  - Exceptions: Only LIFETIME_AGENT_FOUNDRY_CUSTOMER.md + workflows/ on GitHub
  - GDPR/NIS2 compliance: sensitive specs local-only
```

---

## Overview / Yleiskatsaus

### 📖 English Thesis

This comprehensive admin manual describes the complete file and folder structure for the DWS IQ Platform project repository. The DWS6 ecosystem now includes:

**Core Systems:**

- **Next.js Website Projects** - Modern web applications in `in-update-claude/` directory
- **Site Quality Management** - Shared component architecture and quality standards
- **Workflow Orchestration** - Automated workflow management, monitoring, and failure recovery
- **Daily Backup System** - Automated fail-over security with date-stamped backups
- **Multi-Site Deployment** - Synchronized deployment for dws6.com, dws10.com, and onelifetime.world

**New in Version 1.2 (Session IjtD0 - December 26, 2025):**

1. **Shared Components Architecture** (`shared/` directory)
   - Eliminates code duplication across 37+ pages
   - Single navigation component used site-wide
   - CTA button standardization
   - Mobile-first responsive design

2. **Workflow Management System** (`.workflows/` directory)
   - Central registry tracking 14 workflows
   - Daily/weekly/monthly scheduling visibility
   - Automated audit and fix agents
   - Failure recovery protocols

3. **Daily Backup Procedures** (`scripts/backup-sites.sh`)
   - Automated daily backups at 2:00 AM UTC
   - Date-stamped archives (YYYY-MM-DD)
   - 30-day retention policy
   - GitHub Actions integration

4. **Multi-Site Deployment** (`landing-pages/` directory)
   - Synchronized deployment for all 3 sites
   - Cloudflare Pages integration
   - Automated rsync on content changes

This manual provides operational guidance for developers, DevOps engineers, system administrators, and IT operations teams maintaining the DWS IQ Platform infrastructure.

---

### 📖 Suomi Tiivistelmä (Finnish Thesis)

Tämä kattava admin-käsikirja kuvaa DWS IQ Platform -projektiarkiston täydellisen tiedosto- ja kansiorakenteen. DWS6-ekosysteemi sisältää nyt:

**Ydinjärjestelmät:**

- **Next.js-verkkosovellukset** - Modernit web-sovellukset `in-update-claude/` -kansiossa
- **Sivuston laatuhallinta** - Jaettu komponenttiarkkitehtuuri ja laatustandardit
- **Workflow-orkestrointi** - Automaattinen työnkulkuhallinta, seuranta ja vianhallinta
- **Päivittäinen varmuuskopiointi** - Automaattinen fail-over-suojaus päivämäärillä varustetuilla varmuuskopioilla
- **Monisivuston käyttöönotto** - Synkronoitu deployment dws6.com, dws10.com ja onelifetime.world -sivustoille

**Uutta versiossa 1.2 (Sessio IjtD0 - 26. joulukuuta 2025):**

1. **Jaettu komponenttiarkkitehtuuri** (`shared/` -kansio)
   - Poistaa koodin duplikaation 37+ sivulta
   - Yksi navigointikomponentti kaikille sivuille
   - CTA-painikkeiden standardointi
   - Mobile-first responsiivinen suunnittelu

2. **Workflow-hallintajärjestelmä** (`.workflows/` -kansio)
   - Keskitetty rekisteri 14 työnkululle
   - Päivittäisen/viikoittaisen/kuukausittaisen aikataulun näkyvyys
   - Automaattiset audit- ja korjausagentit
   - Vianhallintaprotokollat

3. **Päivittäiset varmuuskopiot** (`scripts/backup-sites.sh`)
   - Automaattiset päivittäiset varmuuskopiot klo 2:00 UTC
   - Päivämäärämerkityt arkistot (VVVV-KK-PP)
   - 30 päivän säilytysaika
   - GitHub Actions -integraatio

4. **Monisivuston deployment** (`landing-pages/` -kansio)
   - Synkronoitu käyttöönotto kaikille 3 sivustolle
   - Cloudflare Pages -integraatio
   - Automaattinen rsync sisältömuutoksissa

Tämä käsikirja tarjoaa operatiivista ohjausta kehittäjille, DevOps-insinööreille, järjestelmänvalvojille ja IT-toiminnoille, jotka ylläpitävät DWS IQ Platform -infrastruktuuria.

---

### Original Description

This document describes the file and folder structure for the DWS IQ Platform project repository, with special focus on the `in-update-claude/` directory containing Next.js website projects and related documentation.

---

## Repository Root Structure

```
dws6/
├── .git/                              # Git version control
├── .github/                           # GitHub Actions workflows
├── in-update-claude/                  # ⭐ NEW: Claude session artifacts
│   ├── documentation/                 # Session documentation
│   ├── next-js-projects/             # Complete Next.js sites
│   ├── SESSION_SUMMARY.md            # This session's overview
│   └── ADMIN_MANUAL_FILES_AND_FOLDERS.md  # This file
├── dws10.com/                        # Existing landing pages
├── onelifetime.world/                # Existing landing pages
├── docs/                             # Project documentation
├── AgentFoundry/                     # Agent configurations
├── observability/                    # Observability assessment & monitoring
├── scripts/                          # Utility scripts
├── *.md                              # Various documentation files
└── README.md                         # Main project README
```

---

## in-update-claude/ Directory

**Purpose**: Archive for Claude Code session artifacts that haven't been integrated into main project yet.

**Created**: December 9, 2025
**Session**: claude/ai-saas-platform-guide-0131N2quMXnPZg6UAsreazMV

### Subdirectories

#### 1. documentation/

Contains comprehensive guides for website deployment and account setup.

```
in-update-claude/documentation/
├── ACCOUNTS_SETUP_GUIDE.md     # Complete account creation guide
├── DEPLOYMENT_GUIDE.md         # Step-by-step deployment instructions
└── PROJECT_SUMMARY.md          # Comprehensive project overview
```

**File Details:**

| File                    | Size    | Purpose                                                  | Priority |
| ----------------------- | ------- | -------------------------------------------------------- | -------- |
| ACCOUNTS_SETUP_GUIDE.md | 10.8 KB | Lists 11 required services with signup instructions      | High     |
| DEPLOYMENT_GUIDE.md     | 9.0 KB  | Complete deployment walkthrough from local to production | High     |
| PROJECT_SUMMARY.md      | 12.5 KB | Comprehensive session overview and next steps            | Critical |

#### 2. next-js-projects/

Contains two complete, production-ready Next.js 14 applications.

```
in-update-claude/next-js-projects/
├── dws10-com/                  # DWS IQ Platform website
│   ├── .github/workflows/      # CI/CD pipelines
│   │   ├── ci.yml             # Main CI/CD workflow
│   │   ├── codeql.yml         # Security scanning
│   │   └── dependency-review.yml
│   ├── src/
│   │   ├── app/               # Next.js App Router
│   │   │   ├── layout.tsx     # Root layout
│   │   │   ├── page.tsx       # Homepage
│   │   │   └── globals.css    # Global styles
│   │   ├── components/
│   │   │   ├── layout/        # Header, Footer
│   │   │   ├── sections/      # Page sections
│   │   │   └── ui/            # Reusable components
│   │   └── lib/
│   │       └── utils.ts       # Utilities
│   ├── scripts/
│   │   ├── setup-env.sh       # Environment setup
│   │   └── upload-secrets.sh  # GitHub secrets uploader
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.ts
│   ├── next.config.js
│   ├── .env.example
│   ├── .gitignore
│   ├── README.md
│   └── SITEMAP.md             # Complete site structure (40+ pages)
│
└── onelifetime-world/          # Lifetime Oy corporate website
    ├── [Same structure as dws10-com]
    └── SITEMAP.md             # Complete site structure (35+ pages)
```

---

## File Type Descriptions

### Configuration Files

#### package.json

**Purpose**: Node.js dependencies and scripts
**Used by**: npm/yarn package managers
**Contains**:

- Dependencies (React, Next.js, TypeScript, etc.)
- Dev dependencies (ESLint, TypeScript compiler, etc.)
- Scripts (dev, build, start, lint)
- Project metadata

#### tsconfig.json

**Purpose**: TypeScript compiler configuration
**Key Settings**:

- Strict mode enabled
- Path aliases (@/_ for src/_)
- App Router support
- Incremental compilation

#### tailwind.config.ts

**Purpose**: Tailwind CSS configuration
**Customizations**:

- Custom color scheme
- Component variants
- shadcn/ui integration
- Font family configuration

#### next.config.js

**Purpose**: Next.js framework configuration
**Features**:

- Security headers
- Image optimization settings
- Compression enabled
- CORS configuration

#### .env.example

**Purpose**: Template for environment variables
**⚠️ Security**: NEVER commit actual .env files
**Contents**:

- API keys (placeholders)
- Service URLs
- Feature flags
- Environment-specific settings

### Documentation Files (.md)

#### README.md

**Purpose**: Project overview and quick start guide
**Audience**: Developers
**Contents**:

- Tech stack overview
- Getting started instructions
- Development commands
- Deployment info

#### SITEMAP.md

**Purpose**: Complete website structure planning
**Audience**: Developers, Product Managers
**Contents**:

- All pages and routes
- Page hierarchies
- MVP phases (30/60/90 days)
- Feature priorities

#### SESSION_SUMMARY.md

**Purpose**: Session recap and artifacts inventory
**Audience**: Project stakeholders
**Contents**:

- What was accomplished
- Files created
- Decisions made
- Next steps

### Source Code Files

#### Layout Files (layout.tsx)

**Purpose**: Root application layout
**Contains**:

- HTML structure
- Font imports
- Global metadata (SEO)
- Body wrapper

#### Page Files (page.tsx)

**Purpose**: Route pages
**Contains**:

- Page components
- Section composition
- Server/Client component logic

#### Component Files (components/)

**Purpose**: Reusable UI elements
**Categories**:

- **layout/**: Header, Footer (site-wide)
- **sections/**: Hero, Features, CTA (page-specific)
- **ui/**: Button, Form, Card (atomic components)

### Script Files

#### setup-env.sh

**Purpose**: Interactive environment setup
**Usage**: `./scripts/setup-env.sh`
**Function**: Prompts for env vars, creates .env.local

#### upload-secrets.sh

**Purpose**: Upload secrets to GitHub
**Usage**: `./scripts/upload-secrets.sh`
**Requires**: gh CLI installed and authenticated
**Function**: Reads .env.local, uploads to GitHub Secrets

#### local-ci.sh (PR #TBD, branch `claude/ci-hygiene-audit-vBYGo`)

**Purpose**: Local-first CI runner — replaces GitHub Actions `test.yml`, `secret-scan-gitleaks.yml`, `ruff.yml`, and npm-audit of `dependency_review.yml`
**Usage**: `bash scripts/local-ci.sh` (full) or `bash scripts/local-ci.sh --quick` (staged-diff only)
**Runs**: vitest → gitleaks → npm audit (root) → ruff (if `.py` changed)
**Output**: Writes a hash-chained audit record to `.ci-audit/runs/<ts>_<sha>.json` and POSTs to Supabase `ci_audit_log` if `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` are set
**Invoked by**: `.githooks/pre-push` (automatic on `git push`), `scripts/weekly/security-audit.sh` (DGX Spark)
**Exit 0** = all checks passed; **Exit 1** = at least one failed; **Exit 2** = infrastructure error

#### ci-audit-verify.sh (PR #TBD)

**Purpose**: Verify the local CI audit hash chain and HEAD coverage
**Usage**: `bash scripts/ci-audit-verify.sh` (HEAD) / `--chain-only` / `--commit <sha>` / `--allow-failure`
**Function**: Walks `.ci-audit/runs/` in timestamp order, recomputes SHA-256 of each record's canonical body, verifies `prev_record_hash` chain and that HEAD has an `overall_pass=true` record
**Invoked by**: `.github/workflows/ci-audit-verify.yml` (3-second GitHub gate), developers locally
**Exit 0** = chain intact + HEAD covered + overall_pass; **Exit 1** = any of those fail

#### ci-audit-upload.ts (PR #TBD)

**Purpose**: POST a single `.ci-audit/runs/*.json` record to Supabase `ci_audit_log`
**Usage**: `npx tsx scripts/ci-audit-upload.ts <record.json>`
**Requires**: `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` env vars
**No-op mode**: Exits 0 with a warning if env unset or `ci_audit_log` table missing — allows local-ci to succeed before migration is applied
**Invoked by**: `scripts/local-ci.sh` (finalize step)

#### weekly/security-audit.sh (PR #TBD)

**Purpose**: DGX Spark weekly replacement for `security-audit-enhanced.yml`, `security-scan-weekly.yml`, `security-scan-biweekly.yml`, `monthly-security-audit-enhanced.yml`
**Usage**: Auto-discovered by day-runner; runs Sunday 04:00 UTC on DGX Spark
**Function**: Runs `npm audit --audit-level=moderate`, `bandit`, `safety`, full `gitleaks detect`, then `local-ci.sh` with `runner_kind=dgx-spark`, `trigger_kind=weekly-security-audit`
**Output**: Reports in `logs/security-audit/<date>/` + audit record in Supabase

### Workflow Files (.github/workflows/)

#### ci.yml

**Purpose**: Main CI/CD pipeline
**Triggers**: Push to main/develop, Pull requests
**Jobs**:

1. Lint & Type Check
2. Build verification
3. Deploy to Vercel (preview/production)
4. Lighthouse performance audit

#### codeql.yml

**Purpose**: Security vulnerability scanning
**Triggers**: Push, PR, weekly schedule
**Function**: Analyzes code for security issues

#### dependency-review.yml

**Purpose**: Dependency vulnerability check
**Triggers**: Pull requests
**Function**: Blocks PRs with high-severity vulnerabilities

#### ci-audit-verify.yml (PR #TBD, branch `claude/ci-hygiene-audit-vBYGo`)

**Purpose**: 3-second GitHub gate — verifies every pushed HEAD has a local CI audit record with `overall_pass=true`. Replaces the need to re-run vitest/gitleaks/etc. on GitHub's meter.
**Triggers**: Push to `main` or `claude/**`, pull_request targeting `main`
**Function**: `actions/checkout` → `bash scripts/ci-audit-verify.sh --commit <sha>`. Fails if chain broken, HEAD lacks a record, or latest record shows failure.
**Replaces**: `test.yml`, `secret-scan-gitleaks.yml`, `dependency_review.yml`, `ruff.yml` (all renamed `.yml.disabled` in the same PR)
**Duration**: ~3 seconds

### Disabled Workflows (`.yml.disabled`)

Disabled = kept as failover, rename back to `.yml` to re-enable. Renamed in PR #TBD (branch `claude/ci-hygiene-audit-vBYGo`):

- `test.yml.disabled` — replaced by `scripts/local-ci.sh` check `vitest`
- `secret-scan-gitleaks.yml.disabled` — replaced by check `gitleaks-full`
- `dependency_review.yml.disabled` — replaced by check `npm-audit-root` + `scripts/daily/dependabot-audit.sh`
- `ruff.yml.disabled` — replaced by check `ruff-check`
- `campaign-newsletter.yml.disabled`, `captain-briefing.yml.disabled`, `morning-briefing.yml.disabled`, `outreach-digest.yml.disabled`, `regulation-monitor.yml.disabled`, `social-scheduler.yml.disabled`, `weekly-report.yml.disabled` — pre-existing, migrated to DGX Spark cron

### CI Audit Directory (`.ci-audit/`) — PR #TBD

Tamper-evident local mirror of the Supabase `ci_audit_log` legal record-of-truth.

- `.ci-audit/README.md` — quick-reference: record format, tamper evidence, retention
- `.ci-audit/runs/<ISO>_<shortsha>.json` — one file per CI run, hash-chained. Never delete; git history is the retention policy.

### CI Audit Documentation — PR #TBD

- `docs/CI_AUDIT.md` — Full developer spec: architecture diagram, record schema, Supabase migration SQL (RED-zone, apply manually), setup instructions, failure-mode cheatsheet
- `Admin/ADMIN_MANUAL_AUDIT.md` — External-auditor manual: audit-trail inventory, sample SQL queries, integrity verification, retention policy, auditor access model
- `Admin/GITHUB_APPS_AUDIT.md` — Audit of 9 installed GitHub Apps with keep / review / remove verdict; suspected source of `submit-pypi`; Continue → Claude Code migration patterns
- `docs/field-notes/2026-04-22-ci-hygiene-audit.md` — Baseline audit of main's CI red state (5 root causes, 8 failures categorised)

---

## Integration Guide

### How to Use These Files in Production

#### Option 1: Replace Existing Projects (Recommended)

```bash
# On Windows or Chromebook
cd ~/dws6  # or D:\Proton\My files\2026\Repos2026\dws6

# Backup existing sites
cp -r dws10.com dws10.com.backup-$(date +%Y%m%d)
cp -r onelifetime.world onelifetime.world.backup-$(date +%Y%m%d)

# Replace with Next.js versions
rm -rf dws10.com/*
rm -rf onelifetime.world/*
cp -r in-update-claude/next-js-projects/dws10-com/* dws10.com/
cp -r in-update-claude/next-js-projects/onelifetime-world/* onelifetime.world/

# Install dependencies
cd dws10.com && npm install
cd ../onelifetime.world && npm install

# Test locally
cd dws10.com && npm run dev  # Port 3000
cd onelifetime.world && npm run dev  # Port 3001
```

#### Option 2: Keep Separate (Testing)

```bash
# Test new Next.js sites alongside existing ones
cd ~/dws6/in-update-claude/next-js-projects/dws10-com
npm install
npm run dev

# Access at http://localhost:3000
# Original dws10.com stays unchanged
```

#### Option 3: Gradual Migration

```bash
# Copy specific components or pages one at a time
cp in-update-claude/next-js-projects/dws10-com/src/components/sections/hero.tsx \
   dws10.com/src/components/sections/

# Incrementally upgrade while keeping existing site live
```

---

## File Permissions & Ownership

### Recommended Permissions

```bash
# Directories: 755 (rwxr-xr-x)
find in-update-claude -type d -exec chmod 755 {} \;

# Files: 644 (rw-r--r--)
find in-update-claude -type f -name "*.md" -exec chmod 644 {} \;
find in-update-claude -type f -name "*.json" -exec chmod 644 {} \;

# Scripts: 755 (rwxr-xr-x - executable)
find in-update-claude -type f -name "*.sh" -exec chmod 755 {} \;
```

### Security Considerations

**NEVER commit these files**:

- ❌ `.env`
- ❌ `.env.local`
- ❌ `.env.production`
- ❌ `node_modules/`
- ❌ `.next/`
- ❌ Personal access tokens

**Always in .gitignore**:

```gitignore
.env*.local
.env
node_modules/
.next/
*.log
.vercel
```

---

## Maintenance Schedule

### Daily

- Monitor CI/CD pipeline status
- Check Sentry for errors
- Review Vercel deployment logs

### Weekly

- Update dependencies: `npm update`
- Review security alerts (GitHub Dependabot)
- Check analytics (Plausible/GA4)

### Monthly

- Rotate API keys and tokens
- Review and update documentation
- Performance audit (Lighthouse)
- Security scan (npm audit)

### Quarterly

- Major dependency upgrades
- Comprehensive security review
- Backup verification
- Documentation review

---

## Troubleshooting

### Common Issues

#### 1. "Module not found" errors

```bash
# Solution: Install dependencies
npm install

# Or clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### 2. Port already in use

```bash
# Solution: Change port in package.json or kill process
# dws10-com uses port 3000
# onelifetime-world uses port 3001

# Kill process using port
lsof -ti:3000 | xargs kill -9  # Linux/Mac
netstat -ano | findstr :3000   # Windows
```

#### 3. Build failures

```bash
# Solution: Check TypeScript errors
npm run type-check

# Check linting
npm run lint

# Clear Next.js cache
rm -rf .next
npm run build
```

#### 4. Environment variables not loading

```bash
# Solution: Ensure .env.local exists
cp .env.example .env.local

# Edit with actual values
nano .env.local  # or use your editor

# Restart dev server
npm run dev
```

---

## Shared Components Architecture

### Purpose

The `shared/` directory contains reusable components that eliminate code duplication across all 37+ website pages.

### Directory Structure

```
shared/
├── components/
│   ├── navigation.html        # Shared navigation component (150+ lines)
│   ├── navigation.js          # Navigation JavaScript functionality
│   ├── cta-buttons.css        # CTA button standardization
│   └── example-page.html      # Component usage example
└── README.md                  # Component documentation
```

### Key Benefits

- **93% Code Reduction** - From 5,550+ lines of duplicate navigation to single component
- **Consistency** - Same navigation across all pages
- **Mobile-First** - Responsive design out of the box
- **WCAG 2.1 AA** - Accessibility compliance built-in

### Usage

```html
<!-- Include in any page -->
<div id="navigation-container"></div>
<script src="/shared/components/navigation.js"></script>
<link rel="stylesheet" href="/shared/components/cta-buttons.css" />
```

### Related Files

- **SITE_QUALITY_STANDARDS.md** - Quality policy and standards
- **IMPLEMENTATION_GUIDE.md** - Step-by-step implementation guide
- **IMPLEMENTATION_WORKFLOW.md** - 10-phase update workflow
- **QUALITY_STANDARDS_README.md** - Executive summary

---

## Workflow Management System

### Purpose

The `.workflows/` directory provides centralized workflow orchestration, monitoring, and automated failure recovery for all 14 system workflows.

### Directory Structure

```
.workflows/
├── README.md                    # System overview
├── registry/
│   ├── WORKFLOW_REGISTRY.json   # Master registry (14 workflows)
│   ├── github-workflows.json    # GitHub Actions metadata
│   └── site-workflows.json      # Site quality workflows
├── schedules/
│   ├── daily.json              # Today's scheduled workflows
│   ├── weekly.json             # This week's schedule
│   └── monthly.json            # This month's schedule
├── audit/
│   ├── YYYY-MM-DD/             # Daily audit logs
│   ├── backups/                # Backup logs
│   └── failures/               # Failure analysis reports
├── agents/
│   ├── audit-agent.js          # Automated failure analysis
│   ├── fix-agent.js            # Automated fix generation
│   └── recovery-protocols/     # Recovery procedures
└── templates/
    ├── github-action.yml       # Workflow templates
    └── site-workflow.md
```

### Key Features

#### 1. Workflow Registry

Tracks all 14 workflows:

- 2 daily workflows (backups, security)
- 2 weekly workflows (reports, cache purge)
- 3 monthly workflows (audits, investor tracking)
- 5 on-push workflows (deployment, sync)
- 1 on-PR workflow (security checks)
- 1 manual workflow (site quality implementation)

#### 2. Automated Failure Recovery

```bash
# When a workflow fails:
1. Failure detected automatically
2. Audit agent analyzes root cause
3. Fix agent proposes solution
4. Integration with GitHub Copilot for complex issues
```

#### 3. Visibility Dashboard

```bash
# View today's workflows
cat .workflows/schedules/daily.json

# View this week's schedule
cat .workflows/schedules/weekly.json

# View workflow registry
cat .workflows/registry/WORKFLOW_REGISTRY.json
```

### Common Operations

#### Check Workflow Status

```bash
# View all workflows
grep -A5 '"name":' .workflows/registry/WORKFLOW_REGISTRY.json

# Check failing workflows
grep -B5 '"status": "failing"' .workflows/registry/WORKFLOW_REGISTRY.json
```

#### Run Audit Agent

```bash
# Audit latest failure
node .workflows/agents/audit-agent.js --latest

# Audit specific workflow
node .workflows/agents/audit-agent.js --workflow sync-site-content
```

#### Run Fix Agent

```bash
# Generate fix for latest failure
node .workflows/agents/fix-agent.js --latest

# Apply fix automatically
node .workflows/agents/fix-agent.js --latest --apply
```

### Related Files

- **.github/workflows/** - All GitHub Actions workflows
- **scripts/** - Utility scripts used by workflows
- **GITHUB_COPILOT_GUIDE.md** - Integration instructions

---

## Daily Backup Procedures

### Purpose

Automated daily backups protect all sites against data loss, accidental deletions, and deployment failures with date-stamped archives.

### Backup Configuration

#### What Gets Backed Up

- `dws6.com/` - Main DWS6 site
- `dws10.com/` - Platform site
- `onelifetime.world/` - Community site
- `landing-pages/dws6-com/` - DWS6 landing pages
- `landing-pages/dws10-com/` - Platform landing pages
- `landing-pages/onelifetime-world/` - Community landing pages

#### Backup Schedule

- **Frequency:** Daily at 2:00 AM UTC
- **Retention:** 30 days
- **Storage:** GitHub Actions artifacts + local `backups/` directory

### Directory Structure

```
backups/
└── sites/
    ├── 2025-12-26/
    │   ├── dws6-com_2025-12-26_02-00-00.tar.gz
    │   ├── dws10-com_2025-12-26_02-00-00.tar.gz
    │   ├── onelifetime-world_2025-12-26_02-00-00.tar.gz
    │   ├── [landing-pages backups]
    │   └── MANIFEST.txt
    ├── 2025-12-27/
    └── latest -> 2025-12-27/  # Symlink to latest
```

### Common Operations

#### Manual Backup

```bash
# Run backup script manually
./scripts/backup-sites.sh

# Backups created in: backups/sites/YYYY-MM-DD/
```

#### List Backups

```bash
# List all backups
ls -lh backups/sites/

# View latest backups
ls -lh backups/sites/latest/

# Read manifest
cat backups/sites/latest/MANIFEST.txt
```

#### Restore Site

```bash
# Example: Restore dws10.com
tar -xzf backups/sites/2025-12-26/dws10-com_*.tar.gz

# Verify
ls -la dws10.com/

# Deploy if needed
git add dws10.com/
git commit -m "restore: dws10.com from backup"
git push origin main
```

### Fail-Over Scenarios

#### Accidental Deletion

```bash
# Restore from latest backup
tar -xzf backups/sites/latest/[site-name]_*.tar.gz
git add [site-name]/
git commit -m "restore: recover deleted site"
git push
```

#### Bad Deployment

```bash
# Rollback to previous day
tar -xzf backups/sites/2025-12-25/[site-name]_*.tar.gz
git add [site-name]/
git commit -m "fix: rollback to working version"
git push
```

### Related Files

- **scripts/backup-sites.sh** - Backup script
- **.github/workflows/daily-site-backup.yml** - Automated workflow
- **BACKUP_PROCEDURES.md** - Complete backup documentation
- **.workflows/audit/backups/** - Backup logs

---

## Claude Session Backup System

### Purpose

Claude Code sessions contain valuable trained agents, custom commands, skills, hooks, and settings that are **NOT committed to Git**. Each worktree has its own `.claude/` directory with session-specific data. Without backups, this data is permanently lost when a worktree is deleted.

### Architecture

The Claude Session Backup System uses two complementary mechanisms:

| Method              | Trigger                                 | Storage                                     | Retention              |
| ------------------- | --------------------------------------- | ------------------------------------------- | ---------------------- |
| **Daily Automated** | GitHub Actions, 6:00 AM UTC             | `sessions-backup` branch + GitHub artifacts | 30 days                |
| **Manual Script**   | On-demand (`Backup-ClaudeSessions.ps1`) | Local timestamped archives                  | 30 days (configurable) |

### What Gets Backed Up

Every backup captures the full `.claude/` directory from each worktree:

| Directory             | Contents                         |
| --------------------- | -------------------------------- |
| `agents/`             | Custom trained Claude agents     |
| `commands/`           | Custom commands and macros       |
| `hooks/`              | Automation hooks                 |
| `skills/`             | Trained Claude capabilities      |
| `settings.local.json` | Session preferences and settings |

### Daily Automated Backups

**Workflow file:** `.github/workflows/daily-claude-backup.yml`

- Runs daily at **6:00 AM UTC**
- Discovers all `.claude/` directories across every worktree
- Creates timestamped archives for each worktree
- Stores backups in the `sessions-backup` Git branch
- Uploads as GitHub Actions artifacts (30-day retention)
- Automatic cleanup of archives older than 30 days

#### Verify Automated Backups

```bash
# Check latest workflow run
gh run list --workflow=daily-claude-backup.yml --limit=5

# View backup branch contents
git log sessions-backup --oneline --limit=10

# Download artifacts from latest run
gh run download --name claude-sessions-backup
```

### Manual Backup Script

**Script:** `scripts/Backup-ClaudeSessions.ps1`

Cross-platform PowerShell script for immediate on-demand backups.

#### Usage

```powershell
# Run immediate backup of all worktree sessions
.\scripts\Backup-ClaudeSessions.ps1

# Backup with custom retention period (days)
.\scripts\Backup-ClaudeSessions.ps1 -RetentionDays 60
```

#### What the Script Does

1. Discovers all Git worktrees (`git worktree list`)
2. Locates `.claude/` directory in each worktree
3. Creates timestamped archive per worktree
4. Stores in local backup directory
5. Cleans up archives older than retention period

### Safety Procedures

#### Before Deleting a Worktree

1. **Run manual backup:** `.\scripts\Backup-ClaudeSessions.ps1`
2. **Verify no active Claude sessions** are running in the worktree
3. **Document what the worktree contained** for future reference
4. **Only then** safely remove: `git worktree remove /path/to/worktree`

#### Restoring Session Data

```powershell
# 1. Locate the backup archive
ls backups/claude-sessions/

# 2. Extract to the target worktree's .claude/ directory
tar -xzf backups/claude-sessions/<worktree>_<timestamp>.tar.gz -C /path/to/worktree/

# 3. Verify restored contents
ls /path/to/worktree/.claude/
```

#### Restoring from GitHub

```bash
# From the sessions-backup branch
git checkout sessions-backup -- <path-to-archive>

# Or download from GitHub Actions artifacts
gh run download --name claude-sessions-backup --dir ./restored-sessions/
```

### Storage Locations

| Environment | Local Backup Path                                 |
| ----------- | ------------------------------------------------- |
| Windows     | `F:\2026\Repos2026\dws6\backups\claude-sessions\` |
| macOS/Linux | `~/dws6/backups/claude-sessions/`                 |
| GitHub      | `sessions-backup` branch + Actions artifacts      |

### Claude Settings Backup

In addition to session data, worktree `settings.local.json` files are backed up separately. These contain per-worktree Claude Code permissions and hook configurations.

**Backup location:** `.claude-settings-backups/` (in repo root)

**Backed up worktrees (as of February 12, 2026):**

| Worktree            | Branch                       |
| ------------------- | ---------------------------- |
| bold-lewin          | `claude/bold-lewin`          |
| elated-zhukovsky    | `claude/elated-zhukovsky`    |
| friendly-edison     | `claude/friendly-edison`     |
| intelligent-lamport | `claude/intelligent-lamport` |
| keen-swirles        | `claude/keen-swirles`        |
| nostalgic-bose      | `claude/nostalgic-bose`      |
| quirky-knuth        | `claude/quirky-knuth`        |
| sharp-lalande       | `claude/sharp-lalande`       |
| silly-bassi         | `claude/silly-bassi`         |
| stoic-wilbur        | `claude/stoic-wilbur`        |
| zealous-mcclintock  | `claude/zealous-mcclintock`  |

**When to use:** Before resolving merge conflicts in `.claude/settings.local.json` files. The timestamped backups allow safe rollback if conflict resolution goes wrong.

### Merge Conflict Resolution Audit (February 13, 2026)

Audit of all 12 worktree `settings.local.json` files found **9 out of 12 had incomplete configurations** caused by merge conflict resolution that kept only one side. **All 12 worktrees have been fixed** using `Fix-ClaudeSettings.ps1`.

| Worktree            | Hooks | Permissions | Status  |
| ------------------- | ----- | ----------- | ------- |
| bold-herschel       | OK    | OK          | FIXED   |
| bold-lewin          | OK    | OK          | CORRECT |
| elated-zhukovsky    | OK    | OK          | FIXED   |
| friendly-edison     | OK    | OK          | FIXED   |
| intelligent-lamport | OK    | OK          | FIXED   |
| keen-swirles        | OK    | OK          | FIXED   |
| nostalgic-bose      | OK    | OK          | FIXED   |
| quirky-knuth        | OK    | OK          | FIXED   |
| sharp-lalande       | OK    | OK          | FIXED   |
| silly-bassi         | OK    | OK          | CORRECT |
| stoic-wilbur        | OK    | OK          | FIXED   |
| zealous-mcclintock  | OK    | OK          | FIXED   |

**Root cause:** Merge conflict resolution kept only one side (hooks OR permissions, not both).

**Resolution:** `Fix-ClaudeSettings.ps1` added the missing sections to all 12 worktrees. Run periodically to prevent recurrence.

**Correct combined configuration** (`settings.local.json`):

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "python \"$CLAUDE_PROJECT_DIR\"/.claude/hooks/validate-branch-name.py"
          }
        ]
      }
    ]
  },
  "permissions": {
    "allow": [
      "Bash(powershell -Command:*)",
      "Bash(powershell -NoProfile -Command:*)",
      "Bash(pandoc:*)",
      "Bash(pip install:*)",
      "Bash(python -c:*)",
      "Bash(python -X utf8 -c:*)",
      "Bash(ls:*)",
      "Bash(python:*)"
    ]
  }
}
```

**Fix priority:** Start with worktrees furthest ahead of main — `intelligent-lamport` (15 commits) and `claude/sharp-lalande` (9 commits).

**Automated fix script:** `scripts/Fix-ClaudeSettings.ps1`

```powershell
# Check all worktrees for incomplete settings
.\scripts\Fix-ClaudeSettings.ps1

# Use custom backup directory
.\scripts\Fix-ClaudeSettings.ps1 -BackupDir "C:\MyBackups"
```

**What the script does:**

1. Lists all git worktrees (skips `main`)
2. Reads each worktree's `.claude/settings.local.json`
3. Checks for missing `hooks` or `permissions` sections
4. Adds missing sections from the correct template
5. Commits the fix in each worktree automatically

**Manual fix:** Replace `settings.local.json` with the correct combined configuration above. The `.claude-settings-backups/` directory has originals if rollback is needed.

**Note:** Each worktree may accumulate additional session-specific permissions (e.g., `Bash(echo:*)`, `Bash(git remote get-url:*)`). The script preserves existing permissions and only adds the missing section.

### Deployment Status

**To be published to GitHub:** Scheduled for February 13, 2026 (commit pending)

| Component               | File                                        | Status         |
| ----------------------- | ------------------------------------------- | -------------- |
| GitHub Actions workflow | `.github/workflows/daily-claude-backup.yml` | Live on `main` |
| Manual backup script    | `scripts/Backup-ClaudeSessions.ps1`         | Live on `main` |
| CLAUDE.md documentation | `CLAUDE.md` (Section 4)                     | Live on `main` |
| Admin manual section    | This file                                   | Live on `main` |

**System status:**

- Daily automated backups run at **6:00 AM UTC** (first run: February 14, 2026)
- 12+ Claude worktrees protected with automated session data backups
- 30-day retention on GitHub (artifacts + `sessions-backup` branch)
- Manual backup available anytime via `Backup-ClaudeSessions.ps1`

**Protected data:** agents, commands, skills, hooks, session settings across all worktrees.

**Known issue (February 13, 2026):** GitHub detected 3 dependency vulnerabilities in the repository (1 high, 2 moderate). Review in the GitHub Security tab: `https://github.com/blogtheristo/dws6/security`

### PR Creation: Claude Code Sessions vs. Terminal

When working with multiple worktrees, choose the right tool for creating PRs:

**Use Claude Code Sessions when:**

- Reviewing code changes in context
- Interactive development — making final tweaks before PR
- Branch-specific work — when actively working in that worktree
- Testing changes before creating PR
- Writing PR descriptions with Claude's help (better context awareness)

**Use Terminal/Command-line when:**

- Batch operations — creating multiple PRs at once
- Administrative tasks — branches you don't actively work in
- Quick PRs for simple changes
- When Claude session isn't available for that branch

**Recommendation for active worktrees:**

1. Switch to each worktree's Claude session
2. Review and finalize changes in that session
3. Create PR from within Claude — it has better context about the changes

For terminal-only worktrees (no active Claude session), handle PRs directly from the command line with `gh pr create`.

### Session Environment Detection

Sessions frequently move across environments and editors during a single feature branch's lifecycle.

**Quick switch keywords** — include any of these in your message to tell Claude your current environment:

| Keyword          | Environment        |
| ---------------- | ------------------ |
| `win` or `win11` | Windows 11 desktop |
| `mobile`         | Mobile/web session |
| `chromebook`     | Chromebook (Linux) |
| `vscode`         | Editing in VS Code |
| `cursor`         | Editing in Cursor  |

Keywords can be combined (e.g., `win vscode`). These are **plain-text keywords in a message**, not slash commands — do NOT type `/win` as a standalone command (it triggers a skill lookup error). When no keyword is given, Claude auto-detects using these signals:

| Signal         | Mobile/Web              | Windows 11 Desktop     | Chromebook       |
| -------------- | ----------------------- | ---------------------- | ---------------- |
| Git remote URL | `local_proxy@127.0.0.1` | `github.com`           | `github.com`     |
| Platform       | `linux` (cloud)         | `win32` / `MINGW64_NT` | `linux` (native) |
| `gh` CLI       | Not available           | Available              | May be available |
| PowerShell     | Not available           | Available              | Not available    |

**Editor context** (same environment, different editors):

| Editor              | Usage                                                       |
| ------------------- | ----------------------------------------------------------- |
| **Claude Code CLI** | Full Claude session, terminal-based                         |
| **VS Code**         | User edits files directly; Claude via extension or terminal |
| **Cursor**          | AI-native editor; similar to VS Code                        |

**Typical multi-environment workflow:**

| Step | Environment + Editor | Activity                               |
| ---- | -------------------- | -------------------------------------- |
| 1    | Mobile               | Start work, draft changes, push branch |
| 2    | Win11 + VS Code      | Review code, refine, run tests         |
| 3    | Chromebook           | Quick fixes on the go                  |
| 4    | Mobile               | Documentation updates                  |
| 5    | Win11 + Cursor       | Final review, create PR                |

**Convention:** Commit messages may include the environment tag when helpful:

- `feat: add backup docs (Win11/VS Code)`
- `fix: typo (mobile)`
- `docs: update manual (Chromebook)`

See `CLAUDE.md` → "Session Environment Detection" for the full detection logic and rules.

### Related Files

- **scripts/Backup-ClaudeSessions.ps1** - Manual backup script
- **.github/workflows/daily-claude-backup.yml** - Automated daily workflow
- **CLAUDE.md** - Worktree workflow and backup warnings (Section 4)

---

## Multi-Site Deployment

### Purpose

The `landing-pages/` directory provides synchronized deployment for all three sites (dws6.com, dws10.com, onelifetime.world) with automated rsync and Cloudflare Pages integration.

### Directory Structure

```
landing-pages/
├── dws6-com/           # Synced from dws6.com/
├── dws10-com/          # Synced from dws10.com/
└── onelifetime-world/  # Synced from onelifetime.world/
```

### Sync Workflow

#### Automated Sync

Triggered when content changes in source directories:

```yaml
# .github/workflows/sync-dws6-landing-pages.yml
on:
  push:
    paths:
      - "dws6.com/**"
      - "dws10.com/**"
      - "onelifetime.world/**"
    paths-ignore:
      - ".workflows/**"
      - "**/*.md"
      - ".github/**"
```

#### Sync Process

```bash
# 1. Create directories
mkdir -p landing-pages/{dws6-com,dws10-com,onelifetime-world}

# 2. Sync each site
rsync -av --delete --exclude='.git' --exclude='.workflows' \
  dws6.com/ landing-pages/dws6-com/

rsync -av --delete --exclude='.git' --exclude='.workflows' \
  dws10.com/ landing-pages/dws10-com/

rsync -av --delete --exclude='.git' --exclude='.workflows' \
  onelifetime.world/ landing-pages/onelifetime-world/

# 3. Commit changes
git add landing-pages/
git commit -m "chore: sync all landing-pages from source"
git push origin main
```

### Deployment Targets

- **dws6.com** → Cloudflare Pages
- **dws10.com** → Cloudflare Pages
- **onelifetime.world** → Cloudflare Pages

### Common Operations

#### Manual Sync

```bash
# Sync all sites
rsync -av --delete --exclude='.git' dws6.com/ landing-pages/dws6-com/
rsync -av --delete --exclude='.git' dws10.com/ landing-pages/dws10-com/
rsync -av --delete --exclude='.git' onelifetime.world/ landing-pages/onelifetime-world/
```

#### Verify Sync

```bash
# Compare source and landing-pages
diff -r dws6.com/ landing-pages/dws6-com/ \
  --exclude='.git' --exclude='node_modules'
```

#### Deploy to Cloudflare

```bash
# Automatic on push to main
git push origin main

# Manual trigger
gh workflow run sync-dws6-landing-pages.yml
```

### Related Files

- **.github/workflows/sync-dws6-landing-pages.yml** - Sync workflow
- **.github/workflows/sync-site-content.yml** - Legacy sync workflow
- **.workflows/audit/failures/sync-dws6-landing-pages-fix.md** - Sync fixes

---

## Observability

### Purpose

The `observability/` directory contains the platform observability assessment and monitoring strategy for DWS IQ 6's AI agent infrastructure.

### Directory Structure

```
observability/
└── observability.md    # Full observability assessment (v1.0.0, January 2026)
```

### Current Maturity: Level 1/5 (Basic)

| Dimension        | Status               | Gap                                       |
| ---------------- | -------------------- | ----------------------------------------- |
| Logging          | Basic Python logging | Minor — needs structured JSON             |
| Tracing          | None                 | CRITICAL — no distributed tracing         |
| Metrics          | None                 | CRITICAL — no token/latency/cost tracking |
| Agent Visibility | None                 | CRITICAL — no decision path tracing       |
| MCP Tool Tracing | None                 | HIGH — no end-to-end tool call visibility |
| Cost Tracking    | None                 | HIGH — no real-time token/API cost        |
| Eval/Quality     | None                 | MEDIUM — no LLM-as-judge evaluation       |

### Key Findings

- **Debugging without observability:** 4-8 hours per incident
- **Debugging with observability:** 15-30 minutes per incident
- **Token waste from unoptimized prompts:** 15-25% overspend
- **Recommended tool:** Langfuse (open-source, self-hostable, EU-compatible)
- **Projected ROI:** 450% Year 1, payback in 6.6 weeks

### Implementation Priority

1. OpenTelemetry distributed tracing (CRITICAL)
2. Token/latency/cost metrics (CRITICAL)
3. MCP tool call end-to-end tracing (HIGH)
4. Langfuse integration for agent decision paths (HIGH)
5. LLM-as-judge evaluation pipeline (MEDIUM)

### Related Files

- **observability/observability.md** — Full assessment with architecture diagrams, cost analysis, and implementation plan
- **src/app.ts** — Main Express app (tracing integration point)
- **src/mcp/** — MCP implementation (tool tracing integration point)

---

## Related Documentation

**Primary Docs** (Start Here):

1. `in-update-claude/documentation/PROJECT_SUMMARY.md`
2. `in-update-claude/documentation/ACCOUNTS_SETUP_GUIDE.md`
3. `in-update-claude/documentation/DEPLOYMENT_GUIDE.md`

**Project-Specific**: 4. `in-update-claude/next-js-projects/dws10-com/README.md` 5. `in-update-claude/next-js-projects/onelifetime-world/README.md`

**Technical Details**: 6. `in-update-claude/next-js-projects/dws10-com/SITEMAP.md` 7. `in-update-claude/next-js-projects/onelifetime-world/SITEMAP.md`

**Session Context**: 8. `in-update-claude/SESSION_SUMMARY.md` (this session)

---

## Document Generation Tooling (June 2026)

Branded HTML for key Markdown documents is **generated, not hand-edited**, so content never drifts
from the canonical Markdown source. Two generators reuse the elegant 2024 Lifetime stylesheet
(gold accents, navy headers, styled tables/blockquotes).

**Handbook:**

- Source of truth: `docs/KONSULTOINNIN_KASIKIRJA_2026.md`
- Generator: `node scripts/gen-handbook-html.cjs`
- Output: `docs/Konsultoinnin_kasikirja_2026.html`
- Run after every handbook edit; the script pulls the version from the Markdown `Version:` line.

**Whitepapers** (`docs/whitepapers/`):

- Series plan + status: `docs/whitepapers/README.md` (WP01–WP12; reconciled against existing
  whitepapers — see below)
- Generic generator: `node scripts/gen-doc-html.cjs <input.md> <output.html> "Title"`
- Example: `node scripts/gen-doc-html.cjs docs/whitepapers/WP01_AUGMENT_NOT_REPLACE.md docs/whitepapers/WP01_AUGMENT_NOT_REPLACE.html "Augment, Not Replace"`

**Existing whitepaper inventory** (do not duplicate; refresh in place): KYA suite
(`Learn/KYA-IDV-CERT-Whitepaper-v1.0.html`, published `dws10.com/kya-standard/whitepaper/`),
European Sovereign Industrial Intelligence (`Learn/sovereign-industrial-intelligence-whitepaper-v1.0.html`),
Shufti KYA (`docs/field-notes/`). Canonical inventory + LLM bundling: `scripts/bundle-whitepapers-for-llm.cjs`.

**Note:** these are manual generators (run on edit), not scheduled jobs. `.md` files stay in `docs/`
and are never published to public-site folders (CLAUDE.md Non-Negotiable Rule 5). Security incidents:
`security@lifetime.fi`.

---

## Backup & Sync Infrastructure (February 2026)

### Overview

As of February 6, 2026, DWS6 uses a three-layer backup strategy:

| Layer               | Tool                          | Location                          | What                                           |
| ------------------- | ----------------------------- | --------------------------------- | ---------------------------------------------- |
| 1. Git              | GitHub (private repo)         | `github.com/blogtheristo/dws6`    | All source code + business docs + admin files  |
| 2. Proton Drive     | `Sync-ToProton.ps1`           | `F:\Proton\Proton\My files\2026\` | Business files + sensitive/gitignored files    |
| 3. Full Repo Backup | `Sync-ToProton.ps1 -FullRepo` | `F:\2026\Backups\dws6\`           | Complete repo copy (excluding build artifacts) |
| 4. Supabase Storage | `Sync-ToSupabase.ps1`         | EU cloud (`admin-vault` bucket)   | Admin/, AgentFoundry/, Team/, docs/            |

### Why Three Layers?

**Critical lesson (January-February 2026):** Claude Code cloud sessions can ONLY reach GitHub. All other network destinations (Supabase, Google Cloud, Proton Drive) are blocked. Files in gitignored paths are **destroyed** when cloud sessions end. The three-layer approach ensures:

1. **Git** preserves everything that isn't a secret (private repo = safe)
2. **Proton Drive** preserves secrets (.env, API keys, credentials) + organized business file copies
3. **Full Backup** provides a complete snapshot including everything
4. **Supabase Storage** provides EU-hosted cloud redundancy

### Proton Drive Folder Mappings

The `Sync-ToProton.ps1` script maps repo folders to Proton Drive structure:

```
Repo Folder                    Proton Drive Destination
─────────────────────────────  ──────────────────────────────────────────
Admin/                     →   F:\Proton\...\2026\Repos2026\dws6\Admin\
AgentFoundry/              →   F:\Proton\...\2026\Repos2026\dws6\AgentFoundry\
Team/                      →   F:\Proton\...\2026\Repos2026\dws6\Team\
Firehorse/                 →   F:\Proton\...\2026\Firehorse\
docs\metropolia\           →   F:\Proton\...\2026\Metropolia2026\
Metropolia2026/            →   F:\Proton\...\2026\Metropolia2026\
onelifetime.world/         →   F:\Proton\...\2026\LifetimeWorld\
landing-pages\lifetime-fi\ →   F:\Proton\...\2026\Lifetime_fi\
```

Sensitive files (.env, .env.mcp, .mcp.json, credentials.json, SFTP_SECRETS.py, etc.) are copied to `Repos2026\dws6\` on Proton Drive as encrypted backup.

### Full Repo Backup Structure

When running `Sync-ToProton.ps1 -FullRepo`, the entire repo is copied to `F:\2026\Backups\dws6\`:

```
F:\2026\Backups\dws6\
├── Admin/                    # Admin manuals, security docs
├── AgentFoundry/             # Agent configurations
├── Archive/                  # Historical archives
├── Firehorse/                # Product suite (Omnichannel, Report, Automation)
├── Lifetime Fleet/           # IoT/Robots specs
├── LinkedIn/                 # LinkedIn outreach
├── OK Computer/              # Internal tooling
├── Partners/                 # Partner documentation
├── Peachscore/               # Peachscore product
├── People/                   # Team profiles
├── Reports/                  # Generated reports
├── Sales/                    # Sales materials
├── Situation/                # Situation analysis
├── Store/                    # Store assets
├── Team/                     # Team documentation
├── artifacts/                # Build artifacts
├── config/                   # Configuration files
├── docs/                     # Documentation (metropolia, etc.)
├── documentation/            # Additional docs
├── dws6.com/                 # DWS6 website
├── dws10.com/                # DWS10 website (store, legal hub)
├── examples/                 # Example code
├── in-update-claude/         # Claude session artifacts
├── infrastructure/           # Infrastructure configs
├── investor-outreach/        # Investor materials
├── landing-pages/            # Production landing pages
│   ├── dws6-com/
│   ├── dws10-com/
│   ├── onelifetime-world/
│   └── lifetime-fi/
├── mcp-hub/                  # MCP Orchestration Platform
├── mcp-servers/              # Individual MCP servers
├── mobile-dashboard/         # Mobile dashboard
├── observability/            # Monitoring configs
├── onelifetime.world/        # Onelifetime website
├── product-catalog/          # Product catalog
├── public/                   # Public assets
├── sales-outreach/           # Sales automation
├── scripts/                  # All scripts (sync, backup, security)
├── security-reports/         # Security scan output
├── shared/                   # Shared components
├── sites/                    # Site configs
├── src/                      # Backend source code
├── supabase/                 # Supabase migrations
├── tests/                    # Test suite
│   └── security/             # Security tests
├── .github/                  # CI/CD workflows (18)
├── .githooks/                # Git hooks (post-merge sync)
├── .vscode/                  # VS Code tasks for sync
└── *.md                      # Root-level admin manuals
```

**Excluded from backup** (large/generated/not useful):
`.git/`, `node_modules/`, `.next/`, `dist/`, `build/`, `out/`, `.venv/`, `venv/`, `__pycache__/`, `.gradle/`, `captures/`, `.externalNativeBuild/`, `.cxx/`, `.vercel/`, `.turbo/`, `mcp-context-data/`, `claude-sessions/`

### Scripts Reference

| Script                                | Purpose                             | Usage                                                  |
| ------------------------------------- | ----------------------------------- | ------------------------------------------------------ |
| `scripts/Sync-ToProton.ps1`           | Sync business files to Proton Drive | `.\Sync-ToProton.ps1` or `.\Sync-ToProton.ps1 -DryRun` |
| `scripts/Sync-ToProton.ps1 -FullRepo` | Full repo backup to F:\2026\Backups | `.\Sync-ToProton.ps1 -FullRepo`                        |
| `scripts/Sync-ToSupabase.ps1`         | Upload to Supabase Storage          | `.\Sync-ToSupabase.ps1 -CreateBucket`                  |
| `scripts/Startup-DailySync.bat`       | Daily auto-sync on Windows login    | Place shortcut in Startup folder                       |
| `scripts/Install-StartupSync.ps1`     | Install/remove Startup shortcut     | `.\Install-StartupSync.ps1` or `-Remove`               |

### VS Code / Cursor Tasks

Available from Terminal > Run Task:

| Task                           | What it does                                  |
| ------------------------------ | --------------------------------------------- |
| Sync to Proton Drive           | Runs `Sync-ToProton.ps1`                      |
| Sync to Proton Drive (dry run) | Shows what would be synced                    |
| Backup to Supabase Storage     | Uploads to Supabase `admin-vault` bucket      |
| Full Sync (Proton + Supabase)  | Runs both syncs in sequence                   |
| Full Repo Backup to Proton     | Copies entire repo to `F:\2026\Backups\dws6\` |
| Pull and Sync                  | `git pull` then Proton sync                   |

### Automation

**Daily sync on Windows login:**

1. Run `.\scripts\Install-StartupSync.ps1` (one-time setup)
2. Creates shortcut in `%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup\`
3. On login: waits 120 seconds for Proton Drive → `git pull` → `Sync-ToProton.ps1`

**Post-merge hook (automatic on git pull):**

- `.githooks/post-merge` runs `Sync-ToProton.ps1` after every `git pull`
- Install: `git config core.hooksPath .githooks`

### .gitignore Policy (Cleaned February 6, 2026)

This is a **PRIVATE** repository. Only actual secrets are gitignored:

| Gitignored      | Examples                                               | Reason                         |
| --------------- | ------------------------------------------------------ | ------------------------------ |
| Secrets         | `.env`, `.env.*`, `credentials.json`, `*.key`, `*.pem` | API keys, passwords, tokens    |
| Build artifacts | `node_modules/`, `.next/`, `dist/`, `build/`, `venv/`  | Generated, large, reproducible |
| OS/IDE junk     | `.DS_Store`, `Thumbs.db`, `.idea/`                     | System files                   |
| Logs            | `*.log`                                                | May contain sensitive data     |

| **NOT** gitignored (tracked) | Examples                          | Reason                       |
| ---------------------------- | --------------------------------- | ---------------------------- |
| Admin docs                   | `Admin/`, `ADMIN_MANUAL_*.md`     | Must persist across sessions |
| Business docs                | `AgentFoundry/`, `Team/`, `docs/` | Must persist across sessions |
| MCP configs                  | `mcp-hub/`, `mcp-servers/`        | Deployment documentation     |
| VS Code config               | `.vscode/tasks.json`              | Shared sync task definitions |

### ClaudeCode Folder Placement Policy (March 2026)

To keep managed settings visible and avoid over-classifying non-secret files:

- `ClaudeCode/` lives at repository root and is tracked in Git.
- Only genuinely secret-bearing files belong in `Admin/Claudecode_Secrets/`.
- Before moving any file out of `ClaudeCode/`, scan contents for key/secret patterns first.
- If no actual secret value exists, keep the file in `ClaudeCode/`.

**Current rule application:**

- `ClaudeCode/managed-settings.json.example` remains in root `ClaudeCode/` (template only, no live key material).
- `Admin/Claudecode_Secrets/` is reserved for files that contain real credentials, tokens, private keys, or equivalent sensitive values.

---

## Changelog

### 2026-03-13 - ClaudeCode Root Folder Policy & Secret Triage

- Added explicit policy: `ClaudeCode/` must live at repo root
- Added rule: only true secret-bearing files move to `Admin/Claudecode_Secrets/`
- Added mandatory scan-first process before moving files to secret storage
- Updated document version to 1.4

### 2026-02-13 - Claude Session Backup System, PR Workflow & Environment Detection

- Added Claude Session Backup System section documenting automated daily backups
- Covers daily-claude-backup.yml workflow (6:00 AM UTC)
- Covers Backup-ClaudeSessions.ps1 manual backup script
- Documented what gets backed up (agents, commands, skills, hooks, settings)
- Added safety procedures for worktree deletion and session restore
- Added deployment status section for this PR
- Added PR creation guidance: Claude Code sessions vs. terminal
- Added session environment detection with quick-switch tags (`/win`, `/mobile`, `/chromebook`, `/vscode`, `/cursor`)
- Added three environment profiles: Mobile, Win11, Chromebook
- Claude settings backup completed for 11 worktrees (bold-lewin, elated-zhukovsky, friendly-edison, intelligent-lamport, keen-swirles, nostalgic-bose, quirky-knuth, sharp-lalande, silly-bassi, stoic-wilbur, zealous-mcclintock)
- Backup location: `.claude-settings-backups/` (timestamped 20260212_114833)
- Added Observability section documenting assessment maturity (Level 1/5), key gaps, and Langfuse recommendation
- Added Fix-ClaudeSettings.ps1 script documentation
- Updated document version to 1.3
- Session: Windows 11 desktop (VS Code)

### 2026-02-06 - Backup Infrastructure & .gitignore Cleanup

- Added Sync-ToProton.ps1, Sync-ToSupabase.ps1, Startup-DailySync.bat
- Restored 19 Admin/ files to git tracking
- Rewrote .gitignore from 230 to 101 lines (private repo policy)
- Added VS Code tasks for sync operations
- Added post-merge hook for automatic Proton sync
- Documented backup folder structure and Proton Drive mappings

### 2025-12-09 - Initial Creation

- Created `in-update-claude/` directory structure
- Added Next.js projects for both websites
- Copied session documentation
- Created admin manual (this file)
- Created session summary

---

## Contact & Support

**Primary Maintainer**: Risto Anton Päärni

- **Email**: risto@lifetime.fi
- **GitHub**: @blogtheristo
- **LinkedIn**: linkedin.com/in/ristopaarni

**Repository**: https://github.com/blogtheristo/dws6

**For Questions About**:

- **Files/Structure**: Review this document
- **Deployment**: See DEPLOYMENT_GUIDE.md
- **Accounts/Services**: See ACCOUNTS_SETUP_GUIDE.md
- **Technical Issues**: Create GitHub Issue

---

**Document Status**: ✅ Complete
**Next Review**: 2025-12-16 (1 week)
