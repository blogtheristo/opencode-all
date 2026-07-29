# LSJ Blog Content Audit — 2026-07-29

***

# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:

- Version: 1.0 | Tool: Claude Code (Opus 5) | Session: claude/blogi-linkit-kohteet-f1j1cm | Date: 29.07.2026 | Changes: Initial audit. Full sweep of all 115 published posts on `onelifetime.world/posts/**` plus `/blog/index.html` for currency, factual accuracy, and style. Findings only — no content edits applied.

***

Document Status:

- Created: 29.07.2026
- Language: English
- Publication Status: ACTIVE (internal)
- Document Type: Audit report
- Owner: Risto Anton Päärni

***

## 1. Scope and method

**Corpus:** 115 published posts (`onelifetime.world/posts/` 62 + `posts/en/` 27 + `posts/fi/` 24 + `posts/de/` 1 + `posts/fr/` 1) plus `onelifetime.world/blog/index.html`. Two `_template-*.html` files excluded. The blog exists only at `https://onelifetime.world/blog/` — no other site carries one.

**Checks run:**

- `scripts/lint-truth-claims.mjs` over the full corpus (from repo root, so the mirrors load) — **0 fail / 0 warn**.
- Canonical-fact reconciliation against `DWS_TRUTH_STANDARD.md` (agent count, industry count, moats, capital classes), `dws10.com/config/products.json` + `Store/PRODUCT_AEGIS.md` (prices), `Legal/KYA_STANDARD_v1.md` (KYA version), `DWS_ARTICLE_12_LOGGING_STANDARD.md` (retention).
- Mechanical sweeps: author-name spelling, email addresses, price strings, numeric claims, Finnish orthography, internal link targets, sitemap coverage, AI-disclosure coverage, publication metadata.

**Not covered:** external factual claims that need an online source (vendor specs, third-party funding rounds, quoted benchmark numbers). Those are listed in §5 as *verify before reuse*, not asserted as errors.

## 2. Blockers

### B1 — Finnish orthography destroyed in 22 posts

`posts/fi/day-001` … `day-021` and `posts/fi/markkinasignaali-visman-myynti-2026.html` are published with every ä/ö stripped: `tekoäly`→`tekoaly`, `järjestelmä`→`jarjestelma`, `päättelyyn`→`paattelyyn`, `kiinteistöt`→`kiinteistot`, `pitää säilyttää`→`pitaa sailyttaa`, `Käytännön`→`Kaytannon`. It is in titles, `<title>` tags, meta descriptions and body text.

The damage is confined to the March–April 2026 "800-day" batch. Every other Finnish post is clean (`ontologia-tiimin-aivoissa` 182 diacritics, `palokunnat-droonitorjuntayksikot` 347, `tiedon-vanheneminen-sensoridata-retention` 266), so this is a one-off generator/encoding fault, not house style.

Impact: 22 public pages in the company's home-market language read as machine-mangled. Highest-severity item in this audit.

### B2 — Two `_DRAFT` files are live pages

- `posts/deepseek-v4-flash-hybrid-inference_DRAFT.html` (2026-06-27) — no draft marker, no `noindex`, fully rendered.
- `posts/greg-isenberg-agents-need-a-signature_DRAFT.html` (2026-07-24) — carries the word DRAFT, no `noindex`.

Neither is linked from `/blog/`, but both resolve at their public URL. Under Non-Negotiable Rule 13 an unapproved draft must not be reachable. Decide per post: publish properly (rename, index, HIC approval on record) or remove.

### B3 — Aegis price on the blog contradicts the canonical tier table

`posts/eu-ai-act-omnibus-2026.html` advertises **"Aegis Sovereign Tier — €12,999"**.

Canonical (`Store/PRODUCT_AEGIS.md` §tier table): Aegis Standard €59,990 + €999/mo; Aegis Defence €89,990 + €1,999/mo; **Aegis Sovereign = Custom + €4,999/mo**. €12,999 matches no tier, no SKU, and nothing in `dws10.com/config/products.json`. A public page quoting a €12,999 price for a custom-priced sovereign tier is a live commercial exposure.

## 3. Factual errors

### F1 — "Article 12 requires logging for at least 7 years" (3 posts)

`eu-regulation-harness-engineering.html`, `harness-engineering-investor-note.html`, `buyers-note-harness-engineering.html`.

DWS's own `DWS_ARTICLE_12_LOGGING_STANDARD.md` §4 sets the minimum at **6 months** (Art. 26(6)); the 10-year figure belongs to serious-incident reports (Art. 73). There is no seven-year period anywhere in the AI Act's logging regime. The buyer's-note version turns it into a procurement question — *"Can you show me the audit trail for any agent action from the last 7 years?"* — which invites a customer to test us against a requirement that does not exist.

