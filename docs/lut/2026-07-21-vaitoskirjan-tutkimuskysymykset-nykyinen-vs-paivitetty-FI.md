# Väitöskirjan tutkimuskysymykset — nykyinen vs. päivitetty, selkokielisin perusteluin

> Suomenkielinen versio työpaperista `2026-07-21-phd-research-questions-current-vs-updated.md`.
> Jokaisesta tutkimuskysymyksestä esitetään (a) nykyinen muotoilu, (b) ehdotettu uusi muotoilu ja
> (c) selkeä, ei-akateeminen perustelu sille, **miksi** haluamme muuttaa sitä. Tarkoitettu
> työpaperiksi ohjaajakeskusteluun (Smolander / LUT; KTH:n / Törngrenin tekniset kysymykset
> merkitty). EIC-relevanssi on seuraus, ei kysymysten peruste.

***

## VERSION AND AGENT HISTORY

| Kenttä  | Arvo                                                                              |
| ------- | -------------------------------------------------------------------------------- |
| Versio  | 1.0                                                                              |
| Työkalu | Claude Code                                                                      |
| Sessio  | claude/phd-research-sovereign-edge-ok1wk3                                         |
| Päiväys | 21.07.2026                                                                       |
| Tila    | LUONNOS — ohjaajan työpaperi (ei liitetty neljään opinnäytetiedostoon)           |
| Kieli   | Suomi                                                                            |
| Tyyppi  | Tutkimuskysymysten muutosloki / ennen–jälkeen–miksi                              |

Sessions & Modifications:

- Version: 1.0 | Tool: Claude Code | Session: claude/phd-research-sovereign-edge-ok1wk3 | Date: 21.07.2026 | Changes: Suomenkielinen käännös englanninkielisestä "current vs updated" -työpaperista. Nykyiset muotoilut kuusikysymyksisestä LUT-tutkimussuunnitelmasta (`docs/lut/2026-07-14-lut-doctoral-research-plan.md` §3) ja Smolander-sähköpostista; kukin kytketty 21.07 arvioinnin §7 uudistettuun runkoon + neljään tutkimuskysymykseen. Selkokielinen perustelu ei-erikoislukijalle. Itsenäinen; opinnäytetiedostoja ei kosketa (RED-vyöhyke).

***

## Näin luet tätä paperia

- **Smolanderille tosiasiassa lähetetty** oli lyhyt versio: kolme kysymystä sähköpostiluonnoksessa (muodollinen verifiointi; hallintorakenteet vaatimustenmukaisuustuloksille; läpinäkyvyys) sekä neljäs (turvallisuus–suorituskyky-kompromissi) liitettäväksi mukaan. Nämä ovat **osajoukko** laajemmasta kuuden kysymyksen kokonaisuudesta, joka työstettiin LUT-tutkimussuunnitelmaan.
- **Tämä paperi kattaa täydet nykyiset kuusi** (Q1–Q6) sekä "suvereniteetti-sateenvarjon", koska juuri niitä uudistettu kokonaisuus muuttaa. Sähköpostitse lähetetyt kysymykset ovat alla Q1, Q2, Q3 ja Q4.
- **Merkinnät:** 🟢 säilytä · 🟡 muuta/rajaa · 🔴 poista ytimestä. **[KTH]** = tekninen kysymys, ankkuri KTH/TECoSA (Törngren); **[LUT]** = ankkuri LUT (Smolanderin laitos).

***

## 0. Yhdistävä juonne ("sateenvarjo") &nbsp;🟡 [LUT]

**Nykyinen (sellaisena kuin on):**
> "Kysymys 1 (suvereniteetti) on yhdistävä tutkimusjuonne… Suvereniteetti on sitova reunaehto, joka antaa ontologiakerrokselle, KYA-standardille, standardointipolulle, julkisen sektorin käyttöönotolle ja inhimillisen kyvykkyyden kerrokselle niiden yhteisen sääntely- ja teknisen pinnan."

