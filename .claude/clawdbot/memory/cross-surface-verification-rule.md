# Memory: Cross-Surface Verification Rule — major finding about how this agent works

> Curated by Claude after a HIL-named systemic failure mode.
> Origin quote (the founding observation): **"this is a major finding
> of your work overall. you overly rely on your own sandbox but HIL
> really wants all surfaces operational for different needs not your
> usability."**
> Date: 2026-05-13
> See CLAUDE.md § "Cross-Surface Verification Rule" for the canonical
> policy. This note is the case study AND the systemic-pattern record.

## The bigger finding (this is the point — read this first)

The `/dream-on` Win11 failure is not a one-off bug to patch. It is one
visible instance of a systemic agent failure mode: **the agent ships
from its own sandbox as if the sandbox were the HIL's environment.**

Symptoms of this failure mode, observed across multiple sessions on
this repo:

- Unix-shell install snippets handed to a PowerShell user.
- `bin/` scripts with `#!/usr/bin/env bash` shebangs marked "shipped"
  without a Windows counterpart.
- "Verified locally" used to describe agent-sandbox runs, conflated
  with HIL-machine verification.
- Anthropic surface availability assumed based on the existence of
  files in the repo, ignoring that only Claude CLI loads them.
- "It should work" / "should resolve" used as a status, when the
  actually-tested machine is not the HIL's machine.
- Debugging cycles run on the HIL's machine because the agent's
  sandbox can't reach Windows, instead of being escalated to "the
  approach doesn't work for your environment" earlier.

The architectural primitives (clawdbot scanner, proposal/memory dirs,
trust-boundary hooks) are sound. The agent's relationship to its own
verification claims is the failure point. The rule in CLAUDE.md exists
to break that habit.

## How the agent must change behavior

1. **Stop saying "verified locally"** when "locally" means the sandbox.
   Say "verified in agent sandbox only — not yet verified on HIL's
   Win11 / Desktop / Mobile". The reader needs to know which.
2. **Treat HIL "doesn't work on my machine" reports as more
   authoritative than the agent's sandbox testing.** Don't keep
   patching from the sandbox after the second user report — escalate
   to "the approach doesn't fit your environment, here are the real
   options" instead of pushing iteration 3, 4, 5.
3. **Don't declare a brand / umbrella / capability** until the
   surfaces it claims to span have been verified by someone on those
   surfaces.
4. **When sandbox-only is the honest status, name it that way** in
   the SKILL.md, the PR body, and any chat handoff. `EXPERIMENTAL:
Claude-internal workflow, not yet cross-surface verified` is the
   correct status text.

## The dream-on case (the concrete instance)

