/**
 * Outreach Inbound Intake API
 *
 * POST /api/v1/outreach/inbound — Accept leads from any source
 *
 * Auth: shared secret via X-Outreach-Key header.
 * Set OUTREACH_INBOUND_KEY in .env. No key = endpoint disabled.
 *
 * Accepts: org_domain, linkedin_url (or email), pipeline, source, notes
 * Creates: org (upsert by domain), person (upsert by linkedin_url), thread, initial activity
 */

import express, { type Request, type Response, type Router } from 'express';
import { body, validationResult } from 'express-validator';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import logger from '../utils/logger.js';

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
// AUTH MIDDLEWARE — shared secret
// ============================================================================

function requireOutreachKey(req: Request, res: Response, next: () => void): void {
  const configuredKey = process.env.OUTREACH_INBOUND_KEY;

  if (!configuredKey) {
    res.status(503).json({ error: 'Inbound intake not configured. Set OUTREACH_INBOUND_KEY.' });
    return;
  }

  const providedKey = req.headers['x-outreach-key'] as string;

  if (!providedKey || providedKey !== configuredKey) {
    logger.warn('Outreach inbound: invalid key', { ip: req.ip });
    res.status(401).json({ error: 'Invalid or missing X-Outreach-Key header' });
    return;
  }

  next();
}

// ============================================================================
// VALIDATION
// ============================================================================

const inboundValidation = [
  body('first_name').isString().trim().isLength({ min: 1, max: 100 }),
  body('last_name').optional().isString().trim().isLength({ max: 100 }),
  body('org_name').optional().isString().trim().isLength({ max: 255 }),
  body('org_domain').optional().isString().trim().isLength({ max: 255 }),
  body('linkedin_url').optional().isString().trim(),
  body('email').optional().isEmail().normalizeEmail(),
  body('phone').optional().isString().trim().isLength({ max: 50 }),
  body('pipeline').isIn(['investor', 'customer', 'partner']),
  body('source').optional().isIn(['boardy', 'linkedin', 'conference', 'referral', 'cold', 'inbound', 'manual']),
  body('notes').optional().isString().trim().isLength({ max: 2000 }),
  body('title').optional().isString().trim().isLength({ max: 200 }),
];

// ============================================================================
// POST /inbound — Accept a lead from any source
// ============================================================================

