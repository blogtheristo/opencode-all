# Memo to Prof. Kari Smolander — Research Question Status (DRAFT, not sent)

***

# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:

- Version: 1.0 | Tool: Claude Code | Session: claude/greg-isenberg-field-notes-a2r544 | Date: 25.07.2026 | Changes: Luotu HIC:n pyynnöstä (*"Tarkenna smolander tutkimuskysymykset muistiota tai laadi uusi tämän session pohjalta"*). **Uusi muistio, ei 14.07. liitteen muokkaus** — se on tallenne siitä mitä Smolander sai, ja sen ylikirjoittaminen tuhoaisi tallenteen (Rule 12, formulaatioiden säilytys). Rakennettu tämän session tuloksista: lukitus + mekanismi, T1–T3-kriteeri, RQ5:n kaatuminen omaan testiinsä, RQ5 v3 **ehdotuksena**. Sulkee 14.07. lähetetyn kirjeen **ankkurirehellisyysvelan** (Q2/Q3-varaus jätettiin pois lähetetystä versiosta). Strateginen uudelleenarvio mukana vain tutkimusseurauksena, ei kaupallisena arviona — perustelu alla. **Lähettäminen on RED-zone, ihmisen teko.**

Document Status:

- Created: 25.07.2026
- Last Modified: 25.07.2026
- Language: English (memo body) — Finnish cover note optional, see §Cover note
- Publication Status: **DRAFT — not sent.** Sending is a human action
- Classification: CONFIDENTIAL — Doctoral correspondence

Related Documents:

- `docs/lut/2026-07-14-letter-smolander-six-questions.md` — the letter this updates
- `docs/field-notes/2026-07-14-lut-smolander-six-questions-letter-sent.md` — **what was actually sent**, including the omitted caveat
- `docs/lut/2026-07-14-lut-doctoral-research-plan.md` — the 10-page attachment (unchanged)
- `docs/phd/PHD_RESEARCH_QUESTIONS_LOCK_v1.md` v1.1 — the lock and its four rules
- `docs/phd/RQ_FALSIFIABILITY_AUDIT_2026-07-25.md` — T1–T3
- `docs/phd/RQ_SHARPENING_SIDE_BY_SIDE.md` v1.1 — RQ5 v3

***

> ## ⚠️ ONE OPEN DECISION BLOCKS THIS MEMO
>
> **§4 proposes RQ5 v3.** Under lock rule 2 that requires an HIC decision, a version bump and a recorded reason; under lock rule 3 sending it **is the external act**. If the decision is "the sent set stands," delete §4 and send the rest — the memo works without it.

---

# Memo body (draft)

**Subject:** Research questions — status, and one proposed change

Hi Kari,

A short update on where the six questions stand since my July note, plus one proposed change I'd rather put to you than make quietly.

## 1. The six are now locked, and there is a mechanism holding them

The questions had been drifting — between four and ten over the spring. I found the reason, and it was not the quality of any individual question: **three competing sets existed in parallel, and none of them referenced the others.** One lived in the research file, one in an unapplied rescoping proposal from June, and one was the set I sent you on 14 July.

I locked the set I sent you. Not because it was the most recent, but because it is the only one that exists outside my own files — and a supervisor receiving a second set that contradicts the first pays for that in confidence, whatever the internal merits.

Four rules now hold it, and the first is the one that was missing:

1. **A new signal never becomes a new question.** It attaches to an existing question or goes into a signals appendix. It does not get a number.
2. Changing the set requires a version bump and a written reason. No silent edits.
3. **The set is externally communicated, so changing it is an external act** — which is why you are reading this rather than receiving a quietly different list.
4. The thesis file follows the locked set, not the other way round.

Rule 1 is the one that would have prevented the drift. Testing it retrospectively: three of the seven questions in the older set fail the question *"would this be worth asking if the news that triggered it had never happened?"* One of them entered the research programme as a central pillar within 48 hours of two product announcements.

## 2. A criterion I applied to my own questions

Working through the material I arrived at something I think is worth more than the questions themselves, and I'd value your read on whether it holds up.

The research corpus I have built is not a thesis draft — it is a **testbed description**: architecture, measurements, regulatory mapping, a reference implementation. The questions relate to it; they are not its table of contents. From that follows a criterion:

> **A research question lives in the gap between what the testbed demonstrates and what it cannot demonstrate.**

Operationally, three tests:

- **T1** — would a competent reader answer this from the existing corpus alone? If yes, it is documentation.
- **T2** — would the answer emerge from existing material in a week? If yes, it is an analysis task.
- **T3** — if the answer turns out negative — *does not work*, *not sufficient*, *not adopted* — is that a publishable finding? If no, the question is not falsifiable.

