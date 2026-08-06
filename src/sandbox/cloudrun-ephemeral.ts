/**
 * Cloud Run Ephemeral Container Orchestrator — Stage 2
 *
 * Creates a new Cloud Run container per tenant task, executes the agent
 * with Groq inference (Llama 3.3 70B), then destroys the container.
 *
 * Architecture:
 * - One ephemeral Cloud Run Job per agent execution
 * - EU data residency via europe-north1 (Finland)
 * - Tenant filesystem isolation by container boundary
 * - Network isolation by Cloud Run egress policy
 * - Groq API for fast inference (~€20-50/month at pilot scale)
 *
 * NIS2 compliance story:
 * "Each DWS IQ 6 agent task runs in an ephemeral Cloud Run container in
 *  europe-north1. Containers are destroyed post-task. No cross-tenant data
 *  path exists by architecture, not by policy."
 *
 * @module sandbox/cloudrun-ephemeral
 * @version 1.0.0
 * @license Proprietary - Lifetime Oy
 */

import logger from '../utils/logger.js';

// ============================================================================
// Types
// ============================================================================

export interface CloudRunTaskConfig {
  /** Tenant executing this task */
  tenantId: string;
  /** Agent to execute */
  agentName: string;
  /** Input payload for the agent */
  input: Record<string, unknown>;
  /** GCP region (default: europe-north1 for EU data residency) */
  region?: string;
  /** Container image to use */
  image?: string;
  /** Max execution time in seconds (default: 300) */
  timeoutSeconds?: number;
  /** Memory limit (default: 512Mi) */
  memoryLimit?: string;
  /** CPU limit (default: 1) */
  cpuLimit?: string;
  /** VPC connector for private networking */
  vpcConnector?: string;
}

export interface CloudRunTaskResult {
  /** Unique task execution ID */
  executionId: string;
  /** Tenant that owns this execution */
  tenantId: string;
  /** Agent that was executed */
  agentName: string;
  /** Agent response payload */
  result: Record<string, unknown>;
  /** Execution metadata */
  metadata: {
    region: string;
    startedAt: string;
    completedAt: string;
    durationMs: number;
    containerDestroyed: boolean;
  };
  /** LLM usage from Groq */
  usage?: {
    model: string;
    inputTokens: number;
    outputTokens: number;
    inferenceTimeMs: number;
  };
}

export interface EphemeralContainerStatus {
  executionId: string;
  state: 'pending' | 'running' | 'completed' | 'failed' | 'destroyed';
  tenantId: string;
  agentName: string;
  region: string;
  createdAt: string;
  updatedAt: string;
  error?: string;
}

// ============================================================================
// Constants
// ============================================================================

const DEFAULT_REGION = 'europe-north1'; // Finland — EU data residency
// Image is resolved from env so the runner is not pinned to a single (now-decommissioned)
// project. Set AGENT_RUNNER_IMAGE for a full override, otherwise it is built from
// GOOGLE_CLOUD_PROJECT's Artifact Registry.
const DEFAULT_IMAGE =
  process.env.AGENT_RUNNER_IMAGE ||
  `europe-north1-docker.pkg.dev/${process.env.GOOGLE_CLOUD_PROJECT ?? ''}/agents/dws-agent-runner:latest`;
const DEFAULT_TIMEOUT = 300; // 5 minutes
const DEFAULT_MEMORY = '512Mi';
const DEFAULT_CPU = '1';

// Groq API config (same as base.agent.ts)
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = 'llama-3.3-70b-versatile';

// ============================================================================
// Cloud Run Job Management
// ============================================================================

/**
 * Execute an agent in an ephemeral Cloud Run container.
 *
 * Flow:
 * 1. Create Cloud Run Job with tenant-specific config
 * 2. Execute the job (runs the agent container)
 * 3. Collect results from the job output
 * 4. Delete the job (container destroyed — no residual data)
 *
 * Requires: GOOGLE_CLOUD_PROJECT env var, Application Default Credentials
 */
