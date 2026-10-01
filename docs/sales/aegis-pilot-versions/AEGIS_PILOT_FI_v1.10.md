# Aegis-pilotti FI-teksti, v1.10 (arkistoitu)

Lähde: `Store/PRODUCT_AEGIS_PILOT.md` commit `a764a455` (2026-10-01). Jäädytetty kopio, ei muokata.

_Teksti v1.10, 01.10.2026. Versiohistoria osion lopussa._

**DWS IQ Aegis -pilotti: yksi pullonkaula ratkaistuna yhdessä tuotantohuoneessa, valvonta tilannehuoneessa**

Aegis on ajoympäristö, jossa työnkulun vaatimat tekoälyagentit tekevät tiukasti johdettua ja valvottua työtä asiakkaan omissa tuotantotiloissa: työ tehdään tuotantohuoneessa (control room) ja sitä valvotaan tilannehuoneessa (situation room), toimittamallamme dedikoidulla laitteistolla. Laitteisto on hinnastomme NVIDIA GB10 Grace Blackwell -luokkaa: yksi solmu (Control Room, Acer Veriton GN100, `edge-node-gn100`, tai NVIDIA DGX Spark, `LF-DGX-SPARK`) tai kaksi yhdistettyä solmua (Situation Room, `LF-SITROOM-001`), sekä Jetson-sensorisolmut ja iPCMax-yhdyskäytävät syötteille. Pilotti toimitetaan hinnastomme GB10-luokan solmulla tai asiakkaan 100 % NVIDIA DGX -yhteensopivalla laitteistolla; laitevalinta vahvistetaan vaiheen 0 laitekatselmoinnissa, ei sopimustekstissä. Pilotti on kokonaistoimitus yhdellä tilauksella: pilotin kiinteä hinta ja laitteisto hinnaston riveinä (laite, asennus `LF-NVIDIA-INSTALL`). Laitteisto ei sisälly 19 990 euron hyvitykseen. Laitekaavio: `docs/sales/AEGIS_PILOT_LAITEKAAVIO_FI.md`. Agentit toimivat asiakkaan määrittelemien syötteiden (sensorit, integraatiot) ja tulostavoitteiden (ohjaussuositukset, raportointitiedot) pohjalta, ja niiden tehtävä on asiakkaan määrittelemien tuotantoprosessien tavoitteiden saavuttaminen ja ylläpitäminen. Agentti suosittelee, operaattori päättää, eikä yksikään komento mene suoraan tuotantolaitteisiin. Jokaisesta vaiheesta jää allekirjoitettu jälki.

Tuotantohuoneessa verkkokatko on tuotantotapahtuma, ei haitta. Siksi Aegiksen vaatimus on, että työ, loki ja pysäytys toimivat ilman verkkoa, ja siksi se testataan yhteys katkaistuna eikä esitetä tarjouksessa.

Toimitusvaiheen ensimmäinen sisäänkäynti on maksullinen pilotti: kolme kuukautta, kiinteä hinta 19 990 euroa, joka hyvitetään kokonaan Aegis-käyttöönotosta, jos jatkatte tuotantoon kuuden kuukauden kuluessa. Laitteita ei hyvitetä, ja ne jäävät tilaajan omaisuudeksi. Työnkulku valitaan vaiheessa 0 asiakkaan omasta kriittisestä prosessitarpeesta, esimerkiksi erätason hiilijalanjäljen mittauksen rajoituksista tai suvereenin tuotannon prosessin pullonkaulasta. Työnkulku on aina asiakaskohtainen, ja se vaatii aloituskatselmoinnin ja pilotointiprojektin asettamisen. Asiakas asettaa projektin johtoon nimetyn henkilön.

Kyseessä on Aegis-tuotteen käyttöönotto pilottitoimituksena. Sopimus jakautuu kahteen osaan: siihen, mikä toistuu jokaisessa toimituksessa, ja siihen, mikä on asiakaskohtaista. Toinen kauppa on halvempi, koska toistuva osa on jo olemassa.

**Toistuva osa (Aegis-tuote, sama jokaisessa toimituksessa):**

