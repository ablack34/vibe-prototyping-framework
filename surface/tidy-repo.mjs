// Tidy a freshly provisioned engagement repo.
//
// "Generate from template" copies the ENTIRE framework repo into the new repo —
// including the web control surface, the docs site, the pitch deck, every other
// engagement's folder, and the framework-only CI/deploy workflows. Those last
// ones are the worst: they fire on the engine's commits and show up as a failing
// "Deploy Docs" run in the designer's brand-new repo.
//
// This rewrites the default branch in ONE commit (via the Git Data API) to keep
// only what an engagement actually needs: the engine (.github agents/prompts/
// instructions + the run-phase workflow), scripts/, templates/, the demo seed,
// the build-phase scaffold, sources/, and the licence/readme.
//
// Used by surface/server.mjs on provision, and runnable standalone to clean an
// existing repo:  node surface/tidy-repo.mjs <owner/repo> [branch]

import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

// Whole directories that are framework scaffolding, not engagement content.
const STRIP_DIRS = ['surface/', 'docs-site/', 'docs/', 'pitch/', 'engagement/'];

// Individual files: framework helpers + every workflow except the engine's.
const STRIP_FILES = new Set([
  'CONTRIBUTING.md',
  'new-engagement.ps1',
  'start.ps1',
  'vibe-prototyping-framework.sln',
  '.github/workflows/ci.yml',
  '.github/workflows/deploy-api.yml',
  '.github/workflows/deploy-docs.yml',
  '.github/workflows/deploy-surface.yml',
  '.github/workflows/deploy-swa.yml',
  '.github/workflows/phase-consistency.yml',
]);

export function shouldStrip(path, keepEngagement = null) {
  if (STRIP_FILES.has(path)) return true;
  // Preserve THIS engagement's own folder — only other engagements are clutter.
  if (keepEngagement &&
    (path === `engagement/${keepEngagement}` || path.startsWith(`engagement/${keepEngagement}/`))) return false;
  return STRIP_DIRS.some((d) => path === d.slice(0, -1) || path.startsWith(d));
}

async function api(token, path, opts = {}) {
  const res = await fetch(`https://api.github.com${path}`, {
    method: opts.method || 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'Content-Type': 'application/json',
      'User-Agent': 'vibe-surface-tidy',
    },
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  });
  let json = null;
  try { json = await res.json(); } catch { /* empty body */ }
  return { status: res.status, json };
}

// Rewrite the repo's default branch to drop framework scaffolding. One commit,
// fast-forward from the current HEAD. Returns { ok, removed, kept, commit } or
// { ok:false, error }.
export async function tidyRepo(fullName, { token, defaultBranch = 'main', keepEngagement = null } = {}) {
  const tok = token || execSync('gh auth token', { encoding: 'utf8' }).trim();

  const ref = await api(tok, `/repos/${fullName}/git/ref/heads/${defaultBranch}`);
  if (ref.status !== 200) return { ok: false, error: `ref ${defaultBranch}: ${ref.status}` };
  const headSha = ref.json.object.sha;

  const commit = await api(tok, `/repos/${fullName}/git/commits/${headSha}`);
  if (commit.status !== 200) return { ok: false, error: `read commit: ${commit.status}` };

  const tree = await api(tok, `/repos/${fullName}/git/trees/${commit.json.tree.sha}?recursive=1`);
  if (tree.status !== 200) return { ok: false, error: `read tree: ${tree.status}` };
  if (tree.json.truncated) return { ok: false, error: 'tree truncated (repo too large to tidy in one pass)' };

  const blobs = tree.json.tree.filter((e) => e.type === 'blob');
  const keep = blobs.filter((e) => !shouldStrip(e.path, keepEngagement));
  const removed = blobs.length - keep.length;
  if (removed === 0) return { ok: true, removed: 0, kept: keep.length, unchanged: true };

  const newTree = await api(tok, `/repos/${fullName}/git/trees`, {
    method: 'POST',
    body: { tree: keep.map((e) => ({ path: e.path, mode: e.mode, type: 'blob', sha: e.sha })) },
  });
  if (newTree.status !== 201) return { ok: false, error: `new tree: ${newTree.status} ${newTree.json?.message || ''}` };

  const newCommit = await api(tok, `/repos/${fullName}/git/commits`, {
    method: 'POST',
    body: {
      message:
        'Tidy engagement repo: keep the VIBE engine, drop framework scaffolding\n\n' +
        'Removes the web control surface, docs site, pitch, other engagements, and\n' +
        'the framework-only CI/deploy workflows from this provisioned engagement, so\n' +
        'the repo holds just what the engine and the engineer need.',
      tree: newTree.json.sha,
      parents: [headSha],
    },
  });
  if (newCommit.status !== 201) return { ok: false, error: `new commit: ${newCommit.status} ${newCommit.json?.message || ''}` };

  const upd = await api(tok, `/repos/${fullName}/git/refs/heads/${defaultBranch}`, {
    method: 'PATCH',
    body: { sha: newCommit.json.sha, force: false },
  });
  if (upd.status !== 200) return { ok: false, error: `update ref: ${upd.status} ${upd.json?.message || ''}` };

  return { ok: true, removed, kept: keep.length, commit: newCommit.json.sha };
}

// CLI entry: node surface/tidy-repo.mjs <owner/repo> [branch] [keepEngagement]
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const fullName = process.argv[2];
  const branch = process.argv[3] || 'main';
  const keepEngagement = process.argv[4] || null;
  if (!fullName) {
    console.error('usage: node surface/tidy-repo.mjs <owner/repo> [branch] [keepEngagement]');
    process.exit(2);
  }
  tidyRepo(fullName, { defaultBranch: branch, keepEngagement }).then((r) => {
    console.log(JSON.stringify(r, null, 2));
    process.exit(r.ok ? 0 : 1);
  });
}
