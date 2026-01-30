# CLAUDE.md

This file provides guidance for Claude Code (AI) when working with the DWS6 codebase.

## Project Overview

**DWS IQ 6** is an enterprise-grade industrial climate intelligence and compliance platform for EU-regulated industries. It automates climate compliance (Fit for 55, ETS, CBAM, CSRD) across 16 EU industries.

### Architecture: Brain-Memory-Body-Hands Ecosystem

- **Brain**: DWS IQ 6 Platform (Multi-agent AI Orchestration)
- **Memory**: Lifetime World Model (Climate LLM + EU Regulations)
- **Body**: Firehorse Suite (Reports, Automation, Content DMS, Omnichannel)
- **Hands**: Lifetime Fleet (IoT/Robots for physical execution)

## Tech Stack

### Frontend
- React 19.2, Vite 7.2, TypeScript 5.9, TailwindCSS 4.1
- Zod for schema validation
- Supabase JS SDK for backend integration

### Backend
- Express 4.19 with TypeScript
- Node-cron for task scheduling
- JWT authentication, Helmet for security

### AI/LLM
- Claude (Anthropic) - Primary AI model
- Google Gemini, Groq API
- LlamaStack for LLM orchestration
- MCP (Model Context Protocol) for agent coordination

### Database & Infrastructure
- Supabase (PostgreSQL + Auth + Realtime)
- pgvector for embeddings
- Google Cloud Run, Cloudflare Workers
- NVIDIA Jetson Orin Nano for edge AI
- Temporal.io for workflow orchestration

## Repository Structure

```
dws6/
├── src/                     # Backend/shared logic
│   ├── app.ts              # Main Express app
│   ├── firehorse/          # Firehorse product integration
│   ├── integrations/       # ERP (SAP, IFS, Dynamics) & ESG integrations
│   ├── mcp/                # Model Context Protocol implementation
│   └── __tests__/          # Test suite
├── dws6.com/               # Web applications
│   ├── dashboard/          # Multiple dashboard versions
│   │   └── firehorse/v9-react/  # Main React dashboard
│   ├── admin/              # Admin panels
│   └── shared/             # Shared assets
├── Firehorse/              # Product suite
│   ├── Omnichannel/        # Multi-channel outreach
│   ├── Report/             # Analytics & reporting
│   ├── Automation/         # Python automation scripts
│   └── ContentMS/          # Content management
├── landing-pages/          # Next.js landing pages
├── mcp-hub/                # MCP Orchestration Platform
├── mcp-servers/            # Individual MCP servers
├── scripts/                # Development & deployment scripts
├── supabase/migrations/    # Database migrations
└── .github/workflows/      # CI/CD pipelines (18 workflows)
```

### Dual Folder Structure Rule (IMPORTANT)

**Landing pages exist in TWO locations and MUST be updated in BOTH:**

| Site | Root Folder | Landing Pages Folder |
|------|-------------|---------------------|
| dws6.com | `dws6.com/` | `landing-pages/dws6-com/` |
| dws10.com | `dws10.com/` | `landing-pages/dws10-com/` |
| onelifetime.world | `onelifetime.world/` | `landing-pages/onelifetime-world/` |
| lifetime.fi | `lifetime.fi/` | `landing-pages/lifetime-fi/` *(coming)* |

**Deployment targets:**
- Root folders → Cloudflare Workers (testing)
- Landing-pages folders → Cloudflare Pages (production)

**Workflow: When editing ANY landing page:**
1. **First** update the root folder (e.g., `dws10.com/`)
2. **Test** that it works on Cloudflare Workers
3. **Then** copy to landing-pages folder (e.g., `landing-pages/dws10-com/`)

This ensures changes are tested before going to production.

## Development Commands

```bash
# Backend development
npm run dev              # Start Express backend with hot reload (tsx watch)
npm run start            # Production server
npm run build            # Build TypeScript
npm run test             # Run Vitest tests
npm run lint             # ESLint

# Dashboard development (in dws6.com/dashboard/firehorse/v9-react/)
npm run dev              # Start Vite dev server
npm run build            # Production build

# Docker development
docker-compose -f docker-compose.hybrid.yml up -d
```

## Code Quality Standards

