#!/usr/bin/env python3
"""
CBAM 1K Records Generator — NCC V1 Demo
Scaleway H100 SXM 80GB (fr-par-2)

Generates 1,000 synthetic CBAM declarations with MTC narratives for NCC due
diligence demo (deadline: June 15, 2026). Validates every record with a
deterministic rule-checker and an LLM-as-Judge via Scaleway Generative APIs.

Schema ported from: src/synthetic-data/cbam-schema.ts
Seed installations:  src/synthetic-data/cbam-schema.ts :: SEED_INSTALLATIONS
Regulations:         EU 2023/956 + 2023/1773 + 2025/2547

Hardware target:     Scaleway H100 SXM 80GB (1x GPU, fr-par-2)
Estimated cost:      EUR 14  (5 h × EUR 2.73/hr) + Generative APIs free tier

Usage:
    export SCW_SECRET_KEY=<your-key>
    pip install -r requirements.txt
    python generate-cbam-1k.py
    python generate-cbam-1k.py --records 100 --dry-run
    python generate-cbam-1k.py --skip-llm-judge --output-dir /tmp/cbam
"""

import argparse
import asyncio
import csv
import json
import os
import random
import sys
import time
import uuid
from dataclasses import asdict, dataclass, field
from pathlib import Path
from typing import Optional

# ---------------------------------------------------------------------------
# Optional deps — fail early with a clear message
# ---------------------------------------------------------------------------
try:
    from openai import AsyncOpenAI
except ImportError:
    sys.exit("Missing: pip install openai")

try:
    from tqdm import tqdm
except ImportError:
    sys.exit("Missing: pip install tqdm")

# ---------------------------------------------------------------------------
# SEED INSTALLATIONS (ported from src/synthetic-data/cbam-schema.ts)
# Every value sourced from real-world data — no invented numbers.
# ---------------------------------------------------------------------------

