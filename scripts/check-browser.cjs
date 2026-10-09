const { chromium } = require('C:/Users/Jaswanth/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs = require('node:fs');
(async () => {
 const browser = await chromium.launch({channel:'msedge',headless:true});
 const context = await browser.newContext({viewport:{width:1440,height:1100}});
 const page = await context.newPage(); const errors = [];
 page.on('pageerror', e => errors.push(e.message));
 await page.goto(process.env.DEMO_URL || 'http://127.0.0.1:5173');
 await page.getByText('Saved on this browser', {exact:true}).waitFor();
 const id = await page.locator('.session-bar code').innerText();
 await page.screenshot({path:'evidence/P1-D02-desktop.png',fullPage:true});
 await page.getByRole('button',{name:'Runtime readiness'}).click();
 await page.reload(); await page.getByText('Ready for the room.',{exact:true}).waitFor();
 if (await page.locator('.session-bar code').innerText() !== id) throw Error('Session did not persist');
 await page.getByRole('button',{name:'Build scope'}).click();
 if (await page.locator('.scope-list article').count() !== 22) throw Error('Scope count mismatch');
 await page.locator('nav button').filter({hasText:'Workspace'}).click();
 await page.setViewportSize({width:390,height:844});
 await page.getByRole('button',{name:'homeowner',exact:true}).click();
 await page.reload(); await page.getByText('Saved on this browser',{exact:true}).waitFor();
 if (!await page.locator('.homeowner').isVisible() || await page.locator('.applicator').isVisible()) throw Error('Role focus failed');
 await page.screenshot({path:'evidence/P1-D02-mobile.png',fullPage:true});
 if (await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)) throw Error('Mobile horizontal overflow');
 const other = await browser.newContext(); const second = await other.newPage(); await second.goto('http://127.0.0.1:5173'); await second.getByText('Saved on this browser',{exact:true}).waitFor();
 if (await second.locator('.session-bar code').innerText() === id) throw Error('Independent browser isolation failed');
 await other.close();
 // Block all external access: a locally served compiled app must remain usable.
 await context.route('**/*', route => route.request().url().startsWith('http://127.0.0.1:') ? route.continue() : route.abort());
 await page.reload(); await page.getByText('Saved on this browser',{exact:true}).waitFor();
 if (errors.length) throw Error(errors.join('\n'));
 fs.writeFileSync('evidence/browser-validation.json',JSON.stringify({passed:true,url:process.env.DEMO_URL || 'http://127.0.0.1:5173',checks:['desktop render','scope 22 records','session and view refresh','mobile role refresh','no horizontal overflow','independent browser isolation','external network blocked'],errors},null,2));
 await browser.close(); console.log('Browser checks passed');
})().catch(e => {console.error(e); process.exit(1)});


