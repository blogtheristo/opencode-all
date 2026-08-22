/**
 * Sovereignty Monitor Agent — Database Sovereignty Assessment
 *
 * Scans PostgreSQL databases for EU data sovereignty compliance:
 * - Data residency verification (EU hosting)
 * - CLOUD Act exposure detection (US-owned providers)
 * - Encryption at rest / in transit
 * - Access control & RLS policy coverage
 * - GDPR data subject rights readiness
 * - NIS2 / EU AI Act alignment
 *
 * Input: { connectionString?, host?, provider?, tables?, industry? }
 * Output: sovereignty score (0–100), tier classification, gaps, remediation
 */

import logger from '../utils/logger.js';
import { BaseAgent } from './base.agent.js';
import type { AgentContext, AgentResponse } from './types.js';

// ============ SOVEREIGNTY SCORING ============

/** Known EU-sovereign cloud providers (not subject to CLOUD Act) */
const EU_SOVEREIGN_PROVIDERS = [
  'hetzner',
  'ovhcloud',
  'scaleway',
  'ionos',
  'upcloud',
  'exoscale',
  'fuga',
  'leaseweb',
  'contabo',
  'infomaniak',
  'supabase-eu',
  'neon-eu',
  'aiven-eu',
];

/** US-owned providers subject to CLOUD Act */
const CLOUD_ACT_PROVIDERS = [
  'aws',
  'amazon',
  'azure',
  'microsoft',
  'gcp',
  'google-cloud',
  'mongodb-atlas',
  'planetscale',
  'supabase-us',
  'neon-us',
  'digitalocean',
  'vercel',
  'railway',
  'render',
];

/** EU data residency regions */
const EU_REGIONS = [
  'eu-west-1',
  'eu-west-2',
  'eu-west-3',
  'eu-central-1',
  'eu-north-1',
  'eu-south-1',
  'eu-south-2',
  'europe-west1',
  'europe-west3',
  'europe-west4',
  'europe-north1',
  'europe-central2',
  'westeurope',
  'northeurope',
  'germanywestcentral',
  'swedencentral',
  'finland',
  'germany',
  'france',
  'netherlands',
  'ireland',
  'helsinki',
  'frankfurt',
  'amsterdam',
  'paris',
  'stockholm',
];

/** Sovereignty check weights */
const CHECK_WEIGHTS: Record<string, number> = {
  dataResidency: 0.25,
  cloudActFree: 0.2,
  encryptionAtRest: 0.15,
  encryptionInTransit: 0.1,
  accessControl: 0.1,
  rlsCoverage: 0.1,
  gdprReadiness: 0.05,
  backupSovereignty: 0.05,
};

/** Sovereignty tier thresholds */
function classifyTier(score: number): 'sovereign' | 'compliant' | 'partial' | 'exposed' {
  if (score >= 90) return 'sovereign';
  if (score >= 70) return 'compliant';
  if (score >= 40) return 'partial';
  return 'exposed';
}

// ============ INPUT INTERFACE ============

interface SovereigntyInput {
  host?: string;
  provider?: string;
  region?: string;
  tables?: string[];
  industry?: string;
  encryptionAtRest?: boolean;
  encryptionInTransit?: boolean;
  rlsEnabled?: boolean;
  rlsCoverage?: number; // 0-100%
  backupRegion?: string;
  accessControlMethod?: string;
  gdprDsarProcess?: boolean;
  gdprDeletionProcess?: boolean;
  gdprConsentManagement?: boolean;
}

// ============ AGENT IMPLEMENTATION ============

export class SovereigntyMonitorAgent extends BaseAgent {
  constructor() {
    super({
      name: 'sovereignty-monitor',
      description:
        'Assesses PostgreSQL database sovereignty for EU compliance — data residency, CLOUD Act exposure, encryption, RLS, GDPR readiness',
      capabilities: [
        'database-sovereignty-assessment',
        'cloud-act-exposure-check',
        'data-residency-verification',
        'gdpr-database-readiness',
        'nis2-database-compliance',
      ],
      model: 'llama-3.3-70b-versatile',
    });
  }

