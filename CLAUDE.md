# CLAUDE.md

This file provides guidance for Claude Code (AI) when working with the DWS6 codebase.

## Required Reading (Design & Document Standards)

Before making any UI changes, agents MUST consult these files:

| Standard | File | Scope |
|----------|------|-------|
| **Brand Standard** | `DWS_BRAND_STANDARD.md` | Store UI, hamburger menu, product cards, category nav, dark tokens, sovereignty badges |
| **Document Standard** | `DWS_DOCUMENT_STANDARD.md` | Document formatting, sections, metadata |
| **Gamma UI Guidelines** | `UI_SKILLS_GAMMA.md` | Tailwind, Radix UI, accessibility, animations |
| **Security Standard** | `DWS_SECURITY_STANDARD.md` | AI safety, enterprise security framework |
| **Security Compliance** | `Admin/SECURITY_COMPLIANCE.md` | Deployment, controls, certifications, vendor risk |
| **Market Research Standard** | `DWS_MARKET_RESEARCH_STANDARD.md` | Competitive intelligence, product improvement, data collection |
| **Site Quality Standards** | `SITE_QUALITY_STANDARDS.md` | Code quality, components, nav, logos, CTA, testing |
| **Cloud Environments** | `docs/CLOUD_ENVIRONMENTS.md` | US/EU/Aiwen clouds, account structure, DWS 6→7 migration, data residency |
| **Product Catalog** | `product-catalog/README.md` | Product catalog structure, Store Product Format, Google Merchant fields |

**Rule:** These standards apply equally to all tools — Claude Code, Cursor, VS Code, Codex, and human developers. No exceptions.

### Store Product Format Rule (CRITICAL)

Files in `Store/` are **store products** consumed by the build pipeline (`scripts/build_store.py`). They use **YAML frontmatter** — NOT the DWS Document Standard header.

| Location | Format | Header Style |
|----------|--------|-------------|
| `Store/*.md` | Store Product Format | YAML frontmatter (`title`, `price`, `sku`) |
| `dws10.com/config/products.json` | Primary product source | JSON (all ~30 products) |
| Everything else | DWS Document Standard | VERSION AND AGENT HISTORY block |

**Never put DWS Document Standard headers in `Store/*.md` files.** The YAML parser will fail and the product will be excluded from the Google Merchant feed, store page, and product pages.

### "Use DWS Standard" Rule (CRITICAL)

When the human says **"Use DWS standard"** (or any variation like "with DWS standards", "follow DWS standards"), this is a shorthand that means:

1. **Apply ALL relevant standards from the table above** — not just one. Evaluate which standards apply to the task and follow every one that is relevant.
2. **Update the standards themselves** if the work adds new products, features, security controls, or brand elements. Standards are living documents that must grow with the platform.
3. **Ensure market-value readiness** — every product artifact must be complete enough to sell: Google Merchant JSON, product specification, store listing, competitive positioning, and pricing.
4. **Ensure security coverage** — every new feature must have security controls documented in the relevant security standard.
5. **Nurture, don't just comply** — proactively improve standards when gaps are found. If a standard is missing coverage for what you're building, add it.

**Example:** "Create a new product with DWS standard" means:
- `dws10.com/config/products.json` → Add product entry (primary source: name, price, SKU, category, image, description)
- `Store/*.md` → Optionally create extended product page with **Store Product Format** (YAML frontmatter, NOT DWS Document Standard)
- `DWS_BRAND_STANDARD.md` → Add to store category, product card, correct badges
- `DWS_MARKET_RESEARCH_STANDARD.md` → Define competitor set, create competitive analysis
- `Admin/SECURITY_COMPLIANCE.md` → Document security controls for the product
- `product-catalog/` → Create product-specification.md + google-merchant-product.json (for enterprise/NVIDIA products)

**This is not optional.** Delivering work without updating relevant standards is incomplete work.

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

#### 5. Phasing Discipline (Ship First, Harden Later)

Do not get pulled into hardening, edge-case handling, or nitty-gritty polish before the core system works end-to-end. Perfecting a cleanup script while the actual product sits undeployed is a failure mode.

**Phase order:**
1. **Ship**: Get the system running (API, email, webhook, scheduler)
2. **Verify**: Confirm it works with real data
3. **Harden**: Then add fail-fast guards, token targeting, idempotency

