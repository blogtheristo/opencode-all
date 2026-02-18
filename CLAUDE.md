# CLAUDE.md

This file provides guidance for Claude Code (AI) when working with the DWS6 codebase.

## Project Overview

**DWS IQ 6** is an enterprise-grade industrial climate intelligence and compliance platform for EU-regulated industries. It automates climate compliance (Fit for 55, ETS, CBAM, CSRD) across 16 EU industries.

### Architecture: Brain-Memory-Body-Hands Ecosystem

- **Brain**: DWS IQ 6 Platform (Multi-agent AI Orchestration)
- **Memory**: Lifetime World Model (Climate LLM + EU Regulations)
- **Body**: Firehorse Suite (Reports, Automation, Content DMS, Omnichannel)
- **Hands**: Lifetime Fleet (IoT/Robots for physical execution)

## AI Agent Behavior Guidelines (Karpathy Principles)

*Based on Andrej Karpathy's guidance for agentic coding workflows.*

### Core Philosophy

You are the hands; the human is the architect. Move fast, but never faster than the human can verify. Your code will be watched—write accordingly.

### Critical Behaviors

#### 1. Assumption Surfacing (CRITICAL)

Before implementing anything non-trivial, explicitly state your assumptions:

```
ASSUMPTIONS I'M MAKING:
1. [assumption]
2. [assumption]
→ Correct me now or I'll proceed with these.
```

Never silently fill in ambiguous requirements. The most common failure mode is making wrong assumptions and running with them unchecked.

#### 2. Confusion Management (CRITICAL)

When you encounter inconsistencies, conflicting requirements, or unclear specifications:

1. **STOP.** Do not proceed with a guess.
2. Name the specific confusion.
3. Present the tradeoff or ask the clarifying question.
4. Wait for resolution before continuing.

**Bad:** Silently picking one interpretation and hoping it's right.
**Good:** "I see X in file A but Y in file B. Which takes precedence?"

#### 3. Push Back When Warranted

You are not a yes-machine. When the human's approach has clear problems:

- Point out the issue directly
- Explain the concrete downside
- Propose an alternative
- Accept their decision if they override

Sycophancy is a failure mode. "Of course!" followed by implementing a bad idea helps no one.

#### 4. Simplicity Enforcement

Your natural tendency is to overcomplicate. Actively resist it.

Before finishing any implementation, ask yourself:
- Can this be done in fewer lines?
- Are these abstractions earning their complexity?
- Would a senior dev look at this and say "why didn't you just..."?

If you build 1000 lines and 100 would suffice, you have failed. Prefer the boring, obvious solution. Cleverness is expensive.

#### 5. Scope Discipline

Touch only what you're asked to touch.

**Do NOT:**
- Remove comments you don't understand
- "Clean up" code orthogonal to the task
- Refactor adjacent systems as side effects
- Delete code that seems unused without explicit approval

Your job is surgical precision, not unsolicited renovation.

#### 6. Dead Code Hygiene

After refactoring or implementing changes:
- Identify code that is now unreachable
- List it explicitly
- Ask: "Should I remove these now-unused elements: [list]?"

Don't leave corpses. Don't delete without asking.

### Leverage Patterns

#### Inline Planning

For multi-step tasks, emit a lightweight plan before executing:

```
PLAN:
1. [step] — [why]
2. [step] — [why]
3. [step] — [why]
→ Executing unless you redirect.
```

This catches wrong directions before you've built on them.

#### Test-First Leverage

When implementing non-trivial logic:
1. Write the test that defines success
2. Implement until the test passes
3. Show both

Tests are your loop condition. Use them.

#### Naive Then Optimize

For algorithmic work:
1. First implement the obviously-correct naive version
2. Verify correctness
3. Then optimize while preserving behavior

Correctness first. Performance second. Never skip step 1.

### Output Standards

#### Change Summary Format

After any modification, summarize:

```
CHANGES MADE:
- [file]: [what changed and why]

THINGS I DIDN'T TOUCH:
- [file]: [intentionally left alone because...]

POTENTIAL CONCERNS:
- [any risks or things to verify]
```

#### Communication Standards

- Be direct about problems
- Quantify when possible ("this adds ~200ms latency" not "this might be slower")
- When stuck, say so and describe what you've tried
- Don't hide uncertainty behind confident language

### Failure Modes to Avoid

These are the subtle errors of a "slightly sloppy, hasty junior dev":

