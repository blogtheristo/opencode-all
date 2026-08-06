<!--
VERSION AND AGENT HISTORY
Document: Field note — translation as data, and the second-time rule
Version: 1.0
Date: 2026-07-27
Author: Risto Anton Päärni (risto.paarni@lifetime.fi), Founder, CEO, Lifetime Oy
Owner: Lifetime Oy
Status: Active
Agent: Claude Code, session claude/ollama-orchestration-merge-047pj7
Purpose: Record the generalisation of the i18n page builder and the five-language
         publication of LSJ #43, including what the string-array approach does not
         cover and what shipped unreviewed.
-->

# Translation as data — and what a string array does not cover

**Date:** 2026-07-27 · **Scope:** `scripts/i18n/build-i18n-pages.cjs`, LSJ #43–#47

## 1. The second time is the signal

The Aegis page needed five languages. Then the blog post needed five languages. Per the
Skill Codification Rule, the second ask is not "do it again" — it is "the procedure was
never written down". `build-aegis-pages.cjs` became `build-i18n-pages.cjs`: same design,
config-driven, target-agnostic. Adding a sixth surface is now a JSON file, not a script.

The design that survived generalisation:

> **Translation is data. Markup manipulation is deterministic code.**

Translators receive a JSON array of text nodes in document order and return the same array,
same length. They never see HTML, so they cannot break it. The builder reassembles. When a
translation's string count drifts from the master, the builder **refuses to write** rather
than emitting a page whose paragraphs have quietly shifted by one.

## 2. What the string array missed (found by verifying, not by planning)

Text nodes are not all the text. Four categories of user-visible copy live in **attributes**
and sailed straight through the first build in Finnish:

| Missed | Where it shows | Severity |
| --- | --- | --- |
| `og:title`, `twitter:title` | The headline on every LinkedIn and X preview card | **High** — the share card is the post for most readers |
| `description`, `og:description`, `twitter:description` | Search snippet, preview card body | High |
| `article:section` | Structured data | Low |
| `aria-label="Valikko"` | Screen readers, on all four translated pages | Low, but it is an accessibility defect |

Fixed by adding `meta.json` — the same data-not-markup pattern, one level down. A key that
looks like a full attribute (`aria-label="Valikko"`) is replaced literally; anything else is
treated as a `<meta>` name/property. Both forms fail loud if the key is absent from the master.

**The lesson generalises:** "extract the text nodes" is an incomplete definition of "the text".
Anything a human reads — including what they read in a preview card they never click — is copy.

## 3. Two tools, one file, no contention

`inject-blog-nav.cjs` owns a generated block at the bottom of every post. The i18n builder
owns the rest. Left alone they would fight over the same bytes on every run.

Resolution: a `cutMarker` in the config. Content after it is never translated, but its URL and
share title **are** retargeted, so a French page shares itself rather than the Finnish master.
The translated pages stay out of the injector's `posts` array, so the injector skips them
entirely. Verified: running the injector afterwards is a no-op on all five files.

The prev/next chain therefore contains the editorial unit once, not five times. A reading order
whose length depends on how many languages a post has is not a reading order.

## 4. Idempotency is a property you test, not one you assert

The builder's master may be a page the builder itself produced. Three consecutive runs were
diffed and are byte-identical. The earlier Aegis builder failed exactly here — a one-byte
asymmetry between strip and insert meant every run grew the file. The guard that caught it was
the builder's own string-count check, the same hour it was written.

## 5. Fail-loud register

- The EN/SV/DE/FR text is **machine translation** built to canonical regulatory terms. **No
  native-speaker and no legal review.** Recorded in the PR body and in `BLOG_STANDARD.md` §3.2.
- SV/DE/FR are not listed in `latestPosts` — reachable via `hreflang`, the on-page switcher and
  the §3 registry, but not from the blog index list. Deliberate (PAGE_SIZE is 5); documented.
- Blog posts do not pass `prettier --check`, including every post already on `main`. Not fixed
  here — reformatting 60 committed files is not this change.
- Blog posts are absent from `sitemap.xml` entirely. **Pre-existing, not introduced here, and
  not fixed here** — it is a real SEO gap and belongs in its own change.