When a reviewer (human or AI) suggests hardening, ask: "Is the core system delivered yet?" If no, push back and ship first. Hardening undeployed code is wasted work if requirements change.

#### 6. Scope Discipline

Touch only what you're asked to touch.

**Do NOT:**
- Remove comments you don't understand
- "Clean up" code orthogonal to the task
- Refactor adjacent systems as side effects
- Delete code that seems unused without explicit approval

Your job is surgical precision, not unsolicited renovation.

#### 7. Dead Code Hygiene

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

## Email Rules (CRITICAL)

- **NEVER use `noreply@` addresses.** All emails must be sent from a real, replyable address.
- **Default sender:** `risto@onelifetime.world` (verified domain in Resend)
- **Default recipient:** `risto@lifetime.fi`
- **Verified domain:** `onelifetime.world` — this is the only domain configured in Resend. Do NOT use `dws6.com` or any other domain as a sender.
- When adding new email-sending code, always use `process.env.EMAIL_FROM || 'risto@onelifetime.world'` as the sender fallback.

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
└── .github/workflows/      # CI/CD pipelines (15 workflows)
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

### Store Update Rule (CRITICAL)

When modifying the store page (`buy/index.html`), product pages, `products.json`, or any store-related assets, you MUST follow this checklist **in every commit**:

1. **Update root first** — Edit `dws10.com/buy/index.html` (source of truth)
2. **Sync to landing-pages immediately** — Copy to `landing-pages/dws10-com/buy/index.html` in the **same commit**
3. **Sync config** — If `dws10.com/config/products.json` changed, copy to `landing-pages/dws10-com/config/products.json`
4. **Sync shared assets** — If `shared-assets/` files changed (nav, vat-locale), copy to `landing-pages/dws10-com/shared-assets/`
5. **Sync subpages** — If category pages (`buy/page2/`, `page3/`, `page4/`) changed, copy all to landing-pages
6. **Verify paths** — All relative paths (`../config/`, `../shared-assets/`, `../static/`) must resolve in both locations

**Why this is critical:** Cloudflare Pages serves from `landing-pages/`. If you only update `dws10.com/`, the live site stays on the old version. This has caused production incidents.

**Verification command:**
```bash
diff dws10.com/buy/index.html landing-pages/dws10-com/buy/index.html
# Must return empty (no differences)
```

**This rule applies to ALL store artifacts:**
- `buy/index.html` and `buy/page*/index.html`
- `config/products.json`
- `products//*.html` (individual product pages)
- `shared-assets/` (nav, vat-locale)
- `feeds/` (Google Merchant feed)
- Static images referenced by products

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

### 4. Claude Code Worktree Workflow (Recommended)

**Git worktree is the recommended workflow for parallel Claude Code sessions.**

