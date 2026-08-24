#!/usr/bin/env node
/**
 * Generate a long-lived API key (JWT) for Cline / DWS CLI.
 *
 * Use this token in Cline as the API key when connecting to a DWS
 * OpenAI-compatible or backend endpoint, or set as DWS_API_TOKEN for the CLI.
 *
 * Usage:
 *   node scripts/generate-cline-api-key.cjs
 *   # Or with explicit env:
 *   JWT_SECRET=your-secret node scripts/generate-cline-api-key.cjs
 *
 * Requires: JWT_SECRET in .env or environment (min 32 chars).
 */

const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

// Load .env from repo root using dotenv
const envPath = path.resolve(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
}

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET || JWT_SECRET.length < 32) {
  console.error('Error: JWT_SECRET must be set and at least 32 characters.');
  console.error('Set it in .env or run: JWT_SECRET=your-secret node scripts/generate-cline-api-key.cjs');
  process.exit(1);
}

// Use jsonwebtoken (same as backend)
let jwt;
try {
  jwt = require('jsonwebtoken');
} catch (e) {
  console.error('Error: jsonwebtoken not found. Run from repo root: npm install');
  process.exit(1);
}

const payload = {
  userId: 'cline-api',
  email: 'cline@dws.local',
  // Use a valid backend RBAC role and keep the API-client semantics in accessLevel.
  role: 'member',
  accessLevel: 'api_client',
};
const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '90d', algorithm: 'HS256' });

console.log('DWS API key for Cline / DWS_API_TOKEN (valid 90 days):\n');
console.log(token);
console.log('\n---');
console.log('Use in Cline: paste this as the API key when configuring your DWS/OpenAI-compatible endpoint.');
console.log('Use for CLI: export DWS_API_TOKEN="<token>" or add to .env as DWS_API_TOKEN=<token>');
console.log('Rotate: run this script again and update Cline / .env. Do not commit the token.');
