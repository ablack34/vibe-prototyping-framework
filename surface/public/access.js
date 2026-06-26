// Access admin screen — manage who can sign in (allow-list) and who can manage the
// list (admins). All mutations go through POST /api/access, which the server guards
// to admins only. The durable access.json in the store is the source of truth, so
// changes here take effect on the next sign-in with no redeploy.
const $ = (id) => document.getElementById(id);
let state = null;

function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function toast(msg, ok) {
  const t = $('toast');
  t.hidden = false;
  t.textContent = msg;
  t.className = 'status ' + (ok ? 'ok' : 'err');
  clearTimeout(toast._t);
  toast._t = setTimeout(() => { t.hidden = true; }, 4000);
}

function tag(login, { list, removable, badge }) {
  const wrap = document.createElement('span');
  wrap.className = 'access-tag' + (login === state.me ? ' me' : '');
  wrap.innerHTML =
    '<img class="access-av" src="https://avatars.githubusercontent.com/' +
      encodeURIComponent(login) + '?s=40" alt="" referrerpolicy="no-referrer" />' +
    '<span class="access-login">' + esc(login) + (login === state.me ? ' <span class="access-you">(you)</span>' : '') + '</span>' +
    (badge ? '<span class="access-badge">' + esc(badge) + '</span>' : '');
  if (removable) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'access-rm';
    b.title = 'Remove ' + login;
    b.textContent = '×';
    b.onclick = () => mutate(list === 'admin' ? 'removeAdmin' : 'removeAllowed', login);
    wrap.appendChild(b);
  }
  return wrap;
}

function render() {
  const roots = new Set(state.rootAdmins || []);

  // Admins (root admins first, shown locked)
  const adminsEl = $('admins');
  adminsEl.innerHTML = '';
  const adminList = [...new Set([...(state.rootAdmins || []), ...state.adminLogins])];
  adminList.forEach((l) => {
    const isRoot = roots.has(l);
    adminsEl.appendChild(tag(l, { list: 'admin', removable: !isRoot, badge: isRoot ? '🔒 permanent' : '' }));
  });
  if (!adminList.length) adminsEl.innerHTML = '<p class="muted small">No admins yet.</p>';

  // Allowed to sign in
  const allowedEl = $('allowed');
  allowedEl.innerHTML = '';
  state.allowedLogins.forEach((l) => allowedEl.appendChild(
    tag(l, { list: 'allowed', removable: true, badge: roots.has(l) ? 'admin' : '' })));
  $('open-note').hidden = state.allowedLogins.length > 0;
  $('allowed-count').textContent = state.allowedLogins.length
    ? (state.allowedLogins.length + (state.allowedLogins.length === 1 ? ' account' : ' accounts'))
    : 'open to anyone';
  if (!state.allowedLogins.length) allowedEl.innerHTML = '<p class="muted small">Empty — anyone with a GitHub account can sign in.</p>';
}

async function load() {
  let res;
  try { res = await fetch('/api/access'); }
  catch { toast('Could not reach the server.'); return; }
  if (res.status === 403) {
    $('intro').hidden = true;
    const d = $('denied');
    d.hidden = false;
    d.textContent = 'You need to be an admin to manage access. Ask a current admin to add you.';
    return;
  }
  if (!res.ok) { toast('Could not load access (' + res.status + ').'); return; }
  state = await res.json();
  $('intro').textContent = state.oauth
    ? 'Add or remove the GitHub accounts that can sign in to this surface, and choose who else can manage this list.'
    : 'Sign-in isn’t enabled on this surface, so the allow-list isn’t enforced right now — but you can curate it here for when it is.';
  $('panels').hidden = false;
  render();
}

async function mutate(action, login) {
  let res;
  try {
    res = await fetch('/api/access', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, login }),
    });
  } catch { toast('Could not reach the server.'); return; }
  const body = await res.json().catch(() => ({}));
  if (!res.ok) { toast(body.error || ('Failed (' + res.status + ').')); return; }
  state = Object.assign(state || {}, body);
  render();
  toast('Updated.', true);
}

document.querySelectorAll('.access-add').forEach((f) => {
  f.addEventListener('submit', (e) => {
    e.preventDefault();
    const login = f.login.value.trim();
    if (!login) return;
    mutate(f.dataset.list === 'admin' ? 'addAdmin' : 'addAllowed', login);
    f.login.value = '';
  });
});

(async function init() {
  const me = await vibeEnsureAuth();
  if (!me) return; // sign-in gate is showing
  load();
})();