Based on [Daniel San's workflow](https://x.com/dani_avila7) combining Ghostty + Worktrees + Lazygit for seamless multitasking with Claude Code.

#### Why Worktrees for Claude Code?

- Run multiple Claude Code sessions simultaneously (feature + bugfix + refactor)
- Each session maintains its own context without branch switching
- Shared `.gitignore` prevents accidental credential commits
- Symlinked `.venv` avoids duplicating 500MB+ virtual environments

#### Quick Start

**Windows (PowerShell):**
```powershell
# Create new worktree with proper setup
.\scripts\New-ClaudeWorktree.ps1 -BranchName "feature-auth" -LaunchClaude

# Or step by step:
.\scripts\New-ClaudeWorktree.ps1 -BranchName "fix-api-bug" -BaseBranch "develop"
cd "C:\Users\$env:USERNAME\.claude-worktrees\dws6\fix-api-bug"
claude
```

**Linux/macOS/Chromebook/iOS (Bash):**
```bash
# Create new worktree with proper setup
./scripts/new-claude-worktree.sh feature-auth --launch-claude

# Or step by step:
./scripts/new-claude-worktree.sh fix-api-bug develop
cd ~/.claude-worktrees/dws6/fix-api-bug
claude
```

#### What the Scripts Handle Automatically

1. **Creates git worktree** in standardized location
2. **Verifies .gitignore** inheritance (critical security patterns)
3. **Symlinks .venv** from main repo (saves disk space, consistent dependencies)
4. **Copies config files** (.env, .env.mcp, .claude/)
5. **Optionally launches Claude Code** in the new worktree

#### Worktree Locations by Environment

| Environment | Worktree Root |
|-------------|---------------|
| Windows | Adjacent to main repo: `F:\2026\Repos2026\.claude-worktrees\dws6\` |
| macOS | `~/.claude-worktrees/dws6/` |
| Linux/Chromebook | Adjacent to main repo: `../.claude-worktrees/dws6/` |
| iOS (iSH/a-Shell) | `~/.claude-worktrees/dws6/` |

#### Security: What's Shared vs. Copied

| File/Folder | Behavior | Reason |
|-------------|----------|--------|
| `.gitignore` | **Shared** (inherited) | All worktrees use same ignore rules |
| `.venv/` | **Symlinked** | Saves space, consistent packages |
| `.env` | **Copied** | May need worktree-specific values |
| `.env.mcp` | **Copied** | API keys for MCP servers |
| `.claude/` | **Copied** | Session-specific Claude settings |
| `node_modules/` | **Not shared** | Run `npm install` per worktree |

#### Manual Worktree Commands

```bash
# List all worktrees
git worktree list

# Remove worktree when done (from main repo)
git worktree remove /path/to/worktree
git worktree prune

# Emergency: Force remove stuck worktree
git worktree remove --force /path/to/worktree
```

#### Claude Session Data Backup (CRITICAL)

**NEVER delete worktrees without backing up Claude session data first!**

Claude Code sessions contain valuable trained agents, commands, skills, and settings that are NOT committed to Git. Each worktree has its own `.claude/` directory with session-specific data.

##### Daily Automated Backup
- **GitHub Actions**: Runs daily at 6:00 AM UTC
- **Location**: `.github/workflows/daily-claude-backup.yml`
- **Storage**: Creates `sessions-backup` branch with timestamped archives

##### Manual Backup
```powershell
# Run backup script
.\scripts\Backup-ClaudeSessions.ps1

# Or manually backup specific worktree
cp -r /path/to/worktree/.claude /safe/backup/location/
```

##### What Gets Backed Up
- `agents/` - Custom Claude agents
- `commands/` - Custom commands and macros
- `hooks/` - Automation hooks
- `skills/` - Trained Claude capabilities
- `settings.local.json` - Session preferences

##### Before Deleting Worktrees
1. **Backup session data** using the script above
2. **Verify no active Claude sessions** are running in the worktree
3. **Document what the worktree contained** for future reference
4. **Only then** safely remove the worktree

#### Security Checklist (Automated by Scripts)

The scripts verify these automatically, but for manual worktrees:

- [ ] `.gitignore` contains: `.env`, `.venv/`, `*.secret`, `*.key`
- [ ] `.env` files are copied (not symlinked) to allow worktree-specific values
- [ ] Run `git status` before first commit to verify no sensitive files staged
- [ ] `.venv` symlink points to main repo's virtual environment

#### Activating Python Environment in Worktrees

**Windows:**
```powershell
# If symlink works:
. .venv\Scripts\Activate.ps1

# If symlink failed (no admin/Developer Mode):
. F:\2026\Repos2026\dws6\.venv\Scripts\Activate.ps1
```

**Linux/macOS:**
```bash
source .venv/bin/activate
```

#### Using Worktrees with VS Code and Cursor

**Opening a worktree in VS Code:**
```powershell
# Navigate to worktree and open in VS Code
cd F:\2026\Repos2026\.claude-worktrees\dws6\your-branch
code .
```

**Opening a worktree in Cursor:**
```powershell
# Navigate to worktree and open in Cursor
cd F:\2026\Repos2026\.claude-worktrees\dws6\your-branch
cursor .
```

**VS Code/Cursor Workspace Settings:**
Each worktree can have its own `.vscode/settings.json` for workspace-specific settings.

**Important: Never manually create git repos in worktree folders!**
If you see "Initialize Repository" prompts in VS Code/Cursor, **do NOT click them**. Worktrees already share the main repo's git configuration.

#### Troubleshooting Broken Worktrees

If a worktree shows unexpected files (like user home directory files) in `git status`:

```powershell
# 1. Check if it's a proper worktree
cat .git  # Should show: gitdir: F:/2026/Repos2026/dws6/.git/worktrees/<name>

# 2. If it shows a folder (.git/) instead of file, it's broken - remove it:
Remove-Item -Recurse -Force "path/to/broken/worktree"

# 3. Prune orphaned references
cd F:\2026\Repos2026\dws6
git worktree prune

# 4. Recreate properly using the script
.\scripts\New-ClaudeWorktree.ps1 -BranchName "your-branch"
```

**CRITICAL: Windows Worktree Location**
On Windows, worktrees MUST be created on F: drive (or the same drive as main repo), NEVER in `C:\Users\`. The script enforces this automatically, but if creating manually, always use:
- ✅ `F:\2026\Repos2026\.claude-worktrees\dws6\`
- ❌ `C:\Users\risto\.claude-worktrees\dws6\` (AVOID - causes security issues)

#### Windows Managed Settings Path Change

**Effective March 11, 2026**, Claude Code on Windows will no longer read managed settings from the legacy path. Update any deployment scripts or documentation that reference the old path.

| | Path |
|---|---|
| **Old (deprecated)** | `C:\ProgramData\ClaudeCode\managed-settings.json` |
| **New** | `C:\Program Files\ClaudeCode\managed-settings.json` |

The new path is already supported as of **Claude Code 2.0.58**. If you are running 2.0.58 or later, you can migrate immediately. After March 11, 2026, the old path will be ignored entirely.

#### References

- [Daniel San's Ghostty + Worktrees workflow](https://x.com/dani_avila7)
- [Git Worktrees with pyenv](https://huonw.github.io/blog/2020/04/worktrees-and-pyenv/)
- [Git Worktrees with Claude Code Guide](https://www.geeky-gadgets.com/how-to-use-git-worktrees-with-claude-code-for-seamless-multitasking/)
- [Mastering Git Worktrees for Parallel Development](https://medium.com/@dtunai/mastering-git-worktrees-with-claude-code-for-parallel-development-workflow-41dc91e645fe)

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

### Admin Folder

The `Admin/` folder is tracked in GitHub and contains admin manuals, security
documentation, and operational guides. All admin documentation follows the
DWS Document Standard (see `DWS_DOCUMENT_STANDARD.md`).

**Security rules still apply:**
- Never commit secrets, credentials, or API keys in Admin/ files
- Sensitive operational data (customer details, financial records) stays in ProtonDrive
- CI/CD reports go to `security-reports/` (not Admin/)
- Review Admin/ files before committing to ensure no PII or credentials are included

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

> **Full cloud environment documentation:** `docs/CLOUD_ENVIRONMENTS.md`

### Cloud Accounts

| Account | Email / ID | Scope |
|---------|-----------|-------|
| **Pilot / EU Cloud** | `risto.paarni2024@lifetime.fi` | GCP, Supabase, backend, AI agents, development |
| **US Public Cloud** | dws6.com (Cloudflare) | Public sites, CDN, edge workers, DNS |

### Cloud Environments

| Environment | Provider | Region | Purpose |
|-------------|----------|--------|---------|
| **US Cloud (Public)** | Cloudflare Pages/Workers | Global | Landing pages, dashboard SPA, edge API |
| **EU Cloud (Backend)** | Google Cloud Run + Supabase | europe-north1 (Finland) | Backend API, AI agents, database, auth |
| **Aiwen (EU AI Act)** | EU Cloud overlay | EU-only | Article 12 logging, reasoning lineage, audit trails |
| **Hetzner (V3)** | Hetzner Helsinki | Finland | Jitsi Meet, email service (Firehorse V3) |

### Deployment Targets
- **Primary**: Google Cloud Run (europe-north1) + Groq
- **Edge**: Cloudflare Workers (dws6.com, dws10.com)
- **Data**: Supabase (EU-hosted)
- **Edge AI**: NVIDIA Jetson Orin Nano
- **Orchestration**: Temporal.io
- **Backup**: Scaleway Serverless (fr-par)
- **V3 Infra**: Hetzner Helsinki (Jitsi + Email)

## Documentation

Key documentation files:
- `README.md` - Project overview
- `docs/CLOUD_ENVIRONMENTS.md` - Cloud environments, accounts, DWS 6→7 migration
- `DWS7_ROADMAP.md` - DWS 7 production roadmap (247 PRs)
- `ADMIN_MANUAL_*.md` - Administration guides
- `SECURITY_COMPLIANCE.md` - Security documentation
- `Firehorse/` directory - Product documentation

## Git Workflow

- Main development on feature branches
- Branch naming: `claude/<feature>-<id>` for AI-assisted work
- PR-based workflow with automated security checks
- 15 CI/CD workflows in `.github/workflows/`

### Branch Auto-Deletion After Merge (CRITICAL)

**GitHub is configured to automatically delete branches after PR merge.** This means:

1. After a PR is merged, the feature branch (e.g., `claude/update-store-hero-section-N2Hw2`) is **deleted on the remote** by GitHub
2. **Do NOT** try to push to the same branch name for a new PR — it will need to be recreated
3. When continuing work on a deleted branch:
   - Fetch latest main: `git fetch origin main`
   - Rebase local branch onto main: `git rebase origin/main`
   - Force-push to recreate the branch: `git push -u origin <branch-name> --force`
4. **GitHub compare links break** after branch deletion — `"There isn't anything to compare"` error is expected
5. After recreating and pushing, create a **new PR** — the old PR number is closed

**Workflow for continued work after merge:**
```bash
git fetch origin main
git rebase origin/main
git push -u origin claude/<feature>-<id> --force
# Then create new PR via GitHub UI or gh CLI
```

### Worktree Best Practices

**Git worktree is now the RECOMMENDED workflow** for parallel Claude Code sessions.

The January 2026 security incident was caused by manual worktree creation without proper config file handling. The new automated scripts (`New-ClaudeWorktree.ps1` / `new-claude-worktree.sh`) prevent these issues by:

1. **Verifying .gitignore** - Checks for critical security patterns before creating worktree
2. **Copying .env files** - Each worktree gets its own copy (not shared/symlinked)
3. **Symlinking .venv** - Safe because venv is already gitignored
4. **Standardized locations** - Worktrees go to `~/.claude-worktrees/dws6/` (not random folders)

**DO NOT create worktrees manually.** Always use the provided scripts:
```bash
# Windows
.\scripts\New-ClaudeWorktree.ps1 -BranchName "your-branch"

# Linux/macOS/Chromebook
./scripts/new-claude-worktree.sh your-branch
```

See [Section 4: Claude Code Worktree Workflow](#4-claude-code-worktree-workflow-recommended) for full documentation.

### PR Creation: Claude Code Sessions vs. Terminal

**Use Claude Code sessions for PRs when:**
- Actively working in that worktree (better change context)
- Reviewing and finalizing code before PR
- Writing PR descriptions (Claude has full context of changes)

**Use terminal/command-line for PRs when:**
- Batch-creating multiple PRs at once
- Administrative tasks on branches without active Claude sessions
- Quick PRs for simple, self-explanatory changes

**Recommended workflow for active worktrees:**
1. Switch to the worktree's Claude session
2. Review and finalize changes in that session
3. Create PR from within Claude — it has better context

For worktrees without an active Claude session, use `gh pr create` directly from the terminal.

### Session Environment Detection (CRITICAL)

Sessions typically move across environments: mobile → Win11 → Chromebook → Win11 PR.

#### Quick Environment Switch (Preferred)

The user can tell Claude the current environment by including a keyword in their message:

| Keyword | Meaning | Claude adjusts to |
|---------|---------|-------------------|
| `win` or `win11` | Windows 11 desktop | Full tooling: `gh`, PowerShell, VS Code/Cursor |
| `mobile` | Mobile/web session | No `gh`, no PowerShell, compare-link PRs only |
| `chromebook` | Chromebook (Linux) | Bash tools, `gh` may be available, no PowerShell |
| `vscode` | Editing in VS Code | Expect external file changes from user |
| `cursor` | Editing in Cursor | Expect external file changes from user |

Keywords can be combined: `win vscode` = Windows 11 + VS Code.

**IMPORTANT:** These are plain-text keywords in a message, NOT slash commands. Do NOT use `/win` as a standalone command — Claude Code will try to find a skill called "win" and fail. Instead, include the keyword in a regular message:
- **Good:** `win11 — updating the admin manual`
- **Good:** `mobile — push this branch`
- **Bad:** `/win` (triggers skill lookup error)

When the user provides a keyword, Claude should acknowledge it briefly and adjust behavior. When no keyword is given, fall back to auto-detection.

#### Auto-Detection (Fallback)

If the user hasn't specified, run these checks at session start:

| Check | Command | Mobile | Win11 Desktop | Chromebook |
|-------|---------|--------|---------------|------------|
| Git remote | `git remote get-url origin` | Contains `local_proxy@127.0.0.1` | Contains `github.com` | Contains `github.com` |
| Platform | System platform | `linux` (cloud container) | `win32` / `MINGW64_NT` | `linux` (native) |
| `gh` CLI | `gh --version` | Not found | Available | May be available (`apt install gh`) |
| Hostname | `hostname` | Cloud hostname | `5MGMT7FI` | Chromebook hostname |
| Shell | `$SHELL` or `$PSVersionTable` | bash (cloud) | PowerShell / Git Bash | bash / zsh |

**Key distinction:** Mobile has `local_proxy` in git remote. Chromebook has `github.com` remote but runs native Linux (not `MINGW64_NT`).

#### Environment Profiles

**Mobile/Web Session** (detected by `local_proxy` in git remote):
- `gh` CLI — **not available, never will be. Do NOT attempt to use it.**
- `GITHUB_TOKEN`, `GH_TOKEN` — not available
- `conda`, system package managers — cannot install `gh`
- Interactive tools (`vim`, `nano`, `less`) — not available
- **Available:** `git push/pull/fetch`, file tools, `npm`, `node`, `python3`, `curl`, standard bash

**Windows 11 Desktop** (detected by `github.com` remote + `win32`/`MINGW64_NT` platform):
- `gh` CLI — available for PRs and GitHub operations
- Full Git access via HTTPS
- PowerShell scripts — available
- **Available:** everything

**Chromebook** (detected by `github.com` remote + native `linux` platform):
- `gh` CLI — may be available (install via `apt`)
- Git access via HTTPS
- Bash scripts — available
- PowerShell — not available (use bash equivalents)
- **Available:** `git`, `npm`, `node`, `python3`, `curl`, standard Linux tools

#### Editor Context

The same environment may use different editors. Claude cannot reliably auto-detect the editor, but the user may specify it.

| Editor | How Claude is invoked | Notes |
|--------|----------------------|-------|
| **Claude Code CLI** | Terminal / standalone | Full Claude Code session with all tools |
| **VS Code** | Claude Code extension or terminal | File edits may come from user in VS Code directly |
| **Cursor** | Claude Code extension or terminal | Similar to VS Code; AI-native editor |

When the user edits files directly in VS Code or Cursor (not via Claude), those changes appear as external modifications. Claude should treat them as intentional and not revert them.

#### Session Announcement Convention

When the user indicates they are on **win**, **mobile**, or **chromebook** (for example by typing "win", "mobile", or "chromebook" without a leading slash), or Claude auto-detects, acknowledge briefly:

```
SESSION: [Mobile/Win11/Chromebook] | Editor: [Claude Code/VS Code/Cursor] | Branch: [branch-name] | Worktree: [worktree-name]
```

This helps track which environment and editor produced which changes. Keep it to one line — don't over-explain.

#### Mobile Session PR Workflow

When the user asks to create a PR from a **mobile session:**
1. **Do NOT** try `gh pr create` — it will fail
2. **Do NOT** try to install `gh` — it will fail
3. **Do NOT** try GitHub API calls with Python/curl — no token available
4. **DO** push the branch with `git push -u origin <branch>`
5. **DO** provide the GitHub compare URL immediately:
   `https://github.com/blogtheristo/dws6/compare/main...<branch-name>`
6. **DO** provide the PR title and body as copyable text

**Rule:** Go straight to the compare link. Zero attempts at `gh` or API calls. Every failed attempt wastes the user's time.

#### Typical Multi-Environment Workflow

A single feature branch often passes through multiple environments and editors:

```
1. Mobile        → Start work, draft changes, push branch
2. Win11 + VS Code → Review code, refine, run tests
3. Chromebook    → Quick fixes on the go
4. Mobile        → Documentation updates
5. Win11 + Cursor → Final review, create PR via gh or Claude Code
```

Commit messages should reflect the environment when helpful:
```
feat: add session backup docs (Win11/VS Code)
fix: typo in backup section (mobile)
docs: update admin manual (Chromebook)
```