SEED_INSTALLATIONS = [
    # === STEEL ===
    {
        "id": "TR-992-IRON", "country": "TR", "country_name": "Turkiye",
        "sector": "steel", "production_route": "Blast Furnace (BF-BOF)",
        "emission_min": 1.8, "emission_max": 2.5,
        "energy_sources": ["coal", "coke", "natural gas", "BF gas recovery"],
        "source": "World Steel Association 2024 — Turkey BF-BOF avg 2.1 tCO2e/t",
    },
    {
        "id": "IN-551-STEEL", "country": "IN", "country_name": "India",
        "sector": "steel", "production_route": "Blast Furnace (BF-BOF)",
        "emission_min": 2.0, "emission_max": 2.8,
        "energy_sources": ["coal", "coke", "captive power (coal)"],
        "source": "IEA Iron and Steel Technology Roadmap 2024 — India avg 2.4 tCO2e/t",
    },
    {
        "id": "RU-201-STEEL", "country": "RU", "country_name": "Russia",
        "sector": "steel", "production_route": "Electric Arc Furnace (EAF)",
        "emission_min": 0.4, "emission_max": 0.9,
        "energy_sources": ["grid electricity (gas+hydro mix)", "natural gas", "scrap input"],
        "source": "World Steel Association 2024 — Russia EAF avg 0.6 tCO2e/t",
    },
    {
        "id": "UA-117-STEEL", "country": "UA", "country_name": "Ukraine",
        "sector": "steel", "production_route": "Direct Reduced Iron (DRI)",
        "emission_min": 1.0, "emission_max": 1.6,
        "energy_sources": ["natural gas (DRI)", "grid electricity"],
        "source": "World Steel Association 2024 — DRI-EAF route avg 1.2 tCO2e/t",
    },
    # === ALUMINIUM ===
    {
        "id": "CN-008-ALU", "country": "CN", "country_name": "China",
        "sector": "aluminium", "production_route": "Hall-Heroult Electrolysis",
        "emission_min": 12.0, "emission_max": 18.0,
        "energy_sources": ["coal-fired grid electricity", "captive coal power"],
        "source": "IAI 2024 — China primary aluminium avg 16.2 tCO2e/t (incl. indirect)",
    },
    {
        "id": "NO-712-ALU", "country": "NO", "country_name": "Norway",
        "sector": "aluminium", "production_route": "Hall-Heroult Electrolysis",
        "emission_min": 0.3, "emission_max": 1.5,
        "energy_sources": ["hydropower grid electricity"],
        "source": "IAI 2024 — Norway primary aluminium avg 0.5 tCO2e/t (hydro grid)",
    },
    # === CEMENT ===
    {
        "id": "VN-303-CEM", "country": "VN", "country_name": "Vietnam",
        "sector": "cement", "production_route": "Dry process rotary kiln",
        "emission_min": 0.6, "emission_max": 0.9,
        "energy_sources": ["coal", "petroleum coke", "waste-derived fuels"],
        "source": "GCCA 2024 — SE Asia cement avg 0.68 tCO2e/t clinker",
    },
    {
        "id": "MA-078-CEM", "country": "MA", "country_name": "Morocco",
        "sector": "cement", "production_route": "Dry process rotary kiln",
        "emission_min": 0.55, "emission_max": 0.8,
        "energy_sources": ["petroleum coke", "coal", "natural gas"],
        "source": "GCCA GNR 2024 — MENA avg 0.63 tCO2e/t",
    },
    # === FERTILIZERS ===
    {
        "id": "EG-044-FERT", "country": "EG", "country_name": "Egypt",
        "sector": "fertilizers", "production_route": "Haber-Bosch (steam methane reforming)",
        "emission_min": 1.6, "emission_max": 2.5,
        "energy_sources": ["natural gas (feedstock + fuel)", "grid electricity"],
        "source": "IFA 2024 — MENA ammonia avg 1.9 tCO2e/t NH3",
    },
    {
        "id": "SA-211-FERT", "country": "SA", "country_name": "Saudi Arabia",
        "sector": "fertilizers", "production_route": "Haber-Bosch (steam methane reforming)",
        "emission_min": 8.5, "emission_max": 12.0,
        "energy_sources": ["natural gas (associated gas flaring component)"],
        "source": "IFA 2024 — GCC urea high-end 10.2 tCO2e/t (flaring-adjusted)",
    },
    # === HYDROGEN ===
    {
        "id": "SA-099-H2", "country": "SA", "country_name": "Saudi Arabia",
        "sector": "hydrogen", "production_route": "Steam Methane Reforming (SMR)",
        "emission_min": 8.5, "emission_max": 12.0,
        "energy_sources": ["natural gas feedstock"],
        "source": "IEA Global Hydrogen Review 2024 — SMR without CCS 10.1 kgCO2/kgH2",
    },
    # === ELECTRICITY ===
    {
        "id": "BA-501-ELEC", "country": "BA", "country_name": "Bosnia and Herzegovina",
        "sector": "electricity", "production_route": "Lignite thermal power",
        "emission_min": 0.8, "emission_max": 1.2,
        "energy_sources": ["lignite"],
        "source": "EEA GHG Inventory 2024 — W. Balkans grid avg 0.95 tCO2e/MWh",
    },
    {
        "id": "GB-444-ELEC", "country": "GB", "country_name": "United Kingdom",
        "sector": "electricity", "production_route": "Gas CCGT + offshore wind mix",
        "emission_min": 0.15, "emission_max": 0.35,
        "energy_sources": ["natural gas CCGT", "offshore wind", "nuclear"],
        "source": "DESNZ 2024 — UK grid factor 0.207 kgCO2e/kWh",
    },
]

# Index for fast lookup by installation id
_INSTALL_BY_ID = {i["id"]: i for i in SEED_INSTALLATIONS}

# ---------------------------------------------------------------------------
# CBAM CN CODES (first code per sector, from cbam-schema.ts)
# ---------------------------------------------------------------------------
SECTOR_CN_CODES = {
    "steel": "7206",
    "aluminium": "7601",
    "cement": "2523 21",
    "fertilizers": "3102",
    "hydrogen": "2804 10 00",
    "electricity": "2716 00 00",
}

# ---------------------------------------------------------------------------
# SAMPLING TABLES
# ---------------------------------------------------------------------------

REPORTING_PERIODS = {
    "values": ["2026-Q1", "2026-Q2", "2026-Q3", "2026-Q4", "2027-Q1", "2027-Q2"],
    "weights": [0.25, 0.25, 0.20, 0.15, 0.10, 0.05],
}

