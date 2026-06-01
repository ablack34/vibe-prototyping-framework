# VIBE Prototyping Framework

> Accelerating presales with AI prototyping to unlock business potential at speed.

A GitHub template repo for **Studio 42 VIBE Prototyping** engagements. Guides a delivery team (typically one TPM/designer and one engineer) through six phases — Preparation → Discover → Define → Ideate → Build → Deliver — using AI agents in VS Code that tell you exactly what to do next.

**You don't need to be technical, you just need a +1.**

---

## Start a New Engagement

1. Click **"Use this template" → "Create a new repository"** at the top of this page.
2. Name it `<customer>-<engagement>` (e.g. `contoso-field-scheduling`), make it private, and clone it locally.
3. Open in VS Code, open Copilot Chat (`Ctrl+Shift+I`), switch to **Agent mode**, and run:

   ```
   /vibe-kickoff customer="<your-customer>" problem="<describe the problem>"
   ```

4. After every step the agent ends with a `👉 NEXT:` directive. **Click the recommended button and keep going.** If you're ever lost, click **❓ What's Next?**.

> Already inside another engagement? Run `/vibe-new customer="…" engagement="…"` and it'll `gh repo create` a sibling for you.

---

## Where to Read More

| What you want | Where to look |
|---------------|---------------|
| Full walkthrough, role guides, phase deep-dives, prompt/agent reference | **The docs site** — `cd docs-site && npm install && npm run start`, then open `http://localhost:3000`. Or browse the source under [`docs-site/docs/`](docs-site/docs/). |
| First-time machine setup | [`docs-site/docs/getting-started/setup.md`](docs-site/docs/getting-started/setup.md) |
| Step-by-step engagement walkthrough | [`docs-site/docs/getting-started/first-engagement.md`](docs-site/docs/getting-started/first-engagement.md) |
| What each phase actually looks like (run against the demo) | [`docs-site/docs/getting-started/walkthrough.md`](docs-site/docs/getting-started/walkthrough.md) |
| MCP servers + troubleshooting | [`docs-site/docs/reference/mcp.md`](docs-site/docs/reference/mcp.md) · [`docs-site/docs/reference/troubleshooting.md`](docs-site/docs/reference/troubleshooting.md) |

---

## The Prompts You Actually Need

| When | Type This | What Happens |
|------|-----------|-------------|
| **Start** | `/vibe-kickoff` | Creates the engagement, both briefs (S42-internal + customer voice), and the full 4-week meeting schedule |
| **During Prep** | `/vibe-research` | Dual-path deep customer research — public web (auto, in-CLI) plus a ready-to-paste prompt for M365 Copilot's Researcher agent |
| **Send forms** | `/vibe-questionnaire` | M365 Copilot prompts for the account-team and customer questionnaires |
| **After meetings** | `/vibe-transcript` | Extracts context from Teams recordings automatically |
| **After discovery** | `/vibe-ideate` | 2-3 AI-powered prototype concepts across form factors |
| **Share it** | `/vibe-deploy` | Form-factor-aware deployment guidance for the engineer |
| **Wrap up** | `/vibe-handoff` | Step-by-step handoff: vision → roadmap → backlog → limitations |

Full list with inputs and outputs: [`docs-site/docs/reference/prompts.md`](docs-site/docs/reference/prompts.md).

---

## Try Without a Customer

You can run a full engagement end-to-end against a fixture customer before doing it for real. After creating a fresh engagement repo from this template, in Copilot Chat run:

```
/vibe-demo
```

This seeds [`sources/`](sources/) and [`templates/PROJECT-CONTEXT.md`](templates/PROJECT-CONTEXT.md) with the **Contoso Field Services — Dispatcher AI** fixture (customer brief, questionnaire responses, two Teams transcripts, three CSVs). From there `@VIBE Discover`, `@VIBE Define`, `/vibe-ideate` and `/vibe-handoff` all have real source material to work on — you can see each phase fire in 1–5 minutes. The fixture lives in [`demo/contoso/`](demo/contoso/).

---

## Prerequisites

| Tool | Required For | Who Needs It |
|------|-------------|--------------|
| VS Code + GitHub Copilot | Everything | Everyone |
| [HVE-Core extension](https://marketplace.visualstudio.com/items?itemName=ise-hve-essentials.hve-core-all) v3.2+ | Agents and prompts | Everyone |
| GitHub CLI (`gh`) | `/vibe-new` to spin up sibling engagement repos | Optional |
| Node.js 22+, .NET 9 SDK, Azure CLI | Building / deploying web-app form factors | Engineers only |

**MCP servers** (Teams transcripts, GitHub, Azure DevOps, Azure AI Foundry) are pre-configured in `.vscode/mcp.json`. Enable them via the 🔧 icon in Copilot Chat on first use.

---

## How This Repo Works

This is a **GitHub Template Repository**. You don't work in it directly — each engagement gets its own repo from the **Use this template** button above. Only the framework maintainer modifies this repo; improvements benefit all future engagements.

Shared artifacts a team generates during an engagement live under `engagement/<engagement-name>/` (committed). Per-user phase state lives under `.copilot-tracking/vibe/<engagement-name>/state.json` (gitignored — each teammate regenerates their own).

---

*Studio 42 — Microsoft Internal*
