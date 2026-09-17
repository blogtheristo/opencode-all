#!/usr/bin/env python3
"""
NeMo DataDesigner CBAM Batch Generation Runner — Scaleway H100

Code-Version: 1.0
Introduced-In: PR-1000 (pending)
Branch: claude/vulcan-cn-codes-pr-f00gK
Date: 2026-04-07
Owner: Lifetime Oy (risto.paarni@lifetime.fi)

Phase 2 runner: generates 1K–100K synthetic CBAM declarations on Scaleway
H100 SXM using NVIDIA NeMo DataDesigner + Nemotron-3 70B.

Usage:
    # Generate 1K records (Phase 2 default — ~5h, EUR 14)
    python scripts/runners/nemo-generate.py --target 1000

    # Generate 100K records (Phase 3 — ~200h on 2x H100, EUR 380–546)
    python scripts/runners/nemo-generate.py --target 100000 --gpus 2

    # Dry run — validate config without GPU allocation
    python scripts/runners/nemo-generate.py --target 1000 --dry-run

    # Resume interrupted batch from checkpoint
    python scripts/runners/nemo-generate.py --resume output/cbam_batch_20260407_120000

Sources:
    - NeMo DataDesigner: github.com/NVIDIA-NeMo/DataDesigner (Apache 2.0)
    - Scaleway H100 pricing: EUR 2.73/hr on-demand (fr-par-2, 2026-04)
    - CBAM schema: src/synthetic-data/cbam-schema.ts
    - Seed dataset: src/synthetic-data/seed-dataset.ts (55 filings)
    - Compute strategy: src/synthetic-data/compute-strategy.ts
"""

import argparse
import json
import logging
import sys
import time
from datetime import UTC, datetime
from pathlib import Path

# ---------------------------------------------------------------------------
# Configuration — all values from src/synthetic-data/compute-strategy.ts
# ---------------------------------------------------------------------------

SCALEWAY_REGIONS = ["fr-par-2", "pl-waw-2"]
DEFAULT_REGION = "fr-par-2"
H100_COST_EUR_PER_HOUR = 2.73  # Source: Scaleway GPU pricing 2026-04
BATCH_SIZE = 50  # Records per generation batch
MIN_JUDGE_SCORE = 0.95  # Minimum LLM-as-Judge score for acceptance
MAX_RETRIES_PER_BATCH = 3
CHECKPOINT_INTERVAL = 100  # Save checkpoint every N accepted records

# NeMo DataDesigner model configs (from cbam-schema.ts model_configs)
GENERATOR_MODEL = "nvidia/nemotron-3-70b-instruct"
JUDGE_MODEL = "nvidia/nemotron-4-340b-instruct"

# CBAM schema dataset name
DATASET_NAME = "DWS_IQ_CBAM_StressTest_v1"

# Output directory (relative to repo root)
OUTPUT_DIR = Path("output/synthetic-data")

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(message)s",
    datefmt="%Y-%m-%dT%H:%M:%S",
)
log = logging.getLogger("nemo-generate")


# ---------------------------------------------------------------------------
# Schema loader — reads the TypeScript schema and converts to DD YAML config
# ---------------------------------------------------------------------------


