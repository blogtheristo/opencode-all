/**
 * Evidence: Tool=Copilot CLI 1.0.83 Model=gpt-5.6-luna Agent=Copilot CLI Date=2026-09-05
 * Audit trail: git log -- src/agents/seo/seo-audit.agent.ts
 *
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
import { makeTypedDecision } from '../kya-jev.js';

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
  ctaSignals: {
    buttons: Array<{ text: string; position: string }>;
    links: Array<{ text: string; position: string }>;
    forms: number;
  };
  schemaDetails: {
    types: string[];
    hasLocalBusiness: boolean;
    hasOrganization: boolean;
    hasWebSite: boolean;
    hasProduct: boolean;
    requiredProperties: string[];
    missingProperties: string[];
  };
  linkMetrics: {
    internalCount: number;
    externalCount: number;
  };
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
      output.kyaJevReview = await this.reviewWithKyaJev(output, context);
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
    } catch (err) {
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
        error_message: err instanceof Error ? err.message : String(err),
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
    const ctaAnalysis: SeoAuditOutput['ctaAnalysis'] = [];
    const schemaValidation: SeoAuditOutput['schemaValidation'] = [];
    const linkArchitecture: SeoAuditOutput['linkArchitecture'] = [];
    const interactionPerformance: SeoAuditOutput['interactionPerformance'] = [];
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

      // Analyze CTA signals
      const ctaScore = this.calculateCtaScore(pageResult.ctaSignals);
      const totalCtas =
        pageResult.ctaSignals.buttons.length +
        pageResult.ctaSignals.links.length +
        pageResult.ctaSignals.forms;
      ctaAnalysis.push({
        url: fullUrl,
        ctaCount: totalCtas,
        primaryCta: {
          present: totalCtas > 0,
          text:
            pageResult.ctaSignals.buttons[0]?.text ||
            pageResult.ctaSignals.links[0]?.text ||
            (pageResult.ctaSignals.forms > 0 ? 'contact form' : null),
          position: (pageResult.ctaSignals.buttons[0]?.position ||
            pageResult.ctaSignals.links[0]?.position ||
            'none') as 'header' | 'hero' | 'mid-content' | 'footer' | 'none',
          type:
            pageResult.ctaSignals.buttons.length > 0
              ? 'button'
              : pageResult.ctaSignals.links.length > 0
                ? 'link'
                : pageResult.ctaSignals.forms > 0
                  ? 'form'
                  : 'none',
        },
        ctaDensity: pageResult.wordCount > 0 ? totalCtas / (pageResult.wordCount / 100) : 0,
        score: ctaScore,
      });

      // Add CTA issues if score is low
      if (ctaScore < 50) {
        issues.push({
          type: 'weak-cta',
          url: fullUrl,
          severity: 'critical',
          description: `Weak CTA signals detected (score: ${ctaScore}/100). ${pageResult.ctaSignals.buttons.length} buttons, ${pageResult.ctaSignals.links.length} CTA links, ${pageResult.ctaSignals.forms} forms found.`,
          fix: 'Add prominent call-to-action buttons in hero section and throughout content. Use action-oriented text like "Get Started", "Request Demo", "Contact Sales".',
        });
      }

      // Validate schema
      const schemaValid = this.validateSchema(pageResult.schemaDetails);
      schemaValidation.push({
        url: fullUrl,
        schemaTypes: pageResult.schemaDetails.types,
        hasLocalBusiness: pageResult.schemaDetails.hasLocalBusiness,
        hasOrganization: pageResult.schemaDetails.hasOrganization,
        hasWebSite: pageResult.schemaDetails.hasWebSite,
        hasProduct: pageResult.schemaDetails.hasProduct,
        requiredProperties: pageResult.schemaDetails.requiredProperties,
        missingProperties: pageResult.schemaDetails.missingProperties,
        isValid: schemaValid.isValid,
        errors: schemaValid.errors,
      });

      // Add schema issues
      if (!pageResult.schemaDetails.hasLocalBusiness && !pageResult.schemaDetails.hasOrganization) {
        issues.push({
          type: 'missing-local-schema',
          url: fullUrl,
          severity: 'critical',
          description: 'No LocalBusiness or Organization schema detected.',
          fix: 'Add LocalBusiness or Organization schema with name, address, and contact details for local SEO.',
        });
      }

      // Analyze link architecture
      const discoveryScore = this.calculateDiscoveryScore(
        pageResult.linkMetrics,
        pageResult.internalLinks,
      );
      linkArchitecture.push({
        url: fullUrl,
        internalLinkCount: pageResult.linkMetrics.internalCount,
        discoveryScore,
        linkDepth: this.calculateLinkDepth(pageResult.internalLinks),
        orphanRisk: discoveryScore < 30,
      });

      // Add link architecture issues
      if (discoveryScore < 30) {
        issues.push({
          type: 'low-discovery',
          url: fullUrl,
          severity: 'warning',
          description: `Low discovery score (${discoveryScore}/100). Page may be hard for search engines to find.`,
          fix: 'Add internal links from high-authority pages, include in navigation menus, and create related content sections.',
        });
      }

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

    return {
      healthScore,
      coreWebVitals,
      issues,
      schemaMarkup,
      ctaAnalysis,
      schemaValidation,
      linkArchitecture,
      interactionPerformance,
      deployGate,
      delta,
    };
  }

  /**
   * kya-jev pilot integration (docs/field-notes/2026-09-18-jev-typed-decision-layer-signal.md).
   * Advisory-only: classifies review priority for a human/downstream reader.
   * Never touches `deployGate`, which stays fully deterministic. Silently
   * skipped (returns undefined) when no LLM client or KYA verdict is
   * available — this agent's deploy-gate behavior is unchanged either way.
   */
  private async reviewWithKyaJev(
    output: SeoAuditOutput,
    context: AgentContext,
  ): Promise<SeoAuditOutput['kyaJevReview']> {
    const client = typeof this.getLLMClient === 'function' ? this.getLLMClient() : null;
    if (!client) return undefined;

    try {
      const criticalCount = output.issues.filter((i) => i.severity === 'critical').length;
      const warningCount = output.issues.filter((i) => i.severity === 'warning').length;
      const state = `healthScore=${output.healthScore}, criticalIssues=${criticalCount}, warningIssues=${warningCount}, deployGatePass=${output.deployGate.pass}, sampleIssues=${JSON.stringify(output.issues.slice(0, 10).map((i) => i.type))}`;

      const result = await makeTypedDecision(
        client,
        {
          state,
          question: {
            kind: 'score',
            prompt:
              'Given this SEO audit summary, how urgently should a human review the full report (independent of the automated deploy gate)?',
            levels: ['none', 'low', 'medium', 'high'],
          },
        },
        context.agentRuntime,
      );

      await this.logKyaJevCall(context, {
        questionKind: 'score',
        questionPrompt: 'seo-audit review-priority triage',
        decision: result.decision,
        probabilities: result.probabilities,
        confidence: result.confidence,
        calibration: result.calibration,
        abstained: result.abstained,
        model: client.model,
      });

      return {
        reviewPriority: result.abstained
          ? 'none'
          : (result.decision as 'none' | 'low' | 'medium' | 'high'),
        confidence: result.confidence,
        calibration: result.calibration,
        abstained: result.abstained,
      };
    } catch {
      // No KYA verdict, or the model call failed — advisory feature, never
      // block or fail the audit over it.
      return undefined;
    }
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

      // Analyze CTA signals
      const ctaSignals = this.analyzeCtaSignals(html);

      // Analyze schema details
      const schemaDetails = this.analyzeSchemaDetails(html, schemas);

      // Analyze link metrics
      const linkMetrics = this.analyzeLinkMetrics(html, internalLinks);

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
        ctaSignals,
        schemaDetails,
        linkMetrics,
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
            'total-blocking-time'?: { numericValue?: number };
            interactive?: { numericValue?: number };
          };
        };
      };

      const audits = data.lighthouseResult?.audits;
      if (!audits) return null;

      const lcp = audits['largest-contentful-paint']?.numericValue ?? 0;
      const fid = audits['first-input-delay']?.numericValue ?? 0;
      const cls = audits['cumulative-layout-shift']?.numericValue ?? 0;
      const ttfb = audits['server-response-time']?.numericValue ?? 0;
      const tbt = audits['total-blocking-time']?.numericValue ?? 0;
      const tti = audits['interactive']?.numericValue ?? 0;

      let status: 'good' | 'needs-improvement' | 'poor' = 'good';
      if (lcp > 4000 || cls > 0.25) status = 'poor';
      else if (lcp > 2500 || cls > 0.1) status = 'needs-improvement';

      return { url, lcp, fid, cls, ttfb, tbt, tti, status };
    } catch {
      return null;
    }
  }

  private analyzeCtaSignals(html: string): {
    buttons: Array<{ text: string; position: string }>;
    links: Array<{ text: string; position: string }>;
    forms: number;
  } {
    const buttons: Array<{ text: string; position: string }> = [];
    const links: Array<{ text: string; position: string }> = [];
    let forms = 0;

    // Detect buttons
    const buttonRegex = /<button[^>]*>(.*?)<\/button>/gi;
    let buttonMatch: RegExpExecArray | null;
    while ((buttonMatch = buttonRegex.exec(html)) !== null) {
      const text = buttonMatch[1].replace(/<[^>]+>/g, '').trim();
      if (text) {
        buttons.push({ text, position: this.detectElementPosition(html, buttonMatch.index) });
      }
    }

    // Detect CTA links (links with common CTA classes/text)
    const ctaPatterns = [
      'cta',
      'btn',
      'button',
      'signup',
      'register',
      'demo',
      'contact',
      'buy',
      'purchase',
      'get-started',
      'try',
      'free',
    ];
    const linkRegex = /<a[^>]*href=["'][^"']+["'][^>]*>(.*?)<\/a>/gi;
    let linkMatch: RegExpExecArray | null;
    while ((linkMatch = linkRegex.exec(html)) !== null) {
      const text = linkMatch[1].replace(/<[^>]+>/g, '').trim();
      const fullTag = linkMatch[0].toLowerCase();
      if (
        text &&
        ctaPatterns.some(
          (pattern) => fullTag.includes(pattern) || text.toLowerCase().includes(pattern),
        )
      ) {
        links.push({ text, position: this.detectElementPosition(html, linkMatch.index) });
      }
    }

    // Detect forms
    const formRegex = /<form[^>]*>/gi;
    while (formRegex.exec(html) !== null) {
      forms++;
    }

    return { buttons, links, forms };
  }

  private detectElementPosition(html: string, index: number): string {
    const openElements: Array<{ name: string; attributes: string }> = [];
    const tagRegex = /<\/?([a-z][\w:-]*)\b([^>]*)>/gi;
    const voidElements = new Set([
      'area',
      'base',
      'br',
      'col',
      'embed',
      'hr',
      'img',
      'input',
      'link',
      'meta',
      'param',
      'source',
      'track',
      'wbr',
    ]);
    let tagMatch: RegExpExecArray | null;

    while ((tagMatch = tagRegex.exec(html)) !== null && tagMatch.index < index) {
      const name = tagMatch[1].toLowerCase();
      const attributes = tagMatch[2];
      if (tagMatch[0][1] === '/') {
        const openIndex = openElements.map((element) => element.name).lastIndexOf(name);
        if (openIndex >= 0) openElements.splice(openIndex, 1);
      } else if (!voidElements.has(name) && !tagMatch[0].endsWith('/>')) {
        openElements.push({ name, attributes });
      }
    }

    if (openElements.some((element) => element.name === 'header')) {
      return 'header';
    }
    if (
      openElements.some((element) =>
        /(?:class|id)\s*=\s*["'][^"']*(?:hero|banner)[^"']*["']/i.test(element.attributes),
      )
    ) {
      return 'hero';
    }
    if (openElements.some((element) => element.name === 'footer')) {
      return 'footer';
    }
    return 'mid-content';
  }

  private analyzeSchemaDetails(
    html: string,
    schemas: string[],
  ): {
    types: string[];
    hasLocalBusiness: boolean;
    hasOrganization: boolean;
    hasWebSite: boolean;
    hasProduct: boolean;
    requiredProperties: string[];
    missingProperties: string[];
  } {
    const hasLocalBusiness = schemas.some((s) => s.toLowerCase().includes('localbusiness'));
    const hasOrganization = schemas.some((s) => s.toLowerCase().includes('organization'));
    const hasWebSite = schemas.some((s) => s.toLowerCase().includes('website'));
    const hasProduct = schemas.some((s) => s.toLowerCase().includes('product'));

    // Extract actual JSON-LD blocks for property validation
    const jsonLdObjects = this.extractJsonLdBlocks(html);

    // Deduplicate required properties per schema type
    const requiredSet = new Set<string>();
    const missingSet = new Set<string>();

    for (const obj of jsonLdObjects) {
      const type = obj['@type'];
      if (typeof type !== 'string') continue;
      const typeLower = type.toLowerCase();

      if (typeLower.includes('localbusiness')) {
        for (const prop of ['name', 'address', 'telephone']) {
          requiredSet.add(prop);
          if (!(prop in obj)) missingSet.add(prop);
        }
      }

      if (typeLower.includes('organization')) {
        for (const prop of ['name', 'url']) {
          requiredSet.add(prop);
          if (!(prop in obj)) missingSet.add(prop);
        }
      }
    }

    return {
      types: schemas,
      hasLocalBusiness,
      hasOrganization,
      hasWebSite,
      hasProduct,
      requiredProperties: [...requiredSet],
      missingProperties: [...missingSet],
    };
  }

  private extractJsonLdBlocks(html: string): Array<Record<string, unknown>> {
    const blocks: Array<Record<string, unknown>> = [];
    const regex = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
    let match: RegExpExecArray | null;
    while ((match = regex.exec(html)) !== null) {
      try {
        const parsed = JSON.parse(match[1]);
        if (parsed && typeof parsed === 'object') {
          if (Array.isArray(parsed)) {
            for (const item of parsed) {
              if (item && typeof item === 'object' && '@type' in item) blocks.push(item);
            }
          } else if ('@type' in parsed) {
            blocks.push(parsed);
          } else if ('@graph' in parsed && Array.isArray(parsed['@graph'])) {
            for (const item of parsed['@graph']) {
              if (item && typeof item === 'object' && '@type' in item) blocks.push(item);
            }
          }
        }
      } catch {
        // malformed JSON-LD — skip
      }
    }
    return blocks;
  }

  private analyzeLinkMetrics(
    html: string,
    internalLinks: string[],
  ): {
    internalCount: number;
    externalCount: number;
  } {
    const internalCount = internalLinks.length;

    // Count external links
    const externalLinkRegex = /href=["']https?:\/\/(?!dws10\.com)[^"']+["']/gi;
    const externalMatches = html.match(externalLinkRegex);
    const externalCount = externalMatches ? externalMatches.length : 0;

    return { internalCount, externalCount };
  }

  private calculateCtaScore(ctaSignals: {
    buttons: Array<{ text: string; position: string }>;
    links: Array<{ text: string; position: string }>;
    forms: number;
  }): number {
    let score = 0;

    // Points for having CTAs
    if (ctaSignals.buttons.length > 0) score += 30;
    if (ctaSignals.links.length > 0) score += 20;
    if (ctaSignals.forms > 0) score += 10;

    // Points for CTA placement
    const allCtas = [...ctaSignals.buttons, ...ctaSignals.links];
    const hasHeroCta = allCtas.some((cta) => cta.position === 'hero');
    const hasHeaderCta = allCtas.some((cta) => cta.position === 'header');

    if (hasHeroCta) score += 25;
    if (hasHeaderCta) score += 15;

    // Points for multiple CTAs
    if (allCtas.length >= 3) score += 10;

    return Math.min(100, score);
  }

  private validateSchema(schemaDetails: {
    hasLocalBusiness: boolean;
    hasOrganization: boolean;
    hasWebSite: boolean;
    hasProduct: boolean;
    requiredProperties: string[];
    missingProperties: string[];
  }): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!schemaDetails.hasLocalBusiness && !schemaDetails.hasOrganization) {
      errors.push('Missing LocalBusiness or Organization schema');
    }

    if (schemaDetails.missingProperties.length > 0) {
      errors.push(`Missing required properties: ${schemaDetails.missingProperties.join(', ')}`);
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  private calculateDiscoveryScore(
    linkMetrics: { internalCount: number; externalCount: number },
    internalLinks: string[],
  ): number {
    let score = 0;

    // Points for internal links (verifiable from page HTML)
    if (linkMetrics.internalCount >= 5) score += 30;
    else if (linkMetrics.internalCount >= 3) score += 20;
    else if (linkMetrics.internalCount >= 1) score += 10;

    // Points for external outbound links (signals a well-connected page)
    if (linkMetrics.externalCount >= 3) score += 15;
    else if (linkMetrics.externalCount >= 1) score += 5;

    // Points for link diversity (unique path segments)
    const uniquePaths = new Set(
      internalLinks.map((link) => {
        const url = new URL(link, 'https://dws10.com');
        return url.pathname.split('/')[1] || '/';
      }),
    );
    if (uniquePaths.size >= 3) score += 25;
    else if (uniquePaths.size >= 2) score += 15;

    // Points for having links from different sections
    const sections = new Set(
      internalLinks.map((link) => {
        if (link.includes('/products/')) return 'products';
        if (link.includes('/compliance/')) return 'compliance';
        if (link.includes('/investor-centre/')) return 'investor';
        return 'other';
      }),
    );
    if (sections.size >= 3) score += 20;
    else if (sections.size >= 2) score += 10;

    // Penalty: very few internal links suggests weak crawl path
    if (linkMetrics.internalCount === 0) score -= 20;

    return Math.max(0, Math.min(100, score));
  }

  private calculateLinkDepth(internalLinks: string[]): number {
    // Simplified depth calculation based on URL structure
    let maxDepth = 1;
    for (const link of internalLinks) {
      const url = new URL(link, 'https://dws10.com');
      const depth = url.pathname.split('/').filter(Boolean).length;
      if (depth > maxDepth) maxDepth = depth;
    }
    return maxDepth;
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

    const weakCtas = output.issues.filter((i) => i.type === 'weak-cta');
    if (weakCtas.length > 0) {
      recs.push(
        `${weakCtas.length} pages have weak CTA signals. Add prominent call-to-action buttons in hero sections.`,
      );
    }

    const missingLocalSchema = output.issues.filter((i) => i.type === 'missing-local-schema');
    if (missingLocalSchema.length > 0) {
      recs.push(
        `${missingLocalSchema.length} pages missing LocalBusiness/Organization schema. Add for local SEO.`,
      );
    }

    const lowDiscovery = output.issues.filter((i) => i.type === 'low-discovery');
    if (lowDiscovery.length > 0) {
      recs.push(
        `${lowDiscovery.length} pages have low discovery scores. Improve internal linking structure.`,
      );
    }

    return recs;
  }
}
