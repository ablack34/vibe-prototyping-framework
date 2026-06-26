// Per-user GitHub sign-in gate — shared by both pages.
//
// Usage at the top of a page's init:
//   const me = await vibeEnsureAuth();
//   if (!me) return;            // gate is showing → stop initialising the page
//   // me = { login, name, authRequired }
//
// In legacy single-user mode (the server has no OAuth configured) /api/me returns
// authRequired:false and this is a no-op that just reports the service identity, so
// today's local-dev / single-tenant container behaviour is byte-for-byte unchanged.
// In multi-user mode it renders a full-page sign-in gate when there's no session, or
// an identity chip + Sign out in the top bar once the designer is signed in.
(function () {
  let cached = null;

  function escapeAttr(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, (c) => (
      { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  // Pull a one-shot ?auth_error= off the URL (set by the server on a failed sign-in)
  // and strip it so a refresh doesn't keep showing it.
  function takeAuthError() {
    const err = new URLSearchParams(location.search).get('auth_error');
    if (!err) return '';
    const u = new URL(location.href);
    u.searchParams.delete('auth_error');
    history.replaceState(null, '', u.toString());
    return err;
  }

  function renderGate(errMsg) {
    if (document.getElementById('vibe-auth-gate')) return;
    const gate = document.createElement('div');
    gate.id = 'vibe-auth-gate';
    gate.className = 'auth-gate';
    gate.innerHTML =
      '<div class="auth-card">' +
        '<div class="auth-logo">◆</div>' +
        '<h1>VIBE Web Surface</h1>' +
        '<p class="auth-sub">Sign in with your GitHub account to start and drive prototyping ' +
        'engagements. Everything you create lands in <strong>your</strong> GitHub account and ' +
        'runs on <strong>your</strong> Copilot seat — nothing touches anyone else’s.</p>' +
        (errMsg ? '<p class="auth-err">⚠️ ' + escapeAttr(errMsg) + '</p>' : '') +
        '<a class="auth-btn" href="/auth/login">' +
          '<svg viewBox="0 0 16 16" width="18" height="18" aria-hidden="true">' +
          '<path fill="currentColor" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 ' +
          '7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 ' +
          '1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 ' +
          '0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 ' +
          '2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 ' +
          '1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 ' +
          '2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8Z"/></svg>' +
          'Sign in with GitHub' +
        '</a>' +
      '</div>';
    document.body.appendChild(gate);
  }

  function renderChip(user) {
    if (document.getElementById('vibe-id-chip')) return;
    const bar = document.querySelector('.topbar');
    if (!bar) return;
    const chip = document.createElement('div');
    chip.id = 'vibe-id-chip';
    chip.className = 'id-chip';
    chip.innerHTML =
      '<img class="id-avatar" src="https://avatars.githubusercontent.com/' +
        encodeURIComponent(user.login) + '?s=48" alt="" referrerpolicy="no-referrer" />' +
      '<span class="id-name">' + escapeAttr(user.name || user.login) + '</span>' +
      '<a class="id-signout" href="/auth/logout" title="Sign out">Sign out</a>';
    bar.appendChild(chip);
  }

  // Admins get an "Access" entry point in the top bar (manage who can sign in).
  // Idempotent + shared by both pages, so it shows wherever the top bar renders.
  function renderAdminLink(user) {
    if (!user || !user.isAdmin) return;
    if (document.getElementById('vibe-admin-link')) return;
    if (location.pathname === '/access.html') return; // already on the page
    const bar = document.querySelector('.topbar');
    if (!bar) return;
    const a = document.createElement('a');
    a.id = 'vibe-admin-link';
    a.className = 'id-admin';
    a.href = '/access.html';
    a.textContent = 'Access';
    a.title = 'Manage who can sign in';
    bar.appendChild(a);
  }

  window.vibeEnsureAuth = async function () {
    if (cached) return cached;
    let me;
    try { me = await (await fetch('/api/me')).json(); }
    catch { me = { authRequired: false, user: { login: '', name: '' } }; }

    if (!me.authRequired) {
      cached = Object.assign({ authRequired: false }, me.user || { login: '', name: '' });
      renderAdminLink(cached);
      return cached;
    }
    if (me.user) {
      renderChip(me.user);
      cached = Object.assign({ authRequired: true }, me.user);
      renderAdminLink(cached);
      return cached;
    }
    renderGate(takeAuthError());
    return null;
  };

  // Resilience: if any gated /api/ call comes back 401 mid-session (the session
  // expired or the container restarted and dropped it), surface the sign-in gate
  // instead of letting the page fail silently.
  const _fetch = window.fetch.bind(window);
  window.fetch = async function (input, init) {
    const res = await _fetch(input, init);
    try {
      const url = typeof input === 'string' ? input : (input && input.url) || '';
      if (res.status === 401 && url.indexOf('/api/') === 0 && !document.getElementById('vibe-auth-gate')) {
        cached = null;
        renderGate('Your session expired — please sign in again.');
      }
    } catch { /* never let the interceptor break a real request */ }
    return res;
  };
})();
