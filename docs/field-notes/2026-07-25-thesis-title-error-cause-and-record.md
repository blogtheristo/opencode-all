# Field Note — The Published Thesis Carries the Wrong Title, and Why

- **Date:** 2026-07-25
- **Author:** Risto Anton Päärni (Founder, CEO · Lifetime Oy) — via Claude Code session `claude/greg-isenberg-field-notes-a2r544`
- **Location:** Europe > Finland > Espoo
- **Context:** DWS6 — Metropolia YAMK thesis, Theseus deposit `URN:NBN:fi:amk-2026062725698`
- **Confidence:** High for the facts (HIC-confirmed cause; Drive-verified artifact). **Unknown** for correctability — explicitly left open.

## Ontology Tags

- **Geography:** Europe > EU > Finland
- **Sector:** Education > Higher_Education > Thesis publication; Governance > Records
- **Entities:** Metropolia YAMK, Theseus, `V41_Final_Thesis_FI`, `V3Thesis_FI`, backlog A9, `docs/metropolia/master-thesis/arviointi/README.md`
- **Temporal Context:** 2026-Q2 → 2026-Q3

---

## What is true

The Metropolia YAMK thesis is published, graded **5**, and permanently archived at <https://urn.fi/URN:NBN:fi:amk-2026062725698> (deposit 10.07.2026). Its cover page reads *"Omnichannel First -toimintamallin käyttöönotto Lifetime World palveluissa"*. Its abstract, on the same page range, opens: *"This thesis examines the Firehorse product manufacturing operating model, a hybrid cloud-edge architecture…"*

**The document contradicts itself on its own front matter.** That is not a metadata drift between systems — it is inside the deposited PDF.

## Why it happened — the causal chain, HIC-confirmed

Six confirmations from the HIC over the course of this session assembled the full chain, and each one narrowed it:

1. The work was **registered** under an early title. Its content moved on; the title was updated to match.
2. **The HIC misread the guidance** as requiring the final version to carry the originally registered title.
3. Acting on that reading, the HIC **"corrected" the title backwards** and submitted that version to the thesis service.
4. **The person handling the matter went on holiday.** The correction window closed without anyone closing it.
5. The wrong title therefore reached **the assessment (5.6.2026)** and then **Theseus (10.7.2026)**.

> *"hic virheellisesti tulkitsi ohjeita että työn alkuperäinen nimi tulee olla sen lopullisen version nimi."*
> *"hic vei vääräksi korjatun version thesis palveluun eikä virhettä enää korjattu."*
> *"asiaa hoitava henkilö jäi lomille eikä virhettä enää korjattu."*
> *"en tiedä voiko sitä enää korjata. virhe tuli arviointiin joka tapauksessa."*

## The scope question is now closed

Earlier in this session the archived record carried an open question: is the error only in registry metadata, or also on the cover page of the submitted PDF? It mattered, because a metadata fix is light and a re-deposit is heavy.

**Answered by the HIC:** *"2 versiota ovat identtisiä pl. kansilehdellä oleva nimi."* The error is on the **title page**, not only in registry metadata. There is one work wearing the wrong name — no second thesis, no ambiguity about which work was assessed.

**But the "identical" half of that did not survive checking.** The two thesis versions in Drive — `V4_Final_Thesis_FI` (correct title) and `V41_Final_Thesis_FI` (wrong title) — differ in fourteen places, several substantive: the TK1–TK4 headings were expanded from labels into full research questions, the recommendations were rewritten and lengthened, a conclusions paragraph was added, §5.8 was restructured from a bullet list into subsections, and two references were added. The HIC may mean a different pair — two exports of `V41` differing only in cover page — which does not exist in Drive.

The practical consequence is small and worth stating precisely: **the correction request must not tell the library "the versions are identical."** It does not need to. A stronger fact replaced it — see below.

## The document already contains its own correct title

Better than the abstract-first-line argument recorded earlier: the **Finnish abstract page of the deposited document has the right title in its Otsikko field** — *"Firehorse-tuotevalmistuksen toimintamalli: Hybridi AI-edge-arkkitehtuuri ilmastoälykkäille teollisille alustoille"* — while the cover page and the English abstract's Title field say *Omnichannel First…*

So the correction does not require supplying new text. **The correct title is already inside the deposited file**, contradicting its own cover page. That is about as cheap as a correction request gets.

## The finding that outranks the title question

