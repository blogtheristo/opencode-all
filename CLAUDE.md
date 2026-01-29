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
- Root folders → Cloudflare Workers
- Landing-pages folders → Cloudflare Pages

**Rule: When editing ANY landing page, ALWAYS update BOTH locations.**

This ensures consistent deployment across both Cloudflare Workers and Pages.

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
