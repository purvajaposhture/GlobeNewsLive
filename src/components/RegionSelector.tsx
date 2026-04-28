'use client';

export type Region = 'global' | 'ukraine' | 'middle-east' | 'asia-pacific' | 'africa' | 'europe' | 'americas';

interface RegionSelectorProps {
  value: Region;
  onChange: (region: Region) => void;
}

const REGIONS: { value: Region; label: string; emoji: string }[] = [
  { value: 'global', label: 'GLOBAL', emoji: '🌐' },
  { value: 'ukraine', label: 'UKRAINE', emoji: '🇺🇦' },
  { value: 'middle-east', label: 'MIDDLE EAST', emoji: '🕌' },
  { value: 'asia-pacific', label: 'ASIA-PACIFIC', emoji: '🌏' },
  { value: 'africa', label: 'AFRICA', emoji: '🌍' },
  { value: 'europe', label: 'EUROPE', emoji: '🇪🇺' },
  { value: 'americas', label: 'AMERICAS', emoji: '🌎' },
];

export default function RegionSelector({ value, onChange }: RegionSelectorProps) {
  return (
    <div className="flex items-center gap-1 bg-white/5 rounded-lg p-1 border border-white/10 overflow-x-auto">
      <span className="text-[9px] text-text-muted font-mono px-2 hidden sm:inline flex-shrink-0">REGION</span>
      {REGIONS.map((region) => (
        <button
          key={region.value}
          onClick={() => onChange(region.value)}
          className={`flex items-center gap-1 px-2.5 py-1 rounded text-[10px] font-mono font-bold tracking-wider transition-all flex-shrink-0 ${
            value === region.value
              ? 'bg-accent-blue/20 text-accent-blue border border-accent-blue/30'
              : 'text-text-dim hover:text-white hover:bg-white/5'
          }`}
        >
          <span>{region.emoji}</span>
          <span className="hidden md:inline">{region.label}</span>
        </button>
      ))}
    </div>
  );
}
