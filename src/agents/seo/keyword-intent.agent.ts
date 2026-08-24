/**
 * Keyword Intent Agent — Classifies search queries into funnel stages,
 * identifies quick-win keywords (rank 8–15), and produces a prioritized
 * keyword queue aligned to DWS ICP.
 *
 * Execution cadence: Nightly via node-cron (02:00 UTC)
 *
 * See docs/SEO_SALES_AGENT_SPECIFICATION.md § 2.1
 */

import { BaseAgent } from '../base.agent.js';
import type { AgentContext, AgentResponse } from '../types.js';
import type {
  ContentType,
  FunnelStage,
  KeywordIntentInput,
  KeywordIntentOutput,
  PriorityKeyword,
} from './types.js';

/** Patterns used to classify queries into funnel stages */
const FUNNEL_PATTERNS: Record<FunnelStage, RegExp[]> = {
  tofu: [
    /\bwhat is\b/i,
    /\bguide\b/i,
    /\boverview\b/i,
    /\bexplained\b/i,
    /\bintroduction\b/i,
    /\bbasics\b/i,
    /\bdefinition\b/i,
  ],
  mofu: [
    /\bvs\b/i,
    /\bcompar/i,
    /\bbest\b/i,
    /\bhow to\b/i,
    /\brequirements\b/i,
    /\bcompliance\b/i,
    /\bimplementation\b/i,
    /\btools?\b/i,
    /\bsoftware\b/i,
  ],
  bofu: [
    /\bpricing\b/i,
    /\bdemo\b/i,
    /\bbuy\b/i,
    /\bpurchase\b/i,
    /\bcost\b/i,
    /\btrial\b/i,
    /\breview\b/i,
    /\bsign up\b/i,
  ],
};

/** Regulatory keyword clusters */
const REGULATORY_CLUSTERS: Record<string, RegExp> = {
  'fit-for-55': /fit.?for.?55|fit.?für.?55/i,
  'csrd-reporting': /csrd|corporate sustainability reporting/i,
  'cbam': /cbam|carbon border adjustment/i,
  'ets-compliance': /\bets\b|emissions trading/i,
  'nis2-compliance': /nis2|network.?security directive/i,
  'eu-ai-act': /\bai act\b|article 12/i,
  'construction-carbon': /embodied carbon|en 15978|construction carbon/i,
  'data-protection': /gdpr|data protection/i,
  'green-claims': /green claims|greenwashing/i,
  'epbd': /epbd|energy performance.*buildings/i,
};

/** Content type suggestion based on funnel stage and keyword properties */
function suggestContentType(stage: FunnelStage, keyword: string): ContentType {
  if (stage === 'bofu') {
    if (/vs|compar/i.test(keyword)) return 'comparison';
    if (/pricing|cost|buy/i.test(keyword)) return 'product-page';
    return 'case-study';
  }
  if (stage === 'mofu') {
    if (/vs|compar/i.test(keyword)) return 'comparison';
    if (/how to|implementation/i.test(keyword)) return 'blog';
    return 'landing-page';
  }
  return 'blog';
}

