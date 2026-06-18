// Shared gate-computation logic for the VIBE engine.
//
// Single source of truth for how an engagement's gate state is derived from its
// artifacts. Used by scripts/gen-gates.mjs (writes the committed gates.json) and
// by the web surface server (renders gate tiles + grade badges live). Keeping it
// in one place means the CLI and the UI can never disagree.

import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { execSync } from 'node:child_process';
import { createHash } from 'node:crypto';

export const GATES = {
  discover: {
    files: ['personas.md', 'problem-statement.md', 'current-state-journey.md'],
    requireSignoff: [],
  },
  disrupt: {
    files: ['selected-concept.md', 'future-state-journey.md', 'storyboard.md'],
    requireSignoff: ['selected-concept.md'],
  },
};
const RANK = { A: 3, B: 2, C: 1 };

export function blobSha(path) {
  try { return execSync(`git hash-object "${path}"`, { encoding: 'utf8' }).trim(); }
  catch { return null; }
}

// Pure-JS equivalent of `git hash-object` for in-memory content (no working tree).
// Lets the web surface compute the same SHA the engine commits, so a server-side
// gate refresh binds sign-off to the exact bytes git will store.
export function gitBlobSha(content) {
  const buf = Buffer.from(content, 'utf8');
  return createHash('sha1').update(`blob ${buf.length}\0`).update(buf).digest('hex');
}

export function lowestGrade(text) {
  // Two canonical grade-marker styles appear across the deliverables:
  //   Form A  `> **Grade:** A`   (colon form — personas)
  //   Form B  `**Grade A** — …`  (inline bold form — problem-statement, journey)
  // Both are matched. Rubric prose like `**Grade A (Strong)**` is excluded: it has
  // no colon (fails A) and the letter is followed by " (" not "**" (fails B).
  const found = [];
  for (const m of text.matchAll(/\*\*Grade:\*{0,2}\s*([ABC])\b/gi)) found.push(m[1].toUpperCase());
  for (const m of text.matchAll(/\*\*Grade\s+([ABC])\*\*/gi)) found.push(m[1].toUpperCase());
  if (!found.length) return null;
  return found.reduce((lo, g) => (RANK[g] < RANK[lo] ? g : lo), found[0]);
}

export function signoff(text) {
  const sec = text.split(/##\s*Sign-?off/i)[1];
  if (!sec) return null;
  for (const line of sec.split(/\r?\n/)) {
    const m = line.match(/^\|\s*([^|]+?)\s*\|\s*([^|]+?)\s*\|\s*([^|]+?)\s*\|/);
    if (!m) continue;
    const name = m[1].trim();
    if (!name || /\{\{/.test(name) || /^reviewed by$/i.test(name) || /^-+$/.test(name)) continue;
    return { by: name, role: m[2].trim(), at: m[3].trim() };
  }
  return null;
}

// Evaluate a single present artifact. `prior` is that artifact's record from an
// earlier gates.json (or undefined): if it was signed by the same person, its
// sign-off SHA carries forward so an edit-after-sign-off flips it stale.
function evalArtifact(text, sha, prior) {
  const grade = lowestGrade(text);
  const so = signoff(text);
  const wasSigned = prior?.signedOffSha;
  const signedOffSha = so
    ? (wasSigned && prior.signedOffBy === so.by ? wasSigned : sha)
    : null;
  const isStale = !!(so && signedOffSha && signedOffSha !== sha);
  return {
    present: true,
    grade,
    gradePass: grade ? RANK[grade] >= RANK.B : false,
    signedOffBy: so?.by ?? null,
    signedOffAt: so?.at ?? null,
    sha,
    signedOffSha,
    stale: isStale,
  };
}

// Roll the per-artifact records up into gate statuses + handoffReady, in place.
function rollup(out) {
  for (const [gate, cfg] of Object.entries(GATES)) {
    let present = 0, passing = 0, signedOk = true, stale = false;
    for (const f of cfg.files) {
      const a = out.artifacts[f];
      if (!a || !a.present) continue;
      present++;
      if (a.gradePass) passing++;
      if (cfg.requireSignoff.includes(f) && !a.signedOffBy) signedOk = false;
      if (a.stale) stale = true;
    }
    const complete = present === cfg.files.length;
    out.gates[gate] = {
      status: complete && passing === cfg.files.length && signedOk && !stale ? 'GREEN'
        : present === 0 ? 'NOT_STARTED' : 'INCOMPLETE',
      artifactsPresent: `${present}/${cfg.files.length}`,
      gradePassing: `${passing}/${cfg.files.length}`,
      signoffOk: signedOk,
      stale,
    };
  }
  out.handoffReady = out.gates.discover.status === 'GREEN' && out.gates.disrupt.status === 'GREEN';
}

// Compute the full gate object for an engagement directory. `prior` is an earlier
// gates.json (or {}), used to carry sign-off SHAs forward so edit-after-sign-off
// flips an artifact stale.
export function computeGates(dir, prior = { artifacts: {} }) {
  const out = {
    engagement: dir.split(/[\\/]/).filter(Boolean).pop(),
    generatedAt: new Date().toISOString(),
    artifacts: {},
    gates: {},
  };

  for (const cfg of Object.values(GATES)) {
    for (const f of cfg.files) {
      const p = join(dir, f);
      if (!existsSync(p)) { out.artifacts[f] = { present: false }; continue; }
      out.artifacts[f] = evalArtifact(readFileSync(p, 'utf8'), blobSha(p), prior.artifacts?.[f]);
    }
  }

  rollup(out);
  try { out.commitSha = execSync('git rev-parse HEAD', { cwd: dir, encoding: 'utf8' }).trim(); }
  catch { out.commitSha = null; }
  return out;
}

// Same computation as computeGates, but driven by in-memory file contents instead
// of a working tree. `contents` maps each gate filename to its text (or null when
// absent). Lets the web surface refresh gates.json from the GitHub Contents API
// after a web sign-off — sharing evalArtifact/rollup means it can never disagree
// with the CLI generator.
export function computeGatesFromContents(engagement, contents, prior = { artifacts: {} }, commitSha = null) {
  const out = { engagement, generatedAt: new Date().toISOString(), artifacts: {}, gates: {} };
  for (const cfg of Object.values(GATES)) {
    for (const f of cfg.files) {
      const text = contents[f];
      if (text == null) { out.artifacts[f] = { present: false }; continue; }
      out.artifacts[f] = evalArtifact(text, gitBlobSha(text), prior.artifacts?.[f]);
    }
  }
  rollup(out);
  out.commitSha = commitSha;
  return out;
}
