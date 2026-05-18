# Customer Brief — Contoso Field Services

> Internal scenario doc. The agents don't need this — but it gives **you** the elevator pitch when demoing.

## The Customer

**Contoso Field Services** is a B2B HVAC and industrial-cooling service provider operating across EMEA. They maintain critical equipment for grocery chains, data centres, hospitals, and large manufacturers. They have:

- **280 field technicians** across 14 European countries
- **~12,000 active service contracts** with tiered SLAs (Platinum = 2hr response, Gold = 4hr, Silver = next-business-day)
- **~180 work orders/day** dispatched manually by a team of **14 dispatchers** in a Warsaw control centre
- A custom dispatch system built in 2008 (server-rendered ASP.NET, single SQL Server) that nobody wants to touch

## The Pain

SLA breaches on Platinum and Gold contracts are bleeding money:

| Source of loss | Annual cost |
|----------------|-------------|
| Contractual penalties paid out for SLA misses | **€4.1M** |
| Renewals lost in the last 2 yrs attributed to repeat SLA failures | **€6.3M** |
| Overtime paid because of last-minute re-routes | **€1.7M** |
| **Total addressable pain** | **~€12M / year** |

Dispatchers spend most of their day:

1. Reading new work orders from the queue
2. Cross-referencing technician skills (electrical / refrigerant / control-systems / SCADA)
3. Calculating drive times manually using Google Maps in a second monitor
4. Phoning technicians to negotiate the assignment
5. When something slips, frantically re-routing in real time

They get yelled at by customers. Turnover among dispatchers is 38% annual.

## Why now

- New EU F-Gas regulations land in Q3 — refrigerant work needs traceable assignment to certified techs
- Two large Platinum contracts (Carrefour and Lidl, combined €18M ARR) are up for renewal in 9 months and both have flagged "service reliability" as a non-negotiable
- The CIO has greenlit a 12-week AI pilot budget; if it lands, it converts to a multi-year program

## What success looks like (per customer sponsor Sandra Holtz, COO)

- Reduce SLA breaches on Platinum + Gold by **>30%** within 6 months of go-live
- Cut average dispatcher decision time per work order from **~6 minutes to under 60 seconds**
- Provide a clear audit trail of "why was this tech assigned" for regulators
- Dispatchers should *feel relieved*, not threatened — this is assistive, not replacement

## What they have

- Three flat-file exports they're willing to share for the prototype (and have anonymised already):
  - `technicians.csv` — skills, certifications, home post-code, current availability
  - `sites.csv` — customer sites, contract tier, equipment served, SLA in minutes
  - `work-orders.csv` — 4 weeks of historical work orders with outcomes (including breach flags)

## Why Studio 42

Their incumbent SI quoted a 9-month delivery for a roadmap PDF. The CIO wants to see something tangible in 4 weeks before signing a multi-year deal. That's the VIBE engagement ask.
