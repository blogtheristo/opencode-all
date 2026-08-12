# KYA+I — Know Your Agent Inference: European Inference Sovereignty Engineering

***

# VERSION AND AGENT HISTORY

Version: 1.5

Sessions & Modifications:

- Version: 1.5 | Tool: Claude Code (Sonnet 4.6) | Session: claude/european-inference-sovereignty-RmVlq | Date: 07.05.2026 | Changes: Strategic pivot to local-distributed-first; stack reordered (on-prem DGX [1], EU cloud [2-5]); §10 Moat Definition added with comparison table, durable moat statement, and positioning update; cold email restructured — on-prem leads, EU cloud is managed fallback tier

- Version: 1.4 | Tool: Claude Code (Sonnet 4.6) | Session: claude/european-inference-sovereignty-RmVlq | Date: 07.05.2026 | Changes: Expanded all 4 EU-sovereign cloud providers throughout — inference stack (§4) now shows Scaleway→OVHcloud→UpCloud→Hetzner→NIM EU→DGX→Groq; §7 buyer table updated; cold email inference bullet updated to name all 4
- Version: 1.3 | Tool: Claude Code (Sonnet 4.6) | Session: claude/european-inference-sovereignty-RmVlq | Date: 07.05.2026 | Changes: Cold email §9 — added NVIDIA Connect Partner paragraph covering Situation Room + Control Room on-prem GPU inference (IJS 100); added on-prem include/exclude guidance to personalisation notes
- Version: 1.2 | Tool: Claude Code (Sonnet 4.6) | Session: claude/european-inference-sovereignty-RmVlq | Date: 07.05.2026 | Changes: Added §9 Cold Email — Variant A final copy, structural rationale, personalisation slots; renumbered Open Engineering Items to §10
- Version: 1.1 | Tool: Claude Code (Sonnet 4.6) | Session: claude/european-inference-sovereignty-RmVlq | Date: 07.05.2026 | Changes: Added §8 Sales Opener — four validated variants (A/B/C/D), Boardy external validation logged, Variant A recommended for live sales calls
- Version: 1.0 | Tool: Claude Code (Sonnet 4.6) | Session: claude/european-inference-sovereignty-RmVlq | Date: 07.05.2026 | Changes: Initial — KYA+I concept, three-jurisdiction model (EU/US/ASEAN), European Inference Engineering definition, DWS stack mapping, "No US AI Act" problem analysis, updated KYA skill to v2.0

Session Links & References:

- KYA skill: .claude/commands/kya.md (updated to v2.0 in this session)
- Scaleway EU inference setup: docs/field-notes/2026-04-05-scaleway-eu-inference-setup.md
- NVIDIA × Groq stack: docs/field-notes/2026-04-05-nvidia-groq-deal-inference-stack.md
- Sovereign cloud research: docs/field-notes/2026-04-23-sovereign-cloud-providers-aegis-partner-research.md
- EU AI Act compliance layer: docs/field-notes/2026-04-23-eu-ai-act-compliance-layer-research.md
- EU tech stack sovereignty: docs/field-notes/2026-01-28-eu-tech-stack-sovereignty-positioning.md

Document Status:

- Created: 07.05.2026
- Last Modified: 07.05.2026
- Language: English (Finnish summary inline)
- Languages Available: English
- Publication Status: ACTIVE (private — LWM field-notes corpus)

***

**Type:** Research Note / Architecture Concept
**Date:** 2026-05-07
**Author:** Risto Anton Päärni · risto.paarni@lifetime.fi
**Location:** Helsinki, Finland
**Context:** DWS IQ 6 — KYA+I standard design session; EU inference sovereignty positioning
**Scope:** KYA Standard, inference routing, EU AI Act Art. 12, three-jurisdiction compliance
**Owner:** Lifetime Oy · risto.paarni@lifetime.fi

---

## Ontology Tags

