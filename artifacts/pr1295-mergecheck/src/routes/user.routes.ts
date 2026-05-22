/**
 * User Routes
 * User profile and notification preferences with Supabase integration.
 *
 * GET  /api/v1/user/profile       — Get current user profile
 * PUT  /api/v1/user/profile       — Update user profile
 * GET  /api/v1/user/notifications — Get notification preferences
 * PUT  /api/v1/user/notifications — Update notification preferences
 *
 * Code-Version: 1.0.0
 * Introduced-In: PR-913
 */

import { type NextFunction, type Request, type Response, Router } from 'express';
import { z } from 'zod';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.js';
import logger from '../utils/logger.js';
import { getSupabaseClient } from '../config/supabase.js';

const router = Router();

// Supabase service client (shared, uses SUPABASE_SERVICE_KEY)
const supabase = getSupabaseClient();

// All user routes require authentication
router.use(authenticateToken);

// ============ SCHEMAS ============

const ProfileUpdateSchema = z.object({
  firstName: z.string().min(1).max(100).optional(),
  lastName: z.string().min(1).max(100).optional(),
  displayName: z.string().min(1).max(200).optional(),
  avatarUrl: z.string().url().max(500).optional(),
  phone: z.string().max(50).optional(),
  locale: z.enum(['en', 'fi', 'de', 'sv']).optional(),
  timezone: z.string().max(50).optional(),
});

const NotificationPrefsSchema = z.object({
  emailAlerts: z.boolean().optional(),
  complianceDeadlines: z.boolean().optional(),
  carbonThresholds: z.boolean().optional(),
  reportReady: z.boolean().optional(),
  weeklyDigest: z.boolean().optional(),
  agentCompletions: z.boolean().optional(),
});

// ============ PROFILE ROUTES ============

/**
 * GET /api/v1/user/profile
 * Get current user profile from Supabase user_profiles table.
 */
router.get('/profile', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId!;

    if (!supabase) {
      // Fallback: return basic info from JWT
      res.json({
        id: userId,
        email: req.userEmail,
        role: req.userRole,
        profile: null,
        message: 'Supabase not configured — profile data unavailable',
      });
      return;
    }

    // user_profiles.id is the PK and references auth.users(id) — see migration 007
    const { data: profile, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      // PGRST116 = no rows found — that's OK for new users
      logger.error('Profile fetch error', { userId, error: error.message });
      throw error;
    }

    res.json({
      id: userId,
      email: req.userEmail,
      role: req.userRole,
      profile: profile || {
        id: userId,
        email: req.userEmail,
        first_name: null,
        last_name: null,
        display_name: null,
        avatar_url: null,
        phone: null,
        timezone: 'Europe/Helsinki',
        locale: 'en',
        created_at: new Date().toISOString(),
      },
    });
  } catch (err) {
    next(err);
  }
});

/**
 * PUT /api/v1/user/profile
 * Update user profile — upserts to Supabase user_profiles table.
 */
router.put(
  '/profile',
  validate({ body: ProfileUpdateSchema }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.userId!;
      const updates = req.body;

      if (!supabase) {
        res.status(503).json({
          error: 'Service unavailable',
          message: 'Database not configured',
        });
        return;
      }

      // Map camelCase → snake_case. PK is `id` per migration 007.
      const dbUpdates: Record<string, unknown> = {
        id: userId,
        email: req.userEmail,
        updated_at: new Date().toISOString(),
      };
      if (updates.firstName !== undefined) dbUpdates.first_name = updates.firstName;
      if (updates.lastName !== undefined) dbUpdates.last_name = updates.lastName;
      if (updates.displayName !== undefined) dbUpdates.display_name = updates.displayName;
      if (updates.avatarUrl !== undefined) dbUpdates.avatar_url = updates.avatarUrl;
      if (updates.phone !== undefined) dbUpdates.phone = updates.phone;
      if (updates.locale !== undefined) dbUpdates.locale = updates.locale;
      if (updates.timezone !== undefined) dbUpdates.timezone = updates.timezone;

      const { data, error } = await supabase
        .from('user_profiles')
        .upsert(dbUpdates, { onConflict: 'id' })
        .select()
        .single();

      if (error) {
        logger.error('Profile update error', { userId, error: error.message });
        throw error;
      }

      logger.info('Profile updated', { userId, fields: Object.keys(updates) });

      res.json({
        message: 'Profile updated successfully',
        profile: data,
      });
    } catch (err) {
      next(err);
    }
  },
);

// ============ NOTIFICATION PREFERENCES ============

/**
 * GET /api/v1/user/notifications
 * Get notification preferences for the authenticated user.
 */
router.get('/notifications', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.userId!;

    // Default preferences for new users
    const defaults = {
      user_id: userId,
      email_alerts: true,
      compliance_deadlines: true,
      carbon_thresholds: true,
      report_ready: true,
      weekly_digest: true,
      agent_completions: false,
    };

    if (!supabase) {
      res.json({ preferences: defaults });
      return;
    }

    const { data, error } = await supabase
      .from('notification_preferences')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      logger.error('Notification prefs fetch error', { userId, error: error.message });
      throw error;
    }

    res.json({
      preferences: data || defaults,
    });
  } catch (err) {
    next(err);
  }
});

/**
 * PUT /api/v1/user/notifications
 * Update notification preferences — upserts to Supabase notification_preferences table.
 */
router.put(
  '/notifications',
  validate({ body: NotificationPrefsSchema }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.userId!;
      const prefs = req.body;

      if (!supabase) {
        res.status(503).json({
          error: 'Service unavailable',
          message: 'Database not configured',
        });
        return;
      }

      const dbPrefs: Record<string, unknown> = {
        user_id: userId,
        updated_at: new Date().toISOString(),
      };
      if (prefs.emailAlerts !== undefined) dbPrefs.email_alerts = prefs.emailAlerts;
      if (prefs.complianceDeadlines !== undefined)
        dbPrefs.compliance_deadlines = prefs.complianceDeadlines;
      if (prefs.carbonThresholds !== undefined) dbPrefs.carbon_thresholds = prefs.carbonThresholds;
      if (prefs.reportReady !== undefined) dbPrefs.report_ready = prefs.reportReady;
      if (prefs.weeklyDigest !== undefined) dbPrefs.weekly_digest = prefs.weeklyDigest;
      if (prefs.agentCompletions !== undefined) dbPrefs.agent_completions = prefs.agentCompletions;

      const { data, error } = await supabase
        .from('notification_preferences')
        .upsert(dbPrefs, { onConflict: 'user_id' })
        .select()
        .single();

      if (error) {
        logger.error('Notification prefs update error', { userId, error: error.message });
        throw error;
      }

      logger.info('Notification preferences updated', { userId });

      res.json({
        message: 'Notification preferences updated',
        preferences: data,
      });
    } catch (err) {
      next(err);
    }
  },
);

export default router;
