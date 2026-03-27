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

import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.js';
import logger from '../utils/logger.js';
import { createClient } from '@supabase/supabase-js';

const router = Router();

// Supabase service client
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = supabaseUrl && supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null;

// All user routes require authentication
router.use(authenticateToken);

// ============ SCHEMAS ============

const ProfileUpdateSchema = z.object({
  fullName: z.string().min(1).max(200).optional(),
  organization: z.string().max(200).optional(),
  jobTitle: z.string().max(100).optional(),
  country: z.string().length(2).optional(),
  language: z.enum(['en', 'fi', 'de', 'sv']).optional(),
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

    const { data: profile, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
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
        user_id: userId,
        full_name: null,
        organization: null,
        job_title: null,
        country: null,
        language: 'en',
        timezone: 'Europe/Helsinki',
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

      // Map camelCase to snake_case for Supabase
      const dbUpdates: Record<string, unknown> = {
        user_id: userId,
        updated_at: new Date().toISOString(),
      };
      if (updates.fullName !== undefined) dbUpdates.full_name = updates.fullName;
      if (updates.organization !== undefined) dbUpdates.organization = updates.organization;
      if (updates.jobTitle !== undefined) dbUpdates.job_title = updates.jobTitle;
      if (updates.country !== undefined) dbUpdates.country = updates.country;
      if (updates.language !== undefined) dbUpdates.language = updates.language;
      if (updates.timezone !== undefined) dbUpdates.timezone = updates.timezone;

      const { data, error } = await supabase
        .from('user_profiles')
        .upsert(dbUpdates, { onConflict: 'user_id' })
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
      if (prefs.complianceDeadlines !== undefined) dbPrefs.compliance_deadlines = prefs.complianceDeadlines;
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
