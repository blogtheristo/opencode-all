# Field Note — FPE Dark Mode Executive Page

# VERSION AND AGENT HISTORY

---

| Version | Date       | Agent       | Change                                                                                |
| ------- | ---------- | ----------- | ------------------------------------------------------------------------------------- |
| 1.0     | 2026-04-27 | Claude Code | Initial field note for `lifetime.fi/firehorse-production-engine/` dark-mode exec page |
| 1.1     | 2026-04-27 | Claude Code | Construction wedge follow-up: blog post + nav injection + dual-folder sync            |

---

- **Date:** 2026-04-27
- **Branch:** `claude/dark-mode-executive-WCVCu`
- **Author:** Claude Code (Opus 4.7) under Risto's direction
- **Scope:** New public page on `lifetime.fi/` + dual-folder sync to `landing-pages/lifetime-fi/`

## 1. What was asked

Risto asked, in four short turns:

1. "Dark mode. With FPE, leading people means avoiding the weakest-link failure
   and protecting continuity, ownership, compliance, governance, and improvement."
2. "Make it darker for CEO, HR, CFO, CIO" — followed by four signed quotes
   (CEO, HR, CFO, CIO).
3. "Create Firehorse Production Engine Dark Mode Page."
4. "Connect it to current lifetime.fi text. Make it dark."

Read together: a new public page that frames the **Firehorse Production Engine
(FPE)** as a continuity-protection story, written in **executive dark mode**
voice, and stitched into the existing `lifetime.fi/` narrative (Toyota
Production System for EU Carbon Compliance, Brain · Memory · Body · Hands).

## 2. What was built

### 2.1 New page

`lifetime.fi/firehorse-production-engine/index.html` — single-file HTML, no
build step, matches the `lifetime.fi/` design system (gold accent,
`-apple-system` stack, gradient hero, sov-badge tokens) but **deeper**:

| Token               | `lifetime.fi/`          | FPE page (this file)                                     |
| ------------------- | ----------------------- | -------------------------------------------------------- |
| `--bg-primary`      | `#0f172a`               | **`#05070d`** (executive deep)                           |
| `--bg-surface`      | `rgba(30, 41, 59, 0.7)` | **`rgba(13, 17, 28, 0.85)`** + new `--bg-surface-strong` |
| `--border-subtle`   | `rgba(255,255,255,0.1)` | **`rgba(255,255,255,0.06)`** (quieter)                   |
| `--text-secondary`  | `#94a3b8`               | **`#8b95a8`** (lower contrast, still AA on `#05070d`)    |
| Hero gradient       | slate→navy→slate        | **black→deep-navy→black** with masked grid               |
| Body radial accents | gold 8% / blue 4%       | **gold 6% / blue 3%**                                    |

The darker tokens are intentional: this is the page a CEO opens at 22:00 after
two execs resigned. Less glow, more weight.

### 2.2 Page sections

1. **Hero.** "The system should survive the operator." Pulled from the CIO
   quote — strongest single line of the four. Sub-tagline lists the five
   protections (continuity / ownership / compliance / governance / improvement)
   inline, so the FPE thesis is on the screen above the fold.
2. **Five Protections.** 5-up grid card row, numbered 01–05. One-sentence
   definition each, mapped to the CLAUDE.md vocabulary (EU AI Act Article 12,
   KYA, Toyota kaizen).
3. **Executive Briefing — Dark Mode.** 2×2 grid of CEO / HR / CFO / CIO cards.
   Each card has a role tag (`exec-role-tag`), role name, and the verbatim
   quote Risto supplied, italicised and quoted with gold quote glyphs. Cards
   have a left gold border that intensifies on hover — visual reinforcement
   that all four readings pivot off the same engine.
4. **Where FPE Sits.** Connect-back to `lifetime.fi/` copy: reuses the exact
   "creator of the Firehorse Product Line and DWS IQ Product Platform" phrase
   from the consulting section, and re-frames FPE as **Body** in the
   Brain · Memory · Body · Hands architecture. Closes with cross-link chips
   back to `/`, `dws10.com/buy/`, `/dual-use/`, `/fleet-admiral/`, and the
   consultation mailto.
5. **Footer.** Identical structure to `lifetime.fi/` footer for visual
   continuity (Y-tunnus 0772407-9, address, founder line).

### 2.3 Bidirectional link

Added an **FPE** entry to the corp nav on `lifetime.fi/index.html` (between
"World" and "Consulting"). The new page is now a first-class section of the
site, not an orphan.

### 2.4 Dual-folder sync

Per `CLAUDE.md` Dual Folder Structure Rule, both files were copied to
`landing-pages/lifetime-fi/` in the same change set:

```
lifetime.fi/index.html                                    (modified — added FPE nav entry)
lifetime.fi/firehorse-production-engine/index.html        (new)
landing-pages/lifetime-fi/index.html                      (synced)
landing-pages/lifetime-fi/firehorse-production-engine/index.html (synced, byte-identical)
```

Verified with `diff -q` — both pairs are byte-identical.

## 3. Why "dark mode" earned a separate page

Risto used "dark mode" as a tone marker, not just a CSS toggle. The four
executive quotes are darker in voice than typical `lifetime.fi/` marketing
copy — they name failure modes (silent exit, hidden fragility, weakest-link
failure, operator capture) instead of selling outcomes. Putting that tone on
the home page would dilute the "Outcome Company" positioning. A dedicated
page lets the dark-mode briefing exist without softening the hero.

The page is the briefing version. The home page is the pitch version.
Both link to each other. Both keep their voice.

