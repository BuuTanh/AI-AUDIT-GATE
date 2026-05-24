
/* ══════════════════════════════════════════════════
   AI WORKSPACE — Interaction Logic
   ══════════════════════════════════════════════════ */

/* ── State ── */
var currentMode = localStorage.getItem('aag-ws-mode') || 'create';
var currentSession = 1;
var isThinking = false;
var selectedProjectId = null;

/* ── Default session data ── */
var DEFAULT_SESSIONS = {
  create: [
    { id: 1, title: 'OTP Login - Phone',      meta: 'Today - 4 requirements' },
    { id: 2, title: 'Account Management',    meta: 'Yesterday - 6 requirements' },
    { id: 3, title: 'Domestic Transfer',     meta: '22/05 - 8 requirements' },
  ],
  audit: [
    { id: 4, title: 'SRS_MobileBanking_v1.2', meta: 'Today - Score: 72' },
    { id: 5, title: 'Quick check - REQ-005',  meta: 'Yesterday - 1 req' },
    { id: 6, title: 'SRS_CoreBanking_v2.0',   meta: '21/05 - Score: 61' },
  ]
};

/* ── One-time migration: clear all stale workspace data ── */
(function migrateWS() {
  try {
    if (localStorage.getItem('aag-ws-ver') !== 'v5') {
      var keysToRemove = ['aag-ws-sessions'];
      for (var i = 1; i <= 20; i++) keysToRemove.push('aag-ws-msgs-' + i);
      keysToRemove.forEach(function(k) { localStorage.removeItem(k); });
      localStorage.setItem('aag-ws-ver', 'v5');
    }
  } catch(e) {}
})();

/* ── Load sessions from localStorage (with fallback + validation) ── */
function loadSessions() {
  try {
    var saved = localStorage.getItem('aag-ws-sessions');
    if (saved) {
      var parsed = JSON.parse(saved);
      // Validate: must be an object with create[] and audit[] arrays
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)
          && Array.isArray(parsed.create) && Array.isArray(parsed.audit)) {
        return parsed;
      }
      // Invalid/old format → clear it
      localStorage.removeItem('aag-ws-sessions');
      localStorage.removeItem('aag-ws-msgs-1');
      localStorage.removeItem('aag-ws-msgs-4');
    }
  } catch(e) {
    localStorage.removeItem('aag-ws-sessions');
  }
  return JSON.parse(JSON.stringify(DEFAULT_SESSIONS)); // deep copy
}
function saveSessions() {
  try { localStorage.setItem('aag-ws-sessions', JSON.stringify(SESSIONS)); } catch(e) {}
}

/* ── Message persistence ── */
function saveMessages(sessionId, msgs) {
  try { localStorage.setItem('aag-ws-msgs-' + sessionId, JSON.stringify(msgs)); } catch(e) {}
}
function loadMessages(sessionId) {
  try {
    var s = localStorage.getItem('aag-ws-msgs-' + sessionId);
    return s ? JSON.parse(s) : null;
  } catch(e) { return null; }
}

var SESSIONS = loadSessions();

/* ── Mock message content ── */
var MSG_WELCOME_CREATE = `
<p>Hi! I'm <strong>ReqBrain</strong> — an AI assistant that transforms raw business descriptions into well-formed requirements compliant with <strong>ISO 29148</strong>.</p>
<p>Describe a feature in natural language, paste meeting notes, or drop in raw User Stories — I'll generate complete requirements with proper <code>shall / should / may</code> syntax, identifiers, and Acceptance Criteria.</p>`;

var MSG_WELCOME_AUDIT = `
<p>I can audit SRS documents against <strong>4 ISO 29148 criteria</strong>: syntax, ambiguous language, logical conflicts, and completeness — then produce a <strong>Health Score 0–100</strong>.</p>
<p>Upload an SRS document (PDF/DOCX) or paste requirements directly below to start the audit.</p>`;

var MSG_CREATE_USER = 'Người dùng muốn đăng nhập bằng số điện thoại và mã OTP 6 chữ số. OTP có hiệu lực 3 phút và chỉ được dùng 1 lần. Nhập sai 5 lần liên tiếp thì khóa tài khoản 30 phút.';

var MSG_CREATE_AI = `
<p>Description analysed. Generated <strong>4 ISO 29148 requirements</strong> (F06 auto-suggested attributes):</p>
<table class="req-gen-table">
  <thead>
    <tr>
      <th>ID</th><th>Type</th><th>Pri.</th><th>Actor</th>
      <th>ISO 29148 Requirement</th><th>Acceptance Criteria</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><span class="req-id">REQ-F001</span></td>
      <td><span class="badge badge-auditing" style="font-size:10px;">Functional</span></td>
      <td><span class="badge badge-high" style="font-size:10px;">High</span></td>
      <td style="color:var(--text-muted);font-size:11px;">User</td>
      <td>The system <strong>shall</strong> allow authenticated users to log in using a registered phone number and a 6-digit One-Time Password (OTP).</td>
      <td style="font-size:11px;color:var(--text-muted);">OTP accepted → redirect to dashboard</td>
    </tr>
    <tr>
      <td><span class="req-id">REQ-F002</span></td>
      <td><span class="badge badge-auditing" style="font-size:10px;">Functional</span></td>
      <td><span class="badge badge-high" style="font-size:10px;">High</span></td>
      <td style="color:var(--text-muted);font-size:11px;">System</td>
      <td>The system <strong>shall</strong> invalidate the OTP exactly 180 seconds after issuance, or immediately upon first successful use, whichever occurs first.</td>
      <td style="font-size:11px;color:var(--text-muted);">OTP rejected with "Expired" message after 3 min</td>
    </tr>
    <tr>
      <td><span class="req-id">REQ-F003</span></td>
      <td><span class="badge badge-auditing" style="font-size:10px;">Functional</span></td>
      <td><span class="badge badge-high" style="font-size:10px;">High</span></td>
      <td style="color:var(--text-muted);font-size:11px;">System</td>
      <td>The system <strong>shall</strong> lock the user account for 1,800 seconds after 5 consecutive failed OTP verification attempts and display the remaining lockout time.</td>
      <td style="font-size:11px;color:var(--text-muted);">Account locked; countdown shown; unlocks after 30 min</td>
    </tr>
    <tr>
      <td><span class="req-id">REQ-NF001</span></td>
      <td><span class="badge badge-nonfunc" style="font-size:10px;">Non-Functional</span></td>
      <td><span class="badge badge-medium" style="font-size:10px;">Med</span></td>
      <td style="color:var(--text-muted);font-size:11px;">System</td>
      <td>The system <strong>shall</strong> deliver the OTP to the registered mobile number within 30 seconds under standard network conditions (≥ 5 Mbps).</td>
      <td style="font-size:11px;color:var(--text-muted);">OTP received ≤ 30s in ≥ 95th percentile of test cases</td>
    </tr>
  </tbody>
</table>
<p style="font-size:12px;color:var(--text-muted);margin-top:4px;">💡 <em>Suggestion (F08): You haven't specified handling for 1–4 failed OTP attempts before lockout. Should I add that requirement?</em></p>
<div class="ai-action-bar">
  <button class="ai-act-btn primary" onclick="openProjectPicker()">
    <span class="material-symbols-outlined">save</span>Save to Project
  </button>
  <button class="ai-act-btn" onclick="switchMode('audit');selectSession(4)">
    <span class="material-symbols-outlined">fact_check</span>Run Audit
  </button>
  <button class="ai-act-btn" onclick="appendUserMsg('Add requirement for 1–4 failed OTP attempts before lockout')">
    <span class="material-symbols-outlined">add</span>Add Missing
  </button>
  <button class="ai-act-btn" onclick="showToastWS('Opening requirement editor…','')">
    <span class="material-symbols-outlined">edit</span>Edit
  </button>
</div>`;

