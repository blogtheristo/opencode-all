# DWS IQ Platform - Admin Manual

**Version:** 1.6
**Last Updated:** February 19, 2026
**Repository:** [blogtheristo/dws6](https://github.com/blogtheristo/dws6)

---

## Table of Contents

1. [Installation Manual](#installation-manual-link) ⭐ **NEW**
2. [Files and Folders Structure](#files-and-folders-structure)
3. [Document Index](#document-index)
4. [AI Agent Policy](#ai-agent-policy) ⭐ **NEW in v1.3**
5. [Deployment Procedures](#deployment-procedures)
6. [Session History](#session-history)
7. [Maintenance Plan (Complete)](#maintenance-plan-complete) ⭐ **NEW**
8. [Bug Tracking & Security Maintenance](#bug-tracking--security-maintenance) ⭐ **NEW**
9. [Code Review Process](#code-review-process) ⭐ **NEW in v1.4**
10. [Tools](#tools) ⭐ **NEW**
11. [Maintenance Tasks](#maintenance-tasks)
12. [Git Workflow](#git-workflow)
13. [Sensitive Data Protection](#sensitive-data-protection)
14. [Emergency Procedures](#emergency-procedures)

---

## Maintenance Plan (Complete)

This section links the **full maintenance plan** in one place:

- **Operations maintenance (runbook)**:
  - [Deployment Procedures](#deployment-procedures) (Cloudflare Pages deploy flow + manual retry)
  - [Maintenance Tasks](#maintenance-tasks) (weekly/monthly + recommended automated checks)
  - [Sensitive Data Protection](#sensitive-data-protection) (what must never be committed + incident handling)
  - [Emergency Procedures](#emergency-procedures) (rollback + DNS/SSL triage)

- **Security maintenance**:
  - [Bug Tracking & Security Maintenance](#bug-tracking--security-maintenance) (audit status, fix history, monthly budget, roadmap)

---

## Installation Manual Link

**NEW:** Complete Installation and Deployment Guide

📖 **See:** [`INSTALLATION_MANUAL.md`](INSTALLATION_MANUAL.md)

**Purpose:** Comprehensive guide for installing DWS IQ on:
- Private Cloud infrastructure
- IBM Watsonx platform
- Google Cloud Run
- Groq Edge AI

**Deployment Structures:** `Admin/Installation/`
- `Admin/Installation/Private/` - Self-managed infrastructure
- `Admin/Installation/Public/watsonx/` - IBM AI platform
- `Admin/Installation/Public/gcr/` - Google Cloud serverless
- `Admin/Installation/Public/groq/` - Edge AI hardware

**Start Here:** Choose your platform and follow the README in that folder.

---

## Files and Folders Structure

### Root Directory

```
dws6/
├── admin/                          # Admin documentation (this folder)
│   └── ADMIN_MANUAL.md            # This file
├── in-update-claude/              # Temporary files from Claude sessions
├── lifetime-agent-foundry/        # Agent development framework
│   └── AGENT_FOUNDRY.md          # Complete framework documentation
├── landing-pages/                 # Static landing pages
│   ├── onelifetime-world/
│   │   └── index.html            # Community landing page
│   └── dws10-com/
│       └── index.html            # Platform landing page
├── AI_AGENT_POLICY.md             # AI Agent best practices policy
├── AI_AGENT_GUIDELINES.md         # Comprehensive agent guidelines
├── ARCHITECTURE_SUMMARY.md        # Visual architecture & traffic flows
├── CLOUDFLARE_DNS_RECORDS_READY.md # DNS records for all domains
├── CLOUDFLARE_DNS_SETUP.md        # Complete Cloudflare configuration
├── DOMAIN_STRATEGY.md             # Domain architecture analysis
├── IMPLEMENTATION_SUMMARY.md      # Next steps & quick reference
├── PAYMENT_INTEGRATION.md         # Revolut + PayPal integration
├── PLANNING_PHASE_UPDATED.md      # 90-day implementation roadmap
├── SITE_ARCHITECTURE.md           # Cross-linking strategy
├── STARTUP_PROGRAMS_APPLICATIONS.md # Startup credits applications
├── STRATEGIC_PARTNERSHIPS.md      # Partnerships documentation
├── README.md                      # Project overview
├── LICENSE                        # MIT License
└── .gitignore                     # Git ignore rules
```

---

## Document Index

### Core Planning Documents

| Document | Purpose | Status | Lines | Last Updated |
|----------|---------|--------|-------|--------------|
| **README.md** | Platform overview, mission, quick links | ✅ Current | ~200 | Nov 23, 2025 |
| **PLANNING_PHASE_UPDATED.md** | 90-day roadmap, code examples | ✅ v3.0 | ~1,680 | Nov 23, 2025 |
| **ARCHITECTURE_SUMMARY.md** | Visual diagrams, traffic flows | ✅ Current | ~600 | Nov 23, 2025 |
| **IMPLEMENTATION_SUMMARY.md** | Quick reference, next steps | ✅ v2.0 | ~575 | Nov 23, 2025 |

### Infrastructure Documentation

| Document | Purpose | Status | Lines | Last Updated |
|----------|---------|--------|-------|--------------|
| **CLOUDFLARE_DNS_SETUP.md** | Complete DNS configuration guide | ✅ Current | ~634 | Nov 16, 2025 |
| **CLOUDFLARE_DNS_RECORDS_READY.md** | Specific DNS records to add | ✅ Current | ~477 | Nov 16, 2025 |
| **DOMAIN_STRATEGY.md** | 4 domain options analysis | ✅ Current | ~487 | Nov 16, 2025 |
| **SITE_ARCHITECTURE.md** | Cross-linking strategy | ✅ Current | ~334 | Nov 23, 2025 |

### Business Documentation

| Document | Purpose | Status | Lines | Last Updated |
|----------|---------|--------|-------|--------------|
| **PAYMENT_INTEGRATION.md** | Revolut + PayPal webhooks | ✅ Current | ~652 | Nov 16, 2025 |
| **STRATEGIC_PARTNERSHIPS.md** | Peachscore, partnerships | ⚠️ Needs update | ~386 | Nov 16, 2025 |
| **STARTUP_PROGRAMS_APPLICATIONS.md** | $125K credits guide | ⚠️ Needs update | ~506 | Nov 16, 2025 |

### Agent Framework & Policy

| Document | Purpose | Status | Lines | Last Updated |
|----------|---------|--------|-------|--------------|
| **lifetime-agent-foundry/AGENT_FOUNDRY.md** | Complete agent framework | ✅ Current | ~600+ | Nov 23, 2025 |
| **AI_AGENT_POLICY.md** | Agent best practices policy | ✅ Current | ~650 | Dec 23, 2025 |
| **AI_AGENT_GUIDELINES.md** | Comprehensive agent guidelines | ✅ Current | ~400 | Nov 2025 |

### Landing Pages

| File | Domain | Status | Last Updated |
|------|--------|--------|--------------|
| **landing-pages/onelifetime-world/index.html** | onelifetime.world | ✅ Live | Nov 22, 2025 |
| **landing-pages/dws10-com/index.html** | dws10.com | ✅ Live | Nov 23, 2025 |

---

## AI Agent Policy

⭐ **NEW in v1.3** - Added December 23, 2025

### Overview

**Purpose:** Define best practices for creating and maintaining AI agent instructions in the DWS6 project.

**Version:** 1.0
**Created:** December 23, 2025
**Session ID:** PxSux
**Based on:** Analysis of 2,500+ high-performing agent implementations

**Full Policy Document:** See [`AI_AGENT_POLICY.md`](../AI_AGENT_POLICY.md) in repository root

### Core Principles

All agent instruction files MUST include:

✅ **Executable commands in early sections** - Immediate actionability
✅ **Code examples over explanations** - Show, don't tell
✅ **Clear boundaries** - Explicit do's and don'ts
✅ **Stack specification** - Technologies and tools used
✅ **Six core areas** - Commands, testing, project structure, code style, git workflow, boundaries
✅ **Version tracking** - Document evolution and changes

### Required Structure

```markdown
# [Agent Name] - Instructions

**Version:** X.Y
**Stack:** [List technologies]
**Last Updated:** YYYY-MM-DD

## Quick Start Commands
[Executable commands first]

## Stack & Technologies
[Explicit stack listing]

## 1. Commands Reference
[Development, testing, deployment]

## 2. Testing Requirements
[Mandatory tests, coverage, examples]

## 3. Project Structure
[Directory layout, naming conventions]

## 4. Code Style Guidelines
[TypeScript/React patterns, examples]

## 5. Git Workflow
[Branch naming, commits, pre-commit checks]

## 6. Boundaries & Security
[Never/Always lists with examples]
```

### Key Security Boundaries

**NEVER:**
- ❌ Commit secrets or credentials
- ❌ Commit customer data (PII, GDPR protected)
- ❌ Commit admin files (ProtonDrive only)
- ❌ Skip tests without approval
- ❌ Force push to main/master
- ❌ Use any types in TypeScript

**ALWAYS:**
- ✅ Use environment variables for secrets
- ✅ Validate input data
- ✅ Write tests for new features
- ✅ Document complex logic
- ✅ Keep dependencies updated

### Testing Requirements

Before committing code:

- ✅ All unit tests pass (`npm test`)
- ✅ No TypeScript errors (`npm run type-check`)
- ✅ No linting errors (`npm run lint`)
- ✅ Code coverage ≥ 80% for new code
- ✅ Integration tests pass for affected modules

### Git Workflow

**Branch Naming:**

- `claude/feature-name-[SESSION_ID]`
- `feature/feature-name`
- `fix/bug-description-[SESSION_ID]`
- `docs/document-name-[SESSION_ID]`

**Commit Format:**

```
[Type] Short description (max 50 chars)

Detailed explanation of changes (wrap at 72 chars)

- Bullet points for multiple changes
- Reference issue numbers: Fixes #123

Files changed: filename.ts (version X.Y)
Session ID: [SESSION_ID]
```

**Types:** feat, fix, docs, style, refactor, test, chore

### Performance Guidelines

**React Components:**

```javascript
// ✅ GOOD: Memoized expensive computation
import { useMemo } from 'react';

function AgentList({ agents }: Props) {
  const sortedAgents = useMemo(
    () => agents.sort((a, b) => a.score - b.score),
    [agents]
  );
  return <div>{sortedAgents.map(renderAgent)}</div>;
}
```

**Database Queries:**

```javascript
// ✅ GOOD: Batched query with indexes
const agents = await db.agent.findMany({
  where: { userId: user.id },
  select: { id: true, name: true, score: true },
  orderBy: { score: 'desc' },
  take: 10,
});
```

### Agent File Checklist

Before finalizing an agent instruction file:

- ✅ Quick start commands in early section
- ✅ Stack and technologies specified
- ✅ Code examples for all major concepts
- ✅ Clear boundaries (dos and don'ts)
- ✅ All six core areas covered
- ✅ Version number and date included
- ✅ No secrets or sensitive data
- ✅ Examples are executable and tested

### Implementation Status

**Current Agent Files:**
- `.claude/instructions.md` - ⚠️ Needs improvement (missing commands, stack, testing)
- `AI_AGENT_GUIDELINES.md` - ⚠️ Needs improvement (missing quick start, code examples)

**Improvement Proposal:** See `AGENT_IMPROVEMENTS_PROPOSAL.md`

**Priority Actions:**
1. Add quick start commands to `.claude/instructions.md`
2. Add stack specification
3. Create testing requirements section
4. Add code examples throughout
5. Implement pre-commit checklist
6. Add performance guidelines

---

## Deployment Procedures

### Cloudflare Pages Deployment

#### Current Setup

| Project | Domain | Source | Branch | Status |
|---------|--------|--------|--------|--------|
| onelifetime-world | onelifetime.world | GitHub: blogtheristo/dws6 | main | ✅ Live |
| dws10-platform | dws10.com | GitHub: blogtheristo/dws6 | main | ✅ Live |

#### Root Directories

- **onelifetime-world:** `landing-pages/onelifetime-world`
- **dws10-platform:** `landing-pages/dws10-com`

#### Deployment Flow

```
Local Edit → Git Push → GitHub (main) → Cloudflare Pages Auto-Deploy
                                              ↓
                                         ~30 seconds
                                              ↓
                                    Live at domain
```

#### Manual Deployment (if needed)

1. Go to Cloudflare Pages dashboard
2. Select project
3. **Deployments** → **Retry deployment**

---

## Session History

### Session: December 23, 2025 (PxSux)

**Branch:** `claude/check-api-credits-PxSux`

#### Tasks Completed

✅ Created AI Agent Policy based on 2,500+ agent analysis
✅ Created AI_AGENT_POLICY.md in repository root
✅ Created AGENT_IMPROVEMENTS_PROPOSAL.md with specific recommendations
✅ Protected admin/ directory in .gitignore (both Admin/ and admin/)
✅ Updated Admin Manual to v1.3 with AI Agent Policy section

#### Files Created/Updated

| File | Action | Status |
|------|--------|--------|
| AI_AGENT_POLICY.md | Created | ✅ In repo |
| AGENT_IMPROVEMENTS_PROPOSAL.md | Created | ✅ In repo |
| .gitignore | Updated | ✅ Committed |
| admin/ADMIN_MANUAL.md | Updated to v1.3 | 📋 ProtonDrive only |

#### Key Findings

From 2,500+ Agent Analysis:
- Best agents start with executable commands
- Code examples more effective than explanations
- Clear boundaries (never/always) critical
- Stack specification improves consistency
- Six core areas ensure completeness
- Version tracking enables evolution

---

### Session: November 23, 2025

**Branch:** `claude/plan-agentic-ai-saas-019iY6SMFqVQnFq5GXUVB2jH`

#### Tasks Completed

1. ✅ Deployed landing pages to Cloudflare Pages (onelifetime.world, dws10.com)
2. ✅ Configured SSL/TLS Full (strict) on all 3 domains
3. ✅ Created Lifetime Agent Foundry documentation
4. ✅ Created site architecture and cross-linking strategy
5. ✅ Removed Turner Construction references from all documents
6. ✅ Merged PR to main

#### Files Created/Updated

| File | Action | Status |
|------|--------|--------|
| lifetime-agent-foundry/AGENT_FOUNDRY.md | Created | ✅ Committed |
| SITE_ARCHITECTURE.md | Created | ✅ Committed |
| landing-pages/dws10-com/index.html | Updated | ✅ Committed |
| PLANNING_PHASE_UPDATED.md | Updated to v3.0 | ✅ Committed |
| ARCHITECTURE_SUMMARY.md | Updated | ✅ Committed |
| IMPLEMENTATION_SUMMARY.md | Updated to v2.0 | ✅ Committed |

#### Commits

1. `c77f5a5` - Add Lifetime Agent Foundry
2. `28d0dfc` - Add site architecture and cross-linking strategy
3. `b2c903f` - Remove Turner Construction reference from landing page
4. `85d5ec7` - Remove Turner Construction references from all documents

#### Temporary Files (Not in Repo)

Location: `/home/user/omat tiedostot/lataukset/`

- `onelifetime-world-index.html` - Copy of landing page (for Chromebook upload)
- `dws10-com-index.html` - Copy of landing page (for Chromebook upload)

**Note:** These are duplicates of files already in repo, created for manual Cloudflare Pages upload from Chromebook.

---

## Bug Tracking & Security Maintenance

### Bug Estimation (Current Repository State)

**Last Security Audit:** December 19, 2025
**Bugs Fixed in Session:** 20 critical/high/medium security issues

#### Current Estimated Bug Count

Based on comprehensive security audit covering auth layer, validation, build scripts:

| Severity | Estimated Count | Areas |
|----------|----------------|--------|
| **Critical/High** | 5-15 | MCP servers, AgentFoundry services, frontend auth, API endpoints |
| **Medium** | 30-60 | Error handling, validation, edge cases, script reliability |
| **Low/Tech Debt** | 100-300+ | TODOs, deprecated code, missing tests, outdated dependencies |

#### High-Confidence Bug Locations

Areas not yet audited (likely to contain bugs):

1. **MCP Servers** (`mcp-hub/`, `mcp-servers/`)
   - Authentication/authorization
   - Input validation
   - Error handling

2. **AgentFoundry Services** (`AgentFoundry/services/`)
   - Python microservices security
   - API endpoints
   - Request validation

3. **Frontend** (`landing-pages/`, Next.js sites)
   - Client-side validation
   - XSS prevention
   - CSRF protection

4. **Dependencies**
   - Outdated npm packages (`npm audit`)
   - Python package vulnerabilities (`pip-audit`)
   - Security patches

5. **Configuration**
   - Environment variable validation
   - Deployment config security
   - Secret management

6. **Error Boundaries**
   - Uncaught exceptions
   - Unhandled Promise rejections
   - Graceful degradation

### Monthly Maintenance Budget

**Target:** 15-50 fixes per month (normal active development cadence)

#### Proactive Maintenance (Planned)

| Task | Frequency | Expected Count | Priority |
|------|-----------|----------------|----------|
| **Dependency updates** | Monthly | 5-10 fixes | High |
| **Security patches** | As released | 1-5 fixes | Critical |
| **Linting/type errors** | Monthly | 3-5 fixes | Medium |
| **Performance optimizations** | Monthly | 1-2 fixes | Low |
| **Tech debt cleanup** | Monthly | 2-5 fixes | Medium |

**Monthly Total (Proactive):** 12-27 fixes

#### Reactive Maintenance (Discovered)

| Source | Frequency | Expected Count | Priority |
|--------|-----------|----------------|----------|
| **Production issues** | As reported | 1-3 fixes | Critical |
| **User bug reports** | As reported | 2-4 fixes | High |
| **Security vulnerabilities** | As discovered | 1-2 fixes | Critical |
| **Integration breakage** | As occurs | 2-4 fixes | High |
| **Monitoring alerts** | As triggered | 1-3 fixes | Medium-High |

**Monthly Total (Reactive):** 7-16 fixes

**Combined Monthly Range:** 15-50 fixes
- **Conservative:** 15-30 fixes/month
- **Aggressive (reducing tech debt):** 30-50 fixes/month

### Reducing Monthly Maintenance Load

#### CI/CD Automation (Saves 5-10 bugs/month)

```yaml
# .github/workflows/security-checks.yml
name: Security Checks
on: [push, pull_request]
jobs:
  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      # TypeScript strict mode
      - name: TypeScript Check
        run: npm run type-check

      # Linting
      - name: ESLint
        run: npm run lint

      # Security scan
      - name: Snyk Code Scan
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}

      # Dependency audit
      - name: npm audit
        run: npm audit --audit-level=high
```

#### Dependency Automation (Saves 5-10 bugs/month)

1. **Enable Dependabot** (auto-merge for patches):
   ```yaml
   # .github/dependabot.yml
   version: 2
   updates:
     - package-ecosystem: "npm"
       directory: "/"
       schedule:
         interval: "weekly"
       open-pull-requests-limit: 10
   ```

2. **Monthly Dependency Review Ritual**:
   - First Monday of month
   - Review major version updates
   - Test before merging

#### Monitoring Setup (Saves 3-5 bugs/month)

| Tool | Purpose | Benefit |
|------|---------|---------|
| **Sentry** | Error tracking | Catch production errors before users report |
| **Log aggregation** | Centralized logs | Detect patterns, debug faster |
| **Uptime monitoring** | Service health | Proactive alerting |
| **Performance monitoring** | Slow queries/routes | Prevent performance degradation |

#### Documentation (Saves 2-3 bugs/month)

| Document | Purpose | Maintenance |
|----------|---------|-------------|
| **Runbooks** | Common operational tasks | Update after each incident |
| **Architecture diagrams** | System understanding | Update quarterly |
| **Deployment checklists** | Prevent deployment errors | Update after each failure |
| **Incident post-mortems** | Learn from failures | Create after each incident |

### Bug Hunting Roadmap (Priority Order)

**Recommended audit sequence based on risk × impact:**

#### Quarter 1 (Immediate - High Risk)

1. **MCP Servers Security Audit** (Week 1-2)
   - Authentication mechanisms
   - Input validation
   - Authorization checks
   - Estimated: 5-10 high-severity bugs

2. **AgentFoundry Services Review** (Week 3-4)
   - API endpoint security
   - Python dependency vulnerabilities
   - Error handling
   - Estimated: 8-15 medium/high bugs

3. **Frontend Security Scan** (Week 5-6)
   - XSS vulnerabilities
   - CSRF protection
   - Client-side validation
   - Estimated: 10-20 medium bugs

#### Quarter 2 (Important - Medium Risk)

4. **Dependency Audit** (Week 1)
   - `npm audit --audit-level=moderate`
   - `pip-audit`
   - Update critical packages
   - Estimated: 15-30 dependency issues

5. **Configuration Security** (Week 2)
   - Environment variable validation
   - Secret management review
   - Deployment config hardening
   - Estimated: 5-10 config issues

6. **Error Handling Audit** (Week 3-4)
   - Unhandled Promise rejections
   - Try-catch coverage
   - Graceful degradation
   - Estimated: 20-40 error handling gaps

#### Quarter 3 (Tech Debt - Lower Risk)

7. **Test Coverage Expansion** (Ongoing)
   - Unit tests for critical paths
   - Integration tests for APIs
   - E2E tests for user flows
   - Estimated: 50+ test gaps

8. **Performance Optimization** (Week 1-2)
   - Slow database queries
   - Bundle size reduction
   - Caching strategies
   - Estimated: 10-20 performance issues

9. **Code Quality** (Week 3-4)
   - Linting rule enforcement
   - TypeScript strict mode
   - Dead code removal
   - Estimated: 30-60 quality issues

### Bug Severity Classification

| Severity | Definition | Response Time | Examples |
|----------|-----------|---------------|----------|
| **Critical** | System down, data loss, security breach | < 1 hour | Auth bypass, data leak, XSS, XXE |
| **High** | Major feature broken, significant security risk | < 24 hours | DoS vulnerability, broken payment, timing attack |
| **Medium** | Feature partially broken, minor security issue | < 1 week | Validation missing, info disclosure, memory leak |
| **Low** | Minor bug, cosmetic issue, tech debt | < 1 month | UI quirk, unused code, missing types |

### Security Fix History (December 2025)

#### Session: December 19, 2025

**Branch:** `claude/security-fixes-15-18-19-OkAMF`

**Bugs Fixed:** 20 security vulnerabilities

| Bug # | Severity | Issue | Fix |
|-------|----------|-------|-----|
| 1 | High | Authentication performance (bcrypt per request) | Pre-computed hash |
| 2 | Low | Duplicate middleware | Removed duplicate |
| 3 | Medium | Broken cookie authentication | Removed broken code |
| 4 | Critical | Missing authentication on user routes | Added authenticateToken |
| 5 | Medium | Missing parseInt radix | Added explicit radix |
| 6 | High | Information disclosure (12 endpoints) | Generic error messages |
| 7 | High | Memory leak in rate limiter | Periodic cleanup |
| 8 | Medium | Unused rate limiter (dead code) | Activated dual-layer protection |
| 9 | High | Missing rate limiting on forgot-password | Added IP-based limiting |
| 10 | High | Missing max password length (bcrypt DoS) | Added 128 char max |
| 11 | High | Missing body size limits (JSON DoS) | Added 10kb limit |
| 12 | Medium | Missing max length on name fields | Added 100 char max |
| 13 | Critical | Logging sensitive data in validation errors | Sanitized logs |
| 14 | Critical | Timing attack on login (email enumeration) | Constant-time response |
| 15 | High | Logout doesn't invalidate tokens | Auth required + documented |
| 16 | Medium | Unsafe email typing in middleware | Type validation |
| 17 | High | Path traversal in AgentFoundry | Path validation |
| 18 | High | Jinja2 missing autoescape (XSS) | Enabled autoescape |
| 19 | Critical | Unsafe XML parser (XXE) | Use defusedxml |
| 20 | Low | NameError in warning fallback | Fixed SecurityWarning → UserWarning |

**Security Impact:**
- ✅ Authentication bypass fixed (Bug #4, #14)
- ✅ 4 DoS vulnerabilities patched (#7, #10, #11, #12)
- ✅ 3 information disclosure issues resolved (#6, #13, #14)
- ✅ XSS prevention (Bug #18)
- ✅ XXE prevention (Bug #19)
- ✅ GDPR/PCI-DSS/OWASP compliant

**Files Changed:**
- `src/routes/auth.routes.ts`
- `src/routes/user.routes.ts`
- `src/services/auth.service.ts`
- `src/middleware/auth.middleware.ts`
- `src/app.ts`
- `sites/*/build.py` (4 files)
- `admin/Sites-Archive/sites/*/build.py` (2 files)
- `scripts/build_store.py`
- `scripts/import_wordpress.py`
- `AgentFoundry/services/claude-router/main.py`

---

## AI Model Configuration

### Overview

**Status:** ✅ **UPDATED** (as of January 4, 2026)

DWS6 uses Claude Opus 4.5 as the primary AI model for development assistance.

### AI Model Switch (Week 53)

| Previous Model | New Model | Reason |
|---------------|-----------|--------|
| Claude Sonnet 4.5 | **Claude Opus 4.5** | Knowledge cutoff issues |

**Issue with Sonnet 4.5:**
- Knowledge cutoff at early 2024
- Suggested deprecated `actions/upload-artifact@v3` instead of `@v4`
- Outdated CLI syntax for `safety` and `cyclonedx-py`
- Recommended deprecated library versions

**Resolution:**
Switched to **Claude Opus 4.5** which has:
- More recent knowledge base
- Better understanding of 2026 tooling
- Accurate security tool recommendations
- Correct GitHub Actions versions

---

## Code Review Process

### Overview

**Status:** ✅ **STREAMLINED** (as of January 3, 2026)

DWS6 uses an integrated code review process that leverages existing AI tools without additional API costs.

### Review Tools (Current Setup)

| Tool | Purpose | Cost | Status |
|------|---------|------|--------|
| **Cursor AI (Claude Opus 4.5)** | Interactive code review | Included in Cursor subscription | ✅ Active |
| **Snyk MCP** | Security vulnerability scanning | Free/Pro tier | ✅ Active |
| **GitHub Copilot Review** | Automated PR review | Included in GitHub | ✅ Available |
| **Ruff** | Python linting & security | Free | ✅ Active |

### Removed Tools

| Tool | Reason | Alternative |
|------|--------|-------------|
| **Argus PR Review** | Required separate OpenAI API key (~$20-100/mo) | Cursor AI + Snyk MCP |

**Archive Location:** `Archive/workflows/argus-code-review.yml.DEPRECATED`

### Review Workflow

#### 1. Pre-Commit Review (Local)

```powershell
# Run before committing
.\scripts\gdpr-safety-check.ps1    # Security check
ruff check .                        # Python linting
npm run lint                        # JS/TS linting (if applicable)
```

#### 2. AI-Assisted Review (Cursor)

Use Cursor AI for interactive code review:

```
# Example prompts:
"Review this diff for security issues"
"Check this code for OWASP Top 10 vulnerabilities"
"Analyze this function for performance issues"
"Review this PR for code quality"
```

**Benefits:**
- ✅ Interactive - can ask follow-up questions
- ✅ Context-aware - sees full codebase
- ✅ No extra cost - included in Cursor subscription
- ✅ Multi-model - Claude Opus 4.5, GPT-5.2

#### 3. Security Scanning (Automated)

**Snyk MCP** runs automatically via Cursor:

```
# Manual scan (if needed)
snyk code test
snyk test
```

**GitHub Actions** run on push/PR:
- `security-scan-daily.yml` - Daily security scan
- `security-check-pr.yml` - PR security review
- `dependency_review.yml` - Dependency vulnerability check

#### 4. GitHub Copilot Review (Optional)

Request automated review on any PR:

```bash
gh pr review --request-review copilot
```

### Review Checklist

Before approving/merging a PR:

- [ ] Security scan passed (Snyk/Ruff)
- [ ] No deployment files included
- [ ] No secrets or credentials
- [ ] Tests pass (if applicable)
- [ ] Code follows project conventions
- [ ] Documentation updated (if needed)

### Best Practices

1. **Use Cursor AI for complex reviews** - Interactive dialogue reveals issues faster
2. **Run Snyk before pushing** - Catch vulnerabilities early
3. **Review deployment file protections** - Pre-commit hook should block sensitive files
4. **Check GitHub Actions results** - Automated security scans catch what humans miss

---

## Tools

### Database Migration (db_push)

Push Supabase migrations to the linked project (ref: `kpucuwwfhuwurdxyjjtz`).

```powershell
# Full run (link + push)
pwsh -File scripts/db_push.ps1

# Or via npm
npm run db:push

# Skip link if already linked
pwsh -File scripts/db_push.ps1 -SkipLink
npm run db:push:skip-link
```

**When to run:** After adding new migrations in `supabase/migrations/`, or when setting up on a new machine.

**Check pending migrations:**
```bash
npx supabase migration list
```

### Supabase MCP

The **Supabase MCP Server** (`mcp-servers/supabase/server.py`) provides AI-accessible tools for Supabase integration:

| Endpoint | Purpose |
|----------|---------|
| `POST /tools/query_carbon_calculations` | Query carbon calculation history |
| `POST /tools/log_agent_activity` | Log agent activity to database |
| `POST /tools/query_compliance` | Query compliance data |

**Configuration:** Port 8766. Set `SUPABASE_URL` and `SUPABASE_SERVICE_KEY` in `.env.mcp`.

**Docker:** Runs as `supabase-mcp` in `docker-compose.hybrid.yml`.

### Supabase Skills (Cursor)

For AI-assisted database operations in Cursor, configure Supabase skills:

- **MCP File System:** Supabase tool descriptors in `mcps/<server>/tools/`
- **Skills:** Create `.cursor/skills/` or use Cursor's built-in Supabase MCP integration
- **Reference:** `ADMIN_MANUAL_SUPABASE_EN_v1.md` for full database administration

---

## Maintenance Tasks

### Weekly Tasks

| Task | Frequency | Owner |
|------|-----------|-------|
| Check cross-links work | Weekly | Automated (GitHub Action) |
| Review analytics | Weekly | Marketing |
| Update landing page content | As needed | Marketing |
| Review open security issues | Weekly | Dev team |

### Monthly Tasks

| Task | Frequency | Owner |
|------|-----------|-------|
| Update documentation | Monthly | Dev team |
| Review DNS records | Monthly | DevOps |
| Check SSL certificates | Monthly | Automated (Cloudflare) |
| Security audit (npm audit) | Monthly | Dev team |
| Review Dependabot alerts | Monthly | Dev team |

### Automated Checks

#### Link Checker (Recommended)

Add to `.github/workflows/check-links.yml`:

```yaml
name: Check Cross-Links
on:
  schedule:
    - cron: '0 9 * * 1'  # Every Monday 9am
jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: lycheeverse/lychee-action@v1
        with:
          args: >
            https://lifetime.fi
            https://onelifetime.world
            https://dws10.com
```

---

## Git Workflow

### Branch Strategy

| Branch Type | Example | Purpose |
|-------------|---------|---------|
| **main** | main | Production, auto-deploys to Cloudflare Pages |
| **claude/** | claude/plan-agentic-ai-saas-... | AI session work, merge via PR |
| **feature/** | feature/new-agent | New feature development |

## Deployment File Protection System

### Overview

**Status:** ✅ **ENHANCED** (as of January 2, 2026)

The deployment file protection system prevents accidental commits of infrastructure configuration files that contain sensitive deployment procedures, credentials, and infrastructure details.

### Protection Evolution

**Before (Pre-January 2026):**
- ❌ Pre-commit hook only blocked Admin/ folder and secret files
- ❌ No automated verification in GitHub
- ❌ Risk of accidentally committing deployment files
- ⚠️ **Incident:** Deployment files exposed Dec 23, 2025 - Jan 2, 2026 (10 days)

**Now (Post-January 2026):**
- ✅ Pre-commit hook blocks deployment files locally
- ✅ GitHub Actions verifies protections remotely
- ✅ Daily automated checks prevent regressions
- ✅ Prevents repeat of Dec 23 - Jan 2 incident

### Protected Files

**Google Cloud Platform:**
- `cloudbuild.yaml`
- `cloudrun-service.yaml`
- `deploy-gcp.sh`
- `setup-secrets-gcp.sh`
- `GCP_DEPLOYMENT.md`
- `QUICK_DEPLOY.md`
- `*.gcp.*`
- `*cloudbuild*`
- `*cloudrun*`

**Docker:**
- `docker-compose.mcp.yml`
- `Dockerfile`
- `.dockerignore`
- `DOCKER_*.md`
- `DOCKER_*.txt`
- `*.dockerfile`

**MCP Hub:**
- `mcp-hub/Dockerfile`
- `mcp-hub/DOCKER_*.md`
- `mcp-hub/GCP_*.md`
- `mcp-hub/DEPLOY_*.md`
- `mcp-hub/README.md`
- `mcp-hub/*deploy*`
- `mcp-hub/*deployment*`

### Pre-commit Hook

**Location:** `scripts/gdpr-safety-check.ps1` (Windows) / `.git/hooks/pre-commit` (Linux/Mac)

**Functionality:**
- Automatically runs before every `git commit`
- Checks for 18+ deployment file patterns
- Blocks commits containing infrastructure configuration files
- Provides clear error messages with unstage instructions

**Testing:**
```powershell
# Test the hook manually
.\scripts\gdpr-safety-check.ps1
```

**If deployment file is detected:**
```
[BLOCKED] Deployment files detected!
   These files contain infrastructure configuration and deployment procedures
   They must remain local only and are protected by .gitignore
   - docker-compose.mcp.yml

[BLOCKED] COMMIT BLOCKED for security compliance

To unstage these files:
   git reset HEAD <file>
```

### GitHub Actions Verification

**Workflow:** `.github/workflows/verify-gitignore-protections.yml`

**Triggers:**
- Push to `main` or `develop` branches
- Pull requests to `main` or `develop`
- Daily schedule (2 AM UTC)
- Manual trigger (`workflow_dispatch`)

**Checks:**
1. Verifies `.gitignore` contains all 14 required patterns
2. Checks if deployment files are tracked in Git
3. Validates "MCP HUB DEPLOYMENT FILES" section exists
4. Generates protection report in GitHub Actions summary

**View Results:**
- Go to: **Actions** tab → **Verify .gitignore Protections**
- Check: Protection status and any violations

### Incident Response

**If deployment file is accidentally committed:**

1. **Immediate:** Remove from Git tracking (file stays on disk)
   ```bash
   git rm --cached <deployment-file>
   ```

2. **Verify:** Check `.gitignore` contains the pattern
   ```bash
   grep -i "deployment-file-name" .gitignore
   ```

3. **Commit:** Commit the removal
   ```bash
   git commit -m "security: Remove deployment file from tracking"
   ```

4. **Verify:** Run pre-commit hook to confirm protection
   ```powershell
   .\scripts\gdpr-safety-check.ps1
   ```

5. **Document:** Update `Admin/SECURITY_AUDIT_REPORT.md` if needed

### Maintenance

**Monthly:**
- Review GitHub Actions workflow results
- Verify no deployment files are tracked
- Check `.gitignore` patterns are up-to-date

**Quarterly:**
- Full security audit (see `Admin/SECURITY_AUDIT_REPORT.md`)
- Review incident history
- Update protection patterns if needed

### Related Documentation

- **Security Audit Report:** `Admin/SECURITY_AUDIT_REPORT.md`
- **Confidential Data Policy:** `Admin/CONFIDENTIAL-handling-policy.md`
- **Agent Security:** `AgentFoundry/Security.md`

---

### Deployment Branch

**IMPORTANT:** Cloudflare Pages deploys from `main` branch only.

All work branches must be merged to `main` to deploy.

### Merge Process

1. Work on feature branch (e.g., `claude/...`)
2. Push to GitHub
3. Create Pull Request
4. Review changes
5. Merge to `main`
6. Cloudflare auto-deploys in ~30 seconds

---

## Sensitive Data Protection

### Overview

The `.gitignore` file contains patterns to prevent sensitive data from being committed to the repository. This ensures GDPR and ISO 27001 compliance.

### Protected Categories

| Category | Patterns | Description |
|----------|----------|-------------|
| **Confidential Business Data** | `/confidential/`, `/secrets/`, `/investor-materials/`, `*.confidential.*`, `*-confidential.*` | Internal business documents, investor materials, strategic plans |
| **Customer Data** | `/customer-data/`, `/pilot-data/`, `/ncc-data/`, `/t2h-data/` | GDPR-protected customer information and pilot project data |
| **API Keys & Credentials** | `.env.local`, `.env.*.local`, `credentials.json`, `service-account-*.json` | API keys, service accounts, local environment secrets |
| **Financial Models** | `*financial-model*.xlsx`, `*roi-calculator*.xlsx`, `*cap-table*.xlsx` | Sensitive financial projections and capitalization data |
| **Proprietary Algorithms** | `/dws-core/proprietary/`, `/algorithms/confidential/` | DWS IQ trade secrets and confidential algorithms |
| **Admin Documentation** | Admin/, admin/ | Admin manual, installation guides (ProtonDrive only) |

### Directory Structure for Sensitive Data

```
dws6/
├── confidential/           # ⛔ NEVER COMMIT - Business secrets
├── secrets/                # ⛔ NEVER COMMIT - API keys, passwords
├── investor-materials/     # ⛔ NEVER COMMIT - Investor decks, financials
├── customer-data/          # ⛔ NEVER COMMIT - GDPR protected data
├── pilot-data/             # ⛔ NEVER COMMIT - Pilot customer data
├── ncc-data/               # ⛔ NEVER COMMIT - NCC customer data
├── t2h-data/               # ⛔ NEVER COMMIT - T2H customer data
├── admin/                  # ⛔ NEVER COMMIT - Admin manual (ProtonDrive only)
├── dws-core/
│   └── proprietary/        # ⛔ NEVER COMMIT - Trade secrets
└── algorithms/
    └── confidential/       # ⛔ NEVER COMMIT - Proprietary algorithms
```

### Admin Instructions

#### Before Committing

1. **Run `git status`** - Review all files staged for commit
2. **Check for sensitive patterns** - Look for files matching protected patterns
3. **Verify `.gitignore`** - Ensure patterns are not bypassed with `git add -f`

#### Adding New Sensitive Data Categories

1. Edit `.gitignore` in the repository root
2. Add pattern under appropriate section with comment
3. Commit the `.gitignore` change
4. Run `git rm --cached <file>` if file was previously tracked

#### Verifying Protection

```bash
# Check if a file would be ignored
git check-ignore -v <filename>

# List all ignored files in repo
git status --ignored

# Verify no sensitive files are tracked
git ls-files | grep -E "(confidential|secrets|credentials)"
```

#### Handling Accidental Commits

If sensitive data was accidentally committed:

1. **Do NOT push** if not yet pushed
2. **Remove from history:**
   ```bash
   git filter-branch --force --index-filter \
     "git rm --cached --ignore-unmatch <file>" \
     --prune-empty --tag-name-filter cat -- --all
   ```
3. **Force push** (with team coordination)
4. **Rotate credentials** - If API keys or passwords were exposed
5. **Notify security team** - Document the incident

#### Compliance Checklist

- [ ] All customer data stored in protected directories
- [ ] No API keys in code (use environment variables)
- [ ] Financial models stored locally only
- [ ] Investor materials not in version control
- [ ] Admin manual on ProtonDrive only
- [ ] Regular audit of `.gitignore` patterns

### File Naming Conventions

To ensure automatic protection, use these naming conventions:

| Type | Pattern | Example |
|------|---------|---------|
| Confidential docs | `*-confidential.*` | `roadmap-confidential.pdf` |
| Confidential data | `*.confidential.*` | `data.confidential.xlsx` |
| Financial models | `*financial-model*` | `2025-financial-model.xlsx` |
| ROI calculators | `*roi-calculator*` | `customer-roi-calculator.xlsx` |
| Cap tables | `*cap-table*` | `lifetime-cap-table.xlsx` |

---

## Emergency Procedures

### Rollback Deployment

If a bad deployment goes live:

1. Go to Cloudflare Pages dashboard
2. Select affected project
3. **Deployments** → Find last good deployment
4. Click **⋯** → **Rollback to this deployment**

### DNS Issues

If domains stop working:

1. Check Cloudflare DNS records match `CLOUDFLARE_DNS_RECORDS_READY.md`
2. Verify SSL/TLS mode is **Full (strict)**
3. Check nameservers point to Cloudflare
4. Use `dig onelifetime.world` to verify DNS propagation

### SSL Certificate Issues

Cloudflare auto-renews. If SSL fails:

1. SSL/TLS → Edge Certificates
2. Verify **Always Use HTTPS** is ON
3. Check certificate status (should be Active)
4. Contact Cloudflare support if persists

### Security Incident Response

If security vulnerability is actively exploited:

1. **Immediate:** Take affected service offline
2. **Assess:** Review logs and determine impact
3. **Patch:** Apply security fix or rollback to safe version
4. **Test:** Verify fix in staging environment
5. **Deploy:** Push fix to production
6. **Notify:** Inform affected users if data breach occurred (GDPR requirement)
7. **Document:** Create incident report in admin/

---

## Contact Information

### Repository Owner

- **Email:** risto@lifetime.fi
- **LinkedIn:** https://www.linkedin.com/in/ristopaarni
- **GitHub:** https://github.com/blogtheristo

### Key URLs

| Service | URL |
|---------|-----|
| **GitHub Repo** | https://github.com/blogtheristo/dws6 |
| **Cloudflare Dashboard** | https://dash.cloudflare.com |
| **onelifetime.world** | https://onelifetime.world |
| **dws10.com** | https://dws10.com |
| **Peachscore** | https://app.peachscore.com/company/lifetime-oy |

---

## DWS IQ 6 Security Framework

### Overview

**Status:** ✅ **COMPLETE** (as of January 4, 2026)

The DWS IQ 6 Security Framework is a comprehensive 5-layer security architecture protecting the platform from modern threats while maintaining EU compliance (GDPR, NIS2, EU Cybersecurity Act).

### Framework Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    LAYER 5: GOVERNANCE                          │
│  AI Governance | Compliance Reporting | Audit Trail             │
├─────────────────────────────────────────────────────────────────┤
│                    LAYER 4: MONITORING                          │
│  Aikido Threat Detection | Snyk Scanning | Ruff Linting         │
├─────────────────────────────────────────────────────────────────┤
│                    LAYER 3: APPLICATION SECURITY                │
│  Input Validation | CSRF Protection | XSS Prevention | CORS     │
├─────────────────────────────────────────────────────────────────┤
│                    LAYER 2: AUTHENTICATION & AUTHORIZATION      │
│  JWT Tokens | bcrypt Hashing | Rate Limiting | RBAC             │
├─────────────────────────────────────────────────────────────────┤
│                    LAYER 1: INFRASTRUCTURE                      │
│  HTTPS/TLS 1.3 | Cloudflare WAF | Secret Management            │
└─────────────────────────────────────────────────────────────────┘
```

### Security Tools Stack

| Tool | Purpose | Status |
|------|---------|--------|
| **Snyk** | Dependency scanning (SCA, SAST) | ✅ Active |
| **Aikido** | Runtime threat detection | ✅ Active |
| **Ruff** | Python security linting | ✅ Active (398 fixes) |
| **CodeQL** | Code analysis (SARIF) | ✅ Active |
| **pip-audit** | Python vulnerability scanning | ✅ Active |
| **safety** | Python security database | ✅ Active |
| **cyclonedx-bom** | SBOM generation | ✅ Active |
| **pip-licenses** | License compliance | ✅ Active |

### Compliance Status (January 2026)

| Regulation | Status | Score |
|------------|--------|-------|
| **GDPR** | ✅ Compliant | 95% |
| **NIS2** | ✅ Compliant | 95% |
| **EU Cybersecurity Act** | ✅ Compliant | 95% |
| **OWASP Top 10** | ✅ Protected | 95% |

### Week 53 Security Fixes (449 → 0 issues)

| Category | Count | Status |
|----------|-------|--------|
| **Critical** | 4 | ✅ Fixed |
| **High** | 8 | ✅ Fixed |
| **Medium** | 6 | ✅ Fixed |
| **Total** | **18** | ✅ **ALL RESOLVED** |

### Security Documentation

| Document | Location | Purpose |
|----------|----------|---------|
| `MASTER_INDEX.md` | `Admin/Security/` | Security stack overview |
| `COMPLETE_SECURITY_STACK_SUMMARY.md` | `Admin/Security/` | Executive summary |
| `SECURITY_WORKFLOW_SNYK_AIKIDO.md` | `Admin/Security/` | Workflow documentation |
| `JANUARY_2026_SECURITY_UPDATE.md` | `Admin/Security/` | Week 53 security updates |

---

## Document Changelog

| Version | Date | Changes | Session ID |
|---------|------|---------|-----------|
| 1.6 | Feb 19, 2026 | Added Tools section: db_push script, Supabase MCP, Supabase skills | - |
| 1.5 | Jan 4, 2026 | Added AI Model Configuration (Sonnet → Opus 4.5 switch); Added DWS IQ 6 Security Framework section; Updated compliance scores to 95% | - |
| 1.4 | Jan 3, 2026 | Added Code Review Process section; Removed Argus PR Review (moved to Archive); Documented Cursor AI + Snyk MCP workflow | - |
| 1.3 | Dec 23, 2025 | Added AI Agent Policy section based on 2,500+ agent analysis; Protected admin directory in .gitignore | PxSux |
| 1.2 | Dec 19, 2025 | Added Bug Tracking & Security Maintenance section with 20-bug fix history, monthly maintenance budget, bug hunting roadmap | - |
| 1.1 | Dec 11, 2025 | Added Sensitive Data Protection section (GDPR/ISO 27001 compliance) | - |
| 1.0 | Nov 23, 2025 | Initial creation, documented session history | - |

---

**License:** Proprietary - Lifetime Oy  
**Maintained by:** Lifetime Oy Development Team  
**Storage:** ProtonDrive Only - /2026/Repos2026/dws6/Admin