### F2 — "Article 50 … Live now … active today" (1 post)

`eu-ai-act-omnibus-2026.html` (7 May 2026) lists Article 50 transparency obligations under **"Live now"** and states disclosure duties are "active today".

Article 50 applies from **2 August 2026** (Art. 113) — as registered in our own `DWS_TRUTH_STANDARD.md` §2G. On the publication date the claim was wrong. It becomes true on 2 Aug 2026, four days from this audit, so the cheapest fix is to restate it as a date rather than as "today".

### F3 — Deprecated agent count "18+ AI agents" (14 posts)

The CTA block carries *"18+ AI agents for EU compliance automation"*. Canonical is **50 production agents** (`src/agents/AGENT_ROSTER.json`, Truth Standard row 19), and `18+ Industry Agents` is a logged drift incident. The lint misses this because its deprecated-phrase list contains only the `Industry Agents` wording — the `AI agents` variant slips through.

Affected (all recent, so it is in the current template): `ai-supercomputing-meets-eda-sovereign-design`, `ala-treenaa-base-mallia-omista-evidenssikerros`, `brexit-interdependence-moat-us-eu` (EN+FI), `dont-train-a-base-model-own-the-evidence-layer` (EN/DE/FR/SV), `eu-sovereign-ai-factories-35-supercomputers`, `industrial-intelligence-weekly-2026-06-28`, `nvidia-halos-robotics-physical-ai-safety`, `nvidia-jetson-thor-physical-ai`, `the-moats-we-hand-you` (EN+FI).

Secondary fix: add `18+ AI agents` / `18 domain agents` to `AGENT_ROSTER.json.deprecatedDisplayPhrases` so the lint catches the next variant.

### F4 — KYA version claims are stale

`kya-standard-v1.html` hero reads **"Current: KYA Standard v1.7"** while its own clarification box says the public name is v1.5 and v1.7 is internal metadata — the page contradicts itself in two screens. Both numbers are now out of date: `Legal/KYA_STANDARD_v1.md` is titled v1.5 with internal **Version 1.11**. `kya-standard-v1-5-what-changed.html` repeats the v1.7-as-internal-metadata claim.

### F5 — "100% EU AI Act Compliant" (3 posts)

`eu-regulation-harness-engineering.html`, `buyers-note-harness-engineering.html`, `eu-ai-act-compliance-ready.html`.

An absolute conformity claim against a regulation whose high-risk obligations had not yet applied when the posts were written. It is unfalsifiable, unauditable, and fails Truth Standard Pillar 3 (the Ari test — risk removed or leverage gained, quotable in procurement). Restate as what is actually built: Article 12 logging live, Article 14 oversight implemented as HIC, retention per Art. 26(6).

### F6 — "DWS IQ 6 exceeds 95% on the OpenAI Agent Harness Index"

`eu-regulation-harness-engineering.html` headline and `<meta description>`. There is no OpenAI-published "Agent Harness Index"; the body correctly calls it *"our current assessment"* against OpenAI's eight harness principles. The headline promotes an internal self-score to an external benchmark. This is also the exact pattern the MGD/CRC doctrine names as an anti-game (*benchmark scores / model rankings* as a headline metric, Truth Standard row 29).

## 4. Style and consistency

### S1 — Author name: three variants, one correct

| Variant | Files |
| --- | --- |
| `Risto Anton Päärni` (correct) | 10 |
| `Risto Anton Paarni` (no umlauts) | 46 |
| `Risto Anton` (surname dropped) | 65 |

Occurs in visible bylines, `<meta name="author">`, and JSON-LD `author.name`, so it also propagates into search results and share cards. `CLAUDE.md` §Sender Identity is explicit: `paarni` without umlauts is permitted **only** inside an email address. One file carries both spellings.

### S2 — Title: "CEO, Lifetime Oy" vs canonical "Founder, CEO"

35 files use bare `CEO, Lifetime Oy`; 8 use the canonical `Founder, CEO`.

### S3 — Missing publication metadata (10 posts)

No `article:published_time`: `ai-pricing-capitulation-our-approach-solid`, `business-case-logistics`, `buyers-note-harness-engineering`, `dws-ontology-standard-v1`, `eu-ai-act-compliance-ready`, `eu-regulation-harness-engineering`, `harness-engineering-investor-note`, `interruption-cost-hidden-tax-ai-operations`, `kya-standard-v1`, `fi/dws-ontologia-standardi-v1`.

Also missing `rel=canonical`: `business-case-logistics`, `dws-ontology-standard-v1`, `kya-standard-v1`, `eu-regulation-harness-engineering`.

### S4 — Finnish translations are half-length

The `fi/day-*` posts average ~475 words against ~980 for their English counterparts — roughly 50% content parity, not a translation. Combined with B1, the Finnish day-series needs a rebuild rather than a patch.

