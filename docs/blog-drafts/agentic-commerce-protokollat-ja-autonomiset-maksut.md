---
slug: agentic-commerce-protokollat-ja-autonomiset-maksut
title: "Kun agentti maksaa: kolme protokollaa, neljä kaistaa ja yksi kertakäyttöinen avain"
subtitle: "AP2, UCP ja ACP kertovat miten mandaatti liikkuu — eivät sitä, saako tämä agentti pitää sellaista"
lang: fi
site: onelifetime.world
author: Risto Anton Päärni
date: 2026-08-08
Status: DRAFT
source: HIC:n sarjasuunnitelma osat 8–11 (sessio claude/kya-s1-blog-parts-8-10-flfmrn)
series: "Blogi 10/11 · DWS IQ & Lifetime World Model"
canon:
  - Legal/KYA_STANDARD_v1.md §14 (Agentic Commerce Mandate Gating, v1.11) — §14.1 protokollat, §14.2 kaistat, §14.2.1 tenant-profiilit, §14.3 spend_authority, §14.5 todisteketju
  - src/identity/ats-engine.ts — MANDATE_FLOOR_ATS = 0.5, PAYMENT_BAND_ATS = 0.8, HNP_FLOOR_ATS = 0.9, evaluateMandateGate()
  - Legal/KYA_S1_v1.3.md §6.2 (TRS-4 atominen valtuutussidonta, TRS-5 fail-closed), §6.1 (FLT-1…FLT-4)
  - docs/blog-drafts/bpmn-xml-trs-portti-riskiluokka-lease-fail-closed.md (Osa 6 — TRS_req-taulukko)
unverified_claims: |
  TARKISTETTAVA ennen julkaisua (Sääntö 12 — merkitään, ei arvata):
  1. Protokollien tilatiedot (§14.1) on päivätty 06.07.2026: AP2 v0.2 FIDO Alliancessa
     (~60 jäsenorganisaatiota, luovutettu 28.04.2026), UCP lanseerattu NRF 11.01.2026,
     ACP tuotannossa ChatGPT-pinnassa ja 4 %:n alustamaksu. Kaikki neljä lukua ovat
     KANONISTA (KYA_STANDARD_v1.md §14.1) mutta yli kuukauden vanhoja. Tarkistettava
     ennen julkaisua — protokollakenttä liikkuu nopeasti ja ACP:n maksuprosentti on
     hinnoitteluväite kolmannesta osapuolesta.
  2. Osan 6 TRS_req-taulukon luvut (60 / 75 / 85 / 95) ja Lease-TTL:t (30 s / 15 s /
     5 s / 2 s) ovat EHDOTUKSIA, eivät kanonia — merkitty sellaisiksi jo Osassa 6.
     Tässä tekstissä ne esiintyvät havainnollistavana esimerkkinä ja on merkitty
     sellaiseksi luvussa 3. Älä poista sitä varausta.
  3. Kanonisia ovat KOODIN kolme alustalattiaa: 0.5 mandaattilattia, 0.8 maksukaista,
     0.9 HNP-lattia. Ne ovat ats-engine.ts:ssä vakioina ja §14.2:n taulukossa.
     Nämä saa esittää lukuina.
  4. Esimerkin JSON-kenttänimet (spend_authority) ovat §14.3:n mukaan HAVAINNOLLISIA
     KYA v2.0:aan asti. Teksti siteeraa siksi semantiikkaa (deny-by-default,
     HIC-sidonta, katot) eikä kenttänimiä lupauksena. Älä muuta tätä.
open_decisions: |
  Ennen julkaisua HIC:n päätettävä:
  1. Yleistetäänkö mandaattikaistojen kuvio työkalukutsuihin ja fyysiseen ohjaukseen
     (auditlista P1-3)? Kuvio on jo olemassa maksuille; luku 4 esittää yleistyksen
     EHDOTUKSENA. Jos se on jo päätetty toteutettavaksi, luvun sanamuoto muuttuu
     ehdollisesta toteavaksi.
  2. Saako tekstissä sanoa, että Aegis-tier oletusarvoisesti kieltää HNP:n? Se on
     §14.2.1:ssä ja on tuotepositiointia, ei vain tekniikkaa. Luku 5 sanoo sen.
---

# Kun agentti maksaa: kolme protokollaa, neljä kaistaa ja yksi kertakäyttöinen avain

Sarjan yhdeksän ensimmäistä osaa on käsitellyt sitä, mitä agentti saa **tehdä**. Tämä osa käsittelee sitä, mitä agentti saa **kuluttaa**.

