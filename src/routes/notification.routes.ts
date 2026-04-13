/**
 * Notification Routes
 *
 * GET    /api/v1/notifications          — List notifications (paginated)
 * GET    /api/v1/notifications/unread   — Get unread count
 * PATCH  /api/v1/notifications/:id/read — Mark notification as read
 * POST   /api/v1/notifications/read-all — Mark all as read
 *
 * Code-Version: 1.0.0
 * Introduced-In: PR-913
 */

import { type NextFunction, type Request, type Response, Router } from 'express';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { notificationService } from '../services/notification.service.js';

const router = Router();

router.use(authenticateToken);

/**
 * GET /api/v1/notifications
 * List notifications for the authenticated user (newest first).
 */
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId!;
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
    const offset = parseInt(req.query.offset as string) || 0;

    const result = await notificationService.getNotifications(userId, limit, offset);

    res.json({
      ...result,
      limit,
      offset,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/v1/notifications/unread
 * Get unread notification count (for badge display).
 */
router.get('/unread', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const count = await notificationService.getUnreadCount(req.userId!);
    res.json({ unread: count });
  } catch (err) {
    next(err);
  }
});

/**
 * PATCH /api/v1/notifications/:id/read
 * Mark a single notification as read.
 */
router.patch('/:id/read', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const success = await notificationService.markRead(req.userId!, req.params.id);

    if (!success) {
      res.status(404).json({ error: 'Notification not found' });
      return;
    }

    res.json({ message: 'Notification marked as read' });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/v1/notifications/read-all
 * Mark all notifications as read.
 */
router.post('/read-all', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const count = await notificationService.markAllRead(req.userId!);
    res.json({ message: 'All notifications marked as read', count });
  } catch (err) {
    next(err);
  }
});

export default router;
