"""
DWS MCP Gateway — Cloud Run Edition
Hosts MCP servers over Streamable HTTP for Claude Code mobile sessions.

When Claude Code runs on mobile (web), it cannot spawn local MCP server
processes via stdio. This gateway runs on Google Cloud Run and exposes
MCP tools over HTTP so any Claude Code session can reach them.

Supported MCP tool sets:
  - Supabase (database queries, project management)
  - GitHub (repos, issues, PRs, search)

Transport: Streamable HTTP (POST /mcp — single endpoint)
Auth: Bearer token (MCP_GATEWAY_API_KEY env var)
Secrets: Google Secret Manager or environment variables
"""

import logging
import os
from datetime import UTC, datetime
from typing import Any

from mcp.server.fastmcp import FastMCP

# ---------------------------------------------------------------------------
# Logging
# ---------------------------------------------------------------------------
logging.basicConfig(
    level=os.getenv("LOG_LEVEL", "INFO"),
    format="%(asctime)s %(levelname)s %(name)s: %(message)s",
)
logger = logging.getLogger("mcp-gateway")

# ---------------------------------------------------------------------------
# Lazy clients — initialised on first call to avoid import-time failures
# ---------------------------------------------------------------------------
_supabase_client = None
_github_headers = None


def _get_supabase():
    global _supabase_client
    if _supabase_client is None:
        from supabase import create_client

        url = os.environ["SUPABASE_URL"]
        key = os.environ["SUPABASE_SERVICE_KEY"]
        _supabase_client = create_client(url, key)
    return _supabase_client


def _get_github_headers():
    global _github_headers
    if _github_headers is None:
        token = os.environ["GITHUB_TOKEN"]
        _github_headers = {
            "Authorization": f"token {token}",
            "Accept": "application/vnd.github.v3+json",
            "User-Agent": "DWS-MCP-Gateway/1.0",
        }
    return _github_headers


# ---------------------------------------------------------------------------
# MCP Server
# ---------------------------------------------------------------------------
mcp = FastMCP(
    "DWS MCP Gateway",
    instructions="Cloud Run MCP gateway for mobile Claude Code sessions",
    host=os.getenv("HOST", "0.0.0.0"),
    port=int(os.getenv("PORT", "8080")),
    streamable_http_path="/mcp",
)


# ===== SUPABASE TOOLS =====


@mcp.tool()
def supabase_query(
    table: str,
    select: str = "*",
    filters: dict[str, Any] | None = None,
    limit: int = 100,
    order_by: str | None = None,
    ascending: bool = True,
) -> dict[str, Any]:
    """Query a Supabase table with optional filters, ordering, and limits.

    Args:
        table: Table name to query
        select: Columns to select (default "*")
        filters: Dict of column=value equality filters
        limit: Max rows to return (default 100)
        order_by: Column to order by
        ascending: Sort direction (default True)
    """
    db = _get_supabase()
    query = db.table(table).select(select)

    if filters:
        for col, val in filters.items():
            query = query.eq(col, val)

    if order_by:
        query = query.order(order_by, desc=not ascending)

    response = query.limit(limit).execute()
    return {"count": len(response.data), "data": response.data}


@mcp.tool()
def supabase_insert(table: str, rows: list[dict[str, Any]]) -> dict[str, Any]:
    """Insert one or more rows into a Supabase table.

    Args:
        table: Table name
        rows: List of row dicts to insert
    """
    db = _get_supabase()
    response = db.table(table).insert(rows).execute()
    return {"inserted": len(response.data), "data": response.data}


@mcp.tool()
def supabase_update(
    table: str,
    updates: dict[str, Any],
    match: dict[str, Any],
) -> dict[str, Any]:
    """Update rows matching filters in a Supabase table.

    Args:
        table: Table name
        updates: Dict of column=new_value to set
        match: Dict of column=value equality filters to match rows
    """
    db = _get_supabase()
    query = db.table(table).update(updates)
    for col, val in match.items():
        query = query.eq(col, val)
    response = query.execute()
    return {"updated": len(response.data), "data": response.data}


@mcp.tool()
def supabase_rpc(
    function_name: str,
    params: dict[str, Any] | None = None,
) -> dict[str, Any]:
    """Call a Supabase/PostgreSQL RPC function.

    Args:
        function_name: Name of the database function
        params: Parameters to pass to the function
    """
    db = _get_supabase()
    response = db.rpc(function_name, params or {}).execute()
    return {"data": response.data}


