<!--
VERSION AND AGENT HISTORY
Document: plausible-wait-window.md
Version: 1.0
Last-Updated: 2026-07-28
Author: Risto Anton Päärni (Lifetime Oy)
Agent: Claude Code
Purpose: Canonical DWS rule for waiting on a third party — waiting is only a
         legitimate posture while the delay is plausible against that party's
         normal completion time. Past that, waiting is an unreported failure.
         Worked case: cari.fi stuck at Pending for two days at hostingpalvelu.fi.
Introduced-In: branch claude/cari-fi-new-site-x410ox
Code-Version: 1.0
Branch: claude/cari-fi-new-site-x410ox
Date: 2026-07-28
Owner: risto.paarni@lifetime.fi
-->

# The Plausible Wait Window

**Version:** 1.0 · **Status:** Active · **Scope:** any blocking dependency owned by a third party — registry, registrar, certificate authority, marketplace review, bank, verification-by-post, partner countersignature

## The rule

When work is blocked on a third party, write down **that party's normal completion time before you start waiting.** Waiting is a legitimate posture only inside that window. Once the elapsed time leaves it, the situation has changed category — from *in progress* to *stuck* — and the correct action changes with it: escalate, and say so.

**Patience and neglect look identical from the outside.** The only thing that distinguishes them is a stated expectation that the elapsed time can be checked against.

## Why the window has to be written down first

Without a number, the decision to keep waiting is re-made every day on feel, and feel is anchored to the previous day. Each additional day of delay makes one more day of delay seem normal — so the threshold drifts with the thing it is supposed to measure. A three-hour process reaches its third day without anyone experiencing a moment where they decided to allow that.

Write it down *before* the wait begins, when you still have no stake in the answer.

## Category error to avoid

"The third party is working on it" and "the third party never received it" produce the **same observable state**: nothing has happened. This is why an unbounded wait is not conservative. The passive reading is the optimistic one, and it is the one that costs the most if wrong, because the failure is silent on both sides — they are not waiting for anything, and you are.

## Escalate with a disjunction, not a status query

"Please check the status" invites a restatement of what you can already see. Instead, **name the possible causes and ask which one applies.** For a stalled registration the standard three are:

1. **Payment not reconciled** — the request was never submitted. Waiting cannot fix it.
2. **A rejection that was never surfaced** — the request failed validation and the reseller UI still shows it as pending. **This is the one to name explicitly**, because it is the only branch where the fix is on your side and you can begin it immediately.
3. **Genuinely queued** — the answer is a timestamp, and the wait resumes with an end in sight.

The disjunction also converts an open-ended chase into a closed question, which is much harder to answer with an acknowledgement.

## Always name the fallback

An escalation without a fallback is still an unbounded wait, just a louder one. State what happens if the party cannot resolve it, and what that costs — for a domain, a transfer to another registrar at the cost of the fee, not the name. Knowing the exit price is what makes the remaining wait a decision rather than a hope.

## Worked case — cari.fi, 26–28.07.2026

`cari.fi` was registered and paid at hostingpalvelu.fi on 26.07.2026 and stayed `Pending`. A `.fi` registration normally activates in minutes to hours — the Traficom registry step is automated. Two days is outside that by an order of magnitude.

Everything else in the project was serialised behind it: Cloudflare zone → nameservers → Pages custom domain → Workspace verification → MX → the `huolto@`, `service@` and `rekry@` mailboxes. The site itself had been finished for days. **One flag at a third party was the entire critical path**, which is exactly the shape that makes a silent wait expensive.

Support request filed **28.07.2026 at 20:57**, naming the three causes above and the holder details a rejection would hinge on (Carin Huoltopalvelu Tmi, Y-tunnus 3582356-8). Next check set for the following day, with phone escalation if the reply was an acknowledgement rather than a reason, and transfer named as the fallback.

## Related

- `CLAUDE.md` Rule 12 (fail loud) — an unbounded silent wait is the passive form of the same failure
- `docs/field-notes/2026-07-26-cari-fi-new-site-cloudflare-onboarding.md`
- `kb/wiki/concepts/repo-as-publication-surface.md` (same session)
