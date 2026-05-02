'use client';

import { useState } from 'react';

const LAYERS = [
  { id: 'exchanges', label: 'STOCK EXCHANGES', color: 'bg-yellow-400' },
  { id: 'centers', label: 'FINANCIAL CENTERS', color: 'bg-teal-400' },
  { id: 'economic', label: 'ECONOMIC CENTERS', color: 'bg-green-400' },
  { id: 'banks', label: 'CENTRAL BANKS', color: 'bg-orange-400' },
  { id: 'hubs', label: 'COMMODITY HUBS', color: 'bg-amber-400' },
  { id: 'gcc', label: 'GCC INVESTMENTS', color: 'bg-emerald-400' },
  { id: 'routes', label: 'TRADE ROUTES', color: 'bg-cyan-400' },
  { id: 'cables', label: 'UNDERSEA CABLES', color: 'bg-blue-400' },
  { id: 'pipelines', label: 'PIPELINES', color: 'bg-sky-400' },
  { id: 'internet', label: 'INTERNET DISRUPTIONS', color: 'bg-red-400' },
  { id: 'weather', label: 'WEATHER ALERTS', color: 'bg-purple-400' },
  { id: 'sanctions', label: 'SANCTIONS', color: 'bg-rose-400' },
  { id: 'cyber', label: 'CYBER THREATS', color: 'bg-fuchsia-400' },
  { id: 'resilience', label: 'RESILIENCE INDEX', color: 'bg-lime-400' },
  { id: 'natural', label: 'NATURAL EVENTS', color: 'bg-orange-500' },
  { id: 'daynight', label: 'DAY / NIGHT', color: 'bg-indigo-400' },
];

interface LayerTogglePanelProps {
  activeLayers: string[];
  onToggle: (id: string) => void;
}

export default function LayerTogglePanel({ activeLayers, onToggle }: LayerTogglePanelProps) {
  return (
    <div className="border border-white/[0.08] bg-[#0f0f14]">
      <div className="px-3 py-2 border-b border-white/[0.08] flex items-center gap-2">
        <div className="w-1 h-3 bg-accent-green rounded-full" />
        <span className="text-[10px] font-mono font-bold text-white/80 tracking-wider">GLOBAL SITUATION</span>
      </div>
      <div className="p-2 space-y-1">
        {LAYERS.map((layer) => {
          const active = activeLayers.includes(layer.id);
          return (
            <button
              key={layer.id}
              onClick={() => onToggle(layer.id)}
              className={`w-full flex items-center gap-2 px-2 py-1.5 rounded transition-colors ${
                active ? 'bg-white/5' : 'hover:bg-white/[0.03]'
              }`}
            >
              <div className={`w-2 h-2 rounded-full ${layer.color} ${active ? 'opacity-100' : 'opacity-30'}`} />
              <span className={`text-[10px] font-mono ${active ? 'text-white/90' : 'text-white/40'}`}>
                {layer.label}
              </span>
              <div className={`ml-auto w-3 h-3 rounded-sm border ${active ? 'bg-accent-green border-accent-green' : 'border-white/20'}`}>
                {active && (
                  <svg className="w-3 h-3 text-black" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
