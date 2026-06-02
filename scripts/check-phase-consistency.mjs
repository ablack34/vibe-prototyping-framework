#!/usr/bin/env node
/*
 * Phase-consistency checker for the VIBE Prototyping Framework.
 *
 * Catches the mechanical drift bugs that appear whenever phases get added,
 * renamed, merged, or restructured:
 *
 *   1. /vibe-<x>          references that point at a deleted/renamed prompt
 *   2. vibe-<x>.prompt.md path references that point at a non-existent file
 *   3. @VIBE <Name>       references that don't resolve to a real agent
 *   4. agent: "VIBE …"    prompt frontmatter that doesn't resolve to an agent
 *   5. sidebar_position   values that aren't unique + contiguous 1..N
 *   6. sidebars.ts        items[] under "The N Phases" that don't match the docs
 *   7. "The N Phases"     label whose number-word doesn't match the actual count
 *   8. state.json.*       paths in any markdown that don't match the canonical
 *                         schema declared in vibe-engagement-lead.agent.md
 *
 * Pure Node ESM, no external dependencies. Exit 0 if all errors clean,
 * exit 1 if any error finding, exit 2 on unexpected failure. Warnings
 * (state-path drift, schema-load issues) never fail the build.
 *
 * Usage:  node scripts/check-phase-consistency.mjs
 */

import { readFile, readdir } from 'node:fs/promises';
import { join, relative, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '..');

/* --------------------------------------------------------------------- *
 * Whitelist: prompt/agent names that look like references but aren't.    *
 * Add an entry here if a check fires on illustrative content (e.g. a    *
 * "in a future phase you'd run /vibe-fictional" code sample).           *
 * --------------------------------------------------------------------- */

const IGNORE_PROMPT_REFS = new Set([
  // The repo name itself — never a prompt. Lookbehind blocks most cases (URLs), but
  // bullet-list-style "* /vibe-prototyping-framework" mentions would otherwise resolve
  // to a non-existent .github/prompts/vibe-prototyping-framework.prompt.md.
  'vibe-prototyping-framework',
  // Forward-reference: the engineer's first task in Design & Develop. The prompt lands
  // in PR 3 of the Disrupt slice (when the new D&D agent is wired up); the storyboard
  // template + prompt already point at it because it's part of the slice's narrative.
  'vibe-engineering-brief',
  // Add other examples or future-state placeholders here, e.g. 'vibe-fictional'.
]);

const IGNORE_AGENT_REFS = new Set([
  // Forward-reference: the new Disrupt phase agent. The Disrupt prompts and reference
  // doc already mention it because PR 1 ships the templates/prompts and PR 2 ships the
  // agent itself. Remove this entry once .github/agents/vibe-disrupt.agent.md exists.
  'vibe-disrupt',
  // Add other examples or future-state placeholders here, e.g. 'vibe-fictional'.
  //
  // Note: the agent-ref regex matches `VIBE` followed by space-separated capitalised
  // words. Names containing `&` or hyphens (e.g. "VIBE Design & Develop") will only
  // partial-match; if you introduce such a name, prefer a single-word slug.
]);

/* --------------------------------------------------------------------- *
 * File discovery                                                         *
 * --------------------------------------------------------------------- */

const SCAN_DIRS = [
  '.github/agents',
  '.github/prompts',
  '.github/instructions',
  'docs-site/docs',
  'templates',
  'demo',
  'pitch',
  'docs',
];

const SCAN_FILES = [
  'README.md',
  'CONTRIBUTING.md',
  '.github/copilot-instructions.md',
  'docs-site/sidebars.ts',
];

const EXCLUDE_DIRS = new Set([
  'node_modules', 'build', 'dist', '.git', '.docusaurus',
  '__pycache__', '.next', '.turbo', '.cache', '.vscode',
]);

const SCAN_EXTENSIONS = /\.(md|mdx|ts|js|tsx|jsx|yml|yaml|json)$/i;

async function walk(dir, files = []) {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return files;
  }
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (EXCLUDE_DIRS.has(entry.name)) continue;
      await walk(fullPath, files);
    } else if (entry.isFile() && SCAN_EXTENSIONS.test(entry.name)) {
      files.push(fullPath);
    }
  }
  return files;
}

