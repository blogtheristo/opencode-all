"""
DWS6 Alert Publishing Module

Shared alert publishing logic used by db-drift-check.py and other scripts.
Single source of truth for Redis alert publishing and Supabase advisor queries.

Do NOT run this file directly. Use db-drift-check.py as the entrypoint:
    python scripts/db-drift-check.py              # Drift check + advisor alerts
    python scripts/db-drift-check.py --advisor     # Advisor alerts only
    python scripts/db-drift-check.py --dry-run     # Report only, no Redis

Author: DWS IQ Team
Version: 1.0
Date: 2026-02-10
"""

import json
import os
import sys
from datetime import UTC, datetime

try:
    import httpx
except ImportError:
    httpx = None

try:
    import redis as redis_lib
except ImportError:
    redis_lib = None


# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------

REDIS_HOST = os.getenv("REDIS_HOST", "localhost")
REDIS_PORT = int(os.getenv("REDIS_PORT", "6380"))
REDIS_CHANNEL = "supabase:alerts"

SUPABASE_ACCESS_TOKEN = os.getenv("SUPABASE_ACCESS_TOKEN", "")
SUPABASE_PROJECT_REF = os.getenv("SUPABASE_PROJECT_REF", "")
MANAGEMENT_API = "https://api.supabase.com/v1"


# ---------------------------------------------------------------------------
# Alert publishing (single source of truth)
# ---------------------------------------------------------------------------

def publish_alert(severity: str, title: str, message: str, details: dict,
                  channel: str = REDIS_CHANNEL, source: str = "db-drift-check",
                  dry_run: bool = False) -> dict:
    """Publish alert to Redis channel and pending list.

    Returns the alert dict regardless of publish success.
    """
    alert = {
        "source": source,
        "severity": severity,
        "title": title,
        "message": message,
        "details": details,
        "timestamp": datetime.now(UTC).isoformat(),
    }

    if dry_run:
        print(f"  [DRY-RUN] Would publish to {channel}:")
        print(f"    {json.dumps(alert, indent=2)[:300]}")
        return alert

    if redis_lib is None:
        print("  [SKIP] Redis not available")
        return alert

    try:
        r = redis_lib.Redis(host=REDIS_HOST, port=REDIS_PORT, decode_responses=True)
        r.publish(channel, json.dumps(alert))
        # Store as pending for Claude Code session startup
        r.lpush("dws:alerts:pending", json.dumps(alert))
        r.ltrim("dws:alerts:pending", 0, 99)  # Keep last 100 alerts
        print(f"  [PUBLISHED] {severity}: {title} -> {channel}")
    except Exception as e:
        print(f"  [ERROR] Failed to publish alert: {e}")

    return alert


# ---------------------------------------------------------------------------
# Supabase Management API — Performance Advisor
# ---------------------------------------------------------------------------

def get_advisor_lint() -> list[dict]:
    """Fetch Performance Advisor lint results from Supabase Management API."""
    if httpx is None:
        print("[ERROR] httpx not installed. Run: pip install httpx")
        return []

    if not SUPABASE_ACCESS_TOKEN:
        print("[ERROR] SUPABASE_ACCESS_TOKEN not set.")
        print("  Get one from: https://supabase.com/dashboard/account/tokens")
        return []

    if not SUPABASE_PROJECT_REF:
        print("[ERROR] SUPABASE_PROJECT_REF not set.")
        print("  Set it to your Supabase project ref (e.g. export SUPABASE_PROJECT_REF=abcxyz123)")
        return []

    url = f"{MANAGEMENT_API}/projects/{SUPABASE_PROJECT_REF}/database/lint"
    headers = {
        "Authorization": f"Bearer {SUPABASE_ACCESS_TOKEN}",
        "Content-Type": "application/json",
    }

    try:
        resp = httpx.get(url, headers=headers, timeout=15)
        if resp.status_code == 200:
            return resp.json()
        if resp.status_code == 401:
            print("[ERROR] Invalid SUPABASE_ACCESS_TOKEN. Regenerate at supabase.com/dashboard/account/tokens")
            return []
        print(f"[ERROR] Supabase API returned {resp.status_code}: {resp.text[:200]}")
        return []
    except Exception as e:
        print(f"[ERROR] Failed to reach Supabase Management API: {e}")
        return []


