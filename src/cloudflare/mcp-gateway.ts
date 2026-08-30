/**
 * DWS IQ MCP Edge Gateway
 * 
 * A Cloudflare Worker that acts as an edge gateway for Model Context Protocol (MCP)
 * requests, routing them to the appropriate MCP Hub backend with authentication,
 * rate limiting, and caching.
 * 
 * This gateway enables:
 * - Remote MCP server connections at the edge
 * - OAuth authentication for enterprise customers
 * - Request routing to customer-specific sandbox workers
 * - Caching for frequently accessed MCP resources
 * - EU data residency enforcement
 * 
 * @module cloudflare/mcp-gateway
 * @version 1.0.0
 * @license Proprietary - Lifetime Oy
 */

// ============================================================================
// Types and Interfaces
// ============================================================================

export interface Env {
  // MCP Hub origin URL
  MCP_HUB_ORIGIN: string;
  
  // API key for backend authentication
  MCP_HUB_API_KEY: string;
  
  // OAuth configuration
  OAUTH_CLIENT_ID: string;
  OAUTH_CLIENT_SECRET: string;
  OAUTH_TOKEN_URL: string;
  
  // KV for caching and rate limiting
  MCP_CACHE: KVNamespace;
  RATE_LIMIT_KV: KVNamespace;
  
  // Customer tenant routing
  TENANT_ROUTES: KVNamespace;
  
  // Analytics
  USAGE_METRICS: AnalyticsEngineDataset;
}

interface MCPRequest {
  jsonrpc: '2.0';
  id: string | number;
  method: string;
  params?: Record<string, unknown>;
}

interface MCPResponse {
  jsonrpc: '2.0';
  id: string | number;
  result?: unknown;
  error?: {
    code: number;
    message: string;
    data?: unknown;
  };
}

interface TenantConfig {
  tenantId: string;
  name: string;
  workerUrl?: string;
  allowedTools: string[];
  rateLimit: number;
  cacheTtl: number;
  enabled: boolean;
}

// ============================================================================
// CORS Headers
// ============================================================================

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Tenant-ID, X-MCP-Session-ID',
  'Access-Control-Expose-Headers': 'X-MCP-Session-ID',
  'Access-Control-Max-Age': '86400'
};

// ============================================================================
// Authentication
// ============================================================================

async function validateBearerToken(
  authHeader: string | null,
  env: Env
): Promise<{ valid: boolean; tenantId?: string; error?: string }> {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { valid: false, error: 'Missing or invalid Authorization header' };
  }
  
  const token = authHeader.substring(7);
  
  // Check if it's a simple API key (for development/testing)
  if (token === env.MCP_HUB_API_KEY) {
    return { valid: true, tenantId: 'internal' };
  }
  
  // Validate OAuth token
  try {
    const tokenInfo = await validateOAuthToken(token, env);
    if (tokenInfo) {
      return { valid: true, tenantId: tokenInfo.tenantId };
    }
    return { valid: false, error: 'Invalid or expired token' };
  } catch {
    return { valid: false, error: 'Token validation failed' };
  }
}

// Validate OAuth URL to prevent SSRF (defense in depth for env vars)
function validateOAuthUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    
    // Must be HTTPS
    if (parsed.protocol !== 'https:') {
      return false;
    }
    
    // Must be on trusted auth domain
    const trustedDomains = ['dws10.com', 'auth0.com', 'okta.com', 'onelifetime.world'];
    const hostname = parsed.hostname.toLowerCase();
    const isTrusted = trustedDomains.some(domain => 
      hostname === domain || hostname.endsWith(`.${domain}`)
    );
    
    return isTrusted;
  } catch {
    return false;
  }
}

