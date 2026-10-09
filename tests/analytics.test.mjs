import test from 'node:test';
import assert from 'node:assert/strict';
import {
  SAMPLE,
  SNAPSHOT,
  DAY,
  filterCohort,
  fromWork,
  layerRows,
  layerWeight,
  percent,
  median,
  returnScenario,
} from '../src/ui/analytics/data.ts';

test('illustrative milestones are nested and never after the snapshot', () => {
  assert.equal(new Set(SAMPLE.map((r) => r.id)).size, SAMPLE.length);
  for (const row of SAMPLE) {
    let missing = false,
      prior = 0;
    for (const at of row.milestones) {
      if (at === null) {
        missing = true;
        continue;
      }
      assert.equal(missing, false);
      assert.ok(at >= prior && at <= SNAPSHOT);
      prior = at;
    }
  }
});
test('cohort windows do not overlap and source/locality filters compose', () => {
  const current = filterCohort(SAMPLE, 30, 'all', 'all', SNAPSHOT),
    prior = filterCohort(SAMPLE, 30, 'all', 'all', SNAPSHOT - 30 * DAY);
  assert.equal(current.length, 2561);
  assert.equal(prior.length, 1958);
  const ids = new Set(current.map((r) => r.id));
  assert.ok(prior.every((r) => !ids.has(r.id)));
  const selected = filterCohort(SAMPLE, 30, 'Dealer referral', 'Whitefield', SNAPSHOT);
  assert.ok(selected.every((r) => r.source === 'Dealer referral' && r.locality === 'Whitefield'));
  assert.equal(filterCohort(SAMPLE, 30, 'nonexistent', 'all', SNAPSHOT).length, 0);
});

test('mature demo has substantial completed work in every locality and positive growth', () => {
  const current = filterCohort(SAMPLE, 30, 'all', 'all', SNAPSHOT);
  const prior = filterCohort(SAMPLE, 30, 'all', 'all', SNAPSHOT - 30 * DAY);
  const completed = current.filter((r) => r.completed);
  assert.ok(completed.length > 1500);
  assert.ok(completed.length > prior.filter((r) => r.completed).length);
  assert.ok(
    current.filter((r) => r.approved).length / current.length >
      prior.filter((r) => r.approved).length / prior.length,
  );
  for (const locality of new Set(current.map((r) => r.locality))) {
    assert.ok(completed.filter((r) => r.locality === locality).length >= 100);
  }
  assert.ok(SAMPLE.every((r) => !r.purchaseAt || r.purchaseAt <= SNAPSHOT));
});

test('successful ROI presets calculate required jobs rather than clamping the displayed percentage', () => {
  for (const cost of [1000, 45000, 1000000]) {
    for (const margin of [10, 30, 60]) {
      for (const target of [320, 410, 540]) {
        const r = returnScenario(cost, 135000, margin, target);
        assert.ok(r.roi >= target - 0.000001);
        assert.ok(Number.isInteger(r.jobs));
        assert.equal(r.contribution, (r.jobs * 135000 * margin) / 100);
        assert.equal(r.roi, ((r.contribution - cost) / cost) * 100);
        assert.ok(((((r.jobs - 1) * 135000 * margin) / 100 - cost) / cost) * 100 < target);
        assert.ok(returnScenario(cost, 135000, margin, target, 2).roi > r.roi);
      }
    }
  }
});
test('application data deduplicates jobs and leaves unavailable integrations unknown', () => {
  const row = {
    id: 'workspace-1',
    job: {
      id: 'job-1',
      mode: 'ardex',
      status: 'APPROVED',
      site: { lat: 12.97, lng: 77.59 },
      approved: { totalPaise: 5000000, approvedAt: 1 },
      quotes: [],
    },
    events: [],
  };
  const result = fromWork([row, { ...row, id: 'workspace-copy' }]);
  assert.equal(result.length, 1);
  assert.equal(result[0].approved, 50000);
  assert.equal(result[0].source, 'ARDEX (channel unspecified)');
  assert.deepEqual(result[0].milestones.slice(0, 3), [null, null, null]);
  assert.equal(result[0].realizedRevenue, null);
  assert.equal(result[0].callerCost, null);
  assert.equal(result[0].purchase, 0);
  assert.equal(result[0].completed, 0);
});
test('only valid latest sent quotes contribute open quoted value', () => {
  const q = {
    status: 'SENT',
    sentAt: 10,
    expiresAt: 100,
    selectedPackageCode: 'PLUS',
    options: [{ packageCode: 'PLUS', totalPaise: 8000000 }],
  };
  const fixture = (quote) => ({
    id: 'w1',
    clock: { now: 50 },
    job: { id: 'j1', status: 'QUOTE_SENT', quotes: [quote] },
    events: [],
  });
  assert.equal(fromWork([fixture(q)])[0].quoted, 80000);
  assert.equal(fromWork([fixture({ ...q, status: 'DECLINED' })])[0].quoted, 0);
  assert.equal(fromWork([fixture({ ...q, expiresAt: 40 })])[0].quoted, 0);
  assert.equal(fromWork([fixture({ ...q, status: 'SUPERSEDED' })])[0].quoted, 0);
  const snapshot = fixture(q);
  delete snapshot.clock;
  const unknown = fromWork([snapshot])[0];
  assert.equal(unknown.quoted, 80000);
  assert.equal(unknown.quoteValidityUnknown, true);
});
test('completion requires issuance and acknowledgement remains separate from approval', () => {
  const row = {
    id: 'w1',
    job: {
      id: 'j1',
      status: 'COMPLETED',
      approved: { totalPaise: 9000000 },
      certificate: { issuedAt: 100 },
      receiptConfirmed: { amountPaise: 7000000 },
    },
    events: [],
  };
  const result = fromWork([row])[0];
  assert.equal(result.completed, 90000);
  assert.equal(result.acknowledged, 70000);
  assert.equal(result.realizedRevenue, null);
});
test('map layers use jobs or value, never evidence count or quoted demand as purchases', () => {
  const sample = filterCohort(SAMPLE, 30, 'all', 'all', SNAPSHOT);
  const completed = layerRows(sample, 'completed');
  assert.ok(completed.every((r) => r.completed > 0));
  assert.ok(completed.every((r) => layerWeight(r, 'completed') === 1));
  assert.ok(layerRows(sample, 'approved').every((r) => layerWeight(r, 'approved') === r.approved));
  const app = fromWork([
    {
      id: 'w1',
      job: { id: 'j1', approved: { totalPaise: 5000000 }, scans: [1, 2, 3], quotes: [] },
      events: [],
    },
  ]);
  assert.equal(layerRows(app, 'purchases').length, 0);
  assert.equal(layerRows(app, 'completed').length, 0);
});
test('undefined denominators and missing observations remain explicit', () => {
  assert.equal(percent(0, 0), 'N/A');
  assert.equal(median([]), null);
  assert.equal(median([5, 1, 3]), 3);
  assert.equal(median([5, 1]), 3);
});
