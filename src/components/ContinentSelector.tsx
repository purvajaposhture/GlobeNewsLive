'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { latLonToVec3 } from './Globe3D';
import * as THREE from 'three';

export interface ContinentSelectorProps {
  onSelect: (target: { lat: number; lon: number; zoom: number }) => void;
}

const CONTINENTS = [
  { name: 'GLOBAL', lat: 0.0, lon: 0.0, zoom: 2.8 },
  { name: 'AFRICA', lat: 0.0, lon: 20.0, zoom: 2.4 },
  { name: 'AMERICAS', lat: 15.0, lon: -90.0, zoom: 2.6 },
  { name: 'ASIA', lat: 35.0, lon: 90.0, zoom: 2.3 },
  { name: 'EUROPE', lat: 52.0, lon: 15.0, zoom: 2.8 },
  { name: 'MIDDLE EAST', lat: 27.0, lon: 45.0, zoom: 2.5 },
  { name: 'OCEANIA', lat: -25.0, lon: 135.0, zoom: 2.6 },
];

export default function ContinentSelector({ onSelect }: ContinentSelectorProps) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(CONTINENTS[0]);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSelect = (c: typeof CONTINENTS[0]) => {
    setSelected(c);
    setOpen(false);
    onSelect({ lat: c.lat, lon: c.lon, zoom: c.zoom });
  };

  return (
    <div ref={ref} className="relative z-30">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg
          bg-bg-panel border border-border-dim
          text-[11px] font-mono uppercase tracking-wider text-text-primary
          hover:border-accent-cyan/40 transition-all"
      >
        <span>{selected.name}</span>
        <ChevronDown size={12} className={`text-text-muted transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1 w-44 rounded-lg border border-border-dim bg-bg-panel shadow-xl overflow-hidden animate-slide-in">
          {CONTINENTS.map((c) => (
            <button
              key={c.name}
              onClick={() => handleSelect(c)}
              className={`w-full text-left px-3 py-2 text-[11px] font-mono uppercase tracking-wider transition-all
                ${selected.name === c.name
                  ? 'bg-accent-cyan/10 text-accent-cyan'
                  : 'text-text-muted hover:bg-accent-cyan/5 hover:text-text-primary'
                }
              `}
            >
              {c.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// Manual lerp animation for camera
export function animateCameraTo(
  camera: { position: THREE.Vector3; lookAt: (x: number, y: number, z: number) => void },
  target: { lat: number; lon: number; zoom: number },
  duration = 1200
) {
  const targetPos = latLonToVec3(target.lat, target.lon, target.zoom);
  const startPos = camera.position.clone();
  const startTime = performance.now();

  const easeInOutCubic = (t: number) =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

  const tick = (now: number) => {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = easeInOutCubic(progress);

    camera.position.lerpVectors(startPos, targetPos, eased);
    camera.lookAt(0, 0, 0);

    if (progress < 1) {
      requestAnimationFrame(tick);
    }
  };

  requestAnimationFrame(tick);
}
