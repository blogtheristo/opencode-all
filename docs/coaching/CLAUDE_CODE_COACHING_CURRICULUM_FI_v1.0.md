# Claude Code -valmennus — opetussuunnitelma (FI)

---

# VERSION AND AGENT HISTORY

Version: 1.2

Sessions & Modifications:

- Version: 1.0 | Tool: Claude Code | Session: code-coaching-curriculum | Commit: pending | Date: 24.06.2026 | Changes: Claude Code -valmennustuotteen (1 pv luento, 2 pv työpaja, valinnainen asiakasprojektityö) ensimmäinen opetussuunnitelma.
- Version: 1.1 | Tool: Claude Code | Session: team-ethos-coaching | Commit: pending | Date: 27.06.2026 | Changes: Lisätty liite A — Team Ethos -tapaustutkimus (Mustafa Suleyman, Microsoft AI) ja kartoitus DWS:n 12 sääntöön; viitattu moduulista M2.
- Version: 1.2 | Tool: Claude Code (Opus 4.8) | Session: claude/consultant-handbook-v1-6-622fep | Commit: pending | Date: 28.06.2026 | Changes: Lisätty liite B — "Augment, not replace" -moduuli (eettinen AI + EU AI Act Art. 4/12/14 -lukutaito, roolit→kyvykkyydet-kehys, arkkityyppi×kypsyysmix, /dialog-työmenetelmä). Lähteinä käsikirja v1.75 §2/§6 ja whitepaper WP01. EN+FI lockstep.

Document Status:

- Created: 24.06.2026
- Last Modified: 27.06.2026
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

| Moduuli    | Aika   | Aihe                           | Oppimistulos                                                                                                                                                                        |
| ---------- | ------ | ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| M1         | 45 min | Agenttisiirtymä                | Selittää mikä Claude Code on ja mihin CLI- / IDE- / web- / työpöytäpinnat sopivat työnkulussa                                                                                       |
| M2         | 75 min | 12 insinöörikurin sääntöä      | Soveltaa sääntöjä (ajattele ennen koodausta, kirurgiset muutokset, lue ennen kirjoitusta, epäonnistu äänekkäästi…) agenttisessioon. Tapaustutkimus: liite A — Team Ethos (Suleyman) |
| M3         | 60 min | Kontekstin suunnittelu         | Kuvata miten `CLAUDE.md`-projektimuisti, taidot, vinoviivakomennot ja MCP-työkalut ohjaavat agenttia                                                                                |
| M4         | 60 min | Luottamus ja turvallisuus      | Luokitella toimet GREEN / YELLOW / RED -luottamusrajaan; selittää EU-suvereniteetti ja IP:n pysyminen alueella                                                                      |
| M5         | 60 min | Live-demo                      | Seurata täyttä plan → implement → review → ship -sykliä ja tunnistaa jokainen kuriportti                                                                                            |
| Yhteenveto | 30 min | Q&A ja käyttöönottosuunnitelma | Lähteä konkreettisen ensimmäisen viikon käyttöönottolistan kanssa                                                                                                                   |

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

---

## Liite A — Tapaustutkimus: Team Ethos (Mustafa Suleyman, Microsoft AI)

Käytetään **moduulissa M2** osoittamaan, miten alan johtajat päätyvät itsenäisesti samoihin
kuriperiaatteisiin. Osallistujat vertaavat Suleymanin eetosta DWS:n 12 sääntöön ja tunnistavat,
mitä periaatteita heidän tiiminsä jo noudattaa ja mitä pitäisi omaksua.

### Periaatteet

> Kaikki alla oleva kumpuaa yhdestä vakaumuksesta: kurinalaisesti, näyttöön perustuen ja
> huolellisesti etenevä menetelmä korkoa-korolle-kasvaa nopeammin kuin sankarillinen ja
> kaoottinen improvisaatio.

1. **Tieteellinen kurinalaisuus ennen kaikkea.** Aseta hypoteesit, ablatoi perusteellisesti ja tee
   dataan perustuvia päätöksiä.
2. **Ajattele jatkuvasti yksinkertaisesti.** Yksinkertaiset menetelmät skaalautuvat parhaiten. Ei
   reseptimuutoksia ilman syvällistä perustetta.
