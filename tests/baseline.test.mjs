import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { validateBaseline } from '../src/foundation/baseline-validation.mjs';

const original = JSON.parse(readFileSync(new URL('../config/product-baseline.json', import.meta.url), 'utf8'));
const copy = () => structuredClone(original);
const has = (b, code) => validateBaseline(b).some(x => x.code === code);

test('reviewed baseline has coherent sources and ownership', () => {
  assert.deepEqual(validateBaseline(original), []);
});
test('a simulated conversation cannot be relabelled as real WhatsApp', () => {
  const b = copy();
  b.capabilities.find(x => x.id === 'homeowner-messaging').demoMode = 'shared-service';
  assert.equal(has(b, 'MESSAGING_BOUNDARY'), true);
});
test('a prototype exception cannot discard future Sakhaa ownership', () => {
  const b = copy();
  b.capabilities.find(x => x.id === 'job-otp').productionReplacement = '';
  assert.equal(has(b, 'MESSAGING_BOUNDARY'), true);
});
test('unknown and conflicting source amendments fail reconciliation', () => {
  const b = copy();
  b.amendments[0].resolution = '';
  b.capabilities[0].sourceRefs[0].id = 'unknown-source';
  assert.equal(has(b, 'UNRESOLVED_CONFLICT'), true);
  assert.equal(has(b, 'UNKNOWN_SOURCE'), true);
});
test('illustrative certificate cannot lose its export mark', () => {
  const b = copy();
  b.capabilities.find(x => x.id === 'water-passport').exportMark = '';
  assert.equal(has(b, 'EXPORT_MARK'), true);
});
test('technical placeholders cannot claim client approval', () => {
  const b = copy();
  b.placeholders[0].clientApproved = true;
  assert.equal(has(b, 'PLACEHOLDER_APPROVAL'), true);
});
test('the app cannot absorb CHLEAR demand ownership', () => {
  const b = copy();
  b.handoffs.find(x => x.stage === 'demand').owner = 'ARDEX PRO';
  assert.equal(has(b, 'OWNER_BOUNDARY'), true);
});
test('unbuilt capabilities cannot claim implementation without evidence', () => {
  const b = copy();
  const capability = b.capabilities.find(x => x.id === 'camera-capture');
  capability.status = 'Browser live';
  delete capability.evidence;
  assert.equal(has(b, 'UNSUPPORTED_IMPLEMENTATION_CLAIM'), true);
});

