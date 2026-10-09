# Completion blocked before Outcome — root cause and recovery

Status: **DONE**. Investigated and fixed on 2026-10-09.

## Symptom

In the Completion chapter, **Request homeowner closing code** returned HTTP 400 with `CLOSE_GATE`: “First clear the five proof checks and start confirmation.” Outcome remained unavailable because no completion record had been issued.

Affected workspace: `93fdba3f-288f-4e55-a8ef-fa06ebba460f`.

## Findings from the saved record

At investigation, the workspace was revision 19 with job status `REVIEW`, approved system **Terrace Shield Plus**, verified START and no CLOSE confirmation.

| Requirement | Observed state |
| --- | --- |
| Genuine unused packs | Pass |
| Correct system products | Pass |
| Coverage quantity | Pass: WPM265 12 L; WPM810 156 KG; MESH 50 SQM, within frozen requirements/pack rounding |
| On-site evidence | Pass based on the credited sample pack locations |
| Ordered work and curing | Fail: **0 of 11 required stage photos recorded**; no paired ponding-test records or photo assessments |
| Start permission | Verified |
| Closing permission | Not requested/verified; correctly blocked by missing stage proof |

History contained `SCAN_KIT` followed by three `EVALUATE_GATE` events, with no `CAPTURE_STAGE` events. Repeated evaluation cannot create or assess missing evidence.

## Root cause

1. Running the checks before capturing stages changed `IN_PROGRESS` to `REVIEW`, as designed for failed requirements.
2. The guided presentation showed its reference-stage controls only in `IN_PROGRESS`.
3. The applicator's individual capture controls also appeared only in `IN_PROGRESS`.
4. The backend rejected `CAPTURE_STAGE` and `REQUEST_CHALLENGE` in `REVIEW`, so revealing a button alone would not have fixed the problem.
5. The closing-code button remained enabled even when its prerequisites failed. It showed a generic error and displayed the last saved gate results rather than current readiness.

The result was a workflow dead end: reviewing incomplete work removed the ability to finish recording it. The CLOSE guard correctly prevented a premature handover; removing that guard would have hidden the defect and allowed unsupported issuance.

## Fix

- Missing-stage capture and challenge generation are permitted in `REVIEW` as well as `IN_PROGRESS`, while preserving next-stage, product, location, curing and challenge rules.
- A successfully captured stage resumes the job in `IN_PROGRESS`; capturing does not approve evidence or issue a record.
- Both guided reference controls and individual capture controls remain available while incomplete work is in Review.
- The service projects current handover readiness on every state/command response, including missing-photo count, pending/failed review counts and actionable blockers. This projection is not persisted as authoritative state.
- The UI disables closing-code requests until the first five checks and START pass, and disables issuance until all six pass.
- A rejected direct closing-code request now includes the actual missing prerequisite instead of only the generic message.

Source changes: [execution rules](../src/domain/execution.mjs), [state projection](../server/index.mjs), [guided Completion controls](../src/ui/GuidedPresentation.tsx), [proof and reviewer controls](../src/ui/Proof.tsx), [regression tests](../tests/execution.test.mjs).

## How to reach Outcome in this session

