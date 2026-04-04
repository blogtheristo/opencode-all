/**
 * DWS IQ 6 — OpenAPI 3.1 Specification
 *
 * Code-Version: 1.0.0
 * Introduced-In: PR-TBD (build-v1-feature)
 * Date: 2026-04-02
 * Owner: Claude Code
 *
 * Serves the OpenAPI spec at GET /api/docs/openapi.json
 * and a Swagger UI page at GET /api/docs.
 */

import { Router, Request, Response } from 'express';
import { API_VERSION } from './middleware/api-version.middleware.js';

const spec = {
  openapi: '3.1.0',
  info: {
    title: 'DWS IQ 6 API',
    version: API_VERSION,
    description: 'Enterprise industrial AI agent platform — EU compliance scoring, multi-agent orchestration, carbon accounting, and sales automation.',
    contact: {
      name: 'Lifetime Oy',
      email: 'risto.paarni@lifetime.fi',
      url: 'https://dws10.com',
    },
    license: {
      name: 'Proprietary',
    },
  },
  servers: [
    { url: 'https://dws6.com', description: 'Production (EU)' },
    { url: 'http://localhost:8080', description: 'Local development' },
  ],
  tags: [
    { name: 'Auth', description: 'Authentication and user management' },
    { name: 'Agents', description: 'AI agent execution and discovery' },
    { name: 'Compliance', description: 'EU regulatory compliance scoring' },
    { name: 'Climate Assistant', description: 'AI-powered climate Q&A' },
    { name: 'Firehorse', description: 'Sales automation and reporting' },
    { name: 'Reports', description: 'Report export and scheduling' },
    { name: 'Usage', description: 'Usage metering and tiers' },
    { name: 'Onboarding', description: 'Customer onboarding wizard' },
    { name: 'Payments', description: 'Subscription and billing' },
    { name: 'Email', description: 'Transactional email service' },
    { name: 'BIM', description: 'BIM import and carbon calculation' },
    { name: 'Memory', description: 'Agent memory and context' },
    { name: 'Situation Room', description: 'Operations dashboard' },
    { name: 'Captain', description: 'Captain\'s Table application' },
    { name: 'Health', description: 'System health and liveness' },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Supabase JWT token from /api/v1/auth/login',
      },
      adminKey: {
        type: 'apiKey',
        in: 'header',
        name: 'X-Admin-Key',
        description: 'Admin API key for privileged operations',
      },
    },
    schemas: {
      Error: {
        type: 'object',
        properties: {
          error: { type: 'string' },
          message: { type: 'string' },
          correlationId: { type: 'string', format: 'uuid' },
        },
        required: ['error'],
      },
      HealthCheck: {
        type: 'object',
        properties: {
          status: { type: 'string', enum: ['ok', 'degraded', 'error'] },
          version: { type: 'string' },
          uptime: { type: 'number' },
          dependencies: {
            type: 'object',
            properties: {
              supabase: { type: 'string' },
              email: { type: 'string' },
              llm: { type: 'string' },
            },
          },
        },
      },
      RegisterRequest: {
        type: 'object',
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string', minLength: 12, maxLength: 128 },
          firstName: { type: 'string' },
          lastName: { type: 'string' },
          role: { type: 'string' },
          accessLevel: { type: 'string' },
        },
        required: ['email', 'password', 'firstName', 'lastName'],
      },
      LoginRequest: {
        type: 'object',
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string' },
          rememberMe: { type: 'boolean' },
        },
        required: ['email', 'password'],
      },
      LoginResponse: {
        type: 'object',
        properties: {
          token: { type: 'string' },
          refreshToken: { type: 'string' },
          user: {
            type: 'object',
            properties: {
              id: { type: 'string', format: 'uuid' },
              email: { type: 'string' },
              firstName: { type: 'string' },
              lastName: { type: 'string' },
              role: { type: 'string' },
            },
          },
        },
      },
      ComplianceAssessRequest: {
        type: 'object',
        properties: {
          companyName: { type: 'string' },
          industry: { type: 'string' },
          country: { type: 'string' },
          dataPoints: { type: 'array', items: { type: 'object' } },
          annualEmissions: { type: 'number' },
          importValue: { type: 'number' },
          hasTransitionPlan: { type: 'boolean' },
          hasEmissionsMonitoring: { type: 'boolean' },
          hasSupplyChainDD: { type: 'boolean' },
        },
        required: ['companyName', 'industry', 'country'],
      },
      ComplianceScore: {
        type: 'object',
        properties: {
          overallScore: { type: 'number', minimum: 0, maximum: 100 },
          etsScore: { type: 'number' },
          cbamScore: { type: 'number' },
          csrdScore: { type: 'number' },
          fit55Score: { type: 'number' },
          gaps: { type: 'array', items: { type: 'string' } },
          recommendations: { type: 'array', items: { type: 'string' } },
        },
      },
      AgentList: {
        type: 'object',
        properties: {
          agents: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                name: { type: 'string' },
                description: { type: 'string' },
                capabilities: { type: 'array', items: { type: 'string' } },
                version: { type: 'string' },
              },
            },
          },
        },
      },
      AgentExecuteRequest: {
        type: 'object',
        properties: {
          context: {
            type: 'object',
            properties: {
              projectId: { type: 'string' },
              sessionId: { type: 'string' },
            },
          },
          input: { type: 'object' },
        },
        required: ['context', 'input'],
      },
      ReportExportRequest: {
        type: 'object',
        properties: {
          companyName: { type: 'string' },
          industry: { type: 'string' },
          country: { type: 'string' },
          format: { type: 'string', enum: ['json', 'csv'] },
          includeGaps: { type: 'boolean' },
          includeRecommendations: { type: 'boolean' },
        },
        required: ['companyName', 'industry', 'country', 'format'],
      },
      OnboardRequest: {
        type: 'object',
        properties: {
          companyName: { type: 'string' },
          industry: { type: 'string' },
          country: { type: 'string' },
          employeeCount: { type: 'number' },
          annualRevenue: { type: 'number' },
          regulations: { type: 'array', items: { type: 'string' } },
          dataSources: { type: 'array', items: { type: 'string' } },
          erpConnection: { type: 'string' },
        },
        required: ['companyName', 'industry', 'country', 'employeeCount', 'regulations', 'dataSources'],
      },
    },
  },
  paths: {
    '/health': {
      get: {
        tags: ['Health'],
        summary: 'Full health check with dependency status',
        operationId: 'healthCheck',
        responses: {
          '200': {
            description: 'System healthy',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/HealthCheck' } } },
          },
        },
      },
    },
    '/livez': {
      get: {
        tags: ['Health'],
        summary: 'Lightweight liveness probe',
        operationId: 'livenessCheck',
        responses: {
          '200': { description: 'Service alive' },
        },
      },
    },
    '/api/v1/auth/register': {
      post: {
        tags: ['Auth'],
        summary: 'Register a new user',
        operationId: 'register',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/RegisterRequest' } } },
        },
        responses: {
          '201': { description: 'User created' },
          '400': { description: 'Validation error', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
          '429': { description: 'Rate limited' },
        },
      },
    },
    '/api/v1/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Authenticate user and receive JWT',
        operationId: 'login',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/LoginRequest' } } },
        },
        responses: {
          '200': {
            description: 'Authentication successful',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/LoginResponse' } } },
          },
          '401': { description: 'Invalid credentials' },
          '429': { description: 'Rate limited' },
        },
      },
    },
    '/api/v1/auth/logout': {
      post: {
        tags: ['Auth'],
        summary: 'Invalidate current session',
        operationId: 'logout',
        security: [{ bearerAuth: [] }],
        responses: { '200': { description: 'Logged out' } },
      },
    },
    '/api/v1/auth/refresh': {
      post: {
        tags: ['Auth'],
        summary: 'Refresh JWT token',
        operationId: 'refreshToken',
        responses: {
          '200': { description: 'New token issued' },
          '401': { description: 'Invalid refresh token' },
        },
      },
    },
    '/api/v1/auth/forgot-password': {
      post: {
        tags: ['Auth'],
        summary: 'Request password reset email',
        operationId: 'forgotPassword',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { type: 'object', properties: { email: { type: 'string', format: 'email' } }, required: ['email'] } } },
        },
        responses: { '200': { description: 'Reset email sent (if account exists)' } },
      },
    },
    '/api/v1/auth/reset-password': {
      post: {
        tags: ['Auth'],
        summary: 'Reset password with token',
        operationId: 'resetPassword',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { type: 'object', properties: { token: { type: 'string' }, password: { type: 'string', minLength: 12 } }, required: ['token', 'password'] } } },
        },
        responses: { '200': { description: 'Password reset' }, '400': { description: 'Invalid or expired token' } },
      },
    },
    '/api/v1/auth/verify-email': {
      post: {
        tags: ['Auth'],
        summary: 'Verify email address with token',
        operationId: 'verifyEmail',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { type: 'object', properties: { token: { type: 'string' } }, required: ['token'] } } },
        },
        responses: { '200': { description: 'Email verified' } },
      },
    },
    '/api/v1/user/profile': {
      get: {
        tags: ['Auth'],
        summary: 'Get current user profile',
        operationId: 'getProfile',
        security: [{ bearerAuth: [] }],
        responses: { '200': { description: 'User profile' }, '401': { description: 'Unauthorized' } },
      },
      put: {
        tags: ['Auth'],
        summary: 'Update user profile',
        operationId: 'updateProfile',
        security: [{ bearerAuth: [] }],
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object' } } } },
        responses: { '200': { description: 'Profile updated' } },
      },
    },
    '/api/v1/user/api-keys': {
      post: {
        tags: ['Auth'],
        summary: 'Create API key',
        operationId: 'createApiKey',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { type: 'object', properties: { name: { type: 'string', minLength: 1, maxLength: 100 }, scopes: { type: 'array', items: { type: 'string' } }, expiresInDays: { type: 'number' } }, required: ['name', 'scopes'] } } },
        },
        responses: { '201': { description: 'API key created' } },
      },
      get: {
        tags: ['Auth'],
        summary: 'List API keys',
        operationId: 'listApiKeys',
        security: [{ bearerAuth: [] }],
        responses: { '200': { description: 'API keys list' } },
      },
    },
    '/api/v1/user/api-keys/{id}': {
      delete: {
        tags: ['Auth'],
        summary: 'Revoke API key',
        operationId: 'deleteApiKey',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { '200': { description: 'Key revoked' } },
      },
    },
    '/api/agents': {
      get: {
        tags: ['Agents'],
        summary: 'List all available agents',
        operationId: 'listAgents',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'Agent list',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/AgentList' } } },
          },
        },
      },
    },
    '/api/agents/{name}': {
      get: {
        tags: ['Agents'],
        summary: 'Get agent details by name',
        operationId: 'getAgent',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'name', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { '200': { description: 'Agent details' }, '404': { description: 'Agent not found' } },
      },
    },
    '/api/agents/{name}/execute': {
      post: {
        tags: ['Agents'],
        summary: 'Execute an agent with structured input',
        operationId: 'executeAgent',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'name', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/AgentExecuteRequest' } } },
        },
        responses: { '200': { description: 'Agent execution result' } },
      },
    },
    '/api/agents/{name}/run': {
      post: {
        tags: ['Agents'],
        summary: 'Run agent (dashboard alias)',
        operationId: 'runAgent',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'name', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          content: { 'application/json': { schema: { type: 'object', properties: { input: { type: 'object' }, context: { type: 'object' } } } } },
        },
        responses: { '200': { description: 'Agent run result' } },
      },
    },
    '/api/agents/{name}/chat': {
      post: {
        tags: ['Agents'],
        summary: 'Chat with an agent',
        operationId: 'chatWithAgent',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'name', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { type: 'object', properties: { message: { type: 'string' }, conversationHistory: { type: 'array' }, sessionId: { type: 'string' } }, required: ['message'] } } },
        },
        responses: { '200': { description: 'Chat response' } },
      },
    },
    '/api/agents/discover/{capability}': {
      get: {
        tags: ['Agents'],
        summary: 'Discover agents by capability',
        operationId: 'discoverAgents',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'capability', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { '200': { description: 'Matching agents' } },
      },
    },
    '/api/agents/workflows': {
      get: {
        tags: ['Agents'],
        summary: 'List available multi-agent workflows',
        operationId: 'listWorkflows',
        security: [{ bearerAuth: [] }],
        responses: { '200': { description: 'Workflow list' } },
      },
    },
    '/api/agents/workflow/{name}': {
      post: {
        tags: ['Agents'],
        summary: 'Execute a multi-agent workflow',
        operationId: 'executeWorkflow',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'name', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          content: { 'application/json': { schema: { type: 'object', properties: { context: { type: 'object' }, input: { type: 'object' } } } } },
        },
        responses: { '200': { description: 'Workflow result' } },
      },
    },
    '/api/v1/compliance/assess': {
      post: {
        tags: ['Compliance'],
        summary: 'Run compliance assessment (ETS, CBAM, CSRD, Fit-for-55)',
        operationId: 'complianceAssess',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/ComplianceAssessRequest' } } },
        },
        responses: {
          '200': {
            description: 'Compliance scores',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ComplianceScore' } } },
          },
        },
      },
    },
    '/api/v1/compliance/registry': {
      get: {
        tags: ['Compliance'],
        summary: 'List compliance requirements registry',
        operationId: 'complianceRegistry',
        parameters: [
          { name: 'standard', in: 'query', schema: { type: 'string' } },
          { name: 'category', in: 'query', schema: { type: 'string' } },
          { name: 'mandatory', in: 'query', schema: { type: 'boolean' } },
        ],
        responses: { '200': { description: 'Registry entries' } },
      },
    },
    '/api/v1/compliance/overview': {
      get: {
        tags: ['Compliance'],
        summary: 'Get compliance overview for user\'s industry',
        operationId: 'complianceOverview',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'industry', in: 'query', schema: { type: 'string' } }],
        responses: { '200': { description: 'Compliance overview' } },
      },
    },
    '/api/v1/compliance/benchmarks/{sector}': {
      get: {
        tags: ['Compliance'],
        summary: 'Get EU ETS benchmarks for a sector',
        operationId: 'complianceBenchmarks',
        parameters: [{ name: 'sector', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { '200': { description: 'Sector benchmarks' } },
      },
    },
    '/api/v1/compliance/cost-estimate': {
      post: {
        tags: ['Compliance'],
        summary: 'Estimate compliance costs (ETS allowances, CBAM certificates)',
        operationId: 'complianceCostEstimate',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { type: 'object', properties: { annualEmissions: { type: 'number' }, importQuantity: { type: 'number' }, sector: { type: 'string' }, originCountry: { type: 'string' }, freeAllocation: { type: 'number' } } } } },
        },
        responses: { '200': { description: 'Cost estimate' } },
      },
    },
    '/api/v1/compliance/ledger': {
      post: {
        tags: ['Compliance'],
        summary: 'Submit compliance ledger entry (carbon balance sheet)',
        operationId: 'complianceLedger',
        security: [{ bearerAuth: [] }],
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object' } } } },
        responses: { '200': { description: 'Ledger entry created' } },
      },
    },
    '/api/climate-assistant': {
      post: {
        tags: ['Climate Assistant'],
        summary: 'Ask the climate assistant (public)',
        operationId: 'climateAssistantChat',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { type: 'object', properties: { message: { type: 'string', maxLength: 4000 }, conversationHistory: { type: 'array', maxItems: 20 } }, required: ['message'] } } },
        },
        responses: { '200': { description: 'AI response' } },
      },
    },
    '/api/v1/reports/export': {
      post: {
        tags: ['Reports'],
        summary: 'Export compliance report',
        operationId: 'exportReport',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/ReportExportRequest' } } },
        },
        responses: { '200': { description: 'Report data' } },
      },
    },
    '/api/v1/reports/schedule': {
      post: {
        tags: ['Reports'],
        summary: 'Schedule recurring report',
        operationId: 'scheduleReport',
        security: [{ bearerAuth: [] }],
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object' } } } },
        responses: { '201': { description: 'Schedule created' } },
      },
    },
    '/api/v1/reports/schedules': {
      get: {
        tags: ['Reports'],
        summary: 'List report schedules',
        operationId: 'listReportSchedules',
        security: [{ bearerAuth: [] }],
        responses: { '200': { description: 'Schedule list' } },
      },
    },
    '/api/v1/usage': {
      get: {
        tags: ['Usage'],
        summary: 'Get current usage metrics',
        operationId: 'getUsage',
        security: [{ bearerAuth: [] }],
        responses: { '200': { description: 'Usage data' } },
      },
    },
    '/api/v1/usage/tiers': {
      get: {
        tags: ['Usage'],
        summary: 'Get available pricing tiers',
        operationId: 'getUsageTiers',
        responses: { '200': { description: 'Tier definitions' } },
      },
    },
    '/api/v1/onboard': {
      post: {
        tags: ['Onboarding'],
        summary: 'Submit onboarding form',
        operationId: 'onboard',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/OnboardRequest' } } },
        },
        responses: { '200': { description: 'Onboarding result with baseline assessment' } },
      },
    },
    '/api/v1/onboard/status': {
      get: {
        tags: ['Onboarding'],
        summary: 'Get onboarding status',
        operationId: 'onboardStatus',
        security: [{ bearerAuth: [] }],
        responses: { '200': { description: 'Onboarding progress' } },
      },
    },
    '/api/v1/payments/subscribe': {
      post: {
        tags: ['Payments'],
        summary: 'Create subscription checkout',
        operationId: 'subscribe',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { type: 'object', properties: { plan: { type: 'string', enum: ['pro', 'enterprise'] }, payment_provider: { type: 'string', enum: ['revolut', 'paypal'] } }, required: ['plan', 'payment_provider'] } } },
        },
        responses: { '200': { description: 'Checkout URL' } },
      },
    },
    '/api/v1/email/send': {
      post: {
        tags: ['Email'],
        summary: 'Send transactional email',
        operationId: 'sendEmail',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { type: 'object', properties: { to: { type: 'string', format: 'email' }, subject: { type: 'string' }, templateType: { type: 'string' }, body: { type: 'string' }, html: { type: 'string' } }, required: ['to', 'subject'] } } },
        },
        responses: { '200': { description: 'Email sent' } },
      },
    },
    '/api/v1/captain/apply': {
      post: {
        tags: ['Captain'],
        summary: 'Apply for Captain\'s Table seat',
        operationId: 'captainApply',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { type: 'object', properties: { name: { type: 'string' }, email: { type: 'string', format: 'email' }, company: { type: 'string' }, seat_type: { type: 'string' }, industry: { type: 'string' }, message: { type: 'string' } }, required: ['name', 'email', 'seat_type', 'industry'] } } },
        },
        responses: { '200': { description: 'Application received' } },
      },
    },
    '/api/v1/memory/stats': {
      get: {
        tags: ['Memory'],
        summary: 'Get memory service statistics',
        operationId: 'memoryStats',
        responses: { '200': { description: 'Memory stats' } },
      },
    },
    '/mcp': {
      post: {
        tags: ['Agents'],
        summary: 'MCP JSON-RPC 2.0 endpoint (Streamable HTTP Transport)',
        operationId: 'mcpEndpoint',
        description: 'Model Context Protocol endpoint for agent tool discovery and execution. Supports tools/list and tools/call methods.',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { type: 'object', properties: { jsonrpc: { type: 'string', const: '2.0' }, method: { type: 'string', enum: ['tools/list', 'tools/call', 'initialize'] }, params: { type: 'object' }, id: { oneOf: [{ type: 'string' }, { type: 'number' }] } }, required: ['jsonrpc', 'method'] } } },
        },
        responses: { '200': { description: 'JSON-RPC response' } },
      },
    },
  },
};

const router = Router();

// Serve OpenAPI JSON spec
router.get('/api/docs/openapi.json', (_req: Request, res: Response) => {
  res.json(spec);
});

// Serve minimal Swagger UI page
router.get('/api/docs', (_req: Request, res: Response) => {
  res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>DWS IQ 6 API Documentation</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.21.0/swagger-ui.css"
        crossorigin="anonymous">
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.21.0/swagger-ui-bundle.js"
          crossorigin="anonymous"></script>
  <script>
    SwaggerUIBundle({
      url: '/api/docs/openapi.json',
      dom_id: '#swagger-ui',
      presets: [SwaggerUIBundle.presets.apis, SwaggerUIBundle.SwaggerUIStandalonePreset],
      layout: 'BaseLayout',
      deepLinking: true,
    });
  </script>
</body>
</html>`);
});

export { router as openApiRouter, spec };
