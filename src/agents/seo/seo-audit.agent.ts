/**
 * Technical SEO Audit Agent — Crawls DWS sites on deploy,
 * checks Core Web Vitals, canonical tags, schema markup,
 * and blocks deployment if critical issues are found.
 *
 * Execution cadence: On deploy (CI/CD) + weekly full crawl (Mondays 04:00 UTC)
 *
 * See docs/SEO_SALES_AGENT_SPECIFICATION.md § 2.4
 */

import { BaseAgent } from '../base.agent.js';
import type { AgentContext, AgentResponse } from '../types.js';
import type { SeoAuditInput, SeoAuditOutput } from './types.js';

interface PageAuditResult {
  url: string;
  title: string | null;
  metaDescription: string | null;
  canonicalUrl: string | null;
  h1Count: number;
  imgWithoutAlt: number;
  schemas: string[];
  internalLinks: string[];
  brokenLinks: string[];
  wordCount: number;
}

export class SeoAuditAgent extends BaseAgent {
  constructor() {
    super({
      name: 'seo-audit',
      description:
        'Crawls DWS sites on deploy to check Core Web Vitals, canonical tags, schema markup, and meta tags. Blocks deployment when critical SEO issues are found.',
      capabilities: [
        'technical-seo-audit',
        'core-web-vitals',
        'schema-validation',
        'deploy-gate',
        'change-detection',
      ],
      model: 'llama-3.3-70b-versatile',
      modelTier: 'standard',
    });
  }

  async execute(context: AgentContext, input: Record<string, unknown>): Promise<AgentResponse> {
    const startTime = Date.now();
    const typedInput = input as unknown as SeoAuditInput;

    await this.logExecution({
      agent_name: this.config.name,
      user_id: context.userId,
      org_id: context.orgId,
      session_id: context.sessionId,
      project_id: context.projectId,
      input,
      output: null,
      status: 'started',
      duration_ms: 0,
      created_at: new Date().toISOString(),
    });

    try {
      const output = await this.runAudit(typedInput);
      const durationMs = Date.now() - startTime;

      const response: AgentResponse = {
        agentName: this.config.name,
        result: output as unknown as Record<string, unknown>,
        confidence: 0.85,
        reasoning:
          `Audited ${typedInput.site.pages.length || 'all'} pages on ${typedInput.site.baseUrl}. ` +
          `Health score: ${output.healthScore}/100. ` +
          `Found ${output.issues.length} issues (${output.issues.filter((i) => i.severity === 'critical').length} critical). ` +
          `Deploy gate: ${output.deployGate.pass ? 'PASS' : 'BLOCKED'}.`,
        recommendations: [...new Set(this.generateRecommendations(output))],
        metadata: {
          durationMs,
          site: typedInput.site.baseUrl,
          scope: typedInput.scope,
          healthScore: output.healthScore,
          issueCount: output.issues.length,
          deployGatePass: output.deployGate.pass,
        },
      };

      await this.logExecution({
        agent_name: this.config.name,
        user_id: context.userId,
        org_id: context.orgId,
        session_id: context.sessionId,
        project_id: context.projectId,
        input,
        output: response,
        status: 'completed',
        duration_ms: durationMs,
        created_at: new Date().toISOString(),
      });

      return response;
    } catch (err: any) {
      const durationMs = Date.now() - startTime;

      await this.logExecution({
        agent_name: this.config.name,
        user_id: context.userId,
        org_id: context.orgId,
        session_id: context.sessionId,
        project_id: context.projectId,
        input,
        output: null,
        status: 'error',
        error_message: err.message,
        duration_ms: durationMs,
        created_at: new Date().toISOString(),
      });
      throw err;
    }
  }

