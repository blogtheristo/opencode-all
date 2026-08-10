# Tutkimussuunnitelman tiivistelmä — LUT 2026

***

# VERSION AND AGENT HISTORY

Version: 1.2

Sessions & Modifications:

- Version: 1.2 | Tool: Claude Code | Session: current task session | Date: 10.08.2026 | Changes: Luotu tutkimussuunnitelman tiivistelmäksi HIC:n 10.08.2026 toimittamasta v1.1-rungosta. Terävöitetty RQ3 niin, että kysymys erottaa välttämättömät suunnitteluperiaatteet tapauskohtaisista, ja rajattu RQ4 eksplisiittisesti suomalaisen säännellyn teollisuuden olemassa oleviin johtamis- ja riskienhallintajärjestelmiin. Tallennettu erilliseksi Markdown-lähdetiedostoksi repository-first -säännön mukaisesti.

Session Links & References:

- View on GitHub: https://github.com/blogtheristo/dws6/blob/main/docs/lut/tutkimussuunnitelman-tiivistelma-lut-2026-fi.md

Document Status:

- Created: 10.08.2026
- Last Modified: 10.08.2026
- Language: Finnish
- Languages Available: FI
- Publication Status: DRAFT
- Classification: CONFIDENTIAL — Väitöskirja- ja rahoitusaineisto
- Document Type: Tutkimussuunnitelman tiivistelmä

***

## Hakijatiedot

- **Hakija:** Risto Anton Päärni, insinööri (ylempi AMK), väitöskirjatutkija, LUT-yliopisto ja Lifetime Oy
- **Ohjaava professori:** Prof. Kari Smolander, LUT-yliopisto
- **Tutkimuksen nimi:** *Autonomisten tekoälyagenttien ajonaikainen luotettavuus ja sääntelyn mukaisuus suvereenissa reunalaskennassa*

## Tausta ja tutkimusaukko

Autonomiset tekoälyagentit tekevät monivaiheisia päätöksiä ja käyttävät teollisuuden järjestelmiä ilman jatkuvaa ihmisohjausta. Perinteiset varmennusmenetelmät perustuvat oletukseen, että järjestelmän toiminta voidaan johtaa ennalta määritellystä logiikasta. Generatiivisiin malleihin perustuvissa agenteissa agentin ilmoittama päättely tai aikomus ei välttämättä ennusta sen todellista toimintaa.

Teollisuudessa tarvitaan siksi menetelmiä, joilla agentin toiminta voidaan havaita, jälkikäteen todentaa ja tarvittaessa kumota. Nykyiset menetelmät eivät vielä tarjoa riittävän yleispätevää tapaa tuottaa tällaista näyttöä suvereenissa, reaaliaikaisessa reunalaskennassa.

Tutkimuksen pääteema on autonomisten agenttien käyttäytymisen kumottavuus. Luotettavuus ei perustu agentin ilmoittamaan aikomukseen, vaan ajonaikaisesti tuotettuun, jäljitettävään ja väärentämistä kestävään evidenssiin.

## Tutkimuskysymykset ja menetelmät

### RQ1 — Ajonaikainen valvonta

**Kysymys:** Mitkä autonomisen tekoälyagentin tai agenttipopulaation turvallisuus- ja luotettavuusominaisuudet voidaan määrittää ja valvoa ajonaikaisesti siten, että poikkeamat ovat havaittavissa ja todennettavissa?

**Menetelmät:** runtime verification -lähestymistapa, valvovat arkkitehtuurit ja hallitut poikkeamatilanteet.

### RQ2 — Turvallisuusevidenssin kustannus

**Kysymys:** Miten ajonaikaisen turvallisuus- ja vaatimustenmukaisuusevidenssin tuottamisen viive-, laskenta- ja energiakustannukset suhteutuvat evidenssin kattavuuteen reaaliaikaisella reuna-alustalla?

**Menetelmät:** empiiriset mittaukset ja kustannusmallinnus suljetussa reunalaskentaympäristössä.

### RQ3 — KYA-hallintakerroksen suunnitteluperiaatteet

**Kysymys:** Mitkä suunnitteluperiaatteet ovat välttämättömiä ja mitkä tapauskohtaisia Know Your Agent -hallintakerroksessa, joka tuottaa jäljitettävää näyttöä autonomisten agenttien toiminnasta ja sääntelyn edellyttämästä lokituksesta?

**Menetelmät:** Design Science Research -lähestymistapa ja referenssitoteutuksen arviointi useissa teollisissa käyttötapauksissa.

### RQ4 — Organisatorinen omaksuminen

**Kysymys:** Miten suomalaisen säännellyn teollisuuden organisaatiot sovittavat tekoälyagenttien hallinnan osaksi olemassa olevia johtamis- ja riskienhallintajärjestelmiään, ja mitkä tekijät tukevat vähähäiriöistä käyttöönottoa?

**Menetelmät:** laadullinen monitapaustutkimus suomalaisessa teollisuudessa.

## Tutkimusympäristö ja vastuut

LUT-yliopisto on väitöskirjan akateeminen koti ja tutkinnon myöntäjä. Prof. Kari Smolander toimii tutkimuksen ohjaavana professorina. Kaikki neljä tutkimuskysymystä muodostavat yhden LUT-ohjauksessa olevan väitöskirjakokonaisuuden.

Lifetime Oy ja sen teolliset pilotit tarjoavat empiirisen tutkimusympäristön. Tutkimuksessa voidaan hyödyntää suvereenin reunalaskennan ja DWS IQ -alustan kaltaisia kontrolloituja ympäristöjä, mutta tieteellinen arviointi pidetään erillään yrityksen kaupallisesta tuotekehityksestä.

KTH TECoSA ja Prof. Martin Törngren voidaan ottaa mukaan mahdollisena ulkopuolisena tutkimusyhteistyönä tai menetelmällisenä asiantuntijapanoksena reunalaskennan turvallisuuteen ja turvallisuusargumentaatioon liittyen. KTH ei ole ohjaajataho, eikä tutkimussuunnitelma ole sen osallistumisesta riippuvainen.

Haettava apuraha on henkilökohtainen jatko-opintoapuraha. Yritysten T&K-rahoitus ja mahdolliset kansainväliset hankkeet ovat erillisiä tutkimusympäristön rahoituskanavia.

## Aikataulu ja julkaisut (24 kuukautta)

- **Kuukaudet 1–6:** tutkimusasetelman ja mittausympäristön lukitseminen sekä RQ2:n pilottimittaukset.
- **Kuukaudet 7–12:** ensimmäinen artikkeli ajonaikaisen evidenssin viive-, laskenta- ja energiakustannuksista.
- **Kuukaudet 13–18:** toinen artikkeli agenttien ajonaikaisesta valvonnasta ja poikkeamien todennettavuudesta.
- **Kuukaudet 19–24:** kolmas artikkeli KYA-hallintakerroksen suunnitteluperiaatteista ja neljäs artikkeli teollisuuden organisatorisesta omaksumisesta. Tämän jälkeen valmistellaan väitöskirjan yhteenveto-osa.

## Versiotieto

versio 1.2 / 10.8.2026.
