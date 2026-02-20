/**
 * Emissions Data Analyst Agent - Natural Language Queries on Emissions Data
 *
 * Extracted from: github.com/Shubhamsaboo/awesome-llm-apps
 * Original file: starter_ai_agents/ai_data_analysis_agent/ai_data_analyst.py
 * Extraction date: 2026-02-11
 * Agent session: claude/deepwiki-agent-extraction-aS6Ub
 * Purpose: Analyze uploaded emissions/sustainability data via natural language queries
 * License: MIT (original repo)
 *
 * Pattern: Upload emissions data → preprocess → query engine → formatted results
 * Adapted from the Agno + DuckDB + Pandas pattern to DWS6 BaseAgent + LLM.
 *
 * Input: {
 *   query:    Natural language question about emissions data
 *   data:     Array of emission records (or reference to uploaded dataset)
 *   context:  "ets" | "csrd" | "cbam" | "en15978" | "general"
 * }
 *
 * Output: Analysis results with SQL-like query explanation, values, and recommendations
 *
 * Tier: 1 (read-only analysis, no mutations)
 */

import logger from '../utils/logger.js';
import { BaseAgent } from './base.agent.js';
import type { AgentContext, AgentResponse } from './types.js';

// ============ INPUT INTERFACE ============

interface EmissionRecord {
  facility?: string;
  scope?: 1 | 2 | 3;
  source?: string;
  amount: number;
  unit: string;
  period?: string;
  category?: string;
}

interface EmissionsDataAnalystInput {
  /** Natural language query about the emissions data */
  query: string;
  /** Emissions data records */
  data: EmissionRecord[];
  /** Regulatory context for analysis */
  context: 'ets' | 'csrd' | 'cbam' | 'en15978' | 'general';
}

// ============ REGULATORY THRESHOLDS ============

/** EU ETS Phase 4 thresholds and benchmarks */
const ETS_BENCHMARKS: Record<string, number> = {
  cement_clinker: 0.766,        // tCO2/t product
  steel_hot_metal: 1.328,       // tCO2/t product
  aluminium: 1.514,             // tCO2/t product
  refinery: 0.0295,             // tCO2/CWT
  electricity: 0.376,           // tCO2/MWh (EU average)
};

/** CSRD double materiality thresholds */
const CSRD_THRESHOLDS = {
  scope1_material: 10000,       // tCO2e - likely material if above
  scope2_material: 5000,        // tCO2e
  scope3_material: 25000,       // tCO2e
  intensity_high: 0.5,          // tCO2e per EUR million revenue
};

/** Unit strings recognised as tonne-scale CO2 equivalents for ETS cost calculation */
const ETS_TONNE_UNITS = new Set(['tCO2e', 'tco2e', 'tCO2', 'tco2', 't', 'tonne', 'tonnes', 'MT', 'mt']);

// ============ AGENT IMPLEMENTATION ============

export class EmissionsDataAnalystAgent extends BaseAgent {
  constructor() {
    super({
      name: 'emissions-data-analyst',
      description:
        'Analyzes emissions and sustainability data using natural language queries with EU regulatory context (ETS, CSRD, CBAM, EN 15978)',
      capabilities: [
        'emissions-analysis',
        'natural-language-query',
        'scope-breakdown',
        'ets-benchmark',
        'csrd-materiality',
        'cbam-assessment',
      ],
      model: 'llama-3.1-70b-versatile',
    });
  }

