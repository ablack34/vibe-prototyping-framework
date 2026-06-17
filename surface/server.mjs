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
//   GET  /api/board            -> local engagements with live gate state (dashboard)
//   GET  /api/board/<kebab>    -> one engagement: gates + rendered deliverables

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

  const record = {
    id: kebab(displayName),
    name: displayName,
    repo: repo.full_name,
    htmlUrl: repo.html_url,
    private: repo.private,
    enginePresent,
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

async function boardSummary() {
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

async function boardDetail(kebab) {
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
      return send(res, 200, await boardSummary());

    const detail = url.pathname.match(/^\/api\/board\/([A-Za-z0-9][A-Za-z0-9-]*)$/);
    if (req.method === 'GET' && detail) {
      const data = await boardDetail(detail[1]);
      return data ? send(res, 200, data) : send(res, 404, { error: 'Engagement not found' });
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
