#!/usr/bin/env node
// Evidence: Tool=Claude Code Model=claude-sonnet-5-5 Agent=claude Date=2026-10-12
// Audit trail: git log -- scripts/site/make-subtitles.mjs
/**
 * Subtitles for the One Lifetime video: one spoken version (English), subtitles for the other languages (HIC 12.10.2026).
 * The text of every line in every language comes from docs/design/video-prompts/lines.json (page sentences and the sealed
 * translation of the pack; nothing is translated here). Timing comes from the real clips: ffmpeg silencedetect finds the
 * speech stretches of each clip and the lines are placed on them in order.
 *
 *   node scripts/site/make-subtitles.mjs --clips <dir with clip1.mp4..clip5.mp4> --out <dir> \
 *     [--lines docs/design/video-prompts/lines.json] [--langs en,fi,sv,de,fr]
 *
 * Writes <out>/<lang>.srt and <out>/<lang>.vtt (times on the stitched timeline: clips back to back), and timing.json.
 * If a clip's speech stretches do not match its line count they are merged or split by line length and a warning is printed:
 * check those subtitles by eye.
 */
import { execFileSync, spawnSync } from "node:child_process"
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs"
import { join, resolve } from "node:path"

const arg = (k) => {
  const i = process.argv.indexOf(`--${k}`)
  return i > 0 ? process.argv[i + 1] : undefined
}
const fail = (m) => {
  console.error(`FAIL: ${m}`)
  process.exit(1)
}
const clipsDir = arg("clips") ?? fail("--clips <dir> needed")
const outDir = resolve(arg("out") ?? fail("--out <dir> needed"))
const linesFile = arg("lines") ?? join(import.meta.dirname, "../../docs/design/video-prompts/lines.json")
const data = JSON.parse(readFileSync(linesFile, "utf8"))
const langs = (arg("langs") ?? "en,fi,sv,de,fr").split(",")
for (const l of langs) {
  data.lines.forEach((ln, i) => {
    if (!ln.text[l])
      fail(`line ${i} has no ${l} text: run build-video-dialogue.mjs --snapshot <sealed translation> first`)
  })
}
const N = data.clips.length
const clips = Array.from({ length: N }, (_, i) => join(clipsDir, `clip${i + 1}.mp4`))
for (const c of clips) if (!existsSync(c)) fail(`missing ${c}`)

const probe = (f) =>
  parseFloat(
    execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f]).toString(),
  )

// Speech stretches [start, end] in seconds of one clip: the complement of ffmpeg's silencedetect.
function detect(file, dur) {
  const p = spawnSync(
    "ffmpeg",
    ["-hide_banner", "-nostats", "-i", file, "-vn", "-af", "silencedetect=noise=-35dB:d=0.3", "-f", "null", "-"],
    {
      encoding: "utf8",
      maxBuffer: 16 * 1024 * 1024,
    },
  )
  const starts = [...p.stderr.matchAll(/silence_start: ([\d.]+)/g)].map((m) => parseFloat(m[1]))
  const ends = [...p.stderr.matchAll(/silence_end: ([\d.]+)/g)].map((m) => parseFloat(m[1]))
  // speech = complement of the silences
  const segs = []
  let cursor = 0
  starts.forEach((s, i) => {
    if (s - cursor >= 0.25) segs.push([cursor, s])
    cursor = ends[i] ?? dur
  })
  if (dur - cursor >= 0.25) segs.push([cursor, dur])
  return segs
}

