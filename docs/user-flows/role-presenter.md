# Presenter / full demo user flow

Sign in at http://127.0.0.1:5173 as `presenter` with `ArdexDemo!2026`. This role can demonstrate applicator, homeowner, dealer and supervisor-owned commands, plus scenario seeding and demo-clock actions. It cannot save Super Admin configuration.

## Guided Ananya presentation

1. The default **Experience** is **Present Ananya’s journey**. Choose **Begin Ananya’s journey** on an empty record. Use **Start a fresh journey** to preserve existing work and create another presentation workspace.
2. **Enquiry:** respond as Ananya to service consent, safety, slot and address. The retained website context becomes a booked offer. Continue only after booking.
3. **Inspection:** accept as Ravi, choose sample/live location, record diagnosis/photos/measurements, calculate the plan and send the quote. Continue when the plan is ready.
4. **Decision:** compare and approve Ananya's actual quote. The reference option is Terrace Shield Plus. Approval changes the frozen scope, not just the displayed selection.
5. **Supply:** send the approved kit; switch to dealer's **Kit order**, check all lines and mark readiness. Enter the current homeowner START code as Ravi and confirm start. Resolve shortages through the reviewer if demonstrated.
6. **Exception:** select **Scan the wrong product**, request its correct replacement as Ravi, supply an exact registry pack as dealer, scan it as Ravi, then document/clear the correction as reviewer. Continue once blocking product exceptions resolve.
7. **Completion:** choose **Record the approved kit scans**. Use **Record next reference stage** for every required shot; it advances the presentation clock to the configured boundary and creates labelled sample evidence. Inspect images and manually pass them with reason/challenge/flood decisions. Run checks, request/read/verify CLOSE, rerun checks and issue the record.
8. **Outcome:** inspect approved value, supply, credited packs, evidence, corrections and confirmations. As homeowner, acknowledge payment, rate and choose care; as Ravi, confirm receipt. Open public Passport verification.

Use **Inspect this record** to open http://127.0.0.1:5175/admin.html with the same session, sign in as Admin and show operational decisions independently. Presenter also has an inline reviewer card for the guided demonstration. Chapter navigation is gated by recorded prerequisites, not simply a slideshow.

## Explore two scenarios and checkpoints

Choose **Explore connected interfaces**, **Applicator app**, **Homeowner · connected conversation**, **Homeowner · current job** or **Dealer experience**. Outside the guided story, choose **Terrace · Ardex lead** or **Bathroom · own customer**. Where the checkpoint controls are shown, choose Jump to and select **Show journey**:

| Jump-to label | What is already seeded |
| --- | --- |
| Booked visit | Terrace: offered visit awaiting Ravi's acceptance; bathroom: own-customer job already created |
| Plan options | Accepted/created job, diagnosis and sent quote |
| Materials ready | Approved quote, dealer tagged, kit ready and START code awaiting verification |
| Work started | START verified and approved kit scans seeded |
| Evidence review | Required captures seeded, awaiting manual assessment |
| Product exception | Started work with seeded reused-pack rejection |
| Completed job | Passed review/checks, CLOSE verified, Passport, reported payment and sample rating |

The checkpoint **Product exception** seeds a reused pack; the guided Exception chapter intentionally injects a wrong SKU. These are different rejection examples.

Loading a checkpoint archives the previous run, assigns fresh job identities and labels the new checkpoint. Earlier steps are seeded, not performed live. Changing a scenario selector without **Show journey** does not load it. Pending outbox actions must be dealt with before loading a checkpoint. The scenario picker is separate from the Ananya guided story, which stays terrace-specific.

## Demo clock, evidence and role handoffs

Presenter can advance the sample curing clock and seed kit scans. Ordinary users must follow their own role controls and curing rules. Sample capture deliberately labels generated evidence and does not claim physical work happened instantly. Retained history, revision conflicts, homeowner holds and issuance checks still apply.

For sequential app-role demonstrations, use **Switch role** while keeping the workspace URL. For simultaneous ordinary-user roles, use separate browser contexts. Admin's port has a separate cookie, allowing an independent reviewer alongside Presenter.

Full narratives: [Ananya](customer-ananya-terrace.md), [Meera](customer-meera-bathroom.md). [All login details](../LOGIN-DETAILS.md). [Gate criteria](README.md).

Source: `src/ui/GuidedPresentation.tsx`, `src/ui/Workflow.tsx`, `server/database.mjs`, `server/index.mjs`, `PRESENTATION-RUNBOOK.md`.