- **Geography:** Europe > EU > Finland · EU Sovereign Cloud Zones
- **Sector:** Technology > AI_Inference > EU_Regulatory_Compliance
- **Entities:** Lifetime Oy, DWS IQ 6, KYA Standard, EU AI Act, GDPR, NIS2, Scaleway, OVHcloud, UpCloud, Hetzner, NVIDIA NIM EU, Groq
- **Temporal Context:** 2026-Q2, Pre-EU AI Act Full Enforcement (August 2026)
- **Confidence:** High

---

## Next Steps

1. Implement `kya inference` CLI path and backend endpoint (`GET /api/v1/kya/inference/:sessionId`)
2. Write EU inference jurisdiction metadata into Art. 12 audit log (Scaleway Object Storage)
3. Validate IJS scoring thresholds with legal counsel before enforcing EU customer score floor
4. Register KYA+I as a platform skill in `skills/manifest.json`

---

## TL;DR (Finnish summary)

> EU Sovereignty Engineering + European Inference Engineering + KYA =
> AI-järjestelmä, jossa inference on paikallinen, agentti tunnetaan ja
> vastuu on eksplisiittinen — ja siksi EU-kelpoinen.

KYA (Know Your Agent) answers: _who is this agent, and can I trust it?_
KYA+I extends this: _where does this agent think, and can I legally trust that location?_

---

## 1. The Problem — Inference Location is a Legal Fact

When an enterprise agent runs, it does two things that have legal weight:

1. **Processes data** — user prompts, documents, ERP records (GDPR Art. 4, data processor rules)
2. **Generates output** — the LLM inference step, where tokens are produced

Current compliance tooling (including KYA v1.x) tracks _who the agent is_ and _what it does_. It does not track **where the inference computation runs**, which provider holds the weights, whether prompts are retained, and which legal jurisdiction governs that provider.

This gap breaks EU AI Act Art. 12 logging (you cannot produce a complete audit trail without knowing the inference provider), GDPR Art. 28 (processor agreement must name the sub-processor chain including the LLM API), and NIS2 Art. 21 (supply-chain risk management extends to AI inference).

KYA+I closes that gap by binding inference jurisdiction metadata to the agent session trust record.

---

## 2. The Three-Jurisdiction Model

Three regulatory surfaces govern where AI inference can legally run for enterprise European customers. They are not equivalent. They are not converging fast enough to ignore differences.

### 2.1 EU — Regulated, explicit, binding

| Regulation                   | Inference-relevant requirement                                                                                 |
| ---------------------------- | -------------------------------------------------------------------------------------------------------------- |
| GDPR Art. 28                 | Named DPA with every sub-processor in the inference chain                                                      |
| GDPR Art. 46                 | Cross-border transfer requires SCCs or adequacy decision                                                       |
| EU AI Act Art. 12 (Aug 2026) | High-risk AI must log inputs, outputs, and reasoning steps — jurisdiction of that log is implicitly EU         |
| EU AI Act Art. 13            | Transparency: user must know they interact with an AI, and the AI provider must be identifiable                |
| NIS2 Art. 21                 | Supply-chain risk: LLM API vendors are critical ICT suppliers for AI-dependent operators                       |
| CSRD / ESRS E1               | Carbon footprint of AI compute must be reportable — inference location determines emission factor jurisdiction |

**Inference posture required:** EU-resident inference provider with signed DPA, no prompt retention, no training on customer data, GDPR SCCs auto-bound.

**DWS stack mapping:** Scaleway (primary, `fr-par`/`nl-ams`) → OVHcloud (FR, SecNumCloud) → UpCloud (FI, Helsinki) → Hetzner (DE, Nuremberg) → NVIDIA NIM EU (secondary, US-parent flagged) → on-prem DGX (on-prem sovereign).

**KYA+I score floor for EU customers: ≥ 80 (Sovereign or Compliant tier).**

---

### 2.2 US — Unregulated, fragmented, CLOUD Act-exposed

The US has **no federal AI Act**. This is not a temporary gap — it is a structural fact with deep consequences for EU enterprise buyers.

**What the US has (as of May 2026):**

