# Site Hero + Naming-Split Plan — DWS 365 Skilled Agents (2026 Q2)

***

# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:

- Version: 1.0 | Tool: Claude Code (Opus 4.7) | Session: claude/investor-labor-pricing-thesis-rWS2b | Date: 14.05.2026 | Changes: Initial creation — plan (not implementation) for rolling the labor-pricing thesis and the DWS 365 Skilled Agents / Firehorse 365 Skilled Agents / DWS IQ naming split onto the public sites. Covers dws10.com, onelifetime.world, dws6.com, lifetime.fi and their landing-pages mirrors. Awaits Risto signoff before site edits. No public-site .md files will be created (CLAUDE.md non-negotiable #5).

Session Links & References:

- Claude Code (claude/investor-labor-pricing-thesis-rWS2b): https://github.com/blogtheristo/dws6/commits/claude/investor-labor-pricing-thesis-rWS2b
- Companion: docs/investor/INVESTOR_ONE_PAGER_2026Q2.md
- Companion: docs/investor/INTRO_TEMPLATE_LABOR_THESIS.md §0 (brand architecture)
- View on GitHub: https://github.com/blogtheristo/dws6/blob/claude/investor-labor-pricing-thesis-rWS2b/docs/marketing/SITE_HERO_NAMING_SPLIT_PROPOSAL_2026Q2.md

Document Status:

- Created: 14.05.2026
- Last Modified: 14.05.2026
- Language: English
- Languages Available: English
- Publication Status: PROPOSAL — no site edits until Risto signs off the brand hierarchy and hero copy in §3.

***

## 0. Why This Is a Plan, Not a Site Edit

The site changes here touch all four public sites and their `landing-pages/` mirrors, plus pricing source-of-truth (`dws10.com/config/products.json`). Two CLAUDE.md rules govern execution:

1. **Dual Folder Sync.** Root folder edit + `landing-pages/<site>-com/` mirror edit must land in the **same commit**.
2. **No `.md` files in public-site folders.** Site content lives in HTML/components only. This proposal is the only place the brand-split rationale gets written down.

The investor-outreach PR (#1306) already threads the new naming through every investor-facing artifact. This plan covers the **public site** — once Risto signs off the brand hierarchy and hero copy, a separate PR ships the HTML edits on a dedicated branch.

---

## 1. The Brand Hierarchy (Locked Once Signed Off)

| Layer            | Name                                                                       | Where it shows up                                                                                  |
|------------------|-----------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------|
| **Brand house**  | **Lifetime Oy**                                                             | Footer, legal pages, contracts, investor docs, EU compliance footers.                              |
| **Master offers**| **DWS 365 Skilled Agents** · **Firehorse 365 Skilled Agents**               | Hero, primary nav, product / category pages, pricing pages, store. The thing a buyer / investor purchases. |
| **Platform**     | **DWS IQ** (current release: DWS IQ 6)                                      | Mentioned once per page ("powered by DWS IQ"); architecture / technical pages; admin / dashboard.   |
| **Modules**      | SiteSense · Material Oracle · Compliance · Schedule Genius · Emissions Data · Logistics · Construction · Customer Sat · Viability · Deepwiki Extractor · Quality Gate · Sovereignty Monitor · Competitor Surveillance · SEO Audit · Lead Feedback · Themis (Coordinator) | Catalog rows, SKU pages, MACC / AppExchange listings. |

### How the two master offers differentiate

- **DWS 365 Skilled Agents** — Microsoft-anchored / EU industrial customer base; Azure Marketplace (MACC-burn) is the primary distribution; lead SKUs are Compliance, SiteSense, Material Oracle, Schedule Genius, Sovereignty Monitor, Construction (bundle), Themis.
- **Firehorse 365 Skilled Agents** — Python data / research-anchored customer base; direct + Salesforce AppExchange; lead SKUs are Emissions Data, Customer Sat, Lead Feedback, Competitor Surveillance, SEO Audit, Quality Gate, Deepwiki Extractor.

Both run on the **DWS IQ** platform. Both follow the same labor-pricing model (per-outcome + per-agent-month).

---

## 2. Proposed Hero Line (Pick One)

Three drafts in order of preference. Each is one H1 + one supporting paragraph, designed to drop into the existing `dws10.com/index.html` hero block at line ~1015–1023.

### Draft A — Direct labor frame (recommended)

> **H1 (line ~1015):** *"Price AI like labor, not like a tool."*
>
> **Sub (line ~1018):** *"**DWS 365 Skilled Agents** — and the sibling **Firehorse 365 Skilled Agents** — are 16 AI workers that produce signed EU regulatory artifacts: CSRD, CBAM, EU AI Act conformity, EN 15978 LCA, site-safety. Powered by **DWS IQ**, billed like the work they replace."*
>
> **Anchor (line ~1021):** *"Replaces 6–8 EU FTE for €199,990/yr. Margin holds as inference cost falls — the price is anchored to human labor, not compute."*

Why: it leads with the spine; it states the brand split (offer vs platform) in one sentence; it stays inside the existing visual structure.

### Draft B — Regulation-led frame

> **H1:** *"EU regulation is hiring. **DWS 365 Skilled Agents** is the workforce."*
>
> **Sub:** *"Sixteen AI workers — DWS 365 Skilled Agents and Firehorse 365 Skilled Agents — produce the signed regulatory artifact: CSRD, CBAM, EU AI Act conformity, EN 15978 LCA. Powered by DWS IQ. Priced like labor."*

Better for the regulation-driven funds and CSRD/CBAM-buyer cohorts; less universal than Draft A.

### Draft C — Sovereign EU frame

> **H1:** *"EU industrial labor, in software shape. Built in Finland."*
>
> **Sub:** *"**DWS 365 Skilled Agents** and **Firehorse 365 Skilled Agents** — 16 AI workers producing signed regulatory artifacts under EU residency. Powered by DWS IQ. Priced against the loaded FTE, not against software."*

Strongest for the defense / sovereignty cohort; weaker than A or B for the broader investor / industrial buyer audience.

**Recommendation: Draft A.** Use Draft B as a Messe / DACH-only A/B variant if traffic supports it.

---

## 3. Per-Surface Map (What Changes Where)

| Surface                                                  | Today                                                       | Proposed                                                                                  | Files (root → mirror)                                                  |
|----------------------------------------------------------|-------------------------------------------------------------|--------------------------------------------------------------------------------------------|------------------------------------------------------------------------|
| `dws10.com/index.html` hero                              | "Nordic Industrial AI. Built in Finland, for the Nordics."  | Draft A above.                                                                              | `dws10.com/index.html` + `landing-pages/dws10-com/index.html`         |
| `dws10.com/index.html` `<title>` + meta                  | "DWS IQ 6 \| Nordic Industrial AI \| Built in Finland \| Lifetime Oy" | "DWS 365 Skilled Agents — AI labor for EU regulation \| Powered by DWS IQ \| Lifetime Oy" | Same files.                                                            |
| `og:title`, `twitter:title`, `og:site_name`              | "DWS IQ 6 \| …" / "DWS IQ Platform"                          | "DWS 365 Skilled Agents \| …" / "DWS 365 Skilled Agents (on DWS IQ)"                       | Same.                                                                  |
| `og:description`, `twitter:description`, `meta description` | Nordic AI / EU compliance phrasing                          | Labor-anchored phrasing (one line of Draft A's sub).                                       | Same.                                                                  |
| Primary nav label                                        | "DWS IQ 6" / "Platform" / "Products"                         | "Skilled Agents" (parent) → "DWS 365" / "Firehorse 365" / "Catalog" / "Pricing"            | All nav components.                                                    |
| Footer brand line                                        | "DWS IQ Platform — Lifetime Oy"                              | "DWS 365 Skilled Agents · Firehorse 365 Skilled Agents · Powered by DWS IQ · Lifetime Oy"  | Footer components / partials.                                          |
| `onelifetime.world/index.html` `<title>` + meta + hero   | "OneLifetime.World" / "DWS IQ ecosystem and tools …"        | "OneLifetime — Brand house for DWS 365 Skilled Agents and Firehorse 365 Skilled Agents."   | `onelifetime.world/index.html` + `landing-pages/onelifetime-world/index.html` |
| `dws6.com/dashboard` chrome (admin)                      | "DWS IQ 6 dashboard"                                         | "DWS IQ dashboard — DWS 365 / Firehorse 365 operations"                                    | `dws6.com/dashboard/*` + `landing-pages/dws6-com/dashboard/*`         |
| `lifetime.fi` corporate                                  | (Finnish-language Lifetime Oy site)                          | Adds "DWS 365 Skilled Agents" and "Firehorse 365 Skilled Agents" as the offer-layer terms in FI. | `lifetime.fi/*` + `landing-pages/lifetime-fi/*`                       |
| Pricing source-of-truth                                  | `dws10.com/config/products.json` (priceVersion ≥ 1.13)       | Add `offerBrand` field per SKU: `"DWS365"` or `"FH365"`. **No price changes.**             | `dws10.com/config/products.json` + `landing-pages/dws10-com/config/products.json` (same commit, per Source-of-Truth Rule) |
| Store / Catalog cards (Store/*.md)                       | "DWS IQ 6" used in cards                                     | Replace with "DWS 365 Skilled Agents" / "Firehorse 365 Skilled Agents" per SKU offer brand. **No DWS Document Standard header blocks in Store/*.md** (CLAUDE.md). | `Store/*.md`                                                           |

### Non-changes (explicitly out of scope)

- Do **not** change customer outbound templates — Prompt 2 owns those.
- Do **not** publish any new `.md` file inside `dws10.com/`, `dws6.com/`, `onelifetime.world/`, `lifetime.fi/` or their `landing-pages/` mirrors. Plan / rationale lives in `docs/marketing/`.
- Do **not** change pricing numbers — the offerBrand split is metadata only.

---

## 4. Multilingual

Run `/multilingual` after the EN hero lands to mirror Draft A into:

- **DE** (Messe Germany): *"KI bepreisen wie Arbeit, nicht wie ein Werkzeug." — DWS 365 Skilled Agents und Firehorse 365 Skilled Agents …*
- **FI** (lifetime.fi): *"Hinnoittele tekoäly kuin työvoima, ei kuin työkalu." — DWS 365 Skilled Agents ja Firehorse 365 Skilled Agents …*
- **SV / FR**: companion translations on the same H1 + sub pattern; produced in the same `/multilingual` pass.

Audit existing language-bar pages to make every H1 match the new master hero (DWS Quality Standard).

---

## 5. SEO / Inbound Link Risk

The current site ranks for "DWS IQ", "DWS IQ 6", "Nordic industrial AI", "Lifetime Oy". Mitigation:

- **Keep the keyword "DWS IQ" in the `<title>` and `<meta description>`** as "Powered by DWS IQ" — preserves rank against existing inbound.
- **Do not remove the `Lifetime Oy` / `Finland` / `EU` keywords** from meta — they are existing ranking handles.
- **Add 301 redirects** only if any URLs change. Hero copy and meta changes do not require redirects.
- **Submit updated sitemap** after the hero PR lands; allow 7–14 days for re-index.

---

## 6. Sequencing (After Risto Signoff)

Each step is a separate PR off main, in order:

1. **PR 1: Hero + meta + nav** — `dws10.com/index.html` + landing-pages mirror, plus `onelifetime.world/index.html` + mirror. Smallest possible change. Same commit covers root + mirror per Dual Folder Sync Rule.
2. **PR 2: Pricing metadata** — `dws10.com/config/products.json` + mirror; add `offerBrand` field to each SKU (`"DWS365"` or `"FH365"`); priceVersion +0.01. No price changes.
3. **PR 3: Store cards** — `Store/*.md` cards refreshed with the offer-layer brand. YAML frontmatter only; no Document Standard header blocks (CLAUDE.md).
4. **PR 4: Dashboard chrome** — `dws6.com/dashboard/*` + mirror; internal-only impact, do in a separate PR for safety.
5. **PR 5: Multilingual** — `/multilingual` pass to mirror Draft A into DE / FI / SV / FR.
6. **PR 6: Footer + legal pages** — Lifetime Oy footer cleanup, brand hierarchy line.

Each PR is small, reversible, and dual-folder-synced.

---

## 7. Greenlight Checklist (For Risto)

- [ ] Approve the **brand hierarchy** in §1 (Lifetime Oy → DWS 365 / Firehorse 365 → DWS IQ → Modules).
- [ ] Pick **one hero draft** from §2 (recommended: Draft A).
- [ ] Approve the per-surface map in §3 (or amend).
- [ ] Approve sequencing in §6 (or re-order).
- [ ] Pick languages to ship in PR 5 (default: DE + FI + SV + FR).
- [ ] Confirm `dws10.com/config/products.json` is owned by Prompt 1 and that this proposal's PR 2 doesn't conflict — if Prompt 1 is in flight, defer PR 2 until that lands.

Once these boxes are ticked, a fresh branch from main carries out PR 1 first (smallest visible step), Risto reviews live, and we cascade from there.

---

## 8. Risks & Mitigations

| Risk                                                                | Mitigation                                                                                          |
|---------------------------------------------------------------------|------------------------------------------------------------------------------------------------------|
| Dual-folder sync drift (root edits without mirror, or vice versa)   | Every PR uses one commit per surface and both paths are in the same commit. Pre-commit check optional. |
| SEO rank loss on "DWS IQ" / "Nordic AI" keywords                      | Keep keywords in `<title>` / `<meta description>` as "Powered by DWS IQ" + Nordic + Finland phrases. |
| Buyer confusion ("is it DWS IQ or DWS 365 Skilled Agents?")           | Footer + an "About the names" component on the homepage explain the hierarchy in 2 lines.            |
| Channel listings (Azure Marketplace, AppExchange) lag the site rename | Re-list under "DWS 365 Skilled Agents — <module name>" in the same sprint. Update PR 2 to include marketplace listing copy. |
| Existing customer contracts cite "DWS IQ 6"                          | Contracts stay as-is until renewal; renewals use "DWS 365 Skilled Agents on DWS IQ 6". No retro-rename. |

---

## 9. Anti-Goals

- No new `.md` files inside `dws10.com/` / `dws6.com/` / `onelifetime.world/` / `lifetime.fi/` or their `landing-pages/` mirrors.
- No price changes in this rename — pricing PRs are owned separately.
- No removal of "Lifetime Oy" or "Finland" / "EU" branding handles — they are SEO assets and the legal-identity anchor.
- No customer outbound template rewrites in this plan — that workstream is owned elsewhere.
- No deck builds. No INTRO sends.

---

## 10. Companion Documents

- `docs/investor/INVESTOR_ONE_PAGER_2026Q2.md` — the offer-layer one-pager (already shipped).
- `docs/investor/INTRO_TEMPLATE_LABOR_THESIS.md` §0 — brand architecture (matches §1 here).
- `docs/marketing/AI-AS-LABOR-PRICING-STRATEGY.md` — strategy.
- `docs/marketing/SKILLED-AGENTS-PRICE-LIST-2026.md` — the SKU list the offer-brand metadata maps onto.
- `CLAUDE.md` — Source-of-Truth Rule, Dual Folder Sync, Markdown-in-public-sites prohibition.