def get_project_health() -> dict:
    """Fetch basic project health from Supabase Management API."""
    if httpx is None or not SUPABASE_ACCESS_TOKEN or not SUPABASE_PROJECT_REF:
        return {}

    url = f"{MANAGEMENT_API}/projects/{SUPABASE_PROJECT_REF}"
    headers = {
        "Authorization": f"Bearer {SUPABASE_ACCESS_TOKEN}",
    }

    try:
        resp = httpx.get(url, headers=headers, timeout=15)
        if resp.status_code == 200:
            data = resp.json()
            return {
                "name": data.get("name", ""),
                "status": data.get("status", ""),
                "region": data.get("region", ""),
                "database_host": data.get("database", {}).get("host", ""),
            }
    except Exception:
        pass
    return {}


def run_advisor_check(channel: str = REDIS_CHANNEL, dry_run: bool = False) -> int:
    """Run Supabase Performance Advisor check and publish alerts.

    Returns the number of issues found.
    Exits with code 1 if required environment variables are not set.
    """
    if not SUPABASE_PROJECT_REF:
        print("[ERROR] SUPABASE_PROJECT_REF is not set.")
        print("  Set it to your Supabase project reference ID:")
        print("    export SUPABASE_PROJECT_REF=your-project-ref")
        print("  Find it at: https://supabase.com/dashboard/project/_/settings/general")
        sys.exit(1)

    print("=" * 60)
    print("  Supabase Performance Advisor Check")
    print("=" * 60)
    print(f"  Project: {SUPABASE_PROJECT_REF}")
    print(f"  Redis:   {REDIS_HOST}:{REDIS_PORT}")
    print(f"  Channel: {channel}")
    print()

    # 1. Get project health
    health = get_project_health()
    if health:
        print(f"[INFO] Project: {health.get('name', 'unknown')} ({health.get('status', 'unknown')})")
        print(f"[INFO] Region:  {health.get('region', 'unknown')}")
    else:
        print("[WARNING] Could not fetch project health")

    # 2. Get Performance Advisor lint results
    lint_results = get_advisor_lint()

    if not lint_results:
        print("\n[INFO] No advisor lint results (or could not fetch)")
        print("  This could mean:")
        print("  1. SUPABASE_ACCESS_TOKEN not set or expired")
        print("  2. No lint issues exist (good!)")
        print("  3. API endpoint changed")
        return 0

    # 3. Categorize by severity
    critical = [r for r in lint_results if r.get("level", "").upper() in ("ERROR", "CRITICAL")]
    warnings = [r for r in lint_results if r.get("level", "").upper() in ("WARN", "WARNING")]
    info = [r for r in lint_results if r.get("level", "").upper() == "INFO"]

    print(f"\n[RESULTS] {len(lint_results)} total advisories:")
    print(f"  Critical: {len(critical)}")
    print(f"  Warning:  {len(warnings)}")
    print(f"  Info:     {len(info)}")

    # 4. Print details
    for r in critical:
        print(f"\n  [CRITICAL] {r.get('title', 'Unknown')}")
        print(f"    {r.get('description', '')[:200]}")
        if r.get("detail"):
            print(f"    Detail: {r['detail'][:200]}")

    for r in warnings:
        print(f"\n  [WARNING] {r.get('title', 'Unknown')}")
        print(f"    {r.get('description', '')[:200]}")

    # 5. Publish alerts
    if critical:
        publish_alert(
            severity="CRITICAL",
            title=f"{len(critical)} critical Supabase Performance Advisor issues",
            message="; ".join(r.get("title", "Unknown") for r in critical),
            details={
                "advisories": [
                    {
                        "title": r.get("title", ""),
                        "description": r.get("description", "")[:300],
                        "level": r.get("level", ""),
                        "categories": r.get("categories", []),
                    }
                    for r in critical
                ],
            },
            channel=channel,
            source="supabase-advisor",
            dry_run=dry_run,
        )

    if warnings:
        publish_alert(
            severity="WARNING",
            title=f"{len(warnings)} Supabase Performance Advisor warnings",
            message="; ".join(r.get("title", "Unknown") for r in warnings[:5]),
            details={
                "advisory_count": len(warnings),
                "first_5": [r.get("title", "") for r in warnings[:5]],
            },
            channel=channel,
            source="supabase-advisor",
            dry_run=dry_run,
        )

    # Summary
    total = len(critical) + len(warnings)
    print(f"\n{'=' * 60}")
    if critical:
        print(f"  RESULT: {len(critical)} CRITICAL issues require attention!")
    elif warnings:
        print(f"  RESULT: {len(warnings)} warnings. No critical issues.")
    else:
        print("  RESULT: All clear. No significant advisories.")
    print(f"{'=' * 60}")

    return total