The HIC then pointed at something no one had checked: *"työ joka vietiin theseus on FinalV4 ja FinalV4.1 versiot eli niihin on kirjoitettu tekstiä sisään jotka eivät ole repossa"* — *"niissä on agentic commerce luku."*

**Confirmed.** The deposited work carries **§5.4 "DWS IQ: Agentic Commerce -polku"** with seven subsections (GMC · A2A · Aegis · Themis · UCP · AP2/Stripe/Revolut · configuration table), present in **both** V4 and V4.1. Repo searches: `Agent Passport` **0 hits anywhere**, `Agentic Commerce -polku` **0**, `Themis antaa` / `Aegis myöntää` **0**; `UCP`/`AP2` appear only in `Legal/KYA_*` and the KYA spec, never in `V3Thesis_FI`. The repo's 18 `Aegis` hits are a **different referent** — the Aegis Defence product, SAR orbital detection.

Why it matters more than the name: the published chapter describes, in a permanently archived public document, an **agent identity and authorisation mechanism** — *"Aegis myöntää agentille digitaalisen Agent Passport -tunnisteen, joka valtuuttaa sen toimimaan käyttäjän puolesta"*, bound to the user's Revolut account, with Themis gating the transaction on budget, rules and ethics. That sits close to KYA's mandate-and-agent-identity territory, and it went public on 10.07.2026 **without anyone in these sessions having read it.**

This does not overturn A9's conclusion for the three named mechanisms — none of them appear in the deposited text, so their novelty still stands. It overturns something narrower and more uncomfortable: **A9 reasoned about what had been published by searching the repository, and the published document is not a repository document.** Any patentability opinion has to be given the deposited file.

## What I could not do

The HIC asked me to open the Theseus URL and compare against it. **I could not** — this environment's network policy blocks both `urn.fi` and `theseus.fi` (`CONNECT tunnel failed, response 403`). Everything above compares the **Drive sources** and the repository. The published PDF itself remains unverified from here, and checking it is a one-minute job for the HIC.

## What I got wrong along the way

Worth recording, because the correction sequence is the interesting part:

- **First reading:** I inferred from the title mismatch that `V3Thesis_FI` and the published work were **two different documents**. They are not. The inference was reasonable from the evidence available and wrong.
- **Second reading:** having learned it was one work, I assumed the error originated in **process registration** — a name inherited from a form nobody revisited. Also wrong. The name was actively changed back, by hand, on a misreading.

- **Third:** having been given the cause, I wrote *"identical except the cover page"* into the record and into a send-ready letter **without checking it**, because it came from the person who would know. It is not what the two files show. A statement is not verified by being told to you with confidence.

The first two errors share a shape: I explained an anomaly with an impersonal mechanism when the actual cause was a specific human decision at a specific moment. **Institutional artifacts fail through people, not through systems, and a record that names the mechanism instead of the decision cannot support a correction request.** The mechanism story has no one to write to. The decision story does.

The third is the more expensive one, because it was about to leave the building. It went into a letter drafted for an external institution, where a wrong claim would have been mine to withdraw in front of the party I was asking a favour of. **The verified/propagated distinction this project keeps writing standards about failed at the one point it was pointed outward.**

## What follows

- **A9 (patent window) is unaffected.** The controlling fact is the date, not the name: the deposit (10.07.2026) precedes §10.26/§10.27 by fifteen days, so those mechanisms cannot be in the published work under any title. Nothing in the naming question moves that.
- **Correctability is genuinely open.** The route is the Metropolia library, not Theseus (*"Myös mahdolliset muutokset tehdään siellä."*). The question to them is two-part: can the cover page be fixed in the deposited file, and if not, can the record's title metadata be fixed. The error **has already reached the assessment** — that part is a fact, not a risk to be managed.
- **The self-contradiction is an asset for the request.** A correction that must be argued from external evidence is weak; one that can be shown from page 1 against page 2 of the same file is not. Whoever reviews the request can verify it without leaving the document.
- **If it cannot be fixed,** the archived record (`docs/metropolia/master-thesis/arviointi/README.md`, v1.1) is the standing explanation — so the LUT application can dispose of the mismatch in one sentence and a link instead of a paragraph of apology.

## Rule this earns

**When a public, permanent record is wrong, record the decision that made it wrong — not just the discrepancy.** A discrepancy is a fact about two strings. A decision has an owner, a date, a reason, and a moment where a different choice was available. Only the second one is actionable, and only the second one keeps a person from repeating it.
