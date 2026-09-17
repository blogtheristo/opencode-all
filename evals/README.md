# evals/ — Model Evaluation Sets

Registered eval sets for the Enterprise Model Training pipeline (EMT-001 / TM-001)
and the Lifetime World Model. This directory closes the `evals/` TODO referenced by
`DWS_MODEL_STANDARD.md §10` (Approval & Evaluation Gate).

## Format

Each eval set is JSONL, one object per line:

```json
{"prompt": "…question…", "expected": "…substring the answer must contain…"}
{"prompt": "…question…", "keywords": ["term one", "term two"]}
```

- `expected` — the model output must contain this substring (case-insensitive).
- `keywords` — ALL listed terms must appear (case-insensitive). Use for questions
  with more than one acceptable phrasing.

Scoring is **deterministic** (substring / keyword containment) — the model is not in
the scoring path (Engineering Rule 5). An optional Claude-as-judge pass exists in the
harness but is off by default.

## Sets

| File | Purpose | Rows |
|------|---------|------|
| `industry_baseline.jsonl` | Cross-industry construction / EU-compliance domain sanity baseline | 8 |

The baseline is intentionally small and is the **seed** eval — a real per-customer
engagement (EMT-001) ships a larger, domain-specific set built from the customer's
data. Add per-customer sets as `evals/<customer>-<domain>.jsonl`.

## Running

```bash
cd infrastructure/llm-training/scripts
python evaluate.py \
  --model meta-llama/Llama-3.1-8B-Instruct \
  --adapter /checkpoints/8b-qlora/final \
  --eval ../../evals/industry_baseline.jsonl \
  --out report.json
```

The harness emits a JSON report with `score`, `passed`, `total`, and per-row results.
Use it as the eval-regression gate before promoting a fine-tuned model.