**Päivitetty (ehdotus):**
> **Autonomisten agenttien käyttäytymisen kumottavuus (behavioural falsifiability)** — sen määrittäminen, milloin ja miten autonomista moniagenttista reunajärjestelmää koskeva luotettavuusväite tulee *kumottavaksi* laitteistolla todennetun ajonaikaisen evidenssin kautta, päättely–käyttäytyminen-kuilun vallitessa ja EU-sääntelyn reunaehdoissa. Suvereniteetista (EU-sijaintinen, on-premises) tulee **rajausehto**, ei juonne.

**Miksi haluamme muuttaa sen (selkokielellä):** "Suvereniteetti" on positiointi- ja politiikkasana — se kertoo, miten myymme ja missä toimimme, mutta sitä ei voi tutkijana todistaa oikeaksi tai vääräksi. Väitöskirja tarvitsee rungon, joka on *tieteellinen väite, jossa voi olla väärässä*. Aidosti uusi idea on jo omassa aineistossasi (kirjattu "monografialuvuksi"): tekoälyagenteissa voi luottaa vain siihen, mitä ne todella **tekevät** — niiden käyttäytymiseen, joka tallentuu väärentämättömiin laitteistolokeihin — ei siihen, mitä ne **sanovat** tekevänsä. Tuo väite on testattavissa, se on uusi, ja se on juonne, johon jokainen muu kysymys kiinnittyy. Siksi nostamme sen otsikoksi ja pidämme "suvereniteetin" työn rajana (EU, on-prem), ei tutkimuskysymyksenä.

***

## 1. Luotettavuuden muodollinen verifiointi &nbsp;🟡 [KTH] &nbsp;*(sähköpostin Q1)*

**Nykyinen (sellaisena kuin on):**
> "Miten suvereeni reuna-AI:n orkestrointi voidaan **muodollisesti verifioida luotettavaksi** säännellyissä teollisissa ympäristöissä?"

**Päivitetty (ehdotus) → TK1:**
> "Mitkä autonomisen moniagenttisen reunajärjestelmän **käyttäytymiseen liittyvät turvallisuus- ja luottamusominaisuudet** voidaan muodollisesti **määritellä ja monitoroida ajonaikaisesti** siten, että rikkomukset ovat **havaittavissa ja todennettavissa**, kun agenttien ilmaisema päättely ei luotettavasti ennusta niiden käyttäytymistä?"

**Miksi haluamme muuttaa sen (selkokielellä):** Nykyisessä muotoilussa on kaksi ongelmaa. Ensinnäkin "luotettavuus" on liian laaja muodollisesti verifioitavaksi — se ei ole yksi täsmällinen ominaisuus, ja tarkastaja tarttuu muotoiluun heti. Toiseksi klassinen muodollinen verifiointi tarkastaa järjestelmän sen suunnitelmaa vasten; mutta tekoälyagentit eivät käyttäydy luotettavasti suunnitelmansa tai ilmaistun päättelynsä mukaan, joten menetelmä ei sovi tutkittavaan kohteeseen. Korjaus säilyttää kunnianhimon mutta tekee siitä todellisen: valitaan **täsmällisiä, tarkastettavia käyttäytymisiä**, seurataan niitä **järjestelmän ollessa käynnissä** ja tuetaan jokainen havaittu rikkomus **väärentämättömällä lokituksella** evidenssinä. Sama tavoite, mutta nyt aidosti todistettavissa ja vastaa sitä, miten nämä järjestelmät oikeasti pettävät. Tämä on Törngrenin/TECoSAn ydinaluetta.

***

## 2. Hallintorakenteet oikeudellisesti puolustettaville vaatimustenmukaisuustuloksille &nbsp;🔴→🟡 [LUT] &nbsp;*(sähköpostin Q2)*

