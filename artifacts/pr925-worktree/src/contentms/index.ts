/**
 * Firehorse ContentMS — Main Entry Point
 *
 * Customer-facing Evidence Vault + Learning Content Management.
 * The 5 Firehorse Content Agents: Document Classifier, Expiration Tracker,
 * Search Agent, Access Controller, Archive Manager.
 *
 * Code-Version: 3.0.0
 * Introduced-In: PR-TBD (ContentMS V3 — Memory + HIL + Artifacts)
 * Branch: claude/build-contentms-mvp-Q2nU9
 * Date: 2026-03-23
 * Owner: Claude Code (Opus 4.6)
 */

// Types & schemas
export * from './types.js';

// Core service (includes all 5 agents)
export {
  createContent,
  getContent,
  getContentBySlug,
  listContent,
  updateContent,
  transitionStatus,
  getContentStats,
  getPublishedLearning,
  searchContent,
  getExpiringCertificates,
  createShareLink,
  getSharedContent,
} from './service.js';

// Learning article publisher
export {
  renderMarkdownToHtml,
  renderLearningHtml,
  publishLearningArticle,
} from './blog-publisher.js';

// Artifact publisher (Blog & Legal)
export { publishArtifact } from './artifact-publisher.js';

// Omnichannel distribution (product marketing)
export { distributeContent } from './omnichannel.js';

// Evidence Vault digest
export {
  generateDigest,
  sendDigestEmail,
} from './digest.js';

// Persistent memory
export { contentMemory } from './memory.js';

// Audit trail & HIL review
export {
  recordAudit,
  getAuditTrail,
  getAuditByAction,
  getPendingReviews,
  requestHilReview,
  approveHilReview,
  rejectHilReview,
  isHilApproved,
  getAuditStats,
} from './audit.js';

// Routes
export { default as contentRoutes } from './routes.js';

// MCP tools
export { contentMcpTools } from './mcp-tools.js';
