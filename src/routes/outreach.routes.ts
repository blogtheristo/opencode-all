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

import express, { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import logger from '../utils/logger.js';

const router: Router = express.Router();

// ============================================================================
// SUPABASE HELPERS (same pattern as daily-digest.ts)
// ============================================================================

async function supabaseFetch(path: string, options: RequestInit = {}): Promise<any> {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;

  if (!url || !key) {
    throw new Error('SUPABASE_URL and SUPABASE_SERVICE_KEY required');
  }

  const response = await fetch(`${url}/rest/v1/${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      apikey: key,
      Authorization: `Bearer ${key}`,
      Prefer: 'return=representation',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Supabase ${response.status}: ${body}`);
  }

  return response.json();
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
    let orgId: string | null = null;
    let personId: string;

    // 1. Upsert organization (by domain, if provided)
    if (org_domain) {
      const existing = await supabaseFetch(
        `outreach_orgs?domain=eq.${encodeURIComponent(org_domain)}&select=id&limit=1`
      );

      if (existing.length > 0) {
        orgId = existing[0].id;
      } else {
        const created = await supabaseFetch('outreach_orgs', {
          method: 'POST',
          body: JSON.stringify({
            domain: org_domain,
            name: org_name || org_domain,
            source,
            created_by: 'inbound_api',
          }),
        });
        orgId = created[0].id;
      }
    }

    // 2. Upsert person (by linkedin_url if provided, else by email match)
    const personKey = linkedin_url || `inbound:${email}`;
    const existingPerson = linkedin_url
      ? await supabaseFetch(
          `persons?linkedin_url=eq.${encodeURIComponent(linkedin_url)}&select=id&limit=1`
        )
      : [];

    if (existingPerson.length > 0) {
      personId = existingPerson[0].id;
    } else {
      const created = await supabaseFetch('persons', {
        method: 'POST',
        body: JSON.stringify({
          linkedin_url: personKey,
          first_name,
          last_name: last_name || null,
          title: title || null,
          org_id: orgId,
          source,
          created_by: 'inbound_api',
        }),
      });
      personId = created[0].id;
    }

    // 3. Add email if provided
    if (email) {
      await supabaseFetch('person_emails', {
        method: 'POST',
        headers: { Prefer: 'resolution=ignore-duplicates,return=representation' },
        body: JSON.stringify({
          person_id: personId,
          email,
          is_primary: true,
          source,
          created_by: 'inbound_api',
        }),
      });
    }

    // 4. Create thread (skip if duplicate)
    let threadId: string;
    const existingThread = await supabaseFetch(
      `outreach_threads?person_id=eq.${personId}&pipeline=eq.${pipeline}${orgId ? `&org_id=eq.${orgId}` : ''}&select=id&limit=1`
    );

    if (existingThread.length > 0) {
      threadId = existingThread[0].id;
      logger.info('Outreach inbound: thread already exists', { threadId, pipeline });
    } else {
      const created = await supabaseFetch('outreach_threads', {
        method: 'POST',
        body: JSON.stringify({
          person_id: personId,
          org_id: orgId,
          pipeline,
          status: 'new',
          source,
          created_by: 'inbound_api',
          next_action: notes ? `Inbound lead: ${notes}` : `New inbound lead — research and qualify`,
          next_action_type: 'research',
          next_action_date: new Date().toISOString().split('T')[0],
        }),
      });
      threadId = created[0].id;
    }

    // 5. Log the inbound activity
    await supabaseFetch('outreach_activities', {
      method: 'POST',
      body: JSON.stringify({
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
      }),
    });

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
  } catch (error: any) {
    logger.error('Outreach inbound failed', { error: error.message });
    res.status(500).json({ error: 'Failed to process inbound lead' });
  }
});

export default router;
