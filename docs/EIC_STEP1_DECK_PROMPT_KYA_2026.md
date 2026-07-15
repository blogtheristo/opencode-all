# EIC Step 1 — 10-Slide Pitch Deck Prompt (KYA-2)

---

## VERSION AND AGENT HISTORY

| Field          | Value                                                         |
| -------------- | ------------------------------------------------------------- |
| Version        | 1.0                                                           |
| Date           | 2026-07-15                                                    |
| Author         | Lifetime Oy                                                   |
| Owner          | risto-001                                                     |
| Status         | Ready — feed to Gamma / designer / slide tool                 |
| Classification | Internal                                                      |
| Introduced-In  | PR-TBD                                                        |
| Branch         | claude/ngi-sargasso-gber-i2l47d                               |
| Companion      | `EIC_STEP1_DRAFT_KYA_2026.md` (narrative — claims must match) |

All figures below are aligned with the Step 1 narrative, the canonical
pricing source (`dws10.com/config/products.json`), and the V4.3 investor
deck. Do not alter numbers in the deck without changing them everywhere.

---

## The prompt

```
Create a 10-slide investor-grade pitch deck for an EIC Accelerator Step 1
application. Audience: 4 independent EIC evaluators (deep-tech, business,
and impact backgrounds) who spend ~10 minutes per deck. Style: sober
European deep-tech, dark background with gold/amber accent (DWS brand),
generous whitespace, one message per slide, no stock photos, no clip art.
Numbers large, sources footnoted small. English.

SLIDE 1 — TITLE / ONE-LINER
Title: "KYA-2 — the European trust standard for AI agents that transact"
Subtitle: "KYC exists for humans. Nothing exists for the agents acting on
their behalf. We built it, it runs in production, and we are standardizing
it for Europe."
Footer: Lifetime Oy · Espoo, Finland · Risto Anton Päärni, Founder & CEO ·
EIC Accelerator Open, Step 1
Visual: single stark line-diagram: human → (mandate) → AI agent → (payment/
action) → counterparty, with a padlock on the mandate edge.

SLIDE 2 — PROBLEM
Headline: "Autonomous agents are starting to pay, order, and commit — and
no one regulates the agent"
Three bullets:
• EU AI Act Articles 12/14/72 enforcement for high-risk systems starts
  August 2027 — record-keeping and human oversight become enforceable, with
  penalties up to 7% of global turnover.
• Every current agent-payment rail (Coinbase x402, Google AP2, Stripe agent
  toolkit) is US-custodial and binds the HUMAN, not the agent: no bounded
  mandate, no revocation, no audit that carries legal weight.
• Compliance officers ask three questions no vendor can answer: who is this
  agent, what exactly may it do, can we prove it afterwards?
Visual: timeline arrow to "AUG 2027 — AI Act enforcement".

SLIDE 3 — SOLUTION
Headline: "KYA — Know Your Agent: identity, mandate, revocation, audit"
Four numbered capabilities, each one line:
1. Agent identity — cryptographically bound to its human/organisational
   principal (eIDAS 2.0-aligned), with a capability manifest.
2. Trust score — continuously updated, gates what the agent may do (in
   production today).
3. Revocable mandate — spend cap, scope, validity window; instantly
   revocable ("Leash Snap", in production for non-payment actions).
4. Article-12-native audit — append-only evidence chains a regulator can
   reconstruct without exposing the principal.
Tagline bottom: "KYA-2 packages this as the open European conformance
standard for agentic AI."

SLIDE 4 — PROOF / TRL
Headline: "TRL 6–7: this is production evidence, not a lab demo"
Left column (running today):
• KYA engine live: trust scoring, identity binding, revocation API
• EU AI Act Article-12 logging pipeline live, append-only, RLS-enforced
• Firecracker MicroVM agent isolation operational
• 50-agent production fleet, 25 regulated industry verticals
• EU-only identity processing contracted (KYC addendum in force)
Right column (the funded TRL 6→8 gap):
• Standardized mandate credential + selective-disclosure proof
• Public conformance suite
• Cross-border pilots (FI→SE) + certification-grade hardening
Visual: two-column "RUNS TODAY / GRANT BUILDS" split.

SLIDE 5 — TRACTION
Headline: "Paying customers before the regulation even bites"
Big numbers row: 6 paying customers · €7k MRR · 0% churn · 25 regulated
industries covered
Below: "Validated pricing from the live catalogue: DWS IQ Aegis €59,990
flagship deployment + agent subscriptions €499–€2,999/mo (typical starter
€999/mo). 12-month roadmap to €60k MRR."
Footnote: single pricing source dws10.com; figures as of July 2026.

SLIDE 6 — MARKET & TIMING
Headline: "Regulation creates mandatory demand — and the window is now"
• Primary: EU enterprises deploying agentic AI in regulated industries
  (energy, manufacturing, construction, logistics, finance, healthcare).
• Secondary: agent-platform vendors + integrators who need a conformance
  standard; payment institutions adding agent-initiated transactions.
• Beachhead: Nordics (Finland live, Sweden via Lifetime AB) → EU via
  partner channels (NVIDIA / IBM / AWS ecosystems).
• Wedge: the open standard creates the category; our implementation
  (Themis) is the reference product in it.
Visual: concentric circles beachhead → EU → standard-adopters.

SLIDE 7 — COMPETITION & MOAT
Headline: "Nobody else can be EU-sovereign, agent-native, AND
compliance-native"
Simple 4-row comparison (columns: EU-sovereign / agent mandate /
AI-Act-native):
• Coinbase x402 — ✗ / ✗ / ✗ (crypto rail, custodial)
• Google AP2 — ✗ / partial / ✗ (binds the human account)
• Stripe agent toolkit — ✗ / ✗ / ✗ (API key ≠ accountable identity)
• KYA-2 (Lifetime) — ✓ / ✓ / ✓
Bottom line: "US players cannot offer EU sovereignty (CLOUD Act). Identity
incumbents verify humans, not agents. Compliance is not our cost — it is
the product."

SLIDE 8 — TEAM & DELIVERY MODEL
Headline: "Founder-led, partner-delivered, agent-multiplied"
• Risto Anton Päärni — Founder & CEO, 35+ years ICT infrastructure; chief
  architect of DWS IQ and KYA; NVIDIA Connect, IBM Business Partner, AWS
  Advanced Consulting Partner; doctoral research (LUT) on agentic commerce
  and trust primitives.
• Lifetime Certified Partners — 100+ engineers across two contracted
  partners (NDA'd, delivering in a live public-sector bid today);
  development under EU controls, data stays EU/EEA, core R&D and IP in
  Finland.
• AI agent fleet — 50 production agents run the company's own operations:
  execution capacity scales without linear headcount.
Visual: three-pillar graphic, not org chart.

SLIDE 9 — PLAN & USE OF FUNDS
Headline: "€2.5M grant → TRL 8 in 24 months"
Milestone bar: M6 spec v1.0 published + first mandate-bound transaction →
M12 reference implementation GA + pilot 1 (FI) → M18 selective-disclosure
proof in production + pilot 2 (SE) + 3 vendors in conformance → M24
certification path with notified body + 10+ conformant implementations +
CEN/CENELEC submission.
Use of funds strip: standard & conformance suite / mandate-layer
cryptography (core funded risk, named) / certification hardening /
cross-border pilots / standardization & ecosystem.
Footnote: 70% EIC / 30% own contribution from revenue + open SAFE round.

SLIDE 10 — THE ASK & WHY EIC
Headline: "Fund the European answer before the US-custodial default wins"
• Ask: €2.5M grant (grant-only, non-dilutive) — TRL 6→8, 24 months.
• Why not VC: investors fund the application layer; nobody privately funds
  open standards, conformance suites, or sovereignty-as-public-good — the
  returns are ecosystem-wide. This is exactly the EIC gap.
• What Europe gets: the trust standard for agentic commerce — sovereign,
  GDPR-native, eIDAS-aligned, open — with a Finnish SME as its steward.
Closing line: "The technology runs. The customers pay. The regulation has
a date. Only the standard is missing — that is what we are asking the EIC
to fund."
Contact: Risto Anton Päärni · Founder, CEO · Lifetime Oy ·
risto.paarni2024@lifetime.fi · +358 400 319 010

DESIGN RULES
• One message per slide; max ~40 words of body text per slide.
• Recurring accent motif: the padlocked mandate edge from slide 1.
• All numbers in the deck appear in the Step 1 written form too — no
  deck-only claims.
• Footer on every slide: "Lifetime Oy · EIC Accelerator Open · 2026".
```

---

## Usage notes

- Feed the block above verbatim to Gamma (`mcp__Gamma__generate`), a
  designer, or any slide tool. It is self-contained.
- If a `[DECIDE]` changes (grant-only vs blended), slides 9–10 must change
  with it — the ask line and the 70/30 footnote.
- Contact email uses the sales-outreach address per CLAUDE.md sender-identity
  rules (EIC application contact = business development context). Legal
  signatory fields in the actual EIC form use `risto.paarni@lifetime.fi`.
- Run `/truth-check` on the rendered deck before upload.

---

**End of prompt.**
