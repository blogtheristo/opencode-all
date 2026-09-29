Status: DRAFT
Revision: 2 (HIC-palaute 28.9.2026: päätösvalta ensin, artiklat 12/26 todistusaineistona, CLOUD Act mekanismina, NVIDIA ei kumppani, Sentry optio muissa lainkäyttöalueissa)
Slug: aegis-pilot-nvidia-openshell
Title: DWS IQ Aegis Pilot ja NVIDIA OpenShell: agentit, jotka eivät voi valvoa itseään
Language: fi
Target: onelifetime.world/posts/aegis-pilot-nvidia-openshell.html
Date: 2026-09-28
Source: HIC-luonnos 28.09.2026; faktat tarkistettu NVIDIA/OpenShell-lähdekoodista ja DWS:n Aegis Pilot -toteutuksesta (PR #2225); ks. docs/field-notes/2026-09-28-nvidia-openshell-aegis-c4.md
Publish gate: vasta kun erotetun yhteyden harjoitusajo läpäisee tilassa --containment openshell (C4), ja HIC on hyväksynyt tekstin

NVIDIA julkisti 28.9.2026 Open Agent Safety Platformin. Sen perusajatus on tuttu jokaiselle, joka muistaa, miten internetistä tuli turvallinen: sitä ei tehty turvalliseksi pyytämällä verkkosivujen tekijöitä lupaamaan olevansa hyviä, vaan selain lakkasi luottamasta sivujen koodiin. Sama pätee tekoälyagentteihin. Agentti ei voi valvoa itseään.

Pysäytyksen toteutuminen todennetaan lokista, ei agentin omasta ilmoituksesta.

Hiekkalaatikko estää agenttia karkaamasta. Se ei kuitenkaan kerro, kuka piti päätösvallan ja mitä siitä seurasi. Turvallisen ajoympäristön ja lokin lupaavat nyt monet. DWS IQ Aegis tuottaa lisäksi tietueen päätösvallasta: kenelle valta annettiin, millä ehdoilla, mitä sillä päätettiin, mitä siitä seurasi ja kuka sen otti takaisin. Tavoitteena on teollisuus- ja kaksoiskäyttökohteisiin sopiva eristetty ympäristö, jossa tekoälyagentit voivat suorittaa autonomisia tehtäviä turvallisesti ja jossa hallinta on todennettavissa jälkikäteen.

Integraation keskeiset kerrokset

Ajoympäristön eristys: NVIDIAn avoin lähdekoodi (NVIDIA ei ole DWS:n kumppani tässä; käytämme julkaistua avointa lähdekoodia)

NVIDIA OpenShell on avoimen lähdekoodin (Apache 2.0) ajoympäristö, joka muodostaa jokaisen agentin ympärille nollaluottamukseen (Zero Trust) perustuvan hiekkalaatikon. Linux-ytimen mekanismit (Landlock, seccomp ja verkkonimiavaruus) rajaavat, mihin tiedostoihin, verkkoyhteyksiin ja työkaluihin agentti pääsee. Politiikan muutokset tarkistetaan formaalisti ennen hyväksyntää. Aegis Pilotissa jokainen työnkulun vaihe ajetaan omassa OpenShell-hiekkalaatikossaan, ja sen politiikka johdetaan suoraan asiakkaan allekirjoittamasta pilotin laajuusmäärittelystä. Ydinvaiheilla ei ole verkkoa lainkaan.

NVIDIA Sentry ja BlueField-4 DPU tuovat valvonnan laitteistotasolle, agentin ulottumattomiin. NVIDIAn mukaan järjestelmä voi asettaa odottamattomasti toimivan agentin karanteeniin millisekunneissa. EU-suvereeneissa kohteissa oletus on ilman Sentryä, jotta luottamuksen juuri pysyy asiakkaalla. Muissa lainkäyttöalueissa se on optio niille, joilla on NVIDIA Vera- ja BlueField-4-laitteisto.

Päätösvalta ja data-suvereniteetti (DWS IQ Aegis)

Päätösvallan tietue: jokaisesta agentista näkyy, millä valtuutuksella ja kenen allekirjoittaman laajuusmäärittelyn nojalla se toimi, mitä se päätti ja mitä siitä seurasi. Pysäytetyn agentin kohdalla näkyy, kuka operaattori sen pysäytti, milloin ja miksi. Lisäksi näkyy todiste siitä, ettei sen jälkeen kirjattu yhtään agentin toimintoa: loki kieltäytyy kirjaamasta pysäytetyn agentin työtä ja kirjaa yrityksenkin. Lokissa on vain tunnisteita ja tiivisteitä, ei henkilötietoja. Loki tuottaa sen todistusaineiston, jota EU AI Actin artiklat 12 ja 26 edellyttävät. Sen riittävyyden toteaa tarkastaja, ei toimittaja.

Täysin paikallinen ajo (on-premises): järjestelmä ajetaan asiakkaan omalla laitteistolla, esimerkiksi NVIDIA GN100- tai DGX Spark -reunalaitteella. Mekanismi on tämä: ydinvaiheilla ei ole verkkoyhteyttä, ja sen todentaa yhteydenkatkaisutesti. OpenShellin telemetria on poistettu jo käännösvaiheessa. Allekirjoitusavain ja loki ovat asiakkaan hallussa, eikä Lifetime säilytä avaimia. Johtopäätöksen CLOUD Actin tai muun lainsäädännön soveltumisesta tekee asiakkaan lakiosasto.

Enterprise Grade Aegis Pilot

KYA (Know Your Agent) ja hätäpysäytys: jokaisen agentin toiminnoista jää aukoton, allekirjoitettu lokiketju. Ihmisoperaattorilla on aina digitaalinen hätäpysäytysvalta (kill-switch). Pysäytys lopettaa agentin, eikä vain pyydä sitä lopettamaan, ja pysäytyksen toteutuminen todennetaan lokista, ei agentin omasta ilmoituksesta.

Hyväksyntätesti ilman verkkoyhteyttä: pilotin lopussa ulkoyhteys katkaistaan. Tuloksena on kyllä tai ei kolmeen kysymykseen: valmistuuko työnkulku, kirjoitetaanko päätösloki edelleen paikallisesti ilman aukkoja, ja voiko operaattori pysäyttää käynnissä olevan agentin niin, ettei sen jälkeen kirjaudu yhtään agentin toimintoa. Kaikkien kolmen on toteuduttava.

Kaksoiskäyttö ja raskas teollisuus: pilotti rajataan yhteen kohteeseen ja yhteen valvomon työnkulkuun, ympäristöissä, joissa virhemarginaali on nolla ja sääntelyvaatimukset ovat korkeimmat mahdolliset. Laajemmat käyttökohteet, kuten toimitusketjujen valvonta, robotiikan ohjaus ja teollisuuslogistiikka, rakentuvat saman todennetun perustan päälle myöhemmissä vaiheissa.

Rakennamme Enterprise Grade Aegis Pilotia NVIDIAn avoimen lähdekoodin OpenShellin varaan. Hiekkalaatikko estää agenttia karkaamasta, ja Aegis näyttää, kuka piti päätösvallan ja mitä siitä seurasi.

Risto Anton Päärni
Founder, CEO · Lifetime Oy · the Agent Outcome Company
risto.paarni@lifetime.fi · +358 400 319 010
