# "Just Ask Jev" (arXiv 2609.29429): what transfers to DWS kya-jev

---

# VERSION AND AGENT HISTORY

Version: 1.1

Sessions & Modifications:

- Version: 1.1 | Tool: GitHub Copilot CLI 1.0.88 | Session: opencode/b3-2125 | Date: 27.09.2026 | Changes: Added DWS Document Standard metadata during PR #2125 review.
- Version: 1.0 | Tool: Claude Code 2.1.283 | Session: claude/jev-api-tools-iu40re | Date: 26.09.2026 | Changes: Initial research note.

Document Status:

- Created: 26.09.2026
- Last Modified: 27.09.2026
- Language: English, Finnish
- Languages Available: English, Finnish
- Publication Status: ACTIVE
- Status: PENDING_REVIEW

---

- **Date:** 2026-09-26
- **Author:** Risto Anton Päärni
- **Location:** DWS6 repository
- **Context:** Research assessment for the KYA-Jev decision layer and `/browse` step-advisor pilot.

## Ontology Tags

- **Geography:** Europe > Finland
- **Sector:** Software > AI Governance
- **Entities:** Jev, RLCDAlignBench, KYA+I, DWS IQ
- **Systems:** `src/agents/kya-jev.ts`, `src/agents/browse-step-kya-jev.ts`
- **Temporal Context:** 2026-Q3
- **Confidence:** Mixed; verified claims and explicit unverified limitations are separated in the note.

**Päivä:** 2026-09-26
**Status:** PENDING_REVIEW
**Liittyy:** `docs/field-notes/2026-09-26-jev-dws-use-cases.md`, `src/agents/kya-jev.ts`

## Lähde ja varmennus

A social post cited the paper as `arxiv.org/abs/2609.26891`. That ID doesn't match any Jev paper. The paper matching every claim is:

**Just Ask Jev: Reinforcement Learning for Calibrated Decisions as a Zero-Shot Detector of AI Alignment Failures**, arXiv 2609.29429. Authors: Ruoqi Guo, Yi Liu, Gelei Deng, Yuekang Li, Lida Zhao, Yutao Wu, Simin Chen, Ying Zhang, Leo Yu Zhang. Code and data: github.com/sumleo/RLCDAlignBench.

arxiv.org is proxy-blocked in this session, so I checked the claims against the repository README and search results:

| Väite (postaus)                                                    | Tila                                                                  |
| ------------------------------------------------------------------ | --------------------------------------------------------------------- |
| 44 benchmarkia, 10 virhetyyppiä, 7 193 vastausta                   | **Varmennettu** (README: 7 193 labeled instances, 5 target models)    |
| Mediaani AUROC 0,886 zero-shot yhdellä yleiskysymyksellä           | **Varmennettu**                                                       |
| Voittaa koulutetut baselinet 25/31 benchmarkissa                   | **Varmennettu**                                                       |
| F1 0,706 → 0,793 kynnyksen sovituksella 10 merkityllä esimerkillä  | Ei varmennettu (ei READMEssa)                                         |
| Varmimmassa 50 %:ssa mediaanitarkkuus 0,933                        | Ei varmennettu                                                        |
| Löysi merkintävirheitä kolmesta benchmarkista                      | Ei varmennettu                                                        |
| 11,4 kysymystä/kutsu, 0,31 s mediaaniviive, $0,30 vs $18,96 (~63×) | Ei varmennettu                                                        |
| "Memory and self-improvement… hooks" -kappale                      | **Ei tästä paperista.** Kuvaa eri agenttiarkkitehtuuria; ei Jev-väite |

Virhetyypit (README): sycophancy, jailbreaks, deception, prompt injection, hallucination, privacy violation, social bias, reward hacking, concealing uncertainty, power seeking.

## Tärkein rajaus

The paper measures **Jev itself**, a model trained with RL for calibrated decisions (RLCD). DWS `kya-jev` is not Jev. It asks a general LLM for JSON and uses the probabilities that LLM reports about itself (`calibration: 'self-reported-uncalibrated'`). The paper's AUROC and calibration numbers **do not carry over** to kya-jev. Only the method lessons below do.

## Mitä siirtyy kya-jeviin

1. **Give the rule or source, not a cleverer prompt.** Put the reference material the answer should be checked against into `state`: the policy text, the source document, the truth-registry line. This fits the `/truth-check` and `/compliance-check` pre-filter use cases directly.
2. **Keep the probability, fit the threshold.** kya-jev already returns `probabilities` and `confidence`. The missing piece is a threshold fitted on a small labelled set per use case. This is the exact gap `kya-jev.ts` marks as PROVISIONAL.
3. **Accept when confident, escalate when unsure.** Act automatically only above the fitted threshold. Send everything else to the heavier LLM or the HIC. A companion paper argues the same pattern: arXiv 2609.26550, "JEV-as-a-Judge: Accept When Confident, Escalate When Unsure".
4. **Batch questions per call.** Several typed questions about one input in one call is where the cost advantage comes from. kya-jev asks one question per call today.

## Suositus

Next code step, not started: add a per-use-case calibration helper to kya-jev. It would take 10–30 labelled examples, fit a decision threshold, and report measured accuracy on the confident half, with an escalate band below it. Pilot it on the `/browse` step advisor (booking-form path) or `/truth-check`. Until that runs, kya-jev consumers stay advisory (`actionable: false`).

For the real Jev (TypeSafe API), the paper supports a trial as a low-cost first-pass detector for prompt injection and hallucination in the KYA tool-call path. That needs a TypeSafe key and a data-residency review first: it is a third-party hosted inference endpoint (jurisdiction not yet checked), which may conflict with the DGX-first rule and the sovereignty posture.

N/A — KB/HTML-render/Drive-export: research note, no code change.

---

Version 1.1 · 27.09.2026
Copyright © 2026 Lifetime Oy
Classification: INTERNAL
