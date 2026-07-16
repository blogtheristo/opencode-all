# NVIDIA Hardware Pricing (updated) — the On-Prem Side of the Deployment Cost Picture

***

# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:

- Version: 1.0 | Tool: Claude Code (Opus 4.8) | Session: claude/scaleway-pricing-update-19g8df | Date: 16.07.2026 | Changes: Initial — captured updated NVIDIA hardware pricing (DGX Spark Founders Edition $3,999→$4,699, +18%, effective 2026-02-23, "memory supply"); same RAM/hardware crisis as the Scaleway 01.06.2026 increase but on the on-prem side; related NVIDIA list to our EU B2B resale SKUs; impact on Scenario S2 (Sovereign DGX) economics; flagged DGX Spark resale-margin review

Session Links & References:

- Source: https://www.tomshardware.com/desktops/mini-pcs/nvidia-dgx-spark-gets-18-percent-price-increase-as-memory-shortages-bite-founders-edition-now-usd4-699-up-from-usd3-999
- Source: https://forums.developer.nvidia.com/t/2-23-2026-price-change-announcement/361713 (NVIDIA 2026-02-23 price-change announcement)
- Source: https://www.nvidia.com/en-us/products/workstations/dgx-spark/ (GB10 spec)
- Source: https://www.nvidia.com/en-us/autonomous-machines/embedded-systems/jetson-orin/nano-super-developer-kit/ ($249)
- Companion (cloud side): docs/field-notes/2026-07-16-scaleway-pricing-increase-june-2026-impact.md
- Companion (cloud side): docs/field-notes/2026-07-16-upcloud-pricing-finnish-sovereign-alternative.md
- Companion (cloud side): docs/field-notes/2026-07-16-google-cloud-run-pricing-hefty-charges.md
- Scenario economics: infrastructure/DEPLOYMENT_SCENARIOS.md (S2 — Sovereign DGX)
- Resale SKUs: dws10.com/config/products.json (single pricing source); dws10.com/price-list/#deployment

Document Status:

- Created: 16.07.2026
- Last Modified: 16.07.2026
- Language: English
- Publication Status: ACTIVE (private — hardware cost analysis)

***

**Type:** Field Note / Hardware Cost Analysis
**Scope:** NVIDIA DGX / GB10 / Jetson on-prem hardware; Scenario S2 (Sovereign DGX) capex
**Owner:** Lifetime Oy · risto.paarni2024@lifetime.fi

---

## TL;DR

**NVIDIA raised the DGX Spark (Founders Edition) from $3,999 to $4,699 — +$700,
+18% — effective 2026-02-23, citing "memory supply."** This is the same global
RAM/hardware crisis that drove Scaleway's 1 June 2026 cloud increase (container
**memory** doubled) — it is now visible on **both** sides of the deploy choice:
metered cloud memory _and_ the RAM in the box you own.

For our **Sovereign DGX scenario (S2)** this nudges per-node capex up modestly,
but the ownership case holds: cloud got pricier in the same breath, so the
relative advantage of owning the appreciating asset is roughly preserved. On the
**sell side**, the CEO lifted the DGX Spark resale **€5,994 → €6,694** to carry a
margin above the higher channel base (executed — see below).

## Updated NVIDIA pricing (USD list / Founders Edition / MSRP)

| Product                                                                       | Was        | Now           | Δ                | Notes                                                                                |
| ----------------------------------------------------------------------------- | ---------- | ------------- | ---------------- | ------------------------------------------------------------------------------------ |
| **DGX Spark** (GB10 Grace Blackwell, 128 GB LPDDR5X, 4 TB NVMe, ~1 PFLOP FP4) | **$3,999** | **$4,699**    | **+$700 / +18%** | Founders Edition; increase effective 2026-02-23, "memory supply"                     |
| Jetson Orin Nano Super (dev kit, 67 TOPS)                                     | $249       | $249          | —                | Sensor-edge entry                                                                    |
| Jetson AGX Orin 64 GB (dev kit, 275 TOPS)                                     | $1,999     | $1,999        | —                | Concentrator tier                                                                    |
| DGX Station (GB300, higher tier)                                              | —          | POA           | —                | Price not published; confirm with NVIDIA                                             |
| Data-center GPUs (H100 / H200 / L40S / L4 / GB200)                            | —          | POA / channel | —                | Rented, not bought, in our stack — cloud GPU rental (+5–10%) is in the Scaleway note |

