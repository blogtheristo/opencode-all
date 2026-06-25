/**
 * NemoClaw MCP Bridge — DWS IQ enterprise agent integration
 *
 * Enterprise variant of the OpenClaw bridge (NVIDIA NeMo / Nemotron runtime,
 * CUDA-optimised, DGX Spark host). Inherits the KYA-governed JSON-RPC 2.0 path,
 * skill whitelist, ATS gating, and anti-prompt-injection sanitisation, and adds:
 *
 *   - MANDATORY EU AI Act Article 12 command logging. Unlike OpenClaw (where the
 *     audit sink is optional for backward compatibility), NemoClaw refuses to
 *     construct without one — every command is traceable by design, fail-closed.
 *   - model_version provenance recorded on every audit event (Nemotron model id).
 *
 * Signed-skill verification and RBAC (the other NemoClaw enterprise controls) are
 * enforced upstream in the skill-registration path; this bridge owns the
 * execution + Article 12 record-keeping boundary.
 */

import { OpenClawBridge, type BridgeConfig, type BridgeOptions } from './openclaw-bridge.js';
import { CommandAuditLogger, type CommandAuditSink } from './command-audit-logger.js';

export interface NemoClawOptions {
  /** Article 12 command-audit sink. Required — NemoClaw is never unlogged. */
  auditSink: CommandAuditSink;
  /** Nemotron model id recorded as provenance on each audit event. */
  modelVersion?: string;
}

export class NemoClawBridge extends OpenClawBridge {
  protected override readonly modelVersion: string | null;

  constructor(config: Partial<BridgeConfig> = {}, options: NemoClawOptions) {
    const bridgeOptions: BridgeOptions = {
      auditSink: options.auditSink,
      bridgeName: 'nemoclaw',
      requireAudit: true,
    };
    super(config, bridgeOptions);
    this.modelVersion = options.modelVersion ?? null;
  }

  /**
   * Build from environment. Requires Supabase credentials so the mandatory
   * Article 12 sink can be wired — throws otherwise (fail-closed at startup).
   *
   * Reuses OPENCLAW_* runtime config; override per-field via `config`.
   */
  static fromEnvStrict(config: Partial<BridgeConfig> = {}): NemoClawBridge {
    const auditSink = CommandAuditLogger.fromEnvOrNull();
    if (!auditSink) {
      throw new Error(
        'NemoClawBridge.fromEnvStrict: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are ' +
          'required for mandatory EU AI Act Article 12 command logging',
      );
    }

    return new NemoClawBridge(OpenClawBridge.resolveEnvConfig(config), {
      auditSink,
      modelVersion: process.env.NEMOCLAW_MODEL_VERSION ?? undefined,
    });
  }
}
