import test from 'node:test';
import assert from 'node:assert/strict';
import {appUrl,adminUrl} from '../src/adapters/service-url.mjs';

test('hosted app, admin and passport links preserve the public origin and workspace',()=>{
  const current=new URL('https://demoardex-production.up.railway.app/admin.html?session=demo');
  assert.equal(adminUrl('/admin.html?session=demo',current),'https://demoardex-production.up.railway.app/admin.html?session=demo');
  assert.equal(appUrl('/?session=demo',current),'https://demoardex-production.up.railway.app/?session=demo');
  assert.equal(appUrl('/passport.html?token=proof',current),'https://demoardex-production.up.railway.app/passport.html?token=proof');
});

test('local development retains separate app and control ports',()=>{
  assert.equal(adminUrl('/admin.html?session=demo',new URL('http://127.0.0.1:5173/')),'http://127.0.0.1:5175/admin.html?session=demo');
  assert.equal(appUrl('/?session=demo',new URL('http://localhost:5175/admin.html')),'http://localhost:5173/?session=demo');
  assert.equal(adminUrl('/admin.html',new URL('http://localhost:8080/')),'http://localhost:8080/admin.html');
});
