// VIBE Web Surface — minimal provisioning backend (MVP M4 slice).
// Zero npm dependencies: Node built-ins only. Auth piggybacks on the GitHub CLI
// (`gh auth token`), so it runs as the signed-in employee — the run-as-user model.
//
//   node surface/server.mjs   →   http://localhost:4310
//
// Endpoints:
//   GET  /api/config           -> template + default owner
//   GET  /api/engagements      -> the local pointer store (engagement -> repo)
//   POST /api/engagements      -> create a repo from the template, verify the engine
//                                 shipped, record the pointer, return the repo.
//   GET  /api/board            -> engagements (from the pointer store) with live gate
//                                 state read from each engagement's own repo
//   GET  /api/board/<kebab>    -> one engagement: gates + rendered deliverables
//   (?source=local on either reads the in-repo engagement/ folders — dev fallback)
//   POST /api/run              -> dispatch a phase (run-phase.yml) in the engagement repo
//                                 (seedDemo=false once the designer has added sources)
//   GET  /api/run/status?kebab -> latest engine run status for the engagement
//   POST /api/approve          -> write a sign-off row into a deliverable + refresh
//                                 the engagement's committed gates.json
//   GET  /api/sources?kebab    -> the designer-added sources in the engagement repo
//   POST /api/sources          -> commit a customer source (brief/transcript/etc.) so
//                                 the engine reads it on the next Generate. Accepts
//                                 pasted text, native-text uploads, and Office/PDF
//                                 uploads (auto-converted to Markdown via MarkItDown;
//                                 raw original committed alongside the extracted .md)

import { createServer } from 'node:http';
import { execSync, execFile } from 'node:child_process';
import { readFile, writeFile, mkdir, readdir, unlink } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, extname } from 'node:path';
import { tmpdir } from 'node:os';
import { randomUUID } from 'node:crypto';
import { promisify } from 'node:util';
import { computeGates, computeGatesFromContents, extractProvenance, GATES, signoff } from '../scripts/gates-lib.mjs';
import { tidyRepo } from './tidy-repo.mjs';
const execFileP = promisify(execFile);

const __dir = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dir, '..');
const ENGAGE_ROOT = join(REPO_ROOT, 'engagement');
const PORT = process.env.PORT || 4310;
const TEMPLATE_OWNER = process.env.TEMPLATE_OWNER || 'ablack34';
const TEMPLATE_REPO = process.env.TEMPLATE_REPO || 'vibe-prototyping-framework';
const STORE = join(__dir, '.engagements.json');
const PUBLIC = join(__dir, 'public');

let cachedToken = null;
function token() {
  if (!cachedToken) cachedToken = execSync('gh auth token', { encoding: 'utf8' }).trim();
  return cachedToken;
}
let cachedLogin = null;
function login() {
  if (!cachedLogin) cachedLogin = execSync('gh api user --jq .login', { encoding: 'utf8' }).trim();
  return cachedLogin;
}

