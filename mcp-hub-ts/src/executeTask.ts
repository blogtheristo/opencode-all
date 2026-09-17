import type { AgentTaskInput } from "./schemas.js";
import { getMcpServers } from "./mcpServers.js";

const DEFAULT_TIMEOUT_MS = 120_000;

export function validateAgentEndpoint(
  task: AgentTaskInput,
  servers: Record<string, string>,
): string | null {
  if (!task.endpoint) return null;
  const bases = Object.values(servers).filter(Boolean);
  const ok = bases.some((base) => task.endpoint!.startsWith(base));
  if (!ok) {
    return `endpoint '${task.endpoint}' is not within any registered MCP_SERVERS base URL. Allowed prefixes: ${bases.join(", ")}`;
  }
  return null;
}

export async function executeTaskAsync(
  servers: Record<string, string>,
  task: AgentTaskInput,
  options?: { timeoutMs?: number },
): Promise<Record<string, unknown>> {
  const ts = () => new Date().toISOString();
  const timeoutMs = options?.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const baseUrl = servers[task.agent];
  if (!baseUrl && !task.endpoint) {
    return {
      agent: task.agent,
      status: "error",
      error: `Unknown agent '${task.agent}' — not in MCP_SERVERS registry`,
      timestamp: ts(),
    };
  }

  const url = task.endpoint ?? `${baseUrl}/agent/task`;
  const ctx: Record<string, unknown> = { ...(task.context ?? {}) };
  if (task.model_tier || task.ollama_preset) {
    ctx.llm_routing = {
      model_tier: task.model_tier,
      ollama_preset: task.ollama_preset,
    };
  }
  const payload = {
    agent: task.agent,
    task: task.task,
    context: ctx,
    priority: task.priority,
  };

  let signal: AbortSignal;
  try {
    signal = AbortSignal.timeout(timeoutMs);
  } catch {
    const ac = new AbortController();
    setTimeout(() => ac.abort(), timeoutMs);
    signal = ac.signal;
  }

  try {
    const method = (task.method ?? "POST").toUpperCase();
    let resp: Response;
    if (method === "GET") {
      const u = new URL(url);
      u.searchParams.set("task", task.task);
      resp = await fetch(u.toString(), {
        method: "GET",
        signal,
      });
    } else {
      resp = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal,
      });
    }

    if (resp.ok) {
      let body: unknown;
      try {
        body = await resp.json();
      } catch {
        body = await resp.text();
      }
      return {
        agent: task.agent,
        status: "completed",
        http_status: resp.status,
        result: body as unknown,
        timestamp: ts(),
      };
    }
    const text = (await resp.text()).slice(0, 500);
    return {
      agent: task.agent,
      status: "error",
      http_status: resp.status,
      error: text,
      timestamp: ts(),
    };
  } catch (e) {
    const name = e instanceof Error ? e.name : "Error";
    const msg = e instanceof Error ? e.message : String(e);
    if (name === "AbortError" || name === "TimeoutError") {
      return {
        agent: task.agent,
        status: "timeout",
        error: `Request to ${url} timed out`,
        timestamp: ts(),
      };
    }
    return {
      agent: task.agent,
      status: "error",
      error: `${name}: ${msg}`,
      timestamp: ts(),
    };
  }
}

/** Servers map suitable for routing (non-empty URLs only). */
export function routingServers(): Record<string, string> {
  const raw = getMcpServers();
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(raw)) {
    const t = v.trim();
    if (t) out[k] = t;
  }
  return out;
}
