# Cloudia Procurement Integration

**Date:** 2026-08-28  
**Topic:** API Authentication & Live Monitoring  
**Status:** Operational

## Summary

Bid-scout agent now monitors live Cloudia procurement opportunities using basic auth (username/password) instead of API keys. Three utilities support the workflow:

- `scripts/bid-scout.mjs` — Main agent (filters by budget €5K–€500K, geographies FI/SE/DE/UK/US)
- `fetch-tarjous.mjs` — Cloudia API client (lookup single opportunity by ID)
- `fetch-opportunity.mjs` — Playwright scraper for tarjouspalvelu.fi (fallback when API unavailable)

## Why Basic Auth Instead of API Keys?

1. **Account-level credentials** enable per-user audit logging and revocation
2. **Aligns with Cloudia's current API surface** (API endpoints now expect `Basic` headers, not bearer tokens)
3. **Fallback scraper** validates opportunities when API is down

## Filtering Criteria

- Budget: €5,000–€500,000
- Products: DWS IQ, agent services, consulting
- Geographies: FI, SE, DE, UK, US
- Win probability ≥60%

## Environment Setup

```bash
export CLOUDIA_USER_NAME=<your-username>
export CLOUDIA_PASSWORD=<your-password>
```

Credentials stored in `.env` (local dev); production should use vault (Supabase secrets, Google Secret Manager, or 1Password).

## Key Decisions Pending

1. **Credential vault migration** — Should secrets move from `.env` to a managed vault?
2. **Monitoring cadence** — Run continuously (15m intervals), hourly, daily, or on-demand?
3. **Response automation** — Auto-draft proposals, route to sales, or trigger downstream agent?

## Related Files

- `scripts/bid-scout.mjs` — Agent code
- `fetch-tarjous.mjs` — API client
- `fetch-opportunity.mjs` — Scraper
- `.workflows/bids-log.jsonl` — Audit log
- `docs/field-notes/2026-08-28-cloudia-procurement-auth-integration.md` — Full field note

## Commits

- `bc33012ef` — `fix(bid-scout): Use Cloudia basic auth`
- `1dfcf55e8` — `docs(admin): Complete admin documentation`
- `06dd694c5` — `feat(tarjouspalvelu): Add Playwright monitoring`