def load_schema_config() -> dict:
    """Build NeMo DataDesigner config from the canonical CBAM schema.

    The schema is defined in TypeScript (src/synthetic-data/cbam-schema.ts).
    This function constructs the equivalent Python dict that NeMo DD expects.
    """
    # Installation profiles (from SEED_INSTALLATIONS in cbam-schema.ts)
    installations = [
        {
            "id": "TR-992-IRON",
            "country": "TR",
            "sector": "steel",
            "route": "Blast Furnace (BF-BOF)",
            "emission_range": (1.8, 2.5),
        },
        {
            "id": "IN-551-STEEL",
            "country": "IN",
            "sector": "steel",
            "route": "Blast Furnace (BF-BOF)",
            "emission_range": (2.0, 2.8),
        },
        {
            "id": "CN-008-ALU",
            "country": "CN",
            "sector": "aluminium",
            "route": "Hall-Heroult Electrolysis",
            "emission_range": (12.0, 18.0),
        },
        {
            "id": "RU-201-STEEL",
            "country": "RU",
            "sector": "steel",
            "route": "Electric Arc Furnace (EAF)",
            "emission_range": (0.4, 0.9),
        },
        {
            "id": "EG-044-FERT",
            "country": "EG",
            "sector": "fertilizers",
            "route": "Haber-Bosch (steam methane reforming)",
            "emission_range": (1.6, 2.5),
        },
        {
            "id": "UA-117-STEEL",
            "country": "UA",
            "sector": "steel",
            "route": "Direct Reduced Iron (DRI)",
            "emission_range": (1.0, 1.6),
        },
        {
            "id": "VN-303-CEM",
            "country": "VN",
            "sector": "cement",
            "route": "Dry process rotary kiln",
            "emission_range": (0.6, 0.9),
        },
        {
            "id": "MA-078-CEM",
            "country": "MA",
            "sector": "cement",
            "route": "Dry process rotary kiln",
            "emission_range": (0.55, 0.8),
        },
        {
            "id": "SA-511-H2",
            "country": "SA",
            "sector": "hydrogen",
            "route": "Steam Methane Reforming (grey H2)",
            "emission_range": (8.5, 12.0),
        },
        {
            "id": "NO-622-H2",
            "country": "NO",
            "sector": "hydrogen",
            "route": "PEM Electrolysis (green H2)",
            "emission_range": (0.3, 1.5),
        },
        {
            "id": "BA-901-ELEC",
            "country": "BA",
            "sector": "electricity",
            "route": "Lignite thermal power",
            "emission_range": (0.8, 1.2),
        },
        {
            "id": "GB-444-ELEC",
            "country": "GB",
            "sector": "electricity",
            "route": "Gas CCGT + offshore wind mix",
            "emission_range": (0.15, 0.35),
        },
    ]

    installation_ids = [i["id"] for i in installations]
    id_to_country = {i["id"]: i["country"] for i in installations}
    id_to_sector = {i["id"]: i["sector"] for i in installations}
    id_to_route = {i["id"]: i["route"] for i in installations}
    id_to_cn_code = {
        "TR-992-IRON": "7201",
        "IN-551-STEEL": "7201",
        "CN-008-ALU": "7601",
        "RU-201-STEEL": "7201",
        "EG-044-FERT": "3102",
        "UA-117-STEEL": "7201",
        "VN-303-CEM": "2523 21",
        "MA-078-CEM": "2523 21",
        "SA-511-H2": "2804 10 00",
        "NO-622-H2": "2804 10 00",
        "BA-901-ELEC": "2716 00 00",
        "GB-444-ELEC": "2716 00 00",
    }

    return {
        "dataset_name": DATASET_NAME,
        "version": "1.0.0",
        "description": (
            "Synthetic CBAM declarations with embedded carbon leakage signatures "
            "for stress-testing DWS IQ compliance agents."
        ),
        "model_configs": [
            {"alias": "nv-nemotron-3-70b", "model": GENERATOR_MODEL, "provider": "nim"},
            {
                "alias": "nv-nemotron-4-340b-instruct",
                "model": JUDGE_MODEL,
                "provider": "nim",
            },
        ],
        "columns": build_column_configs(
            installation_ids,
            id_to_country,
            id_to_sector,
            id_to_route,
            id_to_cn_code,
        ),
        "validation": {
            "judge_model": "nv-nemotron-4-340b-instruct",
            "criteria": (
                "Regulatory fidelity: emission factor consistent with production route, "
                "CN code matches declared sector, technical narrative plausible for the "
                "installation type, precursor chain complete."
            ),
            "min_score": MIN_JUDGE_SCORE,
            "retry_on_fail": True,
            "max_retries": MAX_RETRIES_PER_BATCH,
        },
        "metadata": {
            "regulation": "EU CBAM Regulation (EU) 2023/956 + Implementing Reg. (EU) 2023/1773",
            "source_citations": [
                "EU ETS Benchmark 2021-2025 (Reg. 2021/447)",
                "CBAM transitional default values (Reg. 2023/1773)",
                "World Steel Association Statistical Yearbook 2024",
                "International Aluminium Institute GHG Data 2024",
                "GCCA Getting the Numbers Right 2024",
                "IEA Iron and Steel Technology Roadmap 2024",
                "IEA Global Hydrogen Review 2024",
                "IFA Fertilizer Industry Handbook 2024",
            ],
            "created": datetime.now(UTC).isoformat(),
            "owner": "Lifetime Oy (0772407-9)",
        },
        "_installations": installations,
    }