| Instrument                | Status                                            | Binding?                   |
| ------------------------- | ------------------------------------------------- | -------------------------- |
| NIST AI RMF 1.0 (2023)    | Voluntary framework                               | No                         |
| Biden EO 14110 (Oct 2023) | Partially revoked Jan 20, 2025                    | Revoked                    |
| Trump EO on AI (Jan 2025) | Removes Biden guardrails, promotes "AI dominance" | Yes — removes restrictions |
| CA AB 2013 (signed 2024)  | Training data transparency (CA only)              | Yes — CA only              |
| CA SB-1047 (vetoed 2024)  | Frontier model safety measures                    | Vetoed — dead              |
| NY Local Law 144 (2023)   | AI in hiring (NYC only)                           | Yes — NYC only             |
| CO SB-205 (2024)          | AI in insurance (CO only)                         | Yes — CO only              |
| EU AI Act equivalent      | **Does not exist**                                | —                          |

**The CLOUD Act problem** (18 U.S.C. § 2713, 2018):

Any US-incorporated company can be compelled by a US court or federal agency to produce data held anywhere in the world — including EU datacenters — without notifying the data subject or the EU supervisory authority. This is not theoretical: active warrants have been issued.

A company using a US-headquartered LLM API (OpenAI, Anthropic, Google DeepMind, Groq before NVIDIA deal) for EU enterprise inference is, under GDPR Schrems II logic, potentially making an unlawful transfer — the DPA Framework adequacy decision does not override CLOUD Act reach for law-enforcement access.

**For KYA+I:** An agent running inference on a US-hosted API gets a CLOUD Act flag. This does not automatically disqualify it, but it must be disclosed in the agent session metadata and in the Art. 12 log. For high-risk AI categories (EU AI Act Annex III), US-hosted inference requires explicit risk acceptance at C-level.

**KYA+I score ceiling for US-hosted inference used with EU customer data: ≤ 50 (Partial tier). Flagged.**

---

### 2.3 ASEAN — Variable, converging, data-localisation driven

ASEAN has no unified AI Act equivalent, but national data laws create inference-relevant obligations:

| Country     | Data Law                                | Key inference implication                                                          |
| ----------- | --------------------------------------- | ---------------------------------------------------------------------------------- |
| Singapore   | PDPA 2012 + 2020 amendments             | AI governance framework (voluntary); data can leave SG with contractual safeguards |
| Thailand    | PDPA 2022                               | GDPR-equivalent structure; cross-border transfer requires consent or necessity     |
| Indonesia   | PDP Law 2022                            | Data localisation for "strategic" data; government data must stay on-shore         |
| Malaysia    | PDPA 2010 (amendment in progress)       | Transfer prohibition for personal data leaving MY without equivalent protection    |
| Vietnam     | Cybersecurity Law 2018 + Decree 13/2023 | Local storage mandate for data of Vietnamese users                                 |
| Philippines | DPA 2012                                | Cross-border transfer standard: comparable protection                              |

**ASEAN Model AI Governance Framework** (PDPC Singapore, 2019 + 2nd ed. 2020): voluntary, but increasingly referenced in procurement. No enforcement mechanism.

**Inference posture for ASEAN customers:** Jurisdiction-dependent. Singapore customers tolerate EU-hosted inference with SCCs. Indonesian government customers may require on-prem or local DC. Vietnamese customers with Cybersecurity Law exposure require VN-resident inference or explicit carve-out.

**KYA+I treatment:** ASEAN gets per-country scoring rather than a single tier. Default score = 60 (Partial) unless specific national DPA or in-country inference is confirmed.

---

## 3. KYA+I — The Extended Model

### 3.1 What KYA+I adds to the session trust record

Existing KYA session record fields (v1.x):

```typescript
{
  sessionId: string,
  humanIdentityHash: string,   // Shufti Pro verified
  trustScore: number,          // 0-100
  activePolicy: string[],
  lastVerified: ISO8601,
  chainDepth: number
}
```

KYA+I v2.0 adds an `inference` block:

