***
VERSION AND AGENT HISTORY
- Version: 1.0
- Status: DRAFT — Risto to review before sending / boarding
- Classification: INTERNAL — contains positioning intended for external send (letter section) but not yet sent
- Document type: Action Plan / Outreach Draft / Board Pre-Read
- Author: Claude Code (claude-opus-4-7) + risto.paarni2024@lifetime.fi
- Date: 2026-05-25
- Location: Espoo, FI (Lifetime Oy HQ)
- Session: claude/exa-openclaw-integration-YnDpO
***

# Exa Case-Study Response — Action Plan

Companion to `docs/field-notes/2026-05-25-exa-enterprise-case-studies.md`.
That note flagged that Exa publishes **zero hard numbers** in its customer
stories (StackAI, Anara, WebFX). This document turns that gap into action:

1. **Letter to Exa** — opening move to position DWS as their first
   EU-regulated-industries case study, with numbers.
2. **Board summary + one-liners** — quotable framing for the next
   board (hallitus) session.
3. **Cross-functional change plan** — concrete edits to investor
   materials, sales outreach, product roadmap, and brand presence.

---

# 1. Letter to Exa

**Channel:** Email — primary recipient Exa partnerships / BD; cc Will Bryk
(Co-Founder & CEO, publicly listed). If no partnerships address is
discoverable, send via the contact form on exa.ai with the same body.
Risto sends; do **not** auto-send from any agent.

**Subject:** EU-regulated industries — proposal for a measurable Exa case study

---

