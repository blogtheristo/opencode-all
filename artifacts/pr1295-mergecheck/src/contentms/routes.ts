/**
 * Firehorse ContentMS — Express API Routes (Evidence Vault)
 *
 * Customer-facing REST API for the Evidence Vault.
 * Mounted at /api/v1/content in app.ts.
 *
 * Uses the repo-standard validate() middleware + next(err) pattern
 * so errors flow through the centralized errorHandler (AppError).
 *
 * Code-Version: 3.1.0
 * Introduced-In: PR-TBD (ContentMS V3 — Memory + HIL + Artifacts)
 * Branch: claude/build-contentms-mvp-Q2nU9
 * Date: 2026-03-23
 * Owner: Claude Code (Opus 4.6)
 */

import crypto from 'node:crypto';
import { type NextFunction, type Request, type Response, Router } from 'express';
import { z } from 'zod';
import { Errors } from '../middleware/error-handler.js';
import { validate } from '../middleware/validate.js';
import {
  createContent,
  createShareLink,
  getContent,
  getContentStats,
  getExpiringCertificates,
  getPublishedLearning,
  getSharedContent,
  listContent,
  searchContent,
  transitionStatus,
  updateContent,
} from './service.js';
import { publishLearningArticle } from './blog-publisher.js';
import { publishArtifact } from './artifact-publisher.js';
import { distributeContent } from './omnichannel.js';
import { generateDigest, sendDigestEmail } from './digest.js';
import {
  approveHilReview,
  getAuditStats,
  getAuditTrail,
  getPendingReviews,
  isHilApproved,
  rejectHilReview,
  requestHilReview,
} from './audit.js';
import {
  ArtifactType,
  ContentFilterSchema,
  ContentStatus,
  CreateContentSchema,
  DigestRequestSchema,
  OmnichannelTarget,
  ShareLinkRequestSchema,
  UpdateContentSchema,
} from './types.js';

const router = Router();

// ============================================================================
// ADMIN KEY GUARD — timing-safe comparison (matches app.ts pattern)
// ============================================================================

function requireAdminKey(req: Request, _res: Response, next: NextFunction): void {
  const adminKey = process.env.ADMIN_API_KEY;
  const provided = req.headers['x-admin-key'];

  if (!adminKey) {
    next(Errors.unauthorized());
    return;
  }
  if (!provided || typeof provided !== 'string') {
    next(Errors.unauthorized());
    return;
  }

  const providedBuffer = Buffer.from(provided.padEnd(256, '\0'));
  const expectedBuffer = Buffer.from(adminKey.padEnd(256, '\0'));
  if (!crypto.timingSafeEqual(providedBuffer, expectedBuffer)) {
    next(Errors.unauthorized());
    return;
  }

  next();
}

// ============================================================================
// VALIDATION SCHEMAS (route-specific, not in types.ts)
// ============================================================================

const OrgIdQuerySchema = z.object({
  organization_id: z.string().min(1, 'organization_id is required'),
});

const SearchQuerySchema = z.object({
  q: z.string().min(1, 'Search query (q) is required'),
  organization_id: z.string().min(1, 'organization_id is required'),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

const ExpiringQuerySchema = z.object({
  organization_id: z.string().min(1, 'organization_id is required'),
  days: z.coerce.number().int().min(1).max(365).default(30),
});

const LearningQuerySchema = z.object({
  organization_id: z.string().min(1, 'organization_id is required'),
  language: z.string().default('en'),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});

const StatusTransitionSchema = z.object({
  status: z.nativeEnum(ContentStatus, {
    error: `Invalid status. Valid: ${Object.values(ContentStatus).join(', ')}`,
  }),
});

const HilReviewerSchema = z.object({
  reviewer_id: z.string().min(1, 'reviewer_id is required'),
  reviewer_name: z.string().min(1, 'reviewer_name is required'),
  review_notes: z.string().optional(),
});

const ArtifactPublishSchema = z.object({
  artifact_type: z.nativeEnum(ArtifactType, {
    error: `Invalid artifact_type. Valid: ${Object.values(ArtifactType).join(', ')}`,
  }),
  publisher_id: z.string().min(1, 'publisher_id is required'),
  publisher_name: z.string().min(1, 'publisher_name is required'),
});

const DistributeSchema = z.object({
  targets: z.array(z.nativeEnum(OmnichannelTarget)).min(1, 'At least one target is required'),
  distributor_id: z.string().min(1, 'distributor_id is required'),
  distributor_name: z.string().min(1, 'distributor_name is required'),
});

const DigestSendSchema = z
  .object({
    to: z.string().email('Invalid email address'),
  })
  .passthrough();

// ============================================================================
// EVIDENCE VAULT ROUTES
// ============================================================================

/**
 * GET /api/v1/content/stats
 * Evidence Vault dashboard statistics — scoped to a single organization.
 */
router.get(
  '/stats',
  validate({ query: OrgIdQuerySchema }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const stats = await getContentStats(req.query.organization_id as string);
      res.json(stats);
    } catch (err) {
      next(err);
    }
  },
);

/**
 * GET /api/v1/content/search
 * Search Agent — natural language search across the Evidence Vault.
 */
router.get(
  '/search',
  validate({ query: SearchQuerySchema }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { q, organization_id, limit } = req.query as any;
      const result = await searchContent(q, organization_id, limit);
      res.json(result);
    } catch (err) {
      next(err);
    }
  },
);

