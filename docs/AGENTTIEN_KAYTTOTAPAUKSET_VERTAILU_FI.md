# Agenttien käyttötapaukset — Copilot-agentti, DWS IQ Skilled Agents ja yhden dashboardin hallintamalli

***

# VERSION AND AGENT HISTORY

Version: 1.1

Sessions & Modifications:

- Version: 1.1 | Tool: Claude Code (Opus 5) | Session: claude/agent-use-cases-comparison-h7vl25 | Date: 08.08.2026 | Changes: §4 KYA-kytkentä päivitetty KYA-S1 v1.3:n mukaiseksi — TRS-4 (atominen auktorisointisidos, Lease Token) ja PRV-4 (ihmisen päätöksen provenienssi) lisätty vaihekartan hallintariville. Korjattu VERSION AND AGENT HISTORY -lohkon delimiter `---` → `***` (CLAUDE.md Markdown Delimiter Rule; linter oli muuntanut sen).
- Version: 1.0 | Tool: Claude Code (Opus 5) | Session: claude/agent-use-cases-comparison-h7vl25 | Date: 07.08.2026 | Changes: Ensimmäinen versio — yhden A4:n vertailu (1) Claude Code -agentti vs GitHub Copilot coding agent, (2) Claude Code -agentti vs DWS IQ Skilled Agents; HIC:n ehdotus Copilot-tyylisestä yhden dashboardin hallintamallista DWS IQ:hun; RUP-pohjainen vaihe × tieteenala -prosessikartta agenttivalintaa varten.

Session Links & References:

- Claude Code (claude/agent-use-cases-comparison-h7vl25): https://github.com/blogtheristo/dws6/commits/claude/agent-use-cases-comparison-h7vl25
- View on GitHub: https://github.com/blogtheristo/dws6/blob/main/docs/AGENTTIEN_KAYTTOTAPAUKSET_VERTAILU_FI.md

Document Status:

- Created: 07.08.2026
- Last Modified: 08.08.2026
- Language: Finnish
- Languages Available: Finnish
- Publication Status: ACTIVE
- Classification: INTERNAL — STRATEGY
- Document Type: Vertailu / Arkkitehtuuriehdotus (1×A4)

Related Documents:

- AGENTS.md §8 (Managed Agent Backends — Claude Managed Agents vs. DGX Managed Agents)
- AI_AGENT_GUIDELINES.md (BaseAgent, autonomiatasot, kustannusbudjetit, Ledger-Native Output Contract)
- docs/AGENT_DRIVEN_SDLC_PLAYBOOK.md (agenttivetoinen SDLC)
- docs/Deputy-Agents-Architecture.md (Godagent, KYA-portti)
- skills/manifest.json (skill-rekisteri, pintatuki)
- docs/CEO_REVIEW_N8N_VS_LUO_VS_CLAUDE_CODE.md (talon vertailutyyli)
- `Legal/KYA_S1_v1.3.md` (korjattu KYA-S1 — TRS-4/TRS-5/PRV-4/TC4-5/FLT-4; `Legal/KYA_S1.md` on yhä v1.2)
- `Legal/KYA_S1_REVIEW_v1.3_PROPOSAL.md` (löydökset, Osa A + Osa B)

***

**Oletus (Sääntö 1):** "agentti" = tässä sessiossa ajossa oleva **Claude Code -agentti** (Claude Agent SDK / CLI, myös web- ja pilvisessiona). Vertailukohdat: GitHub Copilot coding agent ja DWS IQ:n 50 tuotantoagenttia.

***

## 1. Claude Code -agentti vs GitHub Copilot coding agent

| Ulottuvuus         | Claude Code -agentti                                                | GitHub Copilot coding agent                                                      |
| ------------------ | ------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| **Käynnistys**     | Chat, CLI, `/skill`, cron, webhook — vapaa                          | Issue → _assign to Copilot_, tai PR-kommentti. Työ syntyy aina GitHub-objektista |
| **Työtila**        | Mikä tahansa repo, tiedostojärjestelmä, MCP-työkalut, verkko        | Ephemeral GitHub Actions -sandbox, yksi repo, pääsy rajattu palomuurilla         |
| **Lopputuote**     | Vapaamuotoinen: commit, dokumentti, analyysi, sähköposti, migraatio | Aina **draft PR** — yksi ja sama artefakti                                       |
| **Hallintamalli**  | Sessio + hookit + oikeusmoodi (GREEN/YELLOW/RED)                    | **Issue-työjono + PR-review-portti**, GitHub-oikeudet, branch protection         |
| **Näkyvyys**       | Sessioloki, `.claude/hooks/audit/`                                  | Työn tila näkyy GitHubin UI:ssa kaikille — jono, ajo, diff, CI                   |
| **Rinnakkaisuus**  | Subagentit, worktree-eristys                                        | N agenttia N issuella, itsestään rinnakkain                                      |
| **Ihmisen portti** | Sopimuksellinen (CLAUDE.md, hookit)                                 | **Rakenteellinen** — agentti ei voi mergetä itse                                 |
| **Vahvuus**        | Laaja toimivalta, monta työkalua, ei repo-sidonnaisuutta            | Kuria: yksi jono, yksi artefakti, yksi hyväksymisportti                          |
| **Heikkous**       | Hallinta on ohjeistusta, ei rakennetta                              | Kapea: vain koodi, vain PR, vain GitHub                                          |

