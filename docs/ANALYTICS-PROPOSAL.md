# Analytics section — proposed scope for ARDEX PRO

Prepared on 2026-10-09 from the current application source and customer journeys. This document proposes what an Analytics section can contain; it does not mean these dashboards are already implemented.

The section should answer four questions: **Are enquiries becoming completed jobs? Where is work getting stuck? Is the recorded work passing quality checks? What commercial value has actually been documented?**

## 1. Availability labels

Every metric should state the quality and availability of its underlying data:

| Label | Meaning |
| --- | --- |
| Current records | Can be calculated from persisted demo state, subject to the limitations below. A dashboard/API still needs to be built. |
| Additional tracking | Some source data exists, but reliable histories, timestamps, identities or events must be added. |
| Future integration | Requires a connected external service or a business process the app does not implement. |

The current repository contains synthetic workspaces, checkpoints, sample packs, generated reference photos and an adjustable demo clock. Even a metric calculated correctly from these records is **demo activity**, not field performance. Real-data reporting should remain empty until real operational records exist.

## 2. Suggested Analytics navigation

1. **Overview** — performance summary and items needing attention.
2. **Enquiries & conversion** — acquisition, booking, approval and completion.
3. **Jobs & turnaround** — workload, progress and delays.
4. **Applicators** — assignment, throughput, certification and quality.
5. **Dealers & supply** — readiness, shortages, replacements and invoices.
6. **Products & packages** — system selection and recorded material demand.
7. **Quality & completion records** — evidence, six checks, rework and issuance.
8. **Customer experience** — ratings, support, consent and aftercare preferences.
9. **Commercial value** — quotes, invoices and payment acknowledgements.
10. **Rewards** — held, released, reversed and outstanding points.
11. **System & data quality** — reliability, missing data and audit coverage.
12. **Pilot & growth** — agreed targets, cohorts and future acquisition/retention measures.

These can be tabs within one Analytics section. Start with the highest-priority tabs rather than displaying many empty dashboards.

## 3. Overview dashboard

### Summary cards

| Card | Definition | Availability |
| --- | --- | --- |
| Recorded enquiries | Distinct enquiry/lead records, including enquiries that have not become jobs | Current records; coverage differs between guided and seeded paths |
| Active jobs | Distinct jobs excluding `COMPLETED` and `CANCELLED` | Current records |
| Approved scope value | Sum of frozen approved job totals | Current records |
| Jobs completed | Distinct jobs with an issuance record | Current records |
| Current valid demo Passports | Issued certificates with `ACTIVE_DEMO` status; show voided records separately | Current records |
| Jobs needing attention | Distinct jobs with at least one actionable issue | Current records |
| Outstanding actions | Number of individual attention items; one job can contribute several | Current records |
| Awaiting evidence review | Current, non-superseded captures without an assessment | Current records |
| Average customer rating | Mean recorded rating with rated-job count and rating coverage | Current records |
| Direct receipt acknowledged | Sum of job amounts acknowledged by both homeowner and applicator | Current records; not provider-verified receipts |

### Main visuals

- A stage funnel from enquiry to issued completion record, split by ARDEX and My Lead.
- A job-status bar chart with clickable counts.
- A trend of newly approved jobs and issuance events by reporting period.
- An owner-based attention list: applicator, dealer, reviewer, operations and finance.
- A breakdown of quoted material value, quoted labour, reconciled invoices and acknowledged direct receipts in separate series.

Clicking a card or chart segment should open the contributing records with the same filters applied.

## 4. Enquiries and conversion

| Metric | Definition / purpose | Availability |
| --- | --- | --- |
| Source mix | ARDEX-sourced versus applicator-owned jobs | Current records: `job.mode` / attribution |
| Enquiry outcome | Consent pending/refused, structural stop, visit offered, accepted or unresolved | Current records for supported paths; complete histories need tracking |
| Offer outcome | Offered, accepted, declined, expired and re-offered | Current state available; full attempt history needs event reconstruction/tracking |
| Booking-to-acceptance | Eligible booked ARDEX leads with an accepted visit / eligible booked ARDEX leads | Current records with defined cohort |
| Visit-to-quote | Jobs with a quote sent / jobs with a completed inspection | Current records; use saved diagnosis as the documented inspection milestone |
| Quote-to-approval | Jobs with an approved quote / jobs with at least one sent quote | Current records; count jobs, not every quote version |
| Approval-to-completion | Approved jobs with an issuance record / approved jobs | Current records; show observation window |
| Overall conversion | Issued jobs / eligible enquiries in the same acquisition cohort | Additional tracking for a complete enquiry denominator |
| Quote revisions | Number of quote versions and jobs needing a revision | Current records |
| Drop-off reasons | Declined scope, offer expiry, structural block, consent refusal and cancellation | Partial current reasons; standardized reason categories need tracking |
| Campaign conversion and cost per acquired job | Real campaign-attributed outcomes and spend | Future integration |

