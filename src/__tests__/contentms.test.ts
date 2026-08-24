/**
 * Firehorse ContentMS — Unit Tests (Evidence Vault)
 *
 * Tests for: CRUD, auto-classification, expiration tracking,
 * search, secure sharing, learning publishing, markdown rendering.
 */

import { beforeEach, describe, expect, it } from 'vitest';
import {
  AuditAction,
  ContentCategory,
  ContentLanguage,
  ContentStatus,
  ContentTag,
  ContentType,
  ContentVisibility,
  createContent,
  type CreateContentInput,
  createShareLink,
  getContent,
  getContentBySlug,
  getContentStats,
  getExpiringCertificates,
  getSharedContent,
  listContent,
  searchContent,
  transitionStatus,
  updateContent,
} from '../contentms/index.js';
import { renderMarkdownToHtml } from '../contentms/blog-publisher.js';
import {
  approveHilReview,
  getAuditStats,
  getAuditTrail,
  getPendingReviews,
  isHilApproved,
  rejectHilReview,
  requestHilReview,
  resetAuditStore,
} from '../contentms/audit.js';
import { contentMemory } from '../contentms/memory.js';

// ============================================================================
// TEST ISOLATION — reset all module-level state between tests
// ============================================================================

beforeEach(() => {
  contentMemory.reset();
  resetAuditStore();
});

// ============================================================================
// HELPERS
// ============================================================================

let slugCounter = 0;

function makeInput(overrides?: Partial<CreateContentInput>): CreateContentInput {
  slugCounter++;
  return {
    title: 'ISO 14001 Environmental Certificate',
    slug: `test-doc-${slugCounter}-${Date.now()}`,
    type: ContentType.Document,
    status: ContentStatus.Draft,
    language: ContentLanguage.EN,
    category: ContentCategory.Compliance,
    visibility: ContentVisibility.Team,
    body_markdown: '# Environmental Management Certificate\n\nISO 14001 certified for environmental management system.',
    author: 'Test User',
    owner_id: 'user-001',
    organization_id: 'org-001',
    ...overrides,
  };
}

function makeCertInput(overrides?: Partial<CreateContentInput>): CreateContentInput {
  slugCounter++;
  const expiresIn10Days = new Date();
  expiresIn10Days.setDate(expiresIn10Days.getDate() + 10);

  return makeInput({
    title: 'Renewable Energy Certificate Q3',
    slug: `cert-${slugCounter}-${Date.now()}`,
    type: ContentType.Certificate,
    body_markdown: 'Guarantee of Origin certificate for renewable energy sourcing Q3 2026.',
    issued_by: 'Fingrid Datahub',
    issued_date: '2026-07-01T00:00:00.000Z',
    expires_at: expiresIn10Days.toISOString(),
    ...overrides,
  });
}

// ============================================================================
// TESTS: CRUD
// ============================================================================

describe('ContentMS Evidence Vault — CRUD', () => {
  it('creates a document with auto-generated ID and HTML', async () => {
    const item = await createContent(makeInput());
    expect(item.id).toBeDefined();
    expect(item.title).toBe('ISO 14001 Environmental Certificate');
    expect(item.body_html).toContain('<h1>');
    expect(item.type).toBe(ContentType.Document);
    expect(item.owner_id).toBe('user-001');
    expect(item.organization_id).toBe('org-001');
  });

  it('retrieves a content item by ID', async () => {
    const created = await createContent(makeInput());
    const fetched = await getContent(created.id);
    expect(fetched).not.toBeNull();
    expect(fetched!.id).toBe(created.id);
  });

  it('retrieves a content item by slug', async () => {
    const input = makeInput();
    await createContent(input);
    const fetched = await getContentBySlug(input.slug);
    expect(fetched).not.toBeNull();
    expect(fetched!.slug).toBe(input.slug);
  });

  it('returns null for non-existent ID', async () => {
    const result = await getContent('00000000-0000-0000-0000-000000000000');
    expect(result).toBeNull();
  });

  it('lists content with filters', async () => {
    await createContent(makeInput({ category: ContentCategory.Safety }));
    await createContent(makeInput({ category: ContentCategory.Sustainability }));

    const safety = await listContent({
      category: ContentCategory.Safety,
      organization_id: 'org-001',
      limit: 100,
      offset: 0,
    });
    expect(safety.length).toBeGreaterThanOrEqual(1);
    expect(safety.every((i) => i.category === ContentCategory.Safety)).toBe(true);
  });

  it('updates a content item', async () => {
    const item = await createContent(makeInput());
    // Small delay to ensure different timestamp
    await new Promise((r) => setTimeout(r, 5));
    const updated = await updateContent(item.id, { title: 'Updated Title' });
    expect(updated).not.toBeNull();
    expect(updated!.title).toBe('Updated Title');
  });

  it('re-renders HTML when markdown is updated', async () => {
    const item = await createContent(makeInput());
    const updated = await updateContent(item.id, { body_markdown: '## New heading' });
    expect(updated!.body_html).toContain('<h2>New heading</h2>');
  });
});