var MSG_AUDIT_FILE_USER = '<div class="ws-file-chip"><span class="material-symbols-outlined">description</span>SRS_Mobile_Banking_v1.2.pdf &nbsp;|&nbsp; 2.3 MB</div>';

var MSG_AUDIT_AI = `
<p>Analysed <strong>SRS_Mobile_Banking_v1.2.pdf</strong> — 38 requirements across 5 modules. ISO 29148 audit results:</p>
<div class="audit-score-card">
  <div class="audit-score-left">
    <div style="font-size:10px;font-weight:700;letter-spacing:.07em;text-transform:uppercase;color:var(--text-dim);margin-bottom:6px;">Health Score</div>
    <div class="audit-score-num" style="color:#FB8C00;">72</div>
    <div style="font-size:10px;color:var(--nav-bg);background:#FB8C00;padding:2px 8px;border-radius:10px;margin-top:6px;font-weight:700;">/100</div>
    <div style="font-size:10px;color:#FB8C00;margin-top:6px;text-align:center;">⚠ Below threshold (min 75)</div>
  </div>
  <div class="audit-score-grid">
    <div class="audit-score-cell">
      <div class="audit-score-cell-num" style="color:#E53935;">8</div>
      <div class="audit-score-cell-label">Syntax errors (F09)</div>
    </div>
    <div class="audit-score-cell">
      <div class="audit-score-cell-num" style="color:#FB8C00;">12</div>
      <div class="audit-score-cell-label">Ambiguous language (F10)</div>
    </div>
    <div class="audit-score-cell">
      <div class="audit-score-cell-num" style="color:#FFB300;">3</div>
      <div class="audit-score-cell-label">Logic conflicts (F11)</div>
    </div>
    <div class="audit-score-cell">
      <div class="audit-score-cell-num" style="color:var(--text-muted);">5</div>
      <div class="audit-score-cell-label">Missing attributes (F12)</div>
    </div>
  </div>
</div>
<p style="font-weight:600;margin-top:14px;">Top 3 critical issues to resolve:</p>
<div class="audit-error-list">
  <div class="audit-error-item">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
      <div style="display:flex;align-items:center;gap:8px;">
        <span class="badge badge-syntax" style="font-size:10px;">F09 · Syntax</span>
        <span class="req-id">REQ-005</span>
      </div>
    </div>
    <p style="font-size:12px;color:var(--text-muted);margin:0;">"The login feature <em>should be user-friendly and fast</em>" — Missing modal verb <code>shall</code>, vague subject, contains banned terms.</p>
    <details>
      <summary>View fix suggestion (F13) →</summary>
      <div class="audit-fix-box">
        ✅ <strong>Suggestion:</strong> "The system <strong>shall</strong> display the OTP login screen within 2 seconds after the user initiates login on a connection with ≥ 5 Mbps bandwidth."
        <div class="ai-action-bar" style="margin-top:8px;">
          <button class="ai-act-btn primary" style="font-size:11px;padding:5px 10px;" onclick="this.closest('.audit-error-item').style.opacity='.4'">✓ Accept</button>
          <button class="ai-act-btn" style="font-size:11px;padding:5px 10px;">✕ Reject</button>
        </div>
      </div>
    </details>
  </div>
  <div class="audit-error-item warn">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
      <div style="display:flex;align-items:center;gap:8px;">
        <span class="badge badge-conflict" style="font-size:10px;">F11 · Conflict</span>
        <span class="req-id">REQ-012 ↔ REQ-031</span>
      </div>
    </div>
    <p style="font-size:12px;color:var(--text-muted);margin:0;">REQ-012 locks after <strong>3 failures</strong>; REQ-031 allows up to <strong>5 attempts</strong> — direct conflict on the retry limit.</p>
    <details>
      <summary>View fix suggestion (F13) →</summary>
      <div class="audit-fix-box">
        ✅ <strong>Suggestion:</strong> Align on a single threshold (e.g. 5 per REQ-031) and update REQ-012 to: "…after 5 consecutive failed authentication attempts…"
        <div class="ai-action-bar" style="margin-top:8px;">
          <button class="ai-act-btn primary" style="font-size:11px;padding:5px 10px;" onclick="this.closest('.audit-error-item').style.opacity='.4'">✓ Accept</button>
          <button class="ai-act-btn" style="font-size:11px;padding:5px 10px;">✕ Reject</button>
        </div>
      </div>
    </details>
  </div>
  <div class="audit-error-item info">
    <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;">
      <span class="badge badge-ambig" style="font-size:10px;">F10 · Ambiguous</span>
      <span class="req-id">REQ-018, REQ-022, REQ-027 (+9)</span>
    </div>
    <p style="font-size:12px;color:var(--text-muted);margin:0;">12 requirements contain banned terms: <em>"fast", "suitable", "easy to use", "optimised", "user-friendly"</em> — replace with concrete quantitative thresholds.</p>
  </div>
</div>
<div class="ai-action-bar">
  <button class="ai-act-btn primary" onclick="openProjectPicker()">
    <span class="material-symbols-outlined">save</span>Save to Project
  </button>
  <button class="ai-act-btn" onclick="window.location.href='audit.html'">
    <span class="material-symbols-outlined">open_in_new</span>Full Audit Report
  </button>
  <button class="ai-act-btn" onclick="showToastWS('Opening bulk fix editor for all 28 issues…','')">
    <span class="material-symbols-outlined">rule</span>Fix All Issues
  </button>
</div>`;

/* ── Render session list ── */
function renderSessions() {
  var list = document.getElementById('sessionList');
  var sessions = (SESSIONS && SESSIONS[currentMode]) || [];
  list.innerHTML = '';
  sessions.forEach(function(s) {
    var div = document.createElement('div');
    div.className = 'ws-session-item' + (s.id === currentSession ? ' active' : '');
    div.innerHTML =
      '<div style="display:flex;align-items:center;justify-content:space-between;gap:4px;">' +
        '<div class="ws-session-title" id="stitle-' + s.id + '">' + s.title + '</div>' +
        '<button style="flex-shrink:0;background:none;border:none;cursor:pointer;color:var(--text-dim);display:flex;align-items:center;padding:2px;" ' +
          'title="Rename" onclick="event.stopPropagation();startRename(' + s.id + ')">' +
          '<span class="material-symbols-outlined" style="font-size:13px;">edit</span>' +
        '</button>' +
      '</div>' +
      '<div class="ws-session-meta">' + s.meta + (s.project ? ' - <span style="color:#E53935;">[' + s.project + ']</span>' : '') + '</div>';
    div.onclick = function() { selectSession(s.id); };
    list.appendChild(div);
  });
}

