# Production transition dossier

This is the future integration backlog, separated from the accepted local demonstration. It does not authorize deployment, real messages, native releases, payment collection or advertising delivery.

## Reusable assets

The calculator, pack optimizer, package snapshots, state guards, scan classifier, OTP-purpose guards, stage clock logic, manual gate, point ledger, PDF renderer and role-separated screens are reusable prototype assets. The React browser UI needs Android adaptation, device permissions, accessibility, secure media capture and native offline storage work. The local JSON-shaped workspace inside SQLite is a demo authority, not the supplied production Postgres schema.

## Required before a pilot

| Area | Current adapter | Required authority / owner | Acceptance evidence |
| --- | --- | --- | --- |
| Sakhaa booking | Seeded lead and contact fixtures | Sakhaa signed webhooks and idempotent booking API | Real booking, deduplicated delivery, consent, lead reassignment and failure recovery |
| WhatsApp | In-browser conversation and demo codes | Sakhaa test/production numbers, Meta-approved templates and transport receipts | Actual homeowner approval, two bound OTPs, expiry, opt-out and warranty delivery to an authorized number |
| Identity and KYC | Six shared local demo accounts; workspace profile | Ardex KYC/certification authority, individual users and secure session provider | Independent tenant/customer ownership, role policies, revocation, session expiry and audit |
| Products | Global synthetic serial registry | Ardex packaging format, trusted signing keys and registry API | Signature, SKU/batch/quantity, one-time consumption across jobs and atomic offline reconciliation |
| Technical systems | Seven illustrative packages | Ardex technical team | Signed decision rules, product compatibility, substrate exclusions, actual coverage, methods, pack rounding, stage prerequisites, curing and flood criteria |
| Pricing | Illustrative inclusive pack prices and labour bands | Ardex commercial team and dealer agreements | Tax policy, market rates, versioning, labour bands, approved change orders and invoice reconciliation |
| Media | Browser camera, exact byte duplicate hash and manual assessment | Secure capture/storage service and supervisor workflow | Durable media references, encrypted outbox, upload retries, provenance, duplicate policy, challenge OCR if adopted and flood comparison |
| Site proof | Sample/live coordinates and conservative 150 m policy | Approved Ardex field policy | GNSS uncertainty, far outliers, spoofing limitations, audit exceptions and consented location retention |
| Offline | Browser pending commands with conservative conflict stop | Production sync protocol and authoritative backend | Persistent per-user queues, reliable device timestamps, causal stage order, expired challenges, interrupted upload and multi-device conflicts |
| Payments | Applicator-reported direct payment | Approved payment gateway/provider | Signed payment webhooks, partial payments, refunds, reconciliation and verified revenue definition |
| Warranty | Demo Passport/PDF and locally linked Proof ID | Ardex legal/material warranty; applicator workmanship agreement | Approved issuer, scope, exclusions, activation, signatures, revocation, claims, retention and homeowner language |
| Rewards | Held/released ledger using checks 1, 4, 6 | Ardex program rules | Limits on surplus points, scan-versus-application policy, reversals, fraud audit and redemption |
| Quality/routing | Labelled starting score; stored routing preview | Ardex operations | Aggregated job window, missing observations, rated/audited outcomes, tier rules and live routing fairness |
| Ad feedback | Ineligible payload/outcome preview | CHLEAR with platform-specific IDs and explicit permissions | Consented click attribution, matching IDs, event deduplication, value policy and isolated test accounts |
| Annual service/referrals | Planned handoff only | Sakhaa service workflow and customer permissions | Pre-monsoon service preferences, warranty-service versus marketing distinction and no automatic My Lead promotional enrolment |

## Security and operating model

Replace public demo credentials. Implement production HTTPS, secret storage, authorization tied to individual jobs and customers, CSRF protections, login abuse controls, device session rotation, durable transactional storage and media access policies. Current ports deliberately bind to laptop loopback; no external deployment is configured. A customer role in this demo represents fixture households and is not production household isolation.

Production catalog updates should specify how unsent drafts become stale, how approved scope remains frozen, and how change orders are approved. Current catalog edits apply to new demo workspaces only. Routing configuration is a stored preview; it does not replace the fixed Bengaluru booking fixture. Certification is a workspace demonstration state; it must become a shared identity record before real routing.

Independent tamper evidence requires a trusted saved head or external signature/append-only storage. New demo passports identify the issuance event hash with a state digest; a malicious operator who replaces the entire local database can replace both data and hashes. An exact byte duplicate detector does not identify edited copies or establish truthful application.

Include approved multilingual terms and embedded Unicode PDF fonts. Current detailed instructions and PDFs are English; Hindi/Kannada are labelled shell subsets. Accessibility and real low-end Android performance require handset tests.

## Next implementation order

1. Agree warranty issuer, technical systems, approved pricing, QR authority and revenue definition.
2. Confirm Sakhaa webhook/WhatsApp contracts and authorized test credentials/templates.
3. Move domain commands into a production backend with individual identity and job ownership; reconcile the supplied Postgres schema and OpenAPI with observed prototype contracts.
4. Integrate trusted product verification, secure media, supervisor workflow and durable offline reconciliation.
5. Adapt the phone UX to Android; run physical handset, network loss, battery, camera and accessibility tests.
6. Validate real homeowner handover and legal documents. Integrate payments, quality routing and advertising only after their own acceptance gates.

The original documents remain the source archive. Prototype clarifications, tests and release evidence live alongside the code; they do not imply Ardex has approved the illustrative policies.
