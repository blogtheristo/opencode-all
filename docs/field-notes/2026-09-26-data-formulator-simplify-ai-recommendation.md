# Field Note — Microsoft Data Formulator: Simplify AI Data Analysis (Recommendation)

---

# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:

- Version: 1.0 | Tool: Claude Code | Session: claude/simplify-ai-field-note-fjmdf9 | Date: 26.09.2026 | Changes: [Latest] Initial assessment of microsoft/data-formulator as a way to simplify AI-driven data analysis in DWS IQ. Recommendation: internal DGX pilot, not a product component.

Session Links & References:

- Repo: https://github.com/microsoft/data-formulator
- Releases: https://github.com/microsoft/data-formulator/releases
- Architecture (third-party summary): https://deepwiki.com/microsoft/data-formulator
- `DWS_MODEL_STANDARD.md` §9 — `local-sovereign` vs `smart` LiteLLM aliases
- `DWS_COST_POLICY_STANDARD.md` — DGX-first compute (Non-Negotiable Rule 14)

Document Status:

- Created: 26.09.2026
- Last Modified: 26.09.2026
- Language: English
- Publication Status: ACTIVE (private — internal tool assessment)
- Status: PENDING_REVIEW

---

**Type:** Field Note / Tool Assessment
**Owner:** Lifetime Oy · Risto Anton Päärni

## Recommendation (print summary)

**Adopt as an internal analyst tool on DGX Spark. Do not embed it in DWS IQ products.**

1. Run it on DGX Spark via Docker, sandbox mode = `docker`.
2. Point it at LiteLLM `local-sovereign` for any customer data; `smart` only for public data.
3. Use it for three jobs: Firehorse report exploration, investor/market charts, customer demo data prep.
4. Re-evaluate for product use when 0.8 is stable and code-signed.

## What it is

| Fact        | Value                                                                                                                                                                                    | Source                                          |
| ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------- |
| Purpose     | AI-assisted data exploration: load data, ask in natural language, get charts + transformations                                                                                           | GitHub README                                   |
| License     | MIT (commercial use allowed)                                                                                                                                                             | GitHub README                                   |
| Maturity    | Stable 0.7; 0.8.0 beta 1 released 15.08.2026                                                                                                                                             | GitHub README                                   |
| Adoption    | ~17.3k stars                                                                                                                                                                             | GitHub, 26.09.2026                              |
| Stack       | TypeScript frontend, Python backend, DuckDB in-process                                                                                                                                   | GitHub README                                   |
| Models      | OpenAI, Azure, Anthropic, Ollama via LiteLLM                                                                                                                                             | GitHub README                                   |
| Data in     | CSV/TSV/Excel/JSON, screenshots, text, databases, Databricks                                                                                                                             | GitHub README                                   |
| Install     | `uvx data_formulator`, `pip install data_formulator`, or `docker compose up --build`                                                                                                     | GitHub README                                   |
| Code safety | AI-generated Python runs in a sandbox: local subprocess with audit hooks, or disposable Docker container (read-only workspace, CPU/memory/PID limits); code signing, auth, rate limiting | Releases / DeepWiki (propagated, not code-read) |

## Why it simplifies AI for us

- **One loop instead of three tools.** Load → ask → chart → refine replaces notebook + BI tool + manual prompt work.
- **Fits our stack without new vendors.** LiteLLM + Ollama are already our routing layer (`config/litellm-config.yaml`); DuckDB needs no server.
- **Branching exploration** keeps each analysis step traceable — useful evidence for EU AI Act Art. 12 logging discussions.
- **MIT license** — no lock-in, forkable.

## Risks

| Risk                                                | Severity | Mitigation                                                         |
| --------------------------------------------------- | -------- | ------------------------------------------------------------------ |
| Executes LLM-generated Python on the host           | High     | Use Docker sandbox only; never local sandbox on shared hosts       |
| Customer data sent to cloud models                  | High     | Force `local-sovereign` alias; block `smart` for customer datasets |
| Beta release (0.8), unsigned desktop builds         | Medium   | Pin 0.7 stable or a tagged 0.8 image; no desktop builds            |
| Microsoft research project — roadmap not guaranteed | Low      | MIT allows fork; keep usage internal                               |
| Security claims unverified by us                    | Medium   | Read sandbox code before pilot (not done this session)             |

## Why not a product component

DWS IQ sells governed agent decisions (KYA, audit trail, sovereignty). Data Formulator is an analyst UI with its own auth and execution model. Embedding it adds a second code-execution surface outside KYA gates. Value to customers is low versus the security review cost.

## Pilot plan (2 weeks, DGX)

1. `docker compose up` on DGX Spark behind existing internal access.
2. Configure LiteLLM endpoint, alias `local-sovereign`.
3. Test with one public dataset and one Firehorse report export.
4. Success = a chart-ready answer in under 5 minutes with no cloud egress (verify in LiteLLM logs).

## Honest gaps

- Sandbox and code-signing details come from release notes and a third-party wiki; source code not read.
- No benchmark of local models (`nemotron-3-super`, `qwen3-coder:30b`) on its prompts yet — quality may drop versus GPT/Claude.

## HIC decision (Step 5)

**Approve the 2-week internal DGX pilot with `local-sovereign` only — yes or no?**

## Learning-loop steps

- KB update: N/A — pending HIC decision.
- Learn/ HTML: rendered to `Learn/2026-09-26-data-formulator-simplify-ai-recommendation.html`.
- Drive export: N/A — no Drive write in this cloud session.
- Calendar: N/A — no dated commitment until pilot approved.
