import { useMemo, useState, type ReactNode } from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  ArrowDown,
  ArrowDownToLine,
  ArrowRight,
  ArrowUpRight,
  AudioLines,
  BarChart3,
  Check,
  ChevronDown,
  ChevronRight,
  Clock3,
  Database,
  FlaskConical,
  GitBranch,
  Info,
  Layers3,
  MapPin,
  Phone,
  RotateCcw,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  X,
} from 'lucide-react';
import { Badge, Button, Card, Sheet } from './primitives';
import { BusinessMap } from './BusinessMap';
import { SourceComparison } from './SourceComparison';
import {
  DAY,
  SAMPLE,
  SNAPSHOT,
  STAGES,
  date,
  filterCohort,
  fullMoney,
  layerRows,
  layerWeight,
  median,
  money,
  percent,
  returnScenario,
  sum,
  type Layer,
  type Opportunity,
} from './data';
import './analytics.css';

type Detail = {
  title: string;
  description: string;
  rows: Opportunity[];
  definition?: string;
  stageIndex?: number;
};
const layerLabels: Record<Layer, string> = {
  completed: 'Completed work',
  approved: 'Approved value',
  purchases: 'Recorded purchases',
  demand: 'Lead demand',
};
function Heading({
  label,
  title,
  description,
  action,
}: {
  label?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="an-card-heading">
      <div>
        {label && <span className="an-overline">{label}</span>}
        <h3>{title}</h3>
        {description && <p>{description}</p>}
      </div>
      {action}
    </div>
  );
}
function Empty({ children }: { children: ReactNode }) {
  return (
    <div className="an-empty">
      <Database size={22} />
      <p>{children}</p>
    </div>
  );
}
const count = (n: number) => n.toLocaleString('en-IN');

