/**
 * Social Scheduler — Approval Digest Email
 *
 * Sends a daily email with pending LinkedIn post drafts.
 * CEO replies with "approve", "edit: [changes]", or "reject" per post.
 *
 * Dark theme HTML matching CEO Cockpit style.
 */

import type { SocialPost } from './types.js';

// ============================================================================
// HELPERS
// ============================================================================

function esc(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

const CATEGORY_LABELS: Record<string, string> = {
  thought_leadership: 'Thought Leadership',
  product_update: 'Product Update',
  compliance_news: 'Compliance News',
  case_study: 'Case Study',
  webinar_promo: 'Webinar Promo',
  hiring: 'Hiring',
};

const CATEGORY_COLORS: Record<string, string> = {
  thought_leadership: '#ffaa00',
  product_update: '#00d4aa',
  compliance_news: '#60a5fa',
  case_study: '#c084fc',
  webinar_promo: '#ff6b6b',
  hiring: '#00ff88',
};

// ============================================================================
// HTML TEMPLATE
// ============================================================================

export function buildApprovalDigestHtml(posts: SocialPost[]): string {
  if (posts.length === 0) {
    return buildEmptyDigestHtml();
  }

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;background:#111;border-radius:8px;overflow:hidden;">

  <!-- Header -->
  <tr><td style="padding:20px 20px 12px;border-bottom:1px solid #222;">
    <h1 style="margin:0;font-size:16px;color:#fff;">LinkedIn Post Queue</h1>
    <p style="margin:4px 0 0;font-size:13px;color:#888;">${posts.length} post${posts.length === 1 ? '' : 's'} awaiting your review</p>
  </td></tr>

  <!-- Instructions -->
  <tr><td style="padding:12px 20px;border-bottom:1px solid #1a1a1a;">
    <p style="margin:0;font-size:12px;color:#888;">
      Reply to this email with the post number and action:<br>
      <span style="color:#00d4aa;">approve 1</span> ·
      <span style="color:#ffaa00;">edit 1: your changes here</span> ·
      <span style="color:#ff4444;">reject 1</span>
    </p>
  </td></tr>

  <!-- Posts -->
  ${posts.map((post, i) => renderPostHtml(post, i + 1)).join('')}

  <!-- Footer -->
  <tr><td style="padding:12px 20px;font-size:11px;color:#555;">
    Social Scheduler · Unapproved posts will not be published
  </td></tr>

</table>
</body>
</html>`;
}

function renderPostHtml(post: SocialPost, num: number): string {
  const catLabel = CATEGORY_LABELS[post.category] || post.category;
  const catColor = CATEGORY_COLORS[post.category] || '#888';
  const scheduleStr = post.scheduled_at
    ? new Date(post.scheduled_at).toLocaleString('en-GB', {
        timeZone: 'Europe/Helsinki',
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'Unscheduled';

  // Preserve line breaks in content
  const contentHtml = esc(post.content).replace(/\n/g, '<br>');

  return `
  <tr><td style="padding:16px 20px;border-bottom:1px solid #1a1a1a;">
    <!-- Post Header -->
    <table width="100%" cellpadding="0" cellspacing="0"><tr>
      <td>
        <span style="font-size:14px;color:#fff;font-weight:700;">#${num}</span>
        <span style="font-size:11px;color:${catColor};text-transform:uppercase;margin-left:8px;font-weight:600;">${esc(catLabel)}</span>
      </td>
      <td style="text-align:right;">
        <span style="font-size:11px;color:#666;">${esc(scheduleStr)}</span>
      </td>
    </tr></table>

    <!-- Post Content -->
    <div style="margin:10px 0;padding:12px;background:#1a1a1a;border-radius:6px;border-left:3px solid ${catColor};">
      <p style="margin:0;font-size:13px;color:#e0e0e0;line-height:1.5;white-space:pre-wrap;">${contentHtml}</p>
    </div>

    <!-- Actions reminder -->
    <p style="margin:4px 0 0;font-size:11px;color:#555;">
      Reply: <code style="color:#00d4aa;">approve ${num}</code> · <code style="color:#ffaa00;">edit ${num}: ...</code> · <code style="color:#ff4444;">reject ${num}</code>
    </p>
  </td></tr>`;
}

function buildEmptyDigestHtml(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;background:#111;border-radius:8px;overflow:hidden;">
  <tr><td style="padding:20px;text-align:center;">
    <h1 style="margin:0;font-size:16px;color:#fff;">LinkedIn Post Queue</h1>
    <p style="margin:10px 0 0;font-size:13px;color:#888;">No posts awaiting review. Content calendar is clear.</p>
  </td></tr>
</table>
</body>
</html>`;
}

// ============================================================================
// PLAIN TEXT
// ============================================================================

export function buildApprovalDigestPlainText(posts: SocialPost[]): string {
  if (posts.length === 0) {
    return 'LINKEDIN POST QUEUE\n\nNo posts awaiting review.';
  }

  const lines: string[] = [];
  const div = '─'.repeat(50);

  lines.push('LINKEDIN POST QUEUE');
  lines.push(`${posts.length} post${posts.length === 1 ? '' : 's'} awaiting review`);
  lines.push(div);
  lines.push('Reply with: approve N · edit N: changes · reject N');
  lines.push('');

  posts.forEach((post, i) => {
    const num = i + 1;
    const catLabel = CATEGORY_LABELS[post.category] || post.category;
    const scheduleStr = post.scheduled_at
      ? new Date(post.scheduled_at).toLocaleString('en-GB', {
          timeZone: 'Europe/Helsinki',
          weekday: 'short',
          day: 'numeric',
          month: 'short',
          hour: '2-digit',
          minute: '2-digit',
        })
      : 'Unscheduled';

    lines.push(`#${num} [${catLabel.toUpperCase()}] — ${scheduleStr}`);
    lines.push(div);
    lines.push(post.content);
    lines.push('');
  });

  lines.push(div);
  lines.push('Unapproved posts will not be published.');

  return lines.join('\n');
}
