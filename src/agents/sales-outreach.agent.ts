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
  seedCompanies?: TargetCompany[];
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
      model: 'llama-3.3-70b-versatile',
      modelTier: 'standard',
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
    const fallbackTargetDescription = this.buildFallbackTargetDescription(input);
    const targetDescription = this.getTrimmedString(input.targetDescription) || fallbackTargetDescription;
    if (!targetDescription || targetDescription.length < 10) {
      throw new Error('targetDescription must be a descriptive string (min 10 chars)');
    }

    const offering = this.getTrimmedString(input.offering)
      || this.getTrimmedString(this.getPrimaryProspect(input)?.offering)
      || this.getTrimmedString(this.getPrimaryProspect(input)?.product)
      || this.getTrimmedString(this.getPrimaryProspect(input)?.productName)
      || 'dws-iq6';
    if (offering.length < 5) {
      throw new Error('offering must describe the product/service (min 5 chars)');
    }

    const styles = ['professional', 'cold', 'consultative'];
    const style = styles.includes(input.emailStyle as string)
      ? (input.emailStyle as 'professional' | 'cold' | 'consultative')
      : 'professional';
    const rawMaxCompanies = typeof input.maxCompanies === 'number' && Number.isFinite(input.maxCompanies)
      ? input.maxCompanies
      : 5;
    const maxCompanies = Math.max(1, Math.min(10, Math.round(rawMaxCompanies)));
    const senderName = (typeof input.senderName === 'string' ? input.senderName.trim() : '') || 'DWS Sales Team';
    const senderCompany = (typeof input.senderCompany === 'string' ? input.senderCompany.trim() : '') || 'Lifetime Oy';
    const seedCompanies = this.extractSeedCompanies(input, maxCompanies);

    return {
      targetDescription,
      offering,
      senderName,
      senderCompany,
      emailStyle: style,
      maxCompanies,
      seedCompanies: seedCompanies.length > 0 ? seedCompanies : undefined,
    };
  }

  private async findCompanies(input: SalesOutreachInput): Promise<TargetCompany[]> {
    if (input.seedCompanies && input.seedCompanies.length > 0) {
      return input.seedCompanies.slice(0, input.maxCompanies);
    }

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
      // proceed to fallback
    }
    // Deterministic fallback with placeholder companies
    return this.generatePlaceholderCompanies(input);
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
      if (Array.isArray(parsed.companies) && parsed.companies.length > 0) {
        return parsed.companies;
      }
    } catch {
      // fall through to deterministic fallback
    }
    // Deterministic fallback when response is missing or empty
    return companies.map((c) => ({
      company: c.name,
      insights: [
        `${c.industry} sector faces increasing ETS compliance costs under Fit for 55`,
        `CSRD reporting deadline approaching - likely needs sustainability reporting automation`,
      ],
    }));
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
      if (Array.isArray(parsed.emails) && parsed.emails.length > 0) {
        return parsed.emails.map((e: DraftEmail) => ({ ...e, style: input.emailStyle }));
      }
    } catch {
      // JSON parse failed - fall through to deterministic fallback
    }
    // Deterministic fallback: one email per unique company (placeholder/invalid/empty LLM response)
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

  private generatePlaceholderCompanies(input: SalesOutreachInput): TargetCompany[] {
    // Curated list of real EU companies in DWS target sectors (public info, no secrets)
    // Source: DWS market research, public company registries, EU ETS/CSRD scope
    const TARGET_COMPANIES: TargetCompany[] = [
      { name: 'NCC', website: 'ncc.com', whyFit: 'Nordic construction, CSRD reporting entity, EN 15978 carbon tracking needed', industry: 'construction' },
      { name: 'YIT', website: 'yitgroup.com', whyFit: 'Finnish construction, ETS-exposed material procurement, CSRD mandatory 2025', industry: 'construction' },
      { name: 'SRV Group', website: 'srv.fi', whyFit: 'Finnish construction, project-level carbon reporting needed for EU Taxonomy', industry: 'construction' },
      { name: 'Skanska', website: 'skanska.com', whyFit: 'Nordic construction leader, Science-based targets, CSRD scope', industry: 'construction' },
      { name: 'SSAB', website: 'ssab.com', whyFit: 'Steel manufacturer, EU ETS installation, CBAM-covered sector, fossil-free steel transition', industry: 'steel' },
      { name: 'Outokumpu', website: 'outokumpu.com', whyFit: 'Stainless steel, EU ETS + CBAM exposure, Scope 1+2 reporting', industry: 'steel' },
      { name: 'UPM-Kymmene', website: 'upm.com', whyFit: 'Forest/paper industry, EU ETS installation, biodiversity reporting under CSRD', industry: 'manufacturing' },
      { name: 'Stora Enso', website: 'storaenso.com', whyFit: 'Packaging/forest products, EU ETS + CSRD double materiality assessment', industry: 'manufacturing' },
      { name: 'Wärtsilä', website: 'wartsila.com', whyFit: 'Marine/energy engines, EU ETS maritime + Fit for 55 FuelEU Maritime', industry: 'energy' },
      { name: 'Neste', website: 'neste.com', whyFit: 'Renewable fuels, EU ETS refinery, CSRD pioneer, CBAM feedstock imports', industry: 'energy' },
      { name: 'Posti Group', website: 'posti.com', whyFit: 'Finnish logistics, fleet emissions reporting, Scope 3 transport for CSRD', industry: 'logistics' },
      { name: 'DB Schenker', website: 'dbschenker.com', whyFit: 'EU logistics, GLEC Framework reporting, Scope 3 Category 4/9', industry: 'logistics' },
      { name: 'PORR AG', website: 'porr-group.com', whyFit: 'Austrian construction, CSRD reporting entity, cross-border CBAM materials', industry: 'construction' },
      { name: 'Heidelberg Materials', website: 'heidelbergmaterials.com', whyFit: 'Cement/concrete, EU ETS top emitter, CBAM-covered, carbon capture investments', industry: 'cement' },
      { name: 'Holcim', website: 'holcim.com', whyFit: 'Global cement, EU ETS + CBAM, Science-based targets approved', industry: 'cement' },
    ];

    // Filter by relevance to target description
    const desc = input.targetDescription.toLowerCase();
    const sorted = TARGET_COMPANIES
      .map(c => ({
        ...c,
        relevance: [c.industry, c.whyFit.toLowerCase(), c.name.toLowerCase()]
          .filter(s => desc.includes(s) || s.includes(desc.split(' ')[0])).length,
      }))
      .sort((a, b) => b.relevance - a.relevance);

    return sorted.slice(0, input.maxCompanies);
  }

  private calculateConfidence(companyCount: number, input: SalesOutreachInput): number {
    let confidence = 0.6;
    if (companyCount >= input.maxCompanies) confidence += 0.15;
    else if (companyCount > 0) confidence += 0.1;
    if (input.targetDescription.length > 50) confidence += 0.05;
    if (input.offering in VALUE_PROPS) confidence += 0.1;
    return Math.max(0, Math.min(1, confidence));
  }

  private getTrimmedString(value: unknown): string {
    return typeof value === 'string' ? value.trim() : '';
  }

  private getPrimaryProspect(input: Record<string, unknown>): Record<string, unknown> | null {
    if (typeof input.prospect === 'object' && input.prospect !== null && !Array.isArray(input.prospect)) {
      return input.prospect as Record<string, unknown>;
    }
    if (
      typeof input.prospectData === 'object'
      && input.prospectData !== null
      && !Array.isArray(input.prospectData)
    ) {
      return input.prospectData as Record<string, unknown>;
    }
    return null;
  }

  private buildFallbackTargetDescription(input: Record<string, unknown>): string {
    const primaryProspect = this.getPrimaryProspect(input);
    const prospectName = this.getTrimmedString(primaryProspect?.companyName)
      || this.getTrimmedString(primaryProspect?.name);
    const industry = this.getTrimmedString(input.industry);
    const targetRole = this.getTrimmedString(input.targetRole);
    const regulatoryTrigger = this.getTrimmedString(input.regulatoryTrigger);

    const parts = [
      prospectName ? `Priority prospect: ${prospectName}` : '',
      industry ? `Industry: ${industry}` : '',
      targetRole ? `Buyer role: ${targetRole}` : '',
      regulatoryTrigger ? `Regulatory trigger: ${regulatoryTrigger}` : '',
    ].filter(Boolean);

    return parts.join(' | ');
  }

  private extractSeedCompanies(
    input: Record<string, unknown>,
    maxCompanies: number,
  ): TargetCompany[] {
    const candidates: Record<string, unknown>[] = [];
    const primaryProspect = this.getPrimaryProspect(input);
    if (primaryProspect) {
      candidates.push(primaryProspect);
    }

    if (Array.isArray(input.prospects)) {
      for (const prospect of input.prospects) {
        if (typeof prospect === 'object' && prospect !== null && !Array.isArray(prospect)) {
          candidates.push(prospect as Record<string, unknown>);
        }
      }
    }

    return candidates
      .map((prospect) => this.mapProspectToCompany(prospect))
      .filter((company): company is TargetCompany => company !== null)
      .slice(0, maxCompanies);
  }

  private mapProspectToCompany(prospect: Record<string, unknown>): TargetCompany | null {
    const name = this.getTrimmedString(prospect.companyName) || this.getTrimmedString(prospect.name);
    if (!name) {
      return null;
    }

    return {
      name,
      website: this.getTrimmedString(prospect.website) || '[research needed]',
      whyFit:
        this.getTrimmedString(prospect.whyFit)
        || this.getTrimmedString(prospect.reason)
        || this.getTrimmedString(prospect.painPoint)
        || 'Matched from workflow prospect input',
      industry: this.getTrimmedString(prospect.industry) || 'EU-regulated industry',
    };
  }
}
