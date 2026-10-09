import { lazy, Suspense, useState } from 'react';
const AnalyticsDashboard = lazy(() =>
  import('./analytics/AnalyticsDashboard').then((module) => ({
    default: module.AnalyticsDashboard,
  })),
);

import { CommandIntelligence } from './CommandIntelligence';

export function AnalyticsIntelligence({
  work,
  onOpen,
}: {
  work: any[];
  onOpen: (id: string) => void;
}) {
  const [tab, setTab] = useState<'analytics' | 'intelligence'>('analytics');
  return (
    <section aria-label="Analytics and intelligence">
      <div
        className="analytics-subtabs"
        role="tablist"
        aria-label="Analytics and Intelligence subsections"
      >
        {(['analytics', 'intelligence'] as const).map((value) => (
          <button
            key={value}
            id={`${value}-tab`}
            role="tab"
            aria-selected={tab === value}
            aria-controls={`${value}-panel`}
            tabIndex={tab === value ? 0 : -1}
            onClick={() => setTab(value)}
            onKeyDown={(event) => {
              if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
              event.preventDefault();
              const next =
                event.key === 'Home'
                  ? 'analytics'
                  : event.key === 'End'
                    ? 'intelligence'
                    : value === 'analytics'
                      ? 'intelligence'
                      : 'analytics';
              setTab(next);
              document.getElementById(`${next}-tab`)?.focus();
            }}
          >
            {value === 'analytics' ? 'Analytics' : 'Intelligence'}
          </button>
        ))}
      </div>
      <div
        id="analytics-panel"
        role="tabpanel"
        aria-labelledby="analytics-tab"
        hidden={tab !== 'analytics'}
      >
        <Suspense fallback={<p role="status">Loading business analytics…</p>}>
          <AnalyticsDashboard work={work} />
        </Suspense>
      </div>
      <div
        id="intelligence-panel"
        role="tabpanel"
        aria-labelledby="intelligence-tab"
        hidden={tab !== 'intelligence'}
      >
        <CommandIntelligence />
      </div>
    </section>
  );
}