async function gh(path, { method = 'GET', body } = {}) {
  const res = await fetch(`https://api.github.com${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token()}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'Content-Type': 'application/json',
      'User-Agent': 'vibe-surface',
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  let json = null;
  try { json = await res.json(); } catch { /* empty body */ }
  return { status: res.status, json };
}

function kebab(s) {
  return String(s).toLowerCase().trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 90);
}

async function readStore() {
  if (!existsSync(STORE)) return [];
  try { return JSON.parse(await readFile(STORE, 'utf8')); } catch { return []; }
}
async function writeStore(list) {
  await writeFile(STORE, JSON.stringify(list, null, 2));
}

// Verify the engine (the framework's .github/) shipped into the new repo.
// There can be a brief lag after generation, so retry a couple of times.
async function engineShipped(fullName) {
  for (let i = 0; i < 3; i++) {
    const r = await gh(`/repos/${fullName}/contents/.github/copilot-instructions.md`);
    if (r.status === 200) return true;
    await new Promise((res) => setTimeout(res, 1500));
  }
  return false;
}

// Mirror the signed-in user's token into the new repo as the engine secret.
// gh reads the value from STDIN when --body is omitted, so it never hits argv.
function setRepoSecret(fullName, name, value) {
  execSync(`gh secret set ${name} --repo ${fullName}`, { input: value, stdio: ['pipe', 'pipe', 'pipe'] });
}

// Best-effort: is Actions enabled on the repo? null if we couldn't tell.
function actionsEnabled(fullName) {
  try {
    return execSync(`gh api /repos/${fullName}/actions/permissions --jq .enabled`, { encoding: 'utf8' }).trim() === 'true';
  } catch { return null; }
}

// Read a file's text from a repo via the GitHub Contents API (base64 → utf8).
async function fetchRepoFile(fullName, path, ref) {
  const q = ref ? `?ref=${encodeURIComponent(ref)}` : '';
  const r = await gh(`/repos/${fullName}/contents/${path}${q}`);
  if (r.status !== 200 || !r.json?.content) return null;
  return Buffer.from(r.json.content, r.json.encoding || 'base64').toString('utf8');
}

// The committed gates.json IS the gate state — fetch + parse it from the repo.
async function repoGates(fullName, id) {
  const txt = await fetchRepoFile(fullName, `engagement/${id}/gates.json`);
  if (!txt) return null;
  try { return JSON.parse(txt); } catch { return null; }
}

// Shape-compatible "nothing run yet" gates for a freshly provisioned engagement.
function emptyGates() {
  const gates = {};
  for (const [gate, cfg] of Object.entries(GATES)) {
    gates[gate] = {
      status: 'NOT_STARTED',
      artifactsPresent: `0/${cfg.files.length}`,
      gradePassing: `0/${cfg.files.length}`,
      signoffOk: true,
      stale: false,
    };
  }
  return { artifacts: {}, gates, handoffReady: false, commitSha: null };
}

async function createEngagement(input) {
  const displayName = String(input.name || '').trim();
  if (!displayName) return { code: 400, body: { error: 'Engagement name is required.' } };

  const repoName = input.repo ? kebab(input.repo) : kebab(displayName);
  if (!/^[a-z0-9][a-z0-9-]*$/.test(repoName))
    return { code: 400, body: { error: `Could not derive a valid repo name from "${displayName}".` } };

  const owner = String(input.owner || login()).trim();
  if (!/^[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?$/.test(owner))
    return { code: 400, body: { error: `Invalid owner "${owner}".` } };

  const isPrivate = input.private !== false;

  const gen = await gh(`/repos/${TEMPLATE_OWNER}/${TEMPLATE_REPO}/generate`, {
    method: 'POST',
    body: {
      owner,
      name: repoName,
      description: input.description || `VIBE engagement: ${displayName}`,
      private: isPrivate,
      include_all_branches: false,
    },
  });

  if (gen.status !== 201) {
    const raw = gen.json?.message || `GitHub returned ${gen.status}`;
    const detail = gen.json?.errors?.map((e) => e.message || e.code).join('; ');
    if (/already exists/i.test(raw) || /already exists/i.test(detail || '')) {
      return {
        code: 409,
        body: {
          error: `An engagement named "${repoName}" already exists under ${owner}.`,
          detail: 'Pick a different engagement name, or delete the existing repository first.',
        },
      };
    }
    return { code: gen.status === 422 ? 409 : 502, body: { error: raw, detail } };
  }

  const repo = gen.json;
  const enginePresent = await engineShipped(repo.full_name);

  // A generated repo inherits the WHOLE framework — the control surface, docs
  // site, other engagements, and framework-only deploy workflows (which fail
  // noisily on the engine's commits). Strip it down to just the engine + what the
  // engineer needs, in one commit, so the designer's repo is clean from the start.
  let tidied = false;
  try {
    const t = await tidyRepo(repo.full_name, {
      token: token(),
      defaultBranch: repo.default_branch || 'main',
      keepEngagement: kebab(displayName),
    });
    tidied = !!t.ok;
  } catch { tidied = false; }

  // The engine (run-phase.yml) needs a Copilot-enabled token to run in the new
  // repo's Actions. Mirror the signed-in user's token in as a repo secret so the
  // "Generate" button can dispatch a phase with no further setup.
  let secretSet = false;
  try { setRepoSecret(repo.full_name, 'COPILOT_GITHUB_TOKEN', token()); secretSet = true; }
  catch { secretSet = false; }
  const actionsOn = actionsEnabled(repo.full_name);

  const record = {
    id: kebab(displayName),
    name: displayName,
    repo: repo.full_name,
    htmlUrl: repo.html_url,
    private: repo.private,
    enginePresent,
    tidied,
    secretSet,
    actionsEnabled: actionsOn,
    createdAt: new Date().toISOString(),
    createdBy: login(),
  };
  const store = await readStore();
  store.unshift(record);
  await writeStore(store);

  return { code: 201, body: record };
}

// ---- dashboard: local engagements + live gate state ----
// The engagement git working tree IS the source of truth; for the MVP the server
// reads it directly. (Production swaps this for the GitHub Contents API — same
// shape, so the UI is unchanged.)

const DELIVERABLE_TITLES = {
  'personas.md': 'Personas',
  'problem-statement.md': 'Problem statement',
  'current-state-journey.md': 'Current-state journey',
  'selected-concept.md': 'Selected concept',
  'future-state-journey.md': 'Future-state journey',
  'storyboard.md': 'Storyboard',
};
const FILE_GATE = Object.fromEntries(
  Object.entries(GATES).flatMap(([gate, cfg]) => cfg.files.map((f) => [f, gate])),
);

function deliverablesFrom(gateObj) {
  return Object.keys(DELIVERABLE_TITLES).map((file) => {
    const a = gateObj.artifacts[file] || { present: false };
    return {
      file,
      title: DELIVERABLE_TITLES[file],
      gate: FILE_GATE[file],
      present: !!a.present,
      grade: a.grade ?? null,
      gradePass: !!a.gradePass,
      signedOffBy: a.signedOffBy ?? null,
      signedOffAt: a.signedOffAt ?? null,
      stale: !!a.stale,
    };
  });
}

async function listEngagementDirs() {
  if (!existsSync(ENGAGE_ROOT)) return [];
  const entries = await readdir(ENGAGE_ROOT, { withFileTypes: true });
  return entries
    .filter((e) => e.isDirectory() && !e.name.startsWith('.') && !e.name.startsWith('_'))
    .map((e) => e.name);
}

async function boardSummaryLocal() {
  const out = [];
  for (const kebab of await listEngagementDirs()) {
    const g = computeGates(join(ENGAGE_ROOT, kebab));
    out.push({
      kebab,
      gates: g.gates,
      handoffReady: g.handoffReady,
      deliverables: deliverablesFrom(g),
    });
  }
  return out;
}

// Primary board: one row per provisioned engagement (from the pointer store),
// with gate state read live from that engagement's own repo (its committed
// gates.json). A repo with no phase run yet shows as NOT_STARTED.
async function boardSummary() {
  const store = await readStore();
  const out = [];
  for (const rec of store) {
    const id = rec.id || kebab(rec.name || '');
    if (!id || !rec.repo) continue;
    const g = (await repoGates(rec.repo, id)) || emptyGates();
    out.push({
      kebab: id,
      name: rec.name || id,
      repo: rec.repo,
      htmlUrl: rec.htmlUrl,
      enginePresent: rec.enginePresent !== false,
      secretSet: rec.secretSet === true,
      gates: g.gates,
      handoffReady: !!g.handoffReady,
      deliverables: deliverablesFrom(g),
    });
  }
  return out;
}

// Compute provenance receipts for each rendered deliverable + the reverse index
// (which source feeds which deliverable). Runs over the freshly-fetched markdown,
// so the board is always current even when a committed gates.json predates the
// provenance feature (the spec's on-the-fly fallback). Same extractProvenance the
// engine/CLI use, so the two never disagree.
function attachDeliverableProvenance(deliverables, knownPaths) {
  const empty = () => ({ sources: [], citations: [], supportMix: { quoted: 0, reasoned: 0 } });
  const bySource = {};
  for (const d of deliverables) {
    if (!d.present || !d.markdown) { d.provenance = empty(); continue; }
    const p = extractProvenance(d.markdown, knownPaths);
    d.provenance = p;
    const used = new Set([...p.sources, ...p.citations.map((c) => c.source)]);
    for (const s of used) {
      (bySource[s] ||= { usedBy: [], citationCount: 0 });
      if (!bySource[s].usedBy.includes(d.file)) bySource[s].usedBy.push(d.file);
    }
    for (const c of p.citations) {
      (bySource[c.source] ||= { usedBy: [], citationCount: 0 });
      bySource[c.source].citationCount++;
    }
  }
  return bySource;
}

async function boardDetailLocal(kebab) {
  const dir = join(ENGAGE_ROOT, kebab);
  if (!existsSync(dir)) return null;
  const g = computeGates(dir);
  const deliverables = deliverablesFrom(g);
  for (const d of deliverables) {
    if (d.present) {
      try { d.markdown = await readFile(join(dir, d.file), 'utf8'); } catch { d.markdown = ''; }
    }
  }
  const bySource = attachDeliverableProvenance(deliverables, []);
  const context = { present: existsSync(join(dir, 'PROJECT-CONTEXT.md')), path: `engagement/${kebab}/PROJECT-CONTEXT.md` };
  return { kebab, gates: g.gates, handoffReady: g.handoffReady, commitSha: g.commitSha, deliverables, context, provenance: { bySource } };
}

// Primary detail: gate state + rendered deliverables read from the engagement's
// own repo via the Contents API.
async function boardDetail(kebab) {
  const store = await readStore();
  const rec = store.find((r) => (r.id || '') === kebab);
  if (!rec || !rec.repo) return null;
  const g = (await repoGates(rec.repo, kebab)) || emptyGates();
  const deliverables = deliverablesFrom(g);
  for (const d of deliverables) {
    if (d.present) d.markdown = (await fetchRepoFile(rec.repo, `engagement/${kebab}/${d.file}`)) || '';
  }
  const sources = await listSources(rec);
  const bySource = attachDeliverableProvenance(deliverables, sources.map((s) => s.path));
  for (const s of sources) {
    const e = bySource[s.path] || { usedBy: [], citationCount: 0 };
    s.usedBy = e.usedBy;
    s.citationCount = e.citationCount;
  }
  // PROJECT-CONTEXT.md is the single source of truth the Discover deliverables
  // ground in. It isn't a graded gate, so surface its presence separately so the
  // designer can synthesize it (from sources) before generating deliverables.
  const ctxPath = `engagement/${kebab}/PROJECT-CONTEXT.md`;
  const context = { present: (await fetchRepoFile(rec.repo, ctxPath)) != null, path: ctxPath };
  return {
    kebab,
    name: rec.name || kebab,
    repo: rec.repo,
    htmlUrl: rec.htmlUrl,
    enginePresent: rec.enginePresent !== false,
    secretSet: rec.secretSet === true,
    gates: g.gates,
    handoffReady: !!g.handoffReady,
    commitSha: g.commitSha ?? null,
    deliverables,
    sources,
    context,
    kinds: sourceKindMeta(),
    provenance: { bySource },
  };
}

// ---- run a phase from the web (dispatch the engine workflow) ----
// Each generatable deliverable maps to the VIBE prompt that produces it. Clicking
// "Generate" dispatches run-phase.yml in the engagement's OWN repo; the engine
// writes the deliverable + gates.json back, and the board re-reads it. Scoped to
// the Discover deliverables — the Disrupt ones need workshop sources seed_demo
// doesn't provide.
const FILE_PROMPT = {
  'PROJECT-CONTEXT.md': 'vibe-context',
  'personas.md': 'vibe-personas',
  'problem-statement.md': 'vibe-problem-statement',
  'current-state-journey.md': 'vibe-current-journey',
};

async function runPhase(input) {
  const kebab = String(input.kebab || '').trim();
  const file = String(input.file || '').trim();
  const prompt = FILE_PROMPT[file];
  if (!kebab) return { code: 400, body: { error: 'Engagement is required.' } };
  if (!prompt) return { code: 400, body: { error: `No generator is wired for "${file}".` } };
  const rec = (await readStore()).find((r) => (r.id || '') === kebab);
  if (!rec || !rec.repo) return { code: 404, body: { error: 'Engagement not found.' } };
  // Once the designer has added real sources, stop seeding the Contoso demo so
  // the engine grounds the deliverable in their materials. The frontend passes
  // seedDemo explicitly; default to true to preserve the canned-demo flow.
  const seed = input.seedDemo === false ? 'false' : 'true';
  try {
    execSync(
      `gh workflow run run-phase.yml --repo ${rec.repo} -f prompt=${prompt} -f engagement=${kebab} -f seed_demo=${seed}`,
      { stdio: 'pipe' },
    );
  } catch (e) {
    return { code: 502, body: { error: 'Could not dispatch the run.', detail: String(e.stderr || e.message || e).trim() } };
  }
  return { code: 202, body: { ok: true, repo: rec.repo, prompt, engagement: kebab, seededDemo: seed === 'true' } };
}

async function runStatus(kebab) {
  const rec = (await readStore()).find((r) => (r.id || '') === kebab);
  if (!rec || !rec.repo) return null;
  try {
    const out = execSync(
      `gh run list --repo ${rec.repo} --workflow run-phase.yml --limit 1 --json databaseId,status,conclusion,url,createdAt`,
      { encoding: 'utf8' },
    );
    return JSON.parse(out)[0] || null;
  } catch { return null; }
}

// ---- approve a deliverable from the web (write sign-off + refresh gates) ----
// The board reads each deliverable's sign-off from the committed gates.json, so
// approving has to do two things in the engagement's repo: (1) write a real row
// into the deliverable's "## Sign-off" table, and (2) recompute + commit
// gates.json. The recompute runs server-side with the engine's own gate logic
// (computeGatesFromContents) — no Actions round-trip — so the card flips to
// "signed off" the moment the board reloads.

function userDisplayName() {
  try {
    const n = execSync('gh api user --jq .name', { encoding: 'utf8' }).trim();
    if (n && n !== 'null' && n !== '') return n;
  } catch { /* fall back to login */ }
  return login();
}
const today = () => new Date().toISOString().slice(0, 10);

// Insert a sign-off row into a deliverable's "## Sign-off" table. Returns the new
// text, or null if it's already signed (caller treats that as a no-op).
function applySignoff(text, name, role, date) {
  if (signoff(text)) return null;
  const row = `| ${name} | ${role} | ${date} | Approved via VIBE web surface |`;
  const m = text.match(/##\s*Sign-?off[^\n]*\n/i);
  if (!m) {
    return `${text.replace(/\s*$/, '')}\n\n## Sign-off\n\n` +
      `| Reviewed by | Role | Date | Signature / approval note |\n|---|---|---|---|\n${row}\n`;
  }
  const start = m.index + m[0].length;
  const head = text.slice(0, start);
  const lines = text.slice(start).split('\n');
  let sep = -1;
  for (let i = 0; i < lines.length; i++) {
    if (/^\s*\|\s*-{2,}/.test(lines[i])) { sep = i; break; }
    if (/^\s*#{1,6}\s/.test(lines[i])) break; // hit the next section before any table
  }
  if (sep === -1) {
    return `${head}\n| Reviewed by | Role | Date | Signature / approval note |\n|---|---|---|---|\n${row}\n` +
      text.slice(start);
  }
  const next = lines[sep + 1] ?? '';
  const placeholder = next.includes('|') && !/[A-Za-z0-9]/.test(next.replace(/\{\{[^}]*\}\}/g, ''));
  if (placeholder) lines[sep + 1] = row;
  else lines.splice(sep + 1, 0, row);
  return head + lines.join('\n');
}

