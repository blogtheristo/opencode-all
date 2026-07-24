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

import type {
  CaptainInquiriesData,
  CockpitData,
  ConstructionLeadsData,
  HilTodosData,
  LearnArtifactsData,
  MarketSignalsData,
  OutreachSummaryData,
  SendListItem,
  WebLeadsData,
  WorkflowData,
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
// OUTREACH SUMMARY RENDERER
// ============================================================================

const PIPELINE_TAG_LABELS: Record<string, string> = {
  investor: 'INV',
  customer: 'CUST',
  partner: 'PART',
};

function renderOutreachSummaryHtml(summary: OutreachSummaryData): string {
  // Pipeline summary line: INVESTOR: 1 (1 open, 0 active) | CUSTOMER: 1 ...
  const pipelineOrder = ['investor', 'customer', 'partner'];
  const pipelineParts = pipelineOrder
    .filter((p) => summary.pipelines[p])
    .map((p) => {
      const s = summary.pipelines[p];
      const color = PIPELINE_COLORS[p] || '#888';
      return `<span style="color: ${color}; font-weight: 600;">${p.toUpperCase()}: ${s.total}</span> <span style="color: #666;">(${s.open} open, ${s.active} active)</span>`;
    })
    .join(' &nbsp;|&nbsp; ');

  // Overdue/Today badge
  const badges: string[] = [];
  if (summary.overdueCount > 0) {
    badges.push(
      `<span style="color: #ff4444; font-weight: 700;">OVERDUE: ${summary.overdueCount}</span>`,
    );
  }
  if (summary.todayCount > 0) {
    badges.push(
      `<span style="color: #ffaa00; font-weight: 700;">TODAY: ${summary.todayCount}</span>`,
    );
  }
  if (summary.emailsReceivedToday > 0) {
    badges.push(
      `<span style="color: #60a5fa;">${summary.emailsReceivedToday} email${summary.emailsReceivedToday !== 1 ? 's' : ''} received</span>`,
    );
  }

  // Top overdue threads (quick action)
  const overdueRows =
    summary.topOverdue.length > 0
      ? summary.topOverdue
          .map((t) => {
            const tag = PIPELINE_TAG_LABELS[t.pipeline] || t.pipeline.toUpperCase().slice(0, 4);
            const tagColor = PIPELINE_COLORS[t.pipeline] || '#888';
            const action = t.next_action || `Follow up with ${t.name}`;
            const org = t.org ? ` (${esc(t.org)})` : '';
            return `<div style="padding: 6px 0; border-bottom: 1px solid #222;">
          <div style="font-size: 13px; color: #e0e0e0;">
            <span style="color: #ff4444; font-weight: 600; font-size: 10px;">OVERDUE</span>
            <span style="color: #555; font-size: 10px; font-family: monospace;">T:${esc(t.token)}</span>
            <span style="color: ${tagColor}; font-size: 11px;">[${tag}]</span>
            <strong>${esc(t.name)}${org}</strong> — ${t.status.replace(/_/g, ' ')}
          </div>
          <div style="font-size: 12px; color: #aaa; margin-top: 2px;">&rarr; ${esc(action)}</div>
        </div>`;
          })
          .join('')
      : '';

  return `
    <tr><td style="padding: 16px 20px; border-bottom: 1px solid #1a1a1a;">
      <h3 style="margin: 0 0 8px; font-size: 12px; color: #00d4aa; text-transform: uppercase; letter-spacing: 1.5px;">Outreach Pipeline</h3>
      <div style="font-size: 12px; margin-bottom: 6px;">${pipelineParts}</div>
      ${badges.length > 0 ? `<div style="font-size: 12px; margin-bottom: 8px;">${badges.join(' &nbsp;|&nbsp; ')}</div>` : ''}
      ${overdueRows}
      ${
        summary.topOverdue.length > 0 && summary.overdueCount > summary.topOverdue.length
          ? `<p style="margin: 4px 0 0; font-size: 11px; color: #555;">+${summary.overdueCount - summary.topOverdue.length} more overdue</p>`
          : ''
      }
      <p style="margin: 8px 0 0; font-size: 10px; color: #444;">Reply to outreach digest email with T:TOKEN commands to update threads</p>
    </td></tr>`;
}

function renderOutreachSummaryPlainText(summary: OutreachSummaryData): string {
  const lines: string[] = [];
  lines.push('OUTREACH PIPELINE');

  const pipelineOrder = ['investor', 'customer', 'partner'];
  const pipelineParts = pipelineOrder
    .filter((p) => summary.pipelines[p])
    .map((p) => {
      const s = summary.pipelines[p];
      return `${p.toUpperCase()}: ${s.total} (${s.open} open, ${s.active} active)`;
    });
  lines.push(`  ${pipelineParts.join('  |  ')}`);

  const badges: string[] = [];
  if (summary.overdueCount > 0) badges.push(`OVERDUE: ${summary.overdueCount}`);
  if (summary.todayCount > 0) badges.push(`TODAY: ${summary.todayCount}`);
  if (summary.emailsReceivedToday > 0) {
    badges.push(
      `${summary.emailsReceivedToday} email${summary.emailsReceivedToday !== 1 ? 's' : ''} received today`,
    );
  }
  if (badges.length > 0) {
    lines.push(`  ${badges.join('  |  ')}`);
  }

  for (const t of summary.topOverdue) {
    const tag = PIPELINE_TAG_LABELS[t.pipeline] || t.pipeline.toUpperCase().slice(0, 4);
    const org = t.org ? ` (${t.org})` : '';
    const action = t.next_action || `Follow up with ${t.name}`;
    lines.push(`  OVERDUE T:${t.token} [${tag}] ${t.name}${org} — ${t.status.replace(/_/g, ' ')}`);
    lines.push(`  → ${action}`);
  }
  if (summary.overdueCount > summary.topOverdue.length) {
    lines.push(`  +${summary.overdueCount - summary.topOverdue.length} more overdue`);
  }

  lines.push('');
  return lines.join('\n');
}

// ============================================================================
// SECTION RENDERERS
// ============================================================================

const NO_DATA_STRINGS = new Set([
  'No pipeline movement',
  'No product signals captured',
  'No delivery changes',
]);

function renderChanges(data: CockpitData): string {
  const { changes } = data;

  // If all three sub-fields are the generic "nothing happened" fallback, don't
  // pad the email with three repeated empty-looking rows — say it once.
  if (
    NO_DATA_STRINGS.has(changes.pipeline) &&
    NO_DATA_STRINGS.has(changes.product) &&
    NO_DATA_STRINGS.has(changes.delivery)
  ) {
    return `
    <tr><td style="padding: 12px 20px; border-bottom: 1px solid #1a1a1a;">
      <h3 style="margin: 0 0 6px; font-size: 12px; color: #666; text-transform: uppercase; letter-spacing: 1.5px;">3 Changes</h3>
      <p style="margin: 0; font-size: 12px; color: #555;">No live pipeline/product/delivery activity to report.</p>
    </td></tr>`;
  }

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
        </td></tr>`,
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
              </div>`,
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

  const mrr =
    metrics.mrr_eur !== null
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

function renderSendActionButton(
  label: string,
  color: string,
  token: string,
  type: string,
  baseUrl: string,
  adminKey: string,
): string {
  const url = `${baseUrl}/api/v1/outreach/send-email?token=${encodeURIComponent(token)}&type=${encodeURIComponent(type)}&key=${encodeURIComponent(adminKey)}`;
  return `<a href="${url}" style="display:inline-block;padding:4px 10px;margin:2px 3px 2px 0;background:${color};color:#000;text-decoration:none;font-weight:600;border-radius:4px;font-size:10px;letter-spacing:0.3px;">${esc(label)}</a>`;
}

function renderReplyMailto(
  label: string,
  color: string,
  token: string,
  command: string,
  replyTo: string,
): string {
  const subject = `Re: [T:${token}] ${command}`;
  const body = `T:${token} ${command}\n\n--\nSent via Morning Briefing reply link.`;
  const url = `mailto:${encodeURIComponent(replyTo)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  return `<a href="${url}" style="display:inline-block;padding:4px 10px;margin:2px 3px 2px 0;background:${color};color:#fff;text-decoration:none;font-weight:600;border-radius:4px;font-size:10px;letter-spacing:0.3px;">${esc(label)}</a>`;
}

function renderSendList(
  sendList: SendListItem[],
  baseUrl: string,
  adminKey: string,
  replyTo: string,
): string {
  if (sendList.length === 0) {
    return `
      <tr><td style="padding: 16px 20px;">
        <h3 style="margin: 0 0 8px; font-size: 12px; color: #ffaa00; text-transform: uppercase; letter-spacing: 1.5px;">Send List</h3>
        <p style="margin: 0; font-size: 13px; color: #666;">Pipeline quiet. Source new contacts today.</p>
      </td></tr>`;
  }

  const rows = sendList
    .map((item) => {
      const contactInfo: string[] = [];
      if (item.primary_email) {
        contactInfo.push(
          `<span style="color: #888; font-size: 11px;">${esc(item.primary_email)}</span>`,
        );
      }
      if (item.phone) {
        contactInfo.push(
          `<a href="tel:${esc(item.phone)}" style="color: #60a5fa; font-size: 11px; text-decoration: none;">&#9742; ${esc(item.phone)}</a>`,
        );
      }

      // Action buttons — show relevant types based on pipeline
      let buttons = '';
      if (item.thread_token && adminKey) {
        const btnInvestor = renderSendActionButton(
          'Investor',
          '#60a5fa',
          item.thread_token,
          'investor',
          baseUrl,
          adminKey,
        );
        const btnSales = renderSendActionButton(
          'Sales',
          '#00d4aa',
          item.thread_token,
          'sales',
          baseUrl,
          adminKey,
        );
        const btnPartner = renderSendActionButton(
          'Partnership',
          '#c084fc',
          item.thread_token,
          'partnership',
          baseUrl,
          adminKey,
        );

        if (item.pipeline === 'investor') {
          buttons = btnInvestor + btnSales;
        } else if (item.pipeline === 'customer') {
          buttons = btnSales + btnPartner;
        } else if (item.pipeline === 'partner') {
          buttons = btnPartner + btnSales;
        } else {
          buttons = btnInvestor + btnSales + btnPartner;
        }

        // Reply-by-mailto status actions — one click → mail client opens with
        // pre-filled "T:xxx park" body. User hits Send. Parser flips status,
        // entry disappears from tomorrow's brief. No copy-paste of codes.
        if (replyTo) {
          buttons +=
            ' &nbsp; ' +
            renderReplyMailto('Park', '#6b7280', item.thread_token, 'park', replyTo) +
            renderReplyMailto('Pass', '#7c2d12', item.thread_token, 'pass', replyTo);
        }
      }

      return `<div style="padding: 8px 0; border-bottom: 1px solid #1a1a1a; font-size: 13px;">
        ${pipelineTag(item.pipeline)}
        <strong style="color: #e0e0e0;">${esc(item.name)}</strong>${item.org ? ` <span style="color: #666;">(${esc(item.org)})</span>` : ''}
        <div style="margin-top: 2px; font-size: 12px; color: #888;">&#8594; ${esc(item.action)}</div>
        ${contactInfo.length > 0 ? `<div style="margin-top: 3px;">${contactInfo.join(' &nbsp;|&nbsp; ')}</div>` : ''}
        ${buttons ? `<div style="margin-top: 6px;">${buttons}</div>` : ''}
      </div>`;
    })
    .join('');

  return `
    <tr><td style="padding: 16px 20px;">
      <h3 style="margin: 0 0 10px; font-size: 12px; color: #ffaa00; text-transform: uppercase; letter-spacing: 1.5px;">Send List (${sendList.length})</h3>
      <p style="margin: 0 0 8px; font-size: 11px; color: #555;">Click a button to send outreach email. Phone numbers are clickable to call.</p>
      ${rows}
    </td></tr>`;
}

