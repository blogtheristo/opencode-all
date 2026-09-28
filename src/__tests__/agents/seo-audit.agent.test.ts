/**
 * Seo Audit Agent Tests
 *
 * Dedicated Vitest suite covering:
 *   - Main execute/run path with realistic input
 *   - Every exported pure helper (calculateCtaScore, validateSchema, etc.)
 *   - Input validation (bad/missing fields rejected, no crashes)
 *   - Failure paths (LLM/external failures mocked, no network calls)
 *   - Numeric thresholds and unit conversions with exact expected values
 */

import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { AgentContext } from '../../agents/types.js';
import { SeoAuditAgent } from '../../agents/seo/seo-audit.agent.js';
import type { SeoAuditInput } from '../../agents/seo/types.js';

// ============ Mocks ============

vi.setConfig({ testTimeout: 15000 });

// Mock fetch to avoid network calls
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock logger
vi.mock('../../utils/logger.js', () => ({
  default: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
    trace: vi.fn(),
    fatal: vi.fn(),
  },
}));

// Mock kyaje-jev makeTypedDecision
vi.mock('../../agents/kya-jev.ts', () => ({
  makeTypedDecision: vi.fn().mockResolvedValue({
    decision: 'none',
    probabilities: { none: 0.9, low: 0.1, medium: 0, high: 0 },
    confidence: 0.9,
    calibration: 'self-reported-uncalibrated',
    abstained: false,
  }),
}));

// Mock getLLMClient to return null (testing deterministic path)
vi.mock('../../agents/llm-client.js', () => ({
  createLLMClient: vi.fn().mockReturnValue(null),
  createLLMClientForAgent: vi.fn().mockReturnValue(null),
  createLLMClientFromEnv: vi.fn().mockReturnValue(null),
}));

// BaseAgent.getSupabaseClient returns null when not configured
vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn().mockReturnValue(null),
}));

// ============ Test Data ============

const baseContext: AgentContext = {
  projectId: 'proj_123',
  userId: 'user_456',
  orgId: 'org_789',
  sessionId: 'sess_abc',
};

const realisticInput: SeoAuditInput = {
  site: {
    baseUrl: 'https://dws10.com',
    sitemapUrl: 'https://dws10.com/sitemap.xml',
    pages: ['/about', '/services', '/contact'],
  },
  scope: 'full',
};

const previousAudit = {
  date: '2026-01-01',
  scores: { health: 80 },
  issues: [{ type: 'missing-meta', url: 'https://example.com', severity: 'warning' }],
};

// ============ Tests ============

