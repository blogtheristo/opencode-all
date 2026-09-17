# Handoff — claude/eu-nato-funding-recovery-lsogw2

**Task:** Re-create the "EU Commission + NATO DIANA" funding research pack lost to an
unreclaimed container on 2026-07-13 (`docs/lut/recovery-prompts-lost-research-packs-2026-07.md`
§1 row 3, "LOST — worst"). Founder supplied a Gemini-authored draft as a starting hypothesis.

**State: DONE.**

- `docs/lut/eu-nato-instruments-research-2026-07.md` written and verified against official
  sources (Eureka/Eurostars, Vinnova, Business Finland, EC Digital Strategy, EIC, NATO DIANA,
  NIF, EDF, Horizon Cluster 4, several cascade/FSTP trackers). DWS Document Standard header,
  `***` delimiters.
- Corrected several load-bearing figures from the Gemini draft (see file §9 for the full
  table): EIC equity ceiling (€30M claimed → €10M actual), Digital Europe budget/rate
  (€2-3M/project claimed → €8.5M-total/2-grants actual; 50/100 split → 50/75 actual), **EDF
  deadline (mid-2027 claimed → 29 Sep 2026 actual — this is live now, not next year)**, two
  named cascade calls that don't exist as described (SecurIT Open Call 3, AI-Redio — replaced
  with verified live calls NGI Sargasso and AI4Gov-X), and NATO DIANA cycle framing (3 Jul 2026
  was the standing 2027-cohort deadline, not a missed one-off).
- `docs/lut/fundraising-roadmap-2026-2027.md` updated: §0 row → RECOVERED, §3 deadline table
  corrected with the above figures + NGI Sargasso/EDF/AI4Gov-X rows added, version → 1.1.
- All work pushed in 3 commits, each verified `✓ DURABLE` via
  `scripts/claude-durability-checkpoint.sh`.

**Next steps (not blocking, for a future session):**

- EDF fit (§6 of the new file) is flagged as a founder resourcing decision — it's technically
  filable by 29 Sep 2026 but competes with Eurostars/Digital Europe drafting bandwidth and has
  unscoped defence-clearance/export-control requirements. Needs a founder call, not an agent
  default.
- Several `(verify)` tags remain where primary EC PDF fiches returned HTTP 403 to this
  session's fetch tool (Digital Europe call fiche, EIC Guide for Applicants detail, Business
  Finland's own page). Re-fetch these directly once network access allows, or have a human
  open them, before finalizing any application text based on their exact wording.
- The Nordic (NO/DK) and DACH+France anchor packs are still LOST per the roadmap §0 — Recovery
  Prompts C/D in `docs/lut/recovery-prompts-lost-research-packs-2026-07.md` cover those re-runs.

**Blockers:** None currently open.
