# Handoff — cursor/dgx-ollama-litellm-router-a455

**Branch:** `cursor/dgx-ollama-litellm-router-a455`  
**Task:** Map HIC DGX + Ollama + LiteLLM local-first paste onto deployed DWS routing, using matched DWS standards  
**State:** READY-FOR-REVIEW  
**PR:** https://github.com/blogtheristo/dws6/pull/2039  
**Date:** 2026-09-18  
**Highest HIC question on this branch:** Q1 ACCEPTED A

***

# VERSION AND AGENT HISTORY

Version: 1.5

Sessions & Modifications:

- Version: 1.5 | Tool: Cursor Grok 4.6 | Session: cursor/dgx-ollama-litellm-router-a455 | Date: 18.09.2026 | Changes: [Latest] Copilot remaining four: Docker `OLLAMA_API_BASE` + `extra_hosts`; six-id lint `--check`; Model Standard v1.2 `FRONTIER-CLAUDE-OPUS` = Opus 4.8 / `claude-opus-4-8`; Deputy compose no floating LiteLLM image.
- Version: 1.4 | Tool: Cursor Grok 4.6 | Session: cursor/dgx-ollama-litellm-router-a455 | Date: 18.09.2026 | Changes: [not latest] HIC accepted Q1 A. Spark digest + OLLAMA_API_BASE explained in Admin v3.19. Merge remains a GitHub click (this agent cannot merge).
- Version: 1.3 | Tool: Cursor Grok 4.6 | Session: cursor/dgx-ollama-litellm-router-a455 | Date: 18.09.2026 | Changes: [not latest] Copilot #2039: OLLAMA_API_BASE on every local alias; claude-opus-4-8; six bare deprecated ids; Deputy-Agents compose `:main-latest` removed.
- Version: 1.2 | Tool: Cursor Grok 4.6 | Session: cursor/dgx-ollama-litellm-router-a455 | Date: 18.09.2026 | Changes: [not latest] Added Document Standard `VERSION AND AGENT HISTORY` heading so Level 4 CI grep passes (handoff template used `Version & Agent History`).
- Version: 1.1 | Tool: Cursor Grok 4.6 | Session: cursor/dgx-ollama-litellm-router-a455 | Date: 18.09.2026 | Changes: [not latest] Truth row 40, Model §9 local-sovereign, Admin v3.17, Q1 form.
- Version: 1.0 | Tool: Cursor Grok 4.6 | Session: cursor/dgx-ollama-litellm-router-a455 | Date: 18.09.2026 | Changes: [not latest] Config + aliases + field note; no Ollama pull.

| Version      | Date       | Changes                                                      | Agent           |
| ------------ | ---------- | ------------------------------------------------------------ | --------------- |
| [Latest] 1.5 | 2026-09-18 | Copilot remaining four: Opus 4.8, extra_hosts, lint, no floating image | Cursor Grok 4.6 |
| 1.4          | 2026-09-18 | [not latest] HIC accepted Q1 A; Admin digest explanation     | Cursor Grok 4.6 |
| 1.3          | 2026-09-18 | [not latest] Copilot: OLLAMA_API_BASE, opus-4-8, bare ids     | Cursor Grok 4.6 |
| 1.2          | 2026-09-18 | [not latest] Document Standard VERSION AND AGENT HISTORY heading | Cursor Grok 4.6 |
| 1.1          | 2026-09-18 | [not latest] Truth row 40, Model §9, Admin v3.17, Q1         | Cursor Grok 4.6 |
| 1.0          | 2026-09-18 | [not latest] Config + aliases + field note; no Ollama pull   | Cursor Grok 4.6 |

Document Status:

- Created: 18.09.2026
- Last Modified: 18.09.2026
- Language: English
- Publication Status: ACTIVE
- Classification: INTERNAL
- Document Type: Session handoff

***

## Task

Persist the 2026-09-18 local-first LiteLLM paste without rebuilding the stack, without undeployed model pulls, without secrets in yaml, without installing Ollama on Cursor Cloud. HIC: always use DWS standards; Truth Standard; update standards; update Admin docs.

## State

- **What's done:** LiteLLM yaml; Truth row 40; Model v1.2 (`FRONTIER-CLAUDE-OPUS` = Opus 4.8); Library v1.14; Admin v3.21; Q1 **ACCEPTED A** (HIC 18.09.2026). Copilot remaining four closed on this branch.
- **What's in progress:** HIC GitHub merge of #2038 and #2039.
- **What's blocked:** Spark digest pin (operator, not this VM).

## Next steps

1. HIC clicks Merge on #2038 and #2039 (this agent cannot merge protected branches).
2. On the Spark only: pin LiteLLM digest + set `OLLAMA_API_BASE` if using `:4000`.
3. Do not pull undeployed paste models.

## Notes for next session

Deployed models remain `nemotron-3-super` + `qwen3-coder:30b`. NemoClaw must not use LiteLLM alias `smart`. TED/sales-outreach is PR #2038 on a different branch.
