/**
 * SEO & Workflow Agent Tests — Coverage for SEO pipeline and workflow orchestrators
 *
 * Tests: keyword-intent, seo-audit, competitor-surveillance, content-brief,
 * lead-feedback, atlas, athena, hephaestus, iris, mercury, apollo,
 * and industry specialists (vulcan, helios, neptune, ceres, prometheus, mars, bess, gaia).
 *
 * Does NOT require LLM or Supabase.
 */

import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { AgentContext } from '../agents/types.js';

// Mock global fetch to prevent real HTTP calls (SEO agents fetch URLs)
vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
  ok: true,
  status: 200,
  text: async () => '<html><head><title>Mock</title></head><body>Mock page</body></html>',
  json: async () => ({}),
  headers: new Headers({ 'content-type': 'text/html' }),
}));

vi.mock('../agents/base.agent.js', () => ({
  BaseAgent: class {
    config: any;
    constructor(config: any) { this.config = config; }
    getConfig() { return this.config; }
    async logExecution() {}
    async callLLM() {
      return {
        content: JSON.stringify({ recommendations: ['Mock'] }),
        model: 'mock',
        inputTokens: 0,
        outputTokens: 0,
      };
    }
    async runLoop() {
      return {
        content: JSON.stringify({
          findings: [{ agent: 'mock', urgency: 'medium', finding: 'Mock finding' }],
          summary: 'Mock atlas summary',
        }),
        model: 'mock',
        inputTokens: 0,
        outputTokens: 0,
        iterations: [
          { phase: 'act', actions: [{ name: 'compliance' }] },
          { phase: 'observe', actions: [] },
        ],
        totalTokens: { input: 100, output: 50 },
      };
    }
  },
}));

vi.mock('../agents/index.js', () => ({
  agentRegistry: {
    executeAgent: vi.fn().mockResolvedValue({
      agentName: 'mock-agent',
      result: { score: 75 },
      confidence: 0.8,
      reasoning: 'Mock',
      recommendations: ['Mock rec'],
      metadata: {},
    }),
    getAgent: vi.fn().mockReturnValue(null),
    listAgents: vi.fn().mockReturnValue([]),
    discoverAgents: vi.fn().mockReturnValue([]),
  },
}));

const ctx: AgentContext = {
  userId: 'test', orgId: 'test', sessionId: 'test', projectId: 'test',
};

// ============ SEO AGENTS ============

describe('KeywordIntent Agent', () => {
  let agent: any;

  beforeEach(async () => {
    const mod = await import('../agents/seo/keyword-intent.agent.js');
    agent = new mod.KeywordIntentAgent();
  });

  it('should classify TOFU keyword intent', async () => {
    const result = await agent.execute(ctx, {
      searchConsoleData: {
        queries: [
          { query: 'what is csrd', clicks: 10, impressions: 100, ctr: 0.1, position: 8 },
        ],
        dateRange: { start: '2024-01-01', end: '2024-12-31' },
        siteUrl: 'https://dws10.com',
      },
      icpProfile: {
        industries: ['manufacturing'],
        companySize: 'large',
        regions: ['EU'],
        painPoints: ['compliance'],
        regulations: ['csrd'],
      },
    });

    expect(result.agentName).toBe('keyword-intent');
    expect(result.confidence).toBeGreaterThan(0);
  });

  it('should detect quick-win keywords (position 8-15)', async () => {
    const result = await agent.execute(ctx, {
      searchConsoleData: {
        queries: [
          { query: 'csrd reporting tool', clicks: 5, impressions: 200, ctr: 0.025, position: 12 },
        ],
        dateRange: { start: '2024-01-01', end: '2024-12-31' },
        siteUrl: 'https://dws10.com',
      },
      icpProfile: {
        industries: ['manufacturing'],
        companySize: 'mid-market',
        regions: ['EU'],
        painPoints: ['reporting'],
        regulations: ['csrd'],
      },
    });

    expect(result.agentName).toBe('keyword-intent');
  });
});

describe('SeoAudit Agent', () => {
  let agent: any;

  beforeEach(async () => {
    const mod = await import('../agents/seo/seo-audit.agent.js');
    agent = new mod.SeoAuditAgent();
  });

  it('should audit site pages for deploy check', async () => {
    const result = await agent.execute(ctx, {
      site: {
        baseUrl: 'https://dws10.com',
        pages: ['/', '/products', '/blog'],
      },
      scope: 'deploy-check',
    });

    expect(result.agentName).toBe('seo-audit');
    expect(result.confidence).toBeGreaterThan(0);
  });
});

