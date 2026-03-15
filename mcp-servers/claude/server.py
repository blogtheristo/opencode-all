"""
DWS IQ 6 Claude Session Sync MCP Server
========================================
Solves cross-platform session fragmentation:
  - VS Code Copilot / Claude Code CLI / Mobile all share one source of truth
  - Migration number authority (prevents collision between platforms)
  - Branch/worktree state tracking
  - Platform execution gates (mobile queues → Win11 executes SQL)

Port: 8771
CORS: env-driven explicit origins (DWS_SECURITY_STANDARD.md §13.3.1)

Tables (via Supabase):
  mcp_sessions         — session checkpoints & handoffs
  mcp_migration_queue  — queued SQL migrations with atomic numbering
"""

import logging
import os
import subprocess
from datetime import datetime
from typing import Literal

from fastapi import Depends, FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from pydantic import BaseModel

from supabase import Client, create_client

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Authentication — Bearer token gate (matches mcp-hub pattern)
# ---------------------------------------------------------------------------
_API_KEY: str = os.getenv("MCP_HUB_API_KEY", "")
_bearer_scheme = HTTPBearer(auto_error=False)
_AUTH_EXEMPT_PATHS: set[str] = {"/", "/health", "/docs", "/openapi.json", "/redoc"}


async def require_api_key(
    request: Request,
    credentials: HTTPAuthorizationCredentials | None = Depends(_bearer_scheme),  # noqa: B008
) -> None:
    """Reject requests without a valid API key when MCP_HUB_API_KEY is set."""
    if request.url.path in _AUTH_EXEMPT_PATHS:
        return
    if not _API_KEY:
        return
    if credentials is None or credentials.credentials != _API_KEY:
        raise HTTPException(status_code=401, detail="Invalid or missing API key")


app = FastAPI(
    title="DWS Claude Session Sync MCP",
    version="1.0.0",
    dependencies=[Depends(require_api_key)],
)

# CORS — explicit origins only (DWS_SECURITY_STANDARD.md §13.3.1)
_CORS_ORIGINS: list[str] = os.getenv(
    "CORS_ALLOWED_ORIGINS",
    "http://localhost:3000,http://localhost:3002,https://dws10.com,https://onelifetime.world",
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type", "X-Request-ID"],
)

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------
CLAUDE_MCP_PORT: int = int(os.getenv("CLAUDE_MCP_PORT", "8771"))
PLATFORM: str = os.getenv("CLAUDE_MCP_PLATFORM", "win11")  # win11 | mobile | vscode | cli
REPO_PATH: str = os.getenv("REPO_PATH", "/repo")
# HANDOFF_FILE: explicit env var, or derived from REPO_PATH.
# In Docker (REPO_PATH=/handoff, mount at /handoff/handoff.md:ro) → /handoff/handoff.md
# In local dev (REPO_PATH=/repo) → /repo/.claude/handoff.md
HANDOFF_FILE: str = os.getenv(
    "HANDOFF_FILE",
    os.path.join(REPO_PATH, "handoff.md")
    if REPO_PATH == "/handoff"
    else os.path.join(REPO_PATH, ".claude", "handoff.md"),
)
# Whether git operations are available (need a real repo mount)
_GIT_AVAILABLE: bool = os.path.isdir(os.path.join(REPO_PATH, ".git"))

# Supabase — used for cross-platform persistence
supabase: Client | None = None
try:
    _url = os.getenv("SUPABASE_URL", "")
    _key = os.getenv("SUPABASE_SERVICE_KEY", "")
    if _url and _key:
        supabase = create_client(_url, _key)
except Exception as e:
    logger.warning("Supabase client init failed: %s", e)


def _db() -> Client:
    if supabase is None:
        raise HTTPException(503, "Supabase not configured — set SUPABASE_URL and SUPABASE_SERVICE_KEY")
    return supabase


def _git(*args: str) -> str:
    """Run a git command in REPO_PATH, return stdout.

    Returns empty string when no git repo is mounted (Docker handoff-only mode).
    """
    if not _GIT_AVAILABLE:
        return ""
    try:
        result = subprocess.run(
            ["git", "-C", REPO_PATH, *args],  # noqa: S607
            capture_output=True, text=True, timeout=10
        )
        return result.stdout.strip()
    except Exception as e:
        return f"error: {e}"


def _write_handoff(content: str) -> None:
    """Write handoff file for Claude Code CLI to pick up on next start.

    Skips silently when the mount is read-only (Docker mode).
    """
    try:
        os.makedirs(os.path.dirname(HANDOFF_FILE), exist_ok=True)
        with open(HANDOFF_FILE, "w", encoding="utf-8") as f:
            f.write(content)
    except OSError as e:
        # Expected in Docker where /handoff/handoff.md is :ro
        logger.info("Handoff file not writable (read-only mount?): %s", e)
    except Exception as e:
        logger.warning("Could not write handoff file: %s", e)


