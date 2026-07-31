/**
 * Captain Pre-Briefing — Email Template
 *
 * Dark-themed HTML email + plain text fallback.
 * Matches CEO Cockpit styling.
 */

import type {
  CaptainBriefingData,
  MeetingInfo,
  OutreachActivity,
  ProposalInfo,
} from './data-collectors.js';

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
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
}

function daysAgoLabel(days: number | null): string {
  if (days === null) return 'No prior contact';
  if (days === 0) return 'Today';
  if (days === 1) return '1 day ago';
  return `${days} days ago`;
}

const STATUS_COLORS: Record<string, string> = {
  responded: '#00d4aa',
  meeting_booked: '#60a5fa',
  in_negotiation: '#c084fc',
  intro_made: '#ffaa00',
  contacted: '#ffaa00',
  closed_won: '#00ff88',
  closed_lost: '#ff4444',
};

const PIPELINE_COLORS: Record<string, string> = {
  investor: '#60a5fa',
  customer: '#00d4aa',
  partner: '#c084fc',
};

// ============================================================================
// HTML TEMPLATE
// ============================================================================

export function buildCaptainBriefingHtml(data: CaptainBriefingData): string {
  const statusColor = STATUS_COLORS[data.thread?.status || ''] || '#888';
  const pipelineColor =
    PIPELINE_COLORS[data.thread?.pipeline || ''] || '#888';

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;background:#111;border-radius:8px;overflow:hidden;">

  <!-- Header -->
  <tr><td style="padding:20px 20px 12px;border-bottom:1px solid #222;">
    <h1 style="margin:0;font-size:16px;color:#fff;">Captain Pre-Briefing</h1>
    <p style="margin:4px 0 0;font-size:13px;color:#888;">${esc(data.captainName)}${data.org ? ` — ${esc(data.org.name)}` : ''}</p>
  </td></tr>

  <!-- Quick Status Bar -->
  <tr><td style="padding:12px 20px;border-bottom:1px solid #1a1a1a;">
    <table width="100%" cellpadding="0" cellspacing="0"><tr>
      <td style="font-size:11px;color:#888;text-transform:uppercase;">Pipeline</td>
      <td style="font-size:11px;color:#888;text-transform:uppercase;">Status</td>
      <td style="font-size:11px;color:#888;text-transform:uppercase;">Last Contact</td>
    </tr><tr>
      <td style="font-size:14px;color:${pipelineColor};font-weight:600;padding-top:4px;">
        ${esc(data.thread?.pipeline || 'Unknown')}
      </td>
      <td style="font-size:14px;color:${statusColor};font-weight:600;padding-top:4px;">
        ${esc((data.thread?.status || 'new').replace(/_/g, ' '))}
      </td>
      <td style="font-size:14px;color:${(data.daysSinceContact ?? 99) > 7 ? '#ff4444' : '#ccc'};font-weight:600;padding-top:4px;">
        ${daysAgoLabel(data.daysSinceContact)}
      </td>
    </tr></table>
  </td></tr>

  <!-- Contact Info -->
  ${data.person ? `
  <tr><td style="padding:14px 20px;border-bottom:1px solid #1a1a1a;">
    <h3 style="margin:0 0 8px;font-size:11px;color:#00d4aa;text-transform:uppercase;letter-spacing:0.5px;">Contact</h3>
    <p style="margin:0;font-size:13px;color:#ccc;">
      ${esc(data.person.full_name)}${data.person.title ? ` — ${esc(data.person.title)}` : ''}
    </p>
    ${data.person.primary_email ? `<p style="margin:2px 0 0;font-size:12px;color:#888;">${esc(data.person.primary_email)}</p>` : ''}
    ${data.person.phone ? `<p style="margin:2px 0 0;font-size:12px;color:#888;">${esc(data.person.phone)}</p>` : ''}
    ${data.person.linkedin_url ? `<p style="margin:4px 0 0;"><a href="${esc(data.person.linkedin_url)}" style="font-size:12px;color:#60a5fa;text-decoration:none;">LinkedIn Profile →</a></p>` : ''}
  </td></tr>` : ''}

  <!-- Organization -->
  ${data.org ? `
  <tr><td style="padding:14px 20px;border-bottom:1px solid #1a1a1a;">
    <h3 style="margin:0 0 8px;font-size:11px;color:#c084fc;text-transform:uppercase;letter-spacing:0.5px;">Organization</h3>
    <p style="margin:0;font-size:13px;color:#ccc;">${esc(data.org.name)}</p>
    <p style="margin:2px 0 0;font-size:12px;color:#888;">
      ${[data.org.industry, data.org.country, data.org.employee_count ? `${data.org.employee_count} employees` : null].filter(Boolean).join(' · ')}
    </p>
    ${data.org.domain ? `<p style="margin:2px 0 0;font-size:12px;color:#888;">${esc(data.org.domain)}</p>` : ''}
  </td></tr>` : ''}

  <!-- Talking Points -->
  <tr><td style="padding:14px 20px;border-bottom:1px solid #1a1a1a;">
    <h3 style="margin:0 0 10px;font-size:11px;color:#ffaa00;text-transform:uppercase;letter-spacing:0.5px;">Talking Points</h3>
    ${data.talkingPoints.map(tp => `<p style="margin:0 0 6px;font-size:13px;color:#e0e0e0;padding-left:12px;border-left:2px solid #333;">
      ${esc(tp)}
    </p>`).join('')}
  </td></tr>

  <!-- Suggested Action -->
  <tr><td style="padding:14px 20px;border-bottom:1px solid #1a1a1a;">
    <h3 style="margin:0 0 6px;font-size:11px;color:#00ff88;text-transform:uppercase;letter-spacing:0.5px;">Suggested Action</h3>
    <p style="margin:0;font-size:14px;color:#fff;font-weight:600;">${esc(data.suggestedAction)}</p>
  </td></tr>

  <!-- Recent Activity Timeline -->
  ${data.recentActivity.length > 0 ? `
  <tr><td style="padding:14px 20px;border-bottom:1px solid #1a1a1a;">
    <h3 style="margin:0 0 10px;font-size:11px;color:#60a5fa;text-transform:uppercase;letter-spacing:0.5px;">Recent Activity</h3>
    ${data.recentActivity.slice(0, 5).map(renderActivityHtml).join('')}
  </td></tr>` : ''}

  <!-- Proposals -->
  ${data.proposals.length > 0 ? `
  <tr><td style="padding:14px 20px;border-bottom:1px solid #1a1a1a;">
    <h3 style="margin:0 0 10px;font-size:11px;color:#c084fc;text-transform:uppercase;letter-spacing:0.5px;">Proposals</h3>
    ${data.proposals.map(renderProposalHtml).join('')}
  </td></tr>` : ''}

  <!-- Meetings -->
  ${data.meetings.length > 0 ? `
  <tr><td style="padding:14px 20px;border-bottom:1px solid #1a1a1a;">
    <h3 style="margin:0 0 10px;font-size:11px;color:#60a5fa;text-transform:uppercase;letter-spacing:0.5px;">Meetings</h3>
    ${data.meetings.map(renderMeetingHtml).join('')}
  </td></tr>` : ''}

  <!-- Climate IQ Agent Team on Duty -->
  <tr><td style="padding:14px 20px;border-bottom:1px solid #1a1a1a;">
    <h3 style="margin:0 0 10px;font-size:11px;color:#7c3aed;text-transform:uppercase;letter-spacing:0.5px;">Your AI Team on Duty</h3>
    <table width="100%" cellpadding="0" cellspacing="0">
      ${[
        { name: 'Atlas', emoji: '⚡', role: 'Chief of Staff', note: 'Synthesizing your morning intelligence right now.' },
        { name: 'Athena', emoji: '⚖️', role: 'Compliance', note: 'Watching your regulatory deadlines. She never blinks.' },
        { name: 'Iris', emoji: '🌈', role: 'Intel', note: 'Already read your competitor\'s changelog.' },
        { name: 'Mercury', emoji: '🪶', role: 'Logistics', note: 'Found a faster route. You didn\'t ask. He did it anyway.' },
        { name: 'Apollo', emoji: '☀️', role: 'Outreach', note: 'Crafting the email that doesn\'t start with "I hope this finds you well."' },
        { name: 'Hephaestus', emoji: '🔨', role: 'Field Intel', note: 'Checked your site. Wind\'s fine. No cranes down today.' },
      ].map(a => `<tr>
        <td style="padding:3px 0;width:26px;font-size:16px;">${a.emoji}</td>
        <td style="padding:3px 6px 3px 0;font-size:12px;color:#e0e0e0;font-weight:600;white-space:nowrap;">${esc(a.name)}</td>
        <td style="padding:3px 0 3px 0;font-size:11px;color:#7c3aed;white-space:nowrap;">${esc(a.role)}</td>
        <td style="padding:3px 0 3px 8px;font-size:11px;color:#666;font-style:italic;">${esc(a.note)}</td>
      </tr>`).join('')}
    </table>
  </td></tr>

  <!-- Footer -->
  <tr><td style="padding:12px 20px;font-size:11px;color:#555;">
    Captain Pre-Briefing · Generated ${new Date(data.generatedAt).toLocaleString('en-GB', { timeZone: 'Europe/Helsinki' })} Helsinki
  </td></tr>

</table>
</body>
</html>`;
}

function renderActivityHtml(a: OutreachActivity): string {
  const color = a.activity_type === 'inbound' ? '#00d4aa' : '#888';
  const icon = a.activity_type === 'inbound' ? '← IN' : '→ OUT';
  return `<p style="margin:0 0 6px;font-size:12px;color:#ccc;">
    <span style="color:${color};font-weight:600;font-size:10px;">${icon}</span>
    <span style="color:#666;margin:0 4px;">${formatDate(a.created_at)}</span>
    ${a.channel ? `<span style="color:#555;">[${esc(a.channel)}]</span>` : ''}
    ${esc(a.snippet || a.subject || 'No preview')}
  </p>`;
}

function renderProposalHtml(p: ProposalInfo): string {
  const color = p.status === 'accepted' ? '#00ff88' : p.status === 'rejected' ? '#ff4444' : '#ffaa00';
  return `<p style="margin:0 0 6px;font-size:12px;color:#ccc;">
    <span style="color:${color};font-weight:600;">${esc(p.status.toUpperCase())}</span>
    ${esc(p.title)} — €${p.amount_eur.toLocaleString()}
    ${p.valid_until ? `<span style="color:#666;"> (valid until ${formatDate(p.valid_until)})</span>` : ''}
  </p>`;
}

function renderMeetingHtml(m: MeetingInfo): string {
  const isPast = new Date(m.scheduled_at) < new Date();
  const color = m.status === 'completed' ? '#00d4aa' : m.status === 'cancelled' ? '#ff4444' : '#60a5fa';
  return `<p style="margin:0 0 6px;font-size:12px;color:#ccc;">
    <span style="color:${color};font-weight:600;">${isPast ? '✓' : '◯'}</span>
    ${formatDate(m.scheduled_at)} — ${esc(m.title)} (${esc(m.meeting_type)})
    ${m.outcome_notes ? `<br><span style="color:#888;font-size:11px;padding-left:14px;">${esc(m.outcome_notes.slice(0, 100))}</span>` : ''}
  </p>`;
}

// ============================================================================
// PLAIN TEXT TEMPLATE
// ============================================================================

export function buildCaptainBriefingPlainText(data: CaptainBriefingData): string {
  const lines: string[] = [];
  const div = '─'.repeat(50);

  lines.push('CAPTAIN PRE-BRIEFING');
  lines.push(`${data.captainName}${data.org ? ` — ${data.org.name}` : ''}`);
  lines.push(div);

  // Quick status
  lines.push(
    `Pipeline: ${data.thread?.pipeline || 'Unknown'} | Status: ${(data.thread?.status || 'new').replace(/_/g, ' ')} | Last contact: ${daysAgoLabel(data.daysSinceContact)}`
  );
  lines.push('');

  // Contact
  if (data.person) {
    lines.push('CONTACT');
    lines.push(`  ${data.person.full_name}${data.person.title ? ` — ${data.person.title}` : ''}`);
    if (data.person.primary_email) lines.push(`  ${data.person.primary_email}`);
    if (data.person.phone) lines.push(`  ${data.person.phone}`);
    if (data.person.linkedin_url) lines.push(`  ${data.person.linkedin_url}`);
    lines.push('');
  }

  // Org
  if (data.org) {
    lines.push('ORGANIZATION');
    lines.push(`  ${data.org.name}`);
    const details = [data.org.industry, data.org.country, data.org.employee_count ? `${data.org.employee_count} employees` : null].filter(Boolean);
    if (details.length) lines.push(`  ${details.join(' · ')}`);
    lines.push('');
  }

  // Talking points
  lines.push('TALKING POINTS');
  data.talkingPoints.forEach((tp, i) => lines.push(`  ${i + 1}. ${tp}`));
  lines.push('');

  // Suggested action
  lines.push('SUGGESTED ACTION');
  lines.push(`  → ${data.suggestedAction}`);
  lines.push('');

  // Recent activity
  if (data.recentActivity.length > 0) {
    lines.push('RECENT ACTIVITY');
    data.recentActivity.slice(0, 5).forEach(a => {
      const dir = a.activity_type === 'inbound' ? '← IN ' : '→ OUT';
      lines.push(`  ${dir} ${formatDate(a.created_at)} ${a.snippet || a.subject || ''}`);
    });
    lines.push('');
  }

  // Proposals
  if (data.proposals.length > 0) {
    lines.push('PROPOSALS');
    data.proposals.forEach(p => {
      lines.push(`  [${p.status.toUpperCase()}] ${p.title} — €${p.amount_eur.toLocaleString()}`);
    });
    lines.push('');
  }

  // Meetings
  if (data.meetings.length > 0) {
    lines.push('MEETINGS');
    data.meetings.forEach(m => {
      const mark = m.status === 'completed' ? '✓' : '◯';
      lines.push(`  ${mark} ${formatDate(m.scheduled_at)} — ${m.title} (${m.meeting_type})`);
      if (m.outcome_notes) lines.push(`    Notes: ${m.outcome_notes.slice(0, 100)}`);
    });
    lines.push('');
  }

  lines.push('YOUR AI TEAM ON DUTY');
  lines.push('  ⚡ Atlas      Chief of Staff  — Synthesizing your morning intelligence.');
  lines.push('  ⚖️ Athena     Compliance      — Watching your regulatory deadlines. Never blinks.');
  lines.push('  🌈 Iris       Intel           — Already read your competitor\'s changelog.');
  lines.push('  🪶 Mercury    Logistics       — Found a faster route. You didn\'t ask. He did it anyway.');
  lines.push('  ☀️ Apollo     Outreach        — Writing the email that doesn\'t open with "I hope..."');
  lines.push('  🔨 Hephaestus Field Intel     — Checked your site. Wind\'s fine. No cranes down.');
  lines.push('');
  lines.push(div);
  lines.push(`Generated ${new Date(data.generatedAt).toLocaleString('en-GB', { timeZone: 'Europe/Helsinki' })} Helsinki`);

  return lines.join('\n');
}
