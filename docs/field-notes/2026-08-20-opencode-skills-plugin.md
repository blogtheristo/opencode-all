# Field Note — Skills Registry Now Multiplayer Across OpenCode + Claude Code

Date: 2026-08-20
Branch: `claude/multiplayer-ai-skills-plugin-hkb30u`

## What happened

A shared tweet/article argued teams should package their best AI skills as a version-controlled, installable plugin so everyone gets the same SOPs instead of ten versions floating around Slack. The HIC's instruction: apply this to DWS by making our skill library "understandable to OpenCode."

The gap: `CLAUDE.md`'s Runtime Policy already declares OpenCode the _primary_ interactive runtime (DGX Spark tunnel) and Claude Code the hot standby — but `skills/manifest.json` had no `opencode` surface at all. All 6 tracked surfaces were Claude-only. The 41+ codified slash-command SOPs (`.claude/commands/*.md`) had zero presence in `.opencode/`. So on the runtime the org is supposed to be using first, none of the codified process existed — the exact "single-player AI" failure mode the article describes, just split across runtimes instead of across people.

## What changed

- `skills/manifest.json`: added `opencode-cli` as a 7th tracked surface; marked it `true` on every profile whose commands are plain repo-local slash commands or skill packs (45 of 48 commands, all 15 skill packs, all 3 discipline gates). Left `slash-dgx` (`train-model`, `ollama-spark`) and `slash-admin-antigravity` (`gcr-skill`) as OpenCode-`false` — those exist specifically to reach the DGX tunnel or Google admin scope _from Claude Code_; mirroring them into OpenCode (which already runs against that same tunnel) would be a redundant/confusing double-hop.
- `scripts/skill-manifest-sync.mjs`: added an `--opencode` mode that generates `.opencode/command/*.md` from `.claude/commands/*.md` (frontmatter converted, body untouched), and extended `--check` to fail the build if `.opencode/command/` drifts from the manifest — same enforcement pattern already used for `.claude/commands/` and the Antigravity stubs.
- Generated 47 files under `.opencode/command/` — regenerated only, never hand-edited; source of truth stays `.claude/commands/` + the manifest.
- `docs/DWS_SKILLS_GUIDE.md` §15.1: new "OpenCode CLI support" section explaining the mechanism and the three excluded commands; matrix regenerated with the new column.

## Insight

The Runtime Policy's "shared rule source" pattern (both runtimes load `CLAUDE.md`) needed to extend one level down, to the skill/command layer, or the policy was aspirational rather than real. Generating from a single source (rather than hand-maintaining two directories) is what keeps this from becoming exactly the drift problem the article warns about — one manifest, one generator, one `--check` gate.

## Next steps

- Verify at least one converted command (`review`, `ship`) actually runs correctly inside a live OpenCode session against the DGX tunnel — not yet done in this session (no OpenCode runtime available in this container).
- Consider whether skill packs (`skills/*/SKILL.md`) need an explicit index/registration in `opencode.json` itself, or whether "plain markdown, reachable via `instructions`" is sufficient in practice — currently assumed sufficient but unverified against real OpenCode skill-discovery behavior.
- 8 blog drafts remain parked in `docs/blog-drafts/` awaiting HIC read/approval (Rule 13) — unrelated to this change, flagged separately by the session-stop hook.

N/A for KB/Drive automation in this note — see decision-shaped question below; this is not a skip, both are being actioned this same turn.
