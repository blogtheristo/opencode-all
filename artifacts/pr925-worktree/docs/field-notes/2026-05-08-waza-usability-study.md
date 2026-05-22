---
title: "Waza Usability Study"
date: 2026-05-08
author: Claude (claude-sonnet-4-6)
source: https://github.com/microsoft/waza
version-studied: 0.31.0
---

# Waza Usability Study

Waza is a Go CLI from Microsoft for evaluating AI agent Skills — scaffold eval suites,
run benchmarks, and compare results across models. This study examines it from a DWS
perspective: could we adopt it to test our `.claude/commands/` skills, and if so, what
friction would we hit?

---

## TL;DR

Waza is impressively complete for a v0.x tool. The core loop (init → new → run → compare)
is well-designed and the YAML eval spec is expressive. The main usability friction is the
**executor lock-in** (GitHub Copilot SDK required for real runs), **opaque error messages**
on YAML validation failures, and a **steep YAML learning curve** before you can write your
first non-trivial test. For DWS, the grader system and CI/CD integration are directly
adoptable; the executor layer would need a Claude/Anthropic adapter.

---

## 1. Installation

**Binary install (recommended path):**

```bash
curl -fsSL https://raw.githubusercontent.com/microsoft/waza/main/install.sh | bash
```

The install script is clean: detects OS/arch, downloads from GitHub Releases, verifies
checksum, installs to `/usr/local/bin` or `~/bin`. Works on Linux, macOS, Windows
(MINGW/MSYS). No Python dependency, no `npm install`, no `go install` — a single binary.

**Source build caveat (real friction):** `go install` is explicitly blocked because the
repo uses Git LFS for embedded Copilot SDK binaries. You must `git lfs pull` before
`go build`, which is a non-obvious requirement that only surfaces as a linker error.

**azd extension path:** Waza also ships as an Azure Developer CLI extension, which adds
`azd waza ...` prefix. Fine for Azure-first shops but adds a second installation surface
and docs split.

**Score: 8/10** — binary install is great; source build LFS trap is a gotcha.

---

## 2. Onboarding & First-Run Experience

### waza init

```
waza init my-project
```

Creates: `skills/`, `evals/`, `.github/workflows/eval.yml`, `README.md`, `.gitignore`.
Clean scaffolding, but the generated `README.md` is sparse — it explains the structure
without a working example.

### waza new skill / waza new eval

`waza new skill code-reviewer` creates `SKILL.md` + index stub.
`waza new eval code-reviewer` scaffolds `eval.yaml`, `tasks/`, `fixtures/`, `graders/`.

The **interactive wizard** (`charmbracelet/huh` forms) collects skill name, description,
trigger/anti-trigger phrases, and skill type. This is a strong UX choice — it prevents
the most common authoring mistake (blank YAML fields) and automatically wires trigger
phrases into the eval.

**Gap:** The wizard does not handle non-TTY gracefully enough for piped/CI invocation.
The code uses `form.WithAccessible(true)` for non-TTY, which switches to plain-text
prompts, but this is not documented anywhere visible to the user.

### Example-first path

The `examples/code-explainer/` directory is the strongest onboarding asset. It shows
the full directory layout (SKILL.md, eval.yaml, tasks/\*.yaml, fixtures/, trigger_tests.yaml)
and runs cleanly against the mock executor. First-time users who start here fare far
better than those who start from `waza init`.

**Score: 7/10** — wizard is a nice touch; the gap between scaffolded files and a
working first run is wider than it needs to be.

---

## 3. CLI Ergonomics

### Command surface (20 commands)

| Command    | Purpose                            | Notes                           |
| ---------- | ---------------------------------- | ------------------------------- |
| `run`      | Execute eval                       | Core command; richest flag set  |
| `init`     | Init project                       | Clean                           |
| `new`      | Scaffold skill or eval             | Good interactive wizard         |
| `check`    | Validate eval.yaml + skill quality | Underused by users, very useful |
| `compare`  | Compare two JSON result files      | Clear output table              |
| `coverage` | Show which skills have evals       | Useful for CI coverage gate     |
| `suggest`  | LLM-suggests eval improvements     | Requires copilot-sdk auth       |
| `quality`  | LLM-as-judge skill quality         | Requires copilot-sdk auth       |
| `models`   | List available models              | Thin but useful                 |
| `serve`    | HTTP dashboard + MCP stdio         | Dual-mode is a footgun (see §6) |
| `grade`    | Grade an existing transcript       | Useful for offline re-scoring   |
| `cache`    | Cache management                   | Dev ergonomics                  |
| `session`  | Inspect session logs               | Debug only                      |
| `results`  | Browse/filter results              |                                 |
| `tokens`   | Count tokens in skill/eval         | Quality hygiene                 |
| `coverage` | Skill eval coverage report         |                                 |
| `dev`      | Internal dev commands              | Not for users                   |

