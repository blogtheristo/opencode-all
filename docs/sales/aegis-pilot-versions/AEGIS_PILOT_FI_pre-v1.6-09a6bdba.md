# Aegis-pilotti FI-teksti, pre-v1.6-09a6bdba (arkistoitu)

Lähde: `Store/PRODUCT_AEGIS_PILOT.md` commit `09a6bdba` (2026-10-01). Jäädytetty kopio, ei muokata.

**DWS IQ Aegis -pilotti: yksi työnkulku, kolme testiä, kolme kuukautta**

Aegis on ajoympäristö, jossa tekoälyagentti tekee tiukasti johdettua ja valvottua työtä asiakkaan omassa tuotannossa, tuotantohuoneessa dedikoidulla laitteistolla, esimerkiksi datakeskuksessa tai tehtaalla. Agentti suosittelee, ihminen päättää, ja jokaisesta vaiheesta jää allekirjoitettu jälki. Agentti ei ohjaa fyysisiä laitteita. Aegis on ennakkotilauksessa.

Pilotissa yksi työnkulku ajetaan agentilla tuotannossa kolmen kuukauden ajan kiinteään hintaan, 19 990 euroa. Summa hyvitetään kokonaan Aegis-käyttöönotosta, jos jatkatte tuotantoon kuuden kuukauden kuluessa. Verkkoyhteys katkaistaan sovitun ajan, ja testataan kolme asiaa:

1. Työ jatkuu ja valmistuu.
2. Loki kirjoittuu katkeamatta.
3. Operaattori pysäyttää käynnissä olevan agentin, ja pysäytys todistetaan allekirjoitetusta lokista, ei agentin omasta raportista.

Jokainen päätös tallentuu: kuka päätti, mitä päätettiin, ja hyväksyttiinkö suositus, muutettiinko sitä vai hylättiinkö se. Hylätyt ja keskeytyneet polut säilyvät lokissa, koska myös ne ovat todistusaineistoa.

**Kenelle.** Pilotin ostaja on se, jolla on päätösvalta pilotoitavaan työnkulkuun ja joka joutuu vastaamaan siihen, miten päätökseen päädyttiin. Titteli riippuu organisaatiosta ja tehtävien jaosta. IT-osasto hyväksyy tekniset ratkaisut mutta ei välttämättä ole ostaja. Pilotin ensimmäisessä vaiheessa (2 viikkoa, ei maksua) nimetään kirjallisesti työnkulun omistaja, operaattori ja tekninen yhteyshenkilö.
