/**
 * Firehorse ContentMS — MCP Tool Definitions (5 Evidence Vault Agents)
 *
 * Exposes the 5 Firehorse Content Agents as MCP tools:
 *   1. Document Classifier — auto-tag uploads by regulation
 *   2. Expiration Tracker — find expiring certificates
 *   3. Search Agent — natural language search
 *   4. Access Controller — secure sharing
 *   5. Archive Manager — stats, retention, lifecycle
 *
 * Plus: CRUD tools and Learning article publishing.
 *
 * Code-Version: 3.0.0
 * Introduced-In: PR-TBD (ContentMS V3 — Memory + HIL + Artifacts)
 * Branch: claude/build-contentms-mvp-Q2nU9
 * Date: 2026-03-23
 * Owner: Claude Code (Opus 4.6)
 */

import {
  createContent,
  createShareLink,
  getContent,
  getContentStats,
  getExpiringCertificates,
  listContent,
  searchContent,
  transitionStatus,
  updateContent,
} from './service.js';
import { publishLearningArticle } from './blog-publisher.js';
import { publishArtifact } from './artifact-publisher.js';
import { distributeContent } from './omnichannel.js';
import { generateDigest } from './digest.js';
import {
  approveHilReview,
  getAuditTrail,
  getPendingReviews,
  isHilApproved,
  rejectHilReview,
  requestHilReview,
} from './audit.js';
import {
  ArtifactType,
  ContentCategory,
  ContentLanguage,
  ContentStatus,
  ContentTag,
  ContentType,
  ContentVisibility,
  OmnichannelTarget,
} from './types.js';

// ============================================================================
// MCP TOOL REGISTRY
// ============================================================================

export interface McpTool {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  handler: (input: Record<string, unknown>) => Promise<unknown>;
}

