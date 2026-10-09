# Analytics page — CRM, agentic caller ROI and Bengaluru business visibility

Status: planned features only; not an implementation.

## Scope and purpose

All features in this plan will appear on the **Analytics page**, inside the existing Analytics tab of Analytics & Intelligence. All filters, comparisons, analytical expansions and record drill-downs will remain within that page.

The page will give higher management a quick view of demand, process conversion, bottlenecks, geographic business concentration and financial outcomes. It will also provide deeper analytical understanding of how CRM and agentic calling contribute to business return.

This is the selected scope for the next Analytics page enhancement. It narrows the broader inventory in ANALYTICS-PROPOSAL.md; that inventory does not authorize additions elsewhere.

No changes are planned to the Intelligence tab, other application pages, job workflows, calling, scheduling or task management. External integrations and additional tracking described below are data dependencies, not implementation work authorized by this plan.

## 1. Management snapshot

**Placement:** top of the Analytics page.

**Purpose:** let management understand performance at a glance.

Planned metrics:

- Leads acquired.
- Lead-to-approval conversion.
- Approved scope value.
- Completed scope value.
- Acquisition cost per approved job.
- CRM and caller ROI, when supported by sufficient financial and attribution evidence.

Each card will include a definition, an equivalent previous-period comparison and a small trend where comparable history exists. Selecting a card will expand its calculation and contributing-record breakdown within Analytics.

Unavailable financial metrics will show an explanation such as “Cost data required” or “Revenue data required,” rather than zero. Approved scope will not be labelled revenue.

## 2. Conversion journey and process bottlenecks

**Placement:** main process visualization on the Analytics page.

**Purpose:** show where demand progresses and where momentum slows.

The journey will show:

**New lead → Contacted → Qualified → Visit booked → Quote sent → Approved → Completed**

Each milestone will show distinct leads that reached it, percentage of the acquisition cohort and conversion from the preceding milestone. Transition times will show median duration and sample count where paired timestamps exist.

Selecting a milestone will expand its source and locality breakdown. Selecting a transition will reveal waiting-time groups, pending opportunity counts, documented reasons and associated quoted value where applicable.

The page will distinguish:

- Historical milestone conversion from current-stage distribution.
- Pending progression from recorded lost or cancelled outcomes.
- Mature cohorts from recent cohorts still developing.
- ARDEX and My Lead entry paths where earlier milestones differ.

Lead and opportunity identities must be deduplicated. One lead may have multiple calls or quote versions without becoming multiple leads. Job completion requires an issued completion record.

Complete CRM milestone histories are a dependency. Current job statuses alone will not be used to infer a historical lead funnel.

## 3. CRM and agentic caller return

**Placement:** dedicated return and contribution panel on the Analytics page.

**Purpose:** connect useful conversations to outcomes and costs.

| Analytical view | Planned measurements |
| --- | --- |
| Reach | Call attempts, distinct attempted leads, distinct reached leads and reach rate |
| Outcomes | Qualified leads, confirmed bookings, completed inspections and approved jobs |
| Economics | Caller cost, cost per confirmed booking, cost per approved job and associated commercial value |

Users will switch between all leads, AI-assisted leads and human-only leads. Comparisons will expose source mix, observation window and sample sizes. Expanding an outcome will show the recorded contact-to-outcome timeline and attribution rule.

Human handoffs will remain a separate overlapping flag. Not-reached leads will sit outside the reached-lead outcome breakdown. Speed to first attempt and follow-up conversion will appear only when reliable timestamps and linked events exist.

### Financial interpretation

The panel will distinguish these evidence levels:

1. **Associated approved scope:** frozen approved work value associated with CRM or caller activity; not revenue or causal uplift.
2. **Attributed realized revenue:** actual recognized revenue linked through a documented attribution rule.
3. **Attributed contribution:** attributed realized revenue less defined delivery costs.
4. **Incremental ROI:** additional contribution attributable to CRM/calling, less its additional cost, divided by that additional cost.

