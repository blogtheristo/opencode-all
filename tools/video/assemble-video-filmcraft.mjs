#!/usr/bin/env node
// Evidence: Tool=Claude Code Model=claude-sonnet-5-5 Agent=claude Date=2026-10-12
// Audit trail: git log -- scripts/site/assemble-video-filmcraft.mjs
/**
 * Same job as assemble-video.mjs (five Gemini clips -> one video, infographic parts fading in behind the speakers,
 * end card, AI-content label) but built as a FilmCraft project (https://github.com/storytold/filmcraft, MIT OR Apache-2.0)
 * driven through `filmcraft-cli`. The result is an editable `<out>.fcproj` the HIC can open in the FilmCraft app and fix by hand,
 * plus the exported H.264 MP4. ffmpeg is used only to crop the infographic parts into PNGs.
 *
 *   node scripts/site/assemble-video-filmcraft.mjs --clips <dir with clip1.mp4..clip5.mp4> \
 *     --info lifetime.fi/static/infographics/infographic-fi.jpg --out <out.mp4> --label "<AI-content label text>" [--tagline "<end-card line>"] [--subtitles <lang>.srt] [--cli <filmcraft-cli>]
 *
 * filmcraft-cli: a tagged release (.deb ships /usr/bin/filmcraft-cli) or `cargo build --release -p filmcraft-cli` (about 6 min).
 * --label is the on-screen AI-content marking (EU AI Act Art. 50); its text per language comes from the HIC (Translation Rule).
 */
import { execFileSync } from "node:child_process"
import { existsSync, mkdirSync, writeFileSync, rmSync } from "node:fs"
import { basename, dirname, join, resolve } from "node:path"

const arg = (k) => {
  const i = process.argv.indexOf(`--${k}`)
  return i > 0 ? process.argv[i + 1] : undefined
}
const fail = (msg) => {
  console.error(`FAIL: ${msg}`)
  process.exit(1)
}
const cli = arg("cli") ?? process.env.FILMCRAFT_CLI ?? "filmcraft-cli"
const clipsDir = arg("clips") ?? fail("--clips <dir> needed")
const info = arg("info") ?? fail("--info <infographic.jpg> needed")
const outArg = arg("out") ?? fail("--out <mp4> needed")
const label = arg("label")
// End-card line under the name (HIC 12.10.2026, FI: "Lisäämme ymmärrystä."); text per language from the HIC (Translation Rule).
const tagline = arg("tagline")
// Burned-in subtitles (an .srt from make-subtitles.mjs): one spoken version, subtitles for the other languages (HIC 12.10.2026).
const subtitles = arg("subtitles")
if (!existsSync(info)) fail(`infographic not found: ${info}`)

const out = resolve(outArg)
const work = out.replace(/\.mp4$/i, "") + ".work"
const project = join(work, "video.fcproj")
mkdirSync(work, { recursive: true })
rmSync(project, { force: true })

const TICKS = 254016000000 // per second, exact for 24 fps
const N = 5
const FPS = 24
const clips = Array.from({ length: N }, (_, i) => resolve(join(clipsDir, `clip${i + 1}.mp4`)))
for (const c of clips) if (!existsSync(c)) fail(`missing ${c}`)

const run = (bin, args) => {
  try {
    return execFileSync(bin, args, {
      stdio: ["ignore", "pipe", "pipe"],
      maxBuffer: 64 * 1024 * 1024,
    }).toString()
  } catch (e) {
    fail(
      `${bin} ${args.slice(0, 3).join(" ")} ...: ${(String(e.stderr ?? "") + String(e.stdout ?? "") || e.message).slice(0, 900)}`,
    )
  }
}
const fc = (args) => run(cli, args)
const jsonl = (name, lines) => {
  const p = join(work, name)
  writeFileSync(p, lines.map((l) => JSON.stringify(l)).join("\n") + "\n")
  return p
}
const runScript = (name, lines, extra = []) =>
  fc([...extra, "run", jsonl(name, lines), "--compact"])
    .trim()
    .split("\n")
    .map((l) => JSON.parse(l))
    .map((r) => (r.ok ? r : fail(`${r.id} (line ${r.line}) failed: ${JSON.stringify(r.error ?? r)}`)))