function renderWorkflow(workflow: WorkflowData | null): string {
  if (!workflow) return '';

  const statusColor = workflow.all_passed ? '#00d4aa' : '#ff4444';
  const statusText = workflow.all_passed ? 'ALL PASSED' : 'FAILED';
  const modeLabel = workflow.mode === 'dry_run' ? 'Dry Run' : 'Full Run';

  const stageRows = workflow.stages
    .map((s) => {
      const sColor = s.status === 'OK' ? '#00d4aa' : '#ff4444';
      return `<tr>
        <td style="padding: 2px 0; font-size: 12px; color: #888; width: 140px;">${esc(s.name)}</td>
        <td style="padding: 2px 0; font-size: 12px; color: ${sColor};">${s.time.toFixed(1)}s</td>
      </tr>`;
    })
    .join('');

  const modelLine = workflow.best_model
    ? `<p style="margin: 6px 0 0; font-size: 12px; color: #ccc;">Best model: <strong style="color: #60a5fa;">${esc(workflow.best_model)}</strong> (F1=${workflow.best_f1?.toFixed(4) || '—'})${workflow.top_feature ? ` | Top feature: ${esc(workflow.top_feature)}` : ''}</p>`
    : '';

  return `
    <tr><td style="padding: 16px 20px; border-bottom: 1px solid #1a1a1a;">
      <h3 style="margin: 0 0 10px; font-size: 12px; color: #60a5fa; text-transform: uppercase; letter-spacing: 1.5px;">AI/DS Workflow</h3>
      <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
        <span style="font-size: 13px; color: ${statusColor}; font-weight: 700;">${statusText}</span>
        <span style="font-size: 12px; color: #666;">${modeLabel} | ${workflow.total_time_seconds.toFixed(1)}s total | ${workflow.savings_percent}% faster</span>
      </div>
      <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
        ${stageRows}
      </table>
      ${modelLine}
    </td></tr>`;
}

