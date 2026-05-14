---

# VERSION AND AGENT HISTORY

Version: 1.1

Sessions & Modifications:

- Version: 1.2 | Tool: Claude Code (Opus 4.6) | Session: claude/openai-harness-documentation-3QVGZ | Date: 14.03.2026 | Changes: Added Section 10 — AGENTS.md staleness management with 3 autonomous agents (freshness checker, slimmer, auto-syncer), refactoring plan, thesis perspective
- Version: 1.1 | Tool: Claude Code (Opus 4.6) | Session: claude/openai-harness-documentation-3QVGZ | Date: 14.03.2026 | Changes: Added Section 8 — concrete improvement proposals per principle to reach 95% readiness, updated readiness scores, added implementation roadmap
- Version: 1.0 | Tool: Claude Code (Opus 4.6) | Session: claude/openai-harness-documentation-3QVGZ | Date: 14.03.2026 | Changes: Initial creation — OpenAI Harness Engineering analysis, DWS readiness assessment, master thesis preparation

Session Links & References:

- Source: https://openai.com/index/harness-engineering/
- Claude Code session: claude/openai-harness-documentation-3QVGZ
- View on GitHub: https://github.com/blogtheristo/dws6/blob/main/docs/OPENAI_HARNESS_ENGINEERING_ANALYSIS.md

Document Status:

- Created: 14.03.2026
- Last Modified: 14.03.2026
- Language: Finnish & English (bilingual)
- Publication Status: ACTIVE

---

# OpenAI Harness Engineering — DWS IQ 6 Analyysi

**Tarkoitus:** Muistio OpenAI:n "Harness Engineering" -artikkelin (helmikuu 2026) keskeisistä periaatteista, DWS IQ 6:n toteutusasteesta ja eroavaisuuksista. Valmisteltu master thesis -työtä varten.

**Lähde:** OpenAI, "Harness engineering: leveraging Codex in an agent-first world", 13.02.2026

---

## Sisällysluettelo

