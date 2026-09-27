<!--
VERSION AND AGENT HISTORY
Document: KEENON_TECHNICAL_QUESTIONS_2026-07.md
Version: 1.0
Last-Updated: 2026-07-16
Author: Risto Anton Päärni (Lifetime Oy)
Agent: Claude Code
Purpose: Written technical question set for KEENON Robotics pre-sales, requested
         by Andrea Li (Senior Sales Manager, Nordic Region) after the 2026-07
         intro meeting. Andrea asked that our sensor-combination and API
         questions be sent in writing so the pre-sales team can review and
         answer each one. Grouped and numbered for one-by-one response.
         Attachment to LETTER_ANDREA_LI_KEENON_POST_MEETING_2026-07.md.
Recipient: Andrea Li — Senior Sales Manager, Nordic Region, KEENON Robotics (Teams: andrea.li@keenon.com)
Companion: LETTER_ANDREA_LI_KEENON_POST_MEETING_2026-07.md (the reply it attaches to)
           KEENON_FLEET_FIT_BRIEF.md (one-page fit brief)
Owner: risto.paarni2024@lifetime.fi

Sessions & Modifications:
  - 1.0 | 2026-07-16 | Initial written question set after the intro meeting.
                       Grounded in the five KEENON decks shared 2026-07 (company
                       presentation, senior living, cleaning, retail, case
                       portfolio). Note: "T5000" is Lifetime Fleet's own working
                       name for the top-mounted sensor+compute payload we would
                       add to a KEENON base — it is NOT a KEENON product.
-->

# Lifetime Fleet × KEENON — Technical Questions (Pre-Sales)

**From:** Risto Anton Päärni, Founder & CEO, Lifetime Oy (Lifetime Fleet)
**To:** Andrea Li — Senior Sales Manager, Nordic Region · pre-sales team
**Date:** 2026-07-16
**Re:** Sensor combinations and API/integration requirements — as requested in writing

**Context in one line.** Lifetime Fleet deploys and _operates_ service-robot
fleets across the Nordics, monitored from our own **Control Room** and governed
under our **KYA** autonomy standard (EU AI Act Art. 12 logging, NIS2, GDPR). We
want to (a) carry selected KEENON models, and (b) integrate them into our Control
Room — including mounting our **own top payload (working name "T5000": an edge
sensor + compute module)** on a KEENON base and streaming its data, alongside the
robot's own telemetry, back to the Control Room. The questions below are what our
pre-sales counterparts need to answer before we commit to test units.

> **Please answer inline, one by one.** Where a full datasheet or spec covers a
> question, a document reference is fine. Items marked **[NDA OK]** we are happy
> to take under the MNDA if that is the cleaner path.

**Models in scope for these questions:** KLEENBOT C40 (cleaning), DINERBOT T10
(delivery + interaction), BUTLERBOT W3 (multi-floor room service), and
KEENON S100 (heavy-load) as a phase-2 candidate.

---

## A. Models, availability & EU variants

1. Which of **C40, T10, W3, S100** are available for a **Nordic evaluation / loan
   program**, and what are the lead times to Finland?
2. For each model, confirm the **EU/CE-certified variant** and electrical spec for
   the Nordic grid (230 V / 50 Hz charging).
3. Any **indoor-only or climate constraints** we should design around (operating
   temperature, humidity, floor types — thin carpet vs hard floor)?
4. Which models are **already deployed in the Nordics / Finland**, and can we
   reference or visit a live site?

## B. Top-mounted add-on payload — the "T5000" concept

_(Our own sensor + compute module mounted on top of a KEENON base, powered and
carried by the robot, feeding our Control Room.)_

5. Is there a **supported mechanical mounting interface / payload deck** on top of
   the chassis for T10 / W3 / S100? Please share the mounting pattern, dimensions,
   and max **payload weight**. **[NDA OK]**
6. What are the **height / centre-of-gravity limits** for an added top payload
   before navigation, tip-over safety, or docking are affected?
7. **Power take-off:** can an add-on module draw from the robot's battery? If so,
   what **voltage and continuous/peak current** are available, and via which
   connector? If not, must the payload carry its own battery?
8. Is there an **exposed data/expansion port** on the chassis (Ethernet / USB /
   CAN / serial), and a documented **electrical + mechanical interface spec** for
   third-party payloads? **[NDA OK]**
9. Does adding a top payload **void warranty** or require KEENON **type-approval**?
   What is the process to certify a payload-equipped unit for operation?
10. Does an added payload change the robot's **CE / safety certification**, and who
    owns any re-certification (KEENON, Lifetime, or joint)?

