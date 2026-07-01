/**
 * Prospect Email Templates
 *
 * Three email types for outreach:
 *   1. Investor Introduction — warm intro to climate tech investors
 *   2. Sales Outreach — product pitch to CSRD-obligated companies
 *   3. Partnership — peer/integration conversation
 *
 * Each returns { subject, html, text } ready for Amazon SES.
 * Templates use prospect data from v_outreach_enriched.
 */

export type EmailType = 'investor' | 'sales' | 'partnership';

export interface ProspectContext {
  firstName: string;
  lastName: string | null;
  title: string | null;
  orgName: string | null;
  pipeline: string;
  ourAngle: string | null;
  theirAngle: string | null;
  investorType: string | null;
  checkSize: string | null;
  partnershipType: string | null;
  customerSegment: string | null;
}

interface EmailContent {
  subject: string;
  html: string;
  text: string;
}

// ============================================================================
// SHARED STYLES
// ============================================================================

const WRAPPER_STYLE = `margin: 0; padding: 0; background-color: #0a0a0a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;`;
const CONTAINER_STYLE = `max-width: 560px; margin: 0 auto; background-color: #111; padding: 32px; border-top: 3px solid #00d4aa;`;
const TEXT_STYLE = `color: #ccc; font-size: 14px; line-height: 1.7; margin: 0 0 16px;`;
const SIGNATURE_STYLE = `margin-top: 32px; padding-top: 16px; border-top: 1px solid #222; color: #888; font-size: 12px;`;

