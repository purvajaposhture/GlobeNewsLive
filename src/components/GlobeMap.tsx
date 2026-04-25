'use client';

import { useEffect, useRef, useState, forwardRef, useImperativeHandle, useCallback } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import {
  ACTIVE_CONFLICTS,
  STRATEGIC_CHOKEPOINTS,
  MILITARY_BASES,
} from '@/lib/feeds';
import {
  NUCLEAR_SITES,
  SPACEPORTS,
  AI_DATA_CENTERS,
  IRAN_TARGETS,
  UNDERSEA_CABLES,
  PIPELINES,
} from '@/lib/infrastructure';
import type { Signal, MissileEvent } from '@/types';

// ─── Types ───
export interface GlobeMapRef {
  zoomIn: () => void;
  zoomOut: () => void;
  flyTo: (target: { lat: number; lon: number; zoom?: number }) => void;
  getMap: () => maplibregl.Map | null;
}

interface GlobeMapProps {
  view?: string;
  gridVisible?: boolean;
  wireframe?: boolean;
  activeLayers?: string[];
  onLayerToggle?: (layer: string) => void;
  signals?: Signal[];
}

// ─── Theater Views ───
const THEATER_VIEWS: Record<string, { center: [number, number]; zoom: number }> = {
  global:   { center: [0, 20], zoom: 1.8 },
  ukraine:  { center: [37.5, 48.5], zoom: 5 },
  middleeast: { center: [45, 30], zoom: 4.5 },
  asia:     { center: [115, 25], zoom: 3.5 },
  africa:   { center: [20, 5], zoom: 3 },
  americas: { center: [-90, 15], zoom: 2.5 },
  europe:   { center: [15, 52], zoom: 4 },
};

// ─── Layer Registry ───
const LAYERS = [
  { id: 'conflicts',   name: 'Conflicts',   icon: '⚔️', color: '#ff2244', default: true },
  { id: 'bases',       name: 'Bases',       icon: '🎖️', color: '#ff6633', default: true },
  { id: 'hotspots',    name: 'Hotspots',    icon: '🔥', color: '#ffaa00', default: true },
  { id: 'nuclear',     name: 'Nuclear',     icon: '☢️', color: '#ff4444', default: true },
  { id: 'iran',        name: 'Iran',        icon: '🎯', color: '#ff0000', default: false },
  { id: 'spaceports',  name: 'Space',       icon: '🚀', color: '#8844ff', default: false },
  { id: 'cables',      name: 'Cables',      icon: '🔌', color: '#00aaff', default: false },
  { id: 'pipelines',   name: 'Pipes',       icon: '🛢️', color: '#ff8800', default: false },
  { id: 'ai-centers',  name: 'AI',          icon: '🖥️', color: '#00ff88', default: false },
  { id: 'chokepoints', name: 'Choke',       icon: '⚓', color: '#ffaa00', default: true },
  { id: 'earthquakes', name: 'Quakes',      icon: '🌍', color: '#aa66ff', default: false },
];

// ─── Marker HTML generators ───
function conflictMarker(color: string) {
  return `<div style="position:relative;width:16px;height:16px;">
    <div style="position:absolute;inset:0;border-radius:50%;background:${color};animation:markerPulse 2s ease-in-out infinite;"></div>
    <div style="position:absolute;inset:-4px;border-radius:50%;border:1px solid ${color};animation:markerPulseRing 2s ease-out infinite;"></div>
  </div>`;
}

function baseMarker(color: string) {
  return `<div style="width:10px;height:10px;border-radius:50%;background:${color};border:2px solid rgba(255,255,255,0.8);box-shadow:0 0 6px ${color};"></div>`;
}

function nuclearMarker() {
  return `<div style="width:14px;height:14px;border-radius:50%;background:#ff4444;border:2px solid #fff;box-shadow:0 0 8px #ff4444,0 0 16px #ff444480;display:flex;align-items:center;justify-content:center;font-size:8px;color:#fff;">☢</div>`;
}

