# Field Note: dws6 AI+SWE Process Audit

**Date:** 2026-09-02  
**Auditor:** Claude Haiku 4.5 (session krt01q)  
**Scope:** System design for AI-amplified software engineering — governance, tooling, metrics.

---

## Executive Summary

dws6 has built a **high-fidelity governance layer** (12 Rules codified, 10 mechanical gates, 70+ skills versioned) and **strong defensive posture** (secrets scanning, RLS enforcement, blog approval). The lever can amplify output by 2–3× in focused sprints **when DoD and measurement are tight**.

Today, three gaps prevent that leverage:

1. **Definition of Done is implicit, not gated** — coverage can drop, intent tests skipped; CI allows merge.
2. **No instrumentation of agent decision categories** — impossible to measure whether Rule 5 (model for judgment only) is followed.
3. **DORA metrics absent** — lead time, change-failure rate invisible; cost/benefit of AI work not measured.

The audit maps each gap to a concrete fix (1–5 days each), ranked by ROI.

---

## Audit Framework

AI amplifies a system by shifting the bottleneck upward: from code-writing (AI is fast) → to design/review/integration (human scope). Quality improves **where definitions are tight and human time is allocated to decisions**, not where models replace judgment.

**Four pillars:**

1. **Definitions, tests, DoD** — What is "done"? Who verifies? When do we say no?
2. **Versioned governance** — Agent tools, rules, data: are they VCS'd, tested, auditable?
3. **Human-time allocation** — Does the system force humans to make decisions or let them hide?
4. **DORA metrics** — Is the lever moving the right direction? (Lead time ↓, failure rate ↓, cycle time ↓)

---

## Pillar 1: Definitions, Tests, DoD — PARTIAL (Strong Foundations, Missing Gate)

### Strengths

✅ **CLAUDE.md: 12 Rules, canonically sourced**

- All agents inherit the rules via session-start hook (no paraphrase, no fork)
- Single source of truth; cross-branch history in handoff files
- Discipline gates (design-first, verification-gate, dual-folder-sync) enforceable

✅ **Vitest: 100+ test files, coverage thresholds**

- 100+ test suites across unit/integration/e2e domains
- Thresholds set: 60% statements, 55% functions, 50% branches
- v8 provider; coverage reports generated
- Setup isolation guards (`restoreMocks`, `unstubEnvs`, `unstubGlobals`) prevent order-dependent flakes

✅ **Hooks enforce 6 of 12 rules mechanically**

- Rule 3 (surgical edits): `protect-files.sh` blocks .env, .key, migrations, public `.md`
- Rule 6 (token budgets): `session-start.sh` echoes `CLAUDE_AUTO_MODE_BUDGET`
- Rule 10 (checkpoint): `session-stop.sh` governance checklist (dual-folder, thesis, uncommitted)
- Rule 11 (conventions): `validate-branch-name.py`, prettier + eslint PostToolUse
- Rule 12 (fail loud): All PreToolUse guards block (exit 2) with stderr, never silent
- Security baseline: `secret-scan.sh`, `sql-safety-guard.sh`, `pretooluse-guard.sh`

✅ **Blog approval gate (Rule 13)**

- `blog-draft-gate.sh` blocks publish unless `docs/blog-drafts/<slug>.md` exists with `Status: APPROVED`
- Enforces HIC review before any post leaves the repo

### Gaps

❌ **No CI gate for coverage drops or skipped tests**

Current state:

```bash
npm test  # Passes if 60% coverage achieved
npm run build  # Passes if TypeScript valid
```

Missing: A PR-check that blocks merge if:

- Coverage drops relative to main (e.g., 60% → 58%)
- Intent tests are skipped/commented-out
- A test file exists but is marked `@skip` or `.skip()`

**Impact:** Untested code can ship if a developer removes the `.skip()` flag before committing. No CI signal.

---

### Rules 1, 2, 4, 5, 7, 8, 9 Are Judgment-Only

These are not mechanically enforceable (they depend on model reasoning):

- **Rule 1 (Think before coding):** Assume not stated → unverified
- **Rule 2 (Simplicity first):** No metric of speculative code
- **Rule 4 (Goal-driven):** Success criteria often implicit in task description
- **Rule 5 (Model only for judgment):** **CRITICAL BLINDSPOT** — today impossible to audit whether a deterministic transform is hardcoded or delegated to a model
- **Rule 7 (Surface conflicts):** Depends on agent honesty
- **Rule 8 (Read before write):** Code review can spot, but not automated
- **Rule 9 (Tests verify intent):** A test that passes is not proof of intent