  async execute(
    context: AgentContext,
    input: Record<string, unknown>,
  ): Promise<AgentResponse> {
    const startTime = Date.now();

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
      const validated = this.validateInput(input);
      const stats = this.computeStatistics(validated.data);
      const regulatoryAnalysis = this.applyRegulatoryContext(stats, validated.context);

      // Use LLM for natural language interpretation
      const llmAnalysis = await this.queryWithLLM(
        validated.query,
        stats,
        regulatoryAnalysis,
        validated.context,
      );

      const confidence = this.calculateConfidence(validated.data.length, validated.context);

      const response: AgentResponse = {
        agentName: this.config.name,
        result: {
          queryAnswer: llmAnalysis,
          statistics: stats,
          regulatoryAnalysis,
          recordCount: validated.data.length,
          regulatoryContext: validated.context,
        },
        confidence,
        reasoning: `Analyzed ${validated.data.length} emission records in ${validated.context.toUpperCase()} context. ${regulatoryAnalysis.summary}`,
        recommendations: regulatoryAnalysis.recommendations,
        metadata: {
          durationMs: Date.now() - startTime,
          model: this.config.model,
          recordCount: validated.data.length,
          scopesCovered: stats.scopeBreakdown ? Object.keys(stats.scopeBreakdown) : [],
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
        duration_ms: Date.now() - startTime,
        created_at: new Date().toISOString(),
      });

      return response;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      const durationMs = Date.now() - startTime;

      logger.error('Emissions data analysis failed', {
        agent: this.config.name,
        error: errorMessage,
      });

      await this.logExecution({
        agent_name: this.config.name,
        user_id: context.userId,
        org_id: context.orgId,
        session_id: context.sessionId,
        project_id: context.projectId,
        input,
        output: null,
        status: 'error',
        error_message: errorMessage,
        duration_ms: durationMs,
        created_at: new Date().toISOString(),
      });

      return {
        agentName: this.config.name,
        result: { error: errorMessage },
        confidence: 0,
        reasoning: `Analysis failed: ${errorMessage}`,
        recommendations: ['Verify data format matches expected schema', 'Ensure all records have amount and unit fields'],
        metadata: { durationMs, model: this.config.model },
      };
    }
  }

  // ============ PRIVATE METHODS ============

  private validateInput(input: Record<string, unknown>): EmissionsDataAnalystInput {
    if (typeof input.query !== 'string' || input.query.length < 3) {
      throw new Error('query must be a string (min 3 chars)');
    }
    if (!Array.isArray(input.data) || input.data.length === 0) {
      throw new Error('data must be a non-empty array of emission records');
    }
    const validContexts = ['ets', 'csrd', 'cbam', 'en15978', 'general'];
    const ctx = typeof input.context === 'string' ? input.context : 'general';
    if (!validContexts.includes(ctx)) {
      throw new Error(`context must be one of: ${validContexts.join(', ')}`);
    }

    return {
      query: input.query,
      data: input.data as EmissionRecord[],
      context: ctx as EmissionsDataAnalystInput['context'],
    };
  }

  private computeStatistics(data: EmissionRecord[]): Record<string, unknown> {
    const totalEmissions = data.reduce((sum, r) => sum + (r.amount || 0), 0);
    const units = [...new Set(data.map((r) => r.unit).filter(Boolean))];

    // Scope breakdown
    const scopeBreakdown: Record<string, number> = {};
    for (const record of data) {
      const scope = record.scope ? `scope${record.scope}` : 'unclassified';
      scopeBreakdown[scope] = (scopeBreakdown[scope] || 0) + (record.amount || 0);
    }

    // Facility breakdown
    const facilityBreakdown: Record<string, number> = {};
    for (const record of data) {
      const facility = record.facility || 'unknown';
      facilityBreakdown[facility] = (facilityBreakdown[facility] || 0) + (record.amount || 0);
    }

    // Category breakdown
    const categoryBreakdown: Record<string, number> = {};
    for (const record of data) {
      const category = record.category || 'uncategorized';
      categoryBreakdown[category] = (categoryBreakdown[category] || 0) + (record.amount || 0);
    }

    // Top emitters
    const sortedFacilities = Object.entries(facilityBreakdown)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);

    return {
      totalEmissions: Math.round(totalEmissions * 100) / 100,
      units,
      missingUnitCount: data.filter((r) => !r.unit).length,
      recordCount: data.length,
      scopeBreakdown,
      facilityBreakdown,
      categoryBreakdown,
      topEmitters: sortedFacilities.map(([name, amount]) => ({ name, amount: Math.round(amount * 100) / 100 })),
      average: Math.round((totalEmissions / data.length) * 100) / 100,
    };
  }

  private applyRegulatoryContext(
    stats: Record<string, unknown>,
    context: string,
  ): { summary: string; flags: string[]; recommendations: string[] } {
    const flags: string[] = [];
    const recommendations: string[] = [];
    const total = stats.totalEmissions as number;
    const scopes = stats.scopeBreakdown as Record<string, number>;

    switch (context) {
      case 'ets': {
        const units = stats.units as string[];
        const missingUnitCount = stats.missingUnitCount as number;
        // Units accepted as tonne-scale CO2 equivalents for ETS cost calculation
        const hasMixedUnits = units.length > 1;
        const allTonneBased = units.length > 0 && units.every((u) => ETS_TONNE_UNITS.has(String(u).trim()));

        if (missingUnitCount > 0) {
          flags.push(`${missingUnitCount} record(s) missing unit information — ETS cost estimate requires all records to specify tCO2e`);
        }
        if (hasMixedUnits) {
          flags.push(`Mixed units detected (${units.join(', ')}) — normalize all records to tCO2e before ETS cost estimation`);
        } else if (units.length > 0 && !allTonneBased) {
          flags.push(`Unit '${units[0]}' is not a recognised tonne-scale unit — ETS cost estimate requires data in tCO2e`);
        }

        if (total > 25000) {
          flags.push('Installation likely exceeds ETS Phase 4 free allocation threshold');
          recommendations.push('Review free allocation benchmarks for your sector');
          recommendations.push('Consider purchasing ETS allowances for surplus emissions');
        }
        if (allTonneBased && !hasMixedUnits && missingUnitCount === 0) {
          recommendations.push(`Current EU ETS price ~EUR 68/tonne. Estimated cost: EUR ${Math.round(total * 68).toLocaleString()}`);
        } else {
          recommendations.push('Convert all emission data to tCO2e to enable accurate ETS cost estimation (EU ETS price ~EUR 68/tonne)');
        }
        break;
      }
      case 'csrd': {
        if ((scopes.scope1 || 0) > CSRD_THRESHOLDS.scope1_material) {
          flags.push('Scope 1 emissions exceed CSRD materiality threshold');
        }
        if ((scopes.scope2 || 0) > CSRD_THRESHOLDS.scope2_material) {
          flags.push('Scope 2 emissions exceed CSRD materiality threshold');
        }
        if ((scopes.scope3 || 0) > CSRD_THRESHOLDS.scope3_material) {
          flags.push('Scope 3 emissions exceed CSRD materiality threshold');
        }
        recommendations.push('Prepare ESRS E1 (Climate Change) disclosure for material scopes');
        if (flags.length === 0) {
          recommendations.push('Emissions below materiality thresholds - simplified reporting may apply');
        }
        break;
      }
      case 'cbam': {
        flags.push('CBAM transitional reporting required for imports of: cement, iron/steel, aluminium, fertilisers, electricity, hydrogen');
        recommendations.push('Verify embedded emissions declarations from non-EU suppliers');
        recommendations.push('Prepare for CBAM definitive system (January 2026+): purchase CBAM certificates');
        break;
      }
      case 'en15978': {
        recommendations.push('Ensure lifecycle stages A1-A5, B, C, D are all represented in data');
        recommendations.push('Use MaterialOracle agent for per-material EN 15978 breakdown');
        const stages = stats.categoryBreakdown as Record<string, number>;
        const stageKeys = Object.keys(stages);
        const expectedStages = ['A1-A3', 'A4', 'A5', 'B', 'C', 'D'];
        const missing = expectedStages.filter((s) => !stageKeys.some((k) => k.includes(s)));
        if (missing.length > 0) {
          flags.push(`Missing lifecycle stages: ${missing.join(', ')}`);
        }
        break;
      }
      default:
        recommendations.push('Specify a regulatory context (ets, csrd, cbam, en15978) for targeted analysis');
    }

    const summary = flags.length > 0
      ? `Found ${flags.length} regulatory flag(s): ${flags[0]}`
      : 'No regulatory flags raised';

    return { summary, flags, recommendations };
  }

  private async queryWithLLM(
    query: string,
    stats: Record<string, unknown>,
    regulatory: { summary: string; flags: string[] },
    context: string,
  ): Promise<string> {
    const prompt = [
      `You are an emissions data analyst for EU-regulated industries.`,
      `Regulatory context: ${context.toUpperCase()}`,
      `Data summary: ${JSON.stringify(stats)}`,
      `Regulatory flags: ${JSON.stringify(regulatory.flags)}`,
      ``,
      `User query: ${query}`,
      ``,
      `Provide a clear, data-driven answer. Include specific numbers from the statistics.`,
      `Format your response as JSON with fields: answer (string), keyFindings (string[]), dataPoints (object[])`,
    ].join('\n');

    const result = await this.callLLM(prompt);
    try {
      const parsed = JSON.parse(result.content);
      return parsed.answer || result.content;
    } catch {
      return `Based on ${stats.recordCount} records: total emissions ${stats.totalEmissions} ${(stats.units as string[])[0] || 'units'}. ${regulatory.summary}`;
    }
  }

  private calculateConfidence(recordCount: number, context: string): number {
    let confidence = 0.7;
    if (recordCount >= 100) confidence += 0.15;
    else if (recordCount >= 10) confidence += 0.1;
    else confidence -= 0.1;
    if (context !== 'general') confidence += 0.05;
    return Math.max(0, Math.min(1, confidence));
  }
}
