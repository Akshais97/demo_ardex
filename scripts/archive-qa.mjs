// Archive only the named automated-check runs; preserve all user and seed workspaces.
import {db,save,run,audit}from '../server/database.mjs';
import {randomUUID}from 'node:crypto';
import {readFileSync}from 'node:fs';
const emptyQA=new Set(['2377ae6b-64f3-4191-af2c-fc801d8f1504']);
try{const captured=JSON.parse(readFileSync(new URL('../evidence/qa-fresh-session.json',import.meta.url),'utf8'));if(captured.source==='check-guided-presentation.cjs'&&/^[a-f0-9-]{36}$/.test(captured.id))emptyQA.add(captured.id);}catch{}
db.exec('BEGIN IMMEDIATE');
try{
 const retired=new Set();let count=0;
 for(const row of db.prepare('SELECT id,state FROM workspaces').all()){
  let s=JSON.parse(row.state);
  if(!/^(journey-|resilience-|rbac-|failure-)/.test(row.id)&&!(emptyQA.has(row.id)&&!s.job&&!s.lead&&s.presentation?.step==='CONSENT'))continue;
  if(s.job?.certificate?.status==='ACTIVE_DEMO')s=run(s,'VOID_PASSPORT',{reason:'Automated acceptance run archived after verification; not a customer job'},'admin');
  else if(s.job&&!['COMPLETED','CANCELLED'].includes(s.job.status))s=run(s,'CANCEL_JOB',{reason:'Automated acceptance run retired after verification'});
  if(s.job)retired.add(s.job.id);
  s.retiredQA={originalId:row.id,at:Date.now(),reason:'Automated acceptance fixture'};s.id='archive-qa-'+randomUUID();save(s);
  db.prepare('DELETE FROM workspaces WHERE id=?').run(row.id);count++;
 }
 let released=0;
 for(const row of db.prepare('SELECT serial,pack FROM registry').all()){
  const pack=JSON.parse(row.pack);
  if(retired.has(pack.consumedBy)||retired.has(pack.reservedFor)){if(retired.has(pack.consumedBy))pack.consumedBy=null;if(retired.has(pack.reservedFor))delete pack.reservedFor;db.prepare('UPDATE registry SET pack=? WHERE serial=?').run(JSON.stringify(pack),row.serial);released++;}
 }
 audit('system','ARCHIVE_AUTOMATED_QA',{count,released,scope:'Explicit automated test prefixes only; archived certificates voided'});
 db.exec('COMMIT');console.log(`Archived ${count} automated test workspaces; released ${released} synthetic test packs. User workspaces and seed jobs preserved.`);
}catch(e){db.exec('ROLLBACK');throw e;}
