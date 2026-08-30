# Next session — continue the dws6 PR backlog cleanup (boss role)

You are the boss/orchestrator. Ollama on DGX Spark is unreachable from cloud (no ssh) —
run as Opus + READ-ONLY `general-purpose` subagent fleet. Read
`docs/field-notes/2026-07-26-pr-backlog-orchestration-cleanup.md` and
`.claude/handoffs/claude/ollama-orchestration-merge-047pj7.md` first. Work on branch
`claude/ollama-orchestration-merge-047pj7` (rebase it onto latest main first).

Guardrails: subagents STRICTLY READ-ONLY (no close/merge/comment/push). Two-pass `get`
for real mergeable_state. Doc-only+clean still needs a content-safety pass (sender identity
= risto.paarni@lifetime.fi for outreach, NEVER paarni2024@ outbound; no PII; no .md in
public-site folders). Every new CREATE TABLE needs table GRANTs to service_role/authenticated.
Every GitHub comment ends with the Claude Code attribution footer.

Do, in order:

1. CLOSE the 63 V2-source stale branches (the V2_PROMPT PRs from the field note), each with:
   "superseded — the intent is carried to a next-prompt-v2 redo against current main". Batch it.

2. KEEP_REVIEW (30) → review + fix + test + compile + merge to production:
   - Re-run the READ-ONLY review fleet on the ~24 not yet reviewed (R2 already did:
     #1503 MERGE_READY, #1528 FIX-add-GRANTs, #1548/1526/1504/1498 REBASE).
   - For MERGE_READY: `npm run build` (tsc) + `npm test` (vitest) green → merge.
   - For FIX_NEEDED: apply the punch-list fix, build+test, then merge. #1528 = add the
     standard GRANT block from Firehorse/supabase-schema-templates.sql to migration 070.
   - For REBASE_NEEDED: rebase onto main, resolve, build+test, merge.
   - CEO review (use /plan-review ROLE=ceo) BEFORE merging: #1553 (Aiven CLOUD-Act legal
     claim), #1287 (Aegis hackathon public page), #1122 (Captain-tier pricing/dual-folder),
     #1708 (lifetime.fi homepage swap + GDPR PII capture).
   - Priority security redos from the V2 bundle: #1453 (Dependabot RCE), #1283, #1213
     (re-enable disabled security scans).

3. Sender decision (field note §8): confirm with the HIC whether canonical outbound is
   (a) risto.paarni@ as a verified GWS "Send mail as" alias, or (b) recognise paarni2024@
   in CLAUDE.md. Then unblock/fix #1698 and #1664 accordingly.

4. dws7 — same triage+cleanup treatment (still untouched).

Checkpoint after each merge (commit/push). Do the DWS Learning Standard HIC Learning
Outcome at session end. Never force-push another PR's branch; apply redos on fresh
claude/<slug> branches. Never merge code that fails build or test.
