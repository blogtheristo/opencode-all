# DWS IQ Platform - Domain Strategy Analysis
## Comparing All Domain Options for Optimal Architecture

**Document Version:** 1.0
**Last Updated:** November 16, 2025
**Prepared by:** Claude Code for Lifetime Oy

---

## 🎯 Executive Summary

You have **four domain strategy options** for deploying DWS IQ Platform:

| Option | Domains | Complexity | Cost | SEO Value | Recommendation |
|--------|---------|------------|------|-----------|----------------|
| **A** | lifetime.fi only | ⭐ Simple | € | ⭐⭐⭐ | ✅ **RECOMMENDED** |
| **B** | dws10.com + onelifetime.world | ⭐⭐⭐ Complex | €€ | ⭐⭐ | Good if existing traffic |
| **C** | New domain (e.g., dwsiq.ai) | ⭐⭐ Medium | €€€ | ⭐ | Good for branding |
| **D** | Multi-domain hybrid | ⭐⭐⭐⭐ Very Complex | €€€€ | ⭐⭐ | Not recommended |

**Winner: Option A - lifetime.fi (Single Domain)**

---

## Option A: lifetime.fi (Single Domain) ✅ RECOMMENDED

### Architecture Overview

```
┌──────────────────────────────────────────────────────────────────┐
│  SINGLE DOMAIN ARCHITECTURE: lifetime.fi                         │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│  SUBDOMAIN: app.lifetime.fi (Frontend + PWA)                     │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  Google Cloud Run: Next.js 14 PWA                                │
│  Routes:                                                          │
│  - https://app.lifetime.fi → DWS IQ Platform (installable PWA)   │
│  - https://app.lifetime.fi/agents → Agent chat interface         │
│  - https://app.lifetime.fi/projects → Project dashboard          │
│  - https://app.lifetime.fi/analytics → Analytics                 │
└──────────────────────────────────────────────────────────────────┘
                               ↓ API Calls
┌──────────────────────────────────────────────────────────────────┐
│  SUBDOMAIN: api.lifetime.fi (Backend Services)                   │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  Google Cloud Run: FastAPI + LlamaStack                          │
│  Endpoints:                                                       │
│  - POST /v1/agent/invoke → Agent orchestration                   │
│  - POST /v1/edge/sync → Edge device sync (AWS IoT → Cloud)      │
│  - GET /v1/health → Health checks                                │
│  - GET /v1/metrics → Prometheus metrics                          │
│  - WS /v1/stream → WebSocket streaming                           │
└──────────────────────────────────────────────────────────────────┘
                               ↓ Optional
┌──────────────────────────────────────────────────────────────────┐
│  SUBDOMAIN: www.lifetime.fi (Marketing Site) [Optional]          │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  Static site (Vercel, Netlify, or Cloud Run)                     │
│  - Company homepage                                               │
│  - Product overview                                               │
│  - Blog & case studies                                            │
│  - Documentation                                                  │
│  - Contact & support                                              │
└──────────────────────────────────────────────────────────────────┘
                               ↓ Optional
┌──────────────────────────────────────────────────────────────────┐
│  SUBDOMAIN: community.lifetime.fi [Optional]                     │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  Community platform (Discourse, Circle, or custom)               │
│  - User forums                                                    │
│  - Knowledge base                                                 │
│  - Feature requests                                               │
│  - Peer support                                                   │
└──────────────────────────────────────────────────────────────────┘
```

### DNS Configuration for lifetime.fi

```bash
# Add these DNS records to your lifetime.fi registrar

# Frontend (PWA)
app.lifetime.fi.     A     216.239.32.21      # Google Cloud Run IPv4
app.lifetime.fi.     AAAA  2001:4860:4802:32::15  # Google Cloud Run IPv6

# Backend API
api.lifetime.fi.     A     216.239.32.21
api.lifetime.fi.     AAAA  2001:4860:4802:32::15

# Marketing site (optional)
www.lifetime.fi.     A     216.239.32.21
www.lifetime.fi.     AAAA  2001:4860:4802:32::15

# Apex domain redirect (lifetime.fi → www.lifetime.fi)
lifetime.fi.         A     216.239.32.21
lifetime.fi.         AAAA  2001:4860:4802:32::15

# Community (optional)
community.lifetime.fi. A   216.239.32.21
community.lifetime.fi. AAAA 2001:4860:4802:32::15
```

### Deployment Commands