function wrapHtml(body: string): string {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="${WRAPPER_STYLE}">
  <div style="${CONTAINER_STYLE}">
    ${body}
    <div style="${SIGNATURE_STYLE}">
      <p style="margin: 0;">Risto Paarni</p>
      <p style="margin: 2px 0; color: #666;">Founder & CEO, DWS IQ</p>
      <p style="margin: 2px 0; color: #666;">risto@onelifetime.world</p>
      <p style="margin: 2px 0; color: #666;">Helsinki, Finland</p>
    </div>
  </div>
</body>
</html>`;
}

// ============================================================================
// INVESTOR INTRODUCTION
// ============================================================================

function investorEmail(ctx: ProspectContext): EmailContent {
  const name = ctx.firstName;
  const org = ctx.orgName ? ` at ${ctx.orgName}` : '';
  const angle = ctx.ourAngle || 'EU climate compliance automation for regulated industries';
  const checkInfo = ctx.checkSize ? ` (${ctx.checkSize} checks)` : '';

  const subject = `DWS IQ — Climate Compliance SaaS for Your Portfolio${org ? ` | ${ctx.orgName}` : ''}`;

  const text = `Hi ${name},

I'm Risto, Founder of DWS IQ — an enterprise climate compliance platform for EU-regulated industries (Fit for 55, ETS, CBAM, CSRD).

${angle}

We're raising a pre-seed round to scale across 16 EU industries. Our platform automates compliance reporting that currently takes weeks of manual work.

Key facts:
- Multi-agent AI orchestration for compliance automation
- EU data residency (Finland/Germany)
- 16 EU industry verticals (construction, logistics, manufacturing, energy)
- Situation Room investor reporting built-in

I'd welcome a 20-minute conversation about how DWS IQ fits${ctx.investorType ? ` your ${ctx.investorType} portfolio` : ' your investment thesis'}.

Would any time next week work for a quick call?

Best,
Risto Paarni
Founder & CEO, DWS IQ
risto@onelifetime.world`;

  const html = wrapHtml(`
    <p style="${TEXT_STYLE}">Hi ${name},</p>
    <p style="${TEXT_STYLE}">I'm Risto, Founder of <strong style="color: #00d4aa;">DWS IQ</strong> — an enterprise climate compliance platform for EU-regulated industries (Fit for 55, ETS, CBAM, CSRD).</p>
    <p style="${TEXT_STYLE}">${escHtml(angle)}</p>
    <p style="${TEXT_STYLE}">We're raising a pre-seed round to scale across 16 EU industries. Our platform automates compliance reporting that currently takes weeks of manual work.</p>
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin: 16px 0; font-size: 13px; color: #ccc;">
      <tr><td style="padding: 4px 12px 4px 0; color: #00d4aa;">Multi-agent AI</td><td style="padding: 4px 0;">Compliance automation orchestration</td></tr>
      <tr><td style="padding: 4px 12px 4px 0; color: #00d4aa;">EU Data Residency</td><td style="padding: 4px 0;">Finland & Germany</td></tr>
      <tr><td style="padding: 4px 12px 4px 0; color: #00d4aa;">16 Industries</td><td style="padding: 4px 0;">Construction, logistics, manufacturing, energy</td></tr>
      <tr><td style="padding: 4px 12px 4px 0; color: #00d4aa;">Investor Reporting</td><td style="padding: 4px 0;">Situation Room built-in</td></tr>
    </table>
    <p style="${TEXT_STYLE}">I'd welcome a 20-minute conversation about how DWS IQ fits${ctx.investorType ? ` your ${escHtml(ctx.investorType)} portfolio${checkInfo}` : ' your investment thesis'}.</p>
    <p style="${TEXT_STYLE}">Would any time next week work for a quick call?</p>
    <p style="${TEXT_STYLE}">Best,</p>
  `);

  return { subject, html, text };
}

// ============================================================================
// SALES OUTREACH
// ============================================================================

function salesEmail(ctx: ProspectContext): EmailContent {
  const name = ctx.firstName;
  const org = ctx.orgName || 'your company';
  const segment = ctx.customerSegment || 'EU-regulated industry';
  const angle = ctx.ourAngle || `automate CSRD compliance reporting for ${segment} companies`;
  void angle; // Reserved for personalised email body in v2

  const subject = `${org} — Automate CSRD Compliance with DWS IQ`;

  const text = `Hi ${name},

I noticed ${org} operates in the ${segment} sector — which means Fit for 55, ETS, and CSRD reporting are likely consuming significant resources.

DWS IQ automates climate compliance across the full EU regulatory stack:

- CSRD/ESRS reporting: automated data collection and report generation
- ETS compliance: emissions tracking and allowance management
- CBAM: carbon border adjustment calculations
- Fit for 55: cross-regulation alignment

Our platform handles the complexity so your team can focus on operations rather than compliance paperwork.

Would a 15-minute demo be useful? I can show you exactly how ${org} would benefit.

Best,
Risto Paarni
Founder & CEO, DWS IQ
risto@onelifetime.world`;

  const html = wrapHtml(`
    <p style="${TEXT_STYLE}">Hi ${name},</p>
    <p style="${TEXT_STYLE}">I noticed <strong>${escHtml(org)}</strong> operates in the ${escHtml(segment)} sector — which means Fit for 55, ETS, and CSRD reporting are likely consuming significant resources.</p>
    <p style="${TEXT_STYLE}"><strong style="color: #00d4aa;">DWS IQ</strong> automates climate compliance across the full EU regulatory stack:</p>
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin: 16px 0; font-size: 13px; color: #ccc;">
      <tr><td style="padding: 4px 0;"><span style="color: #00d4aa;">CSRD/ESRS</span> — automated data collection and report generation</td></tr>
      <tr><td style="padding: 4px 0;"><span style="color: #00d4aa;">ETS</span> — emissions tracking and allowance management</td></tr>
      <tr><td style="padding: 4px 0;"><span style="color: #00d4aa;">CBAM</span> — carbon border adjustment calculations</td></tr>
      <tr><td style="padding: 4px 0;"><span style="color: #00d4aa;">Fit for 55</span> — cross-regulation alignment</td></tr>
    </table>
    <p style="${TEXT_STYLE}">Our platform handles the complexity so your team can focus on operations rather than compliance paperwork.</p>
    <p style="${TEXT_STYLE}">Would a 15-minute demo be useful? I can show you exactly how <strong>${escHtml(org)}</strong> would benefit.</p>
    <p style="${TEXT_STYLE}">Best,</p>
  `);

  return { subject, html, text };
}

// ============================================================================
// PARTNERSHIP
// ============================================================================

function partnershipEmail(ctx: ProspectContext): EmailContent {
  const name = ctx.firstName;
  const org = ctx.orgName || 'your team';
  const partnerType = ctx.partnershipType || 'technology partnership';
  const angle = ctx.ourAngle || 'explore synergies between our platforms';

  const subject = `Partnership Opportunity — DWS IQ + ${ctx.orgName || name}`;

  const text = `Hi ${name},

I'm Risto from DWS IQ — we build enterprise climate compliance automation for EU-regulated industries.

I've been looking at what ${org} does, and I see a strong fit for ${partnerType} collaboration:

${angle}

Our stack:
- Multi-agent AI for compliance workflows
- EU data residency (Finland/Germany)
- ERP integrations (SAP, IFS, Dynamics)
- 16 industry verticals

I think there's a conversation worth having about how we could work together. Would you have 20 minutes for a peer conversation?

Best,
Risto Paarni
Founder & CEO, DWS IQ
risto@onelifetime.world`;

  const html = wrapHtml(`
    <p style="${TEXT_STYLE}">Hi ${name},</p>
    <p style="${TEXT_STYLE}">I'm Risto from <strong style="color: #00d4aa;">DWS IQ</strong> — we build enterprise climate compliance automation for EU-regulated industries.</p>
    <p style="${TEXT_STYLE}">I've been looking at what <strong>${escHtml(org)}</strong> does, and I see a strong fit for <strong style="color: #c084fc;">${escHtml(partnerType)}</strong> collaboration:</p>
    <p style="${TEXT_STYLE}">${escHtml(angle)}</p>
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin: 16px 0; font-size: 13px; color: #ccc;">
      <tr><td style="padding: 4px 0;"><span style="color: #00d4aa;">Multi-agent AI</span> for compliance workflows</td></tr>
      <tr><td style="padding: 4px 0;"><span style="color: #00d4aa;">EU Data Residency</span> — Finland & Germany</td></tr>
      <tr><td style="padding: 4px 0;"><span style="color: #00d4aa;">ERP Integrations</span> — SAP, IFS, Dynamics</td></tr>
      <tr><td style="padding: 4px 0;"><span style="color: #00d4aa;">16 Industries</span> — full vertical coverage</td></tr>
    </table>
    <p style="${TEXT_STYLE}">I think there's a conversation worth having about how we could work together. Would you have 20 minutes for a peer conversation?</p>
    <p style="${TEXT_STYLE}">Best,</p>
  `);

  return { subject, html, text };
}

// ============================================================================
// HELPERS
// ============================================================================

function escHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ============================================================================
// PUBLIC API
// ============================================================================

/**
 * Generate email content for a prospect based on email type.
 */
export function generateProspectEmail(type: EmailType, ctx: ProspectContext): EmailContent {
  switch (type) {
    case 'investor':
      return investorEmail(ctx);
    case 'sales':
      return salesEmail(ctx);
    case 'partnership':
      return partnershipEmail(ctx);
    default:
      throw new Error(`Unknown email type: ${type}`);
  }
}
