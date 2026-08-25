---
title: Backup and Restore Runbook
version: 1.0
created: 2026-08-24
last_modified: 2026-08-24
author: Lifetime Oy — HIC / ox-alpha session, manual ping-pong mode
language: en
languages_available: [en]
classification: INTERNAL
publication_status: ACTIVE
document_type: Engineering Runbook / Backup & Restore Standard
toc: true
toc-depth: 3
---

# Backup and Restore Runbook

***

# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:

- Version: 1.0 [Latest] | Tool: OpenCode 1.18.22 | Model: opencode/x-preview-f-free (ox-alpha) | Session: interactive HIC ping-pong (authored live with the founder) | Date: 24.08.2026 | Changes: Initial creation. Codifies the backup standard behind the PR #1888 recovery incident: 3-2-1 copies, pre-cycle recovery refs, worktree isolation canaries, gated destructive operations, off-host retention (7 daily + 4 weekly incl. git bundles), and weekly restore exercises. "Git has the parent commit" is not a backup — a restorable system is.

Session Links & References:

- Incident: PR #1888 merge collapsed main to a single-file tree (poisoned fixture commit `197daefdb`); recovered via `recovery/main-content` (PR #1889) from known-good `745267975`.
- Policy layer: `DWS_ENGINEERING_STANDARD.md` (DDM-v1) §5 Isolation & Restart-Safe State.
- View on GitHub: https://github.com/blogtheristo/dws6/blob/main/docs/BACKUP_AND_RESTORE_RUNBOOK.md

Document Status:

- Created: 24.08.2026
- Last Modified: 24.08.2026
- Language: English

***

## Table of Contents

