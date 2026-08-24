/**
 * Anthropic SDK Native Sandbox Isolation — Stage 1
 *
 * Uses Anthropic Agent SDK's built-in sandbox (bubblewrap on Linux,
 * seatbelt on macOS) to enforce filesystem and network isolation per tenant.
 *
 * This is the zero-infrastructure isolation layer for demo / Ecosummit / NCC pilot.
 * No Docker, no VMs — just OS-level restrictions via a config object.
 *
 * @module sandbox/sdk-sandbox
 * @version 1.0.0
 * @license Proprietary - Lifetime Oy
 */

import logger from '../utils/logger.js';

// ============================================================================
// Types
// ============================================================================

export interface SandboxFilesystemConfig {
  /** Paths the agent is allowed to read/write within */
  allowedPaths: string[];
  /** Paths explicitly denied (overrides allowedPaths) */
  deniedPaths?: string[];
  /** Whether to allow /tmp access (default: false) */
  allowTmp?: boolean;
}

export interface SandboxNetworkConfig {
  /** Domains the agent can reach via HTTPS */
  allowedDomains: string[];
  /** Whether to block all outbound by default (default: true) */
  denyByDefault?: boolean;
}

export interface SDKSandboxConfig {
  enabled: boolean;
  filesystem: SandboxFilesystemConfig;
  network: SandboxNetworkConfig;
}

export interface TenantSandboxOptions {
  tenantId: string;
  tier: 'sandbox' | 'professional' | 'enterprise';
  /** EU data residency — restricts network to EU-only endpoints */
  euDataResidency?: boolean;
  /** Additional domains beyond the baseline allowed list */
  additionalDomains?: string[];
  /** Additional filesystem paths beyond the tenant workspace */
  additionalPaths?: string[];
}

// ============================================================================
// Baseline allowed domains per tier
// ============================================================================

const BASELINE_DOMAINS = [
  'api.anthropic.com',
  'api.groq.com',
] as const;

const EU_BACKEND_DOMAINS = [
  'mcp-hub.dws10.com',
  'api.dws10.com',
] as const;

const SUPABASE_DOMAINS = [
  // Tenant-specific Supabase project URL is added dynamically
] as const;

const TIER_DOMAINS: Record<string, readonly string[]> = {
  sandbox: [...BASELINE_DOMAINS, ...EU_BACKEND_DOMAINS],
  professional: [...BASELINE_DOMAINS, ...EU_BACKEND_DOMAINS, ...SUPABASE_DOMAINS],
  enterprise: [...BASELINE_DOMAINS, ...EU_BACKEND_DOMAINS, ...SUPABASE_DOMAINS],
};

// ============================================================================
// System paths that must never be accessible
// ============================================================================

const SYSTEM_DENIED_PATHS = [
  '/etc/shadow',
  '/etc/passwd',
  '/root',
  '/home',
  '/var/run/docker.sock',
  '/proc/1',
];

// ============================================================================
// Factory
// ============================================================================

/**
 * Build an Anthropic SDK sandbox config for a specific tenant.
 *
 * Usage:
 * ```ts
 * const sandbox = buildSDKSandboxConfig({ tenantId: 'ncc-finland', tier: 'professional' });
 * // Pass `sandbox` to the Anthropic Agent SDK initialization
 * ```
 */
export function buildSDKSandboxConfig(options: TenantSandboxOptions): SDKSandboxConfig {
  const {
    tenantId,
    tier,
    euDataResidency = true,
    additionalDomains = [],
    additionalPaths = [],
  } = options;

  const tenantWorkspace = `/workspace/tenant-${tenantId}`;

  // Build allowed paths: tenant workspace + any additional
  const allowedPaths = [tenantWorkspace, ...additionalPaths];

  // Build allowed domains: tier baseline + Supabase + any additional
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseDomain = supabaseUrl
    ? new URL(supabaseUrl).hostname
    : null;

  const allowedDomains = [
    ...TIER_DOMAINS[tier] || TIER_DOMAINS.sandbox,
    ...(supabaseDomain ? [supabaseDomain] : []),
    ...additionalDomains,
  ];

  const config: SDKSandboxConfig = {
    enabled: true,
    filesystem: {
      allowedPaths,
      deniedPaths: SYSTEM_DENIED_PATHS,
      allowTmp: tier === 'enterprise',
    },
    network: {
      allowedDomains,
      denyByDefault: true,
    },
  };

  logger.info('SDK sandbox config built', {
    tenantId,
    tier,
    euDataResidency,
    allowedPaths: config.filesystem.allowedPaths,
    allowedDomains: config.network.allowedDomains,
  });

  return config;
}

/**
 * Validate that a sandbox config meets NIS2 minimum requirements.
 * Returns a list of violations (empty = compliant).
 */
export function validateNIS2Compliance(config: SDKSandboxConfig): string[] {
  const violations: string[] = [];

  if (!config.enabled) {
    violations.push('Sandbox must be enabled for NIS2 compliance');
  }

  if (!config.network.denyByDefault) {
    violations.push('Network must deny-by-default (NIS2 least-privilege)');
  }

  if (config.filesystem.allowedPaths.length === 0) {
    violations.push('At least one filesystem path must be specified');
  }

  // Check no wildcard domains
  for (const domain of config.network.allowedDomains) {
    if (domain.startsWith('*')) {
      violations.push(`Wildcard domain "${domain}" not allowed under NIS2`);
    }
  }

  // Check system paths are denied
  const hasDeniedPaths = config.filesystem.deniedPaths && config.filesystem.deniedPaths.length > 0;
  if (!hasDeniedPaths) {
    violations.push('System paths must be explicitly denied');
  }

  return violations;
}