- `Learn/` HTML still not regenerated: no pandoc in the container, and `gen-thesis-html.cjs`
  mislabels output versions. Open action carried from 2026-07-26.

## 6. The question has a legal deadline — EU AI Act Article 50(4)

Added the same day, after the HIC supplied the Commission's EU Icons page. What looked like an
editorial judgement call turns out to have a statutory clock on it.

**Article 50(4)** obliges *deployers* to label AI-generated or manipulated **text published to
inform the public on matters of public interest**. It **applies from 2 August 2026** — six days
after this note. DWS is a deployer on its own sites, and a machine-translated page is
AI-manipulated text. The four translations are therefore in scope.

There is an exemption, and it is narrow: content that underwent **substantive human review
before publication** under a **publicly identifiable person holding editorial responsibility**,
with a genuine ability to amend or reject. Cursory approval does not qualify. **The four
translations have had no review at all**, so the exemption does not currently apply to them.

The Commission's **EU Icons** (published 10.06.2026, free, SVG/PNG, no attribution required) are
**optional**. The label is not. Using an icon does not by itself establish compliance.

Registered as `DWS_TRUTH_STANDARD.md` §2 row 31 / §2G, with the verification caveat that
`ec.europa.eu` returns HTTP 403 to automated fetch — the dates and paragraph numbers were
corroborated from Commission FAQ text in search plus independent legal commentary, and need a
human to confirm against the primary source.

## 7. The Article 50 decision, and what shipped

> **Five languages now ship from one master with no human in the translation path.** The
> string-count guard proves the page is *structurally* correct; nothing proves it is
> *linguistically* correct, and the regulatory vocabulary (asetus / Verordnung / règlement)
> is precisely where a wrong word becomes a wrong claim.
>
> Article 50(4) narrows this from a preference to a choice with a date on it. **Before
> 2 August 2026, which one:** (a) a named human reviews and signs each translated page, taking
> editorial responsibility publicly — the exemption route, which also fixes the quality gap;
> (b) the pages carry an AI-generated-content label, optionally the EU Icon — the transparency
> route, cheap and honest but it tells every buyer the page is unreviewed; or (c) the
> translations come down until (a) is done.
>
> Doing nothing is not a fourth option — it is (b) without the label, which is the one state
> the regulation forbids.

**Answered the same day.** HIC: _"A is ideal choice but B is minimum requirement."_

So (b) is now the **default state of the machinery**, not a one-off patch: every machine-translated
page ships with the label, and (a) is what removes it. The four translations carry an
`<aside class="ai-notice">` before the article body, in their own language, linking to the Finnish
original as the authoritative text. Lifting a label per language requires four things to actually be
true (named reviewer, substantive pre-publication review, authority to reject, publicly reachable
contact) — written down in `BLOG_STANDARD.md` §3.2.1 so the exemption cannot be claimed casually.

Two things deliberately left undone rather than faked:

- **No EU Icon asset.** It is optional, the Commission's site blocks automated download, and drawing
  a lookalike would misrepresent an official mark. The builder has the slot; a human fetches the file.
- **The Finnish master is unlabelled**, on the theory that the HIC read and released it and is named
  on it with public contact details. That is a plausible exemption, not a confirmed one — raised in
  `DWS_TRUTH_STANDARD.md` §2G rather than quietly assumed.

The design lesson worth keeping: the compliant state had to become **the default the tool produces**,
not a step someone remembers. A label you have to remember to add is a label that will be missing on
the page that matters.

## 8. Then the HIC supplied the primary source — and it corrected me

`ec.europa.eu` returns 403 to automated fetch, so the first pass was built from Commission FAQ text
surfaced in search plus legal commentary. The HIC retrieved the page. Four corrections followed, and
the pattern in them is worth more than the individual facts.

| I had | The source says |
| --- | --- |
| A "narrow interpretation" test attributed to *Commission guidance* — substantive review of accuracy/plausibility/sources, publicly accessible contact details | **Not Commission text.** It came from secondary commentary on draft guidelines. Moved to `BLOG_STANDARD.md` §3.2.1 and relabelled as **DWS policy, stricter than the minimum** — which is what it always was |
| Icons "published 10 June 2026" | **Not on the page.** Date removed rather than restated — nothing depended on it |
| The human-review carve-out as an exemption bolted onto the duty | It is written **into the scope of the duty**: text is in scope only where it had **neither** review/editorial control **nor** an assumed editorial owner |
| One undifferentiated "EU icon" | **Three classes** — Basic / Fully AI-Generated / Partially AI-Modified — plus placement, accessibility and licence rules I did not have at all |

