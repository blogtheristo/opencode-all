---
name: train-model
description: Run a custom QLoRA fine-tune (EMT-001 / TM-001) on the Acer GN100 edge node or GCP burst. Use when the user says "train a model", "fine-tune", "run a training job", "EMT-001", "train on the Acer node", or provides a dataset to fine-tune on.
---

Run or manage a custom model fine-tuning job for Enterprise Model Training (EMT-001)
and Train Model (TM-001).

Read the skill definition at `skills/train-model/SKILL.md`, then execute the requested
action against the pipeline in `infrastructure/llm-training/`.

Input: $ARGUMENTS

Default action (no arguments): print the on-prem GN100 workflow summary and available
configs (`infrastructure/llm-training/configs/`).

Actions: `deploy` (build the ARM64 training image on the GN100), `train --config <cfg>
--dataset <path>` (run a fine-tune), `status`, `eval --model <m> --adapter <a>`, `smoke`
(run the CPU test suite).

Governed by `DWS_MODEL_STANDARD.md`. The real GN100 run happens over SSH via
`scripts/deploy-acer-training.sh`; see `Admin/Acer-Veriton-GN100/TRAINING_RUNBOOK.md`.
