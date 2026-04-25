/**
 * OneLifetime.World Iron Clad Navigation v1.1
 * Dark theme navigation for all onelifetime.world pages
 *
 * Usage: Add to any page:
 * <script src="/shared-assets/nav/ironclad-nav.js"></script>
 *
 * v1.1 — 2026-03-10: Rename "AI Agents" to "God Agents" for Pantheon branding.
 * v1.0 — 2026-03-10: Initial release. Dark theme, hamburger mobile menu,
 *        structured for OneLifetime.World site map.
 *
 * Auto-injects nav at the start of <body>.
 */

(function () {
  'use strict';

  const getBasePath = () => {
    const path = window.location.pathname;
    const depth = (path.match(/\//g) || []).length - 1;
    if (depth === 0 || path === '/' || path === '/index.html') return '';
    return '../'.repeat(depth);
  };

  const basePath = getBasePath();

  const navHTML = `
<!-- OneLifetime.World Iron Clad Navigation v1.0 (Dark Theme) -->
<header class="olw-header">
    <div class="olw-container">
        <div class="olw-logo-section">
            <a href="${basePath || '/'}" class="olw-logo-link">
                <img src="${basePath}OneLifetime+Logo.png" alt="OneLifetime.World" class="olw-logo">
            </a>
            <span class="olw-title">OneLifetime.World</span>
        </div>
        <button class="olw-hamburger" aria-label="Open menu" aria-expanded="false">
            <span></span><span></span><span></span>
        </button>
        <nav class="olw-nav">
            <div class="olw-mobile-header">
                <span class="olw-mobile-title">Menu</span>
                <button class="olw-close" aria-label="Close menu">&times;</button>
            </div>
            <ul class="olw-menu">
                <!-- Home -->
                <li class="olw-menu-item">
                    <a href="${basePath || '/'}" class="olw-link">Home</a>
                </li>

                <!-- Community ▾ -->
                <li class="olw-menu-item">
                    <a href="#" class="olw-link">Community ▾</a>
                    <ul class="olw-dropdown">
                        <li><a href="${basePath}blog/" class="olw-primary">Blog</a></li>
                        <li><a href="${basePath}posts/">Posts & Articles</a></li>
                        <li><a href="${basePath}pledge/">Climate Pledge</a></li>
                        <li><a href="${basePath}careers/">Careers</a></li>
                        <li><a href="${basePath}Partners/">Partners</a></li>
                        <li><a href="${basePath}community-login/">Community Login</a></li>
                    </ul>
                </li>

                <!-- God Agents ▾ -->
                <li class="olw-menu-item">
                    <a href="#" class="olw-link">God Agents ▾</a>
                    <ul class="olw-dropdown olw-dropdown-wide">
                        <li><a href="${basePath}pantheon/" class="olw-primary">The DWS Pantheon — 14 God Agents</a></li>
                        <li class="olw-separator"></li>
                        <li class="olw-section-label">Orchestrators</li>
                        <li><a href="${basePath}pantheon/atlas.html">&#x1F30D; Atlas — Chief of Staff</a></li>
                        <li><a href="${basePath}pantheon/athena.html">&#x2696;&#xFE0F; Athena — Compliance</a></li>
                        <li><a href="${basePath}pantheon/hephaestus.html">&#x1F528; Hephaestus — Field Intel</a></li>
                        <li><a href="${basePath}pantheon/iris.html">&#x1F308; Iris — Market Intel</a></li>
                        <li><a href="${basePath}pantheon/hermes.html">&#x1F3C3; Hermes — Logistics</a></li>
                        <li><a href="${basePath}pantheon/apollo.html">&#x2600;&#xFE0F; Apollo — Content</a></li>
                        <li class="olw-separator"></li>
                        <li class="olw-section-label">Industry Specialists</li>
                        <li><a href="${basePath}pantheon/vulcan.html">&#x2692;&#xFE0F; Vulcan — Steel</a></li>
                        <li><a href="${basePath}pantheon/helios.html">&#x1F506; Helios — Energy</a></li>
                        <li><a href="${basePath}pantheon/neptune.html">&#x1F531; Neptune — Maritime</a></li>
                        <li><a href="${basePath}pantheon/ceres.html">&#x1F33E; Ceres — Agriculture</a></li>
                        <li><a href="${basePath}pantheon/prometheus.html">&#x1F525; Prometheus — Hydrogen</a></li>
                        <li><a href="${basePath}pantheon/mars.html">&#x1F3D7;&#xFE0F; Mars — Construction</a></li>
                        <li><a href="${basePath}pantheon/gaia.html">&#x1FAA8; Gaia — Cement</a></li>
                        <li class="olw-separator"></li>
                        <li class="olw-section-label">Orbital</li>
                        <li><a href="${basePath}pantheon/argus.html" class="olw-highlight">&#x1F6F0;&#xFE0F; Argus — Orbital Eye (ICEYE SAR)</a></li>
                    </ul>
                </li>

                <!-- Investor ▾ -->
                <li class="olw-menu-item">
                    <a href="#" class="olw-link">Investor ▾</a>
                    <ul class="olw-dropdown">
                        <li><a href="${basePath}press/" class="olw-primary">Press Releases</a></li>
                        <li><a href="https://dws10.com/investor-relations/" class="olw-primary">Investor Relations</a></li>
                        <li><a href="https://dws10.com/series-a/" class="olw-highlight">Series A Round</a></li>
                        <li><a href="https://dws10.com/captain/" class="olw-highlight">Industry Captain Seats</a></li>
                        <li class="olw-separator"></li>
                        <li><a href="${basePath}investment-safety/">Investment Safety</a></li>
                        <li><a href="${basePath}regulatory-notice/">Regulatory Notice</a></li>
                    </ul>
                </li>

                <!-- Products ▾ -->
                <li class="olw-menu-item">
                    <a href="#" class="olw-link">Products ▾</a>
                    <ul class="olw-dropdown">
                        <li><a href="https://dws10.com/buy/" class="olw-primary">DWS Store</a></li>
                        <li><a href="https://dws10.com/products/dwsiq.html">DWS IQ Platform v6</a></li>
                        <li><a href="https://dws10.com/products/firehorse-reports.html">Firehorse Suite</a></li>
                        <li><a href="https://dws10.com/products/firehorse-automation.html">Firehorse Automation</a></li>
                        <li class="olw-separator"></li>
                        <li><a href="${basePath}assistant/">AI Assistant</a></li>
                        <li><a href="${basePath}buy/">Buy</a></li>
                    </ul>
                </li>

                <!-- Legal ▾ -->
                <li class="olw-menu-item">
                    <a href="#" class="olw-link olw-legal-link">Legal ▾</a>
                    <ul class="olw-dropdown">
                        <li><a href="${basePath}legal/">Legal Hub</a></li>
                        <li><a href="${basePath}terms/">Website Terms</a></li>
                        <li><a href="${basePath}terms-dws-iq/">DWS IQ Terms</a></li>
                        <li><a href="${basePath}terms-firehorse/">Firehorse Terms</a></li>
                        <li><a href="${basePath}terms-lifetime-fleet/">Fleet Terms</a></li>
                        <li><a href="${basePath}terms-professional/">Professional Services</a></li>
                        <li class="olw-separator"></li>
                        <li><a href="${basePath}privacy-policy/">Privacy Policy</a></li>
                        <li><a href="${basePath}investment-safety/">Investment Safety</a></li>
                        <li><a href="${basePath}regulatory-notice/">Regulatory Notice</a></li>
                    </ul>
                </li>

                <!-- DWS IQ Login CTA -->
                <li class="olw-menu-item">
                    <a href="https://dws6.com/login" class="olw-cta">IQ Login</a>
                </li>
            </ul>
        </nav>
    </div>
</header>
`;

  const navCSS = `
/* ============================================
   ONELIFETIME.WORLD IRON CLAD NAV v1.0
   Dark theme — matches site gradient
   ============================================ */

.olw-header {
    background: rgba(10, 22, 40, 0.95);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    color: #e2e8f0;
    padding: 12px 0;
    position: sticky;
    top: 0;
    z-index: 1000;
    border-bottom: 1px solid rgba(148, 163, 184, 0.1);
}

.olw-container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
}

.olw-logo-section {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-shrink: 0;
}

.olw-logo-link {
    display: flex;
    align-items: center;
    text-decoration: none;
}

.olw-logo {
    height: 40px;
    width: auto;
}

.olw-title {
    font-size: clamp(0.85rem, 1.5vw, 1.1rem);
    font-weight: 700;
    color: #e2e8f0;
    white-space: nowrap;
}

.olw-nav { flex-grow: 0; }

.olw-menu {
    display: flex;
    list-style: none;
    gap: 4px;
    align-items: center;
    margin: 0;
    padding: 0;
}

.olw-menu-item {
    position: relative;
    padding: 0;
}
.olw-menu-item::before { display: none; }

.olw-link {
    color: #94a3b8;
    text-decoration: none;
    white-space: nowrap;
    font-weight: 500;
    font-size: 0.9rem;
    padding: 8px 12px;
    border-radius: 6px;
    transition: all 0.2s;
    display: block;
}

.olw-link:hover {
    background: rgba(148, 163, 184, 0.1);
    color: #06b6d4;
}

.olw-legal-link { color: #64748b; }
.olw-legal-link:hover { color: #22d3ee; }

/* Dropdowns — dark glass */
.olw-dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    background: rgba(15, 23, 42, 0.97);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    min-width: 220px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
    border-radius: 10px;
    padding: 8px 0;
    display: none;
    z-index: 100;
    border: 1px solid rgba(148, 163, 184, 0.1);
    list-style: none;
    margin: 0;
}

.olw-dropdown-wide { min-width: 300px; }

.olw-menu-item:hover > .olw-dropdown { display: block; }

.olw-dropdown li { padding: 0; }
.olw-dropdown li::before { display: none; }

.olw-dropdown a {
    display: block;
    padding: 10px 20px;
    color: #94a3b8;
    text-decoration: none;
    font-size: 0.88rem;
    transition: all 0.2s;
}

.olw-dropdown a:hover {
    background: rgba(6, 182, 212, 0.08);
    color: #06b6d4;
}

.olw-dropdown .olw-primary {
    color: #06b6d4;
    font-weight: 600;
}

.olw-dropdown .olw-highlight {
    color: #14b8a6;
    font-weight: 600;
}

.olw-separator {
    border-top: 1px solid rgba(148, 163, 184, 0.1);
    margin: 4px 0;
}

.olw-section-label {
    padding: 8px 20px 4px;
    font-size: 0.7rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #475569;
}

/* CTA Button — cyan accent */
.olw-cta {
    background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%);
    color: #ffffff !important;
    padding: 6px 16px;
    border-radius: 6px;
    text-decoration: none;
    font-weight: 600;
    font-size: 0.85rem;
    display: inline-flex;
    align-items: center;
    height: 32px;
    white-space: nowrap;
    transition: all 0.3s;
    border: none;
}

.olw-cta:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 16px rgba(6, 182, 212, 0.3);
    filter: brightness(1.1);
}

/* ============================================
   HAMBURGER — hidden on desktop
   ============================================ */
.olw-hamburger {
    display: none;
    flex-direction: column;
    justify-content: center;
    gap: 5px;
    background: none;
    border: none;
    cursor: pointer;
    padding: 8px;
    z-index: 1002;
    -webkit-tap-highlight-color: transparent;
}

.olw-hamburger span {
    display: block;
    width: 24px;
    height: 2.5px;
    background: #94a3b8;
    border-radius: 2px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    transform-origin: center;
}

.olw-hamburger.active span:nth-child(1) { transform: rotate(45deg) translate(5px, 5px); }
.olw-hamburger.active span:nth-child(2) { opacity: 0; }
.olw-hamburger.active span:nth-child(3) { transform: rotate(-45deg) translate(5px, -5px); }

.olw-mobile-header { display: none; }
.olw-close { display: none; }

.olw-backdrop {
    display: none;
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
    z-index: 999;
    opacity: 0;
    transition: opacity 0.3s ease;
}
.olw-backdrop.active { display: block; opacity: 1; }

/* ============================================
   MOBILE RESPONSIVE (< 768px)
   ============================================ */
@media (max-width: 768px) {
    .olw-hamburger { display: flex; }

    .olw-nav {
        position: fixed;
        top: 0;
        right: -320px;
        width: 300px;
        max-width: 85vw;
        height: 100vh;
        background: #0f172a;
        z-index: 1001;
        overflow-y: auto;
        transition: right 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        padding: 0;
        box-shadow: -4px 0 20px rgba(0, 0, 0, 0.5);
    }

    .olw-nav.open { right: 0; }

    .olw-mobile-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 16px 20px;
        border-bottom: 1px solid rgba(148, 163, 184, 0.1);
    }

    .olw-mobile-title {
        font-weight: 700;
        font-size: 1.1rem;
        color: #e2e8f0;
    }

    .olw-close {
        display: block;
        background: none;
        border: none;
        color: #94a3b8;
        font-size: 2rem;
        cursor: pointer;
        padding: 0 4px;
        line-height: 1;
    }

    .olw-menu {
        flex-direction: column;
        gap: 0;
        padding: 8px 0;
        align-items: stretch;
    }

    .olw-link {
        padding: 14px 20px;
        border-radius: 0;
        font-size: 1rem;
    }

    .olw-dropdown {
        position: static;
        background: rgba(15, 23, 42, 0.5);
        box-shadow: none;
        border: none;
        border-radius: 0;
        padding: 0;
        display: none;
        min-width: unset;
    }

    .olw-dropdown a { padding: 12px 20px 12px 36px; font-size: 0.9rem; }

    .olw-menu-item.open > .olw-dropdown { display: block; }

    .olw-section-label { padding: 8px 36px 4px; }

    .olw-cta {
        margin: 12px 20px;
        justify-content: center;
        height: 40px;
        font-size: 1rem;
    }
}
`;

  // JavaScript for hamburger toggle
  function initNav() {
    // Inject CSS
    var style = document.createElement('style');
    style.textContent = navCSS;
    document.head.appendChild(style);

    // Inject nav HTML at start of body
    var wrapper = document.createElement('div');
    wrapper.innerHTML = navHTML.trim();
    var headerEl = wrapper.firstElementChild;
    document.body.insertBefore(headerEl, document.body.firstChild);

    // Create backdrop
    var backdrop = document.createElement('div');
    backdrop.className = 'olw-backdrop';
    document.body.appendChild(backdrop);

    var hamburger = document.querySelector('.olw-hamburger');
    var nav = document.querySelector('.olw-nav');
    var closeBtn = document.querySelector('.olw-close');

    function openMenu() {
      nav.classList.add('open');
      hamburger.classList.add('active');
      hamburger.setAttribute('aria-expanded', 'true');
      backdrop.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
      nav.classList.remove('open');
      hamburger.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
      backdrop.classList.remove('active');
      document.body.style.overflow = '';
    }

    if (hamburger) {
      hamburger.addEventListener('click', function () {
        if (nav.classList.contains('open')) {
          closeMenu();
        } else {
          openMenu();
        }
      });
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', closeMenu);
    }

    backdrop.addEventListener('click', closeMenu);

    // Mobile: tap to toggle dropdowns
    var menuItems = document.querySelectorAll('.olw-menu-item');
    menuItems.forEach(function (item) {
      var link = item.querySelector('.olw-link');
      var dropdown = item.querySelector('.olw-dropdown');
      if (link && dropdown) {
        link.addEventListener('click', function (e) {
          if (window.innerWidth <= 768) {
            e.preventDefault();
            item.classList.toggle('open');
          }
        });
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNav);
  } else {
    initNav();
  }
})();
