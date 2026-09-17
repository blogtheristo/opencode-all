# Handoff: claude/eu-data-live-verify-tfy7aw

**Task:** Carried over from PR #1640 merge (7f09cf8): (1) verify live
PRH/FMI/EDP upstreams, (2) regulatory-radar EDP dataset-version-diff
ingestion, (3) fix the broken `cli/` tsc build. PR #1687 tracks this branch.

**State — all three addressed:**

1. **Live-verify:** blocked, not inconclusive. All three upstreams (PRH,
   FMI, EDP) return CONNECT 403, confirmed via the agent-proxy relay log as
   `connect_rejected` — an organization egress-policy denial, not a
   transient fault. Second independent session to hit this identical block.
   Documented in the lab note's new "Live Verification Log" (v1.2) and
   `skills/eu-data/SKILL.md` Failure Modes.
2. **regulatory-radar EDP diff — implemented, not live-tested:**
   `scripts/weekly/edp-dataset-diff.sh` reuses `dws eu-data search` against
   a watchlist (EU ETS verified emissions, E-PRTR, Eurostat energy
   statistics), diffs against `config/edp-dataset-state.json`, writes
   changes to `docs/regulatory-radar/edp-dataset-diffs/`. Verified
   new/no-change/modified diff logic against a stubbed `dws` binary (real
   API unreachable — same policy block as item 1). `modified` field added
   to `parseEdpSearch()` in `cli/src/cli.ts`; its presence in the live EDP
   Search API response is unconfirmed — script self-detects and warns if
   absent rather than silently degrading.
3. **cli/ tsc build — fixed and verified.** Two root causes:
   `cli/node_modules` was never installed (missing `@types/node`), and the
   `dws kb preflight` dynamic import of `src/utils/embeddings.ts` crossed
   the package's `rootDir` boundary (TS6059), pulling in a `pino`
   dependency this package doesn't have. Fixed by installing
   `cli/node_modules` and switching the import to a non-literal specifier +
   local type (keeps tsc from including the cross-package file; runtime
   behavior via dynamic import is unchanged). `npm run build` and
   `tsc --noEmit` are both clean; compiled CLI smoke-tested (`dws eu-data
status`, `dws --help`). Note: `dws kb preflight` itself still fails at
   _runtime_ in this sandbox because root `node_modules` (pino) isn't
   installed and `src/utils/embeddings.js` has no compiled JS twin next to
   the `.ts` source — pre-existing, unrelated to the tsc fix, needs a
   working root `npm install` to actually exercise.

**Next steps:**

1. Live upstream verification (both `eu-data status` and the new
   `edp-dataset-diff.sh`) needs a human or a runner outside Claude Code's
   cloud-session egress policy. Do not re-attempt from another cloud
   session.
2. First real weekly run of `edp-dataset-diff.sh` should confirm whether
   the EDP Search API actually returns a `modified`/`issued` field — if
   not, `parseEdpSearch()` needs the real field name.
3. EUR-Lex/EFRAG/CINEA ingestion (the rest of regulatory-radar's "Data
   freshness" table) remains unbuilt/planned, unchanged by this session.

**Blockers:** Network egress policy — cannot be resolved from inside a
Claude Code cloud session.
