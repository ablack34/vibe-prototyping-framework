# Meeting Transcript — [VIBE] Contoso Field Services — Kickoff

> Fixture transcript representing what `/vibe-transcript` would pull from work-iq for a real kickoff call. Formatted as Teams transcript export.

**Meeting:** [VIBE] Contoso Field Services — Kickoff
**Date:** 2025-02-10
**Duration:** 52 min
**Recording:** Recorded · Transcript available

**Participants:**
- Sandra Holtz (Contoso, COO) — sponsor
- Matthias Köhler (Contoso, Director Operations Tech)
- Bartosz Nowak (Contoso, Senior Dispatcher, Warsaw)
- Priya Raman (Microsoft, Account Executive)
- Adam Black (Microsoft, S42 Engagement Lead)
- Lena Friedrich (Microsoft, S42 Engineer)

---

**[00:00:14] Priya Raman:** Thanks everyone for joining. Quick agenda — Adam will walk you through how Studio 42 works, then we want to genuinely understand the problem from Sandra and Bartosz, then we'll talk about what the next four weeks looks like. Sound good?

**[00:00:38] Sandra Holtz:** Yes — we're keen to keep this tight. We've already filled in the questionnaire so hopefully we don't repeat ourselves too much.

**[00:00:52] Adam Black:** Read every word, thank you for that. Won't make you repeat the basics. I want to spend most of the hour on the operational reality — what actually happens at 9am on a Tuesday in Warsaw when 50 work orders land at once.

**[00:01:21] Bartosz Nowak:** [laughs] You picked the right day. Tuesdays are the worst because we're catching up from weekend emergencies.

**[00:01:45] Adam Black:** Tell me about a typical hard case from this week. Walk me through one.

**[00:02:08] Bartosz Nowak:** OK — yesterday. A Carrefour distribution centre near Lyon, freezer unit down, Platinum contract so 2-hour response window. We had three certified refrigerant techs in driving range. One was finishing another job, ETA unknown. Second was certified but a junior — never worked alone on that model. Third was 90 minutes away in traffic.

**[00:02:42] Adam Black:** What did you do?

**[00:02:46] Bartosz Nowak:** Phoned the senior tech, he said "give me 40 minutes." That meant the SLA window was going to be 2h10. So I called the customer, warned them, offered a 10% credit on their next invoice. They accepted. We technically breached but didn't lose the relationship.

**[00:03:25] Adam Black:** Sandra, how often does that scenario play out?

**[00:03:32] Sandra Holtz:** Honestly? Probably 30-40 times a week across the network. We breach maybe a quarter of those formally. The rest, we eat the cost informally — discounts, free callouts, that kind of thing.

**[00:04:04] Adam Black:** So the breach number on your books is the tip of an iceberg.

**[00:04:11] Sandra Holtz:** Yes. The real number is higher. Maybe €5-6M when you include the soft costs, not €4M.

**[00:04:28] Lena Friedrich:** Bartosz, in that Lyon example — if a system had told you 45 minutes earlier "by the way, you're likely to breach this," what would you have done differently?

**[00:04:48] Bartosz Nowak:** I would have phoned the customer earlier. Customers don't mind being told something's slipping if you tell them in time. They hate being surprised. That alone would save half my arguments.

**[00:05:23] Adam Black:** Interesting. So even before we get to "auto-assign the right tech," there's massive value in just "flag the risk early."

**[00:05:39] Sandra Holtz:** Yes. Yes. We've been so focused on the assignment optimisation that we forgot to ask if there's a simpler first win.

**[00:06:12] Matthias Köhler:** Can I push back on something? My nervousness is around the explainability piece. The dispatchers won't trust a black box. If it says "send Tech A" they need to see why.

**[00:06:38] Adam Black:** Hundred percent. We won't show you any concept that hides its reasoning. The prototype will literally show "I picked this tech because: certified for this model, closest available, no overlapping job in next 3 hours, has done 14 jobs at this site." All visible, all overridable.

**[00:07:05] Matthias Köhler:** That's what we need. And the override has to be one click.

