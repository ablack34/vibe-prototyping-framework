// Engagement dashboard: fetches live gate state + artifact markdown for one
// engagement and renders the phase timeline, gate tiles, deliverable cards, and
// a slide-over artifact viewer.

const PHASES = ['Preparation', 'Discover', 'Disrupt', 'Build', 'Deliver'];
const params = new URLSearchParams(location.search);
const kebab = params.get('kebab');
const source = params.get('source');

let DELIVERABLES = [];
const GENERATABLE = new Set(['personas.md', 'problem-statement.md', 'current-state-journey.md']);
let RUNNING = false;
let SOURCES = [];
let SRC_KINDS = {};

function pill(status) {
  const map = {
    GREEN: ['Ready', 'pill-green'],
    INCOMPLETE: ['In progress', 'pill-amber'],
    NOT_STARTED: ['Not started', 'pill-grey'],
  };
  const [label, cls] = map[status] || [status, 'pill-grey'];
  return `<span class="pill ${cls}">${label}</span>`;
}

function gradeBadge(grade, pass) {
  if (!grade) return '<span class="grade grade-none">—</span>';
  const cls = pass ? 'grade-pass' : 'grade-fail';
  return `<span class="grade ${cls}">Grade ${grade}</span>`;
}

function phaseState(gates) {
  const d = gates.discover.status;
  const di = gates.disrupt.status;
  const discover = d === 'GREEN' ? 'done' : (gates.discover.artifactsPresent === '0/3' ? 'pending' : 'active');
  const disrupt = di === 'GREEN' ? 'done' : (discover === 'done' ? 'active' : 'pending');
  const build = di === 'GREEN' ? 'active' : 'pending';
  return { Preparation: 'done', Discover: discover, Disrupt: disrupt, Build: build, Deliver: 'pending' };
}

function renderTimeline(gates) {
  const st = phaseState(gates);
  document.getElementById('phasebar').innerHTML = PHASES.map((p, idx) => {
    const s = st[p];
    const mark = s === 'done' ? '✓' : (idx + 1);
    const owner = idx < 3 ? 'Designer / PM' : 'Engineer';
    return `<div class="phase ${s}">
      <div class="phase-dot">${mark}</div>
      <div class="phase-label">${p}</div>
      <div class="phase-owner">${owner}</div>
    </div>`;
  }).join('<div class="phase-link"></div>');
}

function deliverableCard(d) {
  let state, stateCls;
  if (!d.present) { state = 'Not generated yet'; stateCls = 'st-missing'; }
  else if (d.stale) { state = 'Edited after sign-off — needs re-approval'; stateCls = 'st-stale'; }
  else if (d.signedOffBy) { state = `Signed off by ${d.signedOffBy}${d.signedOffAt ? ' · ' + d.signedOffAt : ''}`; stateCls = 'st-signed'; }
  else { state = 'Awaiting approval'; stateCls = 'st-await'; }

  return `<div class="dcard ${d.present ? '' : 'dcard-empty'}">
    <div class="card-top">
      <div class="card-title">${d.title}</div>
      ${gradeBadge(d.grade, d.gradePass)}
    </div>
    <div class="card-state ${stateCls}">${state}</div>
    <div class="card-actions">
      <button class="btn-view" data-file="${d.file}" ${d.present ? '' : 'disabled'}>View</button>
      ${!d.present && GENERATABLE.has(d.file) ? `<button class="btn-gen" data-gen="${d.file}">Generate</button>` : ''}
      ${d.present && d.gradePass && !d.signedOffBy && !d.stale ? `<button class="btn-approve" data-approve="${d.file}">Approve</button>` : ''}
    </div>
  </div>`;
}

function gateBlock(name, gate, deliverables) {
  const counts = `${gate.artifactsPresent} present · ${gate.gradePassing} grade-passing${gate.stale ? ' · ⚠ stale' : ''}`;
  return `<div class="gate">
    <div class="gate-head">
      <h2>${name} ${pill(gate.status)}</h2>
      <div class="gate-counts">${counts}</div>
    </div>
    <div class="cards">${deliverables.map(deliverableCard).join('')}</div>
  </div>`;
}

function openViewer(file) {
  const d = DELIVERABLES.find((x) => x.file === file);
  if (!d || !d.present) return;
  document.getElementById('viewer-title').textContent = d.title;
  const meta = d.signedOffBy ? `Signed off by ${d.signedOffBy}` : (d.present ? 'Awaiting approval' : '');
  document.getElementById('viewer-meta').innerHTML = `${gradeBadge(d.grade, d.gradePass)} <span class="vm">${meta}</span>`;
  document.getElementById('viewer-body').innerHTML = window.renderMarkdown(d.markdown || '');
  document.getElementById('viewer').hidden = false;
}
function closeViewer() { document.getElementById('viewer').hidden = true; }

function banner(html, kind = 'info') {
  const el = document.getElementById('genbanner');
  if (!el) return;
  if (!html) { el.hidden = true; el.innerHTML = ''; return; }
  el.hidden = false;
  el.className = `genbanner ${kind}`;
  el.innerHTML = html;
}