### run command flags (30+ flags)

The `run` command is powerful but the flag count is a usability risk. The most important
flags (`--context-dir`, `-v`, `--model`, `-o`) are well-named. However:

- `--output` (single file) vs `--output-dir` (timestamped dir) are mutually exclusive
  but both accepted silently — the error only fires at runtime.
- `--parallel` and `--workers` are separate flags but `--workers` silently does nothing
  without `--parallel`, with no warning.
- `--model` can be repeated (runs multiple models in sequence), but this behavior is only
  discoverable via the README, not `--help`.

**Missing:** a `--dry-run` flag that validates the YAML and counts tasks without executing.
`waza check` partially fills this gap but does not resolve task globs.

### Help text quality

`waza --help` and subcommand `--help` are adequate — Cobra-generated with non-trivial
`Long` descriptions. Error messages on flag misuse are Cobra defaults (terse but correct).

**Score: 7/10** — rich command set with some flag surface ergonomic gaps.

---

## 4. Eval YAML Authoring

This is the center of the Waza UX. The eval spec has two levels:

- **eval.yaml** — top-level spec (name, config, metrics, global graders, task glob)
- **tasks/\*.yaml** — individual test cases (id, name, inputs.prompt, inputs.files,
  expected.output_contains, graders)

### Strengths

- **Strict YAML parsing** (`decoder.KnownFields(true)`) — unknown fields are rejected
  with a clear error instead of silently ignored. This catches typos like `output-contains`
  instead of `output_contains`.
- **JSON Schema** (`schemas/eval.schema.json`) published and referenced in `.waza.yaml`
  via `yaml-language-server` comment — gives VS Code YAML extension live validation.
- **Dual alias support** — `BenchmarkSpec`/`EvalSpec`, `TestStimulus`/`TaskStimulus`
  etc. are maintained as type aliases, so older eval files still parse.
- **`prompt_file`** — prompts can be externalized to files, keeping task YAML clean for
  long prompts. Security is enforced: absolute paths and `..` traversal are rejected.

### Friction points

**1. Required fields not documented in `--help`:** The five required top-level fields
(`name`, `skill`, `config`, `metrics`, `tasks`) are only in the JSON Schema and docs
site — not in `waza init`-generated comments or in `waza check` output. First-timers
hitting `trials_per_task must be at least 1, got 0` do not know which field they missed.

**2. Config defaults not applied:** If `config.trials_per_task` is omitted, the YAML
parser sets it to `0` (Go zero-value) and validation immediately rejects the file with
a confusing error. The fix — default to `1` — is not implemented; users must always
write `trials_per_task: 1` explicitly.

**3. Grader config nesting:** Task-level graders use `config:` as the key for parameters,
but different grader types expect entirely different sub-fields. `waza check` validates
these, but the error messages reference internal type names (`expected InlineScriptGraderParameters`)
rather than the YAML field path the user should fix.

**4. `tasks_from` field underdocumented:** This field lets a task YAML include tasks
from another file. It exists in the schema and struct but is absent from the docs site
and the scaffold. Users who need dataset-driven evaluation won't find it.

**Score: 7/10** — strict parsing and JSON Schema are excellent; zero-value defaults and
internal type names in errors are rough edges.

---

## 5. Grader System

12 grader types, ranging from simple to sophisticated:

| Grader                  | Complexity | When to use                                             |
| ----------------------- | ---------- | ------------------------------------------------------- |
| `text`                  | Low        | Regex/substring output checks                           |
| `code`                  | Low-Med    | Python assertions against execution context             |
| `file`                  | Low-Med    | Workspace file existence/content                        |
| `behavior`              | Low-Med    | Tool call count, token budget, required/forbidden tools |
| `diff`                  | Med        | File snapshot comparison                                |
| `json_schema`           | Med        | Structured output validation                            |
| `action_sequence`       | Med        | Tool call order (exact / in_order / any_order)          |
| `tool_calls`            | Med        | Tool invocation patterns                                |
| `tool_constraint`       | Med        | Allow/reject tool lists                                 |
| `skill_invocation`      | Med        | Dependent skill invocation chains                       |
| `trigger`               | High       | Prompt-to-skill relevance scoring                       |
| `prompt` (LLM-as-judge) | High       | Rubric-evaluated quality via LLM                        |
| `program`               | High       | External script grader (exit code)                      |