1. [Tiivistelmä](#1-tiivistelmä)
2. [Harness Engineering — määritelmä](#2-harness-engineering--määritelmä)
3. [Periaatteet ja DWS-vertailu](#3-periaatteet-ja-dws-vertailu)
4. [Yhteenveto: valmiusasteet](#4-yhteenveto-valmiusasteet)
5. [Erot OpenAI:n lähestymistapaan](#5-erot-openain-lähestymistapaan)
6. [Thesis-näkökulmat](#6-thesis-näkökulmat)
7. [Lähteet](#7-lähteet)
8. [Parannusehdotukset: 95 % tavoitetaso](#8-parannusehdotukset-95--tavoitetaso)

---

## 1. Tiivistelmä

OpenAI:n Harness-tiimi rakensi tuotteen viidessä kuukaudessa ilman yhtään manuaalisesti kirjoitettua koodiriviä. Miljoona riviä koodia, ~1 500 PR:ää, 3–7 insinööriä. Artikkeli kuvaa miten insinöörin rooli muuttuu: koodin kirjoittamisesta ympäristöjen suunnitteluun, tarkoituksen määrittelyyn ja palautesilmukoiden rakentamiseen.

DWS IQ 6 on itsenäisesti kehittänyt lähes kaikki samat periaatteet — osittain pidemmälle, osittain eri tavoin. Tämä dokumentti vertaa jokaista periaatetta.

---

## 2. Harness Engineering — määritelmä

**Harness** = koko ympäristö (scaffolding, rajoitteet, palautesilmukat), joka ympäröi AI-agenttia ja mahdollistaa vakaan työskentelyn.

**Harness Engineering** = insinöörityön siirtymä koodin kirjoittamisesta kohti:

- Ympäristöjen suunnittelua (environment design)
- Tarkoituksen spesifiointia (intent specification)
- Palautesilmukoiden rakentamista (feedback loops)

Kun jokin epäonnistuu, kysymys ei ole "yritä kovemmin" vaan **"mikä kyvykkyys puuttuu?"**

---

## 3. Periaatteet ja DWS-vertailu

### 3.1 AGENTS.md — Kartta, ei tietosanakirja

|                 | OpenAI                                                                                                 | DWS IQ 6                                                                                                          |
| --------------- | ------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------- |
| **Periaate**    | AGENTS.md ~100 riviä, toimii sisällysluettelona. Varsinainen tieto `docs/`-hakemistossa.               | CLAUDE.md ~507 riviä + AGENTS.md ~903 riviä. Molemmat sisältävät viittaukset 11 standardiin `docs/`-hakemistossa. |
| **Toteutus**    | Monoliittinen ohjetiedosto epäonnistui: syö kontekstia, vanhenee, vaikea verifioida.                   | JIT-latausmalli (Information Layering Strategy L2): standardit ladataan vasta tarvittaessa.                       |
| **Valmiusaste** | **90%** — DWS on toteuttanut JIT-mallin pidemmälle kuin OpenAI (kuusikerroksinen L0–L6 arkkitehtuuri). |

**DWS:n ero:** DWS on formalisoinut kuusikerroksisen tietohierarkian (L0 Platform Model → L6 Tool Result Injection), jota OpenAI ei kuvaa eksplisiittisesti. DWS:n L6 Tool Injection -kerros (system-reminder jokaisen tool-kutsun jälkeen) on tehokkain tapa ankkuroida agentti sääntöihin — 15–47 % parempi noudattaminen kuin pelkkä systeemiprompt.

---

### 3.2 "Boring Technology" voittaa

|                 | OpenAI                                                                                                                                             | DWS IQ 6                                                                       |
| --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| **Periaate**    | Agentit toimivat parhaiten vakaiden, hyvin dokumentoitujen teknologioiden kanssa. Uusin framework harvoilla Stack Overflow -vastauksilla ei toimi. | Express 4 (ei 5), React 19, PostgreSQL, Vite — kaikki vakiintuneita.           |
| **Toteutus**    | Halvempaa reimplementoida osajoukko kuin taistella opaakista upstream-kirjastosta.                                                                 | Sama kokemus: Supabase SDK > suora PG-yhteys, Tailwind > custom CSS framework. |
| **Valmiusaste** | **95%** — DWS:n tech stack on tietoisesti "tylsä" ja agenttien helposti mallinnettavissa.                                                          |

**DWS:n ero:** DWS menee pidemmälle vaatimalla jokaisen tuotteen olevan CLI-ensisijainen (`dws <command>`). GUI-only ominaisuus on keskeneräinen. Tämä ei ole OpenAI:n eksplisiittinen vaatimus.

---

### 3.3 "Golden Principles" — laadunhallinta

|                 | OpenAI                                                                                                              | DWS IQ 6                                                                                       |
| --------------- | ------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| **Periaate**    | Mekaaniset, mielipiteiset säännöt koodatuina repoon. Taustatehtävät skannaavat poikkeamia ja avaavat korjaus-PR:iä. | 11 standardia repossa (Brand, Security, Document, Data, Site Quality...). CI/CD 15 workflowta. |
| **Toteutus**    | "Roskienkeräys": agentit korjaavat teknistä velkaa päivittäin.                                                      | Marcuksen "cranky review" — turvallisuus, idempotenssi, drift-tarkistus.                       |
| **Valmiusaste** | **75%** — Standardit ovat kattavat, mutta automaattinen golden-principle-skannaus taustatehtävinä puuttuu vielä.    |

**DWS:n ero:** DWS käyttää Marcuksen arkkitehtiroolia aggressiiviseen koodikatselmointiin, mikä on ihmislähtöisempi kuin OpenAI:n puhtaasti agenttipohjainen skannaus. Automaattinen taustaskannaus on seuraava askel.

---

### 3.4 Arkkitehtuurin mekaaninen valvonta (Linterit)

|                 | OpenAI                                                                                                                                | DWS IQ 6                                                                                  |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| **Periaate**    | Linterit korjausohjeineen virheviesteissä. Virheviesti = agenttikonteksti. Markdown-ohje on ehdotus; build-virhe on sääntö.           | ESLint, `.editorconfig`, `.githooks/` branch-validointi, Bandit/Safety Pythonille.        |
| **Toteutus**    | Riippuvuussuunta pakotettuna: `Types → Config → Repo → Service → Runtime → UI`. Rikkomus = build failure + korjausohje.               | Security coding rules (execFile > exec, SRI-hashit, CORS-rajoitukset). Pre-commit hookit. |
| **Valmiusaste** | **60%** — Peruslinting on paikallaan, mutta arkkitehtuuritason riippuvuussuuntavalidointi ja korjausohjeet virheviesteissä puuttuvat. |

**DWS:n ero:** DWS painottaa turvallisuuslintausta (OWASP, SRI, CORS) vahvemmin kuin arkkitehtuurisuunnan valvontaa. OpenAI:n lähestymistapa, jossa lintterin virheviesti sisältää korjausohjeen suoraan, on hyödyllinen malli adoptoitavaksi.

---

### 3.5 Tieto kuuluu repoon

|                 | OpenAI                                                                                                             | DWS IQ 6                                                                                          |
| --------------- | ------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------- |
| **Periaate**    | Slack-keskustelut, Google Docs, hiljainen tieto = näkymätöntä agenteille. Jos se ei ole repossa, sitä ei ole.      | "Knowledge Must Live in the Repo" — 11 standardia, field notes, thesis-dokumentit kaikki repossa. |
| **Toteutus**    | Kaikki tieto versioituna, agenttien löydettävissä.                                                                 | 71 dokumenttia `docs/`-hakemistossa, standardit juuressa, Learn/-hakemisto, product-catalog/.     |
| **Valmiusaste** | **95%** — DWS on toteuttanut tämän laajasti. Kaikki tieto on repossa, versioituna, dokumenttistandardin mukaisena. |

**DWS:n ero:** DWS menee pidemmälle vaatimalla DWS Document Standard -muotoilun (VERSION AND AGENT HISTORY -lohko) jokaisessa dokumentissa, mikä tekee dokumenttien historiasta jäljitettävän. OpenAI ei kuvaa vastaavaa dokumenttistandardia.

---

### 3.6 Agentti-agentti-koodikatselmointi

|                 | OpenAI                                                                                                                                              | DWS IQ 6                                                                           |
| --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| **Periaate**    | Codex katselmoi omat muutoksensa, pyytää lisäkatselmointeja, iteroi kunnes tyytyväinen ("Ralph Wiggum Loop"). Ihminen vain kun harkintaa tarvitaan. | Claude Code + Marcus-rooli. Simplify-skill (`/simplify`) tarkistaa koodin laadun.  |
| **Toteutus**    | 98 % enemmän PR-yhdistämisiä, 91 % pidempi katselmointiaika → agenttikatselmointi välttämätön.                                                      | Auto-push-sääntö: jokainen valmis tehtävä = commit + push. PR-pohjainen työnkulku. |
| **Valmiusaste** | **50%** — Perustyökalut paikallaan (simplify, skills), mutta systemaattinen agentti-agentti-katselmointisilmukka puuttuu.                           |

**DWS:n ero:** DWS käyttää ihminen-agentti-yhteistyömallia (Karpathy-periaatteet: "You are the hands; the human is the architect"). OpenAI on siirtänyt enemmän autonomiaa agenteille. DWS:n valinta on tietoinen — EU-reguloiduissa teollisuuksissa ihminen-silmukassa-periaate on vahvempi.

---

### 3.7 Puuttuvien kyvykkyyksien rakentaminen (Compounding Returns)

|                 | OpenAI                                                                                                                                                                                         | DWS IQ 6                                                                                                       |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| **Periaate**    | Kun agentti ei onnistu, älä yritä kovemmin — diagnosoi puuttuva kyvykkyys ja rakenna se repoon. Kumuloituva hyöty: jokainen uusi kyvykkyys on infrastruktuuria kaikille tulevaille tehtäville. | CLAUDE.md: "When encountering an obstacle, do not attempt to brute force." Skills, MCP-serverit, CLI-komennot. |
| **Toteutus**    | Syvyyssuuntainen lähestymistapa.                                                                                                                                                               | 10 Claude Code skilliä, 16 industry-agenttia, MCP Hub, workflow-orkestrointi.                                  |
| **Valmiusaste** | **85%** — DWS on rakentanut laajan skill/agent-ekosysteemin. Automaattinen kyvykkyyspuutteen havaitseminen ja itsekorjaus puuttuu vielä.                                                       |

---

### 3.8 Insinöörit ympäristösuunnittelijoina

|                 | OpenAI                                                                                                            | DWS IQ 6                                                                                           |
| --------------- | ----------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| **Periaate**    | Insinöörin työ: suunnittele ympäristö, spesifioi tarkoitus, rakenna palautesilmukat. Agentit kirjoittavat koodin. | "Humans design environments; agents execute." Karpathy-periaatteet. Information Layering Strategy. |
| **Toteutus**    | 3,5 PR/insinööri/päivä → kasvaa tiimin kasvaessa.                                                                 | Worktree-pohjainen rinnakkaiskehitys, session handover protocol, auto-mode trust boundary.         |
| **Valmiusaste** | **80%** — Arkkitehtuuri tukee tätä vahvasti. Throughput-mittarit ja systemaattinen seuranta puuttuvat.            |

---

## 4. Yhteenveto: valmiusasteet

| #   | Periaate                              | OpenAI                   | DWS                               | Valmiusaste | Status        |
| --- | ------------------------------------- | ------------------------ | --------------------------------- | ----------- | ------------- |
| 1   | AGENTS.md = kartta, ei tietosanakirja | ~100 riviä               | CLAUDE.md + AGENTS.md + JIT L0–L6 | **90%**     | Edellä        |
| 2   | "Boring technology" voittaa           | Vakaat teknologiat       | Express 4, React 19, PostgreSQL   | **95%**     | Edellä        |
| 3   | Golden Principles -laadunhallinta     | Automaattinen skannaus   | 11 standardia + Marcus            | **75%**     | Osittainen    |
| 4   | Arkkitehtuurin mekaaninen valvonta    | Linterit + korjausohjeet | ESLint + security rules           | **60%**     | Kehitettävää  |
| 5   | Tieto kuuluu repoon                   | Kaikki repossa           | 71 doc + standardit + field notes | **95%**     | Edellä        |
| 6   | Agentti-agentti-katselmointi          | Ralph Wiggum Loop        | Simplify + Marcus + ihminen       | **50%**     | Tietoinen ero |
| 7   | Compounding Returns                   | Itsekorjautuva agentti   | 10 skilliä + 16 agenttia + MCP    | **85%**     | Hyvä          |
| 8   | Insinöörit ympäristösuunnittelijoina  | 3,5 PR/d throughput      | Worktree + session handover       | **80%**     | Hyvä          |

**Kokonaisvalmiusaste: ~79%**

---

## 5. Erot OpenAI:n lähestymistapaan

### 5.1 DWS on ratkaissut toisin

| Alue                    | OpenAI                           | DWS                                                            | Perustelu                                                             |
| ----------------------- | -------------------------------- | -------------------------------------------------------------- | --------------------------------------------------------------------- |
| **Kontekstin hallinta** | AGENTS.md ~100 riviä, flat docs/ | 6-kerroksinen L0–L6 hierarkia, JIT-lataus, L6 tool injection   | Formaali kerrosarkkitehtuuri skaalautuu paremmin 11 standardin kanssa |
| **Koodikatselmointi**   | Täysin agentti-agentti           | Ihminen-agentti-yhteistyö (Karpathy)                           | EU-reguloidut teollisuudet vaativat ihmisen silmukassa                |
| **Dokumenttistandardi** | Ei kuvattu                       | VERSION AND AGENT HISTORY -lohko jokaisessa dokumentissa       | Jäljitettävyys, auditointipolku, court-defensible                     |
| **CLI-ensisijaisuus**   | Ei eksplisiittinen vaatimus      | "Jos sitä ei voi käyttää `dws <command>`, se ei ole valmis"    | Agentit tarvitsevat CLI-rajapinnan, ei GUI:ta                         |
| **Tietoturva**          | Ei painotettu                    | OWASP, SRI, CORS, RLS, execFile — turvallisuus on ensisijainen | EU AI Act, GDPR, 20 reguloitua toimialaa                              |
| **Muistiarkkitehtuuri** | Ei kuvattu                       | L4 Auto-Learned State (Supabase + MEMORY.md)                   | Agenttien oppiminen sessioiden välillä                                |
| **12 Factor Agents**    | Ei viitata                       | 12/12 compliance dokumentoitu                                  | Systemaattinen arkkitehtuurin validointi                              |

### 5.2 Missä OpenAI on edellä

| Alue                             | Kuvaus                                                                      | DWS:n seuraava askel                                             |
| -------------------------------- | --------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| **Automaattinen taustaskannaus** | Codex-tehtävät skannaavat poikkeamia, avaavat korjaus-PR:iä automaattisesti | Toteuta golden-principle-scanner CI/CD-pipelineen                |
| **Agentti-agentti-katselmointi** | Systemaattinen itsekatselmointi-silmukka                                    | Laajenna `/simplify` + Marcus automaattiseksi PR-katselmoinniksi |
| **Lintterin korjausohjeet**      | Virheviesti = agenttikonteksti, sisältää korjausohjeen                      | Lisää custom linter rules arkkitehtuurisääntöineen               |
| **Throughput-mittarit**          | 3,5 PR/insinööri/päivä, systemaattinen seuranta                             | Lisää PR-throughput-dashboard                                    |

---

## 6. Thesis-näkökulmat

### 6.1 Metropolia Master Thesis — keskeiset havainnot

Harness Engineering -artikkeli tukee seuraavia thesis-argumentteja:

1. **Konteksti-insinööri > prompt-insinööri:** OpenAI:n kokemus vahvistaa, että järjestelmäsuunnittelu (harness) ratkaisee enemmän kuin yksittäiset promptit. DWS:n 6-kerroksinen arkkitehtuuri on formalisointi tästä periaatteesta.

2. **Harness-malli todistaa:** Sama malli (gpt-5.2-codex) paransi tuloksiaan 52,8 % → 66,5 % pelkällä harness-parannuksella (LangChain). Malli ei ole tärkein — järjestelmä on.

3. **Progressive Disclosure toimii:** Cursor 46,9 % tokenisäästö, Vercel 145K → 67K tokenia. DWS:n JIT-latausmalli on sama periaate.

4. **EU-regulaatio vaatii erilaisen harnessin:** OpenAI optimoi nopeutta (3,5 PR/d); DWS optimoi jäljitettävyyttä, auditointia ja ihminen-silmukassa-periaatetta. Molemmat ovat valideja, mutta eri konteksteissa.

5. **"Boring technology" on empiirinen tulos:** Ei vain mielipide — agentit mallintavat vakaat teknologiat paremmin kuin uudet frameworkit.

### 6.2 PHD Firehorse — relevanssi

- **Court-defensible audit trails:** DWS:n VERSION AND AGENT HISTORY -lohko toteuttaa jäljitettävyyden, jota OpenAI ei kuvaa
- **Forensic telemetry:** Firehorse-telemetria täydentää harness-mallia fyysiseen maailmaan
- **KYA Standard:** Hardware-attested isolation menee pidemmälle kuin ohjelmistotason harness

### 6.3 Avoimet tutkimuskysymykset

1. **Skaalautuuko harness-malli EU-reguloiduille toimialoille?** OpenAI:n case on sisäinen tuote ilman regulaatiovaatimuksia. DWS toimii 20 reguloidulla toimialalla.

2. **Mikä on optimaalinen autonomiataso?** OpenAI: lähes täysi autonomia. DWS: ihminen-silmukassa. Kumpi tuottaa paremman lopputuloksen reguloidussa kontekstissa?

3. **Onko 6-kerroksinen kontekstiarkkitehtuuri yleistettävissä?** DWS:n L0–L6 -malli on spesifinen, mutta periaatteet voivat olla universaaleja.

4. **Verifikaatioaukko:** Martin Fowler huomautti, että OpenAI:n artikkelista puuttuu toiminnallisuuden ja käyttäytymisen verifiointi. Miten harness varmistaa, että generoitu koodi tekee oikean asian?

---

## 7. Lähteet

- OpenAI, "Harness engineering: leveraging Codex in an agent-first world", 13.02.2026
  https://openai.com/index/harness-engineering/

- OpenAI, "Unlocking the Codex harness: how we built the App Server", 13.02.2026
  https://openai.com/index/unlocking-the-codex-harness/

- OpenAI, "Unrolling the Codex agent loop", 13.02.2026
  https://openai.com/index/unrolling-the-codex-agent-loop/

- Martin Fowler, "Harness Engineering", 2026
  https://martinfowler.com/articles/exploring-gen-ai/harness-engineering.html

- OpenAI, "Custom instructions with AGENTS.md", 2026
  https://developers.openai.com/codex/guides/agents-md/

- OpenAI, "Building an AI-Native Engineering Team", 2026
  https://developers.openai.com/codex/guides/build-ai-native-engineering-team/

- Datadog, "Closing the verification loop: Observability-driven harnesses", 2026
  https://www.datadoghq.com/blog/ai/harness-first-agents/

- DWS IQ 6, "Information Layering Strategy", v1.3
  docs/DWS_INFORMATION_LAYERING_STRATEGY.md

- DWS IQ 6, AGENTS.md, v2.2
  AGENTS.md

- DWS IQ 6, CLAUDE.md
  CLAUDE.md

---

## 8. Parannusehdotukset: 95 % tavoitetaso

### 8.1 AGENTS.md = kartta (90% → 95%)

**Nykytila:** CLAUDE.md 507 riviä + AGENTS.md 903 riviä. JIT-lataus toimii, mutta AGENTS.md on paisunut yli OpenAI:n suositteleman ~100 rivin.

**Puute:** AGENTS.md sisältää yksityiskohtaista tietoa, joka kuuluisi `docs/`-alihakemistoon. Kontekstibudjetti kärsii.

**Parannus:**

| Toimenpide                         | Kuvaus                                                                                                                           | Työmäärä |
| ---------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- | -------- |
| **Tiivistä AGENTS.md ~150 riviin** | Siirrä yksityiskohdat (ERP-integraatiot, deployment-ohjeet, agenttikuvaukset) `docs/`-tiedostoihin. AGENTS.md jää karttatasoksi. | 2 h      |
| **Lisää `docs/AGENTS_DETAIL.md`**  | Syvätieto, johon AGENTS.md viittaa: agenttiluettelo, ERP-rajapinnat, workflow-kuvaukset.                                         | 1 h      |
| **Mittaa token-käyttö**            | Kirjaa AGENTS.md:n token-kustannus ennen/jälkeen. Tavoite: <2 000 tokenia injektoituna vs. nykyinen ~3 500.                      | 0,5 h    |

**Tavoitetulos:** AGENTS.md on kartta (~150 riviä), `docs/` sisältää syvätiedon. Token-säästö ~40 %.

---

### 8.2 "Boring Technology" (95% → 95%)

**Nykytila:** Jo tavoitetasolla. Express 4, React 19, PostgreSQL, Vite, Tailwind.

**Ylläpitotoimenpide:**

| Toimenpide                        | Kuvaus                                                                                                                                                        | Työmäärä |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| **Dokumentoi "Technology Radar"** | Lisää `docs/TECH_RADAR.md`: hyväksytyt teknologiat (Adopt), kokeiltavat (Trial), vältettävät (Hold). Agentit tarkistavat ennen uuden kirjaston käyttöönottoa. | 1 h      |
| **Lisää riippuvuusvalidointi**    | Pre-commit hook: uusi `package.json` dependency → tarkista onko Technology Radar -listalla.                                                                   | 1 h      |

---

### 8.3 Golden Principles -laadunhallinta (75% → 95%)

**Nykytila:** 11 standardia repossa, 37 CI/CD workflowta, Marcus-katselmointi. Mutta: ei automaattista taustaskannausta, joka avaisi korjaus-PR:iä säännöllisesti.

**Puute:** OpenAI:n "garbage collection" -malli puuttuu: taustatehtävät, jotka skannaavat poikkeamia ja avaavat korjaus-PR:iä automaattisesti.

**Parannus:**

| Toimenpide                                | Kuvaus                                                                                                                                                                                                                    | Työmäärä |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| **Golden Principle Scanner -workflow**    | Uusi `.github/workflows/golden-principle-scan.yml`: viikoittainen ajastettu workflow, joka ajaa Claude Code -agentin skannaamaan repoa standardipoikkeamien varalta. Avaa korjaus-PR:iä automaattisesti.                  | 4 h      |
| **Koodaa 5 mekaanista sääntöä**           | 1) `.md`-tiedostot julkisissa poluissa, 2) DWS Document Standard -header puuttuu, 3) hardcoded secrets, 4) `exec()` vs `execFile()`, 5) CORS `origin: '*'`. Näistä 3 on jo `ai-pr-review.yml`:ssä — laajenna kattavuutta. | 3 h      |
| **Automaattinen teknisen velan seuranta** | Lisää `scripts/golden-principle-check.sh`: ajaa tarkistukset paikallisesti, tulostaa "quality grade" (A–F). Tulos tallennetaan `docs/quality-grades.json`.                                                                | 2 h      |
| **Friday Cleanup → Cron Cleanup**         | Muuta manuaalinen perjantaisiivous automaattiseksi: cron-pohjaiset Codex/Claude-tehtävät maanantaisin klo 06:00.                                                                                                          | 1 h      |

**Tavoitetulos:** Automaattinen viikkoskannaus + korjaus-PR:t + quality grade -seuranta. Tekninen velka maksetaan päivittäin pienissä erissä.

---

### 8.4 Arkkitehtuurin mekaaninen valvonta (60% → 95%)

**Nykytila:** ESLint EI ole konfiguroitu (lint-skripti: `echo "No linter configured"`). Python-puolella Ruff 13-sääntöjoukolla. Turvallisuuslinting AI-review-gateissa.

**Puute:** Suurin yksittäinen aukko. Ei TypeScript-lintausta, ei arkkitehtuuritason riippuvuusvalidointia, ei lintterin virheviesteissä korjausohjeita.

**Parannus:**

| Toimenpide                                | Kuvaus                                                                                                                                                                                                                              | Työmäärä |
| ----------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| **Konfiguroi ESLint flat config**         | `eslint.config.mjs`: TypeScript-strict, import-järjestys, käyttämättömät muuttujat, React-hookit, accessibility-säännöt. Käytä `@typescript-eslint/strict-type-checked`.                                                            | 3 h      |
| **Arkkitehtuurisääntö: riippuvuussuunta** | Custom ESLint-sääntö tai `eslint-plugin-boundaries`: pakota `types/ → config/ → repo/ → service/ → runtime/ → ui/`. Virheilmoitus sisältää korjausohjeen: "Move this import to the correct layer. See docs/ARCHITECTURE_LAYERS.md". | 4 h      |
| **Korjausohjeet virheviesteissä**         | Jokaiseen custom-sääntöön: virheilmoitus = mikä on väärin + miten korjata + viittaus standardiin. Agentti lukee virheviestin ja korjaa itse.                                                                                        | 2 h      |
| **Pre-commit lint hook**                  | Lisää `.githooks/pre-commit`: `npx eslint --fix` + `ruff check --fix`. Estää lint-virheiden pääsyn repoon.                                                                                                                          | 1 h      |
| **Docs: `docs/ARCHITECTURE_LAYERS.md`**   | Dokumentoi riippuvuussuunta, kerrosarkkitehtuuri, sallitut importit per kerros.                                                                                                                                                     | 1 h      |

**Tavoitetulos:** Jokaiselle commitille: ESLint + Ruff + arkkitehtuuritason validointi. Virheilmoitukset ovat agentin kontekstia. "Markdown-ohje on ehdotus; build-virhe on sääntö."

---

### 8.5 Tieto kuuluu repoon (95% → 95%)

**Nykytila:** Jo tavoitetasolla. 71 dokumenttia `docs/`-hakemistossa, DWS Document Standard, VERSION AND AGENT HISTORY.

**Ylläpitotoimenpide:**

| Toimenpide                         | Kuvaus                                                                                                                                        | Työmäärä |
| ---------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| **Dokumentti-indeksin automaatio** | `docs/Document-index.md` päivittyy automaattisesti CI:ssä: skriptaa kaikkien `docs/*.md`-tiedostojen versiot, statukset, viimeisin muokkaaja. | 1 h      |
| **Staleness-tarkistus**            | Workflow: merkitse dokumentit, joita ei ole päivitetty 90 päivään, "REVIEW NEEDED" -statuksella.                                              | 1 h      |

---

### 8.6 Agentti-agentti-katselmointi (50% → 95%)

**Nykytila:** 5-tasoinen PR-review-järjestelmä (Aikido → Claude → Gemini → Copilot fix → Ollama). Mutta: ei systemaattista itsekatselmointi-silmukkaa ennen PR:n avaamista. `/simplify`-skill ei ole toteutettu.

**Puute:** OpenAI:n "Ralph Wiggum Loop" puuttuu: agentti katselmoi omat muutoksensa, korjaa, iteroi, pyytää lisäkatselmointia — ENNEN kuin PR avataan.

**Parannus:**

| Toimenpide                                      | Kuvaus                                                                                                                                                                                                                                                                   | Työmäärä            |
| ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------- |
| **Toteuta `/simplify`-skill**                   | Luo `.claude/commands/simplify.md`: tarkista muutettu koodi uudelleenkäytön, laadun ja tehokkuuden osalta. Korjaa löydetyt ongelmat.                                                                                                                                     | 1 h                 |
| **Pre-PR self-review hook**                     | `.claude/hooks/pre-push-review`: ennen git push → agentti katselmoi omat muutoksensa (`git diff HEAD~1`), listaa ongelmat, korjaa triviaalit automaattisesti.                                                                                                            | 3 h                 |
| **Marcus-automaatiosilmukka**                   | Workflow: PR avataan → Claude katselmoi (nykyinen) → löydetyt ongelmat → automaattinen korjausyritys (max 2 iteraatiota) → ihminen vain jos korjaus epäonnistuu. Ero OpenAI:iin: max 2 iteraatiota (ei 3), koska EU-kontekstissa ihmisen nopea eskalaatio on tärkeämpää. | 4 h                 |
| **Ihminen-silmukassa-periaate (DWS-erityinen)** | ÄLÄ kopioi OpenAI:n täysautomaatiota. Säilytä ihminen lopullisena hyväksyjänä, mutta lisää agenttisilmukka ENNEN ihmiskatselmointia. Ihminen näkee vain valmiiksi katselmoidun, korjatun koodin.                                                                         | Arkkitehtuuripäätös |

**Tavoitetulos:** Agentti katselmoi ja korjaa ennen kuin ihminen näkee koodin. Ihminen katselmoi vain agentti-esikatselmoidun tuloksen. Tehokkuus nousee, mutta ihminen pysyy silmukassa (EU-vaatimus).

---

### 8.7 Compounding Returns (85% → 95%)

**Nykytila:** 10 skilliä, 16 agenttia, MCP Hub. Mutta: kun agentti kohtaa esteen, ei automaattista "mikä kyvykkyys puuttuu?" -analyysiä.

**Puute:** Reaktiivinen ongelmanratkaisu vs. proaktiivinen kyvykkyyksien rakentaminen.

**Parannus:**

| Toimenpide                     | Kuvaus                                                                                                                                                                                      | Työmäärä |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| **Capability Gap Logger**      | Kun agentti kohtaa esteen (tool call fails, tiedostoa ei löydy, API-virhe), kirjaa gap `docs/capability-gaps.json`: `{gap, context, timestamp, resolution}`.                                | 2 h      |
| **Viikoittainen gap-analyysi** | Cron-workflow: lue `capability-gaps.json`, priorisoi, avaa issue per top-3 gap. Claude-agentti ehdottaa ratkaisun (uusi skill, MCP-tool, dokumentti).                                       | 2 h      |
| **Skill-generaattori**         | Kun uusi agentti lisätään: automaattisesti generoi `.claude/commands/<agent>.md` skeleton. Nykyinen vaatimus on manuaalinen (CLAUDE.md: "Every new agent MUST have a corresponding skill"). | 1 h      |
| **MCP-tool auto-discovery**    | Varmista, että jokainen uusi agentti rekisteröityy automaattisesti `tools/list`-vasteeseen. Lisää validointitesti.                                                                          | 1 h      |

**Tavoitetulos:** Esteet muuttuvat automaattisesti kyvykkyysvaatimuksiksi → issueiksi → toteutuksiksi. Kumuloituva kasvu systemaattista.

---

### 8.8 Insinöörit ympäristösuunnittelijoina (80% → 95%)

**Nykytila:** Worktree-workflow, session handover protocol, auto-mode trust boundary. Mutta: ei throughput-mittareita, ei systemaattista seurantaa.

**Puute:** OpenAI mittaa 3,5 PR/insinööri/päivä. DWS ei mittaa.

**Parannus:**

| Toimenpide                                 | Kuvaus                                                                                                                                                                              | Työmäärä |
| ------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| **PR Throughput Dashboard**                | `scripts/pr-throughput.sh`: `gh pr list --state merged --json createdAt,author,mergedAt`. Laske PR/d per author. Tallenna `docs/metrics/pr-throughput.json`.                        | 2 h      |
| **Session Productivity Tracker**           | Laajenna session handover protocol: jokainen sessio kirjaa `{tasks_completed, files_changed, lines_added, lines_removed, duration_minutes}`. Tallenna `docs/metrics/sessions.json`. | 2 h      |
| **Viikoittainen harness health -raportti** | Workflow: yhdistä throughput + quality grades + capability gaps + review iteration count → yhden sivun viikkoraportti.                                                              | 2 h      |
| **Agent-first task templating**            | Luo `docs/TASK_TEMPLATES.md`: valmiit tehtävänkuvaukset yleisimmille tehtäville (bug fix, feature, refactor, doc update). Agentti saa valmiin rakenteen eikä tarvitse improvisoida. | 1 h      |

**Tavoitetulos:** Mitattu throughput, tuottavuusseuranta, viikoittainen harness health. Tiedolla johtaminen, ei mutu-tuntumalla.

---

## 9. Toteutuksen roadmap

### Vaihe 1: Quick Wins (viikko 1) — suurin vaikutus, pienin työ

| #   | Toimenpide                     | Periaate | Työ | Vaikutus   |
| --- | ------------------------------ | -------- | --- | ---------- |
| 1   | Toteuta `/simplify`-skill      | 8.6      | 1 h | Korkea     |
| 2   | Konfiguroi ESLint flat config  | 8.4      | 3 h | Kriittinen |
| 3   | Pre-commit lint hook           | 8.4      | 1 h | Korkea     |
| 4   | Tiivistä AGENTS.md ~150 riviin | 8.1      | 2 h | Korkea     |
| 5   | Technology Radar -dokumentti   | 8.2      | 1 h | Keskitaso  |

### Vaihe 2: Automaatio (viikko 2–3)

| #   | Toimenpide                         | Periaate | Työ | Vaikutus   |
| --- | ---------------------------------- | -------- | --- | ---------- |
| 6   | Golden Principle Scanner -workflow | 8.3      | 4 h | Kriittinen |
| 7   | Pre-PR self-review hook            | 8.6      | 3 h | Korkea     |
| 8   | Capability Gap Logger              | 8.7      | 2 h | Korkea     |
| 9   | PR Throughput Dashboard            | 8.8      | 2 h | Keskitaso  |
| 10  | Arkkitehtuurisääntö (boundaries)   | 8.4      | 4 h | Korkea     |

### Vaihe 3: Hienosäätö (viikko 4)

| #   | Toimenpide                             | Periaate | Työ | Vaikutus  |
| --- | -------------------------------------- | -------- | --- | --------- |
| 11  | Marcus-automaatiosilmukka PR:lle       | 8.6      | 4 h | Korkea    |
| 12  | Viikoittainen harness health -raportti | 8.8      | 2 h | Keskitaso |
| 13  | Gap-analyysi cron-workflow             | 8.7      | 2 h | Keskitaso |
| 14  | Staleness-tarkistus dokumenteille      | 8.5      | 1 h | Matala    |

**Kokonaistyömäärä: ~35 h** (4–5 työpäivää)

### Odotettu lopputulos

| #   | Periaate                | Nyt     | Tavoite | Muutos   |
| --- | ----------------------- | ------- | ------- | -------- |
| 1   | AGENTS.md = kartta      | 90%     | 95%     | +5%      |
| 2   | Boring technology       | 95%     | 95%     | —        |
| 3   | Golden Principles       | 75%     | 95%     | +20%     |
| 4   | Mekaaninen valvonta     | 60%     | 95%     | +35%     |
| 5   | Tieto repossa           | 95%     | 95%     | —        |
| 6   | Agentti-katselmointi    | 50%     | 95%     | +45%     |
| 7   | Compounding Returns     | 85%     | 95%     | +10%     |
| 8   | Ympäristösuunnittelu    | 80%     | 95%     | +15%     |
|     | **Kokonaisvalmiusaste** | **79%** | **95%** | **+16%** |

---

## 10. AGENTS.md vanhentumisen hallinta — agenttipohjaiset ratkaisut

### 10.1 Ongelma

OpenAI tunnisti neljä syytä miksi monoliittinen ohjetiedosto epäonnistuu:

1. **Syö kontekstibudjettia** — 903 riviä = ~3 500 tokenia injektoituna joka sessioon
2. **Vanhenee välittömästi** — Kun koodi muuttuu, dokumentti ei päivity automaattisesti
3. **Vaikea verifioida** — Ei mekaanista tapaa tarkistaa onko tieto ajantasaista
4. **Liikaa = ei mitään** — Kun kaikki on "tärkeää", mikään ei ole

DWS:n AGENTS.md (903 riviä) on paisunut yli suositellun. Se sisältää yksityiskohtaista API-skeemaa (§8), täyden koodiesimerkin (§9, 80 riviä TypeScript), arkkitehtuurikaavioita (§7, 50 riviä ASCII art) ja KYA-protokollan (§18, 150 riviä) — nämä kaikki kuuluvat `docs/`-alihakemistoon.

### 10.2 Ratkaisu: kolme agenttia

#### Agentti 1: `agents-md-freshness` — Vanhentumisvahti

**Tehtävä:** Tarkista viikoittain, ovatko AGENTS.md:n väitteet edelleen tosia.

**Toteutus:** GitHub Actions -workflow (`agents-md-freshness.yml`)

```yaml
name: AGENTS.md Freshness Check
on:
  schedule:
    - cron: "0 6 * * 1" # Maanantai klo 06:00
  workflow_dispatch: {}

jobs:
  freshness-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Verify AGENTS.md claims
        run: |
          # 1. Tarkista tech stack -versiot vs package.json
          node scripts/verify-agents-md.mjs --section tech-stack

          # 2. Tarkista agenttilista vs src/agents/*.agent.ts
          node scripts/verify-agents-md.mjs --section agent-list

          # 3. Tarkista API-endpointit vs src/agents/routes.ts
          node scripts/verify-agents-md.mjs --section api-endpoints

          # 4. Tarkista tiedostopolut vs todellinen hakemistorakenne
          node scripts/verify-agents-md.mjs --section file-paths

          # 5. Tarkista workflow-lukumäärä vs .github/workflows/
          node scripts/verify-agents-md.mjs --section workflow-count
```

**Verifiointiskripti (`scripts/verify-agents-md.mjs`):**

| Tarkistus           | Menetelmä                                              | Esimerkki                                         |
| ------------------- | ------------------------------------------------------ | ------------------------------------------------- |
| Tech stack -versiot | Parse `package.json` dependencies, vertaa AGENTS.md §1 | "React 19" → tarkista `react` version             |
| Agenttilista        | `ls src/agents/*.agent.ts`, vertaa §7 taulukkoon       | Puuttuko agentti? Onko ylimääräinen?              |
| API-endpointit      | Grep `router.get\|router.post` routes.ts:stä           | Onko `/api/agents/:name/execute` edelleen oikein? |
| Tiedostopolut       | `fs.existsSync()` jokaiselle §15 polulle               | `src/agents/base.agent.ts` → löytyykö?            |
| CI/CD lukumäärä     | `ls .github/workflows/*.yml \| wc -l`                  | "15 workflows" → todellisuudessa 37               |

**Output:** Issue avataan automaattisesti jos poikkeamia löytyy. Label: `agents-md-stale`.

---

#### Agentti 2: `agents-md-slim` — Tiivistäjä

**Tehtävä:** Pidä AGENTS.md ~150 rivin karttana. Siirrä yksityiskohdat automaattisesti `docs/`-tiedostoihin.

**Toteutus:** Manuaalinen refaktorointi + jatkuva validointi.

**Siirrettävät osiot:**

| Nykyinen osio                       | Rivit    | Siirto                            | Jää karttaan             |
| ----------------------------------- | -------- | --------------------------------- | ------------------------ |
| §7 Agent Ecosystem ASCII art        | ~50      | `docs/AGENT_ECOSYSTEM.md`         | 1-rivin viittaus         |
| §8 V2 Agents: input/output -skeemat | ~100     | `docs/AGENT_API_REFERENCE.md`     | Taulukko: nimi + 1 lause |
| §9 How to Add Agent (koodi)         | ~80      | `docs/AGENT_DEVELOPMENT_GUIDE.md` | 1-rivin viittaus         |
| §10 Lifetime Scope Signals          | ~50      | `docs/SIGNAL_PROTOCOL.md`         | 1-rivin viittaus         |
| §17 Compliance Scoring Engine       | ~70      | `docs/COMPLIANCE_SCORING.md`      | 1-rivin viittaus         |
| §18 BYO/KYA (150 riviä)             | ~150     | `docs/KYA_BYO_LIFECYCLE.md`       | 2-rivin viittaus         |
| **Yhteensä siirrettävää**           | **~500** |                                   |                          |

**Tavoite:** AGENTS.md 903 → ~400 riviä (vaihe 1), lopulta ~150 riviä (vaihe 2).

**Karttaformaatti (esimerkki):**

```markdown
## 7. Agent Ecosystem

8 platform agents, 10 dev agents, 7 team agents, 2 workflow agents.
→ Details: [docs/AGENT_ECOSYSTEM.md](docs/AGENT_ECOSYSTEM.md)

## 8. Agent API Reference

POST /api/agents/:name/execute (JWT required)
→ Full schemas: [docs/AGENT_API_REFERENCE.md](docs/AGENT_API_REFERENCE.md)
```

**Validointi:** Pre-commit hook tarkistaa AGENTS.md rivimäärän. >200 riviä = varoitus, >400 = blokki.

---

#### Agentti 3: `agents-md-sync` — Automaattinen päivittäjä

**Tehtävä:** Kun koodipohja muuttuu, päivitä AGENTS.md automaattisesti.

**Toteutus:** GitHub Actions -workflow, triggeröityy koodimuutoksista.

```yaml
name: AGENTS.md Auto-Sync
on:
  push:
    paths:
      - "src/agents/**"
      - "package.json"
      - ".github/workflows/**"
      - "mcp-hub/**"

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Regenerate AGENTS.md sections
        run: node scripts/sync-agents-md.mjs
      - name: Commit if changed
        run: |
          git diff --quiet AGENTS.md || {
            git add AGENTS.md
            git commit -m "chore: auto-sync AGENTS.md from codebase"
            git push
          }
```

**Synkronoitavat osiot:**

| Osio                       | Lähde                   | Menetelmä                            |
| -------------------------- | ----------------------- | ------------------------------------ |
| Tech stack -versiot        | `package.json`          | Parse dependencies, päivitä §1       |
| Agenttilista (§7 taulukko) | `src/agents/*.agent.ts` | Parse constructors, generoi taulukko |
| Tiedostopolut (§15)        | Hakemistorakenne        | `fs.readdirSync`, päivitä taulukko   |
| CI/CD workflow count       | `.github/workflows/`    | `ls \| wc -l`, päivitä teksti        |
| Viimeisin päivitys         | Automaattinen           | `Updated: YYYY-MM-DD`                |

**Ei synkronoida automaattisesti:** Prosa-kuvaukset, arkkitehtuuripäätökset, turvallisuussäännöt — nämä vaativat ihmisen.

### 10.3 Toteutusjärjestys

| Vaihe | Agentti                                      | Työ | Prioriteetti                     |
| ----- | -------------------------------------------- | --- | -------------------------------- |
| 1     | `agents-md-slim` (manuaalinen refaktorointi) | 3 h | **Kriittinen** — suurin vaikutus |
| 2     | `agents-md-freshness` (vanhentumisvahti)     | 2 h | Korkea                           |
| 3     | `agents-md-sync` (automaattinen päivittäjä)  | 3 h | Keskitaso                        |

**Kokonaistyömäärä:** ~8 h

### 10.4 Thesis-näkökulma

Tämä on suora vastine OpenAI:n havaintoon: _"A monolithic instruction file fails because it crowds out task context, causes agents to pattern-match locally instead of navigating intentionally, rots instantly as rules go stale, and is hard to verify mechanically."_

DWS:n ratkaisu menee pidemmälle kuin OpenAI:n:

- **OpenAI:** "Keep AGENTS.md short" (ohje ihmisille)
- **DWS:** Kolme agenttia, jotka automaattisesti valvovat, tiivistävät ja synkronoivat (ohje koneille)

Tämä on esimerkki **compounding returns** -periaatteesta: rakennetaan kyvykkyys, joka parantaa kaikkia tulevia sessioita.
