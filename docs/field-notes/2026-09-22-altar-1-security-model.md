# Altar-1 — Enterprise-Grade Security Model (Field Note)

---

# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:

- Version: 1.0 | Tool: Claude Code (Sonnet 5) | Session: claude/altar-1-security-model-s24le5 | Date: 22.09.2026 | Changes: Initial field note on AikidoSec's Altar-1, a quantized/expert-pruned GLM-5.3 variant published as a security-hardened text-generation model. Evaluated relevance to DWS IQ's KYA trust framework and model-selection doctrine (`DWS_MODEL_STANDARD.md`, `DWS_SECURITY_STANDARD.md` §18-19).

Document Status:

- Created: 22.09.2026
- Last Modified: 22.09.2026
- Language: English
- Publication Status: ACTIVE
- Document Type: Field Note
- Owner: Risto Anton Päärni

Related Documents:

- `DWS_SECURITY_STANDARD.md` (§18 KYA/BYO agent security, §19 Synthetic Data & Model Fine-Tuning Security)
- `DWS_MODEL_STANDARD.md`
- `DWS_TRUTH_STANDARD.md` §2 (model inventory row 36)

---

## 1. What was looked at

**Source:** https://huggingface.co/AikidoSec/altar-1 (HF Hub metadata, retrieved via Hugging Face MCP connector 22.09.2026 — no repo README fetched, card body not reviewed in this pass).

**What it is, per Hub metadata:**

- Base model: `cyankiwi/GLM-5.3-AWQ-INT4` (a quantized GLM-5.3 checkpoint), itself derived from Zhipu's GLM-5.3 MoE line.
- Published by **AikidoSec** (Aikido Security — an application-security / SAST-SCA vendor, not a foundation-model lab).
- Architecture tag: `glm_moe_dsa` (GLM Mixture-of-Experts with DSA — sparse attention), ~500.8B parameters, quantized to **W4A16 / AWQ / INT4**, with **REAP expert pruning** applied (tags: `reap`, `expert-pruning`) — i.e. a compressed/pruned deployment artifact, not a from-scratch security-trained model.
- Targets `hopper`-class GPUs, `compressed-tensors` format, text-generation/conversational task.
- License: `other` (non-standard — needs reading before any commercial reliance).
- Traction: 484 downloads, 91 likes as of 20.09.2026 — early-stage community adoption, not an established production baseline.
- References `arxiv:2510.13999` (REAP paper — Router-weighted Expert Activation Pruning for MoE compression), confirming this is primarily an **efficient-inference compression exercise on GLM-5.3**, badged by a security vendor.

## 2. What "enterprise-grade security model" means here — and what it does not

**Important distinction DWS must not blur (Rule 7, surface conflicts don't average):** nothing in the Hub metadata shows this is a model _trained_ for security reasoning, red-teaming, or adversarial robustness. It is a **quantized, pruned deployment of GLM-5.3** published by a security company. "Security model" in the repo name is ambiguous between:

(a) a model _specialized for_ security use cases (vuln triage, SAST/SCA copilot, threat analysis), or
(b) a general-purpose LLM that Aikido _hosts/ships_ as part of its own security product, with no claim of security-specific fine-tuning.

Without reading the model card body (not fetched this pass — flagged as an open gap, not asserted), DWS should **not** repeat "enterprise-grade security model" as a factual characterization in any customer-facing material. That phrasing is Aikido's own marketing framing, not a verified DWS-checked property. Per `DWS_TRUTH_STANDARD.md` discipline, unverified vendor claims about a third-party model are corroborated, not propagated.

## 3. Relevance to DWS IQ

- **Not a candidate for DGX Spark local inference today.** At ~500B params even after INT4/AWQ + expert pruning, this sits well outside the Spark-class local footprint DWS runs (`nemotron-3-super` / `qwen3-coder:30b` pair, `DWS_TRUTH_STANDARD.md` row 40/41). Hopper-class GPU targeting also rules out the Spark/Acer tier.
- **KYA relevance:** DWS's own KYA trust framework (`DWS_SECURITY_STANDARD.md` §18) evaluates _agents calling models_, not models as security products per se. Altar-1 is not itself a KYA-relevant control — it would only matter if DWS considered routing an agent's inference through it, which is out of scope today (cost policy requires DGX-first, `DWS_COST_POLICY_STANDARD.md`).
- **Competitive/market signal, not infrastructure signal.** Aikido Security publishing its own hosted LLM variant is a positioning move (dev-sec tooling vendors moving toward owning inference), worth tracking as a market signal for `DWS_MARKET_RESEARCH_STANDARD.md`, not as something DWS integrates.

## 4. Gaps / what was not done this session

- Model card body (usage, eval numbers, safety claims) not fetched — HF Hub metadata only. Any deeper technical claim needs that read first.
- No registration made in `DWS_TRUTH_STANDARD.md` or `DWS_MODEL_STANDARD.md` — this is a watch item, not a canonical fact, and does not meet the bar for registration (Rule: register only confirmed facts).
- Learning-outcome steps 3–4 (Learn/ HTML render, Drive export) — **N/A this session**: no HIC request to publish this externally; this is a low-stakes third-party-model observation, not a decision requiring wider distribution. Available on request via `scripts/render-doc.sh`.
- Step 6 (calendar) — **N/A**: no dated commitment in this note.

## 5. HIC question

**Q1 (branch-scoped).** Do you want DWS to track Aikido Security as a named competitor/adjacent player in dev-sec tooling (per the Pramaana-Labs-style watch pattern already in `DWS_TRUTH_STANDARD.md` row 38), given they're now shipping their own hosted inference model? **(RECOMMEND: yes, add a lightweight watch entry — no standards change needed unless a second signal from them appears.)**