```typescript
{
  // ... existing KYA fields ...
  inference: {
    provider: string,                  // "scaleway" | "nim-eu" | "groq" | "dgx-spark" | "openai" | ...
    providerHQ: string,                // "FR" | "US" | "SG" | "on-prem"
    inferenceRegion: string,           // "fr-par" | "nl-ams" | "us-east-1" | "espoo-onprem"
    jurisdictionZone: "EU" | "US" | "ASEAN" | "ON_PREM",
    cloudActExposed: boolean,          // true if providerHQ == "US" or parent is US
    promptRetention: boolean,          // does provider store prompts post-inference?
    trainingOnCustomerData: boolean,   // does provider train on API input?
    dpaInPlace: boolean,               // signed GDPR Art. 28 DPA exists
    dpaBound: boolean,                 // DPA auto-bound via ToS (e.g. Scaleway) or manual
    inferenceJurisdictionScore: number, // 0-100, see §3.2
    euAiActArt12Compliant: boolean,    // inference produces Art. 12-loggable audit trail
    lastInferenceProvider: string,     // actual provider used in last call (may differ from primary)
    fallbackChain: string[]            // ordered list of fallback providers
  }
}
```

### 3.2 Inference Jurisdiction Score (IJS)

The IJS is a 0-100 score computed at session start and re-evaluated on every provider switch.

| Dimension                   | Max points | EU                                                    | US                                         | ASEAN                         |
| --------------------------- | ---------- | ----------------------------------------------------- | ------------------------------------------ | ----------------------------- |
| Provider HQ in jurisdiction | 20         | 20 (Scaleway FR, OVHcloud FR, UpCloud FI, Hetzner DE) | 0 (OpenAI, Groq, Anthropic)                | 10 (AWS SG region, non-US HQ) |
| Inference DC in EU/national | 20         | 20 (`fr-par`, `nl-ams`)                               | 0 (US region)                              | 15 (SG/MY DC)                 |
| No CLOUD Act exposure       | 20         | 20                                                    | 0                                          | 10 (if non-US parent)         |
| No prompt retention         | 15         | 15 (Scaleway confirmed)                               | 5 (varies, often no)                       | 10 (varies)                   |
| DPA signed / auto-bound     | 15         | 15                                                    | 5 (SCCs available but CLOUD Act overrides) | 8                             |
| Art. 12 log capability      | 10         | 10                                                    | 5                                          | 5                             |
| **Max IJS**                 | **100**    | **100**                                               | **15**                                     | **58**                        |

### 3.3 IJS tier mapping

| IJS    | Tier      | EU AI Act posture                                    | Action                                       |
| ------ | --------- | ---------------------------------------------------- | -------------------------------------------- |
| 90–100 | Sovereign | Fully compliant, on-prem or EU-only inference        | No action                                    |
| 70–89  | Compliant | Meets Art. 12 + GDPR for high-risk AI                | Minor gap remediation                        |
| 40–69  | Partial   | Acceptable for limited-risk AI, not high-risk        | Disclose to customer, get written acceptance |
| 0–39   | Exposed   | CLOUD Act or no DPA — unacceptable for EU enterprise | Block or escalate to C-level                 |

### 3.4 New KYA+I reason codes for snap

| Code                               | When to use                                                                     |
| ---------------------------------- | ------------------------------------------------------------------------------- |
| `INFERENCE_JURISDICTION_BREACH`    | Agent switched to non-EU provider without authorisation for EU customer session |
| `CLOUD_ACT_EXPOSURE`               | Inference is routing through a US-parent provider, CLOUD Act flag triggered     |
| `PROMPT_RETENTION_DETECTED`        | Provider began retaining prompts after session DPA said no-retention            |
| `DPA_LAPSED`                       | Data processing agreement expired or was revoked by provider                    |
| `INFERENCE_FALLBACK_POLICY_BREACH` | Fallback chain stepped outside approved jurisdictions                           |

---

## 4. European Inference Engineering — Definition

**European Inference Engineering** is the discipline of designing, operating, and governing LLM inference pipelines such that:

