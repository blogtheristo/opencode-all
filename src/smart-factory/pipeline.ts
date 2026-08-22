/**
 * Smart Factory for Sales — daily pipeline.
 *
 *   1. Load / create the campaign with its product catalog (any size)
 *   2. Source candidate prospects (EU target universe + TED/construction leads
 *      when available in Supabase)
 *   3. Match candidates against every product; keep scored matches
 *   4. Upsert matched prospects to smart_factory_prospects
 *   5. Compose per-channel messages and deliver through the rate-capped sender
 *
 * Without Supabase credentials the run degrades to a dry-run report
 * (match only, nothing persisted or sent).
 */

import logger from '../utils/logger.js';
import { EU_TARGET_UNIVERSE } from '../agents/outreach-lead-finder.agent.js';
import { loadDefaultCatalog, normalizeCatalog } from './catalog.js';
import { matchAll } from './match.js';
import { composeMessage, planChannels } from './channels.js';
import { restFetch, supabaseConfigured } from './supabase.js';
import { deliverOne, emailConfigured, type ProspectRow, whatsappConfigured } from './sender.js';
import type {
  CampaignConfig,
  Channel,
  DispatchSummary,
  MatchedProspect,
  NormalizedProduct,
  PipelineRunSummary,
  PlannedMessage,
  ProspectCandidate,
} from './types.js';

// ---------------------------------------------------------------------------
// Campaign persistence
// ---------------------------------------------------------------------------

export async function ensureCampaign(opts: {
  name: string;
  products: NormalizedProduct[];
  channels?: Channel[];
  dailyCap?: number;
}): Promise<CampaignConfig> {
  const channels = opts.channels || ['email'];
  const dailyCap = Math.max(
    1,
    Math.min(500, opts.dailyCap ?? Number(process.env.SMART_FACTORY_DAILY_CAP || 30)),
  );

  const rows = await restFetch<Array<{ id: string }>>('smart_factory_campaigns', {
    method: 'POST',
    headers: { Prefer: 'resolution=merge-duplicates,return=representation' },
    body: JSON.stringify({
      name: opts.name,
      catalog: opts.products,
      channels,
      daily_cap: dailyCap,
      status: 'active',
    }),
  });
  const row = rows[0];
  if (!row) throw new Error('smart_factory_campaigns upsert returned no row');
  return { id: row.id, name: opts.name, catalog: opts.products, channels, dailyCap, status: 'active' };
}

// ---------------------------------------------------------------------------
// Prospect sourcing
// ---------------------------------------------------------------------------

/** Map the static EU universe into ProspectCandidates. */
export function candidatesFromUniverse(): ProspectCandidate[] {
  return EU_TARGET_UNIVERSE.map((c) => ({
    orgName: c.name,
    domain: c.domain,
    countryCode: c.region,
    industry: c.industry,
    signals: c.regulations.map((r) => `${r} exposure`),
    source: 'eu_universe',
  }));
}

interface TedLeadRow {
  id: string;
  buyer_name?: string | null;
  country_code?: string | null;
  title: string;
  resolved_erp?: string | null;
}

/** Pull recent TED construction leads as additional demand-signal candidates. */
async function candidatesFromTedLeads(limit = 50): Promise<ProspectCandidate[]> {
  if (!supabaseConfigured()) return [];
  try {
    const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const rows = await restFetch<TedLeadRow[]>(
      `construction_leads?created_at=gte.${encodeURIComponent(since)}&order=relevance_score.desc&limit=${limit}&select=id,buyer_name,country_code,title,resolved_erp`,
    );
    return rows.map((r) => ({
      orgName: r.buyer_name || `TED buyer ${r.id.slice(0, 8)}`,
      countryCode: r.country_code || undefined,
      signals: [r.title, r.resolved_erp].filter(Boolean) as string[],
      source: 'ted_construction',
    }));
  } catch (err) {
    logger.warn('smart-factory: TED lead source unavailable', {
      error: err instanceof Error ? err.message : String(err),
    });
    return [];
  }
}

// ---------------------------------------------------------------------------
// Prospect persistence — upsert + fetch back real DB ids
// ---------------------------------------------------------------------------

