# Capabilities Across the Product Lifecycle

## Prototyper to Maintainer — Human + Agent, Staged by Maturity

**A Lifetime Oy Whitepaper · WP07 · 2026**

---

# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:

- Version: 1.0 | Tool: Claude Code (Sonnet 5) | Session: claude/handbook-v1-76-whitepaper-czbagd | Date: 01.07.2026 | Changes: Initial whitepaper. Extracted thematically from Konsultoinnin käsikirja 2026 §6 ("Kyvykkyydet tuotteen elinkaaressa") — maps agent capabilities to product lifecycle stages and Boris Cherny's five product-development archetypes (Prototyper/Builder/Sweeper/Grower/Maintainer), plus the maturity-mix model applied per DWS product and per industry. Facts cross-checked against canonical sources (products.json, handbook §6).

Document Status:

- Created: 01.07.2026
- Author: Risto Anton Paarni, CEO, Lifetime Oy
- Language: English
- Publication Status: DRAFT — review before distribution

---

## Executive summary

Product and engineering leaders ask the same question in every planning cycle: what mix of work — building, cleaning up, growing, keeping the lights on — does a product actually need right now? Most teams answer it by headcount and title. Lifetime Oy answers it by **capability and maturity**, because the right mix changes as a product moves from first prototype to steady state, and staffing by fixed job title cannot track that curve.

Claude Code's Boris Cherny named five archetypes engineers naturally slide into on any product: **Prototyper, Builder, Sweeper, Grower, Maintainer.** They are not job titles — they are modes of work, and a healthy team needs a mix of them that shifts with the product's maturity. Lifetime Oy applies the same lens to agent capability, mapped explicitly onto the four lifecycle stages already in our platform: **Development, Deployment, Maintenance, Update & Grow.** The mapping is deliberately non-1:1 — several archetypes overlap two adjacent stages, because real product work does not respect stage boundaries either.

This gives a consultant or product owner a practical instrument: identify where a product or an industry sits on the maturity curve, and staff the capability mix — human and agent — accordingly. Pre-PMF work needs Prototyper + Builder + Sweeper. A team executing a mature, high-volume product needs Sweeper + Grower + Maintainer. Getting the mix wrong is a common, avoidable cause of both wasted build effort on stable products and under-invested reliability on emerging ones.

Every stage keeps the same ethical floor established elsewhere in our platform (§2 Ihmiskeskeisyys): agents accelerate the work in each archetype; **the human stays the owner of the outcome.** Capability, not headcount — even here, at the level of individual product work.

## The old model: roles, not modes

Lifetime Oy's earlier IT-consulting business staffed 72 distinct IT roles. Those roles did not disappear when the company moved to a sovereign AI platform model — they were **re-cast as agent capabilities, skills, workflows, and learning loops (Gödel loops)**. The role still belongs to a human; the agent makes the work inside that role faster.

But re-casting roles into capabilities exposed a second-order problem: a fixed role (say, "DevOps Engineer" or "Data Engineer") tells you nothing about _when_ in a product's life that capability matters most, or how much of it a given engagement needs. A pre-PMF pilot and a five-year-old production system both employ a "DevOps Engineer," but they need very different amounts of that capability, mixed with very different amounts of others. Job titles are static; product maturity is not.

## Four stages, five archetypes, deliberately overlapping

Lifetime Oy's platform already organizes agent capability into four lifecycle stages, applied to both the DWS IQ product family and the Firehorse content/sales production line:

1. **Development** — prototype and build. Agents: GenAI Solution Architect, Data Engineer, Integration Architect, Test Automation, Designer, DeepWiki Extractor, Synthetic Data. Skills: `/designer`, `/qa`, `/plan-review`. Learning loop: the World Model Loop (observe → simulate → human-in-the-loop proposal → learn).
2. **Deployment** — go to production. Agents: DWS Deployment Engineer, Edge AI Engineer, DevOps Engineer, Enterprise Model Engineer (Lifetime World Model ontology stand-up, Train Model SaaS), Cloud Migration, Quality Gate. Skills: `/ship`, `/verify`, `/gcr-skill`, `/fix-dual-folder-api-connectivity`. Output: scoping → pilot → validation → production, with ERP integrations (SAP, IFS, Visma, Monitor, Jeeves).
3. **Maintenance** — keep it safe, reliable, sovereign. Agents: Network Security, Sovereignty Monitor, Auditor, Service Desk, Panacea (optimizer), Quality Gate. Skills: `/sovereignty-assess`, `/kya`, `/cron`, `/compliance-check`, `/site-safety`. Learning loop: continuous retraining of the Lifetime World Model ontology as regulation shifts — the core of the subscription itself — keeping Article 12 audit trails current.
4. **Update & Grow** — improve and scale. Agents: Customer Sat, Lead Feedback, Cassandra (forecasting), Competitor Surveillance, Change Management, Disruption Response. Skills: `/retro`, `/learn`, `/simplify`, `/regulatory-radar`, `/truth-check`. Learning loop: `/learn` runs after `/retro` — a Gödel loop that improves the skills themselves each cycle, so the harness stays thin while capability compounds.

