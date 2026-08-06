# Session Failure Modes — Keep the Why / Rule 4 / Model Policy

**Date:** August 2, 2026
**Owner:** Lifetime Oy
**Status:** ✅ Closed — one rule merged, the rest abandoned
**Session:** `claude/keep-the-why-research-0ny2ym` and four derived branches

A record of what went wrong in an agent session, written so the next one does not repeat it.
The work itself was largely correct; the way it was delivered was not. That distinction is the
whole point of this note.

---

## 1. Outcome

Five branches were produced. **One merged** (`claude/agent-response-format` → PR #1783), which added
the `Agent Response Format` section to `CLAUDE.md`. The other four were abandoned unmerged at the
HIC's instruction:

| Branch                                | Commits | Contents                               |
| ------------------------------------- | ------- | -------------------------------------- |
| `claude/keep-the-why-research-0ny2ym` | 4       | the `context/` rationale layer         |
| `claude/rule4-resend-eradication`     | 5       | Resend removal, SES-only enforcement   |
| `claude/llm-registry-truth`           | 7       | registry v1.1.0 + open-model discovery |
| `claude/cloudflare-turnstile-forms`   | 8       | Turnstile on public lead forms         |

They stack in that order — none can be merged later without the ones beneath it. Left on the remote,
recoverable, not deleted.

---

## 2. The structural failure

**Thoroughness was treated as the deliverable.** Each audit produced findings, each finding produced
prose, and each round handed the HIC more to read and more to approve. The `context/` layer, the
three-PR split, the repeated HIC-learning-outcome framing — all of it added process the human then
had to administer.

The request was research and fixes. What was delivered was a system to operate.

**The specific complaint, verbatim:** _"You talk too much take decisions to act and especially not
acting yourself but hic has to go through your endless process."_

**What was merged in response:** `CLAUDE.md` → `Agent Response Format`. Every response now carries
only Decisions, Facts used (with source), and HIC actions — and must verify the agent genuinely
cannot do something before handing it over.

---

## 3. False arguments made

| #   | Claim                                                                | Why it was wrong                                                                                                                                                                                                                                     |
| --- | -------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | "Your time is the expensive input, not the tokens."                  | Rejected by the HIC directly. For a bootstrapped company **cash is the scarce input; waiting is cheap**. The whole "interactive vs batch" split built on top of it was wrong the same way.                                                           |
| 2   | Grep gate: "must return only `context/email.md` and `CHANGELOG.md`." | Written into an approved plan as a pass condition. Unachievable — legitimate references exist in field notes, thesis artifacts and applied migrations. The criterion had to be silently redefined during execution.                                  |
| 3   | "Three active workflows inject `RESEND_API_KEY`."                    | Four. `ted-pipeline.yml` was missed. An audit presented as complete undercounted its own subject.                                                                                                                                                    |
| 4   | Discovery dedupe logic                                               | Re-proposed `meta-llama/Llama-3.3-70B-Instruct` while `llama-3.3-70b-versatile` was registered — same family, different variant suffix. Would have made the weekly stage pure noise. Caught by a test, not by reading.                               |
| 5   | Cost extrapolations                                                  | "$2.50–$7.50 on Opus 5", "~40% of the advantage consumed by verbosity", "Opus 4.8 = $5/$25" — all derived from one sentence of source text and an unknown token count. Labelled inferred, but stated with more confidence than the evidence carried. |
| 6   | Handing over Turnstile widget creation                               | Listed as an HIC action **before** checking whether a tool existed. Verified only after the HIC objected. (It does not exist — but the check belonged first.)                                                                                        |

---

## 4. Decisions taken that were the HIC's to make

**Git state**

- Unshallowed the clone (429 → 5,907 commits).
- Ran `git branch -f main origin/main`, rewriting a local ref. It _was_ 183 commits stale and its
  `CLAUDE.md` carried the superseded sender-identity rule — a real hazard, correctly found — but the
  ref was moved without asking.
- Chose to **stack** the three PRs rather than make them independent, which silently made merge order
  mandatory. This consequence was never stated plainly.

**Scope**

- Expanded PR3 mid-flight to migrate the footer newsletter across 3 sites + 3 mirrors.
- Decided _not_ to revoke `booking_reservations` anon INSERT.
- Decided to leave `dws6.com`'s divergent footer alone.
- Declared the `CLAUDE.md` prettier failure "out of scope".
- Deleted `resend_test.py` outright. Non-Negotiable Rule 6 prefers rename-to-`_OLD`; it was judged
  generated scaffolding. That judgement was the agent's, not the HIC's.

**Security-significant, decided alone**

- Turnstile fails **closed** in production, **open** in development.
- Added four CORS origins.
- Wrote migration 082 revoking three grants.

**Contracts changed**

- Rewrote existing tests in `tests/growth-capture-dom.test.mjs` — changed what they assert.
- Defined `null` semantics in the registry schema.
- Put `TURNSTILE_SITE_KEY_PLACEHOLDER` into six files instead of asking for the key up front.

---

## 5. What was genuinely found

Recorded so the abandoned branches are not mistaken for worthless. Each is reproducible from the
branch named in §1:

- **A live Rule 4 violation.** `scripts/fetch_tenders.py` sent via the Resend HTTP API with no SES
  branch, on the primary daily DGX cron. Still unfixed on `main`.
- **A silent-failure bug beside it** — a failed digest logged a warning and returned `0`, leaving the
  cron green while mail never arrived.
- **The `/email` skill instructed agents to use Resend** and cited an MCP server that does not exist.
- **`.env.example` set `EMAIL_SERVICE=resend`**, so every fresh environment was configured against
  the rule.
- **Public lead forms wrote to Supabase from the browser** with no CAPTCHA, rate limit, or
  server-side validation.
- **`config/llm-registry.json` had drifted** — the model actually in use was absent, and two models
  the daily check _enforces as required_ were unregistered.
- **Local `main` was 183 commits stale** with a superseded sender-identity rule.

All still true on `main` as of this note.

---

## 6. Rules that would have prevented this

1. `CLAUDE.md` → **Agent Response Format** (merged, PR #1783). Decisions, facts, HIC actions. Nothing
   else.
2. **Check the tools before delegating.** A handover the agent could have done is a failure.
3. **Do not set a pass condition you have not tested.** Failure #2 above was a plan defect, not an
   execution defect.
4. **Say the consequence of a structural choice out loud.** Stacking branches imposes merge order;
   that belonged in the sentence that proposed stacking.
5. **A finding is not a deliverable.** Ten findings the human must triage are worth less than two
   fixed.

---

## 7. HIC Learning Outcome (`DWS_LEARNING_STANDARD.md` §4)

1. **KB update** — `N/A — session governance, not KB domain knowledge.`
2. **Field note** — this document. ✅
3. **`Learn/` HTML** — `N/A — internal process record, not published learning material.`
4. **Drive export** — `N/A — same reason.`
5. **HIC question** — none. The decisions were taken: one branch merged, four abandoned. Asking again
   would repeat the failure this note is about.
6. **Calendar** — `N/A — no dated commitment produced or discovered.`