// Recompute the engagement's gates.json from its repo contents (with any just-
// written file passed in via `overrides`, to avoid read-after-write lag) and
// commit it back. Shares the engine's gate logic so it can never drift.
async function refreshRepoGates(fullName, id, overrides = {}, commitSha = null) {
  const contents = {};
  for (const f of Object.keys(DELIVERABLE_TITLES)) {
    contents[f] = f in overrides ? overrides[f] : await fetchRepoFile(fullName, `engagement/${id}/${f}`);
  }
  const gatesPath = `engagement/${id}/gates.json`;
  const cur = await gh(`/repos/${fullName}/contents/${gatesPath}`);
  let prior = { artifacts: {} };
  if (cur.status === 200 && cur.json?.content) {
    try { prior = JSON.parse(Buffer.from(cur.json.content, cur.json.encoding || 'base64').toString('utf8')); }
    catch { /* keep default */ }
  }
  const out = computeGatesFromContents(id, contents, prior, commitSha ?? prior.commitSha ?? null,
    (await listSources({ id, repo: fullName })).map((s) => s.path));
  const body = {
    message: `Refresh gates after web sign-off (${id})`,
    content: Buffer.from(JSON.stringify(out, null, 2) + '\n', 'utf8').toString('base64'),
  };
  if (cur.status === 200 && cur.json?.sha) body.sha = cur.json.sha;
  const put = await gh(`/repos/${fullName}/contents/${gatesPath}`, { method: 'PUT', body });
  return { ok: put.status === 200 || put.status === 201, gates: out };
}

