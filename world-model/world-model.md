# Lifetime World Model (Lifetime Object Model)

Maailmanmalli (siniset solmut): Agentti hallitsee ja vuorovaikuttaa objektien kanssa, jotka puolestaan käyttävät tai riippuvat resursseista.

Lifetime Object Model (vihreät ja punaiset solmut): Jokaisella objektilla on oma elinkaarensa, joka etenee luomisesta aktiiviseen käyttöön, muokkaukseen ja lopulta poistumiseen.

Nuolilla kuvataan suhteet ja tilasiirtymät: Näin näet sekä maailman rakenteen että objektien sisäisen dynamiikan yhdessä kuvassa.

Tämä yhdistelmäkaavio toimii hyvänä pohjana, jos haluat rakentaa agenttiympäristöjä, simulaatioita tai tietomalleja, joissa objektien elinkaari on keskeinen osa maailman tilaa.

## Maailmanmallin rakenne (Class Diagram / Component Diagram)

Luokat / komponentit:

Agentti

Objekti

Resurssi

Suhteet:

Agentti hallinnoi Objekteja

Objekti käyttää Resursseja

Resurssi voi olla jaettu useiden objektien kesken

Kaaviossa:

Piirrä kolme pääluokkaa (Agentti, Objekti, Resurssi).

Käytä nuolia: Agentti → Objekti (association), Objekti → Resurssi (dependency).

2. Objektin elinkaari (State Machine Diagram)
Tilat:

Created (luotu)

Active (käytössä)

Modified (muokattu)

Deleted (poistettu)

Siirtymät:

Created → Active (kun objekti otetaan käyttöön)

Active → Modified (kun attribuutteja päivitetään)

Modified → Active (paluu käyttöön)

Active → Deleted (poistetaan käytöstä)

Kaaviossa:

Piirrä ympyrä (initial state) → Created.

Nuolilla siirtymät yllä olevien tilojen välillä.

Deleted on lopputila (double circle).

3. Integrointi (Composite Structure Diagram)
Jokaisella Objekti-luokalla on sisäinen state machine.

UML:ssa tämä voidaan kuvata:

Objekti-luokan sisällä on nested state machine diagram.

Agentti ja Resurssi näkyvät ulkotasolla, mutta objektin sisäinen elinkaari on erillinen.

4. Tapahtumapohjaisuus (Sequence Diagram)
Esimerkki tapahtumasta:

Agentti luo objektin → Create()

Objekti siirtyy tilaan Created

Agentti aktivoi objektin → Activate()

Objekti siirtyy tilaan Active

Agentti muokkaa objektia → Update()

Objekti siirtyy tilaan Modified

Lopuksi Agentti poistaa objektin → Delete()

Objekti siirtyy tilaan Deleted

5. Yhteenveto UML-tyyliin
Class Diagram: Agentti–Objekti–Resurssi suhteet

State Machine Diagram: Objektin elinkaari

Composite Diagram: Objektin sisäinen state machine osana maailmanmallia

Sequence Diagram: Tapahtumien kulku agentin ja objektin välillä.

+-------------------+        +-------------------+
|      Agentti      |------->|      Objekti      |------->+-------------------+
+-------------------+        +-------------------+        |     Resurssi      |
                                                          +-------------------+

Objektin elinkaari (State Machine):

   [Initial]
       |
       v
   +---------+
   | Created |
   +---------+
       |
       v
   +---------+
   | Active  |
   +---------+
    ^     |
    |     v
+---------+   +---------+
| Modified|-->| Deleted |
+---------+   +---------+
                 [Final]

Sekvenssikaavio: Agentti ja Objekti

Agentti          Objekti
  |                |
  | Create()       |
  |--------------->|   [Created]
  |                |
  | Activate()     |
  |--------------->|   [Active]
  |                |
  | Update()       |
  |--------------->|   [Modified]
  |                |
  | Delete()       |
  |--------------->|   [Deleted]
  |                |

Selitys
Class Diagram näyttää rakenteen: Agentti hallinnoi objekteja, jotka käyttävät resursseja.

State Machine Diagram kuvaa objektin sisäisen elinkaaren (Created → Active → Modified → Deleted).

Sequence Diagram näyttää tapahtumavirran, jossa Agentti ohjaa objektin tilasiirtymiä.

👉 Tämä yhdistelmä antaa sinulle kokonaisvaltaisen UML-dokumentaation: rakenne, dynamiikka ja tapahtumavirta.