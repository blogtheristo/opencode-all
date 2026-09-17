#!/usr/bin/env node

/**
 * Workflow Fix Agent
 *
 * Purpose: Automatically fixes workflow failures based on audit reports
 *
 * Usage:
 *   node fix-agent.js --latest           # Fix latest audited failure
 *   node fix-agent.js --audit <id>       # Fix specific audit
 *   node fix-agent.js --dry-run          # Show fix without applying
 *   node fix-agent.js --verbose          # Verbose logging
 *
 * The fix agent:
 * 1. Reads audit report
 * 2. Determines if auto-fixable
 * 3. Generates fix
 * 4. Creates branch and PR (or applies fix directly if --apply flag)
 */

const fs = require('fs');
const path = require('path');
const { execSync, spawnSync } = require('child_process');

// Configuration
const CONFIG = {
  AUDIT_DIR: path.join(__dirname, '../audit/failures'),
  REGISTRY_PATH: path.join(__dirname, '../registry/WORKFLOW_REGISTRY.json'),
  GITHUB_WORKFLOWS_DIR: path.join(__dirname, '../../.github/workflows')
};

// Parse command line arguments
const args = process.argv.slice(2);
const flags = {
  latest: args.includes('--latest'),
  auditId: args.includes('--audit') ? args[args.indexOf('--audit') + 1] : null,
  dryRun: args.includes('--dry-run'),
  apply: args.includes('--apply'),
  verbose: args.includes('--verbose')
};

// Main function
async function main() {
  console.log('🔧 Workflow Fix Agent Starting...\n');

  try {
    if (flags.latest) {
      await fixLatestAudit();
    } else if (flags.auditId) {
      await fixSpecificAudit(flags.auditId);
    } else {
      showHelp();
    }
  } catch (error) {
    console.error('❌ Fix failed:', error.message);
    if (flags.verbose) {
      console.error(error);
    }
    process.exit(1);
  }
}

// Fix latest audit
async function fixLatestAudit() {
  console.log('🔍 Finding latest audit report...\n');

  const audits = getAuditReports();
  if (audits.length === 0) {
    console.log('⚠️  No audit reports found');
    console.log('   Run: node audit-agent.js --latest');
    return;
  }

  // Get most recent audit
  const latestAudit = audits.sort((a, b) =>
    new Date(b.timestamp) - new Date(a.timestamp)
  )[0];

  console.log(`Found: ${latestAudit.audit_id}`);
  console.log(`Workflow: ${latestAudit.workflow.name}`);
  console.log(`Timestamp: ${latestAudit.timestamp}\n`);

  await processFix(latestAudit);
}

// Fix specific audit
async function fixSpecificAudit(auditId) {
  console.log(`🔍 Loading audit report: ${auditId}...\n`);

  const auditPath = validateAuditId(auditId);
  if (!fs.existsSync(auditPath)) {
    throw new Error(`Audit report not found: ${auditId}`);
  }

  const audit = JSON.parse(fs.readFileSync(auditPath, 'utf8'));
  await processFix(audit);
}

// Process fix
async function processFix(audit) {
  console.log('📋 Audit Summary:');
  console.log(`   Error Type: ${audit.failure.error_type}`);
  console.log(`   Root Cause: ${audit.analysis.root_cause}`);
  console.log(`   Severity: ${audit.failure.severity}`);
  console.log(`   Auto-fixable: ${audit.fix_strategy.auto_fixable ? '✅ Yes' : '❌ No'}`);
  console.log(`   Confidence: ${audit.fix_strategy.confidence}\n`);

  if (!audit.fix_strategy.auto_fixable) {
    console.log('⚠️  This failure is not auto-fixable.');
    console.log('\n📖 Manual Fix Guide:');
    console.log(`   ${audit.fix_strategy.fix_description}\n`);
    console.log('🔧 Recommended Actions:');
    audit.recommended_actions.forEach((action, i) => {
      console.log(`   ${i + 1}. ${action}`);
    });
    return;
  }

  // Generate fix
  console.log('🔧 Generating fix...\n');
  const fix = await generateFix(audit);

  if (!fix) {
    console.log('❌ Could not generate fix automatically');
    return;
  }

  // Show fix
  console.log('📝 Proposed Fix:');
  console.log('─'.repeat(60));
  console.log(fix.description);
  console.log('─'.repeat(60));
  if (fix.diff) {
    console.log('\nChanges:');
    console.log(fix.diff);
  }

  if (flags.dryRun) {
    console.log('\n🔍 Dry run mode - fix not applied');
    return;
  }

  // Apply fix
  if (flags.apply) {
    console.log('\n✅ Applying fix...');
    await applyFix(fix, audit);
    console.log('✅ Fix applied successfully!');
  } else {
    console.log('\n💡 To apply this fix:');
    console.log(`   node fix-agent.js --audit ${audit.audit_id} --apply`);
  }
}

