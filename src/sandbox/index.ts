/**
 * Sandbox Isolation Factory — DWS IQ Agent Foundry
 *
 * Selects the appropriate isolation strategy based on deployment stage:
 *
 * Stage 1 (Demo / Ecosummit / NCC pilot):
 *   → Anthropic SDK native sandbox (OS-level, zero infra cost)
 *
 * Stage 2 (First paid multi-tenant, NCC + 1):
 *   → Cloud Run ephemeral containers (europe-north1, ~€20-50/mo)
 *     + Groq inference (Llama 3.3 70B)
 *
 * Stage 3 (Scale, €50k+ MRR):
 *   → Persistent containers per tenant + gVisor/Firecracker
 *
 * The factory reads SANDBOX_STAGE from environment (default: '1').
 *
 * @module sandbox
 * @version 1.0.0
 * @license Proprietary - Lifetime Oy
 */

import logger from '../utils/logger.js';
import { buildSDKSandboxConfig, validateNIS2Compliance } from './sdk-sandbox.js';
import { executeInEphemeralContainer } from './cloudrun-ephemeral.js';
import { buildOpenSandboxClient, runAgentInOpenSandbox } from './opensandbox.js';
import type { SDKSandboxConfig, TenantSandboxOptions } from './sdk-sandbox.js';
import type { CloudRunTaskConfig, CloudRunTaskResult } from './cloudrun-ephemeral.js';
import type { AgentSandboxResult } from './opensandbox.js';

// ============================================================================
// Types
// ============================================================================

/** Stage 1.5 uses OpenSandbox on Acer Veriton local Docker host */
export type SandboxStage = '1' | 'opensandbox' | '2' | '3';

export interface AgentFoundryConfig {
  /** Current isolation stage */
  stage: SandboxStage;
  /** Default tenant tier for new tenants */
  defaultTier: 'sandbox' | 'professional' | 'enterprise';
  /** EU data residency enforcement */
  euDataResidency: boolean;
  /** GCP project for Cloud Run (Stage 2+) */
  gcpProject?: string;
  /** GCP region for Cloud Run (Stage 2+) */
  gcpRegion?: string;
}

export interface AgentExecutionRequest {
  tenantId: string;
  agentName: string;
  input: Record<string, unknown>;
  tier?: 'sandbox' | 'professional' | 'enterprise';
}

export interface AgentExecutionResult {
  stage: SandboxStage;
  isolationMethod: string;
  tenantId: string;
  agentName: string;
  result: Record<string, unknown>;
  sandboxConfig?: SDKSandboxConfig;
  containerResult?: CloudRunTaskResult;
  openSandboxResult?: AgentSandboxResult;
}

// ============================================================================
// Factory
// ============================================================================

/**
 * Get the current sandbox stage from environment.
 */
export function getSandboxStage(): SandboxStage {
  const stage = process.env.SANDBOX_STAGE || '1';
  if (stage === '1' || stage === 'opensandbox' || stage === '2' || stage === '3') {
    return stage as SandboxStage;
  }
  logger.warn(`Invalid SANDBOX_STAGE "${stage}", defaulting to "1"`);
  return '1';
}

/**
 * Build the Agent Foundry configuration from environment variables.
 */
export function getAgentFoundryConfig(): AgentFoundryConfig {
  return {
    stage: getSandboxStage(),
    defaultTier:
      (process.env.DEFAULT_TENANT_TIER as AgentFoundryConfig['defaultTier']) || 'sandbox',
    euDataResidency: process.env.EU_DATA_RESIDENCY !== 'false',
    gcpProject: process.env.GOOGLE_CLOUD_PROJECT,
    gcpRegion: process.env.GCP_REGION || 'europe-north1',
  };
}

/**
 * Execute an agent with the appropriate isolation for the current stage.
 *
 * Stage 1: Returns sandbox config + executes in-process (SDK sandbox)
 * Stage 2: Executes in ephemeral Cloud Run container with Groq
 * Stage 3: Executes in persistent container (not yet implemented)
 */
export async function executeIsolatedAgent(
  request: AgentExecutionRequest,
): Promise<AgentExecutionResult> {
  const config = getAgentFoundryConfig();

  logger.info('Executing isolated agent', {
    stage: config.stage,
    tenantId: request.tenantId,
    agentName: request.agentName,
  });

  switch (config.stage) {
    case '1':
      return executeStage1(request, config);

    case 'opensandbox':
      return executeStageOpenSandbox(request, config);

    case '2':
      return executeStage2(request, config);

    case '3':
      // Stage 3 not yet implemented — fall back to Stage 2
      logger.warn('Stage 3 not yet implemented, falling back to Stage 2');
      return executeStage2(request, config);

    default:
      throw new Error(`Unknown sandbox stage: ${config.stage}`);
  }
}

