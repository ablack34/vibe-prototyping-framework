# M365 Researcher — Paste This Prompt

> Open **M365 Copilot** at [https://m365.cloud.microsoft](https://m365.cloud.microsoft) → switch to the **Researcher** agent → paste the prompt below.
> When it returns, save the full output to `sources/research/m365-researcher-results.md` and re-run `/vibe-research` (or just talk to `@VIBE Preparation`) to synthesise it with the public-web research.
>
> *Demo fixture: would normally be produced by `/vibe-research` Path B for any engagement. This Contoso version is here so the demo flow can show the synthesis step.*

```
You are the Researcher agent inside M365 Copilot. I'm Priya Raman, a member of Studio 42 at Microsoft, preparing for a 4-week VIBE Prototyping engagement with Contoso Field Services (Sandra Holtz, COO). I need internal signal to complement public-web research I've already completed.

Please look across the following sources in my tenant:

- Outlook: emails to/from anyone with @contoso-field.example or @contoso.example over the last 18 months
- OneNote: my own notebooks plus any shared "Studio 42 — Customers" notebooks
- Teams: chats and prior meetings (including transcripts) mentioning "Contoso", "Sandra Holtz", "Matthias Köhler", or "Dispatcher"
- SharePoint: any documents in "Studio 42 — Customer Engagements" or "Studio 42 — Account Plans"
- Files I own: decks, proposals, contracts, SOWs related to Contoso

Return a structured response covering these seven sections. Cite every claim with the exact source name (email subject + date, OneNote page title, Teams chat name, SharePoint file name).

1. **Account-history timeline** — every touchpoint between Studio 42 and Contoso, dated.
2. **Previously-attempted projects** — anything Contoso has tried internally or with another vendor that's relevant to this engagement, including why those efforts ended.
3. **Internal advocates and detractors** — who at Contoso has championed Studio 42, who has pushed back, and why.
4. **Prior commitments** — anything Studio 42 has committed to Contoso (verbal or written) that's still outstanding.
5. **Sentiment trajectory** — the direction of the relationship over the last 6 months based on email and chat tone.
6. **Pricing / commercial constraints in flight** — any active commercial negotiation that affects scoping (e.g. conversion clauses, procurement freezes, allocated budget).
7. **Things the public web can't see** — anything else that should inform the engagement (internal feuds, hidden landmines, knowledge that lives on someone's USB stick, etc.).

If you can't find evidence for a section, say so explicitly — don't invent. Tell me where you looked.

Aim for ~4-6 pages of output. Don't summarise into a single page; I need the granularity to feed back into our customer brief.
```

After running this prompt in M365 Copilot, save the response verbatim to `sources/research/m365-researcher-results.md`. The Preparation agent will pick it up automatically next time you talk to it.
