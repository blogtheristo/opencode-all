# KB Inbox

Quick-capture scratchpad. Dump raw notes, links, and ideas here.
The KB agent will process and file them during the next compile.

---

## 2026-08-20 — OpenCode skills-registry multiplayer sync

Skills (`.claude/commands/*.md`, `skills/manifest.json`) are now generated into
`.opencode/command/*.md` so OpenCode — the declared primary interactive
runtime — actually has the codified SOPs, not just Claude Code standby.
Mechanism: `node scripts/skill-manifest-sync.mjs --opencode` generates,
`--check` guards drift. New `opencode-cli` surface added to the manifest.
Full detail: `docs/field-notes/2026-08-20-opencode-skills-plugin.md`.

Open question for next KB compile: should skill packs get an explicit
registration in `opencode.json` itself, or is "plain markdown reachable via
`instructions`" enough? Unverified against live OpenCode skill discovery.
