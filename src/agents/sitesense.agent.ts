/**
 * SiteSense Agent - Site Monitoring & Safety Analysis
 *
 * Analyzes site conditions including weather impact, worker safety metrics,
 * and environmental conditions to produce actionable safety scores and
 * recommendations for construction/industrial sites.
 *
 * Input: { siteId, metrics: { temperature, humidity, windSpeed, workers, incidents } }
 * Output: safety score, weather risk level, recommendations
 */

import logger from '../utils/logger.js';
import { BaseAgent } from './base.agent.js';
import type { AgentContext, AgentResponse } from './types.js';

// ============ THRESHOLDS (EU construction safety standards) ============

/** Temperature thresholds in Celsius */
const TEMP_THRESHOLDS = {
  extreme_cold: -15,
  cold: 0,
  optimal_low: 10,
  optimal_high: 30,
  hot: 35,
  extreme_hot: 40,
};

/** Wind speed thresholds in m/s (crane operations per EN 13001) */
const WIND_THRESHOLDS = {
  safe: 9,           // Normal operations
  caution: 14,       // Restrict crane/aerial work
  dangerous: 17,     // Stop outdoor elevated work
  shutdown: 25,      // Full site shutdown
};

/** Humidity thresholds (%) */
const HUMIDITY_THRESHOLDS = {
  low: 30,
  optimal_low: 40,
  optimal_high: 60,
  high: 80,
  extreme: 90,
};

// ============ INPUT INTERFACE ============

interface SiteSenseInput {
  siteId: string;
  metrics: {
    temperature: number;   // Celsius
    humidity: number;       // Percentage 0-100
    windSpeed: number;      // m/s
    workers: number;        // Workers on site
    incidents: number;      // Incidents in last 30 days
  };
}

// ============ AGENT IMPLEMENTATION ============

export class SiteSenseAgent extends BaseAgent {
  constructor() {
    super({
      name: 'sitesense',
      description:
        'Analyzes site conditions, weather impact, and safety metrics for construction and industrial sites',
      capabilities: [
        'site-safety-scoring',
        'weather-risk-assessment',
        'worker-safety-analysis',
        'incident-trend-detection',
      ],
      model: 'llama-3.3-70b-versatile',
      modelTier: 'lite',
      // Proactive: Phase 2 (advisor) — objective safety thresholds, edge data.
      autonomyPhase: 'advisor',
      notify: { channels: ['teams', 'in_app'], maxPerHour: 5, maxPerDay: 20 },
    });
  }

  /** Normalize loose input into the strict SiteSenseInput shape */
  private normalizeInput(input: Record<string, unknown>): SiteSenseInput {
    const raw = input as {
      siteId?: string;
      site_id?: string;
      site?: string;
      metrics?: unknown;
    };
    // Accept both nested { metrics: {...} } and flat { temperature, humidity, ... }
    const m = (raw.metrics ?? raw) as {
      temperature?: number;
      humidity?: number;
      windSpeed?: number;
      wind_speed?: number;
      wind?: number;
      workers?: number;
      workerCount?: number;
      worker_count?: number;
      incidents?: number;
      recentIncidents?: unknown[];
    };
    return {
      siteId: raw.siteId ?? raw.site_id ?? raw.site ?? 'unknown-site',
      metrics: {
        temperature: m.temperature ?? 20,
        humidity: m.humidity ?? 50,
        windSpeed: m.windSpeed ?? m.wind_speed ?? m.wind ?? 0,
        workers: m.workers ?? m.workerCount ?? m.worker_count ?? 0,
        incidents: m.incidents ?? m.recentIncidents?.length ?? 0,
      },
    };
  }

