# VIBE Docs Site

The Docusaurus source for the canonical VIBE Prototyping documentation. Everything user-facing lives here — root `README.md` and `docs/README.md` just point at this site.

## Run locally

```powershell
cd docs-site
npm install
npm run start
```

Then open <http://localhost:3000>. Edits to `docs/` hot-reload.

## Build

```powershell
npm run build
```

Static output lands in `docs-site/build/`.

## Where to edit what

| You want to change… | Edit… |
|---------------------|-------|
| Landing page | [`docs/index.mdx`](docs/index.mdx) |
| One-time setup guide | [`docs/getting-started/setup.md`](docs/getting-started/setup.md) |
| Step-by-step engagement walkthrough | [`docs/getting-started/first-engagement.md`](docs/getting-started/first-engagement.md) |
| "What to expect" phase-by-phase demo output | [`docs/getting-started/walkthrough.md`](docs/getting-started/walkthrough.md) |
| Role guides (TPM / Engineer / Account team) | [`docs/getting-started/roles.md`](docs/getting-started/roles.md) |
| Per-phase deep-dive content | [`docs/phases/*.md`](docs/phases/) |
| Prompt reference | [`docs/reference/prompts.md`](docs/reference/prompts.md) |
| Agent reference | [`docs/reference/agents.md`](docs/reference/agents.md) |
| MCP setup | [`docs/reference/mcp.md`](docs/reference/mcp.md) |
| Troubleshooting | [`docs/reference/troubleshooting.md`](docs/reference/troubleshooting.md) |
| Leadership/ROI/case studies | [`docs/why-vibe/*.md`](docs/why-vibe/) |
| Visual styling / landing-page CSS | [`src/css/custom.css`](src/css/custom.css) |
| Navigation order | [`sidebars.ts`](sidebars.ts) |
| Site config (title, repo URL, footer) | [`docusaurus.config.ts`](docusaurus.config.ts) |

## Deploying

The site isn't auto-deployed today — preview with `npm run start` locally, or `npm run build` and serve `build/` from any static host. If you wire this up to GitHub Pages or SWA in future, document the steps here.

## Conventions

- Pages are plain Markdown (`.md`) except the landing which is `.mdx` so it can use React components for the styled hero/cards.
- Every page has YAML frontmatter with `sidebar_position` and `title`. Without these, Docusaurus orders pages alphabetically.
- Internal links should be **slug-based** (e.g. `/getting-started/setup`) so they survive file moves; absolute file-path links (`docs/getting-started/setup.md`) only work in raw GitHub view.
- The framework's principles ("delivery person facilitates, AI does the paperwork", "engineer chooses form factor at Build", etc.) are repeated across pages on purpose — readers don't read sequentially.
