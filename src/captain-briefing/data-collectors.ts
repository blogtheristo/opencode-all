/**
 * Captain Pre-Briefing — Data Collectors
 *
 * Fires 30 minutes before a scheduled captain call.
 * Pulls thread history, outreach activity, proposal status,
 * and meeting notes from Supabase to prepare the CEO.
 *
 * All Supabase calls are best-effort: a section failure
 * does not block the rest of the briefing.
 */

import logger from '../utils/logger.js';

// ============================================================================
// TYPES
// ============================================================================

export interface CaptainThread {
  id: string;
  thread_token: string;
  pipeline: string;
  status: string;
  next_action_type: string | null;
  next_action_date: string | null;
  last_outbound_at: string | null;
  last_inbound_at: string | null;
  notes: string | null;
}

export interface CaptainPerson {
  full_name: string;
  title: string | null;
  primary_email: string | null;
  phone: string | null;
  linkedin_url: string | null;
}

export interface CaptainOrg {
  name: string;
  domain: string | null;
  industry: string | null;
  country: string | null;
  employee_count: number | null;
}

export interface OutreachActivity {
  activity_type: string;
  channel: string;
  subject: string | null;
  created_at: string;
  snippet: string | null;
}

export interface ProposalInfo {
  title: string;
  status: string;
  amount_eur: number;
  sent_at: string | null;
  valid_until: string | null;
  notes: string | null;
}

export interface MeetingInfo {
  title: string;
  meeting_type: string;
  status: string;
  scheduled_at: string;
  outcome_notes: string | null;
  next_steps: string | null;
}

export interface CaptainBriefingData {
  /** Captain's full name */
  captainName: string;
  /** Organization details */
  org: CaptainOrg | null;
  /** Contact details */
  person: CaptainPerson | null;
  /** Active thread with this captain */
  thread: CaptainThread | null;
  /** Recent outreach activity (last 10) */
  recentActivity: OutreachActivity[];
  /** Active proposals */
  proposals: ProposalInfo[];
  /** Past and upcoming meetings */
  meetings: MeetingInfo[];
  /** Key talking points (auto-generated from activity) */
  talkingPoints: string[];
  /** Suggested next action */
  suggestedAction: string;
  /** Days since last contact */
  daysSinceContact: number | null;
  /** Generated timestamp */
  generatedAt: string;
}

// ============================================================================
// SUPABASE HELPER (same pattern as morning briefing)
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
      logger.warn('Captain briefing Supabase fetch failed', {
        path,
        status: response.status,
        error: body,
      });
      return null;
    }

    return (await response.json()) as T;
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    logger.warn('Captain briefing Supabase fetch error', { path, error: msg });
    return null;
  }
}

// ============================================================================
// COLLECTORS
// ============================================================================

/**
 * Find the enriched outreach thread for a captain by name or org.
 */
async function collectThread(
  captainName: string
): Promise<CaptainThread | null> {
  // Try exact match on person name via enriched view
  const threads = await supabaseFetch<CaptainThread[]>(
    `v_outreach_enriched?person_name=ilike.*${encodeURIComponent(captainName)}*&select=id,thread_token,pipeline,status,next_action_type,next_action_date,last_outbound_at,last_inbound_at,notes&limit=1`
  );
  return threads?.[0] ?? null;
}

/**
 * Fetch person details from outreach_persons.
 */
async function collectPerson(
  captainName: string
): Promise<CaptainPerson | null> {
  const persons = await supabaseFetch<CaptainPerson[]>(
    `outreach_persons?full_name=ilike.*${encodeURIComponent(captainName)}*&select=full_name,title,primary_email,phone,linkedin_url&limit=1`
  );
  return persons?.[0] ?? null;
}

/**
 * Fetch org details from outreach_orgs via thread's org_id.
 */
async function collectOrg(threadId: string): Promise<CaptainOrg | null> {
  // Get org_id from thread, then fetch org
  const threadRows = await supabaseFetch<Array<{ org_id: string }>>(
    `outreach_threads?id=eq.${threadId}&select=org_id&limit=1`
  );
  const orgId = threadRows?.[0]?.org_id;
  if (!orgId) return null;

  const orgs = await supabaseFetch<CaptainOrg[]>(
    `outreach_orgs?id=eq.${orgId}&select=name,domain,industry,country,employee_count&limit=1`
  );
  return orgs?.[0] ?? null;
}

/**
 * Fetch recent outreach activity for a thread.
 */
async function collectActivity(
  threadId: string
): Promise<OutreachActivity[]> {
  const activities = await supabaseFetch<OutreachActivity[]>(
    `outreach_activity?thread_id=eq.${threadId}&select=activity_type,channel,subject,created_at,snippet&order=created_at.desc&limit=10`
  );
  return activities ?? [];
}

/**
 * Fetch proposals linked to a lead/thread.
 */
async function collectProposals(threadId: string): Promise<ProposalInfo[]> {
  const proposals = await supabaseFetch<ProposalInfo[]>(
    `proposals?thread_id=eq.${threadId}&select=title,status,amount_eur,sent_at,valid_until,notes&order=created_at.desc&limit=5`
  );
  return proposals ?? [];
}

/**
 * Fetch meetings linked to a lead/thread.
 */
