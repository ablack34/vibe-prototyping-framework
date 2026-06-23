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
// Disrupt workshop-capture bucket (separate queue from the Discover bucket).
let WS_QUEUE = [];
let WSQ_ID = 0;
let WSQ_MSG = null;

// Escape user/repo-derived strings before interpolating into innerHTML.
function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));
}

// Section help text for the facilitator — shown in the ⓘ info dot beside each
// section heading. Plain language: what to do here, and why it matters.
const TIPS = {
  sources: "Everything the customer gives you — briefs, call transcripts, questionnaires, research. Discover reads all of it before it generates, so more real material means more grounded deliverables. With nothing here, the engine falls back to demo data.",
  data: "The customer's structured data (CSV, Excel, JSON) — ask for it up front. It does two jobs: the raw file powers the prototype the engineer builds, and a table version grounds your Discover work. Mock or anonymised only, never real PII.",
  preparation: "Week-0 setup: the two briefs (Studio 42's internal view + the customer's own voice — both required), the dual-path customer research, and the 4-week meeting schedule. Everything grounds in the sources above, never demo data.",
  context: "The single source of truth. Synthesize it from your sources first — every Discover deliverable links back to it. Re-synthesize whenever you add new sources so it stays current.",
  discover: "Phase 2: generate personas, the problem statement and the current-state journey — each grounded in your sources and auto-graded. Open each one to review, then Approve. All three signed off turns the gate green and unlocks Disrupt.",
  disrupt: "The Week-2 workshop — the one phase the customer is in the room. Draft the pre-reads, run the workshop offline and drop your capture in the bucket, then generate selected concept → future-state journey → storyboard in order. The storyboard is the hand-off to engineering.",
  model: "Which AI model the engine uses to generate deliverables. Default is Claude Sonnet 4.5 — a strong all-rounder. Heavier models reason harder but cost more; lighter ones are faster. Applies to every Generate in this engagement.",
};

// A small accessible info dot; its tip shows on hover/focus. Pass right=true to
// anchor the bubble to the right edge (for dots near the top-right, e.g. the topbar).
function infoDot(tip, right = false) {
  const t = esc(tip);
  return `<button type="button" class="info-dot${right ? ' tip-right' : ''}" data-tip="${t}" aria-label="${t}">i</button>`;
}

// Engine model setting (per engagement, persisted server-side). Seeded from the board.
let MODEL = '';
let MODELS = [];

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

function phaseState(gates, prep) {
  const d = gates.discover.status;
  const di = gates.disrupt.status;
  const prepState = !prep ? 'done'
    : prep.status === 'ready' ? 'done'
    : prep.status === 'partial' ? 'active' : 'pending';
  const discover = d === 'GREEN' ? 'done' : (String(gates.discover.artifactsPresent).split('/')[0] === '0' ? 'pending' : 'active');
  const disrupt = di === 'GREEN' ? 'done' : (discover === 'done' ? 'active' : 'pending');
  const build = di === 'GREEN' ? 'active' : 'pending';
  return { Preparation: prepState, Discover: discover, Disrupt: disrupt, Build: build, Deliver: 'pending' };
}

