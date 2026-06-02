# VIBE Prototyping Framework

> Accelerating presales with AI prototyping to unlock business potential at speed.

A GitHub template repo for **Studio 42 VIBE Prototyping** engagements. Guides a delivery team (typically one TPM/designer and one engineer) through a structured workflow — **Preparation → Discover → Disrupt → Build → Deliver** — using AI agents in VS Code that tell you exactly what to do next.

**You don't need to be technical, you just need a +1.**

> **Two surfaces:** the full framework lives in **VS Code** (primary). Non-technical teammates can run Discover, Disrupt, and Deliver review from the **M365 Copilot Notebook** (companion) using three approved agents (Researcher, Analyst, Teams Facilitator). Both surfaces share the same `engagement/{kebab}/` folder via git.

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
| **Before Disrupt workshop** | `/vibe-workshop-agenda` + `/vibe-concepts` | The facilitator agenda anchored to Discover findings, plus 2-3 candidate concepts + Spark prompts for the workshop |
| **After Disrupt workshop** | `/vibe-workshop-record`, `/vibe-selected-concept`, `/vibe-storyboard`, `/vibe-future-journey` | Capture the workshop, record the chosen concept, produce the storyboard the engineer reads |
| **Share it** | `/vibe-deploy` | Form-factor-aware deployment guidance for the engineer |
| **Wrap up** | `/vibe-handoff` | Step-by-step handoff: vision → roadmap → backlog → limitations |

Full list with inputs and outputs: [`docs-site/docs/reference/prompts.md`](docs-site/docs/reference/prompts.md).

---

## Try Without a Customer

You can run a full engagement end-to-end against a fixture customer before doing it for real. After creating a fresh engagement repo from this template, in Copilot Chat run:

```
/vibe-demo
```

This seeds [`sources/`](sources/) with the **Contoso Field Services — Dispatcher AI** fixture (customer brief, questionnaire responses, two Teams transcripts, three CSVs) and creates `engagement/contoso-dispatcher-ai/` with a filled `PROJECT-CONTEXT.md` plus a populated `customer-brief.md` and a blank-scaffold `engagement-brief.md` (so `@VIBE Preparation` has real work to do). The three Discover deliverables (personas, problem statement, current-state journey) are **not** pre-seeded — they're generated fresh when you run `@VIBE Discover` so you can see the agent actually work. From there `@VIBE Discover`, `@VIBE Disrupt`, and `/vibe-handoff` all have real source material to work on — you can see each phase fire in 1–5 minutes. The fixture lives in [`demo/contoso/`](demo/contoso/).

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

> **Maintainers:** read [`.github/PHASE_CHANGE_PLAYBOOK.md`](.github/PHASE_CHANGE_PLAYBOOK.md) before adding, renaming, or restructuring a phase. CI runs `scripts/check-phase-consistency.mjs` on every PR to catch broken prompt/agent references, drifted sidebar positions, and `state.json` paths that don't match the canonical schema.

---

*Studio 42 — Microsoft Internal*