async function validateOAuthToken(
  token: string,
  env: Env
): Promise<{ tenantId: string; scope: string } | null> {
  // Check token cache first
  const cacheKey = `token:${hashToken(token)}`;
  const cached = await env.MCP_CACHE.get(cacheKey, 'json') as {
    tenantId: string;
    scope: string;
    expiresAt: number;
  } | null;
  
  if (cached && cached.expiresAt > Date.now()) {
    return { tenantId: cached.tenantId, scope: cached.scope };
  }
  
  // Validate OAuth URL before making request (defense in depth)
  // Note: OAUTH_TOKEN_URL is from environment configuration, not user input.
  // Static analysis may flag this as SSRF but URL is validated before use.
  const introspectUrl = env.OAUTH_TOKEN_URL.replace('/token', '/introspect');
  if (!validateOAuthUrl(introspectUrl)) {
    console.error('Invalid OAuth URL configured - potential SSRF risk');
    return null;
  }
  
  // nosemgrep: ssrf - URL is validated by validateOAuthUrl above
  // Introspect token with OAuth server
  const response = await fetch(introspectUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${btoa(`${env.OAUTH_CLIENT_ID}:${env.OAUTH_CLIENT_SECRET}`)}`
    },
    body: new URLSearchParams({ token })
  });
  
  if (!response.ok) {
    return null;
  }
  
  const data = await response.json() as {
    active: boolean;
    sub?: string;
    scope?: string;
    exp?: number;
  };
  
  if (!data.active || !data.sub) {
    return null;
  }
  
  // Cache the validated token
  const tokenData = {
    tenantId: data.sub,
    scope: data.scope || '',
    expiresAt: (data.exp || Math.floor(Date.now() / 1000) + 3600) * 1000
  };
  
  await env.MCP_CACHE.put(cacheKey, JSON.stringify(tokenData), {
    expirationTtl: Math.floor((tokenData.expiresAt - Date.now()) / 1000)
  });
  
  return { tenantId: tokenData.tenantId, scope: tokenData.scope };
}

function hashToken(token: string): string {
  // Simple hash for cache key (not for security)
  let hash = 0;
  for (let i = 0; i < token.length; i++) {
    const char = token.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
}

// ============================================================================
// Rate Limiting
// ============================================================================

async function checkRateLimit(
  env: Env,
  tenantId: string,
  limit: number
): Promise<{ allowed: boolean; remaining: number; resetAt: number }> {
  const key = `mcp-ratelimit:${tenantId}`;
  const now = Date.now();
  const windowMs = 60 * 1000;
  
  const stored = await env.RATE_LIMIT_KV.get(key, 'json') as {
    count: number;
    windowStart: number;
  } | null;
  
  if (!stored || now - stored.windowStart >= windowMs) {
    await env.RATE_LIMIT_KV.put(key, JSON.stringify({
      count: 1,
      windowStart: now
    }), { expirationTtl: 120 });
    return { allowed: true, remaining: limit - 1, resetAt: now + windowMs };
  }
  
  if (stored.count >= limit) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: stored.windowStart + windowMs
    };
  }
  
  await env.RATE_LIMIT_KV.put(key, JSON.stringify({
    count: stored.count + 1,
    windowStart: stored.windowStart
  }), { expirationTtl: 120 });
  
  return {
    allowed: true,
    remaining: limit - stored.count - 1,
    resetAt: stored.windowStart + windowMs
  };
}

// ============================================================================
// Tenant Routing
// ============================================================================

async function getTenantConfig(
  env: Env,
  tenantId: string
): Promise<TenantConfig | null> {
  const config = await env.TENANT_ROUTES.get(`tenant:${tenantId}`, 'json') as TenantConfig | null;
  
  if (!config) {
    return null;
  }
  
  return config;
}

function isToolAllowed(tenantConfig: TenantConfig, toolName: string): boolean {
  if (tenantConfig.allowedTools.includes('*')) {
    return true;
  }
  return tenantConfig.allowedTools.includes(toolName);
}

// ============================================================================
// MCP Protocol Handling
// ============================================================================

function parseMCPRequest(body: unknown): MCPRequest {
  if (!body || typeof body !== 'object') {
    throw new Error('Invalid JSON-RPC request body');
  }
  
  const request = body as Record<string, unknown>;
  
  if (request.jsonrpc !== '2.0') {
    throw new Error('Invalid JSON-RPC version (must be 2.0)');
  }
  
  if (!request.method || typeof request.method !== 'string') {
    throw new Error('Missing or invalid method');
  }
  
  return {
    jsonrpc: '2.0',
    id: (request.id as string | number) ?? 0,
    method: request.method,
    params: request.params as Record<string, unknown> | undefined
  };
}

function createMCPError(
  id: string | number,
  code: number,
  message: string,
  data?: unknown
): MCPResponse {
  return {
    jsonrpc: '2.0',
    id,
    error: { code, message, data }
  };
}

// MCP Error Codes
const MCP_ERRORS = {
  PARSE_ERROR: -32700,
  INVALID_REQUEST: -32600,
  METHOD_NOT_FOUND: -32601,
  INVALID_PARAMS: -32602,
  INTERNAL_ERROR: -32603,
  UNAUTHORIZED: -32001,
  RATE_LIMITED: -32002,
  TOOL_NOT_ALLOWED: -32003
};

// ============================================================================
// Caching
// ============================================================================

async function getCachedResponse(
  env: Env,
  tenantId: string,
  method: string,
  params: Record<string, unknown> | undefined
): Promise<MCPResponse | null> {
  // Only cache read-only methods
  const cacheableMethods = ['tools/list', 'resources/list', 'resources/read'];
  if (!cacheableMethods.includes(method)) {
    return null;
  }
  
  const cacheKey = `mcp-cache:${tenantId}:${method}:${JSON.stringify(params || {})}`;
  const cached = await env.MCP_CACHE.get(cacheKey, 'json') as MCPResponse | null;
  return cached;
}

async function setCachedResponse(
  env: Env,
  tenantId: string,
  method: string,
  params: Record<string, unknown> | undefined,
  response: MCPResponse,
  ttl: number
): Promise<void> {
  const cacheKey = `mcp-cache:${tenantId}:${method}:${JSON.stringify(params || {})}`;
  await env.MCP_CACHE.put(cacheKey, JSON.stringify(response), {
    expirationTtl: ttl
  });
}

// ============================================================================
// Backend Communication
// ============================================================================

async function forwardToMCPHub(
  env: Env,
  request: MCPRequest,
  tenantId: string,
  sessionId: string | null
): Promise<MCPResponse> {
  const response = await fetch(`${env.MCP_HUB_ORIGIN}/mcp`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${env.MCP_HUB_API_KEY}`,
      'X-Tenant-ID': tenantId,
      'X-MCP-Session-ID': sessionId || '',
      'X-Forwarded-For': 'cloudflare-edge'
    },
    body: JSON.stringify(request)
  });
  
  if (!response.ok) {
    throw new Error(`MCP Hub returned ${response.status}: ${await response.text()}`);
  }
  
  return await response.json() as MCPResponse;
}

