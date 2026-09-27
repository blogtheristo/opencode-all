# Agentic Engineering Promises — Four-Question Framework

**Date:** 2026-09-07  
**Author:** Risto Anton Päärni, Founder, CEO · Lifetime Oy  
**Contact:** risto.paarni@lifetime.fi · +358 400 319 010  
**Context:** Standardizing how DWS IQ 6 and Lifetime agents commit to deliverables  
**Status:** Framework v1.0 — Research & Cost Model Published  
**Session:** `claude/agentic-engineering-promises-lppb3t`

---

## Executive Summary

Every agent promise—whether it is a sprint commitment, a customer deliverable, or an internal project milestone—must map to four measurable parameters. Without this clarity, agent commitments become vague intentions rather than engineered outcomes.

**The Four Questions (Finnish originals):**

1. **Paljonko se maksaa?** — What is the full economic cost (agent time, infrastructure, risk, learning)?
2. **Kuka on pätevä?** — Who has the skills, domain knowledge, and authorization to guarantee the outcome?
3. **Kuka sen toteuttaa?** — Which specific agent/person owns execution and accountability?
4. **Mikä on mitattava vaikutus?** — What customer outcome or DWS IQ 6 operational metric proves success?

These questions transform a promise from a narrative into a **contract**—something provable, auditable, and revisable when assumptions change.

---

## 0. Standards & Regulatory Integration

This framework integrates with DWS IQ 6's existing governance layer. Every agent promise must align with:

### Canonical Standards (Always Load First)

- **`DWS_TRUTH_STANDARD.md`** — Single source for costs, roles, scores, canonical facts
- **`DWS_ROLES_REGISTRY.md`** — 25-role taxonomy (R01–R25); map customer buying stage to agent qualification tier

### Domain-Specific Standards (Load by Trigger)

| If promise touches…                                 | Load                            | Reference                                       |
| --------------------------------------------------- | ------------------------------- | ----------------------------------------------- |
| Agent tier, autonomy, tool access, decision logging | `AI_AGENT_GUIDELINES.md` §0–7   | 12 Engineering Discipline Rules; Autonomy Tiers |
| Agent signals, topology, dependencies               | `AGENTS.md`                     | Signal types (READY/COMPLETE/ERROR/BLOCKED)     |
| Security, RLS, secrets, KYA compliance              | `DWS_SECURITY_STANDARD.md`      | Secret egress rules, input validation           |
| Cost tracking, token budgets, Rule 5 audit          | `AI_AGENT_GUIDELINES.md` §6, 12 | Per-task 4K token, per-session 30K budget       |
| Escalation, human override, liability               | `DWS_ROLES_REGISTRY.md`         | R-ID risk ownership by role                     |

### Regulatory Overlay

Every agent promise is subject to:

**EU AI Act (Art. 12–14: Transparency & Accountability)**

- ✅ Art. 12: Technical documentation (agent purpose, training data, performance) → captured in Promise Template §2–5
- ✅ Art. 13: Ledger-Native output (signed journalEntries + lineage) → mandatory for Tier 3–4 agents
- ✅ Art. 14: Human oversight (escalation, override, audit trail) → baked into Implementation patterns

**GDPR + Data Protection**

- ✅ Customer data: read-only via RLS (no writes without explicit contract)
- ✅ Retention: aligned with customer SLA (no indefinite logging)
- ✅ Audit trail: all agent decisions logged and queryable

**NIS2 (Network & Information Security)**

- ✅ Guardrail violations: escalate to risk officer
- ✅ Incident reporting: within 24 hours if customer data accessed

---

## 1. Cost Structure: "Paljonko se maksaa?"

### Dimensions of Agentic Cost

Every agent commitment incurs costs across five layers:

| Layer                | Component                                               | Unit             | Source                         |
| -------------------- | ------------------------------------------------------- | ---------------- | ------------------------------ |
| **LLM Inference**    | Token consumption (prompt + completion)                 | $/million tokens | Cloud provider pricing         |
| **Orchestration**    | Agent coordination, MCP overhead, state tracking        | $/execution hour | DGX Spark rental OR Claude API |
| **Tooling & Data**   | DB queries, API calls, external service integrations    | $/call or $/GB   | Supabase, vendor APIs          |
| **Human Override**   | Escalation loops, review cycles, human intervention     | $/hour           | DWS team billing rates         |
| **Operational Risk** | Guardrail violations, failed attempts, timeout handling | $/incident       | Rollback time + re-run cost    |

### Cost Model Examples

#### Example 1: Simple Customer Query Agent (No Tools)

```
Prompt: "Summarize this 100-page SaaS contract for legal risk."
Agent: LLM-only, no tool access, single-turn

Cost breakdown:
├─ Inference: 25,000 prompt tokens + 8,000 completion tokens
│  └─ Claude Haiku: 25×$0.80 + 8×$2.40 = $39.20
├─ Orchestration: 15 seconds, minimal overhead
│  └─ Claude Code session: ~$0.30
├─ Tooling: None
├─ Human override: Likely needed (10% chance)
│  └─ 30 min legal review escalation = $150
└─ Operational risk: ~$20 (one rerun expected)

TOTAL COST: ~$210 per query
COST PER CUSTOMER: $210 ÷ customers served = variable
BREAK-EVEN MARGIN: Need $300+ customer value to sustain
```

#### Example 2: Compliance Research Agent (Recursive Search + Synthesis)

