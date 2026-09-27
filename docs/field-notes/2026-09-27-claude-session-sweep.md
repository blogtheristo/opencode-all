# Claude session sweep — 27.09.2026

Status: PENDING_REVIEW
Branch: claude/practical-meitner-k9bhnn · PR #2182 · Board: https://claude.ai/artifact/1EvraKLCqCGy8hhgTGRwwR

## What was found

- ~150 Claude Code cloud sessions; 47 not archived or completed. Code from nearly all of them is merged (#2015, #2055, #2056, #2063, #2065, #2067, #2076–#2078, #2081, #2091, #2098, #2124, #2125, #2127, #2129). What remains is HIC decisions (20) and permission prompts (9).
- Lost work: PR #2075 (`claude/backoffice-open-items`) was closed as superseded by the Copilot role-gate consolidation (#2143), but ~3,000 lines of unrelated work in it never landed. It is recovered in #2182.
- Security: a pre-merge review of that recovered code found CWE-22. `resolveDocumentPath` checked the allowed root before normalising, so `Learn/../.env` read the repo-root `.env`. `/open` also classified the raw query string, so root-hopping could borrow a public class. Both are fixed with a regression test. The code was never deployed.
- CI gate: `scripts/local-ci.sh` gates ruff with `git ls-files '*.py' | head -1 | grep -q .` under `set -o pipefail`. `head` closing the pipe can SIGPIPE `git ls-files`, so the repo-wide ruff check runs in some containers and silently skips in others. When it runs, it fails on main's 496 legacy findings. That is why MiMo and AGUI could not push docs while this session could. Cloud containers also lack gitleaks, so the secret scan exits 2 unless it is installed.

## Proposed (not committed — needs HIC approval, auto-mode classed it as a CI-gate change)

1. Ruff ratchet: check only `.py` files changed versus the merge-base with `origin/main`. This also removes the pipefail race.
2. `session-start.sh`: when `CLAUDE_CODE_REMOTE=true`, install gitleaks 8.28.0 pinned with sha256 `a65b5253…840eb`. Verified: the full-history scan of 7,434 commits was clean.

## Decisions taken without HIC

- Kept `api.dws6.com` as the back-office API host. The salvaged commits switched it to `backend.dws6.com`, but that ingress is recorded as not provisioned, so switching would break the dashboard.
- Did not push to other sessions' branches (#2096 merge prepared locally only).

## Session Learning Outcome

- KB: N/A — operational sweep, no new domain knowledge.
- Learn HTML / Drive export: N/A — the board artifact is the HIC-facing copy.
- Calendar: N/A — no dated commitments.
- HIC question: approve the ruff ratchet + gitleaks install (unblocks every cloud session push)?
