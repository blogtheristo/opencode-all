---
slug: eudi-wallet-eidas2-idv-ankkurointi
title: "eWallet EU ja KYA-S1: kenen ihmisen puolesta agentti oikeastaan toimii?"
subtitle: "EUDI Wallet / eIDAS 2.0 ankkuroi IDV-1:n — ja paljastaa yhden aidon yhteensopivuusongelman"
lang: fi
site: onelifetime.world
author: Risto Anton Päärni
date: 2026-08-08
Status: DRAFT
source: HIC:n sarjasuunnitelma osat 8–11 (sessio claude/agent-use-cases-comparison-h7vl25)
series: "Blogi 11/11 · DWS IQ & Lifetime World Model — sarjan päätösosa"
unverified_claims: |
  TARKISTETTAVA ennen julkaisua (Sääntö 12 — merkitään, ei arvata):
  1. EUDI Wallet -asetuksen (EU) 2024/1183 jäsenvaltiovelvoitteen tarkka takaraja
     ja sen nykytila elokuussa 2026. Tekstissä sanottu "vuoden 2026 loppuun
     tähtäävä" — tämä on muistinvarainen, ei lähteestä varmennettu.
  2. Onko edustus-/valtuutusattestaatio (representation / mandate attestation)
     nykyisissä toteutussäädöksissä normatiivinen vai vielä työn alla. Tekstin
     §4 nojaa siihen; jos se ei ole vielä olemassa, §4:n muotoilu on
     löysennettävä ehdolliseksi.
  3. Peruutustiedon (revocation / status list) todellinen etenemisviive
     EUDI-toteutuksissa. §5:n koko argumentti IDV-4:n KYA-AL3-tason 60 s
     yhteensopivuudesta riippuu tästä luvusta, jota EI ole mitattu.
  Yksikään näistä ei muuta tekstin arkkitehtuuriväitettä, mutta jokainen niistä
  on julkinen väite EU-sääntelystä ja siksi varmennettava lähteestä.
open_decisions: |
  1. Sarjan pituus: osat 8–11 muuttavat kokonaismäärän 7:stä 11:een. Osien 5–7
     series-kentät sanovat yhä "/7". Ne on päivitettävä kun 8–10 on kirjoitettu
     — tai jos sarja päättyy tähän, numerointi on korjattava kokonaan.
  2. Toteutuspäätös §6:lle: mintataanko KYA-sessiokredentiaali wallet-esityksestä
     (ehdotus tässä) vai vaaditaanko wallet-esitys per työkalukutsu (ei
     toteutuskelpoinen autonomiselle ajolle). Tämä on arkkitehtuuripäätös,
     ei kirjoitusvalinta.
---

# eWallet EU ja KYA-S1: kenen ihmisen puolesta agentti oikeastaan toimii?

Sarjan seitsemän ensimmäistä osaa rakensivat koneiston: KYA-S1 v1.3, BPMN 2.0 -portti, atominen Lease Token, fail-closed, FLT ja PRV. Kaikki lepää yhden oletuksen varassa, jota emme ole vielä kertaakaan koetellut:

**että tiedämme, kuka se ihminen on.**

IDV-1 vaatii "verified human principal". Käytännössä se on tähän asti tarkoittanut yrityksen omaa SSO-kirjautumista. Se riittää, kun agentti koskee vain oman organisaation järjestelmiä. Se ei riitä siinä hetkessä, kun agentti tekee jotain **ulospäin** — tilaa raaka-ainetta, allekirjoittaa vahvistuksen, esittää vaatimustenmukaisuustodisteen viranomaiselle. Silloin vastapuolen on voitava todentaa ihminen ilman että se luottaa meidän omaan kirjautumisjärjestelmäämme.

Tähän EU:lla on jo vastaus, ja se on velvoittava: **EUDI Wallet** ja **eIDAS 2.0**.

## 1. Miksi sisäinen SSO ei kelpaa ulospäin

| Kysymys vastapuolelta                             | Sisäinen SSO                     | EUDI Wallet                                            |
| ------------------------------------------------- | -------------------------------- | ------------------------------------------------------ |
| Kuka tämä ihminen on?                             | "Meidän hakemistomme sanoo näin" | Jäsenvaltion notifioima tunnistusjärjestelmä, LoA High |
| Voinko todentaa sen ilman teitä?                  | Ei                               | Kyllä — kryptografisesti, ilman kyselyä meille         |
| Kelpaako se rajan yli?                            | Neuvoteltava tapauskohtaisesti   | Vastavuoroisesti tunnustettu EU:ssa                    |
| Onko sillä oikeusvaikutus?                        | Sopimusperusteinen               | Asetuksen tasoinen                                     |
| Saanko attribuutin (rooli, valtuus) todistettuna? | Meidän väitteemme                | **QEAA** — pätevä sähköinen attribuuttitodistus        |

