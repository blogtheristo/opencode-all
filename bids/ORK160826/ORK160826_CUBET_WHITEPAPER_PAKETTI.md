# Whitepaper Package for Cubet — ORK/1462/2026

## Curated reading & sharing package for the subcontractor engagement

**For:** Cubet Techno Labs (Kochi) · **From:** Lifetime Oy · risto.paarni@lifetime.fi

---

Version: 1.0 | 2026-06-28 | Claude Code (Opus 4.8) | Draft

---

This package gives your AI Engineers and Software Developers the context they need to deliver on the
ORK engagement inside the DWS IQ capability platform. Read in this order. All files live in the repo;
ask for branded HTML or PDF exports as needed.

## 1. Start here — what we stand for

- **WP01 — Augment, Not Replace** — `docs/whitepapers/WP01_AUGMENT_NOT_REPLACE.md` (+ `.html`)
  The ethical position: capability, not headcount; agents augment your consultants, never replace them.
  This is the principle the whole engagement runs on.

## 2. The sovereignty foundation (mandatory for a government client)

- **European Sovereign Industrial Intelligence v1.0** — `Learn/sovereign-industrial-intelligence-whitepaper-v1.0.html`
  Why data stays in the EU/EEA and what "sovereign AI" means in practice.
- **KYA Specification — IDV Provider Certification v1.0** — `Learn/KYA-IDV-CERT-Whitepaper-v1.0.html`
  (published: `dws10.com/kya-standard/whitepaper/`) — Know Your Agent governance: cryptographic agent
  identity, Firecracker MicroVM isolation, <125 ms kill authority, the audit basis for every AI action.
- **Shufti KYA whitepaper** — `docs/field-notes/2026-03-17-shufti-kya-whitepaper.md` — identity-verification
  provider certification under the KYA specification.

## 3. The engagement-specific annexes (this bid)

- **Cubet capability annex** — `bids/ORK160826/ORK160826_CUBET_KYVYKKYYDET.md` (+ `.html`)
  How DWS capabilities harness/augment your AI Engineer & Software Developer roles, mapped to the RFP
  required skills (Lots 1 & 3), within the EU-sovereign working model.
- **Permanent capabilities to ORK** — `bids/ORK160826/ORK160826_KYVYKKYYDET_ORK.md` (+ `.html`)
  The standing capability layer the client receives across the framework (2+1+1). Read this to see the
  whole picture your work plugs into.
- **Sovereign implementation (hardware)** — `bids/ORK160826/ORK160826_SUVEREENINEN_TOTEUTUS.md`
  Control Room / Situation Room NVIDIA configurations.

## 4. Background (optional, deeper context)

- **Konsultoinnin käsikirja 2026** — `docs/KONSULTOINNIN_KASIKIRJA_2026.md` (handbook v1.75): §6 capability
  model + lifecycle, §4 Living World Model, §2 ethics. The canonical source for the capability catalogue.

## Bundling for LLM upload

To produce a single concatenated bundle (e.g. for a large-context LLM), run:
`node scripts/bundle-whitepapers-for-llm.cjs` — the manifest in that script is the canonical inventory.

## Reading guide by role

- **AI Engineer:** WP01 → KYA-IDV-CERT → Cubet annex → handbook §6
- **Software Developer:** WP01 → Sovereign Industrial Intelligence → Cubet annex (lifecycle: Development/Deployment)

---

**Lifetime Oy** · Business ID 0772407-9 · An existing NDA covers this package. Do not redistribute
outside Cubet without written consent.
