---
date: 2026-08-20
title: DGX Tunnel Automation for OpenCode MCP Services
status: documented
---

# Session Summary: DGX Tunnel Startup Automation

## What Happened

OpenCode primary runtime (per CLAUDE.md) requires access to DGX Spark services via SSH tunnel. The `dws-agents-local` MCP endpoint (`http://localhost:3001/mcp`) was configured but unreachable—the SSH port forward was manual and fragile.

**Solution:** Automated tunnel establishment as part of session startup.

## Changes

### 1. Created `.claude/hooks/dgx-tunnel-start.sh`

- Establishes SSH port forward: `localhost:3001 ↔ dgx-spark:3001`
- Checks if tunnel already running (idempotent)
- Verifies connectivity before returning success
- Handles cleanup and error states gracefully
- Uses netcat/ss to detect port availability across platforms

### 2. Updated `.claude/hooks/session-start.sh`

- Added call to `dgx-tunnel-start.sh` at session init
- Prefixes output with `[DGX]` for visibility
- Non-blocking (errors logged but don't halt session)

### 3. Enabled `dws-agents-local` in `opencode.json`

- Set `"enabled": true` on the remote MCP server config
- Service now reachable when tunnel is live

## Technical Detail

The tunnel script:

- Runs SSH in background: `ssh -N -L 127.0.0.1:3001:127.0.0.1:3001 dgx-spark`
- Polls for readiness (nc check, max 10s)
- Stores PID for cleanup on session end
- Gracefully handles already-running tunnel (no duplicate)

## Outcome

**Before:** OpenCode had to be launched with manual `ssh -N -L` tunnel or service was unavailable.

**After:** Launching OpenCode from dws6 folder automatically:

1. Detects missing tunnel
2. Establishes it to DGX Spark
3. Verifies it's working
4. Allows session to proceed with MCP available

## Next Steps

- Monitor if tunnel establishment is reliable across session types (local, cloud, reconnects)
- If tunnel drops mid-session, evaluate auto-restart logic (current: PID check only)
- Coordinate with `.claude/hooks/session-stop.sh` to cleanly tear down tunnel on exit (not yet implemented)

## Commits

- `c7c89b765`: Enable dws-agents-local in opencode.json
- `9cb641af8`: Add DGX tunnel startup hook