def build_data_designer_config(schema_config: dict, target_rows: int) -> dict:
    """Return the runtime config passed into DataDesigner.

    Internal provenance fields stay out of the runtime payload so the executed
    config matches the persisted config.json exactly.
    """
    runtime_config = {k: v for k, v in schema_config.items() if not k.startswith("_")}
    runtime_config["target_rows"] = target_rows
    return runtime_config


def build_provenance_payload(schema_config: dict) -> dict:
    """Build a provenance payload for internal schema seeds and metadata."""
    return {
        "schema_source": "src/synthetic-data/cbam-schema.ts",
        "installations": schema_config.get("_installations", []),
        "generated_at": datetime.now(UTC).isoformat(),
    }


def build_column_configs(
    installation_ids: list[str],
    id_to_country: dict[str, str],
    id_to_sector: dict[str, str],
    id_to_route: dict[str, str],
    id_to_cn_code: dict[str, str],
) -> list[dict]:
    """Build NeMo DataDesigner column configurations.

    Mirrors the buildCBAMStressTestSchema() function in cbam-schema.ts.
    """
    country_lookup = ", ".join(f'"{k}": "{v}"' for k, v in id_to_country.items())
    sector_lookup = ", ".join(f'"{k}": "{v}"' for k, v in id_to_sector.items())
    route_lookup = ", ".join(f'"{k}": "{v}"' for k, v in id_to_route.items())
    cn_code_lookup = ", ".join(f'"{k}": "{v}"' for k, v in id_to_cn_code.items())

    anomaly_types = [
        "none",
        "route-narrative-mismatch",
        "missing-precursor",
        "grid-greenwash",
        "process-emission-mismatch",
        "rounding-fraud",
    ]
    # 70% clean, 30% anomalous.
    anomaly_weights = [0.70, 0.075, 0.075, 0.05, 0.05, 0.05]

    return [
        # 1. Declaration ID
        {
            "name": "declaration_id",
            "column_type": "sampler",
            "sampler_type": "uuid",
            "params": {},
        },
        # 2. Installation ID (categorical from 12 seeds)
        {
            "name": "installation_id",
            "column_type": "sampler",
            "sampler_type": "category",
            "params": {"values": installation_ids},
        },
        # 3-5. Lookups
        {
            "name": "origin_country",
            "column_type": "expression",
            "expr": f"{{{{ {{{country_lookup}}}[installation_id] }}}}",
            "dtype": "str",
        },
        {
            "name": "sector",
            "column_type": "expression",
            "expr": f"{{{{ {{{sector_lookup}}}[installation_id] }}}}",
            "dtype": "str",
        },
        {
            "name": "production_method",
            "column_type": "expression",
            "expr": f"{{{{ {{{route_lookup}}}[installation_id] }}}}",
            "dtype": "str",
        },
        {
            "name": "cn_code",
            "column_type": "expression",
            "expr": f"{{{{ {{{cn_code_lookup}}}[installation_id] }}}}",
            "dtype": "str",
        },
        # 7. Import quantity (uniform 50–50000 tonnes)
        {
            "name": "import_quantity_tonnes",
            "column_type": "sampler",
            "sampler_type": "uniform",
            "params": {"low": 50, "high": 50000},
        },
        # 8. Embedded emissions (sector-appropriate gaussian, clamped in post-processing)
        {
            "name": "embedded_emissions_direct",
            "column_type": "sampler",
            "sampler_type": "gaussian",
            "params": {"low": 0.1, "high": 20.0},
        },
        # 9. Indirect emissions
        {
            "name": "embedded_emissions_indirect",
            "column_type": "sampler",
            "sampler_type": "uniform",
            "params": {"low": 0.0, "high": 2.0},
        },
        {
            "name": "uses_default_values",
            "column_type": "sampler",
            "sampler_type": "category",
            "params": {"values": ["true", "false"], "weights": [0.35, 0.65]},
        },
        # 10. Carbon price paid at origin
        {
            "name": "carbon_price_paid_origin",
            "column_type": "sampler",
            "sampler_type": "uniform",
            "params": {"low": 0, "high": 45},
        },
        {
            "name": "energy_source_primary",
            "column_type": "sampler",
            "sampler_type": "category",
            "params": {
                "values": [
                    "coal",
                    "natural gas",
                    "coke",
                    "petroleum coke",
                    "grid electricity (coal-heavy)",
                    "grid electricity (gas mix)",
                    "grid electricity (renewable-heavy)",
                    "captive coal power",
                    "biomass co-firing",
                    "waste-derived fuels",
                ]
            },
        },
        {
            "name": "precursor_materials",
            "column_type": "sampler",
            "sampler_type": "category",
            "params": {
                "values": [
                    "iron ore, coke, limestone",
                    "scrap steel, lime, electrodes",
                    "iron ore, natural gas, lime",
                    "bauxite, alumina, cryolite",
                    "clinker, gypsum, fly ash",
                    "natural gas feedstock",
                    "ammonia, nitric acid",
                    "n/a (electricity)",
                ]
            },
        },
        # 11. Anomaly type (weighted categorical)
        {
            "name": "anomaly_type",
            "column_type": "sampler",
            "sampler_type": "category",
            "params": {"values": anomaly_types, "weights": anomaly_weights},
        },
        {
            "name": "anomaly_severity",
            "column_type": "sampler",
            "sampler_type": "category",
            "params": {
                "values": ["none", "low", "medium", "high", "critical"],
                "weights": [0.70, 0.10, 0.10, 0.06, 0.04],
            },
        },
        # 12. MTC narrative (LLM-generated)
        {
            "name": "mtc_narrative",
            "column_type": "llm-text",
            "model_alias": "nv-nemotron-3-70b",
            "prompt": (
                "Write a Mill Test Certificate (MTC) narrative for a CBAM filing. "
                "Installation: {{ installation_id }} in {{ origin_country }}. "
                "Production method: {{ production_method }}. "
                "Sector: {{ sector }}. "
                "CN code: {{ cn_code }}. "
                "Embedded emissions: {{ embedded_emissions_direct }} tCO2e/t. "
                "Energy source: {{ energy_source_primary }}. "
                "Precursors: {{ precursor_materials }}. "
                "Anomaly type: {{ anomaly_type }}. "
                'If anomaly_type is not "none", introduce a subtle inconsistency matching '
                "the anomaly type that a skilled auditor should catch. "
                "Keep under 200 words. Use technical CBAM/EU ETS terminology."
            ),
            "system_prompt": (
                "You are a CBAM compliance document generator. Your MTC narratives must be "
                "technically accurate for clean filings and subtly deceptive for anomalous ones. "
                "Reference real production processes, emission sources, and EU regulatory terms."
            ),
            "max_tokens": 512,
        },
        # 13. Reporting period
        {
            "name": "reporting_period",
            "column_type": "sampler",
            "sampler_type": "category",
            "params": {"values": ["2026-Q1", "2026-Q2", "2026-Q3", "2026-Q4"]},
        },
        # 14. EORI number
        {
            "name": "declarant_eori",
            "column_type": "sampler",
            "sampler_type": "person",
            "params": {},
        },
        # 15. Verifier
        {
            "name": "verifier_accreditation",
            "column_type": "sampler",
            "sampler_type": "category",
            "params": {
                "values": [
                    "TUV SUD (DE-V-0012)",
                    "Bureau Veritas (FR-V-0003)",
                    "SGS (CH-V-0008)",
                    "DNV (NO-V-0001)",
                    "LRQA (GB-V-0005)",
                ]
            },
        },
        {
            "name": "verification_methodology",
            "column_type": "sampler",
            "sampler_type": "category",
            "params": {
                "values": [
                    "ISO 14064-3:2019 (reasonable assurance)",
                    "ISO 14064-3:2019 (limited assurance)",
                    "EU MRV Regulation 2018/2066",
                    "CBAM Implementing Regulation 2023/1773 Art. 4",
                    "self-declared (no third-party verification)",
                ]
            },
        },
    ]