/**
 * GET /api/v1/content/expiring
 * Expiration Tracker — certificates expiring within N days.
 */
router.get(
  '/expiring',
  validate({ query: ExpiringQuerySchema }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { organization_id, days } = req.query as any;
      const items = await getExpiringCertificates(organization_id, days);
      res.json({ items, count: items.length, within_days: days });
    } catch (err) {
      next(err);
    }
  },
);

/**
 * GET /api/v1/content/learning
 * Published learning articles for customer's internal portal.
 */
router.get(
  '/learning',
  validate({ query: LearningQuerySchema }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { organization_id, language, limit } = req.query as any;
      const posts = await getPublishedLearning(organization_id, language, limit);
      res.json({ posts, count: posts.length });
    } catch (err) {
      next(err);
    }
  },
);

/**
 * GET /api/v1/content/shared/:token
 * Access Controller — access a document via secure temporary link.
 */
router.get('/shared/:token', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const item = await getSharedContent(req.params.token);
    if (!item) {
      throw Errors.notFound('Share link');
    }
    res.json(item);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/v1/content
 * List content with optional filters.
 */
router.get(
  '/',
  validate({ query: ContentFilterSchema }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const items = await listContent(req.query as any);
      res.json({ items, count: items.length });
    } catch (err) {
      next(err);
    }
  },
);

/**
 * GET /api/v1/content/:id
 * Get a single content item by ID.
 */
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const item = await getContent(req.params.id);
    if (!item) {
      throw Errors.notFound('Content');
    }
    res.json(item);
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/v1/content
 * Upload / create a new content item. Document Classifier auto-tags it.
 */
router.post(
  '/',
  validate({ body: CreateContentSchema }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const item = await createContent(req.body);
      res.status(201).json(item);
    } catch (err) {
      next(err);
    }
  },
);

/**
 * PATCH /api/v1/content/:id
 * Update a content item.
 */
router.patch(
  '/:id',
  validate({ body: UpdateContentSchema }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const item = await updateContent(req.params.id, req.body);
      if (!item) {
        throw Errors.notFound('Content');
      }
      res.json(item);
    } catch (err) {
      next(err);
    }
  },
);

/**
 * POST /api/v1/content/:id/transition
 * Transition content status (draft → review → approved → published → archived).
 */
router.post(
  '/:id/transition',
  validate({ body: StatusTransitionSchema }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const item = await transitionStatus(req.params.id, req.body.status);
      if (!item) {
        throw Errors.notFound('Content');
      }
      res.json(item);
    } catch (err) {
      next(err);
    }
  },
);

/**
 * POST /api/v1/content/:id/publish
 * Publish a learning article to the customer's internal portal.
 */
router.post('/:id/publish', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const item = await getContent(req.params.id);
    if (!item) {
      throw Errors.notFound('Content');
    }
    const result = await publishLearningArticle(item);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/v1/content/:id/share
 * Access Controller — generate a secure temporary link for auditors/stakeholders.
 */
router.post(
  '/:id/share',
  validate({ body: ShareLinkRequestSchema.omit({ content_id: true }) }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await createShareLink({
        content_id: req.params.id,
        ...req.body,
      });
      res.json(result);
    } catch (err) {
      next(err);
    }
  },
);

/**
 * POST /api/v1/content/digest
 * Generate an Evidence Vault digest (expiring certs + recent uploads).
 */
router.post(
  '/digest',
  validate({ body: DigestRequestSchema }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const digest = await generateDigest(req.body);
      res.json(digest);
    } catch (err) {
      next(err);
    }
  },
);

