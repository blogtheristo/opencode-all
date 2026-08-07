Status: DRAFT
Slug: kya-s1-one-signed-page
Title: Tunne agenttisi — yksi allekirjoitettu sivu tekoälystä, joka koskee dataasi
Language: fi
Target: onelifetime.world/posts/kya-s1-one-signed-page.fi.html
Date: 2026-08-06
Note: Lukijaystävällinen uudelleenkirjoitus HIC:n ohjeesta (06.08.2026) — aiempi versio oli liian tekninen ja lyhyt lukijalle, joka ei tunne agentteja eikä KYA:ta. Jokainen termi avataan. Ääni DWS_BLOG_STANDARD §12 (Seth Godin -talotyyli). KYA-S1 on spesifikaatio, ei standardi (HIC-korjaus 06.08.2026, Legal/KYA_S1.md v1.3). Tämä FI-versio on käännöspohja; HIC vie Geminiin muille kielille.

# Tunne agenttisi — yksi allekirjoitettu sivu tekoälystä, joka koskee dataasi

Ostajan muistio · 6. elokuuta 2026 · Risto Anton Päärni · Espoo

## Uutinen yhdellä lauseella

Julkaisemme tänään KYA-S1 v1.3:n. Se on yksi allekirjoitettu sivu, joka kertoo ostajalle kolme asiaa tekoälyagentista: kuka on sen takana, mitä se saa tehdä ja miten se pysäytetään. Luonnos on avoinna kommenteille 4. marraskuuta 2026 asti.

## Aloitus: se tylsä kansio

Jokaisella yrityksellä on kansio.

Siinä on paperi jokaisesta toimittajasta. SOC 2 -raportti kertoo, että ulkopuolinen tarkastaja on käynyt läpi toimittajan tietoturvakäytännöt. ISO 27001 kertoo saman toisella kielellä. GDPR-liite kertoo, miten henkilötietoja käsitellään. Jokaisessa on allekirjoitus ja päivämäärä, jolloin se pitää uusia.

Kansio on tylsä. Se on myös se paikka, jossa yritys päättää, kuka päästetään sisään.

Tekoälyagentista ei ole kansiossa paperia. Sellaista ei ollut olemassa. Siksi kirjoitimme sen.

## Ensin: mikä tekoälyagentti oikeastaan on?

Tavallinen tekoäly vastaa kysymykseen. Kirjoitat sille, se kirjoittaa takaisin. Vastaus voi olla väärä, mutta se on vain teksti ruudulla.

Agentti tekee tekoja. Se avaa järjestelmiä, kirjoittaa tietokantaan, lähettää ilmoituksen viranomaiselle, käynnistää laitteen tuotantolinjalla. Se ei pysähdy kysymään lupaa jokaiseen väliaskeleeseen — juuri sitä varten se on olemassa.

Siinä on ero, jonka takia hankinta tarvitsee uuden paperin. Chat-vastaus on mielipide. Agentin teko on tapahtuma, joka näkyy sinun järjestelmässäsi ja jää sinun vastuullesi.

## Pankeilta lainattu ajatus: KYC → KYA

Pankeilla on ollut vuosikymmeniä sääntö nimeltä **KYC** — _Know Your Customer_, tunne asiakkaasi. Pankki ei saa ottaa rahaa vastaan tuntemattomalta. Sen on tiedettävä, kuka kävelee ovesta sisään, ja pystyttävä todistamaan se jälkikäteen.

**KYA** on sama ajatus siirrettynä tekoälyyn: _Know Your Agent_, tunne agenttisi.

Jos ohjelmisto tekee tekoja sinun järjestelmissäsi, sinun on tiedettävä kuka sen takana on, mitä se saa tehdä ja miten se pysäytetään. Ei siksi, että tekoäly olisi vaarallista. Siksi, että vastuu ei katoa minnekään — se jää sinulle.

## Mitä sillä sivulla lukee

Yksi sivu. Kaksi allekirjoitusta: toimittajan ja riippumattoman arvioijan.

