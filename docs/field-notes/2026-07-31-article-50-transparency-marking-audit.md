<!--
VERSION AND AGENT HISTORY
Document: HIC Learning Outcome — Article 50 AI Act transparency marking audit, 2026-07-31 session
Version: 1.1
Date: 2026-07-31
Author: Risto Anton Päärni (risto.paarni@lifetime.fi), Founder, CEO, Lifetime Oy
Owner: Lifetime Oy
Status: Active
Agent: Claude Code, session claude/ai-pact-enforcement-transparency-gnnipk
Purpose: Record the AI Pact Secretariat enforcement note (2 Aug 2026 Article 50 start) and the resulting audit of public DWS sites for AI-generated content requiring marking/labelling, per DWS_LEARNING_STANDARD (EU AI Act Article 14 human oversight) and DWS_TRUTH_STANDARD §2G.
-->

# Article 50 AI Act Transparency Marking Audit — 2026-07-31

## 1. What the session was, and what it became

Started from a forwarded partner outreach note from the European Commission's AI Pact Secretariat: the AI Act's Article 50 transparency obligations (marking of AI-generated content by providers, labelling of deepfakes and unreviewed AI-generated public-interest text by deployers) become enforceable **2 August 2026** — two days from the note. It also flagged ~190 organisations having signed the voluntary Code of Practice on Transparency of AI-generated Content, new complaint/whistleblower tooling, and penalties up to €15M / 3% global turnover.

The HIC redirected the session to the concrete question this implies: **which of our own public pages, images, and video need marking before enforcement starts**, and pointed to the EU's icon set as the marking mechanism. Mid-session the HIC also supplied the exact icon files — they had already been added to `Legal/` on `main` (commit `260de12` "AI Labels to mark content", then `b4605a3` "AI Labels modified and generated") — plus the official placement, accessibility, and licence text from the EU icons page (which this session's own `WebFetch` calls could not reach — 403 on every `digital-strategy.ec.europa.eu` and third-party mirror URL tried; `WebSearch` filled the initial gap, the HIC's pasted text gave the authoritative placement/accessibility/licence detail).

## 2. Six-step Learning Standard record

| #   | Step                         | State                                                                                                                                                                                                                                                                      |
| --- | ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Update knowledge base        | ✅ `kb/raw/signals/2026-07-31-ai-pact-article50-enforcement.md` (raw source, not yet `/kb compile`d)                                                                                                                                                                       |
| 2   | Field note                   | ✅ This document                                                                                                                                                                                                                                                           |
| 3   | Learn/ HTML render           | ✅ `Learn/2026-07-31-article-50-transparency-marking-audit.html` — `pandoc` is unavailable in this container (confirmed, not assumed); rendered with `python-markdown` instead, stated plainly in the file's own `generator` meta tag rather than faking pandoc provenance |
| 4   | Export to Drive              | ✅ Google Doc "2026-07-31 Field Note v1.0 — Article 50 AI Act Transparency Marking Audit" in the `2026 DWS6` folder (`docs.google.com/document/d/1IhG0D081k4BxTrWGZcXxUAXENt2zIAUTkBXGeU__qrw`)                                                                            |
| 5   | HIC decision-shaped question | ✅ §7 below (now three questions — a third was added after the HIC asked about the disclosure page directly)                                                                                                                                                               |
| 6   | Calendar dated commitments   | ✅ Four Google Calendar events (see §8) — the original three, plus the VDP policy's quarterly-review date, shifted from the stated 2026-10-31 (a Saturday) to 2026-10-30 per §4.1's weekend rule                                                                           |

Originally deferred at the time this note was first written (all-day, same-session close-out): the audit itself and the two live decisions (labeling now vs. after HIC sign-off, Code of Practice signature) were the time-critical path given the 2 Aug date. Steps 1/3/4 were completed in a same-session follow-up pass once the HIC asked directly.

## 3. What was verified, not assumed

