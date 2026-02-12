/**
 * Morning Briefing — CEO Cockpit HTML Template
 *
 * 5-minute daily briefing. Dark theme. DWS IQ 6 brand.
 *
 * Sections:
 *   1. 3 Changes
 *   2. Today's 3 Bets
 *   3. Top Risk
 *   4. Captain Momentum (who to ping + artifact)
 *   5. Metrics Strip
 *   6. Send List (separate from main content — manual outreach queue)
 */

import type { CockpitData, SendListItem } from './data-collectors.js';

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

const PIPELINE_COLORS: Record<string, string> = {
  investor: '#60a5fa',
  customer: '#00d4aa',
  partner: '#c084fc',
};

function pipelineTag(pipeline: string): string {
  const color = PIPELINE_COLORS[pipeline] || '#888';
  const label = pipeline.toUpperCase().slice(0, 4);
  return `<span style="color: ${color}; font-size: 10px; font-weight: 600;">[${label}]</span>`;
}

// ============================================================================
// SECTION RENDERERS
// ============================================================================

function renderChanges(data: CockpitData): string {
  const { changes } = data;
  return `
    <tr><td style="padding: 16px 20px; border-bottom: 1px solid #1a1a1a;">
      <h3 style="margin: 0 0 10px; font-size: 12px; color: #00d4aa; text-transform: uppercase; letter-spacing: 1.5px;">3 Changes</h3>
      <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="font-size: 13px; color: #ccc;">
        <tr>
          <td style="padding: 4px 0; color: #888; width: 70px;">Pipeline</td>
          <td style="padding: 4px 0;">${esc(changes.pipeline)}</td>
        </tr>
        <tr>
          <td style="padding: 4px 0; color: #888;">Product</td>
          <td style="padding: 4px 0;">${esc(changes.product)}</td>
        </tr>
        <tr>
          <td style="padding: 4px 0; color: #888;">Delivery</td>
          <td style="padding: 4px 0;">${esc(changes.delivery)}</td>
        </tr>
      </table>
    </td></tr>`;
}

function renderBets(bets: string[]): string {
  const rows = bets
    .map(
      (bet, i) =>
        `<tr><td style="padding: 3px 0; font-size: 13px; color: #e0e0e0;">
          <span style="color: #00d4aa; font-weight: 700;">${i + 1}.</span> ${esc(bet)}
        </td></tr>`
    )
    .join('');

  return `
    <tr><td style="padding: 16px 20px; border-bottom: 1px solid #1a1a1a;">
      <h3 style="margin: 0 0 10px; font-size: 12px; color: #00d4aa; text-transform: uppercase; letter-spacing: 1.5px;">Today's 3 Bets</h3>
      <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
        ${rows}
      </table>
    </td></tr>`;
}

function renderRisk(data: CockpitData): string {
  const { risk } = data;
  const blockerColor = risk.blocker === 'No critical blockers' ? '#666' : '#ff4444';

  return `
    <tr><td style="padding: 16px 20px; border-bottom: 1px solid #1a1a1a;">
      <h3 style="margin: 0 0 10px; font-size: 12px; color: #ff4444; text-transform: uppercase; letter-spacing: 1.5px;">Top Risk</h3>
      <p style="margin: 0 0 4px; font-size: 13px; color: ${blockerColor}; font-weight: 600;">${esc(risk.blocker)}</p>
      <p style="margin: 0; font-size: 12px; color: #888;">Next: ${esc(risk.next_action)}</p>
    </td></tr>`;
}

