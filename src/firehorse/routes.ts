/**
 * Firehorse Omnichannel Next Pilot - API Routes
 * CustomerPilotLoop v1
 */

import { Router, Request, Response } from 'express';
import {
  handleEmailOpened,
  handleLinkClicked,
  handleEmailReply,
  handleMeetingBooked,
} from './state-machine';
import { scheduler } from './scheduler';
import { db } from './database';
import { LeadCountry } from './types';

const router = Router();

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

    res.json({ success: true });
  } catch (error) {
    console.error('Error handling email opened:', error);
    res.status(500).json({ error: 'Internal server error' });
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

    res.json({ success: true });
  } catch (error) {
    console.error('Error handling link clicked:', error);
    res.status(500).json({ error: 'Internal server error' });
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

    res.json({ success: true });
  } catch (error) {
    console.error('Error handling email reply:', error);
    res.status(500).json({ error: 'Internal server error' });
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

    res.json({ success: true });
  } catch (error) {
    console.error('Error handling meeting booked:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ============================================================================
// MANUAL TRIGGER ENDPOINTS (for testing and manual operations)
// ============================================================================

/**
 * Manually trigger daily new leads job
 * POST /firehorse/jobs/daily
 */
router.post('/jobs/daily', async (req: Request, res: Response) => {
  try {
    await scheduler.runManually('daily');
    res.json({ success: true, message: 'Daily job completed' });
  } catch (error) {
    console.error('Error running daily job:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Manually trigger Cold 2 follow-up job
 * POST /firehorse/jobs/cold2
 */
router.post('/jobs/cold2', async (req: Request, res: Response) => {
  try {
    await scheduler.runManually('cold2');
    res.json({ success: true, message: 'Cold 2 job completed' });
  } catch (error) {
    console.error('Error running Cold 2 job:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * Manually trigger Cold 3 follow-up job
 * POST /firehorse/jobs/cold3
 */
router.post('/jobs/cold3', async (req: Request, res: Response) => {
  try {
    await scheduler.runManually('cold3');
    res.json({ success: true, message: 'Cold 3 job completed' });
  } catch (error) {
    console.error('Error running Cold 3 job:', error);
    res.status(500).json({ error: 'Internal server error' });
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

    res.json({ success: true, lead: data });
  } catch (error) {
    console.error('Error creating lead:', error);
    res.status(500).json({ error: 'Internal server error' });
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

    res.json({ success: true, lead });
  } catch (error) {
    console.error('Error fetching lead:', error);
    res.status(500).json({ error: 'Internal server error' });
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

    res.json({ success: true, events: data });
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Internal server error' });
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

    res.json({ success: true, tasks: data });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ============================================================================
// SIGNAL-BASED SALES AUTOMATION
// ============================================================================

/**
 * Get pending signals (ULTRA + HIGH correlation)
 * GET /firehorse/signals/pending
 */
router.get('/signals/pending', async (req: Request, res: Response) => {
  try {
    const { data, error } = await (db as any).supabase
      .from('firehorse_signals_pending_approval')
      .select('*')
      .limit(50);

    if (error) {
      console.error('Error fetching pending signals:', error);
      return res.status(500).json({
        error: 'Failed to fetch signals',
        message: error.message
      });
    }

    res.json({
      signals: data || [],
      count: data?.length || 0,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('Unexpected error in /signals/pending:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
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
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error(`Error approving signal ${id}:`, error);
      return res.status(500).json({
        error: 'Failed to approve signal',
        message: error.message
      });
    }

    console.log(`✅ Signal approved: ${id} - ${data.company_name}`);

    res.json({
      success: true,
      signal: data,
      message: 'Signal approved'
    });

  } catch (error: any) {
    console.error('Unexpected error in /signals/:id/approve:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
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
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error(`Error rejecting signal ${id}:`, error);
      return res.status(500).json({
        error: 'Failed to reject signal',
        message: error.message
      });
    }

    console.log(`❌ Signal rejected: ${id} - ${data.company_name}`);

    res.json({
      success: true,
      signal: data,
      message: 'Signal rejected'
    });

  } catch (error: any) {
    console.error('Unexpected error in /signals/:id/reject:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

/**
 * Get signal collection statistics
 * GET /firehorse/signals/stats
 */
router.get('/signals/stats', async (req: Request, res: Response) => {
  try {
    const { data, error } = await (db as any).supabase
      .from('firehorse_signals_metrics')
      .select('*')
      .limit(4); // Last 4 weeks

    if (error) {
      console.error('Error fetching signal stats:', error);
      return res.status(500).json({
        error: 'Failed to fetch stats',
        message: error.message
      });
    }

    res.json({
      stats: data || [],
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('Unexpected error in /signals/stats:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

// ============================================================================
// HEALTH CHECK
// ============================================================================

router.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'firehorse-pilot' });
});

export default router;