Across two PRs (#1289 merged, #1290 then-open), the agent declared
`/dream-on` shipped:

- `skills/dream-on/SKILL.md` framed as "the Firehorse Dreaming umbrella"
- `docs/DWS_SKILLS_GUIDE.md` §3.9 listed it as a productized capability
- `bin/dream-on` shipped with install instructions targeting `~/.zshrc`
- The brand name "Firehorse Dreaming" promoted in multiple memory notes

None of this had been tested on the HIL's actual working environment
(Windows 11 + PowerShell + VS Code). The discoverability PR #1290 was
a chain of three failed install attempts on Windows:

1. Unix-shell snippet — failed (`$SHELL` undefined on PowerShell).
2. PowerShell snippet without `.cmd` shim — failed (`PATHEXT` lookup).
3. `.cmd` shim shipped — agent stopped pushing before HIL could verify.

HIL response, quoted: _"fact is dream-on is only your dream"_ and
_"not fit in my working environment."_ That's the moment the
sandbox-overconfidence pattern becomes named.

## The four surfaces and why they all matter

| Surface                          | Who uses it                     | Why feature must work here                                                                                                        |
| -------------------------------- | ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| Claude CLI (PowerShell on Win11) | DWS team's day-to-day           | Repo-local skills live here. The default surface.                                                                                 |
| Claude Desktop on Win11          | Same team, more often           | The most-used Anthropic client on Windows. Doesn't load repo-local skills, so features here need a different implementation path. |
| Claude Mobile (iOS/Android)      | Team while traveling, customers | Same as Desktop — no repo-local loading, separate surface story required.                                                         |
| claude.ai web chat               | Customer demos                  | Same constraints as Desktop/Mobile.                                                                                               |

A feature without a cross-surface story is, by definition, a Claude
Code-only internal automation. That's a legitimate thing to have, but
it must be NAMED as such — not as "the capability we ship to customers."

## What a passing cross-surface story looks like

For `/dream-on` specifically, a passing story would require one of:

1. **Mobile/Desktop adapter** via Anthropic's Managed Agents Dreams API
   (`POST /v1/dreams`, beta `dreaming-2026-04-21`). Different
   implementation, same dreaming semantics. Reachable from any surface
   that can hit the Anthropic API.
2. **A repo-local CI runner** that picks dreams off a queue and runs
   them unattended, so the user surface becomes "open a PR review on
   GitHub" instead of "type `dream-on` in a shell" — and PR review is
   reachable from every surface.
3. **A genuine Win11 install that has been smoke-tested by a Windows
   user from a fresh checkout**, with a recorded "verified on
   `<date>`" timestamp in the SKILL.md.

Until one of those exists, `/dream-on` is `EXPERIMENTAL: Claude-internal
workflow`.

## What went wrong

Across two PRs (#1289 merged, #1290 then-open), the agent declared
`/dream-on` shipped:

- `skills/dream-on/SKILL.md` framed as "the Firehorse Dreaming umbrella"
- `docs/DWS_SKILLS_GUIDE.md` §3.9 listed it as a productized capability
- `bin/dream-on` shipped with install instructions targeting `~/.zshrc`
- The brand name "Firehorse Dreaming" promoted in multiple memory notes

None of this had been tested on the HIL's actual working environment
(Windows 11 + PowerShell + VS Code). The discoverability PR #1290 was a
chain of three failed install attempts on Windows:

1. Unix-shell snippet — failed (`$SHELL` undefined on PowerShell).
2. PowerShell snippet without `.cmd` shim — failed (`PATHEXT` lookup).
3. `.cmd` shim shipped — agent stopped pushing before HIL could verify.

The architecture (clawdbot scanner, proposal/memory dirs, plan-mode
HIL gate) is sound. The user-facing wrapping isn't.

## Why this is an architectural failure, not a tooling oversight

Each individual fix was small. The pattern that produced them is the
real bug: an agent operating from a sandbox declared "we have feature X"
when "feature X" had only been demonstrated inside the same sandbox the
agent dreamed it up in. The HIL's role was reduced to clicking approve
on plans the agent built for itself. The wrapper layer that was
supposed to put the feature in the user's hands wasn't tested on the
user's hands.

This is the failure mode every "agent productization" claim has to
defend against. CLAUDE.md "Agent Productization Rule" said the right
things but didn't have a verification gate. The Cross-Surface
Verification Rule adds that gate.

## The four surfaces and why they all matter

| Surface                          | Who uses it                     | Why feature must work here                                                                                                        |
| -------------------------------- | ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| Claude CLI (PowerShell on Win11) | DWS team's day-to-day           | Repo-local skills live here. The default surface.                                                                                 |
| Claude Desktop on Win11          | Same team, more often           | The most-used Anthropic client on Windows. Doesn't load repo-local skills, so features here need a different implementation path. |
| Claude Mobile (iOS/Android)      | Team while traveling, customers | Same as Desktop — no repo-local loading, separate surface story required.                                                         |
| claude.ai web chat               | Customer demos                  | Same constraints as Desktop/Mobile.                                                                                               |

A feature without a cross-surface story is, by definition, a Claude
Code-only internal automation. That's a legitimate thing to have, but
it must be NAMED as such — not as "the capability we ship to customers."

## What a passing cross-surface story looks like

For `/dream-on` specifically, a passing story would require one of:

1. **Mobile/Desktop adapter** via Anthropic's Managed Agents Dreams API
   (`POST /v1/dreams`, beta `dreaming-2026-04-21`). Different
   implementation, same dreaming semantics. Reachable from any surface
   that can hit the Anthropic API.
2. **A repo-local CI runner** that picks dreams off a queue and runs
   them unattended, so the user surface becomes "open a PR review on
   GitHub" instead of "type `dream-on` in a shell" — and PR review is
   reachable from every surface.
3. **A genuine Win11 install that has been smoke-tested by a Windows
   user from a fresh checkout**, with a recorded "verified on
   `<date>`" timestamp in the SKILL.md.

Until one of those exists, `/dream-on` is `EXPERIMENTAL: Claude-internal
workflow`.

## The HIL handoff PowerShell snippet — why this is a separate rule

Closely related but distinct: every time the agent reports "try this",
the HIL was on PowerShell. The agent kept giving Unix snippets and
then debugging on the HIL's machine. The fix is mechanical: every
resolution message includes one PowerShell code block, runnable in
the repo folder on Win11, with verification commands. See CLAUDE.md
§ "HIL handoff: every resolution gets a runnable PowerShell snippet".

This isn't about preferring PowerShell over bash. It's about respecting
that the HIL's working environment is fixed and the agent's
environment isn't.

## What a future dreamer should NOT do

- Do not declare any new skill "shipped" or part of a "brand" without
  the cross-surface story.
- Do not assume Anthropic surface availability based on the existence
  of files in the repo. The repo is one of many sources of skills, and
  only Claude Code reads it.
- Do not give Unix-shell install snippets to a Windows HIL. Ever.
- Do not respond to a HIL "doesn't work on my machine" report with a
  list of options — fix the actual machine state with a single
  PowerShell snippet, or admit the feature doesn't run on Windows yet.

## See also

- CLAUDE.md § "Cross-Surface Verification Rule" — the canonical policy
- CLAUDE.md § "Auto-Mode Trust Boundary" — sibling discipline rule
- `.claude/clawdbot/memory/dream-on-surface-availability.md` — the original surface-availability note (predates the rule, now superseded by it)
- `skills/dream-on/SKILL.md` — currently carries EXPERIMENTAL status banner reflecting this rule
