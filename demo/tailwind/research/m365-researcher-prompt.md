# M365 Researcher — Paste This Prompt

> Open **M365 Copilot** at [https://m365.cloud.microsoft](https://m365.cloud.microsoft) → switch to the **Researcher** agent → paste the prompt below.
> When it returns, save the full output to `sources/research/m365-researcher-results.md` and re-run `/vibe-research` (or just talk to `@VIBE Preparation`) to synthesise it with the public-web research.
>
> *Demo fixture: would normally be produced by `/vibe-research` Path B for any engagement. This Tailwind Traders version is here so the demo flow can show the synthesis step.*

```
You are the Researcher agent inside M365 Copilot. I'm Tom Bryce, the Microsoft UKI account lead working with Studio 42, preparing for a 4-week VIBE Prototyping engagement with Tailwind Traders (Elena Marsh, Director, Digital Customer Experience). I need internal signal to complement public-web research I've already completed.

Please look across the following sources in my tenant:

- Outlook: emails to/from anyone with @tailwindtraders.example or @tailwind.example over the last 18 months
- OneNote: my own notebooks plus any shared "Studio 42 — Customers" notebooks
- Teams: chats and prior meetings (including transcripts) mentioning "Tailwind Traders", "Returns Assist AI", "Elena Marsh", "Claire Donovan", "Dev Patel", "Raj Singh", "Maya Okafor", "ReturnDesk", or "returns"
- SharePoint: any documents in "Studio 42 — Customer Engagements" or "Studio 42 — Account Plans"
- Files I own: decks, proposals, contracts, SOWs related to Tailwind Traders, OPP-UKI-2026-07731, or Returns Assist AI

Return a structured response covering these seven sections. Cite every claim with the exact source name (email subject + date, OneNote page title, Teams chat name, SharePoint file name).

1. **Account-history timeline** — every touchpoint between Studio 42 and Tailwind Traders, dated.
2. **Previously-attempted projects** — anything Tailwind has tried internally or with another vendor that's relevant to the returns/refunds problem, including why those efforts ended.
3. **Internal advocates and detractors** — who at Tailwind has championed Studio 42, who has pushed back, and why. Cover Elena Marsh, Claire Donovan, Dev Patel, Raj Singh, and Maya Okafor specifically.
4. **Prior commitments** — anything Studio 42 has committed to Tailwind (verbal or written) that's still outstanding.
5. **Sentiment trajectory** — the direction of the relationship over the last 6 months based on email and chat tone.
6. **Pricing / commercial constraints in flight** — any active commercial negotiation that affects scoping, including the £3.2M ACV opportunity, Year 1 £1.1M, the £2.3M leakage estimate, peak-season returns, board-evidence timing, and allocated budget.
7. **Things the public web can't see** — anything else that should inform the engagement: the 22-agent ReturnDesk operation, ReturnDesk being purchased in 2012, the 18% return rate / 19,000 returns per month, 9-day refund cycle, returns NPS −12, 41% Other reason coding, 30% disposition errors, ~£14M returns cost, ~£5–6M addressable value, peak-season queues, adoption concerns, data availability, or hidden landmines.

If you can't find evidence for a section, say so explicitly — don't invent. Tell me where you looked.

Aim for ~4-6 pages of output. Don't summarise into a single page; I need the granularity to feed back into our customer brief.
```

After running this prompt in M365 Copilot, save the response verbatim to `sources/research/m365-researcher-results.md`. The Preparation agent will pick it up automatically next time you talk to it.