describe('CompetitorSurveillance Agent', () => {
  let agent: any;

  beforeEach(async () => {
    const mod = await import('../agents/seo/competitor-surveillance.agent.js');
    agent = new mod.CompetitorSurveillanceAgent();
  });

  it('should analyze competitor vs own content', async () => {
    const result = await agent.execute(ctx, {
      competitors: [
        {
          id: 'comp-1',
          name: 'CompetitorCo',
          domain: 'competitor.com',
          category: 'direct',
          trackingUrls: ['https://competitor.com/products'],
          lastCrawlDate: '2024-01-01',
          lastCrawlHash: 'abc123',
        },
      ],
      ownContent: [
        {
          url: 'https://dws10.com/products',
          title: 'Our Products',
          keywords: ['compliance', 'eu'],
          lastUpdated: '2024-01-01',
          wordCount: 1000,
        },
      ],
      targetClusters: { csrd: ['csrd', 'sustainability reporting'] },
    });

    expect(result.agentName).toBe('competitor-surveillance');
    expect(result.confidence).toBeGreaterThan(0);
    // 15s: this test times out at the default 5s when the box is under
    // concurrent agent load (batch worker + sessions); logic itself is fast.
  }, 15000);
});

describe('ContentBrief Agent', () => {
  let agent: any;

  beforeEach(async () => {
    const mod = await import('../agents/seo/content-brief.agent.js');
    agent = new mod.ContentBriefAgent();
  });

  it('should generate content brief for MOFU keyword', async () => {
    const result = await agent.execute(ctx, {
      targetKeyword: {
        keyword: 'how to comply with csrd',
        funnelStage: 'mofu',
        searchVolume: 500,
        cluster: 'csrd',
        suggestedContentType: 'blog',
      },
      lwmContext: {
        regulations: [
          { name: 'CSRD', relevantArticles: ['Article 8'], keyRequirements: ['double materiality'] },
        ],
        industries: [
          { name: 'manufacturing', complianceRequirements: ['emissions tracking'], dwsSolutions: ['compliance-hub'] },
        ],
      },
      relevantProducts: [
        { name: 'Compliance Hub', sku: 'COMP-001', price: '5000', features: ['csrd tracking'], ctaUrl: 'https://dws10.com/products/compliance' },
      ],
    });

    expect(result.agentName).toBe('content-brief');
    expect(result.confidence).toBeGreaterThan(0);
  });
});

describe('LeadFeedback Agent', () => {
  let agent: any;

  beforeEach(async () => {
    const mod = await import('../agents/seo/lead-feedback.agent.js');
    agent = new mod.LeadFeedbackAgent();
  });

  it('should analyze closed-won deal attribution', async () => {
    const result = await agent.execute(ctx, {
      closedWonDeals: [
        {
          dealId: 'deal-1',
          companyName: 'Manufacturing Co',
          industry: 'manufacturing',
          dealSize: 50000,
          closedDate: '2024-01-15',
          attribution: { channel: 'organic', landingPage: 'https://dws10.com/csrd' },
          buyerLanguage: ['compliance', 'reporting'],
          painPoints: ['emissions tracking'],
          products: [{ sku: 'COMP-001', name: 'Compliance Hub', price: 5000 }],
        },
      ],
      currentKeywords: [
        { keyword: 'csrd', funnelStage: 'mofu', compositeScore: 75 },
      ],
      contentPerformance: [
        { url: 'https://dws10.com/csrd', organicSessions: 1000, conversions: 10, conversionRate: 0.01, avgTimeOnPage: 120, bounceRate: 0.4 },
      ],
    });

    expect(result.agentName).toBe('lead-feedback');
    expect(result.confidence).toBeGreaterThan(0);
  });
});

// ============ WORKFLOW ORCHESTRATION AGENTS ============

describe('Atlas Agent (Workflow Orchestrator)', () => {
  let agent: any;

  beforeEach(async () => {
    const mod = await import('../agents/workflow/atlas/atlas.agent.js');
    agent = new mod.AtlasAgent();
  });

  it('should accept briefing query', async () => {
    const result = await agent.execute(ctx, {
      query: 'What is our compliance status?',
    });

    expect(result.agentName).toBe('atlas');
    expect(result.confidence).toBeGreaterThan(0);
  });
});

describe('Athena Agent', () => {
  let agent: any;

  beforeEach(async () => {
    const mod = await import('../agents/workflow/athena/athena.agent.js');
    agent = new mod.AthenaAgent();
  });

  it('should execute with basic input', async () => {
    const result = await agent.execute(ctx, {
      query: 'Analyze strategic positioning',
    });

    expect(result.agentName).toBe('athena');
    expect(result.confidence).toBeGreaterThan(0);
  });
});

describe('Hephaestus Agent', () => {
  let agent: any;

  beforeEach(async () => {
    const mod = await import('../agents/workflow/hephaestus/hephaestus.agent.js');
    agent = new mod.HephaestusAgent();
  });

  it('should execute with basic input', async () => {
    const result = await agent.execute(ctx, {
      query: 'Build infrastructure assessment',
    });

    expect(result.agentName).toBe('hephaestus');
    expect(result.confidence).toBeGreaterThan(0);
  });
});

describe('Iris Agent', () => {
  let agent: any;

  beforeEach(async () => {
    const mod = await import('../agents/workflow/iris/iris.agent.js');
    agent = new mod.IrisAgent();
  });

  it('should execute with basic input', async () => {
    const result = await agent.execute(ctx, {
      query: 'Monitor system health',
    });

    expect(result.agentName).toBe('iris');
    expect(result.confidence).toBeGreaterThan(0);
  });
});