### S5 — Broken internal link `/policy.html` (2 posts)

`business-case-logistics.html` and `kya-standard-v1.html` link to `/policy.html`, which does not exist. Correct target: `/privacy-policy/`.

### S6 — Editorial cadence has stalled

`/blog/` still features **"Lifetime Scope Monthly #8 — The Agent-Native Window Opens"** (19 April 2026) as the current issue, and `industrial-intelligence-weekly-2026-06-28` is the only "Weekly". A monthly masthead three issues behind and a weekly that ran once read as an abandoned publication.

## 5. Distribution and compliance gaps

### D1 — Sitemap contains zero blog posts

`onelifetime.world/sitemap.xml` lists 17 hub pages. **None of the 115 posts is in it** — `/blog/` is listed, the posts under it are not. The whole editorial corpus is invisible to crawlers except through in-page links.

Adjacent defect in the same generator (`scripts/on-deploy/generate-discoverability.mjs`): `robots.txt` contains the malformed line `Disallow: /out (`.

### D2 — 12 posts unreachable from `/blog/`

Not linked from the index: `brandkarer-dronarforsvars-enheter`, `iceye-jgi-sar-conservation-signals`, `interruption-cost-hidden-tax-ai-operations`, `six-notes-to-the-commission`, `sovereignty-field-note-2-three-pillars` (EN + FI), `palokunnat-droonitorjuntayksikot`, the three `dont-train-a-base-model` translations (DE/FR/SV), and the two `_DRAFT` files.

`sovereignty-field-note-2-three-pillars.html` is registered in `DWS_TRUTH_STANDARD.md` row 16 as the public popular-language mirror of the three-pillar model — and it is orphaned.

### D3 — One translation lacks the Article 50 AI-disclosure

`brandkarer-dronarforsvars-enheter.html` (SV, 2026-05-15) is a translation of the fire-brigades post and carries no AI-generation/machine-translation notice. The DE, FR and SV versions of `dont-train-a-base-model-own-the-evidence-layer` all carry a correct one.

**Article 50(4) applies from 2 August 2026 — four days from this audit.** Either add the disclosure, or put a human review + named editorial owner on record so the carve-out in Truth Standard §2G applies.

## 6. Verify before reuse (external claims, not checked online)

- `kya-standard-v1-5-what-changed.html`: ICEYE constellation figures ("60+ satellites, 16 cm Gen4 resolution"); the Agentic Efficiency Law coefficients ("0.7–2.2% OPEX per 1%", "11–30% benchmarked", "8–22× ROI within 18 months") are DWS-internal and should carry their source.
- `eu-regulation-harness-engineering.html`: "gpt-5.2-codex improved from 52.8% to 66.5%"; "3.5 pull requests per engineer per day".
- `eu-ai-act-omnibus-2026.html`: the AI Omnibus provisional-agreement narrative and the SME threshold ("750 employees / €150M turnover").
- `moat-is-not-the-model.html`: NVIDIA hardware prices (Nano Super €764, Orin NX 16 GB €1,990, AGX Orin 64 GB €2,494) — hardware pricing moves; a dated "prices as of" line would hold up better.
- `baseten-inference-engineering-300m.html`, `eu-sovereign-ai-factories-35-supercomputers.html`, `nvidia-*`: third-party funding and product announcements.

## 7. Clean

- `scripts/lint-truth-claims.mjs`: 0 fail / 0 warn across all 115 posts.
- Industry count: "25 EU-regulated industries" everywhere it appears (10 posts) — correct, no `16`/`20`/`8` survivors.
- No deprecated god/pantheon agent taxonomy in any post.
- No moat-count drift ("20 moats" / "21 moats") in any post.
- No `noreply@` senders; no secrets, tokens or PII; no `TODO`/`Lorem ipsum`/unfilled `{{PLACEHOLDER}}` outside the two template files.
- Standard CTA prices €4,999 / €499 / €6,500 (38 posts) reconcile exactly with `dws10.com/config/products.json`; €14,999 FPE reconciles with the `lifetime.fi` product page (though FPE is absent from `products.json` — worth registering).
- Internal links: only `/policy.html` is broken across the whole corpus.
- Finnish and Swedish root-level posts are orthographically clean.

## 8. Recommended order

1. **B1** Finnish orthography (22 pages, home market) — regenerate from sources with UTF-8 preserved.
2. **D3 + B2** before 2 Aug 2026 — SV disclosure, drafts resolved.
3. **B3, F1, F2** — wrong price, wrong retention period, wrong applicability date.
4. **F3 + lint hardening**, **F5, F6** — claim discipline.
5. **S1, S2** — author identity sweep (a mechanical pass over 111 files).
6. **D1, D2, S5, S3** — distribution and metadata.
7. **F4, S4, S6** — version currency, translation parity, cadence.
