# Admin Manual: Files and Folders Structure

**Document Version**: 1.1
**Last Updated**: December 22, 2025 (Session Week 52)
**Maintainer**: Risto Anton Päärni (risto@lifetime.fi)
**Session Update**: Agent Foundry Architecture, Construction Vertical Spec, Document Management System integration

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

## Overview

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

| File | Size | Purpose | Priority |
|------|------|---------|----------|
| ACCOUNTS_SETUP_GUIDE.md | 10.8 KB | Lists 11 required services with signup instructions | High |
| DEPLOYMENT_GUIDE.md | 9.0 KB | Complete deployment walkthrough from local to production | High |
| PROJECT_SUMMARY.md | 12.5 KB | Comprehensive session overview and next steps | Critical |

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
- Path aliases (@/* for src/*)
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

## Related Documentation

**Primary Docs** (Start Here):
1. `in-update-claude/documentation/PROJECT_SUMMARY.md`
2. `in-update-claude/documentation/ACCOUNTS_SETUP_GUIDE.md`
3. `in-update-claude/documentation/DEPLOYMENT_GUIDE.md`

**Project-Specific**:
4. `in-update-claude/next-js-projects/dws10-com/README.md`
5. `in-update-claude/next-js-projects/onelifetime-world/README.md`

**Technical Details**:
6. `in-update-claude/next-js-projects/dws10-com/SITEMAP.md`
7. `in-update-claude/next-js-projects/onelifetime-world/SITEMAP.md`

**Session Context**:
8. `in-update-claude/SESSION_SUMMARY.md` (this session)

---

## Changelog

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