- **The three EU icon files exist in `Legal/`** on `main` (`AI LABELS_3x2_AI_black.png` = General AI Involvement, `..._AI GENERATED_black.png`, `..._AI MODIFIED_black.png`) — confirmed via `git ls-tree` and `git show --stat`, not assumed from the HIC's screenshots alone. **Only the black, fully-opaque variant of each exists.** The official EU set also ships white, black-50%-transparent, and white-50%-transparent variants for dark backgrounds/video overlays — none of those are in the repo yet.
- **DWS has not signed the Code of Practice on Transparency of AI-generated Content** — per existing `DWS_TRUTH_STANDARD.md` §2G (verified 27 Jul 2026, unchanged this session). The Code is voluntary; Article 50's legal obligations are not. Icon use does not by itself establish compliance (HIC's own pasted licence text confirms this explicitly), and non-signatories using the icon must not let that read as claiming Code adherence.
- **The audit was run by a subagent with degraded tooling** (no exiftool/PIL in-container; AI-origin was inferred from filename patterns, visible Gemini/Nano-Banana watermarks on ~25 directly-opened images, and raw byte-grep for C2PA/XMP strings on the rest). Metadata "not found" was **not** treated as proof of non-AI origin — flagged as inconclusive in the audit itself.
- **The 114-of-117 onelifetime.world blog posts with no `docs/blog-drafts/*.md` file is a gap in retroactive evidence, not a confirmed rule violation** — the `/blog-draft` gate (BLOG*STANDARD.md v2.7) is four days old and explicitly prospective; these posts predate it by months. Whether they underwent \_some* human editorial review through the prior (pre-gate) process is unknown from the repo and needs the HIC's own recollection.

## 4. Bugs found by doing the work

- The stop-hook's untracked-file check flagged `telemetry/token-usage/*.jsonl`, a harness-generated session artifact with no `.gitignore` rule. Fixed by adding `telemetry/` to `.gitignore` (commit in this branch) rather than committing session telemetry.
- `WebFetch` returned HTTP 403 on every `digital-strategy.ec.europa.eu` URL tried, and also on two independent third-party mirrors (`aimpactful.com`, `modulos.ai`) — this looks like a broader WebFetch outage in this session rather than a single-site block, since unrelated domains failed identically. Worked around via `WebSearch` and the HIC's own pasted source text; flagging in case it recurs for other sessions.
- Orphaned files found in the audit that should be cleaned up regardless of Article 50: `dws10.com/Hero/gemini_generated_video_EA97318F.MP4` (duplicate of the referenced video, not linked from any page) and `onelifetime.world/static/images/blog/{tech-friends-hangout.jpeg, banana-keep-it-peel.png, moat-fortress-investor.png, moat-fortress-buyer-ari.png}` (not referenced by any current post).

## 5. Process learnings

- A rebase onto `main` mid-session, after already pushing a commit, produces a real non-fast-forward conflict once `main` advances again — the repo's guard hooks correctly block both `push --force` and `reset --hard` as the fix. The safe resolution is a plain `git merge` of the previously-pushed remote branch into the rebased local `HEAD` (trivial when content is equivalent), which preserves all history and pushes as a normal fast-forward-compatible update. Worth a line in `.claude/HANDOFF.md` or `AI_AGENT_GUIDELINES.md` so future sessions don't reach for force-push as the first instinct.
- Article 50's placement rule that a deepfake's label "must be visible when content is reshared or downloaded" has a real production consequence for the dws10.com hero video specifically: an HTML/CSS overlay label satisfies visibility on the page but **not** on a downloaded/re-shared copy of the video file itself. Meeting the letter of the rule for that asset means burning the icon into the video frames (re-encode) or accepting the overlay-only approach as a documented, lesser-compliance interim measure. This is a production decision, not just a copy decision — flagging so it isn't waved through as "add a label" scope.

## 6. Fail-loud register (what did NOT happen)

- **No labels have been added to any live public page, image, or video — as of this update, still true.** The HIC asked directly ("Did you put the AI logo to our onelifetime.world/blog entries") and the honest answer is no. This remains a deliberate choice, not an oversight: wording, exact icon variant/placement, and the video re-encode-vs-overlay tradeoff are HIC decisions, and the audit subagent's AI-origin classification has real uncertainty (§3) that shouldn't be silently resolved by auto-applying labels everywhere flagged "uncertain."
- The Code of Practice signatory question (should DWS sign) was raised by the audit and by existing `DWS_TRUTH_STANDARD.md` §2G, but not decided — see §7.
- KB compile (`/kb` full compile into `kb/wiki/`) has still not run — the raw signal is captured (§2 step 1) but not yet synthesized into the compiled wiki.

