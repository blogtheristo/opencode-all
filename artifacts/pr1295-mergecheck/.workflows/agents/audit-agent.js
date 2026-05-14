#!/usr/bin/env node

/**
 * Workflow Failure Audit Agent
 *
 * Purpose: Automatically analyzes GitHub workflow failures and creates audit reports
 *
 * Usage:
 *   node audit-agent.js --latest              # Audit latest failure
 *   node audit-agent.js --run-id <id>         # Audit specific run
 *   node audit-agent.js --workflow <name>     # Audit specific workflow
 *   node audit-agent.js --today               # Audit all failures today
 *   node audit-agent.js --verbose             # Verbose logging
 *
 * Environment Variables:
 *   GITHUB_TOKEN - GitHub personal access token
 *   GITHUB_OWNER - Repository owner (default: blogtheristo)
 *   GITHUB_REPO - Repository name (default: dws6)
 */

const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  GITHUB_OWNER: process.env.GITHUB_OWNER || 'blogtheristo',
  GITHUB_REPO: process.env.GITHUB_REPO || 'dws6',
  GITHUB_TOKEN: process.env.GITHUB_TOKEN,
  REGISTRY_PATH: path.join(__dirname, '../registry/WORKFLOW_REGISTRY.json'),
  AUDIT_DIR: path.join(__dirname, '../audit/failures'),
  GITHUB_API: 'https://api.github.com'
};

// Parse command line arguments
const args = process.argv.slice(2);
const flags = {
  latest: args.includes('--latest'),
  runId: args.includes('--run-id') ? args[args.indexOf('--run-id') + 1] : null,
  workflow: args.includes('--workflow') ? args[args.indexOf('--workflow') + 1] : null,
  today: args.includes('--today'),
  verbose: args.includes('--verbose')
};

// Error classification
const ERROR_TYPES = {
  FILE_NOT_FOUND: 'file_not_found',
  PERMISSION_DENIED: 'permission_denied',
  BUILD_ERROR: 'build_error',
  TEST_FAILURE: 'test_failure',
  DEPLOYMENT_ERROR: 'deployment_error',
  SYNC_ERROR: 'sync_error',
  TIMEOUT: 'timeout',
  NETWORK_ERROR: 'network_error',
  UNKNOWN: 'unknown'
};

// Main function
async function main() {
  console.log('🔍 Workflow Failure Audit Agent Starting...\n');

  // Check GitHub token
  if (!CONFIG.GITHUB_TOKEN) {
    console.error('❌ Error: GITHUB_TOKEN environment variable not set');
    console.log('\nTo use this agent, you need a GitHub personal access token.');
    console.log('Set it with: export GITHUB_TOKEN=ghp_xxxxxxxxxxxxx\n');
    process.exit(1);
  }

  try {
    if (flags.latest) {
      await auditLatestFailure();
    } else if (flags.runId) {
      await auditSpecificRun(flags.runId);
    } else if (flags.workflow) {
      await auditWorkflow(flags.workflow);
    } else if (flags.today) {
      await auditTodayFailures();
    } else {
      showHelp();
    }
  } catch (error) {
    console.error('❌ Audit failed:', error.message);
    if (flags.verbose) {
      console.error(error);
    }
    process.exit(1);
  }
}

// Audit latest failure
async function auditLatestFailure() {
  console.log('📊 Auditing latest workflow failure...\n');

  const registry = loadRegistry();
  const failingWorkflows = registry.workflows.filter(w => w.status === 'failing');

  if (failingWorkflows.length === 0) {
    console.log('✅ No failing workflows found!');
    return;
  }

  const latestFailure = failingWorkflows.sort((a, b) =>
    new Date(b.last_run) - new Date(a.last_run)
  )[0];

  console.log(`Found latest failure: ${latestFailure.name}`);
  console.log(`Last run: ${latestFailure.last_run}`);
  console.log(`Error: ${latestFailure.last_error}\n`);

  // Create audit report
  const audit = await createAuditReport(latestFailure);
  const auditPath = saveAuditReport(audit);

  console.log(`\n✅ Audit complete!`);
  console.log(`📄 Report saved: ${auditPath}`);
  console.log(`\n🔧 Recommended actions:`);
  audit.recommended_actions.forEach((action, i) => {
    console.log(`   ${i + 1}. ${action}`);
  });

  // If auto-fixable, suggest fix agent
  if (audit.fix_strategy.auto_fixable) {
    console.log(`\n💡 This failure appears auto-fixable.`);
    console.log(`   Run: node .workflows/agents/fix-agent.js --audit ${audit.audit_id}`);
  }
}