## 4. CHANGES MADE

- `lifetime.fi/firehorse-production-engine/index.html` (new): full single-file
  page — hero, five protections grid, four-quote executive briefing, connect-
  back box, footer. ~600 lines, zero JS, zero external deps.
- `lifetime.fi/index.html` (edit): added `<li><a href="/firehorse-production-engine/">FPE</a></li>`
  to the corp nav.
- `landing-pages/lifetime-fi/index.html` (sync): copied from root.
- `landing-pages/lifetime-fi/firehorse-production-engine/index.html` (sync): copied from root.
- `docs/field-notes/2026-04-27-fpe-dark-mode-executive-page.md` (this file).

## 5. THINGS I DIDN'T TOUCH

- `dws10.com/firehorse-*` product pages — FPE is a brand-level production
  engine concept on `lifetime.fi/`, not a SKU on `dws10.com/`. No changes to
  `products.json`, no Store entry, no Google Merchant feed work. If FPE
  becomes a sellable SKU later, **then** the Store Update Rule kicks in.
- `DWS_BRAND_STANDARD.md` — five-protection vocabulary (continuity, ownership,
  compliance, governance, improvement) is consistent with existing brand
  standard but is not yet promoted into the standard. Worth a follow-up: lift
  the five protections into a brand glossary entry so they stay consistent
  across future copy.
- `DWS_DOCUMENT_STANDARD.md` headers — the new HTML page does not carry a
  VERSION AND AGENT HISTORY block because public-site HTML is exempt from
  Document Standard (per `CLAUDE.md`: ".md files belong in: docs/, Admin/,
  Learn/, repo root"). This field note carries the version block instead.

## 6. POTENTIAL CONCERNS

- **No automated test of the dark-mode contrast ratios.** The new
  `--text-secondary: #8b95a8` on `#05070d` reads at WCAG AA but I did not run
  Lighthouse or axe. Worth a `/browse` pass before public announce.
- **Bidirectional link is one-way for now from `dws10.com`.** The FPE page
  links out to `dws10.com/buy/` and `dws10.com/dual-use/`, but those pages do
  not yet link back. If FPE becomes a campaign anchor, add an inbound link
  from `dws10.com/buy/index.html`'s editorial block.
- **Mobile compare URL.** This work needs a PR on push. Compare URL once
  pushed: `https://github.com/blogtheristo/dws6/compare/main...claude/dark-mode-executive-WCVCu`.

## 7. SKILL OPPORTUNITY

The "executive briefing dark mode" pattern (4-up CEO/HR/CFO/CIO quote grid,
darker tokens, single-page brief) is reusable for other narratives — KYA,
Article 12, sovereignty. Could become **`/exec-brief <topic>`** that scaffolds
this same structure with a topic-specific hero + quotes. **Worth proposing
to Risto as a follow-up if a second executive-tone page is requested.**

## 8. Construction wedge follow-up

Branch: `claude/fpe-blog-field-notes-iAhno` (off `main` after PR #1200 merged
and the previous session's branch was auto-deleted).

- Authored `onelifetime.world/posts/fpe-dark-mode-construction-wedge.html`
  modeled on `redhat-sovereign-move-three-tiers.html` (Tailwind CDN, dark
  gradient, version-chip, callout / callout-gold / tier-card classes).
  Lead block carries Risto's verbatim pricing line; the offer block repeats
  it for canonical reinforcement.
- Four layoff signal cards cite Lehto Group (Helsinki District Court / HS /
  Reuters, March 2024), YIT Oyj and SRV Group (Nasdaq Helsinki releases
  2023–2024), and Statistics Finland (Tilastokeskus Labour Force Survey
  2023–2024). All public sources, no telemetry.
- Cost-model section uses three conservative sliders sourced to SHRM / CAP
  (replacement-cost band 90–200%), Gallup (~50% productivity for six months
  after a 12-week vacancy), Gartner 2024 AI value-capture statistics, and
  EU AI Act Reg. (EU) 2024/1689 Art. 99 — probability-weighted, NOT the
  headline cap. Section explicitly states the model does not claim full €1M
  recovery; it estimates partial-restart cost avoidance plus
  probability-weighted compliance exposure.
- The wedge section names the eight construction domains (BIM, cost
  estimation, schedule, CSRD, CBAM, EN 15978 carbon, site safety,
  procurement); customer picks the five most critical first, the other
  four follow inside the same 30-day pack.
- "Early Learning" cohort framing on the offer block; CFO-direct mailto
  under the €15k procurement threshold preserved verbatim. Mailto target
  is `risto@onelifetime.world` with subject "FPE Continuity Pack —
  Construction Edition".
- Prepended to `latestPosts[]` index 0 in `onelifetime.world/blog/index.html`
  (Text-of-the-Day per `BLOG_STANDARD.md` §3.1) and appended to the tail of
  the `posts` array in `scripts/inject-blog-nav.cjs`. Ran
  `node scripts/inject-blog-nav.cjs` to refresh prev/next nav across all
  root-level posts; the new post itself uses the dark-mode template (no
  footer marker), so the injector skips it — matching how
  `redhat-sovereign-move-three-tiers.html` is treated. The previous post
  (`mcp-apps-identity-spine.html`) now points "next" to the new post.
- Mirrored every change to `landing-pages/onelifetime-world/` (post HTML +
  blog index + the two injector-touched posts). PR not auto-opened — Risto
  opens compare URL manually:
  `https://github.com/blogtheristo/dws6/compare/main...claude/fpe-blog-field-notes-iAhno`.
