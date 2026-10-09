# Super Admin / system owner user flow

Sign in at http://127.0.0.1:5175/admin.html as `superadmin` with `ArdexDemo!2026`. This role has every [Admin operational action](role-admin.md), plus the configuration flows below. It does not automatically grant homeowner, dealer, applicator or Presenter command ownership.

## Operations

Use Overview/Review queue to locate work, Jobs to inspect its linked record, Applicators to manage workspace certification, and the job controls for structural clearance, correction, image review, redo, six-check evaluation, issuance, support and invoice reconciliation. The same evidence and homeowner-confirmation prerequisites apply.

## Catalog pricing

1. Open **Catalog** and inspect current products, units, pack sizes, prices, tolerances and stage templates.
2. Under **Update pack pricing**, select product and pack size, enter a positive inclusive rupee price and choose **Save new catalog version**.
3. The service converts/stores integer paise pricing and creates a new demo catalog version, with an audit entry.
4. New workspaces use the updated catalog; existing workspaces and approved frozen quotes retain their snapshots. This control changes a pack price, not technical product approval or arbitrary stage configuration.

## Account access

1. Open **Accounts** and inspect the six seeded identities and enabled status.
2. Choose **Disable & revoke** to disable an eligible account and delete its active sessions.
3. Choose **Enable** to restore sign-in; changing access also revokes existing sessions.
4. The `superadmin` owner cannot disable itself. No UI for creating individual users or changing/resetting passwords is implemented.

## Routing preview

Open **System**, choose the future routing enablement flag and a radius from 1 to 15 km, then select **Save policy preview**. The setting persists and is audited. Current fixture offers still use the fixed 15-minute acceptance window and Bengaluru eligibility; saving the preview does not activate a generalized routing engine.

## Proposed pilot

Open **Pilot**, inspect local story metrics and outstanding readiness dependencies, choose an accepted-visit target from 1–100 and recruitment weeks from 1–26, then **Save proposed pilot settings**. Settings remain `approved: false`; saving does not approve or launch a field pilot.

## Audit and completion

Review **Audit log** after changes and the relevant record's event history for job decisions. Sign out using the control sidebar. The API permits Super Admin to load checkpoints, but the current control-room UI does not expose a checkpoint selector; the documented UI rehearsal uses Presenter for that action.

[Login details](../LOGIN-DETAILS.md), [all flows](README.md).

Source: `src/ui/AdminApp.tsx`, `src/ui/Operations.tsx`, `server/index.mjs`, `server/database.mjs`.
