/**
 * ============================================================================
 * CORRECTION NOTICE (29.07.2026) — DO NOT EDIT THE MESSAGE BODIES BELOW
 * ============================================================================
 * This file is a RECORD OF MAIL THAT WAS ALREADY SENT (28 March 2026). Per
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
 * Send 5 Final Draft investor outreach emails to risto@lifetime.fi
 * for review-and-forward workflow.
 *
 * Usage: npx tsx scripts/send-investor-batch-2026-03-28.ts
 *
 * Requires: SMTP_HOST, SMTP_USER, SMTP_PASS in .env
 * Sends TO: risto@lifetime.fi (self-send for review)
 * Sends FROM: risto@onelifetime.world
 *
 * Code-Version: 1.0
 * Introduced-In: PR-TBD
 * Branch: claude/add-investor-contact-FSWNH
 * Date: 2026-03-28
 * Owner: Claude Opus 4.6
 */

import 'dotenv/config';
import { sendEmail } from '../src/utils/send-email.js';

const FROM = process.env.EMAIL_FROM || 'risto@onelifetime.world';
const TO = 'risto@lifetime.fi';

interface OutreachEmail {
  label: string;
  subject: string;
  body: string;
}

const emails: OutreachEmail[] = [
  {
    label: '1/5 Giuseppe Lacerenza — Keen Venture Partners',
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
  {
    label: '2/5 Ferdinand Reynolds — SuperSeed Ventures',
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
  {
    label: '3/5 Colin Brown — Sparkmind Capital',
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
  {
    label: '4/5 Juho Vehviläinen — Coventures',
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
  {
    label: '5/5 Markus Linder — Triple Impact Ventures',
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
];

function textToHtml(text: string): string {
  const escaped = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 15px; line-height: 1.6; color: #1a1a1a; max-width: 600px; margin: 0 auto; padding: 20px;">
<p style="background: #fef3c7; padding: 10px 14px; border-radius: 6px; font-size: 13px; color: #92400e; margin-bottom: 20px;">
<strong>REVIEW &amp; FORWARD</strong> — This email was self-sent for your review. Forward to the investor or copy into LinkedIn InMail.
</p>
${escaped.split('\n\n').map(p => `<p style="margin: 0 0 14px 0;">${p.replace(/\n/g, '<br>')}</p>`).join('\n')}
</body></html>`;
}

async function main() {
  console.log('=== DWS Investor Outreach Batch Send ===');
  console.log(`From: ${FROM}`);
  console.log(`To: ${TO} (self-send for review)`);
  console.log(`Emails: ${emails.length}`);
  console.log('');

  let sent = 0;
  let failed = 0;

  for (const email of emails) {
    console.log(`Sending ${email.label}...`);
    const result = await sendEmail({
      from: FROM,
      to: TO,
      subject: `[INVESTOR OUTREACH] ${email.subject}`,
      html: textToHtml(email.body),
      text: email.body,
    });

    if (result.ok) {
      console.log(`  OK (${result.transport})`);
      sent++;
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
  console.log(`Done: ${sent} sent, ${failed} failed`);
  process.exit(failed > 0 ? 1 : 0);
}

main();
