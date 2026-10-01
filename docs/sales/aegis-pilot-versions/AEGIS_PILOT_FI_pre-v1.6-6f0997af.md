# Aegis-pilotti FI-teksti, pre-v1.6-6f0997af (arkistoitu)

Lähde: `Store/PRODUCT_AEGIS_PILOT.md` commit `6f0997af` (2026-10-01). Jäädytetty kopio, ei muokata.

**DWS IQ Aegis -pilotti: yksi työnkulku, kolme testiä, kolme kuukautta**

Aegis on ajoympäristö, jossa työnkulun vaatima tekoälyagenttiparvi tekee tiukasti johdettua ja valvottua (tilannehuone, situation room) työtä asiakkaan omissa tuotantotiloissa, tuotantohuoneessa (control room), toimittamallamme dedikoidulla laitteistolla. Laitteisto on hinnastomme NVIDIA GB10 Grace Blackwell -luokkaa: yksi solmu (Control Room, Acer Veriton GN100, `edge-node-gn100`, tai NVIDIA DGX Spark, `LF-DGX-SPARK`) tai kaksi yhdistettyä solmua (Situation Room, `LF-SITROOM-001`), sekä Jetson-sensorisolmut ja iPCMax-yhdyskäytävät syötteille. Pilotti toimitetaan meidän laitteillamme tai asiakkaan 100 % NVIDIA DGX -yhteensopivalla laitteistolla; muuta laitteistoa ei käytetä. Pilotti on kokonaistoimitus yhdellä tilauksella: pilotin kiinteä hinta ja laitteisto hinnaston riveinä (laite, asennus `LF-NVIDIA-INSTALL`). Laitteisto ei sisälly 19 990 euron hyvitykseen. Laitekaavio: `docs/sales/AEGIS_PILOT_LAITEKAAVIO_FI.md`. Agentit toimivat asiakkaan määrittelemien syötteiden (sensorit, integraatiot) ja tulostavoitteiden (ohjaussuositukset, raportointitiedot) pohjalta, ja niiden tehtävä on asiakkaan määrittelemien tuotantoprosessien tavoitteiden saavuttaminen ja ylläpitäminen. Agentti suosittelee, operaattori päättää, eikä yksikään komento mene suoraan tuotantolaitteisiin. Jokaisesta vaiheesta jää allekirjoitettu jälki.

Tuotantohuoneessa verkkokatko on tuotantotapahtuma, ei haitta. Siksi Aegiksen vaatimus on, että työ, loki ja pysäytys toimivat ilman verkkoa, ja siksi se testataan yhteys katkaistuna eikä esitetä tarjouksessa.

Pilotissa yksi työnkulku ajetaan agenteilla tuotannossa kolmen kuukauden ajan kiinteään hintaan, 19 990 euroa. Summa hyvitetään kokonaan Aegis-käyttöönotosta, jos jatkatte tuotantoon kuuden kuukauden kuluessa. Aegis on ennakkotilauksessa, ja pilotti on tapa tarkistaa väite ennen sitoutumista. Verkkoyhteys katkaistaan sovitun ajan, ja testataan kolme asiaa:

1. Työ jatkuu ja valmistuu.
2. Loki kirjoittuu katkeamatta.
3. Operaattori pysäyttää käynnissä olevan agentin, ja pysäytys todistetaan allekirjoitetusta lokista, ei agentin omasta raportista.

Kaikkien kolmen on mentävä läpi. Jos testi ei mene läpi, tulos on pätevä ja se raportoidaan: tieto maksoi 19 990 euroa eikä laitehankintaa.

Jokainen päätös tallentuu: kuka päätti, mitä päätettiin, ja hyväksyttiinkö suositus, muutettiinko sitä vai hylättiinkö se. Hylätyt ja keskeytyneet polut säilyvät lokissa, koska myös ne ovat todistusaineistoa.

**Kenelle.** Pilotin ostaja on se, jolla on päätösvalta pilotoitavaan työnkulkuun ja joka joutuu vastaamaan siihen, miten päätökseen päädyttiin. Titteli riippuu organisaatiosta ja tehtävien jaosta. IT-osasto hyväksyy tekniset ratkaisut mutta ei välttämättä ole ostaja. Pilotin ensimmäisessä vaiheessa (2 viikkoa, ei maksua) nimetään kirjallisesti työnkulun omistaja, operaattori ja tekninen yhteyshenkilö.