/* ── Session rename ── */
function startRename(id) {
  var sessions = (SESSIONS && SESSIONS[currentMode]) || [];
  var s = sessions.find(function(x){ return x.id === id; });
  if (!s) return;
  var titleEl = document.getElementById('stitle-' + id);
  if (!titleEl) return;
  var oldTitle = s.title;
  titleEl.innerHTML = '<input class="ws-session-rename" id="rename-' + id + '" value="' + oldTitle + '" />';
  var inp = document.getElementById('rename-' + id);
  inp.focus(); inp.select();
  function save() {
    var newTitle = inp.value.trim() || oldTitle;
    s.title = newTitle;
    saveSessions();
    renderSessions();
  }
  inp.addEventListener('blur', save);
  inp.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') { e.preventDefault(); save(); }
    if (e.key === 'Escape') { s.title = oldTitle; renderSessions(); }
  });
}

/* ── Render messages ── */
function renderMessages(sessionId) {
  var container = document.getElementById('chatMessages');
  container.innerHTML = '';
  document.getElementById('fileChipArea').style.display = 'none';
  document.getElementById('fileChipArea').innerHTML = '';

  // Try loading saved messages first
  var saved = loadMessages(sessionId);
  // Validate: each entry must have html that starts with <div (proper outerHTML)
  var validSaved = saved && saved.length > 0 && saved.every(function(m) {
    return m && typeof m.html === 'string' && m.html.trim().startsWith('<div');
  });
  if (validSaved) {
    saved.forEach(function(m) {
      _appendUserMsgRaw(m.html, true);
    });
  } else if (currentMode === 'create' && sessionId === 1) {
    appendAIMsg(MSG_WELCOME_CREATE, true);
    appendUserMsg(MSG_CREATE_USER, true);
    appendAIMsg(MSG_CREATE_AI); // last call — triggers persist
  } else if (currentMode === 'audit' && sessionId === 4) {
    appendAIMsg(MSG_WELCOME_AUDIT, true);
    var fileDiv = document.createElement('div');
    fileDiv.className = 'chat-msg chat-msg-user';
    fileDiv.innerHTML = '<div class="chat-avatar chat-avatar-user" data-user-initials></div><div>' + MSG_AUDIT_FILE_USER + '</div>';
    container.appendChild(fileDiv);
    appendAIMsg(MSG_AUDIT_AI); // last call — triggers persist
  } else {
    renderWelcome();
    return; // no messages to persist
  }

  // Populate initials
  var name = sessionStorage.getItem('userName') || 'Minh Nguyen';
  var initials = name.split(' ').map(function(w){return w[0]||'';}).join('').slice(0,2).toUpperCase();
  container.querySelectorAll('[data-user-initials]').forEach(function(el){ el.textContent = initials; });
  container.scrollTop = container.scrollHeight;
}

/* ── Collect current session messages for storage ── */
function collectMessages() {
  var msgs = [];
  document.querySelectorAll('#chatMessages .chat-msg').forEach(function(div) {
    if (div.id === 'thinkingMsg') return; // skip thinking indicator
    var isUser = div.classList.contains('chat-msg-user');
    msgs.push({ type: isUser ? 'user' : 'ai', html: div.outerHTML });
  });
  return msgs;
}
function persistMessages() {
  saveMessages(currentSession, collectMessages());
}

/* ── Welcome state (empty session) ── */
function renderWelcome() {
  var container = document.getElementById('chatMessages');
  var isCreate = currentMode === 'create';
  container.innerHTML = '';

  var welcome = document.createElement('div');
  welcome.className = 'ws-welcome';
  welcome.innerHTML = `
    <div class="ws-welcome-logo">
      <span class="material-symbols-outlined">${isCreate ? 'auto_fix_high' : 'fact_check'}</span>
    </div>
    <div>
      <h2 style="font-size:22px;font-weight:700;color:var(--text);letter-spacing:-0.02em;margin-bottom:8px;">
        ${isCreate ? 'Create requirements from raw descriptions' : 'Audit an SRS document'}
      </h2>
      <p style="font-size:13px;color:var(--text-subtle);max-width:480px;line-height:1.6;">
        ${isCreate
          ? 'Paste business notes, meeting minutes, or raw User Stories. ReqBrain normalises them into ISO 29148-compliant requirements with proper syntax and attributes.'
          : 'Upload an SRS document (PDF/DOCX) or paste requirements directly. ReqBrain checks 4 ISO 29148 criteria and returns a Health Score with a detailed issue list.'
        }
      </p>
    </div>
    <div class="ws-quick-grid">
      ${isCreate ? `
        <button class="ws-quick-card" onclick="fillInput('Users log in with email and password. The system records the last login timestamp.')">
          <div style="font-size:12px;font-weight:700;color:var(--text);margin-bottom:4px;">🔐 Login & Authentication</div>
          <div style="font-size:11px;color:var(--text-dim);">Email + password, login history</div>
        </button>
        <button class="ws-quick-card" onclick="fillInput('Users can view their transaction history for the last 90 days and filter by transaction type.')">
          <div style="font-size:12px;font-weight:700;color:var(--text);margin-bottom:4px;">📋 Transaction History</div>
          <div style="font-size:11px;color:var(--text-dim);">View 90 days, filter by type</div>
        </button>
        <button class="ws-quick-card" onclick="fillInput('The system sends push notifications for new transactions or login from an unrecognised device.')">
          <div style="font-size:12px;font-weight:700;color:var(--text);margin-bottom:4px;">🔔 Push Notifications</div>
          <div style="font-size:11px;color:var(--text-dim);">New transactions, unknown device</div>
        </button>
        <button class="ws-quick-card" onclick="fillInput('Admins can lock or unlock user accounts and view the change audit log.')">
          <div style="font-size:12px;font-weight:700;color:var(--text);margin-bottom:4px;">👤 Account Administration</div>
          <div style="font-size:11px;color:var(--text-dim);">Lock/unlock, audit log</div>
        </button>
      ` : `
        <button class="ws-quick-card" onclick="document.getElementById('fileInput').click()">
          <div style="font-size:12px;font-weight:700;color:var(--text);margin-bottom:4px;">📄 Upload SRS Document</div>
          <div style="font-size:11px;color:var(--text-dim);">PDF, DOCX, TXT · Full document audit</div>
        </button>
        <button class="ws-quick-card" onclick="fillInput('REQ-001: The system should process payments fast and efficiently.')">
          <div style="font-size:12px;font-weight:700;color:var(--text);margin-bottom:4px;">✍️ Audit a Single Requirement</div>
          <div style="font-size:11px;color:var(--text-dim);">Paste one requirement for a quick check</div>
        </button>
        <button class="ws-quick-card" onclick="fillInput('Check conflicts between: REQ-012 locks after 3 failures, REQ-031 allows up to 5 attempts.')">
          <div style="font-size:12px;font-weight:700;color:var(--text);margin-bottom:4px;">⚡ Detect Conflicts</div>
          <div style="font-size:11px;color:var(--text-dim);">Paste 2+ requirements to compare</div>
        </button>
        <button class="ws-quick-card" onclick="fillInput('Suggest missing requirements for a login module that has: REQ-001 successful login, REQ-002 OTP.')">
          <div style="font-size:12px;font-weight:700;color:var(--text);margin-bottom:4px;">🔍 Find Missing Requirements</div>
          <div style="font-size:11px;color:var(--text-dim);">Analyse your existing requirement set</div>
        </button>
      `}
    </div>`;
  container.appendChild(welcome);
}