## 7. HIC questions (EU AI Act Article 14)

**§7.1 resolved 31.07.2026, superseded 01.08.2026** — the HIC's first answer was "the hero video is old and its message is outdated," i.e. retire it rather than label it. Removed the `<video>` block from `dws10.com/index.html` (homepage) and the "Video Slide" from the `investor-relations/index.html` carousel (+ both `landing-pages/dws10-com/` mirrors); the carousel JS queries `.carousel-slide` dynamically so no index/count fix was needed. The underlying files (`public/videos/gemini_generated_video_EA97318F.{mp4,webm}`) were **not** deleted, per CLAUDE.md Rule 6 (no destructive file removal without explicit intent) — only de-referenced from live pages. The orphaned duplicate `dws10.com/Hero/gemini_generated_video_EA97318F.MP4` (§4) is unaffected and still flagged for cleanup if the HIC wants it gone.

The HIC then generated a replacement video matching the current hero copy and uploaded it directly to this branch (`SCENE_Modern_Nordic_industria.mp4`, confirmed valid MP4, 1280×720, 10.01s, via a hand-rolled `mvhd`-box parser since neither `ffprobe` nor `apt install ffmpeg` were available in-container — `pip install imageio-ffmpeg` pulled a working static ffmpeg 7.0.2 binary from PyPI instead, unblocking both inspection and encoding). Went with recommendation (b) from the original question — burned the `Legal/AI LABELS_3x2_AI GENERATED_black.png` icon into the video frames (bottom-right corner, ~22% width, visible throughout) via `ffmpeg overlay`, rather than an on-page-only overlay, since Article 50's placement text requires the label to survive download/re-share. Verified the composited result visually (extracted frame, read back with the Read tool) before publishing — icon is legible, doesn't obscure the subject or the in-scene "Sovereign by Design" plaque. Generated a matching poster frame (`sovereign-compute-hero-poster.jpg`) and a VP9/WebM fallback, both with the label baked in. Wired into `dws10.com/index.html`'s hero video block (+ `landing-pages/dws10-com/` mirror); `investor-relations/index.html` intentionally left without a video — the HIC wants a separate, dedicated investor video, not a reuse of the hero one.

**Investor video delivered same day.** The HIC generated and uploaded a second, distinct video (`Investor_Modern_Nordic_in.mp4`, same specs: 1280×720, 10.01s) built from a prompt pulled from the actual investor-relations page copy ("Software-led, priced like labor, with software margins" / CBAM, CSRD, ETS / €17K vs €350K) rather than reusing the hero script — same presenter and control-room setting for brand continuity, distinct dialogue. Same labeling treatment applied (`AI GENERATED` icon burned in bottom-right, matching poster + WebM fallback generated) and wired into the `investor-relations/index.html` carousel's "Video Slide" (re-added in the same carousel position the old one occupied; carousel JS confirmed unaffected). Both hero and investor videos are now labeled and live before the 2 Aug enforcement date.

Two decisions remain open:

1. Should DWS **sign the Code of Practice on Transparency of AI-generated Content**? Signing gives a presumption-of-compliance safe harbor and access to the Signatory Taskforce; not signing means DWS must independently demonstrate its marking/labelling measures are adequate if ever challenged, and using the EU icons without signing must not be presented as Code adherence. **(RECOMMEND: sign — given DWS already uses the EU icon set and is building genuine C2PA-style marking practice, the administrative-burden reduction and legal certainty look like a clear net positive; this is a one-way-door-adjacent action (public signatory list, cooperation commitments) so flagging for your explicit call rather than defaulting to it.)**
2. **Should DWS stand up a paid bug-bounty program** alongside the new disclosure-only `vulnerability-disclosure-policy/` page? Today's policy is report-and-thank-you, no payment terms — a different, and bigger, commitment (budget, triage capacity, possibly a third-party platform like HackerOne/Intigriti). **(No recommendation yet — this depends on your appetite and budget, not on any regulatory deadline, so it's a genuine open question rather than a default-and-flag one.)**

## 8. Session output

