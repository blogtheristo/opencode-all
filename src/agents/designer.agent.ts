/**
 * Designer Agent — DWS IQ 6 Design-to-Code Bridge
 *
 * Inspired by Anthropic's internal workflow where designers ship production code
 * with no engineer in the loop. This agent enables non-technical designers to:
 *
 *   1. Screenshot-to-prototype — Paste a Figma/design mockup, get working code
 *   2. Frontend implementation — Typefaces, colors, spacing, layout changes in codebase
 *   3. State management — Data flow changes typically requiring engineering
 *   4. Polish & bug fixes — Review and ship code solutions from issue descriptions
 *   5. Edge case mapping — Discover edge cases during design phase, before engineering
 *
 * The Anthropic approach:
 *   - Designer takes Figma mockup → pastes into Claude Code → gets functional prototype
 *   - Designer implements front-end changes directly in the codebase
 *   - Designer makes state management changes (data flow, context, stores)
 *   - GitHub issues → Claude proposes code → designer reviews and ships
 *   - Custom memory: "you're working with a designer who has little coding experience"
 *
 * This agent adapts its behavior for non-technical users:
 *   - Detailed explanations of every change
 *   - Smaller, incremental modifications
 *   - Visual-first language (not engineering jargon)
 *   - Confidence scoring on whether changes are safe to ship
 *
 * Input: {
 *   action:       "screenshot-to-code" | "style-change" | "component-create" |
 *                 "state-change" | "polish-fix" | "edge-case-audit" | "design-review"
 *   description:  Natural language description of what the designer wants
 *   screenshot?:  Base64 or URL of the design mockup
 *   targetFile?:  File path to modify (optional — agent can discover)
 *   framework?:   "react" | "html" | "vue" (default: "react")
 *   designSystem?: { colors, fonts, spacing, breakpoints }
 * }
 *
 * Output: Code changes, explanations, safety assessment, and ship recommendation
 *
 * Tier: 1 (autonomous for CSS/styling, supervised for state management)
 * Cognitive pattern: Chain-of-Thought with visual reasoning
 */

import logger from '../utils/logger.js';
import { BaseAgent } from './base.agent.js';
import type { AgentContext, AgentResponse } from './types.js';
import { createHash } from 'crypto';

// ============ INPUT INTERFACES ============

interface DesignSystem {
  colors?: Record<string, string>;
  fonts?: { heading?: string; body?: string; mono?: string };
  spacing?: { unit: number; scale: number[] };
  breakpoints?: Record<string, number>;
  darkMode?: boolean;
}

type DesignerAction =
  | 'screenshot-to-code'
  | 'style-change'
  | 'component-create'
  | 'state-change'
  | 'polish-fix'
  | 'edge-case-audit'
  | 'design-review';

interface DesignerInput {
  action: DesignerAction;
  description: string;
  screenshot?: string;
  targetFile?: string;
  framework: 'react' | 'html' | 'vue';
  designSystem?: DesignSystem;
  issueUrl?: string;
  componentName?: string;
}

// ============ DESIGN TOKENS (DWS Brand) ============

const DWS_DESIGN_TOKENS = {
  colors: {
    primary: '#1a1a2e',
    secondary: '#16213e',
    accent: '#0f3460',
    highlight: '#e94560',
    surface: '#ffffff',
    surfaceDark: '#0f0f23',
    text: '#1a1a2e',
    textMuted: '#6b7280',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    sovereignty: '#fbbf24',
  },
  fonts: {
    heading: 'Inter, system-ui, sans-serif',
    body: 'Inter, system-ui, sans-serif',
    mono: 'JetBrains Mono, monospace',
  },
  spacing: {
    unit: 4,
    scale: [0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24, 32, 40, 48, 64],
  },
  breakpoints: {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536,
  },
  tailwind: {
    prefix: '',
    darkMode: 'class',
  },
};

// ============ COMPLEXITY CLASSIFICATION ============

