#!/usr/bin/env python3
"""
DWS6 Supabase Advisor Alert Publisher

Checks Supabase Performance Advisor (via Management API) and publishes
critical findings to Redis supabase:alerts channel.

Can be run manually, via cron, or as a health check in Docker.

Usage:
    python scripts/alert-publisher.py                    # Check and publish
    python scripts/alert-publisher.py --dry-run          # Check only, no Redis
    python scripts/alert-publisher.py --channel mcp:alerts  # Custom channel

Requires:
    pip install httpx redis python-dotenv

Environment:
    SUPABASE_ACCESS_TOKEN  - Personal access token from supabase.com/dashboard/account/tokens
    SUPABASE_PROJECT_REF   - Project reference ID (e.g., kpucuwwfhuwurdxyjjtz)
    REDIS_HOST             - Redis hostname (default: localhost)
    REDIS_PORT             - Redis port (default: 6380)

Author: DWS IQ Team
Version: 1.0
Date: 2026-02-09
"""

import argparse
import json
import os
import sys
from datetime import datetime, timezone

try:
    import httpx
except ImportError:
    print("ERROR: httpx not installed. Run: pip install httpx")
    sys.exit(1)

try:
    import redis as redis_lib
except ImportError:
    redis_lib = None
    print("WARNING: redis not installed. Alerts will not be published.")

try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass


# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------

SUPABASE_ACCESS_TOKEN = os.getenv("SUPABASE_ACCESS_TOKEN", "")
SUPABASE_PROJECT_REF = os.getenv("SUPABASE_PROJECT_REF", "kpucuwwfhuwurdxyjjtz")
REDIS_HOST = os.getenv("REDIS_HOST", "localhost")
REDIS_PORT = int(os.getenv("REDIS_PORT", "6380"))

MANAGEMENT_API = "https://api.supabase.com/v1"


# ---------------------------------------------------------------------------
# Supabase Management API
# ---------------------------------------------------------------------------

def get_advisor_lint() -> list[dict]:
    """Fetch Performance Advisor lint results from Supabase Management API."""
    if not SUPABASE_ACCESS_TOKEN:
        print("[ERROR] SUPABASE_ACCESS_TOKEN not set.")
        print("  Get one from: https://supabase.com/dashboard/account/tokens")
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
        elif resp.status_code == 401:
            print("[ERROR] Invalid SUPABASE_ACCESS_TOKEN. Regenerate at supabase.com/dashboard/account/tokens")
            return []
        else:
            print(f"[ERROR] Supabase API returned {resp.status_code}: {resp.text[:200]}")
            return []
    except Exception as e:
        print(f"[ERROR] Failed to reach Supabase Management API: {e}")
        return []


def get_project_health() -> dict:
    """Fetch basic project health from Supabase Management API."""
    if not SUPABASE_ACCESS_TOKEN:
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


# ---------------------------------------------------------------------------
# Alert publishing
# ---------------------------------------------------------------------------

def publish_alert(channel: str, severity: str, title: str, message: str,
                  details: dict, dry_run: bool = False):
    """Publish alert to Redis channel."""
    alert = {
        "source": "supabase-advisor",
        "severity": severity,
        "title": title,
        "message": message,
        "details": details,
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }

    if dry_run:
        print(f"  [DRY-RUN] Would publish to {channel}:")
        print(f"    {json.dumps(alert, indent=2)[:300]}")
        return

    if redis_lib is None:
        print(f"  [SKIP] Redis not available")
        return

    try:
        r = redis_lib.Redis(host=REDIS_HOST, port=REDIS_PORT, decode_responses=True)
        r.publish(channel, json.dumps(alert))
        # Also store as pending for Claude Code session startup
        r.lpush("dws:alerts:pending", json.dumps(alert))
        r.ltrim("dws:alerts:pending", 0, 99)
        print(f"  [PUBLISHED] {severity}: {title} -> {channel}")
    except Exception as e:
        print(f"  [ERROR] Failed to publish: {e}")


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main():
    parser = argparse.ArgumentParser(description="DWS6 Supabase Advisor Alert Publisher")
    parser.add_argument("--dry-run", action="store_true", help="Report only, no Redis")
    parser.add_argument("--channel", default="supabase:alerts", help="Redis channel (default: supabase:alerts)")
    args = parser.parse_args()

    print("=" * 60)
    print("  DWS6 Supabase Advisor Alert Publisher")
    print("=" * 60)
    print(f"  Project: {SUPABASE_PROJECT_REF}")
    print(f"  Redis:   {REDIS_HOST}:{REDIS_PORT}")
    print(f"  Channel: {args.channel}")
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
        return

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
            channel=args.channel,
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
            dry_run=args.dry_run,
        )

    if warnings:
        publish_alert(
            channel=args.channel,
            severity="WARNING",
            title=f"{len(warnings)} Supabase Performance Advisor warnings",
            message="; ".join(r.get("title", "Unknown") for r in warnings[:5]),
            details={
                "advisory_count": len(warnings),
                "first_5": [r.get("title", "") for r in warnings[:5]],
            },
            dry_run=args.dry_run,
        )

    # Summary
    print(f"\n{'=' * 60}")
    if critical:
        print(f"  RESULT: {len(critical)} CRITICAL issues require attention!")
    elif warnings:
        print(f"  RESULT: {len(warnings)} warnings. No critical issues.")
    else:
        print(f"  RESULT: All clear. No significant advisories.")
    print(f"{'=' * 60}")


if __name__ == "__main__":
    main()
