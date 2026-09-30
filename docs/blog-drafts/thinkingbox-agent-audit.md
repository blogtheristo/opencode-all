Status: APPROVED
Slug: thinkingbox-agent-audit
Title: ThinkingBox: Auditing Agents Where They Matter
Language: en
Target: onelifetime.world/posts/thinkingbox-agent-audit.html (+ .fi .sv .de .fr)
Date: 2026-09-19
approved: 2026-09-30 (HIC, chat: "correct thinkingbox post" — factual correction of the published post)
kind: correction
correction_of: the post as published 19.09.2026
sources:
  - title: "One Success Isn't Reliability: Thinkingbox, a Sandbox and Benchmark for Agents in Stateful Business Workflows"
    authors: Ko, Y., Keramati, A., Ferri, N., et al.
    year: 2026
    venue: arXiv:2608.19741
    url: https://arxiv.org/abs/2608.19741
    type: academic
  - title: microsoft/thinkingbox-data
    authors: Microsoft
    year: 2026
    venue: GitHub
    url: https://github.com/microsoft/thinkingbox-data
    type: primary
  - title: Regulation (EU) 2024/1689 (Artificial Intelligence Act), Articles 12 and 14
    authors: European Parliament and Council
    year: 2024
    venue: Official Journal of the EU
    url: https://eur-lex.europa.eu/eli/reg/2024/1689/oj
    type: regulation

# Correction record — what changed in the published post (all five languages)

The first BLOG_STANDARD §17.2 external-source pass (30.09.2026) found that the published post
presented Microsoft's ThinkingBox-Bench as ours. Logged in `DWS_TRUTH_STANDARD.md` §6. The
corrected wording matches the sourced draft `done-is-evidence-not-a-claim` (PR #2286).

1. "Eval frameworks measure transcript quality. They do not measure outcomes."
   → "Many evaluations still check the transcript or the function call, not whether the work got done."
2. "At Lifetime, we've forked the repository, tailored it for revenue engines, and packaged it with DGX integration and 507 business-domain benchmarks."
   → "At Lifetime, we have forked the repository to run it against our own agents."
3. "We ship ThinkingBox-Bench with 507 executable tasks across five business domains: Outbound & GTM … Integration & Orchestration."
   → "Microsoft's ThinkingBox-Bench has 507 executable tasks across five business domains: retail and e-commerce, travel and hospitality, auto insurance, internal IT support at a neobank, and IT and HR support at a consulting firm. The strongest model in the paper passes 65 % of tasks on the first try and solves 91 % at least once in twenty attempts, but gets only 25 % right in all twenty. One success is not reliability."
4. "Each task includes synthetic records, expected outcomes, and pre-built MCP servers."
   → "Each task comes with expected outcomes and isolated MCP tool sessions."
5. DGX section: the claims that ThinkingBox-Bench already runs on DGX and gates every promotion, and the cloud-block date → "We are bringing the bench to the DGX, isolated from production data. That runner is work in progress, not yet a shipped configuration."
6. "Pass/fail on 507 tasks. Zero silent failures." → "Pass/fail on the bench's tasks."
7. The "Imagine … Tuesdays" scenario keeps its steps but drops the invented timings (6 hours, 2 minutes, 15 minutes).
8. Fork link description "MCP session proxy, agent/user/judge loop, 507 benchmarks, DGX runner config" → "our working fork".
9. A "Sources" list is added at the end.
