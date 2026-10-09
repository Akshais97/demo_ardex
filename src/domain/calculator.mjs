// Pure PLAN rules: no React, Node, transport, or mutable browser state.
export class CalculationError extends Error {
  constructor(code, message) { super(message); this.code = code; }
}
function check(ok, code, message) { if (!ok) throw new CalculationError(code, message); }
const SCALE = 1_000_000;
const decimal = value => Number(value.toFixed(12));
const quantityCeil = value => Math.ceil(decimal(value * SCALE));
const validPaise = value => Number.isSafeInteger(value) && value >= 0;

export function selectPackages(catalog, areaType, diagnosis, clearance = null) {
  check(diagnosis?.answers && diagnosis?.analysis, 'DIAGNOSIS_REQUIRED', 'Confirm site diagnosis before choosing a system.');
  const cleared = clearance?.diagnosisId === diagnosis.id && typeof clearance.reason === 'string' && clearance.reason.trim().length >= 15;
  const structural = diagnosis.analysis.structural.length > 0 && !cleared;
  const answers = { ...diagnosis.answers, structural_flag: structural };
  const rules = catalog.decision_rules?.rules;
  check(Array.isArray(rules), 'DECISION_CONFIG', 'The package decision table is missing.');
  const rule = [...rules].filter(r => r.area_type === areaType).sort((a, b) => a.priority - b.priority)
    .find(r => Object.entries(r.conditions).every(([key, value]) => answers[key] === value));
  check(rule, 'NO_MATCHED_RULE', 'No package rule matches the confirmed site conditions.');
  check(!rule.blocking_message, 'SITE_BLOCK', rule.blocking_message);
  // A structural concern must remain blocked even if an incomplete table omits its blocking row.
  check(!structural, 'STRUCTURAL_BLOCK', 'Technical clearance for this diagnosis is required.');
  check(!(areaType === 'BATHROOM' && answers.tiles_removed === 'NO'), 'PREPARATION_BLOCK', 'Tile removal is required before calculation.');
  const options = ['GOOD', 'BETTER', 'BEST'].flatMap(tier => rule[tier.toLowerCase()] ? [{ tier, code: rule[tier.toLowerCase()] }] : []);
  const recommended = options.find(option => option.tier === rule.recommended);
  check(recommended, 'RECOMMENDATION_CONFIG', 'The recommended tier is missing from the allowed options.');
  for (const option of options) {
    const pkg = catalog.packages.find(p => p.code === option.code);
    check(pkg && pkg.area_type === areaType, 'PACKAGE_REFERENCE', 'Missing or incompatible package: ' + option.code);
  }
  return { ruleVersion: catalog.decision_rules.version, priority: rule.priority, conditions: { ...rule.conditions },
    explanation: Object.entries(rule.conditions).map(([key, value]) => `${key.replaceAll('_', ' ')} = ${value}`).join('; ') || 'Prepared bathroom; no blocking conditions',
    options, recommendedCode: recommended.code, technicalClearance: cleared ? clearance.reason : null };
}