**Nykyinen (sellaisena kuin on):**
> "Mitä hallintorakenteita moniagenttiset tekoälyjärjestelmät edellyttävät tuottaakseen **oikeudellisesti puolustettavia** ympäristövaatimustenmukaisuustuloksia EU-sääntelyn alaisuudessa?"

**Päivitetty (ehdotus):**
> Ei enää itsenäinen kysymys. Hyödyllinen ydin — *mitä evidenssiketjun on sisällettävä kestääkseen haastamisen* — siirtyy **suunnitteluvaatimuksiksi TK3:n sisään** (KYA-vaatimustenmukaisuuskysymys).

**Miksi haluamme muuttaa sen (selkokielellä):** "Oikeudellisesti puolustettava" on ansasana. Sen, onko jokin oikeudellisesti puolustettava, ratkaisee todellinen tuomioistuin tai viranomainen — ei väitöskirja — ja väitöskirjan aikataulussa **mitään evidenssiketjua ei ehditä testata todellisessa auditoinnissa tai oikeuskäsittelyssä** (oma suunnitelmasi myöntää tämän rajausosiossaan). Itsenäisenä kysymyksenä siihen ei voi vastata, ja sen yrittäminen edellyttäisi oikeustieteen asiantuntijaa, jota paneelissa ei ole. Siksi pidämme tutkittavan osan — mitä evidenssiketjun on sisällettävä kestääkseen haastamisen — ja käsittelemme sitä KYA-instrumentin suunnitteluvaatimuksina. Lisäksi: tämän kysymyksen akateeminen ankkuri (Galaz / Stockholm Resilience Centre) on aineistosi vähiten varmennettu viittaus, joten sen ei pidä kannatella kokonaista pilaria.

***

## 3. Läpinäkyvyys julkista ymmärrettävyyttä varten &nbsp;🔴 [—] &nbsp;*(sähköpostin Q3)*

**Nykyinen (sellaisena kuin on):**
> "Miten suvereenin tekoälyjärjestelmän läpinäkyvyys voidaan operationalisoida **julkista ymmärrettävyyttä** varten EU:n tekoälyasetuksen 50 artiklan mukaisesti?"

**Päivitetty (ehdotus):**
> Poistetaan väitöskirjan ytimestä. Säilytetään **valinnaisena tiedeviestintä- / yleisösuhdeartikkelina** tai EIC:n disseminaatiotuotoksena.

**Miksi haluamme muuttaa sen (selkokielellä):** Tämä koskee oikeastaan tekoälyn selittämistä ei-asiantuntijayleisölle — viestinnän ja käyttöliittymäsuunnittelun tehtävä, ei väitöskirjatasoinen tieteellinen kontribuutio. Oma suunnitelmasi kutsuu sitä jo "pehmeimmäksi… viestintäpainotteisimmaksi" vaihtoehdoksi ja sivukanavaehdokkaaksi. Se ei edistä tieteellistä ydinideaa ja nojaa ulkoisiin kumppaneihin (Universeum / Chalmers), joita et hallitse. Se on aidosti hyödyllinen yleisötyölle ja EIC:n disseminaatiovaatimuksille — joten pidetään se siellä, ei yhtenä niistä neljästä pilarista, joiden varassa väitöskirja seisoo.

***

## 4. Turvallisuus–suorituskyky-kompromissi (turvallisuuden hinta) &nbsp;🟢 [KTH] &nbsp;*(sähköpostin Q4)*

**Nykyinen (sellaisena kuin on):**
> "Miten **turvallisuus–suorituskyky-kompromissit** suvereeneissa reuna-AI-järjestelmissä voidaan muodollisesti mallintaa ja validoida reaaliaikaisten toimintaehtojen vallitessa?"

**Päivitetty (ehdotus) → TK2:**
> "Miten **todennetun käyttäytymisevidenssin tuottamisen ajonaikaiset kustannukset (viive, laskenta, energia)** ja turvallisuuden valvonta ovat kompromississa **evidenssin kattavuuden** kanssa reaaliaikaisissa reunaehdoissa, ja voidaanko tämä kompromissi muodollisesti mallintaa ja rajata?"