Use separate entry funnels:

- **Ananya / ARDEX:** enquiry → service consent → safety triage → booked offer → visit acceptance → diagnosis → quote → approval → completion.
- **Meera / My Lead:** customer entry with service-contact attestation → diagnosis → quote → approval → completion.

My Lead jobs should not be penalized for having no website enquiry or offer-acceptance stage. Applicator consent attestation should also remain distinguishable from direct homeowner consent.

Suggested visuals: source comparison, conversion funnel, quote-outcome bars and a table of stalled enquiries. Do not label a pending recent cohort as failed conversion simply because it has not had time to finish.

## 5. Jobs, turnaround and workload

Include status counts, customer/property type, treated area, assigned applicator, tagged dealer, last successful activity, unresolved blockers and the next responsible role.

Track these intervals where paired timestamps are available:

| Interval | Start → end |
| --- | --- |
| Acceptance time | Offer created → accepted |
| Inspection-to-quote | Saved diagnosis → quote sent |
| Decision time | Quote sent → homeowner approval |
| Supply preparation | Dealer request sent → kit ready |
| Start delay | Kit ready → START verified |
| Execution duration | START verified → CLOSE verified |
| Issuance delay | CLOSE verified → Passport issued |
| Overall job duration | Job created → issuance |
| Review waiting time | Capture received → first reviewer decision |
| Exception turnaround | Issue opened → documented resolution |

Status and several milestone timestamps exist today. Reliable real-world turnaround requires additional tracking: accepted commands store demo timestamps, while server receipt timestamps use real time. Keep these clocks separate. A successful `VERIFY_START` command must be confirmed by verified state, because an incorrect-code command can be recorded without starting work.

Show median, 90th percentile and sample count for completed intervals, plus the current age of open items. Distinguish planned curing time from avoidable waiting. Reviewer SLA targets should be agreed and configurable; the catalog's illustrative targets are not an operational commitment.

Suggested visuals: status distribution, duration by stage, ageing buckets and a sortable delayed-work table. A calendar of promised visits needs structured visit times; current human-readable slot labels are insufficient for reliable scheduling analytics.

## 6. Applicator performance

| Area | Useful measures | Availability |
| --- | --- | --- |
| Workload | Assigned, active, completed and cancelled jobs | Current records |
| Acceptance | Accepted/declined/expired offers and acceptance time | Partial current records; attempt history needs tracking |
| Conversion | Quoted-to-approved jobs and approved-to-issued jobs | Current records |
| Throughput | Completed jobs and treated area by period | Current records; demo-labelled |
| Quality | Failed evidence, redo jobs, gate failures and unresolved pack issues | Current records |
| Customer experience | Mean rating, rating coverage, low-rating jobs and open concerns | Current records |
| Commercial activity | Approved scope value and acknowledged direct receipts | Current records |
| Certification | Current status and workspace certification decisions | Current records; not a central identity authority |
| Capacity | Availability, utilization and demand versus available hours | Additional tracking |

Use an applicator scorecard with links to contributing jobs. Show observed quality separately from the application's starting score and tier. The current score is illustrative and must not be presented as independently measured performance.

Cross-applicator rankings require individual identities, comparable job mix, sample thresholds and an agreed scoring policy. The prototype mainly uses Ravi's shared identity across workspace-scoped profiles, so it does not support a meaningful workforce leaderboard today.

## 7. Dealer and supply performance

- Requested, ready and outstanding kits by tagged dealer.
- Median time from request to readiness, with open-request age.
- Jobs with an open shortage and their affected approved material value.
- Shortage reasons and resolution time, once a durable issue history exists.
- Replacement requests, reserved serials, supplied packs, scanned replacements and awaiting-review corrections.
- Declared versus reconciled invoice count and value.
- Invoice-minus-approved-material-value variance for matched kits, labelled for review rather than automatically treated as an error.

