# Product Reframe Audit — Cosmos 3 Edge impact per product (2026-07-26)

Audits the HIC's product-by-product characterisation against the actual product docs
in the repo. Verdict column = does the claim hold, and what actually needs changing.

| Product | HIC claim | Repo reality (audited) | Verdict |
| --- | --- | --- | --- |
| **DWS IQ Aegis** (`Store/PRODUCT_AEGIS.md`) | Biggest impact; becomes a clear **two-layer** product: physical (Cosmos 3 Edge, Control/Situation Room, perception→action) + compliance-evidence (separate LLM, NIM); KYA loop binds them. | Doc has a "multi-agent control room for fleet oversight", ComplianceAgent, Article12Logger, KYA, orbital intel, **NVIDIA L40S** local LLM inference. **No** physical perception→action layer and **no** explicit two-layer structure today. Line 136: *"Software-only platform — no hardware bundled (NVIDIA/Acer DGX excluded)."* | **VALID + biggest, but ABSENT today.** Add the physical Cosmos-3-Edge layer + name the two layers. **Reconcile the "software-only / DGX excluded" line** — a physical edge layer implies edge hardware; today's copy explicitly excludes it. This is the real edit, not a tweak. |
| **DWS IQ 6 Sovereign Infra** | Fleet/robotics benefits from Cosmos directly; compliance reporting unchanged (NIM LLM); edge-physical vs cloud-compliance split clarifies. | **No standalone product doc exists** — "Sovereign Infra" is a *tier* in the Aegis/Sovereign-Infra/Connect segmentation, not a documented SKU. | **Claim reasonable, but nowhere to land.** Gap: if you want the split documented, Sovereign Infra needs a SKU doc; otherwise the reframe lives inside Aegis's tiers. |
| **Firehorse Production Engine** (`product-catalog/Firehorse/V2/product-specification.md`) | Operational benefit; operator-independent workflows can lean on Cosmos world model where operator perception → machine vision. No pricing change; strengthens credibility. | **Already deeply Cosmos-native:** the spec uses **NVIDIA Cosmos** for predictive world-states / occlusion-filling, "Cosmos Foundation Model", CV-CUDA, Aerial Omniverse Digital Twin, "Physical AI to reconstruct occluded site events." | **UNDERSTATED.** FPE is the *most* Cosmos-aligned product already. Change is small + high-credibility: **Cosmos → Cosmos 3 Edge** (on-device) + reconcile the "LWM V1" base reference with the adopt-Cosmos position. |
| **DWS IQ Connect** | Does **not** change — global tier, no sovereign constraints, no edge-physical. | No standalone Connect product doc; no edge-physical dependency. | **CORRECT.** No change, consistent. |
| **Enterprise Model Training (EMT-001) + Train Model (TM-001)** _(not in the HIC list, but audited — they are the "training" SKUs)_ | — | **Already fine-tune / adaptation SKUs on open bases** (Llama 3.2 / Qwen3 / Mistral, QLoRA, customer picks the base). They do **not** claim from-scratch 55B pretraining. The "55B pretrain" claim lived in `product-catalog/LWM/README.md` (**already banner-corrected 2026-07-26**), not these SKUs. | **ALREADY CONSISTENT** with "adopt open base + own the loop." No reframe needed. Optional: add Cosmos 3 Edge as a selectable physical-world-model base; soften EMT's "custom architecture / 405B / non-Llama" language. |

## Cross-cutting finding — the NVIDIA supply risk is NOT recorded anywhere (CONFIRMED GAP)

Audited `Store/` for `fallback | supply risk | single-vendor | MI300 | Gaudi`: **zero hits.**
Aegis (NVIDIA L40S, Jetson Orin, NVIDIA ISV) and FPE (Cosmos, Aerial, CUDA) are **deeply
NVIDIA-dependent with no named fallback**. There is **no canonical product risk register.**

**Action:** create a product risk register with, per product where DGX/Cosmos/NIM is critical
(Aegis, FPE, Sovereign Infra), a **fallback-plan entry**: open weights + a non-NVIDIA testbed
(AMD MI300 via ROCm/vLLM; Intel Gaudi 3 via SynapseAI) = **managed dependency, not lock-in**
(§14.44 Finding 3). This is the exact DD question investors and enterprise buyers ask.

## Positioning guard (do not drift)

`DWS_TRUTH_STANDARD.md` row 27 (founder correction 10.07.2026): **"Sovereign AI" is an
infra/compute category DWS does NOT compete in.** Keep the Cosmos reframe in the **governed
OUTCOME-layer** framing (Agent Outcome Factory / Sovereign *Industrial Intelligence*), never
"DWS does sovereign AI infrastructure." Cosmos/DGX are components; the moat is the governed loop.

## Recommended edit order (reviewed, outward-facing)

1. **Aegis** — add the two-layer articulation + reconcile the DGX-excluded line (biggest value).
2. **Risk register** — new artifact + per-product fallback entries (the DD gap).
3. **FPE** — Cosmos → Cosmos 3 Edge + LWM-base reconciliation (small, high-credibility).
4. **EMT/TM** — optional Cosmos-base option; otherwise leave (already consistent).
5. **Sovereign Infra** — decide: document as a SKU, or keep as an Aegis tier.

Truth-check every outward claim; dual-folder sync any public HTML; keep pricing in products.json.
