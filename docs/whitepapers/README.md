# DWS / Lifetime Oy — Whitepaper Series 2026

Standalone thought-leadership and buyer-education whitepapers, extracted thematically
from the Konsultoinnin käsikirja 2026 (`docs/KONSULTOINNIN_KASIKIRJA_2026.md`) and supporting
canonical sources. Each whitepaper is self-contained: it can be read, shared, and published
independently of the handbook.

**Authoring method:** Use the `/dialog` skill (HIC-confirmed, section-by-section). Facts are
resolved against canonical sources (products.json, INDUSTRIES.md, DWS*TRUTH_STANDARD.md)
before any claim is published. Every whitepaper preserves the ethical line: \_agents augment,
never replace — capability, not headcount* (§2 Ihmiskeskeisyys).

**Output per whitepaper:** Markdown source + branded HTML (generated). Markdown never
published to public-site folders (CLAUDE.md Non-Negotiable Rule 5).

---

## Series plan

| ID   | Title                                                                                    | Source §           | Audience                    | Hook                                                                                  | Priority    |
| ---- | ---------------------------------------------------------------------------------------- | ------------------ | --------------------------- | ------------------------------------------------------------------------------------- | ----------- |
| WP01 | Augment, not replace — the ethical AI position for European industry                     | §2 + §6            | C-suite, public debate      | Counter to "AI replaces headcount" (Tycoon/Meta); capability not headcount            | **1 (now)** |
| WP02 | From 72 IT roles to 88 agent capabilities                                                | §6                 | CIO / CTO                   | Roles re-cast as capabilities/skills/workflows/Gödel loops                            | 2           |
| WP03 | The Living World Model — why sovereign ontology needs continuous maintenance             | §4                 | CISO / CDO                  | The subscription rationale: regulation evolves, the LWM must too                      | 2           |
| WP04 | The Forced Purchase Timeline — EU regulation as a buying calendar                        | §11–§12            | CFO / Sustainability        | CBAM 2026 → ETS2 2027 → EPBD 2028 → Fit for 55 2030                                   | 2           |
| WP05 | Sovereign defence & dual-use intelligence with Aegis                                     | §3                 | Defence / CISO              | Air-gapped, SAR, export control, EU AI Act Art. 12                                    | 3           |
| WP06 | Living strategy 2026 — scenario analytics without guessing probabilities                 | §8                 | Strategic leadership        | Risto's 7-step method + AI probability calculation                                    | 3           |
| WP07 | Capabilities across the product lifecycle — Prototyper to Maintainer, human + agent      | §6 lifecycle       | Product / eng leaders       | Boris Cherny archetypes × DWS maturity mix                                            | **done**    |
| WP08 | KYA — Know Your Agent: cryptographic agent governance under the EU AI Act                | §11 + §13          | Security / compliance       | **EXISTS — extend/refresh, don't duplicate** (see Existing whitepapers)               | —           |
| WP09 | The customer story by buying stage — Buffet, Captain, Vineyard                           | §9–§10             | Sales enablement (internal) | Stage-matched offers; ORK / Outokumpu / Kemira                                        | 3           |
| WP10 | Cross-industry intelligence — why a 25-industry ontology beats single-vertical tools     | §5 + Industrial IQ | Industrial buyers           | **OVERLAPS existing Sovereign Industrial Intelligence WP — refresh, don't duplicate** | —           |
| WP11 | Agentic Commerce 2027 — from platform fee to per-capability billing                      | §11 roadmap        | Investors / forward buyers  | Transaction-based agent billing; Stripe-based; EU-sovereign                           | 4           |
| WP12 | The Firehorse Production Model — software products as a repeatable manufacturing process | Firehorse line     | Investors / founders        | Build → sell → feedback → improve, closed loop                                        | 4           |

---

## Sales-path proposals (30.09.2026)

