'use client';

import useSWR from 'swr';
import { PanelHeader } from './PanelHeader';

const fetcher = (url: string) => fetch(url).then(r => r.json());

interface AiToken {
  id: string;
  name: string;
  ticker: string;
  price: number;
  change24h: number;
  change7d: number;
}

const FALLBACK: AiToken[] = [
  { id: 'bittensor', name: 'Bittensor', ticker: 'TAO', price: 423.5, change24h: 2.3, change7d: -5.1 },
  { id: 'akash-network', name: 'Akash Network', ticker: 'AKT', price: 3.87, change24h: -1.2, change7d: 4.5 },
  { id: 'ocean-protocol', name: 'Ocean Protocol', ticker: 'OCEAN', price: 0.72, change24h: 0.8, change7d: -2.3 },
  { id: 'fetch-ai', name: 'Fetch.ai', ticker: 'FET', price: 1.45, change24h: 3.1, change7d: 8.2 },
  { id: 'singularitynet', name: 'SingularityNET', ticker: 'AGIX', price: 0.65, change24h: 1.2, change7d: -0.5 },
];

interface AiTokensProps {
  compact?: boolean;
}

export default function AiTokens({ compact }: AiTokensProps) {
  const { data, error, isLoading } = useSWR('/api/finance/crypto', fetcher, { refreshInterval: 60000 });
  const tokens: AiToken[] = data?.aiTokens ?? [];
  const display = error || tokens.length === 0 ? FALLBACK : tokens;

  if (isLoading && !data) {
    return (
      <div className={`bg-[#0f0f14] animate-pulse h-full ${compact ? '' : 'border border-white/[0.08]'}`}>
        {!compact && (
          <div className="px-3 py-2 border-b border-white/[0.08]">
            <div className="h-3 bg-white/10 rounded w-1/3" />
          </div>
        )}
        <div className="p-2 space-y-2">
          {[1,2,3].map(i => <div key={i} className="h-6 bg-white/5 rounded" />)}
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-[#0f0f14] h-full ${compact ? '' : 'border border-white/[0.08]'}`}>
      {!compact && <PanelHeader title="AI TOKENS" accentColor="purple" />}
      <div className="p-2 space-y-0">
        {display.map((t) => (
          <div key={t.id} className="flex items-center justify-between py-1.5 border-b border-white/[0.04] last:border-0">
            <div>
              <span className="text-[12px] text-gray-200 font-medium">{t.name}</span>
              {' '}
              <span className="text-[10px] text-gray-500 font-mono">{t.ticker}</span>
            </div>
            <div className="text-right">
              <span className="text-[12px] font-mono text-gray-200">
                ${t.price < 1 ? t.price.toFixed(3) : t.price.toLocaleString()}
              </span>
              {' '}
              <span className={`text-[10px] font-mono ${t.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {t.change24h >= 0 ? '+' : ''}{t.change24h.toFixed(1)}%
              </span>
              {' '}
              <span className="text-[9px] font-mono text-gray-600">
                7d {t.change7d >= 0 ? '+' : ''}{t.change7d?.toFixed(1) ?? '0.0'}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