1. **Compute residency** — every token generation step occurs within EU jurisdiction (or explicitly-contracted equivalent)
2. **Legal accountability** — a named EU legal entity (Art. 28 processor) is responsible for every inference call
3. **Prompt sovereignty** — no customer prompt is retained, indexed, or used for training by the inference provider
4. **Audit completeness** — every inference call is loggable to Art. 12 standard (timestamp, model ID, provider, input hash, output hash, latency, region)
5. **Fallback discipline** — fallback chains are pre-approved per customer tier; no silent cross-border fallback

This is distinct from:

- **Model sovereignty** (who trained the model) — DWS can use US-trained Llama on EU infrastructure; the compute sovereignty is what matters for GDPR
- **Data sovereignty** (where data is stored) — covered by existing sovereignty-assess; inference sovereignty is the compute plane, not the storage plane
- **AI safety** (model alignment, red-teaming) — orthogonal concern; safety-aligned US-hosted model is still CLOUD Act-exposed

### DWS Inference Stack (May 2026 — Local-First Architecture)

**Strategic shift (07.05.2026):** Local distributed inference is the primary
model for European Enterprise — not EU cloud. EU cloud is the managed/shared
tier for customers who do not require dedicated hardware. On-prem moves to [1].

```
EU Enterprise customer session
        │
        ▼
[1] On-prem DGX (Situation Room / Control Room — customer premises)
    Provider HQ: On-prem (Lifetime Oy + NVIDIA Connect Partner supply)
    CLOUD Act: NO  |  DPA: N/A (own hardware)  |  Prompt leaves building: NO
    IJS: 100 (Sovereign — maximum)
        │ not deployed / customer chooses managed cloud tier
        ▼
[2] Scaleway Generative APIs (fr-par / nl-ams)
    Provider HQ: France (Iliad SA)
    CLOUD Act: NO  |  DPA: Auto-bound  |  Prompt retention: NO
    IJS: 95 (Sovereign)
        │ fail / rate-limit
        ▼
[3] OVHcloud (FR, SecNumCloud)
    Provider HQ: France (OVH SAS)
    CLOUD Act: NO  |  DPA: GDPR DPA available  |  Prompt retention: NO
    IJS: 95 (Sovereign)
        │ fail / rate-limit
        ▼
[4] UpCloud (Helsinki / Frankfurt)
    Provider HQ: Finland (UpCloud Ltd)
    CLOUD Act: NO  |  DPA: EU-compliant DPA  |  EU-only staff access
    IJS: 92 (Sovereign)
        │ fail / rate-limit
        ▼
[5] Hetzner (Nuremberg / Falkenstein / Helsinki)
    Provider HQ: Germany (Hetzner Online GmbH)
    CLOUD Act: NO  |  DPA: GDPR DPA standard  |  Prompt retention: NO
    IJS: 88 (Compliant)
        │ fail
        ▼
[6] NVIDIA NIM EU (planned V1 — EU region)
    Provider HQ: USA ← CLOUD Act exposure
    BUT: NIM EU region DC = EU
    DPA: Requires explicit NVIDIA DPA (not auto-bound)
    IJS: 55 (Partial) — US parent offsets EU DC
        │ (non-EU admin / dev / demo path only)
        ▼
[7] Groq (US, emergency fallback — blocked for EU customer data)
    Provider HQ: USA (NVIDIA subsidiary)
    CLOUD Act: YES  |  IJS: 12 (Exposed)
```

    CLOUD Act: YES  |  IJS: 12 (Exposed) — blocked for EU customer data

