<!--
VERSION AND AGENT HISTORY
Document: keenon-meeting-record-2026-07.md
Version: 1.0
Last-Updated: 2026-07-16
Author: Risto Anton Päärni (Lifetime Oy)
Agent: Claude Code
Purpose: Internal meeting record + partnership state for the KEENON Robotics
         intro meeting (July 2026). Captures what was discussed, decisions,
         model shortlist rationale, and next steps. Companion to the outreach and
         technical-questions files in sales-outreach/.
Owner: risto.paarni2024@lifetime.fi
Sessions & Modifications:
  - 1.0 | 2026-07-16 | Initial record after the intro meeting with Andrea Li.
-->

# KEENON × Lifetime Fleet — Meeting Record & Partnership State (July 2026)

**Status:** Intro meeting held. Moving to technical due diligence + model
selection. **Serious development-partnership opportunity**, beyond a plain
distributor resale.

**Framing (decided post-meeting):** we approach KEENON as a **joint development
partner** on a co-development model: KEENON supplies a **demo unit**, and we
jointly add our **Control Room / Situation Room / Mobile Room** layer plus our own
**sensoring** (the "T5000" payload) on top of the base. Distributor / portfolio
rollout follows once the combined unit is proven.

## Attendees / contacts

| Side                | Person             | Role                                       | Channel                                         |
| ------------------- | ------------------ | ------------------------------------------ | ----------------------------------------------- |
| Lifetime Oy         | Risto Anton Päärni | Founder, CEO                               | risto.paarni2024@lifetime.fi                    |
| KEENON (primary)    | Andrea Li          | Senior Sales Manager, Nordic Region        | andrea.li@keenon.com (Teams), +86 158 8783 3170 |
| KEENON (escalation) | Ace Jing           | Sales Director, European Division A        | (fallback route)                                |
| KEENON (next)       | Pre-sales team     | Technical answers to our written questions | via Andrea                                      |

KEENON HQ: 5&7&9&11 F, Building 56, No. 1000 Jinhai Road, Pudong District, Shanghai.

## What was discussed

- Lifetime Fleet's deploy-and-operate model (Control Room, KYA governance,
  pay-as-you-go) and where KEENON's robots fit.
- **Expanding Lifetime Fleet robotics targets** with KEENON models.
- The integration concept: **mount a Lifetime top payload (working name "T5000":
  edge sensor + compute module) on top of a KEENON base, connected to the Control
  Room.** This is the technical heart of the partnership — KEENON provides the
  mobile base + navigation; Lifetime adds its own perception/compute layer and
  governs the fleet.
- Sensor combinations and API/SDK requirements — Andrea asked for these **in
  writing** so KEENON pre-sales can answer each one.

> **Naming note:** "T5000" is **Lifetime's own** add-on payload, **not** a KEENON
> product. KEENON's actual lines are DINERBOT (T3/T8/T9/T9Pro/T10/T11),
> BUTLERBOT W3, KEENON S100/S300, KLEENBOT (C20/C30/C40/C55), XMAN humanoids, and
> KEENMOW K1. Do not refer to "T5000" as a KEENON model in any external material.

## KEENON at a glance (from the shared decks, July 2026)

- Founded 2010; 60+ countries; 100,000+ units shipped; global commercial-delivery
  market share ~29.8% (2024). SoftBank-backed. KEENON Cloud **GDPR-certified
  (2023)**. Finland is already a listed case market.
- Service: engineers in 12+ regions, ~30-min online response / 4-hour solution,
  up to 24-month warranty, remote deployment/diagnosis/OTA.
- Integration precedent: **BUTLERBOT W3 SDK integration** (luxury-apartments
  case), plus T10 voice-interaction integration — i.e. an SDK path exists.
- Accessory ecosystem relevant to multi-floor senior-living missions:
  **E-BOX** (elevator control), **G-BOX** (gated paths), **T-BOX** (phone
  control), call buttons/bells.

## Decision: models to test (priority order)

| #   | Model        | Why it's in the test set                                                                                                             |
| --- | ------------ | ------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | KLEENBOT C40 | Lead cleaning unit; 4-in-1; small-to-medium facility/healthcare fit.                                                                 |
| 2   | DINERBOT T10 | Delivery + interaction; sensor-rich base (LiDAR/stereo/VSLAM/IMU) — best candidate for the T5000 payload + Control-Room integration. |
| 3   | BUTLERBOT W3 | Multi-floor private room service for senior living; documented SDK-integration path = our API proof-point.                           |
| 4   | KEENON S100  | Heavy-load / back-of-house; **phase-2** once the first three prove out.                                                              |

Rationale ties to Lifetime Fleet's healthcare / senior-living focus and the
control-room integration thesis, not a broad hardware grab (surgical scope).

## Deliverables produced this session

- `sales-outreach/KEENON_TECHNICAL_QUESTIONS_2026-07.md` — 35 numbered questions
  (sensors, T5000 mounting, API/SDK, kill-switch/KYA, GDPR/NIS2, service,
  commercial) for KEENON pre-sales.
- `sales-outreach/LETTER_ANDREA_LI_KEENON_POST_MEETING_2026-07.md` — post-meeting
  reply **draft** (RED-zone: a human sends it) confirming portfolio intent + model
  shortlist and attaching the questions.

## Next steps

1. **Human review + send** the reply to Andrea (SES SMTP, from
   `risto.paarni2024@lifetime.fi`) with the questions attached.
2. Hold the **technical follow-up call** with Andrea + KEENON pre-sales.
3. On answers: scope **eval/loan units** for C40 + T10 + W3 and confirm Nordic
   exclusivity + distributor/operating-partner terms.
4. **MNDA** if KEENON needs it to share the SDK / interface specs (Partners/NDA
   templates available).
5. Public Keenon partner page stays in **"partnership in development"** framing
   until a signed agreement exists — see
   `Lifetime Fleet/KEENON_PARTNERSHIP_FLIP_CHECKLIST.md`.

## Related files

- `sales-outreach/KEENON_FLEET_FIT_BRIEF.md` — one-page fit brief.
- `sales-outreach/LETTER_ANDREA_LI_KEENON_DISTRIBUTOR.md` — the original cold
  outreach (pre-meeting).
- `Lifetime Fleet/KEENON_PARTNERSHIP_FLIP_CHECKLIST.md` — flip-to-authorized steps.
- `Lifetime Fleet/Fleet Admiral/README.md` — fleet model, numbers, Control Room.
