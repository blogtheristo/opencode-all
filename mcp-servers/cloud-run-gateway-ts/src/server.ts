/**
 * DWS MCP Gateway — Cloud Run (TypeScript)
 *
 * Streamable HTTP MCP surface for Supabase + GitHub (same tools as Python
 * cloud-run-gateway). Deploy under GCP project operated via admin@dws.com.
 */
import { randomUUID } from "node:crypto";
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { isInitializeRequest } from "@modelcontextprotocol/sdk/types.js";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createMcpExpressApp } from "@modelcontextprotocol/sdk/server/express.js";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Request, Response } from "express";
import { z } from "zod";

const GITHUB_API = "https://api.github.com";
const PORT = Number(process.env.PORT ?? 8080);
const MCP_GATEWAY_API_KEY = process.env.MCP_GATEWAY_API_KEY ?? "";

let supabaseClient: SupabaseClient | null = null;

function getSupabase(): SupabaseClient {
  if (!supabaseClient) {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_KEY;
    if (!url || !key) {
      throw new Error("SUPABASE_URL and SUPABASE_SERVICE_KEY must be set");
    }
    supabaseClient = createClient(url, key);
  }
  return supabaseClient;
}

function githubHeaders(): Record<string, string> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) throw new Error("GITHUB_TOKEN must be set");
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "User-Agent": "DWS-MCP-Gateway-TS/2.0",
    "X-GitHub-Api-Version": "2022-11-28",
  };
}

function jsonResult(data: unknown): CallToolResult {
  return {
    content: [
      {
        type: "text",
        text:
          typeof data === "string"
            ? data
            : JSON.stringify(data, null, 2),
      },
    ],
  };
}

