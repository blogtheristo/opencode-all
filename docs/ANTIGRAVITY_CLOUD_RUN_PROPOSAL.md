# Google Antigravity + Cloud Run Serverless Setup Proposal

**Version:** 1.0
**Date:** 2026-02-12
**Author:** Lifetime Oy - DWS IQ Engineering
**Status:** SUPERSEDED — resolved differently than proposed, see note below

---

> **Resolution note (added 02.07.2026, Claude Code claude-sonnet-5, session `claude/tokenization-economy-ai-moat-zwfrr8`):** This proposal sat as "AWAITING REVIEW" for ~5 months and was never formally approved as written. What actually shipped, by 19.06.2026, is narrower and more disciplined than the broad dws6.com-frontend-on-Cloud-Run + full `gemini-mcp` server this doc argues for: Antigravity is **operational today, scoped strictly to `admin@dws6.com` Google environment tweaks**, via exactly one skill (`gcr-skill`, Cloud Run CI identity bootstrap), running on a Chromebook Plus (`.antigravity/agents/gcr-skill.yaml`, `surface: chromebook-antigravity`). This is now governed policy, not an open question — see `skills/manifest.json` (`antigravityScope`) and `docs/DWS_SKILLS_GUIDE.md` §15 "Antigravity Scope": _"Antigravity is not the general DWS skill runtime... If a skill has no verified Antigravity path, keep it off that surface instead of mirroring it speculatively."_ The rest of this document (gemini-mcp implementation, dws6.com Cloud Run migration, Antigravity-vs-Cursor for general dev work) remains **unresolved and not superseded** — it just never got decided, and is a separate question from the admin-tweaks scope that did ship. Kept below for historical context per the document-formulation-preservation rule; do not treat its "Next Steps"/"Questions for Decision" sections as still-open without re-confirming against current Antigravity 2.0 capabilities (this doc predates the 19.05.2026 Antigravity 2.0 rebuild).
>
> **Second update (same date, Risto):** Cursor — listed below as the "Primary" dev IDE — is currently **on hold**. Treat every "Cursor (Primary)" reference in the architecture diagram and comparisons below (§"Proposed Setup," the risk/mitigation table) as describing the situation at the time of writing (12.02.2026), not the current toolchain. This document's own "Antigravity vs. Cursor" framing (§"Questions for Decision" Q3) is accordingly moot as posed — re-scope that question if/when the gemini-mcp/Cloud-Run items are picked back up.

## Executive Summary

This document proposes integrating **Google Antigravity IDE** with the existing **Google Cloud Run** serverless infrastructure to manage dws6.com deployments and development workflows. This setup addresses two current gaps:

1. **gemini-mcp is referenced but not implemented** (mcp-hub/server.py line 47)
2. **No standardized workflow for dws6.com Cloud Run deployments**

---

## Current State Analysis

### What We Have

#### 1. Google Cloud Run Infrastructure ✅

- **Backend API**: `dws-iq-backend` service deployed via `cloudbuild.yaml`
- **Sales Agents**: Lead Scout + Outreach agents in `AgentFoundry/`
- **Region**: europe-north1 (Finland) for EU data residency
- **Secrets Management**: Google Secret Manager integration
- **CI/CD**: Cloud Build with Artifact Registry

#### 2. Development Tools ✅

- **Primary IDE**: Cursor (currently in use)
- **AI Coordination**: MCP Hub orchestrating multiple agents
- **MCP Servers**: Only Supabase implemented (`mcp-servers/supabase/`)

#### 3. Deployment Strategy ✅

