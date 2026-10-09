import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { calculatePackage, optimisePacks, selectPackages } from '../src/domain/calculator.mjs';
import { measure, diagnose, diagnosisHandlers } from '../src/domain/diagnosis.mjs';
import { fixtures } from '../src/data/fixtures.mjs';
import { initialState, applyCommand } from '../src/domain/authority.mjs';
import { planHandlers } from '../src/domain/plan.mjs';
const catalog = JSON.parse(fs.readFileSync(new URL('../config/catalog.json', import.meta.url)));
function diagnosis(key) { const f = fixtures[key]; return { id: 'diagnosis-' + key, version: 1, measurement: structuredClone(f.measurement), answers: structuredClone(f.answers), area: measure(f.measurement, f.areaType), analysis: diagnose(catalog, f.areaType, f.answers) }; }

// Independent worksheet: handwritten arithmetic from source coverage, pack prices and labour bands.
const worksheet = [
  ['TERRACE_SHIELD', 'terrace', [92.4, 11.217675], [96, 50], 1998000, 1120000, 3118000],
  ['TERRACE_SHIELD_PLUS', 'terrace', [11.55, 154, 11.217675], [12, 156, 50], 5014000, 1680000, 6694000],
  ['TERRACE_SHIELD_MAX', 'terrace', [11.55, 184.8, 14.9569], [12, 200, 50], 7494000, 1960000, 9454000],
  ['TERRACE_UNDER_TILE', 'terrace', [115.5, 4], [120, 4], 2120000, 1260000, 3380000],
  ['BATH_SEAL', 'bathroom', [17.864, 2], [20, 2], 430000, 371200, 801200],
  ['BATH_SEAL_PLUS', 'bathroom', [1.914, 20.416, 2], [2, 25, 2], 809000, 440800, 1249800],
  ['BATH_SEAL_MAX', 'bathroom', [1.914, 25.52, 2], [2, 28, 2], 1084000, 510400, 1594400]
];
for (const [code, key, quantities, purchased, material, labour, total] of worksheet) test(`${code}: independent coverage/packs/material/labour anchor`, () => {
  const result = calculatePackage(catalog, code, diagnosis(key), 'BLR');
  assert.deepEqual(result.bom.map(b => b.required), quantities);
  assert.deepEqual(result.bom.map(b => b.purchased), purchased);
  assert.equal(result.materialPaise, material); assert.equal(result.labourPaise, labour); assert.equal(result.totalPaise, total);
  assert.equal(result.pricing.gstAddedPaise, 0); assert.equal(result.labour.basis, 'treated area');
});
test('PU example optimises to seven 20kg plus four 4kg, not greedy eight large packs', () => {
  const result = calculatePackage(catalog, 'TERRACE_SHIELD_PLUS', diagnosis('terrace'), 'BLR').bom.find(b => b.sku === 'WPM810');
  assert.equal(result.rawRequired, 154); assert.equal(result.required, 154); assert.equal(result.purchased, 156); assert.equal(result.costPaise, 4420000);
  assert.deepEqual(result.packs.map(p => [p.size, p.count]), [[20, 7], [4, 4]]);
  assert.ok(result.costPaise < 8 * 560000);
});
test('tape is perimeter plus drains/pipes; fabric fraction is applied once', () => {
  const tape = calculatePackage(catalog, 'BATH_SEAL_PLUS', diagnosis('bathroom'), 'BLR').bom.find(b => b.sku === 'WPT300');
  assert.equal(tape.inputs.lengthMetres, 10.5344); assert.equal(tape.required, 2); assert.equal(tape.unit, 'ROLL'); assert.equal(tape.quantityTolerance, 0);
  const mesh = calculatePackage(catalog, 'TERRACE_SHIELD_PLUS', diagnosis('terrace'), 'BLR').bom.find(b => b.sku === 'MESH');
  assert.equal(mesh.rawRequired, 11.217675); assert.equal(mesh.unit, 'SQM');
});
test('selector follows ordered conditions, excludes packages and preserves recommended option', () => {
  const d = diagnosis('terrace'); assert.equal(selectPackages(catalog, 'TERRACE', d).recommendedCode, 'TERRACE_SHIELD_PLUS');
  d.answers.to_be_tiled = true;
  assert.deepEqual(selectPackages(catalog, 'TERRACE', d).options.map(o => o.code), ['TERRACE_UNDER_TILE', 'TERRACE_SHIELD_PLUS']);
  d.answers.cracks = 'WIDE'; d.analysis = diagnose(catalog, 'TERRACE', d.answers);
  assert.throws(() => selectPackages(catalog, 'TERRACE', d), /technical visit/);
  assert.throws(() => selectPackages(catalog, 'TERRACE', d, { diagnosisId: 'old', reason: 'This is an obsolete clearance' }), /technical visit/);
  assert.equal(selectPackages(catalog, 'TERRACE', d, { diagnosisId: d.id, reason: 'Current diagnosis cleared by technical review' }).recommendedCode, 'TERRACE_SHIELD_PLUS');
  const bath = diagnosis('bathroom'); bath.answers.tiles_removed = 'NO'; bath.analysis = diagnose(catalog, 'BATHROOM', bath.answers);
  assert.throws(() => selectPackages(catalog, 'BATHROOM', bath), /Tile removal/);
});
test('optimizer tie breaks by fewer packs, then smaller surplus, independent of input order', () => {
  assert.deepEqual(optimisePacks(2, [{size:1,price_paise:100},{size:2,price_paise:200}]).packs.map(p=>[p.size,p.count]), [[2,1]]);
  const p = [{size:3,price_paise:100},{size:2,price_paise:100}];
  assert.deepEqual(optimisePacks(2, p).packs.map(p=>[p.size,p.count]), [[2,1]]);
  assert.deepEqual(optimisePacks(7, p), optimisePacks(7, [...p].reverse()));
  assert.equal(optimisePacks(4.000001, [{size:4,price_paise:100}]).packCount, 2);
  assert.equal(optimisePacks(4, [{size:4,price_paise:100}]).packCount, 1);
});
test('bounded optimizer agrees with independent exhaustive small catalogs', () => {
  const packs = [{size:2,price_paise:97},{size:3,price_paise:127},{size:5,price_paise:213}];
  for(let required=1;required<=25;required++) {
    let best = Infinity;
    for(let a=0;a<=13;a++) for(let b=0;b<=9;b++) for(let c=0;c<=5;c++) if(2*a+3*b+5*c>=required) best=Math.min(best,97*a+127*b+213*c);
    assert.equal(optimisePacks(required,packs).costPaise,best);
  }
});
test('missing coverage/price/roll length/band or unsupported quantities are specific blocks', () => {
  const c = structuredClone(catalog); c.skus.find(s=>s.code==='WPM810').coverage_per_sqft_coat=null;
  assert.throws(()=>calculatePackage(c,'TERRACE_SHIELD_PLUS',diagnosis('terrace'),'BLR'),e=>e.code==='COVERAGE_MISSING');
  assert.throws(()=>optimisePacks(10,[{size:20,price_paise:null}]),e=>e.code==='PACK_PRICE');
  assert.throws(()=>optimisePacks(10,[{size:0,price_paise:100}]),e=>e.code==='PACK_SIZE');
  assert.throws(()=>optimisePacks(0,[{size:1,price_paise:100}]),e=>e.code==='QUANTITY_RANGE');
  c.skus.find(s=>s.code==='WPT300').roll_length_m=0;
  assert.throws(()=>calculatePackage(c,'BATH_SEAL',diagnosis('bathroom'),'BLR'),e=>e.code==='ROLL_LENGTH');
  assert.throws(()=>calculatePackage(catalog,'BATH_SEAL',diagnosis('bathroom'),'UNKNOWN'),e=>e.code==='LABOUR_CONFIG');
  const b = structuredClone(catalog); b.skus.find(s=>s.code==='WPM265').unit='ROLL';
  assert.throws(()=>calculatePackage(b,'TERRACE_SHIELD_PLUS',diagnosis('terrace'),'BLR'),e=>e.code==='BOM_METHOD');
});
function plannedState() { const s=initialState('plan-tests',catalog);s.profile.loggedIn=true;s.job={id:'job-1',applicatorId:s.profile.id,status:'DIAGNOSIS',areaType:'TERRACE',diagnosis:diagnosis('terrace'),plan:null};return s; }
function command(s,payload={},id=crypto.randomUUID()) {return {id,sessionId:s.id,expectedRevision:s.revision,type:'CALCULATE_PLAN',actor:'applicator',payload};}
test('labour band rejects edits atomically; valid min/max use treated area', () => {
  const base=plannedState(), c=command(base,{},'first');const saved=applyCommand(base,c,planHandlers).state;
  const text=JSON.stringify(saved);
  for(const rate of [1799,3201,2400.5,-1]) assert.throws(()=>applyCommand(saved,command(saved,{labourRatePaise:rate}),planHandlers),e=>e.code==='LABOUR_BAND');
  assert.equal(JSON.stringify(saved),text);
  assert.equal(calculatePackage(catalog,'TERRACE_SHIELD_PLUS',diagnosis('terrace'),'BLR',1800).labourPaise,1260000);
  assert.equal(calculatePackage(catalog,'TERRACE_SHIELD_PLUS',diagnosis('terrace'),'BLR',3200).labourPaise,2240000);
  assert.equal(applyCommand(saved,c,planHandlers).state.job.plan.version,1);
});
test('calculation has no homeowner approval/messages; identical selection retains draft identity/version', () => {
  let s=applyCommand(plannedState(),command(plannedState()),planHandlers).state;
  const id=s.job.plan.id;s=applyCommand(s,command(s),planHandlers).state;
  assert.equal(s.job.plan.id,id);assert.equal(s.job.plan.version,1);assert.equal(s.job.status,'DIAGNOSIS');assert.equal(s.messages.length,0);
  assert.throws(()=>applyCommand(s,command(s,{packageCode:'BATH_SEAL'}),planHandlers),e=>e.code==='PACKAGE_EXCLUDED');
  s=applyCommand(s,command(s,{packageCode:'TERRACE_SHIELD_MAX'}),planHandlers).state;assert.equal(s.job.plan.version,2);
});
test('fresh diagnosis invalidates the draft and cannot reuse an old structural clearance', () => {
  let s=applyCommand(plannedState(),command(plannedState()),planHandlers).state;
  const old=s.job.plan.id;s.job.structuralClearance={diagnosisId:s.job.diagnosis.id,reason:'Previous technical clearance'};
  const photos=catalog.diagnosis_photos.TERRACE.map(view=>({view,mode:'sample'}));
  s=applyCommand(s,{id:'new-diagnosis',sessionId:s.id,expectedRevision:s.revision,type:'SAVE_DIAGNOSIS',actor:'applicator',payload:{answers:{...fixtures.terrace.answers,cracks:'WIDE'},measurement:fixtures.terrace.measurement,photos}},diagnosisHandlers).state;
  assert.equal(s.job.plan,null);assert.equal(s.job.structuralClearance,null);assert.ok(old);
  assert.throws(()=>applyCommand(s,command(s),planHandlers),/technical visit/);
});
test('feet/metres and direct-area inputs preserve equivalent material requirements', () => {
  const ft=diagnosis('terrace'),metres=diagnosis('terrace'),direct=diagnosis('terrace');
  metres.measurement={...metres.measurement,unit:'M',length:9.144,width:6.096};
  metres.area=measure(metres.measurement,'TERRACE');
  direct.measurement={...direct.measurement,method:'direct',floorArea:600,perimeter:100};
  direct.area=measure(direct.measurement,'TERRACE');
  for(const d of [ft,metres,direct]){const result=calculatePackage(catalog,'TERRACE_SHIELD_PLUS',d,'BLR');assert.equal(result.area.treated,700);assert.equal(result.bom.find(b=>b.sku==='WPM810').required,154);assert.equal(result.totalPaise,6694000);}
  assert.throws(()=>measure({...fixtures.terrace.measurement,length:0},'TERRACE'));
});
test('package browsing retains each accepted labour edit; repeating it preserves draft version', () => {
  const base=plannedState();let s=applyCommand(base,command(base,{labourRatePaise:3200}),planHandlers).state;
  const version=s.job.plan.version;s=applyCommand(s,command(s,{labourRatePaise:3200}),planHandlers).state;assert.equal(s.job.plan.version,version);
  s=applyCommand(s,command(s,{packageCode:'TERRACE_SHIELD_MAX'}),planHandlers).state;
  s=applyCommand(s,command(s,{packageCode:'TERRACE_SHIELD_PLUS'}),planHandlers).state;
  const plus=s.job.plan.content.options.find(o=>o.packageCode==='TERRACE_SHIELD_PLUS');assert.equal(plus.labour.ratePaise,3200);assert.equal(plus.totalPaise,7254000);
});
