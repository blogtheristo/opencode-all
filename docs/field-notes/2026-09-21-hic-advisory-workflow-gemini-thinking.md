---
Status: ACTIVE
---

# HIC in Action v2 — Gemini App Thinking replaces Boardy.ai for technical advisory

## What changed

HIC (Risto) has stopped routing technical-advisory work through Boardy.ai
(`@boardyai`) and moved that role to Gemini App (`@GeminiApp`) "thinking" mode.
Results are judged better and save cleanly into Google Docs, which is now the
capture point before work fans out to an execution LLM/tool.

## New advisory → execution pipeline

```
Gemini App (thinking mode)
   -> technical/strategic advisory output
Google Docs
   -> capture + save (Workspace, per Productivity Stack Rule)
HIC judgment (per-task, not a fixed rule)
   -> routes the doc's content/prompt to ONE of:
      - OpenCode        (primary engineering runtime — full git/GH authority)
      - Claude Code / claude.ai  (standby engineering + complex reasoning)
      - GitHub Copilot  (in-IDE code suggestions)
```

Boardy.ai is retired from this loop. This does not change the Runtime Policy
(OpenCode primary, Claude Code standby, CLAUDE.md "Runtime Policy") — it changes
what feeds the _advisory_ stage upstream of either runtime, for DWS IQ platform
work specifically.

## Decisions

- `@boardyai` deprecated for DWS IQ technical advisory work.
- `@GeminiApp` (thinking mode) is now the advisory source; output lands in
  Google Docs as the durable capture artifact.
- Next-step tool (OpenCode / Claude Code / GitHub Copilot) is chosen by HIC
  judgment per task — no fixed routing rule exists yet.

## Facts used

- HIC statement, 2026-09-21 (this session).
- `CLAUDE.md` → Productivity Stack Rule: Google Workspace Docs/Sheets/Slides is
  the designated deliverable layer; repo `.md` stays source-of-truth once a
  decision is actioned into the codebase.
- `CLAUDE.md` → Runtime Policy: OpenCode primary / Claude Code standby —
  unaffected by this change; this note is about the advisory stage that
  precedes either runtime.

## HIC action

1. The routing criteria are currently "HIC judgment," not written down. Per the
   Skill Codification Rule ("Asked Twice = Failure"): if the same task-type →
   tool decision gets made the same way a few more times, it's a candidate for
   a small `skills/advisory-routing/SKILL.md` (task type → recommended tool)
   instead of re-deciding from scratch each time. No action needed now —
   flagging for if/when the pattern repeats.

N/A — KB/Learn/Drive/Calendar steps skipped: this is a process note about the
HIC's own tool workflow, not new code, an artifact, or a dated commitment
(Rule 12, fail loud on the skip rather than omitting it silently).
