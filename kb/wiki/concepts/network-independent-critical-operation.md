<!--
VERSION AND AGENT HISTORY
Document: network-independent-critical-operation.md
Version: 1.0
Last-Updated: 2026-07-30
Author: Risto Anton Päärni (Lifetime Oy)
Agent: Claude Code
Purpose: Canonical DWS requirement set for dual-use manufacturing under hybrid-war
         conditions — loss of connectivity must not stop production or the core
         compliance workflow. Locked HIC decision, 30.07.2026.
Introduced-In: PR-pending (branch claude/enterprise-ai-harness-0anl7s)
Code-Version: 1.0
Branch: claude/enterprise-ai-harness-0anl7s
Date: 2026-07-30
Owner: risto.paarni@lifetime.fi
-->

# Network-Independent Critical Operation

**Version:** 1.0 · **Status:** Active — **locked decision**, not a preference · **Scope:** every Aegis pilot, every dual-use manufacturing deployment, every Control Room / Situation Room engagement
**Companions:** `Store/PRODUCT_AEGIS.md`, `DWS_DEPLOYMENT_STANDARD.md`, `kb/wiki/concepts/bounded-not-zero-sovereign-compute-economics.md`, `docs/field-notes/2026-07-30-network-independent-critical-operation.md`

## The premise

In a hybrid-war environment, **a manufacturing facility is dual-use critical infrastructure.** Connectivity is an adversary-reachable dependency. Therefore:

> **Loss of network connectivity must not stop production, and must not stop the core compliance workflow.**

This is an operational premise, not a deployment preference. It is not "we also offer on-prem." It determines what the product must do before any tiering, pricing or hosting conversation begins.

## The five pilot requirements

Every pilot is designed against these. A deployment that fails any of them is not compliant with this decision, whatever its tier.

1. **Local execution and local evidence** — the outcome is produced on site, and the evidence of it is written on site.
2. **Local identity, logs and kill authority** — agent identity, the Article 12 record and the ability to stop an agent all resolve locally. Kill authority that depends on a reachable control plane is not kill authority.
3. **No network dependency for the core outcome** — the critical path completes with the uplink down. If a step needs the network, it is by definition not core.
4. **Cloud only for optional sync, backup or non-critical reporting** — never for the outcome itself, never for the evidence chain, never for stopping something.
5. **Graceful degradation during outages** — degraded operation is designed and specified, not emergent. What is lost, what continues, and what reconciles on reconnection are all stated in advance.

## The commercial line

> **Aegis keeps critical compliance and control-room workflows running when the network cannot be trusted.**

Use this rather than "on-prem" or "air-gapped". Those describe a *deployment topology*; this describes the *outcome the buyer is purchasing*. A defence-adjacent buyer already knows what on-prem is and does not care — they care whether the line keeps running and whether the record survives when the link goes down.

## Why this argument is stronger than the economic one

DWS holds two independent justifications for local execution, and they should be deployed differently:

| | **Continuity** (this concept) | **Economics** (`bounded-not-zero-sovereign-compute-economics.md`) |
| --- | --- | --- |
| Claim | Critical workflows survive network loss | Unpredictable per-token exposure becomes a bounded cost base |
| Evidence status | **Provable today** — demonstrable in a pilot by pulling the cable | **Awaits measurement** — depends on the unrun depth-curve sweep |
| Buyer | Operations, security, continuity planning | Finance, procurement |

**Lead with continuity.** It is provable now, it does not depend on the throughput-knee measurement, and it is the argument a hybrid-war buyer is already making internally. The economic argument is real and belongs in the same conversation — but it is the one still carrying an unmeasured constant, so it must not be the load-bearing claim in a pilot proposal.

## Regulatory anchoring

The requirement is not only commercial. NIS2 and the CER Directive already treat continuity of essential and critical entities as an obligation, and the EU AI Act Article 12 record must exist for decisions taken **during** an outage, not merely be reconstructed afterwards. A design in which the evidence chain pauses when the uplink drops has an Article 12 gap precisely at the moment the record matters most.

## The test

For any proposed Aegis architecture, ask in this order:

1. **Cut the uplink — does production continue?** If no, redesign.
2. **Cut the uplink — is the Article 12 record still being written locally?** If no, the compliance claim fails under exactly the conditions it exists for.
3. **Cut the uplink — can an operator still stop an agent?** If no, the KYA kill authority is theatre.
4. **Is degraded mode specified, or discovered?** If discovered, it is not designed.
5. **On reconnection, what reconciles and in what order?** Unstated reconciliation is a data-integrity incident waiting for its first outage.