Two things I had simply missed, both of which change the work:

- **Icon + text label beats either alone.** The Commission user-tested this; performance improved
  across all measures. Our label-only implementation is therefore the weaker tested form, not an
  equivalent substitute. The icon is a real gap, not a nice-to-have.
- **The disclosure must survive resharing and downloading.** Ours is embedded in the page HTML so it
  survives download — but it is absent from the `og:`/`twitter:` card, so a LinkedIn share of a
  translated page shows the headline with no label. Recorded in §2G as a known gap.

Two judgement calls I refused to make alone:

- **Which icon class fits a machine translation.** The target text is entirely AI-produced (*Fully
  AI-Generated*) but derives from human-written source (*Partially AI-Modified*). The Commission's
  examples do not cover translation. The DWS label sidesteps it by stating the fact — "machine
  translation of the Finnish original" — rather than asserting a category.
- **Abbreviations.** The accessibility guidance says avoid abbreviations other than "AI". The German
  and French labels used KI and IA. Rather than choose between the literal reading and the obvious
  national equivalents, both now expand on first use: *Von künstlicher Intelligenz (KI) generierter
  Inhalt*, *Contenu généré par intelligence artificielle (IA)*.

**The generalisable failure:** every one of these came from summarising a summary. Secondary sources
were directionally right and specifically wrong, and the errors all pointed the same way — toward
*more confident, more quotable* claims than the primary text supported. When a source cannot be read,
that is a fact to record, not a gap to fill with the most plausible-sounding version.

## 9. The second unenforced rule, found by being told about it

Then the HIC said the thing that reframed the whole session:

> "I have many times i want blog entries as drafts for me to review as copy paste window before i
> approve them … but this never comes real. Sometimes container publish without showing me anything,
> sometimes entry is never published, almost never i get to see the text."

That is the same failure as the AI label, seen from the other end. The label was *going to be*
missing because adding it was something to remember. The draft review **had been** missing, for
months, for exactly the same reason. Two instances in one session is not coincidence; it is a
category.

So the fix took the same shape, not a firmer promise:

- `.claude/hooks/blog-draft-gate.sh` — PreToolUse on `Edit|Write`, blocks any write to
  `*/posts/*.html` unless `docs/blog-drafts/<slug>.md` exists and reads `Status: APPROVED`.
- `/blog-draft` — the loop: full text → **one fenced code block** → **stop and ask** → revise →
  explicit approval → publish.
- `session-stop.sh` — back-stops **both** directions: a published post with no approved draft, and a
  draft parked in `Status: DRAFT` that was never shown. The HIC's two complaints are the same gap
  seen from opposite sides, so both are checked.
- Escalated to **`CLAUDE.md` Non-Negotiable Rule 13** and written into every path that could bypass
  the hook — `GEMINI.md`, `session-start.sh`, `/lsj-publish`, the weekly cron script.

**Why write it in ten places when there is a hook?** Because the hook is the weakest part. It sees
only hand-authored writes, in a session that already loaded it. Generators, cron runs, other agent
surfaces and fresh clones are all outside it. The sentence carrying the weight is therefore not in
the hook at all: **a bypass is not permission.**

The reusable rule is extracted to `kb/wiki/concepts/make-the-compliant-state-the-default.md`.

### 9.1 Two things I got wrong while fixing it

- **I verified the hook by invoking it directly, then "tested" it with a real `Write` — which went
  straight through.** Hooks arm at session start, so a hook committed mid-session protects nothing
  until the next one. Recorded in the hook header and `BLOG_STANDARD.md` §3.3, because "the gate is
  committed" reads as "the gate is working" and is not the same claim.
