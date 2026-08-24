#!/usr/bin/env node

/**
 * GitHub App Webhook Handler
 * Supports: dws10.com, dws6.com, onelifetime.world
 * 
 * Receives webhook events and routes them appropriately
 */

const express = require('express');
const { createHmac } = require('crypto');
const dotenv = require('dotenv');

dotenv.config({ path: '.env.local' });

const app = express();
function securityHeaders(req, res, next) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'no-referrer');
  res.setHeader("Content-Security-Policy", "default-src 'none'; frame-ancestors 'none'; base-uri 'none'; form-action 'none'");
  const forwardedProto = req.headers['x-forwarded-proto'];
  const proto = Array.isArray(forwardedProto) ? forwardedProto[0] : forwardedProto;
  if (proto === 'https') res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  next();
}

app.use(securityHeaders);
app.use(express.json());

// Configuration
const WEBHOOK_SECRET = process.env.GITHUB_APP_WEBHOOK_SECRET;
const GITHUB_APP_ID = process.env.GITHUB_APP_ID;

const DOMAIN_CONFIG = {
  'dws10.com': {
    name: 'DWS10 - Enterprise Dashboard',
    repoPath: 'blogtheristo/dws10',
    notifyChannel: 'dws10-github'
  },
  'dws6.com': {
    name: 'DWS6 - Agent Tracking & MCP Hub',
    repoPath: 'blogtheristo/dws6',
    notifyChannel: 'dws6-github'
  },
  'onelifetime.world': {
    name: 'OneLifetime World - Blog & Content',
    repoPath: 'blogtheristo/onelifetime-world',
    notifyChannel: 'lifetime-github'
  }
};

// Verify webhook signature
function verifyWebhookSignature(req) {
  const signature = req.headers['x-hub-signature-256'];
  if (!signature) {
    return false;
  }

  const payload = JSON.stringify(req.body);
  const hash = createHmac('sha256', WEBHOOK_SECRET)
    .update(payload)
    .digest('hex');
  
  const expected = `sha256=${hash}`;
  return signature === expected;
}

// Route webhook based on repository
function getRoutingInfo(payload) {
  const repoFullName = payload.repository?.full_name;
  
  for (const [domain, config] of Object.entries(DOMAIN_CONFIG)) {
    if (repoFullName === config.repoPath) {
      return { domain, config };
    }
  }
  
  return null;
}

// Handle different event types
async function handleEvent(eventType, payload, routingInfo) {
  const { domain, config } = routingInfo;
  
  console.log(`[${domain}] Received event: ${eventType}`);

  switch (eventType) {
    case 'push':
      return handlePush(payload, config);
    
    case 'pull_request':
      return handlePullRequest(payload, config);
    
    case 'issues':
      return handleIssues(payload, config);
    
    case 'pull_request_review':
      return handleReview(payload, config);
    
    default:
      console.log(`[${domain}] Unhandled event type: ${eventType}`);
      return { status: 'ignored' };
  }
}

// Handle push events
function handlePush(payload, config) {
  const { ref, commits, pusher } = payload;
  const branch = ref.split('/').pop();
  
  console.log(`[${config.name}] Push to ${branch} by ${pusher.name}`);
  console.log(`  Commits: ${commits.length}`);
  
  return {
    status: 'processed',
    event: 'push',
    branch,
    commits: commits.length,
    pusher: pusher.name
  };
}

// Handle pull request events
function handlePullRequest(payload, config) {
  const { action, pull_request } = payload;
  const { number, title, user, state } = pull_request;
  
  console.log(`[${config.name}] PR ${action}: #${number} - ${title}`);
  console.log(`  By: ${user.login}`);
  
  return {
    status: 'processed',
    event: 'pull_request',
    action,
    pr_number: number,
    title,
    author: user.login,
    state
  };
}

// Handle issues events
function handleIssues(payload, config) {
  const { action, issue } = payload;
  const { number, title, user, state } = issue;
  
  console.log(`[${config.name}] Issue ${action}: #${number} - ${title}`);
  console.log(`  By: ${user.login}`);
  
  return {
    status: 'processed',
    event: 'issue',
    action,
    issue_number: number,
    title,
    reporter: user.login,
    state
  };
}

// Handle review events
function handleReview(payload, config) {
  const { action, review, pull_request } = payload;
  
  console.log(`[${config.name}] PR #${pull_request.number} review ${action}`);
  console.log(`  Reviewer: ${review.user.login}`);
  console.log(`  State: ${review.state}`);
  
  return {
    status: 'processed',
    event: 'review',
    action,
    reviewer: review.user.login,
    state: review.state,
    pr_number: pull_request.number
  };
}

// Main webhook endpoint
app.post('/webhooks/github', (req, res) => {
  // Verify signature
  if (!verifyWebhookSignature(req)) {
    console.error('Invalid webhook signature');
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const eventType = req.headers['x-github-event'];
  const deliveryId = req.headers['x-github-delivery'];
  
  console.log(`\n📨 Webhook received [${deliveryId}]`);
  console.log(`Event type: ${eventType}`);

  try {
    // Route based on repository
    const routingInfo = getRoutingInfo(req.body);
    
    if (!routingInfo) {
      console.warn('Repository not found in configuration');
      return res.status(404).json({ error: 'Repository not configured' });
    }

    // Handle the event
    const result = handleEvent(eventType, req.body, routingInfo);
    
    console.log(`✅ Event processed successfully`);
    res.status(200).json({ 
      status: 'success',
      domain: routingInfo.domain,
      result
    });
    
  } catch (error) {
    console.error('Error processing webhook:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check
app.get('/webhooks/github/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    app: 'DWS6-MCP GitHub Webhook Handler',
    domains: Object.keys(DOMAIN_CONFIG),
    timestamp: new Date().toISOString()
  });
});

// Configuration info endpoint
app.get('/webhooks/github/config', (req, res) => {
  res.status(200).json({
    app_id: GITHUB_APP_ID,
    domains: DOMAIN_CONFIG,
    webhook_configured: !!WEBHOOK_SECRET
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
const PORT = process.env.GITHUB_WEBHOOK_PORT || 3001;
app.listen(PORT, () => {
  console.log(`\n🚀 GitHub Webhook Server running on port ${PORT}`);
  console.log(`\n📍 Configured domains:`);
  Object.entries(DOMAIN_CONFIG).forEach(([domain, config]) => {
    console.log(`  • ${domain} (${config.name})`);
  });
  console.log(`\n✅ Ready to receive webhooks`);
});

module.exports = app;