// ============================================================================
// CONSTRUCTION LEADS SECTION
// ============================================================================

function formatEur(value: number | null, currency: string = 'EUR'): string {
  if (value === null) return '—';
  if (value >= 1_000_000) return `${currency} ${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${currency} ${(value / 1_000).toFixed(0)}k`;
  return `${currency} ${value.toFixed(0)}`;
}

function renderConstructionLeadsHtml(data: ConstructionLeadsData): string {
  const { summary, newLeads, deadlines } = data;

  if (!summary && newLeads.length === 0 && deadlines.length === 0) {
    return '';
  }

  // Summary strip
  const summaryHtml = summary
    ? `<div style="margin-bottom: 10px; font-size: 12px; color: #888;">
        ${summary.new_count} new | ${summary.qualified_count} qualified | ${summary.outreach_count} outreach | ${summary.deadlines_this_week} deadlines this week
      </div>`
    : '';

  // New leads (top 5)
  const leadsToShow = newLeads.slice(0, 5);
  const newLeadsHtml =
    leadsToShow.length > 0
      ? leadsToShow
          .map((lead) => {
            const value = formatEur(lead.estimated_value, lead.currency);
            const country = lead.country_code || '';
            const score = lead.relevance_score;
            const scoreColor = score >= 70 ? '#00d4aa' : score >= 40 ? '#ffaa00' : '#666';
            const deadlineStr = lead.deadline_date
              ? new Date(lead.deadline_date).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'short',
                })
              : '';
            const title = lead.title.length > 80 ? lead.title.slice(0, 77) + '...' : lead.title;

            return `<div style="padding: 6px 0; border-bottom: 1px solid #1a1a1a;">
          <div style="font-size: 13px; color: #e0e0e0;">
            <span style="color: ${scoreColor}; font-size: 10px; font-weight: 600;">${score}</span>
            <span style="color: #ffaa00; font-size: 10px;">[${country}]</span>
            ${lead.ted_url ? `<a href="${esc(lead.ted_url)}" style="color: #e0e0e0; text-decoration: none;">${esc(title)}</a>` : esc(title)}
          </div>
          <div style="font-size: 11px; color: #666; margin-top: 2px;">
            ${lead.buyer_name ? esc(lead.buyer_name) + ' | ' : ''}${value}${deadlineStr ? ' | Due ' + deadlineStr : ''}
          </div>
        </div>`;
          })
          .join('')
      : '<p style="margin: 0; font-size: 12px; color: #555;">No new construction leads.</p>';

  // Upcoming deadlines (top 3)
  const deadlinesToShow = deadlines.slice(0, 3);
  const deadlinesHtml =
    deadlinesToShow.length > 0
      ? `<div style="margin-top: 10px;">
        <p style="margin: 0 0 4px; font-size: 11px; color: #ff4444; font-weight: 600;">UPCOMING DEADLINES</p>
        ${deadlinesToShow
          .map((d) => {
            const dDate = new Date(d.deadline_date).toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'short',
            });
            const daysLeft = Math.ceil(
              (new Date(d.deadline_date).getTime() - Date.now()) / 86_400_000,
            );
            const urgencyColor = daysLeft <= 3 ? '#ff4444' : daysLeft <= 7 ? '#ffaa00' : '#888';
            const title = d.title.length > 60 ? d.title.slice(0, 57) + '...' : d.title;
            return `<div style="padding: 3px 0; font-size: 12px; color: #aaa;">
            <span style="color: ${urgencyColor}; font-weight: 600;">${dDate}</span> (${daysLeft}d) — ${esc(title)}
          </div>`;
          })
          .join('')}
      </div>`
      : '';

  const moreCount = newLeads.length > 5 ? newLeads.length - 5 : 0;
  const moreHtml =
    moreCount > 0
      ? `<p style="margin: 6px 0 0; font-size: 11px; color: #555;">+${moreCount} more leads</p>`
      : '';

  // Lead sources info
  const sourcesHtml =
    data.sourceCounts.total > 0
      ? `<div style="margin-top: 10px; padding-top: 8px; border-top: 1px solid #222;">
        <p style="margin: 0 0 2px; font-size: 10px; color: #555; text-transform: uppercase; letter-spacing: 0.5px;">Lead Sources (${data.sourceCounts.active} active, ${data.sourceCounts.planned} planned, ${data.sourceCounts.reference} reference)</p>
        <p style="margin: 0; font-size: 11px; color: #666;">${esc(data.sourcesSummary)}</p>
      </div>`
      : '';

  return `
    <tr><td style="padding: 16px 20px; border-bottom: 1px solid #1a1a1a;">
      <h3 style="margin: 0 0 10px; font-size: 12px; color: #ffaa00; text-transform: uppercase; letter-spacing: 1.5px;">Construction Leads</h3>
      ${summaryHtml}
      ${newLeadsHtml}
      ${moreHtml}
      ${deadlinesHtml}
      ${sourcesHtml}
    </td></tr>`;
}

