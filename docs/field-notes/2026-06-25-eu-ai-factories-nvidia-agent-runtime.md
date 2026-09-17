# Field Note — EU AI Factories + NVIDIA's Open Agent Runtime (25.06.2026)

_Companion artefact to PHD_FIREHORSE §14.31 / Key Contribution #37 (thesis v3.69). PhD scope per §1.3 (3–7 year horizon, market signal)._

## Two signals, opposite ends of the stack

**Upstream — EuroHPC AI Factories (NVIDIA, 22.06.2026).** 35 new AI/HPC supercomputers across 23 European countries, ~800 AI exaflops deployed/announced over the prior year; anchored by MareNostrum 5 (GB300 NVL72 + GB200 NVL4, ~20 EF training / ~33 EF inference), BavariaAI, HLRS, NAISS; Blackwell + Hopper; 3M+ researchers. → The EU-sovereign **training upstream** the §14.18 hedge presupposed now has a public, EU-jurisdiction address.

**Runtime — NVIDIA's open agent security stack.** NeMo Agent Toolkit (open, framework-agnostic) + **OpenShell** kernel-sandbox runtime + **NemoClaw** reference stack (one-command install of Nemotron + OpenShell, early preview 16.03.2026) running always-on local agents incl. **Hermes** (Nous Research) on owned hardware. Verified against github.com/NVIDIA/NemoClaw, nvidianews, docs.nvidia.com. → A vendor-backed reference runtime for the KYA **ASB/SIB** tracks.

## Why it sharpens (not blurs) the sovereign-edge thesis

- The factory **trains**; the regulated edge **runs** the result on a customer-owned box.
- EuroHPC resolves **model provenance**; it does not deliver single-tenant, air-gapped, Article-12-per-deployer inference. That stays at the edge (§14.21).
- OpenShell gives the KYA ASB/SIB tracks a **named reference runtime** instead of only bespoke MicroVM tooling.
- Defensible remainder = jurisdiction binding + Article-12 evidentiary log + KYA identity spine + the owned box.

## Operating-model consequence

Migrate the agent runtime from bare **OpenClaw** → OpenShell-sandboxed **NemoClaw** on security grounds (shell-access agents are a prompt-injection / supply-chain liability until kernel-sandboxed). Tracked as a scoped engineering migration (see repo OpenClaw→NemoClaw migration plan).

## Surfaces

- LSJ #32 `nvidia-vera-rubin-ai-factory.html`, LSJ #33 `eu-sovereign-ai-factories-35-supercomputers.html`
- dws10.com Situation Room product page — Rung 3 (EuroHPC) + Halos safety layer
- Thesis: PHD_FIREHORSE_EN/FI §14.31, KC #37 (v3.69)

## Primary sources

- NVIDIA Newsroom — "Europe Unveils a Record 35 New NVIDIA AI Supercomputers" (22.06.2026)
- NVIDIA Newsroom — "NVIDIA Announces NemoClaw for the OpenClaw Community"
- github.com/NVIDIA/NemoClaw · docs.nvidia.com/nemoclaw · github.com/NVIDIA/NeMo-Agent-Toolkit
