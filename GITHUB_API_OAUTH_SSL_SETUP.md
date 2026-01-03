# 🔐 GITHUB API KEY & OAUTH SSL SETUP GUIDE

**Purpose:** Fix MCP for GitHub authentication with API key and SSL/OAuth  
**Date:** 03.01.2026  
**Level:** Developer/Admin  

---

## 📊 THREE COMPONENTS YOU NEED

### 1. GitHub Personal Access Token (API Key)
- For direct GitHub API access
- Required for MCP GitHub integration

### 2. GitHub OAuth App
- For OAuth 2.0 authentication
- Used by your applications

### 3. SSL Certificate
- For HTTPS security
- Required for OAuth redirect URLs

---

## 🔑 PART 1: GITHUB PERSONAL ACCESS TOKEN (API KEY)

### Step 1: Generate GitHub Token

1. Go to: https://github.com/settings/tokens/new
2. Or: GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
3. Click: **Generate new token** → **Generate new token (classic)**

### Step 2: Configure Token Permissions

**Token name:** `DWS6-MCP-Integration`  
**Expiration:** 90 days (rotate regularly for security)

**Scopes to select:**

```
✅ repo (Full control of private repositories)
   ✅ repo:status
   ✅ repo_deployment
   ✅ public_repo
   ✅ repo:invite
   ✅ security_events

✅ admin:repo_hook (Full control of repository hooks)
   ✅ write:repo_hook
   ✅ read:repo_hook

✅ workflow (Update GitHub Action workflows)

✅ gist (Create gists)

✅ user (Read user data)
   ✅ read:user
   ✅ user:email

✅ read:org (Read organization data)

✅ admin:org_hook (Manage organization webhooks)
```

### Step 3: Generate and Copy Token