function renderConstructionLeadsPlainText(data: ConstructionLeadsData): string {
  const { summary, newLeads, deadlines } = data;
  const lines: string[] = [];

  if (!summary && newLeads.length === 0 && deadlines.length === 0) {
    return '';
  }

  lines.push('CONSTRUCTION LEADS');

  if (summary) {
    lines.push(
      `  ${summary.new_count} new | ${summary.qualified_count} qualified | ${summary.outreach_count} outreach | ${summary.deadlines_this_week} deadlines this week`,
    );
  }

  // New leads
  const leadsToShow = newLeads.slice(0, 5);
  if (leadsToShow.length > 0) {
    for (const lead of leadsToShow) {
      const value = formatEur(lead.estimated_value, lead.currency);
      const country = lead.country_code || '??';
      const score = lead.relevance_score;
      const title = lead.title.length > 70 ? lead.title.slice(0, 67) + '...' : lead.title;
      lines.push(`  [${score}] [${country}] ${title}`);
      const details: string[] = [];
      if (lead.buyer_name) details.push(lead.buyer_name);
      details.push(value);
      if (lead.deadline_date) {
        const dDate = new Date(lead.deadline_date).toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'short',
        });
        details.push(`Due ${dDate}`);
      }
      lines.push(`    ${details.join(' | ')}`);
    }
    const moreCount = newLeads.length - 5;
    if (moreCount > 0) lines.push(`  +${moreCount} more`);
  } else {
    lines.push('  No new construction leads.');
  }

  // Deadlines
  const deadlinesToShow = deadlines.slice(0, 3);
  if (deadlinesToShow.length > 0) {
    lines.push('  UPCOMING DEADLINES:');
    for (const d of deadlinesToShow) {
      const dDate = new Date(d.deadline_date).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
      });
      const daysLeft = Math.ceil((new Date(d.deadline_date).getTime() - Date.now()) / 86_400_000);
      const title = d.title.length > 55 ? d.title.slice(0, 52) + '...' : d.title;
      lines.push(`    ${dDate} (${daysLeft}d) — ${title}`);
    }
  }

  // Lead sources
  if (data.sourcesSummary) {
    lines.push(
      `  Sources (${data.sourceCounts.active} active, ${data.sourceCounts.planned} planned): ${data.sourcesSummary}`,
    );
  }

  lines.push('');
  return lines.join('\n');
}

// ============================================================================
// MARKET SIGNALS SECTION
// ============================================================================

