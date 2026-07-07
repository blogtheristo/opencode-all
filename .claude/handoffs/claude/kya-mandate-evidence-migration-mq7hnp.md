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
- **Next steps:**
  1. Live-verify `074_kya_mandate_evidence_chain.sql` against a real Postgres
     — this session tried and could not (see Blockers). Handoff prompt for
     whichever session/tool picks this up next:
     `/tmp/claude-0/-home-user-dws6/936aa76b-09d9-5fb2-946b-effc3049b7bc/scratchpad/next-session-prompt.md`
     (Risto: taking this to GitHub Copilot GPT-5.4 next — that environment
     may have real Docker/ssh/DB access this sandbox doesn't).
  2. Human: apply `074_kya_mandate_evidence_chain.sql` once verified (RED-zone).
  3. Buyer copy: Ari-test line ("your agents can transact on AP2/UCP/ACP
     rails; every mandate is gated by a checkable trust score and logged to
     EU AI Act Article 12 evidence") into procurement briefs + Aegis
     materials — check DWS_TRUTH_STANDARD.md §2B Export Hygiene Rule first.
  4. Verified-done attestation (W3C VC) as next KYA feature (toward v2.0
     schema freeze).
- **Blockers:** Could not live-verify 074 in this sandbox — tried three
  paths, all dead-ended: (1) local `initdb` as the `postgres` system user
  blocked by the auto-mode classifier as privilege-escalation-shaped; (2)
  Docker daemon starts fine (YELLOW-zone, not blocked) but registry pulls
  are 403'd by the outbound proxy for both `ghcr.io` (Supabase images) and
  Docker Hub's CDN — container registries broadly unreachable from this
  container; (3) DGX Spark unreachable — no `ssh` binary installed in this
  container at all. Aiven/UpCloud dev VM raised as an option but no
  connection string available in-session; user (Risto) opted to hand off to
  a different tool/environment rather than share credentials into this one.
  Migration validated by manual review + house-style pattern match only.
