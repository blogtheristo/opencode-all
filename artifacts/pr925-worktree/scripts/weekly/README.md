# scripts/weekly/

Scripts here run **once per week** (Sunday 04:00 UTC) automatically on DGX Spark via `day-runner.sh`.

Drop any `.ts` or `.sh` file here and it runs weekly.
No config needed. No GitHub Actions. No remembering.

State tracked in `logs/day-runner-state.json` to prevent double-runs.
