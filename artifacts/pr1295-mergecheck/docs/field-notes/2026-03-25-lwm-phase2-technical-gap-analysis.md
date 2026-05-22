# LWM Phase 2 Technical Gap Analysis: From Regulatory Intelligence to Latent Planning

***
# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:
  - Version: 1.0 | Tool: Claude Code (Opus 4.6) | Session: claude/research-leworldmodel-r3VRA | Date: 25.03.2026 | Changes: Initial field note — maps the technical gap between Phase 1 (regulatory intelligence engine) and Phase 2 (latent planning for physical operations). Scopes what's known, unknown, and what needs to be built.

Session Links & References:
  - Claude Code (claude/research-leworldmodel-r3VRA): https://github.com/blogtheristo/dws6/commits/claude/research-leworldmodel-r3VRA
  - LeWorldModel research: docs/LeWorldModel.md
  - LWM Training Manual: product-catalog/LWM/training-manual.md
  - Grok LWM Planning: docs/field-notes/2026-03-04-grok-advice-lwm-planning-multi-tool.md

Document Status:
  - Created: 25.03.2026
  - Last Modified: 25.03.2026
  - Language: English
  - Publication Status: ACTIVE

***

## Context

The LWM sequencing strategy locks three phases:

1. **Phase 1 (Now):** LWM = regulatory intelligence engine (structured text, obligation mappings, carbon flows)
2. **Phase 2 (Post-SAFE):** LWM = regulatory intelligence + physical planning (LeWorldModel-style latent planning)
3. **Phase 3 (Series A):** LWM = full dual-use product (carbon balance sheet + edge Physical AI)

This field note scopes the **Phase 1 → Phase 2 bridge** — the technical gap between a regulatory knowledge graph and a latent planner that can reason about physical environments.

## What We Have (Phase 1)

| Component | Status | Location |
|-----------|--------|----------|
| Regulatory intelligence graph | Shipping | 15,000+ EU docs, 21 agents, 20 industries |
| Carbon balance sheet (in-memory) | V1 | `src/compliance/debit-credit-ledger.ts` |
| Carbon balance sheet (persistent) | DWS 7, July 2026 | 8 PRs (093A-093H) |
| QLoRA fine-tuned models | Training manual ready | Llama/Mistral/Qwen on GN-100 |
| Edge hardware | In-house | Acer Veriton GN-100 (NVIDIA GB10) |
| MCP orchestration | Production | `/mcp` endpoint, JSON-RPC 2.0 |
| KYA governance | v1.4 internal | Firecracker MicroVM kill-switches |

## What Phase 2 Requires

LeWorldModel demonstrates latent planning from raw pixels:
- Encoder (ViT-Tiny, ~5M params) maps pixels → 192-dim latent token
- Predictor (Transformer, ~10M params) rolls out future states given actions
- SIGReg prevents collapse (Cramer-Wold theorem, isotropic Gaussian prior)
- Plans by optimizing action sequences in latent space

## The Bridge Problem: Three Unsolved Questions

### 1. Input Modality Gap

