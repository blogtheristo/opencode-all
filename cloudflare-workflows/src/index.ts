/**
 * Cloudflare Worker — Workflow Registry + GitHub Webhook Router
 *
 * This Worker:
 *   1. Receives GitHub webhook events (push, pull_request)
 *   2. Maps branch/event → the correct Workflow binding
 *   3. Dispatches a new Workflow instance with the event payload
 *   4. Exposes /workflows/approve/:instanceId for prod approval gates
 *   5. Exposes /workflows/status/:instanceId for status polling
 *
 * All workflow classes are registered in WORKFLOW_REGISTRY below.
 * The router matches GitHub events to workflow bindings via TRIGGER_MAP.
 *
 * Environment bindings (configured in wrangler.toml):
 *   - One Workflow binding per entry in WORKFLOW_REGISTRY
 *   - GITHUB_WEBHOOK_SECRET   — validates incoming GitHub payloads
 *   - KV namespace CF_CACHE   — optional build cache
 */

import { OutokumpuDevWorkflow } from './customers/outokumpu/dev.workflow.js';
import { OutokumpuProdWorkflow } from './customers/outokumpu/prod.workflow.js';
import { NccDevWorkflow } from './customers/ncc/dev.workflow.js';
import { NccProdWorkflow } from './customers/ncc/prod.workflow.js';
import { KemiraDevWorkflow } from './customers/kemira/dev.workflow.js';
import { KemiraProdWorkflow } from './customers/kemira/prod.workflow.js';
import { Dws6ComDevWorkflow, Dws6ComProdWorkflow } from './domains/dws6-com.workflow.js';
import { Dws10ComDevWorkflow, Dws10ComProdWorkflow } from './domains/dws10-com.workflow.js';
import {
  OnelifetimeWorldDevWorkflow,
  OnelifetimeWorldProdWorkflow,
} from './domains/onelifetime-world.workflow.js';
import { WorkflowPayload, ApprovalGatePayload } from './base/types.js';

// Re-export all workflow classes so wrangler can discover them.
export {
  OutokumpuDevWorkflow,
  OutokumpuProdWorkflow,
  NccDevWorkflow,
  NccProdWorkflow,
  KemiraDevWorkflow,
  KemiraProdWorkflow,
  Dws6ComDevWorkflow,
  Dws6ComProdWorkflow,
  Dws10ComDevWorkflow,
  Dws10ComProdWorkflow,
  OnelifetimeWorldDevWorkflow,
  OnelifetimeWorldProdWorkflow,
};

// ---------------------------------------------------------------------------
// Cloudflare environment bindings type
// ---------------------------------------------------------------------------

interface Env {
  // Workflow bindings — one per entry in wrangler.toml [[workflows]]
  OUTOKUMPU_DEV_WORKFLOW: WorkflowBinding;
  OUTOKUMPU_PROD_WORKFLOW: WorkflowBinding;
  NCC_DEV_WORKFLOW: WorkflowBinding;
  NCC_PROD_WORKFLOW: WorkflowBinding;
  KEMIRA_DEV_WORKFLOW: WorkflowBinding;
  KEMIRA_PROD_WORKFLOW: WorkflowBinding;
  DWS6_COM_DEV_WORKFLOW: WorkflowBinding;
  DWS6_COM_PROD_WORKFLOW: WorkflowBinding;
  DWS10_COM_DEV_WORKFLOW: WorkflowBinding;
  DWS10_COM_PROD_WORKFLOW: WorkflowBinding;
  ONELIFETIME_WORLD_DEV_WORKFLOW: WorkflowBinding;
  ONELIFETIME_WORLD_PROD_WORKFLOW: WorkflowBinding;
  // Secrets
  GITHUB_WEBHOOK_SECRET: string;
}

// Minimal Cloudflare Workflows binding interface
interface WorkflowBinding {
  create(opts?: { id?: string; params?: unknown }): Promise<WorkflowInstance>;
  get(id: string): Promise<WorkflowInstance>;
}

interface WorkflowInstance {
  id: string;
  status(): Promise<{ status: string; output?: unknown }>;
  sendEvent(eventName: string, payload: unknown): Promise<void>;
}

// ---------------------------------------------------------------------------
// Trigger map: branch pattern → workflow binding key
// ---------------------------------------------------------------------------

