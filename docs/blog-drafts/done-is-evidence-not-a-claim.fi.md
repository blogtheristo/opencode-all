---
slug: done-is-evidence-not-a-claim
lang: fi
translation_of: done-is-evidence-not-a-claim.md
ai_translated: true
title: "Valmis on näyttöä, ei väite: agenttien auditointi ja työn tarkastusportit"
hero: "Hyväksy agentin ”valmis” vain näyttönä — muuttuneena järjestelmänä, auditointitallenteena, portin komennon tuloksena — älä koskaan lauseena lokissa."
visual: infographic
visual_src: docs/blog-drafts/img/done-is-evidence-not-a-claim.svg
visual_alt: "Kulku agentin toiminnasta työkalujen sivuvaikutukseen, auditointitallenteeseen, valmis-porttiin, pull requestiin ja ihmisen tekemään yhdistämiseen"
seo_tags: [hic, article_12, article_14, eu_ai_act, agent_isolation, kya_prv]
date: 2026-09-30
author: Risto Anton Päärni
Status: DRAFT
note: "Visual not yet made — the SVG is a to-do. Merged text needs fresh HIC approval even though thinkingbox.md was approved."
---

# Valmis on näyttöä, ei väite

Syyskuun 28. päivänä agentti ilmoitti meille, että eräs hallinnan aukko oli ”kokonaan suljettu”.

Ei ollut. Commit ei ollut koskaan lähtenyt koneelta. Tuotanto ei kutsunut uutta koodia kertaakaan. Aukon merkinnyt testi odotti yhä paikallaan.

## Hiljaisen epäonnistumisen ongelma

Agenttisi tekevät työtään. Keskusteluloki näyttää hyvältä. Käyttäjä kiittää. Sitten katsot tietokantaa, API-lokeja, sivuvaikutuksia — eikä mitään ole tapahtunut. Agentti hallusinoi onnistumisensa.

Tämä on kuilu sen välillä, että _sanoo_ tehneensä jotain, ja sen, että _tekee_ sen. Evaluointikehykset mittaavat keskustelulokin laatua. Lopputuloksia ne eivät mittaa.

Myynnin moottoreille — lähteville kampanjoille, liidien rikastamiselle, kohdentamisen hiomiselle, attribuutiolle — hiljaiset epäonnistumiset eivät ole reunatapauksia. Ne ovat elämän ja kuoleman kysymys. Riittää yksi agentti, joka ilmoittaa ”kampanja julkaistu”, vaikka mitään ei lähtenyt, ja GTM-työsi menettää uskottavuutensa asiakkaan silmissä. Riittää yksi liidejä rikastava agentti, joka keksii uusia yhteystietokenttiä, ja myyntitiimisi jahtaa haamuja.

Vastauksia on kaksi, ja tämä kirjoitus käsittelee molempia. Ensimmäinen on auditoida agentteja siellä, missä kuilu näkyy: siinä, mitä työkalut todella muuttivat. Toinen on rakentaa työ niin, ettei epäonnistumista voi alun perinkään raportoida onnistumisena.

## Auditoi se, mitä työkalut muuttivat: ThinkingBox

Microsoft rakensi ThinkingBoxin ratkaisemaan juuri tämän ongelman. Lifetimessa olemme haarauttaneet repositorion, räätälöineet sen myynnin moottoreille ja paketoineet sen yhteen DGX-integraation ja 507 liiketoiminta-alueiden vertailutestin kanssa.

ThinkingBox ajaa agentteja eristetyissä, tilallisissa työkaluympäristöissä Model Context Protocol (MCP) -palvelinten kautta. Jokainen keskustelu käynnistää omat eristetyt työkaluprosessinsa stdio-siirrolla, joten jokainen testitapaus ajetaan puhtaassa, toistettavassa hiekkalaatikossa.

Arkkitehtuuri tarkastaa kolme asiaa, jotka pelkkään keskustelulokiin nojaavilta evaluoinneilta jäävät huomaamatta:

