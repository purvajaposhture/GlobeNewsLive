export const VOID_SPECTRUM = {
  LOW: {
    label: 'Healthy',
    bgGlow: 'cool blue',
    accent: '#00ff9d',
    bgClass: 'bg-[#00ff9d]/10',
    borderClass: 'border-[#00ff9d]/30',
    textClass: 'text-[#00ff9d]',
    glowClass: 'shadow-[0_0_20px_rgba(0,255,157,0.15)]',
  },
  GUARDED: {
    label: 'Mixed Signals',
    bgGlow: 'neutral cyan',
    accent: '#00d4ff',
    bgClass: 'bg-[#00d4ff]/10',
    borderClass: 'border-[#00d4ff]/30',
    textClass: 'text-[#00d4ff]',
    glowClass: 'shadow-[0_0_20px_rgba(0,212,255,0.15)]',
  },
  ELEVATED: {
    label: 'Emerging Risks',
    bgGlow: 'warm amber',
    accent: '#f0c000',
    bgClass: 'bg-[#f0c000]/10',
    borderClass: 'border-[#f0c000]/30',
    textClass: 'text-[#f0c000]',
    glowClass: 'shadow-[0_0_20px_rgba(240,192,0,0.15)]',
  },
  HIGH: {
    label: 'Active Stress',
    bgGlow: 'orange haze',
    accent: '#ff9500',
    bgClass: 'bg-[#ff9500]/10',
    borderClass: 'border-[#ff9500]/30',
    textClass: 'text-[#ff9500]',
    glowClass: 'shadow-[0_0_20px_rgba(255,149,0,0.15)]',
  },
  SEVERE: {
    label: 'Economic Crisis',
    bgGlow: 'deep red wash',
    accent: '#ff1a1a',
    bgClass: 'bg-[#ff1a1a]/10',
    borderClass: 'border-[#ff1a1a]/30',
    textClass: 'text-[#ff1a1a]',
    glowClass: 'shadow-[0_0_20px_rgba(255,26,26,0.2)]',
  },
} as const;

export type ThreatLevel = keyof typeof VOID_SPECTRUM;

export function getThreatLevelFromScore(score: number): ThreatLevel {
  if (score >= 80) return 'LOW';
  if (score >= 60) return 'GUARDED';
  if (score >= 40) return 'ELEVATED';
  if (score >= 20) return 'HIGH';
  return 'SEVERE';
}

export function getThreatLevelFromCanaries(deadCount: number): ThreatLevel {
  if (deadCount === 0) return 'LOW';
  if (deadCount === 1) return 'GUARDED';
  if (deadCount === 2) return 'ELEVATED';
  if (deadCount === 3) return 'HIGH';
  return 'SEVERE';
}
