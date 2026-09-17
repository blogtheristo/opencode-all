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

import { type Request, type Response, Router } from 'express';
import { API_VERSION } from './middleware/api-version.middleware.js';

const spec = {
  openapi: '3.1.0',
  info: {
    title: 'DWS IQ 6 API',
    version: API_VERSION,
    description:
      'Enterprise industrial AI agent platform — EU compliance scoring, multi-agent orchestration, carbon accounting, and sales automation.',
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
    { name: 'Captain', description: "Captain's Table application" },
    { name: 'Health', description: 'System health and liveness' },
    { name: 'Status', description: 'Public platform status' },
    { name: 'HIL', description: 'Human-in-the-Loop escalation and task completion' },
    { name: 'BIM', description: 'BIM → EN 15978 → Carbon compliance pipeline' },
    { name: 'Situation Room', description: 'Operational reports and pipeline intelligence' },
    { name: 'Outreach', description: 'Inbound lead capture and outreach pipeline' },
    { name: 'KYA', description: 'Know Your Agent — trust scoring and session termination' },
    { name: 'Notifications', description: 'In-app notification management' },
    { name: 'Activity', description: 'Activity feed and audit log export' },
    { name: 'Dashboard', description: 'Dashboard aggregates and delivery metrics' },
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
        required: [
          'companyName',
          'industry',
          'country',
          'employeeCount',
          'regulations',
          'dataSources',
        ],
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
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/HealthCheck' } },
            },
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
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/RegisterRequest' } },
          },
        },
        responses: {
          '201': { description: 'User created' },
          '400': {
            description: 'Validation error',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
          },
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
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/LoginRequest' } },
          },
        },
        responses: {
          '200': {
            description: 'Authentication successful',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/LoginResponse' } },
            },
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
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: { email: { type: 'string', format: 'email' } },
                required: ['email'],
              },
            },
          },
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
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  token: { type: 'string' },
                  password: { type: 'string', minLength: 12 },
                },
                required: ['token', 'password'],
              },
            },
          },
        },
        responses: {
          '200': { description: 'Password reset' },
          '400': { description: 'Invalid or expired token' },
        },
      },
    },
    '/api/v1/auth/verify-email': {
      post: {
        tags: ['Auth'],
        summary: 'Verify email address with token',
        operationId: 'verifyEmail',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: { token: { type: 'string' } },
                required: ['token'],
              },
            },
          },
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
        responses: {
          '200': { description: 'User profile' },
          '401': { description: 'Unauthorized' },
        },
      },
      put: {
        tags: ['Auth'],
        summary: 'Update user profile',
        operationId: 'updateProfile',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { type: 'object' } } },
        },
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
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string', minLength: 1, maxLength: 100 },
                  scopes: { type: 'array', items: { type: 'string' } },
                  expiresInDays: { type: 'number' },
                },
                required: ['name', 'scopes'],
              },
            },
          },
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
        responses: {
          '200': { description: 'Agent details' },
          '404': { description: 'Agent not found' },
        },
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
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/AgentExecuteRequest' } },
          },
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
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: { input: { type: 'object' }, context: { type: 'object' } },
              },
            },
          },
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
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: { type: 'string' },
                  conversationHistory: { type: 'array' },
                  sessionId: { type: 'string' },
                },
                required: ['message'],
              },
            },
          },
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
        parameters: [
          { name: 'capability', in: 'path', required: true, schema: { type: 'string' } },
        ],
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
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: { context: { type: 'object' }, input: { type: 'object' } },
              },
            },
          },
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
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ComplianceAssessRequest' },
            },
          },
        },
        responses: {
          '200': {
            description: 'Compliance scores',
            content: {
              'application/json': { schema: { $ref: '#/components/schemas/ComplianceScore' } },
            },
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
        summary: "Get compliance overview for user's industry",
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
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  annualEmissions: { type: 'number' },
                  importQuantity: { type: 'number' },
                  sector: { type: 'string' },
                  originCountry: { type: 'string' },
                  freeAllocation: { type: 'number' },
                },
              },
            },
          },
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
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { type: 'object' } } },
        },
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
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  message: { type: 'string', maxLength: 4000 },
                  conversationHistory: { type: 'array', maxItems: 20 },
                },
                required: ['message'],
              },
            },
          },
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
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/ReportExportRequest' } },
          },
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
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { type: 'object' } } },
        },
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
          content: {
            'application/json': { schema: { $ref: '#/components/schemas/OnboardRequest' } },
          },
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
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  plan: { type: 'string', enum: ['pro', 'enterprise'] },
                  payment_provider: { type: 'string', enum: ['revolut', 'paypal'] },
                },
                required: ['plan', 'payment_provider'],
              },
            },
          },
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
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  to: { type: 'string', format: 'email' },
                  subject: { type: 'string' },
                  templateType: { type: 'string' },
                  body: { type: 'string' },
                  html: { type: 'string' },
                },
                required: ['to', 'subject'],
              },
            },
          },
        },
        responses: { '200': { description: 'Email sent' } },
      },
    },
    '/api/v1/captain/apply': {
      post: {
        tags: ['Captain'],
        summary: "Apply for Captain's Table seat",
        operationId: 'captainApply',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  email: { type: 'string', format: 'email' },
                  company: { type: 'string' },
                  seat_type: { type: 'string' },
                  industry: { type: 'string' },
                  message: { type: 'string' },
                },
                required: ['name', 'email', 'seat_type', 'industry'],
              },
            },
          },
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
    // ── Memory (additional) ─────────────────────────────────────────────────
    '/api/v1/memory/audit': {
      get: {
        tags: ['Memory'],
        summary: 'Get memory audit log entries',
        operationId: 'memoryAudit',
        parameters: [
          { name: 'limit', in: 'query', schema: { type: 'integer', maximum: 200, default: 50 } },
        ],
        responses: { '200': { description: 'Audit entries' } },
      },
    },
    '/api/v1/memory/decay/dry-run': {
      post: {
        tags: ['Memory'],
        summary: 'Preview memory decay without applying changes (admin)',
        operationId: 'memoryDecayDryRun',
        security: [{ adminKey: [] }],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: { halfLifeDays: { type: 'integer', default: 90 } },
              },
            },
          },
        },
        responses: { '200': { description: 'Decay preview' } },
      },
    },

    // ── Notifications ────────────────────────────────────────────────────────
    '/api/v1/notifications': {
      get: {
        tags: ['Notifications'],
        summary: 'List in-app notifications for the current user',
        operationId: 'listNotifications',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'limit', in: 'query', schema: { type: 'integer', maximum: 100, default: 20 } },
          { name: 'offset', in: 'query', schema: { type: 'integer', default: 0 } },
        ],
        responses: { '200': { description: 'Notification list' } },
      },
    },
    '/api/v1/notifications/unread': {
      get: {
        tags: ['Notifications'],
        summary: 'Get count of unread notifications',
        operationId: 'unreadNotifications',
        security: [{ bearerAuth: [] }],
        responses: { '200': { description: 'Unread count' } },
      },
    },
    '/api/v1/notifications/{id}/read': {
      patch: {
        tags: ['Notifications'],
        summary: 'Mark a notification as read',
        operationId: 'markNotificationRead',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
        ],
        responses: { '200': { description: 'Notification updated' } },
      },
    },
    '/api/v1/notifications/read-all': {
      post: {
        tags: ['Notifications'],
        summary: 'Mark all notifications as read',
        operationId: 'markAllNotificationsRead',
        security: [{ bearerAuth: [] }],
        responses: { '200': { description: 'All marked read' } },
      },
    },

    // ── Activity Feed ────────────────────────────────────────────────────────
    '/api/v1/activity': {
      get: {
        tags: ['Activity'],
        summary: 'Get paginated activity feed',
        operationId: 'getActivity',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'limit', in: 'query', schema: { type: 'integer', maximum: 100, default: 20 } },
          { name: 'offset', in: 'query', schema: { type: 'integer', default: 0 } },
          {
            name: 'type',
            in: 'query',
            schema: {
              type: 'string',
              enum: [
                'agent_execution',
                'compliance_change',
                'report_export',
                'user_action',
                'system',
              ],
            },
          },
        ],
        responses: { '200': { description: 'Activity events' } },
      },
    },
    '/api/v1/activity/stream': {
      get: {
        tags: ['Activity'],
        summary: 'SSE stream for real-time activity events',
        operationId: 'activityStream',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'Server-Sent Events stream',
            content: { 'text/event-stream': { schema: { type: 'string' } } },
          },
        },
      },
    },
    '/api/v1/activity/export': {
      get: {
        tags: ['Activity'],
        summary: 'SIEM audit log export (NDJSON or CSV) — admin only',
        operationId: 'exportAuditLog',
        security: [{ adminKey: [] }],
        parameters: [
          {
            name: 'since',
            in: 'query',
            schema: { type: 'string', format: 'date-time' },
            description: 'Default: 7 days ago',
          },
          {
            name: 'until',
            in: 'query',
            schema: { type: 'string', format: 'date-time' },
            description: 'Default: now',
          },
          { name: 'type', in: 'query', schema: { type: 'string' } },
          {
            name: 'format',
            in: 'query',
            schema: { type: 'string', enum: ['ndjson', 'csv'], default: 'ndjson' },
          },
          {
            name: 'limit',
            in: 'query',
            schema: { type: 'integer', maximum: 10000, default: 1000 },
          },
        ],
        responses: {
          '200': {
            description: 'Audit events in requested format',
            content: {
              'application/x-ndjson': { schema: { type: 'string' } },
              'text/csv': { schema: { type: 'string' } },
            },
          },
        },
      },
    },

    // ── Dashboard ────────────────────────────────────────────────────────────
    '/api/v1/dashboard/summary': {
      get: {
        tags: ['Dashboard'],
        summary: 'Aggregated dashboard metrics (MetricsHeader)',
        operationId: 'dashboardSummary',
        security: [{ bearerAuth: [] }],
        responses: { '200': { description: 'Dashboard summary metrics' } },
      },
    },
    '/api/v1/dashboard/delivery-status': {
      get: {
        tags: ['Dashboard'],
        summary: 'Project delivery status for investor view',
        operationId: 'dashboardDeliveryStatus',
        responses: {
          '200': {
            description: 'MVP / V1 / DWS7 completion percentages',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    timestamp: { type: 'string' },
                    mvp: { type: 'integer' },
                    v1: { type: 'integer' },
                    dws7: { type: 'integer' },
                  },
                },
              },
            },
          },
        },
      },
    },

    // ── Status ───────────────────────────────────────────────────────────────
    '/api/v1/status': {
      get: {
        tags: ['Status'],
        summary: 'Public platform status (no auth required)',
        operationId: 'platformStatus',
        responses: {
          '200': {
            description: 'Platform operational status',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    service: { type: 'string', example: 'DWS IQ 6' },
                    version: { type: 'string' },
                    status: { type: 'string', enum: ['operational', 'degraded', 'outage'] },
                    timestamp: { type: 'string', format: 'date-time' },
                    uptime: { type: 'integer', description: 'Seconds since process start' },
                    environment: { type: 'string' },
                    region: { type: 'string' },
                    components: {
                      type: 'object',
                      properties: {
                        api: { type: 'string' },
                        agents: { type: 'string' },
                        compliance: { type: 'string' },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },

    // ── HIL (Human-in-the-Loop) ──────────────────────────────────────────────
    '/api/hil/done/{token}': {
      get: {
        tags: ['HIL'],
        summary: 'One-click task completion from morning briefing email',
        operationId: 'hilDone',
        description: 'No authentication required — token is an unguessable UUID in the email link.',
        parameters: [
          { name: 'token', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
        ],
        responses: {
          '200': { description: 'HTML confirmation page' },
          '404': { description: 'Token not found' },
        },
      },
    },
    '/api/hil/escalate': {
      post: {
        tags: ['HIL'],
        summary: 'Create a human escalation from an AI agent',
        operationId: 'hilEscalate',
        description:
          'Called by agents when confidence < 80%. Creates an escalation record and notifies a human.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  agentName: { type: 'string' },
                  reason: { type: 'string' },
                  confidence: { type: 'number', minimum: 0, maximum: 1 },
                  context: { type: 'object' },
                  channel: {
                    type: 'string',
                    enum: ['email', 'webhook', 'teams'],
                    default: 'email',
                  },
                  recipient: { type: 'string' },
                },
                required: ['agentName', 'reason'],
              },
            },
          },
        },
        responses: { '201': { description: 'Escalation created' } },
      },
    },

    // ── BIM Pipeline ─────────────────────────────────────────────────────────
    '/api/bim/projects': {
      post: {
        tags: ['BIM'],
        summary: 'Create a BIM project for carbon calculation',
        operationId: 'bimCreateProject',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  org_id: { type: 'string', format: 'uuid' },
                  building_type: { type: 'string' },
                  location: { type: 'string' },
                  floor_area_m2: { type: 'number' },
                  lifecycle_stages: { type: 'array', items: { type: 'string' } },
                },
                required: ['name', 'org_id'],
              },
            },
          },
        },
        responses: { '201': { description: 'Project created' } },
      },
      get: {
        tags: ['BIM'],
        summary: 'List BIM projects for the authenticated user',
        operationId: 'bimListProjects',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'org_id', in: 'query', schema: { type: 'string', format: 'uuid' } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 20 } },
          { name: 'offset', in: 'query', schema: { type: 'integer', default: 0 } },
        ],
        responses: { '200': { description: 'Project list' } },
      },
    },
    '/api/bim/projects/{id}': {
      get: {
        tags: ['BIM'],
        summary: 'Get a BIM project with its latest carbon calculation',
        operationId: 'bimGetProject',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
        ],
        responses: {
          '200': { description: 'Project detail' },
          '404': { description: 'Not found' },
        },
      },
    },
    '/api/bim/carbon/{projectId}': {
      post: {
        tags: ['BIM'],
        summary: 'Run EN 15978 carbon calculation for a BIM project',
        operationId: 'bimCalculateCarbon',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'projectId',
            in: 'path',
            required: true,
            schema: { type: 'string', format: 'uuid' },
          },
        ],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  elements: { type: 'array', items: { type: 'object' } },
                  reference_period_years: { type: 'integer', default: 50 },
                },
              },
            },
          },
        },
        responses: { '200': { description: 'Carbon calculation result (kgCO2e)' } },
      },
    },
    '/api/bim/emission-factors': {
      get: {
        tags: ['BIM'],
        summary: 'List available EN 15978 emission factors',
        operationId: 'bimEmissionFactors',
        parameters: [
          { name: 'material', in: 'query', schema: { type: 'string' } },
          {
            name: 'stage',
            in: 'query',
            schema: { type: 'string', enum: ['A1-A3', 'A4', 'B1-B7', 'C1-C4', 'D'] },
          },
        ],
        responses: { '200': { description: 'Emission factors catalogue' } },
      },
    },

    // ── Situation Room ───────────────────────────────────────────────────────
    '/api/situation-room/reports': {
      post: {
        tags: ['Situation Room'],
        summary: 'Create a situation room report',
        operationId: 'situationRoomCreateReport',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  org_id: { type: 'string', format: 'uuid' },
                  project_id: { type: 'string' },
                  report_type: { type: 'string' },
                  content: { type: 'object' },
                },
                required: ['org_id', 'project_id'],
              },
            },
          },
        },
        responses: { '201': { description: 'Report created' } },
      },
      get: {
        tags: ['Situation Room'],
        summary: 'List situation room reports',
        operationId: 'situationRoomListReports',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'org_id',
            in: 'query',
            required: true,
            schema: { type: 'string', format: 'uuid' },
          },
          { name: 'report_type', in: 'query', schema: { type: 'string' } },
        ],
        responses: { '200': { description: 'Report list' } },
      },
    },
    '/api/situation-room/reports/{id}': {
      get: {
        tags: ['Situation Room'],
        summary: 'Get a single situation room report',
        operationId: 'situationRoomGetReport',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
        ],
        responses: { '200': { description: 'Report detail' }, '404': { description: 'Not found' } },
      },
      patch: {
        tags: ['Situation Room'],
        summary: 'Update a situation room report status',
        operationId: 'situationRoomUpdateReport',
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
        ],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: { status: { type: 'string', enum: ['active', 'archived', 'error'] } },
              },
            },
          },
        },
        responses: { '200': { description: 'Report updated' } },
      },
    },

    // ── Outreach ─────────────────────────────────────────────────────────────
    '/api/v1/outreach/inbound': {
      post: {
        tags: ['Outreach'],
        summary: 'Receive inbound lead from external form or webhook',
        operationId: 'outreachInbound',
        security: [{ adminKey: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  email: { type: 'string', format: 'email' },
                  name: { type: 'string' },
                  company: { type: 'string' },
                  industry: { type: 'string' },
                  message: { type: 'string' },
                  source: { type: 'string' },
                },
                required: ['email'],
              },
            },
          },
        },
        responses: { '201': { description: 'Lead created' } },
      },
    },

    // ── KYA (Know Your Agent) ─────────────────────────────────────────────────
    '/api/v1/kya/snap': {
      post: {
        tags: ['KYA'],
        summary: 'TC-4 Leash Snap — terminate an agent session chain',
        operationId: 'kyaSnap',
        security: [{ adminKey: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  sessionId: { type: 'string' },
                  reason: { type: 'string', default: 'MANUAL_SNAP' },
                  forceCascade: { type: 'boolean' },
                  source: { type: 'string' },
                },
                required: ['sessionId'],
              },
            },
          },
        },
        responses: {
          '200': { description: 'Session chain terminated' },
          '400': { description: 'Missing sessionId' },
          '401': { description: 'Unauthorized' },
        },
      },
    },

    // -------------------------------------------------------------------------
    // INVESTOR REPORTS — cap-table metrics, MRR/ARR, runway, report generation
    // -------------------------------------------------------------------------

    '/api/v1/investor-reports/metrics': {
      get: {
        tags: ['Reports'],
        summary: 'Get all investor metrics for a given month',
        operationId: 'getInvestorMetrics',
        description:
          'Returns MRR, ARR, customer, pipeline, cash, unit economics, and 12-month historical series in one call.',
        parameters: [
          {
            name: 'month',
            in: 'query',
            schema: { type: 'string', format: 'date', example: '2026-04-01' },
            description: 'Target month (YYYY-MM-DD). Defaults to current month.',
          },
        ],
        responses: {
          '200': {
            description: 'Investor metrics bundle',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: {
                      type: 'object',
                      properties: {
                        mrr_metrics: { type: 'object' },
                        arr_metrics: { type: 'object' },
                        customer_metrics: { type: 'object' },
                        pipeline_metrics: { type: 'object' },
                        cash_metrics: { type: 'object' },
                        unit_economics: { type: 'object' },
                        historical_mrr: { type: 'array', items: { type: 'object' } },
                        historical_arr: { type: 'array', items: { type: 'object' } },
                      },
                    },
                    timestamp: { type: 'string', format: 'date-time' },
                  },
                },
              },
            },
          },
          '500': { description: 'Internal server error' },
        },
      },
    },

    '/api/v1/investor-reports/metrics/mrr': {
      get: {
        tags: ['Reports'],
        summary: 'Get MRR metrics only',
        operationId: 'getInvestorMrr',
        parameters: [
          {
            name: 'month',
            in: 'query',
            schema: { type: 'string', format: 'date' },
          },
        ],
        responses: {
          '200': {
            description: 'MRR metrics',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: {
                      type: 'object',
                      properties: {
                        current_mrr: { type: 'number' },
                        mrr_growth: { type: 'number' },
                        new_mrr: { type: 'number' },
                        churned_mrr: { type: 'number' },
                        expansion_mrr: { type: 'number' },
                      },
                    },
                    timestamp: { type: 'string', format: 'date-time' },
                  },
                },
              },
            },
          },
        },
      },
    },

    '/api/v1/investor-reports/summary': {
      get: {
        tags: ['Reports'],
        summary: 'Get monthly metrics summary (last 12 months)',
        operationId: 'getInvestorSummary',
        description: 'Returns a 12-month rolling summary of MRR, ARR, customers, and cash.',
        responses: {
          '200': {
            description: 'Monthly metrics summary',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: { type: 'array', items: { type: 'object' } },
                    timestamp: { type: 'string', format: 'date-time' },
                  },
                },
              },
            },
          },
        },
      },
    },

    '/api/v1/investor-reports/generate': {
      post: {
        tags: ['Reports'],
        summary: 'Generate monthly investor PDF report',
        operationId: 'generateInvestorReport',
        description:
          'Computes metrics for the given month, generates a PDF, and optionally emails it to recipients.',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  month: {
                    type: 'string',
                    format: 'date',
                    example: '2026-04-01',
                    description: 'First day of the report month',
                  },
                  auto_send: { type: 'boolean', default: false },
                  recipients: {
                    type: 'array',
                    items: { type: 'string', format: 'email' },
                  },
                },
                required: ['month'],
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Report generated',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    report_id: { type: 'string' },
                    pdf_path: { type: 'string' },
                    message: { type: 'string' },
                  },
                },
              },
            },
          },
          '400': { description: 'Missing month field' },
          '401': { description: 'Unauthorized' },
        },
      },
    },

    // -------------------------------------------------------------------------
    // CONTENT DMS — Evidence Vault CRUD + status lifecycle
    // -------------------------------------------------------------------------

    '/api/v1/content': {
      get: {
        tags: ['Firehorse'],
        summary: 'List Evidence Vault content items',
        operationId: 'listContent',
        description: 'Returns content items filtered by organization, type, status, or tags.',
        parameters: [
          {
            name: 'organization_id',
            in: 'query',
            required: true,
            schema: { type: 'string', format: 'uuid' },
          },
          {
            name: 'status',
            in: 'query',
            schema: {
              type: 'string',
              enum: ['draft', 'review', 'approved', 'published', 'archived'],
            },
          },
          {
            name: 'content_type',
            in: 'query',
            schema: { type: 'string' },
          },
        ],
        responses: {
          '200': {
            description: 'Content list',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    items: { type: 'array', items: { type: 'object' } },
                    count: { type: 'integer' },
                  },
                },
              },
            },
          },
          '400': { description: 'Missing organization_id' },
        },
      },
      post: {
        tags: ['Firehorse'],
        summary: 'Upload / create a content item (Document Classifier auto-tags)',
        operationId: 'createContent',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  organization_id: { type: 'string', format: 'uuid' },
                  title: { type: 'string' },
                  content_type: { type: 'string' },
                  body: { type: 'string' },
                  tags: { type: 'array', items: { type: 'string' } },
                  expires_at: { type: 'string', format: 'date-time' },
                },
                required: ['organization_id', 'title', 'content_type'],
              },
            },
          },
        },
        responses: {
          '201': { description: 'Content item created' },
          '400': { description: 'Validation error' },
        },
      },
    },

    '/api/v1/content/stats': {
      get: {
        tags: ['Firehorse'],
        summary: 'Evidence Vault dashboard statistics',
        operationId: 'getContentStats',
        description: 'Returns counts by status, expiring certificates, and recent uploads.',
        parameters: [
          {
            name: 'organization_id',
            in: 'query',
            required: true,
            schema: { type: 'string', format: 'uuid' },
          },
        ],
        responses: {
          '200': {
            description: 'Vault statistics',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    total: { type: 'integer' },
                    by_status: { type: 'object' },
                    expiring_soon: { type: 'integer' },
                    recent_uploads: { type: 'integer' },
                  },
                },
              },
            },
          },
          '400': { description: 'Missing organization_id' },
        },
      },
    },

    '/api/v1/content/{id}/transition': {
      post: {
        tags: ['Firehorse'],
        summary: 'Transition content status',
        operationId: 'transitionContentStatus',
        description:
          'Move a content item through its lifecycle: draft → review → approved → published → archived.',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  status: {
                    type: 'string',
                    enum: ['draft', 'review', 'approved', 'published', 'archived'],
                  },
                },
                required: ['status'],
              },
            },
          },
        },
        responses: {
          '200': { description: 'Status updated' },
          '400': { description: 'Invalid status' },
          '404': { description: 'Content not found' },
        },
      },
    },

    // -------------------------------------------------------------------------
    // OUTREACH SEND — Quick-send prospect email via SES SMTP
    // -------------------------------------------------------------------------

    '/api/v1/outreach/send-email': {
      post: {
        tags: ['Outreach'],
        summary: 'Send outreach email to a prospect',
        operationId: 'sendOutreachEmail',
        description:
          'Sends an investor, sales, or partnership email to the prospect linked to the given thread token. ' +
          'Logs an outreach_activity for audit trail. Requires Admin API key.',
        security: [{ adminKey: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  thread_token: {
                    type: 'string',
                    description: 'Unique token identifying the outreach thread',
                  },
                  email_type: {
                    type: 'string',
                    enum: ['investor', 'sales', 'partnership'],
                  },
                },
                required: ['thread_token', 'email_type'],
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Email sent',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    ok: { type: 'boolean' },
                    sent_to: { type: 'string', format: 'email' },
                    email_type: { type: 'string' },
                    thread_token: { type: 'string' },
                    name: { type: 'string' },
                  },
                },
              },
            },
          },
          '400': { description: 'Missing thread_token or invalid email_type' },
          '401': { description: 'Invalid or missing Admin API key' },
          '404': { description: 'Thread token not found' },
          '422': { description: 'Prospect has no email address on file' },
          '503': { description: 'SMTP not configured (set SMTP_HOST, SMTP_USER, SMTP_PASS)' },
        },
      },
    },

    '/mcp': {
      post: {
        tags: ['Agents'],
        summary: 'MCP JSON-RPC 2.0 endpoint (Streamable HTTP Transport)',
        operationId: 'mcpEndpoint',
        description:
          'Model Context Protocol endpoint for agent tool discovery and execution. Supports tools/list and tools/call methods.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  jsonrpc: { type: 'string', const: '2.0' },
                  method: { type: 'string', enum: ['tools/list', 'tools/call', 'initialize'] },
                  params: { type: 'object' },
                  id: { oneOf: [{ type: 'string' }, { type: 'number' }] },
                },
                required: ['jsonrpc', 'method'],
              },
            },
          },
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