// Generate fix based on audit report
async function generateFix(audit) {
  const errorType = audit.failure.error_type;
  const workflow = audit.workflow;

  switch (errorType) {
    case 'sync_error':
      return generateSyncFix(audit);
    case 'permission_denied':
      return generatePermissionFix(audit);
    case 'timeout':
      return generateTimeoutFix(audit);
    default:
      return null;
  }
}

// Generate fix for sync errors
function generateSyncFix(audit) {
  const workflowFile = audit.workflow.file;
  const workflowPath = path.join(CONFIG.GITHUB_WORKFLOWS_DIR, path.basename(workflowFile));

  if (!fs.existsSync(workflowPath)) {
    console.error(`Workflow file not found: ${workflowPath}`);
    return null;
  }

  const content = fs.readFileSync(workflowPath, 'utf8');

  // Check if it's the sync-site-content workflow
  if (workflowFile.includes('sync-site-content')) {
    const fix = {
      file: workflowPath,
      description: 'Add directory existence check before rsync',
      diff: `
+ # Create directories if they don't exist
+ mkdir -p landing-pages/dws10-com
+ mkdir -p landing-pages/onelifetime-world
+
  # Sync files
  rsync -av --exclude='.*' dws10.com/ landing-pages/dws10-com/ --delete
`,
      newContent: content.replace(
        /# Create directory if it doesn't exist\n\s*mkdir -p landing-pages\/dws10-com/g,
        `# Create directories if they don't exist
          mkdir -p landing-pages/dws10-com
          mkdir -p landing-pages/onelifetime-world`
      )
    };

    return fix;
  }

  return null;
}

// Generate fix for permission errors
function generatePermissionFix(audit) {
  const workflowFile = audit.workflow.file;
  const workflowPath = path.join(CONFIG.GITHUB_WORKFLOWS_DIR, path.basename(workflowFile));

  if (!fs.existsSync(workflowPath)) {
    return null;
  }

  const content = fs.readFileSync(workflowPath, 'utf8');

  // Check if permissions are already set
  if (content.includes('permissions:')) {
    return {
      file: workflowPath,
      description: 'Permissions already defined - may need to add specific permission',
      diff: 'Manual review required',
      newContent: null
    };
  }

  // Add permissions block
  const fix = {
    file: workflowPath,
    description: 'Add write permissions to workflow',
    diff: `
  jobs:
    job-name:
      runs-on: ubuntu-latest
+     permissions:
+       contents: write
      steps:
`,
    newContent: content.replace(
      /runs-on: ubuntu-latest/g,
      `runs-on: ubuntu-latest
      permissions:
        contents: write`
    )
  };

  return fix;
}

// Generate fix for timeout errors
function generateTimeoutFix(audit) {
  const workflowFile = audit.workflow.file;
  const workflowPath = path.join(CONFIG.GITHUB_WORKFLOWS_DIR, path.basename(workflowFile));

  if (!fs.existsSync(workflowPath)) {
    return null;
  }

  const content = fs.readFileSync(workflowPath, 'utf8');

  const fix = {
    file: workflowPath,
    description: 'Increase timeout from default (360 minutes) to 600 minutes',
    diff: `
  - name: Step name
+   timeout-minutes: 600
    run: |
`,
    newContent: content.replace(
      /- name: (.+)\n(\s+)run:/g,
      `- name: $1\n$2timeout-minutes: 600\n$2run:`
    )
  };

  return fix;
}

function validateAuditId(auditId) {
  if (typeof auditId !== 'string' || !/^[a-zA-Z0-9_-]+$/.test(auditId)) {
    throw new Error(`Invalid audit ID: ${auditId}`);
  }

  const auditDir = path.resolve(CONFIG.AUDIT_DIR);
  const auditPath = path.resolve(auditDir, auditId + '.json');
  if (auditPath !== auditDir && !auditPath.startsWith(auditDir + path.sep)) {
    throw new Error(`Audit report path traversal attempt detected: ${auditId}`);
  }

  return auditPath;
}

