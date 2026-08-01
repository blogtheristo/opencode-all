# Handoff — claude/product-video-production (new session, branch not yet created)

**Origin:** Split out of `claude/ai-pact-enforcement-transparency-gnnipk` (PR #1780) on 01.08.2026 at HIC request. That session established the video pipeline end-to-end and shipped the first two videos; this session scales it across the product pages.

**Create the branch from latest `main`:** `git fetch origin main && git checkout -b claude/product-video-production origin/main`

---

## The ask

> "think a list of the best pages that video would sharpen sales. 2 video for each product details page -> Social"
> "video max length is 10 seconds in gemini omni"

**Two videos per product page**, each ≤10s, produced in **Gemini Omni**, wired into the product page and repurposed as social assets. Every video is AI-generated and therefore **must be labeled under EU AI Act Article 50** — enforcement started 2 August 2026, no grace period for this category. The labeling workflow below is already proven and must be applied to every asset.

---

## Ranked target pages (researched, not guessed)

Ranking evidence: `dws10.com/config/products.json` (canonical pricing source per CLAUDE.md), the real pricing page `dws10.com/price-list/` (note `pricing/` is a meta-refresh stub redirecting to it), homepage CTA links, page size, and git commit activity as an active-investment proxy.

| #   | Page                                         | Why                                                                                                                                                   |
| --- | -------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | `products/dwsiq.html`                        | Core platform €4,999, `featured: true`, the only non-bundle homepage hero CTA target ("See how DWS IQ 6 works")                                       |
| 2   | `products/aegis.html`                        | Highest price €59,990 + €999/mo; **17 commits vs 1 for nearly every other product page** — by far the most actively iterated                          |
| 3   | `products/situation-room.html`               | Largest product page (86KB / 2,158 lines) = deepest copy to script from; in main nav; €10,093                                                         |
| 4   | `products/edge-node-gn100.html`              | 2nd largest (73KB); in main nav; €5,294; anchors the Control Room hardware tier                                                                       |
| 5   | `products/dgx-spark.html`                    | In main nav + pricing page on-prem list; €6,694; **physical hardware = strongest video ROI, something real to show**                                  |
| 6   | `products/bundle.html`                       | `featured: true` €6,500 with its own full-width homepage pricing card — **but the page is only 88 lines**, so video can carry weight the copy doesn't |
| 7   | `products/sovereignty-cloud-consulting.html` | 3rd largest (66KB); `featured: true`; €1,500/mo recurring                                                                                             |
| 8   | `products/climate-intelligence.html`         | `featured: true`; €2,999/mo recurring SaaS tier                                                                                                       |
| 9   | `products/ai-consulting.html`                | `featured: true` €2,500; ties to the current "Agentic Software Development for EU Teams" positioning                                                  |
| 10  | `products/igx-orin.html`                     | Highest single hardware SKU €11,990; thin page (375 lines), dual-use niche — short explainer                                                          |

Start with **1–5** (highest commercial weight + main-nav visibility), then expand.

**⚠️ Planning caveat:** `dws10.com/testimonials/` has **zero real customer testimonials** — its one "review" is a self-published Grok (xAI) analysis. No `/case-studies/` exists. NCC / T2H / Outokumpu / Kemira are "in discussion, not signed." **Plan every video as founder- or product-demo-led, never testimonial-led,** until a signed case study lands. Do not imply customer endorsement that doesn't exist.

**Suggested 2-video split per page** (HIC hasn't confirmed the split — ask): one **product-demo** (what it does, shown) + one **founder-explainer** (why it matters / the economic argument). For hardware pages (#4, #5, #10) the demo half should show the physical device.

---

## The established visual system — reuse it, don't reinvent

Two videos already shipped on this system (homepage hero + investor page). Keeping later videos consistent is the point.

- **Setting:** modern Nordic industrial-tech interior — glass-walled control room overlooking a server hall, soft blue-white LED rack lighting, out of focus behind subject. Cool, minimal, high-trust.
- **In-scene signage:** a minimalist backlit wall plaque reading **"SOVEREIGN BY DESIGN. GLOBAL BY CHOICE."** — this is the existing brand badge line used on the legal/compliance pages, so it stays consistent site-wide. Small and elegant, never the focal point.
- **Presenter:** man early 40s, Nordic/European, short neat hair, dark charcoal quarter-zip or plain crewneck, no logos. Same person across all videos for continuity.
- **Camera:** static medium shot (chest-up), eye-level, subtle 2–3% push-in, shallow DoF (subject sharp, background soft). Single continuous take, no cuts.
- **Lighting:** cool blue key motivated by the server-room glow + soft warm rim/fill so skin tones stay natural.
- **Style:** photorealistic, corporate-documentary grade, 4K, teal-and-warm-skin cinematic grade. **No baked-in text overlays** beyond the in-scene plaque (the AI label is composited later in post — see below).
- **Output so far:** 1280×720, 24fps, h264 + AAC, ~10.0s, ~2.5MB.

**Decision already taken on the EU flag:** HIC asked about showing it, then said _"or similar text. the actual logo is not mandatory."_ Correct call — these models render flags badly (wrong star count/blue), and the EU emblem has usage rules against implying official endorsement of a private product. **Use the plaque text, not the flag.**

### Prompt template that works

Keep this structure — it produced usable output first try both times:

```
SCENE: [setting + in-scene plaque]
SUBJECT: [presenter description]
ACTION: [framing, gesture, single continuous take]
DIALOGUE (spoken to camera): "[verbatim script, pulled from the page's OWN copy]"
DELIVERY: [tone, which words to emphasise]
CAMERA: [shot, angle, push-in, DoF]
LIGHTING: [key/fill/rim + colour temperature]
STYLE: photorealistic, corporate-documentary, 4K, [grade], no baked-in text overlays
DURATION: 10 seconds max — dialogue must finish with ~1s to spare, no rushed cutoff
ASPECT RATIO: 16:9 (or 9:16 / 1:1 per social placement)
```

**Write the DIALOGUE from the target page's actual live copy**, not invented marketing language — that's how the hero and investor scripts were built (hero used the live "Bounded sovereign compute…" hero text; investor used the live "Software-led, priced like labor, with software margins" positioning). It keeps page and video saying the same thing.

---

## Article 50 labeling — REQUIRED on every asset

Icons live in `Legal/` (added to `main` by HIC): `AI LABELS_3x2_AI_black.png` (General AI Involvement), `AI LABELS_3x2_AI GENERATED_black.png`, `AI LABELS_3x2_AI MODIFIED_black.png`. All 2501×1668 RGBA with transparent background. **Only black, fully-opaque variants exist in the repo** — the official EU set also ships white and 50%-transparent variants; fetch those if a video needs a light-background overlay.

Use **AI GENERATED** for fully AI-generated video. Burn it **into the frames** — not a CSS overlay — because Article 50's placement rule requires the label to survive download and re-share.

```bash
FFMPEG=$(python3 -c "import imageio_ffmpeg; print(imageio_ffmpeg.get_ffmpeg_exe())")

# 1. Burn label bottom-right (280px wide, 24px margin) — proven settings
"$FFMPEG" -y -i SRC.mp4 -i "Legal/AI LABELS_3x2_AI GENERATED_black.png" -filter_complex \
  "[1:v]scale=280:-1[icon];[0:v][icon]overlay=W-w-24:H-h-24:format=auto" \
  -c:v libx264 -crf 18 -preset medium -pix_fmt yuv420p -c:a copy OUT_labeled.mp4

# 2. Poster frame (label already baked in)
"$FFMPEG" -y -ss 1 -i OUT_labeled.mp4 -frames:v 1 -q:v 3 NAME-poster.jpg

# 3. WebM/VP9 fallback
"$FFMPEG" -y -i OUT_labeled.mp4 -c:v libvpx-vp9 -crf 32 -b:v 0 -c:a libopus OUT_labeled.webm
```

**Always visually verify the composite before publishing** — extract a mid-video frame and actually look at it (`Read` the .jpg) to confirm the icon is legible and doesn't cover the subject or the plaque. Both shipped videos were checked this way.

**Container tooling (both fail via apt — 404s on the Ubuntu mirror):**

- ffmpeg/ffprobe → `pip install imageio-ffmpeg` ships a working static ffmpeg 7.0.2
- Pillow → `pip install Pillow` (for checking icon alpha)
- Screenshots → `npm install --no-save playwright`, launch with `executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome'` (note the `-1194` suffix; the bare `/opt/pw-browsers/chromium/` path does **not** exist)
- MP4 duration without ffprobe: parse the `mvhd` box (`timescale` / `duration`) directly in Python

---

## Wiring pattern

Reference implementation: `dws10.com/index.html` ~line 1157 (hero) and `dws10.com/investor-relations/index.html` ~line 1420 (carousel slide).

```html
<video controls poster="/public/videos/NAME-poster.jpg" ...>
  <source src="/public/videos/NAME_labeled.webm" type="video/webm" />
  <source src="/public/videos/NAME_labeled.mp4" type="video/mp4" />
  Your browser does not support the video tag.
</video>
```

- **Asset location:** `dws10.com/public/videos/`
- **Dual Folder Sync (CLAUDE.md, non-negotiable):** every file — HTML _and_ video/poster binaries — must be copied byte-identical to `landing-pages/dws10-com/` **in the same commit**. Verify with `diff -q` before committing; the previous session verified 0 differences across all four site pairs.
- **Naming:** prefer descriptive names (`sovereign-compute-hero-poster.jpg`) over generator hashes. Existing files use the raw Gemini export name + `_labeled` suffix — acceptable, but new work can be cleaner.
- **HTML comment convention:** the previous session annotated each video block with date, why it's there, and that the Article 50 label is burned in — keep that, it's how the next reader knows the label isn't missing.
- Note `dws10.com/index.html` uses 4-space unquoted-attribute style while `investor-relations/index.html` is prettier-formatted; a PostToolUse formatter hook reformats HTML on write. Match whichever file you're in.

---

## Related open items (from the originating session)

- **Four AI-persona photos are unlabeled** (`dws10.com/static/images/{AI_director,BusinessMentor,SolutionsArchitect,Strategic_advisor}.jpg`) — a live Article 50 exposure. **Persona videos were drafted but deliberately NOT generated**: HIC concluded the AI-agent personas are "empty promise" and is retiring them (see the careers-rebuild handoff at `.claude/handoffs/claude/ai-pact-enforcement-transparency-gnnipk.md`). **Do not produce persona videos in this session** unless HIC reverses that.
- Old retired hero video `gemini_generated_video_EA97318F.*` — files kept but unreferenced; orphaned duplicate at `dws10.com/Hero/gemini_generated_video_EA97318F.MP4` flagged for cleanup.
- Should DWS sign the **Code of Practice on Transparency of AI-generated Content**? Undecided. Until then, using the EU icons must not be presented as Code adherence.
- Full context: `docs/field-notes/2026-07-31-article-50-transparency-marking-audit.md`.

---

## Open questions for HIC before producing at scale

1. **Confirm the 2-video split** per page — product-demo + founder-explainer, or a different pairing?
2. **Social aspect ratios** — 16:9 only, or also 9:16 (Reels/Shorts/TikTok) and 1:1? Affects how each is generated, since re-cropping a 16:9 render puts the burned-in bottom-right label at risk of being cropped out. **If vertical is wanted, generate vertical natively and re-composite the label per ratio** rather than cropping a labeled 16:9 master.
3. **Where do social variants live** in the repo — alongside `public/videos/`, or a separate `social/` tree?
4. Same presenter for all 20 videos, or vary by product family (hardware vs. platform vs. consulting)?
