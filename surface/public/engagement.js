// Engagement dashboard: fetches live gate state + artifact markdown for one
// engagement and renders the phase timeline, gate tiles, deliverable cards, and
// a slide-over artifact viewer.

const PHASES = ['Preparation', 'Discover', 'Disrupt', 'Build', 'Deliver'];
const params = new URLSearchParams(location.search);
const kebab = params.get('kebab');
const source = params.get('source');

let DELIVERABLES = [];
const GENERATABLE = new Set(['personas.md', 'problem-statement.md', 'current-state-journey.md']);
// Friendly titles for runnable artifacts that aren't graded deliverable cards.
const RUN_TITLES = { 'PROJECT-CONTEXT.md': 'Project context' };
let CONTEXT = { present: false, path: '' };
let RUNNING = false;
let SOURCES = [];
let SRC_KINDS = {};
let PROVENANCE = { bySource: {} };
let UPLOAD_QUEUE = [];
let UPQ_ID = 0;
let UPQ_MSG = null;

// Escape user/repo-derived strings before interpolating into innerHTML.
function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));
}

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
  const discover = d === 'GREEN' ? 'done' : (String(gates.discover.artifactsPresent).split('/')[0] === '0' ? 'pending' : 'active');
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
    ${d.present ? provSummary(d) : ''}
    <div class="card-actions">
      <button class="btn-view" data-file="${d.file}" ${d.present ? '' : 'disabled'}>View</button>
      ${!d.present && GENERATABLE.has(d.file) ? `<button class="btn-gen" data-gen="${d.file}"><span class="gen-ico">✨</span><span class="gen-txt">Generate</span></button>` : ''}
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

// ---- provenance ("receipts"): make the source→deliverable map visible --------
function srcDisplay(path) {
  const s = SOURCES.find((x) => x.path === path);
  if (s) return s.name;
  return path.split('/').pop().replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ');
}
function delivTitle(file) {
  const d = DELIVERABLES.find((x) => x.file === file);
  return d ? d.title : file.replace(/\.md$/, '').replace(/-/g, ' ');
}

// "Generated from" chips + the celebratory support mix on a deliverable card.
function provSummary(d) {
  const p = d.provenance;
  if (!p) return '';
  const mix = [];
  if (p.supportMix.quoted) mix.push(`<span class="mix mix-q">🟢 ${p.supportMix.quoted} quoted</span>`);
  if (p.supportMix.reasoned) mix.push(`<span class="mix mix-r">🔵 ${p.supportMix.reasoned} reasoned</span>`);
  const chips = (p.sources || [])
    .map((s) => `<button class="prov-src-chip" data-srcpath="${esc(s)}" title="Open ${esc(s)}">${esc(srcDisplay(s))}</button>`)
    .join('');
  if (!chips && !mix.length) return '';
  return `<div class="prov-summary">
    ${mix.length ? `<div class="prov-mix">${mix.join('')}</div>` : ''}
    ${chips ? `<div class="prov-from"><span class="prov-from-label">Generated from</span>${chips}</div>` : ''}
  </div>`;
}

// Legend shown atop a deliverable in the viewer, explaining the three tiers.
function provLegend(p) {
  if (!p || (!p.supportMix.quoted && !p.supportMix.reasoned)) return '';
  return `<div class="prov-legend">
    <span class="leg leg-q">🟢 Quoted — direct evidence</span>
    <span class="leg leg-r">🔵 Reasoned — logical inference</span>
    <span class="leg leg-d">⚪ Unmarked — a design choice; worth pushing on</span>
  </div>`;
}