1. [Principle](#1-principle)
2. [3-2-1 Copy Rule](#2-3-2-1-copy-rule)
3. [Pre-Cycle Recovery Snapshot](#3-pre-cycle-recovery-snapshot)
4. [Branch/Worktree Isolation & Canaries](#4-branchworktree-isolation--canaries)
5. [Gated Destructive Operations](#5-gated-destructive-operations)
6. [Off-Host Retention](#6-off-host-retention)
7. [Weekly Restore Exercise](#7-weekly-restore-exercise)
8. [Incident Reference: 2026-08-24](#8-incident-reference-2026-08-24)
9. [Defense-in-Depth Roadmap: Tree Gate](#9-defense-in-depth-roadmap-tree-gate)

***

## 1. Principle

"Git still has the parent commit" is **not** a backup. A backup is a restorable
system: proven by an actual restore exercise, on different media, with an
off-host copy, and with integrity gates that stop a poisoned tree before it
reaches `main`.

This runbook binds every autonomous cycle (DDM-v1 §3) and every human push to
`main`.

## 2. 3-2-1 Copy Rule

- **3** copies of repository state (working clone + 2 independent backups).
- **2** different media (local NVMe + NAS/off-host object storage).
- **1** copy off-host, preferably immutable (object-lock / write-once).

Minimum viable implementation until automated: after each DDM cycle and
weekly, create `git bundle create dws6-<date>.bundle --all` plus a tarball of
queue/audit/handoff directories, and copy both off-host.

## 3. Pre-Cycle Recovery Snapshot

Before every autonomous 48-hour cycle starts, write a named snapshot directory
(`backups/pre-cycle/<cycle-id>/`) containing:

| Artifact | Command / Source |
| --- | --- |
| Recovery ref + tag | `git tag pre-cycle/<cycle-id> <last-known-good-sha>` and `git push origin pre-cycle/<cycle-id>` |
| HEAD + tree-count record | `git rev-parse HEAD`; `git ls-tree -r --name-only HEAD \| wc -l` |
| Queue state | copy of `.workflows/opencode-all/queue.jsonl` (+ lifecycle log) |
| Stashes | `git stash list` output; `git stash store $(git stash create)` for any dirty WIP |
| Worktree list | `git worktree list --porcelain` |
| Audit manifest | latest `.ci-audit/runs/` records + hash-chain head |

The last-known-good SHA is the merged head of `main` with a verified full tree
(see §7 pass criteria). If a cycle goes wrong, recovery restarts from this ref.

## 4. Branch/Worktree Isolation & Canaries

- An agent writes only inside its own worktree (WORKTREE_POLICY.md). Never in
  the primary checkout, never in another agent's worktree.
- Test fixtures that invoke `git` MUST use absolute paths via `git -C <dir>`
  or explicit `cwd:` on every exec call — no bare `git ...` with inherited cwd.
- **Canary rule:** any test file that shells out to git captures at start:
  host worktree `HEAD`, current branch name, and queue-file hash; asserts all
  three unchanged at the end. A mismatch fails the test loudly (Rule 12) —
  this is the gate that would have caught the 2026-08-24 fixture escape.
- New fixtures are quarantined (`describe.skip` or env-gated) until their
  first run passes under `GIT_TRACE=1` review with a canary in place.

## 5. Gated Destructive Operations

Each of these requires its own explicit gate; default is report-only:

| Operation | Gate |
| --- | --- |
| `reset --hard` beyond local WIP | Human approval recorded in session notes |
| Branch deletion (any ref) | NO-DELETE policy (`.githooks/pre-push`) + reconcile `--clean` flag only, provable emptiness required |
| Force push | Forbidden to protected branches (Non-Negotiable Rule 7); elsewhere requires audited override |
| Merge to `main` | Poisoned-tree gate must pass (below); security/auth/payments/webhooks/migrations/deployment need human approval per DDM-v1 §11 |

**Poisoned-tree gate (pre-push):** the hook compares the pushed tree's
recursive file count against the remote ref it replaces. A collapse beyond
10% (repo with >100 files losing >10%) blocks the push. Override:
`ALLOW_TREE_SHRINK=1`, which is recorded in the push transcript. This gate
exists because CI test results do not prove tree integrity — #1888 passed
1185 tests while deleting the repository.

CI additionally rejects a push when tree-count collapses vs the base branch,
even if the pre-push hook is bypassed.

## 6. Off-Host Retention

Keep, off the working machine:

- **7 daily** and **4 weekly** snapshots (git bundle or mirror clone, plus the
  §3 snapshot directories).
- Queue/lifecycle state, `.ci-audit/` records, `.claude/handoffs/`, and the
  diffs of any worktree kept-for-review.
- Never rely solely on the working machine's `.git` directory — a corrupted
  index or escaped fixture commit can propagate there unnoticed.

### 6.1 Active Snapshot Register

| # | Location | Contents | Integrity |
| --- | --- | --- | --- |
| 1 | DGX Spark `gn100-cb5d`, admin account: `/home/admin100/dws6-backups/2026-08-24/` | `dws6-restore-41ee234f2.bundle` (374,098,869 B) + `MANIFEST.txt` | sha256 `11c3754a4f4f8b0cb4cf7f2d528c79e7dd366c4df21d6ff8d320c2ad80f02a5a` |
| 2 | GitHub `blogtheristo/dws7` | branch `archive/dws6-main-restore-20260824` + tag `dws6/pre-cycle-recovery-20260824`, both → commit `41ee234f2…`, tree `bdc69aec…` (6798 files) | ref-SHA verified via API post-push |
| 3 | Pending — Win11 Proton Drive (`dws6-backups/2026-08-24/`) | copy of #1 after manual transfer from DGX | verify sha256 identical after transfer |

Bundle provenance: commit `41ee234f2` (parent `c02367428` = poisoned main tip;
tree restored from known-good `745267975`). Verify any copy with
`git bundle verify <file>` followed by a test clone.

## 7. Weekly Restore Exercise

Once per week (cron candidate):

1. From the newest off-host snapshot, create a throwaway recovery worktree
   from the bundle/mirror into an empty directory.
2. Verify: recursive file count matches the recorded count (±0), the batch
   worker exists, `node --check scripts/opencode-batch-worker.mjs` passes,
   focused test suite runs, and the backend boots (`npm run build` or dev
   startup smoke).
3. Record pass/fail + counts next to the snapshot manifest.

**A backup that has not been restored is not a backup.** Until an exercise
passes, the snapshot set does not count as satisfying §2.

## 8. Incident Reference: 2026-08-24

- Poisoned fixture commit `197daefdb` ("baseline", author = fixture identity
  `Retry Test`) reduced the tree to README.md and was merged to `main`
  through PR #1888 while its own branch's test suite reported 1185 passing.
- Detection: post-merge worktree materialized 1 file; `ls-tree -r` confirmed
  single-entry tree on `origin/main`.
- Recovery: `recovery/main-content` (PR #1889) rebuilt from known-good
  `745267975` with four verified cherry-picks (tree-count checked per commit);
  fixture quarantined pending `GIT_TRACE=1` forensics.
- Lessons codified here: §4 canaries, §5 poisoned-tree gate, §3 pre-cycle
  snapshot would each have independently caught or contained the incident.

## 9. Defense-in-Depth Roadmap: Tree Gate

The poisoned-tree gate (`scripts/poisoned-tree-gate.mjs`, fixture matrix
13/13 green as of 2026-08-25) is currently a **client-side pre-push hook**.
A client-side gate is necessary but not sufficient: any machine with a
disabled hook, stale clone, or bypass flag pushes straight through. The
defense must therefore be layered so that no single tier's failure lets a
poisoned tree reach `main`.

Evidence basis: matrix run 2026-08-25
(`fix/poisoned-tree-matrix-green` worktree,
`docs/evidence-matrix-run-2026-08-25.txt`) — 1 real gate defect fixed
(`approvedBy` missing from allow-path return), 6 fixture-authoring defects
(missing remote, boundary off-by-one-blob, boundary-exact "sub-threshold",
deleted-file reuse, git-rm directory pruning, missing manifestPath).

### Tier model (Boardy layering)

| Tier | Where | Mechanism | Status |
| --- | --- | --- | --- |
| T1 — client hook | dev machines / agent worktrees | local-ci + pre-push gate (`scripts/poisoned-tree-gate.mjs`) via stdin contract; fail-closed on malformed input | **live** (this repo) |
| T2 — server-side ref protection | GitHub | branch protection on `main`: PR required, force-push & deletion banned, status checks required (gate job) | partial — PR/force/deletion live; **gate check not yet wired** |
| T3 — CI tree gate | GitHub Actions on every PR | workflow runs the same gate binary against the PR merge commit: manifest presence, blob-count delta vs base, critical-file diff, roster diff; block merge on P0–P6 | **planned** (see below) |
| T4 — scheduled tree audit | DGX cron (daily) | independent audit: `ls-tree -r | wc -l` trend per protected path set vs previous day; alert on >10% drop without a matching approval artifact in repo history | **planned** |
| T5 — restore-time verification | backup cycle (§7) | Sunday exercise already compares manifest tree-hash; extend to assert gate version that produced each accepted push is recorded in CI audit log | partial |

Design invariant: **T3 and T4 must not trust T1.** They re-run the same
pure `evaluate()` logic server-side/scheduled-side against raw git data;
they never read a "passed locally" claim. The gate's independence contract
(every evaluation builds its own view from shas, zero working-tree
assumptions) is what makes this re-run possible.

### T3 implementation sketch (Actions-based tree gate)

1. New workflow `.github/workflows/tree-gate.yml`: `on: pull_request` to
   `main`, plus `workflow_dispatch`.
2. Job steps: checkout PR merge ref → `node scripts/poisoned-tree-gate.mjs
   --config <generated>` where config pins `localSha = merge commit`,
   `remoteSha = base sha`, `manifestPath = committed cycle-manifest`.
3. Fail the job (merge block via required status check) on `decision:
   block`; post reasons as PR comment for the reviewer.
4. Secrets: none needed — signature keys stay local (T1); Actions verifies
   structural rules only (blob-count, critical files, roster). Signed
   approvals are verified by T1 and recorded in the PR thread by humans.

### Acceptance criteria for calling T3/T4 done

- A synthetic #1888-shaped PR (tree collapse to 1 file) is blocked by
  Actions with a P2 reason visible in the PR.
- Disabling the local hook does NOT let such a PR merge (T2+T3 catch it).
- Daily audit log shows tree-count series with an explicit alert line when
  a drop lacks an approval artifact.

