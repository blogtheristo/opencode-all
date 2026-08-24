#!/usr/bin/env npx tsx
/**
 * LinkedIn OAuth 2.0 Token Helper — Firehorse LinkedIn App
 *
 * Runs a one-shot local server to complete the OAuth flow and print
 * your access token + author URN. Copy them into your .env file.
 *
 * SETUP (one-time, takes ~5 minutes):
 * ─────────────────────────────────────────────────────────────────
 * 1. Go to https://www.linkedin.com/developers/apps
 * 2. Click "Create app"
 *    - App name:    Firehorse LinkedIn
 *    - LinkedIn Page: your company page (or create one — required)
 *    - App logo:    upload any logo
 *    - Legal check: tick the checkbox
 *    - Click "Create app"
 *
 * 3. In the app dashboard → "Auth" tab:
 *    - Under "OAuth 2.0 settings" → "Authorized redirect URLs for your app"
 *    - Add:  http://localhost:3131/linkedin/callback
 *    - Click "Update"
 *
 * 4. In "Auth" tab → copy your Client ID and Client Secret
 *    - Add to .env:  LINKEDIN_CLIENT_ID=...  LINKEDIN_CLIENT_SECRET=...
 *
 * 5. In "Products" tab — request access to:
 *    - "Share on LinkedIn"        → gives w_member_social scope
 *    - "Sign In with LinkedIn using OpenID Connect" → gives openid, profile, email
 *    (Approval is usually instant for "Share on LinkedIn")
 *
 * 6. Run this script:
 *    npx tsx scripts/linkedin-oauth.ts
 *    - Opens your browser to LinkedIn login
 *    - After you authorize, prints your token and URN
 *    - Copy both into .env
 *
 * USAGE:
 *   npx tsx scripts/linkedin-oauth.ts              # person token (personal posts)
 *   npx tsx scripts/linkedin-oauth.ts --org        # show instructions for finding org URN
 *   npx tsx scripts/linkedin-oauth.ts --port 8080  # use different port
 *
 * Required env vars:
 *   LINKEDIN_CLIENT_ID
 *   LINKEDIN_CLIENT_SECRET
 */

import dotenv from 'dotenv';
dotenv.config();

import http from 'node:http';
import { URL } from 'node:url';
import { execFile } from 'node:child_process';

// ============================================================================
// CONFIG
// ============================================================================

const args = process.argv.slice(2);
const portEqArg = args.find(a => a.startsWith('--port='));
let portFromArgs: number | undefined;

if (portEqArg) {
  const value = portEqArg.split('=')[1];
  const parsed = parseInt(value, 10);
  if (!Number.isNaN(parsed)) {
    portFromArgs = parsed;
  }
} else {
  const portFlagIndex = args.indexOf('--port');
  if (portFlagIndex !== -1 && typeof args[portFlagIndex + 1] === 'string') {
    const value = args[portFlagIndex + 1];
    const parsed = parseInt(value, 10);
    if (!Number.isNaN(parsed)) {
      portFromArgs = parsed;
    }
  }
}

const PORT = portFromArgs ?? 3131;
const WITH_ORG = args.includes('--org');

const REDIRECT_URI = `http://localhost:${PORT}/linkedin/callback`;

// Scopes needed for posting
const SCOPES = [
  'openid',          // userinfo endpoint
  'profile',         // name + sub (member ID)
  'email',           // email address
  'w_member_social', // post on behalf of a person
  'w_organization_social', // post on behalf of an organization / newsletter
].join(' ');

// ============================================================================
// HELPERS
// ============================================================================

function openBrowser(url: string): void {
  const platform = process.platform;
  const executable = platform === 'darwin' ? 'open'
    : platform === 'win32' ? 'cmd'
    : 'xdg-open';
  const args = platform === 'win32' ? ['/c', 'start', '', url] : [url];
  execFile(executable, args);
}

function buildAuthUrl(clientId: string, state: string): string {
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: clientId,
    redirect_uri: REDIRECT_URI,
    state,
    scope: SCOPES,
  });
  return `https://www.linkedin.com/oauth/v2/authorization?${params.toString()}`;
}

async function exchangeCode(
  code: string,
  clientId: string,
  clientSecret: string
): Promise<{ access_token: string; expires_in: number }> {
  const params = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    redirect_uri: REDIRECT_URI,
    client_id: clientId,
    client_secret: clientSecret,
  });

  const response = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString(),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Token exchange failed: HTTP ${response.status} — ${body}`);
  }

  return response.json() as Promise<{ access_token: string; expires_in: number }>;
}

async function getUserInfo(
  token: string
): Promise<{ sub: string; name: string; email?: string }> {
  const response = await fetch('https://api.linkedin.com/v2/userinfo', {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error(`userinfo failed: HTTP ${response.status}`);
  return response.json() as Promise<{ sub: string; name: string; email?: string }>;
}

// ============================================================================
// MAIN
// ============================================================================

async function main(): Promise<void> {
  const clientId = process.env.LINKEDIN_CLIENT_ID;
  const clientSecret = process.env.LINKEDIN_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    console.error(`
