import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import {
  getIndustryById,
  getIndustryByName,
  INDUSTRIES_SERVED_TOTAL,
  industriesWithoutDedicatedAgent,
  INDUSTRY_REGISTRY,
} from '../../agents/data/industry-registry.js';
import { IndustryAnalystAgent } from '../../agents/industry-analyst.agent.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const industriesJsonPath = resolve(__dirname, '../../../dws10.com/config/industries.json');

const context = {
  projectId: 'test-project',
  userId: 'test-user',
  orgId: 'test-org',
  sessionId: 'test-session',
};

describe('industry-registry — canonical non-drift', () => {
  const canonical = JSON.parse(readFileSync(industriesJsonPath, 'utf-8'));

  it('serves exactly the canonical industriesServedTotal (25)', () => {
    expect(INDUSTRIES_SERVED_TOTAL).toBe(25);
    expect(INDUSTRY_REGISTRY.length).toBe(canonical.summary.industriesServedTotal);
  });

  it('has unique, contiguous ids 1..25', () => {
    const ids = INDUSTRY_REGISTRY.map((p) => p.id).sort((a, b) => a - b);
    expect(ids).toEqual(Array.from({ length: 25 }, (_, i) => i + 1));
  });

  it('matches canonical industry names from captainHats + platform-only list', () => {
    // Build canonical id→name map from both sources in industries.json.
    const canonNames = new Map<number, string>();
    for (const hat of canonical.captainHats ?? []) {
      for (const i of hat.industriesCovered ?? []) canonNames.set(i.industryId, i.industryName);
    }
    for (const p of canonical.platformIndustriesWithoutDedicatedCaptainHat ?? []) {
      canonNames.set(p.industryId, p.industryName);
    }
    for (const profile of INDUSTRY_REGISTRY) {
      expect(canonNames.get(profile.id), `id ${profile.id}`).toBe(profile.name);
    }
  });

  it('every profile has non-empty regulations and decarbonization levers', () => {
    for (const p of INDUSTRY_REGISTRY) {
      expect(p.primaryRegulations.length, p.name).toBeGreaterThan(0);
      expect(p.decarbonizationLevers.length, p.name).toBeGreaterThan(0);
      expect(p.dwsOffering.length, p.name).toBeGreaterThan(0);
    }
  });

  it('identifies the 12 industries without a dedicated agent as the coverage gap', () => {
    const gap = industriesWithoutDedicatedAgent().map((p) => p.name);
    expect(gap).toContain('Aviation');
    expect(gap).toContain('Data Centres');
    expect(gap).toContain('Financial Services');
    expect(gap.length).toBe(12);
  });
});

describe('industry-registry — resolution', () => {
  it('resolves by id', () => {
    expect(getIndustryById(5)?.name).toBe('Aviation');
    expect(getIndustryById(999)).toBeUndefined();
  });

  it('resolves by canonical name, alias, and fuzzy substring', () => {
    expect(getIndustryByName('Aviation')?.id).toBe(5);
    expect(getIndustryByName('steel')?.id).toBe(2);
    expect(getIndustryByName('datacenter')?.id).toBe(24);
    expect(getIndustryByName('banking')?.id).toBe(20);
    expect(getIndustryByName('  ')).toBeUndefined();
  });

  it('returns undefined for single-character queries (short-query guard)', () => {
    // Single chars are too ambiguous for fuzzy matching and must not return a
    // random first-array-position match.
    expect(getIndustryByName('a')).toBeUndefined();
    expect(getIndustryByName('e')).toBeUndefined();
    expect(getIndustryByName('i')).toBeUndefined();
  });

  it('resolves via fuzzy substring fallback for unrecognised multi-char input', () => {
    // "onstruct" is not a canonical name or alias but is a substring of "Construction & Buildings".
    expect(getIndustryByName('onstruct')?.id).toBe(8);
    // "E-Fuels" is a substring of "RFNBO / Green H2 & E-Fuels" (id 25).
    expect(getIndustryByName('E-Fuels')?.id).toBe(25);
  });

  it('industriesWithoutDedicatedAgent returns a readonly array with 12 entries', () => {
    const list = industriesWithoutDedicatedAgent();
    expect(list.length).toBe(12);
    // Confirm the reference is stable across repeated calls (precomputed).
    expect(industriesWithoutDedicatedAgent()).toBe(list);
  });
});

describe('IndustryAnalystAgent', () => {
  const agent = new IndustryAnalystAgent();

  it('returns a valid AgentResponse for a gap industry (Aviation) without LLM/Supabase', async () => {
    const res = await agent.execute(context, { industryId: 5 });
    expect(res.agentName).toBe('industry-analyst');
    expect(res.result.industry).toBe('Aviation');
    expect(res.result.hasDedicatedAgent).toBe(false);
    expect(res.confidence).toBeGreaterThanOrEqual(0);
    expect(res.confidence).toBeLessThanOrEqual(1);
    expect(Array.isArray(res.recommendations)).toBe(true);
    // Falls back to registry levers when the LLM is unavailable.
    expect((res.result.prioritizedLevers as string[]).length).toBeGreaterThan(0);
  });

  it('recommends the dedicated specialist when one exists (steel → vulcan)', async () => {
    const res = await agent.execute(context, { industry: 'steel' });
    expect(res.result.industry).toBe('Iron & Steel Production');
    expect(res.result.dedicatedAgent).toBe('vulcan');
    expect(res.recommendations.some((r) => /vulcan/.test(r))).toBe(true);
  });

  it('returns a recognizable error for an unknown industry', async () => {
    const res = await agent.execute(context, { industry: 'underwater basket weaving' });
    expect(res.confidence).toBe(0);
    expect(res.result.error).toBe('Industry not recognized');
  });
});
