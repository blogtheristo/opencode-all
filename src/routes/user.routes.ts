/**
 * User Routes
 * User profile and settings endpoints
 */

import express, { Router, Request, Response } from 'express';
import logger from '../utils/logger.js';
import { authenticateToken } from '../middleware/auth.middleware.js';

const router: Router = express.Router();

/**
 * GET /api/v1/user/profile
 * Get current user profile
 */
router.get('/profile', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = req.userId;

    logger.info('User profile request', { userId });

    res.status(200).json({
      message: 'User profile endpoint',
      userId,
    });
  } catch (error: any) {
    logger.error('User profile error', { error: error.message });
    res.status(500).json({
      error: 'Failed to get user profile',
      message: error.message,
    });
  }
});

/**
 * PUT /api/v1/user/profile
 * Update user profile
 */
router.put('/profile', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    const updates = req.body;

    logger.info('User profile update', { userId, fields: Object.keys(updates) });

    res.status(200).json({
      message: 'Profile updated successfully',
      userId,
    });
  } catch (error: any) {
    logger.error('User profile update error', { error: error.message });
    res.status(500).json({
      error: 'Failed to update profile',
      message: error.message,
    });
  }
});

export default router;