/* ── Helper: append AI message ── */
function appendAIMsg(html, skipPersist) {
  var container = document.getElementById('chatMessages');
  var div = document.createElement('div');
  div.className = 'chat-msg chat-msg-ai fade-in';
  div.innerHTML = '<div class="chat-avatar chat-avatar-ai"><span class="material-symbols-outlined">smart_toy</span></div><div class="chat-bubble">' + html + '</div>';
  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
  if (!skipPersist) persistMessages();
  return div;
}

/* ── Helper: restore a user message from saved outerHTML ── */
function _appendUserMsgRaw(outerHTML, skipPersist) {
  var container = document.getElementById('chatMessages');
  var wrap = document.createElement('div');
  wrap.innerHTML = outerHTML;
  var el = wrap.firstElementChild;
  if (el) {
    el.classList.remove('fade-in');
    container.appendChild(el);
    container.scrollTop = container.scrollHeight;
  }
  if (!skipPersist) persistMessages();
}

/* ── Helper: append user message ── */
function appendUserMsg(text, skipPersist) {
  var container = document.getElementById('chatMessages');
  var name = sessionStorage.getItem('userName') || 'MN';
  var initials = name.split(' ').map(function(w){return w[0]||'';}).join('').slice(0,2).toUpperCase();
  var div = document.createElement('div');
  div.className = 'chat-msg chat-msg-user fade-in';
  div.innerHTML = '<div class="chat-avatar chat-avatar-user">' + initials + '</div><div class="chat-bubble">' + text + '</div>';
  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
  if (!skipPersist) persistMessages();
}

/* ── Thinking indicator ── */
function showThinking() {
  var container = document.getElementById('chatMessages');
  var div = document.createElement('div');
  div.id = 'thinkingMsg';
  div.className = 'chat-msg chat-msg-ai fade-in';
  div.innerHTML = `
    <div class="chat-avatar chat-avatar-ai">
      <span class="material-symbols-outlined">smart_toy</span>
    </div>
    <div class="thinking-wrap">
      <div class="t-dot"></div><div class="t-dot"></div><div class="t-dot"></div>
      <span style="font-size:11px;color:var(--text-dim);margin-left:4px;">ReqBrain is analysing…</span>
    </div>`;
  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
}
function hideThinking() {
  var el = document.getElementById('thinkingMsg');
  if (el) el.remove();
}

/* ── Switch mode ── */
function switchMode(mode) {
  persistMessages(); // save current session before switching
  currentMode = mode;
  localStorage.setItem('aag-ws-mode', mode);
  document.getElementById('tab-create').classList.toggle('active', mode === 'create');
  document.getElementById('tab-audit').classList.toggle('active', mode === 'audit');
  document.getElementById('uploadZone').style.display = mode === 'audit' ? 'flex' : 'none';
  document.getElementById('fileChipArea').style.display = 'none';
  document.getElementById('fileChipArea').innerHTML = '';
  document.getElementById('chatInput').placeholder = mode === 'create'
    ? 'Describe a feature, paste raw User Stories, or enter a single requirement...'
    : 'Enter requirements to audit, or upload an SRS document above...';
  // Select first session of this mode
  currentSession = mode === 'create' ? 1 : 4;
  saveSessions();
  renderSessions();
  renderMessages(currentSession);
}

/* ── Select session ── */
function selectSession(id) {
  persistMessages(); // save current session before switching
  currentSession = id;
  renderSessions();
  renderMessages(id);
}

/* ── New session ── */
function newSession() {
  persistMessages(); // save current session first
  if (!SESSIONS[currentMode]) SESSIONS[currentMode] = [];
  var sessions = SESSIONS[currentMode];
  var newId = Date.now();
  var proj = sessionStorage.getItem('auditProjectName') || null;
  sessions.unshift({ id: newId, title: 'New Session', meta: 'Just now', project: proj || undefined });
  currentSession = newId;
  saveSessions();
  renderSessions();
  renderWelcome();
  // Immediately let user rename the new session
  setTimeout(function(){ startRename(newId); }, 80);
}

/* ── Collect conversation history for context ── */
function getConversationHistory() {
  var msgs = [];
  document.querySelectorAll('#chatMessages .chat-msg').forEach(function(div) {
    if (div.id === 'thinkingMsg') return;
    var isUser = div.classList.contains('chat-msg-user');
    var bubble = div.querySelector('.chat-bubble');
    if (bubble) {
      msgs.push({ role: isUser ? 'user' : 'assistant', content: bubble.textContent.slice(0, 400) });
    }
  });
  return msgs.slice(-6); // last 3 turns
}

/* ── Core AI call ── */
async function callAI(mode, message, skipWelcome) {
  var container = document.getElementById('chatMessages');
  if (!skipWelcome) {
    var welcome = container.querySelector('.ws-welcome');
    if (welcome) {
      container.innerHTML = '';
      appendAIMsg(mode === 'create' ? MSG_WELCOME_CREATE : MSG_WELCOME_AUDIT, true);
    }
  }

  isThinking = true;
  document.getElementById('sendBtn').disabled = true;
  showThinking();

  try {
    var token   = localStorage.getItem('aag-token');
    var history = getConversationHistory();
    // Remove the last user message from history (we're about to send it)
    if (history.length > 0 && history[history.length - 1].role === 'user') {
      history = history.slice(0, -1);
    }

    var res = await fetch('http://localhost:3001/api/ai/chat', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
      body:    JSON.stringify({ mode: mode, message: message, history: history }),
    });

    hideThinking();
    isThinking = false;
    document.getElementById('sendBtn').disabled = false;

    if (!res.ok) {
      var errData = await res.json().catch(function(){ return {}; });
      appendAIMsg('<p style="color:#E53935;"><span class="material-symbols-outlined" style="font-size:16px;vertical-align:-3px;">warning</span> '
        + (errData.error || 'AI service error.') + '</p>');
      return;
    }

    var data = await res.json();
    appendAIMsg(renderAIResponse(data));

  } catch (err) {
    hideThinking();
    isThinking = false;
    document.getElementById('sendBtn').disabled = false;
    appendAIMsg('<p style="color:#E53935;"><span class="material-symbols-outlined" style="font-size:16px;vertical-align:-3px;">warning</span> '
      + 'Cannot reach AI service -- make sure <strong>LM Studio local server is running</strong> at localhost:1234.</p>');
  }
}

