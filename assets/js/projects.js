
/* ── Mock SRS document data per project ── */
var PROJECT_SRS = {
  'NAB Mobile Banking v2': [
    { id:'SRS-001', name:'SRS_MobileBanking_v1.2.pdf',  ver:'v1.2', date:'20/05/2026', author:'Minh Nguyen', score:84, reqs:142, errors:3,  status:'approved',
      reviewedBy:'Lan Anh (Senior BA)', reviewedAt:'22/05/2026 09:15', reviewStatus:'approved',
      comment:'Tai lieu dat chuan ISO 29148. Cac yeu cau xac thuc OTP ro rang va do luong duoc. Luu y cap nhat phien ban TLS len 1.3 o REQ-028. Co the trien khai sang giai doan phat trien.' },
    { id:'SRS-002', name:'SRS_MobileBanking_v1.1.pdf',  ver:'v1.1', date:'15/05/2026', author:'Minh Nguyen', score:72, reqs:138, errors:12, status:'auditing' },
    { id:'SRS-003', name:'SRS_MobileBanking_v1.0.pdf',  ver:'v1.0', date:'01/05/2026', author:'Anh Tran',    score:61, reqs:120, errors:22, status:'revision',
      reviewedBy:'Lan Anh (Senior BA)', reviewedAt:'05/05/2026 14:30', reviewStatus:'revision',
      comment:'Can lam ro acceptance criteria cho 22 yeu cau con thieu. REQ-015 va REQ-016 co mau thuan logic ve thoi gian timeout (3 phut vs 5 phut). Bo sung actor cho cac REQ-031 den REQ-038. Vui long chinh sua va gui lai trong vong 5 ngay lam viec.' },
  ],
  'Core Banking Upgrade 2.0': [
    { id:'SRS-004', name:'SRS_CoreBanking_v2.0.docx',   ver:'v2.0', date:'22/05/2026', author:'Anh Tran',    score:74, reqs:412, errors:34, status:'auditing' },
    { id:'SRS-005', name:'SRS_CoreBanking_Auth.pdf',     ver:'v1.0', date:'18/05/2026', author:'Hoa Le',      score:68, reqs:88,  errors:18, status:'auditing' },
    { id:'SRS-006', name:'SRS_CoreBanking_Payments.pdf', ver:'v1.0', date:'10/05/2026', author:'Quan Pham',   score:80, reqs:196, errors:8,  status:'approved' },
    { id:'SRS-007', name:'SRS_CoreBanking_Reports.pdf',  ver:'v1.0', date:'05/05/2026', author:'Minh Nguyen', score:55, reqs:64,  errors:22, status:'revision' },
    { id:'SRS-008', name:'SRS_CoreBanking_Infra.txt',    ver:'v1.0', date:'01/05/2026', author:'Anh Tran',    score:88, reqs:42,  errors:2,  status:'approved' },
  ],
  'TradePortal Migration': [
    { id:'SRS-009', name:'SRS_TradePortal_v1.0.pdf',    ver:'v1.0', date:'17/05/2026', author:'Hoa Le',      score:30, reqs:215, errors:48, status:'revision' },
    { id:'SRS-010', name:'REQ_TradePortal_Draft.docx',  ver:'draft',date:'12/05/2026', author:'Hoa Le',      score:null,reqs:98, errors:null,status:'draft'    },
  ],
  'Retail Loan Engine': [
    { id:'SRS-011', name:'SRS_LoanEngine_v2.1.pdf',     ver:'v2.1', date:'24/05/2026', author:'Quan Pham',   score:90, reqs:67,  errors:1,  status:'approved' },
    { id:'SRS-012', name:'SRS_LoanEngine_Risk.pdf',     ver:'v1.0', date:'14/05/2026', author:'Quan Pham',   score:88, reqs:44,  errors:3,  status:'approved' },
    { id:'SRS-013', name:'SRS_LoanEngine_Reporting.pdf',ver:'v1.0', date:'08/05/2026', author:'Anh Tran',    score:92, reqs:31,  errors:0,  status:'approved' },
    { id:'SRS-014', name:'SRS_LoanEngine_API.pdf',      ver:'v1.3', date:'03/05/2026', author:'Minh Nguyen', score:85, reqs:55,  errors:4,  status:'approved' },
  ],
  'Corporate IDAM': [
    { id:'SRS-015', name:'SRS_IDAM_Access.pdf',         ver:'v1.0', date:'19/05/2026', author:'Minh Nguyen', score:55, reqs:112, errors:15, status:'auditing' },
    { id:'SRS-016', name:'SRS_IDAM_Auth.pdf',           ver:'v0.9', date:'11/05/2026', author:'Anh Tran',    score:62, reqs:78,  errors:9,  status:'auditing' },
    { id:'SRS-017', name:'SRS_IDAM_Provisioning.docx',  ver:'draft',date:'07/05/2026', author:'Hoa Le',      score:null,reqs:45, errors:null,status:'draft'    },
  ],
  'Customer 360 View': [
    { id:'SRS-018', name:'SRS_C360_DataModel.pdf',      ver:'v1.4', date:'23/05/2026', author:'Quan Pham',   score:82, reqs:88,  errors:4,  status:'approved' },
    { id:'SRS-019', name:'SRS_C360_Analytics.pdf',      ver:'v1.2', date:'20/05/2026', author:'Minh Nguyen', score:80, reqs:66,  errors:5,  status:'approved' },
    { id:'SRS-020', name:'SRS_C360_Ingestion.pdf',      ver:'v1.0', date:'16/05/2026', author:'Anh Tran',    score:75, reqs:42,  errors:6,  status:'approved' },
    { id:'SRS-021', name:'SRS_C360_Dashboard.docx',     ver:'v1.0', date:'10/05/2026', author:'Hoa Le',      score:78, reqs:50,  errors:7,  status:'auditing' },
    { id:'SRS-022', name:'SRS_C360_API.pdf',            ver:'v2.0', date:'04/05/2026', author:'Quan Pham',   score:85, reqs:72,  errors:3,  status:'approved' },
    { id:'SRS-023', name:'SRS_C360_Legacy_Mapping.txt', ver:'v1.0', date:'01/05/2026', author:'Minh Nguyen', score:70, reqs:30,  errors:5,  status:'auditing' },
  ],
};

var PROJECT_META = {
  'NAB Mobile Banking v2':  { team:'Digital Banking Core',  score:85, status:'approved', reqs:142, errors:3  },
  'Core Banking Upgrade 2.0':{ team:'Core Infrastructure',  score:74, status:'auditing', reqs:412, errors:34 },
  'TradePortal Migration':  { team:'Capital Markets',       score:30, status:'revision', reqs:215, errors:48 },
  'Retail Loan Engine':     { team:'Credit Risk Tech',      score:90, status:'approved', reqs:67,  errors:1  },
  'Corporate IDAM':         { team:'Security Ops',          score:55, status:'auditing', reqs:112, errors:15 },
  'Customer 360 View':      { team:'Data Engineering',      score:80, status:'approved', reqs:198, errors:5  },
};

var currentProject = null;
var currentFilter  = 'all';
var ROLE = sessionStorage.getItem('userRole') || 'Senior BA'; // BA | Senior BA | PM

