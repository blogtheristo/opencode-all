/**
 * Agent API Routes — DWS IQ 6/7
 *
 * POST /api/agents/:name/execute      - Execute a named agent
 * GET  /api/agents                     - List all available agents
 * GET  /api/agents/:name              - Get details for a single agent
 * GET  /api/agents/discover/:capability - Find agents by capability (DWS7)
 * POST /api/agents/workflow/:name      - Trigger a multi-agent workflow (DWS7)
 * GET  /api/agents/workflows           - List available workflows (DWS7)
 * GET  /api/agents/events              - Get recent event bus events (DWS7)
 *
 * All routes are protected by JWT authentication.
 */

import express, { type Request, type Response, type Router } from 'express';
import { body, param, validationResult } from 'express-validator';
import rateLimit from 'express-rate-limit';
import logger from '../utils/logger.js';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { agentRegistry } from './index.js';
import { eventBus } from './event-bus.js';
import { executeWorkflow, WORKFLOW_REGISTRY } from './workflows.js';
import type { AgentContext } from './types.js';

const router: Router = express.Router();

// ============ RATE LIMITING ============

const agentRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30,             // 30 agent executions per minute per IP
  message: {
    error: 'Rate limit exceeded',
    message: 'Too many agent requests. Please wait before trying again.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// ============ VALIDATION ============

const executeValidation = [
  param('name')
    .isString()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Agent name is required (max 50 chars)'),
  body('context')
    .isObject()
    .withMessage('context must be an object'),
  body('context.projectId')
    .isString()
    .trim()
    .notEmpty()
    .withMessage('context.projectId is required'),
  body('context.sessionId')
    .isString()
    .trim()
    .notEmpty()
    .withMessage('context.sessionId is required'),
  body('input')
    .isObject()
    .withMessage('input must be an object'),
];

const validateRequest = (req: Request, res: Response, next: express.NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.warn('Agent request validation error', {
      errors: errors.array().map((e: { msg: string }) => e.msg),
    });
    return res.status(400).json({
      error: 'Validation Error',
      details: errors.array(),
    });
  }
  return next();
};

// ============ ROUTES ============

/**
 * GET /api/agents
 * List all available agents and their capabilities
 */
router.get('/', authenticateToken, (_req: Request, res: Response) => {
  try {
    const agents = agentRegistry.listAgents();

    return res.status(200).json({
      agents,
      count: agents.length,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    logger.error('Failed to list agents', { error: err.message });
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to list agents',
    });
  }
});

/**
 * GET /api/agents/:name
 * Get details for a specific agent
 */
router.get('/:name', authenticateToken, (req: Request, res: Response, next: express.NextFunction) => {
  try {
    const { name } = req.params;
    if (name === 'workflows' || name === 'events' || name === 'discover') {
      return next();
    }

    const agent = agentRegistry.getAgent(name);

    if (!agent) {
      const available = agentRegistry.listAgents().map((a) => a.name);
      return res.status(404).json({
        error: 'Not Found',
        message: `Agent "${name}" not found`,
        availableAgents: available,
      });
    }

    return res.status(200).json({
      agent: agent.getConfig(),
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    logger.error('Failed to get agent details', { error: err.message, agent: req.params.name });
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to get agent details',
    });
  }
});

/**
 * POST /api/agents/:name/execute
 * Execute an agent with the provided context and input
 *
 * Body:
 * {
 *   "context": { "projectId": "...", "sessionId": "..." },
 *   "input": { ... agent-specific payload ... }
 * }
 *
 * The userId and orgId are injected from the authenticated JWT,
 * not from the request body (prevents spoofing).
 */
