#!/usr/bin/env python3
"""
DWS6 Database Drift Detection — Single Entrypoint

Compares supabase/migrations/ files against live Supabase schema.
Publishes drift alerts to Redis channel supabase:alerts.
Also runs Supabase Performance Advisor checks (via --advisor flag).

This is the SINGLE ENTRYPOINT for all database health checks.
Alert publishing logic lives in dws_alerts.py (shared module).

Usage:
    python scripts/db-drift-check.py                  # Plan mode (detect drift)
    python scripts/db-drift-check.py --verify          # Verify mode (post-apply checks)
    python scripts/db-drift-check.py --advisor         # Supabase advisor alerts only
    python scripts/db-drift-check.py --all             # Drift check + advisor (full)
    python scripts/db-drift-check.py --dry-run         # Report only, no Redis publish

Requires:
    pip install httpx redis python-dotenv

Environment:
    SUPABASE_URL           - Supabase project URL
    SUPABASE_SERVICE_KEY   - Supabase service role key
    SUPABASE_ACCESS_TOKEN  - Personal access token (for --advisor)
    REDIS_HOST             - Redis hostname (default: localhost)
    REDIS_PORT             - Redis port (default: 6380)

Author: DWS IQ Team
Version: 2.0
Date: 2026-02-10
"""

import argparse
import hashlib
import json
import os
import re
import sys
from datetime import datetime, timezone
from pathlib import Path

try:
    import httpx
except ImportError:
    print("ERROR: httpx not installed. Run: pip install httpx")
    sys.exit(1)

try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

# Import shared alert module (single source of truth for publishing)
sys.path.insert(0, str(Path(__file__).resolve().parent))
from dws_alerts import publish_alert, run_advisor_check, REDIS_HOST, REDIS_PORT  # noqa: E402


# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------

SUPABASE_URL = os.getenv("SUPABASE_URL", "")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_KEY", "")
REDIS_CHANNEL = "supabase:alerts"

# Repo root — walk up from scripts/ to find supabase/migrations/
SCRIPT_DIR = Path(__file__).resolve().parent
REPO_ROOT = SCRIPT_DIR.parent
MIGRATIONS_DIR = REPO_ROOT / "supabase" / "migrations"


# ---------------------------------------------------------------------------
# Supabase REST helper
# ---------------------------------------------------------------------------

def get_live_tables() -> set[str]:
    """Get all user tables from live Supabase.

    Attempts:
      1. Docker/local Supabase MCP endpoint (local dev)
      2. Supabase PostgREST OpenAPI spec (requires SUPABASE_URL + SUPABASE_SERVICE_KEY)

    If SUPABASE_URL is set but enumeration fails, prints a clear error and returns
    an empty set (caller will skip live comparison and report the gap).
    If SUPABASE_URL is not set, prints a warning and returns an empty set.
    """
    # 1. Try Docker/local Supabase MCP endpoint (local development)
    try:
        resp = httpx.post(
            "http://localhost:8766/tools/query",
            json={
                "table": "information_schema.tables",
                "select": "table_name",
                "filters": {"table_schema": "public"},
                "limit": 500,
            },
            timeout=10,
        )
        if resp.status_code == 200:
            data = resp.json()
            if data.get("success") and data.get("data"):
                return {row["table_name"] for row in data["data"]}
    except Exception:
        pass

    # 2. Try Supabase PostgREST OpenAPI spec
    if SUPABASE_URL and SUPABASE_KEY:
        url = f"{SUPABASE_URL}/rest/v1/"
        headers = {
            "apikey": SUPABASE_KEY,
            "Authorization": f"Bearer {SUPABASE_KEY}",
            "Accept": "application/openapi+json",
        }
        try:
            resp = httpx.get(url, headers=headers, timeout=15)
            if resp.status_code == 200:
                data = resp.json()
                # OpenAPI spec has paths like /table_name and /rpc/func_name
                tables = set()
                for path in data.get("paths", {}).keys():
                    table = path.lstrip("/")
                    if table and not table.startswith("rpc/"):
                        tables.add(table)
                if tables:
                    return tables
                print("ERROR: Supabase REST returned an empty table list.")
                print("  Check that SUPABASE_SERVICE_KEY has service_role privileges.")
            else:
                print(f"ERROR: Supabase REST returned {resp.status_code}. Cannot enumerate live tables.")
                print(f"  URL: {SUPABASE_URL}")
        except Exception as e:
            print(f"ERROR: Failed to reach Supabase ({SUPABASE_URL}): {e}")

        print("  Live table comparison will be skipped.")
        return set()

    print("WARNING: SUPABASE_URL not set. Skipping live table comparison.")
    return set()


