#!/usr/bin/env python3
"""
run_pipeline.py — Master orchestrator for the AI/DS Workflow Accelerator.

Runs all 4 pipeline stages in sequence, tracks timing, and produces a final summary.

Usage:
    python run_pipeline.py           # Full run (requires ANTHROPIC_API_KEY)
    python run_pipeline.py --dry-run # Offline demo (no API calls)
"""

import json
import subprocess
import sys
import time
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent
DRY_RUN = "--dry-run" in sys.argv

STAGES = [
    ("Data Ingestion", "workflow/01_ingest.py"),
    ("Clean + EDA", "workflow/02_clean_and_eda.py"),
    ("Model Training", "workflow/03_model_train.py"),
    ("AI Interpretation", "workflow/04_ai_interpreter.py"),
]

# Traditional cycle times for comparison (hours)
TRADITIONAL_TIMES = {
    "Data Ingestion": 24.0,
    "Clean + EDA": 16.0,
    "Model Training": 40.0,
    "AI Interpretation": 24.0,  # interpretation + communication + action tracking
}


def run_stage(name: str, script: str, stage_num: int, total: int) -> dict:
    """Run a pipeline stage and capture results."""
    script_path = PROJECT_ROOT / script
    if not script_path.exists():
        return {
            "name": name,
            "status": "MISSING",
            "time": 0,
            "output": f"File not found: {script_path}",
        }

    cmd = [sys.executable, str(script_path)]
    if DRY_RUN:
        cmd.append("--dry-run")

    print(f"\n{'=' * 60}")
    print(f"  Stage {stage_num}/{total}: {name}")
    print(f"  Script: {script}")
    print(f"{'=' * 60}\n")

    start = time.time()
    try:
        result = subprocess.run(
            cmd,
            capture_output=True,
            text=True,
            timeout=300,  # 5-minute timeout per stage
            cwd=str(PROJECT_ROOT),
        )
        elapsed = time.time() - start

        # Print stdout
        if result.stdout:
            print(result.stdout)

        if result.returncode != 0:
            print(f"STDERR:\n{result.stderr}")
            return {
                "name": name,
                "status": "FAILED",
                "time": round(elapsed, 2),
                "output": result.stderr[:500],
            }

        print(f"  >> Stage {stage_num}/{total} complete in {elapsed:.1f}s")
        return {
            "name": name,
            "status": "OK",
            "time": round(elapsed, 2),
            "output": "",
        }

    except subprocess.TimeoutExpired:
        elapsed = time.time() - start
        print(f"  >> Stage {stage_num}/{total} TIMED OUT after {elapsed:.0f}s")
        return {
            "name": name,
            "status": "TIMEOUT",
            "time": round(elapsed, 2),
            "output": "Exceeded 5min timeout",
        }
    except Exception as e:
        elapsed = time.time() - start
        print(f"  >> Stage {stage_num}/{total} ERROR: {e}")
        return {
            "name": name,
            "status": "ERROR",
            "time": round(elapsed, 2),
            "output": str(e),
        }


def print_summary(results: list, total_time: float) -> None:
    """Print final pipeline summary with ROI comparison."""
    print("\n" + "=" * 70)
    print("  PIPELINE SUMMARY")
    print("=" * 70)

    mode = "DRY RUN (no API calls)" if DRY_RUN else "FULL RUN"
    print(f"\n  Mode: {mode}")
    print(
        f"\n  {'Stage':<25s} {'Status':<10s} {'AI Time':>10s} {'Traditional':>12s} {'Savings':>10s}"
    )
    print(f"  {'-' * 25} {'-' * 10} {'-' * 10} {'-' * 12} {'-' * 10}")

    total_traditional_hours = 0
    for r in results:
        trad_hours = TRADITIONAL_TIMES.get(r["name"], 0)
        total_traditional_hours += trad_hours
        ai_time_str = f"{r['time']:.1f}s"
        trad_str = f"{trad_hours:.0f}h"
        if r["status"] == "OK" and trad_hours > 0:
            savings = (1 - r["time"] / (trad_hours * 3600)) * 100
            savings_str = f"{savings:.1f}%"
        else:
            savings_str = "N/A"
        status_icon = "OK" if r["status"] == "OK" else "FAIL"
        print(
            f"  {r['name']:<25s} {status_icon:<10s} {ai_time_str:>10s} {trad_str:>12s} {savings_str:>10s}"
        )

    print(f"  {'-' * 25} {'-' * 10} {'-' * 10} {'-' * 12} {'-' * 10}")
    total_ai_str = f"{total_time:.1f}s"
    total_trad_str = f"{total_traditional_hours:.0f}h"
    if total_time > 0:
        total_savings = (1 - total_time / (total_traditional_hours * 3600)) * 100
    else:
        total_savings = 0
    print(
        f"  {'TOTAL':<25s} {'':10s} {total_ai_str:>10s} {total_trad_str:>12s} {total_savings:.1f}%"
    )

    trad_weeks = total_traditional_hours / 40
    print(
        f"\n  Traditional cycle: ~{trad_weeks:.1f} weeks ({total_traditional_hours:.0f} hours)"
    )
    print(
        f"  AI-assisted cycle: {total_time:.1f} seconds ({total_time / 60:.1f} minutes)"
    )
    print(f"  Time savings: {total_savings:.1f}%")

    # Check for failures
    failures = [r for r in results if r["status"] != "OK"]
    if failures:
        print(f"\n  WARNING: {len(failures)} stage(s) failed:")
        for f in failures:
            print(f"    - {f['name']}: {f['status']} — {f['output'][:100]}")
    else:
        print(f"\n  All {len(results)} stages completed successfully.")

    print("=" * 70)


def save_run_report(results: list, total_time: float) -> None:
    """Save machine-readable run report."""
    report = {
        "mode": "dry_run" if DRY_RUN else "full",
        "timestamp": time.strftime("%Y-%m-%dT%H:%M:%S"),
        "total_time_seconds": round(total_time, 2),
        "traditional_time_hours": sum(TRADITIONAL_TIMES.values()),
        "stages": results,
        "all_passed": all(r["status"] == "OK" for r in results),
    }
    report_path = PROJECT_ROOT / "reports" / "pipeline_run.json"
    report_path.parent.mkdir(exist_ok=True)
    with open(report_path, "w") as f:
        json.dump(report, f, indent=2)
    print(f"\n  Run report saved to: {report_path}")


def main():
    print("=" * 70)
    print("  DWS IQ 6 — AI/DS Workflow Accelerator")
    print("  From raw data to boardroom decisions in <15 minutes")
    print("=" * 70)

    if DRY_RUN:
        print("\n  ** DRY RUN MODE — API calls will be skipped **\n")

    total_start = time.time()
    results = []

    for i, (name, script) in enumerate(STAGES, 1):
        result = run_stage(name, script, i, len(STAGES))
        results.append(result)

        # Stop on critical failure (stages are sequential dependencies)
        if result["status"] != "OK":
            print(f"\n  Pipeline halted: {name} failed.")
            # Still try remaining stages for partial results? No — dependencies are strict.
            break

    total_time = time.time() - total_start

    print_summary(results, total_time)
    save_run_report(results, total_time)

    # Exit code: 0 if all passed, 1 otherwise
    return 0 if all(r["status"] == "OK" for r in results) else 1


if __name__ == "__main__":
    sys.exit(main())