// Allowlist of valid worker URL domains to prevent SSRF
const ALLOWED_WORKER_DOMAINS = [
  'workers.dev',
  'dws10.com',
  'onelifetime.world',
  'cloudflare.com'
];

function validateWorkerUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    
    // Must be HTTPS in production
    if (parsed.protocol !== 'https:') {
      return false;
    }
    
    // Must be on allowed domain
    const hostname = parsed.hostname.toLowerCase();
    const isAllowed = ALLOWED_WORKER_DOMAINS.some(domain => 
      hostname === domain || hostname.endsWith(`.${domain}`)
    );
    
    if (!isAllowed) {
      return false;
    }
    
    // Prevent localhost/internal network access
    const blockedPatterns = [
      /^localhost$/i,
      /^127\./,
      /^10\./,
      /^192\.168\./,
      /^172\.(1[6-9]|2[0-9]|3[0-1])\./,
      /^169\.254\./,
      /^\[::1\]$/,
      /^0\.0\.0\.0$/
    ];
    
    if (blockedPatterns.some(pattern => pattern.test(hostname))) {
      return false;
    }
    
    return true;
  } catch {
    return false;
  }
}

async function forwardToCustomerWorker(
  workerUrl: string,
  request: MCPRequest,
  tenantId: string,
  sessionId: string | null
): Promise<MCPResponse> {
  // Validate URL to prevent SSRF attacks
  if (!validateWorkerUrl(workerUrl)) {
    throw new Error('Invalid worker URL: URL must be HTTPS and on an allowed domain');
  }
  
  const response = await fetch(workerUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Tenant-ID': tenantId,
      'X-MCP-Session-ID': sessionId || ''
    },
    body: JSON.stringify(request)
  });
  
  if (!response.ok) {
    throw new Error(`Customer worker returned ${response.status}`);
  }
  
  return await response.json() as MCPResponse;
}

// ============================================================================
// Usage Metrics
// ============================================================================

