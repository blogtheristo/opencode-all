/**
 * Quality Gate Agent - Deployment Readiness & Quality Scoring
 *
 * Evaluates deployment readiness by analyzing test results, security scans,
 * build status, and operational metrics to produce a pass/fail/warn gate
 * decision with quality scoring.
 *
 * Designed for multi-target deployments: GCP Cloud Run, Cloudflare Workers/Pages,
 * and Hetzner Helsinki.
 *
 * Input: { projectId, deployTarget, testResults, securityScan, buildStatus }
 * Output: gate decision, quality score, blocking issues, recommendations
 */

import logger from '../utils/logger.js';
import { BaseAgent } from './base.agent.js';
import type { AgentContext, AgentResponse } from './types.js';

// ============ QUALITY THRESHOLDS ============

/** Minimum test coverage to pass the gate */
// const MIN_COVERAGE_PERCENT = 60;

/** Warning threshold for test coverage */
const WARN_COVERAGE_PERCENT = 80;

/** Maximum allowed critical security findings to pass */
const MAX_CRITICAL_VULNS = 0;

/** Maximum allowed high security findings to pass */
const MAX_HIGH_VULNS = 2;

/** Test failure ratio that blocks deployment */
const MAX_FAILURE_RATIO = 0.05;

/** Scoring weights for quality dimensions */
const QUALITY_WEIGHTS = {
  tests: 0.35,
  security: 0.3,
  build: 0.2,
  coverage: 0.15,
};

/** Deploy target specific requirements */
const TARGET_REQUIREMENTS: Record<
  string,
  { minCoverage: number; requiresSecurityScan: boolean; description: string }
> = {
  gcp: {
    minCoverage: 70,
    requiresSecurityScan: true,
    description: 'Google Cloud Run (europe-north1) — production backend',
  },
  cloudflare: {
    minCoverage: 50,
    requiresSecurityScan: false,
    description: 'Cloudflare Workers/Pages — edge sites and dashboard',
  },
  hetzner: {
    minCoverage: 60,
    requiresSecurityScan: true,
    description: 'Hetzner Helsinki — Jitsi Meet, email service',
  },
};

// ============ INPUT INTERFACE ============

interface QualityGateInput {
  projectId: string;
  deployTarget: string;
  testResults: {
    passed: number;
    failed: number;
    skipped: number;
    coverage: number;
  };
  securityScan: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  buildStatus: string;
}

// ============ AGENT IMPLEMENTATION ============

export class QualityGateAgent extends BaseAgent {
  constructor() {
    super({
      name: 'quality-gate',
      description:
        'Evaluates deployment readiness through test results, security scans, and build status to produce pass/fail/warn gate decisions',
      capabilities: [
        'deployment-readiness',
        'test-coverage-analysis',
        'security-scan-summary',
        'quality-scoring',
      ],
      model: 'llama-3.3-70b-versatile',
      modelTier: 'lite',
    });
  }

  /** Normalize loose input into the strict QualityGateInput shape */
  private normalizeInput(input: Record<string, unknown>): QualityGateInput {
    const raw = input as {
      projectId?: string;
      project_id?: string;
      repository?: string;
      project?: string;
      deployTarget?: string;
      deploy_target?: string;
      target?: string;
      check?: string;
      testResults?: Partial<QualityGateInput['testResults']>;
      test_results?: Partial<QualityGateInput['testResults']>;
      tests?: Partial<QualityGateInput['testResults']>;
      securityScan?: Partial<QualityGateInput['securityScan']>;
      security_scan?: Partial<QualityGateInput['securityScan']>;
      security?: Partial<QualityGateInput['securityScan']>;
      buildStatus?: string;
      build_status?: string;
      build?: string;
    };
    const tests = raw.testResults ?? raw.test_results ?? raw.tests ?? {};
    const scan = raw.securityScan ?? raw.security_scan ?? raw.security ?? {};
    return {
      projectId: raw.projectId ?? raw.project_id ?? raw.repository ?? raw.project ?? 'unknown',
      deployTarget: raw.deployTarget ?? raw.deploy_target ?? raw.target ?? raw.check ?? 'gcp',
      testResults: {
        passed: tests.passed ?? 0,
        failed: tests.failed ?? 0,
        skipped: tests.skipped ?? 0,
        coverage: tests.coverage ?? 0,
      },
      securityScan: {
        critical: scan.critical ?? 0,
        high: scan.high ?? 0,
        medium: scan.medium ?? 0,
        low: scan.low ?? 0,
      },
      buildStatus: raw.buildStatus ?? raw.build_status ?? raw.build ?? 'unknown',
    };
  }

