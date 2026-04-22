/**
 * TED outreach: SES sends for new leads, follow-ups, weekly learning aggregates.
 *
 * Daily cap (TED_OUTREACH_DAILY_CAP): both initial batch and follow-ups use
 * `rpc/ted_outreach_reserve_send` — one atomic lock + increment per attempted send
 * (see migration 048). There is no per-lead GET on `ted_outreach_daily_send`; the
 * authoritative count after each reservation is `reserved.new_count`. On SES failure,
 * `ted_outreach_release_send` rolls back that increment. After a successful send when
 * `new_count >= cap`, we stop the loop without another reserve (last slot consumed).
 */

import { sendEmail } from '../utils/send-email.js';
import logger from '../utils/logger.js';
import type { ConstructionLeadRow } from './types.js';

function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing required env: ${name}`);
  return v;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

async function restFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const url = requireEnv('SUPABASE_URL');
  const key = requireEnv('SUPABASE_SERVICE_KEY');
  const baseHeaders: Record<string, string> = {
    apikey: key,
    Authorization: `Bearer ${key}`,
  };
  if (options.body !== undefined) {
    baseHeaders['Content-Type'] = 'application/json';
  }
  const merged = new Headers(baseHeaders);
  const extra = new Headers(options.headers);
  extra.forEach((v, k) => merged.set(k, v));
  if (!merged.has('Prefer') && options.method !== 'PATCH') {
    merged.set('Prefer', 'return=representation');
  }

  const response = await fetch(`${url}/rest/v1/${path}`, {
    ...options,
    headers: merged,
  });
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Supabase ${response.status}: ${body}`);
  }
  if (response.status === 204) return [] as unknown as T;
  const text = await response.text();
  if (!text) return [] as unknown as T;
  return JSON.parse(text) as T;
}

/** Map country → template language code for learning aggregates */
export function inferOutreachLang(countryCode: string | null | undefined): string {
  const cc = (countryCode || '').toUpperCase();
  const map: Record<string, string> = {
    FI: 'fi',
    SE: 'sv',
    NO: 'no',
    DK: 'da',
    DE: 'de',
    AT: 'de',
    CH: 'de',
    FR: 'fr',
    NL: 'nl',
    ES: 'es',
    IT: 'it',
    PL: 'pl',
    EE: 'et',
    LV: 'lv',
    LT: 'lt',
  };
  return map[cc] || 'en';
}

function cpvPrefix(cpv: string | null | undefined): string {
  if (!cpv) return 'unknown';
  const c = cpv.replace(/\D/g, '');
  return c.slice(0, 5) || 'unknown';
}

/** Atomically reserve one send slot (server-side lock + increment if under cap). Call before SES. */
async function reserveSendRpc(cap: number): Promise<{ success: boolean; new_count: number }> {
  const rows = await restFetch<Array<{ success: boolean; new_count: number }>>('rpc/ted_outreach_reserve_send', {
    method: 'POST',
    body: JSON.stringify({ p_cap: cap }),
  });
  const row = rows[0];
  return row || { success: false, new_count: -1 };
}

