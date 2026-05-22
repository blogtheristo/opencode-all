/**
 * Regulation Monitor — Email Template
 *
 * Renders the regulatory news digest as a dark-themed HTML email.
 * Matches CEO Cockpit / Outreach Digest styling.
 */

import type { AlertSeverity, MonitorDigest, NewsItem } from './types.js';

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

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
  });
}

const SEVERITY_COLORS: Record<AlertSeverity, string> = {
  urgent: '#ff4444',
  important: '#ffaa00',
  info: '#888',
};

const SEVERITY_LABELS: Record<AlertSeverity, string> = {
  urgent: 'URGENT',
  important: 'IMPORTANT',
  info: 'INFO',
};

const REGULATION_COLORS: Record<string, string> = {
  CBAM: '#ff6b6b',
  CSRD: '#00d4aa',
  FITFOR55: '#60a5fa',
  EPBD: '#c084fc',
  EU_AI_ACT: '#ffaa00',
  ETS: '#ff9f43',
  GREEN_CLAIMS: '#00ff88',
};

// ============================================================================
// HTML
// ============================================================================

export function buildRegulationDigestHtml(digest: MonitorDigest): string {
  const urgentCount = digest.urgentItems.length;
  const totalCount = digest.items.length;

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;background:#111;border-radius:8px;overflow:hidden;">

  <!-- Header -->
  <tr><td style="padding:20px 20px 12px;border-bottom:1px solid #222;">
    <h1 style="margin:0;font-size:16px;color:#fff;">EU Regulation Monitor</h1>
    <p style="margin:4px 0 0;font-size:13px;color:#888;">
      ${totalCount} item${totalCount === 1 ? '' : 's'} · ${urgentCount} urgent · ${digest.date}
    </p>
  </td></tr>

  <!-- Regulation Tags -->
  <tr><td style="padding:12px 20px;border-bottom:1px solid #1a1a1a;">
    ${Object.entries(digest.byRegulation)
      .sort((a, b) => b[1].length - a[1].length)
      .map(([reg, items]) => {
        const color = REGULATION_COLORS[reg] || '#888';
        return `<span style="display:inline-block;padding:2px 8px;margin:2px;font-size:11px;color:${color};border:1px solid ${color};border-radius:4px;">${esc(reg)} (${items.length})</span>`;
      })
      .join(' ')}
  </td></tr>

  <!-- Urgent Items -->
  ${urgentCount > 0 ? `
  <tr><td style="padding:14px 20px;border-bottom:1px solid #1a1a1a;">
    <h3 style="margin:0 0 10px;font-size:11px;color:#ff4444;text-transform:uppercase;letter-spacing:0.5px;">Action Required</h3>
    ${digest.urgentItems.map(renderItemHtml).join('')}
  </td></tr>` : ''}

  <!-- All Items -->
  <tr><td style="padding:14px 20px;border-bottom:1px solid #1a1a1a;">
    <h3 style="margin:0 0 10px;font-size:11px;color:#60a5fa;text-transform:uppercase;letter-spacing:0.5px;">All Updates</h3>
    ${digest.items.slice(0, 15).map(renderItemHtml).join('')}
    ${totalCount > 15 ? `<p style="margin:8px 0 0;font-size:11px;color:#555;">+ ${totalCount - 15} more items</p>` : ''}
  </td></tr>

  <!-- Content Ideas (for LinkedIn) -->
  ${digest.contentItems.length > 0 ? `
  <tr><td style="padding:14px 20px;border-bottom:1px solid #1a1a1a;">
    <h3 style="margin:0 0 10px;font-size:11px;color:#00d4aa;text-transform:uppercase;letter-spacing:0.5px;">LinkedIn Content Ideas</h3>
    <p style="margin:0 0 8px;font-size:12px;color:#888;">These items are good candidates for social posts:</p>
    ${digest.contentItems.map(renderContentIdeaHtml).join('')}
  </td></tr>` : ''}

  <!-- Footer -->
  <tr><td style="padding:12px 20px;font-size:11px;color:#555;">
    EU Regulation Monitor · ${REGULATORY_SOURCES_COUNT} sources · Last 7 days
  </td></tr>

</table>
</body>
</html>`;
}

// Source count as const (avoids circular import)
const REGULATORY_SOURCES_COUNT = 8;

function renderItemHtml(item: NewsItem): string {
  const sevColor = SEVERITY_COLORS[item.severity];
  const sevLabel = SEVERITY_LABELS[item.severity];
  const regTags = item.regulations
    .map(r => {
      const c = REGULATION_COLORS[r] || '#888';
      return `<span style="font-size:10px;color:${c};margin-right:4px;">${r}</span>`;
    })
    .join('');

  return `<div style="margin:0 0 10px;padding:8px 10px;background:#1a1a1a;border-radius:4px;border-left:3px solid ${sevColor};">
    <p style="margin:0;font-size:12px;">
      <span style="color:${sevColor};font-weight:700;font-size:10px;">${sevLabel}</span>
      ${item.customer_impact ? '<span style="color:#00ff88;font-size:10px;margin-left:4px;">CUSTOMER IMPACT</span>' : ''}
      <span style="color:#555;margin-left:4px;">${formatDate(item.published_at)}</span>
    </p>
    <p style="margin:4px 0 2px;">
      <a href="${esc(item.url)}" style="color:#e0e0e0;text-decoration:none;font-size:13px;font-weight:600;">${esc(item.title)}</a>
    </p>
    <p style="margin:0;font-size:11px;color:#888;">${esc(item.summary.slice(0, 200))}</p>
    <p style="margin:4px 0 0;">${regTags}<span style="font-size:10px;color:#555;"> · ${esc(item.source)}</span></p>
  </div>`;
}

function renderContentIdeaHtml(item: NewsItem): string {
  return `<div style="margin:0 0 6px;padding:6px 10px;background:#1a1a1a;border-radius:4px;">
    <p style="margin:0;font-size:12px;color:#e0e0e0;">${esc(item.title)}</p>
    <p style="margin:2px 0 0;font-size:11px;color:#00d4aa;">Angle: React to this regulation update with DWS IQ perspective</p>
  </div>`;
}

// ============================================================================
// PLAIN TEXT
// ============================================================================

export function buildRegulationDigestPlainText(digest: MonitorDigest): string {
  const lines: string[] = [];
  const div = '─'.repeat(50);

  lines.push('EU REGULATION MONITOR');
  lines.push(`${digest.items.length} items · ${digest.urgentItems.length} urgent · ${digest.date}`);
  lines.push(div);

  // Regulation summary
  const regSummary = Object.entries(digest.byRegulation)
    .sort((a, b) => b[1].length - a[1].length)
    .map(([reg, items]) => `${reg}: ${items.length}`)
    .join(' · ');
  lines.push(regSummary);
  lines.push('');

  // Urgent items
  if (digest.urgentItems.length > 0) {
    lines.push('ACTION REQUIRED');
    lines.push(div);
    digest.urgentItems.forEach(item => {
      lines.push(`[${item.severity.toUpperCase()}] ${item.title}`);
      lines.push(`  ${item.regulations.join(', ')} · ${item.source} · ${formatDate(item.published_at)}`);
      lines.push(`  ${item.summary.slice(0, 200)}`);
      lines.push(`  ${item.url}`);
      lines.push('');
    });
  }

  // All items
  lines.push('ALL UPDATES');
  lines.push(div);
  digest.items.slice(0, 15).forEach(item => {
    const sev = item.severity === 'urgent' ? '!!!' : item.severity === 'important' ? '! ' : '  ';
    lines.push(`${sev} ${item.title}`);
    lines.push(`   ${item.regulations.join(', ')} · ${item.source}`);
    lines.push(`   ${item.url}`);
    lines.push('');
  });

  // Content ideas
  if (digest.contentItems.length > 0) {
    lines.push('LINKEDIN CONTENT IDEAS');
    lines.push(div);
    digest.contentItems.forEach(item => {
      lines.push(`  → ${item.title}`);
    });
    lines.push('');
  }

  return lines.join('\n');
}
