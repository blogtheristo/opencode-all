/**
 * Firehorse Omnichannel Next Pilot - API Routes
 * CustomerPilotLoop v1
 */

import crypto from 'node:crypto';
import { type NextFunction, type Request, type Response, Router } from 'express';
import {
  handleEmailOpened,
  handleEmailReply,
  handleLinkClicked,
  handleMeetingBooked,
} from './state-machine';
import { scheduler } from './scheduler';
import { db } from './database';
import { LeadCountry } from './types';
import { FirehorseReportModule } from './report-module';
import { reportScheduler } from './report-scheduler';
import { FirehorseWorkflowEngine } from './workflow-engine';
import * as linkedinPending from './linkedin-pending.js';
import logger from '../utils/logger.js';

const router = Router();

function requireAdminJobsKey(req: Request, res: Response, next: NextFunction): void {
  const adminKey = process.env.ADMIN_API_KEY;
  const provided = req.headers['x-admin-key'];

  if (!adminKey) {
    res.status(503).json({ error: 'Report jobs trigger not configured' });
    return;
  }
  if (!provided || typeof provided !== 'string') {
    logger.warn('Firehorse jobs trigger: missing admin key', { ip: req.ip });
    res.status(401).json({ error: 'Invalid or missing X-Admin-Key header' });
    return;
  }

  const providedBuffer = Buffer.from(provided.padEnd(256, '\0'));
  const expectedBuffer = Buffer.from(adminKey.padEnd(256, '\0'));
  if (!crypto.timingSafeEqual(providedBuffer, expectedBuffer)) {
    logger.warn('Firehorse jobs trigger: invalid admin key', { ip: req.ip });
    res.status(401).json({ error: 'Invalid or missing X-Admin-Key header' });
    return;
  }

  next();
}

// ============================================================================
// WEBHOOK ENDPOINTS (for email service integrations)
// ============================================================================

/**
 * Email opened webhook
 * POST /firehorse/webhooks/email-opened
 */