LeWorldModel expects **pixel observations** (camera frames from a robot's perspective). LWM Phase 1 operates on **structured regulatory text** (EU documents, ERP data, carbon ledger entries).

**Question:** How do you connect a text-based regulatory knowledge graph to a latent planner that expects visual/sensor input?

**Possible approaches:**
- **Parallel encoders:** Text encoder for regulatory state + visual encoder for physical state → shared latent space. Risk: alignment between modalities is an open research problem.
- **Regulatory state as conditioning:** Use the carbon ledger as a constraint on the physical planner (e.g., "this crane movement must stay within carbon budget X"). Simpler, doesn't require multimodal fusion.
- **Digital twin bridge:** OpenUSD scene representation encodes both physical layout and regulatory metadata. The planner operates on the scene graph, not raw pixels. This is the NVIDIA Omniverse approach from the V1_LWM.md submission.

**Honest assessment:** The digital twin bridge is the most realistic near-term path. It avoids the multimodal fusion problem by encoding everything in a structured scene representation. But it requires an OpenUSD pipeline that doesn't exist yet.

### 2. Scale Gap

LeWorldModel: 15M parameters, single GPU, trains in hours on simulation environments with clean trajectories.

LWM Phase 2 target: Physical planning for construction sites, healthcare logistics, fleet management — environments that are:
- **Uncontrolled** (weather, human workers, traffic)
- **Long-horizon** (construction projects span months, not seconds)
- **Sparse reward** (compliance violations are rare events, not continuous feedback)

**Question:** Does LeWorldModel's approach scale to real industrial environments, or is it limited to controlled simulation?

**Honest assessment:** Unknown. LeWorldModel has been tested on PushT (2D block pushing), Reacher, Two-Room, and OGBench-Cube. None of these resemble a construction site. The Helsinki pilot would be the first test of latent planning in a regulated industrial environment. This is research, not engineering.

### 3. Regulatory-Physical Integration Gap

**Question:** How does a physical plan (move crane, route vehicle) get validated against the regulatory knowledge graph before execution?

**Possible architecture:**

```
Physical Observation → Visual Encoder → Latent State
                                            ↓
Carbon Ledger Query → Regulatory State → Constraint Vector
                                            ↓
                                    Latent Planner
                                            ↓
                                    Action Sequence
                                            ↓
                                    KYA Governance Gate
                                            ↓
                                    Execute / Block
```

**Key insight:** The KYA governance layer (kill-switches, MicroVM isolation) becomes the bridge. The physical planner proposes actions. The regulatory engine validates them. KYA enforces the decision. This is the "hardware-enforced liability containment" from the Fleet Admiral pitch — and it's the only part that's already built (KYA v1.4).

## What Needs to Be Built (Pre-Phase 2)

| Component | Effort | Dependency | Priority |
|-----------|--------|------------|----------|
| OpenUSD scene encoder for construction/logistics | High | NVIDIA Omniverse SDK | After SAFE close |
| Regulatory constraint API (carbon budget → planning constraint) | Medium | Persistent carbon ledger (DWS 7) | July 2026 |
| Latent planner prototype (LeWorldModel-style, on GN-100) | Medium | Scene encoder | Q3 2026 |
| KYA integration with planner (governance gate) | Low | KYA v1.4 already exists | Q3 2026 |
| Helsinki pilot environment setup | Medium | City of Helsinki agreement | March-April 2026 |
| Evaluation benchmarks (LWM-specific) | Low | Define before building | Now |

## Evaluation Benchmarks (Define Now)

Per the Grok advice field note (2026-03-04), define 3-5 benchmarks before scaling:

1. **Regulatory planning accuracy:** Given a construction scenario + carbon budget, does the planner produce a compliant action sequence? (Binary: compliant/non-compliant)
2. **Latency:** End-to-end planning cycle under 5 seconds on GN-100 (Phase 2 target)
3. **Collapse detection:** SIGReg metrics stable after 1000+ planning episodes (no representation collapse)
4. **Cross-modal alignment:** Regulatory constraint violation detection rate >95% (planner respects carbon budget)
5. **KYA governance response:** Kill-switch triggers within 5ms of constraint violation

## Bottom Line

Phase 2 is real research with three unsolved problems: input modality gap, scale gap, and regulatory-physical integration. The most realistic path is the digital twin bridge (OpenUSD) with the regulatory engine as a constraint provider and KYA as the governance gate.

The good news: all three solved problems in Phase 1 (regulatory graph, carbon ledger, KYA governance) become building blocks for Phase 2. The sequencing strategy isn't just a fundraising story — it's technically correct. Phase 1 outputs are Phase 2 inputs.

The bad news: nobody has done this before. LeWorldModel validates the latent planning component. The regulatory integration is novel. Budget accordingly.

## Next Steps

1. Define the 5 evaluation benchmarks formally (this month)
2. Prototype regulatory constraint API on top of persistent carbon ledger (July 2026, ships with DWS 7)
3. Evaluate OpenUSD SDK for scene encoding (after SAFE close)
4. Run LeWorldModel code (github.com/lucas-maes/le-wm) on GN-100 as capability test
5. Scope Helsinki pilot environment requirements with City of Helsinki
