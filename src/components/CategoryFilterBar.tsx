'use client';

import { SignalCategory } from '@/types';

interface CategoryFilterBarProps {
  active: SignalCategory[];
  onToggle: (category: SignalCategory) => void;
}

const CATEGORIES: { value: SignalCategory; label: string; color: string }[] = [
  { value: 'conflict', label: 'CONFLICT', color: '#ff2244' },
  { value: 'military', label: 'MILITARY', color: '#ff6633' },
  { value: 'diplomacy', label: 'DIPLOMACY', color: '#00ccff' },
  { value: 'cyber', label: 'CYBER', color: '#aa66ff' },
  { value: 'disaster', label: 'DISASTER', color: '#ffaa00' },
  { value: 'economy', label: 'ECONOMY', color: '#00ff88' },
  { value: 'politics', label: 'POLITICS', color: '#ff88cc' },
  { value: 'terrorism', label: 'TERROR', color: '#ff4444' },
  { value: 'protest', label: 'PROTEST', color: '#ffcc00' },
  { value: 'infrastructure', label: 'INFRA', color: '#66ccff' },
];

export default function CategoryFilterBar({ active, onToggle }: CategoryFilterBarProps) {
  return (
    <div className="flex items-center gap-1 bg-white/5 rounded-lg p-1.5 border border-white/10 overflow-x-auto">
      <span className="text-[9px] text-text-muted font-mono px-2 hidden sm:inline flex-shrink-0">FILTER</span>
      {CATEGORIES.map((cat) => {
        const isActive = active.includes(cat.value);
        return (
          <button
            key={cat.value}
            onClick={() => onToggle(cat.value)}
            className={`px-2 py-1 rounded text-[9px] font-mono font-bold tracking-wider transition-all flex-shrink-0 border ${
              isActive
                ? 'text-white'
                : 'text-text-dim hover:text-white border-transparent hover:bg-white/5'
            }`}
            style={
              isActive
                ? { backgroundColor: `${cat.color}20`, borderColor: `${cat.color}50`, color: cat.color }
                : undefined
            }
          >
            {cat.label}
          </button>
        );
      })}
      {active.length > 0 && (
        <button
          onClick={() => active.forEach(c => onToggle(c))}
          className="ml-1 px-2 py-1 rounded text-[9px] font-mono text-text-muted hover:text-white hover:bg-white/5 flex-shrink-0"
          title="Clear all"
        >
          ✕
        </button>
      )}
    </div>
  );
}
