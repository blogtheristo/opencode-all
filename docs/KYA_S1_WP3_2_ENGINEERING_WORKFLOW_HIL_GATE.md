# Boardy Audit: ENGINEERING WORKFLOW & HIL GATE

## KYA-S1 WP3.2 -liite, v0.1

***

# VERSION AND AGENT HISTORY

Version: 0.1

Sessions & Modifications:

- Version: 0.1 | Tool: Gemini 3.7 Flash | Session: boardy-audit-wp3-2 | Date: 14.08.2026 | Changes: Alustava KYA-S1 WP3.2 -liitedokumentaatio ja Boardy-auditointipohja: paikallinen edge-kehitys (DGX Spark OpenCode 1.18.18 + Ollama [DeepSeek V4 Flash, Qwen3 Coder, Nemotron-3-Super]), GitHub Copilot CLI -orkestrointi, Google Gemini 3.7 Flash HIL -laatuportti sekä Claude Code hot standby -eskalointi.

Document Status:

- Last Modified: 14.08.2026
- Language: Finnish
- Publication Status: DRAFT
- Document Type: KYA-S1 Specification Appendix (WP3.2)

***

## 1. Tavoite

Mahdollistaa nopea paikallinen kehitys ilman, että asiakas-, tuotanto- tai salainen data poistuu suvereenista ympäristöstä. Jokainen muutos kulkee toistettavan laadunvarmistusportin läpi ennen yhdistämistä tai edge-jakelua.

---

## 2. Työvirta

### A. LOCAL CODING & EDGE AGENTS
- **OpenCode 1.18.18** DGX Sparkilla (Acer Veriton GN100).
- **Ollama** paikallisena runtime-kerroksena (http://127.0.0.1:11434/v1).
- **DeepSeek V4 Flash** ja **Qwen3 Coder**: koodaus ja nopeat paikalliset muutokset.
- **Nemotron-3-Super**: domain-päättely ja Lifetime World Model (LWM) -käsittely.
- Tuotanto-, asiakas- ja luottamuksellinen data pysyy paikallisessa tai erikseen hyväksytyssä EU-suvereeniympäristössä (nollamarginaalikustannus, zero CLOUD Act exposure).

### B. REPOSITORY ORCHESTRATION
- **GitHub Copilot CLI** vastaa repo-refaktoroinnin, branchien, testiajon ja git-flow'n orkestroinnista suoraan kehittäjän työasemalla ja etäterminaalissa.
- Jokainen automaattinen muutos tuottaa jäljitettävän diffin, testitulokset ja commit-viitteen.
- Agentti ei saa ohittaa review- tai hyväksyntäporttia.

### C. CLOUD REVIEW & HIL GATE
- **Gemini 3.7 Flash** toimii pakollisena PR-review- ja HIL-laatuporttina GitHub Actions CI/CD -putkessa (.github/workflows/ai-pr-review.yml).
- Pilveen lähetetään vain yksi seuraavista: synteettinen testidata, redaktoitu diffi/metatieto tai erikseen hyväksytty EU-sijaintinen ja sopimuksellisesti sallittu aineisto.
- Raaka tuotanto-, asiakas-, henkilötieto- tai muu luottamuksellinen data ei kuulu oletusarvoisesti pilvikatselmukseen.
- Gate tarkistaa PR:n, testit, rajapintamuutokset, regressiot, multimodaalisen aineiston ja määritellyt KYA-S1-konformanssitestit hyödyntäen laajaa 1M+ konteksti-ikkunaa.

### D. HOT STANDBY
- **Claude Code** (Claude 3.7 Sonnet / Fable / Opus) otetaan käyttöön vain kompleksisissa arkkitehtuuri- tai virhetilanteissa.
- Fallback tuottaa päätösperusteen, ehdotetun korjauksen ja uuden testitapauksen. Se ei hyväksy muutosta yksin.

---

## 3. Hyväksyntäportin ehdot

Pull Request voidaan hyväksyä vain, kun:
- 
pm run build ja yksikkötestit onnistuvat virheittä.
- KYA-S1:n deterministiset konformanssitestit onnistuvat.
- Replay-, rinnakkaisajo-, kill-switch-, vanhentunut attestaatio- ja TOCTOU-testit on suoritettu.
- Input snapshot, kaavaversio, testiversio ja commit ovat jäljitettävissä.
- Salassapito- ja datarajaus on todennettu (ei salaisuuksien tai PII-datan ulosvirtausta).
- Epäselvä tai puutteellinen tulos johtaa hylkäykseen tai manuaaliseen arvioon, ei koskaan hiljaiseen hyväksyntään (Fail Loud -periaate, insinöörikurin sääntö 12).

---

## 4. Vastuut ja päätökset

- **Paikallinen agentti:** Ehdottaa ja toteuttaa muutokset lokaalisti DGX Spark -alustalla.
- **Copilot CLI:** Orkestroi repo-operaatiot, testit ja haarautumisen.
- **Gemini 3.7 Flash:** Arvioi PR:n ja HIL-tulokset rajatulla aineistolla osana automatisoitua laadunvalvontaa.
- **Ihminen (Human-in-Command, HIC):** Hyväksyy merge- ja tuotantopäätöksen (EU AI Act artikla 14 ihmisvalvontavelvoite).
- **Claude Code:** Avustaa vaikeissa poikkeamissa ja arkkitehtuurikysymyksissä, mutta ei toimi itsenäisenä hyväksyjänä.

---

## 5. KYA-S1-yhteys

Workflow toteuttaa käytännössä jäljitettävyyden, version sidonnan, ympäristön hallinnan, fail-closed-ajattelun ja toistettavan audit trailin (EU AI Act artikla 12). Tämä dokumentti kuvaa kehitys- ja testausprosessia. Se ei ole väite riippumattomasta tuotantovalidoinnista, sertifioinnista tai lopullisesta standardista.

---

## 6. WP3.2:n konkreettinen tuotos

- **Versionhallittu test suite:** Automatisoidut konformanssi- ja regressiotestit.
- **Testikohtaiset input snapshotit ja odotetut päätökset:** Deterministinen testisyötekanta.
- **HIL-raportti hyväksytyistä ja hylätyistä ajoista:** Strukturoitu katselmushistoria.
- **Poikkeamarekisteri ja korjaavat commitit:** Korjausketjun dokumentointi.
- **Koneellisesti tuotettu hyväksyntäpaketti:** Valmis aineisto myöhempää ulkoista ja sisäistä auditointia varten.

***

Lifetime Oy | Y-tunnus: 0772407-9 | Laidunmaanraitti 2 A 25, 02330 Espoo
