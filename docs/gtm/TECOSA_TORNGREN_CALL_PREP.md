# TECoSA / Törngren Call-Prep Brief — Discussing on His Principles

---

# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:

- Version: 1.0 | Tool: Claude Code | Session: claude/kth-trustworthy-systems-umlez8 | Date: 14.07.2026 | Changes: Initial call-prep brief for the Törngren/TECoSA 30-min intro call. Extracts his published principles (T-ITS 2025 safety-evidence review, SAFECOMP 2025 safety-argument fragment, INCOSE 2022 position paper, TECoSA phase-2, AD-EYE) from open sources and maps each onto the DWS instantiation. Framing per founder direction: the call is a discussion ON HIS PRINCIPLES, with DWS as the industrial instantiation.

Document Status:

- Created: 14.07.2026
- Last Modified: 14.07.2026
- Language: English
- Languages Available: EN
- Publication Status: INTERNAL
- Classification: CONFIDENTIAL — Partner Strategy
- Document Type: GTM Asset / Call-Prep Brief

Related Documents:

- docs/field-notes/2026-07-14-kth-broman-torngren-tecosa-trustworthy-systems.md (Source field note + approved reply)
- People/partners/academic/martin-torngren.md (Person note)
- Legal/KYA_STANDARD_v1.md (Know-Your-Agent trust scoring — the DWS run-time evidence mechanism)
- DWS_SECURITY_STANDARD.md (Article-12 logging posture)

---

**Purpose.** Risto's email to Törngren claims his INCOSE position paper "reads almost one-to-one against what we run in production." This brief makes that sentence fully defensible and prepares a 30-minute discussion held **on his principles** — his frameworks lead, DWS is the industrial instantiation. It doubles as the skeleton of the promised one-pager.

**Scope caveat (Rule 12).** Built from open abstracts, KTH/TECoSA/AD-EYE public pages, and search snippets. The INCOSE paper fulltext and the T-ITS review PDF are paywalled from this sandbox — before the call, Risto should skim the INCOSE paper itself (~20–30 min; DiVA/ResearchGate have copies) to have read his own claimed source first-hand.

## 1. His five principles (from his own published work)

**P1 — Trustworthiness is a trade-off discipline, not a property.**
His profile states it directly: the properties of interest are _safety, robustness, performance, cost, evolvability, autonomy — and the trade-offs between them_. Red threads: architecture, safety engineering, automation, model-based engineering. Nothing is "trustworthy" in isolation; it is argued relative to competing properties.

**P2 — Classical design-time assurance does not suffice; safety evidence must extend into run-time.**
The T-ITS 2025 review (Gyllenhammar, de Campos, Törngren — _The Road to Safe Automated Driving Systems: A Review of Methods Providing Safety Evidence_) starts from the premise that common design/V&V methods for safety-critical systems cannot cope with ADS complexity and operational uncertainty, and organizes evidence provision into **four method categories**:

1. design techniques,
2. verification & validation,
3. **run-time risk assessment**,
4. **run-time (self-)adaptation**.
   Categories 3–4 are the intellectual core: evidence generation continues during operation.

**P3 — Safety and performance are reconciled by quantified requirements plus constrained dynamic autonomy.**
The SAFECOMP 2025 safety-argument fragment (same authors) builds the argument from three moves: (a) **vehicle-level quantitative safety requirements** (not exhaustive scenario enumeration), (b) **situation awareness that dynamically adapts decision-making**, and (c) **Precautionary Safety (PcS) constraints** that clamp behavior so the quantitative requirements stay satisfied. I.e., you don't prove the system perfect — you bound it, measure it, and constrain it dynamically.

**P4 — Trustworthiness assurance is a certification problem for CPS in interplay with smart infrastructure.**
TECoSA phase 1 was themed Predictability / Safety / Security; since 2023 (phase 2) it runs **application-oriented projects** with tighter research–use-case–testbed integration, and names **"Trustworthiness Assurance"** — certification of CPS acting in interplay with smart digital infrastructure — as a key challenge.

**P5 — Progress happens through testbeds and multidisciplinary industry–academia collaboration.**
The INCOSE 2022 position paper's strategic directions explicitly emphasize **testbeds** and **collaborative multidisciplinary research** (it formed TECoSA's research agenda). AD-EYE embodies it: a modular, open-interface **co-simulation testbed for early verification of functional safety concepts**, built to carry research from low to mid/high TRL. His industrial-PhD model (Scania, Alstom, Ericsson) is the same principle in human form.

## 2. The mapping — his principle → DWS instantiation