// Panels of the 696x1024 infographic (parts 1-4; part 3 split in its three boxes), scaled and framed (12 px, #1e293b).
const PANELS = {
  p1: { crop: "696:265:0:45", w: 1000, h: 381 },
  p2: { crop: "696:194:0:318", w: 1000, h: 279 },
  p3a: { crop: "200:182:33:510", w: 400, h: 364, x: 520 },
  p3b: { crop: "200:182:250:510", w: 400, h: 364, x: 960 },
  p3c: { crop: "200:182:466:510", w: 400, h: 364, x: 1400 },
  p4: { crop: "696:324:0:700", w: 800, h: 372 },
}
for (const [id, p] of Object.entries(PANELS)) {
  p.png = join(work, `${id}.png`)
  run("ffmpeg", [
    "-y",
    "-v",
    "error",
    "-i",
    info,
    "-vf",
    `crop=${p.crop},scale=${p.w}:-2,pad=iw+24:ih+24:12:12:color=0x1e293b`,
    "-frames:v",
    "1",
    p.png,
  ])
}
const panelIds = Object.keys(PANELS)

// 1) project, sequence (video tracks: V1 clips, V2-V4 panels, V6-V9 end card, name, tagline, label), import.
const imp = runScript(
  "1-import.jsonl",
  [
    { id: "file.newProject", params: { name: "One Lifetime video" } },
    {
      id: "file.newSequence",
      params: { name: "Main", width: 1920, height: 1080, fps: FPS, video: 9, audio: 2 },
    },
    { id: "file.import", params: { paths: [...clips, ...panelIds.map((k) => PANELS[k].png)] } },
  ],
  ["--save-as", project],
)
const items = imp[2].result.items
if (items.length !== N + panelIds.length)
  fail(
    `import returned ${items.length} items, expected ${N + panelIds.length}: ${JSON.stringify(imp[2].result.errors)}`,
  )
const clipItems = items.slice(0, N)
panelIds.forEach((k, i) => (PANELS[k].item = items[N + i]))
const dur = {}
const tree = JSON.parse(fc(["--project", project, "inspect", "project", "--compact"]))
for (const it of tree.root.children) dur[it.item] = it.duration
const clipDur = clipItems.map((i) => dur[i])
const starts = clipDur.map((_, i) => clipDur.slice(0, i).reduce((a, b) => a + b, 0))
const total = starts[N - 1] + clipDur[N - 1]
const frame = (t) => Math.round(t / (TICKS / FPS)) * (TICKS / FPS) // snap to a frame

// 2) cues: [panel, clip (1-based), offset s, until end of clip, track]
// [panel, clip (1-based), offset s, until clip, until offset s (null = end of that clip), track]
// Offsets are estimates from the line order and length; adjust after the first real clips (or move the clips in the .fcproj by hand).
const CUES = [
  ["p1", 1, 6.0, 2, 4.0, "V2"], // "Tekoäly oppii koko ajan" until the end of "Mutta vain ihminen ymmärtää"
  ["p2", 2, 4.5, 3, 4.0, "V2"], // "Miten tämä toimii" until the end of "jäljitettävissä vielä vuosien päästä"
  ["p3a", 3, 4.3, 3, null, "V2"],
  ["p3b", 3, 6.3, 3, null, "V3"],
  ["p3c", 3, 8.2, 3, null, "V4"],
  ["p4", 4, 2.5, 5, 5.0, "V2"],
]
const place = [{ id: "timeline.place", params: { items: clipItems, track: "V1", time: 0 } }]
const span = []
for (const [id, clip, off, until, untilOff, track] of CUES) {
  const s = frame(starts[clip - 1] + off * TICKS)
  const e = untilOff == null ? starts[until - 1] + clipDur[until - 1] : frame(starts[until - 1] + untilOff * TICKS)
  span.push({ id, s, e })
  place.push({
    id: "timeline.place",
    params: { item: PANELS[id].item, track, time: s, duration: e - s, video: true, audio: false },
  })
}
// The end card (4 s) is appended after the last clip; it never covers speech.
const endAt = frame(total)
place.push({
  id: "graphics.newRectangle",
  params: { position: [960, 540], size: [1920, 1080], seconds: 4, track: 5, time: endAt },
})
place.push({
  id: "graphics.newText",
  params: {
    text: "Lifetime Oy",
    position: [960, 575],
    size: 64,
    seconds: 4,
    track: 6,
    time: endAt,
  },
})
if (tagline)
  place.push({
    id: "graphics.newText",
    params: {
      text: tagline,
      position: [960, 650],
      size: 34,
      seconds: 4,
      track: 7,
      time: endAt,
    },
  })
