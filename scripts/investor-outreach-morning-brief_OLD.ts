/**
 * Investor Outreach Morning Brief
 * Runs daily via day-runner.sh (auto-discovered in scripts/daily/)
 *
 * Reports: who was contacted, days since outreach, follow-up status.
 * Sends summary to risto@lifetime.fi every morning.
 *
 * Code-Version: 1.0
 * Introduced-In: PR-940
 * Branch: claude/investor-outreach-emails-2xLLf
 * Date: 2026-03-31
 * Owner: Claude Opus 4.6
 */

import 'dotenv/config';
import { sendEmail } from '../../src/utils/send-email.js';

const FROM = process.env.EMAIL_FROM || 'risto@onelifetime.world';
const TO = 'risto@lifetime.fi';

interface Contact {
  name: string;
  firm: string;
  role: string;
  dateSent: string;
  wave: string;
  priority: number; // 1 = highest
  status: 'sent' | 'replied' | 'meeting' | 'passed' | 'follow-up-1' | 'follow-up-2' | 'cold';
  notes: string;
}

const pipeline: Contact[] = [
  // Wave 1: VC/Angel (sent 2026-03-30)
  { name: 'Giuseppe Lacerenza', firm: 'Keen Venture Partners', role: 'Partner', dateSent: '2026-03-30', wave: 'VC', priority: 6, status: 'sent', notes: 'WARM, dual-use/sovereignty' },
  { name: 'Ferdinand Reynolds', firm: 'SuperSeed Ventures', role: 'Partner', dateSent: '2026-03-30', wave: 'VC', priority: 7, status: 'sent', notes: 'Supply chain carbon' },
  { name: 'Colin Brown', firm: 'Sparkmind Capital', role: 'Partner', dateSent: '2026-03-30', wave: 'VC', priority: 7, status: 'sent', notes: 'Podcast angle' },
  { name: 'Juho Vehviläinen', firm: 'Coventures', role: 'Partner', dateSent: '2026-03-30', wave: 'VC', priority: 7, status: 'sent', notes: 'Helsinki coffee' },
  { name: 'Markus Linder', firm: 'Triple Impact Ventures', role: 'Partner', dateSent: '2026-03-30', wave: 'VC', priority: 8, status: 'sent', notes: 'Seed for later' },
  { name: 'Philipp Rupprecht', firm: 'Proximo Ventures', role: 'Partner', dateSent: '2026-03-30', wave: 'VC', priority: 7, status: 'sent', notes: 'WARM, decarbonization + defense' },
  { name: 'Graeme Allen', firm: 'Level Four Seven', role: 'Founding Partner', dateSent: '2026-03-30', wave: 'VC', priority: 7, status: 'sent', notes: 'WARM, TRL 6-7 scout' },
  { name: 'Serge Koniski', firm: 'Amundi Alpha Associates', role: 'Head of Secondaries', dateSent: '2026-03-30', wave: 'VC', priority: 8, status: 'sent', notes: 'Pre-conference PE Insights' },
  { name: 'Elena Laleh', firm: 'Kline Hill Partners', role: 'Managing Director', dateSent: '2026-03-30', wave: 'VC', priority: 8, status: 'sent', notes: 'GP-led secondaries' },
  { name: 'Thomas Hallinger', firm: 'Golding Capital Partners', role: 'Managing Director', dateSent: '2026-03-30', wave: 'VC', priority: 8, status: 'sent', notes: 'Secondaries valuation' },
  { name: 'Andrea Pompili', firm: 'StepStone Group', role: 'Principal', dateSent: '2026-03-30', wave: 'VC', priority: 8, status: 'sent', notes: 'Data-driven secondaries' },
  { name: 'Corné Jansen', firm: 'INKEF Capital', role: 'GP', dateSent: '2026-03-30', wave: 'VC', priority: 9, status: 'sent', notes: 'Sovereignty framing, anti-ESG' },
  { name: 'Steven Miller', firm: 'Black Prism Capital', role: 'Founder', dateSent: '2026-03-30', wave: 'VC', priority: 9, status: 'sent', notes: '1-man fund, low priority' },

  // Wave 2: PE/Defence (sent 2026-03-31)
  { name: 'Markku Moilanen', firm: 'Ensto / EQT', role: 'CEO Ensto + EQT Industrial Advisor', dateSent: '2026-03-31', wave: 'PE', priority: 1, status: 'sent', notes: '3 hats: customer + EQT channel + Teknologiateollisuus 1800 companies' },
  { name: 'Christopher Kindt', firm: 'Hg Capital', role: 'Partner, Head of Value Creation', dateSent: '2026-03-31', wave: 'PE', priority: 2, status: 'sent', notes: '900+ GenAI projects, Anthropic PE Day' },
  { name: 'Mikael Männik', firm: 'Hg Capital', role: 'Director, Nordic Region', dateSent: '2026-03-31', wave: 'PE', priority: 3, status: 'follow-up-1', notes: 'REPLIED 2026-04-02, MEMO SENT 2026-04-02 (Investor_HG_memo.pdf + email). Warm intro path to Fielding. Next: follow up in 5 days if no reply' },
  { name: 'Pia Kåll', firm: 'CapMan', role: 'CEO', dateSent: '2026-03-31', wave: 'PE', priority: 4, status: 'sent', notes: 'Ex-Outotec, Espoo neighbour, Arctic 15' },
  { name: 'Marc Schiekofer', firm: 'Triton Partners', role: 'Operating Partner', dateSent: '2026-03-31', wave: 'PE', priority: 5, status: 'sent', notes: 'Ex-Planetly, Code Gaia board' },
  { name: 'Olof Faxander', firm: 'Gungnir Capital', role: 'Chairman', dateSent: '2026-03-31', wave: 'PE', priority: 6, status: 'sent', notes: 'Defence VC, ex-CEO SSAB + Sandvik' },
  { name: 'Andros Payne', firm: 'Humatica AG', role: 'Founder & Managing Partner', dateSent: '2026-03-31', wave: 'PE', priority: 7, status: 'sent', notes: 'PE org effectiveness, Stanford MBA' },
  { name: 'Olof Hernell', firm: 'Investor AB', role: 'MD Portfolio Ops', dateSent: '2026-03-31', wave: 'PE', priority: 7, status: 'sent', notes: 'Built EQT Motherbrain, Sweden AI Commission' },
  { name: 'Christopher Fielding', firm: 'Hg Capital', role: 'Partner, Mercury Fund (GRC)', dateSent: '2026-03-31', wave: 'PE', priority: 6, status: 'sent', notes: 'GRC software investments, warm intro via Männik' },
];

