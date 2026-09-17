# DWS IQ Sovereign Edge: Three Rooms + Per-Industry NVIDIA Hardware Stack

**Date:** 2026-06-13
**Author:** Claude (AI Assistant)
**Type:** Product Architecture / Session Field Note
**Status:** ✅ Active — proposal + delivered work
**Branch:** `claude/careers-lifetime-links-guf326`

---

## Ontology Tags

- **Geography:** Europe > EU > Finland
- **Sector:** Technology > Sovereign_Edge_AI > NVIDIA_Hardware
- **Entities:** Lifetime Oy, Lifetime Fleet, NVIDIA (Connect Partner), Acer (Veriton GN100), NCC (construction), Outokumpu (steel), HUS (health care), Kela, VPK
- **Products:** Control Room (GN100), Situation Room (2× GN100 bridged), DWS IQ Mobile Office / "Compliance Ambulance", Jetson Orin tiers, IGX Orin
- **Temporal Context:** 2026-Q2
- **Confidence:** Medium — architecture is directional; per-industry hardware bundles and prices need owner input before they become SKUs.

---

## Executive Summary

This session started as a link fix on `lifetime.fi` and grew into a product-architecture
discussion for **DWS IQ sovereign edge hardware**. The emerging model is **three
categories ("rooms")** of on-prem / on-vehicle AI compute, each running the DWS IQ
Control Room / Situation Room software on **NVIDIA edge**, sold as **per-industry
options** rather than a sprawl of one-off SKUs:

| Category                                          | Form factor                      | Power source                               | Anchor hardware                              | Role                                 |
| ------------------------------------------------- | -------------------------------- | ------------------------------------------ | -------------------------------------------- | ------------------------------------ |
| **Control Room**                                  | Single desktop node, in-building | Mains                                      | 1× Acer Veriton GN100 (GB10 Grace Blackwell) | Command brain — field operations     |
| **Situation Room**                                | 2× nodes bridged, in-building    | Mains                                      | 2× GN100 (ConnectX-7 200 Gbps)               | Strategic command — bigger scenarios |
| **DWS IQ Mobile Office** ("Compliance Ambulance") | Vehicle-mounted, mobile          | **Vehicle / battery — energy-constrained** | Jetson Orin class (low-TDP)                  | Compliance + ops on the move         |

**Key new decision:** for the **Mobile Office / Compliance Ambulance, energy consumption
is the governing constraint** — it runs off vehicle power, not mains, so it leans to
low-watt Jetson Orin silicon, not the desktop-class GN100 used in the two building "rooms".

**Goal stated this session:** _"…until each industry has their hardware on both."_ — i.e.
fill a coverage matrix so **construction (NCC), steel (Outokumpu), and health care (HUS)**
each have a defined hardware setup for **both** Control Room **and** Situation Room (and,
next, Mobile Office).

---

## 1. Work delivered this session (branch `claude/careers-lifetime-links-guf326`)

1. **Ironclad nav + footer links** — made domain-aware so the embedded dws10.com nav/footer
   on `lifetime.fi` and `onelifetime.world` resolve content links to `https://dws10.com/...`
   instead of 404-ing on the local origin (Careers → `https://dws10.com/careers/`). Edited the
   dws10.com source of truth + synced all mirrors.
2. **Careers — Lifetime Fleet VIP roles** added to `onelifetime.world/careers/`:
   - **Fleet Field Engineer** — DWS IQ Control Room **& Situation Room** on NVIDIA edge,
     robotics, remote diagnostics. States Lifetime's **NVIDIA Connect Partner** status.
   - **Fleet Driver** — Uber Priority / Comfort / Pet · Helsinki Taksi · **Kela (health care,
     humans only)** · coordinated via **DWS IQ Control Room Logistics**.
   - Both cards offer **WhatsApp + email** apply (greeting funnels to `wa.me/358400319010`).
3. **Price list captions** — added a `caption` field to Control Room & Situation Room in
   `dws10.com/config/products.json`, rendered in both the live price-list page and the
   versioned-snapshot generator. Dual-folder synced.

---

## 2. The three-room architecture

### Control Room (exists — `edge-node-gn100`, €5,294 one-time)

Single Acer Veriton GN100: GB10 Grace Blackwell, 1 PFLOPS FP4, 128 GB LPDDR5x, 20-core Arm,

- NVIDIA model install (CUDA + NIMs + Cosmos + MCP + Article 12 log). The command brain that
  lives in your building. Mains-powered.

### Situation Room (exists — `LF-SITROOM-001`, €10,093 one-time)

2× GN100 bridged (40 cores · 256 GB unified · ConnectX-7 200 Gbps) + wider model bundle
(vision, acoustic, language, reasoning, voice). For when one node / one screen isn't enough.
Mains-powered.