def get_migration_tables() -> dict[str, list[str]]:
    """Parse CREATE TABLE statements from migration files.
    Returns {table_name: [migration_files_that_reference_it]}."""
    tables: dict[str, list[str]] = {}

    if not MIGRATIONS_DIR.exists():
        print(f"ERROR: Migrations directory not found: {MIGRATIONS_DIR}")
        return tables

    for f in sorted(MIGRATIONS_DIR.glob("*.sql")):
        content = f.read_text(encoding="utf-8", errors="replace")
        # Match CREATE TABLE statements
        for match in re.finditer(
            r"CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?(?:public\.)?(\w+)",
            content,
            re.IGNORECASE,
        ):
            table_name = match.group(1).lower()
            tables.setdefault(table_name, []).append(f.name)

    return tables


def get_migration_files() -> list[dict]:
    """List all migration files with metadata."""
    files = []
    if not MIGRATIONS_DIR.exists():
        return files

    for f in sorted(MIGRATIONS_DIR.glob("*.sql")):
        content = f.read_bytes()
        files.append({
            "filename": f.name,
            "path": str(f),
            "size_bytes": len(content),
            "sha256": hashlib.sha256(content).hexdigest()[:16],
            "has_begin_commit": bool(
                re.search(r"\bBEGIN\b", content.decode("utf-8", errors="replace"), re.IGNORECASE)
                and re.search(r"\bCOMMIT\b", content.decode("utf-8", errors="replace"), re.IGNORECASE)
            ),
            "has_rls": bool(
                re.search(r"ENABLE\s+ROW\s+LEVEL\s+SECURITY", content.decode("utf-8", errors="replace"), re.IGNORECASE)
            ),
        })
    return files


# ---------------------------------------------------------------------------
# Plan mode — detect drift
# ---------------------------------------------------------------------------

def run_plan(dry_run: bool = False):
    """Plan phase: detect drift between repo and live DB."""
    print("=" * 60)
    print("  DWS6 Database Drift Check — Plan Phase")
    print("=" * 60)
    print(f"  Migrations dir: {MIGRATIONS_DIR}")
    print(f"  Supabase URL:   {SUPABASE_URL[:40]}..." if SUPABASE_URL else "  Supabase URL:   NOT SET")
    print(f"  Redis:          {REDIS_HOST}:{REDIS_PORT}")
    print()

    # 1. Parse migration files
    migration_files = get_migration_files()
    migration_tables = get_migration_tables()
    print(f"[INFO] Found {len(migration_files)} migration files")
    print(f"[INFO] Found {len(migration_tables)} tables defined in migrations")

    # 2. Check migration file safety
    unsafe_migrations = []
    no_rls_tables = []

    for mf in migration_files:
        if not mf["has_begin_commit"]:
            unsafe_migrations.append(mf["filename"])
            print(f"[WARNING] {mf['filename']}: Missing BEGIN/COMMIT wrapper")

    # Pre-scan all migration files once to find tables with RLS enabled
    rls_enabled_tables: set[str] = set()
    rls_pattern = re.compile(
        r"ALTER\s+TABLE\s+(?:public\.)?([A-Za-z0-9_]+)\s+ENABLE\s+ROW\s+LEVEL\s+SECURITY",
        re.IGNORECASE,
    )
    for f in sorted(MIGRATIONS_DIR.glob("*.sql")):
        content = f.read_text(encoding="utf-8", errors="replace")
        for match in rls_pattern.finditer(content):
            table_name = match.group(1)
            if table_name:
                rls_enabled_tables.add(table_name.lower())

    for table, files in migration_tables.items():
        if table not in rls_enabled_tables:
            no_rls_tables.append(table)

    if no_rls_tables:
        print(f"\n[SECURITY] Tables without RLS in migrations:")
        for t in no_rls_tables:
            print(f"  ! {t}")

    # 3. Get live tables and diff
    live_tables = get_live_tables()
    drift_alerts = []

    if live_tables:
        repo_tables = set(migration_tables.keys())

        # Tables in DB but not in repo migrations
        unmigrated = live_tables - repo_tables
        # Tables in repo but not in DB
        unapplied = repo_tables - live_tables

        if unmigrated:
            print(f"\n[DRIFT] Tables in live DB but NOT in migration files:")
            for t in sorted(unmigrated):
                print(f"  ! {t}")
                drift_alerts.append({
                    "drift_type": "unmigrated_table",
                    "table": t,
                    "message": f"Table '{t}' exists in DB but has no migration file",
                })

        if unapplied:
            print(f"\n[PENDING] Tables in migrations but NOT in live DB:")
            for t in sorted(unapplied):
                files = migration_tables.get(t, [])
                print(f"  ? {t} (defined in: {', '.join(files)})")
                drift_alerts.append({
                    "drift_type": "unapplied_migration",
                    "table": t,
                    "migration_files": files,
                    "message": f"Table '{t}' defined in migrations but missing from DB",
                })

        verified = repo_tables & live_tables
        print(f"\n[OK] {len(verified)} of {len(repo_tables)} migration tables verified in live DB")
    else:
        print("\n[SKIP] Live table comparison skipped (could not connect to Supabase)")

    # 4. Publish drift alerts
    if drift_alerts:
        severity = "HIGH" if len(drift_alerts) > 3 else "WARNING"
        publish_alert(
            severity=severity,
            title=f"{len(drift_alerts)} schema drift issues detected",
            message=f"Database drift check found {len(drift_alerts)} issues: "
                    f"{sum(1 for d in drift_alerts if d['drift_type'] == 'unmigrated_table')} unmigrated tables, "
                    f"{sum(1 for d in drift_alerts if d['drift_type'] == 'unapplied_migration')} unapplied migrations",
            details={"drift_items": drift_alerts},
            dry_run=dry_run,
        )

    if unsafe_migrations:
        publish_alert(
            severity="WARNING",
            title=f"{len(unsafe_migrations)} migrations lack BEGIN/COMMIT guards",
            message=f"Migrations without transaction wrappers: {', '.join(unsafe_migrations[:5])}",
            details={"unsafe_files": unsafe_migrations},
            dry_run=dry_run,
        )

    if no_rls_tables:
        publish_alert(
            severity="HIGH",
            title=f"{len(no_rls_tables)} tables without RLS",
            message=f"Tables missing ROW LEVEL SECURITY: {', '.join(no_rls_tables[:10])}",
            details={"tables": no_rls_tables},
            dry_run=dry_run,
        )

    # Summary
    total_issues = len(drift_alerts) + len(unsafe_migrations) + len(no_rls_tables)
    print(f"\n{'=' * 60}")
    if total_issues == 0:
        print("  RESULT: No drift detected. Schema is clean.")
    else:
        print(f"  RESULT: {total_issues} issues found.")
        print(f"    Drift:          {len(drift_alerts)}")
        print(f"    Unsafe scripts: {len(unsafe_migrations)}")
        print(f"    Missing RLS:    {len(no_rls_tables)}")
    print(f"{'=' * 60}")

    return total_issues