**T3 is the one I had been missing.** T1 and T2 screen out trivial questions; T3 screens out something I think is more dangerous — questions that *wait for a process* rather than investigate a phenomenon. Their negative answer is not a finding, it is a delay, and a delay is not a dissertation.

A rich testbed makes this worse, not better: it tempts you to write the questions from inside it, and then they answer themselves. That is exactly how the two discarded sets were produced.

## 3. Applying it honestly cost me my strongest question

Running all six through the test, five hold. **Q5 — the KYA trust-scoring question I described to you as the technical spine — fails T1 and T2.**

The corpus already contains the artifact, the specification, the reference implementation and the proposed criteria. A competent reader would answer the question as I posed it directly from the material.

The uncomfortable part is *why*, and I think it generalises: **Q5 is the best-anchored question in the set — the only one whose artifact is entirely in my own hands — and that is precisely what makes it the most already-answered.** The better a question is anchored to your own work, the greater the risk your own work has answered it. I had been reading that anchoring as Q5's strength. It is both.

## 4. What I propose instead — for your judgement, not decided

*(This section is the proposed change. If it is wrong, the sent set stands.)*

The question narrowed twice as I worked on it. The first narrowing — *what distinguishes a specification from a standard* — failed T1 in turn once I had written the distinction down properly. What survives is genuinely open:

> **Does the classical specification/standard distinction hold for agent governance, where the certified subject changes after certification — and is a four-gate criterion (independent implementations, a falsifiable conformance suite, institutional acceptance or genuine adoption, change control outliving the author) necessary and sufficient for that difference?**

The reason I think this is a real question rather than a reformulation: **a standard for a bolt certifies an artifact that does not change after certification. A standard for agent governance certifies behaviour that changes continuously** — the model updates, the agent population learns, mandates rotate, and the assessor becomes a moving target alongside the assessed. The classical distinction assumes a static subject. Whether it survives a moving one is not answered anywhere I have looked, including in my own corpus.

Two things I want to be explicit about:

- **This narrows the question rather than widening it.** It asks for less work, not more. It stops promising an outcome I cannot underwrite.
- **It also decouples the research from my company's commercial fortunes**, which I regard as a feature. Under the original phrasing, the thesis would have rested on a specification of mine achieving standard status — an outcome I do not control and, on honest assessment, should not plan around. The reframed question is answerable, and publishable, either way.

If you think Q5 as sent is the better question, I will keep it as sent. I would rather have that conversation now than defend a question later that I already know answers itself.

## 5. Where the external anchors actually stand

I should be more precise than my July note was, because on re-reading it I was looser than I should have been.

- **Q1 and Q4 — KTH/TECoSA (Törngren):** live thread, and I am currently settling the division of roles (their group implementing, him evaluating — not both).
- **Q5 and Q6:** grounded in our own production system and Finnish industrial pilots. Not dependent on an external anchor.
- **Q2 (Galaz, Stockholm Resilience Centre) and Q3 (Universeum/Chalmers): I reached out; neither has replied.** Those two anchors are prospective, not confirmed, and my July note implied more than that. Correcting it here rather than leaving it to come up later.

One principle I have adopted and would like to check with you: **a missing anchor does not kill a question — the anchor is replaced and the question stays.** Conflating those two is part of what drove the earlier drift; when a collaborator went quiet, I rewrote the question instead of finding another anchor.

## 6. Q3 is the weakest link, and I would rather label it than replace it

Q3 (Article 50 transparency via science communication) is furthest from the artifact, has the least certain anchor, and is not squarely in either supervisor's field. It is the most likely to drift.

I propose keeping it and **marking it explicitly forward-looking** — not requiring a confirmed anchor before the third article. Replacing a question six weeks after sending it is exactly the move the lock exists to prevent; the label costs one sentence.

## 7. What I would ask of you

1. **Q5:** does the reframing in §4 read as a deepening or a retreat? You are the right judge of that, and it is the one change on the table.
2. **The T1–T3 criterion:** does it hold as a methodological contribution in its own right? The same falsification principle now appears in three places in my work — as a test-quality gate, as a criterion for governance claims, and here for research questions. If that is publishable as method, it changes what the first article should be.
3. **Q6 remains yours** — the transition from voluntary ESG reporting to mandatory compliance infrastructure, with the Outokumpu and construction-sector pilots as ground. Nothing in this memo changes it.

Twenty minutes whenever suits.

Best,
Risto

Risto Anton Päärni
Founder, CEO · Lifetime Oy · the Agent Outcome Company
risto.paarni@lifetime.fi · +358 400 319 010

---

# Notes for the HIC — read before sending

## What is deliberately IN

