# Session Handoff Log

Cross-session memory for Claude Code cloud sessions. Containers are ephemeral —
this file is the only working memory that survives them, because it is committed
to git. `session-start.sh` injects the CURRENT HANDOFF section into every new
session's context automatically.

## Update protocol (every agent, every session)

1. **Read** the CURRENT HANDOFF section before starting work (the session-start
   hook already shows it to you).
2. **Overwrite** the CURRENT HANDOFF section at every significant checkpoint
   (Rule 10) and always before ending a session — commit it together with the
   work it describes, on the same branch.
3. **Append** a one-line entry to HANDOFF HISTORY when a task completes or is
   handed off. Keep history to the newest 20 lines; delete older ones.
4. Keep CURRENT HANDOFF under ~40 lines. This is a baton, not a journal —
   detail lives in commits, PRs, and `.claude/clawdbot/` queue files.
5. Never put secrets, tokens, or customer PII here (Non-Negotiable Rule 1).

---

## CURRENT HANDOFF

- **Branch:** claude/aiven-partnership-intro-vm1fgk
- **Task:** Record Aiven inbound contact (Leevi Lindfors, account manager,
  2026-07-06) and draft Risto's reply.
- **State:** Partner record at v1.6. Done this session: call outcomes (NDA /
  reseller-or-consulting / materials incoming); signable HTML NDA
  `Learn/NDA_AIVEN_2026_v1.0.html` with Art. 8.3 (NDA ≠ GDPR basis for
  customer data); DPA-before-tender-data rule; Wärtsilä reference recorded
  (unverified); field notes on DGX/EDB vs Aiven/UpCloud + Wärtsilä-stack
  (Pega/Dataddo/GEMS) compatibility; §5.1 revenue model (5 streams, ranked);
  §5.2 negotiation stance (AM hunts our customers, volume reseller dead at
  our volume → referral/deal-reg + partnerships-org track instead).
- **Next steps:** Risto sends NDA + asks for platform DPA (RED zone); on
  materials arrival check reseller margin %, deal-reg/referral terms, who
  owns billing; verify Wärtsilä reference link; UpCloud region + free dev
  mode for sandbox attempt #2.
- **Blockers:** None.

---

## HANDOFF HISTORY

- 2026-07-06 | claude/aiven-partnership-intro-vm1fgk | Aiven partner record v1.1: Leevi Lindfors contact + reply draft (human sends).
- 2026-07-05 | claude/session-container-memory-6ccpnf | Created handoff log mechanism (file + session-start hook + CLAUDE.md pointer).