> Hi Exa team,
>
> I'm Risto Paarni, CEO of Lifetime Oy (Espoo, Finland) and founder of
> DWS IQ 6 — an enterprise AI platform for 25+ EU industries that
> have to deliver against the EU AI Act (Article 12), CSRD, Fit for 55,
> CBAM, and NIS2 in 2026.
>
> We wired Exa into our production stack last weekend
> (`mcp-hub/config/exa-mcp.json`, GCP Secret Manager `europe-north1`,
> two prod keys: one for direct Firehorse skill calls, one for our
> agent-builder OpenClaw). Four agents are consuming it today:
> `investor-outreach`, `regulatory-radar`, `competitor-surveillance`,
> `kb-research`. End-to-end Cloud Run deploy completes this week.
>
> I read the StackAI, Anara, and WebFX case studies you published.
> They are excellent qualitative stories — but none of them publish
> hard numbers. I think we can offer you something different.
>
> **What we already measure (from Lifetime's master thesis, 2026):**
>
> | Metric | Result | Baseline |
> |---|---|---|
> | Product-update cycle time | **5 minutes** | 2 hours (96% faster) |
> | Documentation generation | **1 hour** | 1 week (99% faster) |
> | Error rate, AI-assisted edits | **<1%** | 5% (80% reduction) |
> | Product-feed acceptance, Google Merchant | **30/30 (100%)** | industry avg ~85% |
> | EU AI Act Article 12 readiness | **80%** | most enterprise stacks: 0–20% |
> | GDPR readiness | **95%** | — |
> | Fit for 55 readiness | **90%** | — |
> | CSRD readiness | **85%** | — |
> | NIS2 readiness | **75%** | — |
>
> **What we will measure on Exa, specifically, in the next 90 days:**
>
> - **Retrieval latency** (p50 / p95) for Exa Search and Websets calls
>   from `europe-north1` Cloud Run → Exa edge.
> - **Recall@10** for regulatory-document discovery, scored against a
>   hand-curated EU AI Act / CSRD / CBAM gold set (we maintain one).
> - **Cost-per-resolved-query** for `regulatory-radar` and
>   `competitor-surveillance` skills — comparing the Exa path against
>   the legacy Google Programmable Search + scraping path.
> - **Hallucination-rate delta** in agent outputs with and without
>   Exa-grounded retrieval, measured against the same compliance
>   gold set.
> - **End-customer trust score** — pilot customers in construction,
>   energy, and chemicals will rate citation quality on each
>   AI-generated answer.
>
> **What I am proposing:**
>
> 1. A **measured case study** — DWS IQ 6 as Exa's first EU-regulated-
>    industries customer story, with the numbers above published. Your
>    portfolio currently has no example in this segment, and the
>    EU AI Act August 2026 deadline makes the segment time-sensitive.
> 2. A **co-marketing motion** — joint LinkedIn post + a short webinar
>    aimed at compliance officers in steel, cement, chemicals, and
>    construction. We bring the audience (Lifetime Scope Journal, the
>    Finnish industrial associations we already work with); you bring
>    the retrieval-credibility argument.
> 3. A **technical partner conversation** — we have specific feedback
>    on Exa MCP HTTP transport behaviour under EU-residency
>    constraints, and one feature request (per-call data-residency
>    pinning so we can prove residency to auditors). Happy to share
>    in a 30-minute call.
>
> If any of this is interesting, I am available for a call in the next
> two weeks. Otherwise — keep building, Exa is the cleanest agent-side
> retrieval primitive on the market right now and we plan to keep
> using it either way.
>
> Best,
> Risto Anton Paarni
> CEO, Lifetime Oy
> risto.paarni@lifetime.fi
> https://onelifetime.world · https://dws10.com · https://dws6.com

---

# 2. Board Summary + One-Liners

## Summary (for board pre-read, ~150 words)

We integrated Exa — the leading retrieval primitive for AI agents,
used in production by StackAI ($16M Series A) and Anara (YC S24) — into
DWS IQ 6 over the weekend. The wiring is done; the Cloud Run rollout
completes this week. Two findings from the integration matter at board
level. **First**, Exa's customer base contains zero EU-regulated-industry
references, which makes us the natural first case study in that
segment and a free PR slot if we move now. **Second**, Exa publishes
zero quantitative outcomes for its existing customers — we already have
measurable outcomes from the Firehorse master thesis (96% cycle-time
reduction, 80% error reduction, 80% EU AI Act readiness) and we will
have Exa-specific numbers within 90 days. The strategic implication
is that retrieval is now a commodity — the moat is **EU sovereignty
plus Article 12 reasoning lineage**, not the search primitive. This
sharpens our investor pitch, our sales outreach, and the product
roadmap (see Section 3).

## One-liners (board-quotable)

1. **"Retrieval is now a commodity. Article 12 lineage is the moat."**
2. **"Exa took us two days to wire. The EU sovereignty layer took us four years."**
3. **"Exa's customer book has zero EU-regulated-industry references. That's our PR slot."**
4. **"Their case studies are qualitative. Ours will be quantitative. That's a category move."**
5. **"We're not competing with StackAI — we're the EU-sovereign version of what they sell."**
6. **"Every compliance officer's blocker is hallucinations. Anara's tagline — 'AI for people who can't afford to make mistakes' — is our market verbatim."**
7. **"DGX-only inference + Exa retrieval + Article 12 logging = a stack no US competitor can ship into the EU."**

---

# 3. Cross-Functional Change Plan

## 3a. Investor Materials

| Artifact | Change |
|---|---|
| `docs/field-notes/2026-03-15-investor-materials-audit.md` (the live audit) | Add an "Exa validation" appendix — point to StackAI/Anara as proof that the retrieval primitive we picked is the same one VC-backed peers picked. |
| Pitch deck — slide "Architecture" | Add Exa as the named retrieval layer; explicitly label it "commodity" and highlight DGX-only inference + Article 12 lineage as the moat. |
| Pitch deck — new slide "Why now" | "EU AI Act August 2026 + Exa's zero EU-regulated coverage = open category slot." |
| Pitch deck — slide "Traction" | Promote the four Firehorse thesis numbers (96%, 80%, 99%, 100% Google acceptance) onto the headline. Currently buried. |
| SAFE round investor INTROs (`Admin/investor-outreach/`) | Add one paragraph to the standard intro template: "We just wired the same retrieval layer (Exa) that StackAI uses, and we measured outcomes their customers haven't published." |

## 3b. Sales Outreach

| Surface | Change |
|---|---|
| `sales-outreach/signaalimyynti.md` | Add the four signal hooks from the new field note (StackAI-stack mention, due-diligence/RFP use case, R&D / regulatory-affairs org, "hallucination" blocker). |
| `sales-outreach/SALES_AI_AGENT_DESIGN_FI_v1.md` (6-agent design) | (1) Lead Scout adds "StackAI", "Anara", "Exa" to its competitor-mention crawler. (2) Outreach Agent ships the four templated openers from Section 3c below. (3) Discovery Agent qualifies on "hallucinations as a blocker" — that's now an ULTRA signal. |
| `FIREHORSE_SALES_WORKFLOW.md` | Add a "Peer reference" step before discovery calls: send the prospect the StackAI/Anara case studies as priming, then pitch DWS as the EU-sovereign sibling. |
| Outbound — Finnish industrial associations (FiGBC, etc.) | Co-host the proposed Exa webinar; even if Exa says no, we can host it solo and reference their case studies as third-party evidence. |

## 3c. Outreach Opener Templates (drop into Outreach Agent A/B library)

**Template A — for prospects already using a US agent platform:**
> "StackAI is excellent for horizontal agent workflows. For
> EU-regulated industries you also need Article 12 reasoning lineage
> — that's where DWS IQ 6 fits. 15 minutes next week?"

**Template B — for R&D / regulatory-affairs leaders:**
> "Anara built a research tool scientists trust because the right
> papers show up. We built the same thing for compliance officers:
> the right regulations, the right rulings, with traceable citation.
> Worth a 15-min look?"

**Template C — for prospects who name "hallucinations" as the blocker:**
> "Anara's tagline is 'AI for people who can't afford to make
> mistakes.' That is verbatim the EU industrial compliance problem.
> DWS IQ 6 closes the trust gap with Article 12 reasoning lineage."

**Template D — for late-stage / risk-conscious enterprises:**
> "Your retrieval layer doesn't have to be European — ours is Exa.
> But your reasoning and audit trail do. DGX-only inference, EU
> Secret Manager, Article 12 logging. Want the architecture diagram?"

## 3d. Product Updates

| Component | Update |
|---|---|
| `mcp-hub/config/exa-mcp.json` | Add Exa **Answer** and **Contents** tools to the pinned tool list when Cloud Run smoke-test confirms latency budget. Anara's case proves Contents is needed for citation-bearing flows. |
| Firehorse skill: new `seminal-preload` | Mirror Anara's "tell me your field, I preload seminal papers" onboarding for compliance officers: prospect names their sector → we preload the anchor regulations (CBAM/CSRD/EU AI Act per sector). 1-week build now that Exa is wired. |
| `kb-research` skill | Add citation-lineage post-processing — every Exa-retrieved snippet gets attached as an Article 12 provenance record. This is the productisation of the "moat is lineage, not retrieval" claim. |
| Reasoning-lineage UI (dashboard) | Surface the Exa source-URL chain visibly in every AI answer, with a downloadable "why this answer" trace. The trace is the demo. |
| Observability | Wire Exa call latency, recall, and cost-per-query into the Control Room dashboard so the 90-day measurements (from the letter) populate themselves. |

## 3e. Brand Presence

| Channel | Move |
|---|---|
| **LinkedIn (Risto + Lifetime Oy page)** | One post within 5 days: "Wired Exa in 2 days. Took 4 years to wire EU sovereignty. The retrieval is the easy part." Link to the field note (publish a public excerpt — strip INTERNAL bits). |
| **Lifetime Scope Journal (LSJ)** — next biweekly issue | Lead story: "Retrieval is now a commodity — here's where the moat moved." Use Exa + StackAI + Anara as the evidence, DWS Article 12 lineage as the answer. Use the `lsj-publish` skill. |
| **onelifetime.world/blog** | Public-facing essay version of the field note, EN + FI. SEO target: "EU AI Act Article 12 reasoning lineage", "AI agent retrieval EU sovereignty". |
| **dws6.com / dws10.com landing pages** | Add a "Built on" footer strip including Exa (and DGX Spark, GCP Secret Manager). Borrowed-credibility moves. Same-commit sync to `landing-pages/` mirrors per CLAUDE.md dual-folder rule. |
| **Investor / partner deck appendix** | "The 2026 agent retrieval landscape — and where DWS sits." One slide. |
| **Conference / Messe presence (PE meetings, German Messe)** | Add to the talk track: "We use the same retrieval stack as YC-backed US agent platforms. The difference is everything that wraps it." |

---

# 4. Sequencing — Next 7 Days

| Day | Action | Owner |
|---|---|---|
| Today | Risto reviews this doc; approves or edits the Exa letter | Risto |
| +1 | Send Exa letter; post LinkedIn excerpt | Risto |
| +2 | Cloud Run rollout completes; `/api/v1/health/secrets` confirms `exa: loaded` | Operator |
| +3 | LSJ draft uses `lsj-publish` skill with this story as the lead | Claude session |
| +4 | Update pitch deck slides (Architecture, Why Now, Traction) | Risto + Claude session |
| +5 | Board pre-read distributed — Section 2 of this doc | Risto |
| +7 | First Exa-specific latency + recall numbers land in Control Room | Operator |

---

# 5. What This Doc Is NOT

- Not an authorisation to send the Exa letter — Risto sends or doesn't send.
- Not a final pitch-deck rewrite — Section 3a is a checklist for the next deck pass, not the deck.
- Not a commitment that Exa will agree to a joint case study — the value of the proposal stands even if they say no (we publish our numbers regardless).
- Not a replacement for the field note — that note is the analysis; this doc is the action.

---

# Related

- **Source field note:** `docs/field-notes/2026-05-25-exa-enterprise-case-studies.md`
- **Wiring field note:** `docs/field-notes/2026-05-24-exa-openclaw-gcp-vault.md`
- **Branch:** `claude/exa-openclaw-integration-YnDpO`
- **Investor materials audit:** `docs/field-notes/2026-03-15-investor-materials-audit.md`
- **Sales design:** `sales-outreach/SALES_AI_AGENT_DESIGN_FI_v1.md`
- **LSJ skill:** `lsj-publish` (registered in `docs/DWS_SKILLS_GUIDE.md`)
