<!-- VERSION AND AGENT HISTORY
Document: Regulatory Radar Brief — Santander AI Open-Source Release vs EU AI Act
Version: 1.0
Date: 2026-06-22
Author: Claude Code (Opus 4.8) + Human Review
Branch: claude/santander-ai-governance-mhd8rj
Status: ACTIVE — market-signal brief
Document Type: Regulatory Radar (market-signal mode)

AGENT HISTORY:
- v1.0 (2026-06-22): Initial brief. Maps the SantanderAI open-source release to EU AI Act high-risk obligations and DWS IQ primitives. Market-signal output per /regulatory-radar use case 4 (investor/board briefings) and use case 5 (DWS product planning). External facts cited to github.com/orgs/SantanderAI/repositories (2026-06-22).
-->

# Regulatory Radar Brief — Santander AI Open-Source Release vs EU AI Act

**Mode:** market-signal (not a per-customer pipeline scan). Per `/regulatory-radar` use cases 4 (board/investor briefing) and 5 (DWS product planning).

**Signal:** A tier-1 bank published its internal AI-governance toolkit as 11 Apache-2.0 code repos, with Legal + CISO board sign-off. This is a **standardisation/normalisation signal**: the controls the EU AI Act will require for high-risk AI are moving from bespoke internal projects to shared, citable reference implementations. For a regulated-AI vendor this raises the _expected baseline_ a buyer's auditors will measure against.

## 1. Repo → EU AI Act obligation map

EU AI Act high-risk articles (credit scoring and insurance pricing are Annex III high-risk; lending/financed-decision use is the relevant lens here).

| Santander repo           | Governance function                                 | EU AI Act article it serves                         | DWS IQ primitive that delivers it                                                  |
| ------------------------ | --------------------------------------------------- | --------------------------------------------------- | ---------------------------------------------------------------------------------- |
| `mech-gov-framework`     | Hard decision gates + governance metrics            | Art. 9 risk management · Art. 14 human oversight    | KYA trust tiers (TC-0…TC-4) + verification gates + human-in-the-loop sign-off      |
| `autoguardrails`         | Guardrail/jailbreak stress-testing over `policy.md` | Art. 15 accuracy/robustness/cybersecurity           | KYA sandbox / MicroVM isolation + DWS Security Standard (prompt-injection posture) |
| `mutatis-mutandis`       | Counterfactual discrimination testing               | Art. 10 data governance (bias) · Annex III fairness | Fairness/non-discrimination checks for lending & financed decisions                |
| `sota-stressed-datasets` | Robustness benchmarking corpus                      | Art. 15 robustness                                  | Eval corpus (DWS does not currently ship an equivalent)                            |
| `llm_bridge`             | Vendor-neutral model routing                        | Art. 12 record-keeping (provenance) · sovereignty   | `AgentConfig.model` per-agent routing + EU-local fallback                          |
| `gen-fraud-graph`        | Synthetic fraud benchmarking                        | (operational, not a high-risk-AI obligation)        | Adjacent — no DWS overlap claimed                                                  |

**Article-level gap read for DWS:** the one Santander surfaces that DWS does **not** yet ship as a first-class artifact is a **counterfactual fairness test** (`mutatis-mutandis`) and a **published robustness corpus** (`sota-stressed-datasets`). Both are Art. 10 / Art. 15 evidence. See the engineering eval for whether to adopt.

## 2. Why this matters on the pipeline (urgency × risk)

- **EU AI Act high-risk obligations** phase in through 2026–2027. Credit scoring / insurance pricing sit in Annex III. Buyers in financial services will be asked by auditors to _evidence_ Art. 9/10/12/14/15 controls — exactly the surfaces Santander just made citable.
- **Normalisation effect (medium-high impact):** once a tier-1 bank's reference implementation is public, "we don't have a fairness test" stops being defensible. This raises the floor DWS sells above and gives DWS a concrete artifact to point at in deals ("here's the open reference; here's how we run it continuously and sign the output").
- **No new statute** — this is not a Delegated Act, so it is not an ALERT in the formal radar sense. It is a **market-readiness signal** that pulls demand forward.

## 3. Recommended DWS actions

1. **Product (Art. 10/15 gap):** scope adoption of counterfactual fairness testing into the financed-decision / lending agent path. Tracked in `docs/evals/SANTANDER_AUTOGUARDRAILS_MUTATIS_EVAL.md`.
2. **Sales (financial services):** the AI-governance wedge now has external air cover. Operationalised on `dws10.com/financial-services/` (see site wedge section) and in the wedge matrix below.
3. **Regulatory radar roadmap:** add "reference-implementation availability" as a scored input to the radar — when an incumbent open-sources a control, the buyer's expected baseline shifts even without a new statute.

## 4. Wedge matrix — Financial services AI-governance motion

Per `DWS_ROLES_REGISTRY.md` §2 (5 stages) and §5 (lead with the revenue/cost lever, not authority). Note: the registry's standing financial-services row uses the **financed-emissions (SFDR)** wedge; this brief defines a **second, AI-governance wedge** for the same vertical, triggered by the EU AI Act + the Santander signal. Roles referenced by R-ID.

| Stage        | Role(s)                                  | What they own for this wedge                                                 | What they win                                                                          |
| ------------ | ---------------------------------------- | ---------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| 1 — Sponsor  | R15 CISO (+ R16 Head of InfoSec)         | AI attack-surface + agent-action monitoring; signs off on agent governance   | Board-credible answer to "is our AI safe and contained" without staffing an OSS office |
| 2 — Owner    | R06 Head of Legal (+ DPO)                | EU AI Act conformity, DPIA, fairness/non-discrimination evidence             | Continuous signed evidence instead of one-off model audits                             |
| 3 — Approver | R13 CIO (+ R14 Head of IT)               | Vendor consolidation, integration, no-lock-in (llm_bridge analogue)          | Sovereign, vendor-neutral routing; no CLOUD Act surface                                |
| 4 — Driver   | R19 CRO / business-line owner            | Translates governed AI into faster, defensible credit/underwriting decisions | Decisions that survive audit → fewer rework loops, faster regulated approvals          |
| 5 — Sign-off | R23 CFO (+ R25 Board ESG/Risk Committee) | Capital/risk exposure, board narrative                                       | Auditable AI as a stated, evidenced board posture                                      |

**Door #1 for this wedge:** R15 CISO — the Santander board's own AI-governance sign-off included the CISO, which makes CISO-led entry the credible, mirror-the-incumbent motion. Lead with the InfoSec lever (containment + evidence), not the CEO.

## Sources

- SantanderAI org repositories — https://github.com/orgs/SantanderAI/repositories (retrieved 2026-06-22)
- `mech-gov-framework`, `autoguardrails`, `mutatis-mutandis`, `llm_bridge` repo descriptions (same source)
- EU AI Act, Regulation (EU) 2024/1689 — high-risk obligations, Annex III (credit scoring / insurance pricing)
