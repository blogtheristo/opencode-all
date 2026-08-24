# Next session — start here

Copy the block below into a fresh Claude Code session on `blogtheristo/dws6`.

```
Branch from latest main: git fetch origin main && git checkout -b claude/persona-retire-and-captain-reconcile origin/main

Read these first, in order:
  1. .claude/handoffs/claude/ai-pact-enforcement-transparency-gnnipk.md   (careers + Captain economics)
  2. docs/field-notes/2026-08-01-careers-industrial-authority-rebuild.md  (what shipped 01.08, §6 fail-loud, §7 open question)
  3. docs/field-notes/2026-07-31-article-50-transparency-marking-audit.md (Article 50 audit)

PR #1780 is merged. The careers re-architecture, the reveal motion asset, and the
Deputy-is-not-an-investor-seat corrections are all live. Four things are left.

TASK 1 — Close the Article 50 persona-photo gap. HIGHEST PRIORITY, it has a live
regulatory clock and has survived two sessions.
The dws10.com homepage "Our Team" section shows four AI-generated, unlabeled
portraits (AI_director.jpg, BusinessMentor.jpg, SolutionsArchitect.jpg,
Strategic_advisor.jpg). Article 50 enforcement began 2 Aug 2026, no grace period.
Recommendation on record: RETIRE the section rather than label it — it is being
replaced by real Industry Captains anyway, only Rocky maps to a real workflow
(/plan-ceo-review), and the photos are mismatched to their roles. But ASK THE HIC
FIRST — a calendar event on 4 Aug 09:00 carries the three options. Do not delete a
homepage section unilaterally.
If labelling instead: icons are in Legal/AI LABELS_3x2_*.png, only black variants
exist, and the burn-in workflow is documented in
.claude/handoffs/claude/product-video-production.md.

TASK 2 — Supersede LD-2026-014. Its "Fleet Admiral €200,000" is known-wrong.
Ruling: Admiral €250k + 8 counted Captains × €50k = €650k round; the 9th Captain
seat is dual-use, additive, OUTSIDE the capital count; fill rate is not the point.
Process (docs/LOCKED_DECISIONS.md + the convention LD-2026-014 itself introduced):
Risto approval + legal review of existing SAFEs + a new sequential LD-2026-0NN
entry + set the old entry's Status to "SUPERSEDED by LD-2026-0NN" while leaving its
body text untouched. The doc does not yet formalise that convention in its own
instructions section — worth fixing while you are in there.

TASK 3 — Reconcile the remaining industry-count drift. dws10.com/captain/ and
dws10.com/fleet-admiral/ still advertise "30 industries · 5 Clusters · 30 Captain
Seats". Canon is 25 industries / 16 captain hats / 32 seats
(dws10.com/config/industries.json v2.0, summary.industriesServedTotal 25; approved
phrase "16 captain hats covering 25+ EU industries"; Aegis dual-use tier = 21, never
attribute 25 to Aegis). The Deputy tier was already fixed on those pages; the
industry count was not.

TASK 4 — Roll the reveal motion asset out more widely, if the HIC still wants it.
dws10.com/shared-assets/motion/reveal.js is built, synced to lifetime.fi and
onelifetime.world, and currently wired onto three pages (lifetime.fi/careers,
lifetime.fi/index.html, onelifetime.world/careers). Adding it elsewhere is one
script tag before </body>. VERIFY OVER HTTP, NOT file:// — absolute /shared-assets/
paths silently 404 over file:// and the effect looks broken when it is not.

Standing rules that bit this session:
- Dual Folder Sync is non-negotiable: dws10.com/ -> landing-pages/dws10-com/,
  onelifetime.world/ -> landing-pages/onelifetime-world/, lifetime.fi/ ->
  landing-pages/lifetime-fi/, dws6.com/ -> landing-pages/dws6-com/. Byte-identical,
  same commit. rsync is NOT installed; use cp and verify with diff -rq.
- pandoc and apt-get ffmpeg both fail in this container. Use pip install
  imageio-ffmpeg for video, pip install markdown for Learn/ renders, and
  npm install --no-save playwright with
  executablePath: /opt/pw-browsers/chromium-1194/chrome-linux/chrome for screenshots
  (note the -1194 suffix; the bare /opt/pw-browsers/chromium/ path does not exist).
- A prettier PostToolUse hook reformats HTML on write, so multi-word greps fail
  across wrapped lines. Normalise whitespace before searching.
- Before "fixing" an unbalanced-tag count, diff it against git HEAD. dws10.com/index.html
  (div:1) and dws10.com/captain/index.html (label:5) are pre-existing.
```
