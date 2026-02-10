#!/usr/bin/env python3
"""
DWS6 Supabase Advisor Alert Publisher — DEPRECATED WRAPPER

This script now delegates to db-drift-check.py --advisor.
Kept for backward compatibility only.

Preferred usage:
    python scripts/db-drift-check.py --advisor         # Advisor alerts only
    python scripts/db-drift-check.py --all             # Drift check + advisor
    python scripts/db-drift-check.py --dry-run         # Report only

Author: DWS IQ Team
Version: 2.0 (wrapper)
Date: 2026-02-10
"""

import sys
from pathlib import Path

# Import shared alert module
sys.path.insert(0, str(Path(__file__).resolve().parent))
from dws_alerts import run_advisor_check  # noqa: E402

if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser(
        description="DWS6 Supabase Advisor Alert Publisher (use db-drift-check.py --advisor instead)"
    )
    parser.add_argument("--dry-run", action="store_true", help="Report only, no Redis")
    parser.add_argument("--channel", default="supabase:alerts", help="Redis channel")
    args = parser.parse_args()

    print("[NOTE] This script is deprecated. Use: python scripts/db-drift-check.py --advisor")
    print()

    issues = run_advisor_check(channel=args.channel, dry_run=args.dry_run)
    sys.exit(1 if issues > 0 else 0)
