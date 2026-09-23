# SEO terms → sales: what moves revenue, what is hygiene

# VERSION AND AGENT HISTORY

---

Version: 1.0 [Latest]

Sessions & Modifications:

- Version: 1.0 [Latest] | Tool: Claude Code | Session: claude/blog-drafts-review | Date: 23.09.2026 | Changes: Initial SEO-to-sales rationale for HIC.

Document Status:

- Created: 23.09.2026
- Last Modified: 23.09.2026
- Language: English
- Languages Available: English
- Publication Status: ACTIVE

---

Date: 2026-09-23 · Author: Claude Code (session claude/blog-drafts-review) · For: HIC (Risto Anton Päärni)
Question (HIC 23.09.2026): "miten voisimme hyötyä paremmin SEO termeistä ja saada lisää myyntiä?"

## 1. What the tags shipped today do, and what they don't

- `keywords`, `article:tag` and JSON-LD `keywords` (162 post files, `scripts/blog/seo-tags.mjs`) give each post consistent, approved terminology in its own language. That is **hygiene**.
- Google ignores `<meta name="keywords">`. `article:tag` and JSON-LD `keywords` are weak signals.
- What ranks: the term in `<title>`, `<h1>` and the first paragraph, internal links that use the term, and a page that answers the search.
- The larger fix today was the 36 posts whose JSON-LD headline was another post's headline. Search results could have shown the wrong title.

## 2. Two buyer groups, two term sets

| Group                          | Buyer intent             | Terms (examples)                                                                                                                       | Landing page                                                                                                | Offer                                                |
| ------------------------------ | ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| Finnish SMEs                   | Buy now, price-sensitive | "kotisivut yritykselle hinta", "verkkokauppa pienyritykselle", "yrityksen verkkosivut", "Google Workspace yritykselle"                 | `lifetime-web-starter.fi.html`, `lifetime-webstore-mini.fi.html`, lifetime.fi/fi/ (after the checkout test) | €650 / €350 (VAT 0 %), WhatsApp sales                |
| Industrial / compliance buyers | Research, long cycle     | KYA-S1, "Know Your Agent", "AI agent trust score", "EU AI Act artikla 14 ihmisen valvonta", "Human-in-Command", "sovereign AI Finland" | onelifetime.world posts + term pages (§3)                                                                   | KYA-S1 attestation, Sovereignty Monitor, Aegis pilot |

The industrial terms are ones **we define**: KYA-S1, TRS, the Lease Token and Leash Snap mean nothing elsewhere. Competition is near zero. Anyone who searches them has already read us or a buyer's procurement brief, so these are warm leads.

## 3. Levers, ranked by expected revenue per hour of work

1. **Product structured data on the two web products.** Neither FI page has `Product` + `Offer` JSON-LD (checked 23.09.2026). With price, currency and availability, Google can show the price in results and match the existing Merchant feed (`feeds/google-products.xml`). This is a small change, gated on PR #2085 (same pages) and on the price-injection decision (prices come from products.json, not hand-typed).
2. **Term pages generated from the dictionary.** One page per KYA-S1 term (e.g. `/sanasto/trs/`) in five languages, with `DefinedTerm` JSON-LD, hreflang, links to every post that uses the term (the tagger already knows which), and one CTA. This turns 21 approved terms × 5 languages into about 100 indexable pages from one generator.
3. **One CTA per post, matched to its top tag.** KYA posts → KYA-S1 assessment / meeting; sovereignty posts → Sovereignty Monitor (SOV-T1 €1,299, products.json); web-product terms → WhatsApp sales. Add UTM parameters so a lead shows which post and term brought it.
4. **Measure by term, weekly.** Search Console via the Supermetrics connector (`docs/SEO_SALES_AGENT_SPECIFICATION.md` §4):
   - A term with impressions but a low click-through rate → rewrite the title.
   - A term with clicks but no leads → fix the CTA.
5. **Local search for the SME offer.** Set up a Google Business Profile for Lifetime Oy in Espoo, using the category "web design" and the €650 / €350 offers. Finnish SMEs search locally.

## 4. Honest limits

- SEO does not bring in revenue this month; for new pages, expect 2–4 months before rankings settle. The SME campaign's near-term sales come from WhatsApp, the flyer and direct contact. SEO compounds behind them.
- No claim is made here about traffic numbers. None were measured in this session.
