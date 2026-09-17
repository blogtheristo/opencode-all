<!--
VERSION AND AGENT HISTORY
Document: KTH / TECoSA — one-pager and proposed Letter of Intent topics
Version: 1.5
Date: 03.08.2026
Author: Risto Anton Päärni (risto.paarni@lifetime.fi), Founder, CEO, Lifetime Oy
Owner: Lifetime Oy
Status: Ready to send — awaiting HIC go
Agent: Claude Code, session claude/fuengirola-uber-cashflow-5dr1n3
Purpose: Response material for Prof. Martin Törngren (KTH), who asked for a one-pager and the points worth covering in a Letter of Intent. All traction claims reproduced from DWS_TRACTION_CANONICAL rules; no MRR, no dispatch operators as customers, no "live" Aegis. Structural context: docs/field-notes/2026-08-03-stockholm-position-and-the-runway-question.md §5d.
Valuutta: EUR johtaa, paikallisvaluutta sulkeissa (DWS_TRUTH_STANDARD.md §2H).
-->

# KTH / TECoSA — one-pager and proposed LoI topics

## 0. Context an agent or reader needs first

Prof. Martin Törngren directs **TECoSA — Trustworthy Edge Computing Systems and Applications**, a **Vinnova competence centre** hosted by KTH's ITM School with roughly 19 industrial partners, aimed at methods, tools and theory for safe, secure and predictable edge-computing systems.

That matters structurally, not just topically. In the Vinnova competence-centre model **the university coordinates and companies join as partners** — which is the lightest available route into Vinnova funding, since it does not require Lifetime to coordinate its own call. It remains subject to the same eligibility wall: **a funded party must be a Swedish legal person with operations in Sweden.** Lifetime Oy cannot be a funded party; Lifetime AB can.

**Disclosure obligation:** Lifetime AB is **not yet registered**, and **no Vinnova eligibility is claimed** until it exists and the Swedish implementation model is confirmed. The eligibility rule above is our current understanding, recorded for orientation — it is not asserted to KTH as a settled position. See §3.

---

## 1. The one-pager

> ### Lifetime Oy — governed autonomy at the regulated edge
>
> **Lifetime Oy** builds **DWS IQ**, a governed outcome layer for AI agents operating in EU-regulated industries. The company's position is that the hard problem in industrial AI is not model capability but **whether an autonomous decision can survive an audit** — and that this is an engineering problem with an assurance answer, not a policy one.
>
> **What is built and running.** The **KYA engine** (Know Your Agent) is at **TRL 5 completed, entering TRL 6**: identity binding, session trust scoring, a TC-4 containment mechanism, and **EU AI Act Article 12 reasoning-lineage audit tables deployed on the production API**. Technology readiness is anchored on KYA — not on any single product and not on revenue. **DWS IQ Aegis** is in **preorder, general availability September 2026, pre-revenue**. The platform addresses **25 EU-regulated industries**; the Aegis dual-use tier addresses 21.
>
> **What makes the testbed unusual.** Lifetime Oy operates a **licensed passenger-transport business** under **Traficom taxi operator licence 00010089** (valid to 24 October 2034). This is not a demonstrator. It is a regulated, insured, operating fleet with real vehicles, real dispatch integrations, real safety obligations and continuous real-world traces — a live edge environment in which trustworthiness claims can be tested against consequences rather than against a simulation. Most industrial partners bring a laboratory. This brings an operating regulated system, together with the Control Room / Situation Room layer that supervises it.
>
> **Where KTH's contribution would be decisive.** DWS IQ can *produce* the evidence — lineage, trust scores, containment events. What it does not yet have is a **rigorous assurance argument** connecting that evidence to a defensible safety claim: what the evidence is sufficient for, where it is not, and how an assurance case for a sovereign edge AI system should be structured and validated. That is TECoSA's discipline, not ours.
>
> **Capacity to carry partner commitments.** Relevant because a competence-centre partner must sustain co-funding and participation over several years, not because it is a pitch. A licensed transport operation and a small consulting practice run at approximately **€7,000/month combined**, putting the company at cash break-even with a founder salary of €0 — services and transport revenue, explicitly not software revenue. Two enterprise pilots were contracted in **Q1/2026 at €29,950 each (€59,900 booked)**. Team is a two-person core with a contracted engineering bench under NDA. Lifetime is a small partner and says so; the contribution offered is the operating environment and the platform, not headcount. Lifetime is also pursuing several EU and national funding tracks in parallel, so its capacity to carry a co-funding share does not depend on any single call.
>
> **Structure.** Lifetime Oy (Finland) holds the IP, the Finnish customers and the EU-programme track. **Lifetime AB is not yet registered, but can be established on an accelerated schedule if the Swedish research and financing track becomes concrete.** Which entity would act as the Swedish counterparty, and on what basis, is one of the points proposed for the Letter of Intent.
>
> Risto Anton Päärni · Founder, CEO · Lifetime Oy · risto.paarni@lifetime.fi · +358 400 319 010