```

---

## 5. The "No US AI Act" Engineering Problem

The US has no binding, comprehensive AI liability framework as of May 2026. This creates three concrete engineering problems:

### 5.1 Accountability gap

EU AI Act Art. 16 requires the AI provider to register high-risk AI systems and take legal responsibility. US inference providers operating into EU are subject to this requirement if they are considered "providers placing systems on the EU market." Most currently take the position they are "general-purpose AI" (GPAI) providers, not deployers — shifting Art. 16 liability to the enterprise customer.

**Engineering consequence:** When using a US GPAI provider, the enterprise customer becomes the Art. 16 responsible deployer. Their internal audit trail (Art. 12 log) must be complete because the provider will not produce one.

### 5.2 Incident response gap

EU NIS2 Art. 23 requires incident notification within 24 hours. A US inference provider under US law has no equivalent obligation — it can suffer a breach affecting EU customer data and notify only as required by US state laws (which vary and are slower).

**Engineering consequence:** EU enterprise customers using US inference must contractually impose EU incident notification timelines — most US providers resist this.

### 5.3 Regulatory divergence risk (2026+)

EU AI Act enforcement starts August 2026. US is moving toward deregulation (Trump EO Jan 2025 explicitly rejects precautionary AI governance). The gap is widening, not closing.

**Engineering consequence:** An EU enterprise that builds its AI stack on US inference in 2026 will face a mandatory EU-resident migration when their sector regulator (financial: DORA Art. 28; health: MDR/IVDR; critical infra: CER/NIS2) requires demonstrable sovereignty. DWS engineering position: build EU-resident inference now, treat US providers as dev/demo paths only.

---

## 6. KYA+I Operational Model

### Session lifecycle with inference binding

```

1. Agent session starts
   └─ KYA v2: resolve human identity (Shufti Pro)
   └─ KYA+I: resolve inference provider, compute IJS
   └─ if IJS < 40 AND customer jurisdictionRequired == "EU" → BLOCK

2. Agent runs inference call
   └─ KYA+I: log {provider, region, promptHash, outputHash, latencyMs, IJS}
   └─ Art. 12 log entry written (if euAiActArt12Compliant == true)
   └─ if provider switches (e.g. fallback triggered):
   └─ re-evaluate IJS
   └─ if new IJS crosses tier boundary → emit InferenceJurisdictionAlert
   └─ if new IJS < policyFloor → snap(INFERENCE_JURISDICTION_BREACH)

3. Session ends
   └─ KYA+I: seal inference audit trail
   └─ aggregate: total tokens per provider, total IJS-weighted session score
   └─ evidence pack written to Object Storage (WORM) for Art. 12 retention

````

### Per-customer inference policy

