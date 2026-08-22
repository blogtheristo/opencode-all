/**
 * Outreach Improver Agent — Outer Loop of the DWS Outreach Self-Improvement System
 *
 * Implements Zach Lloyd's self-improvement loop pattern applied to DWS outreach:
 *   Inner loop: outreach-orchestrator runs, outcomes tracked in Supabase
 *   Outer loop: this agent analyzes outcomes, proposes SKILL.md diffs
 *
 * Reads from Supabase:
 *   outreach_threads — status flow (contacted → responded → meeting_booked)
 *   outreach_activities — human corrections, notes, outcome overrides
 *
 * Analyzes:
 *   - Response rate by email_style / regulatory hook / role_id / industry
 *   - Which regulatory hooks had highest engagement
 *   - Which industries are converting vs silent
 *   - Human feedback from activity notes
 *
 * Outputs:
 *   Writes .claude/clawdbot/proposals/skill-outreach-agents-YYYY-MM-DD.md
 *   Human reviews + applies via /promote-proposal
 *
 * DGX Spark routing: uses callLLM() which auto-routes to OLLAMA_BASE_URL when set.
 *
 * Input:  { lookbackDays?, minThreads?, dryRun? }
 * Output: AgentResponse with proposed SKILL.md diffs + written proposal path
 *
 * Tier: 1 (read-only analysis + file write — no outbound communication)
 */

import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import logger from '../utils/logger.js';
import { BaseAgent } from './base.agent.js';
import type { AgentContext, AgentResponse } from './types.js';

// ============ TYPES ============

interface ImproverInput {
  lookbackDays: number;
  minThreads: number;
  dryRun: boolean;
}

interface ThreadOutcome {
  id: string;
  email_style: string;
  regulatory_trigger: string;
  target_role_id: string;
  industry: string;
  status: string;
  crafted_at: string;
  responded: boolean;
  meeting_booked: boolean;
  human_feedback?: string;
}

interface PerformanceData {
  totalThreads: number;
  responseRate: number;
  meetingRate: number;
  byStyle: Record<string, { sent: number; responded: number }>;
  byRegulation: Record<string, { sent: number; responded: number }>;
  byRole: Record<string, { sent: number; responded: number }>;
  byIndustry: Record<string, { sent: number; responded: number }>;
  humanFeedbackNotes: string[];
}

interface SkillImprovement {
  section: string;
  currentBehavior: string;
  proposedChange: string;
  rationale: string;
}

// ============ AGENT ============

export class OutreachImproverAgent extends BaseAgent {
  constructor() {
    super({
      name: 'outreach-improver',
      description:
        'Outer loop of the DWS outreach self-improvement system. Analyzes outreach_threads outcomes from Supabase and proposes specific SKILL.md diffs to improve response rates over time.',
      capabilities: [
        'self-improvement',
        'outcome-analysis',
        'skill-optimization',
        'outreach',
        'learning-loop',
      ],
      model: 'llama3.3:70b',
      modelTier: 'standard',
    });
  }