---

## 2. Proposed LoI topics

**The relationship sought is a research partnership on the Vinnova track — KTH and Lifetime as partners, not supplier and client.** That much is our position. **Which Vinnova construction actually fits, and who coordinates, is a question for KTH, not an assumption of ours** — see item 5, and the covering email.

_Audit note (2026-08-03): v1.4 of this file stated the construction as decided ("TECoSA coordinating, Lifetime joining as an industrial partner… not a menu of possible relationships"). That pre-empted the very question being asked of Martin and contradicted the instruction not to lock the route, coordinator or co-funding model before he has commented. Corrected in v1.5; the partnership *character* is asserted, the *construction* is not._

Sent **with the one-pager**, not as a separate list. Ordered so that the questions determining whether the collaboration is *feasible* come immediately after the questions determining whether it is *interesting* — the Swedish applicant entity, the coordinator and the co-funding decide feasibility, and leaving them to the end invites an enthusiastic answer to a project that cannot be built.

**Scope and technical substance**

1. **Safety argumentation and assurance cases for sovereign edge AI** — the core KTH contribution. What claim structure is appropriate; what the KYA evidence (identity binding, session trust scoring, containment events, Article 12 lineage) is and is not sufficient to support; how the argument is validated rather than asserted.
2. **Safety–performance trade-offs** — the question underneath the assurance case and squarely TECoSA's territory: what containment, trust scoring and lineage capture *cost* in latency, throughput and availability at the edge, and where the defensible operating point sits. A safety argument that ignores its own performance price is not an engineering result. In scope from the start, not as a later finding.
3. **Trustworthiness properties in scope** — which of TECoSA's predictability, safety and security concerns the collaboration actually targets, and which are out of scope. A short exclusion list is worth more than a long inclusion list.
4. **TECoSA's validation role and Lifetime's contribution as an industrial use case** — a university-coordinated partnership: TECoSA brings the validation methodology, Lifetime brings the industrial use case and piloting environment. **No commitment is made here about access to passenger data.** Instrumentation and data access are **defined separately and subsequently**, within safety, GDPR and operator-licence-holder boundaries. A testbed carrying a real duty of care has limits a laboratory does not, and those limits are set before anything is instrumented, not negotiated afterwards.

**Feasibility — entity, coordination and money**

5. **Vinnova route and the partner construction** — TECoSA partnership, a joint call, or a separate application, and **who coordinates**. Everything below follows from this answer, so it should not be left implicit.
6. **Swedish applicant entity — an open question, not a solved one.** Our present understanding is that a Vinnova-funded party must be a **Swedish legal person conducting operations in Sweden**, and that foreign actors without a Swedish `filial` or `driftställe` may participate as project partners but cannot receive funding. **Lifetime makes no claim to be eligible today** — no Swedish entity is registered, and the Swedish implementation model is not yet confirmed. What the LoI should settle is which construction the collaboration would actually use (Swedish subsidiary, `filial`, or Lifetime participating unfunded alongside a funded Swedish party), and what each implies. Raised by us at the outset rather than discovered in an eligibility check.
7. **Co-funding** — Vinnova's share is capped (up to 80 % on planning grants), so **≥20 % own financing** is required. Say what form Lifetime's contribution takes: cash, in-kind engineering time, or fleet and platform access. In-kind access to an operating regulated environment is the strongest card and should be **priced and scoped**, not offered vaguely.
8. **Indicative timeline and milestones**, tied to a specific call deadline once the route in item 5 is chosen.

**People**

