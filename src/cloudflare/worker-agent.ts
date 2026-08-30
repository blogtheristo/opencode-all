/**
 * DWS IQ Claude Agent Worker
 * 
 * A Cloudflare Worker that executes Claude Agent SDK in a secure sandbox environment.
 * This provides isolated, multi-tenant AI agent execution for DWS IQ platform customers.
 * 
 * @module cloudflare/worker-agent
 * @version 1.0.0
 * @license Proprietary - Lifetime Oy
 */

import { Anthropic } from '@anthropic-ai/sdk';

// ============================================================================
// Types and Interfaces
// ============================================================================

export interface Env {
  // Anthropic API Key (stored in Cloudflare secrets)
  ANTHROPIC_API_KEY: string;
  
  // MCP Hub origin URL for backend communication
  MCP_HUB_ORIGIN: string;
  
  // Customer tenant ID for isolation
  TENANT_ID?: string;
  
  // Rate limiting KV namespace
  RATE_LIMIT_KV: KVNamespace;
  
  // Session persistence Durable Object
  AGENT_SESSION: DurableObjectNamespace;
  
  // Usage metering Analytics Engine
  USAGE_METRICS: AnalyticsEngineDataset;
}

export interface AgentRequest {
  // The user prompt or task description
  prompt: string;
  
  // Agent configuration
  config?: AgentConfig;
  
  // Session ID for context persistence
  sessionId?: string;
  
  // Customer-specific context
  context?: Record<string, unknown>;
  
  // MCP tools to enable
  tools?: string[];
}

export interface AgentConfig {
  // Maximum tokens for response
  maxTokens?: number;
  
  // Model to use (default: claude-sonnet-4-20250514)
  model?: string;
  
  // Temperature for creativity
  temperature?: number;
  
  // System prompt override
  systemPrompt?: string;
  
  // Enable streaming response
  stream?: boolean;
  
  // Timeout in milliseconds
  timeout?: number;
}

export interface AgentResponse {
  // The agent's response text
  response: string;
  
  // Session ID for follow-up requests
  sessionId: string;
  
  // Usage metrics
  usage: {
    inputTokens: number;
    outputTokens: number;
    totalTokens: number;
  };
  
  // Tool calls made by the agent
  toolCalls?: ToolCall[];
  
  // Execution metadata
  metadata: {
    model: string;
    executionTimeMs: number;
    tenantId: string;
  };
}

export interface ToolCall {
  name: string;
  input: Record<string, unknown>;
  output?: unknown;
}

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
}

// ============================================================================
// Rate Limiting
// ============================================================================