**Johtopäätös:** Copilotin arvo ei ole mallissa vaan **hallintapinnassa** — työjono, näkyvä tila ja pakotettu ihmisportti. Se on kopioitava osa.

## 2. Claude Code -agentti vs DWS IQ Skilled Agents

| Ulottuvuus         | Claude Code -agentti                                | DWS IQ Skilled Agents (50 kpl)                                             |
| ------------------ | --------------------------------------------------- | -------------------------------------------------------------------------- |
| **Luonne**         | Yleisagentti — osaa mitä tahansa, ei mitään taattua | Kapea toimiala-asiantuntija (`BaseAgent`-perijä), taattu I/O-sopimus       |
| **Osaaminen**      | Kontekstista                                        | Rooli + toimiala: SiteSense, Material Oracle, Compliance, Aegis, Themis, … |
| **Ulostulo**       | Vapaamuotoinen                                      | **Ledger-Native**: `journalEntries` + `regulatoryArtifact` + lineage       |
| **Autonomia**      | Sessiokohtainen oikeusmoodi                         | Porrastettu: `silent_pilot` → `advisor` → `autonomous`                     |
| **Auditointi**     | Sessioloki                                          | `agent_executions` + hash-ketju, EU AI Act Art. 12                         |
| **Turvaportti**    | Hookit                                              | **KYA** (Know Your Agent) -pisteytys ja Leash Snap                         |
| **Ajoalusta**      | Anthropic-pilvi                                     | DGX Spark (Suomi), ei CLOUD Act -altistusta                                |
| **Mittari**        | —                                                   | MGD (Monthly Governed Decisions), CRC                                      |
| **Rooli mallissa** | **Orkestroija / kapellimestari**                    | **Soittimet** — valitaan tarpeen ja työvaiheen mukaan                      |

**Johtopäätös:** Nämä eivät kilpaile. Claude Code -agentti on se, joka _valitsee ja ketjuttaa_; Skilled Agents ovat se, mikä _tuottaa auditoitavan tuloksen_.

## 3. HIC:n ehdotus — Copilot-hallintamalli DWS IQ:hun

**Yksi dashboard, jossa työnkulku käynnistetään ja agentit valikoituvat itse.**

```
HIC → [Uusi työnkulku] ──► Jono (issue-tyylinen työkortti)
                             │
                             ▼
                    ORKESTROIJA (reitittää)
                             │
        ┌────────────┬───────┴───────┬────────────┐
        ▼            ▼               ▼            ▼
   Compliance   Material Oracle   SiteSense    Aegis/KYA
        └────────────┴───────┬───────┴────────────┘
                             ▼
                  Ledger-Native koonti + lineage
                             │
                             ▼
              ◆ HIC-PORTTI (hyväksy / hylkää) ◆   ← ei ohitettavissa
                             │
                             ▼
                   Julkaisu · MGD-kirjaus · Art. 12
```

Copilotista otetaan **kolme rakenteellista asiaa**: (1) työ syntyy näkyvänä työkorttina jonoon, (2) tila on julkinen koko ajon ajan, (3) mitään ei julkaista ilman ihmisen porttia. Copilotista **ei** oteta yhden artefaktin (PR) rajoitusta — DWS IQ:n tuote on säädösartefakti, ei diff.

**Agenttivalinta on koodia, ei mallia (Sääntö 5).** Reititys tehdään toimialan, työvaiheen ja skill-rekisterin (`skills/manifest.json`) perusteella deterministisesti; malli käyttää harkintaa vain silloin, kun tehtävän luokittelu on aidosti tulkinnanvaraista.

## 4. RUP-prosessikartta — vaihe × tieteenala → agentti

Teollisuudessa tunnettu RUP-kehys antaa dashboardille valmiin, tutun kartan: rivit ovat tieteenaloja (disciplines), sarakkeet vaiheita (phases), ja solu kertoo **mikä agentti aktivoituu ja kuinka voimakkaasti**. Tämä on sekä prosessikaavio ihmiselle että reititystaulu koneelle.

