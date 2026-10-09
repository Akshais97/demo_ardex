import {createHash,randomUUID}from 'node:crypto';
import {fixtures,registryFixture}from '../data/fixtures.mjs';
import {advanceClock}from './state.mjs';
export class DomainError extends Error{constructor(code,message,retry=false){super(message);this.code=code;this.retry=retry;}}
export function requireRule(ok,code,message){if(!ok)throw new DomainError(code,message);}
export function initialState(id,catalog){return {schemaVersion:2,id,revision:0,clock:{now:Date.parse('2026-10-03T04:30:00Z'),offset:0},catalog,profile:{id:'app-ravi',name:'Ravi Kumar',city:'BLR',radiusKm:15,status:'CERTIFIED',tier:'SILVER',score:70,scoreReason:'Illustrative new applicator starting score; no audit or rating yet',loggedIn:false},scenario:'terrace',lead:null,offer:null,job:null,customer:null,registry:registryFixture(catalog),messages:[],events:[],points:[],payments:[],receipts:{},notices:[],mode:'shared-service',synthetic:true};}
export const foundationHandlers={
 CANCEL_JOB:(s,p,a)=>{requireRule(a==='applicator'&&s.job&&!['COMPLETED','CANCELLED'].includes(s.job.status),'CANCEL_STATE','Only an open assigned job can be cancelled');requireRule(String(p.reason||'').trim().length>=8,'CANCEL_REASON','Record why the job was cancelled');s.job.status='CANCELLED';s.job.cancelled={reason:p.reason,at:s.clock.now};for(const q of s.job.quotes)if(q.status==='SENT')q.status='CANCELLED';if(s.job.kit)s.job.kit.status='CANCELLED';const held=s.points.filter(r=>r.jobId===s.job.id).reduce((n,r)=>n+(r.heldDelta||0),0);if(held)s.points.push({id:randomUUID(),jobId:s.job.id,key:'cancel-hold:'+s.job.id,amount:0,status:'HOLD_CANCELLED',availableDelta:0,heldDelta:-held,at:s.clock.now});message(s,'cancelled','The demonstration job was cancelled. No Water Passport was issued.',{reason:p.reason});},
 NOTE:(s,p,a)=>{requireRule(a==='presenter','ACTOR_BLOCK','Presenter action only');s.notices.push({id:randomUUID(),text:String(p.text||'Foundation connected').slice(0,200)});s.messages.push({id:randomUUID(),kind:'notice',text:'Connected demo: '+String(p.text||'Foundation connected'),at:s.clock.now,transport:'simulated'});},
 ADVANCE:(s,p,a)=>{requireRule(a==='presenter','ACTOR_BLOCK','Presenter action only');s.clock=advanceClock(s.clock,p.minutes);},
 LOAD_SCENARIO:(s,p,a)=>{requireRule(a==='presenter','ACTOR_BLOCK','Presenter action only');requireRule(fixtures[p.scenario],'SCENARIO_UNKNOWN','Unknown scenario');const clean=initialState(s.id,s.catalog);clean.profile=s.profile;Object.assign(s,clean,{revision:s.revision,events:s.events,receipts:s.receipts,scenario:p.scenario});},
 STOP_MESSAGES:(s,p,a)=>{requireRule(a==='homeowner','ACTOR_BLOCK','Homeowner action only');requireRule(s.customer,'NO_CUSTOMER','No active customer');s.customer.messagingStopped=true;}
};
export function applyCommand(current,command,handlers=foundationHandlers){
 requireRule(command.sessionId===current.id,'SESSION_MISMATCH','Command belongs to another session');
 requireRule(typeof command.id==='string'&&command.id.length>0,'COMMAND_ID','Stable command ID required');
 if(command.expectedJobId!==undefined)requireRule(command.expectedJobId===(current.job?.id||null),'JOB_CHANGED','The active job changed; review the new workspace before continuing.');
 const prior=current.receipts[command.id];if(prior){requireRule(prior.fingerprint===JSON.stringify([command.type,command.actor,command.payload]),'ID_REUSE','Command ID was used with different content');return {state:current,duplicate:true};}
 requireRule(command.expectedRevision===current.revision,'STALE_REVISION','The workspace changed. Refresh and retry.',true);
 const handler=handlers[command.type];requireRule(handler,'UNKNOWN_COMMAND','This action is not implemented');
 const next=structuredClone(current);const priorEvents=current.events;const priorReceipts=current.receipts;
 handler(next,command.payload||{},command.actor);
 next.revision=current.revision+1;next.events=[...priorEvents];next.receipts={...priorReceipts};
 const event={id:randomUUID(),sequence:next.revision,commandId:command.id,actor:command.actor,type:command.type,objectId:next.job?.id||next.id,at:next.clock.now,receivedAt:Date.now(),payloadHash:createHash('sha256').update(JSON.stringify(command.payload||{})).digest('hex'),stateDigest:recordDigest(next),previousHash:priorEvents.at(-1)?.hash||'GENESIS'};
 event.hash=createHash('sha256').update(JSON.stringify(event)).digest('hex');next.events.push(event);
 if(command.type==='ISSUE_PASSPORT'&&next.job?.certificate?.proofAnchor==='ISSUANCE_EVENT'&&!next.job.certificate.proofId){next.job.certificate.proofId=event.hash;for(const m of next.messages)if(m.kind==='passport'&&m.certificate?.number===next.job.certificate.number)m.certificate.proofId=event.hash;}
 next.receipts[command.id]={revision:next.revision,fingerprint:JSON.stringify([command.type,command.actor,command.payload])};return {state:next,duplicate:false};
}
export function verifyHistory(events){let previous='GENESIS';for(const entry of events){const {hash,...event}=entry;if(event.previousHash!==previous||createHash('sha256').update(JSON.stringify(event)).digest('hex')!==hash)return false;previous=hash;}return true;}
export function recordDigest(s){const job=structuredClone(s.job);if(job?.certificate?.proofAnchor==='ISSUANCE_EVENT')job.certificate.proofId=null;return createHash('sha256').update(JSON.stringify({job,profile:s.profile,customer:s.customer,points:s.points,payments:s.payments,clock:s.clock,catalogVersion:s.catalog._meta.version,...(s.presentation?{presentation:s.presentation,messages:s.messages.map(m=>m.certificate?.proofAnchor==='ISSUANCE_EVENT'?{...m,certificate:{...m.certificate,proofId:null}}:m)}:{})})).digest('hex');}
export function verifyState(s){const last=s.events.at(-1),c=s.job?.certificate;const issuanceOk=c?.proofAnchor!=='ISSUANCE_EVENT'||s.events.some(e=>e.type==='ISSUE_PASSPORT'&&e.objectId===s.job.id&&e.hash===c.proofId);return issuanceOk&&verifyHistory(s.events)&&(!last?.stateDigest||last.stateDigest===recordDigest(s));}
export function message(s,kind,text,details={}){if(!s.customer?.messagingStopped)s.messages.push({id:randomUUID(),kind,text,at:s.clock.now,transport:'simulated',...details});}