function renderMarketSignalsHtml(data: MarketSignalsData): string {
  if (data.signals.length === 0) return '';

  const rows = data.signals
    .map((s) => {
      const scoreColor =
        s.cascade_score >= 60 ? '#ff4444' : s.cascade_score >= 40 ? '#ffaa00' : '#888';
      const title = s.title.length > 90 ? s.title.slice(0, 87) + '...' : s.title;
      const industries = s.industries
        ? s.industries
            .split(',')
            .map((i) => i.trim())
            .join(', ')
        : '';
      return `<div style="padding: 6px 0; border-bottom: 1px solid #1a1a1a;">
          <div style="font-size: 13px; color: #e0e0e0;">
            <span style="color: ${scoreColor}; font-size: 10px; font-weight: 600;">${s.cascade_score}</span>
            ${s.dual_use ? '<span style="color: #ff4444; font-size: 10px;"> [DUAL-USE]</span>' : ''}
            ${esc(title)}
          </div>
          <div style="font-size: 11px; color: #666; margin-top: 2px;">${esc(industries)}</div>
        </div>`;
    })
    .join('');

  return `
    <tr><td style="padding: 16px 20px; border-bottom: 1px solid #1a1a1a;">
      <h3 style="margin: 0 0 10px; font-size: 12px; color: #ff4444; text-transform: uppercase; letter-spacing: 1.5px;">Market Signals</h3>
      ${rows}
    </td></tr>`;
}

function renderMarketSignalsPlainText(data: MarketSignalsData): string {
  if (data.signals.length === 0) return '';
  const lines: string[] = ['MARKET SIGNALS'];
  for (const s of data.signals) {
    const title = s.title.length > 80 ? s.title.slice(0, 77) + '...' : s.title;
    lines.push(`  [${s.cascade_score}]${s.dual_use ? ' [DUAL-USE]' : ''} ${title}`);
    if (s.industries) lines.push(`    ${s.industries}`);
  }
  return lines.join('\n') + '\n';
}

// ============================================================================
// CAPTAIN INQUIRIES SECTION
// ============================================================================

const SEAT_COLORS: Record<string, string> = {
  platinum: '#d4a843',
  deputy: '#60a5fa',
};

function renderCaptainInquiriesHtml(data: CaptainInquiriesData): string {
  if (data.newCount === 0) return '';

  const rows = data.inquiries
    .map((inq) => {
      const seatColor = SEAT_COLORS[inq.seat_level] || '#888';
      const seatLabel = inq.seat_level.toUpperCase();
      const time = new Date(inq.created_at).toLocaleString('en-GB', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Europe/Helsinki',
      });
      const msgLine = inq.message
        ? `<div style="font-size: 11px; color: #666; margin-top: 2px; font-style: italic;">"${esc(inq.message.length > 120 ? inq.message.slice(0, 117) + '...' : inq.message)}"</div>`
        : '';

      return `<div style="padding: 8px 0; border-bottom: 1px solid #1a1a1a;">
        <div style="font-size: 13px; color: #e0e0e0;">
          <span style="color: ${seatColor}; font-size: 10px; font-weight: 600;">[${seatLabel}]</span>
          <strong>${esc(inq.name)}</strong>
          <span style="color: #555;"> — ${esc(inq.industry)}</span>
        </div>
        <div style="font-size: 11px; color: #888; margin-top: 2px;">
          <a href="mailto:${esc(inq.email)}" style="color: #60a5fa; text-decoration: none;">${esc(inq.email)}</a>
          &nbsp;|&nbsp; ${time}
        </div>
        ${msgLine}
      </div>`;
    })
    .join('');

  return `
    <tr><td style="padding: 16px 20px; border-bottom: 1px solid #1a1a1a;">
      <h3 style="margin: 0 0 10px; font-size: 12px; color: #d4a843; text-transform: uppercase; letter-spacing: 1.5px;">Captain Inquiries (${data.newCount} new)</h3>
      ${rows}
      <p style="margin: 8px 0 0; font-size: 11px; color: #555;">Reply within 24h — send industry brief + SAFE term sheet + calendar link</p>
    </td></tr>`;
}

// ============================================================================
// WEB LEADS SECTION (inbound newsletter / free-audit / contact)
// ============================================================================

const WEB_LEAD_SOURCE_COLORS: Record<string, string> = {
  free_audit: '#4ade80',
  newsletter: '#60a5fa',
  contact: '#d4a843',
};

function renderWebLeadsHtml(data: WebLeadsData): string {
  if (data.newCount === 0) return '';

  const rows = data.leads
    .map((lead) => {
      const color = WEB_LEAD_SOURCE_COLORS[lead.source] || '#888';
      const label = lead.source.replace('_', ' ').toUpperCase();
      const time = new Date(lead.created_at).toLocaleString('en-GB', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Europe/Helsinki',
      });
      const who = lead.name || lead.email;
      const ctx = [lead.company, lead.industry]
        .filter((x): x is string => Boolean(x))
        .map(esc)
        .join(' · ');
      const ctxLine = ctx ? `<span style="color: #555;"> — ${ctx}</span>` : '';
      const msgLine = lead.message
        ? `<div style="font-size: 11px; color: #666; margin-top: 2px; font-style: italic;">"${esc(lead.message.length > 120 ? lead.message.slice(0, 117) + '...' : lead.message)}"</div>`
        : '';

      return `<div style="padding: 8px 0; border-bottom: 1px solid #1a1a1a;">
        <div style="font-size: 13px; color: #e0e0e0;">
          <span style="color: ${color}; font-size: 10px; font-weight: 600;">[${label}]</span>
          <strong>${esc(who)}</strong>${ctxLine}
        </div>
        <div style="font-size: 11px; color: #888; margin-top: 2px;">
          <a href="mailto:${esc(lead.email)}" style="color: #60a5fa; text-decoration: none;">${esc(lead.email)}</a>
          &nbsp;|&nbsp; ${time}
        </div>
        ${msgLine}
      </div>`;
    })
    .join('');

  return `
    <tr><td style="padding: 16px 20px; border-bottom: 1px solid #1a1a1a;">
      <h3 style="margin: 0 0 10px; font-size: 12px; color: #4ade80; text-transform: uppercase; letter-spacing: 1.5px;">Web Leads (${data.newCount} new)</h3>
      ${rows}
      <p style="margin: 8px 0 0; font-size: 11px; color: #555;">Inbound from the public sites — qualify and add to the outreach pipeline</p>
    </td></tr>`;
}

