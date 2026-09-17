<!--
VERSION AND AGENT HISTORY
Document: HIC Learning Outcome — Careers rebuilt as an industrial authority system, 2026-08-01 session
Version: 1.0
Date: 2026-08-01
Author: Risto Anton Päärni (risto.paarni@lifetime.fi), Founder, CEO, Lifetime Oy
Owner: Lifetime Oy
Status: Active
Agent: Claude Code (Opus 5), session claude/ai-pact-enforcement-transparency-gnnipk
Purpose: Record the careers-page re-architecture (one career type, two investor roles), the site split across DWS / Lifetime Fleet / Lifetime Cleaning, the reveal motion asset adapted from cari.fi, and the Captain-economics ruling that resolved a five-way pricing conflict. Per DWS_LEARNING_STANDARD (EU AI Act Article 14 human oversight).
-->

# Careers as an Industrial Authority System — 2026-08-01

## 1. What the session was, and what it became

Started as the tail of the Article 50 transparency work (2026-07-31) and turned into a re-architecture of how DWS presents careers, investment, and the operating businesses.

The trigger was the HIC looking at the live careers page and rejecting it: _"We do not need current AI Careers. they are empty promise."_ What followed resolved four things that had been drifting for months — what a career at DWS actually is, what a Captain actually buys, which businesses hire on which page, and what the whole thing should feel like.

## 2. Six-step Learning Standard record