```
Task: "Find all GDPR compliance requirements for a 50-person SaaS startup selling to EU."
Agent: Multi-step (search → read → classify → synthesize), tool-enabled

Cost breakdown:
├─ Inference: Iterative loops
│  ├─ Planning phase: 8K prompt + 2K completion = $8.80
│  ├─ Research loops (5 loops avg): 40K prompt/loop × 5 + 12K comp = $180
│  ├─ Synthesis: 20K prompt + 15K completion = $54
│  └─ Subtotal: ~$243
├─ Orchestration: 12 minutes agent time
│  └─ DGX Spark rental: 12 min × $0.50/hour = $0.10
├─ Tooling: 5 web searches + 10 DB lookups
│  └─ Perplexity API (5×$0.005) + Supabase (10×$0.0001) = $0.026
├─ Human override: 30% escalation rate
│  └─ 20 min engineer review = $50 × 0.30 = $15
└─ Operational risk: 2 retries expected
│  └─ ~$60 (re-run LLM + orchestration)

TOTAL COST: ~$318 per engagement
CUSTOMER VALUE: Reduces legal review time by 4 hours = $800+ for startup
MARGIN: 150% markup sustainable
RISK: Misses regulatory change → liability exposure (unmeasured)
```

#### Example 3: Agentic Sales Prospecting (High-Touch, Multi-Channel)

```
Task: "Generate 50 personalized outreach sequences for enterprise prospects,
        including company research, decision-maker discovery, and custom value props."
Agent: Swarm of specialized agents (researcher, copywriter, compliance-checker)

Cost breakdown:
├─ Inference:
│  ├─ Research phase (50 companies, parallel): 200K prompt/company × 50 = 10M tokens
│  │  Cost: 10M × $0.80 / 1M = $8.00 (Haiku research)
│  ├─ Copywriting phase: 100K per sequence, 50 sequences = 5M tokens
│  │  Cost: 5M × $3.00 / 1M = $15.00 (Sonnet quality)
│  ├─ Compliance check (parallel): 1M tokens = $3.00
│  └─ Subtotal: ~$26
├─ Orchestration: 35 minutes multi-agent coordination
│  └─ DGX Spark: 35 min × $0.50/hour = $0.29
├─ Tooling: LinkedIn API, Company DB, Email validation
│  └─ LinkedIn scrape (50×$0.10) + DB (50×$0.02) + validation (50×$0.05) = $8.50
├─ Human override: Sales manager review (25% rejection rate)
│  └─ 15 min per sequence (50×25%) = 12.5 hours = $625
└─ Operational risk: Failed LinkedIn scrapes, email bounces
│  └─ ~$40 (retry overhead)

TOTAL COST: ~$700 per 50-sequence batch
CUSTOMER VALUE: 2-3 qualified leads × $50K deal value = $100K+
MARGIN: 14,000%+
RISK: Brand damage if sequences perceived as low-quality / not genuinely personalized
```

### Cost Accountability Formula

For every agent commitment, compute:

```
Cost Accountability = (Direct Cost + Overhead) / Customer Value Delivered

Safe zone:      < 20% (agent cost is negligible vs customer outcome)
Acceptable:     20–50% (sustainable if failure rate < 5%)
At-risk:        50–80% (needs automation improvement or unit-economics fix)
Unsustainable:  > 80% (reject or redesign as human-led process)
```

### Pricing Strategies for Agent Services

| Service Type                 | Cost Model              | Recommended Pricing                     | Rationale                                  |
| ---------------------------- | ----------------------- | --------------------------------------- | ------------------------------------------ |
| **One-off research**         | Per-query cost model    | $300–$1000 per query                    | High customer benefit; low batch scale     |
| **Compliance automation**    | Subscription + overages | $500/mo base + $10/query over 50        | Predictable team budget                    |
| **Sales prospecting**        | Performance-based       | $500/lead generated (20% of deal value) | Aligns agent success with business outcome |
| **Support agent**            | Concurrency + tokens    | $2/hour + $0.01/1000 tokens             | Scales with usage                          |
| **Specialized domain agent** | Per-unit output         | $50/report, $100/analysis               | Quality gates ensure minimum value         |

---

## 2. Qualification Requirements: "Kuka on pätevä?"

### Competency Model for Agent Implementers

**Baseline:** DWS IQ 6's existing autonomy tier system (`AI_AGENT_GUIDELINES.md` §7) maps directly to agent promise qualification. The four-tier model aligns cost, capability, and oversight:

Not every agent can execute every promise. Qualification is context-dependent: expertise, domain knowledge, tool access, and risk tolerance all matter. Use **Agent Trust Score (ATS)** from KYA framework as the verification gate: ATS ≥0.80 (FULL_SANDBOX) required for Tier 3–4 agents.

#### Tier 1: Assistant Agents (Narrow, Supervised)

**Reference:** `AI_AGENT_GUIDELINES.md` §7.1 (Autonomy Tiers)

**Who:** Any developer with basic TypeScript + MCP familiarity  
**Tools allowed:** Public APIs only (no Supabase admin, no customer data)  
**Oversight:** Human-in-loop for every output  
**Examples:** FAQ bot, FAQ search, public documentation summarizer

**Minimum qualifications:**

- [ ] Completed OpenCode onboarding
- [ ] Written ≥2 public-facing chatbots
- [ ] Passed security review (no secrets egress, input validation)
- [ ] Can explain fallback behavior when LLM fails

#### Tier 2: Data Processing Agents (Batch, Gated)