async function upsertProspects(
  campaignId: string,
  matched: MatchedProspect[],
): Promise<Array<MatchedProspect & { id: string }>> {
  if (matched.length === 0) return [];

  await restFetch('smart_factory_prospects', {
    method: 'POST',
    headers: { Prefer: 'resolution=merge-duplicates,return=minimal' },
    body: JSON.stringify(
      matched.map((m) => ({
        campaign_id: campaignId,
        dedup_key: m.dedupKey,
        org_name: m.orgName,
        domain: m.domain || null,
        country_code: m.countryCode || null,
        industry: m.industry || null,
        contact_name: m.contactName || null,
        email: m.email || null,
        phone: m.phone || null,
        linkedin_url: m.linkedinUrl || null,
        facebook_url: m.facebookUrl || null,
        source: m.source,
        matched_products: m.matches,
        fit_score: m.fitScore,
        status: m.email || m.phone || m.linkedinUrl ? 'matched' : 'new',
      })),
    ),
  });

  // Fetch back ids for this batch of dedup keys.
  const keys = matched.map((m) => `dedup_key.eq.${encodeURIComponent(m.dedupKey)}`).join(',');
  const rows = await restFetch<
    Array<{
      id: string;
      dedup_key: string;
      org_name: string;
      email: string | null;
      phone: string | null;
      linkedin_url: string | null;
    }>
  >(`smart_factory_prospects?or=(${keys})&select=id,dedup_key,org_name,email,phone,linkedin_url`);

  const byKey = new Map(rows.map((r) => [r.dedup_key, r]));
  return matched
    .map((m) => {
      const row = byKey.get(m.dedupKey);
      return row ? { ...m, id: row.id } : null;
    })
    .filter((x): x is MatchedProspect & { id: string } => x !== null);
}

// ---------------------------------------------------------------------------
// Main entry point
// ---------------------------------------------------------------------------

export interface RunOptions {
  campaignName: string;
  /** Explicit catalog payload; defaults to the DWS store catalog file. */
  catalogRaw?: unknown;
  channels?: Channel[];
  dailyCap?: number;
  /** Persist matches but skip message dispatch. */
  noSend?: boolean;
}

function emptySummary(name: string): PipelineRunSummary {
  return {
    campaign: name,
    prospectsScanned: 0,
    prospectsMatched: 0,
    prospectsUpserted: 0,
    messagesQueued: 0,
    messagesSent: { email: 0, whatsapp: 0, linkedin: 0, facebook: 0 },
    messagesFailed: 0,
    capReached: false,
    callsBooked: 0,
  };
}

export async function runSmartFactoryPipeline(opts: RunOptions): Promise<PipelineRunSummary> {
  const summary = emptySummary(opts.campaignName);
  const catalog = opts.catalogRaw ? normalizeCatalog(opts.catalogRaw) : loadDefaultCatalog();
  if (catalog.length === 0) throw new Error('empty catalog — nothing to sell');

  // ── Source + match ──────────────────────────────────────────────────────
  const candidates = [...candidatesFromUniverse(), ...(await candidatesFromTedLeads())];
  summary.prospectsScanned = candidates.length;

  const matched = matchAll(candidates, catalog);
  summary.prospectsMatched = matched.length;

  logger.info('smart-factory: matching done', {
    campaign: opts.campaignName,
    products: catalog.length,
    scanned: candidates.length,
    matched: matched.length,
  });

  if (!supabaseConfigured()) {
    logger.info('smart-factory: SUPABASE not configured — dry run, nothing persisted');
    return summary;
  }

  // ── Persist ─────────────────────────────────────────────────────────────
  const campaign = await ensureCampaign({
    name: opts.campaignName,
    products: catalog,
    channels: opts.channels,
    dailyCap: opts.dailyCap,
  });
  const persisted = await upsertProspects(campaign.id, matched);
  summary.prospectsUpserted = persisted.length;

  // ── Compose ─────────────────────────────────────────────────────────────
  const messagesByProspect = new Map<string, PlannedMessage[]>();
  let queued = 0;
  for (const p of persisted) {
    const plan = planChannels(p, campaign.channels);
    const messages: PlannedMessage[] = [];
    for (const item of plan) {
      const msg = composeMessage(p, p.id, campaign.id, item.channel);
      if (!msg) continue;
      if (item.automatable) messages.push(msg);
      else if (process.env.SMART_FACTORY_QUEUE_MANUAL === 'true') messages.push(msg);
    }
    if (messages.length > 0) {
      messagesByProspect.set(p.id, messages);
      queued += messages.length;
    }
  }
  summary.messagesQueued = queued;

  if (opts.noSend) {
    logger.info('smart-factory: noSend mode — messages composed but not dispatched', { queued });
    return summary;
  }

  // ── Dispatch ────────────────────────────────────────────────────────────
  logger.info('smart-factory: transports', { email: emailConfigured(), whatsapp: whatsappConfigured() });
  const dispatchResult: DispatchSummary = {
    attempted: 0,
    sent: { email: 0, whatsapp: 0, linkedin: 0, facebook: 0 },
    failed: 0,
    manualQueued: 0,
    capReached: false,
  };

  outer: for (const p of persisted) {
    const messages = messagesByProspect.get(p.id);
    if (!messages) continue;
    const row: ProspectRow = {
      id: p.id,
      org_name: p.orgName,
      email: p.email || null,
      phone: p.phone || null,
      linkedin_url: p.linkedinUrl || null,
    };
    for (const msg of messages) {
      const canContinue = await deliverOne(campaign, row, msg, dispatchResult);
      if (!canContinue) break outer; // daily cap reached
    }
  }

  summary.messagesSent = dispatchResult.sent;
  summary.messagesFailed = dispatchResult.failed;
  summary.capReached = dispatchResult.capReached;

  logger.info('smart-factory: run complete', { ...summary });
  return summary;
}
