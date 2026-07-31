<!--
VERSION AND AGENT HISTORY
Document: US Industrial Captain jurisdiction plan — Dayna Blackwell deal
Version: 1.0
Date: 2026-07-31
Author: Claude Code (Sonnet 5), session claude/partner-outreach-dayna-tda0d1
Owner: Risto Anton Päärni, Founder, CEO, Lifetime Oy
Status: Draft — planning only, no execution taken
Purpose: Risto reframed the Dayna Blackwell Captain deal from "EU Captain with a
         US territory" to "US Industrial Captain" (Arizona/Texas flagship
         industrial accounts, US-jurisdiction DWS versions). Asked for a plan of
         what this requires. This is that plan — not execution. Legal basis for
         the HIC-facing record: EU AI Act Article 14 (human oversight).
Related: partners-outreach/LETTER_DAYNA_BLACKWELL_BLACKWELL_SYSTEMS.md (v1.4,
         the live deal record), docs/LOCKED_DECISIONS.md LD-2026-014,
         docs/Investor/DWS_LIQUIDITY_ENGINE_v1.md, DWS_DEPLOYMENT_STANDARD.md
         (Sales/Regulatory Jurisdiction, Deployment/Cloud Jurisdiction, Tier),
         Legal/AEGIS_PLATFORM_TERMS.md, Legal/DUAL_USE_EXPORT_NOTICE.md,
         docs/field-notes/2026-05-28-three-pillars-sovereignty-global.md

Sessions & Modifications:

- Version: 1.0 | Tool: Claude Code (Sonnet 5) | Session: claude/partner-outreach-dayna-tda0d1 | Date: 31.07.2026 | Changes: Initial plan. Surveyed the repo (Explore agent) for existing US-market material before drafting, per Rule 8. Findings: no US legal entity, no USD pricing, no US contract/ToS/DPA, no ITAR/EAR analysis exist anywhere — all would need to be built. Partial precedent exists on infrastructure (DWS IQ Connect tier already runs on US Public cloud) and on positioning (three-pillar sovereignty framing already argues EU-sovereign ≠ US-hostile). Most important finding, not previously flagged: the US is not a declared Sales Jurisdiction under DWS_DEPLOYMENT_STANDARD.md (today's two sets are EU Tier and Non-EU/Connect Tier) — adding one is explicitly RED-zone. Deeper than that: the company's core "regulation drives demand" thesis (CSRD/CBAM/ETS/EU AI Act) has no direct US federal analogue for Arizona/Texas industrial buyers, which is a product-market-fit question, not just a legal one.
-->

# US Industrial Captain — Jurisdiction Plan for the Dayna Blackwell Deal

---

## 0. The reframe, and why it's bigger than it sounds

Risto's framing: Dayna is not an EU Captain who happens to cover a US territory. She's a **US Industrial Captain** — Arizona and Texas flagship industrial accounts, sold and delivered under US-jurisdiction DWS versions, with US-specific attribution, pass-through, and margin assumptions. That single reframe touches five things DWS IQ has never actually built: a US legal counterparty, USD pricing, US contract paper, an export-control screen, and — most fundamentally — a demand driver to replace "regulation forces this" in a market where the regulation doesn't exist yet.

None of this blocks the call with Dayna. It does mean the call should be honest about what's real today versus what's being built alongside her, not presented as already-solved.

## 1. What already exists (don't rebuild this)

- **Infrastructure precedent.** `DWS_DEPLOYMENT_STANDARD.md` already defines **DWS IQ Connect** — a tier that runs on **US Public cloud** (Cloudflare/Supabase), explicitly CLOUD Act–exposed, with a lighter DPA the customer acknowledges at signup. This is real, documented infrastructure, not a green-field build. It's currently scoped to non-EU markets (UAE, Singapore) — extending its market scope to the US is a configuration/policy decision, not a new engineering project.
- **Positioning precedent.** `docs/field-notes/2026-05-28-three-pillars-sovereignty-global.md` already argues DWS's EU-sovereign identity is one "emphasis profile" among three (EU/US/Singapore) — usable, already-written material for explaining to Dayna (and later to US customers) why a US line doesn't contradict the EU-sovereign story the company has told everywhere else, including in this same letter's earlier EU-sovereign framing to Dayna.
- **Competitive-benchmarking muscle.** Aegis pricing work already benchmarks against US players (Palantir) — reusable method for a USD pricing pass, not starting from nothing.

## 2. What does not exist — build list, roughly in priority order

### 2.1 Product-market fit for the US regulatory story (biggest open question, address first)

DWS IQ's entire pitch — to investors, to Captains, in every doc this letter has referenced — is "regulation drives demand": CSRD, CBAM, ETS, EU AI Act. Arizona and Texas industrial buyers face none of these. **Before pricing or legal work, the actual question is: what makes a US industrial account buy this?** Candidates worth checking (not yet researched): SEC climate-disclosure rules (contested, uneven enforcement), state-level programs (California's SB 253/261 has extraterritorial reach for large companies, but that's California, not AZ/TX), federal procurement ESG requirements for defense-adjacent industrial suppliers, or simply operational efficiency (agent labor replacing FTE cost) sold on its own merits without a regulatory hook. This needs a real answer before Dayna is asked to sell against it — a mismatched pitch burns a channel relationship fast.

### 2.2 US Sales Jurisdiction declaration (policy decision, RED-zone)

Per `DWS_DEPLOYMENT_STANDARD.md`, "Sales / Regulatory Jurisdiction" today has exactly two declared sets: EU Tier (Sovereign infra/Aegis: NO/DK/FI) and Non-EU Tier (Connect: UAE, Singapore, per the Shufti partnership scope). **The US is in neither.** The standard is explicit: "A release that changes its Sales Jurisdiction scope ... is RED-zone" — this needs Risto's direct sign-off, not something to default into via a single Captain deal. Practically: decide whether US becomes a third Sales Jurisdiction tier (with its own regulatory anchor research, once 2.1 is answered) or gets folded into the existing Connect tier as a geography extension.

### 2.3 USD pricing — does €199,990 survive translation?

No USD price list exists anywhere in the repo. At current rates €199,990 is roughly $215–220K — whether that's credible for an AZ/TX industrial buyer depends on 2.1 (what they're actually paying for) and on US delivery cost structure (support hours, time zone coverage, whether Dayna herself is the support layer initially). This needs a real modeling pass, not a currency conversion — but a _directional_ pass (good enough for the call) can happen this week; a defensible price list is a longer exercise.