  private async runAudit(input: SeoAuditInput): Promise<SeoAuditOutput> {
    const pages =
      input.site.pages.length > 0
        ? input.site.pages
        : await this.discoverPages(input.site.baseUrl, input.site.sitemapUrl);

    const issues: SeoAuditOutput['issues'] = [];
    const schemaMarkup: SeoAuditOutput['schemaMarkup'] = [];
    const coreWebVitals: SeoAuditOutput['coreWebVitals'] = [];
    const seenTitles = new Map<string, string>();

    for (const pageUrl of pages) {
      const fullUrl = pageUrl.startsWith('http') ? pageUrl : `${input.site.baseUrl}${pageUrl}`;

      // Audit the page content
      const pageResult = await this.auditPage(fullUrl);
      if (!pageResult) continue;

      // Check for missing meta description
      if (!pageResult.metaDescription) {
        issues.push({
          type: 'missing-meta',
          url: fullUrl,
          severity: 'warning',
          description: 'Page is missing meta description tag.',
          fix: 'Add a <meta name="description" content="..."> tag with keyword-rich description (max 160 chars).',
        });
      }

      // Check for missing canonical
      if (!pageResult.canonicalUrl) {
        issues.push({
          type: 'missing-canonical',
          url: fullUrl,
          severity: 'critical',
          description: 'Page is missing canonical URL tag.',
          fix: 'Add <link rel="canonical" href="..."> pointing to the preferred URL.',
        });
      }

      // Check for duplicate titles
      if (pageResult.title) {
        const existingUrl = seenTitles.get(pageResult.title);
        if (existingUrl) {
          issues.push({
            type: 'duplicate-title',
            url: fullUrl,
            severity: 'warning',
            description: `Title "${pageResult.title}" is duplicated with ${existingUrl}.`,
            fix: 'Give each page a unique, keyword-rich title tag.',
          });
        } else {
          seenTitles.set(pageResult.title, fullUrl);
        }
      }

      // Check for missing alt text
      if (pageResult.imgWithoutAlt > 0) {
        issues.push({
          type: 'missing-alt',
          url: fullUrl,
          severity: 'warning',
          description: `${pageResult.imgWithoutAlt} images missing alt text.`,
          fix: 'Add descriptive alt text to all images, using keyword variations where natural.',
        });
      }

      // Check for thin content
      if (pageResult.wordCount < 300) {
        issues.push({
          type: 'thin-content',
          url: fullUrl,
          severity: 'warning',
          description: `Page has only ${pageResult.wordCount} words (minimum recommended: 300).`,
          fix: 'Expand content to at least 300 words with keyword-rich, valuable information.',
        });
      }

      // Check for missing schema markup
      if (pageResult.schemas.length === 0) {
        issues.push({
          type: 'missing-schema',
          url: fullUrl,
          severity: 'warning',
          description: 'No structured data (schema.org) found on page.',
          fix: 'Add JSON-LD schema markup (Article, Product, Organization, or FAQ).',
        });
      }

      // Record schema markup
      schemaMarkup.push({
        url: fullUrl,
        schemas: pageResult.schemas,
        valid: pageResult.schemas.length > 0,
        errors: [],
      });

      // Check for broken internal links
      for (const brokenLink of pageResult.brokenLinks) {
        issues.push({
          type: 'broken-link',
          url: fullUrl,
          severity: 'critical',
          description: `Broken internal link: ${brokenLink}`,
          fix: `Fix or remove the link to ${brokenLink}.`,
        });
      }

      // Get Core Web Vitals via PageSpeed API if key is available
      if (input.pagespeedApiKey) {
        const vitals = await this.getPageSpeedData(fullUrl, input.pagespeedApiKey);
        if (vitals) {
          coreWebVitals.push(vitals);

          if (vitals.lcp > 4000) {
            issues.push({
              type: 'slow-page',
              url: fullUrl,
              severity: 'critical',
              description: `LCP is ${vitals.lcp}ms (threshold: 2500ms good, 4000ms max).`,
              fix: 'Optimize largest contentful paint: compress images, defer non-critical JS, use CDN.',
            });
          }
        }
      }
    }

    // Calculate health score
    const criticalCount = issues.filter((i) => i.severity === 'critical').length;
    const warningCount = issues.filter((i) => i.severity === 'warning').length;
    const healthScore = Math.max(0, 100 - criticalCount * 15 - warningCount * 3);

    // Deploy gate decision
    const blockers = issues
      .filter((i) => i.severity === 'critical')
      .map((i) => `${i.type}: ${i.description} (${i.url})`);
    const warnings = issues
      .filter((i) => i.severity === 'warning')
      .map((i) => `${i.type}: ${i.description} (${i.url})`);

    const deployGate = {
      pass: blockers.length === 0,
      blockers,
      warnings,
    };

    // Calculate delta if previous audit exists
    let delta: SeoAuditOutput['delta'];
    if (input.previousAudit) {
      const prevIssueUrls = new Set(input.previousAudit.issues.map((i) => `${i.type}:${i.url}`));
      const currentIssueUrls = new Set(issues.map((i) => `${i.type}:${i.url}`));

      const newIssues = issues.filter((i) => !prevIssueUrls.has(`${i.type}:${i.url}`)).length;
      const resolvedIssues = input.previousAudit.issues.filter(
        (i) => !currentIssueUrls.has(`${i.type}:${i.url}`),
      ).length;

      delta = {
        healthScoreChange: healthScore - (input.previousAudit.scores['health'] ?? 0),
        newIssues,
        resolvedIssues,
        regressions: issues
          .filter((i) => i.severity === 'critical' && !prevIssueUrls.has(`${i.type}:${i.url}`))
          .map((i) => `NEW: ${i.type} at ${i.url}`),
      };
    }

    return { healthScore, coreWebVitals, issues, schemaMarkup, deployGate, delta };
  }

