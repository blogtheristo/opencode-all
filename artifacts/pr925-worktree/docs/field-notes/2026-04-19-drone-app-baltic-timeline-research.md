# Drone Application — Baltic-First Timeline Research

***
VERSION AND AGENT HISTORY

Document: Drone Application — Baltic-First Timeline Research
Version: 1.0
Date: 2026-04-19
Author: Claude Code (claude/research-drone-app-o1K0M)
Owner: Lifetime Oy
Status: Active — Research / Pre-Spec
Related:
  - docs/field-notes/2026-04-01-yakovenko-drone-industrial-darwinism-interceptor-signal.md
  - docs/market-research/nordic-factory-interceptor-drone-estimate.md
  - Store/PRODUCT_AEGIS.md
  - docs/legal/DUAL_USE_EXPORT_NOTICE.md

Sessions & Modifications:
  - Version: 1.0 | Tool: Claude Code (Opus 4.7) | Session: claude/research-drone-app-o1K0M | Date: 19.04.2026 | Changes: Initial research — war-expansion timeline thesis, 12–16 week MVP drone application scoped against existing DWS building blocks (SiteSense, ICEYE, Aegis, Jetson Orin Nano), EASA + Dual-Use compliance matrix, AerialSenseAgent skeleton, kill-chain separation (ISR vs. interceptor), Finnish operator context (Rajavartiolaitos, Puolustusvoimat, Huoltovarmuuskeskus)

***

**Document Type:** Field Note — Research / Pre-Spec
**Scope:** Drone application concept, threat-aligned timeline, minimum viable shipment path, reuse of existing DWS IQ 6 components
**Ontology Tags:** Geography > Europe > Finland, Baltics, Ukraine | Sector > Defence > ISR, C-UAS, FPV | Entities > Lifetime Fleet, DWS IQ, Rajavartiolaitos, Puolustusvoimat, Huoltovarmuuskeskus | Temporal Context > Q2 2026 – Q2 2027 | Confidence > MEDIUM-HIGH (threat timeline), HIGH (technical reuse feasibility)
**Data Sources:** ISW (Institute for the Study of War) daily reports 2025–2026, Yakovenko open letter (2026-04-01), EASA Regulation 2019/947, EU Dual-Use Regulation 2021/821, Finnish Defence Forces public doctrine 2024, Eurostat SBS 2023 (Nordic industrial sites), SiteSense + ArgusAgent code inventory (this repo)

---

## 1. Premise — User's Thesis

> *"Ei valmistus vie kahta vuotta vaan silloin sota laajenee Suomeen. Veikkaus että ensi keväänä jo Baltiaan?"*

Käännös työhypoteesiksi:

- **Spring 2027:** Escalation into one or more Baltic states (Estonia, Latvia, Lithuania) is plausible; hybrid activity already underway.
- **2028:** Direct pressure or kinetic activity reaching Finnish soil cannot be excluded.
- **Implication:** Any defence-adjacent product with a **2-year build cycle is shipped too late.** Relevance window closes before first unit leaves the factory.
- **Design rule:** First operational units in field **≤ 6 months** from go-decision. Iteration cycle **≤ 2 weeks**, mirroring TAF / Ukrainian FPV doctrine (see Yakovenko note, 2026-04-01).

This document does **not** claim the threat timeline is certain. It claims the **option value of a fast-shipped drone application is high enough that slow paths should be disqualified now.**

---

## 2. Threat-Timeline Signals (as of 2026-04-19)

| Signal | Source | Weight |
|---|---|---|
| Russian force reconstitution near Leningrad Military District | ISW weekly assessments Q1 2026 | HIGH |
| Baltic airspace incursions (GPS jamming, balloons, UAVs) 2024–2026 | EASA EU Safety List, Estonian TTJA bulletins | HIGH |
| Sabotage attempts Nordic critical infra (cables, rail, fuel) 2024–2026 | Supo, Säpo, PET public statements | MEDIUM-HIGH |
| Finnish NATO Article 3 resilience buildout | Puolustusministeriö 2024–2026 budgets | MEDIUM |
| Ukrainian drone attrition rate forcing Russian doctrinal update | Yakovenko letter, ISW, DeepState UA | HIGH |
| Finnish border reinforcement (aita, valvonta) | Rajavartiolaitos 2024–2026 | HIGH |

**None of these are proof.** Together they justify a Baltic-first shipping posture with Finland as the scaling market.

---

## 3. Application Concept — Two Kill-Chains, One Platform

The word "droonisovellus" hides two very different products. The research recommends **keeping them separate in software but sharing one edge-compute + one agent bus.**