/** Undo one reservation when the email send fails after reserve (keeps daily count accurate). */
async function releaseSendRpc(): Promise<void> {
  try {
    await restFetch<Array<{ success: boolean; new_count: number }>>('rpc/ted_outreach_release_send', {
      method: 'POST',
      body: '{}',
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    logger.warn('TED outreach: release_send RPC failed after failed SES send', { error: msg });
  }
}

function outreachToHtml(lead: ConstructionLeadRow, kind: 'initial' | 'followup'): string {
  const buyer = escapeHtml(lead.buyer_name || 'Buyer TBD');
  const title = escapeHtml(lead.title);
  const url = escapeHtml(lead.ted_url || '');
  const erp = escapeHtml(lead.resolved_erp || 'unknown');
  const cpv = escapeHtml(lead.cpv_code || '');
  const intro =
    kind === 'followup'
      ? '<p><strong>Follow-up</strong> (day 3) — tender still relevant for DWS outreach.</p>'
      : '<p>New TED construction lead matching compliance keywords + CPV pipeline.</p>';

  return `
  <div style="font-family: system-ui, sans-serif; max-width: 640px;">
    ${intro}
    <h2 style="margin: 0 0 8px;">${title}</h2>
    <p style="margin: 0 0 12px; color: #444;"><strong>Buyer:</strong> ${buyer}<br/>
    <strong>CPV:</strong> ${cpv}<br/>
    <strong>ERP hint:</strong> ${erp}<br/>
    <a href="${url}">TED notice</a></p>
    <p style="font-size: 12px; color: #666;">Source: construction_leads / ted_leads · DWS IQ 6</p>
  </div>`;
}

/**
 * Send up to TED_OUTREACH_DAILY_CAP (default 50) emails for leads created in last 24h, not yet sent.
 */
export async function runTedOutreachInitialBatch(): Promise<{ sent: number; skippedCap: boolean }> {
  const to = process.env.TED_OUTREACH_TO || process.env.OUTREACH_DIGEST_EMAIL;
  if (!to) {
    throw new Error('Set TED_OUTREACH_TO or OUTREACH_DIGEST_EMAIL for outreach recipient');
  }

  const from = process.env.EMAIL_FROM || 'risto@onelifetime.world';
  const cap = Math.min(parseInt(process.env.TED_OUTREACH_DAILY_CAP || '50', 10), 200);

  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const filter = `outreach_sent=eq.false&created_at=gte.${encodeURIComponent(since)}&order=relevance_score.desc&limit=100&select=*`;

  const rows = await restFetch<ConstructionLeadRow[]>(`construction_leads?${filter}`);

  let sent = 0;
  for (const lead of rows) {
    const reserved = await reserveSendRpc(cap);
    if (!reserved.success) {
      logger.warn('TED outreach: daily cap reached', { new_count: reserved.new_count, cap });
      return { sent, skippedCap: true };
    }
    const lang = inferOutreachLang(lead.country_code);
    const subject =
      (process.env.TED_OUTREACH_SUBJECT_PREFIX || '[TED]') +
      ` ${lead.title.slice(0, 80)}${lead.title.length > 80 ? '…' : ''}`;

    const result = await sendEmail({
      from,
      to,
      subject,
      html: outreachToHtml(lead, 'initial'),
      text: `${lead.title}\n${lead.ted_url || ''}`,
    });

    if (!result.ok) {
      await releaseSendRpc();
      logger.error('TED outreach: send failed', { id: lead.id, error: result.error });
      continue;
    }

    await restFetch(`construction_leads?id=eq.${lead.id}`, {
      method: 'PATCH',
      headers: { Prefer: 'return=minimal' },
      body: JSON.stringify({
        outreach_sent: true,
        sent_at: new Date().toISOString(),
        open_rate_lang: lang,
        status: 'outreach_started',
      }),
    });

    sent += 1;
  }

  return { sent, skippedCap: false };
}

/**
 * Day-3 follow-up for rows already sent, not yet follow-upped, sent_at older than 3 days.
 */
export async function runTedOutreachFollowUps(): Promise<{ sent: number }> {
  const to = process.env.TED_OUTREACH_TO || process.env.OUTREACH_DIGEST_EMAIL;
  if (!to) {
    throw new Error('Set TED_OUTREACH_TO or OUTREACH_DIGEST_EMAIL');
  }
  const from = process.env.EMAIL_FROM || 'risto@onelifetime.world';

  const cutoff = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString();
  const filter = `outreach_sent=eq.true&follow_up_sent=eq.false&sent_at=lte.${encodeURIComponent(cutoff)}&limit=30&select=*`;

  const rows = await restFetch<ConstructionLeadRow[]>(`construction_leads?${filter}`);
  let sent = 0;

  const cap = Math.min(parseInt(process.env.TED_OUTREACH_DAILY_CAP || '50', 10), 200);

  for (const lead of rows) {
    const reserved = await reserveSendRpc(cap);
    if (!reserved.success) {
      logger.warn('TED follow-up: daily cap reached', { new_count: reserved.new_count, cap });
      break;
    }
    const countAfterReserve = reserved.new_count;

    const subject = `[TED follow-up] ${lead.title.slice(0, 72)}${lead.title.length > 72 ? '…' : ''}`;
    const result = await sendEmail({
      from,
      to,
      subject,
      html: outreachToHtml(lead, 'followup'),
      text: `Follow-up: ${lead.title}\n${lead.ted_url || ''}`,
    });
    if (!result.ok) {
      await releaseSendRpc();
      logger.error('TED follow-up: send failed', { id: lead.id, error: result.error });
      continue;
    }

    await restFetch(`construction_leads?id=eq.${lead.id}`, {
      method: 'PATCH',
      headers: { Prefer: 'return=minimal' },
      body: JSON.stringify({
        follow_up_sent: true,
        follow_up_sent_at: new Date().toISOString(),
      }),
    });
    sent += 1;
    if (countAfterReserve >= cap) {
      break;
    }
  }

  return { sent };
}

export interface WeeklyLearningResult {
  /** One merge-duplicates upsert per cohort bucket; includes updates, not inserts only. */
  cohortsUpserted: number;
  flags: string[];
}

/**
 * Aggregate last 7 days of sends by language + CPV; upsert one row per cohort into
 * `ted_outreach_learning_log` (open/reply/bounce rates, optional `template_flag` and
 * `volume_adjust_note`). When DE cohorts have enough sends and open rate &lt; 10%,
 * `template_flag` is set to `review_de_low_open` on that **log row**; strong FI cohorts
 * get a `volume_adjust_note` only. Does **not** PATCH `construction_leads.template_flag`.
 */
export async function runWeeklyTedLearning(): Promise<WeeklyLearningResult> {
  const minSends = parseInt(process.env.TED_LEARNING_MIN_SENDS || '50', 10);
  const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const leads = await restFetch<ConstructionLeadRow[]>(
    `construction_leads?outreach_sent=eq.true&sent_at=gte.${encodeURIComponent(since)}&select=id,open_rate_lang,cpv_code,opened,replied,bounced,template_flag,country_code`,
  );

  const buckets = new Map<
    string,
    { lang: string; cpv: string; sends: number; opens: number; replies: number; bounces: number }
  >();

  for (const row of leads) {
    const lang = row.open_rate_lang || inferOutreachLang(row.country_code);
    const cpv = cpvPrefix(row.cpv_code);
    const key = `${lang}|${cpv}`;
    if (!buckets.has(key)) {
      buckets.set(key, { lang, cpv, sends: 0, opens: 0, replies: 0, bounces: 0 });
    }
    const b = buckets.get(key)!;
    b.sends += 1;
    if (row.opened) b.opens += 1;
    if (row.replied) b.replies += 1;
    if (row.bounced) b.bounces += 1;
  }

  const weekStart = new Date();
  weekStart.setUTCDate(weekStart.getUTCDate() - 7);
  weekStart.setUTCHours(0, 0, 0, 0);
  const weekStartStr = weekStart.toISOString().slice(0, 10);

  const flags: string[] = [];
  let cohortsUpserted = 0;

  for (const [, agg] of buckets) {
    const openRate = agg.sends ? agg.opens / agg.sends : 0;
    const replyRate = agg.sends ? agg.replies / agg.sends : 0;
    const bounceRate = agg.sends ? agg.bounces / agg.sends : 0;

    let templateFlag: string | null = null;
    let volumeNote: string | null = null;

    if (agg.lang === 'de' && agg.sends >= minSends && openRate < 0.1) {
      templateFlag = 'review_de_low_open';
      flags.push(`de:${agg.cpv}:${templateFlag}`);
    }
    if (agg.lang === 'fi' && openRate >= 0.3) {
      volumeNote = 'FI segment strong — consider prioritising FI volume in template rotation.';
      flags.push(`fi:${agg.cpv}:prioritise`);
    }

    await restFetch('ted_outreach_learning_log', {
      method: 'POST',
      headers: {
        Prefer: 'resolution=merge-duplicates,return=minimal',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        week_start: weekStartStr,
        lang: agg.lang,
        cpv_prefix: agg.cpv,
        sends: agg.sends,
        opens: agg.opens,
        replies: agg.replies,
        bounces: agg.bounces,
        open_rate: Number(openRate.toFixed(5)),
        reply_rate: Number(replyRate.toFixed(5)),
        bounce_rate: Number(bounceRate.toFixed(5)),
        template_flag: templateFlag,
        volume_adjust_note: volumeNote,
      }),
    });
    cohortsUpserted += 1;
  }

  return { cohortsUpserted, flags };
}