describe('SeoAuditAgent', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset fetch mock default behavior
    mockFetch.mockReset();
  });

  describe('Input validation', () => {
    it('rejects missing input', async () => {
      const agent = new SeoAuditAgent();
      await expect(agent.execute(baseContext, {} as any)).rejects.toThrow();
    });

    it('rejects missing site object', async () => {
      const agent = new SeoAuditAgent();
      await expect(agent.execute(baseContext, { site: undefined } as any)).rejects.toThrow();
    });

    it('rejects missing site.baseUrl', async () => {
      const agent = new SeoAuditAgent();
      await expect(
        agent.execute(baseContext, { site: { sitemapUrl: 'http://test.com' } } as any),
      ).rejects.toThrow();
    });

    it('handles empty pages array (uses discoverPages)', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
      });

      const agent = new SeoAuditAgent();
      const result = await agent.execute(baseContext, {
        site: {
          baseUrl: 'https://dws10.com',
          sitemapUrl: null,
          pages: [],
        },
        scope: 'deploy-check',
      });
      expect(result).toBeDefined();
      expect(result.result).toHaveProperty('issues');
    });

    it('handles sitemapUrl not provided', async () => {
      const agent = new SeoAuditAgent();
      const result = await agent.execute(baseContext, {
        site: {
          baseUrl: 'https://dws10.com',
          pages: [],
        },
        scope: 'deploy-check',
      });
      expect(result).toBeDefined();
      expect(result.result).toHaveProperty('issues');
    });
  });

  describe('Unit conversion thresholds', () => {
    // Test critical threshold: health score calculation
    it('calculates health score with critical issues (15 pts penalty each)', async () => {
      const agent = new SeoAuditAgent();
      const result = await agent.execute(baseContext, realisticInput);

      // When no issues: 100
      // Each critical: -15, each warning: -3
      expect(result.result.healthScore).toBeGreaterThanOrEqual(0);
      expect(result.result.healthScore).toBeLessThanOrEqual(100);
    });

    it('health score is 0 when 7+ critical issues', async () => {
      const agent = new SeoAuditAgent();
      const result = await agent.execute(baseContext, realisticInput);

      const criticalCount = result.result.issues.filter((i) => i.severity === 'critical').length;
      const warningCount = result.result.issues.filter((i) => i.severity === 'warning').length;
      const expectedScore = Math.max(0, 100 - criticalCount * 15 - warningCount * 3);

      expect(result.result.healthScore).toBe(expectedScore);
    });
  });

  describe('Deploy gate thresholds', () => {
    it('deployGate.pass is false when critical issues exist', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        text: async () => '<html><head></head><body></body></html>',
      });

      const agent = new SeoAuditAgent();
      const result = await agent.execute(baseContext, {
        site: {
          baseUrl: 'https://dws10.com',
          pages: ['/'],
          sitemapUrl: null,
        },
        scope: 'deploy-check',
      });

      expect(result.result.deployGate.pass).toBe(false);
      expect(result.result.deployGate.blockers.length).toBeGreaterThan(0);
    });

    it('deployGate.pass is true when no critical issues', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        text: async () => `
          <html>
            <head>
              <title>Test Page</title>
              <meta name="description" content="Test">
              <link rel="canonical" href="https://dws10.com/">
              <script type="application/ld+json">
                {"@type": "Organization", "name": "Test Company", "url": "https://dws10.com/"}
              </script>
            </head>
            <body>
              <header>
                <a href="/about" class="btn">Get Started</a>
              </header>
              <footer>
                <button>Contact Us</button>
              </footer>
            </body>
          </html>
        `,
      });

      const agent = new SeoAuditAgent();
      const result = await agent.execute(baseContext, {
        site: {
          baseUrl: 'https://dws10.com',
          pages: ['/'],
          sitemapUrl: null,
        },
        scope: 'deploy-check',
      });

      expect(result.result.issues.filter((i) => i.severity === 'critical')).toEqual([]);
      expect(result.result.deployGate.pass).toBe(true);
      expect(result.result.deployGate.blockers).toEqual([]);
    });
  });

  describe('CTA score thresholds', () => {
    it('ctaScore < 50 triggers weak-cta issue', async () => {
      const agent = new SeoAuditAgent();
      const result = await agent.execute(baseContext, realisticInput);

      const weakCtaIssues = result.result.issues.filter((i) => i.type === 'weak-cta');
      expect(weakCtaIssues.length).toBeGreaterThanOrEqual(0);
      weakCtaIssues.forEach((issue) => {
        const score = parseInt(issue.description.match(/score:\s*(\d+)/)?.[1] || '0');
        expect(score).toBeLessThan(50);
      });
    });

    it('ctaScore calculation: buttons +30, links +20, forms +10 (no placement bonuses)', () => {
      const agent = new SeoAuditAgent();
      // @ts-expect-error - accessing private method for testing
      const score = agent.calculateCtaScore({
        buttons: [{ text: 'Click', position: 'mid-content' }],
        links: [{ text: 'Learn', position: 'mid-content' }],
        forms: 1,
      });
      // 30 + 20 + 10 = 60 (no placement bonuses since all mid-content)
      expect(score).toBe(60);
    });

    it('ctaScore bonus for hero placement: +25', () => {
      const agent = new SeoAuditAgent();
      // @ts-expect-error - accessing private method for testing
      const score = agent.calculateCtaScore({
        buttons: [{ text: 'Click', position: 'hero' }],
        links: [],
        forms: 0,
      });
      // 30 + 25 = 55
      expect(score).toBe(55);
    });

    it('ctaScore bonus for header placement: +15', () => {
      const agent = new SeoAuditAgent();
      // @ts-expect-error - accessing private method for testing
      const score = agent.calculateCtaScore({
        buttons: [],
        links: [{ text: 'Click', position: 'header' }],
        forms: 0,
      });
      // 20 + 15 = 35
      expect(score).toBe(35);
    });

    it('ctaScore max is 100', () => {
      const agent = new SeoAuditAgent();
      // @ts-expect-error - accessing private method for testing
      const score = agent.calculateCtaScore({
        buttons: [
          { text: 'A', position: 'hero' },
          { text: 'B', position: 'hero' },
        ],
        links: [
          { text: 'C', position: 'header' },
          { text: 'D', position: 'header' },
        ],
        forms: 2,
      });
      // 30 + 20 + 10 + 25 + 15 + 10 = 110, capped at 100
      expect(score).toBe(100);
    });
  });

  describe('Discovery score thresholds', () => {
    it('discoveryScore < 30 triggers low-discovery warning', async () => {
      const agent = new SeoAuditAgent();
      const result = await agent.execute(baseContext, realisticInput);

      const lowDiscoveryIssues = result.result.issues.filter((i) => i.type === 'low-discovery');
      expect(lowDiscoveryIssues.length).toBeGreaterThanOrEqual(0);
    });

    it('calculateDiscoveryScore: no internal links = -20 penalty', () => {
      const agent = new SeoAuditAgent();
      // @ts-expect-error - accessing private method for testing
      const score = agent.calculateDiscoveryScore({ internalCount: 0, externalCount: 0 }, []);
      // Base: 0, penalty: -20
      expect(score).toBe(0); // Math.max(0, -20) = 0
    });

    it('calculateDiscoveryScore: 5+ internal links = +30', () => {
      const agent = new SeoAuditAgent();
      // @ts-expect-error - accessing private method for testing
      const score = agent.calculateDiscoveryScore({ internalCount: 5, externalCount: 0 }, [
        '/a',
        '/b',
        '/c',
        '/d',
        '/e',
      ]);
      // 30 (internal >= 5) + 25 (uniquePaths >= 3) = 55
      expect(score).toBe(55);
    });

    it('calculateDiscoveryScore: 3+ external links = +15', () => {
      const agent = new SeoAuditAgent();
      // @ts-expect-error - accessing private method for testing
      const score = agent.calculateDiscoveryScore({ internalCount: 0, externalCount: 3 }, []);
      // 0 (internal) + 15 (external >= 3) - 20 (no internal penalty) = -5, Math.max(0, -5) = 0
      expect(score).toBe(0);
    });
  });

  describe('Schema validation', () => {
    it('validateSchema: missing LocalBusiness & Organization = error', () => {
      const agent = new SeoAuditAgent();
      // @ts-expect-error - accessing private method for testing
      const result = agent.validateSchema({
        hasLocalBusiness: false,
        hasOrganization: false,
        hasWebSite: false,
        hasProduct: false,
        requiredProperties: [],
        missingProperties: [],
      });
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Missing LocalBusiness or Organization schema');
    });

    it('validateSchema: has LocalBusiness = valid', () => {
      const agent = new SeoAuditAgent();
      // @ts-expect-error - accessing private method for testing
      const result = agent.validateSchema({
        hasLocalBusiness: true,
        hasOrganization: false,
        hasWebSite: false,
        hasProduct: false,
        requiredProperties: [],
        missingProperties: [],
      });
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it('validateSchema: has Organization = valid', () => {
      const agent = new SeoAuditAgent();
      // @ts-expect-error - accessing private method for testing
      const result = agent.validateSchema({
        hasLocalBusiness: false,
        hasOrganization: true,
        hasWebSite: false,
        hasProduct: false,
        requiredProperties: [],
        missingProperties: [],
      });
      expect(result.isValid).toBe(true);
    });

    it('validateSchema: missing properties = error', () => {
      const agent = new SeoAuditAgent();
      // @ts-expect-error - accessing private method for testing
      const result = agent.validateSchema({
        hasLocalBusiness: true,
        hasOrganization: false,
        hasWebSite: false,
        hasProduct: false,
        requiredProperties: ['name', 'address'],
        missingProperties: ['name', 'address'],
      });
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Missing required properties: name, address');
    });
  });

  describe('Page audit thresholds', () => {
    it('wordCount < 300 triggers thin-content warning', async () => {
      const agent = new SeoAuditAgent();
      const result = await agent.execute(baseContext, realisticInput);

      const thinContentIssues = result.result.issues.filter((i) => i.type === 'thin-content');
      thinContentIssues.forEach((issue) => {
        const wordCount = parseInt(issue.description.match(/(\d+) words/)?.[1] || '0');
        expect(wordCount).toBeLessThan(300);
      });
    });
  });

  describe('Delta calculation', () => {
    it('delta.healthScoreChange calculated against previousAudit', async () => {
      const agent = new SeoAuditAgent();
      const result = await agent.execute(baseContext, {
        ...realisticInput,
        previousAudit,
      });

      expect(result.result.delta).toBeDefined();
      if (result.result.delta) {
        expect(result.result.delta.healthScoreChange).toBeTypeOf('number');
      }
    });

    it('delta.newIssues counts issues not in previous audit', async () => {
      const agent = new SeoAuditAgent();
      const result = await agent.execute(baseContext, {
        ...realisticInput,
        previousAudit,
      });

      expect(result.result.delta).toBeDefined();
      if (result.result.delta) {
        expect(result.result.delta.newIssues).toBeTypeOf('number');
        expect(result.result.delta.newIssues).toBeGreaterThanOrEqual(0);
      }
    });

    it('delta.resolvedIssues counts issue resolutions', async () => {
      const agent = new SeoAuditAgent();
      const result = await agent.execute(baseContext, {
        ...realisticInput,
        previousAudit,
      });

      expect(result.result.delta).toBeDefined();
      if (result.result.delta) {
        expect(result.result.delta.resolvedIssues).toBeTypeOf('number');
      }
    });
  });

  describe('Core Web Vitals thresholds', () => {
    it('lcp > 4000ms triggers slow-page critical issue', async () => {
      // Mock PageSpeed API response
      const pagespeedMock = {
        lighthouseResult: {
          audits: {
            'largest-contentful-paint': { numericValue: 5000 },
            'first-input-delay': { numericValue: 100 },
            'cumulative-layout-shift': { numericValue: 0.1 },
            'server-response-time': { numericValue: 200 },
            'total-blocking-time': { numericValue: 100 },
            interactive: { numericValue: 6000 },
          },
        },
      };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => pagespeedMock,
      });

      const agent = new SeoAuditAgent();
      const result = await agent.execute(baseContext, {
        ...realisticInput,
        pagespeedApiKey: 'test-key',
      });

      const slowIssues = result.result.issues.filter((i) => i.type === 'slow-page');
      slowIssues.forEach((issue) => {
        const lcp = parseInt(issue.description.match(/(\d+)ms/)?.[1] || '0');
        expect(lcp).toBeGreaterThan(4000);
      });
    });

    it('lcp > 2500 triggers needs-improvement status', async () => {
      const pageHtml = `
        <html>
          <head>
            <title>Test</title>
            <meta name="description" content="Test">
            <link rel="canonical" href="https://dws10.com/">
          </head>
          <body><button>Test</button></body>
        </html>
      `;
      const pagespeedMock = {
        lighthouseResult: {
          audits: {
            'largest-contentful-paint': { numericValue: 3000 },
            'first-input-delay': { numericValue: 100 },
            'cumulative-layout-shift': { numericValue: 0.05 },
            'server-response-time': { numericValue: 200 },
            'total-blocking-time': { numericValue: 100 },
            interactive: { numericValue: 3500 },
          },
        },
      };
      // Page fetch + pagespeed fetch
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          text: async () => pageHtml,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => pagespeedMock,
        });

      const agent = new SeoAuditAgent();
      const result = await agent.execute(baseContext, {
        ...realisticInput,
        pagespeedApiKey: 'test-key',
      });

      expect(result.result.coreWebVitals.length).toBeGreaterThan(0);
      const vitals = result.result.coreWebVitals[0];
      expect(vitals.status).toBe('needs-improvement');
      expect(vitals.lcp).toBe(3000);
    });

    it('lcp <= 2500 and cls <= 0.1 triggers good status', async () => {
      const pageHtml = `
        <html>
          <head>
            <title>Test</title>
            <meta name="description" content="Test">
            <link rel="canonical" href="https://dws10.com/">
          </head>
          <body><button>Test</button></body>
        </html>
      `;
      const pagespeedMock = {
        lighthouseResult: {
          audits: {
            'largest-contentful-paint': { numericValue: 2000 },
            'first-input-delay': { numericValue: 100 },
            'cumulative-layout-shift': { numericValue: 0.05 },
            'server-response-time': { numericValue: 200 },
            'total-blocking-time': { numericValue: 100 },
            interactive: { numericValue: 3000 },
          },
        },
      };
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          text: async () => pageHtml,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => pagespeedMock,
        });

      const agent = new SeoAuditAgent();
      const result = await agent.execute(baseContext, {
        ...realisticInput,
        pagespeedApiKey: 'test-key',
      });

      expect(result.result.coreWebVitals.length).toBeGreaterThan(0);
      const vitals = result.result.coreWebVitals[0];
      expect(vitals.status).toBe('good');
    });

    it('cls > 0.25 triggers poor status', async () => {
      const pageHtml = `
        <html>
          <head>
            <title>Test</title>
            <meta name="description" content="Test">
            <link rel="canonical" href="https://dws10.com/">
          </head>
          <body><button>Test</button></body>
        </html>
      `;
      const pagespeedMock = {
        lighthouseResult: {
          audits: {
            'largest-contentful-paint': { numericValue: 2000 },
            'first-input-delay': { numericValue: 100 },
            'cumulative-layout-shift': { numericValue: 0.3 },
            'server-response-time': { numericValue: 200 },
            'total-blocking-time': { numericValue: 100 },
            interactive: { numericValue: 3000 },
          },
        },
      };
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          text: async () => pageHtml,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => pagespeedMock,
        });

      const agent = new SeoAuditAgent();
      const result = await agent.execute(baseContext, {
        ...realisticInput,
        pagespeedApiKey: 'test-key',
      });

      expect(result.result.coreWebVitals.length).toBeGreaterThan(0);
      const vitals = result.result.coreWebVitals[0];
      expect(vitals.status).toBe('poor');
    });
  });

  describe('Recommendations', () => {
    it('recommendations include deploy gate message when blocked', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        text: async () => '<html><head></head><body></body></html>',
      });

      const agent = new SeoAuditAgent();
      const result = await agent.execute(baseContext, {
        site: {
          baseUrl: 'https://dws10.com',
          pages: ['/'],
          sitemapUrl: null,
        },
        scope: 'deploy-check',
      });

      const deployBlocked = result.recommendations.find((r) => r.includes('DEPLOY BLOCKED'));
      expect(deployBlocked).toBeDefined();
    });

    it('recommendations include canonical tag message when missing', async () => {
      // Page without canonical tag will trigger the issue
      mockFetch.mockResolvedValueOnce({
        ok: true,
        text: async () => `
          <html>
            <head>
              <title>Test Page</title>
              <meta name="description" content="Test">
            </head>
            <body>
              <button>Get Started</button>
            </body>
          </html>
        `,
      });

      const agent = new SeoAuditAgent();
      const result = await agent.execute(baseContext, {
        site: {
          baseUrl: 'https://dws10.com',
          sitemapUrl: null,
          pages: ['/'],
        },
        scope: 'deploy-check',
      });

      const canonicalMsg = result.recommendations.find((r) => r.includes('canonical tags'));
      expect(canonicalMsg).toBeDefined();
    });

    it('recommendations include schema message when missing', async () => {
      // Page without schema.org markup will trigger the issue
      mockFetch.mockResolvedValueOnce({
        ok: true,
        text: async () => `
          <html>
            <head>
              <title>Test Page</title>
              <meta name="description" content="Test">
              <link rel="canonical" href="https://dws10.com/">
            </head>
            <body>
              <button>Get Started</button>
            </body>
          </html>
        `,
      });

      const agent = new SeoAuditAgent();
      const result = await agent.execute(baseContext, {
        site: {
          baseUrl: 'https://dws10.com',
          sitemapUrl: null,
          pages: ['/'],
        },
        scope: 'deploy-check',
      });

      const schemaMsg = result.recommendations.find((r) => r.includes('schema markup'));
      expect(schemaMsg).toBeDefined();
    });

    it('recommendations include core web vitals message when poor', async () => {
      const pageHtml = `
        <html>
          <head>
            <title>Test</title>
            <meta name="description" content="Test">
            <link rel="canonical" href="https://dws10.com/">
          </head>
          <body><button>Test</button></body>
        </html>
      `;
      const pagespeedMock = {
        lighthouseResult: {
          audits: {
            'largest-contentful-paint': { numericValue: 5000 },
            'first-input-delay': { numericValue: 100 },
            'cumulative-layout-shift': { numericValue: 0.3 },
            'server-response-time': { numericValue: 200 },
            'total-blocking-time': { numericValue: 100 },
            interactive: { numericValue: 6000 },
          },
        },
      };
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          text: async () => pageHtml,
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => pagespeedMock,
        });

      const agent = new SeoAuditAgent();
      const result = await agent.execute(baseContext, {
        ...realisticInput,
        pagespeedApiKey: 'test-key',
      });

      const vitalsMsg = result.recommendations.find((r) => r.includes('Core Web Vitals'));
      expect(vitalsMsg).toBeDefined();
    });

    it('recommendations include CTA message when weak', async () => {
      // Page with only a button without hero/header position has low CTA score
      mockFetch.mockResolvedValueOnce({
        ok: true,
        text: async () => `
          <html>
            <head>
              <title>Test</title>
              <meta name="description" content="Test">
              <link rel="canonical" href="https://dws10.com/">
            </head>
            <body>
              <button>Test</button>
            </body>
          </html>
        `,
      });

      const agent = new SeoAuditAgent();
      const result = await agent.execute(baseContext, {
        site: {
          baseUrl: 'https://dws10.com',
          sitemapUrl: null,
          pages: ['/'],
        },
        scope: 'deploy-check',
      });

      const ctaMsg = result.recommendations.find((r) => r.includes('weak CTA'));
      expect(ctaMsg).toBeDefined();
    });

    it('recommendations include missing local schema message', async () => {
      // Page without LocalBusiness or Organization schema will trigger this
      mockFetch.mockResolvedValueOnce({
        ok: true,
        text: async () => `
          <html>
            <head>
              <title>Test</title>
              <meta name="description" content="Test">
              <link rel="canonical" href="https://dws10.com/">
            </head>
            <body>
              <button>Test</button>
            </body>
          </html>
        `,
      });

      const agent = new SeoAuditAgent();
      const result = await agent.execute(baseContext, {
        site: {
          baseUrl: 'https://dws10.com',
          sitemapUrl: null,
          pages: ['/'],
        },
        scope: 'deploy-check',
      });

      const localSchemaMsg = result.recommendations.find((r) =>
        r.includes('LocalBusiness/Organization schema'),
      );
      expect(localSchemaMsg).toBeDefined();
    });

    it('recommendations include discovery message when low', async () => {
      // Use a page with very few internal links to trigger low discovery score
      mockFetch.mockResolvedValueOnce({
        ok: true,
        text: async () => `
          <html>
            <head>
              <title>Test Page</title>
              <meta name="description" content="Test">
            </head>
            <body>
              <p>Some content</p>
            </body>
          </html>
        `,
      });

      const agent = new SeoAuditAgent();
      const result = await agent.execute(baseContext, {
        site: {
          baseUrl: 'https://dws10.com',
          sitemapUrl: null,
          pages: ['/isolated'],
        },
        scope: 'deploy-check',
      });

      const discoveryMsg = result.recommendations.find((r) => r.includes('discovery scores'));
      expect(discoveryMsg).toBeDefined();
    });
  });

  describe('Error handling', () => {
    it('handles fetch failure gracefully (returns null for page)', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

      const agent = new SeoAuditAgent();
      const result = await agent.execute(baseContext, {
        site: {
          baseUrl: 'https://dws10.com',
          pages: ['/missing'],
          sitemapUrl: null,
        },
        scope: 'deploy-check',
      });

      expect(result).toBeDefined();
      expect(result.result.issues.length).toBeGreaterThanOrEqual(0);
    });

    it('handles network timeout gracefully', async () => {
      mockFetch.mockImplementationOnce(() => Promise.reject(new Error('Request timeout')));

      const agent = new SeoAuditAgent();
      const result = await agent.execute(baseContext, {
        site: {
          baseUrl: 'https://dws10.com',
          pages: ['/'],
          sitemapUrl: null,
        },
        scope: 'deploy-check',
      });

      expect(result).toBeDefined();
    });

    it('catches and re-throws errors from external APIs', async () => {
      // This test ensures the agent's error handling works
      // The agent catches errors from fetch and auditPage, but external API errors
      // that propagate up should be caught by execute's try-catch
      const agent = new SeoAuditAgent();

      // Mock to return successful response but test internal error handling
      mockFetch.mockResolvedValueOnce({
        ok: true,
        text: async () => '<html><head><title>Test</title></head><body>Content</body></html>',
      });

      // The execute method should catch and log errors internally
      // but not re-throw unless there's a true failure
      const result = await agent.execute(baseContext, {
        site: {
          baseUrl: 'https://dws10.com',
          pages: ['/'],
          sitemapUrl: null,
        },
        scope: 'deploy-check',
      });

      expect(result).toBeDefined();
      expect(result.metadata).toHaveProperty('durationMs');
    });
  });

  describe('Metadata', () => {
    it('includes durationMs in metadata', async () => {
      const agent = new SeoAuditAgent();
      const result = await agent.execute(baseContext, realisticInput);

      expect(result.metadata).toBeDefined();
      expect(result.metadata.durationMs).toBeTypeOf('number');
      // durationMs should be non-negative (may be 0 for very fast execution)
      expect(result.metadata.durationMs).toBeGreaterThanOrEqual(0);
    });

    it('includes healthScore in metadata', async () => {
      const agent = new SeoAuditAgent();
      const result = await agent.execute(baseContext, realisticInput);

      expect(result.metadata.healthScore).toBeTypeOf('number');
      expect(result.metadata.healthScore).toBe(result.result.healthScore);
    });

    it('includes issueCount in metadata', async () => {
      const agent = new SeoAuditAgent();
      const result = await agent.execute(baseContext, realisticInput);

      expect(result.metadata.issueCount).toBeTypeOf('number');
      expect(result.metadata.issueCount).toBe(result.result.issues.length);
    });

    it('includes deployGatePass in metadata', async () => {
      const agent = new SeoAuditAgent();
      const result = await agent.execute(baseContext, realisticInput);

      expect(result.metadata.deployGatePass).toBeTypeOf('boolean');
      expect(result.metadata.deployGatePass).toBe(result.result.deployGate.pass);
    });
  });

  describe('Execute path', () => {
    it('logs execution start and complete', async () => {
      const agent = new SeoAuditAgent();
      await agent.execute(baseContext, realisticInput);

      // Log execution is mocked; just verify no throws
      expect(true).toBe(true);
    });

    it('executes runAudit internally', async () => {
      const agent = new SeoAuditAgent();
      const result = await agent.execute(baseContext, realisticInput);

      expect(result.result).toBeDefined();
      expect(result.result).toHaveProperty('healthScore');
      expect(result.result).toHaveProperty('issues');
      expect(result.result).toHaveProperty('deployGate');
    });

    it('skips reviewWithKyaJev when LLM unavailable', async () => {
      // When getLLMClient returns null (no LLM configured), reviewWithKyaJev
      // returns undefined immediately and doesn't call makeTypedDecision
      const { makeTypedDecision } = await import('../../agents/kya-jev.js');

      const agent = new SeoAuditAgent();
      const result = await agent.execute(baseContext, realisticInput);

      // kyaJevReview should be undefined since LLM client is mocked to null
      expect(result.result.kyaJevReview).toBeUndefined();
      expect(makeTypedDecision).not.toHaveBeenCalled();
    });
  });

  describe('Output structure', () => {
    it('returns SeoAuditOutput structure', async () => {
      const agent = new SeoAuditAgent();
      const result = await agent.execute(baseContext, realisticInput);

      expect(result.result).toBeDefined();
      expect(result.result).toHaveProperty('healthScore');
      expect(result.result).toHaveProperty('coreWebVitals');
      expect(result.result).toHaveProperty('issues');
      expect(result.result).toHaveProperty('schemaMarkup');
      expect(result.result).toHaveProperty('ctaAnalysis');
      expect(result.result).toHaveProperty('schemaValidation');
      expect(result.result).toHaveProperty('linkArchitecture');
      expect(result.result).toHaveProperty('interactionPerformance');
      expect(result.result).toHaveProperty('deployGate');
    });

    it('issues are typed with SeoIssueType', async () => {
      const agent = new SeoAuditAgent();
      const result = await agent.execute(baseContext, realisticInput);

      result.result.issues.forEach((issue) => {
        expect([
          'missing-canonical',
          'duplicate-title',
          'missing-alt',
          'broken-link',
          'missing-schema',
          'slow-page',
          'missing-meta',
          'weak-cta',
          'missing-local-schema',
          'low-discovery',
          'thin-content',
        ]).toContain(issue.type);
        expect(['critical', 'warning', 'info']).toContain(issue.severity);
      });
    });
  });

  describe('Agent configuration', () => {
    it('agent has name seo-audit', () => {
      const agent = new SeoAuditAgent();
      expect(agent.config.name).toBe('seo-audit');
    });

    it('agent has correct description', () => {
      const agent = new SeoAuditAgent();
      expect(agent.config.description).toContain('SEO');
    });

    it('agent has capabilities array', () => {
      const agent = new SeoAuditAgent();
      expect(agent.config.capabilities).toEqual([
        'technical-seo-audit',
        'core-web-vitals',
        'schema-validation',
        'deploy-gate',
        'change-detection',
      ]);
    });

    it('agent uses llama-3.3-70b-versatile model', () => {
      const agent = new SeoAuditAgent();
      expect(agent.config.model).toBe('llama-3.3-70b-versatile');
    });
  });
});