ENERGY_SOURCES = {
    "values": [
        "coal", "natural gas", "coke", "petroleum coke",
        "grid electricity (coal-heavy)", "grid electricity (gas mix)",
        "grid electricity (renewable-heavy)", "captive coal power",
        "biomass co-firing", "waste-derived fuels",
    ],
    "weights": [0.18, 0.22, 0.10, 0.08, 0.12, 0.10, 0.05, 0.07, 0.04, 0.04],
}

PRECURSOR_MATERIALS = [
    "iron ore, coke, limestone",
    "scrap steel, lime, electrodes",
    "iron ore, natural gas, lime",
    "bauxite, alumina, cryolite",
    "clinker, gypsum, fly ash",
    "natural gas feedstock",
    "ammonia, nitric acid",
    "n/a (electricity)",
]

VERIFIERS = {
    "values": [
        "TUV SUD (DE-V-0012)", "Bureau Veritas (FR-V-0003)",
        "DNV (NO-V-0001)", "SGS (CH-V-0007)",
        "LRQA (GB-V-0015)", "UNVERIFIED",
    ],
    "weights": [0.20, 0.20, 0.20, 0.15, 0.10, 0.15],
}

VERIFICATION_METHODS = {
    "values": [
        "ISO 14064-3:2019 (reasonable assurance)",
        "ISO 14064-3:2019 (limited assurance)",
        "EU MRV Regulation 2018/2066",
        "CBAM Implementing Regulation 2023/1773 Art. 4",
        "self-declared (no third-party verification)",
    ],
    "weights": [0.25, 0.20, 0.20, 0.20, 0.15],
}

ANOMALY_TYPES = {
    "values": [
        "none", "emission_energy_mismatch",
        "production_route_emission_mismatch", "unverified_low_emissions",
        "default_values_with_low_claim", "missing_precursor_data",
        "carbon_price_credit_overclaim", "cn_code_sector_mismatch",
    ],
    "weights": [0.40, 0.12, 0.10, 0.10, 0.08, 0.08, 0.07, 0.05],
}

ANOMALY_SEVERITIES = {
    "values": ["none", "low", "medium", "high", "critical"],
    "weights": [0.40, 0.15, 0.20, 0.15, 0.10],
}

# ---------------------------------------------------------------------------
# HELPERS
# ---------------------------------------------------------------------------

def weighted_choice(table: dict) -> str:
    return random.choices(table["values"], weights=table["weights"], k=1)[0]


def clamp(val: float, lo: float, hi: float) -> float:
    return max(lo, min(hi, val))


def sample_emission_for_installation(inst: dict, anomaly: str) -> tuple[float, float]:
    """Return (direct_emission, indirect_emission) for an installation.

    Anomalous records deliberately break the physical bounds to test agents.
    """
    lo, hi = inst["emission_min"], inst["emission_max"]
    if anomaly == "none":
        direct = round(random.uniform(lo, hi), 4)
    elif anomaly in ("emission_energy_mismatch", "production_route_emission_mismatch"):
        # Claim implausibly low direct emissions
        direct = round(random.uniform(0.05, lo * 0.4), 4)
    elif anomaly == "unverified_low_emissions":
        direct = round(random.uniform(lo * 0.3, lo * 0.7), 4)
    elif anomaly == "carbon_price_credit_overclaim":
        # Normal emission but overclaim carbon price paid
        direct = round(random.uniform(lo, hi), 4)
    else:
        direct = round(random.uniform(lo, hi), 4)

    sector = inst["sector"]
    # Aluminium has large indirect (grid electricity component)
    if sector == "aluminium":
        indirect = round(random.uniform(0.5, 5.0), 4)
    elif sector == "electricity":
        indirect = 0.0  # electricity reports grid factor, not indirect
    else:
        indirect = round(random.uniform(0.0, 0.8), 4)

    return direct, indirect


def build_declaration_id() -> str:
    year = random.choice(["2026", "2027"])
    q = random.randint(1, 4)
    seq = random.randint(100_000, 999_999)
    return f"CBAM-{year}-Q{q}-{seq}"


def build_eori() -> str:
    return f"FI{random.randint(1_000_000, 9_999_999)}00"


# ---------------------------------------------------------------------------
# DATA RECORD
# ---------------------------------------------------------------------------