/* ─── Role-based permission helpers ─── */
var CAN_AUDIT   = (ROLE === 'BA');                       // create sessions, run/re-audit
var CAN_SUBMIT  = (ROLE === 'BA');                       // submit doc for approval
var CAN_UPLOAD  = (ROLE === 'BA');                       // upload SRS docs
var CAN_CREATE  = (ROLE === 'BA');                       // create new project
var CAN_REVIEW  = (ROLE === 'Senior BA');                // approve/reject submitted docs

/* Hide action buttons not available to this role (applied after DOM ready) */
document.addEventListener('DOMContentLoaded', function() {
  if (!CAN_CREATE) {
    var b = document.getElementById('btnNewProject');
    if (b) b.style.display = 'none';
  }
  if (!CAN_UPLOAD) {
    ['btnUploadSrs','btnUploadSrs2'].forEach(function(id){
      var el = document.getElementById(id);
      if (el) el.style.display = 'none';
    });
  }
  if (!CAN_AUDIT) {
    var nb = document.getElementById('btnNewAudit');
    if (nb) nb.style.display = 'none';
  }
  // Add read-only banner for PM
  if (ROLE === 'PM') {
    var notice = document.createElement('div');
    notice.style.cssText = 'background:rgba(25,118,210,.08);border:1px solid rgba(25,118,210,.2);border-radius:6px;padding:8px 14px;font-size:12px;color:#1976D2;display:flex;align-items:center;gap:8px;margin-bottom:16px;';
    notice.innerHTML = '<span class="material-symbols-outlined" style="font-size:16px;">visibility</span><span><strong>View-only mode.</strong> As PM you can monitor project health but audit actions are performed by the BA team.</span>';
    var mainEl = document.querySelector('#projects-list');
    if (mainEl) mainEl.insertBefore(notice, mainEl.firstElementChild);
  }
  // Sync page count
  applyFilters();
});

/* ─── Open project detail ─── */
function openProject(name) {
  currentProject = name;
  document.getElementById('projects-list').style.display = 'none';
  var det = document.getElementById('project-detail');
  det.style.display = 'block';
  det.classList.add('fade-in');

  document.getElementById('detailProjectName').textContent = name;
  document.title = name + ' - AI Audit Gate';

  renderDetailHeader(name);
  renderSrsTable(PROJECT_SRS[name] || []);
}

/* ─── Back to list ─── */
function backToProjects() {
  currentProject = null;
  document.getElementById('project-detail').style.display = 'none';
  document.getElementById('projects-list').style.display = 'block';
  document.title = 'Projects - AI Audit Gate';
}

/* ─── Render project detail header ─── */
function renderDetailHeader(name) {
  var m = PROJECT_META[name] || {};
  var sc = m.score || 0;
  var scColor = sc >= 75 ? '#43A047' : sc >= 60 ? '#FB8C00' : '#E53935';
  var statusBadge = {
    approved: '<span class="badge badge-approved"><span class="dot"></span>Approved</span>',
    auditing: '<span class="badge badge-auditing"><span class="dot"></span>In Audit</span>',
    revision: '<span class="badge badge-revision"><span class="dot pulse-dot"></span>Needs Revision</span>',
  }[m.status] || '';

  document.getElementById('detailHeader').innerHTML =
    '<div>' +
      '<h1 style="font-size:24px;font-weight:800;color:var(--text);letter-spacing:-.02em;margin-bottom:6px;">' + name + '</h1>' +
      '<p style="font-size:13px;color:var(--text-muted);margin-bottom:12px;">Team: ' + (m.team||'') + '</p>' +
      statusBadge +
    '</div>' +
    '<div style="display:flex;gap:14px;">' +
      '<div class="card" style="padding:16px 22px;text-align:center;min-width:90px;">' +
        '<div style="font-size:28px;font-weight:800;color:' + scColor + ';line-height:1;">' + sc + '</div>' +
        '<div style="font-size:10px;color:var(--text-dim);margin-top:3px;text-transform:uppercase;letter-spacing:.06em;">Health Score</div>' +
      '</div>' +
      '<div class="card" style="padding:16px 22px;text-align:center;min-width:90px;">' +
        '<div style="font-size:28px;font-weight:800;color:var(--text);line-height:1;">' + (PROJECT_SRS[name]||[]).length + '</div>' +
        '<div style="font-size:10px;color:var(--text-dim);margin-top:3px;text-transform:uppercase;letter-spacing:.06em;">SRS Docs</div>' +
      '</div>' +
      '<div class="card" style="padding:16px 22px;text-align:center;min-width:90px;">' +
        '<div style="font-size:28px;font-weight:800;color:#E53935;line-height:1;">' + (m.errors||0) + '</div>' +
        '<div style="font-size:10px;color:var(--text-dim);margin-top:3px;text-transform:uppercase;letter-spacing:.06em;">Open Issues</div>' +
      '</div>' +
    '</div>';
}