Ne eivät ole sama kysymys, ja ero paljastui vuoden 2026 alkupuolella kaikille yhtä aikaa: maksualan toimijat julkaisivat johtolangat agenttitransaktioille — ja yksikään niistä ei ratkaise sitä, pitäisikö tätä nimenomaista agenttia päästää maksamaan.

## 1. Kolme protokollaa, ja mitä ne eivät tee

Kentällä on kolme kilpailevaa mutta osin päällekkäistä protokollaa. Ne kannattaa erottaa, koska ne ratkaisevat eri osaa ongelmasta:

| Protokolla | Vastuutaho | Mitä se standardoi |
| ---------- | ---------- | ------------------ |
| **AP2** — Agent Payments Protocol | Google → luovutettu **FIDO Alliancelle** | Kolme allekirjoitettua **mandaattia** — Intent, Cart, Payment — kukin W3C Verifiable Credential -muodossa. Lisäksi **Human Not Present (HNP)**: ennakkovaltuutettu suoritus ilman ihmistä paikalla, sekä väärentämätön toimintaloki. |
| **UCP** — Universal Commerce Protocol | Google + Shopify + Walmart, laaja tekninen neuvosto | Koko kaupankäyntipolku: löytäminen → ostoskori → kassa → oston jälkeiset toimet. |
| **ACP** — Agentic Commerce Protocol | OpenAI + Stripe | Rakenteinen kassavirta agenttipinnan sisällä. |

_(Tilatiedot ovat kanonisesta lähteestä ja päivätty 06.07.2026 — tarkistettavien väitteiden listalla, ks. frontmatter.)_

Kaikki kolme vastaavat kysymykseen **"miten mandaatti kulkee johdolla?"**

Yksikään ei vastaa kysymykseen **"saako tämä agentti pitää sellaista?"**

Se ei ole puute protokollissa. Se on eri kerros. Protokolla kuljettaa valtuutuksen; jonkun on päätettävä, myönnetäänkö se. Luottamuspiste on se päätös, ja sen paikka pinossa on maksuprotokollan yläpuolella.

AP2:n HNP-maksut ovat täsmälleen se tilanne, jossa kauppias, kortinmyöntäjä tai vakuutusyhtiö tarvitsee tarkistettavan luottamusarvon ennen kuin se kunnioittaa ennakkovaltuutusta. Ilman sitä ennakkovaltuutus on pelkkä lupaus siitä, että toisessa päässä oleva ohjelmisto on hyvin kirjoitettu.

## 2. Neljä kaistaa — ja kaksi lattiaa, jotka eivät liiku

Sääntö on yksinkertainen: **agentti saa allekirjoittaa tai esittää maksuprotokollan mandaatin vain oman luottamuskaistansa oikeuksien rajoissa.** Valvontapiste on sama esisuorituksen portti kuin polkuoikeuksilla.

| Luottamuspiste | Mandaattioikeudet | Human Not Present | Päätös |
| -------------- | ----------------- | ----------------- | ------ |
| **≥ 0,90** | Intent + Cart + Payment | **Sallittu**, kulutusvaltuutuksen kattojen sisällä | GO + transaktio |
| **0,80–0,89** | Intent + Cart + Payment | Estetty — ihminen vahvistaa tehtäväkohtaisen katon ylittävät | GO (vahvistettuna) |
| **0,50–0,79** | Vain Intent + Cart — agentti kokoaa, **ihminen allekirjoittaa maksumandaatin** | Estetty | GO (rajoitettu) |
| **< 0,50** | **Ei mandaatteja lainkaan** | Estetty | NO_GO |

Nämä kolme rajaa ovat koodissa vakioina — mandaattilattia 0,5, maksukaista 0,8, HNP-lattia 0,9 — eivätkä konfiguraatiossa. Syy on se, että konfiguroitava lattia ei ole lattia.

**Keskimmäinen rivi on koko taulukon idea.** Kaistalla 0,50–0,79 agentti ei ole jäissä eikä vapaa. Se tekee kaiken työn — etsii, vertailee, kokoaa korin, valmistelee ostoksen — ja pysähtyy täsmälleen siihen kohtaan, jossa raha liikkuu. Ihminen allekirjoittaa maksumandaatin. Tämä on se muoto, jossa autonomia on hyödyllistä ilman että se on vaarallista, ja se on siksi todennäköisesti se kaista, jolla useimmat tuotantoagentit tulevat elämään pisimpään.

