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
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, extname } from 'node:path';
import { tmpdir } from 'node:os';
import { randomUUID, randomBytes } from 'node:crypto';
import { promisify } from 'node:util';
import { AsyncLocalStorage } from 'node:async_hooks';
import { computeGates, computeGatesFromContents, extractProvenance, GATES, signoff, lowestGrade } from '../scripts/gates-lib.mjs';
import { tidyRepo } from './tidy-repo.mjs';
const execFileP = promisify(execFile);

const __dir = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dir, '..');
const ENGAGE_ROOT = join(REPO_ROOT, 'engagement');
const PORT = process.env.PORT || 4310;
const TEMPLATE_OWNER = process.env.TEMPLATE_OWNER || 'ablack34';
const TEMPLATE_REPO = process.env.TEMPLATE_REPO || 'vibe-prototyping-framework';
const STORE = process.env.STORE || join(__dir, '.engagements.json');
const PUBLIC = join(__dir, 'public');

// ─── Identity model ──────────────────────────────────────────────────────────
// The surface has TWO GitHub identities:
//   • Service — the surface's own account (GH_TOKEN in the container, or the local
//     `gh auth` login). It owns ONLY the shared, private engagement-pointer store.
//     It is NEVER used to touch a designer's engagement, so nothing a designer does
//     can ever land on it.
//   • Per-user — the signed-in designer's OAuth token, carried implicitly through the
//     async call tree (AsyncLocalStorage) so every gh() / gh-CLI call acts as THEM.
//     This is what makes a designer's engagement land in the designer's OWN account
//     and run on the designer's OWN Copilot seat.
// When OAuth isn't configured the surface runs in legacy single-user mode: the
// service identity is also the acting identity, exactly as before (local dev / MVP).
const OAUTH = !!(process.env.OAUTH_CLIENT_ID && process.env.OAUTH_CLIENT_SECRET);

let cachedServiceToken = null;
function serviceToken() {
  if (process.env.GH_TOKEN) return process.env.GH_TOKEN;
  if (!cachedServiceToken) cachedServiceToken = execSync('gh auth token', { encoding: 'utf8' }).trim();
  return cachedServiceToken;
}
let cachedServiceLogin = null;
function serviceLogin() {
  if (!cachedServiceLogin) {
    try { cachedServiceLogin = execSync('gh api user --jq .login', { encoding: 'utf8', env: { ...process.env, GH_TOKEN: serviceToken() } }).trim(); }
    catch { cachedServiceLogin = ''; }
  }
  return cachedServiceLogin;
}

// The signed-in designer for the current request (null outside a request, or in
// legacy mode). Set by the request handler via authCtx.run().
const authCtx = new AsyncLocalStorage();
const currentUser = () => authCtx.getStore() || null;
// Acting identity = signed-in designer when in a request, else the service account.
const actingToken = () => currentUser()?.token || serviceToken();
const actingLogin = () => currentUser()?.login || serviceLogin();
// Env for `gh` CLI shell-outs, so they act as the acting identity (GH_TOKEN
// overrides any stored auth in the container/host).
const ghEnv = (tok = actingToken()) => ({ ...process.env, GH_TOKEN: tok });

