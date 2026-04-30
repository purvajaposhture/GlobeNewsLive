'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell
} from 'recharts';
import { TrendingUp, TrendingDown, AlertTriangle, Activity, Globe, DollarSign, BarChart3, Newspaper } from 'lucide-react';
import { VOID_SPECTRUM, getThreatLevelFromCanaries, type ThreatLevel } from '@/lib/economic-theme';

// ─── Types ─────────────────────────────────────────────────────────

interface Indicator {
  name: string;
  value: number;
  unit: string;
  change: number;
  history: { t: string; v: number }[];
}

interface Canary {
  id: number;
  name: string;
  triggered: boolean;
  description: string;
}

interface NewsTether {
  headline: string;
  impact: 'High' | 'Medium' | 'Low';
  time: string;
  source: string;
}

// ─── Mock Data ─────────────────────────────────────────────────────

const RADAR_DATA = [
  { axis: 'GDP Growth', A: 85, fullMark: 100 },
  { axis: 'Employment', A: 72, fullMark: 100 },
  { axis: 'Inflation Ctrl', A: 60, fullMark: 100 },
  { axis: 'Trade Balance', A: 45, fullMark: 100 },
  { axis: 'Debt Sustain', A: 55, fullMark: 100 },
  { axis: 'Currency Health', A: 70, fullMark: 100 },
];

const GDP_PULSE = [
  { t: 'Q1', v: 2.1 }, { t: 'Q2', v: 2.4 }, { t: 'Q3', v: 2.8 },
  { t: 'Q4', v: 2.5 }, { t: 'Q1', v: 2.9 }, { t: 'Q2', v: 3.1 },
];

const CANARIES: Canary[] = [
  { id: 1, name: 'Currency Depreciation', triggered: false, description: '>15% in 30 days' },
  { id: 2, name: 'Sovereign Bond Spread', triggered: false, description: '>500bps vs US Treasuries' },
  { id: 3, name: 'Inflation Spike', triggered: true, description: '>2 std dev from 5-year mean' },
  { id: 4, name: 'Reserve Drop', triggered: false, description: '>20% in 90 days' },
  { id: 5, name: 'Stock Crash', triggered: false, description: '>30% from peak' },
  { id: 6, name: 'Credit Downgrade', triggered: true, description: 'Within 6 months' },
  { id: 7, name: 'IMF Program', triggered: false, description: 'Activation or request' },
];

const NEWS_TETHERS: NewsTether[] = [
  { headline: 'Fed signals slower rate cuts amid sticky inflation', impact: 'High', time: '2m ago', source: 'Bloomberg' },
  { headline: 'ECB holds rates as Eurozone growth stalls', impact: 'Medium', time: '15m ago', source: 'Reuters' },
  { headline: 'China PMI beats expectations at 51.2', impact: 'Low', time: '1h ago', source: 'Xinhua' },
];

const INDICATORS: Indicator[] = [
  { name: 'US GDP', value: 2.8, unit: '%', change: 0.3, history: GDP_PULSE },
  { name: 'Inflation', value: 3.1, unit: '%', change: -0.2, history: GDP_PULSE },
  { name: 'Unemployment', value: 3.9, unit: '%', change: -0.1, history: GDP_PULSE },
  { name: 'Debt/GDP', value: 122, unit: '%', change: 1.2, history: GDP_PULSE },
];

// ─── Sub-Components ──────────────────────────────────────────────

function RadarPanel() {
  return (
    <div className="glass-panel p-4 h-full">
      <div className="flex items-center gap-2 mb-3">
        <Activity size={14} className="text-[#00ff9d]" />
        <span className="text-[11px] font-mono font-bold text-white">ECONOMIC VITALITY RADAR</span>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={RADAR_DATA}>
          <PolarGrid stroke="rgba(255,255,255,0.1)" />
          <PolarAngleAxis dataKey="axis" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 9, fontFamily: 'monospace' }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
          <Radar name="Current" dataKey="A" stroke="#00ff9d" fill="#00ff9d" fillOpacity={0.15} strokeWidth={1.5} />
        </RadarChart>
      </ResponsiveContainer>
      <div className="flex justify-center gap-4 mt-2">
        <span className="text-[9px] font-mono text-white/40">Composite Score: <span className="text-[#00ff9d]">64.5</span></span>
      </div>
    </div>
  );
}

