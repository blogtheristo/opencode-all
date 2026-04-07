/**
 * Climate Assistant API Routes
 * POST /api/climate-assistant - Process chat messages
 * GET /api/climate-assistant/health - Health check
 */

import express, { type Request, type Response, type Router } from 'express';
import { body, validationResult } from 'express-validator';
import rateLimit from 'express-rate-limit';
import logger from '../utils/logger.js';
import ClimateAssistantService from '../services/climate-assistant.service.js';

const router: Router = express.Router();

// Rate limiting for AI endpoint (more restrictive)
const aiRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20, // 20 requests per minute
  message: {
    error: 'Rate limit exceeded',
    message: 'Too many requests. Please wait a moment before trying again.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Validation rules
const chatValidation = [
  body('message')
    .isString()
    .trim()
    .isLength({ min: 1, max: 4000 })
    .withMessage('Message must be between 1 and 4000 characters'),
  body('conversationHistory')
    .optional()
    .isArray({ max: 20 })
    .withMessage('Conversation history must be an array with max 20 messages'),
];

// Validation middleware
const validateRequest = (req: Request, res: Response, next: any) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.warn('Climate assistant validation error', {
      errors: errors.array().map((e) => e.msg),
    });
    return res.status(400).json({
      error: 'Validation Error',
      details: errors.array(),
    });
  }
  return next();
};

/**
 * POST /api/climate-assistant
 * Process a chat message and return AI response
 */
router.post(
  '/',
  aiRateLimiter,
  chatValidation,
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      const { message, conversationHistory } = req.body;

      logger.info('Climate assistant request', {
        ip: req.ip,
        messagePreview: message.substring(0, 50) + (message.length > 50 ? '...' : ''),
      });

      const response = await ClimateAssistantService.processMessage({
        message,
        conversationHistory,
      });

      res.status(200).json({
        content: response.content,
        message: response.content, // Alias for frontend compatibility
        model: response.model,
        usage: response.usage,
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      logger.error('Climate assistant error', { error: error.message });

      // Determine appropriate status code
      let statusCode = 500;
      if (error.message.includes('authentication')) statusCode = 401;
      if (error.message.includes('Rate limit')) statusCode = 429;

      res.status(statusCode).json({
        error: 'Climate Assistant Error',
        message: error.message || 'An unexpected error occurred',
      });
    }
  },
);

/**
 * GET /api/climate-assistant/health
 * Health check endpoint
 */
router.get('/health', async (_req: Request, res: Response) => {
  try {
    const isHealthy = await ClimateAssistantService.healthCheck();

    res.status(isHealthy ? 200 : 503).json({
      status: isHealthy ? 'healthy' : 'degraded',
      service: 'climate-assistant',
      provider: 'groq',
      timestamp: new Date().toISOString(),
      checks: {
        groqApiKey: !!process.env.GROQ_API_KEY,
      },
    });
  } catch (error: any) {
    res.status(503).json({
      status: 'unhealthy',
      service: 'climate-assistant',
      error: error.message,
    });
  }
});

/**
 * GET /api/climate-assistant/usage
 * Get current daily usage statistics
 */
router.get('/usage', async (_req: Request, res: Response) => {
  try {
    const stats = await ClimateAssistantService.getUsageStats();

    res.status(200).json({
      service: 'climate-assistant',
      ...stats,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    res.status(500).json({
      error: 'Failed to get usage stats',
      message: error.message,
    });
  }
});

export default router;