  private normalizeInput(input: Record<string, unknown>): SovereigntyInput {
    const raw = input as SovereigntyInput & {
      hostname?: string;
      endpoint?: string;
      cloudProvider?: string;
      cloud?: string;
      dataCenter?: string;
      location?: string;
      encryption_at_rest?: boolean;
      encryption_in_transit?: boolean;
      ssl?: boolean;
      rls?: boolean;
      rls_enabled?: boolean;
      rls_coverage?: number;
      backup_region?: string;
      access_control_method?: string;
      access_control?: string;
      dsar?: boolean;
      right_to_deletion?: boolean;
      consent?: boolean;
    };
    return {
      host: raw.host ?? raw.hostname ?? raw.endpoint ?? undefined,
      provider: raw.provider ?? raw.cloudProvider ?? raw.cloud ?? undefined,
      region: raw.region ?? raw.dataCenter ?? raw.location ?? undefined,
      tables: Array.isArray(raw.tables) ? raw.tables : undefined,
      industry: raw.industry ?? 'default',
      encryptionAtRest: raw.encryptionAtRest ?? raw.encryption_at_rest ?? undefined,
      encryptionInTransit:
        raw.encryptionInTransit ?? raw.encryption_in_transit ?? raw.ssl ?? undefined,
      rlsEnabled: raw.rlsEnabled ?? raw.rls_enabled ?? raw.rls ?? undefined,
      rlsCoverage: raw.rlsCoverage ?? raw.rls_coverage ?? undefined,
      backupRegion: raw.backupRegion ?? raw.backup_region ?? undefined,
      accessControlMethod: raw.accessControlMethod ?? raw.access_control ?? undefined,
      gdprDsarProcess: raw.gdprDsarProcess ?? raw.dsar ?? undefined,
      gdprDeletionProcess: raw.gdprDeletionProcess ?? raw.right_to_deletion ?? undefined,
      gdprConsentManagement: raw.gdprConsentManagement ?? raw.consent ?? undefined,
    };
  }

