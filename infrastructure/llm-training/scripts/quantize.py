#!/usr/bin/env python3
"""
LIFETIME WORLD - Model Quantization Script
==========================================

Quantizes trained models to various formats for efficient inference:
  - GGUF (llama.cpp compatible)
  - AWQ (4-bit, GPU optimized)
  - GPTQ (4-bit, GPU optimized)

Usage:
  python quantize.py --model /models/outputs/70b-final --format gguf --bits 4
  python quantize.py --model /models/outputs/70b-final --format awq
  python quantize.py --model /models/outputs/70b-final --format gptq --bits 8
"""

import argparse
import logging
import sys
from pathlib import Path

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)


def quantize_to_gguf(model_path: str, output_path: str, bits: int = 4):
    """Convert model to GGUF format for llama.cpp."""
    logger.info(f"Converting to GGUF ({bits}-bit): {model_path}")

    try:
        import subprocess

        # Use llama.cpp convert script
        convert_script = "convert-hf-to-gguf.py"  # From llama.cpp repo

        quant_type = {
            2: "Q2_K",
            3: "Q3_K_M",
            4: "Q4_K_M",
            5: "Q5_K_M",
            6: "Q6_K",
            8: "Q8_0",
        }.get(bits, "Q4_K_M")

        output_file = Path(output_path) / f"model-{quant_type}.gguf"

        # First convert to f16 GGUF
        f16_path = Path(output_path) / "model-f16.gguf"
        logger.info("Step 1: Converting to FP16 GGUF...")

        subprocess.run(
            [  # noqa: S607
                "python",
                convert_script,
                model_path,
                "--outfile",
                str(f16_path),
                "--outtype",
                "f16",
            ],
            check=True,
        )

        # Then quantize
        logger.info(f"Step 2: Quantizing to {quant_type}...")
        subprocess.run(
            [  # noqa: S607
                "llama-quantize",
                str(f16_path),
                str(output_file),
                quant_type,
            ],
            check=True,
        )

        logger.info(f"GGUF model saved: {output_file}")
        return str(output_file)

    except ImportError:
        logger.error(
            "llama-cpp-python not installed. Run: pip install llama-cpp-python"
        )
        raise
    except Exception as e:
        logger.error(f"GGUF conversion failed: {e}")
        raise


def quantize_to_awq(model_path: str, output_path: str):
    """Quantize model using AWQ (Activation-aware Weight Quantization)."""
    logger.info(f"Quantizing with AWQ: {model_path}")

    try:
        from awq import AutoAWQForCausalLM
        from transformers import AutoTokenizer

        # Load model
        model = AutoAWQForCausalLM.from_pretrained(
            model_path,
            device_map="auto",
            trust_remote_code=True,
        )
        tokenizer = AutoTokenizer.from_pretrained(model_path, trust_remote_code=True)

        # Quantize
        quant_config = {
            "zero_point": True,
            "q_group_size": 128,
            "w_bit": 4,
            "version": "GEMM",
        }

        logger.info("Running AWQ calibration...")
        model.quantize(tokenizer, quant_config=quant_config)

        # Save
        output_dir = Path(output_path) / "awq"
        output_dir.mkdir(parents=True, exist_ok=True)

        model.save_quantized(str(output_dir))
        tokenizer.save_pretrained(str(output_dir))

        logger.info(f"AWQ model saved: {output_dir}")
        return str(output_dir)

    except ImportError:
        logger.error("AutoAWQ not installed. Run: pip install autoawq")
        raise


def quantize_to_gptq(model_path: str, output_path: str, bits: int = 4):
    """Quantize model using GPTQ."""
    logger.info(f"Quantizing with GPTQ ({bits}-bit): {model_path}")

    try:
        from auto_gptq import AutoGPTQForCausalLM, BaseQuantizeConfig
        from transformers import AutoTokenizer

        # Load tokenizer
        tokenizer = AutoTokenizer.from_pretrained(model_path, trust_remote_code=True)

        # Quantization config
        quantize_config = BaseQuantizeConfig(
            bits=bits,
            group_size=128,
            desc_act=False,
        )

        # Load model
        model = AutoGPTQForCausalLM.from_pretrained(
            model_path,
            quantize_config=quantize_config,
            device_map="auto",
            trust_remote_code=True,
        )

        # Prepare calibration data (using C4 dataset)
        logger.info("Preparing calibration data...")
        from datasets import load_dataset

        calibration_data = load_dataset(
            "allenai/c4", "en", split="train", streaming=True
        )
        calibration_samples = []
        for i, sample in enumerate(calibration_data):
            if i >= 128:
                break
            calibration_samples.append(tokenizer(sample["text"], return_tensors="pt"))

        # Quantize
        logger.info("Running GPTQ quantization...")
        model.quantize(calibration_samples)

        # Save
        output_dir = Path(output_path) / f"gptq-{bits}bit"
        output_dir.mkdir(parents=True, exist_ok=True)

        model.save_quantized(str(output_dir))
        tokenizer.save_pretrained(str(output_dir))

        logger.info(f"GPTQ model saved: {output_dir}")
        return str(output_dir)

    except ImportError:
        logger.error("auto-gptq not installed. Run: pip install auto-gptq")
        raise