async function approveDeliverable(input) {
  const id = String(input.kebab || '').trim();
  const file = String(input.file || '').trim();
  if (!id) return { code: 400, body: { error: 'Engagement is required.' } };
  if (!DELIVERABLE_TITLES[file]) return { code: 400, body: { error: `Unknown deliverable "${file}".` } };
  const rec = (await readStore()).find((r) => (r.id || '') === id);
  if (!rec || !rec.repo) return { code: 404, body: { error: 'Engagement not found.' } };

  const path = `engagement/${id}/${file}`;
  const cur = await gh(`/repos/${rec.repo}/contents/${path}`);
  if (cur.status !== 200 || !cur.json?.content)
    return { code: 404, body: { error: `${DELIVERABLE_TITLES[file]} hasn't been generated yet.` } };
  const text = Buffer.from(cur.json.content, cur.json.encoding || 'base64').toString('utf8');

  const existing = signoff(text);
  if (existing)
    return { code: 409, body: { error: 'Already approved.', signedOffBy: existing.by, signedOffAt: existing.at } };

  const name = userDisplayName();
  const next = applySignoff(text, name, 'Designer / PM', today());
  if (!next) return { code: 409, body: { error: 'Already approved.' } };

  const put = await gh(`/repos/${rec.repo}/contents/${path}`, {
    method: 'PUT',
    body: {
      message: `Approve ${file} — web sign-off by ${name}`,
      content: Buffer.from(next, 'utf8').toString('base64'),
      sha: cur.json.sha,
    },
  });
  if (put.status !== 200 && put.status !== 201)
    return { code: 502, body: { error: 'Could not write the sign-off.', detail: put.json?.message } };

  const refreshed = await refreshRepoGates(rec.repo, id, { [file]: next }, put.json?.commit?.sha ?? null);
  return { code: 200, body: { ok: true, file, signedOffBy: name, signedOffAt: today(), gatesRefreshed: refreshed.ok } };
}

