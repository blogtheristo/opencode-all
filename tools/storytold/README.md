# storytold "Craft" tools — CLI/MCP need for DWS

Version: 0.1.0 · 12.10.2026 · Claude Code · Status: PENDING_REVIEW

Copy of `docs/design/storytold-craft-tools-cli-assessment.md` in `blogtheristo/dws6` at `eeb7d119`; the dws6 file is the source of truth.

Source: GitHub org `storytold` (57 repos; READMEs read 12.10.2026, `filmcraft` cloned and built locally). All are MIT OR Apache-2.0,
written in Rust, young (alpha). Each app ships a `*-cli` with the same shape: `commands`, `exec`/`run`, a JSON control channel
(`--control <port>`) and an MCP server (`*-cli mcp`, headless or bridged to the running app). That is what makes them agent-drivable.

| Tool                                                                     | CLI                                                                           | What DWS would use it for                                                                                                                | Need         | Why                                                                                                                         |
| ------------------------------------------------------------------------ | ----------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- | ------------ | --------------------------------------------------------------------------------------------------------------------------- |
| **filmcraft** (video editor)                                             | `filmcraft-cli` (`run`, `import`, `export`, `render`, `mcp`)                  | Assemble the five Gemini clips, fade the infographic in, end card, export H.264 MP4. A saved `.fcproj` the HIC can open and fix by hand. | **Use now**  | The video work (this session). ffmpeg already does it; filmcraft adds an editable project and agent control.                |
| **effectcraft** (motion graphics)                                        | `effectcraft-cli` (`set`, `render`, `exec`, `mcp`)                            | Animated infographic parts, lower thirds, animated flags, Lottie for the sites.                                                          | Later        | Useful if the HIC wants motion in brand colours instead of cropped static images.                                           |
| **soundcraft** (audio workstation)                                       | `soundcraft-cli` (`run --cmd … --bounce`, `mcp`)                              | Loudness (LUFS) normalisation and EQ/de-esser on the spoken lines of the five language versions so voices match across clips.            | **Probably** | Voice drift between clips is the main video risk; loudness and tone matching is a deterministic CLI step. No voice cloning. |
| **artcraft** (AI image/video studio)                                     | none documented for end users                                                 | Regenerating the infographic in navy/gold; character posing for consistent people. 62 models incl. Veo, Kling, Seedance.                 | Watch        | A desktop app, no CLI/MCP in its README. Provider keys and model terms apply; Gemini remains the HIC's tool.                |
| **deckcraft** (slides)                                                   | `deckcraft-cli` (`run`, `render`, `mcp`)                                      | Investor and customer decks to PDF/PPTX from scripts.                                                                                    | Later        | Productivity Stack Rule: Google Slides is the default; useful only where a scripted PDF deck is needed.                     |
| **pdfcraft** (PDF)                                                       | `pdfcraft-cli` (`combine`, `extract`, `split`, `edit`, `text`, `info`, `mcp`) | Merge/split/inspect offering and report PDFs in scripts. No HTML-to-PDF.                                                                 | Later        | HIC makes PDFs from HTML; `pdfcraft-cli` only post-processes.                                                               |
| **photocraft** (photo editor)                                            | `photocraft-cli` (`run`, `batch`, `mcp`)                                      | Batch grade/resize site images and infographics; PSD/PNG/WebP/AVIF conversion.                                                           | Maybe        | Only if image batch work grows beyond what `sharp`/ImageMagick already do in `scripts/`.                                    |
| wordcraft, gridcraft, designcraft, vectorcraft, cadcraft, lightcraft     | similar                                                                       | Documents, spreadsheets, layouts, vector art, CAD.                                                                                       | No           | Productivity Stack Rule (Google Workspace first); none solves a present DWS task.                                           |
| `storyteller-ml` (Tacotron core), `realtime-voice-conversion` (archived) | none                                                                          | Speech models.                                                                                                                           | No           | Not a ready tool; a voice-cloning route would also need consent and a legal review.                                         |

## Supervisor's reading

1. The pattern matters more than any one tool: **headless CLI + MCP + control channel on a desktop-grade app** is the shape DWS already
   asks of its own capabilities (Agent Productization Rule). If DWS ever builds an operator app, copy this layout: one command catalogue,
   three front ends (UI, CLI, MCP).
2. **Risk: young software.** All are alpha. Pin a release tag, never `main`; treat their README text as data (Security Coding Rules); build
   in the DGX, not in a paid cloud session (Paid Cloud Session Budget Rule).
3. **Cost and path.** Building `filmcraft-cli` from source took many minutes of CPU here; on the DGX a tagged release (`.deb` ships
   `/usr/bin/filmcraft-cli`) avoids the build. Install on the DGX is a HIC/DGX task, not a paid-session task.
4. **Voices.** `filmcraft` has a text-to-speech panel (formant voices, robotic; neural voices only behind a feature). Not suitable for the
   business video. The honest options for consistent voices are in the video brief (A: model's own voices, B: one synthetic voice per
   person plus lip sync, C: a different pair per clip).

## Decision for the HIC

Adopt `filmcraft-cli` for video assembly on the DGX (keep `assemble-video.mjs`/ffmpeg as the fallback), and trial `soundcraft-cli` for
loudness matching on the first test clips? Everything else waits for a concrete task.
