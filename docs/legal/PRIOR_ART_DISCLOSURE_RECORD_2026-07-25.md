# Prior-Art Disclosure Record — What Lifetime Oy Has Already Published

**Status: INTERNAL. Not legal advice. Prepared for handover to counsel or an NDA'd technical panel.**

***

# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:

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

## 7. Correction history

This record exists because the earlier analysis was wrong about its own evidence base, not about its conclusions. A9's substantive finding — that the three named mechanisms retain novelty — **survives**. What failed was the method: disclosure was inferred from the working copy rather than from the published artifact. The rule extracted from it is recorded in `kb/wiki/concepts/institutional-record-errors.md`: **when the question is "what has been disclosed", search the disclosed artifact.**

## Related

- `docs/backlog/BACKLOG_UNDONE_2026-07-24.md` — A9, D5
- `docs/metropolia/master-thesis/arviointi/README.md` v1.2 — the archived record
- `docs/field-notes/2026-07-25-thesis-title-error-cause-and-record.md`
- `standards/kya-open/SPEC.md` §5, §8
