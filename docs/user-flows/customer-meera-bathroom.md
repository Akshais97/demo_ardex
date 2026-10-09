# Meera Shah — applicator's own bathroom customer journey

Meera is Ravi's existing customer, added through **My Lead**, rather than a website/ARDEX offer. The fixture uses `DEMO-0002`, Bengaluru and a bathroom with leakage below. Her actions use the shared `homeowner` account; she has no separate login.

## 1. Open the bathroom scenario and add the customer

1. Presenter chooses **Explore connected interfaces**, selects **Bathroom · own customer**, selects **Booked visit** in Jump to and clicks **Show journey**. This checkpoint already creates Meera's job and labels it as seeded; it does not demonstrate manual customer entry.
2. For the actual blank-bathroom entry path, an onboarded Ravi sees **Bring your own customer** and enters the customer name, phone and site address, checks **Customer has permitted service contact (applicator attestation)**, then selects **Add my customer**. The current UI requires a bathroom workspace; changing the scenario selector alone does not reset/load one. No ordinary-user scenario creation control is implemented.
3. The command validates a name of 2–80 characters, a 10-digit Indian mobile starting 6–9 or `DEMO-0002`, an address of 8–200 characters and service consent. A matching contact requires an explicit new-site decision instead of silently merging properties; the current form submits that new-site choice.
4. The job starts as `VISIT_BOOKED`, marked `my-lead`, and the conversation introduces Ravi. Consent is an applicator attestation, not proof of homeowner acknowledgement; marketing permission stays off.

Meera does not go through the guided Ananya website consent/safety/slot sequence or the ARDEX offer acceptance timer.

## 2. Bathroom inspection and scope

1. Ravi checks in at the site and records the required bathroom diagnosis images and checklist answers.
2. The reference fixture says tiles removed, no visible membrane, hairline cracks, leakage below and damp ceiling below. If tiles have not been removed, calculation is blocked until preparation is corrected. A generic technical override cannot remove that preparation requirement.
3. Measurements are 8 × 6 ft floor, 28 ft perimeter, 1 ft upturn and an 8 ft × 6 ft shower-wall span. Treatment is **48 floor + 28 upturn + 40 additional shower wall = 116 sq ft**, with one drain and two penetrations. The extra shower wall excludes the first foot already counted in the upturn.
4. Ravi saves diagnosis, calculates the eligible bathroom options, and sends the itemised quote. The fixture can offer **Bath Seal**, **Bath Seal Plus** and **Bath Seal Max**; current diagnosis rules decide eligibility and recommendation.
5. Meera opens the current homeowner quote, compares products, packs, labour and stages, downloads it if needed, and selects **Approve this option**. The chosen option, price and stages freeze together.
6. If she declines, Ravi revises and sends a fresh version. Earlier quote links cannot approve the replacement quote.

## 3. Dealer handoff and start

Ravi sends the approved kit to Akshaya. The dealer checks each product/pack line, resolves shortages through Admin if needed and marks readiness. An optional dealer invoice records a declared reference and amount; Admin reconciliation is separate.

Meera receives the current generated START code in the homeowner conversation. She shares it when ready; Ravi verifies it to start work. The fixed applicator onboarding code is not this start code.

## 4. Bathroom work and review

For a selected **Bath Seal Plus** scope, the catalog specifies:

| Order | Stage | Photos | Configured minimum gap from previous stage | In-frame code |
| --- | --- | --- | --- | --- |
| 1 | Remove and prepare | 2 | 0 min | No |
| 2 | Primer | 1 | 0 min | No |
| 3 | Corner and drain tape | 2 | 120 min | No |
| 4 | Coat 1 | 2 | 0 min | Yes |
| 5 | Coat 2 | 2 | 360 min | No |
| 6 | Flood test start | 1 | 1,440 min | Yes |
| 7 | Flood test end | 1 | 1,440 min | Yes |

This is **11 required photos**. Bath Seal omits the primer stage and has 10 photos; Bath Seal Max has 11 photos and a 720-minute gap before Coat 2. Use the actual frozen approved template. These values are illustrative configuration, not approved field instructions.

Ravi scans genuine unused sample-registry packs for every approved line and records the required quantities. He captures the stages in sequence after their gaps, with GPS/sample location and visible challenge codes as required. Admin manually passes each record and assesses the paired 24-hour flood test. Failed evidence can be sent for redo; a product mismatch/reused pack needs documented correction before issuance. The own-customer route does not bypass any proof check.

## 5. Closing confirmation and completion

Once checks 1–5 and start permission pass, Ravi requests a closing code. Meera shares it only if satisfied, and Ravi verifies handover. Admin reruns all six checks and issues the Water Passport. Meera can download the PDF or open its public verification link. It is a demo completion record without an activated warranty.

A concern through **Message an advisor** during started, unissued work pauses handover and clears the closing confirmation. Admin resolution and a fresh CLOSE code are required. Issued evidence cannot be rewritten; voiding is a separate Admin decision.

## 6. Payment and ongoing relationship

Meera can acknowledge direct payment as paid or pending; Ravi can confirm receipt after her paid acknowledgement. She gives a one-time rating and chooses an optional care reminder preference. Low ratings create operations follow-up. Care scheduling and real WhatsApp delivery are not connected. The job remains attributed to Ravi's own customer relationship rather than being counted as an ARDEX-acquired enquiry.

Related: [Applicator flow](role-applicator.md), [Homeowner flow](role-homeowner.md), [six checks and workspace handling](README.md), [login details](../LOGIN-DETAILS.md).

Source: `src/ui/Intake.tsx`, `src/domain/my-lead.mjs`, `src/data/fixtures.mjs`, `src/domain/diagnosis.mjs`, `src/domain/execution.mjs`, `server/database.mjs`, `config/catalog.json`.
