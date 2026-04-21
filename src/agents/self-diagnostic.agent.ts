/**
 * Self-Diagnostic Agent - Codebase Health & Quality Analysis
 *
 * This agent is instrumental in improving itself: it analyzes the DWS6
 * codebase to identify quality gaps, missing tests, security issues,
 * and architectural drift. Results feed back into the development loop,
 * enabling AI agents (Claude Code, Cursor) to prioritize fixes.
 *
 * Self-improving loop:
 *   1. Agent scans codebase → produces health report
 *   2. AI coding session reads report → fixes top issues
 *   3. Next scan shows improvement → cycle continues
 *
 * Input: { scope: 'full' | 'agents' | 'tests' | 'security' | 'types' }
 * Output: health score, findings, prioritized recommendations
 */

import { BaseAgent } from './base.agent.js';
import logger from '../utils/logger.js';
import type { AgentContext, AgentResponse } from './types.js';
import { readdir, stat, readFile } from 'fs/promises';
import { join } from 'path';

// ============ DIAGNOSTIC RULES ============

interface DiagnosticFinding {
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  category: string;
  message: string;
  file?: string;
  suggestion: string;
}

type DiagnosticScope = 'full' | 'agents' | 'tests' | 'security' | 'types';

const VALID_SCOPES: ReadonlyArray<DiagnosticScope> = [
  'full',
  'agents',
  'tests',
  'security',
  'types',
];

interface SelfDiagnosticInput {
  scope: DiagnosticScope;
  basePath?: string;
}

// ============ AGENT IMPLEMENTATION ============

export class SelfDiagnosticAgent extends BaseAgent {
  constructor() {
    super({
      name: 'self-diagnostic',
      description:
        'Analyzes the DWS6 codebase health, identifying quality gaps, missing tests, and improvement opportunities. Part of the self-improving agent loop.',
      capabilities: [
        'codebase-health-scoring',
        'test-coverage-analysis',
        'agent-quality-audit',
        'type-safety-check',
        'security-pattern-scan',
      ],
      model: 'llama-3.3-70b-versatile',
    });
  }

