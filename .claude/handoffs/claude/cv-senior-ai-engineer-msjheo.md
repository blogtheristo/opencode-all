# Handoff: claude/cv-senior-ai-engineer-msjheo

## What happened

User pasted a LinkedIn "Job match is low — SENIOR AI/ML ENGINEER" report: 1 of 10 required
qualifications matched (only cloud expertise), 3 of 4 additional. Asked to improve CV 165
(originally `bids/ORK160826/CV_ORK160826_v165.md` — **renamed to `CV_ORK160826_v170.md`
on 13.07.2026** per the new DWS_DOCUMENT_STANDARD.md §4.6 filename-version-sync rule; the
file kept its version bumping internally without ever being renamed, drifting 165→170
across 5 sessions before it was caught), incorporating Microsoft Founders Hub work and
GitHub evidence from blogtheristo/dws6.

## What I did

1. Researched the actual codebase for hard evidence against each of the 10+4 LinkedIn
   qualifications (not marketing language — file paths, line counts, verifiable facts):
   - ML production pipeline: `workflow/02_clean_and_eda.py` + `workflow/03_model_train.py`
     (scikit-learn, 5-fold CV, feature importance, F1)
   - Agentic/MCP/A2A: `src/agents/base.agent.ts` (agent loop, tool use, `delegate_to_agent`),
     `src/agents/index.ts` (explicit "A2A protocol compatibility"), 3 production MCP servers
   - Evals as code: `src/evals/eval-runner.ts`, `tools/waza-claude` (Anthropic executor for
     Waza eval framework), `scripts/daily/run-evals.sh`
   - Guardrails/prompt injection: `.claude/hooks/pretooluse-guard.sh`,
     `secret-output-scan.sh`
   - RAG in production: Lifetime World Model pgvector, 15k+ EU regulatory docs
   - GitHub-verified via MCP: 1264 total PRs / 1107 merged in blogtheristo/dws6 (12.07.2026)
2. Added a new "Senior AI/ML Engineer — Kelpoisuusnäyttö" section to CV v165→166 mapping
   every requirement to concrete evidence, with two items honestly flagged as gaps
   (rerankers, formal drift/A-B testing, stream processing) rather than fabricated.
3. Corrected an overstated "1500+ PR / 6000+ committia" claim to the GitHub-verified
   1100+ merged / 1264 total.
4. Fixed a Microsoft Founders Hub date inconsistency (CV said 2017/2022/2020 in three
   different places; canonical evidence note `Learn/evidence/2021-2025-Microsoft-Founders-Hub-profile.md`
   says Level 1 confirmed 2021, Level 4 = USD 153,000). Aligned the cert table row and the
   Lifetime World paragraph to 2021–2025 / Level 4 / USD 153,000.
5. Version bumped 165→166 with full changelog entry per DWS_DOCUMENT_STANDARD convention
   already used in this file's own history block.

## Not done / left alone (scope discipline)

- `ORK_Risto_CV_FI_165.md`, `.html`, `.docx` in the same folder are stale duplicates/exports
  — not synced. No dual-folder-sync rule covers this pair; regenerating docx/html needs a
  pandoc pass this session didn't have a script for.
- Did not touch the Marketing-table Founders Hub row (line ~432, "05/2020–") or the
  Career Highlights narrative (line ~222, "03/2020") — different narrative context
  (project timeline vs. personal program enrollment), fixing those was out of scope for
  a surgical CV-qualification-match task.
- Did not rename the RFP-facing "AI Engineer" role commitment (line 29) to "Senior AI
  Engineer" — that string matches Cubet/ORK's formal RFP role taxonomy
  (`ORK160826_CUBET_KYVYKKYYDET.md`); changing it risked a bid-compliance mismatch.

## Next steps if resumed

- Regenerate `ORK_Risto_CV_FI_165.html`/`.docx` from the updated `.md` if those are what
  actually gets submitted/exported (check which file is the real submission artifact).
- If the actual LinkedIn job posting is available, verify the 10 qualification bullets
  against its exact wording (the report format suggests they were auto-summarized).
