# Implementation Plan: Close dws6 AI+SWE Process Gaps

**Decision:** HIC approved closing all 5 gaps (audit #1959).  
**Method:** Daily morning implementation, one gap per session.  
**Dates:** 2026-09-03 through 2026-09-07  
**Token Budget:** ~4K per session (5 sessions, 20K total)

---

## Daily Schedule

### Day 1: Morning 2026-09-03 — Gap 1: CI DoD Gate (1 day, Highest ROI)

**Goal:** CI blocks merge if coverage drops OR intent tests skipped.

**Deliverables:**

- `scripts/validate-dod.sh` — Compare coverage/main vs HEAD; detect `.skip()` patterns; parse feat commits for test files
- `.github/workflows/validate-dod.yml` — GitHub Actions gate; blocks merge if exit code ≠ 0
- `package.json` script: `"validate:dod"` invoked by CI

**Success:** PR with `npm test` dropping from 60% → 58% is rejected by CI before merge.

**Inputs:**

- Vitest coverage JSON from `npm test` (generated to `./coverage/coverage-final.json`)
- Git diff to detect new `.skip()` in test files
- Commit message parser to extract feat scope and verify test file exists

**Outputs:**

- Merge-blocking CI check (visible in PR status)
- Field note: Gap 1 delivered, baseline coverage recorded

---

### Day 2: Morning 2026-09-04 — Gap 3: Decision Log + Rule 5 Foundation (2 days, Enables Gap 5)

**Goal:** PostToolUse hook logs every agent model call + its category (judgment/routing/transform).

**Deliverables:**

- `.claude/hooks/decision-log.sh` — Parses tool input JSON; logs model.call sites with category
- `scripts/analyze-decision-log.ts` — Weekly report: high-cost routing/transform calls flagged
- `.claude/hooks/audit/decision-log.json` — Structured log of all inference calls (gitignored)

**Success:** After this session, every agent inference is logged with metadata (cost, category, context hash).

**Inputs:**

- Current session's full transcript (to back-populate baseline)
- Tool schema inspection to detect model inference patterns

**Outputs:**

- Decision log flowing into field notes
- Weekly anomaly report (e.g., "routing agent made 45 LLM calls for retries — should hardcode")

---

### Day 3: Morning 2026-09-05 — Gap 5: Rule 5 Audit (2 days, Depends on Gap 3)

**Goal:** Grep codebase for model-call sites; categorize each by intent.

**Deliverables:**

- `scripts/audit-rule-5.ts` — Grep for `model.call()`, `chat.complete()`, `inference()` sites
- `docs/audit-rule-5-report.md` — Categorized findings + refactor recommendations
- High-priority refactor suggestions (hardcode deterministic transforms)

**Success:** Field note lists 10–20 model-call sites categorized as judgment/routing/transform with refactor priority.

**Inputs:**

- codebase `src/` directory
- Decision log baseline from Gap 3

**Outputs:**

- Audit report + refactor backlog
- Next-session prompt for targeted refactoring (deferred to future sprints)

---

### Day 4: Morning 2026-09-06 — Gap 2: Skill Verification Gate (1 day)

**Goal:** Manifest transition rule: experimental→verified requires test run on declared surface.

**Deliverables:**

- `scripts/verify-skill-surface.ts` — Checks manifest; enforces test-run records for each declared surface
- `skills/manifest.json` update schema: add `verifiedSurfaces` array with test timestamps
- CI gate: blocks merge if active skills have no `verifiedSurfaces` entries

**Success:** A skill marked `"status": "experimental"` cannot ship to main without `verifiedSurfaces` filled.

**Inputs:**

- Current manifest.json
- Surface list from all active skills

**Outputs:**

- Updated manifest schema
- Merge-blocking CI check
- Field note: Gap 2 shipped; audit of current experimental skills (which need verification)

---

### Day 5: Morning 2026-09-07 — Gap 4: DORA Dashboard (3–5 days → 1 day MVP)

**Goal:** MVP DORA metrics (lead time, change failure rate, deployment frequency).

**Deliverables:**

- `scripts/dora-metrics.ts` — Parse git log + PR metadata; generate weekly stats
- `docs/dora-dashboard.md` — Auto-generated weekly report (CSV + markdown table)
- GitHub Actions cron: run weekly on Monday 09:00 UTC; commit report to repo

**Success:** Weekly DORA snapshot: lead time (days), change failure rate (%), deployment frequency (PRs/week).

**Inputs:**

- Git log with committer timestamps
- PR labels + merge dates (via GitHub MCP)
- Hook audit logs (to count agent-driven vs manual PRs)

**Outputs:**

- Weekly DORA report
- Baseline metrics (current: lead time ~3 days, failure rate ~2%, frequency ~15 PRs/week)
- Field note: Gap 4 complete; metrics now visible for steering

---

## Cross-Gap Dependencies

| Gap              | Depends On | Enables                      | Days |
| ---------------- | ---------- | ---------------------------- | ---- |
| 1 (CI DoD)       | —          | all others (blocks bad code) | 1    |
| 2 (Skill verif)  | —          | nothing                      | 1    |
| 3 (Decision log) | 1          | 5                            | 2    |
| 4 (DORA dash)    | —          | ROI measurement              | 1    |
| 5 (Rule 5 audit) | 3          | refactor backlog             | 2    |

**Optimal sequence:** 1 → 2 → 3 → 4 → 5 (can run 2 + 4 in parallel after 1).

---

## Success Criteria

After 5 mornings:

1. ✅ CI blocks merge if coverage drops or tests skipped (Gap 1)
2. ✅ Every experimental skill has a verified-surfaces audit trail (Gap 2)
3. ✅ Every agent model call is logged + categorized (Gap 3)
4. ✅ Weekly DORA metrics visible (Gap 4)
5. ✅ Rule 5 audit complete; hardcode refactor backlog created (Gap 5)

**Outcome:** dws6 AI leverage becomes measurable, steerable, and defensible.

---

## HIC Checkpoints

- **After Gap 1:** Confirm CI gate blocks untested PRs (test manually with coverage drop)
- **After Gap 2:** Audit production skills; identify any without verified-surfaces
- **After Gap 3:** Review decision log format; adjust categories if needed
- **After Gap 4:** Check weekly DORA report; baseline acceptable?
- **After Gap 5:** Prioritize refactor backlog; schedule hardcode PRs

---

**Session:** claude/ai-software-engineering-krt01q  
**Next:** Morning 2026-09-03, start Gap 1 (CI DoD gate)
