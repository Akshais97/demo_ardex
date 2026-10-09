import { useEffect, useState } from 'react';
import { Action, Field, Notice } from './components';
import type { WorkflowProps } from './Workflow';

export const price = (paise: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(paise / 100);
const number = (value: number, decimals = 6) => new Intl.NumberFormat('en-IN', { maximumFractionDigits: decimals }).format(value);
const unitName: Record<string, string> = { KG: 'kg', L: 'L', SQM: 'm²', ROLL: 'rolls' };

export function PlanView({ s, command, busy }: WorkflowProps) {
  const plan = s.job?.plan, content = plan?.content;
  const selected = content?.options.find((option: any) => option.packageCode === content.selectedPackageCode);
  const [labour, setLabour] = useState(''), [inputError, setInputError] = useState('');
  useEffect(() => { setLabour(selected ? String(selected.labour.ratePaise / 100) : ''); setInputError(''); }, [selected?.packageCode, selected?.labour.ratePaise]);
  if (!s.job?.diagnosis || s.job.status !== 'DIAGNOSIS') return null;
  const diagnosis = s.job.diagnosis;
  const blocked = diagnosis.analysis.structural.length > 0 && s.job.structuralClearance?.diagnosisId !== diagnosis.id || s.job.areaType === 'BATHROOM' && diagnosis.answers.tiles_removed === 'NO';
  async function adjustLabour() {
    if (!/^\d+(\.\d{1,2})?$/.test(labour)) { setInputError('Enter a rupee rate with up to two decimal places.'); return; }
    setInputError('');
    await command('CALCULATE_PLAN', { packageCode: selected.packageCode, labourRatePaise: Math.round(Number(labour) * 100) });
  }
  if (!plan) return <section className="plan-start"><div className="step-label">STEP 2 / PLAN</div><h3>Turn the diagnosis<br/>into the right system.</h3><p className="body-copy">Compare the allowed packages. See exactly what the site needs, and what the materials cost.</p><Notice tone={blocked ? 'blocked' : 'info'} title={blocked ? 'Resolve the site concern first' : 'Illustrative technical & commercial values'}>{blocked ? 'Package calculation stays locked until preparation is corrected or technical clearance is recorded.' : 'Coverage, systems, rates and warranty terms need Ardex confirmation before a real job.'}</Notice><Action disabled={busy || blocked} onClick={() => command('CALCULATE_PLAN')}>Calculate packages ↗</Action></section>;
  return <section className="plan-view">
    <div className="plan-hero"><span>PLAN · MATCHED TO THIS SITE</span><h3>The right system.<br/>Every pack accounted for.</h3><div><strong>{number(selected.area.treated, 2)}</strong><span>sq ft treated</span><small>{number(selected.area.floor, 2)} sq ft floor · {number(selected.area.perimeter, 2)} ft perimeter</small></div></div>
    <div className="illustrative-strip">Sample values · systems, coverage and rates pending Ardex confirmation.</div>
    <div className="rule-match"><span className="small-label">WHY THESE OPTIONS</span><p>{content.selection.explanation}</p>{content.selection.technicalClearance && <small>Technical clearance: {content.selection.technicalClearance}</small>}</div>
    <div className="package-options" role="group" aria-label="Allowed system packages">{content.options.map((option: any) => <button key={option.packageCode} className={'package-option ' + (selected.packageCode === option.packageCode ? 'active' : '')} aria-pressed={selected.packageCode === option.packageCode} disabled={busy} onClick={() => command('CALCULATE_PLAN', { packageCode: option.packageCode })}>
      <div className="option-top"><span>{option.offeredTier}</span>{option.recommended && <b>RECOMMENDED</b>}</div><div className="option-title"><strong>{option.packageName}</strong><i>{selected.packageCode === option.packageCode ? '●' : '○'}</i></div><p>{option.description}</p><div className="option-price"><b>{price(option.totalPaise)}</b><small>materials + labour</small></div>
    </button>)}</div>
    <div className="material-heading"><h3>Your material list</h3><span>{selected.bom.reduce((sum: number, item: any) => sum + item.packCount, 0)} packs</span></div>
    <p className="body-copy">Least-cost covering packs at the illustrative price card. This is a draft list; no kit has been ordered.</p>
    <div className="bom-list">{selected.bom.map((item: any) => <article className="bom-item" key={item.sku} data-sku={item.sku}>
      <div className="sku-heading"><b>{item.sku}</b><span>{unitName[item.unit]}</span></div><h4>{item.name}</h4><div className="quantity-columns"><div><strong>{number(item.required)}</strong><small>{unitName[item.unit]} required</small></div><div><strong>{number(item.purchased)}</strong><small>{unitName[item.unit]} in packs</small></div></div>
      <div className="pack-combination">{item.packs.map((pack: any) => <span key={pack.size}>{pack.count} × {number(pack.size)} {item.unit === 'ROLL' && pack.size === 1 ? 'roll' : unitName[item.unit]}</span>)}</div>
      <div className="item-cost"><span>{number(item.surplus)} {unitName[item.unit]} surplus</span><b>{price(item.costPaise)}</b></div>
      <details className="formula-detail"><summary>How this quantity was calculated</summary><p>{item.formula}</p><p>Before pack rounding: {number(item.rawRequired)} {unitName[item.unit]}. Minimum requirement rounded up to 6 decimal places.</p><p>Quantity tolerance: {number(item.quantityTolerance * 100)}% illustrative policy. This does not establish that less material is technically acceptable.</p><p>{item.packs.map((pack: any) => `${pack.count} × ${price(pack.pricePaise)}`).join(' + ')} = {price(item.costPaise)}</p></details>
    </article>)}</div>
    <div className="labour-card"><span className="small-label">LABOUR · BENGALURU</span><h3>Same area. Clear rate.</h3><p>{number(selected.labour.areaSqft, 2)} treated sq ft × {price(selected.labour.ratePaise)} per sq ft</p><Field label="Labour rate (₹ per treated sq ft)"><input type="text" inputMode="decimal" value={labour} onChange={e => setLabour(e.target.value)} /></Field><small>Allowed band: {price(selected.labour.band.min_per_sqft_paise)}–{price(selected.labour.band.max_per_sqft_paise)} / sq ft</small>{inputError && <Notice tone="blocked" title={inputError} />}<Action disabled={busy} onClick={adjustLabour}>Apply labour rate</Action></div>
    <div className="plan-total"><div><span>Materials</span><b>{price(selected.materialPaise)}</b></div><div><span>Labour</span><b>{price(selected.labourPaise)}</b></div><div className="total-row"><span>Draft total</span><strong>{price(selected.totalPaise)}</strong></div><p>Inclusive illustrative prices · no GST added again</p></div>
    <Notice title="Calculated draft · not sent to homeowner">Selected system and material list are saved for the quote step. No approval, order or warranty has been created.</Notice>
    <div className="draft-reference">Draft v{plan.version} · catalog {content.catalogVersion} · diagnosis v{content.diagnosisVersion}</div>
  </section>;
}

export function PlanSummary({ s }: Pick<WorkflowProps, 's'>) {
  const plan = s.job?.plan;
  if (!plan) return null;
  const selected = plan.content.options.find((option: any) => option.packageCode === plan.content.selectedPackageCode);
  return <div className="admin-plan"><span className="small-label">PLAN DRAFT · V{plan.version}</span><h3>{selected.packageName}</h3><div className="readiness-row"><span>Materials</span><b>{price(selected.materialPaise)}</b></div><div className="readiness-row"><span>Labour · treated area</span><b>{price(selected.labourPaise)}</b></div><div className="readiness-row"><span>Draft total</span><b>{price(selected.totalPaise)}</b></div><p>Not sent · no homeowner approval</p><small>Catalog {plan.content.catalogVersion} · {selected.bom.length} product lines · ready for an itemised quote.</small></div>;
}


