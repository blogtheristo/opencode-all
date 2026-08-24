/**
 * DWS IQ Multi-Tenant Sandbox Manager
 * 
 * Implements Cloudflare Workers for Platforms to provide isolated sandbox
 * environments for each enterprise customer. Each customer gets their own
 * Worker with dedicated resources and security isolation.
 * 
 * Features:
 * - Customer-specific Claude agent execution
 * - Isolated KV namespaces per tenant
 * - Usage metering per tenant
 * - Custom tool configurations
 * - EU data residency enforcement
 * 
 * @module cloudflare/tenant-sandbox
 * @version 1.0.0
 * @license Proprietary - Lifetime Oy
  */

// ============================================================================
// Types and Interfaces
// ============================================================================

export interface Env {
  // Platform dispatcher for routing to tenant workers
  DISPATCHER: DispatchNamespace;
  
  // Admin API for tenant management
  ADMIN_API_KEY: string;
  
  // Anthropic API for shared Claude access
  ANTHROPIC_API_KEY: string;
  
  // Tenant configuration store
  TENANT_CONFIG: KVNamespace;
  
  // Usage tracking
  USAGE_METRICS: AnalyticsEngineDataset;
  
  // MCP Hub origin for backend operations
  MCP_HUB_ORIGIN: string;
}

export interface TenantSandboxConfig {
  tenantId: string;
  tenantName: string;
  
  // Subscription tier
  tier: 'sandbox' | 'professional' | 'enterprise';
  
  // Resource limits
  limits: {
    maxTokensPerRequest: number;
    maxRequestsPerMinute: number;
    maxConcurrentRequests: number;
    maxStorageMB: number;
  };
  
  // Allowed Claude models
  allowedModels: string[];
  
  // Custom system prompts
  customSystemPrompt?: string;
  
  // Enabled tools
  enabledTools: string[];
  
  // Custom tool definitions
  customTools?: ToolDefinition[];
  
  // MCP servers to connect
  mcpServers?: MCPServerConfig[];
  
  // Webhook for events
  webhookUrl?: string;
  
  // EU-only data processing
  euDataResidency: boolean;
  
  // Billing
  billing: {
    customerId: string;
    subscriptionId: string;
    pricePerToken: number;
  };
  