export const contentMcpTools: McpTool[] = [
  // ==========================================================================
  // AGENT 1: DOCUMENT CLASSIFIER (auto-runs on create)
  // ==========================================================================
  {
    name: 'contentms_upload',
    description:
      'Upload a document to the Evidence Vault. Document Classifier auto-tags it by regulation (EU ETS, CBAM, CSRD, ISO, etc.).',
    inputSchema: {
      type: 'object',
      required: [
        'title',
        'slug',
        'type',
        'language',
        'category',
        'body_markdown',
        'owner_id',
        'organization_id',
        'author',
      ],
      properties: {
        title: { type: 'string', description: 'Document title' },
        slug: { type: 'string', description: 'URL-safe slug' },
        type: {
          type: 'string',
          enum: Object.values(ContentType),
          description: 'document | certificate | report | learning | template',
        },
        language: { type: 'string', enum: Object.values(ContentLanguage) },
        category: { type: 'string', enum: Object.values(ContentCategory) },
        visibility: { type: 'string', enum: Object.values(ContentVisibility), default: 'team' },
        body_markdown: {
          type: 'string',
          description: 'Content body or document description in Markdown',
        },
        excerpt: { type: 'string', description: 'Short summary (max 500 chars)' },
        file_name: {
          type: 'string',
          description: 'Original filename (e.g., iso14001-cert-2026.pdf)',
        },
        file_type: { type: 'string', description: 'File type: pdf, docx, jpg, png, cad, xlsx' },
        file_size_bytes: { type: 'number' },
        issued_by: { type: 'string', description: 'Certificate issuer (for certificates)' },
        issued_date: { type: 'string', description: 'ISO date when certificate was issued' },
        expires_at: { type: 'string', description: 'ISO date when certificate expires' },
        custom_tags: { type: 'array', items: { type: 'string' } },
        owner_id: { type: 'string', description: 'Customer user ID' },
        organization_id: { type: 'string', description: 'Customer organization ID' },
        author: { type: 'string', description: 'Uploader name' },
      },
    },
    handler: async (input) => {
      return createContent({
        ...input,
        status: ContentStatus.Draft,
      } as Parameters<typeof createContent>[0]);
    },
  },

  // ==========================================================================
  // AGENT 2: EXPIRATION TRACKER
  // ==========================================================================
  {
    name: 'contentms_expiring',
    description:
      'Find certificates expiring within N days. Alerts before critical green certificates expire.',
    inputSchema: {
      type: 'object',
      required: ['organization_id'],
      properties: {
        organization_id: { type: 'string', description: 'Customer organization ID' },
        within_days: {
          type: 'number',
          default: 30,
          description: 'Days until expiry (default: 30)',
        },
      },
    },
    handler: async (input) => {
      const days = (input.within_days as number) || 30;
      return getExpiringCertificates(input.organization_id as string, days);
    },
  },

  // ==========================================================================
  // AGENT 3: SEARCH AGENT
  // ==========================================================================
  {
    name: 'contentms_search',
    description:
      'Search the Evidence Vault using natural language. Finds documents by title, body, tags, regulation, issuer.',
    inputSchema: {
      type: 'object',
      required: ['query', 'organization_id'],
      properties: {
        query: { type: 'string', description: 'Search query (e.g., "Energy Certificates Q3")' },
        organization_id: { type: 'string' },
        limit: { type: 'number', default: 20 },
      },
    },
    handler: async (input) => {
      return searchContent(
        input.query as string,
        input.organization_id as string,
        (input.limit as number) || 20,
      );
    },
  },

  // ==========================================================================
  // AGENT 4: ACCESS CONTROLLER
  // ==========================================================================
  {
    name: 'contentms_share',
    description:
      'Generate a secure, temporary share link for an auditor or stakeholder. Link expires automatically.',
    inputSchema: {
      type: 'object',
      required: ['content_id', 'created_by'],
      properties: {
        content_id: { type: 'string', description: 'Content item UUID to share' },
        expires_in_hours: {
          type: 'number',
          default: 48,
          description: 'Hours until link expires (max 720 = 30 days)',
        },
        created_by: { type: 'string', description: 'User creating the share link' },
      },
    },
    handler: async (input) => {
      return createShareLink({
        content_id: input.content_id as string,
        expires_in_hours: (input.expires_in_hours as number) || 48,
        created_by: input.created_by as string,
      });
    },
  },

  // ==========================================================================
  // AGENT 5: ARCHIVE MANAGER
  // ==========================================================================
  {
    name: 'contentms_stats',
    description:
      'Evidence Vault dashboard — document counts by type/status, expiring certificates count.',
    inputSchema: {
      type: 'object',
      properties: {
        organization_id: { type: 'string', description: 'Customer organization ID' },
      },
    },
    handler: async (input) => {
      return getContentStats(input.organization_id as string);
    },
  },

  {
    name: 'contentms_transition',
    description:
      'Transition document status (draft → review → approved → published → archived). Archive Manager handles retention.',
    inputSchema: {
      type: 'object',
      required: ['id', 'status'],
      properties: {
        id: { type: 'string' },
        status: { type: 'string', enum: Object.values(ContentStatus) },
      },
    },
    handler: async (input) => {
      return transitionStatus(input.id as string, input.status as ContentStatus);
    },
  },

  // ==========================================================================
  // CRUD & LEARNING
  // ==========================================================================
  {
    name: 'contentms_list',
    description:
      'List Evidence Vault items with filters (type, status, category, regulation tag, expiry).',
    inputSchema: {
      type: 'object',
      properties: {
        type: { type: 'string', enum: Object.values(ContentType) },
        status: { type: 'string', enum: Object.values(ContentStatus) },
        language: { type: 'string', enum: Object.values(ContentLanguage) },
        category: { type: 'string', enum: Object.values(ContentCategory) },
        regulation_tag: { type: 'string', enum: Object.values(ContentTag) },
        organization_id: { type: 'string' },
        limit: { type: 'number', default: 20 },
        offset: { type: 'number', default: 0 },
      },
    },
    handler: async (input) => {
      return listContent(input as Parameters<typeof listContent>[0]);
    },
  },

  {
    name: 'contentms_get',
    description: 'Get a single Evidence Vault item by ID.',
    inputSchema: {
      type: 'object',
      required: ['id'],
      properties: {
        id: { type: 'string', description: 'Content item UUID' },
      },
    },
    handler: async (input) => {
      return getContent(input.id as string);
    },
  },

  {
    name: 'contentms_update',
    description: 'Update an Evidence Vault item. Re-classifies automatically if content changes.',
    inputSchema: {
      type: 'object',
      required: ['id'],
      properties: {
        id: { type: 'string' },
        title: { type: 'string' },
        body_markdown: { type: 'string' },
        excerpt: { type: 'string' },
        custom_tags: { type: 'array', items: { type: 'string' } },
        expires_at: { type: 'string', description: 'Update certificate expiry date' },
      },
    },
    handler: async (input) => {
      const { id, ...updates } = input;
      return updateContent(id as string, updates as Parameters<typeof updateContent>[1]);
    },
  },

  {
    name: 'contentms_publish_learning',
    description: "Publish a learning article to the customer's internal knowledge portal.",
    inputSchema: {
      type: 'object',
      required: ['id'],
      properties: {
        id: { type: 'string', description: 'Learning article UUID' },
      },
    },
    handler: async (input) => {
      const item = await getContent(input.id as string);
      if (!item) return { error: 'Content not found' };
      return publishLearningArticle(item);
    },
  },

  {
    name: 'contentms_digest',
    description: 'Generate Evidence Vault digest — expiring certificates + recent uploads.',
    inputSchema: {
      type: 'object',
      required: ['organization_id'],
      properties: {
        period: { type: 'string', enum: ['daily', 'weekly'], default: 'weekly' },
        language: { type: 'string', enum: Object.values(ContentLanguage), default: 'en' },
        organization_id: { type: 'string' },
        include_expiring: { type: 'boolean', default: true },
        include_recent_uploads: { type: 'boolean', default: true },
      },
    },
    handler: async (input) => {
      return generateDigest(input as Parameters<typeof generateDigest>[0]);
    },
  },

  // ==========================================================================
  // HIL REVIEW (Human-in-the-Loop)
  // ==========================================================================
  {
    name: 'contentms_hil_request',
    description: 'Request a human review for content before publishing. Creates an audit gate.',
    inputSchema: {
      type: 'object',
      required: ['content_id', 'reviewer_id', 'reviewer_name'],
      properties: {
        content_id: { type: 'string', description: 'Content item UUID' },
        reviewer_id: { type: 'string', description: 'Reviewer user ID' },
        reviewer_name: { type: 'string', description: 'Reviewer display name' },
        review_notes: { type: 'string', description: 'Notes for reviewer' },
      },
    },
    handler: async (input) => {
      return requestHilReview({
        content_id: input.content_id as string,
        reviewer_id: input.reviewer_id as string,
        reviewer_name: input.reviewer_name as string,
        review_notes: input.review_notes as string | undefined,
      });
    },
  },

  {
    name: 'contentms_hil_approve',
    description: 'Approve content after human review. Unlocks artifact publishing.',
    inputSchema: {
      type: 'object',
      required: ['content_id', 'reviewer_id', 'reviewer_name'],
      properties: {
        content_id: { type: 'string', description: 'Content item UUID' },
        reviewer_id: { type: 'string', description: 'Reviewer user ID' },
        reviewer_name: { type: 'string', description: 'Reviewer display name' },
        review_notes: { type: 'string', description: 'Approval notes' },
      },
    },
    handler: async (input) => {
      return approveHilReview({
        content_id: input.content_id as string,
        reviewer_id: input.reviewer_id as string,
        reviewer_name: input.reviewer_name as string,
        review_notes: input.review_notes as string | undefined,
      });
    },
  },

  {
    name: 'contentms_hil_reject',
    description: 'Reject content — sends back to draft for revision.',
    inputSchema: {
      type: 'object',
      required: ['content_id', 'reviewer_id', 'reviewer_name'],
      properties: {
        content_id: { type: 'string', description: 'Content item UUID' },
        reviewer_id: { type: 'string', description: 'Reviewer user ID' },
        reviewer_name: { type: 'string', description: 'Reviewer display name' },
        review_notes: { type: 'string', description: 'Rejection reason' },
      },
    },
    handler: async (input) => {
      return rejectHilReview({
        content_id: input.content_id as string,
        reviewer_id: input.reviewer_id as string,
        reviewer_name: input.reviewer_name as string,
        review_notes: input.review_notes as string | undefined,
      });
    },
  },

  {
    name: 'contentms_hil_pending',
    description: 'List content items pending human review.',
    inputSchema: { type: 'object', properties: {} },
    handler: async () => {
      return getPendingReviews();
    },
  },

  {
    name: 'contentms_audit_trail',
    description:
      'Get the full audit trail for a content item — all actions, reviewers, timestamps.',
    inputSchema: {
      type: 'object',
      required: ['content_id'],
      properties: {
        content_id: { type: 'string', description: 'Content item UUID' },
      },
    },
    handler: async (input) => {
      return getAuditTrail(input.content_id as string);
    },
  },

  // ==========================================================================
  // ARTIFACT PUBLISHING (Blog & Legal)
  // ==========================================================================
  {
    name: 'contentms_publish_artifact',
    description:
      'Publish content as a site artifact (blog post to onelifetime.world/posts/ or legal document to onelifetime.world/legal/). Requires HIL approval.',
    inputSchema: {
      type: 'object',
      required: ['content_id', 'artifact_type', 'publisher_id', 'publisher_name'],
      properties: {
        content_id: { type: 'string', description: 'Content item UUID' },
        artifact_type: {
          type: 'string',
          enum: Object.values(ArtifactType),
          description: 'blog_post or legal_document',
        },
        publisher_id: { type: 'string', description: 'Publisher user ID' },
        publisher_name: { type: 'string', description: 'Publisher display name' },
      },
    },
    handler: async (input) => {
      const item = await getContent(input.content_id as string);
      if (!item) return { error: 'Content not found' };

      if (!isHilApproved(item.id)) {
        return { error: 'Content must be HIL-approved before artifact publishing' };
      }

      return publishArtifact(item, {
        content_id: item.id,
        artifact_type: input.artifact_type as ArtifactType,
        publisher_id: input.publisher_id as string,
        publisher_name: input.publisher_name as string,
      });
    },
  },

  // ==========================================================================
  // OMNICHANNEL DISTRIBUTION
  // ==========================================================================
  {
    name: 'contentms_distribute',
    description:
      'Distribute content across Omnichannel channels — product pages, blog, email campaigns, LinkedIn, store listings. Product marketing automation.',
    inputSchema: {
      type: 'object',
      required: ['content_id', 'targets', 'distributor_id', 'distributor_name'],
      properties: {
        content_id: { type: 'string', description: 'Content item UUID' },
        targets: {
          type: 'array',
          items: { type: 'string', enum: Object.values(OmnichannelTarget) },
          description:
            'Channels to distribute to: product_page, blog_post, email_campaign, linkedin, store_listing',
        },
        distributor_id: { type: 'string', description: 'Distributor user ID' },
        distributor_name: { type: 'string', description: 'Distributor display name' },
      },
    },
    handler: async (input) => {
      const item = await getContent(input.content_id as string);
      if (!item) return { error: 'Content not found' };

      return distributeContent(item, {
        content_id: item.id,
        targets: input.targets as OmnichannelTarget[],
        distributor_id: input.distributor_id as string,
        distributor_name: input.distributor_name as string,
      });
    },
  },
];