// ---- sources: let the designer add their own customer materials ----
// The engine reads from sources/ and engagement/<kebab>/ before it generates a
// Discover deliverable. These are the canonical slots the run-phase seed step
// fills with demo data — so a designer's real materials land where the engine
// already looks, and Generate (seed_demo=false) grounds the output in them.

// What the bucket accepts, in three handling groups (spec §7):
//   text    — read as-is, the engine cites it directly (.md/.txt/.vtt/.srt/.csv…)
//   convert — Office/PDF, converted to Markdown at ingest via Microsoft MarkItDown;
//             BOTH the extracted .md (the grounding source) and the raw original
//             (downloadable) are committed
//   image   — true non-text (photos/screenshots): no extractable words, held for
//             human reference only, NOT fed to the engine (reference tray is P4)
const CONVERT_EXTS = new Set(['.docx', '.pptx', '.xlsx', '.xls', '.pdf']);
const IMAGE_EXTS = new Set(['.png', '.jpg', '.jpeg', '.gif', '.webp', '.bmp', '.heic', '.tif', '.tiff']);
function formatGroup(filename) {
  const e = extname(filename || '').toLowerCase();
  if (CONVERT_EXTS.has(e)) return 'convert';
  if (IMAGE_EXTS.has(e)) return 'image';
  return 'text'; // .md/.txt/.vtt/.srt/.csv/.json/.log and pasted text
}

