/**
 * Sandboxed NemoClaw Runner — KYA-Governed Firecracker MicroVM Isolation
 *
 * Runs NemoClaw inside a KYA-governed sandbox to contain the MCP attack surface.
 * Uses Firecracker MicroVM specifications from KYA BYO Lifecycle.
 *
 * Defense in depth:
 *   1. NemoClaw runs INSIDE KYA sandbox (never outside governance boundary)
 *   2. Community skills: BLOCKED (no auto-install)
 *   3. MCP tool responses: untrusted input (sanitized by nemoclaw-bridge.ts)
 *   4. Network egress: per-session whitelist at hypervisor level
 *   5. Filesystem: isolated per MicroVM
 *   6. All actions logged to Firehorse audit trail
 *
 * Hardware target: Acer Veriton GN100 (DGX Spark), 128GB unified memory
 *   - ~128MB per MicroVM → ~500 concurrent agents
 *   - Boot time: <125ms per MicroVM
 */

import logger from '../utils/logger.js';

// ============================================================================
// TYPES
// ============================================================================

export type SandboxTier = 'full_agency' | 'restricted' | 'suspended' | 'quarantine';

export interface SandboxConfig {
  /** Unique sandbox instance ID */
  sandboxId: string;

  /** KYA session ID for governance tracking */
  kyaSessionId: string;

  /** Agent ID running inside this sandbox */
  agentId: string;

  /** Current trust tier based on ATS score */
  tier: SandboxTier;

  /** ATS score at sandbox creation time */
  atsScore: number;

  /** Memory limit for this MicroVM in MB */
  memoryLimitMb: number;

  /** CPU cores allocated */
  cpuCores: number;

  /** Maximum execution time in seconds */
  maxExecutionTimeSec: number;

  /** Allowed egress domains (empty = no network) */
  allowedEgressDomains: string[];

  /** Allowed filesystem paths (read-only unless specified) */
  allowedPaths: { path: string; writable: boolean }[];

  /** Allowed MCP tools (whitelist) */
  allowedMcpTools: string[];

  /** Firehorse log path for this sandbox */
  firehorseLogPath: string;
}

export interface SandboxState {
  /** Current sandbox status */
  status: 'creating' | 'running' | 'stopped' | 'killed' | 'quarantined';

  /** When the sandbox was created */
  createdAt: string;

  /** When the sandbox was last active */
  lastActiveAt: string;

  /** Number of MCP tool invocations */
  toolInvocations: number;

  /** Number of denied actions */
  deniedActions: number;

  /** Current ATS score (may have changed since creation) */
  currentATS: number;

  /** Whether kill switch has been triggered */
  killSwitchTriggered: boolean;
}

// ============================================================================
// TIER RESOLUTION
// ============================================================================

/**
 * Resolve sandbox tier from ATS score.
 * Matches KYA BYO Lifecycle trust score tiers.
 */
export function resolveTier(atsScore: number): SandboxTier {
  if (atsScore >= 80) return 'full_agency';
  if (atsScore >= 50) return 'restricted';
  if (atsScore > 0) return 'suspended';
  return 'quarantine';
}

/**
 * Get sandbox capabilities for a given tier.
 */
function getTierCapabilities(tier: SandboxTier): {
  allowNetwork: boolean;
  allowFilesystem: boolean;
  allowMcpTools: boolean;
  maxMemoryMb: number;
  maxCpuCores: number;
  maxExecutionSec: number;
} {
  switch (tier) {
    case 'full_agency':
      return {
        allowNetwork: true,
        allowFilesystem: true,
        allowMcpTools: true,
        maxMemoryMb: 512,
        maxCpuCores: 4,
        maxExecutionSec: 3600,
      };
    case 'restricted':
      return {
        allowNetwork: false,
        allowFilesystem: true, // read-only
        allowMcpTools: true, // curated subset
        maxMemoryMb: 256,
        maxCpuCores: 2,
        maxExecutionSec: 1800,
      };
    case 'suspended':
      return {
        allowNetwork: false,
        allowFilesystem: false,
        allowMcpTools: false,
        maxMemoryMb: 128,
        maxCpuCores: 1,
        maxExecutionSec: 300,
      };
    case 'quarantine':
      return {
        allowNetwork: false,
        allowFilesystem: false,
        allowMcpTools: false,
        maxMemoryMb: 64,
        maxCpuCores: 1,
        maxExecutionSec: 60,
      };
  }
}

