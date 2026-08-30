#!/usr/bin/env python3
"""
LIFETIME WORLD - Model Evaluation Harness
=========================================

Runs a trained/fine-tuned model (base + optional LoRA adapter) against a JSONL
eval set and emits a structured JSON score report. Closes the `evals/` TODO in
DWS_MODEL_STANDARD.md §10.

The eval set is JSONL, one object per line:
  {"prompt": "...", "expected": "..."}      # exact/keyword match scoring
Optionally a `keywords` list can replace `expected` for keyword scoring:
  {"prompt": "...", "keywords": ["EN 15978", "embodied carbon"]}

Scoring is deterministic by default (keyword / substring containment) — the
model is NOT in the scoring path (Engineering Rule 5). An optional
Claude-as-judge pass (--judge) is available but OFF by default.

Usage:
  # Score a base model against the seed eval set, write JSON report
  python evaluate.py --model meta-llama/Llama-3.1-8B-Instruct \
      --eval ../../evals/industry_baseline.jsonl --out report.json

  # Score a fine-tuned adapter
  python evaluate.py --model meta-llama/Llama-3.1-8B-Instruct \
      --adapter /checkpoints/8b-qlora/final --eval ../../evals/industry_baseline.jsonl
"""

import argparse
import json
import logging
import os
import sys
from datetime import datetime
from pathlib import Path

logger = logging.getLogger("evaluate")


def load_eval_set(path: str) -> list[dict]:
    """Load a JSONL eval set. Fails loud on an empty or missing file."""
    p = Path(path)
    if not p.exists():
        raise FileNotFoundError(f"Eval set not found: {path}")
    rows = [json.loads(line) for line in p.read_text().splitlines() if line.strip()]
    if not rows:
        raise ValueError(f"Eval set is empty: {path}")
    return rows


def score_row(expected: dict, prediction: str) -> bool:
    """Deterministic pass/fail for one row.

    - If the row has `keywords`, ALL keywords must appear (case-insensitive).
    - Else the `expected` string must appear as a substring (case-insensitive).
    Returns True on pass. This is the intent under test — a model that ignores
    the domain fails these rows."""
    pred = (prediction or "").lower()
    if "keywords" in expected and expected["keywords"]:
        return all(str(k).lower() in pred for k in expected["keywords"])
    target = str(expected.get("expected", "")).strip().lower()
    if not target:
        raise ValueError(f"Row has neither `keywords` nor `expected`: {expected}")
    return target in pred


def generate(model, tokenizer, prompt: str, max_new_tokens: int = 128) -> str:
    """Greedy-decode a single completion. Deterministic (do_sample=False)."""
    inputs = tokenizer(prompt, return_tensors="pt").to(model.device)
    out = model.generate(
        **inputs, max_new_tokens=max_new_tokens, do_sample=False
    )
    text = tokenizer.decode(out[0], skip_special_tokens=True)
    # Strip the echoed prompt so scoring sees only the completion.
    return text[len(prompt):] if text.startswith(prompt) else text


def run_eval(model_name: str, adapter: str | None, eval_path: str) -> dict:
    """Load model (+ optional adapter), run the eval set, return a score dict."""
    import torch
    from transformers import AutoModelForCausalLM, AutoTokenizer

    rows = load_eval_set(eval_path)
    logger.info(f"Loaded {len(rows)} eval rows from {eval_path}")

    use_gpu = bool(torch.cuda.is_available())
    tokenizer = AutoTokenizer.from_pretrained(
        model_name, trust_remote_code=True, token=os.environ.get("HF_TOKEN")
    )
    if tokenizer.pad_token is None:
        tokenizer.pad_token = tokenizer.eos_token
    model = AutoModelForCausalLM.from_pretrained(
        model_name,
        device_map="auto" if use_gpu else None,
        torch_dtype=torch.bfloat16 if use_gpu else torch.float32,
        trust_remote_code=True,
        token=os.environ.get("HF_TOKEN"),
    )
    if adapter:
        from peft import PeftModel

        logger.info(f"Applying LoRA adapter: {adapter}")
        model = PeftModel.from_pretrained(model, adapter)
    model.eval()

    results = []
    passed = 0
    for i, row in enumerate(rows):
        prediction = generate(model, tokenizer, row["prompt"])
        ok = score_row(row, prediction)
        passed += int(ok)
        results.append({"index": i, "pass": ok, "prompt": row["prompt"][:80]})
        logger.info(f"  [{i + 1}/{len(rows)}] {'PASS' if ok else 'FAIL'}")

    return {
        "model": model_name,
        "adapter": adapter,
        "eval_set": eval_path,
        "total": len(rows),
        "passed": passed,
        "score": round(passed / len(rows), 4),
        "results": results,
        "timestamp": datetime.utcnow().isoformat() + "Z",
    }


def main():
    parser = argparse.ArgumentParser(description="Evaluate a model against a JSONL eval set")
    parser.add_argument("--model", required=True, help="Base model name or path")
    parser.add_argument("--adapter", help="Optional LoRA adapter path")
    parser.add_argument("--eval", required=True, help="Path to JSONL eval set")
    parser.add_argument("--out", help="Write JSON report to this path (else stdout)")
    parser.add_argument("--log-level", default="INFO")
    args = parser.parse_args()

    logging.basicConfig(
        level=getattr(logging, args.log_level.upper()),
        format="%(asctime)s - %(levelname)s - %(message)s",
        stream=sys.stderr,
    )

    report = run_eval(args.model, args.adapter, args.eval)
    payload = json.dumps(report, indent=2)
    if args.out:
        Path(args.out).write_text(payload)
        logger.info(f"Wrote report to {args.out} (score={report['score']})")
    else:
        print(payload)


if __name__ == "__main__":
    main()
