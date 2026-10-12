#!/usr/bin/env node
// Evidence: Tool=Claude Code Model=claude-sonnet-5-5 Agent=claude Date=2026-10-11
// Audit trail: git log -- scripts/site/assemble-video.mjs
/**
 * Stitches the five Gemini clips (8-10 s each) into one video and fades the real infographic parts in behind the speakers.
 * Needs ffmpeg + ffprobe. Nothing is generated or translated here; the infographic is the HIC-approved image.
 *
 *   node scripts/site/assemble-video.mjs --clips <dir with clip1.mp4..clip5.mp4> \
 *     --info lifetime.fi/static/infographics/infographic-fi.jpg --out <out.mp4> --label "<AI-content label text>"
 *   node scripts/site/assemble-video.mjs --last-frame <clipN.mp4> --out <frame.png>   # first frame for clip N+1
 *
 * --label is the on-screen AI-content marking (EU AI Act Art. 50); its text per language comes from the HIC (Translation Rule).
 * Without it the video is built with a loud warning and is not publishable.
 */
import { execFileSync } from "node:child_process"
import { existsSync, mkdtempSync, rmSync } from "node:fs"
import { tmpdir } from "node:os"
import { join, resolve } from "node:path"

const arg = (k) => {
  const i = process.argv.indexOf(`--${k}`)
  return i > 0 ? process.argv[i + 1] : undefined
}
const run = (cmd, args) => execFileSync(cmd, args, { stdio: ["ignore", "pipe", "pipe"] }).toString()
const fail = (msg) => {
  console.error(`FAIL: ${msg}`)
  process.exit(1)
}
const duration = (f) =>
  parseFloat(run("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f]))
const hasAudio = (f) =>
  run("ffprobe", [
    "-v",
    "error",
    "-select_streams",
    "a",
    "-show_entries",
    "stream=index",
    "-of",
    "csv=p=0",
    f,
  ]).trim() !== ""

// Last frame of a clip = first frame (image input) of the next one.
if (arg("last-frame")) {
  const out = arg("out") ?? fail("--out <png> needed")
  run("ffmpeg", ["-y", "-v", "error", "-sseof", "-0.1", "-i", arg("last-frame"), "-update", "1", "-frames:v", "1", out])
  console.log(out)
  process.exit(0)
}

const clipsDir = arg("clips") ?? fail("--clips <dir> needed")
const info = arg("info") ?? fail("--info <infographic.jpg> needed")
const out = arg("out") ?? fail("--out <mp4> needed")
const label = arg("label")
// End-card line under the name (HIC 12.10.2026, FI: "Lisäämme ymmärrystä."); text per language from the HIC (Translation Rule).
const tagline = arg("tagline")
if (!existsSync(info)) fail(`infographic not found: ${info}`)
const N = 5
const clips = Array.from({ length: N }, (_, i) => join(clipsDir, `clip${i + 1}.mp4`))
for (const c of clips) {
  if (!existsSync(c)) fail(`missing ${c}`)
  if (!hasAudio(c)) fail(`${c} has no audio track (the speech is the point of the clip)`)
}
const durs = clips.map(duration)
const starts = durs.map((_, i) => durs.slice(0, i).reduce((a, b) => a + b, 0))
const total = starts[N - 1] + durs[N - 1]

// Panels of the 696x1024 infographic (parts 1-4; part 3 split in its three boxes).
const PANELS = {
  p1: { crop: "696:265:0:45", w: 1000 },
  p2: { crop: "696:194:0:318", w: 1000 },
  p3a: { crop: "200:182:33:510", w: 400 },
  p3b: { crop: "200:182:250:510", w: 400 },
  p3c: { crop: "200:182:466:510", w: 400 },
  p4: { crop: "696:324:0:700", w: 800 },
}
const X3 = { p3a: 320, p3b: 760, p3c: 1200 }
// clip index (1-based), offset in seconds into the clip, shown until the end of clip `until`
// [panel, clip (1-based), offset s, until clip, until offset s (null = end of that clip)]
// Offsets are estimates from the line order and length; adjust after the first real clips.
const CUES = [
  ["p1", 1, 6.0, 2, 4.0],
  ["p2", 2, 4.5, 3, 4.0],
  ["p3a", 3, 4.3, 3, null],
  ["p3b", 3, 6.3, 3, null],
  ["p3c", 3, 8.2, 3, null],
  ["p4", 4, 2.5, 5, 5.0],
]

const tmp = mkdtempSync(join(tmpdir(), "assemble-video-"))
try {
  const png = {}
  for (const [id, p] of Object.entries(PANELS)) {
    png[id] = join(tmp, `${id}.png`)
    run("ffmpeg", ["-y", "-v", "error", "-i", info, "-vf", `crop=${p.crop},scale=${p.w}:-1`, "-frames:v", "1", png[id]])
  }

  // Pass 1: normalise and cut together (hard cuts at the silences the prompts ask for).
  const base = join(tmp, "base.mp4")
  const norm = clips
    .map(
      (_, i) =>
        `[${i}:v]scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2:color=0x0f172a,fps=24,setsar=1,format=yuv420p[v${i}];` +
        `[${i}:a]aresample=48000,aformat=sample_fmts=fltp:channel_layouts=stereo[a${i}]`,
    )
    .join(";")
  const cat = clips.map((_, i) => `[v${i}][a${i}]`).join("") + `concat=n=${N}:v=1:a=1[v][a]`
  run("ffmpeg", [
    "-y",
    "-v",
    "error",
    ...clips.flatMap((c) => ["-i", c]),
    "-filter_complex",
    `${norm};${cat}`,
    "-map",
    "[v]",
    "-map",
    "[a]",
    "-c:v",
    "libx264",
    "-crf",
    "16",
    "-preset",
    "medium",
    "-c:a",
    "aac",
    "-b:a",
    "192k",
    base,
  ])

  // Pass 2: infographic parts fade in/out on top, end card, label.
  const inputs = ["-i", base]
  const chains = []
  let last = "0:v"
  CUES.forEach(([id, clip, off, until, untilOff], k) => {
    const s = starts[clip - 1] + off
    const e = untilOff == null ? starts[until - 1] + durs[until - 1] : starts[until - 1] + untilOff
    inputs.push("-loop", "1", "-t", String(total), "-i", png[id])
    const x = X3[id] ?? "(W-w)/2"
    chains.push(
      `[${k + 1}:v]format=rgba,pad=iw+24:ih+24:12:12:color=0x1e293b,fade=t=in:st=${s.toFixed(2)}:d=0.8:alpha=1,fade=t=out:st=${(e - 0.6).toFixed(2)}:d=0.6:alpha=1[g${k}];` +
        `[${last}][g${k}]overlay=x=${x}:y=60:eof_action=pass[o${k}]`,
    )
    last = `o${k}`
  })
  const font = [
    "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
    "C:/Windows/Fonts/arial.ttf",
    "/System/Library/Fonts/Supplemental/Arial.ttf",
  ].find(existsSync)
  const draws = []
  const endAt = total - 4
  if (font) {
    draws.push(
      `drawtext=fontfile='${font}':text='Lifetime Oy':fontcolor=0xd4a843:fontsize=64:x=(w-text_w)/2:y=(h-text_h)/2:enable='gte(t,${endAt.toFixed(2)})':alpha='min(1,(t-${endAt.toFixed(2)})/1)'`,
    )
    if (tagline)
      draws.push(
        `drawtext=fontfile='${font}':text='${tagline.replace(/[\\':]/g, "\\$&")}':fontcolor=0xe2e8f0:fontsize=34:x=(w-text_w)/2:y=(h/2)+50:enable='gte(t,${(endAt + 1.2).toFixed(2)})':alpha='min(1,(t-${(endAt + 1.2).toFixed(2)})/1)'`,
      )
    if (label)
      draws.push(
        `drawtext=fontfile='${font}':text='${label.replace(/[\\':]/g, "\\$&")}':fontcolor=0xe2e8f0:fontsize=22:x=w-text_w-24:y=h-text_h-20:box=1:boxcolor=0x0f172a@0.6:boxborderw=8`,
      )
  }
  const tail = [`fade=t=out:st=${(total - 1.2).toFixed(2)}:d=1.2:color=0x0f172a`, ...draws]
  // end card: darken the last 4 s, then the name; drawbox ramps with the same enable window
  chains.push(
    `[${last}]drawbox=x=0:y=0:w=iw:h=ih:color=0x0f172a@0.92:t=fill:enable='gte(t,${endAt.toFixed(2)})',${tail.join(",")}[vout]`,
  )
  run("ffmpeg", [
    "-y",
    "-v",
    "error",
    ...inputs,
    "-filter_complex",
    chains.join(";"),
    "-map",
    "[vout]",
    "-map",
    "0:a",
    "-c:v",
    "libx264",
    "-crf",
    "17",
    "-preset",
    "medium",
    "-c:a",
    "copy",
    "-movflags",
    "+faststart",
    resolve(out),
  ])
} finally {
  rmSync(tmp, { recursive: true, force: true })
}
console.log(`${out}  ${total.toFixed(1)} s from ${N} clips (${durs.map((d) => d.toFixed(1)).join(" + ")})`)
if (!label)
  console.warn("WARNING: no --label: the video has no AI-content marking (EU AI Act Art. 50); do not publish it.")
if (total < 40 || total > 55) console.warn(`WARNING: total ${total.toFixed(1)} s is outside the planned 40-55 s.`)
