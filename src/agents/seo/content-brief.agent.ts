/**
 * Content Brief & Draft Agent — Generates structured content briefs
 * and first drafts using keyword data, competitor analysis, and
 * LWM domain knowledge as RAG context.
 *
 * Execution cadence: On-demand (triggered by Keyword Agent or Competitor Agent)
 *
 * See docs/SEO_SALES_AGENT_SPECIFICATION.md § 2.3
 */

import { BaseAgent } from '../base.agent.js';
import type { AgentContext, AgentResponse } from '../types.js';
import type { ContentBriefInput, ContentBriefOutput } from './types.js';

export class ContentBriefAgent extends BaseAgent {
  constructor() {
    super({
      name: 'content-brief',
      description:
        'Generates structured content briefs and first drafts using keyword data, competitor analysis, and LWM regulatory domain knowledge. Ensures every piece references specific EU regulation articles and uses industry-specific terminology.',
      capabilities: [
        'content-brief-generation',
        'content-drafting',
        'seo-optimization',
        'regulatory-referencing',
        'schema-markup',
      ],
      model: 'llama-3.3-70b-versatile',
      modelTier: 'standard',
    });
  }

  async execute(
    context: AgentContext,
    input: Record<string, unknown>,
  ): Promise<AgentResponse> {
    const startTime = Date.now();
    const typedInput = input as unknown as ContentBriefInput;

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
      const output = await this.generateBrief(typedInput);
      const durationMs = Date.now() - startTime;

      const response: AgentResponse = {
        agentName: this.config.name,
        result: output as unknown as Record<string, unknown>,
        confidence: 0.7,
        reasoning: `Generated content brief for "${typedInput.targetKeyword.keyword}" (${typedInput.targetKeyword.funnelStage}). ` +
          `Brief includes ${output.brief.outline.length} sections, ${output.brief.internalLinks.length} internal links, ` +
          `and ${output.brief.ctaPlacement.length} CTAs. Draft is ${output.draft.wordCount} words.`,
        recommendations: [...new Set(this.generateRecommendations(typedInput, output))],
        metadata: {
          durationMs,
          targetKeyword: typedInput.targetKeyword.keyword,
          contentType: typedInput.targetKeyword.suggestedContentType,
          regulationsReferenced: typedInput.lwmContext.regulations.map((r) => r.name),
          draftWordCount: output.draft.wordCount,
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

  private async generateBrief(input: ContentBriefInput): Promise<ContentBriefOutput> {
    const { targetKeyword, lwmContext, relevantProducts, competitorContent } = input;

    // Build the prompt for the LLM
    const regulatoryContext = lwmContext.regulations
      .map((r) => `${r.name}: ${r.keyRequirements.join(', ')}`)
      .join('\n');

    const competitorContext = competitorContent
      ? competitorContent
          .map((c) => `${c.competitorName}: "${c.title}" (${c.wordCount} words, headings: ${c.headings.join(', ')})`)
          .join('\n')
      : 'No competitor content available.';

    const productContext = relevantProducts
      .map((p) => `${p.name} (${p.sku}): ${p.price} — ${p.features.slice(0, 3).join(', ')}`)
      .join('\n');

    const prompt = `Generate a structured SEO content brief and draft for the keyword "${targetKeyword.keyword}".

Context:
- Funnel stage: ${targetKeyword.funnelStage}
- Content type: ${targetKeyword.suggestedContentType}
- Search volume: ${targetKeyword.searchVolume}
- Cluster: ${targetKeyword.cluster}

Regulatory knowledge:
${regulatoryContext}

Competitor content:
${competitorContext}

DWS products to reference:
${productContext}

Requirements:
1. Title must contain the primary keyword
2. Meta description must be under 160 characters
3. Include 3-5 secondary keywords
4. Outline 4-6 H2 sections with key points
5. Reference specific regulation articles (not generic "compliance")
6. Include 2-3 internal links to DWS product pages
7. Place 2 CTAs (intro/mid or mid/conclusion)
8. Suggest schema markup type

Respond in JSON with this structure:
{
  "title": "...",
  "metaDescription": "...",
  "secondaryKeywords": [...],
  "outline": [{"heading": "...", "level": 2, "keyPoints": [...], "regulatoryReferences": [...], "wordCountTarget": N}],
  "internalLinks": [{"anchorText": "...", "targetUrl": "...", "context": "..."}],
  "ctaPlacement": [{"position": "...", "type": "...", "product": "...", "text": "..."}],
  "schemaType": "Article|HowTo|FAQ|Product",
  "draft": "markdown content here",
  "differentiators": [...]
}`;

    const llmResponse = await this.callLLM(prompt);

    try {
      const parsed = JSON.parse(llmResponse.content);
      return this.structureOutput(parsed, targetKeyword);
    } catch {
      // LLM response couldn't be parsed — return a deterministic fallback brief
      return this.fallbackBrief(targetKeyword, lwmContext, relevantProducts);
    }
  }

  private structureOutput(
    parsed: Record<string, any>,
    targetKeyword: ContentBriefInput['targetKeyword'],
  ): ContentBriefOutput {
    const draftMarkdown = parsed.draft || '';
    const draftWordCount = draftMarkdown.split(/\s+/).filter(Boolean).length;

    return {
      brief: {
        title: parsed.title || `${targetKeyword.keyword} — Complete Guide`,
        metaDescription: (parsed.metaDescription || '').slice(0, 160),
        targetKeyword: targetKeyword.keyword,
        secondaryKeywords: parsed.secondaryKeywords || [],
        funnelStage: targetKeyword.funnelStage,
        contentType: targetKeyword.suggestedContentType,
        targetWordCount: this.targetWordCount(targetKeyword.suggestedContentType),
        outline: (parsed.outline || []).map((s: any) => ({
          heading: s.heading || '',
          level: s.level || 2,
          keyPoints: s.keyPoints || [],
          regulatoryReferences: s.regulatoryReferences || [],
          wordCountTarget: s.wordCountTarget || 400,
        })),
        internalLinks: parsed.internalLinks || [],
        ctaPlacement: parsed.ctaPlacement || [],
        schemaMarkup: {
          type: parsed.schemaType || 'Article',
          properties: {
            headline: parsed.title || targetKeyword.keyword,
            author: 'Lifetime Oy',
            publisher: 'DWS IQ 6',
          },
        },
      },
      draft: {
        html: '',
        markdown: draftMarkdown,
        wordCount: draftWordCount,
        readabilityScore: 0,
        keywordDensity: this.calculateKeywordDensity(draftMarkdown, targetKeyword.keyword),
      },
      differentiators: parsed.differentiators || [],
    };
  }

  private fallbackBrief(
    targetKeyword: ContentBriefInput['targetKeyword'],
    lwmContext: ContentBriefInput['lwmContext'],
    products: ContentBriefInput['relevantProducts'],
  ): ContentBriefOutput {
    const regulations = lwmContext.regulations.map((r) => r.name).join(', ');
    const productNames = products.map((p) => p.name).join(', ');

    return {
      brief: {
        title: `${targetKeyword.keyword} — Complete Guide for EU Industries`,
        metaDescription: `Learn about ${targetKeyword.keyword}. Covering ${regulations} requirements for EU-regulated industries.`.slice(0, 160),
        targetKeyword: targetKeyword.keyword,
        secondaryKeywords: lwmContext.regulations.map((r) => r.name.toLowerCase()),
        funnelStage: targetKeyword.funnelStage,
        contentType: targetKeyword.suggestedContentType,
        targetWordCount: this.targetWordCount(targetKeyword.suggestedContentType),
        outline: [
          {
            heading: `What is ${targetKeyword.keyword}?`,
            level: 2,
            keyPoints: ['Definition', 'Regulatory context', 'Why it matters for EU industries'],
            regulatoryReferences: lwmContext.regulations.flatMap((r) => r.relevantArticles.slice(0, 2)),
            wordCountTarget: 400,
          },
          {
            heading: 'Regulatory Requirements',
            level: 2,
            keyPoints: lwmContext.regulations.flatMap((r) => r.keyRequirements.slice(0, 3)),
            regulatoryReferences: lwmContext.regulations.flatMap((r) => r.relevantArticles),
            wordCountTarget: 600,
          },
          {
            heading: 'Industry Impact',
            level: 2,
            keyPoints: lwmContext.industries.map((i) => `${i.name}: ${i.complianceRequirements[0] || 'compliance requirements'}`),
            regulatoryReferences: [],
            wordCountTarget: 500,
          },
          {
            heading: `How DWS IQ 6 Addresses ${targetKeyword.keyword}`,
            level: 2,
            keyPoints: products.flatMap((p) => p.features.slice(0, 2)),
            regulatoryReferences: [],
            wordCountTarget: 400,
          },
        ],
        internalLinks: products.map((p) => ({
          anchorText: p.name,
          targetUrl: p.ctaUrl,
          context: `Learn more about ${p.name}`,
        })),
        ctaPlacement: [
          {
            position: 'mid',
            type: 'demo-request',
            product: products[0]?.name || 'DWS IQ 6',
            text: `See how ${products[0]?.name || 'DWS IQ 6'} automates ${targetKeyword.keyword}`,
          },
          {
            position: 'conclusion',
            type: 'contact',
            product: 'DWS IQ 6',
            text: 'Start your compliance automation journey',
          },
        ],
        schemaMarkup: {
          type: 'Article',
          properties: {
            headline: `${targetKeyword.keyword} — Complete Guide`,
            author: 'Lifetime Oy',
            publisher: 'DWS IQ 6',
          },
        },
      },
      draft: {
        html: '',
        markdown: `# ${targetKeyword.keyword}\n\n*Draft generated by Content Brief Agent. LLM unavailable — using deterministic brief.*\n\nRelevant regulations: ${regulations}\nRelevant products: ${productNames}`,
        wordCount: 20,
        readabilityScore: 0,
        keywordDensity: 0,
      },
      differentiators: [
        'Regulatory depth: references specific EU regulation articles',
        `Industry-specific language from ${lwmContext.industries.length} industries`,
        'EU data residency and sovereignty positioning',
      ],
    };
  }

  private targetWordCount(contentType: string): number {
    const targets: Record<string, number> = {
      blog: 2000,
      'landing-page': 1500,
      'case-study': 1200,
      'product-page': 1000,
      comparison: 2500,
    };
    return targets[contentType] || 2000;
  }

  private calculateKeywordDensity(text: string, keyword: string): number {
    if (!text || !keyword) return 0;
    const words = text.split(/\s+/).filter(Boolean);
    if (words.length === 0) return 0;
    const keywordLower = keyword.toLowerCase();
    const occurrences = text.toLowerCase().split(keywordLower).length - 1;
    return occurrences / words.length;
  }

  private generateRecommendations(
    input: ContentBriefInput,
    output: ContentBriefOutput,
  ): string[] {
    const recs: string[] = [];

    if (output.draft.wordCount < output.brief.targetWordCount * 0.5) {
      recs.push(
        `Draft is ${output.draft.wordCount} words — target is ${output.brief.targetWordCount}. Expand the draft before publishing.`,
      );
    }

    if (output.brief.internalLinks.length < 2) {
      recs.push('Add at least 2 internal links to DWS product pages.');
    }

    if (input.competitorContent && input.competitorContent.length > 0) {
      const avgCompetitorWords = Math.round(
        input.competitorContent.reduce((sum, c) => sum + c.wordCount, 0) /
          input.competitorContent.length,
      );
      if (output.brief.targetWordCount < avgCompetitorWords) {
        recs.push(
          `Competitors average ${avgCompetitorWords} words. Consider increasing target word count.`,
        );
      }
    }

    return recs;
  }
}
