"""
OpenSandbox MCP Service — DWS IQ Agent Foundry Stage 1.5

Exposes OpenSandbox (https://github.com/alibaba/OpenSandbox) as MCP tools
in the DWS IQ MCP Hub. The OpenSandbox server runs on the Acer Veriton
edge node and provides Docker-based agent sandboxing.

MCP Tools exposed:
  sandbox_create    — Create a new isolated Docker sandbox
  sandbox_execute   — Run a shell command inside a sandbox
  sandbox_file_read — Read a file from the sandbox filesystem
  sandbox_file_write— Write files into the sandbox filesystem
  sandbox_destroy   — Destroy a sandbox and release resources
  sandbox_ping      — Health check the OpenSandbox server

Environment:
  OPENSANDBOX_HOST    — URL of the OpenSandbox server (required)
  OPENSANDBOX_API_KEY — Auth token (optional)
  OPENSANDBOX_IMAGE   — Default Docker image (optional)

Architecture:
  MCP Hub (FastAPI, Python) → OpenSandbox REST API → Docker on Acer Veriton

References:
  - https://github.com/alibaba/OpenSandbox
  - src/sandbox/opensandbox.ts (TypeScript counterpart)
  - DWS_SECURITY_STANDARD.md §14.6
"""

from __future__ import annotations

import logging
import os
import time
from typing import Any

import httpx

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------

OPENSANDBOX_HOST = os.getenv("OPENSANDBOX_HOST", "").rstrip("/")
OPENSANDBOX_API_KEY = os.getenv("OPENSANDBOX_API_KEY", "")
OPENSANDBOX_IMAGE = os.getenv(
    "OPENSANDBOX_IMAGE", "opensandbox/code-interpreter:v1.0.1"
)
OPENSANDBOX_TIMEOUT = int(os.getenv("OPENSANDBOX_TIMEOUT", "300"))


# ---------------------------------------------------------------------------
# REST client helpers
# ---------------------------------------------------------------------------


def _headers() -> dict[str, str]:
    h = {"Content-Type": "application/json", "Accept": "application/json"}
    if OPENSANDBOX_API_KEY:
        h["Authorization"] = f"Bearer {OPENSANDBOX_API_KEY}"
    return h


def _url(path: str) -> str:
    if not OPENSANDBOX_HOST:
        raise RuntimeError(
            "OPENSANDBOX_HOST is not configured. "
            "Set it to the Acer Veriton OpenSandbox server URL, "
            "e.g. http://192.168.1.50:8080"
        )
    return f"{OPENSANDBOX_HOST}{path}"


# ---------------------------------------------------------------------------
# MCP Tool implementations
# ---------------------------------------------------------------------------


async def sandbox_ping() -> dict[str, Any]:
    """
    Health check the OpenSandbox server on the Acer Veriton.

    Returns:
        {"ok": true, "host": "...", "latency_ms": N}
        or
        {"ok": false, "error": "..."}
    """
    start = time.monotonic()
    try:
        async with httpx.AsyncClient(timeout=10) as client:
            resp = await client.get(_url("/health"), headers=_headers())
            resp.raise_for_status()
        latency = round((time.monotonic() - start) * 1000)
        return {"ok": True, "host": OPENSANDBOX_HOST, "latency_ms": latency}
    except Exception as exc:
        logger.warning("OpenSandbox ping failed: %s", exc)
        return {"ok": False, "error": str(exc)}