function GaugePanel({ label, value, max, unit, color }: { label: string; value: number; max: number; unit: string; color: string }) {
  const pct = (value / max) * 100;
  return (
    <div className="glass-panel p-3">
      <div className="text-[10px] font-mono text-white/50 mb-2">{label}</div>
      <div className="relative h-2 bg-white/5 rounded-full overflow-hidden mb-2">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </div>
      <div className="flex justify-between items-end">
        <span className="text-lg font-mono font-bold" style={{ color }}>{value}{unit}</span>
        <span className="text-[9px] font-mono text-white/30">max {max}{unit}</span>
      </div>
    </div>
  );
}

function ChartPanel() {
  return (
    <div className="glass-panel p-4 h-full">
      <div className="flex items-center gap-2 mb-3">
        <BarChart3 size={14} className="text-[#00d4ff]" />
        <span className="text-[11px] font-mono font-bold text-white">GDP PULSE</span>
      </div>
      <ResponsiveContainer width="100%" height={180}>
        <LineChart data={GDP_PULSE}>
          <CartesianGrid stroke="rgba(255,255,255,0.05)" />
          <XAxis dataKey="t" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 9, fontFamily: 'monospace' }} axisLine={false} />
          <YAxis tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 9, fontFamily: 'monospace' }} axisLine={false} width={30} />
          <Tooltip
            contentStyle={{ background: '#0a1628', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', fontSize: '11px', fontFamily: 'monospace' }}
            itemStyle={{ color: '#00d4ff' }}
            labelStyle={{ color: 'rgba(255,255,255,0.5)' }}
          />
          <Line type="monotone" dataKey="v" stroke="#00d4ff" strokeWidth={2} dot={{ fill: '#00d4ff', r: 3 }} activeDot={{ r: 5, fill: '#00d4ff' }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function ScorecardPanel({ indicator }: { indicator: Indicator }) {
  const isUp = indicator.change > 0;
  const color = isUp ? '#00ff9d' : '#ff1a1a';
  return (
    <div className="glass-panel p-3">
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] font-mono text-white/50">{indicator.name}</span>
        {isUp ? <TrendingUp size={12} style={{ color }} /> : <TrendingDown size={12} style={{ color }} />}
      </div>
      <div className="text-xl font-mono font-bold text-white">{indicator.value}{indicator.unit}</div>
      <div className="text-[9px] font-mono mt-1" style={{ color }}>
        {isUp ? '+' : ''}{indicator.change}{indicator.unit} vs last
      </div>
    </div>
  );
}

function TickerPanel() {
  const [prices] = useState([
    { symbol: 'SPX', price: 5123.45, change: 0.8 },
    { symbol: 'DJI', price: 38904.12, change: -0.3 },
    { symbol: 'NDX', price: 18234.56, change: 1.2 },
    { symbol: 'VIX', price: 14.23, change: -5.1 },
    { symbol: 'DXY', price: 103.45, change: 0.15 },
    { symbol: 'GOLD', price: 2345.60, change: 0.4 },
  ]);

  return (
    <div className="glass-panel p-3">
      <div className="flex items-center gap-2 mb-2">
        <DollarSign size={14} className="text-[#f0c000]" />
        <span className="text-[11px] font-mono font-bold text-white">EQUITY MARKET TRACKER</span>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-1">
        {prices.map((p) => (
          <div key={p.symbol} className="flex-shrink-0 px-2 py-1 bg-white/5 rounded">
            <div className="text-[10px] font-mono text-white/50">{p.symbol}</div>
            <div className="text-sm font-mono font-bold text-white">{p.price.toFixed(2)}</div>
            <div className={`text-[9px] font-mono ${p.change > 0 ? 'text-[#00ff9d]' : 'text-[#ff1a1a]'}`}>
              {p.change > 0 ? '+' : ''}{p.change}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function NewsTetherPanel() {
  return (
    <div className="glass-panel p-4">
      <div className="flex items-center gap-2 mb-3">
        <Newspaper size={14} className="text-[#00d4ff]" />
        <span className="text-[11px] font-mono font-bold text-white">ECONOMIC NEWS IMPACT FEED</span>
      </div>
      <div className="space-y-2">
        {NEWS_TETHERS.map((news, i) => (
          <div key={i} className="flex items-start gap-2 p-2 bg-white/5 rounded hover:bg-white/10 transition-colors cursor-pointer">
            <div className={`w-1 h-full rounded-full ${news.impact === 'High' ? 'bg-[#ff1a1a]' : news.impact === 'Medium' ? 'bg-[#f0c000]' : 'bg-[#00ff9d]'}`} />
            <div className="flex-1 min-w-0">
              <div className="text-[11px] text-white truncate">{news.headline}</div>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-[8px] font-mono px-1 py-0.5 rounded ${news.impact === 'High' ? 'bg-[#ff1a1a]/20 text-[#ff1a1a]' : news.impact === 'Medium' ? 'bg-[#f0c000]/20 text-[#f0c000]' : 'bg-[#00ff9d]/20 text-[#00ff9d]'}`}>
                  ▲ {news.impact}
                </span>
                <span className="text-[8px] text-white/30 font-mono">{news.time}</span>
                <span className="text-[8px] text-white/30 font-mono">{news.source}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CanarySystem() {
  const [canaries, setCanaries] = useState(CANARIES);
  const deadCount = canaries.filter(c => c.triggered).length;
  const threatLevel: ThreatLevel = getThreatLevelFromCanaries(deadCount);
  const theme = VOID_SPECTRUM[threatLevel];

  // Simulate canary updates
  useEffect(() => {
    const interval = setInterval(() => {
      setCanaries(prev => prev.map(c => ({
        ...c,
        triggered: Math.random() > 0.85 ? !c.triggered : c.triggered,
      })));
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`glass-panel p-4 ${theme.glowClass} transition-all duration-500`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <AlertTriangle size={14} className={theme.textClass} />
          <span className="text-[11px] font-mono font-bold text-white">CANARY EARLY WARNING SYSTEM</span>
        </div>
        <div className={`text-[10px] font-mono px-2 py-1 rounded border ${theme.bgClass} ${theme.borderClass} ${theme.textClass}`}>
          {deadCount} DEAD / {canaries.length} TOTAL
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-3">
        {canaries.map((canary) => (
          <div key={canary.id} className="flex flex-col items-center gap-1">
            <motion.div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-[16px] ${
                canary.triggered
                  ? 'bg-[#ff1a1a]/20 text-[#ff1a1a] border border-[#ff1a1a]/30'
                  : 'bg-[#00ff9d]/20 text-[#00ff9d] border border-[#00ff9d]/30'
              }`}
              animate={canary.triggered ? { scale: [1, 1.1, 1] } : {}}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              {canary.triggered ? '💀' : '🐦'}
            </motion.div>
            <span className="text-[7px] font-mono text-white/40 text-center leading-tight">{canary.name.split(' ')[0]}</span>
          </div>
        ))}
      </div>

      <div className="space-y-1">
        {canaries.filter(c => c.triggered).map(c => (
          <div key={c.id} className="flex items-center gap-2 text-[9px] font-mono text-[#ff1a1a]">
            <span>🔴</span>
            <span>{c.name}: {c.description}</span>
          </div>
        ))}
        {deadCount === 0 && (
          <div className="text-[9px] font-mono text-[#00ff9d]">🟢 All canaries alive — no crisis signals detected</div>
        )}
      </div>

      {deadCount >= 3 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 p-2 bg-[#ff1a1a]/10 border border-[#ff1a1a]/30 rounded"
        >
          <div className="text-[10px] font-mono text-[#ff1a1a] font-bold">⚠️ CRISIS MODE ACTIVE</div>
          <div className="text-[9px] font-mono text-white/50 mt-1">Background crimson, non-essential panels fading, auto-expanding crisis timeline...</div>
        </motion.div>
      )}
    </div>
  );
}

function SentimentMeter() {
  const [sentiment, setSentiment] = useState(42);

  useEffect(() => {
    const interval = setInterval(() => {
      setSentiment(prev => Math.max(10, Math.min(90, prev + (Math.random() - 0.5) * 10)));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const color = sentiment > 60 ? '#00ff9d' : sentiment > 40 ? '#f0c000' : '#ff1a1a';

  return (
    <div className="glass-panel p-3">
      <div className="flex items-center gap-2 mb-2">
        <Globe size={14} style={{ color }} />
        <span className="text-[11px] font-mono font-bold text-white">NEWS SENTIMENT THERMOMETER</span>
      </div>
      <div className="relative h-3 bg-white/5 rounded-full overflow-hidden mb-2">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          animate={{ width: `${sentiment}%` }}
          transition={{ duration: 1 }}
        />
      </div>
      <div className="flex justify-between text-[9px] font-mono text-white/40">
        <span>Bearish (-)</span>
        <span style={{ color }} className="font-bold">{sentiment.toFixed(1)}</span>
        <span>Bullish (+)</span>
      </div>
    </div>
  );
}

// ─── Main Dashboard ────────────────────────────────────────────────

export default function EconomicDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'markets' | 'risk' | 'calendar'>('overview');

  const tabs = [
    { id: 'overview' as const, label: 'OVERVIEW', icon: Activity },
    { id: 'markets' as const, label: 'MARKETS', icon: BarChart3 },
    { id: 'risk' as const, label: 'RISK', icon: AlertTriangle },
    { id: 'calendar' as const, label: 'CALENDAR', icon: Globe },
  ];

  return (
    <div className="h-full flex flex-col bg-void">
      {/* Top Tabs */}
      <div className="flex gap-1 p-2 border-b border-white/5 overflow-x-auto shrink-0">
        {tabs.map(t => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-mono rounded transition-all ${
                activeTab === t.id
                  ? 'bg-[#00ff9d]/20 text-[#00ff9d] border border-[#00ff9d]/30'
                  : 'text-white/40 hover:text-white/60 border border-transparent hover:bg-white/5'
              }`}
            >
              <Icon size={12} />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-3">
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-3"
            >
              {/* Top Row: Radar + Chart */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                <RadarPanel />
                <ChartPanel />
              </div>

              {/* Vital Signs Row */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {INDICATORS.map((ind, i) => (
                  <ScorecardPanel key={i} indicator={ind} />
                ))}
              </div>

              {/* Ticker + Sentiment */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                <TickerPanel />
                <SentimentMeter />
              </div>

              {/* News Tether */}
              <NewsTetherPanel />

              {/* Canary System */}
              <CanarySystem />
            </motion.div>
          )}

          {activeTab === 'markets' && (
            <motion.div
              key="markets"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-3"
            >
              <TickerPanel />
              <ChartPanel />
              <div className="grid grid-cols-2 gap-3">
                <GaugePanel label="Inflation Thermometer" value={3.1} max={10} unit="%" color="#ff9500" />
                <GaugePanel label="Debt Sustainability" value={122} max={150} unit="%" color="#f0c000" />
              </div>
            </motion.div>
          )}

          {activeTab === 'risk' && (
            <motion.div
              key="risk"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-3"
            >
              <CanarySystem />
              <RadarPanel />
              <div className="glass-panel p-4">
                <div className="text-[11px] font-mono font-bold text-white mb-3">PEER COMPARISON RADAR</div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                  {['🇺🇸 US', '🇪🇺 EU', '🇨🇳 China', '🇯🇵 Japan'].map((c, i) => (
                    <div key={i} className="p-2 bg-white/5 rounded text-center">
                      <div className="text-lg">{c}</div>
                      <div className="text-[10px] font-mono text-[#00ff9d]">Score: {80 - i * 8}</div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'calendar' && (
            <motion.div
              key="calendar"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-3"
            >
              <div className="glass-panel p-4">
                <div className="text-[11px] font-mono font-bold text-white mb-3">ECONOMIC CALENDAR</div>
                <div className="space-y-2">
                  {[
                    { date: 'May 2', event: 'Fed Interest Rate Decision', impact: 'High', forecast: '5.25-5.50%' },
                    { date: 'May 3', event: 'US Nonfarm Payrolls', impact: 'High', forecast: '185K' },
                    { date: 'May 5', event: 'ECB Policy Meeting', impact: 'Medium', forecast: 'Hold' },
                    { date: 'May 8', event: 'China Trade Balance', impact: 'Medium', forecast: '$72B' },
                    { date: 'May 10', event: 'UK GDP Q1', impact: 'Low', forecast: '0.3%' },
                  ].map((e, i) => (
                    <div key={i} className="flex items-center gap-3 p-2 bg-white/5 rounded">
                      <div className="text-[10px] font-mono text-white/50 w-16">{e.date}</div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[11px] text-white">{e.event}</div>
                        <div className="text-[9px] text-white/40 font-mono">Forecast: {e.forecast}</div>
                      </div>
                      <span className={`text-[8px] font-mono px-1.5 py-0.5 rounded ${e.impact === 'High' ? 'bg-[#ff1a1a]/20 text-[#ff1a1a]' : e.impact === 'Medium' ? 'bg-[#f0c000]/20 text-[#f0c000]' : 'bg-[#00ff9d]/20 text-[#00ff9d]'}`}>
                        {e.impact}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