// Post-render DOM pass: tag each rendered block that carries a source path with its
// support tier and turn the source code-spans into clickable chips. Runs on the
// already-escaped, already-rendered HTML, so it can't break markdown rendering.
function decorateProvenance(container) {
  const SRC_RE = /^(sources|engagement)\/\S+\.[A-Za-z0-9]+$/;
  container.querySelectorAll('blockquote, tr, li, p').forEach((el) => {
    const codes = [...el.querySelectorAll('code')].filter((c) => SRC_RE.test(c.textContent.trim()));
    if (!codes.length) return;
    const txt = el.textContent;
    if (/Sources read|Auto-generated by/i.test(txt)) {
      el.classList.add('prov-line', 'prov-meta');
    } else {
      const reasoned = /inferred|no direct quote/i.test(txt);
      el.classList.add('prov-line', reasoned ? 'prov-reasoned' : 'prov-quoted');
    }
    codes.forEach((c) => {
      c.classList.add('prov-chip');
      c.setAttribute('data-srcpath', c.textContent.trim());
      c.title = 'Open source ↗';
    });
  });
}

// "Used by" chips + citation count on a bucket source card.
function usedByHtml(s) {
  if (!s.usedBy || !s.usedBy.length) return '<span class="src-unused">Not yet used by a deliverable</span>';
  const chips = s.usedBy.map((f) => `<button class="used-chip" data-deliv="${esc(f)}">${esc(delivTitle(f))}</button>`).join('');
  const n = s.citationCount || 0;
  return `<span class="src-usedby"><span class="usedby-label">Used by</span>${chips}` +
    `${n ? `<span class="cite-count">${n} citation${n === 1 ? '' : 's'}</span>` : ''}</span>`;
}

// ---- slide-over viewer with a small navigation stack so drilling from a
// deliverable into a source (a "Generated from" chip, an in-text source path,
// or a markdown link) — and back — never loses your place or navigates the
// whole page away to a 404. -------------------------------------------------
let VIEWER_STACK = [];

function renderViewerChrome() {
  const back = document.getElementById('viewer-back');
  if (back) back.hidden = VIEWER_STACK.length < 2;
}

function renderDeliverableView(file) {
  const d = DELIVERABLES.find((x) => x.file === file);
  if (!d || !d.present) return;
  document.getElementById('viewer-title').textContent = d.title;
  const meta = d.signedOffBy ? `Signed off by ${d.signedOffBy}` : 'Awaiting approval';
  document.getElementById('viewer-meta').innerHTML = `${gradeBadge(d.grade, d.gradePass)} <span class="vm">${meta}</span>`;
  const body = document.getElementById('viewer-body');
  body.innerHTML = provLegend(d.provenance) + window.renderMarkdown(d.markdown || '');
  decorateProvenance(body);
  body.scrollTop = 0;
}

async function renderSourceView(path) {
  document.getElementById('viewer-title').textContent = srcDisplay(path);
  document.getElementById('viewer-meta').innerHTML = `<span class="vm">Source · <code>${esc(path)}</code></span>`;
  const body = document.getElementById('viewer-body');
  body.innerHTML = '<p class="muted">Loading…</p>';
  body.scrollTop = 0;
  try {
    const r = await fetch(`/api/source?kebab=${kebab}&path=${encodeURIComponent(path)}`);
    const b = await r.json().catch(() => ({}));
    if (!r.ok) {
      if (r.status === 404) {
        body.innerHTML = `<div class="viewer-missing">
          <p><strong>Not in this engagement yet.</strong></p>
          <p class="muted">This deliverable points to <code>${esc(path)}</code>, but that file hasn’t been generated or added to the repo yet. Generate the upstream deliverable (or add the source) and it’ll resolve.</p>
        </div>`;
        return;
      }
      throw new Error(b.error || 'Could not open this file here.');
    }
    body.innerHTML = window.renderMarkdown(b.text || '');
  } catch (e) {
    body.innerHTML = `<div class="viewer-missing"><p class="err">${esc(e.message)}</p><p class="muted"><code>${esc(path)}</code></p></div>`;
  }
}

function renderViewerTop() {
  const top = VIEWER_STACK[VIEWER_STACK.length - 1];
  if (!top) return;
  document.getElementById('viewer').hidden = false;
  renderViewerChrome();
  if (top.kind === 'deliv') renderDeliverableView(top.file);
  else renderSourceView(top.path);
}