# ---------------------------------------------------------------------------
# Checkpoint management
# ---------------------------------------------------------------------------


def checkpoint_path(output_dir: Path) -> Path:
    return output_dir / "checkpoint.json"


def save_checkpoint(output_dir: Path, state: dict) -> None:
    cp = checkpoint_path(output_dir)
    cp.write_text(json.dumps(state, indent=2, default=str))
    log.info(
        "Checkpoint saved: %d accepted, %d rejected",
        state["accepted"],
        state["rejected"],
    )


def load_checkpoint(output_dir: Path) -> dict | None:
    cp = checkpoint_path(output_dir)
    if cp.exists():
        return json.loads(cp.read_text())
    return None


def write_summary(
    output_dir: Path,
    state: dict,
    cost: dict,
    results_file: Path,
    status: str,
    last_error: str | None = None,
) -> Path:
    """Persist a machine-readable pipeline summary for success or failure."""
    total_processed = state["accepted"] + state["rejected"]
    pass_rate = (
        round(state["accepted"] / total_processed * 100, 1) if total_processed else 0.0
    )
    summary = {
        "pipeline": "DWS IQ CBAM Synthetic Data Pipeline v1.0",
        "status": status,
        "accepted_records": state["accepted"],
        "rejected_records": state["rejected"],
        "pass_rate": pass_rate,
        "batches": state["batches_completed"],
        "output_file": str(results_file),
        "cost_estimate": cost,
        "config": {
            "generator_model": GENERATOR_MODEL,
            "judge_model": JUDGE_MODEL,
            "min_score": MIN_JUDGE_SCORE,
            "batch_size": BATCH_SIZE,
            "max_retries_per_batch": MAX_RETRIES_PER_BATCH,
        },
        "last_error": last_error,
        "last_failed_batch": state.get("last_failed_batch"),
        "retry_attempts": state.get("retry_attempts", {}),
    }
    summary_path = output_dir / "dd-summary.json"
    summary_path.write_text(json.dumps(summary, indent=2, default=str))
    return summary_path