/** Classify change complexity for designer safety */
export function classifyComplexity(
  action: DesignerAction,
  description: string,
): {
  level: 'safe' | 'moderate' | 'review-required';
  reason: string;
  engineerReview: boolean;
} {
  const desc = description.toLowerCase();
  const riskyPatterns =
    /api|fetch|database|auth|token|session|route|navigation|form.*submit|delete|mutation/i;

  // Safe: purely visual changes
  if (action === 'style-change' || action === 'polish-fix') {
    const visualOnly =
      /color|font|spacing|padding|margin|border|radius|shadow|opacity|size|width|height|align|text/i;
    if (
      visualOnly.test(desc) &&
      !desc.includes('state') &&
      !desc.includes('data') &&
      !riskyPatterns.test(desc)
    ) {
      return {
        level: 'safe',
        reason: 'Visual-only change — safe for designer to ship',
        engineerReview: false,
      };
    }
  }

  // Review required: state management, data flow, API calls
  if (action === 'state-change') {
    return {
      level: 'review-required',
      reason: 'State management change — engineer review recommended before shipping',
      engineerReview: true,
    };
  }

  if (riskyPatterns.test(desc)) {
    return {
      level: 'review-required',
      reason: 'Change involves data/API/auth — engineer review required',
      engineerReview: true,
    };
  }

  // Moderate: structural UI changes
  if (action === 'component-create' || action === 'screenshot-to-code') {
    return {
      level: 'moderate',
      reason: 'New component or structural change — test thoroughly before shipping',
      engineerReview: false,
    };
  }

  return {
    level: 'moderate',
    reason: 'Mixed change — review the diff carefully before shipping',
    engineerReview: false,
  };
}

// ============ EDGE CASE PATTERNS ============

const EDGE_CASE_CATEGORIES = [
  {
    category: 'Empty states',
    checks: [
      'No data loaded',
      'Empty list/table',
      'First-time user (no content)',
      'Search with no results',
    ],
  },
  {
    category: 'Loading states',
    checks: [
      'Initial load',
      'Pagination loading',
      'Background refresh',
      'Slow network (3G simulation)',
    ],
  },
  {
    category: 'Error states',
    checks: [
      'Network failure',
      'Server error (500)',
      'Auth expired (401)',
      'Validation errors on form',
    ],
  },
  {
    category: 'Content overflow',
    checks: [
      'Long text truncation',
      'Many items in list (100+)',
      'Wide content in narrow container',
      'Missing/broken images',
    ],
  },
  {
    category: 'Responsive',
    checks: ['Mobile (320px)', 'Tablet (768px)', 'Desktop (1280px)', 'Ultra-wide (2560px)'],
  },
  {
    category: 'Accessibility',
    checks: [
      'Keyboard navigation (Tab order)',
      'Screen reader labels',
      'Color contrast (WCAG AA)',
      'Focus indicators visible',
    ],
  },
  {
    category: 'Internationalization',
    checks: [
      'Long translations (German/Finnish)',
      'RTL text direction',
      'Date/number formatting',
      'Currency symbols',
    ],
  },
  {
    category: 'Interaction',
    checks: [
      'Double-click prevention',
      'Rapid toggle (spam click)',
      'Browser back button',
      'Form with unsaved changes',
    ],
  },
];

// ============ AGENT IMPLEMENTATION ============

export class DesignerAgent extends BaseAgent {
  constructor() {
    super({
      name: 'designer',
      description:
        'Design-to-code bridge enabling non-technical designers to ship production code. ' +
        'Handles screenshot-to-prototype, style changes, component creation, state management, ' +
        'polish fixes, and edge case auditing with detailed explanations for designers.',
      capabilities: [
        'screenshot-to-code',
        'figma-to-prototype',
        'style-implementation',
        'component-creation',
        'state-management',
        'design-polish',
        'edge-case-audit',
        'design-review',
        'tailwind-css',
        'react-components',
        'accessibility-check',
        'responsive-design',
      ],
      model: 'claude-sonnet-5',
    });

    // Designer-friendly SOUL prompt
    this.soulPrompt = [
      'You are a friendly design-to-code assistant working with a designer who has little coding experience.',
      'Your role is to bridge the gap between visual design and working code.',
      '',
      'CRITICAL BEHAVIORS:',
      '- Give detailed explanations of every change in plain language',
      '- Make smaller, incremental changes — never a massive refactor',
      '- Use visual language: "the button", "the card", "the header" — not "the component", "the JSX element"',
      '- When suggesting code, explain WHAT it does visually, not just technically',
      '- Always show before/after when making style changes',
      '- Flag anything that needs an engineer to review',
      '',
      'DESIGN SYSTEM:',
      '- Use TailwindCSS classes (the project standard)',
      '- Follow DWS Brand Standard tokens for colors, fonts, spacing',
      '- Dark mode support via "dark:" prefix classes',
      '- Responsive: mobile-first with sm:, md:, lg:, xl: breakpoints',
      '- Accessibility: WCAG AA minimum, proper ARIA labels, keyboard navigation',
      '',
      'OUTPUT FORMAT:',
      '- Always return valid JSON with: summary, changes[], safeToShip, explanation',
      '- Each change has: file, description, codeSnippet, visualEffect',
      '- Rate confidence 0-1 on whether the designer can ship this without an engineer',
    ].join('\n');
  }