export function optimisePacks(required, packs) {
  check(Number.isFinite(required) && required > 0 && required <= 100_000, 'QUANTITY_RANGE', 'Required quantity must be positive and no more than 100,000 product units.');
  check(Array.isArray(packs) && packs.length > 0 && packs.length <= 6, 'PACK_CONFIG', 'Provide one to six priced pack sizes.');
  const ordered = packs.map(pack => {
    check(Number.isFinite(pack.size) && pack.size > 0 && pack.size <= 100_000, 'PACK_SIZE', 'Pack sizes must be positive and supported.');
    check(validPaise(pack.price_paise) && pack.price_paise > 0, 'PACK_PRICE', 'Each pack needs a positive inclusive price in integer paise.');
    const units = Math.round(pack.size * SCALE);
    check(units > 0 && Math.abs(units - pack.size * SCALE) < 0.00001, 'PACK_PRECISION', 'Pack size supports up to six decimal places.');
    return { ...pack, units };
  }).sort((a, b) => b.units - a.units || a.price_paise - b.price_paise);
  check(new Set(ordered.map(p => p.units)).size === ordered.length, 'PACK_DUPLICATE', 'Duplicate pack sizes need catalog correction.');
  const target = quantityCeil(required);
  let best = null, visits = 0;
  function better(candidate) {
    if (!best) return true;
    if (candidate.costPaise !== best.costPaise) return candidate.costPaise < best.costPaise;
    if (candidate.packCount !== best.packCount) return candidate.packCount < best.packCount;
    if (candidate.units !== best.units) return candidate.units < best.units;
    for (let i = 0; i < candidate.counts.length; i++) if (candidate.counts[i] !== best.counts[i]) return candidate.counts[i] > best.counts[i];
    return false;
  }
  function walk(index, units, costPaise, packCount, counts) {
    check(++visits <= 250_000, 'PACK_SEARCH_LIMIT', 'This pack combination exceeds the supported search budget. Simplify the catalog or review the area.');
    if (best && costPaise > best.costPaise) return;
    if (index === ordered.length - 1) {
      const pack = ordered[index], count = Math.max(0, Math.ceil((target - units) / pack.units));
      const candidate = { units: units + count * pack.units, costPaise: costPaise + count * pack.price_paise, packCount: packCount + count, counts: [...counts, count] };
      check(validPaise(candidate.costPaise), 'MONEY_RANGE', 'Calculated material price exceeds the safe money range.');
      if (better(candidate)) best = candidate;
      return;
    }
    const pack = ordered[index], maxCount = Math.max(0, Math.ceil((target - units) / pack.units));
    // Positive prices mean an optimum never needs more than ceil(required / size) of any pack.
    // Enumerate all bounded combinations; the final size fills the remaining deficit exactly.
    for (let count = 0; count <= maxCount; count++) {
      const nextCost = costPaise + count * pack.price_paise;
      if (best && nextCost > best.costPaise) break;
      walk(index + 1, units + count * pack.units, nextCost, packCount + count, [...counts, count]);
    }
  }
  walk(0, 0, 0, 0, []);
  return { required: target / SCALE, purchased: best.units / SCALE, surplus: decimal((best.units - target) / SCALE),
    costPaise: best.costPaise, packCount: best.packCount,
    packs: ordered.flatMap((pack, i) => best.counts[i] ? [{ size: pack.size, count: best.counts[i], pricePaise: pack.price_paise, totalPaise: pack.price_paise * best.counts[i] }] : []) };
}

export function materialRequirement(sku, entry, area, measurement) {
  check(['KG', 'L', 'SQM', 'ROLL'].includes(sku.unit), 'SKU_UNIT', `${sku.code}: unsupported product unit.`);
  check(Number.isFinite(area.treated) && area.treated > 0 && Number.isFinite(area.perimeter) && area.perimeter > 0, 'AREA_REQUIRED', 'Valid treated area and perimeter are required.');
  check(Number.isFinite(sku.quantity_tolerance) && sku.quantity_tolerance >= 0 && sku.quantity_tolerance < 1, 'TOLERANCE_CONFIG', `${sku.code}: quantity tolerance is missing or invalid.`);
  if (entry.method === 'LINEAR') {
    check(sku.unit === 'ROLL' && Number.isFinite(sku.roll_length_m) && sku.roll_length_m > 0, 'ROLL_LENGTH', `${sku.code}: tape needs a valid roll length in metres.`);
    for (const key of ['drain_allowance_m', 'penetration_allowance_m']) check(Number.isFinite(entry[key]) && entry[key] >= 0, 'LINEAR_ALLOWANCE', `${sku.code}: ${key} is missing.`);
    for (const key of ['drains', 'penetrations']) check(Number.isInteger(measurement[key]) && measurement[key] >= 0, 'LINEAR_INPUT', `Enter a whole ${key} count.`);
    const perimeterMetres = decimal(area.perimeter * .3048);
    const drainMetres = measurement.drains * entry.drain_allowance_m, penetrationMetres = measurement.penetrations * entry.penetration_allowance_m;
    const lengthMetres = decimal(perimeterMetres + drainMetres + penetrationMetres);
    return { rawRequired: Math.ceil(lengthMetres / sku.roll_length_m), required: Math.ceil(lengthMetres / sku.roll_length_m),
      formula: `${perimeterMetres} m perimeter + ${drainMetres} m drains + ${penetrationMetres} m penetrations = ${lengthMetres} m; round up ÷ ${sku.roll_length_m} m per roll`,
      inputs: { perimeterMetres, drainMetres, penetrationMetres, lengthMetres, rollLengthMetres: sku.roll_length_m }, quantityTolerance: sku.quantity_tolerance };
  }
  check(entry.method === 'AREA' && sku.unit !== 'ROLL', 'BOM_METHOD', `${sku.code}: incompatible coverage method or unit.`);
  check(Number.isFinite(sku.coverage_per_sqft_coat) && sku.coverage_per_sqft_coat > 0, 'COVERAGE_MISSING', `${sku.code}: coverage is missing. Calculation is blocked; it is not zero material.`);
  check(Number.isInteger(entry.coats) && entry.coats > 0 && entry.coats <= 10, 'COAT_CONFIG', `${sku.code}: coats must be 1–10.`);
  check(Number.isFinite(entry.wastage) && entry.wastage >= 0 && entry.wastage <= 1, 'WASTAGE_CONFIG', `${sku.code}: wastage is missing or invalid.`);
  const fraction = entry.area_fraction ?? 1;
  check(Number.isFinite(fraction) && fraction > 0 && fraction <= 1, 'AREA_FRACTION', `${sku.code}: area fraction must be greater than zero and at most one.`);
  const rawRequired = decimal(area.treated * fraction * sku.coverage_per_sqft_coat * entry.coats * (1 + entry.wastage));
  return { rawRequired, required: quantityCeil(rawRequired) / SCALE,
    formula: `${area.treated} sq ft × ${fraction} area fraction × ${sku.coverage_per_sqft_coat} ${sku.unit}/sq ft/coat × ${entry.coats} coats × ${1 + entry.wastage} wastage factor`,
    inputs: { treatedSqft: area.treated, fraction, coverage: sku.coverage_per_sqft_coat, coats: entry.coats, wastage: entry.wastage }, quantityTolerance: sku.quantity_tolerance };
}

