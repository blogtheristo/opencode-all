Status: DRAFT
Slug: kya-s1-one-signed-page
Title: KYA-S1 — One Signed Page for the Agent in Your Vendor File
Language: en
Target: onelifetime.world/posts/kya-s1-one-signed-page.html
Date: 2026-08-06
claims_checked: 2026-09-30
Note: Reopened per DWS_BLOG_STANDARD's "any post-approval edit reopens the loop" — HIC correction (06.08.2026): KYA-S1 is a Specification, not a "standard" (no standards-body consensus process). "vendor standard" -> "vendor specification" throughout, version bumped v1.2 -> v1.3 to match Legal/KYA_S1.md.

# KYA-S1 — one signed page for the agent in your vendor file

Standards · Buyer Note · 6 August 2026 · Risto Anton Päärni · Espoo, Finland

## The news, in one line

Today we publish KYA-S1 v1.3 — a vendor specification for autonomous-agent identity and behavior,
written so a single signed page can sit in your procurement folder next to SOC 2 and ISO 27001.
Draft, open for public comment until 4 November 2026.

## The opener

Procurement keeps a folder. Every enterprise vendor lives in it.

SOC 2 Type 2 [3]. ISO 27001. FedRAMP, where it applies. CSRD evidence. A signed page per line, and a
date for the next renewal. That folder is how an enterprise decides who is allowed inside the
network.

Autonomous agents need a line in that folder. There was not yet a specification that fit the slot. So
we wrote one.

## What lands in the folder

One page. Signed by the vendor and by a qualified independent assessor. Renewed on a fixed
cadence. It carries the vendor and assessor names, the assessment date, the seven controls
attested, the propagation SLAs, and a renewal date.

Two signatures. Seven controls, each ticked by someone who is not us. A renewal date the
procurement team can put in a calendar.

That is what KYA-S1 is for. The rest of the specification exists to make that page mean something.

## The seven things the assessor checks

Each control is a question the buyer asks before the agent gets to act on their data.

IDV — Identity Verification. "Is every action traceable to a verified human?" Biometric
verification at session start. Cryptographic binding between the human, the agent, and every
downstream tool call. Re-attestation on privilege change. Revocation propagates across the fleet
inside the tier's SLA.

BHM — Behavioral Modeling. "Has the agent been red-teamed for what attackers actually try?" A
behavioral baseline per agent class. Continuous adversarial simulation against prompt injection [8],
MCP poisoning [9], agent-chain hijack, and jailbreak via chained tool calls. Guardrails block
deviations at runtime and emit signed telemetry on every block.

REG — Agent Registry. "Can you tell me, right now, every agent touching our data?" A live registry
of every agent instance, the human it is bound to, the capabilities it declared before activation,
and the model version it runs. Queryable across the whole fleet. Works disconnected and reconciles
on sync.

TC4 — Trust Collapse and Chain Termination. "When something goes wrong, how fast can you stop it?"
Detect the collapse, terminate the offending agent and every agent it spawned, propagate
fleet-wide inside the SLA, and preserve the decision trace for the post-mortem.

FLT — Fault Attribution. "If we end up in court, who is responsible for what?" A defined taxonomy
— model, logic, integration, operator, policy — applied to every incident within 72 hours of
close. Liability stops being an argument and becomes a lookup.

TRS — Trust Score. "Is authorization continuous, or did someone tick a box last quarter?" A live
quantitative score per session. Consequential actions are blocked when the score falls below
documented thresholds. Every score change is logged with the inputs that moved it.

PRV — Provenance. "Can you replay the decision, two years from now, for an auditor?" Every stored
fact carries its source, timestamp, confidence and policy version. Every consequential decision is
replayable from inputs, state, model version and policy version.

## What the EU AI Act changed on 2 August 2026

Article 50 started to apply that day [1][2]; for generative systems already on the market before it, the 50(2) marking duty follows on 2 December 2026 [2]. That is worth being precise about, because three
different duties are involved and they are not interchangeable.

Article 12 is record-keeping [1] — logging sufficient for traceability across the system's lifetime.
Article 14 is human oversight — a natural person who can understand, oversee and override.
Article 50 is marking and labelling — 50(2) binds providers to machine-readable marking, and 50(4)
binds deployers to label deep fakes and AI text published to inform the public on matters of public
interest where nobody assumed editorial responsibility.

KYA-S1 sits near all three. PRV is nearest to Article 12. IDV, TC4 and TRS are nearest to Article 14. PRV-3 watermarking is nearest to Article 50.

Near is not the same as equal, and we say so in the specification. A KYA-S1 attestation produces
evidence relevant to those articles. It does not discharge them. Any vendor — us included — who
says "we are KYA-S1 aligned, therefore we are EU AI Act compliant" is selling something that is not
true. Article 50 has exceptions the specification does not encode [1], and whether a system is
high-risk at all is a separate assessment [5] that, for stand-alone (Annex III) systems, enforces from 2 December 2027 [2].

## Why no self-attestation, including our own

