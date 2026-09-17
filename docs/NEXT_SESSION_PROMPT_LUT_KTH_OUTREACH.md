# Next-Session Prompt — LUT/KTH Doctoral Outreach (post-send)

_Paste the block below to start the next session. Full context lives in the field notes and the branch handoff._

---

## Copy-paste prompt

> Continue the LUT/KTH doctoral outreach. Both letters were SENT on 14.07.2026:
> **Törngren (KTH/TECoSA)** email + 10-page memo, and **Smolander (LUT)** six-question letter + 10-page research-plan PDF. Nothing to send now — we are in the waiting/prep phase.
>
> **Watch & respond:**
>
> - Törngren reply on the KTH thread (Broman CC'd). If he engages, prep the demonstrator scope from `docs/gtm/2026-07-14-torngren-tecosa-memo.md` §5.
> - Smolander reply to the 20-minute request. If he says yes, build a one-page "which of the six to lead with" brief (prior: Q5 technical spine + Q6 his-department capstone).
>
> **Verify before anything hardens into the thesis (all flagged Medium-confidence):**
>
> - Victor Galaz / SRC exact affiliation + whether "algorithmic resilience" is his term (Q2 anchor).
> - Törngren SAFECOMP paper titles/years via DBLP (Q4 anchor).
> - Pilot status of Outokumpu / Kemira / construction — contracted vs. "offered"; DPA/ethics envelope.
>
> **Lifetime AB (critical path, Sweden):** incorporation being finalized (July 2026), self-file route via eIDAS FINeID card reader (library / verkkokauppa.com); formation-agent fallback. Blocks Vinnova eligibility + the Sweden narrative. See `docs/field-notes/2026-07-14-lifetime-ab-critical-path-sweden.md`.
>
> **On Kari's steer only:** elevate the chosen RQ(s) into `PHD_FIREHORSE_EN/FI` — FOUR-FILE THESIS LOCKSTEP + regenerate `Learn/` HTML (thesis files are RED-zone; do not pre-edit).
>
> **Loose end:** reconcile the stale "November 2026" Lifetime AB date in `investor-outreach/AEGIS_SP_GROWTH_BRIEF.md` (superseded by July 2026).
>
> **Tooling:** for any deliverable PDF, DO NOT send raw markdown. Use `python3 scripts/md-to-pdf.py <in.md> <out.html> --strip-frontmatter` then render with the Chromium binary (`--headless=new --no-pdf-header-footer --print-to-pdf`). Verify page count with `grep -c /MediaBox` (the `file` tool under-reports).

---

## Session artifacts (all committed on `claude/lut-phd-research-options-p7jskn`, merged to main 14.07.2026)

- **Field notes:** three→four→six research options; KTH/TECoSA context; Lifetime AB critical path; Smolander letter SENT record; Truth Standard and Aura (culture note + image).
- **LUT:** 10-page doctoral research plan (`.md` + styled `.pdf`); six-question letter (SENT, v1.2).
- **GTM/Törngren:** send-ready email; 10-page memo (`.md` + styled `.html` + `.pdf`); exported to Google Drive as a Doc.
- **Tooling:** `scripts/md-to-pdf.py` (markdown → styled HTML) + `scripts/html-to-pdf.mjs` (Playwright path; Chromium-binary fallback used in this env).

## The deal (culture note, `docs/field-notes/2026-07-14-truth-standard-and-aura.md`)

Agent holds the truth standard (present-tense, verified fact); founder runs on intuition/goals/aura (reality stated forward). The drift is productive. Protocol: flag once, then defer and record faithfully — flag hardest on outward-facing claims to those who vouch or gatekeep.
