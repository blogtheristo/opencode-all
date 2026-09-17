# Tutkimussuunnitelman tiivistelmä — HIC:n kritiikki 11.08.2026

***

# VERSION AND AGENT HISTORY

Version: 1.0

Sessions & Modifications:

- Version: 1.0 | Tool: Claude Code | Session: claude/tutkimussuunnitelma-tiivistelmä-fczxea | Date: 11.08.2026 | Changes: Kenttämuistiinpano HIC:n kahden kritiikkikohdan käsittelystä tutkimussuunnitelman tiivistelmässä (masteri v2.1 → v2.6, Nokia-export v2.1 → v2.6).

Session Links & References:

- Masteri: `docs/lut/tutkimussuunnitelman-tiivistelma-lut-2026-fi.md`
- Export: `docs/lut/2026-08-10-nokia-saatio-tutkimussuunnitelma-tiivistelma-FI.md`

Document Status:

- Created: 11.08.2026
- Language: Finnish
- Publication Status: INTERNAL
- Classification: CONFIDENTIAL — Väitöskirja- ja rahoitusaineisto

***

## 1. Kritiikki sellaisena kuin se annettiin

1. **Väitös ei ole irrallinen paperitutkimus.** Se on kaupalliseen, tuotannolliseen DWS IQ -ympäristöön perustuva empiirinen työ. Myynnin ja käyttöönottojen pitää onnistua, jotta tutkimukselle syntyy aineisto ja väitös voi valmistua.
2. **Jurisdiktioita ei pidä kuvata vain EU–US-asetelmana.** Mukana ovat ASEAN/Aasia, Singapore, Etelä-Korea, EU ja Yhdysvallat.

## 2. Mitä tekstissä oli ennen

- **Kohta 1:** tiivistelmä sanoi ainoastaan, että "tieteellinen arviointi pidetään erillään yrityksen kaupallisesta tuotekehityksestä" (v2.1, `Tutkimusympäristö ja vastuut`). Aineiston **syntymekanismia** ei kuvattu lainkaan, joten lukija saattoi päätellä, että kaupallinen toiminta on tutkimuksen kannalta yhdentekevää. Todellisuudessa se on aineiston ainoa lähde.
- **Kohta 2:** RQ2 oli rajattu kolmeen EU-maahan (FI/SE/DE). Kehys ei siis ollut edes EU–US vaan EU-sisäinen. Laajempi EU/US/SG-arkkitehtuuri oli olemassa muualla repositoriossa (`docs/PHD_FIREHORSE_FI.md` §14.43, `docs/lut/dws-os-research-scope-fi.md` §4) mutta ei ollut kulkeutunut tiivistelmään.

## 3. Ratkaistu ristiriita (Sääntö 7 — ei tasoiteta)

Kohta 1 näyttää ensi lukemalta kumoavan v2.0:n erottelun tieteen ja kaupallisen tuotekehityksen välillä. Se ei kumoa. Kirjattu erottelu on nyt eksplisiittinen: **kaupallinen kanava tuottaa aineiston, ei sen tulkintaa.** Riippuvuus on aineistoriippuvuus, ei arviointiriippuvuus. Molemmat lauseet ovat voimassa yhtä aikaa, ja ne on kirjoitettu peräkkäin niin, että lukija näkee sen.

## 4. Rehellisyysvartija laajennettiin

v2.1:n vartija koski vain Saksaa. Uusien jurisdiktioiden lisääminen olisi ilman laajennusta tuottanut juuri sen ylimyynnin, jota vartija oli tehty estämään. Statukset nyt:

| Jurisdiktio            | Status                                                             |
| ---------------------- | ------------------------------------------------------------------ |
| Suomi                  | Empiirinen                                                         |
| Ruotsi                 | Ehdollinen empiirinen (KTH/TECoSA)                                 |
| Saksa                  | Skenaario                                                          |
| Yhdysvallat            | Dokumenttiprofiili                                                 |
| Singapore              | Dokumenttiprofiili (ISO/IEC JTC 1/SC 42 -reitti todennettu §14.43) |
| Etelä-Korea            | **Poistettu kehyksestä v2.4:ssä** — ks. §4c paluuehto               |
| ASEAN / laajempi Aasia | Skenaario                                                          |

