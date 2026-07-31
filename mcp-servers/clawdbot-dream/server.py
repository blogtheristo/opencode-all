"""
clawdbot-dream MCP server — local stdio variant.

Exposes the Firehorse Dreaming primitives (defined as Claude-CLI-internal
in skills/dream-on/SKILL.md) as MCP tools, so any Claude Code surface
that can mount a stdio MCP server (Claude CLI, Claude Desktop on Win11)
can drive the dreaming loop without typing the slash command.

Scope of THIS server (per CLAUDE.md "Cross-Surface Verification Rule"):

  - Verified surface intent  : Claude CLI (macOS / Linux / Win11 PowerShell),
                               Claude Desktop on Win11 — wherever a stdio MCP
                               server can be configured against this repo
                               checkout.
  - Does not apply (yet)    : Claude Mobile, claude.ai web. Those clients
                               cannot spawn a local stdio process — they
                               need the cloud-run-gateway extension to
                               proxy these tools over Streamable HTTP. That
                               extension is a follow-up; do not call this
                               feature "cross-surface complete" until it
                               ships AND is verified on a phone.

Tools exposed:
  - dream_status         : counts of pending / dismissed / done queue items
  - dream_list           : pending queue items as JSON (newest first)
  - dream_list_proposals : unpromoted proposals under .claude/clawdbot/proposals/
  - dream_get_proposal   : read a specific proposal file body
  - dream_scan           : refresh the queue from transcripts (idempotent)
  - dream_preview        : classify trust zone of a queue item's files
  - dream_prune          : run the dream-prune heuristic
  - dream_mark_done      : mark a queue item done
  - dream_dismiss        : mark a queue item dismissed

Each tool is a thin wrapper around `node scripts/clawdbot-scan.mjs` —
this server intentionally adds no new dreaming logic, only an MCP
front-end to existing CLI behavior.

Trust zone (per CLAUDE.md "Auto-Mode Trust Boundary"):
  - All tools here are READ-MOSTLY or queue-state writes (mark_done /
    mark_dismissed). They never apply migrations, never deploy, never
    send email, and never touch RED-zone paths. YELLOW-acceptable.
"""

import json
import os
import subprocess
from pathlib import Path
from typing import Any

from mcp.server.fastmcp import FastMCP

# ---------------------------------------------------------------------------
# Repo discovery — the MCP server must run from the dws6 repo root, but the
# user might launch claude from elsewhere. Resolve via CLAUDE_PROJECT_DIR
# (set by Claude Code when present) or fall back to a known-good marker file
# walk upward from this server's own location.
# ---------------------------------------------------------------------------

def _find_repo_root() -> Path:
    env = os.environ.get("CLAUDE_PROJECT_DIR")
    if env:
        return Path(env).resolve()
    here = Path(__file__).resolve()
    for parent in [here, *here.parents]:
        if (parent / "scripts" / "clawdbot-scan.mjs").is_file():
            return parent
    raise RuntimeError(
        "clawdbot-dream MCP server: cannot locate repo root. Set "
        "CLAUDE_PROJECT_DIR or run from inside the dws6 repo."
    )


REPO_ROOT = _find_repo_root()
SCANNER = REPO_ROOT / "scripts" / "clawdbot-scan.mjs"
PROPOSALS_DIR = REPO_ROOT / ".claude" / "clawdbot" / "proposals"

mcp = FastMCP("clawdbot-dream")

# ---------------------------------------------------------------------------
# Helper: run the scanner and return parsed JSON, or {ok: false, ...} on error
# ---------------------------------------------------------------------------

def _run_scanner(*args: str) -> dict[str, Any]:
    cmd = ["node", str(SCANNER), *args]
    try:
        out = subprocess.run(
            cmd,
            cwd=str(REPO_ROOT),
            capture_output=True,
            text=True,
            timeout=120,
            check=False,
        )
    except FileNotFoundError:
        return {"ok": False, "error": "node binary not found in PATH"}
    except subprocess.TimeoutExpired:
        return {"ok": False, "error": "scanner timeout (>120s)"}
    stdout = (out.stdout or "").strip()
    if out.returncode != 0 and not stdout:
        return {
            "ok": False,
            "error": f"scanner exit {out.returncode}",
            "stderr": (out.stderr or "").strip()[:400],
        }
    try:
        return json.loads(stdout)
    except json.JSONDecodeError:
        return {
            "ok": False,
            "error": "scanner did not return JSON",
            "stdout_head": stdout[:400],
        }