  async execute(context: AgentContext, input: Record<string, unknown>): Promise<AgentResponse> {
    const startTime = Date.now();

    const { projectId, deployTarget, testResults, securityScan, buildStatus } =
      this.normalizeInput(input);

    logger.info('QualityGate agent executing', {
      projectId,
      deployTarget,
      buildStatus,
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
      const targetConfig = TARGET_REQUIREMENTS[deployTarget] || TARGET_REQUIREMENTS.gcp;

      // 1. Score each quality dimension
      const testScore = this.scoreTests(testResults);
      const securityScore = this.scoreSecurity(securityScan);
      const buildScore = this.scoreBuild(buildStatus);
      const coverageScore = this.scoreCoverage(testResults.coverage, targetConfig.minCoverage);

      // 2. Compute weighted quality score
      const qualityScore = Math.round(
        testScore * QUALITY_WEIGHTS.tests +
          securityScore * QUALITY_WEIGHTS.security +
          buildScore * QUALITY_WEIGHTS.build +
          coverageScore * QUALITY_WEIGHTS.coverage,
      );

      // 3. Identify blocking issues
      const blockingIssues = this.identifyBlockers(
        testResults,
        securityScan,
        buildStatus,
        targetConfig,
      );

      // 4. Determine gate decision
      const gateDecision = this.computeGateDecision(blockingIssues, qualityScore);

      // 5. Build recommendations
      const recommendations = this.buildRecommendations(
        testResults,
        securityScan,
        buildStatus,
        testResults.coverage,
        targetConfig,
        gateDecision,
      );

      // 6. LLM enhancement for deployment strategy
      const llmResponse = await this.callLLM(
        `Analyze deployment readiness and suggest improvements:
Deploy target: ${deployTarget} (${targetConfig.description})
Quality score: ${qualityScore}/100
Gate decision: ${gateDecision}
Tests: ${testResults.passed} passed, ${testResults.failed} failed, ${testResults.skipped} skipped
Coverage: ${testResults.coverage}%
Security: ${securityScan.critical} critical, ${securityScan.high} high, ${securityScan.medium} medium, ${securityScan.low} low
Build: ${buildStatus}
Blocking issues: ${blockingIssues.length > 0 ? blockingIssues.join('; ') : 'none'}
Respond as JSON with keys: "deploymentAdvice" (string), "improvementAreas" (string[])`,
      );

      let llmAdvice = '';
      try {
        const parsed = JSON.parse(llmResponse.content);
        llmAdvice = parsed.deploymentAdvice || '';
        if (Array.isArray(parsed.improvementAreas)) {
          recommendations.push(...parsed.improvementAreas);
        }
      } catch {
        // Non-critical
      }

      const totalTests = testResults.passed + testResults.failed + testResults.skipped;
      const failureRatio = totalTests > 0 ? testResults.failed / totalTests : 0;
      const durationMs = Date.now() - startTime;

      const response: AgentResponse = {
        agentName: this.config.name,
        result: {
          projectId,
          deployTarget,
          targetDescription: targetConfig.description,
          gateDecision,
          qualityScore,
          dimensions: {
            tests: { score: testScore, weight: QUALITY_WEIGHTS.tests },
            security: { score: securityScore, weight: QUALITY_WEIGHTS.security },
            build: { score: buildScore, weight: QUALITY_WEIGHTS.build },
            coverage: { score: coverageScore, weight: QUALITY_WEIGHTS.coverage },
          },
          testSummary: {
            total: totalTests,
            passed: testResults.passed,
            failed: testResults.failed,
            skipped: testResults.skipped,
            failureRatio: Math.round(failureRatio * 1000) / 1000,
            coverage: testResults.coverage,
          },
          securitySummary: {
            total:
              securityScan.critical + securityScan.high + securityScan.medium + securityScan.low,
            critical: securityScan.critical,
            high: securityScan.high,
            medium: securityScan.medium,
            low: securityScan.low,
          },
          buildStatus,
          blockingIssues,
          llmAdvice,
        },
        confidence: this.computeConfidence(testResults, buildStatus),
        reasoning: `Quality score ${qualityScore}/100 for ${deployTarget} deployment. Gate: ${gateDecision}. Tests: ${testResults.passed}/${totalTests} passed (${testResults.coverage}% coverage). Security: ${securityScan.critical} critical, ${securityScan.high} high findings. Build: ${buildStatus}. ${blockingIssues.length} blocking issue(s).`,
        recommendations: [...new Set(recommendations)],
        metadata: {
          durationMs,
          llmModel: llmResponse.model,
          llmTokens: llmResponse.inputTokens + llmResponse.outputTokens,
          thresholds: {
            minCoverage: targetConfig.minCoverage,
            maxCriticalVulns: MAX_CRITICAL_VULNS,
            maxHighVulns: MAX_HIGH_VULNS,
            maxFailureRatio: MAX_FAILURE_RATIO,
          },
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

  // ============ SCORING METHODS ============

  /** Score test results on 0-100 scale */
  private scoreTests(tests: QualityGateInput['testResults']): number {
    const total = tests.passed + tests.failed + tests.skipped;
    if (total === 0) return 0;

    const passRatio = tests.passed / total;

    if (tests.failed === 0) return 100;
    if (passRatio >= 0.98) return 90;
    if (passRatio >= 0.95) return 75;
    if (passRatio >= 0.9) return 55;
    if (passRatio >= 0.8) return 35;
    return 10;
  }

  /** Score security scan results on 0-100 scale */
  private scoreSecurity(scan: QualityGateInput['securityScan']): number {
    let score = 100;

    score -= scan.critical * 40;
    score -= scan.high * 15;
    score -= scan.medium * 5;
    score -= scan.low * 1;

    return Math.max(0, Math.min(100, score));
  }

  /** Score build status on 0-100 scale */
  private scoreBuild(status: string): number {
    switch (status.toLowerCase()) {
      case 'success':
        return 100;
      case 'pending':
        return 50;
      case 'failure':
        return 0;
      default:
        return 25;
    }
  }

  /** Score test coverage on 0-100 scale, relative to target minimum */
  private scoreCoverage(coverage: number, minRequired: number): number {
    if (coverage >= WARN_COVERAGE_PERCENT) return 100;
    if (coverage >= minRequired)
      return 70 + ((coverage - minRequired) / (WARN_COVERAGE_PERCENT - minRequired)) * 30;
    if (coverage >= minRequired * 0.5) return 30;
    return 5;
  }

  /** Identify issues that block deployment */
  private identifyBlockers(
    tests: QualityGateInput['testResults'],
    scan: QualityGateInput['securityScan'],
    buildStatus: string,
    targetConfig: { minCoverage: number; requiresSecurityScan: boolean; description: string },
  ): string[] {
    const blockers: string[] = [];

    // Build failure is always a blocker
    if (buildStatus.toLowerCase() === 'failure') {
      blockers.push('Build failed - deployment cannot proceed');
    }

    // Critical vulnerabilities always block
    if (scan.critical > MAX_CRITICAL_VULNS) {
      blockers.push(
        `${scan.critical} critical security vulnerability(ies) found (max allowed: ${MAX_CRITICAL_VULNS})`,
      );
    }

    // Too many high vulnerabilities block
    if (scan.high > MAX_HIGH_VULNS) {
      blockers.push(
        `${scan.high} high security vulnerabilities exceed threshold (max allowed: ${MAX_HIGH_VULNS})`,
      );
    }

    // Test failure ratio exceeds limit
    const total = tests.passed + tests.failed + tests.skipped;
    if (total > 0) {
      const failureRatio = tests.failed / total;
      if (failureRatio > MAX_FAILURE_RATIO) {
        blockers.push(
          `Test failure ratio ${(failureRatio * 100).toFixed(1)}% exceeds ${(MAX_FAILURE_RATIO * 100).toFixed(1)}% threshold (${tests.failed} of ${total} failed)`,
        );
      }
    }

    // Coverage below minimum for target
    if (tests.coverage < targetConfig.minCoverage) {
      blockers.push(
        `Test coverage ${tests.coverage}% is below ${targetConfig.minCoverage}% minimum for ${targetConfig.description}`,
      );
    }

    // Security scan required but has critical issues
    if (targetConfig.requiresSecurityScan && scan.critical + scan.high > 0) {
      // Already covered by individual checks above
    }

    return blockers;
  }

  /** Determine the gate decision based on blockers and quality score */
  private computeGateDecision(blockers: string[], qualityScore: number): 'pass' | 'warn' | 'fail' {
    if (blockers.length > 0) return 'fail';
    if (qualityScore >= 80) return 'pass';
    if (qualityScore >= 60) return 'warn';
    return 'fail';
  }

  private buildRecommendations(
    tests: QualityGateInput['testResults'],
    scan: QualityGateInput['securityScan'],
    buildStatus: string,
    coverage: number,
    targetConfig: { minCoverage: number; requiresSecurityScan: boolean; description: string },
    decision: string,
  ): string[] {
    const recs: string[] = [];

    if (buildStatus.toLowerCase() === 'failure') {
      recs.push('Fix build errors before any further deployment actions');
    }

    if (scan.critical > 0) {
      recs.push(
        `Remediate ${scan.critical} critical security finding(s) immediately - these are deployment blockers`,
      );
    }

    if (scan.high > MAX_HIGH_VULNS) {
      recs.push(
        `Reduce high-severity findings from ${scan.high} to ${MAX_HIGH_VULNS} or fewer before deploying`,
      );
    }

    if (tests.failed > 0) {
      recs.push(`Fix ${tests.failed} failing test(s) before deployment`);
    }

    if (tests.skipped > 5) {
      recs.push(
        `${tests.skipped} tests are skipped - review and re-enable or remove obsolete tests`,
      );
    }

    if (coverage < targetConfig.minCoverage) {
      recs.push(
        `Increase test coverage from ${coverage}% to at least ${targetConfig.minCoverage}% for ${targetConfig.description}`,
      );
    } else if (coverage < WARN_COVERAGE_PERCENT) {
      recs.push(
        `Test coverage ${coverage}% meets minimum but consider increasing toward ${WARN_COVERAGE_PERCENT}%`,
      );
    }

    if (decision === 'pass') {
      recs.push(`Quality gate passed - safe to deploy to ${targetConfig.description}`);
    }

    if (scan.medium > 5) {
      recs.push(`${scan.medium} medium-severity findings should be addressed in the next sprint`);
    }

    return recs;
  }

  private computeConfidence(tests: QualityGateInput['testResults'], buildStatus: string): number {
    let confidence = 0.9;

    const total = tests.passed + tests.failed + tests.skipped;
    if (total === 0) confidence -= 0.25;
    if (total < 10) confidence -= 0.1;
    if (buildStatus.toLowerCase() === 'pending') confidence -= 0.1;
    if (tests.coverage === 0) confidence -= 0.15;

    return Math.max(0.3, Math.min(1.0, confidence));
  }
}
