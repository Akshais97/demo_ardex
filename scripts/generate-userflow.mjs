import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = path.join(root, 'docs/user-flows');
const escape = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');
const inline = value => escape(value)
  .replace(/`([^`]+)`/g, '<code>$1</code>')
  .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
  .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, label, target) => {
    const name = path.basename(target, '.md');
    if (target.endsWith('.md') && name !== 'LOGIN-DETAILS') return `<a href="#guide-${escape(name)}" data-guide="${escape(name)}">${label}</a>`;
    if (/^https?:\/\//.test(target)) return `<a href="${target}" target="_blank" rel="noreferrer">${label}</a>`;
    return label;
  });

function markdown(text) {
  const lines = text.split(/\r?\n/), output = [];
  for (let i = 0; i < lines.length;) {
    const line = lines[i];
    if (!line.trim()) { i++; continue; }
    if (line.startsWith('```')) {
      const language = line.slice(3); const block = []; i++;
      while (i < lines.length && !lines[i].startsWith('```')) block.push(lines[i++]);
      i++;
      if (language !== 'mermaid') output.push(`<pre><code>${escape(block.join('\n'))}</code></pre>`);
      else output.push('<p>Explore the customer timeline above for the connected handoffs.</p>');
    } else if (/^#{1,3} /.test(line)) {
      const level = Math.min(4, line.match(/^#+/)[0].length + 1);
      output.push(`<h${level}>${inline(line.replace(/^#+ /, ''))}</h${level}>`); i++;
    } else if (line.startsWith('|')) {
      const rows = [];
      while (i < lines.length && lines[i].startsWith('|')) {
        const cells = lines[i++].split('|').slice(1, -1).map(v => v.trim());
        if (!cells.every(v => /^:?-+:?$/.test(v))) rows.push(cells);
      }
      output.push('<div class="table-wrap"><table><thead><tr>' + rows.shift().map(v => `<th>${inline(v)}</th>`).join('') + '</tr></thead><tbody>' + rows.map(row => '<tr>' + row.map(v => `<td>${inline(v)}</td>`).join('') + '</tr>').join('') + '</tbody></table></div>');
    } else if (/^(\d+\. |[-] )/.test(line)) {
      const ordered = /^\d+\./.test(line), tag = ordered ? 'ol' : 'ul', items = [];
      const pattern = ordered ? /^\d+\. / : /^- /;
      while (i < lines.length && pattern.test(lines[i])) items.push(`<li>${inline(lines[i++].replace(pattern, ''))}</li>`);
      output.push(`<${tag}>${items.join('')}</${tag}>`);
    } else {
      const paragraph = [line]; i++;
      while (i < lines.length && lines[i].trim() && !/^(#|\||```|\d+\. |[-] )/.test(lines[i])) paragraph.push(lines[i++]);
      output.push(`<p>${inline(paragraph.join(' '))}</p>`);
    }
  }
  return output.join('\n');
}

const guideNames = [
  ['README', 'All handoffs & checks'],
  ['customer-ananya-terrace', 'Ananya · Terrace'],
  ['customer-meera-bathroom', 'Meera · Bathroom'],
  ['role-homeowner', 'Homeowner'], ['role-applicator', 'Applicator'],
  ['role-dealer', 'Dealer'], ['role-admin', 'Admin'],
  ['role-superadmin', 'Super Admin'], ['role-presenter', 'Presenter']
];
const guides = guideNames.map(([id, title]) => `<article class="guide" id="guide-${id}" ${id === 'README' ? '' : 'hidden'}>${markdown(fs.readFileSync(path.join(source, id + '.md'), 'utf8'))}</article>`).join('\n');
const data = {
  ananya: {name: 'Ananya Rao', type: 'Terrace · ARDEX enquiry', area: '700 sq ft', entry: 'Website enquiry → Sakhaa → assigned visit', system: 'Terrace Shield Plus', guide: 'customer-ananya-terrace', stages: [
    ['Enquiry & permission', ['homeowner', 'presenter'], 'Presenter begins Ananya’s journey. Ananya approves service updates, answers the safety question, chooses a slot and confirms her address.', 'A booked offer with the enquiry’s original context.', 'No consent stops messages. Structural concerns stop booking and create technical follow-up.', 'ENQUIRY → OFFERED'],
    ['Accept & inspect', ['applicator', 'admin'], 'Ravi accepts the visit within 15 demo minutes, checks in, records required diagnosis views and measures the terrace: 600 sq ft floor + 100 sq ft upturn.', 'Saved diagnosis and a 700 sq ft treatment area.', 'Acceptance requires an onboarded, certified Bengaluru profile. Structural diagnosis needs Admin clearance.', 'VISIT_BOOKED → DIAGNOSIS'],
    ['Quote & decision', ['applicator', 'homeowner'], 'Ravi calculates eligible systems and sends a quote. Ananya compares products, packs, labour and stages, then approves her chosen option.', 'Accepted scope, prices and stage requirements are frozen.', 'Decline needs a revised quote. Superseded or expired links cannot approve a new version.', 'QUOTE_SENT → APPROVED']
  ]},
  meera: {name: 'Meera Shah', type: 'Bathroom · Ravi’s own customer', area: '116 sq ft', entry: 'Existing customer → Ravi’s My Lead → site visit', system: 'Bath Seal Plus', guide: 'customer-meera-bathroom', stages: [
    ['Add an existing customer', ['applicator', 'presenter'], 'In an empty bathroom workspace, Ravi adds Meera’s name, phone and site address and attests permission for service contact. Presenter’s Booked visit checkpoint seeds this step.', 'A My Lead job retaining Ravi’s customer attribution.', 'Service consent and valid details are required. Selecting Bathroom alone does not load a workspace; Presenter must click Show journey.', 'MY LEAD → VISIT_BOOKED'],
    ['Inspect & measure', ['applicator', 'admin'], 'Ravi checks in and records bathroom diagnosis. The fixture measures 48 sq ft floor + 28 sq ft upturn + 40 sq ft additional shower wall.', 'Saved diagnosis and a 116 sq ft treatment area.', 'Tiles must be removed before calculation. Structural flags require technical clearance; a generic override cannot clear preparation.', 'VISIT_BOOKED → DIAGNOSIS'],
    ['Quote & decision', ['applicator', 'homeowner'], 'Ravi calculates eligible bathroom systems and sends the itemised quote. Meera compares options and approves the selected scope.', 'Chosen package, price, quantities and stages are frozen.', 'No website booking or ARDEX offer timer is needed. A declined quote must be revised before approval.', 'QUOTE_SENT → APPROVED']
  ]}
};
const shared = [
  ['Prepare the approved kit', ['applicator', 'dealer', 'admin'], 'Ravi sends the approved kit list to Akshaya. The dealer checks every product and pack line, then marks the kit ready. Invoice declaration is optional and separately reconciled by Admin.', 'Readiness is recorded and a START code is generated.', 'An open material shortage must be resolved by Admin before readiness. Readiness is not delivery or payment.', 'APPROVED → KIT_READY'],
  ['Confirm permission to start', ['homeowner', 'applicator'], 'The homeowner reads the generated START code in their conversation and shares it when ready. Ravi enters it and confirms the job start.', 'Verified homeowner permission to begin work.', 'Codes are bound to job and purpose and expire after 30 demo minutes. The onboarding code is a different code.', 'KIT_READY → IN_PROGRESS'],
  ['Verify products & correct exceptions', ['applicator', 'dealer', 'admin'], 'Ravi scans required registered packs on site. For a rejected pack he requests a replacement; the dealer reserves an exact matching serial, Ravi scans it, and Admin documents and clears the correction.', 'Credited product quantities and an auditable correction trail.', 'Rejected packs earn no quantity credit. A requested replacement must match the exact supplied serial. The guided Ananya story deliberately demonstrates a wrong product.', 'IN_PROGRESS'],
  ['Capture work & review evidence', ['applicator', 'admin', 'presenter'], 'Ravi records every required stage photo in order after curing gaps, including visible challenge codes and the paired flood/ponding test. Admin records pass/fail decisions for current images.', 'Reviewed stage evidence against the frozen package template.', 'Failed evidence needs redo from the selected stage onward. The flood-test pair needs at least 24 hours and a passing assessment. Reference imagery stays labelled sample.', 'IN_PROGRESS → REVIEW / HANDOVER'],
  ['Request closing confirmation', ['homeowner', 'applicator', 'admin'], 'After the first five proof checks and START pass, Ravi requests CLOSE. The homeowner shares the current code only if satisfied; Ravi verifies handover.', 'Both homeowner confirmations are recorded.', 'A concern during started, unissued work pauses handover and clears CLOSE. Admin must resolve it before a fresh confirmation.', 'HANDOVER'],
  ['Issue the Water Passport', ['admin', 'homeowner'], 'Admin reruns all six checks and issues the completion record. The homeowner can download the PDF or open its public verification link.', 'Completed job with an issuance Proof ID and verification token.', 'All six checks must pass. Issued evidence cannot be rewritten; voiding is a separate audited decision. This is a demo record without active commercial warranty.', 'HANDOVER → COMPLETED'],
  ['Payment, feedback & care', ['homeowner', 'applicator', 'admin'], 'The homeowner reports paid or pending; Ravi confirms direct receipt after a paid acknowledgement. The homeowner rates once, chooses a care preference and can share the enquiry website.', 'Payment acknowledgements, feedback and care preference remain linked to the job.', 'A rating below four opens operations follow-up. Payments are not provider-verified; care preferences do not schedule messages.', 'COMPLETED → AFTERCARE']
];
for (const value of Object.values(data)) value.stages.push(...shared);
const serialized = JSON.stringify(data).replaceAll('<', '\\u003c');
const output = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="color-scheme" content="light"><title>ARDEX PRO · Application user flows</title>
<style>
:root{--ink:#172b39;--muted:#61717d;--line:#dce3e7;--paper:#f6f7f8;--blue:#064b7b;--accent:#d4f277;--homeowner:#7555a7;--applicator:#126985;--dealer:#9a651e;--admin:#31684c;--presenter:#80586d;--superadmin:#4859a4}*{box-sizing:border-box}body{margin:0;background:var(--paper);color:var(--ink);font:15px/1.65 'Segoe UI',Arial,sans-serif}button,input,select{font:inherit}button,a,select{touch-action:manipulation}button{cursor:pointer}button:focus-visible,a:focus-visible,select:focus-visible,input:focus-visible{outline:3px solid #c57c14;outline-offset:3px}[hidden]{display:none!important}a{color:var(--blue);text-underline-offset:3px}.shell{max-width:1320px;margin:auto;padding:0 40px}.top{border-bottom:1px solid var(--line);background:white}.top .shell{display:flex;align-items:center;justify-content:space-between;min-height:76px;gap:20px}.brand{font-size:21px;font-weight:850;letter-spacing:-.7px}.brand span{color:var(--blue);border-left:1px solid var(--line);margin-left:12px;padding-left:12px;font-weight:600}.top nav{display:flex;gap:24px;font-size:13px}.top a{color:var(--muted);text-decoration:none}.print{border:1px solid var(--line);background:white;padding:7px 15px;border-radius:6px}.hero{padding:54px 0 32px;display:grid;grid-template-columns:1fr 280px;gap:40px;align-items:end}.eyebrow{text-transform:uppercase;font-size:11px;letter-spacing:2px;font-weight:750;color:var(--blue);margin:0 0 12px}h1{font-size:clamp(35px,4.5vw,58px);line-height:1.1;letter-spacing:-2px;margin:0 0 18px;max-width:760px}h1 em{font-style:normal;color:var(--blue)}.intro{max-width:680px;font-size:16px;color:var(--muted);margin:0}.hero-note{border-left:3px solid var(--accent);padding:3px 0 3px 18px;font-size:13px;color:var(--muted)}.hero-note b{display:block;color:var(--ink);font-size:15px;margin-bottom:5px}.stats{display:flex;gap:28px;margin-top:25px;font-size:12px;color:var(--muted)}.stats b{font-size:21px;color:var(--ink);margin-right:5px}.section{scroll-margin-top:24px;margin-bottom:44px}.section-heading{display:flex;justify-content:space-between;align-items:center;margin-bottom:18px;gap:20px}h2{font-size:24px;letter-spacing:-.6px;margin:0}h3{line-height:1.35}.section-heading p{margin:0;font-size:13px;color:var(--muted)}.customers{display:grid;grid-template-columns:1fr 1fr;gap:14px}.customer{border:1px solid var(--line);text-align:left;background:white;border-radius:10px;padding:22px 24px;display:flex;gap:17px;align-items:center;color:var(--ink)}.customer[aria-pressed="true"]{border:2px solid var(--blue);padding:21px 23px;background:#eef5f9}.avatar{height:44px;width:44px;display:grid;place-items:center;border-radius:50%;background:#e9edf0;font-size:15px;font-weight:750;flex-shrink:0}.customer[aria-pressed="true"] .avatar{background:var(--blue);color:white}.customer strong{display:block;font-size:18px}.customer small{display:block;color:var(--muted);font-size:12px}.customer .select-mark{margin-left:auto;font-size:20px;color:var(--blue)}.workspace{margin-top:20px;display:grid;grid-template-columns:245px 1fr;gap:26px;align-items:start}.filters{position:sticky;top:20px;background:white;border:1px solid var(--line);border-radius:10px;padding:22px}.filters h3{font-size:13px;margin:0 0 12px}.role-filters{display:flex;flex-direction:column;gap:6px}.role-filter{border:0;text-align:left;background:transparent;border-radius:6px;padding:9px 10px;display:flex;gap:10px;align-items:center;color:var(--muted);font-size:13px}.role-filter[aria-pressed="true"]{background:#edf3f7;color:var(--blue);font-weight:700}.dot{height:8px;width:8px;border-radius:50%;background:var(--role,var(--blue));display:inline-block;flex-shrink:0}.filter-note{font-size:12px;color:var(--muted);border-top:1px solid var(--line);padding-top:16px;margin:18px 0 0}.journey-summary{display:flex;flex-wrap:wrap;gap:6px 18px;margin:0 0 20px;font-size:13px;color:var(--muted)}.journey-summary b{color:var(--ink)}.timeline{padding-left:23px;border-left:1px solid #c9d7e0;margin-left:14px}.step{position:relative;margin:0 0 12px;background:white;border:1px solid var(--line);border-radius:9px}.step:before{content:attr(data-step);position:absolute;left:-39px;top:19px;background:var(--paper);border:1px solid #c9d7e0;border-radius:50%;height:29px;width:29px;text-align:center;line-height:27px;font-size:11px;color:var(--blue);font-weight:700}.step summary{padding:18px 21px;cursor:pointer;display:flex;align-items:center;justify-content:space-between;gap:16px;list-style:none}.step summary::-webkit-details-marker{display:none}.step summary:after{content:'+';font-size:24px;color:var(--muted);font-weight:300}.step[open] summary:after{content:'−'}.step summary h3{margin:0 0 5px;font-size:16px}.badges{display:flex;flex-wrap:wrap;gap:5px}.badge{font-size:10px;line-height:1.5;padding:2px 7px;background:#f1f4f6;border-radius:4px;color:var(--role)}.step-body{padding:0 21px 20px}.step-body p{margin:0 0 14px;font-size:14px}.fact{display:grid;grid-template-columns:85px 1fr;gap:10px;font-size:12px;margin-bottom:9px}.fact strong{color:var(--muted);font-weight:600}.fact.blocker{background:#fff9ee;padding:10px 12px;border-radius:5px;margin-top:12px}.state{font:10px/1.6 Consolas,monospace;color:var(--blue);letter-spacing:.4px;display:block;margin-top:15px}.timeline-tools{display:flex;gap:9px;flex-wrap:wrap;align-items:center;margin-bottom:16px}.small-button{background:white;border:1px solid var(--line);border-radius:5px;padding:5px 11px;font-size:12px;color:var(--ink)}#step-count{margin-left:auto;font-size:12px;color:var(--muted)}.empty{background:white;border:1px dashed var(--line);border-radius:9px;padding:28px}.empty h3{margin-top:0}.gate-panel{background:var(--ink);color:white;padding:30px;border-radius:12px}.gate-panel .eyebrow{color:var(--accent)}.gate-panel h2{margin-bottom:9px}.gate-panel>p{color:#c2cfd7;font-size:14px;margin-top:0}.gates{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-top:22px}.gate{border:1px solid #40515e;border-radius:7px;padding:17px}.gate b{display:block;font-size:14px;margin-bottom:6px}.gate span{display:block;color:#c2cfd7;font-size:12px}.gate small{color:var(--accent);font-size:11px;display:block;margin-bottom:5px}.gate-foot{margin:20px 0 0!important;color:#e4edda!important}.reader{background:white;border:1px solid var(--line);border-radius:10px;overflow:hidden}.reader-controls{padding:18px 24px;border-bottom:1px solid var(--line);display:flex;gap:14px;align-items:center;flex-wrap:wrap;background:#fafbfc}.reader-controls label{font-size:12px;font-weight:700}.reader-controls select{padding:8px 12px;border:1px solid #bac8d1;border-radius:5px;background:white;max-width:100%}.guide{padding:14px 32px 30px;max-width:1000px;margin:auto}.guide h2{margin:20px 0}.guide h3{font-size:19px;margin-top:30px}.guide p,.guide li{font-size:14px}.guide li{margin:8px 0}.guide code{font-size:12px;background:#eef2f5;padding:2px 5px;border-radius:3px;overflow-wrap:anywhere}.guide pre{overflow:auto;background:#f1f4f6;padding:15px}.table-wrap{overflow-x:auto}table{border-collapse:collapse;width:100%;font-size:12px;margin:16px 0}th,td{padding:10px;border:1px solid var(--line);text-align:left;vertical-align:top}th{background:#f2f5f7}footer{padding:25px 0 34px;border-top:1px solid var(--line);font-size:12px;color:var(--muted)}footer p{max-width:920px;margin:5px 0}.subtle{color:var(--muted)}@media(max-width:800px){.shell{padding:0 22px}.hero{grid-template-columns:1fr;gap:24px;padding-top:35px}.hero-note{max-width:500px}.workspace{grid-template-columns:1fr;gap:18px}.filters{position:static;padding:16px}.role-filters{flex-direction:row;flex-wrap:wrap}.filter-note{margin-top:12px;padding-top:10px}.gates{grid-template-columns:1fr 1fr}.section-heading{align-items:start;flex-direction:column;gap:3px}.top nav{gap:13px}.top nav a{display:none}.guide{padding:12px 20px 25px}}@media(max-width:500px){.shell{padding:0 15px}h1{letter-spacing:-1.2px}.customers{grid-template-columns:1fr}.customer{padding:16px}.customer[aria-pressed="true"]{padding:15px}.stats{gap:15px}.gates{grid-template-columns:1fr}.gate-panel{padding:23px}.step summary{padding:15px}.step-body{padding:0 15px 15px}.fact{grid-template-columns:1fr;gap:3px}.reader-controls{padding:15px}.top .shell{min-height:65px}.brand{font-size:18px}.brand span{margin-left:8px;padding-left:8px}}@media print{body{background:white;font-size:11px}.shell{max-width:none;padding:0}.top nav,.filters,.timeline-tools,.reader-controls,.customers,.print{display:none!important}.hero{padding:20px 0;grid-template-columns:1fr}.hero-note{display:none}h1{font-size:30px}.workspace{display:block}.step{break-inside:avoid}.step-body{display:block!important}.step summary:after{display:none}.gates{grid-template-columns:repeat(3,1fr)}.gate-panel{background:white;color:var(--ink);border:1px solid #aaa}.gate-panel p,.gate span,.gate small,.gate-foot{color:var(--ink)!important}.gate{border-color:#aaa}.reader{border:0}.guide{padding:0}.section{margin-bottom:25px}a{color:inherit}footer{margin-top:20px}}
</style></head><body>
<header class="top"><div class="shell"><div class="brand">ARDEX ENDURA<span>PRO</span></div><nav aria-label="Page sections"><a href="#journeys">Journeys</a><a href="#checks">Approval checks</a><a href="#guides">Full guides</a><button class="print" id="print">Print / Save PDF</button></nav></div></header>
<main class="shell"><section class="hero"><div><p class="eyebrow">Application flow guide · October 2026</p><h1>Every customer.<br><em>Every handoff.</em></h1><p class="intro">Follow a job from the first enquiry to its completion record. See who acts, what happens next, and what can pause the journey.</p><div class="stats"><span><b>2</b> customer journeys</span><span><b>6</b> roles</span><span><b>6</b> approval checks</span></div></div><aside class="hero-note"><b>One job. A shared record.</b>The homeowner, applicator, dealer and reviewer move the same record forward, each with their own permissions.</aside></section>
<section class="section" id="journeys"><div class="section-heading"><h2>Choose a customer journey</h2><p>Open any step to see the action, result and blocker.</p></div><div class="customers" aria-label="Customer journey"><button class="customer" data-customer="ananya" aria-pressed="true"><span class="avatar">AR</span><span><strong>Ananya Rao</strong><small>Terrace · ARDEX-sourced enquiry · 700 sq ft</small></span><span class="select-mark" aria-hidden="true">↗</span></button><button class="customer" data-customer="meera" aria-pressed="false"><span class="avatar">MS</span><span><strong>Meera Shah</strong><small>Bathroom · Ravi’s own customer · 116 sq ft</small></span><span class="select-mark" aria-hidden="true">↗</span></button></div>
<div class="workspace"><aside class="filters"><h3>View responsibilities</h3><div class="role-filters" id="roles"></div><p class="filter-note">Filtering keeps the original step numbers so you can see where a role joins the wider journey.</p></aside><div><p class="journey-summary" id="journey-summary"></p><div class="timeline-tools"><button class="small-button" id="expand">Expand all steps</button><button class="small-button" id="collapse">Collapse all</button><button class="small-button" id="read-customer">Read full customer guide ↗</button><span id="step-count" role="status" aria-live="polite"></span></div><div class="timeline" id="timeline"></div></div></div></section>
<section class="section gate-panel" id="checks"><p class="eyebrow">Before a completion record can be issued</p><h2>Six checks. One accountable handover.</h2><p>Admin reviews the proof; the homeowner confirms both the start and the handover.</p><div class="gates">
<div class="gate"><small>01 / PRODUCT AUTHENTICITY</small><b>Genuine, unused packs</b><span>Credited registry packs, with no unresolved rejected or provisional scan.</span></div>
<div class="gate"><small>02 / SYSTEM MATCH</small><b>The approved products</b><span>Every frozen bill-of-materials SKU and unit appears in credited scans.</span></div>
<div class="gate"><small>03 / QUANTITY</small><b>Sufficient recorded supply</b><span>Each line meets frozen tolerance and necessary whole-pack rounding limits.</span></div>
<div class="gate"><small>04 / SITE</small><b>Evidence at the location</b><span>At least 90% conservatively within 150 m; no distant or inaccurate evidence.</span></div>
<div class="gate"><small>05 / WORK QUALITY</small><b>Ordered and reviewed stages</b><span>All required shots, curing gaps, visible codes and paired 24-hour flood test pass human review.</span></div>
<div class="gate"><small>06 / HOMEOWNER</small><b>Permission at both ends</b><span>START and CLOSE codes verified, with no active handover hold.</span></div>
</div><p class="gate-foot">CLOSE can be requested after checks 1–5 and START pass. Issuance requires all six.</p></section>
<section class="section" id="guides"><div class="section-heading"><h2>The complete walkthroughs</h2><p>Full source-based detail for both customers and every role.</p></div><div class="reader"><div class="reader-controls"><label for="guide-select">Read a guide</label><select id="guide-select">${guideNames.map(([id, title]) => `<option value="${id}">${title}</option>`).join('')}</select><span class="subtle" style="font-size:12px">Embedded for offline reading</span></div>${guides}</div></section>
</main><footer><div class="shell"><p><strong>Current prototype boundaries:</strong> WhatsApp is simulated. Conversation copy is scripted. Product serials and reference images are samples. Payments have no provider verification, and care preferences do not schedule messages. The Water Passport is a demo completion record without active commercial warranty.</p><p>Based on the repository’s current user-flow guides · Reviewed 8 October 2026 · This file works offline and does not submit actions or modify application records.</p></div></footer>
<noscript><div class="shell"><p>Enable JavaScript to switch customers and filter the timeline. All complete guides are shown below.</p></div><style>.guide[hidden]{display:block!important}#timeline:after{content:'The interactive timeline requires JavaScript. Read the complete guides below.'}</style></noscript>
<script>
const journeys = ${serialized};
const roles = {all:'All participants', homeowner:'Homeowner',applicator:'Applicator · Ravi',dealer:'Dealer · Akshaya',admin:'Admin · Reviewer',superadmin:'Super Admin',presenter:'Presenter'};
let currentCustomer = 'ananya', currentRole = 'all';
const safe = value => String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const badges = ids => ids.map(id => '<span class="badge" style="--role:var(--'+id+')">'+safe(roles[id].split(' · ')[0])+'</span>').join('');
document.querySelector('#roles').innerHTML = Object.entries(roles).map(([id,label])=>'<button class="role-filter" data-role="'+id+'" aria-pressed="'+(id==='all')+'"><span class="dot" style="--role:var(--'+id+',var(--blue))"></span>'+label+'</button>').join('');
function render(){
  const journey=journeys[currentCustomer];
  document.querySelectorAll('[data-customer]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.customer===currentCustomer)));
  document.querySelectorAll('[data-role]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.role===currentRole)));
  document.querySelector('#journey-summary').innerHTML='<b>'+safe(journey.name)+'</b><span>'+safe(journey.entry)+'</span><span>'+safe(journey.area)+' treated</span>';
  const steps=journey.stages.map((step,index)=>({step,index})).filter(({step})=>currentRole==='all'||step[1].includes(currentRole));
  document.querySelector('#step-count').textContent=steps.length+' of '+journey.stages.length+' steps';
  document.querySelector('#timeline').innerHTML=steps.length?steps.map(({step,index},position)=>'<details class="step" data-step="'+String(index+1).padStart(2,'0')+'" '+(position===0?'open':'')+'><summary><div><h3>'+safe(step[0])+'</h3><div class="badges">'+badges(step[1])+'</div></div></summary><div class="step-body"><p>'+safe(step[2])+'</p><div class="fact"><strong>Result</strong><span>'+safe(step[3])+'</span></div><div class="fact blocker"><strong>Watch for</strong><span>'+safe(step[4])+'</span></div><span class="state">'+safe(step[5])+'</span></div></details>').join(''):'<div class="empty"><h3>System oversight, across both journeys.</h3><p>Super Admin uses the Admin review flow and manages pack pricing, account access, routing previews and proposed pilot settings.</p><button class="small-button" data-guide="role-superadmin">Read the Super Admin flow ↗</button></div>';
}
function showGuide(id,scroll=true){
  if(!document.getElementById('guide-'+id))return;
  document.querySelectorAll('.guide').forEach(guide=>guide.hidden=guide.id!=='guide-'+id);
  document.querySelector('#guide-select').value=id;
  if(scroll){history.replaceState(null,'','#guide-'+id);document.querySelector('#guides').scrollIntoView({behavior:'smooth'});}
}
document.addEventListener('click',event=>{
  const customer=event.target.closest('[data-customer]'),role=event.target.closest('[data-role]'),guide=event.target.closest('[data-guide]');
  if(customer){currentCustomer=customer.dataset.customer;render();}
  if(role){currentRole=role.dataset.role;render();}
  if(guide){event.preventDefault();showGuide(guide.dataset.guide);}
});
document.querySelector('#guide-select').addEventListener('change',event=>showGuide(event.target.value,false));
document.querySelector('#read-customer').addEventListener('click',()=>showGuide(journeys[currentCustomer].guide));
document.querySelector('#expand').addEventListener('click',()=>document.querySelectorAll('.step').forEach(step=>step.open=true));
document.querySelector('#collapse').addEventListener('click',()=>document.querySelectorAll('.step').forEach(step=>step.open=false));
let beforePrint=[];
window.addEventListener('beforeprint',()=>{beforePrint=[...document.querySelectorAll('.step')].map(step=>step.open);document.querySelectorAll('.step').forEach(step=>step.open=true);});
window.addEventListener('afterprint',()=>document.querySelectorAll('.step').forEach((step,index)=>step.open=beforePrint[index]));
document.querySelector('#print').addEventListener('click',()=>window.print());
render();
if(location.hash.startsWith('#guide-'))showGuide(location.hash.slice(7),false);
</script></body></html>`;

fs.writeFileSync(path.join(root, 'public/userflow.html'), output, 'utf8');
console.log(`Created public/userflow.html (${Buffer.byteLength(output).toLocaleString()} bytes; ${guideNames.length} embedded guides).`);