function daysSince(dateStr: string): number {
  const sent = new Date(dateStr);
  const now = new Date();
  return Math.floor((now.getTime() - sent.getTime()) / (1000 * 60 * 60 * 24));
}

function getFollowUpAction(days: number, status: string): string {
  if (status === 'replied' || status === 'meeting') return '';
  if (status === 'passed' || status === 'cold') return '';
  if (days >= 14 && status !== 'follow-up-2') return 'FINAL FOLLOW-UP — move to cold if no reply';
  if (days >= 5 && status !== 'follow-up-1') return 'FOLLOW UP TODAY — short one-liner';
  return '';
}

function generateBrief(): string {
  const sorted = [...pipeline].sort((a, b) => a.priority - b.priority);
  const today = new Date().toISOString().split('T')[0];

  let brief = `INVESTOR OUTREACH MORNING BRIEF — ${today}\n`;
  brief += `Pipeline: ${pipeline.length} contacts\n\n`;

  // Priority watch
  const priorities = sorted.filter(c => c.priority <= 5);
  brief += `PRIORITY WATCH:\n`;
  for (const c of priorities) {
    const days = daysSince(c.dateSent);
    brief += `  ${c.priority}. ${c.name} (${c.firm}) — ${days}d since outreach — ${c.status.toUpperCase()}`;
    if (c.notes) brief += ` — ${c.notes}`;
    brief += '\n';
  }

  // Action required
  brief += `\nACTION REQUIRED TODAY:\n`;
  let hasAction = false;
  for (const c of sorted) {
    const days = daysSince(c.dateSent);
    const action = getFollowUpAction(days, c.status);
    if (action) {
      brief += `  ${c.name} (${c.firm}) — ${days}d — ${action}\n`;
      hasAction = true;
    }
  }
  if (!hasAction) brief += '  None — all within follow-up window\n';

  // Full pipeline
  brief += `\nFULL PIPELINE:\n`;
  brief += `  ${'Name'.padEnd(25)} ${'Firm'.padEnd(25)} ${'Days'.padEnd(6)} ${'Status'.padEnd(12)} Notes\n`;
  brief += `  ${'-'.repeat(25)} ${'-'.repeat(25)} ${'-'.repeat(6)} ${'-'.repeat(12)} ${'-'.repeat(30)}\n`;
  for (const c of sorted) {
    const days = daysSince(c.dateSent);
    brief += `  ${c.name.padEnd(25)} ${c.firm.padEnd(25)} ${String(days + 'd').padEnd(6)} ${c.status.toUpperCase().padEnd(12)} ${c.notes}\n`;
  }

  // Stats
  const replied = pipeline.filter(c => c.status === 'replied').length;
  const meetings = pipeline.filter(c => c.status === 'meeting').length;
  const passed = pipeline.filter(c => c.status === 'passed').length;
  const waiting = pipeline.filter(c => c.status === 'sent' || c.status === 'follow-up-1' || c.status === 'follow-up-2').length;

  brief += `\nSTATS: ${replied} replied | ${meetings} meetings | ${passed} passed | ${waiting} waiting\n`;
  brief += `\nTo update status: edit scripts/daily/investor-outreach-morning-brief.ts → change status field\n`;

  return brief;
}

async function main() {
  const brief = generateBrief();

  console.log(brief);

  const result = await sendEmail({
    from: FROM,
    to: TO,
    subject: `[MORNING BRIEF] Investor Outreach — ${new Date().toISOString().split('T')[0]}`,
    text: brief,
    html: `<pre style="font-family: monospace; font-size: 13px; line-height: 1.5;">${brief}</pre>`,
  });

  if (result.ok) {
    console.log(`\nBrief sent to ${TO}`);
  } else {
    console.log(`\nFailed to send: ${result.error}`);
  }
}

main();
