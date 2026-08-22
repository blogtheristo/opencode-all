/**
 * Lead-to-SEO Feedback Agent — Reads closed-won CRM records,
 * extracts language patterns from converted customers, and
 * feeds these back to the Keyword Intent Agent.
 *
 * This closes the SEO-to-sales loop. Most teams never do this.
 *
 * Execution cadence: Monthly (1st of each month, 06:00 UTC)
 *
 * See docs/SEO_SALES_AGENT_SPECIFICATION.md § 2.5
 */

import { BaseAgent } from '../base.agent.js';
import type { AgentContext, AgentResponse } from '../types.js';
import type { FunnelStage, LeadFeedbackInput, LeadFeedbackOutput } from './types.js';

export class LeadFeedbackAgent extends BaseAgent {
  constructor() {
    super({
      name: 'lead-feedback',
      description:
        'Reads closed-won CRM records, extracts buyer language patterns and pain points, and feeds keyword suggestions and score adjustments back to the Keyword Intent Agent. Closes the SEO-to-sales loop.',
      capabilities: [
        'buyer-language-extraction',
        'keyword-suggestion',
        'score-adjustment',
        'content-performance-analysis',
        'industry-correlation',
      ],
      model: 'llama-3.3-70b-versatile',
      modelTier: 'lite',
    });
  }

