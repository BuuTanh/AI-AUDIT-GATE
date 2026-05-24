/* AI Audit Gate — Theme & Language Module */
(function () {

  /* ── Theme ── */
  function applyTheme(theme) {
    document.documentElement.classList.toggle('light', theme === 'light');
    localStorage.setItem('aag-theme', theme);
    const icon = document.getElementById('themeIcon');
    const btn  = document.getElementById('themeBtn');
    if (icon) icon.textContent = theme === 'light' ? 'dark_mode' : 'light_mode';
    if (btn)  btn.title = theme === 'light' ? 'Chế độ tối / Dark mode' : 'Chế độ sáng / Light mode';
  }

  window.toggleTheme = function () {
    applyTheme(localStorage.getItem('aag-theme') === 'light' ? 'dark' : 'light');
  };

  /* ── i18n Translations ── */
  var T = {
    vi: {
      'nav.workspace':    'AI Workspace',
      'nav.dashboard':    'Dashboard',
      'nav.projects':     'Dự án',
      'nav.requirements': 'Yêu cầu',
      'nav.audit':        'Kiểm định',
      'nav.approval':     'Phê duyệt',
      'nav.reports':      'Báo cáo',
      'nav.settings':     'Cài đặt',
      'nav.logout':       'Đăng xuất',
      'nav.org':          'NAB Vietnam',
      'nav.org-sub':      'Audit Division',
    },
    en: {
      'nav.workspace':    'AI Workspace',
      'nav.dashboard':    'Dashboard',
      'nav.projects':     'Projects',
      'nav.requirements': 'Requirements',
      'nav.audit':        'Audit',
      'nav.approval':     'Approval',
      'nav.reports':      'Reports',
      'nav.settings':     'Settings',
      'nav.logout':       'Sign Out',
      'nav.org':          'NAB Vietnam',
      'nav.org-sub':      'Audit Division',
    }
  };

  function applyLang(lang) {
    localStorage.setItem('aag-lang', lang);
    document.documentElement.setAttribute('lang', lang);
    var btn = document.getElementById('langBtn');
    if (btn) btn.textContent = lang === 'vi' ? 'EN' : 'VI';
    var dict = T[lang] || T.vi;
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var val = dict[el.dataset.i18n];
      if (!val) return;
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = val;
      } else {
        el.textContent = val;
      }
    });
  }

  window.toggleLang = function () {
    applyLang(localStorage.getItem('aag-lang') === 'en' ? 'vi' : 'en');
  };

  /* ── Init ── */
  var savedLang = localStorage.getItem('aag-lang') || 'en';
  applyLang(savedLang);

  /* Sync theme icon state (theme class was already applied via inline script in <head>) */
  var savedTheme = localStorage.getItem('aag-theme') || 'dark';
  var themeIcon = document.getElementById('themeIcon');
  var themeBtn  = document.getElementById('themeBtn');
  if (themeIcon) themeIcon.textContent = savedTheme === 'light' ? 'dark_mode' : 'light_mode';
  if (themeBtn)  themeBtn.title = savedTheme === 'light' ? 'Chế độ tối / Dark mode' : 'Chế độ sáng / Light mode';

})();
