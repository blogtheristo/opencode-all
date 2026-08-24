/**
 * ============================================================================
 * CORRECTION NOTICE (29.07.2026) — DO NOT EDIT THE MESSAGE BODIES BELOW
 * ============================================================================
 * This file is a RECORD OF MAIL THAT WAS ALREADY SENT (30 March 2026). Per
 * DWS_DOCUMENT_STANDARD.md section 24, sent correspondence is preserved
 * verbatim. The copy below is therefore left exactly as it went out.
 *
 * The traction claims in it are now known to be WRONG. Do not reuse this copy,
 * and do not re-run this script. Canonical source: docs/TRACTION_CANONICAL.md
 * (founder-confirmed 29.07.2026; DWS_TRUTH_STANDARD.md section 2 row 32).
 *
 *   SENT: "5 paying customers (EUR 7K MRR, 100% retention)"
 *   TRUE: Two enterprise pilots contracted Q1/2026 at EUR 29,950 each
 *         (EUR 59,900 booked) plus four smaller landed accounts. The ~EUR 7k
 *         per month is SERVICES AND TRANSPORT revenue (licensed transport
 *         operation + consulting) which puts the company at cash break-even
 *         with a founder salary of EUR 0 — it is NOT software revenue and was
 *         never platform MRR.
 *
 *   SENT: "EUR 84K ARR with 100% retention" (Persefoni comparison)
 *   TRUE: There is no EUR 84K software ARR. That figure annualised the
 *         transport-and-consulting revenue. No retention or churn rate is
 *         assertable — there is no cohort data behind one.
 *
 *   SENT: "TRL 6-7"
 *   TRUE: TRL 5 completed, entering TRL 6, anchored on the KYA engine.
 *
 * Recipients of the mail below were given an overstated picture. Flag for
 * founder decision: whether any of these threads needs a written correction.
 * ============================================================================
 */

/**
 * Send 13 investor outreach emails — DIRECT when email known, self-send when not.
 *
 * Usage:
 *   npx tsx scripts/send-investor-batch-2026-03-30.ts --dry-run     # preview, no emails sent
 *   npx tsx scripts/send-investor-batch-2026-03-30.ts --confirm      # actually send emails
 *
 * Investor email addresses are loaded from scripts/investor-contacts.local.json
 * (gitignored — never committed). Create the file with:
 *   { "Giuseppe Lacerenza": "g@example.com", "Ferdinand Reynolds": "f@example.com" }
 * Keys must match the label names. Missing/null = self-send to risto@lifetime.fi.
 *
 * Requires: SMTP_HOST, SMTP_USER, SMTP_PASS in .env
 * Sends FROM: risto@onelifetime.world
 *
 * Code-Version: 3.0
 * Introduced-In: PR-940
 * Branch: claude/investor-outreach-emails-2xLLf
 * Date: 2026-03-31
 * Owner: Claude Opus 4.6
 */

import 'dotenv/config';
import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { sendEmail } from '../src/utils/send-email.js';

const FROM = process.env.EMAIL_FROM || 'risto@onelifetime.world';
const SELF = 'risto@lifetime.fi';

// --- Safety gate: require --confirm to send, default to --dry-run ---
const args = process.argv.slice(2);
const DRY_RUN = !args.includes('--confirm');
if (DRY_RUN && !args.includes('--dry-run')) {
  console.log('No --confirm flag. Running in DRY-RUN mode (no emails sent).');
  console.log('Use --confirm to actually send emails.\n');
}

// --- Load investor emails from gitignored local file ---
const __dirname = dirname(fileURLToPath(import.meta.url));
const contactsPath = join(__dirname, 'investor-contacts.local.json');
let contactEmails: Record<string, string> = {};
if (existsSync(contactsPath)) {
  try {
    contactEmails = JSON.parse(readFileSync(contactsPath, 'utf-8'));
    console.log(`Loaded ${Object.keys(contactEmails).length} email addresses from investor-contacts.local.json`);
  } catch (e) {
    console.error(`Warning: Could not parse ${contactsPath}:`, e);
  }
} else {
  console.log('No investor-contacts.local.json found — all emails will be self-sent.');
  console.log(`Create ${contactsPath} with { "Name": "email@example.com" } to send directly.\n`);
}

