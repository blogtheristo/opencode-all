# Lifetime Fleet Mobile Control Room — Outokumpu Tornio Implementation Plan

---

# VERSION AND AGENT HISTORY

Version: 1.3

Sessions & Modifications:

- Version: 1.3 | Tool: Claude Code (claude-sonnet-5) | Session: claude/nvidia-halos-robotics-suqayg | Date: 10.07.2026 | Changes: Merge fix — updated the `DWS_TRUTH_STANDARD.md` §2 row reference for the Halos/KYA ontology mapping from row 27 to row 28 (row 27 was independently taken by "Sovereign Industrial Intelligence Outcomes" on main during the same-day merge; Halos landed at row 28, per DWS_TRUTH_STANDARD v3.5).
- Version: 1.2 | Tool: Claude Code (claude-sonnet-5) | Session: claude/nvidia-halos-robotics-suqayg | Date: 10.07.2026 | Changes: PR review fix — updated the `DWS_TRUTH_STANDARD.md` §2 row reference for the Halos/KYA ontology mapping from row 20 to row 27 (row 20 was independently claimed by "Product-suite umbrella name & tier taxonomy" during the main-branch merge; Halos landed at row 27, per DWS_TRUTH_STANDARD v2.9).
- Version: 1.1 | Tool: Claude Code (Opus 4.8) | Session: claude/nvidia-halos-robotics-suqayg | Date: 23.06.2026 | Changes: Added the mutation-surface-isolation principle to §5.3 (Outside-In mesh) — layout change confined to a single versioned, Art-12-audited `meshZones` config while each asset's certified kernel stays frozen, keeping clear of an Annex I substantial-modification trigger; plus sensor-occlusion handling. Made `meshZones` a versioned config object in Phase 0 and §7 data model.
- Version: 1.0 | Tool: Claude Code (Opus 4.8) | Session: claude/nvidia-halos-robotics-suqayg | Date: 23.06.2026 | Changes: Initial implementation plan for the Lifetime Fleet mobile Control Room at Outokumpu Tornio Works. Grounded in a four-area codebase survey (World Model loop, Lifetime Fleet/Control-Situation Rooms, Outokumpu/Tornio customer context, mobile/dashboard surfaces). Scope decisions locked with the user: first signal = ANYmal Jokkeri telemetry + weather/grid; edge target = GN100 control brain + IGX mill-floor brain; action scope = read-and-propose (no autonomous actuation). Adds the "Lifetime Compliance & Liability Isolation" pillar derived from the NVIDIA Halos fleet-lifecycle framing.

Session Links & References:

- Claude Code (claude/nvidia-halos-robotics-suqayg): see branch commits
- Related: docs/regulatory-radar/NVIDIA_HALOS_ROBOTICS_BRIEF.md; src/compliance/regulatory-timeline.ts

Document Status:

- Created: 23.06.2026
- Last Modified: 23.06.2026
- Language: English
- Languages Available: English
- Publication Status: DRAFT

---

## 1. Goal & success criteria (done-condition)

A mobile, EU-sovereign **Lifetime Fleet Control Room** for Outokumpu Tornio Works that turns live mill and robot-fleet signals into **governed situational awareness + human-in-the-loop (HIL) action proposals**, running on the GN100/IGX edge, KYA-governed and Article-12 audited.

MVP is "done" when:

1. An operator on a phone (installable PWA) sees a live Tornio `StateVector` (≥5 channels) refreshing ≤10 s, with anomalies flagged.
2. On an anomaly, ≥1 **HIL-gated proposal** appears (e.g. _"dispatch Jokkeri to inspect EAF-3 hotspot"_); Accept/Override feeds the reward loop.
3. Every ingest and decision is **Article-12 immutable-logged**, KYA-tiered, and the data plane stays in the EU.

Per CLAUDE.md Rule 4 (goal-driven) this is the verification gate; nothing ships until criteria 1–3 pass on the GN100/IGX edge.

## 2. Scope decisions (locked)

| Decision            | Choice                                                  | Rationale                                                                                                                                                                                             |
| ------------------- | ------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| First signal source | **ANYmal Jokkeri telemetry + weather/grid-carbon APIs** | Jokkeri already operates on the Tornio ferrochrome floor; real data with no Outokumpu OT/IT integration dependency. Mill historians (EAF/melt-shop) are a fast-follow once a data path is negotiated. |
| Edge target         | **GN100 control brain + IGX mill-floor brain**          | Mirrors the Halos agile/anchor split: IGX near the floor for perception/ingest, GN100 as the control-room governance brain. Both are real DWS hardware line items.                                    |
| Action scope        | **Read-and-propose (no autonomous actuation)**          | Keeps the system outside Machinery-Regulation safety-component scope by construction (see §4.1). The World Model loop is hard-typed `applied:false`.                                                  |