Mandaattiyritys kaistan ulkopuolelta tai kulutusyritys manifestin katon yli on **rikkomus**: sessio päättyy, luottamuspiste laskee, operaattorille ilmoitetaan — ja lisäksi **kaikki samassa sessiossa myönnetyt elävät mandaatit peruuntuvat.** Viimeinen kohta ei ole koriste. Ilman sitä rikkomuksen havaitseminen pysäyttää tulevat maksut mutta jättää jo myönnetyt ennakkovaltuutukset voimaan.

### Tenant-profiilit: kiristää saa, löysätä ei

Yllä oleva taulukko on **alustan perusprofiili**, ei kovakoodattu käytäntö. Puolustusteollisuuden HNP-katto ei ole terästehtaan HNP-katto. Jokainen asiakas kantaa oman mandaattiprofiilinsa, joka syrjäyttää perusprofiilin — ja juuri tämä tekee yhdestä standardista myytävän 25 säännellylle toimialalle ilman että sitä haarautetaan per toimiala.

Sääntö on yksisuuntainen: **profiili saa kiristää mitä tahansa kaistaa, kattoa tai oikeutta. Se ei koskaan saa löysätä kahden liikkumattoman alustalattian yli.**

1. Luottamuspiste alle 0,50 on NO_GO jokaisella profiililla. Mikään asiakaskonfiguraatio ei myönnä mandaattia keskeytetylle agentille.
2. HNP:n vähimmäiskaistaa (0,90) saa nostaa tai HNP:n saa kytkeä kokonaan pois — koskaan ei laskea.

Kaikki muu on asiakkaan säädettävissä: katot, valuutat, kauppiaskategoriat, sallitut mandaattityypit, HNP:n saatavuus, vahvistuskynnykset kaistoittain.

Tämä on toteutettu validaattorina eikä ohjeena. Profiili, joka yrittää asettaa HNP-vähimmäisrajan alle 0,90:n, ei mene läpi — se hylätään virheellä, joka nimeää rikotun pykälän. Käytäntö, jonka noudattaminen on kirjoitettu dokumenttiin mutta ei validaattoriin, on toive.

## 3. Kynnys ei ole järjestelmän ominaisuus vaan teon ominaisuus

Sarjan kuudennessa osassa esitettiin sama idea prosessin puolelta: jokaisella tehtävällä on oma vaatimustasonsa, ja se määräytyy **teon seurausvakavuudesta**, ei siitä mitä järjestelmä sattuu tarjoamaan.

| Riskitaso | Vaadittu taso | Valtuutuksen elinaika | Hyväksyntä alle kynnyksen |
| --------- | ------------- | --------------------- | ------------------------- |
| Luku, haku, koonti | 60 | 30 s | Ei — jatka lokituksella |
| Laatukirjaus, erän statuspäivitys | 75 | 15 s | Yksi operaattori |
| Finanssitransaktio, ERP-kirjaus, tilaus | 85 | 5 s | Operaattori + perustelu |
| Laitteen ohjaus, linjan pysäytys | 95 | 2 s | Kaksi henkilöä |

_(Nämä luvut ovat **ehdotus ja havainnollistus**, eivät kanonia. Ne merkittiin sellaisiksi jo Osassa 6 ja ne kuuluvat spesifikaatioon, ei blogiin, ensiesiintymänä. Kanonisia lukuja ovat vain edellisen luvun kolme alustalattiaa.)_

Vertaa taulukoita. Ne ovat sama kuvio kahdella eri asteikolla: mandaattikaistat kuvaavat, mitä agentti saa **kuluttaa**; tehtäväkynnykset kuvaavat, mitä se saa **tehdä**. Nämä kaksi elävät tällä hetkellä eri paikoissa — toinen maksuporttina koodissa, toinen prosessimallin ominaisuutena.

Yleistys, jota kumpikaan ei vielä tee: **seurausluokka kyvykkyysmanifestin kentäksi**, jolloin manifesti ilmoittaa kunkin kyvykkyyden riman eikä rima ole yksi globaali luku kaikelle. Ilman sitä raportin lukeminen ja tuotantolinjan pysäytys ylittävät saman riman. Tämä on kirjattu korjattavaksi ja se on tässä ehdotus, ei toteutunut tila.

## 4. Kertakäyttöinen avain — miksi tuplaveloitus on arkkitehtuurikysymys

Nyt päästään kohtaan, joka erottaa tämän tavallisesta maksuintegraatiosta.