3. **Tunne datasi.** Data on elinehto. Ei datamustalaatikoita. Jokainen on vastuussa jokaisesta
   tokenista, jonka lisää malliin.
4. **Tunne evalisi.** Ei tarinoita ilman lukuja. Tuotantoevalit ja sisäiset mittarit yli
   akateemisten vertailuarvojen.
5. **Älä juhli tuloksia ennenaikaisesti.** Ylläpidä tervettä skeptisyyttä. Tarkista
   palkitsemishakkerointi. Älä koskaan valikoi tuloksia.
6. **Dokumentoi kaikki aina.** Positiiviset ja negatiiviset tulokset ovat yhtä tärkeitä. Merkitse
   jokainen kuvaaja ja akseli. Tiivistä hypoteesit ja johtopäätökset. Älä käytä jargonia.
7. **Ole täsmällinen ja käytä neutraalia kieltä.** Kuvaile tilanteita tarkasti ilman tarpeetonta
   tunne-energiaa.
8. **Retrospektiivit ohjaavat kaikkea.** Kulttuuri- ja prosessivauhtipyörä on kriittinen
   mäkikiipeämiskoneellemme. Ajamme jatkuvasti retroja iteroidaksemme ja parantaaksemme.
9. **Olemme IC-ensimmäinen tiimi.** Johtaminen on palvelu, ei päämäärä. Olemme täällä
   voimaannuttamassa, poistamassa esteitä ja kiihdyttämässä maailmanluokan IC-tiimiläistemme työtä.
10. **Käyttäjäfokus.** Rakennamme mallimme loppukäyttäjille. Käyttäjäempatian kehittäminen alkaa
    meistä. Pyrimme aina käyttämään omia mallejamme ensin, jotta voimme optimoida käyttäjillemme.
11. **Ota vastuu toteutuksesta.** Raportoi ongelmat, toimita lokit debuggausta varten. Yritä ensin
    korjata itse. Ja vie loppuun asti.

_Lähde: Mustafa Suleyman, Microsoft AI:n toimitusjohtaja, kesäkuu 2025._

### Kartoitus DWS:n 12 sääntöön

| Suleymanin periaate              | DWS:n 12 sääntöä                                      | Valmennuskeskustelupiste                                                                        |
| -------------------------------- | ----------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| Tieteellinen kurinalaisuus       | 1 — Ajattele ennen koodausta                          | Molemmat vaativat eksplisiittisiä hypoteeseja ennen toimintaa                                   |
| Ajattele yksinkertaisesti        | 2 — Yksinkertaisuus ensin                             | "Ei reseptimuutoksia ilman perustetta" = hylkää spekulatiiviset abstraktiot                     |
| Tunne datasi                     | 8 — Lue ennen kirjoitusta                             | Ymmärrä materiaali (data/koodi) ennen muuttamista                                               |
| Tunne evalisi                    | 9 — Testit todistavat tarkoituksen, ei vain toimintaa | Tuotantoevalit ylittävät turhamaisuusmittarit; testit, jotka eivät voi epäonnistua, ovat vääriä |
| Älä juhli ennenaikaisesti        | 12 — Epäonnistu äänekkäästi                           | Terve skeptisyys estää hiljaisen onnistumisen rikkoutuneella pohjalla                           |
| Dokumentoi kaikki                | 10 — Tarkistuspiste joka merkittävässä vaiheessa      | Dokumentaatio on tarkistuspiste; negatiiviset tulokset ovat yhtä arvokkaita kuin positiiviset   |
| Täsmällinen, neutraali kieli     | 7 — Tuo ristiriidat esiin, älä keskiarvoista niitä    | Täsmällisyys estää virheitä piilottavan sekoittamisen                                           |
| Retrospektiivit ohjaavat kaikkea | Oppimissilmukka (`/retro` → `/learn`)                 | Molemmat käsittelevät prosessivauhtipyörää korkoa-korolle-moottorina                            |
| IC-ensimmäinen tiimi             | 5 — Malli vain harkintapäätöksiin                     | Voimaannuta työtä lähinnä olevat ihmiset (IC:t/agentit); johtaminen/orkestrointi on palvelua    |
| Käyttäjäfokus                    | 4 — Tavoiteohjattu toteutus                           | Määritä onnistuminen käyttäjän näkökulmasta, ei rakentajan                                      |
| Ota vastuu toteutuksesta         | 4 — Tavoiteohjattu toteutus                           | Vie loppuun asti; iteroi kunnes todennettu                                                      |