### DWS IQ Mobile Office — "Compliance Ambulance" (NEW — not yet a product)

Vehicle-mounted DWS IQ unit. Brings Control Room / Situation Room capability **to the site or
to the patient**. Natural fit with **Lifetime Fleet** (health care logistics, Kela, Uber) — the
physical "hands" of the platform.

**Energy consumption is the key consideration** (stated this session). Because it runs off
vehicle 12/24 V / battery / inverter rather than mains, hardware selection inverts from the
building rooms:

| Silicon                     | Compute         | Power envelope               | Mobile Office fit                                            |
| --------------------------- | --------------- | ---------------------------- | ------------------------------------------------------------ |
| Jetson Orin Nano Super      | 67 TOPS         | ~7–25 W                      | Light mobile unit / sensor concentrator                      |
| Jetson Orin NX 16 GB        | 100 TOPS        | configurable 10–40 W         | Mid mobile unit                                              |
| Jetson AGX Orin 64 GB       | 275 TOPS        | ~15–60 W                     | Heavy mobile unit (multi-sensor vision)                      |
| **IGX Orin**                | AGX-class + ECC | higher, but safety-certified | **Medical-grade Mobile Office (HUS), 10-yr support to 2033** |
| GN100 / DGX Spark (desktop) | 1 PFLOPS FP4    | hundreds of W, mains         | ❌ Building rooms only — too power-hungry for vehicle        |

**Implication:** the Compliance Ambulance is a **Jetson/IGX product line**, not a GN100 line.
This is the cleanest way to express why it's a distinct third category, not just "Control Room
on wheels."

---

## 3. Per-industry hardware matrix ("hardware on both")

Target: each industry has a defined bundle for **Control Room**, **Situation Room**, and
(roadmap) **Mobile Office**. Directional proposal — bundles/prices need owner sign-off.

| Industry / anchor customer | Control Room                                                               | Situation Room                                                                                           | Mobile Office (Compliance Ambulance)                                                                               |
| -------------------------- | -------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| **Construction — NCC**     | GN100 in site office; SiteSense (EN 13001 crane, safety)                   | 2× GN100 for multi-site / megaproject coordination                                                       | AGX Orin in site vehicle — vision for site safety, low-watt                                                        |
| **Steel — Outokumpu**      | GN100 in plant control building                                            | 2× GN100 bridged — furnace/process vision + acoustic + reasoning; AGX Orin sensor concentrators on lanes | Orin NX / AGX mobile inspection unit                                                                               |
| **Health care — HUS**      | **IGX Orin** (ECC, functional-safety, 10-yr lifecycle) in clinical setting | **2× IGX/bridged** for department-wide; GDPR/Article 12 audit replica                                    | **The literal Compliance Ambulance** — IGX/AGX in vehicle, patient-data sovereign, Kela transport, energy-budgeted |

Notes:

- **HUS is the IGX Orin case** — it's the medical/industrial SKU (ECC memory, safety roadmap,
  enterprise 10-year support to 2033). Health care should standardize on IGX where patient
  safety / certification matters, across all three rooms.
- **Jetson Orin Nano / NX nodes** act as **sensor concentrators** feeding events back to the
  central room in every industry — the spoke to the room's hub.

---

## 4. Proposed data model — "products as per-industry options"

Stated this session: _"Make those products options for various industries if they have
different product setup."_

Rather than minting 9+ separate SKUs (3 rooms × 3 industries), extend each room product in
`products.json` with an **`industryVariants`** map. One canonical product, selectable options:

```jsonc
"edge-node-gn100": {
  "name": "Control Room — Acer Veriton GN100 + NVIDIA Model Install",
  "caption": "Single sovereign AI node …",
  "price": 5294,
  "industryVariants": {
    "construction": { "label": "NCC / Construction", "modelBundle": "SiteSense + EN 13001", "priceDelta": 0 },
    "steel":        { "label": "Outokumpu / Steel",  "modelBundle": "Process vision + acoustic", "priceDelta": 0 },
    "healthcare":   { "label": "HUS / Health Care",  "hardware": "IGX Orin (medical)", "priceDelta": null }
  }
}
```

- The nav / `/buy/` / price-list renderers (already config-driven) would render the base
  product plus an **industry option selector**, reusing the single-source-of-truth pattern.
- **Prices left `null` / `0` where unknown** — per DWS pricing source-of-truth + truth-standard
  rules, real per-variant prices must come from the owner before they ship. _Not invented here._

This is a **proposal only** — no `industryVariants` were written to `products.json` this session.

---

## 5. WhatsApp greeting — add the three product links

