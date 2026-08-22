/**
 * Firehorse ContentMS — Core Service (Evidence Vault)
 *
 * Customer-facing CRUD for compliance documents, certificates,
 * reports, and learning content. Implements the 5 Firehorse agents:
 *   1. Document Classifier — auto-tag uploads by regulation
 *   2. Expiration Tracker — alert before certificates expire
 *   3. Search Agent — find documents via natural language
 *   4. Access Controller — manage permissions & secure sharing
 *   5. Archive Manager — retention policies & lifecycle
 *
 * Persistent memory via Supabase (in-memory fallback).
 * Full audit trail for HIL learning and compliance reviews.
 *
 * Code-Version: 3.0.0
 * Introduced-In: PR-TBD (ContentMS V3 — Memory + HIL + Artifacts)
 * Branch: claude/build-contentms-mvp-Q2nU9
 * Date: 2026-03-23
 * Owner: Claude Code (Opus 4.6)
 */

import { randomUUID } from 'node:crypto';
import logger from '../utils/logger.js';
import {
  AuditAction,
  type ContentFilter,
  type ContentItem,
  ContentItemSchema,
  type ContentStats,
  ContentStatus,
  ContentTag,
  ContentType,
  type CreateContentInput,
  CreateContentSchema,
  type SearchResult,
  type ShareLinkRequest,
  type ShareLinkResult,
  type UpdateContentInput,
} from './types.js';
import { renderMarkdownToHtml } from './blog-publisher.js';
import { contentMemory } from './memory.js';
import { recordAudit } from './audit.js';

// ============================================================================
// PERSISTENT STORE (Supabase-backed with in-memory fallback)
// ============================================================================

// contentMemory is the singleton from memory.ts — Supabase + Map fallback

// ============================================================================
// AGENT 1: DOCUMENT CLASSIFIER
// ============================================================================

/**
 * Auto-classify a document by scanning title, body, and filename
 * for known regulation keywords. Returns regulation tags and confidence.
 *
 * MVP: keyword matching. Production: LLM-based classification.
 */
function classifyDocument(input: { title: string; body_markdown: string; file_name?: string }): {
  tags: ContentTag[];
  confidence: number;
} {
  const text = `${input.title} ${input.body_markdown} ${input.file_name || ''}`.toLowerCase();
  const tags: ContentTag[] = [];

  const rules: Array<{ keywords: string[]; tag: ContentTag }> = [
    { keywords: ['eu ets', 'emission trading', 'ets benchmark'], tag: ContentTag.EUETS },
    { keywords: ['cbam', 'carbon border'], tag: ContentTag.CBAM },
    { keywords: ['csrd', 'corporate sustainability reporting'], tag: ContentTag.CSRD },
    { keywords: ['iso 14001', 'iso14001', 'environmental management'], tag: ContentTag.ISO14001 },
    { keywords: ['iso 27001', 'iso27001', 'information security'], tag: ContentTag.ISO27001 },
    { keywords: ['iso 45001', 'iso45001', 'occupational health'], tag: ContentTag.ISO45001 },
    {
      keywords: ['en 15978', 'en15978', 'lifecycle assessment', 'embodied carbon'],
      tag: ContentTag.EN15978,
    },
    { keywords: ['scope 1', 'scope1', 'direct emissions'], tag: ContentTag.Scope1 },
    {
      keywords: ['scope 2', 'scope2', 'indirect emissions', 'purchased energy'],
      tag: ContentTag.Scope2,
    },
    { keywords: ['scope 3', 'scope3', 'value chain'], tag: ContentTag.Scope3 },
    { keywords: ['epd', 'environmental product declaration'], tag: ContentTag.EPD },
    {
      keywords: ['renewable energy', 'green certificate', 'guarantee of origin'],
      tag: ContentTag.RenewableEnergy,
    },
    { keywords: ['safety', 'en 13001', 'ppe', 'risk assessment'], tag: ContentTag.Safety },
    { keywords: ['gdpr', 'data protection', 'privacy'], tag: ContentTag.GDPR },
    { keywords: ['eu ai act', 'artificial intelligence act'], tag: ContentTag.EUAIAct },
  ];

  for (const rule of rules) {
    if (rule.keywords.some((kw) => text.includes(kw))) {
      tags.push(rule.tag);
    }
  }

  // Confidence based on number of matches vs total rules checked
  const confidence = tags.length > 0 ? Math.min(0.5 + tags.length * 0.1, 0.95) : 0.1;
  return { tags, confidence };
}

