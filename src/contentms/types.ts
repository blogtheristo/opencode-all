/**
 * Firehorse ContentMS — Type Definitions & Zod Schemas
 *
 * Customer-facing Evidence Vault + Learning content management.
 * Customers upload compliance documents, track certificate expiry,
 * search evidence, and publish internal learning articles.
 *
 * Code-Version: 3.0.0
 * Introduced-In: PR-TBD (ContentMS V3 — Memory + HIL + Artifacts)
 * Branch: claude/build-contentms-mvp-Q2nU9
 * Date: 2026-03-23
 * Owner: Claude Code (Opus 4.6)
 */

import { z } from 'zod';

// ============================================================================
// ENUMS — Customer-Facing Content Types
// ============================================================================

/**
 * What customers store in the Evidence Vault.
 */
export enum ContentType {
  /** Compliance certificates, audit reports, permits, contracts */
  Document = 'document',
  /** Certificates with expiration dates (renewable energy, ISO, EPD) */
  Certificate = 'certificate',
  /** Generated reports (carbon, compliance, annual, CSRD) */
  Report = 'report',
  /** Internal knowledge articles / blog for customer's team */
  Learning = 'learning',
  /** Reusable document templates */
  Template = 'template',
  /** Blog posts for onelifetime.world/posts/ */
  Blog = 'blog',
  /** Legal documents (privacy policy, terms, NDA) */
  Legal = 'legal',
  /** Product marketing content managed by Omnichannel (product pages, updates, campaigns) */
  ProductMarketing = 'product_marketing',
}

export enum ContentStatus {
  Draft = 'draft',
  Review = 'review',
  Approved = 'approved',
  Published = 'published',
  Archived = 'archived',
}

export enum ContentLanguage {
  EN = 'en',
  FI = 'fi',
}

/**
 * Regulation or domain tags for auto-classification.
 */
export enum ContentTag {
  EUETS = 'eu-ets',
  CBAM = 'cbam',
  CSRD = 'csrd',
  ISO14001 = 'iso-14001',
  ISO27001 = 'iso-27001',
  ISO45001 = 'iso-45001',
  EN15978 = 'en-15978',
  Scope1 = 'scope-1',
  Scope2 = 'scope-2',
  Scope3 = 'scope-3',
  EPD = 'epd',
  RenewableEnergy = 'renewable-energy',
  Safety = 'safety',
  GDPR = 'gdpr',
  EUAIAct = 'eu-ai-act',
}

/**
 * Customer's industry category.
 */
export enum ContentCategory {
  Compliance = 'compliance',
  Sustainability = 'sustainability',
  Safety = 'safety',
  Operations = 'operations',
  Training = 'training',
  Quality = 'quality',
}

/**
 * Where the content is accessible.
 */
export enum ContentVisibility {
  /** Only the uploader */
  Private = 'private',
  /** Customer's team */
  Team = 'team',
  /** Shared via secure link (e.g., auditor) */
  SharedLink = 'shared_link',
  /** Published to customer's internal learning portal */
  Internal = 'internal',
}

// ============================================================================
// ZOD SCHEMAS
// ============================================================================

