# INTRO_CONTROL_ROOM_OUTOKUMPU_TORNIO

```
<!--
VERSION AND AGENT HISTORY
Document: INTRO_CONTROL_ROOM_OUTOKUMPU_TORNIO.md
Version: 1.0
Last-Updated: 2026-06-23
Author: Risto Anton Päärni (Lifetime Oy)
Agent: Claude Code (claude-opus-4-8)
Purpose: Outreach plan to sell the DWS Lifetime Fleet Mobile Control Room to
         Outokumpu Tornio Works. Wedge: Outokumpu already runs an ANYmal
         quadruped ("Jokkeri") on the Tornio ferrochrome floor. The EU
         Machinery Regulation (20 Jan 2027), AI Act embedded high-risk
         (2 Aug 2028) and revised Product Liability Directive (9 Dec 2026)
         turn that fleet from an asset into a lifetime compliance liability.
         Halos certifies the robot; DWS keeps the whole fleet provably
         compliant over its lifecycle AND keeps the line running.
         This is the Robotics / Physical-AI wedge (DWS_ROLES_REGISTRY §4),
         distinct from the IP-disclosure wedge in INTRO_ARI_HIRVONEN_OUTOKUMPU.
Branch: claude/nvidia-halos-robotics-suqayg
Date: 2026-06-23
Owner: risto.paarni@lifetime.fi
-->
```

## Who

