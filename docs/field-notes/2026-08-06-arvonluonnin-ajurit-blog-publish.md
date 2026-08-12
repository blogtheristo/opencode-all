# Field Note: Arvonluonnin Ajurit — Handbook v1.10 and a 5-Language Blog Launch

---

# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:

- Version: 1.0 | Tool: Claude Code | Session: claude/arvonluonnin-ajurit-research-hpiipo | Date: 06.08.2026 | Changes: Initial field note — value-creation-drivers research folded into `KONSULTOINNIN_KASIKIRJA_2026.md` (v1.9 §2.1, v1.10 §2.2), then carried into a public 5-language blog post (`arvonluonnin-ajurit-2026.{html,fi,sv,de,fr}.html`), HIC-approved and published this session.

Session Links & References:

- Claude Code (claude/arvonluonnin-ajurit-research-hpiipo): https://claude.ai/code

Document Status:

- Created: 06.08.2026
- Last Modified: 06.08.2026
- Language: English
- Languages Available: English
- Publication Status: ACTIVE
- Classification: INTERNAL
- Document Type: Field Note

Related Documents:

- `docs/KONSULTOINNIN_KASIKIRJA_2026.md` §2.1/§2.2
- `docs/BLOG_STANDARD.md` §3.2/§3.2.1
- `.claude/handoffs/claude/arvonluonnin-ajurit-research-hpiipo.md`

---

## What happened

The session started as a research task — map Lifetime Oy's current value-creation drivers and fold
the findings into the consulting handbook. It ended as a fully published, 5-language public blog
post, via a chain of HIC corrections that changed the deliverable at each step.

1. **Research → handbook.** Mapped six commercial value dimensions (58 agents/88 capabilities,
   EU AI Act Article 12/50 compliance automation, LWM ontologies with zero key-person risk, a
   two-person core team + 50-partner network, Finnish cultural differentiation, the continuous
   learning loop) plus a seventh, deliberately separate academic dimension (LUT doctoral track, KTH
   TECoSA, Metropolia). Landed as `KONSULTOINNIN_KASIKIRJA_2026.md` v1.9 (§2.1) and v1.10 (§2.2),
   pushed as standalone commits directly to `main` on explicit HIC instruction — kept separate from
   the blog work so an unapproved draft could never ride along with an approved document.

2. **Handbook → blog draft, twice corrected on images.** Asked to turn the same material into a
   blog post, first pass used two mismatched infographics split awkwardly by language; HIC said
   "wrong photos." Checked how the site's actual EN/FI post pairs handle images — one shared photo,
   not a language split — and corrected. HIC then supplied two custom infographics directly
   (uploaded, and separately confirmed present in `Sales/IMG_6895.png` / `IMG_6896.png` on `main`,
   byte-identical to the uploads) — those became the real hero images.

3. **5 languages, and the HIC out-translated the draft.** Asked to extend to 5 languages
   (EN/FI/SV/DE/FR) with Swedish "especially valuable" (the KTH-Stockholm partnership gives Swedish
   readers a direct stake). Drafted all 5. The HIC then supplied their own structured Swedish text
   (more detailed than the free translation — current-scope/operational-reach framing, a regulatory
   timeline, Climate IQ pricing), then the equivalent in French ("compare gemini version") and German.
   All three were rewritten to match the HIC-supplied text rather than the original narrative
   translation — each time confirmed against the source, one typo fixed (FR: "strictly" → "strictement").

4. **Approval, and a compliance gap caught before publish.** HIC approved all 5 explicitly, with
   hero-image assignment (EN infographic for EN/SV/DE/FR, FI infographic for FI). Building the actual
   HTML surfaced a second issue on the way: `DWS_BLOG_STANDARD.md` §3.2.1 requires an AI-content
   notice (EU AI Act Article 50(4)) on any AI-drafted page covering a regulatory topic unless a named
   human reviewer is credited. None of the 5 pages had that credit recorded, so all 5 shipped with
   the notice rather than silently omitting it — a page that never says "AI wrote parts of this" is a
   legal claim, not a convenience.

5. **Published.** All 5 pages live on the feature branch (`onelifetime.world/posts/`), dual-folder
   synced to `landing-pages/onelifetime-world/`, registered in the post registry (#49–53), EN+FI
   prepended to `latestPosts` (Text of the Day now points to the EN post automatically), and the nav
   injector re-run — which updated the previous post's "next" link and required its own dual-folder
   sync, a knock-on effect that would have gone unnoticed without a full-repo diff check.

## The insight, stated plainly

**"Approved" is not "correct," and the two most expensive mistakes this session were caught by
checking the site's own conventions rather than trusting a first draft.** The wrong-photo mixup and
the missing AI-notice would both have shipped clean — no error, no crash, nothing a build would
catch — if the site's existing EN/FI post pairs and `BLOG_STANDARD.md` §3.2.1 hadn't been checked
against directly. Neither was flagged by the HIC; both were caught by reading the actual repository
state before building. The corollary for any agent building on this pattern: **the safe default when
a page is AI-drafted and covers a regulated topic is to ship the notice**, not to assume approval of
the _content_ is also an implicit review credit for the _authorship claim_ — those are different
questions, and DWS policy makes the second one deliberately stricter than the EU AI Act's own minimum.

## What's next

- **PR/main.** All 5 pages are on `claude/arvonluonnin-ajurit-research-hpiipo`, not `main` — sites
  auto-deploy via Cloudflare Pages only on merge. Asked the HIC whether to merge now or open a PR
  first; awaiting answer.
- **AI-notice removal.** Available per §3.2.1's 4-step process (named reviewer, public contact,
  substantive pre-publication read) — not started for any of the 5 languages.
- **Parked from a prior session:** `docs/blog-drafts/kya-s1-one-signed-page.md` remains
  `Status: DRAFT`, unpublished, from the 04.08.2026 KYA-S1 re-land session. Not touched this
  session; flagged here so it does not silently age further.

## HIC Learning Outcome Record (DWS_LEARNING_STANDARD)

1. Knowledge base: see companion `/kb` update, this session.
2. Field note: this document.
3. `Learn/` HTML: `Learn/2026-08-06-arvonluonnin-ajurit-blog-publish.html`, rendered via
   `scripts/render-doc.sh`.
4. Drive export: offered in-session; performed only on HIC confirmation (outbound action on the
   HIC's own Drive account).
5. HIC decision-shaped question: put to the HIC in the same turn as this note.
6. Calendar: no new dated commitment surfaced this session beyond ones already tracked
   (KYA-S1 comment-window close, 04.11.2026 — pre-existing, not created here).
