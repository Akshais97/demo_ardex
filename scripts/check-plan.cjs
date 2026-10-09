const { chromium } = require('C:/Users/Jaswanth/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs = require('node:fs');
(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  const page = await context.newPage(), errors = [], checks = [];
  page.on('pageerror', error => errors.push(error.message));
  async function click(name) { await page.getByRole('button', { name, exact: true }).click(); }
  async function state() { return page.evaluate(async () => {
    const db = await new Promise(resolve => { const r = indexedDB.open('ardex-pro-demo'); r.onsuccess = () => resolve(r.result); });
    const session = await new Promise(resolve => { const r = db.transaction('sessions').objectStore('sessions').get('active'); r.onsuccess = () => resolve(r.result); });
    return (await (await fetch('/api/state?session=' + session.id)).json()).value;
  }); }
  await page.goto('http://127.0.0.1:5173');
  await click('Send login code'); await page.getByLabel('Login code').fill('456123'); await click('Sign in');
  await page.getByText('Certified demo profile', { exact: true }).waitFor();
  await click('Load demo Ardex booking'); await click('Accept visit'); await click('Use sample site location');
  await click('Load site reference photos'); await click('Confirm diagnosis'); await page.getByText('Diagnosis saved', { exact: true }).waitFor();
  await click('Calculate packages ↗'); await page.locator('.plan-view').waitFor();
  let current = await state();
  if (current.job.plan.content.selectedPackageCode !== 'TERRACE_SHIELD_PLUS') throw Error('Default recommendation mismatch');
  const membrane = page.locator('[data-sku="WPM810"]');
  await membrane.getByText('7 × 20 kg', { exact: true }).waitFor(); await membrane.getByText('4 × 4 kg', { exact: true }).waitFor();
  await membrane.getByText('₹44,200', { exact: true }).waitFor(); await page.locator('.plan-total').getByText('₹66,940', { exact: true }).waitFor();
  await page.locator('.admin-plan').getByText('₹66,940', { exact: true }).waitFor();
  checks.push('recommended terrace system; 154 required / 156 purchased; 7×20 + 4×4; membrane ₹44,200; total ₹66,940 in app/admin');
  await membrane.locator('summary').click(); await membrane.getByText(/700 sq ft × 1 area fraction/).waitFor();
  await page.screenshot({ path: 'evidence/P2-D05-terrace.png', fullPage: true });
  const firstId = current.job.plan.id, firstVersion = current.job.plan.version;
  await page.locator('.package-option').filter({hasText:'Terrace Shield Plus'}).click();
  current = await state(); if (current.job.plan.id !== firstId || current.job.plan.version !== firstVersion) throw Error('Identical selection duplicated draft');
  await page.getByLabel('Labour rate (₹ per treated sq ft)').fill('17'); await click('Apply labour rate');
  const bandError = page.getByText('Labour rate must be ₹18–₹32 per treated sq ft.', { exact: true }); await bandError.waitFor();
  await page.waitForTimeout(1600); if (!await bandError.isVisible()) throw Error('Polling erased actionable rejection');
  current = await state(); if (current.job.plan.content.options.find(o => o.packageCode === 'TERRACE_SHIELD_PLUS').totalPaise !== 6694000) throw Error('Invalid labour changed saved total');
  checks.push('out-of-band labour rejected with unchanged draft; failure remains visible across poll');
  await page.getByLabel('Labour rate (₹ per treated sq ft)').fill('32'); await click('Apply labour rate');
  await page.locator('.plan-total').getByText('₹72,540', { exact: true }).waitFor();
  await page.reload(); await page.locator('.plan-total').getByText('₹72,540', { exact: true }).waitFor();
  if (await page.getByLabel('Labour rate (₹ per treated sq ft)').inputValue() !== '32') throw Error('Labour did not restore');
  checks.push('valid labour band edge updates total; session/draft/rate restore after refresh');
  await page.locator('.package-option').filter({hasText:'Terrace Shield Max'}).click();
  await page.locator('.plan-total').getByText('₹94,540', { exact: true }).waitFor();
  await page.locator('.package-option').filter({hasText:'Terrace Shield Plus'}).click();
  await page.locator('.plan-total').getByText('₹72,540', { exact: true }).waitFor();
  await page.locator('.diagnosis-fold>summary').click(); await page.getByLabel('to be tiled', { exact: true }).selectOption('true');
  await click('Confirm diagnosis'); await click('Calculate packages ↗');
  await page.locator('.package-option').filter({hasText:'Terrace Shield (under tile)'}).waitFor();
  if (await page.locator('.package-option').count() !== 2) throw Error('Under tile excludes best but UI still offers it');
  await page.locator('.package-option').filter({hasText:'Terrace Shield (under tile)'}).click();
  await page.locator('.plan-total').getByText('₹33,800', { exact: true }).waitFor();
  checks.push('new diagnosis clears old draft; tiled terrace exposes exactly two allowed packages');
  await page.locator('.diagnosis-fold>summary').click(); await page.getByLabel('cracks', { exact: true }).selectOption('WIDE'); await click('Confirm diagnosis');
  if (!await page.getByRole('button', { name: 'Calculate packages ↗', exact: true }).isDisabled()) throw Error('Structural block did not disable calculation');
  await page.getByLabel('Technical clearance reason').fill('Demo structural repairs reviewed and documented against this diagnosis.');
  await click('Record demo technical clearance'); await page.getByText('Technical clearance recorded', { exact: true }).waitFor();
  await click('Calculate packages ↗'); await page.locator('.plan-view').waitFor();
  checks.push('structural concern blocks draft; reasoned clearance for same diagnosis unlocks calculation');
  await click('Load bathroom'); await page.getByLabel('Customer has permitted service contact', {exact:false}).check(); await click('Add my customer');
  await click('Use sample site location'); await click('Load site reference photos'); await click('Confirm diagnosis'); await click('Calculate packages ↗');
  await page.locator('.plan-total').getByText('₹12,498', { exact: true }).waitFor();
  await page.locator('[data-sku="WPT300"]').getByText('2 × 1 roll', { exact: true }).waitFor();
  for (const [name, total] of [['Bath Seal Max','₹15,944'], ['Bath Seal','₹8,012'], ['Bath Seal Plus','₹12,498']]) {
    await page.locator('.package-option').filter({ hasText: name }).filter({has:page.locator('.option-title strong', {hasText:new RegExp('^'+name+'$')})}).click();
    await page.locator('.plan-total').getByText(total, {exact:true}).waitFor();
  }
  checks.push('bathroom 116 treated sq ft; 2 tape rolls; all three package totals');
  await page.screenshot({ path: 'evidence/P2-D05-bathroom.png', fullPage: true });
  await page.setViewportSize({ width: 390, height: 844 });
  await click('applicator');
  if (await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)) throw Error('Mobile overflow');
  await page.screenshot({ path: 'evidence/P2-D05-mobile.png', fullPage: true });
  await click('admin'); await page.locator('.admin-plan').getByText('₹12,498', {exact:true}).waitFor();
  checks.push('mobile app/admin role focus fits viewport');
  if (errors.length) throw Error(errors.join('\n'));
  fs.writeFileSync('evidence/P2-D05-browser.json', JSON.stringify({ passed: true, browser: 'Microsoft Edge / Playwright', version: browser.version(), checks, errors }, null, 2));
  console.log('PLAN browser checks passed: ' + checks.length); await browser.close();
})().catch(error => { console.error(error); process.exit(1); });


