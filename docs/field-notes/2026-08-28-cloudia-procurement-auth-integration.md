---
title: Cloudia Procurement Integration — Auth Refactor & API Monitoring
date: 2026-08-28
author: Claude Code
session: https://claude.ai/code/session_01Db3z7NTx6QMgHs8ipzBDJ5
tags: [procurement, bid-scout, cloudia, api-integration, security]
status: captured
---

## What Happened

The bid-scout agent's Cloudia integration was refactored from **API key authentication** to **basic auth (username/password)**, bringing it into alignment with Cloudia's current API surface. Three new utilities were created to support live procurement monitoring:

1. **`scripts/bid-scout.mjs`** (updated) — Main agent that monitors Cloudia bids, filters by criteria (budget €5K–€500K, DWS IQ products fit, target geographies), and flags opportunities. Now uses basic auth with environment variables `CLOUDIA_USER_NAME` and `CLOUDIA_PASSWORD`.

2. **`fetch-opportunity.mjs`** (new) — Playwright-based scraper for tarjouspalvelu.fi (Finnish procurement portal). Extracts opportunity details when API access is unavailable or for validation.

3. **`fetch-tarjous.mjs`** (new) — Lightweight Cloudia API client to fetch a single opportunity by ID via basic auth. Supports ad-hoc lookups during deal evaluation.

## Why This Matters

**Security & Operations:**

- API keys are static and global; basic auth ties credentials to a user account, enabling audit logging and per-session revocation if compromised.
- Cloudia's primary API endpoint now expects `Basic` auth headers rather than bearer tokens, aligning our client with the platform's real requirements.

**Procurement Workflow:**

- The bid-scout agent can now continuously monitor live opportunities without manual dashboard checks.
- Fallback to Playwright scraper allows validation when the API is unavailable (network outage, API rate limit).
- Opportunity fetcher (`fetch-tarjous.mjs`) enables quick fact-checking during deal evaluation (e.g., verify budget/deadline before committing a quote).

## Technical Details

### Auth Method (Basic Auth)

```javascript
const credentials = Buffer.from(`${user}:${secret}`).toString("base64");
const headers = { Authorization: `Basic ${credentials}` };
```

Credentials flow: `.env` → `CLOUDIA_USER_NAME` / `CLOUDIA_PASSWORD` (never hardcoded).

### Bid Assessment Criteria

The agent filters opportunities by:

- **Budget:** €5,000–€500,000 (excludes small contracts and unrealistic large-value single deals)
- **Products:** DWS IQ, agent services, consulting (categories we win on)
- **Geographies:** FI, SE, DE, UK, US (current market focus)
- **Win Probability:** ≥60% (preliminary estimate based on fit score)

### Fallback Strategy

If Cloudia API fails:

1. Agent logs warning and falls back to mock bids (safe demo mode)
2. Playwright scraper can be invoked manually for tarjouspalvelu.fi validation
3. No silent failures — all errors logged to `.workflows/bids-log.jsonl`

## Related Commits

- `bc33012ef` — `fix(bid-scout): Use Cloudia basic auth (username/password) instead of API key`
- `1dfcf55e8` — `docs(admin): Complete admin documentation for procurement monitoring system`
- `06dd694c5` — `feat(tarjouspalvelu): Add Playwright-based procurement monitoring`

## Open Questions for HIC

1. **Credential Storage:** Should we migrate `.env` secrets to a vault (Supabase Edge Function secrets, 1Password, or Google Secret Manager)? Current `.env` approach is safe for local dev but risky for CI/deployed agents.

2. **Monitoring Cadence:** Should bid-scout run continuously (e.g., every 15 min via cron), hourly, daily, or on-demand? Current code supports all; HIC decision on frequency balances freshness vs. API quota/cost.

3. **Deal Evaluation Workflow:** Once opportunities are flagged, what's the handoff? Should bid-scout auto-draft a response template, route to sales for manual review, or trigger an MCP call to another agent (e.g., proposal-generator)?

## Next Steps

- [ ] **Vault migration** (if HIC approves): Move secrets to Supabase or Google Cloud Secret Manager
- [ ] **Cron scheduling** (if HIC decides): Wire bid-scout into `/schedule` or daily task runner
- [ ] **Response automation** (if workflow clarified): Add proposal-draft or sales-alert integration
- [ ] **Cloudia API documentation** (ongoing): Verify API surface (pagination, filtering, rate limits) against live service

## Key Files

| Path                            | Purpose                                              |
| ------------------------------- | ---------------------------------------------------- |
| `scripts/bid-scout.mjs`         | Main procurement monitoring agent                    |
| `fetch-opportunity.mjs`         | Tarjouspalvelu.fi Playwright scraper                 |
| `fetch-tarjous.mjs`             | Cloudia API client (opportunity lookup)              |
| `.workflows/bids-log.jsonl`     | Audit log of all monitored bids                      |
| `.workflows/opportunities.json` | Current opportunity snapshot                         |
| `.env.example`                  | Template for `CLOUDIA_USER_NAME`, `CLOUDIA_PASSWORD` |

## Verification

To verify the integration works:

```bash
# Set credentials in .env
export CLOUDIA_USER_NAME=<your-username>
export CLOUDIA_PASSWORD=<your-password>

# Run bid-scout (live Cloudia API)
node scripts/bid-scout.mjs

# Fetch single opportunity
node fetch-tarjous.mjs

# Scrape tarjouspalvelu.fi (Playwright)
node fetch-opportunity.mjs
```

Expected output: Opportunities filtered by criteria, logged to `.workflows/bids-log.jsonl`.

---

**Session Context:** Themis Phase 1 orchestration work paused; procurement monitoring system completed as a parallel operational capability. This integration enables real-time deal discovery, foundational for Phase 2 (AI-driven proposal generation).