**Who:** Engineer with SQL + business domain knowledge  
**Tools allowed:** Customer data (read-only via RLS), Supabase queries  
**Oversight:** QA sign-off before production deployment  
**Examples:** Report generator, data enrichment, trend analyzer

**Minimum qualifications:**

- [ ] Tier 1 + written ≥3 data pipelines
- [ ] Certified in company data model (RLS policies, table structure)
- [ ] Passed data governance audit (GDPR, retention, encryption)
- [ ] 2 working examples with <5% error rate

#### Tier 3: Agentic Decision-Makers (Autonomous, High-Value)

**Who:** Staff engineer with ML ops + compliance background + 2+ years agentic experience  
**Tools allowed:** All tools (CRUD on customer data, tool orchestration, ML model calls)  
**Oversight:** Executive sign-off before deployment; post-deployment monitoring  
**Examples:** Procurement approval agent, pricing optimization, contract negotiation simulation

**Minimum qualifications:**

- [ ] Tier 2 + shipped ≥3 agents to production
- [ ] Certified in KYA (Know Your Agent) compliance framework (`docs/KYA_MANDATE_GUIDE.md`)
- [ ] Passed operational risk review (failure modes, liability exposure)
- [ ] Built ≥2 guardrail/escalation systems that blocked bad outputs
- [ ] Can trace every decision back to training data + rules (EU AI Act Art. 12–14)

#### Tier 4: Core DWS Team (All Tiers + Continuous Learning)

**Who:** Lifetime Oy + DWS IQ 6 founder/architect team  
**Tools allowed:** Unrestricted  
**Oversight:** Peer review only (architect → code-reviewer → ship)  
**Oversight model:** `AGENTS.md` §7, peer review per 12 Engineering Discipline Rules

**Minimum qualifications:**

- [ ] Tier 3 + designed ≥2 agent systems from scratch
- [ ] Maintains at least one production agent swarm
- [ ] Contributes to `AGENTS.md` and agent docs quarterly
- [ ] Has published findings on agent performance/cost in field notes

### Domain Expertise Requirements

Beyond tier levels, agents need **domain certifications**:

| Domain                         | Certification                           | How to Achieve                                 | Renewal             |
| ------------------------------ | --------------------------------------- | ---------------------------------------------- | ------------------- |
| **EU AI Act compliance**       | KYA mandate (Art. 12–14 traceability)   | Read `KYA_MANDATE_GUIDE.md` + 2 audit cycles   | Annually            |
| **Customer data handling**     | Supabase RLS + GDPR audit               | Pass `compliance-check` skill on a schema      | When schema changes |
| **Financial/Legal**            | Liability insurance + legal review loop | 1 audit with legal team, $50K coverage         | Annually            |
| **Sales/Revenue**              | Deal-stage funnel accuracy              | 3 demo runs with sales team, >90% quality gate | Per quarter         |
| **Technical depth (per tool)** | Tool mastery (API, error handling, SLA) | Ship 2 agents using the tool in production     | Per year            |

### Qualification Verification Checklist

Every promise requires qualification sign-off:

```markdown
## Agent Promise Qualification Checklist

Promise: [Description]
Proposed implementer: [Name]
Tier required: [1/2/3/4]

- [ ] Implementer certified for this tier (date:\_\_)
- [ ] Domain expertise verified (domain:**, auditor:**, date:\_\_)
- [ ] Escalation path defined (human owner:**, contact:**)
- [ ] Fallback plan documented (what if agent fails?)
- [ ] Risk tolerance confirmed (acceptable error rate:\_%)
- [ ] Legal sign-off if financial/legal impact (lawyer:**, date:**)

Approved by: [Name, Date]
```

---

## 3. Implementation Assignment: "Kuka sen toteuttaa?"

### Agent Assignment Patterns

Once qualified, every promise needs a **named owner**. Assignment is not delegation—it is **accountability.**

#### Pattern 1: Single Agent (Narrow Promise)

```
Promise: "Summarize quarterly earnings calls in 5 minutes"
Assigned to: SageMaster (Summarization agent)
Qualification tier: Tier 2
Owner: Alice (engineer)
Fallback: Manual summary by legal team (4 hours)
Success metric: <5% customer complaint rate
```

#### Pattern 2: Sequential Agents (Process Chain)

```
Promise: "Onboard new customer: company research → security posture → risk scoring"
Agent sequence: Researcher → Scorer → Gate agent
Assigned to: Onboarding swarm
Orchestration: MCP Hub (Fan-Out pattern)
Lead owner: Bob (product)
Backup: Carol (ops)
Failure mode: Escalate to Bob if Researcher stalls >10 min
Success metric: 90% of onboards complete in 2 hours
```

#### Pattern 3: Feedback Loop Agent (Iterative Refinement)

```
Promise: "Negotiate SaaS contract: generate terms → customer reviews → revise → re-submit"
Agents: Negotiation agent (primary) + Human-in-loop (secondary)
Assigned to: Sales support layer
Lead owner: Dan (head of sales)
Escalation threshold: 2 revision rounds → manual negotiation
Success metric: Deal signed within 7 days vs 30 days average
```

#### Pattern 4: Swarm with Specialization (Expert Routing)

```
Promise: "Handle support ticket: classify → route to specialist → resolve or escalate"
Agents: Classifier → Finance specialist / Tech specialist / Legal specialist
Assigned to: Support swarm
Orchestration: Skill-based routing (MCP Hub reflection pattern)
Lead owner: Eve (support manager)
Monitoring: Per-specialist resolution rate + customer satisfaction
Success metric: 80% first-contact resolution rate
```