# ---------------------------------------------------------------------------
# NeMo DataDesigner client (placeholder — real SDK call)
# ---------------------------------------------------------------------------


def generate_batch(config: dict, batch_size: int, batch_idx: int) -> list[dict]:
    """Call NeMo DataDesigner to generate a batch of records.

    This implementation currently invokes the NeMo DataDesigner Python SDK on
    the provisioned GPU host:
        from nemo_data_designer import DataDesigner
        dd = DataDesigner(config)
        records = dd.generate(num_rows=batch_size)
    """
    try:
        # Import NeMo DataDesigner SDK (available on H100 instances)
        from nemo_data_designer import DataDesigner  # type: ignore[import-not-found]

        log.debug("Generating batch %d with %d rows", batch_idx, batch_size)
        dd = DataDesigner(config)
        return dd.generate(num_rows=batch_size)
    except ImportError:
        log.warning(
            "NeMo DataDesigner SDK not installed. "
            "Install with: pip install nvidia-nemo-datadesigner"
        )
        raise


def judge_batch(records: list[dict], config: dict) -> list[dict]:
    """Run LLM-as-Judge validation on a batch.

    Returns records annotated with judge_score and judge_reasoning.
    Records below MIN_JUDGE_SCORE are marked as rejected.
    """
    try:
        from nemo_data_designer import DataDesigner  # type: ignore[import-not-found]

        dd = DataDesigner(config)
        return dd.judge(records)
    except ImportError:
        log.warning("NeMo DataDesigner SDK not installed — cannot run judge.")
        raise


# ---------------------------------------------------------------------------
# Main pipeline
# ---------------------------------------------------------------------------


def estimate_cost(target: int, gpus: int) -> dict:
    """Estimate generation cost based on observed throughput.

    Source: compute-strategy.ts generationPipelines[0]
    - 1x H100: ~200 records/hour (with judge validation)
    - 2x H100: ~380 records/hour
    """
    if target <= 0:
        raise ValueError("target must be greater than 0")

    throughput = 200 * gpus * 0.95  # 0.95 scaling factor for multi-GPU
    hours = target / throughput
    cost_eur = hours * H100_COST_EUR_PER_HOUR * gpus
    return {
        "target_records": target,
        "gpus": gpus,
        "estimated_hours": round(hours, 1),
        "estimated_cost_eur": round(cost_eur, 2),
        "throughput_records_per_hour": round(throughput),
        "cost_per_record_eur": round(cost_eur / target, 4),
    }