if (label)
  place.push({
    id: "graphics.newText",
    params: {
      text: label,
      position: [1500, 1050],
      size: 22,
      seconds: total / TICKS + 4,
      track: 8,
      time: 0,
    },
  })
const placed = runScript("2-place.jsonl", place, ["--project", project, "--save"])
const panelClip = {}
span.forEach((c, k) => (panelClip[c.id] = placed[1 + k].result.clips[0]))
const rectClip = placed[1 + span.length].result.clips?.[0] ?? placed[1 + span.length].result.clip
const nameClip = placed[2 + span.length].result.clips?.[0] ?? placed[2 + span.length].result.clip
const clipOf = (r) => r.result.clips?.[0] ?? r.result.clip
const taglineClip = tagline ? clipOf(placed[3 + span.length]) : null
const labelClip = label ? clipOf(placed[3 + span.length + (tagline ? 1 : 0)]) : null

// 3) fades (opacity keyframes: 0 -> 100 over 0.8 s, 100 -> 0 over 0.6 s), positions, end card look.
const kf = (clip, t, v) => ({
  id: "effects.setParam",
  params: { clip, effect: "opacity", param: "opacity", value: v, time: t, keyframe: true },
})
const style = []
for (const c of span) {
  const clip = panelClip[c.id]
  const p = PANELS[c.id]
  style.push(kf(clip, c.s, 0), kf(clip, c.s + 0.8 * TICKS, 100), kf(clip, c.e - 0.6 * TICKS, 100), kf(clip, c.e - 1, 0))
  style.push({
    id: "effects.setParam",
    params: { clip, effect: "motion", param: "position", value: [p.x ?? 960, 72 + (p.h + 24) / 2] },
  })
}
style.push({ id: "graphics.set", params: { clip: rectClip, props: { fill_color: "#0f172a" } } })
style.push(kf(rectClip, endAt, 0), kf(rectClip, endAt + 1 * TICKS, 92))
style.push({
  id: "graphics.set",
  params: {
    clip: nameClip,
    props: { font: "Inter", font_style: "Bold", size: 64, align: "center", fill_color: "#d4a843" },
  },
})
style.push(kf(nameClip, endAt, 0), kf(nameClip, endAt + 1 * TICKS, 100))
if (taglineClip) {
  style.push({
    id: "graphics.set",
    params: {
      clip: taglineClip,
      props: { font: "Inter", size: 34, align: "center", fill_color: "#e2e8f0" },
    },
  })
  style.push(
    kf(taglineClip, endAt, 0),
    kf(taglineClip, endAt + 1.2 * TICKS, 0),
    kf(taglineClip, endAt + 2.2 * TICKS, 100),
  )
}
if (labelClip)
  style.push({
    id: "graphics.set",
    params: {
      clip: labelClip,
      props: { font: "Inter", size: 22, align: "right", fill_color: "#e2e8f0", background: true },
    },
  })
runScript("3-style.jsonl", style, ["--project", project, "--save"])

// 4) export
const rawOut = subtitles ? out.replace(/\.mp4$/i, "") + ".nosubs.mp4" : out
fc(["--project", project, "export", rawOut, "--format", "h264"])
if (subtitles) {
  // FilmCraft's own caption tracks could carry these; a burned-in pass keeps one file per language that plays anywhere.
  const sp = resolve(subtitles).replace(/[\\':,]/g, "\\$&")
  const style =
    "FontName=DejaVu Sans,FontSize=20,PrimaryColour=&H00FFFFFF,OutlineColour=&H00281A0F,BorderStyle=3,Outline=1,Shadow=0,MarginV=70"
  run("ffmpeg", [
    "-y",
    "-v",
    "error",
    "-i",
    rawOut,
    "-vf",
    `subtitles='${sp}':force_style='${style}'`,
    "-c:a",
    "copy",
    out,
  ])
}
console.log(
  `${out}  ${(total / TICKS + 4).toFixed(1)} s (${(total / TICKS).toFixed(1)} s of clips + 4 s end card) from ${N} clips; editable project: ${project}`,
)
if (!label)
  console.warn("WARNING: no --label: the video has no AI-content marking (EU AI Act Art. 50); do not publish it.")
if (total / TICKS < 40 || total / TICKS > 55)
  console.warn(`WARNING: total ${(total / TICKS).toFixed(1)} s is outside the planned 40-55 s.`)
void basename
void dirname