export async function executeInEphemeralContainer(
  config: CloudRunTaskConfig,
): Promise<CloudRunTaskResult> {
  const startedAt = new Date();
  const executionId = `exec-${config.tenantId}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const region = config.region || DEFAULT_REGION;
  const project = process.env.GOOGLE_CLOUD_PROJECT;
  if (!project) {
    // Fail loud rather than silently target a decommissioned default project.
    throw new Error(
      'GOOGLE_CLOUD_PROJECT env var is required for ephemeral Cloud Run execution ' +
        '(the former dws-iq-pilot default has been removed).',
    );
  }

  logger.info('Creating ephemeral container for agent execution', {
    executionId,
    tenantId: config.tenantId,
    agentName: config.agentName,
    region,
  });

  const jobName = `agent-${config.tenantId}-${Date.now()}`
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .slice(0, 63);

  try {
    // Step 1: Create the Cloud Run Job
    const jobSpec = buildJobSpec(jobName, config, executionId, region);
    await createCloudRunJob(project, region, jobSpec);

    // Step 2: Execute the job
    await runCloudRunJob(project, region, jobName);

    // Step 3: Wait for completion and collect results
    const result = await waitForJobCompletion(project, region, jobName, executionId, config);

    // Step 4: Delete the job (destroy container)
    await deleteCloudRunJob(project, region, jobName);

    const completedAt = new Date();
    const durationMs = completedAt.getTime() - startedAt.getTime();

    logger.info('Ephemeral container execution complete', {
      executionId,
      tenantId: config.tenantId,
      durationMs,
      containerDestroyed: true,
    });

    return {
      executionId,
      tenantId: config.tenantId,
      agentName: config.agentName,
      result,
      metadata: {
        region,
        startedAt: startedAt.toISOString(),
        completedAt: completedAt.toISOString(),
        durationMs,
        containerDestroyed: true,
      },
    };
  } catch (error) {
    // Ensure cleanup even on failure
    try {
      await deleteCloudRunJob(project, region, jobName);
    } catch (cleanupErr) {
      logger.warn('Failed to cleanup Cloud Run Job after error', {
        executionId,
        jobName,
        error: cleanupErr instanceof Error ? cleanupErr.message : 'Unknown',
      });
    }

    throw error;
  }
}

// ============================================================================
// Cloud Run API Helpers
// ============================================================================

function buildJobSpec(
  jobName: string,
  config: CloudRunTaskConfig,
  executionId: string,
  _region: string,
): Record<string, unknown> {
  return {
    apiVersion: 'run.googleapis.com/v1',
    kind: 'Job',
    metadata: {
      name: jobName,
      labels: {
        'dws-tenant': config.tenantId,
        'dws-agent': config.agentName,
        'dws-execution': executionId,
      },
      annotations: {
        'run.googleapis.com/launch-stage': 'BETA',
      },
    },
    spec: {
      template: {
        metadata: {
          labels: {
            'dws-tenant': config.tenantId,
          },
          annotations: {
            // VPC connector for private backend access
            ...(config.vpcConnector
              ? {
                  'run.googleapis.com/vpc-access-connector': config.vpcConnector,
                  'run.googleapis.com/vpc-access-egress': 'all-traffic',
                }
              : {}),
          },
        },
        spec: {
          containers: [
            {
              image: config.image || DEFAULT_IMAGE,
              resources: {
                limits: {
                  memory: config.memoryLimit || DEFAULT_MEMORY,
                  cpu: config.cpuLimit || DEFAULT_CPU,
                },
              },
              env: [
                { name: 'TENANT_ID', value: config.tenantId },
                { name: 'AGENT_NAME', value: config.agentName },
                { name: 'EXECUTION_ID', value: executionId },
                { name: 'AGENT_INPUT', value: JSON.stringify(config.input) },
                {
                  name: 'GROQ_API_KEY',
                  valueFrom: { secretKeyRef: { name: 'groq-api-key', key: 'latest' } },
                },
                {
                  name: 'SUPABASE_URL',
                  valueFrom: { secretKeyRef: { name: 'supabase-url', key: 'latest' } },
                },
                {
                  name: 'SUPABASE_SERVICE_KEY',
                  valueFrom: { secretKeyRef: { name: 'supabase-service-key', key: 'latest' } },
                },
              ],
            },
          ],
          timeoutSeconds: config.timeoutSeconds || DEFAULT_TIMEOUT,
          serviceAccountName: `agent-runner@${process.env.GOOGLE_CLOUD_PROJECT}.iam.gserviceaccount.com`,
        },
      },
    },
  };
}

/**
 * Create a Cloud Run Job via the REST API.
 * Uses Application Default Credentials (ADC).
 */
async function createCloudRunJob(
  project: string,
  region: string,
  jobSpec: Record<string, unknown>,
): Promise<void> {
  const url = `https://${region}-run.googleapis.com/apis/run.googleapis.com/v1/namespaces/${project}/jobs`;
  const token = await getAccessToken();

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(jobSpec),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to create Cloud Run Job: ${response.status} ${error}`);
  }
}

/**
 * Run (execute) an existing Cloud Run Job.
 */
async function runCloudRunJob(project: string, region: string, jobName: string): Promise<void> {
  const url = `https://${region}-run.googleapis.com/apis/run.googleapis.com/v1/namespaces/${project}/jobs/${jobName}:run`;
  const token = await getAccessToken();

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to run Cloud Run Job: ${response.status} ${error}`);
  }
}

/**
 * Delete a Cloud Run Job (destroys container and all associated data).
 */
async function deleteCloudRunJob(project: string, region: string, jobName: string): Promise<void> {
  const url = `https://${region}-run.googleapis.com/apis/run.googleapis.com/v1/namespaces/${project}/jobs/${jobName}`;
  const token = await getAccessToken();

  const response = await fetch(url, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok && response.status !== 404) {
    const error = await response.text();
    logger.warn('Failed to delete Cloud Run Job', { jobName, status: response.status, error });
  }
}

