<!--
VERSION AND AGENT HISTORY
Document: DWS Product Risk Register
Version: 1.0
Date: 2026-07-26
Author: Risto Anton Päärni (risto.paarni@lifetime.fi), Founder, CEO, Lifetime Oy
Owner: Lifetime Oy
Status: Active
Agent: Claude Code, session claude/ollama-orchestration-merge-047pj7
Purpose: Standing due-diligence instrument recording, per product, the supply and
         dependency risks in the compute/model stack and the fallback plan for each.
         Created after the 2026-07-26 product audit found ZERO fallback/supply-risk
         entries anywhere in Store/ and no canonical risk register.
-->

# DWS Product Risk Register

**Instrument type: due-diligence.** This is an internal DD and governance artifact answering
"what breaks, and what is the plan when it does." It is **not sales material** and must not be
folded into product pages, decks, or outreach copy. Investors and enterprise buyers may be shown
it on request in a data-room context; it is written to be read by a sceptic.

**Positioning guard (`DWS_TRUTH_STANDARD.md` row 27).** NVIDIA silicon, Cosmos and NIM are
**components** DWS adopts. They are not a category DWS competes in — "Sovereign AI" as
infrastructure/compute is explicitly *not* DWS's layer. The defensible asset is the governed
loop (KYA + private evals + RL on fleet data + Article 12 evidence). Nothing in this register
should be read, or restated, as "DWS does sovereign AI infrastructure."

**Review cadence:** quarterly, and on any change that makes a new vendor component critical.
**Owner:** Founder, CEO.

---

## 1. Register

| ID | Risk | Affected products | Severity | Current exposure | Fallback plan | Exit-cost status |
| -- | ---- | ----------------- | -------- | ---------------- | ------------- | ---------------- |
| **R-01** | **Compute-layer supply concentration on NVIDIA** (DGX Spark / Jetson / L40S / CUDA) | Aegis (Defence L40S, Sovereign edge), Firehorse Production Engine (CV-CUDA, Aerial), LWM line | High | Every GPU path in the product line is NVIDIA. No non-NVIDIA workload runs anywhere today. | Maintain **one open model + one workload runnable on a non-NVIDIA accelerator at testbed scale**: AMD Instinct MI300 (ROCm + vLLM) or Intel Gaudi 3 (SynapseAI). | **NOT YET EXERCISED** — the register's top open action. |
| **R-02** | **Model-layer concentration on NVIDIA** (Cosmos world model, Nemotron reasoner, NIM serving) | Aegis physical layer (planned), FPE | Medium-High | The adopt-strategy deepens NVIDIA dependency from silicon into the model layer. | Weights are **open** → portability is real, not nominal. Generic LLM/worker tier (Qwen-class via Ollama/vLLM) is portable **today**. | Partially mitigated by design; physical tier untested (see R-03 caveat). |
| **R-03** | **Physical world-model tier is NVIDIA-optimised** (NVFP4 / TensorRT path) | Aegis physical layer, FPE | Medium | The portable fallback is strongest for the LLM tier; the physical world model is a **re-quantise-and-port exercise**, not a config switch. | Budget the port explicitly; validate on the R-01 testbed before any customer commitment that assumes portability. | Not estimated. Needs a time/cost figure. |
| **R-04** | **Non-EU model origin via NIM** (e.g. DeepSeek-class open weights) | Any product using the NIM compliance/benchmark tier | Medium | Non-EU-origin weights are usable for R&D and benchmarking, but must never reach the sovereign customer-data core. | Hard boundary enforced by the **model-provenance predicate**; EU-origin or on-prem models only in the sovereign core. | Boundary defined; automated attestation not yet implemented. |
| **R-05** | **Aegis physical layer is not shipped** (planned 2026 Q4) | Aegis Sovereign / Defence | Medium | The two-layer architecture is published with the physical layer marked *Planned*. Selling it as delivered would be an artifact-legitimacy overclaim. | Keep the status tag on every surface; gate customer commitments on the on-device evaluation completing. | Controlled by disclosure discipline. |
| **R-06** | **Edge-hardware procurement dependency at the Sovereign tier — and the compatibility risk it transfers** | Aegis Sovereign | Medium | On-prem deployments depend on customer- or partner-procured edge hardware. DWS resells no hardware at any tier, so lead times and allocation sit outside DWS control — **and DGX / Cosmos compatibility becomes the customer's responsibility. This transfers the supply risk; it does not remove it.** State it plainly in every engagement: **"Sovereign tier: hardware compatibility validated per engagement, not guaranteed at product level."** | Qualify ≥2 procurement routes; publish a supported-hardware matrix (validated configurations, per Cosmos/NVFP4 requirement); validate compatibility in engagement scoping before commitment; keep the platform hardware-agnostic within the class. | Single route today; **no published supported-hardware matrix** — the open gap. |
| **R-07** | **Single managed-cloud concentration** (UpCloud, Helsinki) | Aegis (all tiers), platform | Medium | Deliberate — it is the zero-CLOUD-Act sovereignty guarantee, so concentration here is a *feature* with an availability cost. | Enterprise private-cloud option already offered; keep deployment as portable Helm/K8s so a second EU-sovereign host can be qualified. | Portable by construction; second host not qualified. |

## 2. Sovereignty measurement (IJS scale)

| Deployment | IJS | Note |
| ---------- | --- | ---- |
| DGX / edge on-premises, customer site | **100** | Data and inference never leave the perimeter. |
| NIM served in EU | **55** | EU-resident serving, but inside the NVIDIA stack and, for some models, non-EU-origin weights. |

Both sit inside the NVIDIA stack. That is precisely why R-01's testbed matters: it is what converts
the score from an assertion into an auditable exit cost.

## 3. The distinction this register exists to defend

A dependency is **managed** when the exit is *demonstrated*; it is **lock-in** when the exit is
only *asserted*. Open weights make the exit possible. A maintained, exercised non-NVIDIA testbed
makes it provable. Until R-01 is exercised, DWS should describe its position as a concentrated
dependency with an open exit path — not as a mitigated one.

## 4. Open actions

1. **Stand up the non-NVIDIA testbed (R-01)** — one open model + one real workload on MI300 or Gaudi 3. Record throughput, cost and the port effort. *Top priority; this is the DD answer.*
2. **Estimate the physical-tier port (R-03)** — time and cost to move the world-model tier off NVFP4/TensorRT.
3. **Implement model-provenance attestation (R-04)** — machine-checked, not policy-only.
4. **Publish a supported-hardware matrix (R-06)** — validated edge configurations against the Cosmos / NVFP4 requirement, so "compatibility validated per engagement" has something concrete to validate against. Qualify a second procurement route, and a second EU-sovereign host (R-07).
5. Re-review this register at each quarter end and on every new NVIDIA-critical component.

---

_Follows DWS Document Standard. Companion analysis: `docs/pr-cleanup/PRODUCT_REFRAME_AUDIT_2026-07-26.md`, `docs/field-notes/2026-07-26-cosmos-3-edge-lwm-build-adopt-inflection.md`, PHD_FIREHORSE §14.44 Finding 3._
