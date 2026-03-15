#!/usr/bin/env python3
"""
LIFETIME WORLD - 70B Model LoRA Fine-Tuning Script
==================================================

This script fine-tunes a 70B model (e.g., Llama 3.3 70B) using LoRA/QLoRA
on either local GN-100 cluster or GCP A3 Mega instances.

Target Hardware:
  - Local: 2x Acer Veriton GN-100 (128GB unified memory each)
  - Cloud: GCP A3 Mega (8x H100 80GB)

Usage:
  # Local single node
  python train-70b-lora.py --config configs/70b-lora.yaml

  # Distributed (2 nodes)
  torchrun --nproc_per_node=1 --nnodes=2 --node_rank=0 \
           --master_addr=192.168.1.100 --master_port=29500 \
           train-70b-lora.py --config configs/70b-lora.yaml
"""

import argparse
import logging
import os
import sys
from datetime import datetime
from pathlib import Path

import torch
import yaml
from datasets import Dataset, load_dataset
from peft import (
    LoraConfig,
    TaskType,
    get_peft_model,
    prepare_model_for_kbit_training,
)
from transformers import (
    AutoModelForCausalLM,
    AutoTokenizer,
    BitsAndBytesConfig,
    TrainingArguments,
)
from trl import SFTTrainer

# Optional imports
try:
    import wandb

    WANDB_AVAILABLE = True
except ImportError:
    WANDB_AVAILABLE = False

try:
    import mlflow

    MLFLOW_AVAILABLE = True
except ImportError:
    MLFLOW_AVAILABLE = False


# =============================================================================
# CONFIGURATION
# =============================================================================

DEFAULT_CONFIG = {
    # Model
    "model_name": "meta-llama/Llama-3.3-70B-Instruct",
    "use_4bit": True,
    "use_8bit": False,
    "bnb_4bit_compute_dtype": "bfloat16",
    "bnb_4bit_quant_type": "nf4",
    "use_double_quant": True,
    # LoRA
    "lora_r": 64,
    "lora_alpha": 128,
    "lora_dropout": 0.05,
    "target_modules": [
        "q_proj",
        "k_proj",
        "v_proj",
        "o_proj",
        "gate_proj",
        "up_proj",
        "down_proj",
    ],
    # Training
    "output_dir": "/checkpoints/70b-lora",
    "num_train_epochs": 3,
    "per_device_train_batch_size": 1,
    "gradient_accumulation_steps": 8,
    "learning_rate": 2e-4,
    "weight_decay": 0.01,
    "warmup_ratio": 0.03,
    "lr_scheduler_type": "cosine",
    "max_seq_length": 2048,
    "fp16": False,
    "bf16": True,
    "gradient_checkpointing": True,
    "optim": "paged_adamw_8bit",
    # Data
    "dataset_name": None,  # Set via config or CLI
    "dataset_path": None,  # Local dataset path
    "text_column": "text",
    "max_samples": None,
    # Logging
    "logging_steps": 10,
    "save_steps": 100,
    "eval_steps": 100,
    "save_total_limit": 3,
    # Tracking
    "use_wandb": True,
    "wandb_project": "lifetime-world-model",
    "use_mlflow": True,
    "mlflow_experiment": "lifetime-llm-training",
}


def setup_logging(log_level: str = "INFO") -> logging.Logger:
    """Configure logging."""
    logging.basicConfig(
        level=getattr(logging, log_level.upper()),
        format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
        handlers=[
            logging.StreamHandler(sys.stdout),
            logging.FileHandler(f"training_{datetime.now():%Y%m%d_%H%M%S}.log"),
        ],
    )
    return logging.getLogger(__name__)


def load_config(config_path: str) -> dict:
    """Load configuration from YAML file."""
    config = DEFAULT_CONFIG.copy()

    if config_path and Path(config_path).exists():
        with open(config_path) as f:
            user_config = yaml.safe_load(f)
            config.update(user_config)

    return config


def get_bnb_config(config: dict) -> BitsAndBytesConfig:
    """Create BitsAndBytes quantization config."""
    if config["use_4bit"]:
        compute_dtype = getattr(torch, config["bnb_4bit_compute_dtype"])
        return BitsAndBytesConfig(
            load_in_4bit=True,
            bnb_4bit_quant_type=config["bnb_4bit_quant_type"],
            bnb_4bit_compute_dtype=compute_dtype,
            bnb_4bit_use_double_quant=config["use_double_quant"],
        )
    if config["use_8bit"]:
        return BitsAndBytesConfig(load_in_8bit=True)

    return None


def get_lora_config(config: dict) -> LoraConfig:
    """Create LoRA configuration."""
    return LoraConfig(
        r=config["lora_r"],
        lora_alpha=config["lora_alpha"],
        lora_dropout=config["lora_dropout"],
        target_modules=config["target_modules"],
        bias="none",
        task_type=TaskType.CAUSAL_LM,
    )


def load_model_and_tokenizer(config: dict, logger: logging.Logger):
    """Load model and tokenizer with quantization."""
    logger.info(f"Loading model: {config['model_name']}")

    # Quantization config
    bnb_config = get_bnb_config(config)

    # Load tokenizer
    tokenizer = AutoTokenizer.from_pretrained(
        config["model_name"],
        trust_remote_code=True,
        token=os.environ.get("HF_TOKEN"),
    )

    if tokenizer.pad_token is None:
        tokenizer.pad_token = tokenizer.eos_token
        tokenizer.pad_token_id = tokenizer.eos_token_id

    # Load model
    model = AutoModelForCausalLM.from_pretrained(
        config["model_name"],
        quantization_config=bnb_config,
        device_map="auto",
        trust_remote_code=True,
        token=os.environ.get("HF_TOKEN"),
        torch_dtype=torch.bfloat16 if config["bf16"] else torch.float16,
        attn_implementation="flash_attention_2",
    )

    # Prepare model for k-bit training
    if bnb_config:
        model = prepare_model_for_kbit_training(
            model,
            use_gradient_checkpointing=config["gradient_checkpointing"],
        )

    # Apply LoRA
    lora_config = get_lora_config(config)
    model = get_peft_model(model, lora_config)

    # Log trainable parameters
    trainable_params = sum(p.numel() for p in model.parameters() if p.requires_grad)
    total_params = sum(p.numel() for p in model.parameters())
    logger.info(
        f"Trainable params: {trainable_params:,} ({100 * trainable_params / total_params:.2f}%)"
    )

    return model, tokenizer