export const ContentItemSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1).max(300),
  slug: z
    .string()
    .regex(/^[a-z0-9-]+$/)
    .max(100),
  type: z.nativeEnum(ContentType),
  status: z.nativeEnum(ContentStatus),
  language: z.nativeEnum(ContentLanguage),
  category: z.nativeEnum(ContentCategory),
  visibility: z.nativeEnum(ContentVisibility).default(ContentVisibility.Team),

  // Content body (markdown for learning, description for documents)
  // Capped at 100KB: renderMarkdownToHtml() runs markdown-it synchronously on the
  // request path with no worker isolation — an unbounded body is a CPU-DoS vector.
  body_markdown: z.string().min(1).max(100_000),
  body_html: z.string().optional(),
  excerpt: z.string().max(500).optional(),

  // Document metadata
  file_name: z.string().optional(),
  file_type: z.string().optional(), // pdf, docx, jpg, png, cad, xlsx
  file_size_bytes: z.number().int().min(0).optional(),
  file_url: z.string().optional(), // Secure storage URL

  // Certificate-specific fields
  issued_by: z.string().optional(),
  issued_date: z.string().datetime().optional(),
  expires_at: z.string().datetime().optional(),
  expiry_alert_days: z.number().int().positive().default(30),

  // Auto-classification (Document Classifier agent)
  regulation_tags: z.array(z.nativeEnum(ContentTag)).optional(),
  custom_tags: z.array(z.string()).optional(),
  ai_summary: z.string().optional(),
  ai_classification_confidence: z.number().min(0).max(1).optional(),

  // Linkage — connects document to data points in DWS IQ
  linked_report_ids: z.array(z.string().uuid()).optional(),
  linked_data_points: z.array(z.string()).optional(), // e.g., "Q3-2026-scope2-energy"

  // Product marketing (Omnichannel) — for type=product_marketing
  product_sku: z.string().optional(), // e.g., "FH-OMNI-001"
  distribution_targets: z.array(z.string()).optional(), // OmnichannelTarget values
  campaign_id: z.string().optional(),
  update_summary: z.string().optional(),
  price_eur: z.number().optional(),

  // Secure sharing (Access Controller agent)
  shared_links: z
    .array(
      z.object({
        token: z.string(),
        expires_at: z.string().datetime(),
        accessed_count: z.number().int().min(0).default(0),
        created_by: z.string(),
      }),
    )
    .optional(),

  // Ownership & audit trail
  owner_id: z.string(), // Customer user ID
  organization_id: z.string(), // Customer org ID
  author: z.string(),

  // Dates
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  published_at: z.string().datetime().optional(),
});

export const CreateContentSchema = ContentItemSchema.omit({
  id: true,
  body_html: true,
  created_at: true,
  updated_at: true,
  published_at: true,
  shared_links: true,
  ai_summary: true,
  ai_classification_confidence: true,
}).extend({
  id: z.string().uuid().optional(),
});

export const UpdateContentSchema = ContentItemSchema.partial().omit({
  id: true,
  created_at: true,
  updated_at: true,
  published_at: true,
  status: true,
  shared_links: true,
  ai_summary: true,
  ai_classification_confidence: true,
  owner_id: true,
  organization_id: true,
});

export const ContentFilterSchema = z.object({
  type: z.nativeEnum(ContentType).optional(),
  status: z.nativeEnum(ContentStatus).optional(),
  language: z.nativeEnum(ContentLanguage).optional(),
  category: z.nativeEnum(ContentCategory).optional(),
  visibility: z.nativeEnum(ContentVisibility).optional(),
  regulation_tag: z.nativeEnum(ContentTag).optional(),
  custom_tag: z.string().optional(),
  search: z.string().optional(), // Full-text / semantic search query
  expires_before: z.string().datetime().optional(), // Find expiring certificates
  organization_id: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  offset: z.coerce.number().int().min(0).default(0),
});

export const ShareLinkRequestSchema = z.object({
  content_id: z.string().uuid(),
  expires_in_hours: z.number().int().min(1).max(720).default(48), // max 30 days
  created_by: z.string(),
});

export const DigestRequestSchema = z.object({
  period: z.enum(['daily', 'weekly']).default('weekly'),
  language: z.nativeEnum(ContentLanguage).default(ContentLanguage.EN),
  organization_id: z.string(),
  include_expiring: z.boolean().default(true),
  include_recent_uploads: z.boolean().default(true),
});

// ============================================================================
// TYPES (inferred from Zod)
// ============================================================================

export type ContentItem = z.infer<typeof ContentItemSchema>;
export type CreateContentInput = z.infer<typeof CreateContentSchema>;
export type UpdateContentInput = z.infer<typeof UpdateContentSchema>;
export type ContentFilter = z.infer<typeof ContentFilterSchema>;
export type ShareLinkRequest = z.infer<typeof ShareLinkRequestSchema>;
export type DigestRequest = z.infer<typeof DigestRequestSchema>;

// ============================================================================
// RESULT TYPES
// ============================================================================

export interface PublishResult {
  content_id: string;
  success: boolean;
  url?: string;
  error?: string;
  published_at: string;
}

export interface ShareLinkResult {
  content_id: string;
  token: string;
  url: string;
  expires_at: string;
}

