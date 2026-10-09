import test from 'node:test'; import assert from 'node:assert/strict';
import {money, convertQuantity, snapshot} from '../src/domain/units.mjs';
test('unit boundaries reject mass-volume comparisons and money decimals', () => {assert.throws(()=>convertQuantity(10,'KG','L'));assert.throws(()=>money(1.5));assert.equal(convertQuantity(10,'FT','M'),3.048)});
test('approval snapshot cannot follow subsequent catalog mutation',()=>{const catalog={bom:[{sku:'WPM810',cost:560000}]};const frozen=snapshot(catalog);catalog.bom[0].cost=1;assert.equal(frozen.bom[0].cost,560000)});
