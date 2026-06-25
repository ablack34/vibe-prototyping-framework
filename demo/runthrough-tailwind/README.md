# Tailwind Traders — Web-Surface Run-Through Kit

A complete, internally-consistent fictional engagement you can drag-and-drop into the **hosted VIBE web surface** to do a full pretend run-through — no real customer, no VS Code.

> **Scenario:** **Tailwind Traders** is a Bristol-based outdoor, home & garden retailer (~£480M revenue, ~1.3M online orders/year). Returns run at **18% of online orders — roughly 19,000 every month — and every one is processed by hand** by 22 contact-centre agents on a 2012 tool called "ReturnDesk". Average refund takes **9 working days** (target: under 3), **41% of returns are coded "Other"** so nobody can see *why* product comes back, and Finance pegs returns fraud/leakage at **£2.3M/year**. They want an **assistive** AI (never autonomous — no automatic refunds) that helps agents code reasons, choose the right disposition (restock / refurbish / liquidate / recycle), and surface likely abuse — explainably, on all-Microsoft tech, with mock data only.

Everything below is invented but cross-referenced: the SKUs in `returns.csv` exist in `product-catalog.csv`, the customer IDs exist in `customers.csv`, and the three flagged serial-returners each have a story the free-text reasons tell.

---

## What's in here

```
demo/runthrough-tailwind/
├── README.md                          ← you are here
├── sources/                           → drop these into the SOURCES dropzone
│   ├── customer-brief.md              the customer's own voice (Elena Marsh, Director of Digital CX)
│   ├── account-team-handover.md       Microsoft account-team intake / S42 handover notes
│   ├── discovery-call-transcript.vtt  40-cue WebVTT transcript of the kickoff discovery call
│   ├── voice-of-customer.txt          verbatim survey quotes, reviews & agent Teams messages
│   └── current-returns-policy.pdf     Tailwind's real returns policy + internal handling standard
└── mock-data/                         → drop these into the MOCK DATA dropzone
    ├── returns.csv                    42 returns with rich free-text reasons (the core dataset)
    ├── product-catalog.csv            22 products with return-rate & margin
    ├── customers.csv                  22 customers incl. 3 flagged serial-returners
    └── reason-code-taxonomy.xlsx      the reason-code taxonomy + a Notes tab (the "41% Other" story)
```

**Mix of formats on purpose.** The `.pdf` and `.xlsx` exercise the surface's Microsoft **MarkItDown** conversion path (Office/PDF → Markdown at ingest); `.md`, `.vtt`, `.txt` and `.csv` are ingested as-is. So one run-through proves both ingestion routes.

---

## How to run it in the hosted surface

Open the surface: **https://ca-vibe-surface.mangorock-626cbdd2.uksouth.azurecontainerapps.io**

### 1. Create the engagement
Click **New engagement**, name it something like **Tailwind Returns**, and create it. The surface provisions a real (private) GitHub repo from the template, born clean with the engine inside it.

### 2. Add the evidence → **Sources** dropzone (near the top of the page)
Drag all **5 files from `sources/`** onto the Sources dropzone (or click to pick them). The surface auto-detects each kind (customer brief, transcript, research, other) and commits them into the engagement repo. The `.pdf` shows a brief "converting to Markdown" step — that's MarkItDown turning the policy doc into text the engine can read.

> The Sources dropzone is deliberately first on the page so a facilitator is prompted to gather evidence **up front**.

### 3. Add the data → **Mock data** dropzone (just below Sources)
Drag all **4 files from `mock-data/`** onto the Mock data dropzone. These are the customer's structured prototype data — but the surface **cross-grounds** them: each file is committed twice, once as raw data for the engineer's Design & Develop phase **and** once as a Markdown twin that also grounds Discover. So `returns.csv` doesn't just feed the prototype later; its free-text reasons feed personas / problem-statement / journey *now*. Each file shows a **✓ grounds Discover** badge once staged.

> You don't need to add the CSVs to Sources as well — the Mock data dropzone already grounds them into Discover. Add each file once.

### 4. (Optional) Preparation
The two briefs are already in your sources, so the **Preparation** band will show the brief gate satisfied. You can generate the meeting schedule and run customer research here if you want to demo phase 1 — otherwise skip straight to Discover.

### 5. Run **Discover**
In the Discover band, click **Synthesize context** first (builds the single source of truth from your sources), then **Generate** each of the three deliverables — **Personas**, **Problem statement**, **Current-state journey** — one at a time. Each is a real engine run in the engagement's repo (~2–3 min). Watch the gate climb 0/3 → 3/3 and go **GREEN**, then **Approve** each deliverable to sign it off.

### 6. Continue into **Disrupt** (optional)
With Discover signed off, the Disrupt band unlocks — generate the workshop agenda and candidate concepts, drop workshop captures into the workshop bucket, and walk the post-workshop chain (record → selected concept → future-state journey → storyboard).

---

## What to point at while you narrate

The data is seeded so the engine can *infer* the real story — great for showing how Discover mines evidence:

- **The "41% Other" problem is visible in the raw data.** 14 of the 42 returns (~33% in this sample) have a **blank reason_code** but a rich free-text reason — exactly the gap the AI is meant to close. The taxonomy's Notes tab states the population figure (41%) and why agents default to "Other".
- **Three flagged serial-returners tell a story in the free text:**
  - **C-1007** returns the same walking boots again and again — reasons say "too small" / "wrong size" but `condition_reported` says *worn outdoors, mud, resoled*.
  - **C-1013** is a classic wardrober — jackets and trousers returned "didn't suit me" with *event smell / makeup stains / tags removed*.
  - **C-1019** returns electronics as "faulty" that repeatedly come back **no fault found on test**.
- **A genuine safety case** (R-50021) — a camping stove with a *gas leak on first use* — sits right next to the abuse cases, so the demo shows why this must stay **assistive and explainable**, never an automated refuse.
- **All four dispositions** (restock / refurbish / liquidate / recycle) appear, with the policy PDF explaining the ~30% mis-disposition problem.
- **Peak drag** — the serial / no-fault cases sit at 16–21 days to refund, pulling the average up toward the stated 9-day pain.

---

## Resetting / re-running

Each run-through is just a provisioned GitHub repo plus commits. To start over, create a **new** engagement and drag the same files in again, or delete the engagement repo. The files in this folder are never modified by the surface.

## Swapping the scenario

Prefer a different domain (insurance claims, field service, onboarding…)? These files are plain text/CSV/Office docs — copy the folder, find-and-replace the company and the numbers, and re-export the `.xlsx`/`.pdf`. Ask the framework to regenerate a fresh kit if you'd rather not hand-edit.

---

*Fixture data only — every name, number, customer and order is invented. All technology referenced is Microsoft (Azure, Power Platform, M365). No live systems are connected.*
