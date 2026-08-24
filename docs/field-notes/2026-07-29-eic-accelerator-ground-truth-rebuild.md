# Field Note — EIC Accelerator Step 1: ground-truth rebuild caught a near-false-statement to the Commission

**Date:** 2026-07-29
**Session:** `claude/eic-accelerator-2026-step1-bstysc` (PR #1700, merged `e0481cf7`)
**Type:** Production-incident-style capture (grant-application claims, not code — same "silently drifted and would have broken in the real world" shape)
**Ontology tags:** `#grants` `#eic` `#dual-use` `#truth-standard` `#learning-standard` `#kya`

---

## What happened

A near-final EIC Accelerator 2026 Step 1 application (€2.5M grant, Lifetime Oy) was reviewed against a set of official call facts. Fixing the stated deadline model (a stale "Aug 4 monthly batch" assumption — the real call is continuous, deadline 17.12.2026 17:00 Brussels) surfaced a bigger problem: several of the pack's core claims did not match reality, and two independent read-only ground-truth audits were run against the live repo, the production Supabase deployment, and the company's own public product pages to find out how far the drift went.

**What the audits found, verified against primary sources (not assumed):**

- **"DWS IQ Aegis — live, in production, with paying customers"** was false. The company's own `products.json` and public product page said `availability: "preorder"`, GA "August 2026" (later corrected to September 2026 with the founder).
- **"6 paying customers, €7k MRR, 100% retention since first paid deployment (Dec 2025)"** was misattributed. The revenue is Lifetime Fleet — a licensed transport operation working with Traficom-regulated dispatch operators (commission-based) — not software/platform revenue. This exact confusion was **already self-diagnosed** in the repo months earlier as the cause of an Arctic15 rejection ("€7-14k MRR (Fleet) — a range, from the wrong division") and a Defence Startup Fund rejection, and had never been fixed repo-wide.
- **"TRL 6-7"** was not defensible as written; **"TRL 5 completed, entering TRL 6"** is, anchored on the KYA trust engine — which really does run in production (agent identity binding, session trust scoring, TC-4 "Leash Snap" revocation on a live API, Article-12 audit tables deployed to the production database). This is the one claim in the original pack that held up to full scrutiny, and it became the anchor of the rewritten narrative instead of Aegis.
- **The most serious finding:** the founder recalled "NATO DIANA requested our pitch video and deck." When traced to a source, this resolved to a **different funder's** rejection letter (Riihimäen Tilat ja Kehitys Oy / RTOY, a municipal Defence Startup Fund, rejected 23 April 2026) that happened to name the same two missing artifacts. Had "DIANA requested materials" shipped into a Commission submission as written, it would have been a **false statement to the European Commission** in an active grant application.

## The insight

**A founder's memory of a specific external event is not a citable source until it is dated and quoted.** This applies with extra force when two similarly-named or adjacent organisations exist (a municipal fund vs. the international programme it feeds into — RTOY is genuinely the local gateway to NATO DIANA opportunities, which is why the conflation was easy to make in good faith). The fix that generalizes: draft the placeholder and the exact verifying question first; draft the sentence that depends on the answer only after the answer exists.

**A second, independent insight:** an internal document that already diagnoses its own drift ("Gap 9 — contradictions that will get caught in diligence", "the wrong division") is a higher-priority signal than a claim with no prior flag. The traction-claim drift had been correctly self-diagnosed by an earlier session and then never closed — it cost two funding rejections in the meantime.

**What this session got right, worth repeating:** two independent read-only audits before any external claim was touched; §24 Correspondence Preservation applied throughout (sent letters kept verbatim, dated correction notes added instead of rewriting history); the dual-use engagement log's `[TO FILL]` scaffold, which forces an explicit human answer before an external claim ships rather than letting the agent infer one; and — per the founder's own explicit decision — **not rushing** an export-control classification opinion on a still-developing product, because a rushed opinion on a moving target would need redoing.

## What changed (PR #1700, merged to main)

- Deadline: continuous, 17.12.2026 17:00 Brussels (was: stale monthly-batch assumption).
- Aegis: stated as preorder, GA September 2026, pre-revenue (was: "live, in production").
- Traction: detached from software — Lifetime Fleet transport + consulting revenue, explicitly not platform traction. Real software pipeline stated instead: two enterprise pilots contracted Q1/2026, active discussions (not "filed") with Outokumpu and Kemira.
- TRL: "5 completed, entering 6", anchored on the KYA engine.
- Dual-use declared (Part A tick box → YES) with an honest civil/defence asymmetry in a new §F7b, and export control scoped correctly to what the submission actually describes (§F6c) rather than the company's full product roadmap.
- The DIANA claim removed entirely and replaced with a 12-month door-opening plan (`docs/eic/DIANA_DOOR_OPENING_PLAN.md`): DIANA's 2027 cohort closed 3 July 2026, so the real near-term move is answering RTOY's actual, given feedback — not inventing NATO-level interest that was never expressed.
- A wedge choice (ICEYE/SAR, proposed by the founder) was evaluated against the audit evidence and recommended against: the capability behind it is simulated in the codebase (`Math.random()`-generated satellite IDs), the internal ICEYE relationship status is self-contradictory, and it leads straight into the export-control question the founder chose not to rush. Quantum-safe / secure-connectivity — real funded work, an exact fit for VTT's stated DIANA-accelerator theme, and already the centre of the EIC narrative — was recommended instead.

## Next steps

1. PIC / Participant Register registration for Lifetime Oy (Central Validation takes weeks; not yet started — the one real timeline risk left).
2. Reply to Laura Manner-Raappana (RTOY) with the now-complete video + deck, answering her actual feedback.
3. Fill `docs/eic/correspondence/2026-07_DUAL_USE_ENGAGEMENT_LOG.md` §2 (the 2-3 dual-use enterprise contacts).
4. Resolve the parallel customer/MRR drift across `docs/investor/`, `docs/sales/`, `docs/board/`, `sales-outreach/`, `Store/` (a background reconciliation agent was launched for this; its completion status needs checking next session).
5. Two rule proposals await human review in `docs/learning-loops/2026-07-29-this-session.md` (read-only per `/learn`) — an external-attribution rule for `DWS_TRUTH_STANDARD.md`, and an extension to the SWEEP COMPLETENESS rule already in `.claude/commands/truth-check.md`.

See `.claude/handoffs/claude/eic-accelerator-2026-step1-bstysc.md` for full session state.

---

## HIC Learning Outcome — five-step record

1. **KB updated:** `kb/wiki/concepts/external-attribution-claims-grant-applications.md` — the generalizable rule.
2. **Field note:** this file.
3. **Learn/ HTML:** `Learn/2026-07-29-eic-accelerator-ground-truth-rebuild.html` (+ `.docx`).
4. **Drive export:** `2026 DWS6/2026-07-29-eic-accelerator-ground-truth-rebuild` — https://docs.google.com/document/d/122T_Q4UGAgsDuKpYdE_jPkJjHFiLT10-GHXsK6sV5Tk/edit
5. **HIC question:** asked in the session reply (chat), per §10.1 — logged back here once answered.

   > **Q:** What should close the parallel traction-claim drift outside `docs/eic/`? The same customer/MRR misattribution that sank Arctic15 and RTOY still lives in `docs/investor/`, `docs/sales/`, `docs/board/`, `sales-outreach/`, `Store/`. A background agent was launched mid-session to reconcile it (worktree `agent-a62771ec0a679202c`, target branch `claude/traction-truth-reconciliation`) but its completion was never confirmed.
   > **Options:** (A) resume/check that agent next session vs. (B) relaunch it fresh, with the now-corrected `docs/eic/` as a template.
   > **HIC answer: A** — resume/check first, to avoid duplicate work if it already finished.
   >
   > **Outcome:** the agent had in fact already finished by the time it was checked (295 files, `docs/TRACTION_CANONICAL.md` created, `DWS_TRUTH_STANDARD.md` §2 row 32 registered, live-code claims fixed in `src/services/email-templates.ts` + `src/cloudflare/team-chat-worker.ts`, sent correspondence annotated per §24 not rewritten). Reviewed (secrets scan, dual-folder byte-diff, correspondence handling, `tsc --noEmit`) and opened as **PR #1766 — deliberately not merged**: merging auto-publishes `dws10.com`, `dws6.com`, and `onelifetime.world` immediately (see `docs/CLOUD_ENVIRONMENTS.md:219-220` — root site folders sync to `landing-pages/` via `sync-dws6-landing-pages.yml`, whose bot commit is what Cloudflare Pages actually watches), and several items in the PR's own `[UNVERIFIED]` register (an ACV/run-rate arithmetic conflict, an unverified consulting engagement, a 5-vs-6-accounts discrepancy, and whether any external recipient of the old figures needs a corrected follow-up) are founder-only decisions. This is also a live instance of `DWS_LEARNING_STANDARD.md` §10.3.1's cooling-gap principle: the session that reviewed the agent's output should not also be the one that executes the publish.
