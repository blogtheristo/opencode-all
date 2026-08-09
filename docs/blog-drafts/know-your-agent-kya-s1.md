---
slug: know-your-agent-kya-s1
title: "Know Your Agent (KYA-S1): One Signed Page for the AI in the Security File That Touches Your Data"
series: "KYA-S1 blog series"
part: 1
parts_total: 12
lang: en
site: onelifetime.world
author: Risto Anton Päärni
date: 2026-08-08
hero_image: ../static/images/blog/kya-s1-series-hero-fi.jpg
hero_image_alt: "Series map: the 11 parts of the KYA-S1 blog series in one image (Finnish)"
hero_image_status: "PENDING FIX — Osa 8 esiintyy kahdesti (12 korttia / 11 osaa); 1024x559 alle 4K-rajan"
Status: APPROVED
approved_by: HIC (Risto Anton Päärni), 09.08.2026 — "englanninkielinen 100% vastaavuus = hyväksytty"
source: 1:1 translation of the HIC-approved Finnish text (know-your-agent-kya-s1.fi.md). Section-for-section, claim-for-claim; no added or removed argument.
note: >-
  Series part 1/11. Supersedes the earlier standalone EN post
  docs/blog-drafts/kya-s1-one-signed-page.md, which is kept untouched per CLAUDE.md Rule 12.
  Three chapters from that post are deliberately NOT carried over here, because the approved
  Finnish text does not contain them and approval is conditional on 100% correspondence:
  the public-comment window, the "specification not standard" chapter, and the engineers'
  chapter on Palantir MA-S2. They remain in the superseded draft.
  One intentional deviation from a literal rendering: the sign-off uses the canonical
  "Founder, CEO" form required by CLAUDE.md Sender Identity, not a literal "Founder & CEO".
  Assurance levels follow Legal/KYA_S1.md v1.5 (KYA-AL1/AL2/AL3).
---

# Know Your Agent (KYA-S1): One Signed Page for the AI in the Security File That Touches Your Data

Blog 1/11 · DWS IQ & Lifetime World Model · 8 August 2026 · Risto Anton Päärni

## Introduction: AI makes decisions — but who carries the liability?

The procurement files of enterprises and public administration today hold a substantial stack of signed documents. At the organisational level there are SOC 2 Type II and ISO/IEC 27001 certificates. For data and privacy there is GDPR and CSRD evidence. For platform security and infrastructure there is FedRAMP or a sovereign-cloud approval to point at.

One critical document is nevertheless missing from the procurement file: a signed page for the autonomous AI agent.

When AI moves from generating text to autonomous action — executing code, calling APIs, making financial transactions and steering physical industrial processes — old software security is no longer enough.

An autonomous AI agent is not merely software. It is an actor. That is why every agent requires an identity of its own that has been verified, a mandate to act, and an immediate emergency brake.

## One page for the vendor file (KYA-S1 v1.4 Specification)

KYA-S1 (Know Your Agent Security Specification v1.4) is a vendor-facing security specification that verifies the runtime behaviour and identity of AI agents. It condenses into three clear questions that every vendor must be able to answer before an agent is let anywhere near the customer's data:

**Who is behind the agent? (IDV — Identity Verification)**
Every decision the agent makes and every tool it requests must be traceable to a cryptographically verified human (the HIC — the human in command).

**What is it allowed to do, and what is it doing right now? (REG & BHM)**
The agent must have a capability manifest declared before activation (REG) that it cannot exceed at runtime, together with continuous behavioural monitoring (BHM) to detect deviations.

**How is it stopped when something fails? (TC4 — Chain Termination)**
If the agent's trust level collapses or a deviation occurs, the entire agent chain must be eliminable atomically within a time-bounded SLA response (leash snap).

## No self-attestation (§3 Evidence Meta-Rule)

The biggest pitfall in vendor management is self-attestation. §3 of the KYA-S1 specification forbids the vendor's own declaration absolutely:

> **Rule (§3):** Self-attestation is not acceptable evidence of KYA-S1 conformance. The paper is worth exactly as much as the name on its second signature line.

The only acceptable evidence is an audit report from an accredited third party (for example a SOC 2 auditor or an accredited red-team firm), or cryptographically verified platform telemetry retained in an immutable log register.

This rule binds the author of the specification too: Lifetime Oy will not issue a KYA-S1 certificate to its own DWS IQ platform until an independent, external assessor has signed it.

## KYA-AL assurance levels

The industry's KYA-AL assurance levels define the audit frequency and the SLA response time:

| Assurance level        | Audit frequency       | Required depth of evidence                                       | SLA response time (IDV & TC4) |
| ---------------------- | --------------------- | ---------------------------------------------------------------- | ----------------------------- |
| **KYA-AL1 (Standard)** | Annual audit          | Third-party audit in at least 1 domain + signed telemetry        | max 15 minutes                |
| **KYA-AL2 (Enhanced)** | Quarterly             | Audit in the IDV and BHM domains + 12 months of signed telemetry | max 5 minutes                 |
| **KYA-AL3 (Critical)** | Continuous, real time | External assessor across all 7 domains + signed SLA              | max 60 seconds                |

## Direct coupling to the EU AI Act (§4)

The KYA-S1 specification produces material that is directly usable against the obligations of the EU's AI Regulation:

- **Article 12 (Logging):** the KYA-S1 PRV control produces replayability of decisions (PRV-2) and immutable history.
- **Article 14 (Human oversight / HIC):** KYA-S1's IDV, TC4, TRS and PRV-4 guarantee genuine human command and override authority.
- **Article 50 (Transparency):** KYA-S1's PRV-3 produces a verifiable provenance marking for outputs.

**The honest limit:** KYA-S1 conformance is not, as such, EU AI Act conformance. It gives the buyer hard technical evidence that the agent's runtime behaviour meets the letter of the law.

## In short

- **One signed page:** an autonomous agent needs a security document of its own.
- **Real oversight:** KYA-S1 guarantees the binding of a human commander to the agent (IDV), runtime restriction (REG/BHM) and an emergency brake with no delay (TC4).
- **No self-attestation (§3):** the only accepted evidence is an independent assessor's signature or cryptographic telemetry.
- **AL assurance levels:** AL1, AL2 and AL3 define the required response speed, from 15 minutes down to 60 seconds.

## See the other parts of the series

- **Part 1:** Know Your Agent (KYA-S1) — One signed page for the AI that touches your data
- **Part 2:** The KYC equivalent for AI — seven critical KYA questions
- **Part 3:** EU AI Act Article 14 (HIC) and the contradiction of agent autonomy
- **Part 4:** Agent classes: a developer's GitHub Copilot vs. industrial DWS IQ background agents
- **Part 5:** KYA-S1 and BPMN 2.0: how an AI agent's trust level steers an industrial process in practice
- **Part 6:** KYA-S1 v1.3 × BPMN 2.0: atomic Lease Token, fail-closed, and honest TRS computation
- **Part 7:** When something goes wrong: 72-hour fault classification (FLT) and decision replay (PRV) in practice
- **Part 8:** The KYA-S1 ecosystem & production roadmap
- **Part 9:** Lifetime World Model (LWM) — a global state register and memory
- **Part 10:** Agentic commerce protocols & autonomous payments
- **Part 11:** The link to eWallet EU (EUDI Wallet) & eIDAS 2.0

---

Risto Anton Päärni

Founder, CEO, Lifetime Oy

Editor in Chief, Lifetime Scope Journal