function renderWebLeadsPlainText(data: WebLeadsData): string {
  if (data.newCount === 0) return '';

  const lines: string[] = [];
  lines.push(`WEB LEADS (${data.newCount} new)`);
  for (const lead of data.leads) {
    const label = lead.source.replace('_', ' ').toUpperCase();
    const time = new Date(lead.created_at).toLocaleString('en-GB', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Europe/Helsinki',
    });
    const who = lead.name || lead.email;
    const ctx = [lead.company, lead.industry].filter(Boolean).join(' · ');
    lines.push(`  [${label}] ${who}${ctx ? ' — ' + ctx : ''}`);
    lines.push(`    Email: ${lead.email} | ${time}`);
    if (lead.message) {
      const msg = lead.message.length > 100 ? lead.message.slice(0, 97) + '...' : lead.message;
      lines.push(`    "${msg}"`);
    }
  }
  lines.push('  → Qualify and add to the outreach pipeline');
  lines.push('');
  return lines.join('\n');
}

// ============================================================================
// LEARN ARTIFACTS SECTION
// ============================================================================

function renderLearnArtifactsHtml(data: LearnArtifactsData): string {
  if (data.artifacts.length === 0) return '';

  const rows = data.artifacts
    .map(
      (a) => `<div style="padding: 5px 0; border-bottom: 1px solid #1a1a1a;">
      <a href="${esc(a.githubUrl)}" style="color: #60a5fa; text-decoration: none; font-size: 13px; font-weight: 500;">${esc(a.title)}</a>
      <span style="color: #444; font-size: 11px; margin-left: 8px;">${esc(a.modifiedDate)}</span>
    </div>`,
    )
    .join('');

  return `
    <tr><td style="padding: 16px 20px; border-bottom: 1px solid #1a1a1a;">
      <h3 style="margin: 0 0 10px; font-size: 12px; color: #60a5fa; text-transform: uppercase; letter-spacing: 1.5px;">Learn — Updated This Week</h3>
      ${rows}
      <p style="margin: 8px 0 0; font-size: 10px; color: #444;"><a href="https://github.com/blogtheristo/dws6/tree/main/Learn" style="color: #444; text-decoration: none;">All Learn artifacts &rarr;</a></p>
    </td></tr>`;
}

function renderLearnArtifactsPlainText(data: LearnArtifactsData): string {
  if (data.artifacts.length === 0) return '';

  const lines: string[] = [];
  lines.push('LEARN — UPDATED THIS WEEK');
  for (const a of data.artifacts) {
    lines.push(`  ${a.modifiedDate} — ${a.title}`);
    lines.push(`  ${a.githubUrl}`);
  }
  lines.push('');
  return lines.join('\n');
}

// ============================================================================
// HIL TODO SECTION
// ============================================================================

const CATEGORY_COLORS: Record<string, string> = {
  competitor_price: '#ffaa00',
  market_brief: '#60a5fa',
  config_gap: '#c084fc',
  manual: '#00d4aa',
  pending_migration: '#ff4444',
  model_update: '#76b900',
};

const CATEGORY_LABELS: Record<string, string> = {
  competitor_price: 'PRICE',
  market_brief: 'BRIEF',
  config_gap: 'CFG',
  manual: 'MANUAL',
  pending_migration: 'SQL',
  model_update: 'MODEL',
};

function renderHilTodosHtml(data: HilTodosData): string {
  if (data.todos.length === 0) return '';

  const rows = data.todos
    .map((t) => {
      const color = CATEGORY_COLORS[t.category] || '#888';
      const label = CATEGORY_LABELS[t.category] || t.category.toUpperCase().slice(0, 5);
      const doneUrl = `${data.backendUrl}/api/hil/done/${encodeURIComponent(t.done_token)}`;
      const age = Math.floor((Date.now() - new Date(t.created_at).getTime()) / 86_400_000);
      const ageLabel = age === 0 ? 'today' : `${age}d ago`;
      return `
        <div style="display: flex; align-items: flex-start; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #1e1e1e;">
          <div style="flex: 1;">
            <span style="color: ${color}; font-size: 10px; font-weight: 700; margin-right: 6px;">[${label}]</span>
            <span style="font-size: 13px; color: #e0e0e0;">${esc(t.description)}</span>
            <span style="color: #444; font-size: 10px; margin-left: 8px;">${esc(ageLabel)}</span>
          </div>
          <a href="${esc(doneUrl)}"
             style="margin-left: 12px; padding: 4px 10px; background: #1a3a1a; color: #00d4aa;
                    border: 1px solid #00d4aa; border-radius: 4px; font-size: 11px;
                    font-weight: 600; text-decoration: none; white-space: nowrap; flex-shrink: 0;">
            ✅ Done
          </a>
        </div>`;
    })
    .join('');

  return `
    <tr><td style="padding: 16px 20px; border-bottom: 1px solid #1a1a1a; background: #0d1a0d;">
      <h3 style="margin: 0 0 10px; font-size: 12px; color: #ffaa00; text-transform: uppercase; letter-spacing: 1.5px;">
        ⚠ HIL ToDo &nbsp;<span style="color: #555; font-weight: 400; font-size: 11px;">(${data.todos.length} open)</span>
      </h3>
      ${rows}
      <p style="margin: 8px 0 0; font-size: 10px; color: #444;">Click ✅ Done to clear a task. Tasks auto-appear from Monday market run and automated collectors.</p>
    </td></tr>`;
}

