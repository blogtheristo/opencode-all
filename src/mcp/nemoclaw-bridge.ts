/**
 * OpenClaw MCP Bridge — DWS IQ 6 Agent Integration
 *
 * JSON-RPC 2.0 adapter connecting OpenClaw skills to DWS agents.
 * All calls are sandboxed inside KYA-governed Firecracker MicroVMs.
 *
 * Security constraints (from DWS security assessment, Feb 2026):
 *   - Community skills: BLOCKED (no auto-install)
 *   - MCP tool responses: untrusted input (prompt injection risk)
 *   - OpenClaw runs INSIDE KYA sandbox, never outside governance boundary
 *   - All bridge calls logged to Firehorse audit trail
 *
 * Architecture:
 *   DWS Agent → OpenClaw Bridge → KYA Sandbox → OpenClaw Runtime → Response
 *                    ↓                                      ↓
 *               Firehorse Log                        Input Sanitized
 */

import logger from '../utils/logger.js';

// ============================================================================
// TYPES
// ============================================================================

export interface OpenClawSkillManifest {
  /** Skill name (DWS-registered only, no community skills) */
  name: string;

  /** Human-readable description */
  description: string;

  /** Input schema (JSON Schema subset) */
  inputSchema: Record<string, unknown>;

  /** Output schema (JSON Schema subset) */
  outputSchema: Record<string, unknown>;

  /** Whether this skill requires network access */
  requiresNetwork: boolean;

  /** Whether this skill requires filesystem access */
  requiresFilesystem: boolean;

  /** KYA trust score minimum to invoke this skill (ATS 0–100) */
  minimumATS: number;
}

export interface BridgeRequest {
  /** JSON-RPC 2.0 method */
  method: string;

  /** Parameters for the skill invocation */
  params: Record<string, unknown>;

  /** DWS agent ID making the request */
  callerAgentId: string;

  /** KYA session ID for audit trail */
  kyaSessionId: string;
}

export interface BridgeResponse {
  /** Whether the call succeeded */
  success: boolean;

  /** Result data (sanitized) */
  result: Record<string, unknown> | null;

  /** Error message if failed */
  error: string | null;

  /** Firehorse audit event ID */
  auditEventId: string;

  /** Execution time in ms */
  durationMs: number;
}

export interface BridgeConfig {
  /** OpenClaw runtime endpoint (local only — never cloud) */
  openclawEndpoint: string;

  /** Optional bearer token for OpenClaw runtime authentication */
  openclawApiKey: string | null;

  /** Maximum response size in bytes before truncation */
  maxResponseBytes: number;

  /** Timeout for skill invocations in ms */
  timeoutMs: number;

  /** Firehorse log base path */
  logBasePath: string;

  /** Allowed skill names (whitelist — no community skills) */
  allowedSkills: string[];
}

const DEFAULT_BRIDGE_CONFIG: BridgeConfig = {
  openclawEndpoint: 'http://127.0.0.1:3100',
  openclawApiKey: null,
  maxResponseBytes: 1_048_576, // 1MB
  timeoutMs: 30_000,
  logBasePath: '/mnt/firehorse-dms/logs',
  allowedSkills: [],
};

function parseIntegerEnv(
  value: string | undefined,
  fallback: number,
  opts: { min?: number } = {},
): number {
  if (!value) {
    return fallback;
  }

  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed)) {
    return fallback;
  }

  if (opts.min !== undefined && parsed < opts.min) {
    return fallback;
  }

  return parsed;
}

export function parseOpenClawAllowedSkills(value: string | undefined): string[] {
  if (!value) {
    return [];
  }

  return value
    .split(',')
    .map((skill) => skill.trim())
    .filter((skill) => skill.length > 0);
}

// ============================================================================
// INPUT SANITIZATION (anti-prompt-injection)
// ============================================================================

/**
 * Sanitize untrusted input from OpenClaw MCP responses.
 *
 * All MCP tool responses are treated as untrusted input per CLAUDE.md.
 * This strips potential prompt injection patterns before passing to DWS agents.
 */