async function collectScanFiles() {
  const result = new Set();
  for (const dir of SCAN_DIRS) {
    const files = await walk(join(repoRoot, dir));
    for (const f of files) result.add(f);
  }
  for (const f of SCAN_FILES) {
    result.add(join(repoRoot, f));
  }
  return [...result];
}

async function listPromptFiles() {
  const dir = join(repoRoot, '.github', 'prompts');
  const entries = await readdir(dir);
  return new Set(
    entries
      .filter(n => n.endsWith('.prompt.md'))
      .map(n => n.replace(/\.prompt\.md$/, ''))
  );
}

async function listAgentFiles() {
  const dir = join(repoRoot, '.github', 'agents');
  const entries = await readdir(dir);
  return new Set(
    entries
      .filter(n => n.endsWith('.agent.md'))
      .map(n => n.replace(/\.agent\.md$/, ''))
  );
}

function agentNameToSlug(displayName) {
  // "VIBE Engagement Lead" -> "vibe-engagement-lead"
  return 'vibe-' + displayName.trim().toLowerCase().replace(/\s+/g, '-');
}

/* --------------------------------------------------------------------- *
 * Findings collection                                                    *
 * --------------------------------------------------------------------- */

const findings = [];

function addFinding(severity, check, file, line, msg) {
  findings.push({
    severity,
    check,
    file: relative(repoRoot, file).replace(/\\/g, '/'),
    line,
    msg,
  });
}

/* --------------------------------------------------------------------- *
 * Checks                                                                 *
 * --------------------------------------------------------------------- */

async function checkPromptRefs(files, validPrompts) {
  const regex = /(?<![\w-])\/vibe-([a-z][a-z0-9-]*)/g;
  for (const file of files) {
    const content = await readFile(file, 'utf8');
    const lines = content.split('\n');
    lines.forEach((line, i) => {
      regex.lastIndex = 0;
      let m;
      while ((m = regex.exec(line)) !== null) {
        const name = 'vibe-' + m[1];
        if (IGNORE_PROMPT_REFS.has(name)) continue;
        if (!validPrompts.has(name)) {
          addFinding('error', 'prompt-ref', file, i + 1,
            `references /${name} but .github/prompts/${name}.prompt.md does not exist`);
        }
      }
    });
  }
}

async function checkPromptPathRefs(files, validPrompts) {
  const regex = /\bvibe-([a-z][a-z0-9-]*)\.prompt\.md\b/g;
  for (const file of files) {
    const content = await readFile(file, 'utf8');
    const lines = content.split('\n');
    lines.forEach((line, i) => {
      regex.lastIndex = 0;
      let m;
      while ((m = regex.exec(line)) !== null) {
        const name = 'vibe-' + m[1];
        if (IGNORE_PROMPT_REFS.has(name)) continue;
        if (!validPrompts.has(name)) {
          addFinding('error', 'prompt-path', file, i + 1,
            `references ${name}.prompt.md which does not exist`);
        }
      }
    });
  }
}

async function checkAgentRefs(files, validAgents) {
  // @VIBE Name — capitalized words joined by a SINGLE space (real names like
  // "Engagement Lead" never use wider spacing; multi-space gaps appear only in
  // ASCII-aligned column layouts and would otherwise glue stray words on).
  const regex = /@VIBE +([A-Z][a-zA-Z]+(?: [A-Z][a-zA-Z]+)*)/g;
  for (const file of files) {
    const content = await readFile(file, 'utf8');
    const lines = content.split('\n');
    lines.forEach((line, i) => {
      regex.lastIndex = 0;
      let m;
      while ((m = regex.exec(line)) !== null) {
        const displayName = m[1].trim();
        const slug = agentNameToSlug(displayName);
        if (IGNORE_AGENT_REFS.has(slug)) continue;
        if (!validAgents.has(slug)) {
          addFinding('error', 'agent-ref', file, i + 1,
            `references @VIBE ${displayName} but .github/agents/${slug}.agent.md does not exist`);
        }
      }
    });
  }
}

