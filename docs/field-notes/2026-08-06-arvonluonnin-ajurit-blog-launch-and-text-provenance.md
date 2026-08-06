# Field Note: Arvonluonnin Ajurit Blog Launch — and the Text-Provenance Extension

---

# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:

- Version: 1.0 | Tool: Claude Code (Sonnet 5) | Session: claude/arvonluonnin-ajurit-research-hpiipo | Date: 06.08.2026 | Changes: Initial field note. Records the 5-language publication of the "Six Drivers of Value" post, the AI-content labelling implementation (EU AI Act Article 50(4)), the lockstep thesis extension, and the DWS7 roadmap / Konsultoinnin käsikirja pointer updates from the same session.

Session Links & References:

- Claude Code (claude/arvonluonnin-ajurit-research-hpiipo): https://claude.ai/code

Document Status:

- Created: 06.08.2026
- Last Modified: 06.08.2026
- Language: English
- Publication Status: ACTIVE
- Classification: INTERNAL
- Document Type: Field Note / HIC Learning Outcome

Related Documents:

- `docs/KONSULTOINNIN_KASIKIRJA_2026.md` v1.11 (§2.1/§2.2, source content)
- `docs/BLOG_STANDARD.md` §3.2.1 (AI-content labelling policy)
- `docs/metropolia/master-thesis/{en,fi}/V3Thesis_{EN,FI}.md` §10.17 (implementation)
- `docs/PHD_FIREHORSE_{EN,FI}.md` §14.48 / Key Contribution #53 (scientific restatement)

---

## What happened

This session (continued from a prior arvonluonnin-ajurit research session) did three things in sequence:

1. **Drafted and published a 5-language blog post** — "Six Drivers of Value — and the Research Behind Them" (EN/FI/SV/DE/FR), at `onelifetime.world/posts/arvonluonnin-ajurit-2026*.html`. EN and FI were agent-drafted from the handbook's §2.1/§2.2. SV, DE and FR went through two rounds: an initial agent free-translation, then a full rewrite using HIC-supplied structured text (the FR variant explicitly labelled "Gemini version" by the HIC) — the second round is what shipped. Hero images are two infographics the HIC uploaded directly, confirmed byte-identical to `Sales/IMG_6895.png` (FI) / `IMG_6896.png` (EN) already on `main`.
2. **Built the publishing pipeline and the AI-content notice.** `scripts/build-arvonluonnin-ajurit-post.mjs` renders the 5 approved drafts to HTML, refuses to run unless every draft's `Status: APPROVED`, and unconditionally injects a per-language `<aside class="ai-notice">` (EU AI Act Article 50(4), per `DWS_BLOG_STANDARD.md` §3.2.1) — sourced from a table in the script, not authored per post. Registered in the post registry, `latestPosts`, and the nav injector; dual-folder synced throughout.
3. **Propagated the outcome into three canonical documents**, additively, in lockstep where required: `DWS7_ROADMAP.md` (changelog pointer, no PR content changed), `Konsultoinnin käsikirja` v1.10→v1.11 (cross-reference to the live post), and the four-file thesis set (master's + PhD, EN + FI) at v3.97→v3.98, adding §10.17 / §14.48 + Key Contribution #53.

## The insight

Two governance layers that look like the same approval are not. **Rule 13's publication gate** ("did a human read and approve this text before it ships") and **Article 50(4)'s labelling gate** ("is there a named, publicly-reachable, accountable reviewer credited on this page") ask different questions and carry different evidentiary standards. This session's own conversational approval of all 5 drafts satisfied the first and, on its own, did not satisfy the second — no per-page reviewer credit was produced, so all 5 pages correctly ship with the AI-content notice on by default per `DWS_BLOG_STANDARD.md` §3.2.1's stricter-than-statutory four-condition test.

The engineering corollary, extending the same rule the media-marking work (§10.16, four days earlier) established: a label a human is expected to remember per-post will eventually be forgotten; a label attached mechanically from a table at build time cannot be. This is now demonstrated at both the media layer (icon composited into video frames) and the text/translation layer (notice injected from a per-language table into every rendered page) — recorded as the "Text-Provenance Extension" in the PhD thesis (§14.48, Key Contribution #53) and as implementation evidence in the master's thesis (§10.17).

## Next steps

- If the HIC wants any language's notice removed, the 4-condition reviewer-credit process (named reviewer, demonstrated authority, publicly reachable contact, explicit removal action — `DWS_BLOG_STANDARD.md` §3.2.1) must run per-language; it has not run for any of the 5 pages yet.
- The blog post is live on the feature branch, not `main` — sites auto-deploy via Cloudflare Pages only on merge to main. Awaiting HIC instruction to merge.
- `docs/blog-drafts/kya-s1-one-signed-page.md` remains a parked, unpublished draft from an earlier session (04.08.2026) — flagged by the session-stop hook as advisory. Not actioned this session; still awaiting an HIC decision to publish or park permanently.

## HIC Learning Outcome — six-step record

1. **Knowledge base:** N/A — no `kb/` directory exists in this clone; content carried by this field note and the thesis §10.17/§14.48 entries.
2. **Field note:** this document.
3. **`Learn/` HTML:** ✅ `Learn/2026-08-06-arvonluonnin-ajurit-blog-launch-and-text-provenance.html` (this note) plus the 4 thesis renders at v3.98 (`Learn/V3Thesis_{EN,FI}_v3.98.html`, `Learn/PHD_FIREHORSE_{EN,FI}_v3.98.html`).
4. **Drive export:** not performed this session — offered, not yet done. Say the word and this note plus the thesis renders can be pushed to the `2026 DWS6` Drive folder.
5. **HIC decision-shaped question:** see chat, end of session.
6. **Calendar:** no new dated commitment was created this session (the KYA-S1 04.11.2026 comment-window close and the 07.08.2026 Shai-Hulud freeze review were already calendared in prior sessions). Nothing new to calendar.