**Etelä-Korea on ainoa merkintä ilman lähdepohjaa.** Repositoriossa Etelä-Korea esiintyy 11.08.2026 vain G7-plus-kumppanit-koalition jäsenenä tekoälymenojen yhteydessä (`docs/PHD_FIREHORSE_FI.md` §14.24) — ei sääntely-, hankinta- eikä standardointireittinä. Merkintä `unverified` on siksi tarkoituksellinen ja poistetaan vasta lähdekartoituksen jälkeen (Sääntö 12).

## 4b. Tutkimuskehys vs. GTM (HIC 11.08.2026, v2.3)

Kohdan 1 ja kohdan 2 yhdistelmä tuotti uuden riskin: kun tutkimusaineisto sidotaan kaupallisiin käyttöönottoihin ja jurisdiktiokehys laajennetaan seitsemään profiiliin, lukija voi päätellä, että myös markkinajoukko laajenee seitsemään. HIC korjasi tämän ennen kuin se ehti tekstiin asti.

Kirjattu erottelu:

- **Tutkimus** vastaa kysymykseen "säilyykö evidenssin merkitys erilaisissa toimivalta- ja auditointiympäristöissä?" — laajuus ASEAN/Aasia, Singapore, Etelä-Korea, EU, Yhdysvallat + syvät paikalliset vertailut FI/SE/DE. Sisäänpääsyn ehto on riittävä sääntely- ja hankinta-aineisto.
- **GTM** vastaa kysymykseen "missä saamme ensimmäiset maksavat käyttöönotot?" — vaihe 1 on 2–3 markkinaa. Sisäänpääsyn ehto on nimetty ostaja, kumppani, data-aineisto ja toimituskyky. Suomi kotimarkkinana; Ruotsi ja Saksa vain konkreettisen myyntipolun ehdolla; Singapore, Etelä-Korea ja ASEAN myöhempiä profiileja.

**Periaate:** jurisdiktiorakenteen symmetria ei ole peruste laajentaa maajoukkoa. Vain empiirisen statuksen jurisdiktiot edellyttävät toimituskykyä; dokumentti- ja skenaarioprofiilit tutkitaan aineistosta, ei markkinasta.

## 4c. Etelä-Korea poistettu kehyksestä — paluuehto (HIC 11.08.2026)

HIC hyväksyi v2.2–2.3:n korjaukset ja päätti samalla, että **Etelä-Korea poistetaan tutkimuskehyksestä nyt**, sekä masterista että Nokia-säätiön exportista. Perustelu: verifioimatonta jurisdiktiota ei näytetä arvioijalle aktiivisena tutkimusprofiilina. Singapore ja laajempi ASEAN/Aasia riittävät Aasia-akseliksi tässä versiossa.

**Etelä-Korea säilytetään tässä muistiossa mahdollisena myöhempänä laajennuksena.** Paluuehto kehykseen on kolmiosainen ja kaikkien osien on täytyttävä ennen kuin profiili kirjoitetaan takaisin:

1. **Sääntelyreitti** — mikä elin sääntelee agenttihallintaa ja millä instrumentilla; ensisijaislähde, ei sekundaarikatsaus.
2. **Hankintareitti** — miten julkinen tai teollinen ostaja vaatii evidenssiä; onko olemassa hankintakansiota vastaava rakenne.
3. **Standardointireitti** — osallistuuko kansallinen elin ISO/IEC JTC 1/SC 42:een tai vastaavaan, ja millä panoksella (vrt. Singaporen todennettu reitti, `docs/PHD_FIREHORSE_FI.md` §14.43).