The Firehorse production line (content, marketing, and sales as a repeatable product) runs the same four stages: build & produce (Apollo, Content Brief, Keyword Intent, Synthetic Data — reinforced by Firehorse Amplify), publish & manage (Firehorse Content Management, SEO Audit, Designer), and grow & optimize (Competitor Surveillance, Lead Feedback, Customer Sat — `/lsj-publish`, `/investor-outreach`), closing the loop from build → sell → feedback → improve.

Layered onto these four stages are Boris Cherny's five product-development archetypes — not job titles, but modes of work a capability performs, mapping onto lifecycle stages **with intentional overlap**, because the boundaries between stages are never as clean as a diagram suggests:

- **Prototyper** → Development
- **Builder** → Development + Deployment
- **Sweeper** → Maintenance + Update & Grow (cleans up, simplifies, removes, optimizes)
- **Grower** → Update & Grow (iterates toward and past product-market fit)
- **Maintainer** → Maintenance (safe, reliable, scales without drama)

## The maturity mix — the practical instrument

Boris Cherny's core observation is that a healthy team needs a _mix_ of archetypes, and the right mix is a function of product maturity — not a fixed org chart. That single idea is what makes the model useful to a consultant walking into an unfamiliar engagement: **identify where the product or industry sits on the maturity curve, then weight the capability mix accordingly.**

- **Pre-PMF (new product or new industry vertical):** Prototyper + Builder + Sweeper (1+2+3) — the work is finding the shape of the thing and keeping it from collapsing under its own early complexity.
- **Growth stage (PMF found):** Builder + Sweeper + Grower + Maintainer (2+3+4+5) — building continues, but growth and reliability start pulling equal weight.
- **Mature (strong PMF):** Sweeper + Grower + Maintainer, with a little Builder (3+4+5+2) — the dominant work is optimization, iteration, and keeping a high-volume system boring and dependable.

**Applied per DWS product:**

- **Aegis Defence** (pre-GA, pre-PMF) → 1+2+3: prototyping, building, optimizing as the defence/dual-use ontology takes shape.
- **Climate IQ** (PMF reached, growing) → 2+3+4+5: building, growth, and maintenance running in parallel as the customer base scales.
- **DWS IQ 6 core** (mature) → 3+4+5: maintenance, growth, and continuous cleanup dominate; the core platform is optimized, not re-architected.

**Applied per industry** (the same logic — an industry's maturity relative to DWS's coverage of it sets the weighting):

- **Mature industries** (steel, energy, chemicals — CBAM/ETS already established) → Grower + Maintainer + Sweeper: iteration, reliability, optimization.
- **Growing industries** (construction, maritime — EPBD 2028, FuelEU ahead) → Builder + Grower: building out workflows and sharpening product-market fit.
- **Emerging industries** (defence/dual-use, and any newly added ontology node) → Prototyper + Builder: mapping the domain, first workflows, validation.

## Why this matters to a product or engineering leader

A consultant who staffs every engagement the same way — regardless of where the product sits on this curve — makes one of two predictable mistakes: over-building a mature, stable system (wasted effort, unnecessary risk of regression), or under-investing in reliability and growth work on an emerging one (a prototype that never hardens into a product). The archetype-by-maturity mix gives a fast, shared vocabulary for avoiding both failure modes, and it travels well: the same instrument applies whether the "product" is a DWS platform module, a customer's own software product, or an entire industry vertical DWS is entering.

It also gives a consulting engagement a natural diagnostic opening question: _where is this on the maturity curve, and does the current team's mix of modes match it?_ That question, asked before any recommendation, is the difference between a generic delivery plan and one that fits the actual stage of the work.

## The ethical floor holds at every stage

None of this changes the governing principle. Whether a capability is prototyping, building, maintaining, or growing, the same rule applies: **the agent accelerates the work; the human owns the outcome.** Personnel decisions belong to leadership, not to an algorithm and not to a lifecycle model. The archetype-and-maturity lens is a tool for allocating capability correctly — it is never a tool for deciding who stays employed.

---

**Lifetime Oy** · Business ID 0772407-9 · Espoo, Finland · risto.paarni@lifetime.fi
© 2026 Lifetime Oy. All rights reserved. dws10.com