1. Open [the existing journey](http://127.0.0.1:5173/?focus=story&session=93fdba3f-288f-4e55-a8ef-fa06ebba460f), sign in as **Presenter**, reload, and select **Completion**. Do not start a fresh journey or load another checkpoint to recover this job.
2. Select **Record next reference stage** once for each required shot, **11 times** for this approved package. These are labelled sample records; the presentation clock advances to the configured curing boundaries. The existing kit scans already pass, so repeating the kit scan is unnecessary.
3. Under **Proof assessment**, enter a meaningful **Decision reason** of at least 15 characters. Inspect each record, confirm required visible challenges and the paired flood-test result, and select **Pass** for each acceptable reference capture. For genuine field use, this requires actual inspection; failed work must use redo rather than a blanket pass.
4. Select **Run all six warranty checks**. The first five should pass; CLOSE is still expected to be pending.
5. Select **Request homeowner closing code** in Ravi's phone.
6. Expand **Homeowner confirmations & messages** and read the current **CLOSE** code. Enter it under **Homeowner closing code** and select **Confirm handover**. START and the fixed applicator onboarding code are not substitutes for CLOSE.
7. Rerun **Run all six warranty checks**, then select **Issue Water Passport** when eligible.
8. Select **Continue to Outcome** or the **Outcome** chapter.

The Passport is a demo completion record without an active commercial warranty. Reference capture is a demonstration alternative, not evidence that physical work occurred.

## Verification

- A regression test failed before the fix with `STAGE_ORDER` when attempting the first missing capture after early gate evaluation.
- The same test now passes, including repeated checks midway through capture, challenge generation from Review, all required shots, closing verification and issuance.
- Additional readiness tests verify missing photos, unassessed photos, support holds and both homeowner confirmations remain blocking prerequisites.
- Full suite: **73 tests passed, 0 failed**.
- TypeScript checking and production build: **passed**.
- Browser rehearsal: an **in-memory copy** of the exact affected workspace progressed from Review through 11 reference captures, manual assessments, CLOSE and issuance to visible Outcome. The original database record was byte-for-byte unchanged by that rehearsal.
- Live API: the affected workspace reports 11 missing photos, and a premature closing request returns the precise blocker without changing its revision.
- Localhost services were restarted with the fix. The original customer session was not automatically completed, reassessed or reset.

## Follow-up: all 11 photos recorded but review still blocks handover

The latest affected workspace is `b29c6cf0-38cf-4e66-b1a5-ab026a5c87b7`, revision 46 at inspection. A second workspace, `18516e87-ce31-4c7e-89cc-64661a461009`, has the same symptoms. Both contain 11 active photos, 11 null assessments, no failed assessments, verified START and no CLOSE confirmation. The earlier workspace documented above still has zero photos; it is a different session.

### Exact causal chain

1. `CAPTURE_STAGE` saves a photo with `assessment: null`. Reference capture completes the next required shot and advances the demo clock; it never submits an assessment.
2. No background image-processing or AI assessment worker is implemented. Waiting, scanning the kit again or running the six checks cannot change null assessments.
3. The recording button disables when every approved stage has its required shot count. This is the expected end of capture, not an upload failure.
4. `ReviewProof` initializes the decision reason to an empty string. Every Pass/Fail decision is disabled until that reason reaches 15 characters. Before this fix the minimum was unexplained; browser inspection also placed the review form below the initial screen (its top was approximately 939 px at 1440 x 1100 viewport).
5. Challenge-stage passes additionally require explicit challenge confirmation. The flood-test end pass requires an explicit PASS outcome. Previously these requirements could produce a server rejection after clicking Pass rather than explain eligibility beside the photo.
6. Only `ASSESS_CAPTURE`, submitted as admin (or by the authorized Presenter acting as reviewer), sets a photo assessment. Applicators cannot approve their own evidence.
7. Check 5 requires every required shot to have a PASS assessment, correct order/curing, confirmed challenges, a passing paired flood test spanning 24 hours, and no duplicate images. Null assessment alone is sufficient to fail it.
8. `REQUEST_CLOSE` checks the first five requirements and START before issuing CLOSE. Therefore check 6 is a downstream blocker, not a second broken upload or a circular dependency. START is already verified in both affected workspaces.
9. `EVALUATE_GATE` only evaluates current evidence and records a snapshot; it does not inspect or approve photos. `ISSUE_PASSPORT` remains blocked until the final checks pass.

### Root cause and correction

The current blocker is an unexplained handoff from capture to manual review, with silently disabled decision buttons and a generic homeowner message. The earlier Review-to-capture state-machine defect has already been fixed; the latest sessions prove capture now succeeds for all 11 shots.

The UI now labels completed capture as **All stage photos recorded**, explains that saved photos are not processing, provides a **Review 11 pending photos** action that focuses the decision reason, displays the reason minimum and photo-specific confirmation requirements, and states which homeowner confirmation is missing. It preserves manual decisions, role permissions and evidence checks.

### Validation

- The homeowner-message regression failed before the change and passed afterward.
- All 73 tests and the TypeScript/production build passed.
- A headless browser used an in-memory copy of the latest affected workspace: focused review from the new action, entered the reason and confirmations, submitted 11 individual assessments, requested and verified CLOSE, issued the record and reached Outcome.
- State integrity passed, and the persisted customer workspace remained byte-for-byte unchanged. This rehearsal does not approve the actual customer's photos.