_Anchors are confirmed data points (NVIDIA FE/MSRP), not the full channel matrix.
EU distributor/EMEA pricing differs and carries VAT-0 reverse charge for B2B._

## The memory crisis hits both sides at once

|                | Cloud (Scaleway, 01.06.2026)                                         | On-prem (NVIDIA, 23.02.2026)              |
| -------------- | -------------------------------------------------------------------- | ----------------------------------------- |
| What rose      | Serverless Container **memory** ×2; RAM/storage-linked block +10–15% | DGX Spark **+18%** (LPDDR5X supply)       |
| Root cause     | Global RAM + storage cost surge                                      | Same global memory supply constraint      |
| Who absorbs it | Scaleway absorbed 3 yrs, now passes a slice                          | NVIDIA passed it straight through (+$700) |

The takeaway for positioning: "sovereign vs cloud" is **not** "cheap vs
expensive" — the same macro shock is repricing both. Owning the hardware converts
a recurring, provider-controlled cost into a one-time capex on an asset you keep.

## Relation to our resale SKUs (DGX Spark raised — see box below)

Our EU B2B turnkey resale (source of truth: `products.json`) bundles the NVIDIA
silicon with on-site install, operator training, 24/7 support, warranty, and
Sovereign Model Updates — so resale > NVIDIA list by design:

| Our SKU (resale)                        | Our price               | Underlying NVIDIA list                                      |
| --------------------------------------- | ----------------------- | ----------------------------------------------------------- |
| DGX Spark (turnkey)                     | **€6,694** (was €5,994) | **now $4,699** (was $3,999) — raised v1.23 (margin-forward) |
| Control Room (Acer Veriton GN100, GB10) | €5,294                  | GN100 channel (GB10-class)                                  |
| Situation Room (2× GN100)               | €10,093                 | 2× GN100                                                    |
| IGX Orin                                | €11,990                 | IGX Orin channel                                            |
| Jetson Nano / NX / AGX                  | €764 / €1,990 / €2,694  | $249 / — / $1,999                                           |
| NVIDIA Model Install                    | €995 / device           | service                                                     |
| Sovereign Model Updates                 | €299 / mo               | service                                                     |

> **✅ Decision executed (CEO, 2026-07-16).** DGX Spark resale **lifted €5,994 →
> €6,694** (hardware €4,999 → €5,699 + €995 install) in `products.json` **v1.23**
> (+ landing-pages mirror + all live copies: product page, price-list, Google
> feed, healthcare, lwm-ontology, VIP services). **Honest nuance:** the €4,999
> EMEA hardware line already covered the $4,699 US list, so this is a
> **margin-forward** move, not margin restoration — it brings DGX Spark in line
> with the "small reseller margin above channel" logic v1.20 applied to the other
> hardware SKUs while holding this one. The auto-generated `price-list/versions/`
> snapshots regenerate via the quarterly-price-list workflow.

## Impact on Scenario S2 (Sovereign DGX) economics

- **Capex:** +~€600–700 per DGX Spark node; the GN100-based Control Room and
  Situation Room track GB10-class channel pricing similarly. Modest against a
  €5–12k node.
- **TCO vs cloud:** the S2 break-even (owned hardware vs metered cloud over 2–3
  yrs) shifts slightly later, but Scaleway's memory increase moves the cloud line
  up in parallel — net relative position roughly unchanged. For a steady 24/7
  workload, ownership still wins.
- **Full-sovereignty stack:** unaffected — the self-hosted Supabase overlay
  (`docker-compose.supabase.yml`) runs on whichever DGX node is purchased; the DB
  sovereignty story does not depend on the node's price.

## Follow-ups

- [x] **CEO decision (done):** lifted DGX Spark resale €5,994 → €6,694 in `products.json` v1.23 (+ mirror + all live copies). See priceHistory 1.23.
- [ ] Confirm DGX Station (GB300) list price + whether we resell it as a tier above Situation Room.
- [ ] Re-pull on the next NVIDIA price-change announcement (they now publish these on the developer forum) and on any EMEA distributor update.
- [ ] Cross-check EUR conversion + EMEA distributor delta before any resale change (our prices are EU-sourced, not USD-converted — see price-list governance note).

---

**Footer**
Owner: Lifetime Oy (risto.paarni@lifetime.fi)
Business ID: 0772407-9 | VAT: FI07724079
Part of the Lifetime World Model (LWM) field-notes corpus.
