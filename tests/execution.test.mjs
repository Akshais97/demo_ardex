import test from 'node:test';import assert from 'node:assert/strict';import {started}from './proof.test.mjs';import {run}from './commercial.test.mjs';import {nextStage,evaluateGate,handoverReadiness}from '../src/domain/execution.mjs';import {verifyHistory}from '../src/domain/authority.mjs';

test('an early gate evaluation does not strand missing stage evidence in review',()=>{
 let s=run(started(),'SCAN_KIT',{},'presenter');
 s=run(s,'EVALUATE_GATE',{},'admin');
 assert.equal(s.job.status,'REVIEW');
 assert.equal(s.job.captures.length,0);
 assert.throws(()=>run(s,'REQUEST_CLOSE'),/proof checks/);
 while(nextStage(s)){
  const stage=nextStage(s);
  s=run(s,'NEXT_CURE',{},'presenter');
  if(stage.challenge_code)s=run(s,'REQUEST_CHALLENGE',{stageKey:stage.key});
  s=run(s,'CAPTURE_STAGE',{stageKey:stage.key,mode:'sample',location:{...s.job.site,accuracy:12,mode:'sample'},challengeCode:s.job.challenge?.code,weatherAcknowledged:true});
  assert.equal(s.job.status,'IN_PROGRESS');
  s=run(s,'ASSESS_CAPTURE',{captureId:s.job.captures.at(-1).id,status:'PASS',reason:'Reference evidence inspected for stage, code and paired test',challengeConfirmed:true,floodResult:'PASS'},'admin');
  // Rechecking midway must not prevent the next capture or challenge request.
  s=run(s,'EVALUATE_GATE',{},'admin');
 }
 assert.equal(s.job.captures.length,11);
 assert.ok(evaluateGate(s,false).every(c=>c.pass));
 s=run(s,'REQUEST_CLOSE');
 s=run(s,'VERIFY_CLOSE',{purpose:'CLOSE',jobId:s.job.id,code:s.job.otps.CLOSE.code});
 s=run(s,'EVALUATE_GATE',{},'admin');
 s=run(s,'ISSUE_PASSPORT',{},'admin');
 assert.equal(s.job.status,'COMPLETED');
});