function hotspotMarker(intensity: string) {
  const c = intensity === 'high' ? '#ff2244' : '#ffaa00';
  return `<div style="position:relative;width:20px;height:20px;">
    <div style="position:absolute;inset:2px;border-radius:50%;background:${c};opacity:0.9;"></div>
    <div style="position:absolute;inset:0;border-radius:50%;border:2px solid ${c};animation:markerPulseRing 1.5s ease-out infinite;"></div>
  </div>`;
}

function chokepointMarker() {
  return `<div style="width:12px;height:12px;transform:rotate(45deg);background:#ffaa00;border:1px solid #fff;box-shadow:0 0 6px #ffaa00;"></div>`;
}

// ─── Component ───
const GlobeMap = forwardRef<GlobeMapRef, GlobeMapProps>(function GlobeMap(
  { view = 'global', gridVisible = true, wireframe = false, activeLayers: externalLayers, onLayerToggle, signals = [] },
  ref
) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [layerPanelOpen, setLayerPanelOpen] = useState(false);
  const [internalLayers, setInternalLayers] = useState<string[]>(
    LAYERS.filter(l => l.default).map(l => l.id)
  );
  const [liveMissiles, setLiveMissiles] = useState<MissileEvent[]>([]);
  const [liveSource, setLiveSource] = useState<string>('SYNTHETIC');
  const markersRef = useRef<maplibregl.Marker[]>([]);
  const liveMarkersRef = useRef<maplibregl.Marker[]>([]);

  const activeLayers = externalLayers ?? internalLayers;
  const toggleLayer = useCallback((id: string) => {
    if (onLayerToggle) { onLayerToggle(id); return; }
    setInternalLayers(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  }, [onLayerToggle]);

  // Expose ref methods
  useImperativeHandle(ref, () => ({
    zoomIn: () => mapRef.current?.zoomIn(),
    zoomOut: () => mapRef.current?.zoomOut(),
    flyTo: (target) => {
      if (!mapRef.current) return;
      mapRef.current.flyTo({
        center: [target.lon, target.lat],
        zoom: target.zoom ?? 4,
        duration: 1500,
        essential: true,
      });
    },
    getMap: () => mapRef.current,
  }), []);

  // Fetch live missile events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch('/api/missile-events');
        if (!res.ok) return;
        const data = await res.json();
        if (data.events) {
          setLiveMissiles(data.events);
          setLiveSource(data.meta?.source || 'SYNTHETIC');
        }
      } catch (e) {
        // silent fail
      }
    };
    fetchEvents();
    const interval = setInterval(fetchEvents, 60000);
    return () => clearInterval(interval);
  }, []);

  // Initialize map
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
      center: [0, 20],
      zoom: 1.8,
      minZoom: 1.2,
      maxZoom: 12,
      projection: { type: 'globe' },
      attributionControl: false,
    } as any);

    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right');
    map.addControl(new maplibregl.AttributionControl({ compact: true }), 'bottom-right');

    map.on('load', () => {
      setLoaded(true);
      // Atmosphere glow via custom layer could go here, but CSS handles most
    });

    mapRef.current = map;

    return () => {
      markersRef.current.forEach(m => m.remove());
      markersRef.current = [];
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Fly to theater when view changes
  useEffect(() => {
    if (!mapRef.current || !loaded) return;
    const tv = THEATER_VIEWS[view] || THEATER_VIEWS.global;
    mapRef.current.flyTo({
      center: tv.center,
      zoom: tv.zoom,
      duration: 1800,
      essential: true,
    });
  }, [view, loaded]);

  // Update markers when layers change
  useEffect(() => {
    if (!mapRef.current || !loaded) return;

    // Clear old markers
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    const map = mapRef.current;

    // ─── Conflicts ───
    if (activeLayers.includes('conflicts')) {
      ACTIVE_CONFLICTS.forEach(c => {
        const el = document.createElement('div');
        el.innerHTML = conflictMarker(c.intensity === 'high' ? '#ff2244' : '#ffaa00');
        const m = new maplibregl.Marker({ element: el })
          .setLngLat([c.lon, c.lat])
          .setPopup(new maplibregl.Popup({ offset: 12 }).setHTML(
            `<div style="font-family:var(--font-mono),monospace;font-size:11px;color:#fff;">
              <div style="font-weight:bold;color:#ff2244;margin-bottom:4px;">${c.name}</div>
              <div>Type: ${c.type}</div>
              <div>Intensity: <span style="color:${c.intensity==='high'?'#ff2244':'#ffaa00'}">${c.intensity.toUpperCase()}</span></div>
            </div>`
          ))
          .addTo(map);
        markersRef.current.push(m);
      });
    }

    // ─── Military Bases ───
    if (activeLayers.includes('bases')) {
      MILITARY_BASES.forEach(b => {
        const el = document.createElement('div');
        el.innerHTML = baseMarker('#ff6633');
        const m = new maplibregl.Marker({ element: el })
          .setLngLat([b.lon, b.lat])
          .setPopup(new maplibregl.Popup({ offset: 10 }).setHTML(
            `<div style="font-family:var(--font-mono),monospace;font-size:11px;color:#fff;">
              <div style="font-weight:bold;color:#ff6633;margin-bottom:4px;">${b.name}</div>
              <div>Operator: ${b.op}</div>
              <div>Type: ${b.type}</div>
            </div>`
          ))
          .addTo(map);
        markersRef.current.push(m);
      });
    }

    // ─── Hotspots (same as conflicts but distinct layer) ───
    if (activeLayers.includes('hotspots')) {
      ACTIVE_CONFLICTS.filter(c => c.intensity === 'high').forEach(c => {
        const el = document.createElement('div');
        el.innerHTML = hotspotMarker(c.intensity);
        const m = new maplibregl.Marker({ element: el })
          .setLngLat([c.lon, c.lat])
          .addTo(map);
        markersRef.current.push(m);
      });
    }

    // ─── Nuclear Sites ───
    if (activeLayers.includes('nuclear')) {
      NUCLEAR_SITES.forEach(s => {
        const el = document.createElement('div');
        el.innerHTML = nuclearMarker();
        const m = new maplibregl.Marker({ element: el })
          .setLngLat([s.lon, s.lat])
          .setPopup(new maplibregl.Popup({ offset: 10 }).setHTML(
            `<div style="font-family:var(--font-mono),monospace;font-size:11px;color:#fff;">
              <div style="font-weight:bold;color:#ff4444;margin-bottom:4px;">☢ ${s.name}</div>
              <div>Country: ${s.country}</div>
              <div>Type: ${s.type}</div>
              ${s.risk ? `<div>Risk: <span style="color:#ff4444">${s.risk.toUpperCase()}</span></div>` : ''}
              ${s.description ? `<div style="margin-top:4px;opacity:0.8;font-size:10px;">${s.description}</div>` : ''}
            </div>`
          ))
          .addTo(map);
        markersRef.current.push(m);
      });
    }

    // ─── Iran Targets ───
    if (activeLayers.includes('iran')) {
      IRAN_TARGETS.forEach(t => {
        const el = document.createElement('div');
        el.innerHTML = `<div style="width:12px;height:12px;border-radius:50%;background:#ff0000;border:2px solid #fff;box-shadow:0 0 8px #ff0000;"></div>`;
        const m = new maplibregl.Marker({ element: el })
          .setLngLat([t.lon, t.lat])
          .setPopup(new maplibregl.Popup({ offset: 10 }).setHTML(
            `<div style="font-family:var(--font-mono),monospace;font-size:11px;color:#fff;">
              <div style="font-weight:bold;color:#ff0000;margin-bottom:4px;">🎯 ${t.name}</div>
              <div>Type: ${t.type}</div>
              ${t.risk ? `<div>Risk: <span style="color:#ff4444">${t.risk.toUpperCase()}</span></div>` : ''}
            </div>`
          ))
          .addTo(map);
        markersRef.current.push(m);
      });
    }

    // ─── Spaceports ───
    if (activeLayers.includes('spaceports')) {
      SPACEPORTS.forEach(s => {
        const el = document.createElement('div');
        el.innerHTML = `<div style="width:10px;height:10px;border-radius:2px;background:#8844ff;border:1px solid #fff;box-shadow:0 0 6px #8844ff;"></div>`;
        const m = new maplibregl.Marker({ element: el })
          .setLngLat([s.lon, s.lat])
          .setPopup(new maplibregl.Popup({ offset: 10 }).setHTML(
            `<div style="font-family:var(--font-mono),monospace;font-size:11px;color:#fff;">
              <div style="font-weight:bold;color:#8844ff;margin-bottom:4px;">🚀 ${s.name}</div>
              <div>Country: ${s.country}</div>
              <div>Type: ${s.type}</div>
            </div>`
          ))
          .addTo(map);
        markersRef.current.push(m);
      });
    }

    // ─── AI Data Centers ───
    if (activeLayers.includes('ai-centers')) {
      AI_DATA_CENTERS.forEach(d => {
        const el = document.createElement('div');
        el.innerHTML = `<div style="width:9px;height:9px;border-radius:1px;background:#00ff88;border:1px solid #fff;box-shadow:0 0 6px #00ff88;"></div>`;
        const m = new maplibregl.Marker({ element: el })
          .setLngLat([d.lon, d.lat])
          .setPopup(new maplibregl.Popup({ offset: 10 }).setHTML(
            `<div style="font-family:var(--font-mono),monospace;font-size:11px;color:#fff;">
              <div style="font-weight:bold;color:#00ff88;margin-bottom:4px;">🖥 ${d.name}</div>
              <div>Country: ${d.country}</div>
              <div>Type: ${d.type}</div>
            </div>`
          ))
          .addTo(map);
        markersRef.current.push(m);
      });
    }

    // ─── Chokepoints ───
    if (activeLayers.includes('chokepoints')) {
      STRATEGIC_CHOKEPOINTS.forEach(c => {
        const el = document.createElement('div');
        el.innerHTML = chokepointMarker();
        const m = new maplibregl.Marker({ element: el })
          .setLngLat([c.lon, c.lat])
          .setPopup(new maplibregl.Popup({ offset: 10 }).setHTML(
            `<div style="font-family:var(--font-mono),monospace;font-size:11px;color:#fff;">
              <div style="font-weight:bold;color:#ffaa00;margin-bottom:4px;">⚓ ${c.name}</div>
              <div>Risk: <span style="color:${c.risk==='high'?'#ff2244':'#ffaa00'}">${c.risk.toUpperCase()}</span></div>
              ${c.oilMbpd ? `<div>Oil: ${c.oilMbpd} Mbpd</div>` : ''}
              ${c.tradePct ? `<div>Trade: ${c.tradePct}%</div>` : ''}
            </div>`
          ))
          .addTo(map);
        markersRef.current.push(m);
      });
    }

    // ─── Undersea Cables (lines) ───
    if (activeLayers.includes('cables')) {
      UNDERSEA_CABLES.forEach(cable => {
        // Simplify: add markers at endpoints
        cable.points.forEach((pt, i) => {
          if (i === 0 || i === cable.points.length - 1) {
            const el = document.createElement('div');
            el.innerHTML = `<div style="width:6px;height:6px;border-radius:50%;background:#00aaff;border:1px solid #fff;"></div>`;
            const m = new maplibregl.Marker({ element: el })
              .setLngLat([pt[1], pt[0]])
              .setPopup(new maplibregl.Popup({ offset: 8 }).setHTML(
                `<div style="font-family:var(--font-mono),monospace;font-size:10px;color:#fff;">
                  <div style="font-weight:bold;color:#00aaff;">${cable.name}</div>
                  <div>${cable.capacity}</div>
                </div>`
              ))
              .addTo(map);
            markersRef.current.push(m);
          }
        });
      });
    }

    // ─── Pipelines (markers at key points) ───
    if (activeLayers.includes('pipelines')) {
      PIPELINES.forEach(pipe => {
        pipe.points.forEach((pt, i) => {
          if (i === 0 || i === Math.floor(pipe.points.length / 2) || i === pipe.points.length - 1) {
            const el = document.createElement('div');
            el.innerHTML = `<div style="width:6px;height:6px;border-radius:50%;background:#ff8800;border:1px solid #fff;"></div>`;
            const m = new maplibregl.Marker({ element: el })
              .setLngLat([pt[1], pt[0]])
              .setPopup(new maplibregl.Popup({ offset: 8 }).setHTML(
                `<div style="font-family:var(--font-mono),monospace;font-size:10px;color:#fff;">
                  <div style="font-weight:bold;color:#ff8800;">${pipe.name}</div>
                  <div>Status: ${pipe.status}</div>
                </div>`
              ))
              .addTo(map);
            markersRef.current.push(m);
          }
        });
      });
    }

  }, [activeLayers, loaded]);

  // Render live data markers (missiles + signals)
  useEffect(() => {
    if (!mapRef.current || !loaded) return;

    // Clear old live markers
    liveMarkersRef.current.forEach(m => m.remove());
    liveMarkersRef.current = [];

    const map = mapRef.current;

    // ─── Live Missiles ───
    liveMissiles.forEach(m => {
      // Origin marker (pulsing)
      const originEl = document.createElement('div');
      originEl.innerHTML = `<div style="position:relative;width:14px;height:14px;">
        <div style="position:absolute;inset:0;border-radius:50%;background:#ff2244;animation:markerPulse 1.5s ease-in-out infinite;"></div>
        <div style="position:absolute;inset:-3px;border-radius:50%;border:1.5px solid #ff2244;animation:markerPulseRing 1.5s ease-out infinite;"></div>
      </div>`;
      const originMarker = new maplibregl.Marker({ element: originEl })
        .setLngLat([m.origin[1], m.origin[0]])
        .setPopup(new maplibregl.Popup({ offset: 10 }).setHTML(
          `<div style="font-family:var(--font-mono),monospace;font-size:11px;color:#fff;max-width:200px;">
            <div style="font-weight:bold;color:#ff2244;margin-bottom:4px;">🚀 ${m.type}</div>
            <div>Status: <span style="color:${m.status==='active'?'#ff2244':m.status==='intercepted'?'#00ff88':'#ffaa00'}">${m.status.toUpperCase()}</span></div>
            <div>Speed: ${m.speed.toLocaleString()} km/h</div>
            <div>Alt: ${m.altitude} km</div>
            <div>Conf: ${m.confidence}%</div>
            <div style="margin-top:4px;opacity:0.7;font-size:10px;">${m.label}</div>
          </div>`
        ))
        .addTo(map);
      liveMarkersRef.current.push(originMarker);

      // Target marker
      const targetEl = document.createElement('div');
      targetEl.innerHTML = `<div style="width:8px;height:8px;border-radius:50%;background:${m.status==='intercepted'?'#00ff88':m.status==='impact'?'#ffaa00':'#ff2244'};border:1.5px solid #fff;box-shadow:0 0 6px ${m.status==='intercepted'?'#00ff88':m.status==='impact'?'#ffaa00':'#ff2244'};"></div>`;
      const targetMarker = new maplibregl.Marker({ element: targetEl })
        .setLngLat([m.target[1], m.target[0]])
        .setPopup(new maplibregl.Popup({ offset: 8 }).setHTML(
          `<div style="font-family:var(--font-mono),monospace;font-size:11px;color:#fff;">
            <div style="font-weight:bold;color:#ff2244;margin-bottom:4px;">🎯 Target</div>
            <div>Lat: ${m.target[0].toFixed(2)}</div>
            <div>Lon: ${m.target[1].toFixed(2)}</div>
            <div>Status: ${m.status.toUpperCase()}</div>
          </div>`
        ))
        .addTo(map);
      liveMarkersRef.current.push(targetMarker);
    });

    // ─── Signals with coordinates ───
    signals.filter(s => s.lat != null && s.lon != null).forEach(s => {
      const color = s.severity === 'CRITICAL' ? '#ff2244' : s.severity === 'HIGH' ? '#ffaa00' : '#00aaff';
      const el = document.createElement('div');
      el.innerHTML = `<div style="width:10px;height:10px;border-radius:50%;background:${color};border:1.5px solid #fff;box-shadow:0 0 6px ${color};"></div>`;
      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([s.lon!, s.lat!])
        .setPopup(new maplibregl.Popup({ offset: 8 }).setHTML(
          `<div style="font-family:var(--font-mono),monospace;font-size:11px;color:#fff;max-width:220px;">
            <div style="font-weight:bold;color:${color};margin-bottom:4px;">${s.severity}</div>
            <div style="font-size:10px;margin-bottom:4px;">${s.title}</div>
            <div style="opacity:0.7;font-size:10px;">${s.source} • ${s.timeAgo}</div>
            ${s.summary ? `<div style="margin-top:4px;opacity:0.8;font-size:10px;">${s.summary.substring(0, 120)}...</div>` : ''}
          </div>`
        ))
        .addTo(map);
      liveMarkersRef.current.push(marker);
    });
  }, [liveMissiles, signals, loaded]);

  return (
    <div className="relative w-full h-full">
      <div ref={containerRef} className="w-full h-full" style={{ background: '#02040a' }} />

      {/* Atmosphere glow overlay */}
      <div className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 50%, transparent 40%, rgba(2,4,10,0.6) 70%, rgba(2,4,10,0.95) 100%)',
          zIndex: 1,
        }}
      />

      {/* Loading */}
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#02040a] z-10">
          <div className="text-center">
            <div className="text-2xl animate-pulse mb-2">🌍</div>
            <div className="text-[10px] text-text-muted font-mono">Initializing globe...</div>
          </div>
        </div>
      )}

      {/* Layer Toggle Panel */}
      <div className="absolute top-3 left-3 z-20">
        <button
          onClick={() => setLayerPanelOpen(!layerPanelOpen)}
          className="px-3 py-1.5 rounded-lg bg-bg-panel/80 backdrop-blur border border-border-dim
            text-[11px] font-mono text-text-primary hover:border-accent-cyan/40 transition-all"
        >
          🗂️ Layers {activeLayers.length > 0 && <span className="text-accent-cyan ml-1">({activeLayers.length})</span>}
        </button>

        {layerPanelOpen && (
          <div className="absolute top-full left-0 mt-1 w-48 rounded-lg border border-border-dim bg-bg-panel/95 backdrop-blur shadow-xl overflow-hidden animate-slide-in">
            {LAYERS.map(l => (
              <button
                key={l.id}
                onClick={() => toggleLayer(l.id)}
                className={`w-full flex items-center gap-2 px-3 py-2 text-[11px] font-mono transition-all
                  ${activeLayers.includes(l.id)
                    ? 'bg-accent-cyan/10 text-accent-cyan'
                    : 'text-text-muted hover:bg-white/5 hover:text-text-primary'
                  }
                `}
              >
                <span style={{ color: l.color }}>{l.icon}</span>
                <span>{l.name}</span>
                {activeLayers.includes(l.id) && <span className="ml-auto text-accent-cyan">●</span>}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Grid toggle indicator */}
      {gridVisible && loaded && (
        <div className="absolute bottom-3 left-3 z-10 px-2 py-1 rounded bg-bg-panel/60 backdrop-blur border border-border-dim">
          <span className="text-[9px] font-mono text-text-muted">Globe Projection</span>
        </div>
      )}

      {/* Live data source indicator */}
      {loaded && (
        <div className="absolute bottom-3 right-3 z-10 px-2 py-1 rounded bg-bg-panel/60 backdrop-blur border border-border-dim flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 bg-accent-green rounded-full animate-pulse" />
          <span className="text-[9px] font-mono text-text-muted">LIVE • {liveSource} • {liveMissiles.length} events</span>
        </div>
      )}
    </div>
  );
});

export default GlobeMap;
