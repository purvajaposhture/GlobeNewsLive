'use client';

import useSWR from 'swr';

import { PanelHeader } from './PanelHeader';

const fetcher = (url: string) => fetch(url).then(r => r.json());

interface DefiToken {
  id: string;
  name: string;
  ticker: string;
  price: number;
  change24h: number;
  change7d: number;
}

const FALLBACK: DefiToken[] = [
  { id: 'uniswap', name: 'Uniswap', ticker: 'UNI', price: 9.45, change24h: 1.2, change7d: -3.4 },
  { id: 'lido-dao', name: 'Lido DAO', ticker: 'LDO', price: 1.92, change24h: -1.5, change7d: 2.0 },
  { id: 'aave', name: 'Aave', ticker: 'AAVE', price: 142.3, change24h: -0.8, change7d: 5.1 },
  { id: 'curve-dao-token', name: 'Curve', ticker: 'CRV', price: 0.42, change24h: 0.3, change7d: -0.5 },
  { id: 'compound-governance-token', name: 'Compound', ticker: 'COMP', price: 58.2, change24h: 0.9, change7d: 1.8 },
];

export default function DefiTokens() {
  const { data, error, isLoading } = useSWR('/api/finance/crypto', fetcher, { refreshInterval: 60000 });
  const tokens: DefiToken[] = data?.defiTokens ?? [];
  const display = error || tokens.length === 0 ? FALLBACK : tokens;

  if (isLoading && !data) {
    return (
      <div className="border border-white/[0.08] bg-[#0f0f14] animate-pulse">
        <div className="px-3 py-2 border-b border-white/[0.08]">
          <div className="h-3 bg-white/10 rounded w-1/3" />
        </div>
        <div className="p-2 space-y-2">
          {[1,2,3].map(i => <div key={i} className="h-6 bg-white/5 rounded" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="border border-white/[0.08] bg-[#0f0f14]">
      <PanelHeader title="DEFI TOKENS" accentColor="blue" />
      <div className="p-2 space-y-1">
        {display.map((t) => (
          <div key={t.id} className="flex items-center justify-between px-2 py-1.5 rounded hover:bg-white/[0.03]">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-white/80">{t.name}</span>
              <span className="text-[9px] font-mono text-white/40">{t.ticker}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-mono text-white/70">${t.price.toLocaleString()}</span>
              <span className={`text-[9px] font-mono ${t.change24h >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {t.change24h > 0 ? '+' : ''}{t.change24h.toFixed(1)}%
              </span>
              <span className={`text-[9px] font-mono ${t.change7d >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                7d {t.change7d > 0 ? '+' : ''}{t.change7d.toFixed(1)}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