- **Root folders** (dws6.com/, dws10.com/) → Cloudflare Workers (testing)
- **Landing-pages/** → Cloudflare Pages (production)
- **Backend** → Google Cloud Run (production API)

### What's Missing ❌

#### 1. gemini-mcp Server Not Implemented

```python
# mcp-hub/server.py line 47
MCP_SERVERS = {
    "supabase": "http://mcp-supabase:8766",
    "github": os.getenv("GITHUB_MCP_URL", "http://localhost:8767"),
    "gemini": os.getenv("GEMINI_MCP_URL", "http://localhost:8768"),  # ❌ NOT IMPLEMENTED
}
```

**Why it's not used:**

- No actual server implementation in `mcp-servers/gemini/`
- GOOGLE_AI_API_KEY exists in .env but no integration code
- MCP Hub references it but can't connect

#### 2. No Cloud Run Deployment for dws6.com Frontend

- Backend has `cloudbuild.yaml` ✅
- AgentFoundry has `AgentFoundry/cloudbuild.yaml` ✅
- **dws6.com frontend has NO Cloud Run setup** ❌

#### 3. Limited Use of Google AI Capabilities

- Anthropic Claude (primary) ✅
- Groq (fast inference) ✅
- **Google Gemini (API key exists but unused)** ❌

---

## What is Google Antigravity?

**Google Antigravity** is an AI-powered IDE launched November 18, 2025 (alongside Gemini 3 release).

### Key Capabilities

| Feature                     | Description                                                             | Use Case for DWS                                              |
| --------------------------- | ----------------------------------------------------------------------- | ------------------------------------------------------------- |
| **Agent-First Development** | AI agents autonomously plan, execute, and verify complex tasks          | Automate Cloud Run deployments, refactor dws6.com structure   |
| **Dual Interface**          | Editor View (like VS Code) + Manager View (orchestration dashboard)     | Dev team uses Editor, HIL Director uses Manager for oversight |
| **Planning Mode**           | Generates task lists, walkthroughs before execution                     | Review deployment plans before pushing to production          |
| **Fast Mode**               | Instant execution for simple changes                                    | Quick fixes, config updates                                   |
| **Artifacts System**        | Generates verifiable deliverables (screenshots, recordings, task lists) | Audit trail for EU compliance, deployment documentation       |
| **Multi-Model Support**     | Gemini 3 Pro/Flash, Claude Sonnet 4.5, OpenAI models                    | Leverage Gemini for Google Cloud tasks, Claude for reasoning  |
| **Serverless Integration**  | Native support for Cloud Run, Cloud Functions, GCP services             | Direct deployment to europe-north1 Cloud Run                  |

### Pricing

- **Free** for individuals (public preview)
- Generous rate limits on Gemini 3 Pro
- Claude Sonnet 4.5 support included

**Sources:**

- [Google Antigravity Official](https://antigravity.google/)
- [InfoWorld First Look](https://www.infoworld.com/article/4096113/a-first-look-at-googles-new-antigravity-ide.html)
- [Codecademy Setup Guide](https://www.codecademy.com/article/how-to-set-up-and-use-google-antigravity)
- [AI IDE Review 2026](https://leaveit2ai.com/ai-tools/code-development/antigravity)

---

## Proposed Setup: Antigravity + Cloud Run for dws6.com

### Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    DEVELOPMENT LAYER                            │
├─────────────────────────────────────────────────────────────────┤
│  Cursor (Primary)          │  Google Antigravity (Cloud Tasks)  │
│  - Complex refactoring     │  - Cloud Run deployments           │
│  - Backend development     │  - GCP infrastructure              │
│  - Database migrations     │  - Serverless functions            │
├─────────────────────────────────────────────────────────────────┤
│                    ORCHESTRATION LAYER                          │
├─────────────────────────────────────────────────────────────────┤
│  MCP Hub (mcp-hub/server.py)                                    │
│  ├─ Supabase MCP    ✅ Implemented                              │
│  ├─ GitHub MCP      ⚠️  Referenced (localhost:8767)            │
│  └─ Gemini MCP      ❌ Missing → TO BE IMPLEMENTED             │
├─────────────────────────────────────────────────────────────────┤
│                    DEPLOYMENT TARGETS                           │
├─────────────────────────────────────────────────────────────────┤
│  Frontend:                                                      │
│  ├─ dws6.com/       → Cloudflare Workers (testing)              │
│  ├─ landing-pages/  → Cloudflare Pages (production)             │
│  └─ dws6.com/       → NEW: Cloud Run (production alternative)  │
│                                                                 │
│  Backend:                                                       │
│  ├─ src/app.ts      → Cloud Run (dws-iq-backend) ✅            │
│  └─ AgentFoundry/   → Cloud Run (sales agents) ✅              │
└─────────────────────────────────────────────────────────────────┘
```

### Implementation Plan

#### Phase 1: Implement gemini-mcp Server (Week 1)

**Objective:** Enable Gemini integration for Google Cloud operations

**Files to Create:**

1. **`mcp-servers/gemini/server.py`**

```python
"""
Gemini MCP Server for Google Cloud Run operations
Integrates with Google AI API for Cloud-native tasks
"""

import os
from fastapi import FastAPI
from google.ai import generativelanguage_v1beta as genai

app = FastAPI(title="Gemini MCP Server")

gemini_client = genai.GenerativeServiceClient(
    api_key=os.getenv("GOOGLE_AI_API_KEY")
)

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "gemini-mcp"}

@app.post("/tools/deploy_cloud_run")
async def deploy_to_cloud_run(service_name: str, image_url: str, region: str = "europe-north1"):
    """
    Deploy service to Google Cloud Run using Gemini for config validation
    """
    # Use Gemini to validate deployment config
    validation_prompt = f"""
    Review this Cloud Run deployment configuration for security and best practices:
    Service: {service_name}
    Image: {image_url}
    Region: {region}

    Check for:
    1. EU data residency compliance (must be europe-north1)
    2. Security misconfigurations
    3. Cost optimization opportunities
    """

    # Call Gemini 3 Pro
    response = gemini_client.generate_content(
        model="models/gemini-3-pro",
        prompt=validation_prompt
    )

    return {
        "validation": response.text,
        "approved": "europe-north1" in region.lower(),
        "service": service_name
    }

@app.post("/tools/generate_cloudbuild")
async def generate_cloudbuild_yaml(project_path: str):
    """
    Generate Cloud Build YAML for project using Gemini
    """
    prompt = f"""
    Generate a Google Cloud Build YAML configuration for deploying a React application to Cloud Run.
    Requirements:
    - Build with Node 20
    - Deploy to europe-north1
    - Use Artifact Registry
    - Include secret management
    - Optimize for cost (scale to zero)
    """

    response = gemini_client.generate_content(
        model="models/gemini-3-flash",  # Fast model for config generation
        prompt=prompt
    )

    return {"yaml_config": response.text}
```

2. **`mcp-servers/gemini/Dockerfile`**

```dockerfile
FROM python:3.11-slim

WORKDIR /app

RUN pip install fastapi uvicorn google-generativeai httpx

COPY server.py .

CMD ["uvicorn", "server:app", "--host", "0.0.0.0", "--port", "8768"]
```

3. **Update `mcp-hub/server.py`** - Change line 47:

```python
# Before
"gemini": os.getenv("GEMINI_MCP_URL", "http://localhost:8768"),

# After
"gemini": os.getenv("GEMINI_MCP_URL", "http://mcp-gemini:8768"),
```

4. **Update `docker-compose.hybrid.yml`** - Add gemini service:

```yaml
services:
  mcp-gemini:
    build: ./mcp-servers/gemini
    ports:
      - "8768:8768"
    environment:
      - GOOGLE_AI_API_KEY=${GOOGLE_AI_API_KEY}
    networks:
      - dws-network
```

**Test:**

```bash
# Start gemini-mcp
docker-compose -f docker-compose.hybrid.yml up -d mcp-gemini

# Test health
curl http://localhost:8768/health

# Expected: {"status":"healthy","service":"gemini-mcp"}
```

---

#### Phase 2: Install Google Antigravity (Week 1)

**Objective:** Set up Antigravity for Cloud Run management tasks

**Steps:**

1. **Download Antigravity**

```bash
# Visit https://antigravity.google/ and download installer
# Or use command line (macOS/Linux):
curl -fsSL https://antigravity.google/install.sh | bash

# Windows:
# Download from https://antigravity.google/download/windows
```

2. **Configure Antigravity for DWS Project**

```bash
# Open Antigravity
antigravity

# In Antigravity:
# 1. File → Open Workspace → /home/user/dws6
# 2. Settings → Model Selection:
#    - Primary: Gemini 3 Pro (for GCP tasks)
#    - Secondary: Claude Sonnet 4.5 (for complex reasoning)
# 3. Extensions → Install "Google Cloud Run" extension
```

3. **Configure GCP Integration**

```bash
# In Antigravity terminal:
gcloud auth application-default login

# Set project
gcloud config set project dws-iq6-production

# Verify access
gcloud run services list --region=europe-north1
```

4. **Create Antigravity Agent Profile**

Create `.antigravity/agents/cloud-run-deployer.yaml`:

```yaml
name: "Cloud Run Deployer"
description: "Deploys dws6.com to Google Cloud Run"
model: "gemini-3-pro"
capabilities:
  - cloud_run_deploy
  - dockerfile_generation
  - cloudbuild_generation
  - secret_management
region: "europe-north1"
project_id: "dws-iq6-production"
```

---

#### Phase 3: Create Cloud Run Setup for dws6.com (Week 2)

**Objective:** Deploy dws6.com frontend to Cloud Run as alternative to Cloudflare

**Files to Create:**

1. **`dws6.com/Dockerfile`**

```dockerfile
# Multi-stage build for React dashboard
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY dws6.com/dashboard/firehorse/v10-react/package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source
COPY dws6.com/dashboard/firehorse/v10-react/ ./

# Build
RUN npm run build

# Production image
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx config for SPA routing
COPY dws6.com/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
```

2. **`dws6.com/nginx.conf`**

```nginx
server {
    listen 8080;
    server_name _;

    root /usr/share/nginx/html;
    index index.html;

    # SPA routing - serve index.html for all routes
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Caching for static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

3. **`dws6.com/cloudbuild.yaml`**

```yaml
# Cloud Build for dws6.com frontend
steps:
  # Build Docker image
  - name: "gcr.io/cloud-builders/docker"
    id: "build-frontend"
    args:
      - "build"
      - "-t"
      - "europe-north1-docker.pkg.dev/${PROJECT_ID}/dws-iq/dws6-frontend:${SHORT_SHA}"
      - "-t"
      - "europe-north1-docker.pkg.dev/${PROJECT_ID}/dws-iq/dws6-frontend:latest"
      - "-f"
      - "dws6.com/Dockerfile"
      - "."
    timeout: "600s"

  # Push to Artifact Registry
  - name: "gcr.io/cloud-builders/docker"
    id: "push-frontend"
    args:
      - "push"
      - "--all-tags"
      - "europe-north1-docker.pkg.dev/${PROJECT_ID}/dws-iq/dws6-frontend"
    timeout: "300s"

  # Deploy to Cloud Run
  - name: "gcr.io/google.com/cloudsdktool/cloud-sdk"
    id: "deploy-frontend"
    entrypoint: "gcloud"
    args:
      - "run"
      - "deploy"
      - "dws6-frontend"
      - "--image=europe-north1-docker.pkg.dev/${PROJECT_ID}/dws-iq/dws6-frontend:${SHORT_SHA}"
      - "--region=europe-north1"
      - "--platform=managed"
      - "--allow-unauthenticated"
      - "--min-instances=0"
      - "--max-instances=10"
      - "--memory=256Mi"
      - "--cpu=1"
      - "--port=8080"
      - "--labels=app=dws6,environment=production"

options:
  machineType: "E2_HIGHCPU_8"
  logging: CLOUD_LOGGING_ONLY

timeout: "1200s"
```

---

#### Phase 4: Antigravity Workflow for Deployments (Week 2)

**Objective:** Use Antigravity to manage Cloud Run deployments

**Antigravity Tasks (Agent-Driven):**

1. **Deploy Frontend to Cloud Run**

```
# In Antigravity Manager View:
1. Create new task: "Deploy dws6.com to Cloud Run"
2. Agent: Cloud Run Deployer (gemini-3-pro)
3. Mode: Planning (review before execution)
4. Artifacts: Generate deployment plan + cost estimate

# Agent will:
- Read dws6.com/cloudbuild.yaml
- Validate configuration
- Generate cost projection
- Create deployment checklist
- Show preview URL after deployment
```

2. **Update Environment Variables**

```
# Task: "Update Cloud Run service environment variables"
# Agent will:
- List current secrets in Secret Manager
- Propose changes
- Generate gcloud command
- Execute with confirmation
```

3. **Monitor Service Health**

```
# Task: "Check Cloud Run service health and logs"
# Agent will:
- Query Cloud Run API
- Fetch recent logs
- Analyze error patterns
- Suggest fixes if issues found
```

---

## Recommended Workflow: Cursor + Antigravity

### When to Use Cursor ✅

- Complex TypeScript/React development
- Database schema migrations
- Backend API development
- Code refactoring
- Local testing

### When to Use Antigravity ✅

- Google Cloud Run deployments
- GCP infrastructure changes
- Secret Manager updates
- Cloud Build configuration
- Cost analysis and optimization
- Multi-service orchestration

### Combined Workflow Example

**Scenario:** Deploy new dws6.com dashboard feature

```
1. CURSOR: Develop feature in dws6.com/dashboard/firehorse/v10-react/
   └─ Write React components
   └─ Test locally (npm run dev)
   └─ Commit to git

2. ANTIGRAVITY: Deploy to Cloud Run
   └─ Open Manager View
   └─ Task: "Deploy dws6.com with new dashboard feature"
   └─ Agent reviews changes
   └─ Agent generates deployment plan
   └─ Review artifacts
   └─ Approve execution
   └─ Agent deploys to Cloud Run
   └─ Agent provides preview URL

3. CURSOR: Verify deployment
   └─ Test preview URL
   └─ Check logs if issues

4. ANTIGRAVITY: Monitor and optimize
   └─ Task: "Analyze dws6-frontend cost and performance"
   └─ Agent reviews metrics
   └─ Agent suggests optimizations
```

---

## Cost Analysis

### Current Setup (Cloudflare Only)

| Service                        | Cost          | Notes                    |
| ------------------------------ | ------------- | ------------------------ |
| **Cloudflare Workers**         | $0-5/month    | Testing only             |
| **Cloudflare Pages**           | Free tier     | Production landing pages |
| **Google Cloud Run (backend)** | ~€10-20/month | dws-iq-backend API       |

### Proposed Setup (Add Cloud Run Frontend)

| Service                           | Cost             | Notes                          |
| --------------------------------- | ---------------- | ------------------------------ |
| **Cloudflare Workers**            | $0-5/month       | Keep for testing               |
| **Cloudflare Pages**              | Free tier        | Keep for landing pages         |
| **Cloud Run (backend)**           | ~€10-20/month    | Existing                       |
| **Cloud Run (dws6.com frontend)** | ~€5-15/month     | NEW: scales to zero, EU-hosted |
| **Antigravity IDE**               | FREE             | Public preview                 |
| **Gemini 3 API calls**            | ~€2-5/month      | Deployment automation only     |
| **TOTAL**                         | **€17-45/month** | +€7-15/month vs current        |

**Benefit:**

- EU data residency for frontend (GDPR)
- Unified deployment pipeline (Cloud Build)
- No Cloudflare Worker limitations
- Direct GCP integration
- Scales to zero when idle

---

## Implementation Checklist

### Phase 1: gemini-mcp Server ⏱️ 3-5 hours

- [ ] Create `mcp-servers/gemini/server.py`
- [ ] Create `mcp-servers/gemini/Dockerfile`
- [ ] Update `docker-compose.hybrid.yml`
- [ ] Update `mcp-hub/server.py`
- [ ] Test gemini-mcp health endpoint
- [ ] Verify MCP Hub can connect

### Phase 2: Antigravity Setup ⏱️ 2-3 hours

- [ ] Download and install Antigravity
- [ ] Configure GCP authentication
- [ ] Create Cloud Run Deployer agent profile
- [ ] Test Gemini 3 Pro connection
- [ ] Install Google Cloud Run extension

### Phase 3: dws6.com Cloud Run Setup ⏱️ 5-8 hours

- [ ] Create `dws6.com/Dockerfile`
- [ ] Create `dws6.com/nginx.conf`
- [ ] Create `dws6.com/cloudbuild.yaml`
- [ ] Test local Docker build
- [ ] Create Artifact Registry repository
- [ ] Deploy to Cloud Run (staging)
- [ ] Configure custom domain
- [ ] Test production deployment

### Phase 4: Antigravity Workflows ⏱️ 2-4 hours

- [ ] Create deployment task templates
- [ ] Document Cursor vs Antigravity decision matrix
- [ ] Train team on Antigravity Manager View
- [ ] Set up monitoring dashboards

**TOTAL TIME ESTIMATE: 12-20 hours (1.5-2.5 working days)**

---

## Risks and Mitigation

### Risk 1: Antigravity Stability (Public Preview)

- **Impact:** Potential bugs or breaking changes
- **Mitigation:** Keep Cursor as primary IDE, use Antigravity only for Cloud tasks
- **Fallback:** Manual gcloud commands documented

### Risk 2: gemini-mcp Integration Complexity

- **Impact:** MCP Hub coordination issues
- **Mitigation:** Implement comprehensive health checks, graceful degradation
- **Fallback:** Direct Gemini API calls from Antigravity

### Risk 3: Cost Overruns

- **Impact:** Cloud Run + Gemini API costs exceed budget
- **Mitigation:** Set budget alerts, min-instances=0, monitor daily
- **Fallback:** Scale back to Cloudflare Workers only

### Risk 4: Team Learning Curve

- **Impact:** Developers unfamiliar with Antigravity
- **Mitigation:** Start with HIL Director only, gradual rollout
- **Fallback:** Cursor remains available for all tasks

---

## Next Steps

### Immediate (This Week)

1. **Review this proposal** with engineering team
2. **Decide:** Proceed with Phase 1 (gemini-mcp)?
3. **Decide:** Install Antigravity for trial (Phase 2)?

### Short-term (Next 2 Weeks)

4. **Implement** gemini-mcp server
5. **Test** Antigravity with simple Cloud Run deployment
6. **Evaluate** cost and developer experience

### Long-term (Next Month)

7. **Deploy** dws6.com to Cloud Run (if evaluation positive)
8. **Document** Cursor + Antigravity workflows
9. **Train** team on new tooling

---

## Questions for Decision

1. **Do we need dws6.com on Cloud Run?** Or is Cloudflare Pages sufficient?
2. **Is gemini-mcp worth the implementation effort?** Or continue with Anthropic/Groq only?
3. **Should Antigravity replace Cursor or complement it?** Team preference?
4. **Budget approval** for +€7-15/month Cloud Run frontend costs?

---

**Document Version:** 1.0
**Last Updated:** 2026-02-12
**Owner:** Lifetime Oy - Engineering
**Status:** AWAITING REVIEW

---

## References

### Google Antigravity Documentation

- [Official Site](https://antigravity.google/)
- [Getting Started Codelab](https://codelabs.developers.google.com/getting-started-google-antigravity)
- [InfoWorld Review](https://www.infoworld.com/article/4096113/a-first-look-at-googles-new-antigravity-ide.html)
- [Codecademy Setup Guide](https://www.codecademy.com/article/how-to-set-up-and-use-google-antigravity)
- [Developer Blog Announcement](https://developers.googleblog.com/build-with-google-antigravity-our-new-agentic-development-platform/)

### Internal Documentation

- [AgentFoundry/GOOGLE_CLOUD_RUN_SETUP.md](/home/user/dws6/AgentFoundry/GOOGLE_CLOUD_RUN_SETUP.md)
- [CLAUDE.md](/home/user/dws6/CLAUDE.md)
- [cloudbuild.yaml](/home/user/dws6/cloudbuild.yaml)
- [mcp-hub/server.py](/home/user/dws6/mcp-hub/server.py)