## 3. Reuse vs. build (Rule 2/3 — surgical, no rebuild)

**Reuse (already real):**

- `src/agents/world-model/` — `WorldModelLoopAgent` (perception → imagination → action → reward), HIL-gated, `silent_pilot`. The brain.
- `src/routes/situation-room.routes.ts` + Supabase `situation_room_reports` — pattern to clone for the control room.
- V10 React PWA (`landing-pages/dws6-com/dashboard/firehorse/v10-react/`) — Vite/Tailwind/Supabase-realtime, installable (`vite-plugin-pwa`). UI base.
- `Firehorse/mobile-app/src/screens/ControlRoomScreen.tsx` — React Native field parity surface.
- Acer Veriton GN100 (`Admin/Acer-Veriton-GN100/`) — production-validated edge brain.
- `src/compliance/regulatory-timeline.ts` — `eu-machinery-reg`, `eu-ai-act` embedded, `product-liability-directive` nodes (added this session).
- KYA standard (`Legal/KYA_STANDARD_v1.md`) + Article-12 logging from `sales-outreach/PILOT_SHEET_OUTOKUMPU_FORTA.md`.

**Build (thin, net-new):** Tornio site config · `control-room.routes.ts` · `control_room_*` Supabase tables + RLS · telemetry ingestion adapters · Control Room view in the PWA · `/remote-control` backend handler (currently doc-only, no handler).

## 4. Architecture

```
Tornio signals            IGX mill-floor brain      GN100 control brain          governed store           mobile control room
(ANYmal Jokkeri,        → (perception/ingest,    →  POST /control-room/      →   control_room_* +     →   PWA + RN ControlRoomScreen
 weather, grid carbon,     edge-anonymize:           telemetry → loop.execute()   Art-12 audit             (Supabase realtime sub)
 site-mesh zones)          vectors not video)        → StateVector +              (Aiven/EU Supabase)            │
                                  ▲                     RankedActions +                                          │ Accept / Override
                                  │ zone constraints     ActionProposal                                         ▼
                          Outside-In camera mesh             ▲                                          POST /proposals/:id/decision
                          (broadcast to whole fleet)         └──────────── reward feedback ───────────────────────┘
```

Overlays on every step: HIL gate (`applied:false`, hard-typed) · KYA trust tier (fault → tier drop, per the Halos/KYA ontology mapping in `DWS_TRUTH_STANDARD.md` §2 row 28) · EU-sovereign data plane (no US Cloud Act surface, matching the Tier-1 sovereignty pilot field note).

### 4.1 Why "read-and-propose" keeps us out of the safety envelope

Halos isolates the fast-evolving AI layer from the frozen QNX safety island via a Type-1 hypervisor, so OTA updates to the AI layer do not trigger Machinery-Regulation re-certification. Our DWS analogue is the **HIL gate + KYA boundary**: the `WorldModelLoopAgent` never actuates (`applied:false` is not overridable), so it cannot change a robot's physical safety envelope and therefore cannot constitute a "substantial modification." This is the architectural reason actuation is out of MVP scope. If a future component _does_ act, it gets an explicit substantial-modification gate before any OTA.

## 5. Cross-cutting pillar — Lifetime Compliance & Liability Isolation

The hard problem in a 5–10 year fleet lifecycle is not initial certification; it is **staying compliant amid OTA updates, model drift, and layout churn**. Threaded through every phase:

1. **OTA / substantial-modification boundary (Machinery Reg, 2027-01-20).** See §4.1 — the HIL/KYA boundary keeps the updatable AI layer outside the safety envelope.
2. **Art-12 fleet telemetry with edge data-minimization.** Persist `StateVector` deltas + the triggering proposal/override — **not raw video** (anonymize at the IGX edge to coordinate vectors). Fits the Supabase 10-eps realtime ceiling and the Holoscan edge-filter model.
3. **Outside-In spatial mesh + mutation-surface isolation (the compliance crux).** Layout changes (conveyors, forklift lanes, work cells) update an infrastructure camera mesh once; zone constraints broadcast to the **whole fleet regardless of asset type** (`quadruped | humanoid | vehicle | agv`) — no per-asset reflash. The regulatory payoff is **isolating the mutation surface**: change is confined to a single, **versioned, Art-12-audited mesh-config object**, while each asset's certified safety kernel stays frozen and simply executes "if mesh says Zone X restricted, do not enter." A layout edit is therefore an _infrastructure config change_, not a per-asset modification of the Safety-Related Parts of the Control System (SRP/CS) across N machines — keeping it clear of an Annex I "substantial modification" trigger and preserving the negative 6–12-month Notified-Body runway. (Our control room never actuates or pushes asset safety code, so we are aligned by construction; the commitment is that mesh-zone changes are the _single_ versioned locus of change.) The overhead mesh also resolves **sensor occlusion** the onboard sensors can't — proactive path routing around new pillars/ladles/equipment on the ferrochrome floor instead of defensive E-stops. Modelled as a versioned `site-mesh` config + signal source in the Tornio `SiteConfig`.
4. **Lifetime liability + model drift + works-council/GDPR (PLD, 2026-12-09).** A continuous-drift-evidence dimension (the Halos SEF analogue) periodically evidences that fleet behaviour has not drifted past baseline — the "continuously signed evidence" wedge from the Halos brief. **Edge-anonymization (vectors, not video)** is a stated, provable property for the Outokumpu works council. Links to the `product-liability-directive` node in `regulatory-timeline.ts`.

**Positioning:** Halos governs the robot's safety envelope; the DWS Lifetime Fleet Control Room is the **governance/evidence layer that proves the fleet stays compliant over its lifetime** (Art-12 trail, drift evidence, anonymization proof, sovereign data plane). Complementary, not overlapping.

## 6. Phases

**Phase 0 — Site binding (foundation).** `src/control-room/sites/tornio.site.ts`: channels + per-site nominal bands (EAF power MW, melt-shop / ferrochrome furnace temp, AOD, scrap-yard, Jokkeri battery/pose/gas-thermal, weather, grid carbon intensity) plus a **versioned `meshZones` config** (the single audited locus of layout change, per §5.3 — every edit carries a version + Art-12 record). Refactor `state-vector.ts` to load bands from a `SiteConfig` rather than the hardcoded generic set (keep defaults). Define `ControlRoomEvent` aligning the web-stub schema `{source,timestamp,severity,assetId,actionRequired,message}` with `StateVector`/`ActionProposal`. Define the heterogeneous `FleetAsset` type.

**Phase 1 — Backend: loop behind a Control Room API.** `src/routes/control-room.routes.ts` (clone of `situation-room.routes.ts`): `POST /telemetry` (ingest → run loop with site config → persist state + proposals → Art-12 audit), `GET /state`, `GET /proposals`, `POST /proposals/:id/decision` (Accept/Override → `OperatorFeedback` → reward loop). Supabase migration **file** for `control_room_state / events / proposals / audit` + RLS by `control_room` role. (Authoring the `.sql` is GREEN; applying it is RED/human.)

**Phase 2 — Telemetry ingestion (two-brain edge).** `src/control-room/ingest/`: a **replay adapter** (representative Tornio signals, dev/demo, fail-loud), an **ANYmal Jokkeri adapter** (battery/pose/gas-thermal), a **weather/grid-carbon adapter** (public APIs), and a **site-mesh adapter** (Outside-In zones). The **IGX mill-floor brain** runs perception/ingest + edge-anonymization; the **GN100 control brain** runs the loop + KYA signing + the API. Polling transport (no LLM in the path — Rule 5).

**Phase 3 — Mobile Control Room UI.** Add a role-gated `control_room` route to the V10 PWA (reuse `useApi` + `subscribeToAlerts` realtime pattern): live StateVector tiles, anomaly badges, heterogeneous fleet status, HIL proposal cards (Accept/Override). Dual-folder mirror (`dws6.com` ↔ `landing-pages/dws6-com`). Point the existing RN `ControlRoomScreen` at the new API for field parity. PWA is already installable → "mobile" satisfied without a native build.

**Phase 4 — Governance & sovereignty.** KYA trust tier on the edge agent + per-proposal · Art-12 immutable audit (edge-minimized) on ingest + decision · EU data plane (Aiven PG / EU Supabase) · drift-evidence job (SEF analogue) · wire the `/remote-control` skill backend handler (status/alerts/acknowledge/dispatch) to these routes.

