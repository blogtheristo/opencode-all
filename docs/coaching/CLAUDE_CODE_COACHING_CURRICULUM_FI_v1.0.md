# Claude Code -valmennus — opetussuunnitelma (FI)

---

# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:

- Version: 1.0 | Tool: Claude Code | Session: code-coaching-curriculum | Commit: pending | Date: 24.06.2026 | Changes: Claude Code -valmennustuotteen (1 pv luento, 2 pv työpaja, valinnainen asiakasprojektityö) ensimmäinen opetussuunnitelma.

Document Status:

- Created: 24.06.2026
- Last Modified: 24.06.2026
- Language: Suomi
- Languages Available: English, Suomi
- Publication Status: DRAFT
- Document Type: Curriculum

---

## Yleiskatsaus

Claude Code -valmennus vie insinööritiimin AI-uteliaasta oikeita muutoksia toimittavaksi Claude
Coden avulla hallitun plan → review → ship -työnkulun kautta. Se tuottaa kaksi asiaa kerralla:
**EU:n tekoälyasetuksen 4 artiklan mukaisen tekoälylukutaidon** ja kestävän **insinöörikurin**
autonomisen koodausagentin kanssa työskentelyyn. Valmennus on EU-suvereenia — asiakkaan koodi ja
immateriaalioikeudet eivät poistu lainkäyttöalueelta.

Tuotteessa on kolme osaa:

1. **1 päivän luento** — perusteet ja yhteinen sanasto (enintään 12 osallistujaa).
2. **2 päivän työpaja** — käytännönläheinen, asiakkaan omassa repositoriossa (enintään 10 osallistujaa).
3. **Valinta: asiakasprojektityö** — upotettu, 2–6 viikon ohjattu toimitus oikeasta backlog-kohteesta.

**Kohderyhmä:** ohjelmistokehittäjät, tekniset vastaavat ja kehityspäälliköt EU:n suuryrityksissä
ja pk-yrityksissä.
**Esitiedot:** osallistujat osaavat kloonata repositorion ja ajaa projektin buildin/testit
paikallisesti; yksi edustava repositorio nimetään ennen työpajaa.
**Toimituskielet:** EN, FI, SV, DE, FR (materiaalit laaditaan englanniksi ja suomeksi).

---

## Osa 1 — 1 päivän luento: "Claude Coden perusteet suvereeneille insinööritiimeille"

Kesto noin 6 tuntia taukoineen. Tavoite: jokainen osallistuja jakaa saman mallin siitä, _miten_
Claude Coden kanssa työskennellään, ja organisaatio saa 4 artiklan lukutaitonäytön.

| Moduuli    | Aika   | Aihe                           | Oppimistulos                                                                                                                       |
| ---------- | ------ | ------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------- |
| M1         | 45 min | Agenttisiirtymä                | Selittää mikä Claude Code on ja mihin CLI- / IDE- / web- / työpöytäpinnat sopivat työnkulussa                                      |
| M2         | 75 min | 12 insinöörikurin sääntöä      | Soveltaa sääntöjä (ajattele ennen koodausta, kirurgiset muutokset, lue ennen kirjoitusta, epäonnistu äänekkäästi…) agenttisessioon |
| M3         | 60 min | Kontekstin suunnittelu         | Kuvata miten `CLAUDE.md`-projektimuisti, taidot, vinoviivakomennot ja MCP-työkalut ohjaavat agenttia                               |
| M4         | 60 min | Luottamus ja turvallisuus      | Luokitella toimet GREEN / YELLOW / RED -luottamusrajaan; selittää EU-suvereniteetti ja IP:n pysyminen alueella                     |
| M5         | 60 min | Live-demo                      | Seurata täyttä plan → implement → review → ship -sykliä ja tunnistaa jokainen kuriportti                                           |
| Yhteenveto | 30 min | Q&A ja käyttöönottosuunnitelma | Lähteä konkreettisen ensimmäisen viikon käyttöönottolistan kanssa                                                                  |

**Arviointi:** lyhyt skenaariotesti (luottamusrajan luokittelu + "mitä oletat vs. mitä kysyt").
Suoritus kirjataan 4 artiklan lukutaitonäytöksi.

---

## Osa 2 — 2 päivän työpaja: "Claude Code käytännössä"

Käytännönläheinen, rakennettu asiakkaan nimeämään repositorioon. Tavoite: tiimi on tuottava heti
työpajan jälkeen, repo on järjestetty agenttipohjaiseen kehitykseen, ja laadunhallinta on
paikallaan.