### Harjoitus (15 min, osa M2:ta)

1. Jokainen osallistuja valitsee Suleymanin periaatteen, jossa heidän tiiminsä on **vahvin**, ja
   sen, joka eniten **pitäisi omaksua**.
2. "Omaksuttavalle" periaatteelle kirjoitetaan yksi konkreettinen toimenpide, jonka he tekevät
   ensimmäisellä Claude Code -viikollaan (esim. "lisään `/retro`-taidon repoomme" tai "vaadin
   eval-lukuja jokaiseen PR-kuvaukseen").
3. Jaetaan pareittain; jokainen pari raportoi parhaan toimenpiteensä ryhmälle.

**Ajattelumme laatu määrittää malliemme — ja koodimme — laadun.**

---

## Liite B — Moduuli: Augment, not replace (eettinen AI + EU AI Act -lukutaito)

**Milloin:** Komponentti 1 (luento) ja Komponentti 2, päivä 1. **Lähde:** whitepaper WP01 "Augment, Not Replace"; käsikirja §2 (Ihmiskeskeisyys), §6 (kyvykkyysmalli + elinkaari).

### Kanta

- **Kyvykkyys, ei headcount. Augmentoi, älä korvaa.** Emme pyri vähentämään asiakkaan työvoimaa; henkilöstöstä päättää johto. AI tuo uutta kyvykkyyttä, joka nostaa tuottavuutta ihmisen rinnalla, ei tilalle.
- Tämä on sekä eettinen (ihmisarvo, human-in-the-loop) että strateginen (säännelty ostaja torjuu "korvaa tiimisi" -viestin; ostaa "moninkertaista tiimisi").

### EU AI Act -lukutaito (mitä jokaisen valmennettavan insinöörin on tiedettävä)

- **Artikla 4 — AI-lukutaito** (voimassa 02/2025): AI:ta käyttävät tiimit on koulutettava ymmärtämään se.
- **Artikla 12 — lokitus:** jokainen korkean riskin AI-toiminto on auditoitavissa; hash-ketjutettu, muuttumaton.
- **Artikla 14 — ihmisvalvonta:** ihminen pysyy päätöksentekijänä; agentti hoitaa rutiinin.

### Roolit muuttuvat kyvykkyyksiksi (opetuskehys)

- 72 IT-roolia → 88 kyvykkyyttä, skilliä, työnkulkua ja oppimissilmukkaa (Gödel-loops). Rooli säilyy ihmisellä; agentti tekee siitä nopeamman.
- Tuotekehityksen arkkityypit (Prototyper / Builder / Sweeper / Grower / Maintainer) kartoittuvat elinkaaren vaiheisiin; oikea mix riippuu tuotteen ja toimialan kypsyydestä. Opeta osallistujat tunnistamaan vaihe ja painottamaan oikeat kyvykkyydet.

### `/dialog`-työmenetelmä (käytännössä)

- HIC-vahvistettu, rivi riviltä etenevä tapa päivittää dokumentti, tarjous tai liite: ehdota muutos, ihminen hyväksyy tai vastaehdottaa, sovella ja checkpoint. Erityisen hyödyllinen tarjouksen uudelleenkäytössä asiakkaalta toiselle (esim. ORK → Kemira). Näytä live M2:ssa.

### Harjoitus (15 min)

1. Jokainen kirjoittaa yhdellä lauseella, miten agentti **augmentoisi** (ei korvaisi) yhtä tehtävää omassa roolissaan.
2. Kartoita tehtävä elinkaaren vaiheeseen (Kehitys / Käyttöönotto / Ylläpito / Päivitys) ja nimeä human-in-the-loop-tarkistuspiste.
3. Jaa pareittain; raportoi yksi esimerkki per pari.

**Toteutus voidaan jakaa koneiden kanssa. Visio, harkinta ja vastuu pysyvät ihmisellä.**