## C. Sensor suite & perception data

11. Per model, the **full onboard sensor suite** — LiDAR (type / channels),
    stereo-vision cameras (count), VSLAM camera, ultrasonic modules, IMU, bumper /
    e-stop strips. Datasheets welcome. **[NDA OK]**
12. Can **raw or fused sensor streams** (LiDAR point cloud, camera frames,
    odometry, occupancy/cost map, robot pose) be **accessed by an external system
    in real time**? Which streams, at what rate, over what transport?
13. Can **our added sensors be fused into the robot's navigation stack**, or must
    they run as an **independent perception channel**? Is there a sensor-fusion or
    perception-extension API?
14. **Time synchronization:** is there PTP/NTP or a hardware sync signal so our
    payload sensors can be aligned to the robot's own timestamps?

## D. API / SDK & Control Room integration

15. Your case material references **SDK integration development** (e.g. the
    BUTLERBOT W3 luxury-apartments case). Please share the **SDK / API
    documentation**, supported languages, and access terms. **[NDA OK]**
16. **Telemetry / fleet API:** can real-time robot state — **pose, battery, task
    status, error codes, utilization** — be **pushed to our Control Room**? Which
    protocol (REST / WebSocket / MQTT / gRPC), what authentication?
17. Can that telemetry + command path run **fully on-prem / in-EU without a
    round-trip through KEENON Cloud**? (Critical for our sovereignty and NIS2
    posture — see §F.)
18. **Command / control API:** can we programmatically **dispatch tasks, set/cancel
    missions, send waypoint goals, pause/resume, and return-to-dock** from the
    Control Room?
19. **Map & mission management API:** upload/download maps, define zones and
    no-go areas, and set schedules via API?
20. **Multi-robot coordination / traffic management** — is this exposed to
    integrators, or KEENON-cloud-only?
21. **Accessory control via API:** can **E-BOX (elevator), G-BOX (gated paths),
    and T-BOX** be triggered and monitored through the API for multi-floor
    senior-living missions?
22. Is there a **webhook / event stream** for alarms, faults, and task-complete
    events?

## E. Safety, autonomy governance & kill-switch (KYA / EU AI Act)

23. Is there a **remote software emergency-stop / disable over the API** (our KYA
    governance needs a "leash-snap")? What is the **latency and delivery
    guarantee**?
24. Can **safety-critical behaviours** (physical e-stop, obstacle response) be kept
    **fully onboard and deterministic**, independent of any external command path?
25. Does the robot expose a **tamper-evident event/audit log** we can ingest into
    our **Article 12 (EU AI Act) logging / Firehorse audit trail**?

## F. Data, hosting & compliance (GDPR / NIS2 / EU residency)

26. KEENON Cloud is **GDPR-certified (2023)**. For EU deployments, can **telemetry
    and camera data stay in the EU / on-prem**, with **no data leaving the EU**? Is
    a **data-flow diagram + DPA** available? **[NDA OK]**
27. What data does the robot / cloud **collect by default**, where is it stored, and
    can cloud connectivity be **disabled for an on-prem-only mode**?
28. **Camera data:** on-device processing vs upload, and **PII handling** in
    senior-living / healthcare settings (residents and staff in frame)?

## G. Service, spares & firmware (operate model)

29. **Nordic / Finland spare-parts stocking and SLA** — how does the stated
    "30-minute online response / 4-hour solution" apply in Finland specifically?
30. **Firmware / OTA:** can we **stage and control OTA updates** (or are they
    cloud-pushed)? Is there **rollback**, and will an OTA affect a
    payload-equipped unit?
31. **Warranty** (you cite up to 24 months) — how does it apply to **operated
    fleet units** and to **payload-modified units**?
32. **Training / certification** for our field-service engineers — format,
    location, cost.

## H. Commercial / distributor (for the pre-sales handoff)

33. Current **Nordic exclusivity** status, and the difference between **distributor**
    and **operating-partner** terms for us.
34. **Minimum volumes** for distributor / evaluation pricing, and **eval / loan
    unit terms** for the pilot.
35. Compatibility of KEENON's commercial terms with our **pay-as-you-go / robotics-
    as-a-service** end-customer model.

---

**Reply to:** Risto Anton Päärni · risto.paarni2024@lifetime.fi · +358 400 319 010
Founder, CEO · Lifetime Oy · Laidunmaanraitti 2 A 25, 02330 Espoo, Finland

_"T5000" throughout this document = Lifetime Fleet's own top-mounted sensor +
compute payload, not a KEENON product. All model and capability references are
drawn from the KEENON decks shared with us in July 2026._
