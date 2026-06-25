# Valtionhallinnon tekoälyrahoitus 2025–2028 — rahoitusohjelma-analyysi

## Väitöskirjan (Firehorse / LUT) tausta-aineisto · perustuu VTV-tarkastukseen 10/2026

***

**VERSION AND AGENT HISTORY**

| Versio | Päivämäärä | Tekijä | Muutos |
|--------|-----------|--------|--------|
| 1.0 | 2026-06-10 | Claude (claude/ai-report-phd-summary) | Rahoitusohjelma-analyysi VTV 10/2026 -kertomuksen pohjalta; skaalautuvuusparadoksi ja PhD-kytkennät |

***

> **Lähde.** Kaikki luvut: Valtiontalouden tarkastusvirasto, *Tekoälyn hyödyntäminen valtionhallinnossa*, tarkastuskertomukset 10/2026, dnro D/503/04.07.02/2025. Sivuviittaukset [s. N].

---

## 1. Rahoituksen lähtötilanne: pistemäistä ja kertaluonteista

Hallitusohjelman ja digikompassin tekoälytavoitteille **ei alun perin osoitettu erillistä investointirahoitusta** [s. 16]. Kyselyn tulokset kuvaavat niukkuutta [s. 15–16]:

- **vain ~10 %** organisaatioista piti rahoitustaan tavoitteisiin nähden riittävänä;
- **~40 %** oli saanut jotain kansallista tai EU:n erillisrahoitusta;
- **~2/3** oli osoittanut toimintamäärärahoistaan varoja tekoälyyn.

Kehittämistä on rahoitettu **siirtyvillä erillä**, jotka ovat aina kertaluonteisia [s. 16]. Liikkeelle on päästy pienin panostuksin (kymmeniä–satoja tuhansia euroja), mutta haastatellut olivat yksimielisiä siitä, että **laajamittainen käyttöönotto vaatisi eri mittaluokan investointeja** [s. 16]. Pienillä organisaatioilla on vähemmän joustovaraa → **erityinen riski jäädä jälkeen** [s. 16].

---

## 2. Vuoden 2025 käänne: kaksi rahoituskanavaa

Hallituksen puoliväliriihen (4/2025) jälkeen rahoitusta lisättiin [s. 16, 28–29]:

### 2.1 Valtion budjetti — VM:n investointiohjelma (10 M€)

- **10 miljoonaa euroa** valtion budjetista; rahoitushaku avattu **maaliskuussa 2026** [s. 16, 28].
- Kohde: **tekoälyagentteihin perustuvat ratkaisut** ja automaatio; varattu **vuosille 2026–2027** [s. 28].
- Rahoitusta voi saada sekä kokeiluihin että tuotantoon. **Tuotantoon vietäviltä ratkaisuilta edellytetään** [s. 28]:
  - mitattavaa tuottavuutta,
  - pysyviä kustannussäästöjä,
  - toimintatapojen pysyvää uudistumista,
  - **skaalautuvuutta tai monistettavuutta** useisiin virastoihin.

### 2.2 Sitra — julkisen sektorin tuottavuus (50 M€)

- Sitra panostaa **50 miljoonaa euroa** julkisen sektorin tuottavuuteen **vuoden 2028 loppuun mennessä** [s. 29].
- Vuodelle **2026 varattu 10 M€**; Sitra rahoittaa **enintään puolet** hankkeen kokonaiskuluista → vähintään saman verran on tultava muualta [s. 29].
- Tarjoaa rahoituksen lisäksi **johdon valmennusta, ennakointitietoa ja asiantuntijatukea**; ytimessä **toimintamallit**, joilla uudistukset johtavat todennettaviin tuottavuushyötyihin [s. 29].
- Erillinen **digisote-hanke** tukee hyvinvointialueita [s. 29].

### 2.3 Hyvinvointialueet (STM / DigiFinland)

STM osallistui vuonna 2025 DigiFinland Oy:n koordinoimiin kokeiluihin **2,3 miljoonalla eurolla** [s. 17]. Investoinnit ovat silti olleet **hyvin pieniä** suhteessa hyvinvointialueiden kokonaisrahoitukseen [s. 17].

---

## 3. Skaalautuvuusparadoksi — analyysin ydin

Sekä VM:n että Sitran rahoituskriteereissä edellytetään ratkaisujen **monistettavuutta ja skaalautuvuutta** [s. 28, 30–31]. **Ongelma:** valtionhallinnolla tai hyvinvointialueilla **ei ole valmiita toimintamalleja eikä rakenteita** yhteiskäyttöisten ratkaisujen kehittämiseen, tuotteistamiseen, hankintaan tai jakamiseen [s. 30–31].

VTV pitää **erikoisena**, että rahoitusta hakevien on osoitettava ratkaisujen monistettavuus, vaikka valtiolla ei ole siihen rakenteita [s. 31]. Tarkoituksenmukaisempaa olisi, että **rahoitushakuja koordinoivat tahot (erityisesti VM) kuvaisivat ensin keskitetysti**, millaisia edellytyksiä yhteisten ratkaisujen tuotteistamiseen on, kuka niistä vastaa ja miten organisaatiot voivat niitä hyödyntää [s. 31].

**Konkreettiset oireet:**
- **VirastoBot** (Traficomin vetämä yhteinen asiakaspalveluratkaisu): selkeä hyötypotentiaali, mutta jakelukanava (Valtori vai DVV?) epäselvä [s. 30].
- **Valtorin ja DVV:n rooli** tekoälyssä on ohjaavalle VM:llekin epäselvä; Valtorilta puuttuu mandaatti ja kehityskyvykkyys toimia tekoälykehityksen vetäjänä [s. 31, 39].
- **DigiFinland** voisi tuottaa hyvinvointialueille yhteisiä ratkaisuja, mutta sillä ei toistaiseksi ole roolia yhteisten tekoälyratkaisujen tarjoajana [s. 30].

