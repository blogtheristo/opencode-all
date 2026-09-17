/**
 * Outreach Message Crafter Agent — Step 2 of 4 in DWS Outreach Pipeline
 *
 * Generates personalized email + LinkedIn message drafts for a given lead.
 * Applies DWS brand voice (§22 pitch lines from DWS_BRAND_STANDARD.md).
 * Stores drafts to Supabase outreach_threads (status: researched).
 *
 * DGX Spark routing: auto-routes to DGX Spark Ollama when OLLAMA_BASE_URL is set.
 *
 * Input:  { personId?, orgDomain, offering, emailStyle, linkedinDraft, roleId }
 * Output: email draft + LinkedIn draft + thread ID
 *
 * Tier: 2 (produces outbound communication drafts — human reviews before sending)
 */

import logger from '../utils/logger.js';
import { BaseAgent } from './base.agent.js';
import type { AgentContext, AgentResponse } from './types.js';

// ============ BRAND VOICE (DWS_BRAND_STANDARD.md §22 + §23) ============

/** Canonical pitch lines from §22. Used as value prop anchors in outreach. */
const PITCH_LINES: Record<string, string> = {
  'dws-iq6':
    'The Intelligence Amplifier for EU climate compliance — AI agents that turn ETS, CBAM, and CSRD data into decisions, not dashboards.',
  'firehorse-reports':
    'Automated sustainability reporting with EN 15978 lifecycle assessment — from site sensors to audit-ready PDF in minutes.',
  sitesense:
    'Edge AI for construction site monitoring — safety scoring, crane risk analysis, and real-time worker capacity. Compliant with EN 13001.',
  'material-oracle':
    'AI-powered embodied carbon analysis with low-carbon material alternatives — per EN 15978 A1–D lifecycle stages.',
  'sovereign-cbam':
    'EU-sovereign CBAM disclosure automation — hosted in Finland, CLOUD Act-free, connected to your ERP.',
};

/** §23: Approved opening hooks by regulatory trigger */
const REGULATORY_HOOKS: Record<string, string> = {
  ETS: 'With ETS Phase 4 tightening allowance allocations, the cost of inaccurate monitoring is rising.',
  CBAM: 'CBAM embedded emissions declarations are now mandatory — and manual processes are creating audit risk.',
  CSRD: 'CSRD double-materiality assessments are due — most teams are still running on spreadsheets.',
  'EU-Taxonomy':
    'EU Taxonomy alignment now affects financing costs — and taxonomy KPIs need real data, not estimates.',
  'Fit-for-55':
    "The Fit for 55 package is reshaping your sector's cost structure faster than most compliance teams anticipated.",
};

/** §23: Approved CTAs */
const APPROVED_CTAS = [
  'Would you be open to a 15-minute call to explore whether this fits your situation?',
  'Happy to share how we handle this for teams in your sector — does a quick call work?',
];

/** §23: Banned phrases — never appear in outreach */
const BANNED_PHRASES = [
  'synergy',
  'leverage',
  'disruptive',
  'game-changer',
  'I hope this email finds you well',
  'quick question',
  'following up',
];

/** R-ID → role name (DWS_ROLES_REGISTRY.md) */
const ROLE_NAMES: Record<string, string> = {
  R07: 'Chief Sustainability Officer',
  R13: 'Chief Information Officer',
  R22: 'Chief Executive Officer',
  R23: 'Chief Financial Officer',
  R02: 'Legal / IP Director',
  R08: 'EHS Director',
  R14: 'Head of Digital',
  R01: 'Sustainability Manager',
};

/** Buying stage by role — influences email framing */
const ROLE_BUYING_STAGE: Record<string, string> = {
  R07: 'strategic', // CSO: sustainability strategy + compliance mandate
  R13: 'technical', // CIO: data infrastructure + integration
  R22: 'executive', // CEO: business risk + investor narrative
  R23: 'commercial', // CFO: cost exposure + audit risk
  R08: 'operational', // EHS: day-to-day compliance operations
};

// ============ INPUT / OUTPUT TYPES ============

interface MessageCrafterInput {
  orgDomain: string;
  orgName: string;
  offering: string;
  emailStyle: 'consultative' | 'professional' | 'cold';
  linkedinDraft: boolean;
  roleId: string;
  regulatoryTrigger: string;
  fitReason?: string;
}

interface MessageDraft {
  orgDomain: string;
  roleId: string;
  targetRole: string;
  emailSubject: string;
  emailBody: string;
  linkedinMessage: string | null;
  emailStyle: string;
  wordCount: number;
}

// ============ AGENT IMPLEMENTATION ============