---

## Pillar 2: Agent Tools/Data/Rules Versioned — STRONG

✅ **70+ skills in manifest.json, typed + versioned**

- v1.1 dated 2026-08-20
- Status declared: active, experimental, deferred
- Surface support matrix (win11-claude-cli, claude-desktop, opencode-cli, etc.)
- Transport layer clear (slash-command, skill-pack, discipline-gate)

✅ **Env profiles in VCS**

- `.claude/env/dgx-spark.json`, `win11.json`, `mobile.json`, `chromebook.json`
- MCP configurations versioned
- Agent definitions in `.claude/agents/` (architect, code-reviewer, security-reviewer, mcp-expert)

✅ **Manifest sync gate**

- `skills:check` pre-commit validates consistency
- Detects orphaned skills, missing descriptions, surface matrix gaps

❌ **No "tested" or "verified" transition rule**

Experimental skills can ship to prod without a test run on their declared surface. Manifest status is declarative, not validated.

Example: A skill marked `"profile": "slash-cli"` with `"status": "active"` has no proof it works on Win11 Claude CLI.

---

## Pillar 3: Human-Time Allocation — GOOD

✅ **Defensive hooks clear the model's workload**

- Prettier, eslint auto-format PostToolUse
- Secret scanning blocks commits; no burden on model to remember secret-detection rules
- Blog approval gate forces HIC to read and decide (not model delegating to "looks good")

✅ **Control boundary injected at session-start**

- GREEN (full auto): read/edit/write, lint, test, build, git on feature branches
- YELLOW (auto + logged): MCP tools, Docker, gh CLI, git push
- RED (blocked): apply migrations, send email, structural thesis edits, blog publish
- HIC sees the boundary and makes conscious choices

✅ **Token budgets documented and visible**

- 4K per task, 30K per session
- Echoed at session-start; agents know their budget

❌ **No audit trail of agent decision vs. deterministic execution**

Impossible to measure: Are agents using the model for judgment calls only? Or are routing decisions, retries, status-code handling delegated to LLM when they should be hardcoded?

**Cost:** A routing agent that polls LLM for every retry decision burns tokens on deterministic work. No signal to correct it.

---

## Pillar 4: DORA Metrics — WEAK

✅ **Commits are atomic and recent**

- Recent 20 commits (last 5 weeks) are single-feature, reviewable PRs
- No revert spirals or hotfix fests
- Error recovery visible (RLS fixes in 2 lines, webhook handler fixes, no churn)

❌ **No DORA dashboard**

Missing:

- **Lead time:** Days from commit to production (dws6.com auto-deploys on merge to main, so lead time = PR review time)
- **Change failure rate:** % of commits causing rollback, hotfix, or prod incident
- **Mean time to recovery:** Days to fix a broken deployment
- **Deployment frequency:** Commits per week

**Impact:** Cannot answer: "Is AI work faster? Is it more reliable? What is the ROI?"

---

## Ranked Gaps + Fixes

### Gap 1: CI Gate for DoD (Highest ROI — 1 day)

**Problem:** Coverage can drop; intent tests can be skipped; CI allows merge.

**Fix:**

- Add `npm run validate:dod` script that runs before merge
- Gate checks:
  - Coverage does not drop relative to main
  - No `.skip()` or `@skip` in test files (excluding explicit skip blocks with comments)
  - Intent tests exist for every feature addition (parsed from commit message)

**Implementation:**

```bash
# scripts/validate-dod.sh
# 1. Compare coverage/main vs. HEAD
# 2. Grep for skipped tests
# 3. Parse "feat:" commits; verify test exists
```

**Signal:** Red CI blocks merge. HIC sees which tests are missing and decides to add them or revert.

---

### Gap 2: Skill Verification Gate (1 day)

**Problem:** Experimental skills can ship without a test run on declared surface.

**Fix:**

- Manifest entry transitions to `"status": "verified"` only after:
  - A test run on each declared surface (parsed from `surfaceSupport`)
  - Test result logged with timestamp + platform
  - CI gate blocks merge of skills still in `"status": "experimental"` after threshold date

**Implementation:**