export interface DigestResult {
  period: string;
  language: ContentLanguage;
  organization_id: string;
  expiring_certificates: ContentItem[];
  recent_uploads: ContentItem[];
  generated_at: string;
  html: string;
}

export interface SearchResult {
  items: ContentItem[];
  total: number;
  query: string;
}

export interface ContentStats {
  total: number;
  by_type: Record<string, number>;
  by_status: Record<string, number>;
  expiring_soon: number; // Certificates expiring within 30 days
}

// ============================================================================
// AUDIT TRAIL — Human-in-the-Loop (HIL) Learning & Compliance
// ============================================================================

export enum AuditAction {
  Created = 'created',
  Updated = 'updated',
  StatusChanged = 'status_changed',
  Published = 'published',
  Shared = 'shared',
  Archived = 'archived',
  HilReviewRequested = 'hil_review_requested',
  HilApproved = 'hil_approved',
  HilRejected = 'hil_rejected',
  ArtifactPublished = 'artifact_published',
}

export const AuditEntrySchema = z.object({
  id: z.string().uuid(),
  content_id: z.string().uuid(),
  action: z.nativeEnum(AuditAction),
  actor_id: z.string(),
  actor_name: z.string(),
  details: z.string().optional(),
  previous_status: z.nativeEnum(ContentStatus).optional(),
  new_status: z.nativeEnum(ContentStatus).optional(),
  artifact_path: z.string().optional(),
  created_at: z.string().datetime(),
});

export type AuditEntry = z.infer<typeof AuditEntrySchema>;

export interface HilReviewRequest {
  content_id: string;
  reviewer_id: string;
  reviewer_name: string;
  review_notes?: string;
}

export interface HilReviewResult {
  content_id: string;
  action: AuditAction.HilApproved | AuditAction.HilRejected;
  reviewer: string;
  notes?: string;
  reviewed_at: string;
}

// ============================================================================
// ARTIFACT PUBLISHING — Blog & Legal Document Output
// ============================================================================

export enum ArtifactType {
  BlogPost = 'blog_post',
  LegalDocument = 'legal_document',
  ProductPage = 'product_page',
}

export interface ArtifactPublishRequest {
  content_id: string;
  artifact_type: ArtifactType;
  publisher_id: string;
  publisher_name: string;
}

export interface ArtifactPublishResult {
  content_id: string;
  artifact_type: ArtifactType;
  success: boolean;
  source_path?: string;
  landing_path?: string;
  error?: string;
  published_at: string;
}

// ============================================================================
// OMNICHANNEL DISTRIBUTION — Product Marketing & Content Syndication
// ============================================================================

/**
 * Channels where Firehorse Omnichannel can distribute content.
 */
export enum OmnichannelTarget {
  /** Product page on dws10.com/products/ */
  ProductPage = 'product_page',
  /** Blog post on onelifetime.world/posts/ */
  BlogPost = 'blog_post',
  /** Email campaign via outreach cadence */
  EmailCampaign = 'email_campaign',
  /** LinkedIn post via automation */
  LinkedIn = 'linkedin',
  /** Store listing update on dws10.com/buy/ */
  StoreListing = 'store_listing',
}

/**
 * Product marketing content linked to a product SKU.
 * Omnichannel uses this to keep product pages, store listings,
 * and outreach content in sync.
 */
export interface ProductMarketingMeta {
  /** Product SKU from products.json (e.g., FH-OMNI-001) */
  product_sku: string;
  /** Which channels to distribute to */
  distribution_targets: OmnichannelTarget[];
  /** Campaign ID if part of an outreach sequence */
  campaign_id?: string;
  /** Product update changelog (what changed) */
  update_summary?: string;
  /** Price at time of content creation */
  price_eur?: number;
}

export interface OmnichannelDistributeRequest {
  content_id: string;
  targets: OmnichannelTarget[];
  distributor_id: string;
  distributor_name: string;
}

export interface OmnichannelDistributeResult {
  content_id: string;
  distributed_to: Array<{
    target: OmnichannelTarget;
    success: boolean;
    path?: string;
    error?: string;
  }>;
  distributed_at: string;
}
