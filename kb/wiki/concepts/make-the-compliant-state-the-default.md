<!--
VERSION AND AGENT HISTORY
Document: make-the-compliant-state-the-default.md
Version: 1.0
Last-Updated: 2026-07-27
Author: Risto Anton Päärni (Lifetime Oy)
Agent: Claude Code
Purpose: Canonical DWS rule for turning a repeatedly-broken discipline into a
         mechanism. Extracted from two failures found the same day — the missing
         AI-content label and the missing blog draft review.
Introduced-In: PR #1758 (branch claude/ollama-orchestration-merge-047pj7)
Code-Version: 1.0
Branch: claude/ollama-orchestration-merge-047pj7
Date: 2026-07-27
Owner: risto.paarni@lifetime.fi
-->

# Make the Compliant State the Default

**Version:** 1.0 · **Status:** Active · **Scope:** any rule an agent is expected to follow repeatedly

## The rule

> **A step you have to remember is a step that will be missing on the entry that matters.**

If a discipline has failed more than once, do not restate it more firmly. Restating is what
already failed. Change which state the tooling produces **by default**, so the compliant
outcome is what happens when nobody does anything special, and the non-compliant outcome is
what requires deliberate effort.

Stated as a test: **what does the tool emit if the agent forgets?** If the answer is "the
wrong thing", the rule is not implemented — it is merely written down.

## Where this came from (2026-07-27, two instances in one session)

| Discipline | How it failed | What "default" became |
| --- | --- | --- |
| EU AI Act Art. 50(4) label on machine-translated pages | Would have been added by hand, per page, per language — i.e. eventually not at all | The i18n builder **emits the label**; a config list removes it per language once a named human reviews |
| HIC reads blog text before publication | Asked for many times over months. Sessions published with nothing shown, drafted posts that were never published, or showed an audit summary instead of the words | A PreToolUse hook **blocks the publish** unless an approved draft exists |

Both had been *stated* clearly before. Neither had been *defaulted*. The HIC's own summary of
the second one — "sometimes container publish without showing me anything, sometimes entry is
never published, almost never i get to see the text" — is what an unenforced rule looks like
from the outside: not defiance, drift.

## The four properties of a real gate

1. **It produces the compliant artefact itself.** Not a reminder to produce it.
2. **It fails loud and blocks**, rather than warning into a log nobody reads (Rule 12).
3. **Its limits are written where it is defined.** Every mechanism has holes — a hook that
   only sees `Edit`/`Write` misses generators and cron; a hook only arms at session start.
   Name the holes in the hook header, or someone will mistake coverage for safety.
4. **The rule is also stated where each hole is.** In DWS terms: the escalation from a standard
   section to a `CLAUDE.md` Non-Negotiable, mirrored into `GEMINI.md`, `session-start.sh`, the
   cron script, and every command that could publish. **A bypass is not permission.**

## The honesty clause

A mechanism can force an artefact to exist. It **cannot** verify a human read it, meant it, or
agreed. Say so where the mechanism is defined. A gate that is described as guaranteeing more
than it does is worse than no gate, because it ends the conversation about the residual risk.

The corollary for agents: **the gate does not discharge the duty to ask.** It makes forgetting
expensive; it does not make asking optional.

## Anti-pattern

Adding a stronger adjective to a rule that is already being broken — "**always** show the
draft", "**never** forget the label". If emphasis worked, the rule would have worked. Reach for
the emphasis only *after* the default is fixed, and then only to cover the holes the mechanism
cannot reach.

## Companions

- `docs/field-notes/2026-07-27-i18n-as-data-five-language-publishing.md` — both instances, in full
- `docs/BLOG_STANDARD.md` §3.3 (draft gate) and §3.2.1 (AI-content label)
- `DWS_TRUTH_STANDARD.md` §2G — the Article 50(4) duty the label discharges
- `CLAUDE.md` Non-Negotiable Rule 13 · `.claude/hooks/blog-draft-gate.sh`