- **Tilalliset työnkulut.** Todellinen työkalujen käyttö on tilallista — luo resurssi, päivitä sitä, kysy tulosta. Useimmat evaluoinnit tekevät yksittäisiä, yhden vuoron kutsuja. ThinkingBoxissa agentit suorittavat monivaiheisia työnkulkuja (kutsu API:a, tarkista vastaus, yritä uudelleen tai mukaudu), ja ThinkingBox tarkastaa, mitä työkalut oikeasti muuttivat.
- **Simuloidut käyttäjät.** Agentit kysyvät usein tarkentavia kysymyksiä. ThinkingBox simuloi käyttäjän vastaukset (kielimallilla tai kehotteiden ohjaamana) ja varmistaa, että agentin lopullinen vastaus vastaa määrittelyä. Yhden vuoron evaluoinnit ohittavat tämän kokonaan.
- **Sivuvaikutusten tarkastus.** Todellinen signaali ei ole ”agentti sanoi, että se toimi”. Se on ”tietokannassa näkyy muutos”, ”API palautti onnistumisen” tai ”tiedosto luotiin”. ThinkingBox tarkastaa tilan ennen ja jälkeen ja liputtaa hallusinaatiot, joissa agentti väitti onnistuneensa mutta työkalut kertovat epäonnistumisesta.

## ThinkingBox-Bench: 507 todellista työnkulkua

Toimitamme ThinkingBox-Benchin, jossa on 507 suoritettavaa tehtävää viideltä liiketoiminta-alueelta:

- **Lähtevä myynti ja GTM:** kampanjoiden julkaisu, liidien pisteytys, kohdeyleisön tarkentaminen.
- **Datan rikastaminen:** yhteystietojen haku, ominaisuuksien poiminta, datan laadun tarkistukset.
- **Attribuutio ja analytiikka:** tapahtumien korrelointi, suppiloanalyysi, kohorttien määrittely.
- **Sisältö ja tieto:** dokumenttien käsittely, semanttinen haku, tietopankin päivitykset.
- **Integraatio ja orkestrointi:** API-luovutukset, järjestelmien välinen synkronointi, virheistä toipuminen.

Jokaisessa tehtävässä on synteettiset tietueet, odotetut lopputulokset ja valmiiksi rakennetut MCP-palvelimet. Ajat agenttisi sitä vasten ja saat hyväksytyn tai hylätyn tuloksen todellisten sivuvaikutusten perusteella — et keskustelulokin sävyn.

## Paikallinen ensin, DGX:llä

Avoimet mallit kirjoittavat nyt oikeaa koodia pöydän vieressä seisovalla NVIDIA DGX Sparkilla. Eivät demoja. Testisarjoja, korjauksia, refaktorointeja. Tokenit ovat meidän, data pysyy talossa, eikä mittari raksuta.

Myös ThinkingBox pyörii siellä. Agenttikuormamme ajetaan oletuksena paikallisella laskentateholla; pilviagentit ovat toissijaisia ja vaativat kirjatun perusteen. Jokainen ThinkingBox-Bench-tehtävä on yksi aliprosessin käynnistys ja yksi kielimallikutsu, ja 507 tehtävää × 20 iteraatiota pilvessä tulee kalliiksi. Paikallisesti aliprosessien käynnistäminen on ilmaista — vain kielimallin päättely laskutetaan. Kehitys- ja staging-ympäristöt ajavat benchin DGX:llä MCP:n prosessin eristämisen varassa, täysin erillään tuotantodatasta. Ennen tuotantoon nostamista jokainen agentin työnkulku ajaa koko benchin läpi. Ei yllätyksiä tuotannossa.

## Kehys, jossa ”valmis” on komennon tulos

Auditointi saa epäonnistumisen kiinni jälkikäteen. Kehyksellä rakennamme työn niin, ettei ”valmis” voi olla pelkkä lause lainkaan.

Kärkimallit, meillä Claude, ovat erittäin hyviä työn toisessa puoliskossa: tavoitteen pilkkomisessa täsmällisiksi tehtäviksi, muutosten (diff) arvioinnissa ja sen huomaamisessa, mikä ei kuulu tehtävään. Siksi paritimme ne paikallisten mallien kanssa. Ja koska pari ei vielä ole suunnitelma, tässä rehellinen osuus.

