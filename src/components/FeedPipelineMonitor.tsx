'use client';

import { useState, useEffect } from 'react';

interface FeedSource {
  name: string;
  status: 'healthy' | 'degraded' | 'down' | 'unknown';
  lastPing: number; // ms ago
  latency?: number; // ms
}

interface FeedPipelineMonitorProps {
  sources?: FeedSource[];
}

const DEFAULT_SOURCES: FeedSource[] = [
  { name: 'Signals API', status: 'healthy', lastPing: 5000, latency: 120 },
  { name: 'Markets API', status: 'healthy', lastPing: 8000, latency: 200 },
  { name: 'Earthquakes', status: 'healthy', lastPing: 120000, latency: 350 },
  { name: 'Conflicts', status: 'healthy', lastPing: 300000, latency: 180 },
  { name: 'Flights', status: 'degraded', lastPing: 45000, latency: 800 },
  { name: 'Predictions', status: 'healthy', lastPing: 60000, latency: 250 },
];

const STATUS_META: Record<string, { color: string; bg: string; label: string }> = {
  healthy:   { color: '#00ff88', bg: 'rgba(0,255,136,0.15)', label: 'HEALTHY' },
  degraded:  { color: '#ffaa00', bg: 'rgba(255,170,0,0.15)', label: 'DEGRADED' },
  down:      { color: '#ff2244', bg: 'rgba(255,34,68,0.15)', label: 'DOWN' },
  unknown:   { color: '#888888', bg: 'rgba(136,136,136,0.15)', label: 'UNKNOWN' },
};

export default function FeedPipelineMonitor({ sources = DEFAULT_SOURCES }: FeedPipelineMonitorProps) {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 5000);
    return () => clearInterval(timer);
  }, []);

  const healthy = sources.filter(s => s.status === 'healthy').length;
  const degraded = sources.filter(s => s.status === 'degraded').length;
  const down = sources.filter(s => s.status === 'down').length;

  return (
    <div className="bg-elevated rounded-lg border border-border-subtle overflow-hidden">
      <div className="px-3 py-2 border-b border-border-subtle bg-panel/50 flex items-center justify-between">
        <span className="font-mono text-[11px] font-bold text-accent-blue">🔌 FEED PIPELINE</span>
        <div className="flex items-center gap-1.5">
          <span className="text-[9px] font-mono text-accent-green">{healthy} OK</span>
          {degraded > 0 && <span className="text-[9px] font-mono text-accent-orange">{degraded} WARN</span>}
          {down > 0 && <span className="text-[9px] font-mono text-accent-red">{down} DOWN</span>}
        </div>
      </div>
      <div className="p-2 space-y-1">
        {sources.map((source) => {
          const meta = STATUS_META[source.status];
          const age = Math.floor((now - (now - source.lastPing)) / 1000); // simplified
          return (
            <div key={source.name} className="flex items-center justify-between px-2 py-1 rounded hover:bg-white/5 transition-colors">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: meta.color }} />
                <span className="text-[10px] text-white/80">{source.name}</span>
              </div>
              <div className="flex items-center gap-2">
                {source.latency && (
                  <span className="text-[8px] text-text-muted font-mono">{source.latency}ms</span>
                )}
                <span
                  className="text-[8px] font-mono font-bold px-1.5 py-0.5 rounded"
                  style={{ backgroundColor: meta.bg, color: meta.color }}
                >
                  {meta.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