interface TriggerRule {
  /** Glob-style branch pattern (simple prefix match with *) */
  branchPattern: string;
  /** Key of the workflow binding in Env */
  bindingKey: keyof Env;
  /** Trigger on push events */
  onPush?: boolean;
  /** Trigger on PR merge to this branch */
  onMergeTo?: string;
}

const TRIGGER_MAP: TriggerRule[] = [
  // Customer dev — push triggers
  { branchPattern: 'claude/outokumpu-*', bindingKey: 'OUTOKUMPU_DEV_WORKFLOW', onPush: true },
  { branchPattern: 'feature/outokumpu-*', bindingKey: 'OUTOKUMPU_DEV_WORKFLOW', onPush: true },
  { branchPattern: 'claude/ncc-*', bindingKey: 'NCC_DEV_WORKFLOW', onPush: true },
  { branchPattern: 'feature/ncc-*', bindingKey: 'NCC_DEV_WORKFLOW', onPush: true },
  { branchPattern: 'claude/kemira-*', bindingKey: 'KEMIRA_DEV_WORKFLOW', onPush: true },
  { branchPattern: 'feature/kemira-*', bindingKey: 'KEMIRA_DEV_WORKFLOW', onPush: true },
  // Domain dev — push triggers
  { branchPattern: 'feature/dws6-*', bindingKey: 'DWS6_COM_DEV_WORKFLOW', onPush: true },
  { branchPattern: 'feature/dws10-*', bindingKey: 'DWS10_COM_DEV_WORKFLOW', onPush: true },
  { branchPattern: 'feature/onelifetime-*', bindingKey: 'ONELIFETIME_WORLD_DEV_WORKFLOW', onPush: true },
  // Prod — PR merge to main triggers ALL prod workflows
  { branchPattern: 'main', bindingKey: 'OUTOKUMPU_PROD_WORKFLOW', onMergeTo: 'main' },
  { branchPattern: 'main', bindingKey: 'NCC_PROD_WORKFLOW', onMergeTo: 'main' },
  { branchPattern: 'main', bindingKey: 'KEMIRA_PROD_WORKFLOW', onMergeTo: 'main' },
  { branchPattern: 'main', bindingKey: 'DWS6_COM_PROD_WORKFLOW', onMergeTo: 'main' },
  { branchPattern: 'main', bindingKey: 'DWS10_COM_PROD_WORKFLOW', onMergeTo: 'main' },
  { branchPattern: 'main', bindingKey: 'ONELIFETIME_WORLD_PROD_WORKFLOW', onMergeTo: 'main' },
];

// ---------------------------------------------------------------------------
// GitHub webhook payload shapes (minimal)
// ---------------------------------------------------------------------------

interface GitHubPushEvent {
  ref: string; // e.g. "refs/heads/claude/ncc-feature"
  after: string;
  repository: { full_name: string };
}

interface GitHubPREvent {
  action: string; // "closed"
  pull_request: { merged: boolean; base: { ref: string }; head: { sha: string } };
  repository: { full_name: string };
}

// ---------------------------------------------------------------------------
// Worker fetch handler
// ---------------------------------------------------------------------------

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // Health check
    if (url.pathname === '/health') {
      return json({ status: 'ok', workflows: Object.keys(TRIGGER_MAP).length });
    }

    // Prod approval gate callback
    if (url.pathname.startsWith('/workflows/approve/')) {
      return handleApproval(request, url, env);
    }

    // Workflow status polling
    if (url.pathname.startsWith('/workflows/status/')) {
      return handleStatus(request, url, env);
    }

    // GitHub webhook
    if (url.pathname === '/webhook/github' && request.method === 'POST') {
      return handleGitHubWebhook(request, env);
    }

    return json({ error: 'Not found' }, 404);
  },
};

// ---------------------------------------------------------------------------
// Handlers
// ---------------------------------------------------------------------------