router.post('/inbound', requireOutreachKey, inboundValidation, async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ error: 'Validation failed', details: errors.array() });
    return;
  }

  const {
    first_name,
    last_name,
    org_name,
    org_domain,
    linkedin_url,
    email,
    phone,
    pipeline,
    source = 'inbound',
    notes,
    title,
  } = req.body;

  // Need at least linkedin_url or email to identify a real person.
  // Rule: no placeholder "team" entries — only named humans get threads.
  if (!linkedin_url && !email) {
    res.status(400).json({ error: 'Provide at least linkedin_url or email. Only named humans get threads — use outreach_orgs for org-only targets.' });
    return;
  }

  // Reject company page URLs — must be a personal LinkedIn profile
  if (linkedin_url && linkedin_url.includes('/company/')) {
    res.status(400).json({ error: 'linkedin_url must be a personal profile, not a company page. Create the org first, find the human buyer, then create a thread.' });
    return;
  }

  try {
    const db = getSupabase();
    let orgId: string | null = null;
    let personId: string;

    // 1. Upsert organization (by domain, if provided)
    if (org_domain) {
      const { data: existing, error: findErr } = await db
        .from('outreach_orgs')
        .select('id')
        .eq('domain', org_domain)
        .limit(1)
        .single();

      if (findErr && findErr.code !== 'PGRST116') {
        // PGRST116 = no rows returned — not a real error
        throw new Error(`Org lookup failed: ${findErr.message}`);
      }

      if (existing) {
        orgId = existing.id;
      } else {
        const { data: created, error: createErr } = await db
          .from('outreach_orgs')
          .insert({
            domain: org_domain,
            name: org_name || org_domain,
            source,
            created_by: 'inbound_api',
          })
          .select('id')
          .single();

        if (createErr || !created) throw new Error(`Org create failed: ${createErr?.message}`);
        orgId = created.id;
      }
    }

    // 2. Upsert person (by linkedin_url if provided, else by email match)
    const personKey = linkedin_url || `inbound:${email}`;

    if (linkedin_url) {
      const { data: existing, error: findErr } = await db
        .from('persons')
        .select('id')
        .eq('linkedin_url', linkedin_url)
        .limit(1)
        .single();

      if (findErr && findErr.code !== 'PGRST116') {
        throw new Error(`Person lookup failed: ${findErr.message}`);
      }

      if (existing) {
        personId = existing.id;
      } else {
        const { data: created, error: createErr } = await db
          .from('persons')
          .insert({
            linkedin_url: personKey,
            first_name,
            last_name: last_name || null,
            title: title || null,
            phone: phone || null,
            org_id: orgId,
            source,
            created_by: 'inbound_api',
          })
          .select('id')
          .single();

        if (createErr || !created) throw new Error(`Person create failed: ${createErr?.message}`);
        personId = created.id;
      }
    } else {
      // No linkedin_url — create new person
      const { data: created, error: createErr } = await db
        .from('persons')
        .insert({
          linkedin_url: personKey,
          first_name,
          last_name: last_name || null,
          title: title || null,
          phone: phone || null,
          org_id: orgId,
          source,
          created_by: 'inbound_api',
        })
        .select('id')
        .single();

      if (createErr || !created) throw new Error(`Person create failed: ${createErr?.message}`);
      personId = created.id;
    }

    // 3. Add email if provided (upsert — ignore duplicates)
    if (email) {
      const { error: emailErr } = await db
        .from('person_emails')
        .upsert(
          {
            person_id: personId,
            email,
            is_primary: true,
            source,
            created_by: 'inbound_api',
          },
          { onConflict: 'person_id,email', ignoreDuplicates: true },
        );

      if (emailErr) {
        logger.warn('Failed to upsert person email', { error: emailErr.message, email });
      }
    }

    // 4. Create thread (skip if duplicate)
    let threadId: string;

    let threadQuery = db
      .from('outreach_threads')
      .select('id')
      .eq('person_id', personId)
      .eq('pipeline', pipeline);

    if (orgId) {
      threadQuery = threadQuery.eq('org_id', orgId);
    }

    const { data: existingThread, error: threadFindErr } = await threadQuery.limit(1).single();

    if (threadFindErr && threadFindErr.code !== 'PGRST116') {
      throw new Error(`Thread lookup failed: ${threadFindErr.message}`);
    }

    if (existingThread) {
      threadId = existingThread.id;
      logger.info('Outreach inbound: thread already exists', { threadId, pipeline });
    } else {
      const { data: created, error: createErr } = await db
        .from('outreach_threads')
        .insert({
          person_id: personId,
          org_id: orgId,
          pipeline,
          status: 'new',
          source,
          created_by: 'inbound_api',
          next_action: notes ? `Inbound lead: ${notes}` : `New inbound lead — research and qualify`,
          next_action_type: 'research',
          next_action_date: new Date().toISOString().split('T')[0],
        })
        .select('id')
        .single();

      if (createErr || !created) throw new Error(`Thread create failed: ${createErr?.message}`);
      threadId = created.id;
    }

    // 5. Log the inbound activity
    const { error: activityErr } = await db
      .from('outreach_activities')
      .insert({
        thread_id: threadId,
        person_id: personId,
        org_id: orgId,
        pipeline,
        channel: source,
        activity_type: 'received',
        description: notes || `Inbound lead via ${source}`,
        raw_payload: req.body,
        outcome: 'positive',
        source,
        created_by: 'inbound_api',
      });

    if (activityErr) {
      logger.warn('Failed to log inbound activity', { error: activityErr.message });
    }

    logger.info('Outreach inbound: lead accepted', {
      personId,
      orgId,
      threadId,
      pipeline,
      source,
    });

    res.status(201).json({
      ok: true,
      thread_id: threadId,
      person_id: personId,
      org_id: orgId,
      pipeline,
    });
  } catch (error) {
    logger.error('Outreach inbound failed', { error: error instanceof Error ? error.message : String(error) });
    res.status(500).json({ error: 'Failed to process inbound lead' });
  }
});

export default router;