```typescript
// Stored in customer profile, enforced by KYA+I middleware
interface InferencePolicy {
  customerId: string;
  jurisdictionRequired: "EU" | "US" | "ASEAN" | "ANY";
  minIJS: number; // e.g. 70 for Compliant, 90 for Sovereign
  allowedProviders: string[]; // whitelist
  cloudActBlock: boolean; // true = block any US-parent provider
  fallbackApproval: "auto" | "hil"; // auto = use next in chain; hil = require human-in-loop
  art12LogRequired: boolean;
}
````

---

## 7. Why This Matters for DWS Sales

EU enterprise buyers in regulated sectors (manufacturing, construction, financial services, health) face a binary choice from their DPO and legal teams:

- **"Can you prove the inference stayed in the EU?"** → requires IJS score + Art. 12 log
- **"Who signed the DPA with the LLM provider?"** → requires named processor chain

Most AI vendors cannot answer either question. US-based AI platforms (Salesforce Einstein, Microsoft Copilot with Azure OpenAI, SAP Joule) carry CLOUD Act exposure by default. Their EU region addenda do not eliminate CLOUD Act reach.

DWS + KYA+I answers both in the first sales call:

| Buyer question                | DWS answer                                                                  |
| ----------------------------- | --------------------------------------------------------------------------- |
| Where does inference run?     | Scaleway, OVHcloud, UpCloud, or Hetzner — all EU-resident, IJS 88–95        |
| Who is the DPA processor?     | Named EU provider (auto-bound or pre-signed) + Lifetime Oy as sub-processor |
| CLOUD Act exposure?           | None on any EU cloud path. DGX on-prem option = zero                        |
| EU AI Act Art. 12 log?        | Every inference call logged, WORM-sealed, 10-year retention                 |
| What if inference fails over? | Policy-bound fallback; EU-only approved chain; alert + snap on breach       |

This is the commercial proposition of **European Inference Engineering**: not just a technical architecture, but a legally defensible audit trail that removes the DPO veto.

---

## 8. Sales Opener — Validated (07.05.2026)

Validated externally. Four variants, ordered by use case:

| Variant | Format             | When to use                                                           |
| ------- | ------------------ | --------------------------------------------------------------------- |
| **A**   | Enterprise verbal  | First sentence in a demo or POC call with procurement/DPO in the room |
| **B**   | Deck slide 1       | Competitive displacement slide; puts US platforms on the back foot    |
| **C**   | Cold outreach body | One-breath opener for email or LinkedIn                               |
| **D**   | Cold email subject | Question hook — highest open rate in legal/compliance buyer persona   |

**A — Recommended for live sales calls:**

> _DWS removes the DPO veto: we name where inference runs and who signed the DPA before your legal team asks._

**B — Slide 1 / competitive displacement:**

> _Every US AI platform fails the DPO question. DWS is the only one that answers in the first call: EU-resident inference, named DPA, Art. 12 log._

**C — Cold outreach body:**

> _When your DPO asks "where does inference run?" — DWS answers in the first call. No US platform can._

**D — Cold email subject line:**

> _Can your AI vendor tell your DPO where inference runs and who signed the DPA? DWS can._

Why Variant A works: it names the internal blocker (DPO veto, not the product feature), implies the competitor weakness without naming competitors, and puts the proof burden on the vendor — which DWS can satisfy and US platforms structurally cannot.

---

## 9. Cold Email — Variant A (DPO Blocker Frame)

**Status:** Final (07.05.2026). Use for outbound to Head of IT, CTO, CDO, or
Head of Compliance at Nordic/EU industrial enterprise accounts.

**Structural choices:**

1. Lead with the competitor DPO problem, not the product — the buyer
   recognises the blocker before they know what you're selling.
2. Name competitors by name (Copilot, Joule, Einstein) — signals you
   understand their stack, not a cold blast.
3. The proof block is four bullets, not a paragraph — DPOs scan for
   checkboxes; give them checkboxes.

---

**Subject:** Your DPO will block this AI vendor. Not DWS.

---

Hi [Name],

Your DPO has one question before any AI platform goes to procurement:
_where does inference run, and who signed the DPA with the LLM provider?_

Most vendors can't answer it. Microsoft Copilot routes through Azure OpenAI —
US parent, CLOUD Act exposure regardless of which datacenter. SAP Joule,
Salesforce Einstein: same problem. Their EU-region addenda don't close the
CLOUD Act gap, and your DPO knows it.

DWS removes the veto. The primary deployment is on-premise — inference never
leaves your building:

- DWS Situation Room (strategic command) and Control Room (field operations)
  run local NVIDIA GPU compute — no cloud hop, no third-party DPA, no
  CLOUD Act exposure of any kind. IJS 100.
- As an NVIDIA Connect Partner, we supply, certify, and support the hardware —
  this is a product, not a positioning statement.
- Every inference call logged to EU AI Act Art. 12 standard, WORM-sealed,
  10-year retention — DWS is the sole responsible entity, no co-responsible
  cloud provider

For teams that prefer managed cloud: we run on four EU-sovereign providers
(Scaleway, OVHcloud, UpCloud, Hetzner) — all EU-incorporated, no US parent,
no CLOUD Act reach, DPA auto-bound. EU cloud is the fallback tier.
US platforms cannot offer either option cleanly.

That's the answer your DPO needs to say yes.

We're working with [sector] clients in [geography] on [CSRD/ETS/EU AI Act]
compliance. Happy to do a 30-minute technical call so your legal team can
ask the hard questions directly.

[Sender name]
Lifetime Oy · DWS IQ

---

**Personalisation slots:**

| Token                  | Options                                                 |
| ---------------------- | ------------------------------------------------------- |
| `[Name]`               | First name — required                                   |
| `[sector]`             | construction, manufacturing, financial services, energy |
| `[geography]`          | Nordic, Finnish, German, European                       |
| `[CSRD/ETS/EU AI Act]` | pick the one most active for their sector               |

**On-prem paragraph:** include for defence-adjacent, critical infrastructure,
and large manufacturing accounts where procurement policy prohibits cloud AI.
Remove for standard enterprise accounts — too much hardware-sales weight too early.

**Do not personalise:** the competitor list (Copilot/Joule/Einstein) and the
cloud proof block — these are fixed and validated. Changing them dilutes the
DPO veto frame.

---

## 10. Moat Definition — Local Distributed First (07.05.2026)

**Strategic conviction (validated this session):**

> Local distributed inference is the better model for European Enterprise —
> not EU cloud. Cloud is the managed/shared fallback for customers who do
> not require dedicated hardware. The primary DWS deployment is on-prem.

**Why local distributed beats EU cloud for European Enterprise:**

| Dimension              | EU Cloud (Scaleway/OVH/UpCloud/Hetzner) | Local Distributed (DGX on-prem)    |
| ---------------------- | --------------------------------------- | ---------------------------------- |
| IJS score              | 88–95                                   | 100                                |
| CLOUD Act exposure     | None                                    | None                               |
| Prompt leaves building | Yes (encrypted, EU-resident)            | **No**                             |
| Multi-tenant risk      | Shared infrastructure                   | **Dedicated, air-gappable**        |
| Regulatory audit trail | Provider log + DWS log                  | DWS log only — no third party      |
| Latency                | 20–80ms network round-trip              | Sub-millisecond local              |
| EU AI Act Art. 12      | DWS + provider co-responsible           | **DWS sole responsible** — cleaner |
| NIS2 supply-chain risk | Counts cloud provider as ICT supplier   | **No external ICT supplier**       |
| DPA ceremony           | Required per provider                   | **None**                           |
| Hardware relationship  | Rented                                  | **Owned**                          |

**The moat — as stated:**

> _This is a durable moat for DWS, and it strengthens our NVIDIA alliance
> because the product is built to run locally, not just talk about sovereignty._

Three reasons this is durable:

1. **Sovereign deployment is a product, not a checkbox.** Situation Room and
   Control Room ship with NVIDIA GPU hardware. Competitors can add an EU-region
   toggle; they cannot add physical hardware without rebuilding their product.

2. **On-prem control tightens the NVIDIA alliance.** Every Situation Room or
   Control Room deployment requires NVIDIA hardware sourced through the Connect
   Partner relationship. Volume grows with customer count — the alliance deepens
   as we sell, not just at signing.

3. **Local distributed scales to edge.** Lifetime Fleet (Jetson Orin Nano) runs
   the same NIM container stack as DGX Spark. Site-level inference, robot
   inference, and data-centre inference share one KYA+I trust model. No
   competitor has that chain — they stop at the cloud gateway.

**Positioning update:**

| Before                                                | After                                                                           |
| ----------------------------------------------------- | ------------------------------------------------------------------------------- |
| "EU cloud primary, on-prem for customers who need it" | "On-prem primary, EU cloud for managed/shared tier"                             |
| "Scaleway is our EU inference backbone"               | "NVIDIA hardware is our inference backbone; Scaleway is our managed cloud tier" |
| On-prem paragraph at end of cold email (optional)     | On-prem leads the cold email; EU cloud is the accessibility tier                |

---

## 11. Open Engineering Items

- [ ] Implement `inference` block in `src/identity/kya-engine.ts` (KYA v2.0 schema)
- [ ] Add `/kya inference <session_id>` CLI subcommand — report IJS + provider chain
- [ ] Add new snap reason codes to `POST /api/v1/kya/snap`
- [ ] Implement `InferencePolicy` per-customer enforcement in middleware
- [ ] Art. 12 inference log writer → Scaleway Object Storage (WORM)
- [ ] ASEAN per-country IJS rules (SG/TH/ID/MY/VN)
- [ ] NIM EU DPA evaluation — does NVIDIA's EU region DPA survive CLOUD Act analysis?
- [ ] Add `inferenceJurisdictionScore` to Firehorse compliance report output

---

**Footer**
Owner: Lifetime Oy (risto.paarni@lifetime.fi)
Business ID: 0772407-9 | VAT: FI07724079
Part of the Lifetime World Model (LWM) field-notes corpus.