async function gh(path, { method = 'GET', body, service = false } = {}) {
  const res = await fetch(`https://api.github.com${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${service ? serviceToken() : actingToken()}`,
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

// Optional git-backed store: when STORE_REPO ("owner/repo") is set, the engagement
// pointer list lives as committed JSON in a small private GitHub repo instead of the
// local /data file. This survives container restarts/redeploys — essential on hosts
// where a durable Azure Files mount is blocked by policy and /data is ephemeral
// (the engagement repos themselves are already the durable source of truth; only this
// pointer list needs somewhere to live). Falls back to the local file when unset.
const STORE_REPO = process.env.STORE_REPO || '';
const STORE_PATH = process.env.STORE_PATH || 'engagements.json';
const storeContentsPath = STORE_PATH.split('/').filter(Boolean).map(encodeURIComponent).join('/');
// Last-seen blob sha, threaded read→write for the Contents API. Single replica + the
// read-before-write pattern in every handler keeps this fresh; the 409/422 retry below
// covers a stale sha. (High write concurrency could still lose an update, but designers
// act sequentially and writes are rare — acceptable for the pilot.)
let storeSha = null;

async function readStoreGit() {
  const { status, json } = await gh(`/repos/${STORE_REPO}/contents/${storeContentsPath}`, { service: true });
  if (status === 404) { storeSha = null; return []; }
  if (status >= 300 || !json) throw new Error(`store read failed (${status})`);
  storeSha = json.sha || null;
  try {
    const text = Buffer.from(json.content || '', json.encoding || 'base64').toString('utf8');
    const data = JSON.parse(text);
    return Array.isArray(data) ? data : [];
  } catch { return []; }
}

async function writeStoreGit(list) {
  const content = Buffer.from(JSON.stringify(list, null, 2), 'utf8').toString('base64');
  for (let attempt = 0; attempt < 2; attempt += 1) {
    const body = { message: 'surface: update engagement store', content };
    if (storeSha) body.sha = storeSha;
    const { status, json } = await gh(`/repos/${STORE_REPO}/contents/${storeContentsPath}`, { method: 'PUT', body, service: true });
    if (status < 300) { storeSha = (json && json.content && json.content.sha) || null; return; }
    if ((status === 409 || status === 422) && attempt === 0) {
      const cur = await gh(`/repos/${STORE_REPO}/contents/${storeContentsPath}`, { service: true });
      storeSha = (cur.status === 200 && cur.json) ? (cur.json.sha || null) : null;
      continue;
    }
    throw new Error(`store write failed (${status})`);
  }
}

async function readStore() {
  if (STORE_REPO) return readStoreGit();
  if (!existsSync(STORE)) return [];
  try { return JSON.parse(await readFile(STORE, 'utf8')); } catch { return []; }
}
async function writeStore(list) {
  if (STORE_REPO) return writeStoreGit(list);
  await mkdir(dirname(STORE), { recursive: true });
  await writeFile(STORE, JSON.stringify(list, null, 2));
}

// ─── Per-user isolation ──────────────────────────────────────────────────────
// The store holds EVERY designer's engagement pointers in one shared list, but a
// designer must only ever see (and act on) their own. In legacy single-user mode
// (OAuth off) there is only one identity, so everything is "owned". In multi-user
// mode an engagement is owned by the signed-in designer whose login matches its
// createdBy (GitHub logins are case-insensitive). Cross-user lookups return null,
// so another designer's id resolves to a 404 — never a data leak.
function owns(rec) {
  if (!OAUTH) return true;
  const me = actingLogin();
  return !!me && String(rec.createdBy || '').toLowerCase() === me.toLowerCase();
}
const mine = (list) => list.filter(owns);
async function visibleStore() { return mine(await readStore()); }
async function findRec(id) {
  const rec = (await readStore()).find((r) => (r.id || '') === id);
  return rec && owns(rec) ? rec : null;
}

// Curated set of engine models the facilitator can pick from in the web surface.
// id '' means "don't pass --model" → the Copilot CLI default (Claude Sonnet 4.5).
// The chosen id is passed to run-phase.yml as `-f model=<id>`, which the workflow
// turns into `copilot --model <id>`. Keep ids in step with the Copilot CLI's
// supported models; unknown ids are rejected server-side before dispatch.
const ENGINE_MODELS = [
  { id: '', label: 'Default (Claude Sonnet 4.5)' },
  { id: 'claude-haiku-4.5', label: 'Claude Haiku 4.5 — faster, lighter' },
  { id: 'claude-opus-4.5', label: 'Claude Opus 4.5 — deeper reasoning' },
  { id: 'gpt-5.1', label: 'GPT-5.1' },
  { id: 'gpt-5', label: 'GPT-5' },
  { id: 'gemini-3-pro-preview', label: 'Gemini 3 Pro (preview)' },
];
const isKnownModel = (id) => ENGINE_MODELS.some((m) => m.id === id);

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

// Mirror the acting designer's token into the new repo as the engine secret.
// gh reads the value from STDIN when --body is omitted, so it never hits argv.
function setRepoSecret(fullName, name, value) {
  execSync(`gh secret set ${name} --repo ${fullName}`, { input: value, env: ghEnv(), stdio: ['pipe', 'pipe', 'pipe'] });
}

// Best-effort: is Actions enabled on the repo? null if we couldn't tell.
function actionsEnabled(fullName) {
  try {
    return execSync(`gh api /repos/${fullName}/actions/permissions --jq .enabled`, { encoding: 'utf8', env: ghEnv() }).trim() === 'true';
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

  // In multi-user mode every engagement is created in the signed-in designer's OWN
  // account using THEIR token — never under another user (which GitHub rejects, the
  // original foot-gun). In legacy single-user mode we keep honouring an explicit
  // owner (e.g. an org the operator can push to), defaulting to the service account.
  const owner = OAUTH ? actingLogin() : (String(input.owner || '').trim() || actingLogin());
  if (!/^[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?$/.test(owner))
    return { code: 400, body: { error: OAUTH ? `Could not determine your GitHub account ("${owner}").` : `Invalid owner "${owner}".` } };

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
    if (/cannot create a repository/i.test(raw) || gen.status === 403) {
      return {
        code: 403,
        body: {
          error: `Couldn’t create the engagement under "${owner}".`,
          detail: `Your GitHub account needs permission to create a repository there, and your sign-in must grant the "repo" scope. (${raw})`,
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
      token: actingToken(),
      defaultBranch: repo.default_branch || 'main',
      keepEngagement: kebab(displayName),
    });
    tidied = !!t.ok;
  } catch { tidied = false; }

  // The engine (run-phase.yml) runs the Copilot CLI as whoever owns this token, so
  // mirror the acting designer's own token in as the repo secret — the engine then
  // runs on THEIR Copilot seat, in THEIR repo, with no further setup.
  let secretSet = false;
  try { setRepoSecret(repo.full_name, 'COPILOT_GITHUB_TOKEN', actingToken()); secretSet = true; }
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
    createdBy: actingLogin(),
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

// ---- Disrupt: the Week-2 workshop flow -------------------------------------
// Disrupt has a real workshop in the middle: pre-workshop artifacts the engine
// drafts, an offline workshop the designer captures into sources/workshop/, then a
// strict post-workshop chain. Only selected-concept / future-state-journey /
// storyboard are gated (GATES.disrupt). The four supporting artifacts below aren't
// gated, so the engine's gate logic doesn't track them — we grade them inline with
// the SAME lowestGrade/signoff helpers so the two can't drift, and surface them as
// cards so the whole phase is drivable from the web, in order.
const DISRUPT_SUPPORT_TITLES = {
  'workshop-agenda.md': 'Workshop agenda',
  'ideation-concepts.md': 'Ideation concepts',
  'spark-prompts.md': 'Spark prompts',
  'workshop-record.md': 'Workshop record',
};
// Per-artifact Disrupt metadata: stage, whether it's gated, whether the web can
// generate it, whether it carries a "## Sign-off" table, and what must exist before
// it can be generated. `requires` tokens:
//   discoverPass    — the 3 Discover deliverables are all Grade B+
//   discoverSigned  — …and all signed off (the agenda's hard gate)
//   workshopCapture — at least one file under sources/workshop/
//   <file.md>       — that deliverable is present
const DISRUPT_META = {
  'workshop-agenda.md':      { stage: 'pre',  gated: false, generatable: true,  signoff: true,  graded: true,  requires: ['discoverSigned'] },
  'ideation-concepts.md':    { stage: 'pre',  gated: false, generatable: true,  signoff: false, graded: true,  requires: ['discoverPass'], alsoProduces: 'spark-prompts.md' },
  'spark-prompts.md':        { stage: 'pre',  gated: false, generatable: false, signoff: false, graded: false, pasteOut: true,  requires: ['ideation-concepts.md'] },
  'workshop-record.md':      { stage: 'post', gated: false, generatable: true,  signoff: true,  graded: false, requires: ['workshopCapture'] },
  'selected-concept.md':     { stage: 'post', gated: true,  generatable: true,  signoff: true,  graded: true,  requires: ['workshop-record.md'] },
  'future-state-journey.md': { stage: 'post', gated: true,  generatable: true,  signoff: true,  graded: true,  requires: ['selected-concept.md', 'current-state-journey.md'] },
  'storyboard.md':           { stage: 'post', gated: true,  generatable: true,  signoff: true,  graded: true,  requires: ['selected-concept.md'] },
};

function disruptLabel(file) {
  return DISRUPT_SUPPORT_TITLES[file] || DELIVERABLE_TITLES[file] || file;
}

// Card for a non-gated support artifact, graded inline from its markdown.
function evalSupport(file, text) {
  const present = text != null;
  const grade = present ? lowestGrade(text) : null;
  const so = present ? signoff(text) : null;
  return {
    file,
    title: disruptLabel(file),
    gate: 'disrupt',
    present,
    grade,
    gradePass: grade === 'A' || grade === 'B',
    signedOffBy: so?.by ?? null,
    signedOffAt: so?.at ?? null,
    stale: false,
    markdown: present ? text : undefined,
  };
}

function disruptReadiness(meta, ctx) {
  const reasons = [];
  for (const req of meta.requires || []) {
    if (req === 'discoverPass') { if (!ctx.discoverPass) reasons.push('generate the three Discover deliverables to Grade B+ first'); }
    else if (req === 'discoverSigned') { if (!ctx.discoverSigned) reasons.push('approve the three Discover deliverables first (the agenda needs a signed-off baseline)'); }
    else if (req === 'workshopCapture') { if (!ctx.workshopCount) reasons.push('add at least one workshop capture below first'); }
    else if (req.endsWith('.md')) { if (!ctx.present.has(req)) reasons.push(`generate ${disruptLabel(req)} first`); }
  }
  return { ready: reasons.length === 0, blockedReason: reasons.join(' · ') };
}

// Fetch + grade the four support artifacts, add them as cards, then tag every
// Disrupt card (support + the three gated ones already in `deliverables`) with its
// stage + ordering/readiness so the UI can present the workshop flow in order.
async function assembleDisrupt(deliverables, fetchFile, workshopCount) {
  for (const file of Object.keys(DISRUPT_SUPPORT_TITLES)) {
    deliverables.push(evalSupport(file, await fetchFile(file)));
  }
  const present = new Set(deliverables.filter((d) => d.present).map((d) => d.file));
  const discover = deliverables.filter((d) => d.gate === 'discover');
  const discoverPass = discover.length === 3 && discover.every((d) => d.gradePass);
  const discoverSigned = discover.length === 3 && discover.every((d) => d.signedOffBy);
  const ctx = { present, discoverPass, discoverSigned, workshopCount };
  for (const d of deliverables) {
    const meta = DISRUPT_META[d.file];
    if (!meta) continue;
    d.stage = meta.stage;
    d.gated = meta.gated;
    d.generatable = meta.generatable;
    d.signoffRequired = meta.signoff;
    d.graded = meta.graded !== false;
    if (meta.pasteOut) d.pasteOut = true;
    if (meta.alsoProduces) d.alsoProduces = meta.alsoProduces;
    d.signoffCapable = !!(d.markdown && /##\s*Sign-?off/i.test(d.markdown));
    const { ready, blockedReason } = disruptReadiness(meta, ctx);
    d.ready = ready;
    d.blockedReason = blockedReason;
  }
}

// ---- Preparation: Week-0 setup (the two briefs + research + schedule) ----------
// Preparation has no gates.json gate, so its artifacts are ungraded: the web reads
// the committed files only (state.json grades are per-user + gitignored), so we
// surface them as present/absent cards and compute the phase's readiness — both
// briefs present — server-side, mirroring /vibe-prep-check (the briefs are critical;
// research + schedule are recommended, not blocking). Unlike Discover/Disrupt
// deliverables they live at mixed paths — the briefs under engagement/<kebab>/,
// research under sources/research/, the schedule at sources/meeting-templates.md — so
// each card carries its own repo path. The dual-path research reuses the proven
// paste-out (Spark) + paste-back (workshop bucket) mechanics: vibe-research writes
// customer-public.md + the M365 Researcher prompt; the designer runs that prompt in
// M365 Copilot and pastes the result back as a source; re-running synthesises
// research-summary.md once both inputs exist.
const PREP_TITLES = {
  'engagement-brief.md': 'Engagement brief',
  'customer-brief.md': 'Customer brief',
  'customer-public.md': 'Public web research',
  'm365-researcher-prompt.md': 'M365 Researcher prompt',
  'research-summary.md': 'Research synthesis',
  'meeting-templates.md': 'Meeting schedule',
};
// Per-artifact Preparation metadata: repo path, UI group, whether it's one of the two
// gating briefs, whether the web can generate it, plus the paste-out flag and ordering
// preconditions. `requires` tokens:
//   <file>.md    — that artifact is present
//   m365Results  — at least one M365 Researcher result has been pasted back
const PREP_META = {
  'engagement-brief.md':       { path: (k) => `engagement/${k}/engagement-brief.md`, group: 'brief',    gate: true,  generatable: true,  requires: [] },
  'customer-brief.md':         { path: (k) => `engagement/${k}/customer-brief.md`,   group: 'brief',    gate: true,  generatable: true,  requires: [] },
  'customer-public.md':        { path: () => 'sources/research/customer-public.md',  group: 'research', gate: false, generatable: true,  requires: [], alsoProduces: 'm365-researcher-prompt.md' },
  'm365-researcher-prompt.md': { path: () => 'sources/research/m365-researcher-prompt.md', group: 'research', gate: false, generatable: false, pasteOut: true, requires: ['customer-public.md'] },
  'research-summary.md':       { path: () => 'sources/research/research-summary.md', group: 'research', gate: false, generatable: true,  requires: ['customer-public.md', 'm365Results'] },
  'meeting-templates.md':      { path: () => 'sources/meeting-templates.md',         group: 'schedule', gate: false, generatable: true,  requires: [] },
};

function prepLabel(file) { return PREP_TITLES[file] || file; }

// Preparation card, judged by presence + sign-off only (the briefs grade into
// state.json, not the document, so there's no in-doc grade to read — keep it honest
// and surface presence, not a grade pill).
function evalPrep(file, text) {
  const present = text != null;
  const so = present ? signoff(text) : null;
  return {
    file,
    title: prepLabel(file),
    gate: 'preparation',
    present,
    grade: null,
    gradePass: false,
    graded: false,
    signedOffBy: so?.by ?? null,
    signedOffAt: so?.at ?? null,
    stale: false,
    markdown: present ? text : undefined,
  };
}

function prepReadiness(meta, ctx) {
  const reasons = [];
  for (const req of meta.requires || []) {
    if (req === 'm365Results') { if (!ctx.m365Count) reasons.push('paste back the M365 Researcher results first'); }
    else if (req.endsWith('.md')) { if (!ctx.present.has(req)) reasons.push(`generate ${prepLabel(req)} first`); }
  }
  return { ready: reasons.length === 0, blockedReason: reasons.join(' · ') };
}

// The Preparation gate mirrors /vibe-prep-check: the two briefs are the critical
// (gating) artifacts; research + schedule are recommended, not blocking.
function computePrepGate(cards) {
  const eb = cards.find((c) => c.file === 'engagement-brief.md');
  const cb = cards.find((c) => c.file === 'customer-brief.md');
  const have = (eb?.present ? 1 : 0) + (cb?.present ? 1 : 0);
  return {
    status: have === 2 ? 'ready' : have === 1 ? 'partial' : 'empty',
    engagementBrief: !!eb?.present,
    customerBrief: !!cb?.present,
  };
}

// Fetch the six Preparation artifacts, push them as cards onto `deliverables`, tag
// each with its group + ordering/readiness, and return the phase gate. `fetchAt`
// resolves a repo-relative path to its text (or null). `m365Count` is how many M365
// Researcher results have been pasted back (gates the synthesis step).
async function assemblePrep(deliverables, fetchAt, kebab, m365Count) {
  const cards = [];
  for (const file of Object.keys(PREP_TITLES)) {
    cards.push(evalPrep(file, await fetchAt(PREP_META[file].path(kebab))));
  }
  const present = new Set(cards.filter((c) => c.present).map((c) => c.file));
  const ctx = { present, m365Count: m365Count || 0 };
  for (const c of cards) {
    const meta = PREP_META[c.file];
    c.group = meta.group;
    c.gateCritical = !!meta.gate;
    c.generatable = !!meta.generatable;
    c.graded = false;
    if (meta.pasteOut) c.pasteOut = true;
    if (meta.alsoProduces) c.alsoProduces = meta.alsoProduces;
    c.signoffCapable = !!(c.markdown && /##\s*Sign-?off/i.test(c.markdown));
    const { ready, blockedReason } = prepReadiness(meta, ctx);
    c.ready = ready;
    c.blockedReason = blockedReason;
    deliverables.push(c);
  }
  return computePrepGate(cards);
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
  const store = await visibleStore();
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
  let workshopSources = [];
  try {
    const ents = await readdir(join(dir, '..', '..', 'sources', 'workshop'), { withFileTypes: true });
    workshopSources = ents.filter((e) => e.isFile() && e.name !== 'README.md')
      .map((e) => ({ kind: 'workshop', name: e.name.replace(/\.[^.]+$/, '').replace(/-/g, ' '), path: `sources/workshop/${e.name}` }));
  } catch { /* none captured yet */ }
  const localFetch = async (f) => { try { return await readFile(join(dir, f), 'utf8'); } catch { return null; } };
  await assembleDisrupt(deliverables, localFetch, workshopSources.length);
  // Preparation artifacts live at mixed repo paths (briefs in engagement/, research +
  // schedule under sources/), so fetch repo-relative from the repo root.
  const repoFetch = async (p) => { try { return await readFile(join(REPO_ROOT, p), 'utf8'); } catch { return null; } };
  let researchResults = [];
  try {
    const rents = await readdir(join(REPO_ROOT, 'sources', 'research'), { withFileTypes: true });
    researchResults = rents.filter((e) => e.isFile() && /m365-researcher-results/i.test(e.name))
      .map((e) => ({ kind: 'm365-results', name: e.name.replace(/\.[^.]+$/, '').replace(/-/g, ' '), path: `sources/research/${e.name}` }));
  } catch { /* none pasted back yet */ }
  const prepGate = await assemblePrep(deliverables, repoFetch, kebab, researchResults.length);
  const bySource = attachDeliverableProvenance(deliverables, [...workshopSources, ...researchResults].map((s) => s.path));
  const context = { present: existsSync(join(dir, 'PROJECT-CONTEXT.md')), path: `engagement/${kebab}/PROJECT-CONTEXT.md`, ...genMetaFor('PROJECT-CONTEXT.md') };
  attachGenMeta(deliverables);
  return { kebab, gates: g.gates, handoffReady: g.handoffReady, commitSha: g.commitSha, deliverables, context, disrupt: { gate: g.gates.disrupt, workshopSources }, preparation: { gate: prepGate, researchResults }, mockData: { files: await listMockDataLocal() }, provenance: { bySource }, model: '', models: ENGINE_MODELS };
}

// Primary detail: gate state + rendered deliverables read from the engagement's
// own repo via the Contents API.
async function boardDetail(kebab) {
  const rec = await findRec(kebab);
  if (!rec || !rec.repo) return null;
  const g = (await repoGates(rec.repo, kebab)) || emptyGates();
  const deliverables = deliverablesFrom(g);
  for (const d of deliverables) {
    if (d.present) d.markdown = (await fetchRepoFile(rec.repo, `engagement/${kebab}/${d.file}`)) || '';
  }
  // Sources split: workshop captures (sources/workshop/) drive the Disrupt phase,
  // not Discover, so they show in the Disrupt section — keep them out of the main
  // Sources bucket but still pass their paths to provenance so workshop-record's
  // citations resolve.
  const allSources = await listSources(rec);
  const sources = allSources.filter((s) => s.kind !== 'workshop' && s.kind !== 'm365-results');
  const workshopSources = allSources.filter((s) => s.kind === 'workshop');
  const researchResults = allSources.filter((s) => s.kind === 'm365-results');
  await assembleDisrupt(deliverables,
    (f) => fetchRepoFile(rec.repo, `engagement/${kebab}/${f}`), workshopSources.length);
  // Preparation artifacts span engagement/ + sources/, so fetch repo-relative.
  const prepGate = await assemblePrep(deliverables,
    (p) => fetchRepoFile(rec.repo, p), kebab, researchResults.length);
  const bySource = attachDeliverableProvenance(deliverables, allSources.map((s) => s.path));
  for (const s of allSources) {
    const e = bySource[s.path] || { usedBy: [], citationCount: 0 };
    s.usedBy = e.usedBy;
    s.citationCount = e.citationCount;
  }
  // PROJECT-CONTEXT.md is the single source of truth the Discover deliverables
  // ground in. It isn't a graded gate, so surface its presence separately so the
  // designer can synthesize it (from sources) before generating deliverables.
  const ctxPath = `engagement/${kebab}/PROJECT-CONTEXT.md`;
  const context = { present: (await fetchRepoFile(rec.repo, ctxPath)) != null, path: ctxPath, ...genMetaFor('PROJECT-CONTEXT.md') };
  attachGenMeta(deliverables);
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
    disrupt: { gate: g.gates.disrupt, workshopSources },
    preparation: { gate: prepGate, researchResults },
    mockData: { files: await listMockData(rec) },
    provenance: { bySource },
    model: rec.model || '',
    models: ENGINE_MODELS,
  };
}

// ---- run a phase from the web (dispatch the engine workflow) ----
// Each generatable deliverable maps to the VIBE prompt that produces it. Clicking
// "Generate" dispatches run-phase.yml in the engagement's OWN repo; the engine
// writes the deliverable + gates.json back, and the board re-reads it.
const FILE_PROMPT = {
  // Preparation (Week-0). The two briefs ground in sources/ + each other; research and
  // schedule ground in the briefs + PROJECT-CONTEXT. None ever re-seed Tailwind
  // (PREP_PROMPTS forces seed_demo=false). customer-public.md and research-summary.md
  // both dispatch the one idempotent vibe-research prompt: it writes the public brief +
  // the M365 paste-out prompt first, then synthesises the summary once the M365
  // Researcher results have been pasted back.
  'engagement-brief.md': 'vibe-engagement-brief',
  'customer-brief.md': 'vibe-customer-brief',
  'customer-public.md': 'vibe-research',
  'research-summary.md': 'vibe-research',
  'meeting-templates.md': 'vibe-schedule',
  // Discover (grounds in sources/, optionally the Tailwind demo seed).
  'PROJECT-CONTEXT.md': 'vibe-context',
  'personas.md': 'vibe-personas',
  'problem-statement.md': 'vibe-problem-statement',
  'current-state-journey.md': 'vibe-current-journey',
  // Disrupt (Week-2 workshop). These ground in the Discover deliverables already
  // in the repo + the designer's workshop captures — never the Tailwind seed — so
  // runPhase forces seed_demo=false for them (see DISRUPT_PROMPTS).
  'workshop-agenda.md': 'vibe-workshop-agenda',
  'ideation-concepts.md': 'vibe-concepts',
  'workshop-record.md': 'vibe-workshop-record',
  'selected-concept.md': 'vibe-selected-concept',
  'future-state-journey.md': 'vibe-future-journey',
  'storyboard.md': 'vibe-storyboard',
};
// The Disrupt generators must never re-seed the Tailwind demo sources: by Disrupt
// the grounding is the engagement's own Discover deliverables + workshop captures.
const DISRUPT_PROMPTS = new Set([
  'vibe-workshop-agenda', 'vibe-concepts', 'vibe-workshop-record',
  'vibe-selected-concept', 'vibe-future-journey', 'vibe-storyboard',
]);
// Preparation generators ground in the designer's sources + the briefs, never the
// Tailwind seed, so they also force seed_demo=false.
const PREP_PROMPTS = new Set([
  'vibe-engagement-brief', 'vibe-customer-brief', 'vibe-research', 'vibe-schedule',
]);

// ---- generator transparency -------------------------------------------------
// Surface the exact agent + prompt each "Generate" runs, so the designer can see
// what's working under the hood. The agent is the prompt file's `agent:`
// frontmatter — the very binding the headless runner resolves at run time
// (scripts/resolve-prompt.mjs → .vibe/agent.txt → `copilot --agent`). We read it
// from the prompts shipped inside the image (REPO_ROOT/.github/prompts) and cache,
// so the board reflects the live binding and can never drift from a hardcoded copy.
const _agentCache = new Map();
function agentForPrompt(promptId) {
  if (!promptId) return null;
  if (_agentCache.has(promptId)) return _agentCache.get(promptId);
  let agent = null;
  try {
    const txt = readFileSync(join(REPO_ROOT, '.github', 'prompts', `${promptId}.prompt.md`), 'utf8');
    const fm = txt.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    const am = fm && fm[1].match(/^agent:\s*(.+)$/m);
    if (am) agent = am[1].trim().replace(/^["']|["']$/g, '');
  } catch { /* prompt not in image (e.g. older engagement repo) — leave null */ }
  _agentCache.set(promptId, agent);
  return agent;
}
// { prompt, agent } for a deliverable file — nulls when no generator is wired.
function genMetaFor(file) {
  const prompt = FILE_PROMPT[file] || null;
  return { prompt, agent: prompt ? agentForPrompt(prompt) : null };
}
// Stamp every generatable card with the agent + prompt that produces it.
function attachGenMeta(deliverables) {
  for (const d of deliverables) {
    const { prompt, agent } = genMetaFor(d.file);
    if (prompt) { d.prompt = prompt; d.agent = agent; }
  }
  return deliverables;
}

async function runPhase(input) {
  const kebab = String(input.kebab || '').trim();
  const file = String(input.file || '').trim();
  const prompt = FILE_PROMPT[file];
  if (!kebab) return { code: 400, body: { error: 'Engagement is required.' } };
  if (!prompt) return { code: 400, body: { error: `No generator is wired for "${file}".` } };
  const rec = await findRec(kebab);
  if (!rec || !rec.repo) return { code: 404, body: { error: 'Engagement not found.' } };
  // Once the designer has added real sources, stop seeding the Tailwind demo so
  // the engine grounds the deliverable in their materials. The frontend passes
  // seedDemo explicitly; default to true to preserve the canned-demo flow. Disrupt and
  // Preparation generators never seed — they ground in the engagement's own materials
  // (Discover deliverables + workshop captures, or the designer's sources + briefs), so
  // re-seeding Tailwind would only add noise.
  const seed = (DISRUPT_PROMPTS.has(prompt) || PREP_PROMPTS.has(prompt) || input.seedDemo === false) ? 'false' : 'true';
  // Per-engagement model override. Empty/default → omit -f model so the engine uses
  // the Copilot CLI default. Only pass a known, non-empty id (the workflow exposes a
  // `model` input; older engagement repos without it would reject an unknown input).
  const model = (rec.model && isKnownModel(rec.model)) ? rec.model : '';
  const modelArg = model ? ` -f model=${model}` : '';
  try {
    execSync(
      `gh workflow run run-phase.yml --repo ${rec.repo} -f prompt=${prompt} -f engagement=${kebab} -f seed_demo=${seed}${modelArg}`,
      { stdio: 'pipe', env: ghEnv() },
    );
  } catch (e) {
    return { code: 502, body: { error: 'Could not dispatch the run.', detail: String(e.stderr || e.message || e).trim() } };
  }
  return { code: 202, body: { ok: true, repo: rec.repo, prompt, engagement: kebab, seededDemo: seed === 'true', model } };
}

// Persist the per-engagement engine model (validated against ENGINE_MODELS).
async function setModel(input) {
  const kebab = String(input.kebab || '').trim();
  const model = String(input.model || '').trim();
  if (!kebab) return { code: 400, body: { error: 'Engagement is required.' } };
  if (!isKnownModel(model)) return { code: 400, body: { error: `Unknown model "${model}".` } };
  const store = await readStore();
  const rec = store.find((r) => (r.id || '') === kebab);
  if (!rec || !rec.repo || !owns(rec)) return { code: 404, body: { error: 'Engagement not found.' } };
  rec.model = model;
  await writeStore(store);
  return { code: 200, body: { ok: true, model } };
}

async function runStatus(kebab) {
  const rec = await findRec(kebab);
  if (!rec || !rec.repo) return null;
  try {
    const out = execSync(
      `gh run list --repo ${rec.repo} --workflow run-phase.yml --limit 1 --json databaseId,status,conclusion,url,createdAt`,
      { encoding: 'utf8', env: ghEnv() },
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
  const u = currentUser();
  if (u && u.name) return u.name;
  try {
    const n = execSync('gh api user --jq .name', { encoding: 'utf8', env: ghEnv() }).trim();
    if (n && n !== 'null' && n !== '') return n;
  } catch { /* fall back to login */ }
  return actingLogin();
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

// The deliverables a designer can sign off from the web: the six gated ones plus
// the two Disrupt support artifacts that carry a "## Sign-off" table (the agenda
// and the workshop record). Approving a non-gated artifact writes its sign-off row
// but doesn't touch gates.json (it isn't part of any gate).
const APPROVABLE = {
  ...DELIVERABLE_TITLES,
  'workshop-agenda.md': DISRUPT_SUPPORT_TITLES['workshop-agenda.md'],
  'workshop-record.md': DISRUPT_SUPPORT_TITLES['workshop-record.md'],
};

async function approveDeliverable(input) {
  const id = String(input.kebab || '').trim();
  const file = String(input.file || '').trim();
  if (!id) return { code: 400, body: { error: 'Engagement is required.' } };
  if (!APPROVABLE[file]) return { code: 400, body: { error: `Unknown deliverable "${file}".` } };
  const rec = await findRec(id);
  if (!rec || !rec.repo) return { code: 404, body: { error: 'Engagement not found.' } };

  const path = `engagement/${id}/${file}`;
  const cur = await gh(`/repos/${rec.repo}/contents/${path}`);
  if (cur.status !== 200 || !cur.json?.content)
    return { code: 404, body: { error: `${APPROVABLE[file]} hasn't been generated yet.` } };
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

  // Only the gated deliverables affect gates.json; refreshing for the support ones
  // would be a no-op commit, so skip it.
  const gated = file in DELIVERABLE_TITLES;
  const refreshed = gated
    ? await refreshRepoGates(rec.repo, id, { [file]: next }, put.json?.commit?.sha ?? null)
    : { ok: true };
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
  'other': { label: 'Other source', single: false, path: (id, slug) => `sources/${slug}.md` },
  // Workshop captures live under sources/workshop/ and feed the Disrupt phase
  // (workshop-record reads them). Surfaced in the Disrupt section, not the Discover
  // Sources bucket — so it's deliberately excluded from sourceKindMeta().
  'workshop': { label: 'Workshop capture', single: false, path: (id, slug) => `sources/workshop/${slug}.md` },
  // M365 Researcher paste-back: the result the designer copies out of M365 Copilot
  // and pastes back. Lives under sources/research/ so the engine reads it when
  // synthesising research-summary.md. Managed by the Preparation research bucket, so —
  // like workshop — it's excluded from the generic Sources dropdown. (The research
  // summary, public brief, and M365 prompt are engine OUTPUTS, not designer inputs, so
  // they have no source kind at all.)
  'm365-results': { label: 'M365 research results', single: true, path: () => 'sources/research/m365-researcher-results.md' },
};

// The kind metadata the frontend needs to render the Discover add-source form +
// labels. Workshop captures have their own bucket in the Disrupt section, so the
// kind is omitted here (it would only clutter the Discover dropdown).
function sourceKindMeta() {
  return Object.fromEntries(
    Object.entries(SOURCE_KINDS)
      .filter(([k]) => k !== 'workshop' && k !== 'm365-results')
      .map(([k, v]) => [k, { label: v.label, single: v.single }]),
  );
}

// Map a committed repo path back to a source kind + display name, for listing.
function classifySource(id, path) {
  if (path === `engagement/${id}/customer-brief.md`) return { kind: 'customer-brief', name: 'Customer brief' };
  if (path === 'sources/questionnaire-responses.md') return { kind: 'questionnaire', name: 'Questionnaire responses' };
  // The M365 Researcher paste-back is the one designer-provided file under
  // sources/research/; the rest of that folder (customer-public, m365 prompt, research
  // synthesis) are Preparation engine OUTPUTS, surfaced as Preparation cards, not
  // sources — the generic sources/<x>.md rule below already excludes subdirectories.
  if (path === 'sources/research/m365-researcher-results.md') return { kind: 'm365-results', name: 'M365 research results' };
  const t = path.match(/^sources\/transcript-(.+)\.md$/);
  if (t) return { kind: 'transcript', name: t[1].replace(/-/g, ' ') };
  // Workshop must be matched before the generic sources/*.md rule below, which
  // would otherwise swallow sources/workshop/foo.md as an "other" named "workshop/foo".
  const w = path.match(/^sources\/workshop\/(.+)\.md$/);
  if (w) return { kind: 'workshop', name: w[1].replace(/-/g, ' ') };
  // meeting-templates.md is the Preparation schedule (an engine output, shown as a
  // Preparation card), not a designer source — exclude it like README. data-*.md are
  // the Discover grounding twins of staged mock data — they live in the Mock-data
  // bucket (not double-listed here), so exclude them too.
  const o = path.match(/^sources\/(.+)\.md$/);
  if (o && o[1] !== 'README' && o[1] !== 'meeting-templates' && !o[1].startsWith('data-') && !o[1].includes('/')) return { kind: 'other', name: o[1].replace(/-/g, ' ') };
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
  for (const f of await listRepoDir(rec.repo, 'sources/workshop')) all.push(f);
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
  const rec = await findRec(id);
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

  // Mark the engagement as source-backed so Generate stops seeding Tailwind.
  try {
    const store = await readStore();
    const r = store.find((x) => (x.id || '') === id);
    if (r && !r.sourcesAdded) { r.sourcesAdded = true; await writeStore(store); }
  } catch { /* non-fatal: the frontend also passes seedDemo explicitly */ }

  return { code: 200, body: { ok: true, path, kind, name: name || spec.label, original, converted: !!raw, updated: put.updated } };
}

// ---- mock data: structured files that do double duty ------------------------
// Designers stage the customer's CSV / Excel / JSON here. Each file is committed
// TWICE, for its two distinct jobs:
//   1. RAW → sources/sample-data/<name>   — untouched bytes for the engineer's
//      /vibe-data-prep agent, which turns them into typed models + a DataService
//      under scaffold/data/ during Build (it needs the originals, not a table).
//   2. GROUNDING twin → sources/data-<stem>.md — a readable form (Excel/CSV become
//      Markdown tables via MarkItDown; JSON is fenced) so the SAME data also informs
//      the Discover deliverables — a returns export shapes personas, pain points and
//      the current-state journey, not just the prototype.
// Kept as its own bucket (not folded into Sources) so the data-vs-evidence split
// stays legible in the UI, while the grounding twin removes the artificial wall that
// previously hid this data from the Discover generators. CSV/Excel/JSON only — a
// PDF/Word file isn't structured data, so it belongs in the Sources bucket instead.
const MOCKDATA_DIR = 'sources/sample-data';
const DATA_EXTS = new Set(['.csv', '.xlsx', '.xls', '.json']);

const dataFileEntry = (f) => ({
  name: f.name, path: f.path, size: f.size, htmlUrl: f.html_url,
  ext: extname(f.name).slice(1).toLowerCase(),
});

// GitHub-backed listing (the live board). README placeholder + any non-data file
// is filtered out so the bucket only ever shows real staged data. Each entry is
// flagged `grounded` when its Discover twin (sources/data-<stem>.md) exists.
async function listMockData(rec) {
  const files = await listRepoDir(rec.repo, MOCKDATA_DIR);
  const groundSet = new Set(
    (await listRepoDir(rec.repo, 'sources'))
      .filter((f) => /^data-.+\.md$/.test(f.name))
      .map((f) => f.name),
  );
  return files
    .filter((f) => f.name !== 'README.md' && DATA_EXTS.has(extname(f.name).toLowerCase()))
    .map((f) => ({ ...dataFileEntry(f), grounded: groundSet.has(groundName(f.name).split('/').pop()) }));
}

// Local-dev listing (the ?source=local board), mirroring how workshop captures are
// read off disk — no htmlUrl, since there's no committed blob to link to.
async function listMockDataLocal() {
  let groundSet = new Set();
  try {
    const s = await readdir(join(REPO_ROOT, 'sources'), { withFileTypes: true });
    groundSet = new Set(s.filter((e) => e.isFile() && /^data-.+\.md$/.test(e.name)).map((e) => e.name));
  } catch { /* no sources dir yet */ }
  try {
    const ents = await readdir(join(REPO_ROOT, 'sources', 'sample-data'), { withFileTypes: true });
    return ents
      .filter((e) => e.isFile() && e.name !== 'README.md' && DATA_EXTS.has(extname(e.name).toLowerCase()))
      .map((e) => ({ name: e.name, path: `${MOCKDATA_DIR}/${e.name}`, ext: extname(e.name).slice(1).toLowerCase(), grounded: groundSet.has(groundName(e.name).split('/').pop()) }));
  } catch { return []; }
}

// Keep the customer's original filename but make it filesystem/URL-safe and force a
// recognised data extension. Returns null for anything that isn't CSV / Excel / JSON.
function safeDataName(filename) {
  const base = String(filename || '').split(/[\\/]/).pop() || '';
  const ext = extname(base).toLowerCase();
  if (!DATA_EXTS.has(ext)) return null;
  const stem = base.slice(0, -ext.length).replace(/[^a-zA-Z0-9._-]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80);
  return (stem || 'data') + ext;
}

// The Discover grounding twin for a staged data file: sources/data-<stem>.md.
// Dots in the stem become dashes so the filename is clean (returns.q3.csv →
// sources/data-returns-q3.md). Excluded from the Sources list by classifySource.
const groundName = (safe) => {
  const e = extname(safe);
  const stem = safe.slice(0, -e.length).replace(/\./g, '-');
  return `sources/data-${stem}.md`;
};

// Commit a staged data file for BOTH its jobs: the raw original to
// sources/sample-data/ (the prototype's data layer, read by /vibe-data-prep at Build)
// and a readable grounding twin to sources/data-<stem>.md (so the same data also
// informs the Discover deliverables). Because it now grounds, it flips sourcesAdded
// like any real source, so Generate stops seeding Tailwind.
async function addMockData(input) {
  const id = String(input.kebab || '').trim();
  const filename = String(input.filename || '').trim();
  if (!id) return { code: 400, body: { error: 'Engagement is required.' } };
  if (!input.dataBase64) return { code: 400, body: { error: 'Attach a CSV, Excel or JSON file.' } };
  const safe = safeDataName(filename);
  if (!safe)
    return { code: 415, body: { error: `Only CSV, Excel (.xlsx/.xls) and JSON are accepted as mock data. “${filename}” isn’t structured data — if it’s a document, add it as a Source instead.` } };
  const buffer = Buffer.from(String(input.dataBase64), 'base64');
  if (!buffer.length) return { code: 400, body: { error: 'The uploaded file was empty.' } };
  if (buffer.length > 25 * 1024 * 1024)
    return { code: 413, body: { error: 'That file is larger than 25 MB. Trim or split it before staging.' } };
  const rec = await findRec(id);
  if (!rec || !rec.repo) return { code: 404, body: { error: 'Engagement not found.' } };

  // 1) Raw original → sources/sample-data/ (untouched bytes for Build).
  const path = `${MOCKDATA_DIR}/${safe}`;
  const put = await putRepoFile(rec.repo, path, buffer.toString('base64'),
    `Add mock data: ${safe} — via VIBE web surface`);
  if (!put.ok) return { code: 502, body: { error: 'Could not save the data file.', detail: put.detail } };

  // 2) Grounding twin → sources/data-<stem>.md so the same data informs Discover.
  //    Excel/CSV become Markdown tables via MarkItDown; JSON is fenced. If conversion
  //    isn't available we keep the raw file (Build is unaffected) and skip grounding.
  let grounded = false;
  const ext = extname(safe).toLowerCase();
  let groundMd = null;
  if (ext === '.json') {
    groundMd = '```json\n' + buffer.toString('utf8').trim() + '\n```\n';
  } else {
    try { groundMd = await convertToMarkdown(buffer, safe); }
    catch { if (ext === '.csv') groundMd = buffer.toString('utf8'); }
  }
  if (groundMd && groundMd.trim()) {
    const md = `# Customer data — ${safe}\n\n*Staged via the VIBE web surface; the raw file lives in \`${path}\` for the prototype's data layer.*\n\n${groundMd.trim()}\n`;
    const gp = await putRepoFile(rec.repo, groundName(safe), Buffer.from(md, 'utf8').toString('base64'),
      `Ground mock data in Discover: ${safe} — via VIBE web surface`);
    grounded = gp.ok;
  }

  // Data now grounds Discover, so it counts as a real source → stop seeding Tailwind.
  try {
    const store = await readStore();
    const r = store.find((x) => (x.id || '') === id);
    if (r && !r.sourcesAdded) { r.sourcesAdded = true; await writeStore(store); }
  } catch { /* non-fatal: the frontend also passes seedDemo explicitly */ }

  return { code: 200, body: { ok: true, path, name: safe, updated: put.updated, grounded } };
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
  // no-cache so a freshly edited engagement.js/styles.css is always served — this is a
  // dev/iteration tool, so correctness beats caching (avoids stale-asset confusion).
  send(res, 200, body, {
    'Content-Type': MIME[extname(file)] || 'application/octet-stream',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
  });
}

// ─── GitHub sign-in (OAuth) ──────────────────────────────────────────────────
// Off unless OAUTH_CLIENT_ID + OAUTH_CLIENT_SECRET are set → legacy single-user
// mode (local dev / today's container). When on, each designer signs in with
// their OWN GitHub account; we keep a short-lived server-side session keyed by an
// HttpOnly cookie and carry their token through the request via authCtx so every
// engagement op lands in THEIR account and runs on THEIR Copilot seat.
const OAUTH_SCOPE = process.env.OAUTH_SCOPE || 'repo workflow';
// Optional allow-list of logins (comma/space separated). Empty = any GitHub user.
const ALLOWED_LOGINS = new Set(
  String(process.env.ALLOWED_LOGINS || '')
    .split(/[\s,]+/).map((s) => s.trim().toLowerCase()).filter(Boolean),
);
const SESSION_TTL_MS = 1000 * 60 * 60 * 12; // 12h
const sessions = new Map();    // sid   -> { token, login, name, exp }
const oauthStates = new Map(); // state -> exp  (CSRF guard for the login round-trip)
const newId = (bytes = 24) => randomBytes(bytes).toString('base64url');

function parseCookies(req) {
  const out = {};
  for (const part of String(req.headers.cookie || '').split(';')) {
    const i = part.indexOf('=');
    if (i < 0) continue;
    out[part.slice(0, i).trim()] = decodeURIComponent(part.slice(i + 1).trim());
  }
  return out;
}
function isHttps(req) {
  const xf = String(req.headers['x-forwarded-proto'] || '').split(',')[0].trim();
  return xf ? xf === 'https' : !!req.socket?.encrypted;
}
function setCookie(res, name, value, { maxAge, req } = {}) {
  const bits = [`${name}=${encodeURIComponent(value)}`, 'Path=/', 'HttpOnly', 'SameSite=Lax'];
  if (req && isHttps(req)) bits.push('Secure');
  if (maxAge != null) bits.push(`Max-Age=${maxAge}`);
  const prev = res.getHeader('Set-Cookie');
  res.setHeader('Set-Cookie', prev ? [].concat(prev, bits.join('; ')) : bits.join('; '));
}
// Public origin for building the OAuth redirect_uri. Behind Container Apps the
// real host arrives in x-forwarded-*; BASE_URL pins it explicitly when set.
function baseUrl(req) {
  if (process.env.BASE_URL) return process.env.BASE_URL.replace(/\/$/, '');
  const proto = isHttps(req) ? 'https' : 'http';
  const host = String(req.headers['x-forwarded-host'] || req.headers.host || `localhost:${PORT}`).split(',')[0].trim();
  return `${proto}://${host}`;
}
function pruneSessions() {
  const now = Date.now();
  for (const [k, v] of sessions) if (v.exp <= now) sessions.delete(k);
  for (const [k, exp] of oauthStates) if (exp <= now) oauthStates.delete(k);
}
// The signed-in designer for this request, or null. Sync (reads cookie + map).
function sessionFor(req) {
  if (!OAUTH) return null;
  const sid = parseCookies(req)['vibe_sid'];
  if (!sid) return null;
  const s = sessions.get(sid);
  if (!s) return null;
  if (s.exp <= Date.now()) { sessions.delete(sid); return null; }
  return { sid, token: s.token, login: s.login, name: s.name };
}
// /api/me payload — drives the frontend's sign-in gate + identity chip.
function meBody(req) {
  if (!OAUTH) return { authRequired: false, user: { login: actingLogin(), name: userDisplayName() } };
  const s = sessionFor(req);
  return s
    ? { authRequired: true, user: { login: s.login, name: s.name } }
    : { authRequired: true, user: null };
}
function authError(res, msg) {
  res.writeHead(302, { Location: `/?auth_error=${encodeURIComponent(msg)}` });
  return res.end();
}

// /auth/login → bounce to GitHub; /auth/callback → exchange code, create session;
// /auth/logout → drop it. No-op (404) when sign-in is off.
async function handleAuth(req, res, url) {
  if (!OAUTH) return send(res, 404, { error: 'Sign-in is not enabled on this surface.' });
  pruneSessions();

  if (url.pathname === '/auth/login') {
    const state = newId(18);
    oauthStates.set(state, Date.now() + 1000 * 60 * 10);
    setCookie(res, 'vibe_oauth_state', state, { maxAge: 600, req });
    const auth = new URL('https://github.com/login/oauth/authorize');
    auth.searchParams.set('client_id', process.env.OAUTH_CLIENT_ID);
    auth.searchParams.set('redirect_uri', `${baseUrl(req)}/auth/callback`);
    auth.searchParams.set('scope', OAUTH_SCOPE);
    auth.searchParams.set('state', state);
    auth.searchParams.set('allow_signup', 'false');
    res.writeHead(302, { Location: auth.toString() });
    return res.end();
  }

  if (url.pathname === '/auth/callback') {
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state');
    const expect = parseCookies(req)['vibe_oauth_state'];
    setCookie(res, 'vibe_oauth_state', '', { maxAge: 0, req });
    if (!code || !state || !expect || state !== expect || !oauthStates.has(state))
      return authError(res, 'Sign-in could not be verified. Please try again.');
    oauthStates.delete(state);
    let token, login, name;
    try {
      const tokRes = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded', Accept: 'application/json', 'User-Agent': 'vibe-surface' },
        body: new URLSearchParams({
          client_id: process.env.OAUTH_CLIENT_ID,
          client_secret: process.env.OAUTH_CLIENT_SECRET,
          code,
          redirect_uri: `${baseUrl(req)}/auth/callback`,
        }).toString(),
      });
      token = (await tokRes.json()).access_token;
      if (!token) return authError(res, 'GitHub did not return an access token.');
      const uRes = await fetch('https://api.github.com/user', {
        headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json', 'User-Agent': 'vibe-surface' },
      });
      if (!uRes.ok) return authError(res, 'Could not read your GitHub profile.');
      const u = await uRes.json();
      login = u.login; name = u.name || u.login;
    } catch {
      return authError(res, 'Sign-in failed talking to GitHub. Please try again.');
    }
    if (ALLOWED_LOGINS.size && !ALLOWED_LOGINS.has(String(login).toLowerCase()))
      return authError(res, `Your GitHub account (${login}) isn’t on the allow-list for this surface.`);
    const sid = newId(24);
    sessions.set(sid, { token, login, name, exp: Date.now() + SESSION_TTL_MS });
    setCookie(res, 'vibe_sid', sid, { maxAge: Math.floor(SESSION_TTL_MS / 1000), req });
    res.writeHead(302, { Location: '/' });
    return res.end();
  }

  if (url.pathname === '/auth/logout') {
    const sid = parseCookies(req)['vibe_sid'];
    if (sid) sessions.delete(sid);
    setCookie(res, 'vibe_sid', '', { maxAge: 0, req });
    if (req.method === 'POST') return send(res, 200, { ok: true });
    res.writeHead(302, { Location: '/' });
    return res.end();
  }

  return send(res, 404, { error: 'Unknown auth route.' });
}

const server = createServer((req, res) => {
  // Resolve the signed-in designer from their session cookie (null in legacy mode)
  // and run the whole request inside that identity so every gh()/CLI call acts as
  // them. Set fresh per request, so requests never bleed identity into each other.
  const session = sessionFor(req);
  authCtx.run(session, async () => {
  try {
    const url = new URL(req.url, `http://localhost:${PORT}`);

    // GitHub sign-in round-trip + "who am I" — always reachable (even unauthenticated).
    if (url.pathname.startsWith('/auth/')) return await handleAuth(req, res, url);
    if (req.method === 'GET' && url.pathname === '/api/me') return send(res, 200, meBody(req));

    // When sign-in is ON, every API call needs a session (except the two public,
    // identity-light endpoints above + /api/config). Static assets stay public so
    // the SPA shell can load and render its own sign-in gate.
    if (OAUTH && url.pathname.startsWith('/api/') && url.pathname !== '/api/config' && !session)
      return send(res, 401, { error: 'Sign in with GitHub to continue.', authRequired: true });

    if (req.method === 'GET' && url.pathname === '/api/config')
      return send(res, 200, { template: `${TEMPLATE_OWNER}/${TEMPLATE_REPO}`, defaultOwner: OAUTH ? (session ? session.login : null) : actingLogin() });

    if (req.method === 'GET' && url.pathname === '/api/engagements')
      return send(res, 200, await visibleStore());

    if (req.method === 'POST' && url.pathname === '/api/engagements') {
      let raw = '';
      for await (const chunk of req) raw += chunk;
      const input = raw ? JSON.parse(raw) : {};
      const { code, body } = await createEngagement(input);
      return send(res, code, body);
    }

    if (req.method === 'GET' && url.pathname === '/api/board')
      return send(res, 200, (!OAUTH && url.searchParams.get('source') === 'local')
        ? await boardSummaryLocal() : await boardSummary());

    const detail = url.pathname.match(/^\/api\/board\/([A-Za-z0-9][A-Za-z0-9-]*)$/);
    if (req.method === 'GET' && detail) {
      const data = (!OAUTH && url.searchParams.get('source') === 'local')
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

    if (req.method === 'POST' && url.pathname === '/api/model') {
      let raw = '';
      for await (const chunk of req) raw += chunk;
      const input = raw ? JSON.parse(raw) : {};
      const { code, body } = await setModel(input);
      return send(res, code, body);
    }

    if (req.method === 'POST' && url.pathname === '/api/approve') {
      let raw = '';
      for await (const chunk of req) raw += chunk;
      const input = raw ? JSON.parse(raw) : {};
      const { code, body } = await approveDeliverable(input);
      return send(res, code, body);
    }

    if (req.method === 'GET' && url.pathname === '/api/sources') {
      const id = url.searchParams.get('kebab');
      const rec = await findRec(id);
      if (!rec || !rec.repo) return send(res, 404, { error: 'Engagement not found' });
      return send(res, 200, { sources: await listSources(rec), kinds: sourceKindMeta() });
    }

    // Fetch one source/deliverable file's raw text for the in-app viewer. Path is
    // confined to the engagement's sources/ tree or its own engagement/<id>/ folder.
    if (req.method === 'GET' && url.pathname === '/api/source') {
      const id = url.searchParams.get('kebab');
      const path = url.searchParams.get('path') || '';
      const rec = await findRec(id);
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

    // Mock data: raw CSV/Excel/JSON staged into sources/sample-data/ for the engineer's
    // /vibe-data-prep agent. GET lists what's staged; POST commits a raw file.
    if (req.method === 'GET' && url.pathname === '/api/data') {
      const id = url.searchParams.get('kebab');
      const rec = await findRec(id);
      if (!rec || !rec.repo) return send(res, 404, { error: 'Engagement not found' });
      return send(res, 200, { files: await listMockData(rec) });
    }

    if (req.method === 'POST' && url.pathname === '/api/data') {
      let raw = '';
      for await (const chunk of req) raw += chunk;
      const input = raw ? JSON.parse(raw) : {};
      const { code, body } = await addMockData(input);
      return send(res, code, body);
    }

    if (req.method === 'GET') return serveStatic(res, url.pathname);
    return send(res, 405, { error: 'Method not allowed' });
  } catch (err) {
    return send(res, 500, { error: String(err?.message || err) });
  }
  });
});

server.listen(PORT, async () => {
  await mkdir(PUBLIC, { recursive: true });
  console.log(`\n  VIBE Web Surface — provisioning`);
  console.log(`  template : ${TEMPLATE_OWNER}/${TEMPLATE_REPO}`);
  try { console.log(`  service  : ${serviceLogin()}${OAUTH ? '  (per-user GitHub sign-in ON)' : '  (legacy single-user mode)'}`); }
  catch { console.log('  service  : (gh not authenticated!)'); }
  console.log(`  open     : http://localhost:${PORT}\n`);
});
