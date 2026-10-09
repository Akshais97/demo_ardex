# Homeowner user flow

Sign in at http://127.0.0.1:5173 as `homeowner` with `ArdexDemo!2026`. The app defaults to the connected homeowner conversation. Use the same `?session=...` workspace as the presenter/applicator. Ananya and Meera share this demo account; it is not an individually isolated customer portal.

## Full sequence

1. **Enter the correct record.** Presenter must first start the guided enquiry or create/load a job. An empty workspace cannot be turned into an enquiry by the homeowner role. Choose **Homeowner · connected conversation** for live enquiry, quote and aftercare controls, or **Homeowner · current job** for the message thread.
2. **ARDEX enquiry only:** approve service updates, answer the safety question, choose a visit slot and confirm the address. Refusal stops messaging; structural concerns stop booking. The own-customer route starts from Ravi's customer entry instead.
3. **Wait for visit acceptance and inspection.** Read the applicator introduction and site diagnosis. The homeowner cannot accept a job on Ravi's behalf or calculate a quote.
4. **Review the quote.** Select an eligible option, open **Inspect scope, materials & labour**, and inspect area, pack sizes, scope, stages and total. **View / download quote** exports a real PDF.
5. **Approve or decline.** **Approve this option** freezes scope and price. **Decline proposal** requires Ravi to revise and resend. Superseded/expired quotes cannot be approved; validity is 15 demo days.
6. **Wait for supply readiness.** Ravi sends the kit; the dealer confirms readiness. Shortages and product exceptions are resolved by their assigned owners.
7. **Permit work to start.** Read the generated START code and share it when ready. Ravi enters it in his interface. Codes are job/purpose-bound, expire in 30 demo minutes and are not account passwords.
8. **Follow progress.** Recorded stages remain pending until a human reviewer passes them. Scans and reference imagery alone do not prove correct application.
9. **Raise a concern if needed.** Select **Message an advisor**, enter at least eight characters and **Send concern**. During started work before issuance this pauses handover and clears CLOSE; operations resolution must be followed by fresh confirmation.
10. **Confirm handover.** Once Ravi requests an eligible CLOSE code, read it in the thread and share it if satisfied. Ravi verifies it; Admin still has to run the checks and issue the record.
11. **Keep the issued record.** Download the Water Passport or select **Verify record**. Public verification does not require login. The record is a demonstration without active warranty backing.
12. **Record payment status.** Choose **I paid Ravi directly** or **Payment is pending**. Pending can be updated to paid. Ravi confirms receipt separately; a confirmed receipt locks acknowledgement changes. There is no payment checkout/provider verification.
13. **Give feedback.** Choose one rating from one to five stars after issuance. A rating below four opens operations follow-up; a second rating is rejected.
14. **Choose care and referral.** Select **Record reminder preference** or **No reminder**. Preferences are stored without scheduling. The enquiry website can be shared voluntarily.
15. **Manage messages.** **Stop** prevents further simulated service messages without deleting history; **Resume service updates** explicitly resumes them. Service consent does not add marketing permission.

The Experience selector can show other interfaces, but the homeowner cannot submit applicator, dealer or Admin actions. The conversation has explicit action buttons; it is not an open-ended AI chat or real WhatsApp connection.

Customer details: [Ananya](customer-ananya-terrace.md), [Meera](customer-meera-bathroom.md). [Shared gate rules](README.md). [Login reference](../LOGIN-DETAILS.md).

Source: `src/ui/Workflow.tsx`, `src/ui/JourneyViews.tsx`, `src/ui/Commercial.tsx`, `src/domain/journey.mjs`, `src/domain/quotes.mjs`, `server/index.mjs`.
