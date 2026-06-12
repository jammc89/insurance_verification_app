# Insurance Verification App — Viability & Roadmap

## The idea

Automated dental insurance verification, focused on **endodontic practices** (root canals,
retreatments). Front-office staff currently verify benefits by phone or payer portals —
commonly 10–20+ minutes per patient. This app turns that into a form submit that returns
eligibility, benefit maximums, procedure-level coverage, and a chair-side patient cost estimate.

## Is it viable?

**Yes — it's a validated market, which cuts both ways.**

- Active competitors prove demand: Zuub, Vyne Trellis, DentalXchange, Dentifi, plus
  outsourced services (eAssist, OSI) charging **$3–$10 per verification**.
- The plumbing is commoditized: real-time eligibility (EDI 270/271) is available as a JSON
  API through clearinghouses like Stedi (eligibility checks included at $0/transaction) and
  dental-specific aggregators like Onederful (280+ payers).
- The hard part is **not** the eligibility check — it's the *benefit breakdown*: frequency
  limitations, waiting periods, downgrades, tooth-level history. 271 responses are often
  incomplete, so incumbents supplement with payer-portal scraping and human verifiers.

**Wedge:** stay narrow. A generic verification tool fights Zuub head-on. An
**endodontic-specialty tool** (D3000-series codes, retreatment waiting periods, tooth-level
history, referral-heavy workflows) serves a niche the broad tools handle poorly — exactly
what the current UI already models.

## What it takes to be real

### Phase 1 — Real data (4–8 weeks)
- Replace the mock `handleSubmit` with a backend route that calls a clearinghouse
  eligibility API (Stedi or Onederful), normalizing 271 responses into the app's existing
  result shape.
- Replace client-side auth (`VALID_USERS` with plaintext passwords — demo-only, must not
  ship) with a real provider (e.g., NextAuth/Auth0/Clerk) and a database (Postgres).
- Persist verification history per patient.

### Phase 2 — HIPAA compliance (parallel, non-negotiable)
- BAAs with every vendor touching PHI (hosting, clearinghouse, logging, email).
  Note: Vercel offers BAAs only on Enterprise; AWS/GCP/Azure are common alternatives.
- Encryption at rest + in transit, audit logging, access controls, session timeouts.
- No PHI in client-side state longer than needed; no PHI in logs or analytics.

### Phase 3 — Workflow depth (the moat)
- Benefit breakdown enrichment: frequency/history/waiting-period parsing, flagging
  retreatment conflicts (the "Tooth 18" warning, but real).
- Per-practice fee schedules and contracted rates for accurate estimates.
- Printable/emailable patient estimate (case acceptance driver).
- Batch verification of tomorrow's schedule (the #1 front-office workflow).

### Phase 4 — Distribution
- PMS integrations (Dentrix, Eaglesoft, Open Dental) to auto-pull the day's patients.
- Pricing: flat monthly per location (e.g., $199–$399/mo) undercuts per-verification
  services at volume; pilot with 3–5 endodontic practices first.

## Sources
- [Dental insurance verification software comparison (2026)](https://www.needletailai.com/blog/best-practices/dental-insurance-eligibility-verification-software)
- [Best dental verification tools 2026](https://savvyagents.ai/blog/best-dental-insurance-verification-software-2026)
- [Zuub overview & pricing](https://www.capterra.com/p/200040/Zuub/)
- [Stedi real-time eligibility API (270/271)](https://www.stedi.com/docs/healthcare/api-reference/post-healthcare-eligibility)
- [Stedi pricing](https://www.stedi.com/pricing)
- [Vyne Dental eligibility APIs](https://vynedental.com/api-eligibility-benefits/)
- [ADA: eligibility & benefits verification](https://www.ada.org/-/media/project/ada-organization/ada/ada-org/files/resources/practice/dental-insurance/eligibility_and_benefits_verification.pdf)
