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
import { type BaseAgent } from './base.agent.js';
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
import { MercuryAgent } from './workflow/mercury/mercury.agent.js';
import { ApolloAgent } from './workflow/apollo/apollo.agent.js';
import { VulcanAgent } from './workflow/industry/vulcan.agent.js';
import { HeliosAgent } from './workflow/industry/helios.agent.js';
import { NeptuneAgent } from './workflow/industry/neptune.agent.js';
import { CeresAgent } from './workflow/industry/ceres.agent.js';
import { PrometheusAgent } from './workflow/industry/prometheus.agent.js';
import { MarsAgent } from './workflow/industry/mars.agent.js';
import { BESSAgent } from './workflow/industry/bess.agent.js';
import { GaiaAgent } from './workflow/industry/gaia.agent.js';
import { TalosAgent } from './workflow/industry/talos.agent.js';
import { ArgusAgent } from './argus.agent.js';
import { SovereigntyMonitorAgent } from './sovereignty-monitor.agent.js';
import { DesignerAgent } from './designer.agent.js';
import { KBAgent } from './kb.agent.js';
import { SyntheticDataAgent } from './synthetic-data.agent.js';
// Intelligence Expansion — 12 new agents (2026-05-03, AI Engineering book mapping)
import { MnemosyneAgent } from './mnemosyne.agent.js';
import { ThemisAgent } from './themis.agent.js';
import { CassandraAgent } from './cassandra.agent.js';
import { DaedalusAgent } from './daedalus.agent.js';
import { AgoraAgent } from './agora.agent.js';
import { JunoAgent } from './workflow/industry/juno.agent.js';
import { MercuryTradeAgent } from './workflow/industry/mercury-trade.agent.js';
import { MinervaAgent } from './minerva.agent.js';
import { PanaceaAgent } from './panacea.agent.js';
import { AuditorAgent } from './auditor.agent.js';
import { VisionOracleAgent } from './vision-oracle.agent.js';
import { ChronosAgent } from './chronos.agent.js';
import { OutreachLeadFinderAgent } from './outreach-lead-finder.agent.js';
import { OutreachMessageCrafterAgent } from './outreach-message-crafter.agent.js';
import { OutreachExecutorAgent } from './outreach-executor.agent.js';
import { OutreachOrchestratorAgent } from './outreach-orchestrator.agent.js';
import { OutreachImproverAgent } from './outreach-improver.agent.js';
import { WorldModelLoopAgent } from './world-model/world-model-loop.agent.js';
// Internal Security Governance Agents (2026-07-03, sanasto/security audit follow-up)
import { AegisAgent } from './aegis.agent.js';
import { VestaAgent } from './vesta.agent.js';
// Consultant Role Agents — 8 roles from Konsultin käsikirja 2026
import {
  AIScopingConsultantAgent,
  DWSDeploymentEngineerAgent,
  ComplianceSpecialistAgent,
  EdgeAIEngineerAgent,
  EnterpriseModelEngineerAgent,
  GenAISolutionArchitectAgent,
  DevOpsEngineerAgent,
  ProjectManagerAgent,
} from './consultant/index.js';
import { HelpdeskAgent } from './helpdesk.agent.js';
import { registerBuiltinTools } from './tools.js';
import { eventBus, registerDefaultEventHandlers } from './event-bus.js';
import { withAgentSpan } from '../observability/tracing.js';
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
    return this.listAgents().filter((a) => a.capabilities.some((c) => c.includes(capability)));
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
        result: {
          error: 'Delegation depth limit reached',
          maxDepth: AgentRegistry.MAX_DELEGATION_DEPTH,
        },
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
      const result = await withAgentSpan(
        name,
        {
          orgId: context.orgId,
          sessionId: context.sessionId,
          delegationDepth: currentDepth,
        },
        async (span) => {
          const r = await agent.execute(context, input);
          if (typeof r.confidence === 'number') {
            span.setAttribute('dws.agent.confidence', r.confidence);
          }
          if (typeof r.metadata?.durationMs === 'number') {
            span.setAttribute('dws.agent.duration_ms', r.metadata.durationMs);
          }
          return r;
        },
      );

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
    this.register(new WorldModelLoopAgent());

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
    this.register(new AtlasAgent()); // Chief of Staff — synthesis & routing
    this.register(new AthenaAgent()); // Compliance Intelligence — EU regulatory
    this.register(new HephaestusAgent()); // Field & Site Intelligence — construction
    this.register(new IrisAgent()); // Research & Market Intelligence
    this.register(new MercuryAgent()); // Logistics & Operations
    this.register(new ApolloAgent()); // Content & Outreach

    // Climate IQ Industry Specialists — Roman/Greek gods per sector
    this.register(new VulcanAgent()); // Steel & Metals
    this.register(new HeliosAgent()); // Energy & Renewables
    this.register(new NeptuneAgent()); // Maritime & Shipping
    this.register(new CeresAgent()); // Agriculture & Fertilizers
    this.register(new PrometheusAgent()); // Hydrogen & Energy Transition
    this.register(new MarsAgent()); // Construction & Buildings
    this.register(new GaiaAgent()); // Cement & Earth Materials
    this.register(new BESSAgent()); // Battery Energy Storage — Q-System integration
    this.register(new TalosAgent()); // Aluminium — CBAM indirect emissions, grid carbon

    // KYA Vision — Orbital Target Labeling (ICEYE SAR partnership)
    this.register(new ArgusAgent()); // All-seeing orbital eye — 20-industry detection

    // Sovereignty — Database & infrastructure sovereignty assessment
    this.register(new SovereigntyMonitorAgent()); // EU data sovereignty scoring

    // Designer — Design-to-code bridge (Anthropic designer workflow)
    this.register(new DesignerAgent()); // Figma-to-code, style changes, component creation

    // Knowledge Base — LLM-maintained wiki (Karpathy workflow)
    this.register(new KBAgent()); // compile, ask, research, lint

    // Synthetic Data Pipeline — CBAM stress testing (NeMo DataDesigner)
    this.register(new SyntheticDataAgent()); // generate, validate, dd-summary

    // Intelligence Expansion — 12 new agents (2026-05-03, AI Engineering book mapping, total 50)
    this.register(new MnemosyneAgent()); // Long-term memory oracle — cross-session context
    this.register(new ThemisAgent()); // Legal intelligence + ethical reasoning (EU AI Act Art. 9)
    this.register(new CassandraAgent()); // Predictive analytics — ETS/CBAM price forecast
    this.register(new DaedalusAgent()); // Tool composition + MCP bridge — dynamic chaining
    this.register(new AgoraAgent()); // Collective intelligence — multi-agent consensus
    this.register(new JunoAgent()); // Chemical & pharma industry — CBAM fertilisers/H2
    this.register(new MercuryTradeAgent()); // Trade intelligence — CBAM import analytics
    this.register(new MinervaAgent()); // Knowledge transfer + XAI explainability
    this.register(new PanaceaAgent()); // Self-improving adaptive optimizer
    this.register(new AuditorAgent()); // Audit trail + hash chain (EU AI Act Art. 12)
    this.register(new VisionOracleAgent()); // Vision language model — site photos, SAR imagery
    this.register(new ChronosAgent()); // Temporal workflow + EU compliance deadline engine

    // Outreach Pipeline — 4-step DGX Spark-powered B2B outreach (2026-06-15)
    this.register(new OutreachLeadFinderAgent()); // Step 1: find + score EU leads
    this.register(new OutreachMessageCrafterAgent()); // Step 2: craft personalized email + LinkedIn drafts
    this.register(new OutreachExecutorAgent()); // Step 3: deliver via SES / queue LinkedIn
    this.register(new OutreachOrchestratorAgent()); // Coordinator: chains Steps 1–3
    this.register(new OutreachImproverAgent()); // Outer loop: analyze outcomes → propose SKILL.md diffs
    // Internal Security Governance Agents (2026-07-03, sanasto/security audit follow-up)
    this.register(new AegisAgent()); // Vulnerability & patch SLA triage
    this.register(new VestaAgent()); // Business-critical systems registry

    // Consultant Role Agents — 8 roles from Konsultin käsikirja 2026 (total 60)
    this.register(new AIScopingConsultantAgent()); // Compliance-need assessment, product recommendation
    this.register(new DWSDeploymentEngineerAgent()); // ERP integration (SAP, IFS, Visma, Monitor)
    this.register(new ComplianceSpecialistAgent()); // CBAM, CSRD, ETS, NIS2, CER, EU AI Act
    this.register(new EdgeAIEngineerAgent()); // NVIDIA Jetson/DGX Spark, air-gapped Aegis
    this.register(new EnterpriseModelEngineerAgent()); // LWM ontology, Train Model SaaS
    this.register(new GenAISolutionArchitectAgent()); // Claude Code, KYA, agent architecture
    this.register(new DevOpsEngineerAgent()); // CI/CD, K8s, UpCloud Helsinki, security
    this.register(new ProjectManagerAgent()); // JIRA, scheduling, customer documentation
    // Helpdesk — AI-native support ticket triage. Off by default in production.
    // Enable via HELPDESK_AGENT_ENABLED=true after kb/wiki/concepts/support/ policy seed has landed.
    // In dev/test (NODE_ENV !== 'production') it registers automatically so tests can run.
    if (process.env.HELPDESK_AGENT_ENABLED === 'true' || process.env.NODE_ENV !== 'production') {
      this.register(new HelpdeskAgent()); // Support triage — drafts reply + recommendation; never sends
    }

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
export { createLLMClient, createLLMClientForAgent, LLMClient } from './llm-client.js';