Anyone can write a specification. The specification is only worth the assessor who signs against it [6].

So KYA-S1 disallows self-attestation in every control domain. The evidence has to be a third-party
audit, signed platform telemetry, architecture documentation reviewed by an independent assessor,
or a contractual SLA with a defined measurement method. Pick at least one, per domain, per year.

And the rule binds the house that wrote it. Lifetime Oy will not self-issue a KYA-S1 letter for the
DWS IQ Platform. Until an independent assessor signs one, we claim no tier. What is in the specification
under our name is an architecture description, not an attestation.

## Bronze, Silver, Gold

The tiers differ mostly in how many seconds it takes a vendor to do the hard things: revoke a
verified human, terminate a compromised chain, propagate that across the fleet. Bronze is fifteen
minutes. Silver is five. Gold is sixty seconds, with an independent assessor across all seven
domains.

A vendor claiming KYA-S1 names the tier, the assessor and the assessment date in the same line.
Anything less is marketing.

## The short version

Autonomous agents take consequential action, so procurement needs written accountability: who is
behind the agent, what it can do, and how it is stopped.

KYA-S1 is the one signed page that answers those three questions — seven controls, two signatures,
a renewal date.

No self-attestation. The page is only worth the name on the second signature line — and we hold
ourselves to that before we ask anyone else to.

Draft open for public comment until 4 November 2026.

## For engineers — how this sits next to other standards

SOC 2 and ISO 27001 attest the organisation. ISO/IEC 42001 attests the AI management system [4].
FedRAMP attests the platform. Software supply-chain regimes — SBOM standards, vulnerability
management, including Palantir's recently published MA-S2 — attest the code. KYA-S1 attests the
agent running on top of all of it.

The four core domains were structured to read easily for engineers already working with
supply-chain attestation regimes. That is the whole of the relationship: structural inspiration and
public credit. No joint programme, no co-attestation, nothing agreed with Palantir.

The three extension domains — fault attribution, continuous trust score, decision provenance — have
no analogue in any of those layers, because the problems they answer only exist once an autonomous
agent is the actor.

## Read the specification

KYA-S1 v1.3, full text: Legal/KYA_S1.md in the dws6 repository.
Where it sits in our posture: the DWS Compliance Hub at dws10.com/compliance/.
Comments during the window: risto.paarni@lifetime.fi.

## Read next

- KYA Standard v1.5 — what changed since the v1 field note
- MCP Apps extends the frontier — KYA is the identity spine
- Red Hat's EU sovereign move — and the three tiers beneath it

---

Risto Anton Päärni
Founder, CEO, Lifetime Oy · Editor in Chief, Lifetime Scope Journal

## Sources

[1] European Parliament and Council of the European Union (2024). Regulation (EU) 2024/1689 laying down harmonised rules on artificial intelligence (Artificial Intelligence Act). Official Journal of the European Union. https://eur-lex.europa.eu/eli/reg/2024/1689/oj

[2] Microsoft (2026). EU AI Act compliance checklist — Regulation (EU) 2024/1689 as amended by Regulation (EU) 2026/1744 (Digital Omnibus on AI). microsoft/agent-governance-toolkit (GitHub). https://github.com/microsoft/agent-governance-toolkit/blob/main/docs/compliance/eu-ai-act-checklist.md

[3] Microsoft (2026). System and Organization Controls (SOC) 2 Type 2. Microsoft Learn — Compliance offerings. https://learn.microsoft.com/en-us/compliance/regulatory/offering-soc-2

[4] Microsoft (2026). ISO/IEC 42001:2023 Artificial intelligence management system. Microsoft Learn — Compliance offerings. https://learn.microsoft.com/en-us/compliance/regulatory/offering-iso-42001

[5] Gardhouse, K., Oueslati, A., Kolt, N. (2026). Regulating AI Agents. arXiv. https://arxiv.org/abs/2603.23471

[6] Costanza-Chock, S., Harvey, E., Raji, I. D., Czernuszenko, M., Buolamwini, J. (2023). Who Audits the Auditors? Recommendations from a field scan of the algorithmic auditing ecosystem. arXiv. https://arxiv.org/abs/2310.02521

[7] Financial Action Task Force (FATF) (2025). International Standards on Combating Money Laundering and the Financing of Terrorism & Proliferation — The FATF Recommendations (updated February 2025). FATF. https://www.fatf-gafi.org/en/publications/Fatfrecommendations/Fatf-recommendations.html

[8] Greshake, K., Abdelnabi, S., Mishra, S., Endres, C., Holz, T., Fritz, M. (2023). Not what you've signed up for: Compromising Real-World LLM-Integrated Applications with Indirect Prompt Injection. arXiv. https://arxiv.org/abs/2302.12173

[9] Wang, Z., Gao, Y., Wang, Y., Liu, S., Sun, H., Cheng, H., Shi, G., Du, H., Li, X. (2025). MCPTox: A Benchmark for Tool Poisoning Attack on Real-World MCP Servers. arXiv. https://arxiv.org/abs/2508.14925
