# Contributing to the VIBE Prototyping Framework

Thanks for wanting to improve the framework — every fix and enhancement benefits the next engagement.

This repo is the **template** that every engagement repo is created from. Changes here propagate to *all future engagements*, so we keep the bar high.

## Where to Make Changes

| You want to… | Edit… |
|--------------|-------|
| Fix a prompt's behaviour | [`.github/prompts/vibe-<name>.prompt.md`](.github/prompts/) |
| Change how an agent responds | [`.github/agents/vibe-<name>.agent.md`](.github/agents/) |
| Tweak the global agent rules | [`.github/copilot-instructions.md`](.github/copilot-instructions.md) |
| Improve user-facing docs | [`docs-site/docs/`](docs-site/docs/) |
| Update the scaffold templates | [`scaffold/`](scaffold/) |
| Adjust the Contoso demo fixture | [`demo/contoso/`](demo/contoso/) |
| Add an MCP server pre-config | [`.vscode/mcp.json`](.vscode/mcp.json) |

## Quality Bar

Before opening a PR, your change should pass these:

1. **A real engagement could use it.** No theoretical features. If a change doesn't help a delivery squad get from kickoff to handoff faster or with less confusion, it doesn't belong here.
2. **Form-factor neutral.** The framework supports web app, conversational, agentic, Copilot extension, and low-code prototypes. Anything that hard-codes a single form factor needs a clear reason and a fallback for other paths.
3. **All technology stays Microsoft.** Azure, M365, Power Platform, GitHub. No third-party hosting, no non-Microsoft AI services.
4. **Prompts produce documents, not input forms.** Agents read sources and generate documents. They don't ask the user to fill in templates by hand.
5. **Every agent response ends with `👉 NEXT:`.** Non-technical users navigate by clicking buttons; the framework must always tell them which one to click.
6. **Docs site stays canonical.** If you add user-facing content, it goes in [`docs-site/docs/`](docs-site/docs/), not in the root README or the `docs/` folder.

## How to Test a Change

Three reliable ways:

1. **Demo loop** — In a fresh engagement repo created from this template, run `/vibe-demo` then walk through whichever phase you touched. You should see realistic output.
2. **Doctor sweep** — `/vibe-doctor` should still pass on a fresh `/vibe-demo` engagement. If your change introduces a new artifact, add a check for it.
3. **Prompt test** — Open the modified `.prompt.md` and ask Copilot Chat in Agent mode to follow it literally against the Contoso demo fixture. The output should make sense without any context outside the engagement repo.

## Pull Request Checklist

- [ ] Change has a clear "why" in the PR description (which friction point did you remove?)
- [ ] If you added or renamed a prompt: registered in [`docs-site/docs/reference/prompts.md`](docs-site/docs/reference/prompts.md) and [`.github/copilot-instructions.md`](.github/copilot-instructions.md)
- [ ] If you added or renamed an agent: registered in [`docs-site/docs/reference/agents.md`](docs-site/docs/reference/agents.md)
- [ ] If you added a template: documented in [`docs-site/docs/reference/templates.md`](docs-site/docs/reference/templates.md)
- [ ] If you changed the deploy or scaffold story: [`docs-site/docs/getting-started/walkthrough.md`](docs-site/docs/getting-started/walkthrough.md) still describes reality
- [ ] No hard-coded customer names, no real PII, no internal-only links in user-facing docs
- [ ] No new MCP servers without a justification (each one adds onboarding friction)

## Reporting Issues

Open a GitHub issue with:

- The engagement phase you were in when you hit the issue
- What you typed (the exact prompt or button)
- What you expected vs what happened
- A snippet from `engagement/<name>/state.json` if relevant

If you can reproduce it with `/vibe-demo` against the Contoso fixture, that's the fastest path to a fix.

## License

By contributing you agree your contributions are licensed under the [MIT License](LICENSE) included in this repo.
