<!--
VERSION AND AGENT HISTORY
Document: Network-independent critical operation — the hybrid-war premise for Aegis pilots
Version: 1.0
Date: 2026-07-30
Author: Risto Anton Päärni (risto.paarni@lifetime.fi), Founder, CEO, Lifetime Oy
Owner: Lifetime Oy
Status: Active — locked decision
Agent: Claude Code, session claude/enterprise-ai-harness-0anl7s
Purpose: Record the HIC's locked decision that in a hybrid-war environment a
         manufacturing facility is dual-use critical infrastructure, so loss of
         connectivity must not stop production or the core compliance workflow.
         Captures the five pilot requirements, the commercial line, the conflict
         this creates with the current Aegis product overview, and why the
         continuity argument is commercially stronger than the economic one
         captured earlier the same day.
Related: kb/wiki/concepts/network-independent-critical-operation.md,
         kb/wiki/concepts/bounded-not-zero-sovereign-compute-economics.md,
         Store/PRODUCT_AEGIS.md,
         DWS_DEPLOYMENT_STANDARD.md,
         docs/PHD_FIREHORSE_EN.md §14.45 (Finding 2 / Finding 5),
         docs/field-notes/2026-07-30-hic-decisions-executed.md

Sessions & Modifications:

- Version: 1.0 | Tool: Claude Code (Opus 5) | Session: claude/enterprise-ai-harness-0anl7s | Date: 30.07.2026 | Changes: Initial field note. Records the locked decision and its five pilot requirements, the commercial line, the conflict with the Aegis product overview ("available exclusively on European cloud or enterprise private cloud" — offline appears only as a premium tier), and the evidential asymmetry that makes continuity the stronger lead claim. Raises Q6.
-->

# Field Note — Network-Independent Critical Operation: the Hybrid-War Premise for Aegis

**Document Type:** Field Note — Locked Architectural / Commercial Decision
**Scope:** The operating premise for dual-use manufacturing pilots under hybrid-war conditions, the five requirements it imposes, and the product-doc conflict it exposes. Decision recorded and product overview corrected; tiering and pricing consequences deliberately **not** decided here.
**Ontology Tags:** Geography > EU-27, Finland, Nordics | Sector > Defence & Dual-Use > Critical Manufacturing, Resilience | Regulatory > NIS2, CER Directive, EU AI Act Art. 12 | Entities > DWS IQ Aegis, Control Room, Situation Room, Lifetime Oy | Temporal Context > 2026-Q3, hybrid-threat environment | Confidence > HIGH — this is a stated HIC decision, not an inference

## 1. The decision

> In a hybrid-war environment, a manufacturing facility must be treated as **dual-use critical infrastructure**: loss of network connectivity cannot stop production or the core compliance workflow.

Stated by the HIC on 30.07.2026 as an **operational premise, not a deployment preference**. It is upstream of tiering, hosting and pricing — it determines what the product must do before any of those conversations start.

**Five pilot requirements follow:**

1. Local execution and local evidence.
2. Local identity, logs and kill authority.
3. No network dependency for the core outcome.
4. Cloud only for optional sync, backup or non-critical reporting.
5. Graceful degradation during outages.

**The commercial line:**

> **Aegis keeps critical compliance and control-room workflows running when the network cannot be trusted.**

This is deliberately not "on-prem" or "air-gapped". Those name a *topology*; this names the *outcome being bought*. A defence-adjacent buyer knows what on-prem is and is unmoved by it — they care whether the line keeps running and whether the record survives when the link drops.

## 2. The conflict this exposes (surface it, do not average it — Rule 7)

`Store/PRODUCT_AEGIS.md` currently opens with:

> "…a hardened platform — **available exclusively on European cloud or enterprise private cloud**."

and lists air-gapped / on-premises operation only under the **Aegis Sovereign** tier (€4,999/mo, custom onboarding). Under the locked decision that framing is backwards in two ways:

- It presents network-independent operation as a **premium upgrade** when the decision makes it the **baseline premise** for the dual-use manufacturing case Aegis exists to serve.
- "Exclusively on European cloud or enterprise private cloud" reads as though local execution is *outside* the product, which is the opposite of what a hybrid-war buyer needs to hear in the first paragraph.

**Corrected in this change:** the overview now states the continuity premise and the commercial line. **Not decided in this change:** whether offline-capable operation moves into Standard/Defence, or stays a Sovereign-tier capability with the premise stated product-wide. That is a commercial call with pricing consequences — see Q6 (§5).

## 3. Why this argument is stronger than the economic one from earlier today

Earlier in this same session, §14.45 and the published post argued for local execution on **economic** grounds: harness token intensity makes metered pricing unviable for deep industrial workflows. That argument is sound and is now in the thesis. It is also the *weaker* of the two DWS holds.

| | **Continuity** (this note) | **Economics** (§14.45) |
| --- | --- | --- |
| Claim | Critical workflows survive network loss | Unpredictable per-token exposure → bounded cost base |
| Evidence status | **Provable today** — pull the cable during the pilot | **Awaits measurement** — the depth-curve knee is unrun |
| Buyer | Operations, security, continuity planning | Finance, procurement |
| Failure if wrong | Demonstrable on site, immediately | Argument collapses quietly under audit |

