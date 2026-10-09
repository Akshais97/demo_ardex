export type DataMode = 'sample' | 'records';
export type Layer = 'completed' | 'approved' | 'purchases' | 'demand';
export const SNAPSHOT = Date.parse('2026-10-09T12:00:00+05:30');
export const DAY = 86400000;
export const STAGES = [
  'New lead',
  'Contacted',
  'Qualified',
  'Visit booked',
  'Quote sent',
  'Approved',
  'Completed',
];
export const SOURCES = [
  'Website / campaigns',
  'Dealer referral',
  'Customer referral',
  'Applicator / My Lead',
];
export const LOCALITIES = [
  { name: 'Whitefield', lat: 12.9698, lng: 77.75 },
  { name: 'HSR Layout', lat: 12.9116, lng: 77.6389 },
  { name: 'Indiranagar', lat: 12.9784, lng: 77.6408 },
  { name: 'Koramangala', lat: 12.9352, lng: 77.6245 },
  { name: 'Jayanagar', lat: 12.925, lng: 77.5938 },
  { name: 'Hebbal', lat: 13.0354, lng: 77.5988 },
  { name: 'Yelahanka', lat: 13.1007, lng: 77.5963 },
  { name: 'Electronic City', lat: 12.8452, lng: 77.6602 },
];
export type Opportunity = {
  id: string;
  code: string;
  source: string;
  locality: string;
  lat?: number;
  lng?: number;
  createdAt?: number;
  currentStage: string;
  milestones: (number | null)[];
  quoted: number;
  jobRecorded: boolean;
  quoteValidityUnknown: boolean;
  approved: number;
  completed: number;
  acknowledged: number;
  purchase: number;
  purchaseAt?: number;
  attempts: number | null;
  reached: boolean | null;
  ai: boolean | null;
  handoff: boolean;
  acquisitionCost: number | null;
  callerCost: number | null;
  realizedRevenue: number | null;
  care: boolean | null;
  careInterest: boolean | null;
  concerns: boolean;
  dataClass: string;
};
const hash = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};
export function returnScenario(
  cost: number,
  averageJob: number,
  margin: number,
  target: number,
  extra = 0,
) {
  const perJob = (averageJob * margin) / 100;
  const baselineJobs = Math.ceil((cost * (1 + target / 100)) / perJob);
  const jobs = baselineJobs + extra;
  const contribution = jobs * perJob;
  return {
    baselineJobs,
    jobs,
    contribution,
    roi: ((contribution - cost) / cost) * 100,
    breakEven: Math.ceil(cost / perJob),
  };
}
// Ninety days of a mature, growing operation. These are presentation fixtures,
// never persisted to the application or combined with recorded customer work.
export const SAMPLE: Opportunity[] = Array.from({ length: 6300 }, (_, i) => {
  const age = Math.floor(90 * Math.pow(i / 6300, 1.22)),
    createdAt = SNAPSHOT - age * DAY - 0.08 * DAY;
  const sourceIndex = Math.floor(hash(i + 21) * 4),
    source = SOURCES[sourceIndex];
  const loc = LOCALITIES[Math.floor(Math.pow(hash(i + 132), 1.35) * LOCALITIES.length)];
  const score = hash(i + 77),
    thresholds =
      age < 30 ? [0.015, 0.04, 0.075, 0.1, 0.12, 0.22] : [0.03, 0.08, 0.14, 0.2, 0.28, 0.38];
  // The current month models improved qualification and follow-through.
  const bias = sourceIndex === 1 ? 0.04 : sourceIndex === 3 ? -0.03 : 0;
  const stageDays = [0, 0.15, 0.5, 1, 2, 3, 5];
  let rank = thresholds.filter((t) => score + bias > t).length;
  rank = Math.min(rank, stageDays.filter((offset) => offset <= age + 0.08).length - 1);
  const value = Math.round((75000 + hash(i + 43) * 125000) / 100) * 100;
  const milestones = STAGES.map((_, s) => (s <= rank ? createdAt + stageDays[s] * DAY : null));
  const ai = sourceIndex !== 3 && hash(i + 10) > 0.12;
  const reached = ai && rank >= 1;
  const attempts = ai ? 1 + Math.floor(hash(i + 100) * 3) : 0;
  const completed = rank === 6 ? value : 0,
    acknowledged = completed && hash(i + 39) > 0.22 ? value : 0;
  return {
    id: `ILL-${1001 + i}`,
    code: `ILL-${1001 + i}`,
    source,
    locality: loc.name,
    lat: loc.lat + (hash(i + 1) - 0.5) * 0.022,
    lng: loc.lng + (hash(i + 2) - 0.5) * 0.022,
    createdAt,
    currentStage: STAGES[rank],
    milestones,
    quoted: rank >= 4 ? value : 0,
    jobRecorded: rank >= 3,
    quoteValidityUnknown: false,
    approved: rank >= 5 ? value : 0,
    completed,
    acknowledged,
    purchase: rank >= 5 ? Math.round(value * 0.57) : 0,
    purchaseAt: rank >= 5 ? createdAt + 3 * DAY : undefined,
    attempts,
    reached,
    ai,
    handoff: !!reached && hash(i + 15) > 0.87,
    acquisitionCost:
      sourceIndex === 0 ? 1250 : sourceIndex === 1 ? 380 : sourceIndex === 2 ? 210 : 160,
    callerCost: attempts * 18,
    realizedRevenue: acknowledged || 0,
    care: completed ? hash(i + 5) > 0.3 : null,
    careInterest: completed ? hash(i + 7) > 0.7 : null,
    concerns: !!completed && hash(i + 9) > 0.9,
    dataClass: 'Fictional illustrative CRM record',
  };
});
export function fromWork(work: any[]): Opportunity[] {
  const seen = new Set<string>();
  return work
    .filter((r) => {
      const key = r.job?.id || r.lead?.id || r.id;
      if (!(r.job || r.lead) || seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .map((r) => {
      const j = r.job,
        site = j?.site || r.lead?.site;
      const events = r.events || [];
      const eventTime = (type: string) => {
        const e = events.find((e: any) => e.type === type);
        return Number.isFinite(e?.at) ? e.at : null;
      };
      const value = (j?.approved?.totalPaise || 0) / 100;
      const issued = j?.certificate?.issuedAt || null;
      const approvedAt = j?.approved?.approvedAt || eventTime('APPROVE_QUOTE');
      const latestQuote = j?.quotes?.at(-1);
      const sentAt = latestQuote?.sentAt || eventTime('SEND_QUOTE');
      const quoteValidityUnknown =
        latestQuote?.status === 'SENT' && !!latestQuote.expiresAt && !Number.isFinite(r.clock?.now);
      const pendingQuote =
        latestQuote?.status === 'SENT' &&
        (!latestQuote.expiresAt || quoteValidityUnknown || latestQuote.expiresAt > r.clock?.now);
      const quotedOption = latestQuote?.options?.find(
        (o: any) => o.packageCode === latestQuote.selectedPackageCode,
      );
      const quotedValue =
        value ||
        (pendingQuote ? (quotedOption?.totalPaise || latestQuote.totalPaise || 0) / 100 : 0);
      const created =
        eventTime('START_STORY') || eventTime('OFFER_LEAD') || eventTime('CREATE_MY_LEAD');
      const coords =
        Number.isFinite(site?.lat) &&
        Number.isFinite(site?.lng) &&
        Math.abs(site.lat) <= 90 &&
        Math.abs(site.lng) <= 180;
      return {
        id: r.id,
        code: j?.code || r.id,
        source: j?.mode === 'my-lead' ? 'Applicator / My Lead' : 'ARDEX (channel unspecified)',
        locality: 'Recorded site',
        lat: coords ? site.lat : undefined,
        lng: coords ? site.lng : undefined,
        createdAt: created || undefined,
        currentStage: (j?.status || 'ENQUIRY').replaceAll('_', ' '),
        milestones: [
          created,
          null,
          null,
          eventTime('ACCEPT_LEAD') || eventTime('CREATE_MY_LEAD'),
          sentAt,
          approvedAt,
          issued,
        ],
        quoted: quotedValue,
        approved: value,
        jobRecorded: !!j,
        quoteValidityUnknown: !!quoteValidityUnknown,
        completed: issued ? value : 0,
        acknowledged: (j?.receiptConfirmed?.amountPaise || 0) / 100,
        purchase: 0,
        attempts: null,
        reached: null,
        ai: null,
        handoff: false,
        acquisitionCost: null,
        callerCost: null,
        realizedRevenue: null,
        care: typeof j?.care?.enabled === 'boolean' ? j.care.enabled : null,
        careInterest: null,
        concerns: !!j?.handoverHold || j?.support?.status === 'OPEN',
        dataClass: 'Application record · includes seeded demonstration journeys',
      };
    });
}
export const money = (n: number) =>
  n >= 10000000
    ? `₹${(n / 10000000).toFixed(2)}Cr`
    : n >= 100000
      ? `₹${(n / 100000).toFixed(2)}L`
      : `₹${Math.round(n).toLocaleString('en-IN')}`;
export const fullMoney = (n: number) => `₹${Math.round(n).toLocaleString('en-IN')}`;
export const percent = (n: number, d: number) => (d ? `${((n / d) * 100).toFixed(1)}%` : 'N/A');
export const sum = (
  rows: Opportunity[],
  key:
    | 'approved'
    | 'completed'
    | 'acknowledged'
    | 'purchase'
    | 'quoted'
    | 'acquisitionCost'
    | 'callerCost'
    | 'realizedRevenue',
) => rows.reduce((n, r) => n + (r[key] || 0), 0);
export const date = (n?: number | null) =>
  n
    ? new Intl.DateTimeFormat('en-IN', {
        day: 'numeric',
        month: 'short',
        timeZone: 'Asia/Kolkata',
      }).format(n)
    : 'Not recorded';
export function filterCohort(
  rows: Opportunity[],
  days: number,
  source: string,
  locality: string,
  end: number,
) {
  return rows.filter(
    (r) =>
      (days === 0 ||
        (r.createdAt !== undefined && r.createdAt > end - days * DAY && r.createdAt <= end)) &&
      (source === 'all' || r.source === source) &&
      (locality === 'all' || r.locality === locality),
  );
}
export function layerRows(rows: Opportunity[], layer: Layer) {
  return rows.filter((r) =>
    layer === 'completed'
      ? r.completed > 0
      : layer === 'approved'
        ? r.approved > 0
        : layer === 'purchases'
          ? r.purchase > 0
          : true,
  );
}
export function layerWeight(row: Opportunity, layer: Layer) {
  return layer === 'approved' ? row.approved : layer === 'purchases' ? row.purchase : 1;
}
export function median(values: number[]) {
  if (!values.length) return null;
  const a = [...values].sort((a, b) => a - b),
    m = Math.floor(a.length / 2);
  return a.length % 2 ? a[m] : (a[m - 1] + a[m]) / 2;
}
