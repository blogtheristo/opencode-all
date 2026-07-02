# Decision Memo: Pause Standalone Ontology Productization — Fold Into Bundled Sovereign Platform Trust Layer

---

VERSION AND AGENT HISTORY

- Version: 1.1
- Status: SUPERSEDED — see `docs/plans/2026-07-02-firehorse-ontology-upsell-chain.md`
- Classification: INTERNAL
- Document type: Decision Memo
- Author: Claude Code (claude-sonnet-5) + risto.paarni2024@lifetime.fi
- Date: 2026-07-02
- Location: Espoo, FI (Lifetime Oy HQ)
- Session: claude/tokenization-economy-ai-moat-zwfrr8

Sessions & Modifications:

- Version: 1.0 | Tool: Claude Code (claude-sonnet-5) | Date: 02.07.2026 | Changes: Initial decision memo. Triggered by §8 of `2026-07-02-karp-tokenization-economy-ai-moat.md` (Karp: "critical infrastructure does not run these models without an application layer... they're buying it because they have to be made safe") and Risto's read that standalone ontology-as-SKU is currently too heavy a claim to keep active, with the option to reopen later.
- Version: 1.1 | Tool: Claude Code (claude-sonnet-5) | Date: 02.07.2026 | Changes: SUPERSEDED same day. Risto's follow-up call: a separate ontology product line is in fact the DWS-vs-Palantir differentiator, not a liability — rebrand it as "Firehorse Ontology" inside the existing Firehorse product family and design a cross-Firehorse upsell chain. See the successor memo for the reasoning that reconciles this with §8's trust argument.

Related Documents:

- `docs/field-notes/2026-07-02-karp-tokenization-economy-ai-moat.md` §8 (source argument for this decision)
- `docs/plans/2026-06-22-lwm-ontology-v1-500-enterprises.md` §10 (the SKU definitions this memo pauses, not deletes)
- `dws10.com/config/products.json` + `landing-pages/dws10-com/config/products.json` (dual-folder mirror; live SKU entries, unchanged by this memo)
- `DWS_PRODUCT_STANDARD.md` (canonical product registry — still has a pre-existing sync gap, independent of this decision, see §4)
- `dws10.com/products/lwm-ontology.html` (product detail page, unchanged by this memo)

---

## 1. Decision

**Standalone ontology-as-a-product is paused as an active claim, not deleted.** Risto's call, 02.07.2026: "we can open ontology product line later if found useful. at this stage its too heavy claim to keep."

Rationale: today's field note (§8) surfaces a direct positioning conflict. Karp's own argument — the one DWS is citing approvingly as the trust-layer thesis — is that an application/ontology layer earns critical-infrastructure trust _because_ it is architecturally inseparable from the platform. A component sold off a price list, swappable and unbundled, is structurally the kind of thing Karp says "doesn't cut it at this level." Marketing DWS ontology both ways at once (a purchasable SKU _and_ an inseparable trust layer) is an internal contradiction, not two complementary claims.

**This is a pause on the _claim_, not a retirement of the underlying capability or the existing pricing entries.** No files under `dws10.com/config/products.json`, the landing-pages mirror, or `dws10.com/products/lwm-ontology.html` are modified by this memo. Those are business/revenue-affecting changes (see §3) and are explicitly out of scope here.

## 2. What this means operationally, right now

- **Do not** produce new external positioning, sales copy, or a landing-page push that markets Ontology as a standalone, buyable product line (`LWM-ONT-IND`, `LWM-ONT-SUITE`, `LWM-ONT-SOVEREIGN`, `LF-ONTOLOGY-25`, `LF-TRAIN-IND`) while the bundled-trust argument is the active public narrative.
- **Do** keep leaning on the bundled framing established in today's field note (§2.2, §8): ontology is part of what makes the Sovereign Platform / Control Room engagement trustworthy, not a separable line item.
- The five SKUs in `products.json` are left as-is (see §3) — this memo does not silently orphan live pricing without a business decision on existing/potential subscribers.

## 3. What is explicitly NOT decided here (needs a separate, scoped session)

Retiring or repricing the five live SKUs is a revenue/contract-affecting change and was intentionally kept out of this memo:

- Whether any of the five SKUs have active paying subscribers (unverified here — no Stripe/Supabase check was run this session).
- If subscribers exist: standard contract terms typically require honoring the current term (grandfather), not silent cancellation.
- Whether to formally retire the SKUs from `products.json`, mark them `status: paused`, or leave them live while positioning shifts.
- Whether/how to update `dws10.com/products/lwm-ontology.html` and the dual-folder mirror.

Recommend a dedicated, separately-scoped task for that work — it is a product-catalog change, not a field-note/positioning change, and mixing it into this PR would violate the "keep edits scoped" rule.

## 4. Independent, pre-existing gap (unaffected by this decision either way)

`DWS_PRODUCT_STANDARD.md` (the canonical product registry per `DWS_TRUTH_STANDARD.md` row 2) has zero mentions of any of the five ontology SKUs, even though they've been live in `products.json` (the _mirror_, per that same registry) since the 22.06.2026 pivot. This canonical/mirror mismatch exists regardless of whether ontology ends up sold standalone or bundled, and should be resolved either way — either by documenting the SKUs in the standard (if kept live) or by noting their paused status there (if paused). Flagging it here so it isn't lost; not resolving it in this memo since it depends on the §3 decision.

## 5. Reopening later

If the bundled-trust positioning proves limiting (e.g., a mid-market prospect wants ontology-only without the full sovereign engagement), the existing SKU definitions in `docs/plans/2026-06-22-lwm-ontology-v1-500-enterprises.md` §10 and the live `products.json` entries are the ready-made starting point — nothing here needs to be rebuilt from scratch.

---

**Status:** ✅ Decided (claim paused) — 🟡 Open (§3 catalog action deferred to a dedicated session)
**Confidence:** HIGH (positioning conflict is real and directly sourced from this session's verified Karp quotes)
**Impact:** Strategic (prevents DWS from publicly holding two contradictory ontology positioning claims at once)
