'use client';

import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(r => r.json());

interface EnergyRow {
  rank: number;
  code: string;
  country: string;
  days: number;
  delta: number;
  avgDays: number;
}

export default function EnergyComplex() {
  const { data, isLoading } = useSWR('/api/finance/energy', fetcher, { refreshInterval: 300000 });
  const rows: EnergyRow[] = data?.rows ?? [];
  const source: string = data?.source ?? 'static';

  const sourceLabel = source === 'gie_agsi'
    ? 'Source: GIE AGSI+ / IEA / Market quotes'
    : 'Source: EIA + GIE AGSI+ + IEA';

  if (isLoading && !data) {
    return (
      <div className="border border-white/[0.08] bg-[#0f0f14] animate-pulse h-full">
        <div className="px-3 py-2 border-b border-white/[0.08]">
          <div className="h-3 bg-white/10 rounded w-1/2" />
        </div>
        <div className="p-2 space-y-2">
          {[1,2,3,4,5].map(i => <div key={i} className="h-6 bg-white/5 rounded" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="border border-white/[0.08] bg-[#0f0f14] h-full flex flex-col">
      <div className="px-3 py-2 border-b border-white/[0.08] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-1 h-3 bg-amber-500 rounded-full" />
          <span className="text-[10px] font-mono font-bold text-white/80 tracking-wider">ENERGY COMPLEX</span>
        </div>
        <span className="text-[8px] font-mono text-white/40">{sourceLabel}</span>
      </div>
      <div className="px-3 py-1 border-b border-white/[0.06] flex items-center justify-between shrink-0">
        <span className="text-[9px] font-mono text-white/50">Europe avg 167d / min 96d</span>
        <span className="text-[9px] font-mono text-white/50">{sourceLabel}</span>
      </div>
      <div className="overflow-x-auto overflow-y-auto flex-1 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10">
        <table className="w-full text-[9px] font-mono">
          <thead className="sticky top-0 bg-[#0f0f14] z-10">
            <tr className="text-white/40 border-b border-white/[0.06]">
              <th className="px-2 py-1 text-left">#</th>
              <th className="px-2 py-1 text-left">CODE</th>
              <th className="px-2 py-1 text-right">DAYS</th>
              <th className="px-2 py-1 text-right">DELTA</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.code} className="border-b border-white/[0.04] hover:bg-white/[0.02]">
                <td className="px-2 py-1 text-white/40">{row.rank}</td>
                <td className="px-2 py-1 text-white/70">{row.code}</td>
                <td className="px-2 py-1 text-right text-white/80">{row.days}</td>
                <td className={`px-2 py-1 text-right ${row.delta >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {row.delta > 0 ? '+' : ''}{row.delta}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