The `action_sequence` grader computes precision, recall, and F1 scores — this is a
standout design that gives quantitative feedback beyond pass/fail.

The `program` grader (external script via exit code) is a useful escape hatch for
custom logic that doesn't fit other graders.

**Friction:** The `prompt` (LLM-as-judge) grader requires the copilot-sdk executor and
a live model, which means it cannot be used in mock/CI mode. There is no graceful
degradation — the eval simply fails if the LLM is unavailable. A `--skip-llm-graders`
flag would improve CI story.

**Score: 9/10** — grader system is the strongest part of Waza; the LLM-grader/CI split
is a known limitation with a feasible workaround.

---

## 6. Executor Model

Two executors:

- **`mock`** — deterministic, fast, no auth required. Mock responses include task
  metadata and file content previews (1KB). Good for CI. Limitation: mock output
  is synthetic — it cannot validate real agent reasoning.
- **`copilot-sdk`** — wraps `github/copilot-sdk/go`, embedded as LFS binary. Requires
  GitHub Copilot auth. This is the real integration test executor.

**The executor lock-in is the biggest usability barrier for non-GitHub shops.**

Waza's entire real-model path is gated on the Copilot SDK. There is no OpenAI, Anthropic,
or Ollama executor. The `AgentEngine` interface is clean and well-defined, so adding an
Anthropic/Claude adapter is feasible — but it requires building and maintaining the
integration yourself.

For DWS/Lifetime context: the `mock` executor would work well for YAML validation and
structural tests, but any quality assertion or trigger accuracy measurement against a
real Claude model would require writing a `ClaudeEngine` that wraps the Anthropic SDK.

**The `waza serve` dual-mode design** (MCP stdio server + HTTP dashboard, same binary,
same port flag) is a footgun: MCP stdio mode only activates when `stdin` is a terminal
(`term.IsTerminal()`). In Docker or backgrounded processes stdin is not a TTY, so MCP
mode silently falls back to HTTP mode. This was fixed in 0.31.0 but the behavior is
not prominently documented.

**Score: 5/10 for DWS** — architecture is clean; Copilot-only real execution is a hard
wall for non-Microsoft toolchains.

---

## 7. Dashboard & serve Mode

`waza serve` starts an HTTP server (`default: 3000`) with a React dashboard for browsing
eval results. The `web/` folder uses Astro + Playwright e2e tests.

**Strengths:**

- Results are stored as JSON and browseable without re-running evals
- The dashboard surfaces per-task pass/fail, scores, and grader feedback

**Weaknesses:**

- No auth — the dashboard is open to anyone on the network. For a local dev tool this
  is fine; for a shared CI server it is a risk.
- The MCP server mode (JSON-RPC 2.0 via stdio) is a promising integration point but
  the docs are thin: no example of how to connect Claude Code or Copilot to it.
- `--results-dir` defaults to `./results/` but the config file (`waza serve.resultsDir`)
  is separate from the CLI flag, creating two configuration surfaces.

**Score: 6/10** — useful for solo dev; not production-ready for shared/team use.

---

## 8. CI/CD Integration

Waza ships a `.github/workflows/waza-eval.yml` template. The workflow:

- Installs waza binary via install.sh
- Runs `waza run` against a specified eval.yaml
- Uploads results as artifact
- Fails the PR if any task fails (exit code 1 = test failure, exit code 2 = config error)

The exit code design (`ExitSuccess=0`, `ExitTestFailed=1`, `ExitError=2`) is clean — CI
can distinguish "eval ran but tasks failed" from "eval misconfigured" without parsing
output.

**Gap:** No matrix strategy example for multi-model comparison in CI. The `--model`
flag can be repeated (runs model A then B in sequence), but a parallel matrix job that
compares model results requires manual workflow authoring.

**Score: 8/10** — well-designed exit codes; multi-model CI matrix left to the user.

---

## 9. Documentation Quality

| Asset                   | Quality   | Notes                                                      |
| ----------------------- | --------- | ---------------------------------------------------------- |
| README.md               | Good      | Commands table, quick-start, examples                      |
| DEMO-SCRIPT.md          | Excellent | Step-by-step demo with expected outputs; rare in OSS       |
| AGENTS.md               | Excellent | Agent/AI coding instructions — a model for AI-native repos |
| site/ (Astro/Starlight) | Good      | Getting-started, guides, CLI reference, eval-yaml spec     |
| Inline --help           | Adequate  | Cobra defaults; Long descriptions present                  |
| Error messages          | Mixed     | Some reference internal Go type names                      |
| CHANGELOG.md            | Excellent | Detailed per-version, with issue refs                      |

