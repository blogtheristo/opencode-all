# DORA Dashboard

Continuous measurement of delivery speed, stability, and reliability. Auto-generated weekly by `.github/workflows/dora-weekly.yml` (Mondays 09:00 UTC).

## Purpose

DORA metrics (DevOps Research and Assessment) measure:

- **Lead Time for Changes** — How fast from commit to production
- **Deployment Frequency** — How often changes reach production
- **Change Failure Rate** — Percentage of changes that cause failures
- **Mean Time to Recovery** — How quickly we fix failures

Target levels indicate high-performing engineering organizations:

| Metric               | High Performer | Target for DWS6 |
| -------------------- | -------------- | --------------- |
| Lead Time            | < 1 day        | 1-3 days        |
| Deployment Frequency | On-demand      | > 10/week       |
| Change Failure Rate  | 0-15%          | < 15%           |
| MTTR                 | < 1 hour       | < 4 hours       |

## Metrics Summary

```csv
Week,Lead Time Median (days),Lead Time P95 (days),Deployment Frequency (commits/week),Change Failure Rate (%),MTTR Median (hours)
```

## Weekly Reports

_No reports yet. Dashboard will auto-populate on first Monday run._

## Interpretation

### Lead Time Declining = Speed Increasing

Lower lead time means we're getting code to production faster. Target is moving from 3+ days (current baseline) to < 1 day through CI/CD improvements.

### Deployment Frequency Trends

Higher frequency (measured in commits/week to main) indicates more frequent releases. DWS6 target: 10+ commits/week.

### Change Failure Rate Low = Reliability

Low CFR (< 15%) means most commits don't cause rollbacks. Rising CFR signals need for better testing or stricter PR gates.

### MTTR Tracking Recovery Speed

Mean Time to Recovery (hours from failure detection to fix) measures incident response. Lower is better; target is < 4 hours.

## Implementation Notes

- **Data source:** `git log` (commit history) + GitHub API (PR metadata)
- **Lookback:** Last 7 days (rolling window)
- **Frequency:** Weekly, every Monday 09:00 UTC
- **Blocking:** No — failures do not halt deployments
- **CSV export:** Yes — raw metrics appended for trend analysis and external tools

## Usage

**Manual run:**

```bash
npm run dora:metrics
```

**Scheduled:** GitHub Actions cron every Monday at 09:00 UTC

---

_Last updated: 2026-09-03 by Claude Agent (DORA Dashboard MVP)_

## Week of 2026-08-31

| Metric | Value | Trend | Target |
|--------|-------|-------|--------|
| Lead Time (median) | 4.0 days | → | < 1 day |
| Lead Time (p95) | 4.0 days | → | < 1 day |
| Deployment Frequency | 59 commits/week | → | > 10/week |
| Change Failure Rate | 0.00% | → | < 15% |
| MTTR (median) | 138.0 hours | → | < 1 hour |

## Week of 2026-08-31

| Metric | Value | Trend | Target |
|--------|-------|-------|--------|
| Lead Time (median) | 4.0 days | → | < 1 day |
| Lead Time (p95) | 4.0 days | ↑ | < 1 day |
| Deployment Frequency | 59 commits/week | ↓ | > 10/week |
| Change Failure Rate | 0.00% | → | < 15% |
| MTTR (median) | 138.0 hours | ↑ | < 1 hour |
