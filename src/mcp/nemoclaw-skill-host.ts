/**
 * NemoClaw Skill Host — Reverse Skill Exposure (DWS IQ 6 Agent Integration)
 *
 * Exposes DWS Skilled Agents as governed NemoClaw skills so a NemoClaw harness
 * (OpenClaw or Hermes) can compose them into long-running autonomous workflows
 * ("compliance engineer", "site-safety engineer", …).
 *
 * This is the INBOUND counterpart to nemoclaw-bridge.ts:
 *   - nemoclaw-bridge.ts  : DWS Agent  → NemoClaw skill   (outbound JSON-RPC)
 *   - nemoclaw-skill-host : NemoClaw harness → DWS Agent   (inbound, in-process)
 *
 * The DWS agent runs in-process INSIDE the governance boundary — no network
 * egress to a runtime. Every invocation is governed by the same primitives as
 * the bridge: an allowed-skills whitelist (community skills BLOCKED), a KYA ATS
 * gate, the NemoClawSandbox tier model, inbound prompt-injection sanitization,
 * and an append-only Article-12 step log.
 *
 * See docs/design/nemoclaw-agent-workflows.md.
 */

import logger from '../utils/logger.js';
import { Article12Logger } from '../agents/article12-logger.js';
import { NemoClawSandbox, resolveTier } from '../sandbox/nemoclaw-sandbox.js';
import type { NemoClawSkillManifest } from './nemoclaw-bridge.js';
import type { BaseAgent } from '../agents/base.agent.js';
import type { AgentContext, AgentResponse, AutonomyPhase } from '../agents/types.js';

// ============================================================================
// TYPES
// ============================================================================

/** Canonical, schema-versioned result envelope returned for every DWS-agent skill. */
export interface SkillResultEnvelope {
  /** Stable contract version so harness-side parsers can evolve safely. */
  schemaVersion: 'dws-skill-result/1';
  /** Outcome of the skill invocation. */
  status: 'ok' | 'error';
  /** Which DWS agent produced this result. */
  agent: string;
  /** AgentResponse.result verbatim (agent-specific payload). */
  result: Record<string, unknown>;
  /** Confidence 0–1. */
  confidence: number;
  /** Human-readable decision lineage. */
  reasoning: string;
  /** Actionable next steps. */
  recommendations: string[];
  /** Article-12 cross-reference for audit reconstruction. */
  lineage: {
    traceId: string;
    inputHash: string;
    outputHash: string;
  };
}

/** Options supplied when exposing a DWS agent as a NemoClaw skill. */
export interface AgentSkillOptions {
  /**
   * Minimum caller ATS (0–100) to invoke this skill.
   * When omitted, derived from the agent's autonomyPhase (see ATS_BY_PHASE).
   */
  minimumATS?: number;
  /** Whether the skill needs network egress (sandbox tier permitting). */
  requiresNetwork?: boolean;
  /** Whether the skill needs filesystem access (sandbox tier permitting). */
  requiresFilesystem?: boolean;
}

/** A single inbound skill invocation from a NemoClaw workflow step. */
export interface SkillInvocation {
  /** Registered skill name (== agent name). */
  skill: string;
  /** Untrusted parameters from the NemoClaw harness — sanitized before use. */
  params: Record<string, unknown>;
  /** Caller agent / workflow id for the audit trail. */
  callerAgentId: string;
  /** KYA session id keying this workflow's audit trace. */
  kyaSessionId: string;
  /** Caller's current KYA ATS (0–100). */
  callerATS: number;
  /** DWS agent execution context (tenant, user, project, session). */
  context: AgentContext;
}

/** Result of an inbound skill invocation. */
export interface SkillInvocationResult {
  success: boolean;
  status: 'ok' | 'error';
  result: SkillResultEnvelope | null;
  error: string | null;
  auditEventId: string;
  durationMs: number;
}