@dataclass
class CBAMRecord:
    declaration_id: str
    declarant_eori: str
    reporting_period: str
    installation_id: str
    origin_country: str
    country_name: str
    production_method: str
    sector: str
    cn_code: str
    import_quantity_tonnes: float
    embedded_emissions_direct: float
    embedded_emissions_indirect: float
    uses_default_values: str
    carbon_price_paid_origin: float
    energy_source_primary: str
    electricity_consumption_mwh_per_tonne: float
    precursor_materials: str
    mtc_narrative: str
    verifier_accreditation: str
    verification_methodology: str
    anomaly_type: str
    anomaly_severity: str
    judge_score: Optional[float] = None
    judge_pass: bool = False
    record_id: str = field(default_factory=lambda: str(uuid.uuid4()))
    generated_at: str = ""

    def to_dict(self) -> dict:
        return asdict(self)


# ---------------------------------------------------------------------------
# RECORD BUILDER (deterministic fields)
# ---------------------------------------------------------------------------

def build_record_fields(anomaly_type: str, anomaly_severity: str) -> dict:
    inst = random.choice(SEED_INSTALLATIONS)
    direct, indirect = sample_emission_for_installation(inst, anomaly_type)

    carbon_price: float = 0.0
    if anomaly_type == "carbon_price_credit_overclaim":
        carbon_price = round(random.uniform(50, 120), 2)  # EU ETS ~65 EUR/t; overclaim > 100
    elif random.random() < 0.3:
        carbon_price = round(random.uniform(5, 65), 2)

    return {
        "declaration_id": build_declaration_id(),
        "declarant_eori": build_eori(),
        "reporting_period": weighted_choice(REPORTING_PERIODS),
        "installation_id": inst["id"],
        "origin_country": inst["country"],
        "country_name": inst["country_name"],
        "production_method": inst["production_route"],
        "sector": inst["sector"],
        "cn_code": SECTOR_CN_CODES.get(inst["sector"], "UNKNOWN"),
        "import_quantity_tonnes": round(random.uniform(50, 25_000), 2),
        "embedded_emissions_direct": direct,
        "embedded_emissions_indirect": indirect,
        "uses_default_values": random.choices(["true", "false"], weights=[0.35, 0.65])[0],
        "carbon_price_paid_origin": carbon_price,
        "energy_source_primary": weighted_choice(ENERGY_SOURCES),
        "electricity_consumption_mwh_per_tonne": round(random.uniform(0.05, 15.0), 3),
        "precursor_materials": random.choice(PRECURSOR_MATERIALS),
        "anomaly_type": anomaly_type,
        "anomaly_severity": anomaly_severity,
    }


# ---------------------------------------------------------------------------
# LLM CALLS (Scaleway Generative APIs, OpenAI-compatible)
# ---------------------------------------------------------------------------

MTC_SYSTEM_PROMPT = (
    "You are a metallurgical quality engineer writing Mill Test Certificate (MTC) "
    "comments for CBAM-covered shipments. Write precise, technical language. "
    "Follow EN 10204:2004 Type 3.1 certificate structure."
)

MTC_PROMPT_TEMPLATE = """\
Write a technical MTC comment (3–5 paragraphs) for this CBAM shipment:

Installation: {installation_id} ({country_name}, {origin_country})
Production route: {production_method}
Sector: {sector}
CN Code: {cn_code}
Quantity: {qty} tonnes
Stated direct emissions: {direct} tCO2e/t
Energy source: {energy}
Precursors: {precursors}

Cover:
1. Chemical composition / mechanical properties summary
2. Production route and heat treatment details
3. Energy consumption and emission monitoring methodology (cite CBAM Implementing Reg 2023/1773)
4. Quality certifications (EN 10204, ISO 14064-3)

IMPORTANT: In ~30% of narratives, insert a subtle discrepancy between the stated
carbon intensity and the energy source (e.g. coal-heavy grid but claiming low emissions,
or BF-BOF route with EAF-level numbers). This tests auditor detection of carbon leakage.
"""

JUDGE_SYSTEM_PROMPT = (
    "You are a CBAM regulatory compliance auditor. "
    "Score the provided synthetic CBAM filing on a scale of 0.0 to 1.0, where "
    "1.0 = perfect regulatory fidelity. Return ONLY a JSON object: "
    '{"score": <float>, "reason": "<one sentence>"}'
)