// fromViewer = the click originated inside the open viewer → push onto the
// stack (so Back returns here); otherwise it's a fresh open from the board.
function viewerNavigate(entry, fromViewer) {
  if (fromViewer && VIEWER_STACK.length) VIEWER_STACK.push(entry);
  else VIEWER_STACK = [entry];
  renderViewerTop();
}
function viewerBack() {
  if (VIEWER_STACK.length > 1) { VIEWER_STACK.pop(); renderViewerTop(); }
}
function openViewer(file, fromViewer) {
  const d = DELIVERABLES.find((x) => x.file === file);
  if (!d || !d.present) return;
  viewerNavigate({ kind: 'deliv', file }, fromViewer);
}
function openSourceViewer(path, fromViewer) {
  viewerNavigate({ kind: 'src', path }, fromViewer);
}
function closeViewer() { document.getElementById('viewer').hidden = true; VIEWER_STACK = []; }

// Treat anything that isn't an absolute URL / mail / tel / in-page anchor as a
// repo-relative path so in-deliverable markdown links stay inside the app.
function isRepoLink(href) {
  return href && !/^(https?:|mailto:|tel:|#|\/\/)/i.test(href);
}
function normalizeRepoPath(href) {
  let p = href.replace(/[#?].*$/, '').replace(/^\.\//, '').replace(/^(\.\.\/)+/, '');
  if (p && !p.includes('/')) p = `engagement/${kebab}/${p}`;
  return p;
}

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

// Mark the one clicked Generate button as actively working (spinner + label) so
// it's unmistakable which deliverable is being produced.
let GEN_BTN = null;
let GEN_BTN_HTML = '';
function setGenBusy(file) {
  GEN_BTN = document.querySelector(`.btn-gen[data-gen="${file}"]`);
  if (GEN_BTN) {
    GEN_BTN_HTML = GEN_BTN.innerHTML;
    GEN_BTN.classList.add('is-busy');
    GEN_BTN.innerHTML = '<span class="spin"></span><span class="gen-txt">Working…</span>';
  }
}
function clearGenBusy() {
  if (GEN_BTN) {
    GEN_BTN.classList.remove('is-busy');
    GEN_BTN.innerHTML = GEN_BTN_HTML || '<span class="gen-ico">✨</span><span class="gen-txt">Generate</span>';
  }
  GEN_BTN = null;
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
        <div class="src-card-top">
          <span class="src-kind">${esc(srcKindLabel(s.kind))}</span>
          <span class="src-name">${esc(s.name)}</span>
          ${s.original ? `<span class="src-orig" title="Converted from ${esc(s.original.name)}">from ${esc(String(s.original.ext).toUpperCase())}</span>` : ''}
          <span class="grow"></span>
          <button class="src-view" data-srcpath="${esc(s.path)}">View</button>
          ${s.original && s.original.htmlUrl ? `<a class="src-link" href="${esc(s.original.htmlUrl)}" target="_blank" rel="noopener" title="Download ${esc(s.original.name)}">Original ↧</a>` : ''}
          ${s.htmlUrl ? `<a class="src-link" href="${esc(s.htmlUrl)}" target="_blank" rel="noopener">GitHub ↗</a>` : ''}
        </div>
        ${usedByHtml(s)}
      </div>`).join('')
    : `<div class="src-empty">No sources yet — <strong>Generate</strong> will fall back to the Contoso demo data. Add your customer's materials to ground the deliverables in their world.</div>`;
  const opts = Object.entries(SRC_KINDS).map(([k, v]) => `<option value="${k}">${v.label}</option>`).join('');

  el.innerHTML = `
    <div class="sources-head">
      <div>
        <h2>Sources</h2>
        <p class="sources-sub">Discover reads everything here before it generates. Add the customer's brief, transcripts, questionnaire and research so the deliverables are grounded in their world — not demo data.</p>
      </div>
      <button class="btn-add-src" id="src-toggle" type="button"
              title="Type or paste text directly — a verbal note, a key quote, a snippet — without uploading a file">✎ Add text note</button>
    </div>

    <div class="dropzone" id="dropzone" tabindex="0" role="button"
         aria-label="Drop customer materials, or click to browse">
      <div class="dz-icon">⬇</div>
      <div class="dz-main">Drop customer materials here</div>
      <div class="dz-sub">Word, PowerPoint, Excel &amp; PDF are converted to Markdown automatically · transcripts, .txt, .csv used as-is · or click to browse</div>
      <input type="file" id="dz-input" multiple hidden
             accept="${UP_ACCEPT}" />
    </div>
    <div class="upqueue" id="upqueue" hidden></div>

    <div class="src-list">${list}</div>
    <form class="src-form" id="src-form" hidden>
      <p class="src-paste-hint"><strong>For text you type or paste directly</strong> — a verbal note from a call, a key quote, a snippet. Have it as a file (Word, PowerPoint, Excel, PDF, transcript)? <strong>Use the drop zone above</strong> instead.</p>
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
        <span class="grow"></span>
        <button type="button" class="btn-ghost" id="src-cancel">Cancel</button>
        <button type="submit" class="btn-save-src">Add source</button>
      </div>
      <div class="src-status" id="src-status" hidden></div>
    </form>`;
  wireSources();
  renderContext();
}

// The "Project context" band. PROJECT-CONTEXT.md is the single source of truth the
// three Discover deliverables ground in, so the designer should synthesize it from
// their sources BEFORE generating personas/problem/journey. Self-wires its own
// action button so it works no matter when it's (re)rendered.
function renderContext() {
  const el = document.getElementById('context');
  if (!el) return;
  const path = CONTEXT.path || `engagement/${kebab}/PROJECT-CONTEXT.md`;
  const hasSources = SOURCES.length > 0;
  let body;
  if (CONTEXT.present) {
    body = `<div class="ctx-row ctx-ok">
        <span class="ctx-badge">✓ Synthesized</span>
        <span class="ctx-copy">Built from your sources — your personas, problem statement and journey ground in this when you generate them.</span>
        <span class="grow"></span>
        <button class="src-view" data-srcpath="${path}">View</button>
        <button class="btn-gen btn-soft" data-gen="PROJECT-CONTEXT.md"><span class="gen-ico">↻</span><span class="gen-txt">Re-synthesize</span></button>
      </div>`;
  } else if (hasSources) {
    body = `<div class="ctx-row">
        <span class="ctx-copy"><strong>Step 1 — synthesize your project context.</strong> The engine reads every source and builds <code>PROJECT-CONTEXT.md</code>, the single source of truth your Discover deliverables ground in. Do this before you generate them.</span>
        <span class="grow"></span>
        <button class="btn-gen" data-gen="PROJECT-CONTEXT.md"><span class="gen-ico">✨</span><span class="gen-txt">Synthesize context</span></button>
      </div>`;
  } else {
    body = `<div class="ctx-row ctx-empty">
        <span class="ctx-copy">Add your customer's sources above, then synthesize the <strong>project context</strong> that grounds every Discover deliverable.</span>
      </div>`;
  }
  el.hidden = false;
  el.innerHTML = `<div class="ctx-head"><h2>Project context</h2><span class="ctx-sub">The single source of truth · synthesized from your sources</span></div>${body}`;
  const go = el.querySelector('.btn-gen[data-gen="PROJECT-CONTEXT.md"]');
  if (go) go.addEventListener('click', () => generate('PROJECT-CONTEXT.md'));
}

function wireSources() {
  const toggle = document.getElementById('src-toggle');
  const form = document.getElementById('src-form');
  const dz = document.getElementById('dropzone');
  const dzInput = document.getElementById('dz-input');

  // The bucket: drag-drop + click-to-browse → multi-file queue.
  if (dz && dzInput) {
    dz.addEventListener('click', () => dzInput.click());
    dz.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); dzInput.click(); }
    });
    dzInput.addEventListener('change', () => {
      if (dzInput.files.length) enqueueFiles(dzInput.files);
      dzInput.value = '';
    });
    ['dragenter', 'dragover'].forEach((ev) => dz.addEventListener(ev, (e) => {
      e.preventDefault(); dz.classList.add('dz-over');
    }));
    dz.addEventListener('dragleave', (e) => { e.preventDefault(); dz.classList.remove('dz-over'); });
    dz.addEventListener('drop', (e) => {
      e.preventDefault(); dz.classList.remove('dz-over');
      const f = e.dataTransfer && e.dataTransfer.files;
      if (f && f.length) enqueueFiles(f);
    });
  }
  renderQueue();

  // The paste-text form (quick entry for text the designer types/pastes).
  if (!form || !toggle) return;
  const kindSel = document.getElementById('src-kind');
  const nameWrap = document.getElementById('src-name-wrap');
  const syncName = () => {
    const single = SRC_KINDS[kindSel.value] && SRC_KINDS[kindSel.value].single;
    nameWrap.style.display = single ? 'none' : '';
  };
  syncName();
  kindSel.addEventListener('change', syncName);
  toggle.addEventListener('click', () => {
    form.hidden = !form.hidden;
    toggle.textContent = form.hidden ? '✎ Add text note' : '× Close';
  });
  document.getElementById('src-cancel').addEventListener('click', () => {
    form.hidden = true; toggle.textContent = '✎ Add text note';
  });
  form.addEventListener('submit', (e) => { e.preventDefault(); saveSource(); });
}