// Convert an Office/PDF document to LLM-ready Markdown with Microsoft MarkItDown.
// Runs as `python -m markitdown <tempfile>`; the host needs `pip install
// 'markitdown[...]'` once (override the interpreter with MARKITDOWN_PYTHON).
// Conversion is format-normalization plumbing — it does not touch the "engine is
// the single source of truth for deliverables" principle.
const MARKITDOWN_PY = process.env.MARKITDOWN_PYTHON || 'python';
async function convertToMarkdown(buffer, filename) {
  const tmp = join(tmpdir(), `vibe-mit-${randomUUID()}${extname(filename).toLowerCase()}`);
  await writeFile(tmp, buffer);
  try {
    const { stdout } = await execFileP(MARKITDOWN_PY, ['-m', 'markitdown', tmp], {
      maxBuffer: 48 * 1024 * 1024,
      windowsHide: true,
    });
    return stdout;
  } finally {
    try { await unlink(tmp); } catch { /* best effort */ }
  }
}

// Commit one file to an engagement repo (create or update) via the Contents API.
async function putRepoFile(repo, path, base64Content, message) {
  const cur = await gh(`/repos/${repo}/contents/${path}`);
  const body = { message, content: base64Content };
  if (cur.status === 200 && cur.json?.sha) body.sha = cur.json.sha;
  const put = await gh(`/repos/${repo}/contents/${path}`, { method: 'PUT', body });
  if (put.status !== 200 && put.status !== 201) return { ok: false, detail: put.json?.message };
  return { ok: true, updated: cur.status === 200 };
}

const SOURCE_KINDS = {
  'customer-brief': { label: 'Customer brief', single: true, path: (id) => `engagement/${id}/customer-brief.md` },
  'transcript': { label: 'Meeting transcript', single: false, path: (id, slug) => `sources/transcript-${slug}.md` },
  'questionnaire': { label: 'Questionnaire responses', single: true, path: () => 'sources/questionnaire-responses.md' },
  'research': { label: 'Research summary', single: true, path: () => 'sources/research/research-summary.md' },
  'other': { label: 'Other source', single: false, path: (id, slug) => `sources/${slug}.md` },
};

// The kind metadata the frontend needs to render the add-source form + labels.
function sourceKindMeta() {
  return Object.fromEntries(Object.entries(SOURCE_KINDS).map(([k, v]) => [k, { label: v.label, single: v.single }]));
}

// Map a committed repo path back to a source kind + display name, for listing.
function classifySource(id, path) {
  if (path === `engagement/${id}/customer-brief.md`) return { kind: 'customer-brief', name: 'Customer brief' };
  if (path === 'sources/questionnaire-responses.md') return { kind: 'questionnaire', name: 'Questionnaire responses' };
  if (path === 'sources/research/research-summary.md') return { kind: 'research', name: 'Research summary' };
  const t = path.match(/^sources\/transcript-(.+)\.md$/);
  if (t) return { kind: 'transcript', name: t[1].replace(/-/g, ' ') };
  const o = path.match(/^sources\/(.+)\.md$/);
  if (o && o[1] !== 'README') return { kind: 'other', name: o[1].replace(/-/g, ' ') };
  return null;
}

async function listRepoDir(fullName, dir) {
  const r = await gh(`/repos/${fullName}/contents/${dir}`);
  return r.status === 200 && Array.isArray(r.json) ? r.json.filter((e) => e.type === 'file') : [];
}

