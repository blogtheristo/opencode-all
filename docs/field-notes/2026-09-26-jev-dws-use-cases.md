# Jev (TypeSafe AI) — DWS IQ use-case recommendations

---

# VERSION AND AGENT HISTORY

Version: 1.1

Sessions & Modifications:

- Version: 1.1 | Tool: GitHub Copilot CLI 1.0.88 | Session: opencode/b3-2125 | Date: 27.09.2026 | Changes: Added DWS Document Standard metadata during PR #2125 review.
- Version: 1.0 | Tool: Claude Code 2.1.283 | Session: claude/jev-api-tools-iu40re | Date: 26.09.2026 | Changes: Initial research note.

Document Status:

- Created: 26.09.2026
- Last Modified: 27.09.2026
- Language: Finnish
- Languages Available: Finnish
- Publication Status: ACTIVE
- Status: PENDING_REVIEW

---

- **Date:** 2026-09-26
- **Author:** Risto Anton Päärni
- **Location:** DWS6 repository
- **Context:** Jev decision-layer use cases for DWS IQ and the `/browse` step-advisor pilot.

## Ontology Tags

- **Geography:** Europe > Finland
- **Sector:** Software > AI Governance
- **Entities:** Jev, TypeSafe AI, KYA+I, DWS IQ
- **Systems:** `src/agents/kya-jev.ts`, `src/agents/browse-step-kya-jev.ts`
- **Temporal Context:** 2026-Q3
- **Confidence:** Mixed; verified claims and explicit unverified limitations are separated in the note.

**Päivä:** 2026-09-26
**Laatija:** Risto Anton Päärni (kooste, verified via WebSearch — x.com itself is proxy-blocked in this session)
**Status:** PENDING_REVIEW
**Edellinen muistio:** `docs/field-notes/2026-09-21-jev-api-tools.md` (20 community-projektin lista)

## Mikä Jev on (varmennettu)

TypeSafe AI:n "system one" -päätösmalli (Kahneman-termistö: system one = nopea/halpa/automaattinen, system two = LLM = hidas/analyyttinen). Jev ei kirjoita tekstiä — se **päättää seuraavan askeleen**: reititys, suodatus, go/no-go, relevanssi. Julkiset suorituskykyväitteet (TypeSafe, ei riippumattomasti auditoitu): jopa 193x nopeampi, 444x halvempi kuin Claude Fable 5.1 / GPT-6 Astra samassa päätöspisteessä. Tuotantokäyttöjä: Vercel (fx auto-mode safety reviewer), LangChain (AutoModeMiddleware), RAG-chunk-suodatus per Sydney Runkle.

Lähteet: [Sydney Runkle @sydneyrunkle](https://x.com/sydneyrunkle/status/2102058954482225520), [Matt Van Horn recap](https://x.com/mvanhorn/status/2100788572316139655), [codila @0xCodila](https://x.com/0xCodila/status/2100984487802708306), [Made with Jev](https://madewithjev.com/), [Ciyo: Jev in an Agent Loop](https://ciyo.ai/blog/jev-agent-loop-decision-layer).

## Suositellut DWS IQ -käyttötapaukset (uusia, ei päällekkäisiä 20-listan kanssa)

| #   | DWS-kohde                                                             | Jev-rooli                                                                                                            | Hyöty                                                                                                           |
| --- | --------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| 1   | `authorizeToolCall()` (KYA tool-call gate, `src/agents/BaseAgent.ts`) | Jev tekee ensimmäisen nopean allow/deny/escalate-päätöksen ennen kalliimpaa KYA-verdiktiä                            | Latenssi + kustannus alas jokaisessa työkalukutsussa — suorin osuma "system one ennen system two" -malliin      |
| 2   | `/compliance-check`, `/regulatory-radar`                              | Jev esisuodattaa saapuvat EU-regulaatiosignaalit (EUR-Lex, EFRAG) → vain relevantit menevät LLM-analyysiin           | Vähentää turhaa mallikutsua massadatavirrassa                                                                   |
| 3   | `/helpdesk-triage`                                                    | Jev luokittelee tiketin kiireellisyyden/kategorian ennen kuin Helpdesk-agentti kirjoittaa vastausluonnoksen          | Nopeampi triage, LLM vain siellä missä tarvitaan kirjoitustyötä                                                 |
| 4   | `/site-safety` (SiteSense), edge-control-room-capital                 | Jev reaaliaikaisena go/no-go-kerroksena sensoridatalle (tuuli/nosturi-kynnys) ennen LLM-selostusta                   | Sopii fyysiseen sense-and-actuate-substraattiin — päätös millisekunneissa, ei mallikutsua joka sensorilukemalle |
| 5   | `/kb` RAG-haku                                                        | Jev suodattaa haetut chunkit relevanssin mukaan ennen synteesiä (sama kuvio kuin Sydney Runklen LangChain-esimerkki) | Pienempi konteksti → halvempi + tarkempi vastaus                                                                |
| 6   | `/truth-check`                                                        | Jev esiseulontaa lauseet: "tarvitsee syvätarkistuksen" -lippu ennen LLM-lintausta                                    | Skaalautuu suurille sisältömäärille (blogit, myyntimateriaali)                                                  |
| 7   | `/cron`, `/workflow` mallireititys                                    | Jev päättää DGX-vs-pilvi-tason per job (linjassa Cost Governance -säännön DGX-first-periaatteen kanssa)              | Deterministinen reititys ilman LLM-kutsua reititykseen itseensä                                                 |
| 8   | `/investor-outreach` triage                                           | Jev esiluokittelee saapuvat intro-viestit (ready/followup/skip) ennen LLM-vastausluonnosta                           | Nopeampi putki suurella volyymilla                                                                              |

## Ei suositella (vielä)

- Tuotantoon asti kriittiset päätökset (esim. RED-zone migraatioiden hyväksyntä, laskutuspäätökset) — Jev on kolmannen osapuolen, auditoimaton "system one"; pidä HIC/KYA-portti näissä kunnes malli on riippumattomasti evaluoitu.
- Ei korvaa `code-reviewer`/`security-reviewer`-agentteja — Jev on reititin/suodatin, ei syväanalyysi.

## Varaukset

- x.com esti WebFetch-yhteyden tässä sessiossa (proxy); tiedot varmennettu WebSearchin kautta toisen käden lähteistä (Substack, Medium, Ciyo, madewithjev.com) — ei suoraa alkuperäistekstiä X-postauksista.
- Suorituskykyluvut (193x/444x) ovat TypeSafe AI:n omia, ei riippumattomasti toistettuja.

N/A — KB/HTML-render/Drive-export ohitettu: tutkimusmuistio, ei koodimuutos.

---

Version 1.1 · 27.09.2026
Copyright © 2026 Lifetime Oy
Classification: INTERNAL