JUDGE_PROMPT_TEMPLATE = """\
Evaluate this synthetic CBAM filing:

Installation: {installation_id} | Country: {origin_country}
Sector: {sector} | CN Code: {cn_code}
Production route: {production_method}
Direct emissions: {direct} tCO2e/t | Indirect: {indirect} tCO2e/t
Energy source: {energy}
Uses default values: {defaults}
Verifier: {verifier}
Verification method: {method}
Anomaly injected: {anomaly_type} ({anomaly_severity})
MTC narrative excerpt: {narrative_excerpt}

Score on:
(1) Emission data consistency with production route
(2) Carbon leakage signature verifiable per EU 2023/956 + 2025/2547
(3) Technical language realism (EN 10204 / ISO 14064 style)
(4) CN code matches declared sector

Return ONLY: {{"score": <0.0-1.0>, "reason": "<one sentence>"}}
"""


async def generate_mtc_narrative(client: AsyncOpenAI, model: str, rec: dict, dry_run: bool) -> str:
    if dry_run:
        return (
            f"[DRY-RUN MTC] Installation {rec['installation_id']} | "
            f"Route: {rec['production_method']} | "
            f"Emissions: {rec['embedded_emissions_direct']} tCO2e/t"
        )

    prompt = MTC_PROMPT_TEMPLATE.format(
        installation_id=rec["installation_id"],
        country_name=rec["country_name"],
        origin_country=rec["origin_country"],
        production_method=rec["production_method"],
        sector=rec["sector"],
        cn_code=rec["cn_code"],
        qty=rec["import_quantity_tonnes"],
        direct=rec["embedded_emissions_direct"],
        energy=rec["energy_source_primary"],
        precursors=rec["precursor_materials"],
    )

    for attempt in range(3):
        try:
            resp = await client.chat.completions.create(
                model=model,
                messages=[
                    {"role": "system", "content": MTC_SYSTEM_PROMPT},
                    {"role": "user", "content": prompt},
                ],
                max_tokens=512,
                temperature=0.7,
            )
            return resp.choices[0].message.content.strip()
        except Exception as exc:
            if attempt == 2:
                return f"[MTC generation failed after 3 attempts: {exc}]"
            await asyncio.sleep(2 ** attempt)

    return "[MTC generation failed]"


async def judge_record(
    client: AsyncOpenAI, model: str, rec: dict, dry_run: bool
) -> tuple[float, str]:
    if dry_run:
        return 0.97, "dry-run pass"

    narrative_excerpt = rec.get("mtc_narrative", "")[:300]
    prompt = JUDGE_PROMPT_TEMPLATE.format(
        installation_id=rec["installation_id"],
        origin_country=rec["origin_country"],
        sector=rec["sector"],
        cn_code=rec["cn_code"],
        production_method=rec["production_method"],
        direct=rec["embedded_emissions_direct"],
        indirect=rec["embedded_emissions_indirect"],
        energy=rec["energy_source_primary"],
        defaults=rec["uses_default_values"],
        verifier=rec.get("verifier_accreditation", ""),
        method=rec.get("verification_methodology", ""),
        anomaly_type=rec["anomaly_type"],
        anomaly_severity=rec["anomaly_severity"],
        narrative_excerpt=narrative_excerpt,
    )

    for attempt in range(3):
        try:
            resp = await client.chat.completions.create(
                model=model,
                messages=[
                    {"role": "system", "content": JUDGE_SYSTEM_PROMPT},
                    {"role": "user", "content": prompt},
                ],
                max_tokens=128,
                temperature=0.1,
            )
            raw = resp.choices[0].message.content.strip()
            parsed = json.loads(raw)
            return float(parsed["score"]), parsed.get("reason", "")
        except json.JSONDecodeError:
            # Try to extract score from raw text
            import re
            m = re.search(r'"score"\s*:\s*([0-9.]+)', raw if "raw" in dir() else "")
            if m:
                return float(m.group(1)), "parsed from malformed JSON"
            if attempt == 2:
                return 0.0, f"judge parse failed: {raw[:100]}"
        except Exception as exc:
            if attempt == 2:
                return 0.0, f"judge API error: {exc}"
        await asyncio.sleep(2 ** attempt)

    return 0.0, "judge failed after 3 attempts"


# ---------------------------------------------------------------------------
# DETERMINISTIC VALIDATOR
# ---------------------------------------------------------------------------

# Physical upper bounds per sector (tCO2e/t or tCO2e/MWh)
SECTOR_EMISSION_MAX = {
    "steel": 4.0,
    "aluminium": 22.0,
    "cement": 1.2,
    "fertilizers": 15.0,
    "hydrogen": 15.0,
    "electricity": 1.5,
}

