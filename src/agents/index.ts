/**
 * Agent Registry - Central registration and discovery for all DWS IQ 6 agents
 *
 * Provides:
 * - getAgent(name) - retrieve a specific agent instance
 * - listAgents()   - list all registered agent configs
 * - executeAgent() - execute an agent by name with context and input
 *
 * All seven production agents are registered on module load.
 */

import logger from '../utils/logger.js';
import { BaseAgent } from './base.agent.js';
import { SiteSenseAgent } from './sitesense.agent.js';
import { ScheduleGeniusAgent } from './schedule-genius.agent.js';
import { MaterialOracleAgent } from './material-oracle.agent.js';
import { CustomerSatAgent } from './customer-sat.agent.js';
import { ViabilityAgent } from './viability.agent.js';
import { ComplianceAgent } from './compliance.agent.js';
import { QualityGateAgent } from './quality-gate.agent.js';
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
    this.register(new SiteSenseAgent());
    this.register(new ScheduleGeniusAgent());
    this.register(new MaterialOracleAgent());
    this.register(new CustomerSatAgent());
    this.register(new ViabilityAgent());
    this.register(new ComplianceAgent());
    this.register(new QualityGateAgent());

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
