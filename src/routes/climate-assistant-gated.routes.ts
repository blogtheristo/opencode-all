/**
 * Climate Assistant Gated API Routes
 * Tiered access with lead capture
 *
 * POST /api/climate-assistant/chat - Process gated chat message
 * POST /api/climate-assistant/lead - Capture lead data
 * GET /api/climate-assistant/session/:id - Get session info
 */

import express, { Router, Request, Response } from 'express';
import { body, param, validationResult } from 'express-validator';
import rateLimit from 'express-rate-limit';
import logger from '../utils/logger.js';
import GatedService, { UserTier, LeadCaptureData } from '../services/climate-assistant-gated.service.js';
import { optionalAuth } from '../middleware/auth.middleware.js';

const router: Router = express.Router();

// Rate limiting - more restrictive for public tier
const publicRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // 5 requests per minute for public
  message: { error: 'Too many requests. Please wait a moment.' },
});

const authenticatedRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30, // 30 requests per minute for authenticated users
  message: { error: 'Rate limit exceeded. Please slow down.' },
});

// Validation rules
const chatValidation = [
  body('message')
    .isString()
    .trim()
    .isLength({ min: 1, max: 2000 })
    .withMessage('Message must be between 1 and 2000 characters'),
  body('sessionId')
    .isString()
    .trim()
    .isLength({ min: 10, max: 100 })
    .withMessage('Valid sessionId required'),
  body('tier')
    .optional()
    .isIn(['public', 'lead', 'guest', 'premium'])
    .withMessage('Invalid tier'),
  body('userId')
    .optional()
    .isString(),
  body('conversationHistory')
    .optional()
    .isArray({ max: 10 }),
];

const leadValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email required'),
  body('company')
    .optional()
    .isString()
    .trim()
    .isLength({ max: 200 }),
  body('name')
    .optional()
    .isString()
    .trim()
    .isLength({ max: 200 }),
  body('interests')
    .optional()
    .isArray(),
  body('question')
    .isString()
    .trim()
    .isLength({ min: 1, max: 2000 })
    .withMessage('Question is required'),
  body('sessionId')
    .isString()
    .trim()
    .isLength({ min: 10, max: 100 }),
];

// Validation middleware
const validate = (req: Request, res: Response, next: any) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation Error',
      details: errors.array(),
    });
  }
  next();
};

/**
 * POST /api/climate-assistant/chat
 * Process a gated chat message
 */
router.post('/chat', publicRateLimiter, optionalAuth, chatValidation, validate, async (req: Request, res: Response) => {
  try {
    const { message, sessionId, userId, tier = 'public', conversationHistory } = req.body;

    // Determine tier from validated auth token
    let effectiveTier: UserTier = tier;
    
    // If user is authenticated (token was validated by optionalAuth middleware)
    if (req.userId) {
      // Upgrade to at least 'guest' tier for authenticated users
      effectiveTier = tier === 'public' ? 'guest' : tier;
      logger.debug('Authenticated user detected', { 
        userId: req.userId, 
        email: req.userEmail,
        upgradedTier: effectiveTier 
      });
    }

    logger.info('Gated chat request', {
      sessionId,
      tier: effectiveTier,
      authenticated: !!req.userId,
      messageLength: message.length,
    });

    const response = await GatedService.processGatedMessage({
      message,
      sessionId,
      userId,
      tier: effectiveTier,
      conversationHistory,
    });

    res.status(200).json({
      success: true,
      ...response,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    logger.error('Gated chat error', { error: error.message });
    res.status(500).json({
      success: false,
      error: 'Chat Error',
      message: error.message || 'An unexpected error occurred',
    });
  }
});

/**
 * POST /api/climate-assistant/lead
 * Capture lead information after public preview
 */
router.post('/lead', publicRateLimiter, leadValidation, validate, async (req: Request, res: Response) => {
  try {
    const { email, company, name, interests, question, sessionId } = req.body;

    const leadData: LeadCaptureData = {
      email,
      company,
      name,
      interests,
      question,
      sessionId,
      timestamp: new Date().toISOString(),
    };

    GatedService.captureLeadData(leadData);

    // Upgrade session to 'lead' tier
    GatedService.upgradeSessionTier(sessionId, 'lead');

    logger.info('Lead captured and session upgraded', { email, sessionId });

    res.status(200).json({
      success: true,
      message: 'Thank you! You now have access to 3 free questions per day.',
      tier: 'lead',
      messagesRemaining: 3,
    });
  } catch (error: any) {
    logger.error('Lead capture error', { error: error.message });
    res.status(500).json({
      success: false,
      error: 'Lead Capture Error',
      message: error.message,
    });
  }
});

/**
 * GET /api/climate-assistant/session/:sessionId
 * Get session questions (for analytics/debugging)
 */
router.get(
  '/session/:sessionId',
  param('sessionId').isString().isLength({ min: 10, max: 100 }),
  validate,
  (req: Request, res: Response) => {
    try {
      const { sessionId } = req.params;
      const questions = GatedService.getSessionQuestions(sessionId);

      res.status(200).json({
        sessionId,
        questionCount: questions.length,
        questions,
      });
    } catch (error: any) {
      res.status(500).json({
        error: 'Session Error',
        message: error.message,
      });
    }
  }
);

/**
 * GET /api/climate-assistant/leads
 * Get all leads (admin only - add proper auth in production)
 */
router.get('/leads', (req: Request, res: Response) => {
  // TODO: Add admin authentication
  const adminKey = req.headers['x-admin-key'];
  if (adminKey !== process.env.ADMIN_API_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const leads = GatedService.getLeads();
    res.status(200).json({
      count: leads.length,
      leads,
    });
  } catch (error: any) {
    res.status(500).json({
      error: 'Failed to get leads',
      message: error.message,
    });
  }
});

/**
 * GET /api/climate-assistant/topics
 * Return list of allowed topics (for frontend guidance)
 */
router.get('/topics', (req: Request, res: Response) => {
  res.status(200).json({
    categories: [
      {
        name: 'EU Regulations',
        topics: ['CSRD', 'ETS', 'CBAM', 'EPBD', 'Fit for 55', 'EU Taxonomy', 'SFDR', 'European Green Deal'],
      },
      {
        name: 'Standards',
        topics: ['EN 15978', 'GHG Protocol', 'ISO 14064', 'ISO 14067', 'EPD', 'LCA'],
      },
      {
        name: 'Carbon & Emissions',
        topics: ['Carbon credits', 'Carbon footprint', 'Scope 1/2/3 emissions', 'Net zero', 'Decarbonization'],
      },
      {
        name: 'Compliance',
        topics: ['Sustainability reporting', 'Climate disclosure', 'Verification', 'Deadlines'],
      },
    ],
    example_questions: [
      'What are the CSRD reporting deadlines for 2025?',
      'How do I calculate Scope 3 emissions?',
      'What is the EU ETS carbon price?',
      'How does CBAM affect steel imports?',
      'What are EN 15978 requirements for buildings?',
    ],
  });
});

export default router;
