# opencode/aegis-gke-agent-sandbox-policy — task handoff

**Task:** Aegis: compile the signed step scope to a GKE Agent Sandbox manifest (Google segment)  
**Branch:** opencode/aegis-gke-agent-sandbox-policy  
**Round:** 1/4  
**Date:** 2026-09-30

## Summary

Successfully created `src/aegis/pilot/gke-sandbox-policy.ts` and `src/__tests__/aegis-pilot-gke-sandbox.test.ts`, exported `stepSandboxManifest` from `src/aegis/pilot/index.ts`, and pushed to `origin/opencode/aegis-gke-agent-sandbox-policy`.

## Deliverables

| File                                            | Purpose                                                                                               |
| ----------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `src/aegis/pilot/gke-sandbox-policy.ts`         | K8s Sandbox + NetworkPolicy manifest generator from PilotStep                                         |
| `src/__tests__/aegis-pilot-gke-sandbox.test.ts` | Unit tests (11 tests covering core step egress, network step endpoints, gvisor runtime, read-only fs) |
| `src/aegis/pilot/index.ts` (modified)           | Export `stepSandboxManifest`                                                                          |

## Acceptance Checks (all PASS)

- ✅ committed
- ✅ pushed
- ✅ format
- ✅ todo
- ✅ typecheck
- ✅ lint
- ✅ tests
- ✅ spec: module exists
- ✅ spec: tests pass
- ✅ spec: exported

## Notes

- Sandbox CRD uses `agents.x-k8s.io/v1beta1` (pinned to v1.0.2 release manifest)
- `runtimeClassName: gvisor` for kernel-level isolation
- Read-only root filesystem with writable `/sandbox` and `/tmp` via emptyDir volumes
- Core steps never get egress rules; non-core network steps get endpoint-specific egress
- Unit tests cover all acceptance criteria from done-gate spec

## Open items / awaiting HIC decision

None – all checks passing.
