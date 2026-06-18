# VIBE Web Surface (MVP)

A non-VS-Code surface for designers/PMs to drive a VIBE engagement. This first slice is the
**New Engagement** provisioning flow: a designer names an engagement and the surface creates a
private GitHub repository from the VIBE template — with the whole engine (agents, prompts,
templates) shipped inside it, ready to drive.

## Why it works this way

- **Runs as you (run-as-user).** Auth piggybacks on the GitHub CLI (`gh auth token`), so every
  action is performed under your own GitHub identity and Copilot seat — identical to using VS
  Code. No service account, no separate OAuth app for local use.
- **Git is the source of truth.** The surface stores only a local pointer
  (`surface/.engagements.json`, gitignored) mapping engagement → repo. Everything *about* the
  engagement lives in the engagement's own repo.
- **The engine travels with the repo.** Generating from the template copies `.github/`,
  `scripts/`, and `templates/` into the new repo, which is why later phases can run there.

## Prerequisites

- Node 18+ (uses built-in `fetch`; no `npm install` needed — zero dependencies).
- GitHub CLI authenticated: `gh auth status` should show you logged in with `repo` scope.
- *Optional — for Office/PDF source uploads:* Python 3.10+ with Microsoft
  [MarkItDown](https://github.com/microsoft/markitdown):
  `pip install "markitdown[docx,pptx,xlsx,pdf]"`. This lets designers drop Word,
  PowerPoint, Excel and PDF materials into the source bucket — the server converts
  them to Markdown at ingest (committing both the raw original and the extracted
  `.md` the engine cites). Without it the bucket still accepts `.md`/`.txt`/`.vtt`
  transcripts and pasted text; Office/PDF uploads return an actionable install hint.

## Run

```sh
node surface/server.mjs
# open http://localhost:4310
```

Optional environment overrides:

| Var | Default | Meaning |
|-----|---------|---------|
| `PORT` | `4310` | Port to serve on |
| `TEMPLATE_OWNER` | `ablack34` | Owner of the template repo |
| `TEMPLATE_REPO` | `vibe-prototyping-framework` | The template repo |
| `MARKITDOWN_PYTHON` | `python` | Python interpreter used to run MarkItDown for Office/PDF source conversion |

## What it does

1. You enter an engagement name (e.g. *Contoso Dispatcher AI*). The repo name is derived as a
   kebab slug (`contoso-dispatcher-ai`).
2. The backend calls `POST /repos/{template}/generate` to create the repo under the chosen owner.
3. It verifies the engine shipped (checks `.github/copilot-instructions.md` exists in the new repo).
4. It records the pointer and shows the repo with an **engine ✓** badge and a link.

## Scope (and what's next)

This is **M4 (provisioning)** of the MVP plan, pulled forward for end-to-end testing. Later
slices add: a read-only engagement dashboard (M1), running a phase step from the web via a
`run-phase.yml` workflow (M2), and review/approve writing sign-off into `gates.json` (M3).

> Note: for the MVP this tool lives inside the framework repo for convenience. Because
> generate-from-template copies everything, the `surface/` folder will also appear in generated
> engagement repos (harmless, unused there). Excluding it from the template is a later cleanup.
