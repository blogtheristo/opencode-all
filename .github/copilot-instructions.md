# Copilot Instructions for DWS6

## Project Overview

**DWS IQ 6** is an enterprise-grade industrial climate intelligence and compliance platform for EU-regulated industries. It automates climate compliance (Fit for 55, ETS, CBAM, CSRD) across 25+ EU industries.

**Repository size:** ~500+ files, TypeScript/JavaScript/Python polyglot codebase  
**Main languages:** TypeScript 5.9, Python 3.11+, React 19.2  
**Target runtime:** Node.js 20+, Python 3.11+

## Build, Test, and Validation (CRITICAL - Always Follow This Sequence)

### First Time Setup
```bash
# 1. ALWAYS install dependencies first (required before any build/test)
npm install

# 2. Copy environment template (if .env doesn't exist)
cp .env.example .env

# 3. THEN build TypeScript
npm run build

# 4. Verify tests pass
npm test
```

**IMPORTANT:** Build will fail with TypeScript errors if you run `npm run build` before `npm install`. Always install dependencies first.

### Development Workflow
```bash
# Start backend with hot reload (PREFERRED for development)
npm run dev              # Uses tsx watch - auto-reloads on changes

# Build TypeScript (for production)
npm run build           # Compiles to dist/ directory

# Run tests (Vitest)
npm test                # Unit and integration tests
npm run test:ui         # Interactive test UI

# No linter configured yet - eslint pending setup
npm run lint            # Currently just echoes "No linter configured"
```

### Python Scripts (Firehorse/)
```bash
# Install Python dependencies
pip install -r requirements.txt

# Security scanning tools
pip install -r requirements-security.txt

# Development tools
pip install -r dev-requirements.txt

# Python linting with Ruff (replaces Black, Flake8)
ruff check .                    # Fast linting
ruff format .                   # Code formatting
bandit -r Firehorse/           # Security scanning
safety check                    # Dependency vulnerability scan
```

### Frontend Dashboard (dws6.com/dashboard/firehorse/v9-react/)
```bash
cd dws6.com/dashboard/firehorse/v9-react/
npm install
npm run dev              # Vite dev server on port 5173
npm run build            # Production build
```

## Repository Architecture

### Key Directories
```
/
├── src/                          # Backend Express API (TypeScript)
│   ├── app.ts                    # Main Express app entry point
│   ├── routes/                   # API route handlers
│   ├── middleware/               # Auth, validation, error handling
│   ├── services/                 # Business logic (email, AI, Redis)
│   ├── integrations/             # ERP (SAP, IFS) & ESG integrations
│   ├── mcp/                      # Model Context Protocol implementation
│   └── __tests__/                # Vitest test files
├── dws6.com/dashboard/           # Frontend dashboards
│   └── firehorse/v9-react/       # Main React dashboard (Vite + Tailwind)
├── Firehorse/                    # Python product suite
│   ├── Report/                   # Analytics engine
│   ├── Automation/               # Python automation scripts
│   ├── ContentMS/                # Content management
│   └── Omnichannel/              # Multi-channel outreach
├── landing-pages/                # Next.js/Cloudflare Pages sites
│   ├── dws6-com/                 # Production landing pages
│   ├── dws10-com/                # DWS 10 landing pages
│   └── onelifetime-world/        # Lifetime landing pages
├── mcp-hub/                      # MCP orchestration platform
├── mcp-servers/                  # Individual MCP server implementations
├── supabase/migrations/          # Database schema migrations
├── .github/workflows/            # 18 CI/CD workflows
├── scripts/                      # Build, deployment, automation scripts
└── public/                       # Static assets served by Express
```

### Configuration Files
- `tsconfig.json` - TypeScript compiler config (strict mode)
- `vitest.config.ts` - Vitest test runner config
- `pyproject.toml` - Python project config (Ruff, Bandit)
- `.env.example` - Environment variable template (144+ vars)
- `.gitignore` - CRITICAL: Prevents committing secrets, node_modules, etc.

## CI/CD Pipelines (18 GitHub Actions Workflows)

Located in `.github/workflows/` - these run automatically on PRs and commits:

**Critical workflows that must pass:**
1. `security-check-pr.yml` - Security scans (runs on all PRs)
2. `deploy-pilot.yml` - Deployment to pilot environment
3. `deploy-scaleway.yml` - Primary production deployment
4. `morning-briefing.yml` - Scheduled email automation

