/**
 * Notification Delivery Service
 *
 * Listens to event bus events and delivers notifications via:
 * - In-app (stored in Supabase notifications table)
 * - Email (via email.service.ts / Amazon SES)
 *
 * Respects user notification preferences from notification_preferences table.
 *
 * Code-Version: 1.0.0
 * Introduced-In: PR-913
 */

import logger from '../utils/logger.js';
import { type DWSEvent, eventBus } from '../agents/event-bus.js';
import { getSupabaseClient } from '../config/supabase.js';

const supabase = getSupabaseClient();

// ============ TYPES ============

interface Notification {
  user_id: string;
  type: string;
  title: string;
  body: string | null;
  severity: 'info' | 'warning' | 'critical' | 'success' | 'error';
  metadata: Record<string, unknown>;
  read: boolean;
  channel?: 'in_app' | 'email' | 'both';
}

interface NotificationPreferences {
  email_alerts: boolean;
  compliance_deadlines: boolean;
  carbon_thresholds: boolean;
  report_ready: boolean;
  weekly_digest: boolean;
  agent_completions: boolean;
}

// ============ NOTIFICATION RULES ============

/**
 * Maps event types to notification properties.
 * Each rule determines who gets notified, via which channel, and what the message says.
 */
interface NotificationRule {
  eventPattern: string;
  prefKey: keyof NotificationPreferences;
  severity: Notification['severity'];
  titleFn: (event: DWSEvent) => string;
  bodyFn: (event: DWSEvent) => string;
  channel: 'in_app' | 'email' | 'both';
}

const NOTIFICATION_RULES: NotificationRule[] = [
  {
    eventPattern: 'compliance.score_changed',
    prefKey: 'compliance_deadlines',
    severity: 'warning',
    titleFn: () => 'Compliance Score Changed',
    bodyFn: (e) =>
      `Your compliance score changed to ${e.payload.newScore ?? 'N/A'}. ${e.payload.reason ?? ''}`,
    channel: 'both',
  },
  {
    eventPattern: 'compliance.deadline_approaching',
    prefKey: 'compliance_deadlines',
    severity: 'critical',
    titleFn: () => 'Compliance Deadline Approaching',
    bodyFn: (e) =>
      `Regulation ${e.payload.regulation ?? ''} deadline is in ${e.payload.daysRemaining ?? '?'} days.`,
    channel: 'both',
  },
  {
    eventPattern: 'carbon.threshold_exceeded',
    prefKey: 'carbon_thresholds',
    severity: 'critical',
    titleFn: () => 'Carbon Threshold Exceeded',
    bodyFn: (e) =>
      `Carbon emissions for ${e.payload.scope ?? 'your organization'} exceeded the threshold: ${e.payload.value ?? 'N/A'} tCO2e.`,
    channel: 'both',
  },
  {
    eventPattern: 'report.generated',
    prefKey: 'report_ready',
    severity: 'success',
    titleFn: () => 'Report Ready',
    bodyFn: (e) => `Your ${e.payload.reportType ?? 'compliance'} report is ready for download.`,
    channel: 'in_app',
  },
  {
    eventPattern: 'agent.task_complete',
    prefKey: 'agent_completions',
    severity: 'info',
    titleFn: (e) => `Agent Complete: ${e.source}`,
    bodyFn: (e) => `Agent ${e.source} completed. Score: ${e.payload.score ?? 'N/A'}/100.`,
    channel: 'in_app',
  },
];

// ============ SERVICE ============

class NotificationService {
  private unsubscribers: (() => void)[] = [];

  /**
   * Start listening to event bus events and delivering notifications.
   * Call once at server startup.
   */
  start(): void {
    for (const rule of NOTIFICATION_RULES) {
      const unsub = eventBus.subscribe(rule.eventPattern, async (event) => {
        await this.handleEvent(event, rule);
      });
      this.unsubscribers.push(unsub);
    }
    logger.info('Notification service started', {
      rules: NOTIFICATION_RULES.length,
    });
  }

  /** Stop all event listeners (for graceful shutdown). */
  stop(): void {
    for (const unsub of this.unsubscribers) {
      unsub();
    }
    this.unsubscribers = [];
    logger.info('Notification service stopped');
  }

  /** Get unread notification count for a user. */
  async getUnreadCount(userId: string): Promise<number> {
    if (!supabase) return 0;

    const { count, error } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('read', false);

    if (error) {
      logger.error('Failed to get unread count', { userId, error: error.message });
      return 0;
    }
    return count ?? 0;
  }

