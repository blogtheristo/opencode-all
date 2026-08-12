# Project Instructions: dws6

This file contains foundational mandates for the `dws6` project. These instructions take absolute precedence over general defaults.

## Architecture
The project is a multi-faceted platform consisting of:
- **Backend API:** Located in `src/`.
- **Dashboards & Frontends:** Primary sites include `dws6.com/dashboard/`, `dws10.com/`, and `onelifetime.world/`.
- **Python Suite:** Located in `Firehorse/`.
- **MCP & Orchestration:** Located in `mcp-hub/` and `mcp-servers/`.
- **Data & Schema:** Managed via `supabase/migrations/`.
- **Sovereignty Layers:** Adheres to a 3-tier Sovereignty Map (Full EU, EU Operational, EU Region).

## Conventions
### Naming & Structure
- **Branch Naming:** Use patterns like `claude/<feature>-<id>`, `feature/<name>`, or `fix/<name>`.
- **Dual Folder Sync:** Changes to root folders of sites (`dws6.com/`, `dws10.com/`, `onelifetime.world/`, `lifetime.fi/`) must be mirrored to their `landing-pages/` counterparts in the same commit.
- **Legal Identity:** Use "Lifetime Oy" (Business ID: 0772407-9) in legal/contract docs.

### Formatting
- **Markdown:** Use `***` (not `---`) as delimiters for `VERSION AND AGENT HISTORY` blocks for Pandoc compatibility.
- **Images:** For standalone downloadable HTML (CVs, reports), embed images as Base64 data URLs.
- **Hamburger Menu:** Use the shared version at `shared-assets/nav/hamburger-menu.js`. Do not duplicate.

### Publishing
- **Blog posts — ABSOLUTE (CLAUDE.md Non-Negotiable Rule 13):** Never publish a blog entry the HIC has not read and approved. Any language, any site, translations, LSJ issues, cron-drafted posts. Write the full text to `docs/blog-drafts/<slug>.md`, show the HIC **one fenced code block** containing the whole text, then **stop and ask in that turn**. Publish only after an explicit approval about that post sets `Status: APPROVED`. Enforced by `.claude/hooks/blog-draft-gate.sh` in Claude Code; the rule binds on every surface, including ones where no hook runs. Rules: `docs/BLOG_STANDARD.md` §3.3.

### Technical Standards
- **Email:** Use Amazon SES (SMTP) only. **Never use Resend.**
- **Security:** Never commit secrets, credentials, PII, or live tokens. Use environment variables.
- **Types:** Maintain strict type safety across all changes.

## Workflows
### Command Environment
- **Windows:** Prefer PowerShell-first command examples (`.ps1`, `.\script.ps1`).

### Build & Test
- Standard sequence: `npm install`, `npm run build`, `npm test`.

### Git & Filesystem
- **Safety:** No destructive actions without explicit intent. Prefer renaming to `_OLD` over deletion.
- **Protection:** Never force push to protected branches.

### Maintenance
- **Thesis Updates:** If updating thesis documents (`docs/metropolia/...`, `docs/PHD_FIREHORSE_...`), update all four files (EN/FI for Master's/PhD) in lockstep.

## Subdirectory Instructions
- (Link to scoped GEMINI.md files in subdirectories here as they are created)

## Reference Standards
Refer to these "Source of Truth" documents for specific domain rules:
- `CLAUDE.md`: Core operating rules for AI agents.
- `DWS_STANDARDS_LIBRARY.md`: Registry of all regulatory, process, and security standards.
- `DWS_BRAND_STANDARD.md`: UI/UX, tokens, and visual identity.
- `DWS_SECURITY_STANDARD.md`: Security controls and implementation.
- `DWS_DEPLOYMENT_STANDARD.md`: Deployment strategies and manifests.
