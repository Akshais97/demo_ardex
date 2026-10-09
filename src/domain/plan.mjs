import { randomUUID } from 'node:crypto';
import { requireRule } from './authority.mjs';
import { diagnose, measure } from './diagnosis.mjs';
import { calculatePackage, selectPackages } from './calculator.mjs';

export const planHandlers = {
  CALCULATE_PLAN(s, payload, actor) {
    requireRule(actor === 'applicator' && s.profile.loggedIn && s.job?.applicatorId === s.profile.id, 'NOT_ASSIGNED', 'The signed-in assigned applicator owns package selection.');
    requireRule(s.job.status === 'DIAGNOSIS' && s.job.diagnosis, 'STATE_BLOCK', 'Confirm site diagnosis before calculation.');
    const stored = s.job.diagnosis;
    // Recompute from accepted answers/measurements; never trust submitted totals or the AI triage.
    const diagnosis = { ...stored, analysis: diagnose(s.catalog, s.job.areaType, stored.answers), area: measure(stored.measurement, s.job.areaType) };
    const selection = selectPackages(s.catalog, s.job.areaType, diagnosis, s.job.structuralClearance);
    const selectedPackageCode = payload.packageCode ?? selection.recommendedCode;
    requireRule(selection.options.some(option => option.code === selectedPackageCode), 'PACKAGE_EXCLUDED', 'This package is not allowed by the matched site rule.');
    const priorContent = s.job.plan?.content;
    const preserveRates = priorContent?.diagnosisId === diagnosis.id && priorContent?.catalogVersion === s.catalog._meta.version;
    const options = selection.options.map(option => {
      const previousRate = preserveRates ? priorContent.options.find(previous => previous.packageCode === option.code)?.labour.ratePaise : undefined;
      const rate = option.code === selectedPackageCode && payload.labourRatePaise !== undefined ? payload.labourRatePaise : previousRate;
      return { ...calculatePackage(s.catalog, option.code, diagnosis, s.profile.city, rate), offeredTier: option.tier, recommended: option.code === selection.recommendedCode };
    });
    const content = { diagnosisId: diagnosis.id, diagnosisVersion: diagnosis.version, catalogVersion: s.catalog._meta.version,
      selection, selectedPackageCode, options, status: 'CALCULATED_DRAFT', illustrative: true };
    const prior = s.job.plan;
    if (prior && JSON.stringify(content) === JSON.stringify(prior.content)) return;
    s.job.plan = { id: prior?.id ?? randomUUID(), jobId: s.job.id, version: (prior?.version ?? 0) + 1,
      calculatedAt: s.clock.now, content };
  }
};