| Item | Why |
| ---- | --- |
| The lock and its mechanism | This is the strongest thing to tell a supervisor. It says *"I have stopped rewriting"* — which is the actual worry a supervisor has about a candidate with a live company |
| T1–T3 as method | Genuinely a contribution, and it is the kind a software-engineering supervisor can evaluate. It also reframes the drift as a solved problem rather than an apology |
| **Q5 failing its own test** | Volunteering that your spine question fails a criterion you invented reads as research maturity. Hiding it and having him find it reads as the opposite |
| The anchor correction (§5) | Closes the debt from the sent letter voluntarily. The internal flag from 14.07 said *"if Kari asks about those partners, say so plainly"* — this says it before he asks, which is worth more |

## What is deliberately OUT — and this is a judgement call to check

**The 1:1000 commercial assessment is not in the memo.** §4 carries only its *research* consequence: the question no longer depends on KYA achieving standard status.

Reasoning: a supervisor needs to know the research does not rest on a commercial outcome — that is a genuine research-integrity matter and it is stated. He does not need Lifetime Oy's strategy, and the strategy is explicitly still live and the vertical still unchosen (`KYA_STRATEGIC_REASSESSMENT_2026-07-25.md` is an assessment, not a decision). Communicating an unsettled strategy as settled would repeat the July looseness in a new place.

**Override this if you disagree** — the sentence to add would go at the end of §4, and it should be one sentence, not a paragraph.

## What must be verified before sending

1. **Törngren role status (§5).** The memo says the division of roles is *being settled*. If nothing has been sent to him by the time this goes out, soften to *"a division of roles I am proposing to him."* Do not state as in-progress what has not started.
2. ~~**Galaz / Universeum status.**~~ ✅ **RESOLVED 25.07.2026 (HIC):** Sweden is on holiday; neither will reply before **4.8.2026**. §5 is correct as written — "reached out, no reply" is now confirmed rather than assumed, and it will still be true on the send date.
3. **Q6 pilot names.** Outokumpu and construction pilots are stated as ground. The 14.07 record already flagged verifying pilot status before it hardens into the thesis; that flag is still open.

## Send timing — recommendation: week of 4.8, not now

Sweden is on holiday until 4.8, and Finnish academia is empty in July too. That makes the timing a real choice rather than a detail.

**Recommendation: send early in the week of 4.8.** Late enough that it is read rather than skimmed, early enough to land before the term-start flood. A memo that asks for a judgement on Q5 needs actual attention; it is the wrong thing to put into a holiday inbox.

**But send the Törngren role email now**, even though he is away. It costs nothing, it waits in his inbox, and it means the role question is *queued* rather than starting from zero on 4.8. It also makes §5 true: as drafted it says the division of roles is "being settled," and **that is not true today if nothing has been sent.** Either send it, or soften §5 to *"a division of roles I am proposing to him."* Do not leave the sentence as-is and unsent.

**What the two-week gap is actually for.** Steps 1–3 of the gate-1 sequence are all Nordic (KTH, RISE, DNV) and therefore all blocked. The two things `KYA_GATE1_IMPLEMENTER_CANDIDATES.md` v1.4 named as preconditions of step 2 are both solo work: the **conformance suite** (gate 2 — without it RISE cannot verify its own implementation and gate 1 does not close) and the **NDA delivery-package fix** (strip `LICENSE`/`NOTICE`, mark confidential). Both were going to be the reason step 2 stalls the moment RISE says yes. The blocked window is the natural slot for them.

## The RQ5 variable

| HIC decision | Action |
| ------------ | ------ |
| **Adopt v3** | Send as drafted. Then bump `PHD_RESEARCH_QUESTIONS_LOCK_v1.md` to v2 with the recorded reason — the send *is* the external act under rule 3, so the lock must be updated in the same motion, not later |
| **Keep as sent** | Delete §4 and the §7.1 ask. The memo still works: it delivers the lock, the criterion, the honest anchor status and the Q3 label |
| **Undecided** | Do not send a memo that hedges on §4. A supervisor reading *"I might change my spine question"* gets the drift signal the lock was built to remove |

## Cover note (optional, Finnish — matches the 14.07 pattern)

> Hei Kari,
>
> Lyhyt tilannepäivitys tutkimuskysymyksistä. Kuusi kysymystä on nyt lukittu ja niille on mekanismi, joka estää ajautumisen. Yksi ehdotettu muutos — Q5 — on muistion kohdassa 4, ja se on nimenomaan ehdotus enkä ole tehnyt sitä yksipuolisesti. Kohdassa 5 tarkennan ulkoisten ankkureiden tilan tarkemmin kuin heinäkuun viestissäni.
>
> Terveisin,
> Risto