Current records support kit status, shortage state, replacement chains and invoice snapshots. Repeated shortage/support incidents may overwrite prior state, so lifetime incident counts and resolution-time trends need durable event details.

Suggested visuals: readiness ageing, shortage table, replacement-stage funnel and invoice reconciliation queue. Actual inventory availability, stock turnover, delivery punctuality and dealer sell-through need inventory/delivery/ERP integrations; the synthetic registry is not a stock-management ledger.

## 8. Products, packages and material demand

| Measure | What it tells the business | Availability |
| --- | --- | --- |
| Approved package mix | Good/Better/Best and specific system choices by property type | Current records |
| Treated area | Total and median frozen approved area by system | Current records |
| Quoted product demand | Frozen pack count and purchased quantity by SKU and pack size | Current records |
| Credited scanned quantity | Valid/valid-extra pack quantities by SKU and job | Current records |
| Quantity coverage | Credited quantity relative to each approved line's required range | Current records |
| Product exception mix | Wrong system, reused, unknown/provisional and other recorded outcomes | Current records; use actual supported outcome categories |
| Catalog version comparison | Package choices and quote values by frozen catalog version | Current records |
| Real product sales and repeat purchases | Invoiced/fulfilled units in the commercial system | Future integration |

Keep KG, L, SQM and ROLL separate. Scanned packs indicate recorded presence, not measured consumption. Quoted demand is not sales, and reconciliation is a human-recorded decision rather than independent transaction verification.

Suggested visuals: package-share bars, SKU demand table, quantity shortfall list and exception frequency by product. Price comparisons should account for area, pack rounding, package and catalog version.

## 9. Quality, rework and completion records

Give this dashboard a dedicated panel for each of the six checks:

1. Genuine unused packs.
2. Correct system products.
3. Coverage quantity.
4. On-site evidence.
5. Ordered work, curing, visible challenge codes and flood-test outcome.
6. Both homeowner confirmations without an active hold.

For each check, show evaluated jobs, passing jobs, failing jobs and unevaluated jobs separately. A missing evaluation is not a failure. Pre-close evaluations should not make the intentionally missing CLOSE code look like a quality defect.

Additional measures:

- Current captures awaiting review, passed, failed and superseded.
- Jobs needing redo and the stages most frequently reopened.
- Jobs issued without any failed photo assessment or redo; define this separately from the existing first-pass reward rule.
- Required versus recorded stage-photo coverage.
- Challenge-confirmation and paired flood-test completeness.
- Open product corrections and failed location checks.
- Issued, active-demo and voided Passports, with void reasons.
- Jobs awaiting CLOSE versus jobs awaiting issuance after CLOSE.
- History integrity verification failures, if an explicit audit process records them.

Suggested visuals: six-check matrix, failed-stage breakdown, reviewer queue and issuance trend. These measure compliance with the recorded demo workflow, not physical waterproofing durability or an activated commercial warranty. Claims, leakage recurrence and 30/90-day field outcomes need follow-up observations and a claims process.

## 10. Customer experience and aftercare

| Measure | Definition | Availability |
| --- | --- | --- |
| Rating distribution | Counts at each 1–5 rating, mean and rated-job coverage | Current records |
| Low-rating follow-up | Rated jobs below four and their support state | Current records; guided-journey automation coverage must be considered |
| Open concerns | Jobs/enquiries with an open support record | Current records |
| Handover holds | Started, unissued work paused by a customer concern | Current records |
| Consent status | Direct service permission, applicator attestation, messaging stopped/resumed, marketing consent separately | Partial current records; full consent history needs tracking |
| Care preference | Opted in, opted out and not answered | Current records |
| Support response and resolution | Time from concern to first response and final resolution | Additional tracking |
| Customer retention | Repeat completed jobs for a stable customer identity | Additional tracking and individual identity |
| Referral conversion | Referred enquiry → accepted/issued job | Additional tracking; current website sharing has no referral attribution |
| Message delivery and engagement | Delivered, read, responded and failed messages | Future messaging integration |

