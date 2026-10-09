# Release acceptance - P3-D08 / v0.3.0

Date: 2026-10-03. Internal prototype checks, not client approval or production certification.

## Observed acceptance

| Drop | Implemented result | Executed evidence |
| --- | --- | --- |
| P3-D01 | Synthetic SKU/batch/size registry; QR camera adapter; valid, duplicate, reused, wrong-SKU and pending outcomes; global consumption | `proof.test.mjs`, `check-permissions.cjs`, `check-resilience.cjs` |
| P3-D02 | Package-specific stages, scan prerequisites, camera capture/retake/confirm, challenge expiry and explicit assessment, method reference and simulated advisory | `execution.test.mjs`, camera test and both cross-port browser journeys |
| P3-D03 | Anchored curing gaps, paired 24-hour flood test, explicit clock advance, durable pending queue and conservative conflict recovery | Stage tests; offline queue reload, lost-response deduplication and changed-job conflict browser checks |
| P3-D04 | All six results and evidence references; tolerance plus necessary pack rounding; conservative accuracy/site checks; reviewed rejection and redo | Gate/domain tests and service-backed failure/recovery rehearsal |
| P3-D05 | Bound closing OTP, exactly one demo certificate, frozen issuance hash, PDF and redacted public verification, rating and void | Both browser journeys, issuance/duplicate tests, public void check, PDF extraction and visual inspection |
| P3-D06 | Reported receipts, held/released/reversed points, independent 1/4/6 reward eligibility, first-pass bonus, starting-score explanation, outcome preview | `release-rules.test.mjs`, completion/reward tests and admin outcome views |
| P3-D07 | Bounded phone templates, WhatsApp-style simulation, independent Admin/Super Admin panel, six roles, named checkpoints and spotlight | `check-release-ui.cjs`, `check-permissions.cjs`, browser screenshots |
| P3-D08 | Complete journeys, correction, cancellation/stale/duplicate guards, resilient reload, release package and production handoff | Unit suite, browser/service acceptance scripts, baseline/source validation and compiled build |

Synthetic jobs include quotation, kit-ready, active work, evidence review, reused product and completed Passport examples. Applicator History opens actual saved demo workspaces. Admin tables, review actions, catalog pricing and account controls call the same local authority as the phones.

## Device matrix and limits

| Surface | Actual observation | Boundary |
| --- | --- | --- |
| Windows Edge 154 | Desktop layout, both journeys, admin review, permission enforcement, PDFs and privacy | Headless automated browser, not a physical live pitch |
| 390 x 844 browser viewport | Phone-width layout and internal scrolling | Responsive viewport, not a physical Android performance test |
| Controlled camera stream | ZXing decoded a real generated QR image from a canvas-backed video stream; JPEG capture/retake/confirm persisted | Tests the adapter/decoder, not a handset lens or Ardex packaging |
| No camera permission/device | Recoverable explanation and explicit sample fallback | Physical Android permission behaviour still requires handset QA |
| Network disconnected in browser | Pending action persisted, survived reload after reconnect, reconciled once | The compiled local service still needs to run; physical phone deployment needs reachable HTTPS |
| Lost response | Server accepted once; retry reused the command ID with no duplicate quantity | Production transport needs its own load and device testing |
| Changed job | Pending evidence retained and not merged | Conservative stop, with review/discard remedy |

## Export and privacy checks

Quote is a multi-option A4 PDF. Passport is a two-page A4 PDF with verification QR, six-check summary and stage coverage. Every page retains the DEMO / not-active-warranty mark. PDFs were downloaded from the app, text-extracted and rendered with Poppler; all pages were visually checked. Public verification excludes name, phone, address and private images. New issuance records bind the Proof ID to the issuance event hash; legacy seed records preserve their earlier anchor.

## Release and recovery

The compiled build and local service are packaged with a consistent SQLite snapshot. Snapshot sign-in tokens are cleared; the six demo accounts remain. The fallback serves local assets with Node and needs no dependency download. Start only one set of services on 5173, 5174 and 5175. The database and source documents are preserved. Named checkpoints archive the replaced demo run; QR consumption remains global across retained jobs.

## Known deferred boundaries

Real WhatsApp, trusted packaging authentication, payment-provider confirmation, live ad delivery, AI photo analysis, voice assistance, claims, shared production KYC and generalized quality routing are outside this local release. Approved technical/legal policies, production security/ownership, physical Android and HTTPS deployment remain future acceptance work. No live sales event or real message was sent.
