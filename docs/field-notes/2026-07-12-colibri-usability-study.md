# Colibrì (JustVugg/colibri) — Usability Study

---

# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:

- Version: 1.0 | Tool: Claude Code | Session: claude/colibri-usability-study-z5q1ew | Date: 12.07.2026 | Changes: Initial usability study of the open-source Colibrì inference engine (JustVugg/colibri). Heuristic + onboarding-journey evaluation grounded in the public repository README, CLI surface, and diagnostics. Scope caveat recorded: no live 744B inference run was possible in the sandbox; runtime-performance UX is assessed from the project's own honest benchmark tables and design, not from a first-hand run.

Document Status:

- Created: 12.07.2026
- Last Modified: 12.07.2026
- Language: English
- Publication Status: INTERNAL — engineering/UX research note, not for public site

Related Documents:

- `docs/field-notes/README.md` — Field Notes purpose and naming convention
- `SITE_QUALITY_STANDARDS.md` — DWS usability/quality heuristics (internal reference frame)
- Upstream: <https://github.com/JustVugg/colibri> (Apache 2.0)

---

- **Subject:** Colibrì — a pure-C, zero-runtime-dependency inference engine that runs GLM-5.2 (744B-parameter MoE) on a ~25 GB-RAM consumer machine by keeping dense layers resident and streaming the 21,504 routed experts from disk.
- **Author:** Claude Code research session, prepared for Risto Anton Päärni, Founder, CEO, Lifetime Oy
- **Date:** 12.07.2026
- **Trigger:** Requested usability study of the newly-open-sourced Colibrì engine by @JustVugg (Vincenzo). Repo trending; community benchmark contributions actively solicited.
- **Method:** Nielsen 10-heuristic evaluation layered over a first-run user-journey walkthrough (discover → build → acquire model → first token → serve → operate). Evidence base is the public repository: `README.md`, the `coli` CLI subcommand surface, `setup.sh`, `doctor`/`plan` diagnostics, the `web/` React client, and the project's published performance tables.
- **Scope caveat (Rule 12 — fail loud):** This is a **design-and-documentation usability study, not a hands-on run.** Acquiring and converting the ~370 GB int4 model and running GLM-5.2 is infeasible in this environment. Claims about _runtime feel_ (latency, error surfacing under load) are inferred from the design and the maintainer's own honest numbers, and are labelled where that inference is doing the work.

## TL;DR

1. **Colibrì's usability is unusually strong for a systems-level C project** — the standout being that it treats _"will this even run on my box?"_ as a first-class, pre-flight question. `coli doctor` and `coli plan` answer it read-only, before any tensor is allocated or 370 GB is touched. That single design decision removes the most expensive failure mode in the category (discover-your-machine-can't-do-it after a multi-hour download).
2. **The onboarding happy path is genuinely three commands** (`./setup.sh` → `./coli convert` → `COLI_MODEL=… ./coli chat`), and a pre-converted Hugging Face model collapses it to two. This is excellent.
3. **The dominant usability risk is not the software — it is expectation-setting around performance.** Default first-token throughput on a typical machine is **0.05–0.11 tok/s** (README's own numbers). Without the framing the project already provides, a new user will read that as "broken." The README's _"Honest Performance Numbers"_ section is the mitigation and is a model of the genre.
4. **Discoverability of power is uneven.** The most impactful ergonomics — the `--auto-tier` planner, the `STATS`/`PIN` learning-cache loop that "gets faster the more you use it," `:more` to continue truncated answers — are configured through **~25 environment variables** rather than discoverable flags or an interactive first-run wizard. Great for experts, opaque for newcomers.
5. **Top three fixes, in order:** (a) make `coli doctor` the _default_ first thing `setup.sh` prints and route users to `--auto-tier`; (b) print a one-line honest-throughput expectation at chat startup (e.g. `est. 0.1 tok/s on this disk — see README perf table`); (c) fold the highest-value env vars (`THINK`, `AUTOPIN`, `PIN`/`STATS`) into named flags with `--help` text.

## What Colibrì is (one paragraph)

Colibrì exploits the sparsity of Mixture-of-Experts models: although GLM-5.2 has 744B parameters, only ~40B activate per token and only ~11 GB of weights change between tokens. The engine keeps dense components (attention, shared experts, router) resident in RAM as int4 (~9.9 GB) and streams the 21,504 routed experts (~370 GB) from disk on demand, with an LRU cache layered over the OS page cache. It is a single ~2,400-line C file (`c/glm.c`), zero runtime dependencies, with three interaction surfaces: a terminal chat, an OpenAI-compatible HTTP server, and a community React web client. Python appears only in the offline weight converter, never at inference time.

## Who the users are (implied personas)

| Persona                                                                  | Goal                                          | Where the UX serves / fails them                                                                          |
| ------------------------------------------------------------------------ | --------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| **The curious tinkerer** ("can I really run a 744B model on my laptop?") | Get _one token_ out, prove it works           | Served by 3-command quick start + pre-converted HF model. Failed by throughput shock and env-var opacity. |
| **The self-hoster**                                                      | Stand up a private OpenAI-compatible endpoint | Served well: `coli serve`, `--api-key`, CORS, bounded queue, KV slots. Near production-grade surface.     |
| **The benchmarker / contributor**                                        | Measure their hardware, submit numbers        | Served _excellently_: `coli bench`, `iobench`, community table with a clear schema invites contribution.  |
| **The researcher**                                                       | Poke MLA / MTP / DSA / router internals       | Served by teacher-forcing (`TF=1`), oracle generation, single-file readable engine.                       |

The project quietly optimises for personas 2–4 (systems-literate). Persona 1 — the one the _headline_ attracts ("744B on 25 GB!") — is the least served by the current onboarding, and is the one most likely to churn on first contact.

## Onboarding journey — friction walkthrough

**Stage 0 — Discover.** README leads with the value proposition and the honest constraint ("~25 GB RAM", "experts streamed from disk") in the same breath. ✅ Strong. The name etymology (hummingbird: grams of weight, thousands of flowers) is memorable and on-message.

**Stage 1 — Build.** `cd c && ./setup.sh` "checks gcc/OpenMP, builds, self-tests." ✅ One command, self-validating. Zero runtime deps means no dependency-hell. Windows (MinGW-w64) and an experimental CUDA path both documented.

**Stage 2 — Acquire the model.** Two paths: convert yourself (`./coli convert --model /nvme/glm52_i4`, resumable) or download a pre-converted int4 build from Hugging Face. ⚠️ **First friction cliff:** ~370 GB and a fast NVMe are effectively mandatory, disclosed in prose but not gated. There is a documented sharp edge — the note that if MTP files are int4 you must grab int8 heads from a _different_ HF repo — which is a genuine trap for a first-timer and belongs in `coli doctor`'s output, not a README aside.

**Stage 3 — First token.** `COLI_MODEL=/path ./coli chat`. ✅ Clean. ⚠️ **Second friction cliff — the throughput cliff:** default decode is ~0.05–0.11 tok/s on a typical machine. The engine's _"learning cache"_ (`.coli_usage`) genuinely makes it faster with use, and `PIN`/`STATS` can lift a machine from 0.10 → 0.40 tok/s (README's own community numbers) — but a newcomer doesn't know to do any of that on run one.