  private sanitizeInputForLogging(input: Record<string, unknown>): Record<string, unknown> {
    if (!input || typeof input !== 'object') {
      return input;
    }

    const cloned: Record<string, unknown> = { ...input };

    const screenshot = cloned.screenshot;
    if (typeof screenshot === 'string') {
      const byteLength = Buffer.byteLength(screenshot, 'base64');
      let sha256: string | undefined;
      try {
        sha256 = createHash('sha256').update(screenshot).digest('hex');
      } catch {
        // If hashing fails for any reason, proceed without the hash
      }

      cloned.screenshot = {
        redacted: true,
        byteLength,
        ...(sha256 ? { sha256 } : {}),
      };
    }

    return cloned;
  }

  async execute(context: AgentContext, input: Record<string, unknown>): Promise<AgentResponse> {
    const startTime = Date.now();
    const sanitizedInput = this.sanitizeInputForLogging(input);

    await this.logExecution({
      agent_name: this.config.name,
      user_id: context.userId,
      org_id: context.orgId,
      session_id: context.sessionId,
      project_id: context.projectId,
      input: sanitizedInput,
      output: null,
      status: 'started',
      duration_ms: 0,
      created_at: new Date().toISOString(),
    });

    try {
      const validated = this.validateInput(input);

      let result: Record<string, unknown>;
      let reasoning: string;
      let recommendations: string[];

      switch (validated.action) {
        case 'screenshot-to-code':
          ({ result, reasoning, recommendations } = await this.screenshotToCode(validated));
          break;
        case 'style-change':
          ({ result, reasoning, recommendations } = this.styleChange(validated));
          break;
        case 'component-create':
          ({ result, reasoning, recommendations } = this.componentCreate(validated));
          break;
        case 'state-change':
          ({ result, reasoning, recommendations } = this.stateChange(validated));
          break;
        case 'polish-fix':
          ({ result, reasoning, recommendations } = await this.polishFix(validated));
          break;
        case 'edge-case-audit':
          ({ result, reasoning, recommendations } = this.edgeCaseAudit(validated));
          break;
        case 'design-review':
          ({ result, reasoning, recommendations } = await this.designReview(validated));
          break;
        default:
          throw new Error(`Unknown action: ${validated.action}`);
      }

      const complexity = classifyComplexity(validated.action, validated.description);
      const confidence = this.calculateConfidence(validated, complexity);

      const response: AgentResponse = {
        agentName: this.config.name,
        result: {
          ...result,
          complexity: complexity.level,
          engineerReviewRequired: complexity.engineerReview,
          safeToShip: complexity.level === 'safe',
        },
        confidence,
        reasoning,
        recommendations: [
          ...recommendations,
          complexity.engineerReview
            ? 'IMPORTANT: Have an engineer review this change before shipping'
            : 'This change is safe for the designer to ship directly',
        ],
        metadata: {
          durationMs: Date.now() - startTime,
          model: this.config.model,
          action: validated.action,
          complexityLevel: complexity.level,
          framework: validated.framework,
          designerWorkflow: true,
        },
      };

      await this.logExecution({
        agent_name: this.config.name,
        user_id: context.userId,
        org_id: context.orgId,
        session_id: context.sessionId,
        project_id: context.projectId,
        input: sanitizedInput,
        output: response,
        status: 'completed',
        duration_ms: Date.now() - startTime,
        created_at: new Date().toISOString(),
      });

      return response;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      const durationMs = Date.now() - startTime;

      logger.error('Designer agent failed', { agent: this.config.name, error: errorMessage });

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
        reasoning: `Designer agent failed: ${errorMessage}`,
        recommendations: ['Check input format — description is required for all actions'],
        metadata: { durationMs, model: this.config.model },
      };
    }
  }

  // ============ ACTION HANDLERS ============

  private async screenshotToCode(input: DesignerInput): Promise<{
    result: Record<string, unknown>;
    reasoning: string;
    recommendations: string[];
  }> {
    const recommendations: string[] = [];
    const designSystem = input.designSystem || DWS_DESIGN_TOKENS;

    // Build LLM prompt for description-driven UI generation (no direct image analysis)
    const prompt = [
      'A designer has provided a textual description of a UI (optionally based on a screenshot/mockup) and wants working code.',
      '',
      `Description: ${input.description}`,
      `Framework: ${input.framework}`,
      `Target file: ${input.targetFile || 'auto-detect'}`,
      `Design tokens: ${JSON.stringify(designSystem, null, 2)}`,
      `Screenshot metadata: ${input.screenshot ? 'provided (image contents are not directly visible to the model)' : 'not provided'}`,
      '',
      'Generate a JSON response with:',
      '1. "component": The component name (PascalCase)',
      '2. "code": Complete working code using TailwindCSS',
      '3. "explanation": Plain-language explanation for a non-technical designer',
      '4. "visualBreakdown": List of visual elements implied by the description',
      '5. "responsive": How the layout adapts across breakpoints',
      '6. "accessibility": ARIA labels and keyboard navigation included',
    ].join('\n');

    const llm = await this.callLLM(prompt);
    let llmResult: Record<string, unknown> = {};
    try {
      llmResult = JSON.parse(llm.content);
    } catch {
      llmResult = { rawSuggestion: llm.content };
    }

    recommendations.push('Review the generated code in a browser before shipping');
    recommendations.push('Check responsive behavior at mobile (320px) and desktop (1280px)');
    recommendations.push('Verify colors match your Figma design tokens');
    if (input.screenshot) {
      recommendations.push('Compare your screenshot or mockup side-by-side with the rendered code');
    }

    return {
      result: {
        action: 'screenshot-to-code',
        framework: input.framework,
        designTokensUsed: Object.keys(designSystem),
        screenshotProvided: !!input.screenshot,
        generatedCode: llmResult,
        workflow: [
          '1. Designer writes a textual description of the desired UI (optionally referencing a screenshot or mockup)',
          '2. Agent interprets the textual description to infer layout, colors, typography, and spacing',
          '3. Agent generates working TailwindCSS + React code based on the description and design tokens',
          '4. Designer reviews in browser (and compares with any existing screenshot/mockup)',
          '5. Designer ships or iterates',
        ],
      },
      reasoning: `Screenshot-to-code for "${input.description}". Generated ${input.framework} component with TailwindCSS based on the textual description. ${input.screenshot ? 'A screenshot was noted for human comparison but was not directly analyzed by the model.' : 'No screenshot was provided; generation is based solely on the description.'}`,
      recommendations,
    };
  }

  private styleChange(input: DesignerInput): {
    result: Record<string, unknown>;
    reasoning: string;
    recommendations: string[];
  } {
    const recommendations: string[] = [];
    const designSystem = input.designSystem || DWS_DESIGN_TOKENS;

    // Parse style intent from description
    const styleCategories = this.categorizeStyleChange(input.description);

    recommendations.push('Test the change in both light and dark mode');
    recommendations.push('Check the change on mobile and desktop');
    if (styleCategories.includes('color')) {
      recommendations.push('Verify color contrast meets WCAG AA (4.5:1 for text, 3:1 for UI)');
    }
    if (styleCategories.includes('font')) {
      recommendations.push(
        'Ensure custom fonts are loaded — check for FOUT (Flash of Unstyled Text)',
      );
    }
    if (styleCategories.includes('spacing')) {
      recommendations.push('Use the spacing scale (multiples of 4px) for consistent rhythm');
    }

    return {
      result: {
        action: 'style-change',
        targetFile: input.targetFile || 'auto-detect from description',
        styleCategories,
        designTokens: designSystem,
        tailwindMapping: this.mapToTailwind(styleCategories, input.description),
        beforeAfter: {
          note: 'Run the agent with LLM to get specific before/after code',
        },
      },
      reasoning: `Style change: "${input.description}". Affects: ${styleCategories.join(', ')}. ${input.targetFile ? `Target: ${input.targetFile}` : 'Target file will be auto-detected.'}`,
      recommendations,
    };
  }

  private componentCreate(input: DesignerInput): {
    result: Record<string, unknown>;
    reasoning: string;
    recommendations: string[];
  } {
    const recommendations: string[] = [];
    const componentName = input.componentName || this.inferComponentName(input.description);

    // Generate component scaffold
    const scaffold = this.generateComponentScaffold(componentName, input);

    recommendations.push(`Create the component file: src/components/${componentName}.tsx`);
    recommendations.push(
      'Add a Storybook story or preview page to test the component in isolation',
    );
    recommendations.push(
      'Include at least: default state, loading state, empty state, error state',
    );
    recommendations.push('Test keyboard navigation (Tab, Enter, Escape)');

    return {
      result: {
        action: 'component-create',
        componentName,
        framework: input.framework,
        scaffold,
        edgeCases: this.getComponentEdgeCases(input.description),
        accessibilityChecklist: [
          'Semantic HTML elements (button, nav, main, etc.)',
          'ARIA labels for interactive elements',
          'Focus management for modals/dropdowns',
          'Color contrast WCAG AA',
          'Keyboard operable (no mouse-only interactions)',
        ],
      },
      reasoning: `Component creation: "${componentName}" — ${input.description}. Generated ${input.framework} scaffold with TailwindCSS. Edge cases pre-identified.`,
      recommendations,
    };
  }

  private stateChange(input: DesignerInput): {
    result: Record<string, unknown>;
    reasoning: string;
    recommendations: string[];
  } {
    const recommendations: string[] = [];

    // State changes are higher risk — always recommend engineer review
    recommendations.push(
      'ENGINEER REVIEW REQUIRED: State management affects data flow across the app',
    );
    recommendations.push('Test all components that read this state after the change');
    recommendations.push(
      'Check for race conditions: what happens if the state updates while user is interacting?',
    );
    recommendations.push('Verify the change works with browser back/forward navigation');

    const statePattern = this.identifyStatePattern(input.description);

    return {
      result: {
        action: 'state-change',
        statePattern,
        riskLevel: 'moderate-to-high',
        description: input.description,
        impactAnalysis: {
          note: 'State changes can affect multiple components. Run with LLM for full impact analysis.',
          commonPatterns: [
            'React Context: affects all consumers of the context',
            'useState/useReducer: local to component + children',
            'URL state: affects routing and shareable links',
            'Form state: affects validation and submission',
          ],
        },
        testChecklist: [
          'Component renders with initial state',
          'State updates trigger correct re-renders',
          'No stale closures in event handlers',
          'State persists across navigation (if intended)',
          'State resets on logout/cleanup (if intended)',
        ],
      },
      reasoning: `State management change: "${input.description}". Pattern: ${statePattern}. This is a higher-complexity change — engineer review is recommended. Designers at Anthropic make these changes regularly, but they get reviewed before shipping.`,
      recommendations,
    };
  }

  private async polishFix(input: DesignerInput): Promise<{
    result: Record<string, unknown>;
    reasoning: string;
    recommendations: string[];
  }> {
    const recommendations: string[] = [];

    // This is the "file a GitHub issue, Claude proposes a fix" workflow
    const prompt = [
      'A designer has described a polish/bug fix they want. Generate a solution.',
      '',
      `Issue: ${input.description}`,
      `Target file: ${input.targetFile || 'unknown'}`,
      `Framework: ${input.framework}`,
      '',
      'Respond with JSON:',
      '1. "diagnosis": What is likely wrong (plain language)',
      '2. "fix": The code change needed',
      '3. "explanation": Why this fixes it (designer-friendly)',
      '4. "sideEffects": Any other parts of the UI this might affect',
      '5. "testSteps": How the designer can verify the fix works',
    ].join('\n');

    const llm = await this.callLLM(prompt);
    let fixProposal: Record<string, unknown> = {};
    try {
      fixProposal = JSON.parse(llm.content);
    } catch {
      fixProposal = { rawSuggestion: llm.content };
    }

    recommendations.push('Test the fix in the browser before shipping');
    recommendations.push("Check that the fix doesn't break anything nearby");
    if (input.issueUrl) {
      recommendations.push(`Link this fix to the GitHub issue: ${input.issueUrl}`);
    }

    return {
      result: {
        action: 'polish-fix',
        issueDescription: input.description,
        targetFile: input.targetFile,
        fixProposal,
        workflow: [
          '1. Designer describes the issue (or links GitHub issue)',
          '2. Agent diagnoses the problem',
          '3. Agent proposes a code fix with explanation',
          '4. Designer reviews the explanation and tests',
          '5. Designer ships the fix',
        ],
      },
      reasoning: `Polish/fix for: "${input.description}". ${input.targetFile ? `Target: ${input.targetFile}.` : 'Target file not specified — diagnosis includes file detection.'} This follows the Anthropic pattern: designer files issue → agent proposes fix → designer reviews and ships.`,
      recommendations,
    };
  }

  private edgeCaseAudit(input: DesignerInput): {
    result: Record<string, unknown>;
    reasoning: string;
    recommendations: string[];
  } {
    const recommendations: string[] = [];

    // Map edge cases to the designer's component/feature
    const relevantCases = EDGE_CASE_CATEGORIES.map((category) => ({
      ...category,
      applicability: this.assessEdgeCaseRelevance(category.category, input.description),
    }));

    const highPriority = relevantCases.filter((c) => c.applicability === 'high');
    const mediumPriority = relevantCases.filter((c) => c.applicability === 'medium');

    recommendations.push(
      `${highPriority.length} high-priority edge case categories identified — address these before shipping`,
    );
    recommendations.push(
      `${mediumPriority.length} medium-priority categories — address in follow-up iteration`,
    );
    recommendations.push('Create a checklist from the edge cases and test each one manually');
    recommendations.push(
      'This audit catches issues that used to only surface when engineers built the feature',
    );

    return {
      result: {
        action: 'edge-case-audit',
        feature: input.description,
        componentName: input.componentName,
        edgeCases: relevantCases,
        summary: {
          totalCategories: EDGE_CASE_CATEGORIES.length,
          highPriority: highPriority.length,
          mediumPriority: mediumPriority.length,
          totalChecks: relevantCases.reduce((sum, c) => sum + c.checks.length, 0),
        },
        designPhaseValue:
          'Edge cases discovered during design phase save 2-3x engineering time vs discovering them during implementation',
      },
      reasoning: `Edge case audit for "${input.description}". ${highPriority.length} high-priority and ${mediumPriority.length} medium-priority edge case categories identified. This catches issues before engineering starts — the same approach Anthropic designers use with Claude Code.`,
      recommendations,
    };
  }

  private async designReview(input: DesignerInput): Promise<{
    result: Record<string, unknown>;
    reasoning: string;
    recommendations: string[];
  }> {
    const recommendations: string[] = [];

    const prompt = [
      'Review this design/component from a design systems perspective.',
      '',
      `Description: ${input.description}`,
      `Component: ${input.componentName || 'unknown'}`,
      `Framework: ${input.framework}`,
      `Target file: ${input.targetFile || 'unknown'}`,
      '',
      'Evaluate and respond with JSON:',
      '1. "consistency": Does it follow the design system tokens?',
      '2. "accessibility": WCAG AA compliance assessment',
      '3. "responsive": Does it work across breakpoints?',
      '4. "darkMode": Does it support dark mode?',
      '5. "suggestions": Specific improvements (visual, not technical)',
      '6. "score": 0-100 design quality score',
    ].join('\n');

    const llm = await this.callLLM(prompt);
    let review: Record<string, unknown> = {};
    try {
      review = JSON.parse(llm.content);
    } catch {
      review = { rawReview: llm.content };
    }

    recommendations.push('Address any accessibility issues before shipping');
    recommendations.push('Test dark mode toggle to verify all elements adapt correctly');
    recommendations.push('Compare against the DWS Brand Standard for consistency');

    return {
      result: {
        action: 'design-review',
        component: input.componentName || input.description,
        review,
        designSystem: DWS_DESIGN_TOKENS,
      },
      reasoning: `Design review for "${input.componentName || input.description}". Evaluated consistency, accessibility, responsiveness, and dark mode support.`,
      recommendations,
    };
  }

  // ============ HELPERS ============

  private validateInput(input: Record<string, unknown>): DesignerInput {
    const actions: DesignerAction[] = [
      'screenshot-to-code',
      'style-change',
      'component-create',
      'state-change',
      'polish-fix',
      'edge-case-audit',
      'design-review',
    ];

    if (!actions.includes(input.action as DesignerAction)) {
      throw new Error(`action must be one of: ${actions.join(', ')}`);
    }
    if (!input.description || typeof input.description !== 'string') {
      throw new Error(
        'description (string) is required — describe what you want in plain language',
      );
    }

    const allowedFrameworks: Array<'react' | 'html' | 'vue'> = ['react', 'html', 'vue'];
    const rawFramework = (input as { framework?: unknown }).framework;
    let framework: 'react' | 'html' | 'vue';

    if (rawFramework === undefined) {
      framework = 'react';
    } else if (
      typeof rawFramework === 'string' &&
      allowedFrameworks.includes(rawFramework as 'react' | 'html' | 'vue')
    ) {
      framework = rawFramework as 'react' | 'html' | 'vue';
    } else {
      throw new Error(`framework must be one of: ${allowedFrameworks.join(', ')}`);
    }

    return {
      action: input.action as DesignerAction,
      description: input.description as string,
      screenshot: input.screenshot as string | undefined,
      targetFile: input.targetFile as string | undefined,
      framework,
      designSystem: input.designSystem as DesignSystem | undefined,
      issueUrl: input.issueUrl as string | undefined,
      componentName: input.componentName as string | undefined,
    };
  }

  private categorizeStyleChange(description: string): string[] {
    const categories: string[] = [];
    const desc = description.toLowerCase();

    if (/color|bg|background|theme|dark|light|brand/.test(desc)) categories.push('color');
    if (/font|text|typography|heading|title|size|weight|bold|italic/.test(desc))
      categories.push('font');
    if (/spacing|padding|margin|gap|space/.test(desc)) categories.push('spacing');
    if (/border|radius|rounded|outline/.test(desc)) categories.push('border');
    if (/shadow|elevation|depth/.test(desc)) categories.push('shadow');
    if (/layout|flex|grid|position|align|justify|center/.test(desc)) categories.push('layout');
    if (/animation|transition|hover|focus|active/.test(desc)) categories.push('interaction');
    if (/responsive|mobile|desktop|tablet|breakpoint/.test(desc)) categories.push('responsive');

    return categories.length > 0 ? categories : ['general'];
  }

  private mapToTailwind(categories: string[], _description: string): Record<string, string[]> {
    const mapping: Record<string, string[]> = {};

    if (categories.includes('color')) {
      mapping.color = [
        'bg-{color}-{shade}',
        'text-{color}-{shade}',
        'border-{color}-{shade}',
        'dark:bg-{color}-{shade}',
        'dark:text-{color}-{shade}',
      ];
    }
    if (categories.includes('font')) {
      mapping.font = [
        'text-sm/base/lg/xl/2xl',
        'font-normal/medium/semibold/bold',
        'leading-tight/normal/relaxed',
        'tracking-tight/normal/wide',
      ];
    }
    if (categories.includes('spacing')) {
      mapping.spacing = [
        'p-{0-12}',
        'm-{0-12}',
        'gap-{0-12}',
        'px-{n} py-{n}',
        'space-x-{n} space-y-{n}',
      ];
    }
    if (categories.includes('layout')) {
      mapping.layout = [
        'flex',
        'flex-col',
        'flex-row',
        'items-center',
        'justify-between',
        'grid',
        'grid-cols-{n}',
        'gap-{n}',
      ];
    }
    if (categories.includes('responsive')) {
      mapping.responsive = ['sm:{class}', 'md:{class}', 'lg:{class}', 'xl:{class}'];
    }

    return mapping;
  }

  private inferComponentName(description: string): string {
    const desc = description.toLowerCase();
    const nameMap: Record<string, string> = {
      button: 'Button',
      card: 'Card',
      modal: 'Modal',
      dialog: 'Dialog',
      form: 'Form',
      input: 'Input',
      table: 'DataTable',
      list: 'List',
      nav: 'Navigation',
      header: 'Header',
      footer: 'Footer',
      sidebar: 'Sidebar',
      dropdown: 'Dropdown',
      menu: 'Menu',
      toast: 'Toast',
      badge: 'Badge',
      avatar: 'Avatar',
      tabs: 'Tabs',
      accordion: 'Accordion',
      tooltip: 'Tooltip',
    };

    for (const [key, name] of Object.entries(nameMap)) {
      if (desc.includes(key)) return name;
    }

    // Fallback: extract first noun-like word
    const words = description.split(' ').filter((w) => w.length > 3);
    return words[0] ? words[0].charAt(0).toUpperCase() + words[0].slice(1) : 'Component';
  }

  private generateComponentScaffold(name: string, input: DesignerInput): Record<string, unknown> {
    if (input.framework === 'react') {
      return {
        fileName: `${name}.tsx`,
        template: 'functional-component',
        features: [
          'TypeScript props interface',
          'TailwindCSS classes',
          'Dark mode support',
          'ARIA labels',
        ],
        structure: {
          props: `interface ${name}Props { /* Define visual properties */ }`,
          component: `export function ${name}({ ...props }: ${name}Props) { return <div className="...">...</div>; }`,
          exports: `export default ${name};`,
        },
      };
    }

    return {
      fileName: `${name.toLowerCase()}.html`,
      template: 'html-component',
      features: ['TailwindCSS', 'Responsive', 'Dark mode', 'Semantic HTML'],
    };
  }

  private getComponentEdgeCases(description: string): string[] {
    const cases: string[] = [];
    const desc = description.toLowerCase();

    // Always include
    cases.push('Empty/no-data state');
    cases.push('Loading state');

    if (desc.includes('list') || desc.includes('table') || desc.includes('grid')) {
      cases.push('Single item vs many items (100+)');
      cases.push('Item with very long text');
    }
    if (desc.includes('form') || desc.includes('input')) {
      cases.push('Validation error display');
      cases.push('Required vs optional fields');
      cases.push('Submit while loading');
    }
    if (desc.includes('modal') || desc.includes('dialog') || desc.includes('dropdown')) {
      cases.push('Open/close animation');
      cases.push('Click outside to close');
      cases.push('Escape key to close');
      cases.push('Focus trap (Tab stays inside)');
    }
    if (desc.includes('image') || desc.includes('avatar') || desc.includes('photo')) {
      cases.push('Missing/broken image fallback');
      cases.push('Slow image loading (placeholder)');
    }

    return cases;
  }

  private assessEdgeCaseRelevance(
    category: string,
    description: string,
  ): 'high' | 'medium' | 'low' {
    const desc = description.toLowerCase();

    // High priority for all: empty states, error states, responsive
    if (['Empty states', 'Error states', 'Responsive'].includes(category)) return 'high';

    // Context-dependent
    if (category === 'Loading states' && /fetch|load|data|api|list/.test(desc)) return 'high';
    if (category === 'Content overflow' && /text|list|table|card/.test(desc)) return 'high';
    if (category === 'Accessibility') return 'high'; // Always high priority
    if (category === 'Interaction' && /button|form|click|toggle|modal/.test(desc)) return 'high';
    if (category === 'Internationalization' && /text|label|date|price|currency/.test(desc))
      return 'medium';

    return 'medium';
  }

  private identifyStatePattern(description: string): string {
    const desc = description.toLowerCase();

    if (/context|provider|global/.test(desc)) return 'React Context (global state)';
    if (/form|input|validation/.test(desc)) return 'Form state (local + validation)';
    if (/url|query|param|route/.test(desc)) return 'URL state (routing)';
    if (/toggle|open|close|visible|show|hide/.test(desc)) return 'UI state (local toggle)';
    if (/fetch|load|data|api/.test(desc)) return 'Server state (data fetching)';
    if (/filter|sort|search|pagination/.test(desc)) return 'List state (filtering/sorting)';

    return 'General component state';
  }

  private calculateConfidence(
    input: DesignerInput,
    complexity: ReturnType<typeof classifyComplexity>,
  ): number {
    let confidence = 0.7;

    // Higher confidence for safe visual changes
    if (complexity.level === 'safe') confidence += 0.2;
    if (complexity.level === 'review-required') confidence -= 0.15;

    // More info = higher confidence
    if (input.targetFile) confidence += 0.05;
    if (input.designSystem) confidence += 0.05;
    if (input.componentName) confidence += 0.03;
    if (input.description.length > 100) confidence += 0.02;

    // Action-specific adjustments
    if (input.action === 'edge-case-audit') confidence += 0.1; // Deterministic
    if (input.action === 'state-change') confidence -= 0.1; // Risky

    return Math.max(0.1, Math.min(1, confidence));
  }
  // ...additional methods and helpers (if any) would go here...
}