### Linting & Formatting
- **JavaScript/TypeScript**: ESLint with project-specific configs
- **Python**: Ruff for linting and formatting, Black for code style
- **Security**: Bandit for Python security scanning, Safety for dependencies

### Testing
- Vitest for unit and integration tests
- Tests located in `src/__tests__/`
- Run with `npm run test` or `npm run test:ui`

### Pre-commit Hooks
- Branch name validation in `.githooks/`
- Automated security checks on PRs

## Key Patterns & Conventions

### TypeScript
- Strict TypeScript configuration
- Zod schemas for runtime validation
- Interface-first design for API contracts

### React (v9-react dashboard)
- Functional components with hooks
- TailwindCSS for styling
- Component co-location with styles

### API Design
- RESTful endpoints in Express
- JWT-based authentication
- Input validation with express-validator

### Environment Variables
- Template in `.env.example` (144+ variables)
- Key variables: `PORT`, `NODE_ENV`, `JWT_SECRET`, `DATABASE_URL`, `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`

## Security Considerations

- EU data residency (Finland/Germany)
- GDPR compliant architecture
- Never commit secrets or credentials
- Protected config files in `src/config/`
- Security scans run daily/weekly via GitHub Actions

### 1. General Security Principles

**Secrets Management:**
- Store all secrets ONLY in `.env` files or external tools (AWS Secrets Manager, Supabase Vault)
- Never hardcode API keys, passwords, or tokens in source code
- Use different `.env` files for each environment (development, staging, production)
- Regularly audit dependencies with Dependabot and npm audit

**Environment Isolation:**
- Each development environment must have its own `.env` file
- Never share `.env` files between developers via Git
- Use `git status` before every commit to verify no sensitive files are staged

**Regular Auditing:**
- Run `npm audit` weekly for Node.js dependencies
- Run Bandit and Safety scans for Python code
- Review `.gitignore` effectiveness monthly

### 2. .gitignore Requirements

The `.gitignore` must prevent committing sensitive files. Required patterns:

```gitignore
# Environment files (CRITICAL - never commit)
.env
.env.*
.env.local
.env.*.local

# Secrets and credentials
*.secret
*.key
*.pem
credentials.json
service-account-*.json
**/secrets/

# API configurations with keys
claude_config.json
google-services.json

# Build artifacts
node_modules/
dist/
build/
__pycache__/

# Logs (may contain sensitive data)
*.log
logs/

# OS files
.DS_Store
Thumbs.db

# IDE files
.idea/
.vscode/
*.iml
```

**Verification:**
- Add `.gitignore` to repo root and commit immediately
- Test with `git status` to ensure sensitive files are ignored
- Update when adding new secret file patterns

### 3. .env Requirements

Environment files manage secrets and configuration. **Never commit `.env` files.**

**Required structure for this project:**
```env
# Database
DATABASE_URL=postgresql://...
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_KEY=eyJ...
SUPABASE_ANON_KEY=eyJ...

# AI/LLM APIs
ANTHROPIC_API_KEY=sk-ant-api03-...
GROQ_API_KEY=gsk_...
GOOGLE_AI_API_KEY=AIza...

# Authentication
JWT_SECRET=your-256-bit-secret
SESSION_SECRET=your-session-secret

# Environment
NODE_ENV=development
PORT=3000
```

**Guidelines:**
- Copy from `.env.example` (template with placeholders)
- Never commit actual values - only `.env.example` with dummy data
- Load in code using `dotenv`:
  ```typescript
  import dotenv from 'dotenv';
  dotenv.config();
  ```
- For Python:
  ```python
  from dotenv import load_dotenv
  load_dotenv()
  ```

### 4. Worktree Security (Currently Disabled)

**WARNING: Git worktree is disabled until April 2026** due to security incident.

If worktree is re-enabled, these rules apply:

**Same `.gitignore` across all worktrees:**
- The `.gitignore` in the main worktree applies to all
- Verify with `git status` in each worktree

**Separate `.env` per worktree:**
- Each worktree needs its own `.env` file
- Copy and modify `.env` manually for each worktree
- Never symlink `.env` files between worktrees

