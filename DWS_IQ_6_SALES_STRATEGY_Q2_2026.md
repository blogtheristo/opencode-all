# DWS IQ 6 — Q2/2026 Sales Strategy

**Lifetime Oy / Risto Anton Päärni**
**Period:** April 1 – June 30, 2026
**Builds on:** `DWS_IQ_6_SALES_MANIFESTO_Q1_2026.md`
**Status:** ACTIVE — mid-quarter refresh (drafted 2026-05-20)

***

# VERSION AND AGENT HISTORY

Version: 1.1

Sessions & Modifications:

- Version: 1.1 | Tool: Claude Code (Opus 4.7) | Session: claude/improve-sales-strategy-6qvat | Date: 20.05.2026 | Changes: Added §11 Merchant Drill-Down — Q2 catalog posture for `dws10.com/buy/` (116 SKUs audited): consolidation of `buyPage=1` from 27 → 9 featured slots, Sales Lane mapping (Entry / Pilot / Scale / Enterprise / Hardware / Advisory), `_OLD` SKU archival list, naming hygiene for the "DWS IQ —" family, and freemium-entry gap that Pillar 2 will fill
- Version: 1.0 | Tool: Claude Code (Opus 4.7) | Session: claude/improve-sales-strategy-6qvat | Date: 20.05.2026 | Changes: Initial Q2/2026 sales strategy — brand architecture unification, PLG / demo accessibility, CSRD-led value proposition, enterprise commercialization track; sets baseline open questions for primary revenue product, primary decision-maker persona, and dominant sales channel

Session Links & References:

- Claude Code (claude/improve-sales-strategy-6qvat): https://github.com/blogtheristo/dws6/commits/claude/improve-sales-strategy-6qvat
- View on GitHub: https://github.com/blogtheristo/dws6/blob/main/DWS_IQ_6_SALES_STRATEGY_Q2_2026.md

Document Status:

- Created: 20.05.2026
- Last Modified: 20.05.2026
- Language: English & Finnish (bilingual)
- Languages Available: English, Suomi
- Publication Status: ACTIVE

***

## Table of Contents