**Riippumaton arvioija** tarkoittaa ulkopuolista tahoa, jolla on pätevyys tarkastaa väitteet ja joka ei myy sinulle sitä tuotetta. Sama rooli kuin tilintarkastajalla tilinpäätöksessä.

Sivulla on toimittajan nimi, arvioijan nimi, arviointipäivä, seitsemän tarkastettua kohtaa ja päivämäärä, jolloin paperi vanhenee.

Siinä kaikki. Loput spesifikaatiosta on olemassa vain siksi, että tuo yksi sivu tarkoittaisi jotain.

## Seitsemän kysymystä, jotka arvioija käy läpi

Jokainen kohta on kysymys, jonka ostaja esittää ennen kuin agentti pääsee käsiksi hänen dataansa. Suluissa on lyhenne, jota spesifikaatio käyttää.

**1. Tiedetäänkö, kuka teon takana on? (IDV)**
Jokainen agentin teko on jäljitettävissä todennettuun ihmiseen. Ei "järjestelmä teki sen", vaan nimi. Kun ihmisen oikeudet muuttuvat tai hän lähtee talosta, muutos leviää koko agenttijoukkoon sovitussa ajassa.

**2. Onko agenttia koeteltu oikeilla hyökkäyksillä? (BHM)**
Agentille on rakennettu käyttäytymisen perustaso — mikä on sille normaalia. Sitten sitä vastaan hyökätään jatkuvasti, samoilla tavoilla joita hyökkääjät oikeasti käyttävät. Poikkeamat pysäytetään ajossa, eikä pysäytyksestä jää pelkkä muistikuva vaan allekirjoitettu merkintä.

**3. Osaatko sanoa juuri nyt, mitkä agentit koskevat dataasi? (REG)**
Elävä luettelo jokaisesta käynnissä olevasta agentista: kuka ihminen sen takana on, mitä se ilmoitti osaavansa ennen käynnistystä, mitä mallia se ajaa. Kysyttävissä milloin tahansa, myös silloin kun verkkoyhteys on poikki.

**4. Kun jokin menee pieleen, kuinka nopeasti se pysähtyy? (TC4)**
Agentti voi käynnistää toisia agentteja. Jos ketju menee vinoon, koko ketju on katkaistava — ei vain se ensimmäinen. Ja päätösjälki on säilytettävä, jotta jälkikäteen voidaan selvittää mitä tapahtui.

**5. Jos päädytään käräjille, kuka vastaa mistä? (FLT)**
Valmis luokittelu: oliko vika mallissa, logiikassa, integraatiossa, käyttäjässä vai politiikassa. Jokainen tapaus luokitellaan 72 tunnin sisällä. Vastuunjako lakkaa olemasta väittely ja muuttuu hakukysely.

**6. Onko lupa voimassa nyt, vai myönnettiinkö se viime keväänä? (TRS)**
Elävä luottamuspistemäärä jokaiselle istunnolle. Jos pisteet putoavat alle sovitun rajan, merkittävät teot estyvät automaattisesti. Jokainen muutos kirjataan syineen.

**7. Voiko päätöksen toistaa kahden vuoden päästä? (PRV)**
Jokainen tallennettu tieto kantaa mukanaan lähteensä, aikaleimansa ja sen, kuinka varma siitä oltiin. Jokainen merkittävä päätös on toistettavissa alkuperäisillä tiedoilla — myös silloin kun malli on sittemmin vaihtunut.

## Mitä laki sanoo — ja mitä se ei sano

EU:n tekoälyasetuksen **artikla 50** tuli sovellettavaksi 2. elokuuta 2026. Tässä kannattaa olla tarkkana, koska kyse on kolmesta eri velvoitteesta, joita sekoitetaan jatkuvasti keskenään.

- **Artikla 12** on kirjanpitoa: lokia on kerättävä niin, että järjestelmän toimintaa voi jäljittää sen koko eliniän ajan.
- **Artikla 14** on ihmisen valvontaa: on oltava ihminen, joka ymmärtää, valvoo ja voi kumota.
- **Artikla 50** on merkitsemistä: tekoälyn tuottama sisältö on merkittävä sellaiseksi.

KYA-S1 sivuaa kaikkia kolmea. Mutta sivuaminen ei ole sama kuin täyttäminen.