function renderMomentum(data: CockpitData): string {
  const { momentum } = data;

  const contactRows =
    momentum.contacts.length > 0
      ? momentum.contacts
          .map(
            (c) =>
              `<div style="padding: 4px 0; font-size: 13px; color: #ccc;">
                ${pipelineTag(c.pipeline)} <strong>${esc(c.name)}</strong>${c.org ? ` (${esc(c.org)})` : ''}
                <span style="color: #666;"> — ${esc(c.action)}</span>
              </div>`
          )
          .join('')
      : '<p style="margin: 0; font-size: 13px; color: #666;">No active contacts to ping today.</p>';

  return `
    <tr><td style="padding: 16px 20px; border-bottom: 1px solid #1a1a1a;">
      <h3 style="margin: 0 0 10px; font-size: 12px; color: #c084fc; text-transform: uppercase; letter-spacing: 1.5px;">Captain Momentum</h3>
      ${contactRows}
      <p style="margin: 8px 0 0; font-size: 12px; color: #888;">Artifact: <strong style="color: #c084fc;">${esc(momentum.artifact)}</strong></p>
    </td></tr>`;
}

function renderMetrics(data: CockpitData): string {
  const { metrics } = data;

  const mrr = metrics.mrr_eur !== null
    ? `€${new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(metrics.mrr_eur)}`
    : '—';
  const mrrColor = metrics.mrr_eur !== null && metrics.mrr_eur > 0 ? '#00d4aa' : '#888';

  return `
    <tr><td style="padding: 16px 20px; border-bottom: 1px solid #1a1a1a;">
      <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
        <tr style="text-align: center;">
          <td style="padding: 0 8px;">
            <div style="font-size: 10px; color: #666; text-transform: uppercase; letter-spacing: 1px;">MRR</div>
            <div style="font-size: 20px; font-weight: 700; color: ${mrrColor};">${mrr}</div>
          </td>
          <td style="padding: 0 8px;">
            <div style="font-size: 10px; color: #666; text-transform: uppercase; letter-spacing: 1px;">Convos</div>
            <div style="font-size: 20px; font-weight: 700; color: #60a5fa;">${metrics.active_conversations}</div>
          </td>
          <td style="padding: 0 8px;">
            <div style="font-size: 10px; color: #666; text-transform: uppercase; letter-spacing: 1px;">Commits</div>
            <div style="font-size: 20px; font-weight: 700; color: #e0e0e0;">${metrics.weekly_commits}</div>
          </td>
          <td style="padding: 0 8px;">
            <div style="font-size: 10px; color: #666; text-transform: uppercase; letter-spacing: 1px;">MVP ETA</div>
            <div style="font-size: 14px; font-weight: 700; color: #e0e0e0;">${metrics.mvp_eta ? esc(metrics.mvp_eta) : '—'}</div>
          </td>
        </tr>
      </table>
    </td></tr>`;
}

function renderSendList(sendList: SendListItem[]): string {
  if (sendList.length === 0) {
    return `
      <tr><td style="padding: 16px 20px;">
        <h3 style="margin: 0 0 8px; font-size: 12px; color: #ffaa00; text-transform: uppercase; letter-spacing: 1.5px;">Send List</h3>
        <p style="margin: 0; font-size: 13px; color: #666;">Pipeline quiet. Source new contacts today.</p>
      </td></tr>`;
  }

  const rows = sendList
    .map(
      (item) =>
        `<div style="padding: 6px 0; border-bottom: 1px solid #1a1a1a; font-size: 13px;">
          ${pipelineTag(item.pipeline)}
          <strong style="color: #e0e0e0;">${esc(item.name)}</strong>${item.org ? ` <span style="color: #666;">(${esc(item.org)})</span>` : ''}
          <div style="margin-top: 2px; font-size: 12px; color: #888;">→ ${esc(item.action)}</div>
        </div>`
    )
    .join('');

  return `
    <tr><td style="padding: 16px 20px;">
      <h3 style="margin: 0 0 10px; font-size: 12px; color: #ffaa00; text-transform: uppercase; letter-spacing: 1.5px;">Send List (${sendList.length})</h3>
      <p style="margin: 0 0 8px; font-size: 11px; color: #555;">Send 3-5 high-quality messages manually today.</p>
      ${rows}
    </td></tr>`;
}

// ============================================================================
// MAIN TEMPLATES
// ============================================================================

