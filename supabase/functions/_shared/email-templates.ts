// SES bodies — short, plain, signed by Risto. No marketing chrome.
// Localized for 5 EU languages but Phase 1 only sends 'en' (gate UI is en).

import type { IndustrySlug } from './industries.ts';

export interface CodeTemplate {
  subject: string;
  text: string;
  html: string;
}

const INDUSTRY_LABEL: Record<IndustrySlug, string> = {
  construction: 'Construction',
  cement: 'Cement',
  steel: 'Steel',
  aluminium: 'Aluminium',
  chemicals: 'Chemicals',
  pharmaceuticals: 'Pharmaceuticals',
  healthcare: 'Healthcare',
  defence: 'Defence / dual-use',
  'energy-grid': 'Energy grid',
  'oil-gas': 'Oil & gas',
  nuclear: 'Nuclear',
  'water-utilities': 'Water utilities',
  telecommunications: 'Telecommunications',
  'banking-finance': 'Banking / finance',
  insurance: 'Insurance',
  maritime: 'Maritime',
  aviation: 'Aviation',
  rail: 'Rail',
  'logistics-customs': 'Logistics & customs',
  agriculture: 'Agriculture',
  'food-processing': 'Food processing',
  forestry: 'Forestry',
  mining: 'Mining',
  'government-civil-defence': 'Government / civil defence (VPK)',
  'education-research': 'Education / research',
};

const sig = (lang: string) =>
  lang === 'fi'
    ? 'Risto Paarni — toimitusjohtaja, Lifetime Oy'
    : 'Risto Paarni — CEO, Lifetime Oy';

export function codeEmail(args: {
  code: string;
  industry: IndustrySlug;
  language: 'en' | 'fi' | 'sv' | 'de' | 'fr';
}): CodeTemplate {
  const label = INDUSTRY_LABEL[args.industry];
  const subject = `Your DWS playbook code: ${args.code}`;
  const text =
    `Your one-time code for the DWS ${label} sovereign playbook is:\n\n` +
    `    ${args.code}\n\n` +
    `Enter it on the page where you requested it. The code expires in 15 minutes.\n\n` +
    `If you did not request this, you can ignore this email.\n\n` +
    `— ${sig(args.language)}\n`;
  const html =
    `<p>Your one-time code for the DWS <strong>${escapeHtml(label)}</strong> sovereign playbook is:</p>` +
    `<p style="font-family:ui-monospace,Menlo,Consolas,monospace;font-size:24px;letter-spacing:4px;` +
    `background:#f4f4ee;padding:14px 18px;border:1px solid #d4a843;display:inline-block;color:#003399;">` +
    escapeHtml(args.code) +
    `</p>` +
    `<p>Enter it on the page where you requested it. The code expires in 15 minutes.</p>` +
    `<p style="color:#666;font-size:13px;">If you did not request this, you can ignore this email.</p>` +
    `<p>— ${escapeHtml(sig(args.language))}</p>`;
  return { subject, text, html };
}

export function waitlistEmail(args: {
  industry: IndustrySlug;
  language: 'en' | 'fi' | 'sv' | 'de' | 'fr';
}): CodeTemplate {
  const label = INDUSTRY_LABEL[args.industry];
  const subject = `Wait-list confirmed: DWS ${label} sovereign playbook`;
  const text =
    `Thanks — you are on the wait-list for the DWS ${label} sovereign playbook.\n\n` +
    `We are publishing the 25 EU-regulated industry playbooks one by one. ` +
    `You will receive a download link the moment the ${label} playbook ships.\n\n` +
    `If you'd like to talk before then, just reply to this email.\n\n` +
    `— ${sig(args.language)}\n`;
  const html =
    `<p>Thanks — you are on the wait-list for the DWS <strong>${escapeHtml(label)}</strong> sovereign playbook.</p>` +
    `<p>We are publishing the 25 EU-regulated industry playbooks one by one. ` +
    `You will receive a download link the moment the ${escapeHtml(label)} playbook ships.</p>` +
    `<p>If you'd like to talk before then, just reply to this email.</p>` +
    `<p>— ${escapeHtml(sig(args.language))}</p>`;
  return { subject, text, html };
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