  // Status
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ToolDefinition {
  name: string;
  description: string;
  input_schema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
  handler?: string; // URL or MCP server reference
}

interface MCPServerConfig {
  name: string;
  url: string;
  apiKey?: string;
  tools?: string[];
}

// ============================================================================
// Tier Configurations
// ============================================================================

const TIER_LIMITS: Record<TenantSandboxConfig['tier'], TenantSandboxConfig['limits']> = {
  sandbox: {
    maxTokensPerRequest: 4096,
    maxRequestsPerMinute: 20,
    maxConcurrentRequests: 2,
    maxStorageMB: 100
  },
  professional: {
    maxTokensPerRequest: 16384,
    maxRequestsPerMinute: 100,
    maxConcurrentRequests: 10,
    maxStorageMB: 1000
  },
  enterprise: {
    maxTokensPerRequest: 100000,
    maxRequestsPerMinute: 1000,
    maxConcurrentRequests: 50,
    maxStorageMB: 10000
  }
};

const TIER_PRICING: Record<TenantSandboxConfig['tier'], number> = {
  sandbox: 0.00002,      // $0.02 per 1K tokens
  professional: 0.000015, // $0.015 per 1K tokens
  enterprise: 0.00001     // $0.01 per 1K tokens
};

// ============================================================================
// Tenant Configuration Management
// ============================================================================

async function getTenantConfig(
  env: Env,
  tenantId: string
): Promise<TenantSandboxConfig | null> {
  const config = await env.TENANT_CONFIG.get(`tenant:${tenantId}`, 'json');
  return config as TenantSandboxConfig | null;
}

async function saveTenantConfig(
  env: Env,
  config: TenantSandboxConfig
): Promise<void> {
  config.updatedAt = new Date().toISOString();
  await env.TENANT_CONFIG.put(
    `tenant:${config.tenantId}`,
    JSON.stringify(config)
  );
}

async function createTenantConfig(
  env: Env,
  tenantId: string,
  tenantName: string,
  tier: TenantSandboxConfig['tier'],
  customerId: string
): Promise<TenantSandboxConfig> {
  const now = new Date().toISOString();
  
  const config: TenantSandboxConfig = {
    tenantId,
    tenantName,
    tier,
    limits: TIER_LIMITS[tier],
    allowedModels: ['claude-sonnet-4-20250514', 'claude-3-5-haiku-20241022'],
    enabledTools: ['carbon_calculate', 'compliance_check', 'generate_report', 'supplier_assess'],
    euDataResidency: true,
    billing: {
      customerId,
      subscriptionId: `sub_${tenantId}_${Date.now()}`,
      pricePerToken: TIER_PRICING[tier]
    },
    enabled: true,
    createdAt: now,
    updatedAt: now
  };
  
  await saveTenantConfig(env, config);
  return config;
}

// ============================================================================
// Worker Script Template for Tenant Sandboxes
// ============================================================================

function generateTenantWorkerScript(config: TenantSandboxConfig): string {
  return `
// Auto-generated tenant sandbox worker for ${config.tenantName}
// Tenant ID: ${config.tenantId}
// Generated: ${new Date().toISOString()}

const TENANT_CONFIG = ${JSON.stringify(config, null, 2)};

export default {
  async fetch(request, env, ctx) {
    // Validate tenant
    const tenantId = request.headers.get('X-Tenant-ID');
    if (tenantId !== TENANT_CONFIG.tenantId) {
      return new Response(JSON.stringify({ error: 'Tenant mismatch' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Rate limiting check
    const rateKey = \`rate:\${TENANT_CONFIG.tenantId}:\${Math.floor(Date.now() / 60000)}\`;
    const currentRate = await env.TENANT_KV.get(rateKey) || '0';
    if (parseInt(currentRate) >= TENANT_CONFIG.limits.maxRequestsPerMinute) {
      return new Response(JSON.stringify({ error: 'Rate limit exceeded' }), {
        status: 429,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    await env.TENANT_KV.put(rateKey, String(parseInt(currentRate) + 1), { expirationTtl: 120 });
    
    // Process request
    const body = await request.json();
    
    // Execute with Claude
    const client = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY });
    
    const systemPrompt = TENANT_CONFIG.customSystemPrompt || 
      'You are a DWS IQ climate intelligence agent for ' + TENANT_CONFIG.tenantName;
    
    const response = await client.messages.create({
      model: body.model || TENANT_CONFIG.allowedModels[0],
      max_tokens: Math.min(body.maxTokens || 4096, TENANT_CONFIG.limits.maxTokensPerRequest),
      system: systemPrompt,
      messages: body.messages
    });
    
    // Record usage
    env.USAGE_METRICS.writeDataPoint({
      blobs: [TENANT_CONFIG.tenantId, TENANT_CONFIG.tier],
      doubles: [response.usage.input_tokens, response.usage.output_tokens],
      indexes: [TENANT_CONFIG.tenantId]
    });
    
    return new Response(JSON.stringify({
      response: response.content,
      usage: response.usage,
      tenantId: TENANT_CONFIG.tenantId
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
`;
}

// ============================================================================
// Dispatch to Tenant Workers
// ============================================================================

async function dispatchToTenant(
  env: Env,
  tenantId: string,
  request: Request
): Promise<Response> {
  try {
    // Get the tenant's worker
    const worker = env.DISPATCHER.get(tenantId);
    
    // Forward the request
    return await worker.fetch(request);
  } catch (error) {
    // Tenant worker doesn't exist or failed
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: `Tenant dispatch failed: ${errorMessage}` }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

// ============================================================================
// Usage Tracking
// ============================================================================

interface UsageRecord {
  tenantId: string;
  date: string;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  requests: number;
  cost: number;
}

async function getUsageReport(
  env: Env,
  tenantId: string,
  startDate: string,
  endDate: string
): Promise<UsageRecord[]> {
  const records: UsageRecord[] = [];
  
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  for (let date = start; date <= end; date.setDate(date.getDate() + 1)) {
    const dateStr = date.toISOString().split('T')[0];
    const usageKey = `usage:${tenantId}:${dateStr}`;
    const record = await env.TENANT_CONFIG.get(usageKey, 'json') as UsageRecord | null;
    if (record) {
      records.push(record);
    }
  }
  
  return records;
}

// ============================================================================
// Admin API Handlers
// ============================================================================

async function handleAdminRequest(
  request: Request,
  env: Env
): Promise<Response> {
  const url = new URL(request.url);
  const path = url.pathname;
  
  // Verify admin API key
  const apiKey = request.headers.get('X-Admin-API-Key');
  if (apiKey !== env.ADMIN_API_KEY) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  // Route admin endpoints
  if (path === '/admin/tenants' && request.method === 'POST') {
    return handleCreateTenant(request, env);
  }
  
  if (path.startsWith('/admin/tenants/') && request.method === 'GET') {
    const tenantId = path.split('/')[3];
    return handleGetTenant(tenantId, env);
  }
  
  if (path.startsWith('/admin/tenants/') && request.method === 'PUT') {
    const tenantId = path.split('/')[3];
    return handleUpdateTenant(tenantId, request, env);
  }
  
  if (path.startsWith('/admin/tenants/') && path.endsWith('/usage') && request.method === 'GET') {
    const tenantId = path.split('/')[3];
    return handleGetUsage(tenantId, url, env);
  }
  
  if (path === '/admin/tenants' && request.method === 'GET') {
    return handleListTenants(env);
  }
  
  return new Response(JSON.stringify({ error: 'Not found' }), {
    status: 404,
    headers: { 'Content-Type': 'application/json' }
  });
}

async function handleCreateTenant(
  request: Request,
  env: Env
): Promise<Response> {
  const body = await request.json() as {
    tenantId: string;
    tenantName: string;
    tier: TenantSandboxConfig['tier'];
    customerId: string;
    customSystemPrompt?: string;
  };
  
  // Check if tenant already exists
  const existing = await getTenantConfig(env, body.tenantId);
  if (existing) {
    return new Response(JSON.stringify({ error: 'Tenant already exists' }), {
      status: 409,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  // Create tenant config
  const config = await createTenantConfig(
    env,
    body.tenantId,
    body.tenantName,
    body.tier,
    body.customerId
  );
  
  if (body.customSystemPrompt) {
    config.customSystemPrompt = body.customSystemPrompt;
    await saveTenantConfig(env, config);
  }
  
  return new Response(JSON.stringify({
    success: true,
    tenant: config,
    workerScript: generateTenantWorkerScript(config)
  }), {
    status: 201,
    headers: { 'Content-Type': 'application/json' }
  });
}

async function handleGetTenant(
  tenantId: string,
  env: Env
): Promise<Response> {
  const config = await getTenantConfig(env, tenantId);
  
  if (!config) {
    return new Response(JSON.stringify({ error: 'Tenant not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  return new Response(JSON.stringify(config), {
    headers: { 'Content-Type': 'application/json' }
  });
}

async function handleUpdateTenant(
  tenantId: string,
  request: Request,
  env: Env
): Promise<Response> {
  const existing = await getTenantConfig(env, tenantId);
  
  if (!existing) {
    return new Response(JSON.stringify({ error: 'Tenant not found' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  const updates = await request.json() as Partial<TenantSandboxConfig>;
  
  // Apply updates (excluding immutable fields)
  const updated: TenantSandboxConfig = {
    ...existing,
    ...updates,
    tenantId: existing.tenantId, // Immutable
    createdAt: existing.createdAt, // Immutable
    billing: {
      ...existing.billing,
      ...(updates.billing || {})
    }
  };
  
  // Update limits if tier changed
  if (updates.tier && updates.tier !== existing.tier) {
    updated.limits = TIER_LIMITS[updates.tier];
    updated.billing.pricePerToken = TIER_PRICING[updates.tier];
  }
  
  await saveTenantConfig(env, updated);
  
  return new Response(JSON.stringify({
    success: true,
    tenant: updated
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
}

async function handleGetUsage(
  tenantId: string,
  url: URL,
  env: Env
): Promise<Response> {
  const startDate = url.searchParams.get('start') || 
    new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const endDate = url.searchParams.get('end') || 
    new Date().toISOString().split('T')[0];
  
  const records = await getUsageReport(env, tenantId, startDate, endDate);
  
  const summary = records.reduce((acc, record) => ({
    totalInputTokens: acc.totalInputTokens + record.inputTokens,
    totalOutputTokens: acc.totalOutputTokens + record.outputTokens,
    totalTokens: acc.totalTokens + record.totalTokens,
    totalRequests: acc.totalRequests + record.requests,
    totalCost: acc.totalCost + record.cost
  }), {
    totalInputTokens: 0,
    totalOutputTokens: 0,
    totalTokens: 0,
    totalRequests: 0,
    totalCost: 0
  });
  
  return new Response(JSON.stringify({
    tenantId,
    period: { start: startDate, end: endDate },
    summary,
    daily: records
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
}

async function handleListTenants(env: Env): Promise<Response> {
  const list = await env.TENANT_CONFIG.list({ prefix: 'tenant:' });
  
  const tenants: TenantSandboxConfig[] = [];
  for (const key of list.keys) {
    const config = await env.TENANT_CONFIG.get(key.name, 'json') as TenantSandboxConfig;
    if (config) {
      tenants.push(config);
    }
  }
  
  return new Response(JSON.stringify({
    count: tenants.length,
    tenants: tenants.map(t => ({
      tenantId: t.tenantId,
      tenantName: t.tenantName,
      tier: t.tier,
      enabled: t.enabled,
      createdAt: t.createdAt
    }))
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
}

// ============================================================================
// CORS Headers
// ============================================================================

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Tenant-ID, X-Admin-API-Key',
  'Access-Control-Max-Age': '86400'
};

// ============================================================================
// Main Worker Handler
// ============================================================================

export default {
  async fetch(
    request: Request,
    env: Env,
    _ctx: ExecutionContext
  ): Promise<Response> {
    const url = new URL(request.url);
    
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: CORS_HEADERS });
    }
    
    // Health check
    if (url.pathname === '/health') {
      return new Response(JSON.stringify({
        status: 'healthy',
        service: 'dws-iq-tenant-sandbox',
        version: '1.0.0'
      }), {
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }
      });
    }
    
    // Admin API endpoints
    if (url.pathname.startsWith('/admin/')) {
      const response = await handleAdminRequest(request, env);
      // Add CORS headers to response
      const headers = new Headers(response.headers);
      Object.entries(CORS_HEADERS).forEach(([key, value]) => {
        headers.set(key, value);
      });
      return new Response(response.body, {
        status: response.status,
        headers
      });
    }
    
    // Tenant sandbox execution
    if (url.pathname === '/sandbox/execute') {
      const tenantId = request.headers.get('X-Tenant-ID');
      
      if (!tenantId) {
        return new Response(JSON.stringify({ error: 'X-Tenant-ID header required' }), {
          status: 400,
          headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }
        });
      }
      
      // Get tenant config
      const config = await getTenantConfig(env, tenantId);
      if (!config || !config.enabled) {
        return new Response(JSON.stringify({ error: 'Tenant not found or disabled' }), {
          status: 404,
          headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }
        });
      }
      
      // Dispatch to tenant worker or execute in shared sandbox
      const response = await dispatchToTenant(env, tenantId, request);
      
      // Add CORS headers
      const headers = new Headers(response.headers);
      Object.entries(CORS_HEADERS).forEach(([key, value]) => {
        headers.set(key, value);
      });
      
      return new Response(response.body, {
        status: response.status,
        headers
      });
    }
    
    return new Response(JSON.stringify({ error: 'Not found' }), {
      status: 404,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }
    });
  }
};
