# DWS IQ Platform - Cloudflare DNS Configuration Guide
## Complete Setup for onelifetime.world + dws10.com

**Document Version:** 1.0
**Last Updated:** November 16, 2025
**Infrastructure:** Cloudflare DNS + Google Cloud Run

---

## 🎯 Architecture Overview

```
┌──────────────────────────────────────────────────────────────────┐
│  CLOUDFLARE (DNS + CDN + DDoS Protection)                        │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  onelifetime.world (Frontend)                                    │
│  ├─ onelifetime.world      → Google Cloud Run (Next.js PWA)     │
│  ├─ www.onelifetime.world  → CNAME to apex                       │
│  └─ community.onelifetime.world → Cloud Run (optional)          │
│                                                                   │
│  dws10.com (Backend)                                             │
│  ├─ api.dws10.com          → Google Cloud Run (FastAPI)         │
│  ├─ admin.dws10.com        → Cloud Run (Admin Dashboard)        │
│  └─ edge.dws10.com         → AWS IoT endpoint (future)          │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
                               ↓
┌──────────────────────────────────────────────────────────────────┐
│  GOOGLE CLOUD RUN (europe-north1)                                │
│  ├─ dwsiq-frontend (onelifetime.world)                          │
│  └─ dwsiq-backend (api.dws10.com)                               │
└──────────────────────────────────────────────────────────────────┘
```

---

## 🚀 Step-by-Step DNS Configuration

### Prerequisites