Stated this session: _"Add to whatsapp greeting product links to these three."_ The greeting is
maintained by the user in WhatsApp Business; the corrected block to paste (Careers link already
fixed to `onelifetime.world/careers/`, plus the three sovereign-edge products):

```
DWS IQ Sovereign Edge — your AI brain, on your premises:
• Control Room    https://dws10.com/products/edge-node-gn100.html
• Situation Room  https://dws10.com/products/situation-room.html
• DWS IQ Mobile Office ("Compliance Ambulance")  https://dws10.com/products/dws-iq-compliance-ambulance.html
```

- All three now link to live product pages — the **Compliance Ambulance product was created this
  session** (`LF-COMPLIANCE-AMBULANCE-001`, POA) with detail page
  `dws10.com/products/dws-iq-compliance-ambulance.html`.

---

## 5b. NVIDIA hardware audit (2026-06-13)

Researched NVIDIA's current edge / automotive lineup and audited the hardware in
`products.json`. **Finding: the catalogue is a generation behind** — it uses Orin-class Jetson +
IGX Orin and is missing NVIDIA's 2026 **Blackwell-generation Thor** edge:

| Need                         | products.json today (Orin gen)                         | 2026 Blackwell (Thor gen) — missing                                                                                                                             |
| ---------------------------- | ------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| High-compute edge / robotics | Jetson AGX Orin (275 TOPS)                             | **Jetson Thor T5000** — 2070 FP4 TFLOPS · 128 GB · 40–130 W · **3.5× energy efficiency** vs AGX Orin                                                            |
| Medical / regulated edge     | IGX Orin (10-yr support)                               | **IGX Thor** — Blackwell, up to 5581 FP4 TFLOPS · **functional safety ISO 26262 + IEC 61508** (Functional Safety Island) · ~8× iGPU vs IGX Orin · 10-yr support |
| In-vehicle / automotive      | —                                                      | **DRIVE AGX Thor** — ~2000 TOPS · Blackwell · automotive-grade                                                                                                  |
| Desktop sovereign            | GN100 / DGX Spark (GB10 Grace Blackwell, 1 PFLOPS FP4) | current — no change                                                                                                                                             |

**Why it matters for the ambulance:** energy is the ambulance's governing constraint and Thor's
headline is **3.5× better energy efficiency** — so the Compliance Ambulance was built on **Jetson
Thor / IGX Thor**, not Orin. IGX Thor's functional-safety certification fits the HUS medical
variant; DRIVE AGX Thor is the vehicle-integration option.

**Recommendation:** add Jetson Thor, IGX Thor (and optionally DRIVE AGX Thor) as POA SKUs and
migrate the room bundles' high-end tier from AGX Orin → Jetson Thor. Orin Nano/NX stay as valid
low-power sensor-concentrator tiers — Thor does not replace them.

Sources: NVIDIA Jetson Thor / IGX Thor / DRIVE AGX Thor product pages, NVIDIA Technical Blog, and
distributors (Arrow, Leadtek, Connect Tech, Advantech), retrieved 2026-06-13.

---

## 6. Open questions / decisions needed from owner

1. **Per-industry prices** — Control Room / Situation Room / Ambulance variant price deltas for
   NCC, Outokumpu, HUS. (Blocked: cannot invent prices; Ambulance shipped as POA.)
2. **Add Thor-gen SKUs?** — create Jetson Thor / IGX Thor / DRIVE AGX Thor products and migrate
   room high-end tier AGX Orin → Jetson Thor (audit recommendation above).
3. **`industryVariants` vs separate SKUs** — confirm the options-on-one-product model before I
   touch `products.json` schema and the buy/price-list/nav renderers.

## 7. Next actions

- [x] Create DWS IQ Compliance Ambulance product (`LF-COMPLIANCE-AMBULANCE-001`, POA) + detail
      page; WhatsApp greeting third link now points to the real page.
- [x] Audit NVIDIA hardware selection (Thor-generation gap documented above).
- [ ] Owner confirms per-industry / room price deltas.
- [ ] Add Thor-generation SKUs (Jetson Thor, IGX Thor, DRIVE AGX Thor) after pricing sign-off.
- [ ] Add `industryVariants` to Control Room & Situation Room (after schema sign-off); update
      buy / price-list / nav renderers to show an industry selector.
- [ ] Fill the per-industry matrix so NCC / Outokumpu / HUS each have Control Room **and**
      Situation Room bundles defined ("hardware on both").

---

_Source-of-truth note: pricing lives only in `dws10.com/config/products.json` (mirrored to
`landing-pages/dws10-com/`). No prices were invented in this note; all per-industry/Mobile
Office prices are marked as owner-input-required._