// Create audit report
async function createAuditReport(workflow) {
  const timestamp = new Date().toISOString();
  const auditId = `audit-${timestamp.slice(0, 10).replace(/-/g, '')}-${Date.now().toString().slice(-4)}-${workflow.id}`;

  // Analyze the failure
  const analysis = analyzeFailure(workflow);

  const audit = {
    audit_id: auditId,
    timestamp,
    workflow: {
      id: workflow.id,
      name: workflow.name,
      file: workflow.file,
      last_run: workflow.last_run,
      last_status: workflow.last_status
    },
    failure: {
      error_message: workflow.last_error || 'Unknown error',
      error_type: analysis.error_type,
      severity: analysis.severity
    },
    analysis: {
      root_cause: analysis.root_cause,
      likely_reason: analysis.likely_reason,
      impact: analysis.impact
    },
    fix_strategy: analysis.fix_strategy,
    recommended_actions: analysis.recommended_actions,
    agent_assigned: analysis.fix_strategy.auto_fixable ? 'fix-agent' : 'manual',
    status: 'pending'
  };

  return audit;
}

// Analyze failure to determine root cause and fix strategy
function analyzeFailure(workflow) {
  const error = workflow.last_error || '';
  let errorType = ERROR_TYPES.UNKNOWN;
  let rootCause = 'Unknown error occurred';
  let likelyReason = 'Further investigation needed';
  let severity = 'medium';
  let impact = 'Workflow execution blocked';
  let fixStrategy = {
    type: 'manual_review',
    confidence: 'low',
    auto_fixable: false,
    fix_description: 'Manual investigation required',
    estimated_time: '30 minutes'
  };
  let recommendedActions = ['Review workflow logs', 'Contact DevOps team'];

  // Analyze error message
  if (error.includes('rsync') && error.includes('failed')) {
    errorType = ERROR_TYPES.SYNC_ERROR;
    rootCause = 'rsync command failed during file synchronization';
    severity = 'high';
    impact = 'Site content sync blocked - deployment affected';

    if (error.includes('No such file or directory')) {
      likelyReason = 'Source or destination directory not found';
      fixStrategy = {
        type: 'workflow_update',
        confidence: 'high',
        auto_fixable: true,
        fix_description: 'Create missing directories or fix paths in workflow',
        estimated_time: '5 minutes'
      };
      recommendedActions = [
        'Check if source directory exists in repository',
        'Verify destination directory is created before rsync',
        'Update workflow to create directories if missing',
        'Test rsync paths locally'
      ];
    }
  } else if (error.includes('npm') && error.includes('install')) {
    errorType = ERROR_TYPES.BUILD_ERROR;
    rootCause = 'npm install failed';
    likelyReason = 'Dependency installation error';
    severity = 'high';
    fixStrategy = {
      type: 'dependency_fix',
      confidence: 'medium',
      auto_fixable: false,
      fix_description: 'Update package.json or resolve dependency conflicts',
      estimated_time: '15 minutes'
    };
    recommendedActions = [
      'Check package.json for problematic dependencies',
      'Review npm error logs',
      'Try running npm install locally',
      'Update dependency versions if needed'
    ];
  } else if (error.includes('test') && error.includes('failed')) {
    errorType = ERROR_TYPES.TEST_FAILURE;
    rootCause = 'One or more tests failed';
    likelyReason = 'Code changes broke existing tests';
    severity = 'medium';
    fixStrategy = {
      type: 'test_fix',
      confidence: 'low',
      auto_fixable: false,
      fix_description: 'Fix failing tests or update test expectations',
      estimated_time: '20 minutes'
    };
    recommendedActions = [
      'Review test failure messages',
      'Run tests locally',
      'Fix code or update tests',
      'Verify test environment'
    ];
  } else if (error.includes('permission denied') || error.includes('Permission denied')) {
    errorType = ERROR_TYPES.PERMISSION_DENIED;
    rootCause = 'Insufficient permissions';
    likelyReason = 'Workflow lacks required permissions';
    severity = 'high';
    fixStrategy = {
      type: 'permission_update',
      confidence: 'high',
      auto_fixable: true,
      fix_description: 'Add required permissions to workflow',
      estimated_time: '5 minutes'
    };
    recommendedActions = [
      'Add permissions: contents: write to workflow',
      'Check GitHub token permissions',
      'Verify repository settings allow workflow writes'
    ];
  } else if (error.includes('timeout') || error.includes('timed out')) {
    errorType = ERROR_TYPES.TIMEOUT;
    rootCause = 'Workflow execution exceeded timeout limit';
    likelyReason = 'Operation taking longer than expected';
    severity = 'medium';
    fixStrategy = {
      type: 'timeout_increase',
      confidence: 'high',
      auto_fixable: true,
      fix_description: 'Increase timeout value in workflow',
      estimated_time: '5 minutes'
    };
    recommendedActions = [
      'Increase timeout-minutes in workflow step',
      'Optimize long-running operations',
      'Consider splitting into multiple jobs'
    ];
  }

  return {
    error_type: errorType,
    root_cause: rootCause,
    likely_reason: likelyReason,
    severity,
    impact,
    fix_strategy: fixStrategy,
    recommended_actions: recommendedActions
  };
}

