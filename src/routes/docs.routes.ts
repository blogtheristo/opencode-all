// Evidence: Tool=Claude Code Model=claude-opus-5 Agent=Claude Code Date=2026-09-24
// Audit trail: git log -- src/routes/docs.routes.ts

import express, { type NextFunction, type Request, type Response, type Router } from 'express';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { relative, sep } from 'node:path';
import { getSupabaseClient } from '../config/supabase.js';
import logger from '../utils/logger.js';
import {
  canOpen,
  classifyDocument,
  getAuditConfig,
  grantsFor,
  highestGrant,
  resolveDocumentPath,
} from '../services/document-access.js';

/**
 * Serves Learn/, Admin/ and docs/ material to entitled users, and records every
 * open.
 *
 * This is the only place document entitlement is enforced. dws6.com is static
 * Cloudflare Pages with a client-side login, so a frontend check there is a
 * convenience, never a gate — the files must not live under the site at all.
 */

const router: Router = express.Router();
const REPO_ROOT = process.cwd();

interface DocIdentity {
  userId: string | null;
  email: string | null;
  role: string | null;
}

/** Request once requireUser has resolved the bearer token. */
type IdentifiedRequest = Request & { docIdentity?: DocIdentity };

/** Resolves the bearer token to a user plus their org role. */
async function requireUser(req: IdentifiedRequest, res: Response, next: NextFunction) {
  const db = getSupabaseClient();
  if (!db) {
    res.status(503).json({ error: 'Database not configured' });
    return;
  }

  const token = req.headers.authorization?.startsWith('Bearer ')
    ? req.headers.authorization.slice(7)
    : '';
  if (!token) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const { data: userData, error: userError } = await db.auth.getUser(token);
  if (userError || !userData?.user) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const { data: membership } = await db
    .from('organization_members')
    .select('role')
    .eq('user_id', userData.user.id)
    .eq('status', 'active')
    .maybeSingle();

  req.docIdentity = {
    userId: userData.user.id,
    email: userData.user.email ?? null,
    role: (membership as { role?: string } | null)?.role ?? null,
  };
  next();
}

/**
 * Records the open — granted or refused. A refused read is the event most worth
 * keeping, so this runs on both paths. Never throws into the request: an audit
 * backend that is down must not decide whether a document is served, but it
 * must be loud in the logs.
 */
async function recordOpen(
  req: IdentifiedRequest,
  docPath: string,
  docClass: string,
  allowed: boolean,
): Promise<void> {
  const audit = getAuditConfig();
  const identity = req.docIdentity;
  try {
    const db = getSupabaseClient();
    if (!db) return;
    await db.from(audit.table).insert({
      user_id: identity?.userId ?? null,
      action: audit.action,
      resource_type: audit.resourceType,
      details: {
        path: docPath,
        class: docClass,
        email: identity?.email ?? null,
        role: identity?.role ?? null,
      },
      ip_address: req.ip ?? null,
      user_agent: req.get('user-agent') ?? null,
      success: allowed,
    });
  } catch (err) {
    logger.error('document.open audit write failed', {
      path: docPath,
      allowed,
      error: err instanceof Error ? err.message : String(err),
    });
  }
}

router.use(requireUser);

/** What this caller may see — drives the Learn view without leaking titles. */
router.get('/me', (req: IdentifiedRequest, res: Response) => {
  const { email, role } = req.docIdentity ?? { email: null, role: null };
  res.json({
    email,
    role,
    grants: grantsFor(email, role),
    highest: highestGrant(email, role),
  });
});

/** Classification of one path, without serving it. */
router.get('/classify', (req: IdentifiedRequest, res: Response) => {
  const path = String(req.query.path ?? '');
  if (!path) {
    res.status(400).json({ error: 'path required' });
    return;
  }
  const { email, role } = req.docIdentity ?? { email: null, role: null };
  const verdict = canOpen(path, email, role);
  res.json({ path, ...verdict });
});

/**
 * Streams a document if the caller is entitled.
 *
 * A refusal returns 403 with the class, never the content and never a hint that
 * distinguishes "exists but withheld" from "missing" in a way that would let a
 * customer-view account enumerate confidential filenames.
 */
router.get('/open', async (req: IdentifiedRequest, res: Response) => {
  const requested = String(req.query.path ?? '');
  const { email, role } = req.docIdentity ?? { email: null, role: null };

  const full = resolveDocumentPath(REPO_ROOT, requested);
  if (!full) {
    res.status(400).json({ error: 'Invalid path' });
    return;
  }

  // Classify the path that will be read, not the raw query string.
  const docPath = relative(REPO_ROOT, full).split(sep).join('/');
  const { allowed, class: docClass } = canOpen(docPath, email, role);

  if (!allowed) {
    await recordOpen(req, docPath, docClass, false);
    res.status(403).json({ error: 'Forbidden', class: docClass });
    return;
  }

  if (!existsSync(full) || !statSync(full).isFile()) {
    res.status(404).json({ error: 'Not found' });
    return;
  }

  await recordOpen(req, docPath, docClass, true);

  const isHtml = full.toLowerCase().endsWith('.html');
  res.type(isHtml ? 'text/html' : 'text/markdown');
  // Rendered documents are content, not app code: no scripts, opaque origin.
  if (isHtml) res.setHeader('Content-Security-Policy', 'sandbox');
  res.setHeader('X-Document-Class', docClass);
  res.send(readFileSync(full, 'utf8'));
});

export { classifyDocument };
export default router;
