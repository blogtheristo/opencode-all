# Handoff: feat/opencode-infrastructure-upgrade

## Task

OpenCode infrastructure upgrade: Supabase session state transactional tracking, Claude Code CLI integration, and migration schema documentation.

## State

**Committed (0c00dc477):**

- Added `@anthropic-ai/claude-code` ^2.1.258 dependency
- Updated `.workflows/opencode-all/queue.jsonl` with latest OpenCode session states
- Updated `package-lock.json`

**Uncommitted (waiting for next session decision):**

_Blocked by security hook (`protect-files.sh`)—Admin folder:_

- `Admin/ADMIN_MANUAL_SUPABASE_EN_v1.md` — v1.9 with §7.6 "OpenCode Session State (Migration 076)" documented: 20-column `opencode_sessions` table schema (6 indexes, RLS enabled), TypeScript SessionManager API, SQL observability queries. **Flags migration numbering collision:** `076_revoke_anon_legacy_grants.sql` (existing, 19.07.2026) and `076_opencode_session_state.sql` (new, 31.08.2026) both share prefix 076 — renumbering needed per §7.4 policy.

_Supabase temp/auto-generated:_

- `supabase/.temp/cli-latest` — updated version tracking
- `supabase/.temp/gotrue-*`, `pooler-url`, `postgres-version`, etc. — deleted stale tracking files
- `supabase/.branches/` — new directory tracking active branches

_Source code changes:_

- `src/routes/stripe-webhook.routes.ts` — 1 line modified
- `src/services/billing.service.ts` — new file with billing logic

_Generated/working files (not for commit):_

- `Modelfile` — Ollama model config (`qwen3-coder-next`, 65536 ctx)
- `docs/field-notes/2026-08-31-opencode-supabase-migration.docx` — session field note (binary, content unknown to this session)
- `.workflows/opencode-all/queue.jsonl.backup-2026-08-31` — backup of queue state
- `types/` — TypeScript type definitions (new)

## Next Steps

1. **Admin manual:** Review whether the security hook's blanket Admin/ block is correct. The `.gitignore` principle says "Everything else (docs, admin, business files) MUST be tracked so Claude Code cloud sessions can read/write them without data loss." The hook may need tuning or an override. Human decision: force-commit or adjust hook policy.

2. **Migration numbering collision:** Resolve the 076 prefix collision in the migration files. Current state: `076_revoke_anon_legacy_grants.sql` is live (19.07.2026), and `076_opencode_session_state.sql` is pending. One must be renumbered to avoid prefix clash. Likely to 086 or per sequential pattern.

3. **Supabase temp files:** The deleted files are `.gitignore`-protected auto-generated metadata. Safe to ignore or clean up via `.gitignore` rule (already in place).

4. **Stripe webhook + billing service:** Verify intent — are these part of the OpenCode upgrade or a separate feature? If separate, consider splitting to a different branch.

5. **Field note content:** The .docx field note should be converted to `.md` and committed to `docs/field-notes/2026-08-31-opencode-supabase-migration.md` for persistence and auditing.

## Blockers

- **Security hook:** `protect-files.sh` prevents committing Admin files. Needs human override or policy decision.
- **Migration numbering:** Collision requires manual resolution before applying 076 migration to production.

## Branch Status

- Ahead of origin by 1 commit
- Last commit: 0c00dc477 (dependency and workflow updates)
- Ready to push once remaining files are resolved
