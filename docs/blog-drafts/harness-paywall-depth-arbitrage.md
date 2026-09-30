Status: REAPPROVAL_NEEDED
reapproval_note: text corrected 30.09.2026 by external sourcing (BLOG_STANDARD §17); previously APPROVED. The published page is unchanged.
Reviewed-By: Risto Anton Päärni (HIC)
Reviewed-On: 2026-07-30
Approval-Record: HIC, 30.07.2026 — "Approve post". Third revision round. Full text shown
in one fenced code block on rounds 1 and 2; round 3 applied the Boardy correction (the €0
marginal-cost claim was false and was replaced with the bounded-compute-economics framing),
whose Act III passage was shown verbatim before approval.
Slug: harness-paywall-depth-arbitrage
Title: The Harness Paywall
Language: en
Target: onelifetime.world/posts/harness-paywall-depth-arbitrage.html
Date: 2026-07-30
claims_checked: 2026-09-30

# The Harness Paywall

Perspective · Architecture · 30 July 2026 · Risto Anton Päärni · Espoo, Finland

Three things were said in the last three weeks. Separately, none of them is news.
Chained together, they describe where enterprise AI money is about to move.

## Act I — The harness is the durable layer

On Microsoft's Q4 earnings call on 29 July, an analyst asked Satya Nadella how
Microsoft benefits when enterprises adopt open models. He did not defend the lab
relationship. He described an architecture [1]:

> "You've got to keep your harness separate from the model, when the harness will
> ensure that your memory, your context all of that is external. That means any
> given model at any given time is swappable."

Models are ephemeral. The scaffolding around them — context routing, tool calling,
memory, state loops — is what persists. Jensen Huang had said something adjacent on
8 July: most companies will be built on harnesses. The implication is directive.
Build for the harness.

## Act II — The harness is a token monster

Then Composio published a benchmark that puts a price on that advice. Same model,
same 28 tasks, only the harness changed. Success rates came out close. Token
consumption did not: a spread of up to **30×**, medians of 61k, 67k and 340k tokens
per task. Composio's own average cost per task, at $3 per million input tokens,
came to roughly $0.22, $0.28 and $2.00 for the same work — averages, not the
medians multiplied out.

Read it honestly before you use it: it is one vendor's own publication, not an
independent study. The task set is not published. One model, one run. Treat the _direction_ as real and the exact
multiple as unsettled.

Even so, the conflict with Act I is hard to escape. If the harness is where the
value lives, and the harness burns 340k tokens per task, then under metered API
pricing the durable layer is unaffordable at scale. The architecture runs into a
paywall.

## Act III — The same tokens, the opposite sign

The resolution is not a leaner harness. It is a different cost substrate.

On a metered API, 340k tokens are a variable cost that scales with exactly the
behaviour Act I tells you to maximise. On hardware you already own, running an
architecture that holds throughput as context accumulates, the external per-token
bill disappears.

Be careful with that sentence, because the tempting version of it is false. Tokens
on your own hardware are not free. You still pay for electricity, for amortising the
box, for maintenance, for serving the model, and for whichever bottleneck you reach
first. What changes is the _shape_ of the cost: an unpredictable charge that scales
with how hard your agents think becomes a bounded one you sized in advance. The 340k
tokens stop being an elastic exposure and become an allocation of capacity you have
already provisioned.

Two things had to become true for that to work, and both now have. Sub-quadratic
attention — hybrid designs that mix state-space layers with attention — makes a
large context window economically usable rather than merely advertised [2]. And
inference engines have appeared that hold throughput as the context fills, instead
of collapsing to single digits once real work accumulates [3].

## Two workloads, two correct answers

This is not an argument that everyone should buy GPUs. The substrate is selected
by the shape of the work, and there are two shapes.

**Consumer applications.** Millions of external users, arriving unpredictably, each
sending a short prompt — one or two thousand tokens of context. You need elastic
capacity to absorb bursts you cannot forecast. Paying fractions of a cent per token
is far cheaper than owning clusters that sit idle off-peak. Metered APIs are not a
compromise here; they are the right answer.

**Industrial fleets.** A known, bounded number of internal agents — ten, twenty
specialised software operators — running deep, multi-turn workflows: a compliance
audit, a refactor across a codebase, an evidence chain reasoning over a long
record. This is where Composio's 340k median lives. Per-token billing on that depth
is where margin goes to die.

