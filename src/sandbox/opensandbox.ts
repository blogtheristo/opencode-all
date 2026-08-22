/**
 * OpenSandbox Integration — DWS IQ Agent Foundry Stage 1.5
 *
 * Connects DWS IQ agents to OpenSandbox (https://github.com/alibaba/OpenSandbox)
 * running on the Acer Veriton edge node.
 *
 * OpenSandbox provides:
 * - Docker-based agent isolation (local hardware, zero cloud egress)
 * - Multi-language code execution (Python, Node, Bash, …)
 * - Filesystem isolation per sandbox instance
 * - Network egress controls via OpenSandbox network policy
 * - Real-time command streaming
 *
 * Architecture:
 *   DWS Express Backend → OpenSandbox TypeScript SDK
 *     → OpenSandbox Server (http://OPENSANDBOX_HOST:8080)
 *       → Docker containers on Acer Veriton
 *
 * Stage 1.5 — Acer Veriton Edge:
 *   Between Stage 1 (SDK sandbox, demo) and Stage 2 (Cloud Run, paid multi-tenant).
 *   Suitable for internal pilots, EU-air-gapped data scenarios, and dev environments.
 *   Cost: €0 (local hardware). Data never leaves the Veriton.
 *
 * NIS2 applicability: YES — sandbox isolates agent filesystem and network per task.
 *
 * @module sandbox/opensandbox
 * @version 1.0.0
 * @license Proprietary - Lifetime Oy
 */

import logger from '../utils/logger.js';

// ============================================================================
// Types (mirrors @alibaba-group/opensandbox SDK)
// ============================================================================

export interface OpenSandboxConfig {
  /** OpenSandbox server URL (e.g. http://192.168.1.10:8080) */
  host: string;
  /** Optional API key for OpenSandbox server auth */
  apiKey?: string;
  /** Default Docker image for agent containers */
  defaultImage?: string;
  /** Request timeout in milliseconds (default: 300_000) */
  timeoutMs?: number;
}

export interface SandboxCreateOptions {
  /** Docker image to use for this sandbox */
  image?: string;
  /** Entrypoint override */
  entrypoint?: string[];
  /** Environment variables injected into the container */
  env?: Record<string, string>;
  /** Timeout in seconds (default: 300) */
  timeoutSeconds?: number;
  /** Memory limit (e.g. "512Mi", "1Gi") */
  memory?: string;
  /** CPU limit (e.g. "1", "0.5") */
  cpu?: string;
  /** Network policy: deny all egress except allow-list */
  networkPolicy?: {
    allowedDomains: string[];
    denyByDefault: boolean;
  };
}

export interface CommandResult {
  stdout: string;
  stderr: string;
  exitCode: number;
  durationMs: number;
}

export interface SandboxFileEntry {
  path: string;
  data: string;
  /** Octal mode e.g. 644 */
  mode?: number;
}

export interface OpenSandboxInstance {
  /** Unique sandbox ID */
  id: string;
  /** Docker image used */
  image: string;
  /** ISO timestamp when created */
  createdAt: string;
  /** Current state */
  status: 'running' | 'paused' | 'stopped' | 'error';
}

export interface AgentSandboxResult {
  sandboxId: string;
  tenantId: string;
  agentName: string;
  commandResults: CommandResult[];
  artifacts: Record<string, string>;  // path → content
  durationMs: number;
  status: 'success' | 'error';
  error?: string;
}

// ============================================================================
// Constants
// ============================================================================

const DEFAULT_IMAGE = 'opensandbox/code-interpreter:v1.0.1';
const DEFAULT_TIMEOUT_MS = 300_000; // 5 minutes
const OPENSANDBOX_DEFAULT_PORT = 8080;

// ============================================================================
// OpenSandbox Client
// ============================================================================

/**
 * Thin REST client for the OpenSandbox server API.
 * Used when the @alibaba-group/opensandbox npm package is not available,
 * or as the direct HTTP layer beneath the SDK.
 *
 * OpenSandbox exposes a REST API that mirrors the SDK:
 *   POST /sandboxes          → create sandbox
 *   POST /sandboxes/:id/exec → execute command
 *   GET  /sandboxes/:id/files/:path → read file
 *   PUT  /sandboxes/:id/files → write files
 *   DELETE /sandboxes/:id    → destroy sandbox
 */
