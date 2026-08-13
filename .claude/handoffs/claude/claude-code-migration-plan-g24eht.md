# Claude Code Migration Plan — Handoff

## Strategy (2026-08-13)

**Not a disabling, but a pivot:**

- Make **OpenCode** the primary agent/deployment platform
- Keep **Claude Code** as a hot standby (active, ready to resume, not archived)
- Avoid full deprecation; maintain dual-stack readiness

## Status

- Branch reset to `origin/main` (2026-08-13 01:30)
- No files changed yet
- Waiting for scope clarification on which systems/files need updating

## Next Steps

- [ ] Clarify: which files/systems document the current Claude Code setup?
- [ ] Clarify: which deployments/configs should switch to OpenCode primary?
- [ ] Clarify: what does "hot standby" mean in this context? (monitoring? failover? docs?)
- [ ] Implement strategy across in-scope files
- [ ] Test/verify deployments work with OpenCode primary

## Questions for HIC

1. Which specific files/sections document the current setup?
2. Where is Claude Code currently deployed/configured? (AGENTS.md? deployment configs? CI/CD?)
3. What triggers a switchback to Claude Code (if OpenCode fails)?
