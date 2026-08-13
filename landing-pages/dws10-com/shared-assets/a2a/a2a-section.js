/**
 * DWS10.com A2A Agent Integration Section v1.0
 * Google A2A Protocol (Agent-to-Agent) connection section for industrial pages
 *
 * Usage: Add this script to any industrial/partner page:
 * <script src="/shared-assets/a2a/a2a-section.js"></script>
 *
 * v1.0 — Initial release: 3 capability cards, Bring Your Own Agent CTA, protocol badges
 *
 * The script injects the A2A section before the ironclad footer (or before </body>).
 * It does NOT replace any existing content — it adds a new section.
 *
 * References:
 * - A2A Protocol: https://a2a-protocol.org/
 * - A2A Python SDK: https://github.com/a2aproject/a2a-python
 * - A2A Inspector: https://github.com/a2aproject/a2a-inspector
 * - A2A Samples: https://github.com/a2aproject/a2a-samples
 */

(function() {
    'use strict';

    // Detect industry from URL path for personalized mailto subject
    var path = window.location.pathname || '';
    var industry = path.split('/').filter(Boolean)[0] || 'General';
    industry = industry.replace(/-/g, ' ').replace(/\b\w/g, function(c) { return c.toUpperCase(); });

    var a2aCSS = '\
/* === DWS10.com A2A Section v1.0 === */\n\
.a2a-section { background: linear-gradient(135deg, #0f172a 0%, #1a1a2e 100%); padding: 80px 20px; border-top: 1px solid #334155; }\n\
.a2a-container { max-width: 1100px; margin: 0 auto; text-align: center; }\n\
.a2a-title { font-size: clamp(1.5rem, 3vw, 2.25rem); font-weight: 700; color: #e2e8f0; margin: 0 0 12px 0; font-family: system-ui, -apple-system, sans-serif; }\n\
.a2a-subtitle { color: #94a3b8; font-size: 1rem; max-width: 700px; margin: 0 auto 40px; line-height: 1.6; font-family: system-ui, -apple-system, sans-serif; }\n\
.a2a-capabilities { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; margin-bottom: 40px; }\n\
.a2a-card { background: rgba(30, 41, 59, 0.7); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 12px; padding: 32px 24px; text-align: left; transition: border-color 0.3s, transform 0.3s; }\n\
.a2a-card:hover { border-color: rgba(96, 165, 250, 0.3); transform: translateY(-2px); }\n\
.a2a-card h3 { color: #e2e8f0; font-size: 1.1rem; margin: 12px 0 8px; font-family: system-ui, -apple-system, sans-serif; }\n\
.a2a-card p { color: #94a3b8; font-size: 0.9rem; line-height: 1.5; margin: 0; font-family: system-ui, -apple-system, sans-serif; }\n\
.a2a-icon { font-size: 1.5rem; }\n\
.a2a-cta { display: flex; justify-content: center; gap: 16px; margin-bottom: 24px; flex-wrap: wrap; }\n\
.a2a-cta .a2a-btn-primary { background: linear-gradient(135deg, #2563eb, #1d4ed8); color: #ffffff; padding: 14px 32px; border-radius: 8px; font-weight: 700; font-size: 1rem; text-decoration: none; transition: all 0.3s; border: none; display: inline-block; font-family: system-ui, -apple-system, sans-serif; }\n\
.a2a-cta .a2a-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(37, 99, 235, 0.4); }\n\
.a2a-cta .a2a-btn-secondary { background: transparent; color: #60a5fa; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 1rem; text-decoration: none; border: 1px solid rgba(96, 165, 250, 0.3); transition: all 0.3s; display: inline-block; font-family: system-ui, -apple-system, sans-serif; }\n\
.a2a-cta .a2a-btn-secondary:hover { background: rgba(96, 165, 250, 0.1); border-color: #60a5fa; }\n\
.a2a-protocols { display: flex; justify-content: center; gap: 12px; flex-wrap: wrap; margin-bottom: 16px; }\n\
.a2a-protocol { display: inline-block; padding: 4px 12px; border-radius: 6px; font-size: 0.75rem; font-weight: 600; color: #60a5fa; background: rgba(37, 99, 235, 0.1); border: 1px solid rgba(37, 99, 235, 0.2); font-family: system-ui, -apple-system, sans-serif; }\n\
.a2a-agent-card-info { color: #64748b; font-size: 0.8rem; font-family: monospace; margin-top: 8px; }\n\
.a2a-agent-card-info code { color: #94a3b8; background: rgba(30, 41, 59, 0.5); padding: 2px 8px; border-radius: 4px; }\n\
@media (max-width: 768px) { .a2a-capabilities { grid-template-columns: 1fr; } .a2a-section { padding: 48px 16px; } }\n\
';

    var a2aHTML = '\
<section class="a2a-section">\n\
    <div class="a2a-container">\n\
        <h2 class="a2a-title">Connect Your AI Agent</h2>\n\
        <p class="a2a-subtitle">\n\
            DWS IQ Platform supports the <strong style="color:#e2e8f0">Google A2A Protocol</strong> (Agent-to-Agent).\n\
            Your AI agents discover our capabilities via Agent Card, send Tasks,\n\
            and receive compliance scores, Firehorse reports, and carbon calculations &mdash; autonomously.\n\
        </p>\n\
        <div class="a2a-capabilities">\n\
            <div class="a2a-card">\n\
                <div class="a2a-icon">&#x1F4CA;</div>\n\
                <h3>Compliance Calculation</h3>\n\
                <p>Your agent sends emissions data as a Task &rarr; DWS IQ returns Fit&nbsp;for&nbsp;55, CSRD, and ETS compliance scores as Artifacts.</p>\n\
            </div>\n\
            <div class="a2a-card">\n\
                <div class="a2a-icon">&#x1F4CB;</div>\n\
                <h3>Firehorse Reports</h3>\n\
                <p>Your agent triggers a report Task &rarr; Firehorse generates audit-ready PDF/Excel reports delivered as downloadable Artifacts.</p>\n\
            </div>\n\
            <div class="a2a-card">\n\
                <div class="a2a-icon">&#x1F916;</div>\n\
                <h3>Multi-Agent Orchestration</h3>\n\
                <p>Your agents discover DWS&nbsp;IQ skills via Agent&nbsp;Card. Multi-turn conversations enable complex cross-company ESG workflows.</p>\n\
            </div>\n\
        </div>\n\
        <div class="a2a-cta">\n\
            <a href="https://dws10.com/contact/" class="a2a-btn-primary">\n\
                Bring Your Own Agent\n\
            </a>\n\
            <a href="/architecture/" class="a2a-btn-secondary">View A2A Architecture</a>\n\
        </div>\n\
        <div class="a2a-protocols">\n\
            <span class="a2a-protocol">A2A Protocol v0.3</span>\n\
            <span class="a2a-protocol">MCP</span>\n\
            <span class="a2a-protocol">JSON-RPC</span>\n\
            <span class="a2a-protocol">gRPC</span>\n\
            <span class="a2a-protocol">REST</span>\n\
        </div>\n\
        <div class="a2a-agent-card-info">\n\
            Agent Card: <code>https://api.dws10.com/.well-known/agent.json</code>\n\
        </div>\n\
    </div>\n\
</section>\n\
';

    function init() {
        // Inject CSS
        var style = document.createElement('style');
        style.textContent = a2aCSS;
        document.head.appendChild(style);

        // Don't add if already present
        if (document.querySelector('.a2a-section')) return;

        // Create A2A section element
        var wrapper = document.createElement('div');
        wrapper.innerHTML = a2aHTML.trim();
        var sectionEl = wrapper.firstElementChild;

        // Insert before ironclad footer, or before </body>
        var footer = document.querySelector('.ironclad-footer');
        if (footer) {
            footer.parentNode.insertBefore(sectionEl, footer);
        } else {
            document.body.appendChild(sectionEl);
        }

        console.log('A2A Agent Integration Section v1.0 loaded for industry: ' + industry);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