function place(segs, texts) {
  // returns [[start, end], ...] one per text, and how it was matched
  if (segs.length === texts.length) return { spans: segs, mode: "matched" }
  if (segs.length === 0) return { spans: null, mode: "no speech found" }
  let s = segs.map((x) => [...x])
  while (s.length > texts.length) {
    // merge the two neighbours with the smallest gap
    let k = 0
    let best = Infinity
    for (let i = 0; i < s.length - 1; i++) {
      const gap = s[i + 1][0] - s[i][1]
      if (gap < best) {
        best = gap
        k = i
      }
    }
    s.splice(k, 2, [s[k][0], s[k + 1][1]])
  }
  if (s.length === texts.length) return { spans: s, mode: `merged ${segs.length} to ${texts.length}` }
  // fewer stretches than lines: split the whole speech span by line length
  const from = segs[0][0]
  const to = segs.at(-1)[1]
  const total = texts.reduce((a, t) => a + t.length, 0)
  let t0 = from
  const spans = texts.map((t) => {
    const len = ((to - from) * t.length) / total
    const sp = [t0, t0 + len]
    t0 += len
    return sp
  })
  return { spans, mode: `split ${segs.length} stretches into ${texts.length} by length` }
}

const wrap = (t, max = 42) => {
  if (t.length <= max) return t
  const words = t.split(" ")
  let best = t
  let bestDiff = Infinity
  for (let i = 1; i < words.length; i++) {
    const a = words.slice(0, i).join(" ")
    const b = words.slice(i).join(" ")
    const d = Math.abs(a.length - b.length)
    if (d < bestDiff) {
      bestDiff = d
      best = `${a}\n${b}`
    }
  }
  return best
}
const stamp = (sec, sep) => {
  const ms = Math.round(sec * 1000)
  const p = (n, w = 2) => String(n).padStart(w, "0")
  return `${p(Math.floor(ms / 3600000))}:${p(Math.floor(ms / 60000) % 60)}:${p(Math.floor(ms / 1000) % 60)}${sep}${p(ms % 1000, 3)}`
}

const durs = clips.map(probe)
const offsets = durs.map((_, i) => durs.slice(0, i).reduce((a, b) => a + b, 0))
const cues = [] // {index, start, end} on the stitched timeline
const report = []
data.clips.forEach((idxs, c) => {
  const segs = detect(clips[c], durs[c])
  const { spans, mode } = place(
    segs,
    idxs.map((i) => data.lines[i].text.en ?? data.lines[i].text.fi),
  )
  report.push({ clip: c + 1, lines: idxs.length, speechStretches: segs.length, mode })
  if (!spans) {
    console.warn(`WARNING clip ${c + 1}: no speech found in the audio; no subtitles for its ${idxs.length} lines`)
    return
  }
  if (mode !== "matched") console.warn(`WARNING clip ${c + 1}: ${mode}; check these subtitles by eye`)
  idxs.forEach((lineIdx, k) => {
    const nextStart = spans[k + 1]?.[0] ?? durs[c]
    const start = Math.max(0, spans[k][0] - 0.05)
    const end = Math.min(
      durs[c],
      Math.max(spans[k][1] + 0.2, start + 1.0),
      nextStart > start + 1.0 ? nextStart - 0.02 : spans[k][1] + 0.2,
    )
    cues.push({ lineIdx, start: offsets[c] + start, end: offsets[c] + Math.max(end, start + 0.8) })
  })
})

mkdirSync(outDir, { recursive: true })
for (const l of langs) {
  const srt = cues
    .map(
      (q, i) => `${i + 1}\n${stamp(q.start, ",")} --> ${stamp(q.end, ",")}\n${wrap(data.lines[q.lineIdx].text[l])}\n`,
    )
    .join("\n")
  const vtt =
    "WEBVTT\n\n" +
    cues
      .map((q) => `${stamp(q.start, ".")} --> ${stamp(q.end, ".")}\n${wrap(data.lines[q.lineIdx].text[l])}\n`)
      .join("\n")
  writeFileSync(join(outDir, `${l}.srt`), srt, "utf8")
  writeFileSync(join(outDir, `${l}.vtt`), vtt, "utf8")
}
writeFileSync(
  join(outDir, "timing.json"),
  JSON.stringify({ clipDurations: durs, report, cues }, null, 2) + "\n",
  "utf8",
)
console.log(`${outDir}: ${langs.map((l) => `${l}.srt/.vtt`).join(", ")}; ${cues.length} cues`)
console.table(report)