// ============================================================================
// CORE CRUD
// ============================================================================

/**
 * Create a new content item. Document Classifier auto-tags it.
 */
export async function createContent(input: CreateContentInput): Promise<ContentItem> {
  const parsed = CreateContentSchema.parse(input);
  const now = new Date().toISOString();

  // Auto-classify if no regulation tags provided
  let regulationTags = parsed.regulation_tags;
  let confidence: number | undefined;
  if (!regulationTags || regulationTags.length === 0) {
    const classification = classifyDocument({
      title: parsed.title,
      body_markdown: parsed.body_markdown,
      file_name: parsed.file_name,
    });
    regulationTags = classification.tags;
    confidence = classification.confidence;
  }

  const item: ContentItem = {
    ...parsed,
    id: parsed.id || randomUUID(),
    body_html: renderMarkdownToHtml(parsed.body_markdown),
    regulation_tags: regulationTags,
    ai_classification_confidence: confidence,
    created_at: now,
    updated_at: now,
  };

  ContentItemSchema.parse(item);
  await contentMemory.set(item.id, item);

  recordAudit({
    content_id: item.id,
    action: AuditAction.Created,
    actor_id: item.owner_id,
    actor_name: item.author,
    details: `Created ${item.type}: ${item.title}`,
    new_status: item.status,
  });

  logger.info('Content created', {
    id: item.id,
    type: item.type,
    title: item.title,
    tags: regulationTags,
  });
  return item;
}

/**
 * Get a content item by ID.
 */
export async function getContent(id: string): Promise<ContentItem | null> {
  return contentMemory.get(id);
}

/**
 * Get a content item by slug.
 */
export async function getContentBySlug(slug: string): Promise<ContentItem | null> {
  for (const item of contentMemory.values()) {
    if (item.slug === slug) return item;
  }
  return null;
}

// ============================================================================
// AGENT 3: SEARCH AGENT
// ============================================================================

/**
 * Search content items. MVP: keyword matching on title + body + tags.
 * Production: vector-based semantic search via pgvector.
 */
export async function searchContent(
  query: string,
  organizationId: string,
  limit = 20,
): Promise<SearchResult> {
  const q = query.toLowerCase();
  const items = contentMemory
    .values()
    .filter((item) => item.organization_id === organizationId)
    .filter((item) => {
      const searchable = [
        item.title,
        item.body_markdown,
        item.excerpt || '',
        item.file_name || '',
        item.issued_by || '',
        item.ai_summary || '',
        ...(item.regulation_tags || []),
        ...(item.custom_tags || []),
      ]
        .join(' ')
        .toLowerCase();
      return searchable.includes(q);
    })
    .slice(0, limit);

  return { items, total: items.length, query };
}

/**
 * List content items with optional filtering.
 */