export class KeywordIntentAgent extends BaseAgent {
  constructor() {
    super({
      name: 'keyword-intent',
      description:
        'Classifies search queries into TOFU/MOFU/BOFU funnel stages, identifies quick-win keywords (rank 8-15), and produces a prioritized keyword queue aligned to DWS ICP.',
      capabilities: [
        'keyword-classification',
        'funnel-analysis',
        'quick-win-detection',
        'icp-matching',
        'keyword-clustering',
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
    const typedInput = input as unknown as KeywordIntentInput;

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
      const output = await this.classifyKeywords(typedInput);
      const durationMs = Date.now() - startTime;

      const response: AgentResponse = {
        agentName: this.config.name,
        result: output as unknown as Record<string, unknown>,
        confidence: this.calculateConfidence(output),
        reasoning: this.generateReasoning(output),
        recommendations: [...new Set(this.generateRecommendations(output))],
        metadata: {
          durationMs,
          queriesProcessed: typedInput.searchConsoleData.queries.length,
          quickWinsFound: output.quickWins.length,
          clustersIdentified: Object.keys(output.clusters).length,
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

  private async classifyKeywords(
    input: KeywordIntentInput,
  ): Promise<KeywordIntentOutput> {
    const { queries } = input.searchConsoleData;
    const icpRegulations = new Set(input.icpProfile.regulations.map((r) => r.toLowerCase()));
    const icpIndustries = new Set(input.icpProfile.industries.map((i) => i.toLowerCase()));

    const priorityQueue: PriorityKeyword[] = [];
    const clusters: Record<string, string[]> = {};
    const funnelCounts: Record<FunnelStage, { count: number; totalPosition: number }> = {
      tofu: { count: 0, totalPosition: 0 },
      mofu: { count: 0, totalPosition: 0 },
      bofu: { count: 0, totalPosition: 0 },
    };

    for (const query of queries) {
      const funnelStage = this.classifyFunnelStage(query.query);
      const cluster = this.identifyCluster(query.query);
      const icpRelevance = this.scoreIcpRelevance(query.query, icpRegulations, icpIndustries);
      const isQuickWin = query.position >= 8 && query.position <= 15;

      // Merge with external keyword data if available
      const externalData = input.externalKeywords?.find(
        (ek) => ek.keyword.toLowerCase() === query.query.toLowerCase(),
      );

      const searchVolume = externalData?.searchVolume ?? Math.round(query.impressions / 30);
      const difficulty = externalData?.difficulty ?? this.estimateDifficulty(query);

      const compositeScore = this.calculateCompositeScore({
        position: query.position,
        searchVolume,
        difficulty,
        icpRelevance,
        isQuickWin,
        ctr: query.ctr,
      });

      const keyword: PriorityKeyword = {
        keyword: query.query,
        funnelStage,
        currentPosition: query.position,
        searchVolume,
        difficulty,
        icpRelevance,
        quickWin: isQuickWin,
        compositeScore,
        cluster,
        suggestedContentType: suggestContentType(funnelStage, query.query),
      };

      priorityQueue.push(keyword);

      // Update cluster map
      if (!clusters[cluster]) clusters[cluster] = [];
      clusters[cluster].push(query.query);

      // Update funnel counts
      funnelCounts[funnelStage].count += 1;
      funnelCounts[funnelStage].totalPosition += query.position;
    }

    // Sort by composite score descending
    priorityQueue.sort((a, b) => b.compositeScore - a.compositeScore);

    // Build quick-wins list
    const quickWins = priorityQueue
      .filter((k): k is PriorityKeyword & { currentPosition: number } => k.quickWin && k.currentPosition !== null)
      .map((k) => ({
        keyword: k.keyword,
        currentPosition: k.currentPosition,
        estimatedClicksGain: this.estimateClicksGain(k.currentPosition, k.searchVolume),
        effort: this.estimateEffort(k) as 'low' | 'medium' | 'high',
      }));

    const funnelDistribution: Record<FunnelStage, { count: number; avgPosition: number }> = {
      tofu: {
        count: funnelCounts.tofu.count,
        avgPosition: funnelCounts.tofu.count > 0
          ? funnelCounts.tofu.totalPosition / funnelCounts.tofu.count
          : 0,
      },
      mofu: {
        count: funnelCounts.mofu.count,
        avgPosition: funnelCounts.mofu.count > 0
          ? funnelCounts.mofu.totalPosition / funnelCounts.mofu.count
          : 0,
      },
      bofu: {
        count: funnelCounts.bofu.count,
        avgPosition: funnelCounts.bofu.count > 0
          ? funnelCounts.bofu.totalPosition / funnelCounts.bofu.count
          : 0,
      },
    };

    return { priorityQueue, funnelDistribution, quickWins, clusters };
  }

  private classifyFunnelStage(query: string): FunnelStage {
    // Check BOFU first (highest intent), then MOFU, default to TOFU
    for (const pattern of FUNNEL_PATTERNS.bofu) {
      if (pattern.test(query)) return 'bofu';
    }
    for (const pattern of FUNNEL_PATTERNS.mofu) {
      if (pattern.test(query)) return 'mofu';
    }
    for (const pattern of FUNNEL_PATTERNS.tofu) {
      if (pattern.test(query)) return 'tofu';
    }
    // Default: if query contains a regulatory term with a product term, it's MOFU
    const hasRegTerm = Object.values(REGULATORY_CLUSTERS).some((r) => r.test(query));
    if (hasRegTerm) return 'mofu';
    return 'tofu';
  }

  private identifyCluster(query: string): string {
    for (const [cluster, pattern] of Object.entries(REGULATORY_CLUSTERS)) {
      if (pattern.test(query)) return cluster;
    }
    return 'uncategorized';
  }

  private scoreIcpRelevance(
    query: string,
    regulations: Set<string>,
    industries: Set<string>,
  ): number {
    let score = 0;
    const lowerQuery = query.toLowerCase();

    // Check regulatory alignment
    for (const reg of regulations) {
      if (lowerQuery.includes(reg)) {
        score += 0.3;
        break;
      }
    }

    // Check industry alignment
    for (const ind of industries) {
      if (lowerQuery.includes(ind)) {
        score += 0.3;
        break;
      }
    }

    // Check for EU/Europe context
    if (/\beu\b|europe|european|nordic/i.test(query)) {
      score += 0.2;
    }

    // Check for B2B intent signals
    if (/\benterprise\b|\bplatform\b|\bsoftware\b|\btool\b/i.test(query)) {
      score += 0.2;
    }

    return Math.min(score, 1.0);
  }

  private estimateDifficulty(query: { position: number; impressions: number }): number {
    // Rough heuristic: high impressions + low position = competitive keyword
    if (query.impressions > 10000) return 0.8;
    if (query.impressions > 5000) return 0.6;
    if (query.impressions > 1000) return 0.4;
    return 0.2;
  }

  private calculateCompositeScore(factors: {
    position: number;
    searchVolume: number;
    difficulty: number;
    icpRelevance: number;
    isQuickWin: boolean;
    ctr: number;
  }): number {
    const { position, searchVolume, difficulty, icpRelevance, isQuickWin, ctr } = factors;

    // Weighted scoring: ICP relevance is most important, then quick-win potential
    const positionScore = Math.max(0, 1 - position / 100);
    const volumeScore = Math.min(1, searchVolume / 5000);
    const difficultyPenalty = 1 - difficulty;
    const quickWinBonus = isQuickWin ? 0.2 : 0;
    const ctrScore = ctr;

    return (
      icpRelevance * 0.30 +
      volumeScore * 0.20 +
      difficultyPenalty * 0.15 +
      positionScore * 0.15 +
      quickWinBonus * 0.10 +
      ctrScore * 0.10
    );
  }

  private estimateClicksGain(currentPosition: number, searchVolume: number): number {
    // CTR estimates by position (approximation)
    const ctrByPosition: Record<number, number> = {
      1: 0.28, 2: 0.15, 3: 0.11, 4: 0.08, 5: 0.06,
      6: 0.05, 7: 0.04, 8: 0.035, 9: 0.03, 10: 0.025,
    };
    const currentCtr = currentPosition <= 10
      ? (ctrByPosition[currentPosition] ?? 0.02)
      : 0.01;
    const targetCtr = ctrByPosition[5] ?? 0.06; // target position 5
    return Math.round((targetCtr - currentCtr) * searchVolume);
  }

  private estimateEffort(keyword: PriorityKeyword): string {
    if (keyword.difficulty < 0.3) return 'low';
    if (keyword.difficulty < 0.6) return 'medium';
    return 'high';
  }

  private calculateConfidence(output: KeywordIntentOutput): number {
    if (output.priorityQueue.length === 0) return 0.1;
    if (output.quickWins.length > 3) return 0.9;
    if (output.quickWins.length > 0) return 0.7;
    return 0.5;
  }

  private generateReasoning(output: KeywordIntentOutput): string {
    const total = output.priorityQueue.length;
    const { tofu, mofu, bofu } = output.funnelDistribution;
    const quickWinCount = output.quickWins.length;
    const clusterCount = Object.keys(output.clusters).length;

    return (
      `Analyzed ${total} keywords. ` +
      `Funnel distribution: TOFU=${tofu.count}, MOFU=${mofu.count}, BOFU=${bofu.count}. ` +
      `Found ${quickWinCount} quick-win opportunities (position 8-15). ` +
      `Identified ${clusterCount} keyword clusters.`
    );
  }

  private generateRecommendations(output: KeywordIntentOutput): string[] {
    const recs: string[] = [];

    if (output.quickWins.length > 0) {
      const topQuickWin = output.quickWins[0];
      recs.push(
        `Optimize content for "${topQuickWin.keyword}" (position ${topQuickWin.currentPosition}) — estimated +${topQuickWin.estimatedClicksGain} clicks/month`,
      );
    }

    if (output.funnelDistribution.bofu.count < output.funnelDistribution.tofu.count * 0.2) {
      recs.push(
        'BOFU content is underrepresented. Create more product-page and comparison content to capture purchase-intent queries.',
      );
    }

    const largestCluster = Object.entries(output.clusters).sort(
      (a, b) => b[1].length - a[1].length,
    )[0];
    if (largestCluster) {
      recs.push(
        `Largest keyword cluster is "${largestCluster[0]}" (${largestCluster[1].length} keywords). Consider creating a pillar page for this topic.`,
      );
    }

    return recs;
  }
}