**Stage 4 — Serve / integrate.** `coli serve` exposes `/v1/chat/completions` etc. with API-key auth, streaming, bounded FIFO queue, request timeout, configurable CORS, and up to 16 KV cache slots. ✅ This is a genuinely thoughtful, near-production API surface — the most mature part of the UX.

**Stage 5 — Operate / tune.** Learning cache, live tier re-pinning (`--repin N`), grammar-forced structured output (`GRAMMAR=`), reasoning toggle (`THINK=1`). ✅ Powerful. ⚠️ Almost entirely env-var-driven; low discoverability (see Heuristic #6).

## Heuristic evaluation (Nielsen's 10)

| #   | Heuristic                          | Rating       | Evidence                                                                                                                                                                                                                                                                     |
| --- | ---------------------------------- | ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | **Visibility of system status**    | ⚠️ Mixed     | `plan`/`doctor` give excellent _pre-flight_ status; load-time and cache-warming feedback documented. But no startup throughput estimate, so "is it hung or just slow at 0.1 tok/s?" is ambiguous on first run.                                                               |
| 2   | **Match to real world**            | ✅ Good      | "doctor", "plan", "chat", "serve", "bench" map to intent. Hummingbird metaphor reinforces the mental model (tiny engine, huge reach).                                                                                                                                        |
| 3   | **User control & freedom**         | ✅ Good      | `:more` continues truncated answers; resumable downloads; read-only diagnostics don't commit you. KV persistence lets you resume warm.                                                                                                                                       |
| 4   | **Consistency & standards**        | ✅ Strong    | OpenAI-compatible API is the single best consistency decision — every existing client "just works."                                                                                                                                                                          |
| 5   | **Error prevention**               | ✅ Strong    | `doctor`/`plan` are _the_ error-prevention story: validate readiness before touching 370 GB. RAM auto-sizing from `MemAvailable` prevents OOM. This is the project's best UX idea.                                                                                           |
| 6   | **Recognition over recall**        | ❌ Weak      | ~25 behavior-changing knobs (`AUTOPIN`, `THINK`, `DRAFT`, `DSA`, `PILOT`, `PIN`/`PIN_GB`, `KVSAVE`, `CAP_RAISE`, `STATS`, `TF`…) are **environment variables** you must _recall_, not flags you can _discover_ via `--help`. High expert ceiling, high novice recall burden. |
| 7   | **Flexibility & efficiency**       | ✅ Excellent | `--auto-tier`, learning cache that self-optimises, multi-GPU expert tiers, live re-pinning. The efficiency ceiling is very high.                                                                                                                                             |
| 8   | **Aesthetic & minimalist design**  | ✅ Good      | Single-file engine, zero deps, tight README. The web client is deliberately minimal (~390 lines, pure API client).                                                                                                                                                           |
| 9   | **Help users recover from errors** | ⚠️ Unknown   | Could not observe live error messages. The int4-MTP-heads trap and the CORS `'*'` "trusted networks only" warning suggest the maintainer thinks about failure modes; whether runtime errors are actionable is unverified.                                                    |
| 10  | **Help & documentation**           | ✅ Strong    | README is comprehensive: architecture, every command, honest perf tables, community measurements, Windows/CUDA paths, benchmarking. Weakness is _findability within_ it (one long doc), not coverage.                                                                        |

## Severity-ranked findings

| Sev      | Finding                                                                                         | Why it matters                                                                                                  | Fix                                                                                                                                                            |
| -------- | ----------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **High** | No throughput expectation is set at runtime; default ~0.1 tok/s reads as "broken" to persona 1. | This is the #1 predictor of first-run abandonment for the audience the headline recruits.                       | Print an honest one-liner at `chat` startup derived from measured disk speed: `~0.1 tok/s on this disk; pinning experts can ~4× it — see README §Performance`. |
| **High** | Highest-value ergonomics gated behind env vars users don't know exist.                          | Users leave 2–4× throughput and the reasoning mode on the table because they never learn `PIN`/`STATS`/`THINK`. | Promote the top ~6 to real flags with `--help`; keep env vars as aliases. Have `doctor` _recommend_ the pin command for the user's box.                        |
| **Med**  | The int4-MTP-vs-int8-heads model-acquisition trap lives in a README aside.                      | Silent quality/perf degradation; hard to self-diagnose.                                                         | Detect and warn in `doctor`/`plan` ("MTP heads are int4; download int8 heads from … for 2.2–2.8 tok/forward").                                                 |
| **Med**  | 370 GB / fast-NVMe requirement disclosed in prose, not gated.                                   | Users can burn hours downloading before learning their disk ceilings them to 0.05 tok/s.                        | `iobench`-backed disk check surfaced _in the quick start_, not only in the benchmarking section.                                                               |
| **Low**  | README is one long scroll; power features hard to find.                                         | Findability, not coverage.                                                                                      | A short table-of-contents and a `docs/` split (QUICKSTART / TUNING / API) would help.                                                                          |
| **Low**  | `web/` client is community-maintained and lightly documented relative to the CLI.               | Persona-1 users may reach for the GUI first and find the least-polished surface.                                | Note maturity level explicitly; link a screenshot + configured-endpoint walkthrough.                                                                           |

## What Colibrì gets _right_ (worth keeping / stealing)

- **Pre-flight readiness as a first-class command.** `doctor` (readiness) + `plan` (storage hierarchy, `--json`) before allocation is the single best UX decision. Most heavyweight ML tooling makes you fail expensively; Colibrì makes you fail for free, instantly.
- **Radical honesty in the docs.** An explicit _"Honest Performance Numbers"_ section plus a community-contributed measurement table (with disk-speed column, config, and result) builds trust and turns users into contributors. This is exemplary and rare.
- **OpenAI-compatible from day one.** Meets users where their tooling already is — the highest-leverage consistency choice available.
- **Zero runtime dependencies.** The most reliable install story in the entire local-LLM space; nothing to break.
- **A learning loop that literally rewards use.** `.coli_usage` auto-pinning hot experts is both a real perf win and a delightful narrative ("gets faster the more you use it").

## Recommendations (prioritised)

1. **Set expectations at runtime, not just in prose.** One honest throughput line at chat start, derived from a quick disk probe, would convert the #1 abandonment case into an informed choice.
2. **Turn `doctor` into a coach, not just a checker.** Have it print the _exact_ recommended run command for the user's hardware (pin budget, tier, MTP head note). Close the loop from "am I ready?" to "here's your best command."
3. **Graduate the top env vars to discoverable flags** with `coli chat --help`. Keep the env-var power-user path; add a beginner-legible one.
4. **Split the README** into QUICKSTART (persona 1), TUNING (personas 2–4), and API. Add a TOC.
5. **Guard the model-acquisition traps** (370 GB, disk speed, int4-MTP heads) inside `doctor`/`plan` so nobody learns them the hard way after a long download.

## What I could NOT evaluate (honesty ledger)

- **First-hand runtime feel** — no model acquired, no token generated in this environment. Latency, streaming smoothness, and live error-message quality are inferred, not observed.
- **Cross-platform install reliability** — Linux path read only; Windows/MinGW and CUDA paths assessed from docs.
- **Web client hands-on** — evaluated from description and line count, not from a running instance.
- **Long-session behavior** — KV persistence and learning-cache warm-up claims are taken from the README, not reproduced.

A genuine follow-up would be a **timed onboarding test with 3–5 real users** on varied hardware (WSL2, native Linux NVMe, Apple Silicon), stopwatch on time-to-first-token and count of README round-trips per stage — the standard usability-lab protocol, which no amount of doc-reading substitutes for.

## Attribution

Colibrì is built and open-sourced (Apache 2.0) by **@JustVugg (Vincenzo)**. GLM-5.2 weights are MIT (Z.ai). Worth a ★ — <https://github.com/JustVugg/colibri>. The _"Honest Performance Numbers"_ + community-measurements pattern is a model other local-inference projects should copy.
