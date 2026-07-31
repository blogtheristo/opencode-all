/**
 * Firehorse ContentMS — Evidence Vault Digest
 *
 * Generates weekly/daily digests for customers:
 *   - Certificates expiring soon (Expiration Tracker)
 *   - Recently uploaded documents
 *   - Learning articles published
 *
 * Code-Version: 2.0.0
 * Introduced-In: PR-TBD (ContentMS V1 — Customer-Facing)
 * Branch: claude/build-contentms-mvp-Q2nU9
 * Date: 2026-03-22
 * Owner: Claude Code (Opus 4.6)
 */

import logger from '../utils/logger.js';
import emailService from '../services/email.service.js';
import { getExpiringCertificates, listContent } from './service.js';
import { type ContentItem, type DigestRequest, DigestRequestSchema, type DigestResult } from './types.js';

// ============================================================================
// DIGEST GENERATOR
// ============================================================================

/**
 * Generate an Evidence Vault digest for a customer organization.
 */
export async function generateDigest(request: DigestRequest): Promise<DigestResult> {
  const parsed = DigestRequestSchema.parse(request);
  const now = new Date();

  // Calculate period cutoff
  const cutoff = new Date(now);
  if (parsed.period === 'daily') {
    cutoff.setDate(cutoff.getDate() - 1);
  } else {
    cutoff.setDate(cutoff.getDate() - 7);
  }

  // Get expiring certificates (within 30 days)
  const expiringCerts = parsed.include_expiring
    ? await getExpiringCertificates(parsed.organization_id, 30)
    : [];

  // Get recent uploads
  let recentUploads: ContentItem[] = [];
  if (parsed.include_recent_uploads) {
    const all = await listContent({
      organization_id: parsed.organization_id,
      limit: 50,
      offset: 0,
    });
    recentUploads = all.filter((item) => {
      const itemDate = new Date(item.created_at);
      return itemDate >= cutoff;
    });
  }

  const html = renderDigestHtml(expiringCerts, recentUploads, parsed);

  logger.info('Evidence Vault digest generated', {
    period: parsed.period,
    organization_id: parsed.organization_id,
    expiring: expiringCerts.length,
    recent: recentUploads.length,
  });

  return {
    period: parsed.period,
    language: parsed.language,
    organization_id: parsed.organization_id,
    expiring_certificates: expiringCerts,
    recent_uploads: recentUploads,
    generated_at: now.toISOString(),
    html,
  };
}

/**
 * Generate and send digest via email.
 */
export async function sendDigestEmail(to: string, request: DigestRequest): Promise<void> {
  const digest = await generateDigest(request);

  if (digest.expiring_certificates.length === 0 && digest.recent_uploads.length === 0) {
    logger.info('No content for digest, skipping email', {
      period: request.period,
      to,
    });
    return;
  }

  const subject =
    request.period === 'daily'
      ? `Evidence Vault — ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
      : `Evidence Vault Weekly — Week ${getWeekNumber(new Date())}`;

  await emailService.sendRawEmail({
    to,
    subject,
    html: digest.html,
  });
  logger.info('Digest email sent', {
    to,
    period: request.period,
    expiring: digest.expiring_certificates.length,
    recent: digest.recent_uploads.length,
  });
}

// ============================================================================
// HTML RENDERING
// ============================================================================

function renderDigestHtml(
  expiring: ContentItem[],
  recent: ContentItem[],
  request: DigestRequest,
): string {
  const title =
    request.period === 'daily' ? 'Evidence Vault — Daily Digest' : 'Evidence Vault — Weekly Digest';

  return `
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; background: #0f172a; color: #f1f5f9; padding: 24px;">
  <div style="border-bottom: 2px solid #2563eb; padding-bottom: 16px; margin-bottom: 24px;">
    <h1 style="font-size: 24px; margin: 0; color: #e2e8f0;">${title}</h1>
    <p style="font-size: 14px; color: #94a3b8; margin: 4px 0 0;">
      ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
    </p>
  </div>
  ${expiring.length > 0 ? renderExpiringSection(expiring) : ''}
  ${recent.length > 0 ? renderRecentSection(recent) : ''}
  ${
    expiring.length === 0 && recent.length === 0
      ? '<p style="color: #94a3b8; text-align: center; padding: 32px 0;">No updates this period.</p>'
      : ''
  }
  <div style="border-top: 1px solid #334155; padding-top: 16px; margin-top: 24px; text-align: center;">
    <p style="font-size: 12px; color: #64748b;">
      Firehorse ContentMS · Evidence Vault · Lifetime Oy
    </p>
  </div>
</div>`;
}

function renderExpiringSection(items: ContentItem[]): string {
  const rows = items
    .map((item) => {
      const expiresAt = item.expires_at ? new Date(item.expires_at) : null;
      const daysLeft = expiresAt ? Math.ceil((expiresAt.getTime() - Date.now()) / 86400000) : null;
      const urgency = daysLeft !== null && daysLeft <= 7 ? '#ef4444' : '#f59e0b';
      const daysText =
        daysLeft !== null ? `${daysLeft} day${daysLeft === 1 ? '' : 's'} left` : 'No expiry date';

      return `
      <tr>
        <td style="padding: 8px 0; border-bottom: 1px solid #1e293b;">
          <div style="font-size: 14px; color: #e2e8f0; font-weight: 600;">${escapeHtml(item.title)}</div>
          <div style="font-size: 12px; color: #94a3b8; margin-top: 2px;">
            ${item.issued_by ? escapeHtml(item.issued_by) + ' · ' : ''}
            <span style="color: ${urgency}; font-weight: 600;">${daysText}</span>
            ${item.regulation_tags?.length ? ' · ' + item.regulation_tags.join(', ') : ''}
          </div>
        </td>
      </tr>`;
    })
    .join('');

  return `
  <div style="margin-bottom: 24px;">
    <h2 style="font-size: 16px; color: #ef4444; margin: 0 0 12px; text-transform: uppercase; letter-spacing: 1px;">
      ⚠ Expiring Certificates (${items.length})
    </h2>
    <table style="width: 100%;">${rows}</table>
  </div>`;
}

function renderRecentSection(items: ContentItem[]): string {
  const typeLabels: Record<string, string> = {
    document: 'Document',
    certificate: 'Certificate',
    report: 'Report',
    learning: 'Learning',
    template: 'Template',
  };

  const rows = items
    .map((item) => {
      const date = new Date(item.created_at).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
      const typeLabel = typeLabels[item.type] || item.type;
      return `
      <tr>
        <td style="padding: 8px 0; border-bottom: 1px solid #1e293b;">
          <div style="font-size: 14px; color: #e2e8f0; font-weight: 600;">${escapeHtml(item.title)}</div>
          <div style="font-size: 12px; color: #94a3b8; margin-top: 2px;">
            ${typeLabel} · ${escapeHtml(item.category)} · ${date}
            ${item.regulation_tags?.length ? ' · ' + item.regulation_tags.join(', ') : ''}
          </div>
        </td>
      </tr>`;
    })
    .join('');

  return `
  <div style="margin-bottom: 24px;">
    <h2 style="font-size: 16px; color: #22c55e; margin: 0 0 12px; text-transform: uppercase; letter-spacing: 1px;">
      Recent Uploads (${items.length})
    </h2>
    <table style="width: 100%;">${rows}</table>
  </div>`;
}

function escapeHtml(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}
