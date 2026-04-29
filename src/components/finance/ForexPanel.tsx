"use client";

import type { FinanceForex } from "@/types/finance";

interface ForexPanelProps {
  forex: FinanceForex[];
}

export default function ForexPanel({ forex }: ForexPanelProps) {
  return (
    <div className="glass-panel">
      <div className="px-3 py-2 border-b border-border-subtle bg-panel/50">
        <span className="font-mono text-[11px] font-bold tracking-wider text-accent-cyan">
          💵 FOREX
        </span>
      </div>
      <div className="p-2 grid grid-cols-2 gap-2">
        {forex.map((f) => {
          const isUp = (f.change ?? 0) > 0;
          const isDown = (f.change ?? 0) < 0;
          const color = isUp ? "text-green-400" : isDown ? "text-red-400" : "text-amber-400";
          return (
            <div key={f.symbol} className="bg-elevated/50 rounded p-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] text-gray-400 font-mono">{f.display}</span>
                <span className={`text-[10px] font-mono font-bold ${color}`}>
                  {isUp ? "▲" : isDown ? "▼" : "—"} {f.change !== null ? `${Math.abs(f.change).toFixed(3)}%` : "—"}
                </span>
              </div>
              <div className="text-[14px] text-white font-mono font-bold">
                {f.price !== null ? f.price.toFixed(4) : "—"}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
