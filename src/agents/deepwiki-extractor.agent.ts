/**
 * DeepWiki Extractor Agent - Code Extraction from GitHub Repositories
 *
 * Implements the "bacterial code" pattern (Karpathy, Feb 2026): instead of
 * importing entire libraries as dependencies, this agent analyzes a GitHub
 * repository to understand specific functionality, then extracts self-contained
 * code targeted for a specific use case.
 *
 * Workflow:
 *   1. Resolve repo -> DeepWiki URL (swap "github" to "deepwiki")
 *   2. Analyze repo structure and target functionality via LLM
 *   3. Identify source files and dependencies
 *   4. Extract minimal self-contained implementation
 *   5. Return extraction plan with confidence assessment
 *
 * Input: {
 *   repoUrl:      GitHub repository URL (e.g., "github.com/owner/repo")
 *   functionality: Description of what to extract (e.g., "fp8 training implementation")
 *   targetModule:  Desired output module name (e.g., "fp8.py")
 *   language:      Target language ("typescript" | "python")
 * }
 *
 * Output: extraction plan, identified source files, dependency analysis,
 *         confidence score, and recommendations
 *
 * Note: This agent produces an extraction PLAN. The actual code generation
 * is performed by the calling AI agent (Claude Code, Cursor, etc.) using
 * DeepWiki MCP + GitHub CLI based on this plan.
 *
 * Tier: 1 (read-only analysis, no mutations)
 */

import logger from '../utils/logger.js';
import { BaseAgent } from './base.agent.js';
import type { AgentContext, AgentResponse } from './types.js';

// ============ INPUT INTERFACE ============

interface DeepWikiExtractorInput {
  /** GitHub repository URL (e.g., "github.com/owner/repo" or full https URL) */
  repoUrl: string;
  /** Natural language description of the functionality to extract */
  functionality: string;
  /** Desired output module/file name (e.g., "fp8.py", "carbon-calc.ts") */
  targetModule: string;
  /** Target programming language */
  language: 'typescript' | 'python';
}

// ============ ANALYSIS TYPES ============

interface SourceFile {
  path: string;
  relevance: 'primary' | 'supporting' | 'reference';
  reason: string;
}

interface DependencyAnalysis {
  internalDeps: string[];
  externalDeps: string[];
  removableDeps: string[];
  requiredDeps: string[];
}

interface ExtractionPlan {
  deepwikiUrl: string;
  sourceFiles: SourceFile[];
  dependencies: DependencyAnalysis;
  extractionSteps: string[];
  estimatedLines: number;
  risks: string[];
  licenseCheck: string;
}

// ============ CONSTANTS ============

/** Complexity thresholds for confidence scoring */
const COMPLEXITY = {
  /** Below this file count, extraction is straightforward */
  LOW_FILE_COUNT: 3,
  /** Above this, extraction becomes risky */
  HIGH_FILE_COUNT: 10,
  /** Below this dep count, likely self-containable */
  LOW_DEP_COUNT: 2,
  /** Above this, dependency untangling is hard */
  HIGH_DEP_COUNT: 5,
};

// ============ AGENT IMPLEMENTATION ============

export class DeepWikiExtractorAgent extends BaseAgent {
  constructor() {
    super({
      name: 'deepwiki-extractor',
      description:
        'Analyzes GitHub repositories via DeepWiki to plan extraction of specific functionality into self-contained, dependency-free code',
      capabilities: [
        'repo-analysis',
        'code-extraction',
        'dependency-analysis',
        'bacterial-code',
        'deepwiki-integration',
      ],
      model: 'llama-3.1-70b-versatile',
      modelTier: 'standard',
    });
  }