Show “not answered” separately from “no.” Do not call a care preference a scheduled or delivered reminder. There is no NPS survey: a five-star job rating cannot be converted into a valid Net Promoter Score.

## 11. Commercial value and payment visibility

The dashboard should have separate cards for:

| Card | Source / interpretation |
| --- | --- |
| Approved job value | Frozen total agreed by the homeowner |
| Quoted material value | Material portion of that approved quote |
| Quoted labour value | Labour portion of that approved quote |
| Declared dealer invoices | Invoice amounts recorded by the dealer |
| Reconciled dealer invoices | Declared invoices with a recorded Admin reconciliation |
| Applicator-reported payments | Direct amounts reported by the applicator |
| Homeowner-reported paid value | Amounts marked paid by the homeowner |
| Two-party acknowledged receipts | Direct amount acknowledged by both parties |
| Provider-verified receipts | Unavailable until payment-provider integration; display unavailable rather than an invented value |

These are overlapping views, not additive revenue streams. A homeowner acknowledgement and Ravi's receipt confirmation for the same job must not be counted twice. Track invoice variance and quote value separately from customer payment status.

Useful derived measures include average approved job value, approved value per treated sq ft within a comparable system, and completion-cohort acknowledgement coverage. The current flow does not provide a reliable full receivables ledger for partial payments, refunds or disputes, so avoid claiming exact outstanding debt.

Profit, margin, ARDEX-recognized sales, tax reporting and return on ad spend need costs, fulfillment, accounting and/or verified payment data beyond the current application.

## 12. Rewards and engagement

Show points released, held, reversed and cancelled, calculated from ledger deltas. Display outstanding held balance by job and the verification requirements keeping it held. Include first-pass reward counts and void-related reversals as separate categories.

Use the point ledger rather than adding positive award amounts without their reversals. Redemption, cash-equivalent value, reward liability and expiry analytics need an approved rewards policy and transaction history not provided by the current demo.

## 13. System, data quality and audit

Current persisted records can support audit-action counts, successful sign-in events, configuration changes and missing workflow data. More complete operational analytics need explicit instrumentation:

- API latency and errors by route; denied/failed commands and validation reasons.
- Failed sign-ins and rate-limit events; shared demo-account usage is not individual active-user analytics.
- Offline outbox size, oldest pending item, sync success/failure and conflicts, reported from consenting clients to the service.
- Camera/GPS permission failures and sample fallback usage.
- PDF generation failures, downloads and public verification views.
- Missing milestone data, duplicate identities, invalid histories and excluded-record counts.
- Analytics refresh time, event coverage and data freshness.

Server audit entries mostly record successful mutations and sign-ins; browser failures and the pending outbox are not centrally recorded today. Event payload hashes preserve integrity but do not expose all historical values needed for analysis. Do not infer detailed failure histories from hashes.

## 14. Pilot and growth measures

For an agreed field pilot, track accepted visits against target, recruited and active applicators/dealers, approved jobs, issued records, customer feedback and open technical issues. Keep targets labelled **proposed** until formally approved.

Add these only when supporting collection is available:

- Applicator administration time per job, using measured active work rather than wall-clock curing time.
- 30/90-day customer follow-up completion and observed recurrence.
- Incremental dealer/product sales against an agreed comparison baseline.
- Real campaign spend, attributed enquiries and cost per issued job.
- Model-assisted summary accuracy, human corrections, response time and cost after an AI service is connected.

The current scripted conversation has no AI-model usage or accuracy data. Improved conversion, sales uplift and product durability require a baseline and observations; they cannot be inferred from the demonstration narrative.

## 15. Shared filters, drill-down and exports

All views should support a consistent filter bar:

- Date range and date basis: enquiry creation, approval, issuance or event occurrence.
- Source: ARDEX / My Lead; terrace / bathroom; package and catalog version.
- Applicator, dealer, job status, reviewer/operations owner where individually recorded.
- Consent state, support/shortage status, gate result and payment/invoice status.
- Data class: real operational, live demo, checkpoint-seeded, generated/sample evidence and archived history.
- City/region when multiple supported locations exist; the current demo is predominantly Bengaluru.

Show the reporting timezone, last refresh, numerator, denominator and sample count. Use Asia/Kolkata by default. Represent a zero denominator as “N/A,” not 0%.