/* ── Send message ── */
function sendMessage() {
  var input = document.getElementById('chatInput');
  var text  = input.value.trim();
  if (!text || isThinking) return;

  var container = document.getElementById('chatMessages');
  var welcome   = container.querySelector('.ws-welcome');
  if (welcome) {
    container.innerHTML = '';
    appendAIMsg(currentMode === 'create' ? MSG_WELCOME_CREATE : MSG_WELCOME_AUDIT, true);
  }

  appendUserMsg(text.replace(/\n/g, '<br>'));
  input.value = '';
  input.style.height = 'auto';

  // Update session meta
  var sessions = (SESSIONS && SESSIONS[currentMode]) || [];
  var sess = sessions.find(function(x){ return x.id === currentSession; });
  if (sess) {
    var now = new Date();
    sess.meta = 'Today - ' + now.getHours() + ':' + String(now.getMinutes()).padStart(2,'0');
    renderSessions();
    saveSessions();
  }

  // In audit mode: prefix the message so the model knows to output SCORE/ISSUE format
  var aiText = (currentMode === 'audit' && !text.toLowerCase().startsWith('audit') && !text.toLowerCase().startsWith('re-audit'))
    ? 'Audit these SRS requirements for ISO 29148 compliance:\n\n' + text
    : text;
  callAI(currentMode, aiText, true);
}

/* ── Fill input from quick card ── */
function fillInput(text) {
  var input = document.getElementById('chatInput');
  input.value = text;
  autoGrow(input);
  document.getElementById('sendBtn').disabled = false;
  input.focus();
}

/* ── File upload ── */
function handleFileSelect(inputEl) {
  if (!inputEl.files || !inputEl.files[0]) return;
  var file = inputEl.files[0];

  // Show file chip
  var chipArea = document.getElementById('fileChipArea');
  chipArea.style.display = 'block';
  chipArea.innerHTML = '<span class="ws-file-chip"><span class="material-symbols-outlined">description</span>'
    + file.name + ' &nbsp;|&nbsp; ' + (file.size / 1024 / 1024).toFixed(2) + ' MB'
    + ' <span style="margin-left:8px;cursor:pointer;color:var(--text-dim);" onclick="clearFile()">x</span></span>';

  // Show in chat
  var container = document.getElementById('chatMessages');
  var welcome   = container.querySelector('.ws-welcome');
  if (welcome) {
    container.innerHTML = '';
    appendAIMsg(MSG_WELCOME_AUDIT, true);
  }
  var uname    = sessionStorage.getItem('userName') || 'MN';
  var initials = uname.split(' ').map(function(w){return w[0]||'';}).join('').slice(0,2).toUpperCase();
  var fileDiv  = document.createElement('div');
  fileDiv.className = 'chat-msg chat-msg-user fade-in';
  fileDiv.innerHTML = '<div class="chat-avatar chat-avatar-user">' + initials + '</div>'
    + '<div><div class="ws-file-chip"><span class="material-symbols-outlined">description</span>' + file.name + '</div></div>';
  container.appendChild(fileDiv);
  container.scrollTop = container.scrollHeight;

  var isTxt = /\.txt$/i.test(file.name);
  var isPdfOrDocx = /\.(pdf|docx)$/i.test(file.name);

  if (isTxt) {
    // TXT: đọc nội dung và gửi thẳng lên AI
    var reader = new FileReader();
    reader.onload = function(e) {
      var content = e.target.result;
      // Giới hạn 3000 ký tự để phù hợp context window
      var truncated = content.length > 3000 ? content.slice(0, 3000) + '\n\n[...truncated to 3000 chars]' : content;
      callAI('audit', 'Audit the following SRS document:\n\n' + truncated, true);
    };
    reader.readAsText(file, 'UTF-8');
  } else if (isPdfOrDocx) {
    // PDF/DOCX: upload to backend for text extraction
    var formData = new FormData();
    formData.append('file', file);
    isThinking = true;
    document.getElementById('sendBtn').disabled = true;
    showThinking();
    var token = localStorage.getItem('aag-token');
    fetch('http://localhost:3001/api/ai/audit-file', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + token },
      body: formData
    }).then(function(r) { return r.json(); }).then(function(data) {
      hideThinking();
      isThinking = false;
      document.getElementById('sendBtn').disabled = false;
      if (data.error) {
        appendAIMsg('<p style="color:#E53935;"><span class="material-symbols-outlined" style="font-size:16px;vertical-align:-3px;">warning</span> ' + data.error + '</p>');
      } else {
        appendAIMsg(renderAIResponse(data));
      }
      persistMessages();
    }).catch(function(err) {
      hideThinking();
      isThinking = false;
      document.getElementById('sendBtn').disabled = false;
      appendAIMsg('<p style="color:#E53935;"><span class="material-symbols-outlined" style="font-size:16px;vertical-align:-3px;">warning</span> Cannot reach AI service -- make sure <strong>LM Studio local server is running</strong> at localhost:1234.</p>');
      persistMessages();
    });
  } else {
    // Unknown file type
    appendAIMsg('<p><strong>' + file.name + '</strong> received.</p>'
      + '<p style="font-size:12px;color:var(--text-muted);margin-top:6px;">'
      + 'Unsupported file type. Please upload a <strong>PDF</strong>, <strong>DOCX</strong>, or <strong>TXT</strong> file.</p>');
    persistMessages();
  }
}

function clearFile() {
  document.getElementById('fileInput').value = '';
  document.getElementById('fileChipArea').style.display = 'none';
  document.getElementById('fileChipArea').innerHTML = '';
}

/* ── Auto-grow textarea ── */
function autoGrow(el) {
  el.style.height = 'auto';
  el.style.height = Math.min(el.scrollHeight, 130) + 'px';
  document.getElementById('sendBtn').disabled = el.value.trim() === '';
}

/* ── Keyboard: Ctrl+Enter sends ── */
function handleInputKey(e) {
  if (e.key === 'Enter' && e.ctrlKey) {
    e.preventDefault();
    sendMessage();
  }
}

/* ── Project Picker ── */
var selectedProject = null;

function openProjectPicker() {
  selectedProject = null;
  selectedProjectId = null;
  var list = document.getElementById('projectPickerList');
  list.innerHTML = '<p style="color:var(--text-dim);font-size:12px;padding:8px;">Loading...</p>';
  document.getElementById('projectPickerModal').style.display = 'flex';
  document.getElementById('confirmSaveBtn').disabled = true;

  var token = localStorage.getItem('aag-token');
  fetch('http://localhost:3001/api/projects', { headers: { 'Authorization': 'Bearer ' + token } })
    .then(function(r) { return r.json(); })
    .then(function(data) { renderProjectPickerList(data.projects || []); })
    .catch(function() { renderProjectPickerList([]); });
}

function renderProjectPickerList(projects) {
  var list = document.getElementById('projectPickerList');
  list.innerHTML = '';
  if (!projects || projects.length === 0) {
    list.innerHTML = '<p style="color:var(--text-dim);font-size:12px;padding:8px;">No projects found. Create a project first.</p>';
    return;
  }
  projects.forEach(function(p) {
    var div = document.createElement('div');
    div.className = 'proj-pick-item';
    div.setAttribute('data-id', p.id);
    div.innerHTML =
      '<div style="width:32px;height:32px;border-radius:6px;background:#E53935;display:flex;align-items:center;justify-content:center;flex-shrink:0;">' +
        '<span class="material-symbols-outlined" style="font-size:16px;color:#fff;">folder_copy</span>' +
      '</div>' +
      '<div>' +
        '<p style="font-size:12px;font-weight:700;color:var(--text);">' + (p.name || '-') + '</p>' +
        '<p style="font-size:10px;color:var(--text-dim);">' + (p.team || '') + '</p>' +
      '</div>';
    div.onclick = function() {
      document.querySelectorAll('.proj-pick-item').forEach(function(el){ el.classList.remove('selected'); });
      div.classList.add('selected');
      selectedProject = p.name;
      selectedProjectId = p.id;
      document.getElementById('confirmSaveBtn').disabled = false;
    };
    list.appendChild(div);
  });
}

