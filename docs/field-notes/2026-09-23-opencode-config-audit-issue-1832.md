# OpenCode Root Config Audit — Closing Issue #1832

Status: PENDING_REVIEW
Date: 2026-09-23
Author: Claude Code (cloud session, hot standby)
Closes: https://github.com/blogtheristo/dws6/issues/1832
Follow-up to: PR #1831, `docs/field-notes/2026-08-13-opencode-dgx-runtime-alignment.md`

## Method

The issue was audited against the runtime, not against memory. OpenCode 1.18.32
(`npm view opencode-ai version`, 2026-09-23) was installed into the session scratchpad and
run as `opencode debug config --pure` from the repository root. The permission matcher was
reproduced from `packages/core/src/util/wildcard.ts` and `packages/opencode/src/permission/index.ts`
(`findLast` — last matching rule wins; `*` becomes `.*`; the `read` tool passes the path relative
to the worktree). `https://opencode.ai/config.json` is blocked by the session egress proxy, so
schema facts come from the embedded schema in the 1.18.32 binary and the `dev` branch source.

## Status of the 11 defects from #1832 (state of `main` at `cda3d01`)

| #   | Defect                                  | State before this PR                                         | Action                              |
| --- | --------------------------------------- | ------------------------------------------------------------ | ----------------------------------- |
| 1   | Config at `.opencode/opencode.json`     | Fixed — root `opencode.json`; draft kept as `_OLD.bak`       | none                                |
| 2   | Unknown top-level keys                  | **Open** — `cost-policy` silently dropped by the loader      | moved to `config/cost-policy.json`  |
| 3   | `instructions` as string                | Fixed — array (string form reproduces a hard load error)     | none                                |
| 4   | `provider` as string                    | Fixed — provider map `ollama-local`                          | none                                |
| 5   | Model without `provider/` prefix        | Fixed — `ollama-local/qwen3-coder:30b`                       | none                                |
| 6   | Invented `ollama{}` block               | Fixed — `provider.ollama-local.options.baseURL`              | display name corrected (see below)  |
| 7   | MCP `type:local` with `url`             | Fixed — `command[]` for gateway, `type:remote` for agents    | none                                |
| 8   | Fabricated MCP paths                    | Fixed — `.venv/bin/python mcp-servers/cloud-run-gateway/...` | none                                |
| 9   | OAuth/env_var remote servers            | Fixed — only the two `dws-*` servers remain                  | none                                |
| 10  | `bash` object values / no `*` catch-all | Fixed — `"*": "allow"` first, denies after                   | none                                |
| 11  | `Read` / `.claude` keys enforce nothing | **Open in a new form** — see "what was still wrong"          | rewritten `read` + `edit` rule sets |

Also verified: `opencode debug config --pure` loads the root file cleanly before and after the change.
The 2026-08-13 field note's DGX-side run (`OpenCode 1.18.18`) is consistent with this.

## What was still wrong (found by running the matcher, not by reading)

Rule order is last-match-wins and `**/` requires at least one `/`. With the previous `read` block:

| Path                                              | Previous result | Why                                         |
| ------------------------------------------------- | --------------- | ------------------------------------------- |
| `.env` (repo root)                                | **allow**       | `".env": "allow"` was the last match        |
| `.env.example`                                    | deny            | `".env.*": "deny"` came after the allow     |
| `secrets.json` (root)                             | allow           | only `**/*secret*` existed; root has no `/` |
| `credentials.json`, `server.pem`, `id_rsa` (root) | allow           | same                                        |

The same root-level gap existed in `edit`. This is exactly the class the issue called dangerous:
validates clean, enforces nothing. The Secret Egress Rules in `CLAUDE.md` were not in force for
the most common secret file in the repository.

## Changes

- `opencode.json`
  - `read` / `edit`: `*` allow first; deny `.env`, `**/.env`, `.env.*`, `**/.env.*`, `*secret*`,
    `*credentials*`, `*.pem`, `*.key`, `*id_rsa*` (root and nested); re-allow `.env.example`,
    `.env.sample`, `.env.template` after the denies so the order actually yields allow.
  - `edit`: `.claude/settings.json` and `.claude/hooks/*` → `ask` (protects the Claude Code
    standby harness from silent weakening, as #1832 proposed).
  - `share: "disabled"` (no session sharing from an EU-sovereign runtime).
  - `external_directory: {"*": "ask"}`.
  - Provider display name no longer claims "tunnel" while pointing at `:11434`. On the Spark the
    URL is direct; the Win11 SSH tunnel (`:11435`) is a per-user override in
    `~/.config/opencode/opencode.json`, which OpenCode merges beneath the project file.
  - `cost-policy` removed (not a schema key; the loader dropped it silently). Content preserved
    verbatim in `config/cost-policy.json`. No script read it from `opencode.json`
    (`grep -rn cost-policy` → only `.claude/hooks/audit/cost-policy.log` consumers).
- `CLAUDE.md`: multi-tool table line reference updated (`instructions` is now line 4).
- `CHANGELOG.md`: Unreleased → Fixed entry.

## Verification

- `opencode debug config --pure` (1.18.32): loads, prints the new rule sets, no error.
- Matcher harness (scratchpad `perm-test.mjs`, 15 path cases × read/edit + 14 bash cases):
  every secret path resolves `deny`, example/sample/template resolve `allow`, `src/app.ts` and
  standards docs resolve `allow`; bash results unchanged.
- `prettier --check` clean on both JSON files.

## Not done here

- `opencode debug config` was not run on the DGX itself this session (no SSH from the cloud
  container). The `.venv/bin/python` gateway path is Linux-only by design; Windows users override
  `mcp.dws-gateway-local.command` in their global config.
- `opencode.json` `shell` stays `bash` (DGX primary). The issue's `pwsh` suggestion applies to the
  Win11 global config, not the project file.
- Learn/ HTML render: N/A — audit note, no customer-facing artifact.
- Drive export: N/A — repo is source of truth; nothing HIC needs outside git.

## HIC decision

Should `*secret*` / `*credentials*` denies stay this broad? They block OpenCode from reading
files such as `.claude/hooks/secret-output-scan.sh` and any `*credentials*` doc. This mirrors the
previous nested-path intent and the Claude Code hook posture; loosening it is a one-line change.