- **I committed a lint-clean claim that was false.** The changelog entry explaining that a phrase is
  banned quoted that phrase twice, so the file still failed. I had run the linter and read the wrong
  line of its output. The check existed and was correct; I did not look at it. Fixed in a follow-up
  commit that says so, rather than a quiet amend.

Both belong here for the same reason as everything else in this note: discipline fails silently
unless something forces it, and that applies to my own verification too. Running a check is not
reading its result.

### 9.2 A structural error in this very file

While closing, §6.1 was found sitting at the **end** of the document rather than after §6 — an
earlier edit had anchored on text inside the HIC-question section, so the correction table appended
in the wrong place and the reading order was wrong for several commits. Rebuilt and renumbered here.

It is a small thing that makes the same point twice over: an insert anchored on prose, with no check
of where it landed, is the document-level version of every other failure in this note.

## 10. HIC Learning Outcome — the five-step record

| # | Step | State |
| - | ---- | ----- |
| 1 | **Knowledge base** | ✅ `kb/wiki/concepts/make-the-compliant-state-the-default.md` — the rule both failures share |
| 2 | **Field note** | ✅ this file |
| 3 | **`Learn/` HTML** | ✅ rendered via `scripts/gen-doc-html.cjs`. **Recorded twice before as "N/A — no pandoc"; that was wrong.** `render-doc.sh` needs pandoc, but a node renderer was already in the repo. The blocker was mine, not the container's |
| 4 | **Drive export** | ✅ [Google Doc](https://docs.google.com/document/d/1rOpGiqEFb_NxlZSg6DPQTT6FfjsgdVycz75aBIooCJk/edit) — owner `risto.paarni2024@lifetime.fi`. The repo file stays the master (§2E); this is a generated copy, and if the two disagree the repo wins |
| 5 | **HIC question** | ✅ §11 |

### 10.1 Still open, carried forward

- **KEEP_REVIEW (30 code PRs)** — reviewed and classified, not merged; several carry migrations
  without the mandatory Supabase `GRANT`s. Needs build + test per PR on a machine with the toolchain.
- **`gen-thesis-html.cjs` mislabels output versions** (writes v3.83 while sources are at 3.91).
- **Blog posts are absent from `sitemap.xml`** — pre-existing SEO gap, deserves its own change.
- **The AI-content disclosure is absent from `og:`/`twitter:` cards**, so a reshare of a translated
  page shows the headline with no label (Section 2 asks the disclosure to survive resharing).
- **No EU Icon asset** — optional, and ec.europa.eu blocks automated download.
- **FI/SV/DE/FR translations have had no native or legal review.**
- **DE/FR `og:title` vs share-title register mismatch** — one line in `meta.json` plus a rebuild.
- **Lint scoping:** the MGD/CRC anti-metric rule hard-FAILs inside `VERSION AND AGENT HISTORY`
  blocks, so dated changelog lines block CI on any edit to their file. Excluding those blocks is a
  better fix than rewording history each time.

## 11. HIC question (EU AI Act Article 14)

The Article 50 question from §7 is answered and shipped. This is the one left.

> **Two disciplines failed the same way this session — the AI-content label and the blog draft
> review. Both were written down clearly. Both were missing in practice, for months, because
> following them depended on an agent remembering. Both are now defaults enforced by mechanism.**
>
> **The question is how many more there are.** Between the 12 Engineering Discipline Rules and the
> 13 Non-Negotiable Rules, only a handful have a mechanism behind them — secrets, public `.md`, SQL
> safety, branch names, and now blog drafts. The rest, including dual-folder sync, thesis lockstep,
> Supabase `GRANT`s, "no hardcoded prices", and the Learning Outcome itself, depend on the same
> memory that just failed twice in one day.
>
> **Should the next session audit all 25 rules against one question — "what does the tool produce if
> the agent forgets?" — and give a mechanism to the ones that fail silently? Or is that
> over-engineering the harness, and the right move is to fix each one as it actually breaks?**
>
> The audit front-loads work on rules that may never break. Fixing on breakage is cheaper, but it
> means every mechanism arrives *after* a failure the HIC had to notice — which is exactly how both
> of today's were found, and both cost more than the audit would have.

---

_Follows DWS Document Standard and DWS Learning Standard (HIC Learning Outcome, EU AI Act Art. 14)._
