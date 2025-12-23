---
title: "(LSJ) Oracle vs. Salesforce"
date: 2025-10-18
slug: 2025-10-18-lsj-oracle-vs-salesforce
type: post
---

<div class="sqs-html-content" data-sqsp-text-block-content>
  <p class="" style="white-space:pre-wrap;"><em>Miten Oracle on toteuttanut vastaavanlaisen ratkaisun tekoälyagenttien ja monimutkaisen päättelyn hallintaan kuin Salesforce?</em></p><p class="" data-rte-preserve-empty="true" style="white-space:pre-wrap;"></p><p class="" style="white-space:pre-wrap;"><em>Oracle on lähestynyt samaa haastetta, mutta heidän strategiansa, teknologiansa ja markkinointinsa eroavat Salesforcen mallista. Tässä on erittely Oraclen lähestymistavasta:</em></p><p class="" style="white-space:pre-wrap;"><strong><em>Oraclen strategia: Sulautettu tekoäly ja OCI-palvelut</em></strong></p><p class="" style="white-space:pre-wrap;"><em>Toisin kuin Salesforce, joka markkinoi erillistä "päättelymoottoria", Oraclen strategia perustuu kahdelle pääpilarille:</em></p><ol data-rte-list="default"><li><p class="" style="white-space:pre-wrap;"><strong><em>Tekoälyn sulauttaminen suoraan sovelluksiin:</em></strong><em> Oraclen ensisijainen tavoite on tuoda generatiivinen tekoäly suoraan osaksi heidän olemassa olevia pilvisovelluksiaan (Fusion Cloud ERP, HCM, NetSuite jne.). Tavoitteena ei ole niinkään erillinen agenttialusta, vaan olemassa olevien liiketoimintaprosessien tehostaminen tekoälyllä.</em></p></li><li><p class="" style="white-space:pre-wrap;"><strong><em>Kattavien AI-palveluiden tarjoaminen OCI:ssa (Oracle Cloud Infrastructure):</em></strong><em> Oracle tarjoaa pilvi-infrastruktuurissaan rakennuspalikoita, joiden avulla asiakkaat ja kehittäjät voivat rakentaa omia tekoälyratkaisujaan.</em></p></li></ol><p class="" style="white-space:pre-wrap;"><strong><em>Oraclen tekninen toteutus ja "päättelykyky"</em></strong></p><p class="" style="white-space:pre-wrap;"><em>Oraclen ratkaisu monimutkaiseen päättelyyn rakentuu seuraavista komponenteista:</em></p><p class="" style="white-space:pre-wrap;"><strong><em>1. Kumppanuus Cohere-kielimallien kanssa</em></strong></p><p class="" style="white-space:pre-wrap;"><em>Siinä missä Salesforce tekee tiivistä yhteistyötä Googlen Gemini-mallien kanssa, Oraclen strateginen kumppani on </em><strong><em>Cohere</em></strong><em>. OCI Generative AI -palvelu antaa asiakkaille pääsyn Coheren huippuluokan kielimalleihin, jotka on optimoitu yrityskäyttöön. Nämä mallit tarjoavat sen "luovan ja joustavan päättelyn", jota aiemmin käsittelimme.</em></p><p class="" style="white-space:pre-wrap;"><strong><em>2. OCI Generative AI Agents -palvelu</em></strong></p><p class="" style="white-space:pre-wrap;"><em>Tämä on Oraclen suorin vastine Salesforcen agenttiajattelulle. Se ei ole kuitenkaan "hybridi-moottori" samassa mielessä, vaan se perustuu vahvasti </em><strong><em>Retrieval-Augmented Generation (RAG)</em></strong><em> -arkkitehtuuriin.</em></p><ul data-rte-list="default"><li><p class="" style="white-space:pre-wrap;"><strong><em>Toimintaperiaate:</em></strong><em> Agentti yhdistää Coheren kielimallin yrityksen omaan, yksityiseen dataan. Kun agentilta kysytään jotain, se ensin etsii relevanttia tietoa yrityksen tietolähteistä (esim. Oracle-tietokannat, sisäiset dokumentit) ja antaa tämän tiedon </em><strong><em>kontekstina</em></strong><em> kielimallille.</em></p></li><li><p class="" style="white-space:pre-wrap;"><strong><em>Tulos:</em></strong><em> Tämä varmistaa, että mallin vastaukset ovat tarkkoja ja perustuvat yrityksen omaan dataan, mikä vähentää merkittävästi "hallusinaatioita". Tämä on käytännössä se "päättely yksityisellä datalla" -vaihe, jonka olemme aiemmin määritelleet.</em></p></li></ul><p class="" style="white-space:pre-wrap;"><strong><em>3. Oracle Digital Assistant</em></strong></p><p class="" style="white-space:pre-wrap;"><em>Oraclen aiempi chatbot-alusta on kehittymässä generatiivisen tekoälyn avulla. Siihen integroidaan OCI Generative AI -palveluita, jotta se pystyy käymään monimutkaisempia, monivaiheisia keskusteluja ja suorittamaan tehtäviä Oracle-sovellusten sisällä.</em></p><p class="" data-rte-preserve-empty="true" style="white-space:pre-wrap;"></p><p class="" data-rte-preserve-empty="true" style="white-space:pre-wrap;"></p><p class="" style="white-space:pre-wrap;"><strong><em>Yhteenveto ja erot Salesforceen</em></strong></p><p style="text-align:center;white-space:pre-wrap;" class=""><em>Ominaisuus</em></p><p style="text-align:center;white-space:pre-wrap;" class=""><strong><em>Salesforce (Atlas Reasoning Engine)</em></strong></p><p style="text-align:center;white-space:pre-wrap;" class=""><strong><em>Oracle</em></strong></p><p class="" style="white-space:pre-wrap;"><strong><em>Nimi ja markkinointi</em></strong></p><p class="" style="white-space:pre-wrap;"><em>S:Nimetty, erillinen "Atlas Reasoning Engine" -konsepti.</em></p><p class="" style="white-space:pre-wrap;"><em>O:Ei yhtä selkeää nimeä; markkinoidaan osana </em><strong><em>OCI Generative AI Agents</em></strong><em> -palvelua ja sovelluksiin sulautettua tekoälyä.</em></p><p class="" style="white-space:pre-wrap;"><strong><em>Ydinarkkitehtuuri</em></strong></p><p class="" style="white-space:pre-wrap;"><strong><em>S:Hybridi päättely:</em></strong><em> Yhdistää eksplisiittisesti LLM:n luovuuden ja deterministisen, sääntöpohjaisen prosessimoottorin.</em></p><p class="" style="white-space:pre-wrap;"><strong><em>O:RAG-pohjainen:</em></strong><em> Painottaa vahvasti tiedonhakua yrityksen omista lähteistä (Retrieval-Augmented Generation) kielimallin ohjaamiseksi.</em></p><p class="" style="white-space:pre-wrap;"><strong><em>Keskeinen LLM-kumppani</em></strong></p><p class="" style="white-space:pre-wrap;"><em>S: Google (Gemini)</em></p><p class="" style="white-space:pre-wrap;"><em>O: Cohere</em></p><p class="" style="white-space:pre-wrap;"><strong><em>Strateginen fokus</em></strong></p><p class="" style="white-space:pre-wrap;"><em>S:Tarjota agenttimainen alusta (Agentforce 360), jonka päälle rakennetaan älykkäitä prosesseja.</em></p><p class="" style="white-space:pre-wrap;"><em>O: Tehostaa olemassa olevia liiketoimintasovelluksia (ERP, HCM) ja tarjota OCI:ssa rakennuspalikoita omille ratkaisuille.</em></p><p class="" style="white-space:pre-wrap;"><em>Yhteenvetona</em></p><p class="" style="white-space:pre-wrap;"><em>Salesforce rakentaa ja markkinoi selkeästi nimettyä, uudenlaista "aivoa" prosesseilleen. </em></p><p class="" style="white-space:pre-wrap;"><em>Oracle sen sijaan päivittää olemassa olevien sovellustensa aivoja ja tarjoaa työkalupakin, jolla asiakkaat voivat rakentaa omia aivojaan. </em></p><p class="" style="white-space:pre-wrap;"><em>Lopputulos pyrkii olemaan sama – älykkäämpi ja automatisoidumpi liiketoiminta – mutta polku sinne on erilainen.</em></p><p class="" data-rte-preserve-empty="true" style="white-space:pre-wrap;"></p><p class="" data-rte-preserve-empty="true" style="white-space:pre-wrap;"></p>
</div>




















  
  






  
      <img src="https://images.squarespace-cdn.com/content/v1/54c48881e4b0d7a7fa7eddf4/15f4dd72-66ca-4912-8dcb-997d7ba9ba80/IMG_5514.jpg?format=original" alt=""/>