// Save audit report
function saveAuditReport(audit) {
  // Ensure audit directory exists
  if (!fs.existsSync(CONFIG.AUDIT_DIR)) {
    fs.mkdirSync(CONFIG.AUDIT_DIR, { recursive: true });
  }

  const filename = `${audit.audit_id}.json`;
  const filepath = path.join(CONFIG.AUDIT_DIR, filename);

  fs.writeFileSync(filepath, JSON.stringify(audit, null, 2));

  return filepath;
}

// Load workflow registry
function loadRegistry() {
  if (!fs.existsSync(CONFIG.REGISTRY_PATH)) {
    throw new Error(`Registry not found at ${CONFIG.REGISTRY_PATH}`);
  }

  const data = fs.readFileSync(CONFIG.REGISTRY_PATH, 'utf8');
  return JSON.parse(data);
}

// Show help
function showHelp() {
  console.log(`
Workflow Failure Audit Agent

Usage:
  node audit-agent.js [options]

Options:
  --latest              Audit the latest workflow failure
  --run-id <id>         Audit specific GitHub Actions run
  --workflow <name>     Audit specific workflow by name
  --today               Audit all failures from today
  --verbose             Show detailed logging

Examples:
  node audit-agent.js --latest
  node audit-agent.js --workflow sync-site-content
  node audit-agent.js --today --verbose

Environment Variables:
  GITHUB_TOKEN          GitHub personal access token (required)
  GITHUB_OWNER          Repository owner (default: blogtheristo)
  GITHUB_REPO           Repository name (default: dws6)

Documentation:
  See: .workflows/README.md
  `);
}

// Placeholder functions for full GitHub API integration
async function auditSpecificRun(runId) {
  console.log(`📊 Auditing workflow run ${runId}...\n`);
  console.log('⚠️  GitHub API integration not yet implemented');
  console.log('   This would fetch logs and analyze the failure');
  console.log('   For now, using registry data only\n');
  await auditLatestFailure();
}

async function auditWorkflow(workflowName) {
  console.log(`📊 Auditing workflow: ${workflowName}...\n`);

  const registry = loadRegistry();
  const workflow = registry.workflows.find(w =>
    w.id === workflowName || w.name.toLowerCase().includes(workflowName.toLowerCase())
  );

  if (!workflow) {
    console.error(`❌ Workflow not found: ${workflowName}`);
    return;
  }

  if (workflow.status !== 'failing') {
    console.log(`✅ Workflow "${workflow.name}" is not failing (status: ${workflow.status})`);
    return;
  }

  console.log(`Found workflow: ${workflow.name}`);
  console.log(`Status: ${workflow.status}`);
  console.log(`Last error: ${workflow.last_error}\n`);

  const audit = await createAuditReport(workflow);
  const auditPath = saveAuditReport(audit);

  console.log(`\n✅ Audit complete!`);
  console.log(`📄 Report saved: ${auditPath}`);
}

async function auditTodayFailures() {
  console.log(`📊 Auditing all failures from today...\n`);

  const registry = loadRegistry();
  const today = new Date().toISOString().slice(0, 10);
  const todayFailures = registry.workflows.filter(w =>
    w.status === 'failing' && w.last_run && w.last_run.startsWith(today)
  );

  if (todayFailures.length === 0) {
    console.log('✅ No failures found today!');
    return;
  }

  console.log(`Found ${todayFailures.length} failure(s) today:\n`);

  for (const workflow of todayFailures) {
    console.log(`📋 ${workflow.name}`);
    const audit = await createAuditReport(workflow);
    const auditPath = saveAuditReport(audit);
    console.log(`   ✅ Audit saved: ${path.basename(auditPath)}\n`);
  }
}

// Run the agent
if (require.main === module) {
  main();
}

module.exports = { createAuditReport, analyzeFailure };