# ---------------------------------------------------------------------------
# Models
# ---------------------------------------------------------------------------
Platform = Literal["win11", "mobile", "vscode", "cli", "chromebook"]


class CheckpointRequest(BaseModel):
    tool: Platform
    branch: str
    todos: list[dict]                  # [{title, status}]
    files_modified: list[str] = []
    files_uncommitted: list[str] = []
    next_action: str = ""
    notes: str = ""


class HandoffRequest(BaseModel):
    tool: Platform                     # the tool requesting the handoff brief


class MigrationQueueRequest(BaseModel):
    """Queue a SQL migration from any platform (mobile, cli, vscode)."""
    name: str                          # e.g. "add_mcp_sessions"
    sql: str                           # full SQL content
    author_tool: Platform
    author_branch: str
    notes: str = ""


class MigrationApplyRequest(BaseModel):
    """Win11 gate: mark migration as applied after running it."""
    supabase_applied: bool = False


class BranchSyncRequest(BaseModel):
    tool: Platform
    branch: str
    worktree_path: str | None = None
    vscode_workspace: str | None = None   # .code-workspace file if relevant
    git_status: str | None = None         # output of git status --short


# ---------------------------------------------------------------------------
# Health
# ---------------------------------------------------------------------------
@app.get("/health")
async def health():
    db_ok = supabase is not None
    branch = _git("rev-parse", "--abbrev-ref", "HEAD")
    return {
        "service": "DWS Claude Session Sync MCP",
        "version": "1.0.0",
        "status": "operational",
        "supabase_connected": db_ok,
        "platform": PLATFORM,
        "current_branch": branch,
        "repo_path": REPO_PATH,
        "handoff_file": HANDOFF_FILE,
        "timestamp": datetime.utcnow().isoformat(),
    }


# ---------------------------------------------------------------------------
# Session checkpoints
# ---------------------------------------------------------------------------
@app.post("/session/checkpoint")
async def save_checkpoint(req: CheckpointRequest):
    """
    Any tool calls this to persist its current state.
    Also writes .claude/handoff.md so Claude Code CLI can resume without re-asking.
    """
    db = _db()
    payload = {
        "branch": req.branch,
        "tool": req.tool,
        "checkpoint": {
            "todos": req.todos,
            "files_modified": req.files_modified,
            "files_uncommitted": req.files_uncommitted,
            "next_action": req.next_action,
            "notes": req.notes,
        },
        "created_at": datetime.utcnow().isoformat(),
    }
    result = db.table("mcp_sessions").insert(payload).execute()

    # Write .claude/handoff.md
    todo_lines = "\n".join(
        f"- [{'x' if t.get('status') == 'completed' else ' '}] {t.get('title', '')}"
        for t in req.todos
    )
    handoff = f"""# Session Handoff — {datetime.utcnow().strftime("%Y-%m-%dT%H:%MZ")}
Tool: {req.tool}
Branch: {req.branch}

## Todos
{todo_lines}

## Files Modified (uncommitted)
{chr(10).join(f"- {f}" for f in req.files_uncommitted) or "- none"}

## Next Action
{req.next_action}

## Notes
{req.notes}
"""
    _write_handoff(handoff)

    return {
        "status": "saved",
        "session_id": result.data[0]["id"] if result.data else None,
        "handoff_written": os.path.exists(HANDOFF_FILE),
    }


@app.get("/session/current")
async def get_current_session():
    """Get the most recent checkpoint across all tools."""
    db = _db()
    branch = _git("rev-parse", "--abbrev-ref", "HEAD")
    result = (
        db.table("mcp_sessions")
        .select("*")
        .order("created_at", desc=True)
        .limit(1)
        .execute()
    )
    latest = result.data[0] if result.data else None
    git_status = _git("status", "--short")
    return {
        "current_branch": branch,
        "latest_checkpoint": latest,
        "git_status": git_status,
        "platform": PLATFORM,
    }