@mcp.tool()
def supabase_list_tables() -> dict[str, Any]:
    """List all tables in the Supabase database with row counts."""
    db = _get_supabase()
    response = db.rpc(
        "get_table_info",
        {},
    ).execute()
    # Fallback: query information_schema
    if not response.data:
        response = (
            db.from_("information_schema.tables")
            .select("table_name, table_type")
            .eq("table_schema", "public")
            .execute()
        )
    return {"tables": response.data}


# ===== GITHUB TOOLS =====

import httpx  # noqa: E402

GITHUB_API = "https://api.github.com"


@mcp.tool()
def github_list_repos(
    org: str | None = None,
    user: str | None = None,
    sort: str = "updated",
    per_page: int = 30,
) -> dict[str, Any]:
    """List GitHub repositories for an org or user.

    Args:
        org: GitHub organization name (takes precedence over user)
        user: GitHub username (used if org is not set)
        sort: Sort field — updated, created, pushed, full_name
        per_page: Results per page (max 100)
    """
    headers = _get_github_headers()
    if org:
        url = f"{GITHUB_API}/orgs/{org}/repos"
    elif user:
        url = f"{GITHUB_API}/users/{user}/repos"
    else:
        url = f"{GITHUB_API}/user/repos"

    with httpx.Client() as client:
        resp = client.get(
            url,
            headers=headers,
            params={"sort": sort, "per_page": per_page},
        )
        resp.raise_for_status()
    repos = resp.json()
    return {
        "count": len(repos),
        "repos": [
            {
                "full_name": r["full_name"],
                "description": r.get("description"),
                "url": r["html_url"],
                "updated_at": r["updated_at"],
                "language": r.get("language"),
                "stars": r["stargazers_count"],
            }
            for r in repos
        ],
    }


@mcp.tool()
def github_get_repo(owner: str, repo: str) -> dict[str, Any]:
    """Get detailed information about a GitHub repository.

    Args:
        owner: Repository owner (user or org)
        repo: Repository name
    """
    headers = _get_github_headers()
    with httpx.Client() as client:
        resp = client.get(f"{GITHUB_API}/repos/{owner}/{repo}", headers=headers)
        resp.raise_for_status()
    return resp.json()


@mcp.tool()
def github_list_issues(
    owner: str,
    repo: str,
    state: str = "open",
    labels: str | None = None,
    per_page: int = 30,
) -> dict[str, Any]:
    """List issues for a GitHub repository.

    Args:
        owner: Repository owner
        repo: Repository name
        state: open, closed, or all
        labels: Comma-separated label names to filter by
        per_page: Results per page (max 100)
    """
    headers = _get_github_headers()
    params: dict[str, Any] = {"state": state, "per_page": per_page}
    if labels:
        params["labels"] = labels

    with httpx.Client() as client:
        resp = client.get(
            f"{GITHUB_API}/repos/{owner}/{repo}/issues",
            headers=headers,
            params=params,
        )
        resp.raise_for_status()
    issues = resp.json()
    return {
        "count": len(issues),
        "issues": [
            {
                "number": i["number"],
                "title": i["title"],
                "state": i["state"],
                "author": i["user"]["login"],
                "labels": [label["name"] for label in i.get("labels", [])],
                "created_at": i["created_at"],
                "url": i["html_url"],
            }
            for i in issues
            if "pull_request" not in i  # exclude PRs
        ],
    }


@mcp.tool()
def github_list_prs(
    owner: str,
    repo: str,
    state: str = "open",
    per_page: int = 30,
) -> dict[str, Any]:
    """List pull requests for a GitHub repository.

    Args:
        owner: Repository owner
        repo: Repository name
        state: open, closed, or all
        per_page: Results per page (max 100)
    """
    headers = _get_github_headers()
    with httpx.Client() as client:
        resp = client.get(
            f"{GITHUB_API}/repos/{owner}/{repo}/pulls",
            headers=headers,
            params={"state": state, "per_page": per_page},
        )
        resp.raise_for_status()
    prs = resp.json()
    return {
        "count": len(prs),
        "pull_requests": [
            {
                "number": p["number"],
                "title": p["title"],
                "state": p["state"],
                "author": p["user"]["login"],
                "head": p["head"]["ref"],
                "base": p["base"]["ref"],
                "created_at": p["created_at"],
                "url": p["html_url"],
                "draft": p.get("draft", False),
            }
            for p in prs
        ],
    }