/* ─── Render SRS documents table ─── */
function renderSrsTable(docs) {
  var tbody = document.getElementById('srsTableBody');
  tbody.innerHTML = '';

  if (!docs.length) {
    tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;padding:40px;color:var(--text-dim);">No documents yet. Upload the first SRS document.</td></tr>';
    document.getElementById('srsCountLabel').textContent = '0 documents';
    return;
  }

  document.getElementById('srsCountLabel').textContent = docs.length + ' document' + (docs.length !== 1 ? 's' : '');

  docs.forEach(function(d) {
    var sc = d.score;
    var scColor = sc === null ? 'var(--text-dim)' : sc >= 75 ? '#43A047' : sc >= 60 ? '#FB8C00' : '#E53935';
    var scText  = sc === null ? '--' : sc + '/100';
    var ext = d.name.split('.').pop().toUpperCase();
    var extColor = { PDF:'#E53935', DOCX:'#1E88E5', TXT:'#43A047' }[ext] || 'var(--text-dim)';
    var statusBadge = {
      approved: '<span class="badge badge-approved" style="font-size:10px;">Approved</span>',
      auditing: '<span class="badge badge-auditing" style="font-size:10px;">In Audit</span>',
      revision: '<span class="badge badge-revision" style="font-size:10px;">Needs Revision</span>',
      draft:    '<span class="badge badge-nonfunc"  style="font-size:10px;">Draft</span>',
    }[d.status] || '';

    var tr = document.createElement('tr');
    var safeDocIdx = (PROJECT_SRS[currentProject] || []).indexOf(d);
    tr.innerHTML =
      '<td>' +
        '<div style="display:flex;align-items:center;gap:8px;">' +
          '<span style="font-size:10px;font-weight:800;background:' + extColor + ';color:#fff;padding:2px 5px;border-radius:3px;letter-spacing:.04em;flex-shrink:0;">' + ext + '</span>' +
          '<div>' +
            '<p class="doc-name-link" style="font-size:12px;font-weight:600;color:#E53935;cursor:pointer;text-decoration:underline;text-underline-offset:2px;" ' +
              'onclick="openDocPreview(' + safeDocIdx + ')">' +
              d.name +
            '</p>' +
            '<p style="font-size:10px;color:var(--text-dim);">' + d.id + '</p>' +
          '</div>' +
        '</div>' +
      '</td>' +
      '<td style="font-size:12px;color:var(--text-muted);">' + d.ver + '</td>' +
      '<td style="font-size:12px;color:var(--text-muted);">' + d.date + '</td>' +
      '<td style="font-size:12px;color:var(--text-muted);">' + d.author + '</td>' +
      '<td><span style="font-size:16px;font-weight:800;color:' + scColor + ';">' + scText + '</span></td>' +
      '<td style="font-size:13px;font-weight:600;color:var(--text);">' + d.reqs + '</td>' +
      '<td>' + statusBadge + '</td>' +
      '<td>' +
        '<div style="display:flex;gap:4px;flex-wrap:wrap;">' +
          /* View audit result - all roles can see if score exists */
          (d.score !== null
            ? '<button class="btn btn-ghost" style="padding:4px 9px;font-size:11px;" onclick="viewAuditResult(\'' + d.id + '\',\'' + d.name + '\')">' +
                '<span class="material-symbols-outlined" style="font-size:13px;">fact_check</span>View Audit</button>'
            : '') +
          /* View Senior BA review comments - all roles, only if reviewed */
          (d.comment
            ? '<button class="btn btn-ghost" style="padding:4px 9px;font-size:11px;" onclick="openCommentsModal(' + safeDocIdx + ')">' +
                '<span class="material-symbols-outlined" style="font-size:13px;">comment</span>Comments</button>'
            : '') +
          /* Run / Re-audit - BA only */
          (CAN_AUDIT
            ? '<button class="btn btn-ghost" style="padding:4px 9px;font-size:11px;" onclick="reAudit(\'' + d.id + '\',\'' + d.name + '\')">' +
                '<span class="material-symbols-outlined" style="font-size:13px;">' + (d.score !== null ? 'refresh' : 'play_arrow') + '</span>' +
                (d.score !== null ? 'Re-audit' : 'Run Audit') + '</button>'
            : '') +
          /* Submit for approval - BA only, not yet approved */
          (CAN_SUBMIT && d.status !== 'approved'
            ? '<button class="btn btn-success" style="padding:4px 9px;font-size:11px;" onclick="submitApproval(\'' + d.name + '\')">' +
                '<span class="material-symbols-outlined" style="font-size:13px;">send</span>Submit</button>'
            : '') +
          /* Review (approve/reject) - Senior BA only, for docs pending review */
          (CAN_REVIEW && (d.status === 'auditing' || d.status === 'revision')
            ? '<button class="btn btn-primary" style="padding:4px 9px;font-size:11px;" onclick="reviewDocument(\'' + d.id + '\',\'' + d.name + '\')">' +
                '<span class="material-symbols-outlined" style="font-size:13px;">rate_review</span>Review</button>'
            : '') +
          /* PM: read-only label if no actions available */
          (ROLE === 'PM' && d.score === null
            ? '<span style="font-size:11px;color:var(--text-dim);font-style:italic;">Pending audit</span>'
            : '') +
        '</div>' +
      '</td>';
    tbody.appendChild(tr);
  });
}

/* ─── SRS doc search ─── */
function filterDocs(query) {
  var q = query.toLowerCase();
  var rows = document.querySelectorAll('#srsTableBody tr');
  rows.forEach(function(row) {
    var text = row.textContent.toLowerCase();
    row.style.display = (!q || text.includes(q)) ? '' : 'none';
  });
}

/* ─── Audit/reaudit actions ─── */
function viewAuditResult(id, name) {
  sessionStorage.setItem('auditDocId', id);
  sessionStorage.setItem('auditDocName', name);
  sessionStorage.setItem('auditProjectName', currentProject);
  window.location.href = 'audit.html';
}

function reAudit(id, name) {
  sessionStorage.setItem('auditDocId', id);
  sessionStorage.setItem('auditDocName', name);
  sessionStorage.setItem('auditProjectName', currentProject);
  sessionStorage.setItem('auditMode', 'reaudit');
  window.location.href = 'ba-workspace.html';
}

function submitApproval(name) {
  sessionStorage.setItem('submitDocName', name);
  sessionStorage.setItem('submitProject', currentProject);
  window.location.href = 'approval.html';
}

/* Senior BA: review a submitted document */
function reviewDocument(id, name) {
  sessionStorage.setItem('reviewDocId', id);
  sessionStorage.setItem('reviewDocName', name);
  sessionStorage.setItem('reviewProject', currentProject);
  window.location.href = 'approval.html';
}

/* ─── Document Preview ─── */
var EXT_COLORS = { PDF:'#E53935', DOCX:'#1E88E5', TXT:'#43A047' };
var _currentPreviewDoc = null; // full doc object for download

/* Main entry: called from doc name link in table, idx = index in PROJECT_SRS[currentProject] */
function openDocPreview(idx) {
  var docs = PROJECT_SRS[currentProject] || [];
  var doc  = docs[idx];
  if (!doc) return;
  _currentPreviewDoc = doc;

  var ext   = doc.name.split('.').pop().toUpperCase();
  var color = EXT_COLORS[ext] || '#757575';

  // Populate modal header
  document.getElementById('pdfDocName').textContent = doc.name;
  document.getElementById('pdfDocMeta').textContent =
    doc.id + '  |  ' + doc.ver + '  |  ' + doc.author +
    (doc.date ? '  |  ' + doc.date : '');
  var badge = document.getElementById('pdfExtBadge');
  badge.textContent = ext;
  badge.style.background = color;

  // Show modal
  document.getElementById('pdfViewerModal').style.display = 'flex';
  document.getElementById('pdfLoading').style.display = 'flex';
  document.getElementById('pdfContentArea').style.display = 'none';
  document.getElementById('pdfFrame').style.display = 'none';
  document.getElementById('pdfFrame').src = '';

  // If this is a real API document (numeric ID), fetch with auth token and inject via srcdoc
  var isApiDoc = !isNaN(Number(doc.id)) && String(doc.id).trim() !== '';
  if (isApiDoc) {
    var _token = localStorage.getItem('aag-token') || '';
    fetch('window.AAG.base/documents/' + doc.id + '/view', {
      headers: _token ? { 'Authorization': 'Bearer ' + _token } : {}
    })
    .then(function(r) {
      if (!r.ok) return r.text().then(function(t) { throw new Error(t || ('HTTP ' + r.status)); });
      return r.text();
    })
    .then(function(html) {
      var frame = document.getElementById('pdfFrame');
      frame.removeAttribute('src');
      frame.srcdoc = html;
      frame.style.display = 'block';
      frame.style.flex = '1';
      document.getElementById('pdfLoading').style.display = 'none';
    })
    .catch(function(err) {
      document.getElementById('pdfLoading').style.display = 'none';
      var area = document.getElementById('pdfContentArea');
      area.innerHTML =
        '<div style="padding:40px 32px;text-align:center;">' +
          '<p style="font-size:36px;margin-bottom:12px;">⚠️</p>' +
          '<p style="font-size:15px;font-weight:700;color:#E53935;margin-bottom:6px;">Không thể tải tài liệu</p>' +
          '<p style="font-size:12px;color:#666;">' + (err.message || 'Unknown error') + '</p>' +
        '</div>';
      area.style.display = 'block';
      area.style.flex = '1';
    });
  } else {
    // Mock doc: render structured HTML preview
    setTimeout(function() {
      document.getElementById('pdfLoading').style.display = 'none';
      var area = document.getElementById('pdfContentArea');
      area.innerHTML = renderDocPreviewHTML(doc);
      area.style.display = 'block';
      area.style.flex = '1';
    }, 300); // slight delay for "loading" UX feel
  }
}

