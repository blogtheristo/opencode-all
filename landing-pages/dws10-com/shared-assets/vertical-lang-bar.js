/**
 * DWS10.com Vertical Language Bar v1.3
 * Introduced-In: PR-TBD (restore-language-bar) / updated: claude/aegis-multilingual-pages-3clsx0
 * Code-Version: 1.3
 * Branch: claude/aegis-multilingual-pages-3clsx0
 * Date: 2026-06-23
 * Owner: Lifetime Oy
 *
 * PAGE ELEMENT — not a menu/nav element.
 * Vertical 5-language showcase with hero text and country flag on the right.
 * Shows all 5 EU languages simultaneously. No pulldown. No redirect on store/product pages.
 * Order: Suomi | Svenska | Deutsch | Français | English
 *
 * Usage: <script src="/shared-assets/vertical-lang-bar.js"></script>
 *
 * Also exports window.dwsVlbCardHTML() for use inside product cards (buy/index.html).
 * Shares localStorage key 'dws-lang' with ironclad-nav.js.
 *
 * v1.1 — Added product version line (Control Room / Situation Room hardware bundles).
 * v1.2 — Added compliance/legal hub contexts: per-language hero lines, context-aware
 *        hrefs (/compliance/<lang>/, /legal/<lang>/), hardware version line hidden on hubs.
 * v1.3 — Added Aegis context: per-language minimum hero line for /aegis and
 *        /products/aegis pages; hardware version line hidden; section fallback so the
 *        bar injects on pages without a .container wrapper.
 * v1.4 — Added Claude Code Coaching context: per-language hero line for
 *        /products/claude-code-coaching; hardware version line hidden.
 * v1.5 — Added healthcare and industries contexts: per-language hero lines for
 *        /healthcare/ and /industries/ pages; hardware version line hidden.
 */