function setGenButtons(disabled) {
  document.querySelectorAll('.btn-gen').forEach((b) => (b.disabled = disabled));
}

// ---- sources: the designer's own customer materials that ground Discover ----
async function loadSources() {
  try {
    const r = await fetch(`/api/sources?kebab=${kebab}`);
    if (!r.ok) throw new Error();
    const d = await r.json();
    SOURCES = d.sources || [];
    SRC_KINDS = d.kinds || {};
  } catch { SOURCES = []; }
  renderSources();
}

function srcKindLabel(k) { return (SRC_KINDS[k] && SRC_KINDS[k].label) || k; }

function renderSources() {
  const el = document.getElementById('sources');
  if (!el) return;
  const list = SOURCES.length
    ? SOURCES.map((s) => `<div class="src-card">
        <span class="src-kind">${srcKindLabel(s.kind)}</span>
        <span class="src-name">${s.name}</span>
        ${s.htmlUrl ? `<a class="src-link" href="${s.htmlUrl}" target="_blank" rel="noopener">View ↗</a>` : ''}
      </div>`).join('')
    : `<div class="src-empty">No sources yet — <strong>Generate</strong> will fall back to the Contoso demo data. Add your customer's materials to ground the deliverables in their world.</div>`;
  const opts = Object.entries(SRC_KINDS).map(([k, v]) => `<option value="${k}">${v.label}</option>`).join('');

  el.innerHTML = `
    <div class="sources-head">
      <div>
        <h2>Sources</h2>
        <p class="sources-sub">Discover reads everything here before it generates. Add the customer's brief, transcripts, questionnaire and research so the deliverables are grounded in their world — not demo data.</p>
      </div>
      <button class="btn-add-src" id="src-toggle" type="button">+ Add source</button>
    </div>
    <div class="src-list">${list}</div>
    <form class="src-form" id="src-form" hidden>
      <div class="src-row">
        <label class="grow">Type
          <select id="src-kind">${opts}</select>
        </label>
        <label class="grow" id="src-name-wrap">Name
          <input id="src-name" placeholder="e.g. Kickoff call" autocomplete="off" />
        </label>
      </div>
      <label>Content
        <textarea id="src-content" rows="8" placeholder="Paste the brief, transcript or notes here…"></textarea>
      </label>
      <div class="src-actions">
        <label class="src-file-btn">📄 Load text file
          <input type="file" id="src-file" accept=".md,.txt,.vtt,.csv,text/*" hidden />
        </label>
        <span class="grow"></span>
        <button type="button" class="btn-ghost" id="src-cancel">Cancel</button>
        <button type="submit" class="btn-save-src">Add source</button>
      </div>
      <div class="src-status" id="src-status" hidden></div>
    </form>`;
  wireSources();
}

function wireSources() {
  const form = document.getElementById('src-form');
  const toggle = document.getElementById('src-toggle');
  if (!form || !toggle) return;
  const kindSel = document.getElementById('src-kind');
  const nameWrap = document.getElementById('src-name-wrap');
  const fileInput = document.getElementById('src-file');
  const contentEl = document.getElementById('src-content');

  const syncName = () => {
    const single = SRC_KINDS[kindSel.value] && SRC_KINDS[kindSel.value].single;
    nameWrap.style.display = single ? 'none' : '';
  };
  syncName();
  kindSel.addEventListener('change', syncName);
  toggle.addEventListener('click', () => {
    form.hidden = !form.hidden;
    toggle.textContent = form.hidden ? '+ Add source' : '× Close';
  });
  document.getElementById('src-cancel').addEventListener('click', () => {
    form.hidden = true; toggle.textContent = '+ Add source';
  });
  fileInput.addEventListener('change', async () => {
    const f = fileInput.files[0];
    if (!f) return;
    contentEl.value = await f.text();
    const nameEl = document.getElementById('src-name');
    if (nameEl && !nameEl.value) nameEl.value = f.name.replace(/\.[^.]+$/, '');
  });
  form.addEventListener('submit', (e) => { e.preventDefault(); saveSource(); });
}

async function saveSource() {
  const kind = document.getElementById('src-kind').value;
  const name = (document.getElementById('src-name').value || '').trim();
  const content = document.getElementById('src-content').value;
  const status = document.getElementById('src-status');
  const single = SRC_KINDS[kind] && SRC_KINDS[kind].single;
  const fail = (msg) => { status.hidden = false; status.className = 'src-status err'; status.textContent = msg; };
  if (!content.trim()) return fail('Add some content first.');
  if (!single && !name) return fail('Give this source a name.');
  status.hidden = false; status.className = 'src-status'; status.textContent = 'Saving…';
  try {
    const r = await fetch('/api/sources', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ kebab, kind, name, content }),
    });
    const b = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(b.error || 'Could not save the source.');
    await loadSources();
  } catch (e) { fail(e.message); }
}

