const $ = (id) => document.getElementById(id);

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
    }
  } catch (err) {
    statusEl('err', `❌ ${escapeHtml(String(err.message || err))}`);
  } finally {
    btn.disabled = false;
  }
});

loadConfig();
loadList();