// ============================================================================
// TESTS: DOCUMENT CLASSIFIER (Agent 1)
// ============================================================================

describe('ContentMS — Document Classifier', () => {
  it('auto-tags ISO 14001 content', async () => {
    const item = await createContent(makeInput({
      title: 'ISO 14001 Environmental Management Certificate',
      body_markdown: 'Our environmental management system is ISO 14001 certified.',
    }));
    expect(item.regulation_tags).toContain(ContentTag.ISO14001);
    expect(item.ai_classification_confidence).toBeGreaterThan(0);
  });

  it('auto-tags EU ETS content', async () => {
    const item = await createContent(makeInput({
      title: 'EU ETS Benchmark Report 2026',
      body_markdown: 'Emission trading system benchmark analysis.',
    }));
    expect(item.regulation_tags).toContain(ContentTag.EUETS);
  });

  it('auto-tags renewable energy certificates', async () => {
    const item = await createContent(makeCertInput());
    expect(item.regulation_tags).toContain(ContentTag.RenewableEnergy);
  });

  it('detects multiple regulations', async () => {
    const item = await createContent(makeInput({
      title: 'CSRD Report with Scope 3 Analysis',
      body_markdown: 'Corporate sustainability reporting directive. Scope 3 value chain emissions.',
    }));
    expect(item.regulation_tags).toContain(ContentTag.CSRD);
    expect(item.regulation_tags).toContain(ContentTag.Scope3);
    expect(item.ai_classification_confidence).toBeGreaterThan(0.5);
  });

  it('re-classifies on update', async () => {
    const item = await createContent(makeInput({
      title: 'Generic Document',
      body_markdown: 'Some content.',
    }));
    const updated = await updateContent(item.id, {
      title: 'CBAM Carbon Border Report',
      body_markdown: 'Carbon border adjustment mechanism analysis.',
    });
    expect(updated!.regulation_tags).toContain(ContentTag.CBAM);
  });
});

// ============================================================================
// TESTS: EXPIRATION TRACKER (Agent 2)
// ============================================================================

describe('ContentMS — Expiration Tracker', () => {
  it('finds certificates expiring within 30 days', async () => {
    await createContent(makeCertInput()); // Expires in 10 days
    const expiring = await getExpiringCertificates('org-001', 30);
    expect(expiring.length).toBeGreaterThanOrEqual(1);
    expect(expiring[0].type).toBe(ContentType.Certificate);
  });

  it('excludes archived certificates', async () => {
    const cert = await createContent(makeCertInput());
    await transitionStatus(cert.id, ContentStatus.Review);
    await transitionStatus(cert.id, ContentStatus.Approved);
    await transitionStatus(cert.id, ContentStatus.Published);
    await transitionStatus(cert.id, ContentStatus.Archived);

    const expiring = await getExpiringCertificates('org-001', 30);
    const archived = expiring.find((i) => i.id === cert.id);
    expect(archived).toBeUndefined();
  });

  it('sorts by soonest expiry first', async () => {
    const soon = new Date();
    soon.setDate(soon.getDate() + 5);
    const later = new Date();
    later.setDate(later.getDate() + 20);

    await createContent(makeCertInput({ expires_at: later.toISOString() }));
    await createContent(makeCertInput({ expires_at: soon.toISOString() }));

    const expiring = await getExpiringCertificates('org-001', 30);
    if (expiring.length >= 2) {
      const first = new Date(expiring[0].expires_at!).getTime();
      const second = new Date(expiring[1].expires_at!).getTime();
      expect(first).toBeLessThanOrEqual(second);
    }
  });
});

