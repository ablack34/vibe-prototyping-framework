#!/usr/bin/env node
// Generate the committed gate ledger for an engagement.
//
// Projects the gate state that today lives as prose across artifacts (grade lines
// + Sign-off tables) into a single committed, SHA-bound, machine-readable
// gates.json. The web surface and `/vibe-doctor` read this instead of re-deriving
// state from prose, and the SHA binding lets an edit-after-sign-off invalidate a
// gate (something prose sign-off cannot do).
//
// Usage:
//   node scripts/gen-gates.mjs <engagementDir> [priorGatesJson]
//
// Writes <engagementDir>/gates.json. If [priorGatesJson] is omitted, the existing
// <engagementDir>/gates.json (if any) is used as the prior, so sign-off SHAs carry
// forward across runs and staleness is detected automatically.

import { readFileSync, existsSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { computeGates } from './gates-lib.mjs';

const dir = process.argv[2];
if (!dir) {
  console.error('usage: gen-gates.mjs <engagementDir> [priorGatesJson]');
  process.exit(2);
}

const outPath = join(dir, 'gates.json');
const priorPath = process.argv[3] || outPath;
const prior = existsSync(priorPath)
  ? JSON.parse(readFileSync(priorPath, 'utf8'))
  : { artifacts: {} };

const out = computeGates(dir, prior);
writeFileSync(outPath, JSON.stringify(out, null, 2) + '\n');

console.error(
  `gen-gates: ${outPath}\n` +
  `  discover: ${out.gates.discover.status} (grades ${out.gates.discover.gradePassing}, signoff ${out.gates.discover.signoffOk}, stale ${out.gates.discover.stale})\n` +
  `  disrupt : ${out.gates.disrupt.status} (artifacts ${out.gates.disrupt.artifactsPresent})\n` +
  `  handoffReady: ${out.handoffReady}`,
);