// Re-export DiffusionGemma parallel-diffusion local inference
export {
  createDiffusionGemmaClient,
  resolveDiffusionGemmaConfig,
  resolveDiffusionGemmaBaseUrl,
  resolveDiffusionGemmaModel,
  resolveDiffusionParams,
  DIFFUSIONGEMMA_SPEC,
  DIFFUSIONGEMMA_THROUGHPUT,
  DIFFUSIONGEMMA_MODEL_ID,
  DEFAULT_DIFFUSION_PARAMS,
  MAX_BLOCK_TOKENS,
} from './diffusiongemma.js';
export type {
  DiffusionGemmaSpec,
  DiffusionDecodeParams,
  DiffusionGemmaThroughput,
  DiffusionGemmaClientOptions,
} from './diffusiongemma.js';

// Re-export model selector
export {
  selectModel,
  getModelSelectionSummary,
  estimateLocalModelDiskUsage,
  AGENT_TIER_MAP,
  MODEL_CATALOG,
  ACER_GN100_BUDGET,
} from './model-selector.js';
export type { ModelTier } from './types.js';
export type { ModelOption, ModelSelection, EdgeResourceBudget } from './model-selector.js';

// Re-export sandbox isolation module
export { executeIsolatedAgent, getAgentFoundryConfig, getSandboxStage } from '../sandbox/index.js';