def load_dataset_from_config(
    config: dict, _tokenizer, logger: logging.Logger
) -> Dataset:
    """Load and prepare dataset."""
    if config["dataset_path"]:
        logger.info(f"Loading local dataset: {config['dataset_path']}")
        dataset = load_dataset("json", data_files=config["dataset_path"], split="train")
    elif config["dataset_name"]:
        logger.info(f"Loading dataset from Hub: {config['dataset_name']}")
        dataset = load_dataset(config["dataset_name"], split="train")
    else:
        raise ValueError("Either dataset_name or dataset_path must be specified")

    # Sample if max_samples specified
    if config["max_samples"]:
        dataset = dataset.select(range(min(len(dataset), config["max_samples"])))
        logger.info(f"Using {len(dataset)} samples")

    return dataset


def get_training_args(config: dict) -> TrainingArguments:
    """Create TrainingArguments."""
    return TrainingArguments(
        output_dir=config["output_dir"],
        num_train_epochs=config["num_train_epochs"],
        per_device_train_batch_size=config["per_device_train_batch_size"],
        gradient_accumulation_steps=config["gradient_accumulation_steps"],
        learning_rate=config["learning_rate"],
        weight_decay=config["weight_decay"],
        warmup_ratio=config["warmup_ratio"],
        lr_scheduler_type=config["lr_scheduler_type"],
        fp16=config["fp16"],
        bf16=config["bf16"],
        gradient_checkpointing=config["gradient_checkpointing"],
        optim=config["optim"],
        logging_steps=config["logging_steps"],
        save_steps=config["save_steps"],
        eval_strategy="no",
        save_total_limit=config["save_total_limit"],
        report_to=["wandb"] if config["use_wandb"] and WANDB_AVAILABLE else [],
        run_name=f"70b-lora-{datetime.now():%Y%m%d_%H%M%S}",
        ddp_find_unused_parameters=False,
        dataloader_pin_memory=True,
        remove_unused_columns=False,
    )


def main():
    parser = argparse.ArgumentParser(description="Fine-tune 70B model with LoRA")
    parser.add_argument("--config", type=str, help="Path to config YAML file")
    parser.add_argument("--model", type=str, help="Model name or path")
    parser.add_argument("--dataset", type=str, help="Dataset name or path")
    parser.add_argument("--output-dir", type=str, help="Output directory")
    parser.add_argument("--epochs", type=int, help="Number of epochs")
    parser.add_argument("--batch-size", type=int, help="Batch size per device")
    parser.add_argument("--lora-r", type=int, help="LoRA rank")
    parser.add_argument("--log-level", type=str, default="INFO", help="Logging level")
    args = parser.parse_args()

    # Setup logging
    logger = setup_logging(args.log_level)
    logger.info("=" * 60)
    logger.info("LIFETIME WORLD - 70B LoRA Fine-Tuning")
    logger.info("=" * 60)

    # Load config
    config = load_config(args.config)

    # Override with CLI args
    if args.model:
        config["model_name"] = args.model
    if args.dataset:
        if args.dataset.endswith(".json") or args.dataset.endswith(".jsonl"):
            config["dataset_path"] = args.dataset
        else:
            config["dataset_name"] = args.dataset
    if args.output_dir:
        config["output_dir"] = args.output_dir
    if args.epochs:
        config["num_train_epochs"] = args.epochs
    if args.batch_size:
        config["per_device_train_batch_size"] = args.batch_size
    if args.lora_r:
        config["lora_r"] = args.lora_r

    # Initialize tracking
    if config["use_wandb"] and WANDB_AVAILABLE:
        wandb.init(
            project=config["wandb_project"],
            config=config,
            name=f"70b-lora-{datetime.now():%Y%m%d_%H%M%S}",
        )

    if config["use_mlflow"] and MLFLOW_AVAILABLE:
        mlflow.set_experiment(config["mlflow_experiment"])
        mlflow.start_run()
        mlflow.log_params(config)

    try:
        # Load model and tokenizer
        model, tokenizer = load_model_and_tokenizer(config, logger)

        # Load dataset
        dataset = load_dataset_from_config(config, tokenizer, logger)

        # Create trainer
        training_args = get_training_args(config)

        trainer = SFTTrainer(
            model=model,
            train_dataset=dataset,
            dataset_text_field=config["text_column"],
            max_seq_length=config["max_seq_length"],
            tokenizer=tokenizer,
            args=training_args,
        )

        # Train
        logger.info("Starting training...")
        trainer.train()

        # Save final model
        final_path = Path(config["output_dir"]) / "final"
        logger.info(f"Saving final model to {final_path}")
        trainer.save_model(str(final_path))
        tokenizer.save_pretrained(str(final_path))

        logger.info("Training complete!")

    except Exception as e:
        logger.error(f"Training failed: {e}")
        raise

    finally:
        if config["use_wandb"] and WANDB_AVAILABLE:
            wandb.finish()
        if config["use_mlflow"] and MLFLOW_AVAILABLE:
            mlflow.end_run()


if __name__ == "__main__":
    main()