function resolveRecipient(label: string): string | null {
  for (const [name, email] of Object.entries(contactEmails)) {
    if (label.includes(name) && email) return email;
  }
  return null;
}

interface OutreachEmail {
  label: string;
  subject: string;
  body: string;
}

const emails: OutreachEmail[] = [
  // ── 1. Giuseppe Lacerenza — Keen Venture Partners (WARM) ──────────
  {
    label: '1/13 Giuseppe Lacerenza — Keen Venture Partners',
    subject: 'European carbon sovereignty infrastructure — dual-use angle',
    body: `Hi Giuseppe,

Risto Päärni, CEO of Lifetime Oy (Finland). I was connected to you through my network — your work building a strategic technologies fund for European security maps directly to what we're shipping.

The short version: EU industrial companies face four overlapping carbon regulations (ETS, CBAM, CSRD, Taxonomy) and have no unified infrastructure to manage them. We built the carbon balance sheet — double-entry bookkeeping for CO2, so every tonne is tracked like every euro. 18 AI agents, 20 regulated verticals, EU-sovereign architecture with zero US cloud dependency.

Why this is a dual-use story:

- Defence supply chains face the same CBAM obligations as civilian ones. Every EU defence contractor importing steel, aluminium, or chemicals needs carbon accounting for compliance.
- Carbon data is sovereign data. The ability to independently audit industrial emissions without relying on US-hosted platforms is a strategic capability, not just a compliance exercise.
- EU AI Act compliant from day one. We built our AI agent framework (Aegis) with Article 12 logging and reasoning lineage — the same transparency requirements that will apply to defence AI systems.

5 paying customers today (€7K MRR, 100% retention). Launching V1 at Arctic 15 in Helsinki on June 15. Raising €650K on a €3.8M SAFE cap.

I'd welcome 30 minutes to walk through the architecture and dual-use thesis. Your NATO DIANA perspective would sharpen our defence positioning.

Best,
Risto Päärni
CEO, Lifetime Oy
risto.paarni@lifetime.fi
Business ID: 0772407-9 (Finland)`,
  },

  // ── 2. Ferdinand Reynolds — SuperSeed Ventures ────────────────────
  {
    label: '2/13 Ferdinand Reynolds — SuperSeed Ventures',
    subject: 'Supply chain carbon intelligence — warm intro',
    body: `Hi Ferdinand,

Risto Päärni, CEO of Lifetime Oy (Espoo, Finland). Following up on our recent connection — I think there's a direct overlap between your manufacturing and supply chain AI thesis and what we're building.

EU manufacturers that can't account for their carbon exposure are losing supply chain access. CBAM border adjustment means every importer must track embedded carbon from their suppliers — and the data infrastructure doesn't exist yet. We built it.

We're building the carbon balance sheet — double-entry bookkeeping for CO2 across ETS, CBAM, CSRD, and EU Taxonomy. Every tonne tracked like every euro. 18 AI agents scoring compliance across 20 regulated industrial verticals — steel, cement, chemicals, aluminium, the sectors you invest in.

5 paying customers today (€7K MRR, 100% retention). The regulatory wave is creating forced adoption: Fit for 55, CBAM phase-in, CSRD mandatory reporting. This isn't optional software — it's supply chain compliance infrastructure.

We're raising €650K on a €3.8M SAFE cap. Launching V1 publicly at Arctic 15 in Helsinki on June 15.

Happy to send a one-pager or jump on a call — whatever works best.

Best,
Risto Päärni
CEO, Lifetime Oy
risto.paarni@lifetime.fi
Business ID: 0772407-9 (Finland)`,
  },

  // ── 3. Colin Brown — Sparkmind Capital ────────────────────────────
  {
    label: '3/13 Colin Brown — Sparkmind Capital',
    subject: 'Carbon accounting as critical infrastructure — podcast angle?',
    body: `Hi Colin,

Risto Päärni, CEO of Lifetime Oy (Finland). EU companies that can't account for their carbon exposure can't secure their supply chains. That's the problem we solve.

We built the carbon balance sheet — double-entry bookkeeping for CO2 across ETS, CBAM, CSRD, and Taxonomy. Every tonne tracked like every euro. 6 industrial customers live today (KELA, Taksi Helsinki, Uber Finland, Bolt Finland, Limo Helsinki, Sixt). The regulatory wave (Fit for 55, CBAM border adjustment, CSRD mandatory reporting) is creating forced adoption — this isn't optional software, it's sovereignty infrastructure.

Your European Security Growth Fund thesis maps directly here. Energy security and material sovereignty converge at the carbon ledger. The compliance layer is becoming as strategically important as energy supply itself.

We're raising EUR 650K on a EUR 3.8M SAFE cap. Persefoni raised their Series A at a higher implied valuation with less traction.

I'd love to explore this as a conversation on the Protect Europe Podcast — "Carbon accounting as critical infrastructure: why EU sovereignty depends on knowing what you emit." If that angle resonates, happy to send a one-pager ahead of time.

Best,
Risto Päärni
CEO, Lifetime Oy
risto.paarni@lifetime.fi
Business ID: 0772407-9 (Finland)`,
  },

  // ── 4. Juho Vehviläinen — Coventures ─────────────────────────────
  {
    label: '4/13 Juho Vehviläinen — Coventures',
    subject: 'Carbon balance sheet infrastructure — coffee in Helsinki?',
    body: `Hi Juho,

Risto Päärni, Lifetime Oy (Espoo). I think there's a natural overlap between what Coventures builds and where we're heading.

EU companies that can't account for their carbon exposure can't secure their supply chains. We built the infrastructure to fix that — double-entry bookkeeping for CO2 across ETS, CBAM, CSRD, and Taxonomy. Every tonne tracked like every euro.

6 industrial customers live today (KELA, Taksi Helsinki, Uber Finland, Bolt Finland, Limo Helsinki, Sixt). The regulatory wave is creating forced adoption — Fit for 55, CBAM border adjustment, CSRD mandatory reporting. This isn't optional software, it's compliance infrastructure.

Why this might resonate with your portfolio thesis:

- You spin out deep tech from corporate labs into standalone companies. We're doing the inverse — taking fragmented EU regulatory compliance and consolidating it into one ledger. Same pattern, different axis.
- Your defence ventures understand sovereignty. Carbon accounting is becoming sovereignty infrastructure — companies and governments that can't measure emissions lose trade access under CBAM.
- Nordic-built, Nordic-headquartered. Espoo. No US cloud dependency.

We're raising EUR 650K on a EUR 3.8M SAFE cap. Persefoni raised their Series A at a higher implied valuation with $1.8M ARR. We're at EUR 84K ARR with 100% retention.

Would be great to grab coffee in Helsinki and walk you through the architecture. What works for you?

Best,
Risto Päärni
CEO, Lifetime Oy
risto.paarni@lifetime.fi
Business ID: 0772407-9 (Finland)`,
  },

  // ── 5. Markus Linder — Triple Impact Ventures ─────────────────────
  {
    label: '5/13 Markus Linder — Triple Impact Ventures',
    subject: 'Carbon balance sheet SaaS — planting a seed for when timing is right',
    body: `Hi Markus,

Risto Päärni, Lifetime Oy (Finland). Quick note — I know you're deep in the inoqo-Mondra integration, so this is a seed, not an ask.

We built carbon balance sheet infrastructure: double-entry bookkeeping for CO2 across ETS, CBAM, CSRD, and EU Taxonomy. Software-only, no hardware dependency. 6 industrial customers live today.

Why it might fit your thesis later:

- Pure compliance SaaS with regulatory tailwind (Fit for 55 forces adoption)
- Carbon + euro tracked in the same ledger — the accounting layer the market is missing
- EUR 650K SAFE round at EUR 3.8M cap. Persefoni raised their Series A at a higher implied valuation with $1.8M ARR. We're at EUR 84K ARR with 100% retention.

No rush. When the Mondra dust settles and you're looking at the next wave of climate infrastructure plays, I'd welcome a conversation.

Best,
Risto
risto.paarni@lifetime.fi`,
  },

  // ── 6. Philipp Rupprecht — Proximo Ventures (WARM) ────────────────
  {
    label: '6/13 Philipp Rupprecht — Proximo Ventures',
    subject: 'Intro — DWS IQ: Carbon Balance Sheet + EU Sovereign AI (Pre-seed, €650K SAFE)',
    body: `Hi Philipp,

Great speaking with you recently. Following up as discussed.

We're building the carbon balance sheet — double-entry bookkeeping for CO2 across 20 EU-regulated industries. What makes us different: the same infrastructure serves both decarbonization compliance (CSRD, CBAM, ETS) and EU sovereign AI for critical infrastructure (our Aegis framework).

Current state: 18 AI agents in production, 5 paying customers (€7K MRR, zero churn), V1 launching at Arctic 15 in Helsinki on June 15. Raising €650K on a SAFE at €3.8M cap.

My background bridges academia to commercialization — Metropolia master thesis on industrial AI, currently in the LUT PhD program on compliance automation. The product is the research, productized.

We have a Captain Seat (€50K) that gives you a named industry vertical with quarterly briefings and Situation Room access. Happy to walk through the structure and share our investor memo.

Best,
Risto Päärni
CEO, Lifetime Oy
risto.paarni@lifetime.fi`,
  },

  // ── 7. Graeme Allen — Level Four Seven (WARM) ─────────────────────
  {
    label: '7/13 Graeme Allen — Level Four Seven',
    subject: 'Intro — DWS IQ: Carbon Balance Sheet Infrastructure (TRL 6-7, EU Deep Tech)',
    body: `Hi Graeme,

Great speaking with you recently. Following up as discussed.

We're building the carbon balance sheet — double-entry bookkeeping for CO2, so every tonne is tracked like every euro. 18 AI agents in production across 20 EU-regulated industries, with CSRD/CBAM/ETS compliance automation.

We're at TRL 6-7: validated technology with 5 paying customers (€7K MRR, zero churn), launching V1 publicly at Arctic 15 in Helsinki on June 15. Currently raising €650K on a SAFE at €3.8M cap to fund a 2-month sales sprint post-launch.

This sits squarely in your TRL 4-7 thesis — hard climate tech infrastructure, not wrapper AI. Would love to explore whether this is a fit for LvlUp Ventures or Flashpoint, or anyone in your network who's writing checks into EU regulatory infrastructure.

Happy to share our investor memo and a 15-minute demo.

Best,
Risto Päärni
CEO, Lifetime Oy
risto.paarni@lifetime.fi`,
  },

  // ── 8. Steven Miller — Black Prism Capital Partners (WARM) ────────
  {
    label: '8/13 Steven Miller — Black Prism Capital Partners',
    subject: 'Intro — Aegis: EU-Sovereign AI for Defense & Compliance (Dual-Use Deep Tech)',
    body: `Hi Steven,

I was connected to you through my network. I'm building something that sits at the intersection of your two worlds — defense-grade AI infrastructure and EU regulatory compliance.

DWS IQ is a platform of 18 AI agents that serve two markets from one codebase: civilian compliance (carbon balance sheet for CSRD/CBAM/ETS across 20 industries) and EU-sovereign defense supply chain monitoring (our Aegis framework). Think of it as the ITAR-free EU alternative to US defense AI — NATO-interoperable, CLOUD Act-free, built entirely on EU infrastructure.

Current state: 5 paying customers, €7K MRR, zero churn. V1 launching at Arctic 15 (Helsinki) on June 15. Raising €650K on a SAFE at €3.8M cap.

Your background scaling defense intelligence to $80M ARR is exactly the kind of operator perspective we need as we position Aegis for EU defense procurement. Would welcome 15 minutes to walk you through the dual-use architecture and how the civilian revenue stream de-risks the defense bet.

Best,
Risto Päärni
CEO, Lifetime Oy
risto.paarni@lifetime.fi`,
  },

  // ── 9. Serge Koniski — Amundi Alpha Associates (pre-conference) ───
  {
    label: '9/13 Serge Koniski — Amundi Alpha Associates',
    subject: 'Carbon compliance infrastructure for PE secondaries — PE Insights Zurich',
    body: `Hi Serge,

Risto Päärni, CEO of Lifetime Oy (Helsinki). I noticed you're speaking at PE Insights Switzerland in June on the secondaries panel — your engineering background combined with energy sector IB experience is a rare combination in secondaries.

I'm building DWS IQ 6 — automated carbon balance sheet infrastructure. 18 deterministic AI agents score ETS, CBAM, CSRD, and EU Taxonomy compliance across 20 regulated industries. Every score is auditable and traces to regulatory source data. No black-box ESG ratings.

The secondaries angle: portfolio companies across DACH industrials face growing carbon regulatory exposure (ETS allowance costs, CBAM border adjustment, CSRD mandatory reporting). Carbon compliance readiness is becoming a material factor in secondary pricing and continuation fund valuations.

5 paying customers today (€7K MRR, 100% retention). Launching V1 at Arctic 15 in Helsinki on June 15.

Would be good to connect ahead of PE Insights Zurich — happy to walk you through the methodology. Given your McGill CS engineering background, I think you'd find the architecture interesting.

Best,
Risto Päärni
CEO, Lifetime Oy
risto.paarni@lifetime.fi
Business ID: 0772407-9 (Finland)`,
  },

  // ── 10. Elena Laleh — Kline Hill Partners (pre-conference) ────────
  {
    label: '10/13 Elena Laleh — Kline Hill Partners',
    subject: 'Carbon compliance for GP-led portfolio companies — PE Insights Zurich',
    body: `Hi Elena,

Risto Päärni, CEO of Lifetime Oy (Helsinki). Your work on GP-led secondaries at Kline Hill, especially in the European mid-market, caught my attention.

I'm building automated carbon compliance infrastructure for exactly the kind of portfolio companies KHP backs. Mid-market industrials face ETS, CBAM, and CSRD mandates but can't afford Big 4 consultants — we automate that at EUR 36K/year per company with 18 deterministic AI agents across 20 EU-regulated industries.

The GP-led angle: when you're structuring a continuation vehicle around a single asset, carbon compliance readiness directly affects the LP pitch. Our carbon balance sheet gives auditable ESG data for LP reporting — not black-box ratings, but regulatory fact-based scores traceable to EUR-Lex source data.

5 paying customers today (100% retention). Launching V1 at Arctic 15 in Helsinki on June 15.

I see you're speaking at PE Insights Switzerland in June. Would be great to connect ahead of the event — or over coffee in Zurich if that's easier.

Best,
Risto Päärni
CEO, Lifetime Oy
risto.paarni@lifetime.fi
Business ID: 0772407-9 (Finland)`,
  },

  // ── 11. Thomas Hallinger — Golding Capital Partners (pre-conference)
  {
    label: '11/13 Thomas Hallinger — Golding Capital Partners',
    subject: 'Carbon compliance scoring for PE secondaries — PE Insights Zurich',
    body: `Hi Thomas,

Risto Päärni, CEO of Lifetime Oy (Helsinki). I read your work on ESG due diligence for secondaries at Golding — it's exactly the problem we're solving with software.

We build DWS IQ 6: automated carbon balance sheet infrastructure that scores ETS, CBAM, and CSRD compliance across 20 EU-regulated industries. 18 deterministic AI agents, auditable methodology, every score traces back to regulatory source data. No subjective ESG ratings.

For Golding's secondaries portfolio: carbon compliance readiness is becoming a material factor in continuation fund valuations and LP reporting. Portfolio companies across DACH industrials face growing regulatory exposure — and the ones that can demonstrate automated, auditable compliance are worth more at exit.

5 paying customers today (100% retention). Launching V1 at Arctic 15 in Helsinki on June 15.

I see you're speaking at PE Insights Switzerland in June. Would be good to connect ahead of the event — happy to walk through how this works as a portfolio value-creation tool.

Best,
Risto Päärni
CEO, Lifetime Oy
risto.paarni@lifetime.fi
Business ID: 0772407-9 (Finland)`,
  },

  // ── 12. Andrea Pompili — StepStone Group (pre-conference) ─────────
  {
    label: '12/13 Andrea Pompili — StepStone Group',
    subject: 'Deterministic carbon scoring for secondaries due diligence — PE Insights Zurich',
    body: `Hi Andrea,

Risto Päärni, CEO of Lifetime Oy (Helsinki). Your data-driven approach to secondaries at StepStone caught my attention — I'm building something with a similar philosophy for carbon compliance.

DWS IQ 6 uses 18 deterministic AI agents to score ETS, CBAM, and CSRD compliance across 20 EU-regulated industries. Every score is auditable, repeatable, and traces to regulatory source data (EUR-Lex, EEA). No black-box ESG ratings — just regulatory fact-based compliance data that feeds directly into due diligence and LP reporting.

The secondaries application: screen any asset or portfolio for carbon regulatory exposure in minutes instead of weeks. For single-asset continuation vehicles, compliance readiness directly affects valuation.

5 paying customers today (100% retention). Launching V1 at Arctic 15 in Helsinki on June 15.

I see you're speaking at PE Insights Switzerland in June. Would be great to connect ahead of the event.

Best,
Risto Päärni
CEO, Lifetime Oy
risto.paarni@lifetime.fi
Business ID: 0772407-9 (Finland)`,
  },

  // ── 13. Cornelis Jansen — INKEF Capital (COLD, reframed) ──────────
  {
    label: '13/13 Cornelis Jansen — INKEF Capital',
    subject: 'EU-sovereign industrial AI agents — frontier AI for regulated industries',
    body: `Hi Cornelis,

Risto Päärni, CEO of Lifetime Oy (Finland). Your thesis on European sovereignty in compute and frontier AI is exactly where we're building.

We've deployed 18 deterministic AI agents across 20 EU-regulated industries — steel, cement, chemicals, aluminium, defence. EU-sovereign architecture: zero US cloud dependency, EU AI Act Article 12 compliance from day one, CLOUD Act-free infrastructure (Supabase EU, GCP europe-north1, Hetzner Helsinki).

What makes this frontier: our Aegis framework brings defence-grade AI transparency to industrial compliance. Every agent decision has full reasoning lineage — the same audit trail the EU AI Act will require for high-risk systems. This isn't wrapper AI. It's deterministic scoring engines built for regulated environments where black-box outputs are unacceptable.

5 paying customers today (€7K MRR, zero churn). Launching V1 at Arctic 15 in Helsinki on June 15. Raising €650K on a SAFE at €3.8M cap.

Your check size (€0.5M–€7M) could anchor the round. Would welcome 20 minutes to walk through the architecture.

Best,
Risto Päärni
CEO, Lifetime Oy
risto.paarni@lifetime.fi
Business ID: 0772407-9 (Finland)`,
  },
];

