#!/usr/bin/env npx tsx
/**
 * One-time: Send safety hooks deployment warning to morning brief
 * Delete after use.
 */
import dotenv from 'dotenv';
dotenv.config();
import { sendEmail } from '../src/utils/send-email.js';

const now = new Date().toISOString().slice(0, 16).replace('T', ' ');
const branch = 'claude/setup-safety-hooks-vyt21';

const html = `
<div style="font-family:-apple-system,BlinkMacSystemFont,sans-serif;max-width:600px;margin:0 auto;background:#1a1a2e;color:#e0e0e0;padding:24px;border-radius:8px">
  <div style="background:#dc2626;color:white;padding:16px 20px;border-radius:6px;margin-bottom:20px">
    <h1 style="margin:0;font-size:20px">WARNING: SAFETY HOOKS DEPLOYED</h1>
    <p style="margin:4px 0 0;font-size:13px;opacity:0.9">${now} UTC | Branch: ${branch}</p>
  </div>

  <h2 style="color:#f59e0b;font-size:16px;margin-top:0">What Changed</h2>
  <p>Claude Code safety hooks overhauled. Every team member gets guardrails on pull.</p>

  <h3 style="color:#ef4444;font-size:14px">Hard Blocks</h3>
  <ul style="line-height:1.8">
    <li>rm -rf on broad paths, force push, hard reset, git clean</li>
    <li>git rm blocked (must use git mv with _OLD suffix)</li>
    <li>ollama pull/rm blocked, sudo blocked</li>
    <li>curl/wget piped to sh/bash blocked</li>
    <li>Writing to .env, *.key, *.pem, credentials.json</li>
    <li>.md files in public site folders blocked</li>
    <li>DB migrations require human authoring</li>
    <li>14 secret patterns detected and blocked</li>
    <li>EU AI Act Article 12 audit tables: immutable</li>
  </ul>

  <h3 style="color:#22c55e;font-size:14px">Auto-Actions</h3>
  <ul style="line-height:1.8">
    <li>prettier + eslint auto-fix on Write/Edit</li>
    <li>Governance checklist on session stop</li>
    <li>Auto-commit on feature branches</li>
    <li>Tests required before PR creation</li>
  </ul>

  <h2 style="color:#ef4444;font-size:16px">Design Decision</h2>
  <p><strong>Zero permission prompts.</strong> Block or allow, never ask. Previous setup caused brain exhaustion from constant approval dialogs.</p>

  <h2 style="color:#f59e0b;font-size:16px">Action</h2>
  <p>Review and merge branch <code>${branch}</code></p>

  <div style="margin-top:24px;padding-top:16px;border-top:1px solid #333;font-size:12px;color:#888">
    DWS IQ 6 | Lifetime Oy | Safety Hooks Alert
  </div>
</div>`;

const text = `WARNING: SAFETY HOOKS DEPLOYED
${now} UTC | Branch: ${branch}

HARD BLOCKS: rm -rf, force push, hard reset, git rm, ollama, sudo, secrets, .env writes, .md in public folders, DB migrations, sovereignty audit immutability.

AUTO: prettier+eslint, governance checklist, auto-commit, test gate.

DESIGN: Zero prompts. Block or allow, never ask.

ACTION: Merge ${branch}`;

async function main() {
  const result = await sendEmail({
    from: process.env.EMAIL_FROM || 'risto@onelifetime.world',
    to: process.env.OUTREACH_DIGEST_EMAIL || 'risto@lifetime.fi',
    subject: `WARNING: Safety Hooks Deployed — Merge Required [${branch}]`,
    html,
    text,
  });

  console.log(result.ok ? 'Sent via ' + result.transport : 'FAILED: ' + result.error);
}

main().catch(console.error);