/* Generate a rich requirements-style preview for mock documents */
function renderDocPreviewHTML(doc) {
  var sc = doc.score;
  var scColor = sc === null ? 'var(--text-dim)' : sc >= 75 ? '#43A047' : sc >= 60 ? '#FB8C00' : '#E53935';
  var scLabel = sc === null ? 'Not audited yet' : sc >= 75 ? 'Above threshold (75)' : 'Below threshold -- revision required';

  // Generate mock requirements table rows based on document name
  var rows = generateMockRows(doc);

  var auditSummary = '';
  if (sc !== null) {
    var f09 = Math.round((100 - sc) * 0.12);
    var f10 = Math.round((100 - sc) * 0.18);
    var f11 = Math.round((100 - sc) * 0.06);
    var f12 = Math.round((100 - sc) * 0.10);
    auditSummary =
      '<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin:16px 0 20px;">' +
        mkStat(f09, 'Syntax (F09)', '#E53935') +
        mkStat(f10, 'Ambiguous (F10)', '#FB8C00') +
        mkStat(f11, 'Conflicts (F11)', '#FFB300') +
        mkStat(f12, 'Missing (F12)', 'var(--text-dim)') +
      '</div>';
  }

  return '<div>' +
    '<div style="display:flex;align-items:center;gap:16px;margin-bottom:20px;flex-wrap:wrap;">' +
      '<div style="background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:14px 20px;text-align:center;min-width:90px;">' +
        '<div style="font-size:30px;font-weight:800;color:' + scColor + ';line-height:1;">' + (sc !== null ? sc : '--') + '</div>' +
        '<div style="font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--text-dim);margin-top:3px;">Health Score</div>' +
      '</div>' +
      '<div style="flex:1;min-width:160px;">' +
        '<p style="font-size:12px;font-weight:700;color:' + scColor + ';margin-bottom:4px;">' + scLabel + '</p>' +
        '<p style="font-size:11px;color:var(--text-dim);">' + (doc.reqs || 0) + ' requirements &nbsp;|&nbsp; ' + (doc.errors || 0) + ' open issues &nbsp;|&nbsp; Version ' + doc.ver + '</p>' +
        (doc.reviewedBy
          ? '<p style="font-size:11px;color:var(--text-dim);margin-top:3px;">Reviewed by <strong>' + doc.reviewedBy + '</strong> on ' + doc.reviewedAt + '</p>'
          : '') +
      '</div>' +
    '</div>' +
    auditSummary +
    '<p style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--text-dim);margin-bottom:10px;">Sample Requirements (ISO 29148)</p>' +
    '<table class="req-gen-table">' +
      '<thead><tr><th>ID</th><th>Type</th><th>Priority</th><th>Actor</th><th>Requirement</th><th>Acceptance Criteria</th></tr></thead>' +
      '<tbody>' + rows + '</tbody>' +
    '</table>' +
    '<p style="font-size:11px;color:var(--text-dim);margin-top:10px;font-style:italic;">Showing sample rows. Open in full viewer to see all ' + (doc.reqs || 0) + ' requirements.</p>' +
  '</div>';
}

function mkStat(n, label, color) {
  return '<div style="background:var(--surface);border:1px solid var(--border);border-radius:8px;padding:10px;text-align:center;">' +
    '<div style="font-size:22px;font-weight:800;color:' + color + ';line-height:1;">' + n + '</div>' +
    '<div style="font-size:9px;font-weight:700;text-transform:uppercase;color:var(--text-dim);margin-top:3px;letter-spacing:.04em;">' + label + '</div>' +
  '</div>';
}

/* Generate 4 mock requirement rows matching the doc's domain */
function generateMockRows(doc) {
  var name = doc.name.toLowerCase();
  var domain = name.includes('banking') || name.includes('mobile') ? 'banking'
    : name.includes('loan') || name.includes('credit') ? 'loan'
    : name.includes('trade') || name.includes('portal') ? 'trade'
    : name.includes('idam') || name.includes('auth') ? 'auth'
    : name.includes('360') || name.includes('analytics') ? 'data'
    : 'core';

  var templates = {
    banking: [
      ['REQ-F001','Functional','High','User','The system shall allow authenticated users to initiate a domestic transfer using a registered bank account or card number within 5 seconds.','Transfer confirmed within 5 s; OTP required for amounts above 5,000,000 VND'],
      ['REQ-F002','Functional','High','System','The system shall encrypt all transaction data in transit using TLS 1.3 and at rest using AES-256.','Security scan passes with zero plaintext; penetration test report signed off'],
      ['REQ-NF001','Non-Functional','High','System','The system shall maintain 99.9% uptime measured on a rolling 30-day window excluding scheduled maintenance.','Monthly uptime report >= 99.9%; alerting active for downtime events'],
      ['REQ-NF002','Non-Functional','Medium','System','The system shall process all API requests within 500 ms at the 95th percentile under 500 concurrent users.','Load test at 500 RPS shows p95 <= 500 ms'],
    ],
    loan: [
      ['REQ-F001','Functional','High','User','The system shall assess loan eligibility based on credit score, income, and existing liabilities and return a decision within 30 seconds.','Decision returned <= 30 s for >= 95% of applications during peak hours'],
      ['REQ-F002','Functional','High','System','The system shall generate a loan repayment schedule and send it to the borrower\'s registered email within 2 minutes of approval.','Email received <= 2 min; repayment schedule matches approved terms'],
      ['REQ-NF001','Non-Functional','High','System','The system shall ensure all credit-scoring computations are auditable and produce an immutable audit log per loan application.','Audit log created per application; logs are read-only and retained for 7 years'],
      ['REQ-SEC001','Security','High','System','The system shall apply role-based access control ensuring only Credit Risk officers may override automated scoring decisions.','Unauthorised override attempt rejected; override logged with officer ID and timestamp'],
    ],
    auth: [
      ['REQ-F001','Functional','High','User','The system shall authenticate users with MFA using TOTP or hardware token in addition to username and password.','MFA challenge triggered on every login; bypass blocked'],
      ['REQ-F002','Functional','High','System','The system shall lock an account for 1800 seconds after 5 consecutive failed login attempts and notify the registered email.','Account locked after 5th failure; unlock email sent within 60 seconds'],
      ['REQ-NF001','Non-Functional','Medium','System','The system shall complete the full authentication flow within 3 seconds under a load of 1000 concurrent users.','Load test p95 <= 3 s at 1000 concurrent sessions'],
      ['REQ-SEC001','Security','High','System','The system shall rotate all session tokens every 15 minutes and invalidate tokens immediately on logout.','Session token rejected after 15 min idle; immediate invalidation on logout verified'],
    ],
    data: [
      ['REQ-F001','Functional','High','Analyst','The system shall ingest customer interaction data from at least 5 source systems in real time with a maximum lag of 60 seconds.','Data lag <= 60 s measured at p99; source system reconciliation passes daily'],
      ['REQ-F002','Functional','Medium','System','The system shall generate a unified 360-degree customer view refreshed every 5 minutes and accessible via REST API.','API returns refreshed profile within 5 min of any source event; schema versioned'],
      ['REQ-NF001','Non-Functional','High','System','The system shall retain raw event data for a minimum of 3 years in compliance with SBV Circular 09/2020.','Data retention policy enforced; automated deletion after 3 years + 30-day grace'],
      ['REQ-NF002','Non-Functional','Medium','System','The system shall support horizontal scaling to handle a 10x increase in ingestion volume without service degradation.','Stress test at 10x baseline load shows < 5% error rate; auto-scale triggers within 90 s'],
    ],
    trade: [
      ['REQ-F001','Functional','High','Trader','The system shall support real-time equity and bond order placement with execution confirmation within 2 seconds.','Order confirmed <= 2 s; rejection reason returned for failed orders'],
      ['REQ-F002','Functional','High','System','The system shall validate all trade orders against pre-set risk limits and reject orders exceeding the daily limit without manual override.','Orders exceeding daily limit rejected immediately; override requires Risk Manager approval'],
      ['REQ-NF001','Non-Functional','High','System','The system shall achieve a throughput of at least 10,000 orders per second during peak trading hours.','Load test at 10,000 OPS shows < 0.01% error rate; latency p99 <= 200 ms'],
      ['REQ-SEC001','Security','High','System','The system shall log all trade activity with an immutable audit trail compliant with SBV circular requirements.','Audit trail read-only; log integrity verified via cryptographic hash; retained 7 years'],
    ],
    core: [
      ['REQ-F001','Functional','High','System','The system shall process all core banking transactions within 3 seconds at the 95th percentile under peak load.','p95 latency <= 3 s at 2000 TPS in load test; error rate < 0.1%'],
      ['REQ-F002','Functional','High','User','The system shall provide a real-time transaction reconciliation report accessible to authorised operations staff.','Report updated every minute; discrepancies flagged within 5 minutes of detection'],
      ['REQ-NF001','Non-Functional','High','System','The system shall achieve 99.99% uptime excluding planned maintenance windows of no more than 4 hours per month.','Monthly uptime >= 99.99%; planned maintenance schedule published 5 days in advance'],
      ['REQ-SEC001','Security','High','System','The system shall encrypt all inter-service communication using mutual TLS and rotate certificates every 90 days.','mTLS enforced; certificate expiry monitoring in place; auto-rotation tested quarterly'],
    ],
  };

  var rows = (templates[domain] || templates.core);
  return rows.map(function(r) {
    var isNF  = r[1].toLowerCase().includes('non') || r[1].toLowerCase().includes('sec');
    var tyClass = isNF ? 'badge-nonfunc' : 'badge-auditing';
    var prClass = r[2] === 'High' ? 'badge-high' : r[2] === 'Low' ? 'badge-low' : 'badge-medium';
    return '<tr>' +
      '<td><span class="req-id">' + r[0] + '</span></td>' +
      '<td><span class="badge ' + tyClass + '" style="font-size:10px;">' + r[1] + '</span></td>' +
      '<td><span class="badge ' + prClass + '" style="font-size:10px;">' + r[2] + '</span></td>' +
      '<td style="font-size:11px;color:var(--text-muted);">' + r[3] + '</td>' +
      '<td style="font-size:12px;">' + r[4] + '</td>' +
      '<td style="font-size:11px;color:var(--text-muted);">' + r[5] + '</td>' +
    '</tr>';
  }).join('');
}