async function handleGitHubWebhook(request: Request, env: Env): Promise<Response> {
  // Validate GitHub HMAC signature
  const signature = request.headers.get('x-hub-signature-256') ?? '';
  const body = await request.text();

  if (!(await verifyGitHubSignature(body, signature, env.GITHUB_WEBHOOK_SECRET))) {
    return json({ error: 'Invalid signature' }, 401);
  }

  const eventType = request.headers.get('x-github-event') ?? '';
  const payload = JSON.parse(body) as unknown;

  const dispatched: string[] = [];

  if (eventType === 'push') {
    const push = payload as GitHubPushEvent;
    const branch = push.ref.replace('refs/heads/', '');
    const workflowPayload: WorkflowPayload = {
      event: 'push',
      branch,
      sha: push.after,
      repo: push.repository.full_name,
      triggeredAt: new Date().toISOString(),
    };

    for (const rule of TRIGGER_MAP) {
      if (rule.onPush && matchBranch(branch, rule.branchPattern)) {
        const binding = env[rule.bindingKey] as WorkflowBinding | undefined;
        if (binding) {
          const instance = await binding.create({ params: workflowPayload });
          dispatched.push(`${rule.bindingKey}:${instance.id}`);
        }
      }
    }
  }

  if (eventType === 'pull_request') {
    const pr = payload as GitHubPREvent;
    if (pr.action === 'closed' && pr.pull_request.merged) {
      const targetBranch = pr.pull_request.base.ref;
      const workflowPayload: WorkflowPayload = {
        event: 'pull_request',
        branch: targetBranch,
        sha: pr.pull_request.head.sha,
        repo: pr.repository.full_name,
        triggeredAt: new Date().toISOString(),
      };

      for (const rule of TRIGGER_MAP) {
        if (rule.onMergeTo && targetBranch === rule.onMergeTo) {
          const binding = env[rule.bindingKey] as WorkflowBinding | undefined;
          if (binding) {
            const instance = await binding.create({ params: workflowPayload });
            dispatched.push(`${rule.bindingKey}:${instance.id}`);
          }
        }
      }
    }
  }

  return json({ dispatched });
}

async function handleApproval(request: Request, url: URL, env: Env): Promise<Response> {
  if (request.method !== 'POST') {
    return json({ error: 'Method not allowed' }, 405);
  }

  const instanceId = url.pathname.split('/').pop() ?? '';
  const body = (await request.json()) as Partial<ApprovalGatePayload>;

  if (!body.approved || !body.approvedBy) {
    return json({ error: 'Missing required fields: approved, approvedBy' }, 400);
  }

  // Find the workflow instance across all prod bindings
  const prodBindings: Array<keyof Env> = [
    'OUTOKUMPU_PROD_WORKFLOW',
    'NCC_PROD_WORKFLOW',
    'KEMIRA_PROD_WORKFLOW',
    'DWS6_COM_PROD_WORKFLOW',
    'DWS10_COM_PROD_WORKFLOW',
    'ONELIFETIME_WORLD_PROD_WORKFLOW',
  ];

  for (const key of prodBindings) {
    const binding = env[key] as WorkflowBinding | undefined;
    if (!binding) continue;
    try {
      const instance = await binding.get(instanceId);
      await instance.sendEvent('prod-approval', {
        instanceId,
        approved: body.approved,
        approvedBy: body.approvedBy,
        approvedAt: new Date().toISOString(),
      });
      return json({ ok: true, instanceId, approvedBy: body.approvedBy });
    } catch {
      // Not found in this binding — try next
    }
  }

  return json({ error: `Workflow instance ${instanceId} not found` }, 404);
}

async function handleStatus(request: Request, url: URL, env: Env): Promise<Response> {
  if (request.method !== 'GET') {
    return json({ error: 'Method not allowed' }, 405);
  }

  const instanceId = url.pathname.split('/').pop() ?? '';
  const allBindings = Object.keys(env).filter((k) => k.endsWith('_WORKFLOW')) as Array<keyof Env>;

  for (const key of allBindings) {
    const binding = env[key] as WorkflowBinding | undefined;
    if (!binding) continue;
    try {
      const instance = await binding.get(instanceId);
      const status = await instance.status();
      return json({ instanceId, binding: key, ...status });
    } catch {
      // Not in this binding
    }
  }

  return json({ error: `Workflow instance ${instanceId} not found` }, 404);
}

// ---------------------------------------------------------------------------
// Utilities
// ---------------------------------------------------------------------------

function matchBranch(branch: string, pattern: string): boolean {
  if (pattern === branch) return true;
  if (pattern.endsWith('*')) {
    return branch.startsWith(pattern.slice(0, -1));
  }
  return false;
}

async function verifyGitHubSignature(
  body: string,
  signature: string,
  secret: string,
): Promise<boolean> {
  try {
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify'],
    );
    const [, hex] = signature.split('=');
    const sigBytes = hexToUint8Array(hex);
    return crypto.subtle.verify('HMAC', key, sigBytes, encoder.encode(body));
  } catch {
    return false;
  }
}

function hexToUint8Array(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.slice(i, i + 2), 16);
  }
  return bytes;
}

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}
