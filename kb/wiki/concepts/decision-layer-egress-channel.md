<!--
VERSION AND AGENT HISTORY
Document: decision-layer-egress-channel.md
Version: 1.0
Last-Updated: 2026-08-03
Author: Risto Anton Päärni (Lifetime Oy)
Agent: Claude Code
Purpose: Canonical DWS statement of the decision-layer egress channel — why
         routing-as-a-service enters the sovereignty analysis, and the two
         operational rules the SageRoute audit produced. Full treatment:
         PHD_FIREHORSE §14.47 / Key Contribution #52; V3Thesis §10.28.
Introduced-In: PR-pending (branch claude/agent-factory-research-audit-l6hks2)
Code-Version: 1.0
Branch: claude/agent-factory-research-audit-l6hks2
Date: 2026-08-03
Owner: risto.paarni@lifetime.fi
-->

# The Decision-Layer Egress Channel

**Version:** 1.0 · **Status:** Active · **Scope:** any DWS routing, agent-infrastructure procurement, or sovereignty claim
**Full treatment:** `docs/PHD_FIREHORSE_EN.md` §14.47 + Key Contribution #52; `docs/metropolia/master-thesis/en/V3Thesis_EN.md` §10.28
**Companions:** `docs/field-notes/2026-08-03-agent-factory-sageroute-audit.md`, `src/factory/` (DWS Factory Router), `/factory-route`

## The rule

**A router that judges trajectories must see trajectories.** Any routing-as-a-service
component therefore opens a telemetry channel — task statements, tool-argument and
error fragments, longitudinal failure patterns — to a party outside the model-provider
DPA. That channel enters the DWS sovereignty analysis on equal footing with inference
itself: the compute substrate can be sovereign while the *decision* substrate silently
is not.

## The two operational rules (from the SageRoute audit, 2026-08-03)

1. **Route verdicts locally** unless the verdict provably requires cross-customer
   calibration. The deterministic core of trajectory-aware routing (evidence recovery,
   loop/thrash/stall detectors, guarded escalation ladder) ported into the DWS harness
   in one day with zero egress — `src/factory/`. What cannot be ported is the vendor's
   cross-customer calibration data, which is exactly the asset a firm hands over by
   exporting its trajectories.
2. **A component that impersonates a first-party client is a provenance defect**
   (KYA §14.24), regardless of engineering quality. Hardcoded first-party OAuth client
   IDs convert consumer subscriptions into metered infrastructure and destroy the
   ability to prove which harness originated a request.

## Why it compounds

The moat in agent infrastructure is trajectory-evidence ownership (§14.45 coupling
argument). Every session routed through DWS's own ladder accrues calibration data to
DWS token capital; every session routed through a verdict API accrues it to the vendor.