Incremental ROI (%) = ((incremental contribution before CRM/caller costs − incremental CRM/caller costs) ÷ incremental CRM/caller costs) × 100.

Incremental benefit requires a comparable holdout or controlled rollout. Observed AI-assisted versus human-only differences will not be presented as proven uplift. A zero or unavailable cost denominator will display N/A.

The evaluated business perspective must be explicit. Customer payments to applicators are not automatically ARDEX revenue. Costs will use a defined allocation for CRM, telephony, model usage, human handling and acquisition spending, avoiding double counting.

Actual costs, revenue, contribution economics, linked events and an agreed attribution window are dependencies. Missing integrations will remain visibly unavailable in recorded-data mode.

## 4. Source effectiveness

**Placement:** comparison panel on the Analytics page.

**Purpose:** distinguish lead volume from conversion and financial efficiency.

Planned comparison columns:

**Source | Leads | Approved jobs | Approval rate | Approved scope | Realized revenue | Acquisition spend | Cost per approved job**

Users will sort columns, compare two sources and select a source to filter the conversion journey, caller analysis and map. Rates will expose their numerator and denominator, for example “11 approvals / 24 leads.”

Comparisons will use equivalent observation windows and identify limited samples. Insights will describe observed patterns without treating a small sample as sufficient evidence for budget reallocation.

Website/campaigns, dealer referrals, customer referrals and Applicator/My Lead will appear as recorded channels only when structured attribution supports them. The current application primarily distinguishes ARDEX and My Lead.

Realized revenue and acquisition-efficiency columns depend on connected financial and spend data.

## 5. Bengaluru business heatmap

**Placement:** prominent geographic section on the Analytics page.

**Purpose:** show where more work has been completed, where approved value is concentrated and where recorded purchasing occurs.

The page will use an actual geographic Bengaluru basemap with roads and locality labels, plus a heatmap layer. The default layer will be **Completed work**.

| Layer | Heat weighting | Location and date basis |
| --- | --- | --- |
| Completed work | One count per distinct job with an issued completion record | Job site; issuance date |
| Approved work value | Frozen approved scope amount | Job site; approval date |
| Recorded purchases | Confirmed purchase value | Explicit purchase or delivery location; purchase date |
| Lead demand | One count per distinct enquiry | Recorded enquiry location; creation date |

### Planned interactions

- Switch heatmap layers using labelled controls.
- Zoom, pan, search a locality and reset the view to Bengaluru.
- Select a locality or aggregated cell to see counts, value, source mix and conversion.
- Compare equivalent periods using matched geographic extent and color scales.
- Explicitly apply “Filter dashboard to this area”; panning alone will not silently filter the page.
- Explore a ranked locality table beside the map, also serving as an accessible alternative.

City-scale heat will show concentration. At closer zoom, aggregated cells or clusters will reveal exact counts. Legends will explain the selected weighting and that smoothed heat intensity is not an exact locality total.

### Data integrity and availability

- Count jobs once; photos, scans and duplicate events will not increase intensity.
- Use validated recorded coordinates; missing coordinates remain unmapped.
- Display mapping coverage and exclusions, such as “82 of 95 jobs mapped.”
- Keep fixture locations and sample records in an explicit illustrative mode.
- Never distribute fictional points across Bengaluru to imply actual work.
- Distinguish quoted material demand, scans, confirmed purchases and dealer sales.
- State whether purchase geography means dealer location or customer delivery location.
- Keep customer names and exact household details out of map tooltips; use aggregated business summaries.

Current fixture coordinates cannot establish actual business hotspots. Confirmed geolocated purchases and real work records are dependencies for actual activity layers.

A planned technical direction is MapLibre with a geographic basemap and weighted heatmap. The basemap source will retain visible attribution. Network failure will show an explicit map-unavailable state while the locality table remains usable; offline maps require appropriately licensed local tiles.

