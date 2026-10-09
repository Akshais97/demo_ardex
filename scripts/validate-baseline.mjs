import { readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { validateBaseline } from '../src/foundation/baseline-validation.mjs';

const project = fileURLToPath(new URL('..', import.meta.url));
const workspace = resolve(project, '../..');
const readJSON = async path => JSON.parse(await readFile(resolve(project, path), 'utf8'));
const baseline = await readJSON('config/product-baseline.json');
const sourceBaseline = await readJSON('config/source-baseline.json');
const issues = validateBaseline(baseline);
for (const source of sourceBaseline.files) {
  try {
    const bytes = await readFile(resolve(workspace, source.path));
    const hash = createHash('sha256').update(bytes).digest('hex');
    if (hash !== source.sha256) issues.push({ code: 'SOURCE_CHANGED', id: source.path, message: 'Source changed since the reviewed baseline; reconcile before implementation.' });
  } catch (error) {
    issues.push({ code: 'SOURCE_UNAVAILABLE', id: source.path, message: error.code ?? 'Unreadable source' });
  }
}
const report = {
  drop: baseline.drop,
  reviewedOn: baseline.reviewedOn,
  evaluatedAt: new Date().toISOString(),
  scope: 'Source, ownership, capability, placeholder, and amendment integrity; no application UI or integration verification.',
  passed: issues.length === 0,
  sourcesChecked: sourceBaseline.files.length,
  capabilitiesChecked: baseline.capabilities.length,
  amendmentsChecked: baseline.amendments.length,
  issues,
};
await writeFile(resolve(project, 'evidence/baseline-validation.json'), JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify(report, null, 2));
if (!report.passed) process.exitCode = 1;
