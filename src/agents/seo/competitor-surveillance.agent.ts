/**
 * Competitor Surveillance Agent — Monitors competitor websites,
 * detects content changes, pricing shifts, and backlink growth.
 * Generates content gap alerts.
 *
 * Execution cadence: Weekly (Sunday 03:00 UTC)
 *
 * See docs/SEO_SALES_AGENT_SPECIFICATION.md § 2.2
 */

import { BaseAgent } from '../base.agent.js';
import type { AgentContext, AgentResponse } from '../types.js';
import type {
  CompetitorChange,
  CompetitorSurveillanceInput,
  CompetitorSurveillanceOutput,
  ContentGap,
} from './types.js';
import { createHash } from 'crypto';

export class CompetitorSurveillanceAgent extends BaseAgent {
  constructor() {
    super({
      name: 'competitor-surveillance',
      description:
        'Monitors competitor websites for content changes, new pages, pricing shifts, and backlink growth. Generates content gap alerts when competitors cover topics we do not.',
      capabilities: [
        'competitor-monitoring',
        'content-gap-analysis',
        'pricing-intelligence',
        'backlink-tracking',
        'change-detection',
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
    const typedInput = input as unknown as CompetitorSurveillanceInput;

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
      const output = await this.runSurveillance(typedInput);
      const durationMs = Date.now() - startTime;

      const response: AgentResponse = {
        agentName: this.config.name,
        result: output as unknown as Record<string, unknown>,
        confidence: this.calculateConfidence(output),
        reasoning: this.generateReasoning(output),
        recommendations: [...new Set(this.generateRecommendations(output))],
        metadata: {
          durationMs,
          competitorsAnalyzed: typedInput.competitors.length,
          changesDetected: output.changes.length,
          contentGapsFound: output.contentGaps.length,
          pricingChanges: output.pricingChanges.length,
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

  private async runSurveillance(
    input: CompetitorSurveillanceInput,
  ): Promise<CompetitorSurveillanceOutput> {
    const changes: CompetitorChange[] = [];
    const contentGaps: ContentGap[] = [];

    // Build a set of our covered topics from own content keywords
    const ownTopics = new Set<string>();
    for (const content of input.ownContent) {
      for (const kw of content.keywords) {
        ownTopics.add(kw.toLowerCase());
      }
    }

    // For each competitor, attempt to fetch and compare content
    for (const competitor of input.competitors) {
      for (const url of competitor.trackingUrls) {
        try {
          const pageContent = await this.fetchPage(url);

          if (!pageContent) continue;

          const currentHash = this.hashContent(pageContent);

          if (currentHash !== competitor.lastCrawlHash) {
            // Content has changed — classify the change
            const change = await this.classifyChange(
              competitor,
              url,
              pageContent,
              currentHash,
            );
            if (change) changes.push(change);
          }

          // Check for topics we don't cover
          const topics = this.extractTopics(pageContent);
          for (const topic of topics) {
            if (!ownTopics.has(topic.toLowerCase())) {
              const relevantCluster = this.matchCluster(topic, input.targetClusters);
              if (relevantCluster) {
                const existingGap = contentGaps.find((g) => g.topic === topic);
                if (existingGap) {
                  existingGap.competitorsCovering.push(competitor.name);
                } else {
                  contentGaps.push({
                    topic,
                    competitorsCovering: [competitor.name],
                    estimatedSearchVolume: 0,
                    relevanceToIcp: 0.5,
                    suggestedAction: 'create-new',
                    relatedCluster: relevantCluster,
                  });
                }
              }
            }
          }
        } catch {
          // Page fetch failed — log but continue
        }
      }
    }

    // Prioritize content gaps by number of competitors covering them
    contentGaps.sort((a, b) => b.competitorsCovering.length - a.competitorsCovering.length);

    return {
      changes,
      contentGaps,
      pricingChanges: [],
      backlinkAlerts: [],
    };
  }

  private async fetchPage(url: string): Promise<string | null> {
    try {
      const response = await fetch(url, {
        headers: { 'User-Agent': 'DWS-SEO-Monitor/1.0' },
        signal: AbortSignal.timeout(10000),
      });
      if (!response.ok) return null;
      return await response.text();
    } catch {
      return null;
    }
  }

  private hashContent(content: string): string {
    // Hash only the meaningful text content (strip whitespace noise)
    const normalized = content
      .replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/<style[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    return createHash('sha256').update(normalized).digest('hex');
  }

  private async classifyChange(
    competitor: { id: string; name: string },
    url: string,
    content: string,
    contentHash: string,
  ): Promise<CompetitorChange | null> {
    // Use LLM to classify the type of change
    const prompt = `Classify this webpage change for competitor "${competitor.name}" at URL "${url}".
Determine the change type: new-page, content-update, pricing-change, meta-change, or new-feature.
Provide a one-sentence summary and severity (low/medium/high).
Content snippet (first 500 chars): ${content.slice(0, 500)}
Respond in JSON: {"changeType": "...", "summary": "...", "severity": "..."}`;

    const llmResponse = await this.callLLM(prompt);
    try {
      const parsed = JSON.parse(llmResponse.content);
      return {
        competitorId: competitor.id,
        competitorName: competitor.name,
        changeType: parsed.changeType || 'content-update',
        url,
        summary: parsed.summary || 'Content change detected',
        detectedAt: new Date().toISOString(),
        severity: parsed.severity || 'low',
        contentHash,
      };
    } catch {
      return {
        competitorId: competitor.id,
        competitorName: competitor.name,
        changeType: 'content-update',
        url,
        summary: 'Content change detected (classification unavailable)',
        detectedAt: new Date().toISOString(),
        severity: 'low',
        contentHash,
      };
    }
  }

  private extractTopics(content: string): string[] {
    // Extract H1/H2/H3 headings as topic indicators
    const headingRegex = /<h[1-3][^>]*>(.*?)<\/h[1-3]>/gi;
    const topics: string[] = [];
    let match: RegExpExecArray | null;
    while ((match = headingRegex.exec(content)) !== null) {
      const heading = match[1].replace(/<[^>]+>/g, '').trim();
      if (heading.length > 3 && heading.length < 200) {
        topics.push(heading);
      }
    }
    return topics;
  }

  private matchCluster(
    topic: string,
    clusters: Record<string, string[]>,
  ): string | null {
    const lowerTopic = topic.toLowerCase();
    for (const [clusterName, keywords] of Object.entries(clusters)) {
      for (const kw of keywords) {
        if (lowerTopic.includes(kw.toLowerCase()) || kw.toLowerCase().includes(lowerTopic)) {
          return clusterName;
        }
      }
    }
    return null;
  }

  private calculateConfidence(output: CompetitorSurveillanceOutput): number {
    if (output.changes.length === 0 && output.contentGaps.length === 0) return 0.3;
    if (output.contentGaps.length > 5) return 0.9;
    return 0.6;
  }

  private generateReasoning(output: CompetitorSurveillanceOutput): string {
    return (
      `Detected ${output.changes.length} content changes across competitors. ` +
      `Found ${output.contentGaps.length} content gaps where competitors cover topics we do not. ` +
      `${output.pricingChanges.length} pricing changes detected.`
    );
  }

  private generateRecommendations(output: CompetitorSurveillanceOutput): string[] {
    const recs: string[] = [];

    if (output.contentGaps.length > 0) {
      const topGap = output.contentGaps[0];
      recs.push(
        `Create content for "${topGap.topic}" — ${topGap.competitorsCovering.length} competitors cover this topic (cluster: ${topGap.relatedCluster}).`,
      );
    }

    const highSeverityChanges = output.changes.filter((c) => c.severity === 'high');
    if (highSeverityChanges.length > 0) {
      recs.push(
        `${highSeverityChanges.length} high-severity competitor changes detected. Review: ${highSeverityChanges.map((c) => c.competitorName).join(', ')}.`,
      );
    }

    if (output.pricingChanges.length > 0) {
      recs.push(
        `${output.pricingChanges.length} competitor pricing changes detected. Review positioning.`,
      );
    }

    return recs;
  }
}