**[00:07:13] Bartosz Nowak:** Yes. Yes. One. Click.

**[00:07:22] Adam Black:** Noted. Single-click override is now a non-negotiable.

**[00:07:48] Priya Raman:** Sandra — on the unionised dispatcher question from your questionnaire, can you say more about what that conversation looks like internally?

**[00:08:09] Sandra Holtz:** We've already briefed the works council. The line we're holding is: this AI assists dispatchers, it doesn't replace them. We're not reducing headcount in the dispatch centre — we're using the freed time to expand into 24/7 coverage which currently we outsource at high cost. Council was satisfied with that framing.

**[00:08:48] Sandra Holtz:** But it means the prototype absolutely cannot look like a replacement. It has to look like "dispatcher's new tool." Visual design matters here.

**[00:09:15] Adam Black:** Captured. We'll need a designer view too, not just engineering. We can pull one in for the Ideate phase.

**[00:09:52] Lena Friedrich:** Quick technical question — the F-Gas compliance data, can the prototype call into the spreadsheet, or do we need to mock it?

**[00:10:09] Matthias Köhler:** For the prototype, mock it. Don't wait on the compliance team — that's a 3-week back and forth we can't afford. We'll give you the schema and 20 sample rows. That's enough.

**[00:10:31] Lena Friedrich:** Perfect, that's what I'd recommend too.

**[00:11:18] Adam Black:** OK — let me reflect back what I've heard so I can check I have it right.

**[00:11:30] Adam Black:** The big one: stop the bleeding on SLA breaches. Two ways to do it — flag risk early so dispatchers can act, and suggest better tech assignments so they avoid the risk in the first place. Of those two, the early-warning piece might actually be the higher-value first deliverable because it changes customer conversations not just operational decisions.

**[00:12:02] Sandra Holtz:** Yes. And it's lower risk to roll out — it doesn't change anyone's job, it just gives them better information.

**[00:12:24] Adam Black:** Right. The assignment recommender is the bigger prize but it touches the union conversation and the dispatcher workflow more deeply. Both end up in the prototype I think, but the order matters.

**[00:12:48] Adam Black:** Constraints I've heard: explainability is non-negotiable, single-click override, "augmentation not automation" visual language, mock the F-Gas data, frame in cost-of-inaction terms because of the Carrefour renewal.

**[00:13:21] Sandra Holtz:** That's it exactly.

**[00:13:30] Bartosz Nowak:** Don't make me alt-tab to Google Maps.

**[00:13:37] Adam Black:** [laughs] Drive-time visualisation in the UI. Captured.

**[00:14:08] Priya Raman:** Next steps — Adam will get the discovery write-up to you by Wednesday. Workshop one is Friday at 10am Warsaw time. We need someone from compliance on that call to talk through F-Gas, ideally Bartosz again, and one of your customer service leads if possible.

**[00:14:36] Sandra Holtz:** I'll get all three on the call. Customer service lead will be Anya Petrov — she runs the customer-facing escalation team.

**[00:15:00] Adam Black:** Perfect, that's the right blend of voices for ideation.

**[00:15:14] Priya Raman:** Anything else before we close?

**[00:15:22] Sandra Holtz:** Just — speed matters. Carrefour renewal review starts in 9 weeks. Whatever we show them needs to feel real, not a slideware concept.

**[00:15:41] Adam Black:** Understood. By end of week 3 you'll have a clickable prototype running against your own anonymised data. By week 4 we'll have the handoff package — roadmap, backlog, and a clear path to production.

**[00:16:08] Sandra Holtz:** Then let's go.

**[meeting ends 00:52:14]**

---

## Action items captured

- [ ] Anonymised CSVs to S42 by Wednesday (Matthias)
- [ ] Workshop 1 Friday 10am Warsaw, attendees: Sandra, Bartosz, Anya Petrov, compliance lead (Matthias to confirm)
- [ ] Discovery write-up by Wednesday EOD (Adam)
- [ ] Designer onboarded by Workshop 1 (Adam / Priya)
- [ ] Decision: SLA risk early-warning may be sequenced before assignment recommender — to be confirmed in Define phase
