# Tarjous — DWS IQ Aegis Pilot (3 kk)

# VERSION AND AGENT HISTORY

---

Version: 1.4 [Latest]

Sessions & Modifications:

- Version: 1.4 [Latest] | Tool: Claude Code | Session: claude/aegis-pilot-openshell-03ist6 | Date: 28.09.2026 | Changes: HIC 28.9.2026: (1) kärkeen 'pysäytyksen toteutuminen todennetaan lokista, ei agentin omasta ilmoituksesta'; (2) uusi 'Päätösvallan tietue' — kuka piti päätösvallan ja mitä siitä seurasi (toteutus PR #2229, ml. pysäytyksen hautakivi); (3) artiklat 12 ja 26: loki tuottaa todistusaineiston, riittävyyden toteaa tarkastaja; (4) CLOUD Act: mekanismi ja johtopäätös lakiosastolle; avaimen säilytys kerrottu totuudenmukaisesti (ohjelmistoavain, TPM/HSM ei sisälly). Geminin ehdotuksista hylätty totuudenvastaiset: TPM/HSM-allekirjoitus, 'laitteistoloki', 'ydinlokit', 'seuraukset reaalimaailmassa'. | Harness: Claude Code + CLAUDE.md | HIC-approved-drift: none
- Version: 1.3 [not latest] | Tool: Claude Code | Session: claude/aegis-pilot-openshell-03ist6 | Date: 28.09.2026 | Changes: HIC 28.9.2026: Sentry on optio muissa lainkäyttöalueissa; EU-suvereeneissa kohteissa oletus on ilman Sentryä (luottamuksen juuri pysyy asiakkaalla). Valinta kirjataan laajuusmäärittelyyn. | Harness: Claude Code + CLAUDE.md | HIC-approved-drift: none
- Version: 1.2 [not latest] | Tool: Claude Code | Session: claude/aegis-pilot-openshell-03ist6 | Date: 28.09.2026 | Changes: HIC 28.9.2026: NVIDIAn osuus rajoittuu laitteiston mukaan; Sentry / BlueField-4 on nyt optio (ei 'ei sisälly'). Optiohinta on paikkamerkki, koska LF-DOCA-SECURITY esiintyy tuoteluettelossa kahdesti ristiriitaisin ehdoin, eikä Sentry-integraatiota ole hinnoiteltu. | Harness: Claude Code + CLAUDE.md | HIC-approved-drift: none
- Version: 1.1 [not latest] | Tool: Claude Code | Session: claude/aegis-pilot-openshell-03ist6 | Date: 28.09.2026 | Changes: HIC:n palaute 28.9.2026 toteutettu. (1) Ydinviesti on päätösvalta ja sen seuraukset, ei sääntelyn täyttyminen; Aegis ei ole "compliance-kerros NVIDIAn päällä". (2) NVIDIAn asema kerrotaan suoraan: ei nimetty kumppani, OpenShell on avoimen lähdekoodin komponentti, Sentry/BlueField kuvataan referenssiarkkitehtuurina. (3) CLOUD Act -väite korvattu mekanismilla: mitä rajan yli liikkuu, kuka pitää avaimet, mitä lokissa on, mitä emme väitä. (4) Skooppi näkyy hinnassa: pilotin agentit eivät ohjaa fyysisiä laitteita; robotiikka ja kaksoiskäyttötuotanto eivät sisälly hintaan. | Harness: Claude Code + CLAUDE.md + DWS_TRUTH_STANDARD | HIC-approved-drift: none
- Version: 1.0 [not latest] | Tool: Claude Code | Session: claude/aegis-pilot-openshell-03ist6 | Date: 28.09.2026 | Changes: Luotu. Suomenkielinen Aegis Pilot -tarjouspohja HIC:n blogiluonnoksen pohjalta; kaupalliset ehdot dws10.com/config/products.json ja hinnasto v1.33. | Harness: Claude Code + CLAUDE.md | HIC-approved-drift: none

Document Status:

- Created: 28.09.2026
- Last Modified: 28.09.2026
- Status: DRAFT — HIC:n hyväksyntä ennen ensimmäistä lähetystä (Approval Request Rule)
- Language: Finnish
- Classification: Asiakaskohtainen tarjous (täytä hakasulkeiden kentät)
- Owner: Lifetime Oy

---

**Vastaanottaja:** [Asiakas Oy] · [Yhteyshenkilö, rooli] · [sähköposti]
**Päiväys:** [pp.kk.vvvv] · **Viite:** DWS-AEGIS-PILOT-001
**Voimassa:** 30 päivää päiväyksestä, kuitenkin enintään 15.11.2026 asti (hinnasto v1.33)

**Tarjoaja:**
Lifetime Oy · Y-tunnus 0772407-9 · ALV FI07724079
Laidunmaanraitti 2 A 25, 02330 Espoo
Risto Anton Päärni, toimitusjohtaja · risto.paarni@lifetime.fi · +358 400 319 010

---

## 1. Kuka piti päätösvallan — ja mitä siitä seurasi

**Pysäytyksen toteutuminen todennetaan lokista, ei agentin omasta ilmoituksesta.**

Kun tekoälyagentti tekee työtä valvomossa, kysymys ei ole siitä, täyttyykö laki. Kysymys on siitä, kuka piti päätösvallan ja mitä siitä seurasi. Päätöksestä vastaava ihminen tarvitsee kolme asiaa:

- **Kill-switch.** Operaattori pysäyttää käynnissä olevan agentin, ja pysäytys lopettaa agentin eikä vain pyydä sitä lopettamaan.
- **Aukoton lokiketju.** Jokaisesta päätöksestä jää paikallinen, allekirjoitettu merkintä: mikä agentti päätti, millä valtuutuksella, minkä sääntöjen alaisena ja mitä siitä seurasi. Merkinnän voi varmentaa jälkikäteen luottamatta agenttiin eikä meihin.
- **Päätösvalta säilyy myös verkon ollessa poikki.** Ympäristöissä, joissa virhemarginaali on nolla, hallinta ei saa riippua ulkoisesta yhteydestä.

### Päätösvallan tietue

Tämä on DWS IQ Aegiksen ydin, ja se erottaa sen turvallisesta ajoympäristöstä ja lokista. Jokaisesta agentista syntyy tietue, joka näyttää:

- **Kuka piti päätösvallan:** millä tunnisteella ja oikeuksilla agentti toimi, minkä allekirjoitetun laajuusmäärittelyn nojalla valtuutus annettiin ja kuka sen allekirjoitti kummankin osapuolen puolesta.
- **Mitä se päätti:** päätökset, jotka se teki tämän valtuutuksen nojalla.
- **Mitä siitä seurasi:** valmistuiko työnkulku, epäonnistuiko se, jonoutuiko osa työstä yhteyskatkon ajaksi ja tehtiinkö se myöhemmin, vai pysäytettiinkö agentti.
- **Kuka pysäytti ja mitä sen jälkeen tapahtui:** mikä operaattori pysäytti agentin, milloin ja miksi, ja todiste siitä, ettei pysäytyksen jälkeen kirjattu yhtään agentin toimintoa. Loki kieltäytyy kirjaamasta pysäytetyn agentin työtä ja kirjaa yrityksenkin.

Tietue muodostetaan vain varmennetusta lokista; muokatusta lokista sitä ei muodosteta lainkaan. Lokissa on vain tunnisteita, ja nimet yhdistetään niihin teidän omassa ympäristössänne. Näin henkilötiedot pysyvät teidän hallinnassanne.

Päätösloki tuottaa sen todistusaineiston, jota EU AI Actin artiklat 12 (automaattinen lokitus) ja 26 (käyttöönottajan valvonta ja lokien säilytys) edellyttävät. Sen riittävyyden toteaa teidän tarkastajanne, ei me. Sääntely ei ole se, mitä myymme. Myymme todistettavan vastauksen kysymykseen: pysyikö päätösvalta teillä?

Periaate on sama, jolla internetistä tuli turvallinen. Sitä ei tehty turvalliseksi pyytämällä verkkosivujen tekijöitä lupaamaan olevansa hyviä, vaan selain lakkasi luottamasta sivujen koodiin. Agentti ei voi valvoa itseään. Siksi hallinta on agentin ulkopuolella ja teidän käsissänne.

## 2. Mitä pilotti todistaa — hyväksyntäehto

Pilotin lopussa ulkoyhteys katkaistaan ennalta sovituksi ajaksi teidän hallinnoimallanne menetelmällä. Ennen testiä ulospäin suuntautuvaa yhteyttä yritetään, ja yrityksen on epäonnistuttava. Tulos on binäärinen:

1. Valmistuuko pilotoitu työnkulku ilman verkkoyhteyttä?
2. Kirjoitetaanko päätösloki edelleen paikallisesti, ilman aukkoja?
3. Voiko operaattori pysäyttää käynnissä olevan agentin, niin ettei lokiin kirjaudu sen jälkeen yhtään agentin toimintoa?

**Kaikkien kolmen on toteuduttava.** Testiin käytetty agentti on tarkoituksella sellainen, joka ei itse suostu pysähtymään. Hyväksytty tulos tarkoittaa siis, että se pysäytettiin, ei sitä, että se suostui pysähtymään.

Negatiivinen tulos on hyödyllinen löydös eikä virhe. Opitte sen 19 990 eurolla ettekä laitteisto-ohjelman jälkeen.

Testistä syntyy allekirjoitettu hyväksyntätietue, joka sisältää päätösvallan tietueen. Teidän tarkastajanne voi varmentaa sen myöhemmin omalla koneellaan, ilman yhteyttä meihin.

## 3. Teknologia ja NVIDIAn asema — suoraan sanottuna

**NVIDIA ei ole tämän tarjouksen osapuoli eikä nimetty kumppani.** Käytämme NVIDIAn julkaisemaa avointa lähdekoodia samoin ehdoin kuin kuka tahansa muu.

| Osa                                   | Mikä se on                                                                                                                                           | Asema tässä tarjouksessa                                                                                                                                                                                                                                                                     |
| ------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **NVIDIA OpenShell**                  | Avoimen lähdekoodin (Apache 2.0) ajoympäristö, joka eristää jokaisen agentin Linux-ytimen mekanismeilla (Landlock, seccomp, verkkonimiavaruus)       | Komponentti, jonka Lifetime asentaa ja konfiguroi. Jokainen työnkulun vaihe ajetaan omassa hiekkalaatikossaan. Hiekkalaatikon säännöt johdetaan teidän allekirjoittamastanne laajuusmäärittelystä, ja ydinvaiheilla ei ole verkkoa lainkaan. Versio lukitaan, ja telemetria käännetään pois. |
| **NVIDIA Open Agent Safety Platform** | NVIDIAn referenssiarkkitehtuuri: OpenShell NVIDIA Vera -suorittimilla ja NVIDIA Sentry BlueField-4-DPU:lla DOCAn päällä                              | Kuvaamme sen, koska se on alan suunta. Emme toimita sitä emmekä edellytä sitä.                                                                                                                                                                                                               |
| **NVIDIA Sentry / BlueField-4**       | Laitteistotason valvonta agentin ulottumattomissa                                                                                                    | **Optio muissa lainkäyttöalueissa** Vera- ja BlueField-4-laitteistolla (ks. kohta 6). EU-suvereeneissa kohteissa oletus on ilman Sentryä. Muulla laitteistolla NVIDIAn osuus rajoittuu avoimen lähdekoodin OpenShelliin, joka toimii myös Arm- ja x86-laitteistolla.                         |
| **DWS IQ Aegis**                      | Päätösvallan kerros: tunnistus ja valtuutus (KYA), operaattorin pysäytysvalta, allekirjoitettu päätösloki, yhteydenkatkaisutesti ja hyväksyntätietue | Lifetimen toimittama ja vastuulla oleva osa                                                                                                                                                                                                                                                  |

**Edellytys:** OpenShell vaatii Linux 6.2 -ytimen tai uudemman (Landlock käytössä) sekä konttiympäristön (Docker tai Podman). Tämä tarkistetaan vaiheessa 0. Jos kohde ei täytä edellytyksiä, agentit eristetään säietasolla ja pysäytetään lopettamalla. Hyväksyntätietue kertoo tällöin nimenomaisesti, millä tasolla eristys toteutui.

NVIDIA, OpenShell, Sentry, BlueField, Vera ja DOCA ovat NVIDIA Corporationin tavaramerkkejä. Niitä käytetään tässä kuvailevasti, eikä niiden käyttö tarkoita NVIDIAn hyväksyntää tai kumppanuutta.

## 4. Suvereniteetti — mekanismi, ei väite

Emme väitä, että ratkaisu olisi "immuuni" millekään lainsäädännölle. Kerromme, miten se toimii, ja teidän lakiosastonne voi arvioida sen itse.

| Kysymys                        | Vastaus                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Mitä rajan yli liikkuu?**    | Ydinvaiheista ei mitään. Tämä todennetaan hyväksyntätestissä, jossa ulospäin suuntautuva yhteys katkaistaan ja yhteyden puuttuminen tarkistetaan. Ei-ydinvaiheet (esim. raportin arkistokopio) voivat ottaa yhteyden vain niihin osoitteisiin, jotka on lueteltu teidän allekirjoittamassanne laajuusmäärittelyssä. Yhteyskatkon aikana ne jonoutuvat paikallisesti allekirjoitettuina.                                                                 |
| **Kuka pitää avaimet?**        | Kohteen allekirjoitusavain luodaan teidän laitteistollanne, ja se jää teidän palvelutunnuksenne haltuun (vain omistajan luettavissa). Sen tunniste kirjataan allekirjoitettuun laajuusmäärittelyyn, joten avaimen vaihtaminen huomataan. Operaattoreiden pysäytysavaimet ovat operaattoreiden omia. Lifetime ei säilytä avaimia. Avain on ohjelmistoavain teidän palvelimellanne. Laitteistoon sidottu avainsäilö (TPM 2.0 / HSM) ei sisälly pilottiin. |
| **Mitä lokissa on?**           | Tunnisteet, tiivisteet (SHA-256) syötteistä ja tuloksista, yhden rivin päätöskuvaukset ilman henkilötietoja, sovelletun säännöstön tiiviste ja pysäytystapahtumat operaattorin tunnisteella. Raakasyötteitä tai -tuloksia ei kirjoiteta. Lokin muoto on avoin, ja sen voi varmentaa ilman meitä.                                                                                                                                                        |
| **Kuka pääsee järjestelmään?** | Asennus tehdään paikan päällä tai teidän hallinnoimanne etäyhteyden kautta. Etäyhteys on katkaistu viimeistään hyväksyntätestissä.                                                                                                                                                                                                                                                                                                                      |
| **Mitä emme väitä?**           | Laitteisto ja sen laiteohjelmisto voivat olla yhdysvaltalaisen toimittajan valmistamia, esimerkiksi NVIDIAn. Se on toimitusketjuriski, jota arvioidaan erikseen. Tässä toimintamallissa mikään yhdysvaltalainen palveluntarjoaja ei kuitenkaan hallinnoi dataanne, avaimianne eikä lokianne. OpenShellin lähdekoodi on avoin ja tarkastettavissa.                                                                                                       |
| **Kenen johtopäätös?**         | Teidän lakiosastonne. Kuvaamme mekanismin: OpenShellin telemetria on poistettu lähdekoodista käännösvaiheessa, avaimet ja loki ovat teidän hallussanne, ja ydinvaiheilla ei ole verkkoyhteyttä. Emme esitä johtopäätöstä CLOUD Actin tai muun lainsäädännön soveltumisesta.                                                                                                                                                                             |

## 5. Pilotin vaiheet (3 kk)

| Vaihe                                  | Viikot        | Tulos (porttiehto)                                                                                                                                                              |
| -------------------------------------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0 — Rajaus ja lähtötaso                | 0–2, maksuton | Allekirjoitettu laajuusmäärittely: kohde, työnkulku, käyttöönottotapa, eristysmenetelmä ja hyväksyntäehdot teidän omalla kielellänne. Tarkistetaan ydin- ja konttiedellytykset. |
| 1 — Paikallinen perusta                | 3–5           | Neljä paikallista toimintoa (ajo, tunnistus, loki, pysäytys) todennettu yhteyden ollessa jo poikki                                                                              |
| 2 — Työnkulun integrointi              | 6–9           | Teidän työnkulkunne valmistuu verkkoyhteydellä, ja päätösloki on täydellinen. Työnkulun omistaja hyväksyy tuloksen.                                                             |
| 3 — Hyväksyntätesti yhteys katkaistuna | 10–11         | Harjoitusajo ja sen jälkeen todistajan läsnä ollessa tehty hyväksyntäajo. Kaikki kolme ehtoa tai negatiivinen tulos.                                                            |
| 4 — Mitoitus, raportti ja päätös       | 12–13         | Tuotantolaitteiston mitoitus mitatun kuorman perusteella, raportti ja suositus                                                                                                  |

## 6. Skooppi ja hinta

**Pilotin agentit tuottavat päätöksiä, suosituksia ja kirjauksia valvomon työnkulussa. Ne eivät ohjaa fyysisiä laitteita.** Nollamarginaaliympäristö tarkoittaa tässä vaatimusta hallinnalle ja näytölle, ei autonomista ohjausta.

|                  | Sisältyy hintaan 19 990 €                                                                                                                                   | Ei sisälly                                                                               |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| **Laajuus**      | Yksi kohde ja yksi valvomon työnkulku; mukana vain sen tarvitsemat agentit                                                                                  | Useat kohteet, muut toimialat                                                            |
| **Toiminnot**    | Paikallinen ajo, OpenShell-eristys, tunnistus ja valtuutus, operaattorin pysäytysvalta, allekirjoitettu päätösloki, yhteydenkatkaisutesti, hyväksyntätietue | Robotiikan tai muiden fyysisten laitteiden ohjaus, kaksoiskäyttötuotannon käyttöönotto   |
| **Laitteisto**   | Ei laitehankintaa: olemassa oleva infrastruktuurinne tai kompakti reunalaite                                                                                | Laitehankinnat. NVIDIA Sentry / BlueField-4 on optio (alla).                             |
| **Integraatiot** | Lukuoikeudet lähdejärjestelmiin                                                                                                                             | Räätälöidyt ERP-, BIM- tai SCADA-integraatiot, LWM-integraatio                           |
| **Tulokset**     | Tuotannon mitoitus, raportti, suositus                                                                                                                      | DWS IQ Aegis -toteutusohjelma (DWS-AEGIS-IMPL-001, 45 000 €, erillinen eikä hyvitettävä) |

Fyysisten laitteiden ohjaus ja kaksoiskäyttötuotanto ovat erillinen sitoumus. Ne rakentuvat tämän pilotin todentaman perustan päälle ja hinnoitellaan omina vaiheinaan, jos ja kun ne tarjotaan. Tässä tarjouksessa niitä ei myydä.

| Kaupalliset ehdot        |                                                                                                                                                                                                                                                                                              |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Hinta**                | **19 990 € (alv 0 %)**, kiinteä, 3 kuukautta                                                                                                                                                                                                                                                 |
| **Hyvitys**              | Hyvitetään **täysimääräisesti** 59 990 euron Aegis-lisenssistä, jos jatkatte tuotantoon 6 kuukauden kuluessa. Maksettavaksi jää 40 000 €, ja kokonaiskustannus tuotantoon pysyy 59 990 eurona. Hyvitys on enintään 19 990 €, kohdistuu vain Aegis-lisenssiin ja raukeaa 6 kuukauden jälkeen. |
| **Ylläpito tuotannossa** | Alkaen 999 €/kk (DWS-AEGIS-SUB-001), alkaa vasta tuotantokäytössä                                                                                                                                                                                                                            |
| **Jos ette jatka**       | Arkkitehtuuri, mittaukset ja hyväksyntätietue jäävät teille. Muuta ei makseta.                                                                                                                                                                                                               |

### Optio: NVIDIA Sentry / BlueField-4

**Oletus EU-suvereeneissa kohteissa: ilman Sentryä.** Silloin päätösvallan ja näytön luottamuksen juuri on kokonaan teidän hallussanne: kohteen avain on teidän laitteistollanne, ja loki on varmennettavissa ilman ulkopuolista osapuolta. Sentry siirtäisi osan valvonnasta yhdysvaltalaisen toimittajan piiriin ja laiteohjelmistoon.

**Optio muissa lainkäyttöalueissa.** Sentry on tarjolla asiakkaille, jotka toimivat toisessa lainkäyttöalueessa ja haluavat laitteistotason valvonnan. Edellytyksenä on, että kohteessa on jo NVIDIA Vera- ja BlueField-4-laitteisto; laitteistoa ei hankita tämän tarjouksen puitteissa. Valinta ja sen peruste kirjataan allekirjoitettuun laajuusmäärittelyyn.

|                                              |                                                                                                                                          |
| -------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| **Mitä se lisää**                            | Laitteistotason valvonta ja karanteeni agentin ja isäntäkoneen ulottumattomista. OpenShellin säännöt pannaan täytäntöön myös piitasolla. |
| **DOCA-palvelut**                            | DOCA Security & Compliance -paketti (LF-DOCA-SECURITY), [hinta vahvistetaan hinnastosta] / kk per DPU                                    |
| **Sentry-integraatio Aegiksen päätöslokiin** | Hinnoitellaan erillisellä tarjouksella vaiheen 0 jälkeen, kun laitteisto ja laajuus on todettu                                           |
| **Vaikutus pilottiin**                       | Hyväksyntäehto ja pilotin hinta pysyvät samoina. Hyväksyntätietue kertoo, oliko laitteistotason valvonta käytössä.                       |

## 7. Seuraava askel

Maksuton rajauspalaveri (vaihe 0, 60 min). Siinä sovitaan pilotoitava työnkulku, eristysmenetelmä ja hyväksyntäehdot teidän operatiivisella kielellänne. Lakiosastonne on tervetullut mukaan: kohdat 3 ja 4 on kirjoitettu heitä varten.

---

Risto Anton Päärni
Founder, CEO · Lifetime Oy · the Agent Outcome Company
risto.paarni@lifetime.fi · +358 400 319 010
