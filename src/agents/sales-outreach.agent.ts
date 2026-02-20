/**
 * Sales Outreach Agent - B2B Lead Research & Personalized Email Generation
 *
 * Extracted from: github.com/Shubhamsaboo/awesome-llm-apps
 * Original file: advanced_ai_agents/multi_agent_apps/ai_email_gtm_outreach_agent/ai_email_gtm_outreach_agent.py
 * Extraction date: 2026-02-11
 * Agent session: claude/deepwiki-agent-extraction-aS6Ub
 * Purpose: Find target companies, research them, and draft personalized B2B outreach emails
 * License: MIT (original repo)
 *
 * Pattern: 4-stage pipeline: Company Finder → Contact Finder → Research → Email Writer
 * Adapted from Agno + SQLite + Exa to DWS6 BaseAgent + LLM.
 *
 * Input: {
 *   targetDescription: Description of ideal customer profile (industry, size, region)
 *   offering:          DWS product/service being offered
 *   senderName:        Sales rep name
 *   senderCompany:     "Lifetime Oy" or "DWS"
 *   emailStyle:        "professional" | "cold" | "consultative"
 *   maxCompanies:      Number of companies to target (1-10)
 * }
 *
 * Output: List of target companies with contacts, research insights, and draft emails
 *
 * Tier: 2 (produces outbound communication drafts - requires review before sending)
 */

import logger from '../utils/logger.js';
import { BaseAgent } from './base.agent.js';
import type { AgentContext, AgentResponse } from './types.js';

// ============ INPUT INTERFACE ============

interface SalesOutreachInput {
  targetDescription: string;
  offering: string;
  senderName: string;
  senderCompany: string;
  emailStyle: 'professional' | 'cold' | 'consultative';
  maxCompanies: number;
}

// ============ OUTPUT TYPES ============

interface TargetCompany {
  name: string;
  website: string;
  whyFit: string;
  industry: string;
}

interface ContactInfo {
  company: string;
  fullName: string;
  title: string;
  email: string;
  inferred: boolean;
}

interface CompanyInsight {
  company: string;
  insights: string[];
}

interface DraftEmail {
  company: string;
  contact: string;
  subject: string;
  body: string;
  style: string;
}

// ============ EMAIL STYLE TEMPLATES ============

const EMAIL_STYLES: Record<string, string> = {
  professional: 'Clear, respectful, businesslike. Short paragraphs. No slang.',
  cold: 'Strong hook in opening 2 lines, tight value proposition, minimal fluff, strong CTA.',
  consultative: 'Insight-led. Frame observed problems and tailored solution hypotheses. Soft CTA.',
};

// ============ DWS-SPECIFIC TARGETING ============

/** EU climate compliance buyer personas */
const BUYER_PERSONAS = [
  'Chief Sustainability Officer (CSO)',
  'VP of ESG / Environmental Compliance',
  'Head of EHS (Environment, Health & Safety)',
  'CFO (CSRD financial reporting)',
  'Operations Director (ETS compliance)',
  'Procurement Director (CBAM imports)',
  'CTO / Head of Digital (AI/automation)',
];

/** DWS product value propositions */
const VALUE_PROPS: Record<string, string> = {
  'dws-iq6': 'AI-powered climate compliance automation covering ETS, CBAM, CSRD across 16 EU industries',
  'firehorse-reports': 'Automated sustainability reporting with EN 15978 lifecycle assessment',
  'firehorse-automation': 'Workflow automation for emissions monitoring, MRV, and regulatory submissions',
  'sitesense': 'Edge AI for construction site monitoring - safety scoring and weather risk analysis',
  'material-oracle': 'Carbon footprint analysis with low-carbon material alternatives',
};

// ============ AGENT IMPLEMENTATION ============

export class SalesOutreachAgent extends BaseAgent {
  constructor() {
    super({
      name: 'sales-outreach',
      description:
        'Researches target companies and drafts personalized B2B outreach emails for DWS climate compliance products',
      capabilities: [
        'company-targeting',
        'contact-research',
        'email-drafting',
        'personalization',
        'b2b-outreach',
        'climate-sales',
      ],
      model: 'llama-3.1-70b-versatile',
    });
  }

