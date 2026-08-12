# Field Note — The Regulated-Industry Autonomous-Engineer Category (25.06.2026)

_Companion to PHD_FIREHORSE §14.32 / Key Contribution #38 (thesis v3.70). PhD scope per §1.3 (3–7 year horizon)._

## The signal

GTC Taipei (02.06.2026): NVIDIA + a dozen-plus industrial software leaders shipped **autonomous AI engineers** on **NemoClaw** — long-running agents that compress weeks of CAE/EDA work into hours.

- Cadence — autonomous RTL engineer (ChipStack)
- Siemens — Fuse EDA AI Agent
- Dassault Systèmes — 3DEXPERIENCE Agentic Platform
- Synopsys / Ansys (Icepak)
- Startups: Flexcompute, Luminary, Neural Concept, nTop, PhysicsX, P-1 AI, SimScale, Synera

Each = a harness (OpenClaw or Hermes) + model router + NeMo libraries on the **OpenShell** secure runtime.

## The DWS read

The same construction is the **regulated-industry** play, and the seam is already in production:

- **51 Skilled Agents** on `BaseAgent`, ledger-native output (`journalEntries + regulatoryArtifact + lineage`, §14.28)
- **Workflow orchestrators** (`src/agents/workflow/`)
- **KYA bridge** `src/mcp/nemoclaw-bridge.ts` (`registerSkill()` / `invoke()`, allowed-skills whitelist, ATS gate, sanitisation) + `article12-logger.ts`

So integration = (1) a contract adapter (DWS ledger output ↔ NemoClaw skill JSON-schema) + (2) reverse skill-exposure (NemoClaw harness → DWS skill) + (3) OpenShell policy per skill + KYA ATS per workflow.

## Why it's defensible

NemoClaw gives autonomy + secure runtime. It does **not** give jurisdiction binding, Article-12 evidence per artefact, single-tenant air-gapped deployment, or the four-track KYA vocabulary (ASB/EAB/CSB/SIB). For a CSRD report / CBAM declaration / site-safety determination, autonomy without admissible evidence and governed oversight is not deployable. **The governance envelope — not the autonomy — is the scarce, regulator-required, competitively defensible component.** Cadence/Siemens build the EDA engineer; DWS builds the _governed_ compliance engineer.

## Status

**Thesis/strategy-first.** No code shipped for this yet. Next engineering steps (when greenlit): design doc (architect) → thin spike (one Skilled Agent, e.g. compliance, exposed as a NemoClaw skill end-to-end, build+test green) → breadth.

Naming caveat: DWS already has a `src/agents/workflow/hermes` orchestrator — unrelated to NemoClaw's **Hermes** harness (Nous Research). Disambiguate before building.

## Primary sources

- NVIDIA Newsroom — "Industrial Software Leaders Build Secure, Autonomous AI Engineers With NVIDIA NemoClaw" (GTC Taipei, 02.06.2026)
- NVIDIA NeMo Agent Toolkit docs (framework-agnostic)
- DWS production: `src/agents/`, `src/agents/workflow/`, `src/mcp/nemoclaw-bridge.ts`, `src/agents/article12-logger.ts`
