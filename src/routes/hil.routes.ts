/**
 * HIL (Human-in-the-Loop) Routes
 *
 * GET /api/hil/done/:token
 *   Called when Risto clicks the ✅ Done button in the morning briefing email.
 *   Marks the hil_todo row as done and returns a confirmation page.
 *   No authentication needed — done_token is a UUID unguessable without the email.
 */

import { type Request, type Response, Router } from 'express';
import { sendEmail } from '../utils/send-email.js';
import logger from '../utils/logger.js';

const router = Router();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

router.get('/done/:token', async (req: Request, res: Response): Promise<void> => {
  const { token } = req.params;

  // Basic UUID shape check to prevent path traversal / injection
  if (!/^[0-9a-f-]{36}$/i.test(token)) {
    res.status(400).send('<p>Invalid token.</p>');
    return;
  }

  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    res.status(503).send('<p>Supabase not configured.</p>');
    return;
  }

  // Fetch the todo to get its description for the confirmation page
  let description = 'Task';
  try {
    const fetchResp = await fetch(
      `${SUPABASE_URL}/rest/v1/hil_todos?done_token=eq.${encodeURIComponent(token)}&select=id,description,done_at&limit=1`,
      {
        headers: {
          apikey: SUPABASE_SERVICE_KEY,
          Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
        },
      }
    );
    if (fetchResp.ok) {
      const rows = (await fetchResp.json()) as Array<{ id: string; description: string; done_at: string | null }>;
      if (rows.length === 0) {
        res.status(404).send(confirmPage('Not found', 'This task does not exist or has already been removed.', false));
        return;
      }
      const row = rows[0];
      description = row.description;
      if (row.done_at) {
        // Already done — show success without re-writing
        res.send(confirmPage('Already done ✅', description, true));
        return;
      }
    }
  } catch {
    // continue — still attempt the update
  }

  // Mark done
  try {
    const patchResp = await fetch(
      `${SUPABASE_URL}/rest/v1/hil_todos?done_token=eq.${encodeURIComponent(token)}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          apikey: SUPABASE_SERVICE_KEY,
          Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
          Prefer: 'return=minimal',
        },
        body: JSON.stringify({ done_at: new Date().toISOString() }),
      }
    );

    if (patchResp.ok || patchResp.status === 204) {
      res.send(confirmPage('Done ✅', description, true));
    } else {
      res.status(500).send(confirmPage('Error', 'Could not mark task done — please try again.', false));
    }
  } catch {
    res.status(500).send(confirmPage('Error', 'Network error — please try again.', false));
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

  // Persist to Supabase if available
  if (SUPABASE_URL && SUPABASE_SERVICE_KEY) {
    try {
      await fetch(`${SUPABASE_URL}/rest/v1/hil_escalations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: SUPABASE_SERVICE_KEY,
          Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
          Prefer: 'return=minimal',
        },
        body: JSON.stringify(escalation),
      });
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