@app.post("/session/handoff")
async def get_handoff(req: HandoffRequest):
    """
    Called when a new tool/session starts.
    Returns a resumption brief: last checkpoint + pending todos + branch state.
    """
    db = _db()
    branch = _git("rev-parse", "--abbrev-ref", "HEAD")
    result = (
        db.table("mcp_sessions")
        .select("*")
        .order("created_at", desc=True)
        .limit(3)
        .execute()
    )
    git_log = _git("log", "--oneline", "-5")
    git_status = _git("status", "--short")

    # Pending migrations
    pending_migs = (
        db.table("mcp_migration_queue")
        .select("*")
        .eq("status", "pending")
        .order("migration_number")
        .execute()
    )

    handoff_text = ""
    if os.path.exists(HANDOFF_FILE):
        with open(HANDOFF_FILE, encoding="utf-8") as f:
            handoff_text = f.read()

    return {
        "requesting_tool": req.tool,
        "current_branch": branch,
        "git_recent": git_log,
        "git_status": git_status,
        "recent_checkpoints": result.data,
        "pending_migrations": pending_migs.data,
        "handoff_file_content": handoff_text,
        "resume_instructions": (
            f"You are resuming on {req.tool}. "
            f"Branch: {branch}. "
            f"Read the handoff file and pending_migrations above. "
            f"If pending_migrations exist and tool={req.tool} is 'win11', "
            f"run them via `supabase migration new` and apply. "
        ),
    }


@app.post("/session/close")
async def close_session(req: CheckpointRequest):
    """Mark session complete. Saves final state, clears handoff file."""
    db = _db()
    payload = {
        "branch": req.branch,
        "tool": req.tool,
        "checkpoint": {"todos": req.todos, "notes": req.notes},
        "summary": req.next_action,
        "closed_at": datetime.utcnow().isoformat(),
        "created_at": datetime.utcnow().isoformat(),
    }
    db.table("mcp_sessions").insert(payload).execute()
    # Clear handoff so next session starts clean
    if os.path.exists(HANDOFF_FILE):
        os.remove(HANDOFF_FILE)
    return {"status": "closed", "branch": req.branch, "tool": req.tool}


# ---------------------------------------------------------------------------
# Migration queue — single number authority
# ---------------------------------------------------------------------------
@app.post("/migrations/queue")
async def queue_migration(req: MigrationQueueRequest):
    """
    Any platform queues a migration here. The server assigns the next
    sequential number atomically — no more collision between mobile and Win11.
    """
    db = _db()
    # Atomic numbering via PostgreSQL sequence (no race condition)
    try:
        seq_result = db.rpc("next_migration_number", {}).execute()
        next_number = seq_result.data
    except Exception:
        logger.warning("Sequence RPC unavailable, falling back to max+1")
        existing = (
            db.table("mcp_migration_queue")
            .select("migration_number")
            .order("migration_number", desc=True)
            .limit(1)
            .execute()
        )
        last = existing.data[0]["migration_number"] if existing.data else 42
        next_number = last + 1
    padded = str(next_number).zfill(3)

    # Generate filename using padded migration number
    filename = f"{padded}_{req.name}.sql"

    payload = {
        "migration_number": next_number,
        "filename": filename,
        "sql": req.sql,
        "author_tool": req.author_tool,
        "author_branch": req.author_branch,
        "status": "pending",
        "notes": req.notes,
        "created_at": datetime.utcnow().isoformat(),
    }
    result = db.table("mcp_migration_queue").insert(payload).execute()

    # Update handoff file to alert Win11 session
    _write_handoff(
        f"# Handoff — {datetime.utcnow().strftime('%Y-%m-%dT%H:%MZ')}\n"
        f"PENDING MIGRATION: {filename}\n"
        f"Author: {req.author_tool} on branch {req.author_branch}\n"
        f"SQL:\n```sql\n{req.sql}\n```\n\n"
        f"## Action Required (Win11)\n"
        f"Run: `supabase migration new {req.name}` then paste the SQL above.\n"
    )

    return {
        "status": "queued",
        "migration_number": next_number,
        "filename": filename,
        "id": result.data[0]["id"] if result.data else None,
        "note": "Win11 session will apply via /migrations/{id}/apply",
    }


@app.get("/migrations/pending")
async def list_pending_migrations():
    """List all pending migrations waiting to be applied on Win11."""
    db = _db()
    result = (
        db.table("mcp_migration_queue")
        .select("*")
        .eq("status", "pending")
        .order("migration_number")
        .execute()
    )
    return {"pending": result.data, "count": len(result.data)}


@app.get("/migrations")
async def list_all_migrations():
    """List all queued migrations (all statuses)."""
    db = _db()
    result = (
        db.table("mcp_migration_queue")
        .select("*")
        .order("migration_number", desc=True)
        .limit(50)
        .execute()
    )
    return {"migrations": result.data}


