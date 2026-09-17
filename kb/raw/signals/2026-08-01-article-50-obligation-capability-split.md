<!--
VERSION AND AGENT HISTORY
Document: Raw signal — Article 50 obligation–capability split; persona retirement; reveal at 2.5s
Version: 1.0
Date: 2026-08-01
Author: Risto Anton Päärni (risto.paarni@lifetime.fi), Founder, CEO, Lifetime Oy
Owner: Lifetime Oy
Status: Active (raw source — not compiled)
Agent: Claude Code (Opus 5), session claude/retire-ai-personas
Purpose: Raw capture for later /kb compile. Compiled reading: docs/field-notes/2026-08-01-persona-retirement-and-reveal.md
-->

# Raw Signal — Article 50 Split, Persona Retirement, Reveal (01.08.2026)

**Kind:** Regulatory finding + internal ruling + engineering pattern

## The durable regulatory finding (now PhD §14.46 / Key Contribution #51)

**Obligation–capability split.** Article 50(2) binds *providers* to machine-readable marking; 50(4) binds *deployers* to perceivable labelling. The party carrying the visible duty depends, for the durable machine-verifiable half of the evidence, on a party it does not control. Content-layer instance of the same problem the KYA model-provenance predicate addresses at the agent layer.

**Design rule, implementation-derived (negative finding):** *a marking applied at the presentation layer is a caption, not a marking.* An HTML/CSS overlay satisfies visibility on the page and fails on download or re-share. The rule's real demand is **provenance that survives egress** — the same property C2PA asserts and the Article 12 chain requires. Only compositing the mark into the media itself qualifies.

**Grace-period asymmetry:** marking (provider, machine-readable) deferred to Dec 2026; deepfake labelling (deployer, human-perceivable) not deferred. So **deployer-side labelling is the near-term binding constraint** — the inverse of the intuitive ordering.

**~190 pre-mandate signatories** to the voluntary Code of Practice is an evidentiary-cost signal, not an ethical one: the Code confers presumption of compliance. Signatory count is a leading indicator of the de-facto standard ahead of harmonisation.

## Internal ruling

The four AI-persona "team members" (Rocky/Adrian/Marcus/Sofia) are **retired**, not labelled — they were being replaced by real Industry Captains, only Rocky mapped to an actual workflow (`/plan-ceo-review`), and the portraits were mismatched to their roles. They existed on **two** homepages (dws10.com and onelifetime.world). Image files kept on disk, de-referenced only (Rule 6). This closes the last Article 50 exposure on live pages.

## Engineering pattern

`reveal.js` fade set to 2.5s. Two bugs found by verifying rather than assuming:

1. **A safety net timed equal to the effect cancels the effect.** Backstop at 2500ms with a 2500ms fade meant any page that took ~2.5s to load lost its animation entirely. Backstop must sit clear of the effect (now 6s).
2. **A rescue path must not re-enter the slow path.** The backstop added `is-visible`, which started another 2.5s fade — up to 5s to readable on the failure path. Rescue now sets `opacity:1; transition:none`.

**Testing note:** headless Chromium reports `prefers-reduced-motion: reduce` by default, so a fade will correctly measure as `0s` unless the test sets `reducedMotion: 'no-preference'`. Absolute `/shared-assets/` paths also 404 silently over `file://`.

## Process note

`PHD_FIREHORSE` version history is **not** strictly ordered — 3.93 was not the head (3.94, 3.95 existed above it). Read the declared `Version:` field at the top, not the first history line, before numbering a new entry.
