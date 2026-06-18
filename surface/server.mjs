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
//   GET  /api/run/status?kebab -> latest engine run status for the engagement

import { createServer } from 'node:http';
import { execSync } from 'node:child_process';
import { readFile, writeFile, mkdir, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, extname } from 'node:path';
import { computeGates, GATES } from '../scripts/gates-lib.mjs';

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
  return { kebab, gates: g.gates, handoffReady: g.handoffReady, commitSha: g.commitSha, deliverables };
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
  };
}

// ---- run a phase from the web (dispatch the engine workflow) ----
// Each generatable deliverable maps to the VIBE prompt that produces it. Clicking
// "Generate" dispatches run-phase.yml in the engagement's OWN repo; the engine
// writes the deliverable + gates.json back, and the board re-reads it. Scoped to
// the Discover deliverables — the Disrupt ones need workshop sources seed_demo
// doesn't provide.
const FILE_PROMPT = {
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
  try {
    execSync(
      `gh workflow run run-phase.yml --repo ${rec.repo} -f prompt=${prompt} -f engagement=${kebab} -f seed_demo=true`,
      { stdio: 'pipe' },
    );
  } catch (e) {
    return { code: 502, body: { error: 'Could not dispatch the run.', detail: String(e.stderr || e.message || e).trim() } };
  }
  return { code: 202, body: { ok: true, repo: rec.repo, prompt, engagement: kebab } };
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
