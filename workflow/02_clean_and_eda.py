#!/usr/bin/env python3
"""
02_clean_and_eda.py — Auto-detect and fix data quality issues, generate EDA visuals.

Fixes: nulls, outliers, wrong dtypes (all automated, no manual intervention).

Outputs:
- reports/figures/correlation_heatmap.png
- reports/figures/target_distribution.png
- reports/figures/feature_importance_preview.png
- EDA summary to stdout

Must complete in <90 seconds.
"""

import sys
import time
import warnings

import matplotlib
import numpy as np
import pandas as pd

matplotlib.use("Agg")  # Non-interactive backend
from pathlib import Path

import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.feature_selection import mutual_info_classif

warnings.filterwarnings("ignore", category=FutureWarning)

PROJECT_ROOT = Path(__file__).resolve().parent.parent
DATA_DIR = PROJECT_ROOT / "data"
FIGURES_DIR = PROJECT_ROOT / "reports" / "figures"
FIGURES_DIR.mkdir(parents=True, exist_ok=True)

NUMERIC_COLS = [
    "delivery_time_min",
    "fuel_cost_eur",
    "weather_delay_min",
    "route_efficiency_pct",
    "co2_kg",
]
TARGET_COL = "on_time"


def load_data() -> pd.DataFrame:
    path = DATA_DIR / "raw_dataset.csv"
    if not path.exists():
        print(f"ERROR: {path} not found. Run 01_ingest.py first.")
        sys.exit(1)
    return pd.read_csv(path)


def fix_dtypes(df: pd.DataFrame) -> pd.DataFrame:
    """Convert columns to correct dtypes, coercing errors to NaN."""
    df = df.copy()
    for col in NUMERIC_COLS:
        df[col] = pd.to_numeric(df[col], errors="coerce")
    df[TARGET_COL] = df[TARGET_COL].astype(bool)
    return df


def fix_outliers(df: pd.DataFrame) -> pd.DataFrame:
    """Cap outliers using IQR method (1.5× IQR fence)."""
    df = df.copy()
    for col in NUMERIC_COLS:
        q1 = df[col].quantile(0.25)
        q3 = df[col].quantile(0.75)
        iqr = q3 - q1
        lower = q1 - 1.5 * iqr
        upper = q3 + 1.5 * iqr
        outlier_mask = (df[col] < lower) | (df[col] > upper)
        n_outliers = outlier_mask.sum()
        if n_outliers > 0:
            df.loc[df[col] > upper, col] = upper
            df.loc[df[col] < lower, col] = lower
            print(
                f"  Fixed {n_outliers} outliers in {col} (capped to [{lower:.1f}, {upper:.1f}])"
            )
    return df


def fix_nulls(df: pd.DataFrame) -> pd.DataFrame:
    """Fill nulls with column median for numeric, mode for categorical."""
    df = df.copy()
    for col in NUMERIC_COLS:
        n_null = df[col].isna().sum()
        if n_null > 0:
            median_val = df[col].median()
            df[col] = df[col].fillna(median_val)
            print(f"  Filled {n_null} nulls in {col} with median={median_val:.2f}")
    return df


def eda_summary(df: pd.DataFrame) -> None:
    """Print EDA summary to stdout."""
    print("\n" + "=" * 60)
    print("EDA SUMMARY")
    print("=" * 60)
    print(f"Shape: {df.shape}")
    print("\nDtypes:")
    for col in df.columns:
        print(f"  {col}: {df[col].dtype}")
    print("\nNull counts (after cleaning):")
    for col in df.columns:
        print(f"  {col}: {df[col].isna().sum()}")
    print(f"\nTarget distribution ({TARGET_COL}):")
    counts = df[TARGET_COL].value_counts()
    for val, count in counts.items():
        print(f"  {val}: {count} ({count / len(df) * 100:.1f}%)")

    print("\nTop 5 correlations with target (point-biserial):")
    target_numeric = df[TARGET_COL].astype(int)
    corrs = {}
    for col in NUMERIC_COLS:
        corrs[col] = df[col].corr(target_numeric)
    sorted_corrs = sorted(corrs.items(), key=lambda x: abs(x[1]), reverse=True)
    for col, r in sorted_corrs[:5]:
        print(f"  {col}: {r:.4f}")
    print("=" * 60)


