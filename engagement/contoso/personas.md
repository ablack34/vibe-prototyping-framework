# Personas

> **Discover deliverable.** **Auto-generated** by `/vibe-personas` from sources in `engagement/contoso/` (transcripts, customer brief).
> Review and approve — do not fill manually.
>
> **Sources read:** `sources/customer-brief.md`, `sources/transcript-kickoff.md`, `sources/transcript-workshop-1.md`
>
> **Engagement:** Contoso Field Services (`contoso`)
> **Generated:** 2026-06-17

---

## How this file is graded

Each persona below is graded **A / B / C** by the agent:

- **Grade A (Strong)** — sourced quote present + key needs + key pains + user context/device info, all tied to a `sources/` file
- **Grade B (Sufficient)** — role + key needs + key pains, sourced from at least one `sources/` file
- **Grade C (Needs follow-up)** — role only, or no source citation, or no quote available

Discover cannot close until **every persona is at Grade B or higher**.

---

## Persona 1: Marek Zieliński

> **Grade:** A
> **Sources read:** `sources/customer-brief.md`, `sources/transcript-kickoff.md`, `sources/transcript-workshop-1.md`

| Field | Value |
|---|---|
| **Fictional name** | Marek Zieliński |
| **Role / Key characteristic** | Senior Dispatcher, Warsaw Control Centre — the person who feels every SLA miss in real time |
| **High-level description** | Marek has worked the Warsaw dispatch floor for eight years. He knows the technician roster by name and can recite SLA tiers from memory. He's skilled, methodical, and proud of his judgement — but he's drowning in a 2008-era system that forces him to cross-reference three sources by hand for every work order. He gets yelled at by customers all day and is terrified the next "digital transformation" will make his job disappear. |

### Key needs

- **Assignment in seconds, not minutes** — target is under 60 seconds per work order, down from the current ~6 minutes [source: `sources/customer-brief.md`]
- **Early warning of impending SLA breaches** so he can call the customer before the breach, not after [source: `sources/transcript-kickoff.md` ~00:04:48]
- **Drive-time shown inside the tool** — no alt-tabbing to Google Maps on a second monitor [source: `sources/transcript-kickoff.md` ~00:13:30]
- **Clear, readable reasoning for each recommendation** — certification, availability, distance, history — so he can exercise his own judgement [source: `sources/transcript-kickoff.md` ~00:06:38]
- **Single-click override** so he retains control and the tool feels like an assistant, not a replacement [source: `sources/transcript-kickoff.md` ~00:07:05–00:07:22]

### Key pains

- Spends ~6 minutes per work order manually cross-referencing technician skills, SLA tiers, and drive time across multiple screens [source: `sources/customer-brief.md`]
- Tuesdays are the worst — a backlog of weekend emergencies creates cascading SLA risk from the first hour of the shift [source: `sources/transcript-kickoff.md` ~00:01:21]
- Learns about an impending breach too late to warn the customer proactively; has to negotiate credits after the fact [source: `sources/transcript-kickoff.md` ~00:02:46–00:03:25]
- Gets yelled at by customers throughout the day; dispatcher turnover in the team is 38% annually [source: `sources/customer-brief.md`]
- The current system doesn't enforce F-Gas certification rules — it relies on him knowing which technicians hold which certs, creating compliance risk he carries personally [source: `sources/transcript-workshop-1.md` ~00:08:52]

### Quote(s)

> "Don't make me alt-tab to Google Maps."
>
> — Bartosz Nowak (Senior Dispatcher, real name), source: `sources/transcript-kickoff.md` ~00:13:30

> "Yes. Yes. One. Click."
>
> — Bartosz Nowak (Senior Dispatcher, real name), source: `sources/transcript-kickoff.md` ~00:07:13

> "I would have phoned the customer earlier. Customers don't mind being told something's slipping if you tell them in time. They hate being surprised. That alone would save half my arguments."
>
> — Bartosz Nowak (Senior Dispatcher, real name), source: `sources/transcript-kickoff.md` ~00:04:48

### User context / device info

- **Primary device(s)**: Desktop workstation, dual monitors — dispatch system on one screen, Google Maps on the other
- **Where they work**: Warsaw control centre, shift work; the dispatch system is open continuously during shift
- **Time pressure**: 2-hour response window for Platinum contracts; 50+ work orders can land simultaneously on Tuesday mornings
- **Other context**: Does **not** have Teams open while queuing orders — alerts delivered via Teams would not reach him during active dispatch [source: `sources/transcript-workshop-1.md` ~00:06:42]. Offline tolerance is non-negotiable — the 2019 pilot failed partly because the tool went blank during a power cut [source: `sources/customer-brief.md`]

