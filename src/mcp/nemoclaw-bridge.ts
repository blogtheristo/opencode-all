/**
 * NemoClaw MCP Bridge — DWS IQ 6 Agent Integration
 *
 * JSON-RPC 2.0 adapter connecting NemoClaw skills to DWS agents.
 * All calls are sandboxed inside KYA-governed Firecracker MicroVMs.
 *
 * Security constraints (from DWS security assessment, Feb 2026):
 *   - Community skills: BLOCKED (no auto-install)
 *   - MCP tool responses: untrusted input (prompt injection risk)
 *   - NemoClaw runs INSIDE KYA sandbox, never outside governance boundary
 *   - All bridge calls logged to Firehorse audit trail
 *
 * Architecture:
 *   DWS Agent → NemoClaw Bridge → KYA Sandbox → NemoClaw Runtime → Response
 *                    ↓                                      ↓
 *               Firehorse Log                        Input Sanitized
 */

import logger from '../utils/logger.js';
import { CommandAuditLogger, type CommandAuditSink } from './command-audit-logger.js';

// ============================================================================
// TYPES
// ============================================================================

export interface NemoClawSkillManifest {
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
  /** NemoClaw runtime endpoint (local only — never cloud) */
  nemoclawEndpoint: string;

  /** Optional bearer token for NemoClaw runtime authentication */
  nemoclawApiKey: string | null;

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
  nemoclawEndpoint: 'http://127.0.0.1:3100',
  nemoclawApiKey: null,
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

export function parseNemoClawAllowedSkills(value: string | undefined): string[] {
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
 * Sanitize untrusted input from NemoClaw MCP responses.
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

export interface BridgeOptions {
  /**
   * EU AI Act Article 12 command-audit sink. When set, every invocation is
   * recorded to the append-only command_audit_log BEFORE execution (fail-closed),
   * and its result is recorded after. When absent (e.g. unit tests with no DB),
   * the bridge falls back to operational logging only.
   */
  auditSink?: CommandAuditSink;

  /** Nemotron model id recorded as provenance on each audit event. */
  modelVersion?: string | null;
}

export class NemoClawBridge {
  private config: BridgeConfig;
  private registeredSkills: Map<string, NemoClawSkillManifest> = new Map();
  private readonly auditSink?: CommandAuditSink;
  private readonly modelVersion: string | null;

  constructor(config: Partial<BridgeConfig> = {}, options: BridgeOptions = {}) {
    this.config = { ...DEFAULT_BRIDGE_CONFIG, ...config };
    this.auditSink = options.auditSink;
    this.modelVersion = options.modelVersion ?? null;
  }

  /**
   * Build bridge configuration from environment variables.
   *
   * This lets NemoClaw consume values populated by the startup secret loader
   * instead of relying on hardcoded runtime configuration.
   */
  static fromEnv(config: Partial<BridgeConfig> = {}, options: BridgeOptions = {}): NemoClawBridge {
    // NemoClaw (OpenShell-sandboxed) runtime config from environment, populated by
    // the startup secret loader. See docs/migrations/2026-06-25-openclaw-to-nemoclaw.md.
    return new NemoClawBridge(
      {
        nemoclawEndpoint: process.env.NEMOCLAW_ENDPOINT || DEFAULT_BRIDGE_CONFIG.nemoclawEndpoint,
        nemoclawApiKey: process.env.NEMOCLAW_API_KEY || DEFAULT_BRIDGE_CONFIG.nemoclawApiKey,
        maxResponseBytes: parseIntegerEnv(
          process.env.NEMOCLAW_MAX_RESPONSE_BYTES,
          DEFAULT_BRIDGE_CONFIG.maxResponseBytes,
          { min: 1 },
        ),
        timeoutMs: parseIntegerEnv(
          process.env.NEMOCLAW_TIMEOUT_MS,
          DEFAULT_BRIDGE_CONFIG.timeoutMs,
          {
            min: 1,
          },
        ),
        logBasePath: process.env.NEMOCLAW_LOG_BASE_PATH || DEFAULT_BRIDGE_CONFIG.logBasePath,
        allowedSkills: parseNemoClawAllowedSkills(process.env.NEMOCLAW_ALLOWED_SKILLS),
        ...config,
      },
      {
        // Wire EU AI Act Article 12 command logging when Supabase creds are
        // present. Stays null in unit tests (no DB env) — operational-log only.
        auditSink: CommandAuditLogger.fromEnvOrNull() ?? undefined,
        modelVersion: process.env.NEMOCLAW_MODEL_VERSION ?? null,
        ...options,
      },
    );
  }

  /**
   * Register a DWS-approved skill for use through the bridge.
   * Community skills are BLOCKED — only explicitly registered skills allowed.
   */
  registerSkill(manifest: NemoClawSkillManifest): void {
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
    logger.info('NemoClaw skill registered', {
      skill: manifest.name,
      requiresNetwork: manifest.requiresNetwork,
      minimumATS: manifest.minimumATS,
    });
  }

  /**
   * List all registered (DWS-approved) skills.
   */
  listSkills(): NemoClawSkillManifest[] {
    return Array.from(this.registeredSkills.values());
  }

  /**
   * Record a denied invocation to the Article 12 ledger. Denials run no command,
   * so a write failure here is surfaced loudly but does not change the outcome.
   */
  private async auditDenied(
    request: BridgeRequest,
    callerATS: number,
    minimumATS: number | null,
    deniedReason: string,
  ): Promise<void> {
    if (!this.auditSink) {
      return;
    }
    try {
      await this.auditSink.logInvocation({
        bridge: 'nemoclaw',
        agentId: request.callerAgentId,
        kyaSessionId: request.kyaSessionId,
        skill: request.method,
        params: request.params,
        callerAts: callerATS,
        minimumAts: minimumATS,
        decision: 'denied',
        deniedReason,
        modelVersion: this.modelVersion,
      });
    } catch (err: unknown) {
      logger.error('NemoClaw bridge: Article 12 denial log failed', {
        skill: request.method,
        caller: request.callerAgentId,
        error: err instanceof Error ? err.message : 'Unknown error',
      });
    }
  }

  /**
   * Invoke an NemoClaw skill through the KYA-governed bridge.
   *
   * Flow:
   *   1. Validate skill is registered (whitelist check)
   *   2. Check caller ATS meets minimum requirement
   *   3. Article 12 pre-flight log (fail-closed: blocks if the ledger is unwritable)
   *   4. Build JSON-RPC 2.0 request + send to NemoClaw runtime
   *   5. Sanitize response (anti-prompt-injection)
   *   6. Log to Firehorse + Article 12 result event
   *   7. Return sanitized result
   */
  async invoke(request: BridgeRequest, callerATS: number): Promise<BridgeResponse> {
    const startTime = Date.now();
    const auditEventId = `nemoclaw-bridge-${Date.now()}-${request.callerAgentId}`;

    // 1. Validate skill is registered
    const skill = this.registeredSkills.get(request.method);
    if (!skill) {
      logger.warn('NemoClaw bridge: unregistered skill invocation blocked', {
        skill: request.method,
        caller: request.callerAgentId,
      });
      await this.auditDenied(request, callerATS, null, 'skill-not-registered');
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
      logger.warn('NemoClaw bridge: ATS too low', {
        skill: request.method,
        callerATS,
        required: skill.minimumATS,
        caller: request.callerAgentId,
      });
      await this.auditDenied(request, callerATS, skill.minimumATS, 'ats-below-minimum');
      return {
        success: false,
        result: null,
        error: `Caller ATS (${callerATS.toFixed(0)}) below minimum (${skill.minimumATS}) for skill "${request.method}"`,
        auditEventId,
        durationMs: Date.now() - startTime,
      };
    }

    // 3. Article 12 pre-flight log — fail-closed. If the append-only ledger cannot
    //    record that this command is about to run, the command does NOT run.
    let traceId: string | null = null;
    if (this.auditSink) {
      try {
        ({ traceId } = await this.auditSink.logInvocation({
          bridge: 'nemoclaw',
          agentId: request.callerAgentId,
          kyaSessionId: request.kyaSessionId,
          skill: request.method,
          params: request.params,
          callerAts: callerATS,
          minimumAts: skill.minimumATS,
          decision: 'allowed',
          modelVersion: this.modelVersion,
        }));
      } catch (err: unknown) {
        logger.error('NemoClaw bridge: Article 12 pre-flight log failed — command blocked', {
          skill: request.method,
          caller: request.callerAgentId,
          error: err instanceof Error ? err.message : 'Unknown error',
        });
        return {
          success: false,
          result: null,
          error: 'Command blocked: EU AI Act Article 12 audit log is unavailable',
          auditEventId,
          durationMs: Date.now() - startTime,
        };
      }
    }

    // 4. Build JSON-RPC 2.0 request
    const rpcRequest = {
      jsonrpc: '2.0',
      id: auditEventId,
      method: request.method,
      params: request.params,
    };

    // 5. Send to NemoClaw runtime
    let timeout: ReturnType<typeof setTimeout> | undefined;
    try {
      const controller = new AbortController();
      timeout = setTimeout(() => controller.abort(), this.config.timeoutMs);
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'X-KYA-Session': request.kyaSessionId,
        'X-DWS-Agent': request.callerAgentId,
      };

      if (this.config.nemoclawApiKey) {
        headers.Authorization = `Bearer ${this.config.nemoclawApiKey}`;
      }

      const response = await fetch(this.config.nemoclawEndpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify(rpcRequest),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`NemoClaw returned ${response.status}: ${response.statusText}`);
      }

      const rawBody = await response.text();

      // Check response size
      if (rawBody.length > this.config.maxResponseBytes) {
        logger.warn('NemoClaw response exceeds size limit, truncating', {
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
      const durationMs = Date.now() - startTime;

      // 7. Log to Firehorse (operational) + Article 12 result event (compliance)
      logger.info('NemoClaw bridge invocation', {
        skill: request.method,
        caller: request.callerAgentId,
        kyaSession: request.kyaSessionId,
        callerATS,
        success: true,
        durationMs,
        auditEventId,
      });

      if (this.auditSink && traceId) {
        await this.auditSink.logResult({
          traceId,
          bridge: 'nemoclaw',
          agentId: request.callerAgentId,
          skill: request.method,
          success: true,
          output: sanitized,
          durationMs,
        });
      }

      // 8. Return sanitized result
      return {
        success: true,
        result: sanitized,
        error: null,
        auditEventId,
        durationMs,
      };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      const durationMs = Date.now() - startTime;
      logger.error('NemoClaw bridge invocation failed', {
        skill: request.method,
        caller: request.callerAgentId,
        error: message,
        auditEventId,
      });

      if (this.auditSink && traceId) {
        await this.auditSink.logResult({
          traceId,
          bridge: 'nemoclaw',
          agentId: request.callerAgentId,
          skill: request.method,
          success: false,
          errorText: message,
          durationMs,
        });
      }

      return {
        success: false,
        result: null,
        error: message,
        auditEventId,
        durationMs,
      };
    } finally {
      if (timeout) {
        clearTimeout(timeout);
      }
    }
  }
}