function registerGatewayTools(server: McpServer): void {
  server.registerTool(
    "supabase_query",
    {
      description:
        "Query a Supabase table with optional filters, ordering, and limits.",
      inputSchema: {
        table: z.string(),
        select: z.string().optional().default("*"),
        filters: z.record(z.string(), z.unknown()).optional(),
        limit: z.number().int().positive().max(500).optional().default(100),
        order_by: z.string().optional(),
        ascending: z.boolean().optional().default(true),
      },
    },
    async (args) => {
      const db = getSupabase();
      let q = db.from(args.table).select(args.select ?? "*");
      if (args.filters) {
        for (const [col, val] of Object.entries(args.filters)) {
          q = q.eq(col, val as string | number | boolean);
        }
      }
      if (args.order_by) {
        q = q.order(args.order_by, { ascending: args.ascending });
      }
      const { data, error } = await q.limit(args.limit);
      if (error) throw error;
      return jsonResult({ count: data?.length ?? 0, data });
    },
  );

  server.registerTool(
    "supabase_insert",
    {
      description: "Insert one or more rows into a Supabase table.",
      inputSchema: {
        table: z.string(),
        rows: z.array(z.record(z.string(), z.unknown())),
      },
    },
    async (args) => {
      const db = getSupabase();
      const { data, error } = await db
        .from(args.table)
        .insert(args.rows)
        .select();
      if (error) throw error;
      return jsonResult({ inserted: data?.length ?? 0, data });
    },
  );

  server.registerTool(
    "supabase_update",
    {
      description:
        "Update rows matching equality filters in a Supabase table.",
      inputSchema: {
        table: z.string(),
        updates: z.record(z.string(), z.unknown()),
        match: z.record(z.string(), z.unknown()),
      },
    },
    async (args) => {
      const db = getSupabase();
      let q = db.from(args.table).update(args.updates);
      for (const [col, val] of Object.entries(args.match)) {
        q = q.eq(col, val as string | number | boolean);
      }
      const { data, error } = await q.select();
      if (error) throw error;
      return jsonResult({ updated: data?.length ?? 0, data });
    },
  );

  server.registerTool(
    "supabase_rpc",
    {
      description: "Call a Supabase/PostgreSQL RPC function.",
      inputSchema: {
        function_name: z.string(),
        params: z.record(z.string(), z.unknown()).optional(),
      },
    },
    async (args) => {
      const db = getSupabase();
      const { data, error } = await db.rpc(
        args.function_name,
        args.params ?? {},
      );
      if (error) throw error;
      return jsonResult({ data });
    },
  );

  server.registerTool(
    "supabase_list_tables",
    {
      description: "List tables in the public schema (via RPC or fallback).",
      inputSchema: {},
    },
    async () => {
      const db = getSupabase();
      try {
        const { data: rpcData } = await db.rpc("get_table_info");
        if (rpcData && Array.isArray(rpcData) && rpcData.length > 0) {
          return jsonResult({ tables: rpcData });
        }
      } catch {
        /* fall through */
      }
      const { data, error } = await db
        .from("information_schema.tables")
        .select("table_name, table_type")
        .eq("table_schema", "public");
      if (error) throw error;
      return jsonResult({ tables: data ?? [] });
    },
  );

  server.registerTool(
    "github_list_repos",
    {
      description: "List GitHub repositories for an org, user, or the token owner.",
      inputSchema: {
        org: z.string().optional(),
        user: z.string().optional(),
        sort: z.string().optional().default("updated"),
        per_page: z.number().int().min(1).max(100).optional().default(30),
      },
    },
    async (args) => {
      let url: string;
      if (args.org) url = `${GITHUB_API}/orgs/${args.org}/repos`;
      else if (args.user) url = `${GITHUB_API}/users/${args.user}/repos`;
      else url = `${GITHUB_API}/user/repos`;

      const params = new URLSearchParams({
        sort: args.sort,
        per_page: String(args.per_page),
      });
      const resp = await fetch(`${url}?${params}`, {
        headers: githubHeaders(),
      });
      if (!resp.ok) throw new Error(`${resp.status} ${await resp.text()}`);
      const repos = (await resp.json()) as Record<string, unknown>[];
      return jsonResult({
        count: repos.length,
        repos: repos.map((r) => ({
          full_name: r.full_name,
          description: r.description,
          url: r.html_url,
          updated_at: r.updated_at,
          language: r.language,
          stars: r.stargazers_count,
        })),
      });
    },
  );

  server.registerTool(
    "github_get_repo",
    {
      description: "Get repository metadata.",
      inputSchema: {
        owner: z.string(),
        repo: z.string(),
      },
    },
    async (args) => {
      const resp = await fetch(
        `${GITHUB_API}/repos/${args.owner}/${args.repo}`,
        { headers: githubHeaders() },
      );
      if (!resp.ok) throw new Error(`${resp.status} ${await resp.text()}`);
      return jsonResult(await resp.json());
    },
  );

  server.registerTool(
    "github_list_issues",
    {
      description: "List issues for a repository.",
      inputSchema: {
        owner: z.string(),
        repo: z.string(),
        state: z.string().optional().default("open"),
        labels: z.string().optional(),
        per_page: z.number().int().min(1).max(100).optional().default(30),
      },
    },
    async (args) => {
      const params = new URLSearchParams({
        state: args.state,
        per_page: String(args.per_page),
      });
      if (args.labels) params.set("labels", args.labels);
      const resp = await fetch(
        `${GITHUB_API}/repos/${args.owner}/${args.repo}/issues?${params}`,
        { headers: githubHeaders() },
      );
      if (!resp.ok) throw new Error(`${resp.status} ${await resp.text()}`);
      const issues = (await resp.json()) as Record<string, unknown>[];
      const filtered = issues.filter((i) => !("pull_request" in i));
      return jsonResult({
        count: filtered.length,
        issues: filtered.map((i) => ({
          number: i.number,
          title: i.title,
          state: i.state,
          author: (i.user as Record<string, unknown>)?.login,
          labels: ((i.labels as Record<string, unknown>[]) ?? []).map(
            (l) => l.name,
          ),
          created_at: i.created_at,
          url: i.html_url,
        })),
      });
    },
  );

  server.registerTool(
    "github_list_prs",
    {
      description: "List pull requests for a repository.",
      inputSchema: {
        owner: z.string(),
        repo: z.string(),
        state: z.string().optional().default("open"),
        per_page: z.number().int().min(1).max(100).optional().default(30),
      },
    },
    async (args) => {
      const params = new URLSearchParams({
        state: args.state,
        per_page: String(args.per_page),
      });
      const resp = await fetch(
        `${GITHUB_API}/repos/${args.owner}/${args.repo}/pulls?${params}`,
        { headers: githubHeaders() },
      );
      if (!resp.ok) throw new Error(`${resp.status} ${await resp.text()}`);
      const prs = (await resp.json()) as Record<string, unknown>[];
      return jsonResult({
        count: prs.length,
        pull_requests: prs.map((p) => ({
          number: p.number,
          title: p.title,
          state: p.state,
          author: (p.user as Record<string, unknown>)?.login,
          head: (p.head as Record<string, unknown>)?.ref,
          base: (p.base as Record<string, unknown>)?.ref,
          created_at: p.created_at,
          url: p.html_url,
          draft: p.draft ?? false,
        })),
      });
    },
  );

  server.registerTool(
    "github_get_file",
    {
      description: "Fetch file contents from a repository.",
      inputSchema: {
        owner: z.string(),
        repo: z.string(),
        path: z.string(),
        ref: z.string().optional(),
      },
    },
    async (args) => {
      const params = args.ref ? `?ref=${encodeURIComponent(args.ref)}` : "";
      const encodedPath = args.path
        .split("/")
        .map((p) => encodeURIComponent(p))
        .join("/");
      const resp = await fetch(
        `${GITHUB_API}/repos/${args.owner}/${args.repo}/contents/${encodedPath}${params}`,
        { headers: githubHeaders() },
      );
      if (!resp.ok) throw new Error(`${resp.status} ${await resp.text()}`);
      const data = (await resp.json()) as Record<string, unknown>;
      let content = "";
      if (data.encoding === "base64" && typeof data.content === "string") {
        content = Buffer.from(data.content.replace(/\n/g, ""), "base64").toString(
          "utf-8",
        );
      }
      return jsonResult({
        name: data.name,
        path: data.path,
        size: data.size,
        sha: data.sha,
        content,
      });
    },
  );

  server.registerTool(
    "github_search_code",
    {
      description: "Search code on GitHub.",
      inputSchema: {
        query: z.string(),
        owner: z.string().optional(),
        repo: z.string().optional(),
        per_page: z.number().int().min(1).max(100).optional().default(20),
      },
    },
    async (args) => {
      let q = args.query;
      if (args.repo) q += ` repo:${args.repo}`;
      else if (args.owner) q += ` user:${args.owner}`;
      const params = new URLSearchParams({ q, per_page: String(args.per_page) });
      const resp = await fetch(`${GITHUB_API}/search/code?${params}`, {
        headers: githubHeaders(),
      });
      if (!resp.ok) throw new Error(`${resp.status} ${await resp.text()}`);
      const data = (await resp.json()) as {
        total_count: number;
        items: Record<string, unknown>[];
      };
      return jsonResult({
        total_count: data.total_count,
        items: data.items.map((item) => ({
          name: item.name,
          path: item.path,
          repo: (item.repository as Record<string, unknown>)?.full_name,
          url: item.html_url,
        })),
      });
    },
  );

  server.registerTool(
    "github_create_issue",
    {
      description: "Create an issue in a repository.",
      inputSchema: {
        owner: z.string(),
        repo: z.string(),
        title: z.string(),
        body: z.string().optional().default(""),
        labels: z.array(z.string()).optional(),
      },
    },
    async (args) => {
      const payload: Record<string, unknown> = {
        title: args.title,
        body: args.body,
      };
      if (args.labels?.length) payload.labels = args.labels;
      const resp = await fetch(
        `${GITHUB_API}/repos/${args.owner}/${args.repo}/issues`,
        {
          method: "POST",
          headers: {
            ...githubHeaders(),
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      );
      if (!resp.ok) throw new Error(`${resp.status} ${await resp.text()}`);
      const issue = (await resp.json()) as Record<string, unknown>;
      return jsonResult({
        number: issue.number,
        title: issue.title,
        url: issue.html_url,
      });
    },
  );

  server.registerTool(
    "gateway_health",
    {
      description: "Health check for gateway + Supabase + GitHub connectivity.",
      inputSchema: {},
    },
    async () => {
      const status: Record<string, unknown> = {
        gateway: "healthy",
        timestamp: new Date().toISOString(),
        services: {} as Record<string, unknown>,
      };
      try {
        const db = getSupabase();
        const { error } = await db.from("agent_logs").select("id").limit(1);
        if (error) throw error;
        (status.services as Record<string, unknown>).supabase = "connected";
      } catch (e) {
        (status.services as Record<string, unknown>).supabase = `error: ${String(e)}`;
      }
      const ghToken = process.env.GITHUB_TOKEN;
      if (!ghToken) {
        (status.services as Record<string, unknown>).github =
          "skipped: GITHUB_TOKEN not set";
      } else {
        try {
          const resp = await fetch(`${GITHUB_API}/rate_limit`, {
            headers: githubHeaders(),
          });
          if (!resp.ok) throw new Error(await resp.text());
          const limits = (await resp.json()) as {
            rate?: { remaining: number; reset: number };
            resources?: { core?: { remaining: number; reset: number } };
          };
          const core = limits.rate ?? limits.resources?.core;
          (status.services as Record<string, unknown>).github = {
            status: "connected",
            rate_limit_remaining: core?.remaining,
            rate_limit_reset: core?.reset,
          };
        } catch (e) {
          (status.services as Record<string, unknown>).github =
            `error: ${String(e)}`;
        }
      }
      return jsonResult(status);
    },
  );
}

function createGatewayMcpServer(): McpServer {
  const server = new McpServer(
    {
      name: "DWS MCP Gateway",
      version: "2.0.0",
    },
    {
      instructions:
        "Cloud Run MCP gateway (TypeScript): Supabase + GitHub tools for remote Claude / Cursor sessions.",
    },
  );
  registerGatewayTools(server);
  return server;
}

function authMiddleware(req: Request, res: Response, next: () => void): void {
  if (req.path === "/health") {
    next();
    return;
  }
  if (!MCP_GATEWAY_API_KEY) {
    next();
    return;
  }
  const h = req.headers.authorization;
  if (!h?.startsWith("Bearer ") || h.slice(7) !== MCP_GATEWAY_API_KEY) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  next();
}

function parseTransport(): "stdio" | "streamable-http" {
  const argv = process.argv.slice(2);
  const idx = argv.indexOf("--transport");
  if (idx >= 0 && argv[idx + 1]) {
    const v = argv[idx + 1];
    if (v === "stdio") return "stdio";
    if (v === "streamable-http" || v === "http") return "streamable-http";
  }
  const env = process.env.MCP_GATEWAY_TRANSPORT?.toLowerCase();
  if (env === "stdio") return "stdio";
  return "streamable-http";
}

async function runStdio(): Promise<void> {
  const server = createGatewayMcpServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

export function runHttp(): void {
  const app = createMcpExpressApp({ host: "0.0.0.0" });
  app.use(authMiddleware);

  app.get("/health", (_req: Request, res: Response) => {
    res.json({
      service: "dws-mcp-gateway-ts",
      status: "ok",
      timestamp: new Date().toISOString(),
    });
  });

  const transports: Record<string, StreamableHTTPServerTransport> = {};

  app.post("/mcp", async (req: Request, res: Response) => {
    try {
      const sessionHeader = req.headers["mcp-session-id"];
      const sessionId = Array.isArray(sessionHeader)
        ? sessionHeader[0]
        : sessionHeader;

      let transport: StreamableHTTPServerTransport;

      if (sessionId && transports[sessionId]) {
        transport = transports[sessionId];
      } else if (!sessionId && isInitializeRequest(req.body)) {
        transport = new StreamableHTTPServerTransport({
          sessionIdGenerator: () => randomUUID(),
          onsessioninitialized: (sid: string) => {
            transports[sid] = transport;
          },
        });
        const server = createGatewayMcpServer();
        await server.connect(transport);
        await transport.handleRequest(req, res, req.body);
        return;
      } else {
        res.status(400).json({
          jsonrpc: "2.0",
          error: {
            code: -32000,
            message: "Bad Request: No valid session ID provided",
          },
          id: null,
        });
        return;
      }

      await transport.handleRequest(req, res, req.body);
    } catch (err) {
      console.error("MCP POST error:", err);
      if (!res.headersSent) {
        res.status(500).json({
          jsonrpc: "2.0",
          error: { code: -32603, message: "Internal server error" },
          id: null,
        });
      }
    }
  });

  app.get("/mcp", async (req: Request, res: Response) => {
    const sessionHeader = req.headers["mcp-session-id"];
    const sessionId = Array.isArray(sessionHeader)
      ? sessionHeader[0]
      : sessionHeader;
    if (!sessionId || !transports[sessionId]) {
      res.status(400).send("Invalid or missing session ID");
      return;
    }
    await transports[sessionId].handleRequest(req, res);
  });

  if (!MCP_GATEWAY_API_KEY) {
    console.warn("MCP_GATEWAY_API_KEY unset — gateway accepts unauthenticated requests");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.info(`dws-mcp-gateway-ts listening on 0.0.0.0:${PORT}`);
  });

  process.on("SIGINT", async () => {
    await Promise.all(
      Object.values(transports).map((t) => t.close().catch(() => {})),
    );
    process.exit(0);
  });
}

const mode = parseTransport();
if (mode === "stdio") {
  runStdio().catch((err) => {
    console.error(err);
    process.exit(1);
  });
} else {
  runHttp();
}