@mcp.tool()
def github_get_file(
    owner: str,
    repo: str,
    path: str,
    ref: str | None = None,
) -> dict[str, Any]:
    """Get the contents of a file from a GitHub repository.

    Args:
        owner: Repository owner
        repo: Repository name
        path: File path within the repo
        ref: Branch/tag/commit SHA (default: repo default branch)
    """
    headers = _get_github_headers()
    params = {}
    if ref:
        params["ref"] = ref

    with httpx.Client() as client:
        resp = client.get(
            f"{GITHUB_API}/repos/{owner}/{repo}/contents/{path}",
            headers=headers,
            params=params,
        )
        resp.raise_for_status()
    data = resp.json()

    import base64

    content = ""
    if data.get("encoding") == "base64" and data.get("content"):
        content = base64.b64decode(data["content"]).decode("utf-8", errors="replace")

    return {
        "name": data["name"],
        "path": data["path"],
        "size": data["size"],
        "sha": data["sha"],
        "content": content,
    }


@mcp.tool()
def github_search_code(
    query: str,
    owner: str | None = None,
    repo: str | None = None,
    per_page: int = 20,
) -> dict[str, Any]:
    """Search for code across GitHub repositories.

    Args:
        query: Search query (GitHub code search syntax)
        owner: Limit to repos owned by this user/org
        repo: Limit to a specific repo (format: owner/repo)
        per_page: Results per page (max 100)
    """
    headers = _get_github_headers()
    q = query
    if repo:
        q += f" repo:{repo}"
    elif owner:
        q += f" user:{owner}"

    with httpx.Client() as client:
        resp = client.get(
            f"{GITHUB_API}/search/code",
            headers=headers,
            params={"q": q, "per_page": per_page},
        )
        resp.raise_for_status()
    data = resp.json()
    return {
        "total_count": data["total_count"],
        "items": [
            {
                "name": item["name"],
                "path": item["path"],
                "repo": item["repository"]["full_name"],
                "url": item["html_url"],
            }
            for item in data["items"]
        ],
    }


@mcp.tool()
def github_create_issue(
    owner: str,
    repo: str,
    title: str,
    body: str = "",
    labels: list[str] | None = None,
) -> dict[str, Any]:
    """Create a new issue in a GitHub repository.

    Args:
        owner: Repository owner
        repo: Repository name
        title: Issue title
        body: Issue body (markdown)
        labels: List of label names to apply
    """
    headers = _get_github_headers()
    payload: dict[str, Any] = {"title": title, "body": body}
    if labels:
        payload["labels"] = labels

    with httpx.Client() as client:
        resp = client.post(
            f"{GITHUB_API}/repos/{owner}/{repo}/issues",
            headers=headers,
            json=payload,
        )
        resp.raise_for_status()
    issue = resp.json()
    return {
        "number": issue["number"],
        "title": issue["title"],
        "url": issue["html_url"],
    }


# ===== GATEWAY META TOOLS =====


@mcp.tool()
def gateway_health() -> dict[str, Any]:
    """Check the health of the MCP gateway and connected services."""
    status: dict[str, Any] = {
        "gateway": "healthy",
        "timestamp": datetime.now(UTC).isoformat(),
        "services": {},
    }

    # Check Supabase
    try:
        db = _get_supabase()
        db.table("agent_logs").select("id").limit(1).execute()
        status["services"]["supabase"] = "connected"
    except Exception as e:
        status["services"]["supabase"] = f"error: {e}"

    # Check GitHub
    try:
        headers = _get_github_headers()
        with httpx.Client() as client:
            resp = client.get(f"{GITHUB_API}/rate_limit", headers=headers)
            resp.raise_for_status()
        limits = resp.json()["rate"]
        status["services"]["github"] = {
            "status": "connected",
            "rate_limit_remaining": limits["remaining"],
            "rate_limit_reset": limits["reset"],
        }
    except Exception as e:
        status["services"]["github"] = f"error: {e}"

    return status


# ---------------------------------------------------------------------------
# Entrypoint
# ---------------------------------------------------------------------------
if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser(description="DWS MCP Gateway")
    parser.add_argument(
        "--transport",
        choices=["streamable-http", "sse", "stdio"],
        default="streamable-http",
    )
    args = parser.parse_args()

    logger.info("Starting MCP Gateway (transport=%s)", args.transport)
    mcp.run(transport=args.transport)