| Field                                 | Value                                                                                                                                                                                                                                                         |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Account                               | Outokumpu Oyj — Tornio Works (world's largest fully EAF-based integrated stainless mill; ~1.6 Mt/yr; ~1.6 tCO₂e/t; 100% fossil-free electricity)                                                                                                              |
| Door #1                               | **Plant / Operations Director, Tornio** (owns the floor, the ANYmal "Jokkeri" fleet, and the uptime number)                                                                                                                                                   |
| Co-sponsors                           | EHS / Functional-Safety lead · Head of Legal (R06) · CISO (R15) · CFO / Board Risk (R23/R25)                                                                                                                                                                  |
| Warm bridges (already engaged)        | Heidi Peltonen (VP Sustainability) and Ari Hirvonen (IP Director) via the Tier-1 Sovereignty Pilot and the Forta disclosure pilot — use them to land the Operations intro, not as the buyer                                                                   |
| Why Operations, not IP/Sustainability | The IP wedge sells _disclosure governance_. This sells _fleet uptime + lifetime liability isolation_. The strongest lever is throughput and downtime, and Operations owns both — per DWS_ROLES_REGISTRY §5 (lead with the revenue/cost lever, not authority). |
| Why now, why warm                     | Jokkeri is already deployed (Outokumpu publicly: "first in steel to use robotics in safety management"), and the existing Sovereignty Pilot already proposed _robot-fleet telemetry to an EU store_. The Control Room is the obvious Phase 2.                 |

## The wedge — "Your robot is certified once. Your fleet has to stay compliant for ten years."

Outokumpu is scaling from one chaperoned quadruped toward a heterogeneous physical-AI fleet across Tornio (and Avesta). Under the EU pipeline, the binding problem is no longer initial certification — it is **staying compliant across a 5–10 year lifecycle** of OTA updates, model drift, and floor-layout churn:

- **EU Machinery Regulation (EU) 2023/1230 — applies 20 Jan 2027 (~7 months).** AI safety components with self-evolving/ML behaviour (Annex I.A №5/6) need **third-party Notified Body** conformity assessment. With 6–12 month lead times, the runway is already effectively negative. Every floor change or OTA risks a "substantial modification" that can legally halt the line.
- **Revised Product Liability Directive (EU) 2024/2853 — transposition by 9 Dec 2026.** Strict, no-fault liability extends to software/AI and eases the claimant's burden of proof. An _unevidenced_ safety failure three years post-deployment becomes Outokumpu's defensive burden.
- **EU AI Act (EU) 2024/1689 embedded high-risk — 2 Aug 2028.** Art. 12 automatic logging across the operational lifetime; Art. 14 human oversight. For a growing fleet this is a continuous infrastructure burden, not a one-off.

Outokumpu is also a **NIS2 essential entity** (metals manufacturing / critical infrastructure) — so cyber-of-safety-functions is in scope too.

## Product truth (the line behind the line)

> **Halos governs the robot's safety envelope. DWS keeps the _fleet_ provably compliant over its lifetime — and keeps the line running.**

We do not build robot silicon or the safety kernel — NVIDIA Halos (IGX Thor, SIL-3 Safety Island, QNX) does. DWS IQ is the **governance and evidence layer**: the continuous, signed, Article-12-auditable trail; the drift evidence; the works-council anonymization proof; the EU-sovereign data plane. Complementary, not competitive.

## Headline (buyer-facing)

> **DWS keeps Outokumpu's robot fleet running and provably compliant for its entire lifetime — turning the Machinery Regulation, AI Act and Product Liability clock from a shutdown risk into a managed, auditable asset, on EU-sovereign infra already in your perimeter.**

One mechanic (a KYA-governed, Article-12-audited Lifetime Fleet Control Room on the GN100/IGX edge). Three outcomes (uptime · liability isolation · audit-ready compliance).

## Wedge by role — same headline, every role wins

### Strategic sponsor — open the door

| Role                                              | What you win                                                                                                                                                                                                                                | Win you create for the rest of the company                                                                                          |
| ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| **Plant / Operations Director, Tornio (door #1)** | Robots that _modulate_ instead of E-stopping (Outside-In mesh sees behind new pillars/ladles) → uptime. A floor-layout change becomes a versioned config update broadcast to the whole fleet at once — no per-asset reflash, zero downtime. | EHS gets a live safety case. Legal gets the conformity evidence. CFO gets the asset protected. The line keeps moving during change. |

### Operational owners — run the workflow

| Role                             | What you win                                                                                                                                                                                                                                      | Win you create for the rest of the company                                                                          |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| **EHS / Functional-Safety lead** | Live, continuous safety-state of every asset; HIL-gated proposals (e.g. "dispatch Jokkeri to inspect EAF-3 hotspot") with full operator control. Defensible "first in steel" safety leadership, evidenced.                                        | Operations gets fewer nuisance stops. Legal gets the safety-case artifacts. Works council gets anonymization proof. |
| **Head of Legal (R06)**          | Machinery-Reg conformity evidence + AI Act Art. 12/14 trail + PLD-grade defensibility, generated continuously instead of re-built on every change. Mutation-surface isolation keeps layout changes clear of a "substantial modification" trigger. | EHS/Operations stop owning legal risk informally. CFO sees liability exposure quantified and capped.                |

### Tech approver — clear the stack

| Role                       | What you win                                                                                                                                                                                                      | Win you create for the rest of the company                                                                                                      |
| -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| **CISO (R15) + CIO (R13)** | NIS2 cyber-of-safety-functions met; KYA cryptographic identity on every agent action; edge-anonymization (vectors, not raw video); EU-sovereign by construction — no US Cloud Act surface on floor or fleet data. | Legal's "no US perimeter" claim is technically backed. Operations gets a stack that doesn't add attack surface. Works council privacy answered. |

### Commercial / executive — sign the deal

| Role                                 | What you win                                                                                                                                                                                                         | Win you create for the rest of the company                                                                  |
| ------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| **CFO (R23) + Board Risk/ESG (R25)** | Multi-million-euro fleet investment insulated from operational and regulatory obsolescence over its lifecycle. Board-credible answer to "is our autonomous fleet safe, contained, and compliant?" ahead of Jan 2027. | The whole org pulls one rope: uptime (Ops), evidence (Legal), containment (CISO), capital protection (CFO). |

## DWS Intelligence sharpens each role (the compounding moat)

Keeping the line running is the entry point; **DWS Intelligence is the product** — situational awareness carried forward over time. Easier today, sharper every quarter.

| Role                    | How DWS Intelligence sharpens you                                                                                                                        |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Operations Director** | Cross-shift anomaly patterns; which floor changes most affect throughput per unit of effort; predictive degradation from Jokkeri telemetry.              |
| **EHS / Safety**        | Edge-case drift vs. baseline (the SEF analogue); near-miss clustering; proactive occlusion management before a defensive stop.                           |
| **Head of Legal**       | Live Machinery-Reg / AI Act / PLD pipeline scored against the deployed fleet; what changes when the next Delegated Act lands (`regulatory-timeline.ts`). |
| **CISO**                | Continuous AI-attack-surface + NIS2 enforcement signal; every agent action signed, every signature monitored.                                            |
| **CFO / Board**         | Fleet-lifecycle liability and uptime dashboard; where to invest next to extend the asset's compliant life.                                               |

## Why now (timing wedge)

- **Machinery Regulation bites 20 Jan 2027** — Notified-Body runway already negative; the evidence layer must exist _before_ the first audit, not after.
- **PLD transposition 9 Dec 2026** — the cost of an unevidenced failure steps up this year.
- **Jokkeri is already on the floor** — the cheapest, warmest first signal in DWS's entire pipeline. No new hardware required to start.
- **The Sovereignty Pilot already proposed fleet telemetry to an EU store** — the Control Room is the funded, logical Phase 2.

## The offer — Lifetime Fleet Mobile Control Room pilot (Phase 2 of the Sovereignty Pilot)

| Item                 | Value                                                                                                                                                                                                                                                         |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Scope                | MVP per `docs/lifetime-fleet/TORNIO_CONTROL_ROOM_IMPLEMENTATION_PLAN.md`: Jokkeri + weather/grid signals; GN100 control brain + IGX mill-floor brain; **read-and-propose only** (no autonomous actuation, HIL-gated by construction); mobile PWA control room |
| Edge                 | Reuses the validated Acer Veriton GN100 + IGX line items already priced in `NVIDIA_HARDWARE_LINE_ITEMS_OUTOKUMPU.md`                                                                                                                                          |
| Duration             | 3 months                                                                                                                                                                                                                                                      |
| KPIs                 | Downtime avoided on a layout change (target: zero per-asset reflash) · anomaly mean-time-to-acknowledge · Article-12 audit coverage ≥95% of fleet actions · drift-evidence baseline established                                                               |
| Success → conversion | Demonstrated zero-downtime layout adaptation + an audit-ready Art-12 trail + sovereign data plane → convert to standing Lifetime Fleet subscription + Tornio→Avesta rollout                                                                                   |
| Sovereignty          | EU-sovereign data plane (Aiven PG / EU Supabase); KYA-attested; no US Cloud Act surface — consistent with the Tier-1 Sovereignty Pilot assessment                                                                                                             |

## Three doors into Outokumpu (Operations is door #1)

1. **Operations / Plant Director, Tornio** — owns uptime and the Jokkeri fleet. Door we open. Warm-introduced via the Sovereignty Pilot sponsors.
2. **EHS / Legal** — own the safety case and the liability. Natural co-sponsors once Operations is in.
3. **CISO / CFO** — clear the stack and sign the capital. Close the loop.

We open at Operations because it has the strongest reason to _want_ a fleet that never needlessly stops, and owns the number (downtime) that proves the value.

## Thread

### 1. Warm-intro request (to the existing Sovereignty-Pilot sponsor)

> Hei — building on the Tier-1 Sovereignty Pilot: the part where we proposed streaming Jokkeri's telemetry to an EU store is now a working mobile Control Room. With the Machinery Regulation landing Jan 2027, I'd like 20 minutes with whoever owns Tornio operations and uptime to show how the fleet stays compliant _and_ stops needlessly E-stopping. Can you introduce me?

Status: drafted, awaiting the warm bridge.

### 2. Cold/direct note to the Operations Director — see `LETTER_CONTROL_ROOM_OUTOKUMPU_TORNIO.md` (to draft on request)

### 3. Demo escalation (after first call, if pilot interest)

Live demo: Jokkeri telemetry → mobile Control Room → an anomaly raises a HIL proposal → operator Accept/Override → Article-12 record written, KYA-signed, EU-hosted. Then: simulate a floor-layout change → show the versioned mesh-config broadcast → zero per-asset reflash.

## Outokumpu-specific intel feeding the pitch

| Fact                                                                           | Use in conversation                                                          |
| ------------------------------------------------------------------------------ | ---------------------------------------------------------------------------- |
| ANYmal "Jokkeri" already on the Tornio FeCr floor; sisters at Avesta + Krefeld | The first signal is already there. Start tomorrow, no procurement.           |
| Tornio = largest integrated EAF stainless mill; busy multi-asset floor         | Occlusion + throughput story lands hard: pillars, ladles, forklifts, people. |
| Outokumpu is a NIS2 essential entity                                           | Cyber-of-safety-functions is a Legal-grade requirement, not a nice-to-have.  |
| Existing Tier-1 Sovereignty Pilot proposed fleet telemetry to EU store         | This is the funded Phase 2, not a new line item to justify from scratch.     |
| HQ Helsinki / Lifetime Oy Espoo; Finnish-to-Finnish                            | Default to in-person at Tornio or HQ; sovereignty is same-jurisdiction.      |

## Why DWS IQ specifically (vs. the OEM safety stack alone)

Halos (and the robot OEMs) certify the _asset_. They do not give the enterprise buyer a **continuous, signed, fleet-wide compliance trail** across the lifecycle, a **drift-evidence** record for PLD defensibility, a **works-council anonymization proof**, or an **EU-sovereign** governance plane in the customer's own jurisdiction. DWS IQ is the layer that does — built by a Finnish company (Lifetime Oy, business ID 0772407-9), same jurisdiction as Outokumpu, with 24/7 EU support.

## Next actions

- [ ] Confirm the Tornio Operations / Plant Director name and route (warm intro via Sovereignty-Pilot sponsor preferred).
- [ ] Send the warm-intro request (text above).
- [ ] On interest, attach `docs/lifetime-fleet/TORNIO_CONTROL_ROOM_IMPLEMENTATION_PLAN.md` (sanitised) + the Compliant-by-Construction whitepaper.
- [ ] Draft `LETTER_CONTROL_ROOM_OUTOKUMPU_TORNIO.md` (direct note) if no warm route within 5 business days.
- [ ] Stand up the demo per Thread #3 on the GN100/IGX edge.
- [ ] Decision to confirm with Risto: position as **Phase 2 of the Sovereignty Pilot** (recommended) vs. a standalone Control Room pilot.

## Related files

- `docs/lifetime-fleet/TORNIO_CONTROL_ROOM_IMPLEMENTATION_PLAN.md` — the build plan behind the offer.
- `docs/regulatory-radar/NVIDIA_HALOS_ROBOTICS_BRIEF.md` — the regulatory backbone (Machinery Reg / AI Act / PLD).
- `sales-outreach/INTRO_ARI_HIRVONEN_OUTOKUMPU.md` — the sibling IP-disclosure wedge (different door).
- `sales-outreach/NVIDIA_HARDWARE_LINE_ITEMS_OUTOKUMPU.md` — GN100/IGX/ANYmal pricing.
- `sales-outreach/PILOT_SHEET_OUTOKUMPU_FORTA.md` — pilot-sheet format precedent.
- `docs/field-notes/2026-05-25-tier1-sovereignty-pilot-outokumpu-dgx-t5000.md` — the Sovereignty Pilot this extends.
- `DWS_ROLES_REGISTRY.md` §4 — Robotics / Physical AI wedge (R12 door).
