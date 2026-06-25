const $ = (id) => document.getElementById(id);
const SOURCE = new URLSearchParams(location.search).get('source');

function toKebab(s) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

let defaultOwner = '';

async function loadConfig() {
  try {
    const cfg = await (await fetch('/api/config')).json();
    defaultOwner = cfg.defaultOwner || '';
    if (!$('owner').value) $('owner').value = defaultOwner;
    updatePreview();
  } catch { /* server prints the real error */ }
}

function updatePreview() {
  const owner = $('owner').value.trim() || defaultOwner || 'owner';
  const repo = toKebab($('name').value) || '<name>';
  $('preview').textContent = `${owner}/${repo}`;
}

function statusEl(kind, html) {
  const el = $('status');
  el.hidden = false;
  el.className = `status ${kind}`;
  el.innerHTML = html;
}

function itemRow(e) {
  const badge = e.enginePresent
    ? '<span class="badge engine">engine ✓</span>'
    : '<span class="badge noengine">engine ?</span>';
  return `
    <div class="item">
      <div>
        <div class="name">${escapeHtml(e.name)}</div>
        <div class="repo">${escapeHtml(e.repo)}${e.private ? ' · private' : ''}</div>
      </div>
      <div class="right">
        ${badge}
        <a href="${e.htmlUrl}" target="_blank" rel="noopener">Open on GitHub →</a>
      </div>
    </div>`;
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));
}

async function loadList() {
  const list = await (await fetch('/api/engagements')).json();
  const box = $('list');
  if (!list.length) {
    box.innerHTML = '<p class="muted empty">None yet — create your first above.</p>';
    return;
  }
  box.innerHTML = list.map(itemRow).join('');
}

function boardPill(status) {
  const map = {
    GREEN: ['Ready', 'pill-green'],
    INCOMPLETE: ['In progress', 'pill-amber'],
    NOT_STARTED: ['Not started', 'pill-grey'],
  };
  const [label, cls] = map[status] || [status, 'pill-grey'];
  return `<span class="pill ${cls}">${label}</span>`;
}

function dots(deliverables) {
  return deliverables.map((d) => {
    const cls = !d.present ? 'dot-empty' : (d.stale ? 'dot-stale' : (d.signedOffBy ? 'dot-signed' : 'dot-present'));
    return `<span class="dot ${cls}" title="${escapeHtml(d.title)}"></span>`;
  }).join('');
}

function boardCard(e) {
  const present = e.deliverables.filter((d) => d.present).length;
  const total = e.deliverables.length;
  const handoff = e.handoffReady
    ? '<span class="hand ready">hand-off ready ✓</span>'
    : '<span class="hand">phases 1–3</span>';
  const repoLine = e.repo ? `<div class="bc-repo">${escapeHtml(e.repo)}</div>` : '';
  const warn = e.secretSet === false
    ? '<span class="bc-warn" title="Engine secret not set on this repo — phases cannot run until it is reprovisioned">⚠ not runnable</span>'
    : '';
  const href = `/engagement.html?kebab=${encodeURIComponent(e.kebab)}${SOURCE === 'local' ? '&source=local' : ''}`;
  const label = escapeHtml(e.name || e.kebab);
  return `<div class="board-card-wrap">
    <a class="board-card" href="${href}">
    <div class="bc-main">
      <div class="bc-name">${label} ${warn}</div>
      ${repoLine}
      <div class="bc-gates">Discover ${boardPill(e.gates.discover.status)} &nbsp; Disrupt ${boardPill(e.gates.disrupt.status)}</div>
    </div>
    <div class="bc-right">
      <div class="bc-dots" title="${present}/${total} deliverables generated">${dots(e.deliverables)}</div>
      <div class="bc-foot">${handoff}<span class="bc-open">Open dashboard →</span></div>
    </div>
    </a>
    <button class="bc-remove" type="button" data-kebab="${escapeHtml(e.kebab)}" data-name="${label}" title="Remove from this board (does not delete the GitHub repo)" aria-label="Remove ${label} from board">×</button>
  </div>`;
}

async function loadBoard() {
  const box = $('board');
  try {
    const board = await (await fetch(`/api/board${SOURCE === 'local' ? '?source=local' : ''}`)).json();
    if (!board.length) {
      box.innerHTML = '<p class="muted empty">No engagements yet — create one above and it appears here, reading live gate state from its own repo.</p>';
      $('board-hint').textContent = '';
      return;
    }
    box.innerHTML = board.map(boardCard).join('');
    const src = SOURCE === 'local' ? ' · local folders' : '';
    $('board-hint').textContent = `${board.length} engagement${board.length > 1 ? 's' : ''} · live gate state${src}`;
  } catch (e) {
    box.innerHTML = `<p class="muted empty">Could not load board: ${escapeHtml(String(e.message || e))}</p>`;
  }
}

async function removeEngagement(kebab, name) {
  const ok = confirm(
    `Remove "${name}" from this board?\n\n` +
    `This only forgets the pointer on this surface. It does NOT delete the ` +
    `GitHub repository or any of its contents.`
  );
  if (!ok) return;
  try {
    const res = await fetch(`/api/engagements/${encodeURIComponent(kebab)}`, { method: 'DELETE' });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      alert(`Could not remove "${name}": ${data.error || ('HTTP ' + res.status)}`);
      return;
    }
    loadBoard();
    loadList();
  } catch (err) {
    alert(`Could not remove "${name}": ${err.message || err}`);
  }
}

$('board').addEventListener('click', (ev) => {
  const btn = ev.target.closest('.bc-remove');
  if (!btn) return;
  ev.preventDefault();
  ev.stopPropagation();
  removeEngagement(btn.dataset.kebab, btn.dataset.name);
});

$('name').addEventListener('input', updatePreview);
$('owner').addEventListener('input', updatePreview);

$('form').addEventListener('submit', async (ev) => {
  ev.preventDefault();
  const btn = $('submit');
  btn.disabled = true;
  statusEl('working', '⏳ Creating repository from the template…');

  const payload = {
    name: $('name').value,
    owner: $('owner').value.trim() || undefined,
    private: $('private').checked,
    description: $('description').value.trim() || undefined,
  };

  try {
    const res = await fetch('/api/engagements', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) {
      statusEl('err', `❌ ${escapeHtml(data.error || 'Failed')}${data.detail ? `<br><span class="muted">${escapeHtml(data.detail)}</span>` : ''}`);
    } else {
      const engine = data.enginePresent ? 'engine shipped ✓' : 'engine not detected ⚠️';
      statusEl('ok',
        `✅ Created <strong>${escapeHtml(data.repo)}</strong> — ${engine}<br>` +
        `<a href="${data.htmlUrl}" target="_blank" rel="noopener">Open on GitHub →</a>`);
      $('name').value = '';
      $('description').value = '';
      updatePreview();
      loadList();
      loadBoard();
    }
  } catch (err) {
    statusEl('err', `❌ ${escapeHtml(String(err.message || err))}`);
  } finally {
    btn.disabled = false;
  }
});

async function init() {
  const me = await vibeEnsureAuth();
  if (!me) return; // sign-in gate is showing — stop here
  // In multi-user mode every engagement is created in the signed-in designer's own
  // account, so lock the owner field to their login (the server enforces this too).
  if (me.authRequired && me.login) {
    const o = $('owner');
    o.value = me.login;
    o.readOnly = true;
    o.classList.add('locked');
    o.title = 'Engagements are always created in your own GitHub account.';
  }
  loadConfig();
  loadList();
  loadBoard();
}
init();
