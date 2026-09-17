// --- state.js ---
window.DWS = window.DWS || {};
const state = {
  apiBase: 'https://api.dwsiq.example.com',
  token: localStorage.getItem('dws_token') || null,
  cacheTtlMs: { portfolio: 300000, alerts: 120000, projects: 600000 },
  websocket: null,
  lastFetch: {},
  isOnline: navigator.onLine
};
function setToken(token) {
  state.token = token;
  if (token) localStorage.setItem('dws_token', token);
  else localStorage.removeItem('dws_token');
  window.dispatchEvent(new CustomEvent('auth:change', { detail: { token } }));
}
function setOnline(isOnline) {
  state.isOnline = isOnline;
  window.dispatchEvent(new CustomEvent('net:online', { detail: { isOnline } }));
}
window.addEventListener('online', () => setOnline(true));
window.addEventListener('offline', () => setOnline(false));
window.DWS.state = state;
window.DWS.setToken = setToken;
window.DWS.setOnline = setOnline;

// --- auth.js ---
(function () {
  const { state, setToken } = window.DWS;
  function authHeader() {
    return state.token ? { Authorization: `Bearer ${state.token}` } : {};
  }
  function beginLogin() {
    const token = window.prompt('Enter bearer token (dev only):');
    if (token) setToken(token);
  }
  function handleCallback() { if (window.DWS?.log) window.DWS.log.info('Auth callback triggered (Supabase/OIDC ready)'); }
  function logout() { setToken(null); }
  window.DWS.auth = { authHeader, beginLogin, handleCallback, logout };
})();

// --- utils/log.js ---
(function () {
  const enabled = true;
  const levels = ['debug', 'info', 'warn', 'error'];
  const log = {};
  levels.forEach((lvl) => {
    log[lvl] = (...args) => {
      if (!enabled) return;
      const ts = new Date().toISOString();
      console[lvl] ? console[lvl](`[${ts}] [${lvl.toUpperCase()}]`, ...args)
                   : console.log(`[${ts}] [${lvl.toUpperCase()}]`, ...args);
    };
  });
  window.DWS.log = log;
})();

// --- cache.js ---
(function () {
  const CACHE_PREFIX = 'dws_cache:';
  function setCached(key, data, ttlMs) {
    const payload = { data, ts: Date.now(), ttlMs: ttlMs || 0 };
    localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(payload));
  }
  function getCached(key) {
    const raw = localStorage.getItem(CACHE_PREFIX + key);
    if (!raw) return { data: null, stale: true };
    try {
      const parsed = JSON.parse(raw);
      const age = Date.now() - parsed.ts;
      const stale = parsed.ttlMs ? age > parsed.ttlMs : false;
      return { data: parsed.data, stale };
    } catch (e) {
      return { data: null, stale: true };
    }
  }
  async function swr(key, fetcher, ttlMs) {
    const cached = getCached(key);
    if (cached.data) {
      window.dispatchEvent(new CustomEvent('cache:update', { detail: { key, data: cached.data, stale: cached.stale } }));
    }
    try {
      const fresh = await fetcher();
      setCached(key, fresh, ttlMs);
      window.dispatchEvent(new CustomEvent('cache:update', { detail: { key, data: fresh, stale: false } }));
      return { data: fresh, stale: false };
    } catch (err) {
      return { data: cached.data, stale: true, error: err };
    }
  }
  window.DWS.cache = { setCached, getCached, swr };
})();

// --- api-client.js ---
(function () {
  const { state } = window.DWS;
  const { authHeader } = window.DWS.auth;
  const { log } = window.DWS;
  function sleep(ms) { return new Promise((res) => setTimeout(res, ms)); }
  function shouldRetry(status) { return status === 429 || (status >= 500 && status < 600); }
  async function backoffRetry(status, retriesLeft) {
    const base = 500;
    const jitter = Math.random() * 300;
    const delay = Math.min(30000, base * Math.pow(2, retriesLeft) + jitter);
    log?.warn?.(`Retrying after ${status}, waiting ${Math.round(delay)}ms`);
    await sleep(delay);
  }
  async function request(path, { method = 'GET', body, headers = {}, timeoutMs = 8000, retries = 1 } = {}) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeoutMs);
    const url = `${state.apiBase}${path}`;
    const finalHeaders = { 'Content-Type': 'application/json', ...authHeader(), ...headers };
    try {
      const res = await fetch(url, { method, headers: finalHeaders, body: body ? JSON.stringify(body) : undefined, signal: controller.signal });
      clearTimeout(id);
      const rate = {
        limit: res.headers.get('X-RateLimit-Limit'),
        remaining: res.headers.get('X-RateLimit-Remaining'),
        reset: res.headers.get('X-RateLimit-Reset'),
        retryAfter: res.headers.get('Retry-After')
      };
      const text = await res.text();
      let data = null;
      try { data = text ? JSON.parse(text) : null; } catch (_) { data = text; }
      if (!res.ok) {
        const errPayload = data && data.error ? data.error : {};
        const err = {
          code: errPayload.code || `HTTP_${res.status}`,
          message: errPayload.message || res.statusText,
          status: res.status,
          traceId: errPayload.traceId,
          rate
        };
        if (shouldRetry(res.status) && retries > 0) {
          await backoffRetry(res.status, retries);
          return request(path, { method, body, headers, timeoutMs, retries: retries - 1 });
        }
        throw err;
      }
      return { data, status: res.status, headers: res.headers, rate };
    } catch (err) {
      clearTimeout(id);
      if (err.name === 'AbortError') {
        throw { code: 'ERR_TIMEOUT', message: `Request timed out after ${timeoutMs}ms`, status: 0 };
      }
      throw err;
    }
  }
  window.DWS.apiClient = { request };
})();

