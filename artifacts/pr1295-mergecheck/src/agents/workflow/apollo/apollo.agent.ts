/**
 * Apollo — Content & Outreach Intelligence Agent, Climate IQ
 *
 * Named for the god of light, arts, and truth — Apollo turns Climate IQ's
 * technical intelligence into language that moves industrial buyers to act.
 *
 * Orchestrates content-brief + seo-audit + sales-outreach + lead-feedback
 * for B2B climate compliance content and targeted outreach campaigns.
 *
 * Input: { industry, targetRole?, regulatoryTrigger?, keywords?, prospectData? }
 * Output: content brief, outreach sequence, SEO opportunities, lead insights
 */

import { BaseAgent } from '../../base.agent.js';
import type { AgentContext, AgentResponse } from '../../types.js';

export class ApolloAgent extends BaseAgent {
  constructor() {
    super({
      name: 'apollo',
      description: 'Content & Outreach Intelligence — B2B content strategy, sales outreach sequencing, and SEO for Climate IQ regulatory buyers',
      capabilities: [
        'b2b-content-strategy',
        'sales-outreach-sequencing',
        'seo-content-brief',
        'regulatory-trigger-messaging',
        'lead-feedback-analysis',
      ],
      model: 'claude-haiku-4-5-20251001',
      modelTier: 'heavy',
    });
  }

  async execute(
    context: AgentContext,
    input: Record<string, unknown>,
  ): Promise<AgentResponse> {
    const startTime = Date.now();
    const { agentRegistry } = await import('../../index.js');

    const industry = typeof input.industry === 'string' ? input.industry : 'manufacturing';
    const targetRole = typeof input.targetRole === 'string' ? input.targetRole : 'compliance officer';
    const regulatoryTrigger = typeof input.regulatoryTrigger === 'string' ? input.regulatoryTrigger : 'CBAM';
    const keywords = Array.isArray(input.keywords) ? input.keywords as string[] : undefined;
    const prospectData = (typeof input.prospectData === 'object' && input.prospectData !== null) ? input.prospectData as Record<string, unknown> : undefined;
    const mode = typeof input.mode === 'string' ? input.mode : 'all';

    await this.logExecution({ agent_name: this.config.name, user_id: context.userId, org_id: context.orgId, session_id: context.sessionId, project_id: context.projectId, input: { industry, targetRole, regulatoryTrigger, mode }, output: null, status: 'started', duration_ms: 0, created_at: new Date().toISOString() });

    const tasks: Promise<AgentResponse>[] = [];
    const taskLabels: string[] = [];

    if (mode === 'content' || mode === 'all') {
      tasks.push(agentRegistry.executeAgent('content-brief', context, {
        projectId: context.projectId,
        industry,
        targetRole,
        regulatoryTrigger,
        keywords,
      }));
      taskLabels.push('content-brief');
    }

    if ((mode === 'outreach' || mode === 'all') && prospectData) {
      const prospectName = typeof prospectData.companyName === 'string'
        ? prospectData.companyName
        : typeof prospectData.name === 'string'
          ? prospectData.name
          : 'priority prospect';
      const offering = typeof prospectData.offering === 'string' && prospectData.offering.trim().length >= 5
        ? prospectData.offering.trim()
        : 'dws-iq6';

      tasks.push(agentRegistry.executeAgent('sales-outreach', context, {
        targetDescription: [
          `Industry: ${industry}`,
          `Buyer role: ${targetRole}`,
          `Regulatory trigger: ${regulatoryTrigger}`,
          `Priority prospect: ${prospectName}`,
        ].join(' | '),
        offering,
        senderName: 'DWS Sales Team',
        senderCompany: 'Lifetime Oy',
        emailStyle: 'consultative',
        maxCompanies: 1,
        prospect: prospectData,
      }));
      taskLabels.push('sales-outreach');
    }

    if (mode === 'seo' || mode === 'all') {
      tasks.push(agentRegistry.executeAgent('seo-audit', context, {
        projectId: context.projectId,
        industry,
        keywords: keywords || [regulatoryTrigger, industry, 'compliance'],
      }));
      taskLabels.push('seo-audit');
    }

    if (mode === 'all' && input.leadData) {
      tasks.push(agentRegistry.executeAgent('lead-feedback', context, {
        projectId: context.projectId,
        leadData: input.leadData,
      }));
      taskLabels.push('lead-feedback');
    }

    // Default: content brief only
    if (tasks.length === 0) {
      tasks.push(agentRegistry.executeAgent('content-brief', context, {
        projectId: context.projectId,
        industry,
        targetRole,
        regulatoryTrigger,
      }));
      taskLabels.push('content-brief');
    }

    const results = await Promise.allSettled(tasks);
    const successful = results
      .map((r, i) => ({
        label: taskLabels[i],
        result: r.status === 'fulfilled' ? r.value : null,
      }))
      .filter((r) => r.result !== null);

    const llmResponse = await this.callLLM(
      `You are Apollo, Content & Outreach Intelligence for Climate IQ.

Industry: ${industry} | Target: ${targetRole} | Regulatory trigger: ${regulatoryTrigger}

Content intelligence gathered:
${successful.map((r) => `[${r.label}]: ${JSON.stringify(r.result?.result)}`).join('\n\n')}

Rules:
- Every message must connect to a specific regulatory trigger
- Name the regulation, the deadline, the penalty — never generic climate language
- Outreach is multi-touch: provide a 3-step sequence
- SEO content answers what buyers actually search

Return JSON: {
  "contentAngle": "The core message angle in 1 sentence",
  "outreachSequence": ["step1: subject + hook", "step2: follow-up angle", "step3: value close"],
  "seoOpportunity": "Top keyword opportunity with intent",
  "contentBrief": "3-bullet content brief",
  "apolloBriefing": "2-sentence content strategy summary"
}`,
    );

    let synthesis = {
      contentAngle: '',
      outreachSequence: [] as string[],
      seoOpportunity: '',
      contentBrief: '',
      apolloBriefing: '',
    };
    try {
      synthesis = { ...synthesis, ...JSON.parse(llmResponse.content) };
    } catch {
      synthesis.apolloBriefing = llmResponse.content.slice(0, 300);
    }

    const durationMs = Date.now() - startTime;

    return {
      agentName: this.config.name,
      result: {
        industry,
        targetRole,
        regulatoryTrigger,
        contentAngle: synthesis.contentAngle,
        outreachSequence: synthesis.outreachSequence,
        seoOpportunity: synthesis.seoOpportunity,
        contentBrief: synthesis.contentBrief,
        apolloBriefing: synthesis.apolloBriefing,
        rawIntelligence: Object.fromEntries(
          successful.map((r) => [r.label, r.result?.result]),
        ),
      },
      confidence: successful.length / Math.max(tasks.length, 1),
      reasoning: `Apollo built content strategy for ${industry} targeting ${targetRole} around ${regulatoryTrigger} trigger. ${successful.length} intelligence sources consulted.`,
      recommendations: [
        synthesis.contentAngle,
        ...(synthesis.outreachSequence as string[]).map((s, i) => `Outreach step ${i + 1}: ${s}`),
        synthesis.seoOpportunity ? `SEO: ${synthesis.seoOpportunity}` : '',
      ].filter(Boolean).slice(0, 5),
      metadata: {
        durationMs,
        llmModel: llmResponse.model,
        llmTokens: llmResponse.inputTokens + llmResponse.outputTokens,
        delegatedTo: successful.map((r) => r.label),
        mode,
      },
    };
  }
}