1. Click: **Generate token**
2. Copy the token immediately (you won't see it again!)
3. Format: `ghp_XXXXXXXXXXXXXXXXXXXXX...`

---

## 🔌 PART 2: ADD API KEY TO MCP CONFIGURATION

### Option 1: Environment Variable (Recommended)

**Windows PowerShell:**
```powershell
# Set temporary environment variable
$env:GITHUB_TOKEN = "ghp_your_token_here"

# Or permanently (system-wide)
[Environment]::SetEnvironmentVariable("GITHUB_TOKEN", "ghp_your_token_here", "User")
```

**Linux/Mac:**
```bash
# Temporary
export GITHUB_TOKEN="ghp_your_token_here"

# Permanent (add to ~/.bashrc or ~/.zshrc)
echo 'export GITHUB_TOKEN="ghp_your_token_here"' >> ~/.bashrc
source ~/.bashrc
```

### Option 2: Configuration File

Create `.env.local` (never commit this!):

```bash
# .env.local
GITHUB_TOKEN=ghp_your_token_here
GITHUB_API_URL=https://api.github.com
MCP_GITHUB_ENABLED=true
```

Add to `.gitignore`:
```
.env.local
.env.*.local
```

### Option 3: MCP Hub Configuration

Update `env.mcp` or `.env.mcp`:

```bash
# ============================================================================
# GITHUB MCP INTEGRATION
# ============================================================================
GITHUB_TOKEN=ghp_your_token_here
GITHUB_OWNER=blogtheristo
GITHUB_REPO=dws6
GITHUB_API_BASE=https://api.github.com

# MCP GitHub Server Port
GITHUB_MCP_PORT=8767

# Enable GitHub MCP
GITHUB_MCP_ENABLED=true
```

---

## 🔐 PART 3: GITHUB OAUTH 2.0 APP SETUP

### Why OAuth?
- Secure user authentication
- Users authorize access, not you storing passwords
- Industry standard

### Step 1: Create GitHub OAuth App

1. Go to: https://github.com/settings/developers
2. Click: **New OAuth App**

### Step 2: Configure OAuth App

**Fill in these fields:**

| Field | Value | Notes |
|-------|-------|-------|
| Application name | `DWS IQ 6 Auth` | Your app name |
| Homepage URL | `https://dws6.com` | Your main URL |
| Application description | `MCP GitHub Integration` | What it does |
| Authorization callback URL | `https://dws6.com/auth/callback` | Where OAuth redirects after login |

**Example Configuration:**
```
Application name: DWS IQ 6 - Agent Tracking
Homepage URL: https://dws6.com
Authorization callback URL: https://dws6.com/auth/callback
```

### Step 3: Get OAuth Credentials

After creating the app:

1. Copy: **Client ID** (looks like: `Iv1.abc123def456`)
2. Click: **Generate a new client secret**
3. Copy: **Client Secret** (looks like: `ghp_xxxxxxxxxxxxxxxxxxxxx`)

⚠️ **SECURITY:** Never commit these to Git!

### Step 4: Store OAuth Credentials

**In `.env.local`:**
```bash
GITHUB_OAUTH_CLIENT_ID=Iv1.abc123def456
GITHUB_OAUTH_CLIENT_SECRET=ghp_xxxxxxxxxxxxxxxxxxxxx
GITHUB_OAUTH_REDIRECT_URI=https://dws6.com/auth/callback
```

**In MCP config `env.mcp`:**
```bash
# ============================================================================
# GITHUB OAUTH 2.0
# ============================================================================
GITHUB_OAUTH_ENABLED=true
GITHUB_OAUTH_CLIENT_ID=Iv1.abc123def456
GITHUB_OAUTH_CLIENT_SECRET=ghp_xxxxxxxxxxxxxxxxxxxxx
GITHUB_OAUTH_REDIRECT_URI=https://dws6.com/auth/callback
GITHUB_OAUTH_SCOPE=repo,user,gist,admin:repo_hook,workflow
```

---

## 🔒 PART 4: SSL/HTTPS SETUP

### Why SSL?
- OAuth requires HTTPS (not HTTP)
- Encrypts credentials in transit
- Required for production

### Option 1: Using Cloudflare (Easiest)

You already have Cloudflare! ✅

1. Go to: https://dash.cloudflare.com/
2. Select your domain
3. Go to: **SSL/TLS** → **Overview**
4. Ensure: **Flexible SSL** or **Full SSL** is enabled
5. Your URLs auto-redirect HTTP → HTTPS

**Status Check:**
```bash
# Test your domain
curl -I https://dws6.com
# Should return: HTTP/1.1 200 OK with SSL info
```

### Option 2: Let's Encrypt (Free Certificate)

If self-hosting:

```bash
# Install Certbot
apt-get install certbot python3-certbot-nginx  # For nginx
# or
apt-get install certbot python3-certbot-apache  # For apache

# Generate certificate
certbot certonly --standalone -d dws6.com -d www.dws6.com

# Auto-renew
certbot renew --quiet  # Add to cron for auto-renewal
```

### Option 3: Self-Signed Certificate (Development Only)

```bash
# Generate self-signed cert (NOT for production!)
openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365
```

### Configure SSL in Your App

**Node.js Example:**
```javascript
const https = require('https');
const fs = require('fs');

const options = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem')
};

https.createServer(options, app).listen(443);
```

**Docker Example:**
```dockerfile
# Use HTTPS
ENV SSL_ENABLED=true
ENV SSL_KEY_PATH=/etc/ssl/private/key.pem
ENV SSL_CERT_PATH=/etc/ssl/certs/cert.pem

EXPOSE 443
```

---

## 🔗 PART 5: TEST YOUR SETUP

### Test 1: Verify GitHub Token Works

```bash
# Test token
curl -H "Authorization: token ghp_your_token_here" \
  https://api.github.com/user

# Should return your user info (not 401 Unauthorized)
```

### Test 2: Verify OAuth URLs

```bash
# Test redirect URI (should be accessible)
curl -I https://dws6.com/auth/callback

# Should return: 200 OK (or 301 redirect, but not 404)
```

### Test 3: Verify SSL Certificate

```bash
# Check SSL certificate
curl -v https://dws6.com 2>&1 | grep -i "certificate\|ssl"

# Should show:
# * TLS 1.3
# * subject: CN=dws6.com
# * issuer: C=US, O=Let's Encrypt (or similar)
```

### Test 4: Check MCP GitHub Integration

```bash
# If using MCP with port 8767
curl -H "Authorization: token ghp_your_token_here" \
  http://localhost:8767/repos/blogtheristo/dws6

# Should return GitHub repo data
```

---

## 📝 CONFIGURATION CHECKLIST

- [ ] GitHub Personal Access Token generated (ghp_...)
- [ ] Token has correct scopes (repo, user, workflow, etc.)
- [ ] Token stored in `.env.local` (not committed)
- [ ] GitHub OAuth App created on github.com/settings/developers
- [ ] Client ID and Client Secret copied
- [ ] OAuth credentials stored in `.env.local`
- [ ] SSL/HTTPS working (test with curl -v)
- [ ] Redirect URL configured in GitHub OAuth settings
- [ ] `.gitignore` includes `.env.local` and secrets
- [ ] All tests above passing (4/4)

---

## 🔐 SECURITY BEST PRACTICES

### DO ✅

- ✅ Store tokens in `.env.local` (never in code)
- ✅ Add `.env.local` to `.gitignore`
- ✅ Rotate tokens every 90 days
- ✅ Use specific scopes (not all permissions)
- ✅ Use HTTPS for all OAuth redirects
- ✅ Keep SSL certificates current
- ✅ Use different tokens for dev/staging/production

### DON'T ❌

- ❌ Commit tokens to Git repository
- ❌ Use HTTP for OAuth (always HTTPS)
- ❌ Share tokens in Slack/email
- ❌ Use wildcard OAuth redirect URLs
- ❌ Use expired tokens
- ❌ Log tokens in debug output
- ❌ Use personal accounts for API access

---

## 🚨 TROUBLESHOOTING

### Error: "401 Bad credentials"

**Cause:** Invalid or expired token

**Fix:**
```bash
# Generate new token
curl -H "Authorization: token NEWTOKEN" https://api.github.com/user

# Or check token expiry in GitHub settings
# And regenerate if expired
```

### Error: "Redirect URI mismatch"

**Cause:** OAuth callback URL doesn't match configured URL

**Fix:**
```bash
# In GitHub OAuth App settings, ensure:
Authorization callback URL = https://dws6.com/auth/callback

# NOT: https://dws6.com:8080/auth/callback (different port)
# NOT: https://api.dws6.com/auth/callback (different domain)
# NOT: http://dws6.com/auth/callback (HTTP not HTTPS)
```

### Error: "Self-signed certificate"

**Cause:** Browser doesn't trust your SSL certificate

**Fix:** Use Cloudflare or Let's Encrypt instead of self-signed

### Error: "MCP GitHub not connecting"

**Cause:** Token or configuration not set

**Fix:**
```bash
# Verify environment variable
echo $GITHUB_TOKEN  # Should print your token

# Verify .env file
cat .env.local  # Should have GITHUB_TOKEN=ghp_...

# Restart MCP service after changes
docker-compose restart mcp-hub
```

---

## 📋 QUICK REFERENCE

**GitHub Token Location:**
```
https://github.com/settings/tokens/new
```

**OAuth App Location:**
```
https://github.com/settings/developers
```

**Update these files:**
```
.env.local                  (local development)
env.mcp                     (MCP Hub config)
.gitignore                  (prevent commits)
```

**Test these commands:**
```bash
# Test token
curl -H "Authorization: token $GITHUB_TOKEN" https://api.github.com/user

# Test SSL
curl -v https://dws6.com

# Test MCP
curl http://localhost:8767/health
```

---

## 📚 RELATED DOCUMENTATION

- `SUPABASE_OAUTH_SETUP_GUIDE.md` - OAuth configuration details
- `AUTH_IMPLEMENTATION.md` - Full auth flow
- `README_SECURITY.md` - Security best practices
- `.env.mcp.example` - Environment variables template

---

## ✅ NEXT STEPS

1. **Generate GitHub Token** → Copy to `.env.local`
2. **Create OAuth App** → Store credentials
3. **Enable SSL/HTTPS** → Via Cloudflare or Let's Encrypt
4. **Test Setup** → Run 4 verification tests
5. **Restart Services** → Apply new configuration
6. **Verify MCP** → Check GitHub integration works

---

**Your system is now ready for secure GitHub MCP integration!** 🎉

For more details, see: `SUPABASE_OAUTH_SETUP_GUIDE.md`