// ============ LOCAL TESTS (VITEST) ============

// eslint-disable-next-line @typescript-eslint/no-explicit-any
if ((import.meta as any).vitest) {
  const { describe, it, expect } = (import.meta as any).vitest;

  describe('classifyComplexity', () => {
    it('classifies purely visual style changes as safe without engineer review', () => {
      const result = classifyComplexity(
        'style-change',
        'Update button color and padding for better visual hierarchy',
      );

      expect(result.level).toBe('safe');
      expect(result.engineerReview).toBe(false);
    });

    it('requires engineer review for explicit state-change actions', () => {
      const result = classifyComplexity(
        'state-change',
        'Refactor dashboard widget state management to fix race condition',
      );

      expect(result.level).toBe('review-required');
      expect(result.engineerReview).toBe(true);
    });

    it('requires engineer review when risky patterns like API or auth are present', () => {
      const result = classifyComplexity(
        'style-change',
        'Update form layout and connect submit to new auth API endpoint',
      );

      expect(result.level).toBe('review-required');
      expect(result.engineerReview).toBe(true);
    });

    it('classifies new components or screenshot-to-code as moderate without mandatory review', () => {
      const result = classifyComplexity(
        'component-create',
        'Create new card component with header, body, and footer regions',
      );

      expect(result.level).toBe('moderate');
      expect(result.engineerReview).toBe(false);
    });

    it('defaults to moderate for mixed changes without risky patterns', () => {
      const result = classifyComplexity(
        'design-review',
        'Review layout and interaction of settings page, including hover states',
      );

      expect(result.level).toBe('moderate');
      expect(result.engineerReview).toBe(false);
    });
  });
}
