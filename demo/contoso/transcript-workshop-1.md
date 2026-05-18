# Meeting Transcript — [VIBE] Contoso Field Services — Workshop 1

> Fixture transcript from the first ideation workshop. Shorter than the kickoff (40 min) — primarily a working session.

**Meeting:** [VIBE] Contoso Field Services — Workshop 1
**Date:** 2025-02-14
**Duration:** 41 min

**Participants:**
- Sandra Holtz (Contoso, COO)
- Bartosz Nowak (Contoso, Senior Dispatcher)
- Anya Petrov (Contoso, Head of Customer Service)
- Klaus Wagner (Contoso, Compliance Lead — F-Gas)
- Adam Black (Microsoft, S42)
- Lena Friedrich (Microsoft, S42 Engineer)
- Yusuf Demir (Microsoft, S42 Designer)

---

**[00:01:12] Adam Black:** We came out of the kickoff thinking the early-warning piece was actually the strongest first win. Before we frame the concepts I want to test that with you. Anya, you weren't on Monday — does that resonate?

**[00:01:42] Anya Petrov:** Massively. About 70% of the complaints I handle aren't about the breach itself, they're about being surprised by the breach. If we could give customers 60-90 minutes of warning we'd cut my escalation queue in half.

**[00:02:18] Sandra Holtz:** That's a stronger statement than I expected. Anya, can you put a number on it?

**[00:02:25] Anya Petrov:** I deal with about 120 escalations a week. Of those, maybe 80 are "you didn't tell me." If we eliminated half of those, that's 40 fewer angry customer calls per week. Each one costs me 30-60 minutes plus whatever credit I have to hand out.

**[00:03:01] Adam Black:** OK so the early-warning use case has emerged as the clear first deliverable. Let me sketch three concepts on the screen.

**[00:03:30] Adam Black:** Concept A — a dispatcher web app. Dashboard view of all live work orders with a colour-coded SLA risk meter for each. Click a high-risk one and you see why and get a list of reroute options.

**[00:04:02] Adam Black:** Concept B — a conversational bot inside Teams. The bot proactively pings the dispatcher when an order's risk crosses a threshold. "Order 4471 will breach in 80 minutes. Reroute options: tech X (recommended), tech Y, tech Z. Reply 1, 2, 3 or 'manual'."

**[00:04:38] Adam Black:** Concept C — an agentic system. An AI agent monitors the queue, evaluates every order against SLA, and automatically initiates reroutes for low-risk decisions while escalating uncertain ones to a dispatcher.

**[00:05:14] Bartosz Nowak:** Hmm. C scares me. I don't want the system making decisions on its own. Not yet.

**[00:05:22] Sandra Holtz:** Agreed. Maybe later, not now.

**[00:05:30] Adam Black:** Noted. C is parked.

**[00:05:48] Yusuf Demir:** Of A and B — Anya, your team is handling 120 escalations a week. Where are they when they're handling them?

**[00:06:08] Anya Petrov:** On the phone, in Outlook, in our CRM. Usually two screens. They're not staring at a dispatcher dashboard.

**[00:06:21] Yusuf Demir:** So if the alert was in Teams, where they're already chatting with the dispatcher team — that's actually closer to their workflow.

**[00:06:34] Anya Petrov:** Yes, exactly.

**[00:06:42] Bartosz Nowak:** But for dispatchers, A is closer to ours. We have the dispatch system open all the time. We don't have Teams open while we're queuing orders.

**[00:07:08] Sandra Holtz:** It's both, isn't it. Dispatchers in the web app, customer service in Teams.

**[00:07:15] Adam Black:** That's the right framing. We can build A as the primary prototype and stub B as a "here's how this same logic feeds Teams notifications" concept piece. Same backend, two surfaces.

**[00:07:34] Lena Friedrich:** That's clean architecturally. The early-warning engine produces events. The web app subscribes. A Teams bot could subscribe.

**[00:08:00] Adam Black:** Klaus, while you're here — F-Gas. For the prototype we're going to mock the certification data. Schema-wise, what do we need to know?

**[00:08:18] Klaus Wagner:** Each tech has a list of certifications with expiry dates. The relevant ones for HVAC are CAT I, II, III, IV depending on refrigerant volume. CAT I covers everything, CAT IV is for very small systems. We also track CAT-SCADA which is internal, for control systems.

**[00:08:52] Klaus Wagner:** Critical rule: if the work order involves a refrigerant > 3kg charge, the assigned tech must hold valid CAT I or II. The current system doesn't enforce this — it relies on dispatchers knowing.

**[00:09:24] Adam Black:** So that's a hard constraint we should bake into the recommender from day one. Lena, capture that.

**[00:09:32] Lena Friedrich:** Got it. Hard constraint: refrigerant > 3kg requires CAT I or II cert, non-expired.

**[00:09:48] Klaus Wagner:** And the F-Gas regulation update in Q3 will tighten this further — eventually we'll need traceable proof of the certification check at assignment time, not just the assignment itself.

**[00:10:14] Sandra Holtz:** Which is exactly the kind of audit-trail feature that turns this prototype into something defensible at board level.

**[00:10:25] Adam Black:** Captured. So we now have two anchor capabilities: SLA risk early-warning, and certification-enforced assignment with audit trail. The recommender is the second deliverable.

**[00:11:02] Sandra Holtz:** I'm comfortable with that sequence.

**[00:11:14] Bartosz Nowak:** Can you show me a mockup before Friday? Even a rough sketch. I want to feel it.

**[00:11:24] Yusuf Demir:** I'll have a Spark prototype in your inbox by tomorrow lunchtime. Clickable, not pretty, but enough for you to react to.

**[00:11:38] Bartosz Nowak:** Perfect.

**[00:12:09] Adam Black:** OK — engineering brief takes shape from here. Sandra, anything else for today?

**[00:12:18] Sandra Holtz:** Just the explainability thing. Whatever we show, the "why" has to be visible.

**[00:12:28] Adam Black:** Won't show you anything that hides its reasoning.

**[meeting ends 00:41:08]**

---

## Decisions captured

- [x] Early-warning is the primary first deliverable (validated by customer service data — 80 of 120 escalations/week are "surprise" breaches)
- [x] Assignment recommender is second, gated on early-warning being well-received
- [x] Concept C (full agentic) is parked — explicit customer pushback, "not yet"
- [x] Concept A (web app) is the primary form factor; Concept B (Teams notifications) stays as a same-backend extension
- [x] Hard constraint: refrigerant > 3kg requires non-expired CAT I or II certification
- [x] Audit trail of certification check is part of the value story (regulatory future-proofing)