// ============================================================================
// Stage 1: SDK Native Sandbox
// ============================================================================

async function executeStage1(
  request: AgentExecutionRequest,
  config: AgentFoundryConfig,
): Promise<AgentExecutionResult> {
  const tier = request.tier || config.defaultTier;

  const sandboxOptions: TenantSandboxOptions = {
    tenantId: request.tenantId,
    tier,
    euDataResidency: config.euDataResidency,
  };

  const sandboxConfig = buildSDKSandboxConfig(sandboxOptions);

  // Validate NIS2 compliance
  const violations = validateNIS2Compliance(sandboxConfig);
  if (violations.length > 0) {
    logger.error('NIS2 compliance violations in sandbox config', { violations });
    throw new Error(`NIS2 compliance check failed: ${violations.join('; ')}`);
  }

  // In Stage 1, agents execute in-process with SDK sandbox boundaries.
  // The sandbox config is passed to the Anthropic Agent SDK which enforces
  // filesystem and network restrictions at the OS level.
  //
  // The actual agent execution happens through the existing AgentRegistry.
  // This function returns the sandbox config for the caller to apply.

  return {
    stage: '1',
    isolationMethod: 'anthropic-sdk-sandbox',
    tenantId: request.tenantId,
    agentName: request.agentName,
    result: { sandboxApplied: true, tier },
    sandboxConfig,
  };
}

// ============================================================================
// Stage 1.5: OpenSandbox on Acer Veriton
// ============================================================================

/**
 * Execute an agent task inside OpenSandbox running on the Acer Veriton.
 *
 * Selected when SANDBOX_STAGE=opensandbox.
 * Requires OPENSANDBOX_HOST pointing to the Veriton's IP/hostname.
 *
 * Best for:
 * - Internal pilots without cloud egress
 * - EU air-gapped data scenarios
 * - Development / pre-production testing with real Docker isolation
 */
async function executeStageOpenSandbox(
  request: AgentExecutionRequest,
  _config: AgentFoundryConfig,
): Promise<AgentExecutionResult> {
  const client = buildOpenSandboxClient();

  const sandboxResult = await runAgentInOpenSandbox({
    client,
    tenantId: request.tenantId,
    agentName: request.agentName,
    input: request.input,
    sandboxOpts: {
      networkPolicy: {
        allowedDomains: ['api.anthropic.com', 'api.groq.com', 'mcp-hub.dws10.com', 'api.dws10.com'],
        denyByDefault: true,
      },
    },
  });

  if (sandboxResult.status === 'error') {
    throw new Error(`OpenSandbox execution failed: ${sandboxResult.error}`);
  }

  return {
    stage: 'opensandbox',
    isolationMethod: 'opensandbox-docker-veriton',
    tenantId: request.tenantId,
    agentName: request.agentName,
    result: sandboxResult.artifacts,
    openSandboxResult: sandboxResult,
  };
}

// ============================================================================
// Stage 2: Cloud Run Ephemeral Containers
// ============================================================================

async function executeStage2(
  request: AgentExecutionRequest,
  config: AgentFoundryConfig,
): Promise<AgentExecutionResult> {
  const taskConfig: CloudRunTaskConfig = {
    tenantId: request.tenantId,
    agentName: request.agentName,
    input: request.input,
    region: config.gcpRegion,
  };

  const containerResult = await executeInEphemeralContainer(taskConfig);

  return {
    stage: '2',
    isolationMethod: 'cloudrun-ephemeral-container',
    tenantId: request.tenantId,
    agentName: request.agentName,
    result: containerResult.result,
    containerResult,
  };
}

// ============================================================================
// Re-exports
// ============================================================================

export { buildSDKSandboxConfig, validateNIS2Compliance } from './sdk-sandbox.js';
export { executeInEphemeralContainer, groqInference } from './cloudrun-ephemeral.js';
export { buildOpenSandboxClient, runAgentInOpenSandbox, OpenSandboxClient } from './opensandbox.js';
export type { SDKSandboxConfig, TenantSandboxOptions } from './sdk-sandbox.js';
export type {
  CloudRunTaskConfig,
  CloudRunTaskResult,
  EphemeralContainerStatus,
} from './cloudrun-ephemeral.js';
export type { OpenSandboxConfig, AgentSandboxResult, OpenSandboxInstance } from './opensandbox.js';
