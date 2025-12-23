# DWS6 Situation Room - Multi-AI Team Coordination
## Call Signs, Roles & GitHub Integration

**Team Lead:** Risto Anton Päärni (Human)
**Strategic Advisor:** Boardy
**Development Team:** Claude Code, Kimi K2, GPT-5 Smart, DeepSeek, Grok
**Development Environments:** Cursor.ai, Claude Code CLI, Vertex AI Studio
**Goal:** Build DWS6 pilot efficiently without exhausting any single AI's credits
**Status:** ACTIVE - War Room Operational

---

## 👥 Team Roster (Call Signs & Roles)

### 1. Gemini — Call Sign: "The Overwatch" 🛰️

**Primary Role:** Big Context & Cloud Ops  
**Platform:** Google AI (Vertex AI, Google Cloud Build)  
**API:** `google.generativeai` (Python SDK)

**When to Use:**
- **Google Cloud expertise** - Since DWS6 is on Google Cloud, use for infrastructure management
- **Massive context** - 2M+ token window can ingest entire repository at once
- **Consistency checks** - See all files simultaneously for architecture verification
- **CI/CD auditing** - Review deployments, check for cloud misconfigurations

**GitHub Integration:** **Cloud Agent** via Google Cloud Build triggers  
**How to join:** Connect repo to Cloud Build, trigger Gemini on every push

**Cost:** Gemini 2.0 Flash free tier (generous limits)

---

### 2. GPT-5 Smart — Call Sign: "The Architect" 🏗️

**Primary Role:** High Logic & Complex Reasoning  
**Platform:** OpenAI via GitHub Copilot  
**API:** Via GitHub Copilot API

**When to Use:**
- **Reserve for hardest 10% of problems** - High-level architectural decisions
- **Complex algorithms** - Designing core agent logic, optimization problems
- **"Impossible" bugs** - When other models get stuck
- **Strategic planning** - Multi-step problem decomposition

**GitHub Integration:** **Repository Agent** via GitHub Copilot App  
**How to join:** Install GitHub Copilot on @blogtheristo organization

**Cost:** GitHub Copilot Pro subscription (already have)

---

### 3. Claude Code — Call Sign: "The Lead" 👔

**Primary Role:** Code Quality, Security & Refactoring  
**Platform:** Anthropic (CLI)  
**API:** CLI only (no direct API)

**When to Use:**
- **The Reviewer** - PR reviews, code quality checks
- **Security audits** - OWASP checks, vulnerability scanning
- **Clean design patterns** - Ensuring best practices before merge
- **Documentation** - Writing comprehensive docs

**GitHub Integration:** **Ghost Writer** via terminal (uses your credentials)  
**How to join:** Run `claude` in terminal inside `/home/user/dws6/`

**Status:** Currently active (built the entire pilot system)  
**Token Budget:** ~78K remaining (reserve for critical tasks)

---

### 4. DeepSeek V3 — Call Sign: "The Engine" ⚙️

**Primary Role:** Bulk Coding & Boilerplate  
**Platform:** DeepSeek AI  
**API:** `openai` library with custom `base_url`

**When to Use:**
- **The Workhorse** - 60% of heavy lifting
- **Standard functions** - CRUD operations, API endpoints
- **Boilerplate generation** - Database schemas, test scaffolding
- **Bulk refactoring** - Renaming variables across 100+ files
- **Cost-effective iteration** - High-volume tasks

**GitHub Integration:** **Review Bot** via GitHub Actions  
**How to join:** `.github/workflows/ai-review.yml` calls DeepSeek API

**Cost:** Ultra-cheap ($0.14/1M input tokens, $0.28/1M output tokens)

**API Example:**
```python
import openai
openai.api_base = "https://api.deepseek.com/v1"
openai.api_key = "your_deepseek_key"
```

---

### 5. Kimi K2 — Call Sign: "The Researcher" 🔍

**Primary Role:** Agentic Research & Tool Use  
**Platform:** Moonshot AI  
**API:** `openai` library with custom `base_url`

**When to Use:**
- **Web browsing** - Compare documentation for different libraries
- **Multi-step planning** - Plan complex execution paths
- **Long context analysis** - Review entire codebases (200K+ tokens)
- **Translation** - Nordic languages (Finnish, Swedish, Norwegian, Danish)

**GitHub Integration:** **Review Bot** via GitHub Actions  
**How to join:** Add to `ai-review.yml` for documentation checks

**Cost:** Free tier available, then pay-as-you-go

