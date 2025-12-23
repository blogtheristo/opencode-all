# Sales Pipeline Agents: Market-Driven Product Development
**From Static Products → Dynamic, Market-Responsive Sales Machine**

---

## Problem Statement

**Current state (broken):**
- ❌ Static e-commerce sites (lifetime.fi/buy, lifetime.fi/osta on Squarespace)
- ❌ Manually managed product pages
- ❌ Products listed on Google Merchant Server (good visibility)
- ❌ **Zero sales** = broken pipeline

**Root causes:**
1. **No feedback loop:** Market signals (impressions, clicks, searches) don't inform product development
2. **Static vs dynamic disconnect:** Development happens in GitHub, sales happens separately on Squarespace
3. **No iteration:** Can't test pricing, messaging, features based on what customers actually want
4. **Manual updates:** Product pages lag behind development progress

**The insight:**
> Products should be **dynamic reflections** of development status + market demand, not static catalogs.

---

## Solution: 2 New DWS Team Agents + Automated Workflows

### Agent 6: Market Signal Agent 📈

**Role:** Market intelligence & demand detection

**Responsibilities:**
- Monitors Google Merchant Server analytics (impressions, clicks, CTR)
- Tracks search queries (what terms bring people to products)
- Identifies product interest patterns (which products get attention but don't convert)
- Detects pricing sensitivity (do clicks drop at certain price points?)
- Compares competitor products (what features do they emphasize?)

**Data sources:**
- Google Merchant Center API (product performance)
- Google Search Console (organic search queries)
- Google Analytics (traffic sources, bounce rates)
- Squarespace Analytics (product page views, time on page)

**Outputs (weekly):**
- Market signal report (top searched terms, high-impression/low-conversion products)
- Product opportunity matrix (what to build next based on market demand)
- Pricing recommendations (test price points based on click patterns)
- Messaging insights (what keywords/phrases resonate)

**Example insights:**
```
WEEK 49 MARKET SIGNALS:

HIGH INTEREST, LOW CONVERSION:
- "DWS6 Construction AI" - 1,200 impressions, 45 clicks (3.75% CTR), 0 purchases
  → Problem: Price too high (€2,000) or unclear value proposition?
  → Action: Test €999 pilot pricing, add ROI calculator to product page

SEARCH QUERY TRENDS:
- "embodied carbon tracking construction" - 340 searches/month, growing 25% MoM
- "AI site monitoring NVIDIA Jetson" - 89 searches/month
  → Opportunity: Create "Embodied Carbon Agent" as standalone product

COMPETITOR ANALYSIS:
- Competitor X emphasizes "no coding required" (mentioned 8x on product page)
  → Action: Add "Deploy in 1 day, no coding" to DWS6 messaging
```

---

### Agent 7: Product Page Generator Agent 🛒

**Role:** Dynamic sales page creation & updating

**Responsibilities:**
- Reads GitHub Projects (development status: MVP 35% → 50% → 100%)
- Reads roadmaps (what's coming: Alpha, V1 features)
- Generates product pages for onelifetime.world and dws10.com
- Updates pages automatically when:
  - Development milestones reached (MVP → Alpha transition)
  - Pricing experiments launched (A/B test €999 vs €1,499)
  - New customer testimonials added
  - Market signals suggest messaging changes

**Technology stack:**
- Static site generator: Hugo or Gatsby (fast, SEO-friendly)
- Headless CMS: Sanity.io or Strapi (for non-technical updates)
- Deployment: Netlify or Vercel (auto-deploy on GitHub push)
- Data sources: GitHub Projects API, roadmap markdown files, customer database

**Page structure (example: DWS6 Construction V1):**

```markdown
# DWS6 Construction: AI Agents for Embodied Carbon Tracking
*Deploy in 1 day. €0 pilot, €999/year production. 2-month payback guaranteed.*

---

## Development Status: [LIVE - Automatically Updated]

**MVP Phase:** 58% complete (25/43 tasks done)
**Latest update:** Dec 6, 2025 - Customer Satisfaction Agent deployed
**Next milestone:** 5 pilot customers onboarded by Dec 20

[View live roadmap →](https://github.com/blogtheristo/dws6/projects/1)

---

## What You Get Today (MVP - FREE Pilot)

✅ **Customer Satisfaction Agent**
- NPS tracking, churn prediction
- Deployed: Dec 3, 2025
- Status: Production ready

✅ **Viability Agent**
- Financial payback calculator (target: ≤2 months)
- Deployed: Dec 5, 2025
- Status: Production ready

🚧 **Coming in Alpha Phase (Mar 2026):**
- Deal Flow Agent (lead scoring)
- Desirability Agent (feature prioritization)
- 20-50 customer capacity

[See full roadmap →](docs/roadmaps/)

---

## Pricing [LIVE - Based on Market Signals]

**FREE Pilot (Dec 2025 - Feb 2026):**
- 2 agents (Customer Sat + Viability)
- 30 days, 5 customers max
- €0 cost (100% free tier)
- **Apply now →** [Pilot signup form]

**Production (Mar 2026+):**
- ~~€2,000/year~~ **€999/year** (early adopter pricing)
- 8 agents, unlimited customers
- Payback guarantee: ≤2 months or refund
- **Reserve your spot →** [Waitlist form]

💡 **Why the discount?** Market research shows price sensitivity at €2K. Testing €999 to hit 2-month payback threshold for SMEs.

---

## Customer Validation [LIVE - Real Testimonials]

> "We saved 15 hours/week on manual customer health checks. Paid for itself in 6 weeks."
> — **Customer A**, Construction SME (Helsinki)

**Current customers:** 2/5 pilots onboarded
**NPS score:** 45 (excellent for pilot phase)
**Churn rate:** 0%

[Read case studies →](docs/case-studies/)

---

## ROI Calculator [Interactive - Based on Your Data]

**Input your numbers:**
- Manual hours spent on customer tracking: [___] hours/week
- Hourly labor cost: €[___]/hour
- Setup investment: €999

**Your payback period:** X.X months
**Your annual savings:** €X,XXX

[Calculate ROI →](tools/roi-calculator)

---

## Why DWS6 vs Alternatives?

| Feature | DWS6 | Atlassian Rovo | SAP |
|---------|------|----------------|-----|
| **Price** | €999/year | €16,800/year | €50K+/year |
| **Setup time** | 1 day | 2 weeks | 3 months |
| **Edge AI** | ✅ (NVIDIA Jetson) | ❌ | ❌ |
| **Construction-specific** | ✅ | ❌ | ❌ |
| **Embodied carbon tracking** | ✅ | ❌ | ❌ |

[Compare features →](compare)

---

## What Happens Next?

1. **Apply for FREE pilot** (30 sec form)
2. **Onboarding call** (30 min, we set up your agents)
3. **Go live in 1 day** (we deploy to Cloud Run)
4. **30 days FREE trial** (no credit card, no commitment)
5. **Decide** (convert to paid or cancel, no hard feelings)

[Start FREE pilot →](https://forms.gle/...)

---

## Development Transparency

**Live updates from GitHub:**
- [Kanban board](https://github.com/blogtheristo/dws6/projects/1) (see what we're building)
- [Weekly reports](docs/Reports/en/) (costs, progress, customer feedback)
- [Roadmap](docs/roadmaps/ROADMAP_MVP.md) (what's coming)

**This product is built in public.** You can watch progress in real-time.

---

## Questions?

**Email:** risto@lifetime.fi
**LinkedIn:** [Risto Anton Päärni](https://linkedin.com/in/ristopaarni)
**Book a call:** [cal.com/ristopaarni](https://cal.com/ristopaarni)

---

*Last updated: Dec 6, 2025 (auto-generated by Product Page Generator Agent)*
*Development status: MVP 58% complete*
*Next update: Dec 13, 2025*
```

**Key features:**
1. **Live development status** (auto-updates from GitHub Projects)
2. **Dynamic pricing** (changes based on Market Signal Agent recommendations)
3. **Real testimonials** (auto-added when customer gives permission)
4. **Transparent roadmap** (links directly to GitHub)
5. **ROI calculator** (interactive tool based on real cost model)

---

## Automated Workflows

### Workflow 1: Market Signal → Product Update

**Trigger:** Market Signal Agent detects high-interest product

```yaml
workflow:
  name: "high-interest-product-detected"
  trigger:
    - agent: "market-signal"
      condition: "impressions > 1000 AND clicks > 50 AND conversions == 0"

  steps:
    1. Market Signal Agent generates insight report
    2. Product & Reporting Agent adds to weekly report
    3. Architect Agent evaluates: Can we build this with existing infrastructure?
    4. Builder Agent estimates: How long to implement?
    5. Product Page Generator creates landing page for waitlist
    6. DevOps Agent deploys landing page to onelifetime.world
    7. Market Signal Agent monitors waitlist signups

  output:
    - New product opportunity in backlog
    - Landing page live for demand validation
    - Weekly report updated with market insight
```

**Example (real scenario):**
```
WEEK 49 SIGNAL:
- Search query: "embodied carbon tracking construction" (340 searches/month)
- Current product: DWS6 Construction (2 agents: Customer Sat + Viability)
- Gap: No dedicated "Embodied Carbon Agent"

ACTIONS TAKEN:
1. Market Signal Agent flags opportunity
2. Architect Agent confirms: Can build with existing Groq API + Cloud Run
3. Builder Agent estimates: 8 hours to implement
4. Product Page Generator creates: lifetime.fi/embodied-carbon-agent (landing page)
5. Landing page goes live with waitlist form
6. Market Signal Agent tracks: 45 signups in Week 1 → VALIDATED DEMAND
7. Builder Agent implements Embodied Carbon Agent in Week 2
8. Product Page Generator updates page: "Now available in Alpha"
```

---

### Workflow 2: Development Milestone → Product Page Update

**Trigger:** GitHub Projects task moves to "Done"

```yaml
workflow:
  name: "development-milestone-reached"
  trigger:
    - source: "github-projects"
      event: "task-completed"
      project: "DWS6 Construction V1"

  steps:
    1. GitHub webhook notifies Product Page Generator Agent
    2. Agent recalculates completion % (e.g., 35% → 42%)
    3. Agent updates product page section "Development Status"
    4. Agent regenerates static site (Hugo build)
    5. DevOps Agent deploys to onelifetime.world (auto via Netlify)
    6. Product & Reporting Agent logs in weekly report

  output:
    - Product page shows latest development status
    - Customers see real-time progress
    - Builds trust (transparency)
```

**Example:**
```
TASK COMPLETED: "Deploy Groq API router to Cloud Run"
→ Product page auto-updates:

  Before:
  "MVP Phase: 35% complete (15/43 tasks done)"
  "Latest update: Dec 3, 2025"

  After (5 min later):
  "MVP Phase: 42% complete (18/43 tasks done)"
  "Latest update: Dec 6, 2025 - Groq API router deployed"
```

---

### Workflow 3: Pricing Experiment → A/B Test

**Trigger:** Market Signal Agent recommends price change

```yaml
workflow:
  name: "pricing-experiment"
  trigger:
    - agent: "market-signal"
      condition: "low-conversion AND high-clicks"
      recommendation: "test-lower-price"

  steps:
    1. Market Signal Agent proposes experiment: "Test €999 vs €1,499"
    2. Product Page Generator creates 2 versions (A/B test)
    3. DevOps Agent deploys via Netlify (50/50 traffic split)
    4. Market Signal Agent tracks conversions for 7 days
    5. Product & Reporting Agent analyzes results
    6. Winner becomes default price

  output:
    - Data-driven pricing decision
    - Conversion rate improvement
    - Documented in weekly report
```

**Example:**
```
WEEK 48: 1,200 impressions, 45 clicks (3.75% CTR), 0 conversions at €2,000
→ Market Signal Agent recommends: "Price too high, test €999"

WEEK 49: A/B test deployed
- Version A (€2,000): 600 impressions, 22 clicks, 0 conversions (0% CVR)
- Version B (€999): 600 impressions, 23 clicks, 3 conversions (13% CVR)

RESULT: €999 pricing wins, becomes default
IMPACT: €2,997 revenue in Week 49 vs €0 in Week 48
```

---

## Technical Implementation

### Phase 1: Manual (Week 1-2)

**Goal:** Prove the concept manually before automating

**Week 1 tasks:**
1. ✅ Set up Google Merchant Center API access
2. ✅ Create Hugo static site for onelifetime.world
3. ✅ Write first product page (DWS6 Construction V1)
4. ✅ Manually update with GitHub Projects data
5. ✅ Deploy to Netlify

**Week 2 tasks:**
1. ✅ Pull Google Merchant analytics manually
2. ✅ Identify 1 high-interest, low-conversion product
3. ✅ Update product page with new messaging
4. ✅ Track: Did conversions improve?

**Time:** ~10 hours/week (manual data collection + page updates)

---

### Phase 2: Semi-Automated (Week 3-4)

**Goal:** Automate data fetching, manual analysis

**Automation:**
1. Python script fetches Google Merchant data daily
2. Python script fetches GitHub Projects data (completion %)
3. Script populates product page template
4. Hugo regenerates static site
5. Netlify auto-deploys on Git push

**Manual work:**
- Review Market Signal Agent report (weekly)
- Decide pricing experiments (weekly)
- Write new product descriptions (as needed)

**Time:** ~3 hours/week

---

### Phase 3: Fully Automated (Month 2+)

**Goal:** Agents handle everything, you approve

**Automation:**
1. Market Signal Agent runs daily, generates insights
2. Product Page Generator updates pages automatically
3. GitHub Actions triggers Hugo build on roadmap changes
4. A/B testing framework auto-experiments pricing
5. Product & Reporting Agent summarizes in weekly report

**Manual work:**
- Review weekly report (15 min)
- Approve major changes (pricing, new products)

**Time:** ~30 min/week

---

## Technology Stack

### Data Sources
- **Google Merchant Center API:** Product impressions, clicks, conversions
- **Google Search Console API:** Organic search queries
- **Google Analytics 4:** Traffic sources, user behavior
- **GitHub Projects API:** Development status, completion %
- **Supabase:** Customer testimonials, NPS scores

### Page Generation
- **Hugo:** Static site generator (fast, SEO-friendly)
- **Tailwind CSS:** Styling (responsive, modern)
- **Alpine.js:** Interactivity (ROI calculator, forms)
- **Netlify:** Hosting + auto-deploy on Git push

### Automation
- **Python scripts:** Data fetching, template population
- **GitHub Actions:** CI/CD (build + deploy on push)
- **Netlify Functions:** Serverless API endpoints (form submissions)
- **Zapier/Make:** Workflow orchestration (optional for Phase 3)

### Agents
- **Market Signal Agent:** Claude Sonnet (complex analysis)
- **Product Page Generator:** Groq Llama 3.1 70B (fast text generation)

---

## Week 1 Implementation Plan (Dec 2-8)

### Monday Dec 2: Setup (3 hours)

**1. Google Merchant Center API access** (30 min)
```bash
# Enable API in Google Cloud Console
gcloud services enable content.googleapis.com

# Create service account, download JSON key
gcloud iam service-accounts create merchant-api-reader

# Grant permissions in Merchant Center
# (Settings → Users → Add service account email)
```

**2. Create Hugo site for onelifetime.world** (1 hour)
```bash
# Install Hugo
brew install hugo  # or apt-get install hugo

# Create new site
hugo new site onelifetime-world
cd onelifetime-world

# Add theme (e.g., PaperMod for clean, fast design)
git submodule add https://github.com/adityatelange/hugo-PaperMod themes/PaperMod

# Configure (config.toml)
baseURL = "https://onelifetime.world"
theme = "PaperMod"
```

**3. Write first product page** (1.5 hours)
```bash
# Create product page
hugo new products/dws6-construction.md

# Content (see template above)
# - Development status (link to GitHub Projects)
# - Pricing (start with €999 pilot pricing)
# - ROI calculator (placeholder for now)
# - Testimonials (use anonymized Customer A quote)
```

---

### Tuesday Dec 3: Deploy & Test (2 hours)

**1. Deploy to Netlify** (30 min)
```bash
# Build site
hugo

# Push to GitHub
git init
git add .
git commit -m "Initial product page: DWS6 Construction V1"
git push origin main

# Connect to Netlify
# - Go to netlify.com
# - "Add new site" → Import from Git
# - Select repo, build command: "hugo", publish dir: "public"
# - Deploy
```

**2. Configure custom domain** (30 min)
```bash
# In Netlify dashboard:
# - Domain settings → Add custom domain: onelifetime.world
# - DNS settings → Point CNAME to Netlify

# In domain registrar (e.g., Namecheap):
# - Add CNAME record: onelifetime.world → [your-site].netlify.app
```

**3. Test & verify** (1 hour)
- Check all links work (GitHub Projects, roadmaps, contact form)
- Test on mobile (responsive design)
- Check page speed (aim for <3s load time)
- Verify SEO basics (title tags, meta descriptions)

---

### Wednesday Dec 4: Google Merchant Integration (3 hours)

**1. Fetch product performance data** (1 hour)
```python
# merchant_analytics.py

from google.oauth2 import service_account
from googleapiclient.discovery import build

SCOPES = ['https://www.googleapis.com/auth/content']
SERVICE_ACCOUNT_FILE = 'merchant-api-key.json'
MERCHANT_ID = 'your-merchant-id'

credentials = service_account.Credentials.from_service_account_file(
    SERVICE_ACCOUNT_FILE, scopes=SCOPES)

service = build('content', 'v2.1', credentials=credentials)

# Get product performance (last 7 days)
request = service.productstatuses().list(merchantId=MERCHANT_ID)
response = request.execute()

for product in response.get('resources', []):
    print(f"Product: {product['title']}")
    print(f"  Impressions: {product.get('impressions', 0)}")
    print(f"  Clicks: {product.get('clicks', 0)}")
    print(f"  CTR: {product.get('ctr', 0):.2%}")
```

**2. Analyze top products** (1 hour)
```python
# Sort by impressions, identify high-interest/low-conversion
products_sorted = sorted(response['resources'],
                        key=lambda x: x.get('impressions', 0),
                        reverse=True)

for p in products_sorted[:5]:
    impressions = p.get('impressions', 0)
    clicks = p.get('clicks', 0)
    conversions = p.get('conversions', 0)

    if impressions > 500 and clicks > 20 and conversions == 0:
        print(f"🚨 HIGH INTEREST, ZERO CONVERSIONS: {p['title']}")
        print(f"   → Action: Review pricing or messaging")
```

**3. Document insights** (1 hour)
```bash
# Create docs/market-signals/week-49.md

## Week 49 Market Signals (Dec 2-8)

### High Interest, Low Conversion
- **DWS6 Construction AI**: 1,200 impressions, 45 clicks, 0 conversions
  - Hypothesis: Price too high (€2,000)
  - Action: Test €999 pilot pricing

### Search Query Trends
- "embodied carbon tracking construction": 340 searches/month (+25% MoM)
- "AI site monitoring": 89 searches/month

### Recommended Actions
1. Lower DWS6 price to €999 (test for 2 weeks)
2. Create landing page for "Embodied Carbon Agent" (validate demand)
3. Emphasize "no coding required" in messaging (competitor insight)
```

---

### Thursday Dec 5: Update Product Page (2 hours)

**1. Implement pricing change** (30 min)
```markdown
# products/dws6-construction.md

## Pricing

**FREE Pilot:**
- €0 cost, 30 days
- [Apply now →]

**Production:**
- ~~€2,000/year~~ **€999/year** (50% launch discount)
- Payback guarantee: ≤2 months
- [Reserve spot →]

💡 **Limited to first 50 customers at this price.**
```

**2. Add market signal insight** (30 min)
```markdown
## Why We're Offering This Discount

We analyzed 1,200+ product page visits and found price sensitivity at €2K for construction SMEs.

Our data shows 2-month payback at €999 pricing hits the sweet spot for early adopters.

**This is a data-driven decision, not desperation pricing.**

[See our market research →](docs/market-signals/week-49.md)
```

**3. Deploy & measure** (1 hour)
```bash
# Commit changes
git add products/dws6-construction.md
git commit -m "Update pricing: €2,000 → €999 based on market signals"
git push

# Netlify auto-deploys in ~2 minutes

# Set up conversion tracking
# - Google Analytics: Create goal for form submission
# - Track: Did conversions improve with new pricing?
```

---

### Friday Dec 6: Weekly Report (2 hours)

**1. Generate Market Signal section** (1 hour)
```markdown
# docs/Reports/en/2025-W49.md

## 6. Market Signals (NEW SECTION)

### Google Merchant Performance

| Product | Impressions | Clicks | CTR | Conversions | CVR |
|---------|-------------|--------|-----|-------------|-----|
| DWS6 Construction | 1,200 | 45 | 3.75% | 0 | 0% |
| SiteSense Edge AI | 340 | 12 | 3.53% | 0 | 0% |

### Actions Taken This Week

1. **Pricing experiment:** Lowered DWS6 from €2,000 → €999
   - Hypothesis: Price sensitivity preventing conversions
   - Test duration: 2 weeks
   - Success metric: ≥1 conversion

2. **Messaging update:** Added "Deploy in 1 day, no coding"
   - Based on competitor analysis (Competitor X emphasizes ease)
   - Location: Product page headline

3. **Demand validation:** Created landing page for "Embodied Carbon Agent"
   - Search volume: 340/month (+25% MoM)
   - Goal: 20 waitlist signups in 2 weeks

### Next Week Focus

- Monitor DWS6 conversions (target: 1+ with new pricing)
- Track Embodied Carbon Agent waitlist (target: 10 signups)
- Interview 2 pilot customers (understand why they signed up)
```

**2. Share with stakeholders** (30 min)
- Email to investors (include market signal insights)
- Post in Slack (#dws6-weekly-reports)
- Send to Metropolia supervisor

**3. Retrospective** (30 min)
```markdown
# Week 49 Learnings

**What worked:**
- Google Merchant data revealed clear problem (high interest, zero conversions)
- Data-driven pricing decision (not guessing)
- Fast iteration (insight → page update → deploy in 24 hours)

**What didn't work:**
- Still zero conversions (need more time to test €999 pricing)

**Next week improvements:**
- Add social proof (customer testimonials on product page)
- Create video demo (some visitors may not understand what product does)
- Test different CTAs ("Start FREE pilot" vs "Book a demo")
```

---

## Success Metrics

### Week 1 Goals (Dec 2-8)
- ✅ Product page live on onelifetime.world
- ✅ Google Merchant data integrated
- ✅ First market signal report generated
- ✅ Pricing experiment launched (€2,000 → €999)
- 🎯 Target: 1 conversion with new pricing

### Month 1 Goals (Dec 2025)
- 🎯 3+ conversions (€2,997 revenue)
- 🎯 5 pilot customers onboarded
- 🎯 10+ waitlist signups for new product (Embodied Carbon Agent)
- 🎯 <30% bounce rate on product pages
- 🎯 Weekly market signal reports published

### Month 3 Goals (Feb 2026)
- 🎯 €10K+ revenue (10 customers @ €999)
- 🎯 50%+ conversion rate improvement (vs static Squarespace pages)
- 🎯 2+ new products validated via landing page experiments
- 🎯 Market Signal Agent fully automated (daily reports)

---

## Integration with Thesis

**New research questions:**
1. How do dynamic product pages (reflecting real dev status) impact conversion rates vs static pages?
2. What market signals (impressions, clicks, searches) predict product-market fit?
3. Can automated market signal → product update workflows accelerate PMF discovery?

**Data collection:**
- A/B test results (static vs dynamic pages, pricing experiments)
- Market signal reports (12 weeks of Google Merchant data)
- Conversion funnel analysis (where do visitors drop off?)

**Thesis contributions:**
- **Market-Driven Development Framework:** How to use market signals to prioritize product roadmap
- **Dynamic Product Page Model:** Template for auto-updating sales pages based on GitHub development status
- **Lean Sales Pipeline:** €0 cost sales automation using free-tier tools (Hugo, Netlify, Google APIs)

---

## Next Steps

**Monday Dec 2:**
- [ ] Set up Google Merchant Center API access
- [ ] Create Hugo site for onelifetime.world
- [ ] Write first product page (DWS6 Construction V1)

**Tuesday Dec 3:**
- [ ] Deploy to Netlify
- [ ] Configure custom domain (onelifetime.world)
- [ ] Test on mobile + desktop

**Wednesday Dec 4:**
- [ ] Fetch Google Merchant data (Python script)
- [ ] Analyze top products (identify high-interest/low-conversion)
- [ ] Document insights (market signal report)

**Thursday Dec 5:**
- [ ] Update product page (implement pricing change)
- [ ] Add market signal insight (transparency)
- [ ] Deploy & set up conversion tracking

**Friday Dec 6:**
- [ ] Generate weekly report (include market signals section)
- [ ] Share with investors, Metropolia
- [ ] Retrospective (what worked, what didn't)

---

**Document Status:** v1.0
**Last Updated:** December 3, 2025
**Owner:** Risto Anton Päärni
**Next Review:** After Week 1 (Dec 9, 2025)
