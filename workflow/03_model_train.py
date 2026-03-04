#!/usr/bin/env python3
"""
03_model_train.py — Train and compare 3 classification models.

Models: LogisticRegression, RandomForest, GradientBoosting
Evaluation: 5-fold cross-validation, F1-score
Output: models/best_model.pkl, reports/metrics.json
"""

import json
import pickle
import sys
import time
import warnings
from pathlib import Path

import pandas as pd
from sklearn.ensemble import GradientBoostingClassifier, RandomForestClassifier
from sklearn.inspection import permutation_importance
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import cross_val_score
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler

warnings.filterwarnings("ignore", category=FutureWarning)

PROJECT_ROOT = Path(__file__).resolve().parent.parent
DATA_DIR = PROJECT_ROOT / "data"
MODELS_DIR = PROJECT_ROOT / "models"
REPORTS_DIR = PROJECT_ROOT / "reports"
MODELS_DIR.mkdir(exist_ok=True)
REPORTS_DIR.mkdir(exist_ok=True)

FEATURE_COLS = [
    "delivery_time_min",
    "fuel_cost_eur",
    "weather_delay_min",
    "route_efficiency_pct",
    "co2_kg",
]
TARGET_COL = "on_time"


def load_clean_data() -> tuple[pd.DataFrame, pd.Series]:
    path = DATA_DIR / "cleaned_dataset.csv"
    if not path.exists():
        print(f"ERROR: {path} not found. Run 02_clean_and_eda.py first.")
        sys.exit(1)
    df = pd.read_csv(path)
    X = df[FEATURE_COLS]
    y = df[TARGET_COL].astype(int)
    return X, y


def build_models() -> dict:
    """Return dict of model_name -> sklearn Pipeline."""
    return {
        "LogisticRegression": Pipeline(
            [
                ("scaler", StandardScaler()),
                ("clf", LogisticRegression(max_iter=1000, random_state=42)),
            ]
        ),
        "RandomForest": Pipeline(
            [
                ("scaler", StandardScaler()),
                (
                    "clf",
                    RandomForestClassifier(
                        n_estimators=100, max_depth=10, random_state=42, n_jobs=-1
                    ),
                ),
            ]
        ),
        "GradientBoosting": Pipeline(
            [
                ("scaler", StandardScaler()),
                (
                    "clf",
                    GradientBoostingClassifier(
                        n_estimators=100,
                        max_depth=5,
                        learning_rate=0.1,
                        random_state=42,
                    ),
                ),
            ]
        ),
    }


def compute_feature_importances(model: Pipeline, x: pd.DataFrame, y: pd.Series) -> dict:
    """Extract feature importances from the best model."""
    clf = model.named_steps["clf"]

    # Use native feature_importances_ if available (tree models)
    if hasattr(clf, "feature_importances_"):
        importances = clf.feature_importances_
    else:
        # Fall back to permutation importance for linear models
        result = permutation_importance(model, x, y, n_repeats=10, random_state=42)
        importances = result.importances_mean

    return {
        col: round(float(imp), 4)
        for col, imp in zip(FEATURE_COLS, importances, strict=True)
    }


def main():
    start_total = time.time()

    print("Loading cleaned dataset...")
    X, y = load_clean_data()
    print(f"Features: {X.shape}, Target balance: {y.mean():.2%} positive\n")

    models = build_models()
    results = {}

    print("Training and evaluating models (5-fold CV):")
    print("-" * 55)

    for name, pipeline in models.items():
        t0 = time.time()
        scores = cross_val_score(pipeline, X, y, cv=5, scoring="f1", n_jobs=-1)
        elapsed = time.time() - t0
        mean_f1 = scores.mean()
        std_f1 = scores.std()
        results[name] = {
            "f1_mean": round(float(mean_f1), 4),
            "f1_std": round(float(std_f1), 4),
            "cv_scores": [round(float(s), 4) for s in scores],
            "train_time_seconds": round(elapsed, 2),
        }
        print(f"  {name:25s}  F1={mean_f1:.4f} ± {std_f1:.4f}  ({elapsed:.1f}s)")

    # Select best model
    best_name = max(results, key=lambda k: results[k]["f1_mean"])
    best_pipeline = models[best_name]

    # Retrain best model on full data
    best_pipeline.fit(X, y)
    feature_importances = compute_feature_importances(best_pipeline, X, y)

    # Sort features by importance
    sorted_features = sorted(
        feature_importances.items(), key=lambda x: x[1], reverse=True
    )

    print(
        f"\nBest model: {best_name} with F1={results[best_name]['f1_mean']:.4f}, "
        f"trained in {results[best_name]['train_time_seconds']}s"
    )
    print(f"\nFeature importances ({best_name}):")
    for feat, imp in sorted_features:
        bar = "█" * int(imp * 50)
        print(f"  {feat:25s}  {imp:.4f}  {bar}")

    # Save model
    model_path = MODELS_DIR / "best_model.pkl"
    with open(model_path, "wb") as f:
        pickle.dump(best_pipeline, f)
    print(f"\nModel saved to: {model_path}")

    # Save metrics
    metrics = {
        "best_model": best_name,
        "best_f1": results[best_name]["f1_mean"],
        "all_results": results,
        "feature_importances": feature_importances,
        "feature_ranking": [
            {"feature": f, "importance": i} for f, i in sorted_features
        ],
        "dataset_shape": {"rows": X.shape[0], "features": X.shape[1]},
        "target_balance": round(float(y.mean()), 4),
        "total_train_time_seconds": round(time.time() - start_total, 2),
    }
    metrics_path = REPORTS_DIR / "metrics.json"
    with open(metrics_path, "w") as f:
        json.dump(metrics, f, indent=2)
    print(f"Metrics saved to: {metrics_path}")

    total = time.time() - start_total
    print(f"\nTotal training pipeline: {total:.1f}s")

    return 0


if __name__ == "__main__":
    sys.exit(main())
