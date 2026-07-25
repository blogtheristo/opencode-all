# Prior-Art Disclosure Record — What Lifetime Oy Has Already Published

**Status: INTERNAL. Not legal advice. Prepared for handover to counsel or an NDA'd technical panel.**

***

# VERSION AND AGENT HISTORY

Version: 1.1

Sessions & Modifications:

- Version: 1.1 | Tool: Claude Code | Session: claude/greg-isenberg-field-notes-a2r544 | Date: 25.07.2026 | Changes: Lisätty §7 — **harkittu ja hylätty** ehdotus tehdä patenttisuojaan liittyviä muutoksia korjattuun PDF:ään. Poisto ei palauta uutuutta (EPC 54 art. koskee hakemuspäivää edeltävää tilaa; 55 art. poikkeukset eivät sovellu), ja se tekisi kirjastolle annetusta lausumasta *"sisältöön ei ole tehty muutoksia"* valheellisen sekä korvaisi arvioidun työn toisella. Kirjattu tilalle se, mikä on yhä auki: kolmen mekanismin hakemus, mahdollinen **US 12 kk armonaika (35 USC 102(b)(1))** noin 10.07.2027 asti, ja liikesalaisuusreitti erillisenä rehellisenä pyyntönä.
- Version: 1.0 | Tool: Claude Code | Session: claude/greg-isenberg-field-notes-a2r544 | Date: 25.07.2026 | Changes: Created on HIC instruction *"Heti"* — record immediately and in writing that the deposited Metropolia YAMK thesis publicly discloses an agent identity-and-authorisation mechanism as of 10.07.2026, a fact discovered 25.07.2026 and absent from every prior A9 analysis. Establishes the standing artifact that travels with any future patentability engagement, and records the distribution hold that prevents it being sent to LUT innovation services before the 369/2006 question is resolved.

***

## Why this document exists

Backlog item **A9** (patent window) reasoned about what Lifetime Oy had disclosed **by searching this repository**. That method was wrong. The Metropolia master's thesis was deposited in Theseus on **10.07.2026** and is permanently public — and it contains a chapter that appears in **no repository file**. Nobody in the sessions that produced A9 had read the deposited document.

This record fixes the disclosure baseline in writing, dated, before any further work is stacked on the earlier assumption.

## 1. The published artifact

| Field | Value |
| ----- | ----- |
| Work | Metropolia AMK master's thesis (insinööri, ylempi AMK), Smart Factory |
| Author | Risto Anton Päärni |
| Deposited | **10.07.2026** |
| Permanent identifier | <https://urn.fi/URN:NBN:fi:amk-2026062725698> |
| Published title | *Implementation of the Omnichannel First operating model in Lifetime World services* (cover-page title is an error — see `docs/metropolia/master-thesis/arviointi/README.md`) |
| Source versions | `V4_Final_Thesis_FI`, `V41_Final_Thesis_FI` (Google Drive) |
| Access | Public, permanent, indexed |

**Verification caveat, stated plainly:** the deposited PDF itself was **not** opened during this analysis — the working environment's network policy blocks `urn.fi` and `theseus.fi` (`CONNECT 403`). The findings below come from the **Drive source versions** the HIC identified as the deposited ones. **Counsel should be given the Theseus file, and any discrepancy between it and the Drive versions treated as controlling.**

## 2. What is disclosed — §5.4 "DWS IQ: Agentic Commerce -polku"

Present in **both** V4 and V4.1, so it was in the work throughout, not a late insert. Seven subsections:

| § | Subject |
| - | ------- |
| 5.4.1 | Inventory and data: Google Merchant Center |
| 5.4.2 | Discovery: A2A (agent-to-agent interoperability) |
| 5.4.3 | **Identity: "Aegis" (security)** |
| 5.4.4 | **Rules: Themis (governance)** |
| 5.4.5 | Comprehension: UCP (Universal Commerce Protocol) |
| 5.4.6 | Transaction: AP2 (payment via Stripe & Revolut) |
| 5.4.7 | Consolidated DWS IQ configuration table |

**The patent-relevant passages, verbatim from the deposited text:**

> *"Turvallisuuden takaa **Aegis**-kerros. Agentti todentaa identiteettinsä Aegiksen kautta, joka linkittää agentin käyttäjän **Revolut-tiliin**. Aegis myöntää agentille digitaalisen **Agent Passport** -tunnisteen, joka valtuuttaa sen toimimaan käyttäjän puolesta turvallisesti."*

> *"**Themis** toimii prosessin valvojana. Se tarkistaa reunaehdot GMC-datasta: onko tuote saatavilla ja vastaako hinta käyttäjän asettamaa budjettia. Themis antaa dynaamisen 'vihreän valon' transaktiolle vain, jos kaikki eettiset, lailliset ja liiketoiminnalliset säännöt täyttyvät."*

In substance, the deposited work publicly describes: **an identity layer issuing a credential ("Agent Passport") that authorises an autonomous agent to act on a user's behalf, bound to that user's payment account, with a separate governance layer gating each transaction against budget, legal and ethical rules before execution.**

That is adjacent to KYA's mandate-and-agent-identity territory. **Whether it anticipates any specific claim is a question for counsel — this record does not decide it.**

## 3. What is NOT disclosed — verified

The three mechanisms A9 identifies as potentially patentable were searched for in the deposited text and the repository:

| Mechanism | In the deposited work? |
| --------- | ---------------------- |
| Three-asset separation (track record→tenant, accountability→moment, configuration→contract) | **No** |
| Leaver mandate sweep on `IDENTITY_REVOKED` | **No** |
| Pseudonymous `hic` binding reconciling GDPR Art. 17 erasure with Art. 12 append-only retention | **No** |

