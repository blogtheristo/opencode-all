# `clawdbot-dream` MCP server

Local stdio MCP server that exposes the Firehorse Dreaming primitives as
MCP tools, so any Claude surface that can mount a stdio MCP server can
drive the dreaming loop without typing the `/dream-on` slash command.

## Status (per CLAUDE.md "Cross-Surface Verification Rule")

| Surface                          | Design intent |                                                      Verified by HIL?                                                       |
| -------------------------------- | :-----------: | :-------------------------------------------------------------------------------------------------------------------------: |
| Claude CLI (PowerShell on Win11) |       ✓       |                                                       **pending HIL**                                                       |
| Claude CLI (macOS / Linux / WSL) |       ✓       |                                                       **pending HIL**                                                       |
| Claude Desktop on Win11          |       ✓       |                                                       **pending HIL**                                                       |
| Claude Mobile (iOS / Android)    |       ✗       | N/A — needs cloud-run-gateway extension to proxy these tools over Streamable HTTP. Mobile cannot spawn local stdio servers. |
| claude.ai web chat               |       ✗       |                                                    N/A — same as Mobile.                                                    |

**Until HIL clears the "verified" cells on a fresh checkout, this MCP
server is `EXPERIMENTAL: not yet cross-surface verified`.** That status
mirrors what `skills/dream-on/SKILL.md` already says about the slash
command. Cross-surface for Mobile/web requires the **follow-up**:
extend `mcp-servers/cloud-run-gateway/server.py` with the same dream
tools backed by the canonical `firehorse_memory` Supabase table — that
work is not in this MCP server.

## What it exposes

Nine MCP tools, each a thin wrapper around `node scripts/clawdbot-scan.mjs`:

| Tool                   | Action                                                                |
| ---------------------- | --------------------------------------------------------------------- |
| `dream_status`         | Counts: pending / dismissed / done.                                   |
| `dream_list`           | Pending queue items as JSON, newest first.                            |
| `dream_list_proposals` | Unpromoted proposal files (sorted newest first by mtime).             |
| `dream_get_proposal`   | Read a specific proposal file's body.                                 |
| `dream_scan`           | Refresh queue from transcripts (idempotent; writes queue files).      |
| `dream_preview`        | Classify GREEN/YELLOW/RED trust zone of a queue item's touched files. |
| `dream_prune`          | Run dream-prune heuristic (pure grep, no LLM).                        |
| `dream_mark_done`      | Mark a queue item done.                                               |
| `dream_dismiss`        | Mark a queue item dismissed.                                          |

All tools are read-mostly or queue-state writes. None apply migrations,
deploy, send email, or touch RED-zone paths (per CLAUDE.md
"Auto-Mode Trust Boundary").

## Install — Claude CLI on Win11 (PowerShell)

From a PowerShell window opened in the dws6 repo root:

```powershell
# 1. Install the MCP SDK into a venv (or globally — your call).
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r mcp-servers/clawdbot-dream/requirements.txt

# 2. Add this MCP server to your project-scoped .mcp.json.
$repoRoot = (git rev-parse --show-toplevel) -replace '/', '\'
$venvPython = "$repoRoot\.venv\Scripts\python.exe"
$serverPath = "$repoRoot\mcp-servers\clawdbot-dream\server.py"

# Print the JSON block to add to .mcp.json (handcraft the merge if
# .mcp.json already exists; otherwise create it):
$config = @{
    mcpServers = @{
        'clawdbot-dream' = @{
            type    = 'stdio'
            command = $venvPython
            args    = @($serverPath)
            env     = @{ CLAUDE_PROJECT_DIR = $repoRoot }
        }
    }
} | ConvertTo-Json -Depth 6
$config | Set-Content -Encoding UTF8 .mcp.json

# 3. Restart claude. The new MCP server should appear in the session's
#    tool list. Verify:
claude --mcp-list
```

If `claude --mcp-list` shows `clawdbot-dream`, the install landed.

## Install — Claude Desktop on Win11

Claude Desktop reads its MCP config from
`%APPDATA%\Claude\claude_desktop_config.json`. Edit that file (or create
it) and merge in the same `mcpServers.clawdbot-dream` block from
`mcp-config.example.json`, with absolute paths substituted in.

```powershell
# Show the current Desktop config path
$configPath = "$env:APPDATA\Claude\claude_desktop_config.json"
Write-Host "Edit this file: $configPath"

# Print the block to merge (substitute paths):
Get-Content mcp-servers\clawdbot-dream\mcp-config.example.json
```

After saving, fully quit and relaunch Claude Desktop.

## Install — macOS / Linux

Add this to your project's `.mcp.json`:

```bash
cat > .mcp.json <<EOF
{
  "mcpServers": {
    "clawdbot-dream": {
      "type": "stdio",
      "command": "python3",
      "args": ["$(pwd)/mcp-servers/clawdbot-dream/server.py"],
      "env": { "CLAUDE_PROJECT_DIR": "$(pwd)" }
    }
  }
}
EOF
```

## What this does NOT solve

- **Mobile / web access.** Stdio MCP can't reach a phone. The followup
  is to extend `mcp-servers/cloud-run-gateway/server.py` with the same
  tool surface, backed by Supabase `firehorse_memory` (migration 065)
  for state. That's a separate PR.
- **Cross-machine sync.** Each machine has its own `.claude/clawdbot/`
  state; this MCP server reads the local one. For shared dreaming
  state, the gateway extension above is the path.

## Verification HIL must run

This server is `EXPERIMENTAL: not yet cross-surface verified` until
HIL on a Win11 box runs the install above against a fresh checkout
and confirms `dream_status` returns valid JSON when called from a
fresh Claude CLI session. Until then, do not promote this in
user-facing copy as "cross-surface available".

## See also

- `skills/dream-on/SKILL.md` — the slash command this MCP fronts
- `.claude/clawdbot/memory/cross-surface-verification-rule.md` — the rule that defines what "verified" means
- `mcp-servers/cloud-run-gateway/server.py` — the gateway pattern this MCP server's follow-up will extend for Mobile/web
- CLAUDE.md → "Cross-Surface Verification Rule"
