"use client";

import type { FinanceIndex } from "@/types/finance";

interface IndexGridProps {
  indices: FinanceIndex[];
}

function MiniSparkline({ data, positive }: { data: number[]; positive: boolean }) {
  if (!data || data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const width = 60;
  const height = 20;
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((v - min) / range) * (height - 2) - 1;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ");
  const color = positive ? "#4ade80" : "#f87171";
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="opacity-80">
      <polyline points={points} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function IndexGrid({ indices }: IndexGridProps) {
  return (
    <div className="glass-panel">
      <div className="px-3 py-2 border-b border-border-subtle bg-panel/50">
        <span className="font-mono text-[11px] font-bold tracking-wider text-accent-blue">
          🏦 INDICES
        </span>
      </div>
      <div className="p-2 grid grid-cols-2 md:grid-cols-3 gap-2">
        {indices.map((idx) => {
          const isUp = (idx.change ?? 0) > 0;
          const isDown = (idx.change ?? 0) < 0;
          const color = isUp ? "text-green-400" : isDown ? "text-red-400" : "text-amber-400";
          return (
            <div key={idx.symbol} className="bg-elevated/50 rounded p-2 flex flex-col justify-between min-h-[80px]">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-gray-400 font-mono">{idx.display}</span>
                <span className={`text-[10px] font-mono font-bold ${color}`}>
                  {isUp ? "▲" : isDown ? "▼" : "—"} {idx.change !== null ? `${Math.abs(idx.change).toFixed(2)}%` : "—"}
                </span>
              </div>
              <div className="text-[13px] text-white font-mono font-bold mt-1">
                {idx.price !== null ? idx.price.toLocaleString(undefined, { maximumFractionDigits: 2 }) : "—"}
              </div>
              <div className="mt-1">
                <MiniSparkline data={idx.sparkline} positive={isUp} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