function recordUsage(
  env: Env,
  tenantId: string,
  method: string,
  latencyMs: number,
  cached: boolean,
  success: boolean
): void {
  env.USAGE_METRICS.writeDataPoint({
    blobs: [tenantId, method, cached ? 'hit' : 'miss', success ? 'success' : 'error'],
    doubles: [latencyMs, cached ? 0 : 1, success ? 1 : 0],
    indexes: [tenantId]
  });
}

// ============================================================================
// SSE Streaming for Long-Running Operations
// ============================================================================

function createSSEStream(
  env: Env,
  tenantId: string,
  request: MCPRequest,
  sessionId: string | null
): ReadableStream {
  const encoder = new TextEncoder();
  
  return new ReadableStream({
    async start(controller) {
      try {
        // Send initial event
        controller.enqueue(encoder.encode(`event: start\ndata: ${JSON.stringify({ id: request.id })}\n\n`));
        
        // Forward to MCP Hub with streaming
        const response = await fetch(`${env.MCP_HUB_ORIGIN}/mcp/stream`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${env.MCP_HUB_API_KEY}`,
            'X-Tenant-ID': tenantId,
            'X-MCP-Session-ID': sessionId || '',
            'Accept': 'text/event-stream'
          },
          body: JSON.stringify(request)
        });
        
        if (!response.ok || !response.body) {
          throw new Error('Failed to get stream from MCP Hub');
        }
        
        const reader = response.body.getReader();
        
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          controller.enqueue(value);
        }
        
        controller.close();
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        controller.enqueue(encoder.encode(`event: error\ndata: ${JSON.stringify({ error: errorMessage })}\n\n`));
        controller.close();
      }
    }
  });
}

// ============================================================================
// Main Gateway Handler
// ============================================================================

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {
    const startTime = Date.now();
    
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: CORS_HEADERS });
    }
    
    // Handle health check
    const url = new URL(request.url);
    if (url.pathname === '/health') {
      return new Response(JSON.stringify({
        status: 'healthy',
        service: 'dws-iq-mcp-gateway',
        version: '1.0.0',
        timestamp: new Date().toISOString()
      }), {
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }
      });
    }
    
    // Handle server info (SSE endpoint discovery)
    if (url.pathname === '/.well-known/mcp.json') {
      return new Response(JSON.stringify({
        name: 'DWS IQ MCP Gateway',
        version: '1.0.0',
        description: 'Climate intelligence MCP gateway for EU Fit for 55 compliance',
        endpoints: {
          mcp: '/mcp',
          stream: '/mcp/stream',
          tools: '/mcp/tools',
          health: '/health'
        },
        capabilities: {
          tools: true,
          resources: true,
          prompts: true,
          streaming: true
        }
      }), {
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }
      });
    }
    
    // Only accept POST for MCP endpoints
    if (request.method !== 'POST') {
      return new Response(
        JSON.stringify(createMCPError(0, MCP_ERRORS.INVALID_REQUEST, 'Method not allowed')),
        { status: 405, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
      );
    }
    
    let mcpRequest: MCPRequest | null = null;
    let tenantId = 'anonymous';
    let cached = false;
    let success = false;
    
    try {
      // Authenticate request
      const authResult = await validateBearerToken(request.headers.get('Authorization'), env);
      if (!authResult.valid) {
        return new Response(
          JSON.stringify(createMCPError(0, MCP_ERRORS.UNAUTHORIZED, authResult.error || 'Unauthorized')),
          { status: 401, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
        );
      }
      tenantId = authResult.tenantId || 'anonymous';
      
      // Get tenant configuration
      const tenantConfig = await getTenantConfig(env, tenantId);
      if (!tenantConfig || !tenantConfig.enabled) {
        return new Response(
          JSON.stringify(createMCPError(0, MCP_ERRORS.UNAUTHORIZED, 'Tenant disabled or not found')),
          { status: 403, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
        );
      }
      
      // Check rate limit
      const rateLimit = await checkRateLimit(env, tenantId, tenantConfig.rateLimit);
      if (!rateLimit.allowed) {
        return new Response(
          JSON.stringify(createMCPError(0, MCP_ERRORS.RATE_LIMITED, 'Rate limit exceeded')),
          {
            status: 429,
            headers: {
              ...CORS_HEADERS,
              'Content-Type': 'application/json',
              'X-RateLimit-Remaining': '0',
              'X-RateLimit-Reset': rateLimit.resetAt.toString()
            }
          }
        );
      }
      
      // Parse MCP request
      const body = await request.json();
      mcpRequest = parseMCPRequest(body);
      
      // Check if tool is allowed for this tenant
      if (mcpRequest.method.startsWith('tools/call')) {
        const toolName = (mcpRequest.params?.name as string) || '';
        if (!isToolAllowed(tenantConfig, toolName)) {
          return new Response(
            JSON.stringify(createMCPError(mcpRequest.id, MCP_ERRORS.TOOL_NOT_ALLOWED, `Tool '${toolName}' not allowed for this tenant`)),
            { status: 403, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' } }
          );
        }
      }
      
      // Check cache for cacheable methods
      const cachedResponse = await getCachedResponse(env, tenantId, mcpRequest.method, mcpRequest.params);
      if (cachedResponse) {
        cached = true;
        success = true;
        return new Response(
          JSON.stringify(cachedResponse),
          {
            headers: {
              ...CORS_HEADERS,
              'Content-Type': 'application/json',
              'X-Cache': 'HIT',
              'X-RateLimit-Remaining': rateLimit.remaining.toString()
            }
          }
        );
      }
      
      // Get session ID for context continuity
      const sessionId = request.headers.get('X-MCP-Session-ID');
      
      // Check for streaming request
      if (url.pathname === '/mcp/stream' || request.headers.get('Accept') === 'text/event-stream') {
        const stream = createSSEStream(env, tenantId, mcpRequest, sessionId);
        return new Response(stream, {
          headers: {
            ...CORS_HEADERS,
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
            ...(sessionId ? { 'X-MCP-Session-ID': sessionId } : {})
          }
        });
      }
      
      // Route to appropriate backend
      let mcpResponse: MCPResponse;
      
      if (tenantConfig.workerUrl) {
        // Route to customer's dedicated sandbox worker
        mcpResponse = await forwardToCustomerWorker(
          tenantConfig.workerUrl,
          mcpRequest,
          tenantId,
          sessionId
        );
      } else {
        // Route to shared MCP Hub
        mcpResponse = await forwardToMCPHub(env, mcpRequest, tenantId, sessionId);
      }
      
      success = !mcpResponse.error;
      
      // Cache successful responses
      if (success && tenantConfig.cacheTtl > 0) {
        ctx.waitUntil(setCachedResponse(
          env,
          tenantId,
          mcpRequest.method,
          mcpRequest.params,
          mcpResponse,
          tenantConfig.cacheTtl
        ));
      }
      
      return new Response(
        JSON.stringify(mcpResponse),
        {
          headers: {
            ...CORS_HEADERS,
            'Content-Type': 'application/json',
            'X-Cache': 'MISS',
            'X-RateLimit-Remaining': rateLimit.remaining.toString(),
            ...(sessionId ? { 'X-MCP-Session-ID': sessionId } : {})
          }
        }
      );
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const errorCode = errorMessage.includes('Invalid') ? MCP_ERRORS.INVALID_REQUEST : MCP_ERRORS.INTERNAL_ERROR;
      
      return new Response(
        JSON.stringify(createMCPError(mcpRequest?.id ?? 0, errorCode, errorMessage)),
        {
          status: errorCode === MCP_ERRORS.INVALID_REQUEST ? 400 : 500,
          headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }
        }
      );
      
    } finally {
      // Record usage metrics
      const latencyMs = Date.now() - startTime;
      ctx.waitUntil(
        Promise.resolve(recordUsage(
          env,
          tenantId,
          mcpRequest?.method || 'unknown',
          latencyMs,
          cached,
          success
        ))
      );
    }
  }
};

// ============================================================================
// Scheduled Handler for Cache Cleanup
// ============================================================================

export const scheduled: ExportedHandlerScheduledHandler<Env> = async (event, _env, _ctx) => {
  // This runs on a cron schedule to clean up expired cache entries
  // Cloudflare KV handles TTL automatically, but we can log stats here
  console.log(`Scheduled cleanup triggered at ${event.scheduledTime}`);
};