def quantize_kv_turboquant(model_path: str, output_path: str, bits: int = 3):
    """Precompute TurboQuant KV cache codebooks for a model.

    This is COMPLEMENTARY to weight quantization (GGUF/AWQ/GPTQ).
    Weight quant compresses model storage; TurboQuant compresses runtime
    KV cache memory, enabling longer contexts.

    Source: TurboQuant (arXiv 2504.19874, ICLR 2026)
    """
    logger.info(f"TurboQuant KV cache codebook precomputation ({bits}-bit): {model_path}")

    try:
        from turboquant import precompute_codebooks, test_attention_fidelity

        # Detect KV head dimension from model config
        kv_dim = 128  # default for most models
        config_path = Path(model_path) / "config.json"
        if config_path.exists():
            import json

            with open(config_path) as f:
                config = json.load(f)
            # head_dim = hidden_size / num_attention_heads
            hidden = config.get("hidden_size", 4096)
            heads = config.get("num_attention_heads", 32)
            kv_dim = hidden // heads
            logger.info(f"Detected KV head dimension: {kv_dim} (hidden={hidden}, heads={heads})")

        # Common dimensions to precompute (model's dim + standard sizes)
        dims = sorted(set([64, 128, 256, kv_dim]))
        bits_list = [bits]

        output_file = Path(output_path) / f"turboquant-codebooks-{bits}bit.npz"
        output_file.parent.mkdir(parents=True, exist_ok=True)

        precompute_codebooks(dims, bits_list, str(output_file))

        # Validate with attention fidelity test
        logger.info("Running attention fidelity validation...")
        results = test_attention_fidelity(dim=kv_dim, bits=bits)

        if results["pass"]:
            logger.info(
                f"Fidelity test PASSED: {results['mean_attention_fidelity']:.4f} "
                f"(threshold: >0.995)"
            )
        else:
            logger.warning(
                f"Fidelity test BELOW THRESHOLD: {results['mean_attention_fidelity']:.4f}"
            )

        logger.info(f"TurboQuant codebooks saved: {output_file}")
        logger.info(
            f"Compression ratio: {results['compression_ratio']:.1f}x vs FP16 KV cache"
        )
        return str(output_file)

    except ImportError:
        logger.error(
            "turboquant.py not found. Ensure turboquant.py is in the same directory."
        )
        raise


def main():
    parser = argparse.ArgumentParser(description="Quantize LLM models")
    parser.add_argument("--model", "-m", required=True, help="Path to model directory")
    parser.add_argument(
        "--output", "-o", help="Output directory (default: model_path/quantized)"
    )
    parser.add_argument(
        "--format",
        "-f",
        choices=["gguf", "awq", "gptq", "turboquant-kv", "all"],
        default="gguf",
        help="Quantization format (turboquant-kv = KV cache compression)",
    )
    parser.add_argument(
        "--bits", "-b", type=int, default=4, help="Quantization bits (GGUF/GPTQ: 2-8, turboquant-kv: 2-4)"
    )
    args = parser.parse_args()

    # Setup paths
    model_path = Path(args.model).resolve()
    if not model_path.exists():
        logger.error(f"Model path does not exist: {model_path}")
        sys.exit(1)

    output_path = Path(args.output) if args.output else model_path / "quantized"
    output_path.mkdir(parents=True, exist_ok=True)

    logger.info("=" * 60)
    logger.info("LIFETIME WORLD - Model Quantization")
    logger.info("=" * 60)
    logger.info(f"Model:  {model_path}")
    logger.info(f"Output: {output_path}")
    logger.info(f"Format: {args.format}")
    logger.info(f"Bits:   {args.bits}")
    logger.info("=" * 60)

    # Run quantization
    results = {}

    if args.format in ["gguf", "all"]:
        try:
            results["gguf"] = quantize_to_gguf(
                str(model_path), str(output_path), args.bits
            )
        except Exception as e:
            logger.error(f"GGUF quantization failed: {e}")
            if args.format == "gguf":
                sys.exit(1)

    if args.format in ["awq", "all"]:
        try:
            results["awq"] = quantize_to_awq(str(model_path), str(output_path))
        except Exception as e:
            logger.error(f"AWQ quantization failed: {e}")
            if args.format == "awq":
                sys.exit(1)

    if args.format in ["gptq", "all"]:
        try:
            results["gptq"] = quantize_to_gptq(
                str(model_path), str(output_path), args.bits
            )
        except Exception as e:
            logger.error(f"GPTQ quantization failed: {e}")
            if args.format == "gptq":
                sys.exit(1)

    if args.format in ["turboquant-kv", "all"]:
        tq_bits = min(args.bits, 4)  # TurboQuant supports 2-4 bits
        if tq_bits < 2:
            tq_bits = 3  # default to 3-bit
        try:
            results["turboquant-kv"] = quantize_kv_turboquant(
                str(model_path), str(output_path), tq_bits
            )
        except Exception as e:
            logger.error(f"TurboQuant KV cache codebook generation failed: {e}")
            if args.format == "turboquant-kv":
                sys.exit(1)

    # Summary
    logger.info("")
    logger.info("=" * 60)
    logger.info("Quantization Complete!")
    logger.info("=" * 60)
    for fmt, path in results.items():
        logger.info(f"  {fmt.upper()}: {path}")


if __name__ == "__main__":
    main()
