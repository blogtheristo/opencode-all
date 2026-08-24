# DGX task — evaluate NVIDIA Cosmos 3 Edge + Nemotron as the LWM base

Run on the DGX (GN-100, Ollama + NVIDIA NIM reachable). Goal: test the
"adopt an open edge world model + own the loop" reframe from
docs/field-notes/2026-07-26-cosmos-3-edge-lwm-build-adopt-inflection.md and
PHD_FIREHORSE §14.44 — do NOT pretrain a 55B.

FIRST: `/truth-check` the specs against NVIDIA's primary announcement
(build.nvidia.com / NVIDIA blog) — Cosmos 3 Edge params (~4B + ~2B Nemotron
reasoner), DGX-Spark support, licence, EU-deployability. Record verified figures;
correct the field note + §14.44 if reality differs.

Then, on the GN-100:
- Pull/obtain Cosmos 3 Edge + a Nemotron reasoner (NIM catalog or NGC); confirm
  they load and run within the 128 GB unified budget (they should — ~6B total).
- Benchmark: single-stream + concurrent throughput (tok/s), latency, memory,
  and power draw vs the <500 W edge-box claim. Log actuals (replace the estimates).
- Validate the world-model capability on a DWS use case (a Control-Room / fleet
  scene-understanding or intent-prediction task), scored against a small private eval set.
- Sketch the ownership layer: how KYA governance (ASB/EAB/CSB/SIB), an Article-12
  evidence log, and adaptation on a sovereign first-person corpus wrap the open base.

Constraints (CLAUDE.md): data stays on-prem / EU (sovereign); DeepSeek/large
non-EU-origin models are benchmark-only, never the sovereign customer-data core;
name the NVIDIA supply-concentration honestly; no secrets in commits. Deliverable:
a lab note with verified specs + benchmark actuals + a go/no-go on adopting Cosmos 3
Edge as the LWM base. Commit on branch claude/ollama-orchestration-merge-047pj7
(DGX is sole writer per the handoff); do NOT open a PR without asking.