The difference that matters is not size. It is **who decides the concurrency**. In
the first case, the public does. In the second, you do.

## The part most people will skip

"Local compute is free" is false, and a claim that big deserves its limit stated
plainly.

Every GPU has a throughput knee. To the left of it, memory bandwidth and KV-cache
comfortably carry the active context and generation stays responsive. Past it,
VRAM fills, requests queue, and throughput collapses non-linearly into latency —
KV-cache memory grows with every request's context and caps how many requests fit
in a batch [3]. So
the shift does not remove cost — it **changes the kind of cost you pay**:

- **Metered cloud:** cost scales with tokens; concurrency is effectively unlimited.
  You trade capital for capacity.
- **Own hardware:** no external per-token bill; the residual cost is bounded and
  mostly fixed — power, amortisation, maintenance, serving — and concurrency is
  capped. You trade peak scale for predictable, dimensioned execution at depth.

Run a consumer app on local GPUs and an unplanned surge pushes you past the knee
and takes your performance with it. Run a bounded fleet and you can dimension the
engine so that even at 250k–340k context depth, the total workload sits to the
left of it. That is the whole trick, and it is a discipline rather than a property:
**you can only dimension to the left of a knee you have measured.** Under-dimension
a sovereign deployment and you hit the same wall as everyone else.

We have not yet measured our own. The sweep that would settle it is specific — at
what context length does KV-cache bandwidth drag generation below interactive speed,
and where does memory-bound generation give way to queueing — and it has to report
six things per operating point, not one throughput number: tokens per task, latency,
concurrent jobs, GPU memory, queue time, and cost per audit-ready output. That last
one is what turns a systems benchmark into a commercial claim, because it is the
unit an industrial buyer actually purchases.

Until those exist for our own hardware, everything above is an architectural
hypothesis rather than a proven result, and we would rather say so than let it be
read as one.

## What it means if you are buying

**Check the harness before you switch the model.** If your agent bill is
uncomfortable, harness overhead is now a more likely culprit than model price, and
it is the cheaper thing to change.

**Harness ownership is now a decision you have to make.** As of 29 July, "we keep
the harness separate from the model" is an earnings-call talking point [1] from the
largest enterprise software vendor on earth — so as a vendor claim it is table
stakes, and anyone selling you that sentence alone is describing the floor. The
consequential version of it is not a vendor's to answer. If the harness is the
durable layer — if it holds your memory, your context, your traces, your accumulated
operating knowledge — then whether you own that layer or rent it is a decision every
enterprise now has to take deliberately, the way it once decided whether to own its
data centre or its ERP. Deferring it is also a decision. It just gets made by
whoever is holding your context when you want to change something.

**What is defensible is the coupling.** Deep scaffolding is only affordable on
compute whose cost is bounded rather than metered, and a vendor whose revenue scales
with tokens has little reason to make token-intensive work cheap. But be precise about the
limit of that argument, because a good procurement team will be: metered vendors
_can_ reprice — reserved capacity and provisioned throughput already do. A capacity
contract answers the bill. It does not answer where your evidence lives, under
whose law, or who can compel its disclosure. Compute makes deep harness work
affordable; jurisdiction makes it defensible. The moat is both, and neither one
alone.

The harness is the future of software. Its token intensity makes metered pricing
the wrong place to run it for a whole class of work. That is the argument, and the
interesting job now is finding out precisely where it stops being true.

---

_The thesis–antithesis–synthesis framing in this piece was drafted with Google
Gemini 3.6 Thinking and adopted after review. The benchmark figures are Composio's,
published on 29–30 July 2026 and cited with the caveats above._

## Sources

[1] Microsoft (2026). Microsoft Fiscal Year 2026 Fourth Quarter Earnings Conference Call — transcript, 29 July 2026. Microsoft Investor Relations. https://www.microsoft.com/en-us/investor/events/fy-2026/earnings-fy-2026-q4

[2] Lieber, O., Lenz, B., Bata, H., Cohen, G., Osin, J., et al. (2024). Jamba: A Hybrid Transformer-Mamba Language Model. arXiv:2403.19887. https://arxiv.org/abs/2403.19887

[3] Kwon, W., Li, Z., Zhuang, S., Sheng, Y., Zheng, L., Yu, C. H., Gonzalez, J. E., Zhang, H. & Stoica, I. (2023). Efficient Memory Management for Large Language Model Serving with PagedAttention. arXiv:2309.06180. https://arxiv.org/abs/2309.06180
