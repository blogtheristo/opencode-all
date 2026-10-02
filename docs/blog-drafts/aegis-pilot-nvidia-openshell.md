Status: DRAFT
Revision: 2 (HIC-palaute 28.9.2026: päätösvalta ensin, artiklat 12/26 todistusaineistona, CLOUD Act mekanismina, NVIDIA ei kumppani, Sentry optio muissa lainkäyttöalueissa)
Slug: aegis-pilot-nvidia-openshell
Title: DWS IQ Aegis Pilot ja NVIDIA OpenShell: agentit, jotka eivät voi valvoa itseään
Language: fi
Target: onelifetime.world/posts/aegis-pilot-nvidia-openshell.html
Date: 2026-09-28
claims_checked: 2026-09-30
Source: HIC-luonnos 28.09.2026; faktat tarkistettu NVIDIA/OpenShell-lähdekoodista ja DWS:n Aegis Pilot -toteutuksesta (PR #2225); ks. docs/field-notes/2026-09-28-nvidia-openshell-aegis-c4.md
Publish gate: vasta kun erotetun yhteyden harjoitusajo läpäisee tilassa --containment openshell (C4), ja HIC on hyväksynyt tekstin

NVIDIA julkisti 28.9.2026 Open Agent Safety Platformin. Sen perusajatus on tuttu jokaiselle, joka muistaa, miten internetistä tuli turvallinen: sitä ei tehty turvalliseksi pyytämällä verkkosivujen tekijöitä lupaamaan olevansa hyviä, vaan selain lakkasi luottamasta sivujen koodiin. Sama pätee tekoälyagentteihin. Agentti ei voi valvoa itseään: jo vuonna 2016 osoitettiin, että omaa tavoitettaan maksimoivalla agentilla on kannustin estää oma pysäytyksensä [3].

Pysäytyksen toteutuminen todennetaan lokista, ei agentin omasta ilmoituksesta.

Hiekkalaatikko estää agenttia karkaamasta. Se ei kuitenkaan kerro, kuka piti päätösvallan ja mitä siitä seurasi. Turvallisen ajoympäristön ja lokin lupaavat nyt monet. DWS IQ Aegis tuottaa lisäksi tietueen päätösvallasta: kenelle valta annettiin, millä ehdoilla, mitä sillä päätettiin, mitä siitä seurasi ja kuka sen otti takaisin. Tavoitteena on teollisuus- ja kaksoiskäyttökohteisiin sopiva eristetty ympäristö, jossa tekoälyagentit voivat suorittaa autonomisia tehtäviä turvallisesti ja jossa hallinta on todennettavissa jälkikäteen.

Integraation keskeiset kerrokset

Ajoympäristön eristys: NVIDIAn avoin lähdekoodi (NVIDIA ei ole DWS:n kumppani tässä; käytämme julkaistua avointa lähdekoodia)

NVIDIA OpenShell on avoimen lähdekoodin (Apache 2.0) ajoympäristö, joka muodostaa jokaisen agentin ympärille nollaluottamukseen (Zero Trust) perustuvan hiekkalaatikon [1]. Linux-ytimen mekanismit (Landlock, seccomp ja verkkonimiavaruus) rajaavat, mihin tiedostoihin, verkkoyhteyksiin ja työkaluihin agentti pääsee [2]. Politiikan muutokset tarkistetaan formaalisti ennen hyväksyntää [1]. Eristys on tutkimuskirjallisuudessakin nostettu agenttijärjestelmien turvallisuuden perusperiaatteeksi [5]. Aegis Pilotissa jokainen työnkulun vaihe ajetaan omassa OpenShell-hiekkalaatikossaan, ja sen politiikka johdetaan suoraan asiakkaan allekirjoittamasta pilotin laajuusmäärittelystä. Ydinvaiheilla ei ole verkkoa lainkaan.

NVIDIAn 28.9.2026 julkistuksen mukaan NVIDIA Sentry ja BlueField-4 DPU tuovat valvonnan laitteistotasolle, agentin ulottumattomiin, ja järjestelmä voi asettaa odottamattomasti toimivan agentin karanteeniin millisekunneissa. EU-suvereeneissa kohteissa oletus on ilman Sentryä, jotta luottamuksen juuri pysyy asiakkaalla. Muissa lainkäyttöalueissa se on optio niille, joilla on NVIDIA Vera- ja BlueField-4-laitteisto.

Päätösvalta ja data-suvereniteetti (DWS IQ Aegis)

Päätösvallan tietue: jokaisesta agentista näkyy, millä valtuutuksella ja kenen allekirjoittaman laajuusmäärittelyn nojalla se toimi, mitä se päätti ja mitä siitä seurasi. Pysäytetyn agentin kohdalla näkyy, kuka operaattori sen pysäytti, milloin ja miksi. Lisäksi näkyy todiste siitä, ettei sen jälkeen kirjattu yhtään agentin toimintoa: loki kieltäytyy kirjaamasta pysäytetyn agentin työtä ja kirjaa yrityksenkin. Lokissa on vain tunnisteita ja tiivisteitä, ei henkilötietoja. Loki tuottaa sen todistusaineiston, jota EU AI Actin artiklat 12 ja 26 edellyttävät korkean riskin järjestelmiltä: tapahtumien automaattisen kirjaamisen koko elinkaaren ajan ja lokien säilyttämisen vähintään kuusi kuukautta [4]. Sen riittävyyden toteaa tarkastaja, ei toimittaja.

Täysin paikallinen ajo (on-premises): järjestelmä ajetaan asiakkaan omalla laitteistolla, esimerkiksi GN100- tai NVIDIA DGX Spark -reunalaitteella. Mekanismi on tämä: ydinvaiheilla ei ole verkkoyhteyttä, ja sen todentaa yhteydenkatkaisutesti. OpenShellin telemetria on poistettu jo käännösvaiheessa; OpenShell tukee tätä suoraan [1]. Allekirjoitusavain ja loki ovat asiakkaan hallussa, eikä Lifetime säilytä avaimia. Johtopäätöksen CLOUD Actin tai muun lainsäädännön soveltumisesta tekee asiakkaan lakiosasto.

Enterprise Grade Aegis Pilot

KYA (Know Your Agent) ja hätäpysäytys: jokaisen agentin toiminnoista jää aukoton, allekirjoitettu lokiketju. Ihmisoperaattorilla on aina digitaalinen hätäpysäytysvalta (kill-switch), kuten EU AI Actin artikla 14 edellyttää korkean riskin järjestelmiltä: valvojan on voitava keskeyttää järjestelmä ”stop”-painikkeella tai vastaavalla menettelyllä turvalliseen tilaan [4]. Pysäytys lopettaa agentin, eikä vain pyydä sitä lopettamaan, ja pysäytyksen toteutuminen todennetaan lokista, ei agentin omasta ilmoituksesta.

Hyväksyntätesti ilman verkkoyhteyttä: pilotin lopussa ulkoyhteys katkaistaan. Tuloksena on kyllä tai ei kolmeen kysymykseen: valmistuuko työnkulku, kirjoitetaanko päätösloki edelleen paikallisesti ilman aukkoja, ja voiko operaattori pysäyttää käynnissä olevan agentin niin, ettei sen jälkeen kirjaudu yhtään agentin toimintoa. Kaikkien kolmen on toteuduttava. Tähän mennessä harjoitusajo katkaistulla ulkoyhteydellä on läpäisty verkkonimiavaruudessa oikealla OpenShell-käännöksellä (28.9.2026). Todistettu ajo reunalaitteistolla, jossa kaapeli irrotetaan fyysisesti, on suunniteltu (tavoite 25.10.2026), samoin tarkastajalle luovutettava allekirjoitettu vientipaketti.

Kaksoiskäyttö ja raskas teollisuus: pilotti rajataan yhteen kohteeseen ja yhteen valvomon työnkulkuun, ympäristöissä, joissa virhemarginaali on nolla ja sääntelyvaatimukset ovat korkeimmat mahdolliset. Laajemmat käyttökohteet, kuten toimitusketjujen valvonta, robotiikan ohjaus ja teollisuuslogistiikka, rakentuvat saman todennetun perustan päälle myöhemmissä vaiheissa.

Rakennamme Enterprise Grade Aegis Pilotia NVIDIAn avoimen lähdekoodin OpenShellin varaan. Hiekkalaatikko estää agenttia karkaamasta, ja Aegis näyttää, kuka piti päätösvallan ja mitä siitä seurasi.

Risto Anton Päärni
Founder, CEO · Lifetime Oy · the Agent Outcome Company
risto.paarni@lifetime.fi · +358 400 319 010

## Lähteet

[1] NVIDIA (2026). OpenShell README. GitHub, NVIDIA/OpenShell. https://github.com/NVIDIA/OpenShell

[2] NVIDIA (2026). OpenShell Architecture and Security Best Practices. GitHub, NVIDIA/OpenShell (docs/about/architecture.mdx, docs/security/best-practices.mdx). https://github.com/NVIDIA/OpenShell/tree/main/docs

[3] Hadfield-Menell, D., Dragan, A., Abbeel, P., Russell, S. (2016). The Off-Switch Game. arXiv (IJCAI 2017). https://arxiv.org/abs/1611.08219

[4] Euroopan parlamentti ja neuvosto (2024). Asetus (EU) 2024/1689 (tekoälysäädös), artiklat 12, 14 ja 26. Euroopan unionin virallinen lehti. https://eur-lex.europa.eu/eli/reg/2024/1689/oj

[5] Jing, H., Hu, W., Chen, S. ym. (2026). Isolation as a First-Class Principle for LLM-Agent System Safety: Concepts, Taxonomy, Challenges and Future Directions. arXiv. https://arxiv.org/abs/2607.12406
