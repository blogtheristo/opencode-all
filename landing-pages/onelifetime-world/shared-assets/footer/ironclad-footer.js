/**
 * DWS10.com Iron Clad Footer v1.0
 * Unified footer for all pages (matches store page footer design)
 *
 * Usage: Add this script to any page:
 * <script src="/shared-assets/footer/ironclad-footer.js"></script>
 *
 * v1.4 — 2026-06-21: Add newsletter capture band (writes to Supabase web_leads).
 * v1.3 — 2026-05-31: Add ethics principle band (human-in-command).
 * v1.2 — 2026-04-06: Nordic Industrial rebrand — "Built in Finland" badge, IBM Plex Sans font
 * v1.1 — 2026-03-15: Add Firehorse Mobile Google Play badge
 * v1.0 — Initial release: 5-column links, payment methods, legal bar, locale buttons
 *
 * The script will automatically inject the footer before </body>,
 * replacing any existing <footer> or <div class="footer"> element.
 */

(function () {
  'use strict';

  const hostname = window.location.hostname;
  const onDws10 = hostname === 'dws10.com' || hostname === 'www.dws10.com';
  // Footer pages physically live on dws10.com. When this footer is embedded on
  // lifetime.fi / onelifetime.world, root-relative paths would 404, so resolve
  // them against dws10.com instead. On dws10.com itself contentBase is empty,
  // leaving the existing same-origin links untouched.
  const contentBase = onDws10 ? '' : 'https://dws10.com';
  const regulatoryNoticeHref = onDws10 ? '/regulatory-notice/' : 'https://dws10.com/legal/';
  const privacyPolicyHref = onDws10 ? '/privacy-policy/' : 'https://dws10.com/privacy-policy/';

  // Newsletter capture — writes inbound leads to the shared Supabase web_leads
  // table via the public anon key (same pattern as the /captain/ inquiry form).
  // The key is a publishable anon key (RLS-protected), safe to ship client-side.
  const SUPABASE_URL = 'https://kpucuwwfhuwurdxyjjtz.supabase.co';
  const SUPABASE_ANON_KEY = 'sb_publishable_mZtEHU2k4WolHxePGF6g3w_tdkMCWRh';

  const footerCSS = `
/* === DWS10.com Iron Clad Footer v1.3 === */
.ironclad-footer { background: #1e293b; border-top: 1px solid #334155; color: #94a3b8; font-size: 0.875rem; font-family: 'IBM Plex Sans', system-ui, -apple-system, sans-serif; }
.ironclad-footer-finland { max-width: 1200px; margin: 0 auto; padding: 16px 20px 0; display: flex; align-items: center; gap: 8px; font-size: 0.8rem; color: #8fbc8f; font-weight: 600; letter-spacing: 0.02em; }
.ironclad-footer-finland svg { flex-shrink: 0; }
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
    .ironclad-footer-bottom { padding: 16px 16px; flex-direction: column; align-items: flex-start; }
    .ironclad-footer-legal { gap: 12px; }
}
@media (max-width: 480px) {
    .ironclad-footer-columns { grid-template-columns: 1fr; gap: 20px; padding: 24px 16px 20px; }
}
.ironclad-footer-news { max-width: 1200px; margin: 0 auto; padding: 28px 20px 4px; border-bottom: 1px solid #334155; display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 16px; }
.ironclad-footer-news-copy { max-width: 460px; }
.ironclad-footer-news-copy h4 { color: #e2e8f0; font-size: 1rem; font-weight: 700; margin: 0 0 4px 0; }
.ironclad-footer-news-copy p { margin: 0; font-size: 0.85rem; color: #94a3b8; line-height: 1.4; }
.ironclad-footer-news-copy a { color: #60a5fa; }
.ironclad-footer-news-form { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; }
.ironclad-footer-news-form input[type=email] { background: #0f172a; border: 1px solid #334155; color: #e2e8f0; padding: 10px 14px; border-radius: 6px; font-size: 0.875rem; font-family: inherit; min-width: 240px; }
.ironclad-footer-news-form input[type=email]:focus { outline: none; border-color: #60a5fa; }
.ironclad-footer-news-form button { background: #2563eb; border: none; color: #fff; padding: 10px 20px; border-radius: 6px; font-size: 0.875rem; font-weight: 600; cursor: pointer; font-family: inherit; transition: background 0.2s; }
.ironclad-footer-news-form button:hover { background: #1d4ed8; }
.ironclad-footer-news-form button:disabled { opacity: 0.6; cursor: default; }
.ironclad-footer-news-msg { width: 100%; font-size: 0.8rem; margin: 8px 0 0; min-height: 1em; }
.ironclad-footer-news-msg.ok { color: #4ade80; }
.ironclad-footer-news-msg.err { color: #f87171; }
@media (max-width: 600px) { .ironclad-footer-news-form input[type=email] { min-width: 0; flex: 1; } }
`;

  const footerHTML = `
<!-- DWS10.com Iron Clad Footer v1.2 — Nordic Industrial -->
<footer class="ironclad-footer">
    <div class="ironclad-footer-finland">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="14" viewBox="0 0 20 14" aria-hidden="true"><rect width="20" height="14" fill="#fff"/><rect y="5" width="20" height="4" fill="#003580"/><rect x="6" width="4" height="14" fill="#003580"/></svg>
        Built in Finland &middot; EU Sovereign AI &middot; Finnish Jurisdiction
    </div>
    <div class="ironclad-footer-news">
        <div class="ironclad-footer-news-copy">
            <h4>Stay ahead of EU regulation</h4>
            <p>Get the signal on CSRD, CBAM, EU ETS and the EU AI Act &mdash; what changes, when, and what to do about it. No spam.</p>
            <p style="margin-top:6px;font-size:0.75rem;color:#64748b;">By subscribing you consent to receiving email from Lifetime Oy. Unsubscribe anytime. See our <a href="${privacyPolicyHref}">Privacy Policy</a>.</p>
        </div>
        <form class="ironclad-footer-news-form" id="ironclad-news-form" novalidate>
            <input type="email" name="email" placeholder="you@company.com" aria-label="Email address" required>
            <button type="submit">Subscribe</button>
            <p class="ironclad-footer-news-msg" id="ironclad-news-msg" role="status" aria-live="polite"></p>
        </form>
    </div>
    <div class="ironclad-footer-columns">
        <div class="ironclad-footer-col">
            <h4>Products</h4>
            <a href="${contentBase}/buy/">Platform &amp; Products</a>
            <a href="${contentBase}/buy/page2/">AI &amp; Cloud Consulting</a>
            <a href="${contentBase}/buy/page3/">Expert Advisory &amp; Training</a>
            <a href="${contentBase}/buy/page4/">Digital Services</a>
            <a href="mailto:offer@lifetime.fi">Enterprise Offers</a>
        </div>
        <div class="ironclad-footer-col">
            <h4>Dual Use Industries</h4>
            <a href="${contentBase}/dual-use-industries/" style="color: #d4a843;">All Industries &amp; Aegis</a>
            <a href="${contentBase}/construction/">Construction</a>
            <a href="${contentBase}/energy/">Energy</a>
            <a href="${contentBase}/manufacturing/">Manufacturing</a>
            <a href="${contentBase}/real-estate/">Real Estate</a>
            <a href="${contentBase}/logistics/">Logistics</a>
            <a href="${contentBase}/healthcare/">Healthcare</a>
            <a href="${contentBase}/financial-services/">Financial Services</a>
            <a href="${contentBase}/public-sector/">Public Sector</a>
        </div>
        <div class="ironclad-footer-col">
            <h4>Platform</h4>
            <a href="https://dws6.com/login">Login</a>
            <a href="https://dws6.com/dashboard/">Dashboard</a>
            <a href="${contentBase}/products/dwsiq.html">DWS IQ 6</a>
            <a href="${contentBase}/products/firehorse-reports.html">Firehorse Reports</a>
            <a href="${contentBase}/products/firehorse-amplify.html">Firehorse Amplify</a>
            <a href="${contentBase}/products/firehorse-omnichannel.html">Firehorse Omnichannel</a>
            <a href="${contentBase}/architecture/">Architecture</a>
        </div>
        <div class="ironclad-footer-col">
            <h4>Compliance</h4>
            <a href="${contentBase}/fit-for-55/">Fit for 55</a>
            <a href="${contentBase}/csrd/">CSRD Reporting</a>
            <a href="${contentBase}/compliance/">EU AI Act</a>
            <a href="${regulatoryNoticeHref}">Regulatory Notice</a>
            <a href="${contentBase}/dual-use/">Dual Use</a>
            <a href="${contentBase}/calculator/">Carbon Calculator</a>
        </div>
        <div class="ironclad-footer-col">
            <h4>Help &amp; Company</h4>
            <a href="${contentBase}/lifetime-consulting/">Lifetime Consulting</a>
            <a href="${contentBase}/careers/">Careers</a>
            <a href="${contentBase}/partners/">Partners</a>
            <a href="${contentBase}/investor-relations/">Investor Relations</a>
            <a href="https://onelifetime.world">Community</a>
            <a href="https://onelifetime.world/blog/">LSJ Business Blog</a>
            <a href="mailto:support@lifetime.fi">Support</a>
            <a href="mailto:sales@lifetime.fi">Sales</a>
            <a href="${contentBase}/legal/">Legal Hub</a>
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
            <a href="${contentBase}/legal/">Legal Hub</a>
            <a href="${privacyPolicyHref}">Privacy Policy</a>
            <a href="${contentBase}/return-policy/">Return Policy</a>
            <a href="${contentBase}/data-handling-policy/">Data Handling</a>
            <a href="${contentBase}/data-security-policy/">Data Security</a>
            <a href="${contentBase}/investment-safety/">Investment Safety</a>
            <a href="${regulatoryNoticeHref}">Regulatory Notice</a>
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
    oldFooters.forEach(function (el) {
      el.remove();
    });

    // Inject footer HTML before </body>
    var wrapper = document.createElement('div');
    wrapper.innerHTML = footerHTML.trim();
    var footerEl = wrapper.firstElementChild;
    document.body.appendChild(footerEl);

    wireNewsletter();
  }

  function wireNewsletter() {
    var form = document.getElementById('ironclad-news-form');
    var msg = document.getElementById('ironclad-news-msg');
    if (!form || !msg) return;
    var input = form.querySelector('input[type=email]');
    var button = form.querySelector('button');

    function setMsg(text, kind) {
      msg.textContent = text;
      msg.className = 'ironclad-footer-news-msg' + (kind ? ' ' + kind : '');
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var email = (input.value || '').trim();
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
        setMsg('Please enter a valid email address.', 'err');
        input.focus();
        return;
      }
      button.disabled = true;
      setMsg('Subscribing…', '');

      fetch(SUPABASE_URL + '/rest/v1/web_leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: SUPABASE_ANON_KEY,
          Authorization: 'Bearer ' + SUPABASE_ANON_KEY,
          Prefer: 'return=minimal',
        },
        body: JSON.stringify({
          source: 'newsletter',
          email: email,
          site: window.location.hostname,
          page_path: window.location.pathname,
          locale: document.documentElement.lang || null,
          consent: true,
          metadata: { referrer: document.referrer || null },
        }),
      })
        .then(function (res) {
          if (res.ok) {
            setMsg('Thanks — you’re on the list.', 'ok');
            form.reset();
          } else if (res.status === 409) {
            // Unique index on newsletter email — already subscribed.
            setMsg('You’re already subscribed — thank you.', 'ok');
            form.reset();
          } else {
            // Fail loud: surface the real status for debugging, friendly text for users.
            console.error(
              '[ironclad-footer] newsletter signup failed:',
              res.status,
              res.statusText,
            );
            setMsg('Something went wrong. Please email sales@lifetime.fi.', 'err');
            button.disabled = false;
          }
        })
        .catch(function (err) {
          console.error('[ironclad-footer] newsletter signup error:', err);
          setMsg('Network error. Please email sales@lifetime.fi.', 'err');
          button.disabled = false;
        });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