**Lead with continuity in pilot material.** It is demonstrable now, it does not depend on the unrun sweep, and it is the argument a hybrid-war buyer is already making internally. Keep the economic argument in the same conversation — but it must not be load-bearing in a proposal while it still carries an unmeasured constant.

This is also a useful check on the day's earlier enthusiasm: the session spent considerable effort making the economic case rigorous, and the stronger commercial case was sitting one premise away the whole time.

## 4. Regulatory anchoring

Not only commercial. NIS2 and the CER Directive already impose continuity obligations on essential and critical entities. More sharply: the **EU AI Act Article 12 record must exist for decisions taken *during* an outage**, not be reconstructed afterwards. An architecture whose evidence chain pauses when the uplink drops has an Article 12 gap at exactly the moment the record matters most — during the disruption it is meant to document.

That reframes the requirement from resilience engineering into compliance engineering, which is the layer DWS actually sells.

## 5. What was done, and the open decision

**Done in this change:** the decision recorded here and as a reusable requirement set (`kb/wiki/concepts/network-independent-critical-operation.md`, with a five-point architecture test); `Store/PRODUCT_AEGIS.md` overview corrected to state the premise and the commercial line.

**Not done — deliberately:** no tier restructure, no pricing change, no deployment-standard rewrite, no roadmap re-sequencing. Those follow the decision below.

### HIC question Q6 (EU AI Act Art. 14 intervention point)

**Q6. Network-independent operation is now the premise for the dual-use case. Does it move into the base tiers, or stay a Sovereign-tier capability?**

**Options:**

1. **Move offline-capable operation into Aegis Standard and Defence.** Matches the premise exactly: every dual-use manufacturing pilot gets it, because every such facility is critical infrastructure. Cost: it removes the single clearest reason to buy Sovereign, and Standard/Defence are currently software-only with no customer-sited hardware assumption — so the tier economics change materially.
2. **Keep it in Sovereign; state the premise product-wide.** The overview says loss of connectivity must not stop production; the *implementation* that delivers it remains the Sovereign tier. Preserves the pricing ladder. Risk: a buyer who reads the premise and then finds it costs €4,999/mo experiences it as a bait, which is worse than never having claimed it.
3. **Split the requirement.** Local evidence, local kill authority and graceful degradation become baseline in all tiers (they are governance, and DWS sells governance). Full local *execution* of the physical layer stays Sovereign, because it genuinely requires customer-sited hardware DWS does not resell.

**(RECOMMEND: 3.** It is the only option where the tier boundary follows a real technical boundary rather than a pricing preference. Requirements 2 and 5 — local identity/logs/kill authority, and specified degradation — are software and governance; DWS can and should deliver them everywhere, and requirement 2 in particular is where the Article 12 gap in §4 actually bites. Requirement 1's *execution* half needs a box on site, which is a genuine Sovereign-tier distinction and defensible to a buyer as such. Option 1 gives away the tier for nothing; option 2 states a premise the base product cannot honour, which is the failure mode this session has been correcting all day.)

- **Reversibility:** two-way door while it is internal wording; becomes **ONE-WAY** the moment it is quoted in a pilot proposal or a price list, because a capability promised and then re-scoped is a trust event.
- **Unblocks:** pilot scoping for dual-use manufacturing; whether `DWS_DEPLOYMENT_STANDARD.md` needs a degraded-mode profile per tier; the Aegis roadmap's edge-cloud split (item 4, Q1 2027).
- **Cost of delay:** moderate and rising. The premise is now stated in a public-facing product document; leaving the tier question open means the first buyer conversation resolves it by accident.
- **Rests on:** **verified** — the decision itself is a direct HIC statement, and the product-doc conflict is quoted from the file. **Not verified:** that Standard/Defence *can* deliver requirements 2 and 5 without customer hardware. That is an engineering question this note does not answer and option 3 depends on.

## 6. The five-step Learning Standard record

| # | Step | State |
| - | ---- | ----- |
| 1 | **Knowledge base** | ✅ `kb/wiki/concepts/network-independent-critical-operation.md` |
| 2 | **Field note** | ✅ this file |
| 3 | **`Learn/` HTML** | ✅ `Learn/2026-07-30-network-independent-critical-operation.html` + `.docx` |
| 4 | **Drive export** | ✅ `2026 DWS6` folder |
| 5 | **HIC question** | ✅ **Q6**, §5 |

## 7. Provenance note

Recorded per the HIC's instruction as a **locked decision in the current workstream**. The HIC noted that an attempt to persist it as a durable profile fact in an external system hit that system's size limit — which is precisely the failure mode `DWS_LEARNING_STANDARD.md` §1 names: knowledge that only an ephemeral session held. It is therefore recorded here, in git, where it survives.

---

_This document follows DWS Document Standard and DWS Learning Standard (EU AI Act Article 14)._
_Ontology: Defence & Dual-Use > Critical Manufacturing > Continuity Under Hybrid Threat > Network-Independent Operation_