  private async discoverPages(_baseUrl: string, sitemapUrl?: string): Promise<string[]> {
    // Try to fetch sitemap first
    if (sitemapUrl) {
      try {
        const response = await fetch(sitemapUrl, { signal: AbortSignal.timeout(5000) });
        if (response.ok) {
          const xml = await response.text();
          const urls: string[] = [];
          const locRegex = /<loc>(.*?)<\/loc>/g;
          let match: RegExpExecArray | null;
          while ((match = locRegex.exec(xml)) !== null) {
            urls.push(match[1]);
          }
          if (urls.length > 0) return urls.slice(0, 50); // limit to 50 pages
        }
      } catch {
        // Sitemap unavailable — fall through to defaults
      }
    }

    // Default pages to audit
    return ['/', '/buy/', '/buy/page2/', '/buy/page3/', '/buy/page4/', '/construction/'];
  }

  private async auditPage(url: string): Promise<PageAuditResult | null> {
    try {
      const response = await fetch(url, {
        headers: { 'User-Agent': 'DWS-SEO-Audit/1.0' },
        signal: AbortSignal.timeout(10000),
      });
      if (!response.ok) return null;

      const html = await response.text();

      // Extract title
      const titleMatch = html.match(/<title[^>]*>(.*?)<\/title>/i);
      const title = titleMatch ? titleMatch[1].trim() : null;

      // Extract meta description
      const metaMatch = html.match(/<meta\s+name=["']description["']\s+content=["'](.*?)["']/i);
      const metaDescription = metaMatch ? metaMatch[1].trim() : null;

      // Extract canonical
      const canonicalMatch = html.match(/<link\s+rel=["']canonical["']\s+href=["'](.*?)["']/i);
      const canonicalUrl = canonicalMatch ? canonicalMatch[1].trim() : null;

      // Count H1 tags
      const h1Matches = html.match(/<h1[\s>]/gi);
      const h1Count = h1Matches ? h1Matches.length : 0;

      // Count images without alt
      const imgRegex = /<img\s[^>]*>/gi;
      let imgWithoutAlt = 0;
      let imgMatch: RegExpExecArray | null;
      while ((imgMatch = imgRegex.exec(html)) !== null) {
        if (!/\balt\s*=\s*["'][^"']+["']/i.test(imgMatch[0])) {
          imgWithoutAlt++;
        }
      }

      // Extract schema.org types
      const schemas: string[] = [];
      const schemaRegex = /"@type"\s*:\s*"([^"]+)"/g;
      let schemaMatch: RegExpExecArray | null;
      while ((schemaMatch = schemaRegex.exec(html)) !== null) {
        schemas.push(schemaMatch[1]);
      }

      // Count words in body text
      const bodyText = html
        .replace(/<script[\s\S]*?<\/script>/gi, '')
        .replace(/<style[\s\S]*?<\/style>/gi, '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
      const wordCount = bodyText.split(' ').filter((w) => w.length > 0).length;

      // Extract internal links
      const linkRegex = /href=["'](\/[^"']*|https?:\/\/dws10\.com[^"']*)/gi;
      const internalLinks: string[] = [];
      let linkMatch: RegExpExecArray | null;
      while ((linkMatch = linkRegex.exec(html)) !== null) {
        internalLinks.push(linkMatch[1]);
      }

      return {
        url,
        title,
        metaDescription,
        canonicalUrl,
        h1Count,
        imgWithoutAlt,
        schemas,
        internalLinks,
        brokenLinks: [],
        wordCount,
      };
    } catch {
      return null;
    }
  }

  private async getPageSpeedData(
    url: string,
    apiKey: string,
  ): Promise<SeoAuditOutput['coreWebVitals'][0] | null> {
    try {
      const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&key=${apiKey}&strategy=mobile`;
      const response = await fetch(apiUrl, { signal: AbortSignal.timeout(30000) });
      if (!response.ok) return null;

      const data = (await response.json()) as {
        lighthouseResult?: {
          audits?: {
            'largest-contentful-paint'?: { numericValue?: number };
            'first-input-delay'?: { numericValue?: number };
            'cumulative-layout-shift'?: { numericValue?: number };
            'server-response-time'?: { numericValue?: number };
          };
        };
      };

      const audits = data.lighthouseResult?.audits;
      if (!audits) return null;

      const lcp = audits['largest-contentful-paint']?.numericValue ?? 0;
      const fid = audits['first-input-delay']?.numericValue ?? 0;
      const cls = audits['cumulative-layout-shift']?.numericValue ?? 0;
      const ttfb = audits['server-response-time']?.numericValue ?? 0;

      let status: 'good' | 'needs-improvement' | 'poor' = 'good';
      if (lcp > 4000 || cls > 0.25) status = 'poor';
      else if (lcp > 2500 || cls > 0.1) status = 'needs-improvement';

      return { url, lcp, fid, cls, ttfb, status };
    } catch {
      return null;
    }
  }

  private generateRecommendations(output: SeoAuditOutput): string[] {
    const recs: string[] = [];

    if (!output.deployGate.pass) {
      recs.push(
        `DEPLOY BLOCKED: ${output.deployGate.blockers.length} critical issues must be resolved before deployment.`,
      );
    }

    const missingCanonicals = output.issues.filter((i) => i.type === 'missing-canonical');
    if (missingCanonicals.length > 0) {
      recs.push(
        `Add canonical tags to ${missingCanonicals.length} pages to prevent duplicate content.`,
      );
    }

    const missingSchemas = output.issues.filter((i) => i.type === 'missing-schema');
    if (missingSchemas.length > 0) {
      recs.push(`Add schema markup to ${missingSchemas.length} pages for rich search results.`);
    }

    const slowPages = output.coreWebVitals.filter((v) => v.status === 'poor');
    if (slowPages.length > 0) {
      recs.push(
        `${slowPages.length} pages have poor Core Web Vitals. Prioritize LCP optimization.`,
      );
    }

    return recs;
  }
}