export function calculatePackage(catalog, packageCode, diagnosis, city, labourRatePaise = undefined) {
  const pkg = catalog.packages.find(p => p.code === packageCode);
  check(pkg && Array.isArray(pkg.bom) && pkg.bom.length > 0, 'PACKAGE_CONFIG', 'Package bill of materials is missing: ' + packageCode);
  const area = diagnosis.area, measurement = diagnosis.measurement;
  check(area && measurement && Number.isFinite(area.treated) && area.treated > 0 && area.treated <= 100_000, 'AREA_REQUIRED', 'Confirm a valid treated area before calculation.');
  check(Number.isFinite(pkg.upturn_ft) && area.upturn >= pkg.upturn_ft, 'UPTURN_MINIMUM', `${pkg.name}: measured upturn must be at least ${pkg.upturn_ft} ft. Update the diagnosis.`);
  const band = pkg.labour_bands?.[city];
  check(band && [band.min_per_sqft_paise, band.default_per_sqft_paise, band.max_per_sqft_paise].every(validPaise) && band.min_per_sqft_paise <= band.default_per_sqft_paise && band.default_per_sqft_paise <= band.max_per_sqft_paise, 'LABOUR_CONFIG', `${pkg.name}: valid labour band is missing for ${city}.`);
  const ratePaise = labourRatePaise ?? band.default_per_sqft_paise;
  check(validPaise(ratePaise) && ratePaise >= band.min_per_sqft_paise && ratePaise <= band.max_per_sqft_paise, 'LABOUR_BAND', `Labour rate must be ₹${band.min_per_sqft_paise / 100}–₹${band.max_per_sqft_paise / 100} per treated sq ft.`);
  check(new Set(pkg.bom.map(b => b.sku)).size === pkg.bom.length, 'BOM_DUPLICATE', `${pkg.name}: duplicate SKU entries require catalog correction.`);
  const bom = pkg.bom.map(entry => {
    const sku = catalog.skus.find(s => s.code === entry.sku);
    check(sku, 'SKU_MISSING', `Missing catalog SKU: ${entry.sku}.`);
    const requirement = materialRequirement(sku, entry, area, measurement), purchase = optimisePacks(requirement.required, sku.packs);
    return { sku: sku.code, name: sku.name, unit: sku.unit, ...requirement, ...purchase };
  });
  const materialPaise = bom.reduce((sum, item) => sum + item.costPaise, 0), labourPaise = Math.round(area.treated * ratePaise), totalPaise = materialPaise + labourPaise;
  check([materialPaise, labourPaise, totalPaise].every(validPaise), 'MONEY_RANGE', 'Calculated totals exceed safe integer paise.');
  return { packageCode, packageName: pkg.name, tier: pkg.tier, description: pkg.description, catalogVersion: catalog._meta.version,
    packageSnapshot: JSON.parse(JSON.stringify(pkg)), area: JSON.parse(JSON.stringify(area)), bom,
    materialPaise, labourPaise, totalPaise, labour: { basis: 'treated area', areaSqft: area.treated, ratePaise, band: { ...band }, city },
    pricing: { taxInclusive: true, gstAddedPaise: 0, label: 'Illustrative inclusive pack prices; no GST added again' },
    warrantyYearsIllustrative: pkg.warranty_years, status: 'CALCULATED_DRAFT', illustrative: true };
}
