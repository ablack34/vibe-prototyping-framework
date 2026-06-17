#!/usr/bin/env node
// Compose a headless invocation for a VIBE phase prompt.
//
// A VIBE phase step is normally driven interactively in VS Code as `/vibe-<id>`,
// which loads `.github/prompts/<id>.prompt.md` and binds it to the agent named in
// that file's `agent:` frontmatter. In headless mode (`copilot -p`) custom slash
// prompts do NOT auto-resolve, so this script does that resolution itself and
// writes two files the runner consumes:
//
//   .vibe/agent.txt      - the bound agent name (passed to `copilot --agent`)
//   .vibe/invocation.md  - the expanded, headless-ready task prompt
//
// Usage:
//   node scripts/resolve-prompt.mjs <promptId> [key=value ...]
//   node scripts/resolve-prompt.mjs vibe-personas engagement=contoso
//
// Repo root defaults to cwd; override with VIBE_REPO env or --repo=<path>.

import { readFileSync, readdirSync, mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const args = process.argv.slice(2);
let repo = process.env.VIBE_REPO || process.cwd();
const positional = [];
const inputs = {};
for (const a of args) {
  if (a.startsWith('--repo=')) { repo = a.slice('--repo='.length); continue; }
  const i = a.indexOf('=');
  if (i > 0) inputs[a.slice(0, i)] = a.slice(i + 1);
  else positional.push(a);
}
const promptId = positional[0];
if (!promptId) {
  console.error('usage: resolve-prompt.mjs <promptId> [key=value ...]');
  process.exit(2);
}

function parseFrontmatter(text) {
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!m) return { fm: {}, body: text };
  const fm = {};
  for (const line of m[1].split(/\r?\n/)) {
    const mm = line.match(/^([\w-]+):\s*(.*)$/);
    if (mm) fm[mm[1]] = mm[2].trim().replace(/^["']|["']$/g, '');
  }
  return { fm, body: m[2] };
}

// 1. Read the prompt and its agent binding.
const promptPath = join(repo, '.github', 'prompts', `${promptId}.prompt.md`);
if (!existsSync(promptPath)) {
  console.error(`prompt not found: ${promptPath}`);
  process.exit(1);
}
const { fm: pfm, body: pbody } = parseFrontmatter(readFileSync(promptPath, 'utf8'));
const agentName = pfm.agent || '';

// 2. Resolve the bound agent file by its `name:` frontmatter.
let agentResolved = false;
const agentsDir = join(repo, '.github', 'agents');
if (agentName && existsSync(agentsDir)) {
  for (const f of readdirSync(agentsDir)) {
    if (!f.endsWith('.agent.md')) continue;
    const { fm } = parseFrontmatter(readFileSync(join(agentsDir, f), 'utf8'));
    if (fm.name === agentName) { agentResolved = true; break; }
  }
}

// 3. Auto-detect the engagement when not supplied and exactly one exists.
let engagement = inputs.engagement || '';
if (!engagement) {
  const engDir = join(repo, 'engagement');
  if (existsSync(engDir)) {
    const dirs = readdirSync(engDir, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => d.name);
    if (dirs.length === 1) engagement = dirs[0];
  }
}
const kebab = engagement.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

// 4. Substitute inputs + {{engagement-kebab}}.
let body = pbody;
for (const [k, v] of Object.entries(inputs)) body = body.split(`\${input:${k}}`).join(v);
body = body.split('{{engagement-kebab}}').join(kebab || '{{engagement-kebab}}');
body = body.split('${input:engagement}').join(engagement || '(auto-detect)');

// 5. Compose the headless invocation: a header that makes the run autonomous,
//    followed by the expanded prompt body.
const header = [`# VIBE headless phase run — ${promptId}`, ''];
if (agentName) header.push(`You are the **${agentName}** agent. Follow that agent's persona, rules, and output conventions exactly.`);
header.push(
  'You are running NON-INTERACTIVELY in CI. You cannot ask the user questions.',
  '- Proceed using the sources and context already present in the repository.',
  '- Do NOT pause for review, confirmation, or sign-off — sign-off is a human step performed later in the web surface.',
  '- If a required input is missing, make the best reasonable assumption from available sources and note it inline in the document. Never stop to ask.',
  '- Produce the deliverable file(s) on disk exactly as the task instructs, then stop.',
);
if (engagement) header.push(`- Engagement: "${engagement}" (kebab "${kebab}"). Write deliverables under engagement/${kebab}/.`);
header.push('', '---', '', '## Task', '', body.trim(), '');
const invocation = header.join('\n');

// 6. Write the runner inputs.
const outDir = join(repo, '.vibe');
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, 'agent.txt'), agentName);
writeFileSync(join(outDir, 'invocation.md'), invocation);

// 7. Diagnostics to stderr (stdout stays clean for any redirection).
console.error(
  `resolve-prompt: ${promptId} -> agent "${agentName || '(none)'}"` +
  `${agentName && !agentResolved ? ' [WARN: agent file not found]' : ''}` +
  `, engagement "${engagement || '(none)'}", invocation ${invocation.length} bytes`,
);
const unresolved = [...new Set(invocation.match(/\$\{input:[^}]+\}|\{\{[^}]+\}\}/g) || [])];
if (unresolved.length) console.error(`resolve-prompt: WARN ${unresolved.length} unresolved token(s): ${unresolved.join(', ')}`);