---

## Persona 2: Agata Wiśniewska

> **Grade:** A
> **Sources read:** `sources/transcript-workshop-1.md`, `sources/customer-brief.md`

| Field | Value |
|---|---|
| **Fictional name** | Agata Wiśniewska |
| **Role / Key characteristic** | Head of Customer Service — absorbs the fallout from every surprise SLA breach before it escalates to account management |
| **High-level description** | Agata leads the customer-facing escalation team. She spends her days on the phone with contract owners who have just discovered a technician is late. She knows that most of those calls are avoidable — the customer would have accepted a delay if Contoso had called them first. Her team is the last line of defence before a contract cancellation, but she has no visibility into the dispatch queue and can only react, never prevent. |

### Key needs

- **60–90 minutes of advance warning** of an impending SLA breach so she can call the customer proactively [source: `sources/transcript-workshop-1.md` ~00:01:42]
- **Alerts delivered inside Teams** — where her team already works (Outlook + CRM + Teams, two screens), not inside the dispatch system [source: `sources/transcript-workshop-1.md` ~00:06:34]
- **Reduction in the volume of "surprise" escalations** — roughly 80 of her 120 weekly escalations are avoidable with early notice [source: `sources/transcript-workshop-1.md` ~00:02:25]
- **Self-service SLA risk visibility** without having to interrupt a dispatcher mid-queue to ask for status [inferred from sources — not explicitly stated; assumption flagged]

### Key pains

- Handles ~120 escalation calls per week; approximately 80 (~67%) are complaints about not being warned in time, not about the breach itself [source: `sources/transcript-workshop-1.md` ~00:01:42 and ~00:02:25]
- Each escalation costs 30–60 minutes of her team's time plus whatever service credit she has to issue [source: `sources/transcript-workshop-1.md` ~00:02:25]
- Has no real-time visibility into the dispatch queue — she relies entirely on dispatchers escalating to her, which happens after the breach, not before [source: inferred from `sources/transcript-workshop-1.md`; assumption flagged]
- Works across phone, Outlook, and CRM simultaneously — any alert tool that requires a separate login or new window will be ignored [source: `sources/transcript-workshop-1.md` ~00:06:08]

### Quote(s)

> "About 70% of the complaints I handle aren't about the breach itself, they're about being surprised by the breach. If we could give customers 60-90 minutes of warning we'd cut my escalation queue in half."
>
> — Anya Petrov (Head of Customer Service, real name), source: `sources/transcript-workshop-1.md` ~00:01:42

> "I deal with about 120 escalations a week. Of those, maybe 80 are 'you didn't tell me.' If we eliminated half of those, that's 40 fewer angry customer calls per week. Each one costs me 30-60 minutes plus whatever credit I have to hand out."
>
> — Anya Petrov (Head of Customer Service, real name), source: `sources/transcript-workshop-1.md` ~00:02:25

### User context / device info

- **Primary device(s)**: Two screens — phone, Outlook, CRM, and Teams all running simultaneously [source: `sources/transcript-workshop-1.md` ~00:06:08]
- **Where they work**: Customer service office, separate from the dispatch floor
- **Time pressure**: Reactive — works on inbound escalations; each call is urgent once a customer is already angry
- **Other context**: Teams is a natural delivery channel for her team; they already chat with the dispatch team via Teams [source: `sources/transcript-workshop-1.md` ~00:06:21]. She was not present at the kickoff — her data emerged in Workshop 1, giving the engagement a stronger early-warning business case than the kickoff alone provided.

---

## Persona coverage note

A third potential persona exists — **Klaus Wagner** (Compliance Lead, F-Gas) — who appeared in Workshop 1 with specific requirements around certification traceability. However, the sources provide only his functional requirements, not his day-to-day workflow or personal pains. He is better represented as a **stakeholder** (PROJECT-CONTEXT.md Section 6) than a persona. If a future transcript or questionnaire surfaces his regular workflow, re-run `/vibe-personas` to add him.

---

## Sign-off

| Reviewed by | Role | Date | Signature / approval note |
|---|---|---|---|
| | | | |

> Customer sign-off is recommended (but not required) before moving to Disrupt. If the customer has not yet reviewed, leave the row blank and add it after the next check-in.

