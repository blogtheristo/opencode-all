#!/usr/bin/env node
// Evidence: Tool=Claude-Code Model=claude-haiku-4-5 Agent=claude-code Date=2026-08-27
// Audit trail: git log -- scripts/themis-discover.mjs

/**
 * Themis Agent Discovery
 *
 * Scans DWS6 repository for all agents:
 * - Core processing agents (Claude Code, OpenCode, Copilot, Cursor, DGX Ollama)
 * - Specialist agents (skills/)
 * - Review & validation agents
 * - Infrastructure & orchestration agents
 *
 * Outputs: .themis/registry/agents.json with 50+ agent metadata
 */

import { existsSync, readFileSync, writeFileSync, readdirSync, mkdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';

const REPO_ROOT = process.cwd();
const THEMIS_DIR = join(REPO_ROOT, '.themis');
const REGISTRY_DIR = join(THEMIS_DIR, 'registry');
const AGENTS_JSON = join(REGISTRY_DIR, 'agents.json');

// Agent definitions
const CORE_AGENTS = [
  {
    id: 'agent_001',
    name: 'Claude Code CLI',
    type: 'interactive',
    platform: 'claude-code',
    capabilities: ['code-edit', 'debug', 'test', 'repl', 'git'],
    max_concurrent: 1,
    endpoint: 'stdio://localhost',
    protocol: 'stdio',
    timeout_ms: 300000,
    cost_per_token: 0,
    avg_latency_ms: 500,
    success_rate: 0.99,
    version: 'CLI-1.0.0',
    owner: 'engineering',
  },
  {
    id: 'agent_002',
    name: 'OpenCode Batch Worker',
    type: 'batch',
    platform: 'opencode',
    capabilities: ['code-review', 'validation', 'merge', 'batch-processing'],
    max_concurrent: 16,
    endpoint: 'http://localhost:8080/batch',
    protocol: 'http',
    timeout_ms: 600000,
    cost_per_token: 0,
    avg_latency_ms: 15000,
    success_rate: 0.97,
    version: '1.0.0',
    owner: 'infrastructure',
  },
  {
    id: 'agent_003',
    name: 'Copilot GitHub CLI',
    type: 'interactive',
    platform: 'copilot',
    capabilities: ['code-edit', 'git', 'recovery'],
    max_concurrent: 2,
    endpoint: 'vs-code://copilot',
    protocol: 'stdio',
    timeout_ms: 300000,
    cost_per_token: 0,
    avg_latency_ms: 800,
    success_rate: 0.95,
    version: 'Copilot-latest',
    owner: 'engineering',
  },
  {
    id: 'agent_004',
    name: 'Cursor IDE',
    type: 'interactive',
    platform: 'cursor',
    capabilities: ['code-edit', 'debug', 'test', 'git'],
    max_concurrent: 1,
    endpoint: 'cursor://localhost',
    protocol: 'stdio',
    timeout_ms: 300000,
    cost_per_token: 0,
    avg_latency_ms: 600,
    success_rate: 0.96,
    version: 'Cursor-latest',
    owner: 'engineering',
  },
  {
    id: 'agent_005',
    name: 'DGX Ollama Local',
    type: 'reasoning',
    platform: 'dsx',
    capabilities: ['inference', 'reasoning', 'embeddings'],
    max_concurrent: 8,
    endpoint: 'http://localhost:11434',
    protocol: 'http',
    timeout_ms: 120000,
    cost_per_token: 0,
    avg_latency_ms: 2000,
    success_rate: 0.98,
    version: 'Ollama-0.1.0',
    owner: 'infrastructure',
  },
];

// Specialist agents (from skills/)
function discoverSkillAgents() {
  const skillsDir = join(REPO_ROOT, 'skills');
  const agents = [];

  if (!existsSync(skillsDir)) {
    return agents;
  }

  const skills = readdirSync(skillsDir).filter((f) => {
    const path = join(skillsDir, f);
    return statSync(path).isDirectory();
  });

  // Map known skills to agent definitions
  const skillMap = {
    autoresearch: { type: 'skill', capabilities: ['research', 'analysis'] },
    'brain-ops': { type: 'skill', capabilities: ['memory-management', 'context'] },
    clawdbot: { type: 'skill', capabilities: ['session-management', 'cleanup'] },
    'compliance-check': { type: 'skill', capabilities: ['compliance', 'security'] },
    'cron-scheduler': { type: 'skill', capabilities: ['scheduling', 'automation'] },
    'daily-task-manager': { type: 'skill', capabilities: ['task-management'] },
    'design-first': { type: 'skill', capabilities: ['design-validation'] },
    'dream-on': { type: 'skill', capabilities: ['experimentation'] },
    enrich: { type: 'skill', capabilities: ['data-enrichment'] },
    'firehorse-report': { type: 'skill', capabilities: ['reporting', 'thesis'] },
    'gcr-skill': { type: 'skill', capabilities: ['cloud-registry'] },
    'hilma-watch': { type: 'skill', capabilities: ['monitoring', 'regulatory'] },
    'human-capital': { type: 'skill', capabilities: ['analytics', 'hr'] },
    ingest: { type: 'skill', capabilities: ['data-pipeline', 'ingestion'] },
    kb: { type: 'skill', capabilities: ['knowledge-retrieval'] },
    kya: { type: 'skill', capabilities: ['compliance', 'verification'] },
    learn: { type: 'skill', capabilities: ['learning', 'improvement'] },
    'lsj-publish': { type: 'skill', capabilities: ['publishing', 'legal'] },
    maintain: { type: 'skill', capabilities: ['maintenance', 'ops'] },
    'material-oracle': { type: 'skill', capabilities: ['supply-chain'] },
    'mgd-report': { type: 'skill', capabilities: ['reporting'] },
    multilingual: { type: 'skill', capabilities: ['translation', 'localization'] },
    'ollama-spark': { type: 'skill', capabilities: ['local-inference'] },
    'outreach-agents': { type: 'skill', capabilities: ['outreach', 'sales'] },
    'product-page-polish': { type: 'skill', capabilities: ['optimization', 'design'] },
    'promote-proposal': { type: 'skill', capabilities: ['proposal-management'] },
    query: { type: 'skill', capabilities: ['database', 'querying'] },
    reports: { type: 'skill', capabilities: ['reporting', 'aggregation'] },
    risto: { type: 'skill', capabilities: ['crm', 'contact-management'] },
    'signal-detector': { type: 'skill', capabilities: ['signal-detection', 'market'] },
    sitesense: { type: 'skill', capabilities: ['analytics', 'monitoring'] },
    'soul-audit': { type: 'skill', capabilities: ['values-alignment'] },
    'supermetrics-seo-sync': { type: 'skill', capabilities: ['seo', 'metrics'] },
    swarm: { type: 'skill', capabilities: ['multi-agent-coordination'] },
    'token-capital': { type: 'skill', capabilities: ['token-economics'] },
    'train-model': { type: 'skill', capabilities: ['model-training'] },
    'truth-check': { type: 'skill', capabilities: ['fact-verification'] },
  };

  let agentId = 6;
  for (const skill of skills) {
    if (skillMap[skill]) {
      const def = skillMap[skill];
      agents.push({
        id: `agent_${String(agentId).padStart(3, '0')}`,
        name: skill,
        type: def.type,
        platform: 'themis',
        capabilities: def.capabilities,
        max_concurrent: 4,
        endpoint: `skill://${skill}`,
        protocol: 'events',
        timeout_ms: 180000,
        cost_per_token: 0,
        avg_latency_ms: 5000,
        success_rate: 0.94,
        version: '1.0.0',
        owner: 'engineering',
      });
      agentId++;
    }
  }

  return agents;
}

// Review & validation agents
const REVIEW_AGENTS = [
  {
    id: 'agent_044',
    name: 'Code Reviewer',
    type: 'review',
    platform: 'themis',
    capabilities: ['code-review', 'bug-detection', 'quality-assurance'],
    max_concurrent: 8,
    endpoint: 'skill://code-reviewer',
    protocol: 'events',
    timeout_ms: 300000,
    cost_per_token: 0,
    avg_latency_ms: 8000,
    success_rate: 0.96,
    version: '1.0.0',
    owner: 'engineering',
  },
  {
    id: 'agent_045',
    name: 'Security Reviewer',
    type: 'review',
    platform: 'themis',
    capabilities: ['security-audit', 'vulnerability-detection', 'compliance'],
    max_concurrent: 4,
    endpoint: 'skill://security-reviewer',
    protocol: 'events',
    timeout_ms: 300000,
    cost_per_token: 0,
    avg_latency_ms: 10000,
    success_rate: 0.97,
    version: '1.0.0',
    owner: 'security',
  },
  {
    id: 'agent_046',
    name: 'Compliance Review',
    type: 'review',
    platform: 'themis',
    capabilities: ['compliance-check', 'standards-verification'],
    max_concurrent: 4,
    endpoint: 'skill://compliance-review',
    protocol: 'events',
    timeout_ms: 180000,
    cost_per_token: 0,
    avg_latency_ms: 6000,
    success_rate: 0.95,
    version: '1.0.0',
    owner: 'compliance',
  },
  {
    id: 'agent_047',
    name: 'QA Automation',
    type: 'review',
    platform: 'themis',
    capabilities: ['testing', 'qa', 'validation'],
    max_concurrent: 8,
    endpoint: 'skill://qa-skill',
    protocol: 'events',
    timeout_ms: 600000,
    cost_per_token: 0,
    avg_latency_ms: 20000,
    success_rate: 0.93,
    version: '1.0.0',
    owner: 'qa',
  },
  {
    id: 'agent_048',
    name: 'Verify Gate',
    type: 'review',
    platform: 'themis',
    capabilities: ['pre-merge-verification', 'gate-enforcement'],
    max_concurrent: 4,
    endpoint: 'skill://verify-gate',
    protocol: 'events',
    timeout_ms: 180000,
    cost_per_token: 0,
    avg_latency_ms: 5000,
    success_rate: 0.98,
    version: '1.0.0',
    owner: 'engineering',
  },
  {
    id: 'agent_049',
    name: 'Design Validation',
    type: 'review',
    platform: 'themis',
    capabilities: ['design-review', 'ui-validation'],
    max_concurrent: 4,
    endpoint: 'skill://design-validation',
    protocol: 'events',
    timeout_ms: 300000,
    cost_per_token: 0,
    avg_latency_ms: 8000,
    success_rate: 0.94,
    version: '1.0.0',
    owner: 'design',
  },
  {
    id: 'agent_050',
    name: 'Security Validation',
    type: 'review',
    platform: 'themis',
    capabilities: ['security-validation', 'penetration-testing'],
    max_concurrent: 2,
    endpoint: 'skill://security-validation',
    protocol: 'events',
    timeout_ms: 300000,
    cost_per_token: 0,
    avg_latency_ms: 12000,
    success_rate: 0.96,
    version: '1.0.0',
    owner: 'security',
  },
  {
    id: 'agent_051',
    name: 'Performance Reviewer',
    type: 'review',
    platform: 'themis',
    capabilities: ['performance-benchmarking', 'optimization'],
    max_concurrent: 4,
    endpoint: 'skill://performance-reviewer',
    protocol: 'events',
    timeout_ms: 600000,
    cost_per_token: 0,
    avg_latency_ms: 25000,
    success_rate: 0.92,
    version: '1.0.0',
    owner: 'engineering',
  },
];

// Infrastructure/Orchestration agents
const INFRASTRUCTURE_AGENTS = [
  {
    id: 'agent_052',
    name: 'Loop',
    type: 'orchestrator',
    platform: 'themis',
    capabilities: ['task-looping', 'iteration'],
    max_concurrent: 16,
    endpoint: 'skill://loop',
    protocol: 'events',
    timeout_ms: 600000,
    cost_per_token: 0,
    avg_latency_ms: 1000,
    success_rate: 0.99,
    version: '1.0.0',
    owner: 'infrastructure',
  },
  {
    id: 'agent_053',
    name: 'Schedule',
    type: 'orchestrator',
    platform: 'themis',
    capabilities: ['cron-scheduling', 'temporal-execution'],
    max_concurrent: 8,
    endpoint: 'skill://schedule',
    protocol: 'events',
    timeout_ms: 60000,
    cost_per_token: 0,
    avg_latency_ms: 500,
    success_rate: 0.99,
    version: '1.0.0',
    owner: 'infrastructure',
  },
  {
    id: 'agent_054',
    name: 'Workflow',
    type: 'orchestrator',
    platform: 'themis',
    capabilities: ['workflow-orchestration', 'multi-agent-coordination'],
    max_concurrent: 8,
    endpoint: 'skill://workflow',
    protocol: 'events',
    timeout_ms: 600000,
    cost_per_token: 0,
    avg_latency_ms: 2000,
    success_rate: 0.97,
    version: '1.0.0',
    owner: 'infrastructure',
  },
  {
    id: 'agent_055',
    name: 'Clawdbot',
    type: 'orchestrator',
    platform: 'themis',
    capabilities: ['session-management', 'queue-processing', 'cleanup'],
    max_concurrent: 2,
    endpoint: 'skill://clawdbot',
    protocol: 'events',
    timeout_ms: 300000,
    cost_per_token: 0,
    avg_latency_ms: 3000,
    success_rate: 0.96,
    version: '1.0.0',
    owner: 'infrastructure',
  },
  {
    id: 'agent_056',
    name: 'Remote Control',
    type: 'orchestrator',
    platform: 'themis',
    capabilities: ['remote-invocation', 'distributed-execution'],
    max_concurrent: 16,
    endpoint: 'skill://remote-control',
    protocol: 'http',
    timeout_ms: 120000,
    cost_per_token: 0,
    avg_latency_ms: 1000,
    success_rate: 0.95,
    version: '1.0.0',
    owner: 'infrastructure',
  },
];

function initializeRegistry() {
  // Create directories
  mkdirSync(THEMIS_DIR, { recursive: true });
  mkdirSync(REGISTRY_DIR, { recursive: true });

  console.log('🔍 Themis Agent Discovery - Phase 1 Day 1');
  console.log('='.repeat(50));

  // Collect all agents
  const skillAgents = discoverSkillAgents();
  const allAgents = [...CORE_AGENTS, ...skillAgents, ...REVIEW_AGENTS, ...INFRASTRUCTURE_AGENTS];

  console.log(`\n📦 Agents discovered: ${allAgents.length}`);
  console.log(`  • Core processing: ${CORE_AGENTS.length}`);
  console.log(`  • Specialist skills: ${skillAgents.length}`);
  console.log(`  • Review & validation: ${REVIEW_AGENTS.length}`);
  console.log(`  • Infrastructure: ${INFRASTRUCTURE_AGENTS.length}`);

  // Normalize IDs to ensure no conflicts
  const agents = allAgents.map((agent, index) => ({
    ...agent,
    id: `agent_${String(index + 1).padStart(3, '0')}`,
  }));

  // Add health status
  const now = new Date().toISOString();
  const registryData = {
    version: '1.0.0',
    timestamp: now,
    total_agents: agents.length,
    agents: agents.map((agent) => ({
      ...agent,
      health: {
        status: 'UNKNOWN',
        last_check: null,
        uptime_percent: null,
      },
    })),
  };

  // Write registry
  writeFileSync(AGENTS_JSON, JSON.stringify(registryData, null, 2));

  console.log(`\n✅ Registry created: ${AGENTS_JSON}`);
  console.log(`   Size: ${(statSync(AGENTS_JSON).size / 1024).toFixed(1)} KB`);

  // Create summary
  console.log('\n📋 Agent Summary by Type:');
  const byType = {};
  agents.forEach((a) => {
    byType[a.type] = (byType[a.type] || 0) + 1;
  });

  for (const [type, count] of Object.entries(byType).sort()) {
    console.log(`  ${type.padEnd(15)} : ${count} agents`);
  }

  console.log('\n📍 Agent Summary by Platform:');
  const byPlatform = {};
  agents.forEach((a) => {
    byPlatform[a.platform] = (byPlatform[a.platform] || 0) + 1;
  });

  for (const [platform, count] of Object.entries(byPlatform).sort()) {
    console.log(`  ${platform.padEnd(15)} : ${count} agents`);
  }

  // Print capability index
  console.log('\n🎯 Top Capabilities:');
  const capabilityCount = {};
  agents.forEach((a) => {
    a.capabilities.forEach((cap) => {
      capabilityCount[cap] = (capabilityCount[cap] || 0) + 1;
    });
  });

  const topCaps = Object.entries(capabilityCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  for (const [cap, count] of topCaps) {
    console.log(`  ${cap.padEnd(30)} : ${count} agents`);
  }

  console.log('\n' + '='.repeat(50));
  console.log('✨ Phase 1 Day 1 Complete: Agent Discovery');
  console.log(`\nNext: Implement agent selector and health checks`);
  console.log(`Registry location: ${AGENTS_JSON}`);

  return registryData;
}

// Run discovery
const result = initializeRegistry();
process.exit(0);
