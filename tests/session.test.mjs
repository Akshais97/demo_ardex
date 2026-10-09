import test from 'node:test';
import assert from 'node:assert/strict';
import { isSession, newSession, openSessionStore } from '../src/adapters/session.mjs';
test('known schema and role restore; incompatible or malformed records do not', () => {
  const session = newSession('pitch-01'); assert.ok(isSession(session));
  for (const change of [{schemaVersion:2}, {id:''}, {view:'job'}, {role:'dealer'}]) assert.equal(isSession({...session, ...change}), false);
  assert.equal(isSession(null), false);
});
test('missing IndexedDB reports unavailable rather than pretending to save', async () => {
  await assert.rejects(openSessionStore(null), /unavailable/);
});