**Phase 5 — Productize (Agent Productization Rule).** CLI (`dws control-room …`), JSON output, MCP tool, `skills/manifest.json` registration, `docs/DWS_SKILLS_GUIDE.md` sync. Optional: lift the drafted Lifetime Fleet SKUs (`edge-node-gn100`, `LF-IGX-ORIN`, `LF-ANYMAL-INDUSTRIAL`) into `products.json` — separate pricing decision.

## 7. Data model (net-new)

- `SiteConfig` — `{ siteId, channels: { key, unit, nominalBand: [min,max] }[], meshZones: { version, zones, updatedAt, updatedBy } }` (meshZones is versioned — the single audited locus of layout change, §5.3).
- `FleetAsset` — `{ id, type: 'quadruped'|'humanoid'|'vehicle'|'agv', status, battery?, pose?, kyaTier }`.
- `control_room_state` — latest StateVector per site (org_id, site_id, captured_at, signals, max_severity, anomalies).
- `control_room_proposals` — open HIL proposals (rank_score, requires_human_approval, applied=false, rationale, decision).
- `control_room_audit` — Article-12 immutable: ingest deltas + decisions + triggering state (vectors, not raw feeds).
- RLS scoped to org + `control_room` role.

## 8. Recommended first slice (start here)

Phase 0 + minimal Phase 1 + Jokkeri/weather/grid (replay-backed) + one PWA Control Room view, single site (Tornio), read-only situational awareness + **one** HIL proposal type ("dispatch Jokkeri to inspect anomaly X"), on the GN100/IGX edge. Ships behind a flag; no live mill-historian integration yet. Satisfies the §1 success criteria and yields a demoable control room.

## 9. Deliberately NOT building (Rule 2/3)

No custom websocket server (Supabase realtime suffices; revisit only for sub-second needs) · no physics simulator beyond `ReferenceSimulator` (Cosmos stays an archetype) · **no autonomous actuation** — everything HIL-gated, aligned to AI Act Art-14 + Machinery Reg · no new native app (PWA + existing RN screen) · no SCADA write-back in MVP (read + propose only).

## 10. Risks & open decisions

- **Mill-historian access:** EAF/melt-shop integration needs an Outokumpu OT/IT data path (weeks). MVP avoids it via Jokkeri + weather/grid.
- **Works-council / GDPR:** edge-anonymization must be demonstrable before any camera-mesh data leaves the floor.
- **Sovereignty tier:** confirm EU Supabase vs Aiven PG for the data plane (Tier-1 target).
- **Relationship to the Forta pilot:** is this a new workstream or an extension of `PILOT_SHEET_OUTOKUMPU_FORTA.md`? (Affects commercial framing, not the build.)
- **Substantial-modification gate:** required before any future actuating component or OTA to it.

## 11. Edge hardware & sensing (supported vs auxiliary)

**Certified / safety-relevant compute (the only place safety functions or actuation may run):** NVIDIA **IGX Thor / IGX Orin** mill-floor brain and the validated **Acer Veriton GN100** control brain. These carry the SIL-capable, certifiable path (Halos Anchor analogue).

**Non-safety auxiliary (off the safety boundary — observe/show/prototype only):** Raspberry Pi / Jetson-Nano-class boards may serve as **telemetry relays, dashboard kiosks (the PWA), or bench prototyping nodes** feeding the read-and-propose Control Room. They **must never** run a safety function, compute a safety zone, or actuate — no SIL certification, no Safety Island, no CUDA/Holoscan. This matches the loop being non-actuating by construction (§4.1).

**Sensing Tornio may feed the Control Room** (situational awareness / evidence — duplicated to the non-safety side; any sensor used for an actual safety function stays on the certified Halos path):

- **On the ANYmal "Jokkeri" quadruped:** thermal/IR camera, gas sensors (CO, CO₂, O₂, combustibles, H₂S/SO₂), acoustic/ultrasonic leak & partial-discharge detection, lidar/depth, pose/odometry, battery/health.
- **Fixed mill instrumentation:** IR pyrometers and thermal-imaging cameras (furnace/ladle/refractory hotspots), EAF electrode current & power (MW), the Outside-In infrastructure camera mesh, vibration/acoustic on motors, fans, pumps and the hot-strip mill, cooling-water flow/temperature, baghouse/dust differential pressure and particulate (PM), and stack/area gas grids (CO, SO₂, NOx).
- **People & environment:** worker RTLS position tags, man-down / lone-worker and personal gas badges; ambient weather; grid carbon intensity.

MVP ingests the **Jokkeri + weather/grid** subset first (§2); the rest are fast-follows as the OT/IT data path opens.
