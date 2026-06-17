// VIBE Web Surface — minimal provisioning backend (MVP M4 slice).
// Zero npm dependencies: Node built-ins only. Auth piggybacks on the GitHub CLI
// (`gh auth token`), so it runs as the signed-in employee — the run-as-user model.
//
//   node surface/server.mjs   →   http://localhost:4310
//
// Endpoints:
//   GET  /api/config        -> template + default owner
//   GET  /api/engagements   -> the local pointer store (engagement -> repo)
//   POST /api/engagements   -> create a repo from the template, verify the engine
//                              shipped, record the pointer, return the repo.

import { createServer } from 'node:http';
import { execSync } from 'node:child_process';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, extname } from 'node:path';

const __dir = dirname(fileURLToPath(import.meta.url));
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
