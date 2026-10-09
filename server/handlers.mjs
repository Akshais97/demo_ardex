import {requireRule}from '../src/domain/authority.mjs';
import {foundationHandlers} from '../src/domain/authority.mjs';
import {profileHandlers}from '../src/domain/profile.mjs';
import {leadHandlers}from '../src/domain/leads.mjs';
import {myLeadHandlers}from '../src/domain/my-lead.mjs';
import {diagnosisHandlers}from '../src/domain/diagnosis.mjs';
import {planHandlers}from '../src/domain/plan.mjs';
import {quoteHandlers}from '../src/domain/quotes.mjs';
import {kitHandlers}from '../src/domain/kit.mjs';
import {scanHandlers}from '../src/domain/scans.mjs';
import {executionHandlers}from '../src/domain/execution.mjs';
import {journeyHandlers,syncJourney}from '../src/domain/journey.mjs';
const combined={...foundationHandlers,...profileHandlers,...leadHandlers,...myLeadHandlers,...diagnosisHandlers,...planHandlers,...quoteHandlers,...kitHandlers,...scanHandlers,...executionHandlers,...journeyHandlers};
export const handlers=Object.fromEntries(Object.entries(combined).map(([type,handler])=>[type,(s,p,a)=>{handler(s,p,a);if(type==='CALCULATE_PLAN'&&s.presentation){s.job.plan.content.options=s.job.plan.content.options.filter(o=>['TERRACE_SHIELD','TERRACE_SHIELD_PLUS'].includes(o.packageCode));requireRule(s.job.plan.content.options.length>0,'PILOT_SYSTEM_SCOPE','This site requires a system outside the proposed terrace pilot; request technical review');if(!s.job.plan.content.options.some(o=>o.packageCode===s.job.plan.content.selectedPackageCode))s.job.plan.content.selectedPackageCode=s.job.plan.content.options[0].packageCode;}syncJourney(s,type,p);} ]));