function onPdfLoaded() {
  document.getElementById('pdfLoading').style.display = 'none';
  var frame = document.getElementById('pdfFrame');
  frame.style.display = 'block';
  frame.style.flex = '1';
}

function closePdfViewer() {
  document.getElementById('pdfViewerModal').style.display = 'none';
  var frame = document.getElementById('pdfFrame');
  frame.removeAttribute('srcdoc');
  frame.src = '';
  frame.style.display = 'none';
  document.getElementById('pdfContentArea').style.display = 'none';
  document.getElementById('pdfLoading').style.display = 'flex';
  _currentPreviewDoc = null;
}

function openPdfNewTab() {
  if (!_currentPreviewDoc) return;
  var doc = _currentPreviewDoc;
  var isApiDoc = !isNaN(Number(doc.id)) && String(doc.id).trim() !== '';
  if (isApiDoc) {
    // Re-fetch with auth and open as blob URL so new tab can render it
    var _token = localStorage.getItem('aag-token') || '';
    fetch('window.AAG.base/documents/' + doc.id + '/view', {
      headers: _token ? { 'Authorization': 'Bearer ' + _token } : {}
    })
    .then(function(r) { return r.text(); })
    .then(function(html) {
      var blob = new Blob([html], { type: 'text/html' });
      var url  = URL.createObjectURL(blob);
      var w = window.open(url, '_blank');
      // Revoke after tab has had time to load
      if (w) { setTimeout(function() { URL.revokeObjectURL(url); }, 5000); }
    })
    .catch(function() { showToast('Không thể mở tab mới', 'error'); });
  } else {
    // Open the rendered preview in a new tab
    var w = window.open('', '_blank');
    w.document.write('<!DOCTYPE html><html><head><meta charset="UTF-8"><title>' + doc.name + '</title>'
      + '<style>body{font-family:Arial,sans-serif;padding:20px;max-width:1200px;margin:0 auto;}'
      + 'table{width:100%;border-collapse:collapse;}th{background:#E53935;color:#fff;padding:8px 10px;font-size:11px;text-align:left;}'
      + 'td{padding:8px 10px;border-bottom:1px solid #eee;font-size:12px;vertical-align:top;}'
      + '.req-id{font-family:monospace;background:#f0f0f0;padding:2px 5px;border-radius:3px;font-size:11px;}'
      + '</style></head><body>'
      + '<h2 style="color:#E53935;">' + doc.name + '</h2>'
      + document.getElementById('pdfContentArea').innerHTML
      + '</body></html>');
    w.document.close();
  }
}

/* Download = generate requirements PDF print dialog */
function downloadPdfDoc() {
  if (!_currentPreviewDoc) return;
  var doc = _currentPreviewDoc;
  var isApiDoc = !isNaN(Number(doc.id)) && String(doc.id).trim() !== '';
  if (isApiDoc) {
    // Fetch with auth, open blob URL, then trigger print
    var _token = localStorage.getItem('aag-token') || '';
    showToast('Đang chuẩn bị bản in...', 'success');
    fetch('window.AAG.base/documents/' + doc.id + '/view', {
      headers: _token ? { 'Authorization': 'Bearer ' + _token } : {}
    })
    .then(function(r) { return r.text(); })
    .then(function(html) {
      var blob = new Blob([html], { type: 'text/html' });
      var url  = URL.createObjectURL(blob);
      var w = window.open(url, '_blank');
      if (w) {
        w.onload = function() { w.print(); };
        setTimeout(function() { URL.revokeObjectURL(url); }, 10000);
      }
    })
    .catch(function() { showToast('Không thể tải tài liệu để in', 'error'); });
    return;
  }
  // Build printable HTML from the current preview
  var w = window.open('', '_blank');
  if (!w) { showToast('Popup blocked. Allow popups and try again.', ''); return; }
  w.document.write('<!DOCTYPE html><html><head><meta charset="UTF-8"><title>' + doc.name + ' - Requirements</title>'
    + '<style>'
    + 'body{font-family:Arial,sans-serif;padding:20px;color:#1a1a2e;}'
    + 'h1{color:#E53935;font-size:18px;margin-bottom:4px;}'
    + '.meta{font-size:11px;color:#666;margin-bottom:16px;}'
    + 'table{width:100%;border-collapse:collapse;margin-top:10px;}'
    + 'th{background:#E53935;color:#fff;font-size:11px;font-weight:700;text-transform:uppercase;padding:8px 10px;text-align:left;}'
    + 'td{padding:8px 10px;border-bottom:1px solid #eee;font-size:12px;vertical-align:top;line-height:1.5;}'
    + 'tr:nth-child(even) td{background:#fafafa;}'
    + '.btn{margin-top:16px;padding:9px 20px;background:#E53935;color:#fff;border:none;border-radius:6px;font-size:13px;font-weight:600;cursor:pointer;}'
    + '@media print{.btn{display:none;}}'
    + '</style></head><body>'
    + '<h1>' + doc.name + '</h1>'
    + '<p class="meta">Author: ' + doc.author + ' &nbsp;|&nbsp; Version: ' + doc.ver
    + ' &nbsp;|&nbsp; Health Score: ' + (doc.score || '--') + '/100'
    + ' &nbsp;|&nbsp; Generated: ' + new Date().toLocaleString() + '</p>'
    + '<table><thead><tr><th>ID</th><th>Type</th><th>Priority</th><th>Actor</th><th>Requirement</th><th>Acceptance Criteria</th></tr></thead>'
    + '<tbody>' + generateMockRows(doc) + '</tbody></table>'
    + '<button class="btn" onclick="window.print()">Print / Save as PDF</button>'
    + '</body></html>');
  w.document.close();
  w.focus();
  setTimeout(function() { w.print(); }, 500);
  showToast('PDF preview opened', 'success');
}

