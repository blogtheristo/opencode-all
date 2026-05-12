# .claude/clawdbot/

Backing store for the `clawdbot` session janitor (see `skills/clawdbot/SKILL.md`).
The `proposals/` + `memory/` subdirs are the working set for **Firehorse Dreaming**
— the local, EU-on-prem analog of Anthropic's managed `POST /v1/dreams` primitive.
See `memory/clawdbot-architecture.md` for the convergence table.

## Layout

| Path                         | Tracked?    | Purpose                                                                                         |
| ---------------------------- | ----------- | ----------------------------------------------------------------------------------------------- |
| `queue/<short-id>.md`        | gitignored  | Per-session plan files generated from transcripts. Per-machine.                                 |
| `state.json`                 | gitignored  | Status of each scanned session (pending/dismissed/done + LLM enrichment metadata). Per-machine. |
| `memory/<topic>.md`          | **tracked** | HIL-approved consolidated KB notes from `--dream-curate`. Cross-machine.                        |
| `proposals/curate-<ts>.md`   | **tracked** | Candidate KB / CLAUDE.md edits awaiting HIL approval.                                           |
| `proposals/skill-<name>.md`  | **tracked** | Candidate new skills clustered from queue items.                                                |
| `proposals/archival-<ts>.md` | **tracked** | Candidate skill archivals (`_OLD` per CLAUDE.md, not delete).                                   |

Promote a proposal: copy its content into the target location, commit, then
delete the proposal file.