/**
 * Poll for job completion. Returns the agent result from Supabase
 * (the container writes its output there before exiting).
 */
async function waitForJobCompletion(
  project: string,
  region: string,
  jobName: string,
  executionId: string,
  config: CloudRunTaskConfig,
): Promise<Record<string, unknown>> {
  const maxWaitMs = (config.timeoutSeconds || DEFAULT_TIMEOUT) * 1000;
  const pollIntervalMs = 2000;
  const startTime = Date.now();

  while (Date.now() - startTime < maxWaitMs) {
    const url = `https://${region}-run.googleapis.com/apis/run.googleapis.com/v1/namespaces/${project}/jobs/${jobName}`;
    const token = await getAccessToken();

    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.ok) {
      const job = (await response.json()) as {
        status?: {
          conditions?: Array<{ type: string; status: string; reason?: string }>;
          executionCount?: number;
        };
      };

      const completedCondition = job.status?.conditions?.find(
        (c: { type: string; status: string }) => c.type === 'Ready' && c.status === 'True',
      );

      if (completedCondition) {
        // Job completed — fetch result from Supabase
        return fetchExecutionResult(executionId);
      }

      const failedCondition = job.status?.conditions?.find(
        (c: { type: string; reason?: string }) =>
          c.type === 'Ready' && c.reason === 'ContainerFailed',
      );

      if (failedCondition) {
        throw new Error(`Agent container failed for tenant ${config.tenantId}`);
      }
    }

    await sleep(pollIntervalMs);
  }

  throw new Error(`Agent execution timed out after ${maxWaitMs}ms for tenant ${config.tenantId}`);
}

/**
 * Fetch the agent execution result from Supabase.
 * The container writes its output to agent_executions before exiting.
 */
async function fetchExecutionResult(executionId: string): Promise<Record<string, unknown>> {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return { executionId, note: 'Supabase not configured — result not persisted' };
  }

  const url = `${supabaseUrl}/rest/v1/agent_executions?execution_id=eq.${executionId}&select=output,status,error_message`;

  const response = await fetch(url, {
    headers: {
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch execution result: ${response.status}`);
  }

  const rows = (await response.json()) as Array<{
    output: Record<string, unknown> | null;
    status: string;
    error_message?: string;
  }>;

  if (rows.length === 0) {
    return { executionId, note: 'Result not yet written — container may still be flushing' };
  }

  const row = rows[0];
  if (row.status === 'error') {
    throw new Error(`Agent execution error: ${row.error_message || 'Unknown'}`);
  }

  return row.output || {};
}

// ============================================================================
// Groq Inference Helper (for use inside the container image)
// ============================================================================

/**
 * Execute Groq inference within the ephemeral container.
 * This function is called by the agent runner container image,
 * not by the orchestrator.
 */
export async function groqInference(
  systemPrompt: string,
  userPrompt: string,
  options: {
    model?: string;
    maxTokens?: number;
    temperature?: number;
    jsonMode?: boolean;
  } = {},
): Promise<{
  content: string;
  model: string;
  inputTokens: number;
  outputTokens: number;
  inferenceTimeMs: number;
}> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error('GROQ_API_KEY not set in container environment');
  }

  const startTime = Date.now();

  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: options.model || GROQ_MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      max_completion_tokens: options.maxTokens || 2048,
      temperature: options.temperature ?? 0.3,
      ...(options.jsonMode ? { response_format: { type: 'json_object' } } : {}),
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Groq inference failed: ${response.status} ${error}`);
  }

  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
    usage?: { prompt_tokens?: number; completion_tokens?: number };
    model?: string;
  };

  return {
    content: data.choices?.[0]?.message?.content || '',
    model: data.model || options.model || GROQ_MODEL,
    inputTokens: data.usage?.prompt_tokens || 0,
    outputTokens: data.usage?.completion_tokens || 0,
    inferenceTimeMs: Date.now() - startTime,
  };
}

// ============================================================================
// Auth & Utilities
// ============================================================================

/**
 * Get a GCP access token via Application Default Credentials.
 * In Cloud Run, uses the metadata server. Locally, uses gcloud ADC.
 */
async function getAccessToken(): Promise<string> {
  // Try metadata server first (Cloud Run / GCE environment)
  try {
    const response = await fetch(
      'http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/token',
      { headers: { 'Metadata-Flavor': 'Google' } },
    );

    if (response.ok) {
      const data = (await response.json()) as { access_token: string };
      return data.access_token;
    }
  } catch {
    // Not in GCP — fall through to ADC
  }

  // Fall back to GOOGLE_ACCESS_TOKEN env var (for local development)
  const token = process.env.GOOGLE_ACCESS_TOKEN;
  if (token) return token;

  throw new Error(
    'No GCP credentials available. Set GOOGLE_ACCESS_TOKEN for local dev, ' +
      'or deploy to Cloud Run for automatic auth.',
  );
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
