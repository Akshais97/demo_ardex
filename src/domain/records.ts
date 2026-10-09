import type { Actor } from './service-contract';
export type MoneyPaise = number;
export type Unit = 'KG' | 'L' | 'SQM' | 'ROLL';
export type JobStatus = 'VISIT_BOOKED' | 'DIAGNOSIS' | 'QUOTE_SENT' | 'APPROVED' | 'KIT_READY' | 'IN_PROGRESS' | 'REVIEW' | 'HANDOVER' | 'COMPLETED' | 'CANCELLED';
export type Attribution = { source: 'ardex' | 'my-lead'; gclid?: string; ctwaClickId?: string; campaign?: string; marketingConsent: boolean; synthetic: true };
export interface IdentityGraph { sessionId: string; leadId: string; homeownerId: string; jobId: string; applicatorId: string; dealerId?: string; quoteId?: string; certificateId?: string }
export interface Measurement { method: 'dimensions' | 'direct'; unit: 'FT' | 'M'; length?: number; width?: number; floorArea?: number; perimeter?: number; upturn: number; showerLength: number; showerHeight: number; drains: number; penetrations: number }
export interface Payment { id: string; jobId: string; amountPaise: MoneyPaise; status: 'REPORTED' | 'VERIFIED'; mode: 'CASH' | 'UPI'; providerEvidence?: string }
export interface QuoteSnapshot { id: string; jobId: string; version: number; catalogVersion: string; package: unknown; bom: unknown[]; materialPaise: MoneyPaise; labourPaise: MoneyPaise; totalPaise: MoneyPaise; taxInclusive: true; approvedAt?: number }
export interface PlanMaterial { sku:string; name:string; unit:Unit; rawRequired:number; required:number; purchased:number; surplus:number; quantityTolerance:number; costPaise:MoneyPaise; formula:string; packs:{size:number;count:number;pricePaise:MoneyPaise;totalPaise:MoneyPaise}[] }
export interface PlanOption { packageCode:string;packageName:string;packageSnapshot:unknown;catalogVersion:string;bom:PlanMaterial[];materialPaise:MoneyPaise;labourPaise:MoneyPaise;totalPaise:MoneyPaise;recommended:boolean;offeredTier:'GOOD'|'BETTER'|'BEST';status:'CALCULATED_DRAFT';illustrative:true }
export interface PlanDraft { id:string;jobId:string;version:number;calculatedAt:number;content:{diagnosisId:string;diagnosisVersion:number;catalogVersion:string;selectedPackageCode:string;options:PlanOption[];status:'CALCULATED_DRAFT';illustrative:true} }
export interface Evidence { id: string; jobId: string; stageKey: string; attempt: number; occurrenceAt: number; receivedAt: number; mode: 'camera' | 'sample'; hash: string; challenge?: string; challengeConfirmed: boolean; location: {lat: number; lng: number; accuracy: number; mode: 'live' | 'sample'} }
export interface CommandEnvelope { id: string; sessionId: string; actor: Actor | 'presenter' | 'dealer'; expectedRevision: number; type: string; payload: unknown }
export type AdapterResult<T> = { ok: true; value: T; revision: number; capability: 'local' | 'service' | 'simulated' } | { ok: false; error: {code: string; message: string; retry: boolean}; revision: number };
export interface AuditEvent { id: string; sequence: number; commandId: string; actor: string; type: string; objectId: string; at: number; receivedAt: number; previousHash: string; hash: string }
export const recordOwners = {
 session:['presenter','all views'], applicator:['admin','routing and quote'], homeowner:['intake','Sakhaa'], lead:['Sakhaa/applicator','job'], offer:['routing','applicator'], job:['domain service','all views'], diagnosis:['applicator','PLAN'], quote:['PLAN','homeowner and kit'], kit:['dealer','execution'], pack:['registry','scan'], scan:['registry','gate and points'], capture:['applicator','gate'], flood:['applicator/reviewer','gate'], otp:['domain service','Sakhaa and gate'], gate:['PROOF','review'], review:['supervisor','gate'], certificate:['issuance','Water Passport'], payment:['applicator/provider','outcomes'], points:['ledger','earnings'], event:['domain service','all projections']
} as const;