export async function listContent(
  filter: ContentFilter = { limit: 20, offset: 0 },
): Promise<ContentItem[]> {
  let items = contentMemory.values();

  if (filter.organization_id)
    items = items.filter((i) => i.organization_id === filter.organization_id);
  if (filter.type) items = items.filter((i) => i.type === filter.type);
  if (filter.status) items = items.filter((i) => i.status === filter.status);
  if (filter.language) items = items.filter((i) => i.language === filter.language);
  if (filter.category) items = items.filter((i) => i.category === filter.category);
  if (filter.visibility) items = items.filter((i) => i.visibility === filter.visibility);
  if (filter.regulation_tag) {
    const regulationTag = filter.regulation_tag;
    items = items.filter((i) => i.regulation_tags?.includes(regulationTag));
  }
  if (filter.custom_tag) {
    const customTag = filter.custom_tag;
    items = items.filter((i) => i.custom_tags?.includes(customTag));
  }
  if (filter.search) {
    const q = filter.search.toLowerCase();
    items = items.filter(
      (i) => i.title.toLowerCase().includes(q) || i.body_markdown.toLowerCase().includes(q),
    );
  }
  if (filter.expires_before) {
    const cutoff = new Date(filter.expires_before);
    items = items.filter((i) => i.expires_at && new Date(i.expires_at) <= cutoff);
  }

  // Sort by updated_at desc
  items.sort((a, b) => b.updated_at.localeCompare(a.updated_at));
  return items.slice(filter.offset, filter.offset + filter.limit);
}

/**
 * Update a content item.
 */
export async function updateContent(
  id: string,
  updates: UpdateContentInput,
): Promise<ContentItem | null> {
  const existing = await contentMemory.get(id);
  if (!existing) return null;

  const updated: ContentItem = {
    ...existing,
    ...updates,
    id: existing.id,
    created_at: existing.created_at,
    owner_id: existing.owner_id,
    organization_id: existing.organization_id,
    updated_at: new Date().toISOString(),
  };

  // Re-render HTML if markdown changed
  if (updates.body_markdown) {
    updated.body_html = renderMarkdownToHtml(updates.body_markdown);
  }

  // Re-classify if content changed
  if (updates.body_markdown || updates.title) {
    const classification = classifyDocument({
      title: updated.title,
      body_markdown: updated.body_markdown,
      file_name: updated.file_name,
    });
    updated.regulation_tags = classification.tags;
    updated.ai_classification_confidence = classification.confidence;
  }

  ContentItemSchema.parse(updated);
  await contentMemory.set(id, updated);

  recordAudit({
    content_id: id,
    action: AuditAction.Updated,
    actor_id: updated.owner_id,
    actor_name: updated.author,
    details: `Updated: ${Object.keys(updates).join(', ')}`,
  });

  logger.info('Content updated', { id, title: updated.title });
  return updated;
}

/**
 * Transition content status with validation.
 */
export async function transitionStatus(
  id: string,
  newStatus: ContentStatus,
): Promise<ContentItem | null> {
  const item = await contentMemory.get(id);
  if (!item) return null;

  const allowed: Record<ContentStatus, ContentStatus[]> = {
    [ContentStatus.Draft]: [ContentStatus.Review],
    [ContentStatus.Review]: [ContentStatus.Draft, ContentStatus.Approved],
    [ContentStatus.Approved]: [ContentStatus.Published, ContentStatus.Draft],
    [ContentStatus.Published]: [ContentStatus.Archived],
    [ContentStatus.Archived]: [ContentStatus.Draft],
  };

  if (!allowed[item.status]?.includes(newStatus)) {
    throw new Error(`Invalid transition: ${item.status} → ${newStatus}`);
  }

  const now = new Date().toISOString();
  const updated: ContentItem = {
    ...item,
    status: newStatus,
    updated_at: now,
    published_at: newStatus === ContentStatus.Published ? now : item.published_at,
  };

  await contentMemory.set(id, updated);

  recordAudit({
    content_id: id,
    action: AuditAction.StatusChanged,
    actor_id: item.owner_id,
    actor_name: item.author,
    details: `Status: ${item.status} → ${newStatus}`,
    previous_status: item.status,
    new_status: newStatus,
  });

  logger.info('Content status changed', { id, from: item.status, to: newStatus });
  return updated;
}

// ============================================================================
// AGENT 2: EXPIRATION TRACKER
// ============================================================================

/**
 * Find certificates expiring within N days.
 * Expiration Tracker agent calls this on a schedule.
 */
