# Item 3 — Offline/Edge Control-Room Test Plan (Jetson Orin Nano)

Status: PLANNED, NOT EXECUTED. Hardware not yet ordered. Written per HIC
instruction 19.08.2026: "Lifetime Fleet control room needs physical AI so
its premature scenario. But plan it."

## Why this exists

`RELEASE-READINESS.md` marks item 3 (offline/degraded-mode control-room
operation) NOT VALIDATED. Items 1 (durable replay/audit-chain store) and 2
(live Article12Logger DB writes) are being closed separately on DGX Spark
(Acer Veriton GN100 — the same box already documented as the Control Room
reference platform in `DWS_DEPLOYMENT_STANDARD.md:141`; no separate
purchase needed there). Item 3 requires physical, disconnectable edge
hardware — no cloud/remote rental service evaluated (Hetzner,
cloudjetson.com incl. its research-access program, Robot Rental Club
pending spec confirmation) offers the console/network-isolation access
the test needs; only a physically-held unit does. Containerizing the test
on GN100/DGX Spark was also ruled out — severing that box's network would
take down the production Control Room workload and wouldn't represent the
actual target (a small, rugged, in-vehicle/field node — `DWS_DEPLOYMENT_STANDARD.md:143`'s
"Mobile Command-Situation Room: 1× GN100 / Jetson (rugged)" tier).

## Hardware — final decision, 19.08.2026

