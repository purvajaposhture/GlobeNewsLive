"use client";

import type { FinanceCrypto } from "@/types/finance";

interface CryptoPanelProps {
  crypto: FinanceCrypto[];
}

export default function CryptoPanel({ crypto }: CryptoPanelProps) {
  return (
    <div className="glass-panel">
      <div className="px-3 py-2 border-b border-border-subtle bg-panel/50">
        <span className="font-mono text-[11px] font-bold tracking-wider text-accent-purple">
          🚀 CRYPTO
        </span>
      </div>
      <div className="p-2 space-y-1">
        {crypto.map((c) => {
          const isUp = (c.change24h ?? 0) > 0;
          const isDown = (c.change24h ?? 0) < 0;
          const color = isUp ? "text-green-400" : isDown ? "text-red-400" : "text-amber-400";
          return (
            <div key={c.symbol} className="flex items-center justify-between px-2 py-2 bg-elevated/50 rounded">
              <div className="flex items-center gap-2">
                <span className="text-sm">{c.symbol === "BTC" ? "₿" : c.symbol === "ETH" ? "Ξ" : "◆"}</span>
                <div>
                  <div className="text-[11px] text-white font-mono">{c.name}</div>
                  <div className="text-[9px] text-gray-400 font-mono">{c.symbol}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-[12px] text-white font-mono font-bold">
                  {c.price !== null ? `$${c.price.toLocaleString(undefined, { maximumFractionDigits: 2 })}` : "—"}
                </div>
                <div className={`text-[10px] font-mono font-bold ${color}`}>
                  {isUp ? "▲" : isDown ? "▼" : "—"} {c.change24h !== null ? `${Math.abs(c.change24h).toFixed(2)}%` : "—"}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