async function collectMeetings(threadId: string): Promise<MeetingInfo[]> {
  const meetings = await supabaseFetch<MeetingInfo[]>(
    `meetings?thread_id=eq.${threadId}&select=title,meeting_type,status,scheduled_at,outcome_notes,next_steps&order=scheduled_at.desc&limit=5`
  );
  return meetings ?? [];
}

/**
 * Generate talking points from recent activity and thread status.
 */
function generateTalkingPoints(
  thread: CaptainThread | null,
  activity: OutreachActivity[],
  proposals: ProposalInfo[],
  meetings: MeetingInfo[]
): string[] {
  const points: string[] = [];

  // Thread status context
  if (thread) {
    if (thread.status === 'responded' || thread.status === 'meeting_booked') {
      points.push(`Status: ${thread.status.replace(/_/g, ' ')} — they're engaged`);
    }
    if (thread.status === 'in_negotiation') {
      points.push('In negotiation — focus on closing terms');
    }
    if (thread.notes) {
      points.push(`Last note: ${thread.notes.slice(0, 120)}`);
    }
  }

  // Recent activity highlights
  const lastInbound = activity.find(a => a.activity_type === 'inbound');
  if (lastInbound) {
    points.push(
      `Last reply (${lastInbound.channel}): ${lastInbound.snippet?.slice(0, 100) || lastInbound.subject || 'No preview'}`
    );
  }

  // Active proposals
  const activeProposal = proposals.find(
    p => p.status === 'sent' || p.status === 'under_review' || p.status === 'negotiation'
  );
  if (activeProposal) {
    points.push(
      `Active proposal: ${activeProposal.title} — €${activeProposal.amount_eur.toLocaleString()} (${activeProposal.status})`
    );
    if (activeProposal.valid_until) {
      const daysLeft = Math.ceil(
        (new Date(activeProposal.valid_until).getTime() - Date.now()) / 86_400_000
      );
      if (daysLeft <= 7) points.push(`Proposal expires in ${daysLeft} days`);
    }
  }

  // Last meeting outcome
  const lastMeeting = meetings.find(m => m.status === 'completed');
  if (lastMeeting?.next_steps) {
    points.push(`Last meeting next steps: ${lastMeeting.next_steps.slice(0, 120)}`);
  }

  // Upcoming meeting
  const upcoming = meetings.find(
    m => m.status === 'scheduled' && new Date(m.scheduled_at) > new Date()
  );
  if (upcoming) {
    points.push(`Upcoming: ${upcoming.title} on ${new Date(upcoming.scheduled_at).toLocaleDateString('en-GB')}`);
  }

  if (points.length === 0) {
    points.push('No recent activity — this is a fresh conversation');
  }

  return points;
}

/**
 * Suggest the best next action based on thread state.
 */
function suggestNextAction(
  thread: CaptainThread | null,
  proposals: ProposalInfo[],
  daysSince: number | null
): string {
  if (!thread) return 'Introduce DWS IQ 6 and gauge compliance pain points';

  const activeProposal = proposals.find(
    p => p.status === 'sent' || p.status === 'under_review'
  );

  if (activeProposal) return `Follow up on proposal: ${activeProposal.title}`;
  if (thread.status === 'in_negotiation') return 'Discuss terms and close';
  if (thread.status === 'meeting_booked') return 'Confirm meeting agenda and prep demo';
  if (thread.status === 'responded') return 'Schedule a demo call';
  if (daysSince && daysSince > 14) return 'Re-engage — it has been over 2 weeks';
  if (thread.next_action_type) return `Execute: ${thread.next_action_type}`;

  return 'Continue building relationship — ask about their compliance timeline';
}

// ============================================================================
// MAIN COLLECTOR
// ============================================================================

/**
 * Collect all data for a captain pre-briefing.
 * @param captainName - Name of the captain (fuzzy match)
 */
export async function collectCaptainBriefingData(
  captainName: string
): Promise<CaptainBriefingData> {
  // Phase 1: Find thread and person (parallel)
  const [thread, person] = await Promise.all([
    collectThread(captainName),
    collectPerson(captainName),
  ]);

  // Phase 2: If thread found, fetch related data (parallel)
  let org: CaptainOrg | null = null;
  let recentActivity: OutreachActivity[] = [];
  let proposals: ProposalInfo[] = [];
  let meetings: MeetingInfo[] = [];

  if (thread?.id) {
    [org, recentActivity, proposals, meetings] = await Promise.all([
      collectOrg(thread.id),
      collectActivity(thread.id),
      collectProposals(thread.id),
      collectMeetings(thread.id),
    ]);
  }

  // Calculate days since last contact
  const lastContact = thread?.last_inbound_at || thread?.last_outbound_at;
  const daysSinceContact = lastContact
    ? Math.floor((Date.now() - new Date(lastContact).getTime()) / 86_400_000)
    : null;

  // Generate talking points and suggested action
  const talkingPoints = generateTalkingPoints(thread, recentActivity, proposals, meetings);
  const suggestedAction = suggestNextAction(thread, proposals, daysSinceContact);

  return {
    captainName: person?.full_name || captainName,
    org,
    person,
    thread,
    recentActivity,
    proposals,
    meetings,
    talkingPoints,
    suggestedAction,
    daysSinceContact,
    generatedAt: new Date().toISOString(),
  };
}
