---
name: mgd-report
description: >
  Use when reporting the DWS north-star metric — Monthly Governed Decisions (MGD) plus Customer-
  Retained Capital (CRC). Says "MGD", "monthly governed decisions", "north-star number", "MGD
  report". Wraps the deterministic scripts/compute-mgd.mjs, renders the number with trend per
  customer, and fails loud on the schema gap rather than reporting a proxy.
argument-hint: "optional: CUSTOMER=<org_id> RANGE=<current-quarter|YYYY-Qn|from..to>"
allowed-tools: [Read, Bash]
---

# MGD Report — the dominant-game number

**MGD is the DWS north-star metric (founder-ratified).** Registered in
`DWS_TRUTH_STANDARD.md` §2 row 32; definitions in
`dws10.com/config/metrics-northstar.json` (verbatim from the field-note §3).
This skill **reports** the number — it does **not** compute it. All counting lives
in `scripts/compute-mgd.mjs` (deterministic, no LLM — CLAUDE.md Rule 5). The skill
runs that script, formats the result, and surfaces the fail-loud gap cleanly.

Canonical source: `docs/field-notes/2026-07-05-groq-ross-dominant-game-recipe.md`
(recipe steps 5–6). Pairs with `/truth-check` (enforces the anti-game phrasing) and
`/retro` → `/learn` (quarterly game re-check, recipe step 8).

## Parameters

| Param      | Default             | Meaning                                                                        |
| ---------- | ------------------- | ------------------------------------------------------------------------------ |
| `CUSTOMER` | all customers       | Filter to one `org_id` (`--customer`).                                         |
| `RANGE`    | current quarter     | `current-quarter`, `YYYY-Qn` (e.g. `2026-Q3`), or `from..to`.                  |
| `SOURCE`   | `--supabase` if env | `--supabase` (live `agent_executions` table) or `--logs <path>` (JSON export). |

**Source of truth for the data:** agent outcomes live in the Supabase
`agent_executions` table, **not** in git. Prefer `--supabase` (needs
`SUPABASE_URL` + `SUPABASE_SERVICE_KEY`); fall back to `--logs <file|dir>` for an
offline export. Both feed the identical deterministic counter and identical
fail-loud.

## Procedure

1. **Resolve the window.** Turn `RANGE` into `--from`/`--to` ISO bounds. Default =
   current calendar quarter. Compute the immediately-preceding quarter too (for trend).
2. **Run the script for the current window** (this is the whole computation):
   ```bash
   # live table (preferred):
   node scripts/compute-mgd.mjs --supabase --from <ISO> --to <ISO> [--customer <org_id>] --pretty
   # or an offline export:
   node scripts/compute-mgd.mjs --logs "$LOGS" --from <ISO> --to <ISO> [--customer <org_id>] --pretty
   ```
3. **Handle the result by exit code — do NOT paper over a gap:**
   - **exit 0** → parse the JSON. This is the report payload.
   - **exit 2 (schema gap)** → STOP. Print the `error: "schema-gap"` block verbatim:
     the named missing fields and the proposed (un-applied) migration
     `supabase/migrations/081_agent_executions_governance_fields.sql`. Do **not**
     substitute a proxy, a stale number, or a partial count (Rule 12).
   - **exit 1** → surface the IO/usage error; do not guess.
4. **Trend.** Run step 2 again for the prior window; per customer, `Δ = current −
prior`. Render ▲/▼/▬. Deterministic subtraction — no judgment.
5. **CRC.** The script reports CRC as `computableFromExecutionLogs: false` (CRC =
   retained 4P assets, not a log event). Report that honestly; do not invent a CRC
   number. If a 4P-asset inventory is supplied, join it here — otherwise state the gap.

## Two outputs (Agent Productization Rule)

- **Human CLI view** — a per-customer table: MGD (current), trend Δ, and the
  excluded-breakdown so the reader sees what did _not_ count and why.
- **Structured JSON** — the script's stdout, unmodified, for agent consumption
  (`--pretty` off for machine use). The rendered view must never disagree with it.

```
MGD Report — <range>   (source: agent_executions)
  Total MGD: <n>   (▲/▼ <Δ> vs <prior range>)
  Per customer:
    <org_id>   <n>   <▲/▼ Δ>   excluded: <breakdown>
  CRC: not derivable from execution logs (4P asset inventory required)
  — OR —
  SCHEMA GAP: MGD not computed. Missing: governed_outcome_layer,
  article12_lineage, audit_grade. Propose (do not apply): migration 081.
```

## Latent vs deterministic

| Step                                                | Kind          |
| --------------------------------------------------- | ------------- |
| Parse RANGE into ISO bounds; pick prior window      | Deterministic |
| Count governed decisions (delegated to compute-mgd) | Deterministic |
| Compute trend Δ                                     | Deterministic |
| Decide the RANGE a user meant from vague phrasing   | Latent        |
| Narrate what a drop in MGD implies for the roadmap  | Latent        |

## Common mistakes

- **Reporting a number when the script exited 2.** The gap IS the finding — the fix
  is reviewing migration 081, not inventing a proxy.
- **Letting the rendered table drift from the JSON.** The JSON is the source of truth;
  the table is a view of it.
- **Counting a proxy for CRC.** CRC is retained 4P capital, not an execution-log event.

## DWS Standards applied (CLAUDE.md Resolver)

- `DWS_TRUTH_STANDARD.md` §2 row 32 + `dws10.com/config/metrics-northstar.json` — the metric.
- `AI_AGENT_GUIDELINES.md` §Ledger-Native Output Contract — where lineage originates.
- `docs/field-notes/2026-07-05-groq-ross-dominant-game-recipe.md` §3/§6 — definitions + recipe.