References: [MapLibre heatmap example](https://maplibre.org/maplibre-gl-js/docs/examples/heatmap-layer/), [OpenStreetMap tile usage guidance](https://operations.osmfoundation.org/policies/tiles/).

## 6. Commercial value realization and customer growth

**Placement:** lower analytical section on the Analytics page.

**Purpose:** trace agreed work toward execution and documented payment, with future relationship value as supporting analysis.

Four independent measures will be shown:

- Open quoted pipeline: latest valid quotes awaiting approval.
- Approved scope: frozen customer-approved work value.
- Completed scope: approved value linked to issued completion records.
- Receipt acknowledged: amounts acknowledged by both parties.

These measures overlap and will not be summed, stacked as additive value or labelled recognized revenue. Reported payments will remain distinct from two-party acknowledgements and provider-verified payments.

Selecting a measure will expand its source, locality and cohort composition within Analytics. Where event timestamps exist, approved cohorts will show progression to completion and acknowledged payment over time.

An expandable Customer growth analysis will include care preference coverage, care follow-up interest, care booking-to-completion, referral-to-approved-job conversion and repeat-job value. Preference and contact eligibility will remain separate. Only supported observations will receive recorded-data values.

Lifetime value and the assumed ₹4,000-per-interested-job care estimate are deferred. Scheduling, outreach and referral workflows are outside this page's scope.

## Page structure and shared interactions

```text
ANALYTICS
Period · Source · Locality · Compare · Data freshness

Management snapshot

Conversion journey and bottlenecks

Bengaluru business heatmap       Locality performance

CRM and caller return           Source effectiveness

Commercial value realization
[ Customer growth ] [ Detailed trends ] [ Metric definitions ]
```

Detailed trends will use actual date labels. Creation-cohort outcomes and event-date activity will have explicit date bases; selecting one will not silently change the interpretation of another. Global period selections will display the date basis applicable to each panel.

Shared behavior:

- Preserve filters during in-page expansions and record inspection.
- Use a reusable analytical drawer for definitions, calculations, contributing records and recorded timelines.
- Provide keyboard controls, visible focus, labelled legends, table alternatives and mobile layouts.
- Show numerator, denominator, observation window and sample count where relevant.
- Distinguish zero results, missing fields and unavailable integrations.
- Label application records that include seeded journeys; keep illustrative exploration explicitly separate.
- Show reporting cutoff, freshness and Asia/Kolkata timezone; do not combine demo-clock intervals with real-clock intervals.
- Export only the selected analytical scope, with filters, definitions, snapshot and data class.

The visual direction will use the existing navy and teal palette, with restrained amber for waiting or incomplete information. Progressive expansion will keep the default management view concise.

## Delivery sequence

1. Analytics presentation foundation: management snapshot, commercial value, current-stage visibility, shared filters and analytical drill-downs.
2. Geographic visibility: actual Bengaluru basemap, available location layers, mapping coverage and locality table. Unsupported actual-data layers remain unavailable; samples remain explicit.
3. Connected conversion and source analysis when linked CRM histories exist.
4. Caller economics, realized-return analysis and customer-growth metrics as supporting integrations become available.

Each stage remains an Analytics-page change. Building missing external integrations, changing business workflows or modifying other pages requires separate scope.

## Acceptance criteria for future implementation

- Every feature described here is located on the Analytics page.
- Intelligence and all other application sections remain unchanged.
- Management can understand demand, conversion, geographic concentration and commercial progression from the default view.
- Definitions, denominators, date bases and contributing records are available for every metric.
- Filters reconcile across charts, map and tables with clearly stated date semantics.
- Map totals reconcile to mapped records and disclose exclusions.
- Sample records cannot appear as actual Bengaluru work or purchasing.
- Approved scope, payment acknowledgement, revenue, attributed value and incremental ROI remain distinguishable.
- No analytical interaction initiates a call, schedules follow-up or changes application records.
- No implementation is implied by the existence of this plan.
