"""Shared pytest fixtures for the LLM-training pipeline tests.

The trainer lives in a hyphenated file (`scripts/train-70b-lora.py`) that cannot
be imported with a normal `import`, so we load it via importlib. The heavy ML
stack (torch/transformers/trl/peft/datasets) is required to import that module;
tests `importorskip` those deps so the suite SKIPS cleanly on a bare host (e.g.
the Node CI runner) instead of failing, and RUNS where a Python ML env exists
(`pip install -r requirements-dev.txt`).
"""

import importlib.util
from pathlib import Path

import pytest

SCRIPTS_DIR = Path(__file__).resolve().parent.parent / "scripts"
CONFIGS_DIR = Path(__file__).resolve().parent.parent / "configs"
TRAINER_PATH = SCRIPTS_DIR / "train-70b-lora.py"


def _load_trainer_module():
    spec = importlib.util.spec_from_file_location("train_lora", TRAINER_PATH)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


@pytest.fixture(scope="session")
def trainer():
    """The imported trainer module, or skip if the ML stack is absent."""
    pytest.importorskip("torch")
    pytest.importorskip("transformers")
    pytest.importorskip("peft")
    pytest.importorskip("yaml")
    return _load_trainer_module()


@pytest.fixture(scope="session")
def configs_dir():
    return CONFIGS_DIR
