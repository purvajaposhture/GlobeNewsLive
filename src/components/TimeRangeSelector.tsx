'use client';

export type TimeRange = '1h' | '6h' | '24h' | '7d' | '30d';

interface TimeRangeSelectorProps {
  value: TimeRange;
  onChange: (range: TimeRange) => void;
}

const RANGES: { value: TimeRange; label: string }[] = [
  { value: '1h', label: '1H' },
  { value: '6h', label: '6H' },
  { value: '24h', label: '24H' },
  { value: '7d', label: '7D' },
  { value: '30d', label: '30D' },
];

export default function TimeRangeSelector({ value, onChange }: TimeRangeSelectorProps) {
  return (
    <div className="flex items-center gap-1 bg-white/5 rounded-lg p-1 border border-white/10">
      <span className="text-[9px] text-text-muted font-mono px-2 hidden sm:inline">TIME</span>
      {RANGES.map((range) => (
        <button
          key={range.value}
          onClick={() => onChange(range.value)}
          className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold tracking-wider transition-all ${
            value === range.value
              ? 'bg-accent-green/20 text-accent-green border border-accent-green/30'
              : 'text-text-dim hover:text-white hover:bg-white/5'
          }`}
        >
          {range.label}
        </button>
      ))}
    </div>
  );
}
