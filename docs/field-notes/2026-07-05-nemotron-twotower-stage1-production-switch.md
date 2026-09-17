# Field Note: Stage 1 Engine Switch — Qwen3-Coder → Nemotron-TwoTower in the LWM Ontology Pipeline

---

VERSION AND AGENT HISTORY

- Version: 1.0
- Status: ACTIVE
- Classification: INTERNAL
- Document type: Field Note / Architecture Decision Record + Customer Impact Analysis
- Author: Claude Code (claude-sonnet-5) + risto.paarni2024@lifetime.fi
- Date: 2026-07-05
- Location: Espoo, FI (Lifetime Oy HQ)
- Session: claude/palantir-us-open-source-models-tsexbg

Sessions & Modifications:

- Version: 1.0 | Tool: Claude Code (claude-sonnet-5) | Date: 05.07.2026 | Changes: Initial field note. Records the founder decision to switch the LWM ontology pipeline's Stage 1 engine from Qwen3-Coder 30B to Nemotron-TwoTower 30B-A3B, made explicitly to follow Palantir/NVIDIA's U.S. open-weight positioning, ahead of the validation pilot the 02.07.2026 TwoTower note had recommended running first. Documents the risk accepted, the fallback path, and customer impact.

Related Documents:

- `docs/field-notes/2026-07-04-palantir-wahlquist-us-open-weight-models-lwm-implications.md` (the recommendation this note acts on — provenance gap identified, pilot proposed as the vehicle)
- `docs/field-notes/2026-07-02-nemotron-twotower-ontology-stage1-throughput.md` (the original throughput case for TwoTower; caveats on unconfirmed VRAM fit and extraction-quality parity, both still open)
- `docs/field-notes/2026-07-02-karp-tokenization-economy-ai-moat.md` §9.1 (DWS's multi-model, non-single-vendor posture)
- `docs/plans/2026-06-22-lwm-ontology-v1-500-enterprises.md` §3.1, §3.4, §11.4 (the plan doc this switch was made in, v2.1 → v2.2)
- `ontology/README.md` (mirrored pipeline summary, updated to match)

---

## 1. The Decision

Effective 05.07.2026, `docs/plans/2026-06-22-lwm-ontology-v1-500-enterprises.md` §3.1 names **Nemotron-TwoTower 30B-A3B** (NVIDIA, diffusion LM) as the Stage 1 local-preprocessing engine, replacing **Qwen3-Coder 30B** (Alibaba). This is the engine that extracts domain terms, entities, and process descriptions from confidential enterprise documents (annual reports, CSRD filings, patent text, equipment specs) on DGX Spark — the stage that exists specifically because that data must never leave the local box.

This decision was made by Risto, explicitly to follow Palantir's public positioning (via FDE Chad Wahlquist, cf. the 04.07.2026 field note): invest in U.S.-based open-weight models, not just wherever throughput or cost is best. It converts a recommendation already on record — the 02.07.2026 TwoTower note's throughput case, and the 04.07.2026 note's provenance framing — into an actual pipeline change.

## 2. What Changed (concrete diff)

- `docs/plans/2026-06-22-lwm-ontology-v1-500-enterprises.md`: v2.1 → v2.2. §3 pipeline diagram, §3.1 engine spec, and §3.4 economics table updated. New §11.4 validation checklist added.
- `ontology/README.md`: Stage 1 line updated to match.
- No code, no `.continue/config.yaml`, no Ollama tunnel scripts, no CI (`ai-pr-review.yml`) touched — those all use Qwen3-Coder for an unrelated purpose (DWS's general-purpose local coding/code-review assistant), not the LWM ontology pipeline. Scope is deliberately limited to the two documents that actually specify the Stage 1 engine for this pipeline (Rule 3: surgical changes).

## 3. Risk Accepted — This Is Ahead of the Pilot, Not After It

Being direct about what changed and what didn't: the 02.07.2026 TwoTower note recommended a **one-industry pilot before touching the production pipeline spec**, because two things were and remain unconfirmed:

1. **Extraction-quality parity on this specific task.** NVIDIA's 98.7%-quality / 2.42×-speed numbers are aggregate benchmark figures for TwoTower vs. its AR backbone — not a measurement on semantic filtering/entity extraction from enterprise documents. Diffusion LMs can behave differently than autoregressive models specifically on structured-extraction tasks.
2. **VRAM fit on the actual GB10 hardware.** TwoTower ships ~60B total parameters across two towers (~3B active per tower per token) vs. Qwen3-Coder's single dense 30B (~18GB). Whether both towers fit resident on DGX Spark alongside everything else running there is not yet confirmed.

The founder's instruction is to proceed with the switch now, on provenance/positioning grounds, rather than gate it behind the pilot. That is a legitimate call — it trades a small amount of near-term production risk for sovereignty-narrative coherence and earlier throughput gains — but the risk should not be hidden. The mitigation, captured in `docs/plans/2026-06-22-lwm-ontology-v1-500-enterprises.md` §11.4:

- The **first industry processed under the new engine becomes the validation run**, not a pre-condition gate. Its term-candidate output must be diffed against the last Qwen3-Coder-processed industry before that industry's ontology ships to any customer.
- **Qwen3-Coder remains a documented fallback** — if VRAM doesn't fit or the diff shows material quality regression, that industry's run falls back to Qwen3-Coder, and the fallback is recorded in that industry's provenance note rather than silently absorbed.
- **No already-shipped customer artifact is touched.** This switch only affects industries processed _after_ 05.07.2026. Industries already fine-tuned and deployed on Qwen3-Coder-derived ontologies are not retroactively reprocessed — see §4.2.

## 4. Customer Impact

### 4.1 Who benefits, and why it's not symmetric across the 25 industries

The provenance argument (U.S.-origin weights on the confidentiality-sensitive stage) lands hardest for customers who are already primed to ask "which models touched my data, and where were they made." That's disproportionately the regulated/critical-infrastructure industries in the 25-industry taxonomy: **Aerospace & Defence (ID 4, dual-use/ITAR-adjacent)**, **Power Generation & Nuclear (ID 8)**, **Telecom Infrastructure (ID 20, NIS2)**, and **Medical Devices Manufacturing (ID 21, MDR/IVDR)**. For these, "Stage 1 now runs on a U.S.-origin, not Chinese-origin, open-weight model" is a real, defensible answer to a due-diligence question a procurement or security team will actually ask — more so than for, say, Food & Beverage Manufacturing (ID 13), where provenance is a much smaller part of the buying conversation. Prioritizing which industries get processed first after this switch should weight toward the former group if there's a choice to make.

### 4.2 No silent change for already-shipped customers

Customers who already have an `LF-TRAIN-IND` deployment built from a Qwen3-Coder-processed ontology are unaffected — their model doesn't change, and it is not quietly reprocessed on the new engine. Retroactively reprocessing an already-shipped industry would be its own decision (re-validation cost, re-deployment logistics, and a real question of whether the customer needs to be told their model was rebuilt) and is explicitly out of scope for this switch.

### 4.3 Product-quality risk is a customer risk, not just an engineering one

Stage 1's output feeds directly into Stage 2 (Claude ontology synthesis) and Stage 3 (the customer's actual fine-tuned model, `LF-TRAIN-IND`). If Nemotron-TwoTower under-extracts or mis-extracts domain terms relative to Qwen3-Coder on this specific task, that regression doesn't stay internal — it shows up as a lower-quality ontology and, downstream, a weaker fine-tune for whichever customer's industry is processed first under the new engine. This is why §11.4's diff-before-ship gate matters: it is the one control standing between "we accepted a provenance/throughput trade-off" and "a customer received a materially worse model because of it." That gate should not be skipped even though the pipeline-spec change itself was made ahead of the pilot.

### 4.4 External positioning — real, but bounded

DWS can now truthfully say its most confidentiality-sensitive pipeline stage runs on a U.S.-origin, open-weight NVIDIA model family — the same Nemotron family underlying Palantir's Sovereign AI OS / Intelligent Engine for Open Weight Models. That is a genuine, verifiable claim (once run through `/truth-check`) and a useful line for sovereignty-sensitive prospects in the four industries named in §4.1. It must stop there: DWS has no partnership with Palantir or NVIDIA, and no copy should imply one. "Architecturally aligned, not affiliated" is the same guardrail already applied to the Karp field note (§4 of the 04.07.2026 note) and it still applies here.

## 5. Recommended Next Steps

1. Run the first post-switch industry and treat it as the validation run per §11.4 — confirm VRAM fit, measure actual throughput, diff term-candidate output against the last Qwen3-Coder baseline.
2. If quality holds, prioritize Aerospace & Defence, Power Generation & Nuclear, Telecom Infrastructure, or Medical Devices as an early post-switch industry, since the provenance story is most valuable to those buyers (§4.1).
3. If the diff shows regression, fall back to Qwen3-Coder for that industry, record it in the ontology file's provenance note, and don't treat the pipeline-spec change as final until a passing diff is on record.
4. Run `/truth-check` before any external copy pairs this change with Palantir/NVIDIA framing.

---

## Sources & Verification

- Pipeline spec change: `docs/plans/2026-06-22-lwm-ontology-v1-500-enterprises.md` §3.1, §3.4, §11.4 (v2.2, 05.07.2026).
- Throughput/quality figures: NVIDIA arXiv 2606.26493, as verified in `docs/field-notes/2026-07-02-nemotron-twotower-ontology-stage1-throughput.md` §1 — still an aggregate benchmark, not measured on this task (unchanged since that note).
- Provenance rationale: `docs/field-notes/2026-07-04-palantir-wahlquist-us-open-weight-models-lwm-implications.md` §2 (quote/attribution there remains MEDIUM confidence, unverified against the primary Palantir page — that caveat is unchanged and doesn't block this internal architecture decision, but still applies to any external citation of the Wahlquist quote itself).

---

**Status:** ✅ Processed — 🟡 Open (pipeline spec updated; §11.4 validation run not yet executed)
**Confidence:** HIGH (the decision and its documentation) / MEDIUM (throughput/quality/VRAM figures — projected, not measured on this task)
**Impact:** Strategic + Operational (converts the provenance/positioning recommendation into an actual pipeline change; customer-facing risk is real but bounded and gated at §11.4; no already-shipped customer affected)