// Dispatch a phase in the engagement's repo, then poll until the engine run
// finishes and reload the board (the engine commits the deliverable + gates.json).
async function generate(file) {
  if (RUNNING) return;
  RUNNING = true;
  setGenButtons(true);
  const title = (DELIVERABLES.find((d) => d.file === file) || {}).title || file;
  const grounded = SOURCES.length > 0;
  banner(`⏳ Generating <strong>${title}</strong> ${grounded ? 'from your sources' : '(Contoso demo data — no sources added)'} — dispatching the engine…`);

  let priorId = null;
  try { priorId = (await (await fetch(`/api/run/status?kebab=${kebab}`)).json()).databaseId || null; } catch { /* none yet */ }

  try {
    const res = await fetch('/api/run', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ kebab, file, seedDemo: !grounded }),
    });
    if (!res.ok) { const b = await res.json().catch(() => ({})); throw new Error(b.detail || b.error || 'Dispatch failed'); }
  } catch (e) {
    banner(`❌ ${e.message}`, 'err');
    RUNNING = false; setGenButtons(false);
    return;
  }

  let tries = 0;
  const poll = setInterval(async () => {
    tries++;
    let run = {};
    try { run = await (await fetch(`/api/run/status?kebab=${kebab}`)).json(); } catch { /* transient */ }
    const isNew = run.databaseId && run.databaseId !== priorId;
    const link = run.url ? ` <a href="${run.url}" target="_blank" rel="noopener">view run ↗</a>` : '';

    if (!isNew) {
      banner(`⏳ Generating <strong>${title}</strong> — queuing the run…`);
    } else if (run.status !== 'completed') {
      banner(`⏳ Generating <strong>${title}</strong> — engine running in GitHub Actions (${run.status})…${link}`);
    } else {
      clearInterval(poll);
      RUNNING = false;
      if (run.conclusion === 'success') {
        banner(`✅ <strong>${title}</strong> generated and committed to the repo. Refreshing…`, 'ok');
        setTimeout(load, 900);
      } else {
        banner(`❌ Run ${run.conclusion || 'failed'}.${link}`, 'err');
        setGenButtons(false);
      }
      return;
    }
    if (tries > 90) {
      clearInterval(poll);
      RUNNING = false;
      banner(`⏱ Still running — check Actions.${link}`);
      setGenButtons(false);
    }
  }, 5000);
}

// Record a web sign-off on a deliverable, then reload so the card flips to signed.
async function approve(file) {
  const title = (DELIVERABLES.find((d) => d.file === file) || {}).title || file;
  banner(`⏳ Recording sign-off for <strong>${title}</strong>…`);
  document.querySelectorAll('.btn-approve').forEach((b) => (b.disabled = true));
  try {
    const res = await fetch('/api/approve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ kebab, file }),
    });
    const b = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(b.error || 'Approve failed');
    banner(`✅ <strong>${title}</strong> signed off by ${b.signedOffBy}. Refreshing…`, 'ok');
    setTimeout(load, 700);
  } catch (e) {
    banner(`❌ ${e.message}`, 'err');
    document.querySelectorAll('.btn-approve').forEach((b) => (b.disabled = false));
  }
}

async function load() {
  if (!kebab) { document.getElementById('gates').innerHTML = '<p class="err">No engagement specified.</p>'; return; }
  let data;
  try {
    const r = await fetch(`/api/board/${kebab}${source === 'local' ? '?source=local' : ''}`);
    if (!r.ok) throw new Error((await r.json()).error || r.statusText);
    data = await r.json();
  } catch (e) {
    document.getElementById('gates').innerHTML = `<p class="err">Could not load engagement: ${e.message}</p>`;
    return;
  }

  DELIVERABLES = data.deliverables;
  document.getElementById('eng-name').textContent = data.name || kebab;
  const subBase = data.handoffReady ? 'Ready for engineering hand-off' : 'Phases 1–3 in progress';
  const repoLink = data.htmlUrl
    ? ` · <a href="${data.htmlUrl}" target="_blank" rel="noopener">${data.repo} ↗</a>`
    : '';
  document.getElementById('eng-sub').innerHTML = subBase + repoLink;

  renderTimeline(data.gates);

  const discoverDs = data.deliverables.filter((d) => d.gate === 'discover');
  const disruptDs = data.deliverables.filter((d) => d.gate === 'disrupt');
  document.getElementById('gates').innerHTML =
    gateBlock('Discover', data.gates.discover, discoverDs) +
    gateBlock('Disrupt', data.gates.disrupt, disruptDs);

  document.querySelectorAll('.btn-view').forEach((b) =>
    b.addEventListener('click', () => openViewer(b.dataset.file)));
  document.querySelectorAll('.btn-gen').forEach((b) =>
    b.addEventListener('click', () => generate(b.dataset.gen)));
  document.querySelectorAll('.btn-approve').forEach((b) =>
    b.addEventListener('click', () => approve(b.dataset.approve)));

  loadSources();
}

document.addEventListener('click', (e) => { if (e.target.dataset.close !== undefined) closeViewer(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeViewer(); });
load();