async function checkRateLimit(
  env: Env,
  tenantId: string,
  limit: number = 100
): Promise<RateLimitResult> {
  const key = `ratelimit:${tenantId}`;
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute window
  
  const stored = await env.RATE_LIMIT_KV.get(key, 'json') as {
    count: number;
    windowStart: number;
  } | null;
  
  if (!stored || now - stored.windowStart >= windowMs) {
    // New window
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
// Usage Metering
// ============================================================================

function recordUsage(
  env: Env,
  tenantId: string,
  usage: AgentResponse['usage'],
  executionTimeMs: number
): void {
  env.USAGE_METRICS.writeDataPoint({
    blobs: [tenantId],
    doubles: [
      usage.inputTokens,
      usage.outputTokens,
      usage.totalTokens,
      executionTimeMs
    ],
    indexes: [tenantId]
  });
}

// ============================================================================
// DWS IQ System Prompt
// ============================================================================

const DWS_IQ_SYSTEM_PROMPT = `You are a DWS IQ climate intelligence agent, specialized in helping European construction and manufacturing companies achieve Fit for 55 compliance.

Your expertise includes:
- EU Emissions Trading System (ETS) - allowance tracking and trading
- Carbon Border Adjustment Mechanism (CBAM) - import calculations
- Corporate Sustainability Reporting Directive (CSRD) - ESRS E1 disclosures
- Energy Performance of Buildings Directive (EPBD) - embodied carbon (EN 15978)
- Effort Sharing Regulation (ESR) - non-ETS emissions tracking

Key responsibilities:
1. Calculate and track carbon emissions across supply chains
2. Generate compliance reports for regulatory submissions
3. Optimize material selections for lower carbon footprint
4. Identify carbon credit opportunities
5. Provide audit-ready documentation

Always cite specific EU regulations when giving advice. Use EN 15978 lifecycle stages (A1-A3, A4, A5, B1-B7, C1-C4, D) when discussing embodied carbon.

Current date: ${new Date().toISOString().split('T')[0]}
Regulatory context: Post-Omnibus simplification (January 2026)`;

// ============================================================================
// Claude Agent Execution
// ============================================================================

async function executeAgent(
  request: AgentRequest,
  env: Env,
  tenantId: string
): Promise<AgentResponse> {
  const startTime = Date.now();
  
  const client = new Anthropic({
    apiKey: env.ANTHROPIC_API_KEY
  });
  
  const config = request.config || {};
  const model = config.model || 'claude-sonnet-4-20250514';
  const maxTokens = config.maxTokens || 4096;
  const temperature = config.temperature ?? 0.7;
  
  // Build system prompt with customer context
  let systemPrompt = config.systemPrompt || DWS_IQ_SYSTEM_PROMPT;
  if (request.context) {
    systemPrompt += `\n\nCustomer context:\n${JSON.stringify(request.context, null, 2)}`;
  }
  
  // Define available tools based on request
  const tools = buildToolDefinitions(request.tools || []);
  
  // Execute the Claude API call
  const response = await client.messages.create({
    model,
    max_tokens: maxTokens,
    temperature,
    system: systemPrompt,
    messages: [
      {
        role: 'user',
        content: request.prompt
      }
    ],
    tools: tools.length > 0 ? tools : undefined
  });
  
  // Process tool calls if any
  const toolCalls: ToolCall[] = [];
  let responseText = '';
  
  for (const block of response.content) {
    if (block.type === 'text') {
      responseText += block.text;
    } else if (block.type === 'tool_use') {
      toolCalls.push({
        name: block.name,
        input: block.input as Record<string, unknown>
      });
    }
  }
  
  const executionTimeMs = Date.now() - startTime;
  const sessionId = request.sessionId || crypto.randomUUID();
  
  const agentResponse: AgentResponse = {
    response: responseText,
    sessionId,
    usage: {
      inputTokens: response.usage.input_tokens,
      outputTokens: response.usage.output_tokens,
      totalTokens: response.usage.input_tokens + response.usage.output_tokens
    },
    toolCalls: toolCalls.length > 0 ? toolCalls : undefined,
    metadata: {
      model,
      executionTimeMs,
      tenantId
    }
  };
  
  // Record usage for billing
  recordUsage(env, tenantId, agentResponse.usage, executionTimeMs);
  
  return agentResponse;
}

// ============================================================================
// Tool Definitions
// ============================================================================

interface ToolDefinition {
  name: string;
  description: string;
  input_schema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

function buildToolDefinitions(enabledTools: string[]): ToolDefinition[] {
  const allTools: Record<string, ToolDefinition> = {
    carbon_calculate: {
      name: 'carbon_calculate',
      description: 'Calculate embodied carbon for construction materials using EN 15978 methodology. Returns CO2e values for lifecycle stages A1-A3, A4, A5, B1-B7, C1-C4, and D.',
      input_schema: {
        type: 'object',
        properties: {
          material_name: {
            type: 'string',
            description: 'Name of the construction material (e.g., "concrete C30/37", "steel S355")'
          },
          quantity: {
            type: 'number',
            description: 'Quantity in kg or m³ depending on material'
          },
          unit: {
            type: 'string',
            enum: ['kg', 'm3', 'm2', 'units'],
            description: 'Unit of measurement'
          },
          lifecycle_stages: {
            type: 'array',
            items: { type: 'string' },
            description: 'Lifecycle stages to calculate (e.g., ["A1-A3", "A4", "C1-C4"])'
          }
        },
        required: ['material_name', 'quantity', 'unit']
      }
    },
    compliance_check: {
      name: 'compliance_check',
      description: 'Check compliance status against EU regulations (CSRD, EPBD, ETS, CBAM). Returns compliance gaps and recommendations.',
      input_schema: {
        type: 'object',
        properties: {
          regulation: {
            type: 'string',
            enum: ['CSRD', 'EPBD', 'ETS', 'CBAM', 'ESR', 'LULUCF'],
            description: 'The EU regulation to check against'
          },
          company_size: {
            type: 'string',
            enum: ['large', 'medium', 'small', 'micro'],
            description: 'Company size category'
          },
          sector: {
            type: 'string',
            description: 'Industry sector (e.g., "construction", "manufacturing", "logistics")'
          },
          data: {
            type: 'object',
            description: 'Company data to check (emissions, revenue, employees, etc.)'
          }
        },
        required: ['regulation', 'sector']
      }
    },
    generate_report: {
      name: 'generate_report',
      description: 'Generate a compliance report in the specified format. Supports CSRD sustainability reports, EPBD energy certificates, and ETS emissions reports.',
      input_schema: {
        type: 'object',
        properties: {
          report_type: {
            type: 'string',
            enum: ['csrd_sustainability', 'epbd_certificate', 'ets_emissions', 'cbam_declaration'],
            description: 'Type of report to generate'
          },
          period: {
            type: 'string',
            description: 'Reporting period (e.g., "2025", "Q4-2025")'
          },
          format: {
            type: 'string',
            enum: ['json', 'pdf', 'xlsx'],
            description: 'Output format'
          }
        },
        required: ['report_type', 'period']
      }
    },
    supplier_assess: {
      name: 'supplier_assess',
      description: 'Assess supplier carbon performance and compliance risk. Returns decarbonization score and recommendations.',
      input_schema: {
        type: 'object',
        properties: {
          supplier_name: {
            type: 'string',
            description: 'Name of the supplier'
          },
          products: {
            type: 'array',
            items: { type: 'string' },
            description: 'List of products supplied'
          },
          country: {
            type: 'string',
            description: 'Supplier country (ISO 3166-1 alpha-2)'
          }
        },
        required: ['supplier_name', 'country']
      }
    }
  };
  
  if (enabledTools.length === 0) {
    // Return all tools by default
    return Object.values(allTools);
  }
  
  return enabledTools
    .filter(name => name in allTools)
    .map(name => allTools[name]);
}

// ============================================================================
// Request Validation
// ============================================================================

function validateRequest(body: unknown): AgentRequest {
  if (!body || typeof body !== 'object') {
    throw new Error('Request body must be a JSON object');
  }
  
  const request = body as Record<string, unknown>;
  
  if (!request.prompt || typeof request.prompt !== 'string') {
    throw new Error('Request must include a "prompt" string');
  }
  
  if (request.prompt.length > 100000) {
    throw new Error('Prompt exceeds maximum length of 100,000 characters');
  }
  
  return {
    prompt: request.prompt,
    config: request.config as AgentConfig | undefined,
    sessionId: request.sessionId as string | undefined,
    context: request.context as Record<string, unknown> | undefined,
    tools: request.tools as string[] | undefined
  };
}

// ============================================================================
// CORS Headers
// ============================================================================

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Tenant-ID',
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
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: CORS_HEADERS });
    }
    
    // Only accept POST requests
    if (request.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        {
          status: 405,
          headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }
        }
      );
    }
    
    try {
      // Extract tenant ID from header or use default
      const tenantId = request.headers.get('X-Tenant-ID') || env.TENANT_ID || 'default';
      
      // Check rate limit
      const rateLimit = await checkRateLimit(env, tenantId);
      if (!rateLimit.allowed) {
        return new Response(
          JSON.stringify({
            error: 'Rate limit exceeded',
            resetAt: new Date(rateLimit.resetAt).toISOString()
          }),
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
      
      // Parse and validate request
      const body = await request.json();
      const agentRequest = validateRequest(body);
      
      // Execute the agent
      const response = await executeAgent(agentRequest, env, tenantId);
      
      return new Response(
        JSON.stringify(response),
        {
          status: 200,
          headers: {
            ...CORS_HEADERS,
            'Content-Type': 'application/json',
            'X-RateLimit-Remaining': rateLimit.remaining.toString(),
            'X-Session-ID': response.sessionId
          }
        }
      );
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const statusCode = errorMessage.includes('must') ? 400 : 500;
      
      return new Response(
        JSON.stringify({ error: errorMessage }),
        {
          status: statusCode,
          headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' }
        }
      );
    }
  }
};

// ============================================================================
// Durable Object for Session Persistence
// ============================================================================

export class AgentSession {
  private state: DurableObjectState;
  private sessions: Map<string, unknown[]>;
  
  constructor(state: DurableObjectState) {
    this.state = state;
    this.sessions = new Map();
  }
  
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const sessionId = url.searchParams.get('sessionId');
    
    if (!sessionId) {
      return new Response('Session ID required', { status: 400 });
    }
    
    if (request.method === 'GET') {
      const history = await this.state.storage.get<unknown[]>(`session:${sessionId}`) || [];
      return new Response(JSON.stringify(history), {
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    if (request.method === 'POST') {
      const message = await request.json();
      const history = await this.state.storage.get<unknown[]>(`session:${sessionId}`) || [];
      history.push(message);
      await this.state.storage.put(`session:${sessionId}`, history);
      return new Response('OK');
    }
    
    if (request.method === 'DELETE') {
      await this.state.storage.delete(`session:${sessionId}`);
      return new Response('Deleted');
    }
    
    return new Response('Method not allowed', { status: 405 });
  }
}
