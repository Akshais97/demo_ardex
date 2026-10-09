# Admin / operations and technical-review user flow

Sign in at http://127.0.0.1:5175/admin.html as `admin` with `ArdexDemo!2026`. A linked `?session=...` opens the corresponding customer record; app and admin have separate sign-in cookies.

## Find and inspect work

1. Start in **Overview** for the attention board, pipeline, approved value and recorded direct payments. Seeded jobs remain labelled reference activity.
2. Choose **Record scope**: all work or the linked current customer journey. In **Review queue**, filter attention by owner/search and open its record. Tasks include acceptance, reassignment, shortages, correction, pending/failed evidence, handover, support, invoices and receipt acknowledgement.
3. In **Jobs**, search by job/customer/session, filter status and open detail. Inspect the linked enquiry, customer, applicator, dealer, accepted scope, evidence, decisions and event history. **Open connected phones** returns to the same workspace.

## Prepare and unblock work

- **Applicator certification:** enter a decision reason and set Pending, Verified, Certified or Suspended. **Applicators → Manage** opens Overview, Jobs, Certification and Activity; job links allow return to the profile. Decisions apply to the selected workspace's demo identity, not a production-wide certification authority.
- **Declined/expired offer:** restore eligibility, enter a documented operations reason and **Re-offer eligible visit**. The existing local flow re-offers to Ravi; it is not a general multi-applicator dispatch system.
- **Structural diagnosis:** inspect the diagnosis, record detailed technical clearance and select **Record sample technical clearance**. Clearance binds to that diagnosis; resaving diagnosis invalidates it. Bathroom preparation blocks require actual preparation correction.
- **Shortage:** inspect the dealer issue, record how approved materials became available and select **Resolve material availability**. This permits readiness; it does not approve substitutions.
- **Support:** inspect the customer concern, record the action taken and select **Record support resolution**. This clears an active handover hold but does not restore an invalidated closing code or automatically resume a structurally stopped enquiry.
- **Invoice:** inspect supporting evidence and select **Record invoice reconciliation** for a declared invoice. This does not verify customer payment.

Operational resolution and evidence-assessment reasons generally require at least 15 characters in the relevant controls/rules.

## Review product corrections and evidence

1. Inspect rejected pack records and their replacement chain. For requested replacements, verify the exact dealer-supplied serial was scanned as eligible, document removal/inspection and approve the correction. Preserve the original rejection.
2. In **Proof assessment**, inspect every current image against the frozen stage requirements and enter a detailed decision reason.
3. For a challenge stage, explicitly confirm the code is visibly present. For the ending flood/ponding record, confirm the paired flood-test outcome. Metadata or elapsed time alone does not establish a pass.
4. Choose **Pass** or **Fail** per current capture. Identical image bytes cannot be passed as independent evidence.
5. If work needs redoing, choose **Redo from here** with a reason. The selected and later stages become superseded, work returns to `IN_PROGRESS` and CLOSE is cleared. Ravi must recapture the affected sequence.

## Run checks and issue

1. Select **Run all six warranty checks** and inspect each result. The checks cover genuine packs, correct system, quantity, site, ordered/curing evidence and homeowner confirmations; see the [exact gate criteria](README.md).
2. Once the first five plus START pass, Ravi requests/verifies the homeowner CLOSE code. Admin does not replace this homeowner handoff.
3. Rerun all six checks. A handover-ready state alone does not guarantee issuance; the issuance command rechecks eligibility.
4. Select **Issue Water Passport**. The job becomes completed, gets a public verification token and frozen issuance-event Proof ID, and the homeowner receives the linked demo record.
5. Issued evidence cannot be reassessed or rewritten. If necessary, use the certificate control to void the reference certificate with a detailed reason. Voiding is audited, shows a void status on the record and reverses released points through the ledger.

## Other control-room sections

**Dealers** shows supply/invoice activity. **Rewards & revenue** separates approved quote value, reported direct payments and points; provider-verified receipts remain separate. **Catalog**, **Accounts** and **System** are view-only for ordinary Admin where configuration is restricted. **Pilot** shows proposed scope, story counts and dependencies; it does not authorize field launch. **Audit log** shows recorded account/configuration/command activity; each job also has hash-linked event history.

Admin cannot edit pack prices, routing/pilot settings or account access; those require [Super Admin](role-superadmin.md). Ordinary Admin also cannot use Presenter-only checkpoints or demo-clock commands.

[Login details](../LOGIN-DETAILS.md), [customer Ananya](customer-ananya-terrace.md), [customer Meera](customer-meera-bathroom.md).

Source: `src/ui/AdminApp.tsx`, `ApplicatorProfile.tsx`, `Operations.tsx`, `TechnicalReview.tsx`, `Proof.tsx`, `CertificateControl.tsx`, `src/domain/execution.mjs`, `server/index.mjs`.
