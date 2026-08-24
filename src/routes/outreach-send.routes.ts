/**
 * Outreach Quick-Send API
 *
 * POST /api/v1/outreach/send-email — Send outreach email to a prospect
 *   Body: { thread_token, email_type: "investor"|"sales"|"partnership" }
 *   Auth: Admin API key via X-Admin-Key header
 *
 * GET /api/v1/outreach/send-email — Confirmation page (for email button clicks)
 *   Query: ?token=THREAD_TOKEN&type=investor&key=ADMIN_KEY
 *   Returns HTML confirmation page with send button
 *
 * SECURITY: Migrated from Resend to Amazon SES (SMTP) on 2026-04-16.
 * Resend permanently banned — see CLAUDE.md Email Rules.
 * Transport: src/utils/send-email.ts (SES SMTP only).
 */

import crypto from 'crypto';
import express, { type Request, type Response, type Router } from 'express';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import logger from '../utils/logger.js';
import { generateProspectEmail } from '../outreach/prospect-email-templates.js';
import type { EmailType, ProspectContext } from '../outreach/prospect-email-templates.js';
import { sendEmail } from '../utils/send-email.js';

const router: Router = express.Router();

// ============================================================================
// SUPABASE CLIENT (SDK — replaces raw fetch)
// ============================================================================

let supabase: SupabaseClient | null = null;

function getSupabase(): SupabaseClient {
  if (supabase) return supabase;

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;

  if (!url || !key) {
    throw new Error('SUPABASE_URL and SUPABASE_SERVICE_KEY required');
  }

  supabase = createClient(url, key);
  return supabase;
}

// ============================================================================
// AUTH — Admin API key
// ============================================================================

function requireAdminKey(req: Request, res: Response): boolean {
  const adminKey = process.env.ADMIN_API_KEY;
  const provided = (req.headers['x-admin-key'] as string) || (req.query.key as string);

  if (!adminKey) {
    res.status(503).json({ error: 'ADMIN_API_KEY not configured' });
    return false;
  }

  // SECURITY: Timing-safe comparison to prevent timing attacks
  const providedBuf = Buffer.from(String(provided).padEnd(256, '\0'));
  const expectedBuf = Buffer.from(adminKey.padEnd(256, '\0'));
  if (!crypto.timingSafeEqual(providedBuf, expectedBuf)) {
    res.status(401).json({ error: 'Unauthorized' });
    return false;
  }

  return true;
}

// ============================================================================
// SHARED: Lookup thread + send email
// ============================================================================

const VALID_EMAIL_TYPES: EmailType[] = ['investor', 'sales', 'partnership'];

interface ThreadData {
  id: string;
  pipeline: string;
  thread_token: string;
  our_angle: string | null;
  their_angle: string | null;
  investor_type: string | null;
  check_size: string | null;
  partnership_type: string | null;
  customer_segment: string | null;
  first_name: string;
  last_name: string | null;
  person_title: string | null;
  org_name: string | null;
  primary_email: string | null;
  person_phone: string | null;
  person_id: string;
  org_id: string | null;
}

async function lookupThread(token: string): Promise<ThreadData | null> {
  const db = getSupabase();
  const { data, error } = await db
    .from('v_outreach_enriched')
    .select(
      'id,pipeline,thread_token,our_angle,their_angle,investor_type,check_size,partnership_type,customer_segment,first_name,last_name,person_title,org_name,primary_email,person_phone,person_id,org_id',
    )
    .eq('thread_token', token)
    .limit(1)
    .single();

  if (error && error.code !== 'PGRST116') {
    throw new Error(`Thread lookup failed: ${error.message}`);
  }

  return data as ThreadData | null;
}

