"use client";

import { useEffect, useRef } from "react";
import type { FinanceData } from "@/types/finance";

interface FinanceTickerProps {
  data: FinanceData | undefined;
}

export default function FinanceTicker({ data }: FinanceTickerProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    let raf: number;
    let pos = 0;
    const step = () => {
      pos -= 0.5;
      if (Math.abs(pos) >= el.scrollWidth / 2) pos = 0;
      el.style.transform = `translateX(${pos}px)`;
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [data]);

  const items: { label: string; value: string; change: number | null }[] = [];
  if (data) {
    data.indices.forEach((i) =>
      items.push({ label: i.display, value: i.price !== null ? i.price.toLocaleString(undefined, { maximumFractionDigits: 2 }) : "—", change: i.change })
    );
    data.commodities.forEach((c) =>
      items.push({ label: c.display, value: c.price !== null ? c.price.toLocaleString(undefined, { maximumFractionDigits: 2 }) : "—", change: c.change })
    );
    data.crypto.forEach((c) =>
      items.push({ label: c.display, value: c.price !== null ? c.price.toLocaleString(undefined, { maximumFractionDigits: 2 }) : "—", change: c.change24h })
    );
    data.forex.forEach((f) =>
      items.push({ label: f.display, value: f.price !== null ? f.price.toFixed(4) : "—", change: f.change })
    );
  }

  if (items.length === 0) {
    return (
      <div className="bg-gray-950 border-b border-gray-800 py-1.5 overflow-hidden">
        <div className="text-[10px] font-mono text-gray-500 px-3">Loading market data…</div>
      </div>
    );
  }

  const renderItem = (item: typeof items[0], idx: number) => {
    const isUp = (item.change ?? 0) > 0;
    const isDown = (item.change ?? 0) < 0;
    const color = isUp ? "text-green-400" : isDown ? "text-red-400" : "text-amber-400";
    const arrow = isUp ? "▲" : isDown ? "▼" : "—";
    return (
      <span key={idx} className="inline-flex items-center gap-1.5 mx-4 whitespace-nowrap">
        <span className="text-[10px] text-gray-400 font-mono">{item.label}</span>
        <span className="text-[11px] text-white font-mono">{item.value}</span>
        <span className={`text-[10px] font-mono font-bold ${color}`}>
          {arrow} {item.change !== null ? `${Math.abs(item.change).toFixed(2)}%` : "—"}
        </span>
      </span>
    );
  };

  return (
    <div className="bg-gray-950 border-b border-gray-800 py-1.5 overflow-hidden relative">
      <div ref={scrollRef} className="flex whitespace-nowrap will-change-transform">
        {[...items, ...items].map((item, idx) => renderItem(item, idx))}
      </div>
    </div>
  );
}