**Worktree management:**
```bash
# Create worktree
git worktree add ../project-feature feature-branch

# List worktrees
git worktree list

# Remove worktree (clean up properly)
git worktree remove ../project-feature
git worktree prune
```

**Security checklist before using worktree:**
- [ ] Verify `.gitignore` covers all secrets
- [ ] Create separate `.env` for the worktree
- [ ] Run `git status` to verify no sensitive files exposed
- [ ] Use VPN when working with sensitive data

### 5. Additional Security Requirements

**Pre-commit Hooks:**
- Branch name validation in `.githooks/`
- Install `git-secrets` to prevent committing secrets:
  ```bash
  git secrets --install
  git secrets --register-aws
  ```
- Configure in `.pre-commit-config.yaml` if using pre-commit framework

**Team Training:**
- All developers must understand `.gitignore` and `.env` handling
- Document security procedures in onboarding materials
- Conduct quarterly security awareness reviews

**Leak Response Procedure:**
If secrets are accidentally committed:
1. **Immediately revoke** all exposed API keys and credentials
2. **Clean Git history** using:
   ```bash
   # Using git-filter-repo (recommended)
   git filter-repo --path-glob '*.env' --invert-paths

   # Or BFG Repo-Cleaner
   bfg --delete-files .env
   ```
3. **Force push** cleaned history (coordinate with team)
4. **Rotate all credentials** that may have been exposed
5. **Document the incident** for compliance records
6. **Review and update** `.gitignore` to prevent recurrence

**References:**
- [Git Documentation](https://git-scm.com/docs)
- [OWASP Secrets Management](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)
- [Anthropic API Security](https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching)

### Admin Folder Protection (CRITICAL)

**NEVER expose the Admin/ folder to GitHub in ANY case.**

This is an absolute rule with no exceptions:
- The entire `Admin/` folder is gitignored with NO exceptions
- Never use `git add -f Admin/` or similar force commands
- Never create exceptions in `.gitignore` for Admin files
- CI/CD reports go to `security-reports/` (not Admin/)
- Admin files are stored ONLY in ProtonDrive locally

If you need a file from Admin/ for CI/CD:
1. Copy it to root or another appropriate folder
2. Remove any sensitive information
3. Document the change in the copied file

## 2026 EU AI Act Compliance

By **August 2026**, the EU AI Act mandates that "High-Risk" AI systems must comply with:

### Article 12: Automatic Logging
- All AI system events must be automatically logged
- Logs must enable traceability of system decisions
- Retention periods must meet regulatory requirements

### Reasoning Lineage Documentation
- Technical documentation must demonstrate the system's "Reasoning Lineage"
- Decision chains must be traceable from input to output
- AI model outputs must include provenance metadata

## Important Integrations

### ERP Systems
- SAP S/4HANA, IFS Cloud, Microsoft Dynamics 365
- Monitor ERP, Visma, Jeeves
- Integration code in `src/integrations/erp/`

### ESG Platforms
- Worldfavor, PositionGreen
- Integration code in `src/integrations/esg/`

## Deployment

- **Primary**: Google Cloud Run + Groq
- **Edge**: Cloudflare Workers (dws6.com, dws10.com)
- **Data**: Supabase (EU-hosted)
- **Edge AI**: NVIDIA Jetson Orin Nano
- **Orchestration**: Temporal.io

## Documentation

Key documentation files:
- `README.md` - Project overview
- `ADMIN_MANUAL_*.md` - Administration guides
- `SECURITY_COMPLIANCE.md` - Security documentation
- `Firehorse/` directory - Product documentation

## Git Workflow

- Main development on feature branches
- Branch naming: `claude/<feature>-<id>` for AI-assisted work
- PR-based workflow with automated security checks
- 18 CI/CD workflows in `.github/workflows/`

### Worktree Warning

**DO NOT USE `git worktree` in this repository until April 2026.**

Git worktree was disabled due to a security incident on January 29, 2026:
- Worktree can expose `.env` files across worktrees
- `.gitignore` protections may not apply correctly
- Sensitive data can be accidentally committed

**Alternative workflows:**
1. **Separate clones** - Clone repository to different directories
2. **Branch switching** - Use `git checkout` or `git switch`
3. **Stash changes** - Use `git stash` to save work temporarily