ERROR: LINKEDIN_CLIENT_ID and LINKEDIN_CLIENT_SECRET must be set in .env

Steps to get them:
  1. Go to https://www.linkedin.com/developers/apps
  2. Create app "Firehorse LinkedIn"
  3. Auth tab → copy Client ID + Client Secret → add to .env
  4. Auth tab → add redirect URL: ${REDIRECT_URI}
  5. Products tab → request "Share on LinkedIn"
  6. Re-run this script
`);
    process.exit(1);
  }

  const state = Math.random().toString(36).slice(2);
  const authUrl = buildAuthUrl(clientId, state);

  console.log(`
╔══════════════════════════════════════════════════════╗
║       LinkedIn OAuth — Firehorse LinkedIn App        ║
╚══════════════════════════════════════════════════════╝

Opening LinkedIn authorization in your browser...
If it doesn't open automatically, visit:

  ${authUrl}

Waiting for callback on http://localhost:${PORT}/linkedin/callback
`);

  openBrowser(authUrl);

  // Start local callback server
  const token = await new Promise<string>((resolve, reject) => {
    const server = http.createServer(async (req, res) => {
      if (!req.url?.startsWith('/linkedin/callback')) {
        res.writeHead(404);
        res.end('Not found');
        return;
      }

      const url = new URL(req.url, `http://localhost:${PORT}`);
      const code = url.searchParams.get('code');
      const returnedState = url.searchParams.get('state');
      const error = url.searchParams.get('error');

      if (error) {
        res.writeHead(400, { 'Content-Type': 'text/html' });
        res.end(`<h2>Authorization failed: ${error}</h2><p>You can close this tab.</p>`);
        server.close();
        reject(new Error(`LinkedIn OAuth error: ${error}`));
        return;
      }

      if (returnedState !== state) {
        res.writeHead(400, { 'Content-Type': 'text/html' });
        res.end('<h2>State mismatch — possible CSRF. Try again.</h2>');
        server.close();
        reject(new Error('State mismatch'));
        return;
      }

      if (!code) {
        res.writeHead(400, { 'Content-Type': 'text/html' });
        res.end('<h2>No code received.</h2>');
        server.close();
        reject(new Error('No code in callback'));
        return;
      }

      try {
        const tokenData = await exchangeCode(code, clientId, clientSecret);
        const expiresAt = new Date(Date.now() + tokenData.expires_in * 1000);
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(`
<html><body style="font-family:sans-serif;max-width:600px;margin:40px auto;padding:20px">
<h2>✅ LinkedIn Authorization Successful</h2>
<p>Token acquired. Expires: <strong>${expiresAt.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</strong></p>
<p>You can close this tab and copy the values from your terminal into <code>.env</code></p>
</body></html>`);
        server.close();
        resolve(tokenData.access_token);
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'text/html' });
        res.end(`<h2>Token exchange failed</h2><pre>${String(err)}</pre>`);
        server.close();
        reject(err);
      }
    });

    server.listen(PORT, () => {
      // Server running, waiting for callback
    });

    server.on('error', reject);
  });

  // Get user info (sub = member ID used to build URN)
  console.log('Fetching your LinkedIn profile...');
  const userInfo = await getUserInfo(token);
  const personUrn = `urn:li:person:${userInfo.sub}`;

  const expiresDate = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000); // ~60 days
  const expiresStr = expiresDate.toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric',
  });

  console.log(`
╔══════════════════════════════════════════════════════╗
║              Token acquired successfully!            ║
╚══════════════════════════════════════════════════════╝

Profile:  ${userInfo.name}${userInfo.email ? ` (${userInfo.email})` : ''}
Expires:  ~${expiresStr} (60 days from now)

Copy these into your .env file:
─────────────────────────────────────────────────────
LINKEDIN_ACCESS_TOKEN=${token}
LINKEDIN_AUTHOR_URN=${personUrn}
─────────────────────────────────────────────────────

${WITH_ORG ? `
To post as a company page instead, replace LINKEDIN_AUTHOR_URN with:
  urn:li:organization:<orgId>

Find your org ID:
  1. Go to your LinkedIn Company Page
  2. Click "Admin tools" → "Super admin" → look at the URL
     linkedin.com/company/<orgId>/admin/
  3. Or: GET https://api.linkedin.com/v2/organizationAcls?q=roleAssignee
     with the token above to list your organizations.
` : ''}
To test posting:
  npx tsx scripts/seed-post-queue.ts --dry-run

To seed the full post queue (10 posts):
  npx tsx scripts/seed-post-queue.ts
`);
}

main().catch(err => {
  console.error('\nOAuth flow failed:', err.message || err);
  process.exit(1);
});
