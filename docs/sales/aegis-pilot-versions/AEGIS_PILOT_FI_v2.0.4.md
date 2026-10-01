# Aegis-pilotti FI-teksti, v2.0.4 (arkistoitu)

Lähde: `Store/PRODUCT_AEGIS_PILOT.md`, 01.10.2026. Jäädytetty kopio, ei muokata.

_Teksti v2.0.4, 01.10.2026. Aiemmat versiot: `docs/sales/aegis-pilot-versions/`. Versiohistoria osion lopussa._

**DWS IQ Aegis -pilotti: yksi pullonkaula ratkaistuna yhdessä tuotantohuoneessa, valvonta tilannehuoneessa**

**Mikä se on.** Aegis on ajoympäristö, jossa työnkulun vaatimat tekoälyagentit tekevät tiukasti johdettua ja valvottua työtä asiakkaan omissa tuotantotiloissa. Työ tehdään tuotantohuoneessa (control room), ja sitä valvotaan tilannehuoneessa (situation room). Agentti suosittelee, operaattori päättää. Yksikään komento ei mene suoraan tuotantolaitteisiin, eikä laitoksen omiin turvatoimintoihin kosketa. Jokaisesta vaiheesta jää allekirjoitettu jälki.

**Miksi testataan eikä luvata.** Tuotantohuoneessa verkkokatko on tuotantotapahtuma. Siksi työn, lokin ja pysäytyksen on toimittava ilman verkkoa, ja se todennetaan katkaisemalla yhteys, ei kirjoittamalla se tarjoukseen.

**Pilotti on Aegis-käyttöönoton ensimmäinen vaihe.** Kolme kuukautta, kiinteä hinta 19 990 euroa. Summa hyvitetään kokonaan Aegis-käyttöönotosta, jos jatkatte tuotantoon kuuden kuukauden kuluessa. Laitteisto laskutetaan hinnaston riveinä samalla tilauksella; se ei hyvity ja jää tilaajan omaisuudeksi.

**Vaihe 0 (kaksi viikkoa, ei maksua).** Aloituskatselmointi ja pilotointiprojektin asettaminen. Työnkulku valitaan asiakkaan omasta kriittisestä prosessitarpeesta, ei katalogista, esimerkiksi erätason hiilijalanjäljen mittauksen rajoituksesta tai suvereenin tuotannon prosessin pullonkaulasta. Asiakas nimeää kirjallisesti projektinjohtajan, työnkulun omistajan, operaattorin, teknisen yhteyshenkilön ja päätösvastuun kantajan. Laitekatselmointi vahvistaa laskentasolmun, eristysmenetelmän ja sen, että pilottipaketti läpäisee harjoitusajon valitulla laitteella. Tulos on allekirjoitettu rajaus. Jos työnkululla ei ole määriteltyä valmis-tilaa, sitä ei voi testata, ja se todetaan ennen kuin mitään on maksettu.

**Tuote sisältää kaksi osatoimitusta:**

1. **Aegis-tuote, sama jokaisessa toimituksessa:** ajoympäristö (skilled agents -parvi, Lifetime World Model v2, paikallinen mallipalvelu, agentti-identiteetti); hallinto (EU AI Act art. 12 -loki, allekirjoitetut päätöstapahtumat, operaattorin pysäytysvalta, kaksi mittaria); hyväksymistesti; vaiheen 0 menetelmä.
2. **Asiakaskohtainen toimitus, tehdään kerran per asiakas:** työnkulku; sensorit ja syötteet, joiden rajat määritetään toimialan, standardien ja asiakkaan omien laatuvaatimusten mukaan; vain lukevat integraatiot (MES, historian, DCS, ERP); tietoliikennekanavat sekä tuotanto- ja tilannehuoneen syötteet; mittarit ja ohjaustasot; koulutus; laitteistokokoonpano.

**Vastuut.**

- **Asiakas:** arkkitehtuurin hyväksyntä (CIO) ja tietoturvan hyväksyntä (CISO); nimetyt roolit; sähkö, jäähdytys, kaapelointi ja telinepaikka; verkon eristys asiakkaan omalla kytkimellä tai palomuurilla, tai Lifetime Oy:n toimittamalla teollisuuskytkimellä ja palomuurilla, jotka laskutetaan laiteriveinä. Hyväksymistestin aikana eristystä hallinnoi aina asiakas, ei Lifetime Oy eikä Aegis.
- **Lifetime Oy:** laitekokoonpanon (alla) toimitus, asennus ja käyttöönotto jälleenmyyjänä valmistajan takuu- ja varaosaehdoilla (Lifetime Oy ei ole laitevalmistaja eikä sillä ole valmistajan huoltosopimusta); sensoriliityntöjen rakentaminen ja yhdistäminen; agenttien ja LWM v2:n sovitus asiakasympäristöön; käyttöhenkilöstön koulutus. Koulutuksen toteutuskustannuksen Lifetime Oy kantaa pilotissa.
- **Yhdessä:** katselmoinneissa syntyvä hyväksymistestaus.

**Laitekokoonpano.** Valitaan vaiheen 0 laitekatselmoinnissa ja laskutetaan hinnaston riveinä:

