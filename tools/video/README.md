# tools/video — five Gemini clips into one video

Version: 0.1.0 · 12.10.2026 · Claude Code · Status: PENDING_REVIEW

Gemini makes 8-10 s clips. The One Lifetime business video is five such clips (a Nordic man and woman talking) with the lifetime.fi
infographic fading in behind them. These two scripts stitch the clips and add the infographic parts, an end card and the AI-content label.
Source commit in `blogtheristo/dws6`: `eeb7d119` (branch `claude/fervent-mccarthy-f814qn`); the scripts there are the source of truth.

| File                           | Does                                                                                                                     | Needs                                                           |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------- |
| `assemble-video-filmcraft.mjs` | Builds the cut as a FilmCraft project (`<out>.work/video.fcproj`, editable in the FilmCraft app) and exports H.264 MP4   | `node`, `ffmpeg` (crops the infographic parts), `filmcraft-cli` |
| `assemble-video.mjs`           | Same result with plain ffmpeg; also `--last-frame <clip.mp4> --out frame.png` (the first frame for the next Gemini clip) | `node`, `ffmpeg`, `ffprobe`                                     |

## Use

```bash
# clips: <dir>/clip1.mp4 ... clip5.mp4 (each with its own audio)
node tools/video/assemble-video-filmcraft.mjs --clips <dir> \
  --info <infographic-<lang>.jpg> --out <out.mp4> --label "<AI-content label text>" --cli /path/to/filmcraft-cli

node tools/video/assemble-video.mjs --clips <dir> --info <infographic-<lang>.jpg> --out <out.mp4> --label "<text>"
node tools/video/assemble-video.mjs --last-frame <dir>/clip2.mp4 --out frame.png
```

- `--info` is the 696x1024 lifetime.fi infographic of the language of the video (`lifetime.fi/static/infographics/infographic-<lang>.jpg` in dws6);
  the parts are cropped at fixed positions (part 1, part 2, the three boxes of part 3, part 4).
- `--label` is the on-screen AI-content marking (EU AI Act Art. 50). Its text per language is given by the HIC (Translation Rule: agents do not
  translate). Without it the script warns and the video is not publishable.
- Cuts are hard cuts at the half-second of silence each clip starts and ends with.

## filmcraft-cli

`https://github.com/storytold/filmcraft`, MIT OR Apache-2.0, Rust, alpha. Build: `cargo build --release -p filmcraft-cli` (about 6 min on a cloud
container); releases ship `filmcraft-cli` (`.deb`: `/usr/bin/filmcraft-cli`). Commands used: `file.newProject`, `file.newSequence`, `file.import`,
`timeline.place`, `effects.setParam` (opacity keyframes, position), `graphics.newRectangle`, `graphics.newText`, `graphics.set`, then
`export --format h264`. Pin a release tag.

## Tested

On synthetic placeholder clips (5 clips of 8-12 s, 1920x1080, 24 fps): output 50 s, panels fade in 0.8 s and out 0.6 s at the planned times, end card and
label present. Not yet run on real Gemini clips; check faces, voices and the cut points on the first real clips.