(function () {
  'use strict';

  var LANGS = [
    {
      code: 'fi',
      name: 'Suomi',
      flag: '\uD83C\uDDEB\uD83C\uDDEE',
      href: '/fi/',
      home: 'Pohjoismainen teollisuus-AI. Rakennettu Suomessa, Pohjoismaille.',
      store: 'Suvereeneja AI-tuotteita eurooppalaisille yrityksille.',
      product: 'Kultainen br\u00e4ndistandardisi, teko\u00e4lyagentit ja tuotantokone.',
      aegis:
        'Suvereeni teollinen \u00e4ly kaksik\u00e4ytt\u00f6iseen valmistukseen \u2014 21 EU-toimialaa, nolla CLOUD Act -altistusta.',
      coaching:
        'Valmenna insin\u00f6\u00f6risi toimittamaan Claude Codella \u2014 kurinalaista agenttipohjaista ohjelmistokehityst\u00e4, EU-suvereenisti, EU AI Act 4 artiklan mukaisesti.',
      versions:
        'Control Room (1\u00d7 GN100) 4\u00a0994\u00a0\u20ac \u00b7 Situation Room (2\u00d7 sillattu) 8\u00a0993\u00a0\u20ac',
    },
    {
      code: 'sv',
      name: 'Svenska',
      flag: '\uD83C\uDDF8\uD83C\uDDEA',
      href: '/sv/',
      home: 'Nordisk industri-AI. Byggd i Finland, f\u00f6r Norden.',
      store: 'Suvern\u00e4na AI-produkter f\u00f6r europeiska f\u00f6retag.',
      product: 'Din guldstandard f\u00f6r varum\u00e4rke, AI-agenter och produktionsmotor.',
      aegis:
        'Suver\u00e4n industriell intelligens f\u00f6r dual-use-tillverkning \u2014 21 EU-branscher, noll CLOUD Act-exponering.',
      coaching:
        'Coacha dina ingenj\u00f6rer att leverera med Claude Code \u2014 disciplinerad agentbaserad utveckling, EU-suver\u00e4n, redo f\u00f6r EU:s AI-f\u00f6rordning artikel 4.',
      versions:
        'Control Room (1\u00d7 GN100) 4 994 \u20ac \u00b7 Situation Room (2\u00d7 bryggad) 8 993 \u20ac',
    },
    {
      code: 'de',
      name: 'Deutsch',
      flag: '\uD83C\uDDE9\uD83C\uDDEA',
      href: '/de/',
      home: 'Gestalte, wie Europas Industrial IQ Compliance-Schwungrad sich dreht.',
      store: 'Souver\u00e4ne KI-Produkte f\u00fcr europ\u00e4ische Unternehmen.',
      product: 'Ihr Goldstandard f\u00fcr Marke, KI-Agenten und Produktions-Engine.',
      aegis:
        'Souver\u00e4ne industrielle Intelligenz f\u00fcr Dual-Use-Fertigung \u2014 21 EU-Branchen, null CLOUD-Act-Risiko.',
      coaching:
        'Coachen Sie Ihre Entwickler, mit Claude Code zu liefern \u2014 disziplinierte agentenbasierte Entwicklung, EU-souver\u00e4n, bereit f\u00fcr Artikel 4 der EU-KI-Verordnung.',
      versions:
        'Control Room (1\u00d7 GN100) 4.994 \u20ac \u00b7 Situation Room (2\u00d7 gebr\u00fcckt) 8.993 \u20ac',
    },
    {
      code: 'fr',
      name: 'Fran\u00e7ais',
      flag: '\uD83C\uDDEB\uD83C\uDDF7',
      href: '/fr/',
      home: 'Fa\u00e7onnez la dynamique du volant d\u2019inertie Industrial IQ Compliance en Europe.',
      store: 'Produits IA souverains pour les entreprises europ\u00e9ennes.',
      product: 'Votre standard d\u2019or pour la marque, les agents IA et le moteur de production.',
      aegis:
        'Intelligence industrielle souveraine pour la fabrication \u00e0 double usage \u2014 21 secteurs UE, z\u00e9ro exposition au CLOUD Act.',
      coaching:
        'Formez vos ing\u00e9nieurs \u00e0 livrer avec Claude Code \u2014 ing\u00e9nierie agentique disciplin\u00e9e, souveraine UE, pr\u00eate pour l\u2019article 4 du r\u00e8glement IA de l\u2019UE.',
      versions:
        'Control Room (1\u00d7 GN100) 4 994 \u20ac \u00b7 Situation Room (2\u00d7 pont\u00e9e) 8 993 \u20ac',
    },
    {
      code: 'en',
      name: 'English',
      flag: '\uD83C\uDDEC\uD83C\uDDE7',
      href: '/',
      home: 'Nordic Industrial AI. Built in Finland, for the Nordics.',
      store: 'Sovereign AI products for European enterprises.',
      product: 'Your brand Gold Standards, AI agents and Firehorse production engine.',
      aegis:
        'Sovereign industrial intelligence for dual-use manufacturing — 21 EU industries, zero CLOUD Act exposure.',
      coaching:
        'Coach your engineers to ship with Claude Code — disciplined agentic engineering, EU-sovereign, EU AI Act Article 4 ready.',
      versions: 'Control Room (1× GN100) €4,994 · Situation Room (2× bridged) €8,993',
    },
  ];

  // Hub-context hero lines (compliance / legal). Keyed by pageType then language code.
  var HUB_HERO = {
    compliance: {
      fi: 'EU-sääntelyn compliance — johdettua, auditointivalmista, ISO 42001 -linjattua.',
      sv: 'EU-regelefterlevnad — styrd, revisionsklar, ISO 42001-anpassad.',
      de: 'EU-Regulierungs-Compliance — gesteuert, auditbereit, ISO-42001-konform.',
      fr: 'Conformité réglementaire UE — pilotée, prête pour l’audit, alignée ISO 42001.',
      en: 'EU regulatory compliance — managed, audit-ready, ISO 42001-aligned.',
    },
    legal: {
      fi: 'Juridiikka ja tiedonhallinta — tietosuojajohtaminen, GDPR- ja EU AI Act -valmius.',
      sv: 'Juridik och datastyrning — dataskyddsledning, redo för GDPR och EU:s AI-förordning.',
      de: 'Recht & Daten-Governance — Datenschutzmanagement, bereit für DSGVO und EU-KI-Gesetz.',
      fr: 'Juridique & gouvernance des données — gestion de la protection des données, prêt RGPD et règlement IA UE.',
      en: 'Legal & data governance — data protection management, GDPR & EU AI Act ready.',
    },
    healthcare: {
      fi: 'Terveydenhuollon tekoäly — BioNeMo, MONAI, AlphaFold ja suvereeni infrastruktuuri EU-sairaaloille.',
      sv: 'Sjukvårds-AI — BioNeMo, MONAI, AlphaFold och suverän infrastruktur för EU-sjukhus.',
      de: 'Gesundheits-KI — BioNeMo, MONAI, AlphaFold und souveräne Infrastruktur für EU-Kliniken.',
      fr: "IA santé — BioNeMo, MONAI, AlphaFold et infrastructure souveraine pour les hôpitaux de l'UE.",
      en: 'Healthcare AI — BioNeMo, MONAI, AlphaFold & sovereign infrastructure for EU hospitals.',
    },
    industries: {
      fi: '25 EU-säänneltyä toimialaa — Toolkit + LLM → Maailmamalli + Infrastruktuuri.',
      sv: '25 EU-reglerade branscher — Toolkit + LLM → Världsmodell + Infrastruktur.',
      de: '25 EU-regulierte Branchen — Toolkit + LLM → Weltmodell + Infrastruktur.',
      fr: '25 secteurs réglementés UE — Toolkit + LLM → Modèle du monde + Infrastructure.',
      en: '25 EU-regulated industries — Toolkit + LLM → World Model + Infrastructure.',
    },
  };

  // Context-aware destination: hub pages route to /compliance/<lang>/ etc.; EN stays at root.
  function rowHref(l) {
    if (pageType === 'compliance')
      return l.code === 'en' ? '/compliance/' : '/compliance/' + l.code + '/';
    if (pageType === 'legal') return l.code === 'en' ? '/legal/' : '/legal/' + l.code + '/';
    return l.href;
  }

  // Compact strip for product cards — set up immediately so createProductCard() can use it
  window.dwsVlbCardHTML = function () {
    return (
      '<div class="dws-vlb-card">' +
      LANGS.map(function (l) {
        return (
          '<div class="dws-vlb-card-row">' +
          '<span class="dws-vlb-card-lang">' +
          l.name +
          '</span>' +
          '<span class="dws-vlb-card-text">' +
          l.store +
          '</span>' +
          '<span class="dws-vlb-card-flag">' +
          l.flag +
          '</span>' +
          '</div>'
        );
      }).join('') +
      '</div>'
    );
  };

  // Idempotency guard — section injection only once per page load
  if (window.__dwsVlbLoaded) return;
  window.__dwsVlbLoaded = true;

  var stays = !!document.querySelector('meta[name="dws-lang-stay"]');
  var storedLang = localStorage.getItem('dws-lang');
  var currentLang = LANGS.some(function (l) {
    return l.code === storedLang;
  })
    ? storedLang
    : 'en';

  // Detect page type from path
  var path = window.location.pathname;
  var pageType = 'home';
  if (path.indexOf('/aegis') !== -1) pageType = 'aegis';
  else if (path.indexOf('/claude-code-coaching') !== -1) pageType = 'coaching';
  else if (path.indexOf('/buy') !== -1) pageType = 'store';
  else if (path.indexOf('/products/') !== -1) pageType = 'product';
  else if (path.indexOf('/healthcare') !== -1) pageType = 'healthcare';
  else if (path.indexOf('/industries') !== -1) pageType = 'industries';
  else if (path.indexOf('/compliance') !== -1) pageType = 'compliance';
  else if (path.indexOf('/legal') !== -1) pageType = 'legal';

  // Inject CSS once
  if (!document.getElementById('dws-vlb-style')) {
    var css = [
      '.dws-vlb {',
      '  background: linear-gradient(180deg, #091e53 0%, #071a4a 100%);',
      '  border-bottom: 2px solid rgba(255,209,102,0.18);',
      '  font-family: "IBM Plex Sans", system-ui, -apple-system, sans-serif;',
      '}',
      '.dws-vlb-heading {',
      '  text-align: center;',
      '  padding: 14px 20px 8px;',
      '  font-size: 0.67rem;',
      '  font-weight: 700;',
      '  letter-spacing: 0.16em;',
      '  text-transform: uppercase;',
      '  color: rgba(255,209,102,0.55);',
      '}',
      'a.dws-vlb-row, div.dws-vlb-row {',
      '  display: flex;',
      '  align-items: center;',
      '  padding: 13px 28px;',
      '  border-top: 1px solid rgba(255,255,255,0.06);',
      '  text-decoration: none;',
      '  cursor: pointer;',
      '  transition: background 0.16s;',
      '  color: inherit;',
      '}',
      'a.dws-vlb-row:hover, div.dws-vlb-row:hover {',
      '  background: rgba(255,255,255,0.05);',
      '}',
      '.dws-vlb-row.dws-vlb-active {',
      '  background: rgba(255,209,102,0.07);',
      '  border-left: 3px solid rgba(255,209,102,0.5);',
      '  padding-left: 25px;',
      '}',
      '.dws-vlb-lang {',
      '  font-size: 0.75rem;',
      '  font-weight: 700;',
      '  color: rgba(226,232,240,0.5);',
      '  min-width: 80px;',
      '  flex-shrink: 0;',
      '  letter-spacing: 0.03em;',
      '}',
      '.dws-vlb-row.dws-vlb-active .dws-vlb-lang {',
      '  color: #FFD166;',
      '}',
      '.dws-vlb-text {',
      '  flex: 1;',
      '  font-size: 0.9rem;',
      '  color: rgba(226,232,240,0.72);',
      '  line-height: 1.35;',
      '  padding: 0 18px;',
      '}',
      '.dws-vlb-row.dws-vlb-active .dws-vlb-text {',
      '  color: #e2e8f0;',
      '}',
      '.dws-vlb-text-main { display: block; }',
      '.dws-vlb-versions {',
      '  display: block;',
      '  font-size: 0.7rem;',
      '  color: rgba(255,209,102,0.55);',
      '  margin-top: 3px;',
      '  letter-spacing: 0.01em;',
      '}',
      '.dws-vlb-row.dws-vlb-active .dws-vlb-versions {',
      '  color: rgba(255,209,102,0.85);',
      '}',
      '.dws-vlb-flag {',
      '  font-size: 1.55rem;',
      '  flex-shrink: 0;',
      '  line-height: 1;',
      '}',
      // Compact card strip
      '.dws-vlb-card {',
      '  border-top: 1px solid rgba(255,255,255,0.07);',
      '  margin-top: 14px;',
      '  padding-top: 10px;',
      '}',
      '.dws-vlb-card-row {',
      '  display: flex;',
      '  align-items: center;',
      '  padding: 2px 0;',
      '}',
      '.dws-vlb-card-lang {',
      '  font-size: 0.63rem;',
      '  font-weight: 700;',
      '  color: rgba(226,232,240,0.32);',
      '  min-width: 52px;',
      '  flex-shrink: 0;',
      '}',
      '.dws-vlb-card-text {',
      '  flex: 1;',
      '  font-size: 0.63rem;',
      '  color: rgba(226,232,240,0.38);',
      '  line-height: 1.3;',
      '  padding: 0 6px;',
      '}',
      '.dws-vlb-card-flag {',
      '  font-size: 0.82rem;',
      '  flex-shrink: 0;',
      '}',
      '@media (max-width: 640px) {',
      '  a.dws-vlb-row, div.dws-vlb-row { padding: 11px 16px; }',
      '  .dws-vlb-row.dws-vlb-active { padding-left: 13px; }',
      '  .dws-vlb-text { font-size: 0.82rem; padding: 0 10px; }',
      '  .dws-vlb-lang { min-width: 66px; font-size: 0.7rem; }',
      '  .dws-vlb-flag { font-size: 1.28rem; }',
      '}',
    ].join('\n');

    var style = document.createElement('style');
    style.id = 'dws-vlb-style';
    style.textContent = css;
    document.head.appendChild(style);
  }

  function buildSection(textKey) {
    var el = document.createElement('div');
    el.className = 'dws-vlb';
    el.setAttribute('role', 'navigation');
    el.setAttribute('aria-label', '5 European languages');

    var hubHero = HUB_HERO[pageType];
    // hide hardware-bundle line on compliance/legal hubs and on Aegis/coaching pages
    var showVersions = !hubHero && pageType !== 'aegis' && pageType !== 'coaching';
    var rows = LANGS.map(function (l) {
      var isActive = l.code === currentLang;
      var tag = stays ? 'div' : 'a';
      var hrefAttr = stays ? '' : ' href="' + rowHref(l) + '"';
      var activeCls = isActive ? ' dws-vlb-active' : '';
      var mainText = hubHero ? hubHero[l.code] || l[textKey] : l[textKey];
      return (
        '<' +
        tag +
        ' class="dws-vlb-row' +
        activeCls +
        '"' +
        hrefAttr +
        ' lang="' +
        l.code +
        '" tabindex="0">' +
        '<span class="dws-vlb-lang">' +
        l.name +
        '</span>' +
        '<span class="dws-vlb-text">' +
        '<span class="dws-vlb-text-main">' +
        mainText +
        '</span>' +
        (showVersions ? '<span class="dws-vlb-versions">' + l.versions + '</span>' : '') +
        '</span>' +
        '<span class="dws-vlb-flag">' +
        l.flag +
        '</span>' +
        '</' +
        tag +
        '>'
      );
    }).join('');

    el.innerHTML = '<div class="dws-vlb-heading">\uD83C\uDF0D Sovereign by Design. Global by Choice.</div>' + rows;

    // On stay pages (store/product): clicking switches active language in-place
    if (stays) {
      el.querySelectorAll('.dws-vlb-row').forEach(function (row) {
        row.addEventListener('click', function () {
          var lang = row.getAttribute('lang');
          localStorage.setItem('dws-lang', lang);
          currentLang = lang;
          el.querySelectorAll('.dws-vlb-row').forEach(function (r) {
            r.classList.remove('dws-vlb-active');
          });
          row.classList.add('dws-vlb-active');
          window.dispatchEvent(new CustomEvent('dws-lang-change', { detail: { lang: lang } }));
          var navCode = document.querySelector('.ironclad-lang-code');
          if (navCode) navCode.textContent = lang.toUpperCase();
        });
        row.addEventListener('keydown', function (e) {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            row.click();
          }
        });
      });
    }

    return el;
  }

  function init() {
    var section = buildSection(pageType);

    if (pageType === 'home') {
      // Place just before the campaign-hero section
      var hero = document.querySelector('.campaign-hero');
      if (hero && hero.parentNode) {
        hero.parentNode.insertBefore(section, hero);
        return;
      }
      // Fallback: first section on the page
      var firstSection = document.querySelector('section');
      if (firstSection && firstSection.parentNode) {
        firstSection.parentNode.insertBefore(section, firstSection);
        return;
      }
    } else {
      // Store, product and Aegis pages: before the main .container
      var container = document.querySelector('.container');
      if (container && container.parentNode) {
        container.parentNode.insertBefore(section, container);
        return;
      }
      // Fallback for pages without a .container wrapper (e.g. Aegis intro): first section
      var firstSec = document.querySelector('section');
      if (firstSec && firstSec.parentNode) {
        firstSec.parentNode.insertBefore(section, firstSec);
        return;
      }
    }

    // Ultimate fallback
    document.body.insertBefore(section, document.body.firstChild);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