`SALES_WHITEPAPER_PROPOSALS.md` re-ranks the series around live pipeline paths: WP13 _When the link drops_ (Aegis Pilot), WP14 _Batch-level PCF_ (Kemira), WP15 _Containment is not evidence_ (CISO), WP16 _Article 50 for agent operators_, WP17 _Buying AI under €60,000_ (Finnish agencies), WP18 _Pricing an agent before it runs_. WP05 folds into WP13 as a Defence annex; WP04 becomes the regulatory-calendar section of WP14 and WP16. Every new paper follows `docs/BLOG_STANDARD.md` §17 (customer value, ≥3 sources with ≥1 academic, routes, demo only from `products.json`).

## Existing whitepapers (reconcile — do not duplicate)

The repo already ships whitepapers. New WPs must extend or refresh these, not replace them.
Canonical inventory is the manifest in `scripts/bundle-whitepapers-for-llm.cjs`.

- **European Sovereign Industrial Intelligence v1.1** — `Learn/sovereign-industrial-intelligence-whitepaper-v1.2.html` (v1.2 30.09.2026: AI Act/CSRD dates, 50 production agents, contact; v1.1 23.09.2026: €4,999 one-time; older versions kept) (overlaps WP10)
- **KYA Specification — IDV Provider Certification (whitepaper v1.1; specification KYA-IDV-CERT v1.0)** — `Learn/KYA-IDV-CERT-Whitepaper-v1.2.html` (v1.2 30.09.2026: remaining "standard" wording, high-risk date; v1.1 23.09.2026: "KYA Specification"; older files kept) + published at `dws10.com/kya-standard/whitepaper/` (mirror `landing-pages/dws10-com/`) (overlaps WP08)
- **Shufti KYA whitepaper** — `docs/field-notes/2026-03-17-shufti-kya-whitepaper.md` + `Learn/2026-03-17-shufti-kya-whitepaper_v1.2.html` (v1.2 30.09.2026: same fixes as KYA-IDV-CERT v1.2)
- **Bundling:** `node scripts/bundle-whitepapers-for-llm.cjs` concatenates the canonical inventory for LLM upload.

## Drift audit 30.09.2026 — open items (HIC)

- **Agent count conflict:** Truth row 19 = 50 production agents (code-derived); row 36 = 58 agents (handbook capacity line). SII v1.2 uses 50; WP01 still says 58. Pick one canonical figure.
- **Public KYA page** (`dws10.com/kya-standard/whitepaper/`, both folders): Art. 12 sets no "5 years" retention (Art. 19 / 26(6): at least 6 months); NIS2 Art. 23 is 24 h / 72 h / 1 month reporting, not "sub-second telemetry"; footer says Helsinki (Espoo). Public copy — fix only after HIC approval.
- **Compliant by Construction:** "Lifetime Fleet (Mobile) Control Room" names and an IGX Thor "mill-floor brain" are not in `products.json` (sold: GN100 Control Room, IGX Orin, Thor Mobile Office). Needs the HIC's product naming.
- **WP07:** "FuelEU ahead" — FuelEU Maritime applies since 01.01.2025.
- **§17.2 sources:** no whitepaper yet has `customer_value`, ≥3 sources with ≥1 academic, or `claims_checked`. Retrofit when each is next revised.
- **KYA fee tables** (IDV-CERT, Shufti) are not in `products.json`.

## Status

- WP01 — DRAFT (this batch)
- WP07 — DRAFT (this batch)
- WP08, WP10 — superseded by existing whitepapers above; refresh in place rather than authoring new
- WP02–WP06, WP09, WP11, WP12 — proposed, awaiting prioritization per HIC

## Conventions

- Filename: `WP<NN>_<SHORT_SLUG>.md` (+ generated `WP<NN>_<SHORT_SLUG>.html`)
- Each WP carries a `VERSION AND AGENT HISTORY` block (`***` delimiters) per DWS_DOCUMENT_STANDARD.
- Length target: 4–8 pages (≈1500–3000 words). Whitepapers educate; they do not pitch.
- Legal identity (Lifetime Oy, 0772407-9) per CLAUDE.md Legal Identity Rule.
