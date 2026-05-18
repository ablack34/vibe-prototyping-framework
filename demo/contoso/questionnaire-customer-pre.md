# Customer Pre-Workshop Questionnaire — Contoso Field Services

> Pre-filled responses representing what the customer team sent back before the kickoff workshop. Two respondents: the COO (sponsor) and a Lead Dispatcher (front-line user).

---

## Respondent 1: Sandra Holtz — COO

### About You

| Question | Answer |
|----------|--------|
| Your name | Sandra Holtz |
| Your role / title | Chief Operating Officer |
| Your department or team | Executive |
| Technical comfort level | Somewhat technical |

### The Problem

**In one sentence, what problem do you most want to solve?**

We're hemorrhaging money on SLA breaches because dispatchers can't react fast enough, and our best ones are burning out — I need AI to take the obvious decisions off their plate so they can focus on the hard ones.

**How is this handled today?**

A dispatcher reads each new work order, decides on a technician using personal judgement plus a couple of Excel-style screens, calls the tech to negotiate, and updates the system. When something slips they scramble in real time. There is no proactive risk flagging — we find out we breached when the customer phones us.

**What frustrates you most?**

That the same handful of senior dispatchers know what to do but can't be in 14 timezones at once, and the junior dispatchers make defensible-but-suboptimal calls that cost us money 200 times a week.

**What does great look like?**

Every work order gets a confidence-scored assignment suggestion within a second of being created. Dispatchers approve or override. The system learns from overrides. SLA risk on Platinum contracts is flagged 90 minutes before the breach window. Dispatchers feel like they have a smart junior assistant.

### Impact

| Question | Answer |
|----------|--------|
| Time cost per week | More than 10 hours |
| People affected | 20-100 |
| What happens if nothing changes in 6 months? | We will almost certainly lose the Carrefour renewal (€8M ARR). That triggers an internal review of the whole field-services division. |

### Data & Systems

**What data or systems are relevant?**

- Custom ASP.NET dispatch system (the 2008 one), SQL Server backend
- HR system for technician roster and certifications
- CRM for customer sites and contracts
- Google Maps API (used informally by dispatchers in second monitor)
- Excel files that the F-Gas compliance team maintains separately

**Can you share sample data?**

Yes — we'll have anonymised CSVs ready for the first workshop.

### Priorities

**If the prototype could only do ONE thing, what should it be?**

Recommend the best technician for each new work order with a clear explanation of why.

**What would make you say yes, this is worth investing in?**

A live demo using our own anonymised data, showing the prototype handling a realistic queue and visibly catching at least one SLA risk that our current process misses.

**Anything else?**

The dispatchers are unionised. Please frame everything as augmentation, not automation. I want them on side.

---

## Respondent 2: Bartosz Nowak — Senior Dispatcher (12 years)

### About You

| Question | Answer |
|----------|--------|
| Your name | Bartosz Nowak |
| Your role / title | Senior Dispatcher, Warsaw Control Centre |
| Your department or team | Operations / Dispatch |
| Technical comfort level | Non-technical |

### The Problem

**In one sentence, what problem do you most want to solve?**

The system tells me what work orders exist but not which technician is the right one — I have to know that in my head, and when I'm on holiday the juniors get it wrong.

**How is this handled today?**

I have Outlook open with techs' calendars, our old system with the queue, and Google Maps. I read each order, mentally cross-reference 3-4 things, then phone whoever I think is best. Sometimes they say no because they're already in traffic and I redo it.

**What frustrates you most?**

The system makes me re-enter the same information 4 times. And it can't see that two work orders are 800m apart and should be done by the same tech in one trip.

**What does great look like?**

I see the order, I see "this is the right tech, here's why" with a button to confirm. If the tech is busy or refuses, the system gives me a ranked second and third choice instantly. I never have to alt-tab to Google Maps.

### Impact

| Question | Answer |
|----------|--------|
| Time cost per week | More than 10 hours |
| People affected | 20-100 |
| What happens in 6 months? | I will probably leave. We've lost 3 senior dispatchers in 18 months and the workload is brutal. |

### Data & Systems

Same as Sandra's answer.

### Priorities

**If the prototype could only do ONE thing?**

Tell me which technician should do the next order. Everything else is a bonus.

**What would make you say yes?**

If during a workshop I could put a real work order through it and the suggestion matches what I would have chosen — and explains itself.

**Anything else?**

Whatever you build, **don't** make me click 14 things to confirm an assignment. The current system does that and I hate it.
