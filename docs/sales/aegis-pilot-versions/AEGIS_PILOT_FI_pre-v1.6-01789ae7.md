# Aegis-pilotti FI-teksti, pre-v1.6-01789ae7 (arkistoitu)

Lähde: `Store/PRODUCT_AEGIS_PILOT.md` commit `01789ae7` (2026-10-01). Jäädytetty kopio, ei muokata.

**DWS IQ Aegis -pilotti: yksi pullonkaula ratkaistuna yhdessä tuotantohuoneessa, valvonta tilannehuoneessa**

Aegis on ajoympäristö, jossa työnkulun vaatimat tekoälyagentit tekevät tiukasti johdettua ja valvottua työtä asiakkaan omissa tuotantotiloissa: työ tehdään tuotantohuoneessa (control room) ja sitä valvotaan tilannehuoneessa (situation room), toimittamallamme dedikoidulla laitteistolla. Laitteisto on hinnastomme NVIDIA GB10 Grace Blackwell -luokkaa: yksi solmu (Control Room, Acer Veriton GN100, `edge-node-gn100`, tai NVIDIA DGX Spark, `LF-DGX-SPARK`) tai kaksi yhdistettyä solmua (Situation Room, `LF-SITROOM-001`), sekä Jetson-sensorisolmut ja iPCMax-yhdyskäytävät syötteille. Pilotti toimitetaan meidän laitteillamme tai asiakkaan 100 % NVIDIA DGX -yhteensopivalla laitteistolla; muuta laitteistoa ei käytetä. Pilotti on kokonaistoimitus yhdellä tilauksella: pilotin kiinteä hinta ja laitteisto hinnaston riveinä (laite, asennus `LF-NVIDIA-INSTALL`). Laitteisto ei sisälly 19 990 euron hyvitykseen. Laitekaavio: `docs/sales/AEGIS_PILOT_LAITEKAAVIO_FI.md`. Agentit toimivat asiakkaan määrittelemien syötteiden (sensorit, integraatiot) ja tulostavoitteiden (ohjaussuositukset, raportointitiedot) pohjalta, ja niiden tehtävä on asiakkaan määrittelemien tuotantoprosessien tavoitteiden saavuttaminen ja ylläpitäminen. Agentti suosittelee, operaattori päättää, eikä yksikään komento mene suoraan tuotantolaitteisiin. Jokaisesta vaiheesta jää allekirjoitettu jälki.

Tuotantohuoneessa verkkokatko on tuotantotapahtuma, ei haitta. Siksi Aegiksen vaatimus on, että työ, loki ja pysäytys toimivat ilman verkkoa, ja siksi se testataan yhteys katkaistuna eikä esitetä tarjouksessa.

Toimitusvaiheen ensimmäinen sisäänkäynti on maksullinen pilotti: kolme kuukautta, kiinteä hinta 19 990 euroa, joka hyvitetään kokonaan Aegis-käyttöönotosta, jos jatkatte tuotantoon kuuden kuukauden kuluessa. Laitteita ei hyvitetä, ja ne jäävät tilaajan omaisuudeksi. Työnkulku valitaan vaiheessa 0 asiakkaan omasta kriittisestä prosessitarpeesta, esimerkiksi erätason hiilijalanjäljen mittauksen rajoituksista tai suvereenin tuotannon prosessin pullonkaulasta. Työnkulku on aina asiakaskohtainen, ja se vaatii aloituskatselmoinnin ja pilotointiprojektin asettamisen.

Toimitusvaiheen sopimukseen kuuluu: arkkitehtuurin hyväksyminen; agenttien ja Lifetime World Model -mallin koulutus asiakasympäristöön; sensorisyötteiden rakentaminen; tuotantohuoneen käyttöönotto; yrityksen infran tietoliikennekanavien sekä tuotantohuoneen ja tilannehuoneen syötteiden asettaminen; mittarien ja ohjaustasojen määrittäminen; ja näiden katselmoinnissa syntyvä asiakkaan hyväksymistestaus. Tuotannolliset syötteet ja niiden rajat määritetään toimialan, standardien ja asiakkaan omien laatuvaatimusten mukaisina.

Suvereeniteetti mitataan hyväksymistestillä, jonka asiakas ajaa itse. Asiakas katkaisee yhteyden omalla menetelmällään, ja testataan kolme asiaa:

1. Työnkulku päättyy silti valmis-tilaan.
2. Lokiin ei jää aukkoa.
3. Operaattori pysäyttää käynnissä olevan agentin, ja pysäytys todennetaan allekirjoitetusta lokista, ei agentin omasta raportista.

Kaikkien kolmen on mentävä läpi. Hylätty testi on käyttökelpoinen tulos ja se raportoidaan: tieto maksoi 19 990 euroa eikä laitehankintaa. Ostajan ei tarvitse uskoa mitään, kun hän voi ajaa testin itse.

Kaksi lukua, jotka pilotti tuottaa: päätöspolun kattavuus (kuinka moni agentin suositus päätyi kirjattuun ihmisen päätökseen, keskeytyneet polut mukaan lukien) ja operaattorin aika per päätös. Jokainen päätös tallentuu: kuka päätti, mitä päätettiin, ja hyväksyttiinkö suositus, muutettiinko sitä vai hylättiinkö se. Hylätyt ja keskeytyneet polut säilyvät lokissa, koska myös ne ovat todistusaineistoa. Sääntelyvaatimukset (EU AI Act art. 12) ovat perustelu, eivät syy ostaa.

**Kenelle.** Pilotin ostaja on se, jolla on päätösvalta pilotoitavaan työnkulkuun ja joka joutuu vastaamaan siihen, miten päätökseen päädyttiin. Titteli riippuu organisaatiosta ja tehtävien jaosta. IT-osasto ja tietoturva hyväksyvät arkkitehtuurin, ja pilotin on annettava CIO:lle ja CISO:lle uskottava arkkitehtuuri, mutta he eivät välttämättä ole ostaja. Pilotin ensimmäisessä vaiheessa (2 viikkoa, ei maksua) nimetään kirjallisesti työnkulun omistaja, operaattori, tekninen yhteyshenkilö ja päätösvastuun kantaja.
