# Dual-use submission window — verification against the 17.12.2026 deadline

---

## VERSION AND AGENT HISTORY

| Field          | Value                                                                                                                                                                                                    |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Version        | 1.0                                                                                                                                                                                                      |
| Date           | 2026-07-29                                                                                                                                                                                               |
| Author         | Lifetime Oy                                                                                                                                                                                              |
| Owner          | risto-001                                                                                                                                                                                                |
| Status         | Resolved — the 28.10.2026 date the founder recalled belongs to a **different** EIC instrument, not the Accelerator grant track Lifetime Oy is applying under                                            |
| Classification | Internal                                                                                                                                                                                                 |
| Branch         | claude/dws-eic-accelerator-step1-82ml4d                                                                                                                                                                  |
| Why this exists | Priority #2 of this session: verify a founder-recalled "possibly 28.10.2026" dual-use submission window against the continuous 17.12.2026 17:00 Brussels deadline stated everywhere in the EIC pack. Per the External-Attribution Rule this session is applying, resolve WHICH instrument a recalled date belongs to before letting it near the application. |

---

## Finding

**The 17.12.2026 17:00 Brussels continuous deadline for HORIZON-EIC-2026-ACCELERATOR-01 Stage 1 is correct and unaffected.** No separate, earlier dual-use-specific cut-off applies to the Accelerator's Stage 1 short application.

**The 28 October 2026 date is real — but it belongs to EIC STEP Scale Up Defence, a separate €100M call, not the Accelerator Lifetime Oy is applying to:**

- EIC STEP Scale Up Defence opened **30 June 2026**, accepts applications until **28 October 2026**, results expected early 2027.
- It is an **equity-only scale-up instrument** (€10–30M direct equity financing) for **later-stage** companies scaling industrial capability in air/missile defence, drones/counter-drones, and related critical defence technologies — not a grant-plus-equity blended instrument for an SME at Lifetime Oy's stage, and not what `EIC_STEP1_FILL_PACKET.md` targets (Grant-only €2.5M, decided 2026-07-17 per that file's header).
- The EIC Accelerator itself (the call Lifetime Oy is applying to) was amended on **17 June 2026** to open its **existing** Stage 1/Stage 2 structure to dual-use projects — it did not get a new, separate dual-use deadline. Reporting on the amendment specifically notes: companies that already received a GO at short-application (Stage 1) stage before the amendment can now declare a dual-use dimension at full-stage (Stage 2) *without resubmitting Stage 1* — implying Stage 1's own continuous-deadline mechanics were left unchanged, dual-use or not.

**Conclusion: nothing about the dual-use tick-box changes the 17.12.2026 target.** The founder's recollection of "28.10.2026" is not wrong — it is just a different call.

---

## What this means for the EIC pack

No changes needed to `EIC_STEP1_FILL_PACKET.md`, `EIC_STEP1_SHOT_SCRIPT.md`, or any other file currently stating the continuous 17.12.2026 deadline — all confirmed correct. No action required before submission on this item.

**One live idea, not a Step 1 requirement:** if Lifetime Oy's defence engagement matures past design-partner stage before Q4 2026, EIC STEP Scale Up Defence's 28.10.2026 window is a real, separate opportunity worth a founder decision on whether to pursue in parallel — but it is a distinct application (different instrument, different stage of company readiness, equity not grant) and out of scope for the current Accelerator Step 1 submission.

---

## Sources

Retrieved via web search 2026-07-29 (direct WebFetch to the primary EIC/EU pages returned 403 — likely bot-protection on `eic.ec.europa.eu` and portal subdomains rather than a proxy fault; confirmed via `$HTTPS_PROXY/__agentproxy/status`, no relay failures logged). Cross-referenced across three independent secondary sources for consistency before treating the 28.10.2026 date as understood:

- [European Innovation Council — "The European Innovation Council opens to defence and dual-use technologies"](https://eic.ec.europa.eu/news/european-innovation-council-opens-defence-and-dual-use-technologies-2026-06-17_en) (17 June 2026 amendment)
- [Euro Funding — "The EIC expands its funding to defence projects and dual-use technologies"](https://euro-funding.com/en/blog/the-eic-expands-its-funding-to-defence-projects-and-dual-use-technologies/)
- [FASI — "Amendment to the EIC 2026 work programme: focus on dual-use"](https://fasi.eu/en/articles/in-evidence/29320-eic-work-programme-2026.html)
- [European Innovation Council — "EIC STEP Scale Up Defence call opens today"](https://eic.ec.europa.eu/news/eic-step-scale-defence-call-opens-today-2026-07-01_en) (1 July 2026, confirms 28.10.2026 close)
- [European Innovation Council — EIC STEP Scale Up Defence programme page](https://eic.ec.europa.eu/eic-funding-opportunities/eic-step-scale-defence_en)

**Recommended before final submission:** founder to do one direct check of the live HORIZON-EIC-2026-ACCELERATOR-01 topic page on the F&T Portal (requires EU Login, which the WebFetch tool cannot authenticate as) to confirm no last-minute amendment has changed the continuous-deadline mechanics between now and submission.
