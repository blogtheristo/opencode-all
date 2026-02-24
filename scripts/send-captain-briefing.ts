#!/usr/bin/env npx tsx
/**
 * Captain Pre-Briefing Sender
 *
 * Two modes:
 *   1. Named captain:  npx tsx scripts/send-captain-briefing.ts "Anna Gueorguieva"
 *   2. Auto (cron):    npx tsx scripts/send-captain-briefing.ts --auto
 *      Finds all captains with next_action_date = today and sends a briefing for each.
 *
 * Required env vars:
 *   RESEND_API_KEY
 *   SUPABASE_URL + SUPABASE_SERVICE_KEY
 *
 * Optional env vars:
 *   CAPTAIN_BRIEFING_EMAIL (default: risto@lifetime.fi)
 *   EMAIL_FROM (default: risto@onelifetime.world)
 */

import dotenv from 'dotenv';
dotenv.config();

import { collectCaptainBriefingData } from '../src/captain-briefing/data-collectors.js';
import {
  buildCaptainBriefingHtml,
  buildCaptainBriefingPlainText,
} from '../src/captain-briefing/briefing-template.js';

// ============================================================================
// SUPABASE HELPER (for auto-mode captain discovery)
// ============================================================================

async function findTodaysCaptains(): Promise<string[]> {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;
  if (!url || !key) {
    console.error('SUPABASE_URL and SUPABASE_SERVICE_KEY required for --auto mode');
    return [];
  }

  const today = new Date().toISOString().split('T')[0];

  try {
    const response = await fetch(
      `${url}/rest/v1/v_outreach_enriched?next_action_date=eq.${today}&status=in.(responded,meeting_booked,in_negotiation)&select=person_name&order=next_action_date.asc`,
      {
        headers: {
          'Content-Type': 'application/json',
          apikey: key,
          Authorization: `Bearer ${key}`,
        },
      }
    );

    if (!response.ok) {
      console.error('Failed to fetch today\'s captains:', response.status);
      return [];
    }

    const rows = (await response.json()) as Array<{ person_name: string }>;
    // Deduplicate by name
    const names = [...new Set(rows.map(r => r.person_name).filter(Boolean))];
    return names;
  } catch (err) {
    console.error('Error fetching captains:', err);
    return [];
  }
}

// ============================================================================
// SEND EMAIL
// ============================================================================

async function sendBriefingEmail(
  captainName: string,
  html: string,
  text: string
): Promise<boolean> {
  const recipient = process.env.CAPTAIN_BRIEFING_EMAIL || process.env.OUTREACH_DIGEST_EMAIL || 'risto@lifetime.fi';
  const fromAddress = process.env.EMAIL_FROM || 'risto@onelifetime.world';
  const resendKey = process.env.RESEND_API_KEY;

  if (!resendKey) {
    console.log('\n--- No RESEND_API_KEY, printing to console ---\n');
    console.log(text);
    return true;
  }

  const dateStr = new Date().toLocaleDateString('en-GB', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
  const subject = `Captain Briefing: ${captainName} — ${dateStr}`;

  console.log(`Sending: "${subject}" → ${recipient}`);

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${resendKey}`,
    },
    body: JSON.stringify({
      from: fromAddress,
      to: [recipient],
      subject,
      html,
      text,
      headers: {
        'X-DWS-Email-Type': 'captain-briefing',
        'X-DWS-Captain': captainName,
      },
    }),
  });

  if (response.ok) {
    const result = (await response.json()) as { id: string };
    console.log(`Sent captain briefing for ${captainName} (id: ${result.id})`);
    return true;
  }

  const errorBody = await response.text();
  console.error(`Failed to send briefing for ${captainName}:`, response.status, errorBody);
  return false;
}

// ============================================================================
// MAIN
// ============================================================================

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const isAuto = args.includes('--auto');

  let captainNames: string[];

  if (isAuto) {
    console.log('Auto mode: finding captains with actions due today...');
    captainNames = await findTodaysCaptains();

    if (captainNames.length === 0) {
      console.log('No captains with actions due today. Exiting.');
      process.exit(0);
    }

    console.log(`Found ${captainNames.length} captain(s): ${captainNames.join(', ')}`);
  } else {
    // Named captain mode
    const name = args.filter(a => !a.startsWith('--')).join(' ').trim();
    if (!name) {
      console.error('Usage:');
      console.error('  npx tsx scripts/send-captain-briefing.ts "Captain Name"');
      console.error('  npx tsx scripts/send-captain-briefing.ts --auto');
      process.exit(1);
    }
    captainNames = [name];
  }

  let sent = 0;
  let failed = 0;

  for (const name of captainNames) {
    console.log(`\nCollecting briefing data for: ${name}`);
    const data = await collectCaptainBriefingData(name);
    const html = buildCaptainBriefingHtml(data);
    const text = buildCaptainBriefingPlainText(data);

    const ok = await sendBriefingEmail(name, html, text);
    if (ok) sent++;
    else failed++;
  }

  console.log(`\nDone. Sent: ${sent}, Failed: ${failed}`);
  if (failed > 0) process.exit(1);
}

main().catch(err => {
  console.error('Captain briefing error:', err);
  process.exit(1);
});
