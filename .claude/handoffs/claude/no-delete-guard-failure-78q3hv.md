# Handoff — claude/no-delete-guard-failure-78q3hv

- 2026-09-29 | No-Delete Guard failed every run since #380 (26.09.2026): job got no runner, no steps, no log (HTTP 404). GitHub-hosted runners are blocked by account billing; other workflows already moved to `[self-hosted, dgx-spark]`. Fix: guard `runs-on: [self-hosted, dgx-spark]`. Branches deleted during runs #380–#479 were not auto-restored.