**Before committing:** Ensure your changes won't break these workflows. Common failures:
- Missing environment variables in code
- TypeScript compilation errors (run `npm run build` first)
- Test failures (run `npm test` first)
- Security vulnerabilities (check with `bandit` for Python)

## Code Style and Conventions

### TypeScript
- **Strict TypeScript:** No `any` types, prefer `unknown` for dynamic data
- **Validation:** Use Zod schemas for runtime validation (not just TypeScript types)
- **Interfaces:** Define interfaces for all API contracts
- **Naming:** 
  - Files: `kebab-case.ts` (utils), `PascalCase.tsx` (React components)
  - Variables: `camelCase`
  - Constants: `SCREAMING_SNAKE_CASE`
  - Types/Interfaces: `PascalCase`

### React (v9-react dashboard)
- Functional components with hooks (no class components)
- TailwindCSS for styling (no inline styles or CSS-in-JS)
- Co-locate components with their styles
- Use Zod for form validation

### Python (Firehorse/)
- Follow PEP 8 (enforced by Ruff)
- Use type hints (enforced by mypy in pyproject.toml)
- **Security:** Use `simpleeval` library's `simple_eval()` for formula evaluation, NEVER use `eval()` or `ast.literal_eval()`
- Add `# nosec` comments only for verified false positives

### Email Rules (CRITICAL)
- **NEVER use `noreply@` addresses** - all emails must be replyable
- Default sender: `risto@onelifetime.world` (verified in Amazon SES and Resend.com)
- Default recipient: `risto@lifetime.fi`
- Delivery: SMTP (SES) primary, Resend fallback. Pattern: `process.env.EMAIL_FROM || 'risto@onelifetime.world'`

## Security (NEVER COMMIT SECRETS)

### Prohibited Actions
- ❌ Commit secrets, API keys, passwords to any file
- ❌ Commit PII or customer data (GDPR violation)
- ❌ Skip input validation on user inputs
- ❌ Use `git add -f Admin/` or force-add ignored files
- ❌ Use `eval()` or `exec()` with user-provided strings
- ❌ Force push to main/master branches

### Required Actions
- ✅ Use environment variables for ALL secrets (see `.env.example`)
- ✅ Validate all inputs with express-validator or Zod
- ✅ Use parameterized queries (never string concatenation for SQL)
- ✅ Write tests for security-critical code
- ✅ Run security scans before committing (`bandit`, `safety`)

### .gitignore Patterns (VERIFIED)
These patterns prevent accidental secret commits:
```gitignore
.env*                    # All environment files
*.secret, *.key, *.pem   # Secret files
node_modules/            # Dependencies
__pycache__/             # Python cache
dist/, build/            # Build artifacts
*.log, logs/             # May contain sensitive data
```

**Before every commit:** Run `git status` to verify no `.env` or secret files are staged.

## Common Pitfalls and Workarounds

### Issue: TypeScript Build Fails with "Cannot find name 'process'"
**Cause:** Missing the Node.js type definitions package  
**Fix:** Ensure `npm install` was run first. The error appears if you build before installing dependencies.

### Issue: Morning Briefing Runs Twice During DST Transitions
**Cause:** GitHub Actions cron uses UTC, Finland observes DST  
**Fix:** Use dual cron entries with time-guard in script (see `.github/workflows/morning-briefing.yml:6-11`)

### Issue: node-cron Doesn't Work in Serverless (Cloud Run, Scaleway)
**Cause:** In-process schedulers incompatible with scale-to-zero platforms  
**Fix:** Use external triggers (GitHub Actions, Cloud Scheduler) instead of in-process cron

### Issue: ML/DS Pipeline Artifacts Appear in Git Status
**Cause:** Generated files not in .gitignore  
**Fix:** These patterns are already in .gitignore (lines 104-110):
```gitignore
reports/figures/*.png
reports/*.json
models/*.pkl
data/raw_dataset.csv
data/cleaned_dataset.csv
```
Never commit these runtime artifacts.

## Testing Guidance

### Test Structure
```
src/__tests__/           # Vitest tests co-located with source
├── auth.test.ts         # Authentication tests
├── bim-routes.test.ts   # BIM API endpoint tests
└── security/            # Security-specific tests
```

### Writing Tests
```typescript
// ALWAYS mock auth middleware to avoid JWT_SECRET requirements
import { vi } from 'vitest';

// Mock BEFORE imports
vi.mock('../middleware/auth.middleware.js', () => ({
  authenticateJWT: vi.fn((req, res, next) => next())
}));

// THEN import routes (after mock)
const { default: router } = await import('../routes/bim.routes.js');
```

