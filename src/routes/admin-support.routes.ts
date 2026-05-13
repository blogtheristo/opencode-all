/**
 * Admin Support Chat Routes
 *
 * Admin-only support channel for the DWS6 dashboard settings panel.
 */

import express, { type Request, type Response, type Router } from 'express';
import { body, validationResult } from 'express-validator';
import { authenticateToken, requireRole } from '../middleware/auth.middleware.js';
import logger from '../utils/logger.js';
import ClimateAssistantService from '../services/climate-assistant.service.js';

interface ChatHistoryMessage {
  role: 'user' | 'assistant';
  content: string;
}

const router: Router = express.Router();
const MAX_CONVERSATION_HISTORY = 15;

const chatValidation = [
  body('message')
    .isString()
    .trim()
    .isLength({ min: 1, max: 4000 })
    .withMessage('Message must be between 1 and 4000 characters'),
  body('conversationHistory')
    .optional()
    .isArray({ max: MAX_CONVERSATION_HISTORY })
    .withMessage(`Conversation history must be an array with max ${MAX_CONVERSATION_HISTORY} messages`),
];

const validateRequest = (req: Request, res: Response, next: () => void): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      error: 'Validation Error',
      details: errors.array(),
    });
    return;
  }
  next();
};

function sanitizeHistory(messages: unknown[]): ChatHistoryMessage[] {
  return messages
    .filter((item): item is { role: unknown; content: unknown } => {
      return !!item && typeof item === 'object';
    })
    .map((item) => ({
      role: (item.role === 'assistant' ? 'assistant' : 'user') as 'assistant' | 'user',
      content: typeof item.content === 'string' ? item.content.trim() : '',
    }))
    .filter((item) => item.content.length > 0)
    .slice(-MAX_CONVERSATION_HISTORY);
}

router.post(
  '/chat',
  authenticateToken,
  requireRole(['admin', 'owner']),
  chatValidation,
  validateRequest,
  async (req: Request, res: Response) => {
    try {
      const message = (req.body.message as string).trim();
      const conversationHistory = Array.isArray(req.body.conversationHistory)
        ? sanitizeHistory(req.body.conversationHistory as unknown[])
        : [];

      const adminPromptPrefix =
        'This request comes from the DWS6 admin support panel. ' +
        'Prioritize actionable platform support guidance for admins, ' +
        'including troubleshooting steps, operational checks, and safe next actions.';

      const response = await ClimateAssistantService.processMessage({
        message:
          `${adminPromptPrefix}\n\n` +
          '---USER_INPUT_START---\n' +
          `${message}\n` +
          '---USER_INPUT_END---\n' +
          'Respond only to the request inside the delimiters.',
        conversationHistory,
      });

      logger.info('Admin support chat request processed', {
        userId: req.userId,
        userRole: req.userRole,
        messageLength: message.length,
      });

      return res.status(200).json({
        content: response.content,
        model: response.model,
        usage: response.usage,
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      logger.error('Admin support chat error', {
        userId: req.userId,
        error: error.message,
      });

      return res.status(500).json({
        error: 'Admin Support Error',
        message: error.message || 'Failed to process admin support request',
      });
    }
  },
);

export default router;