def run_pipeline(args: argparse.Namespace) -> int:
    """Execute the NeMo DataDesigner generation pipeline."""
    target = args.target
    gpus = args.gpus
    region = args.region
    dry_run = args.dry_run
    resume_dir = args.resume

    log.info("=== NeMo DataDesigner CBAM Batch Generation ===")
    log.info("Target: %d records | GPUs: %d | Region: %s", target, gpus, region)

    # Cost estimate
    cost = estimate_cost(target, gpus)
    log.info(
        "Estimate: %.1f hours, EUR %.2f (%.4f EUR/record)",
        cost["estimated_hours"],
        cost["estimated_cost_eur"],
        cost["cost_per_record_eur"],
    )

    # Load schema
    schema_config = load_schema_config()
    runtime_config = build_data_designer_config(schema_config, target)
    provenance_payload = build_provenance_payload(schema_config)
    log.info(
        "Schema loaded: %s v%s (%d columns, %d installations)",
        runtime_config["dataset_name"],
        runtime_config["version"],
        len(runtime_config["columns"]),
        len(provenance_payload["installations"]),
    )

    if dry_run:
        log.info("--- DRY RUN — no GPU allocation ---")
        print(
            json.dumps(
                {
                    "mode": "dry-run",
                    "schema": runtime_config,
                    "cost_estimate": cost,
                    "installations": len(provenance_payload["installations"]),
                    "column_count": len(runtime_config["columns"]),
                    "judge_model": JUDGE_MODEL,
                    "generator_model": GENERATOR_MODEL,
                    "min_score": MIN_JUDGE_SCORE,
                },
                indent=2,
                default=str,
            )
        )
        return 0

    # Check NeMo DataDesigner SDK
    try:
        import nemo_data_designer  # type: ignore[import-not-found] # noqa: F401
    except ImportError:
        log.error(
            "nvidia-nemo-datadesigner package not found.\n"
            "Install on Scaleway H100:\n"
            "  pip install nvidia-nemo-datadesigner\n"
            "Or use the NeMo container:\n"
            "  docker run --gpus all nvcr.io/nvidia/nemo-datadesigner:24.04"
        )
        return 1

    # Setup output directory
    if resume_dir:
        output_dir = Path(resume_dir)
        if not output_dir.exists():
            log.error("Resume directory not found: %s", resume_dir)
            return 1
    else:
        timestamp = datetime.now(UTC).strftime("%Y%m%d_%H%M%S")
        output_dir = OUTPUT_DIR / f"cbam_batch_{timestamp}"

    output_dir.mkdir(parents=True, exist_ok=True)
    log.info("Output: %s", output_dir)

    # Save config for reproducibility
    config_path = output_dir / "config.json"
    config_path.write_text(json.dumps(runtime_config, indent=2, default=str))
    provenance_path = output_dir / "provenance.json"
    provenance_path.write_text(json.dumps(provenance_payload, indent=2, default=str))

    # Load or initialize state
    state = load_checkpoint(output_dir)
    if state:
        log.info(
            "Resuming from checkpoint: %d accepted, %d rejected",
            state["accepted"],
            state["rejected"],
        )
    else:
        state = {
            "accepted": 0,
            "rejected": 0,
            "batches_completed": 0,
            "start_time": datetime.now(UTC).isoformat(),
            "target": target,
            "gpus": gpus,
            "region": region,
            "retry_attempts": {},
            "last_error": None,
            "last_failed_batch": None,
        }

    # Main generation loop
    results_file = output_dir / "accepted_records.jsonl"
    rejects_file = output_dir / "rejected_records.jsonl"

    while state["accepted"] < target:
        batch_idx = state["batches_completed"]
        remaining = target - state["accepted"]
        current_batch_size = min(BATCH_SIZE, remaining)

        log.info(
            "Batch %d: generating %d records (%d/%d accepted)",
            batch_idx,
            current_batch_size,
            state["accepted"],
            target,
        )

        try:
            # Generate
            t0 = time.monotonic()
            records = generate_batch(runtime_config, current_batch_size, batch_idx)
            gen_time = time.monotonic() - t0

            # Judge
            t1 = time.monotonic()
            judged = judge_batch(records, runtime_config)
            judge_time = time.monotonic() - t1

            # Partition accepted/rejected
            batch_accepted = []
            batch_rejected = []
            for rec in judged:
                score = rec.get("judge_score", 0)
                if score >= MIN_JUDGE_SCORE:
                    batch_accepted.append(rec)
                else:
                    batch_rejected.append(rec)

            # Write results
            with open(results_file, "a") as f:
                for rec in batch_accepted:
                    f.write(json.dumps(rec, default=str) + "\n")

            with open(rejects_file, "a") as f:
                for rec in batch_rejected:
                    f.write(json.dumps(rec, default=str) + "\n")

            state["accepted"] += len(batch_accepted)
            state["rejected"] += len(batch_rejected)
            state["batches_completed"] += 1
            state["retry_attempts"].pop(str(batch_idx), None)
            state["last_error"] = None
            state["last_failed_batch"] = None

            log.info(
                "Batch %d done: +%d accepted, +%d rejected (%.1fs gen, %.1fs judge)",
                batch_idx,
                len(batch_accepted),
                len(batch_rejected),
                gen_time,
                judge_time,
            )

            # Checkpoint
            if state["accepted"] % CHECKPOINT_INTERVAL < current_batch_size:
                save_checkpoint(output_dir, state)

        except KeyboardInterrupt:
            log.warning("Interrupted — saving checkpoint")
            state["end_time"] = datetime.now(UTC).isoformat()
            save_checkpoint(output_dir, state)
            write_summary(output_dir, state, cost, results_file, status="interrupted")
            return 130

        except Exception as e:
            batch_key = str(batch_idx)
            retry_count = state["retry_attempts"].get(batch_key, 0) + 1
            state["retry_attempts"][batch_key] = retry_count
            state["last_error"] = str(e)
            state["last_failed_batch"] = batch_idx
            log.error(
                "Batch %d failed on attempt %d/%d: %s",
                batch_idx,
                retry_count,
                MAX_RETRIES_PER_BATCH,
                e,
            )
            save_checkpoint(output_dir, state)
            if retry_count >= MAX_RETRIES_PER_BATCH:
                state["end_time"] = datetime.now(UTC).isoformat()
                save_checkpoint(output_dir, state)
                write_summary(
                    output_dir,
                    state,
                    cost,
                    results_file,
                    status="failed",
                    last_error=str(e),
                )
                return 1
            log.info("Retrying batch %d after failure...", batch_idx)
            time.sleep(5)
            continue

    # Final checkpoint & summary
    state["end_time"] = datetime.now(UTC).isoformat()
    save_checkpoint(output_dir, state)
    summary_path = write_summary(
        output_dir, state, cost, results_file, status="complete"
    )

    log.info("=== COMPLETE ===")
    log.info(
        "Accepted: %d | Rejected: %d | Pass rate: %.1f%%",
        state["accepted"],
        state["rejected"],
        round(state["accepted"] / (state["accepted"] + state["rejected"]) * 100, 1),
    )
    log.info("Output: %s", results_file)
    log.info("Summary: %s", summary_path)

    return 0


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------


