# Handoff — claude/dws10-ai-maturity-i0a1yv

## What shipped
Added a **DWS IQ Adoption Framework** section to the lifetime.fi homepage,
adapting Microsoft's AI Adoption Framework (Cloud Adoption Framework for Azure)
into Lifetime Consulting's deployment narrative — because Microsoft is a primary
supplier engineers already trust.

- File: `lifetime.fi/index.html` (+ mirror `landing-pages/lifetime-fi/index.html`, byte-identical, synced same commit per Dual Folder Sync Rule).
- Placement: new `#adoption-framework` section between `#consulting` and Invest (the "how we deploy" companion to the three consulting pillars).
- Content:
  - Four lifecycle phase cards mapped to DWS IQ: AI Strategy · Plan & Ready (sovereign AI Landing Zone) · Adopt/Build · Govern, Secure & Manage (Zero Trust / KYA).
  - Outbound reference link to Microsoft Cloud Adoption Framework for AI; explicitly framed as "DWS IQ = EU-sovereign accelerator layer on top of the same lifecycle, not a replacement" (no claim it's a DWS coinage).
  - Maturity ladder (L1 Exploring → L5 Transformational) with L4/L5 highlighted as where DWS IQ deployments land.
  - Three pillar-score cards: Security & Governance (L5), Infrastructure & Operations (L4), Business Adoption & Automation (L3→4).
  - CTA "Book an Adoption Assessment" (risto@onelifetime.world — site convention) + cross-link to consulting pillars.
- New CSS: `.maturity-ladder` / `.maturity-rung` / `.rung-active`.

## Standards applied
- Dual Folder Sync Rule (root + landing-pages mirror in same commit) ✅
- No `.md` published to public-site folder ✅
- Truth Standard: avoided bare "Sovereign Intelligence" / "SI" abbreviation; reused established homepage numbers (25 industries, 50 agents, zero CLOUD Act) ✅
- Brand tone (gold/dark tokens, existing card classes) matched ✅

## Not done / open
- No nav-menu entry added (homepage uses shared ironclad-nav.js; kept change surgical with in-page cross-links instead).
- FI translation of the new section not added — homepage is EN; a FI variant could follow if wanted.

## Follow-up (same session): FI + SV
- **FI**: Adoption Framework section translated and inserted into `lifetime.fi/fi/index.html` (`#kayttoonottokehys`, between Konsultointipalvelut and Sijoita) + maturity-ladder CSS added to that page's style block.
- **SV**: Created `lifetime.fi/sv/index.html` — full Swedish homepage translated from the EN root (hero, coaching, platforms, agents/loops/workflows, industry agents, architecture, sovereignty, consulting three pillars, adoption framework, invest, footer). This **fixes a live broken link**: `shared-assets/vertical-lang-bar.js` already advertised `/sv/` with hero text "Agenter. Loopar. Arbetsflöden." but no page existed. H2 matches the bar's hero text.
- hreflang en/fi/sv wired on all three pages (EN root previously had none); `/sv/` added to `sitemap.xml` (regenerated on deploy by generate-discoverability.mjs anyway).
- Swedish conventions used: FO-nummer (Y-tunnus), Esbo, moms; laskuri kept at `/laskuri/` (Finnish-only page) labeled "Avbrottskalkylator".
- Mirror `landing-pages/lifetime-fi/` fully synced (diff -rq clean).
- Still open: DE/FR pages also advertised by the language bar but don't exist (`/de/`, `/fr/` still 404) — same fix pattern applies if wanted.
