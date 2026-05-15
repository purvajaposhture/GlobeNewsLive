'use client';
import { MapViewProvider, useMapView } from '@/contexts/MapViewContext';

import { useState, useEffect } from 'react';
import type { Signal, MarketData } from '@/types';

interface LayerConfig {
  id: string;
  label: string;
  icon: string;
  color: string;
  active: boolean;
}

interface WorldMonitorLayoutProps {
  children: React.ReactNode;
  signals: Signal[];
  activeLayers: string[];
  onLayerToggle: (layer: string) => void;
}

const SIDEBAR_LAYERS: LayerConfig[] = [
  { id: 'conflicts', label: 'Conflict Zones', icon: '⚔️', color: '#ff2244', active: true },
  { id: 'hotspots', label: 'Intel Hotspots', icon: '🔥', color: '#ff6633', active: true },
  { id: 'bases', label: 'Military Bases', icon: '🏛️', color: '#4488ff', active: true },
  { id: 'nuclear', label: 'Nuclear Sites', icon: '☢️', color: '#ffcc00', active: false },
  { id: 'flights', label: 'Military Flights', icon: '✈️', color: '#ff8800', active: true },
  { id: 'ships', label: 'Naval Vessels', icon: '🚢', color: '#00ccff', active: false },
  { id: 'earthquakes', label: 'Earthquakes', icon: '🌍', color: '#ffaa00', active: true },
  { id: 'fires', label: 'Satellite Fires', icon: '🔴', color: '#ff4400', active: false },
  { id: 'cyber', label: 'Cyber Threats', icon: '💻', color: '#00ff88', active: false },
  { id: 'cables', label: 'Undersea Cables', icon: '🔌', color: '#aa88ff', active: false },
  { id: 'weather', label: 'Weather Alerts', icon: '⛈️', color: '#aaccff', active: false },
  { id: 'routes', label: 'Trade Routes', icon: '🗺️', color: '#88ffcc', active: false },
];

const REGION_PRESETS = [
  { id: 'global', label: 'Global', icon: '🌐' },
  { id: 'mena', label: 'MENA', icon: '🌍' },
  { id: 'europe', label: 'Europe', icon: '🇪🇺' },
  { id: 'asia', label: 'Asia', icon: '🌏' },
  { id: 'americas', label: 'Americas', icon: '🌎' },
];

function WorldMonitorLayoutInner({ children, signals, activeLayers, onLayerToggle }: WorldMonitorLayoutProps) {
  const [layers, setLayers] = useState<LayerConfig[]>(SIDEBAR_LAYERS);
  const { mapView: view, setMapView: setView } = useMapView();

  const toggleLayer = (id: string) => {
    setLayers(prev => prev.map(l => l.id === id ? { ...l, active: !l.active } : l));
    onLayerToggle(id);
  };

  const activeCount = layers.filter(l => l.active).length;

  return (
    <div className="flex flex-col h-full w-full bg-void overflow-hidden">
      {/* Main content area — sub-nav removed per issue #44 */}
      <div className="flex flex-1 overflow-hidden">
        {/* Main dashboard content */}
        <div className="flex-1 overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );
}

export default function WorldMonitorLayout(props: WorldMonitorLayoutProps) {
  return (
    <MapViewProvider>
      <WorldMonitorLayoutInner {...props} />
    </MapViewProvider>
  );
}