@app.post("/migrations/{migration_id}/apply")
async def mark_applied(migration_id: str, req: MigrationApplyRequest):
    """
    Win11 calls this after running the migration in Supabase Studio or CLI.
    Server-side platform enforcement: only win11 can apply migrations.
    """
    if PLATFORM != "win11":
        raise HTTPException(
            403,
            f"Migration apply only allowed from win11 platform (current: {PLATFORM})"
        )
    db = _db()
    # Verify migration exists and is pending
    check = (
        db.table("mcp_migration_queue")
        .select("status")
        .eq("id", migration_id)
        .execute()
    )
    if not check.data:
        raise HTTPException(404, f"Migration {migration_id} not found")
    if check.data[0]["status"] != "pending":
        raise HTTPException(
            409, f"Migration {migration_id} is '{check.data[0]['status']}', not pending"
        )
    db.table("mcp_migration_queue").update(
        {
            "status": "applied",
            "applied_by": PLATFORM,  # Server-controlled, not client-supplied
            "supabase_applied": req.supabase_applied,
            "applied_at": datetime.utcnow().isoformat(),
        }
    ).eq("id", migration_id).execute()
    return {"status": "applied", "migration_id": migration_id}


@app.delete("/migrations/{migration_id}")
async def discard_migration(migration_id: str):
    """Discard a pending migration (e.g. superseded by another).

    Same platform gate as apply — only win11 can discard migrations.
    """
    if PLATFORM != "win11":
        raise HTTPException(
            403,
            f"Migration discard only allowed from win11 platform (current: {PLATFORM})"
        )
    db = _db()
    check = (
        db.table("mcp_migration_queue")
        .select("status")
        .eq("id", migration_id)
        .execute()
    )
    if not check.data:
        raise HTTPException(404, f"Migration {migration_id} not found")
    if check.data[0]["status"] != "pending":
        raise HTTPException(
            409, f"Migration {migration_id} is '{check.data[0]['status']}', not pending"
        )
    db.table("mcp_migration_queue").update(
        {"status": "discarded", "applied_at": datetime.utcnow().isoformat()}
    ).eq("id", migration_id).execute()
    return {"status": "discarded", "migration_id": migration_id}


# ---------------------------------------------------------------------------
# Branch / worktree sync
# ---------------------------------------------------------------------------
@app.post("/branch/sync")
async def sync_branch(req: BranchSyncRequest):
    """
    Register the current branch + worktree state from any tool.
    VS Code worktree confusion is solved by always checking this endpoint
    before trusting the editor's branch indicator.
    """
    db = _db()
    actual_branch = _git("rev-parse", "--abbrev-ref", "HEAD")
    worktree_list = _git("worktree", "list", "--porcelain")

    payload = {
        "branch": req.branch,
        "tool": req.tool,
        "checkpoint": {
            "reported_branch": req.branch,
            "actual_branch": actual_branch,
            "worktree_path": req.worktree_path,
            "vscode_workspace": req.vscode_workspace,
            "git_status": req.git_status or _git("status", "--short"),
            "worktree_list": worktree_list,
            "mismatch": req.branch != actual_branch,
        },
        "created_at": datetime.utcnow().isoformat(),
    }
    db.table("mcp_sessions").insert(payload).execute()

    return {
        "reported_branch": req.branch,
        "actual_branch": actual_branch,
        "mismatch": req.branch != actual_branch,
        "worktrees": worktree_list,
        "warning": (
            f"Branch mismatch detected! Editor shows '{req.branch}' "
            f"but git HEAD is '{actual_branch}'. "
            "This is a VS Code worktree sync issue. "
            "Run: git worktree list — to verify."
        ) if req.branch != actual_branch else None,
    }


@app.get("/branch/context")
async def get_branch_context():
    """
    Return full context for Claude: CLAUDE.md summary + for-risto.md latest +
    recent commits + pending migrations + last checkpoint.
    """
    db = _db()
    branch = _git("rev-parse", "--abbrev-ref", "HEAD")
    git_log = _git("log", "--oneline", "-10")
    git_status = _git("status", "--short")
    worktrees = _git("worktree", "list")

    # Latest checkpoint
    cp = (
        db.table("mcp_sessions")
        .select("*")
        .order("created_at", desc=True)
        .limit(1)
        .execute()
    )

    # Pending migrations
    pm = (
        db.table("mcp_migration_queue")
        .select("migration_number,filename,author_tool,status,created_at")
        .eq("status", "pending")
        .order("migration_number")
        .execute()
    )

    # Read handoff if present
    handoff = ""
    if os.path.exists(HANDOFF_FILE):
        with open(HANDOFF_FILE, encoding="utf-8") as f:
            handoff = f.read()

    return {
        "branch": branch,
        "git_log": git_log,
        "git_status": git_status,
        "worktrees": worktrees,
        "latest_checkpoint": cp.data[0] if cp.data else None,
        "pending_migrations": pm.data,
        "handoff_file": handoff,
        "platform": PLATFORM,
    }


# ---------------------------------------------------------------------------
# Entry point
# ---------------------------------------------------------------------------
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=CLAUDE_MCP_PORT)