async def sandbox_create(
    image: str | None = None,
    env: dict[str, str] | None = None,
    timeout_seconds: int = 300,
    memory: str = "512Mi",
    cpu: str = "1",
    allowed_domains: list[str] | None = None,
) -> dict[str, Any]:
    """
    Create a new isolated Docker sandbox on the Acer Veriton.

    Args:
        image:            Docker image (default: OPENSANDBOX_IMAGE env var)
        env:              Environment variables injected into the container
        timeout_seconds:  Max lifetime in seconds (default: 300)
        memory:           Memory limit, e.g. "512Mi", "1Gi"
        cpu:              CPU limit, e.g. "1", "0.5"
        allowed_domains:  Domains the container may reach (deny-by-default)

    Returns:
        {"id": "...", "image": "...", "status": "running", "created_at": "..."}
    """
    payload: dict[str, Any] = {
        "image": image or OPENSANDBOX_IMAGE,
        "env": env or {},
        "timeout": timeout_seconds,
        "resources": {"memory": memory, "cpu": cpu},
        "networkPolicy": {
            "allowedDomains": allowed_domains or [
                "api.anthropic.com",
                "api.groq.com",
                "mcp-hub.dws10.com",
                "api.dws10.com",
            ],
            "denyByDefault": True,
        },
    }
    async with httpx.AsyncClient(timeout=OPENSANDBOX_TIMEOUT) as client:
        resp = await client.post(_url("/sandboxes"), json=payload, headers=_headers())
        resp.raise_for_status()
        data = resp.json()

    logger.info("OpenSandbox sandbox created: %s", data.get("id"))
    return data


async def sandbox_execute(sandbox_id: str, command: str) -> dict[str, Any]:
    """
    Execute a shell command inside a running sandbox.

    Args:
        sandbox_id: Sandbox ID returned by sandbox_create
        command:    Shell command to execute (runs via /bin/sh -c)

    Returns:
        {"stdout": "...", "stderr": "...", "exit_code": N, "duration_ms": N}
    """
    start = time.monotonic()
    async with httpx.AsyncClient(timeout=OPENSANDBOX_TIMEOUT) as client:
        resp = await client.post(
            _url(f"/sandboxes/{sandbox_id}/exec"),
            json={"command": command},
            headers=_headers(),
        )
        resp.raise_for_status()
        data = resp.json()

    data["duration_ms"] = round((time.monotonic() - start) * 1000)
    return data


async def sandbox_file_read(sandbox_id: str, path: str) -> dict[str, Any]:
    """
    Read a file from the sandbox filesystem.

    Args:
        sandbox_id: Sandbox ID
        path:       Absolute path inside the container (e.g. /output/result.json)

    Returns:
        {"path": "...", "content": "..."}
    """
    async with httpx.AsyncClient(timeout=OPENSANDBOX_TIMEOUT) as client:
        resp = await client.get(
            _url(f"/sandboxes/{sandbox_id}/files/{path.lstrip('/')}"),
            headers=_headers(),
        )
        resp.raise_for_status()
        data = resp.json()

    return {"path": path, "content": data.get("content", "")}


async def sandbox_file_write(
    sandbox_id: str,
    files: list[dict[str, Any]],
) -> dict[str, Any]:
    """
    Write one or more files into the sandbox filesystem.

    Args:
        sandbox_id: Sandbox ID
        files:      List of {"path": str, "data": str, "mode": int} entries
                    mode is optional octal permission (e.g. 644)

    Returns:
        {"written": N, "paths": [...]}
    """
    async with httpx.AsyncClient(timeout=OPENSANDBOX_TIMEOUT) as client:
        resp = await client.put(
            _url(f"/sandboxes/{sandbox_id}/files"),
            json={"files": files},
            headers=_headers(),
        )
        resp.raise_for_status()

    paths = [f["path"] for f in files]
    return {"written": len(files), "paths": paths}


async def sandbox_destroy(sandbox_id: str) -> dict[str, Any]:
    """
    Destroy a sandbox and release all resources.
    The container and its filesystem are permanently deleted.

    Args:
        sandbox_id: Sandbox ID to destroy

    Returns:
        {"destroyed": true, "sandbox_id": "..."}
    """
    async with httpx.AsyncClient(timeout=30) as client:
        resp = await client.delete(_url(f"/sandboxes/{sandbox_id}"), headers=_headers())
        resp.raise_for_status()

    logger.info("OpenSandbox sandbox destroyed: %s", sandbox_id)
    return {"destroyed": True, "sandbox_id": sandbox_id}


