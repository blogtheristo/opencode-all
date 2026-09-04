---
title: Price List Generator — Governance Metadata Stamping
date: 2026-09-04
tags: pricing, compliance, metadata
---

# Price List Generator — Governance Metadata Stamping

## Summary

Fixed `scripts/gen-price-list-html.cjs` to stamp governance metadata (model, validity date, subscription billing notice) into each generated price-list HTML snapshot. This ensures downstream price-list artifacts carry compliance-required metadata without manual insertion.

## What Changed

**Commit:** `58bd0e575`

Updated the price-list HTML generator to inject:

- Model/product governance marker
- 90-day validity date (stamped at generation time)
- Subscription billing notice (5-language VAT disclosure)

Price-list snapshots (versioned at `dws10.com/price-list/versions/price-list-v<version>.html` and mirrored to `landing-pages/dws10-com/price-list/versions/`) now carry these stamps automatically on each run.

## Why

Governance compliance and audit trail: every buyer-facing price list must carry:

1. What product version it reflects
2. When it expires (validity window)
3. Billing model (subscription vs. one-time)
4. VAT implications (5-language notice)

Previously these were either manually inserted or missing; now they're generated.

## Next Steps

- Price-list cron job (`scripts/on-deploy/regen-price-list.sh`) already invokes the updated script on deploy.
- Dual-folder sync (rule: source → mirror in same commit) is maintained.
- No action required — governance requirement satisfied.

---

## Blog Drafts Parked

Eight blog drafts are awaiting HIC approval (Rule 13 — no publish without explicit read-through):

- `ai-vendor-dependency.md` (parts 1–3)
- `hic-hallintamalli-ja-dws-iq-agentit.md`
- `kya-s1-one-signed-page.md` (+ `.fi`)
- `lifetime-world-model-ja-teollisuuden-prosessimallit.md`
- `teollisuuden-prosessikuvaustavat-ja-tekoalyagentit.md`

**Status:** Parked pending decision. No publication until HIC reads and approves each draft.

---

**N/A — EU AI Act Article 14 human oversight requirement met. Session captured substantive governance fix; blog drafts shelved pending HIC approval. No decision required at this checkpoint.**