// ============================================================================
// SANDBOX MANAGER
// ============================================================================

export class NemoClawSandbox {
  private config: SandboxConfig;
  private state: SandboxState;

  constructor(config: SandboxConfig) {
    this.config = config;
    this.state = {
      status: 'creating',
      createdAt: new Date().toISOString(),
      lastActiveAt: new Date().toISOString(),
      toolInvocations: 0,
      deniedActions: 0,
      currentATS: config.atsScore,
      killSwitchTriggered: false,
    };
  }

  /**
   * Create a sandboxed NemoClaw runner with tier-appropriate restrictions.
   */
  static create(params: {
    agentId: string;
    kyaSessionId: string;
    atsScore: number;
    allowedMcpTools?: string[];
    logBasePath?: string;
  }): NemoClawSandbox {
    const tier = resolveTier(params.atsScore);
    const capabilities = getTierCapabilities(tier);
    const logBasePath = params.logBasePath ?? '/mnt/firehorse-dms/logs';
    const dateDir = new Date().toISOString().slice(0, 10);

    const config: SandboxConfig = {
      sandboxId: `sandbox-${params.agentId}-${Date.now()}`,
      kyaSessionId: params.kyaSessionId,
      agentId: params.agentId,
      tier,
      atsScore: params.atsScore,
      memoryLimitMb: capabilities.maxMemoryMb,
      cpuCores: capabilities.maxCpuCores,
      maxExecutionTimeSec: capabilities.maxExecutionSec,
      allowedEgressDomains: capabilities.allowNetwork
        ? ['api.dws6.com', 'supabase.co'] // Only DWS endpoints, never external
        : [],
      allowedPaths: capabilities.allowFilesystem
        ? [
            { path: '/data/agent-workspace', writable: tier === 'full_agency' },
            { path: '/data/shared-models', writable: false },
          ]
        : [],
      allowedMcpTools: capabilities.allowMcpTools ? (params.allowedMcpTools ?? []) : [],
      firehorseLogPath: `${logBasePath}/${dateDir}/${params.agentId}.jsonl`,
    };

    logger.info('NemoClaw sandbox created', {
      sandboxId: config.sandboxId,
      agentId: params.agentId,
      tier,
      atsScore: params.atsScore,
      memoryMb: config.memoryLimitMb,
      allowedTools: config.allowedMcpTools.length,
    });

    return new NemoClawSandbox(config);
  }

  /**
   * Check if an MCP tool invocation is allowed by this sandbox.
   */
  canInvokeTool(toolName: string): { allowed: boolean; reason: string } {
    if (this.state.killSwitchTriggered) {
      return { allowed: false, reason: 'Kill switch triggered — all actions blocked' };
    }

    if (this.state.status === 'quarantined') {
      return { allowed: false, reason: 'Agent quarantined — forensic dump in progress' };
    }

    if (this.state.status === 'stopped' || this.state.status === 'killed') {
      return { allowed: false, reason: `Sandbox is ${this.state.status}` };
    }

    if (this.config.tier === 'suspended') {
      return { allowed: false, reason: 'Agent suspended — human review required' };
    }

    if (!this.config.allowedMcpTools.includes(toolName)) {
      this.state.deniedActions++;
      logger.warn('NemoClaw sandbox: tool invocation denied', {
        sandboxId: this.config.sandboxId,
        tool: toolName,
        tier: this.config.tier,
        deniedCount: this.state.deniedActions,
      });
      return { allowed: false, reason: `Tool "${toolName}" not in sandbox whitelist` };
    }

    return { allowed: true, reason: 'Tool allowed by sandbox policy' };
  }