function renderTimeline(gates, prep) {
  const st = phaseState(gates, prep);
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

// Shared card-state line (used by both the Discover and Disrupt cards).
function cardState(d) {
  if (!d.present) return ['Not generated yet', 'st-missing'];
  if (d.stale) return ['Edited after sign-off — needs re-approval', 'st-stale'];
  if (d.signedOffBy) return [`Signed off by ${d.signedOffBy}${d.signedOffAt ? ' · ' + d.signedOffAt : ''}`, 'st-signed'];
  return ['Awaiting approval', 'st-await'];
}

// Transparency: name the exact agent + prompt a Generate/Regenerate runs. Always
// visible on generatable cards so the designer can see what's working under the hood.
// Reads the live binding the server resolved from the prompt's `agent:` frontmatter.
function genCaption(meta) {
  if (!meta || !meta.prompt) return '';
  const agent = esc(meta.agent || 'VIBE engine');
  const prompt = esc(meta.prompt);
  return `<div class="gen-meta" title="Clicking Generate dispatches the headless VIBE engine in this engagement's repo (GitHub Actions → run-phase.yml): the ${agent} agent running the ${prompt} prompt.">`
    + `<span class="gen-meta-ico">⚙️</span><span class="gen-meta-txt">Runs <span class="gen-meta-agent">${agent}</span> · <code>${prompt}</code></span>`
    + `</div>`;
}

function deliverableCard(d) {
  const [state, stateCls] = cardState(d);
  return `<div class="dcard ${d.present ? '' : 'dcard-empty'}">
    <div class="card-top">
      <div class="card-title">${d.title}</div>
      ${gradeBadge(d.grade, d.gradePass)}
    </div>
    <div class="card-state ${stateCls}">${state}</div>
    ${d.present ? provSummary(d) : ''}
    ${genCaption(d)}
    <div class="card-actions">
      <button class="btn-view" data-file="${d.file}" ${d.present ? '' : 'disabled'}>View</button>
      ${!d.present && GENERATABLE.has(d.file) ? `<button class="btn-gen" data-gen="${d.file}"><span class="gen-ico">✨</span><span class="gen-txt">Generate</span></button>` : ''}
      ${d.present && d.gradePass && !d.signedOffBy && !d.stale ? `<button class="btn-approve" data-approve="${d.file}">Approve</button>` : ''}
    </div>
  </div>`;
}

function gateBlock(name, gate, deliverables, tip) {
  const counts = `${gate.artifactsPresent} present · ${gate.gradePassing} grade-passing${gate.stale ? ' · ⚠ stale' : ''}`;
  return `<div class="gate">
    <div class="gate-head">
      <h2>${name} ${tip ? infoDot(tip) + ' ' : ''}${pill(gate.status)}</h2>
      <div class="gate-counts">${counts}</div>
    </div>
    <div class="cards">${deliverables.map(deliverableCard).join('')}</div>
  </div>`;
}

// ---- Disrupt: the Week-2 workshop flow -------------------------------------
// A richer card than Discover's: it honours the strict generation order (a locked
// Generate button with the reason why), offers regeneration (so a stale storyboard
// can be refreshed), and treats spark-prompts as a paste-OUT artifact for Spark.
function disruptCard(d) {
  let [state, stateCls] = cardState(d);
  if (d.pasteOut && d.present) { state = 'Ready to paste into Spark'; stateCls = 'st-signed'; }
  const star = d.gated ? '<span class="dz-star" title="Gated — required to move to Build">★</span>' : '';

  let actions = `<button class="btn-view" data-file="${esc(d.file)}" ${d.present ? '' : 'disabled'}>View</button>`;
  if (d.pasteOut) {
    if (d.present) {
      actions += `<button class="btn-spark" data-spark="${esc(d.file)}">📋 Copy prompts</button>`;
      actions += `<a class="btn-spark-open" href="https://spark.github.com" target="_blank" rel="noopener">Open Spark ↗</a>`;
    }
  } else if (!d.present && d.generatable) {
    actions += d.ready
      ? `<button class="btn-gen" data-gen="${esc(d.file)}"><span class="gen-ico">✨</span><span class="gen-txt">Generate</span></button>`
      : `<button class="btn-gen" data-gen="${esc(d.file)}" disabled title="${esc(d.blockedReason)}"><span class="gen-ico">🔒</span><span class="gen-txt">Generate</span></button>`;
  } else if (d.present && d.generatable) {
    actions += `<button class="btn-gen btn-soft" data-gen="${esc(d.file)}"><span class="gen-ico">↻</span><span class="gen-txt">Regenerate</span></button>`;
  }
  const canApprove = d.signoffCapable && d.present && !d.signedOffBy && !d.stale && (d.graded ? d.gradePass : true);
  if (canApprove) actions += `<button class="btn-approve" data-approve="${esc(d.file)}">Approve</button>`;

  const lock = (!d.present && d.generatable && !d.ready && d.blockedReason)
    ? `<div class="dz-lock">🔒 ${esc(d.blockedReason)}</div>` : '';
  const sparkHint = (d.pasteOut && !d.present)
    ? `<div class="dz-hint">Produced when you generate <strong>Ideation concepts</strong> — paste-ready prompts for GitHub Spark &amp; Copilot Studio.</div>` : '';

  return `<div class="dcard ${d.present ? '' : 'dcard-empty'} ${d.gated ? 'dcard-gated' : ''}">
    <div class="card-top">
      <div class="card-title">${star}${esc(d.title)}</div>
      ${d.graded ? gradeBadge(d.grade, d.gradePass) : ''}
    </div>
    <div class="card-state ${stateCls}">${esc(state)}</div>
    ${d.present ? provSummary(d) : ''}
    ${lock}${sparkHint}
    ${genCaption(d)}
    <div class="card-actions">${actions}</div>
  </div>`;
}

// The Disrupt section: a workshop-in-the-middle flow — pre-workshop pre-reads, a
// capture bucket (sources/workshop/), then the strict post-workshop chain.
function renderDisrupt(data) {
  const el = document.getElementById('disrupt');
  if (!el) return;
  const ds = data.deliverables.filter((d) => d.gate === 'disrupt');
  if (!ds.length) { el.hidden = true; el.innerHTML = ''; return; }
  el.hidden = false;
  const gate = (data.disrupt && data.disrupt.gate) || data.gates.disrupt;
  const ws = (data.disrupt && data.disrupt.workshopSources) || [];
  const stage = (s) => ds.filter((d) => d.stage === s);
  const group = (head, sub, cards) => `
    <div class="dz-group">
      <div class="dz-group-head"><h3>${head}</h3><span class="dz-group-sub">${sub}</span></div>
      <div class="cards">${cards.map(disruptCard).join('')}</div>
    </div>`;
  el.innerHTML = `
    <div class="gate gate-disrupt">
      <div class="gate-head">
        <h2>Disrupt ${infoDot(TIPS.disrupt)} ${pill(gate.status)}</h2>
        <div class="gate-counts">${gate.artifactsPresent} gated present · ${gate.gradePassing} grade-passing${gate.stale ? ' · ⚠ stale' : ''}</div>
      </div>
      <p class="dz-intro">The Week-2 co-creation workshop. Draft the pre-reads, run the workshop offline and drop the capture below, then generate the post-workshop chain in order — <strong>selected concept → future-state journey → storyboard</strong> (★ gated, required to move to Build).</p>
      ${group('① Before the workshop', 'Drafted from your signed-off Discover deliverables', stage('pre'))}
      ${renderWorkshopBucket(ws)}
      ${group('③ After the workshop', 'Generated in order from the workshop capture', stage('post'))}
    </div>`;
  el.querySelectorAll('.btn-spark').forEach((b) => b.addEventListener('click', () => copySpark(b.dataset.spark)));
  wireWorkshopBucket();
}

// ---- Preparation: Week-0 setup (the two briefs + research + schedule) --------
// Ungraded artifacts judged by presence, not a grade pill. ★ marks the two gating
// briefs. The M365 Researcher prompt is a paste-OUT artifact (Path B of the dual-path
// research): copy it, run it in M365 Copilot's Researcher agent, paste the result back.
function preparationCard(d) {
  let [state, stateCls] = cardState(d);
  if (d.present && !d.signoffCapable) { state = 'Drafted'; stateCls = 'st-signed'; }
  if (d.pasteOut && d.present) { state = 'Ready to paste into M365 Copilot'; stateCls = 'st-signed'; }
  const star = d.gateCritical ? '<span class="dz-star" title="Required to complete Preparation">★</span>' : '';

  let actions = `<button class="btn-view" data-file="${esc(d.file)}" ${d.present ? '' : 'disabled'}>View</button>`;
  if (d.pasteOut) {
    if (d.present) {
      actions += `<button class="btn-m365" data-m365="${esc(d.file)}">📋 Copy prompt</button>`;
      actions += `<a class="btn-spark-open" href="https://m365.cloud.microsoft" target="_blank" rel="noopener">Open M365 Copilot ↗</a>`;
    }
  } else if (!d.present && d.generatable) {
    actions += d.ready
      ? `<button class="btn-gen" data-gen="${esc(d.file)}"><span class="gen-ico">✨</span><span class="gen-txt">Generate</span></button>`
      : `<button class="btn-gen" data-gen="${esc(d.file)}" disabled title="${esc(d.blockedReason)}"><span class="gen-ico">🔒</span><span class="gen-txt">Generate</span></button>`;
  } else if (d.present && d.generatable) {
    actions += `<button class="btn-gen btn-soft" data-gen="${esc(d.file)}"><span class="gen-ico">↻</span><span class="gen-txt">Regenerate</span></button>`;
  }

  const lock = (!d.present && d.generatable && !d.ready && d.blockedReason)
    ? `<div class="dz-lock">🔒 ${esc(d.blockedReason)}</div>` : '';
  const pasteHint = (d.pasteOut && !d.present)
    ? '<div class="dz-hint">Produced when you run <strong>Public web research</strong> — a ready-to-paste prompt for M365 Copilot’s Researcher agent.</div>' : '';

  return `<div class="dcard ${d.present ? '' : 'dcard-empty'} ${d.gateCritical ? 'dcard-gated' : ''}">
    <div class="card-top">
      <div class="card-title">${star}${esc(d.title)}</div>
    </div>
    <div class="card-state ${stateCls}">${esc(state)}</div>
    ${d.present ? provSummary(d) : ''}
    ${lock}${pasteHint}
    ${genCaption(d)}
    <div class="card-actions">${actions}</div>
  </div>`;
}

// The Preparation section: phase-1 setup. Two gating briefs (★), the dual-path
// customer research (public web + the M365 Researcher paste-out/paste-back), and the
// 4-week meeting schedule. Ungraded — the gate is simply "both briefs present".
function renderPreparation(data) {
  const el = document.getElementById('preparation');
  if (!el) return;
  const ps = data.deliverables.filter((d) => d.gate === 'preparation');
  if (!ps.length) { el.hidden = true; el.innerHTML = ''; return; }
  el.hidden = false;
  const gate = (data.preparation && data.preparation.gate) || { status: 'empty', engagementBrief: false, customerBrief: false };
  const rr = (data.preparation && data.preparation.researchResults) || [];
  const grp = (g) => ps.filter((d) => d.group === g);
  const gatePill = gate.status === 'ready' ? '<span class="pill pill-green">Ready</span>'
    : gate.status === 'partial' ? '<span class="pill pill-amber">In progress</span>'
    : '<span class="pill pill-grey">Not started</span>';
  const group = (head, sub, cards, extra = '') => `
    <div class="dz-group">
      <div class="dz-group-head"><h3>${head}</h3><span class="dz-group-sub">${sub}</span></div>
      <div class="cards">${cards.map(preparationCard).join('')}</div>
      ${extra}
    </div>`;
  el.innerHTML = `
    <div class="gate gate-prep">
      <div class="gate-head">
        <h2>Preparation ${infoDot(TIPS.preparation)} ${gatePill}</h2>
        <div class="gate-counts">${gate.engagementBrief ? '✓' : '○'} engagement brief · ${gate.customerBrief ? '✓' : '○'} customer brief</div>
      </div>
      <p class="dz-intro">Week-0 setup. Draft the two briefs (★ — both needed to complete Preparation), run the dual-path customer research, and lay out the meeting schedule. Everything grounds in the sources you add above — never demo data.</p>
      ${group('① The two briefs', 'Studio 42’s internal view + the customer’s own voice', grp('brief'))}
      ${group('② Customer research', 'Public web (in-app) + M365 Researcher (paste-out → paste-back) → synthesis', grp('research'), renderResearchBucket(rr))}
      ${group('③ Meeting schedule', 'The 4-week cadence — kickoff, discovery, the Disrupt workshop, check-ins, handoff', grp('schedule'))}
    </div>`;
  el.querySelectorAll('.btn-m365').forEach((b) => b.addEventListener('click', () => copyM365Prompt(b.dataset.m365)));
  wireResearchBucket();
}
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
        <h2>Sources ${infoDot(TIPS.sources)}</h2>
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
      </div>${genCaption(CONTEXT)}`;
  } else if (hasSources) {
    body = `<div class="ctx-row">
        <span class="ctx-copy"><strong>Step 1 — synthesize your project context.</strong> The engine reads every source and builds <code>PROJECT-CONTEXT.md</code>, the single source of truth your Discover deliverables ground in. Do this before you generate them.</span>
        <span class="grow"></span>
        <button class="btn-gen" data-gen="PROJECT-CONTEXT.md"><span class="gen-ico">✨</span><span class="gen-txt">Synthesize context</span></button>
      </div>${genCaption(CONTEXT)}`;
  } else {
    body = `<div class="ctx-row ctx-empty">
        <span class="ctx-copy">Add your customer's sources above, then synthesize the <strong>project context</strong> that grounds every Discover deliverable.</span>
      </div>`;
  }
  el.hidden = false;
  el.innerHTML = `<div class="ctx-head"><h2>Project context ${infoDot(TIPS.context)}</h2><span class="ctx-sub">The single source of truth · synthesized from your sources</span></div>${body}`;
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

// ---- the Disrupt workshop-capture bucket (sources/workshop/) ----------------
// A focused uploader (fixed kind = 'workshop') for what the designer brings back
// from the offline workshop. Shares the leaf helpers (fileGroup/groupBadge/
// readFileB64) with the Discover bucket but keeps its own queue so the two don't
// interfere.
function renderWorkshopBucket(ws) {
  const list = ws.length
    ? ws.map((s) => `<div class="src-card src-card-sm">
        <div class="src-card-top">
          <span class="src-kind">Capture</span>
          <span class="src-name">${esc(s.name)}</span>
          ${s.original ? `<span class="src-orig" title="Converted from ${esc(s.original.name)}">from ${esc(String(s.original.ext).toUpperCase())}</span>` : ''}
          <span class="grow"></span>
          <button class="src-view" data-srcpath="${esc(s.path)}">View</button>
          ${s.original && s.original.htmlUrl ? `<a class="src-link" href="${esc(s.original.htmlUrl)}" target="_blank" rel="noopener" title="Download ${esc(s.original.name)}">Original ↧</a>` : ''}
          ${s.htmlUrl ? `<a class="src-link" href="${esc(s.htmlUrl)}" target="_blank" rel="noopener">GitHub ↗</a>` : ''}
        </div>
      </div>`).join('')
    : `<div class="src-empty">No captures yet. After the session, drop the workshop notes, whiteboard exports, transcript or recap deck here — <strong>Workshop record</strong> reads them.</div>`;
  return `
    <div class="dz-group dz-capture">
      <div class="dz-group-head"><h3>② Workshop capture</h3><span class="dz-group-sub">What you bring back from the room — saved to sources/workshop/</span></div>
      <div class="dropzone dropzone-sm" id="ws-dropzone" tabindex="0" role="button" aria-label="Drop workshop captures, or click to browse">
        <div class="dz-icon">⬇</div>
        <div class="dz-main">Drop workshop notes, transcripts &amp; recap decks</div>
        <div class="dz-sub">Word, PowerPoint, Excel &amp; PDF → Markdown · notes/.txt/.vtt used as-is · or click to browse</div>
        <input type="file" id="ws-input" multiple hidden accept="${UP_ACCEPT}" />
      </div>
      <div class="upqueue" id="ws-queue" hidden></div>
      <div class="ws-note-bar">
        <button class="btn-add-src" id="ws-note-toggle" type="button" title="Type a quick note from the room instead of uploading a file">✎ Add a note</button>
      </div>
      <form class="src-form" id="ws-form" hidden>
        <label>Workshop note
          <textarea id="ws-content" rows="5" placeholder="The concept the room rallied behind, a key decision, a verbatim reaction…"></textarea>
        </label>
        <div class="src-row"><label class="grow">Name
          <input id="ws-name" placeholder="e.g. Concept vote" autocomplete="off" /></label></div>
        <div class="src-actions"><span class="grow"></span>
          <button type="button" class="btn-ghost" id="ws-cancel">Cancel</button>
          <button type="submit" class="btn-save-src">Add capture</button>
        </div>
        <div class="src-status" id="ws-status" hidden></div>
      </form>
      <div class="src-list">${list}</div>
    </div>`;
}

function wireWorkshopBucket() {
  const dz = document.getElementById('ws-dropzone');
  const input = document.getElementById('ws-input');
  if (dz && input) {
    dz.addEventListener('click', () => input.click());
    dz.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); input.click(); } });
    input.addEventListener('change', () => { if (input.files.length) enqueueWorkshop(input.files); input.value = ''; });
    ['dragenter', 'dragover'].forEach((ev) => dz.addEventListener(ev, (e) => { e.preventDefault(); dz.classList.add('dz-over'); }));
    dz.addEventListener('dragleave', (e) => { e.preventDefault(); dz.classList.remove('dz-over'); });
    dz.addEventListener('drop', (e) => {
      e.preventDefault(); dz.classList.remove('dz-over');
      const f = e.dataTransfer && e.dataTransfer.files;
      if (f && f.length) enqueueWorkshop(f);
    });
  }
  renderWsQueue();
  const toggle = document.getElementById('ws-note-toggle');
  const form = document.getElementById('ws-form');
  if (toggle && form) {
    toggle.addEventListener('click', () => { form.hidden = !form.hidden; toggle.textContent = form.hidden ? '✎ Add a note' : '× Close'; });
    document.getElementById('ws-cancel').addEventListener('click', () => { form.hidden = true; toggle.textContent = '✎ Add a note'; });
    form.addEventListener('submit', (e) => { e.preventDefault(); saveWorkshopNote(); });
  }
}

function enqueueWorkshop(fileList) {
  WSQ_MSG = null;
  for (const file of fileList) {
    const group = fileGroup(file.name);
    WS_QUEUE.push({ id: ++WSQ_ID, file, name: file.name.replace(/\.[^.]+$/, ''), group, skip: group === 'image' });
  }
  renderWsQueue();
}

function renderWsQueue() {
  const el = document.getElementById('ws-queue');
  if (!el) return;
  if (!WS_QUEUE.length) { el.hidden = true; el.innerHTML = ''; return; }
  el.hidden = false;
  const rows = WS_QUEUE.map((it) => `
    <div class="up-row ${it.skip ? 'up-skip' : ''}" data-wsid="${it.id}">
      ${groupBadge(it.group, it.file.name)}
      <span class="up-file" title="${esc(it.file.name)}">${esc(it.file.name)}</span>
      <input class="up-name" data-wsid="${it.id}" value="${esc(it.name)}" placeholder="name" ${it.skip ? 'disabled' : ''} />
      <button type="button" class="up-rm" data-wsrm="${it.id}" title="Remove" aria-label="Remove">×</button>
    </div>`).join('');
  const n = WS_QUEUE.filter((x) => !x.skip).length;
  const msg = `<span class="src-status ${WSQ_MSG ? WSQ_MSG.cls : ''}"${WSQ_MSG ? '' : ' hidden'}>${WSQ_MSG ? esc(WSQ_MSG.text) : ''}</span>`;
  el.innerHTML = `
    <div class="up-list">${rows}</div>
    ${WS_QUEUE.some((x) => x.skip) ? `<div class="up-note">Images are held for your reference only — not sent to the engine yet.</div>` : ''}
    <div class="up-actions">
      <button type="button" class="btn-ghost" id="ws-clear">Clear</button>
      <button type="button" class="btn-save-src" id="ws-go" ${n ? '' : 'disabled'}>Add ${n} capture${n === 1 ? '' : 's'}</button>
      ${msg}
    </div>`;
  document.querySelectorAll('#ws-queue .up-name').forEach((i) => i.addEventListener('input', () => {
    const it = WS_QUEUE.find((x) => x.id === +i.dataset.wsid); if (it) it.name = i.value.trim();
  }));
  document.querySelectorAll('#ws-queue [data-wsrm]').forEach((b) => b.addEventListener('click', () => {
    WS_QUEUE = WS_QUEUE.filter((x) => x.id !== +b.dataset.wsrm); WSQ_MSG = null; renderWsQueue();
  }));
  const clear = document.getElementById('ws-clear');
  if (clear) clear.addEventListener('click', () => { WS_QUEUE = []; WSQ_MSG = null; renderWsQueue(); });
  const go = document.getElementById('ws-go');
  if (go) go.addEventListener('click', uploadWorkshop);
}

async function uploadWorkshop() {
  const items = WS_QUEUE.filter((x) => !x.skip);
  if (!items.length) return;
  const go = document.getElementById('ws-go');
  const set = (text, cls = '', busy = false) => {
    WSQ_MSG = { text, cls };
    const t = document.querySelector('#ws-queue .src-status');
    if (!t) return;
    t.hidden = false; t.className = `src-status ${cls}`;
    t.innerHTML = (busy ? '<span class="spin"></span>' : '') + esc(text);
  };
  if (go) { go.disabled = true; go.classList.add('up-go-busy'); go.innerHTML = '<span class="spin"></span>Adding…'; }
  const okIds = new Set(); const failed = [];
  let i = 0;
  for (const it of items) {
    i++;
    set(`Uploading ${it.file.name} (${i}/${items.length})${it.group === 'convert' ? ' — converting to Markdown…' : '…'}`, '', true);
    try {
      const dataBase64 = await readFileB64(it.file);
      const r = await fetch('/api/sources', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kebab, kind: 'workshop', name: it.name || it.file.name.replace(/\.[^.]+$/, ''), filename: it.file.name, dataBase64 }),
      });
      const b = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(b.error || 'upload failed');
      okIds.add(it.id);
    } catch (e) { failed.push(`${it.file.name} — ${e.message}`); }
  }
  WS_QUEUE = WS_QUEUE.filter((x) => !okIds.has(x.id));
  WSQ_MSG = failed.length
    ? { text: `Added ${okIds.size}. Failed: ${failed.join('; ')}`, cls: 'err' }
    : { text: `Added ${okIds.size} capture${okIds.size === 1 ? '' : 's'}.`, cls: 'ok' };
  if (!failed.length) banner(`✅ Added ${okIds.size} workshop capture${okIds.size === 1 ? '' : 's'}.`, 'ok');
  await load();
}

async function saveWorkshopNote() {
  const name = (document.getElementById('ws-name').value || '').trim();
  const content = document.getElementById('ws-content').value;
  const status = document.getElementById('ws-status');
  const fail = (m) => { status.hidden = false; status.className = 'src-status err'; status.textContent = m; };
  if (!content.trim()) return fail('Add some content first.');
  if (!name) return fail('Give this capture a name.');
  status.hidden = false; status.className = 'src-status'; status.textContent = 'Saving…';
  try {
    const r = await fetch('/api/sources', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ kebab, kind: 'workshop', name, content }),
    });
    const b = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(b.error || 'Could not save the capture.');
    await load();
  } catch (e) { fail(e.message); }
}

// ---- Preparation research paste-back (sources/research/m365-researcher-results.md)
// Path B of the dual-path research: the designer runs the copied prompt in M365
// Copilot's Researcher agent and pastes the response back here (text or a saved file).
// It grounds the research synthesis. Single results doc per engagement.
function renderResearchBucket(rr) {
  const got = rr.length
    ? rr.map((s) => `<div class="src-card src-card-sm">
        <div class="src-card-top">
          <span class="src-kind">M365 results</span>
          <span class="src-name">${esc(s.name)}</span>
          <span class="grow"></span>
          <button class="src-view" data-srcpath="${esc(s.path)}">View</button>
          ${s.htmlUrl ? `<a class="src-link" href="${esc(s.htmlUrl)}" target="_blank" rel="noopener">GitHub ↗</a>` : ''}
        </div>
      </div>`).join('')
    : '';
  return `
    <div class="dz-capture rr-capture">
      <div class="dz-group-head"><h3>↩ Paste back the M365 Researcher results</h3><span class="dz-group-sub">Run the copied prompt in M365 Copilot, then paste the response here — it grounds the synthesis</span></div>
      ${got
        ? `<div class="src-list">${got}</div>`
        : '<div class="src-empty">No results yet. Copy the <strong>M365 Researcher prompt</strong> above, run it in M365 Copilot’s Researcher agent, then paste the response back here. Once it lands, <strong>Research synthesis</strong> unlocks.</div>'}
      <form class="src-form" id="rr-form">
        <label>M365 Researcher response
          <textarea id="rr-content" rows="6" placeholder="Paste the full response from M365 Copilot’s Researcher agent here…"></textarea>
        </label>
        <div class="src-actions">
          <label class="btn-ghost rr-file-btn">Drop / browse a file<input type="file" id="rr-input" hidden accept="${UP_ACCEPT}" /></label>
          <span class="grow"></span>
          <button type="submit" class="btn-save-src" id="rr-save">${rr.length ? 'Replace results' : 'Save results'}</button>
        </div>
        <div class="src-status" id="rr-status" hidden></div>
      </form>
    </div>`;
}

function wireResearchBucket() {
  const form = document.getElementById('rr-form');
  if (!form) return;
  form.addEventListener('submit', (e) => { e.preventDefault(); saveResearchResults(); });
  const input = document.getElementById('rr-input');
  if (input) input.addEventListener('change', () => { if (input.files.length) uploadResearchFile(input.files[0]); input.value = ''; });
}

async function saveResearchResults() {
  const content = document.getElementById('rr-content').value;
  const status = document.getElementById('rr-status');
  const fail = (m) => { status.hidden = false; status.className = 'src-status err'; status.textContent = m; };
  if (!content.trim()) return fail('Paste the M365 Researcher response first, or drop a file.');
  status.hidden = false; status.className = 'src-status'; status.textContent = 'Saving…';
  try {
    const r = await fetch('/api/sources', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ kebab, kind: 'm365-results', content }),
    });
    const b = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(b.error || 'Could not save the results.');
    banner('✅ M365 Researcher results saved — you can now generate the Research synthesis.', 'ok');
    await load();
  } catch (e) { fail(e.message); }
}

async function uploadResearchFile(file) {
  const status = document.getElementById('rr-status');
  const set = (m, cls = '', busy = false) => { status.hidden = false; status.className = `src-status ${cls}`; status.innerHTML = (busy ? '<span class="spin"></span>' : '') + esc(m); };
  if (fileGroup(file.name) === 'image') return set('Images can’t be used as research — paste the text or drop a document.', 'err');
  set(`Uploading ${file.name}${fileGroup(file.name) === 'convert' ? ' — converting to Markdown…' : '…'}`, '', true);
  try {
    const dataBase64 = await readFileB64(file);
    const r = await fetch('/api/sources', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ kebab, kind: 'm365-results', filename: file.name, dataBase64 }),
    });
    const b = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(b.error || 'upload failed');
    banner('✅ M365 Researcher results saved — you can now generate the Research synthesis.', 'ok');
    await load();
  } catch (e) { set(e.message, 'err'); }
}

// Copy the M365 Researcher prompt to the clipboard so the designer can paste it into
// M365 Copilot's Researcher agent (Path B of the dual-path research). The response they
// get back is pasted into the research bucket above.
async function copyM365Prompt(file) {
  const d = DELIVERABLES.find((x) => x.file === file);
  let text = d && d.markdown;
  if (!text) {
    try {
      const r = await fetch(`/api/source?kebab=${kebab}&path=${encodeURIComponent('sources/research/' + file)}`);
      if (r.ok) text = (await r.json()).text;
    } catch { /* fall through */ }
  }
  if (!text) { banner('❌ Nothing to copy yet — run Public web research first.', 'err'); return; }
  try {
    await navigator.clipboard.writeText(text);
    banner('📋 M365 Researcher prompt copied — paste it into <a href="https://m365.cloud.microsoft" target="_blank" rel="noopener">M365 Copilot ↗</a> → Agents → Researcher, then paste the result back below.', 'ok');
  } catch {
    banner('Couldn’t access the clipboard — open the file with View and copy manually.', 'err');
  }
}

// Copy the spark-prompts.md body to the clipboard so the designer can paste the
// ready-made Spark / Copilot Studio prompts straight into spark.github.com.
async function copySpark(file) {
  const d = DELIVERABLES.find((x) => x.file === file);
  let text = d && d.markdown;
  if (!text) {
    try {
      const r = await fetch(`/api/source?kebab=${kebab}&path=${encodeURIComponent('engagement/' + kebab + '/' + file)}`);
      if (r.ok) text = (await r.json()).text;
    } catch { /* fall through */ }
  }
  if (!text) { banner('❌ Nothing to copy yet — generate Ideation concepts first.', 'err'); return; }
  try {
    await navigator.clipboard.writeText(text);
    banner('📋 Spark prompts copied — paste them into <a href="https://spark.github.com" target="_blank" rel="noopener">spark.github.com ↗</a> before the workshop.', 'ok');
  } catch {
    banner('Couldn’t access the clipboard — open the file with View and copy manually.', 'err');
  }
}

// Dispatch a phase in the engagement's repo, then poll until the engine run
// finishes and reload the board (the engine commits the deliverable + gates.json).
async function generate(file) {
  if (RUNNING) return;
  RUNNING = true;
  setGenButtons(true);
  setGenBusy(file);
  const d = DELIVERABLES.find((x) => x.file === file);
  const title = RUN_TITLES[file] || (d || {}).title || file;
  const isDisrupt = d && d.gate === 'disrupt';
  const isPrep = d && d.gate === 'preparation';
  const grounded = SOURCES.length > 0;
  // Transparency: name the agent + prompt this run dispatches (same binding shown on
  // the card). PROJECT-CONTEXT.md isn't a deliverable card, so fall back to CONTEXT.
  const gm = (d && d.prompt) ? d : (file === 'PROJECT-CONTEXT.md' ? CONTEXT : null);
  const runsNote = (gm && gm.prompt)
    ? ` <span class="run-meta">· ${esc(gm.agent || 'VIBE engine')} running <code>${esc(gm.prompt)}</code></span>`
    : '';
  // Disrupt deliverables ground in the signed-off Discover deliverables + workshop
  // captures, never the Contoso seed; Preparation grounds in the designer's sources &
  // briefs — so the "demo data" caveat only applies to Discover with no sources added.
  const groundNote = isDisrupt
    ? 'from your Discover deliverables &amp; workshop captures'
    : isPrep
      ? 'from your sources &amp; briefs'
      : (grounded ? 'from your sources' : '(Contoso demo data — no sources added)');
  banner(`<span class="spin"></span> Generating <strong>${esc(title)}</strong> ${groundNote} — dispatching the engine…${runsNote}`, 'busy');

  let priorId = null;
  try { priorId = (await (await fetch(`/api/run/status?kebab=${kebab}`)).json()).databaseId || null; } catch { /* none yet */ }

  try {
    const res = await fetch('/api/run', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ kebab, file, seedDemo: (isDisrupt || isPrep) ? false : !grounded }),
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
      banner(`<span class="spin"></span> Generating <strong>${title}</strong> — queuing the run…${runsNote}`, 'busy');
    } else if (run.status !== 'completed') {
      banner(`<span class="spin"></span> Generating <strong>${title}</strong> — engine running in GitHub Actions (${run.status})…${runsNote}${link}`, 'busy');
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

// ---- Mock data: structured files that do double duty ------------------------
// Staged into sources/sample-data/ and synced to the repo. Each file is committed
// twice: the RAW original powers the prototype (the engineer's /vibe-data-prep agent
// turns it into typed models + a DataService at Build), and a Markdown/JSON grounding
// twin (sources/data-<stem>.md) lets the SAME data inform the Discover deliverables —
// a returns export shapes personas and the journey, not just the prototype. Kept as
// its own bucket so data stays visually distinct from Sources; CSV/Excel/JSON only.
const DATA_EXT_LIST = ['csv', 'xlsx', 'xls', 'json'];
const DATA_ACCEPT = DATA_EXT_LIST.map((e) => `.${e}`).join(',');

function fmtBytes(n) {
  if (n == null) return '';
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${Math.round(n / 1024)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}
function dataExtOk(name) {
  const e = (String(name).toLowerCase().match(/\.([^.]+)$/) || [, ''])[1];
  return DATA_EXT_LIST.includes(e);
}

function renderData(data) {
  const el = document.getElementById('data');
  if (!el) return;
  el.hidden = false;
  const files = (data.mockData && data.mockData.files) || [];
  const list = files.length
    ? files.map((f) => `<div class="src-card">
        <div class="src-card-top">
          <span class="src-kind data-ext">${esc(String(f.ext || 'data').toUpperCase())}</span>
          <span class="src-name">${esc(f.name)}</span>
          ${f.size != null ? `<span class="data-size">${esc(fmtBytes(f.size))}</span>` : ''}
          ${f.grounded
            ? '<span class="data-badge" title="Also converted to a table that grounds your Discover deliverables">✓ grounds Discover</span>'
            : '<span class="data-badge data-badge-off" title="Raw file staged for Build; no Discover grounding twin was created">raw only</span>'}
          <span class="grow"></span>
          ${f.htmlUrl ? `<a class="src-link" href="${esc(f.htmlUrl)}" target="_blank" rel="noopener">GitHub ↗</a>` : ''}
        </div>
      </div>`).join('')
    : `<div class="src-empty">No mock data yet. Drop the customer's <strong>CSV, Excel or JSON</strong> here — it powers the prototype <em>and</em> grounds your Discover work.</div>`;

  el.innerHTML = `
    <div class="gate gate-data">
      <div class="gate-head">
        <h2>Mock data ${infoDot(TIPS.data)} <span class="pill pill-grey">${files.length} file${files.length === 1 ? '' : 's'}</span></h2>
        <div class="gate-counts">→ sources/sample-data/ · powers the prototype + grounds Discover</div>
      </div>
      <p class="dz-intro">The customer's structured data, doing <strong>two jobs</strong>: the raw file <strong>powers the prototype</strong> the engineer builds (<code>/vibe-data-prep</code> turns it into typed models), and a table version <strong>grounds your Discover work</strong> — a returns export can shape personas, pain points and the journey. Drop the customer's <strong>CSV / Excel / JSON</strong> here; documents still belong in the Sources bucket above.</p>
      <div class="data-warn">🔒 <strong>Mock or anonymised data only</strong> — never real customer PII. It now feeds Discover too, so any names, emails, IDs or addresses would reach a deliverable. The Data Prep agent also enforces a hard guardrail at Build; keep it clean from the start.</div>
      <div class="dropzone" id="data-dropzone" tabindex="0" role="button" aria-label="Drop CSV, Excel or JSON, or click to browse">
        <div class="dz-icon">⬇</div>
        <div class="dz-main">Drop CSV, Excel or JSON here</div>
        <div class="dz-sub">Structured/tabular data only · kept raw for Build · also summarised to ground Discover · or click to browse</div>
        <input type="file" id="data-input" multiple hidden accept="${DATA_ACCEPT}" />
      </div>
      <div class="data-status" id="data-status" hidden></div>
      <div class="src-list">${list}</div>
    </div>`;
  wireDataBucket();
}