Nykyinen lähdetilanne 11.08.2026: Etelä-Korea esiintyy repossa vain G7-plus-kumppanit-koalition jäsenenä tekoälymenojen yhteydessä (`docs/PHD_FIREHORSE_FI.md` §14.24). Se ei kelpaa minkään yllä olevan kolmen kohdan lähteeksi.

**Sama testi koskee jokaista tulevaa jurisdiktiolisäystä** — ei lisätä profiilia kehyksen symmetrian vuoksi.

## 4d. Gemini-konsolidointi (v2.5, 11.08.2026)

Gemini oli muokannut Drive-dokumenttia `2.0_KYA-S1_tutkimussuunnitelman_tiivistelma_FI` (id `1Ti7ExX…`) suoraan ja leimannut sen "Versio 2.1 · 11.08.2026".

**Adoptoitu:**

- **GTM-status-sarake** jurisdiktiotaulukkoon akateemisen roolin rinnalle — tutkimusrooli ja markkina-asema luetaan nyt samasta rivistä. Tämä on aidosti parempi kuin kaksi erillistä taulukkoa.
- **Kahden skoopin nimeäminen:** "Akateeminen tutkimusalue (Academic Research Scope)" ja "Markkinastrategia (GTM Strategy)".

**Hylätty (Sääntö 7 — ei tasoiteta):**

- Gemini kirjasi GTM-statukset **ehdottomina**: "Ruotsi = kasvumarkkina", "Saksa = strateginen markkina" ja "ensimmäiset maksavat käyttöönotot priorisoidaan Suomessa, Ruotsissa ja Saksassa". Tämä poistaa HIC:n 11.08.2026 asettaman ehdon — Ruotsi ja Saksa ovat mukana **vain jos niissä on konkreettinen myyntipolku**. Ehto palautettu.
- Tyhjä "Rajaukset:"-luettelokohta hakijatiedoissa.
- Fallback- ja kynnyslauseiden upottaminen RQ1:n ja RQ3:n **kysymystekstiin**. Riskikäsittely pysyy omassa osiossaan, jotta kysymys pysyy kysymyksenä.
- Taulukon karkeampi rivitys ("ASEAN / US" yhtenä rivinä): hukkaa Singaporen todennetun standardointireitin ja Yhdysvaltojen erillisen dokumenttiprofiilin.

**Driftihavainto (`DWS_TRUTH_STANDARD.md` §2E):** muokkaus tehtiin suoraan Drive-dokumenttiin eikä repoon, ja se leimattiin versioksi 2.1 — numero, joka repossa on jo käytössä eri sisällölle. Repo pysyy masterina; Drive-dokumentit ovat exportteja. Jos Gemini-kierroksia tulee lisää, ne konsolidoidaan samalla tavalla repoon eikä päinvastoin.

## 4e. Gemini-kierros 2 (v2.6, 11.08.2026)

HIC toimitti Geminin uudemman version (leima "Versio 2.2 · 11.08.2026"), joka sisälsi asioita, joita ensimmäisessä kierroksessa ei ollut.

**Adoptoitu:**

- **RQ3 rehellisempi muotoilu:** "enintään kolmessa määritellyssä edge-ympäristössä, evidenssistatukset huomioiden". Aiempi "kolmessa erilaisessa teollisessa edge-ympäristössä" väitti kolmea toteutunutta ympäristöä, vaikka Saksa on skenaarioprofiili ja Ruotsi ehdollinen — muotoilu oli ristiriidassa oman rehellisyysvartijansa kanssa. Tämä on kierroksen paras yksittäinen löydös. Aikataulurivi kk 13–18 synkattu.
- **Lause:** "GTM-tavoite ja strateginen markkina-asema eivät automaattisesti tarkoita toteutunutta tutkimusdataa — tutkimusdata on sidottu kunkin markkinan evidenssistatukseen." Ilmaisee HIC:n periaatteen tiiviimmin kuin repon aiempi muotoilu.
- GTM-nimikkeet "Kasvumarkkina" (Ruotsi) ja "Strateginen markkina" (Saksa) — **ehdollisuus säilytettynä**.
- Yhdysvaltojen rooliin skaalauslogiikan testi; GTM-sarakkeeseen rahoitus-/skaalauspolku (esim. PearX) eksplisiittisesti tutkimuksen pääjuonen ulkopuolella.
- Fallback- ja kynnyslauseiden **asiasisältö** ristiviittauksena RQ-lohkon jälkeen (ei kysymysten sisään).