1. ✅ Cloudflare account (free or pro plan)
2. ✅ onelifetime.world domain added to Cloudflare
3. ✅ dws10.com domain added to Cloudflare
4. ⏳ Google Cloud Run services deployed (we'll do this in Week 2)

---

## Part 1: onelifetime.world (Frontend) DNS Setup

### Step 1: Add DNS Records in Cloudflare

Log into Cloudflare → Select onelifetime.world → DNS → Records

#### Add these records:

```
Type    Name        Content                           Proxy Status   TTL
────────────────────────────────────────────────────────────────────────
A       @           216.239.32.21                     Proxied (🧡)   Auto
A       @           216.239.34.21                     Proxied (🧡)   Auto
A       @           216.239.36.21                     Proxied (🧡)   Auto
A       @           216.239.38.21                     Proxied (🧡)   Auto

AAAA    @           2001:4860:4802:32::15            Proxied (🧡)   Auto
AAAA    @           2001:4860:4802:34::15            Proxied (🧡)   Auto
AAAA    @           2001:4860:4802:36::15            Proxied (🧡)   Auto
AAAA    @           2001:4860:4802:38::15            Proxied (🧡)   Auto

CNAME   www         onelifetime.world                 Proxied (🧡)   Auto
CNAME   community   onelifetime.world                 Proxied (🧡)   Auto
```

**Why 4 A records?**
Google Cloud Run uses Anycast IPs across 4 global load balancers for high availability.

**Why Proxied (🧡)?**
- Enables Cloudflare CDN (faster global access)
- DDoS protection (rate limiting, WAF)
- Free SSL certificate (Cloudflare Universal SSL)
- Analytics and performance metrics

### Step 2: Configure SSL/TLS Settings

Cloudflare → SSL/TLS → Overview

```
Encryption Mode: Full (strict)
```

**Why Full (strict)?**
- Cloudflare ↔ Client: Cloudflare SSL certificate
- Cloudflare ↔ Cloud Run: Google's SSL certificate
- End-to-end encryption (most secure)

### Step 3: Enable Performance Features

**Cloudflare → Speed → Optimization**

```
✅ Auto Minify: JavaScript, CSS, HTML
✅ Brotli Compression: Enabled
✅ Early Hints: Enabled (faster page loads)
✅ Rocket Loader: Disabled (conflicts with Next.js)
```

**Cloudflare → Caching → Configuration**

```
Browser Cache TTL: 4 hours
Caching Level: Standard
```

### Step 4: Configure Security (Recommended)

**Cloudflare → Security → WAF**

```
Security Level: Medium
Challenge Passage: 30 minutes
Browser Integrity Check: Enabled
```

**Cloudflare → Security → Bots**

```
Bot Fight Mode: Enabled (blocks malicious bots)
```

**Rate Limiting (Cloudflare Pro plan - €20/month):**

```
Rule: Limit API requests to 1000/hour per IP
Path: /api/*
Action: Block for 1 hour
```

---

## Part 2: dws10.com (Backend) DNS Setup

### Step 1: Add DNS Records in Cloudflare

Log into Cloudflare → Select dws10.com → DNS → Records

```
Type    Name    Content                           Proxy Status   TTL
────────────────────────────────────────────────────────────────────
A       api     216.239.32.21                     Proxied (🧡)   Auto
A       api     216.239.34.21                     Proxied (🧡)   Auto
A       api     216.239.36.21                     Proxied (🧡)   Auto
A       api     216.239.38.21                     Proxied (🧡)   Auto

AAAA    api     2001:4860:4802:32::15            Proxied (🧡)   Auto
AAAA    api     2001:4860:4802:34::15            Proxied (🧡)   Auto
AAAA    api     2001:4860:4802:36::15            Proxied (🧡)   Auto
AAAA    api     2001:4860:4802:38::15            Proxied (🧡)   Auto

CNAME   admin   api.dws10.com                     Proxied (🧡)   Auto
```

**Optional: Redirect apex domain (dws10.com) to onelifetime.world**

```
Type        Name    Content
────────────────────────────────────────────────────────────────
Page Rule   dws10.com/*    →   https://onelifetime.world/*
```

### Step 2: SSL/TLS Configuration (Same as Part 1)

```
Encryption Mode: Full (strict)
Minimum TLS Version: 1.2
TLS 1.3: Enabled
Automatic HTTPS Rewrites: Enabled
```

### Step 3: API-Specific Optimizations

**Cloudflare → Rules → Page Rules**

Create rule for api.dws10.com:

```
URL Pattern: api.dws10.com/*
Settings:
  - Cache Level: Bypass (don't cache API responses)
  - Security Level: High (protect against attacks)
  - Browser Integrity Check: Enabled
```

**Cloudflare → Network**

```
WebSockets: Enabled (required for wss://api.dws10.com/v1/stream)
HTTP/2: Enabled
HTTP/3 (QUIC): Enabled
```

---

## Part 3: Google Cloud Run Domain Mapping

### Step 1: Deploy Backend Service

```bash
# Navigate to backend directory
cd backend/services/agent-orchestrator

# Deploy to Cloud Run
gcloud run deploy dwsiq-backend \
  --source=. \
  --platform=managed \
  --region=europe-north1 \
  --allow-unauthenticated \
  --min-instances=1 \
  --max-instances=100 \
  --memory=2Gi \
  --cpu=1 \
  --timeout=300 \
  --set-env-vars="GROQ_API_KEY=${GROQ_API_KEY},SUPABASE_URL=${SUPABASE_URL}"

# Map custom domain
gcloud run domain-mappings create \
  --service=dwsiq-backend \
  --domain=api.dws10.com \
  --region=europe-north1

# Expected output:
# ✅ Mapping created successfully.
# ✅ Certificate provisioning in progress (may take up to 15 minutes).
```

### Step 2: Deploy Frontend Service

```bash
# Navigate to frontend directory
cd frontend/onelifetime-web

# Build Next.js for production
npm run build

# Deploy to Cloud Run
gcloud run deploy dwsiq-frontend \
  --source=. \
  --platform=managed \
  --region=europe-north1 \
  --allow-unauthenticated \
  --min-instances=1 \
  --max-instances=10 \
  --memory=512Mi \
  --cpu=1 \
  --timeout=60

# Map custom domain
gcloud run domain-mappings create \
  --service=dwsiq-frontend \
  --domain=onelifetime.world \
  --region=europe-north1

# Also map www subdomain
gcloud run domain-mappings create \
  --service=dwsiq-frontend \
  --domain=www.onelifetime.world \
  --region=europe-north1
```

### Step 3: Verify Domain Mapping

```bash
# Check mapping status
gcloud run domain-mappings describe \
  --domain=api.dws10.com \
  --region=europe-north1

# Expected output:
# status:
#   conditions:
#   - status: "True"
#     type: Ready
#   resourceRecords:
#   - name: api.dws10.com
#     type: A
#     rrdata: 216.239.32.21
```

---

## Part 4: Verification & Testing

### Step 1: Check DNS Propagation

```bash
# Check if DNS is resolving correctly
dig onelifetime.world
dig api.dws10.com

# Should return Cloudflare IPs (104.x.x.x range)
# Then Cloudflare proxies to Google Cloud Run

# Check SSL certificate
curl -I https://onelifetime.world
curl -I https://api.dws10.com
```

### Step 2: Test Frontend

```bash
# Test homepage
curl https://onelifetime.world

# Test PWA manifest
curl https://onelifetime.world/manifest.json

# Test API proxy (frontend → backend)
curl https://onelifetime.world/api/health
```

### Step 3: Test Backend API

```bash
# Health check
curl https://api.dws10.com/v1/health

# Expected response:
# {
#   "status": "healthy",
#   "service": "agent-orchestrator",
#   "version": "1.0.0",
#   "agents_available": ["SiteSense", "ScheduleGenius", "MaterialOracle"]
# }

# Test agent invocation
curl -X POST https://api.dws10.com/v1/agent/invoke \
  -H "Content-Type: application/json" \
  -d '{
    "agent_name": "SiteSense",
    "user_message": "Test message",
    "user_id": "test-user"
  }'
```

### Step 4: Test WebSocket Streaming

```bash
# Install wscat if needed
npm install -g wscat

# Connect to WebSocket
wscat -c wss://api.dws10.com/v1/stream

# Send test message
> {"agent_name": "SiteSense", "message": "Hello"}
```

---

## Part 5: Cloudflare Optimization (Advanced)

### Argo Smart Routing (Cloudflare Pro - €20/month)

**Benefit:** 30% faster global routing via Cloudflare's optimized network

```
Cloudflare → Traffic → Argo Smart Routing
Toggle: Enabled
Cost: €0.10 per GB (first 1GB free)
```

**Worth it?** Yes, if you have global users (US, Asia). For EU-only, less critical.

### Load Balancing (Cloudflare Pro - €5/month)

**Benefit:** Distribute traffic across multiple Cloud Run regions

```
Cloudflare → Traffic → Load Balancing
Create Pool:
  - Name: dwsiq-backend-pool
  - Origins:
    1. europe-north1-dwsiq-backend.a.run.app (primary)
    2. us-central1-dwsiq-backend.a.run.app (backup)
  - Health Check: https://{origin}/v1/health every 60s
```

**Worth it?** Only if you deploy to multiple regions (not needed for pilot).

---

## Part 6: Security Best Practices

### 1. Enable DNSSEC (Free)

```
Cloudflare → DNS → Settings → DNSSEC
Status: Enabled
```

**Benefit:** Prevents DNS hijacking/spoofing attacks.

### 2. Configure CORS Headers (Backend)

```python
# backend/services/agent-orchestrator/main.py

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://onelifetime.world",
        "https://www.onelifetime.world",
        "http://localhost:3000"  # Local dev only
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)
```

### 3. Set Security Headers (Cloudflare Transform Rules)

```
Cloudflare → Rules → Transform Rules → Modify Response Header

Add headers:
  - X-Content-Type-Options: nosniff
  - X-Frame-Options: DENY
  - X-XSS-Protection: 1; mode=block
  - Referrer-Policy: strict-origin-when-cross-origin
  - Permissions-Policy: geolocation=(), microphone=(), camera=()
```

### 4. Rate Limiting (Prevent DDoS)

```
Cloudflare → Security → WAF → Rate limiting rules

Rule 1: API endpoint protection
  If: hostname equals "api.dws10.com"
  AND: path starts with "/v1/agent/invoke"
  THEN: rate limit 100 requests per minute per IP
  Action: Block for 1 hour

Rule 2: Login protection
  If: path equals "/api/auth/login"
  THEN: rate limit 5 requests per minute per IP
  Action: Challenge (CAPTCHA) for 15 minutes
```

---

## Part 7: Monitoring & Analytics

### Cloudflare Analytics (Free)

```
Cloudflare → Analytics → Traffic

View:
  - Requests per second
  - Bandwidth usage
  - Top countries
  - Top URLs
  - Threat analytics (blocked bots/attacks)
```

### Cloudflare Web Analytics (Privacy-friendly)

```
Cloudflare → Analytics → Web Analytics
Add site: onelifetime.world

Copy tracking script:
<script defer src='https://static.cloudflareinsights.com/beacon.min.js'
        data-cf-beacon='{"token": "YOUR_TOKEN"}'></script>

Add to: frontend/app/layout.tsx (Next.js root layout)
```

**Benefit:** GDPR-compliant analytics without cookies (unlike Google Analytics).

### Google Cloud Monitoring Integration

```bash
# View Cloud Run logs
gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=dwsiq-backend" --limit 50 --format json

# Set up alerts for errors
gcloud alpha monitoring policies create \
  --notification-channels=CHANNEL_ID \
  --display-name="Backend Error Rate Alert" \
  --condition-display-name="Error rate > 5%" \
  --condition-threshold-value=0.05 \
  --condition-threshold-duration=300s
```

---

## 🎯 Quick Reference Checklist

### DNS Configuration (Cloudflare)

- [ ] onelifetime.world: 4x A records + 4x AAAA records (proxied)
- [ ] www.onelifetime.world: CNAME to apex (proxied)
- [ ] api.dws10.com: 4x A records + 4x AAAA records (proxied)
- [ ] SSL/TLS: Full (strict) encryption mode
- [ ] DNSSEC: Enabled

### Cloud Run Deployment

- [ ] Backend deployed: dwsiq-backend → api.dws10.com
- [ ] Frontend deployed: dwsiq-frontend → onelifetime.world
- [ ] Domain mappings created (gcloud run domain-mappings)
- [ ] SSL certificates auto-provisioned (wait 15 minutes)

### Cloudflare Optimizations

- [ ] Auto Minify: Enabled (JS, CSS, HTML)
- [ ] Brotli Compression: Enabled
- [ ] WebSockets: Enabled (for wss://api.dws10.com/v1/stream)
- [ ] WAF: Security level = Medium
- [ ] Bot Fight Mode: Enabled

### Security

- [ ] CORS headers configured in backend
- [ ] Security headers added (Cloudflare Transform Rules)
- [ ] Rate limiting rules: 100 req/min for /v1/agent/invoke
- [ ] Page Rule: Bypass cache for api.dws10.com/*

### Testing

- [ ] DNS resolving: `dig onelifetime.world`, `dig api.dws10.com`
- [ ] SSL working: `curl -I https://onelifetime.world`
- [ ] Health check: `curl https://api.dws10.com/v1/health`
- [ ] Agent invocation: `curl -X POST https://api.dws10.com/v1/agent/invoke`
- [ ] WebSocket: `wscat -c wss://api.dws10.com/v1/stream`

---

## 💰 Cloudflare Cost Estimate

| Plan | Monthly Cost | Features | Recommended? |
|------|--------------|----------|--------------|
| **Free** | €0 | DNS, CDN, DDoS, Universal SSL, Basic WAF | ✅ **YES** (start here) |
| **Pro** | €20/domain | Argo Smart Routing, Image Optimization, WAF custom rules | ⚠️ Optional (after pilot) |
| **Business** | €200/domain | Load balancing, PCI compliance, Custom SSL | ❌ Not needed (too expensive) |

**Recommendation:** Start with **Free plan** (€0/month). Upgrade to Pro (€20/month) only if:
- You have >100K requests/month
- You need custom WAF rules
- You want Argo Smart Routing (30% faster global routing)

---

## 🚨 Troubleshooting

### Issue 1: DNS not resolving after 24 hours

```bash
# Flush DNS cache
sudo dscacheutil -flushcache  # macOS
ipconfig /flushdns             # Windows

# Check nameservers
dig onelifetime.world NS

# Should return Cloudflare nameservers:
# ns1.cloudflare.com
# ns2.cloudflare.com
```

**Fix:** Verify domain nameservers are set to Cloudflare in domain registrar.

### Issue 2: SSL certificate not provisioning

```bash
# Check Cloud Run domain mapping status
gcloud run domain-mappings describe --domain=api.dws10.com

# If stuck, delete and recreate mapping
gcloud run domain-mappings delete --domain=api.dws10.com
gcloud run domain-mappings create --service=dwsiq-backend --domain=api.dws10.com
```

**Fix:** Wait 15-30 minutes for certificate provisioning. Check Cloudflare SSL/TLS settings (must be "Full (strict)").

### Issue 3: CORS errors in browser console

```javascript
// Error: Access to fetch at 'https://api.dws10.com' has been blocked by CORS policy

// Fix: Add origin to backend CORS middleware
allow_origins=[
    "https://onelifetime.world",
    "https://www.onelifetime.world"
]
```

### Issue 4: WebSocket connection fails

```bash
# Error: WebSocket connection to 'wss://api.dws10.com/v1/stream' failed

# Fix: Enable WebSockets in Cloudflare
Cloudflare → Network → WebSockets: Enabled
```

---

## 📝 Next Steps

1. **Week 1:** Configure DNS in Cloudflare (this guide)
2. **Week 2:** Deploy backend to api.dws10.com
3. **Week 3:** Deploy frontend to onelifetime.world
4. **Week 4:** Test end-to-end flow, enable monitoring

**Total Time:** 4 weeks to production-ready infrastructure.

---

## 🔗 Useful Links

- **Cloudflare Dashboard:** https://dash.cloudflare.com
- **Google Cloud Console:** https://console.cloud.google.com
- **Cloud Run Documentation:** https://cloud.google.com/run/docs/mapping-custom-domains
- **Cloudflare DNS Docs:** https://developers.cloudflare.com/dns

---

**Document Version:** 1.0
**License:** Proprietary - Lifetime Oy
