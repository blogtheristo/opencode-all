/**
 * NemoClaw Engines — DWS Skilled-Agent Compositions (DWS IQ 6 Agent Integration)
 *
 * Breadth layer on top of nemoclaw-skill-host.ts: defines the "engineer"
 * personas a NemoClaw harness composes from DWS Skilled Agents, mirroring the
 * src/agents/workflow/ orchestrators (athena/hephaestus/mercury/iris/apollo).
 *
 * Each engine is a whitelist of DWS agent skills. buildEngineHost() wires the
 * named agents from the agent registry into a single governed NemoClawSkillHost
 * (one host == one auditable workflow trace), reusing the host's ATS gate,
 * sandbox tiering, inbound sanitization, and Article-12 step log.
 *
 * See docs/design/nemoclaw-agent-workflows.md §6 (orchestrator → engine map).
 */

import logger from '../utils/logger.js';
import { NemoClawSkillHost, type SkillHostOptions } from './nemoclaw-skill-host.js';
import type { BaseAgent } from '../agents/base.agent.js';

/** Minimal lookup contract — satisfied by the AgentRegistry (src/agents/index.ts). */
export interface AgentLookup {
  getAgent(name: string): BaseAgent | undefined;
}

/** Definition of one NemoClaw "engineer" persona. */
export interface EngineDefinition {
  /** NemoClaw engineer persona name. */
  engineer: string;
  /** The DWS workflow orchestrator this engine mirrors. */
  orchestrator: string;
  /** Human-readable purpose. */
  description: string;
  /** DWS agent names (== skill names) this engine composes. */
  skills: string[];
  /**
   * Optional per-engine ATS floor for the whole workflow. When set, overrides
   * each agent's phase-derived minimum (see NemoClawSkillHost).
   */
  minimumATS?: number;
}

/**
 * The engineer roster. Leaf engineers only — atlas is a meta-synthesizer that
 * composes the others' outputs and is intentionally not a flat skill engine.
 */
export const NEMOCLAW_ENGINES: Record<string, EngineDefinition> = {
  athena: {
    engineer: 'compliance-engineer',
    orchestrator: 'athena',
    description:
      'Deadline-first EU regulatory assessment (ETS, CBAM, CSRD, Fit for 55, EU AI Act).',
    skills: ['compliance', 'compliance-researcher'],
  },
  hephaestus: {
    engineer: 'site-safety-engineer',
    orchestrator: 'hephaestus',
    description: 'Parallel site safety, material carbon, and schedule-risk assessment.',
    skills: ['sitesense', 'material-oracle', 'schedule-genius'],
  },
  mercury: {
    engineer: 'operations-engineer',
    orchestrator: 'mercury',
    description: 'Supply-chain optimization, schedule risk, and quality-gate assessment.',
    skills: ['logistics', 'schedule-genius', 'quality-gate'],
  },
  iris: {
    engineer: 'research-engineer',
    orchestrator: 'iris',
    description: 'Competitor surveillance, regulatory extraction, and keyword/market research.',
    skills: ['competitor-surveillance', 'deepwiki-extractor', 'keyword-intent'],
  },
  apollo: {
    engineer: 'outreach-engineer',
    orchestrator: 'apollo',
    description: 'B2B content strategy, sales-outreach sequencing, and SEO for regulatory buyers.',
    skills: ['sales-outreach', 'content-brief', 'seo-audit'],
  },
};

export interface BuildEngineResult {
  /** The configured, governed skill host for this engine. */
  host: NemoClawSkillHost;
  /** The engine definition used. */
  definition: EngineDefinition;
  /** Skill names successfully wired from the registry. */
  registered: string[];
  /** Skill names declared by the engine but absent from the registry (fail loud). */
  missing: string[];
}

/**
 * Build a governed NemoClawSkillHost for one engineer persona by wiring its
 * agents from the registry. Missing agents are surfaced (never silently
 * dropped) — the host is whitelisted to the engine's declared skills only.
 */
export function buildEngineHost(
  engineKey: string,
  lookup: AgentLookup,
  opts: Omit<SkillHostOptions, 'allowedSkills'> = {},
): BuildEngineResult {
  const definition = NEMOCLAW_ENGINES[engineKey];
  if (!definition) {
    const available = Object.keys(NEMOCLAW_ENGINES).join(', ');
    throw new Error(`Unknown NemoClaw engine "${engineKey}". Available: ${available}`);
  }

  const host = new NemoClawSkillHost({ ...opts, allowedSkills: definition.skills });
  const registered: string[] = [];
  const missing: string[] = [];

  for (const skill of definition.skills) {
    const agent = lookup.getAgent(skill);
    if (!agent) {
      missing.push(skill);
      logger.warn('NemoClaw engine: declared skill missing from registry', {
        engine: engineKey,
        engineer: definition.engineer,
        skill,
      });
      continue;
    }
    host.registerAgentSkill(
      agent,
      definition.minimumATS !== undefined ? { minimumATS: definition.minimumATS } : {},
    );
    registered.push(skill);
  }

  logger.info('NemoClaw engine built', {
    engine: engineKey,
    engineer: definition.engineer,
    registered: registered.length,
    missing: missing.length,
  });

  return { host, definition, registered, missing };
}
