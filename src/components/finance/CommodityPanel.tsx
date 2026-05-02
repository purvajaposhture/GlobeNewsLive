"use client";

import type { FinanceCommodity } from "@/types/finance";

interface CommodityPanelProps {
  commodities: FinanceCommodity[];
}

export default function CommodityPanel({ commodities }: CommodityPanelProps) {
  return (
    <div className="glass-panel">
      <div className="px-3 py-2 border-b border-border-subtle bg-panel/50">
        <span className="font-mono text-[11px] font-bold tracking-wider text-accent-orange">
          ⛏️ COMMODITIES
        </span>
      </div>
      <div className="p-2 space-y-1">
        {commodities.map((c) => {
          const isUp = (c.change ?? 0) > 0;
          const isDown = (c.change ?? 0) < 0;
          const color = isUp ? "text-green-400" : isDown ? "text-red-400" : "text-amber-400";
          const bgBar = isUp ? "bg-green-400/20" : isDown ? "bg-red-400/20" : "bg-amber-400/20";
          const maxAbs = Math.max(
            ...commodities.filter((x) => x.change !== null).map((x) => Math.abs(x.change!)),
            1
          );
          const pct = c.change !== null ? Math.min((Math.abs(c.change) / maxAbs) * 100, 100) : 0;
          return (
            <div key={c.symbol} className="flex items-center gap-2 px-2 py-1.5 bg-elevated/50 rounded">
              <div className="w-20 shrink-0">
                <div className="text-[10px] text-gray-400 font-mono">{c.display}</div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className={`h-full ${bgBar} rounded-full`} style={{ width: `${pct}%` }} />
                </div>
              </div>
              <div className="w-24 text-right shrink-0">
                <div className="text-[11px] text-white font-mono">
                  {c.price !== null ? c.price.toLocaleString(undefined, { maximumFractionDigits: 2 }) : "—"}
                </div>
              </div>
              <div className="w-16 text-right shrink-0">
                <span className={`text-[10px] font-mono font-bold ${color}`}>
                  {isUp ? "▲" : isDown ? "▼" : "—"} {c.change !== null ? `${Math.abs(c.change).toFixed(2)}%` : "—"}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
