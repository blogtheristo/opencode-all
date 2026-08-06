<!--
VERSION AND AGENT HISTORY
Document: Raw signal — Careers rebuilt as an industrial authority system
Version: 1.0
Date: 2026-08-01
Author: Risto Anton Päärni (risto.paarni@lifetime.fi), Founder, CEO, Lifetime Oy
Owner: Lifetime Oy
Status: Active (raw source — not compiled)
Agent: Claude Code (Opus 5), session claude/ai-pact-enforcement-transparency-gnnipk
Purpose: Raw capture of the 2026-08-01 careers/investor architecture rulings for later /kb compile.
         Compiled reading: docs/field-notes/2026-08-01-careers-industrial-authority-rebuild.md
-->

# Raw Signal — Careers as Industrial Authority (01.08.2026)

**Kind:** Internal architecture ruling (HIC, locked)
**Captured:** 2026-08-01

## The durable rules

1. **One career type: Deputy Captain.** Captain and Admiral are investor roles on a separate path. Deputy Captain is **never** an investment tier and carries no buy-in.
2. **Role template:** `role family × industry × capability × jurisdiction`, with economics and decision rights attached. Jurisdiction is an **operating qualifier in the title**, not a separate career type — it changes deployment, legal, buyer and commercial conditions, not the person's fundamental role.
3. **Every role must state:** industry, capability owned, jurisdiction, customer/revenue motion, decision rights, required evidence of competence, compensation and partnership terms. A role missing any of these is not ready to publish.
4. **The failure modes to avoid, named by Boardy and adopted:** without those fields, "Captain" becomes branding and "Deputy Captain" becomes unpaid ambition.
5. **Captain economics:** `Admiral €250k + 8 counted Captains × €50k = €650k round`. The 9th Captain seat is **dual-use, additive, outside the capital count**. Fill rate is not the point; €650k is the target, not a seat quota. → This makes `LD-2026-014`'s €200k Admiral figure known-wrong; supersession still pending.
6. **Site split:** DWS careers (onelifetime.world) builds industrial authority · lifetime.fi/careers hires Lifetime Fleet · tarkkasiivous.fi hires Lifetime Cleaning · DWS Sales is a future page with no open positions. No mixed promises, no empty AI job listings.

## Canonical facts confirmed (not changed)

- Platform = **25 EU-regulated industries** (`industries.json` v2.0 `industriesServedTotal: 25`). Aegis dual-use tier = **21**. 16 = captain **hats**, not industries. Approved phrase: _"16 captain hats covering 25+ EU industries."_

## Engineering pattern worth reusing

**Scroll-in reveal** (`dws10.com/shared-assets/motion/reveal.js`), adapted from `github.com/blogtheristo/cari`. The transferable rule: **an opacity effect must never leave content invisible.** Backstop timer force-shows anything the observer missed; `prefers-reduced-motion` and print show immediately rather than shortening the fade; every hiding rule is scoped under a `.js` class the script sets itself, so JS failure means visible, not blank.

**Testing note:** absolute `/shared-assets/` paths do not resolve over `file://` — the script silently 404s and the effect looks broken. Verify shared assets over HTTP.

## Compiled reading

`docs/field-notes/2026-08-01-careers-industrial-authority-rebuild.md` — full rulings, drift found, and the open HIC question on the unlabeled AI-persona photos (Article 50, enforcement live since 2 Aug).
