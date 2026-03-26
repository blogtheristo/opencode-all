# Field Note: Post-Incident Security Reset & CLI-First Migration

**Date:** 2026-03-26
**Author:** Claude Opus 4.6 + Risto Paarni
**Status:** Implemented
**Branch:** claude/objective-merkle

---

## Incident Summary

Suspected environment hijack via Cursor.ai MCP servers ("Clawdbot"). Symptoms observed over ~3 weeks:
- Black screen on Cursor.exe startup
- Cursor.exe disappeared from default install path
- Docker containers in unhealthy/restart-loop state (dws-carbon-mcp, alert-router)
- Suspicious scheduled tasks referencing deleted executables
- 77 orphaned git worktrees causing context confusion

## Actions Taken

### 1. Docker Environment Nuked
`docker system prune -a --volumes -f` executed prior to this session. All Docker images, containers, volumes removed.

### 2. Git Worktree Cleanup
- **Before:** 77 worktrees (31 stale on commit 28d6d866, never diverged)
- **After:** 3 worktrees (main repo, stoic-wilbur, objective-merkle)
- Ran `git worktree prune`, `git remote prune origin`, `git gc --prune=now`

### 3. Security Scan Results — CLEAN
- **Codebase:** No C2 endpoints, no malicious code, no shell injection vectors
- **"Clawdbot"/"Molt" references:** Only in research docs (6 md files, 1 html, 1 py) — safe
- **Resend SDK audit:** Only 2 legitimate imports (email.service.ts, scheduler.ts). No BCC, no hidden recipients, no postinstall scripts.
- **CORS:** Explicit allowlist (correct, no wildcard)
- **Process execution:** `execFile()` only (safe)

### 4. Architecture Decision: CLI-First, No Docker MCP

The DWS CLI (`cli/src/cli.ts`) and Express `/mcp` endpoint (`src/mcp/agent-server.ts`) already cover everything the Docker MCP containers did. Docker MCP was a redundant wrapper layer.

**Retired (renamed to _OLD):**
- `mcp-hub/` — replaced by Express `/mcp` endpoint
- `mcp-servers/claude/` — replaced by `.claude/handoff.md` file pattern
- `mcp-servers/cloudrun/` — replaced by `gcloud` CLI directly
- `mcp-servers/lwm/` — replaced by MLflow CLI on Veriton
- `mcp-servers/supabase/` — replaced by official Supabase MCP (npx)
- `docker-compose.hybrid.yml` — no longer needed for MCP

**Kept:**
- `mcp-servers/supabase-official/` — official Supabase MCP adapter
- `mcp-servers/cloud-run-gateway/` — Cloud Run deploy gateway

### 5. Security Hardening
- `.mcp.json.example` rewritten: Docker-based entries removed, npx-based only (GitHub Official, Supabase Official)
- Email audit logger added to `src/utils/send-email.ts`: logs timestamp, from, to, subject, transport, contentLength, callerStack, PID to `logs/email-audit.jsonl`
- `logs/` added to `.gitignore`
- `.claude/hooks/session-stop.sh` corrupted shebang fixed (`ur #!/bin/bash` → `#!/bin/bash`)

## Remaining Manual Actions
- Check Resend.com dashboard for unrecognized sent emails
- If suspicious emails found, rotate `RESEND_API_KEY` immediately
- Check GitHub security log for unfamiliar OAuth app authorizations
- SRI hashes for CDN scripts (30+ HTML files) — separate PR
