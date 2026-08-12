# PhD-työn rakenneauditointi — sama ongelma kuin master-työn v3.30:ssa

***

# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:

- Version: 1.0 | Tool: Claude Code | Session: claude/greg-isenberg-field-notes-a2r544 | Date: 25.07.2026 | Changes: Luotu HIC:n havainnosta (*"Huomaan että phd työn kanssa on sama ongelma"* · *"Löytö master thesis 3.30 osalta että se oli lopputyönä lukukelvoton jonka sitten korjasin"*). Auditoitu `PHD_FIREHORSE_FI.md` v3.86 rakenne ja löydetty seitsemän vikaa, joista vakavin koskee tutkimuskysymysten numerointia. Kirjattu kokoviennin este ja tehty osittainen vienti Driveen.

***

## Havainto ja sen tausta

HIC:n havainto oli kaksiosainen:

> *"Huomaan että phd työn kanssa on sama ongelma."*
> *"Löytö master thesis 3.30 osalta että se oli lopputyönä lukukelvoton jonka sitten korjasin."*

Master-työn v3.30 oli **lukukelvoton lopputyönä** — ei sisällöltään vaan rakenteeltaan — ja se korjattiin ennen palautusta. Sama tarkistus tehtiin nyt väitöskirjalle. **Havainto pitää paikkansa.**

## Miksi tämä toistuu — mekanismi

Molemmat dokumentit ovat kasvaneet **istunto istunnolta lisäämällä**. `PHD_FIREHORSE_FI.md`:n alaluvut 14.9–14.43 ovat kronologinen signaalipäiväkirja: jokainen on kirjoitettu huolellisesti, mutta jokainen on lisätty tiedoston loppuun sillä hetkellä kun se syntyi. Numerointia ja sijoittelua ei ole kertaakaan sovitettu kokonaisuuteen.

**Lopputulos on työpäiväkirja, joka käyttää väitöskirjan otsikkorakennetta.**

Tämä on täsmälleen sama ilmiö, jonka `V3Thesis` §10.27 nimeää **artefakti–legitimiteetti-aukoksi**, mutta yhtä kerrosta alempana: kun tuottaminen on halpaa ja **yhteensovittaminen** kallista, yhteensovittaminen jää tekemättä — ja dokumentti näyttää valmiimmalta kuin on.

## Seitsemän vikaa

### 🔴 1. Tutkimuskysymysten viittaukset ovat yhden pielessä — sisällöllisesti vakavin

`§1.2` luettelee **seitsemän** kysymystä. Suvereniteetti lisättiin ykköseksi, ja loput siirtyivät yhdellä.

`§1.2.2` viittaa yhä **vanhaan kuuden kysymyksen numerointiin** ja sanoo sanatarkasti *"Kuusi aiempaa tutkimuskysymystä (§1.2)"*:

| §1.2.2 sanoo | Tarkoittaa | §1.2:ssa |
| ------------ | ---------- | -------- |
| RQ1 | poikkitoimialaiset ontologiat | **2** |
| RQ2 | KYA-standardi | **3** |
| RQ3 | standardointipolku | **4** |
| RQ4 | agenttinen kaupankäynti | **5** |
| RQ5 | EU eWallet | **6** |
| RQ6 | transaktioprimitiivit | **7** |

Jokainen viittaus on väärä, myös skenaarioiden pisteytystaulukossa. **Kysymys 1 (suvereniteetti) ei saa yhtään viittausta**, vaikka sen on tarkoitus olla se lanka, joka sitoo muut yhteen.

**Tämä on lukukelvoton kohta juuri siinä osassa, jonka ohjaaja lukee ensimmäisenä.**

### 2. Kaksi lukua numerolla 15, kaksi lukua samalla otsikolla

`14. Tulokset ja pohdinta` · `15. Tulokset ja pohdinta` · `15. Johtopäätökset`.

### 3. Luvun 15 alaluvut numeroitu 13.1, 13.2, 13.3

Väärä isäntäluku.

### 4. Luku 14 jatkuu liitteiden jälkeen — 29 alalukua väärässä paikassa

`17. Liitteet` alkaa rivillä 1693, Liite A–E seuraavat, ja rivillä **1819** alkaa `14.9 Climate IQ Pantheon`. Luku 14 jatkuu **14.10 → 14.43** liitteiden sisällä, lomittain Liite F:n, G:n ja H:n kanssa.