function closeProjectPicker() {
  document.getElementById('projectPickerModal').style.display = 'none';
  selectedProject = null;
  selectedProjectId = null;
  document.getElementById('confirmSaveBtn').disabled = true;
}

async function confirmSave() {
  if (!selectedProject || !selectedProjectId) return;

  // Collect requirements — use stored set, fall back to DOM extraction
  var reqs = window._lastGeneratedRequirements || [];
  if (reqs.length === 0) reqs = extractReqsFromDOM();
  var sessions = (SESSIONS && SESSIONS[currentMode]) || [];
  var sess = sessions.find(function(x){ return x.id === currentSession; });
  var title = (sess ? sess.title : 'AI Requirements') + ' - ' + new Date().toLocaleDateString();

  var token = localStorage.getItem('aag-token');
  try {
    var res = await fetch('http://localhost:3001/api/projects/' + selectedProjectId + '/documents/from-ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
      body: JSON.stringify({ requirements: reqs, title: title })
    });
    var data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Save failed');
    // Tag session
    if (sess) {
      sess.project = selectedProject;
      sess.meta = sess.meta.split(' - ')[0] + ' - Saved to project';
    }
    saveSessions();
    renderSessions();
    closeProjectPicker();
    showToastWS('Saved to "' + selectedProject + '" - document created', 'success');
  } catch(e) {
    closeProjectPicker();
    showToastWS('Saved session (offline mode)', '');
  }
}

/* ── Send a follow-up message to AI (used by action-bar buttons) ── */
function sendAuditMsg(text) {
  if (isThinking) return;
  var container = document.getElementById('chatMessages');
  var welcome = container.querySelector('.ws-welcome');
  if (welcome) {
    container.innerHTML = '';
    appendAIMsg(MSG_WELCOME_AUDIT, true);
  }
  appendUserMsg(text);
  callAI(currentMode, text, true);
}

/* ── Toast ── */
function showToastWS(msg, type) {
  var t = document.createElement('div');
  t.className = 'toast' + (type ? ' ' + type : '');
  t.innerHTML = '<span class="material-symbols-outlined" style="font-size:18px;">' +
    (type === 'success' ? 'check_circle' : 'info') + '</span>' + msg;
  document.body.appendChild(t);
  setTimeout(function(){ t.remove(); }, 3200);
}

/* ══════════════════════════════════════════════════
   AI RESPONSE RENDERER
   ══════════════════════════════════════════════════ */