/**
 * Build the CEO Cockpit HTML email.
 */
export function buildCockpitHtml(data: CockpitData): string {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin: 0; padding: 0; background-color: #0a0a0a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 520px; margin: 0 auto; background-color: #111;">
    <!-- Header -->
    <tr>
      <td style="padding: 20px; background: linear-gradient(135deg, #111 0%, #1a1a2e 100%); border-bottom: 2px solid #00d4aa;">
        <h1 style="margin: 0; font-size: 16px; color: #00d4aa; letter-spacing: -0.3px;">CEO Cockpit</h1>
        <p style="margin: 4px 0 0; font-size: 12px; color: #666;">${esc(data.dateFormatted)}</p>
      </td>
    </tr>

    ${renderChanges(data)}
    ${renderBets(data.bets)}
    ${renderRisk(data)}
    ${renderMomentum(data)}
    ${renderMetrics(data)}

    <!-- Divider -->
    <tr><td style="padding: 0 20px;"><hr style="border: none; border-top: 2px solid #222; margin: 0;"></td></tr>

    ${renderSendList(data.sendList)}

    <!-- Footer -->
    <tr>
      <td style="padding: 12px 20px; text-align: center;">
        <p style="margin: 0; font-size: 10px; color: #333;">DWS IQ 6 — 06:00 Helsinki</p>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/**
 * Build plain text version of the CEO Cockpit.
 */
export function buildCockpitPlainText(data: CockpitData): string {
  const lines: string[] = [];

  lines.push(`CEO COCKPIT — ${data.dateFormatted}`);
  lines.push('='.repeat(50));
  lines.push('');

  // 3 Changes
  lines.push('3 CHANGES');
  lines.push(`  Pipeline: ${data.changes.pipeline}`);
  lines.push(`  Product:  ${data.changes.product}`);
  lines.push(`  Delivery: ${data.changes.delivery}`);
  lines.push('');

  // Today's 3 Bets
  lines.push("TODAY'S 3 BETS");
  data.bets.forEach((bet, i) => {
    lines.push(`  ${i + 1}. ${bet}`);
  });
  lines.push('');

  // Risk
  lines.push('TOP RISK');
  lines.push(`  Blocker: ${data.risk.blocker}`);
  lines.push(`  Next:    ${data.risk.next_action}`);
  lines.push('');

  // Captain Momentum
  lines.push('CAPTAIN MOMENTUM');
  if (data.momentum.contacts.length > 0) {
    for (const c of data.momentum.contacts) {
      const org = c.org ? ` (${c.org})` : '';
      lines.push(`  [${c.pipeline.toUpperCase().slice(0, 4)}] ${c.name}${org} — ${c.action}`);
    }
  } else {
    lines.push('  No active contacts to ping today.');
  }
  lines.push(`  Artifact: ${data.momentum.artifact}`);
  lines.push('');

  // Metrics
  const m = data.metrics;
  const mrr = m.mrr_eur !== null ? `€${m.mrr_eur}` : '—';
  lines.push('METRICS');
  lines.push(`  MRR: ${mrr} | Convos: ${m.active_conversations} | Commits: ${m.weekly_commits} | MVP ETA: ${m.mvp_eta || '—'}`);
  lines.push('');

  // Send List
  lines.push('-'.repeat(50));
  lines.push(`SEND LIST (${data.sendList.length})`);
  lines.push('Send 3-5 high-quality messages manually today.');
  if (data.sendList.length > 0) {
    for (const item of data.sendList) {
      const org = item.org ? ` (${item.org})` : '';
      lines.push(`  [${item.pipeline.toUpperCase().slice(0, 4)}] ${item.name}${org}`);
      lines.push(`    → ${item.action}`);
    }
  } else {
    lines.push('  Pipeline quiet. Source new contacts today.');
  }

  lines.push('');
  lines.push('— DWS IQ 6, 06:00 Helsinki');

  return lines.join('\n');
}