export function AnalyticsDashboard(_props: { work: any[] }) {
  const [days, setDays] = useState(30),
    [source, setSource] = useState('all'),
    [locality, setLocality] = useState('all');
  const [compare, setCompare] = useState(true),
    [layer, setLayer] = useState<Layer>('completed'),
    [mapBasis, setMapBasis] = useState('cohort');
  const [mapPeriod, setMapPeriod] = useState('current'),
    [detailSort, setDetailSort] = useState('waiting'),
    [detailLimit, setDetailLimit] = useState(100);
  const [sort, setSort] = useState('value'),
    [callerGroup, setCallerGroup] = useState('ai'),
    [detail, setDetail] = useState<Detail | null>(null),
    [focus, setFocus] = useState<Opportunity | null>(null);
  const [margin, setMargin] = useState(30),
    [crmCost, setCrmCost] = useState(45000),
    [returnTarget, setReturnTarget] = useState(320),
    [extraJobs, setExtraJobs] = useState(0);
  // This presentation is deliberately one complete fictional cohort. Do not
  // overlay invented caller/spend values on the application's recorded jobs.
  const sample = true,
    end = SNAPSHOT,
    all = SAMPLE;
  const rows = useMemo(
    () => filterCohort(all, days, source, locality, end),
    [all, days, source, locality, end],
  );
  const previous = useMemo(
    () => (days ? filterCohort(all, days, source, locality, end - days * DAY) : []),
    [all, days, source, locality, end],
  );
  const sources = [...new Set(all.map((r) => r.source))];
  const localities = [...new Set(all.map((r) => r.locality))];
  const approvedRows = rows.filter((r) => r.approved > 0),
    completedRows = rows.filter((r) => r.completed > 0);
  const approved = sum(rows, 'approved'),
    completed = sum(rows, 'completed'),
    acquisition = sum(rows, 'acquisitionCost');
  const aiRows = rows.filter((r) => r.ai);
  const callerCost = sum(aiRows, 'callerCost'),
    openQuoted = rows.filter((r) => r.quoted && !r.approved && !r.quoteValidityUnknown);
  const quoteUnknown = rows.some((r) => r.quoteValidityUnknown);
  const creationHistory = all.some((r) => r.createdAt !== undefined);
  function inspect(
    title: string,
    description: string,
    items: Opportunity[],
    definition?: string,
    stageIndex?: number,
  ) {
    setFocus(null);
    setDetailSort('waiting');
    setDetailLimit(100);
    setDetail({ title, description, rows: items, definition, stageIndex });
  }
  const sourceData = sources
    .map((name) => {
      const items = rows.filter((r) => r.source === name),
        won = items.filter((r) => r.approved).length;
      return {
        name,
        items,
        won,
        value: sum(items, 'approved'),
        spend: sum(items, 'acquisitionCost'),
      };
    })
    .filter((s) => s.items.length)
    .sort((a, b) =>
      sort === 'rate'
        ? b.won / b.items.length - a.won / a.items.length
        : sort === 'leads'
          ? b.items.length - a.items.length
          : sort === 'cost'
            ? (a.won ? a.spend / a.won : Infinity) - (b.won ? b.spend / b.won : Infinity)
            : b.value - a.value,
    );
  const stageData = STAGES.map((name, i) => ({
    name: !sample && i === 3 ? 'Job created' : name,
    items: rows.filter((r) =>
      sample
        ? r.milestones[i] !== null
        : i === 3
          ? r.jobRecorded
          : i === 4
            ? r.milestones[4] !== null
            : i === 5
              ? r.approved > 0
              : i === 6
                ? r.completed > 0
                : false,
    ),
    i,
  }));
  const stageMedian = (i: number) =>
    median(
      rows
        .filter((r) => r.milestones[i] && r.milestones[i - 1])
        .map((r) => (r.milestones[i]! - r.milestones[i - 1]!) / DAY),
    );
  const trend = Array.from({ length: 6 }, (_, i) => {
    const span = days || 180,
      start = end - span * DAY + ((span * DAY) / 6) * i,
      finish = start + (span * DAY) / 6;
    const items = rows.filter((r) => r.createdAt && r.createdAt > start && r.createdAt <= finish);
    return {
      label: date(start + DAY),
      leads: items.length,
      approved: items.filter((r) => r.approved).length,
    };
  });
  const mapEnd = end - (mapPeriod === 'previous' && days ? days * DAY : 0);
  const mapCohort = mapPeriod === 'previous' && days ? previous : rows;
  const mapBase =
    mapBasis === 'cohort'
      ? mapCohort
      : all.filter((r) => {
          const at =
            layer === 'completed'
              ? r.milestones[6]
              : layer === 'approved'
                ? r.milestones[5]
                : layer === 'purchases'
                  ? r.purchaseAt
                  : r.createdAt;
          return (
            !!at &&
            (days === 0 || (at > mapEnd - days * DAY && at <= mapEnd)) &&
            (source === 'all' || r.source === source) &&
            (locality === 'all' || r.locality === locality)
          );
        });
  const mappedRows = layerRows(mapBase, layer),
    areaData = [...new Set(mappedRows.map((r) => r.locality))]
      .map((name) => {
        const items = mappedRows.filter((r) => r.locality === name);
        return { name, items, value: items.reduce((n, r) => n + layerWeight(r, layer), 0) };
      })
      .sort((a, b) => b.value - a.value);
  const selectedCaller =
    callerGroup === 'all'
      ? rows
      : callerGroup === 'ai'
        ? aiRows
        : rows.filter((r) => r.ai === false);
  const callerReached = selectedCaller.filter((r) =>
    callerGroup === 'human' ? r.milestones[1] : r.reached || (!r.ai && r.milestones[1]),
  );
  const callerBooked = callerReached.filter((r) => r.milestones[3]);
  const averagePaid = completedRows.length
    ? sum(completedRows, 'completed') / completedRows.length
    : approvedRows.length
      ? approved / approvedRows.length
      : sum(SAMPLE, 'completed') / SAMPLE.filter((r) => r.completed).length;
  const scenarioCost = crmCost + callerCost;
  const {
    baselineJobs,
    jobs: assumedJobs,
    contribution: incrementalContribution,
    roi: scenarioRoi,
    breakEven,
  } = returnScenario(scenarioCost, averagePaid, margin, returnTarget, extraJobs);
  const waitingAge = (r: Opportunity) => {
    const at = detail?.stageIndex !== undefined ? r.milestones[detail.stageIndex] : r.createdAt;
    return at && end >= at ? (end - at) / DAY : null;
  };
  const detailRows = detail
    ? [...detail.rows].sort((a, b) =>
        detailSort === 'value'
          ? Math.max(b.approved, b.quoted) - Math.max(a.approved, a.quoted)
          : (waitingAge(b) ?? -1) - (waitingAge(a) ?? -1),
      )
    : [];
  const metrics = [
    {
      title: sample ? 'New CRM leads' : 'Recorded journeys',
      value: count(rows.length),
      icon: Users,
      items: rows,
      note: sample ? 'Distinct leads in this cohort' : 'Includes seeded application journeys',
      now: rows.length,
      prior: previous.length,
      definition:
        'Distinct acquisition identities in the selected creation cohort. Application records are workspace journeys, not a complete CRM lead denominator.',
    },
    {
      title: 'Lead-to-approval',
      value: sample ? percent(approvedRows.length, rows.length) : 'Unavailable',
      icon: GitBranch,
      items: approvedRows,
      note: sample
        ? `${approvedRows.length} approved / ${rows.length} leads`
        : 'Complete CRM denominator required',
      now: rows.length ? approvedRows.length / rows.length : 0,
      prior: previous.length ? previous.filter((r) => r.approved).length / previous.length : 0,
      definition:
        'Distinct approved opportunities divided by distinct leads in the same acquisition cohort. Current job states cannot reconstruct the full lead funnel.',
    },
    {
      title: 'Approved scope',
      value: money(approved),
      icon: TrendingUp,
      items: approvedRows,
      note: 'Customer-agreed work · not revenue',
      now: approved,
      prior: sum(previous, 'approved'),
      definition:
        'Sum of frozen approved quote amounts, counting each opportunity once. This includes later completed work and is not collected revenue.',
    },
    {
      title: 'CRM + AI return',
      value: `+${scenarioRoi.toFixed(0)}%`,
      icon: Target,
      items: approvedRows,
      note: 'Illustrative ROI · selected scenario',
      now: scenarioRoi,
      prior: 0,
      definition: `Modelled return, not observed uplift. Assumes ${assumedJobs} additional paid jobs at ${fullMoney(averagePaid)} average value, ${margin}% contribution margin and ${fullMoney(scenarioCost)} CRM + caller cost. The chosen demo target sizes the assumed job count. See the ROI scenario panel to change these assumptions. Acquisition cost per approval remains in the source-quality table.`,
    },
  ];
  function exportMetrics() {
    const contents = [
      [
        'Data class',
        sample ? 'Fictional illustrative CRM' : 'Application records include seeded demo journeys',
      ],
      ['Snapshot', new Date(end).toISOString()],
      ['Timezone', 'Asia/Kolkata'],
      ['Cohort days', days || 'All time'],
      ['Source', source],
      ['Locality', locality],
      ['Metric', 'Value'],
      ['Distinct journeys', rows.length],
      ['Approved opportunities', approvedRows.length],
      ['Approved scope INR', approved],
      ['Completed scope INR', completed],
      ['Receipt acknowledged INR', sum(rows, 'acknowledged')],
      ['Acquisition cost INR', sample ? acquisition : 'Unavailable'],
      ['Caller cost INR', sample ? callerCost : 'Unavailable'],
      ['ROI data class', 'Illustrative target scenario; not measured incremental ROI'],
      ['Scenario ROI percent', scenarioRoi.toFixed(1)],
      ['Scenario additional jobs assumed', assumedJobs],
      ['Scenario contribution margin percent', margin],
      ['Scenario CRM plus caller cost INR', scenarioCost],
      ['Scenario additional contribution INR', incrementalContribution],
      [],
      [
        'Record ID',
        'Source',
        'Locality',
        'Created',
        'Stage',
        'Approved INR',
        'Completed INR',
        'Acknowledged INR',
      ],
      ...rows.map((r) => [
        r.code,
        r.source,
        r.locality,
        r.createdAt ? new Date(r.createdAt).toISOString() : 'Not recorded',
        r.currentStage,
        r.approved,
        r.completed,
        r.acknowledged,
      ]),
    ];
    const csv =
      '\uFEFF' +
      contents
        .map((row) => row.map((v) => '"' + String(v).replaceAll('"', '""') + '"').join(','))
        .join('\r\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = `ardex-analytics-demo-${date(end).replaceAll(' ', '-')}.csv`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return (
    <div className="an-dashboard">
      <div className="an-titlebar">
        <div>
          <div className="an-overline">
            <span className="an-live-dot" />
            BUSINESS PERFORMANCE / BENGALURU
          </div>
          <h2>
            Business, in perspective<span>.</span>
          </h2>
          <p>See how demand becomes work. Understand what drives the return.</p>
        </div>
        <Button variant="outline" onClick={exportMetrics}>
          <ArrowDownToLine size={15} />
          Export report
        </Button>
      </div>
      <div className="an-toolbar">
        <div className="an-mode" aria-label="Analytics demo dataset">
          <Badge>
            <FlaskConical size={14} />
            90-day connected demo
          </Badge>
        </div>
        <div className="an-filter-group">
          <label>
            <span>Lead cohort</span>
            <select
              aria-label="Analytics lead cohort"
              disabled={!sample && !creationHistory}
              value={days}
              onChange={(e) => {
                setDays(+e.target.value);
                setMapPeriod('current');
              }}
            >
              <option value={7}>Last 7 days</option>
              <option value={30}>Last 30 days</option>
              <option value={90}>Last 90 days</option>
              <option value={0}>
                {!sample && !creationHistory ? 'All records · dates unavailable' : 'All time'}
              </option>
            </select>
          </label>
          <label>
            <span>Source</span>
            <select
              aria-label="Analytics lead source"
              value={source}
              onChange={(e) => setSource(e.target.value)}
            >
              <option value="all">All sources</option>
              {sources.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </label>
          <label>
            <span>Locality</span>
            <select
              aria-label="Analytics locality"
              value={locality}
              onChange={(e) => setLocality(e.target.value)}
            >
              <option value="all">All Bengaluru</option>
              {localities.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </label>
        </div>
        <Button
          variant="ghost"
          size="sm"
          aria-pressed={compare}
          disabled={!days}
          onClick={() => {
            setCompare(!compare);
            setMapPeriod('current');
          }}
        >
          {compare ? <Check size={14} /> : <Layers3 size={14} />}Compare
        </Button>
      </div>
      <div className="an-data-note">
        <Info size={15} />
        <span>
          {sample ? (
            <>
              <b>Illustrative CRM dataset.</b> 90 days of fictional CRM, AI calling and field
              execution activity. All dashboard figures are demo data, not live application results.
            </>
          ) : (
            <>
              <b>Application records.</b> Includes seeded demo journeys and demo-clock timestamps.
              CRM, caller, spend and purchase data are unavailable.
            </>
          )}
        </span>
        <span className="an-snapshot">{date(end)} 2026 · IST</span>
      </div>
      {(source !== 'all' || locality !== 'all') && (
        <div className="an-active-filters">
          <span>Viewing</span>
          {source !== 'all' && (
            <Button variant="outline" size="sm" onClick={() => setSource('all')}>
              {source}
              <X size={12} />
            </Button>
          )}
          {locality !== 'all' && (
            <Button variant="outline" size="sm" onClick={() => setLocality('all')}>
              {locality}
              <X size={12} />
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSource('all');
              setLocality('all');
            }}
          >
            <RotateCcw size={12} />
            Clear filters
          </Button>
        </div>
      )}
      <div className="an-metrics">
        {metrics.map((m, i) => {
          const change = m.prior ? (m.now / m.prior - 1) * 100 : null;
          return (
            <button
              className={`an-metric ${i === 2 ? 'an-metric-featured' : ''}`}
              key={m.title}
              onClick={() => inspect(m.title, m.note, m.items, m.definition)}
            >
              <div className="an-metric-top">
                <span>{m.title}</span>
                <m.icon size={17} />
              </div>
              <strong>{m.value}</strong>
              <span className="an-metric-caption">{m.note}</span>
              <div className="an-metric-bottom">
                {i === 3 ? (
                  <small>300%+ return scenarios · explore assumptions ↗</small>
                ) : sample && compare && days ? (
                  <>
                    <span
                      className={
                        change !== null && (i === 3 ? change > 0 : change < 0)
                          ? 'an-change negative'
                          : 'an-change'
                      }
                    >
                      {change === null
                        ? 'New activity'
                        : `${change >= 0 ? '+' : ''}${change.toFixed(1)}%`}
                    </span>
                    <small>vs previous {days} days</small>
                  </>
                ) : (
                  <small>
                    {sample ? 'Selected acquisition cohort' : 'Recorded state · demo activity'}
                  </small>
                )}
                <ArrowUpRight size={14} />
              </div>
            </button>
          );
        })}
      </div>
      <div className="an-section-intro">
        <div>
          <span className="an-section-number">01</span>
          <h3>From interest to approved work</h3>
        </div>
        <span>One journey. Every transition visible.</span>
      </div>
      <div className="an-conversion-grid">
        <Card className="an-journey-card">
          <Heading
            title={sample ? 'The conversion journey' : 'Recorded job progression'}
            description={
              sample
                ? 'Distinct leads reaching each milestone in the selected creation cohort.'
                : 'Documented milestones only. Early CRM stages are not connected.'
            }
            action={
              <Badge>
                <GitBranch size={11} />
                {sample ? 'CRM + field execution' : 'Application records'}
              </Badge>
            }
          />
          <div className="an-journey">
            {stageData.map((s, i) => {
              const unavailable = !sample && i < 3;
              return (
                <div className="an-stage-wrap" key={s.name}>
                  <button
                    className={`an-stage ${i === 5 ? 'an-stage-won' : ''}`}
                    disabled={unavailable}
                    onClick={() =>
                      inspect(
                        s.name,
                        `${s.items.length} distinct ${sample ? 'leads' : 'journeys'} reached this milestone.`,
                        s.items,
                        'Milestone reached, not current-stage occupancy. Later stages may overlap earlier ones.',
                      )
                    }
                  >
                    <span className="an-stage-order">
                      0{i + 1}
                      <i />
                    </span>
                    <strong>{unavailable ? '—' : count(s.items.length)}</strong>
                    <span>{s.name}</span>
                    <small>
                      {unavailable
                        ? 'Not connected'
                        : percent(s.items.length, rows.length) + ' of cohort'}
                    </small>
                    <div className="an-stage-track">
                      <i style={{ width: percent(s.items.length, Math.max(1, rows.length)) }} />
                    </div>
                  </button>
                  {i < 6 && (
                    <button
                      className="an-transition"
                      disabled={unavailable || (!sample && i === 2)}
                      aria-label={`Inspect ${s.name} to ${STAGES[i + 1]}`}
                      onClick={() =>
                        inspect(
                          `${s.name} → ${STAGES[i + 1]}`,
                          'Reached the first milestone; next milestone not recorded.',
                          s.items.filter((r) => !r.milestones[i + 1]),
                          'Pending progression is not a lost opportunity. Waiting age starts at the preceding milestone.',
                          i,
                        )
                      }
                    >
                      <ChevronRight size={13} />
                      <span>
                        {unavailable ? '—' : percent(stageData[i + 1].items.length, s.items.length)}
                      </span>
                    </button>
                  )}
                </div>
              );
            })}
          </div>
          <div className="an-journey-footer">
            <Clock3 size={14} />
            <span>
              {sample
                ? `Quote → approval: ${stageMedian(5)?.toFixed(1) || '—'} days median · ${rows.filter((r) => r.milestones[4] && r.milestones[5]).length} paired observations`
                : 'Current status is not a historical conversion rate. Missing events remain unknown.'}
            </span>
          </div>
        </Card>
        <Card className="an-trend-card">
          <Heading
            title="Demand & decisions"
            description="Current outcomes, grouped by lead creation date."
          />
          <div className="an-chart-legend">
            <span>
              <i />
              New leads
            </span>
            <span>
              <i />
              Approved leads
            </span>
          </div>
          {!sample && !creationHistory ? (
            <Empty>
              Lead creation history is not available in this record feed. An acquisition trend
              cannot be calculated.
            </Empty>
          ) : (
            <div className="an-chart">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trend} margin={{ left: -25, right: 5, top: 10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="an-lead-fill" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="#10958b" stopOpacity={0.18} />
                      <stop offset="100%" stopColor="#10958b" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} stroke="#eaf0ee" />
                  <XAxis
                    dataKey="label"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: '#84928e' }}
                    minTickGap={12}
                  />
                  <YAxis
                    allowDecimals={false}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: '#84928e' }}
                  />
                  <Tooltip
                    contentStyle={{ borderRadius: 10, border: '1px solid #dce6e0', fontSize: 12 }}
                  />
                  <Area
                    name="New leads"
                    type="monotone"
                    dataKey="leads"
                    stroke="#10958b"
                    strokeWidth={2}
                    fill="url(#an-lead-fill)"
                    isAnimationActive={false}
                  />
                  <Area
                    name="Approved leads"
                    type="monotone"
                    dataKey="approved"
                    stroke="#7b9cbd"
                    strokeWidth={2}
                    fill="transparent"
                    isAnimationActive={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
          <p className="an-footnote">
            Creation-cohort outcomes; not approvals occurring on each date.
          </p>
        </Card>
      </div>
      <div className="an-bottlenecks">
        <span>
          <Clock3 size={15} />
          Where progress is waiting
        </span>
        {[
          {
            title: 'Qualified, not booked',
            items: sample ? rows.filter((r) => r.milestones[2] && !r.milestones[3]) : [],
            connected: sample,
            stageIndex: 2,
          },
          {
            title: 'Quotes awaiting decision',
            items: openQuoted,
            connected: !quoteUnknown,
            stageIndex: 4,
          },
          {
            title: 'Attempted, never reached',
            items: aiRows.filter((r) => !r.reached),
            connected: sample,
            stageIndex: undefined,
          },
        ].map((b) => (
          <button
            key={b.title}
            disabled={!b.connected}
            onClick={() =>
              inspect(
                b.title,
                'Analytical breakdown only. No call, task or follow-up is scheduled.',
                b.items,
                undefined,
                b.stageIndex,
              )
            }
          >
            <b>{b.connected ? b.items.length : '—'}</b>
            <span>{b.title}</span>
            <ArrowUpRight size={14} />
          </button>
        ))}
      </div>
      <div className="an-section-intro">
        <div>
          <span className="an-section-number">02</span>
          <h3>A city-wide view of business</h3>
        </div>
        <span>
          <MapPin size={13} />
          Bengaluru, Karnataka
        </span>
      </div>
      <Card className="an-geography">
        <Heading
          title="Where the work happens"
          description="A real Bengaluru basemap. Activity is labelled by its underlying data."
          action={
            <Badge>
              <MapPin size={11} />
              Geographic performance
            </Badge>
          }
        />
        <div className="an-map-controls">
          <div className="an-segments" role="group" aria-label="Map activity layer">
            {(Object.keys(layerLabels) as Layer[]).map((key) => (
              <Button
                key={key}
                variant="ghost"
                size="sm"
                aria-pressed={layer === key}
                onClick={() => setLayer(key)}
              >
                {layerLabels[key]}
              </Button>
            ))}
          </div>
          <label className="an-map-basis">
            Period
            <select
              aria-label="Map comparison period"
              value={mapPeriod}
              disabled={!compare || !days}
              onChange={(e) => setMapPeriod(e.target.value)}
            >
              <option value="current">Current period</option>
              <option value="previous">Previous {days} days</option>
            </select>
          </label>
          <label className="an-map-basis">
            Date basis
            <select
              aria-label="Map date basis"
              value={mapBasis}
              onChange={(e) => setMapBasis(e.target.value)}
            >
              <option value="cohort">Lead creation cohort</option>
              <option value="activity">Activity date</option>
            </select>
          </label>
        </div>
        <div className="an-map-grid">
          <BusinessMap
            rows={mappedRows}
            layer={layer}
            sample={sample}
            selected={locality}
            onSelect={(name) =>
              inspect(
                `${name} · ${layerLabels[layer]}`,
                'Select “Filter dashboard” below to apply this locality to every panel.',
                mappedRows.filter((r) => r.locality === name),
              )
            }
          />
          <div className="an-localities">
            <div className="an-locality-head">
              <span>LOCALITY</span>
              <span>{layer === 'approved' || layer === 'purchases' ? 'VALUE' : 'JOBS'}</span>
            </div>
            {areaData.length ? (
              areaData.slice(0, 8).map((a, i) => (
                <button
                  className="an-locality-row"
                  key={a.name}
                  onClick={() =>
                    inspect(
                      `${a.name} · ${layerLabels[layer]}`,
                      `${a.items.length} contributing records · ${mapBasis === 'cohort' ? 'lead creation cohort' : 'activity-date window'}.`,
                      a.items,
                    )
                  }
                >
                  <span className="an-locality-rank">{String(i + 1).padStart(2, '0')}</span>
                  <span className="an-locality-name">
                    <b>{a.name}</b>
                    <i>
                      <em
                        style={{ width: `${(a.value / Math.max(1, areaData[0].value)) * 100}%` }}
                      />
                    </i>
                  </span>
                  <strong>
                    {layer === 'approved' || layer === 'purchases' ? money(a.value) : a.value}
                  </strong>
                  <ChevronRight size={12} />
                </button>
              ))
            ) : (
              <Empty>
                {!sample && layer === 'purchases'
                  ? 'Purchase integration is not connected. Quotes and scans are not confirmed purchases.'
                  : 'No activity for this layer and selection.'}
              </Empty>
            )}
            <div className="an-locality-summary">
              <span>
                {layerLabels[layer]} · {mapPeriod} period
              </span>
              <strong>
                {!sample && layer === 'purchases'
                  ? 'Unavailable'
                  : layer === 'approved' || layer === 'purchases'
                    ? money(areaData.reduce((n, a) => n + a.value, 0))
                    : count(mappedRows.length)}
              </strong>
              <small>
                {mapBasis === 'cohort'
                  ? 'Outcomes for the selected acquisition cohort'
                  : 'Events inside the selected reporting period'}
              </small>
            </div>
          </div>
        </div>
        <div className="an-map-note">
          <Info size={13} />
          <span>
            {sample
              ? 'Heat points are fictional, distributed across real Bengaluru localities. They do not represent actual customer work.'
              : 'Recorded coordinates may be fixture sites. Unmapped records are excluded; exact household details are not exposed.'}{' '}
            Purchases use delivery-site geography.
          </span>
        </div>
      </Card>
      <div className="an-section-intro">
        <div>
          <span className="an-section-number">03</span>
          <h3>Conversations with a commercial outcome</h3>
        </div>
        <span>Reach → next step → agreed work</span>
      </div>
      <div className="an-commercial-grid">
        <Card className="an-caller">
          <Heading
            label="AGENTIC CALLER PERFORMANCE"
            title="A useful conversation moves work forward."
            action={
              <span className="an-icon-tile">
                <AudioLines size={20} />
              </span>
            }
          />
          <div className="an-caller-select">
            <select
              aria-label="Caller comparison group"
              value={callerGroup}
              onChange={(e) => setCallerGroup(e.target.value)}
            >
              <option value="ai">AI-assisted leads</option>
              <option value="human">Human-only leads</option>
              <option value="all">All leads</option>
            </select>
            <Badge>{sample ? 'Observed sample association' : 'Integration unavailable'}</Badge>
          </div>
          {!sample ? (
            <Empty>
              Connect CRM and telephony events to measure reach, booking, handoffs and caller costs.
              No caller results are inferred from job status.
            </Empty>
          ) : (
            <>
              <div className="an-caller-stats">
                {[
                  {
                    label:
                      callerGroup === 'human'
                        ? 'Human-managed leads'
                        : callerGroup === 'all'
                          ? 'Leads in group'
                          : 'Distinct attempted leads',
                    value: callerGroup === 'ai' ? aiRows.length : selectedCaller.length,
                  },
                  { label: 'Leads reached', value: callerReached.length },
                  { label: 'Confirmed bookings', value: callerBooked.length },
                ].map((s) => (
                  <button
                    key={s.label}
                    onClick={() =>
                      inspect(
                        s.label,
                        'Distinct leads in the selected caller group.',
                        s.label === 'Leads reached'
                          ? callerReached
                          : s.label === 'Confirmed bookings'
                            ? callerBooked
                            : selectedCaller,
                      )
                    }
                  >
                    <strong>{s.value}</strong>
                    <span>{s.label}</span>
                  </button>
                ))}
              </div>
              <Tabs.Root defaultValue="outcomes" className="an-tabs">
                <Tabs.List aria-label="Caller analysis">
                  <Tabs.Trigger value="outcomes">Business outcomes</Tabs.Trigger>
                  <Tabs.Trigger value="economics">Cost & contribution</Tabs.Trigger>
                </Tabs.List>
                <Tabs.Content value="outcomes">
                  <div className="an-outcome-list">
                    {[
                      {
                        label: 'Visit booked or later',
                        items: callerReached.filter((r) => r.milestones[3]),
                        color: '#0b8c7f',
                      },
                      {
                        label: 'Qualified, booking pending',
                        items: callerReached.filter((r) => r.milestones[2] && !r.milestones[3]),
                        color: '#87a9bd',
                      },
                      {
                        label: 'Contacted, qualification pending',
                        items: callerReached.filter((r) => !r.milestones[2]),
                        color: '#c9a568',
                      },
                    ].map((o) => (
                      <button
                        key={o.label}
                        onClick={() =>
                          inspect(
                            o.label,
                            'One latest outcome per reached lead. Handoffs may overlap.',
                            o.items,
                          )
                        }
                      >
                        <span>
                          {o.label}
                          <b>
                            {o.items.length}
                            <small>{percent(o.items.length, callerReached.length)}</small>
                          </b>
                        </span>
                        <i>
                          <em
                            style={{
                              width: percent(o.items.length, Math.max(1, callerReached.length)),
                              background: o.color,
                            }}
                          />
                        </i>
                      </button>
                    ))}
                  </div>
                  <div className="an-caller-flags">
                    <span>
                      <Phone size={12} />
                      {selectedCaller.reduce((n, r) => n + (r.attempts || 0), 0)} AI attempts
                    </span>
                    <span>
                      <Users size={12} />
                      {selectedCaller.filter((r) => r.handoff).length} human handoffs
                    </span>
                  </div>
                </Tabs.Content>
                <Tabs.Content value="economics">
                  <div className="an-economic-list">
                    <div>
                      <span>Caller cost</span>
                      <b>{fullMoney(sum(selectedCaller, 'callerCost'))}</b>
                    </div>
                    <div>
                      <span>Cost / confirmed booking</span>
                      <b>
                        {callerBooked.length
                          ? money(sum(selectedCaller, 'callerCost') / callerBooked.length)
                          : 'N/A'}
                      </b>
                    </div>
                    <div>
                      <span>Associated approved scope</span>
                      <b>
                        {money(
                          sum(
                            selectedCaller.filter((r) => r.reached),
                            'approved',
                          ),
                        )}
                      </b>
                    </div>
                    <div>
                      <span>Associated receipt acknowledgements</span>
                      <b>{money(sum(callerReached, 'acknowledged'))}</b>
                    </div>
                  </div>
                  <p className="an-footnote">
                    Sample telephony + model cost: ₹18 per AI attempt. Human handling costs are
                    excluded. Group comparisons are observational.
                  </p>
                </Tabs.Content>
              </Tabs.Root>
              <div className="an-insight">
                <Sparkles size={16} />
                <p>
                  <b>
                    {percent(callerBooked.length, callerReached.length)} of reached leads in this
                    group booked a visit.
                  </b>
                  <span>
                    Temporal association in fictional data. It does not establish incremental sales.
                  </span>
                </p>
              </div>
            </>
          )}
        </Card>
        <Card className="an-roi">
          <Heading
            label="RETURN ON INVESTMENT"
            title="Model a 300%+ return."
            action={<Badge className="an-badge-amber">Illustrative ROI</Badge>}
          />
          <p className="an-roi-copy">
            Choose a successful operating scenario to see the additional paid jobs needed for a
            300%+ return on CRM and AI calling. These are modelled assumptions, not measured uplift.
          </p>
          <div className="an-roi-result">
            <span>ILLUSTRATIVE NET RETURN · 300%+ SCENARIOS</span>
            <strong>
              {sample && averagePaid > 0 && scenarioRoi !== null
                ? `${scenarioRoi >= 0 ? '+' : ''}${scenarioRoi.toFixed(0)}%`
                : 'Unavailable'}
            </strong>
            <small>
              {sample
                ? `${breakEven ?? '—'} additional paid job(s) to break even`
                : 'Connected costs and financial outcomes required'}
            </small>
          </div>
          <div className="an-scenario-fields">
            <label>
              Return scenario
              <select
                aria-label="Illustrative return scenario"
                value={returnTarget}
                onChange={(e) => {
                  setReturnTarget(+e.target.value);
                  setExtraJobs(0);
                }}
              >
                <option value="320">Steady growth · target +320%</option>
                <option value="410">Accelerated growth · target +410%</option>
                <option value="540">Scaled operation · target +540%</option>
              </select>
            </label>
            <label>
              Additional paid jobs assumed<b>{assumedJobs}</b>
              <input
                aria-label="Assumed additional paid jobs"
                type="range"
                min={baselineJobs}
                max={baselineJobs + 30}
                value={assumedJobs}
                disabled={!sample}
                onChange={(e) => setExtraJobs(+e.target.value - baselineJobs)}
              />
            </label>
            <div>
              <label>
                Contribution margin
                <input
                  aria-label="Assumed contribution margin percent"
                  type="number"
                  min="10"
                  max="60"
                  value={margin}
                  disabled={!sample}
                  onChange={(e) => setMargin(Math.max(10, Math.min(60, +e.target.value)))}
                />
                <span>%</span>
              </label>
              <label>
                Allocated CRM cost
                <input
                  aria-label="Assumed CRM cost INR"
                  type="number"
                  min="1000"
                  max="1000000"
                  step="1000"
                  value={crmCost}
                  disabled={!sample}
                  onChange={(e) => setCrmCost(Math.max(1000, Math.min(1000000, +e.target.value)))}
                />
                <span>₹</span>
              </label>
            </div>
          </div>
          <div className="an-roi-math">
            <div>
              <span>Additional contribution</span>
              <b>{sample ? money(incrementalContribution) : '—'}</b>
            </div>
            <div>
              <span>CRM + caller cost</span>
              <b>{sample ? money(scenarioCost) : '—'}</b>
            </div>
          </div>
          <details className="an-method">
            <summary>
              How this scenario is calculated
              <ChevronDown size={13} />
            </summary>
            <p>
              ROI = (additional contribution − CRM/caller costs) ÷ CRM/caller costs. Contribution =
              assumed additional paid jobs × {fullMoney(averagePaid)} average completed-job value ×
              margin. Changing costs, margin or filters automatically recalculates the minimum
              assumed jobs needed to meet the selected return target; the slider adds jobs above
              that baseline. The result is calculated, not a measured performance claim. This is an
              illustrative service-business perspective, not ARDEX revenue. Acquisition spend and
              unconnected human handling costs are excluded. Proving incremental return needs a
              comparable holdout or controlled rollout.
            </p>
          </details>
        </Card>
      </div>
      <Card className="an-source-card">
        <Heading
          title="Where the business comes from"
          description="Compare conversion and value alongside acquisition volume."
          action={
            <label className="an-sort">
              Sort by
              <select
                aria-label="Sort acquisition sources"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              >
                <option value="value">Approved value</option>
                <option value="rate">Approval rate</option>
                <option value="leads">Lead volume</option>
                <option value="cost">Cost / approval</option>
              </select>
            </label>
          }
        />
        <div className="an-table-scroll">
          <table className="an-table">
            <thead>
              <tr>
                <th>Acquisition source</th>
                <th>{sample ? 'Leads' : 'Journeys'}</th>
                <th>Approvals</th>
                <th>Approval rate</th>
                <th>Approved scope</th>
                <th>Acquisition spend</th>
                <th>Cost / approval</th>
                <th>
                  <span className="an-sr-only">Explore</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {sourceData.map((s, i) => (
                <tr key={s.name}>
                  <td>
                    <button
                      className="an-source-name"
                      onClick={() => setSource(source === s.name ? 'all' : s.name)}
                    >
                      <span className={`an-source-dot an-source-dot-${i % 4}`} />
                      {s.name}
                    </button>
                  </td>
                  <td>{s.items.length}</td>
                  <td>{s.won}</td>
                  <td>
                    <div className="an-rate-cell">
                      <b>{sample ? percent(s.won, s.items.length) : 'N/A'}</b>
                      <i>
                        <em style={{ width: sample ? percent(s.won, s.items.length) : '0%' }} />
                      </i>
                    </div>
                  </td>
                  <td>
                    <b>{money(s.value)}</b>
                  </td>
                  <td>{sample ? money(s.spend) : 'Unavailable'}</td>
                  <td>{sample && s.won ? money(s.spend / s.won) : 'N/A'}</td>
                  <td>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`Explore ${s.name}`}
                      onClick={() =>
                        inspect(
                          s.name,
                          `${s.won} approved opportunities / ${s.items.length} leads. Select a source name to filter the dashboard.`,
                          s.items,
                        )
                      }
                    >
                      <ArrowUpRight size={15} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!sourceData.length && <Empty>No sources match the selected filters.</Empty>}
        <SourceComparison rows={filterCohort(all, days, 'all', locality, end)} sample={sample} />
        <div className="an-source-insight">
          <Info size={14} />
          <span>
            {sample && sourceData.length
              ? `${[...sourceData].sort((a, b) => b.won / b.items.length - a.won / a.items.length)[0].name} has the highest observed approval rate in this selection. Compare sample sizes and costs before allocating budget.`
              : 'Detailed campaign and referral attribution needs connected CRM source data.'}
          </span>
        </div>
      </Card>
      <div className="an-section-intro">
        <div>
          <span className="an-section-number">04</span>
          <h3>Commercial value, with a clear meaning</h3>
        </div>
        <span>Overlapping views. Never add them together.</span>
      </div>
      <Card className="an-values">
        <div className="an-value-grid">
          {[
            {
              title: 'Open quoted pipeline',
              value: sum(openQuoted, 'quoted'),
              items: openQuoted,
              note: 'Latest quote, awaiting approval',
              icon: BarChart3,
            },
            {
              title: 'Approved scope',
              value: approved,
              items: approvedRows,
              note: 'Customer-agreed work value',
              icon: Check,
            },
            {
              title: 'Completed scope',
              value: completed,
              items: completedRows,
              note: 'Work with an issued record',
              icon: Layers3,
            },
            {
              title: 'Receipt acknowledged',
              value: sum(rows, 'acknowledged'),
              items: rows.filter((r) => r.acknowledged),
              note: 'Two-party direct-payment acknowledgement',
              icon: ArrowDown,
            },
          ].map((v) => (
            <button
              key={v.title}
              onClick={() =>
                inspect(
                  v.title,
                  v.note,
                  v.items,
                  'These measures overlap. Approved and completed scope are not collected revenue; two-party acknowledgement is not provider verification.',
                )
              }
            >
              <span>
                <v.icon size={16} />
                {v.title}
                <ArrowUpRight size={13} />
              </span>
              <strong>
                {v.title === 'Open quoted pipeline' && quoteUnknown
                  ? 'Unavailable'
                  : money(v.value)}
              </strong>
              <small>
                {v.title === 'Open quoted pipeline' && quoteUnknown
                  ? 'Quote expiry needs the source demo clock'
                  : v.note}
              </small>
            </button>
          ))}
        </div>
        <div className="an-value-note">
          Quoted, approved and completed work are not recognized revenue. Payment acknowledgements
          are not bank-verified receipts.
        </div>
      </Card>
      <Card className="an-care">
        <details>
          <summary>
            <span className="an-icon-tile">
              <Users size={18} />
            </span>
            <span>
              <b>Customer growth beyond completion</b>
              <small>Care preferences, follow-up interest and the next relationship.</small>
            </span>
            <Badge>Explore</Badge>
            <ChevronDown size={17} />
          </summary>
          <div className="an-care-content">
            <div className="an-care-stats">
              {[
                { label: 'Completed jobs', items: completedRows },
                {
                  label: 'Care preference recorded',
                  items: completedRows.filter((r) => r.care !== null),
                },
                {
                  label: 'Interested in reminders',
                  items: completedRows.filter((r) => r.care === true),
                },
                {
                  label: 'Care follow-up interest',
                  items: completedRows.filter((r) => r.careInterest === true),
                },
              ].map((c) => (
                <button
                  key={c.label}
                  disabled={!sample && c.label === 'Care follow-up interest'}
                  onClick={() =>
                    inspect(
                      c.label,
                      'Care preference is not contact permission, a confirmed booking or a completed service.',
                      c.items,
                    )
                  }
                >
                  <strong>
                    {!sample && c.label === 'Care follow-up interest' ? '—' : c.items.length}
                  </strong>
                  <span>{c.label}</span>
                </button>
              ))}
            </div>
            <p className="an-footnote">
              Unresolved concerns: {completedRows.filter((r) => r.concerns).length}. Service
              recovery should precede promotional outreach. Care booking, referral conversion,
              repeat-job value and lifetime value require connected workflows and stable customer
              identities.
            </p>
          </div>
        </details>
      </Card>
      <div className="an-bottom">
        <span>
          <span className="an-live-dot" />
          {sample
            ? 'Illustrative snapshot · 09 October 2026'
            : 'Application records · selected workspace scope'}
        </span>
        <button
          onClick={() =>
            inspect(
              'How to read these analytics',
              'Definitions, data boundaries and interpretation.',
              [],
              'All money uses INR. Filters select lead creation cohorts except the explicitly selectable map activity-date view. Funnel counts are distinct milestone reach, not stage occupancy. Approved scope is not revenue. All CRM, caller, cost and location activity here is fictional demo data. The return scenarios size assumed additional jobs to the selected target, rather than measuring actual CRM or AI uplift. Real ROI needs costs, business-specific realized contribution, and evidence of incremental effect.',
            )
          }
        >
          <Info size={13} />
          Metric definitions
        </button>
        <span>Asia/Kolkata · INR</span>
      </div>
      <Sheet
        open={!!detail}
        onOpenChange={(open) => {
          if (!open) {
            setDetail(null);
            setFocus(null);
          }
        }}
        title={focus ? focus.code : detail?.title || 'Analytical details'}
        description={focus ? focus.dataClass : detail?.description || ''}
      >
        {focus ? (
          <>
            <Button variant="ghost" size="sm" onClick={() => setFocus(null)}>
              ← Back to breakdown
            </Button>
            <div className="an-record-summary">
              <Badge>{focus.currentStage}</Badge>
              <h3>{focus.source}</h3>
              <p>
                {focus.locality} · Created {date(focus.createdAt)}
              </p>
              <div>
                <span>
                  Approved scope<b>{fullMoney(focus.approved)}</b>
                </span>
                <span>
                  Acknowledged receipt<b>{fullMoney(focus.acknowledged)}</b>
                </span>
              </div>
            </div>
            <h4 className="an-timeline-title">Recorded milestone timeline</h4>
            <ol className="an-timeline">
              {STAGES.map((s, i) => (
                <li className={focus.milestones[i] ? 'reached' : ''} key={s}>
                  <i />
                  <div>
                    <b>{s}</b>
                    <span>{date(focus.milestones[i])}</span>
                  </div>
                </li>
              ))}
            </ol>
            <p className="an-sheet-note">
              Recorded facts only. No call, task, approval or application update is performed.
            </p>
          </>
        ) : (
          <>
            {detail?.definition && (
              <div className="an-definition">
                <Info size={16} />
                <p>{detail.definition}</p>
              </div>
            )}
            {detail?.rows.length ? (
              <>
                <div className="an-detail-totals">
                  <span>
                    <strong>{detail.rows.length}</strong>contributing records
                  </span>
                  <span>
                    <strong>{money(sum(detail.rows, 'approved'))}</strong>approved scope
                  </span>
                </div>
                {detail.rows.every((r) => r.locality === detail.rows[0].locality) && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setLocality(detail.rows[0].locality);
                      setDetail(null);
                    }}
                  >
                    Filter dashboard to {detail.rows[0].locality}
                    <ArrowRight size={14} />
                  </Button>
                )}
                <div className="an-detail-sort">
                  <label>
                    Sort records
                    <select
                      aria-label="Sort contributing records"
                      value={detailSort}
                      onChange={(e) => setDetailSort(e.target.value)}
                    >
                      <option value="waiting">
                        {detail.stageIndex !== undefined ? 'Longest waiting' : 'Oldest acquisition'}
                      </option>
                      <option value="value">Highest commercial value</option>
                    </select>
                  </label>
                </div>
                {detail.stageIndex !== undefined && (
                  <div className="an-waiting-buckets">
                    {[
                      { label: 'Under 3 days', test: (n: number) => n < 3 },
                      { label: '3–7 days', test: (n: number) => n >= 3 && n < 7 },
                      { label: '7+ days', test: (n: number) => n >= 7 },
                    ].map((bucket) => (
                      <div key={bucket.label}>
                        <b>
                          {
                            detail.rows.filter(
                              (r) => waitingAge(r) !== null && bucket.test(waitingAge(r)!),
                            ).length
                          }
                        </b>
                        <span>{bucket.label}</span>
                      </div>
                    ))}
                  </div>
                )}
                <div className="an-detail-records">
                  {detailRows.slice(0, detailLimit).map((r) => (
                    <button key={r.id} onClick={() => setFocus(r)}>
                      <div>
                        <b>{r.code}</b>
                        <span>
                          {r.source} · {r.locality}
                        </span>
                        <small>
                          {r.currentStage} ·{' '}
                          {detail.stageIndex !== undefined
                            ? waitingAge(r) === null
                              ? 'Waiting age unavailable'
                              : `${waitingAge(r)!.toFixed(1)} days waiting`
                            : date(r.createdAt)}
                        </small>
                      </div>
                      <strong>
                        {r.approved ? money(r.approved) : r.quoted ? money(r.quoted) : 'Unquoted'}
                      </strong>
                      <ChevronRight size={15} />
                    </button>
                  ))}
                </div>
                <div className="an-detail-pagination">
                  <span>
                    Showing {count(Math.min(detailLimit, detailRows.length))} of{' '}
                    {count(detailRows.length)} records
                  </span>
                  {detailRows.length > detailLimit && (
                    <Button variant="outline" onClick={() => setDetailLimit((n) => n + 100)}>
                      Show 100 more
                    </Button>
                  )}
                </div>
              </>
            ) : (
              <Empty>No contributing records in this selection.</Empty>
            )}
          </>
        )}
      </Sheet>
    </div>
  );
}