/** Append-only Article-12 step record for one workflow step. */
export interface WorkflowStepLog {
  stepId: string;
  skill: string;
  callerAgentId: string;
  kyaSessionId: string;
  inputHash: string;
  outputHash: string | null;
  confidence: number | null;
  durationMs: number;
  status: 'ok' | 'error' | 'blocked';
  /** Article-12 trace id shared with the result envelope lineage. */
  traceId: string;
  timestamp: string;
}

/** Optional sink for step logs (production wires this to Article12Logger). */
export type StepRecorder = (step: WorkflowStepLog) => void;

export interface SkillHostOptions {
  /** Whitelist of skill names allowed to be registered (no community skills). */
  allowedSkills: string[];
  /** Firehorse log base path passed to the per-skill sandbox. */
  logBasePath?: string;
  /** Optional recorder invoked for every step (blocked, ok, or error). */
  onStep?: StepRecorder;
}

/** ATS minimum derived from an agent's autonomy phase when not set explicitly. */
const ATS_BY_PHASE: Record<AutonomyPhase, number> = {
  silent_pilot: 0,
  advisor: 50,
  autonomous: 80,
};

/** Prompt-injection patterns stripped from inbound (untrusted) string params. */
const INJECTION_PATTERNS: RegExp[] = [
  /\bignore\s+(all\s+)?previous\s+instructions?\b/gi,
  /\byou\s+are\s+now\b/gi,
  /\bsystem\s*:\s*/gi,
  /\b(ADMIN|ROOT|SUDO)\s*:/gi,
  /<\/?system[^>]*>/gi,
  /\[INST\]/gi,
  /<<SYS>>/gi,
];

// ============================================================================
// CONTRACT ADAPTER (pure, deterministic — no model in the loop)
// ============================================================================

/** Project a DWS agent's config into a NemoClaw skill manifest. */
export function agentToSkillManifest(
  agent: BaseAgent,
  opts: AgentSkillOptions = {},
): NemoClawSkillManifest {
  const config = agent.getConfig();
  const phase: AutonomyPhase = config.autonomyPhase ?? 'silent_pilot';
  const minimumATS = opts.minimumATS ?? ATS_BY_PHASE[phase];

  return {
    name: config.name,
    description: config.description,
    inputSchema: config.inputSchema ?? { type: 'object' },
    // Every DWS-agent skill returns the same canonical envelope shape.
    outputSchema: {
      type: 'object',
      required: ['schemaVersion', 'status', 'agent', 'result', 'lineage'],
      properties: {
        schemaVersion: { const: 'dws-skill-result/1' },
        status: { enum: ['ok', 'error'] },
        agent: { type: 'string' },
        result: { type: 'object' },
        confidence: { type: 'number' },
        reasoning: { type: 'string' },
        recommendations: { type: 'array', items: { type: 'string' } },
        lineage: { type: 'object' },
      },
    },
    requiresNetwork: opts.requiresNetwork ?? false,
    requiresFilesystem: opts.requiresFilesystem ?? false,
    minimumATS,
  };
}

/** Map a DWS AgentResponse into the canonical skill-result envelope (§3b). */
export function adaptAgentResponseToSkillResult(
  response: AgentResponse,
  lineage: { traceId: string; inputHash: string; outputHash: string },
): SkillResultEnvelope {
  return {
    schemaVersion: 'dws-skill-result/1',
    status: 'ok',
    agent: response.agentName,
    result: response.result,
    confidence: response.confidence,
    reasoning: response.reasoning,
    recommendations: response.recommendations,
    lineage,
  };
}

/** Recursively strip prompt-injection patterns from untrusted string values. */
function sanitizeParams(value: unknown): unknown {
  if (typeof value === 'string') {
    let out = value;
    for (const pattern of INJECTION_PATTERNS) {
      out = out.replace(pattern, '[SANITIZED]');
    }
    return out;
  }
  if (Array.isArray(value)) {
    return value.map(sanitizeParams);
  }
  if (value && typeof value === 'object') {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      out[k] = sanitizeParams(v);
    }
    return out;
  }
  return value;
}