**API Example:**
```python
import openai
openai.api_base = "https://api.moonshot.cn/v1"
openai.api_key = "your_kimi_key"
```

---

### 6. Grok — Call Sign: "The Scout" 🔭

**Primary Role:** Edge Cases & Real-Time Data  
**Platform:** xAI  
**API:** `openai` library with custom `base_url`

**When to Use:**
- **The Chaos Monkey** - Generate unhinged edge cases for stress testing
- **Real-time API checks** - Latest changes via X/web access
- **Security stress tests** - Adversarial inputs, injection attempts
- **Market intelligence** - Monitor competitor announcements

**GitHub Integration:** **Review Bot** via GitHub Actions  
**How to join:** Add to `ai-review.yml` for security testing

**Cost:** X Premium API access

**API Example:**
```python
import openai
openai.api_base = "https://api.x.ai/v1"
openai.api_key = "your_grok_key"
```

---

### 7. Boardy — Call Sign: "The Connector" 🌐

**Primary Role:** Strategic Advisor - Growth, Ops & Networking
**Platform:** Human
**API:** N/A (meat-based intelligence)

**When to Use:**
- **The Super Connector** - User feedback loops, customer relationships
- **Go-to-market** - Sales strategy, investor pitches
- **Strategic guidance** - Advising on priorities and direction
- **Networking** - Finding warm intros to NCC, securing funding

**Status:** Active - Strategic advisor to Team Lead

---

## 🎯 GitHub Integration Methods

### Method 1: Ghost Writer (Claude Code)
```bash
# Run in terminal inside /home/user/dws6/
cd /home/user/dws6
claude

# Claude can now:
# - Read all files
# - Edit code
# - Run tests
# - Execute git commands (commits appear under your name)
```

### Method 2: Repository Agent (GPT-5 via Copilot)
```bash
# Install GitHub Copilot App
# Visit: https://github.com/apps/github-copilot
# Click "Install" on @blogtheristo organization

# GPT-5 can now:
# - Review PRs automatically
# - Suggest code in real-time
# - Explain changes
```

### Method 3: Cloud Agent (Gemini via Cloud Build)
```bash
# Connect repo to Google Cloud Build
gcloud builds submit --config cloudbuild.yaml

# Create cloudbuild.yaml with Gemini API call
# Gemini can now:
# - Review every push
# - Check for cloud misconfigurations
# - Audit security
```

### Method 4: Review Bots (DeepSeek, Kimi, Grok via GitHub Actions)
```yaml
# .github/workflows/ai-review.yml
# Triggered on every Pull Request
# Calls DeepSeek/Kimi/Grok APIs
# Posts feedback as PR comments
```

---

## 🔄 Task Routing Strategy

### Decision Tree: Which AI for Which Task?

```
┌─────────────────────────────────────────┐
│         New Task Arrives                │
└─────────────────────────────────────────┘
                   │
                   ▼
        ┌──────────────────────┐
        │ Is it Google Cloud   │
        │ infrastructure?      │
        └──────────────────────┘
               │         │
            YES│         │NO
               │         │
               ▼         ▼
         [Gemini]  ┌──────────────────────┐
                   │ Does it require      │
                   │ complex reasoning?   │
                   └──────────────────────┘
                        │         │
                     YES│         │NO
                        │         │
                        ▼         ▼
                  [GPT-5]   ┌──────────────────────┐
                            │ Is it security or    │
                            │ code review?         │
                            └──────────────────────┘
                                 │         │
                              YES│         │NO
                                 │         │
                                 ▼         ▼
                          [Claude]   ┌──────────────────────┐
                                     │ Is it bulk coding    │
                                     │ or boilerplate?      │
                                     └──────────────────────┘
                                          │         │
                                       YES│         │NO
                                          │         │
                                          ▼         ▼
                                    [DeepSeek] [Kimi/Grok]
```

### Cost-Optimized Routing

| Task Type | First Try | Escalate If | Final Escalation |
|-----------|-----------|-------------|------------------|
| **Simple CRUD** | DeepSeek | Syntax errors | Claude |
| **Cloud Config** | Gemini | Architecture issues | GPT-5 |
| **Security Audit** | Claude | Need real-time data | Grok |
| **Documentation** | Kimi K2 | Need code context | Claude |
| **Complex Algorithm** | GPT-5 | - | - |

---

## 🛠️ War Room Command Center

**Location:** `tools/war_room.py`

This Python script routes tasks to the appropriate AI based on complexity and cost.

