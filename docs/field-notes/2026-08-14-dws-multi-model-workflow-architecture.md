# Field Note: DWS Multi-Model & Tool Workflow Architecture

***

# VERSION AND AGENT HISTORY

Version: 1.0
Sessions & Modifications:

- Version: 1.0 | Tool: Gemini 3.7 Flash | Session: dgx-multi-model-workflow | Date: 14.08.2026 | Changes: Codified the 4-tier hybrid AI developer and autonomous agent workflow: Local Edge Inference (OpenCode + Ollama: DeepSeek V4 Flash / Qwen3 Coder / Nemotron-3-Super), Repo Refactoring (GitHub Copilot CLI), Cloud Review & HIL Quality Gates (Gemini 3.7 Flash), and Hot Standby Fallback (Claude Code).

***

## Overview

DWS IQ 6 operates on an asymmetric multi-model execution ladder that optimizes for sovereignty, marginal compute cost, and strict quality assurance across edge and cloud substrates.

```
┌──────────────────────────────────────────────────────────────────────────┐
│                           DWS IQ 6 WORKFLOW                              │
├──────────────────────────────────────────────────────────────────────────┤
│ 1. LOCAL CODING & EDGE AGENTS (Zero marginal cost / sovereign)           │
│    • OpenCode 1.18.18 (DGX Spark) ──► Ollama (:11434)                    │
│      - DeepSeek V4 Flash / Qwen3 Coder: Fast coding & local edits        │
│      - Nemotron-3-Super: Domain reasoning & LWM processing               │
│                                                                          │
│ 2. REPO REFACTORING & INTERACTIVE TERMINAL                               │
│    • GitHub Copilot CLI: Direct repo orchestration & git flow            │
│                                                                          │
│ 3. CLOUD REVIEW & HIL GATES (Mandatory quality assurance)                │
│    • Gemini 3.7 Flash: Automated PR reviews, multi-modal & large context │
│                                                                          │
│ 4. HOT STANDBY / COMPLEX FALLBACK                                        │
│    • Claude Code (Fable/Opus): Complex architectural escalations         │
└──────────────────────────────────────────────────────────────────────────┘
```

## Tier Breakdown

### 1. Local Coding & Edge Agents (DGX Spark)
- **Harness:** OpenCode 1.18.18 running natively on sovereign edge hardware (Acer Veriton GN100).
- **Backend:** Local Ollama endpoint (`http://127.0.0.1:11434/v1`).
- **Models:**
  - `DeepSeek V4 Flash` / `Qwen3 Coder`: Sub-second code generation, fast refactoring, syntax fixes.
  - `Nemotron-3-Super`: Sovereign domain reasoning, industrial knowledge extraction, LWM updates.
- **Economics:** Zero marginal token cost, 100% data residency (EU/Finland premises), zero CLOUD Act exposure.

### 2. Repo Refactoring & Interactive Terminal
- **Tool:** GitHub Copilot CLI.
- **Function:** Interactive terminal assistant, end-to-end task automation, PR branch creation, and rapid Git flow orchestration directly on developer workstations.

### 3. Cloud Review & Mandatory HIL Quality Gates
- **Model:** Google Gemini 3.7 Flash (via GitHub Actions CI/CD).
- **Function:** Automated dual-agent PR review gate (`.github/workflows/ai-pr-review.yml`), large context window (1M+ tokens) analysis, multi-modal asset checks, and structured change-request emission.

### 4. Hot Standby & Complex Architectural Fallback
- **Harness:** Claude Code (Claude 3.7 Sonnet / Opus 4.8 / Fable).
- **Function:** Deep structural migrations, high-complexity architectural refactoring, and emergency fallback if local edge infrastructure undergoes maintenance or model saturation.

## Governance & Compliance

This operational hierarchy enforces the 12 Engineering Discipline Rules:
- Deterministic gating over stochastic assumptions (Rule 5).
- Model-agnostic harness stability (Rule 11).
- Complete tamper-evident audit trail under EU AI Act Article 12 (Rule 12).