| Tieteenala (discipline)   | Inception                      | Elaboration                     | Construction                 | Transition               |
| ------------------------- | ------------------------------ | ------------------------------- | ---------------------------- | ------------------------ |
| **Business Modeling**     | ██ Industry Analyst, Viability | ▓ Viability                     | ░                            | ░                        |
| **Requirements**          | ▓ Regulatory Radar             | ██ Compliance, Regulatory Radar | ░                            | ░                        |
| **Analysis & Design**     | ░                              | ██ Material Oracle, Daedalus    | ▓ Designer                   | ░                        |
| **Implementation**        | ░                              | ▓                               | ██ Rakentavat agentit + Loop | ▓                        |
| **Test / Verification**   | ░                              | ▓ QA                            | ██ QA, Auditor               | ▓ Auditor                |
| **Deployment**            | ░                              | ░                               | ▓                            | ██ Themis (koordinointi) |
| **Config & Change Mgmt**  | ▓                              | ▓                               | ██                           | ▓                        |
| **Governance (DWS-lisä)** | ▓ KYA                          | ▓ KYA                           | ▓ KYA + Art. 12              | ██ **HIC-portti**        |

Merkinnät: ██ pääaktiivinen · ▓ tukiroolissa · ░ lepää. Alin rivi on DWS:n oma lisäys RUP:iin: **hallinta kulkee jokaisen vaiheen läpi**, eikä työnkulku sulkeudu ennen HIC-porttia.

**KYA-kytkentä vaiheittain** (`Legal/KYA_S1_v1.3.md` §5–6): Inception sitoo ihmisen sessioon (**IDV**) ja rekisteröi agentin kyvykkyysmanifestin (**REG**); Elaboration ja Construction pitävät valtuutusta yllä jatkuvasti (**TRS**) ja säilyttävät hätäjarrun koko ketjulle (**TC4** — leash snap); Transition tuottaa toistettavan päätösjäljen (**PRV**) ja vikaattribuution (**FLT**).

**v1.3:n kaksi lisäystä koskevat suoraan tätä dashboardia.** **TRS-4** kieltää pistemäärää auktorisoimasta tekoa suoraan: portti antaa kertakäyttöisen, aikaan sidotun tokenin, jonka agenttivaihe kuluttaa atomisesti — muuten tarkistuksen ja suorituksen väliin jää rako, jossa HIC-valvonta on näennäistä. **PRV-4** vaatii, että myös ihmisen kuittaus perusteluineen kirjautuu; pelkkä agenttipolun lokitus jättää Artikla 14:n todisteen puuttumaan.

## 5. Ensimmäinen askel (ehdotus)

Yksi työnkulkutyyppi, yksi toimiala, koko putki päästä päähän: **työkortti → reititys → 3 agenttia → koonti → HIC-portti**. Vasta kun tämä tuottaa mitattavan MGD-rivin, dashboardiin lisätään toinen työnkulkutyyppi.

***

## Liite A — Muut teollisuuden prosessikuvaustavat (ei mahdu A4:lle)

RUP/UML on kehityksen kieli. Teollisuusasiakas kuvaa prosessinsa useammalla vakiintuneella tavalla, ja jokainen niistä kiinnittyy eri kohtaan agenttiarkkitehtuuria:

| Menetelmä              | Ensisijainen taso           | Kytkentä DWS IQ -agentteihin ja HIC-valvontaan                                                                                                                                            |
| ---------------------- | --------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **BPMN 2.0**           | Työnkulut & automaatio      | Suoraan suoritettavaa prosessimoottorissa (Camunda/Flowable/Zeebe). Agentti = _Service Task_; poikkeama reitittyy _User Taskiksi_ = HIC-portti. Paras kandidaatti dashboardin ajokieleksi |
| **VSM (Lean)**         | Materiaali- ja tietovirrat  | Osoittaa hukat ja manuaalityön kohdat — investointilaskelma sille, mihin agentti kannattaa asentaa                                                                                        |
| **ISA-95 / IEC 62264** | Järjestelmäarkkitehtuuri    | Määrittelee agentin toimintatason (ERP / MES / SCADA / PLC) ja siten sen valtuudet ja reagointiajat — **REG-2**-kyvykkyysmanifestin luonnollinen lähde                                    |
| **SysML**              | Kyber-fyysiset järjestelmät | Mallintaa laitteen ja agentin yhteispelin: fyysiset turvarajat ja tilakoneet, kun agentti koskee tuotantolinjaan                                                                          |
| **SIPOC**              | Laadunhallinta & rajaus     | Rajaa prosessin syötteet ja tuotokset — varmistaa, että agentin data ja lopputulos täyttävät **PRV**/**FLT**-auditointivaatimukset                                                        |
| **RUP / UML**          | Järjestelmäkehitys          | Vaihe × tieteenala -kartta (§4) + sekvenssikaaviot agenttien väliselle viestinnälle                                                                                                       |

**Suositus (Sääntö 7 — nosta ristiriita, älä keskiarvoista):** älä tue kaikkia kuutta. Valitse **BPMN 2.0 dashboardin suoritusmuodoksi** (se on ainoa ajettava) ja **RUP/UML esitysmuodoksi** ihmiselle. ISA-95 tulee mukaan valtuustasona, ei kaaviona. VSM, SysML ja SIPOC ovat myyntivaiheen työkaluja — ne kertovat _mihin_ agentti asennetaan, eivät miten se ajetaan.