# ---------------------------------------------------------------------------
# Tool registry for MCP hub
# ---------------------------------------------------------------------------

MCP_TOOLS: list[dict[str, Any]] = [
    {
        "name": "sandbox_ping",
        "description": (
            "Health check the OpenSandbox server running on the Acer Veriton. "
            "Returns latency_ms and ok:true if the server is reachable."
        ),
        "input_schema": {
            "type": "object",
            "properties": {},
            "required": [],
        },
        "handler": sandbox_ping,
    },
    {
        "name": "sandbox_create",
        "description": (
            "Create a new Docker-isolated sandbox on the Acer Veriton edge node. "
            "Network egress is deny-by-default with an explicit allow-list. "
            "Returns sandbox_id for subsequent commands."
        ),
        "input_schema": {
            "type": "object",
            "properties": {
                "image": {
                    "type": "string",
                    "description": "Docker image (default: opensandbox/code-interpreter:v1.0.1)",
                },
                "env": {
                    "type": "object",
                    "description": "Environment variables for the container",
                    "additionalProperties": {"type": "string"},
                },
                "timeout_seconds": {
                    "type": "integer",
                    "description": "Container max lifetime in seconds (default: 300)",
                },
                "memory": {
                    "type": "string",
                    "description": "Memory limit e.g. '512Mi', '1Gi' (default: 512Mi)",
                },
                "cpu": {
                    "type": "string",
                    "description": "CPU limit e.g. '1', '0.5' (default: 1)",
                },
                "allowed_domains": {
                    "type": "array",
                    "items": {"type": "string"},
                    "description": "Domains the container may reach (deny-by-default egress)",
                },
            },
            "required": [],
        },
        "handler": sandbox_create,
    },
    {
        "name": "sandbox_execute",
        "description": (
            "Execute a shell command inside a running sandbox. "
            "Returns stdout, stderr, exit_code, and duration_ms."
        ),
        "input_schema": {
            "type": "object",
            "properties": {
                "sandbox_id": {
                    "type": "string",
                    "description": "Sandbox ID from sandbox_create",
                },
                "command": {
                    "type": "string",
                    "description": "Shell command to run (executed via /bin/sh -c)",
                },
            },
            "required": ["sandbox_id", "command"],
        },
        "handler": sandbox_execute,
    },
    {
        "name": "sandbox_file_read",
        "description": "Read a file from the sandbox filesystem.",
        "input_schema": {
            "type": "object",
            "properties": {
                "sandbox_id": {"type": "string"},
                "path": {
                    "type": "string",
                    "description": "Absolute path inside the container",
                },
            },
            "required": ["sandbox_id", "path"],
        },
        "handler": sandbox_file_read,
    },
    {
        "name": "sandbox_file_write",
        "description": (
            "Write one or more files into the sandbox filesystem. "
            "Each entry: {path, data, mode?}."
        ),
        "input_schema": {
            "type": "object",
            "properties": {
                "sandbox_id": {"type": "string"},
                "files": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "path": {"type": "string"},
                            "data": {"type": "string"},
                            "mode": {"type": "integer"},
                        },
                        "required": ["path", "data"],
                    },
                },
            },
            "required": ["sandbox_id", "files"],
        },
        "handler": sandbox_file_write,
    },
    {
        "name": "sandbox_destroy",
        "description": (
            "Destroy a sandbox and permanently delete its container and filesystem. "
            "Always call this after execution to avoid resource leaks."
        ),
        "input_schema": {
            "type": "object",
            "properties": {
                "sandbox_id": {"type": "string"},
            },
            "required": ["sandbox_id"],
        },
        "handler": sandbox_destroy,
    },
]