export async function getExpiringCertificates(
  organizationId: string,
  withinDays = 30,
): Promise<ContentItem[]> {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() + withinDays);

  return contentMemory
    .values()
    .filter(
      (item) =>
        item.organization_id === organizationId &&
        item.type === ContentType.Certificate &&
        item.expires_at &&
        new Date(item.expires_at) <= cutoff &&
        item.status !== ContentStatus.Archived,
    )
    .sort((a, b) => {
      const aExp = a.expires_at ? new Date(a.expires_at).getTime() : Infinity;
      const bExp = b.expires_at ? new Date(b.expires_at).getTime() : Infinity;
      return aExp - bExp; // Soonest first
    });
}

// ============================================================================
// AGENT 4: ACCESS CONTROLLER — Secure Sharing
// ============================================================================

/**
 * Generate a temporary secure link for sharing a document (e.g., with an auditor).
 */
export async function createShareLink(request: ShareLinkRequest): Promise<ShareLinkResult> {
  const item = await contentMemory.get(request.content_id);
  if (!item) throw new Error('Content not found');

  const token = randomUUID();
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + request.expires_in_hours);

  const link = {
    token,
    expires_at: expiresAt.toISOString(),
    accessed_count: 0,
    created_by: request.created_by,
  };

  const updated: ContentItem = {
    ...item,
    shared_links: [...(item.shared_links || []), link],
    updated_at: new Date().toISOString(),
  };

  await contentMemory.set(item.id, updated);

  recordAudit({
    content_id: item.id,
    action: AuditAction.Shared,
    actor_id: request.created_by,
    actor_name: request.created_by,
    details: `Share link created, expires: ${link.expires_at}`,
  });

  logger.info('Share link created', { content_id: item.id, token, expires_at: link.expires_at });

  // URL pattern — in production, this resolves to a secure download endpoint
  const url = `/api/v1/content/shared/${token}`;

  return {
    content_id: item.id,
    token,
    url,
    expires_at: link.expires_at,
  };
}

/**
 * Access a shared document by token.
 */
export async function getSharedContent(token: string): Promise<ContentItem | null> {
  for (const item of contentMemory.values()) {
    const link = item.shared_links?.find((l) => l.token === token);
    if (link) {
      // Check expiry
      if (new Date(link.expires_at) < new Date()) {
        return null; // Expired
      }
      // Increment access count
      link.accessed_count++;
      item.updated_at = new Date().toISOString();
      await contentMemory.set(item.id, item);

      // Security: do not expose all share links (and their tokens) via shared access
      // Only return a sanitized view of the content item without `shared_links`.
      const { shared_links: _shared_links, ...sanitizedItem } = item;
      return sanitizedItem as ContentItem;
    }
  }
  return null;
}

// ============================================================================
// AGENT 5: ARCHIVE MANAGER — Stats & Retention
// ============================================================================

/**
 * Get Evidence Vault statistics for a customer organization.
 */
export async function getContentStats(organizationId: string): Promise<ContentStats> {
  const items = contentMemory.values().filter((i) => i.organization_id === organizationId);

  const byType: Record<string, number> = {};
  const byStatus: Record<string, number> = {};

  for (const item of items) {
    byType[item.type] = (byType[item.type] || 0) + 1;
    byStatus[item.status] = (byStatus[item.status] || 0) + 1;
  }

  // Count certificates expiring within 30 days
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() + 30);
  const expiringSoon = items.filter(
    (i) =>
      i.type === ContentType.Certificate &&
      i.expires_at &&
      new Date(i.expires_at) <= cutoff &&
      i.status !== ContentStatus.Archived,
  ).length;

  return {
    total: items.length,
    by_type: byType,
    by_status: byStatus,
    expiring_soon: expiringSoon,
  };
}

/**
 * Get published learning articles for the customer's internal portal.
 */
export async function getPublishedLearning(
  organizationId: string,
  _language = 'en',
  limit = 10,
): Promise<ContentItem[]> {
  return listContent({
    type: ContentType.Learning,
    status: ContentStatus.Published,
    organization_id: organizationId,
    limit,
    offset: 0,
  });
}
