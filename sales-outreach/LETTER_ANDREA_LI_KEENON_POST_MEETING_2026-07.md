<!--
VERSION AND AGENT HISTORY
Document: LETTER_ANDREA_LI_KEENON_POST_MEETING_2026-07.md
Version: 1.0
Last-Updated: 2026-07-16
Author: Risto Anton Päärni (Lifetime Oy)
Agent: Claude Code
Purpose: Post-meeting follow-up reply to Andrea Li (KEENON, Nordic Region) after
         the 2026-07 intro meeting. Frames the ask as a joint DEVELOPMENT
         PARTNERSHIP (co-development model): KEENON provides a demo unit, and we
         jointly add our Control Room /
         Situation Room / Mobile Room layer plus our own sensoring on top of the
         base. Also delivers the written sensor/API questions (attached) and asks
         for a technical follow-up. DRAFT ONLY — outbound email is a RED-zone
         action; a human sends it. Continues the existing thread on
         risto.paarni2024@lifetime.fi (partner sales outreach).
Recipient: Andrea Li — Senior Sales Manager, Nordic Region, KEENON Robotics
           (Teams / email: andrea.li@keenon.com)
Attachment: KEENON_TECHNICAL_QUESTIONS_2026-07.md (the written questions)
            KEENON_FLEET_FIT_BRIEF.md (one-page fit brief, if not already shared)
Transport: Amazon SES SMTP only (CLAUDE.md rule #4 — no Resend). DRAFT — do not auto-send.
Sender: risto.paarni2024@lifetime.fi (partner sales outreach; never noreply@, rule #3)
Owner: risto.paarni2024@lifetime.fi

Sessions & Modifications:
  - 1.2 | 2026-07-16 | Dropped the NVIDIA Inception reference at founder request;
                       neutral co-development framing.
  - 1.1 | 2026-07-16 | Reframed from "add-to-portfolio + model shortlist" to a
                       joint development partnership: demo unit + jointly built
                       Control/Situation/Mobile Room and sensoring. Portfolio
                       models kept as the rollout that follows.
  - 1.0 | 2026-07-16 | Initial post-meeting reply draft.

Note on sender address (surfaced conflict, per Rule 7): the earlier cold-outreach
letter (LETTER_ANDREA_LI_KEENON_DISTRIBUTOR.md) used risto.paarni@lifetime.fi
(legal). This thread is live on risto.paarni2024@lifetime.fi — the address Andrea
replied to and the one CLAUDE.md maps to partner sales outreach — so the reply
stays on risto.paarni2024@lifetime.fi. Not averaged; chosen with reason.
-->

# Post-Meeting Reply: KEENON — Andrea Li (Nordic Region)

**Status:** DRAFT for human review. Outbound email is a RED-zone action — send
after review, via Amazon SES SMTP, from `risto.paarni2024@lifetime.fi`.

---

**To:** Andrea Li — Senior Sales Manager, Nordic Region, KEENON Robotics · andrea.li@keenon.com
**From:** risto.paarni2024@lifetime.fi
**Subject:** KEENON × Lifetime Fleet — development partnership + a demo unit

---

Hi Andrea,

Thank you for the meeting and for sending the materials — the company
introduction, senior-living combinations, cleaning, retail, and the Q1 case
portfolio. They gave us exactly the overview we needed.

After our internal discussion, let me be direct about where we'd like to take
this: we're keen to become a **development partner** with KEENON — not a plain
reseller. The model we have in mind is a co-development one: you provide a demo
unit, and we build on it together.

Concretely, the joint work we'd like to do:

- **Start with one demo unit.** We'd take a single robot to develop on. Our first
  choice is the **DINERBOT T10** for its sensor-rich base (LiDAR + stereo vision +
  VSLAM + IMU), but we're glad to follow your recommendation on the best base for
  this.
- **Jointly add our Control Room / Situation Room / Mobile Room layer.** Lifetime
  Fleet already operates these — live monitoring, mission control, and a mobile
  situation room. We'd connect the KEENON base into them so the robot is
  supervised and governed the way our fleet already is.
- **Add our own sensoring on top.** We'd mount our edge sensor + compute payload
  on the base and run it alongside the robot's own navigation — extending
  perception, not replacing yours.

That combined unit — your proven base plus our Control/Situation Room and sensor
layer — is what we'd like to prove together first, then roll out across the
Nordics. Beyond the demo, we'd carry the **KLEENBOT C40** (cleaning),
**BUTLERBOT W3** (multi-floor senior-living room service — your W3 SDK-integration
case is encouraging), and **KEENON S100** (heavy-load) as the portfolio grows.

To make the joint development concrete, I've put our sensor-combination and API
questions in writing — attached and numbered so your pre-sales team can take them
one by one. The ones that matter most: the mechanical mounting and power/data
interface for our payload, the SDK / telemetry API into our Control Room, EU data
residency, and the remote software kill-switch we need for our EU AI Act / KYA
governance.

Could we set up the technical follow-up you offered — ideally with one of your
pre-sales colleagues — to walk the answers together and agree the demo-unit terms?
I can work around your Shanghai hours over the next two weeks.

Best regards,

Risto Anton Päärni
Founder, CEO · Lifetime Oy
risto.paarni2024@lifetime.fi · +358 400 319 010

---

## Send mechanics (for the human sender)

- **Sender:** `risto.paarni2024@lifetime.fi` (partner sales outreach — CLAUDE.md
  sender table). Never `noreply@`.
- **Transport:** Amazon SES SMTP only (no Resend).
- **Attachments:** `KEENON_TECHNICAL_QUESTIONS_2026-07.md` (as PDF or inline
  text). Optionally re-attach `KEENON_FLEET_FIT_BRIEF.md` if Andrea doesn't
  already have it. Do **not** attach internal MRR / KYA manifest / customer-pilot
  detail.
- **Thread:** reply in the existing thread Andrea started, so it stays on the
  `risto.paarni2024@lifetime.fi` address she already has.
- **Follow-up if no reply in ~5 business days:** short nudge offering two concrete
  time slots for the technical call.