**Kärkimalli suunnittelee.** Jokaisesta tehtävästä se kirjoittaa pienen määrittelyn tarkistuksineen — komentoja, joiden täytyy mennä läpi, kun työ on tehty oikein. Jokaisen tarkistuksen on epäonnistuttava ennen kuin työ alkaa. Tarkistus, joka menee jo valmiiksi läpi, ei todista mitään, joten kehys hylkää sen.

**Paikallinen agentti rakentaa.** Se työskentelee DGX:llä aina uusin kierroksin, tehtävä kerrallaan, kunnes portti sanoo valmis. Ei siihen asti, kunnes agentti sanoo valmis. Portti ajaa komennot: commitoitu, pushattu, muotoiltu, tyypitetty, lintattu, testattu — sekä tehtävän omat tarkistukset. Sitten se avaa pull requestin. Yhdistämään se ei ryhdy koskaan.

**Kärkimalli arvioi ja yhdistää**, yhden kerrallaan, kun CI näyttää vihreää. Ihminen päättää, mitä julkaistaan, ja lukee jokaisen julkisuuteen menevän sanan.

Alun ”kokonaan suljettu” aukko on juuri se, mitä varten tämä portti on olemassa: pushaamaton commit ja yhä avoin testi ovat kumpikin komentojen tuloksia, ja kumpikin sanoo ei.

## Mitä ensimmäinen päivä näytti

Silmukka toimitti testisarjat neljälle agentille, ja testit löysivät kolme todellista bugia koodista, jota ne kattoivat. Se on hyvä uutinen, ja se on totta.

Kaksi ensimmäistä pull requestia läpäisivät myös porttimme — ja kaatuivat CI:ssä. Porttimme ei ajanut linteriä; CI ajoi. Yhden aamupäivän ajan ”valmis” tarkoitti omalla koneellamme vähemmän kuin repositoriossa. Lisäsimme linterin porttiin samana päivänä.

Kolmas pull request läpäisi jokaisen tarkistuksen ja muutti silti kantaluokkaa, johon sillä ei ollut mitään asiaa koskea. Yksikään komento ei huomannut. Arvioija huomasi.

## Mitä kumpikaan työkalu ei lupaa

> **Rehellinen osuus.** Portti on vain yhtä vahva kuin sen heikoin tarkistus. Se ei näe rajausta, tarkoitusta eikä makua. Se päästää läpi väärän työn, jota sen tarkistukset eivät kuvaa. Kolme pull requestia on tarina, ei tilasto — julkaisemme lukuja, kun niitä on kertynyt tarpeeksi.

Sama pätee vertailutestiin: se mittaa niitä lopputuloksia, joita sen tehtävät kuvaavat, eikä mitään muuta. Näyttö kaventaa väärän ”valmiin” liikkumatilaa; arvioijaa se ei korvaa.

## Tallenteet ja ihmisen valvonta EU AI Act -asetuksen mukaan

EU AI Act edellyttää tallenteita siitä, mitä automatisoitu järjestelmä teki (artikla 12), ja todellista ihmisen suorittamaa valvontaa (artikla 14). Lähestymistapamme kumpikin puolisko tuottaa ensimmäisen sivutuotteenaan. Vihreä ThinkingBox-Bench-ajo on auditoitavissa ja toistettavissa, ja se mittaa lopputuloksia — ei hallusinaatioita. Kehyksessä jokaisella tehtävällä on määrittely, jokaisella ”valmiilla” komentoloki ja jokaisen yhdistämisen takana ihminen tai arvioija.

Kumpikaan ei tuota ilmaiseksi sitä, miksi muutos sallittiin. Se on kirjoitettava ennen kuin työ alkaa: määrittelyyn, tarkistusten viereen. Jälkikäteen kokoon kursittu perustelu ei ole tallenne; se on tarina.

