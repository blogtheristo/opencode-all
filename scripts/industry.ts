#!/usr/bin/env tsx
/**
 * Industry Tools CLI — productizes the Phase 2 builtins as a command path with
 * structured JSON output (Agent Productization Rule, CLAUDE.md).
 *
 * The MCP/agent exposure of these capabilities is already satisfied: both tools
 * are registered in the agent runtime (src/agents/industry-tools.ts) and are
 * callable by any agent and via delegate_to_agent. This CLI adds the human /
 * scripting entry point over the same pure functions — no logic is duplicated.
 *
 * Usage:
 *   tsx scripts/industry.ts profile <id|name> [--json]
 *   tsx scripts/industry.ts metrics <metric> key=value [key=value ...] [--json]
 *   tsx scripts/industry.ts metrics --list [--json]
 *
 * Examples:
 *   tsx scripts/industry.ts profile aviation
 *   tsx scripts/industry.ts profile 5 --json
 *   tsx scripts/industry.ts metrics saf_blend_gap year=2031 actualBlendPct=4
 *   tsx scripts/industry.ts metrics pue_wue totalFacilityEnergyKWh=150 itEnergyKWh=100 --json
 */

import { lookupIndustryProfile, computeSectorMetric } from '../src/agents/industry-tools.js';

const argv = process.argv.slice(2);
const jsonOut = argv.includes('--json');
const args = argv.filter((a) => a !== '--json');
const [command, ...rest] = args;

/** Print a result as pretty JSON (always) or a compact human line. */
function emit(result: unknown, human: () => string): void {
  if (jsonOut) {
    console.log(JSON.stringify(result, null, 2));
  } else {
    console.log(human());
  }
}

function fail(message: string): never {
  if (jsonOut) {
    console.log(JSON.stringify({ error: message }, null, 2));
  } else {
    console.error(`Error: ${message}`);
  }
  process.exit(1);
}

function runProfile(): void {
  const target = rest[0];
  if (!target) fail('Usage: profile <id|name> [--json]');
  const asId = Number(target);
  const result = Number.isInteger(asId)
    ? lookupIndustryProfile({ industryId: asId })
    : lookupIndustryProfile({ industry: target });

  if ('error' in result) fail(result.error);
  emit(result.profile, () => {
    const p = result.profile;
    return [
      `#${p.id} ${p.name} (tier ${p.tier}, hat: ${p.captainHat})`,
      `  dedicated agent: ${p.dedicatedAgent ?? 'none — universal analyst'}`,
      `  regulations:     ${p.primaryRegulations.join(', ')}`,
      `  emission sources:${' '}${p.keyEmissionSources.join(', ')}`,
      `  coverage gap:    ${p.coverageGap}`,
    ].join('\n');
  });
}

function runMetrics(): void {
  if (rest[0] === '--list' || rest.length === 0) {
    // Probe with an unknown metric to retrieve the available list deterministically.
    const probe = computeSectorMetric('__list__', {});
    const available = 'availableMetrics' in probe ? probe.availableMetrics : [];
    emit({ availableMetrics: available }, () => `metrics:\n  ${available.join('\n  ')}`);
    return;
  }

  const metric = rest[0];
  const inputs: Record<string, number> = {};
  for (const pair of rest.slice(1)) {
    const eq = pair.indexOf('=');
    if (eq === -1) fail(`Bad input "${pair}" — expected key=value`);
    const key = pair.slice(0, eq);
    const value = Number(pair.slice(eq + 1));
    if (!Number.isFinite(value)) fail(`Input "${key}" is not a number`);
    inputs[key] = value;
  }

  const result = computeSectorMetric(metric, inputs);
  if ('error' in result) fail(`${result.error}\nAvailable: ${result.availableMetrics.join(', ')}`);
  emit(result, () => {
    const vals = Object.entries(result.values)
      .map(([k, v]) => `  ${k} = ${v}`)
      .join('\n');
    return `${result.metric} (${result.unit})\n${vals}\n  formula: ${result.formula}\n  sources: ${result.sources.join('; ')}`;
  });
}

switch (command) {
  case 'profile':
    runProfile();
    break;
  case 'metrics':
    runMetrics();
    break;
  default:
    fail('Usage: industry.ts <profile|metrics> ... [--json]');
}