function wireDataBucket() {
  const dz = document.getElementById('data-dropzone');
  const input = document.getElementById('data-input');
  if (!dz || !input) return;
  dz.addEventListener('click', () => input.click());
  dz.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); input.click(); } });
  dz.addEventListener('dragover', (e) => { e.preventDefault(); dz.classList.add('dz-over'); });
  dz.addEventListener('dragleave', () => dz.classList.remove('dz-over'));
  dz.addEventListener('drop', (e) => {
    e.preventDefault(); dz.classList.remove('dz-over');
    if (e.dataTransfer.files.length) uploadDataFiles(e.dataTransfer.files);
  });
  input.addEventListener('change', () => { if (input.files.length) uploadDataFiles(input.files); input.value = ''; });
}

async function uploadDataFiles(fileList) {
  const status = document.getElementById('data-status');
  const set = (m, cls = '', busy = false) => { status.hidden = false; status.className = `data-status ${cls}`; status.innerHTML = (busy ? '<span class="spin"></span>' : '') + esc(m); };
  const files = [...fileList];
  const bad = files.filter((f) => !dataExtOk(f.name));
  if (bad.length)
    return set(`Only CSV, Excel and JSON are accepted here — ${bad.map((f) => f.name).join(', ')} ${bad.length === 1 ? "isn't" : "aren't"} structured data. Add documents as a Source instead.`, 'err');
  let ok = 0;
  for (const file of files) {
    set(`Staging ${file.name}…`, '', true);
    try {
      const dataBase64 = await readFileB64(file);
      const r = await fetch('/api/data', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kebab, filename: file.name, dataBase64 }),
      });
      const b = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(b.error || 'Could not stage that file.');
      ok++;
    } catch (e) { return set(e.message, 'err'); }
  }
  banner(`✅ ${ok} data file${ok === 1 ? '' : 's'} staged — raw for the prototype, and grounding your Discover work. Synced to the repo.`, 'ok');
  await load();
}

