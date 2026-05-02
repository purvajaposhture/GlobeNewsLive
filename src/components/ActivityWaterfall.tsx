'use client';

import { Signal, Severity } from '@/types';
import { useMemo } from 'react';

interface ActivityWaterfallProps {
  signals: Signal[];
  maxItems?: number;
}

const SEVERITY_ORDER: Record<Severity, number> = {
  CRITICAL: 5,
  HIGH: 4,
  MEDIUM: 3,
  LOW: 2,
  INFO: 1,
};

const SEVERITY_COLORS: Record<Severity, string> = {
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

export default function ActivityWaterfall({ signals, maxItems = 15 }: ActivityWaterfallProps) {
  const sorted = useMemo(() => {
    return [...signals]
      .sort((a, b) => {
        const sevDiff = SEVERITY_ORDER[b.severity] - SEVERITY_ORDER[a.severity];
        if (sevDiff !== 0) return sevDiff;
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      })
      .slice(0, maxItems);
  }, [signals, maxItems]);

  if (sorted.length === 0) {
    return (
      <div className="p-4 text-center text-text-muted text-[11px] font-mono">
        No recent activity
      </div>
    );
  }

  return (
    <div className="bg-elevated rounded-lg border border-border-subtle overflow-hidden">
      <div className="px-3 py-2 border-b border-border-subtle bg-panel/50 flex items-center justify-between">
        <span className="font-mono text-[11px] font-bold text-accent-green">📊 ACTIVITY WATERFALL</span>
        <span className="text-[9px] text-text-muted font-mono">{sorted.length} events</span>
      </div>
      <div className="p-2 space-y-1 max-h-[320px] overflow-y-auto">
        {sorted.map((signal, idx) => (
          <div
            key={signal.id}
            className="flex items-start gap-2 px-2 py-1.5 rounded hover:bg-white/5 transition-colors group cursor-pointer"
            style={{ animationDelay: `${idx * 50}ms` }}
          >
            {/* Timeline connector */}
            <div className="flex flex-col items-center mt-0.5">
              <div
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: SEVERITY_COLORS[signal.severity] }}
              />
              {idx < sorted.length - 1 && (
                <div className="w-px h-full bg-white/10 mt-0.5" style={{ minHeight: '12px' }} />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px]">{CATEGORY_EMOJI[signal.category] || '📡'}</span>
                <span className="text-[10px] text-white/90 truncate">{signal.title}</span>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <span
                  className="text-[8px] font-mono font-bold px-1 py-0.5 rounded"
                  style={{
                    backgroundColor: `${SEVERITY_COLORS[signal.severity]}20`,
                    color: SEVERITY_COLORS[signal.severity],
                  }}
                >
                  {signal.severity}
                </span>
                <span className="text-[8px] text-text-dim font-mono">{signal.source}</span>
                <span className="text-[8px] text-text-muted ml-auto">{signal.timeAgo}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
