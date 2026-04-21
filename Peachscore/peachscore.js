/**
 * Peachscore Accelerator — Cap Table & Financials Widget
 *
 * Renders two components:
 *   1. Peachscore score widget (iframe from app.peachscore.com)
 *   2. Financials summary panel: raised, valuation, MRR, runway, ownership
 *
 * Usage (browser):
 *   <script src="/Peachscore/peachscore.js"></script>
 *   <div id="peachscore-widget"></div>
 *   <div id="peachscore-financials"></div>
 *
 * Usage (server-side data fetch):
 *   const { fetchFinancials } = require('./Peachscore/peachscore.js');
 *   const snapshot = await fetchFinancials('/api/investor-reports/cap-table/financials');
 */

'use strict';

// ============================================================================
// SCORE WIDGET (iframe)
// ============================================================================

const PEACHSCORE_WIDGET_SRC =
  'https://app.peachscore.com/widget/score?size=240&fontSize=38&units=pts&score=448&grade=Progressing&lastUpdated=10-12-2025&url=https%3A%2F%2Fapp.peachscore.com%2Fcompany%2Flifetime-oy';

/**
 * Inject the Peachscore score widget iframe into a target element.
 * @param {string|HTMLElement} target  CSS selector or DOM element
 */
function renderScoreWidget(target) {
  const el =
    typeof target === 'string' ? document.querySelector(target) : target;
  if (!el) return;

  const iframe = document.createElement('iframe');
  iframe.src = PEACHSCORE_WIDGET_SRC;
  iframe.style.border = 'none';
  iframe.style.width = '240px';
  iframe.style.height = '240px';
  iframe.title = 'Peachscore Score Widget';
  el.appendChild(iframe);
}

// ============================================================================
// FINANCIALS SUMMARY PANEL
// ============================================================================

/**
 * Fetch the financials snapshot from the backend API.
 * @param {string} [apiBase='']  Base URL for the API (empty = same origin)
 * @returns {Promise<object>}    FinancialsSnapshot object
 */
async function fetchFinancials(apiBase = '') {
  const resp = await fetch(`${apiBase}/api/investor-reports/cap-table/financials`);
  if (!resp.ok) throw new Error(`Financials fetch failed: ${resp.status}`);
  const json = await resp.json();
  return json.data;
}

/**
 * Format a number as EUR currency string.
 * @param {number} amount
 * @returns {string}
 */
function fmtEur(amount) {
  if (amount >= 1_000_000)
    return `€${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000)
    return `€${(amount / 1_000).toFixed(1).replace(/\.0$/, '')}k`;
  return `€${amount.toLocaleString()}`;
}

/**
 * Render the financials summary panel inside a target element.
 * Falls back to an error message if the API is unavailable.
 * @param {string|HTMLElement} target
 * @param {string} [apiBase='']
 */
async function renderFinancials(target, apiBase = '') {
  const el =
    typeof target === 'string' ? document.querySelector(target) : target;
  if (!el) return;

  try {
    const snap = await fetchFinancials(apiBase);
    el.innerHTML = buildFinancialsHTML(snap);
  } catch (err) {
    el.innerHTML = `<p style="color:#888;font-size:13px">Financials unavailable: ${err.message}</p>`;
  }
}

/**
 * Build the financials summary HTML string from a snapshot object.
 * @param {object} snap  FinancialsSnapshot
 * @returns {string}     HTML markup
 */
function buildFinancialsHTML(snap) {
  const rows = [
    ['Total Raised',       fmtEur(snap.total_raised_eur || 0)],
    ['Valuation',          fmtEur(snap.current_valuation_eur || 0)],
    ['MRR',               fmtEur(snap.mrr_eur || 0)],
    ['ARR',               fmtEur(snap.arr_eur || 0)],
    ['Cash Balance',       fmtEur(snap.cash_balance_eur || 0)],
    ['Runway',            `${snap.runway_months || 0} months`],
    ['Founder Equity',    `${snap.founder_ownership_pct || 0}%`],
    ['Investor Equity',   `${snap.investor_ownership_pct || 0}%`],
    ['Option Pool',       `${snap.option_pool_pct || 0}%`],
  ];

  const rowsHTML = rows
    .map(
      ([label, value]) =>
        `<tr>
          <td style="padding:4px 12px 4px 0;color:#666;font-size:13px">${label}</td>
          <td style="padding:4px 0;font-weight:600;font-size:13px">${value}</td>
        </tr>`,
    )
    .join('');

  return `
    <div style="font-family:sans-serif;max-width:280px">
      <p style="margin:0 0 8px;font-size:11px;color:#999;text-transform:uppercase;letter-spacing:.05em">
        As of ${snap.as_of_date || 'today'}
        ${snap.last_round_type ? ` · Last round: ${snap.last_round_type.replace(/_/g, ' ')}` : ''}
      </p>
      <table style="border-collapse:collapse;width:100%">
        <tbody>${rowsHTML}</tbody>
      </table>
    </div>`;
}

// ============================================================================
// AUTO-INIT (browser)
// ============================================================================

if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    renderScoreWidget('#peachscore-widget');
    renderFinancials('#peachscore-financials');
  });
}

// ============================================================================
// EXPORTS (Node / CommonJS)
// ============================================================================

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    fetchFinancials,
    buildFinancialsHTML,
    renderScoreWidget,
    renderFinancials,
    PEACHSCORE_WIDGET_SRC,
  };
}
  