> **Väitöskirjakytkentä:** Tämä on klassinen *shared-service / platform* -ongelma. Rahoitusehdot vaativat alustaominaisuutta (monistettavuus) ilman alustaa. Firehorsen agenttipohjainen, monistettava arkkitehtuuri vastaa täsmälleen tähän rakenteelliseen aukkoon.

---

## 4. Hyötyjen arviointi — epäyhtenäistä ja vinoutunutta

- **Ei yhteisiä arviointiperusteita:** jokainen organisaatio kuvaa hyödyt omalla tavallaan [s. 29]. Lähes **kolme neljäsosaa** vastaajista katsoi, ettei yhteisiä toimintamalleja hyötyjen arviointiin ole [s. 25].
- **Yliarviointiriski:** rahoitushakemuksissa hyötyjä mieluummin yli- kuin aliarvioidaan, ja hyödyt voivat olla **laskennallisia** eivätkä suoraan realisoitavissa säästöinä [s. 29].
- **Hyödyt voivat koitua eri organisaatiolle kuin kehittäjälle** → kehityskohteiden vertailu vaikeaa [s. 30].
- **Mittarit alkutekijöissään:** ~30 %:lla joitain hyötymittareita, vain ~15 % oli käyttänyt mittaritietoa kehittämisessä [s. 27].
- **Hyötylogiikat eroavat:** selkeästi laskettava (esim. tulkkaus, jossa vaihtoehtoiskustannus tiedossa) vs. epävarma "puoli tuntia/päivä säästöä", joka ei realisoidu ilman työn uudelleenorganisointia [s. 29].
- **Sitran havainto:** hyvinvointialueilta tuli keskimäärin **parempia hakemuksia** kuin ministeriöiltä ja virastoilta [s. 30].

---

## 5. Hankinnat ja kustannusten ennakoitavuus

- **Hansel:** valtionhallinto on tehnyt tekoälyhankintoja Hanselin kautta vuodesta 2018; "Ohjelmistorobotiikka ja tekoäly (DPS)" -yhteishankintaa (2019–2025) ei ehditty hyödyntää laajasti; **uusi yhteishankinta käynnistyy keväällä 2026** [s. 39]. Hanselilla ei ole kokonaisnäkymää hankittujen tekoälypalvelujen määrästä [s. 39].
- **Token-pohjainen laskutus:** generatiivisen tekoälyn kustannukset ovat **vaikeasti ennakoitavia** — jopa toimittajan voi olla vaikea arvioida laskentapyyntöjen määrää. Teknisiin valmiuksiin tulisi kuulua **kyky seurata ja hallita** tekoälyn käytön kustannuksia [s. 39].

---

## 6. Ohjausrakenne: Tekoälymuutos 2036

VM:n käynnistämään **Tekoälymuutos 2036** -kokonaisuuteen kuuluu **investointien ohjaus ja tuottavuus -teemaryhmä**, jossa on tarkoitus käsitellä hyötyarvioita; yhtenäisempiä käytäntöjä voi syntyä, mutta tarkastushetkellä tuloksia ei vielä ollut [s. 30]. VM:n koolle kutsuma generatiivisen tekoälyn verkosto (yli **350 henkilöä**) on valjastettu muutosohjelman käyttöön — VTV huomauttaa, ettei toimintamallin puutteita ole arvioitu ja että verkoston **mandaatti ja resursointi** ovat epäselviä [s. 47–48].

---

## 7. Kytkentä väitöskirjan tutkimuskysymyksiin

| VTV-havainto | PhD-tutkimuskytkentä |
|--------------|----------------------|
| Skaalautuvuusvaatimus ilman rakenteita [s. 31] | Platform/shared-service-malli; Firehorsen monistettava arkkitehtuuri |
| Kertaluonteinen rahoitus, pienten jälkeenjäänti [s. 16] | Rahoitusmallin vaikutus adoption eriytymiseen |
| Hyötyjen yliarviointi & laskennallisuus [s. 29] | Tuottavuuden todentaminen, mittariston suunnittelu |
| Token-kustannusten ennakoimattomuus [s. 39] | Agenttien kustannusmallinnus, budjettirajat (vrt. AI_AGENT_GUIDELINES) |
| Hyödyt koituvat muille kuin kehittäjälle [s. 30] | Julkishyödykelogiikka, kannustinrakenne |
| Sitra: hyvinvointialueilta paremmat hakemukset [s. 30] | Tilannekuva → hakemuslaatu -yhteys |

---

## 8. Johtopäätös

Rahoitusta on vuonna 2026 selvästi aiempaa enemmän (**yhteensä ~60 M€** kahdesta kanavasta), mutta sen vaikuttavuutta uhkaa **rakenteellinen aukko**: rahoitusehdot vaativat skaalautuvuutta, jota valtio ei vielä rakenteellisesti mahdollista, eikä hyötyjen arviointiin ole yhteisiä perusteita. VTV:n suositus 2 — **VM:n tulee määritellä toimintamallit ja rakenteet yhteisten ratkaisujen kehittämiseen ja käyttöönottoon** [s. 9] — on rahoituksen vaikuttavuuden edellytys. Väitöskirjalle tämä on empiirinen tuki väitteelle, että **rahoitus ilman jakorakennetta toistaa pistemäisyyttä**; tuottavuusloikka edellyttää alustamaista, monistettavaa toimintamallia.

---

*Tausta-aineisto väitöskirjatyöhön (Firehorse / LUT). Lähde: VTV 10/2026, dnro D/503/04.07.02/2025.*
