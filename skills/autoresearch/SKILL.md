# Skill: autoresearch

**Trigger:** User says "autoresearch", "auto research", "optimize skill", "run autoresearch on [skill]", "improve [skill] overnight", "autonomous skill optimization", "research loop on [skill]", "run experiments on [skill]".

**Purpose:** Autonomously optimize DWS Claude Code skills by running them repeatedly, scoring outputs against binary evaluations, mutating prompts, and retaining improvements. Adapted from [Karpathy's autoresearch](https://github.com/karpathy/autoresearch) and [olelehmann1337/autoresearch-skill](https://github.com/olelehmann1337/autoresearch-skill) for the DWS skill system.

---

## Input Contract

```
TARGET      - skill name to optimize (must exist in skills/<name>/SKILL.md)
INPUTS      - 3–10 test inputs (diverse, representative cases)
EVALS       - 3–6 binary yes/no evaluation criteria (see Eval Guide below)
RUNS        - runs per experiment (default: 3)
CYCLES      - max experiment cycles (default: 10)
BUDGET_EUR  - max EUR spend estimate (default: 1.00)
HOST        - where to run: local | gn100 (default: local)
```

---

## Output Contract

```
outputDir        - path: autoresearch-<skill-name>/
status           - done | budget-exhausted | max-cycles | perfect-score
baselineScore    - initial pass rate (e.g., 4/6)
finalScore       - best achieved pass rate (e.g., 6/6)
cyclesRun        - number of completed experiment cycles
topChanges       - list of mutations that improved score
failurePatterns  - remaining failure modes (empty on perfect score)
```

### Artifacts

| File                | Purpose                                |
| ------------------- | -------------------------------------- |
| `dashboard.html`    | Live HTML dashboard (auto-refresh 10s) |
| `results.json`      | Structured experiment data             |
| `results.tsv`       | Tab-separated score log                |
| `changelog.md`      | Mutation history with reasoning        |
| `SKILL.md.baseline` | Original skill before mutations        |

---

## How It Works

```
User triggers /autoresearch TARGET=<skill>
     │
     ▼
┌─ Phase 1: GATHER CONTEXT ──────────────────┐
│ Confirm: target skill, test inputs, evals,  │
│ runs per experiment, cycle cap, budget cap   │
│ Read SKILL.md + referenced materials         │
└─────────────────────────────────────────────┘
     │
     ▼
┌─ Phase 2: BUILD EVAL SUITE ─────────────────┐
│ Create 3–6 binary yes/no checks              │
│ No scales, no vibe checks — binary only      │
│ Each eval: Question / Pass criteria / Fail   │
└─────────────────────────────────────────────┘
     │
     ▼
┌─ Phase 3: GENERATE DASHBOARD ───────────────┐
│ Build autoresearch-<skill>/dashboard.html    │
│ Auto-refresh 10s, score chart, experiment log│
└─────────────────────────────────────────────┘
     │
     ▼
┌─ Phase 4: ESTABLISH BASELINE ───────────────┐
│ Copy SKILL.md → SKILL.md.baseline            │
│ Run skill [N] times unchanged                │
│ Score all outputs against eval suite          │
│ Record baseline pass rate                    │
└─────────────────────────────────────────────┘
     │
     ▼
┌─ Phase 5: EXPERIMENT LOOP ──────────────────┐
│ WHILE score < 95% AND cycles < max           │
│   AND budget remaining:                      │
│                                              │
│   1. Analyze which evals fail and why        │
│   2. Form hypothesis (one change)            │
│   3. Mutate SKILL.md (single targeted edit)  │
│   4. Run skill [N] times                     │
│   5. Score against eval suite                │
│   6. IF improved → KEEP mutation             │
│      ELSE → REVERT to last good version      │
│   7. Log to changelog.md + results.tsv       │
│   8. Update dashboard.html                   │
│                                              │
│ CRITICAL: Never change multiple things       │
│ at once — isolate which mutation helped.      │
└─────────────────────────────────────────────┘
     │
     ▼
┌─ Phase 6: DELIVER RESULTS ──────────────────┐
│ Score improvement summary                    │
│ Top contributing changes                     │
│ Remaining failure patterns                   │
│ Updated SKILL.md (best version)              │
└─────────────────────────────────────────────┘
```

---

## Eval Guide

### The Golden Rule

Every eval must be a **yes/no question**. Not a scale. Not a vibe check. Binary.

Scales introduce too much variability across runs. Binary evals give dependable signal.

### Good Evals

| Category  | Bad                     | Good                                       |
| --------- | ----------------------- | ------------------------------------------ |
| Writing   | "Is the writing good?"  | "Does the output contain a CTA?"           |
| Code      | "Is it clean code?"     | "Does the output execute without errors?"  |
| Structure | "Is it well organized?" | "Does it contain all 3 required sections?" |
| Accuracy  | "Is it accurate?"       | "Does every claim cite a specific source?" |

### Eval Template

```
Eval N: [Question — yes/no]
  Pass: [specific observable condition]
  Fail: [specific observable violation]
```

### Anti-Patterns

- **7+ evals:** Skills optimize for passing tests, not quality
- **Overlapping checks:** Double-counting reduces signal clarity
- **Unmeasurable criteria:** "Is it professional?" — agents can't reliably assess
- **Overly rigid:** Arbitrary constraints produce stilted output

### The 3-Question Test

Before finalizing evals, verify:

1. Would two different reviewers score the same output identically?
2. Can the skill game this eval without actually improving?
3. Does passing this eval matter to the end user?

---

## Running on GN100 (DGX Spark)

When `HOST=gn100`, the skill runs experiments over SSH on the Acer Veriton GN100 / DGX Spark.

### Prerequisites

On gn100 (Ubuntu 24.04):

```bash
# Claude Code CLI
npm install -g @anthropic-ai/claude-code

# Python + uv (for Karpathy-style training experiments)
curl -LsSf https://astral.sh/uv/install.sh | sh

# Ollama (for local model eval)
# Should already be running — verify:
ollama list

# Mosh (for persistent mobile sessions)
sudo apt install mosh

# Tailscale (for mesh networking)
curl -fsSL https://tailscale.com/install.sh | sh
```

### SSH Execution Pattern

```bash
# From any device (laptop, iPhone via Blink Shell):
ssh dgx-spark "cd /path/to/dws6 && claude --print '/autoresearch TARGET=sitesense CYCLES=10'"

# Or interactive:
ssh dgx-spark
cd /path/to/dws6
claude
# Then: /autoresearch TARGET=sitesearch CYCLES=10
```

### Overnight Mode

```bash
# Start autoresearch in tmux on gn100, walk away
ssh dgx-spark
tmux new -s autoresearch
cd /path/to/dws6
claude --print '/autoresearch TARGET=compliance CYCLES=20 BUDGET_EUR=2.00'
# Ctrl-B D to detach

# Resume from any device:
ssh dgx-spark
tmux attach -t autoresearch
```

---

## Integration with DWS Skills

This skill operates on any `skills/<name>/SKILL.md` file. Common optimization targets:

| Skill              | Typical Evals                                                                  |
| ------------------ | ------------------------------------------------------------------------------ |
| `sitesense`        | Does output contain a numeric score? Is every finding actionable?              |
| `compliance`       | Does output list all applicable regulations? Does each gap have a remediation? |
| `material-oracle`  | Does output include EPD source? Is kgCO2e calculated per unit?                 |
| `firehorse-report` | Does output follow DWS Document Standard header? Are all sections present?     |

---

## Rules

1. **One mutation per experiment.** Never change multiple things simultaneously.
2. **Run autonomously.** Continue without pausing until stopped, budget reached, or 95%+ for 3 consecutive runs.
3. **Binary evals only.** No scales, no subjective assessments.
4. **Detailed logs.** Every experiment logged to results.tsv, results.json, changelog.md.
5. **Preserve baseline.** Always keep SKILL.md.baseline for rollback.
6. **Respect token budget.** Each experiment cycle counts against the session budget (Rule 6).
7. **KYA governance applies.** When running on gn100, Firehorse audit trail must be active.