router.post(
  '/:name/execute',
  authenticateToken,
  agentRateLimiter,
  executeValidation,
  validateRequest,
  async (req: Request, res: Response) => {
    const { name } = req.params;
    const { context: bodyContext, input } = req.body;

    // Build context with auth-injected user identity
    const context: AgentContext = {
      projectId: bodyContext.projectId,
      userId: req.userId || 'unknown',
      orgId: req.organizationId || `user:${req.userId || 'unknown'}`,
      sessionId: bodyContext.sessionId,
    };

    logger.info('Agent execution request', {
      agent: name,
      projectId: context.projectId,
      userId: context.userId,
    });

    try {
      const result = await agentRegistry.executeAgent(name, context, input);

      return res.status(200).json({
        success: true,
        result,
        timestamp: new Date().toISOString(),
      });
    } catch (err: any) {
      logger.error('Agent execution failed', {
        agent: name,
        error: err.message,
        userId: context.userId,
      });

      // Distinguish "not found" from execution errors
      if (err.message.includes('not found')) {
        return res.status(404).json({
          error: 'Not Found',
          message: err.message,
        });
      }

      return res.status(500).json({
        error: 'Agent Execution Error',
        message: err.message || 'An unexpected error occurred during agent execution',
      });
    }
  },
);

// ============ DASHBOARD COMPATIBILITY: /run alias ============

/**
 * POST /api/agents/:name/run
 * Alias for /execute — the V10 dashboard calls /run instead of /execute.
 * Accepts a simplified body: { input: { ... } }
 * Automatically generates context from auth token.
 */
router.post(
  '/:name/run',
  authenticateToken,
  agentRateLimiter,
  async (req: Request, res: Response) => {
    const { name } = req.params;
    const { input = {} } = req.body;

    // Build context from auth token — dashboard doesn't send full context
    const context: AgentContext = {
      projectId: req.body.context?.projectId || `dashboard-${Date.now()}`,
      userId: req.userId || 'unknown',
      orgId: req.organizationId || `user:${req.userId || 'unknown'}`,
      sessionId: req.body.context?.sessionId || `run-${Date.now()}`,
    };

    logger.info('Agent run request (dashboard)', {
      agent: name,
      userId: context.userId,
    });

    try {
      const startTime = Date.now();
      const result = await agentRegistry.executeAgent(name, context, input);

      return res.status(200).json({
        success: true,
        agentName: result.agentName,
        status: 'success',
        confidence: result.confidence,
        reasoning: result.reasoning,
        recommendations: result.recommendations,
        result: result.result,
        durationMs: Date.now() - startTime,
        timestamp: new Date().toISOString(),
      });
    } catch (err: any) {
      if (err.message.includes('not found')) {
        return res.status(404).json({
          error: 'Not Found',
          message: err.message,
        });
      }

      return res.status(500).json({
        error: 'Agent Execution Error',
        message: err.message || 'An unexpected error occurred during agent execution',
      });
    }
  },
);

// ============ AGENT CHAT ENDPOINT ============

/**
 * POST /api/agents/:name/chat
 * Conversational interface for agents — used by AgentChat component.
 * Accepts: { message: string, conversationHistory?: Array }
 * Returns: { reply: string, confidence: number, agentName: string }
 */
router.post(
  '/:name/chat',
  authenticateToken,
  agentRateLimiter,
  async (req: Request, res: Response) => {
    const { name } = req.params;
    const { message, conversationHistory = [] } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'message field is required and must be a string',
      });
    }

    const context: AgentContext = {
      projectId: `chat-${Date.now()}`,
      userId: req.userId || 'unknown',
      orgId: req.organizationId || `user:${req.userId || 'unknown'}`,
      sessionId: req.body.sessionId || `chat-${Date.now()}`,
    };

    logger.info('Agent chat request', {
      agent: name,
      userId: context.userId,
      messageLength: message.length,
    });

    try {
      const startTime = Date.now();
      const result = await agentRegistry.executeAgent(name, context, {
        message,
        conversationHistory,
        mode: 'chat',
      });

      return res.status(200).json({
        reply: result.reasoning || 'Analysis complete. See result for details.',
        confidence: result.confidence,
        agentName: result.agentName,
        result: result.result,
        recommendations: result.recommendations,
        durationMs: Date.now() - startTime,
        timestamp: new Date().toISOString(),
      });
    } catch (err: any) {
      if (err.message.includes('not found')) {
        return res.status(404).json({
          error: 'Not Found',
          message: err.message,
        });
      }

      return res.status(500).json({
        error: 'Agent Chat Error',
        message: err.message || 'An unexpected error occurred',
      });
    }
  },
);