def plot_correlation_heatmap(df: pd.DataFrame) -> None:
    """Generate and save correlation heatmap."""
    fig, ax = plt.subplots(figsize=(8, 6))
    corr_df = df[NUMERIC_COLS + [TARGET_COL]].copy()
    corr_df[TARGET_COL] = corr_df[TARGET_COL].astype(int)
    corr_matrix = corr_df.corr()
    sns.heatmap(
        corr_matrix,
        annot=True,
        fmt=".2f",
        cmap="RdBu_r",
        center=0,
        vmin=-1,
        vmax=1,
        ax=ax,
    )
    ax.set_title("Feature Correlation Heatmap", fontsize=14, fontweight="bold")
    plt.tight_layout()
    path = FIGURES_DIR / "correlation_heatmap.png"
    fig.savefig(path, dpi=150)
    plt.close(fig)
    print(f"  Saved: {path}")


def plot_target_distribution(df: pd.DataFrame) -> None:
    """Generate and save target variable distribution plot."""
    fig, axes = plt.subplots(1, 2, figsize=(12, 5))

    # Bar chart of on_time
    counts = df[TARGET_COL].value_counts()
    colors = ["#2ecc71", "#e74c3c"]
    axes[0].bar(
        ["On Time", "Late"], [counts.get(True, 0), counts.get(False, 0)], color=colors
    )
    axes[0].set_title("Delivery Status Distribution", fontsize=12, fontweight="bold")
    axes[0].set_ylabel("Count")
    for i, (_label, val) in enumerate(
        zip(
            ["On Time", "Late"],
            [counts.get(True, 0), counts.get(False, 0)],
            strict=True,
        )
    ):
        axes[0].text(i, val + 5, str(val), ha="center", fontweight="bold")

    # Distribution of delivery_time by on_time status
    for status, color, label in [
        (True, "#2ecc71", "On Time"),
        (False, "#e74c3c", "Late"),
    ]:
        subset = df[df[TARGET_COL] == status]["delivery_time_min"]
        axes[1].hist(subset, bins=25, alpha=0.6, color=color, label=label)
    axes[1].set_title("Delivery Time by Status", fontsize=12, fontweight="bold")
    axes[1].set_xlabel("Delivery Time (min)")
    axes[1].set_ylabel("Count")
    axes[1].legend()

    plt.tight_layout()
    path = FIGURES_DIR / "target_distribution.png"
    fig.savefig(path, dpi=150)
    plt.close(fig)
    print(f"  Saved: {path}")


def plot_feature_importance(df: pd.DataFrame) -> None:
    """Generate feature importance preview using mutual information."""
    X = df[NUMERIC_COLS].values
    y = df[TARGET_COL].astype(int).values

    mi_scores = mutual_info_classif(X, y, random_state=42)
    importance = pd.Series(mi_scores, index=NUMERIC_COLS).sort_values(ascending=True)

    fig, ax = plt.subplots(figsize=(8, 5))
    colors = plt.cm.viridis(np.linspace(0.3, 0.9, len(importance)))
    importance.plot(kind="barh", ax=ax, color=colors)
    ax.set_title(
        "Feature Importance (Mutual Information)", fontsize=14, fontweight="bold"
    )
    ax.set_xlabel("Mutual Information Score")
    plt.tight_layout()
    path = FIGURES_DIR / "feature_importance_preview.png"
    fig.savefig(path, dpi=150)
    plt.close(fig)
    print(f"  Saved: {path}")


def main():
    start = time.time()

    print("Loading raw dataset...")
    df = load_data()
    print(f"Loaded {len(df)} rows\n")

    print("Step 1: Fixing dtypes...")
    df = fix_dtypes(df)

    print("\nStep 2: Fixing outliers...")
    df = fix_outliers(df)

    print("\nStep 3: Filling nulls...")
    df = fix_nulls(df)

    # Save cleaned dataset
    clean_path = DATA_DIR / "cleaned_dataset.csv"
    df.to_csv(clean_path, index=False)
    print(f"\nCleaned dataset saved to: {clean_path}")

    eda_summary(df)

    print("\nGenerating visualizations...")
    plot_correlation_heatmap(df)
    plot_target_distribution(df)
    plot_feature_importance(df)

    elapsed = time.time() - start
    print(f"\nCompleted in {elapsed:.1f}s")

    return 0


if __name__ == "__main__":
    sys.exit(main())
