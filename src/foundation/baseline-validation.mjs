const statuses = new Set(['Planned', 'Simulated', 'Browser live', 'Service live', 'Deferred']);
const modes = new Set(['working-domain', 'simulated', 'browser-live', 'shared-service', 'deferred']);

export function validateBaseline(baseline) {
  const issues = [];
  const fail = (code, id, message) => issues.push({ code, id, message });
  if (baseline.drop !== 'P1-D01' || baseline.environment !== 'demo') {
    fail('BASELINE_CONTEXT', 'baseline', 'The reviewed baseline must identify P1-D01 and the demo environment.');
  }
  const sources = new Map();
  for (const source of baseline.sources ?? []) {
    if (sources.has(source.id)) fail('DUPLICATE_SOURCE', source.id, 'Source identity must be unique.');
    sources.set(source.id, source);
    if (!source.path || !source.authority) fail('INCOMPLETE_SOURCE', source.id, 'Source needs a path and authority.');
  }
  const ids = new Set();
  const capabilityMap = new Map();
  for (const capability of baseline.capabilities ?? []) {
    const { id, status, demoMode, sourceRefs, owner, consumer, drop } = capability;
    if (ids.has(id)) fail('DUPLICATE_CAPABILITY', id, 'Capability identity must be unique.');
    ids.add(id);
    capabilityMap.set(id, capability);
    if (!statuses.has(status) || !modes.has(demoMode)) fail('CAPABILITY_LABEL', id, 'Unknown delivery status or planned mode.');
    if (!owner || !consumer || !/^P[123]-D0[1-8]$/.test(drop ?? '')) {
      fail('INCOMPLETE_HANDOFF', id, 'Capability needs an owner, a consumer, and a delivery drop.');
    }
    if (!Array.isArray(sourceRefs) || !sourceRefs.length) fail('MISSING_SOURCE', id, 'Capability needs at least one source.');
    for (const ref of sourceRefs ?? []) {
      if (!sources.has(ref.id) || !ref.locator) fail('UNKNOWN_SOURCE', id, 'Each source reference must resolve and name a section or requirement.');
    }
    if (status !== 'Planned' && status !== 'Deferred' && !capability.evidence) {
      fail('UNSUPPORTED_IMPLEMENTATION_CLAIM', id, 'An implemented capability label requires review evidence.');
    }
    if (demoMode === 'deferred' && status !== 'Deferred') fail('DEFERRED_LABEL', id, 'Deferred delivery must be labelled Deferred.');
  }
  for (const id of ['homeowner-messaging', 'job-otp']) {
    const c = capabilityMap.get(id);
    if (!c || c.demoMode !== 'simulated' || !c.label?.includes('Simulated') || !c.productionReplacement?.includes('Sakhaa')) {
      fail('MESSAGING_BOUNDARY', id, 'Simulated messaging must retain its visible label and future Sakhaa replacement.');
    }
  }
  for (const id of ['quote', 'water-passport']) {
    if (!capabilityMap.get(id)?.exportMark?.includes('DEMO')) {
      fail('EXPORT_MARK', id, 'Illustrative exports must retain a DEMO mark.');
    }
  }
  const owners = Object.fromEntries((baseline.handoffs ?? []).map(x => [x.stage, x.owner]));
  for (const [stage, expected] of Object.entries({ demand: 'CHLEAR', nurture: 'Sakhaa', close: 'ARDEX PRO', review: 'Ardex' })) {
    if (owners[stage] !== expected) fail('OWNER_BOUNDARY', stage, `The ${stage} owner must remain ${expected}.`);
  }
  for (const p of baseline.placeholders ?? []) {
    if (!p.owner || !p.replacementEvidence || p.clientApproved !== false) {
      fail('PLACEHOLDER_APPROVAL', p.id, 'Illustrative assumptions need an owner, replacement evidence, and no claimed client approval.');
    }
  }
  if (!baseline.placeholders?.length) fail('MISSING_PLACEHOLDERS', 'baseline', 'Illustrative technical and commercial values must be tracked.');
  for (const change of baseline.amendments ?? []) {
    if (!sources.has(change.sourceId) || !change.original || !change.resolution || !change.affectedDrops?.length) {
      fail('UNRESOLVED_CONFLICT', change.id, 'An amendment needs its original source, resolution, and affected drops.');
    }
  }
  for (const moment of baseline.priorities ?? []) {
    if (!capabilityMap.has(moment.capability)) fail('PRIORITY_REFERENCE', moment.id, 'Pitch priority must reference a scoped capability.');
  }
  return issues;
}