The `AGENTS.md` file is a standout — it defines naming conventions, test requirements,
documentation checklist, and fixture isolation rules for AI coding assistants. This is
directly adoptable for DWS skill development.

The `DEMO-SCRIPT.md` with expected outputs per step is exceptional project hygiene.

**Score: 8/10** — unusually complete docs for a v0.x project; some internal leakage in
error messages.

---

## 10. Skill Quality Tooling

Beyond eval execution, Waza ships a compliance/quality subsystem for skill definitions:

- **`waza check <eval.yaml>`** — validates config, checks skill quality, runs compliance
  checkers (token budget, scope, module count, complexity)
- **`waza tokens <skill>`** — counts tokens in a SKILL.md, warns against limits
- **`waza quality`** — LLM-as-judge scoring of skill output quality
- **Token limit config** — `waza.yaml` sets `tokens.warningThreshold` and
  `tokens.fallbackLimit`; `waza check` flags skills over budget

The scope-reduction advisory check (`advisory_checks.go`) flags skills with overly broad
trigger descriptions. The module count checker warns when a skill has 4+ reference
modules (recommends consolidation). These are production-wisdom rules encoded in code —
directly useful for DWS skill authoring.

**Score: 9/10** — genuinely useful skill hygiene tooling baked into the core CLI.

---

## 11. DWS Adoption Assessment

### What we can use today (mock executor only)

- `waza new` wizard for creating DWS skill YAML scaffolding
- `waza check` for skill quality and token budget checks
- `waza tokens` for monitoring SKILL.md size
- `waza run --executor mock` for structural validation of task YAML
- `waza coverage` to see which skills have eval coverage
- The grader system (text, file, behavior, action_sequence, diff) for CI assertions

### What would require adaptation

- **Real-model eval** — needs a `ClaudeEngine` implementing `AgentEngine` interface.
  The interface is clean; the implementation would wrap `anthropic-sdk` (TypeScript or
  Go). Estimated effort: 2-3 days.
- **Skill format** — DWS skills use `.claude/commands/*.md` YAML frontmatter; Waza
  expects `SKILL.md` files with a different schema. A thin adapter or convention
  mapping is needed.
- **MCP server** — `waza serve` MCP mode could expose waza evals to Claude Code
  directly, but the integration docs are thin.

### What to borrow without adopting waza

- The `AGENTS.md` pattern (AI coding instructions with naming conventions, test
  requirements, fixture isolation rules) is worth adopting verbatim in DWS.
- The exit code design (0/1/2) for CI eval jobs.
- The `DEMO-SCRIPT.md` format for DWS skill demos.

---

## 12. Summary Scores

| Dimension             | Score      | Key issue                                             |
| --------------------- | ---------- | ----------------------------------------------------- |
| Installation          | 8/10       | LFS trap on source build                              |
| Onboarding            | 7/10       | Gap between scaffold and first working run            |
| CLI ergonomics        | 7/10       | 30+ flags on `run`; silent --workers/--parallel split |
| YAML authoring        | 7/10       | Zero-value defaults; internal type names in errors    |
| Grader system         | 9/10       | Best part of the project                              |
| Executor model        | 5/10       | Copilot-only lock-in                                  |
| Dashboard             | 6/10       | No auth; sparse MCP docs                              |
| CI/CD                 | 8/10       | Clean exit codes; no multi-model matrix example       |
| Documentation         | 8/10       | AGENTS.md + DEMO-SCRIPT.md are standouts              |
| Skill quality tooling | 9/10       | Token budget + scope checks are genuinely useful      |
| **Overall**           | **7.4/10** | Strong foundation, executor lock-in is the ceiling    |

---

## Recommended Next Step for DWS

If we want to use Waza for skill testing, the highest-leverage move is writing a
`ClaudeEngine` that wraps the Anthropic SDK and implements the `AgentEngine` interface.
That unlocks real-model evals for our `.claude/commands/` skills. The interface is
10 methods; the implementation is ~200 lines. Everything else in the Waza stack — graders,
YAML format, CI integration, quality checks — is immediately usable once we have a Claude
executor.

---

# VERSION AND AGENT HISTORY

| Version | Date       | Agent             | Change                                  |
| ------- | ---------- | ----------------- | --------------------------------------- |
| 1.0     | 2026-05-08 | claude-sonnet-4-6 | Initial usability study of Waza v0.31.0 |