### 2.4 US legal entity — not needed before the call, but must be disclosed now

Confirmed: Lifetime Oy is Finland-only (Espoo jurisdiction, per `DWS_LEGAL_STANDARD.md` and CLAUDE.md's Legal Identity Rule). No US entity, EIN, or bank account exists. Cross-border SaaS contracting from a Finnish entity to a US buyer is legally normal, but real enterprise/industrial US procurement teams — especially anything defense-industrial-base-adjacent, which AZ/TX industrial accounts plausibly include — frequently require a US counterparty as a hard procurement gate, not a preference. Recommendation: don't form a US entity speculatively (Rule 2 — no build-ahead-of-demand); do tell Dayna directly that this is unresolved so she can factor it into which accounts she actually pursues first, rather than finding out mid-deal that a live prospect can't sign a Finnish counterparty.

### 2.5 US contract paper / ToS / DPA

`Legal/AEGIS_PLATFORM_TERMS.md` and `Legal/DUAL_USE_EXPORT_NOTICE.md` are both v0.1 draft stubs, EU-framed, marked "needs lawyer review" — no US-governing-law contract template, US ToS, or US DPA exists. Not an immediate blocker (nothing gets signed at the first call), but real lead time: needs US counsel, not something to draft internally and treat as final.

### 2.6 Export control — ITAR/EAR (real gap, not hypothetical for this specific market)

`Legal/DUAL_USE_EXPORT_NOTICE.md` only covers EU Dual-Use Regulation 2021/821 / Wassenaar — **no ITAR/EAR analysis exists anywhere in the repo.** This matters specifically for Arizona/Texas: both states carry a meaningfully defense-industrial-base-heavy footprint, and Aegis is already positioned dual-use. Recommendation: set an explicit account-scope boundary for Dayna now — flagship industrial accounts, not defense-industrial-base or Aegis-adjacent accounts — until a lightweight ITAR/EAR applicability screen is done. Don't let the first live deal be the trigger for discovering this gap.

### 2.7 Tax / withholding on her revenue share

Liquidity Engine 2.0 (15% payback, 7.5% taper — `LETTER_DAYNA_BLACKWELL_BLACKWELL_SYSTEMS.md` v1.4) was modeled in EUR against EUR deal-size references. If her deals and her payments are USD, three real questions follow, none of which should be guessed here: (a) is the €50K Captain buy-in itself EUR or a USD-equivalent, (b) what's the correct US withholding treatment for a Finnish entity paying a US-person revenue share (W-9 vs. W-8BEN territory, potential US-source-income withholding), (c) EUR/USD currency risk over the 24–36 month economic tail of the arrangement. Needs Risto's accountant/counsel, not modeling here.

### 2.8 Fix the existing pricing inconsistency before adding a fourth variant

Already flagged in the Dayna letter and in `docs/field-notes/2026-07-31-investor-captain-tier-pricing-reconciliation.md`: `docs/Investor/DWS_LIQUIDITY_ENGINE_v1.md` still carries an unreconciled Fleet Admiral €250K variant. Layering a US-jurisdiction Captain variant on top of an already-inconsistent EUR structure compounds a problem that's cheap to fix now and expensive to unwind later once a US variant is live too.

## 3. Priority ordering

**Before the call with Dayna (this week):**

- Answer 2.1 directionally, even roughly — she needs to know what she's selling against, not just what she's earning.
- Directional USD pricing pass (2.3) — doesn't need to be final.
- Set the explicit account-scope boundary excluding defense-industrial-base/ITAR-sensitive accounts (2.6) — a guardrail to state up front, not a document to write.
- Disclose the entity gap (2.4) honestly rather than silently.

**Before any LOI or signature:**

- US Sales Jurisdiction decision (2.2) — Risto's call, RED-zone.
- US contract template + counsel review (2.5).
- Tax/withholding treatment (2.7) — accountant/counsel, not guessed.
- Entity-formation decision, only if a live deal actually requires a US counterparty (2.4) — don't build ahead of demand.

**Not urgent, track but don't block on:**

- Full ITAR/EAR program (2.6) — a lightweight screen is enough until volume justifies more.
- `DWS_LIQUIDITY_ENGINE_v1.md` reconciliation (2.8) — worth doing soon, but doesn't block the Dayna call specifically.

## 4. Open decisions for the HIC

1. **What's the US demand driver (2.1)?** This is the one that changes what Dayna is actually selling — needs an answer before pricing or legal work matters much.
2. **US Sales Jurisdiction — declare now or fold into Connect (2.2)?** RED-zone per the deployment standard; Risto's decision explicitly, not a default.
3. **Entity-formation trigger (2.4)** — what specific signal (an LOI? a specific buyer's procurement requirement?) should trigger forming a US entity, so it's not decided reactively mid-negotiation.

---

**Document Version:** 1.0
**Classification:** INTERNAL / CONFIDENTIAL — planning record, not yet actioned
**Owner:** Risto Anton Päärni