# ---------------------------------------------------------------------------
# Verify mode — post-apply checks
# ---------------------------------------------------------------------------

def run_verify():
    """Verify phase: post-apply sanity checks."""
    print("=" * 60)
    print("  DWS6 Database Drift Check — Verify Phase")
    print("=" * 60)

    live_tables = get_live_tables()
    migration_tables = get_migration_tables()

    if not live_tables:
        print("[ERROR] Cannot verify — no connection to live DB")
        return 1

    repo_tables = set(migration_tables.keys())
    verified = repo_tables & live_tables
    missing = repo_tables - live_tables

    for t in sorted(verified):
        print(f"[CHECK] Table '{t}': EXISTS")

    for t in sorted(missing):
        print(f"[FAIL] Table '{t}': MISSING from live DB")

    print(f"\n[RESULT] {len(verified)}/{len(repo_tables)} tables verified")

    if missing:
        print(f"[FAIL] {len(missing)} tables still missing after apply")
        return 1

    print("[OK] Verification passed")
    return 0


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main():
    parser = argparse.ArgumentParser(
        description="DWS6 Database Drift Detection — Single Entrypoint",
        epilog="Examples:\n"
               "  python scripts/db-drift-check.py              # Drift check only\n"
               "  python scripts/db-drift-check.py --advisor     # Advisor alerts only\n"
               "  python scripts/db-drift-check.py --all         # Both drift + advisor\n"
               "  python scripts/db-drift-check.py --verify      # Post-apply verification\n",
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    parser.add_argument("--verify", action="store_true", help="Run verify phase (post-apply checks)")
    parser.add_argument("--advisor", action="store_true", help="Run Supabase Performance Advisor check")
    parser.add_argument("--all", action="store_true", help="Run drift check + advisor (full)")
    parser.add_argument("--dry-run", action="store_true", help="Report only, don't publish to Redis")
    parser.add_argument("--channel", default=REDIS_CHANNEL, help=f"Redis channel (default: {REDIS_CHANNEL})")
    args = parser.parse_args()

    total_issues = 0

    if args.verify:
        sys.exit(run_verify())
    elif args.advisor:
        total_issues = run_advisor_check(channel=args.channel, dry_run=args.dry_run)
    elif args.all:
        total_issues = run_plan(dry_run=args.dry_run)
        print()  # separator
        total_issues += run_advisor_check(channel=args.channel, dry_run=args.dry_run)
    else:
        total_issues = run_plan(dry_run=args.dry_run)

    sys.exit(1 if total_issues > 0 else 0)


if __name__ == "__main__":
    main()