function sanitizeResponse(raw: unknown): Record<string, unknown> {
  if (raw === null || raw === undefined) {
    return { _sanitized: true, _empty: true };
  }

  const str = typeof raw === 'string' ? raw : JSON.stringify(raw);

  // Strip common prompt injection patterns
  const injectionPatterns = [
    /\bignore\s+(all\s+)?previous\s+instructions?\b/gi,
    /\byou\s+are\s+now\b/gi,
    /\bsystem\s*:\s*/gi,
    /\b(ADMIN|ROOT|SUDO)\s*:/gi,
    /<\/?system[^>]*>/gi,
    /\[INST\]/gi,
    /<<SYS>>/gi,
  ];

  let sanitized = str;
  for (const pattern of injectionPatterns) {
    sanitized = sanitized.replace(pattern, '[SANITIZED]');
  }

  try {
    const parsed = JSON.parse(sanitized);
    return { _sanitized: true, data: parsed };
  } catch {
    return { _sanitized: true, data: sanitized };
  }
}

// ============================================================================
// BRIDGE IMPLEMENTATION
// ============================================================================

export class OpenClawBridge {
  private config: BridgeConfig;
  private registeredSkills: Map<string, OpenClawSkillManifest> = new Map();

  constructor(config: Partial<BridgeConfig> = {}) {
    this.config = { ...DEFAULT_BRIDGE_CONFIG, ...config };
  }

  /**
   * Build bridge configuration from environment variables.
   *
   * This lets OpenClaw consume values populated by the startup secret loader
   * instead of relying on hardcoded runtime configuration.
   */
  static fromEnv(config: Partial<BridgeConfig> = {}): OpenClawBridge {
    // OpenClaw → NemoClaw migration (DWS Doc Standard / migration plan
    // docs/migrations/2026-06-25-openclaw-to-nemoclaw.md, Phase 1): prefer the
    // NEMOCLAW_* env vars (OpenShell-sandboxed runtime) and fall back to the
    // legacy OPENCLAW_* vars so existing deployments keep working unchanged.
    return new OpenClawBridge({
      openclawEndpoint:
        process.env.NEMOCLAW_ENDPOINT ||
        process.env.OPENCLAW_ENDPOINT ||
        DEFAULT_BRIDGE_CONFIG.openclawEndpoint,
      openclawApiKey:
        process.env.NEMOCLAW_API_KEY ||
        process.env.OPENCLAW_API_KEY ||
        DEFAULT_BRIDGE_CONFIG.openclawApiKey,
      maxResponseBytes: parseIntegerEnv(
        process.env.NEMOCLAW_MAX_RESPONSE_BYTES || process.env.OPENCLAW_MAX_RESPONSE_BYTES,
        DEFAULT_BRIDGE_CONFIG.maxResponseBytes,
        { min: 1 },
      ),
      timeoutMs: parseIntegerEnv(
        process.env.NEMOCLAW_TIMEOUT_MS || process.env.OPENCLAW_TIMEOUT_MS,
        DEFAULT_BRIDGE_CONFIG.timeoutMs,
        { min: 1 },
      ),
      logBasePath:
        process.env.NEMOCLAW_LOG_BASE_PATH ||
        process.env.OPENCLAW_LOG_BASE_PATH ||
        DEFAULT_BRIDGE_CONFIG.logBasePath,
      allowedSkills: parseOpenClawAllowedSkills(
        process.env.NEMOCLAW_ALLOWED_SKILLS || process.env.OPENCLAW_ALLOWED_SKILLS,
      ),
      ...config,
    });
  }

  /**
   * Register a DWS-approved skill for use through the bridge.
   * Community skills are BLOCKED — only explicitly registered skills allowed.
   */
  registerSkill(manifest: OpenClawSkillManifest): void {
    if (!this.config.allowedSkills.includes(manifest.name)) {
      logger.warn('Attempted to register non-allowed skill', {
        skill: manifest.name,
        allowed: this.config.allowedSkills,
      });
      throw new Error(
        `Skill "${manifest.name}" is not in the allowed skills whitelist. ` +
          'Community skills are BLOCKED per DWS security policy.',
      );
    }

    this.registeredSkills.set(manifest.name, manifest);
    logger.info('OpenClaw skill registered', {
      skill: manifest.name,
      requiresNetwork: manifest.requiresNetwork,
      minimumATS: manifest.minimumATS,
    });
  }