### Ownership Model: RACI with Agents

Adapt traditional RACI (Responsible, Accountable, Consulted, Informed):

| Role             | Accountable              | Responsible            | Consulted           | Informed                    |
| ---------------- | ------------------------ | ---------------------- | ------------------- | --------------------------- |
| **Agent**        | ✓ (executes the promise) | ✓ (logs all decisions) | —                   | —                           |
| **Human owner**  | ✓ (escalation gate)      | ✓ (monitors metrics)   | —                   | —                           |
| **Tier lead**    | —                        | —                      | ✓ (design review)   | ✓ (alerts if tier violated) |
| **Customer**     | —                        | —                      | ✓ (SLA feedback)    | ✓ (outcome delivered)       |
| **Risk officer** | —                        | —                      | ✓ (audit oversight) | ✓ (compliance dashboard)    |

### Assignment Verification

Before shipping an agent promise:

```markdown
## Agent Assignment Card

**Promise:** [What is being delivered?]
**Agent(s):** [Name(s) and tier(s)]
**Human owner:** [Name, contact]
**Backup owner:** [Name, contact]
**Escalation path:** [Who + when + how]

**Execution plan:**

- [ ] Agent ready for production (tested, monitored)
- [ ] Human owner briefed on metrics
- [ ] Fallback process tested (works without agent)
- [ ] Monitoring dashboard active (metrics visible in real-time)
- [ ] Escalation SLA defined (max wait time:\_\_\_)

**Ship gate sign-off:**
Approved by: [Name, Date]
```

---

## 4. Measurable Impact: "Mikä on mitattava vaikutus?"

### Impact Framework: Three Layers

Every promise must show impact across three layers: **customer**, **operational**, **financial**.

#### Layer 1: Customer Impact

What does the customer **gain**? Measured weekly.

| Metric                  | Example                                                          | Success Threshold          |
| ----------------------- | ---------------------------------------------------------------- | -------------------------- |
| **Time saved**          | "Compliance research takes 2 hours vs 6 hours manually"          | ≥50% reduction             |
| **Quality improvement** | "Personalized outreach has 3× higher open rate vs template"      | 3× minimum                 |
| **Risk reduction**      | "Contract review catches 95% of liability clauses vs 60% manual" | >90% accuracy              |
| **Scalability**         | "Agent handles 1000 queries/day vs 50 manual"                    | 10× throughput minimum     |
| **Accessibility**       | "Non-technical staff can run compliance audits themselves"       | 100% self-serve capability |

**Example measurement:**

```
Metric: Time saved per compliance query
Baseline: Manual legal review = 4 hours
Agent-assisted: 30 minutes reading + 10 min verification = 40 min
Savings: 3.3 hours per query = 83% reduction
Customer value: 3.3 hours × $200/hour = $660 per query
```

#### Layer 2: Operational Impact (DWS/Lifetime)

What does **DWS IQ 6 operationally improve**? Measured monthly.

| Metric                | Example                                                             | Success Threshold            |
| --------------------- | ------------------------------------------------------------------- | ---------------------------- |
| **Agent reliability** | "Agent resolves ticket on first attempt (no escalation)"            | ≥80% FCP rate                |
| **Cost per outcome**  | "Cost to deliver one compliance report: $50 vs $120 manual"         | <50% of manual cost          |
| **Team velocity**     | "5 tickets/hour per support agent (was 2 tickets/hour)"             | 2× improvement               |
| **Learning rate**     | "Agent improves accuracy by 2% per week (systematic feedback loop)" | Continuous improvement curve |
| **Uptime/SLA**        | "Agent availability: 99.5% vs 98% manual availability"              | Higher than human baseline   |

**Example measurement:**

```
Metric: Cost per resolved support ticket
Manual support: $80/ticket (1 hour × $80/hr)
Agent-assisted: $5 (6 min agent + $0.50 infrastructure)
DWS savings: $75 per ticket
Monthly volume: 2000 tickets
Monthly savings: $150,000
Annual savings: $1.8M
ROI: Amortizes agent development in months
```

#### Layer 3: Financial Impact (Revenue & Risk)

What is the **business outcome**? Measured quarterly.

| Metric                 | Example                                                                             | Success Threshold         |
| ---------------------- | ----------------------------------------------------------------------------------- | ------------------------- |
| **Revenue influenced** | "Sales agent generates $500K pipeline in Q3 vs $200K baseline"                      | 2.5× pipeline lift        |
| **Churn reduction**    | "Support agent reduces customer churn by 5% (retention × LTV)"                      | >2% churn reduction       |
| **Premium upsell**     | "Agent identifies 10% of customers for paid tier upgrade"                           | +$50K ARR                 |
| **Risk mitigation**    | "Agent catches compliance issue before customer incident (avoided $500K liability)" | Incident prevention ≥ 99% |
| **Market expansion**   | "Agent enables entry to new vertical (compliance-heavy SaaS vs solo founder SaaS)"  | 1 new $1M+ segment        |

**Example measurement:**

```
Metric: Customer LTV impact (support agent improves retention)
Baseline churn: 5% monthly (60% annual)
Agent-assisted retention: 98% annual (2% churn)
Improvement: 3% retention = 5% LTV increase
Average customer LTV: $10,000
LTV improvement: $500 per customer
Customer base: 500 customers
Financial impact: $250,000 annual LTV increase
```

