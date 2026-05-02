'use client';

import { ThreatLevel, Signal } from '@/types';

interface GlobalSituationHeaderProps {
  threatLevel: ThreatLevel;
  signals: Signal[];
  activeConflicts: number;
  lastUpdate: Date;
}

const THREAT_META: Record<ThreatLevel, { label: string; color: string; bg: string; desc: string }> = {
  LOW:      { label: 'LOW',      color: '#00ff88', bg: 'rgba(0,255,136,0.12)', desc: 'Normal global conditions' },
  GUARDED:  { label: 'GUARDED',  color: '#00ccff', bg: 'rgba(0,204,255,0.12)', desc: 'Elevated watch posture' },
  ELEVATED: { label: 'ELEVATED', color: '#ffaa00', bg: 'rgba(255,170,0,0.12)', desc: 'Significant risks detected' },
  HIGH:     { label: 'HIGH',     color: '#ff6633', bg: 'rgba(255,102,51,0.15)', desc: 'Multiple active crises' },
  SEVERE:   { label: 'SEVERE',   color: '#ff2244', bg: 'rgba(255,34,68,0.18)',  desc: 'Critical global situation' },
};

export default function GlobalSituationHeader({ threatLevel, signals, activeConflicts, lastUpdate }: GlobalSituationHeaderProps) {
  const meta = THREAT_META[threatLevel];
  const criticalCount = signals.filter(s => s.severity === 'CRITICAL').length;
  const highCount = signals.filter(s => s.severity === 'HIGH').length;
  const totalCount = signals.length;

  const stats = [
    { label: 'CONFLICTS', value: activeConflicts, color: '#ff6633' },
    { label: 'CRITICAL', value: criticalCount, color: '#ff2244' },
    { label: 'HIGH', value: highCount, color: '#ffaa00' },
    { label: 'TOTAL SIGNALS', value: totalCount, color: '#00ff88' },
  ];

  return (
    <div className="bg-elevated border-b border-border-default">
      <div className="px-4 py-2 flex items-center gap-4 overflow-x-auto">
        {/* Threat Level Pill */}
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg border flex-shrink-0"
          style={{ backgroundColor: meta.bg, borderColor: `${meta.color}40` }}
        >
          <div className="relative">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: meta.color }} />
            {(threatLevel === 'HIGH' || threatLevel === 'SEVERE') && (
              <div className="absolute inset-0 w-2.5 h-2.5 rounded-full animate-ping" style={{ backgroundColor: meta.color, opacity: 0.5 }} />
            )}
          </div>
          <div>
            <span className="font-mono text-[10px] font-bold tracking-wider" style={{ color: meta.color }}>
              {meta.label}
            </span>
            <span className="hidden sm:inline text-[9px] text-white/50 ml-2">{meta.desc}</span>
          </div>
        </div>

        {/* Stats Row */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {stats.map((stat) => (
            <div key={stat.label} className="flex items-center gap-1.5 px-2 py-1 rounded bg-white/5">
              <span className="font-mono text-[11px] font-bold" style={{ color: stat.color }}>
                {stat.value}
              </span>
              <span className="text-[8px] text-text-muted tracking-wider">{stat.label}</span>
            </div>
          ))}
        </div>

        {/* Last Update */}
        <div className="ml-auto flex items-center gap-1.5 flex-shrink-0">
          <div className="w-1.5 h-1.5 rounded-full bg-accent-green animate-pulse" />
          <span className="text-[9px] text-text-dim font-mono">
            Updated {lastUpdate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })} UTC
          </span>
        </div>
      </div>
    </div>
  );
}