  async execute(context: AgentContext, input: Record<string, unknown>): Promise<AgentResponse> {
    const startTime = Date.now();
    const si = this.normalizeInput(input);

    logger.info('Sovereignty monitor executing', {
      host: si.host,
      provider: si.provider,
      region: si.region,
      userId: context.userId,
    });

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
      // 1. Score each sovereignty dimension
      const checks = this.runChecks(si);

      // 2. Compute overall score
      const overallScore = Math.round(
        Object.entries(checks).reduce((sum, [key, check]) => {
          const weight = CHECK_WEIGHTS[key] ?? 0;
          return sum + check.score * weight;
        }, 0),
      );

      // 3. Classify tier
      const tier = classifyTier(overallScore);

      // 4. Identify gaps
      const gaps = this.identifyGaps(checks, si);

      // 5. Build recommendations
      const recommendations = this.buildRecommendations(gaps, tier, si);

      // 6. Compute confidence
      const confidence = this.computeConfidence(si);

      // 7. LLM enhancement for remediation strategy
      const llmResponse = await this.callLLM(
        `Analyze database sovereignty assessment and suggest remediation:
Provider: ${si.provider || 'unknown'}
Region: ${si.region || 'unknown'}
Industry: ${si.industry || 'default'}
Sovereignty score: ${overallScore}/100
Tier: ${tier}
Gaps: ${gaps.map((g) => g.gap).join('; ')}
Encryption at rest: ${si.encryptionAtRest ?? 'unknown'}
RLS coverage: ${si.rlsCoverage ?? 'unknown'}%
Respond as JSON with keys: "migrationStrategy" (string), "prioritizedActions" (string[]), "estimatedEffort" (string)`,
      );

      let llmStrategy = '';
      let llmEffort = '';
      try {
        const parsed = JSON.parse(llmResponse.content);
        llmStrategy = parsed.migrationStrategy || '';
        llmEffort = parsed.estimatedEffort || '';
        if (Array.isArray(parsed.prioritizedActions)) {
          recommendations.push(...parsed.prioritizedActions);
        }
      } catch {
        // Non-critical
      }

      const durationMs = Date.now() - startTime;

      const response: AgentResponse = {
        agentName: this.config.name,
        result: {
          overallScore,
          tier,
          tierDescription: this.tierDescription(tier),
          checks: Object.fromEntries(
            Object.entries(checks).map(([key, check]) => [
              key,
              { score: check.score, status: check.status, detail: check.detail },
            ]),
          ),
          gaps,
          provider: si.provider || 'unknown',
          region: si.region || 'unknown',
          cloudActExposed: this.isCloudActExposed(si.provider),
          euDataResident: this.isEuResident(si.region),
          migrationStrategy: llmStrategy,
          estimatedEffort: llmEffort,
        },
        confidence,
        reasoning: `Sovereignty score ${overallScore}/100 (tier: ${tier}). ${gaps.length} gaps identified. Provider: ${si.provider || 'unknown'}, Region: ${si.region || 'unknown'}. ${this.isCloudActExposed(si.provider) ? 'CLOUD Act exposed — migration recommended.' : 'No CLOUD Act exposure.'}`,
        recommendations: [...new Set(recommendations)],
        metadata: {
          durationMs,
          llmModel: llmResponse.model,
          llmTokens: llmResponse.inputTokens + llmResponse.outputTokens,
          checksRun: Object.keys(checks).length,
        },
      };

      // HIL escalation: if confidence < 80%, flag for human review
      if (confidence < 0.8) {
        (response.result as Record<string, unknown>).hilEscalation = {
          required: true,
          reason: `Agent confidence ${Math.round(confidence * 100)}% is below 80% threshold`,
          channel: 'email',
          recipient: process.env.HIL_ESCALATION_EMAIL || 'risto@lifetime.fi',
          context: {
            score: overallScore,
            tier,
            gapCount: gaps.length,
            provider: si.provider,
          },
        };
      }

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

  // ============ CHECK METHODS ============

  private runChecks(
    si: SovereigntyInput,
  ): Record<string, { score: number; status: string; detail: string }> {
    return {
      dataResidency: this.checkDataResidency(si),
      cloudActFree: this.checkCloudActFree(si),
      encryptionAtRest: this.checkEncryptionAtRest(si),
      encryptionInTransit: this.checkEncryptionInTransit(si),
      accessControl: this.checkAccessControl(si),
      rlsCoverage: this.checkRlsCoverage(si),
      gdprReadiness: this.checkGdprReadiness(si),
      backupSovereignty: this.checkBackupSovereignty(si),
    };
  }

  private checkDataResidency(si: SovereigntyInput): {
    score: number;
    status: string;
    detail: string;
  } {
    if (!si.region)
      return {
        score: 0,
        status: 'unknown',
        detail: 'Region not specified — cannot verify EU residency',
      };
    const isEu = this.isEuResident(si.region);
    return isEu
      ? { score: 100, status: 'pass', detail: `Data resident in EU region: ${si.region}` }
      : {
          score: 0,
          status: 'fail',
          detail: `Data NOT in EU region: ${si.region}. Migration to EU required.`,
        };
  }

  private checkCloudActFree(si: SovereigntyInput): {
    score: number;
    status: string;
    detail: string;
  } {
    if (!si.provider)
      return {
        score: 0,
        status: 'unknown',
        detail: 'Provider not specified — cannot verify CLOUD Act status',
      };
    const providerLower = si.provider.toLowerCase();
    if (this.isCloudActExposed(si.provider)) {
      return {
        score: 0,
        status: 'fail',
        detail: `Provider "${si.provider}" is US-owned and subject to CLOUD Act`,
      };
    }
    if (EU_SOVEREIGN_PROVIDERS.some((p) => providerLower.includes(p))) {
      return { score: 100, status: 'pass', detail: `Provider "${si.provider}" is EU-sovereign` };
    }
    return {
      score: 50,
      status: 'partial',
      detail: `Provider "${si.provider}" not in known lists — manual verification needed`,
    };
  }

  private checkEncryptionAtRest(si: SovereigntyInput): {
    score: number;
    status: string;
    detail: string;
  } {
    if (si.encryptionAtRest === undefined)
      return { score: 0, status: 'unknown', detail: 'Encryption at rest status not provided' };
    return si.encryptionAtRest
      ? { score: 100, status: 'pass', detail: 'Encryption at rest is enabled' }
      : { score: 0, status: 'fail', detail: 'Encryption at rest is NOT enabled — critical gap' };
  }

  private checkEncryptionInTransit(si: SovereigntyInput): {
    score: number;
    status: string;
    detail: string;
  } {
    if (si.encryptionInTransit === undefined)
      return { score: 0, status: 'unknown', detail: 'Encryption in transit status not provided' };
    return si.encryptionInTransit
      ? { score: 100, status: 'pass', detail: 'TLS/SSL encryption in transit is enabled' }
      : { score: 0, status: 'fail', detail: 'Encryption in transit is NOT enabled — critical gap' };
  }

  private checkAccessControl(si: SovereigntyInput): {
    score: number;
    status: string;
    detail: string;
  } {
    if (!si.accessControlMethod)
      return { score: 0, status: 'unknown', detail: 'Access control method not specified' };
    const method = si.accessControlMethod.toLowerCase();
    if (method.includes('rbac') || method.includes('role')) {
      return { score: 100, status: 'pass', detail: 'Role-based access control (RBAC) in place' };
    }
    if (method.includes('jwt') || method.includes('token')) {
      return { score: 80, status: 'pass', detail: 'Token-based access control in place' };
    }
    return { score: 50, status: 'partial', detail: `Access control: ${si.accessControlMethod}` };
  }

  private checkRlsCoverage(si: SovereigntyInput): {
    score: number;
    status: string;
    detail: string;
  } {
    if (si.rlsEnabled === false)
      return { score: 0, status: 'fail', detail: 'Row Level Security is disabled' };
    if (si.rlsCoverage !== undefined) {
      const status = si.rlsCoverage >= 90 ? 'pass' : si.rlsCoverage >= 50 ? 'partial' : 'fail';
      return { score: si.rlsCoverage, status, detail: `RLS covers ${si.rlsCoverage}% of tables` };
    }
    if (si.rlsEnabled)
      return {
        score: 70,
        status: 'partial',
        detail: 'RLS enabled but coverage percentage unknown',
      };
    return { score: 0, status: 'unknown', detail: 'RLS status not provided' };
  }

  private checkGdprReadiness(si: SovereigntyInput): {
    score: number;
    status: string;
    detail: string;
  } {
    let score = 0;
    const details: string[] = [];
    if (si.gdprDsarProcess) {
      score += 34;
      details.push('DSAR process');
    }
    if (si.gdprDeletionProcess) {
      score += 33;
      details.push('Right to deletion');
    }
    if (si.gdprConsentManagement) {
      score += 33;
      details.push('Consent management');
    }
    if (details.length === 0)
      return { score: 0, status: 'unknown', detail: 'GDPR readiness not assessed' };
    return {
      score,
      status: score >= 90 ? 'pass' : score >= 50 ? 'partial' : 'fail',
      detail: `GDPR processes: ${details.join(', ')}`,
    };
  }

  private checkBackupSovereignty(si: SovereigntyInput): {
    score: number;
    status: string;
    detail: string;
  } {
    if (!si.backupRegion)
      return { score: 0, status: 'unknown', detail: 'Backup region not specified' };
    const isEu = this.isEuResident(si.backupRegion);
    return isEu
      ? { score: 100, status: 'pass', detail: `Backups in EU region: ${si.backupRegion}` }
      : { score: 0, status: 'fail', detail: `Backups NOT in EU: ${si.backupRegion}` };
  }

  // ============ GAP ANALYSIS ============

  private identifyGaps(
    checks: Record<string, { score: number; status: string; detail: string }>,
    _si: SovereigntyInput,
  ): { check: string; gap: string; severity: 'critical' | 'high' | 'medium' | 'low' }[] {
    const gaps: { check: string; gap: string; severity: 'critical' | 'high' | 'medium' | 'low' }[] =
      [];

    for (const [key, check] of Object.entries(checks)) {
      if (check.status === 'fail') {
        gaps.push({
          check: key,
          gap: check.detail,
          severity: key === 'cloudActFree' || key === 'dataResidency' ? 'critical' : 'high',
        });
      } else if (check.status === 'unknown') {
        gaps.push({
          check: key,
          gap: check.detail,
          severity: 'medium',
        });
      } else if (check.status === 'partial') {
        gaps.push({
          check: key,
          gap: check.detail,
          severity: 'low',
        });
      }
    }

    return gaps;
  }

  // ============ RECOMMENDATIONS ============

  private buildRecommendations(
    gaps: { check: string; gap: string; severity: string }[],
    tier: string,
    si: SovereigntyInput,
  ): string[] {
    const recs: string[] = [];

    const criticalGaps = gaps.filter((g) => g.severity === 'critical');
    if (criticalGaps.length > 0) {
      recs.push(
        `CRITICAL: ${criticalGaps.length} sovereignty gap(s) require immediate action: ${criticalGaps.map((g) => g.gap).join('; ')}`,
      );
    }

    if (this.isCloudActExposed(si.provider)) {
      recs.push(
        'Migrate to EU-sovereign provider (Hetzner, OVHcloud, Scaleway, Supabase EU) to eliminate CLOUD Act exposure',
      );
    }

    if (!this.isEuResident(si.region)) {
      recs.push(
        'Move database to EU region (europe-north1, eu-central-1, frankfurt, helsinki) for GDPR data residency compliance',
      );
    }

    if (si.encryptionAtRest === false) {
      recs.push('Enable encryption at rest — required for NIS2 and GDPR Article 32');
    }

    if (si.rlsEnabled === false || (si.rlsCoverage !== undefined && si.rlsCoverage < 90)) {
      recs.push(
        'Enable Row Level Security on all tables with tenant data — prevents cross-tenant data leaks',
      );
    }

    if (tier === 'exposed') {
      recs.push(
        'Overall sovereignty is EXPOSED — develop a comprehensive migration roadmap to EU-sovereign infrastructure',
      );
    }

    return recs;
  }

  // ============ HELPERS ============

  private isCloudActExposed(provider?: string): boolean {
    if (!provider) return false;
    return CLOUD_ACT_PROVIDERS.some((p) => provider.toLowerCase().includes(p));
  }

  private isEuResident(region?: string): boolean {
    if (!region) return false;
    return EU_REGIONS.some((r) => region.toLowerCase().includes(r));
  }

  private tierDescription(tier: string): string {
    switch (tier) {
      case 'sovereign':
        return 'Fully EU-sovereign — no CLOUD Act exposure, EU-hosted, encrypted, GDPR-ready';
      case 'compliant':
        return 'EU-compliant — meets minimum requirements but some improvements recommended';
      case 'partial':
        return 'Partially compliant — significant gaps in sovereignty posture';
      case 'exposed':
        return 'Exposed — CLOUD Act risk, non-EU hosting, or critical security gaps';
      default:
        return 'Unknown tier';
    }
  }

  private computeConfidence(si: SovereigntyInput): number {
    let confidence = 0.6;

    // More data = higher confidence
    if (si.provider) confidence += 0.1;
    if (si.region) confidence += 0.1;
    if (si.encryptionAtRest !== undefined) confidence += 0.05;
    if (si.encryptionInTransit !== undefined) confidence += 0.05;
    if (si.rlsEnabled !== undefined || si.rlsCoverage !== undefined) confidence += 0.05;
    if (si.gdprDsarProcess !== undefined) confidence += 0.03;
    if (si.backupRegion) confidence += 0.02;

    return Math.min(1.0, confidence);
  }
}