  async execute(
    context: AgentContext,
    input: Record<string, unknown>,
  ): Promise<AgentResponse> {
    const startTime = Date.now();
    const diagnosticInput = input as unknown as SelfDiagnosticInput;
    const requestedScope = diagnosticInput.scope;
    const basePath = diagnosticInput.basePath || process.cwd();

    // Validate scope — reject unknown values rather than silently running no checks
    if (
      requestedScope !== undefined &&
      !VALID_SCOPES.includes(requestedScope as DiagnosticScope)
    ) {
      throw new Error(
        `Invalid scope "${requestedScope}". Must be one of: ${VALID_SCOPES.join(', ')}`,
      );
    }
    const scope: DiagnosticScope = requestedScope || 'full';

    logger.info('Self-diagnostic agent executing', {
      scope,
      projectId: context.projectId,
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
      const findings: DiagnosticFinding[] = [];

      // Run diagnostic checks based on scope
      if (scope === 'full' || scope === 'agents') {
        findings.push(...(await this.checkAgentHealth(basePath)));
      }
      if (scope === 'full' || scope === 'tests') {
        findings.push(...(await this.checkTestCoverage(basePath)));
      }
      if (scope === 'full' || scope === 'security') {
        findings.push(...(await this.checkSecurityPatterns(basePath)));
      }
      if (scope === 'full' || scope === 'types') {
        findings.push(...(await this.checkTypeStrictness(basePath)));
      }

      // Compute health score
      const healthScore = this.computeHealthScore(findings);

      // Prioritize recommendations
      const recommendations = this.prioritizeRecommendations(findings);

      // Optionally enhance with LLM
      let llmSummary = '';
      if (findings.length > 0) {
        const topFindings = findings
          .filter((f) => f.severity === 'critical' || f.severity === 'high')
          .slice(0, 5)
          .map((f) => `[${f.severity}] ${f.category}: ${f.message}`)
          .join('\n');

        if (topFindings) {
          const llmResponse = await this.callLLM(
            `Analyze these codebase diagnostic findings and suggest a prioritized action plan:
${topFindings}
Respond as JSON with keys: "summary" (string), "actionPlan" (string[])`,
          );
          try {
            const parsed = JSON.parse(llmResponse.content);
            llmSummary = parsed.summary || '';
          } catch {
            // Continue without LLM summary
          }
        }
      }

      const durationMs = Date.now() - startTime;

      const response: AgentResponse = {
        agentName: this.config.name,
        result: {
          scope,
          healthScore,
          totalFindings: findings.length,
          findingsBySeverity: {
            critical: findings.filter((f) => f.severity === 'critical').length,
            high: findings.filter((f) => f.severity === 'high').length,
            medium: findings.filter((f) => f.severity === 'medium').length,
            low: findings.filter((f) => f.severity === 'low').length,
            info: findings.filter((f) => f.severity === 'info').length,
          },
          findings: findings.slice(0, 20), // Top 20 findings
          llmSummary,
        },
        confidence: 0.85,
        reasoning: `Codebase health score ${healthScore}/100 computed from ${findings.length} findings across scope "${scope}". ${findings.filter((f) => f.severity === 'critical').length} critical, ${findings.filter((f) => f.severity === 'high').length} high severity issues found.`,
        recommendations,
        metadata: {
          durationMs,
          scope,
          basePath,
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

  // ============ DIAGNOSTIC CHECKS ============

  private async checkAgentHealth(basePath: string): Promise<DiagnosticFinding[]> {
    const findings: DiagnosticFinding[] = [];
    const agentsDir = join(basePath, 'src', 'agents');

    try {
      const files = await readdir(agentsDir);
      const agentFiles = files.filter(
        (f) => f.endsWith('.agent.ts') && f !== 'base.agent.ts',
      );

      // Check: each agent should have error handling
      for (const file of agentFiles) {
        const content = await readFile(join(agentsDir, file), 'utf-8');

        if (!content.includes('try {') || !content.includes('catch')) {
          findings.push({
            severity: 'high',
            category: 'agent-quality',
            message: `Agent ${file} missing try/catch error handling in execute()`,
            file: `src/agents/${file}`,
            suggestion: 'Add try/catch with logExecution error reporting',
          });
        }

        if (!content.includes('logExecution')) {
          findings.push({
            severity: 'medium',
            category: 'agent-observability',
            message: `Agent ${file} not logging executions to Supabase`,
            file: `src/agents/${file}`,
            suggestion: 'Add logExecution calls for start/complete/error states',
          });
        }

        if (!content.includes('callLLM')) {
          findings.push({
            severity: 'info',
            category: 'agent-capability',
            message: `Agent ${file} uses only deterministic logic (no LLM enhancement)`,
            file: `src/agents/${file}`,
            suggestion: 'Consider adding optional LLM enhancement for richer analysis',
          });
        }
      }

      // Check: registry completeness
      const indexContent = await readFile(join(agentsDir, 'index.ts'), 'utf-8');
      for (const file of agentFiles) {
        const className = file.replace('.agent.ts', '').replace(/-/g, '');
        if (!indexContent.toLowerCase().includes(className.toLowerCase())) {
          findings.push({
            severity: 'high',
            category: 'agent-registry',
            message: `Agent ${file} may not be registered in AgentRegistry`,
            file: 'src/agents/index.ts',
            suggestion: `Import and register the agent in registerDefaults()`,
          });
        }
      }

      findings.push({
        severity: 'info',
        category: 'agent-count',
        message: `${agentFiles.length} agents found in agent system`,
        suggestion: 'Agent count is healthy for current platform scope',
      });
    } catch {
      findings.push({
        severity: 'medium',
        category: 'agent-health',
        message: 'Could not read agents directory',
        suggestion: 'Verify src/agents/ directory exists',
      });
    }

    return findings;
  }

  private async checkTestCoverage(basePath: string): Promise<DiagnosticFinding[]> {
    const findings: DiagnosticFinding[] = [];
    const testsDir = join(basePath, 'src', '__tests__');
    const srcDir = join(basePath, 'src');

    try {
      // Count test files
      const testFiles = await readdir(testsDir);
      const actualTests = testFiles.filter((f) => f.endsWith('.test.ts'));

      // Count source directories that should have tests
      const srcEntries = await readdir(srcDir, { withFileTypes: true });
      const srcDirs = srcEntries
        .filter((e) => e.isDirectory() && e.name !== '__tests__' && e.name !== 'config')
        .map((e) => e.name);

      if (actualTests.length < 5) {
        findings.push({
          severity: 'critical',
          category: 'test-coverage',
          message: `Only ${actualTests.length} test files for ${srcDirs.length} source modules`,
          file: 'src/__tests__/',
          suggestion: 'Add tests for agents, routes, services, and integrations modules',
        });
      }

      // Check for agent tests
      const hasAgentTests = actualTests.some((f) => f.includes('agent'));
      if (!hasAgentTests) {
        findings.push({
          severity: 'high',
          category: 'test-coverage',
          message: 'No test files found for agent system (src/agents/)',
          file: 'src/__tests__/',
          suggestion: 'Add agents.test.ts covering agent registration, execution, and error handling',
        });
      }

      // Check for integration tests
      const hasIntegrationTests = actualTests.some((f) => f.includes('integration'));
      if (!hasIntegrationTests) {
        findings.push({
          severity: 'medium',
          category: 'test-coverage',
          message: 'No integration test files found',
          suggestion: 'Add integration tests for API routes with supertest',
        });
      }
    } catch {
      findings.push({
        severity: 'high',
        category: 'test-infrastructure',
        message: 'Could not read test directory',
        suggestion: 'Verify src/__tests__/ directory exists',
      });
    }

    return findings;
  }

  private async checkSecurityPatterns(basePath: string): Promise<DiagnosticFinding[]> {
    const findings: DiagnosticFinding[] = [];

    // Check .env.example exists
    try {
      await stat(join(basePath, '.env.example'));
    } catch {
      findings.push({
        severity: 'high',
        category: 'security',
        message: '.env.example template not found',
        suggestion: 'Create .env.example with placeholder values for all required vars',
      });
    }

    // Check .gitignore has security patterns
    try {
      const gitignore = await readFile(join(basePath, '.gitignore'), 'utf-8');
      const requiredPatterns = ['.env', '*.key', '*.pem', 'credentials.json'];
      for (const pattern of requiredPatterns) {
        if (!gitignore.includes(pattern)) {
          findings.push({
            severity: 'critical',
            category: 'security',
            message: `.gitignore missing pattern: ${pattern}`,
            file: '.gitignore',
            suggestion: `Add "${pattern}" to .gitignore immediately`,
          });
        }
      }
    } catch {
      findings.push({
        severity: 'critical',
        category: 'security',
        message: '.gitignore not found or unreadable',
        suggestion: 'Create .gitignore with all required security patterns',
      });
    }

    // Check CI/CD has test workflow
    try {
      const workflowDir = join(basePath, '.github', 'workflows');
      const workflows = await readdir(workflowDir);
      const hasTestWorkflow = workflows.some(
        (f) => f.includes('test') && !f.includes('security'),
      );
      if (!hasTestWorkflow) {
        findings.push({
          severity: 'high',
          category: 'ci-cd',
          message: 'No test automation workflow found in CI/CD',
          file: '.github/workflows/',
          suggestion: 'Add test-on-pr.yml that runs npm test on pull requests',
        });
      }
    } catch {
      // Workflows dir might not exist
    }

    return findings;
  }

  private async checkTypeStrictness(basePath: string): Promise<DiagnosticFinding[]> {
    const findings: DiagnosticFinding[] = [];

    try {
      const tsconfig = await readFile(join(basePath, 'tsconfig.json'), 'utf-8');
      const config = JSON.parse(tsconfig);

      if (config.compilerOptions?.strict === false) {
        findings.push({
          severity: 'medium',
          category: 'type-safety',
          message: 'TypeScript strict mode is disabled',
          file: 'tsconfig.json',
          suggestion: 'Enable strict: true incrementally to catch type errors',
        });
      }

      if (config.compilerOptions?.noImplicitAny === false) {
        findings.push({
          severity: 'medium',
          category: 'type-safety',
          message: 'noImplicitAny is disabled - allows untyped variables',
          file: 'tsconfig.json',
          suggestion: 'Enable noImplicitAny to enforce explicit typing',
        });
      }

      // Check for large exclude list
      const excludeCount = config.exclude?.length || 0;
      if (excludeCount > 5) {
        findings.push({
          severity: 'low',
          category: 'type-safety',
          message: `tsconfig.json excludes ${excludeCount} directories from compilation`,
          file: 'tsconfig.json',
          suggestion: 'Review excludes - some modules may benefit from type checking',
        });
      }
    } catch {
      findings.push({
        severity: 'medium',
        category: 'type-safety',
        message: 'Could not parse tsconfig.json',
        suggestion: 'Verify tsconfig.json is valid JSON',
      });
    }

    return findings;
  }

  // ============ SCORING ============

  private computeHealthScore(findings: DiagnosticFinding[]): number {
    let score = 100;

    for (const finding of findings) {
      switch (finding.severity) {
        case 'critical':
          score -= 15;
          break;
        case 'high':
          score -= 8;
          break;
        case 'medium':
          score -= 4;
          break;
        case 'low':
          score -= 1;
          break;
        // 'info' doesn't reduce score
      }
    }

    return Math.max(0, Math.min(100, score));
  }

  private prioritizeRecommendations(findings: DiagnosticFinding[]): string[] {
    const severityOrder: Record<string, number> = {
      critical: 0,
      high: 1,
      medium: 2,
      low: 3,
      info: 4,
    };

    return [...findings]
      .sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity])
      .filter((f) => f.severity !== 'info')
      .slice(0, 10)
      .map((f) => `[${f.severity.toUpperCase()}] ${f.suggestion}`);
  }
}