9. **Researcher pathway — three options, not one.** An `industridoktorand` employed by the Swedish entity and enrolled at KTH at ≥50 %; a **licentiate** as the lighter intermediate route (a real Swedish degree at roughly half a doctorate, and the realistic option for a founder who cannot commit four years); or a **postdoc** hosted at KTH and part-funded by the project, which puts research capacity on the problem without depending on the founder's own time. Cover supervision, admission requirements and expected start for whichever is chosen. Offering all three signals seriousness about the research, not only about the funding.
10. **Named contacts and decision rights** on both sides, so the collaboration does not depend on a single email thread.

**Boundaries**

11. **IP** — background IP stays with its owner; foreground IP allocated per category (research results, software, data). DWS IQ, the KYA engine and Aegis are background IP and remain Lifetime's.
12. **Publication rights and review window** — KTH must be able to publish; Lifetime needs a defined review period (30 days is customary) to flag confidential material and file before disclosure. State the number.
13. **Data protection and confidentiality** — operational fleet data involves personal data of passengers and drivers. Name GDPR roles (controller / processor), what is anonymised or aggregated before it leaves the operational system, and what never leaves it at all.
14. **Non-binding character and duration** — the LoI expresses intent and commits no funds. It is **non-binding except as to confidentiality, data protection, publication review, and any agreed IP provisions**, which bind on signature. State what supersedes it (a consortium agreement or a Vinnova project agreement) and by when.

**Next step**

15. **One short call to settle items 5–7**, before any text is drafted. The route, the coordinator and the co-funding form determine what the LoI can even say; a document written before those three are answered will need rewriting rather than editing. Everything else on this list can then be drafted in one pass and adjusted from KTH's side.

---

## 2a. Write this LoI for Vinnova, not for EIC

A tension worth resolving before drafting rather than inside the draft.

**The two programmes place KTH in incompatible roles.** In the Vinnova competence-centre model KTH **coordinates** and companies join as **partners** — a peer relationship. **EIC Accelerator takes a single company applicant**, applying alone and never as a consortium; a university cannot be a partner there. Under EIC, KTH would be a **subcontractor** or the author of a support letter.

**Writing the LoI to serve an EIC application would therefore demote KTH to supplier in the very document meant to establish a partnership** — the exact failure mode to avoid, and one that a competence-centre director will recognise immediately.

**So:** draft the LoI purely as a university-coordinated research partnership on the Vinnova track. The EIC benefit is real but indirect — a credible KTH collaboration strengthens the research and validation substance of any later EIC work package — and it should be a consequence of the partnership, never a stated purpose of the LoI.

## 3. What must be true before this is sent

- **RESOLVED (HIC, 2026-08-03) — the AB wording.** A revision had been proposed replacing *"Lifetime AB is being established"* with *"Lifetime AB is registered in Sweden"*. It was **rejected by the HIC** because the AB is not registered; the 2026-08-10 calendar entry is the decision *whether* to register it. The agreed wording is: **"Lifetime AB is not yet registered, but can be established on an accelerated schedule if the Swedish research and financing track becomes concrete."** Kept here as a record of a claim that was one edit away from going out and would have failed at the first eligibility check.
- **No eligibility is claimed anywhere.** Per the same HIC instruction: Vinnova eligibility is not asserted until the company exists and the Swedish implementation model is confirmed. Item 6 now states this as an open question and offers three possible constructions rather than presuming one.
- **Traction wording is reproduced from the canonical block** (`docs/TRACTION_CANONICAL.md` §2). No MRR figure, no customer count, no dispatch operator named as a customer, Aegis never "live". If any of this is edited before sending, re-check it against that file.
- **TECoSA partner count (~19) and centre framing** are taken from public KTH and Vinnova material and are `unverified` against current centre documentation. Do not quote a partner count back to its own director; the number is here for our orientation only.
- **Five further EU funding tracks are asserted but not yet recorded.** HIC states (2026-08-03) that five EU grant routes beyond Vinnova have been verified. **The names are not yet supplied and are therefore `unverified` here.** They are deliberately **kept out of the outgoing material**: Martin needs a clean Vinnova partnership proposal, not a grant portfolio, and naming a track we cannot substantiate is the same failure mode that this document has already caught twice. Their only role is the single unnamed sentence in the one-pager — that co-funding capacity does not depend on one call. Once the five are named they belong in their own document and, if they recur in outward-facing claims, in `DWS_TRUTH_STANDARD.md` §2 per the register-or-it-drifts rule (§3A).

- **Nothing has been sent.** No email, no attachment, no commitment. Awaiting HIC approval.