// ============================================================================
// SKILL HOST
// ============================================================================

interface RegisteredSkill {
  agent: BaseAgent;
  manifest: NemoClawSkillManifest;
}

export class NemoClawSkillHost {
  private readonly allowedSkills: string[];
  private readonly logBasePath: string | undefined;
  private readonly onStep: StepRecorder | undefined;
  private readonly skills: Map<string, RegisteredSkill> = new Map();
  private readonly stepLog: WorkflowStepLog[] = [];

  constructor(opts: SkillHostOptions) {
    this.allowedSkills = opts.allowedSkills;
    this.logBasePath = opts.logBasePath;
    this.onStep = opts.onStep;
  }

  /**
   * Expose a DWS Skilled Agent as a NemoClaw skill.
   * Community skills are BLOCKED — only whitelisted names may register.
   */
  registerAgentSkill(agent: BaseAgent, opts: AgentSkillOptions = {}): void {
    const manifest = agentToSkillManifest(agent, opts);

    if (!this.allowedSkills.includes(manifest.name)) {
      logger.warn('Attempted to expose non-allowed agent skill', {
        skill: manifest.name,
        allowed: this.allowedSkills,
      });
      throw new Error(
        `Skill "${manifest.name}" is not in the allowed skills whitelist. ` +
          'Community skills are BLOCKED per DWS security policy.',
      );
    }

    this.skills.set(manifest.name, { agent, manifest });
    logger.info('NemoClaw skill host: agent skill exposed', {
      skill: manifest.name,
      minimumATS: manifest.minimumATS,
      requiresNetwork: manifest.requiresNetwork,
    });
  }

  /** List all exposed skill manifests. */
  listSkills(): NemoClawSkillManifest[] {
    return Array.from(this.skills.values()).map((s) => s.manifest);
  }

  /** Read-only snapshot of the Article-12 step log for this workflow. */
  getStepLog(): readonly WorkflowStepLog[] {
    return [...this.stepLog];
  }