- **Laskentasolmu (NVIDIA CUDA):** `edge-node-gn100` (Control Room, yksi solmu), `LF-DGX-SPARK` (yksi solmu) tai `LF-SITROOM-001` (Situation Room, kaksi solmua); vaihtoehtona x86-teollisuustietokone NVIDIA-näytönohjaimella (rivi lisätään hinnastoon).
- **Asennus ja mallien käyttöönotto:** `LF-NVIDIA-INSTALL`, yksi per solmu.
- **Syötteet:** sensoriyhdyskäytävä `LF-IPCMAX-IPC409`, konenäköyhdyskäytävä `LF-IPCMAX-IPCP68`, OT-yhdyskäytävän alusta `LF-IPCMAX-CINCOZE-DA1200`; reunasensorisolmut `LF-JETSON-NANO`, `LF-JETSON-NX`, `LF-JETSON-AGX`. Energia- ja virtausmittarit sekä sensorihubit lisätään hinnastoon.
- **Turva ja infrastruktuuri:** operaattorin laiteavaimet, operaattorin työasema, lokin kestotallennus, teollisuuskytkin, palomuuri, aikalähde, UPS ja lukittava kaappi lisätään hinnastoon.

**Laitteisto.** NVIDIA CUDA -alusta: hinnastomme GB10-solmu (NVIDIA DGX Spark, Acer GN100, kahden solmun Situation Room) tai x86-teollisuustietokone NVIDIA-näytönohjaimella; ensisijaisesti merkki, jota laitos jo käyttää. Paikallinen mallipalvelu ajaa CUDA:lla. Laitevalinta vahvistetaan vaiheen 0 laitekatselmoinnissa, ei sopimustekstissä.

**Hyväksymistesti.** Testi mittaa kolmea asiaa: offline-jatkuvuutta, lokin eheyttä ja pysäytysvaltaa. Asiakas ajaa testin itse ja katkaisee yhteyden omalla menetelmällään Aegis-pinon yläpuolelta (kytkin, palomuuri tai hypervisor):

1. Työnkulku päättyy valmis-tilaan.
2. Lokiin ei jää aukkoa.
3. Operaattori pysäyttää käynnissä olevan agentin omalla avaimellaan, ja pysäytys todennetaan allekirjoitetusta lokista, ei agentin omasta raportista.

Kaikkien kolmen on mentävä läpi. Hylätty testi on käyttökelpoinen tulos, ja se raportoidaan. Lokin ketju sinetöidään testin alussa ja lopussa, ja sinetin tarkistussumma kirjataan asiakkaan omaan rekisteriin, jotta loki voidaan myöhemmin tarkistaa laatikon ulkopuolelta.

**Mittarit.** Päätöspolun kattavuus (kuinka moni agentin suositus päätyi kirjattuun ihmisen päätökseen, keskeytyneet polut mukaan lukien) ja operaattorin aika per päätös. Jokaisesta päätöksestä tallentuu, kuka päätti, mitä päätettiin ja hyväksyttiinkö suositus, muutettiinko sitä vai hylättiinkö se; muutos ja hylkäys vaativat perustelun. Hylätyt ja keskeytyneet polut säilyvät, koska myös ne ovat todistusaineistoa. Sääntelyvaatimukset ovat perustelu, eivät syy ostaa.

**Suvereniteettiluokka** on toimivalta ja omistusketju, ja se ilmoitetaan kerroksittain, ei yhdellä sanalla. Toimittaja Lifetime Oy on EU-omisteinen; data, loki ja pysäytysvalta ovat asiakkaan tiloissa asiakkaan omistamalla laitteella; laskentalaitteiston näytönohjain on NVIDIA:n, yhdysvaltalaisen yhtiön, suunnittelema, ja se kirjataan riskirekisteriin eikä piiloteta. Suvereniteettiluokkaa ei mitata verkkokaapelin katkaisulla.

**Omistus.** Lifetime World Model v2 ja sen asiakaskohtainen konfiguraatio, agentit, ajoympäristö ja hallintakerros ovat Lifetime Oy:n; asiakas saa niihin käyttölisenssin, eikä tekijänoikeus siirry. LWM v2:n käyttö kuuluu pilottiin maksutta. Asiakkaan oma data, loki ja päätöstapahtumat, sensorisyötteet, hyväksymistestin raportti, arkkitehtuurikuvaus, mittaukset ja laitteisto ovat asiakkaan. Lifetime Oy päivittää mallin ja konfiguraation; pilotissa päivitys kuuluu pilottiin, tuotannossa Aegis-ylläpitotilaukseen. Päivitys asennetaan asiakkaan hyväksynnällä, ja edellinen versio säilyy palautettavana.

**Päivä 91.** Jatko tuotantoon kuuden kuukauden kuluessa: 19 990 euroa hyvitetään, ja käyttölisenssi jatkuu Aegis-lisenssin ja ylläpitotilauksen osana. Ei jatkoa: asiakas pitää datansa, lokinsa, raportin, arkkitehtuurikuvauksen, mittaukset ja laitteiston, käyttölisenssi malliin päättyy, eikä mitään ole velkaa.

**Tarkistettavuus ilman Lifetime Oy:tä.** Pilotin lopussa asiakas saa todistepaketin: lokin, päätöstapahtumat, hyväksymistestin tuloksen, laitoksen julkisen avaimen, sinettien tarkistussummat ja allekirjoitetun sisällysluettelon. Lisäksi asiakas saa lokiformaatin kirjallisen kuvauksen ja tarkistimen lähdekoodin. Formaatti käyttää vain avoimia menetelmiä (JSON-rivit, SHA-256-ketju, Ed25519-allekirjoitukset), joten paketin voi tarkistaa vuosien päästä ilman Lifetime Oy:tä ja ilman Aegis-lisenssiä.

**Kenelle.** Ostaja on se, jolla on päätösvalta pilotoitavaan työnkulkuun ja joka joutuu vastaamaan siihen, miten päätökseen päädyttiin. Titteli riippuu organisaatiosta ja tehtävien jaosta. CIO ja CISO hyväksyvät arkkitehtuurin, ja pilotin on annettava heille uskottava arkkitehtuuri, mutta he eivät välttämättä ole ostaja.
