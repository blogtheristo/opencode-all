/**
 * Vesta — Business-Critical Systems Registry Agent
 *
 * Code-Version: 1.0
 * Branch: claude/sanasto-cybersecurity-terms-az3tby
 * Date: 2026-07-03
 * Owner: Lifetime Oy (risto.paarni@lifetime.fi)
 *
 * Named after the Roman goddess of hearth and home — keeper of the sacred
 * fire that must never go out. Vesta is the queryable form of
 * docs/BUSINESS_CRITICAL_SYSTEMS.md: given a system name, it returns the
 * documented criticality tier and impact-if-disrupted; given no name, it
 * lists the full registry and flags any entry overdue for review.
 *
 * Created 2026-07-03: a repo audit found no business-critical systems
 * inventory existed anywhere in the repo before this — the registry below
 * IS the canonical list (kept in lockstep with
 * docs/BUSINESS_CRITICAL_SYSTEMS.md; update both together).
 *
 * Input: { action: 'list' | 'lookup' | 'stale-check', system?: string }
 * Output: registry entries, single-system detail, or overdue-review flags
 */

import { BaseAgent } from './base.agent.js';
import type { AgentContext, AgentResponse } from './types.js';

type Criticality = 'critical' | 'high' | 'medium';

interface SystemEntry {
  name: string;
  criticality: Criticality;
  impactIfDisrupted: string;
  owner: string;
  /** ISO date this entry was last confirmed accurate. */
  lastReviewed: string;
}

/** Kept in lockstep with docs/BUSINESS_CRITICAL_SYSTEMS.md — update both together. */
const REGISTRY: SystemEntry[] = [
  {
    name: 'Supabase (primary database)',
    criticality: 'critical',
    impactIfDisrupted:
      'Only production datastore; also the EU AI Act Art. 12 execution-log store. Outage stops the platform.',
    owner: 'Engineering',
    lastReviewed: '2026-07-03',
  },
  {
    name: 'DGX Spark (primary compute + cron)',
    criticality: 'critical',
    impactIfDisrupted:
      'Runs dws-backend, dws-cron, firehorse-reports. Cloud Run is documented failover but not fully equivalent.',
    owner: 'Engineering',
    lastReviewed: '2026-07-03',
  },
  {
    name: 'Cloudflare Pages — dws6.com / lifetime.fi',
    criticality: 'critical',
    impactIfDisrupted: 'Customer- and investor-facing sites. Outage is publicly visible.',
    owner: 'Engineering',
    lastReviewed: '2026-07-03',
  },
  {
    name: 'Cloudflare Worker dws-revolut-checkout',
    criticality: 'critical',
    impactIfDisrupted:
      'Revolut side of the hybrid Revolut+Stripe payment flow. Verified live via the ' +
      'Cloudflare Developer Platform connector 2026-07-03 — only Worker on the account.',
    owner: 'Engineering',
    lastReviewed: '2026-07-03',
  },
  {
    name: 'Stripe (payments)',
    criticality: 'critical',
    impactIfDisrupted: 'Revenue path. Webhook failures silently drop billing events.',
    owner: 'Engineering',
    lastReviewed: '2026-07-03',
  },
  {
    name: 'Cloudflare Pages — dws10.com / onelifetime.world',
    criticality: 'medium',
    impactIfDisrupted: 'Secondary sites (store, blog). Degrades marketing/store, not core product.',
    owner: 'Engineering',
    lastReviewed: '2026-07-03',
  },
  {
    name: 'Amazon SES (email)',
    criticality: 'medium',
    impactIfDisrupted: 'Transactional/notification email path. Delays outreach, not core product.',
    owner: 'Engineering',
    lastReviewed: '2026-07-03',
  },
  {
    name: 'MCP servers (mcp-hub, mcp-hub-ts, mcp-servers/*)',
    criticality: 'medium',
    impactIfDisrupted:
      'Internal tool-serving layer for agents/Claude Code sessions, not directly customer-facing.',
    owner: 'Engineering',
    lastReviewed: '2026-07-03',
  },
  {
    name: 'GitHub Actions + DGX Spark cron (two-tier automation)',
    criticality: 'high',
    impactIfDisrupted:
      'Deploy workflows are high-impact; reporting/content workflows are lower. See Cron-works.md.',
    owner: 'Engineering',
    lastReviewed: '2026-07-03',
  },
  {
    name: 'Claude Code hooks (.claude/hooks/)',
    criticality: 'medium',
    impactIfDisrupted:
      'Secret-leak and SQL-safety guardrails for agent sessions. Disruption is a latent risk, not an outage.',
    owner: 'Security',
    lastReviewed: '2026-07-03',
  },
];