  async execute(context: AgentContext, input: Record<string, unknown>): Promise<AgentResponse> {
    const startTime = Date.now();

    await this.logExecution({
      agent_name: this.config.name,
      user_id: context.userId,
      org_id: context.orgId,
      session_id: context.sessionId,
      project_id: context.projectId,
      input,
      output: null,
      status: 'started',
      duration_ms: 0,
      created_at: new Date().toISOString(),
    });

    try {
      const validated = this.validateInput(input);

      // Step 1: Pull outcomes from Supabase
      const outcomes = await this.fetchOutcomes(validated);

      if (outcomes.length < validated.minThreads) {
        const response: AgentResponse = {
          agentName: this.config.name,
          result: {
            skipped: true,
            reason: `Only ${outcomes.length} threads found (min ${validated.minThreads}). Run more outreach first.`,
            threadCount: outcomes.length,
          },
          confidence: 0.3,
          reasoning: `Insufficient data for meaningful pattern analysis. Need at least ${validated.minThreads} threads, found ${outcomes.length}.`,
          recommendations: [
            `Run /outreach-agents ACTION=full with more leads to build the dataset`,
            `Reduce minThreads if you want earlier analysis`,
          ],
          metadata: {
            durationMs: Date.now() - startTime,
            model: this.config.model,
            dryRun: validated.dryRun,
          },
        };
        await this.logExecution({
          ...this.buildLog(context, input, response, 'completed', Date.now() - startTime),
        });
        return response;
      }

      // Step 2: Compute performance metrics
      const perf = this.analyzePerformance(outcomes);

      // Step 3: Use DGX Spark to identify patterns + propose improvements
      const improvements = await this.proposeImprovements(perf, validated.lookbackDays);

      // Step 4: Write proposal file
      const proposalPath = await this.writeProposal(perf, improvements, validated, context);

      const response: AgentResponse = {
        agentName: this.config.name,
        result: {
          threadsAnalyzed: outcomes.length,
          lookbackDays: validated.lookbackDays,
          responseRate: `${(perf.responseRate * 100).toFixed(1)}%`,
          meetingRate: `${(perf.meetingRate * 100).toFixed(1)}%`,
          improvementsProposed: improvements.length,
          proposalPath: validated.dryRun ? null : proposalPath,
          dryRun: validated.dryRun,
          topPerformingStyle: this.topKey(perf.byStyle),
          topPerformingRegulation: this.topKey(perf.byRegulation),
          improvements: improvements.map((i) => ({
            section: i.section,
            change: i.proposedChange.slice(0, 80) + '...',
          })),
        },
        confidence: Math.min(0.9, 0.5 + improvements.length * 0.1),
        reasoning: `Analyzed ${outcomes.length} threads from past ${validated.lookbackDays} days. Response rate: ${(perf.responseRate * 100).toFixed(1)}%. Proposed ${improvements.length} improvements to skills/outreach-agents/SKILL.md. ${validated.dryRun ? 'DRY RUN — no file written.' : `Proposal written to ${proposalPath}. Apply with /promote-proposal.`}`,
        recommendations: [
          validated.dryRun
            ? 'Set dryRun=false to write the proposal file'
            : `Run /promote-proposal to apply the improvements HIL-gated`,
          `Top performing: style=${this.topKey(perf.byStyle)}, regulation=${this.topKey(perf.byRegulation)}`,
          `Reschedule to run weekly via cron (scripts/daily/outreach-skill-improve.ts)`,
        ],
        metadata: { durationMs: Date.now() - startTime, model: this.config.model, proposalPath },
      };

      await this.logExecution({
        ...this.buildLog(context, input, response, 'completed', Date.now() - startTime),
      });
      return response;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      const durationMs = Date.now() - startTime;
      logger.error('Outreach improver failed', { error: errorMessage });

      await this.logExecution({
        ...this.buildLog(context, input, null, 'error', durationMs, errorMessage),
      });

      return {
        agentName: this.config.name,
        result: { error: errorMessage },
        confidence: 0,
        reasoning: `Improvement analysis failed: ${errorMessage}`,
        recommendations: [
          'Check Supabase connection',
          'Verify outreach_threads table exists with status column',
        ],
        metadata: { durationMs, model: this.config.model },
      };
    }
  }

  // ============ PRIVATE METHODS ============

  private validateInput(input: Record<string, unknown>): ImproverInput {
    const lookbackDays =
      typeof input.lookbackDays === 'number' ? Math.max(1, Math.min(90, input.lookbackDays)) : 7;
    const minThreads = typeof input.minThreads === 'number' ? Math.max(1, input.minThreads) : 3;
    const dryRun = input.dryRun === true;
    return { lookbackDays, minThreads, dryRun };
  }

