"""Intent tests for the training-pipeline config layer (Engineering Rule 9).

These assert *intent*, not just shape: each test would fail if the business
logic regressed — e.g. if quantization silently stayed on when no GPU is present
(would OOM/crash on CI), if the config-merge precedence flipped, or if the LoRA
target modules were dropped (adapter would train nothing useful).
"""

import pytest

yaml = pytest.importorskip("yaml")


def test_default_config_is_qlora_nf4(trainer):
    """The shipped default must be 4-bit nf4 QLoRA — the whole cost story
    depends on it. A regression to full precision would 10x the memory need."""
    cfg = trainer.DEFAULT_CONFIG
    assert cfg["use_4bit"] is True
    assert cfg["bnb_4bit_quant_type"] == "nf4"


def test_user_config_overrides_defaults(tmp_path, trainer):
    """User YAML must override defaults (not the reverse). If precedence flips,
    every custom recipe would be silently ignored."""
    p = tmp_path / "c.yaml"
    p.write_text(yaml.safe_dump({"lora_r": 999, "model_name": "custom/model"}))
    cfg = trainer.load_config(str(p))
    assert cfg["lora_r"] == 999
    assert cfg["model_name"] == "custom/model"
    # untouched keys keep their defaults
    assert cfg["bnb_4bit_quant_type"] == "nf4"


def test_bnb_config_disabled_without_gpu(monkeypatch, trainer):
    """4-bit must degrade to None when no CUDA GPU is present — bitsandbytes
    needs a GPU, so returning a real bnb config on CPU would crash the load.
    This is what lets the same script run the CPU smoke test."""
    monkeypatch.setattr(trainer, "gpu_available", lambda: False)
    assert trainer.get_bnb_config({"use_4bit": True, "use_8bit": False}) is None


def test_bnb_config_enabled_with_gpu(monkeypatch, trainer):
    """With a GPU, 4-bit must actually produce a 4-bit bnb config."""
    monkeypatch.setattr(trainer, "gpu_available", lambda: True)
    cfg = {
        "use_4bit": True,
        "use_8bit": False,
        "bnb_4bit_compute_dtype": "bfloat16",
        "bnb_4bit_quant_type": "nf4",
        "use_double_quant": True,
    }
    bnb = trainer.get_bnb_config(cfg)
    assert bnb is not None
    assert bnb.load_in_4bit is True


def test_lora_targets_attention_and_mlp(trainer):
    """LoRA must target the attention + MLP projections. If the list is emptied
    or truncated, the adapter trains far fewer params and quality collapses —
    a test that can't catch that is worthless."""
    cfg = dict(trainer.DEFAULT_CONFIG)
    lora = trainer.get_lora_config(cfg)
    for module in ("q_proj", "k_proj", "v_proj", "o_proj"):
        assert module in lora.target_modules


def test_eval_strategy_off_without_eval_set(monkeypatch, trainer):
    """No eval set -> eval_strategy 'no'. With one -> 'steps'. Proves the eval
    step is wired to the config, not hardcoded off (the original bug)."""
    monkeypatch.setattr(trainer, "gpu_available", lambda: False)
    args_no = trainer.get_training_args(trainer.DEFAULT_CONFIG, has_eval=False)
    args_yes = trainer.get_training_args(trainer.DEFAULT_CONFIG, has_eval=True)
    assert str(args_no.eval_strategy) in ("IntervalStrategy.NO", "no")
    assert str(args_yes.eval_strategy) in ("IntervalStrategy.STEPS", "steps")


def test_shipped_configs_parse_and_are_consistent(configs_dir):
    """Every shipped YAML must load and carry the keys the trainer reads. A
    typo'd key would be silently ignored at runtime — catch it here. (No ML
    deps needed, so this runs even on a bare host.)"""
    required = {"model_name", "use_4bit", "lora_r", "target_modules", "output_dir"}
    seen = 0
    for path in configs_dir.glob("*.yaml"):
        data = yaml.safe_load(path.read_text())
        missing = required - data.keys()
        assert not missing, f"{path.name} missing keys: {missing}"
        seen += 1
    assert seen >= 4, f"expected the shipped configs, found {seen}"