  /**
   * List all registered (DWS-approved) skills.
   */
  listSkills(): OpenClawSkillManifest[] {
    return Array.from(this.registeredSkills.values());
  }

  /**
   * Invoke an OpenClaw skill through the KYA-governed bridge.
   *
   * Flow:
   *   1. Validate skill is registered (whitelist check)
   *   2. Check caller ATS meets minimum requirement
   *   3. Build JSON-RPC 2.0 request
   *   4. Send to OpenClaw runtime (local endpoint)
   *   5. Sanitize response (anti-prompt-injection)
   *   6. Log to Firehorse audit trail
   *   7. Return sanitized result
   */
  async invoke(request: BridgeRequest, callerATS: number): Promise<BridgeResponse> {
    const startTime = Date.now();
    const auditEventId = `openclaw-bridge-${Date.now()}-${request.callerAgentId}`;

    // 1. Validate skill is registered
    const skill = this.registeredSkills.get(request.method);
    if (!skill) {
      logger.warn('OpenClaw bridge: unregistered skill invocation blocked', {
        skill: request.method,
        caller: request.callerAgentId,
      });
      return {
        success: false,
        result: null,
        error: `Skill "${request.method}" is not registered. Community skills are BLOCKED.`,
        auditEventId,
        durationMs: Date.now() - startTime,
      };
    }

    // 2. Check ATS minimum (ATS is treated as 0–100)
    if (callerATS < skill.minimumATS) {
      logger.warn('OpenClaw bridge: ATS too low', {
        skill: request.method,
        callerATS,
        required: skill.minimumATS,
        caller: request.callerAgentId,
      });
      return {
        success: false,
        result: null,
        error: `Caller ATS (${callerATS.toFixed(0)}) below minimum (${skill.minimumATS}) for skill "${request.method}"`,
        auditEventId,
        durationMs: Date.now() - startTime,
      };
    }

    // 3. Build JSON-RPC 2.0 request
    const rpcRequest = {
      jsonrpc: '2.0',
      id: auditEventId,
      method: request.method,
      params: request.params,
    };

    // 4. Send to OpenClaw runtime
    let timeout: ReturnType<typeof setTimeout> | undefined;
    try {
      const controller = new AbortController();
      timeout = setTimeout(() => controller.abort(), this.config.timeoutMs);
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'X-KYA-Session': request.kyaSessionId,
        'X-DWS-Agent': request.callerAgentId,
      };

      if (this.config.openclawApiKey) {
        headers.Authorization = `Bearer ${this.config.openclawApiKey}`;
      }

      const response = await fetch(this.config.openclawEndpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify(rpcRequest),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`OpenClaw returned ${response.status}: ${response.statusText}`);
      }

      const rawBody = await response.text();

      // Check response size
      if (rawBody.length > this.config.maxResponseBytes) {
        logger.warn('OpenClaw response exceeds size limit, truncating', {
          size: rawBody.length,
          limit: this.config.maxResponseBytes,
        });
      }

      const truncated = rawBody.slice(0, this.config.maxResponseBytes);

      // 5. Sanitize response
      let parsed: unknown;
      try {
        parsed = JSON.parse(truncated);
      } catch {
        parsed = truncated;
      }

      const sanitized = sanitizeResponse(parsed);

      // 6. Log to Firehorse
      logger.info('OpenClaw bridge invocation', {
        skill: request.method,
        caller: request.callerAgentId,
        kyaSession: request.kyaSessionId,
        callerATS,
        success: true,
        durationMs: Date.now() - startTime,
        auditEventId,
      });

      // 7. Return sanitized result
      return {
        success: true,
        result: sanitized,
        error: null,
        auditEventId,
        durationMs: Date.now() - startTime,
      };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      logger.error('OpenClaw bridge invocation failed', {
        skill: request.method,
        caller: request.callerAgentId,
        error: message,
        auditEventId,
      });

      return {
        success: false,
        result: null,
        error: message,
        auditEventId,
        durationMs: Date.now() - startTime,
      };
    } finally {
      if (timeout) {
        clearTimeout(timeout);
      }
    }
  }
}
