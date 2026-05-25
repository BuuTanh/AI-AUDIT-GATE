/* AI Audit Gate — Shared Navigation Logic + Role-Based Access */
(function () {

  var page = window.location.pathname.split('/').pop() || 'dashboard.html';
  var role = sessionStorage.getItem('userRole') || 'Senior BA';
  var name = sessionStorage.getItem('userName') || 'Minh Nguyen';
  var initials = name.split(' ').map(function(w){ return w[0] || ''; }).join('').slice(0, 2).toUpperCase();

  /* ── Populate user info ── */
  document.querySelectorAll('[data-user-name]').forEach(function(el){ el.textContent = name; });
  document.querySelectorAll('[data-user-role]').forEach(function(el){ el.textContent = role; });
  document.querySelectorAll('[data-user-initials]').forEach(function(el){ el.textContent = initials; });

  /* ── Nav items — simplified: Projects is the hub for requirements & audit ── */
  var NAV_ITEMS = [
    { href: 'ba-workspace.html', icon: 'smart_toy',     tip: 'AI Workspace', roles: ['BA'] },
    { href: 'dashboard.html',    icon: 'dashboard',      tip: 'Dashboard',    roles: ['BA', 'Senior BA', 'PM'] },
    { href: 'projects.html',     icon: 'folder_copy',    tip: 'Projects',     roles: ['BA', 'Senior BA', 'PM'] },
    /* Approval accessed via Projects → Review button, not direct nav */
    { href: 'reports.html',      icon: 'analytics',      tip: 'Reports',      roles: ['BA', 'Senior BA'] },
  ];

  /* ── Shared logout helper ── */
  function doLogout() {
    var token = localStorage.getItem('aag-token');
    if (token) {
      fetch(window.AAG.base + '/auth/logout', {
        method: 'POST',
        headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' },
      }).catch(function(){});
    }
    localStorage.removeItem('aag-token');
    localStorage.removeItem('aag-user');
    sessionStorage.clear();
    window.location.href = 'login.html';
  }

  /* ── Skip injection on ba-workspace (has its own icon nav inside .ws-shell) ── */
  if (document.querySelector('.ws-shell')) {
    document.querySelectorAll('[data-action="logout"]').forEach(function(el) {
      el.addEventListener('click', function(e) {
        e.preventDefault();
        doLogout();
      });
    });
    return;
  }

  /* ── Build icon nav HTML ── */
  var topItems = NAV_ITEMS.filter(function(item){ return item.roles.indexOf(role) !== -1; });

  var navHTML = '<nav class="page-icon-nav" id="pageIconNav">';
  topItems.forEach(function(item) {
    var isActive = (item.href === page);
    navHTML += '<a href="' + item.href + '" class="ws-icon-btn' + (isActive ? ' active' : '') + '" data-tip="' + item.tip + '">'
             + '<span class="material-symbols-outlined">' + item.icon + '</span>'
             + '</a>';
  });
  navHTML += '<div style="flex:1;"></div>';
  navHTML += '<a href="#" class="ws-icon-btn" data-tip="Settings"><span class="material-symbols-outlined">settings</span></a>';
  navHTML += '<a href="login.html" class="ws-icon-btn" data-action="logout" data-tip="Sign Out"><span class="material-symbols-outlined">logout</span></a>';
  navHTML += '</nav>';

  /* ── Inject after topnav ── */
  var header = document.querySelector('header.topnav');
  if (header) {
    header.insertAdjacentHTML('afterend', navHTML);
  }

  /* ── Logout handler (event delegation on body) ── */
  document.addEventListener('click', function(e) {
    var el = e.target.closest('[data-action="logout"]');
    if (el) {
      e.preventDefault();
      doLogout();
    }
  });

})();
