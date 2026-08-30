# Windows 11 Claude Code Setup — Field Note

**Date:** 2026-08-29  
**Session:** claude/win11-claude-code-setup-hi72lr  
**Status:** Complete + Merge Conflict Resolved

## What Happened

Created comprehensive Windows 11 setup documentation for Claude Code with DWS6 bid-monitoring tools (Bid Scout agent + Tarjouspalvelu Fetcher). Merged competing version from main branch and resolved conflict by keeping the more complete feature-branch version.

### Deliverables Shipped

1. **`docs/WIN11_CLAUDE_CODE_SETUP.md` (v1.0, ~620 lines)**
   - Step-by-step setup: environment, dependencies, testing
   - Bid Scout agent documentation with scoring criteria (budget, geography, product fit, deadline)
   - Tarjouspalvelu Fetcher (Playwright-based login automation) walkthrough
   - Windows Scheduler task setup (PowerShell) for daily automation
   - **New:** Node.js 24.17.0+ version requirement + troubleshooting (3 upgrade methods: direct, nvm-windows, Chocolatey)
   - Troubleshooting matrix (npm, Playwright, .env, Cloudia API, Tarjouspalvelu login)
   - Daily workflow recommendations and advanced usage patterns
   - Full command reference, FAQ, email alerts example

2. **PR #1915** — Ready for review
   - Feature branch: `claude/win11-claude-code-setup-hi72lr`
   - Merged `origin/main` (resolved add/add conflict on WIN11_CLAUDE_CODE_SETUP.md)
   - Kept comprehensive version; discarded simpler main version

3. **Environment Verification**
   - Windows 11 Local: Node.js 24.19.0 ✅ (meets ≥24.17.0)
   - Docker/Remote: Node.js 24.20.0 ✅ (exceeds requirement)
   - npm install: No EBADENGINE warnings

### Commits (3)

| Commit   | Message                                                            | Status              |
| -------- | ------------------------------------------------------------------ | ------------------- |
| fb99eeae | feat: add Windows 11 Claude Code setup guide                       | Initial delivery    |
| 02c0678a | docs: add Node.js 24.17.0+ requirement and upgrade troubleshooting | Node version update |
| 59f8ac74 | Merge main: resolve WIN11_CLAUDE_CODE_SETUP.md conflict            | Conflict resolution |

## Why This Matters

### For Windows 11 Users

- **Removes setup friction:** Complete walkthrough from env setup to scheduled daily runs
- **Clear version baseline:** Node.js 24.19.0+ (was vague in earlier guidance)
- **Reproducible:** PowerShell scripts for task automation, not manual steps
- **Troubleshoot-ready:** Common errors + solutions (6-issue matrix)

### For DWS6 Operations

- **Bid Scout automation:** Daily Cloudia monitoring with scoring (budget €5k-€500k, score ≥60 = actionable)
- **Tarjouspalvelu integration:** Browser automation to extract opportunity details
- **Live credential path:** Documented .env setup, no hardcoded secrets
- **Scheduled daily:** 08:00 UTC automated run via Windows Task Scheduler

## Key Design Decisions

1. **Windows-native PowerShell:** No bash/zsh examples (Rule 10, CLAUDE.md)
2. **Node version handling:** Documented requirement (24.17.0+) + upgrade methods (direct, nvm-windows, Chocolatey) because earlier guidance was Node 18+
3. **Merge strategy:** Kept feature-branch comprehensive version over main's simpler version (includes all main content + Node troubleshooting)
4. **Fail-safe tone:** Every error includes solutions; no "RTFM" barriers

## Assumptions & Constraints

**Assumptions:**

- User can run PowerShell as Administrator (task scheduling)
- Cloudia and Tarjouspalvelu credentials available
- Internet connectivity to download Playwright Chromium

**Constraints:**

- Docker/remote environments have Node 20-22; Windows 11 can install Node 24.19.0+ directly
- Playwright requires Chromium download (2-3 min first run)
- Scheduled tasks require Windows Task Scheduler (not cross-platform)

## Next Steps

### Ready Now

- [ ] HIC review of PR #1915
- [ ] Test on Windows 11 machine with live Cloudia credentials
- [ ] Validate scheduled task PowerShell script

### Optional Future

- [ ] Video walkthrough (YouTube)
- [ ] Screenshots/GIFs for mobile readability
- [ ] Email alert integration example (Gmail/SES)
- [ ] Proxy support (corporate network edge case)

## Technical Debt Flagged

1. **Playwright Chromium behind proxy:** Documented workaround but untested on corporate network
2. **Tarjouspalvelu timeout:** hardcoded 15s; may need tuning per network
3. **Node version matrix:** Should track Node 22 vs 24 support in CI/docker-compose

## Related Files

- `scripts/bid-scout.mjs` — Live Cloudia bid monitoring (Evidence: Tool=Claude-Code Date=2026-08-27)
- `scripts/tarjouspalvelu-fetch.mjs` — Playwright tarjouspalvelu.fi fetcher (Evidence: Tool=Claude-Code Date=2026-08-27)
- `.claude/handoffs/claude/win11-claude-code-setup-hi72lr.md` — Session checkpoint
- PR #1915 — https://github.com/blogtheristo/dws6/pull/1915

## Standards Applied

✅ **Checked:**

- DWS_DOCUMENT_STANDARD.md — Markdown conventions
- Non-Negotiable Rule 10 — PowerShell-first Windows examples
- Non-Negotiable Rule 11 — Match codebase conventions
- Engineering Discipline Rule 3 — Surgical changes (only WIN11 guide + Node troubleshooting)

❌ **Not Triggered:**

- Thesis Rule (not a thesis document)
- BLOG_STANDARD.md (not a blog post)
- Security Standard (no secrets in docs)

---

## HIC Question

**Decision needed:** Should the Windows 11 setup guide be published to the public docs site (`dws6.com/docs/`), or kept internal-only in the repo README for now?

**Trade-offs:**

- **Publish:** Makes setup discoverable for external Claude Code users; signals Windows 11 support readiness
- **Internal-only:** Allows testing with real Cloudia credentials before public launch; avoids outdated docs if Node version requirements shift

What's the right timing for publication?
