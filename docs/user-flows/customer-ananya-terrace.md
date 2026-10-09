# Ananya Rao — ARDEX terrace customer journey

Ananya is the website/ARDEX-sourced customer with rain-related terrace leakage in Bengaluru. Her sample contact is `DEMO-0001`. This guide follows the current persisted guided journey, with other participants' actions included so each wait is explained. Use the shared `homeowner` account for her actions; there is no separate Ananya login.

## 1. Enquiry and booking

1. Presenter opens the app, keeps **Present Ananya’s journey**, and chooses **Begin Ananya’s journey**. On an occupied workspace, **Start a fresh journey** creates another session.
2. Ananya sees the website enquiry's name, address, symptom and reference-photo context in the Sakhaa conversation. She does not re-enter the entire enquiry.
3. Choose **Yes, service updates**. Marketing consent remains separate. **No thanks** stops service messages and booking does not proceed; she can explicitly resume updates.
4. Answer the safety question. **Hairline cracks only** continues. **Major cracks or sagging** stops the booking path and creates a technical follow-up; resolving a support item does not itself provide a general booking-resume workflow.
5. Choose **Tomorrow · 10 am–12 pm** or **Tomorrow · 2 pm–4 pm**.
6. Select **Confirm address & book visit**. The visit offer is created for Ravi; the conversation waits for acceptance.
7. Ravi accepts within the 15-minute demo offer window using an eligible, onboarded certified Bengaluru profile. His introduction, slot and retained address/photos appear. Decline or expiry needs operations reassignment/re-offer.

## 2. Visit, measurement and quotation

1. Ravi checks in using live GPS or the labelled sample site location.
2. He records all required diagnosis views, site-condition answers and measurements. Ananya's default terrace fixture is bare concrete, no coating, hairline cracks, ponding after rain, acceptable slope, no tiling planned, no exposed steel and no spalling.
3. The reference dimensions are 30 × 20 ft, a 100 ft perimeter and a 1 ft upturn: **600 + 100 = 700 sq ft treated area**, with two drains and one penetration.
4. Ravi saves diagnosis, calculates eligible packages, then chooses **Send quote to homeowner**. Structural flags require Admin technical clearance tied to that diagnosis before calculation.
5. Ananya compares the current quote's eligible options, opens **Inspect scope, materials & labour**, and checks treatment area, products, pack sizes, stages, materials and labour. She can download the actual quote PDF.
6. The reference walkthrough selects **Terrace Shield Plus** and **Approve this option**. The documented reference total is ₹66,940 (₹50,140 materials + ₹16,800 labour); the current calculated quote is authoritative if settings differ.
7. Approval freezes the accepted quote and stages. **Decline proposal** leaves work unapproved; Ravi can revise and send a new proposal. Approved scope cannot silently be revised.

## 3. Supply and permission to start

1. Ravi chooses **Send approved kit list**, tagging Akshaya Building Supplies.
2. Akshaya opens **Kit order**, checks every requested product line and selects **Mark kit ready**. An open shortage must first be resolved by Admin. Readiness is distinct from delivery and payment.
3. The homeowner conversation receives a generated START code. Ananya shares it only when she agrees work may begin.
4. Ravi enters that job's code under **Homeowner start code** and chooses **Confirm job start**. The job becomes `IN_PROGRESS`.

## 4. Product exception in the reference presentation

1. Presenter selects **Scan the wrong product**. A genuine registered SKU outside the approved scope is rejected without quantity credit; the original record remains visible.
2. Ravi requests the approved replacement SKU/pack size.
3. Akshaya selects an unused matching registered serial and confirms replacement readiness, reserving that exact pack for the job.
4. Ravi scans that exact supplied replacement at the site.
5. Admin documents removal of the rejected product and inspection of the supplied/scanned replacement, then clears the exception. A different eligible scan alone cannot resolve this requested replacement.

This deliberate exception is a presentation chapter, not a requirement that every real job must have a mistake.

## 5. Work and evidence

For **Terrace Shield Plus**, the frozen catalog sequence is:

| Order | Stage | Photos | Configured minimum gap from previous stage | In-frame code |
| --- | --- | --- | --- | --- |
| 1 | Surface preparation | 2 | 0 min | No |
| 2 | Crack and joint treatment | 1 | 0 min | No |
| 3 | Primer | 1 | 120 min | No |
| 4 | Coat 1 | 2 | 240 min | Yes |
| 5 | Reinforcement fabric | 1 | 0 min | No |
| 6 | Coat 2 | 2 | 720 min | No |
| 7 | Ponding test start | 1 | 1,440 min | Yes |
| 8 | Ponding test end | 1 | 1,440 min | Yes |

This is **11 required photos**. The table reproduces illustrative configured timings, not field application advice. A different approved option uses its own frozen stage template.

Ravi scans the approved quantities, captures each next stage after its gap and includes current challenge codes where required. Ananya sees progress messages; a recorded stage is pending technical review. Presenter can record labelled reference evidence and advance the demo clock; actual camera evidence is a separate capture mode.

Admin inspects every current image, records pass/fail reasons, confirms visible codes, compares the ponding-test pair and checks its elapsed time. A failed stage can be redone from that stage onward, preserving superseded history and invalidating closing confirmation.

## 6. Handover and Passport

1. Admin runs the six checks. Ravi can request CLOSE only after the first five checks and START confirmation pass.
2. Ananya reviews the work and shares the current closing code if satisfied; Ravi enters it and chooses **Confirm handover**.
3. A concern sent through **Message an advisor → Send concern** during started, unissued work pauses handover and invalidates CLOSE. Admin must resolve it, then a fresh closing confirmation is required.
4. Admin reruns all six checks and selects **Issue Water Passport**. The job becomes `COMPLETED`.
5. Ananya downloads the completion PDF or opens **Verify record**. The issued record has a verification token and frozen Proof ID; it is labelled demo/no active commercial warranty. Admin may later void it through a separate audited decision.

## 7. Payment, feedback and aftercare

Ananya chooses **I paid Ravi directly** or **Payment is pending**; pending can later be updated to paid. Ravi confirms receipt after a paid acknowledgement. These are two-party records, not bank/payment-provider verification. Dealer invoices have their own declaration/reconciliation status.

Ananya gives a one-time 1–5 rating. A rating below four creates operations follow-up. She chooses **Record reminder preference** or **No reminder**; no message is scheduled. She may share the enquiry website voluntarily, contact an advisor, or stop/resume service updates.

Related: [Homeowner controls](role-homeowner.md), [all handoffs and gate criteria](README.md), [login details](../LOGIN-DETAILS.md).

Source: `src/ui/GuidedPresentation.tsx`, `src/ui/JourneyViews.tsx`, `src/domain/journey.mjs`, `src/data/fixtures.mjs`, `config/catalog.json`, `PRESENTATION-RUNBOOK.md`.
