'use client';

import { Signal } from '@/types';
import { useEffect, useRef, useState } from 'react';

interface LiveNewsTickerProps {
  signals: Signal[];
  speed?: number; // px per second
}

const SEVERITY_COLORS: Record<string, string> = {
  CRITICAL: '#ff2244',
  HIGH: '#ff6633',
  MEDIUM: '#ffaa00',
  LOW: '#00ccff',
  INFO: '#00ff88',
};

const CATEGORY_EMOJI: Record<string, string> = {
  conflict: '⚔️',
  military: '🎖️',
  diplomacy: '🤝',
  cyber: '💻',
  disaster: '🌊',
  economy: '💰',
  politics: '🏛️',
  terrorism: '💣',
  protest: '📢',
  infrastructure: '🏗️',
};

export default function LiveNewsTicker({ signals, speed = 60 }: LiveNewsTickerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  // Filter to critical/high signals for ticker
  const tickerSignals = signals.filter(s => s.severity === 'CRITICAL' || s.severity === 'HIGH').slice(0, 20);

  // Duplicate for seamless loop
  const items = [...tickerSignals, ...tickerSignals];

  useEffect(() => {
    if (!containerRef.current || items.length === 0) return;
    const el = containerRef.current;
    let animationId: number;
    let offset = 0;

    const animate = () => {
      if (!isPaused) {
        offset += speed / 60; // 60fps
        const halfWidth = el.scrollWidth / 2;
        if (offset >= halfWidth) offset = 0;
        el.style.transform = `translateX(-${offset}px)`;
      }
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [items.length, speed, isPaused]);

  if (tickerSignals.length === 0) return null;

  return (
    <div
      className="bg-elevated border-t border-border-default overflow-hidden relative"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Pause indicator */}
      {isPaused && (
        <div className="absolute left-2 top-1/2 -translate-y-1/2 z-10 px-2 py-0.5 bg-accent-orange/20 rounded text-[8px] text-accent-orange font-mono border border-accent-orange/30">
          PAUSED
        </div>
      )}

      <div className="flex items-center h-8">
        <div className="flex-shrink-0 px-3 py-1 bg-accent-red/20 border-r border-border-subtle">
          <span className="text-[9px] font-mono font-bold text-accent-red tracking-wider">🔴 LIVE</span>
        </div>

        <div className="flex-1 overflow-hidden">
          <div ref={containerRef} className="flex items-center gap-6 whitespace-nowrap will-change-transform">
            {items.map((signal, idx) => (
              <div key={`${signal.id}-${idx}`} className="flex items-center gap-2 flex-shrink-0">
                <span className="text-[10px]">{CATEGORY_EMOJI[signal.category] || '📡'}</span>
                <span
                  className="text-[10px] font-mono font-bold px-1 py-0.5 rounded"
                  style={{
                    backgroundColor: `${SEVERITY_COLORS[signal.severity]}20`,
                    color: SEVERITY_COLORS[signal.severity],
                  }}
                >
                  {signal.severity}
                </span>
                <span className="text-[11px] text-white/90">{signal.title}</span>
                <span className="text-[9px] text-text-muted">{signal.timeAgo}</span>
                <span className="text-[9px] text-text-dim">— {signal.source}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