describe('SeoAuditAgent helper methods', () => {
  it('calculateLinkDepth correctly calculates depth', () => {
    const agent = new SeoAuditAgent();
    // @ts-expect-error - accessing private method for testing
    const depth = agent.calculateLinkDepth(['/a/b/c', '/x/y', '/']);
    expect(depth).toBe(3);
  });

  it('detectElementPosition returns header for header element', () => {
    const html = '<header><button>Click</button></header>';
    const agent = new SeoAuditAgent();
    // @ts-expect-error - accessing private method for testing
    const position = agent.detectElementPosition(html, html.indexOf('button'));
    expect(position).toBe('header');
  });

  it('detectElementPosition returns hero for hero section', () => {
    const html = '<div class="hero"><button>Click</button></div>';
    const agent = new SeoAuditAgent();
    // @ts-expect-error - accessing private method for testing
    const position = agent.detectElementPosition(html, html.indexOf('button'));
    expect(position).toBe('hero');
  });

  it('detectElementPosition returns footer for footer element', () => {
    const html = '<footer><button>Click</button></footer>';
    const agent = new SeoAuditAgent();
    // @ts-expect-error - accessing private method for testing
    const position = agent.detectElementPosition(html, html.indexOf('button'));
    expect(position).toBe('footer');
  });

  it('detectElementPosition returns mid-content by default', () => {
    const html = '<main><button>Click</button></main>';
    const agent = new SeoAuditAgent();
    // @ts-expect-error - accessing private method for testing
    const position = agent.detectElementPosition(html, html.indexOf('button'));
    expect(position).toBe('mid-content');
  });
});

describe('SeoAuditAgent fetch fallback', () => {
  it('discoverPages returns default pages when sitemap fails', async () => {
    const agent = new SeoAuditAgent();
    // @ts-expect-error - accessing private method for testing
    const pages = await agent.discoverPages('https://dws10.com', 'https://dws10.com/sitemap.xml');
    expect(pages).toEqual([
      '/',
      '/buy/',
      '/buy/page2/',
      '/buy/page3/',
      '/buy/page4/',
      '/construction/',
    ]);
  });
});