// ---- the upload bucket: auto-detect, queue, convert-on-upload --------------
const UP_CONVERT = ['docx', 'pptx', 'xlsx', 'xls', 'pdf'];
const UP_IMAGE = ['png', 'jpg', 'jpeg', 'gif', 'webp', 'bmp', 'heic', 'tif', 'tiff'];
const UP_TEXT = ['md', 'markdown', 'txt', 'vtt', 'srt', 'csv', 'json', 'log'];
// Single source of truth for the file-picker filter, so it can't drift from
// fileGroup(): everything we ingest as text plus everything we convert.
const UP_ACCEPT = [...UP_TEXT, ...UP_CONVERT].map((e) => `.${e}`).join(',');
function fileExt(name) { return (name.toLowerCase().match(/\.([^.]+)$/) || [, ''])[1]; }
function fileGroup(name) {
  const e = fileExt(name);
  if (UP_CONVERT.includes(e)) return 'convert';
  if (UP_IMAGE.includes(e)) return 'image';
  return 'text';
}
// Suggest a kind from the filename — shown as an editable default, never forced.
function detectKind(name) {
  const n = name.toLowerCase();
  const e = fileExt(name);
  if (e === 'vtt' || e === 'srt' || /transcript|call|meeting|standup|interview/.test(n)) return 'transcript';
  if (/brief/.test(n)) return 'customer-brief';
  if (/questionnaire|survey/.test(n)) return 'questionnaire';
  if (/research/.test(n)) return 'research';
  return 'other';
}
function groupBadge(group, name) {
  const ext = (fileExt(name) || 'text').toUpperCase();
  if (group === 'convert') return `<span class="up-badge up-conv">${ext} → Markdown</span>`;
  if (group === 'image') return `<span class="up-badge up-img">Image · reference</span>`;
  return `<span class="up-badge up-text">${ext} · as-is</span>`;
}
function readFileB64(file) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result).split(',').pop());
    r.onerror = () => reject(new Error('Could not read ' + file.name));
    r.readAsDataURL(file);
  });
}
function enqueueFiles(fileList) {
  UPQ_MSG = null;
  for (const file of fileList) {
    const group = fileGroup(file.name);
    UPLOAD_QUEUE.push({
      id: ++UPQ_ID, file, name: file.name.replace(/\.[^.]+$/, ''),
      kind: detectKind(file.name), group, skip: group === 'image',
    });
  }
  renderQueue();
}
function renderQueue() {
  const el = document.getElementById('upqueue');
  if (!el) return;
  el.className = 'upqueue';
  if (!UPLOAD_QUEUE.length) { el.hidden = true; el.innerHTML = ''; return; }
  el.hidden = false;
  const opts = (sel) => Object.entries(SRC_KINDS)
    .map(([k, v]) => `<option value="${k}" ${k === sel ? 'selected' : ''}>${v.label}</option>`).join('');
  const rows = UPLOAD_QUEUE.map((it) => `
    <div class="up-row ${it.skip ? 'up-skip' : ''}" data-upid="${it.id}">
      ${groupBadge(it.group, it.file.name)}
      <span class="up-file" title="${esc(it.file.name)}">${esc(it.file.name)}</span>
      <select class="up-kind" data-upid="${it.id}" ${it.skip ? 'disabled' : ''}>${opts(it.kind)}</select>
      <input class="up-name" data-upid="${it.id}" value="${esc(it.name)}" placeholder="name" ${it.skip ? 'disabled' : ''} />
      <button type="button" class="up-rm" data-uprm="${it.id}" title="Remove" aria-label="Remove">×</button>
    </div>`).join('');
  const n = UPLOAD_QUEUE.filter((x) => !x.skip).length;
  // Always render the status node (hidden when empty) so in-flight upload
  // progress has a guaranteed target to write into.
  const msg = `<span class="src-status ${UPQ_MSG ? UPQ_MSG.cls : ''}"${UPQ_MSG ? '' : ' hidden'}>${UPQ_MSG ? esc(UPQ_MSG.text) : ''}</span>`;
  el.innerHTML = `
    <div class="up-list">${rows}</div>
    ${UPLOAD_QUEUE.some((x) => x.skip) ? `<div class="up-note">Images are held for your reference only — not sent to the engine yet.</div>` : ''}
    <div class="up-actions">
      <button type="button" class="btn-ghost" id="up-clear">Clear</button>
      <button type="button" class="btn-save-src" id="up-go" ${n ? '' : 'disabled'}>Add ${n} source${n === 1 ? '' : 's'}</button>
      ${msg}
    </div>`;
  wireQueue();
}
function wireQueue() {
  document.querySelectorAll('.up-kind').forEach((s) => s.addEventListener('change', () => {
    const it = UPLOAD_QUEUE.find((x) => x.id === +s.dataset.upid); if (it) it.kind = s.value;
  }));
  document.querySelectorAll('.up-name').forEach((i) => i.addEventListener('input', () => {
    const it = UPLOAD_QUEUE.find((x) => x.id === +i.dataset.upid); if (it) it.name = i.value.trim();
  }));
  document.querySelectorAll('[data-uprm]').forEach((b) => b.addEventListener('click', () => {
    UPLOAD_QUEUE = UPLOAD_QUEUE.filter((x) => x.id !== +b.dataset.uprm); UPQ_MSG = null; renderQueue();
  }));
  const clear = document.getElementById('up-clear');
  if (clear) clear.addEventListener('click', () => { UPLOAD_QUEUE = []; UPQ_MSG = null; renderQueue(); });
  const go = document.getElementById('up-go');
  if (go) go.addEventListener('click', uploadQueue);
}
async function uploadQueue() {
  const items = UPLOAD_QUEUE.filter((x) => !x.skip);
  if (!items.length) return;
  const go = document.getElementById('up-go');
  const set = (text, cls = '', busy = false) => {
    UPQ_MSG = { text, cls };
    const target = document.querySelector('#upqueue .src-status');
    if (!target) return;
    target.hidden = false;
    target.className = `src-status ${cls}`;
    target.innerHTML = (busy ? '<span class="spin"></span>' : '') + esc(text);
  };
  const qEl = document.getElementById('upqueue');
  if (qEl) qEl.classList.add('up-busy');
  if (go) { go.disabled = true; go.classList.add('up-go-busy'); go.innerHTML = '<span class="spin"></span>Converting…'; }
  const okIds = new Set(); const failed = [];
  let i = 0;
  for (const it of items) {
    i++;
    set(`Uploading ${it.file.name} (${i}/${items.length})${it.group === 'convert' ? ' — converting to Markdown…' : '…'}`, '', true);
    try {
      const dataBase64 = await readFileB64(it.file);
      const r = await fetch('/api/sources', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kebab, kind: it.kind, name: it.name, filename: it.file.name, dataBase64 }),
      });
      const b = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(b.error || 'upload failed');
      okIds.add(it.id);
    } catch (e) { failed.push(`${it.file.name} — ${e.message}`); }
  }
  UPLOAD_QUEUE = UPLOAD_QUEUE.filter((x) => !okIds.has(x.id)); // keep images + any failures
  UPQ_MSG = failed.length
    ? { text: `Added ${okIds.size}. Failed: ${failed.join('; ')}`, cls: 'err' }
    : { text: `Added ${okIds.size} source${okIds.size === 1 ? '' : 's'}.`, cls: 'ok' };
  await load(); // re-renders sources + queue (UPQ_MSG persists through renderQueue)
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
    await load();
  } catch (e) { fail(e.message); }
}

