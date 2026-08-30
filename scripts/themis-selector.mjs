#!/usr/bin/env node
// Evidence: Tool=Claude-Code Model=claude-haiku-4-5 Agent=claude-code Date=2026-08-27
// Audit trail: git log -- scripts/themis-selector.mjs

/**
 * Themis Agent Selector
 *
 * Intelligent workload routing: selects best agent for each session
 * based on workload type, agent health, and availability
 */

import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const REGISTRY_FILE = join(process.cwd(), '.themis/registry/agents.json');

// Workload type classifier
function classifyWorkload(session) {
  const { title, event_count, duration_hours, branch, repository } = session;

  // Long interactive sessions → Claude Code CLI
  if (duration_hours > 2 || event_count > 1000) {
    return { type: 'INTERACTIVE_CODING', confidence: 0.92 };
  }

  // Code review keywords
  if (title && title.match(/review|pull request|pr|audit|check/i)) {
    return { type: 'CODE_REVIEW', confidence: 0.88 };
  }

  // Security/compliance
  if (title && title.match(/security|compliance|vulnerability|audit|scan/i)) {
    return { type: 'SECURITY_CHECK', confidence: 0.85 };
  }

  // Batch processing
  if (title && title.match(/batch|process|validate|test|build/i)) {
    return { type: 'BATCH_VALIDATION', confidence: 0.8 };
  }

  // Data pipeline
  if (title && title.match(/ingest|pipeline|data|migrate|import/i)) {
    return { type: 'DATA_PIPELINE', confidence: 0.78 };
  }

  // Default: interactive
  return { type: 'INTERACTIVE_CODING', confidence: 0.6 };
}

// Score agent for workload
function scoreAgent(agent, workload, workloadType) {
  let score = 0;

  // Capability match (40%)
  const capabilityMatches = agent.capabilities.filter((cap) =>
    workload.capabilities?.includes(cap),
  ).length;
  const capabilityScore = capabilityMatches > 0 ? 100 : 0;
  score += capabilityScore * 0.4;

  // Agent type preference (30%)
  let typeScore = 0;
  if (workloadType === 'INTERACTIVE_CODING' && agent.type === 'interactive') typeScore = 100;
  else if (workloadType === 'CODE_REVIEW' && agent.type === 'review') typeScore = 100;
  else if (workloadType === 'SECURITY_CHECK' && agent.type === 'review') typeScore = 90;
  else if (workloadType === 'BATCH_VALIDATION' && agent.type === 'batch') typeScore = 100;
  else if (workloadType === 'DATA_PIPELINE' && agent.type === 'skill') typeScore = 95;
  else if (
    agent.type === 'skill' &&
    agent.capabilities.some((c) => c.includes(workloadType.toLowerCase()))
  )
    typeScore = 80;

  score += typeScore * 0.3;

  // Cost (15%)
  const costScore = agent.cost_per_token === 0 ? 100 : 50;
  score += costScore * 0.15;

  // Reliability (15%)
  const reliabilityScore = agent.success_rate * 100;
  score += reliabilityScore * 0.15;

  return score;
}

// Select best agent for workload
function selectAgent(session, registry) {
  const workload = classifyWorkload(session);

  // Map workload type to capability requirements
  const capabilityMap = {
    INTERACTIVE_CODING: ['code-edit', 'debug', 'test', 'git'],
    CODE_REVIEW: ['code-review', 'bug-detection'],
    SECURITY_CHECK: ['security-audit', 'compliance'],
    BATCH_VALIDATION: ['validation', 'code-review'],
    DATA_PIPELINE: ['data-pipeline', 'processing'],
  };

  workload.capabilities = capabilityMap[workload.type] || [];

  // Score all healthy agents
  const candidates = registry.agents
    .filter((a) => a.health?.status !== 'DEAD')
    .map((agent) => ({
      agent,
      score: scoreAgent(agent, workload, workload.type),
    }))
    .sort((a, b) => b.score - a.score);

  if (candidates.length === 0) {
    throw new Error('No healthy agents available');
  }

  const primary = candidates[0];
  const fallbacks = candidates.slice(1, 3);

  return {
    workload_type: workload.type,
    confidence: workload.confidence,
    primary: {
      agent_id: primary.agent.id,
      agent_name: primary.agent.name,
      platform: primary.agent.platform,
      endpoint: primary.agent.endpoint,
      score: primary.score.toFixed(2),
    },
    fallbacks: fallbacks.map((f) => ({
      agent_id: f.agent.id,
      agent_name: f.agent.name,
      platform: f.agent.platform,
      score: f.score.toFixed(2),
    })),
  };
}

// Main
function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  if (!command || command === '--help' || command === '-h') {
    console.log(`
Themis Agent Selector - Intelligent Workload Routing

Usage:
  themis-selector.mjs select <session-json>
  themis-selector.mjs classify <session-json>
  themis-selector.mjs routes

Examples:
  echo '{"title":"Fix bug","event_count":500}' | node themis-selector.mjs select
  node themis-selector.mjs select '{"title":"Code review PR","event_count":100}'
`);
    process.exit(0);
  }

  // Load registry
  const registryData = JSON.parse(readFileSync(REGISTRY_FILE, 'utf8'));
  const registry = registryData;

  if (command === 'select') {
    const sessionJson = args[1] || '';
    if (!sessionJson) {
      console.error('Error: session JSON required');
      process.exit(1);
    }

    try {
      const session = JSON.parse(sessionJson);
      const result = selectAgent(session, registry);
      console.log(JSON.stringify(result, null, 2));
    } catch (e) {
      console.error('Error:', e.message);
      process.exit(1);
    }
  } else if (command === 'classify') {
    const sessionJson = args[1] || '';
    if (!sessionJson) {
      console.error('Error: session JSON required');
      process.exit(1);
    }

    try {
      const session = JSON.parse(sessionJson);
      const workload = classifyWorkload(session);
      console.log(JSON.stringify(workload, null, 2));
    } catch (e) {
      console.error('Error:', e.message);
      process.exit(1);
    }
  } else if (command === 'routes') {
    console.log('📊 Available Routes by Workload Type:\n');

    const workloadTypes = [
      'INTERACTIVE_CODING',
      'CODE_REVIEW',
      'SECURITY_CHECK',
      'BATCH_VALIDATION',
      'DATA_PIPELINE',
    ];

    for (const type of workloadTypes) {
      const candidates = registry.agents
        .filter((a) => a.health?.status !== 'DEAD')
        .sort((a, b) => b.success_rate - a.success_rate)
        .slice(0, 3);

      console.log(`${type}:`);
      candidates.forEach((agent, i) => {
        console.log(
          `  ${i + 1}. ${agent.name} (${agent.platform}) - ${(agent.success_rate * 100).toFixed(0)}% success`,
        );
      });
      console.log('');
    }
  } else {
    console.error(`Unknown command: ${command}`);
    process.exit(1);
  }
}

main();
