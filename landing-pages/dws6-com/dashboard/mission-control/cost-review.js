/**
 * Cost Review Dashboard — DWS6 Operations Cost Visibility
 * Evidence: Tool=Claude Code 1.0 Model=claude-haiku-4-5-20251001 Agent=cost-review-feature Date=2026-09-19
 * Audit trail: git log -- <this-file>
 *
 * Displays cost audit logs with chart visualization, CSV export, and role-based access.
 * Allowed admins: admin@dws6.com, risto.paarni2024@lifetime.fi, admin@dws10.com
 */

export const COST_REVIEW_ALLOWED = [
  'admin@dws6.com',
  'risto.paarni2024@lifetime.fi',
  'admin@dws10.com',
];

export const STORAGE_KEY = 'dws_cost_review_v1';

export async function loadCostAuditLog() {
  try {
    const response = await fetch('/api/admin/cost-audit-log');
    if (!response.ok) return [];
    return await response.json();
  } catch {
    return [];
  }
}

export function parseCostLog(logText) {
  const lines = logText.split('\n').filter((line) => line.trim());
  const entries = [];

  for (const line of lines) {
    const parts = line.split('|').map((p) => p.trim());
    if (parts.length !== 7) continue;

    const [datetime, sessionId, agentType, sandbox, workload, decision, rationale] = parts;

    entries.push({
      datetime,
      sessionId,
      agentType,
      sandbox,
      workload,
      decision,
      rationale,
      timestamp: new Date(datetime).getTime(),
      date: datetime.split('T')[0],
    });
  }

  return entries;
}

export function groupByDate(entries) {
  const grouped = {};
  for (const entry of entries) {
    if (!grouped[entry.date]) {
      grouped[entry.date] = [];
    }
    grouped[entry.date].push(entry);
  }
  return grouped;
}

export function summarizeByWorkload(entries) {
  const summary = {};

  for (const entry of entries) {
    const key = entry.workload || 'unknown';
    if (!summary[key]) {
      summary[key] = {
        workload: key,
        total: 0,
        dgx: 0,
        cloud: 0,
        blocked: 0,
      };
    }

    summary[key].total++;
    if (entry.sandbox === 'dgx-local') summary[key].dgx++;
    else if (entry.sandbox === 'cloud') summary[key].cloud++;
    else if (entry.decision === 'blocked') summary[key].blocked++;
  }

  return Object.values(summary);
}

export function summarizeByDecision(entries) {
  const summary = {
    approved: 0,
    dgxForced: 0,
    cloudApproved: 0,
    blocked: 0,
  };

  for (const entry of entries) {
    if (entry.decision === 'approved') {
      if (entry.sandbox === 'dgx-local') summary.dgxForced++;
      else summary.cloudApproved++;
    } else if (entry.decision === 'blocked') {
      summary.blocked++;
    }
  }

  return summary;
}

export function exportToCSV(entries) {
  const headers = [
    'DATETIME',
    'SESSION_ID',
    'AGENT_TYPE',
    'SANDBOX_STATUS',
    'WORKLOAD_CATEGORY',
    'DECISION',
    'RATIONALE',
  ];

  const rows = entries.map((e) => [
    `"${e.datetime}"`,
    `"${e.sessionId}"`,
    `"${e.agentType}"`,
    `"${e.sandbox}"`,
    `"${e.workload}"`,
    `"${e.decision}"`,
    `"${(e.rationale || '').replace(/"/g, '""')}"`,
  ]);

  const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `cost-audit-${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export function renderChart(containerId, entries) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const grouped = groupByDate(entries);
  const dates = Object.keys(grouped).sort();
  const last7 = dates.slice(-7);

  const data = last7.map((date) => {
    const dayEntries = grouped[date];
    const dgx = dayEntries.filter((e) => e.sandbox === 'dgx-local').length;
    const cloud = dayEntries.filter((e) => e.sandbox === 'cloud').length;
    const blocked = dayEntries.filter((e) => e.decision === 'blocked').length;

    return {
      date: date.slice(-5),
      dgx,
      cloud,
      blocked,
      total: dayEntries.length,
    };
  });

  const maxValue = Math.max(...data.map((d) => d.total), 1);
  const barHeight = 120;
  const width = 280;
  const barWidth = width / data.length;

  let svg = `
    <svg width="${width}" height="${barHeight + 40}" style="font-family: inherit; font-size: 0.8rem">
      <defs>
        <linearGradient id="dgxGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:#7dd3c0;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#5fb8a8;stop-opacity:1" />
        </linearGradient>
        <linearGradient id="cloudGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:#e8a87c;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#d68f60;stop-opacity:1" />
        </linearGradient>
        <linearGradient id="blockGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:#e07a7a;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#c85c5c;stop-opacity:1" />
        </linearGradient>
      </defs>
  `;

  data.forEach((d, i) => {
    const x = i * barWidth + 4;
    const dgxHeight = (d.dgx / maxValue) * barHeight * 0.33;
    const cloudHeight = (d.cloud / maxValue) * barHeight * 0.33;
    const blockHeight = (d.blocked / maxValue) * barHeight * 0.33;

    const baseY = barHeight - 2;

    svg += `
      <rect x="${x}" y="${baseY - dgxHeight}" width="${barWidth - 2}" height="${dgxHeight}" fill="url(#dgxGrad)" />
      <rect x="${x}" y="${baseY - dgxHeight - cloudHeight}" width="${barWidth - 2}" height="${cloudHeight}" fill="url(#cloudGrad)" />
      <rect x="${x}" y="${baseY - dgxHeight - cloudHeight - blockHeight}" width="${barWidth - 2}" height="${blockHeight}" fill="url(#blockGrad)" />
      <text x="${x + barWidth / 2}" y="${baseY + 14}" text-anchor="middle" fill="#8b9bb4">${d.date}</text>
    `;
  });

  svg += `
    <line x1="0" y1="${barHeight}" x2="${width}" y2="${barHeight}" stroke="#2a3548" stroke-width="1" />
  </svg>
  `;

  container.innerHTML = svg;
}

export function isUserAllowed(email) {
  return COST_REVIEW_ALLOWED.includes(email);
}
