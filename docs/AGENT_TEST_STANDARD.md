# Agent Test Standard

***
# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:
  - Version: 1.0 | Tool: Claude Code (Opus 4.6) | Session: claude/investigate-dws-firehorse-4ARWp | Date: 22.03.2026 | Changes: Initial creation — agent maturity audit, test coverage gap analysis, deterministic test patterns

Session Links & References:
  - Claude Code (claude/investigate-dws-firehorse-4ARWp): https://claude.ai/code/session_018pqP3JqwSgXCefc5o65CRN

Document Status:
  - Created: 22.03.2026
  - Last Modified: 22.03.2026
  - Language: English
  - Languages Available: EN
  - Publication Status: ACTIVE

***

---

## Table of Contents

1. [Purpose](#1-purpose)
2. [Agent Maturity Audit Results](#2-agent-maturity-audit-results)
3. [Test Coverage Gap Analysis](#3-test-coverage-gap-analysis)
4. [Test Architecture](#4-test-architecture)
5. [Test Patterns](#5-test-patterns)
6. [Agent Classification Criteria](#6-agent-classification-criteria)
7. [Deterministic Test Catalog](#7-deterministic-test-catalog)
8. [Running Tests](#8-running-tests)
9. [Adding Tests for New Agents](#9-adding-tests-for-new-agents)
10. [Known Issues and Gaps](#10-known-issues-and-gaps)

---

## 1. Purpose

This document establishes the testing standard for all DWS IQ 6 AI agents. It captures:

- The March 2026 maturity audit results (what's real, what's skeleton)
- Test coverage gaps (92% of agents were untested)
- Required test patterns for deterministic agent logic
- How to add tests when creating new agents

**Rule:** Every agent shipping to production MUST have at least one deterministic test that does NOT require LLM or Supabase.

---

## 2. Agent Maturity Audit Results

Audit performed 22.03.2026 across all 37 agents in `src/agents/`.

### Classification

| Rating | Count | Meaning |
|--------|-------|---------|
| STRONG | 14 | Real deterministic logic + LLM augmentation + proper error handling |
| ADEQUATE | 3 | Works but had gaps (fixed in this PR) |
| WEAK | 0 | — |
| STUB | 0 | — |
| NOT AUDITED | 20 | Workflow + industry + SEO agents (pattern assumed from atlas.agent.ts) |

### Agent Ratings (Post-Fix)

| Agent | File | Rating | Key Strength |
|-------|------|--------|-------------|
| customer-sat | `customer-sat.agent.ts` | STRONG | Weighted churn prediction (NPS, tickets, interaction, contract, tenure) |
| sitesense | `sitesense.agent.ts` | STRONG | EU safety thresholds (EN 13001, VNa 205/2009), weather scoring |
| material-oracle | `material-oracle.agent.ts` | STRONG | EN 15978 lifecycle carbon, ICE Database v3 emission factors |
| viability | `viability.agent.ts` | STRONG | ROI, NPV, IRR, carbon credit valuation (3 ETS price scenarios) |
| schedule-genius | `schedule-genius.agent.ts` | STRONG | Critical Path Method (forward/backward pass, slack) |
| compliance | `compliance.agent.ts` | STRONG | Scoring engine integration, 5 EU regulations, cost estimation |
| quality-gate | `quality-gate.agent.ts` | STRONG | Multi-target deployment scoring (GCP 70%, CF 50%, Hetzner 60%) |
| sovereignty-monitor | `sovereignty-monitor.agent.ts` | STRONG | CLOUD Act detection, RLS coverage, GDPR readiness |
| compliance-researcher | `compliance-researcher.agent.ts` | STRONG | 7 EU regulation knowledge bases, research depth levels |
| deepwiki-extractor | `deepwiki-extractor.agent.ts` | STRONG | Repo analysis, bacterial code pattern (Karpathy) |
| emissions-data-analyst | `emissions-data-analyst.agent.ts` | STRONG | CSRD thresholds, Scope 1/2/3, unit normalization |
| keyword-intent | `keyword-intent.agent.ts` | STRONG | TOFU/MOFU/BOFU funnel classification, quick-win detection |
| atlas | `workflow/atlas/atlas.agent.ts` | STRONG | Agentic loop, real delegation, synthesis |
| construction | `construction.agent.ts` | STRONG (fixed) | Real sub-agent delegation to SiteSense + MaterialOracle |
| logistics | `logistics.agent.ts` | STRONG (fixed) | Real delegation to EmissionsDataAnalyst |
| sales-outreach | `sales-outreach.agent.ts` | STRONG (fixed) | 15 curated real EU target companies replacing placeholder fakes |
| argus | `argus.agent.ts` | ADEQUATE | SAR signatures for 20 industries; ICEYE API calls not implemented |
| designer | `designer.agent.ts` | ADEQUATE | Design tokens + complexity classification; code generation delegates to LLM |

### Fixes Applied (This PR)

| Agent | Problem | Fix |
|-------|---------|-----|
| construction | `runFullAssessment()` never called sub-agents — `agentOrchestration` was documentation-only | Added `AgentRegistry.executeAgent()` calls to SiteSense + MaterialOracle in parallel |
| logistics | Same pattern — claimed orchestration but called 0 sub-agents | Added delegation to EmissionsDataAnalyst for Scope 3 transport |
| sales-outreach | `generatePlaceholderCompanies()` returned `[Target Company 1]` fakes | Replaced with 15 real EU companies (NCC, YIT, SSAB, Neste, etc.) with relevance scoring |

---

## 3. Test Coverage Gap Analysis

### Before This PR

| Category | Agents | Tested | Gap |
|----------|--------|--------|-----|
| Root agents | 17 | 3 | 82% |
| Workflow agents | 14 | 0 | 100% |
| SEO agents | 5 | 0 | 100% |
| **Total** | **37** | **3** | **92%** |

### After This PR

| Category | Agents | Tested | Gap |
|----------|--------|--------|-----|
| Root agents | 17 | 17 | 0% |
| Workflow agents | 14 | 14 | 0% |
| SEO agents | 5 | 5 | 0% |
| **Total** | **36** | **36** | **0%** |

### Test Files

| File | Agents Tested | Cases | Type |
|------|---------------|-------|------|
| `horizontal-agents.test.ts` | customer-sat, sitesense, material-oracle, viability, quality-gate, sovereignty-monitor | 13 | Deterministic |
| `remaining-agents.test.ts` | schedule-genius, argus, designer, deepwiki-extractor, compliance-researcher, construction, logistics | 15 | Deterministic + delegation |
| `seo-workflow-agents.test.ts` | keyword-intent, seo-audit, competitor-surveillance, content-brief, lead-feedback, atlas, athena, hephaestus, iris, hermes, apollo, vulcan, helios, neptune, ceres, prometheus, mars, bess, gaia | 21 | Schema validation + execution |
| `compliance-agent-integration.test.ts` | compliance | 8 | Integration (mocked LLM) |
| `emissions-data-analyst-unit-normalization.test.ts` | emissions-data-analyst | 6 | Deterministic |
| `sales-outreach-input-compat.test.ts` | sales-outreach | 2 | Input compatibility |

### Coverage Summary

All 36 agents (excluding abstract BaseAgent) now have at least one test. Total: 65 agent test cases across 6 test files.

---

## 4. Test Architecture

### Principles

1. **Test deterministic logic, not LLM output** — Agent scoring, thresholds, calculations, and state machines are deterministic. Test those.
2. **Mock BaseAgent infrastructure** — `logExecution()` and `callLLM()` require Supabase/Groq. Mock them.
3. **No network dependency** — Tests must pass offline (no API calls).
4. **Fast execution** — All agent tests should complete in < 5 seconds.

### Mock Pattern

```typescript
vi.mock('../agents/base.agent.js', () => {
  return {
    BaseAgent: class MockBaseAgent {
      config: any;
      constructor(config: any) { this.config = config; }
      getConfig() { return this.config; }
      async logExecution() { /* no-op */ }
      async callLLM() {
        return {
          content: JSON.stringify({ recommendations: ['Mock'] }),
          model: 'mock',
          inputTokens: 0,
          outputTokens: 0,
        };
      }
    },
  };
});
```

This mock:
- Removes Supabase dependency (no execution logging)
- Returns predictable LLM output (JSON with recommendations)
- Preserves the agent's config system

---

## 5. Test Patterns

### Pattern 1: Deterministic Scoring Test

Tests that an agent's scoring formula produces expected results for known inputs.

```typescript
it('should score customer with high NPS as low churn risk', async () => {
  const result = await agent.execute(mockContext, {
    customerId: 'cust-001',
    nps: 9,
    ticketCount: 1,
    interactionFrequency: 'weekly',
    contractValue: 50000,
    tenure: 24,
  });

  expect(result.agentName).toBe('customer-sat');
  expect(result.confidence).toBeGreaterThan(0.5);
  const sat = result.result.satisfaction as number;
  expect(sat).toBeGreaterThan(70);
});
```

### Pattern 2: Threshold/Boundary Test

Tests that EU regulatory thresholds trigger correct behavior.

```typescript
it('should flag high wind as unsafe (EN 13001 crane threshold)', async () => {
  const result = await agent.execute(mockContext, {
    windSpeed: 25, // Above EN 13001 ~20 m/s crane limit
    // ...
  });

  const score = result.result.safetyScore as number;
  expect(score).toBeLessThan(70);
  expect(result.recommendations.some(
    (r: string) => r.toLowerCase().includes('wind')
  )).toBe(true);
});
```

### Pattern 3: Graceful Degradation Test

Tests that agents handle missing/unknown input without crashing.

```typescript
it('should handle unknown materials with conservative estimate', async () => {
  const result = await agent.execute(mockContext, {
    materials: [{ name: 'exotic_composite_xyz', quantity: 10, unit: 'tonnes' }],
  });

  expect(result.result).toHaveProperty('totalCarbonKg');
  expect(result.confidence).toBeLessThan(0.9);
});
```

### Pattern 4: Sub-Agent Delegation Test

Tests that orchestration agents actually delegate (requires mocking the registry).

```typescript
it('should delegate to SiteSense on full-assessment', async () => {
  // Mock AgentRegistry to track delegation calls
  const delegateSpy = vi.fn().mockResolvedValue({
    agentName: 'sitesense',
    result: { safetyScore: 85 },
    confidence: 0.9,
    reasoning: 'Mock',
    recommendations: [],
  });

  // Inject mock registry...
  const result = await agent.execute(context, {
    action: 'full-assessment',
    site: { windSpeed: 10 },
  });

  expect(delegateSpy).toHaveBeenCalledWith('sitesense', expect.anything(), expect.anything());
});
```

---

## 6. Agent Classification Criteria

### STRONG

All of the following:
- Deterministic scoring/calculation logic (not pure LLM)
- Input validation (throws on bad input)
- Proper error handling (try/catch, returns error AgentResponse)
- Execution logging (calls `logExecution()`)
- Typed interfaces for input/output
- Confidence calculation based on data quality
- At least 1 deterministic test

### ADEQUATE

Missing one or more of:
- Real sub-agent delegation (claims orchestration but calls local handlers only)
- Deterministic data source (uses LLM to generate data that should be factual)
- Test coverage

### WEAK

Mostly or entirely LLM-dependent with no deterministic business logic.

### STUB

Structure exists but execute() is not implemented or returns hardcoded data.

---

## 7. Deterministic Test Catalog

### What to Test Per Agent Type

| Agent Type | Must Test | Example |
|------------|----------|---------|
| Scoring agent | Formula produces correct score for boundary inputs | SiteSense: wind > 20 m/s = score < 70 |
| Calculator agent | Math is correct for known values | MaterialOracle: 100t concrete = ~13,000-16,000 kgCO2e |
| Compliance agent | Regulation thresholds trigger correctly | ETS: > 25,000 tCO2e = ETS scope |
| Orchestration agent | Delegates to sub-agents, merges results | Construction: full-assessment calls SiteSense + MaterialOracle |
| Research agent | Knowledge base lookups return correct data | ComplianceResearcher: CSRD has correct effective date |
| Quality gate agent | Pass/fail thresholds work correctly | QualityGate: security scan fail = score < 80 |

### Boundary Values (EU Regulation)

| Threshold | Value | Source | Agent |
|-----------|-------|--------|-------|
| ETS emissions | 25,000 tCO2e/year | EU ETS Directive | compliance |
| CBAM import | €150,000 | Regulation 2023/956 | compliance |
| EN 13001 crane wind | ~20 m/s | EN 13001-2 | sitesense |
| VNa 205/2009 cold | -25°C | Finnish regulation | sitesense |
| CSRD employee threshold | 250 employees | CSRD Directive | compliance |
| ADR driver license | Required for hazmat | ADR 2023 | logistics |
| EC 561/2006 driving time | 9h/day, 56h/week | EC Regulation | logistics |

---

## 8. Running Tests

```bash
# All tests
npm run test

# Agent tests only
npx vitest run src/__tests__/horizontal-agents.test.ts
npx vitest run src/__tests__/compliance-agent-integration.test.ts

# Watch mode
npx vitest watch src/__tests__/horizontal-agents.test.ts

# With coverage
npx vitest run --coverage
```

### CI/CD

Agent tests run in `.github/workflows/` on every PR. They do NOT require:
- Supabase connection
- Groq/Anthropic API keys
- Docker containers
- Network access

---

## 9. Adding Tests for New Agents

When creating a new agent (`src/agents/your-agent.agent.ts`):

1. **Write deterministic logic first** — scoring, thresholds, calculations
2. **Add test file** — `src/__tests__/your-agent.test.ts`
3. **Use the mock pattern** from Section 4
4. **Test at minimum:**
   - Happy path (good input → expected score)
   - Boundary values (threshold inputs)
   - Bad input handling (missing fields, invalid values)
   - Confidence calculation (data quality affects confidence)
5. **Register in this document** — add to Section 2 agent ratings table

### Test File Template

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { AgentContext } from '../agents/types.js';

vi.mock('../agents/base.agent.js', () => ({
  BaseAgent: class {
    config: any;
    constructor(config: any) { this.config = config; }
    getConfig() { return this.config; }
    async logExecution() {}
    async callLLM() {
      return { content: '{}', model: 'mock', inputTokens: 0, outputTokens: 0 };
    }
  },
}));

const ctx: AgentContext = {
  userId: 'test', orgId: 'test', sessionId: 'test', projectId: 'test',
};

describe('YourAgent', () => {
  let agent: any;

  beforeEach(async () => {
    const mod = await import('../agents/your-agent.agent.js');
    agent = new mod.YourAgent();
  });

  it('should return correct score for known input', async () => {
    const result = await agent.execute(ctx, { /* input */ });
    expect(result.agentName).toBe('your-agent');
    expect(result.confidence).toBeGreaterThan(0);
    // Assert deterministic logic
  });
});
```

---

## 10. Known Issues and Gaps

### Remaining Test Gaps

| Priority | Gap | Impact |
|----------|-----|--------|
| MEDIUM | Workflow agent tests are basic (schema validation only) | Deep orchestration logic not verified |
| MEDIUM | No sub-agent delegation end-to-end test (real registry) | Delegation tested with mock registry only |
| LOW | argus ICEYE API calls not implemented | SAR labeling is specification only |
| LOW | designer code generation delegates entirely to LLM | No deterministic output verification |

### Agent Infrastructure Issues

| Issue | Status | Notes |
|-------|--------|-------|
| `agentOrchestration` was documentation, not code | **FIXED** | Construction + logistics now delegate via registry |
| Placeholder companies in sales-outreach | **FIXED** | Replaced with 15 real EU companies |
| BaseAgent mock doesn't test governance engine | KNOWN | Governance policies (rate-limit, cost-limit) untested |
| No performance benchmarks | KNOWN | No tests for agent execution time |

---

*Generated by DWS IQ 6 Agent Test Standard v1.0*
*Lifetime Oy — 2026*