### Measurement Cadence & Instrumentation

For every agent promise, define:

```markdown
## Impact Measurement Plan

**Promise:** [Description]
**Agent:** [Name]

### Customer Metrics

- Metric 1: [name]
  └─ Measurement: [how measured?]
  └─ Frequency: [weekly/monthly/quarterly]
  └─ Success threshold: [what's "good"?]

### Operational Metrics

- Metric 1: [name]
  └─ Measurement: [how measured?]
  └─ Frequency: [how often?]
  └─ Success threshold: [what's "good"?]

### Financial Metrics

- Metric 1: [name]
  └─ Measurement: [how measured?]
  └─ Frequency: [how often?]
  └─ Success threshold: [what's "good"?]

### Data Source & Instrumentation

- [ ] Metric 1 automated in Supabase (table: **, query: **)
- [ ] Metric 2 automated in observability stack (tool: **, dashboard: **)
- [ ] Metric 3 manual review (owner: **, cadence: **)

### Alert Thresholds

- Customer metric falls below X: [escalation action]
- Operational metric misses SLA: [correction action]
- Financial impact variance > 10%: [review trigger]
```

### Red Flags: When to Pause an Agent

Stop using an agent promise if:

- **Customer impact:** Usage drops >20% week-over-week (customer losing confidence)
- **Operational:** Error rate >10% (unreliable enough to need human override)
- **Financial:** Cost per outcome exceeds 80% of customer value (not economically viable)
- **Risk:** Single escalation incident that reaches legal (compliance violation)

---

## 5. The Promise Template: Putting It All Together

Every agentic engineering promise—whether internal or customer-facing—lives in this template:

```markdown
# Agent Promise: [Name]

## 1. What's the Promise?

[One paragraph: what does the agent deliver?]

## 2. Cost Model: "Paljonko se maksaa?"

├─ Direct LLM cost: $** per execution
├─ Orchestration overhead: $** per execution
├─ Tooling & integrations: $** per execution
├─ Human override (escalation): \_**% chance × $** = $**
└─ Total cost per outcome: $\_\_

Customer value: $**
Cost-to-value ratio: \_**% (safe < 20%)

## 3. Qualification: "Kuka on pätevä?"

├─ Agent tier required: [1/2/3/4]
├─ Domain expertise: [certifications needed]
├─ Assigned implementer: [name, tier, qualifications]
└─ Backup owner: [name]

Verification: ☐ Tier certified ☐ Domain audit passed ☐ Risk sign-off

## 4. Implementation: "Kuka sen toteuttaa?"

├─ Primary agent(s): [list with roles]
├─ Human owner: [name, escalation threshold]
├─ Orchestration pattern: [single/sequential/feedback loop/swarm]
└─ Fallback process: [what happens if agent fails?]

Execution plan:

- ☐ Agent ready for production
- ☐ Monitoring active
- ☐ Escalation SLA defined
- ☐ Signed off for deployment

## 5. Measurable Impact: "Mikä on mitattava vaikutus?"

### Customer Impact

- Metric 1: [name] | Baseline: [X] | Target: [Y] | Success: [Z]
- Metric 2: [name] | Baseline: [X] | Target: [Y] | Success: [Z]

### Operational Impact

- Metric 1: [name] | Baseline: [X] | Target: [Y] | Success: [Z]
- Metric 2: [name] | Baseline: [X] | Target: [Y] | Success: [Z]

### Financial Impact

- Metric 1: [name] | Baseline: [X] | Target: [Y] | Success: [Z]

Measurement cadence: [weekly/monthly/quarterly]
Alert thresholds: [when to pause/escalate]
Dashboard link: [observability URL]

## Sign-Off

- Approved by: [name, date]
- Ship gate passed: [date]
- In production since: [date]
- Last reviewed: [date]
```

---

## 6. Case Studies: Real Promises & Their Metrics

### Case 1: Know Your Agent (KYA) Compliance Agent

**Promise:** "Audit any agent for EU AI Act Article 12–14 compliance in <1 hour"

**Cost Model:**

```
LLM: 8K prompt + 3K completion (Claude Sonnet) = $2.30
Orchestration: 45 min = $0.38
Tooling: Supabase queries (agent logs, guardrail traces) = $0.05
Human override: 20% audit fails → escalate to lawyer (1 hour) = $200 × 0.20 = $40
TOTAL: ~$42.73 per audit
```

**Qualification:**

```
Agent tier: 3 (Agentic Decision-Maker)
Implementer: Senior engineer + compliance specialist
Domain: EU AI Act interpretation, agent systems
Backup: Lifetime legal team
```

**Implementation:**

```
Agent: KYA auditor (rule-based + LLM synthesis)
Human owner: Compliance officer
Escalation: >5 findings → legal review required
Fallback: Manual audit by lawyer (4 hours, $800)
```

**Impact:**

```
Customer: Compliance confidence (binary: pass/fail)
          Audit time: 4 hours manual → 1 hour agent = 75% time savings
          Customer value: 3 hours × $100/hr legal time = $300

Operational: Audits per compliance engineer: 2/day manual → 8/day agent = 4× throughput
             Cost per audit: $80 manual → $42.73 agent = 47% cost reduction

Financial: 10 customers × 1 audit/quarter = 40 audits/year
           Savings: (80 - 42.73) × 40 = $1,492/year
           Revenue: Could charge $250/audit = $10K/year new revenue
           Risk mitigation: Prevents 1 compliance incident = $50K+ avoided cost
```