// ============================================================================
// TESTS: SEARCH AGENT (Agent 3)
// ============================================================================

describe('ContentMS — Search Agent', () => {
  it('finds documents by title keyword', async () => {
    await createContent(makeInput({
      title: 'Unique Searchable Safety Report XYZ',
      body_markdown: 'Fire safety assessment for warehouse.',
    }));
    const result = await searchContent('Unique Searchable Safety', 'org-001');
    expect(result.items.length).toBeGreaterThanOrEqual(1);
    expect(result.query).toBe('Unique Searchable Safety');
  });

  it('finds documents by body content', async () => {
    await createContent(makeInput({
      title: 'Regular Title',
      body_markdown: 'Contains unicorn-rainbow-keyword that is very specific.',
    }));
    const result = await searchContent('unicorn-rainbow-keyword', 'org-001');
    expect(result.items.length).toBeGreaterThanOrEqual(1);
  });

  it('scopes search to organization', async () => {
    await createContent(makeInput({
      title: 'Org Scoped Doc ZZZ',
      organization_id: 'org-other',
    }));
    const result = await searchContent('Org Scoped Doc ZZZ', 'org-001');
    expect(result.items.length).toBe(0);
  });
});

// ============================================================================
// TESTS: ACCESS CONTROLLER (Agent 4)
// ============================================================================

describe('ContentMS — Access Controller', () => {
  it('creates a share link with token and expiry', async () => {
    const item = await createContent(makeInput());
    const link = await createShareLink({
      content_id: item.id,
      expires_in_hours: 24,
      created_by: 'user-001',
    });
    expect(link.token).toBeDefined();
    expect(link.url).toContain(link.token);
    expect(link.expires_at).toBeDefined();
  });

  it('retrieves document via share token', async () => {
    const item = await createContent(makeInput());
    const link = await createShareLink({
      content_id: item.id,
      expires_in_hours: 24,
      created_by: 'user-001',
    });
    const shared = await getSharedContent(link.token);
    expect(shared).not.toBeNull();
    expect(shared!.id).toBe(item.id);
  });

  it('returns null for invalid token', async () => {
    const shared = await getSharedContent('invalid-token');
    expect(shared).toBeNull();
  });

  it('increments access count on each retrieval', async () => {
    const item = await createContent(makeInput());
    const link = await createShareLink({
      content_id: item.id,
      expires_in_hours: 24,
      created_by: 'user-001',
    });
    await getSharedContent(link.token);
    await getSharedContent(link.token);
    const latest = await getContent(item.id);
    const sharedLink = latest!.shared_links!.find((l) => l.token === link.token);
    expect(sharedLink!.accessed_count).toBe(2);
  });
});

// ============================================================================
// TESTS: STATUS TRANSITIONS
// ============================================================================

describe('ContentMS Status Transitions', () => {
  it('allows draft → review', async () => {
    const item = await createContent(makeInput());
    const updated = await transitionStatus(item.id, ContentStatus.Review);
    expect(updated!.status).toBe(ContentStatus.Review);
  });

  it('allows review → approved', async () => {
    const item = await createContent(makeInput());
    await transitionStatus(item.id, ContentStatus.Review);
    const updated = await transitionStatus(item.id, ContentStatus.Approved);
    expect(updated!.status).toBe(ContentStatus.Approved);
  });

  it('allows approved → published (sets published_at)', async () => {
    const item = await createContent(makeInput());
    await transitionStatus(item.id, ContentStatus.Review);
    await transitionStatus(item.id, ContentStatus.Approved);
    const updated = await transitionStatus(item.id, ContentStatus.Published);
    expect(updated!.status).toBe(ContentStatus.Published);
    expect(updated!.published_at).toBeDefined();
  });

  it('rejects invalid transition draft → published', async () => {
    const item = await createContent(makeInput());
    await expect(transitionStatus(item.id, ContentStatus.Published)).rejects.toThrow('Invalid transition');
  });
});

