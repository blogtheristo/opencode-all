# Training Log: Secret Egress Discipline (Topic 1/6)

---

# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:

- Version: 1.0 | Tool: Claude Code | Session: (mobile-dashboard-scope) | Date: 04.07.2026 | Changes: Initial creation — first logged cycle of the internal security training program (docs/SECURITY_TRAINING_PROGRAM_SKELETON.md), Topic 1.

Document Status:

- Created: 04.07.2026
- Last Modified: 04.07.2026
- Language: English
- Publication Status: ACTIVE

---

## Program reference

- Program: `docs/SECURITY_TRAINING_PROGRAM_SKELETON.md`, Topic 1 — "Secret egress discipline"
- Participant: Risto Paarni (operator, per the program's single-operator audience note)
- Logged by: Claude Code, at the operator's direction, as part of executing this training cycle
- Format: self-paced reading + one-paragraph written reflection, per the skeleton's "Format" section

**Authorship note (read before counting this toward compliance):** the reading summary below is factual and agent-compiled. The reflection paragraph was drafted by the agent on the operator's behalf, using the concrete incident the skeleton itself names as the teaching example. Per Rule 12 ("fail loud"), this is disclosed rather than presented as the operator's own unprompted words — if the operator wants the logged reflection to be personally authored, amend this file directly; until amended, this entry stands as an agent-drafted-and-operator-reviewed cycle, not a self-written one.

## Reading

- `CLAUDE.md` → "Secret Egress Rules (read AND write sides)": the read-side deny rules (no `cat`/`grep`/`base64` of `.env*`, `*.pem`, `*.key`, `id_rsa`, `*secret*` files; no bare `env`/`printenv`) only cover half the threat. The write side is enforced separately: if a secret value ever surfaces in command output, it must not be persisted anywhere — not into files, commits, PR/issue/review bodies, MCP tool arguments, logs, or docs. Reference secrets via env var names instead of their values.
- Enforcement layer: `.claude/hooks/pretooluse-guard.sh`, `.claude/hooks/secret-scan.sh`, `.claude/hooks/secret-output-scan.sh` (per `.claude/hooks/README.md`). `settings.json` `deny` rules alone are not the real control — they can be bypassed (e.g. a subcommand-parser cap) — the hooks are.
- Secret _shapes_ the rule cares about are broader than provider-prefixed API keys: DSNs with embedded credentials (`postgres://user:pass@…`), bare JWTs, `Bearer` tokens, DB passwords, GPG passphrases, and OAuth client secrets all count.

## Concrete incident used (per skeleton's Topic 1 pointer)

On 2026-07-03, within a Claude Code session on this repo, an attempt to post `secret-scan.sh` scanner output onto a GitHub issue was blocked by the permission-gate hook. The scanner's own output — produced for a local, single-operator shell context — was about to be written into a GitHub issue, a destination with a fundamentally different (broader, shared, indexable) read audience than the terminal it came from. The hook didn't care that the _content_ looked like a scan report rather than a raw secret; it caught the destination-widening move itself.

## Reflection (what would be done differently)

The near-miss shows the rule earns its keep exactly when the egress _doesn't look like_ a secret leak on its face — a scanner's report about secrets is not itself sensitive, but the act of relaying anything captured from a privileged local context into a shared, persistent, third-party-readable surface (a GitHub issue, in this case) is the actual risk boundary, not the string content. Going forward, before pasting any command output into a PR/issue/comment body, the reflex should be "what surface is this landing on, and does its audience match the context this output was captured in" — not just "does this contain a recognizable secret pattern." That reframes the rule from a content filter to a destination check, which is the harder habit to build and the one this incident actually tested.

## Compliance note

This logs one of six required topics. Per `docs/SECURITY_TRAINING_PROGRAM_SKELETON.md` → "Completion tracking," `DWS_SECURITY_STANDARD.md`'s NIS2 Art.21(2)(g) row stays **Partial** until all six topics have at least one logged cycle — this entry alone does not justify moving it to Active. No change was made to `DWS_SECURITY_STANDARD.md` as part of this entry.
