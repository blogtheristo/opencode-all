#!/usr/bin/env tsx
/**
 * Rule 5 Audit — Model Call Site Categorization
 *
 * Identifies all LLM model calls in the codebase and categorizes them by
 * business logic intent per Rule 5 (use model for judgment, NOT routing/transforms).
 *
 * Categories:
 *   - JUDGMENT (safe): Classification, synthesis, extraction, drafting, summarization
 *   - ROUTING (concern): Delegating control flow to LLM
 *   - TRANSFORM (fix required): Deterministic transforms, JSON parsing, data conversion
 *
 * Usage:
 *   npx tsx scripts/audit-rule-5.ts [--json]
 *
 * Output:
 *   - findings.json (structured audit results)
 *   - High-risk patterns flagged for follow-up
 */

import { execSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

// ============================================================================
// Types
// ============================================================================

interface ModelCallSite {
  filePath: string;
  lineNumber: number;
  pattern: string;
  context: string;
  category: 'JUDGMENT' | 'ROUTING' | 'TRANSFORM' | 'UNKNOWN';
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  reasoning: string;
  flags: string[];
}

interface AuditResult {
  timestamp: string;
  totalSites: number;
  byCategory: Record<string, number>;
  byRiskLevel: Record<string, number>;
  sites: ModelCallSite[];
  highRiskFindings: ModelCallSite[];
}

// ============================================================================
// Grep Patterns for Model Calls
// ============================================================================

const PATTERNS = [
  {
    name: 'anthropic-messages-create',
    regex: /\.messages\.create\(/,
    searchPattern: '\\.messages\\.create\\(',
  },
  {
    name: 'new-anthropic',
    regex: /new\s+Anthropic/,
    searchPattern: 'new\\s+Anthropic',
  },
  {
    name: 'invoke-model',
    regex: /\.invoke\s*\(\s*{[^}]*model/,
    searchPattern: '\\.invoke',
  },
  {
    name: 'generate-method',
    regex: /\.generate\s*\(/,
    searchPattern: '\\.generate\\(',
  },
];

// ============================================================================
// Heuristic Categorization
// ============================================================================

function categorizeCall(
  context: string,
  filePath: string,
  surroundingCode: string,
): { category: 'JUDGMENT' | 'ROUTING' | 'TRANSFORM' | 'UNKNOWN'; reasoning: string } {
  // JUDGMENT patterns
  const judgmentIndicators = [
    /draft|generate.*post|write.*blog|create.*content|synthesize|summarize|extract/i,
    /classification|classify|extract.*info|detect|identify|analyze/i,
    /generate.*text|composition|creative|editorial/i,
    /sentiment|tone|quality.*assess|review.*content|judge.*fidelity/i,
  ];

  for (const pattern of judgmentIndicators) {
    if (pattern.test(context) || pattern.test(surroundingCode)) {
      return {
        category: 'JUDGMENT',
        reasoning: 'Matched judgment patterns: drafting, synthesis, analysis, quality evaluation',
      };
    }
  }

  // ROUTING patterns
  const routingIndicators = [
    /route|dispatch|select.*agent|which\s+\w+\s+should/i,
    /choose.*handler|determine.*next.*step|decide.*path/i,
    /if.*model.*response.*then/i,
  ];

  for (const pattern of routingIndicators) {
    if (pattern.test(context) || pattern.test(surroundingCode)) {
      return {
        category: 'ROUTING',
        reasoning: 'Matched routing patterns: control flow delegation, agent selection',
      };
    }
  }

  // TRANSFORM patterns
  const transformIndicators = [
    /parse|json|convert|transform|extract.*field|map|filter|reduce/i,
    /normali[zs]e|split|join|format|sanitize/i,
    /error\s*handling|retry|validate.*schema/i,
  ];

  for (const pattern of transformIndicators) {
    if (pattern.test(context) || pattern.test(surroundingCode)) {
      return {
        category: 'TRANSFORM',
        reasoning: 'Matched transform patterns: parsing, data conversion, validation',
      };
    }
  }

  return {
    category: 'UNKNOWN',
    reasoning: 'Could not determine intent from context',
  };
}

function assessRiskLevel(site: Omit<ModelCallSite, 'flags'>): {
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  flags: string[];
} {
  const flags: string[] = [];
  let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW';

  // Category-based risk
  if (site.category === 'ROUTING') {
    riskLevel = 'HIGH';
    flags.push('ROUTING_CALL: Control flow delegated to LLM');
  }

  if (site.category === 'TRANSFORM') {
    riskLevel = 'HIGH';
    flags.push('TRANSFORM_CALL: Deterministic operation delegated to LLM');
  }

  // Pattern-based risk escalation
  if (site.context.includes('for (') || site.context.includes('while (')) {
    riskLevel = 'HIGH';
    flags.push('LOOP_CALL: Model called inside a loop (cost + redundancy)');
  }

  if (site.context.includes('retry') || site.context.includes('attempts')) {
    riskLevel = 'HIGH';
    flags.push('RETRY_LOOP: Model call inside retry logic (multiple calls for same decision)');
  }

  if (site.context.includes('catch') || site.context.includes('error')) {
    riskLevel = 'MEDIUM';
    flags.push('ERROR_CONTEXT: Model call inside error handling');
  }

  if (!site.context.includes('await')) {
    riskLevel = 'MEDIUM';
    flags.push('NO_AWAIT: Async call not awaited (potential race condition)');
  }

  if (site.category === 'JUDGMENT' && flags.length === 0) {
    riskLevel = 'LOW';
  }

  return { riskLevel, flags };
}

// ============================================================================
// File Search & Context Extraction
// ============================================================================

function searchForModelCalls(): ModelCallSite[] {
  const sites: ModelCallSite[] = [];
  const seenLines = new Set<string>();

  for (const pattern of PATTERNS) {
    try {
      // Use grep to find all occurrences
      const grepCmd = `grep -r "${pattern.searchPattern}" --include="*.ts" --include="*.js" -n 2>/dev/null || true`;
      const output = execSync(grepCmd, { encoding: 'utf-8', cwd: '/home/user/dws6' });

      if (!output.trim()) continue;

      const lines = output.trim().split('\n').filter(Boolean);

      for (const line of lines) {
        // Skip test files and mocks
        if (line.includes('__tests__') || line.includes('mock') || line.includes('.test.')) {
          continue;
        }

        const match = line.match(/^([^:]+):(\d+):(.*)/);
        if (!match) continue;

        const [, filePath, lineNum, codeLine] = match;
        const lineKey = `${filePath}:${lineNum}`;

        if (seenLines.has(lineKey)) continue;
        seenLines.add(lineKey);

        // Extract surrounding context (approximate)
        const lineNumber = parseInt(lineNum, 10);

        // For now, use the matched line as context (full context would require file reading)
        const context = codeLine.trim().slice(0, 150);

        const { category, reasoning } = categorizeCall(context, filePath, '');
        const { riskLevel, flags } = assessRiskLevel({
          filePath,
          lineNumber,
          pattern: pattern.name,
          context,
          category,
          reasoning,
        });

        sites.push({
          filePath,
          lineNumber,
          pattern: pattern.name,
          context,
          category,
          riskLevel,
          reasoning,
          flags,
        });
      }
    } catch {
      // Grep failed, continue
    }
  }

  return sites;
}

// ============================================================================
// Analysis & Reporting
// ============================================================================

function analyzeFindings(sites: ModelCallSite[]): AuditResult {
  const byCategory: Record<string, number> = {
    JUDGMENT: 0,
    ROUTING: 0,
    TRANSFORM: 0,
    UNKNOWN: 0,
  };

  const byRiskLevel: Record<string, number> = {
    LOW: 0,
    MEDIUM: 0,
    HIGH: 0,
  };

  const highRiskFindings = sites.filter((s) => s.riskLevel === 'HIGH');

  for (const site of sites) {
    byCategory[site.category] = (byCategory[site.category] || 0) + 1;
    byRiskLevel[site.riskLevel] = (byRiskLevel[site.riskLevel] || 0) + 1;
  }

  return {
    timestamp: new Date().toISOString(),
    totalSites: sites.length,
    byCategory,
    byRiskLevel,
    sites,
    highRiskFindings,
  };
}

// ============================================================================
// Main
// ============================================================================

async function main(): Promise<void> {
  console.log('🔍 Searching for model-call sites...\n');

  const sites = searchForModelCalls();
  const result = analyzeFindings(sites);

  console.log(`📊 Audit Results:`);
  console.log(`   Total model-call sites: ${result.totalSites}`);
  console.log(`   By category:`);
  console.log(`     - JUDGMENT: ${result.byCategory.JUDGMENT} (safe)`);
  console.log(`     - ROUTING: ${result.byCategory.ROUTING} (concern)`);
  console.log(`     - TRANSFORM: ${result.byCategory.TRANSFORM} (fix required)`);
  console.log(`     - UNKNOWN: ${result.byCategory.UNKNOWN}`);
  console.log(`   By risk level:`);
  console.log(`     - LOW: ${result.byRiskLevel.LOW}`);
  console.log(`     - MEDIUM: ${result.byRiskLevel.MEDIUM}`);
  console.log(`     - HIGH: ${result.byRiskLevel.HIGH}`);

  if (result.highRiskFindings.length > 0) {
    console.log(`\n⚠️  High-Risk Findings: ${result.highRiskFindings.length}`);
    for (const finding of result.highRiskFindings.slice(0, 5)) {
      console.log(`   - ${finding.filePath}:${finding.lineNumber} [${finding.category}]`);
      console.log(`     Flags: ${finding.flags.join(', ')}`);
    }
    if (result.highRiskFindings.length > 5) {
      console.log(`   ... and ${result.highRiskFindings.length - 5} more`);
    }
  }

  // Write findings to JSON
  const outputPath = resolve(process.cwd(), 'docs/audit-rule-5-findings.json');
  writeFileSync(outputPath, JSON.stringify(result, null, 2), 'utf-8');
  console.log(`\n✅ Audit complete. Results written to: ${outputPath}`);
}

main().catch((err) => {
  console.error('❌ Audit failed:', err.message);
  process.exit(1);
});
