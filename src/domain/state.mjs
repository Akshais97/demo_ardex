export const transitions = {
 VISIT_BOOKED:{CHECK_IN:{actor:'applicator',next:'DIAGNOSIS'}},
 DIAGNOSIS:{SEND_QUOTE:{actor:'applicator',next:'QUOTE_SENT'}},
 QUOTE_SENT:{APPROVE_QUOTE:{actor:'homeowner',next:'APPROVED'},REVISE_QUOTE:{actor:'applicator',next:'DIAGNOSIS'}},
 APPROVED:{READY_KIT:{actor:'dealer',next:'KIT_READY'}},
 KIT_READY:{VERIFY_START:{actor:'applicator',next:'IN_PROGRESS'}},
 IN_PROGRESS:{EVALUATE_GATE:{actor:'admin',next:'REVIEW'}},
 REVIEW:{REQUEST_REDO:{actor:'admin',next:'IN_PROGRESS'},CLEAR_GATE:{actor:'admin',next:'HANDOVER'}},
 HANDOVER:{ISSUE_PASSPORT:{actor:'admin',next:'COMPLETED'}},COMPLETED:{},CANCELLED:{}
};
export function transition(status,command,actor){
 if(command==='CANCEL'&&!['COMPLETED','CANCELLED'].includes(status)&&actor==='applicator')return 'CANCELLED';
 const rule=transitions[status]?.[command];if(!rule)throw Error(`STATE_BLOCK: ${command} is not available in ${status}`);
 if(rule.actor!==actor)throw Error(`ACTOR_BLOCK: ${rule.actor} owns ${command}`);return rule.next;
}
export function advanceClock(clock,minutes){if(!Number.isFinite(minutes)||minutes<=0||minutes>525600)throw Error('CLOCK_BLOCK: only bounded forward time is allowed');return {...clock,now:clock.now+minutes*60000,offset:clock.offset+minutes*60000};}
export function offerStatus(offer,now){return offer.status==='OFFERED'&&now>=offer.deadline?'EXPIRED':offer.status;}
export function stageUnlock(stages,evidence,index){if(index===0)return 0;const previous=evidence.filter(e=>e.stageKey===stages[index-1].key&&!e.superseded);if(previous.length<stages[index-1].shots)return Infinity;return Math.max(...previous.map(e=>e.at))+stages[index].min_gap_minutes*60000;}
