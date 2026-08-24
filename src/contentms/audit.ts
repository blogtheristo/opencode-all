/**
 * Firehorse ContentMS — Audit Trail (Human-in-the-Loop)
 *
 * Every content action is logged for compliance and learning traceability.
 * HIL gates ensure humans review/approve before publish or artifact generation.
 *
 * Audit entries are immutable — append-only log per content item.
 * Supports: created, updated, status_changed, published, shared,
 * hil_review_requested, hil_approved, hil_rejected, artifact_published.
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
  type AuditEntry,
  type ContentStatus,
  type HilReviewRequest,
  type HilReviewResult,
} from './types.js';

// ============================================================================
// AUDIT STORE — Append-only log (in-memory MVP, Supabase in production)
// ============================================================================

const auditLog: AuditEntry[] = [];

/**
 * Record an audit event for a content item.
 */
export function recordAudit(params: {
  content_id: string;
  action: AuditAction;
  actor_id: string;
  actor_name: string;
  details?: string;
  previous_status?: ContentStatus;
  new_status?: ContentStatus;
  artifact_path?: string;
}): AuditEntry {
  const entry: AuditEntry = {
    id: randomUUID(),
    content_id: params.content_id,
    action: params.action,
    actor_id: params.actor_id,
    actor_name: params.actor_name,
    details: params.details,
    previous_status: params.previous_status,
    new_status: params.new_status,
    artifact_path: params.artifact_path,
    created_at: new Date().toISOString(),
  };

  auditLog.push(entry);
  logger.info('ContentMS audit', {
    action: entry.action,
    content_id: entry.content_id,
    actor: entry.actor_name,
  });
  return entry;
}

/**
 * Get the full audit trail for a content item — ordered newest first.
 */
export function getAuditTrail(contentId: string): AuditEntry[] {
  return auditLog
    .filter((e) => e.content_id === contentId)
    .sort((a, b) => b.created_at.localeCompare(a.created_at));
}

/**
 * Get all audit entries for an organization (across all content items).
 * Requires joining with content store — caller provides content IDs.
 */
export function getAuditByAction(action: AuditAction): AuditEntry[] {
  return auditLog
    .filter((e) => e.action === action)
    .sort((a, b) => b.created_at.localeCompare(a.created_at));
}

/**
 * Get pending HIL reviews — items where review was requested but not yet decided.
 */
export function getPendingReviews(): AuditEntry[] {
  const requested = new Set<string>();
  const decided = new Set<string>();

  for (const entry of auditLog) {
    if (entry.action === AuditAction.HilReviewRequested) {
      requested.add(entry.content_id);
    }
    if (
      entry.action === AuditAction.HilApproved ||
      entry.action === AuditAction.HilRejected
    ) {
      decided.add(entry.content_id);
    }
  }

  // Items with open review requests
  const pending = [...requested].filter((id) => !decided.has(id));
  return auditLog
    .filter((e) =>
      e.action === AuditAction.HilReviewRequested &&
      pending.includes(e.content_id),
    )
    .sort((a, b) => b.created_at.localeCompare(a.created_at));
}

// ============================================================================
// HIL REVIEW WORKFLOW
// ============================================================================

/**
 * Request a human review for a content item.
 * This creates a "review gate" — content cannot be published until approved.
 */
export function requestHilReview(request: HilReviewRequest): AuditEntry {
  return recordAudit({
    content_id: request.content_id,
    action: AuditAction.HilReviewRequested,
    actor_id: request.reviewer_id,
    actor_name: request.reviewer_name,
    details: request.review_notes || 'HIL review requested',
  });
}

/**
 * Approve a content item after human review.
 * Returns the review result and the audit entry.
 */
export function approveHilReview(
  request: HilReviewRequest,
): HilReviewResult {
  const entry = recordAudit({
    content_id: request.content_id,
    action: AuditAction.HilApproved,
    actor_id: request.reviewer_id,
    actor_name: request.reviewer_name,
    details: request.review_notes || 'Approved by human reviewer',
  });

  return {
    content_id: request.content_id,
    action: AuditAction.HilApproved,
    reviewer: request.reviewer_name,
    notes: request.review_notes,
    reviewed_at: entry.created_at,
  };
}

/**
 * Reject a content item after human review.
 * Content goes back to draft for revision.
 */
export function rejectHilReview(
  request: HilReviewRequest,
): HilReviewResult {
  const entry = recordAudit({
    content_id: request.content_id,
    action: AuditAction.HilRejected,
    actor_id: request.reviewer_id,
    actor_name: request.reviewer_name,
    details: request.review_notes || 'Rejected by human reviewer — revision needed',
  });

  return {
    content_id: request.content_id,
    action: AuditAction.HilRejected,
    reviewer: request.reviewer_name,
    notes: request.review_notes,
    reviewed_at: entry.created_at,
  };
}

/**
 * Check if a content item has been HIL-approved (no pending rejection).
 */
export function isHilApproved(contentId: string): boolean {
  const trail = getAuditTrail(contentId);
  // Find the most recent review decision
  const lastDecision = trail.find(
    (e) =>
      e.action === AuditAction.HilApproved ||
      e.action === AuditAction.HilRejected,
  );
  return lastDecision?.action === AuditAction.HilApproved;
}

/**
 * Get audit stats — summary of all actions.
 */
export function getAuditStats(): Record<string, number> {
  const stats: Record<string, number> = {};
  for (const entry of auditLog) {
    stats[entry.action] = (stats[entry.action] || 0) + 1;
  }
  return stats;
}

/**
 * Clear all audit state. For test isolation only.
 */
export function resetAuditStore(): void {
  auditLog.length = 0;
}
