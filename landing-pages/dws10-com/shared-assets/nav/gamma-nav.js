/**
 * DWS10.com Gamma Navigation v2.0
 * Unified navigation bar for all pages
 * 
 * Usage: Add this script to any page:
 * <script src="/shared-assets/nav/gamma-nav.js"></script>
 * 
 * The script will automatically inject the navigation at the start of <body>
 * and add required CSS styles.
 */

(function() {
    'use strict';

    // Determine base path based on current location
    const getBasePath = () => {
        const path = window.location.pathname;
        // Count directory depth (excluding filename)
        const parts = path.split('/').filter(p => p && !p.includes('.'));
        if (parts.length === 0) return './';
        return '../'.repeat(parts.length);
    };

    const basePath = getBasePath();

    // Navigation HTML - Gamma Style
    const navHTML = `
<!-- Enterprise Navigation - Gamma Light Header -->
<header class="gamma-header">
    <div class="gamma-header-container">
        <div class="gamma-logo-section">
            <a href="${basePath}index.html" class="gamma-logo-link">
                <img src="${basePath}DWS_IQ2026.png" alt="DWS IQ Platform" class="gamma-logo">
            </a>
            <span class="gamma-title">DWS IQ Platform Version 6</span>
        </div>
        <nav class="gamma-nav">
            <ul class="gamma-menu">
                <!-- Solutions ▾ -->
                <li class="gamma-menu-item">
                    <a href="#" class="gamma-link">Solutions ▾</a>
                    <ul class="gamma-dropdown">
                        <li class="gamma-has-submenu">
                            <a href="${basePath}fit-for-55/" class="gamma-dropdown-link gamma-highlight">Fit for 55 ▸</a>
                            <ul class="gamma-submenu">
                                <li><a href="${basePath}construction/?solution=fit55">Construction</a></li>
                                <li><a href="${basePath}logistics/?solution=fit55">Logistics</a></li>
                                <li><a href="${basePath}manufacturing/?solution=fit55">Manufacturing</a></li>
                                <li><a href="${basePath}energy/?solution=fit55">Energy</a></li>
                                <li><a href="${basePath}healthcare/?solution=fit55">Healthcare</a></li>
                                <li><a href="${basePath}real-estate/?solution=fit55">Real Estate</a></li>
                                <li><a href="${basePath}lifetime-fleet/?solution=fit55">Fleet Management</a></li>
                                <li><a href="${basePath}public-sector/?solution=fit55">Public Sector</a></li>
                            </ul>
                        </li>
                        <li class="gamma-has-submenu">
                            <a href="${basePath}csrd/" class="gamma-dropdown-link gamma-highlight">CSRD & ESG ▸</a>
                            <ul class="gamma-submenu">
                                <li><a href="${basePath}construction/?solution=csrd">Construction</a></li>
                                <li><a href="${basePath}logistics/?solution=csrd">Logistics</a></li>
                                <li><a href="${basePath}manufacturing/?solution=csrd">Manufacturing</a></li>
                                <li><a href="${basePath}energy/?solution=csrd">Energy</a></li>
                                <li><a href="${basePath}healthcare/?solution=csrd">Healthcare</a></li>
                                <li><a href="${basePath}real-estate/?solution=csrd">Real Estate</a></li>
                                <li><a href="${basePath}lifetime-fleet/?solution=csrd">Fleet Management</a></li>
                                <li><a href="${basePath}public-sector/?solution=csrd">Public Sector</a></li>
                            </ul>
                        </li>
                    </ul>
                </li>
                <!-- Products ▾ -->
                <li class="gamma-menu-item">
                    <a href="#" class="gamma-link">Products ▾</a>
                    <ul class="gamma-dropdown gamma-dropdown-wide">
                        <li><a href="${basePath}products/dwsiq.html" class="gamma-highlight">DWS IQ Platform v6</a></li>
                        <li><a href="${basePath}products/bundle.html">Climate Reporting Bundle</a></li>
                        <li><a href="${basePath}products/firehorse-automation.html">Firehorse Automation</a></li>
                        <li><a href="${basePath}products/firehorse-omnichannel.html">Firehorse Omnichannel Next</a></li>
                        <li><a href="${basePath}products/expert-services.html">Workshop 3 Days – Expert Advisory</a></li>
                        <li><a href="${basePath}products/expert-advisory.html">Expert Advisory (Monthly)</a></li>
                        <li><a href="${basePath}products/consulting-fit55.html">Consulting Fit for 55 Specialist</a></li>
                        <li><a href="${basePath}products/firehorse-reports.html">Firehorse Report – Fit for 55</a></li>
                        <li><a href="${basePath}products/consulting.html">Consulting – Hourly Rate</a></li>
                        <li class="gamma-separator"><a href="${basePath}world-model/" class="gamma-highlight">Lifetime World Model</a></li>
                    </ul>
                </li>
                <!-- About ▾ -->
                <li class="gamma-menu-item">
                    <a href="#" class="gamma-link">About ▾</a>
                    <ul class="gamma-dropdown">
                        <li><a href="https://onelifetime.world">Lifetime World</a></li>
                        <li><a href="${basePath}team/">Team</a></li>
                        <li><a href="https://onelifetime.world/careers/">Careers</a></li>
                        <li><a href="${basePath}partners/" class="gamma-highlight">Certified Partners</a></li>
                        <li class="gamma-has-submenu gamma-separator">
                            <a href="#" class="gamma-green">🏢 Lifetime Group ▸</a>
                            <ul class="gamma-submenu">
                                <li><a href="${basePath}lifetime-consulting/" class="gamma-green">🚀 DWS Product Family Vision</a></li>
                                <li><a href="${basePath}lifetime-studios/">🎬 Lifetime Studios</a></li>
                                <li><a href="${basePath}roadmap/">🗺️ DWS Roadmap</a></li>
                            </ul>
                        </li>
                        <li class="gamma-has-submenu">
                            <a href="#" class="gamma-purple">🎨 UX Designs ▸</a>
                            <ul class="gamma-submenu">
                                <li><a href="${basePath}ultra/" class="gamma-gold">✨ Ultra</a></li>
                                <li><a href="${basePath}industrial-preview/" class="gamma-cyan">🏭 Ultra II - Industrial</a></li>
                                <li><a href="${basePath}gamma/" class="gamma-highlight gamma-current">🏢 Gamma (Current)</a></li>
                            </ul>
                        </li>
                        <li><a href="${basePath}investor-relations/">Investor Relations</a></li>
                        <li><a href="${basePath}contact/">Contact</a></li>
                    </ul>
                </li>
                <!-- Legal ▾ -->
                <li class="gamma-menu-item">
                    <a href="#" class="gamma-link">Legal ▾</a>
                    <ul class="gamma-dropdown">
                        <li><a href="${basePath}legal/" class="gamma-green-dark">⭐ Legal Hub</a></li>
                        <li><a href="${basePath}investment-safety/">Investment Security</a></li>
                        <li><a href="${basePath}regulatory-notice/">Regulatory Notice</a></li>
                        <li class="gamma-has-submenu gamma-separator">
                            <a href="#" class="gamma-highlight">Terms ▸</a>
                            <ul class="gamma-submenu">
                                <li><a href="${basePath}terms/">Terms of Service</a></li>
                                <li><a href="${basePath}terms-dws-iq/">DWS IQ Terms</a></li>
                                <li><a href="${basePath}terms-firehorse/">Firehorse Terms</a></li>
                                <li><a href="${basePath}terms-lifetime-fleet/">Fleet Terms</a></li>
                                <li><a href="${basePath}terms-professional/">Professional Services</a></li>
                            </ul>
                        </li>
                        <li class="gamma-has-submenu">
                            <a href="#" class="gamma-highlight">Policy ▸</a>
                            <ul class="gamma-submenu">
                                <li><a href="${basePath}privacy-policy/">Privacy Policy</a></li>
                                <li><a href="${basePath}return-policy/">Return Policy</a></li>
                                <li><a href="${basePath}data-security-policy/">Data Security Policy</a></li>
                                <li><a href="${basePath}data-handling-policy/">Data Handling Policy</a></li>
                            </ul>
                        </li>
                    </ul>
                </li>
                <!-- Client Portal Button -->
                <li class="gamma-menu-item">
                    <a href="https://dws6.com/login" class="gamma-btn-portal">🔐 Client Portal</a>
                </li>
            </ul>
        </nav>
    </div>
</header>
`;

    // CSS Styles for Gamma Navigation
    const navCSS = `
<style id="gamma-nav-styles">
/* Gamma Navigation Styles */
.gamma-header {
    background: #ffffff;
    color: #0a1628;
    padding: 20px 0;
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    position: sticky;
    top: 0;
    z-index: 1000;
    border-bottom: 1px solid #e2e8f0;
}
.gamma-header-container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 20px;
}
.gamma-logo-section {
    display: flex;
    align-items: center;
    gap: 20px;
}
.gamma-logo-link {
    display: flex;
    align-items: center;
    text-decoration: none;
}
.gamma-logo {
    height: 60px;
    width: auto;
}
.gamma-title {
    font-size: clamp(1.2rem, 3vw, 1.8rem);
    color: #0a1628;
    font-weight: 600;
}
.gamma-nav {
    flex-grow: 0;
}
.gamma-menu {
    display: flex;
    list-style: none;
    gap: 15px;
    align-items: center;
    flex-wrap: wrap;
    margin: 0;
    padding: 0;
}
.gamma-menu-item {
    position: relative;
}
.gamma-link {
    color: #334155;
    text-decoration: none;
    white-space: nowrap;
    font-weight: 500;
}
.gamma-link:hover {
    color: #0066cc;
}
.gamma-dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    background: #ffffff;
    min-width: 220px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.15);
    border-radius: 8px;
    padding: 10px 0;
    display: none;
    z-index: 100;
    border: 1px solid #e2e8f0;
    list-style: none;
}
.gamma-dropdown-wide {
    min-width: 340px;
}
.gamma-dropdown li {
    list-style: none;
}
.gamma-dropdown a {
    display: block;
    padding: 8px 20px;
    color: #475569;
    text-decoration: none;
}
.gamma-dropdown a:hover {
    color: #0066cc;
    background: #f8fafc;
}
.gamma-dropdown-link {
    display: block;
    padding: 8px 20px;
    text-decoration: none;
}
.gamma-highlight {
    color: #0066cc !important;
    font-weight: 600;
}
.gamma-green {
    color: #76b900 !important;
    font-weight: 600;
}
.gamma-green-dark {
    color: #0d7a3e !important;
    font-weight: 600;
}
.gamma-purple {
    color: #9333ea !important;
    font-weight: 600;
}
.gamma-gold {
    color: #ffd700 !important;
    font-weight: 600;
    background: linear-gradient(90deg, rgba(255,215,0,0.1), transparent);
}
.gamma-cyan {
    color: #0ea5e9 !important;
    font-weight: 600;
}
.gamma-current {
    background: linear-gradient(90deg, rgba(0,102,204,0.1), transparent);
}
.gamma-separator {
    border-top: 1px solid #e2e8f0;
    margin-top: 5px;
    padding-top: 5px;
}
.gamma-has-submenu {
    position: relative;
}
.gamma-submenu {
    position: absolute;
    top: 0;
    left: 100%;
    background: #ffffff;
    min-width: 220px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.15);
    border-radius: 8px;
    padding: 10px 0;
    display: none;
    z-index: 101;
    border: 1px solid #e2e8f0;
    list-style: none;
}
.gamma-submenu li {
    list-style: none;
}
.gamma-submenu a {
    display: block;
    padding: 8px 20px;
    color: #475569;
    text-decoration: none;
}
.gamma-submenu a:hover {
    color: #0066cc;
    background: #f8fafc;
}
.gamma-btn-portal {
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    color: white !important;
    padding: 8px 18px;
    border-radius: 6px;
    text-decoration: none;
    font-weight: 600;
    display: inline-flex;
    align-items: center;
    transition: all 0.3s;
}
.gamma-btn-portal:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}
/* Dropdown hover functionality */
.gamma-menu-item:hover > .gamma-dropdown {
    display: block;
}
.gamma-has-submenu:hover > .gamma-submenu {
    display: block;
}
/* Mobile responsive */
@media (max-width: 1024px) {
    .gamma-header-container {
        flex-direction: column;
        align-items: flex-start;
    }
    .gamma-menu {
        flex-wrap: wrap;
        gap: 10px;
    }
    .gamma-title {
        font-size: 1rem;
    }
}
</style>
`;

    // Inject navigation when DOM is ready
    function injectNavigation() {
        // Add CSS first
        if (!document.getElementById('gamma-nav-styles')) {
            document.head.insertAdjacentHTML('beforeend', navCSS);
        }
        
        // Check if navigation already exists
        if (document.querySelector('.gamma-header')) {
            return;
        }
        
        // Insert navigation at start of body
        document.body.insertAdjacentHTML('afterbegin', navHTML);
    }

    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', injectNavigation);
    } else {
        injectNavigation();
    }
})();