### Päivä 1 — Tee siitä omasi

- Ympäristö ja asennus; tiimin turvallisuus-/luottamusasetukset
- `CLAUDE.md`-projektimuistin laatiminen oikeaan repoon (konventiot, build/testi, suojaukset)
- Vinoviivakomennot ja taidot: mitä on olemassa, milloin käyttää, ensimmäisen taidon kirjoittaminen
- Suunnittelutila ja rajaus; vain luku -tutkimuksen käyttö ennen muokkausta
- Aliagentit ja rinnakkainen tutkiminen suuremmissa muutoksissa
- Harjoitus: jokainen osallistuja laatii yhden taidon ja yhden `CLAUDE.md`-osion repoon

### Päivä 2 — Toimita kurinalaisesti

- MCP-työkalujen kytkeminen ja työkalujen tulosteen käsittely epäluotettavana syötteenä
- Moniagentti- / työnkulkumallit suurempiin tehtäviin
- Kuriportit: plan → qa → review → ship, ja mitä kukin portti tarkistaa
- Hallinta, auditointiloki ja "kysytty kahdesti = epäonnistuminen" -taitojen kodifiointisääntö
- **Lopputyö:** jokainen osallistuja vie oikean backlog-kohteen täyden kuriportiston läpi ja toimittaa sen
- Retrospektiivi: mitä standardoida, mitä kodifioida taidoiksi seuraavaksi

**Arviointi:** itse lopputyömuutos (arvioidaan tarkoitusta vasten, ei vain käyttäytymistä) sekä
lyhyt tiimiretro, joka tuottaa standardointibacklogin.

---

## Osa 3 — Valinta: asiakasprojektityö (upotettu)

2–6 viikon ohjattu toimeksianto, joka muuttaa työpajan tavat toimitetuiksi tuloksiksi.

- Seniori-insinöörit upottautuvat tiimiin ja soveltavat Claude Codea oikeaan backlog-kohteeseen päästä päähän
- Rakennetaan yhdessä taidot, agentit ja CI-kuriportit, jotka tiimi pitää
- Jäsennelty tiedonsiirto, jotta tiimi on itsenäinen lopussa
- EU-suvereenia koko ajan; tulosperusteinen hinnoittelu ja toimeksiantokohtainen rajaus

Projektijakso rakentaa **IPR-pääomaa, jonka yritys omistaa**, ei konsultointitunteja.
Esimerkkiprojekteja: toimiva **verkkokauppa + tuotteistus** (JSON-pohjainen hinnoittelu, Google
Merchant -syöte, monikieliset tuotesivut); **dynaamiset monikieliset verkkosivut**, jotka
renderöityvät datasta; **yrityksen oma tekoälypalvelin** (EU-suvereeni päättely omalla raudalla,
nolla datavuotoa); ja **uudelleenkäytettävät agentit & taidot** (compliance-automaatio,
CI-kuriportit).

**Valmiin määritelmä:** valittu backlog-kohde toimitetaan kuriportiston läpi; tiimi omistaa
vähintään kolme uudelleenkäytettävää taitoa ja vihreän kuriporttiputken; lyhyt luovutusmuistio
kirjaa mitä kodifioitiin ja mitä jää jäljelle.

---

## Tulokset ja näyttö

| Tulos                                             | Tuotettu näyttö                                |
| ------------------------------------------------- | ---------------------------------------------- |
| Yhteinen sanasto johdon ja insinöörien kesken     | Luennon läsnäolo + skenaariotestin tulokset    |
| Claude Code tuottava asiakkaan koodikannassa      | Laadittu `CLAUDE.md`, taidot ja lopputyömuutos |
| Laadunhallinta, joka kestää toimeksiannon yli     | Kuriporttiputki + kodifioidut taidot           |
| EU:n tekoälyasetuksen 4 artiklan tekoälylukutaito | Opetussuunnitelma-aineisto + suoritusloki      |

## Ylläpito

Tämä opetussuunnitelma pidetään lukkostiketissä englanninkielisen vastineensa
(`CLAUDE_CODE_COACHING_CURRICULUM_EN_v1.0.md`) kanssa. Kaikki muutokset toiseen on heijastettava
toiseen samassa committissa. Tuotekuvauksessa viitattu hinnoittelu on vain tiedostossa
`dws10.com/config/products.json`.
