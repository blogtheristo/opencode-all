import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

export interface EndpointRecord {
  id: string;
  provider_kind: string;
  base_url?: string;
  enabled?: boolean;
  api_key_env?: string | null;
  model_override?: string;
  models?: Record<string, string>;
}

export interface LlmRegistry {
  endpoints: EndpointRecord[];
  tier_fallback?: Record<string, string[]>;
}

function stripSlash(url: string): string {
  return url.replace(/\/+$/, "");
}

function ollamaHost(): string {
  const raw = (
    process.env.OLLAMA_BASE_URL ??
    process.env.OLLAMA_HOST ??
    ""
  ).trim();
  if (raw) return stripSlash(raw);
  return "http://localhost:11434";
}

function ollamaModelForTier(tier: string, ollamaPreset: string | null | undefined): string {
  const preset = (ollamaPreset ?? "").toLowerCase().trim();
  const base = process.env.OLLAMA_MODEL ?? "llama3.3:70b";
  if (preset === "fast") return process.env.OLLAMA_MODEL_FAST ?? base;
  if (preset === "agent") return process.env.OLLAMA_MODEL_AGENT ?? base;
  if (preset === "quality") return process.env.OLLAMA_MODEL_QUALITY ?? base;
  if (preset === "vision")
    return process.env.OLLAMA_MODEL_VISION ?? process.env.OLLAMA_MODEL_AGENT ?? base;
  if (preset === "coding")
    return (
      process.env.OLLAMA_MODEL_CODING ?? process.env.OLLAMA_MODEL_FAST ?? base
    );
  const tierL = tier.toLowerCase();
  if (tierL === "lite") return process.env.OLLAMA_MODEL_FAST ?? base;
  if (tierL === "standard") return process.env.OLLAMA_MODEL_AGENT ?? base;
  if (tierL === "heavy") return process.env.OLLAMA_MODEL_QUALITY ?? base;
  return base;
}

export function builtinRegistry(): LlmRegistry {
  const ollama = ollamaHost();
  return {
    endpoints: [
      {
        id: "dgx_ollama",
        provider_kind: "ollama_openai",
        base_url: ollama,
        enabled: true,
        api_key_env: null,
      },
      {
        id: "groq_cloud",
        provider_kind: "groq",
        base_url: "https://api.groq.com/openai/v1",
        enabled: Boolean(process.env.GROQ_API_KEY),
        api_key_env: "GROQ_API_KEY",
        model_override:
          process.env.GROQ_MODEL ?? "llama-3.3-70b-versatile",
      },
      {
        id: "anthropic_cloud",
        provider_kind: "anthropic",
        base_url: "https://api.anthropic.com/v1",
        enabled: Boolean(process.env.ANTHROPIC_API_KEY),
        api_key_env: "ANTHROPIC_API_KEY",
        model_override:
          process.env.ANTHROPIC_MODEL ?? "claude-sonnet-4-20250514",
      },
    ],
    tier_fallback: {
      lite: ["dgx_ollama", "groq_cloud", "anthropic_cloud"],
      standard: ["dgx_ollama", "groq_cloud", "anthropic_cloud"],
      heavy: ["dgx_ollama", "anthropic_cloud", "groq_cloud"],
    },
  };
}

const defaultRegistryPath = join(__dirname, "..", "config", "llm_endpoints.default.json");

export function loadRegistry(): LlmRegistry {
  const path =
    process.env.MCP_HUB_LLM_REGISTRY_JSON?.trim() || defaultRegistryPath;
  if (existsSync(path)) {
    try {
      const raw = readFileSync(path, "utf-8");
      const data = JSON.parse(raw) as LlmRegistry;
      const eps = data.endpoints;
      if (Array.isArray(eps) && eps.length > 0) return data;
    } catch {
      /* fall through */
    }
  }
  return builtinRegistry();
}

export interface ResolvedRoute {
  provider_kind: string;
  base_url: string;
  model: string;
  api_key_env?: string | null;
  endpoint_id: string;
}

export function resolveRoutes(
  _agentName: string,
  modelTier: string,
  ollamaPreset: string | null | undefined,
  _mode: string,
): ResolvedRoute[] {
  void _agentName;
  void _mode;
  const reg = loadRegistry();
  const tier = (modelTier || "standard").toLowerCase();
  let order = reg.tier_fallback?.[tier];
  if (!order || order.length === 0) {
    order = ["dgx_ollama", "groq_cloud", "anthropic_cloud"];
  }

  const eps = Object.fromEntries(
    (reg.endpoints ?? []).map((e) => [e.id, e]),
  );
  const routes: ResolvedRoute[] = [];

  for (const eid of order) {
    const ep = eps[eid];
    if (!ep || ep.enabled === false) continue;
    const pk = ep.provider_kind.toLowerCase();
    let baseUrl = ep.base_url ?? "";
    let model: string | undefined = ep.model_override;

    if (pk === "ollama_openai" || pk === "ollama-local" || pk === "ollama") {
      baseUrl = baseUrl || ollamaHost();
      model = model ?? ollamaModelForTier(tier, ollamaPreset);
    } else if (model === undefined) {
      const mdl = ep.models;
      model =
        typeof mdl === "object" && mdl !== null ? mdl[tier] : undefined;
    }
    if (!model) continue;

    routes.push({
      provider_kind: ep.provider_kind,
      base_url: baseUrl,
      model,
      api_key_env: ep.api_key_env,
      endpoint_id: eid,
    });
  }

  return routes;
}

export function redactEndpointsForList(registry: LlmRegistry): Record<
  string,
  unknown
>[] {
  return (registry.endpoints ?? []).map((ep) => ({
    id: ep.id,
    provider_kind: ep.provider_kind,
    base_url: ep.base_url,
    enabled: ep.enabled !== false,
    api_key_env: ep.api_key_env,
  }));
}

export async function probeOpenaiCompatible(
  baseUrl: string,
  timeoutMs = 5000,
): Promise<{ ok: boolean; status?: number; body_preview?: unknown; error?: string }> {
  const root = stripSlash(baseUrl);
  const probeUrl = root.endsWith("/v1")
    ? `${root}/models`
    : `${root}/v1/models`;
  const ac = new AbortController();
  const t = setTimeout(() => ac.abort(), timeoutMs);
  try {
    const r = await fetch(probeUrl, { signal: ac.signal });
    let bodyPreview: unknown;
    try {
      bodyPreview = await r.json();
    } catch {
      bodyPreview = (await r.text()).slice(0, 500);
    }
    return {
      ok: r.ok,
      status: r.status,
      body_preview: bodyPreview,
    };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return { ok: false, error: msg };
  } finally {
    clearTimeout(t);
  }
}