These were written on 25.07.2026 — fifteen days **after** deposit — and cannot be in it. **EPC Art. 54 novelty for these three is unaffected by this record.**

## 4. Evidence that §5.4 is not in the repository

| Search string | Hits across the entire repository |
| ------------- | --------------------------------- |
| `Agent Passport` | **0** |
| `Agentic Commerce -polku` | **0** |
| `Themis antaa` | **0** |
| `Aegis myöntää` | **0** |
| `UCP` / `AP2` | only `Legal/KYA_*` and `standards/kya-open/SPEC.md` — **never** in `V3Thesis_FI` |
| `Aegis` in `V3Thesis_FI` | 18 hits, all the **Aegis Defence** product (SAR orbital detection) — a different referent |

**Consequence for any future analysis:** `V3Thesis_FI` is not the deposited work. A patentability or freedom-to-operate opinion run against the repository will systematically miss §5.4.

## 5. Instruction to whoever gives the opinion

1. **Work from the Theseus file**, not from `V3Thesis`, not from this repository.
2. Treat **10.07.2026** as the disclosure date for everything in §5.4.
3. The three mechanisms in §3 are **separate subject matter** with a clean novelty position; do not let §5.4 contaminate the assessment of them.
4. Assume nothing about `V3Thesis` §10.26/§10.27 being published — they are not, and the repository is private (verified 25.07.2026).

## 6. ⚠️ Distribution hold — read before sending this anywhere

This record is written to be handed over. **It has not been sent to anyone**, and two constraints govern who may receive it:

- **LUT innovation services — HOLD.** A9 flags Finland's *Act on the Right in Inventions made at Higher Education Institutions* (**369/2006**). The founder is a LUT doctoral candidate; describing these mechanisms to LUT's technology-transfer office could surface or strengthen a LUT claim over IP simultaneously being assigned to Lifetime Oy. **Resolve 369/2006 first.** The free-review route is not free until that is answered.
- **Technical panel (Törngren / KTH TECoSA) — permitted under NDA only.** Disclosure under an obligation of confidence is not "made available to the public" under EPC Art. 54. Under NDA this record may be shared immediately; without one it must not.
- **Kari Smolander (LUT)** stays on thesis and research scope. Do not route IP questions through a doctoral supervisor.

## 7. ⛔ Considered and rejected: redacting §5.4 in the corrected PDF

**Proposal (HIC, 25.07.2026):** since the PDF is being corrected anyway, also make patent-protective changes to the text.

**This does not work, and it converts a clean request into a risky one.** Not legal advice — but the reasoning is not close enough to need counsel to reject it.

### It does not restore novelty

The work has been **publicly available since 10.07.2026**. Under EPC Art. 54 the state of the art is everything made available to the public **before the filing date** — it is not a description of what is available *today*. Withdrawing a document does not remove it from the state of the art; the disclosure is a completed historical event. Practically, the file has also been indexed, harvestable and downloadable for over two weeks (Theseus feeds Finna and search engines).

**EPC Art. 55 does not help.** Non-prejudicial disclosures are limited to evident abuse against the applicant and to display at an official international exhibition. Neither applies to a voluntary thesis deposit.

So the redaction buys **nothing** on the European patent side, which is the side that has no grace period.

### It creates a real problem where none exists

The thesis was **assessed on 5.6.2026 with §5.4 in it** and graded 5. The correction request tells the library, truthfully:

> *"Työn sisältöön, tuloksiin tai johtopäätöksiin ei ole tehty muutoksia, eikä arviointiin pyydetä muutosta."*

Removing a substantive chapter makes that sentence **false**, and submits a materially different work in place of the assessed one. That is no longer a formatting correction — it is a silent substitution of the graded artifact, requested from an institution that has just done the author a favour on trust. The downside is not a patent outcome; it is the integrity of a degree record and a relationship with the awarding institution.

**Do not blend the two.** The front-matter correction is easy, honest and already offered. Mixing an undisclosed motive into it risks the correction itself.

### What is actually still available

1. **The three named mechanisms are unaffected** and remain the real patent asset (§3). They are not in the deposited text. The action there is a **filing**, not a redaction.
2. **The US door may still be open for §5.4 subject matter.** 35 USC 102(b)(1) provides a **12-month grace period for the inventor's own disclosure** — so a US filing by roughly **10.07.2027** may still be possible on subject matter that EP has already lost. **Verify with counsel; jurisdictions differ and the grace period has conditions.** This is worth checking precisely because it is the one live option the redaction idea was reaching for.
3. **If the concern is trade secret rather than patent** — i.e. §5.4 reveals something that should not be public at any price — that is a **different request, made honestly as such**: a restriction or takedown request to the library, stating plainly that the author wishes to limit availability. It still does not restore novelty. It only limits further spread, and the copies already taken are gone.

**Recorded so the idea does not resurface as a good one.** It is a reasonable instinct — the cost of the disclosure is real — but the mechanism it assumes (unpublishing undoes publication) does not exist in patent law.

## 8. Correction history

This record exists because the earlier analysis was wrong about its own evidence base, not about its conclusions. A9's substantive finding — that the three named mechanisms retain novelty — **survives**. What failed was the method: disclosure was inferred from the working copy rather than from the published artifact. The rule extracted from it is recorded in `kb/wiki/concepts/institutional-record-errors.md`: **when the question is "what has been disclosed", search the disclosed artifact.**

## Related

- `docs/backlog/BACKLOG_UNDONE_2026-07-24.md` — A9, D5
- `docs/metropolia/master-thesis/arviointi/README.md` v1.2 — the archived record
- `docs/field-notes/2026-07-25-thesis-title-error-cause-and-record.md`
- `standards/kya-open/SPEC.md` §5, §8