1. [Executive Summary / Tiivistelmä](#1-executive-summary--tiivistelmä)
2. [Q2 Context: Where We Stand](#2-q2-context-where-we-stand)
3. [Pillar 1 — Brand Architecture & Funnel](#3-pillar-1--brand-architecture--funnel)
4. [Pillar 2 — Product-Led Growth (PLG)](#4-pillar-2--product-led-growth-plg)
5. [Pillar 3 — Value Proposition Anchored to CSRD](#5-pillar-3--value-proposition-anchored-to-csrd)
6. [Pillar 4 — Enterprise Commercialization (Inbound)](#6-pillar-4--enterprise-commercialization-inbound)
7. [Open Questions to Resolve](#7-open-questions-to-resolve)
8. [Q2 Targets & Metrics](#8-q2-targets--metrics)
9. [Execution Calendar](#9-execution-calendar)
10. [Source-of-Truth Hooks](#10-source-of-truth-hooks)
11. [Merchant Drill-Down — Q2 Catalog Posture](#11-merchant-drill-down--q2-catalog-posture)

***

## 1. Executive Summary / Tiivistelmä

**EN:** Q1/2026 proved that account-discipline against the TOP 30 list works.
Q2/2026 must remove the structural friction that suppresses inbound and self-serve:
a fragmented brand surface across four domains, a hidden demo, no freemium entry,
and CSRD/Fit for 55 urgency that we own but do not yet monetize. Strategy hinges
on **four pillars** — brand architecture, PLG, regulation-led value, enterprise
inbound — wired into one funnel that ends at `dws10.com/checkout/` for self-serve
and at a single `enterprise@` capture for high-touch.

**FI:** Q1/2026 osoitti, että TOP 30 -listalle keskittynyt outbound-kuri toimii.
Q2/2026:n tehtävänä on poistaa rakenteellinen kitka, joka tukahduttaa inboundin
ja itsepalvelumyynnin: pirstaleinen brändirakenne neljällä verkkotunnuksella,
piilossa oleva demo, puuttuva freemium-sisäänkäynti sekä CSRD- ja Fit for 55
-pakko, jonka omistamme mutta jota emme vielä rahasta. Strategia nojaa **neljään
pilariin** — brändiarkkitehtuuri, PLG, regulaatiopohjainen arvo, enterprise-inbound
— jotka kytketään yhteen suppiloon, joka päättyy itsepalveluun osoitteessa
`dws10.com/checkout/` tai yhteen `enterprise@`-kanavaan korkean kosketuksen
myyntiä varten.

***

## 2. Q2 Context: Where We Stand

**As of 2026-05-20 (Week 7 of Q2):**

- Q1 exit criteria: pilots signed against the 29 950 € pilot SKU (see Q1 manifesto §1)
- Four customer-facing domains live: `onelifetime.world`, `dws10.com`, `dws6.com`, `lifetime.fi`
- Dual-folder mirror discipline enforced (root → `landing-pages/*` per `CLAUDE.md`)
- Pricing single source of truth: `dws10.com/config/products.json` (mirror: `landing-pages/dws10-com/config/products.json`)
- Outbound engine: Firehorse + LinkedIn cadence proven against TOP 30
- Gap: inbound and self-serve conversion paths are diffuse — every domain is a
  potential entry, none is canonical

The four pillars below are designed to land **before EU-wide CSRD deadline
(Jun 30, 2026)** so the forced-purchase tailwind hits a coherent funnel.

***

## 3. Pillar 1 — Brand Architecture & Funnel

Current state diffuses traffic and damages SEO. Q2 collapses it into one canonical hierarchy.

### Role per domain (locked for Q2)

| Domain | Role | Primary CTA |
|---|---|---|
| `onelifetime.world` | **Umbrella brand** — vision, Sovereign AI agents for European industry, ESG narrative, investor surface | "See the product" → `dws10.com` |
| `dws10.com` | **Marketplace / self-serve** — modular packages, prices, `/checkout/` flow | "Buy now" / "Start free" |
| `dws6.com` | **Customer & admin portal** — login, dashboards, V9 demo entry | "Sign in" / "Try V9 demo" |
| `lifetime.fi` | **Finland B2B landing** — Finnish-language references, local case studies, Suomi outreach | "Varaa esittely" → routes to `dws10.com` or sales |

### Concrete actions (Q2)

- Add cross-domain header bar wired from `onelifetime.world` to the role-correct
  destination on each click (one source of truth in `landing-pages/onelifetime-world/`,
  mirrored to root per dual-folder rule).
- Canonical tags: every page that exists on both root and `landing-pages/` mirror
  must point `rel="canonical"` to the root version.
- SEO consolidation: deprecate duplicate product copy from `dws6.com/` and
  `lifetime.fi/` that re-states the marketplace narrative — link, do not repeat.
- Sitemap audit: produce one `sitemap-index.xml` at `onelifetime.world` that
  references the per-domain sitemaps.

***

## 4. Pillar 2 — Product-Led Growth (PLG)

Lower the cost-to-first-value for any DWS IQ buyer.

### Demo accessibility

- **"Try V9 Demo" promoted to top-nav** on `onelifetime.world` and
  `dws10.com` (currently only surfaced inside `dws6.com`).
- One-click guest mode for the demo: no signup wall on the marketing path,
  collect email only at the "save your project" moment.

### Freemium for construction

- **Free tier scope:** 1 active project, capped ESG dataset (e.g. ≤ 50 line
  items), single-user, no PDF export branding.
- **Upgrade trigger:** add a second project, export an unbranded report, or
  invite a second user.
- **Data-gravity hypothesis:** once a buyer's baseline ESG data is inside DWS IQ,
  the marginal cost of migrating *out* exceeds the price of upgrade.

### Implementation guardrails (CLAUDE.md compliance)

- Pricing for the freemium tier must be added to
  `dws10.com/config/products.json` and synced to the `landing-pages/` mirror in
  the same commit (single source of truth rule).
- No hard-coded prices in any HTML page or `Store/*.md` frontmatter.
- Input validation (Zod) on all signup forms; never weaken RLS for the free
  tier — segment by `tier='free'` claim, do not bypass policies.

***

## 5. Pillar 3 — Value Proposition Anchored to CSRD

Q1 messaging led with "AI agents for industry." Q2 leads with the regulatory deadline.

### The reframe

- **Old:** "Sovereign AI agents that amplify intelligence."
- **Q2 lead line:** "CSRD-ready in 4 weeks, audit-defensible, on EU-sovereign
  infrastructure. Skip the 600-hour Excel project."
- **Sub-line:** "Fit for 55, CBAM, EPBD 2027 — one platform, every report."

### Proof artifacts to ship in Q2

- **CSRD time-saved calculator** on `onelifetime.world/csrd-calculator`:
  inputs = headcount, sites, current tooling; output = hours/€ saved vs. manual
  Excel. Calculator must show methodology link (regulatory-radar evidence).
- **One named customer story** (FI construction reference) — even one public
  case neutralizes the "no Nordic reference" objection. Owner: CEO. Deadline:
  June 15, 2026.
- **Comparison page:** DWS IQ 6 vs. manual Excel vs. competitor X — sourced
  numbers, EN 15978 / EFRAG citations only.

### Content cadence

- Biweekly `LSJ` (Lifetime Scope Monthly) issue features one CSRD/CBAM win.
- Regulatory-radar scans (per skill) fed into outbound talking points weekly.

***

## 6. Pillar 4 — Enterprise Commercialization (Inbound)

Enterprise buyers (HOCHTIEF, STRABAG, PORR, NCC, Skanska tier) do not buy
through `/checkout/`. They need a parallel inbound surface.

### "Contact Enterprise Sales" track

- Dedicated page: `onelifetime.world/enterprise` — surfaces SOC 2 status,
  Entra ID / Workspace SSO, MFA, EU data residency, SLA tiers, security
  audit pack download (gated by work email).
- Form posts to a single `enterprise@lifetime.fi` queue with Zod-validated
  payload (company, employee band, regulatory horizon, requested SLA).
- Auto-acknowledge email via Amazon SES (per `CLAUDE.md` rule — no Resend,
  no `noreply@` sender; use a monitored mailbox).
- 24h human response SLA inside Q2 (CEO until AI Director onboards).

### Security & compliance evidence pack

Bundle in one downloadable PDF:

- DWS Security Standard summary
- Data residency map (EU only, Hetzner / OVH / Scaleway specifics)
- RLS posture & MFA enforcement
- Sovereignty-assess output (per skill) for any prospect on request

### Enterprise pricing posture

- No public enterprise prices. Marketplace ends at the pilot SKU
  (29 950 €) per Q1 manifesto §6. Above pilot: bespoke.
- Use the V1 ongoing price (10 950 €/month) only after qualified demo, never
  on a public page.

***

## 7. Open Questions to Resolve

These three answers gate the second half of Q2 (Weeks 8–13). Each has a
proposed default that we will execute against unless overridden.

| # | Question | Proposed default (act on this) | Owner | Decision deadline |
|---|---|---|---|---|
| Q1 | Which of the four brands/products is the primary Q2 revenue source? | **DWS IQ (construction ESG / CSRD)** — pilots & inbound | CEO | 2026-05-27 |
| Q2 | Who is the primary decision-maker we sell to? | **Sustainability Director / ESG lead** (CSRD-deadline-pressured), with COO as economic buyer | CEO | 2026-05-27 |
| Q3 | Which sales channel is dominant in Q2? | **Direct outbound (LinkedIn + email) + inbound from `dws10.com`**, partner channel deferred to Q3 | CEO | 2026-05-27 |

If the CEO confirms an override on any line, this document is updated in the
same commit as the call (no out-of-band notes).

***

## 8. Q2 Targets & Metrics

**Carryover from Q1 manifesto (still binding):**

- 15 LinkedIn contacts / week (3/day × 5 days), TOP 30 only
- Friday 09:00–10:00 weekly metrics review

**Q2-specific additions:**

| Metric | Target by 2026-06-30 |
|---|---|
| Free-tier signups (after PLG launch) | ≥ 100 |
| Free → pilot conversion rate | ≥ 3% (≥ 3 pilots from free tier) |
| Enterprise inbound leads (`/enterprise` form) | ≥ 20 |
| Enterprise → demo booked | ≥ 30% (≥ 6 demos) |
| CSRD calculator completions | ≥ 500 |
| Named public customer reference | 1 (FI construction) |
| Pilots signed (cumulative H1) | 4 (Q1: 2 + Q2: 2) |
| Domain consolidation: cross-domain header live | Yes |

**Health-check flags (escalate at Friday review):**

- Free-tier signups < 25 by Week 10 → revisit signup friction
- Enterprise inbound < 5 by Week 10 → audit `/enterprise` SEO + CTAs
- Any week with < 13 outbound contacts → forfeit the next code/feature block

***

## 9. Execution Calendar

```
Week 7  (May 18–24, 2026)  ← we are here
├─ This document committed; Q1 manifesto referenced
├─ CEO answers the three Open Questions (§7)
└─ Cross-domain header design draft

Week 8  (May 25–31)
├─ Cross-domain header shipped to onelifetime.world + landing-pages mirror
├─ "Try V9 Demo" CTA promoted on onelifetime.world top-nav
└─ Freemium tier scope locked into products.json

Week 9  (Jun 1–7)
├─ /enterprise page live with SSO + EU residency + security pack
├─ enterprise@lifetime.fi SES inbox + 24h SLA in effect
└─ CSRD calculator v1 live on onelifetime.world

Week 10 (Jun 8–14)
├─ Freemium tier opens (1 project, capped dataset)
├─ Named FI customer reference draft circulated for approval
└─ Comparison page (manual Excel vs. DWS IQ) published

Week 11 (Jun 15–21)
├─ FI customer reference live
├─ First freemium → pilot upgrade attempt
└─ LSJ biweekly issue: CSRD calculator + customer story

Week 12 (Jun 22–28)
├─ Mid-Q2 / late-Q2 review against §8 targets
└─ Q3 plan draft circulated

Week 13 (Jun 29–30)
├─ EU-wide CSRD deadline → expect inbound spike
└─ Q2 close, exit-criteria assessment
```

***

## 10. Source-of-Truth Hooks

All Q2 changes must respect repository invariants:

- Pricing: `dws10.com/config/products.json` → mirror `landing-pages/dws10-com/config/products.json` in the same commit.
- Public-site dual-folder sync: `dws6.com/`, `dws10.com/`, `onelifetime.world/`, `lifetime.fi/` → all mirrored to `landing-pages/*` in the same commit.
- No `.md` files served from any public-site folder.
- Email transport: Amazon SES (SMTP) only — never Resend, never a `noreply@` sender.
- Legal identifiers in contracts: Lifetime Oy, Business ID 0772407-9, VAT FI07724079, Laidunmaanraitti 2 A 25, 02330 Espoo.
- No personal access tokens in `.mcp.json`; OAuth GitHub MCP only.

Standards explicitly invoked by this strategy:

- `DWS_DOCUMENT_STANDARD.md` (header, version block, *** delimiters)
- `DWS_BRAND_STANDARD.md` (Pillar 1)
- `DWS_SECURITY_STANDARD.md` (Pillar 4)
- `SITE_QUALITY_STANDARDS.md` (Pillars 1, 2, 4)
- `DWS_IQ_6_SALES_MANIFESTO_Q1_2026.md` (carryover discipline)
- `sales-outreach/NORDIC_SALES_STRATEGY.md` (Captain / Vineyard / Buffet framework remains the messaging substrate)

***

**Rule for Q2:** *"One umbrella, one marketplace, one portal, one Finnish front door — and one regulatory deadline doing the closing for us."*

***

## 11. Merchant Drill-Down — Q2 Catalog Posture

Operationalizes Pillar 1 (Brand Architecture) and Pillar 2 (PLG) at the SKU
level for `dws10.com/buy/`. **Single source of truth: `dws10.com/config/products.json`.**
Any change below must land in that file and the
`landing-pages/dws10-com/config/products.json` mirror in the same commit.

### 11.1 Current state (audit, 2026-05-20)

- **116 SKUs** live in `products.json`
- **44** items currently exposed across `buyPage` 1/2/3 (27 / 12 / 5)
- **11** items marked `featured: true`
- **2** items renamed with `_OLD` suffix per repo rename-don't-delete rule but
  still ship to the merchant page
- **Type mix:** 55 subscription · 34 one-time · 10 bundle · 9 monthly · 6 metered · 2 hourly
- **Category mix:** 66 platform · 19 advisory · 11 ai-cloud · 8 hardware · 8 digital · 3 subscription · 1 add-on

**Symptoms of catalog overload:**

- Page 1 mixes hardware (€764–€11,990), platform (€499–€59,990), advisory
  (€250/hr), and consulting (€1,200/day) in one scroll → buyer cannot self-segment
- "DWS IQ" appears under at least six distinct SKU names with no parent product card
- No `€0` / free-tier entry exists for PLG (Pillar 2) to land on (the only €0
  item is "Sovereign Database — EU Data Sovereignty for PostgreSQL", which is
  positioned as advisory not as the freemium entry)
- Two `_OLD` SKUs ("Workshop 3 Days … _OLD", "Expert Advisory & Implementation _OLD")
  are still discoverable

### 11.2 Six Sales Lanes (Q2 target shape)

Every SKU must answer **one** question: "Which lane sends this buyer next?"

| Lane | Buyer | Price band (EUR) | SKU role | Funnel destination |
|---|---|---|---|---|
| **L0 — Entry / Free** | First-touch builder / analyst | 0 | Try-and-data-load | Triggers upgrade to L1 |
| **L1 — Self-Serve Pilot** | SMB / individual deal owner | 199 – 1,999 | One-click Revolut checkout | DWS IQ Report, Signed Reports |
| **L2 — Starter Bundle** | Mid-market first-CSRD buyer | 2,999 – 6,500 | Operational in 30 days | Climate Reporting Starter Bundle |
| **L3 — Pilot / Q1 SKU** | TOP-30 named account | 29,950 (Q1 manifesto pilot) | Demo-gated | Pilot contract |
| **L4 — Enterprise / Aegis** | Tier 1 construction / industry | 59,990+ | "Contact Enterprise Sales" | `/enterprise` form, never `/checkout/` |
| **L5 — Hardware / Edge** | Sovereign-edge buyer | 764 – 11,990 | Often paired with L3/L4 | Bundled into pilot or enterprise |
| **(out-of-lane) Advisory** | Existing customer expansion | 200/hr – 4,960 | Not promoted in funnel | Quoted post-sale only |

### 11.3 Featured shelf — collapse `buyPage=1` from 27 → 9

The featured shelf on `dws10.com/buy/` is the entire funnel for inbound. Q2
target: **exactly 9 featured tiles**, one per buyer intent, in this order:

1. **DWS IQ Free** (L0 — to be created, see §11.5)
2. **DWS IQ Report** — €1,999, one-time (L1)
3. **Firehorse Signed Reports** — €199/yr (L1 add-on)
4. **Climate Reporting Starter Bundle** — €6,500 (L2)
5. **DWS IQ Climate Intelligence** — €2,999/mo (L2 subscription path)
6. **DWS IQ — EU Sovereign Pilot** — €1,499/mo (L2 → L3 ladder)
7. **DWS IQ Aegis** — €59,990 (L4 anchor, "Contact sales" CTA, no Revolut link)
8. **DGX Spark — Sovereign Edge** — €5,994 (L5 hardware flagship)
9. **Consulting Fit for 55 Specialist** — €3,000/mo (post-purchase expansion CTA)

Everything else moves to `buyPage=2` or `buyPage=3` (lane index). No item below
4-week sell-through stays featured.

### 11.4 `_OLD` SKU archival list (Q2 cleanup)

These two SKUs must be removed from `buyPage` exposure (set `buyPage: null` or
unset) but retained in `products.json` per repo rename-don't-delete rule:

- `id: expert-services` — "Workshop 3 Days - Expert Advisory & Implementation _OLD" — €4,500
- `id: LIFETIME-EXP-001` — "Expert Advisory & Implementation _OLD" — €3,000/mo

Replacement SKUs (`consulting-fit55`, `lean-project`, `business-mentor-30`) are
already live; the `_OLD` entries only pollute the merchant.

### 11.5 The L0 freemium SKU to create

Land Pillar 2 by inserting a single new SKU into `products.json`. Proposed
schema (illustrative — actual values approved by CEO before commit):

```jsonc
"DWS-IQ-FREE-2026": {
  "id": "DWS-IQ-FREE-2026",
  "name": "DWS IQ Free — 1 project, CSRD-ready",
  "price": 0,
  "currency": "EUR",
  "type": "subscription",
  "priceNote": "Free forever — 1 project, capped ESG dataset",
  "storeCategory": "platform",
  "featured": true,
  "buyPage": 1,
  "buyPageOrder": 1,
  "revolutLink": null,
  "detailsUrl": "../products/dwsiq-free.html"
}
```

Upgrade triggers (enforced in app, not catalog): 2nd project · branded export ·
2nd seat · API access. Each surfaces the L1 SKU contextually.

### 11.6 Naming hygiene — the "DWS IQ —" family

Today's SKU names are noisy: "Lifetime DWS IQ Platform (Version 6)", "DWS IQ
Report", "DWS IQ Aegis", "DWS IQ Climate Intelligence", "DWS IQ — EU Sovereign
Starter", "DWS IQ — US Cloud Starter". Q2 rule:

- **Parent name** is always `DWS IQ` (no "Lifetime" prefix, no version suffix on
  the catalog card — version lives in `version` field).
- **Variant** is always `DWS IQ — <Variant>` with em-dash separator.
- Renames must update `products.json` only; do not rename URLs (preserve SEO).

Proposed renames (illustrative, CEO-approved before commit):

| Current | Q2 target |
|---|---|
| Lifetime DWS IQ Platform (Version 6) | DWS IQ — Platform |
| DWS IQ Report | DWS IQ — Report |
| DWS IQ Aegis | DWS IQ — Aegis (Enterprise) |
| DWS IQ Climate Intelligence | DWS IQ — Climate Intelligence |
| DWS IQ — EU Sovereign Starter | (no change) |
| DWS IQ — EU Sovereign Pilot | (no change) |
| DWS IQ — US Cloud Starter | (no change) |
| DWS IQ — US Cloud Pilot | (no change) |

### 11.7 Implementation guardrails

- Every edit to `products.json` ships with the matching
  `landing-pages/dws10-com/config/products.json` change in the **same commit**.
- No price in any `.html` page or `Store/*.md` frontmatter; everything reads from
  `products.json` at build time.
- `Store/*.md` keeps YAML frontmatter only — no DWS Document Standard header
  blocks per `CLAUDE.md`.
- Removing a SKU from `buyPage` is allowed; deleting a SKU is not. Set
  `buyPage: null` and `featured: false`.

### 11.8 Q2 catalog acceptance criteria

By 2026-06-30:

- `buyPage=1` contains exactly 9 SKUs, in the order above
- L0 free SKU live, with non-null signup count (target ≥ 100 — see §8)
- Both `_OLD` SKUs off all `buyPage`s
- Naming pass shipped (DWS IQ — Variant scheme)
- `/enterprise` form (Pillar 4) is the only checkout path for DWS IQ Aegis
