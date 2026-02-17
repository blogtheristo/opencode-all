/**
 * Morning Briefing — Data Collectors
 *
 * CEO Cockpit: 5-minute daily briefing at 06:00 Helsinki.
 *
 * Template sections:
 *   1. 3 Changes — what moved since yesterday (pipeline, product, delivery)
 *   2. Today's 3 Bets — the only 3 outcomes that matter today
 *   3. Risks — top blocker + next action
 *   4. Captain Momentum — who to ping + what artifact to send
 *   5. Metrics Strip — cash runway, active convos, commits, MVP ETA
 *
 * Outreach stays separate: generates a "send list" for manual execution.
 *
 * All Supabase calls are best-effort: a section failure
 * does not block the rest of the briefing.
 */

import logger from '../utils/logger.js';

// ============================================================================
// TYPES
// ============================================================================

/** Delta since yesterday */
export interface ThreeChanges {
  pipeline: string;
  product: string;
  delivery: string;
}

/** The 3 highest-priority outreach contacts to reach today */
export interface SendListItem {
  name: string;
  org: string | null;
  pipeline: string;
  action: string;
  linkedin_url: string | null;
}

/** Who to ping + what artifact to send */
export interface CaptainMomentum {
  contacts: SendListItem[];
  artifact: string;
}

/** Top blocker + suggested next action */
export interface TopRisk {
  blocker: string;
  next_action: string;
}

/** The 3 non-negotiable metrics */
export interface MetricsStrip {
  mrr_eur: number | null;
  active_conversations: number;
  weekly_commits: number;
  mvp_eta: string | null;
}

export interface CockpitData {
  date: string;
  dateFormatted: string;
  dayOfWeek: string;
  changes: ThreeChanges;
  bets: string[];
  risk: TopRisk;
  momentum: CaptainMomentum;
  metrics: MetricsStrip;
  sendList: SendListItem[];
}

// ============================================================================
// SUPABASE HELPER
// ============================================================================

async function supabaseFetch<T>(path: string): Promise<T | null> {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;

  if (!url || !key) return null;

  try {
    const response = await fetch(`${url}/rest/v1/${path}`, {
      headers: {
        'Content-Type': 'application/json',
        apikey: key,
        Authorization: `Bearer ${key}`,
        Prefer: 'return=representation',
      },
    });

    if (!response.ok) {
      const body = await response.text();
      logger.warn('Morning briefing Supabase fetch failed', {
        path,
        status: response.status,
        error: body,
      });
      return null;
    }

    return response.json() as Promise<T>;
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    logger.warn('Morning briefing Supabase fetch error', { path, error: msg });
    return null;
  }
}

// ============================================================================
// COLLECTORS
// ============================================================================

/**
 * Detect pipeline changes since yesterday from outreach_threads.
 */
async function collectPipelineChange(): Promise<string> {
  const yesterday = new Date(Date.now() - 86_400_000).toISOString().split('T')[0];

  // Count threads updated since yesterday
  const threads = await supabaseFetch<Array<{ status: string; pipeline: string }>>(
    `v_outreach_enriched?created_at=gte.${yesterday}T00:00:00&select=status,pipeline`
  );

  if (!threads || threads.length === 0) return 'No pipeline movement';

  const byPipeline: Record<string, number> = {};
  for (const t of threads) {
    byPipeline[t.pipeline] = (byPipeline[t.pipeline] || 0) + 1;
  }

  const parts = Object.entries(byPipeline).map(
    ([p, count]) => `${count} ${p}`
  );
  return `${threads.length} threads moved: ${parts.join(', ')}`;
}

/**
 * Check agent activity in the last 24h (product velocity).
 */
async function collectProductChange(): Promise<string> {
  const yesterday = new Date(Date.now() - 86_400_000).toISOString();

  const logs = await supabaseFetch<Array<{ id: string; status: string }>>(
    `agent_logs?select=id,status&timestamp=gte.${yesterday}`
  );

  const count = logs?.length || 0;
  if (count > 0) {
    const completed = logs!.filter((l) => l.status === 'completed').length;
    return `${count} agent tasks (${completed} completed)`;
  }
  return 'No product signals captured';
}