async function checkAgentFrontmatter(validAgents) {
  // Scans both prompt and agent frontmatter for `agent: VIBE …` lines.
  //
  // - Prompt frontmatter has a single top-level `agent:` declaring the owning agent.
  // - Agent frontmatter has a `handoffs:` list whose entries each include `agent: VIBE …`
  //   pointing at another agent. These are the buttons rendered at the bottom of every
  //   agent response; if they point at a renamed/removed agent the user gets a dead button.
  //
  // We accept any line matching `<indent>agent: VIBE Name` because nested YAML still
  // uses the same `agent: …` shape.
  const lineRegex = /^[ \t-]*agent:\s*["']?(VIBE +[A-Z][a-zA-Z]+(?: [A-Z][a-zA-Z]+)*)["']?\s*$/gm;

  async function scanDir(dirRel) {
    const dir = join(repoRoot, dirRel);
    let entries;
    try { entries = await readdir(dir); } catch { return; }
    for (const entry of entries) {
      if (!entry.endsWith('.prompt.md') && !entry.endsWith('.agent.md')) continue;
      const file = join(dir, entry);
      const content = await readFile(file, 'utf8');
      const fmMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
      if (!fmMatch) continue;
      const fm = fmMatch[1];
      const lines = fm.split('\n');
      lineRegex.lastIndex = 0;
      let m;
      while ((m = lineRegex.exec(fm)) !== null) {
        const displayName = m[1].replace(/^VIBE +/, '').trim();
        const slug = agentNameToSlug(displayName);
        if (IGNORE_AGENT_REFS.has(slug)) continue;
        if (!validAgents.has(slug)) {
          // Compute line within the frontmatter for a better pointer.
          let lineNo = 1;
          let offset = 0;
          for (let i = 0; i < lines.length; i++) {
            const lineEnd = offset + lines[i].length + 1;
            if (m.index < lineEnd) { lineNo = i + 2; break; } // +1 for `---` opener, +1 for 1-based
            offset = lineEnd;
          }
          addFinding('error', 'agent-frontmatter', file, lineNo,
            `frontmatter agent "VIBE ${displayName}" but .github/agents/${slug}.agent.md does not exist`);
        }
      }
    }
  }

  await scanDir('.github/prompts');
  await scanDir('.github/agents');
}

async function checkSidebarPositions() {
  const dir = join(repoRoot, 'docs-site', 'docs', 'phases');
  let entries;
  try {
    entries = await readdir(dir);
  } catch {
    addFinding('error', 'sidebar-pos', dir, 1, `docs-site/docs/phases/ does not exist`);
    return 0;
  }
  const positions = [];
  for (const entry of entries) {
    if (!entry.endsWith('.md')) continue;
    const file = join(dir, entry);
    const content = await readFile(file, 'utf8');
    const fmMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    if (!fmMatch) {
      addFinding('error', 'sidebar-pos', file, 1, `missing frontmatter`);
      continue;
    }
    const posMatch = fmMatch[1].match(/^sidebar_position:\s*(\d+)/m);
    if (!posMatch) {
      addFinding('error', 'sidebar-pos', file, 1, `missing sidebar_position`);
      continue;
    }
    positions.push({ file, pos: parseInt(posMatch[1], 10), name: entry });
  }
  positions.sort((a, b) => a.pos - b.pos);

  const seenPos = new Map();
  for (const p of positions) {
    if (seenPos.has(p.pos)) {
      addFinding('error', 'sidebar-pos', p.file, 1,
        `sidebar_position ${p.pos} duplicates ${relative(repoRoot, seenPos.get(p.pos)).replace(/\\/g, '/')}`);
    } else {
      seenPos.set(p.pos, p.file);
    }
  }
  // Contiguous starting at 1
  for (let i = 0; i < positions.length; i++) {
    if (positions[i].pos !== i + 1) {
      addFinding('error', 'sidebar-pos', positions[i].file, 1,
        `sidebar_position ${positions[i].pos} breaks contiguous 1..N sequence (expected ${i + 1})`);
    }
  }
  return positions.length;
}

const NUMBER_WORDS = {
  one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7,
  eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12,
};

const COUNT_TO_WORD = Object.fromEntries(
  Object.entries(NUMBER_WORDS).map(([word, n]) => [n, word.replace(/^./, c => c.toUpperCase())])
);

async function checkSidebarItems(expectedPhaseCount) {
  const file = join(repoRoot, 'docs-site', 'sidebars.ts');
  const content = await readFile(file, 'utf8');

  // 1. "The N Phases" label vs actual count
  const labelMatch = content.match(/label:\s*['"]The (\w+) Phases['"]/);
  if (!labelMatch) {
    addFinding('error', 'sidebar-label', file, 1,
      `could not find "label: 'The N Phases'" entry — has the phases category been renamed?`);
  } else {
    const numberWord = labelMatch[1];
    const declaredCount = NUMBER_WORDS[numberWord.toLowerCase()];
    if (declaredCount === undefined) {
      addFinding('error', 'sidebar-label', file, 1,
        `unrecognised number word "${numberWord}" in "The ${numberWord} Phases" label — expected one of: ${Object.keys(NUMBER_WORDS).join(', ')}`);
    } else if (declaredCount !== expectedPhaseCount) {
      const correctWord = COUNT_TO_WORD[expectedPhaseCount] ?? String(expectedPhaseCount);
      addFinding('error', 'sidebar-label', file, 1,
        `label says "The ${numberWord} Phases" (=${declaredCount}) but docs-site/docs/phases/ has ${expectedPhaseCount} pages — change to "The ${correctWord} Phases"`);
    }
  }

  // 2. items[] vs phase docs (membership AND order)
  const phaseDir = join(repoRoot, 'docs-site', 'docs', 'phases');
  let entries;
  try {
    entries = await readdir(phaseDir);
  } catch {
    return;
  }

  // Read sidebar_position for every phase doc so we can compare against items[] order.
  const phaseFiles = [];
  for (const entry of entries) {
    if (!entry.endsWith('.md')) continue;
    const phaseFile = join(phaseDir, entry);
    const phaseContent = await readFile(phaseFile, 'utf8');
    const fmMatch = phaseContent.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    const posMatch = fmMatch && fmMatch[1].match(/^sidebar_position:\s*(\d+)/m);
    phaseFiles.push({
      id: 'phases/' + entry.replace(/\.md$/, ''),
      pos: posMatch ? parseInt(posMatch[1], 10) : Infinity,
    });
  }
  phaseFiles.sort((a, b) => a.pos - b.pos);
  const orderedPhaseIds = phaseFiles.map(p => p.id);
  const fileSet = new Set(orderedPhaseIds);

  const itemsMatch = content.match(/label:\s*['"]The \w+ Phases['"][\s\S]*?items:\s*\[([\s\S]*?)\]/);
  if (!itemsMatch) {
    addFinding('error', 'sidebar-items', file, 1,
      `could not parse items[] array under the phases category`);
    return;
  }
  const itemIds = [...itemsMatch[1].matchAll(/['"]([^'"]+)['"]/g)].map(m => m[1]);
  const declaredSet = new Set(itemIds);

  // Duplicate items
  const seenIds = new Set();
  for (const id of itemIds) {
    if (seenIds.has(id)) {
      addFinding('error', 'sidebar-items', file, 1,
        `items[] lists "${id}" more than once`);
    }
    seenIds.add(id);
  }
  // Missing/extra
  for (const id of itemIds) {
    if (!fileSet.has(id)) {
      addFinding('error', 'sidebar-items', file, 1,
        `items[] references "${id}" but no docs-site/docs/${id}.md exists`);
    }
  }
  for (const id of orderedPhaseIds) {
    if (!declaredSet.has(id)) {
      addFinding('error', 'sidebar-items', file, 1,
        `docs-site/docs/${id}.md exists but is not listed in items[] under "The N Phases"`);
    }
  }
  // Order: items[] must match phase docs sorted by sidebar_position, ignoring missing/extra
  // (we only flag the relative order among items that exist on both sides).
  const sharedDeclared = itemIds.filter(id => fileSet.has(id));
  const sharedExpected = orderedPhaseIds.filter(id => declaredSet.has(id));
  for (let i = 0; i < Math.min(sharedDeclared.length, sharedExpected.length); i++) {
    if (sharedDeclared[i] !== sharedExpected[i]) {
      addFinding('error', 'sidebar-items', file, 1,
        `items[] order mismatch: position ${i + 1} is "${sharedDeclared[i]}" but sidebar_position says "${sharedExpected[i]}" should come there`);
      break; // a single message keeps the report readable
    }
  }
}

/* --------------------------------------------------------------------- *
 * Canonical state.json schema check (warns, doesn't fail CI)             *
 * --------------------------------------------------------------------- */

function stripJsoncComments(jsonc) {
  let out = '';
  let i = 0;
  let inString = false;
  let stringChar = null;
  while (i < jsonc.length) {
    const c = jsonc[i];
    const next = jsonc[i + 1];
    if (inString) {
      if (c === '\\' && i + 1 < jsonc.length) {
        out += c + next;
        i += 2;
        continue;
      }
      if (c === stringChar) {
        inString = false;
        stringChar = null;
      }
      out += c;
      i++;
    } else {
      if (c === '"' || c === "'") {
        inString = true;
        stringChar = c;
        out += c;
        i++;
        continue;
      }
      if (c === '/' && next === '/') {
        while (i < jsonc.length && jsonc[i] !== '\n') i++;
        continue;
      }
      if (c === '/' && next === '*') {
        i += 2;
        while (i + 1 < jsonc.length && !(jsonc[i] === '*' && jsonc[i + 1] === '/')) i++;
        i += 2;
        continue;
      }
      out += c;
      i++;
    }
  }
  return out;
}

async function loadCanonicalSchema() {
  const file = join(repoRoot, '.github', 'agents', 'vibe-engagement-lead.agent.md');
  const content = await readFile(file, 'utf8');
  // Marker phrase that anchors the schema block (sits right above it today).
  const markerIdx = content.indexOf('Initialize `state.json`');
  if (markerIdx === -1) {
    addFinding('warn', 'schema-load', file, 1,
      `could not locate the canonical state.json schema (looking for "Initialize \`state.json\`")`);
    return null;
  }
  const after = content.slice(markerIdx);
  const blockMatch = after.match(/```(?:jsonc|json)\s*\r?\n([\s\S]*?)\r?\n```/);
  if (!blockMatch) {
    addFinding('warn', 'schema-load', file, 1,
      `could not find a json/jsonc code block after the canonical-schema marker`);
    return null;
  }
  try {
    return JSON.parse(stripJsoncComments(blockMatch[1]));
  } catch (e) {
    addFinding('warn', 'schema-load', file, 1,
      `failed to parse canonical state.json schema: ${e.message}`);
    return null;
  }
}

function collectPrefixes(obj, prefix, prefixes) {
  if (obj === null || typeof obj !== 'object' || Array.isArray(obj)) return;
  for (const key of Object.keys(obj)) {
    const path = prefix ? `${prefix}.${key}` : key;
    prefixes.add(path);
    collectPrefixes(obj[key], path, prefixes);
  }
}

const TRAILING_KEYS_READINESS_FIELD = [
  'status', 'grade', 'path', 'lastUpdated', 'count', 'weeks',
  'public', 'm365', 'signedOffBy', 'stageCount', 'source', 'value',
];

/**
 * Returns the [start, end) character offsets of the canonical-schema code block
 * in vibe-engagement-lead.agent.md. Lines outside this range are still scanned
 * for state.json path drift — only the schema itself is exempt (it IS the
 * source of truth).
 */
function findCanonicalSchemaSpan(content) {
  const markerIdx = content.indexOf('Initialize `state.json`');
  if (markerIdx === -1) return null;
  const after = content.slice(markerIdx);
  const blockMatch = after.match(/```(?:jsonc|json)\s*\r?\n([\s\S]*?)\r?\n```/);
  if (!blockMatch) return null;
  const start = markerIdx + blockMatch.index;
  const end = start + blockMatch[0].length;
  return [start, end];
}

async function checkStateJsonRefs(files, schema) {
  if (!schema) return;
  const prefixes = new Set();
  collectPrefixes(schema, '', prefixes);
  prefixes.add('phases');
  prefixes.add('readiness');

  // Common trailing keys under every phases.<x> block. Allow hyphenated phase keys
  // like `phases.design-develop` (current schema) and any future kebab phase names.
  for (const p of [...prefixes].filter(x => /^phases\.[a-zA-Z][a-zA-Z0-9-]*$/.test(x))) {
    prefixes.add(`${p}.status`);
    prefixes.add(`${p}.artifacts`);
  }
  // Common trailing keys under every readiness.<phase>.<field>
  for (const p of [...prefixes].filter(x => /^readiness\.[a-zA-Z][a-zA-Z0-9-]*\.[a-zA-Z][a-zA-Z0-9-]*$/.test(x))) {
    for (const k of TRAILING_KEYS_READINESS_FIELD) {
      prefixes.add(`${p}.${k}`);
    }
  }

  // Pattern: optional `state.json.` prefix, then `(readiness|phases).<word>(.<word>){0,2}`.
  // Words may include hyphens (for kebab phase keys like `design-develop`).
  const regex = /\b(?:state\.json\.)?((?:readiness|phases)(?:\.[a-zA-Z][a-zA-Z0-9-]*){1,3})\b/g;

  const canonicalFile = join(repoRoot, '.github', 'agents', 'vibe-engagement-lead.agent.md');
  for (const file of files) {
    const content = await readFile(file, 'utf8');
    // For the engagement-lead file, exclude only the schema code block — the rest of
    // the file (migration logic, dashboards, gate language) is exactly where path
    // drift is most likely to bite, so we must scan it.
    let schemaSpan = null;
    if (file === canonicalFile) {
      schemaSpan = findCanonicalSchemaSpan(content);
    }
    const lines = content.split('\n');
    let offset = 0;
    for (let i = 0; i < lines.length; i++) {
      const lineStart = offset;
      const lineEnd = offset + lines[i].length + 1;
      offset = lineEnd;
      // Skip lines wholly inside the canonical schema span
      if (schemaSpan && lineStart >= schemaSpan[0] && lineEnd <= schemaSpan[1]) continue;
      regex.lastIndex = 0;
      let m;
      while ((m = regex.exec(lines[i])) !== null) {
        const path = m[1];
        if (!prefixes.has(path)) {
          addFinding('warn', 'state-path', file, i + 1,
            `references state.json path "${path}" which is not in the canonical schema (declared in .github/agents/vibe-engagement-lead.agent.md)`);
        }
      }
    }
  }
}

/* --------------------------------------------------------------------- *
 * Reference-doc inventory (warn)                                         *
 *                                                                        *
 * The docs-site has three reference indexes that humans browse to find   *
 * what exists. If a new agent/prompt/template is added but not listed    *
 * in the corresponding index, users will never find it.                  *
 *                                                                        *
 * - .github/prompts/<x>.prompt.md     → docs-site/docs/reference/prompts.md   must mention "/<x>"
 * - .github/agents/<x>.agent.md       → docs-site/docs/reference/agents.md    must mention "@VIBE <display>"
 * - templates/<x>.md                  → docs-site/docs/reference/templates.md must mention "<basename>"
 *                                                                        *
 * Warn-only so it doesn't block merges on docs lag, but flagged so       *
 * humans/AI agents notice the gap.                                       *
 * --------------------------------------------------------------------- */

async function checkReferenceDocCompleteness() {
  const tryRead = async (p) => {
    try { return await readFile(p, 'utf8'); } catch { return null; }
  };

  // Prompts
  const promptsRef = await tryRead(join(repoRoot, 'docs-site', 'docs', 'reference', 'prompts.md'));
  if (promptsRef !== null) {
    const dir = join(repoRoot, '.github', 'prompts');
    let entries = [];
    try { entries = await readdir(dir); } catch {}
    for (const entry of entries) {
      if (!entry.endsWith('.prompt.md')) continue;
      const slug = entry.replace(/\.prompt\.md$/, '');
      if (!promptsRef.includes(`/${slug}`)) {
        addFinding('warn', 'reference-docs',
          join(repoRoot, 'docs-site', 'docs', 'reference', 'prompts.md'), 1,
          `/${slug} exists at .github/prompts/${entry} but is not listed in reference/prompts.md`);
      }
    }
  }

  // Agents
  const agentsRef = await tryRead(join(repoRoot, 'docs-site', 'docs', 'reference', 'agents.md'));
  if (agentsRef !== null) {
    const dir = join(repoRoot, '.github', 'agents');
    let entries = [];
    try { entries = await readdir(dir); } catch {}
    for (const entry of entries) {
      if (!entry.endsWith('.agent.md')) continue;
      const file = join(dir, entry);
      const content = await readFile(file, 'utf8');
      const fmMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
      const nameMatch = fmMatch && fmMatch[1].match(/^name:\s*["']?(VIBE\s+[^"'\r\n]+?)["']?\s*$/m);
      if (!nameMatch) continue;
      const display = nameMatch[1].trim();
      if (!agentsRef.includes(`@${display}`)) {
        addFinding('warn', 'reference-docs',
          join(repoRoot, 'docs-site', 'docs', 'reference', 'agents.md'), 1,
          `@${display} exists at .github/agents/${entry} but is not listed in reference/agents.md`);
      }
    }
  }

  // Templates
  const templatesRef = await tryRead(join(repoRoot, 'docs-site', 'docs', 'reference', 'templates.md'));
  if (templatesRef !== null) {
    const dir = join(repoRoot, 'templates');
    let entries = [];
    try { entries = await readdir(dir); } catch {}
    for (const entry of entries) {
      if (!entry.endsWith('.md')) continue;
      if (!templatesRef.includes(entry)) {
        addFinding('warn', 'reference-docs',
          join(repoRoot, 'docs-site', 'docs', 'reference', 'templates.md'), 1,
          `templates/${entry} exists but is not listed in reference/templates.md`);
      }
    }
  }
}

/* --------------------------------------------------------------------- *
 * "N phases" prose count (warn)                                          *
 *                                                                        *
 * If someone updates docs-site/docs/phases/ to add/remove a page but     *
 * forgets to fix prose like "the four phases" in README or               *
 * copilot-instructions, the docs say one thing and the structure another.*
 * --------------------------------------------------------------------- */

async function checkPhaseCountProse(expectedPhaseCount) {
  const correctWord = COUNT_TO_WORD[expectedPhaseCount] ?? String(expectedPhaseCount);
  const filesToCheck = [
    'README.md',
    '.github/copilot-instructions.md',
    'docs-site/docs/why-vibe/process.md',
  ];
  const regex = /\b(four|five|six|seven|eight|nine|ten)\s+phases?\b/gi;
  for (const rel of filesToCheck) {
    const file = join(repoRoot, rel);
    let content;
    try { content = await readFile(file, 'utf8'); } catch { continue; }
    const lines = content.split('\n');
    lines.forEach((line, i) => {
      regex.lastIndex = 0;
      let m;
      while ((m = regex.exec(line)) !== null) {
        const word = m[1].toLowerCase();
        const count = NUMBER_WORDS[word];
        if (count !== expectedPhaseCount) {
          addFinding('warn', 'phase-count-prose', file, i + 1,
            `prose says "${m[0]}" but docs-site/docs/phases/ has ${expectedPhaseCount} pages — change to "${correctWord} phases"`);
        }
      }
    });
  }
}

/* --------------------------------------------------------------------- *
 * Reporting                                                              *
 * --------------------------------------------------------------------- */

function printReport() {
  if (findings.length === 0) {
    console.log('✓ All phase-consistency checks passed.');
    return 0;
  }

  // Grouped summary header — when ~50 findings stem from one rename, this
  // makes the root cause obvious at a glance ("missing prompt /vibe-define
  // referenced in 12 places").
  const missingTargets = new Map(); // key -> { kind, count }
  for (const f of findings) {
    let key = null, kind = null;
    let m;
    if (f.check === 'prompt-ref'   && (m = f.msg.match(/no such prompt "([^"]+)"/)))            { kind = 'prompt';   key = `/${m[1]}`; }
    else if (f.check === 'prompt-path' && (m = f.msg.match(/no such prompt file "([^"]+)"/)))   { kind = 'prompt-file'; key = m[1]; }
    else if (f.check === 'agent-ref'    && (m = f.msg.match(/references agent "VIBE ([^"]+)"/))){ kind = 'agent';    key = `@VIBE ${m[1]}`; }
    else if (f.check === 'agent-frontmatter' && (m = f.msg.match(/agent "VIBE ([^"]+)"/)))      { kind = 'agent';    key = `@VIBE ${m[1]}`; }
    else if (f.check === 'state-path'   && (m = f.msg.match(/path "([^"]+)"/)))                 { kind = 'state-path'; key = m[1]; }
    if (key) {
      const id = `${kind}::${key}`;
      missingTargets.set(id, { kind, key, count: (missingTargets.get(id)?.count ?? 0) + 1 });
    }
  }
  const grouped = [...missingTargets.values()].filter(g => g.count >= 2);
  if (grouped.length > 0) {
    grouped.sort((a, b) => b.count - a.count);
    console.log('\n=== Grouped summary ===');
    for (const g of grouped) {
      const noun = g.kind === 'prompt' ? 'prompt' :
                   g.kind === 'prompt-file' ? 'prompt file' :
                   g.kind === 'agent' ? 'agent' :
                   g.kind === 'state-path' ? 'state.json path' : g.kind;
      console.log(`  Missing ${noun} "${g.key}" referenced in ${g.count} places`);
    }
  }

  const byCheck = new Map();
  for (const f of findings) {
    if (!byCheck.has(f.check)) byCheck.set(f.check, []);
    byCheck.get(f.check).push(f);
  }

  const checkOrder = [
    'prompt-ref', 'prompt-path', 'agent-ref', 'agent-frontmatter',
    'sidebar-pos', 'sidebar-label', 'sidebar-items',
    'schema-load', 'state-path',
    'reference-docs', 'phase-count-prose',
  ];
  const orderedKeys = [
    ...checkOrder.filter(k => byCheck.has(k)),
    ...[...byCheck.keys()].filter(k => !checkOrder.includes(k)),
  ];

  for (const check of orderedKeys) {
    const items = byCheck.get(check);
    console.log(`\n— ${check} (${items.length}) —`);
    for (const item of items) {
      const sev = item.severity === 'error' ? 'ERROR' : 'WARN ';
      console.log(`  ${sev}  ${item.file}:${item.line}  ${item.msg}`);
    }
  }

  const errors = findings.filter(f => f.severity === 'error').length;
  const warnings = findings.filter(f => f.severity === 'warn').length;
  console.log(`\nSummary: ${errors} error(s), ${warnings} warning(s).`);
  if (errors > 0) {
    console.log('See .github/PHASE_CHANGE_PLAYBOOK.md for fix guidance.');
  }
  return errors > 0 ? 1 : 0;
}

/* --------------------------------------------------------------------- *
 * Main                                                                   *
 * --------------------------------------------------------------------- */

async function main() {
  const files = await collectScanFiles();
  const validPrompts = await listPromptFiles();
  const validAgents = await listAgentFiles();
  const schema = await loadCanonicalSchema();

  await checkPromptRefs(files, validPrompts);
  await checkPromptPathRefs(files, validPrompts);
  await checkAgentRefs(files, validAgents);
  await checkAgentFrontmatter(validAgents);
  const phaseCount = await checkSidebarPositions();
  await checkSidebarItems(phaseCount);
  await checkStateJsonRefs(files, schema);
  await checkReferenceDocCompleteness();
  await checkPhaseCountProse(phaseCount);

  return printReport();
}

main()
  .then(code => process.exit(code))
  .catch(err => {
    console.error('Unexpected error in phase-consistency checker:', err);
    process.exit(2);
  });