**Lähdeluettelo on ennen puolta luvun 14 sisällöstä.**

### 5. Alaluku 14.38 puuttuu

Numerointi hyppää 14.37 → 14.39.

### 6. Koodikommentti karannut otsikoksi

Rivi 629: `# Viikoittainen syotelataus Google Merchant Centeriin` — tason 1 otsikko keskellä alalukua 6.3.

### 7. Diakriittiset merkit kadonneet otsikoista

`Tyonkulkuesimerkit` · `Yllapidon` · `Saannoksen` · `paastokertoimet` · `Sisaltyvat` · `Jarjestelmapromptin` · `Tuleva tyo` · `Taysi` · `syotelataus` · `hiilijprofiilin` (myös kirjoitusvirhe). Järjestelmällinen ä/ö-kato — todennäköisesti yksi koodauskäsittely.

Lisäksi liitteet A–F ovat `###` ja liitteet G–H `##`.

## Mitä tämä ei ole

**Ei sisällöllinen puute.** Alaluvut 14.19–14.43 sisältävät työn tuoreimman ja kunnianhimoisimman ajattelun — emergentti väärinkohdistus, kolmen pilarin suvereniteettitaksonomia, neljän pääoman malli, hinnoittelukapitulaatio. Ongelma on, ettei kukaan ulkopuolinen pysty lukemaan niitä siinä järjestyksessä kuin ne on kirjoitettu.

**Korjaus on rakenteellinen** — sama luonne kuin master-työn v4.2:ssa. Mitään ei kirjoiteta uudelleen; asiat siirretään oikeisiin paikkoihin ja numeroidaan johdonmukaisesti.

## ✅ Yksi olennainen ero master-työhön

**Väitöskirjaa ei ole julkaistu.**

Korjaus ei vaadi kirjastoa, korjauspyyntöä, tiedoston vaihtoa eikä korjaushuomautusta. Se on sisäinen työ, jonka voi tehdä milloin tahansa ennen kuin dokumentti menee ohjaajalle. **Aikaikkuna on auki, toisin kuin master-työssä 10.07.2026 jälkeen.**

Tämä on juuri se tilanne, jonka `DWS_LEARNING_STANDARD.md` §10.3.1 (jäähdytysväli) on tarkoitettu suojaamaan: peruuttamaton askel on vielä ottamatta.

## Vienti Driveen — osittainen, ja miksi

HIC pyysi v3.86:n suomenkielisen version viemistä Driveen nimellä *PhD 4.x*.

**Kokovienti ei onnistunut.** Lähdetiedosto on **552 KB / 3 500 riviä**; Drive-työkalu ottaa sisällön kutsuargumenttina, eikä tuon kokoinen teksti mahdu. Tämä on sama este, joka on estänyt Learning Standardin vaiheen 4 yhdeksän kertaa peräkkäin — **se ei ole unohdus vaan toteuttamaton vaihe.**

**Tehty sen sijaan:** [PhD 4.0 FI — tutkimuskysymykset ja rakenne](https://docs.google.com/document/d/1Xfd2qu6xTd7164acVELzoDQA4mhOvpbdIp-iJlzqmjM/edit) — sisältää sen, mitä varten vientiä pyydettiin: **kaikki seitsemän tutkimuskysymystä sanatarkasti**, ohjaajan viisi kysymystä, DWS OS -kehystys pisteytystaulukoineen, koko rakennekartta ja tämä vikalista.

**Repositorio pysyy lähteenä.** Drive-kappale on työkappale, ei rinnakkainen totuus.

## Suositeltu korjausjärjestys

1. **Tutkimuskysymysten viittaukset ensin** (vika 1). Se on ainoa, joka tekee tekstistä väärän eikä vain sekavan — ja se on ohjaajalle näkyvin kohta.
2. **Luvun 14 alaluvut liitteiden edelle** (vika 4). Suurin siirto, mutta puhtaasti mekaaninen.
3. **Lukunumeroinnin ristiriidat** (viat 2, 3, 5).
4. **Koodilohkon otsikko ja otsikkotasot** (viat 6 ja liitteet).
5. **Diakriittiset merkit** (vika 7) — hae-ja-korvaa otsikoista.

Vasta tämän jälkeen kannattaa lukea sisältöä kokonaisuutena: nyt lukukokemus katkeaa niin usein, ettei sisällöllinen arvio ole luotettava.