- Branch `claude/ai-pact-enforcement-transparency-gnnipk`: `.gitignore` fix for session telemetry; rebased onto `main` to pick up the three `Legal/AI LABELS_3x2_*` icon files; shipped `dws10.com/compliance/vulnerability-disclosure-policy/` (+ `landing-pages/dws10-com/` mirror), with cross-links from `.well-known/security.txt`, `legal/index.html` §10, `compliance/trust-center/index.html`, the Compliance Hub nav flyout (4 languages), and `DWS_SECURITY_STANDARD.md` §20 (v3.4 → 3.5).
- `kb/raw/signals/2026-07-31-ai-pact-article50-enforcement.md` added (Learning Standard step 1).
- `Learn/2026-07-31-article-50-transparency-marking-audit.html` rendered via `python-markdown` (Learning Standard step 3; `pandoc` unavailable in-container, noted honestly rather than faked).
- Drive export (Learning Standard step 4): Google Doc "2026-07-31 Field Note v1.0 — Article 50 AI Act Transparency Marking Audit" in the `2026 DWS6` Drive folder.
- Four Google Calendar events created (Europe/Helsinki): 31 Jul (all-day) — label the hero video + persona photos; 3 Aug 09:00 — verify labels live post-enforcement; 1 Dec 09:00 — confirm exact grace-period end date and check provider marks; 30 Oct 09:00 — VDP policy quarterly review (shifted from the stated 31 Oct, a Saturday).
- Full audit table (per-site, per-asset, obligation, action) is in this session's transcript; not yet mirrored into `kb/wiki/` (compile still pending).

## 9. Appendix — EU AI Act reference (governance, enforcement, timeline)

Added at the HIC's request from the Commission's own "European approach to artificial intelligence" and "Governance and enforcement of the AI Act" pages (`digital-strategy.ec.europa.eu`) — background context for this note, not independently re-verified beyond what's quoted here.

**Governance structure.** The **AI Office** (established within the Commission, June 2024) and **national market surveillance authorities** implement, supervise, and enforce the AI Act. Three advisory bodies steer it: the **European Artificial Intelligence Board** (Member State representatives), the **Scientific Panel** (independent AI experts), and the **Advisory Forum** (commercial + non-commercial stakeholders). National competent authorities split into **market surveillance authorities** (enforce AI system rules, including high-risk and prohibited-practice rules) and **notifying authorities** (supervise conformity-assessment bodies); Member States were required to designate these by **2 August 2025**. Fundamental-rights protection authorities (privacy, non-discrimination) have a right to be informed of serious incidents and to request information/cooperation from market surveillance authorities — relevant if a DWS deployment ever triggers a fundamental-rights complaint rather than a pure Article 50 one.

**Timeline directly relevant to DWS** (compressed from the Commission's full milestone list — see source for the complete history back to 2018):

| Date        | Milestone                                                                                                                  |
| ----------- | -------------------------------------------------------------------------------------------------------------------------- |
| 1 Aug 2024  | AI Act enters into force                                                                                                   |
| Sep 2024    | Companies begin signing **AI Pact pledges** (Pillar II) — distinct from the Code of Practice on Transparency               |
| 2 Aug 2025  | GPAI provider obligations enter into application; national competent authorities were due to be designated                 |
| 24 Nov 2025 | AI Act Whistleblower tool launches                                                                                         |
| 7 May 2026  | Political agreement on the **AI Omnibus** (simplification package)                                                         |
| 10 Jun 2026 | Code of Practice on marking and labelling of AI-generated content published                                                |
| 20 Jul 2026 | Guidelines on Article 50 transparency obligations published                                                                |
| 27 Jul 2026 | AI Omnibus enters into force                                                                                               |
| 2 Aug 2026  | **AI Office + national authorities begin enforcing the AI Act**, incl. Article 50 transparency rules (this note's trigger) |

**Other EU AI policy threads not yet touched by DWS canon** (flagging for awareness, not action): the **AI Continent Action Plan** (AI Factories/Gigafactories, €200bn InvestAI facility, upcoming Cloud and AI Development Act), the **Apply AI Strategy** and **Apply AI Alliance** (SME AI-adoption support), and the **July 2026 EU Action Plan on Cybersecurity and AI** (third-party AI-model evaluation capacity, targeted operational by 2027). None of these currently affect a DWS obligation the way Article 50 does; noted here so a future session doesn't have to re-discover them from scratch.

---

_Follows DWS Document Standard and DWS Learning Standard (HIC Learning Outcome, EU AI Act Art. 14)._
