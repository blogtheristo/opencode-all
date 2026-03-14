***
# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:
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

***

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

| | OpenAI | DWS IQ 6 |
|---|--------|----------|
| **Periaate** | AGENTS.md ~100 riviä, toimii sisällysluettelona. Varsinainen tieto `docs/`-hakemistossa. | CLAUDE.md ~507 riviä + AGENTS.md ~903 riviä. Molemmat sisältävät viittaukset 11 standardiin `docs/`-hakemistossa. |
| **Toteutus** | Monoliittinen ohjetiedosto epäonnistui: syö kontekstia, vanhenee, vaikea verifioida. | JIT-latausmalli (Information Layering Strategy L2): standardit ladataan vasta tarvittaessa. |
| **Valmiusaste** | **90%** — DWS on toteuttanut JIT-mallin pidemmälle kuin OpenAI (kuusikerroksinen L0–L6 arkkitehtuuri). |

**DWS:n ero:** DWS on formalisoinut kuusikerroksisen tietohierarkian (L0 Platform Model → L6 Tool Result Injection), jota OpenAI ei kuvaa eksplisiittisesti. DWS:n L6 Tool Injection -kerros (system-reminder jokaisen tool-kutsun jälkeen) on tehokkain tapa ankkuroida agentti sääntöihin — 15–47 % parempi noudattaminen kuin pelkkä systeemiprompt.

---

### 3.2 "Boring Technology" voittaa

| | OpenAI | DWS IQ 6 |
|---|--------|----------|
| **Periaate** | Agentit toimivat parhaiten vakaiden, hyvin dokumentoitujen teknologioiden kanssa. Uusin framework harvoilla Stack Overflow -vastauksilla ei toimi. | Express 4 (ei 5), React 19, PostgreSQL, Vite — kaikki vakiintuneita. |
| **Toteutus** | Halvempaa reimplementoida osajoukko kuin taistella opaakista upstream-kirjastosta. | Sama kokemus: Supabase SDK > suora PG-yhteys, Tailwind > custom CSS framework. |
| **Valmiusaste** | **95%** — DWS:n tech stack on tietoisesti "tylsä" ja agenttien helposti mallinnettavissa. |

**DWS:n ero:** DWS menee pidemmälle vaatimalla jokaisen tuotteen olevan CLI-ensisijainen (`dws <command>`). GUI-only ominaisuus on keskeneräinen. Tämä ei ole OpenAI:n eksplisiittinen vaatimus.

---

### 3.3 "Golden Principles" — laadunhallinta

| | OpenAI | DWS IQ 6 |
|---|--------|----------|
| **Periaate** | Mekaaniset, mielipiteiset säännöt koodatuina repoon. Taustatehtävät skannaavat poikkeamia ja avaavat korjaus-PR:iä. | 11 standardia repossa (Brand, Security, Document, Data, Site Quality...). CI/CD 15 workflowta. |
| **Toteutus** | "Roskienkeräys": agentit korjaavat teknistä velkaa päivittäin. | Boardy-persoonan "cranky review" — turvallisuus, idempotenssi, drift-tarkistus. |
| **Valmiusaste** | **75%** — Standardit ovat kattavat, mutta automaattinen golden-principle-skannaus taustatehtävinä puuttuu vielä. |

**DWS:n ero:** DWS käyttää "Boardy"-arkkitehtipersoonaa aggressiiviseen koodikatselmointiin, mikä on ihmislähtöisempi kuin OpenAI:n puhtaasti agenttipohjainen skannaus. Automaattinen taustaskannaus on seuraava askel.

---

### 3.4 Arkkitehtuurin mekaaninen valvonta (Linterit)

| | OpenAI | DWS IQ 6 |
|---|--------|----------|
| **Periaate** | Linterit korjausohjeineen virheviesteissä. Virheviesti = agenttikonteksti. Markdown-ohje on ehdotus; build-virhe on sääntö. | ESLint, `.editorconfig`, `.githooks/` branch-validointi, Bandit/Safety Pythonille. |
| **Toteutus** | Riippuvuussuunta pakotettuna: `Types → Config → Repo → Service → Runtime → UI`. Rikkomus = build failure + korjausohje. | Security coding rules (execFile > exec, SRI-hashit, CORS-rajoitukset). Pre-commit hookit. |
| **Valmiusaste** | **60%** — Peruslinting on paikallaan, mutta arkkitehtuuritason riippuvuussuuntavalidointi ja korjausohjeet virheviesteissä puuttuvat. |

