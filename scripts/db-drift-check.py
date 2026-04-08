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
    python scripts/db-drift-check.py --offline         # File-only (no DB, no Redis)
    python scripts/db-drift-check.py --verify          # Verify mode (post-apply checks)
    python scripts/db-drift-check.py --advisor         # Supabase advisor alerts only
    python scripts/db-drift-check.py --all             # Drift check + advisor (full)
    python scripts/db-drift-check.py --dry-run         # Report only, no Redis publish

Requires:
    pip install redis python-dotenv
    pip install httpx                (optional — only needed for live DB comparison)

Environment:
    SUPABASE_URL           - Supabase project URL
    SUPABASE_SERVICE_KEY   - Supabase service role key
    SUPABASE_ACCESS_TOKEN  - Personal access token (for --advisor)
    REDIS_HOST             - Redis hostname (default: localhost)
    REDIS_PORT             - Redis port (default: 6380)

Author: DWS IQ Team
Version: 3.0
Date: 2026-04-07
"""

import argparse
import hashlib
import os
import re
import sys
from pathlib import Path

try:
    import httpx
except ImportError:
    httpx = None  # Offline mode — live DB comparison unavailable

try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

# Import shared alert module (single source of truth for publishing)
sys.path.insert(0, str(Path(__file__).resolve().parent))
from dws_alerts import (  # noqa: E402
    REDIS_HOST,
    REDIS_PORT,
    publish_alert,
    run_advisor_check,
)

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

    If httpx is not installed, returns empty set (offline mode).
    If SUPABASE_URL is set but enumeration fails, prints a clear error and returns
    an empty set (caller will skip live comparison and report the gap).
    If SUPABASE_URL is not set, prints a warning and returns an empty set.
    """
    if httpx is None:
        print("WARNING: httpx not installed. Live DB comparison unavailable.")
        print("  Install with: pip install httpx")
        return set()

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
                for path in data.get("paths", {}):
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
        # Strip single-line SQL comments to avoid false positives (e.g. "if")
        content = re.sub(r"--.*$", "", content, flags=re.MULTILINE)
        for match in re.finditer(
            r"CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?(?:public\.)?(\w+)",
            content,
            re.IGNORECASE,
        ):
            table_name = match.group(1).lower()
            tables.setdefault(table_name, []).append(f.name)

    return tables


def get_migration_views() -> dict[str, list[str]]:
    """Parse CREATE VIEW statements from migration files.
    Returns {view_name: [migration_files_that_reference_it]}."""
    views: dict[str, list[str]] = {}

    if not MIGRATIONS_DIR.exists():
        return views

    for f in sorted(MIGRATIONS_DIR.glob("*.sql")):
        content = f.read_text(encoding="utf-8", errors="replace")
        content = re.sub(r"--.*$", "", content, flags=re.MULTILINE)
        for match in re.finditer(
            r"CREATE\s+(?:OR\s+REPLACE\s+)?VIEW\s+(?:public\.)?(\w+)",
            content,
            re.IGNORECASE,
        ):
            view_name = match.group(1).lower()
            views.setdefault(view_name, []).append(f.name)

    return views


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
# File hygiene checks
# ---------------------------------------------------------------------------

def detect_duplicate_numbers() -> dict[str, list[str]]:
    """Detect migration files sharing the same numeric prefix.

    Returns {prefix: [filenames]} for prefixes with 2+ files.
    Excludes _OLD, consolidated, run-pending, test_, and README files.
    """
    if not MIGRATIONS_DIR.exists():
        return {}

    prefix_map: dict[str, list[str]] = {}
    for f in sorted(MIGRATIONS_DIR.glob("*.sql")):
        name = f.name
        # Skip meta-files and superseded migrations
        if name.startswith(("consolidated", "run-pending", "test_")):
            continue
        if "_OLD" in name:
            continue
        match = re.match(r"^(\d+)", name)
        if match:
            prefix = match.group(1)
            prefix_map.setdefault(prefix, []).append(name)

    duplicates = {k: v for k, v in prefix_map.items() if len(v) > 1}

    if duplicates:
        print(f"\n[CRITICAL] {len(duplicates)} duplicate migration number(s):")
        for prefix, files in sorted(duplicates.items()):
            print(f"  {prefix}: {', '.join(files)}")
        print("  Execution order within duplicates is non-deterministic!")
        print("  Rule: migrations 056+ MUST have unique numbers.")
    else:
        print("[OK] No duplicate migration numbers.")

    return duplicates


# ---------------------------------------------------------------------------
# Plan mode — detect drift
# ---------------------------------------------------------------------------