Luottamuspiste **ei saa valtuuttaa toimea suoraan.** Syy on se, että "estetään kun piste on alle rajan" kuvaa **tilaa**, ei **hetkeä**. Jokainen todellinen toteutus lukee pisteen hetkellä T1 ja suorittaa toimen hetkellä T2. Jos luottamus romahtaa siinä välissä — todennus perutaan, ketju terminoidaan, käyttäytyminen poikkeaa — toimi suoritetaan valtuutuksella, jota ei enää ole. Ja telemetria näyttää yhä siltä, että portti toimi.

Tämä ei ole eksoottinen vikatila. Se on itsestään selvän toteutuksen oletustulos.

Ratkaisu on tehdä valtuutuksesta **kulutettava** eikä luettava. Luottamusmoottori ei palauta numeroa vaan **kertakäyttöisen, aikaan sidotun, kryptografisesti allekirjoitetun valtuutustokenin**. Toimen ensimmäinen operaatio on atominen kuluta-ja-suorita myöntävää auktoriteettia vastaan: token todennetaan, merkitään kulutetuksi ja toimi valtuutetaan **yhdessä jakamattomassa operaatiossa**. Jos token ei kelpaa kulutushetkellä, toimi ei suoritu — eikä sitä yritetä automaattisesti uudelleen.

Ja tärkein rivi: **suorittava komponentti ei koskaan arvioi tokenin voimassaoloa paikallisesti.**

### Miksi tämä on nimenomaan tuplaveloituksen vastalääke

Maksujen puolella tästä seuraa ominaisuus, jota ei tarvitse rakentaa erikseen.

Tuplaveloitus syntyy tavallisesti uudelleenyrityksestä. Agentti lähettää maksun, verkko katkeaa ennen vastausta, agentti ei tiedä menikö se läpi, agentti yrittää uudelleen. Tavallinen suojaus on idempotenssiavain: kauppias tunnistaa saman pyynnön ja hylkää kaksoiskappaleen.

Kertakäyttöinen valtuutustoken siirtää saman suojauksen **askelta ylemmäs ja aikaisemmaksi**. Toinen yritys ei epäonnistu kauppiaan päässä — se epäonnistuu **ennen kuin se lähtee**, koska token on jo kulutettu. Ero on käytännössä kolminkertainen:

1. **Suojaus ei riipu vastapuolesta.** Idempotenssi on kauppiaan ominaisuus, ja se on eri jokaisella kauppiaalla. Tokenin kulutus on oman auktoriteetin ominaisuus, ja se on sama kaikkialle.
2. **Suojaus kattaa kaikki kolme rataa.** Sama mekanismi toimii AP2:lla, UCP:llä ja ACP:llä, koska se ei ole maksuprotokollan piirre.
3. **Uudelleenyritys ei ole kielletty, se on mahdoton.** Sääntö "epäonnistunutta ei yritetä automaattisesti uudelleen" on koodattu tilaan eikä käytäntöön. Käytäntö, joka kieltää uudelleenyrityksen, unohtuu jonkun kirjaston oletusasetuksissa.

Tähän kytkeytyy vielä yksi sääntö, joka on maksujen kohdalla erityisen tärkeä: **fail-closed.** Jos luottamusmoottori ei vastaa aikarajassa tai palauttaa virheen, toimi ei etene autonomisesti — koskaan. Se ohjautuu ihmiselle tai pysähtyy. Ei oletusarvoon, ei välimuistiin, ei arvattuun pisteeseen.

Maksujen kohdalla fail-open on erityisen houkutteleva, koska sen vaihtoehto on menetetty kauppa. Se on silti sama valinta kuin jättää kassa auki, koska kassakoneen näyttö on rikki.

## 5. Kun se menee pieleen: vastuunattribuutio kun virhe maksaa rahaa

Sarjan seitsemäs osa käsitteli virheluokittelua yleisesti. Kaupallisessa kontekstissa sama taksonomia saa terävämmän merkityksen, koska attribuutioluokka määrää **kuka maksaa**.

Viisi luokkaa, ja mitä kukin tarkoittaa väärän tilauksen kohdalla:

| Luokka | Mitä tapahtui | Kuka tyypillisesti vastaa |
| ------ | ------------- | ------------------------- |
| **Mallivika** | Malli tuotti väärän ulostulon — luki hinnan väärin, valitsi väärän tuotteen | Toimittaja / mallin tarjoaja |
| **Logiikkavika** | Agenttikoodi käsitteli oikean ulostulon väärin — pyöristi väärään suuntaan, käänsi valuutan kahdesti | Toimittaja |
| **Integraatiovika** | Ylävirran työkalu palautti väärää dataa — vanhentunut hinnasto, väärä varastosaldo | Integraatiokumppani / datalähde |
| **Operaattorivika** | Todennettu ihminen ohjasi toimen — hyväksyi vahvistusruudussa | Asiakas |
| **Käytäntövika** | Suojaus oli väärin konfiguroitu — katto asetettu liian korkeaksi, kauppiaskategoria auki | Kumpi tahansa; riippuu kuka konfiguroi |

