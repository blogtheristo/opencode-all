# Next Session — Secret-Egress Audit (Phase 5)

**Status of Phases 1–4:** ✅ shipped and merged into `main` via PR #1535
(`origin/main` @ `3e4626f`). The prior branch was merged and deleted, so this
is **fresh follow-up work** — do not try to resume the old branch history.

## Start of session

```bash
git fetch origin main
git checkout -B claude/ai-codebase-security-audit-BgY2H origin/main
```

The container is ephemeral — always re-sync to the remote before working.
Load `DWS_SECURITY_STANDARD.md` (this is a security task per the CLAUDE.md
routing table).

## What already exists in `main` (do not rebuild)

- `.claude/hooks/secret-patterns.sh` — shared secret-detection engine + placeholder allowlist.
- `.claude/hooks/pretooluse-guard.sh` — Bash read-bypass guard (blocks `cat`/`grep`/`env`/`printenv`/`base64` of `.env*`/`*.pem`/`*.key`/`*secret*`; `.env.example`/templates allowed).
- `.claude/hooks/secret-scan.sh` — input scan, sources the shared engine.
- `.claude/hooks/secret-output-scan.sh` — PostToolUse/Bash output scan (advisory).
- `.claude/settings.json` — PostToolUse Bash hook + `Bash(printenv)`/`Bash(cat .env)` defence-in-depth deny.
- `CLAUDE.md` → Security Coding Rules → **Secret Egress Rules**.
- `DWS_SECURITY_STANDARD.md` v2.6 → Layer 3 → **Secret Egress Control**.

## Phase 5 tasks — checkpoint (commit) after each

### 1. Commit the fixture suite as a real test

The 20-case verification was a throwaway in `/tmp` and was wiped by a container
reset. Recreate it as a committed test (`.claude/hooks/test-secret-hooks.sh` or
`.py`) so it survives resets. Cases:

- Read-bypass: `cat .env` blocked (exit 2); `cat .env.example` allowed (exit 0).
- Input scan: JWT / DSN-with-creds / `DB_PASSWORD=` / `sk-ant-…` blocked;
  `your-…` and `redis://user:pass@host` placeholders allowed; plain prose allowed.
- Output scan: DSN in stdout warns (exit 2); clean output passes (exit 0).

**Gotcha:** build the fake secrets via string concatenation (e.g. `'sk-'+'ant-'+…`
and split `://` in DSNs) so the harness's own `secret-scan` hook does not block
the test file when you write it, and feed fixtures to hooks via file redirection
(`bash hook < fixture.json`) — piping to `bash` trips the pipe-to-shell guard.
Wire into the existing test runner if one exists.

### 2. Triage the 69 DSN-pattern hits in tracked files

A repo-wide high-signal scan (git-grep, tracked files only) flagged **69**
`(postgres|mysql|mongodb|redis|…)://user:pass@` matches after the placeholder
filter — concentrated in `Admin/*.md`, `Admin/Acer-Veriton-GN100/postgres/docker-compose.yml`,
and `docs/`. Reproduce with the high-signal scan (uses the pattern set from
`secret-patterns.sh`; print `file:line` + `<REDACTED>` only, never the value).
Classify each real-secret vs placeholder/example:

- **Any REAL committed secret = CRITICAL.** Report it, do NOT paste the value,
  and recommend rotation + a human-run `git` history scrub (BFG / filter-repo).
- If all are placeholders, tighten the placeholder allowlist in
  `secret-patterns.sh` so they stop flagging, and record the finding.

### 3. `artifacts/` blind spot (8,079 tracked files)

`artifacts/pr925-worktree/` and `artifacts/pr1295-mergecheck/` are committed
worktree copies duplicating `src/` and `docs/` — a path the hooks' prefix-based
guards don't cover.

1. Scan them for secrets first (same engine).
2. Then **propose, don't auto-execute** a cleanup — it's large and irreversible,
   and the `rm`/`git rm` hooks block it. Options: rename-to-`_OLD` (CLAUDE.md
   Rule 6) or a human-approved `git rm` commit since they're generated output.
   **Confirm with the user before removing anything.**

## Close the loop (standing rule: use learning loops when necessary)

At the end of the feature, run `/learn SCOPE=last-week` (per CLAUDE.md → Skill
Codification Rule → _Learning loop_) to diarize outcomes and emit a read-only
skill-edit plan in `docs/learning-loops/`. A human applies approved edits in a
follow-up commit titled `learn: <scope> rule updates`.

## Constraints

- Develop only on `claude/ai-codebase-security-audit-BgY2H`.
- `git push -u origin <branch>` with exponential-backoff retries on network error.
- No PR unless the user asks. Keep edits surgical.
