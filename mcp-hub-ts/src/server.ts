import cors from "cors";
import express from "express";
import type { Request, Response } from "express";
import {
  executeTaskAsync,
  routingServers,
  validateAgentEndpoint,
} from "./executeTask.js";
import { getMcpServers } from "./mcpServers.js";
import {
  loadRegistry,
  probeOpenaiCompatible,
  redactEndpointsForList,
  resolveRoutes,
} from "./llmMesh.js";
import {
  agentTaskSchema,
  llmProbeSchema,
  llmResolveSchema,
  pipelineRequestSchema,
  workflowRequestSchema,
} from "./schemas.js";

function securityHeaders(req: Request, res: Response, next: () => void): void {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "no-referrer");
  res.setHeader("Content-Security-Policy", "default-src 'none'; frame-ancestors 'none'; base-uri 'none'; form-action 'none'");
  const forwardedProto = req.headers["x-forwarded-proto"];
  const proto = Array.isArray(forwardedProto) ? forwardedProto[0] : forwardedProto;
  if (proto === "https") res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  next();
}

const PORT = Number(process.env.PORT ?? process.env.MCP_HUB_PORT ?? 8765);
const MCP_HUB_API_KEY = process.env.MCP_HUB_API_KEY ?? "";

function bearerAuth(req: Request, res: Response, next: () => void): void {
  const path = req.path;
  if (path === "/" || path === "/health") return next();
  if (!MCP_HUB_API_KEY) return next();
  const h = req.headers.authorization;
  if (!h?.startsWith("Bearer ") || h.slice(7) !== MCP_HUB_API_KEY) {
    res.status(401).json({ error: "Invalid or missing API key" });
    return;
  }
  next();
}

function corsOrigins(): string[] {
  const raw =
    process.env.CORS_ALLOWED_ORIGINS ??
    "http://localhost:3000,http://localhost:3002,https://dws10.com,https://onelifetime.world";
  return raw.split(",").map((s) => s.trim()).filter(Boolean);
}

async function probeServiceHealth(name: string, url: string) {
  try {
    const ac = AbortSignal.timeout(3000);
    const resp = await fetch(`${url.replace(/\/+$/, "")}/health`, {
      signal: ac,
    });
    return {
      status: resp.ok ? ("healthy" as const) : ("unhealthy" as const),
      url,
    };
  } catch (e) {
    return {
      status: "unreachable" as const,
      error: String(e).slice(0, 100),
      url,
    };
  }
}