// Input validation helpers
function validateBranchName(branchName) {
  // Branch names should only contain alphanumeric, dash, slash, and underscore
  const validPattern = /^[a-zA-Z0-9/_-]+$/;
  if (!validPattern.test(branchName)) {
    throw new Error(`Invalid branch name: ${branchName}`);
  }
  return branchName;
}

function validateFilePath(filePath) {
  // Ensure the file path is within the expected directories
  const resolvedPath = path.resolve(filePath);
  const workflowsDir = path.resolve(CONFIG.GITHUB_WORKFLOWS_DIR);

  if (!resolvedPath.startsWith(workflowsDir)) {
    throw new Error(`File path outside allowed directory: ${filePath}`);
  }
  return filePath;
}

// Apply fix
async function applyFix(fix, audit) {
  if (!fix.newContent) {
    console.log('⚠️  Manual fix required - cannot apply automatically');
    return;
  }

  // Write fix to file
  fs.writeFileSync(fix.file, fix.newContent);

  console.log(`✅ Updated ${path.basename(fix.file)}`);

  // Create git commit
  const branchName = `fix/${audit.workflow.id}-${Date.now()}`;
  const commitMessage = `fix: ${audit.workflow.name} - ${audit.fix_strategy.fix_description}

Fixes ${audit.audit_id}

Root cause: ${audit.analysis.root_cause}
Fix: ${fix.description}

Auto-generated by fix-agent`;

  try {
    // Validate inputs before using them in git commands
    validateBranchName(branchName);
    validateFilePath(fix.file);

    // Use spawnSync with array arguments to prevent command injection
    let result = spawnSync('git', ['checkout', '-b', branchName], { stdio: 'inherit' });
    if (result.error || result.status !== 0) {
      throw new Error(`git checkout failed: ${result.error?.message || 'exit code ' + result.status}`);
    }

    result = spawnSync('git', ['add', fix.file], { stdio: 'inherit' });
    if (result.error || result.status !== 0) {
      throw new Error(`git add failed: ${result.error?.message || 'exit code ' + result.status}`);
    }

    result = spawnSync('git', ['commit', '-m', commitMessage], { stdio: 'inherit' });
    if (result.error || result.status !== 0) {
      throw new Error(`git commit failed: ${result.error?.message || 'exit code ' + result.status}`);
    }

    console.log(`\n✅ Created branch: ${branchName}`);
    console.log(`\n💡 Next steps:`);
    console.log(`   1. Push branch: git push -u origin ${branchName}`);
    console.log(`   2. Create PR on GitHub`);
    console.log(`   3. Review and merge`);
  } catch (error) {
    console.error('⚠️  Git operations failed:', error.message);
    console.log('   Fix has been applied to file but not committed');
  }
}

// Get all audit reports
function getAuditReports() {
  if (!fs.existsSync(CONFIG.AUDIT_DIR)) {
    return [];
  }

  const files = fs.readdirSync(CONFIG.AUDIT_DIR)
    .filter(f => f.endsWith('.json'));

  return files.map(f => {
    const content = fs.readFileSync(path.join(CONFIG.AUDIT_DIR, f), 'utf8');
    return JSON.parse(content);
  });
}

// Show help
function showHelp() {
  console.log(`
Workflow Fix Agent

Usage:
  node fix-agent.js [options]

Options:
  --latest              Fix the latest audited failure
  --audit <id>          Fix specific audit by ID
  --dry-run             Show fix without applying
  --apply               Apply fix immediately
  --verbose             Show detailed logging

Examples:
  node fix-agent.js --latest --dry-run
  node fix-agent.js --audit audit-20251226-0930-sync-site --apply
  node fix-agent.js --latest --apply

Workflow:
  1. Run audit agent first: node audit-agent.js --latest
  2. Review audit report in .workflows/audit/failures/
  3. Run fix agent: node fix-agent.js --latest
  4. Review proposed fix
  5. Apply fix: node fix-agent.js --latest --apply

Documentation:
  See: .workflows/README.md
  `);
}

// Run the agent
if (require.main === module) {
  main();
}

module.exports = { generateFix, applyFix };
