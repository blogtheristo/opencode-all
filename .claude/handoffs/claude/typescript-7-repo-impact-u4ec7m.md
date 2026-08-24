# Handoff: claude/typescript-7-repo-impact-u4ec7m

## Task

Research TypeScript 7 (Go-native compiler, GA'd 2026-07-08) impact on this repo, special focus on sovereign dependencies.

## State — DONE

Pure research task, no code changes needed. Delivered:
`docs/field-notes/2026-07-09-typescript-7-repo-impact-sovereignty.md`

Key findings:

- Repo already clears TS7 prereqs (Node 24 everywhere, no Compiler API usage, no es5/amd/decorators/paths).
- Only real risk surface: `dws6.com/dashboard/firehorse/v10-react/` (+ landing-pages mirror) — project refs + `verbatimModuleSyntax` + `erasableSyntaxOnly`.
- CI gap (pre-existing, not TS7-caused): only `test-on-pr.yml` runs `tsc`, scoped to root `src/**` only — cli/, mcp-hub-ts/, cloud-run-gateway-ts/, src/cloudflare/, both dashboards have no CI type-check gate.
- Sovereignty: TypeScript is a Microsoft/US devDependency, always was — TS7 doesn't change vendor, license (Apache-2.0), or distribution (npm). §17.5 (Infrastructure Sovereignty Rule) is scoped to hosted prod infra, not build tooling, so it doesn't trip. Three-pillar model: pure Technology-Sovereignty (CSB) question, no customer data touches the compiler. Verdict: sovereignty-neutral upgrade.

## Next steps

- No action required unless Risto wants the TS7 upgrade actually done (not requested this session).
- Optional follow-up (flagged in the field note, not done): wire cli/, mcp-hub-ts/, cloud-run-gateway-ts/, src/cloudflare/, and the two dashboards into a CI type-check gate — currently only root src/\*\* is checked in test-on-pr.yml.

## Blockers

None.
