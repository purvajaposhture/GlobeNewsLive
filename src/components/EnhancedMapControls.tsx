'use client';

interface EnhancedMapControlsProps {
  activeLayers: string[];
  onLayerToggle: (layer: string) => void;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onResetView?: () => void;
}

const LAYERS: { id: string; label: string; emoji: string; color: string }[] = [
  { id: 'flights', label: 'Flights', emoji: '✈️', color: '#00ccff' },
  { id: 'routes', label: 'Routes', emoji: '📍', color: '#ffaa00' },
  { id: 'conflicts', label: 'Conflicts', emoji: '⚔️', color: '#ff2244' },
  { id: 'military', label: 'Military', emoji: '🎖️', color: '#ff6633' },
  { id: 'chokepoints', label: 'Chokepoints', emoji: '🌊', color: '#00ff88' },
  { id: 'earthquakes', label: 'Quakes', emoji: '🌋', color: '#ffaa00' },
  { id: 'nuclear', label: 'Nuclear', emoji: '☢️', color: '#ff2244' },
  { id: 'spaceports', label: 'Space', emoji: '🚀', color: '#aa66ff' },
  { id: 'cables', label: 'Cables', emoji: '🔌', color: '#00ccff' },
  { id: 'pipelines', label: 'Pipes', emoji: '🛢️', color: '#ffaa00' },
  { id: 'fires', label: 'Fires', emoji: '🔥', color: '#ff6633' },
  { id: 'cyber', label: 'Cyber', emoji: '💻', color: '#aa66ff' },
  { id: 'weather', label: 'Weather', emoji: '⛈️', color: '#00ccff' },
];

export default function EnhancedMapControls({ activeLayers, onLayerToggle, onZoomIn, onZoomOut, onResetView }: EnhancedMapControlsProps) {
  return (
    <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
      {/* Zoom Controls */}
      <div className="bg-elevated/90 backdrop-blur rounded-lg border border-border-subtle overflow-hidden shadow-lg">
        <button
          onClick={onZoomIn}
          className="w-8 h-8 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors text-lg"
          title="Zoom in"
        >
          +
        </button>
        <div className="h-px bg-white/10" />
        <button
          onClick={onZoomOut}
          className="w-8 h-8 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors text-lg"
          title="Zoom out"
        >
          −
        </button>
        <div className="h-px bg-white/10" />
        <button
          onClick={onResetView}
          className="w-8 h-8 flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors text-xs"
          title="Reset view"
        >
          ⌂
        </button>
      </div>

      {/* Layer Toggles */}
      <div className="bg-elevated/90 backdrop-blur rounded-lg border border-border-subtle p-1.5 shadow-lg max-h-[300px] overflow-y-auto">
        <div className="text-[8px] text-text-muted font-mono mb-1 px-1">LAYERS</div>
        <div className="space-y-0.5">
          {LAYERS.map((layer) => {
            const isActive = activeLayers.includes(layer.id);
            return (
              <button
                key={layer.id}
                onClick={() => onLayerToggle(layer.id)}
                className={`flex items-center gap-1.5 w-full px-2 py-1 rounded text-[9px] transition-all ${
                  isActive
                    ? 'bg-white/10 text-white'
                    : 'text-text-dim hover:text-white hover:bg-white/5'
                }`}
                title={layer.label}
              >
                <span className="text-[10px]">{layer.emoji}</span>
                <span className="hidden lg:inline">{layer.label}</span>
                <div
                  className={`ml-auto w-1.5 h-1.5 rounded-full ${isActive ? 'opacity-100' : 'opacity-20'}`}
                  style={{ backgroundColor: layer.color }}
                />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
