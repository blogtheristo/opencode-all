# Field Note: DGX OpenCode Runtime Alignment

***

# VERSION AND AGENT HISTORY

Version: 1.0

***

## Decision

The DGX Spark development posture is OpenCode-primary, with Ollama and local/open models as the normal path and Claude Code retained as hot standby. The harness is stable while model selection can move to newer NVIDIA/open weights.

## Verified state

- OpenCode 1.18.18 is installed at `/home/admin100/.opencode/bin/opencode`.
- Non-login SSH shells may require `export PATH="$HOME/.opencode/bin:$PATH"`.
- `opencode debug config --pure` succeeds.
- `dws-gateway-local` connects through the project virtualenv.
- The gateway requires `mcp[cli]>=1.9.0,<2.0.0`; MCP SDK 2.x is incompatible with its `mcp.server.fastmcp` import path.
- `dws-agents-local` is intentionally disabled because no service listens on `localhost:3001/mcp`.
- Ollama is available on port `11434`; this is not evidence that the disabled port-3001 SSE service exists.

## Operational boundary

Only the gateway with a verified connection is treated as available. The unavailable SSE service is recorded as unavailable rather than redirected to an unverified endpoint. This preserves a truthful MCP health state and prevents accidental egress expansion.

## Evidence

- `opencode.json`
- `mcp-servers/cloud-run-gateway/server.py`
- `mcp-servers/cloud-run-gateway/requirements.txt`
- `Admin/ADMIN_MANUAL.md`
- `docs/metropolia/master-thesis/en/V3Thesis_EN.md` §10.30
- `docs/PHD_FIREHORSE_EN.md` §14.50