def deterministic_validate(rec: dict) -> tuple[bool, str]:
    """Fast rule-check before sending to LLM judge."""
    sector = rec["sector"]
    direct = rec["embedded_emissions_direct"]
    sector_max = SECTOR_EMISSION_MAX.get(sector, 25.0)

    if direct < 0:
        return False, "negative direct emission"
    if direct > sector_max:
        return False, f"direct emission {direct} exceeds physical max {sector_max} for {sector}"
    if rec["import_quantity_tonnes"] <= 0:
        return False, "non-positive import quantity"
    if rec["cn_code"] == "UNKNOWN":
        return False, "unknown CN code"

    # Anomalous records are expected to fail bounds — that is intentional
    # (they're used for agent stress-testing, not for "clean" training).
    # Mark them as deterministic pass so they are included in output.
    return True, "ok"


# ---------------------------------------------------------------------------
# CHECKPOINT
# ---------------------------------------------------------------------------

def save_checkpoint(records: list[dict], path: Path) -> None:
    with open(path, "w", encoding="utf-8") as fh:
        for rec in records:
            fh.write(json.dumps(rec, ensure_ascii=False) + "\n")


def load_checkpoint(path: Path) -> list[dict]:
    if not path.exists():
        return []
    records = []
    with open(path, encoding="utf-8") as fh:
        for line in fh:
            line = line.strip()
            if line:
                records.append(json.loads(line))
    return records


# ---------------------------------------------------------------------------
# MAIN PIPELINE
# ---------------------------------------------------------------------------

async def run(
    *,
    target_records: int,
    dry_run: bool,
    skip_llm_judge: bool,
    output_dir: Path,
    generation_model: str,
    judge_model: str,
    concurrency: int,
    min_judge_score: float,
) -> None:
    output_dir.mkdir(parents=True, exist_ok=True)
    checkpoint_path = output_dir / "cbam-1k-ncc-v1-checkpoint.jsonl"
    output_jsonl = output_dir / "cbam-1k-ncc-v1.jsonl"
    output_csv = output_dir / "cbam-1k-ncc-v1.csv"

    # Resume from checkpoint
    validated: list[dict] = load_checkpoint(checkpoint_path)
    already_done = len(validated)
    if already_done:
        print(f"Resuming from checkpoint: {already_done} records already validated.")

    scw_key = os.environ.get("SCW_SECRET_KEY", "")
    if not scw_key and not dry_run:
        sys.exit("SCW_SECRET_KEY env var is required (or use --dry-run)")

    client = AsyncOpenAI(
        api_key=scw_key or "dry-run",
        base_url="https://api.scaleway.ai/v1",
    )

    sem = asyncio.Semaphore(concurrency)
    generated = already_done
    rejected = 0
    start_time = time.monotonic()

    async def process_one() -> Optional[dict]:
        nonlocal rejected
        anomaly_type = weighted_choice(ANOMALY_TYPES)
        anomaly_severity = weighted_choice(ANOMALY_SEVERITIES)
        # Sync severity with anomaly_type
        if anomaly_type == "none":
            anomaly_severity = "none"

        rec = build_record_fields(anomaly_type, anomaly_severity)
        rec["verifier_accreditation"] = weighted_choice(VERIFIERS)
        rec["verification_methodology"] = weighted_choice(VERIFICATION_METHODS)

        det_pass, det_reason = deterministic_validate(rec)
        if not det_pass:
            rejected += 1
            return None

        async with sem:
            narrative = await generate_mtc_narrative(client, generation_model, rec, dry_run)
            rec["mtc_narrative"] = narrative

            if skip_llm_judge:
                judge_score, judge_reason = 1.0, "skipped"
                judge_pass = True
            else:
                judge_score, judge_reason = await judge_record(client, judge_model, rec, dry_run)
                judge_pass = judge_score >= min_judge_score

        if not judge_pass:
            rejected += 1
            return None

        import datetime
        rec["judge_score"] = judge_score
        rec["judge_pass"] = judge_pass
        rec["record_id"] = str(uuid.uuid4())
        rec["generated_at"] = datetime.datetime.utcnow().isoformat() + "Z"
        return rec

    bar = tqdm(total=target_records, initial=already_done, unit="rec", desc="Generating")

    while generated < target_records:
        batch_size = min(concurrency * 2, target_records - generated)
        tasks = [asyncio.create_task(process_one()) for _ in range(batch_size)]
        results = await asyncio.gather(*tasks)

        new_records = [r for r in results if r is not None]
        validated.extend(new_records)
        generated = len(validated)
        bar.update(len(new_records))

        if new_records:
            save_checkpoint(validated, checkpoint_path)

        elapsed = time.monotonic() - start_time
        rate = generated / elapsed if elapsed > 0 else 0
        eta = (target_records - generated) / rate if rate > 0 else float("inf")
        bar.set_postfix(rejected=rejected, rate=f"{rate:.1f}/s", eta=f"{eta:.0f}s")

    bar.close()

    # Final outputs
    print(f"\nWriting {output_jsonl} …")
    save_checkpoint(validated[:target_records], output_jsonl)

    print(f"Writing {output_csv} …")
    if validated:
        fieldnames = list(validated[0].keys())
        with open(output_csv, "w", newline="", encoding="utf-8") as fh:
            writer = csv.DictWriter(fh, fieldnames=fieldnames)
            writer.writeheader()
            for rec in validated[:target_records]:
                # Truncate MTC narrative for CSV readability
                row = dict(rec)
                row["mtc_narrative"] = rec.get("mtc_narrative", "")[:200]
                writer.writerow(row)

    elapsed_total = time.monotonic() - start_time
    print(f"\nDone. {generated} records in {elapsed_total/60:.1f} min "
          f"({rejected} rejected). "
          f"Checkpoint: {checkpoint_path}")

    # Sector distribution summary
    from collections import Counter
    sectors = Counter(r["sector"] for r in validated[:target_records])
    print("\nSector distribution:")
    for sector, count in sorted(sectors.items()):
        print(f"  {sector:15s} {count:4d}  ({count/target_records*100:.1f}%)")

    anomalies = Counter(r["anomaly_type"] for r in validated[:target_records])
    print("\nAnomaly distribution:")
    for atype, count in sorted(anomalies.items()):
        print(f"  {atype:45s} {count:4d}")


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------