  async execute(
    context: AgentContext,
    input: Record<string, unknown>,
  ): Promise<AgentResponse> {
    const startTime = Date.now();

    // Log start
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
      // Validate input
      const validated = this.validateInput(input);

      // Build DeepWiki URL
      const deepwikiUrl = this.buildDeepWikiUrl(validated.repoUrl);

      // Parse repo identity
      const repoIdentity = this.parseRepoIdentity(validated.repoUrl);

      // Build extraction plan using LLM
      const plan = await this.buildExtractionPlan(
        validated,
        deepwikiUrl,
        repoIdentity,
      );

      // Calculate confidence
      const confidence = this.calculateConfidence(plan);

      // Generate recommendations
      const recommendations = this.generateRecommendations(plan, confidence);

      const reasoning = [
        `Analyzed repository ${repoIdentity.owner}/${repoIdentity.repo} for "${validated.functionality}".`,
        `DeepWiki URL: ${deepwikiUrl}`,
        `Identified ${plan.sourceFiles.length} source files relevant to extraction.`,
        `${plan.dependencies.externalDeps.length} external dependencies found, ${plan.dependencies.removableDeps.length} removable.`,
        `Estimated output: ~${plan.estimatedLines} lines of ${validated.language}.`,
        plan.risks.length > 0
          ? `Risks: ${plan.risks.join('; ')}`
          : 'No significant risks identified.',
      ].join(' ');

      const response: AgentResponse = {
        agentName: this.config.name,
        result: {
          extractionPlan: plan,
          deepwikiUrl,
          repo: repoIdentity,
          targetModule: validated.targetModule,
          language: validated.language,
        },
        confidence,
        reasoning,
        recommendations,
        metadata: {
          durationMs: Date.now() - startTime,
          model: this.config.model,
          repoUrl: validated.repoUrl,
          functionality: validated.functionality,
        },
      };

      // Log completion
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

      logger.error('DeepWiki extraction failed', {
        agent: this.config.name,
        error: errorMessage,
        repoUrl: input.repoUrl,
      });

      // Log error
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
        reasoning: `Extraction analysis failed: ${errorMessage}`,
        recommendations: [
          'Verify the repository URL is correct and publicly accessible',
          'Check that the functionality description is specific enough',
          'Try narrowing the scope of what to extract',
        ],
        metadata: { durationMs, model: this.config.model },
      };
    }
  }

  // ============ PRIVATE METHODS ============

  private validateInput(input: Record<string, unknown>): DeepWikiExtractorInput {
    const repoUrl = input.repoUrl;
    const functionality = input.functionality;
    const targetModule = input.targetModule;
    const language = input.language;

    if (typeof repoUrl !== 'string' || !this.parseGitHubRepoPath(repoUrl)) {
      throw new Error(
        'repoUrl must be a valid GitHub repository URL in the form https://github.com/{owner}/{repo}',
      );
    }
    // Enforce github.com/{owner}/{repo} format, strip extra path segments
    const urlMatch = repoUrl.match(/(?:https?:\/\/)?(?:www\.)?github\.com\/([^/]+)\/([^/?#]+)/);
    if (!urlMatch) {
      throw new Error('repoUrl must be a valid GitHub repository URL in the form github.com/{owner}/{repo}');
    }
    const [, owner, repoName] = urlMatch;
    const normalizedRepoUrl = `https://github.com/${owner}/${repoName.replace(/\.git$/, '')}`;
    if (typeof functionality !== 'string' || functionality.length < 10) {
      throw new Error('functionality must be a descriptive string (min 10 chars)');
    }
    if (typeof targetModule !== 'string' || targetModule.length < 1) {
      throw new Error('targetModule must be a non-empty string');
    }
    if (language !== 'typescript' && language !== 'python') {
      throw new Error('language must be "typescript" or "python"');
    }

    return { repoUrl: normalizedRepoUrl, functionality, targetModule, language };
  }

  /**
   * Parse a GitHub URL and return the "{owner}/{repo}" path, or null if the
   * URL does not point to a valid repository root (github.com/{owner}/{repo}).
   * Accepts an optional "https://" prefix; rejects subdomains, extra path
   * segments, query strings, and non-repo GitHub URLs.
   */
  private parseGitHubRepoPath(repoUrl: string): string | null {
    // Normalise: add protocol so URL() can parse it, strip .git suffix
    const withProtocol = /^https?:\/\//i.test(repoUrl)
      ? repoUrl
      : `https://${repoUrl}`;

    let parsed: URL;
    try {
      parsed = new URL(withProtocol);
    } catch {
      return null;
    }

    // Only accept github.com (no subdomains like www.github.com)
    if (parsed.hostname !== 'github.com') return null;

    // Pathname must be exactly /{owner}/{repo} (no trailing slash, no extra segments)
    const pathMatch = parsed.pathname.replace(/\.git$/, '').match(/^\/([^/]+)\/([^/]+)$/);
    if (!pathMatch) return null;

    return `${pathMatch[1]}/${pathMatch[2]}`;
  }

  /** Convert a GitHub URL to a DeepWiki URL */
  private buildDeepWikiUrl(repoUrl: string): string {
    const ownerRepo = this.parseGitHubRepoPath(repoUrl);
    if (!ownerRepo) {
      throw new Error(`Cannot build DeepWiki URL from invalid GitHub URL: ${repoUrl}`);
    }
    return `https://deepwiki.com/${ownerRepo}`;
  }

  /** Parse owner and repo name from GitHub URL */
  private parseRepoIdentity(repoUrl: string): { owner: string; repo: string } {
    const ownerRepo = this.parseGitHubRepoPath(repoUrl);
    if (!ownerRepo) {
      throw new Error(`Cannot parse owner/repo from URL: ${repoUrl}`);
    }
    const [owner, repo] = ownerRepo.split('/');
    return { owner, repo };
  }

  /** Build extraction plan using LLM analysis or deterministic fallback */
  private async buildExtractionPlan(
    input: DeepWikiExtractorInput,
    deepwikiUrl: string,
    repo: { owner: string; repo: string },
  ): Promise<ExtractionPlan> {
    const prompt = [
      `Analyze this GitHub repository for code extraction:`,
      `Repository: ${repo.owner}/${repo.repo}`,
      `Target functionality: ${input.functionality}`,
      `Target output: ${input.targetModule} (${input.language})`,
      ``,
      `Provide a JSON response with:`,
      `- sourceFiles: array of {path, relevance ("primary"|"supporting"|"reference"), reason}`,
      `- dependencies: {internalDeps, externalDeps, removableDeps, requiredDeps}`,
      `- extractionSteps: array of step descriptions`,
      `- estimatedLines: number`,
      `- risks: array of risk descriptions`,
      `- licenseCheck: license type and extraction compatibility`,
    ].join('\n');

    const llmResult = await this.callLLM(prompt);

    // Parse LLM response or use deterministic fallback
    try {
      const parsed = JSON.parse(llmResult.content);
      return {
        deepwikiUrl,
        sourceFiles: parsed.sourceFiles || [],
        dependencies: parsed.dependencies || {
          internalDeps: [],
          externalDeps: [],
          removableDeps: [],
          requiredDeps: [],
        },
        extractionSteps: parsed.extractionSteps || this.defaultExtractionSteps(input, repo),
        estimatedLines: parsed.estimatedLines || 150,
        risks: parsed.risks || [],
        licenseCheck: parsed.licenseCheck || 'Check repository LICENSE file before extraction',
      };
    } catch {
      // LLM unavailable or unparseable - use deterministic plan
      logger.debug('Using deterministic extraction plan (LLM unavailable or unparseable)');
      return {
        deepwikiUrl,
        sourceFiles: [],
        dependencies: {
          internalDeps: [],
          externalDeps: [],
          removableDeps: [],
          requiredDeps: [],
        },
        extractionSteps: this.defaultExtractionSteps(input, repo),
        estimatedLines: 150,
        risks: [
          'LLM analysis unavailable - manual source file identification required',
          'License compatibility must be verified manually',
        ],
        licenseCheck: 'Manual verification required - check repository LICENSE file',
      };
    }
  }

  /** Default extraction steps when LLM is unavailable */
  private defaultExtractionSteps(
    input: DeepWikiExtractorInput,
    repo: { owner: string; repo: string },
  ): string[] {
    return [
      `Open DeepWiki: deepwiki.com/${repo.owner}/${repo.repo}`,
      `Ask DeepWiki: "How does ${repo.repo} implement ${input.functionality}?"`,
      `Identify the core source files from the DeepWiki response`,
      `Use GitHub CLI to read the identified source files: gh api repos/${repo.owner}/${repo.repo}/contents/{path}`,
      `Identify internal dependencies within those files`,
      `Determine which external dependencies can be inlined vs. kept`,
      `Write ${input.targetModule} with the extracted logic, removing all unnecessary abstractions`,
      `Add source attribution header with repo URL, file paths, and extraction date`,
      `Write equivalence tests comparing extracted code output to original`,
      `Verify license compatibility for extraction`,
    ];
  }

  /** Calculate confidence based on extraction complexity */
  private calculateConfidence(plan: ExtractionPlan): number {
    let confidence = 0.8; // Base confidence

    // More source files = harder extraction
    const fileCount = plan.sourceFiles.length;
    if (fileCount <= COMPLEXITY.LOW_FILE_COUNT) {
      confidence += 0.1;
    } else if (fileCount >= COMPLEXITY.HIGH_FILE_COUNT) {
      confidence -= 0.2;
    }

    // More external deps = harder to make self-contained
    const depCount = plan.dependencies.externalDeps.length;
    if (depCount <= COMPLEXITY.LOW_DEP_COUNT) {
      confidence += 0.05;
    } else if (depCount >= COMPLEXITY.HIGH_DEP_COUNT) {
      confidence -= 0.15;
    }

    // Removable deps increase confidence
    const removableRatio = plan.dependencies.externalDeps.length > 0
      ? plan.dependencies.removableDeps.length / plan.dependencies.externalDeps.length
      : 1;
    confidence += removableRatio * 0.1;

    // Risks decrease confidence
    confidence -= plan.risks.length * 0.05;

    // Clamp to [0, 1]
    return Math.max(0, Math.min(1, confidence));
  }

  /** Generate actionable recommendations */
  private generateRecommendations(plan: ExtractionPlan, confidence: number): string[] {
    const recs: string[] = [];

    // Always recommend using DeepWiki
    recs.push(
      `Use DeepWiki MCP to Q&A against the repo: ${plan.deepwikiUrl}`,
    );

    // Extraction approach
    if (confidence >= 0.7) {
      recs.push(
        'Extraction is feasible. Use the extraction steps in the plan to guide an AI agent.',
      );
    } else if (confidence >= 0.4) {
      recs.push(
        'Extraction is possible but complex. Consider extracting a subset of the functionality first.',
      );
    } else {
      recs.push(
        'Extraction is high-risk. Consider using the library as a dependency instead.',
      );
    }

    // License
    recs.push(`Verify license before extraction: ${plan.licenseCheck}`);

    // Dependencies
    if (plan.dependencies.requiredDeps.length > 0) {
      recs.push(
        `These dependencies cannot be removed and must be kept: ${plan.dependencies.requiredDeps.join(', ')}`,
      );
    }

    // Testing
    recs.push(
      'Write equivalence tests that compare extracted code output against the original library.',
    );

    // Risks
    if (plan.risks.length > 0) {
      recs.push(`Address these risks before production use: ${plan.risks.join('; ')}`);
    }

    return recs;
  }
}