  /** Get notifications for a user (paginated). */
  async getNotifications(
    userId: string,
    limit = 20,
    offset = 0,
  ): Promise<{
    notifications: Notification[];
    total: number;
  }> {
    if (!supabase) {
      return { notifications: [], total: 0 };
    }

    const { data, error, count } = await supabase
      .from('notifications')
      .select('*', { count: 'exact' })
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      logger.error('Failed to get notifications', { userId, error: error.message });
      return { notifications: [], total: 0 };
    }

    return {
      notifications: (data || []) as Notification[],
      total: count ?? 0,
    };
  }

  /** Mark a notification as read. */
  async markRead(userId: string, notificationId: string): Promise<boolean> {
    if (!supabase) return false;

    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', notificationId)
      .eq('user_id', userId);

    return !error;
  }

  /** Mark all notifications as read for a user. */
  async markAllRead(userId: string): Promise<number> {
    if (!supabase) return 0;

    const { count, error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('user_id', userId)
      .eq('read', false)
      .select('*');

    if (error) {
      logger.error('Failed to mark all read', { userId, error: error.message });
      return 0;
    }
    return count ?? 0;
  }

  // ============ PRIVATE ============

  private async handleEvent(event: DWSEvent, rule: NotificationRule): Promise<void> {
    try {
      // Determine target user(s) — for now, use orgId to find org members
      const users = await this.getOrgUsers(event.orgId);

      for (const user of users) {
        // Check user preferences
        const prefs = await this.getUserPreferences(user.id);
        if (prefs && !prefs[rule.prefKey]) {
          continue; // User opted out of this notification type
        }

        const notification: Notification = {
          user_id: user.id,
          type: rule.eventPattern,
          title: rule.titleFn(event),
          body: rule.bodyFn(event),
          severity: rule.severity,
          metadata: event.payload,
          read: false,
          channel: rule.channel,
        };

        // Store in-app notification
        if (rule.channel === 'in_app' || rule.channel === 'both') {
          await this.storeNotification(notification);
        }

        // Send email notification
        if (
          (rule.channel === 'email' || rule.channel === 'both') &&
          prefs?.email_alerts !== false
        ) {
          await this.sendEmailNotification(user.email, notification);
        }
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      logger.error('Notification delivery failed', {
        eventType: event.type,
        error: msg,
      });
    }
  }

  private async storeNotification(notification: Notification): Promise<void> {
    if (!supabase) return;

    const { error } = await supabase.from('notifications').insert({
      user_id: notification.user_id,
      type: notification.type,
      title: notification.title,
      body: notification.body,
      severity: notification.severity,
      metadata: notification.metadata,
      read: false,
      created_at: new Date().toISOString(),
    });

    if (error) {
      logger.error('Failed to store notification', {
        userId: notification.user_id,
        error: error.message,
      });
    }
  }

  private async sendEmailNotification(email: string, notification: Notification): Promise<void> {
    try {
      const { notificationTemplate } = await import('./email-templates.js');
      const { sendEmail } = await import('../utils/send-email.js');

      const html = notificationTemplate(notification.title, notification.body ?? '');
      await sendEmail({
        from: process.env.EMAIL_FROM || 'risto@onelifetime.world',
        to: email,
        subject: `[DWS IQ] ${notification.title}`,
        html,
      });

      logger.info('Notification email sent', {
        to: email,
        type: notification.type,
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      logger.error('Notification email failed', { email, error: msg });
    }
  }

  private async getUserPreferences(userId: string): Promise<NotificationPreferences | null> {
    if (!supabase) return null;

    const { data, error } = await supabase
      .from('notification_preferences')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) return null;
    return data as NotificationPreferences;
  }

  private async getOrgUsers(orgId: string): Promise<{ id: string; email: string }[]> {
    if (!supabase || !orgId) return [];

    const { data: members, error: membersError } = await supabase
      .from('organization_members')
      .select('user_id')
      .eq('organization_id', orgId)
      .limit(50);

    if (membersError || !members || members.length === 0) return [];

    const userIds = members
      .map((member: { user_id: string | null }) => member.user_id)
      .filter((userId): userId is string => Boolean(userId));

    if (userIds.length === 0) return [];

    const { data, error } = await supabase
      .from('user_profiles')
      .select('id, email')
      .in('id', userIds);

    if (error || !data) return [];
    return data.map((u: { id: string; email: string }) => ({
      id: u.id,
      email: u.email,
    }));
  }
}

export const notificationService = new NotificationService();
