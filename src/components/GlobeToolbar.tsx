'use client';

import { useState } from 'react';
import { ZoomIn, ZoomOut, Grid2x2, Image } from 'lucide-react';

export interface GlobeToolbarProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onToggleGrid: () => void;
  onToggleMedia: () => void;
  gridActive: boolean;
  mediaActive: boolean;
}

export function useGlobeControls() {
  const [gridVisible, setGridVisible] = useState(true);
  const [wireframe, setWireframe] = useState(false);

  return {
    gridVisible,
    wireframe,
    toggleGrid: () => setGridVisible((v) => !v),
    toggleMedia: () => setWireframe((v) => !v),
  };
}

export default function GlobeToolbar({
  onZoomIn,
  onZoomOut,
  onToggleGrid,
  onToggleMedia,
  gridActive,
  mediaActive,
}: GlobeToolbarProps) {
  return (
    <div className="absolute right-4 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-2">
      <ToolbarButton
        icon={<ZoomIn size={16} />}
        onClick={onZoomIn}
        label="Zoom In"
      />
      <ToolbarButton
        icon={<ZoomOut size={16} />}
        onClick={onZoomOut}
        label="Zoom Out"
      />
      <ToolbarButton
        icon={<Grid2x2 size={16} />}
        onClick={onToggleGrid}
        label="Toggle Grid"
        active={gridActive}
      />
      <ToolbarButton
        icon={<Image size={16} />}
        onClick={onToggleMedia}
        label="Toggle Media"
        active={mediaActive}
      />
    </div>
  );
}

function ToolbarButton({
  icon,
  onClick,
  label,
  active,
}: {
  icon: React.ReactNode;
  onClick: () => void;
  label: string;
  active?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      title={label}
      className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200
        bg-bg-panel/80 backdrop-blur-sm border border-border-dim
        hover:shadow-[0_0_8px_rgba(0,229,255,0.4)] hover:border-accent-cyan/50
        ${active ? 'text-accent-cyan border-accent-cyan/40' : 'text-text-muted hover:text-accent-cyan'}
      `}
    >
      {icon}
    </button>
  );
}