**Miksi haluamme muuttaa sen (selkokielellä):** Tämä on vahvin kysymyksesi, ja se muuttuu vain vähän — ainoastaan terävöitämme sitä. Teemme eksplisiittiseksi, että kyse on **luotettavan evidenssin tuottamisen hinnasta**: paljonko nopeutta, laskentaa ja energiaa maksat vahvemmasta todisteesta. Se on suoraan mitattavissa omalla DGX/Aegis-laitteistollasi, kukaan ei ole kvantifioinut sitä agenttijärjestelmille, ja se on puhtain tekninen leikkauspiste Törngrenin SAFECOMP-työn kanssa. Koska data on talon sisäistä ja hallittavissa, se on pienin riski ja nopein julkaista — joten tämän tulee olla **Artikkeli 1**.

***

## 5. KYA avoimena vaatimustenmukaisuusstandardina &nbsp;🟡 [LUT]

**Nykyinen (sellaisena kuin on):**
> "Miten **Know-Your-Agent (KYA)** -luottamuspisteytysmalli voidaan suunnitella ja validoida **avoimeksi vaatimustenmukaisuusstandardiksi** agenttiselle tekoälylle EU-säännellyillä toimialoilla?"

**Päivitetty (ehdotus) → TK3:**
> "Mitkä **suunnitteluperiaatteet** ohjaavat vaatimustenmukaisuusinstrumenttia (KYA), joka tuottaa EU:n tekoälyasetuksen 12/14 artiklan mukaista evidenssiä agenttijärjestelmille **useilla säännellyillä toimialoilla**, ja **missä määrin nämä periaatteet yleistyvät referenssitoteutuksen ulkopuolelle**?"

**Miksi haluamme muuttaa sen (selkokielellä):** Yhden kysymyksen sisään on piiloutunut kaksi eri väitettä. Väite A — "tässä ovat vaatimustenmukaisuustyökalun suunnitteluperiaatteet ja tässä, miten se pärjää arvioituna usealla toimialalla" — on vankkaa väitöskirjatyötä. Väite B — "ja siitä tulee omaksuttu avoin standardi" — riippuu standardointielinten politiikasta, jota et hallitse, eikä sitä **voi osoittaa todeksi tai vääräksi väitöskirjan aikaikkunassa**. Pidämme väitteen A todellisena kontribuutiona ja siirrämme väitteen B selkeästi merkityksi "standardointipolun analyysiksi" (jatkotutkimus). Olennainen lisäys on viimeinen lause: kontribuution on oltava **periaatteita, jotka toimivat oman tuotteesi ulkopuolella**, tai se näyttää tarkastajalle tuotespesifikaatiolta eikä tutkimukselta. (Oma rajausosiosi merkitsee jo toimittaja- ja mallien välisen siirrettävyyden todistamattomaksi — tämä tekee siitä kysymyksen, ei piilo-oletusta.)

***

## 6. Vapaaehtoisesta pakolliseen -vaatimustenmukaisuussiirtymä &nbsp;🟢 [LUT]

**Nykyinen (sellaisena kuin on):**
> "Miten teollisuusyritykset voivat hallita siirtymää **vapaaehtoisesta ESG-raportoinnista pakolliseen suvereeniin tekoälyvaatimustenmukaisuusinfrastruktuuriin** häiritsemättä olemassa olevia johtamisjärjestelmiä?"

**Päivitetty (ehdotus) → TK4:**
> "Miten säännellyt teollisuusyritykset **integroivat velvoitetun tekoälyn hallinta- ja todennusinfrastruktuurin olemassa oleviin johtamisjärjestelmiinsä** vapaaehtoisesta pakolliseen -vaatimustenmukaisuussiirtymän aikana, ja **mitkä organisatoriset ehdot ennustavat vähähäiriöistä käyttöönottoa**?"