router.post('/webhooks/email-opened', async (req: Request, res: Response) => {
  try {
    const { lead_id, email, opened_at } = req.body;

    if (!lead_id || !email) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    await handleEmailOpened({
      lead_id,
      email,
      opened_at: opened_at ? new Date(opened_at) : new Date(),
    });

    return res.json({ success: true });
  } catch (error) {
    console.error('Error handling email opened:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Link clicked webhook
 * POST /firehorse/webhooks/link-clicked
 */
router.post('/webhooks/link-clicked', async (req: Request, res: Response) => {
  try {
    const { lead_id, email, link_url, clicked_at } = req.body;

    if (!lead_id || !email || !link_url) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    await handleLinkClicked({
      lead_id,
      email,
      link_url,
      clicked_at: clicked_at ? new Date(clicked_at) : new Date(),
    });

    return res.json({ success: true });
  } catch (error) {
    console.error('Error handling link clicked:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Email reply webhook
 * POST /firehorse/webhooks/email-reply
 */
router.post('/webhooks/email-reply', async (req: Request, res: Response) => {
  try {
    const { lead_id, email, reply_text, replied_at } = req.body;

    if (!lead_id || !email || !reply_text) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    await handleEmailReply({
      lead_id,
      email,
      reply_text,
      replied_at: replied_at ? new Date(replied_at) : new Date(),
    });

    return res.json({ success: true });
  } catch (error) {
    console.error('Error handling email reply:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Meeting booked webhook
 * POST /firehorse/webhooks/meeting-booked
 */
router.post('/webhooks/meeting-booked', async (req: Request, res: Response) => {
  try {
    const { lead_id, email, meeting_time, booked_at } = req.body;

    if (!lead_id || !email) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    await handleMeetingBooked({
      lead_id,
      email,
      meeting_time: meeting_time ? new Date(meeting_time) : undefined,
      booked_at: booked_at ? new Date(booked_at) : new Date(),
    });

    return res.json({ success: true });
  } catch (error) {
    console.error('Error handling meeting booked:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// ============================================================================
// MANUAL TRIGGER ENDPOINTS (for testing and manual operations)
// ============================================================================

/**
 * Manually trigger daily new leads job
 * POST /firehorse/jobs/daily
 */
router.post('/jobs/daily', async (_req: Request, res: Response) => {
  try {
    await scheduler.runManually('daily');
    return res.json({ success: true, message: 'Daily job completed' });
  } catch (error) {
    console.error('Error running daily job:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Manually trigger Cold 2 follow-up job
 * POST /firehorse/jobs/cold2
 */
router.post('/jobs/cold2', async (_req: Request, res: Response) => {
  try {
    await scheduler.runManually('cold2');
    return res.json({ success: true, message: 'Cold 2 job completed' });
  } catch (error) {
    console.error('Error running Cold 2 job:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Manually trigger Cold 3 follow-up job
 * POST /firehorse/jobs/cold3
 */
router.post('/jobs/cold3', async (_req: Request, res: Response) => {
  try {
    await scheduler.runManually('cold3');
    return res.json({ success: true, message: 'Cold 3 job completed' });
  } catch (error) {
    console.error('Error running Cold 3 job:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// ============================================================================
// LEAD MANAGEMENT ENDPOINTS
// ============================================================================

/**
 * Create new lead
 * POST /firehorse/leads
 */
router.post('/leads', async (req: Request, res: Response) => {
  try {
    const {
      email,
      first_name,
      last_name,
      company,
      title,
      country,
      segment = 'Infra/Construction',
    } = req.body;

    if (!email || !country) {
      return res.status(400).json({ error: 'Missing required fields: email, country' });
    }

    // Validate country
    if (!Object.values(LeadCountry).includes(country)) {
      return res.status(400).json({ error: 'Invalid country. Must be FI, SE, NO, or DK' });
    }

    // Create lead in database
    const { data, error } = await (db as any).supabase
      .from('firehorse_leads')
      .insert({
        email,
        first_name,
        last_name,
        company,
        title,
        country,
        segment,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating lead:', error);
      return res.status(500).json({ error: 'Failed to create lead' });
    }

    return res.json({ success: true, lead: data });
  } catch (error) {
    console.error('Error creating lead:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Get lead by ID
 * GET /firehorse/leads/:id
 */
router.get('/leads/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const lead = await db.getLeadById(id);

    if (!lead) {
      return res.status(404).json({ error: 'Lead not found' });
    }

    return res.json({ success: true, lead });
  } catch (error) {
    console.error('Error fetching lead:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Get lead events
 * GET /firehorse/leads/:id/events
 */
router.get('/leads/:id/events', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const { data, error } = await (db as any).supabase
      .from('firehorse_events')
      .select('*')
      .eq('lead_id', id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching events:', error);
      return res.status(500).json({ error: 'Failed to fetch events' });
    }

    return res.json({ success: true, events: data });
  } catch (error) {
    console.error('Error fetching events:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Get lead tasks
 * GET /firehorse/leads/:id/tasks
 */
router.get('/leads/:id/tasks', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const { data, error } = await (db as any).supabase
      .from('firehorse_tasks')
      .select('*')
      .eq('lead_id', id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching tasks:', error);
      return res.status(500).json({ error: 'Failed to fetch tasks' });
    }

    return res.json({ success: true, tasks: data });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// ============================================================================
// SIGNAL-BASED SALES AUTOMATION
// ============================================================================

/**
 * Get pending signals (ULTRA + HIGH correlation)
 * GET /firehorse/signals/pending
 */
router.get('/signals/pending', async (_req: Request, res: Response) => {
  try {
    const { data, error } = await (db as any).supabase
      .from('firehorse_signals_pending_approval')
      .select('*')
      .limit(50);

    if (error) {
      console.error('Error fetching pending signals:', error);
      return res.status(500).json({
        error: 'Failed to fetch signals',
        message: error.message,
      });
    }

    return res.json({
      signals: data || [],
      count: data?.length || 0,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Unexpected error in /signals/pending:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message,
    });
  }
});

/**
 * Approve a signal for sending
 * POST /firehorse/signals/:id/approve
 */
router.post('/signals/:id/approve', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { message_final } = req.body; // Optional: human-edited message

  try {
    const { data, error } = await (db as any).supabase
      .from('firehorse_signals')
      .update({
        status: 'approved',
        message_final: message_final || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error(`Error approving signal ${id}:`, error);
      return res.status(500).json({
        error: 'Failed to approve signal',
        message: error.message,
      });
    }

    console.log(`✅ Signal approved: ${id} - ${data.company_name}`);

    return res.json({
      success: true,
      signal: data,
      message: 'Signal approved',
    });
  } catch (error: any) {
    console.error('Unexpected error in /signals/:id/approve:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message,
    });
  }
});

/**
 * Reject a signal (not relevant)
 * POST /firehorse/signals/:id/reject
 */
router.post('/signals/:id/reject', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const { data, error } = await (db as any).supabase
      .from('firehorse_signals')
      .update({
        status: 'rejected',
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error(`Error rejecting signal ${id}:`, error);
      return res.status(500).json({
        error: 'Failed to reject signal',
        message: error.message,
      });
    }

    console.log(`❌ Signal rejected: ${id} - ${data.company_name}`);

    return res.json({
      success: true,
      signal: data,
      message: 'Signal rejected',
    });
  } catch (error: any) {
    console.error('Unexpected error in /signals/:id/reject:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message,
    });
  }
});

/**
 * Get signal collection statistics
 * GET /firehorse/signals/stats
 */
router.get('/signals/stats', async (_req: Request, res: Response) => {
  try {
    const { data, error } = await (db as any).supabase
      .from('firehorse_signals_metrics')
      .select('*')
      .limit(4); // Last 4 weeks

    if (error) {
      console.error('Error fetching signal stats:', error);
      return res.status(500).json({
        error: 'Failed to fetch stats',
        message: error.message,
      });
    }

    return res.json({
      stats: data || [],
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Unexpected error in /signals/stats:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error.message,
    });
  }
});

// ============================================================================
// REPORT MODULE
// ============================================================================

/**
 * Generate a report (Board Pack, Annual Report, Compliance Summary, Carbon Footprint)
 * POST /firehorse/reports/generate
 */
router.post('/reports/generate', async (req: Request, res: Response) => {
  try {
    const { organizationId, format, periodStart, periodEnd, industry, options } = req.body;

    if (!organizationId || !format || !periodStart || !periodEnd || !industry) {
      return res.status(400).json({
        error: 'Missing required fields: organizationId, format, periodStart, periodEnd, industry',
      });
    }

    const validFormats = ['board-pack', 'annual-report', 'compliance-summary', 'carbon-footprint'];
    if (!validFormats.includes(format)) {
      return res
        .status(400)
        .json({ error: `Invalid format. Must be one of: ${validFormats.join(', ')}` });
    }

    const report = await FirehorseReportModule.generate({
      organizationId,
      format,
      periodStart,
      periodEnd,
      industry,
      options,
    });

    return res.json({ success: true, report });
  } catch (error: any) {
    console.error('Error generating report:', error);
    return res.status(500).json({ error: 'Report generation failed', message: error.message });
  }
});

/**
 * Get report as markdown (for PDF conversion / download)
 * POST /firehorse/reports/markdown
 */
router.post('/reports/markdown', async (req: Request, res: Response) => {
  try {
    const { organizationId, format, periodStart, periodEnd, industry, options } = req.body;

    if (!organizationId || !format || !periodStart || !periodEnd || !industry) {
      return res.status(400).json({
        error: 'Missing required fields: organizationId, format, periodStart, periodEnd, industry',
      });
    }

    const report = await FirehorseReportModule.generate({
      organizationId,
      format,
      periodStart,
      periodEnd,
      industry,
      options,
    });

    const markdown = FirehorseReportModule.toMarkdown(report);

    return res.type('text/markdown').send(markdown);
  } catch (error: any) {
    console.error('Error generating markdown report:', error);
    return res.status(500).json({ error: 'Report generation failed', message: error.message });
  }
});

/**
 * Manually trigger scheduled report processing (runs all due schedules immediately)
 * POST /firehorse/jobs/reports-run
 */
router.post('/jobs/reports-run', requireAdminJobsKey, async (_req: Request, res: Response) => {
  try {
    await reportScheduler.runNow();
    return res.json({ success: true, message: 'Scheduled report processing completed' });
  } catch (error: unknown) {
    logger.error('Error running scheduled reports', {
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    return res.status(500).json({ error: 'Scheduled report run failed' });
  }
});

/**
 * List previously generated reports
 * GET /firehorse/reports?organizationId=xxx
 */
router.get('/reports', async (req: Request, res: Response) => {
  try {
    const organizationId = req.query.organizationId as string;

    if (!organizationId) {
      return res.status(400).json({ error: 'organizationId query parameter required' });
    }

    const reports = await FirehorseReportModule.listReports(organizationId);
    return res.json({ success: true, reports, count: reports.length });
  } catch (error: any) {
    console.error('Error listing reports:', error);
    return res.status(500).json({ error: 'Failed to list reports', message: error.message });
  }
});

// ============================================================================
// WORKFLOW ENGINE (Firehorse Automation)
// ============================================================================

/**
 * List workflow templates
 * GET /firehorse/workflows/templates
 */
router.get('/workflows/templates', (_req: Request, res: Response) => {
  const templates = FirehorseWorkflowEngine.listTemplates();
  res.json({ success: true, templates });
});

/**
 * Create a workflow (from template or custom)
 * POST /firehorse/workflows
 */
router.post('/workflows', async (req: Request, res: Response) => {
  try {
    const { templateId, definition, createdBy } = req.body;

    if (!templateId && !definition) {
      return res.status(400).json({ error: 'Either templateId or definition is required' });
    }

    const workflow = await FirehorseWorkflowEngine.createWorkflow(
      templateId || null,
      definition || null,
      createdBy || 'api',
    );

    return res.json({ success: true, workflow });
  } catch (error: any) {
    console.error('Error creating workflow:', error);
    return res.status(500).json({ error: 'Failed to create workflow', message: error.message });
  }
});

/**
 * Execute a workflow
 * POST /firehorse/workflows/:id/execute
 */
router.post('/workflows/:id/execute', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { input } = req.body;

    const execution = await FirehorseWorkflowEngine.execute(id, input || {});
    return res.json({ success: true, execution });
  } catch (error: any) {
    console.error('Error executing workflow:', error);
    return res.status(500).json({ error: 'Workflow execution failed', message: error.message });
  }
});

/**
 * List workflow executions
 * GET /firehorse/workflows/executions?workflowId=xxx
 */
router.get('/workflows/executions', async (req: Request, res: Response) => {
  try {
    const workflowId = req.query.workflowId as string | undefined;
    const executions = await FirehorseWorkflowEngine.listExecutions(workflowId);
    return res.json({ success: true, executions, count: executions.length });
  } catch (error: any) {
    console.error('Error listing executions:', error);
    return res.status(500).json({ error: 'Failed to list executions', message: error.message });
  }
});

// ============================================================================
// HEALTH CHECK
// ============================================================================

// ============================================================================
// LINKEDIN PENDING QUEUE (V1: stubbed LinkedIn + human queue per CLAUDE.md)
// ============================================================================

/**
 * GET /firehorse/linkedin/pending  — list queued drafts awaiting manual send
 * Query: ?status=pending|sent|dismissed|all (default: pending)
 *
 * Returns 400 for any other status value or for an array (e.g., ?status=a&status=b).
 */
const LINKEDIN_PENDING_LIST_STATUSES = ['pending', 'sent', 'dismissed', 'all'] as const;
type LinkedInPendingListStatus = (typeof LINKEDIN_PENDING_LIST_STATUSES)[number];

router.get('/linkedin/pending', async (req: Request, res: Response) => {
  const raw = req.query.status;
  if (Array.isArray(raw)) {
    return res.status(400).json({
      error: 'status must be a single value',
      allowed: LINKEDIN_PENDING_LIST_STATUSES,
    });
  }
  const status: string = typeof raw === 'string' && raw.length > 0 ? raw : 'pending';
  if (!LINKEDIN_PENDING_LIST_STATUSES.includes(status as LinkedInPendingListStatus)) {
    return res.status(400).json({
      error: `Invalid status '${status}'`,
      allowed: LINKEDIN_PENDING_LIST_STATUSES,
    });
  }
  try {
    const all = await linkedinPending.listAll();
    const entries = status === 'all' ? all : all.filter((e) => e.status === status);
    const queueStats = await linkedinPending.stats();
    return res.json({ success: true, entries, count: entries.length, stats: queueStats });
  } catch (err) {
    if (err instanceof linkedinPending.LinkedInPendingIOError) {
      logger.error('linkedin-pending list failed', { error: err.message });
      return res.status(503).json({ error: 'Queue temporarily unavailable' });
    }
    throw err;
  }
});

/**
 * GET /firehorse/linkedin/pending/:id  — fetch one
 */
router.get('/linkedin/pending/:id', async (req: Request, res: Response) => {
  try {
    const entry = await linkedinPending.getEntry(req.params.id);
    if (!entry) return res.status(404).json({ error: 'Not found' });
    return res.json({ success: true, entry });
  } catch (err) {
    if (err instanceof linkedinPending.LinkedInPendingIOError) {
      logger.error('linkedin-pending get failed', { error: err.message });
      return res.status(503).json({ error: 'Queue temporarily unavailable' });
    }
    throw err;
  }
});

// Validate an optional `acted_by` field on a request body.
// Returns the trimmed string when valid, undefined when absent, or null when invalid.
function validateActedBy(body: unknown): string | undefined | null {
  if (body === undefined || body === null) return undefined;
  if (typeof body !== 'object') return null;
  const raw = (body as Record<string, unknown>).acted_by;
  if (raw === undefined || raw === null) return undefined;
  if (typeof raw !== 'string') return null;
  const trimmed = raw.trim();
  if (trimmed.length === 0 || trimmed.length > 200) return null;
  return trimmed;
}

/**
 * POST /firehorse/linkedin/pending/:id/sent  — ack that a human sent it manually
 * Body: { acted_by?: string }
 */
router.post('/linkedin/pending/:id/sent', async (req: Request, res: Response) => {
  const actedBy = validateActedBy(req.body);
  if (actedBy === null) {
    return res.status(400).json({ error: 'acted_by must be a string (1-200 chars)' });
  }
  try {
    const updated = await linkedinPending.markSent(req.params.id, actedBy);
    if (!updated) return res.status(404).json({ error: 'Not found' });
    if (updated.status !== 'sent') {
      return res.status(409).json({ error: `Cannot mark ${updated.status} entry as sent` });
    }
    return res.json({ success: true, entry: updated });
  } catch (err) {
    if (err instanceof linkedinPending.LinkedInPendingIOError) {
      logger.error('linkedin-pending mark-sent failed', { error: err.message });
      return res.status(503).json({ error: 'Queue temporarily unavailable' });
    }
    throw err;
  }
});

/**
 * POST /firehorse/linkedin/pending/:id/dismiss  — remove without sending
 * Body: { reason: string, acted_by?: string }
 */
router.post('/linkedin/pending/:id/dismiss', async (req: Request, res: Response) => {
  if (!req.body || typeof req.body !== 'object') {
    return res.status(400).json({ error: 'Request body must be a JSON object' });
  }
  const rawReason = (req.body as Record<string, unknown>).reason;
  if (typeof rawReason !== 'string') {
    return res.status(400).json({ error: 'reason is required and must be a string' });
  }
  const reason = rawReason.trim();
  if (reason.length === 0 || reason.length > 500) {
    return res.status(400).json({ error: 'reason must be 1-500 characters' });
  }
  const actedBy = validateActedBy(req.body);
  if (actedBy === null) {
    return res.status(400).json({ error: 'acted_by must be a string (1-200 chars)' });
  }
  try {
    const updated = await linkedinPending.dismiss(req.params.id, reason, actedBy);
    if (!updated) return res.status(404).json({ error: 'Not found' });
    if (updated.status !== 'dismissed') {
      return res.status(409).json({ error: `Cannot dismiss ${updated.status} entry` });
    }
    return res.json({ success: true, entry: updated });
  } catch (err) {
    if (err instanceof linkedinPending.LinkedInPendingIOError) {
      logger.error('linkedin-pending dismiss failed', { error: err.message });
      return res.status(503).json({ error: 'Queue temporarily unavailable' });
    }
    throw err;
  }
});

router.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'firehorse-pilot' });
});

export default router;
