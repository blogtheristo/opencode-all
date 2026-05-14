---
name: fix-dual-folder-api-connectivity
version: 1.0
date: 2026-04-29
description: Use when public site pages fail to reach backend APIs, or when root/landing-pages API endpoints drift. Fixes API base URLs in both folders, validates endpoint health, and verifies data path end-to-end (especially Supabase-backed forms like booking).
---

Fix API connectivity issues across dual-folder public pages and verify persistence end-to-end.

Usage: `/fix-dual-folder-api-connectivity <site/page + failing endpoint + expected backend>`

Input: $ARGUMENTS

## Steps

1. Parse `$ARGUMENTS` into: affected page, failing endpoint, expected backend host, and affected data path (for example booking insert).
2. Locate both source-of-truth and production mirror files using the dual-folder map:
   - `dws10.com/` <-> `landing-pages/dws10-com/`
   - `dws6.com/` <-> `landing-pages/dws6-com/`
   - `onelifetime.world/` <-> `landing-pages/onelifetime-world/`
   - `lifetime.fi/` <-> `landing-pages/lifetime-fi/`
3. Inspect current API base logic in both files and identify mismatch patterns:
   - static-host drift (old host / wrong domain),
   - content-type mismatch (HTML page returned where JSON expected),
   - missing query-param prefill handling (e.g. `?service=demo`).
4. Patch both files in the same change set:
   - set API base to the intended backend host,
   - preserve local dev/file fallback if present,
   - add concise error diagnostics for non-JSON API responses when needed.
5. Validate endpoint reachability:
   - check services/read endpoint first,
   - run one write-path request for the affected flow (for booking: create reservation payload).
6. Verify persistence in Supabase when applicable:
   - confirm row-count delta and latest inserted row fields via MCP SQL checks.
7. Confirm root and landing mirror remain synchronized (no drift after edits).
8. Return a short incident summary: root cause, files changed, endpoint tests, DB verification result, and any infra-level follow-up (DNS/routing) still required.

## When NOT to use

- Infra outage only (DNS/Cloudflare/backend down) with no code drift -> use `/flow-status` + infra ops runbook instead.
- Pure backend bug where frontend endpoint is already correct -> use service-specific fix workflow.
- Single-repo private app without dual-folder mirrors -> use normal API fix flow without this skill.
