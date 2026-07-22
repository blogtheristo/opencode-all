# Handoff: claude/kya-mandate-evidence-migration-mq7hnp

> Per-branch handoff file. See `.claude/HANDOFF.md` for the protocol and the
> cross-branch history log. This file is owned by sessions on this branch
> only — safe to overwrite freely, no cross-branch merge risk.

- **Task:** KYA agentic-commerce evidence chain — Supabase migration for
  §14.5, then sync §14 into KYA_SECURITY/KYA_OPTIMIZATION/DWS_SECURITY_STANDARD.
- **State:** Started from a fresh main checkout; found the "shipped so far"
  work (KYA §14, `evaluateMandateGate()`, 21 tests) lived on
  `origin/claude/agent-infrastructure-ideas-1jtgms` (tip d93e8fc, already
  merged with main) — fast-forward merged that branch in rather than
  redoing the work. Authored `supabase/migrations/074_kya_mandate_evidence_chain.sql`
  (GREEN-zone, NOT applied): `kya_mandate_events` (append-only, hash-chained
  prev_hash→event_hash trigger, modeled on 071_command_audit_log.sql, keyed
  session_id+mandate_vc_id) and `kya_tenant_gating_profiles` (versioned,
  tighten-only, DB-level CHECK hnp_min_ats>=0.90 as defense-in-depth
  alongside the Zod validator). Synced §14 into `Legal/KYA_SECURITY_v1.2.md`
  §12 (enforcement — extends §9.2 violation sequence with mandate
  revocation) v1.7→1.8, `Legal/KYA_OPTIMIZATION_v1.4.md` §13 (HNP as revenue
  gate, extends §3.2 Financial Multiplier table) v1.8→1.9, and
  `DWS_SECURITY_STANDARD.md` §18.4 G7 — Spend Authority gate row (added at
  end of table, not inserted between G2/G3, to avoid renumbering G3–G6
  which are referenced elsewhere) v2.8→2.9. No .ts files touched — tsc not
  re-run (node_modules not installed in this container; pre-existing gap).
  Also migrated the shared handoff mechanism itself from a single
  `.claude/HANDOFF.md` CURRENT HANDOFF section to per-branch files under
  `.claude/handoffs/<branch>.md` — the old design clobbered across
  concurrent branches (this session started by reading a stale CURRENT
  HANDOFF left by a different branch's last session; the repo's own git log
  shows an actual merge conflict on the file from two branches editing it).
- **Done this session (22.07.2026) — all in PR #1713 (open):**
  1. ✅ **074 VERIFIED & LIVE** in production (dws6, eu-west-1, Postgres
     17.6.1) — both tables present, RLS on, 0 rows. Verified via Supabase MCP.
  2. ✅ **Buyer copy** — Ari-test agentic-commerce line added to
     `sales-outreach/PROCUREMENT_BRIEFS_TAILORED.md` (S9 annex + Defence card,
     v1.1→1.2) and `dws10.com/aegis/index.html` KYA Engine card (+ landing-pages
     mirror synced). Capability claim only; §2B clean; truth-check 0 fail.
  3. ✅ **§14.7 Verified-Done Attestation — schema landed toward v2.0:**
     `KYA_STANDARD_v1.md` §14.7 (v1.9.1→1.10; §14 heading v1.8→1.10); TS
     interfaces `VerifiedDoneAttestation`/`VerifiedDoneSubject`/`AttestationInput`/
     `IssuedAttestation` (`src/identity/types.ts`) + stub issuer
     `issueVerifiedDoneAttestation()` (`src/identity/ats-engine.ts`, deny-by-
     default + HIC binding carry through); 6 tests
     (`src/__tests__/verified-done-attestation.test.ts`; identity suite 27/27,
     tsc + prettier clean); migration `079_kya_verified_done_attestation.sql`
     (`kya_verified_done_attestations` + `mandate.attest` event extending the
     live 074 chain; DELETE denied to all = revocation is a status transition;
     explicit grants). **Numbered 079, not 075** — 075–078 already exist.
     **Signing DEFERRED** to v2.0 (credentials mint proofStatus:'unsigned').
- **Open for next session / human:**
  1. ✅ **APPLIED 22.07.2026:** `079_kya_verified_done_attestation.sql` applied
     to production via Supabase MCP `apply_migration` (on founder instruction).
     Verified: event_type CHECK now has all 5 values (incl. `mandate.attest`),
     `kya_verified_done_attestations` live (RLS + 3 policies + 17 cols, DELETE
     denied to every role, grants identical to live 074/071 tables, 0 new
     security advisories). Both 074 and 079 now live. Next migration = 080.
  2. **v2.0 signing decision + schema freeze:** pick DID method + issuer key
     location, wire real Ed25519/Data-Integrity signing into
     `issueVerifiedDoneAttestation()` (proofStatus→'signed'; populate `proof`),
     add a `kya_attestations_sign`/revoke path, then bump KYA §14 to v2.0 and
     freeze the illustrative JSON in §14.2.1/§14.3/§14.7 to the TS shapes.
     Full brief: scratchpad `next-session-prompt.md`.
  3. eslint could not run in-container (`@eslint/js` missing — pre-existing
     tooling gap); tsc + prettier + vitest were the gates used.
- **Blockers:** None.