// The designer-added sources in an engagement repo (everything under sources/
// except the README placeholder, plus the customer brief). When a converted
// Office/PDF source has a raw original committed alongside it (same stem, a
// CONVERT_EXTS extension), that original is attached so the UI can offer it for
// download while the engine still cites the extracted .md.
async function listSources(rec) {
  const id = rec.id;
  const all = [];
  for (const f of await listRepoDir(rec.repo, 'sources')) all.push(f);
  for (const f of await listRepoDir(rec.repo, 'sources/research')) all.push(f);
  for (const f of await listRepoDir(rec.repo, `engagement/${id}`)) all.push(f);
  const rawByStem = new Map();
  for (const f of all) {
    const e = extname(f.path).toLowerCase();
    if (CONVERT_EXTS.has(e)) rawByStem.set(f.path.slice(0, -e.length), f);
  }
  const seen = new Set();
  const out = [];
  for (const f of all) {
    if (f.name === 'README.md') continue;
    const c = classifySource(id, f.path);
    if (!c || seen.has(f.path)) continue;
    seen.add(f.path);
    const entry = { ...c, path: f.path, size: f.size, htmlUrl: f.html_url };
    const raw = rawByStem.get(f.path.replace(/\.md$/, ''));
    if (raw) entry.original = { name: raw.name, path: raw.path, htmlUrl: raw.html_url, ext: extname(raw.path).slice(1) };
    out.push(entry);
  }
  return out;
}

async function addSource(input) {
  const id = String(input.kebab || '').trim();
  const kind = String(input.kind || '').trim();
  const name = String(input.name || '').trim();
  const filename = String(input.filename || '').trim();
  if (!id) return { code: 400, body: { error: 'Engagement is required.' } };
  const spec = SOURCE_KINDS[kind];
  if (!spec) return { code: 400, body: { error: `Unknown source type "${kind}".` } };
  if (!spec.single && !name) return { code: 400, body: { error: `A name is required for a ${spec.label.toLowerCase()}.` } };
  const rec = (await readStore()).find((r) => (r.id || '') === id);
  if (!rec || !rec.repo) return { code: 404, body: { error: 'Engagement not found.' } };

  // Resolve the grounding text + (for converted uploads) the raw original.
  let content = '';
  let raw = null; // { buffer, ext }
  let original = null; // original filename, for honest receipts
  if (input.dataBase64) {
    const buffer = Buffer.from(String(input.dataBase64), 'base64');
    if (!buffer.length) return { code: 400, body: { error: 'The uploaded file was empty.' } };
    if (buffer.length > 25 * 1024 * 1024)
      return { code: 413, body: { error: 'That file is larger than 25 MB. Trim it or paste the relevant text.' } };
    const group = formatGroup(filename);
    if (group === 'image')
      return { code: 415, body: { error: 'Images are held for reference only and aren’t fed to the engine yet (a later release adds an image tray). Drop a document (.docx, .pptx, .xlsx, .pdf) or text instead.' } };
    if (group === 'convert') {
      try { content = await convertToMarkdown(buffer, filename); }
      catch (e) {
        return { code: 501, body: {
          error: `Couldn’t convert ${filename || 'that file'}. The MarkItDown converter isn’t available on the server — install it with: pip install "markitdown[docx,pptx,xlsx,pdf]"`,
          detail: String(e?.message || e),
        } };
      }
      raw = { buffer, ext: extname(filename).toLowerCase() };
      original = filename;
    } else {
      content = buffer.toString('utf8');
    }
  } else {
    content = typeof input.content === 'string' ? input.content : '';
  }
  if (!content.trim()) return { code: 400, body: { error: 'Source content is empty.' } };

  const slug = spec.single ? null : kebab(name);
  if (!spec.single && !slug) return { code: 400, body: { error: 'Could not derive a filename from that name.' } };
  const path = spec.path(id, slug);
  const inScope = (p) => !p.includes('..') && (p.startsWith('sources/') || p.startsWith(`engagement/${id}/`));
  if (!inScope(path)) return { code: 400, body: { error: 'Invalid source path.' } };

  // Commit the raw original first (so the extracted .md never points at a missing
  // download), then the grounding markdown the engine reads and cites.
  if (raw) {
    const rawPath = path.replace(/\.md$/, raw.ext);
    if (!inScope(rawPath)) return { code: 400, body: { error: 'Invalid source path.' } };
    const r = await putRepoFile(rec.repo, rawPath, raw.buffer.toString('base64'),
      `Add source original: ${original} — via VIBE web surface`);
    if (!r.ok) return { code: 502, body: { error: 'Could not save the original file.', detail: r.detail } };
  }
  const label = original || name;
  const msg = `Add source: ${spec.label}${label ? ` (${label})` : ''}${raw ? ' — converted to Markdown' : ''} — via VIBE web surface`;
  const put = await putRepoFile(rec.repo, path, Buffer.from(content, 'utf8').toString('base64'), msg);
  if (!put.ok) return { code: 502, body: { error: 'Could not save the source.', detail: put.detail } };

  // Mark the engagement as source-backed so Generate stops seeding Contoso.
  try {
    const store = await readStore();
    const r = store.find((x) => (x.id || '') === id);
    if (r && !r.sourcesAdded) { r.sourcesAdded = true; await writeStore(store); }
  } catch { /* non-fatal: the frontend also passes seedDemo explicitly */ }

  return { code: 200, body: { ok: true, path, kind, name: name || spec.label, original, converted: !!raw, updated: put.updated } };
}

