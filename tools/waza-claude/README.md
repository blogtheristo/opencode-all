# waza-claude

Anthropic Claude executor for [Waza](https://github.com/microsoft/waza) — lets you
run Waza skill evals against real Claude models instead of the GitHub Copilot SDK.

## What's in here

| File                             | Purpose                                                          |
| -------------------------------- | ---------------------------------------------------------------- |
| `claude_engine.go`               | `ClaudeEngine` implementing Waza's `AgentEngine` interface       |
| `cmd_run.patch`                  | Two-line patch wiring `executor: claude` into Waza's run command |
| `build.sh`                       | One-shot build script: clone Waza → patch → compile              |
| `examples/dws-compliance-check/` | Full example eval for the DWS `/compliance-check` skill          |

## Quick start

```bash
# Requires Go 1.26+ and ANTHROPIC_API_KEY
export ANTHROPIC_API_KEY=sk-ant-...
cd tools/waza-claude
./build.sh                  # produces ./waza-claude binary

# Run the example eval (real Claude call)
./waza-claude run examples/dws-compliance-check/eval.yaml \
  --context-dir examples/dws-compliance-check/fixtures \
  -v

# Fast CI smoke test (no API call, mock executor)
./waza-claude run examples/dws-compliance-check/eval.yaml \
  --context-dir examples/dws-compliance-check/fixtures \
  --executor mock \
  --task mock-smoke-001 \
  -v
```

## How it works

`ClaudeEngine` is a **single-turn executor**:

1. Creates a temp workspace and writes resource files into it
2. Loads `SKILL.md` content from `skill_directories` into a system prompt
3. Sends `(system, user_message + files)` to the Anthropic Messages API
4. Returns the text response as `ExecutionResponse.FinalOutput`

### Supported graders

| Grader                  | Works? | Notes                                         |
| ----------------------- | ------ | --------------------------------------------- |
| `text`                  | ✅     | Substring / regex on output                   |
| `code`                  | ✅     | Python assertions on output                   |
| `prompt` (LLM-judge)    | ✅     | Uses a separate judge model call              |
| `file`                  | ✅     | Checks files written to fixtures workspace    |
| `behavior` (max_tokens) | ✅     | Token count tracked via API usage             |
| `json_schema`           | ✅     | Validates structured JSON output              |
| `diff`                  | ⚠️     | Only fixture files, agent doesn't modify them |
| `action_sequence`       | ❌     | Tool call list is always empty (single-turn)  |
| `tool_constraint`       | ❌     | Same — no tool use in single-turn mode        |
| `skill_invocation`      | ❌     | Same — no skill dispatch in single-turn mode  |

Tool-call graders require an agentic executor (Copilot SDK or future
`ClaudeAgentEngine` with tool-use loop).

## Eval YAML config

```yaml
config:
  executor: claude # use this engine
  model: claude-sonnet-4-6 # or claude-opus-4-7, claude-haiku-4-5-20251001
  timeout_seconds: 120
  trials_per_task: 1
```

Override model at runtime:

```bash
./waza-claude run eval.yaml --model claude-opus-4-7
```

## Adding evals for other DWS skills

Pattern for any `.claude/commands/*.md` skill:

```
skills/<skill-name>/
  SKILL.md                 ← copy of the .claude/commands/<name>.md content
  eval.yaml
  tasks/
    task-001.yaml
  fixtures/
    context-file.md
```

Point `skill_directories` at your `skills/` folder in `eval.yaml`:

```yaml
config:
  skill_directories:
    - skills/
```

## Extending to agentic evaluation

To support `action_sequence` / `tool_constraint` graders, the next step is
`ClaudeAgentEngine` — a multi-turn executor that implements tool use (file
read/write, bash) using the Anthropic Messages API tool_use content blocks.
The `AgentEngine` interface is the same; only `Execute()` changes.

---

# VERSION AND AGENT HISTORY

| Version | Date       | Agent             | Change                                                             |
| ------- | ---------- | ----------------- | ------------------------------------------------------------------ |
| 1.0     | 2026-05-08 | claude-sonnet-4-6 | Initial ClaudeEngine + build script + DWS compliance-check example |