// ============================================================================
// TESTS: ARCHIVE MANAGER — Stats (Agent 5)
// ============================================================================

describe('ContentMS — Archive Manager Stats', () => {
  it('returns stats with by_type and by_status breakdowns', async () => {
    const stats = await getContentStats('org-001');
    expect(stats.total).toBeGreaterThanOrEqual(0);
    expect(typeof stats.by_type).toBe('object');
    expect(typeof stats.by_status).toBe('object');
    expect(typeof stats.expiring_soon).toBe('number');
  });
});

// ============================================================================
// TESTS: MARKDOWN RENDERING
// ============================================================================

describe('Markdown Renderer', () => {
  it('renders headings', () => {
    expect(renderMarkdownToHtml('# Title')).toContain('<h1>Title</h1>');
    expect(renderMarkdownToHtml('## Subtitle')).toContain('<h2>Subtitle</h2>');
    expect(renderMarkdownToHtml('### Section')).toContain('<h3>Section</h3>');
  });

  it('renders bold and italic', () => {
    expect(renderMarkdownToHtml('**bold**')).toContain('<strong>bold</strong>');
    expect(renderMarkdownToHtml('*italic*')).toContain('<em>italic</em>');
  });

  it('renders links', () => {
    const html = renderMarkdownToHtml('[DWS](https://dws10.com)');
    expect(html).toContain('href="https://dws10.com"');
    expect(html).toContain('>DWS</a>');
  });

  it('renders code blocks with escaping', () => {
    const html = renderMarkdownToHtml('```ts\nconst x = 1;\n```');
    expect(html).toContain('<pre><code');
    expect(html).toContain('const x = 1;');
  });

  it('renders inline code', () => {
    expect(renderMarkdownToHtml('Use `npm install`')).toContain('<code>npm install</code>');
  });
});

// ============================================================================
// TESTS: BLOG & LEGAL CONTENT TYPES
// ============================================================================

describe('ContentMS — Blog & Legal Types', () => {
  it('creates a blog post', async () => {
    const item = await createContent(makeInput({
      title: 'EU AI Act Blog Post',
      type: ContentType.Blog,
      body_markdown: '# EU AI Act\n\nNew regulations for artificial intelligence.',
      category: ContentCategory.Compliance,
    }));
    expect(item.type).toBe(ContentType.Blog);
    expect(item.regulation_tags).toContain(ContentTag.EUAIAct);
  });

  it('creates a legal document', async () => {
    const item = await createContent(makeInput({
      title: 'Privacy Policy — Lifetime Oy',
      type: ContentType.Legal,
      body_markdown: '# Privacy Policy\n\nGDPR data protection policy for Lifetime Oy.',
      category: ContentCategory.Compliance,
    }));
    expect(item.type).toBe(ContentType.Legal);
    expect(item.regulation_tags).toContain(ContentTag.GDPR);
  });
});

// ============================================================================
// TESTS: AUDIT TRAIL
// ============================================================================

