/**
 * DWS6.com Iron Clad Footer v1.0
 * Unified footer for all pages (matches store page footer design)
 *
 * Usage: Add this script to any page:
 * <script src="/shared-assets/footer/ironclad-footer.js"></script>
 *
 * v1.2 — 2026-05-31: Add ethics principle band (human-in-command).
 * v1.1 — 2026-03-15: Add Firehorse Mobile Google Play badge
 * v1.0 — Initial release: 5-column links, payment methods, legal bar, locale buttons
 *
 * The script will automatically inject the footer before </body>,
 * replacing any existing <footer> or <div class="footer"> element.
 */

(function() {
    'use strict';

    const footerCSS = `
/* === DWS6.com Iron Clad Footer v1.2 === */
.ironclad-footer { background: #1e293b; border-top: 1px solid #334155; color: #94a3b8; font-size: 0.875rem; font-family: system-ui, -apple-system, sans-serif; }
.ironclad-footer a { color: #94a3b8; text-decoration: none; transition: color 0.2s; }
.ironclad-footer a:hover { color: #60a5fa; }
.ironclad-footer-columns { display: grid; grid-template-columns: repeat(5, 1fr); gap: 32px; max-width: 1200px; margin: 0 auto; padding: 48px 20px 32px; }
.ironclad-footer-col h4 { color: #e2e8f0; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; margin: 0 0 16px 0; }
.ironclad-footer-col a { display: block; padding: 4px 0; font-size: 0.85rem; }
.ironclad-footer-payments { max-width: 1200px; margin: 0 auto; padding: 0 20px 24px; display: flex; gap: 24px; flex-wrap: wrap; align-items: center; }
.ironclad-footer-payments span { font-size: 0.8rem; }
.ironclad-footer-bottom { border-top: 1px solid #334155; max-width: 1200px; margin: 0 auto; padding: 20px 20px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; }
.ironclad-footer-locale { display: flex; align-items: center; gap: 8px; font-size: 0.8rem; color: #94a3b8; }
.ironclad-footer-locale svg { flex-shrink: 0; }
.ironclad-footer-locale-btn { background: none; border: 1px solid #334155; color: #94a3b8; padding: 4px 10px; border-radius: 4px; cursor: pointer; display: flex; align-items: center; gap: 6px; font-size: 0.8rem; transition: border-color 0.2s, color 0.2s; font-family: inherit; }
.ironclad-footer-locale-btn:hover { border-color: #60a5fa; color: #e2e8f0; }
.ironclad-footer-locale-btn.active { border-color: #60a5fa; color: #e2e8f0; }
.ironclad-footer-legal { display: flex; gap: 16px; flex-wrap: wrap; }
.ironclad-footer-legal a { color: #64748b; font-size: 0.8rem; }
.ironclad-footer-legal a:hover { color: #60a5fa; }
.ironclad-footer-copyright { width: 100%; text-align: center; color: #64748b; font-size: 0.8rem; padding-top: 16px; margin-top: 8px; border-top: 1px solid rgba(255,255,255,0.05); }
.ironclad-footer-principle { max-width: 1200px; margin: 0 auto; padding: 20px 20px 0; text-align: center; font-size: 0.8rem; line-height: 1.5; color: #8fbc8f; font-weight: 600; letter-spacing: 0.02em; }
.ironclad-footer-app { max-width: 1200px; margin: 0 auto; padding: 0 20px 24px; display: flex; align-items: center; gap: 16px; }
.ironclad-footer-app-badge { display: inline-flex; align-items: center; gap: 10px; background: #000; border: 1px solid #475569; border-radius: 8px; padding: 8px 16px 8px 12px; color: #fff; text-decoration: none !important; transition: border-color 0.2s, background 0.2s; }
.ironclad-footer-app-badge:hover { border-color: #60a5fa; background: #1a1a2e; color: #fff !important; }
.ironclad-footer-app-badge svg { flex-shrink: 0; }
.ironclad-footer-app-badge-text { display: flex; flex-direction: column; line-height: 1.2; }
.ironclad-footer-app-badge-text span:first-child { font-size: 0.6rem; color: #cbd5e1; letter-spacing: 0.02em; }
.ironclad-footer-app-badge-text span:last-child { font-size: 0.9rem; font-weight: 600; color: #fff; letter-spacing: -0.01em; }

@media (max-width: 900px) {
    .ironclad-footer-columns { grid-template-columns: repeat(2, 1fr); padding: 32px 16px 24px; gap: 24px; }
    .ironclad-footer-payments { padding: 0 16px 20px; }
    .ironclad-footer-app { padding: 0 16px 20px; }
    .ironclad-footer-bottom { padding: 16px 16px; flex-direction: column; align-items: flex-start; }
    .ironclad-footer-legal { gap: 12px; }
}
@media (max-width: 480px) {
    .ironclad-footer-columns { grid-template-columns: 1fr; gap: 20px; padding: 24px 16px 20px; }
}
`;

    const footerHTML = `
<!-- DWS10.com Iron Clad Footer v1.0 -->
<footer class="ironclad-footer">
    <div class="ironclad-footer-columns">
        <div class="ironclad-footer-col">
            <h4>Products</h4>
            <a href="/buy/">Platform &amp; Products</a>
            <a href="/buy/page2/">AI &amp; Cloud Consulting</a>
            <a href="/buy/page3/">Expert Advisory &amp; Training</a>
            <a href="/buy/page4/">Digital Services</a>
            <a href="https://dws10.com/contact/">Enterprise Offers</a>
        </div>
        <div class="ironclad-footer-col">
            <h4>Industries</h4>
            <a href="/construction/">Construction</a>
            <a href="/energy/">Energy</a>
            <a href="/manufacturing/">Manufacturing</a>
            <a href="/real-estate/">Real Estate</a>
            <a href="/logistics/">Logistics</a>
            <a href="/healthcare/">Healthcare</a>
            <a href="/financial-services/">Financial Services</a>
            <a href="/public-sector/">Public Sector</a>
        </div>
        <div class="ironclad-footer-col">
            <h4>Platform</h4>
            <a href="https://dws6.com/login">Login</a>
            <a href="https://dws6.com/dashboard/">Dashboard</a>
            <a href="/products/dwsiq.html">DWS IQ 6</a>
            <a href="/products/firehorse-reports.html">Firehorse Reports</a>
            <a href="/products/firehorse-amplify.html">Firehorse Amplify</a>
            <a href="/products/firehorse-omnichannel.html">Firehorse Omnichannel</a>
            <a href="/architecture/">Architecture</a>
        </div>
        <div class="ironclad-footer-col">
            <h4>Compliance</h4>
            <a href="/fit-for-55/">Fit for 55</a>
            <a href="/csrd/">CSRD Reporting</a>
            <a href="/compliance/">EU AI Act</a>
            <a href="/regulatory-notice/">Regulatory Notice</a>
            <a href="/dual-use/">Dual Use</a>
            <a href="/calculator/">Carbon Calculator</a>
        </div>
        <div class="ironclad-footer-col">
            <h4>Help &amp; Company</h4>
            <a href="/lifetime-consulting/">Lifetime Consulting</a>
            <a href="/careers/">Careers</a>
            <a href="/partners/">Partners</a>
            <a href="/investor-relations/">Investor Relations</a>
            <a href="https://onelifetime.world">Community</a>
            <a href="https://dws10.com/contact/">Support</a>
            <a href="https://dws10.com/contact/">Sales</a>
            <a href="/legal/">Legal Hub</a>
        </div>
    </div>
    <div class="ironclad-footer-payments">
        <span style="color: #64748b;">Accepted payments:</span>
        <span style="color: #0075EB; font-weight: 600;">Revolut Business</span>
        <span style="color: #003087; font-weight: 600;">PayPal Business</span>
        <span style="color: #4ade80; font-weight: 600;">SEPA EUR</span>
        <span style="color: #64748b;">Bank Transfer</span>
    </div>
    <div class="ironclad-footer-app">
        <a href="https://play.google.com/store/apps/details?id=com.dws6.firehorse" target="_blank" rel="noopener noreferrer" class="ironclad-footer-app-badge" aria-label="Get Firehorse Mobile on Google Play">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
                <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92z" fill="#4285F4"/>
                <path d="M17.556 8.237L5.178.807a1.005 1.005 0 0 0-1.07.063l9.684 9.684 3.764-2.317z" fill="#34A853"/>
                <path d="M17.556 15.763l-3.764-2.317-9.684 9.684c.327.232.746.275 1.07.063l12.378-7.43z" fill="#EA4335"/>
                <path d="M21.39 12c0-.387-.178-.742-.477-.96l-3.357-2.803-4.148 3.763 4.148 3.763 3.357-2.803c.3-.218.477-.573.477-.96z" fill="#FBBC04"/>
            </svg>
            <div class="ironclad-footer-app-badge-text">
                <span>GET IT ON</span>
                <span>Google Play</span>
            </div>
        </a>
    </div>
    <div class="ironclad-footer-principle">
        We value ethics in everything we do &mdash; DWS products augment people, never replacing junior talent or the human-in-command.
    </div>
    <div class="ironclad-footer-bottom">
        <div class="ironclad-footer-legal">
            <a href="/terms/">Website Terms</a>
            <a href="https://dws10.com/privacy-policy/">Privacy Policy</a>
            <a href="/return-policy/">Return Policy</a>
            <a href="/data-handling-policy/">Data Handling</a>
            <a href="/data-security-policy/">Data Security</a>
            <a href="/investment-safety/">Investment Safety</a>
            <a href="/regulatory-notice/">Regulatory Notice</a>
        </div>
        <div class="ironclad-footer-copyright">
            DWS IQ Aegis &mdash; Sovereign AI for EU defence supply chains &middot; Lifetime Oy (Y-tunnus 0772407-9) &middot; 100&nbsp;% Finnish owned limited company<br>&copy; 2026 Lifetime Oy &middot; VAT FI07724079 &middot; GDPR &middot; DSA &middot; NIS2 &middot; EU AI Act
        </div>
    </div>
</footer>
`;

    function init() {
        // Inject CSS
        var style = document.createElement('style');
        style.textContent = footerCSS;
        document.head.appendChild(style);

        // Remove any existing footer
        var oldFooters = document.querySelectorAll('footer, div.footer');
        oldFooters.forEach(function(el) { el.remove(); });

        // Inject footer HTML before </body>
        var wrapper = document.createElement('div');
        wrapper.innerHTML = footerHTML.trim();
        var footerEl = wrapper.firstElementChild;
        document.body.appendChild(footerEl);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
