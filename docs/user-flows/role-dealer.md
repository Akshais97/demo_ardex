# Dealer / Akshaya Building Supplies user flow

Sign in at http://127.0.0.1:5173 as `dealer` with `ArdexDemo!2026`. Default Experience is **Dealer experience**. Open the job's same `?session=...`. The shared dealer account represents `dealer-001`, Akshaya Building Supplies.

## Normal order

1. Wait for the homeowner to approve a quote and Ravi to select **Send approved kit list**. Before that, the screen says **Ready for the next order**.
2. The **WhatsApp** tab shows the tagged request: job, customer area, selected package, product-line count, material quote and requesting applicator. This is simulated messaging.
3. Choose **View kit & packing list** or the **Kit order** tab. Check the products, quantities, pack sizes and quoted value against the frozen order.
4. Tick every product line. **Mark kit ready** remains disabled until all lines are checked in the UI.
5. If stock is unavailable while the order is requested, open **Flag an availability issue**, enter at least eight characters and choose **Flag material shortage**. Admin must record the approved-material availability resolution before readiness succeeds. Flagging a shortage does not authorize a substitution.
6. Select **Mark kit ready** once the approved kit is available. The service records readiness, notifies the connected journey and generates the homeowner START code. Ravi handles collection/start and on-site scans separately.
7. The dealer thread shows work underway, then a completed supply-linked record after issuance. Material quote value is kept separate from invoice reconciliation and payment.

## Product correction

1. Ravi requests replacement for an open rejected scan, specifying an approved SKU and pack size.
2. In the correction panel, choose an unused matching registry pack and confirm replacement readiness.
3. The service reserves that exact serial for this job. Another job cannot use its reservation as its own supply.
4. Ravi scans the supplied serial on site.
5. Admin inspects removal/replacement evidence and clears the exception. Dealer readiness alone cannot clear it, and supply does not count as application evidence.

## Invoice declaration

After readiness, use the invoice entry to record a reference and positive material amount. The invoice is saved as `DECLARED`; the implemented flow accepts one invoice record per kit. Admin separately records evidence-based reconciliation to `RECONCILED`. There is no invoice upload/payment gateway flow here, and a declared amount need not automatically equal the quote.

The dealer cannot approve quotes, read homeowner START/CLOSE codes through its role response, diagnose, capture Ravi's work, assess photos, resolve technical issues, reconcile its invoice or issue completion records. The API also checks that the job is tagged to this dealer.

[All handoffs](README.md), [Admin flow](role-admin.md), [login details](../LOGIN-DETAILS.md).

Source: `src/ui/DealerView.tsx`, `src/ui/CorrectionFlow.tsx`, `src/domain/kit.mjs`, `src/domain/journey.mjs`, `server/index.mjs`.
