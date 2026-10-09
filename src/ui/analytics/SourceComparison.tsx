import { useState } from 'react';
import { ChevronDown, GitCompareArrows } from 'lucide-react';
import { money, percent, sum, type Opportunity } from './data';

export function SourceComparison({ rows, sample }: { rows: Opportunity[]; sample: boolean }) {
  const sources = [...new Set(rows.map((r) => r.source))].sort();
  const [left, setLeft] = useState('Website / campaigns'),
    [right, setRight] = useState('Dealer referral');
  const a = sources.includes(left) ? left : sources[0],
    b = sources.includes(right) && right !== a ? right : sources.find((s) => s !== a);
  const stats = (source: string) => {
    const items = rows.filter((r) => r.source === source),
      won = items.filter((r) => r.approved).length;
    return { items, won, value: sum(items, 'approved'), spend: sum(items, 'acquisitionCost') };
  };
  return (
    <details className="an-source-compare">
      <summary>
        <GitCompareArrows size={14} />
        <span>Compare two acquisition sources</span>
        <ChevronDown size={14} />
      </summary>
      <div className="an-source-compare-body">
        <p>
          Same acquisition window and locality. This comparison includes all sources, independent of
          the dashboard source filter.
        </p>
        {sources.length < 2 ? (
          <p>At least two sources are needed for comparison.</p>
        ) : (
          <>
            <div className="an-source-compare-selects">
              <select
                aria-label="First source to compare"
                value={a}
                onChange={(e) => setLeft(e.target.value)}
              >
                {sources
                  .filter((s) => s !== b)
                  .map((s) => (
                    <option key={s}>{s}</option>
                  ))}
              </select>
              <span>vs</span>
              <select
                aria-label="Second source to compare"
                value={b}
                onChange={(e) => setRight(e.target.value)}
              >
                {sources
                  .filter((s) => s !== a)
                  .map((s) => (
                    <option key={s}>{s}</option>
                  ))}
              </select>
            </div>
            <div className="an-table-scroll">
              <table className="an-table">
                <thead>
                  <tr>
                    <th>Measure</th>
                    <th>{a}</th>
                    <th>{b}</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    'Leads',
                    'Approved jobs',
                    'Approval rate',
                    'Approved scope',
                    'Acquisition spend',
                    'Cost / approval',
                  ].map((label, i) => (
                    <tr key={label}>
                      <td>{label}</td>
                      {[a, b!].map((source) => {
                        const s = stats(source);
                        return (
                          <td key={source}>
                            {i === 0
                              ? s.items.length
                              : i === 1
                                ? s.won
                                : i === 2
                                  ? sample
                                    ? `${percent(s.won, s.items.length)} (${s.won}/${s.items.length})`
                                    : 'Unavailable'
                                  : i === 3
                                    ? money(s.value)
                                    : !sample
                                      ? 'Unavailable'
                                      : i === 4
                                        ? money(s.spend)
                                        : s.won
                                          ? money(s.spend / s.won)
                                          : 'N/A'}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </details>
  );
}