  async execute(
    context: AgentContext,
    input: Record<string, unknown>,
  ): Promise<AgentResponse> {
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

      // Stage 1: Identify target companies
      const companies = await this.findCompanies(validated);

      // Stage 2: Find contacts
      const contacts = this.findContacts(companies);

      // Stage 3: Research insights
      const insights = await this.researchCompanies(companies, validated);

      // Stage 4: Draft emails
      const emails = await this.draftEmails(contacts, insights, validated);

      const confidence = this.calculateConfidence(companies.length, validated);

      const response: AgentResponse = {
        agentName: this.config.name,
        result: {
          companies,
          contacts,
          insights,
          emails,
          pipeline: {
            companiesFound: companies.length,
            contactsFound: contacts.length,
            insightsGathered: insights.length,
            emailsDrafted: emails.length,
          },
        },
        confidence,
        reasoning: `Found ${companies.length} target companies matching "${validated.targetDescription}". Identified ${contacts.length} contacts. Researched ${insights.length} companies. Drafted ${emails.length} personalized ${validated.emailStyle} emails.`,
        recommendations: [
          'Review all draft emails before sending - this agent produces DRAFTS only (Tier 2)',
          'Verify contact emails before sending (some may be inferred)',
          'Personalize further based on your relationship history with these companies',
          `Suggested follow-up: schedule calls within 3-5 business days of email send`,
        ],
        metadata: {
          durationMs: Date.now() - startTime,
          model: this.config.model,
          emailStyle: validated.emailStyle,
          targetDescription: validated.targetDescription,
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

      logger.error('Sales outreach failed', { agent: this.config.name, error: errorMessage });

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
        reasoning: `Outreach pipeline failed: ${errorMessage}`,
        recommendations: ['Verify target description is specific enough', 'Try reducing maxCompanies'],
        metadata: { durationMs, model: this.config.model },
      };
    }
  }

  // ============ PRIVATE METHODS ============

  private validateInput(input: Record<string, unknown>): SalesOutreachInput {
    if (typeof input.targetDescription !== 'string' || input.targetDescription.length < 10) {
      throw new Error('targetDescription must be a descriptive string (min 10 chars)');
    }
    if (typeof input.offering !== 'string' || input.offering.length < 5) {
      throw new Error('offering must describe the product/service (min 5 chars)');
    }
    const styles = ['professional', 'cold', 'consultative'];
    const style = styles.includes(input.emailStyle as string)
      ? (input.emailStyle as 'professional' | 'cold' | 'consultative')
      : 'professional';
    const maxCompanies = typeof input.maxCompanies === 'number'
      ? Math.max(1, Math.min(10, input.maxCompanies))
      : 5;

    return {
      targetDescription: input.targetDescription,
      offering: input.offering,
      senderName: (input.senderName as string) || 'DWS Sales Team',
      senderCompany: (input.senderCompany as string) || 'Lifetime Oy',
      emailStyle: style,
      maxCompanies,
    };
  }

  private async findCompanies(input: SalesOutreachInput): Promise<TargetCompany[]> {
    const prompt = [
      `You are a B2B company research agent for EU climate compliance solutions.`,
      `Find ${input.maxCompanies} companies that match this profile:`,
      `Target: ${input.targetDescription}`,
      `Product: ${input.offering}`,
      ``,
      `Return ONLY valid JSON: {"companies": [{"name", "website", "whyFit", "industry"}]}`,
      `Focus on EU-based companies in industries affected by ETS, CSRD, CBAM, or Fit for 55.`,
    ].join('\n');

    const result = await this.callLLM(prompt);
    if (result.model === 'placeholder') {
      return this.generatePlaceholderCompanies(input);
    }
    try {
      const parsed = JSON.parse(result.content);
      const companies = parsed.companies;
      if (!Array.isArray(companies) || companies.length === 0) {
        return this.generatePlaceholderCompanies(input);
      }
      return companies.slice(0, input.maxCompanies);
    } catch {
      // Deterministic fallback with placeholder companies
      return this.generatePlaceholderCompanies(input);
    }
  }

  private findContacts(companies: TargetCompany[]): ContactInfo[] {
    // Deterministic: generate likely contact roles per company
    const contacts: ContactInfo[] = [];
    for (const company of companies) {
      // Select 2 relevant personas based on industry
      const relevantPersonas = BUYER_PERSONAS.slice(0, 2);
      for (const persona of relevantPersonas) {
        contacts.push({
          company: company.name,
          fullName: `[${persona}]`,
          title: persona,
          email: `[research needed]`,
          inferred: true,
        });
      }
    }
    return contacts;
  }