function textToHtml(text: string): string {
  const escaped = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 15px; line-height: 1.6; color: #1a1a1a; max-width: 600px; margin: 0 auto; padding: 20px;">
${escaped.split('\n\n').map(p => `<p style="margin: 0 0 14px 0;">${p.replace(/\n/g, '<br>')}</p>`).join('\n')}
</body></html>`;
}

async function main() {
  const mode = DRY_RUN ? 'DRY-RUN' : 'LIVE';
  console.log(`=== DWS Investor Outreach — 13 Emails [${mode}] ===`);
  console.log(`From: ${FROM}`);
  console.log('');

  let sent = 0;
  let failed = 0;
  let selfSent = 0;
  let directSend = 0;

  for (const email of emails) {
    const directEmail = resolveRecipient(email.label);
    const recipient = directEmail || SELF;
    const isDirect = !!directEmail;
    const tag = isDirect ? 'DIRECT' : 'SELF-SEND (no email address)';

    console.log(`${email.label}`);
    console.log(`  To: ${recipient} [${tag}]`);

    if (DRY_RUN) {
      console.log('  SKIPPED (dry-run)');
      if (isDirect) directSend++;
      else selfSent++;
      continue;
    }

    const subjectPrefix = isDirect ? '' : '[REVIEW & FORWARD] ';

    const result = await sendEmail({
      from: FROM,
      to: recipient,
      subject: `${subjectPrefix}${email.subject}`,
      html: textToHtml(email.body),
      text: email.body,
    });

    if (result.ok) {
      console.log(`  OK (${result.transport})`);
      sent++;
      if (!isDirect) selfSent++;
      else directSend++;
    } else {
      console.log(`  FAILED: ${result.error}`);
      failed++;
    }

    // 1s delay between sends to avoid SES throttle
    if (emails.indexOf(email) < emails.length - 1) {
      await new Promise(r => setTimeout(r, 1000));
    }
  }

  console.log('');
  if (DRY_RUN) {
    console.log(`DRY-RUN complete: ${directSend} would send direct, ${selfSent} would self-send.`);
    console.log('Run with --confirm to actually send.');
  } else {
    console.log(`Done: ${sent} sent (${directSend} direct, ${selfSent} self-send), ${failed} failed`);
    if (selfSent > 0) {
      console.log(`\n${selfSent} emails went to ${SELF} — add addresses to investor-contacts.local.json and re-run.`);
    }
  }
  process.exit(failed > 0 ? 1 : 0);
}

main();