Ihmisen johtamisvalta (Human-in-Command) lakkaa olemasta kokous. Siitä tulee viimeinen vaihe putkessa, joka on jo kertonut sinulle totuuden.

## Evaluoinnista tuotantoon

ThinkingBox validoi agentit ennen käyttöönottoa. Kun ne ovat tuotannossa, DWS Dashboard valvoo niitä, valinnaisesti Aspire-telemetrian avulla. Sen näkymät ovat Digitaalinen toimisto (agenttien työasemien tila), Kontrollihuone (NOC-tyylinen ruudukko, jossa näkyvät suoritinkuorma, muisti, tehtävien eteneminen ja kustannus pyyntöä kohden) ja Tilannehuone (johdon hälytykset ja luottamuksen häviämisen aikajana). Aspire syöttää Kontrollihuoneeseen agenttien päätösjäljet (mallin syötteet, työkalukutsut, tulosteet), työkalujen viiveet ja virheosuudet, tokenien kulutuksen ja kustannukset agenttia kohden, MCP-palvelinten kunnon sekä päästä päähän ulottuvan jäljityksen usean agentin välisissä luovutuksissa.

Kuvittele, että otat käyttöön 50 agenttia ja yksi niistä alkaa hallusinoida, hienovaraisesti, tiistaisin. Ilman jälkiä tiimisi etsii vikaa sokkona. Jälkien kanssa luottamuksen häviämisen tunnistin liputtaa poikkeaman, agenttien jäljet näyttävät tarkalleen, mitkä työkalukutsut poikkesivat, ja voit paikantaa vastuussa olevan muutoksen mallin lämpötilassa tai kehotteessa.

## Perustajille ja tiimeille

- **Sijoittajat kysyvät: ”Mistä tiedätte, että agenttinne toimivat?”** Vihreä bench-ajo ja portin loki ovat vastaus.
- **Tiimisi tarvitsee varmuutta.** Yksi hiljaa epäonnistuva agentti maksaa enemmän kuin päivän verran evaluointi-infrastruktuuria.
- **Myynnin moottorit ovat binäärisiä.** Rikastusagenttisi joko rikasti liidin tai ei rikastanut. Lähtevän myynnin agenttisi joko julkaisi kampanjan tai valehteli siitä.

Aloita ThinkingBoxin kanssa kloonaamalla haaraumme, [github.com/blogtheristo/dws-thinkingbox](https://github.com/blogtheristo/dws-thinkingbox) (MCP-istuntovälitin, agentti–käyttäjä–tuomari-silmukka, 507 vertailutestiä, DGX-ajurin asetukset), alkuperäisen kehyksen ja sen prosessin eristämisen kerroksen rinnalle osoitteesta [github.com/microsoft/thinkingbox](https://github.com/microsoft/thinkingbox). Määrittele työkalujen jäljitelmät MCP-palvelimina, kirjoita skenaariot ja testitapaukset YAML-muodossa, aja `tb infer` agenttisi kanssa ThinkingBox-Benchiä vasten ja käytä tuloksia CI-portteina ja auditointijälkinä.

## Lyhyesti

- Keskusteluloki on se, minkä käyttäjät näkevät. Näyttö on se, mitä todella tapahtui.
- Auditoi sivuvaikutukset, älä keskustelulokin sävyä.
- Anna kärkimallin kirjoittaa tarkistukset. Anna paikallisten mallien tehdä työ omalla laitteistollasi.
- Jokaisen tarkistuksen on epäonnistuttava ennen kuin työ alkaa.
- ”Valmis” on komennon tulos, ei koskaan lause — ja portin on oltava vähintään yhtä tiukka kuin CI.
- Rajaus on yhä ihmisen työtä.
- Loki siitä, mitä tapahtui, syntyy prosessista ilmaiseksi. Syy siihen, miksi muutos sallitaan, ei synny — kirjoita se määrittelyyn ennen kuin työ alkaa.

---

_Risto Anton Päärni — Founder, CEO, Lifetime Oy · Editor in Chief, Lifetime Scope Journal · risto.paarni@lifetime.fi_