**DWS:n ero:** DWS painottaa turvallisuuslintausta (OWASP, SRI, CORS) vahvemmin kuin arkkitehtuurisuunnan valvontaa. OpenAI:n lähestymistapa, jossa lintterin virheviesti sisältää korjausohjeen suoraan, on hyödyllinen malli adoptoitavaksi.

---

### 3.5 Tieto kuuluu repoon

| | OpenAI | DWS IQ 6 |
|---|--------|----------|
| **Periaate** | Slack-keskustelut, Google Docs, hiljainen tieto = näkymätöntä agenteille. Jos se ei ole repossa, sitä ei ole. | "Knowledge Must Live in the Repo" — 11 standardia, field notes, thesis-dokumentit kaikki repossa. |
| **Toteutus** | Kaikki tieto versioituna, agenttien löydettävissä. | 71 dokumenttia `docs/`-hakemistossa, standardit juuressa, Learn/-hakemisto, product-catalog/. |
| **Valmiusaste** | **95%** — DWS on toteuttanut tämän laajasti. Kaikki tieto on repossa, versioituna, dokumenttistandardin mukaisena. |

**DWS:n ero:** DWS menee pidemmälle vaatimalla DWS Document Standard -muotoilun (VERSION AND AGENT HISTORY -lohko) jokaisessa dokumentissa, mikä tekee dokumenttien historiasta jäljitettävän. OpenAI ei kuvaa vastaavaa dokumenttistandardia.

---

### 3.6 Agentti-agentti-koodikatselmointi

| | OpenAI | DWS IQ 6 |
|---|--------|----------|
| **Periaate** | Codex katselmoi omat muutoksensa, pyytää lisäkatselmointeja, iteroi kunnes tyytyväinen ("Ralph Wiggum Loop"). Ihminen vain kun harkintaa tarvitaan. | Claude Code + Boardy-persoona. Simplify-skill (`/simplify`) tarkistaa koodin laadun. |
| **Toteutus** | 98 % enemmän PR-yhdistämisiä, 91 % pidempi katselmointiaika → agenttikatselmointi välttämätön. | Auto-push-sääntö: jokainen valmis tehtävä = commit + push. PR-pohjainen työnkulku. |
| **Valmiusaste** | **50%** — Perustyökalut paikallaan (simplify, skills), mutta systemaattinen agentti-agentti-katselmointisilmukka puuttuu. |

**DWS:n ero:** DWS käyttää ihminen-agentti-yhteistyömallia (Karpathy-periaatteet: "You are the hands; the human is the architect"). OpenAI on siirtänyt enemmän autonomiaa agenteille. DWS:n valinta on tietoinen — EU-reguloiduissa teollisuuksissa ihminen-silmukassa-periaate on vahvempi.

---

### 3.7 Puuttuvien kyvykkyyksien rakentaminen (Compounding Returns)

| | OpenAI | DWS IQ 6 |
|---|--------|----------|
| **Periaate** | Kun agentti ei onnistu, älä yritä kovemmin — diagnosoi puuttuva kyvykkyys ja rakenna se repoon. Kumuloituva hyöty: jokainen uusi kyvykkyys on infrastruktuuria kaikille tulevaille tehtäville. | CLAUDE.md: "When encountering an obstacle, do not attempt to brute force." Skills, MCP-serverit, CLI-komennot. |
| **Toteutus** | Syvyyssuuntainen lähestymistapa. | 10 Claude Code skilliä, 16 industry-agenttia, MCP Hub, workflow-orkestrointi. |
| **Valmiusaste** | **85%** — DWS on rakentanut laajan skill/agent-ekosysteemin. Automaattinen kyvykkyyspuutteen havaitseminen ja itsekorjaus puuttuu vielä. |

---

### 3.8 Insinöörit ympäristösuunnittelijoina