- ajoympäristö: skilled agents -parvi, Lifetime World Model v2, paikallinen mallipalvelu, KYA-identiteetti;
- hallinto: Art. 12 -loki, allekirjoitetut päätöstapahtumat, operaattorin pysäytysvalta, päätöspolun kattavuus ja operaattorin aika per päätös;
- hyväksymistesti: kolme ehtoa, asiakas ajaa, eristysmenetelmän portaikko, raportti;
- vaiheen 0 menetelmä: aloituskatselmointi, kriittisyysluokitus, roolien nimeäminen, laitekatselmointi (solmun saatavuus, takuukanava, avainten säilytys, laitteen eheysominaisuudet kirjataan todettuina tai puuttuvina), allekirjoitettu rajaus;
- laitteisto hinnaston ehdoilla: GB10-luokan solmu ja siihen liitetyt laitteet toimitetaan jälleenmyyjänä valmistajan (Acer, NVIDIA) takuulla ja varaosaehdoilla; Lifetime Oy ei ole laitevalmistaja eikä sillä ole omaa NVIDIA-huoltosopimusta. Asennus ja käyttöönotto ovat hinnaston palvelurivi (`LF-NVIDIA-INSTALL`); sähkö, jäähdytys, kaapelointi ja telinepaikka ovat asiakkaan valmistelua.

**Asiakaskohtainen osa (tehdään kerran per asiakas):**

- työnkulku: valitaan vaiheessa 0 asiakkaan kriittisestä prosessitarpeesta, valmis-tila määritellään asiakkaan sanoin;
- sensorit ja syötteet: liityntöjen rakentaminen ja yhdistäminen (Lifetime Oy), syötteiden rajat toimialan, standardien ja asiakkaan laatuvaatimusten mukaan;
- integraatiot: yrityksen infran tietoliikennekanavat, tuotantohuoneen ja tilannehuoneen syötteet, mittarit ja ohjaustasot;
- koulutus: LWM v2:n sovitus asiakasympäristöön ja asiakkaan käyttöhenkilöstön koulutus. Koulutus on uusi työ, jonka toteutuskustannuksen Lifetime Oy kantaa. Lifetime World Model v2 on Lifetime Oy:n tekijänoikeudella suojattu tuote; sen käyttö kuuluu pilottiin maksutta, ja tekijänoikeus ei siirry asiakkaalle;
- hyväksynnät: arkkitehtuuri (CIO) ja tietoturva (CISO) asiakkaan toimesta; nimetty projektinjohtaja, operaattori ja työnkulun omistaja.

Hyväksymistestaus syntyy näiden katselmoinnissa ja on asiakkaan ja Lifetime Oy:n yhteinen.

Tuotannolliset syötteet ja niiden rajat määritetään toimialan, standardien ja asiakkaan omien laatuvaatimusten mukaisina.

**Suvereeniteettiluokka** on toimivalta ja omistusketju (`DWS_STANDARDS_LIBRARY.md` §3.6), ja se ilmoitetaan kerroksittain, ei yhdellä sanalla. Pilotissa: toimittaja Lifetime Oy on EU-omisteinen (Tier 1); data, loki ja pysäytysvalta ovat asiakkaan tiloissa asiakkaan omistamalla laitteella, eikä niihin ulotu kolmannen maan tiedonluovutusvelvoite (datataso Tier 1); laskentalaitteisto on NVIDIA:n suunnittelema (teknologiataso Tier 2), mikä kirjataan riskirekisteriin eikä piiloteta. Suvereeniteettiluokkaa ei mitata verkkokaapelin katkaisulla.

**Hyväksymistesti** mittaa kolmea eri asiaa: pysäytysvaltaa, offline-jatkuvuutta ja lokin eheyttä. Asiakas ajaa testin itse ja katkaisee yhteyden omalla menetelmällään:

1. Työnkulku päättyy silti valmis-tilaan.
2. Lokiin ei jää aukkoa.
3. Operaattori pysäyttää käynnissä olevan agentin, ja pysäytys todennetaan allekirjoitetusta lokista, ei agentin omasta raportista.