  async execute(
    context: AgentContext,
    input: Record<string, unknown>,
  ): Promise<AgentResponse> {
    const startTime = Date.now();

    const { siteId, metrics } = this.normalizeInput(input);

    logger.info('SiteSense agent executing', {
      siteId,
      projectId: context.projectId,
      userId: context.userId,
    });

    // Log execution start
    await this.logExecution({
      agent_name: this.config.name,
      user_id: context.userId,
      org_id: context.orgId,
      session_id: context.sessionId,
      project_id: context.projectId,
      input: input,
      output: null,
      status: 'started',
      duration_ms: 0,
      created_at: new Date().toISOString(),
    });

    try {
      // 1. Compute weather risk
      const weatherRisk = this.assessWeatherRisk(metrics);

      // 2. Compute safety score (0-100)
      const safetyScore = this.computeSafetyScore(metrics);

      // 3. Determine worker capacity adjustment
      const workerCapacity = this.computeWorkerCapacity(metrics);

      // 4. Build recommendations from deterministic rules
      const recommendations = this.buildRecommendations(metrics, weatherRisk, safetyScore);

      // 5. Optionally enhance with LLM analysis
      let llmInsight = '';
      const llmResponse = await this.callLLM(
        `Analyze these construction site conditions and provide 2-3 specific safety recommendations:
Site ID: ${siteId}
Temperature: ${metrics.temperature}C, Humidity: ${metrics.humidity}%, Wind: ${metrics.windSpeed} m/s
Workers on site: ${metrics.workers}, Incidents (30d): ${metrics.incidents}
Computed safety score: ${safetyScore}/100, Weather risk: ${weatherRisk.level}
Respond as JSON with keys: "insight" (string), "additionalRisks" (string[])`,
      );

      try {
        const parsed = JSON.parse(llmResponse.content);
        llmInsight = parsed.insight || '';
        if (Array.isArray(parsed.additionalRisks)) {
          recommendations.push(...parsed.additionalRisks);
        }
      } catch {
        // LLM response not parseable - continue with deterministic results
      }

      const durationMs = Date.now() - startTime;

      const response: AgentResponse = {
        agentName: this.config.name,
        result: {
          siteId,
          safetyScore,
          weatherRisk: {
            level: weatherRisk.level,
            factors: weatherRisk.factors,
          },
          workerCapacity: {
            current: metrics.workers,
            recommended: workerCapacity.recommended,
            adjustmentReason: workerCapacity.reason,
          },
          incidentRate: {
            last30Days: metrics.incidents,
            ratePerWorker: metrics.workers > 0
              ? Math.round((metrics.incidents / metrics.workers) * 1000) / 1000
              : 0,
            trend: metrics.incidents > 3 ? 'escalating' : metrics.incidents > 1 ? 'moderate' : 'stable',
          },
          conditions: {
            temperature: metrics.temperature,
            humidity: metrics.humidity,
            windSpeed: metrics.windSpeed,
          },
          llmInsight,
        },
        confidence: this.computeConfidence(metrics),
        reasoning: `Safety score ${safetyScore}/100 computed from temperature (${metrics.temperature}C), wind (${metrics.windSpeed} m/s), humidity (${metrics.humidity}%), and incident history (${metrics.incidents} in 30d). Weather risk classified as ${weatherRisk.level}.`,
        recommendations: [...new Set(recommendations)], // Deduplicate
        metadata: {
          durationMs,
          llmModel: llmResponse.model,
          llmTokens: llmResponse.inputTokens + llmResponse.outputTokens,
        },
      };

      // Log completed execution
      await this.logExecution({
        agent_name: this.config.name,
        user_id: context.userId,
        org_id: context.orgId,
        session_id: context.sessionId,
        project_id: context.projectId,
        input: input,
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
        input: input,
        output: null,
        status: 'error',
        error_message: err instanceof Error ? err.message : String(err),
        duration_ms: durationMs,
        created_at: new Date().toISOString(),
      });

      throw err;
    }
  }

  // ============ PRIVATE COMPUTATION METHODS ============

