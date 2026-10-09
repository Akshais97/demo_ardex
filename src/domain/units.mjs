export function finitePositive(value, label) { if (!Number.isFinite(value) || value <= 0 || value > 100000) throw Error(`${label}: enter a positive value within the supported range`); return value; }
export function money(value) { if (!Number.isSafeInteger(value) || value < 0) throw Error('Money must be non-negative integer paise'); return value; }
export function feet(value, unit) { if (!['FT','M'].includes(unit)) throw Error('Unsupported length unit'); const length=finitePositive(value,'Length');return unit==='M'?length/.3048:length; }
export function convertQuantity(value, from, to) {
 if (!Number.isFinite(value) || value < 0) throw Error('Invalid quantity');
 if (from === to && ['KG','L','SQM','ROLL','FT','M'].includes(from)) return value;
 if (from === 'FT' && to === 'M') return value * .3048;
 if (from === 'M' && to === 'FT') return value / .3048;
 throw Error(`Cannot compare ${from} with ${to}`);
}
export const snapshot = value => JSON.parse(JSON.stringify(value));
export const formatMoney = paise => new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:0}).format(money(paise)/100);
