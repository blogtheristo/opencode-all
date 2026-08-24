/**
 * API Key Management Routes
 *
 * POST   /api/v1/user/api-keys      — Create a new API key
 * GET    /api/v1/user/api-keys      — List user's API keys
 * DELETE /api/v1/user/api-keys/:id  — Revoke an API key
 *
 * All routes require JWT authentication.
 * MVP Feature 1
 */

import { type NextFunction, type Request, type Response, Router } from 'express';
import { z } from 'zod';
import { validate } from '../middleware/validate.js';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { ApiKeyService, VALID_SCOPES } from '../services/api-key.service.js';
import logger from '../utils/logger.js';

const router = Router();

// All API key routes require authentication
router.use(authenticateToken);

// ============ SCHEMAS ============

const CreateKeySchema = z.object({
  name: z.string().min(1).max(100),
  scopes: z
    .array(z.string())
    .min(1)
    .max(VALID_SCOPES.length)
    .default(['compliance:read', 'usage:read']),
  expiresInDays: z.number().int().min(1).max(365).optional(),
});

// ============ ROUTES ============

/**
 * POST /api/v1/user/api-keys
 * Create a new API key. The raw key is returned exactly once.
 */
router.post(
  '/',
  validate({ body: CreateKeySchema }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.userId;
      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }
      const result = await ApiKeyService.create({
        userId,
        name: req.body.name,
        scopes: req.body.scopes,
        expiresInDays: req.body.expiresInDays,
      });

      res.status(201).json({
        message: 'API key created. Save the raw key — it will not be shown again.',
        key: result,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create API key';
      logger.error('API key creation failed', { userId: req.userId, error: message });

      if (message.includes('Maximum')) {
        res.status(409).json({ error: message });
        return;
      }
      if (message.includes('Invalid scope')) {
        res.status(400).json({ error: message });
        return;
      }

      next(err);
    }
  },
);

/**
 * GET /api/v1/user/api-keys
 * List all API keys for the authenticated user (hashes excluded).
 */
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    const keys = await ApiKeyService.list(userId);

    res.json({
      keys,
      total: keys.length,
      validScopes: VALID_SCOPES,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * DELETE /api/v1/user/api-keys/:id
 * Revoke an API key (soft delete).
 */
router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const keyId = req.params.id;
    const userId = req.userId;
    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    const revoked = await ApiKeyService.revoke(userId, keyId);

    if (!revoked) {
      res.status(404).json({ error: 'API key not found or already revoked' });
      return;
    }

    res.json({ message: 'API key revoked', keyId });
  } catch (err) {
    next(err);
  }
});

export default router;