**Metrics (dashboard: `dws6.com/metrics/kya-audits`):**

- Customer: Audit pass rate > 90%
- Customer: Audit time < 60 minutes
- Operational: False positive rate < 5%
- Operational: Escalation rate < 10%
- Financial: Cost per audit trending down (learning rate 2%/month)

---

### Case 2: Sales Prospecting Agent (E-Commerce Vertical)

**Promise:** "Generate 100 qualified leads for e-commerce brands (product-market fit scoring + personalized outreach)"

**Cost Model:**

```
Research phase (100 companies):
  ├─ Company research: 200K prompt/company = 20M tokens
  │  └─ Haiku: 20M × $0.80 / 1M = $16
  └─ Decision-maker discovery: 5M tokens = $4

Copywriting phase (100 sequences):
  ├─ Personalized value prop: 100K/sequence = 10M tokens
  │  └─ Sonnet: 10M × $3.00 / 1M = $30
  └─ A/B subject lines: 2M tokens = $6

Compliance/fact-check:
  ├─ Verify claims against company website: 2M tokens = $1.50
  └─ Check for regulatory red flags: 1M tokens = $0.80

Orchestration: 90 min multi-agent swarm = $0.75

Tooling:
  ├─ LinkedIn API (100 lookups × $0.10) = $10
  ├─ Company database (100 × $0.05) = $5
  └─ Email validation (100 × $0.05) = $5

Human override: Sales team reviews 20% (20 sequences, 30 min each)
  └─ 10 hours × $80/hr = $800 (20% of batch) = $160 impact

Quality assurance: 2-hour manual spot-check
  └─ $80/hr × 2 = $160

TOTAL: $240 + $160 + $160 = $560 per 100-lead batch
Cost per lead: $5.60
```

**Qualification:**

```
Agent tier: 3 (specialist in sales + brand risk)
Implementer: Sales systems engineer + copywriter
Domain: E-commerce GTM, brand voice consistency
Backup: Head of sales
Legal review: Yes (brand impersonation risk)
```

**Implementation:**

```
Agents: Researcher → Copywriter → Compliance → Human reviewer (gate)
Owner: Sales VP
Escalation: Compliance flags > 2 per sequence → legal review
Fallback: Manual prospecting by sales team (30 min per lead = $40/lead)
```

**Impact:**

```
Customer (E-commerce brand):
  ├─ Qualified leads: 100 leads at >70% ICP match (vs 20 leads manual)
  ├─ Time to launch: 2 days (agent) vs 2 weeks manual = 87% faster
  ├─ Cost: $5.60/lead (agent) vs $40/lead (manual) = 86% savings
  └─ Customer value: 80 additional qualified leads worth $50K pipeline × 50% close rate

Operational (DWS):
  ├─ Campaign delivery time: Reduced from 30 days to 2 days
  ├─ Scaling capacity: Now handle 10 campaigns/month vs 2 campaigns/month = 5× throughput
  └─ Cost: $560/campaign (agent) vs $12,000/campaign (manual) = $11,440/campaign savings

Financial:
  ├─ Revenue: Charge $2,500/campaign (100 leads) = $25K/campaign
  ├─ Cost of delivery: $560 = 2.2% of revenue
  ├─ Gross margin: 97.8%
  └─ Annual (10 campaigns): $250K revenue, $5.6K cost = $244.4K gross profit
```

**Metrics (dashboard: `dws6.com/metrics/sales-prospecting`):**

- Customer: ICP match rate > 70%
- Customer: Lead quality (score > 50) > 80% of batch
- Customer: Open rate > 15% (vs 8% template baseline)
- Operational: Cost per lead < $10
- Operational: False positive rate (non-ICP leads) < 20%
- Financial: Revenue per customer > $10K
- Financial: Gross margin trending 95%+

---

## 7. Implementation Roadmap: From Promise to Production

### Phase 1: Design (Week 1)

```
☐ Define the promise in one paragraph
☐ Cost model: Research + document (LLM, infrastructure, human override)
☐ Qualification: Who can build/own this?
☐ Initial impact metrics: What success looks like
☐ Risk assessment: What could go wrong?
```

### Phase 2: Development (Weeks 2–4)

```
☐ Build agent (minimal viable agent, not production-ready)
☐ Test cost model: Actual cost vs. estimate
☐ Verify qualification: Can the assigned owner execute?
☐ Prototype metrics: Can we measure impact?
☐ Escalation testing: Fallback process works
```

### Phase 3: Validation (Week 5)

```
☐ Code review + KYA audit (compliance check)
☐ Cost analysis: Refine cost model based on actual runs
☐ Impact projection: Model customer/operational/financial outcomes
☐ Risk sign-off: Legal + risk officer approval
☐ Readiness gate: Ship decision
```

### Phase 4: Deployment (Week 6+)

```
☐ Soft launch: 10% of traffic / 1 pilot customer
☐ Monitor metrics: Watch for gaps between promised vs actual
☐ Escalation handling: Test real-world failure modes
☐ GA launch: 100% rollout
☐ Continuous improvement: Weekly metrics review
```

### Phase 5: Optimization (Ongoing)

```
☐ Cost reduction: Each iteration, reduce cost per outcome by 5%+
☐ Reliability: Drive escalation rate down to <5%
☐ Customer feedback: Quarterly reviews of impact
☐ Knowledge capture: Update field notes with learnings
```

---

## 8. Questions for HIC Review

1. **Cost alignment:** Are the cost models realistic for our customer segments? Should we tier pricing differently by customer size?