def _is_unpromoted(path: Path) -> bool:
    try:
        head = "".join(path.read_text(encoding="utf-8").splitlines(keepends=True)[:10])
    except OSError:
        return False
    return ("STATUS: PROMOTED" not in head) and ("STATUS: NO-OP" not in head)


# ---------------------------------------------------------------------------
# Tools
# ---------------------------------------------------------------------------

@mcp.tool()
def dream_status() -> dict[str, Any]:
    """Return queue counts: pending / dismissed / done. Read-only."""
    return _run_scanner("--status")


@mcp.tool()
def dream_list() -> dict[str, Any]:
    """Return pending queue items as JSON, newest first. Read-only."""
    return _run_scanner("--list")


@mcp.tool()
def dream_list_proposals() -> dict[str, Any]:
    """List unpromoted proposal files under .claude/clawdbot/proposals/.

    Returns a list sorted newest-first by mtime. A proposal is "unpromoted"
    if its first 10 lines do NOT contain `STATUS: PROMOTED` or `STATUS: NO-OP`.
    Read-only (does not modify any file).
    """
    if not PROPOSALS_DIR.is_dir():
        return {"ok": True, "proposals": [], "note": "no proposals dir yet"}
    items = []
    for p in sorted(PROPOSALS_DIR.glob("*.md"), key=lambda x: -x.stat().st_mtime):
        if _is_unpromoted(p):
            items.append(
                {
                    "path": str(p.relative_to(REPO_ROOT)),
                    "mtime": p.stat().st_mtime,
                    "kind": p.name.split("-")[0],
                }
            )
    return {"ok": True, "proposals": items, "count": len(items)}


@mcp.tool()
def dream_get_proposal(path: str) -> dict[str, Any]:
    """Read a specific proposal file. `path` is relative to repo root.

    Refuses paths outside .claude/clawdbot/proposals/ to keep this tool
    scoped to its job (no general filesystem read).
    """
    target = (REPO_ROOT / path).resolve()
    try:
        target.relative_to(PROPOSALS_DIR.resolve())
    except ValueError:
        return {
            "ok": False,
            "error": "path must be inside .claude/clawdbot/proposals/",
            "got": path,
        }
    if not target.is_file():
        return {"ok": False, "error": "file not found", "path": path}
    return {
        "ok": True,
        "path": path,
        "body": target.read_text(encoding="utf-8"),
        "promoted": not _is_unpromoted(target),
    }


@mcp.tool()
def dream_scan() -> dict[str, Any]:
    """Refresh the queue from transcripts (idempotent). Writes queue files."""
    return _run_scanner()


@mcp.tool()
def dream_preview(short_id: str) -> dict[str, Any]:
    """Classify GREEN/YELLOW/RED trust zone of files a queue item touched.

    Surfaces `autoResumeEligible` (true only when highest zone is GREEN
    AND branch starts with `claude/`). Read-only.
    """
    return _run_scanner("--preview", short_id)


@mcp.tool()
def dream_prune() -> dict[str, Any]:
    """Run dream-prune heuristic (pure grep, no LLM).

    Writes today's archival proposal to .claude/clawdbot/proposals/.
    Safe to call repeatedly.
    """
    return _run_scanner("--dream-prune")


@mcp.tool()
def dream_mark_done(short_id: str) -> dict[str, Any]:
    """Mark a queue item done. Writes state."""
    return _run_scanner("--done", short_id)


@mcp.tool()
def dream_dismiss(short_id: str) -> dict[str, Any]:
    """Mark a queue item dismissed. Writes state."""
    return _run_scanner("--dismiss", short_id)


# ---------------------------------------------------------------------------
# Entry point — stdio transport.
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    mcp.run(transport="stdio")