function renderCaptainInquiriesPlainText(data: CaptainInquiriesData): string {
  if (data.newCount === 0) return '';

  const lines: string[] = [];
  lines.push(`CAPTAIN INQUIRIES (${data.newCount} new)`);

  for (const inq of data.inquiries) {
    const seat = inq.seat_level.toUpperCase();
    const time = new Date(inq.created_at).toLocaleString('en-GB', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Europe/Helsinki',
    });
    lines.push(`  [${seat}] ${inq.name} — ${inq.industry}`);
    lines.push(`    Email: ${inq.email} | ${time}`);
    if (inq.message) {
      const msg = inq.message.length > 100 ? inq.message.slice(0, 97) + '...' : inq.message;
      lines.push(`    "${msg}"`);
    }
  }

  lines.push('  → Reply within 24h: industry brief + SAFE term sheet + calendar link');
  lines.push('');
  return lines.join('\n');
}

function renderHilTodosPlainText(data: HilTodosData): string {
  if (data.todos.length === 0) return '';

  const lines: string[] = [];
  lines.push(`HIL TODO (${data.todos.length} open)`);
  for (const t of data.todos) {
    const label = CATEGORY_LABELS[t.category] || t.category.toUpperCase();
    const age = Math.floor((Date.now() - new Date(t.created_at).getTime()) / 86_400_000);
    const ageLabel = age === 0 ? 'today' : `${age}d ago`;
    lines.push(`  [${label}] ${t.description} (${ageLabel})`);
    lines.push(`  Done: ${data.backendUrl}/api/hil/done/${t.done_token}`);
  }
  lines.push('');
  return lines.join('\n');
}

// ============================================================================
// MAIN TEMPLATES
// ============================================================================

// ============================================================================
// SALES BRIEF — slim weekday brief, fires from MorningBriefingScheduler
// ============================================================================

/**
 * Build the Sales Brief HTML email — outreach + send list + leads + inquiries.
 * Skips the CEO-strategy sections (3 changes / bets / risk / momentum / metrics)
 * so the operator can scan the actionable pipeline in under a minute.
 */