/**
 * Check for recent delivery milestones.
 */
async function collectDeliveryChange(): Promise<string> {
  // Check Firehorse leads that moved to responded/converted yesterday
  const yesterday = new Date(Date.now() - 86_400_000).toISOString().split('T')[0];

  const converted = await supabaseFetch<Array<{ state: string }>>(
    `firehorse_leads?select=state&updated_at=gte.${yesterday}T00:00:00&state=in.(responded,converted)`
  );

  if (converted && converted.length > 0) {
    const responded = converted.filter((l) => l.state === 'responded').length;
    const won = converted.filter((l) => l.state === 'converted').length;
    const parts: string[] = [];
    if (responded > 0) parts.push(`${responded} responded`);
    if (won > 0) parts.push(`${won} converted`);
    return parts.join(', ');
  }

  return 'No delivery changes';
}

/**
 * Collect the 3 changes (pipeline, product, delivery).
 */
async function collectThreeChanges(): Promise<ThreeChanges> {
  const [pipeline, product, delivery] = await Promise.all([
    collectPipelineChange(),
    collectProductChange(),
    collectDeliveryChange(),
  ]);

  return { pipeline, product, delivery };
}

/**
 * Auto-generate today's 3 bets based on what's overdue/due.
 */
async function collectTodaysBets(): Promise<string[]> {
  const today = new Date().toISOString().split('T')[0];

  const threads = await supabaseFetch<
    Array<{ status: string; pipeline: string; next_action: string; next_action_date: string; first_name: string; org_name: string }>
  >(
    `v_outreach_enriched?next_action_date=lte.${today}&status=not.in.(converted,passed,parked)&order=next_action_date.asc&limit=5&select=status,pipeline,next_action,next_action_date,first_name,org_name`
  );

  if (!threads || threads.length === 0) {
    return [
      'Source 3 new contacts (LinkedIn / Boardy / conferences)',
      'Ship one product improvement',
      'Review investor pipeline status',
    ];
  }

  // Pick up to 3 highest-priority actions
  const bets: string[] = [];
  for (const t of threads.slice(0, 3)) {
    const action = t.next_action || `Follow up with ${t.first_name}`;
    const org = t.org_name ? ` (${t.org_name})` : '';
    bets.push(`${action}${org}`);
  }

  return bets;
}

/**
 * Identify the top risk/blocker.
 */
async function collectTopRisk(): Promise<TopRisk> {
  const today = new Date().toISOString().split('T')[0];

  // Find the most overdue thread
  const overdue = await supabaseFetch<
    Array<{ first_name: string; org_name: string; next_action_date: string; pipeline: string; next_action: string }>
  >(
    `v_outreach_enriched?next_action_date=lt.${today}&status=not.in.(converted,passed,parked)&order=next_action_date.asc&limit=1&select=first_name,org_name,next_action_date,pipeline,next_action`
  );

  if (overdue && overdue.length > 0) {
    const t = overdue[0];
    const daysOverdue = Math.floor(
      (Date.now() - new Date(t.next_action_date).getTime()) / 86_400_000
    );
    return {
      blocker: `${t.first_name} (${t.org_name || t.pipeline}) — ${daysOverdue}d overdue`,
      next_action: t.next_action || `Nudge ${t.first_name} or park the thread`,
    };
  }

  return {
    blocker: 'No critical blockers',
    next_action: 'Stay on schedule',
  };
}

/**
 * Build the "Captain Momentum" section — who to ping + artifact suggestion.
 */