export class OutreachMessageCrafterAgent extends BaseAgent {
  constructor() {
    super({
      name: 'outreach-message-crafter',
      description:
        'Crafts personalized email + LinkedIn message drafts for B2B leads using DWS brand voice and DGX Spark Ollama. Stores drafts to Supabase outreach_threads.',
      capabilities: [
        'email-drafting',
        'linkedin-drafting',
        'personalization',
        'brand-voice',
        'b2b-outreach',
        'message-crafting',
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

      // Stage 1: Draft personalized email
      const draft = await this.craftMessages(validated);

      // Stage 2: Validate brand compliance (remove banned phrases)
      const cleanDraft = this.enforceBrandCompliance(draft);

      // Stage 3: Store thread to Supabase
      const threadId = await this.storeThread(cleanDraft, context);

      const response: AgentResponse = {
        agentName: this.config.name,
        result: {
          threadId,
          draft: cleanDraft,
          storedToSupabase: !!threadId,
        },
        confidence: 0.8,
        reasoning: `Crafted ${validated.emailStyle} outreach for ${validated.orgName} targeting ${ROLE_NAMES[validated.roleId] || validated.roleId}. Used regulatory hook: ${validated.regulatoryTrigger}. ${cleanDraft.linkedinMessage ? 'LinkedIn draft included.' : 'LinkedIn draft skipped.'}`,
        recommendations: [
          'Review email before sending — this is a DRAFT (Tier 2)',
          `Verify contact email for ${ROLE_NAMES[validated.roleId] || 'target role'} at ${validated.orgName}`,
          `Send via outreach-executor with channel=email and threadId=${threadId || '[pending]'}`,
        ],
        metadata: {
          durationMs: Date.now() - startTime,
          model: this.config.model,
          orgDomain: validated.orgDomain,
          roleId: validated.roleId,
          wordCount: cleanDraft.wordCount,
        },
      };

      await this.logExecution({
        agent_name: this.config.name,
        user_id: context.userId,
        org_id: context.orgId,
        session_id: context.sessionId,
        project_id: context.projectId,
        input,
        output: response,
        status: 'completed',
        duration_ms: Date.now() - startTime,
        created_at: new Date().toISOString(),
      });

      return response;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      const durationMs = Date.now() - startTime;
      logger.error('Message crafter failed', { agent: this.config.name, error: errorMessage });

      await this.logExecution({
        agent_name: this.config.name,
        user_id: context.userId,
        org_id: context.orgId,
        session_id: context.sessionId,
        project_id: context.projectId,
        input,
        output: null,
        status: 'error',
        error_message: errorMessage,
        duration_ms: durationMs,
        created_at: new Date().toISOString(),
      });

      return {
        agentName: this.config.name,
        result: { error: errorMessage },
        confidence: 0,
        reasoning: `Message crafting failed: ${errorMessage}`,
        recommendations: [
          'Ensure orgDomain and offering are provided',
          'Check OLLAMA_BASE_URL is reachable',
        ],
        metadata: { durationMs, model: this.config.model },
      };
    }
  }

  // ============ PRIVATE METHODS ============

  private validateInput(input: Record<string, unknown>): MessageCrafterInput {
    const orgDomain = typeof input.orgDomain === 'string' ? input.orgDomain.trim() : '';
    if (!orgDomain) throw new Error('orgDomain is required');

    const orgName =
      typeof input.orgName === 'string' ? input.orgName.trim() : orgDomain.split('.')[0];
    const offering = typeof input.offering === 'string' ? input.offering.trim() : 'dws-iq6';
    const styles = ['consultative', 'professional', 'cold'] as const;
    const emailStyle = styles.includes(input.emailStyle as (typeof styles)[number])
      ? (input.emailStyle as MessageCrafterInput['emailStyle'])
      : 'consultative';
    const linkedinDraft = input.linkedinDraft !== false;
    const roleId = typeof input.roleId === 'string' ? input.roleId.trim() : 'R07';
    const regulatoryTrigger =
      typeof input.regulatoryTrigger === 'string' ? input.regulatoryTrigger.trim() : 'CSRD';
    const fitReason = typeof input.fitReason === 'string' ? input.fitReason.trim() : undefined;

    return {
      orgDomain,
      orgName,
      offering,
      emailStyle,
      linkedinDraft,
      roleId,
      regulatoryTrigger,
      fitReason,
    };
  }

  private async craftMessages(input: MessageCrafterInput): Promise<MessageDraft> {
    const valueProp = PITCH_LINES[input.offering] || input.offering;
    const hook =
      REGULATORY_HOOKS[input.regulatoryTrigger] ||
      `${input.regulatoryTrigger} compliance pressure is increasing.`;
    const cta = APPROVED_CTAS[0];
    const buyingStage = ROLE_BUYING_STAGE[input.roleId] || 'strategic';
    const targetRole = ROLE_NAMES[input.roleId] || input.roleId;
    const fitContext = input.fitReason ? `Research insight: ${input.fitReason}.` : '';

    const styleNote = {
      consultative:
        'Insight-led, consultative. Frame observed problem and solution hypothesis. Soft CTA. Professional but human.',
      professional: 'Clear, respectful, businesslike. Short paragraphs. No jargon.',
      cold: 'Strong hook in opening line. Tight value proposition. Minimal padding. Direct CTA.',
    }[input.emailStyle];

    const prompt = [
      `Write a personalized B2B outreach email for a ${targetRole} at ${input.orgName} (${input.orgDomain}).`,
      `Style: ${styleNote}`,
      `Buying stage: ${buyingStage}`,
      `${fitContext}`,
      ``,
      `Use this exact structure:`,
      `- Subject: ≤50 chars, no "Quick question" or ALL CAPS`,
      `- Body: Hook (1 line) → Insight (1–2 lines) → Value prop → CTA`,
      `- Length: 110–150 words total`,
      `- Opening hook: "${hook}"`,
      `- Value prop: "${valueProp}"`,
      `- CTA: "${cta}"`,
      `- Sender: Risto at DWS`,
      ``,
      `Return JSON: {"subject": string, "body": string}`,
      `Do not use any of these phrases: ${BANNED_PHRASES.join(', ')}.`,
    ].join('\n');

    const result = await this.callLLM(prompt);
    let subject = `${input.orgName} + DWS: ${input.regulatoryTrigger} Compliance`;
    let body = this.buildFallbackEmail(input, hook, valueProp, cta);

    try {
      const parsed = JSON.parse(result.content) as { subject?: string; body?: string };
      if (parsed.subject && parsed.body) {
        subject = parsed.subject;
        body = parsed.body;
      }
    } catch {
      // use fallback
    }

    let linkedinMessage: string | null = null;
    if (input.linkedinDraft) {
      linkedinMessage = await this.craftLinkedInNote(input, hook);
    }

    return {
      orgDomain: input.orgDomain,
      roleId: input.roleId,
      targetRole,
      emailSubject: subject.slice(0, 60),
      emailBody: body,
      linkedinMessage,
      emailStyle: input.emailStyle,
      wordCount: body.split(/\s+/).length,
    };
  }

  private buildFallbackEmail(
    input: MessageCrafterInput,
    hook: string,
    valueProp: string,
    cta: string,
  ): string {
    return [
      hook,
      '',
      `At DWS, we help ${input.orgName} and similar ${input.regulatoryTrigger}-exposed organizations automate compliance with: ${valueProp}`,
      '',
      cta,
      '',
      'Best,',
      'Risto at DWS',
      'risto@onelifetime.world',
    ].join('\n');
  }

  private async craftLinkedInNote(input: MessageCrafterInput, hook: string): Promise<string> {
    const prompt = [
      `Write a LinkedIn connection note for a ${ROLE_NAMES[input.roleId] || 'sustainability leader'} at ${input.orgName}.`,
      `Max 300 characters. Lead with a peer insight, not a pitch.`,
      `Insight: "${hook}"`,
      `Sender: Risto from DWS (EU climate compliance AI).`,
      `Return JSON: {"note": string}`,
    ].join('\n');

    const result = await this.callLLM(prompt);
    try {
      const parsed = JSON.parse(result.content) as { note?: string };
      if (parsed.note && parsed.note.length <= 300) return parsed.note;
    } catch {
      // fallback
    }

    return `${hook.slice(0, 120)} Working on this with EU firms. Happy to share what we're seeing — Risto at DWS`.slice(
      0,
      300,
    );
  }

  private enforceBrandCompliance(draft: MessageDraft): MessageDraft {
    let body = draft.emailBody;
    for (const phrase of BANNED_PHRASES) {
      const re = new RegExp(phrase, 'gi');
      body = body.replace(re, '');
    }
    return { ...draft, emailBody: body.trim(), wordCount: body.trim().split(/\s+/).length };
  }

  private async storeThread(draft: MessageDraft, context: AgentContext): Promise<string | null> {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
    if (!supabaseUrl || !supabaseKey) {
      logger.debug('Supabase not configured — skipping thread storage');
      return null;
    }

    try {
      const res = await fetch(`${supabaseUrl}/rest/v1/outreach_threads`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
          Prefer: 'return=representation',
        },
        body: JSON.stringify({
          org_domain: draft.orgDomain,
          target_role_id: draft.roleId,
          email_subject: draft.emailSubject,
          email_body: draft.emailBody,
          linkedin_message: draft.linkedinMessage,
          email_style: draft.emailStyle,
          status: 'researched',
          pipeline: 'customer',
          crafted_by: this.config.name,
          crafted_at: new Date().toISOString(),
          org_id: context.orgId,
        }),
      });

      if (res.ok) {
        const rows = (await res.json()) as Array<{ id: string }>;
        return rows?.[0]?.id || null;
      }
    } catch (err) {
      logger.warn('Failed to store outreach thread', { error: String(err) });
    }
    return null;
  }
}