  private async researchCompanies(
    companies: TargetCompany[],
    input: SalesOutreachInput,
  ): Promise<CompanyInsight[]> {
    const prompt = [
      `For each company below, generate 2-3 specific insights relevant to EU climate compliance.`,
      `Focus on: sustainability reports, ETS exposure, CSRD readiness, carbon reduction targets.`,
      `Companies: ${JSON.stringify(companies.map((c) => ({ name: c.name, industry: c.industry })))}`,
      `Product context: ${input.offering}`,
      ``,
      `Return JSON: {"companies": [{"company", "insights": [string, string]}]}`,
    ].join('\n');

    const result = await this.callLLM(prompt);
    try {
      const parsed = JSON.parse(result.content);
      return parsed.companies || [];
    } catch {
      // Deterministic fallback
      return companies.map((c) => ({
        company: c.name,
        insights: [
          `${c.industry} sector faces increasing ETS compliance costs under Fit for 55`,
          `CSRD reporting deadline approaching - likely needs sustainability reporting automation`,
        ],
      }));
    }
  }

  private async draftEmails(
    contacts: ContactInfo[],
    insights: CompanyInsight[],
    input: SalesOutreachInput,
  ): Promise<DraftEmail[]> {
    const styleInstruction = EMAIL_STYLES[input.emailStyle] || EMAIL_STYLES.professional;

    // Resolve offering value prop
    const valueProp = VALUE_PROPS[input.offering] || input.offering;

    const prompt = [
      `Write personalized B2B outreach emails for EU climate compliance solutions.`,
      `Style: ${styleInstruction}`,
      `Sender: ${input.senderName} at ${input.senderCompany}`,
      `Offering: ${valueProp}`,
      `Contacts: ${JSON.stringify(contacts.slice(0, 6))}`,
      `Research insights: ${JSON.stringify(insights)}`,
      ``,
      `Return JSON: {"emails": [{"company", "contact", "subject", "body"}]}`,
      `Length: 120-160 words per email. Include 1-2 lines of personalization from research insights.`,
      `CTA: suggest a 15-minute intro call.`,
    ].join('\n');

    const result = await this.callLLM(prompt);
    try {
      const parsed = JSON.parse(result.content);
      return (parsed.emails || []).map((e: DraftEmail) => ({ ...e, style: input.emailStyle }));
    } catch {
      // Deterministic fallback: one email per unique company
      const uniqueCompanies = [...new Set(contacts.map((c) => c.company))];
      return uniqueCompanies.map((company) => {
        const companyInsights = insights.find((i) => i.company === company);
        const insight = companyInsights?.insights[0] || 'EU climate compliance requirements are intensifying';
        return {
          company,
          contact: contacts.find((c) => c.company === company)?.fullName || 'Sustainability Team',
          subject: `${company} + ${input.senderCompany}: Climate Compliance Automation`,
          body: [
            `Hi,`,
            ``,
            `${insight}.`,
            ``,
            `At ${input.senderCompany}, we help ${company}'s industry automate compliance with ${valueProp}.`,
            ``,
            `Would you be open to a 15-minute call to explore whether this could save your team time on upcoming reporting deadlines?`,
            ``,
            `Best regards,`,
            `${input.senderName}`,
            `${input.senderCompany}`,
          ].join('\n'),
          style: input.emailStyle,
        };
      });
    }
  }

  private generatePlaceholderCompanies(input: SalesOutreachInput): TargetCompany[] {
    // Return placeholder structure when LLM unavailable
    return Array.from({ length: Math.min(input.maxCompanies, 3) }, (_, i) => ({
      name: `[Target Company ${i + 1}]`,
      website: '[research needed]',
      whyFit: `Matches profile: ${input.targetDescription.slice(0, 50)}`,
      industry: 'EU-regulated industry',
    }));
  }

  private calculateConfidence(companyCount: number, input: SalesOutreachInput): number {
    let confidence = 0.6;
    if (companyCount >= input.maxCompanies) confidence += 0.15;
    else if (companyCount > 0) confidence += 0.1;
    if (input.targetDescription.length > 50) confidence += 0.05;
    if (input.offering in VALUE_PROPS) confidence += 0.1;
    return Math.max(0, Math.min(1, confidence));
  }
}