2. **Qualification bar:** Is Tier 3 too high for a simple agent, or too low for risky ones? Should we add Tier 3.5 for "trusted pairs" (human + agent)?

3. **Incentives:** How do we incentivize agents to optimize for customer impact vs operational cost? Should commissions follow from proven outcomes?

4. **Accountability:** When an agent promise fails, who owns the remediation cost? The implementer, the customer, or Lifetime?

5. **Learning loop:** How do we capture and share what works across agents? Should every promise generate a post-mortem field note?

6. **Expansion:** Should this framework extend to customer-built agents using AgentFoundry, or keep it internal-only for now?

---

## 9. Regulatory Requirements & Compliance Integration

### 9.1 EU AI Act Compliance (Art. 12–14, Art. 50)

**Article 12 — Technical Documentation Requirement**

- **What:** Every agent promise must produce technical documentation including:
  - Purpose and intended use
  - Training data sources (if applicable)
  - Performance metrics (accuracy, latency, failure modes)
  - Known limitations and failure modes
- **How it maps to framework:** Promise Template §2–5 captures these automatically
- **Evidence:** Ledger-native output contract (`AI_AGENT_GUIDELINES.md` §1.1); Article 12 Logging Pipeline in `src/identity/kya-engine.ts`
- **Compliance signal:** Cost model (§1) must include "Article 12 documentation overhead" (~2% of agent development cost)

**Article 13 — Transparency & Explainability**

- **What:** Agent decisions affecting customers must be explicable to legal counsel in <1 hour
- **For Tier 3–4 agents:** Mandatory signed journalEntries + lineage (KYA Verified-Done Attestation, `KYA_STANDARD_v1.12.md` §14.7)
- **For Tier 1–2 agents:** Logging via OpenTelemetry + append-only storage

**Article 14 — Human Oversight (Mandatory)**

- **What:** Humans must control escalation thresholds and override procedures
- **How it maps:** §3 Implementation pattern MUST include:
  - Named human owner (not delegated to agent)
  - Escalation SLA (max time to human review)
  - Override capability (agent reversible by human)
- **Red flag:** If promise lacks human override, it violates Art. 14 (refuse or redesign)

**Article 50 — High-Risk Deployer Obligations (Effective 2026-08-02)**

- **Who triggers it:** Providers offering agents for high-risk applications (financial, employment, law enforcement, healthcare decisions)
- **What's required:**
  - Risk management plan (DPIA-like document)
  - Evaluation by independent conformity assessment body (CAB)
  - Post-market monitoring (continuous evaluation per DWS_SECURITY_STANDARD.md §2.2)
- **Promise framework requirement:** §2 Qualification checklist must include:
  ```
  - [ ] Risk classification: [ ] Low [ ] High
  - [ ] If high: CAB evaluation date ____
  - [ ] If high: Post-market monitoring SLA ____
  ```

### 9.2 GDPR — Personal Data Processing

**Key constraints for agent promises:**

| Requirement                     | What It Means                                                | Promise Framework Impact                                                                 |
| ------------------------------- | ------------------------------------------------------------ | ---------------------------------------------------------------------------------------- |
| **Data minimization**           | Collect only what's needed                                   | Cost model (§1): RLS overhead (~3–5% query cost)                                         |
| **Purpose limitation**          | No re-purposing without consent                              | Qualification (§2): GDPR audit mandatory if personal data involved                       |
| **Retention limits**            | No indefinite logging                                        | Implementation (§3): Retention SLA must be explicit                                      |
| **Art. 22 automated decisions** | Personal data → automated decision needs disclosure          | Impact (§4): If promise involves personal data, separate metrics for explainability cost |
| **Sub-processor**               | If agent calls external APIs for personal data, DPA required | Implementation (§3): Escalation path includes DPA review                                 |

**Compliance checklist for promise:**

- [ ] Does agent process personal data? (Name, email, ID, IP, behavioral data?)
- [ ] If YES: GDPR Data Impact Assessment completed?
- [ ] If YES: Sub-processor agreements reviewed?
- [ ] Retention period explicitly set (default: customer deletes on request)?
- [ ] RLS policies enforced in Supabase?

### 9.3 NIS2 — Incident Response SLA

**Applies to:** All Tier 2–4 agents handling customer data

| Severity                                         | SLA      | Escalation                           |
| ------------------------------------------------ | -------- | ------------------------------------ |
| **Critical** (data breach, compliance violation) | 48 hours | Chief Security Officer + Legal + HIC |
| **High** (agent error > 10%, failed guardrails)  | 7 days   | Head of Engineering + Risk Officer   |
| **Medium** (performance degradation, SLA miss)   | 30 days  | Team Lead + Compliance               |
| **Low** (minor bugs, <1% impact)                 | 90 days  | Team Lead                            |

**Promise framework mapping:**

- §4 Impact: Add NIS2 SLA as red-flag alert
- §3 Implementation: Escalation path MUST name person for each severity level
- §1 Cost: Add "incident remediation" to operational risk layer

### 9.4 Fit for 55 / CSRD — Sustainability Disclosure

**For industrial/climate-domain agents only:**

If promise involves carbon accounting, emissions reporting, or climate impact:

- [ ] ESRS disclosure completeness audit completed (0–100 score)?
- [ ] ETS carbon price calculations reference live EU market data?
- [ ] CBAM (Carbon Border Adjustment) risk scoring documented?

**Promise framework impact:**

