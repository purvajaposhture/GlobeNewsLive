'use client';

import useSWR from 'swr';
import { PanelHeader } from './PanelHeader';

const fetcher = (url: string) => fetch(url).then(r => r.json());

interface Sector {
  id: string;
  name: string;
  change24h: number;
}

const FALLBACK: Sector[] = [
  { id: 'artificial-intelligence', name: 'AI', change24h: -2.4 },
  { id: 'meme-token', name: 'Memes', change24h: -3.3 },
  { id: 'gaming', name: 'Gaming', change24h: -1.5 },
  { id: 'privacy-coins', name: 'Privacy', change24h: -4.3 },
  { id: 'infrastructure', name: 'Infra', change24h: 0.5 },
];

interface CryptoSectorsProps {
  compact?: boolean;
}

export default function CryptoSectors({ compact }: CryptoSectorsProps) {
  const { data, error, isLoading } = useSWR('/api/finance/sectors', fetcher, { refreshInterval: 300000 });
  const sectors: Sector[] = data?.sectors ?? [];

  if (isLoading && !data) {
    return (
      <div className={`bg-[#0f0f14] animate-pulse ${compact ? '' : 'border border-white/[0.08]'}`}>
        {!compact && (
          <div className="px-3 py-2 border-b border-white/[0.08]">
            <div className="h-3 bg-white/10 rounded w-1/3" />
          </div>
        )}
        <div className="p-2 grid grid-cols-3 gap-1">
          {[1,2,3].map(i => <div key={i} className="h-12 bg-white/5 rounded" />)}
        </div>
        <div className="px-2 pb-2 grid grid-cols-2 gap-1">
          {[4,5].map(i => <div key={i} className="h-12 bg-white/5 rounded" />)}
        </div>
      </div>
    );
  }

  const display = error || sectors.length === 0 ? FALLBACK : sectors;
  const top3 = display.slice(0, 3);
  const bottom2 = display.slice(3, 5);

  return (
    <div className={`bg-[#0f0f14] h-full ${compact ? '' : 'border border-white/[0.08] min-h-[160px]'}`}>
      {!compact && <PanelHeader title="CRYPTO SECTORS" accentColor="purple" />}
      <div className="p-2 space-y-1 h-full flex flex-col">
        {/* Top row: 3 tiles */}
        <div className="grid grid-cols-3 gap-1">
          {top3.map((s) => (
            <SectorTile key={s.id} sector={s} />
          ))}
        </div>
        {/* Bottom row: 2 tiles */}
        <div className="grid grid-cols-2 gap-1">
          {bottom2.map((s) => (
            <SectorTile key={s.id} sector={s} />
          ))}
        </div>
      </div>
    </div>
  );
}

function SectorTile({ sector }: { sector: Sector }) {
  const isUp = sector.change24h >= 0;
  return (
    <div
      className={`flex flex-col items-center justify-center py-2 px-1 rounded border text-center ${
        isUp
          ? 'bg-green-950/40 border-green-900/30'
          : 'bg-red-950/40 border-red-900/30'
      }`}
    >
      <span className="text-[9px] font-mono text-gray-500 uppercase tracking-wide leading-none mb-1">
        {sector.name}
      </span>
      <span className={`text-[12px] font-mono font-medium ${isUp ? 'text-green-400' : 'text-red-400'}`}>
        {isUp ? '+' : ''}{sector.change24h.toFixed(1)}%
      </span>
    </div>
  );
}