### Running Tests
```bash
npm test                # Run all tests
npm test -- --watch     # Watch mode
npm test -- --coverage  # Coverage report (aim for >80%)
npm run test:ui         # Interactive UI
```

## Git Workflow

### Branch Naming
- `claude/<feature>-<session-id>` - AI-assisted work (e.g., `claude/auth-fix-abc123`)
- `feature/<name>` - Human-developed features
- `fix/<description>` - Bug fixes

### Commit Messages
```
<type>: <description>

Types: feat, fix, docs, style, refactor, test, chore

Example:
feat: add BIM emission factor validation endpoint
```

## Deployment

**Primary:** Scaleway Serverless Containers (fr-par, Paris, France)  
**Edge:** Cloudflare Workers/Pages (dws6.com, dws10.com)  
**Database:** Supabase (EU-hosted, PostgreSQL + pgvector)  
**AI Inference:** Groq API (Llama 3.1 70B), Claude Sonnet 4.5

**Deployment trigger:** Push to `main` branch runs `.github/workflows/deploy-scaleway.yml`

## Automated PR Workflow (HIL Automation)

This repo uses a fully automated multi-agent PR workflow that **replaces manual human-in-the-loop review**.

### Flow
1. **Claude Code** generates implementation on a feature branch and opens a draft PR
2. **AI Code Review (HIL)** workflow triggers automatically (`.github/workflows/ai-pr-review.yml`)
   - **Claude** does quick sanity check (security, correctness, breaking changes)
   - **Gemini** does deep HIL review (replaces human reviewer: edge cases, tests, architecture, security audit)
   - Both must approve — Gemini is the mandatory quality gate
   - Posts combined review as PR comment
   - Adds labels: `ai-reviewed` + `ai-approved` or `ai-changes-requested`
3. **If changes requested** (mandatory, not optional): Gemini's required changes + test gaps are formatted as structured @copilot instructions
   - Copilot coding agent picks up the comment and implements fixes autonomously
   - Pushes to the PR branch, re-triggering the review workflow
   - Loop repeats until both reviewers approve (typically 1-3 iterations)
4. **Gemini requests fixes → Copilot implements** (mandatory, not optional): This is the core automation loop
   - Gemini acts as strict senior engineer — flags critical issues, missing tests, edge cases
   - Fix instructions are specific and actionable (file:line references)
   - Copilot implements changes, runs `npm run build` and `npm test`
   - Review re-triggers automatically on push
5. **When approved**: `ai-approved` label triggers auto-merge workflow
   - Verifies all CI checks pass
   - Enables squash auto-merge (or adds `ready-to-merge` label)
6. **Human override**: Add `do-not-merge` or `needs-human-review` labels to pause

### Copilot Coding Agent
- Setup steps defined in `.github/copilot-setup-steps.yml`
- Copilot agent runs `npm install`, installs Python tools, builds TypeScript
- When tagged in PR comments, it implements requested changes autonomously

### Gemini MCP Integration
- Gemini MCP server is registered in `mcp-hub/server.py` (currently disabled, port 8768)
- The PR review workflow uses Gemini API directly via `GOOGLE_AI_API_KEY` secret
- Model: `gemini-2.0-flash` (fast, strong on code critique)

### Labels Used
| Label | Meaning |
|-------|---------|
| `ai-reviewed` | AI review has been performed (dual-model) |
| `ai-approved` | Both Claude + Gemini approved |
| `ai-changes-requested` | One or both reviewers found issues |
| `ready-to-merge` | All checks passed, safe to merge |
| `do-not-merge` | Blocks auto-merge (human override) |
| `needs-human-review` | Pauses automation for manual review |

### Required Secrets
| Secret | Purpose |
|--------|---------|
| `ANTHROPIC_API_KEY` | Claude API — quick sanity review |
| `GOOGLE_AI_API_KEY` | Gemini API — mandatory HIL review gate |

## Additional Documentation

- `CLAUDE.md` - Comprehensive AI agent guidelines (833 lines)
- `AGENTS.md` - Agent architecture and coordination (524 lines)
- `DWS_SECURITY_STANDARD.md` - Security framework
- `DWS_BRAND_STANDARD.md` - UI/UX design standards
- `README.md` - Project overview and sales documentation

**When in doubt:** Check CLAUDE.md for detailed guidance on security, git workflows, and best practices.