Drill-down tables should include job code, source, customer reference, owner, current status, relevant value, data-quality label and an **Open record** link. Offer filtered CSV exports and a printable summary; label values and data class in exports as well.

## 16. Role access

| Role | Proposed analytics access |
| --- | --- |
| Admin | Operational, quality, customer support and reconciliation views within assigned scope |
| Super Admin | Aggregated organization views, data-quality reports, configuration history and export administration |
| Applicator | Own assigned jobs, own feedback, recorded receipts and reward ledger |
| Dealer | Own tagged kits, shortages, replacements and invoices |
| Homeowner | Own job progress, accepted scope, confirmations and completion record; no cross-customer dashboard |
| Presenter | Clearly labelled demonstration analytics |

This is a proposed access model. Implement it in server-side analytics queries; hiding UI controls is insufficient. Current shared accounts and workspace access are not production tenant/customer isolation. Exports should respect the same scope and avoid exposing phone numbers, exact locations, photos or confirmation codes unnecessarily.

## 17. Counting and measurement rules

1. Count distinct stable enquiry/lead/job IDs at the appropriate stage. Do not treat every command, quote version or gate evaluation as another customer or completed job.
2. Exclude archived copies from current-work totals. Preserve distinct historical jobs when appropriate and deduplicate by stable job/event IDs across archive copies. Fresh checkpoint jobs are synthetic new identities, not repeat business.
3. Preserve demo and real classes explicitly. The current `synthetic`, `loadedCheckpoint`, presentation and evidence-mode flags overlap; a production classification policy needs to cover every entry path.
4. For a cohort conversion, retain the same starting population and observation window through every stage. For period activity, count milestone events in that period. Do not mix the two definitions.
5. Separate current backlog snapshots from historical events. Support, shortage, offer and assessment snapshots can be replaced; durable incident/decision records are needed for accurate histories.
6. Distinguish successful state transitions from accepted commands. Verification and repeated commands do not always produce a new business outcome.
7. Keep active versus voided issuance separate; state whether historical completions include later-voided records.
8. Use server receipt time for real action processing and explicit business timestamps for actual milestones. Never use the accelerated demo clock to claim real turnaround or productivity.
9. Store money in integer paise and format rupees only for display. Keep physical product units separate.
10. Show missing/unobserved values and evidence type rather than inventing zeroes or treating sample images as field proof.

## 18. Implementation priorities

### First release: supported by current demo records

Build Overview, Jobs, Quality and Commercial value first. Include status counts, source/package mix, approved value, separate invoice/payment states, review backlog, six-check results, current customer ratings and points. Add record drill-down, demo-data labels, consistent filters and a basic CSV export. No external integrations are needed for these labelled demo aggregates.

### Second release: add dependable tracking

Add individual identities and ownership scopes, durable enquiry/offer/support/shortage histories, first-assessment timestamps, successful transition events, and real-clock milestone instrumentation. Then add turnaround trends, fair applicator/dealer comparisons, SLA alerts, reliable conversion cohorts and system reliability dashboards.

### Third release: connect external outcomes

Add real messaging, campaign/spend attribution, payment-provider verification, inventory/accounting records, care scheduling, referrals and longitudinal field observations. Only then expose delivery rates, acquisition cost, verified collections, repeat business, claims and measurable sales uplift.

## 19. Repository evidence

- [Existing overview, jobs and commercial sections](../src/ui/AdminApp.tsx)
- [Attention board, operational lineage and proposed pilot metrics](../src/ui/Operations.tsx)
- [Persisted records, account sessions and audit storage](../server/database.mjs)
- [Permissions and API projections](../server/index.mjs)
- [Job creation and acquisition attribution](../src/domain/leads.mjs)
- [Customer entry and consent attestation](../src/domain/my-lead.mjs)
- [Quotes and frozen scope](../src/domain/quotes.mjs)
- [Evidence, six checks, issuance and payment reports](../src/domain/execution.mjs)
- [Support, invoices, payment acknowledgement and care preferences](../src/domain/journey.mjs)
- [Reward ledger rules](../src/domain/rewards.mjs)
- [Command events, demo clock and integrity](../src/domain/authority.mjs)
- [Browser polling and offline outbox](../src/adapters/useWorkspace.ts)
- [Production integration dependencies](../PRODUCTION-HANDOFF.md)
- [Customer and role journeys](user-flows/README.md)
