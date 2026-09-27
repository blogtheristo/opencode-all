# Field Note: Contrastive Language Model (CLM) — Market Signal

**Date:** September 26, 2026
**Owner:** Lifetime Oy / DWS IQ
**Status:** Logged — no action taken
**Source:** https://contrastive-lm.notion.site/ (HIC-supplied reference, unverified beyond the note text itself)

## Signal

A research group has published "Contrastive Language Model (CLM)," pitched as an ultra-fast "System One" model trained with a contrastive objective linking states and actions, disaggregating state/action embeddings for caching and reuse.

**Claims as stated in the source (not independently verified by this session):**

- CLM-8B: up to 9× faster inference than "Jev" on computer-use, gaming, and tool-calling tasks, at comparable performance.
- With lightweight fine-tuning: SOTA on DeepSWE (81.6%) and Terminal-Bench 2.1 (87.6%).
- Claim that "Jev" is an ineffective verifier for long-horizon agentic tasks.
- Scaling laws: test contrastive loss follows a power law in compute, model size, dataset size.
- Code: `github.com/Contrastive-LM…` (URL truncated in source, not resolved).

## Relevance to DWS IQ

Potentially relevant to agent inference-latency work (tool-calling, computer-use) if the disaggregated state/action caching claim holds up — this is the kind of architecture that could cut latency in our own agentic loops (Firehorse, MCP orchestration) where state evolves continuously but the action set is fixed (e.g. repeated tool schemas).

**Not verified:** benchmark numbers, "Jev" identity/baseline validity, reproducibility, licensing, or whether code repo is public/usable. Treat as an unconfirmed signal until independently checked.

## Next steps (not executed this session)

- If pursued: verify claims against the linked GitHub repo and any paper, before citing in PhD thesis (§14.x market-signals track, which this note is scoped for — no thesis edit made here).
- No code changes, no thesis edits, no outreach action taken.

## Unresolved references (blocked by environment egress policy)

Two HIC-supplied secondary sources could not be fetched this session — both domains are blocked by this container's network egress proxy, not verified as unreachable in general:

- `https://zenn.dev/null_teck/articles/clm-vs-decision-models` — purported stats comparing CLM vs. decision models.
- `https://x.com/josharosen/status/2103499788352184446` — referenced post, content unknown.

Neither claim from these two sources is reflected above; nothing from them has been treated as verified or added to the claims list. If they matter, paste their text directly, or ask to open `zenn.dev`/`x.com` in the environment's network policy (`read_documentation` topic `environment.network`).

## Recommendation

Do not act on the benchmark claims yet — verify first, then decide in this order:

1. **Verify before citing anywhere.** Resolve the truncated GitHub URL, pull the actual repo/paper, and check the DeepSWE (81.6%) and Terminal-Bench 2.1 (87.6%) numbers against the benchmarks' own published baselines. Do not let an unverified 9× latency claim into investor or customer-facing material under any circumstance.
2. **If verified, scope is PhD, not master's.** Per the Thesis Content Scope Rule this is a market/scientific signal (novel training objective, scaling-law claims, third-party benchmark results), not our own implementation evidence — it belongs in `PHD_FIREHORSE_EN/FI` §14.x, not `V3Thesis_EN/FI`.
3. **Technical fit worth a spike, not a commitment.** The disaggregated state/action caching idea is architecturally relevant to Firehorse/MCP tool-calling latency (fixed action set, continuously evolving state is exactly our shape). Worth a small, time-boxed research spike (read the paper, no adoption work) once the repo is confirmed real and usable — not worth diverting a sprint on an unverified announcement.
4. **No outreach, no product claims, no fine-tuning spend** until step 1 clears. This is a signal to track, not a capability to build on.

## HIC action

1. Approve or reject the recommendation above (verify → PhD §14.x citation → optional spike). If approved, next session runs the verification pass in step 1 before any thesis edit.
