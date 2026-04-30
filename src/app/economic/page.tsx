'use client';

import { useState } from 'react';
import Link from 'next/link';
import EconomicDashboard from '@/components/economic/EconomicDashboard';

export default function EconomicPage() {
  return (
    <div className="h-screen flex flex-col bg-void overflow-hidden">
      {/* Header */}
      <header className="bg-elevated border-b border-border-default px-4 py-2 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-accent-green/30 to-accent-blue/20 flex items-center justify-center border border-accent-green/30">
            <span className="text-accent-green text-xl">🌐</span>
          </div>
          <div>
            <h1 className="font-mono text-sm font-bold tracking-wider text-accent-green flex items-center gap-2">
              GLOBENEWS
              <span className="px-1.5 py-0.5 bg-accent-blue/20 text-[8px] rounded border border-accent-blue/30 text-accent-blue">ECONOMIC</span>
            </h1>
            <p className="text-[9px] text-text-muted">Real-time economic intelligence & indicators</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="px-3 py-1 rounded text-[10px] font-mono text-text-dim hover:text-white hover:bg-white/5 transition-colors"
          >
            🌐 DASHBOARD
          </Link>
          <Link
            href="/financial"
            className="px-3 py-1 rounded text-[10px] font-mono text-text-dim hover:text-white hover:bg-white/5 transition-colors"
          >
            💰 FINANCE
          </Link>
          <Link
            href="/economic"
            className="px-3 py-1 rounded text-[10px] font-mono text-text-dim hover:text-white hover:bg-white/5 transition-colors"
          >
            📈 ECONOMIC
          </Link>
          <Link
            href="/pro"
            className="px-3 py-1 rounded text-[10px] font-mono text-text-dim hover:text-white hover:bg-white/5 transition-colors"
          >
            📊 PRO
          </Link>
        </div>
      </header>

      {/* Economic Dashboard Content */}
      <main className="flex-1 overflow-hidden">
        <EconomicDashboard />
      </main>
    </div>
  );
}
