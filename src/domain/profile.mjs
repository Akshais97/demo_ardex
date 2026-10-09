import {requireRule,message}from './authority.mjs';
export function eligible(s){return s.profile.loggedIn&&s.profile.status==='CERTIFIED'&&s.profile.city==='BLR'&&s.profile.radiusKm>0;}
export const profileHandlers={
 REQUEST_LOGIN:(s,p,a)=>{requireRule(a==='applicator','ACTOR_BLOCK','Applicator login only');s.login={purpose:'LOGIN',code:'456123',expires:s.clock.now+300000,attempts:0};},
 VERIFY_LOGIN:(s,p,a)=>{requireRule(a==='applicator','ACTOR_BLOCK','Applicator login only');requireRule(s.login&&s.clock.now<s.login.expires,'LOGIN_EXPIRED','Request a new login code');requireRule(p.code===s.login.code,'LOGIN_CODE','Enter the simulated login code');s.profile.loggedIn=true;s.login=null;},
 SAVE_PROFILE:(s,p,a)=>{requireRule(a==='applicator'&&s.profile.loggedIn,'LOGIN_REQUIRED','Sign in first');requireRule(typeof p.name==='string'&&p.name.trim().length>=2&&p.name.length<=80,'PROFILE_NAME','Enter a name between 2 and 80 characters');requireRule(p.city==='BLR'&&Number.isFinite(p.radiusKm)&&p.radiusKm>=1&&p.radiusKm<=15,'PROFILE_COVERAGE','Bengaluru service radius must be 1–15 km');Object.assign(s.profile,{name:p.name.trim(),city:p.city,radiusKm:p.radiusKm});},
 SET_CERTIFICATION:(s,p,a)=>{requireRule(a==='admin','ACTOR_BLOCK','Supervisor owns certification');requireRule(['PENDING','VERIFIED','CERTIFIED','SUSPENDED'].includes(p.status),'PROFILE_STATUS','Invalid certification state');requireRule(String(p.reason||'').trim().length>=5,'REASON_REQUIRED','Record a supervisor reason');s.profile.status=p.status;s.profile.reviewReason=p.reason;},
 LOGOUT:(s,p,a)=>{requireRule(a==='applicator','ACTOR_BLOCK','Applicator action only');s.profile.loggedIn=false;}
};
export function publicProfile(profile){return {id:profile.id,name:profile.name,city:'Bengaluru',certification:profile.status,tier:profile.tier,demo:true};}