// Dispatch a phase in the engagement's repo, then poll until the engine run
// finishes and reload the board (the engine commits the deliverable + gates.json).
async function generate(file) {
  if (RUNNING) return;
  RUNNING = true;
  setGenButtons(true);
  setGenBusy(file);
  const title = RUN_TITLES[file] || (DELIVERABLES.find((d) => d.file === file) || {}).title || file;
  const grounded = SOURCES.length > 0;
  banner(`<span class="spin"></span> Generating <strong>${title}</strong> ${grounded ? 'from your sources' : '(Contoso demo data — no sources added)'} — dispatching the engine…`, 'busy');

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
    RUNNING = false; clearGenBusy(); setGenButtons(false);
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
      banner(`<span class="spin"></span> Generating <strong>${title}</strong> — queuing the run…`, 'busy');
    } else if (run.status !== 'completed') {
      banner(`<span class="spin"></span> Generating <strong>${title}</strong> — engine running in GitHub Actions (${run.status})…${link}`, 'busy');
    } else {
      clearInterval(poll);
      RUNNING = false;
      if (run.conclusion === 'success') {
        banner(`✅ <strong>${title}</strong> generated and committed to the repo. Refreshing…`, 'ok');
        clearGenBusy(); setGenButtons(false);
        setTimeout(load, 900);
      } else {
        banner(`❌ Run ${run.conclusion || 'failed'}.${link}`, 'err');
        clearGenBusy(); setGenButtons(false);
      }
      return;
    }
    if (tries > 90) {
      clearInterval(poll);
      RUNNING = false;
      banner(`⏱ Still running — check Actions.${link}`);
      clearGenBusy(); setGenButtons(false);
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
  if (data.sources) SOURCES = data.sources;
  if (data.kinds) SRC_KINDS = data.kinds;
  CONTEXT = data.context || { present: false, path: `engagement/${kebab}/PROJECT-CONTEXT.md` };
  PROVENANCE = data.provenance || { bySource: {} };
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

  // Sources panel: prefer the board's enriched sources (they carry usedBy +
  // citationCount); fall back to a direct fetch for the local-dev board.
  if (data.sources) { SRC_KINDS = data.kinds || SRC_KINDS; renderSources(); }
  else loadSources();
}

document.addEventListener('click', (e) => {
  if (e.target.closest('[data-close]')) { closeViewer(); return; }
  if (e.target.closest('#viewer-back')) { viewerBack(); return; }

  const inViewer = !!e.target.closest('#viewer-body');

  // Provenance chips: source path → open the source; "Used by" → open the deliverable.
  const srcEl = e.target.closest('[data-srcpath]');
  if (srcEl) { e.preventDefault(); openSourceViewer(srcEl.getAttribute('data-srcpath'), inViewer); return; }
  const delEl = e.target.closest('[data-deliv]');
  if (delEl) { e.preventDefault(); openViewer(delEl.getAttribute('data-deliv'), inViewer); return; }

  // Markdown links inside a deliverable that point at repo files (e.g.
  // engagement/<kebab>/PROJECT-CONTEXT.md) must open in the in-app viewer with a
  // Back button — never navigate the whole page away to a 404.
  if (inViewer) {
    const a = e.target.closest('a[href]');
    if (a && isRepoLink(a.getAttribute('href'))) {
      e.preventDefault();
      openSourceViewer(normalizeRepoPath(a.getAttribute('href')), true);
    }
  }
});
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeViewer(); });
load();
