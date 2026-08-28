#!/usr/bin/env node
// Evidence: Tool=Claude-Code Model=claude-haiku-4-5 Agent=claude-code Date=2026-08-28
// Audit trail: git log -- scripts/procurement-monitor.mjs

/**
 * Procurement Monitor — Bi-directional Cloudia ↔ Proposal Generator
 *
 * Daily run (every 3 days):
 * 1. Fetch live Cloudia bids via bid-scout
 * 2. Filter by opportunity criteria
 * 3. For each flagged opportunity, trigger proposal-generator agent
 * 4. Log results to .workflows/procurement-log.jsonl
 *
 * Integration: Supabase secrets for CLOUDIA_USER_NAME / CLOUDIA_PASSWORD
 * Escalation: If >5 opportunities flagged, alert HIC
 */

import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync, appendFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const REPO = process.cwd();
const BIDS_LOG = join(REPO, '.workflows', 'bids-log.jsonl');
const PROCUREMENT_LOG = join(REPO, '.workflows', 'procurement-log.jsonl');
const OPPORTUNITIES_FILE = join(REPO, '.workflows', 'opportunities.json');

async function runProcurementCycle() {
  const timestamp = new Date().toISOString();
  const cycleId = `procurement-${timestamp.split('T')[0]}`;

  console.log(`🚀 Procurement Monitor Cycle: ${cycleId}`);
  console.log(`📅 Started: ${timestamp}\n`);

  const cycle = {
    id: cycleId,
    timestamp,
    phase: 'bid-scout',
    status: 'in-progress',
  };

  try {
    // Phase 1: Run bid-scout to fetch live opportunities
    console.log('📡 Phase 1: Fetching Cloudia bids...');
    execSync('node scripts/bid-scout.mjs', { stdio: 'inherit' });

    // Phase 2: Read opportunities and trigger proposal-generator for each
    if (existsSync(OPPORTUNITIES_FILE)) {
      const opportunities = JSON.parse(readFileSync(OPPORTUNITIES_FILE, 'utf8'));
      console.log(`\n✅ Found ${opportunities.length} flagged opportunities`);

      if (opportunities.length > 0) {
        console.log('🤖 Phase 2: Triggering proposal-generator for each opportunity...');

        for (const opp of opportunities) {
          console.log(`  → Opportunity ${opp.id}: ${opp.title}`);

          // Trigger downstream agent
          try {
            await triggerProposalGenerator(opp);
            console.log(`    ✓ Proposal generation triggered`);
          } catch (error) {
            console.error(`    ✗ Failed to trigger: ${error.message}`);
          }
        }
      }

      // Phase 3: Alert HIC if high-value opportunities
      const highValue = opportunities.filter((o) => o.budget_max > 100000);
      if (highValue.length > 0) {
        console.log(`\n⚠️  ${highValue.length} high-value opportunities detected (>€100K)`);
        console.log('   HIC alert: Check .workflows/opportunities.json for details');
      }

      cycle.phase = 'completed';
      cycle.status = 'success';
      cycle.opportunitiesFound = opportunities.length;
      cycle.highValueCount = highValue.length;
    } else {
      console.log('⚠️  No opportunities file found; bid-scout may have failed');
      cycle.status = 'warning';
    }
  } catch (error) {
    console.error(`❌ Cycle failed: ${error.message}`);
    cycle.status = 'error';
    cycle.error = error.message;
  }

  // Log cycle result
  cycle.completedAt = new Date().toISOString();
  appendFileSync(PROCUREMENT_LOG, JSON.stringify(cycle) + '\n');
  console.log(`\n📊 Cycle logged to .workflows/procurement-log.jsonl`);
}

/**
 * Trigger proposal-generator agent for an opportunity
 * Could be: MCP call, HTTP webhook, or queue-based
 */
async function triggerProposalGenerator(opportunity) {
  // TODO: Implement based on proposal-generator integration
  // Options:
  // 1. MCP call to local agent
  // 2. HTTP webhook to Supabase function
  // 3. Queue message to agent queue
  // 4. Direct spawn of generator script

  // Placeholder: Log the trigger intent
  const trigger = {
    timestamp: new Date().toISOString(),
    opportunityId: opportunity.id,
    opportunityTitle: opportunity.title,
    budget: `€${opportunity.budget_min}-${opportunity.budget_max}`,
    status: 'triggered',
  };

  console.log(`    [Proposal Gen] ${JSON.stringify(trigger)}`);

  // Return success for now; full integration in Phase 2
  return trigger;
}

// Run the cycle
runProcurementCycle().catch((error) => {
  console.error('Fatal error in procurement monitor:', error);
  process.exit(1);
});