  private assessWeatherRisk(metrics: SiteSenseInput['metrics']): {
    level: 'low' | 'moderate' | 'high' | 'critical';
    factors: string[];
  } {
    const factors: string[] = [];
    let riskPoints = 0;

    // Temperature risks
    if (metrics.temperature <= TEMP_THRESHOLDS.extreme_cold) {
      factors.push(`Extreme cold (${metrics.temperature}C): Frostbite risk, equipment failure`);
      riskPoints += 30;
    } else if (metrics.temperature <= TEMP_THRESHOLDS.cold) {
      factors.push(`Cold conditions (${metrics.temperature}C): Reduced dexterity, ice hazards`);
      riskPoints += 15;
    } else if (metrics.temperature >= TEMP_THRESHOLDS.extreme_hot) {
      factors.push(`Extreme heat (${metrics.temperature}C): Heat stroke risk`);
      riskPoints += 30;
    } else if (metrics.temperature >= TEMP_THRESHOLDS.hot) {
      factors.push(`High heat (${metrics.temperature}C): Heat exhaustion risk`);
      riskPoints += 15;
    }

    // Wind risks (EN 13001 crane standards)
    if (metrics.windSpeed >= WIND_THRESHOLDS.shutdown) {
      factors.push(`Dangerous wind (${metrics.windSpeed} m/s): Full shutdown required`);
      riskPoints += 40;
    } else if (metrics.windSpeed >= WIND_THRESHOLDS.dangerous) {
      factors.push(`High wind (${metrics.windSpeed} m/s): Elevated work must stop`);
      riskPoints += 25;
    } else if (metrics.windSpeed >= WIND_THRESHOLDS.caution) {
      factors.push(`Moderate wind (${metrics.windSpeed} m/s): Restrict crane operations`);
      riskPoints += 10;
    }

    // Humidity risks
    if (metrics.humidity >= HUMIDITY_THRESHOLDS.extreme) {
      factors.push(`Extreme humidity (${metrics.humidity}%): Slip hazards, heat stress amplified`);
      riskPoints += 15;
    } else if (metrics.humidity >= HUMIDITY_THRESHOLDS.high) {
      factors.push(`High humidity (${metrics.humidity}%): Reduced evaporative cooling`);
      riskPoints += 5;
    }

    // Classify risk level
    let level: 'low' | 'moderate' | 'high' | 'critical';
    if (riskPoints >= 40) level = 'critical';
    else if (riskPoints >= 25) level = 'high';
    else if (riskPoints >= 10) level = 'moderate';
    else level = 'low';

    if (factors.length === 0) {
      factors.push('All weather parameters within safe operating ranges');
    }

    return { level, factors };
  }

  private computeSafetyScore(metrics: SiteSenseInput['metrics']): number {
    let score = 100;

    // Temperature penalty (max -25)
    const tempC = metrics.temperature;
    if (tempC < TEMP_THRESHOLDS.optimal_low || tempC > TEMP_THRESHOLDS.optimal_high) {
      if (tempC <= TEMP_THRESHOLDS.extreme_cold || tempC >= TEMP_THRESHOLDS.extreme_hot) {
        score -= 25;
      } else if (tempC <= TEMP_THRESHOLDS.cold || tempC >= TEMP_THRESHOLDS.hot) {
        score -= 15;
      } else {
        score -= 5;
      }
    }

    // Wind penalty (max -30)
    if (metrics.windSpeed >= WIND_THRESHOLDS.shutdown) score -= 30;
    else if (metrics.windSpeed >= WIND_THRESHOLDS.dangerous) score -= 20;
    else if (metrics.windSpeed >= WIND_THRESHOLDS.caution) score -= 10;

    // Humidity penalty (max -10)
    if (metrics.humidity >= HUMIDITY_THRESHOLDS.extreme) score -= 10;
    else if (metrics.humidity >= HUMIDITY_THRESHOLDS.high) score -= 5;
    else if (metrics.humidity < HUMIDITY_THRESHOLDS.low) score -= 3;

    // Incident penalty (max -25)
    if (metrics.incidents >= 5) score -= 25;
    else if (metrics.incidents >= 3) score -= 15;
    else if (metrics.incidents >= 1) score -= 8;

    // Worker density penalty (more than 50 workers without proportionally low incidents)
    if (metrics.workers > 50 && metrics.incidents > 0) {
      const incidentRate = metrics.incidents / metrics.workers;
      if (incidentRate > 0.05) score -= 10;
    }

    return Math.max(0, Math.min(100, score));
  }