  private async fetchOutcomes(input: ImproverInput): Promise<ThreadOutcome[]> {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
    if (!supabaseUrl || !supabaseKey) {
      logger.debug('Supabase not configured — returning empty outcomes');
      return [];
    }

    const since = new Date(Date.now() - input.lookbackDays * 86_400_000).toISOString();

    try {
      // Fetch threads
      const threadsRes = await fetch(
        `${supabaseUrl}/rest/v1/outreach_threads?crafted_at=gte.${encodeURIComponent(since)}&pipeline=eq.customer&select=id,email_style,target_role_id,org_domain,status,crafted_at`,
        { headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` } },
      );
      if (!threadsRes.ok) return [];
      const threads = (await threadsRes.json()) as Array<Record<string, unknown>>;

      // Fetch orgs for industry data
      const orgsRes = await fetch(
        `${supabaseUrl}/rest/v1/outreach_orgs?select=domain,industry,regulatory_triggers`,
        { headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` } },
      );
      const orgsByDomain = new Map<string, { industry: string; regulatory_triggers: string[] }>();
      if (orgsRes.ok) {
        const orgs = (await orgsRes.json()) as Array<{
          domain: string;
          industry: string;
          regulatory_triggers: string[];
        }>;
        for (const o of orgs)
          orgsByDomain.set(o.domain, {
            industry: o.industry || 'unknown',
            regulatory_triggers: o.regulatory_triggers || [],
          });
      }

      // Fetch human feedback from activities
      const activitiesRes = await fetch(
        `${supabaseUrl}/rest/v1/outreach_activities?created_at=gte.${encodeURIComponent(since)}&direction=eq.inbound&select=thread_id,outcome,body`,
        { headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` } },
      );
      const feedbackByThread = new Map<string, string>();
      if (activitiesRes.ok) {
        const activities = (await activitiesRes.json()) as Array<{
          thread_id: string;
          outcome: string;
          body: string;
        }>;
        for (const a of activities) {
          if (a.body && a.body.length > 10) feedbackByThread.set(a.thread_id, a.body.slice(0, 200));
        }
      }

      return threads.map((t) => {
        const org = orgsByDomain.get(t.org_domain as string);
        return {
          id: t.id as string,
          email_style: (t.email_style as string) || 'consultative',
          regulatory_trigger: org?.regulatory_triggers?.[0] || 'CSRD',
          target_role_id: (t.target_role_id as string) || 'R07',
          industry: org?.industry || 'unknown',
          status: (t.status as string) || 'contacted',
          crafted_at: t.crafted_at as string,
          responded: ['responded', 'meeting_booked', 'converted'].includes(t.status as string),
          meeting_booked: ['meeting_booked', 'converted'].includes(t.status as string),
          human_feedback: feedbackByThread.get(t.id as string),
        };
      });
    } catch (err) {
      logger.warn('Failed to fetch outreach outcomes', { error: String(err) });
      return [];
    }
  }

  private analyzePerformance(outcomes: ThreadOutcome[]): PerformanceData {
    const byStyle: Record<string, { sent: number; responded: number }> = {};
    const byRegulation: Record<string, { sent: number; responded: number }> = {};
    const byRole: Record<string, { sent: number; responded: number }> = {};
    const byIndustry: Record<string, { sent: number; responded: number }> = {};
    const humanFeedbackNotes: string[] = [];

    for (const t of outcomes) {
      const incr = (map: Record<string, { sent: number; responded: number }>, key: string) => {
        if (!map[key]) map[key] = { sent: 0, responded: 0 };
        map[key].sent++;
        if (t.responded) map[key].responded++;
      };
      incr(byStyle, t.email_style);
      incr(byRegulation, t.regulatory_trigger);
      incr(byRole, t.target_role_id);
      incr(byIndustry, t.industry);
      if (t.human_feedback) humanFeedbackNotes.push(t.human_feedback);
    }

    const responded = outcomes.filter((t) => t.responded).length;
    const meetingBooked = outcomes.filter((t) => t.meeting_booked).length;

    return {
      totalThreads: outcomes.length,
      responseRate: outcomes.length > 0 ? responded / outcomes.length : 0,
      meetingRate: outcomes.length > 0 ? meetingBooked / outcomes.length : 0,
      byStyle,
      byRegulation,
      byRole,
      byIndustry,
      humanFeedbackNotes,
    };
  }

  private async proposeImprovements(
    perf: PerformanceData,
    lookbackDays: number,
  ): Promise<SkillImprovement[]> {
    const prompt = [
      `You are analyzing B2B outreach performance data to improve an outreach skill file.`,
      `Lookback period: ${lookbackDays} days`,
      `Total threads: ${perf.totalThreads}`,
      `Response rate: ${(perf.responseRate * 100).toFixed(1)}%`,
      `Meeting booking rate: ${(perf.meetingRate * 100).toFixed(1)}%`,
      ``,
      `Performance by email style: ${JSON.stringify(this.rateMap(perf.byStyle))}`,
      `Performance by regulatory trigger: ${JSON.stringify(this.rateMap(perf.byRegulation))}`,
      `Performance by role: ${JSON.stringify(this.rateMap(perf.byRole))}`,
      `Performance by industry: ${JSON.stringify(this.rateMap(perf.byIndustry))}`,
      ``,
      `Human feedback notes from recipients: ${JSON.stringify(perf.humanFeedbackNotes.slice(0, 5))}`,
      ``,
      `Based on this data, propose 2–4 specific improvements to the outreach skill configuration.`,
      `Each improvement should target a specific section: Regulatory Hooks / Brand Voice Rules / Default Style / ICP Targeting / Banned Phrases.`,
      ``,
      `Return JSON: {"improvements": [{"section": string, "currentBehavior": string, "proposedChange": string, "rationale": string}]}`,
      `Be specific — propose exact text changes, not vague suggestions.`,
    ].join('\n');

    const result = await this.callLLM(prompt);
    try {
      const parsed = JSON.parse(result.content) as { improvements?: SkillImprovement[] };
      if (Array.isArray(parsed.improvements) && parsed.improvements.length > 0) {
        return parsed.improvements.slice(0, 5);
      }
    } catch {
      // use deterministic fallback
    }

    // Deterministic fallback: improvements based on worst-performing segments
    const improvements: SkillImprovement[] = [];
    const worstStyle = this.bottomKey(perf.byStyle);
    const bestStyle = this.topKey(perf.byStyle);
    const bestRegulation = this.topKey(perf.byRegulation);

    if (worstStyle && bestStyle && worstStyle !== bestStyle) {
      improvements.push({
        section: 'Default Style',
        currentBehavior: `STYLE defaults to consultative`,
        proposedChange: `STYLE defaults to ${bestStyle} (${(this.rateMap(perf.byStyle)[bestStyle] * 100).toFixed(0)}% response rate vs ${(this.rateMap(perf.byStyle)[worstStyle] * 100).toFixed(0)}% for ${worstStyle})`,
        rationale: `${bestStyle} outperformed ${worstStyle} by ${((this.rateMap(perf.byStyle)[bestStyle] - this.rateMap(perf.byStyle)[worstStyle]) * 100).toFixed(0)} percentage points over ${perf.totalThreads} threads.`,
      });
    }

    if (bestRegulation) {
      improvements.push({
        section: 'Regulatory Hooks',
        currentBehavior: `All regulations treated equally in ICP scoring`,
        proposedChange: `Prioritize ${bestRegulation} as primary hook in find step (${(this.rateMap(perf.byRegulation)[bestRegulation] * 100).toFixed(0)}% response rate)`,
        rationale: `${bestRegulation} generated highest engagement over the analysis window.`,
      });
    }

    if (perf.humanFeedbackNotes.length > 0) {
      improvements.push({
        section: 'Brand Voice Rules',
        currentBehavior: `Banned phrase list: synergy, leverage, disruptive, game-changer`,
        proposedChange: `Add to banned list based on human feedback: review notes — ${perf.humanFeedbackNotes[0].slice(0, 100)}`,
        rationale: `Human recipients provided feedback suggesting message tone needs adjustment.`,
      });
    }

    return improvements;
  }

  private async writeProposal(
    perf: PerformanceData,
    improvements: SkillImprovement[],
    input: ImproverInput,
    context: AgentContext,
  ): Promise<string> {
    const date = new Date().toISOString().split('T')[0];
    const proposalDir = join(process.cwd(), '.claude', 'clawdbot', 'proposals');
    const proposalPath = join(proposalDir, `skill-outreach-agents-${date}.md`);

    if (input.dryRun) {
      logger.info('Dry run — proposal not written', { proposalPath });
      return proposalPath;
    }

    const content = this.buildProposalMarkdown(
      perf,
      improvements,
      input.lookbackDays,
      date,
      context,
    );

    await mkdir(proposalDir, { recursive: true });
    await writeFile(proposalPath, content, 'utf-8');
    logger.info('Outreach improvement proposal written', { proposalPath });
    return proposalPath;
  }

  private buildProposalMarkdown(
    perf: PerformanceData,
    improvements: SkillImprovement[],
    lookbackDays: number,
    date: string,
    context: AgentContext,
  ): string {
    const rateTable = (map: Record<string, { sent: number; responded: number }>) =>
      Object.entries(map)
        .sort((a, b) => b[1].responded / (b[1].sent || 1) - a[1].responded / (a[1].sent || 1))
        .map(
          ([k, v]) =>
            `| ${k} | ${v.sent} | ${v.responded} | ${v.sent > 0 ? ((v.responded / v.sent) * 100).toFixed(0) : 0}% |`,
        )
        .join('\n');

    const checkboxes = improvements
      .map((imp, i) =>
        [
          `### Change ${i + 1}: ${imp.section}`,
          ``,
          `**Current behavior:** ${imp.currentBehavior}`,
          ``,
          `**Proposed change:**`,
          `\`\`\``,
          imp.proposedChange,
          `\`\`\``,
          ``,
          `**Rationale:** ${imp.rationale}`,
          ``,
          `- [ ] Apply this change to \`skills/outreach-agents/SKILL.md\``,
        ].join('\n'),
      )
      .join('\n\n');

    return [
      `# Skill improvement proposal — outreach-agents — ${date}`,
      ``,
      `> Generated by \`outreach-improver\` agent`,
      `> Lookback: ${lookbackDays} days`,
      `> Threads analyzed: ${perf.totalThreads}`,
      `> Session org: ${context.orgId}`,
      ``,
      `## Performance Summary`,
      ``,
      `| Metric | Value |`,
      `|--------|-------|`,
      `| Total threads contacted | ${perf.totalThreads} |`,
      `| Response rate | ${(perf.responseRate * 100).toFixed(1)}% |`,
      `| Meeting booking rate | ${(perf.meetingRate * 100).toFixed(1)}% |`,
      `| Human feedback notes | ${perf.humanFeedbackNotes.length} |`,
      ``,
      `### By Email Style`,
      `| Style | Sent | Responded | Rate |`,
      `|-------|------|-----------|------|`,
      rateTable(perf.byStyle),
      ``,
      `### By Regulatory Trigger`,
      `| Trigger | Sent | Responded | Rate |`,
      `|---------|------|-----------|------|`,
      rateTable(perf.byRegulation),
      ``,
      `### By Role`,
      `| Role | Sent | Responded | Rate |`,
      `|------|------|-----------|------|`,
      rateTable(perf.byRole),
      ``,
      `### By Industry`,
      `| Industry | Sent | Responded | Rate |`,
      `|----------|------|-----------|------|`,
      rateTable(perf.byIndustry),
      perf.humanFeedbackNotes.length > 0
        ? [
            ``,
            `### Human Feedback Notes`,
            ``,
            perf.humanFeedbackNotes.map((n) => `- "${n}"`).join('\n'),
          ].join('\n')
        : '',
      ``,
      `## Proposed Changes to \`skills/outreach-agents/SKILL.md\``,
      ``,
      `Apply using \`/promote-proposal\` (HIL-gated — review each change before applying).`,
      ``,
      checkboxes,
      ``,
      `---`,
      ``,
      `> To apply: \`/promote-proposal .claude/clawdbot/proposals/skill-outreach-agents-${date}.md\``,
      `> To skip: prepend STATUS: NO-OP to this file`,
    ].join('\n');
  }

