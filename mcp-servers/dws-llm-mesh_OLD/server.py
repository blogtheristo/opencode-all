"""
dws-llm-mesh — stdio MCP bridge to DWS MCP Hub /llm/* endpoints.

Configure in Cursor / Claude Desktop with MCP_HUB_URL (and optional MCP_HUB_API_KEY).
"""

from __future__ import annotations

import json
import os
import urllib.error
import urllib.request
from typing import Any

from mcp.server.fastmcp import FastMCP

mcp = FastMCP("dws-llm-mesh")


def _hub_base() -> str:
    return os.getenv("MCP_HUB_URL", "http://localhost:8765").rstrip("/")


def _hub_headers() -> dict[str, str]:
    h = {"Content-Type": "application/json"}
    key = os.getenv("MCP_HUB_API_KEY")
    if key:
        h["Authorization"] = f"Bearer {key}"
    return h


def _http_json(method: str, path: str, body: dict[str, Any] | None = None) -> dict[str, Any]:
    url = f"{_hub_base()}{path}"
    data = json.dumps(body or {}).encode("utf-8") if body is not None else None
    req = urllib.request.Request(url, data=data, headers=_hub_headers(), method=method)
    try:
        with urllib.request.urlopen(req, timeout=45) as resp:
            return json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as exc:
        raw = exc.read().decode("utf-8", errors="replace")
        return {"ok": False, "status": exc.code, "error": raw[:500]}
    except Exception as exc:
        return {"ok": False, "error": str(exc)}


@mcp.tool()
def llm_list_endpoints() -> dict[str, Any]:
    """List federated LLM endpoint IDs from MCP Hub (GET /llm/endpoints)."""
    req = urllib.request.Request(
        f"{_hub_base()}/llm/endpoints",
        headers=_hub_headers(),
        method="GET",
    )
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            return json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as exc:
        return {"ok": False, "status": exc.code, "error": exc.read().decode("utf-8", errors="replace")[:500]}
    except Exception as exc:
        return {"ok": False, "error": str(exc)}


@mcp.tool()
def llm_resolve_route(
    agent_name: str = "",
    model_tier: str = "standard",
    ollama_preset: str | None = None,
    mode: str = "agent",
) -> dict[str, Any]:
    """Resolve ordered LLM routes for an agent + tier (POST /llm/resolve)."""
    return _http_json(
        "POST",
        "/llm/resolve",
        {
            "agent_name": agent_name,
            "model_tier": model_tier,
            "ollama_preset": ollama_preset,
            "mode": mode,
        },
    )


@mcp.tool()
def llm_probe(base_url: str) -> dict[str, Any]:
    """Probe OpenAI-compatible /v1/models for a base URL (POST /llm/probe)."""
    return _http_json("POST", "/llm/probe", {"base_url": base_url})


def main() -> None:
    mcp.run(transport="stdio")


if __name__ == "__main__":
    main()