export class OpenSandboxClient {
  private readonly baseUrl: string;
  private readonly apiKey: string | undefined;
  private readonly timeoutMs: number;
  private readonly defaultImage: string;

  constructor(config: OpenSandboxConfig) {
    const host = config.host.replace(/\/$/, '');
    this.baseUrl = host.includes(':') ? host : `${host}:${OPENSANDBOX_DEFAULT_PORT}`;
    this.apiKey = config.apiKey;
    this.timeoutMs = config.timeoutMs ?? DEFAULT_TIMEOUT_MS;
    this.defaultImage = config.defaultImage ?? DEFAULT_IMAGE;
  }

  private buildHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
    if (this.apiKey) {
      headers['Authorization'] = `Bearer ${this.apiKey}`;
    }
    return headers;
  }

  private async request<T>(method: string, path: string, body?: unknown): Promise<T> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeoutMs);

    const url = `${this.baseUrl}${path}`;
    logger.debug('OpenSandbox API request', { method, url });

    try {
      const res = await fetch(url, {
        method,
        headers: this.buildHeaders(),
        body: body !== null && body !== undefined ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });

      if (!res.ok) {
        const text = await res.text().catch(() => '(no body)');
        throw new Error(`OpenSandbox API error ${res.status}: ${text}`);
      }

      return res.json() as Promise<T>;
    } finally {
      clearTimeout(timer);
    }
  }

  // ── Lifecycle ─────────────────────────────────────────────────────────────

  /**
   * Create a new sandbox container on the Acer Veriton.
   * Returns a sandbox instance with its ID.
   */
  async create(opts: SandboxCreateOptions = {}): Promise<OpenSandboxInstance> {
    const payload = {
      image: opts.image ?? this.defaultImage,
      entrypoint: opts.entrypoint,
      env: opts.env ?? {},
      timeout: opts.timeoutSeconds ?? 300,
      resources: {
        memory: opts.memory ?? '512Mi',
        cpu: opts.cpu ?? '1',
      },
      networkPolicy: opts.networkPolicy ?? {
        allowedDomains: [],
        denyByDefault: true,
      },
    };

    const instance = await this.request<OpenSandboxInstance>('POST', '/sandboxes', payload);
    logger.info('OpenSandbox sandbox created', {
      sandboxId: instance.id,
      image: instance.image,
    });
    return instance;
  }

  /**
   * Execute a shell command inside a running sandbox.
   */
  async execute(sandboxId: string, command: string): Promise<CommandResult> {
    const start = Date.now();
    const result = await this.request<{ stdout: string; stderr: string; exitCode: number }>(
      'POST',
      `/sandboxes/${sandboxId}/exec`,
      { command },
    );
    return {
      ...result,
      durationMs: Date.now() - start,
    };
  }

  /**
   * Read a file from the sandbox filesystem.
   */
  async readFile(sandboxId: string, path: string): Promise<string> {
    const res = await this.request<{ content: string }>(
      'GET',
      `/sandboxes/${encodeURIComponent(sandboxId)}/files/${encodeURIComponent(path)}`,
    );
    return res.content;
  }

  /**
   * Write one or more files into the sandbox filesystem.
   */
  async writeFiles(sandboxId: string, files: SandboxFileEntry[]): Promise<void> {
    await this.request<unknown>('PUT', `/sandboxes/${sandboxId}/files`, { files });
  }

  /**
   * Destroy a sandbox and release all resources.
   */
  async destroy(sandboxId: string): Promise<void> {
    await this.request<unknown>('DELETE', `/sandboxes/${sandboxId}`);
    logger.info('OpenSandbox sandbox destroyed', { sandboxId });
  }

  /**
   * Get current sandbox status.
   */
  async status(sandboxId: string): Promise<OpenSandboxInstance> {
    return this.request<OpenSandboxInstance>('GET', `/sandboxes/${sandboxId}`);
  }

  /**
   * Health check against the OpenSandbox server.
   * Returns true if the server is reachable.
   */
  async ping(): Promise<boolean> {
    try {
      await this.request<unknown>('GET', '/health');
      return true;
    } catch {
      return false;
    }
  }
}

// ============================================================================
// Agent Sandbox Runner
// ============================================================================

/**
 * Run a DWS agent task inside an OpenSandbox container.
 *
 * This is the high-level function called by src/sandbox/index.ts (Stage 1.5).
 *
 * Lifecycle:
 *   1. Create sandbox (Acer Veriton Docker)
 *   2. Write input payload as JSON file
 *   3. Execute agent entrypoint command
 *   4. Collect output + artifacts
 *   5. Destroy sandbox
 */