  private rateMap(
    map: Record<string, { sent: number; responded: number }>,
  ): Record<string, number> {
    return Object.fromEntries(
      Object.entries(map).map(([k, v]) => [k, v.sent > 0 ? v.responded / v.sent : 0]),
    );
  }

  private topKey(map: Record<string, { sent: number; responded: number }>): string {
    const entries = Object.entries(map).filter(([, v]) => v.sent > 0);
    if (entries.length === 0) return 'consultative';
    return entries.sort((a, b) => b[1].responded / b[1].sent - a[1].responded / a[1].sent)[0][0];
  }

  private bottomKey(map: Record<string, { sent: number; responded: number }>): string | null {
    const entries = Object.entries(map).filter(([, v]) => v.sent > 0);
    if (entries.length < 2) return null;
    return entries.sort((a, b) => a[1].responded / a[1].sent - b[1].responded / b[1].sent)[0][0];
  }

  private buildLog(
    context: AgentContext,
    input: Record<string, unknown>,
    output: AgentResponse | null,
    status: 'completed' | 'error',
    durationMs: number,
    error_message?: string,
  ) {
    return {
      agent_name: this.config.name,
      user_id: context.userId,
      org_id: context.orgId,
      session_id: context.sessionId,
      project_id: context.projectId,
      input,
      output,
      status,
      ...(error_message ? { error_message } : {}),
      duration_ms: durationMs,
      created_at: new Date().toISOString(),
    };
  }
}
