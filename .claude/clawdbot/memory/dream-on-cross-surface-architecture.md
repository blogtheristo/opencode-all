# Memory: dream-on cross-surface architecture decision

> Curated by Claude after HIL directive: "Update dream-on to meet all surfaces."
> Date: 2026-05-13
> Sibling: `cross-surface-verification-rule.md` (the rule), this note (the
> first concrete attempt to satisfy the rule for `/dream-on`).

## The decision

`/dream-on`'s cross-surface story is built in **two layers**, not one:

1. **Local stdio MCP server** (`mcp-servers/clawdbot-dream/`) — wraps the
   existing `scripts/clawdbot-scan.mjs` CLI as MCP tools. Reaches every
   surface that can mount a stdio MCP server: Claude CLI on macOS / Linux
   / Win11 PowerShell, and Claude Desktop on Win11.
2. **Cloud-run-gateway extension** (TODO follow-up, not in this PR) —
   adds the same tool surface to `mcp-servers/cloud-run-gateway/server.py`,
   backed by the canonical `firehorse_memory` Supabase table from
   migration 065. Reaches the surfaces stdio cannot: Claude Mobile,
   claude.ai web chat.

The split is forced by Anthropic's surface architecture, not chosen for
elegance: stdio MCP servers are local-process-only, so anything mobile
or web has to go over Streamable HTTP through a hosted gateway. The
gateway pattern already exists in this repo (its docstring literally
says "Hosts MCP servers over Streamable HTTP for Claude Code mobile
sessions") — extending it is mechanical.

## Why MCP and not the Anthropic Dreams API directly

We considered (and previously documented in
`.claude/clawdbot/memory/clawdbot-architecture.md` § "Convergence with
Anthropic Dreams API") the alternative: drop our local implementation
and call `POST /v1/dreams` from every client. HIL ruled against this
("We definitely keep our version. Lets name it Firehorse Dreaming") in
favor of the local-first, EU-on-prem, ollama-spark-fallback path. That
ruling stands. Anthropic's Dreams API remains the parallel surface for
when/if a client needs the managed-runtime version, but we don't depend
on it.

MCP gives us cross-surface reach without surrendering local-first
control: the user's machine still owns the transcripts and the
proposals; the MCP server is just a typed RPC interface to those local
artifacts. Claude clients on any surface call the MCP tools; the work
happens where the data lives.

## What this PR actually shipped

- `mcp-servers/clawdbot-dream/server.py` — Python FastMCP, stdio,
  9 read-mostly tools wrapping the scanner CLI (status, list, list_proposals,
  get_proposal, scan, preview, prune, mark_done, dismiss).
- `mcp-servers/clawdbot-dream/requirements.txt` — just `mcp[cli]`.
- `mcp-servers/clawdbot-dream/README.md` — per-surface install snippets
  for Win11 PowerShell, Claude Desktop on Win11, macOS/Linux. Each one
  is a copy-paste recipe; none has been HIL-verified against a fresh
  checkout yet.
- `mcp-servers/clawdbot-dream/mcp-config.example.json` — drop-in block
  for `.mcp.json` with placeholder paths.
- `skills/dream-on/SKILL.md` — cross-surface table updated to point at
  the MCP server. Still EXPERIMENTAL until HIL clears the verification
  cells.

## What this PR did NOT ship (the explicit "doesn't apply" note per the rule)

- **Cloud-run-gateway extension.** Mobile and web users get nothing from
  this PR. Per the Cross-Surface Verification Rule, this is the
  required "does not apply on `<surface>` because `<reason>`" disclosure:

  > Claude Mobile and claude.ai web do not yet have a path to
  > `/dream-on` because stdio MCP cannot reach those clients. Follow-up
  > work: extend `mcp-servers/cloud-run-gateway/server.py` with the
  > same dream tool surface, backed by Supabase `firehorse_memory`
  > (migration 065). Tracked but not in this PR.

- **HIL-verified install on any surface.** The agent built the install
  paths in a sandbox; none of them have been smoke-tested against a
  fresh checkout by a Windows user, a Mac user, or anyone other than
  the agent itself. Per the rule, this means the skill stays
  `EXPERIMENTAL: not yet cross-surface verified` until HIL reports back.

## The honest verification step HIL must run

On a fresh Win11 PowerShell window opened in the dws6 repo:

```powershell
git fetch origin
git checkout claude/cross-surface-verification-rule-Vt8Jp   # or whatever branch this lands on
git pull

# Set up Python venv + install dep
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r mcp-servers/clawdbot-dream/requirements.txt

# Smoke-test the server can import + start (Ctrl-C to exit immediately)
python mcp-servers/clawdbot-dream/server.py
```

If the last command prints no errors and waits for stdio input, the
server itself works. The next step (mounting it in `.mcp.json` and
having Claude Code pick it up) is what truly clears the verification
bar. Until that happens, the rule says we cannot call this "shipped".

## What the next dreamer should do

1. Fix any install-path bugs HIL surfaces (likely one or more — agent
   sandbox cannot test Win11 paths).
2. Once CLI Win11 + Desktop Win11 are verified, ship the
   `cloud-run-gateway` extension as a separate PR. Same tool names,
   different storage backend (Supabase via migration 065).
3. Once gateway extension is verified on Mobile and web, the SKILL.md
   status downgrade can be removed and the brand "Firehorse Dreaming"
   re-applied with confidence — but only then.

## See also

- `.claude/clawdbot/memory/cross-surface-verification-rule.md` — the rule
- `mcp-servers/clawdbot-dream/README.md` — per-surface install paths
- `mcp-servers/cloud-run-gateway/server.py` — the gateway pattern this PR's follow-up will extend
- `supabase/migrations/065_firehorse_memory.sql` — canonical state for the gateway extension
- CLAUDE.md → "Cross-Surface Verification Rule"