### 3.1 Track A — Aerial ISR ("Silmät")

- **Mission:** Persistent surveillance of critical infrastructure, border segments, factory perimeters.
- **Legal class:** EASA **Specific** category (2019/947). BVLOS via operational authorisation. **Non-lethal, civilian dual-use.**
- **Hardware host:** Third-party airframe (Parrot Anafi USA, Skydio X10D, or Finnish **Videodrone / Riegl VUX**). DWS ships **payload software + edge inference + ground station agent**, not the airframe.
- **Compliance surface:** GDPR (video), EU AI Act Annex III (biometric inference → keep OFF by default), EU AI Act Article 12 logging (sovereignty audit layer).
- **Customer:** Rajavartiolaitos, Huoltovarmuuskeskus-listed operators, Fingrid, Fortum, Nordic paper & steel, data centres.
- **Ship date target:** **Operational pilot within 12 weeks**, first paying customer within 20 weeks.

### 3.2 Track B — Loitering Interceptor ("Hampaat")

- **Mission:** Counter-UAS — detect, classify, pursue, neutralise hostile small UAS over fixed critical sites.
- **Legal class:** **Dual-use / defence.** Falls under Wassenaar 4A003 / 5A002 screening (see `docs/legal/DUAL_USE_EXPORT_NOTICE.md`). Requires Finnish MoD end-user statement.
- **Hardware host:** Finnish + Ukrainian airframe partners; avoid own airframe manufacturing. Focus DWS contribution on **seeker AI, swarm C2, KYA runtime guardrails.**
- **Compliance surface:** EU Dual-Use 2021/821, national export control (PLM), EU AI Act Article 2(3) carve-out for military use **does not apply when the same binary ships to civilian operators** — architect the split.
- **Customer:** Puolustusvoimat, Baltic MoDs, later NATO Innovation Fund portfolio primes.
- **Ship date target:** **Tech demo within 16 weeks** (on captive-range). Fieldable unit Q1 2027.

**Hard architectural rule:** Interceptor seeker code lives behind a separate repo + separate export-controlled build pipeline. This repo (`dws6`) stays on the ISR side of the line until export control is formally cleared.

---

## 4. What DWS Already Has (Reuse Inventory)

Scan of repo confirms substantial reusable substrate — the 2-year estimate was wrong because it assumed greenfield.

| Building block | File | Reuse in drone app |
|---|---|---|
| SiteSense agent (EN 13001, weather, incident scoring) | `src/agents/sitesense.agent.ts` | Fork → `AerialSenseAgent`: same scoring spine, new payload schema |
| ArgusAgent (ICEYE SAR satellite ingestion) | `Store/PRODUCT_AEGIS.md` §29–51 | Orbital cueing → drone vector (satellite sees it, drone confirms it) |
| SovereigntyMonitor | `src/agents/index.ts` | Flight log + video residency enforcement (EU-only processing) |
| KYA runtime (Know Your Agent) | `.claude/commands/kya.md`, trust scoring | Leash-snap for autonomous airborne agents mid-flight |
| Aegis governance layer | `Store/PRODUCT_AEGIS.md` | Dual-use gating, operator authorisation, audit trail |
| Edge inference stack (TensorRT, ONNX, Triton) | `product-catalog/LWM/V1/product-specification.md` L38–72 | Drop-in for Jetson Orin Nano payload (1B–8B param models) |
| EU AI Act Article 12 logging | `docs/field-notes/2026-03-08-eu-ai-act-omnibus-optimus-v3-article-12.md` | Mandatory for any autonomous action — already wired |
| Dual-use export screening | `docs/legal/DUAL_USE_EXPORT_NOTICE.md` | Track B compliance scaffold exists |
| Nordic interceptor TAM | `docs/market-research/nordic-factory-interceptor-drone-estimate.md` | 8,500 units / EUR 1.5–3.5B demand sizing already done |

**Net assessment:** ~60–70% of the software stack a drone application needs is already in this repo. The missing pieces are listed in §6.

---

## 5. Why 2 Years Is Wrong (and What Replaces It)

Classical defence industrial base (DIB) timeline assumes:

1. New airframe development (2–5 yrs)
2. Type certification (1–3 yrs)
3. Integration with legacy C2 (6–18 mo)
4. Serial production tooling (6–12 mo)

DWS does **none of these.** The drone application strategy is:

- **Buy the airframe.** Parrot, Skydio, Videodrone, Ukrainian partners. Zero airframe R&D.
- **Ship the brain.** Agent software + edge inference + ground station + compliance. This is where DWS wins.
- **Iterate weekly.** Yakovenko's TAF model: battlefield/field feedback → push to fleet → measure → repeat.
- **Certify by operation, not by type.** EASA Specific category uses operational authorisation (SORA methodology) — weeks, not years.