// ---- tiny static + JSON server ----
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css' };

function send(res, code, data, headers = {}) {
  const body = typeof data === 'string' || Buffer.isBuffer(data) ? data : JSON.stringify(data);
  res.writeHead(code, { 'Content-Type': 'application/json', ...headers });
  res.end(body);
}

async function serveStatic(res, urlPath) {
  const rel = urlPath === '/' ? 'index.html' : urlPath.replace(/^\/+/, '');
  const file = join(PUBLIC, rel);
  if (!file.startsWith(PUBLIC) || !existsSync(file)) return send(res, 404, 'Not found', {});
  const body = await readFile(file);
  send(res, 200, body, { 'Content-Type': MIME[extname(file)] || 'application/octet-stream' });
}

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://localhost:${PORT}`);
    if (req.method === 'GET' && url.pathname === '/api/config')
      return send(res, 200, { template: `${TEMPLATE_OWNER}/${TEMPLATE_REPO}`, defaultOwner: login() });

    if (req.method === 'GET' && url.pathname === '/api/engagements')
      return send(res, 200, await readStore());

    if (req.method === 'POST' && url.pathname === '/api/engagements') {
      let raw = '';
      for await (const chunk of req) raw += chunk;
      const input = raw ? JSON.parse(raw) : {};
      const { code, body } = await createEngagement(input);
      return send(res, code, body);
    }

    if (req.method === 'GET' && url.pathname === '/api/board')
      return send(res, 200, url.searchParams.get('source') === 'local'
        ? await boardSummaryLocal() : await boardSummary());

    const detail = url.pathname.match(/^\/api\/board\/([A-Za-z0-9][A-Za-z0-9-]*)$/);
    if (req.method === 'GET' && detail) {
      const data = url.searchParams.get('source') === 'local'
        ? await boardDetailLocal(detail[1]) : await boardDetail(detail[1]);
      return data ? send(res, 200, data) : send(res, 404, { error: 'Engagement not found' });
    }

    if (req.method === 'POST' && url.pathname === '/api/run') {
      let raw = '';
      for await (const chunk of req) raw += chunk;
      const input = raw ? JSON.parse(raw) : {};
      const { code, body } = await runPhase(input);
      return send(res, code, body);
    }

    if (req.method === 'GET' && url.pathname === '/api/run/status')
      return send(res, 200, (await runStatus(url.searchParams.get('kebab'))) || {});

    if (req.method === 'POST' && url.pathname === '/api/approve') {
      let raw = '';
      for await (const chunk of req) raw += chunk;
      const input = raw ? JSON.parse(raw) : {};
      const { code, body } = await approveDeliverable(input);
      return send(res, code, body);
    }

    if (req.method === 'GET' && url.pathname === '/api/sources') {
      const id = url.searchParams.get('kebab');
      const rec = (await readStore()).find((r) => (r.id || '') === id);
      if (!rec || !rec.repo) return send(res, 404, { error: 'Engagement not found' });
      return send(res, 200, { sources: await listSources(rec), kinds: sourceKindMeta() });
    }

    // Fetch one source/deliverable file's raw text for the in-app viewer. Path is
    // confined to the engagement's sources/ tree or its own engagement/<id>/ folder.
    if (req.method === 'GET' && url.pathname === '/api/source') {
      const id = url.searchParams.get('kebab');
      const path = url.searchParams.get('path') || '';
      const rec = (await readStore()).find((r) => (r.id || '') === id);
      if (!rec || !rec.repo) return send(res, 404, { error: 'Engagement not found' });
      if (path.includes('..') || !(path.startsWith('sources/') || path.startsWith(`engagement/${id}/`)))
        return send(res, 400, { error: 'Invalid source path.' });
      const text = await fetchRepoFile(rec.repo, path);
      return text == null ? send(res, 404, { error: 'Source not found' }) : send(res, 200, { path, text });
    }

    if (req.method === 'POST' && url.pathname === '/api/sources') {
      let raw = '';
      for await (const chunk of req) raw += chunk;
      const input = raw ? JSON.parse(raw) : {};
      const { code, body } = await addSource(input);
      return send(res, code, body);
    }

    if (req.method === 'GET') return serveStatic(res, url.pathname);
    return send(res, 405, { error: 'Method not allowed' });
  } catch (err) {
    return send(res, 500, { error: String(err?.message || err) });
  }
});

server.listen(PORT, async () => {
  await mkdir(PUBLIC, { recursive: true });
  console.log(`\n  VIBE Web Surface — provisioning`);
  console.log(`  template : ${TEMPLATE_OWNER}/${TEMPLATE_REPO}`);
  try { console.log(`  as user  : ${login()}`); } catch { console.log('  as user  : (gh not authenticated!)'); }
  console.log(`  open     : http://localhost:${PORT}\n`);
});