async function sendProspectEmail(
  thread: ThreadData,
  emailType: EmailType,
  fromAddress: string,
): Promise<{ success: boolean; error?: string }> {
  if (!thread.primary_email) {
    return { success: false, error: 'No primary email for this prospect. Add their email first.' };
  }

  const ctx: ProspectContext = {
    firstName: thread.first_name,
    lastName: thread.last_name,
    title: thread.person_title,
    orgName: thread.org_name,
    pipeline: thread.pipeline,
    ourAngle: thread.our_angle,
    theirAngle: thread.their_angle,
    investorType: thread.investor_type,
    checkSize: thread.check_size,
    partnershipType: thread.partnership_type,
    customerSegment: thread.customer_segment,
  };

  const { subject, html, text } = generateProspectEmail(emailType, ctx);

  // Send via Amazon SES (SMTP) — Resend permanently banned 2026-03-26
  const sesResult = await sendEmail({
    from: fromAddress,
    to: thread.primary_email,
    subject,
    html,
    text,
  });

  if (!sesResult.ok) {
    logger.error('SES prospect email failed', { error: sesResult.error });
    return { success: false, error: sesResult.error ?? 'SES send failed' };
  }

  // Log the outreach activity via SDK
  try {
    const db = getSupabase();
    const { error: activityErr } = await db.from('outreach_activities').insert({
      thread_id: thread.id,
      person_id: thread.person_id,
      org_id: thread.org_id,
      pipeline: thread.pipeline,
      channel: 'email',
      activity_type: 'sent',
      description: `${emailType} email sent to ${thread.primary_email}: "${subject}"`,
      raw_payload: { email_type: emailType, subject, to: thread.primary_email },
      outcome: 'neutral',
      source: 'manual',
      created_by: 'quick_send_api',
    });

    if (activityErr) {
      logger.warn('Failed to log outreach activity', { error: activityErr.message });
    }
  } catch (err) {
    // Non-blocking — email already sent
    const msg = err instanceof Error ? err.message : 'Unknown';
    logger.warn('Failed to log outreach activity', { error: msg });
  }

  return { success: true };
}

// ============================================================================
// GET /send-email — Confirmation page (for email button clicks)
// ============================================================================

