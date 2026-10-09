# Applicator / Ravi Kumar user flow

Sign in at http://127.0.0.1:5173 as `applicator` with `ArdexDemo!2026`. The default Experience is **Applicator app**. Preserve the job's workspace `?session=...`.

## 1. Activate the profile and take work

If onboarding is incomplete, choose **Send login code**, enter `456123` within five demo minutes and choose **Complete onboarding**. Seeded checkpoints and the guided story may already have this done. Profile shows member `app-ravi`, certification, tier and quality score.

For an **ARDEX terrace lead**, Presenter or the connected enquiry must first generate the offer. Review the symptom, visit slot and initial triage; contact/address are masked before acceptance. Choose **Accept visit** within 15 demo minutes or **Decline visit**. Acceptance requires the onboarded, certified Bengaluru profile with a positive service radius. Decline/expiry records the next illustrative candidate; operations can re-offer to eligible Ravi. Broad real-world routing is not implemented.

For **own bathroom work**, use **Bring your own customer**, enter customer details, attest service-contact permission and choose **Add my customer** in an empty bathroom workspace. There is no ARDEX offer acceptance step. See [Meera's setup distinction](customer-meera-bathroom.md).

## 2. Inspect and quote

1. Check in using device or labelled sample location.
2. Record all required diagnosis photos, checklist answers and measurements; save the diagnosis.
3. If structural concerns are present, wait for Admin's documented clearance for that diagnosis. Bathroom tiles not removed must be corrected before calculation.
4. Calculate the plan. Only diagnosis-eligible packages are offered; review recommended package, product units, required quantities, whole packs and labour. Recalculate when diagnosis changes.
5. Select **Send quote to homeowner**. Download the quote if needed. Wait for homeowner approval or decline.
6. For an unapproved `QUOTE_SENT` job, **Revise proposal** supersedes the old quote and returns to diagnosis for a replacement proposal. An approved job cannot use this to alter accepted scope.

## 3. Arrange materials and start

Select **Send approved kit list**. Akshaya receives the frozen bill of materials. Wait for readiness; Admin must resolve any shortage. Ask the homeowner for the generated START code, enter **Homeowner start code**, and choose **Confirm job start**. **Resend homeowner start code** is subject to cooldown and request limits.

## 4. Scan and execute

1. Under **Product verification**, enter a sample serial and **Validate code**, or choose **Camera QR scan**. Use device GPS where available; sample location stays labelled.
2. Scan every required SKU and sufficient quantity in its own unit. Invalid, reused, wrong-system or provisional records cannot substitute for accepted quantities. **Reconcile** rechecks provisional scans.
3. For a rejected pack, request the approved replacement. The dealer supplies a particular registered serial; scan that exact pack and wait for Admin's documented correction. The rejected record is retained.
4. Under **Stage proof**, follow the next incomplete stage in the frozen template. Wait for curing, review the example weather advisory, generate an in-frame code when required, then **Capture with camera** or **Use reference photo**. Reference evidence remains labelled sample. Live camera offers retake/confirmation.
5. Complete every required shot and paired flood/ponding test. Admin passes/fails images. A redo supersedes the selected stage and later evidence, preserving history and requiring recapture.
6. Failed network submissions for scans/photos can enter the outbox. **Reconnect & sync** retries; pending actions do not count until accepted. Conflicts retain evidence for explicit review.

## 5. Handover and close

After Admin review and the first five checks plus START pass, select **Request homeowner closing code**. Ask the homeowner, enter **Homeowner closing code** and choose **Confirm handover**. Admin reruns the checks and issues the Passport. A homeowner concern creates a hold and clears CLOSE; operations resolution and a fresh code are required.

After issuance, download the Water Passport and open public verification. **Record directly paid amount** records the approved amount as applicator-reported, without provider verification. The connected Outcome also permits **Ravi: confirm direct payment receipt** after the homeowner reports paid; acknowledgement amounts must agree.

## 6. Navigation and exceptions

- **jobs:** active intake, diagnosis, quote, kit and execution controls.
- **history:** retained jobs and their workspaces; open the intended record to resume.
- **earnings:** recorded direct payments, released/held points, quality score and reward ledger. These are not payment-gateway settlement or guaranteed income.
- **profile:** onboarding and the digital member card.
- An eligible open assigned job can be cancelled with a reason before completion; this cancels outstanding quote/kit records and clears held points. It issues no Passport.

Ravi cannot mark dealer readiness, approve the customer's quote, clear technical/product issues, assess evidence or issue/void a Passport. Those handoffs require the relevant role even if another interface can be previewed.

[All six checks](README.md), [Ananya's stages](customer-ananya-terrace.md), [Meera's stages](customer-meera-bathroom.md), [login reference](../LOGIN-DETAILS.md).

Source: `src/ui/Workflow.tsx`, `Intake.tsx`, `Diagnosis.tsx`, `Plan.tsx`, `Commercial.tsx`, `Proof.tsx`, `CorrectionFlow.tsx`, `CancelControls.tsx`, and `src/domain/`.