async function collectMomentum(): Promise<CaptainMomentum> {
  const today = new Date().toISOString().split('T')[0];

  // Active deals + due today: these are the people to ping
  const threads = await supabaseFetch<
    Array<{
      first_name: string; last_name: string; org_name: string;
      pipeline: string; next_action: string; linkedin_url: string;
      status: string; next_action_date: string;
    }>
  >(
    `v_outreach_enriched?or=(status.in.(responded,meeting_booked,in_negotiation),next_action_date.eq.${today})&status=not.in.(converted,passed,parked)&order=next_action_date.asc&limit=5&select=first_name,last_name,org_name,pipeline,next_action,linkedin_url,status,next_action_date`
  );

  const contacts: SendListItem[] = (threads || []).map((t) => ({
    name: [t.first_name, t.last_name].filter(Boolean).join(' '),
    org: t.org_name || null,
    pipeline: t.pipeline,
    action: t.next_action || 'Follow up',
    linkedin_url: t.linkedin_url || null,
  }));

  // Suggest artifact based on pipeline focus
  const hasInvestor = contacts.some((c) => c.pipeline === 'investor');
  const hasCustomer = contacts.some((c) => c.pipeline === 'customer');
  let artifact = 'Prepare follow-up message';
  if (hasInvestor) artifact = 'Situation Room investor pack';
  if (hasCustomer) artifact = 'Construction 1-pager or demo link';

  return { contacts, artifact };
}

/**
 * Collect the metrics strip.
 */
async function collectMetrics(): Promise<MetricsStrip> {
  // MRR: from env var or Supabase config (EUR)
  const mrrEnv = process.env.MRR_EUR;
  const mrr_eur = mrrEnv ? parseFloat(mrrEnv) : null;

  // Active conversations: count non-closed outreach threads
  const convos = await supabaseFetch<Array<{ id: string }>>(
    `v_outreach_enriched?status=not.in.(converted,passed,parked)&select=id`
  );
  const active_conversations = convos?.length || 0;

  // Weekly commits: from env var (set by CI) or default 0
  const commitsEnv = process.env.WEEKLY_COMMITS;
  const weekly_commits = commitsEnv ? parseInt(commitsEnv, 10) : 0;

  // MVP ETA: from env var
  const mvp_eta = process.env.MVP_ETA || null;

  return { mrr_eur, active_conversations, weekly_commits, mvp_eta };
}

/**
 * Build the send list — top 3-5 contacts to manually message today.
 * Prioritizes: overdue > due today > active deals > waiting.
 */
async function collectSendList(): Promise<SendListItem[]> {
  const today = new Date().toISOString().split('T')[0];

  const threads = await supabaseFetch<
    Array<{
      first_name: string; last_name: string; org_name: string;
      pipeline: string; next_action: string; linkedin_url: string;
      status: string; next_action_date: string;
    }>
  >(
    `v_outreach_enriched?next_action_date=lte.${today}&status=not.in.(converted,passed,parked)&order=next_action_date.asc&limit=5&select=first_name,last_name,org_name,pipeline,next_action,linkedin_url,status,next_action_date`
  );

  return (threads || []).map((t) => ({
    name: [t.first_name, t.last_name].filter(Boolean).join(' '),
    org: t.org_name || null,
    pipeline: t.pipeline,
    action: t.next_action || 'Follow up',
    linkedin_url: t.linkedin_url || null,
  }));
}

// ============================================================================
// MAIN COLLECTOR
// ============================================================================

/**
 * Collect all CEO cockpit data in parallel.
 */
export async function collectCockpitData(): Promise<CockpitData> {
  const now = new Date();
  const date = now.toISOString().split('T')[0];
  const dateFormatted = now.toLocaleDateString('en-GB', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const dayOfWeek = now.toLocaleDateString('en-GB', { weekday: 'short' });

  const [changes, bets, risk, momentum, metrics, sendList] = await Promise.all([
    collectThreeChanges(),
    collectTodaysBets(),
    collectTopRisk(),
    collectMomentum(),
    collectMetrics(),
    collectSendList(),
  ]);

  return {
    date,
    dateFormatted,
    dayOfWeek,
    changes,
    bets,
    risk,
    momentum,
    metrics,
    sendList,
  };
}
