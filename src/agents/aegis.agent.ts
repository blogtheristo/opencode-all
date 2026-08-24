/**
 * Aegis — Vulnerability & Patch Governance Agent
 *
 * Code-Version: 1.0
 * Branch: claude/sanasto-cybersecurity-terms-az3tby
 * Date: 2026-07-03
 * Owner: Lifetime Oy (risto.paarni@lifetime.fi)
 *
 * Named after Zeus's shield, the Aegis. Triages dependency-vulnerability
 * findings (Dependabot alerts, `npm audit` output) against a fixed
 * remediation SLA and reports what is breaching, at risk, or on track.
 *
 * Created 2026-07-03 after a repo audit found `.github/dependabot.yml` had
 * been 0 bytes since creation and `scripts/daily/dependabot-audit.sh` had no
 * documented schedule or GHA failover — the "Vulnerability & Patch Owner"
 * role this agent implements did not exist as anything but an unowned gap.
 * `.github/dependabot.yml` is now populated (all npm/pip directories + GHA,
 * weekly cadence) — see DWS_SECURITY_STANDARD.md §13.6 for the policy this
 * agent enforces. See also docs/BUSINESS_CRITICAL_SYSTEMS.md and
 * docs/SECURITY_ROLES_AND_GUIDANCE.md.
 *
 * Aegis does not fetch alerts itself (no GitHub/npm credentials of its own) —
 * it is a triage/classification agent that takes structured findings as
 * input, matching how scripts/daily/dependabot-audit.sh and
 * scripts/weekly/security-audit.sh already produce that data.
 *
 * Input: {
 *   action: 'triage' | 'sla-status',
 *   findings?: Array<{ id?, severity: 'critical'|'high'|'moderate'|'low', package?, source?, discoveredAt? }>
 * }
 * Output: SLA classification per finding, breach/at-risk counts, recommendations
 */

import { BaseAgent } from './base.agent.js';
import type { AgentContext, AgentResponse } from './types.js';

type Severity = 'critical' | 'high' | 'moderate' | 'low';

interface VulnFinding {
  id?: string;
  severity: Severity;
  package?: string;
  source?: string;
  /** ISO date the finding was first observed. Defaults to "today" if omitted. */
  discoveredAt?: string;
}

/** Remediation SLA in days, by severity. Matches NIS2-style tiering used elsewhere in the repo. */
const SLA_DAYS: Record<Severity, number> = {
  critical: 2,
  high: 7,
  moderate: 30,
  low: 90,
};

function daysSince(isoDate: string, today: Date): number {
  const then = new Date(isoDate);
  const diffMs = today.getTime() - then.getTime();
  return Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
}

export class AegisAgent extends BaseAgent {
  constructor() {
    super({
      name: 'aegis',
      description:
        'Vulnerability & patch governance — triages dependency and code-scan findings ' +
        '(Dependabot alerts, npm audit, scan_critical_bugs.py output) against a fixed ' +
        'remediation SLA (critical 2d / high 7d / moderate 30d / low 90d) and flags breaches.',
      capabilities: [
        'vulnerability-triage',
        'patch-sla-tracking',
        'breach-detection',
        'remediation-prioritization',
      ],
      model: 'llama-3.3-70b-versatile',
      modelTier: 'lite',
    });
    this.soulPrompt = `You are Aegis, the vulnerability and patch governance agent for DWS IQ.
You classify security findings by severity and remediation SLA, and you are blunt about breaches.

SLA by severity: critical=2 days, high=7 days, moderate=30 days, low=90 days.

Do not soften a breach. If something is over SLA, say so plainly and name it first.
Output structured JSON with: action, breachCount, atRiskCount, onTrackCount, findings, confidence.`;
  }

  async execute(context: AgentContext, input: Record<string, unknown>): Promise<AgentResponse> {
    const action = (input.action as string) || 'triage';
    const findings = (input.findings as VulnFinding[]) || [];
    const today = new Date();

    const classified = findings.map((f) => {
      const discoveredAt = f.discoveredAt || today.toISOString().split('T')[0];
      const age = daysSince(discoveredAt, today);
      const sla = SLA_DAYS[f.severity];
      const status: 'breach' | 'at-risk' | 'on-track' =
        age > sla ? 'breach' : age >= sla * 0.7 ? 'at-risk' : 'on-track';

      return {
        ...f,
        discoveredAt,
        ageDays: age,
        slaDays: sla,
        status,
      };
    });

    const breachCount = classified.filter((f) => f.status === 'breach').length;
    const atRiskCount = classified.filter((f) => f.status === 'at-risk').length;
    const onTrackCount = classified.filter((f) => f.status === 'on-track').length;

    const breaches = classified.filter((f) => f.status === 'breach');
    const recommendations = breaches
      .slice(0, 5)
      .map(
        (f) =>
          `[${f.severity.toUpperCase()}] ${f.package || f.id || 'unnamed finding'} — ${f.ageDays}d old, SLA was ${f.slaDays}d`,
      );

    if (breaches.length === 0 && findings.length > 0) {
      recommendations.push('No SLA breaches — all findings on track or at-risk only');
    }

    return {
      agentName: this.config.name,
      result: {
        action,
        totalFindings: findings.length,
        breachCount,
        atRiskCount,
        onTrackCount,
        findings: classified,
      },
      confidence: findings.length > 0 ? 0.95 : 0.5,
      reasoning:
        findings.length === 0
          ? 'No findings supplied — nothing to triage'
          : `${breachCount} SLA breach(es), ${atRiskCount} at risk, ${onTrackCount} on track across ${findings.length} finding(s)`,
      recommendations,
      metadata: {
        sessionId: context.sessionId,
        action,
        slaPolicy: SLA_DAYS,
      },
    };
  }
}
