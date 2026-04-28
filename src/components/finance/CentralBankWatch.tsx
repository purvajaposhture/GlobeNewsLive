'use client';

import useSWR from 'swr';
import { PanelHeader } from './PanelHeader';

const fetcher = (url: string) => fetch(url).then(r => r.json());

interface Signal {
  title: string;
  source: string;
  timestamp: string;
}

export default function CentralBankWatch() {
  const { data, isLoading } = useSWR('/api/signals', fetcher, { refreshInterval: 60000 });
  const allSignals: Signal[] = data?.signals ?? [];
  const keywords = ['central bank', 'fed', 'ecb', 'boj', 'pboc', 'federal reserve', 'interest rate', 'monetary policy'];
  const filtered = allSignals.filter((s: Signal) =>
    keywords.some(kw => s.title?.toLowerCase().includes(kw))
  ).slice(0, 5);

  const isLive = !isLoading && data;

  return (
    <div className="border border-white/[0.08] bg-[#0f0f14]">
      <PanelHeader title="CENTRAL BANK WATCH" live={isLive} count={filtered.length} accentColor="red" />
      <div className="p-2">
        {filtered.length === 0 ? (
          <div className="px-2 py-4 text-center">
            <span className="text-[10px] font-mono text-white/30">No news available</span>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((s, i) => (
              <div key={i} className="px-2 py-1.5 rounded hover:bg-white/[0.03]">
                <p className="text-[9px] font-mono text-white/70 leading-relaxed line-clamp-2">{s.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[8px] font-mono text-white/40">{s.source}</span>
                  <span className="text-[8px] font-mono text-white/30">{s.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
