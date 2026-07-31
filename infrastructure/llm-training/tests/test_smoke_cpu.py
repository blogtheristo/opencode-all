"""End-to-end CPU smoke test for the training pipeline.

Runs the real trainer CLI on a tiny random model for one step on CPU (no GPU,
no bitsandbytes) and asserts a checkpoint is ACTUALLY written. This is the
intent under test (Engineering Rule 9): the pipeline is wired end to end —
config load -> model+tokenizer -> LoRA -> SFT -> checkpoint on disk. If any
stage silently no-ops, no `final/` dir appears and the test fails.

Skips cleanly when the ML stack (torch/transformers/trl/peft/datasets) is not
installed, so it never breaks a bare/Node-only CI runner.
"""

import json
import subprocess
import sys
from pathlib import Path

import pytest

# The full SFT path needs all of these; skip the smoke test if any is missing.
pytest.importorskip("torch")
pytest.importorskip("transformers")
pytest.importorskip("trl")
pytest.importorskip("peft")
pytest.importorskip("datasets")

SCRIPTS_DIR = Path(__file__).resolve().parent.parent / "scripts"
CONFIGS_DIR = Path(__file__).resolve().parent.parent / "configs"
TRAINER = SCRIPTS_DIR / "train-70b-lora.py"
SMOKE_CONFIG = CONFIGS_DIR / "smoke-cpu.yaml"

SAMPLES = [f"Lifetime World Model smoke sample number {i}." for i in range(8)]


def _write_tiny_dataset(path: Path) -> None:
    """A handful of short text rows — enough to run one optimizer step."""
    path.write_text("\n".join(json.dumps({"text": t}) for t in SAMPLES))


def _build_tiny_model(dest: Path) -> None:
    """Build a tiny local Llama model + tokenizer on disk — no network.

    Keeps the smoke test hermetic (the proxy blocks the HF hub), while still
    exercising the real code path: a genuine LlamaForCausalLM with q/k/v/o
    projections for LoRA to attach to."""
    from tokenizers import Tokenizer
    from tokenizers.models import WordLevel
    from tokenizers.pre_tokenizers import Whitespace
    from tokenizers.trainers import WordLevelTrainer
    from transformers import LlamaConfig, LlamaForCausalLM, PreTrainedTokenizerFast

    tok = Tokenizer(WordLevel(unk_token="<unk>"))
    tok.pre_tokenizer = Whitespace()
    tok.train_from_iterator(
        SAMPLES, WordLevelTrainer(special_tokens=["<unk>", "<pad>", "</s>", "<s>"])
    )
    fast = PreTrainedTokenizerFast(
        tokenizer_object=tok,
        unk_token="<unk>",
        pad_token="<pad>",
        eos_token="</s>",
        bos_token="<s>",
    )
    fast.save_pretrained(str(dest))

    cfg = LlamaConfig(
        vocab_size=tok.get_vocab_size(),
        hidden_size=32,
        intermediate_size=64,
        num_hidden_layers=2,
        num_attention_heads=4,
        num_key_value_heads=4,
        max_position_embeddings=128,
    )
    LlamaForCausalLM(cfg).save_pretrained(str(dest))


@pytest.mark.timeout(600)
def test_dry_run_validates_without_training(tmp_path):
    """`--dry-run` must validate config + inputs and exit 0 WITHOUT training,
    and must exit non-zero when the required dataset is missing (fail loud)."""
    ds = tmp_path / "data.jsonl"
    _write_tiny_dataset(ds)

    ok = subprocess.run(
        [sys.executable, str(TRAINER), "--config", str(SMOKE_CONFIG),
         "--dataset", str(ds), "--dry-run"],
        capture_output=True, text=True,
    )
    assert ok.returncode == 0, ok.stderr

    missing = subprocess.run(
        [sys.executable, str(TRAINER), "--config", str(SMOKE_CONFIG), "--dry-run"],
        capture_output=True, text=True,
    )
    assert missing.returncode != 0, "dry-run should fail loud with no dataset"


@pytest.mark.timeout(1200)
def test_smoke_training_writes_checkpoint(tmp_path):
    """One-step CPU fine-tune must produce a saved checkpoint on disk."""
    ds = tmp_path / "data.jsonl"
    _write_tiny_dataset(ds)
    model_dir = tmp_path / "tiny-model"
    _build_tiny_model(model_dir)
    out = tmp_path / "ckpt"

    proc = subprocess.run(
        [sys.executable, str(TRAINER), "--config", str(SMOKE_CONFIG),
         "--model", str(model_dir), "--dataset", str(ds), "--output-dir", str(out)],
        capture_output=True, text=True,
    )
    assert proc.returncode == 0, f"training failed:\n{proc.stderr[-2000:]}"

    final = out / "final"
    assert final.exists(), f"no checkpoint written to {final}"
    # A real save produces model + tokenizer artifacts, not an empty dir.
    written = list(final.iterdir())
    assert written, f"checkpoint dir {final} is empty"