export function buildSalesBriefHtml(data: CockpitData, baseUrl?: string): string {
  const apiBaseUrl = baseUrl || process.env.BACKEND_URL || 'https://localhost:8080';
  const adminKey = process.env.ADMIN_API_KEY || '';
  const replyTo = process.env.OUTREACH_REPLY_TO_EMAIL || process.env.EMAIL_FROM || '';

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin: 0; padding: 0; background-color: #0a0a0a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 520px; margin: 0 auto; background-color: #111;">
    <tr>
      <td style="padding: 20px; background: linear-gradient(135deg, #111 0%, #1a2e1a 100%); border-bottom: 2px solid #00d4aa;">
        <h1 style="margin: 0; font-size: 16px; color: #00d4aa; letter-spacing: -0.3px;">Sales Brief</h1>
        <p style="margin: 4px 0 0; font-size: 12px; color: #666;">${esc(data.dateFormatted)}</p>
      </td>
    </tr>

    ${renderOutreachSummaryHtml(data.outreachSummary)}
    ${renderCaptainInquiriesHtml(data.captainInquiries)}
    ${renderWebLeadsHtml(data.webLeads)}
    ${renderConstructionLeadsHtml(data.constructionLeads)}

    <tr><td style="padding: 0 20px;"><hr style="border: none; border-top: 2px solid #222; margin: 0;"></td></tr>

    ${renderSendList(data.sendList, apiBaseUrl, adminKey, replyTo)}

    <tr>
      <td style="padding: 12px 20px; text-align: center;">
        <p style="margin: 0; font-size: 10px; color: #333;">DWS IQ 6 — Sales Brief</p>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/**
 * Plain-text fallback for the Sales Brief.
 */
export function buildSalesBriefPlainText(data: CockpitData): string {
  const lines: string[] = [];

  lines.push(`SALES BRIEF — ${data.dateFormatted}`);
  lines.push('='.repeat(50));
  lines.push('');

  lines.push(renderOutreachSummaryPlainText(data.outreachSummary));
  lines.push('');
  lines.push(renderCaptainInquiriesPlainText(data.captainInquiries));
  lines.push('');
  lines.push(renderWebLeadsPlainText(data.webLeads));
  lines.push('');
  lines.push(renderConstructionLeadsPlainText(data.constructionLeads));
  lines.push('');

  lines.push(`SEND LIST (${data.sendList.length})`);
  lines.push('-'.repeat(50));
  if (data.sendList.length === 0) {
    lines.push('Pipeline quiet. Source new contacts today.');
  } else {
    for (const item of data.sendList) {
      const org = item.org ? ` (${item.org})` : '';
      lines.push(`  [${item.pipeline}] ${item.name}${org}`);
      lines.push(`    -> ${item.action}`);
      if (item.thread_token) {
        lines.push(`    Reply "T:${item.thread_token} park" to drop from tomorrow's brief.`);
      }
    }
  }
  lines.push('');
  lines.push('--');
  lines.push('DWS IQ 6 — Sales Brief');

  return lines.join('\n');
}

/**
 * Build the CEO Cockpit HTML email.
 * @param data Cockpit data
 * @param baseUrl Backend URL for action button links (e.g. https://dws-iq-backend-xyz.run.app)
 */
export function buildCockpitHtml(data: CockpitData, baseUrl?: string): string {
  const apiBaseUrl = baseUrl || process.env.BACKEND_URL || 'https://localhost:8080';
  const adminKey = process.env.ADMIN_API_KEY || '';
  const replyTo = process.env.OUTREACH_REPLY_TO_EMAIL || process.env.EMAIL_FROM || '';

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

    ${renderOutreachSummaryHtml(data.outreachSummary)}
    ${renderMarketSignalsHtml(data.marketSignals)}
    ${renderCaptainInquiriesHtml(data.captainInquiries)}
    ${renderWebLeadsHtml(data.webLeads)}
    ${renderChanges(data)}
    ${renderBets(data.bets)}
    ${renderRisk(data)}
    ${renderMomentum(data)}
    ${renderMetrics(data)}
    ${renderWorkflow(data.workflow)}
    ${renderConstructionLeadsHtml(data.constructionLeads)}
    ${renderLearnArtifactsHtml(data.learnArtifacts)}
    ${renderHilTodosHtml(data.hilTodos)}

    <!-- Divider -->
    <tr><td style="padding: 0 20px;"><hr style="border: none; border-top: 2px solid #222; margin: 0;"></td></tr>

    ${renderSendList(data.sendList, apiBaseUrl, adminKey, replyTo)}

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

  // Outreach Pipeline Summary
  const outreachText = renderOutreachSummaryPlainText(data.outreachSummary);
  if (outreachText) {
    lines.push(outreachText);
  }

  // Market Signals
  const marketSignalsText = renderMarketSignalsPlainText(data.marketSignals);
  if (marketSignalsText) {
    lines.push(marketSignalsText);
  }

  // Captain Inquiries
  const captainText = renderCaptainInquiriesPlainText(data.captainInquiries);
  if (captainText) {
    lines.push(captainText);
  }

  // Web Leads (inbound from public sites)
  const webLeadsText = renderWebLeadsPlainText(data.webLeads);
  if (webLeadsText) {
    lines.push(webLeadsText);
  }

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
  lines.push(
    `  MRR: ${mrr} | Convos: ${m.active_conversations} | Commits: ${m.weekly_commits} | MVP ETA: ${m.mvp_eta || '—'}`,
  );
  lines.push('');

  // AI/DS Workflow
  if (data.workflow) {
    const w = data.workflow;
    const status = w.all_passed ? 'ALL PASSED' : 'FAILED';
    const mode = w.mode === 'dry_run' ? 'Dry Run' : 'Full Run';
    lines.push('AI/DS WORKFLOW');
    lines.push(
      `  Status: ${status} (${mode}) | ${w.total_time_seconds.toFixed(1)}s | ${w.savings_percent}% faster than traditional`,
    );
    for (const s of w.stages) {
      const sIcon = s.status === 'OK' ? '+' : 'X';
      lines.push(`  [${sIcon}] ${s.name}: ${s.time.toFixed(1)}s`);
    }
    if (w.best_model) {
      lines.push(
        `  Best model: ${w.best_model} (F1=${w.best_f1?.toFixed(4) || '—'})${w.top_feature ? ` | Top: ${w.top_feature}` : ''}`,
      );
    }
    lines.push('');
  }

  // Construction Leads
  const clText = renderConstructionLeadsPlainText(data.constructionLeads);
  if (clText) {
    lines.push(clText);
  }

  // Learn Artifacts
  const learnText = renderLearnArtifactsPlainText(data.learnArtifacts);
  if (learnText) {
    lines.push(learnText);
  }

  // HIL ToDo
  const hilText = renderHilTodosPlainText(data.hilTodos);
  if (hilText) {
    lines.push(hilText);
  }

  // Send List
  lines.push('-'.repeat(50));
  lines.push(`SEND LIST (${data.sendList.length})`);
  lines.push('Click buttons in HTML email to send outreach. Phone numbers below.');
  if (data.sendList.length > 0) {
    for (const item of data.sendList) {
      const org = item.org ? ` (${item.org})` : '';
      lines.push(`  [${item.pipeline.toUpperCase().slice(0, 4)}] ${item.name}${org}`);
      lines.push(`    → ${item.action}`);
      if (item.primary_email) lines.push(`    Email: ${item.primary_email}`);
      if (item.phone) lines.push(`    Phone: ${item.phone}`);
    }
  } else {
    lines.push('  Pipeline quiet. Source new contacts today.');
  }

  lines.push('');
  lines.push('— DWS IQ 6, 06:00 Helsinki');

  return lines.join('\n');
}