| | OpenAI | DWS IQ 6 |
|---|--------|----------|
| **Periaate** | Insinöörin työ: suunnittele ympäristö, spesifioi tarkoitus, rakenna palautesilmukat. Agentit kirjoittavat koodin. | "Humans design environments; agents execute." Karpathy-periaatteet. Information Layering Strategy. |
| **Toteutus** | 3,5 PR/insinööri/päivä → kasvaa tiimin kasvaessa. | Worktree-pohjainen rinnakkaiskehitys, session handover protocol, auto-mode trust boundary. |
| **Valmiusaste** | **80%** — Arkkitehtuuri tukee tätä vahvasti. Throughput-mittarit ja systemaattinen seuranta puuttuvat. |

---

## 4. Yhteenveto: valmiusasteet

| # | Periaate | OpenAI | DWS | Valmiusaste | Status |
|---|----------|--------|-----|-------------|--------|
| 1 | AGENTS.md = kartta, ei tietosanakirja | ~100 riviä | CLAUDE.md + AGENTS.md + JIT L0–L6 | **90%** | Edellä |
| 2 | "Boring technology" voittaa | Vakaat teknologiat | Express 4, React 19, PostgreSQL | **95%** | Edellä |
| 3 | Golden Principles -laadunhallinta | Automaattinen skannaus | 11 standardia + Boardy | **75%** | Osittainen |
| 4 | Arkkitehtuurin mekaaninen valvonta | Linterit + korjausohjeet | ESLint + security rules | **60%** | Kehitettävää |
| 5 | Tieto kuuluu repoon | Kaikki repossa | 71 doc + standardit + field notes | **95%** | Edellä |
| 6 | Agentti-agentti-katselmointi | Ralph Wiggum Loop | Simplify + Boardy + ihminen | **50%** | Tietoinen ero |
| 7 | Compounding Returns | Itsekorjautuva agentti | 10 skilliä + 16 agenttia + MCP | **85%** | Hyvä |
| 8 | Insinöörit ympäristösuunnittelijoina | 3,5 PR/d throughput | Worktree + session handover | **80%** | Hyvä |

**Kokonaisvalmiusaste: ~79%**

---

## 5. Erot OpenAI:n lähestymistapaan

### 5.1 DWS on ratkaissut toisin

| Alue | OpenAI | DWS | Perustelu |
|------|--------|-----|-----------|
| **Kontekstin hallinta** | AGENTS.md ~100 riviä, flat docs/ | 6-kerroksinen L0–L6 hierarkia, JIT-lataus, L6 tool injection | Formaali kerrosarkkitehtuuri skaalautuu paremmin 11 standardin kanssa |
| **Koodikatselmointi** | Täysin agentti-agentti | Ihminen-agentti-yhteistyö (Karpathy) | EU-reguloidut teollisuudet vaativat ihmisen silmukassa |
| **Dokumenttistandardi** | Ei kuvattu | VERSION AND AGENT HISTORY -lohko jokaisessa dokumentissa | Jäljitettävyys, auditointipolku, court-defensible |
| **CLI-ensisijaisuus** | Ei eksplisiittinen vaatimus | "Jos sitä ei voi käyttää `dws <command>`, se ei ole valmis" | Agentit tarvitsevat CLI-rajapinnan, ei GUI:ta |
| **Tietoturva** | Ei painotettu | OWASP, SRI, CORS, RLS, execFile — turvallisuus on ensisijainen | EU AI Act, GDPR, 20 reguloitua toimialaa |
| **Muistiarkkitehtuuri** | Ei kuvattu | L4 Auto-Learned State (Supabase + MEMORY.md) | Agenttien oppiminen sessioiden välillä |
| **12 Factor Agents** | Ei viitata | 12/12 compliance dokumentoitu | Systemaattinen arkkitehtuurin validointi |

### 5.2 Missä OpenAI on edellä

| Alue | Kuvaus | DWS:n seuraava askel |
|------|--------|---------------------|
| **Automaattinen taustaskannaus** | Codex-tehtävät skannaavat poikkeamia, avaavat korjaus-PR:iä automaattisesti | Toteuta golden-principle-scanner CI/CD-pipelineen |
| **Agentti-agentti-katselmointi** | Systemaattinen itsekatselmointi-silmukka | Laajenna `/simplify` + Boardy automaattiseksi PR-katselmoinniksi |
| **Lintterin korjausohjeet** | Virheviesti = agenttikonteksti, sisältää korjausohjeen | Lisää custom linter rules arkkitehtuurisääntöineen |
| **Throughput-mittarit** | 3,5 PR/insinööri/päivä, systemaattinen seuranta | Lisää PR-throughput-dashboard |

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