**Hylätty (Sääntö 7):**

- Ehdottomat GTM-statukset ja "ensimmäiset maksavat käyttöönotot priorisoidaan Suomessa, Ruotsissa ja Saksassa" — poistaisi HIC:n myyntipoluehdon.
- Singaporen sulauttaminen ASEAN-riviin: hukkaa todennetun ISO/IEC JTC 1/SC 42 -reitin.
- Evidenssistatus "teoreettinen profiili" USA:lle ja ASEANille: repon jaottelu dokumenttiprofiili (aineisto olemassa, analysoidaan) vs. skenaarioprofiili (ei aineistoa) on tarkempi.
- Stale-rivi "Evidenssistatukset lukittu v2.0:ssa", joka listaa vain FI/SE/DE.

**Varmentamaton tieto:** `PearX` on HIC:n/Geminin toimittama; repossa ei ole sille lähdettä. Kirjattu mahdollisena rahoituspolkuna, ei toteutuneena.

## 5. HIC Learning Outcome — kuusi askelta

1. **Knowledge base** — `N/A — ei uutta KB-käsitettä; muutos on olemassa olevan dokumentin korjaus, ei uusi konsepti.`
2. **Kenttämuistiinpano** — tämä tiedosto.
3. **`Learn/`-HTML** — `N/A — vaatii Pandoc-buildin, jota ei ole tässä kontissa; tiivistelmä ei myöskään ole Learn/-julkaisu vaan apurahaliite.`
4. **Drive-vienti** — tehty 11.08.2026 kansioon **LUT PhD — Sovereign Edge AI** (ei Driven juureen):
   - masteri `2.2_KYA-S1_tutkimussuunnitelman_tiivistelma_FI` — https://docs.google.com/document/d/11xOfwnmwKFxEw4g45EBLb4r9N3p8oH24RiTW6m6P7Wc/edit
   - export `2.2_Nokia-säätiö tutkimussuunnitelman tiivistelmä (FI)` — https://docs.google.com/document/d/1OLAWOPOEqauKNhznKrJSgTkuXw-uoNzNd7B4B0QgxQs/edit
   - **Versioparius (HIC 11.08.2026):** Nokia-export kantaa aina masterin versionumeron. Aiemmin masteri oli Drivessä `2.0_`-nimellä ja Nokia-export `1.1_`-nimellä, vaikka masteri oli jo v2.1 — tämä drift on nyt korjattu ja sääntö kirjattu molempien tiedostojen headeriin.
   - Huom: masterin Drive-dokumentissa taulukon lihavointimerkit näkyvät literaaleina (`\*\*`) Docs-konversion escapetuksen vuoksi; Nokia-export on siksi viety ilman taulukon lihavointeja. MCP:llä ei voi ylikirjoittaa olemassa olevaa Docsia, joten korjattu masteri vaatii uuden vientikierroksen (ei tehty ilman HIC:n pyyntöä).
5. **Kysymys HIC:lle** — esitetty ja **vastattu 11.08.2026**: Etelä-Korea poistetaan kehyksestä nyt ja palautetaan vasta lähteistettynä (§4c).
6. **Kalenterointi** — Nokia-säätiön DL 15.9.2026 on jo kirjattu (`docs/lut/apuraha-deadline-calendar-2026.md`); uusia päivämääriä ei syntynyt tässä sessiossa.