// Engine model picker (top bar). Persists the choice per engagement so every
// Generate in this engagement runs the engine on the chosen model. Blank = the
// Copilot CLI default (Claude Sonnet 4.5).
function renderEngineBar() {
  const el = document.getElementById('engine-pick');
  if (!el || !MODELS.length) return;
  const opts = MODELS.map((m) =>
    `<option value="${esc(m.id)}"${m.id === MODEL ? ' selected' : ''}>${esc(m.label)}</option>`).join('');
  el.hidden = false;
  el.innerHTML = `
    <span class="engine-label">Engine model</span>
    ${infoDot(TIPS.model, true)}
    <select id="engine-model" class="engine-model" aria-label="Engine model">${opts}</select>
    <span class="engine-saved" id="engine-saved" aria-live="polite"></span>`;
  const sel = el.querySelector('#engine-model');
  const note = (text, cls) => {
    const s = document.getElementById('engine-saved');
    if (s) { s.textContent = text; s.className = `engine-saved${cls ? ' ' + cls : ''}`; }
  };
  sel.addEventListener('change', async () => {
    const model = sel.value;
    sel.disabled = true;
    note('Saving…');
    try {
      const r = await fetch('/api/model', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kebab, model }),
      });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(j.error || r.statusText);
      MODEL = model;
      note('✓ Saved', 'ok');
    } catch (e) {
      note('✕ ' + e.message, 'err');
      sel.value = MODEL;
    } finally {
      sel.disabled = false;
      setTimeout(() => note(''), 2500);
    }
  });
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
  MODEL = data.model || '';
  MODELS = data.models || [];
  document.getElementById('eng-name').textContent = data.name || kebab;
  const subBase = data.handoffReady ? 'Ready for engineering hand-off' : 'Phases 1–3 in progress';
  const repoLink = data.htmlUrl
    ? ` · <a href="${data.htmlUrl}" target="_blank" rel="noopener">${data.repo} ↗</a>`
    : '';
  document.getElementById('eng-sub').innerHTML = subBase + repoLink;

  renderEngineBar();
  renderTimeline(data.gates, data.preparation && data.preparation.gate);

  // Preparation (phase 1) gets its own section above the Discover gates; Discover gates
  // render in #gates; Disrupt gets its own richer section (#disrupt) that models the
  // workshop-in-the-middle flow.
  renderPreparation(data);
  const discoverDs = data.deliverables.filter((d) => d.gate === 'discover');
  document.getElementById('gates').innerHTML =
    gateBlock('Discover', data.gates.discover, discoverDs, TIPS.discover);
  renderDisrupt(data);

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
  // Mock data sits directly under Sources (both are up-front grounding inputs the
  // facilitator collects early), so render it alongside the sources panel.
  renderData(data);
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

async function boot() {
  const me = await vibeEnsureAuth();
  if (!me) return; // sign-in gate is showing — stop here
  load();
}
boot();