| #   | Step                         | State                                                                                                                                                                                      |
| --- | ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | Update knowledge base        | ✅ `kb/raw/signals/2026-08-01-careers-industrial-authority.md`                                                                                                                             |
| 2   | Field note                   | ✅ This document                                                                                                                                                                           |
| 3   | Learn/ HTML render           | ✅ `Learn/2026-08-01-careers-industrial-authority-rebuild.html` (`pandoc` unavailable in-container; `python-markdown` used, stated in the file's own generator meta tag rather than faked) |
| 4   | Export to Drive              | ✅ `2026 DWS6` folder                                                                                                                                                                      |
| 5   | HIC decision-shaped question | ✅ §7                                                                                                                                                                                      |
| 6   | Calendar dated commitments   | ✅ §8                                                                                                                                                                                      |

## 3. What was decided (HIC rulings, in order)

1. **One career type only.** Deputy Captain. Captain and Admiral are investor roles on a separate path. The previous timeline of aspirational Q2–Q4 hires ("Experience with AI agent systems… strongly preferred") came off — advertising roles you are not recruiting for _was_ the empty promise.
2. **The role template**, after three iterations: `role family × industry × capability × jurisdiction`. Career type is the family; industry × capability is the role identity; **jurisdiction is an operating qualifier, not a separate career type** — it changes deployment, legal, buyer and commercial conditions, not the person's fundamental role. Roles read `Deputy Captain, Steel CBAM Evidence, Finland/EU`.
3. **Captain economics.** Captain seats are investor positions. `Admiral €250k + 8 counted Captains × €50k = €650k`; the 9th Captain seat is dual-use and sits **outside** the capital count. Fill rate (8, 9, more) is explicitly not the point — €650k is the target, not a seat quota.
4. **Site split.** DWS careers builds industrial authority; `lifetime.fi/careers` hires Fleet; `tarkkasiivous.fi` hires Cleaning; DWS Sales is a future page with no open positions. No mixed promises.
5. **Deputy is not an investment tier** — this was the correction that caught the most drift (§4).

## 4. What was verified, not assumed

- **"25 industries" is canon-correct.** `dws10.com/config/industries.json` v2.0 `summary.industriesServedTotal: 25`; approved phrase _"16 captain hats covering 25+ EU industries."_ Locked in `DWS_TRUTH_STANDARD.md` v1.9/2.0 after a prior drift incident where "16" was misread as the industry count. Aegis dual-use tier = 21; never attribute 25 to Aegis. The 25 names on the page were generated from that file, not typed.
- **Deputy was still being sold as an investor seat in five places** after the ruling — `€5k SAFE` on `/captain/`, `/fleet-admiral/`, `/investor-relations/` (twice), and `€25k` on `/captain/deck/`. The homepage additionally carried a **seventh** conflicting round structure (`€500k` = 8 × €50k + €25k Deputy seats). All corrected to the ruling. Had the HIC not caught the first one, the rest would have shipped.
- **The pre-existing markup deltas were checked against HEAD before shipping** (`index.html` div:1, `captain/index.html` label:5) — identical before and after, so not introduced by this work. Worth not "fixing" reflexively.
- **The reveal effect was verified over HTTP, not `file://`.** Over `file://` the absolute `/shared-assets/` path resolves to filesystem root and the script silently 404s — the first test reported 0 elements tagged and looked like a bug in the script. Served over HTTP: 10 tagged, 0 left transparent past the backstop, no page errors.

## 5. Process learnings

- **A spec that arrives in six messages is not the same spec at message six.** Deputy Captain went industry × jurisdiction → industry × capability → both, with jurisdiction demoted to a qualifier. Building on message two would have been wasted work; the useful move was to record each version in the handoff and only build once the HIC said "Locked."
- **The reference implementation was in a different repo.** cari.fi's fade lives in `github.com/blogtheristo/cari`, not dws6 — attaching the repo and reading the real code beat guessing at "a fade like cari.fi." Its own source comments carried the non-obvious constraint (the backstop, and _why_ a cached image skips the fade on second view), which a visual copy would have missed.
- **`opacity: 0` effects need a failure mode.** The rule taken from cari.fi and kept: an effect must never leave content invisible. Backstop timer, reduced-motion honoured by showing immediately, and every hiding rule scoped under a `.js` class the script itself sets — so JS failure means _visible_, not blank.

## 6. Fail-loud register (what did NOT happen)

- **The four AI-persona photos are still unlabeled** (`AI_director.jpg`, `BusinessMentor.jpg`, `SolutionsArchitect.jpg`, `Strategic_advisor.jpg`). Article 50 enforcement started 2 Aug. The personas are being retired, but until the homepage "Our Team" section actually changes they are live and unmarked. **This is the oldest unresolved item across two sessions.**
- **Euro figures were deliberately not published on the careers page.** The existing "terms on inquiry / not a public offering" posture was preserved. Figures _were_ corrected where already public (investor pages), because leaving wrong numbers live is worse than the disclosure question.
- **`/captain/` and `/fleet-admiral/` still advertise "30 industries · 5 Clusters · 30 Captain Seats"** against canon's 25 industries / 16 hats. The Deputy tier was fixed on those pages; the industry-count drift was not.
- **`LD-2026-014` has not been superseded.** Its €200k Admiral figure is now known-wrong (ruling: €250k) but the locked entry stands until a new `LD-2026-0NN` is written with Risto approval + legal review of existing SAFEs.
- The Keenon robot is written on the band section as an **open request, not a member** — they have not answered.
- KB compile into `kb/wiki/` still has not run; only raw signals are captured.

## 7. HIC question (EU AI Act Article 14)

**The persona photos are the one item with a live regulatory clock on it, and they have now survived two sessions unresolved.** Enforcement began 2 August. Three ways to close it:

1. **Retire the "Our Team" AI-persona section now** — it is being replaced by real Industry Captains anyway, and deleting the section removes the Article 50 exposure entirely rather than labelling content you intend to drop. **(RECOMMEND: this one. It is reversible, it is one edit, and it stops us marking content we do not want to keep.)**
2. Label the four photos in place with the EU `AI GENERATED` icon and keep the section until real Captains replace it.
3. Replace the four photos with corrected, role-matched AI portraits, labelled — highest effort, and it invests in personas the HIC has already called an empty promise.

## 8. Session output

- Branch `claude/ai-pact-enforcement-transparency-gnnipk`, PR #1780. Merged `origin/main` (one trivial `.gitignore` conflict).
- **`onelifetime.world/careers/`** rebuilt: one career type, the role template with worked examples, three authority roles separated, canonical 25 industries, aspirational listings removed.
- **`lifetime.fi/careers/`** created: Lifetime Fleet (VIP Driver, Fleet Manager, Fleet Engineer), the band (Keith on drums, Risto on keyboards and guitar; bass, vocals, lead guitar open; sponsored by Lifetime Fleet), pointers to tarkkasiivous.fi and DWS Sales.
- **`dws10.com/shared-assets/motion/reveal.js`** added and synced to lifetime.fi + onelifetime.world.
- **Deputy removed as an investor tier** across five locations; homepage round corrected `€500k → €650k`.
- **lifetime.fi slogan** "Open models, workflows, Agents, transactions" applied in EN/FI/SV/DE/FR, leading the hero tagline while preserving the existing outcome formulation beneath it.
- Calendar: `2026-08-04 09:00` — decide the persona-photo question (§7) and close the Article 50 gap.

---

_Follows DWS Document Standard and DWS Learning Standard (HIC Learning Outcome, EU AI Act Art. 14)._
