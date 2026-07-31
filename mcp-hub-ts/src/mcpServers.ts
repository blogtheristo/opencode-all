/** MCP_SERVERS registry — mirrors Python hub defaults + env overrides. */

export function getMcpServers(): Record<string, string> {
  return {
    github: process.env.GITHUB_MCP_URL ?? "http://localhost:8767",
    gemini: process.env.GEMINI_MCP_URL ?? "http://localhost:8768",
    "carbon-api":
      process.env.CARBON_API_URL ??
      process.env.CARBON_MCP_URL ??
      process.env.SUPABASE_MCP_URL ??
      "http://carbon-api:8766",
    "cloudrun-mcp": process.env.CLOUDRUN_MCP_URL ?? "http://cloudrun-mcp:8769",
    "lwm-mcp": process.env.LWM_MCP_URL ?? "http://lwm-mcp:8770",
    "claude-mcp": process.env.CLAUDE_MCP_URL ?? "http://claude-mcp:8771",
    backend: process.env.BACKEND_URL ?? "http://localhost:3002",
    prometheus: process.env.PROMETHEUS_URL ?? "http://localhost:9091",
    grafana: process.env.GRAFANA_URL ?? "http://localhost:3001",
    "agent-foundry":
      process.env.AGENT_FOUNDRY_URL ?? "http://localhost:8082",
    /** Cloud Run DWS MCP gateway (TypeScript, Streamable HTTP `/mcp`). */
    "dws-gateway":
      process.env.DWS_GATEWAY_URL ??
      process.env.CLOUDRUN_MCP_GATEWAY_URL ??
      "",
  };
}