> **Rehellinen kohta:** KYA-S1 -arviointi tuottaa aineistoa, joka on näiden artiklojen kannalta merkityksellistä. Se ei täytä niitä. Jos joku toimittaja — me mukaan lukien — sanoo "olemme KYA-S1:n mukaisia, siis olemme EU:n tekoälyasetuksen mukaisia", hän myy sinulle jotain mikä ei pidä paikkaansa. Artikla 50:ssä on kolme poikkeusta joita spesifikaatio ei koodaa, ja se onko järjestelmä ylipäätään korkean riskin järjestelmä, on kokonaan oma arviointinsa.

## Miksi emme myönnä todistusta itsellemme

Kuka tahansa voi kirjoittaa spesifikaation. Se on täsmälleen niin arvokas kuin se, joka allekirjoittaa sen toisena.

Siksi KYA-S1 kieltää itsearvioinnin joka ainoassa kohdassa. Todiste on oltava jokin näistä: ulkopuolinen tarkastus, allekirjoitettu telemetria alustalta, riippumattoman arvioijan lukema arkkitehtuurikuvaus, tai sopimuksessa määritelty palvelutaso, jonka mittaustapa on kirjattu.

Ja sääntö sitoo myös talon, joka sen kirjoitti. Lifetime Oy ei myönnä KYA-S1-kirjettä omalle alustalleen. **Emme väitä mitään tasoa**, ennen kuin riippumaton arvioija allekirjoittaa. Se mitä spesifikaatiossa on meidän nimellämme, on arkkitehtuurin kuvaus — ei todistus.

## Pronssi, hopea, kulta

Tasot eroavat lähinnä siinä, kuinka nopeasti toimittaja pystyy tekemään ne vaikeat asiat: perumaan ihmisen oikeudet, katkaisemaan vaarantuneen ketjun ja levittämään muutoksen kaikkialle.

- **Pronssi** — viisitoista minuuttia
- **Hopea** — viisi minuuttia
- **Kulta** — kuusikymmentä sekuntia, ja riippumaton arvioija kaikissa seitsemässä kohdassa

Toimittaja, joka vetoaa KYA-S1:een, kertoo samassa lauseessa tason, arvioijan nimen ja arviointipäivän. Vähempi on markkinointia.

## Miksi sanomme "spesifikaatio" emmekä "standardi"

Tämä on pieni sana, mutta se on rehellisyyskysymys.

Standardi syntyy standardointielimessä: on prosessi, on jäsenet, on konsensus. ISO on standardi. ETSI on standardi.

KYA-S1 ei ole käynyt sellaista prosessia läpi. Sen kirjoitti yksi yritys ja julkaisi sen avoimesti kommentoitavaksi. Se on **spesifikaatio** — ja niin me sitä kutsumme, vaikka "standardi" kuulostaisi painavammalta.

Emme voi julkaista standardeja. Voimme julkaista spesifikaation ja pyytää muita repimään sen auki. Sitä me nyt teemme.

## Lyhyt versio

- Agentti tekee tekoja, ei vain vastaa kysymyksiin. Siksi hankinta tarvitsee siitä oman paperinsa.
- KYA on KYC tekoälylle: tunne agenttisi ennen kuin päästät sen sisään.
- Yksi sivu, seitsemän tarkastettua kohtaa, kaksi allekirjoitusta, vanhenemispäivä.
- Itsearviointi ei kelpaa — ei muilta, eikä meiltä. Emme väitä mitään tasoa ennen kuin ulkopuolinen allekirjoittaa.
- Se on spesifikaatio, ei standardi. Luonnos avoinna kommenteille 4.11.2026 asti.

## Lue seuraavaksi

- KYA-standardi v1.5 — mikä muuttui ensimmäisen muistion jälkeen
- MCP Apps laajentaa rajapintaa — KYA on tunnisteselkäranka
- Red Hatin eurooppalainen suvereniteettisiirto — ja kolme tasoa sen alla

---

Risto Anton Päärni
Perustaja, toimitusjohtaja, Lifetime Oy · Päätoimittaja, Lifetime Scope Journal