**NVIDIA Jetson Orin Nano Super Developer Kit** — confirmed target, not
Orin NX or AGX Orin (superseded earlier in this decision thread once
`Store/PRODUCT_AEGIS.md:198`'s confirmed ISV partnership entry —
`NVIDIA | Jetson Orin Nano edge deployment | ISV Partner (confirmed)` —
and `dws10.com/aegis-partners/index.html:308`'s "Jetson Orin Nano for
edge, DGX Spark for on-prem inference" surfaced as the canonical source).

| Spec           | Value                                                                                                                                          |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| Module         | Jetson Orin Nano 8GB                                                                                                                           |
| GPU            | NVIDIA Ampere, 1024 CUDA cores, 32 Tensor cores                                                                                                |
| CPU            | 6-core Arm Cortex-A78AE v8.2 64-bit                                                                                                            |
| Memory         | 8GB 128-bit LPDDR5, 102 GB/s bandwidth                                                                                                         |
| AI performance | Up to 67 TOPS (25W mode)                                                                                                                       |
| Storage        | microSD + external NVMe via M.2 Key M                                                                                                          |
| Kit contents   | Module + heat sink + reference carrier board, DC PSU, 802.11ac/abgn Wi-Fi, quick start guide                                                   |
| Price          | €348 + VAT                                                                                                                                     |
| Vendor         | Silicon Highway (EU) — `sales@siliconhighway.com`, product code 945-13766-0005-000                                                             |
| Power envelope | 7W–25W                                                                                                                                         |
| PCIe           | 22 lanes Gen 4 (up to 2×x8, 1×x4, 2×x1)                                                                                                        |
| Video codec    | Encode 1080p30 (CPU-assisted); decode 1× 4K60 / 2× 4K30 / 5× 1080p60 / 11× 1080p30 (H.265) — not used by this test, no video pipeline in scope |
| Module network | 1GbE RGMII + optional 4×10GbE XFI (module-level; not exposed as-is on the reference carrier board)                                             |
| Module size    | 100mm × 87mm, 699-pin connector                                                                                                                |

**Carrier board I/O relevant to the test:** the reference carrier board
exposes exactly **1× GbE connector** — this is the single physical network
path to disconnect for the severance test in step 3 of the test sequence
below (no ambiguity about which port to unplug). Also present: 2× MIPI
CSI-2 camera connectors (unused, no camera in scope), 4× USB 3.2 Gen2 +
1× USB-C, 1× DP 1.2 display out, 40-pin GPIO/UART/SPI/I2C header (unused —
this is not a GPIO/CAN-bus/robotics test), 12-pin button header, 4-pin fan
header, microSD slot, DC power jack. Board size 103mm × 90.5mm × 34.77mm.

**Upgrade path, not a current purchase:** the reference carrier board also
accepts Orin NX modules — if 8GB proves insufficient once the actual test
runs, only the module needs replacing, not the whole kit. Do not pre-buy
the NX module; the Nano Super is the right scope for item 3 as defined
(governance-agent logic, no local LLM, no video pipeline — see "Scope
boundary" below).

Purchase is a standing HIC action, not yet executed.

## Scope boundary (explicit, do not drift)

This is **the same pilot acceptance test already defined** in
`docs/field-notes/2026-07-30-network-independent-critical-operation.md`
and `Store/PRODUCT_AEGIS_PILOT.md` — not a new test design. It proves the
five pilot requirements on real hardware, once:

1. Local execution and local evidence.
2. Local identity, logs and kill authority.
3. No network dependency for the core outcome.
4. Cloud only for optional sync/backup/reporting.
5. Graceful degradation during outages.

**Binary acceptance KPI (unchanged from the locked decision):** uplink
severed → workflow completes → Article 12 record still written locally →
operator can still stop a running agent — all three, or it is a delivered
negative result, not a partial pass.

## Deployment intent — production from day one, not throwaway

Per HIC instruction: this unit is not disposable test hardware. It is
flashed and configured as the actual production Control Room edge node
from the start, so the acceptance test **is** the Control Room go-live
check, not a separate exercise requiring re-provisioning afterward.

**Current constraint, stated plainly (per HIC, 19.08.2026):** Lifetime
Fleet's Control Room does not yet have physical AI (sensors/actuators) to
attach this unit to — deploying it into an active Control Room today is
premature. This plan captures the test/setup sequence for when that
changes; it does not claim a Control Room integration date.

## Test sequence (to run once hardware is in hand)

1. **Provision.** Flash JetPack. Deploy the same agent build running on
   DGX Spark (`src/agents/aegis.agent.ts` + KYA/Article12Logger/kill-switch
   stack) — the production config, not a stripped test image.
2. **Baseline (networked).** Confirm the agent runs correctly with network
   up: Article12 writes reach the real DB, replay/audit-chain store is
   reachable (same durable backend items 1–2 wire up on DGX).
3. **Severance.** Physically unplug the carrier board's single GbE
   connector (not a software toggle, not Wi-Fi disable — the whole point
   is proving no soft dependency remains; note the kit's included
   802.11ac Wi-Fi module must also be disabled/removed for this step,
   since it's a second network path the board has).
4. **During outage.** Run the target workflow. Confirm: workflow completes;
   an Article 12-equivalent record is written to local storage; an
   operator can issue a kill/stop command and have it take effect, using
   only local identity/authority — no round-trip to DGX/cloud.
5. **Reconnection.** Restore network. Confirm local records reconcile
   with the central store (sync per requirement 4) without conflict or
   silent loss.
6. **Repeat under failure variants:** severance mid-workflow (not just
   before start), and a second consecutive outage without a clean restart
   in between, to catch state that only survives one cycle.

## Integration pattern

Once provisioned, the unit's calls into the rest of the agent fleet use
the existing Agent-to-Agent discovery pattern (`AgentRegistry.discoverAgents()`
/ `executeAgent()` in `src/agents/index.ts`) rather than a bespoke
edge-specific integration — per HIC instruction to "use A2A protocol."

## Win11 logic-only pre-test (free, does not close item 3)

`scripts/win11-item3-pretest.ps1` — a PowerShell script for a human to run
on a real Windows 11 machine, per HIC request 19.08.2026, to get an early
free signal before the Jetson Orin Nano purchase. It disables a real
network adapter, exercises `AegisAgent.execute()` with the network down,
and confirms the local audit-chain entry and Article12 degraded-flag
behavior, then re-enables the adapter and checks reconciliation.

**This proves the code path only, on x86/Windows — it is not a hardware
validation and does not close item 3.** Jetson boards do not run Windows;
`Store/PRODUCT_AEGIS.md:198` already confirms Jetson Orin Nano (ARM/
JetPack) as the actual edge target. A passing Win11 run is evidence the
degraded-mode logic is sound going into the hardware test — nothing more.
Do not report a Win11 pass as item 3 being closed.

## What this plan does not claim

- No Control Room integration timeline — blocked on physical AI per HIC.
- No claim that item 3 is closed. This file exists so the test is ready
  to run the day hardware arrives; `RELEASE-READINESS.md` keeps item 3 as
  NOT VALIDATED until the sequence above is actually executed with
  evidence (logs, timestamps, the local record recovered post-severance)
  **on the confirmed Jetson Orin Nano target** — a Win11 pretest pass does
  not change this status.

## Open HIC actions

1. Purchase the Jetson Orin Nano Super Developer Kit (€348+VAT, Silicon
   Highway, EU) — standing action, not yet executed as of this plan's writing.
2. Decide the Control Room physical-AI roadmap that unblocks actual
   deployment — separate workstream from this test.
