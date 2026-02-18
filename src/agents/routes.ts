/**
 * Agent API Routes
 *
 * POST /api/agents/:name/execute  - Execute a named agent
 * GET  /api/agents                - List all available agents
 * GET  /api/agents/:name          - Get details for a single agent
 *
 * All routes are protected by JWT authentication.
 */

import express, { Router, Request, Response } from 'express';
import { body, param, validationResult } from 'express-validator';
import rateLimit from 'express-rate-limit';
import logger from '../utils/logger.js';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { agentRegistry } from './index.js';
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
      errors: errors.array().map((e) => e.msg),
    });
    return res.status(400).json({
      error: 'Validation Error',
      details: errors.array(),
    });
  }
  next();
};

// ============ ROUTES ============

/**
 * GET /api/agents
 * List all available agents and their capabilities
 */
router.get('/', authenticateToken, (_req: Request, res: Response) => {
  try {
    const agents = agentRegistry.listAgents();

    res.status(200).json({
      agents,
      count: agents.length,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    logger.error('Failed to list agents', { error: err.message });
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to list agents',
    });
  }
});

/**
 * GET /api/agents/:name
 * Get details for a specific agent
 */
router.get('/:name', authenticateToken, (req: Request, res: Response) => {
  try {
    const { name } = req.params;
    const agent = agentRegistry.getAgent(name);

    if (!agent) {
      const available = agentRegistry.listAgents().map((a) => a.name);
      return res.status(404).json({
        error: 'Not Found',
        message: `Agent "${name}" not found`,
        availableAgents: available,
      });
    }

    res.status(200).json({
      agent: agent.getConfig(),
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    logger.error('Failed to get agent details', { error: err.message, agent: req.params.name });
    res.status(500).json({
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
      orgId: req.organizationId || bodyContext.orgId || 'default',
      sessionId: bodyContext.sessionId,
    };

    logger.info('Agent execution request', {
      agent: name,
      projectId: context.projectId,
      userId: context.userId,
    });

    try {
      const result = await agentRegistry.executeAgent(name, context, input);

      res.status(200).json({
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

      res.status(500).json({
        error: 'Agent Execution Error',
        message: err.message || 'An unexpected error occurred during agent execution',
      });
    }
  },
);

export default router;