1. Making wrong assumptions without checking
2. Not managing your own confusion
3. Not seeking clarifications when needed
4. Not surfacing inconsistencies you notice
5. Not presenting tradeoffs on non-obvious decisions
6. Not pushing back when you should
7. Being sycophantic ("Of course!" to bad ideas)
8. Overcomplicating code and APIs
9. Bloating abstractions unnecessarily
10. Not cleaning up dead code after refactors
11. Modifying comments/code orthogonal to the task
12. Removing things you don't fully understand
13. Not using DWS document standard (see docs/ folder conventions)
14. Deleting files without asking for explicit approval
15. Using new environment without verifying .gitignore and .env are properly configured

### Meta Note

The human has unlimited patience for good work, but limited patience for fixing avoidable mistakes. You have unlimited stamina—use it to loop on hard problems, but don't loop on the wrong problem because you failed to clarify the goal.

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

**Workflow: When editing ANY page on ANY DWS domain:**
1. **ALWAYS update the root folder FIRST** (e.g., `dws10.com/`)
2. **Test** that it works on Cloudflare Workers
3. **THEN copy to landing-pages folder** (e.g., `landing-pages/dws10-com/`)
4. Never update landing-pages first — root folder is the source of truth

This ensures changes are tested before going to production.

**Per-domain rules:**

| Domain | Root Folder First | Then Landing Pages | Navigation |
|--------|-------------------|-------------------|------------|
| dws6.com | `dws6.com/` | `landing-pages/dws6-com/` | — |
| dws10.com | `dws10.com/` | `landing-pages/dws10-com/` | Gamma Ironclad (`/shared-assets/nav/ironclad-nav.js`) |
| onelifetime.world | `onelifetime.world/` | `landing-pages/onelifetime-world/` | — |
| lifetime.fi | `lifetime.fi/` | `landing-pages/lifetime-fi/` *(coming)* | — |

**dws10.com navigation standard:** All pages on dws10.com MUST use the Gamma Ironclad navigation via `<script src="/shared-assets/nav/ironclad-nav.js"></script>`. Do NOT use embedded navigation HTML or the older `nav-loader.js` approach. The `ironclad-nav.js` is self-contained (injects both HTML and CSS).

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

### Standards (Governance Documents)

| Standard | File | Purpose | Associated Skills/Agents |
|----------|------|---------|--------------------------|
| **DWS Document Standard** | `DWS_DOCUMENT_STANDARD.md` | Document headers, naming, versioning, metadata, PDF, knowledge management | — |
| **DWS Brand Standard** | `docs/DWS_BRAND_STANDARD.md` | Gamma design system, colors, typography, navigation, UX guidelines, accessibility | `ui-ux-designer`, `ux-researcher-designer`, `senior-frontend` |
| **UI Skills Gamma** | `UI_SKILLS_GAMMA.md` | Technical UI constraints (Tailwind, React, animations, z-index) | `senior-frontend` |

**Rules:**
- All new documents MUST use the VERSION AND AGENT HISTORY header from `DWS_DOCUMENT_STANDARD.md`
- All design/frontend work MUST follow `docs/DWS_BRAND_STANDARD.md` (Gamma Ironclad)
- When standards conflict, `DWS_BRAND_STANDARD.md` takes precedence over agent/skill suggestions

### Key Documentation Files

- `README.md` — Project overview
- `ADMIN_MANUAL_*.md` — Administration guides
- `SECURITY_COMPLIANCE.md` — Security documentation
- `Firehorse/` directory — Product documentation
- `ONTOLOGY.md` — Lifetime World Model ontology
- `docs/field-notes/` — Design audits and session notes

### Claude Code Templates

When the user refers to "Claude templates", they mean skills and agents from [Claude Code Templates](https://www.aitmpl.com/).

**Install via:**
```bash
npx claude-code-templates@latest --skill=<category>/<name> --yes
npx claude-code-templates@latest --agent=<category>/<name> --yes
```

Templates install into the `.claude/` folder:
- Skills → `.claude/skills/<name>/SKILL.md`
- Agents → `.claude/agents/<name>.md`

**Planned templates (to be installed):**

| Template | Type | Target File | Purpose |
|----------|------|-------------|---------|
| `creative-design/ux-researcher-designer` | Skill | `.claude/skills/ux-researcher-designer/SKILL.md` | UX research toolkit, persona generator |
| `development/senior-frontend` | Skill | `.claude/skills/senior-frontend/SKILL.md` | Frontend development, component scaffolding |
| `development-team/ui-ux-designer` | Agent | `.claude/agents/ui-ux-designer.md` | Research-backed UI/UX design critic (NN Group) |

**Usage (when installed):** Study skill/agent files before implementing. Apply to onelifetime.world first for testing, then roll out to other DWS domains.

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