test('handover readiness identifies missing evidence and keeps review, consent and issuance gates intact',()=>{
 let s=run(started(),'SCAN_KIT',{},'presenter');
 s=run(s,'EVALUATE_GATE',{},'admin');
 let ready=handoverReadiness(s);
 assert.equal(ready.missingShots,11);
 assert.equal(ready.canRequestClose,false);
 assert.match(ready.nextAction,/11 missing stage photos/);
 assert.match(ready.checks[4].reason,/11 missing stage photos/);
 assert.throws(()=>run(s,'REQUEST_CLOSE'),/11 missing stage photos/);
 while(nextStage(s)){
  const stage=nextStage(s);
  s=run(s,'NEXT_CURE',{},'presenter');
  if(stage.challenge_code)s=run(s,'REQUEST_CHALLENGE',{stageKey:stage.key});
  s=run(s,'CAPTURE_STAGE',{stageKey:stage.key,mode:'sample',location:{...s.job.site,accuracy:12,mode:'sample'},challengeCode:s.job.challenge?.code,weatherAcknowledged:true});
 }
 ready=handoverReadiness(s);
 assert.equal(ready.missingShots,0);
 assert.equal(ready.pendingReview,11);
 assert.equal(ready.canRequestClose,false);
 assert.match(ready.nextAction,/reviewer assess 11/);
 assert.match(ready.checks[4].reason,/11 stage photos await/);
 assert.match(ready.checks[5].reason,/Start verified.*review/i);
 assert.doesNotMatch(ready.checks[5].reason,/Both start and closing/);
 assert.throws(()=>run(s,'REQUEST_CLOSE'),/reviewer assess 11/);
 for(const capture of s.job.captures)s=run(s,'ASSESS_CAPTURE',{captureId:capture.id,status:'PASS',reason:'Inspected generated stage reference, visible code and paired test',challengeConfirmed:true,floodResult:'PASS'},'admin');
 assert.equal(handoverReadiness(s).canRequestClose,true);
 assert.equal(handoverReadiness(s).canIssue,false);
 s=run(s,'REQUEST_SUPPORT',{reason:'The drain junction needs a final review'},'homeowner');
 assert.equal(handoverReadiness(s).canRequestClose,false);
 assert.match(handoverReadiness(s).nextAction,/homeowner concern/);
 s=run(s,'RESOLVE_SUPPORT',{reason:'Reviewed the drain junction with the customer and recorded resolution'},'admin');
 s=run(s,'REQUEST_CLOSE');
 assert.equal(handoverReadiness(s).canIssue,false);
 s=run(s,'VERIFY_CLOSE',{purpose:'CLOSE',jobId:s.job.id,code:s.job.otps.CLOSE.code});
 assert.equal(handoverReadiness(s).canRequestClose,false);
 assert.equal(handoverReadiness(s).canIssue,true);
});
function proved(mode='terrace'){let s=started(mode);s=run(s,'SCAN_KIT',{},'presenter');while(nextStage(s)){const stage=nextStage(s);s=run(s,'NEXT_CURE',{},'presenter');if(stage.challenge_code)s=run(s,'REQUEST_CHALLENGE',{stageKey:stage.key});s=run(s,'CAPTURE_STAGE',{stageKey:stage.key,mode:'sample',location:{...s.job.site,accuracy:12,mode:'sample'},challengeCode:s.job.challenge?.code,weatherAcknowledged:true});s=run(s,'ASSESS_CAPTURE',{captureId:s.job.captures.at(-1).id,status:'PASS',reason:'Sample inspected against the demonstration method guide',challengeConfirmed:true,floodResult:'PASS'},'admin');}return s;}
for(const mode of ['terrace','bathroom'])test(mode+' proof requires both confirmations, issues once, rewards once and preserves public proof',()=>{let s=proved(mode);assert.ok(evaluateGate(s,false).every(c=>c.pass));assert.equal(evaluateGate(s,true)[5].pass,false);assert.throws(()=>run(s,'ISSUE_PASSPORT',{},'admin'),/six checks/);s=run(s,'REQUEST_CLOSE');s=run(s,'VERIFY_CLOSE',{jobId:s.job.id,purpose:'CLOSE',code:s.job.otps.CLOSE.code});s=run(s,'EVALUATE_GATE',{},'admin');assert.ok(s.job.gateRuns.at(-1).checks.every(c=>c.pass));s=run(s,'ISSUE_PASSPORT',{},'admin');const cert=structuredClone(s.job.certificate),count=s.points.length;s=run(s,'ISSUE_PASSPORT',{},'admin');assert.deepEqual(s.job.certificate,cert);assert.equal(s.points.length,count);s=run(s,'REPORT_PAYMENT',{amountPaise:s.job.approved.totalPaise});assert.equal(s.payments[0].status,'REPORTED');assert.equal(s.job.certificate.proofId,cert.proofId);assert.ok(verifyHistory(s.events));s=run(s,'VOID_PASSPORT',{reason:'Demonstration void action following supervisor review'},'admin');assert.equal(s.job.certificate.status,'VOID_DEMO');});
test('order, product prerequisites, curing and challenge assessment cannot be bypassed',()=>{let s=started();const st=nextStage(s);s=run(s,'SCAN_KIT',{},'presenter');const location={...s.job.site,accuracy:12,mode:'sample'};assert.throws(()=>run(s,'CAPTURE_STAGE',{stageKey:'coat_2',mode:'sample',location}),/order/);while(nextStage(s)?.key===st.key)s=run(s,'CAPTURE_STAGE',{stageKey:st.key,mode:'sample',location});while(nextStage(s)&&nextStage(s).min_gap_minutes===0){const stage=nextStage(s);if(stage.challenge_code)s=run(s,'REQUEST_CHALLENGE',{stageKey:stage.key});s=run(s,'CAPTURE_STAGE',{stageKey:stage.key,mode:'sample',location,challengeCode:s.job.challenge?.code});}const stage=nextStage(s);assert.throws(()=>run(s,'CAPTURE_STAGE',{stageKey:stage.key,mode:'sample',location}),/curing/);s=run(s,'NEXT_CURE',{},'presenter');if(stage.challenge_code){s=run(s,'REQUEST_CHALLENGE',{stageKey:stage.key});s=run(s,'CAPTURE_STAGE',{stageKey:stage.key,mode:'sample',location,challengeCode:s.job.challenge.code});assert.throws(()=>run(s,'ASSESS_CAPTURE',{captureId:s.job.captures.at(-1).id,status:'PASS',reason:'Reviewed details but code was not visually confirmed'},'admin'),/visibly/);}assert.equal(evaluateGate(s,false)[4].pass,false);});
test('reused pack stays blocked until removal and relevant replacement, redo preserves history',()=>{let s=proved();s=run(s,'SCAN_PACK',{serial:'DEMO-USED',location:{...s.job.site,accuracy:12,mode:'sample'}});assert.equal(evaluateGate(s,false)[0].pass,false);const bad=s.job.scans.at(-1),replacement=s.job.scans.find(r=>r.sku==='WPM810'&&r.outcome==='VALID');assert.throws(()=>run(s,'RESOLVE_SCAN',{scanId:bad.id,action:'removed-and-replaced',reason:'This reused pack is not allowed here',replacementSerial:'DEMO-USED'},'admin'),/replacement/);s=run(s,'RESOLVE_SCAN',{scanId:bad.id,action:'removed-and-replaced',reason:'Reused pack physically removed; valid replacement inspected',replacementSerial:replacement.serial},'admin');assert.equal(evaluateGate(s,false)[0].pass,true);const count=s.job.captures.length;s=run(s,'REDO_STAGE',{stageKey:s.job.approved.stages[1].key,reason:'Rework required following the sample supervisor inspection'},'admin');assert.equal(s.job.captures.length,count);assert.ok(s.job.captures.some(c=>c.superseded));assert.equal(evaluateGate(s,false)[4].pass,false);});