/**
 * POST /api/v1/content/digest/send
 * Generate and send digest via email. Requires admin API key.
 */
router.post(
  '/digest/send',
  requireAdminKey,
  validate({ body: DigestSendSchema }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { to, ...digestReq } = req.body;
      const request = DigestRequestSchema.parse(digestReq);
      await sendDigestEmail(to, request);
      res.json({ success: true, to });
    } catch (err) {
      next(err);
    }
  },
);

// ============================================================================
// HIL REVIEW ROUTES (Human-in-the-Loop)
// ============================================================================

/**
 * GET /api/v1/content/:id/audit
 * Full audit trail for a content item.
 */
router.get('/:id/audit', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const trail = getAuditTrail(req.params.id);
    res.json({ content_id: req.params.id, trail, count: trail.length });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/v1/content/hil/pending
 * List all content items pending HIL review.
 */
router.get('/hil/pending', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const pending = getPendingReviews();
    res.json({ pending, count: pending.length });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/v1/content/hil/stats
 * Audit statistics — action counts.
 */
router.get('/hil/stats', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const stats = getAuditStats();
    res.json(stats);
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/v1/content/:id/hil/request
 * Request a human review for content before publishing.
 */
router.post(
  '/:id/hil/request',
  validate({ body: HilReviewerSchema }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const entry = requestHilReview({
        content_id: req.params.id,
        ...req.body,
      });
      res.json({ success: true, audit_entry: entry });
    } catch (err) {
      next(err);
    }
  },
);

/**
 * POST /api/v1/content/:id/hil/approve
 * Approve content after human review — unlocks artifact publishing.
 */
router.post(
  '/:id/hil/approve',
  validate({ body: HilReviewerSchema }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = approveHilReview({
        content_id: req.params.id,
        ...req.body,
      });

      // Also transition to Approved if currently in Review
      const item = await getContent(req.params.id);
      if (item && item.status === ContentStatus.Review) {
        await transitionStatus(req.params.id, ContentStatus.Approved);
      }

      res.json(result);
    } catch (err) {
      next(err);
    }
  },
);

/**
 * POST /api/v1/content/:id/hil/reject
 * Reject content — sends back to draft for revision.
 */
router.post(
  '/:id/hil/reject',
  validate({ body: HilReviewerSchema }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = rejectHilReview({
        content_id: req.params.id,
        ...req.body,
      });

      // Transition back to Draft if in Review
      const item = await getContent(req.params.id);
      if (item && item.status === ContentStatus.Review) {
        await transitionStatus(req.params.id, ContentStatus.Draft);
      }

      res.json(result);
    } catch (err) {
      next(err);
    }
  },
);

// ============================================================================
// ARTIFACT PUBLISHING ROUTES (Blog & Legal)
// ============================================================================

/**
 * POST /api/v1/content/:id/artifact/publish
 * Publish content as a site artifact (blog post or legal document).
 * Requires HIL approval for compliance traceability.
 */
router.post(
  '/:id/artifact/publish',
  validate({ body: ArtifactPublishSchema }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const item = await getContent(req.params.id);
      if (!item) {
        throw Errors.notFound('Content');
      }

      if (!isHilApproved(item.id)) {
        throw Errors.forbidden('Content must be HIL-approved before artifact publishing');
      }

      const result = await publishArtifact(item, {
        content_id: item.id,
        ...req.body,
      });

      if (result.success) {
        res.json(result);
      } else {
        throw Errors.badRequest(result.error || 'Artifact publishing failed');
      }
    } catch (err) {
      next(err);
    }
  },
);

// ============================================================================
// OMNICHANNEL DISTRIBUTION ROUTES
// ============================================================================

/**
 * POST /api/v1/content/:id/distribute
 * Distribute content across Omnichannel channels (product pages, email, LinkedIn, store).
 */
router.post(
  '/:id/distribute',
  validate({ body: DistributeSchema }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const item = await getContent(req.params.id);
      if (!item) {
        throw Errors.notFound('Content');
      }

      if (item.status !== ContentStatus.Approved && item.status !== ContentStatus.Published) {
        throw Errors.badRequest(
          `Content must be approved before distribution (status: ${item.status})`,
        );
      }

      const result = await distributeContent(item, {
        content_id: item.id,
        ...req.body,
      });

      res.json(result);
    } catch (err) {
      next(err);
    }
  },
);

export default router;
