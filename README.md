# ARDEX PRO Connected Presentation

Local prototype for the CHLEAR demand -> Sakhaa nurture -> ARDEX PRO close and proof loop. Code is isolated from the source documents in this folder.

## Repository reference guides

- [Running localhost URLs and admin credentials](LOCALHOST-ADMIN-ACCESS.md)

- [Tech stack summary](docs/TECH-STACK.md)
- [Analytics proposal: dashboards, metrics, definitions and implementation priorities](docs/ANALYTICS-PROPOSAL.md)
- [Business analytics HTML concept](public/business-analytics.html) — CRM and AI caller analytics, sales pipeline, aftercare, integration model and a searchable current-app inventory. Open directly offline, or visit http://127.0.0.1:5173/business-analytics.html while the demo is running. All analytics values are fictional sample data.
- [All demo login details and confirmation codes](docs/LOGIN-DETAILS.md)
- [Complete user flows: separate guides for both customers and all six roles](docs/user-flows/README.md)
- [Interactive HTML user-flow guide](public/userflow.html) — open the file directly, or visit http://127.0.0.1:5173/userflow.html while the demo is running. Includes both customers, role filters, approval checks and all full guides; works offline. Regenerate after Markdown changes with `node scripts/generate-userflow.mjs`.

## Open the running demo

The default experience tells Ananya’s terrace story through seven guided chapters: Enquiry, Inspection, Decision, Supply, Exception, Completion and Outcome. Homeowner replies, booking, quote approval, dealer readiness, exact replacement supply and scan, supervisor review, completion and aftercare share one persisted record. Experience also exposes the connected interfaces and homeowner conversation for exploration.

Build tracking stays outside the client-facing page. See PRESENTATION-RUNBOOK.md for the current walkthrough, operating boundaries and checks. AI roles are explicit: the local copy is scripted, approved rules calculate and enforce, and people diagnose and review. A language-model service and real WhatsApp transport have not been connected.

- Connected phones: http://127.0.0.1:5173
- Independent control panel: http://127.0.0.1:5175/admin.html
- Public verification: the Water Passport link or PDF QR for the issued demo record.

Select a role at sign-in. All six demo accounts use `ArdexDemo!2026`.

| Account | Permission |
| --- | --- |
| presenter | Connected pitch actions, seeded checkpoints, clock controls; can demonstrate the three owners and supervisor |
| applicator | Ravi's assigned work, diagnosis, quote, scans, camera, homeowner code entry, reported payments |
| homeowner | Persisted enquiry replies, quote approval, support, payment acknowledgement, rating, care preference and service-message consent |
| dealer | Approved kit readiness, shortage flags, exact registered replacement handoff and invoice declaration |
| admin | Jobs, certification, evidence assessments, rejected-pack resolution, redo, gate, issuance and voiding |
| superadmin | Admin operations plus catalog pricing, routing policy preview and account disablement/revocation |

Roles are checked in the local service. Editing a tab or the actor field does not grant access. App and admin ports have separate HTTP-only sign-in cookies so Presenter and Admin can be open together. Known credentials, local HTTP and simplified shared demo identities are intentional prototype boundaries, not production authentication.

## Launch on this laptop

Node 26.7+ is required for the built-in SQLite runtime. Dependencies are already installed.

Development: `npm run demo` starts the service on 5174, phones on 5173, control on 5175. Open `/admin.html` on the control port.

Compiled fallback: after stopping running services on those ports, run `node scripts/serve-release.mjs`. It serves `dist` on both UI ports, with `/` on 5175 opening admin automatically. This fallback requires Node, but no package installation or internet connection. Start from the app directory or an extracted release folder. Do not run it alongside servers already occupying those ports.

Build: `npm run build`. Rules: `npm test`. Original-document reconciliation: `npm run validate`. Generate fresh sample labels: `npm run qr:stickers`.

## Demo data and review

SQLite is stored in `.runtime/ardex-demo.sqlite`. It holds workspaces, global sample pack consumption, demo accounts, session tokens, catalog and routing previews, and administrative audit records. The first launch seeds six jobs across quote, kit, execution, manual review, completion and product-exception states. Every seeded checkpoint is labelled. Loading another checkpoint archives its prior run and allocates new job identities; it does not claim that intermediate actions happened live.

Approved prices, quantities and stage templates are frozen on the approved quote. Catalog price edits apply to newly created workspaces. Routing edits are a stored and audited preview; generalized routing is still a future integration. The interactive profile is Ravi; KYC/certification is scoped to each demonstration workspace, rather than a production-wide identity authority.

Product units remain distinct. Quantity uses frozen tolerance and necessary whole-pack rounding. Scanned packs measure recorded presence, not measured application. Base points are held until genuine-product, site and both homeowner-confirmation checks pass (1, 4 and 6); warranty requires all six. Missing audit, rating and claims observations retain the labelled starting quality score.

Quote and Passport downloads are actual PDFs with a permanent DEMO / not-active-warranty mark. The Passport includes a verification QR, stage coverage and a frozen issuance Proof ID. New records anchor to the issuance event hash; legacy demo records retain their earlier gate-head anchor. Hashes and state digests detect local changes relative to saved history, not replacement of the entire database.

Camera uses the active browser stream, with retake and confirm. QR decoding is bundled locally. Permission denial has a labelled sample fallback. Offline scans and photos enter a pending browser outbox; they do not become accepted evidence until the service checks them. Reload and duplicate-response retry are tested. Conflicting jobs or revisions retain evidence for explicit review; there is no silent merge. Browser storage can fill and is not encrypted production media storage.

## Boundaries

WhatsApp delivery, commercial packaging authentication, provider-verified payments, ad-platform delivery, AI photo checks, voice coaching, claims and repeat-service automation are not connected. Sample evidence is an illustration. Technical rates, system selection, stage methods, curing, tolerances, pricing and warranty backing need Ardex approval before a pilot.

Physical Android camera and LAN HTTPS have not been tested. A phone's localhost belongs to the phone, so the laptop URL is not a reachable phone deployment. See `PRODUCTION-HANDOFF.md` and `RELEASE-ACCEPTANCE.md` for the next integration work and observed device matrix.

## Visual refresh — 2026-10-04

Six generated mobile-style site photos replace diagnosis diagrams and stage tiles in the applicator, homeowner conversation and admin review. Generated reference captions distinguish them from actual camera evidence. The rendering adapter preserves existing job records, media hashes, permissions and pack identifiers. Repetitive prototype wording was removed from primary screens. The existing v0.3.0 release ZIP remains a historical snapshot; the current source and compiled dist include this refresh.


Official catalogue photography: eight matching product images downloaded from ARDEX ENDURA product pages on 2026-10-04. Provenance is stored in config/product-images.json; the catalogue links each image to its official source. MESH has no confirmed product mapping and remains Photo pending. Existing illustrative commercial values are unchanged.


Applicator management: Applicators now groups job records by member ID. Manage opens a dedicated profile with Overview, Jobs, Certification and Activity. Profile URLs support reload, job links offer a return to the profile, and certification decisions persist through the existing role-checked command service. Certification remains explicitly scoped to the selected workspace. Navigation and isolated save/restore checks passed on 2026-10-04.

