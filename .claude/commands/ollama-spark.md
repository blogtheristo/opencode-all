---
name: ollama-spark
version: 1.0
date: 2026-04-22
description: Route a prompt to DGX Spark Ollama when Anthropic/Groq limits hit or the prompt must stay in EU. Uses ssh dgx-spark + /api/generate. Also lists available models with --list.
---

Route a prompt to a local Ollama model on the DGX Spark (EU, on-prem) via SSH.

Usage: `/ollama-spark <model> <prompt>` — e.g. `/ollama-spark llama3.1:70b "Classify this CSRD disclosure..."`
Input: $ARGUMENTS

## When to use

1. Anthropic / Claude rate limits hit (429, quota exhausted) — fall back here
2. The prompt contains EU-restricted data (PII, GDPR, EU AI Act high-risk) that must not leave DGX Spark
3. Cost-sensitive batch inference (no per-token cloud billing)

## Steps

1. Parse `$ARGUMENTS` as `<model> <prompt>`. If user passes `--list`, list models instead.
2. If no model specified, default to `llama3.1:70b` (the DGX Spark default big model).
3. Invoke `bash scripts/ollama-spark.sh <model> "<prompt>"`.
4. Return the raw response on stdout.
5. If SSH or curl fails, print the error and suggest: (a) check `ssh dgx-spark` works, (b) check Ollama is running on Spark (`systemctl status ollama` over SSH), (c) run `/ollama-spark --list` to confirm the model is pulled.

## When NOT to use

- Interactive chat with history — this is one-shot `/api/generate`, not `/api/chat`. Use a direct session against the Spark for multi-turn.
- Prompts that need tool-use or MCP — Claude Code's own toolchain is still the right driver; use this only for pure text-in-text-out inference.
- If Anthropic is available and the data is not EU-restricted — use Anthropic for higher quality.

## Related

- `scripts/ollama-spark.sh` — the wrapper
- `Admin/GITHUB_APPS_AUDIT.md` §Replacing Continue with Claude Code — Pattern A/B
- CLAUDE.md §DGX Ollama Fallback Rule
