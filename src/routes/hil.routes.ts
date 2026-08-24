/**
 * HIL (Human-in-the-Loop) Routes
 *
 * GET /api/hil/done/:token
 *   Called when Risto clicks the ✅ Done button in the morning briefing email.
 *   Marks the hil_todo row as done and returns a confirmation page.
 *   No authentication needed — done_token is a UUID unguessable without the email.
 */

import { type Request, type Response, Router } from 'express';
import { getInternalDbPool } from '../config/internal-db.js';
import { sendEmail } from '../utils/send-email.js';
import logger from '../utils/logger.js';

const router = Router();

router.get('/done/:token', async (req: Request, res: Response): Promise<void> => {
  const { token } = req.params;

  // Basic UUID shape check to prevent path traversal / injection
  if (!/^[0-9a-f-]{36}$/i.test(token)) {
    res.status(400).send('<p>Invalid token.</p>');
    return;
  }

  const pool = getInternalDbPool();
  if (!pool) {
    res.status(503).send('<p>Internal database not configured.</p>');
    return;
  }

  // Fetch the todo to get its description for the confirmation page
  let description = 'Task';
  try {
    const fetchResult = await pool.query<{
      id: string;
      description: string;
      done_at: string | null;
    }>(`SELECT id, description, done_at FROM hil_todos WHERE done_token = $1 LIMIT 1`, [token]);
    if (fetchResult.rows.length === 0) {
      res
        .status(404)
        .send(
          confirmPage('Not found', 'This task does not exist or has already been removed.', false),
        );
      return;
    }
    const row = fetchResult.rows[0];
    description = row.description;
    if (row.done_at) {
      // Already done — show success without re-writing
      res.send(confirmPage('Already done ✅', description, true));
      return;
    }
  } catch {
    // continue — still attempt the update
  }

  // Mark done
  try {
    await pool.query(`UPDATE hil_todos SET done_at = $1 WHERE done_token = $2`, [
      new Date().toISOString(),
      token,
    ]);
    res.send(confirmPage('Done ✅', description, true));
  } catch {
    res
      .status(500)
      .send(confirmPage('Error', 'Could not mark task done — please try again.', false));
  }
});

/**
 * POST /api/hil/escalate
 *   Programmatic HIL escalation endpoint for agents.
 *   When an agent's confidence < 80%, it can call this to create an
 *   escalation record and notify a human via email (Slack planned).
 *
 *   Body: { agentName, reason, confidence, context, channel?, recipient? }
 */
router.post('/escalate', async (req: Request, res: Response): Promise<void> => {
  const { agentName, reason, confidence, context, channel, recipient } = req.body || {};

  if (!agentName || !reason) {
    res.status(400).json({ error: 'agentName and reason are required' });
    return;
  }

  const escalationId = crypto.randomUUID();
  const escalationEmail = recipient || process.env.HIL_ESCALATION_EMAIL || 'risto@lifetime.fi';
  const escalationChannel = channel || 'email';

  const escalation = {
    id: escalationId,
    agent_name: agentName,
    reason,
    confidence: confidence ?? null,
    context: context ?? null,
    channel: escalationChannel,
    recipient: escalationEmail,
    status: 'pending',
    created_at: new Date().toISOString(),
    resolved_at: null as string | null,
  };

  // Persist to the internal Postgres pool if available
  const pool = getInternalDbPool();
  if (pool) {
    try {
      await pool.query(
        `INSERT INTO hil_escalations (
           id, agent_name, reason, confidence, context, channel, recipient, status, created_at, resolved_at
         ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
        [
          escalation.id,
          escalation.agent_name,
          escalation.reason,
          escalation.confidence,
          escalation.context,
          escalation.channel,
          escalation.recipient,
          escalation.status,
          escalation.created_at,
          escalation.resolved_at,
        ],
      );
    } catch {
      // Non-blocking — still return the escalation
    }
  }

  // Email notification via SES SMTP
  let notificationAttempted = false;
  let notificationSent = false;
  let notificationError: string | null = null;
  if (escalationChannel === 'email') {
    notificationAttempted = true;
    try {
      const result = await sendEmail({
        from: process.env.EMAIL_FROM || 'risto@onelifetime.world',
        to: escalationEmail,
        subject: `[HIL] ${agentName} escalation — confidence ${Math.round((confidence ?? 0) * 100)}%`,
        html: `<h2>Agent Escalation</h2>
<p><strong>Agent:</strong> ${agentName}</p>
<p><strong>Confidence:</strong> ${Math.round((confidence ?? 0) * 100)}%</p>
<p><strong>Reason:</strong> ${reason}</p>
<pre>${JSON.stringify(context, null, 2)}</pre>
<p><em>Escalation ID: ${escalationId}</em></p>`,
        source: 'platform',
        templateType: 'hil_escalation',
        metadata: { agentName, escalationId, confidence: confidence ?? null },
      });

      if (result.ok) {
        notificationSent = true;
      } else {
        notificationError = result.error || 'SES SMTP send failed';
        logger.error('HIL escalation email delivery failed', {
          escalationId,
          agentName,
          recipient: escalationEmail,
          error: notificationError,
        });
      }
    } catch (err) {
      notificationError = err instanceof Error ? err.message : 'Unknown email error';
      logger.error('HIL escalation email exception', {
        escalationId,
        agentName,
        recipient: escalationEmail,
        error: notificationError,
      });
    }
  }

  res.status(201).json({
    escalationId,
    status: 'pending',
    channel: escalationChannel,
    recipient: escalationEmail,
    message:
      escalationChannel === 'email'
        ? notificationSent
          ? `Escalation created for agent "${agentName}" — human notified via email`
          : `Escalation created for agent "${agentName}" — email notification failed`
        : `Escalation created for agent "${agentName}"`,
    notification: {
      attempted: notificationAttempted,
      sent: notificationSent,
      error: notificationError,
    },
  });
});

function confirmPage(title: string, description: string, success: boolean): string {
  const color = success ? '#00d4aa' : '#ff4444';
  const bg = '#0a0a0a';
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title} — DWS IQ</title>
</head>
<body style="margin:0;background:${bg};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;">
  <div style="text-align:center;padding:40px 24px;max-width:420px;">
    <div style="font-size:48px;margin-bottom:16px;">${success ? '✅' : '❌'}</div>
    <h1 style="color:${color};font-size:22px;margin:0 0 12px;">${title}</h1>
    <p style="color:#999;font-size:14px;margin:0 0 24px;">${description}</p>
    <a href="javascript:window.close()" style="color:#555;font-size:12px;text-decoration:none;">Close this window</a>
  </div>
</body>
</html>`;
}

export default router;