function escapeHtml(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

/* ── Route to correct renderer based on response type ── */
function renderAIResponse(data) {
  if (data.type === 'requirements' && data.requirements && data.requirements.length > 0) {
    window._lastGeneratedRequirements = data.requirements;
    return renderRequirementsTable(data.requirements);
  }
  if (data.type === 'audit') {
    return renderAuditCard(data.score, data.issues || [], data.rawText || '');
  }
  return renderRawText(data.rawText || data.text || 'No response received.');
}

/* ── Requirements table (Create Req mode) ── */
function renderRequirementsTable(reqs) {
  var rows = reqs.map(function(r) {
    var isNF      = r.type && r.type.toLowerCase().includes('non');
    var typeClass = isNF ? 'badge-nonfunc' : 'badge-auditing';
    var priLower  = (r.priority || 'medium').toLowerCase();
    var priClass  = priLower === 'high' ? 'badge-high' : priLower === 'low' ? 'badge-low' : 'badge-medium';
    return '<tr>'
      + '<td><span class="req-id">' + escapeHtml(r.id) + '</span></td>'
      + '<td><span class="badge ' + typeClass + '" style="font-size:10px;">' + escapeHtml(r.type) + '</span></td>'
      + '<td><span class="badge ' + priClass + '" style="font-size:10px;">' + escapeHtml(r.priority || 'Med') + '</span></td>'
      + '<td style="color:var(--text-muted);font-size:11px;">' + escapeHtml(r.actor || 'System') + '</td>'
      + '<td>' + escapeHtml(r.requirement) + '</td>'
      + '<td style="font-size:11px;color:var(--text-muted);">' + (r.acceptance ? escapeHtml(r.acceptance) : '-') + '</td>'
      + '</tr>';
  }).join('');

  return '<p>Generated <strong>' + reqs.length + ' ISO 29148 requirement' + (reqs.length > 1 ? 's' : '') + '</strong>:</p>'
    + '<table class="req-gen-table"><thead><tr>'
    + '<th>ID</th><th>Type</th><th>Pri.</th><th>Actor</th><th>ISO 29148 Requirement</th><th>Acceptance Criteria</th>'
    + '</tr></thead><tbody>' + rows + '</tbody></table>'
    + '<div class="ai-action-bar">'
    + '<button class="ai-act-btn primary" onclick="openProjectPicker()">'
    + '<span class="material-symbols-outlined">save</span>Save to Project</button>'
    + '<button class="ai-act-btn" onclick="switchMode(\'audit\')">'
    + '<span class="material-symbols-outlined">fact_check</span>Run Audit</button>'
    + '<button class="ai-act-btn" onclick="appendUserMsg(\'Add more requirements for edge cases and error handling\')">'
    + '<span class="material-symbols-outlined">add</span>Add More</button>'
    + '<button class="ai-act-btn" onclick="printRequirements()">'
    + '<span class="material-symbols-outlined">picture_as_pdf</span>Download PDF</button>'
    + '</div>';
}

/* ── Extract requirements from the visible DOM table (fallback) ── */
function extractReqsFromDOM() {
  var extracted = [];
  var rows = document.querySelectorAll('#chatMessages .req-gen-table tbody tr');
  rows.forEach(function(row) {
    var cells = row.querySelectorAll('td');
    if (cells.length >= 5) {
      extracted.push({
        id:          cells[0].textContent.trim(),
        type:        cells[1].textContent.trim(),
        priority:    cells[2].textContent.trim(),
        actor:       cells[3].textContent.trim(),
        requirement: cells[4].textContent.trim(),
        acceptance:  cells[5] ? cells[5].textContent.trim() : '',
      });
    }
  });
  return extracted;
}

/* ── Print / Download PDF for requirements table ── */
function printRequirements() {
  var reqs = window._lastGeneratedRequirements || [];
  // Safety net: if memory is empty, try to extract from the visible DOM table
  if (reqs.length === 0) reqs = extractReqsFromDOM();
  if (reqs.length === 0) { showToastWS('No requirements to print', ''); return; }
  var printWin = window.open('', '_blank');
  if (!printWin) { showToastWS('Popup blocked. Allow popups and try again.', ''); return; }
  var rows = reqs.map(function(r) {
    return '<tr><td>' + escapeHtml(r.id) + '</td><td>' + escapeHtml(r.type) + '</td>'
      + '<td>' + escapeHtml(r.priority || 'Med') + '</td><td>' + escapeHtml(r.actor || 'System') + '</td>'
      + '<td>' + escapeHtml(r.requirement) + '</td><td>' + escapeHtml(r.acceptance || '-') + '</td></tr>';
  }).join('');
  var parts = [
    '<!DOCTYPE html><html><head><meta charset="UTF-8"><title>AI Requirements</title>',
    '<style>',
    'body{font-family:Arial,sans-serif;padding:20px;}',
    'h1{color:#E53935;font-size:18px;}',
    'table{width:100%;border-collapse:collapse;margin-top:12px;}',
    'th,td{border:1px solid #ddd;padding:8px;font-size:12px;text-align:left;vertical-align:top;}',
    'th{background:#E53935;color:#fff;font-weight:700;}',
    'tr:nth-child(even) td{background:#fafafa;}',
    '.btn{margin-top:16px;padding:9px 20px;background:#E53935;color:#fff;border:none;',
    'border-radius:6px;font-size:13px;font-weight:600;cursor:pointer;}',
    '@media print{.btn{display:none;}}',
    '</style></head><body>',
    '<h1>AI Audit Gate - Generated Requirements</h1>',
    '<p style="font-size:12px;color:#666;margin-bottom:8px;">Generated: ' + new Date().toLocaleString() + ' | ISO 29148</p>',
    '<table><thead><tr>',
    '<th>ID</th><th>Type</th><th>Priority</th><th>Actor</th><th>Requirement</th><th>Acceptance Criteria</th>',
    '</tr></thead><tbody>' + rows + '</tbody></table>',
    '<button class="btn" onclick="window.print()">Print / Save as PDF</button>',
    '</body></html>'
  ];
  printWin.document.write(parts.join(''));
  printWin.document.close();
  printWin.focus();
  setTimeout(function() { printWin.print(); }, 500);
}

/* ── Audit score card (Audit mode) ── */
/* ── Audit category card helper ── */
function mkAuditCatCard(icon, count, label, color) {
  return '<div style="background:var(--surface);border:1px solid var(--border);border-radius:8px;padding:12px 8px;text-align:center;display:flex;flex-direction:column;align-items:center;gap:4px;">'
    + '<span class="material-symbols-outlined" style="font-size:22px;color:' + color + ';">' + icon + '</span>'
    + '<span style="font-size:24px;font-weight:800;color:' + color + ';line-height:1;">' + count + '</span>'
    + '<span style="font-size:10px;font-weight:600;color:var(--text-dim);letter-spacing:.04em;">' + label + '</span>'
    + '</div>';
}

function renderAuditCard(score, issues, rawText) {
  // Cache audit result for "View Full Results" button
  window._lastAuditResult = { score: score, issues: issues || [], rawText: rawText || '' };

  // If score is null (model said "no issues" or didn't follow SCORE/ISSUE format)
  // Show raw text but still provide the "View full report" button
  if (score === null) {
    return '<p><strong>Ket qua kiem dinh:</strong></p>'
      + renderRawText(rawText)
      + '<div class="ai-action-bar">'
      + '<button class="ai-act-btn primary" onclick="openAuditReport()">'
      + '<span class="material-symbols-outlined">fact_check</span>Xem ket qua chi tiet</button>'
      + '<button class="ai-act-btn" onclick="sendAuditMsg(\'Re-audit the document above. Output ONLY: SCORE: [0-100] then one ISSUE line per problem found: ISSUE: [REQ-ID] [F09-SYNTAX|F10-AMBIGUOUS|F11-CONFLICT|F12-MISSING] - [description] | FIX: [fix]. No prose.\')">'
      + '<span class="material-symbols-outlined">refresh</span>Re-audit (force format)</button>'
      + '</div>';
  }

  var scoreColor  = score >= 75 ? '#43A047' : score >= 60 ? '#FB8C00' : '#E53935';
  var scoreVerdict = score >= 75 ? 'Dat nguong an toan (>=75)' : 'Can chinh sua them -- nguong toi thieu 75';

  var f09 = issues.filter(function(i){ return i.category && i.category.indexOf('F09') !== -1; });
  var f10 = issues.filter(function(i){ return i.category && i.category.indexOf('F10') !== -1; });
  var f11 = issues.filter(function(i){ return i.category && i.category.indexOf('F11') !== -1; });
  var f12 = issues.filter(function(i){ return i.category && i.category.indexOf('F12') !== -1; });

  /* Category grid */
  var catGrid = '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin:12px 0;">'
    + mkAuditCatCard('error',           f09.length, 'Cu phap (F09)',   '#E53935')
    + mkAuditCatCard('help_outline',    f10.length, 'Mo ho (F10)',     '#FFB300')
    + mkAuditCatCard('compare_arrows',  f11.length, 'Mau thuan (F11)', '#FFA726')
    + mkAuditCatCard('space_dashboard', f12.length, 'Thieu truong (F12)', 'var(--text-muted)')
    + '</div>';

  /* Issues compact table (first 5) */
  var catCfg = {
    F09: { cls:'badge-syntax',   label:'Cu phap' },
    F10: { cls:'badge-ambig',    label:'Mo ho' },
    F11: { cls:'badge-conflict', label:'Mau thuan' },
    F12: { cls:'badge-auditing', label:'Thieu truong' }
  };
  var issueRows = issues.slice(0, 5).map(function(iss) {
    var cat = iss.category || '';
    var key = cat.indexOf('F09') !== -1 ? 'F09' : cat.indexOf('F10') !== -1 ? 'F10' : cat.indexOf('F11') !== -1 ? 'F11' : 'F12';
    var cfg = catCfg[key];
    var desc = escapeHtml((iss.description || '').slice(0, 90));
    if ((iss.description || '').length > 90) desc += '...';
    return '<tr style="border-bottom:1px solid var(--border);">'
      + '<td style="padding:7px 8px;font-family:monospace;font-size:11px;color:#E53935;font-weight:700;white-space:nowrap;">' + escapeHtml(iss.reqId || 'N/A') + '</td>'
      + '<td style="padding:7px 8px;"><span class="badge ' + cfg.cls + '" style="font-size:10px;">' + cfg.label + '</span></td>'
      + '<td style="padding:7px 8px;font-size:12px;color:var(--text);">' + desc + '</td>'
      + '</tr>';
  }).join('');
  var moreNote = issues.length > 5
    ? '<tr><td colspan="3" style="padding:6px 8px;font-size:11px;color:var(--text-dim);font-style:italic;">+ ' + (issues.length - 5) + ' van de khac. Click "Xem ket qua chi tiet" de xem tat ca.</td></tr>'
    : '';
  var issueTable = issues.length > 0
    ? '<div style="background:var(--surface);border:1px solid var(--border);border-radius:8px;overflow:hidden;margin-top:4px;">'
        + '<table style="width:100%;border-collapse:collapse;">'
        + '<thead><tr style="background:var(--nav-bg);">'
        + '<th style="padding:7px 8px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--text-dim);text-align:left;">REQ ID</th>'
        + '<th style="padding:7px 8px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--text-dim);text-align:left;">Loai loi</th>'
        + '<th style="padding:7px 8px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--text-dim);text-align:left;">Mo ta loi</th>'
        + '</tr></thead><tbody>' + issueRows + moreNote + '</tbody></table>'
        + '</div>'
    : '<p style="color:#43A047;font-weight:600;margin-top:10px;font-size:13px;">'
        + '<span class="material-symbols-outlined" style="font-size:14px;vertical-align:-2px;">check_circle</span>'
        + ' Khong phat hien loi. Tai lieu dat chuan ISO 29148.</p>';

  return '<p style="font-weight:700;color:var(--text);margin-bottom:10px;">Ket qua kiem dinh ISO 29148:</p>'
    /* Health Score card */
    + '<div style="background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:16px 18px;">'
      + '<div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:10px;">'
        + '<p style="font-size:11px;font-weight:700;letter-spacing:.08em;color:var(--text-dim);text-transform:uppercase;margin:0;">Health Score</p>'
        + '<span style="font-size:34px;font-weight:800;color:' + scoreColor + ';line-height:1;">' + score + '<span style="font-size:14px;color:var(--text-dim);font-weight:500;">/100</span></span>'
      + '</div>'
      + '<div style="height:7px;background:var(--border);border-radius:999px;overflow:hidden;margin-bottom:8px;">'
        + '<div style="height:100%;width:' + score + '%;background:linear-gradient(90deg,#E53935 0%,#FFC107 55%,#43A047 100%);border-radius:999px;transition:width .6s ease;"></div>'
      + '</div>'
      + '<p style="font-size:11px;color:' + scoreColor + ';font-weight:600;margin:0;">' + scoreVerdict + '</p>'
    + '</div>'
    + catGrid
    + issueTable
    /* Action bar */
    + '<div class="ai-action-bar" style="margin-top:12px;">'
      + '<button class="ai-act-btn primary" onclick="openAuditReport()">'
        + '<span class="material-symbols-outlined">fact_check</span>Xem ket qua chi tiet</button>'
      + '<button class="ai-act-btn" onclick="openProjectPicker()">'
        + '<span class="material-symbols-outlined">save</span>Save to Project</button>'
      + '<button class="ai-act-btn" onclick="sendAuditMsg(\'Fix all the issues identified above, then re-audit and output updated SCORE: and ISSUE: lines.\')">'
        + '<span class="material-symbols-outlined">rule</span>Re-audit</button>'
    + '</div>';
}

/* Open full audit report in audit.html, passing AI data via localStorage */
function openAuditReport() {
  var res = window._lastAuditResult;
  if (!res) { showToastWS('Chua co ket qua kiem dinh.', ''); return; }

  // score=null means model said "no issues found" — treat as perfect score
  var score  = (res.score !== null && res.score !== undefined) ? res.score : 100;
  var issues = res.issues || [];

  /* Map AI format (category=F09-SYNTAX...) to audit.html format (errType, severity) */
  function mapErrType(cat) {
    if (!cat) return 'missing';
    if (cat.indexOf('F09') !== -1) return 'syntax';
    if (cat.indexOf('F10') !== -1) return 'ambig';
    if (cat.indexOf('F11') !== -1) return 'conflict';
    return 'missing';
  }
  function mapSeverity(cat) {
    if (!cat) return 'medium';
    if (cat.indexOf('F11') !== -1) return 'critical';
    if (cat.indexOf('F09') !== -1) return 'high';
    if (cat.indexOf('F10') !== -1) return 'medium';
    return 'medium';
  }

  var auditRows = issues.map(function(iss, idx) {
    return {
      id:         iss.reqId || ('ISSUE-' + (idx + 1)),
      errType:    mapErrType(iss.category),
      severity:   mapSeverity(iss.category),
      desc:       iss.description || '',
      suggestion: iss.fix || '',
      expanded:   false,
    };
  });

  var payload = {
    score:     score,
    issues:    auditRows,
    timestamp: new Date().toLocaleString('vi-VN'),
    source:    'ReqBrain AI',
  };

  try {
    localStorage.setItem('aag-ai-audit-result', JSON.stringify(payload));
  } catch(e) {
    showToastWS('Khong the luu ket qua (localStorage full?).', '');
    return;
  }

  var w = window.open('../pages/audit.html', '_blank');
  if (!w) { showToastWS('Popup bi chan. Cho phep popup va thu lai.', ''); }
}

/* ── Raw text fallback ── */
function renderRawText(text) {
  return '<div style="font-size:13px;line-height:1.7;color:var(--text);white-space:pre-wrap;font-family:inherit;">'
    + escapeHtml(text) + '</div>';
}

/* ── Check AI provider status and update badge ── */
function checkAIStatus() {
  fetch('http://localhost:3001/api/ai/status')
    .then(function(r){ return r.json(); })
    .then(function(d) {
      var dot  = document.getElementById('aiStatusDot');
      var txt  = document.getElementById('aiStatusText');
      var badge = document.getElementById('aiStatusBadge');
      if (d.connected) {
        dot.style.background  = '#43A047';
        txt.style.color       = '#43A047';
        txt.textContent       = 'ReqBrain - ' + (d.provider || 'LM Studio') + ' - Ready';
        badge.style.background = 'rgba(67,160,71,.08)';
        badge.style.border    = '1px solid rgba(67,160,71,.2)';
      } else {
        dot.style.background  = '#FB8C00';
        txt.style.color       = '#FB8C00';
        txt.textContent       = 'ReqBrain - Offline - Start LM Studio server';
        badge.style.background = 'rgba(251,140,0,.08)';
        badge.style.border    = '1px solid rgba(251,140,0,.2)';
      }
    })
    .catch(function() {
      var txt = document.getElementById('aiStatusText');
      if (txt) txt.textContent = 'ReqBrain - Backend offline';
    });
}

/* ── Init ── */
(function initWorkspace() {
  try {
    // Pre-fill project from sessionStorage if coming from projects page
    var incomingProject = sessionStorage.getItem('auditProjectName');
    if (incomingProject) {
      var auditMode = sessionStorage.getItem('auditMode');
      if (auditMode === 'reaudit') {
        sessionStorage.removeItem('auditMode');
        setTimeout(function(){ switchMode('audit'); }, 50);
      }
    }

    checkAIStatus();
    renderSessions();
    renderMessages(currentSession);
  } catch(err) {
    console.error('[Workspace] Init error:', err);
    // Fallback: reset sessions and retry once
    try {
      localStorage.removeItem('aag-ws-sessions');
      ['1','2','3','4','5','6'].forEach(function(id){ localStorage.removeItem('aag-ws-msgs-' + id); });
      SESSIONS = JSON.parse(JSON.stringify(DEFAULT_SESSIONS));
      currentSession = 1;
      renderSessions();
      renderMessages(currentSession);
    } catch(e2) {
      console.error('[Workspace] Fallback render also failed:', e2);
      // Last resort: show sessions manually
      var list = document.getElementById('sessionList');
      if (list) {
        list.innerHTML = '<div style="padding:8px;color:var(--text-dim);font-size:11px;">[!] Error loading sessions.<br><a href="?" style="color:#E53935;">Click to reload</a></div>';
      }
    }
  }
})();
