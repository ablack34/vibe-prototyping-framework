---
description: "Crawl the Microsoft 365 tenant via work-iq for everything related to an engagement, then produce a reviewable source inventory the user curates into sources/"
agent: "VIBE Preparation"
argument-hint: "[engagement=...] [customer=...] [participants=...] [dateRange=...]"
---

# VIBE Collate — M365 Source Inventory

Crawl the user's Microsoft 365 tenant with the **work-iq** `ask_work_iq` tool to find every artifact related to an engagement — meetings, Teams chats, files (decks, docs, OneNote, Loop), and emails — then hand back a **reviewable inventory** the user curates into `sources/`.

This is a **discovery helper, not an auto-ingest**. It produces a shopping list. The user decides what actually lands in `sources/`; the existing `@VIBE Preparation` (source ingest) and `@VIBE Discover` (source-first read) pick up whatever gets added.

Unlike `/vibe-research`, which produces *synthesised intelligence* (account history, sentiment, commercial constraints), `/vibe-collate` finds the *actual artifacts*. The two are complementary — collate feeds the `existingDocs` and `priorTranscripts` readiness fields; research feeds `customerResearch`.

> **Real-tenant only.** This prompt queries live M365 data, so it does nothing in `/vibe-demo` mode (the Tailwind Traders fixture is fictional and won't match anything in the tenant). Skip it for demos.

## Inputs

- `${input:engagement}`: (Optional) Engagement name. Auto-detected from `state.json` / the `engagement/` folder if omitted.
- `${input:customer}`: (Optional) Customer or project name to anchor the crawl. Infer from `engagement-brief.md` + `customer-brief.md` if omitted.
- `${input:participants}`: (Optional) Comma-separated key people (e.g. `"Gerry McIvor, Maria Knudsen"`). Sharpens recall on poorly-named meetings and chats. Pull from the briefs / `state.json` registered meetings if omitted.
- `${input:dateRange}`: (Optional) Rough window (e.g. `"August–September 2026"`). Narrows the crawl and saves budget.

## What this produces

| File | Path | Committed? | Content |
|---|---|---|---|
| Source inventory | `.copilot-tracking/vibe/{{engagement-kebab}}/m365-source-inventory.md` | **No (gitignored)** | The full manifest — every discovered item with links, access level, and ingest route |
| Captured sources | `sources/m365/*.md` | Yes (committed + pushed) | The items the user ticked — full text where work-iq can read it (emails, recaps, chats), plus link-bearing **reference stubs** for downloads/transcripts. Committed and pushed so they appear in the web surface's Sources panel. |

The **inventory is deliberately gitignored** — it exposes internal email subjects, colleague names, and private OneDrive/SharePoint URLs. Only the curated content the user promotes into `sources/m365/` gets committed.

## Guardrails (read first)

- **Query budget** — work-iq allows ~30 queries per session. This prompt is designed to spend **1 discovery query + N capture queries** (only for ticked full-content items). Track the count; warn at 20 and 25; never loop unbounded.
- **Data sensitivity** — tenant results may contain PII, customer-confidential, or commercially-sensitive material. Display the sensitivity notice (below) before the first query. The inventory lands in gitignored `.copilot-tracking/`; nothing is transmitted anywhere.
- **Consent** — first use of work-iq needs EULA acceptance and an M365 sign-in. This requires explicit user confirmation and cannot be auto-triggered.

## Requirements

### Step 0 — Availability, consent, and fallback

1. Display the **Data Sensitivity Notice**:

   > **Data Sensitivity Notice**: This step queries your Microsoft 365 account (emails, meetings, chats, files) via work-iq. Results may contain customer-confidential information, PII, or proprietary data. The source inventory is written to `.copilot-tracking/` (gitignored) and exists unencrypted on disk. Verify your usage complies with your organisation's data-handling policies. Delete the inventory after the engagement concludes.

2. Check the work-iq `ask_work_iq` tool is available (`mcp_workiq_ask_work_iq` in Copilot Chat, `ask_work_iq` in Copilot CLI). If it isn't:

   > **work-iq isn't available in this environment.** Falling back to the paste-back path — run `/vibe-research` to generate `sources/research/m365-researcher-prompt.md`, run it in M365 Copilot's Researcher agent, and save the result. That path finds the same tenant signal without a live tool.

   Stop here and route the user to `/vibe-research`.

3. If work-iq needs the EULA accepted (`mcp_workiq_accept_eula` / `accept_eula`), ask the user to confirm, then accept the EULA at `https://github.com/microsoft/work-iq` before continuing.

### Step 1 — Frame the crawl scope

Read `engagement/{{engagement-kebab}}/engagement-brief.md` and `customer-brief.md` (and `state.json` for pre-registered meetings). Assemble the scope:

- **Customer / project name** and any known **aliases** (e.g. "Resource 360" ↔ "RM 360")
- **Key participants** (names improve recall dramatically on generically-named meetings)
- **Date window**
- **Known artifact names** already referenced in the briefs (so you can confirm them)

If the customer name and at least one participant OR a date window can't be established, ask **one** targeted question to get the strongest available signal before crawling. Don't crawl on the customer name alone — recall will be poor.

### Step 2 — Pass 1: Discovery crawl (one query)

Run a **single** `ask_work_iq` query using the multi-signal scope from Step 1. Use this template, substituting real values:

```
Find everything in my Microsoft 365 related to "{{project + aliases}}" — including emails,
Teams chats, Teams meetings, and files (decks, documents, OneNote pages, Loop, notes) — that
involve {{participants}}, around {{dateRange}}. For each item, list: (1) type
(email / chat / meeting / file), (2) title or subject, (3) date, (4) people involved, and
(5) a link or exact location (SharePoint/OneDrive URL, mailbox, or Teams channel). Also tell
me, for each item, whether you can access its full content or only a reference/summary. Group
the results by type and end with an access-summary table.
```

work-iq returns a grouped, cited inventory with a per-item **content-access level** and an access-summary table. That access level is the key signal for routing in Step 3.

### Step 3 — Normalise into the inventory + present for selection

Transform the work-iq response into a stable manifest and write it to `.copilot-tracking/vibe/{{engagement-kebab}}/m365-source-inventory.md`. **Collapse version families** — if five near-identical `Deck_v1..v5.pptx` are returned, show one row for the family and mark the latest as the pick, so the user doesn't ingest five copies.

Map each item's work-iq access level to an ingest route:

| work-iq access level | Typical items | Route |
|---|---|---|
| **Full content available** | emails, meeting recaps | 📝 **capture** — pull inline in Pass 2 |
| **Full transcript available** | transcribed meetings, recordings | 🎙️ **transcript** — hand to `@VIBE Transcript Analyst` / `/vibe-transcript` (don't re-capture) |
| **Partial / truncated preview** | Loop docs, PowerPoint decks | ⬇️ **download** — user opens the link and saves the file to `sources/` |
| **Reference / snippet only** | Teams chats, shared file links | ⬇️ **download** — user opens in Teams / downloads |

Manifest schema (one row per item / version-family):

```markdown
# M365 Source Inventory — {{Customer}} / {{Engagement}}

> Source: work-iq (`ask_work_iq`). Crawled: {{ISO date}}. Scope: {{participants}} · {{dateRange}}.
> ⚠️ Gitignored — contains internal subjects, names, and private URLs. Do not commit. Delete after the engagement.

| # | Type | Title | Date | People | Access | Route | Suggested target | Link |
|---|------|-------|------|--------|--------|-------|------------------|------|
| 1 | Meeting | Hackathon Winners: Resource 360 | 2 Sep 2026 | Gerry, Maria, Seán | Full transcript | 🎙️ transcript | `/vibe-transcript` | <url> |
| 2 | File | Resource_360_Ongoing_Story (×5) | 3 Sep 2026 | Adam Black | Partial | ⬇️ download (latest) | `sources/decks/` | <url> |
| 3 | Email | Shawna added you to the team! | 2 Sep 2026 | Shawna, Adam | Full | 📝 capture | `sources/m365/` | <url> |
```

Then present the list to the user in chat as a numbered set grouped by route, and ask them to select which items to bring in — for example:

> Reply with the numbers to capture/queue (e.g. `3, 4, 7`), `all-emails`, `all-transcripts`, or `none`. 📝 items I'll pull in automatically; ⬇️ items you'll download from the link; 🎙️ items I'll hand to the Transcript Analyst.

### Step 4 — Pass 2: Act on the user's selection

Every selected item lands as a file under `sources/m365/` — its full text where work-iq can read it, or a **reference stub** carrying the link where it can't. That way each item appears in the engagement's Sources list (the web surface included) as either a ready-to-read source or a one-click link to open, download, and upload.

For each selected item, by route:

- **📝 capture** — run one `ask_work_iq` follow-up per item (batch where possible) to pull the full content (email body, meeting recap, chat thread), and write it to `sources/m365/<date>-<slug>.md` with a provenance header (`> Captured from work-iq: <title> · <date> · <link>`) followed by the content. Count each pull against the budget.
- **⬇️ download** (partial / reference / snippet) — **don't** pull bytes. Write a short **reference stub** to `sources/m365/<date>-<slug>.md`: the same provenance header, then a `> ⬇️ Not captured inline — open the link above, download the file, and add it here.` note. The stub makes the item and its link visible in the Sources list.
- **🎙️ transcript** — write a stub the same way, with a `> 🎙️ Transcript available — open the link, then run /vibe-transcript to extract it.` note. Don't re-capture it here; `/vibe-transcript` (or `@VIBE Transcript Analyst`) does the tier-weighted extraction.

Never attempt to download raw binary files (`.pptx`, `.mp4`, `.loop`) programmatically — work-iq returns references/links, not file bytes. Capturing is for text content work-iq can already read; everything else becomes a link-bearing stub.

### Step 4b — Drop the sources into the engagement (so the surface shows them)

The hosted VIBE **web surface** reads sources straight from the engagement repo — it can't run work-iq itself (that needs your live M365 sign-in, which only exists here in the Copilot CLI). So once Step 4 has written the `sources/m365/*.md` files, **commit and push them** so they show up there automatically:

- Stage only the new/updated files under `sources/m365/` — never the gitignored inventory in `.copilot-tracking/`.
- Commit with a clear message, e.g. `collate: add N M365 sources for {{engagement}}`.
- Push to the branch the surface reads (the repo default, usually `main`).

They then appear in the surface's **Sources** panel with no paste-back, JSON, or sign-in — full captures as readable sources, link-only items as stubs with their download link. If the push fails (no write access or offline), say so and leave the files committed locally so the user can push manually; CLI-based Discover reads them either way.

### Step 5 — Update readiness + provenance

- Bump `readiness.preparation.existingDocs` to reflect newly-captured/queued customer docs (grade per the Preparation rubric — 3+ docs = A, 1–2 = B).
- If transcripts were surfaced, note them against `readiness.preparation.priorTranscripts` (they only count as *processed* once `/vibe-transcript` runs).
- Leave a one-line provenance note in your reply summarising how many items were found, captured, queued for download, and routed to transcript.

Do **not** invent new `state.json` fields — `/vibe-collate` feeds the existing Preparation readiness fields; it is not itself a gated deliverable.

### Step 6 — Recommend the next step

- If items were captured/queued: `👉 NEXT: The collated items now show in your Sources list (and the web surface). Open the ⬇️ link-only ones, download them, and add them; then click "🛠 Begin Preparation" (or "📥 Capture Customer Brief") so I fold the new sources into the briefs. Run "🎙️ Process Transcript" for any meetings.`
- If transcripts dominate: `👉 NEXT: Click "🎙️ Process Transcript" — the strongest signal is in the recorded meetings.`
- If nothing relevant was found: `👉 NEXT: Widen the scope (add participant names or a broader date window) and re-run /vibe-collate, or run /vibe-research for public + paste-back tenant signal.`

## Notes

- **Re-running is safe.** The inventory is rewritten with a fresh crawl date each run; captured `sources/m365/` files are additive.
- **Budget-aware.** One discovery query covers most engagements. Only capture the items the user actually wants. Warn as you approach the ~30-query cap; if you hit it, tell the user to start a fresh session.
- **No file bytes.** work-iq surfaces references and links, plus text it can already read. Binary artifacts (decks, recordings) are always a user download, never an automated pull.
- **Complements, doesn't replace, `/vibe-research`.** Collate = "what artifacts exist?". Research = "what do they tell us?". Run both in Preparation.
