#!/usr/bin/env node
// Evidence: Tool=Claude-Code Model=claude-haiku-4-5 Agent=claude-code Date=2026-08-27
// Audit trail: git log -- scripts/session-validate.mjs

/**
 * Session Validation & Categorization
 *
 * Validates recovered sessions for:
 * - Repository relevance (dws6, other, unknown)
 * - Completeness (has transcript, context, commits)
 * - Content analysis (what was being worked on)
 * - Priority scoring (importance for recovery)
 */

import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const UNIFIED_QUEUE = '.workflows/sessions/unified.jsonl';
const DWS6_REPO = 'blogtheristo/dws6';

function analyzeSession(session) {
  const analysis = {
    id: session.id,
    platform: session.platform,
    title: session.title,
    status: 'UNKNOWN',
    category: 'OTHER',
    relevance_score: 0,
    issues: [],
    recommendations: [],
  };

  // Check repository relevance
  if (
    session.context?.repository === DWS6_REPO ||
    session.branch?.startsWith('fix/') ||
    session.branch?.startsWith('feat/')
  ) {
    analysis.category = 'DWS6';
    analysis.relevance_score += 50;
  } else if (session.context?.repository) {
    analysis.category = 'OTHER_REPO';
    analysis.issues.push(`Different repo: ${session.context.repository}`);
  } else if (session.platform === 'claude-code') {
    // Claude Code sessions might be dws6 but we can't tell without reading transcript
    analysis.category = 'UNKNOWN_CLAUDE';
    analysis.issues.push('Cannot determine repository from metadata');
  }

  // Check completeness
  if (!session.transcript_lines || session.transcript_lines < 5) {
    analysis.issues.push(`Minimal transcript (${session.transcript_lines || 0} lines)`);
    analysis.relevance_score -= 20;
  } else if (session.transcript_lines > 100) {
    analysis.relevance_score += 10;
  }

  if (session.event_count && session.event_count > 50) {
    analysis.relevance_score += 15;
  }

  // Check recency
  if (session.last_activity) {
    const age_days =
      (Date.now() - new Date(session.last_activity).getTime()) / (1000 * 60 * 60 * 24);
    if (age_days < 7) {
      analysis.relevance_score += 20;
      analysis.status = 'RECENT';
    } else if (age_days < 30) {
      analysis.status = 'ACTIVE';
    } else {
      analysis.status = 'STALE';
      analysis.issues.push(`Last activity ${age_days.toFixed(0)} days ago`);
    }
  }

  // Recommendations
  if (analysis.category === 'DWS6' && analysis.relevance_score > 40) {
    analysis.recommendations.push('RECOVER: High-priority dws6 work');
  } else if (analysis.category === 'DWS6') {
    analysis.recommendations.push('REVIEW: dws6 work but check completeness');
  } else if (analysis.category === 'UNKNOWN_CLAUDE' && session.transcript_lines > 50) {
    analysis.recommendations.push('INSPECT: Read transcript to determine relevance');
  } else {
    analysis.recommendations.push('ARCHIVE: Not dws6-relevant');
  }

  // Calculate final score (0-100)
  analysis.relevance_score = Math.max(0, Math.min(100, analysis.relevance_score + 20)); // Base score 20

  return analysis;
}

function validateSessions() {
  console.log('🔍 Validating recovered sessions...\n');

  if (!existsSync(UNIFIED_QUEUE)) {
    console.error(`Error: ${UNIFIED_QUEUE} not found. Run session-recovery.mjs first.`);
    process.exit(1);
  }

  const sessions = readFileSync(UNIFIED_QUEUE, 'utf8')
    .split('\n')
    .filter(Boolean)
    .map((l) => JSON.parse(l));

  const validations = sessions.map(analyzeSession);

  // Categorize results
  const byCategory = {};
  const byStatus = {};
  let totalScore = 0;

  for (const v of validations) {
    byCategory[v.category] = (byCategory[v.category] || 0) + 1;
    byStatus[v.status] = (byStatus[v.status] || 0) + 1;
    totalScore += v.relevance_score;
  }

  // Report
  console.log('=== Validation Summary ===\n');
  console.log(`Total sessions analyzed: ${validations.length}`);
  console.log(`Average relevance score: ${(totalScore / validations.length).toFixed(1)}/100\n`);

  console.log('By Category:');
  for (const [cat, count] of Object.entries(byCategory)) {
    console.log(`  ${cat}: ${count}`);
  }

  console.log('\nBy Status:');
  for (const [status, count] of Object.entries(byStatus)) {
    console.log(`  ${status}: ${count}`);
  }

  // High-priority dws6 sessions
  const dws6_high = validations
    .filter((v) => v.category === 'DWS6' && v.relevance_score > 60)
    .sort((a, b) => b.relevance_score - a.relevance_score);

  console.log(`\n🎯 High-Priority DWS6 Sessions (score > 60): ${dws6_high.length}`);
  for (const session of dws6_high.slice(0, 10)) {
    console.log(`  [${session.relevance_score}] ${session.id}: ${session.title}`);
  }

  // Sessions needing review
  const unknown_claude = validations.filter(
    (v) => v.category === 'UNKNOWN_CLAUDE' && v.transcript_lines > 50,
  );
  console.log(`\n⚠️  Claude Code Sessions Needing Review: ${unknown_claude.length}`);
  for (const session of unknown_claude.slice(0, 5)) {
    console.log(`  [${session.id}] ${session.title} (${session.transcript_lines} lines)`);
  }

  // Write detailed report
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      total: validations.length,
      by_category: byCategory,
      by_status: byStatus,
      average_score: totalScore / validations.length,
    },
    dws6_high_priority: dws6_high.slice(0, 20),
    unknown_claude_review: unknown_claude.slice(0, 10),
    all_validations: validations.sort((a, b) => b.relevance_score - a.relevance_score),
  };

  writeFileSync('.workflows/sessions/validation-report.json', JSON.stringify(report, null, 2));
  console.log('\n📋 Full report: .workflows/sessions/validation-report.json');

  // Write recovery manifest
  const manifest = {
    timestamp: new Date().toISOString(),
    dws6_recoverable: dws6_high.filter((v) => v.relevance_score > 70).map((v) => v.id),
    dws6_needs_review: dws6_high.filter((v) => v.relevance_score <= 70).map((v) => v.id),
    other_repos: validations.filter((v) => v.category === 'OTHER_REPO').map((v) => v.id),
    archive_candidates: validations.filter((v) => v.relevance_score < 30).map((v) => v.id),
  };

  writeFileSync('.workflows/sessions/recovery-manifest.json', JSON.stringify(manifest, null, 2));
  console.log('📦 Recovery manifest: .workflows/sessions/recovery-manifest.json');
}

validateSessions();
