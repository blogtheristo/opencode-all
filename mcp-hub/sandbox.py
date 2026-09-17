"""
OpenSandbox MCP endpoints for MCP Hub.
Docker-isolated agent sandboxes via MCP tool protocol.
"""

from typing import Any

from pydantic import BaseModel

from .services.opensandbox_mcp import (
    MCP_TOOLS as OPENSANDBOX_MCP_TOOLS,
)
from .services.opensandbox_mcp import (
    sandbox_create,
    sandbox_destroy,
    sandbox_execute,
    sandbox_file_read,
    sandbox_file_write,
    sandbox_ping,
)


class SandboxCreateRequest(BaseModel):
    image: str = ""
    env: dict = {}
    timeout_seconds: int = 300
    memory: str = "512Mi"
    cpu: str = "1"
    allowed_domains: list[str] = []


class SandboxExecuteRequest(BaseModel):
    sandbox_id: str
    command: str


class SandboxFileReadRequest(BaseModel):
    sandbox_id: str
    path: str


class SandboxFileEntry(BaseModel):
    path: str
    data: str
    mode: int = 644


class SandboxFileWriteRequest(BaseModel):
    sandbox_id: str
    files: list[SandboxFileEntry]


class SandboxDestroyRequest(BaseModel):
    sandbox_id: str


async def mcp_sandbox_ping() -> dict[str, Any]:
    """Health check the OpenSandbox server on the Acer Veriton."""
    return await sandbox_ping()


async def mcp_sandbox_create(
    req: SandboxCreateRequest,
) -> dict[str, Any]:
    """Create a new isolated Docker sandbox on the Acer Veriton edge node."""
    return await sandbox_create(
        image=req.image or None,
        env=req.env,
        timeout_seconds=req.timeout_seconds,
        memory=req.memory,
        cpu=req.cpu,
        allowed_domains=req.allowed_domains or None,
    )


async def mcp_sandbox_execute(
    req: SandboxExecuteRequest,
) -> dict[str, Any]:
    """Execute a shell command inside a running sandbox."""
    return await sandbox_execute(req.sandbox_id, req.command)


async def mcp_sandbox_file_read(
    req: SandboxFileReadRequest,
) -> dict[str, Any]:
    """Read a file from the sandbox filesystem."""
    return await sandbox_file_read(req.sandbox_id, req.path)


async def mcp_sandbox_file_write(
    req: SandboxFileWriteRequest,
) -> dict[str, Any]:
    """Write files into the sandbox filesystem."""
    files = [f.model_dump() for f in req.files]
    return await sandbox_file_write(req.sandbox_id, files)


async def mcp_sandbox_destroy(
    req: SandboxDestroyRequest,
) -> dict[str, Any]:
    """Destroy a sandbox and release all resources."""
    return await sandbox_destroy(req.sandbox_id)


async def mcp_sandbox_tools_list() -> dict[str, Any]:
    """List all available OpenSandbox MCP tools."""
    return {
        "tools": [
            {
                "name": t["name"],
                "description": t["description"],
                "input_schema": t["input_schema"],
            }
            for t in OPENSANDBOX_MCP_TOOLS
        ]
    }