describe('Mercury Agent', () => {
  let agent: any;

  beforeEach(async () => {
    const mod = await import('../agents/workflow/mercury/mercury.agent.js');
    agent = new mod.MercuryAgent();
  });

  it('should execute with basic input', async () => {
    const result = await agent.execute(ctx, {
      query: 'Coordinate communication workflow',
    });

    expect(result.agentName).toBe('mercury');
    expect(result.confidence).toBeGreaterThan(0);
  });
});

describe('Apollo Agent', () => {
  let agent: any;

  beforeEach(async () => {
    const mod = await import('../agents/workflow/apollo/apollo.agent.js');
    agent = new mod.ApolloAgent();
  });

  it('should execute sales workflow', async () => {
    const result = await agent.execute(ctx, {
      query: 'Run sales outreach pipeline',
    });

    expect(result.agentName).toBe('apollo');
    expect(result.confidence).toBeGreaterThan(0);
  });
});

// ============ INDUSTRY SPECIALIST AGENTS ============

describe('Vulcan Agent (Manufacturing)', () => {
  let agent: any;

  beforeEach(async () => {
    const mod = await import('../agents/workflow/industry/vulcan.agent.js');
    agent = new mod.VulcanAgent();
  });

  it('should execute manufacturing assessment', async () => {
    const result = await agent.execute(ctx, {
      query: 'Assess manufacturing compliance',
      industry: 'manufacturing',
    });

    expect(result.agentName).toBe('vulcan');
    expect(result.confidence).toBeGreaterThan(0);
  });
});

describe('Helios Agent (Energy)', () => {
  let agent: any;

  beforeEach(async () => {
    const mod = await import('../agents/workflow/industry/helios.agent.js');
    agent = new mod.HeliosAgent();
  });

  it('should execute energy sector assessment', async () => {
    const result = await agent.execute(ctx, {
      query: 'Assess energy sector compliance',
      industry: 'energy',
    });

    expect(result.agentName).toBe('helios');
    expect(result.confidence).toBeGreaterThan(0);
  });
});

describe('Neptune Agent (Maritime)', () => {
  let agent: any;

  beforeEach(async () => {
    const mod = await import('../agents/workflow/industry/neptune.agent.js');
    agent = new mod.NeptuneAgent();
  });

  it('should execute maritime assessment', async () => {
    const result = await agent.execute(ctx, {
      query: 'Assess maritime compliance',
      industry: 'maritime',
    });

    expect(result.agentName).toBe('neptune');
    expect(result.confidence).toBeGreaterThan(0);
  });
});

describe('Ceres Agent (Agriculture)', () => {
  let agent: any;

  beforeEach(async () => {
    const mod = await import('../agents/workflow/industry/ceres.agent.js');
    agent = new mod.CeresAgent();
  });

  it('should execute agriculture assessment', async () => {
    const result = await agent.execute(ctx, {
      query: 'Assess agricultural compliance',
      industry: 'agriculture',
    });

    expect(result.agentName).toBe('ceres');
    expect(result.confidence).toBeGreaterThan(0);
  });
});

describe('Prometheus Agent (Chemicals)', () => {
  let agent: any;

  beforeEach(async () => {
    const mod = await import('../agents/workflow/industry/prometheus.agent.js');
    agent = new mod.PrometheusAgent();
  });

  it('should execute chemicals sector assessment', async () => {
    const result = await agent.execute(ctx, {
      query: 'Assess chemicals compliance',
      industry: 'chemicals',
    });

    expect(result.agentName).toBe('prometheus');
    expect(result.confidence).toBeGreaterThan(0);
  });
});

describe('Mars Agent (Defense)', () => {
  let agent: any;

  beforeEach(async () => {
    const mod = await import('../agents/workflow/industry/mars.agent.js');
    agent = new mod.MarsAgent();
  });

  it('should execute defense sector assessment', async () => {
    const result = await agent.execute(ctx, {
      query: 'Assess defense compliance',
      industry: 'defense',
    });

    expect(result.agentName).toBe('mars');
    expect(result.confidence).toBeGreaterThan(0);
  });
});

describe('BESS Agent (Battery Storage)', () => {
  let agent: any;

  beforeEach(async () => {
    const mod = await import('../agents/workflow/industry/bess.agent.js');
    agent = new mod.BESSAgent();
  });

  it('should execute battery storage quick estimate', async () => {
    const result = await agent.execute(ctx, {
      quickEstimate: { energyMwh: 100, country: 'FI', roundtripEfficiency: 0.9 },
    });

    expect(result.agentName).toBe('bess');
    expect(result.confidence).toBeGreaterThanOrEqual(0.6);
  });
});

describe('Gaia Agent (Forestry)', () => {
  let agent: any;

  beforeEach(async () => {
    const mod = await import('../agents/workflow/industry/gaia.agent.js');
    agent = new mod.GaiaAgent();
  });

  it('should execute forestry assessment', async () => {
    const result = await agent.execute(ctx, {
      query: 'Assess forestry compliance',
      industry: 'forestry',
    });

    expect(result.agentName).toBe('gaia');
    expect(result.confidence).toBeGreaterThan(0);
  });
});
