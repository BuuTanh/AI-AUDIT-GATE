/**
 * api.js — AI Audit Gate frontend API helper
 * Centralises all fetch calls, JWT handling, and auth sync.
 */
(function (window) {
  // Priority:
  //  1. config.js sets window.AAG_API_BASE (ngrok URL for Vercel deploy)
  //  2. Dev on Live Server (:5500/:5501) → local backend :3001
  //  3. Served by backend itself → same origin /api
  var API_BASE = (window.AAG_API_BASE && window.AAG_API_BASE.trim())
    ? window.AAG_API_BASE.trim().replace(/\/$/, '')
    : (window.location.port === '5500' || window.location.port === '5501')
      ? 'http://localhost:3001/api'
      : window.location.origin + '/api';

  /* ── Token helpers ──────────────────────────────────────── */
  function getToken()       { return localStorage.getItem('aag-token'); }
  function setToken(t)      { localStorage.setItem('aag-token', t); }
  function getStoredUser()  { try { return JSON.parse(localStorage.getItem('aag-user') || 'null'); } catch { return null; } }
  function setStoredUser(u) { localStorage.setItem('aag-user', JSON.stringify(u)); }
  function clearAuth()      { localStorage.removeItem('aag-token'); localStorage.removeItem('aag-user'); sessionStorage.clear(); }

  /* ── Backend role → frontend role ──────────────────────── */
  function mapRole(r) { return r === 'SENIOR_BA' ? 'Senior BA' : r; }  // BA, PM unchanged
  function unmapRole(r) { return r === 'Senior BA' ? 'SENIOR_BA' : r; }

  /* ── Populate sessionStorage from stored user ────────────
   *  Called on every page load so existing code that reads
   *  sessionStorage.getItem('userRole') keeps working.       */
  function syncAuth() {
    var token = getToken();
    var user  = getStoredUser();
    if (!token || !user) return false;
    sessionStorage.setItem('userRole',    mapRole(user.role));
    sessionStorage.setItem('userName',    user.fullName);
    return true;
  }

  /* ── Core fetch wrapper ──────────────────────────────────  */
  async function request(method, path, body) {
    var token = getToken();
    // ngrok free tier requires this header to bypass the browser warning interstitial
    var extraHeaders = API_BASE.includes('ngrok') ? { 'ngrok-skip-browser-warning': 'true' } : {};
    var opts  = {
      method:  method,
      headers: Object.assign(
        { 'Content-Type': 'application/json' },
        extraHeaders,
        token ? { 'Authorization': 'Bearer ' + token } : {}
      ),
    };
    if (body) opts.body = JSON.stringify(body);

    try {
      var res  = await fetch(API_BASE + path, opts);
      var data = await res.json();
      if (res.status === 401) {
        clearAuth();
        var page = window.location.pathname.split('/').pop();
        if (page !== 'login.html') window.location.href = 'login.html';
        return null;
      }
      return { ok: res.ok, status: res.status, data };
    } catch (e) {
      console.warn('[API] request failed (server down?):', path, e.message);
      return { ok: false, status: 0, data: { error: 'Network error' } };
    }
  }

  /* ── Auth ───────────────────────────────────────────────── */
  async function login(username, password) {
    var r = await request('POST', '/auth/login', { username, password });
    if (r && r.ok) {
      setToken(r.data.token);
      setStoredUser(r.data.user);
      syncAuth();
    }
    return r;
  }

  async function logout() {
    await request('POST', '/auth/logout');
    clearAuth();
  }

  /* ── Public API object ──────────────────────────────────── */
  window.AAG = {
    /* auth */
    login,
    logout,
    syncAuth,
    getToken,
    getStoredUser,
    clearAuth,
    mapRole,

    /* REST helpers */
    get:    function (path)        { return request('GET',    path); },
    post:   function (path, body)  { return request('POST',   path, body); },
    put:    function (path, body)  { return request('PUT',    path, body); },
    patch:  function (path, body)  { return request('PATCH',  path, body); },
    del:    function (path)        { return request('DELETE', path); },

    /* gauge SVG helper (reused across pages) */
    gaugeOffset: function (score, r) {
      var radius = r || 21;
      var circ   = 2 * Math.PI * radius;
      return circ * (1 - Math.max(0, Math.min(100, score || 0)) / 100);
    },
    scoreColor: function (score) {
      if (score === null || score === undefined) return 'var(--text-subtle)';
      if (score >= 75) return '#43A047';
      if (score >= 60) return '#FFC107';
      return '#E53935';
    },
  };

  /* Auto-sync on every page (except login) ─────────────────── */
  var currentPage = window.location.pathname.split('/').pop();
  if (currentPage !== 'login.html') {
    if (!syncAuth()) {
      /* No token → redirect to login */
      window.location.href = 'login.html';
    }
  }

})(window);