Ero ei ole tekninen vaan **todistustaakan suunta**. Sisäisessä SSO:ssa vastapuoli luottaa meihin. Walletissa vastapuoli tarkistaa itse. Agenttitaloudessa, jossa toinen osapuoli voi olla toinen agentti, jälkimmäinen on ainoa skaalautuva muoto.

## 2. Mihin KYA-S1:n kontrolleihin wallet osuu

- **IDV-1** (reaaliaikainen henkilöllisyyden todentaminen) — wallet on tämän luonnollinen lähde, ja se tuo mukanaan LoA High -tason, jota oma biometrinen liveness-tarkistus ei sellaisenaan saavuta.
- **IDV-2** (kryptografinen sidos ihmisen, agenttisession ja jokaisen työkalukutsun välillä, joka kestää agentilta agentille -siirrot) — tähän wallet **ei** yksinään riitä. Ks. §3.
- **IDV-4** (peruutuksen eteneminen: KYA-AL1 15 min, KYA-AL2 5 min, KYA-AL3 60 s) — tähän wallet tuo aidon ongelman. Ks. §5.

## 3. Se, mikä ei toimi naiivisti: agentti ei voi näyttää lompakkoa kello kolme yöllä

EUDI Wallet on suunniteltu **ihmisen läsnäoloon**: käyttäjä avaa lompakon, valitsee esitettävät attribuutit, hyväksyy. Malli olettaa, että ihminen on paikalla transaktiohetkellä.

Autonominen agentti on määritelmällisesti se tapaus, jossa ihminen **ei** ole paikalla. Jos IDV-2 vaatisi wallet-esityksen jokaisesta työkalukutsusta, koko autonomia katoaa — jäljelle jää manuaalinen hyväksyntäputki, joka on juuri se, mistä yritettiin pois.

Naiivi vaihtoehto on yhtä huono: tehdään wallet-tunnistus kerran ja annetaan agentin toimia sen nojalla määrittelemättömän ajan. Se on tarkalleen se pysyvä valtuutus, jonka TRS-4 kielsi.

**Ehdotettu ratkaisu — kolmiportainen johdanto:**

```
1. WALLET-ESITYS (ihminen läsnä, kerran per sessio)
   EUDI Wallet ─► PID + QEAA (rooli, valtuus) ─► LoA High
                        │
                        ▼
2. KYA-SESSIOKREDENTIAALI (mintataan esityksestä, TTL tunteja)
   Sitoo: todennettu ihminen ↔ agenttisessio ↔ kyvykkyysmanifesti
   Peruutettavissa. Tämä on IDV-2:n kantaja.
                        │
                        ▼
3. LEASE TOKEN (TRS-4, kertakäyttöinen, TTL sekunteja)
   Johdettu sessiokredentiaalista, kulutetaan atomisesti per teko
```

Jokainen taso on lyhytikäisempi kuin edellinen, ja jokainen periytyy ylemmästä. Sessiokredentiaalin peruutus mitätöi kaikki siitä johdetut Lease Tokenit — sama mekanismi kuin TC4:n leash snap, eri laukaisin. Agentti ei koskaan kanna wallet-tason valtuutusta suoraan; se kantaa johdannaista, jolla on oma vanhenemisensa.

## 4. Valtuutus on erillinen kysymys henkilöllisyydestä

Wallet kertoo **kuka** ihminen on. Se ei vielä kerro, että hän saa sitoa Lifetime Oy:n 40 000 euron hankintaan.

Tämä on agenttitalouden ydinkysymys, eikä KYA-S1 v1.3 vastaa siihen: IDV sitoo henkilön, kyvykkyysmanifesti rajaa työkalut, mutta **edustusvaltuuden** todistaminen ulkopuoliselle vastapuolelle ei kuulu kummallekaan. eIDAS 2.0:n attribuuttitodistukset (QEAA) ovat oikea paikka sille — organisaation edustusoikeus on juuri sellainen attribuutti, jonka pätevä tarjoaja voi todistaa.

_(Tämä on kohta, jonka §0:n `unverified_claims` merkitsee tarkistettavaksi: en varmenna tässä, missä tilassa edustusattestaatio EU:n toteutussäädöksissä on. Jos se ei ole vielä normatiivinen, tämän luvun väite on esitettävä ehdollisena — ei poistettava, koska arkkitehtuurinen tarve on olemassa joka tapauksessa.)_