describe('ContentMS — Audit Trail', () => {
  it('records create audit entry on content creation', async () => {
    const item = await createContent(makeInput({
      title: 'Audited Document',
    }));
    const trail = getAuditTrail(item.id);
    expect(trail.length).toBeGreaterThanOrEqual(1);
    expect(trail[0].action).toBe(AuditAction.Created);
    expect(trail[0].content_id).toBe(item.id);
  });

  it('records status change audit on transition', async () => {
    const item = await createContent(makeInput());
    await transitionStatus(item.id, ContentStatus.Review);
    const trail = getAuditTrail(item.id);
    const statusEntry = trail.find((e) => e.action === AuditAction.StatusChanged);
    expect(statusEntry).toBeDefined();
    expect(statusEntry!.previous_status).toBe(ContentStatus.Draft);
    expect(statusEntry!.new_status).toBe(ContentStatus.Review);
  });

  it('records update audit on content change', async () => {
    const item = await createContent(makeInput());
    await updateContent(item.id, { title: 'Changed Title' });
    const trail = getAuditTrail(item.id);
    const updateEntry = trail.find((e) => e.action === AuditAction.Updated);
    expect(updateEntry).toBeDefined();
  });

  it('returns audit stats', async () => {
    await createContent(makeInput({ title: 'Stats Test Doc' }));
    const stats = getAuditStats();
    expect(typeof stats).toBe('object');
    expect(stats[AuditAction.Created]).toBeGreaterThan(0);
  });
});

// ============================================================================
// TESTS: HIL REVIEW (Human-in-the-Loop)
// ============================================================================

describe('ContentMS — HIL Review', () => {
  it('creates a review request', async () => {
    const item = await createContent(makeInput({ title: 'HIL Review Test' }));
    const entry = requestHilReview({
      content_id: item.id,
      reviewer_id: 'reviewer-001',
      reviewer_name: 'Test Reviewer',
      review_notes: 'Please review for compliance',
    });
    expect(entry.action).toBe(AuditAction.HilReviewRequested);
    expect(entry.content_id).toBe(item.id);
  });

  it('approves content via HIL', async () => {
    const item = await createContent(makeInput({ title: 'HIL Approve Test' }));
    requestHilReview({
      content_id: item.id,
      reviewer_id: 'reviewer-001',
      reviewer_name: 'Test Reviewer',
    });
    const result = approveHilReview({
      content_id: item.id,
      reviewer_id: 'reviewer-001',
      reviewer_name: 'Test Reviewer',
      review_notes: 'Looks good',
    });
    expect(result.action).toBe(AuditAction.HilApproved);
    expect(isHilApproved(item.id)).toBe(true);
  });

  it('rejects content via HIL', async () => {
    const item = await createContent(makeInput({ title: 'HIL Reject Test' }));
    requestHilReview({
      content_id: item.id,
      reviewer_id: 'reviewer-001',
      reviewer_name: 'Test Reviewer',
    });
    const result = rejectHilReview({
      content_id: item.id,
      reviewer_id: 'reviewer-001',
      reviewer_name: 'Test Reviewer',
      review_notes: 'Needs more detail on scope 3',
    });
    expect(result.action).toBe(AuditAction.HilRejected);
    expect(isHilApproved(item.id)).toBe(false);
  });

  it('tracks pending reviews', async () => {
    const item = await createContent(makeInput({ title: 'Pending Review Test' }));
    requestHilReview({
      content_id: item.id,
      reviewer_id: 'reviewer-002',
      reviewer_name: 'Pending Reviewer',
    });
    const pending = getPendingReviews();
    const found = pending.find((e) => e.content_id === item.id);
    expect(found).toBeDefined();
  });
});

// ============================================================================
// TESTS: PERSISTENT MEMORY
// ============================================================================

describe('ContentMS — Persistent Memory', () => {
  it('stores and retrieves via contentMemory', async () => {
    const item = await createContent(makeInput({ title: 'Memory Test Item' }));
    const retrieved = await contentMemory.get(item.id);
    expect(retrieved).not.toBeNull();
    expect(retrieved!.title).toBe('Memory Test Item');
  });

  it('reports store size', async () => {
    await createContent(makeInput({ title: 'Size Check Item' }));
    expect(contentMemory.size()).toBeGreaterThan(0);
  });

  it('lists all values from memory', async () => {
    await createContent(makeInput({ title: 'Values Check Item' }));
    const values = contentMemory.values();
    expect(values.length).toBeGreaterThan(0);
  });
});