```bash
# Deploy Frontend to app.lifetime.fi
gcloud run deploy dwsiq-frontend \
  --source=./frontend \
  --platform=managed \
  --region=europe-north1 \
  --allow-unauthenticated \
  --min-instances=1 \
  --max-instances=10 \
  --memory=512Mi

gcloud run domain-mappings create \
  --service=dwsiq-frontend \
  --domain=app.lifetime.fi \
  --region=europe-north1

# Deploy Backend to api.lifetime.fi
gcloud run deploy dwsiq-backend \
  --source=./backend/services/agent-orchestrator \
  --platform=managed \
  --region=europe-north1 \
  --allow-unauthenticated \
  --min-instances=1 \
  --max-instances=100 \
  --memory=2Gi \
  --set-env-vars="GROQ_API_KEY=${GROQ_API_KEY}"

gcloud run domain-mappings create \
  --service=dwsiq-backend \
  --domain=api.lifetime.fi \
  --region=europe-north1
```

### Advantages ✅

1. **Simplicity:** Single domain to manage, minimal DNS complexity
2. **Cost:** €0 (already own lifetime.fi), no new domain purchases
3. **Branding:** Aligns with company identity (Lifetime Consulting)
4. **Email Match:** risto@lifetime.fi already uses this domain
5. **SEO:** Existing domain authority (if any traffic exists)
6. **SSL:** Automatic via Cloud Run (Let's Encrypt)
7. **CORS:** No cross-origin issues (same parent domain)
8. **Cookies:** Shared session cookies across subdomains

### Disadvantages ❌

1. **Generic Branding:** "lifetime.fi" doesn't explicitly mention "DWS IQ"
2. **Finland TLD:** .fi might not resonate globally (vs. .com/.ai)
3. **Product Separation:** Harder to spin off DWS IQ as separate brand later

### Mitigation Strategies

- **Use "DWS IQ Platform" as product name in UI** (domain is just infrastructure)
- **Register dwsiq.com/.ai as redirect** to app.lifetime.fi (future brand protection)
- **Market as "DWS IQ by Lifetime"** to build both brands

---

## Option B: dws10.com + onelifetime.world (Dual Domain)

### Architecture Overview

```
┌──────────────────────────────────────────────────────────────────┐
│  FRONTEND: onelifetime.world                                     │
│  Community hub, onboarding, PWA                                  │
└──────────────────────────────────────────────────────────────────┘
                               ↓
┌──────────────────────────────────────────────────────────────────┐
│  BACKEND: api.dws10.com                                          │
│  Agent API, edge sync, inference proxy                           │
└──────────────────────────────────────────────────────────────────┘
```

### Advantages ✅

1. **Separation of Concerns:** Clear frontend vs. backend split
2. **Existing Assets:** Leverage any existing traffic/SEO on these domains
3. **Brand Diversity:** "onelifetime.world" for community, "dws10" for tech
4. **Flexibility:** Can evolve each domain independently

### Disadvantages ❌

1. **Complexity:** 2 domains to manage, 2x DNS configurations
2. **CORS Issues:** Cross-origin requests require careful header management
3. **Cookie Challenges:** Can't share session cookies across different domains
4. **Confusing:** Users see 2 different brand names
5. **Cost:** If need to renew both domains (though you likely already own them)

### When to Use This Option

- ✅ If onelifetime.world **already has significant traffic/community**
- ✅ If dws10.com **already hosts backend services** you want to preserve
- ✅ If you want to **keep brands separate** for future acquisition/spin-off

---

## Option C: New Domain (e.g., dwsiq.ai, dwsiq.com, dwsplatform.io)

### Suggested Domain Names

| Domain | Availability | Annual Cost | Pros | Cons |
|--------|--------------|-------------|------|------|
| **dwsiq.ai** | Check | €60-120 | Modern, AI-focused | Premium TLD |
| **dwsiq.com** | Check | €15 | Professional, global | May be taken |
| **dwsplatform.io** | Check | €40 | Tech-savvy | Longer |
| **dwsiq.io** | Check | €40 | Short, tech | Premium if taken |
| **lifetime-dws.com** | Likely available | €15 | Combines both brands | Long |

### Architecture (Example: dwsiq.ai)

```
app.dwsiq.ai     → Frontend (PWA)
api.dwsiq.ai     → Backend (Agent API)
www.dwsiq.ai     → Marketing site
docs.dwsiq.ai    → Documentation
```

### Advantages ✅

1. **Clean Slate:** No legacy baggage, purpose-built for DWS IQ
2. **Brand Clarity:** Domain name clearly communicates product
3. **SEO Opportunity:** Build authority from scratch with focused content
4. **Modern TLD:** .ai or .io signals tech/AI company

### Disadvantages ❌

1. **Cost:** €15-120/year + renewal fees
2. **No SEO History:** Starting from zero domain authority
3. **Time:** Domain registration, DNS propagation (24-48 hours)
4. **Marketing:** Need to build brand awareness from scratch

### When to Use This Option

- ✅ If you want **DWS IQ to become a separate brand** from Lifetime Consulting
- ✅ If you plan to **raise significant funding** (investors prefer dedicated domains)
- ✅ If you're targeting **global markets** (.com/.ai more recognizable than .fi)

---

## Option D: Multi-Domain Hybrid (NOT RECOMMENDED)

Using all domains (lifetime.fi + dws10.com + onelifetime.world) simultaneously.

### Why Not Recommended ❌

1. **Extreme Complexity:** 3+ DNS configurations, multiple CORS setups
2. **User Confusion:** Which domain is the "real" product?
3. **SEO Dilution:** Google sees duplicate content across domains
4. **Maintenance Nightmare:** 3x SSL certs, 3x renewals, 3x monitoring
5. **Cost:** No real benefit over single domain

---

## 🏆 FINAL RECOMMENDATION: Option A (lifetime.fi)

### Why lifetime.fi is the Best Choice

```
✅ PROS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Zero Cost         → Already own domain
2. Email Match       → risto@lifetime.fi already uses it
3. Simple DNS        → Single domain, 2-3 subdomains max
4. Fast Deployment   → No domain registration wait
5. Brand Alignment   → Lifetime Consulting = trust
6. CORS-Free         → Subdomains share same origin policy
7. Cookie Sharing    → Session management across app.*/api.*
8. SSL Automation    → Cloud Run auto-provisions Let's Encrypt
9. Scalability       → Easy to add subdomains (edge.lifetime.fi, etc.)
10. Finland Pride    → .fi signals Nordic quality/trust

❌ CONS (Mitigated)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Generic name      → Mitigate: Market as "DWS IQ by Lifetime"
2. .fi TLD           → Mitigate: Register dwsiq.com as redirect
3. No AI in name     → Mitigate: Emphasize "AI" in marketing copy
```

### Implementation Timeline with lifetime.fi

| Week | Task | Outcome |
|------|------|---------|
| **Week 1** | Add DNS records for app.lifetime.fi + api.lifetime.fi | Live subdomains |
| **Week 2** | Deploy FastAPI backend to api.lifetime.fi | Agent API operational |
| **Week 3** | Deploy Next.js PWA to app.lifetime.fi | Users can install PWA |
| **Week 4** | Test end-to-end flow | Production-ready |

**Total Time to Production:** 4 weeks (vs. 6-8 weeks with new domain)

---

## 📋 Updated Architecture with lifetime.fi

### URL Structure

```
PRODUCTION URLS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

User-Facing (Frontend)
  https://app.lifetime.fi
  https://app.lifetime.fi/agents          → Agent chat
  https://app.lifetime.fi/projects        → Project dashboard
  https://app.lifetime.fi/analytics       → Analytics

API Endpoints (Backend)
  https://api.lifetime.fi/v1/agent/invoke → Agent invocation
  https://api.lifetime.fi/v1/edge/sync    → Edge device sync
  https://api.lifetime.fi/v1/health       → Health checks
  wss://api.lifetime.fi/v1/stream         → WebSocket

Marketing (Optional)
  https://www.lifetime.fi                 → Company homepage
  https://www.lifetime.fi/dws-iq          → Product page
  https://www.lifetime.fi/blog            → Case studies

Documentation (Optional)
  https://docs.lifetime.fi                → API docs
  https://docs.lifetime.fi/guides         → User guides

Community (Optional)
  https://community.lifetime.fi           → Forums
  https://community.lifetime.fi/kb        → Knowledge base
```

### Environment Variables (Updated)

```bash
# Frontend (.env.production)
NEXT_PUBLIC_API_URL=https://api.lifetime.fi
NEXT_PUBLIC_APP_URL=https://app.lifetime.fi
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...

# Backend (.env.production)
GROQ_API_KEY=gsk_...
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=eyJ...
AWS_IOT_ENDPOINT=your-iot-endpoint.iot.eu-north-1.amazonaws.com
CORS_ORIGINS=https://app.lifetime.fi,https://www.lifetime.fi
```

---

## 💰 Cost Comparison (12 Months)

| Domain Strategy | Domain Cost | DNS Management | SSL Certs | Total Annual |
|-----------------|-------------|----------------|-----------|--------------|
| **lifetime.fi (A)** | €0 (owned) | €0 (Cloud Run) | €0 (auto) | **€0** |
| **dws10 + onelifetime (B)** | €30 (2 domains) | €0 | €0 | **€30** |
| **dwsiq.ai (C)** | €80 (premium) | €0 | €0 | **€80** |
| **Multi-domain (D)** | €110+ (3+ domains) | €0 | €0 | **€110+** |

**Savings with Option A:** €80-110/year + faster deployment

---

## 🚀 Next Steps with lifetime.fi

### Immediate Actions (Week 1)

1. **Verify DNS Access**
   ```bash
   # Check current DNS settings for lifetime.fi
   dig lifetime.fi
   dig www.lifetime.fi

   # Identify DNS provider (Namecheap, GoDaddy, CloudFlare, etc.)
   whois lifetime.fi
   ```

2. **Add DNS Records**
   - Log into DNS provider (e.g., Namecheap, CloudFlare)
   - Add A/AAAA records for app.lifetime.fi → 216.239.32.21
   - Add A/AAAA records for api.lifetime.fi → 216.239.32.21
   - Wait for propagation (usually 5-60 minutes)

3. **Verify DNS Propagation**
   ```bash
   # Check if DNS is live
   dig app.lifetime.fi
   dig api.lifetime.fi

   # Test SSL (after Cloud Run deployment)
   curl -I https://app.lifetime.fi
   ```

4. **Deploy Services**
   ```bash
   # Deploy backend
   gcloud run deploy dwsiq-backend \
     --source=./backend \
     --region=europe-north1

   gcloud run domain-mappings create \
     --service=dwsiq-backend \
     --domain=api.lifetime.fi

   # Deploy frontend
   gcloud run deploy dwsiq-frontend \
     --source=./frontend \
     --region=europe-north1

   gcloud run domain-mappings create \
     --service=dwsiq-frontend \
     --domain=app.lifetime.fi
   ```

### Future Brand Protection (Optional)

Register these domains as redirects to app.lifetime.fi (€15-80/year total):

- **dwsiq.com** → Redirect to app.lifetime.fi
- **dwsiq.ai** → Redirect to app.lifetime.fi
- **dws-platform.com** → Redirect to app.lifetime.fi

This prevents competitors from squatting on your brand names while keeping lifetime.fi as the primary domain.

---

## 🎯 Decision Matrix

Use this to finalize your choice:

| Criteria | Weight | lifetime.fi | dws10+onelifetime | dwsiq.ai |
|----------|--------|-------------|-------------------|----------|
| **Cost** | 20% | 10/10 (€0) | 8/10 (€30/yr) | 6/10 (€80/yr) |
| **Speed to Deploy** | 20% | 10/10 (0 days) | 7/10 (1-2 days) | 4/10 (2-7 days) |
| **Simplicity** | 15% | 10/10 (1 domain) | 5/10 (2 domains) | 9/10 (1 domain) |
| **Brand Clarity** | 15% | 6/10 (generic) | 7/10 (confusing) | 10/10 (clear) |
| **SEO Value** | 10% | 7/10 (existing) | 8/10 (2x existing) | 3/10 (new) |
| **Global Appeal** | 10% | 6/10 (.fi) | 7/10 (.com/.world) | 9/10 (.ai) |
| **Tech Alignment** | 10% | 7/10 (consulting) | 6/10 (mixed) | 10/10 (AI) |
| **Total Score** | 100% | **8.1/10** ✅ | 6.9/10 | 7.0/10 |

**Winner: lifetime.fi (8.1/10)**

---

## 📝 Conclusion

**RECOMMENDATION: Use lifetime.fi as your primary domain**

### Why?

1. **Zero cost** (already own it)
2. **Fastest deployment** (no domain registration wait)
3. **Simplest architecture** (single domain, multiple subdomains)
4. **Email alignment** (risto@lifetime.fi matches)
5. **Brand consistency** (Lifetime Consulting = established trust)

### Suggested URL Structure

```
app.lifetime.fi      → DWS IQ Platform (PWA for Chromebook)
api.lifetime.fi      → Backend API (agent orchestration)
www.lifetime.fi      → Company homepage (marketing)
community.lifetime.fi → User community (optional)
docs.lifetime.fi     → Documentation (optional)
```

### Optional: Future Brand Protection

- Register **dwsiq.com** + **dwsiq.ai** as redirects (€95/year total)
- Keep lifetime.fi as primary infrastructure
- Market as **"DWS IQ by Lifetime"** to build both brands

---

**Ready to proceed with lifetime.fi?**

Let me know and I'll:
1. Create DNS configuration scripts for your specific registrar
2. Update all architecture documents to use lifetime.fi URLs
3. Update deployment commands with new domain mappings
4. Commit everything to the repository

**OR** if you prefer Option C (new domain like dwsiq.ai), I can pivot the architecture to that instead.

What's your decision? 🚀