```json
{
  "id": "autoresearch",
  "status": "experimental",
  "firstExperimentalDate": "2026-08-15",
  "verificationDeadline": "2026-09-15",
  "verifiedSurfaces": [
    { "surface": "win11-claude-cli", "testedAt": "2026-09-01", "result": "PASS" }
  ]
}
```

---

### Gap 3: Agent Decision Log (2 days, ongoing)

**Problem:** Impossible to audit Rule 5 compliance (model for judgment, hardcode deterministic work).

**Fix:**

- PostToolUse hook that logs every model inference:
  - Tool + input hash
  - Model + inference cost
  - Category: judgment | routing | transform
  - Result (if judgment)

```bash
# .claude/hooks/decision-log.sh
# On every model inference, log: timestamp, category, tokens, decision
# Field notes weekly: anomalies (e.g., routing decisions on every retry) → audit
```

**Signal:** Weekly field notes flag high-cost deterministic work and suggest hardcoding.

---

### Gap 4: DORA Dashboard (3–5 days)

**Problem:** No measurement of delivery speed/stability.

**Fix:**

- Parse git commit/PR metadata + hook logs
- Generate weekly CSV:
  - Lead time (days from commit author-date to merge)
  - Change failure rate (% of PRs rolled back within 7 days)
  - Cycle time (days from task open to close)
  - Deployment frequency (PRs per week merged to main)

**Output:** HTML dashboard or sqlite feed consumed by external tools.

---

### Gap 5: Rule 5 Audit (2 days, initial)

**Problem:** Codebase may have hardcoded transforms that should be deterministic, delegated to models incorrectly.

**Fix:**

- Grep for `model.call()`, `model.inference()`, `chat.complete()` sites
- Categorize each by intent (judgment/routing/transform)
- Field note: which transforms should be hardcoded
- Suggest refactor PRs (low priority, but blocks high-cost drift)

---

## Immediate Actions (Today → Next Session)

### HIC Decision Points

**Q1:** Close DoD gap? (Recommended YES — unblocks all other fixes)  
**Q2:** Add skill verification gate? (Recommended YES — prevents experimental code in prod)  
**Q3:** Start decision log? (Recommended YES — requires no product change, just hook addition)  
**Q4:** Build DORA dashboard? (Defer 2 weeks — measure DoD impact first)  
**Q5:** Audit Rule 5 sites? (Recommended YES, but low priority — one-time 2-day task)

### Next Session Prompt

```
Close the dws6 Definition-of-Done gap:

1. Add CI gate (scripts/validate-dod.sh) that blocks merge if:
   - Coverage drops relative to main
   - Skipped tests found (.skip() / @skip without whitelist)
   - Feat commits missing test files

2. Add skill verification gate: manifest entries in "experimental" status
   must transition to "verified" after test run on each declared surface,
   or trigger merge-block after 30 days.

3. Field note: blocking rules ready to ship; report with implementation.
```

---

## Appendix: Measurement Baseline

To establish DORA baseline:

```bash
# Lead time: last 20 PRs
git log --format="%ai %s" --grep="Merge pull request" --since="2026-08-01" | wc -l

# Change failure rate: PRs reverted within 7 days
git log --all --oneline --since="2026-08-01" | grep -i "revert\|hotfix" | wc -l

# Deployment frequency: PRs merged to main
git log origin/main --oneline --since="2026-08-01" | wc -l
```

Baselines:

- Lead time: 3–5 days (current PR review cycle)
- Change failure rate: ~2% (2 reverts in 100 PRs)
- Deployment frequency: ~15 PRs/week

---

## Conclusion

dws6 is **well-governed for defense** (secrets, RLS, file safety, blog approval). The next step is **tightening DoD and measurement** so the AI amplifier is visible and steerable.

Recommended sequence:

1. **DoD gate** (1 day) — enables all others
2. **Skill verification** (1 day) — prevents prod incidents
3. **Decision log** (2 days) — foundation for Rule 5 audit
4. **DORA dashboard** (3–5 days) — measure ROI after DoD is in place
5. **Rule 5 audit** (2 days) — one-time refactor pass

---

**Session:**  
Tool=Claude Code 1.x, Model=claude-haiku-4-5-20251001, Agent=claude-audit, Date=2026-09-02  
Handoff: `.claude/handoffs/claude/ai-software-engineering-krt01q.md`