- §4 Impact: Financial metrics must quantify carbon/ESG outcomes
- §2 Qualification: Industrial domain agents require Fit for 55 certification

---

## 10. Operationalization Checklist: Closing Gaps

The research identified **7 major operationalization gaps** between framework intent and live enforcement. This section provides concrete fixes (ranked by ROI):

### Gap 1: Cost Model Validation (HIGH ROI — 3 days)

**Problem:** Promise costs are estimated; actual costs diverge. No feedback loop.

**Fix:**

- Instrument first 3 executions of every agent promise
- Collect actual tokens, API calls, infrastructure hours
- Compare promised vs. actual, flag variance > 10%
- Store in `dws6_agent_metrics` table

**Compliance:** Enables Art. 12 "performance metrics" documentation

### Gap 2: Tier Boundary Enforcement (HIGH ROI — 2 days)

**Problem:** ATS formula defined in KYA; not enforced when assigning agents to promises.

**Fix:**

- Before assignment, cross-check: implementer_ATS >= min_ATS_for_tier
- If violated, flag and block assignment until implementer audited

**Assignment validation:**

```
Tier 1 (Assistant): ATS >= 0.50 required
Tier 2 (Data Processing): ATS >= 0.65 required
Tier 3 (Decision-Maker): ATS >= 0.80 required
Tier 4 (Core Team): ATS >= 0.95 required
```

### Gap 3: Real-World Evaluation Before Deployment (MEDIUM ROI — 5 days)

**Problem:** Pre-launch tests don't predict real-world performance (DWS_SECURITY_STANDARD.md §2.2 "Evaluation Gap")

**Fix:**

- Canary deployment: first 10% of traffic / 1 pilot customer
- Monitor actual error rate, latency, customer satisfaction for 7 days
- Compare to promised impact thresholds (§4 red flags)
- Only proceed to GA if no red flags

**Compliance:** Art. 50 post-market monitoring mandate

### Gap 4: Cryptographic Attestation (MEDIUM ROI — deferred to v2.0)

**Problem:** No proof that promised agent actually executed correctly. Relies on human review.

**Fix (v2.0):** When KYA ledger signing ships:

- Sign promise manifest at deployment time
- Sign verified-done attestation at completion time
- Emit both to KYA ledger for audit trail

**Compliance:** Art. 12–14 traceability

### Gap 5: Automated Learning Loop (MEDIUM ROI — 3 days)

**Problem:** Promises don't feed back into institutional knowledge. Each promise starts fresh.

**Fix:**

- At 90-day mark, generate post-mortem field note automatically
- Extract cost + impact data → auto-generate KB article
- Tag "Related Promises" for future planning
- Red-flag alerts (error > 10%, cost > 80% value) auto-escalate to HIC

### Gap 6: Cross-Promise Dependency Graph (LOW ROI — architectural; defer to 2027)

**Problem:** No tracking of promises that depend on other promises. Risk of cascading failures.

**Fix (future):** Model as a DAG with automatic rollback/notification for failed dependencies

### Gap 7: Rule 5 Audit Trail (MEDIUM ROI — 4 days)

**Problem:** Impossible to audit whether Rule 5 (model-only-for-judgment) is followed.

**Fix:**

- Tag every code path as "judgment" (model), "transform" (deterministic), or "routing" (control flow)
- CI gate rejects commits with >20% untagged paths
- Ledger entry per significant decision includes tag + evidence

**Compliance:** CLAUDE.md Rule 5, Art. 12 decision transparency

---

## 11. References & Related Docs

- `AGENTS.md` — Agent architecture and tier definitions
- `CLAUDE.md` — Engineering Discipline (12 rules)
- `KYA_MANDATE_GUIDE.md` — EU AI Act compliance framework
- `docs/field-notes/2026-08-03-agent-factory-sageroute-audit.md` — Cost analysis of routing agents
- `DWS_TRUTH_STANDARD.md` — Data accuracy & verification requirements
- `skills/manifest.json` — Registered agent skills and capabilities

---

## Version History

| Version | Date       | Changes                                                                                                                                                                                                                                                      | Author             |
| ------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------ |
| 1.1     | 2026-09-07 | Added §0 Standards Integration, expanded §2 Qualification with KYA ATS references, added §9 Regulatory Requirements (Art. 12–14, Art. 50, GDPR, NIS2, Fit for 55), added §10 Operationalization Checklist (7 gaps + ROI analysis), renamed References to §11 | Risto Anton Päärni |
| 1.0     | 2026-09-07 | Initial framework: four-question model + cost/qualification/implementation/impact layers + case studies                                                                                                                                                      | Risto Anton Päärni |

---

**Status:** Framework v1.1 published with standards integration and regulatory compliance mapping.

**Implementation roadmap:**

- **Phase 1 (NOW):** Pilot on KYA audit, sales prospecting, support classifier; deploy Gap 1 (cost validation) + Gap 2 (tier enforcement)
- **Phase 2 (Oct):** Deploy Gap 3 (canary evaluation), Gap 7 (Rule 5 audit), observability dashboard
- **Phase 3 (Q1 2027):** Gap 4 (cryptographic attestation when KYA v2.0 ships), Gap 6 (dependency orchestration), scale to 50+ agents

**Next HIC actions:**

1. Approve Risk Classification framework (Art. 50 high-risk gating)
2. Decide on Tier Boundary Enforcement SLA (Gap 2)
3. Confirm cost-to-value pricing policy (Gap 1 instrumentation)
