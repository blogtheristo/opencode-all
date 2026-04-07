# scripts/daily/

Scripts here run **once per day** automatically on DGX Spark via `day-runner.sh`.

Drop any `.ts` or `.sh` file here and it runs at 03:00–06:00 UTC.
No config needed. No GitHub Actions. No remembering.

State tracked in `logs/day-runner-state.json` to prevent double-runs.