Kaksi asiaa tekee tästä toimivan riidassa eikä vain kaaviossa.

**Ensimmäinen: attribuutio on määräaikainen ja se kello käy havainnosta.** Vanha muotoilu ankkuroi 72 tunnin määräajan "häiriön sulkemiseen" — ja häiriön sulkeminen on toimittajan itsensä ilmoittama tapahtuma. Häiriö, joka pidetään auki loputtomasti, ei ollut velkaa attribuutiota loputtomasti. Korjaus säilyttää sulkemiseen ankkuroidun lopullisen artefaktin mutta lisää **julkaistun enimmäisvälin havainnosta sulkemiseen, vakavuusluokittain**. Jos väli ylittyy, on annettava **väliaikainen attribuutio**, joka nimeää ehdolla olevat vikaluokat ja avoimet kysymykset — ja päivitettävä se sulkemisessa.

Kaupallisesti tämä on juuri se, mitä vastapuoli tarvitsee: ei lopullista totuutta heti, vaan tieto siitä, mihin suuntaan tutkinta kulkee, määräajassa, jonka voi kirjoittaa sopimukseen.

**Toinen: todisteet ovat yksi ketju eivätkä kaksi.** Jokainen mandaattitapahtuma — myöntö, esitys, suoritus, peruutus — kirjataan sekä forensiseen jälkeen että sääntelyn edellyttämään kirjanpitokerrokseen, avaimena sessio ja mandaatin tunniste. Tulos on yksi todisteketju, joka kelpaa **sekä maksuverkolle että EU AI Actin käyttöönottajan velvoitteelle.**

Se on kohta, jota yksikään kolmesta protokollasta ei käsittele — ne ovat kaikki yhdysvaltalaisvetoisia ja ratkaisevat maksuriskin, eivät sääntelyvelvoitetta. Eurooppalaiselle ostajalle ne ovat sama tapahtuma kahdesta syystä, ja kahteen kertaan lokitettu tapahtuma on kaksi eri tarinaa siitä hetkestä, jolloin niitä vertaillaan.

### Ja yksi tuotepositio, joka kannattaa sanoa suoraan

Korkein luottamuspiste ei ole lupa jättää ihminen pois. Puolustus- ja kaksikäyttötierillä oletus on **HNP kokonaan pois päältä ja ihmisen allekirjoittama maksumandaatti riippumatta luottamuspisteestä.** Korkea piste, ei silti valvomatonta kulutusta.

Se on tarkoituksellinen kanta. Luottamuspiste kertoo, kuinka hyvin agentti on käyttäytynyt. Se ei kerro, mitä maksaa jos se käyttäytyy huonosti kerran.

## 6. Yhteenveto

- **Protokollat kuljettavat mandaatin; ne eivät myönnä sitä.** Luottamuspiste on se päätös, ja se istuu maksuprotokollan yläpuolella — ratakohtaisesti neutraalina, koska konsolidaatio kentällä on todennäköinen.
- **Neljä kaistaa, kaksi liikkumatonta lattiaa.** Alle 0,50 ei mandaatteja millään profiililla; HNP:n vähimmäisraja 0,90 nousee mutta ei laske. Kaikki muu on asiakkaan kiristettävissä.
- **Kaista 0,50–0,79 on todennäköisesti se, jossa tuotantoagentit elävät:** agentti tekee kaiken paitsi maksun, ihminen allekirjoittaa.
- **Kertakäyttöinen valtuutustoken sulkee sekä aikaikkunan että tuplaveloituksen** — samalla mekanismilla, kaikilla kolmella radalla, ilman riippuvuutta vastapuolen idempotenssista.
- **Fail-closed pätee erityisesti maksuihin**, koska juuri siellä fail-openin houkutus on suurin.
- **Attribuutiokello käy havainnosta**, ei toimittajan ilmoittamasta sulkemisesta — ja todisteketju on yksi, ei kaksi.

**Seuraavassa osassa (11/11):** EUDI Wallet ja eIDAS 2.0 — kuka se ihminen oikeastaan on, jonka puolesta agentti toimii, ja yksi aito yhteensopivuusongelma, jonka wallet-ankkurointi paljastaa.

---

**Risto Anton Päärni**
_Perustaja & toimitusjohtaja, Lifetime Oy_
_Päätoimittaja, Lifetime Scope Journal_