  async execute(
    context: AgentContext,
    input: Record<string, unknown>,
  ): Promise<AgentResponse> {
    const startTime = Date.now();
    const typedInput = input as unknown as LeadFeedbackInput;

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
      const output = await this.analyzeFeedback(typedInput);
      const durationMs = Date.now() - startTime;

      const response: AgentResponse = {
        agentName: this.config.name,
        result: output as unknown as Record<string, unknown>,
        confidence: this.calculateConfidence(typedInput),
        reasoning: this.generateReasoning(typedInput, output),
        recommendations: [...new Set(this.generateRecommendations(output))],
        metadata: {
          durationMs,
          dealsAnalyzed: typedInput.closedWonDeals.length,
          organicDeals: typedInput.closedWonDeals.filter(
            (d) => d.attribution.channel === 'organic',
          ).length,
          newKeywordSuggestions: output.newKeywordSuggestions.length,
          scoreAdjustments: output.scoreAdjustments.length,
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

  private async analyzeFeedback(
    input: LeadFeedbackInput,
  ): Promise<LeadFeedbackOutput> {
    const { closedWonDeals, currentKeywords, contentPerformance } = input;

    // 1. Extract buyer language patterns
    const newKeywordSuggestions = this.extractBuyerLanguageKeywords(closedWonDeals);

    // 2. Calculate score adjustments based on conversion data
    const scoreAdjustments = this.calculateScoreAdjustments(
      closedWonDeals,
      currentKeywords,
    );

    // 3. Analyze content performance
    const contentInsights = this.analyzeContentPerformance(contentPerformance);

    // 4. Correlate industries to deals
    const industryCorrelation = this.correlateIndustries(closedWonDeals);

    // 5. Calculate loop metrics
    const loopMetrics = this.calculateLoopMetrics(closedWonDeals, contentPerformance);

    return {
      newKeywordSuggestions,
      scoreAdjustments,
      contentInsights,
      industryCorrelation,
      loopMetrics,
    };
  }

  private extractBuyerLanguageKeywords(
    deals: LeadFeedbackInput['closedWonDeals'],
  ): LeadFeedbackOutput['newKeywordSuggestions'] {
    // Count frequency of buyer language phrases across deals
    const phraseFrequency = new Map<
      string,
      { count: number; totalValue: number; source: 'buyer-language' | 'pain-point' }
    >();

    for (const deal of deals) {
      // Extract from buyer language
      for (const phrase of deal.buyerLanguage) {
        const normalized = phrase.toLowerCase().trim();
        const existing = phraseFrequency.get(normalized);
        if (existing) {
          existing.count += 1;
          existing.totalValue += deal.dealSize;
        } else {
          phraseFrequency.set(normalized, {
            count: 1,
            totalValue: deal.dealSize,
            source: 'buyer-language',
          });
        }
      }

      // Extract from pain points
      for (const painPoint of deal.painPoints) {
        const normalized = painPoint.toLowerCase().trim();
        const existing = phraseFrequency.get(normalized);
        if (existing) {
          existing.count += 1;
          existing.totalValue += deal.dealSize;
        } else {
          phraseFrequency.set(normalized, {
            count: 1,
            totalValue: deal.dealSize,
            source: 'pain-point',
          });
        }
      }
    }

    // Convert to keyword suggestions, sorted by frequency × deal value
    return Array.from(phraseFrequency.entries())
      .map(([keyword, data]) => ({
        keyword,
        source: data.source,
        frequency: data.count,
        suggestedFunnelStage: this.inferFunnelStage(keyword),
        dealValueAssociated: data.totalValue,
        priority: this.priorityFromFrequencyAndValue(data.count, data.totalValue) as
          | 'high'
          | 'medium'
          | 'low',
      }))
      .sort((a, b) => b.dealValueAssociated - a.dealValueAssociated);
  }

  private calculateScoreAdjustments(
    deals: LeadFeedbackInput['closedWonDeals'],
    currentKeywords: LeadFeedbackInput['currentKeywords'],
  ): LeadFeedbackOutput['scoreAdjustments'] {
    const adjustments: LeadFeedbackOutput['scoreAdjustments'] = [];

    // Group organic deals by their attributed search query
    const keywordDeals = new Map<string, { count: number; totalValue: number }>();
    for (const deal of deals) {
      if (deal.attribution.channel === 'organic' && deal.attribution.searchQuery) {
        const kw = deal.attribution.searchQuery.toLowerCase();
        const existing = keywordDeals.get(kw);
        if (existing) {
          existing.count += 1;
          existing.totalValue += deal.dealSize;
        } else {
          keywordDeals.set(kw, { count: 1, totalValue: deal.dealSize });
        }
      }
    }

    // Adjust scores for keywords that generated revenue
    for (const keyword of currentKeywords) {
      const dealData = keywordDeals.get(keyword.keyword.toLowerCase());
      if (dealData) {
        // Boost score based on revenue attribution
        const revenueBoost = Math.min(0.3, dealData.totalValue / 50000);
        const frequencyBoost = Math.min(0.2, dealData.count * 0.05);
        const adjustedScore = Math.min(1, keyword.compositeScore + revenueBoost + frequencyBoost);

        adjustments.push({
          keyword: keyword.keyword,
          currentScore: keyword.compositeScore,
          adjustedScore,
          reason: `${dealData.count} closed-won deal(s) attributed to this keyword (€${dealData.totalValue.toLocaleString()} total ARR)`,
        });
      }
    }

    return adjustments;
  }

  private analyzeContentPerformance(
    content: LeadFeedbackInput['contentPerformance'],
  ): LeadFeedbackOutput['contentInsights'] {
    return content.map((page) => {
      let recommendation: 'boost' | 'optimize' | 'retire' | 'repurpose';
      const suggestedChanges: string[] = [];

      if (page.conversionRate > 0.05) {
        recommendation = 'boost';
        suggestedChanges.push('Increase internal links pointing to this page.');
        suggestedChanges.push('Create supporting content that links to this page.');
      } else if (page.conversionRate > 0.02) {
        recommendation = 'optimize';
        if (page.bounceRate > 0.6) {
          suggestedChanges.push('Improve above-the-fold content to reduce bounce rate.');
        }
        if (page.avgTimeOnPage < 60) {
          suggestedChanges.push('Add more depth — readers leave too quickly.');
        }
        suggestedChanges.push('Strengthen CTAs and add more conversion points.');
      } else if (page.organicSessions > 100 && page.conversionRate < 0.01) {
        recommendation = 'optimize';
        suggestedChanges.push('High traffic but low conversion. Add relevant CTAs.');
        suggestedChanges.push('Test different CTA placements and copy.');
      } else if (page.organicSessions < 10) {
        recommendation = 'retire';
        suggestedChanges.push('Very low traffic. Consider merging with a higher-performing page.');
      } else {
        recommendation = 'repurpose';
        suggestedChanges.push('Moderate traffic/conversion. Consider updating with fresh data.');
      }

      return {
        url: page.url,
        conversionRate: page.conversionRate,
        recommendation,
        suggestedChanges,
      };
    });
  }

  private correlateIndustries(
    deals: LeadFeedbackInput['closedWonDeals'],
  ): LeadFeedbackOutput['industryCorrelation'] {
    const industryMap = new Map<
      string,
      {
        dealCount: number;
        totalArv: number;
        keywords: Set<string>;
      }
    >();

    for (const deal of deals) {
      const industry = deal.industry.toLowerCase();
      const existing = industryMap.get(industry);

      if (existing) {
        existing.dealCount += 1;
        existing.totalArv += deal.dealSize;
        for (const kw of deal.buyerLanguage) existing.keywords.add(kw.toLowerCase());
      } else {
        industryMap.set(industry, {
          dealCount: 1,
          totalArv: deal.dealSize,
          keywords: new Set(deal.buyerLanguage.map((kw) => kw.toLowerCase())),
        });
      }
    }

    return Array.from(industryMap.entries())
      .map(([industry, data]) => ({
        industry,
        dealCount: data.dealCount,
        totalArv: data.totalArv,
        topKeywords: Array.from(data.keywords).slice(0, 10),
        contentGaps: [] as string[],
      }))
      .sort((a, b) => b.totalArv - a.totalArv);
  }

  private calculateLoopMetrics(
    deals: LeadFeedbackInput['closedWonDeals'],
    content: LeadFeedbackInput['contentPerformance'],
  ): LeadFeedbackOutput['loopMetrics'] {
    const organicDeals = deals.filter((d) => d.attribution.channel === 'organic');
    const paidDeals = deals.filter((d) => d.attribution.channel === 'paid');

    const avgDealSizeOrganic =
      organicDeals.length > 0
        ? organicDeals.reduce((sum, d) => sum + d.dealSize, 0) / organicDeals.length
        : 0;

    const avgDealSizePaid =
      paidDeals.length > 0
        ? paidDeals.reduce((sum, d) => sum + d.dealSize, 0) / paidDeals.length
        : 0;

    // Build keyword → revenue map
    const keywordToRevenue: Record<string, number> = {};
    for (const deal of organicDeals) {
      if (deal.attribution.searchQuery) {
        const kw = deal.attribution.searchQuery.toLowerCase();
        keywordToRevenue[kw] = (keywordToRevenue[kw] || 0) + deal.dealSize;
      }
    }

    // Find top converting content
    const topConvertingContent = content
      .filter((c) => c.conversions > 0)
      .sort((a, b) => b.conversions - a.conversions)
      .slice(0, 5)
      .map((c) => c.url);

    return {
      organicLeadToClose: deals.length > 0 ? organicDeals.length / deals.length : 0,
      avgDealSizeOrganic,
      avgDealSizePaid,
      topConvertingContent,
      keywordToRevenue,
    };
  }

  private inferFunnelStage(keyword: string): FunnelStage {
    if (/pricing|cost|buy|demo|trial/i.test(keyword)) return 'bofu';
    if (/how|implementation|comparison|vs|tool|software/i.test(keyword)) return 'mofu';
    return 'tofu';
  }

  private priorityFromFrequencyAndValue(frequency: number, value: number): string {
    if (frequency >= 3 || value >= 30000) return 'high';
    if (frequency >= 2 || value >= 15000) return 'medium';
    return 'low';
  }

  private calculateConfidence(input: LeadFeedbackInput): number {
    if (input.closedWonDeals.length >= 10) return 0.9;
    if (input.closedWonDeals.length >= 5) return 0.7;
    if (input.closedWonDeals.length >= 2) return 0.5;
    return 0.3;
  }

  private generateReasoning(
    input: LeadFeedbackInput,
    output: LeadFeedbackOutput,
  ): string {
    const organicCount = input.closedWonDeals.filter(
      (d) => d.attribution.channel === 'organic',
    ).length;

    return (
      `Analyzed ${input.closedWonDeals.length} closed-won deals (${organicCount} from organic). ` +
      `Extracted ${output.newKeywordSuggestions.length} new keyword suggestions from buyer language. ` +
      `Proposed ${output.scoreAdjustments.length} keyword score adjustments based on revenue data. ` +
      `Organic lead-to-close rate: ${(output.loopMetrics.organicLeadToClose * 100).toFixed(1)}%.`
    );
  }

  private generateRecommendations(output: LeadFeedbackOutput): string[] {
    const recs: string[] = [];

    const highPriority = output.newKeywordSuggestions.filter((s) => s.priority === 'high');
    if (highPriority.length > 0) {
      recs.push(
        `${highPriority.length} high-priority keyword suggestions from buyer language. Top: "${highPriority[0].keyword}" (€${highPriority[0].dealValueAssociated.toLocaleString()} attributed).`,
      );
    }

    const boostContent = output.contentInsights.filter((c) => c.recommendation === 'boost');
    if (boostContent.length > 0) {
      recs.push(
        `${boostContent.length} high-converting pages to boost: ${boostContent.map((c) => c.url).join(', ')}.`,
      );
    }

    if (output.loopMetrics.avgDealSizeOrganic > output.loopMetrics.avgDealSizePaid) {
      recs.push(
        `Organic deals are worth €${output.loopMetrics.avgDealSizeOrganic.toLocaleString()} vs paid €${output.loopMetrics.avgDealSizePaid.toLocaleString()}. Increase organic investment.`,
      );
    }

    const topIndustry = output.industryCorrelation[0];
    if (topIndustry) {
      recs.push(
        `Top converting industry: ${topIndustry.industry} (${topIndustry.dealCount} deals, €${topIndustry.totalArv.toLocaleString()} ARR). Create industry-specific content.`,
      );
    }

    return recs;
  }
}