/* ─── Comments Modal ─── */
function openCommentsModal(idx) {
  var docs = PROJECT_SRS[currentProject] || [];
  var doc  = docs[idx];
  if (!doc || !doc.comment) return;

  var statusColor = doc.reviewStatus === 'approved' ? '#43A047' : doc.reviewStatus === 'rejected' ? '#E53935' : '#FB8C00';
  var statusLabel = doc.reviewStatus === 'approved' ? 'Approved' : doc.reviewStatus === 'rejected' ? 'Rejected' : 'Needs Revision';

  document.getElementById('commentsBody').innerHTML =
    '<div style="display:flex;align-items:center;gap:10px;padding:12px;background:var(--surface);border-radius:8px;border:1px solid var(--border);">' +
      '<div style="width:36px;height:36px;border-radius:50%;background:#E53935;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;color:#fff;flex-shrink:0;">SBA</div>' +
      '<div>' +
        '<p style="font-size:13px;font-weight:700;color:var(--text);margin-bottom:2px;">' + (doc.reviewedBy || 'Senior BA') + '</p>' +
        '<p style="font-size:11px;color:var(--text-dim);">' + (doc.reviewedAt || '') + '</p>' +
      '</div>' +
      '<span style="margin-left:auto;display:inline-block;padding:4px 10px;border-radius:12px;font-size:11px;font-weight:700;background:' + statusColor + '22;color:' + statusColor + ';border:1px solid ' + statusColor + '44;">' + statusLabel + '</span>' +
    '</div>' +
    '<div style="padding:14px 16px;background:var(--surface-low);border-radius:8px;border-left:3px solid ' + statusColor + ';">' +
      '<p style="font-size:12px;font-weight:700;color:var(--text-dim);text-transform:uppercase;letter-spacing:.06em;margin-bottom:8px;">Review Comment</p>' +
      '<p style="font-size:13px;color:var(--text);line-height:1.7;">' + (doc.comment || '--') + '</p>' +
    '</div>' +
    '<div style="padding:10px 14px;background:var(--surface);border-radius:8px;border:1px solid var(--border);display:flex;align-items:center;gap:8px;">' +
      '<span class="material-symbols-outlined" style="font-size:16px;color:var(--text-dim);">description</span>' +
      '<div style="flex:1;">' +
        '<p style="font-size:12px;font-weight:600;color:var(--text);">' + doc.name + '</p>' +
        '<p style="font-size:10px;color:var(--text-dim);">' + doc.ver + ' &nbsp;|&nbsp; Health Score: ' + (doc.score || '--') + '/100</p>' +
      '</div>' +
    '</div>';

  document.getElementById('commentsModal').style.display = 'flex';
}

function closeCommentsModal() {
  document.getElementById('commentsModal').style.display = 'none';
}

function openAuditWorkspace() {
  sessionStorage.setItem('auditProjectName', currentProject);
  window.location.href = 'ba-workspace.html';
}

/* ─── Project list filters ─── */
function setFilter(filter, btn) {
  currentFilter = filter;
  document.querySelectorAll('.filter-chip').forEach(function(c){ c.classList.remove('active'); });
  btn.classList.add('active');
  applyFilters();
}

function filterCards(query) { applyFilters(query); }

function applyFilters(query) {
  var q = (query !== undefined ? query : (document.querySelector('.filter-bar .search-input')?.value || '')).toLowerCase();
  var cards = document.querySelectorAll('.project-card');
  var visible = 0;
  cards.forEach(function(card) {
    var matchFilter = currentFilter === 'all' || card.dataset.status === currentFilter;
    var matchQuery  = !q || (card.dataset.name || '').toLowerCase().includes(q);
    var show = matchFilter && matchQuery;
    card.style.display = show ? '' : 'none';
    if (show) visible++;
  });
  var total = cards.length;
  var pi = document.getElementById('pageInfo');
  if (pi) pi.textContent = 'Showing ' + visible + ' of ' + total + ' project' + (total !== 1 ? 's' : '');
}

/* ─── Global topnav search ─── */
function handleGlobalSearch(q) {
  // If on detail view, filter docs
  if (currentProject) {
    filterDocs(q);
  } else {
    filterCards(q);
  }
}