| His principle                                  | DWS instantiation                                                                                                                                    | One line for the call                                                                                                                       |
| ---------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| P1 trade-off discipline                        | KYA autonomy tiers + per-agent cost/latency budgets: autonomy is granted against measured trust, never absolute                                      | "We treat agent autonomy exactly as a trade-off variable — earned against evidence, priced against risk."                                   |
| P2 run-time evidence (cat. 3)                  | **KYA trust scoring** = run-time risk assessment of agents: per-session trust scores continuously computed from behavior                             | "Your category 3 — run-time risk assessment — is what KYA does, with the _agent_ as the assessed unit instead of the vehicle."              |
| P2 run-time evidence (cat. 4)                  | **TC-4 Leash Snap** = run-time (self-)adaptation: a compromised or out-of-bounds agent chain is automatically constrained/halted                     | "Category 4 is our leash-snap: the system adapts by revoking autonomy when the trust score breaks threshold."                               |
| P3 quantitative requirements + PcS constraints | Quantified trust thresholds per autonomy tier; hard constraints (sandbox/MicroVM, RED-zone human gates) that clamp agent behavior so thresholds hold | "Our precautionary constraint is architectural: below score X, the agent physically cannot act — the human gate is the PcS clamp."          |
| P2+P4 evidence → certification                 | **Article 12 logging pipeline**: every agent decision becomes structured, verifiable, retained evidence — the certification-facing artifact          | "The evidence chain is the product: regulatory alignment falls out of it rather than driving it."                                           |
| P4 CPS ↔ smart infrastructure                  | Edge Control Room / Situation Room: agents at the industrial edge in interplay with fleet devices and infrastructure                                 | "Our deployment unit is exactly your object of study: autonomous decision-making at the industrial edge, in interplay with infrastructure." |
| P5 testbeds + collaboration                    | The offer itself: **industry provides the deployment ground, university the verification framework** — the AD-EYE pattern applied to agentic edge AI | "What AD-EYE is for automated driving, a DWS deployment could be for trustworthy agentic edge systems."                                     |

## 3. Discussion questions (on his principles — he leads, we probe)

1. **On the four categories (P2):** For _agentic_ (LLM-based) systems at the edge, where does he see evidence provision weakest today — run-time risk assessment or run-time adaptation? Do the categories transfer, or do learned/stochastic components need a fifth?
2. **On the argument fragment (P3):** Could safety-argument fragments be templated for agentic systems the way they did for ADS? What is the right analogue of a _vehicle-level quantitative safety requirement_ for an AI agent — and is a trust-score threshold with an architectural clamp (our leash-snap) a legitimate PcS-style constraint in his framework?
3. **On trustworthiness assurance (P4):** Would TECoSA phase-2's trustworthiness-assurance theme accommodate a case study built on a production industrial evidence chain (company-provided testbed, university-provided argumentation framework)?
4. **On the INCOSE strategic directions (P5):** The paper called for testbeds; four years on, what does he think the _industrial agentic-AI_ testbed should look like that AD-EYE was for automated driving?

## 4. Pre-call reading list (Risto, ~90 min total)

| Priority | Item                                                                                                              | Time      | Where                                     |
| -------- | ----------------------------------------------------------------------------------------------------------------- | --------- | ----------------------------------------- |
| 1        | INCOSE position paper (Trends, Drivers, Strategic Directions… ) — the one the email cites                         | 20–30 min | ResearchGate / DiVA                       |
| 2        | T-ITS 2025 review — abstract + intro + the four-category figure only                                              | 15 min    | DiVA record diva2:1936879 / IEEE 10858599 |
| 3        | SAFECOMP 2025 safety-argument fragment — abstract only (three moves: quantitative reqs, situation awareness, PcS) | 5 min     | Springer chapter 978-3-032-02018-5_15     |
| 4        | TECoSA site — phase-2 themes page + partner list                                                                  | 10 min    | tecosa.center.kth.se                      |
| 5        | AD-EYE — home + OPEN-KTH page                                                                                     | 10 min    | adeye.se                                  |
| 6        | This brief §2–3                                                                                                   | 10 min    | —                                         |

## 5. What NOT to do on the call

- Do not pivot to compliance/product pitch — regulation stays framed as the _outcome_ of the evidence chain (the sentence Boardy flagged verbatim).
- Do not explain safety cases, GDPR, or the AI Act to him — he wrote the courses.
- Do not oversell KYA's formal grounding — it is an engineered trust-scoring mechanism, not (yet) a formally verified one; that gap is precisely the collaboration opportunity, so present it as such (Rule 12: fail loud).
- Do not promise data or testbed access — that is a scope decision for later, after `/sovereignty-assess` on what a shared testbed would expose.

## Sources (all open)

- KTH profile (his own principles/wording): <https://www.kth.se/profile/martint/>
- T-ITS 2025 review: <https://ieeexplore.ieee.org/document/10858599/> · DiVA <https://kth.diva-portal.org/smash/record.jsf?pid=diva2:1936879>
- SAFECOMP 2025 argument fragment: <https://link.springer.com/chapter/10.1007/978-3-032-02018-5_15>
- INCOSE position paper record: <https://www.researchgate.net/publication/368403901>
- TECoSA: <https://www.tecosa.center.kth.se/> · Vinnova: <https://www.vinnova.se/en/p/trustworthy-edge-computing-systems-and-applications-tecosa/>
- AD-EYE: <https://www.adeye.se/> · <https://github.com/AD-EYE/AD-EYE_Core> · WASP testbed page: <https://wasp-sweden.org/testbed-automated-driving/>