router.get('/send-email', async (req: Request, res: Response) => {
  const adminKey = process.env.ADMIN_API_KEY;
  const provided = req.query.key as string;

  // SECURITY: Timing-safe comparison to prevent timing attacks
  if (!adminKey || !provided) {
    res
      .status(401)
      .send(
        '<html><body style="background:#0a0a0a;color:#ff4444;font-family:sans-serif;padding:40px;"><h2>Unauthorized</h2></body></html>',
      );
    return;
  }
  const providedBuf2 = Buffer.from(String(provided).padEnd(256, '\0'));
  const expectedBuf2 = Buffer.from(adminKey.padEnd(256, '\0'));
  if (!crypto.timingSafeEqual(providedBuf2, expectedBuf2)) {
    res
      .status(401)
      .send(
        '<html><body style="background:#0a0a0a;color:#ff4444;font-family:sans-serif;padding:40px;"><h2>Unauthorized</h2></body></html>',
      );
    return;
  }

  const token = req.query.token as string;
  const emailType = req.query.type as EmailType;

  if (!token || !emailType || !VALID_EMAIL_TYPES.includes(emailType)) {
    res
      .status(400)
      .send(
        '<html><body style="background:#0a0a0a;color:#ff4444;font-family:sans-serif;padding:40px;"><h2>Missing token or type</h2></body></html>',
      );
    return;
  }

  try {
    const thread = await lookupThread(token);
    if (!thread) {
      res
        .status(404)
        .send(
          '<html><body style="background:#0a0a0a;color:#ff4444;font-family:sans-serif;padding:40px;"><h2>Thread not found</h2></body></html>',
        );
      return;
    }

    // Check if this is a confirmed send (confirm=1 query param)
    if (req.query.confirm === '1') {
      const fromAddress = process.env.EMAIL_FROM || 'risto@onelifetime.world';

      const result = await sendProspectEmail(thread, emailType, fromAddress);

      if (result.success) {
        const name = [thread.first_name, thread.last_name].filter(Boolean).join(' ');
        res.send(`<html><body style="background:#0a0a0a;color:#00d4aa;font-family:sans-serif;padding:40px;text-align:center;">
          <h2>Email Sent</h2>
          <p style="color:#ccc;">${emailType.toUpperCase()} email sent to <strong>${escHtml(name)}</strong> (${escHtml(thread.primary_email || '')})</p>
          <p style="color:#666;margin-top:24px;font-size:12px;">Activity logged. You can close this window.</p>
        </body></html>`);
      } else {
        res.status(500)
          .send(`<html><body style="background:#0a0a0a;color:#ff4444;font-family:sans-serif;padding:40px;">
          <h2>Send Failed</h2>
          <p style="color:#ccc;">${escHtml(result.error || 'Unknown error')}</p>
        </body></html>`);
      }
      return;
    }

    // Show confirmation page
    const name = [thread.first_name, thread.last_name].filter(Boolean).join(' ');
    const org = thread.org_name ? ` (${escHtml(thread.org_name)})` : '';
    const email = thread.primary_email
      ? escHtml(thread.primary_email)
      : '<span style="color:#ff4444">No email on file</span>';
    const phone = thread.person_phone
      ? `<p style="color:#888;margin:4px 0;">Phone: ${escHtml(thread.person_phone)}</p>`
      : '';

    const typeColors: Record<string, string> = {
      investor: '#60a5fa',
      sales: '#00d4aa',
      partnership: '#c084fc',
    };
    const typeColor = typeColors[emailType] || '#ccc';

    const confirmUrl = `/api/v1/outreach/send-email?token=${encodeURIComponent(token)}&type=${emailType}&key=${encodeURIComponent(provided)}&confirm=1`;

    res.send(`<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="background:#0a0a0a;color:#ccc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;padding:40px;margin:0;">
  <div style="max-width:480px;margin:0 auto;background:#111;padding:32px;border-radius:8px;border-top:3px solid ${typeColor};">
    <h2 style="color:${typeColor};margin:0 0 16px;">Send ${emailType.charAt(0).toUpperCase() + emailType.slice(1)} Email</h2>
    <p style="margin:0 0 4px;font-size:16px;"><strong style="color:#e0e0e0;">${escHtml(name)}</strong>${org}</p>
    <p style="margin:4px 0;color:#888;">To: ${email}</p>
    ${phone}
    <p style="margin:16px 0 4px;color:#888;font-size:12px;">Pipeline: <span style="color:${typeColor};">${thread.pipeline.toUpperCase()}</span></p>
    ${
      !thread.primary_email
        ? '<p style="color:#ff4444;margin:16px 0;">Cannot send — no email address on file. Add their email first.</p>'
        : `
    <a href="${confirmUrl}" style="display:inline-block;margin-top:24px;padding:12px 32px;background:${typeColor};color:#000;text-decoration:none;font-weight:700;border-radius:6px;font-size:14px;">
      Confirm & Send
    </a>`
    }
    <p style="color:#444;margin-top:24px;font-size:11px;">Click to send. Activity will be logged automatically.</p>
  </div>
</body></html>`);
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    logger.error('Quick-send confirmation page error', { error: msg });
    res
      .status(500)
      .send(
        `<html><body style="background:#0a0a0a;color:#ff4444;font-family:sans-serif;padding:40px;"><h2>Error</h2><p>${escHtml(msg)}</p></body></html>`,
      );
  }
});

// ============================================================================
// POST /send-email — Programmatic send (for API calls)
// ============================================================================

router.post('/send-email', express.json(), async (req: Request, res: Response) => {
  if (!requireAdminKey(req, res)) return;

  const { thread_token, email_type } = req.body;

  if (!thread_token || !email_type || !VALID_EMAIL_TYPES.includes(email_type)) {
    res
      .status(400)
      .json({ error: 'Provide thread_token and email_type (investor|sales|partnership)' });
    return;
  }

  const fromAddress = process.env.EMAIL_FROM || 'risto@onelifetime.world';

  try {
    const thread = await lookupThread(thread_token);
    if (!thread) {
      res.status(404).json({ error: 'Thread not found' });
      return;
    }

    const result = await sendProspectEmail(thread, email_type, fromAddress);

    if (result.success) {
      logger.info('Prospect email sent via API', {
        threadToken: thread_token,
        emailType: email_type,
        to: thread.primary_email,
      });
      res.json({
        ok: true,
        sent_to: thread.primary_email,
        email_type,
        thread_token,
        name: [thread.first_name, thread.last_name].filter(Boolean).join(' '),
      });
    } else {
      res.status(422).json({ error: result.error });
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    logger.error('Quick-send API error', { error: msg });
    res.status(500).json({ error: 'Failed to send email', message: msg });
  }
});

function escHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export default router;