def main() -> None:
    parser = argparse.ArgumentParser(
        description="Generate 1K synthetic CBAM records on Scaleway H100 for NCC V1 demo."
    )
    parser.add_argument("--records", type=int, default=1_000,
                        help="Target record count (default: 1000)")
    parser.add_argument("--dry-run", action="store_true",
                        help="Skip real LLM calls; use placeholder text")
    parser.add_argument("--skip-llm-judge", action="store_true",
                        help="Skip LLM-as-Judge (faster, cheaper; use for dev)")
    parser.add_argument("--output-dir", type=Path, default=Path("data"),
                        help="Output directory (default: data/)")
    parser.add_argument("--generation-model", default="llama-3.3-70b-instruct",
                        help="Scaleway model for MTC narrative generation")
    parser.add_argument("--judge-model", default="mistral-nemo-instruct-2407",
                        help="Scaleway model for LLM-as-Judge scoring")
    parser.add_argument("--concurrency", type=int, default=8,
                        help="Concurrent LLM requests (default: 8)")
    parser.add_argument("--min-judge-score", type=float, default=0.80,
                        help="Minimum judge score to accept a record (default: 0.80)")
    args = parser.parse_args()

    print("=" * 60)
    print("CBAM 1K Generator — NCC V1 Demo")
    print(f"  Target records    : {args.records}")
    print(f"  Dry run           : {args.dry_run}")
    print(f"  Skip LLM judge    : {args.skip_llm_judge}")
    print(f"  Output dir        : {args.output_dir}")
    print(f"  Generation model  : {args.generation_model}")
    print(f"  Judge model       : {args.judge_model}")
    print(f"  Concurrency       : {args.concurrency}")
    print(f"  Min judge score   : {args.min_judge_score}")
    print("=" * 60)

    asyncio.run(run(
        target_records=args.records,
        dry_run=args.dry_run,
        skip_llm_judge=args.skip_llm_judge,
        output_dir=args.output_dir,
        generation_model=args.generation_model,
        judge_model=args.judge_model,
        concurrency=args.concurrency,
        min_judge_score=args.min_judge_score,
    ))


if __name__ == "__main__":
    main()