**Miksi haluamme muuttaa sen (selkokielellä):** Kysymys on hyvä ja se asettuu suoraan Smolanderin oman laitoksen alueelle, joten pidämme sen. Vain kaksi korjausta. (1) Nimeä **käytettävä teoreettinen linssi** (esim. institutionaaliset logiikat tai nimetty teknologian omaksumisen viitekehys) yleisen "muutosjohtamisen" sijaan — paneeli kysyy "minkä teorian kautta?", eikä "ilman viitekehystä" ole vastaus. (2) Se riippuu **todellisesta tutkimuspääsystä 2+ suomalaiseen yritykseen**, mukaan lukien data ja eettinen ennakkoarviointi; nyt nämä ovat "pilottikohteita", joten pääsy on lukittava *ennen* kuin tämä luvataan tutkimussuunnitelmassa. Uudelleenmuotoilu tekee myös tuotoksesta konkreettisen: *käyttöönottomalli*, joka ennustaa, mitkä ehdot tekevät siirtymästä sujuvan vai häiritsevän.

***

## Kokonaan kysymysjoukosta poistuvat kohdat

| Oli joukossa | Mitä sille tapahtuu | Miksi (selkokielellä) |
| --- | --- | --- |
| **Agenttikaupankäynti · EU-eWallet · transaktiot** (vanhat kohdat 5–7, "mahdolliset patentit" -linja) | Pysyy **poissa** väitöskirjan kysymyksistä; jää Lifetimen IP- / patentointilinjaksi | Kehys on kaupallinen, ja taustateknologia (eIDAS 2.0 -lompakot) ei ole teollisessa mittakaavassa väitöskirjan aikataulussa. Kiinnostava patenteille, ei vielä puolustettava väitöskirjatutkimuksena. |
| **Ontologiat / hiilipainotteinen kehys** (vanha kohta 2) | Liittyy mukaan **lippulaivatoimialana**, jolla TK3 testataan, ei omana kysymyksenä | Hiili on yksi validointitoimiala, ei runko. Kysymyksenä se kaventaa koko väitöskirjan hiileen; testitapauksena se pitää kontribuution yleisenä. |
| **Kolmen lainkäyttöalueen (EU/US/SG) + ~20 toimialan kattaus** | Muuttuu **rajausehdoksi** + **kahdeksi syväksi toimialaksi** | 20 toimialaa ja kolme lainkäyttöaluetta on kattavuutta, ei syvyyttä. Väitöskirja on yksi syvästi puolustettu kontribuutio — valitse kaksi toimialaa ja mene syvälle. |
| **Suvereniteetti sateenvarjona** | Muuttuu **työn rajaksi**, ei tutkimuskysymykseksi | Ks. §0 — se on positiointikehys, ei testattava väite. |

***

## Muutoksen yhden lauseen tiivistys

Siirrymme **"suvereniteetin" ympärille rakennetuista kuudesta-plus-kysymyksestä** (liiketoimintakehys) **yhteen testattavaan runkoon — käyttäytymisen kumottavuus laitteistolla todennetun evidenssin kautta — ja neljään toisiinsa kytkeytyvään kysymykseen**: kaksi teknistä (KTH: ajonaikainen monitorointi; turvallisuuden hinta), yksi suunnittelullinen (LUT: KYA-vaatimustenmukaisuusinstrumentti), yksi organisatorinen (LUT: miten yritykset ottavat sen käyttöön). Kolme kohtaa poistetaan tai alennetaan (läpinäkyvyys → yleisötyöartikkeli; oikeudellinen puolustettavuus → suunnitteluvaatimus; kaupankäynti/lompakko/transaktiot → patenttilinja). Tämä on ero **tutkimusohjelman**, joka on liian laaja saatettavaksi loppuun, ja **väitöskirjan** välillä, joka on yksi rajattu, uusi kontribuutio.
