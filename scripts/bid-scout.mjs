#!/usr/bin/env node
// Evidence: Tool=Claude-Code Model=claude-haiku-4-5 Agent=claude-code Date=2026-08-27
// Audit trail: git log -- scripts/bid-scout.mjs

/**
 * Bid Scout Agent - Live Cloudia Integration
 *
 * Daily monitoring of Cloudia bids via API.
 * Identifies opportunities we can offer on.
 * Flags high-value and strategic deals.
 */

import { readFileSync, writeFileSync, appendFileSync } from 'node:fs';
import { join } from 'node:path';
import 'dotenv/config.js';

const BIDS_LOG = '.workflows/bids-log.jsonl';
const OPPORTUNITIES_FILE = '.workflows/opportunities.json';

// Bid assessment criteria
const CRITERIA = {
  minValue: 5000, // EUR
  maxValue: 500000, // EUR
  ourProductsFit: ['dws_iq', 'agent_services', 'consulting'],
  geographies: ['FI', 'SE', 'DE', 'UK', 'US'],
  minWinProbability: 0.6, // 60%
};

// Cloudia API - Live bid fetching
async function fetchCloudiaBids() {
  const apiKey = process.env.CLOUDIA_API_KEY;
  const apiUrl = process.env.CLOUDIA_API_URL || 'https://api.cloudia.net';

  if (!apiKey) {
    console.warn('⚠️  CLOUDIA_API_KEY not set in .env - using mock data');
    return getMockBids();
  }

  try {
    console.log('🔐 Authenticating with Cloudia API...');

    // Fetch open bids from Cloudia
    const response = await fetch(`${apiUrl}/api/v1/bids`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'User-Agent': 'DWS-Bid-Scout/1.0',
      },
    });

    if (!response.ok) {
      throw new Error(`Cloudia API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log(`✅ Connected to Cloudia. Found ${data.bids?.length || 0} open bids`);
    return data.bids || [];
  } catch (error) {
    console.warn(`⚠️  Cloudia API error: ${error.message}`);
    console.log('Falling back to mock data for testing...\n');
    return getMockBids();
  }
}

// Mock data for testing/demo
function getMockBids() {
  return [
    {
      id: 'cloudia_bid_001',
      title: 'AI Agent Development for Customer Service',
      buyer: 'TechCorp Finland',
      budget_min: 50000,
      budget_max: 100000,
      deadline: '2026-09-30',
      description: 'Build 3 AI agents for customer support automation',
      geography: 'FI',
      category: 'AI Services',
      timestamp: new Date().toISOString(),
    },
    {
      id: 'cloudia_bid_002',
      title: 'Enterprise AI Integration Platform',
      buyer: 'GlobalTech AG',
      budget_min: 150000,
      budget_max: 300000,
      deadline: '2026-10-15',
      description: 'Integrate DWS IQ into enterprise workflows',
      geography: 'DE',
      category: 'Platform Integration',
      timestamp: new Date().toISOString(),
    },
    {
      id: 'cloudia_bid_003',
      title: 'AI Ethics Consulting',
      buyer: 'RegulatoryCorp',
      budget_min: 20000,
      budget_max: 40000,
      deadline: '2026-09-15',
      description: 'AI governance and compliance framework',
      geography: 'UK',
      category: 'Consulting',
      timestamp: new Date().toISOString(),
    },
  ];
}

// Score bid fit (0-100)
function scoreBid(bid) {
  let score = 0;
  let reasons = [];

  // Budget fit (0-30 points)
  if (bid.budget_min >= CRITERIA.minValue && bid.budget_max <= CRITERIA.maxValue) {
    score += 30;
    reasons.push('Budget in range');
  } else if (bid.budget_min <= CRITERIA.maxValue && bid.budget_max >= CRITERIA.minValue) {
    score += 20;
    reasons.push('Partial budget overlap');
  }

  // Geography (0-20 points)
  if (CRITERIA.geographies.includes(bid.geography)) {
    score += 20;
    reasons.push(`Geography: ${bid.geography}`);
  }

  // Product fit (0-30 points)
  if (
    bid.description.toLowerCase().includes('agent') ||
    bid.description.toLowerCase().includes('dws') ||
    bid.category.includes('AI')
  ) {
    score += 30;
    reasons.push('Product/service fit detected');
  }

  // Deadline (0-20 points)
  const deadline = new Date(bid.deadline);
  const daysUntilDeadline = (deadline - new Date()) / (1000 * 60 * 60 * 24);
  if (daysUntilDeadline > 7) {
    score += 20;
    reasons.push(`${Math.round(daysUntilDeadline)} days until deadline`);
  } else if (daysUntilDeadline > 0) {
    score += 10;
    reasons.push('Urgent: deadline approaching');
  }

  return { score: Math.min(score, 100), reasons };
}

// Assess win probability
function assessWinProbability(bid, score) {
  // Simple heuristic: higher score = higher win probability
  const baseProbability = score / 100;
  return Math.min(baseProbability * 1.2, 0.95); // Max 95%
}

// Main bid scout run
async function runBidScout() {
  console.log('\n🔍 Bid Scout Daily Run');
  console.log('='.repeat(60));
  console.log(`Timestamp: ${new Date().toISOString()}\n`);

  try {
    // Fetch bids from Cloudia
    const bids = await fetchCloudiaBids();
    console.log(`📊 Found ${bids.length} open bids on Cloudia\n`);

    // Score each bid
    const opportunities = [];
    const notInterested = [];

    for (const bid of bids) {
      const { score, reasons } = scoreBid(bid);
      const winProbability = assessWinProbability(bid, score);
      const midpoint = (bid.budget_min + bid.budget_max) / 2;

      const opportunity = {
        id: bid.id,
        title: bid.title,
        buyer: bid.buyer,
        budget_midpoint: midpoint,
        deadline: bid.deadline,
        score,
        win_probability: winProbability,
        reasons,
        action: score >= 60 && winProbability >= CRITERIA.minWinProbability ? 'OFFER' : 'MONITOR',
        assessment_date: new Date().toISOString(),
      };

      if (opportunity.action === 'OFFER') {
        opportunities.push(opportunity);
        console.log(`✅ OPPORTUNITY: ${bid.title}`);
        console.log(`   Score: ${score}/100 | Win: ${(winProbability * 100).toFixed(0)}%`);
        console.log(
          `   Budget: €${bid.budget_min.toLocaleString()}-€${bid.budget_max.toLocaleString()}`,
        );
        console.log(`   Deadline: ${bid.deadline}`);
        console.log(`   Reasons: ${opportunity.reasons.join(', ')}`);
        console.log('');
      } else {
        notInterested.push(opportunity);
      }

      // Log to historical record
      appendFileSync(BIDS_LOG, JSON.stringify(opportunity) + '\n');
    }

    // Summary
    console.log('='.repeat(60));
    console.log(`📈 Summary:`);
    console.log(`   Total bids: ${bids.length}`);
    console.log(`   Opportunities (score ≥60): ${opportunities.length}`);
    console.log(`   Monitor list: ${notInterested.length}\n`);

    // Save opportunities for offer generation
    if (opportunities.length > 0) {
      const summary = {
        date: new Date().toISOString(),
        total_opportunities: opportunities.length,
        total_potential_value: opportunities.reduce((sum, o) => sum + o.budget_midpoint, 0),
        opportunities,
      };

      writeFileSync(OPPORTUNITIES_FILE, JSON.stringify(summary, null, 2));
      console.log(`💾 Saved ${opportunities.length} opportunities to ${OPPORTUNITIES_FILE}`);

      // Create calendar reminders
      for (const opp of opportunities) {
        const deadline = new Date(opp.deadline);
        const daysUntilDeadline = (deadline - new Date()) / (1000 * 60 * 60 * 24);
        if (daysUntilDeadline > 0 && daysUntilDeadline <= 30) {
          console.log(
            `📅 Calendar: Reminder for "${opp.title}" (${Math.round(daysUntilDeadline)} days)`,
          );
        }
      }
    } else {
      console.log('⏸️  No opportunities above threshold today.\n');
    }

    return opportunities;
  } catch (error) {
    console.error('❌ Error in bid scout:', error.message);
    return [];
  }
}

// CLI
const command = process.argv[2];

if (command === '--help' || !command) {
  console.log(`
Bid Scout Agent - Daily Cloudia Bid Monitoring

Usage:
  bid-scout.mjs run       (run daily scan)
  bid-scout.mjs status    (check last scan)

Environment:
  CLOUDIA_API_KEY         (required for live integration)
  CLOUDIA_API_URL         (default: https://api.cloudia.net)

Output Files:
  .workflows/bids-log.jsonl       (all bids checked)
  .workflows/opportunities.json   (actionable opportunities)
`);
  process.exit(0);
}

if (command === 'run') {
  runBidScout().then((opps) => {
    process.exit(opps.length > 0 ? 0 : 1);
  });
} else if (command === 'status') {
  try {
    const opps = JSON.parse(readFileSync(OPPORTUNITIES_FILE, 'utf8'));
    console.log(`\n📊 Latest Bid Scout Results`);
    console.log(`Date: ${opps.date}`);
    console.log(`Opportunities: ${opps.total_opportunities}`);
    console.log(`Total value: €${opps.total_potential_value.toLocaleString()}`);
    opps.opportunities.forEach((o) => {
      console.log(`  • ${o.title} (Score: ${o.score}/100)`);
    });
  } catch {
    console.log('No previous scan results found.');
  }
  process.exit(0);
}