/* ─── Create New Project (real) ─── */
function showNewProjectModal() {
  document.getElementById('newProjName').value = '';
  document.getElementById('newProjTeam').value = '';
  document.getElementById('newProjNameErr').style.display = 'none';
  document.getElementById('newProjectModal').style.display = 'flex';
  setTimeout(function(){ document.getElementById('newProjName').focus(); }, 50);
}
function closeNewProjectModal() {
  document.getElementById('newProjectModal').style.display = 'none';
}
function confirmCreateProject() {
  var name = document.getElementById('newProjName').value.trim();
  var team = document.getElementById('newProjTeam').value.trim() || 'Unassigned';
  if (!name) {
    document.getElementById('newProjNameErr').style.display = 'block';
    document.getElementById('newProjName').focus();
    return;
  }
  // Register in data
  PROJECT_META[name] = { team: team, score: 0, status: 'auditing', reqs: 0, errors: 0 };
  PROJECT_SRS[name]  = [];
  // Build new card
  var grid = document.getElementById('projectGrid');
  var card = document.createElement('div');
  card.className = 'card card-hover-lift project-card fade-in';
  card.dataset.status = 'auditing';
  card.dataset.name   = name;
  card.style.cssText  = 'padding:22px;display:flex;flex-direction:column;gap:16px;';
  card.innerHTML =
    '<div style="display:flex;justify-content:space-between;align-items:flex-start;">' +
      '<div style="flex:1;min-width:0;">' +
        '<h3 style="font-size:15px;font-weight:700;color:var(--text);margin-bottom:4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' + name + '</h3>' +
        '<p style="font-size:11px;color:var(--text-dim);">Team: ' + team + '</p>' +
      '</div>' +
      '<div class="health-gauge-wrap" style="width:54px;height:54px;flex-shrink:0;margin-left:10px;">' +
        '<svg width="54" height="54" class="gauge-ring"><circle cx="27" cy="27" r="21" stroke-width="5" class="gauge-track"/></svg>' +
        '<div class="gauge-label"><span style="font-size:13px;font-weight:800;color:var(--text-dim);">--</span></div>' +
      '</div>' +
    '</div>' +
    '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;padding:12px 0;border-top:1px solid var(--border);border-bottom:1px solid var(--border);">' +
      '<div><span style="font-size:10px;font-weight:700;letter-spacing:.06em;color:var(--text-dim);text-transform:uppercase;display:block;margin-bottom:3px;">SRS Docs</span><span style="font-size:20px;font-weight:800;color:var(--text);">0</span></div>' +
      '<div><span style="font-size:10px;font-weight:700;letter-spacing:.06em;color:var(--text-dim);text-transform:uppercase;display:block;margin-bottom:3px;">Open Issues</span><span style="font-size:20px;font-weight:800;color:var(--text-muted);">--</span></div>' +
    '</div>' +
    '<div style="display:flex;justify-content:space-between;align-items:center;">' +
      '<span class="badge badge-auditing"><span class="dot"></span>New</span>' +
      '<button class="btn btn-outline" style="padding:6px 12px;font-size:11px;" onclick="openProject(\'' + name.replace(/'/g,"\\'") + '\')">Open <span class="material-symbols-outlined" style="font-size:14px;">arrow_forward</span></button>' +
    '</div>';
  grid.appendChild(card);
  closeNewProjectModal();
  showToast('Project "' + name + '" created', 'success');
}

/* ─── Upload SRS Modal ─── */
var pendingUploadFile = null;

function openUploadModal() {
  pendingUploadFile = null;
  document.getElementById('uploadProjectName').textContent = currentProject || '--';
  document.getElementById('uploadFileChip').style.display  = 'none';
  document.getElementById('uploadDropZone').style.display  = 'block';
  document.getElementById('uploadDropZone').style.borderColor = '';
  document.getElementById('srsFileHidden').value = '';
  document.getElementById('actionSave').checked = true;
  document.getElementById('uploadSrsModal').style.display  = 'flex';
}
function closeUploadModal() {
  document.getElementById('uploadSrsModal').style.display = 'none';
  pendingUploadFile = null;
}
function handleSrsFileSelect(input) {
  if (!input.files || !input.files[0]) return;
  pendingUploadFile = input.files[0];
  document.getElementById('uploadFileName').textContent = pendingUploadFile.name;
  document.getElementById('uploadFileChip').style.display = 'block';
  document.getElementById('uploadDropZone').style.display = 'none';
}
function handleDropUpload(e) {
  e.preventDefault();
  var file = e.dataTransfer.files[0];
  if (!file) return;
  pendingUploadFile = file;
  document.getElementById('uploadFileName').textContent = file.name;
  document.getElementById('uploadFileChip').style.display = 'block';
  document.getElementById('uploadDropZone').style.display = 'none';
}
function clearUploadFile() {
  pendingUploadFile = null;
  document.getElementById('srsFileHidden').value = '';
  document.getElementById('uploadFileChip').style.display = 'none';
  document.getElementById('uploadDropZone').style.display = 'block';
}
function updateUploadAction() {
  var isSave  = document.getElementById('actionSave').checked;
  document.getElementById('actionSaveLabel').style.borderColor  = isSave  ? '#E53935' : '';
  document.getElementById('actionAuditLabel').style.borderColor = !isSave ? '#E53935' : '';
}
function confirmUpload() {
  var isAudit = document.getElementById('actionAudit').checked;
  var proj = currentProject;
  if (isAudit) {
    // Go to workspace in audit mode, pre-configured with project
    sessionStorage.setItem('auditProjectName', proj);
    sessionStorage.setItem('auditMode', 'reaudit');
    if (pendingUploadFile) sessionStorage.setItem('auditFileName', pendingUploadFile.name);
    closeUploadModal();
    window.location.href = 'ba-workspace.html';
  } else {
    // Add a draft document to the SRS list
    if (!pendingUploadFile && !proj) { showToast('Select a file first', ''); return; }
    var fileName = pendingUploadFile ? pendingUploadFile.name : 'Uploaded_SRS.pdf';
    var newDoc = {
      id:     'SRS-' + String(Date.now()).slice(-4),
      name:   fileName,
      ver:    'draft',
      date:   new Date().toLocaleDateString('vi-VN'),
      author: sessionStorage.getItem('userName') || 'Minh Nguyen',
      score:  null, reqs: 0, errors: null, status: 'draft'
    };
    if (PROJECT_SRS[proj]) PROJECT_SRS[proj].unshift(newDoc);
    renderSrsTable(PROJECT_SRS[proj] || []);
    closeUploadModal();
    showToast('"' + fileName + '" added to ' + proj, 'success');
  }
}

/* ─── Toast ─── */
function showToast(msg, type) {
  var t = document.createElement('div');
  t.className = 'toast' + (type ? ' ' + type : '');
  t.innerHTML = '<span class="material-symbols-outlined" style="font-size:18px;">' +
    (type === 'success' ? 'check_circle' : 'info') + '</span>' + msg;
  document.body.appendChild(t);
  setTimeout(function(){ t.remove(); }, 3000);
}

/* ═══════════════════════════════════════════════════════════
   LIVE API INTEGRATION
   Replaces static project cards with real data from backend.
   Falls back to existing static HTML if API unavailable.
   ═══════════════════════════════════════════════════════════ */

/* Map project name → backend numeric ID (populated by loadProjectsFromAPI) */
var PROJECT_ID_MAP = {};

/* Build one project card HTML from API project object */
function buildProjectCard(p) {
  var score      = p.healthScore || null;
  var scoreColor = score === null ? 'var(--text-dim)' : (score >= 75 ? '#43A047' : score >= 60 ? '#FFC107' : '#E53935');
  var dashOffset = score === null ? 131.9 : (131.9 * (1 - score / 100));
  var docCount   = p._count ? p._count.documents : (p.documents ? p.documents.length : 0);
  var issues     = p.openIssues != null ? p.openIssues : '--';

  var statusMap  = { approved: 'badge-approved', auditing: 'badge-auditing', revision: 'badge-revision' };
  var badgeClass = statusMap[p.status] || 'badge-auditing';
  var labelMap   = { approved: 'Approved', auditing: 'In Audit', revision: 'Needs Revision' };
  var label      = labelMap[p.status] || p.status;
  var pulse      = p.status === 'revision' ? ' pulse-dot' : '';

  var safeName = (p.name || '').replace(/\\/g,'\\\\').replace(/'/g,"\\'");

  return '<div class="card card-hover-lift project-card" data-status="' + p.status + '" data-name="' + (p.name || '') + '"'
    + ' style="padding:22px;display:flex;flex-direction:column;gap:16px;">'
    + '<div style="display:flex;justify-content:space-between;align-items:flex-start;">'
      + '<div style="flex:1;min-width:0;">'
        + '<h3 style="font-size:15px;font-weight:700;color:var(--text);margin-bottom:4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' + p.name + '</h3>'
        + '<p style="font-size:11px;color:var(--text-dim);">Team: ' + (p.team || '--') + '</p>'
      + '</div>'
      + '<div class="health-gauge-wrap" style="width:54px;height:54px;flex-shrink:0;margin-left:10px;">'
        + '<svg width="54" height="54" class="gauge-ring">'
        + '<circle cx="27" cy="27" r="21" stroke-width="5" class="gauge-track"/>'
        + (score !== null ? '<circle cx="27" cy="27" r="21" stroke-width="5" stroke="' + scoreColor + '" stroke-dasharray="131.9" stroke-dashoffset="' + dashOffset.toFixed(1) + '" class="gauge-arc"/>' : '')
        + '</svg>'
        + '<div class="gauge-label"><span style="font-size:13px;font-weight:800;color:' + scoreColor + ';">' + (score !== null ? score : '--') + '</span></div>'
      + '</div>'
    + '</div>'
    + '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;padding:12px 0;border-top:1px solid var(--border);border-bottom:1px solid var(--border);">'
      + '<div><span style="font-size:10px;font-weight:700;letter-spacing:.06em;color:var(--text-dim);text-transform:uppercase;display:block;margin-bottom:3px;">SRS Docs</span><span style="font-size:20px;font-weight:800;color:var(--text);">' + docCount + '</span></div>'
      + '<div><span style="font-size:10px;font-weight:700;letter-spacing:.06em;color:var(--text-dim);text-transform:uppercase;display:block;margin-bottom:3px;">Open Issues</span><span style="font-size:20px;font-weight:800;color:#E53935;">' + issues + '</span></div>'
    + '</div>'
    + '<div style="display:flex;justify-content:space-between;align-items:center;">'
      + '<span class="badge ' + badgeClass + '"><span class="dot' + pulse + '"></span>' + label + '</span>'
      + '<button class="btn btn-outline" style="padding:6px 12px;font-size:11px;" onclick="openProjectById(' + (p.id || 0) + ',\'' + safeName + '\')">Open <span class="material-symbols-outlined" style="font-size:14px;">arrow_forward</span></button>'
    + '</div>'
    + '</div>';
}

/* Load projects from API and rebuild the card grid */
async function loadProjectsFromAPI() {
  if (typeof AAG === 'undefined') return;
  var result = await AAG.get('/projects');
  if (!result || !result.ok) return; // silently fall back to static HTML

  var projects = result.data.projects || [];
  var grid = document.getElementById('projectGrid');
  if (!grid || !projects.length) return;

  /* Replace static HTML with dynamic cards */
  grid.innerHTML = '';
  projects.forEach(function(p) {
    /* Calculate open issues from documents */
    if (p.documents) {
      p.openIssues = p.documents.reduce(function(s, d) {
        return s + (d.auditResult ? d.auditResult.issuesCount : 0);
      }, 0);
      /* Best health score = avg of all scored docs */
      var scored = p.documents.filter(function(d){ return d.healthScore !== null; });
      p.healthScore = scored.length
        ? Math.round(scored.reduce(function(s,d){ return s + d.healthScore; }, 0) / scored.length)
        : null;
    }
    PROJECT_ID_MAP[p.name] = p.id;
    /* Update PROJECT_META for legacy code */
    PROJECT_META[p.name] = {
      team:   p.team,
      score:  p.healthScore,
      status: p.status,
      reqs:   p._count ? p._count.documents : 0,
      errors: p.openIssues || 0,
    };
    grid.innerHTML += buildProjectCard(p);
  });

  /* Update count label */
  var label = document.getElementById('projectCountLabel');
  if (label) label.textContent = projects.length + ' project' + (projects.length !== 1 ? 's' : '') + ' managed in the system';

  /* Reapply current filter */
  applyFilters();
}

/* Open project by API id (called from dynamic cards) */
function openProjectById(id, name) {
  currentProject = name;
  document.getElementById('projects-list').style.display = 'none';
  var det = document.getElementById('project-detail');
  det.style.display = 'block';
  det.classList.add('fade-in');
  document.getElementById('detailProjectName').textContent = name;
  document.title = name + ' - AI Audit Gate';
  renderDetailHeader(name);
  /* Try loading real documents from API */
  loadDocumentsFromAPI(id, name);
}

/* Load real SRS documents for a project */
async function loadDocumentsFromAPI(projectId, projectName) {
  if (typeof AAG === 'undefined' || !projectId) {
    renderSrsTable(PROJECT_SRS[projectName] || []);
    return;
  }
  var result = await AAG.get('/projects/' + projectId);
  if (!result || !result.ok) {
    renderSrsTable(PROJECT_SRS[projectName] || []);
    return;
  }
  var docs = (result.data.project || {}).documents || [];
  /* Map API doc format → existing renderSrsTable format */
  var mapped = docs.map(function(d) {
    var appr = d.approval;
    return {
      id:           d.id,
      name:         d.name,
      ver:          d.version,
      date:         new Date(d.uploadedAt).toLocaleDateString('en-GB'),
      author:       d.author ? d.author.fullName : '--',
      score:        d.healthScore,
      reqs:         d.reqCount || 0,
      errors:       d.auditResult ? d.auditResult.issuesCount : null,
      status:       d.status,
      // Review comments from Senior BA approval record
      comment:      appr && appr.notes ? appr.notes : null,
      reviewedBy:   appr && appr.status !== 'pending' ? 'Senior BA' : null,
      reviewedAt:   appr && appr.reviewedAt ? new Date(appr.reviewedAt).toLocaleString('en-GB') : null,
      reviewStatus: appr ? appr.status : null,
    };
  });
  /* Update local cache BEFORE rendering so openDocPreview/openCommentsModal can look up by index */
  PROJECT_SRS[projectName] = mapped;
  renderSrsTable(mapped);
}

/* Update confirmCreateProject to also call the API */
var _origConfirmCreate = confirmCreateProject;
confirmCreateProject = async function() {
  var name = document.getElementById('newProjName').value.trim();
  var team = document.getElementById('newProjTeam').value.trim() || 'Unassigned';
  if (!name) {
    document.getElementById('newProjNameErr').style.display = 'block';
    document.getElementById('newProjName').focus();
    return;
  }
  if (typeof AAG !== 'undefined') {
    var result = await AAG.post('/projects', { name, team });
    if (result && result.ok) {
      var p = result.data.project;
      PROJECT_ID_MAP[p.name] = p.id;
      PROJECT_META[p.name] = { team: p.team, score: null, status: p.status, reqs: 0, errors: 0 };
      PROJECT_SRS[p.name]  = [];
      var grid = document.getElementById('projectGrid');
      p._count = { documents: 0 };
      var wrapper = document.createElement('div');
      wrapper.innerHTML = buildProjectCard(p);
      var card = wrapper.firstElementChild;
      if (card) {
        card.classList.add('fade-in');
        grid.insertBefore(card, grid.firstChild);
      }
      closeNewProjectModal();
      showToast('Project "' + name + '" created', 'success');
      applyFilters();
      return;
    }
  }
  /* Fallback to original local-only behavior */
  _origConfirmCreate();
};

/* Bootstrap: load API projects on page ready */
document.addEventListener('DOMContentLoaded', function() {
  loadProjectsFromAPI();
});