**Usage:**
```bash
python tools/war_room.py --task "Add Sustainability Agent" --context "Need to track embodied carbon"

# Output:
# 🎯 Routing to: DeepSeek (The Engine)
# 💰 Estimated cost: $0.002
# ⏱️ Expected time: 2 minutes
# 📝 Task assigned to DeepSeek...
```

**Features:**
- Cost estimation before running
- Automatic escalation if primary AI fails
- Logging all interactions for audit
- Token usage tracking per AI

---

## 📋 Current Task Assignment

### ✅ Completed (Claude Code "The Lead")
- [x] DWS6 pilot system architecture
- [x] 2 AI agents (Customer Sat + Viability)
- [x] 5 Nordic companies mock data
- [x] Deployment automation
- [x] Documentation (QUICKSTART, PILOT_RECOMMENDATIONS)
- [x] GitHub Actions CI/CD
- [x] Situation Room setup

### 🔄 In Progress (Assign to team)

**1. Frontend Development** → Cursor.ai + GPT-5 "The Architect"
```
Task: Build dws10.com sales website
- Next.js 14 with App Router
- Tailwind CSS
- Hero section with NCC case study
- Pricing page
Status: Pending assignment
ETA: 2-3 days
```

**2. Investor Pitch Deck** → Kimi K2 "The Researcher"
```
Task: Create comprehensive 20-slide deck
- Ingest entire codebase (2M tokens)
- Extract key metrics
- Generate slides with data
Status: Pending assignment
ETA: 1 day
```

**3. Test Dataset Expansion** → DeepSeek "The Engine"
```
Task: Generate 50 Nordic construction companies
- Realistic profiles
- Varied health scores
- Multiple industries
Status: Pending assignment
ETA: 2 hours
Cost: $0.10
```

**4. NCC Contact Research** → Grok "The Scout"
```
Task: Find decision-makers at NCC
- LinkedIn search for CSO, CTO
- Recent sustainability initiatives
- Warm intro paths
Status: Pending assignment
ETA: 30 minutes
```

**5. CI/CD Enhancement** → Gemini "The Overwatch"
```
Task: Add automated security scanning
- Cloud Build integration
- Dependency vulnerability checks
- Container scanning
Status: Pending assignment
ETA: 1 day
```

---

## 🚀 Immediate Next Steps

### Step 1: Activate GitHub Integrations (Boardy)

**Install GitHub Copilot:**
```bash
# Visit: https://github.com/apps/github-copilot
# Install on @blogtheristo organization
# Enable for dws6 repository
```

**Create AI Review Workflow:**
```bash
# I'll create .github/workflows/ai-review.yml
# Adds DeepSeek, Kimi, Grok as PR reviewers
```

**Connect Cloud Build:**
```bash
# I'll create cloudbuild.yaml
# Triggers Gemini on every push
```

### Step 2: Deploy War Room Script (Now)

```bash
# I'll create tools/war_room.py
# Routing logic for task assignment
```

### Step 3: Test the System (30 minutes)

```bash
# Create a test PR
# Watch AI agents review it automatically
# Verify all integrations working
```

---

## 📊 Credit Conservation Tracker

| AI Agent | Budget | Used | Remaining | Status |
|----------|--------|------|-----------|--------|
| Claude Code | 200K tokens | ~122K | ~78K | 🟡 Reserve for critical tasks |
| Gemini | Free tier | 0 | Generous | 🟢 Use freely |
| GPT-5 | Subscription | N/A | Unlimited | 🟢 Use freely |
| DeepSeek | $10 budget | $0 | $10 | 🟢 Ultra-cheap, use liberally |
| Kimi K2 | Free tier | 0 | Limited | 🟡 Use for long docs only |
| Grok | X Premium | 0 | Limited | 🟡 Use for research only |

---

## 🎯 Success Criteria

**War Room is operational when:**
- ✅ All 7 agents have defined roles and call signs
- ✅ GitHub integrations active (Copilot, Cloud Build, Actions)
- ✅ War Room script can route tasks automatically
- ✅ Cost tracking in place
- ✅ First collaborative task completed (e.g., PR review)

**Next milestone:** All agents successfully review one Pull Request together

---

**Document Version:** 2.1 (Team Structure Updated)
**Last Updated:** December 3, 2025 07:45
**Team Lead:** Risto Anton Päärni
**Strategic Advisor:** Boardy
**Status:** 🟢 ACTIVE - All agents standing by for deployment