def run_plan(dry_run: bool = False, offline: bool = False):
    """Plan phase: detect drift between repo and live DB.

    Args:
        dry_run: If True, don't publish to Redis.
        offline: If True, skip live DB comparison entirely (file analysis only).
    """
    mode = "Offline" if offline else "Plan"
    print("=" * 60)
    print(f"  DWS6 Database Drift Check — {mode} Phase")
    print("=" * 60)
    print(f"  Migrations dir: {MIGRATIONS_DIR}")
    if not offline:
        print(f"  Supabase URL:   {SUPABASE_URL[:40]}..." if SUPABASE_URL else "  Supabase URL:   NOT SET")
        print(f"  Redis:          {REDIS_HOST}:{REDIS_PORT}")
    else:
        print("  Mode:           OFFLINE (file analysis only)")
    print()

    # 1. Parse migration files
    migration_files = get_migration_files()
    migration_tables = get_migration_tables()
    migration_views = get_migration_views()
    print(f"[INFO] Found {len(migration_files)} migration files")
    print(f"[INFO] Found {len(migration_tables)} tables defined in migrations")
    print(f"[INFO] Found {len(migration_views)} views defined in migrations")

    # 1b. Check for duplicate migration numbers (CRITICAL)
    duplicate_numbers = detect_duplicate_numbers()

    # 2. Check migration file safety
    unsafe_migrations = []
    no_rls_tables = []

    # Skip _OLD, consolidated, run-pending, test_ from safety warnings
    skip_prefixes = ("consolidated", "run-pending", "test_")
    for mf in migration_files:
        name = mf["filename"]
        if name.startswith(skip_prefixes) or "_OLD" in name:
            continue
        if not mf["has_begin_commit"]:
            unsafe_migrations.append(name)
            print(f"[WARNING] {name}: Missing BEGIN/COMMIT wrapper")

    # Pre-scan all migration files once to find tables with RLS enabled
    rls_enabled_tables: set[str] = set()
    rls_pattern = re.compile(
        r"ALTER\s+TABLE\s+(?:public\.)?([A-Za-z0-9_]+)\s+ENABLE\s+ROW\s+LEVEL\s+SECURITY",
        re.IGNORECASE,
    )
    for f in sorted(MIGRATIONS_DIR.glob("*.sql")):
        content = f.read_text(encoding="utf-8", errors="replace")
        content = re.sub(r"--.*$", "", content, flags=re.MULTILINE)
        for match in rls_pattern.finditer(content):
            table_name = match.group(1)
            if table_name:
                rls_enabled_tables.add(table_name.lower())

    for table, _files in migration_tables.items():
        if table not in rls_enabled_tables:
            no_rls_tables.append(table)

    if no_rls_tables:
        print("\n[SECURITY] Tables without RLS in their CREATE TABLE migration:")
        print("  Note: Some may be remediated by later migrations (e.g. 011_fix_security_issues.sql)")
        print("  Run 056_schema_health_check.sql on live DB for definitive RLS audit.")
        for t in no_rls_tables:
            print(f"  ? {t}")

    # 3. Get live tables and diff (skip in offline mode)
    live_tables = set() if offline else get_live_tables()
    drift_alerts = []

    if live_tables:
        repo_tables = set(migration_tables.keys())
        # Combine tables + views so views don't appear as "unmigrated tables"
        repo_objects = repo_tables | set(migration_views.keys())

        # Tables/views in DB but not in repo migrations
        unmigrated = live_tables - repo_objects
        # Tables in repo but not in DB
        unapplied = repo_tables - live_tables

        if unmigrated:
            print("\n[DRIFT] Tables in live DB but NOT in migration files:")
            for t in sorted(unmigrated):
                print(f"  ! {t}")
                drift_alerts.append({
                    "drift_type": "unmigrated_table",
                    "table": t,
                    "message": f"Table '{t}' exists in DB but has no migration file",
                })

        if unapplied:
            print("\n[PENDING] Tables in migrations but NOT in live DB:")
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
        reason = "offline mode" if offline else "could not connect to Supabase"
        print(f"\n[SKIP] Live table comparison skipped ({reason})")

    # 4. Publish drift alerts
    if duplicate_numbers and not offline:
        publish_alert(
            severity="CRITICAL",
            title=f"{len(duplicate_numbers)} duplicate migration numbers",
            message=f"Duplicate prefixes: {', '.join(sorted(duplicate_numbers.keys())[:10])}. "
                    "Non-deterministic execution order.",
            details={"duplicates": {k: v for k, v in sorted(duplicate_numbers.items())}},
            dry_run=dry_run,
        )

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
    total_issues = len(drift_alerts) + len(unsafe_migrations) + len(no_rls_tables) + len(duplicate_numbers)
    print(f"\n{'=' * 60}")
    if total_issues == 0:
        print("  RESULT: No drift detected. Schema is clean.")
    else:
        print(f"  RESULT: {total_issues} issues found.")
        if duplicate_numbers:
            print(f"    Duplicate nums: {len(duplicate_numbers)} (CRITICAL)")
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
    parser.add_argument("--offline", action="store_true",
                        help="File-only analysis — no live DB, no Redis, no httpx needed")
    parser.add_argument("--verify", action="store_true", help="Run verify phase (post-apply checks)")
    parser.add_argument("--advisor", action="store_true", help="Run Supabase Performance Advisor check")
    parser.add_argument("--all", action="store_true", help="Run drift check + advisor (full)")
    parser.add_argument("--dry-run", action="store_true", help="Report only, don't publish to Redis")
    parser.add_argument("--channel", default=REDIS_CHANNEL, help=f"Redis channel (default: {REDIS_CHANNEL})")
    args = parser.parse_args()

    # Offline implies dry-run (no Redis publishing)
    if args.offline:
        args.dry_run = True

    total_issues = 0

    if args.verify:
        sys.exit(run_verify())
    elif args.advisor:
        total_issues = run_advisor_check(channel=args.channel, dry_run=args.dry_run)
    elif args.all:
        total_issues = run_plan(dry_run=args.dry_run, offline=args.offline)
        print()  # separator
        if not args.offline:
            total_issues += run_advisor_check(channel=args.channel, dry_run=args.dry_run)
        else:
            print("[SKIP] Advisor check skipped (offline mode)")
    else:
        total_issues = run_plan(dry_run=args.dry_run, offline=args.offline)

    sys.exit(1 if total_issues > 0 else 0)


if __name__ == "__main__":
    main()
