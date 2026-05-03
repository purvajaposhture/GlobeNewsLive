"use client";

import type { FinanceComposite } from "@/types/finance";

interface MarketCompositeProps {
  composite: FinanceComposite | undefined;
}

function getColor(score: number) {
  if (score >= 60) return "#4ade80"; // green-400
  if (score >= 40) return "#fbbf24"; // amber-400
  return "#f87171"; // red-400
}

function getLabel(score: number) {
  if (score >= 75) return "BULLISH";
  if (score >= 60) return "RISK-ON";
  if (score >= 40) return "NEUTRAL";
  if (score >= 25) return "CAUTIOUS";
  return "BEARISH";
}

export default function MarketComposite({ composite }: MarketCompositeProps) {
  if (!composite) {
    return (
      <div className="glass-panel p-3 animate-pulse">
        <div className="h-24 bg-white/5 rounded" />
      </div>
    );
  }

  const score = composite.score;
  const color = getColor(score);
  const label = getLabel(score);
  const circumference = 2 * Math.PI * 36;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="glass-panel">
      <div className="px-3 py-2 border-b border-border-subtle bg-panel/50">
        <span className="font-mono text-[11px] font-bold tracking-wider text-accent-gold">
          📊 MARKET COMPOSITE
        </span>
      </div>
      <div className="p-3 flex items-center gap-4">
        <div className="relative w-20 h-20 shrink-0">
          <svg width="80" height="80" viewBox="0 0 80 80">
            <circle cx="40" cy="40" r="36" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="6" />
            <circle
              cx="40"
              cy="40"
              r="36"
              fill="none"
              stroke={color}
              strokeWidth="6"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              transform="rotate(-90 40 40)"
            />
            <text x="40" y="44" textAnchor="middle" fill={color} fontSize="16" fontWeight="bold" fontFamily="monospace">
              {score}
            </text>
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold text-white">{label}</span>
            <span className="text-[10px] text-gray-400 font-mono">{composite.signals.filter((s) => s.value > 0).length}/{composite.signals.length} BULLISH</span>
          </div>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1">
            {composite.signals.map((sig) => (
              <div key={sig.name} className="flex items-center justify-between">
                <span className="text-[9px] text-gray-400 uppercase">{sig.name}</span>
                <span
                  className={`text-[9px] font-mono font-bold ${
                    sig.value > 0.15 ? "text-green-400" : sig.value < -0.15 ? "text-red-400" : "text-amber-400"
                  }`}
                >
                  {sig.value > 0 ? "▲" : sig.value < 0 ? "▼" : "—"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