export async function runAgentInOpenSandbox(opts: {
  client: OpenSandboxClient;
  tenantId: string;
  agentName: string;
  input: Record<string, unknown>;
  sandboxOpts?: SandboxCreateOptions;
}): Promise<AgentSandboxResult> {
  const { client, tenantId, agentName, input, sandboxOpts } = opts;
  const start = Date.now();
  let sandboxId: string | null = null;

  try {
    // 1. Create isolated container
    const instance = await client.create({
      ...sandboxOpts,
      env: {
        TENANT_ID: tenantId,
        AGENT_NAME: agentName,
        DWS_ENV: process.env.NODE_ENV ?? 'production',
        ...sandboxOpts?.env,
      },
    });
    sandboxId = instance.id;

    // 2. Write input payload
    await client.writeFiles(sandboxId, [
      {
        path: '/input/payload.json',
        data: JSON.stringify({ tenantId, agentName, input }, null, 2),
        mode: 644,
      },
    ]);

    // 3. Execute agent — expects /agent.sh or npx tsx agent entrypoint
    const cmd = `cd /workspace && npx tsx agent.ts --input /input/payload.json --output /output/result.json`;
    const execResult = await client.execute(sandboxId, cmd);

    // 4. Read output artifact
    let result: Record<string, unknown> = {};
    try {
      const raw = await client.readFile(sandboxId, '/output/result.json');
      result = JSON.parse(raw) as Record<string, unknown>;
    } catch {
      // Agent may have written to stdout instead
      result = { stdout: execResult.stdout, exitCode: execResult.exitCode };
    }

    logger.info('OpenSandbox agent execution complete', {
      tenantId,
      agentName,
      sandboxId,
      exitCode: execResult.exitCode,
      durationMs: Date.now() - start,
    });

    return {
      sandboxId,
      tenantId,
      agentName,
      commandResults: [execResult],
      artifacts: result as Record<string, string>,
      durationMs: Date.now() - start,
      status: execResult.exitCode === 0 ? 'success' : 'error',
      error: execResult.exitCode !== 0 ? execResult.stderr : undefined,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    logger.error('OpenSandbox agent execution failed', {
      tenantId,
      agentName,
      sandboxId,
      error: message,
    });
    return {
      sandboxId: sandboxId ?? 'unknown',
      tenantId,
      agentName,
      commandResults: [],
      artifacts: {},
      durationMs: Date.now() - start,
      status: 'error',
      error: message,
    };
  } finally {
    // 5. Always destroy — ephemeral by design
    if (sandboxId) {
      await client.destroy(sandboxId).catch((e: unknown) => {
        logger.warn('OpenSandbox destroy failed (leaked container)', {
          sandboxId,
          error: e instanceof Error ? e.message : String(e),
        });
      });
    }
  }
}

// ============================================================================
// Factory: build client from environment
// ============================================================================

/**
 * Build an OpenSandboxClient from environment variables.
 *
 * Required env:
 *   OPENSANDBOX_HOST  — URL of the OpenSandbox server on Acer Veriton
 *                        e.g. http://192.168.1.50:8080
 *
 * Optional env:
 *   OPENSANDBOX_API_KEY     — Auth token for the server
 *   OPENSANDBOX_IMAGE       — Default Docker image (default: code-interpreter:v1.0.1)
 *   OPENSANDBOX_TIMEOUT_MS  — Request timeout in ms (default: 300000)
 */
export function buildOpenSandboxClient(): OpenSandboxClient {
  const host = process.env.OPENSANDBOX_HOST;
  if (!host) {
    throw new Error(
      'OPENSANDBOX_HOST is not set. ' +
      'Set it to the Acer Veriton OpenSandbox server URL (e.g. http://192.168.1.50:8080).',
    );
  }

  return new OpenSandboxClient({
    host,
    apiKey: process.env.OPENSANDBOX_API_KEY,
    defaultImage: process.env.OPENSANDBOX_IMAGE ?? DEFAULT_IMAGE,
    timeoutMs: process.env.OPENSANDBOX_TIMEOUT_MS
      ? parseInt(process.env.OPENSANDBOX_TIMEOUT_MS, 10)
      : DEFAULT_TIMEOUT_MS,
  });
}