def main() -> int:
    global BATCH_SIZE, MIN_JUDGE_SCORE

    parser = argparse.ArgumentParser(
        description="NeMo DataDesigner CBAM Batch Generation — Scaleway H100",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=(
            "Examples:\n"
            "  %(prog)s --target 1000                    # Phase 2: 1K records\n"
            "  %(prog)s --target 100000 --gpus 2          # Phase 3: 100K records\n"
            "  %(prog)s --target 1000 --dry-run            # Validate config only\n"
            "  %(prog)s --resume output/synthetic-data/cbam_batch_20260407_120000\n"
        ),
    )
    parser.add_argument(
        "--target",
        type=int,
        default=1000,
        help="Number of accepted records to generate (default: 1000)",
    )
    parser.add_argument(
        "--gpus",
        type=int,
        default=1,
        choices=[1, 2, 4, 8],
        help="Number of H100 GPUs (default: 1)",
    )
    parser.add_argument(
        "--region",
        default=DEFAULT_REGION,
        choices=SCALEWAY_REGIONS,
        help=f"Scaleway region (default: {DEFAULT_REGION})",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Validate config and estimate cost without GPU allocation",
    )
    parser.add_argument(
        "--resume",
        type=str,
        default=None,
        help="Resume from a previous output directory",
    )
    parser.add_argument(
        "--batch-size",
        type=int,
        default=BATCH_SIZE,
        help=f"Records per generation batch (default: {BATCH_SIZE})",
    )
    parser.add_argument(
        "--min-score",
        type=float,
        default=MIN_JUDGE_SCORE,
        help=f"Minimum judge score for acceptance (default: {MIN_JUDGE_SCORE})",
    )

    args = parser.parse_args()

    if args.target <= 0:
        parser.error("--target must be greater than 0")
    if args.batch_size <= 0:
        parser.error("--batch-size must be greater than 0")
    if not 0 <= args.min_score <= 1:
        parser.error("--min-score must be between 0 and 1")

    # Override globals from CLI args
    BATCH_SIZE = args.batch_size
    MIN_JUDGE_SCORE = args.min_score

    return run_pipeline(args)


if __name__ == "__main__":
    sys.exit(main())