## 5. Aito yhteensopivuusristiriita: IDV-4:n 60 sekuntia

Tässä on kohta, jota ei kannata kaunistella.

**IDV-4 vaatii KYA-AL3-tasolla, että ihmisen todennustilan muutos etenee 60 sekunnissa.** Jos henkilön valtuutus perutaan, jokaisen häneen sidotun agentin on pysähdyttävä minuutissa.

Wallet-ekosysteemin peruutustieto ei liiku sillä nopeudella. Attribuuttitodistusten voimassaolo tarkistetaan tilalistoilta ja välimuistitetuilta rakenteilta, joiden päivitysvälit on suunniteltu ihmistahtiseen käyttöön, ei sekuntitason agenttivalvontaan.

Kolme rehellistä vaihtoehtoa, ei yhtä hyvää:

1. **Sessiokredentiaalin TTL lyhyeksi.** Jos taso 2 elää minuutteja eikä tunteja, peruutuksen viive rajautuu TTL:ään. Hinta: tiheä uudelleentunnistus, joka vaatii ihmisen läsnäoloa — eli sama ongelma kuin §3:ssa, vain pienempänä.
2. **Kaksoiskanava.** Wallet hoitaa henkilöllisyyden vahvistuksen (hidas, vahva); oma peruutuskanava hoitaa hätäperuutuksen (nopea, sisäinen). IDV-4 täytetään sisäisellä kanavalla, wallet ei ole kriittisellä polulla. Hinta: kaksi totuutta, jotka voivat erota — ja se ero on juuri sitä, mitä TC4 on olemassa varten.
3. **Myönnetään, ettei KYA-AL3 ole saavutettavissa wallet-ankkuroidulle IDV:lle.** Rehellisin, ja mahdollisesti oikea: standardi voi todeta, että walletiin ankkuroitu IDV yltää KYA-AL2:een, ja KYA-AL3 vaatii lisäksi vendorin oman peruutuskanavan.

**Suositus: vaihtoehto 2, dokumentoituna vaihtoehtona 3.** Kaksoiskanava toimii, mutta KYA-S1:n on sanottava ääneen, että KYA-AL3-tason 60 sekuntia tulee tällöin vendorin omasta kanavasta, ei walletista. Muuten myydään EU-tason takuuta, jota EU-taso ei anna.

## 6. Mitä tämä paljastaa omasta toteutuksestamme

Sarjan Osa B -katselmus löysi, että DWS:n ATS-moottori **ei sisällä IDV-tilaa lainkaan** yhtenä syötteenään. Ihmisen valtuutus voidaan peruuttaa ilman että agentin luottamuspiste liikkuu pistettäkään.

Wallet-integraatio tekee tästä aukosta mahdottoman sivuuttaa. Koko ketju — wallet → sessiokredentiaali → Lease Token → teko — on rakennettu sille, että IDV-tilan muutos katkaisee ketjun. Jos luottamuspiste ei tunne IDV-tilaa, ketju ei katkea; se vain näyttää katkeavan kaaviossa.

Tämä on järjestys, jossa työ on tehtävä:

1. IDV-tila ATS:n hard kill -syötteeksi (nykyisen manifest-TTL-tarkistuksen rinnalle — se primitiivi on jo koodissa)
2. Sessiokredentiaali TRS-4:n Lease Tokenin emoksi
3. Vasta sitten wallet ylimmäksi tasoksi

Käänteisessä järjestyksessä syntyisi vaikuttava demo ja sama aukko kuin ennen.

## Yhteenveto

- **Sisäinen SSO ei kanna ulospäin.** Kun agentti toimii kolmatta osapuolta kohtaan, todistustaakan on käännyttävä: vastapuolen on voitava tarkistaa itse.
- **Wallet ei sovi per-teko-tunnistukseen.** Ihmisen läsnäoloon suunniteltu mekanismi ankkuroi session, ei jokaista työkalukutsua. Johdannaisketju wallet → sessiokredentiaali → Lease Token säilyttää sekä autonomian että peruutettavuuden.
- **Henkilöllisyys ei ole valtuutus.** Edustusoikeus on oma attribuuttinsa, eikä KYA-S1 v1.3 vielä käsittele sitä.
- **KYA-AL3-taso ja wallet ovat ristiriidassa.** 60 sekunnin peruutus ei tule wallet-ekosysteemistä. Se on sanottava, ei kierrettävä.
- **Oma ATS ei tunne IDV-tilaa.** Se on korjattava ennen wallet-integraatiota, ei sen jälkeen.
