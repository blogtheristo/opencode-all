/**
 * Cloudflare Workflows — Type definitions
 * DWS IQ 6 CI/CD pipeline for multi-customer, multi-domain deployments
 */

export type Environment = 'dev' | 'prod';

export type Customer = 'outokumpu' | 'ncc' | 'kemira';

export type Domain = 'dws6-com' | 'dws10-com' | 'onelifetime-world';

export interface WorkflowConfig {
  /** Customer slug (omit for domain-only workflows) */
  customer?: Customer;
  /** Domain slug (omit for customer-only workflows) */
  domain?: Domain | string;
  /** Deployment environment */
  env: Environment;
  /** Public hostname for smoke-tests and Access policies */
  hostname: string;
  /** Branch glob that auto-triggers this workflow */
  branchPattern?: string;
  /** Customer-specific environment variables injected at build time */
  envVars?: Record<string, string>;
  /** Wrangler environment name (used in `wrangler deploy --env`) */
  wranglerEnv: string;
  /** Slack / Teams webhook URL secret name in Cloudflare Secrets */
  notifyWebhookSecretName?: string;
}

export interface DeployTarget {
  hostname: string;
  wranglerEnv: string;
  envVars: Record<string, string>;
}

export interface StepResult {
  step: string;
  success: boolean;
  output?: string;
  error?: string;
  durationMs: number;
}

export interface WorkflowPayload {
  /** GitHub event that triggered this run */
  event: 'push' | 'pull_request' | 'workflow_dispatch';
  /** Git branch */
  branch: string;
  /** Git commit SHA */
  sha: string;
  /** GitHub repository full name */
  repo: string;
  /** ISO timestamp of trigger */
  triggeredAt: string;
  /** Optional override: skip test step (e.g. hotfix path) */
  skipTests?: boolean;
  /** Optional approval token for prod gate */
  approvalToken?: string;
}

export interface WorkflowOutput {
  workflowName: string;
  env: Environment;
  success: boolean;
  steps: StepResult[];
  deployedUrl?: string;
  totalDurationMs: number;
  completedAt: string;
}

export interface ApprovalGatePayload {
  instanceId: string;
  approved: boolean;
  approvedBy: string;
  approvedAt: string;
}
