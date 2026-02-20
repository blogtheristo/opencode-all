/**
 * Agent Registry - Central registration and discovery for all DWS IQ 6 agents
 *
 * Provides:
 * - getAgent(name) - retrieve a specific agent instance
 * - listAgents()   - list all registered agent configs
 * - executeAgent() - execute an agent by name with context and input
 *
 * All eleven production agents are registered on module load.
 * All production agents (7 core + 5 SEO pipeline) are registered on module load.
 */

import logger from '../utils/logger.js';
import { BaseAgent } from './base.agent.js';
import { SiteSenseAgent } from './sitesense.agent.js';
import { ScheduleGeniusAgent } from './schedule-genius.agent.js';
import { MaterialOracleAgent } from './material-oracle.agent.js';
import { CustomerSatAgent } from './customer-sat.agent.js';
import { ViabilityAgent } from './viability.agent.js';
import { DeepWikiExtractorAgent } from './deepwiki-extractor.agent.js';
import { EmissionsDataAnalystAgent } from './emissions-data-analyst.agent.js';
import { ComplianceResearcherAgent } from './compliance-researcher.agent.js';
import { SalesOutreachAgent } from './sales-outreach.agent.js';
import { ConstructionAgent } from './construction.agent.js';
import { LogisticsAgent } from './logistics.agent.js';
import { ComplianceAgent } from './compliance.agent.js';
import { QualityGateAgent } from './quality-gate.agent.js';
import { KeywordIntentAgent } from './seo/keyword-intent.agent.js';
import { CompetitorSurveillanceAgent } from './seo/competitor-surveillance.agent.js';
import { ContentBriefAgent } from './seo/content-brief.agent.js';
import { SeoAuditAgent } from './seo/seo-audit.agent.js';
import { LeadFeedbackAgent } from './seo/lead-feedback.agent.js';
import type { AgentConfig, AgentContext, AgentResponse } from './types.js';

export class AgentRegistry {
  private agents: Map<string, BaseAgent> = new Map();

  constructor() {
    this.registerDefaults();
  }

  /** Register a new agent (idempotent - overwrites if name already exists) */
  register(agent: BaseAgent): void {
    const config = agent.getConfig();
    this.agents.set(config.name, agent);
    logger.debug('Agent registered', { name: config.name });
  }

  /** Get an agent by name. Returns undefined if not found. */
  getAgent(name: string): BaseAgent | undefined {
    return this.agents.get(name);
  }

  /** List configurations of all registered agents */
  listAgents(): AgentConfig[] {
    return Array.from(this.agents.values()).map((agent) => ({ ...agent.getConfig() }));
  }

  /**
   * Execute an agent by name.
   * Throws if agent is not found.
   */
  async executeAgent(
    name: string,
    context: AgentContext,
    input: Record<string, unknown>,
  ): Promise<AgentResponse> {
    const agent = this.agents.get(name);
    if (!agent) {
      const available = Array.from(this.agents.keys()).join(', ');
      throw new Error(`Agent "${name}" not found. Available agents: ${available}`);
    }

    logger.info('Executing agent via registry', {
      agent: name,
      projectId: context.projectId,
      userId: context.userId,
    });

    return agent.execute(context, input);
  }

  /** Register all built-in agents */
  private registerDefaults(): void {
    // Utility agents (horizontal)
    this.register(new SiteSenseAgent());
    this.register(new ScheduleGeniusAgent());
    this.register(new MaterialOracleAgent());
    this.register(new CustomerSatAgent());
    this.register(new ViabilityAgent());

    // Extraction & research agents (from DeepWiki/awesome-llm-apps)
    this.register(new DeepWikiExtractorAgent());
    this.register(new EmissionsDataAnalystAgent());
    this.register(new ComplianceResearcherAgent());
    this.register(new SalesOutreachAgent());

    // Orchestration agents (vertical business logic)
    this.register(new ConstructionAgent());
    this.register(new LogisticsAgent());

    // SEO Sales Agent Pipeline (5 agents)
    this.register(new KeywordIntentAgent());
    this.register(new CompetitorSurveillanceAgent());
    this.register(new ContentBriefAgent());
    this.register(new SeoAuditAgent());
    this.register(new LeadFeedbackAgent());

    logger.info('Agent registry initialized', {
      agentCount: this.agents.size,
      agents: Array.from(this.agents.keys()),
    });
  }
}

/** Singleton registry instance */
export const agentRegistry = new AgentRegistry();

// Re-export types for convenience
export type { AgentConfig, AgentContext, AgentResponse } from './types.js';
export { BaseAgent } from './base.agent.js';