// --- api-endpoints.js ---
(function () {
  const { request } = window.DWS.apiClient;
  function toQuery(params) {
    const esc = encodeURIComponent;
    const entries = Object.entries(params).filter(([, v]) => v !== undefined && v !== null);
    if (!entries.length) return '';
    return '?' + entries.map(([k, v]) => `${esc(k)}=${esc(v)}`).join('&');
  }
  const endpoints = {
    getPortfolioSummary: (params = {}) => request('/portfolio/summary' + toQuery(params)),
    getProjects: (params = {}) => request('/projects' + toQuery(params)),
    getProjectKpis: (id) => request(`/projects/${id}/kpis`),
    getCriticalPath: (id) => request(`/projects/${id}/schedule/critical`),
    getSafety: (id) => request(`/projects/${id}/safety`),
    getQuality: (id) => request(`/projects/${id}/quality`),
    getResources: (id) => request(`/projects/${id}/resources`),
    getCashflow: (id) => request(`/projects/${id}/cashflow`),
    getAlerts: (params = {}) => request('/alerts' + toQuery(params)),
    ackAlerts: (alertIds) => request('/alerts', { method: 'POST', body: { alertIds } })
  };
  window.DWS.api = endpoints;
})();

// --- router.js ---
(function () {
  const listeners = [];
  let guard = null;
  function currentPath() { return window.location.hash.replace('#', '') || '/dashboard'; }
  function navigate(path) { if (!path.startsWith('#')) path = '#' + path; window.location.hash = path; }
  async function handleRouteChange() {
    const path = currentPath();
    if (guard) {
      const allowed = await guard(path);
      if (allowed === false) return;
    }
    listeners.forEach((cb) => cb(path));
    highlightNav(path);
  }
  function onRouteChange(cb) { listeners.push(cb); }
  function beforeEach(fn) { guard = fn; }
  function highlightNav(path) {
    const route = path.replace(/^\//, '');
    document.querySelectorAll('.nav-btn').forEach((btn) => {
      const target = btn.dataset.route || btn.dataset.page || '';
      const active = target.includes(route);
      btn.classList.toggle('text-blue-600', active);
      btn.classList.toggle('text-gray-400', !active);
    });
  }
  window.addEventListener('hashchange', handleRouteChange);
  window.addEventListener('DOMContentLoaded', handleRouteChange);
  window.DWS.router = { navigate, onRouteChange, beforeEach };
})();

// --- realtime.js ---
(function () {
  const { state } = window.DWS;
  const { log } = window.DWS;
  let ws = null;
  let reconnectDelay = 1000; // start 1s
  function connect() {
    if (!state.token) {
      log?.info?.('WS skipped: no token');
      return;
    }
    const url = `wss://api.dwsiq.example.com/stream?token=${encodeURIComponent(state.token)}`;
    ws = new WebSocket(url);
    state.websocket = ws;
    ws.onopen = () => {
      log?.info?.('WS connected');
      reconnectDelay = 1000;
      window.dispatchEvent(new CustomEvent('ws:status', { detail: { status: 'open' } }));
    };
    ws.onmessage = (evt) => {
      try {
        const msg = JSON.parse(evt.data);
        if (msg.type) {
          window.dispatchEvent(new CustomEvent(msg.type, { detail: msg.payload }));
        }
      } catch (e) {
        log?.warn?.('WS parse error', e);
      }
    };
    ws.onclose = () => scheduleReconnect('close');
    ws.onerror = () => scheduleReconnect('error');
  }
  function scheduleReconnect(reason) {
    window.dispatchEvent(new CustomEvent('ws:status', { detail: { status: 'reconnecting', reason } }));
    reconnectDelay = Math.min(30000, reconnectDelay * 2 + Math.random() * 500);
    log?.warn?.(`WS reconnect in ${Math.round(reconnectDelay)}ms`);
    setTimeout(connect, reconnectDelay);
  }
  function disconnect() {
    if (ws) {
      ws.close();
      ws = null;
      window.dispatchEvent(new CustomEvent('ws:status', { detail: { status: 'closed' } }));
    }
  }
  window.DWS.realtime = { connect, disconnect };
})();