  private computeWorkerCapacity(metrics: SiteSenseInput['metrics']): {
    recommended: number;
    reason: string;
  } {
    let factor = 1.0;
    const reasons: string[] = [];

    // Extreme weather reduces capacity
    if (metrics.temperature <= TEMP_THRESHOLDS.extreme_cold || metrics.temperature >= TEMP_THRESHOLDS.extreme_hot) {
      factor *= 0.25;
      reasons.push('extreme temperature');
    } else if (metrics.temperature <= TEMP_THRESHOLDS.cold || metrics.temperature >= TEMP_THRESHOLDS.hot) {
      factor *= 0.7;
      reasons.push('adverse temperature');
    }

    // High wind reduces capacity
    if (metrics.windSpeed >= WIND_THRESHOLDS.shutdown) {
      factor = 0;
      reasons.push('wind shutdown');
    } else if (metrics.windSpeed >= WIND_THRESHOLDS.dangerous) {
      factor *= 0.3;
      reasons.push('high wind');
    } else if (metrics.windSpeed >= WIND_THRESHOLDS.caution) {
      factor *= 0.8;
      reasons.push('wind caution');
    }

    const recommended = Math.round(metrics.workers * factor);
    const reason = reasons.length > 0
      ? `Reduced to ${Math.round(factor * 100)}% capacity due to: ${reasons.join(', ')}`
      : 'Full capacity - conditions are within safe limits';

    return { recommended, reason };
  }

  private buildRecommendations(
    metrics: SiteSenseInput['metrics'],
    weatherRisk: { level: string; factors: string[] },
    safetyScore: number,
  ): string[] {
    const recs: string[] = [];

    if (safetyScore < 50) {
      recs.push('URGENT: Consider suspending non-critical site operations until conditions improve');
    }

    if (metrics.temperature <= TEMP_THRESHOLDS.cold) {
      recs.push('Provide heated break areas and enforce mandatory warm-up breaks every 60 minutes');
      recs.push('Ensure all workers have appropriate cold-weather PPE');
    }
    if (metrics.temperature >= TEMP_THRESHOLDS.hot) {
      recs.push('Implement mandatory hydration breaks every 30 minutes');
      recs.push('Schedule heavy outdoor work for early morning or late afternoon');
    }

    if (metrics.windSpeed >= WIND_THRESHOLDS.caution) {
      recs.push('Suspend crane and aerial platform operations until wind drops below 9 m/s');
    }
    if (metrics.windSpeed >= WIND_THRESHOLDS.dangerous) {
      recs.push('Secure all loose materials and temporary structures immediately');
    }

    if (metrics.incidents >= 3) {
      recs.push('Conduct a root-cause analysis of recent incidents before resuming full operations');
      recs.push('Schedule mandatory safety refresher training for all site workers');
    }

    if (metrics.humidity >= HUMIDITY_THRESHOLDS.extreme && metrics.temperature >= TEMP_THRESHOLDS.hot) {
      recs.push('High heat-index conditions: monitor workers for signs of heat illness every 15 minutes');
    }

    if (weatherRisk.level === 'low' && metrics.incidents === 0) {
      recs.push('Conditions are favorable - maintain standard safety protocols');
    }

    return recs;
  }

  private computeConfidence(metrics: SiteSenseInput['metrics']): number {
    // Confidence is high when all inputs are within expected ranges
    let confidence = 0.95;

    if (metrics.temperature < -40 || metrics.temperature > 55) confidence -= 0.15;
    if (metrics.humidity < 0 || metrics.humidity > 100) confidence -= 0.2;
    if (metrics.windSpeed < 0 || metrics.windSpeed > 50) confidence -= 0.1;
    if (metrics.workers < 0) confidence -= 0.2;

    return Math.max(0.1, Math.min(1.0, confidence));
  }
}
