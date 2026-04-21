#!/usr/bin/env python3
"""
01_ingest.py — Generate realistic synthetic logistics/construction dataset.

Produces 500 rows with deliberate data quality issues:
- 8% nulls across various columns
- 2 extreme outliers
- 1 wrong dtype (string in numeric column)

Output: data/raw_dataset.csv + quality report to stdout
"""

import sys
from pathlib import Path

import numpy as np
import pandas as pd

# Ensure we can run from any directory
PROJECT_ROOT = Path(__file__).resolve().parent.parent
DATA_DIR = PROJECT_ROOT / "data"
DATA_DIR.mkdir(exist_ok=True)

SEED = 42
N_ROWS = 500


def generate_base_data(n: int, rng: np.random.Generator) -> pd.DataFrame:
    """Generate clean base dataset for logistics/construction domain."""
    delivery_time = rng.normal(loc=45, scale=12, size=n).clip(10, 120)  # minutes
    fuel_cost = rng.normal(loc=28, scale=8, size=n).clip(5, 80)  # EUR
    weather_delay = rng.exponential(scale=5, size=n).clip(0, 60)  # minutes
    route_efficiency = rng.beta(a=5, b=2, size=n) * 100  # percentage 0-100
    co2_kg = (
        fuel_cost * 0.35 + delivery_time * 0.08 + rng.normal(0, 1.5, size=n)
    ).clip(1, 50)  # kg CO2
    # on_time if delivery_time < 50 and weather_delay < 10, with noise
    on_time_prob = 1 / (
        1 + np.exp(0.05 * (delivery_time - 50) + 0.1 * (weather_delay - 10))
    )
    on_time_bool = rng.binomial(1, on_time_prob).astype(bool)

    return pd.DataFrame(
        {
            "delivery_time_min": np.round(delivery_time, 1),
            "fuel_cost_eur": np.round(fuel_cost, 2),
            "weather_delay_min": np.round(weather_delay, 1),
            "route_efficiency_pct": np.round(route_efficiency, 1),
            "co2_kg": np.round(co2_kg, 2),
            "on_time": on_time_bool,
        }
    )


def inject_quality_issues(df: pd.DataFrame, rng: np.random.Generator) -> pd.DataFrame:
    """Inject deliberate data quality issues for the cleaning step to fix."""
    df = df.copy()
    n = len(df)

    # 1. Inject ~8% nulls across numeric columns
    null_cols = [
        "delivery_time_min",
        "fuel_cost_eur",
        "weather_delay_min",
        "route_efficiency_pct",
        "co2_kg",
    ]
    total_nulls_target = int(n * len(null_cols) * 0.08)
    null_positions = rng.choice(
        n * len(null_cols), size=total_nulls_target, replace=False
    )
    for pos in null_positions:
        row = pos % n
        col = null_cols[pos // n] if pos // n < len(null_cols) else null_cols[-1]
        df.at[row, col] = np.nan

    # 2. Inject 2 extreme outliers
    df.at[42, "fuel_cost_eur"] = 999.99  # Impossible fuel cost
    df.at[314, "delivery_time_min"] = 720.0  # 12 hours — clearly wrong

    # 3. Inject 1 wrong dtype: string in numeric column
    df["co2_kg"] = df["co2_kg"].astype(object)
    df.at[100, "co2_kg"] = "not_a_number"

    return df


def quality_report(df: pd.DataFrame) -> None:
    """Print data quality report to stdout."""
    print("=" * 60)
    print("DATA QUALITY REPORT")
    print("=" * 60)
    print(f"Shape: {df.shape[0]} rows × {df.shape[1]} columns")
    print(f"\nColumns: {list(df.columns)}")
    print("\nDtypes:")
    for col in df.columns:
        print(f"  {col}: {df[col].dtype}")

    print("\nNull counts:")
    nulls = df.isnull().sum()
    for col, count in nulls.items():
        pct = count / len(df) * 100
        marker = " ⚠" if count > 0 else ""
        print(f"  {col}: {count} ({pct:.1f}%){marker}")

    total_nulls = nulls.sum()
    total_cells = df.shape[0] * df.shape[1]
    print(
        f"\nTotal nulls: {total_nulls}/{total_cells} ({total_nulls / total_cells * 100:.1f}%)"
    )

    # Check for non-numeric values in expected-numeric columns
    for col in [
        "delivery_time_min",
        "fuel_cost_eur",
        "weather_delay_min",
        "route_efficiency_pct",
        "co2_kg",
    ]:
        non_numeric = 0
        for val in df[col].dropna():
            try:
                float(val)
            except (ValueError, TypeError):
                non_numeric += 1
        if non_numeric > 0:
            print(f"  ⚠ {col}: {non_numeric} non-numeric values detected")

    print("=" * 60)


def main():
    rng = np.random.default_rng(SEED)

    print("Generating synthetic logistics/construction dataset...")
    df = generate_base_data(N_ROWS, rng)
    df = inject_quality_issues(df, rng)

    output_path = DATA_DIR / "raw_dataset.csv"
    df.to_csv(output_path, index=False)
    print(f"Dataset saved to: {output_path}")
    print(f"Rows: {N_ROWS}, Columns: {df.shape[1]}\n")

    quality_report(df)

    return 0


if __name__ == "__main__":
    sys.exit(main())