  /**
   * Invoke a DWS agent as a NemoClaw skill through the governance envelope.
   *
   * Order: whitelist → ATS gate (+ sandbox tier) → sanitize inbound params →
   * sandboxed execute → adapt result → Article-12 step capture.
   */
  async invokeAgentSkill(req: SkillInvocation): Promise<SkillInvocationResult> {
    const startTime = Date.now();
    const traceId = Article12Logger.hashText(`${req.kyaSessionId}:${req.skill}:${startTime}`);
    const auditEventId = `nemoclaw-skill-${startTime}-${req.callerAgentId}`;
    const inputHash = `sha256:${Article12Logger.hashText(JSON.stringify(req.params ?? {}))}`;

    // 1. Whitelist / registration check
    const registered = this.skills.get(req.skill);
    if (!registered) {
      logger.warn('NemoClaw skill host: unregistered skill invocation blocked', {
        skill: req.skill,
        caller: req.callerAgentId,
      });
      return this.fail(`Skill "${req.skill}" is not registered. Community skills are BLOCKED.`, {
        req,
        traceId,
        auditEventId,
        inputHash,
        startTime,
      });
    }

    // 2. KYA ATS gate + sandbox tier resolution
    if (req.callerATS < registered.manifest.minimumATS) {
      logger.warn('NemoClaw skill host: ATS too low', {
        skill: req.skill,
        callerATS: req.callerATS,
        required: registered.manifest.minimumATS,
        caller: req.callerAgentId,
      });
      return this.fail(
        `Caller ATS (${req.callerATS.toFixed(0)}) below minimum (${registered.manifest.minimumATS}) for skill "${req.skill}"`,
        { req, traceId, auditEventId, inputHash, startTime },
      );
    }

    const tier = resolveTier(req.callerATS);
    if (tier === 'suspended' || tier === 'quarantine') {
      logger.warn('NemoClaw skill host: sandbox tier blocks execution', {
        skill: req.skill,
        tier,
        caller: req.callerAgentId,
      });
      return this.fail(
        `Sandbox tier "${tier}" (ATS ${req.callerATS.toFixed(0)}) blocks skill execution`,
        { req, traceId, auditEventId, inputHash, startTime },
      );
    }

    // Per-skill OpenShell/Firecracker sandbox (tier resolved from ATS).
    const sandbox = NemoClawSandbox.create({
      agentId: req.skill,
      kyaSessionId: req.kyaSessionId,
      atsScore: req.callerATS,
      allowedMcpTools: [req.skill],
      logBasePath: this.logBasePath,
    });

    // 3. Sanitize inbound (untrusted) params before they reach the agent.
    const safeParams = sanitizeParams(req.params ?? {}) as Record<string, unknown>;

    // 4. Sandboxed execution
    try {
      sandbox.recordInvocation(req.skill);
      const response = await registered.agent.execute(req.context, safeParams);

      // 5. Result adaptation
      const outputHash = `sha256:${Article12Logger.hashText(JSON.stringify(response.result ?? {}))}`;
      const envelope = adaptAgentResponseToSkillResult(response, {
        traceId,
        inputHash,
        outputHash,
      });

      const durationMs = Date.now() - startTime;

      // 6. Article-12 step capture
      this.recordStep({
        stepId: auditEventId,
        skill: req.skill,
        callerAgentId: req.callerAgentId,
        kyaSessionId: req.kyaSessionId,
        inputHash,
        outputHash,
        confidence: response.confidence,
        durationMs,
        status: 'ok',
        traceId,
        timestamp: new Date().toISOString(),
      });

      logger.info('NemoClaw skill host: invocation completed', {
        skill: req.skill,
        caller: req.callerAgentId,
        kyaSession: req.kyaSessionId,
        callerATS: req.callerATS,
        tier,
        durationMs,
        auditEventId,
      });

      return {
        success: true,
        status: 'ok',
        result: envelope,
        error: null,
        auditEventId,
        durationMs,
      };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      const durationMs = Date.now() - startTime;
      logger.error('NemoClaw skill host: invocation failed', {
        skill: req.skill,
        caller: req.callerAgentId,
        error: message,
        auditEventId,
      });

      this.recordStep({
        stepId: auditEventId,
        skill: req.skill,
        callerAgentId: req.callerAgentId,
        kyaSessionId: req.kyaSessionId,
        inputHash,
        outputHash: null,
        confidence: null,
        durationMs,
        status: 'error',
        traceId,
        timestamp: new Date().toISOString(),
      });

      return {
        success: false,
        status: 'error',
        result: null,
        error: message,
        auditEventId,
        durationMs,
      };
    }
  }

  /** Build a blocked-invocation failure result and capture the Article-12 step. */
  private fail(
    error: string,
    ctx: {
      req: SkillInvocation;
      traceId: string;
      auditEventId: string;
      inputHash: string;
      startTime: number;
    },
  ): SkillInvocationResult {
    const durationMs = Date.now() - ctx.startTime;
    this.recordStep({
      stepId: ctx.auditEventId,
      skill: ctx.req.skill,
      callerAgentId: ctx.req.callerAgentId,
      kyaSessionId: ctx.req.kyaSessionId,
      inputHash: ctx.inputHash,
      outputHash: null,
      confidence: null,
      durationMs,
      status: 'blocked',
      traceId: ctx.traceId,
      timestamp: new Date().toISOString(),
    });

    return {
      success: false,
      status: 'error',
      result: null,
      error,
      auditEventId: ctx.auditEventId,
      durationMs,
    };
  }

  /** Append a step to the audit log and emit to the optional recorder. */
  private recordStep(step: WorkflowStepLog): void {
    this.stepLog.push(step);
    if (this.onStep) {
      try {
        this.onStep(step);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Unknown error';
        logger.debug('NemoClaw skill host: onStep recorder threw', { error: msg });
      }
    }
  }
}