**Realistic timeline to first operational unit: 12–16 weeks.** Realistic timeline to 100-unit fleet: 9–12 months. This is a software/ops problem, not a hardware problem.

---

## 6. What Is Missing (Gap List)

Mapped from the exploration scan. Each item is a concrete ticket, not a research topic.

1. **AerialSenseAgent** — fork of SiteSense, schema: `{ lat, lon, alt, heading, speed, payload: { rgb, thermal, lidar? }, anomalyScore, kya_trust }`.
2. **EASA SORA compliance engine** — operational authorisation draft generator; Finnish Traficom formatting.
3. **Ground station web app** — live video, map, tasking, flight log; reuse `dws6.com/dashboard/firehorse/v9-react`.
4. **Jetson Orin Nano edge benchmark** — YOLOv8/9/11 small variants, FP16, ≥30 FPS target at 1080p.
5. **Mesh C2 layer** — 4G LTE + private LoRa fallback; assume denied-GNSS environment.
6. **GNSS-denied navigation fallback** — visual odometry + magnetic heading; critical for Baltic/Finland jamming reality.
7. **Cold-weather operating envelope** — −35 °C start, LiPo preheat, icing detection.
8. **Swarm coordination** — 2–8 unit flights, leader-follower, deconfliction.
9. **Dual-use repo split** — Track B seeker code leaves this repo before any interceptor-class commit.
10. **KYA airborne leash-snap** — revoke autonomous authority within ≤ 200 ms of a red signal.
11. **Finnish operator UI** — fi-FI localisation, right-to-left tab order for glove use, night-mode default.
12. **Flight log residency** — SovereigntyMonitor rule: no flight telemetry or video leaves EU; no US-CLOUD-Act-exposed storage.

---

## 7. Recommended Next Steps (This Week)

1. **Decision: Track A only, or A+B.** Track B adds ~3–6 months of legal setup before first line of code — but revenue multiple is higher. My recommendation: **start A this week, stand up the legal track for B in parallel**, commit no interceptor code in this repo.
2. **Spike:** Jetson Orin Nano + YOLO small + thermal — 1 week, 1 person. Measure FPS, power draw, latency.
3. **Customer signal:** 3 Rajavartiolaitos / Huoltovarmuuskeskus-listed conversations (already mapped in `investor-outreach/DEFENSE_SOVEREIGNTY_INVESTORS_2026.md`).
4. **EASA SORA draft:** one site, one mission profile (e.g., Fingrid substation BVLOS patrol).
5. **Register AerialSenseAgent** in `src/agents/index.ts` as stub (no inference yet) so downstream MCP `tools/list` already advertises it.
6. **Picture-prompt log:** add hero images for internal deck (append to `docs/field-notes/picture-prompts.md` per project rule).

---

## 8. Open Questions (for human architect)

1. **Scope confirmation:** Is this research meant to seed a product spec, an investor note, or both?
2. **Airframe partner preference:** Videodrone (FI), Skydio (US — CLOUD Act exposure!), Parrot (FR), Ukrainian OEM?
3. **Customer tier-0:** Should we lead with Rajavartiolaitos (border) or Fingrid (infrastructure)? Different compliance paths.
4. **Track B appetite:** Are we willing to stand up a separate, export-controlled repo this quarter?
5. **Budget posture:** Self-funded spike vs. DEFINE Finland / NATO Innovation Fund application first?

---

## 9. Assumptions Made

ASSUMPTIONS I'M MAKING:

1. "Droonisovellus" = software + edge inference + ground station, **not** airframe manufacturing. DWS is a brain company, not a metal-bending company.
2. The 12–16 week timeline assumes Track A only (ISR, EASA Specific, non-lethal). Track B adds at least a quarter.
3. We can reuse SiteSense / ArgusAgent / Aegis / KYA as-is; no major refactor needed for aerial use.
4. Finnish first, Baltic export second, NATO third. English UI can wait.
5. We will **not** commit any code in this repo that would trigger Wassenaar 4A003 / 5A002 classification — that work, if started, goes to a separate export-controlled repo.

→ Correct me now or I proceed with these.

---

## 10. One-Line Summary

A fast drone application is a **software shipment on bought airframes**, and DWS already owns ~65% of the required stack — first operational unit is a 12–16 week project, not a 2-year project, and the Baltic-first posture is the right one regardless of whether the worst-case timeline materialises.

---

*End of field note.*