Kaikkien kolmen on mentävä läpi. Hylätty testi on käyttökelpoinen tulos ja se raportoidaan: tieto maksoi 19 990 euroa eikä laitehankintaa. Ostajan ei tarvitse uskoa mitään, kun hän voi ajaa testin itse.

Kaksi lukua, jotka pilotti tuottaa: päätöspolun kattavuus (kuinka moni agentin suositus päätyi kirjattuun ihmisen päätökseen, keskeytyneet polut mukaan lukien) ja operaattorin aika per päätös. Jokainen päätös tallentuu: kuka päätti, mitä päätettiin, ja hyväksyttiinkö suositus, muutettiinko sitä vai hylättiinkö se. Hylätyt ja keskeytyneet polut säilyvät lokissa, koska myös ne ovat todistusaineistoa. Sääntelyvaatimukset (EU AI Act art. 12) ovat perustelu, eivät syy ostaa.

**Kenelle.** Pilotin ostaja on se, jolla on päätösvalta pilotoitavaan työnkulkuun ja joka joutuu vastaamaan siihen, miten päätökseen päädyttiin. Titteli riippuu organisaatiosta ja tehtävien jaosta. IT-osasto ja tietoturva hyväksyvät arkkitehtuurin, ja pilotin on annettava CIO:lle ja CISO:lle uskottava arkkitehtuuri, mutta he eivät välttämättä ole ostaja. Pilotin ensimmäisessä vaiheessa (2 viikkoa, ei maksua) nimetään kirjallisesti asiakkaan projektinjohtaja, työnkulun omistaja, operaattori, tekninen yhteyshenkilö ja päätösvastuun kantaja.

**Versiohistoria (FI-osio)**

- v1.0, 01.10.2026: HIC:n alkuteksti kiristettynä; kolme testiä; ostaja = päätösvaltainen henkilö.
- v1.1, 01.10.2026: tuotantohuone, dedikoitu laitteisto, tiukasti johdettu ja valvottu työ.
- v1.2, 01.10.2026: syötteet ja tulostavoitteet; verkkokatko testin syynä; hylätty testi pätevä tulos.
- v1.3, 01.10.2026: hinnaston GB10-solmut (1x/2x) tai 100 % DGX-yhteensopiva; kokonaistoimitus; laitteisto hinnaston riveinä, ei hyvitykseen.
- v1.4, 01.10.2026: Boardy: yksi pullonkaula tuotantohuoneessa, valvonta tilannehuoneessa; asiakas ajaa testin itse; päätöspolun kattavuus ja operaattorin aika per päätös; CIO/CISO hyväksyvät, eivät osta.
- v1.5, 01.10.2026: toimitusvaiheen rajaus; laitteet jäävät tilaajalle; aloituskatselmointi ja projektin asettaminen; LWM v2 kuuluu pilottiin; nimetty projektinjohtaja.
- v1.6, 01.10.2026: vastuut jaettu asiakas / Lifetime Oy / yhdessä; versiointi lisätty.
- v1.7, 01.10.2026: suvereeniteettiluokka (§3.6, toimivalta ja omistusketju) erotettu hyväksymistestistä, joka mittaa pysäytysvaltaa, offline-jatkuvuutta ja lokin eheyttä.
- v1.8, 01.10.2026: sopimus jaettu toistuvaan osaan (ajoympäristö, hallinto, hyväksymistesti, vaiheen 0 menetelmä, laitteisto) ja asiakaskohtaiseen osaan (työnkulku, sensorit, integraatiot, koulutus, hyväksynnät). Pilotti = Aegis-tuotteen käyttöönotto pilottitoimituksena.
- v1.9, 01.10.2026: Boardy: laitetoimitus jälleenmyyjänä valmistajan takuulla; ei omaa NVIDIA-huoltosopimusta; asennus hinnaston palvelurivinä, sitepreparaatio asiakkaalla; laitevalinta vaiheen 0 laitekatselmoinnissa, ei sopimustekstissä.
- v1.10, 01.10.2026: koulutuksen toteutuskustannus Lifetime Oy:llä; LWM v2 Lifetime Oy:n tekijänoikeudella suojattu tuote, pilotissa maksuton, tekijänoikeus ei siirry.