// ============ DWS7: DISCOVERY, WORKFLOWS, EVENTS ============

/**
 * GET /api/agents/discover/:capability
 * Find agents by capability tag (DWS7: A2A-style discovery)
 */
router.get('/discover/:capability', authenticateToken, (req: Request, res: Response) => {
  try {
    const { capability } = req.params;
    const agents = agentRegistry.discoverAgents(capability);

    return res.status(200).json({
      capability,
      agents,
      count: agents.length,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    logger.error('Agent discovery failed', { error: err.message });
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to discover agents',
    });
  }
});

/**
 * GET /api/agents/workflows
 * List available multi-agent workflows (DWS7)
 */
router.get('/workflows', authenticateToken, (_req: Request, res: Response) => {
  try {
    const workflows = Array.from(WORKFLOW_REGISTRY.entries()).map(([name, wf]) => ({
      name,
      description: wf.description,
      version: wf.version,
      steps: wf.steps.length,
      timeoutMs: wf.timeoutMs,
    }));

    return res.status(200).json({
      workflows,
      count: workflows.length,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    logger.error('Failed to list workflows', { error: err.message });
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to list workflows',
    });
  }
});

/**
 * POST /api/agents/workflow/:name
 * Trigger a multi-agent workflow (DWS7)
 *
 * Body: { "context": { "projectId": "...", "sessionId": "..." }, "input": { ... } }
 */
router.post(
  '/workflow/:name',
  authenticateToken,
  agentRateLimiter,
  async (req: Request, res: Response) => {
    const { name } = req.params;
    const { context: bodyContext, input } = req.body;

    const workflow = WORKFLOW_REGISTRY.get(name);
    if (!workflow) {
      const available = Array.from(WORKFLOW_REGISTRY.keys());
      return res.status(404).json({
        error: 'Not Found',
        message: `Workflow "${name}" not found`,
        availableWorkflows: available,
      });
    }

    const context: AgentContext = {
      projectId: bodyContext?.projectId || 'workflow-session',
      userId: req.userId || 'unknown',
      orgId: req.organizationId || `user:${req.userId || 'unknown'}`,
      sessionId: bodyContext?.sessionId || `wf-${Date.now()}`,
    };

    logger.info('Workflow execution request', {
      workflow: name,
      projectId: context.projectId,
      userId: context.userId,
    });

    try {
      const execution = await executeWorkflow(workflow, input || {}, context);

      // Convert Map to plain object for JSON serialization
      const stepResults: Record<string, unknown> = {};
      for (const [key, value] of execution.stepResults) {
        stepResults[key] = value;
      }

      return res.status(200).json({
        success: execution.status === 'completed',
        execution: {
          ...execution,
          stepResults,
        },
        timestamp: new Date().toISOString(),
      });
    } catch (err: any) {
      logger.error('Workflow execution failed', {
        workflow: name,
        error: err.message,
        userId: context.userId,
      });

      return res.status(500).json({
        error: 'Workflow Execution Error',
        message: err.message || 'An unexpected error occurred during workflow execution',
      });
    }
  },
);

/**
 * GET /api/agents/events
 * Get recent events from the event bus (DWS7)
 * Query params: ?pattern=compliance.*&limit=20
 */
router.get('/events', authenticateToken, (req: Request, res: Response) => {
  try {
    const pattern = req.query.pattern as string | undefined;
    const limit = parseInt(req.query.limit as string) || 50;
    const orgId = req.organizationId || `user:${req.userId || 'unknown'}`;

    const events = eventBus
      .getRecentEvents(pattern, limit * 2)
      .filter((event) => !event.orgId || event.orgId === orgId)
      .slice(0, limit);

    return res.status(200).json({
      events,
      count: events.length,
      pattern: pattern || '*',
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    logger.error('Failed to get events', { error: err.message });
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to get events',
    });
  }
});

export default router;
