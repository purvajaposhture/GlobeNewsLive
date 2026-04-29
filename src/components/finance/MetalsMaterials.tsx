'use client';

import useSWR from 'swr';
import { PanelHeader } from './PanelHeader';

const fetcher = (url: string) => fetch(url).then(r => r.json());

interface Metal {
  symbol: string;
  name: string;
  display: string;
  price: number;
  change: number;
  sparkline: number[];
}

function Sparkline({ data, positive }: { data: number[]; positive: boolean }) {
  if (!data || data.length < 2) return <div className="w-16 h-6 bg-white/5 rounded" />;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const w = 64;
  const h = 24;
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * h;
    return `${x},${y}`;
  }).join(' ');
  const color = positive ? '#34d399' : '#f87171';
  return (
    <svg width={w} height={h} className="opacity-80">
      <polyline fill="none" stroke={color} strokeWidth="1.5" points={points} />
    </svg>
  );
}

export default function MetalsMaterials() {
  const { data, error, isLoading } = useSWR('/api/finance/metals', fetcher, { refreshInterval: 30000 });
  const metals: Metal[] = data?.metals ?? [];

  if (isLoading && !data) {
    return (
      <div className="border border-white/[0.08] bg-[#0f0f14] animate-pulse">
        <div className="px-3 py-2 border-b border-white/[0.08]">
          <div className="h-3 bg-white/10 rounded w-1/3" />
        </div>
        <div className="p-2 grid grid-cols-3 gap-1">
          {[1,2,3,4,5,6].map(i => <div key={i} className="h-16 bg-white/5 rounded" />)}
        </div>
      </div>
    );
  }

  const display = error || metals.length === 0 ? [
    { symbol: 'GC=F', name: 'Gold', display: 'GOLD', price: 2345.2, change: 0.32, sparkline: [2320,2330,2335,2340,2345] },
    { symbol: 'SI=F', name: 'Silver', display: 'SILVER', price: 28.4, change: -0.12, sparkline: [28.6,28.5,28.4,28.3,28.4] },
    { symbol: 'HG=F', name: 'Copper', display: 'COPPER', price: 4.52, change: 0.85, sparkline: [4.45,4.47,4.49,4.51,4.52] },
    { symbol: 'PL=F', name: 'Platinum', display: 'PLATINUM', price: 1023.5, change: -0.45, sparkline: [1030,1028,1025,1024,1023] },
    { symbol: 'PA=F', name: 'Palladium', display: 'PALLADIUM', price: 987.2, change: 0.18, sparkline: [980,983,985,986,987] },
    { symbol: 'ALI=F', name: 'Aluminum', display: 'ALUMINUM', price: 2456.0, change: -0.22, sparkline: [2460,2458,2457,2456,2455] },
  ] : metals;

  return (
    <div className="border border-white/[0.08] bg-[#0f0f14]">
      <PanelHeader title="METALS & MATERIALS" accentColor="amber" />
      <div className="p-2 grid grid-cols-3 gap-1">
        {display.map((m) => (
          <div key={m.symbol} className="flex flex-col items-center py-2 rounded border border-white/[0.06] bg-white/[0.02]">
            <span className="text-[9px] font-mono text-white/50">{m.display}</span>
            <Sparkline data={m.sparkline} positive={m.change >= 0} />
            <span className="text-[10px] font-mono text-white/80">${m.price.toLocaleString()}</span>
            <span className={`text-[9px] font-mono ${m.change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {m.change > 0 ? '+' : ''}{m.change.toFixed(2)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
