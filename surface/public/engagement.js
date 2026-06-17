// Engagement dashboard: fetches live gate state + artifact markdown for one
// engagement and renders the phase timeline, gate tiles, deliverable cards, and
// a slide-over artifact viewer.

const PHASES = ['Preparation', 'Discover', 'Disrupt', 'Build', 'Deliver'];
const params = new URLSearchParams(location.search);
const kebab = params.get('kebab');

let DELIVERABLES = [];

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

async function load() {
  if (!kebab) { document.getElementById('gates').innerHTML = '<p class="err">No engagement specified.</p>'; return; }
  let data;
  try {
    const r = await fetch(`/api/board/${kebab}`);
    if (!r.ok) throw new Error((await r.json()).error || r.statusText);
    data = await r.json();
  } catch (e) {
    document.getElementById('gates').innerHTML = `<p class="err">Could not load engagement: ${e.message}</p>`;
    return;
  }

  DELIVERABLES = data.deliverables;
  document.getElementById('eng-name').textContent = kebab;
  document.getElementById('eng-sub').textContent = data.handoffReady
    ? 'Ready for engineering hand-off'
    : 'Phases 1–3 in progress';

  renderTimeline(data.gates);

  const discoverDs = data.deliverables.filter((d) => d.gate === 'discover');
  const disruptDs = data.deliverables.filter((d) => d.gate === 'disrupt');
  document.getElementById('gates').innerHTML =
    gateBlock('Discover', data.gates.discover, discoverDs) +
    gateBlock('Disrupt', data.gates.disrupt, disruptDs);

  document.querySelectorAll('.btn-view').forEach((b) =>
    b.addEventListener('click', () => openViewer(b.dataset.file)));
}

document.addEventListener('click', (e) => { if (e.target.dataset.close !== undefined) closeViewer(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeViewer(); });
load();