/** Flag entries not reviewed in this many days. */
const STALE_THRESHOLD_DAYS = 180;

function daysSince(isoDate: string, today: Date): number {
  return Math.max(0, Math.floor((today.getTime() - new Date(isoDate).getTime()) / 86_400_000));
}

export class VestaAgent extends BaseAgent {
  constructor() {
    super({
      name: 'vesta',
      description:
        'Business-critical systems registry — queryable form of docs/BUSINESS_CRITICAL_SYSTEMS.md. ' +
        'Looks up criticality tier and impact-if-disrupted for a named system, lists the full ' +
        `registry (${REGISTRY.length} systems), or flags entries overdue for review.`,
      capabilities: [
        'systems-registry-lookup',
        'criticality-classification',
        'stale-review-detection',
      ],
      model: 'llama-3.3-70b-versatile',
      modelTier: 'lite',
    });
  }

  async execute(context: AgentContext, input: Record<string, unknown>): Promise<AgentResponse> {
    const action = (input.action as string) || 'list';
    const systemQuery = (input.system as string) || '';
    const today = new Date();

    if (action === 'lookup') {
      const match = REGISTRY.find((s) => s.name.toLowerCase().includes(systemQuery.toLowerCase()));

      return {
        agentName: this.config.name,
        result: { action, query: systemQuery, match: match || null },
        confidence: match ? 0.95 : 0.3,
        reasoning: match
          ? `Found "${match.name}" — criticality: ${match.criticality}`
          : `No registry entry matches "${systemQuery}" — it may not be documented yet`,
        recommendations: match
          ? []
          : [
              'Add this system to docs/BUSINESS_CRITICAL_SYSTEMS.md and the Vesta registry if it is real infrastructure',
            ],
        metadata: { sessionId: context.sessionId, action, registrySize: REGISTRY.length },
      };
    }

    if (action === 'stale-check') {
      const stale = REGISTRY.filter((s) => daysSince(s.lastReviewed, today) > STALE_THRESHOLD_DAYS);
      return {
        agentName: this.config.name,
        result: { action, staleCount: stale.length, stale },
        confidence: 0.95,
        reasoning: `${stale.length} of ${REGISTRY.length} systems have not been reviewed in over ${STALE_THRESHOLD_DAYS} days`,
        recommendations: stale.map((s) => `Review "${s.name}" — last confirmed ${s.lastReviewed}`),
        metadata: {
          sessionId: context.sessionId,
          action,
          staleThresholdDays: STALE_THRESHOLD_DAYS,
        },
      };
    }

    // default: list
    const byCriticality = {
      critical: REGISTRY.filter((s) => s.criticality === 'critical').length,
      high: REGISTRY.filter((s) => s.criticality === 'high').length,
      medium: REGISTRY.filter((s) => s.criticality === 'medium').length,
    };

    return {
      agentName: this.config.name,
      result: { action, systems: REGISTRY, byCriticality },
      confidence: 0.95,
      reasoning: `${REGISTRY.length} systems registered — ${byCriticality.critical} critical, ${byCriticality.high} high, ${byCriticality.medium} medium`,
      recommendations: [],
      metadata: { sessionId: context.sessionId, action, registrySize: REGISTRY.length },
    };
  }
}