export function createHubApp(): express.Application {
  const app = express();
  app.use(securityHeaders);
  app.use(cors({ origin: corsOrigins(), credentials: true }));
  app.use(express.json({ limit: "2mb" }));
  app.use(bearerAuth);

  app.get("/", (_req: Request, res: Response) => {
    const servers = routingServers();
    res.json({
      service: "DWS MCP Coordination Hub",
      version: "2.2.0",
      runtime: "typescript",
      status: "operational",
      services: Object.keys(servers),
      integrations: {
        zenfree: "not_applicable_ts_hub",
      },
      timestamp: new Date().toISOString(),
    });
  });

  app.get("/health", async (_req: Request, res: Response) => {
    const servers = routingServers();
    const health: Record<string, unknown> = {
      status: "healthy",
      timestamp: new Date().toISOString(),
      services: {} as Record<string, unknown>,
      integrations: {},
    };

    const entries = Object.entries(servers);
    await Promise.all(
      entries.map(async ([name, url]) => {
        (health.services as Record<string, unknown>)[name] =
          await probeServiceHealth(name, url);
      }),
    );

    const svcVals = Object.values(health.services as Record<
      string,
      { status?: string }
    >);
    const healthyCount = svcVals.filter((s) => s.status === "healthy").length;
    const total = svcVals.length;
    if (healthyCount === total) health.status = "healthy";
    else if (healthyCount > 0) health.status = "degraded";
    else health.status = "isolated";

    res.json(health);
  });

  app.post("/agent/task", async (req: Request, res: Response) => {
    const parsed = agentTaskSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.flatten() });
      return;
    }
    const servers = routingServers();
    const v = validateAgentEndpoint(parsed.data, servers);
    if (v) {
      res.status(400).json({ error: v });
      return;
    }
    const result = await executeTaskAsync(servers, parsed.data);
    res.json({
      task_id: `${parsed.data.agent}_${Date.now()}`,
      agent: parsed.data.agent,
      status: result.status ?? "unknown",
      priority: parsed.data.priority,
      result,
      timestamp: new Date().toISOString(),
    });
  });

  app.get("/llm/endpoints", (_req: Request, res: Response) => {
    const reg = loadRegistry();
    res.json({
      endpoints: redactEndpointsForList(reg),
      tier_fallback: reg.tier_fallback ?? {},
      timestamp: new Date().toISOString(),
    });
  });

  app.post("/llm/resolve", (req: Request, res: Response) => {
    const parsed = llmResolveSchema.safeParse(req.body ?? {});
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.flatten() });
      return;
    }
    const routes = resolveRoutes(
      parsed.data.agent_name,
      parsed.data.model_tier,
      parsed.data.ollama_preset,
      parsed.data.mode,
    );
    res.json({ routes, timestamp: new Date().toISOString() });
  });

  app.post("/llm/probe", async (req: Request, res: Response) => {
    const parsed = llmProbeSchema.safeParse(req.body ?? {});
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.flatten() });
      return;
    }
    const result = await probeOpenaiCompatible(parsed.data.base_url);
    res.json({
      target: parsed.data.base_url,
      ...result,
      timestamp: new Date().toISOString(),
    });
  });

  app.post("/workflow/fan-out", async (req: Request, res: Response) => {
    const parsed = workflowRequestSchema.safeParse(req.body ?? {});
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.flatten() });
      return;
    }
    if (parsed.data.workflow_type !== "fan-out") {
      res.status(400).json({ error: "Invalid workflow type" });
      return;
    }
    const servers = routingServers();
    for (const t of parsed.data.tasks) {
      const err = validateAgentEndpoint(t, servers);
      if (err) {
        res.status(400).json({ error: err });
        return;
      }
    }
    const wfTimeout = 300_000;
    const results = await Promise.all(
      parsed.data.tasks.map((t) =>
        executeTaskAsync(servers, t, { timeoutMs: wfTimeout }),
      ),
    );
    res.json({
      workflow_id: `fanout_${Date.now()}`,
      workflow_type: "fan-out",
      tasks_count: parsed.data.tasks.length,
      results,
      completed_at: new Date().toISOString(),
    });
  });

  app.post("/workflow/sequential", async (req: Request, res: Response) => {
    const parsed = workflowRequestSchema.safeParse(req.body ?? {});
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.flatten() });
      return;
    }
    if (parsed.data.workflow_type !== "sequential") {
      res.status(400).json({ error: "Invalid workflow type" });
      return;
    }
    const servers = routingServers();
    for (const t of parsed.data.tasks) {
      const err = validateAgentEndpoint(t, servers);
      if (err) {
        res.status(400).json({ error: err });
        return;
      }
    }
    const results: Record<string, unknown>[] = [];
    let prev: Record<string, unknown> | null = null;
    for (const task of parsed.data.tasks) {
      const t: typeof task = {
        ...task,
        context: {
          ...(task.context ?? {}),
          ...(prev ? { previous_result: prev } : {}),
        },
      };
      const result = await executeTaskAsync(servers, t, {
        timeoutMs: 300_000,
      });
      results.push(result);
      prev = result;
    }
    res.json({
      workflow_id: `sequential_${Date.now()}`,
      workflow_type: "sequential",
      tasks_count: parsed.data.tasks.length,
      results,
      completed_at: new Date().toISOString(),
    });
  });

  app.post("/workflow/pipeline", async (req: Request, res: Response) => {
    const parsed = pipelineRequestSchema.safeParse(req.body ?? {});
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.flatten() });
      return;
    }
    const servers = routingServers();
    for (const stage of parsed.data.stages) {
      for (const t of stage.tasks) {
        const err = validateAgentEndpoint(t, servers);
        if (err) {
          res.status(400).json({ error: err });
          return;
        }
      }
    }

    const stageResults: Record<string, unknown>[] = [];
    let prevStage: Record<string, unknown>[] | null = null;
    const wfTimeout = 300_000;

    for (let idx = 0; idx < parsed.data.stages.length; idx++) {
      const stage = parsed.data.stages[idx];
      const tasks = stage.tasks.map((task) => ({
        ...task,
        context: {
          ...(task.context ?? {}),
          ...(prevStage ? { previous_stage_results: prevStage } : {}),
        },
      }));
      const chunk = await Promise.all(
        tasks.map((t) =>
          executeTaskAsync(servers, t, { timeoutMs: wfTimeout }),
        ),
      );
      stageResults.push({
        stage: idx + 1,
        tasks_count: tasks.length,
        results: chunk,
      });
      prevStage = chunk;
    }

    res.json({
      workflow_id: `pipeline_${Date.now()}`,
      workflow_type: "pipeline",
      stages_count: parsed.data.stages.length,
      stage_results: stageResults,
      completed_at: new Date().toISOString(),
    });
  });

  app.post("/workflow/reflection", async (req: Request, res: Response) => {
    const parsed = workflowRequestSchema.safeParse(req.body ?? {});
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.flatten() });
      return;
    }
    if (parsed.data.workflow_type !== "reflection") {
      res.status(400).json({ error: "Invalid workflow type" });
      return;
    }
    if (!parsed.data.tasks.length) {
      res.status(400).json({
        error:
          "Reflection workflow requires at least 1 task (implementation). An optional 2nd task specifies the evaluation agent.",
      });
      return;
    }
    const servers = routingServers();
    for (const t of parsed.data.tasks) {
      const err = validateAgentEndpoint(t, servers);
      if (err) {
        res.status(400).json({ error: err });
        return;
      }
    }

    const meta = parsed.data.metadata ?? {};
    const maxIterations = Number(meta.max_iterations ?? 3);
    const threshold = Number(meta.threshold ?? 0.85);
    const criteria = meta.criteria ?? [];

    let implementationTask: typeof parsed.data.tasks[0] = {
      ...parsed.data.tasks[0],
      context: { ...(parsed.data.tasks[0].context ?? {}) },
    };

    const iterations: Record<string, unknown>[] = [];
    let finalScore = 0;

    for (let i = 0; i < maxIterations; i++) {
      const impl = await executeTaskAsync(servers, implementationTask, {
        timeoutMs: 300_000,
      });

      const evalAgent =
        parsed.data.tasks.length > 1
          ? parsed.data.tasks[1].agent
          : "backend";
      const evalTask = agentTaskSchema.parse({
        agent: evalAgent,
        task: `Evaluate against criteria: ${JSON.stringify(criteria)}`,
        context: { implementation: impl, criteria },
        method: "POST",
        priority: "normal",
      });

      const evaluation = await executeTaskAsync(servers, evalTask, {
        timeoutMs: 300_000,
      });

      iterations.push({
        iteration: i + 1,
        implementation: impl,
        evaluation,
      });

      const evalBody = evaluation.result;
      let score: number;
      let feedback: unknown;
      if (evalBody && typeof evalBody === "object" && !Array.isArray(evalBody)) {
        const eb = evalBody as Record<string, unknown>;
        const s = eb.score ?? evaluation.score;
        score =
          typeof s === "string"
            ? Number.parseFloat(s)
            : typeof s === "number"
              ? s
              : 0;
        feedback = eb.feedback ?? evaluation.feedback;
      } else {
        score =
          typeof evaluation.score === "number"
            ? evaluation.score
            : typeof evaluation.score === "string"
              ? Number.parseFloat(evaluation.score)
              : 0;
        feedback = evaluation.feedback;
      }
      if (!Number.isFinite(score)) score = 0;

      if (score >= threshold) {
        finalScore = score;
        break;
      }

      implementationTask = {
        ...implementationTask,
        context: {
          ...(implementationTask.context ?? {}),
          previous_implementation: impl,
          feedback,
        },
      };
    }

    res.json({
      workflow_id: `reflection_${Date.now()}`,
      workflow_type: "reflection",
      iterations_executed: iterations.length,
      final_score: finalScore,
      results: iterations,
      completed_at: new Date().toISOString(),
    });
  });

  app.get("/backend/health", async (_req: Request, res: Response) => {
    const backend = routingServers().backend;
    if (!backend) {
      res.json({ backend_status: "not_configured" });
      return;
    }
    try {
      const ac = AbortSignal.timeout(5000);
      const resp = await fetch(`${backend.replace(/\/+$/, "")}/health`, {
        signal: ac,
      });
      let body: unknown;
      try {
        body = resp.ok ? await resp.json() : (await resp.text()).slice(0, 200);
      } catch {
        body = "parse_error";
      }
      res.json({
        backend_status: resp.status,
        body,
      });
    } catch (e) {
      res.json({
        backend_status: "unreachable",
        error: String(e).slice(0, 200),
      });
    }
  });

  app.get("/backend/auth/status", (_req: Request, res: Response) => {
    const backend = routingServers().backend;
    const routes = [
      "register",
      "login",
      "verify-email",
      "refresh",
      "forgot-password",
    ];
    res.json({
      auth_base: backend ? `${backend.replace(/\/+$/, "")}/api/auth` : null,
      routes,
      note:
        "POST to each route via the backend directly; this is an info endpoint",
    });
  });

  /** Redis streams — Python `mcp-hub` on hybrid compose until ported to TS + REDIS_URL. */
  const stream503 = (_req: Request, res: Response) => {
    res.status(503).json({
      error:
        "Redis stream endpoints are not implemented in mcp-hub-ts; run mcp-hub (Python) or add REDIS_URL support here.",
    });
  };
  app.post("/stream/publish", stream503);
  app.get("/stream/read", stream503);
  app.get("/stream/info", stream503);
  app.post("/logs/sweep", (_req: Request, res: Response) => {
    res.status(503).json({
      error:
        "logs/sweep not implemented in mcp-hub-ts; use Python hub or backend cron.",
    });
  });
  app.post("/pipelines/bim-carbon", (_req: Request, res: Response) => {
    res.status(503).json({
      error:
        "pipelines/bim-carbon not implemented in mcp-hub-ts; use Python mcp-hub.",
    });
  });
  app.post("/gemini/review", (_req: Request, res: Response) => {
    res.status(503).json({
      error: "gemini/review not implemented in mcp-hub-ts; use Python mcp-hub.",
    });
  });
  const sandbox503 = (_req: Request, res: Response) => {
    res.status(503).json({
      error: "sandbox/* not implemented in mcp-hub-ts; use Python mcp-hub.",
    });
  };
  app.get("/sandbox/ping", sandbox503);
  app.post("/sandbox/create", sandbox503);
  app.post("/sandbox/execute", sandbox503);
  app.post("/sandbox/file/read", sandbox503);
  app.post("/sandbox/file/write", sandbox503);
  app.post("/sandbox/destroy", sandbox503);
  app.get("/sandbox/tools", sandbox503);

  return app;
}

function main(): void {
  if (MCP_HUB_API_KEY) {
    console.info("mcp-hub-ts: MCP_HUB_API_KEY set — Bearer auth enabled");
  } else {
    console.warn(
      "mcp-hub-ts: MCP_HUB_API_KEY unset — hub is open (set for production)",
    );
  }
  const servers = getMcpServers();
  console.info(
    "mcp-hub-ts: registered agents:",
    Object.keys(servers).filter((k) => servers[k]?.trim()),
  );
  const app = createHubApp();
  app.listen(PORT, "0.0.0.0", () => {
    console.info(`mcp-hub-ts listening on 0.0.0.0:${PORT}`);
  });
}

main();
