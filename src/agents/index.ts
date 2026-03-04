/**
 * Agent Registry — DWS IQ 6/7 Central Registration & Orchestration
 *
 * DWS7 Modernization:
 *   Fix #4: Agent-to-agent communication via executeAgent + event bus
 *   - Agents can delegate to each other mid-execution via delegate_to_agent tool
 *   - Event bus integration for async agent coordination
 *   - Discovery API for A2A protocol compatibility
 *   - Built-in tool handler registration on startup
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
import { AtlasAgent } from './workflow/atlas/atlas.agent.js';
import { AthenaAgent } from './workflow/athena/athena.agent.js';
import { HephaestusAgent } from './workflow/hephaestus/hephaestus.agent.js';
import { IrisAgent } from './workflow/iris/iris.agent.js';
import { HermesAgent } from './workflow/hermes/hermes.agent.js';
import { ApolloAgent } from './workflow/apollo/apollo.agent.js';
import { VulcanAgent } from './workflow/industry/vulcan.agent.js';
import { HeliosAgent } from './workflow/industry/helios.agent.js';
import { NeptuneAgent } from './workflow/industry/neptune.agent.js';
import { CeresAgent } from './workflow/industry/ceres.agent.js';
import { PrometheusAgent } from './workflow/industry/prometheus.agent.js';
import { MarsAgent } from './workflow/industry/mars.agent.js';
import { GaiaAgent } from './workflow/industry/gaia.agent.js';
import { registerBuiltinTools } from './tools.js';
import { eventBus, registerDefaultEventHandlers } from './event-bus.js';
import type { AgentConfig, AgentContext, AgentResponse } from './types.js';

export class AgentRegistry {
  private agents: Map<string, BaseAgent> = new Map();

  /** Track active delegations to prevent infinite loops */
  private activeDelegations: Map<string, number> = new Map();
  private static MAX_DELEGATION_DEPTH = 5;

  constructor() {
    this.registerDefaults();
    this.initializeRuntime();
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
   * Discover agents by capability tag.
   * DWS7: Enables A2A-style discovery — agents can find each other by what they can do.
   */
  discoverAgents(capability: string): AgentConfig[] {
    return this.listAgents().filter((a) =>
      a.capabilities.some((c) => c.includes(capability)),
    );
  }

  /**
   * Execute an agent by name with delegation depth tracking.
   * DWS7: Prevents infinite delegation loops (A calls B calls A calls B...).
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

    // Track delegation depth to prevent infinite loops
    const delegationKey = `${context.sessionId}:${name}`;
    const currentDepth = this.activeDelegations.get(delegationKey) || 0;

    if (currentDepth >= AgentRegistry.MAX_DELEGATION_DEPTH) {
      logger.warn('Agent delegation depth limit reached', {
        agent: name,
        depth: currentDepth,
        sessionId: context.sessionId,
      });
      return {
        agentName: name,
        result: { error: 'Delegation depth limit reached', maxDepth: AgentRegistry.MAX_DELEGATION_DEPTH },
        confidence: 0,
        reasoning: `Agent "${name}" was not executed because the delegation depth limit (${AgentRegistry.MAX_DELEGATION_DEPTH}) was reached. This prevents infinite agent delegation loops.`,
        recommendations: ['Reduce delegation chain length or restructure agent workflow'],
        metadata: { delegationDepth: currentDepth },
      };
    }

    // Increment depth
    this.activeDelegations.set(delegationKey, currentDepth + 1);

    logger.info('Executing agent via registry', {
      agent: name,
      projectId: context.projectId,
      userId: context.userId,
      delegationDepth: currentDepth,
    });

    try {
      const result = await agent.execute(context, input);

      // Emit completion event
      await eventBus.emit({
        type: 'agent.execution_complete',
        source: `agent:${name}`,
        payload: {
          agentName: name,
          confidence: result.confidence,
          durationMs: result.metadata?.durationMs,
        },
        priority: 'normal',
        timestamp: new Date().toISOString(),
        orgId: context.orgId,
        sessionId: context.sessionId,
      });

      return result;
    } finally {
      // Decrement depth (or remove if back to 0)
      const newDepth = (this.activeDelegations.get(delegationKey) || 1) - 1;
      if (newDepth <= 0) {
        this.activeDelegations.delete(delegationKey);
      } else {
        this.activeDelegations.set(delegationKey, newDepth);
      }
    }
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

    // Compliance agent
    this.register(new ComplianceAgent());

    // Quality gate agent
    this.register(new QualityGateAgent());

    // SEO Sales Agent Pipeline (5 agents)
    this.register(new KeywordIntentAgent());
    this.register(new CompetitorSurveillanceAgent());
    this.register(new ContentBriefAgent());
    this.register(new SeoAuditAgent());
    this.register(new LeadFeedbackAgent());

    // Climate IQ Workflow Agents — Greek/Roman pantheon (orchestrators)
    this.register(new AtlasAgent());       // Chief of Staff — synthesis & routing
    this.register(new AthenaAgent());      // Compliance Intelligence — EU regulatory
    this.register(new HephaestusAgent());  // Field & Site Intelligence — construction
    this.register(new IrisAgent());        // Research & Market Intelligence
    this.register(new HermesAgent());      // Logistics & Operations
    this.register(new ApolloAgent());      // Content & Outreach

    // Climate IQ Industry Specialists — Roman/Greek gods per sector
    this.register(new VulcanAgent());      // Steel & Metals
    this.register(new HeliosAgent());      // Energy & Renewables
    this.register(new NeptuneAgent());     // Maritime & Shipping
    this.register(new CeresAgent());       // Agriculture & Fertilizers
    this.register(new PrometheusAgent());  // Hydrogen & Energy Transition
    this.register(new MarsAgent());        // Construction & Buildings
    this.register(new GaiaAgent());        // Cement & Earth Materials

    logger.info('Agent registry initialized', {
      agentCount: this.agents.size,
      agents: Array.from(this.agents.keys()),
    });
  }

  /** Initialize the DWS7 agent runtime (tools, event bus) */
  private initializeRuntime(): void {
    // Register built-in tool handlers (delegate_to_agent, query_database, etc.)
    registerBuiltinTools();

    // Register default event handlers
    registerDefaultEventHandlers();

    logger.info('DWS7 agent runtime initialized', {
      features: ['tool-use', 'agentic-loop', 'agent-delegation', 'event-bus'],
    });
  }
}

/** Singleton registry instance */
export const agentRegistry = new AgentRegistry();

// Re-export types for convenience
export type { AgentConfig, AgentContext, AgentResponse, SandboxContext } from './types.js';
export type { ToolDefinition, ToolCall, ToolResult, LLMMessage, LLMResponse } from './types.js';
export { BaseAgent } from './base.agent.js';

// Re-export DWS7 modules
export { eventBus } from './event-bus.js';
export { BUILTIN_TOOLS, registerToolHandler } from './tools.js';
export { createLLMClient, LLMClient } from './llm-client.js';

// Re-export sandbox isolation module
export { executeIsolatedAgent, getAgentFoundryConfig, getSandboxStage } from '../sandbox/index.js';
