'use client';

import { useState, useEffect, useRef } from 'react';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(r => r.json());

interface SignalItem {
  id: string;
  title: string;
  source: string;
  sourceUrl?: string;
  timeAgo: string;
  severity?: string;
}

const SOURCE_ABBREV: Record<string, string> = {
  'BBC': 'BBC',
  'BBC News': 'BBC',
  'Reuters': 'RTRS',
  'Bloomberg': 'BLMB',
  'Al Jazeera': 'AJE',
  'Financial Times': 'FT',
  'The Guardian': 'GRDN',
  'CoinDesk': 'COIN',
  'CoinTelegraph': 'CT',
  'Defense One': 'DEF1',
  'Breaking Defense': 'BDEF',
  'DW News': 'DW',
  'France24': 'F24',
  'AP News': 'AP',
  'Associated Press': 'AP',
  'CNN': 'CNN',
  'CNBC': 'CNBC',
  'Forbes': 'FORB',
  'Wall Street Journal': 'WSJ',
};

function getSourceAbbrev(source: string): string {
  return SOURCE_ABBREV[source] ?? source.slice(0, 4).toUpperCase();
}

interface FinanceLiveNewsProps {
  maxItems?: number;
}

export default function FinanceLiveNews({ maxItems = 20 }: FinanceLiveNewsProps) {
  const { data, isLoading } = useSWR<{ signals: SignalItem[] }>(
    '/api/signals',
    fetcher,
    { refreshInterval: 30000, revalidateOnFocus: true }
  );

  const [isPaused, setIsPaused] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const articles = (data?.signals ?? [])
    .filter(s => s.title && s.sourceUrl)
    .slice(0, maxItems);

  const count = data?.signals?.length ?? 0;

  // Auto-scroll effect
  useEffect(() => {
    if (isPaused || articles.length <= 4) return;
    
    const container = scrollRef.current;
    if (!container) return;

    let animationId: number;
    let scrollPos = 0;
    const speed = 0.5; // pixels per frame

    const animate = () => {
      scrollPos += speed;
      const maxScroll = container.scrollHeight - container.clientHeight;
      
      if (scrollPos >= maxScroll) {
        scrollPos = 0; // loop back to top
      }
      
      container.scrollTop = scrollPos;
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [isPaused, articles.length]);

  return (
    <div className="shrink-0 border-b border-white/5 bg-[#0f0f14]">
      {/* Panel header */}
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-white/5">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-[11px] font-mono font-medium text-gray-300 tracking-wider uppercase">
            Live Headlines
          </span>
          <span className="text-[9px] font-mono px-1.5 py-0.5 bg-green-900/30 text-green-500 border border-green-800/30 rounded">
            LIVE
          </span>
        </div>
        <span className="text-[10px] text-gray-600 font-mono">
          {count} headlines
        </span>
      </div>

      {/* Scrolling container */}
      <div
        ref={scrollRef}
        className="relative overflow-hidden"
        style={{ height: '160px' }}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {isLoading && !articles.length ? (
          <div className="flex flex-col gap-2 p-3">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-8 bg-white/5 rounded animate-pulse" />
            ))}
          </div>
        ) : articles.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <span className="text-[10px] font-mono text-gray-600">No headlines available</span>
          </div>
        ) : (
          <div className="flex flex-col">
            {articles.map((article, i) => (
              <a
                key={`${article.id}-${i}`}
                href={article.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-2 px-3 py-2 border-b border-white/[0.04] hover:bg-white/[0.03] cursor-pointer group shrink-0"
              >
                <span className="shrink-0 text-[9px] font-mono px-1.5 py-0.5 rounded mt-0.5 bg-gray-800 text-gray-400 uppercase tracking-wide min-w-[36px] text-center">
                  {getSourceAbbrev(article.source)}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] text-gray-200 leading-[1.35] line-clamp-2 group-hover:text-white transition-colors">
                    {article.title}
                  </p>
                  <span className="text-[10px] text-gray-600 font-mono">
                    {article.timeAgo}
                  </span>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