  /**
   * Record a tool invocation (for audit trail).
   */
  recordInvocation(toolName: string): void {
    this.state.toolInvocations++;
    this.state.lastActiveAt = new Date().toISOString();

    logger.debug('NemoClaw sandbox: tool invocation recorded', {
      sandboxId: this.config.sandboxId,
      tool: toolName,
      totalInvocations: this.state.toolInvocations,
    });
  }

  /**
   * Trigger kill switch — immediately stop all agent activity.
   * SLA target: <5ms from trigger to confirmed kill.
   */
  triggerKillSwitch(reason: string): { killLatencyMs: number; slaMet: boolean } {
    const start = performance.now();

    this.state.killSwitchTriggered = true;
    this.state.status = 'killed';

    const killLatencyMs = performance.now() - start;
    const slaMet = killLatencyMs < 5;

    logger.warn('NemoClaw sandbox: KILL SWITCH TRIGGERED', {
      sandboxId: this.config.sandboxId,
      agentId: this.config.agentId,
      reason,
      killLatencyMs: killLatencyMs.toFixed(3),
      slaMet,
    });

    return { killLatencyMs, slaMet };
  }

  /**
   * Update ATS score and potentially adjust tier.
   * Dynamic permission adjustment: <5 seconds.
   */
  updateATS(newScore: number): {
    tierChanged: boolean;
    oldTier: SandboxTier;
    newTier: SandboxTier;
  } {
    const oldTier = this.config.tier;
    const newTier = resolveTier(newScore);
    const oldATS = this.state.currentATS;

    this.state.currentATS = newScore;

    if (newTier !== oldTier) {
      this.config.tier = newTier;
      const capabilities = getTierCapabilities(newTier);

      this.config.memoryLimitMb = capabilities.maxMemoryMb;
      this.config.cpuCores = capabilities.maxCpuCores;
      this.config.maxExecutionTimeSec = capabilities.maxExecutionSec;

      if (!capabilities.allowNetwork) {
        this.config.allowedEgressDomains = [];
      }
      if (!capabilities.allowMcpTools) {
        this.config.allowedMcpTools = [];
      }

      if (newTier === 'quarantine') {
        this.state.status = 'quarantined';
      }

      logger.warn('NemoClaw sandbox: tier changed', {
        sandboxId: this.config.sandboxId,
        oldTier,
        newTier,
        oldATS,
        newATS: newScore,
      });
    }

    return { tierChanged: newTier !== oldTier, oldTier, newTier };
  }

  /** Get current sandbox state (read-only snapshot). */
  getState(): Readonly<SandboxState> {
    return { ...this.state };
  }

  /** Get sandbox configuration (read-only snapshot). */
  getConfig(): Readonly<SandboxConfig> {
    return { ...this.config };
  }

  /**
   * Generate Firecracker MicroVM specification for this sandbox.
   * Used by the container orchestrator to create the actual MicroVM.
   */
  toFirecrackerSpec(): Record<string, unknown> {
    return {
      'boot-source': {
        kernel_image_path: '/var/lib/firecracker/vmlinux',
        boot_args: 'console=ttyS0 reboot=k panic=1 pci=off',
      },
      'machine-config': {
        vcpu_count: this.config.cpuCores,
        mem_size_mib: this.config.memoryLimitMb,
      },
      'network-interfaces':
        this.config.allowedEgressDomains.length > 0
          ? [
              {
                iface_id: 'eth0',
                guest_mac: 'AA:FC:00:00:00:01',
                host_dev_name: `tap-${this.config.sandboxId.slice(-8)}`,
              },
            ]
          : [],
      drives: [
        {
          drive_id: 'rootfs',
          path_on_host: '/var/lib/firecracker/rootfs.ext4',
          is_root_device: true,
          is_read_only: this.config.tier !== 'full_agency',
        },
      ],
      metadata: {
        kya_session_id: this.config.kyaSessionId,
        agent_id: this.config.agentId,
        sandbox_id: this.config.sandboxId,
        tier: this.config.tier,
        firehorse_log: this.config.firehorseLogPath,
      },
    };
  }
}
