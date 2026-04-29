import { NextResponse } from 'next/server';
import { FEEDS, DEFAULT_ENABLED_SOURCES, ALERT_KEYWORDS, ALERT_EXCLUSIONS, getSourceTier } from '@/config/feeds';
import { classifyThreat, classifyCategory, formatTimeAgo } from '@/lib/classify';
import { Signal } from '@/types';
import { applyRateLimit, getRateLimitHeaders } from '@/lib/rate-limit';

// Fallback dummy data for when RSS feeds fail
const FALLBACK_SIGNALS: Signal[] = [
  {
    id: 'fallback-1',
    title: 'Israel launches airstrikes on Iranian nuclear facilities near Natanz',
    severity: 'CRITICAL',
    category: 'military',
    source: 'Reuters',
    sourceUrl: 'https://reuters.com',
    timeAgo: '5 min ago',
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    summary: "Multiple explosions reported near Iran's Natanz uranium enrichment facility. Air defense systems activated.",
    region: 'mena',
  },
  {
    id: 'fallback-2',
    title: 'Iran retaliates with missile barrage targeting US bases in Iraq',
    severity: 'CRITICAL',
    category: 'military',
    source: 'Al Jazeera',
    sourceUrl: 'https://aljazeera.com',
    timeAgo: '12 min ago',
    timestamp: new Date(Date.now() - 12 * 60 * 1000),
    summary: 'Ballistic missiles launched toward Al-Asad airbase. No casualties confirmed yet.',
    region: 'iraq',
  },
  {
    id: 'fallback-3',
    title: 'Oil prices surge 8% as Strait of Hormuz shipping suspended',
    severity: 'HIGH',
    category: 'economy',
    source: 'Bloomberg',
    sourceUrl: 'https://bloomberg.com',
    timeAgo: '18 min ago',
    timestamp: new Date(Date.now() - 18 * 60 * 1000),
    summary: 'Brent crude jumps to $94/barrel. Major shipping companies halt Red Sea transit.',
    region: 'global',
  },
  {
    id: 'fallback-4',
    title: 'Hezbollah fires rockets into northern Israel from Lebanon',
    severity: 'HIGH',
    category: 'military',
    source: 'Times of Israel',
    sourceUrl: 'https://timesofisrael.com',
    timeAgo: '25 min ago',
    timestamp: new Date(Date.now() - 25 * 60 * 1000),
    summary: 'Iron Dome intercepts most projectiles. IDF responds with artillery fire.',
    region: 'lebanon',
  },
  {
    id: 'fallback-5',
    title: 'US deploys additional carrier strike group to Persian Gulf',
    severity: 'HIGH',
    category: 'military',
    source: 'Defense One',
    sourceUrl: 'https://defenseone.com',
    timeAgo: '32 min ago',
    timestamp: new Date(Date.now() - 32 * 60 * 1000),
    summary: 'USS Theodore Roosevelt and escort vessels ordered to reinforce CENTCOM presence.',
    region: 'mena',
  },
  {
    id: 'fallback-6',
    title: 'EU announces emergency sanctions on Iranian oil exports',
    severity: 'MEDIUM',
    category: 'politics',
    source: 'EU News',
    sourceUrl: 'https://europa.eu',
    timeAgo: '45 min ago',
    timestamp: new Date(Date.now() - 45 * 60 * 1000),
    summary: '27 member states agree on phased embargo. Exemptions for humanitarian supplies.',
    region: 'eu',
  },
  {
    id: 'fallback-7',
    title: 'Cyber attack disrupts Israeli government websites',
    severity: 'MEDIUM',
    category: 'cyber',
    source: 'BleepingComputer',
    sourceUrl: 'https://bleepingcomputer.com',
    timeAgo: '1 hour ago',
    timestamp: new Date(Date.now() - 60 * 60 * 1000),
    summary: 'DDoS attack claimed by pro-Iranian hacktivist group. Services gradually restoring.',
    region: 'israel',
  },
  {
    id: 'fallback-8',
    title: 'Russia condemns strikes, warns of "dangerous escalation"',
    severity: 'MEDIUM',
    category: 'politics',
    source: 'TASS',
    sourceUrl: 'https://tass.com',
    timeAgo: '1.5 hours ago',
    timestamp: new Date(Date.now() - 90 * 60 * 1000),
    summary: 'Kremlin calls for immediate ceasefire. Offers to mediate negotiations.',
    region: 'russia',
  },
  {
    id: 'fallback-9',
    title: 'Saudi Arabia activates air defenses, closes northern airspace',
    severity: 'MEDIUM',
    category: 'military',
    source: 'Al Arabiya',
    sourceUrl: 'https://alarabiya.net',
    timeAgo: '2 hours ago',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    summary: 'Patriot batteries on high alert. All civilian flights rerouted south.',
    region: 'saudi',
  },
];

// Flatten all feeds into a single array
const ALL_FEEDS = Object.entries(FEEDS).flatMap(([category, feeds]) =>
  feeds.map(feed => ({ ...feed, category }))
);

// Keywords for priority boosting
const PRIORITY_KEYWORDS = [
  'war', 'invasion', 'military', 'nuclear', 'sanctions', 'missile',
  'airstrike', 'drone strike', 'troops deployed', 'armed conflict', 'bombing', 'casualties',
  'ceasefire', 'peace treaty', 'nato', 'coup', 'martial law',
  'assassination', 'terrorist', 'terror attack', 'cyber attack', 'hostage', 'evacuation order',
  'breaking', 'urgent', 'alert', 'emergency', 'crisis', 'conflict',
  'iran', 'israel', 'gaza', 'ukraine', 'russia', 'china', 'taiwan',
  'houthi', 'hezbollah', 'hamas', 'isis', 'al-qaeda',
  'oil', 'gas', 'energy', 'supply chain', 'inflation', 'recession',
];

// Simple XML parser for RSS and ATOM feeds
function parseRSS(xml: string, sourceName: string, category: string): Signal[] {
  const items: Signal[] = [];
  
  const isAtom = xml.includes('<entry>') || xml.includes('<entry ');
  const itemRegex = isAtom 
    ? /<entry[^>]*>([\s\S]*?)<\/entry>/gi
    : /<item[^>]*>([\s\S]*?)<\/item>/gi;
  
  let match;
  
  while ((match = itemRegex.exec(xml)) !== null) {
    const item = match[1];
    
    const title = item.match(/<title[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/i)?.[1]?.trim() || '';
    
    let link = '';
    if (isAtom) {
      const linkMatch = item.match(/<link[^>]*href=["']([^"']+)["'][^>]*\/?>/i);
      link = linkMatch?.[1] || '';
    } else {
      link = item.match(/<link[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/link>/i)?.[1]?.trim() || '';
    }
    
    const pubDate = isAtom
      ? (item.match(/<updated[^>]*>([\s\S]*?)<\/updated>/i)?.[1]?.trim() || 
         item.match(/<published[^>]*>([\s\S]*?)<\/published>/i)?.[1]?.trim())
      : item.match(/<pubDate[^>]*>([\s\S]*?)<\/pubDate>/i)?.[1]?.trim();
    
    const description = isAtom
      ? (item.match(/<summary[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/summary>/i)?.[1]?.trim() ||
         item.match(/<content[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/content>/i)?.[1]?.trim() || '')
      : item.match(/<description[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/description>/i)?.[1]?.trim() || '';
    
    if (!title) continue;
    
    const cleanTitle = title.replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'");
    const cleanDesc = description.replace(/<[^>]*>/g, '').substring(0, 300);
    
    const timestamp = pubDate ? new Date(pubDate) : new Date();
    const fullText = (cleanTitle + ' ' + cleanDesc).toLowerCase();
    
    // Check priority relevance
    const priorityRelevance = PRIORITY_KEYWORDS.filter(kw => fullText.includes(kw.toLowerCase())).length;
    
    // Skip if matches exclusions
    const hasExclusion = ALERT_EXCLUSIONS.some(ex => fullText.includes(ex.toLowerCase()));
    if (hasExclusion) continue;
    
    const { severity } = classifyThreat(cleanTitle + ' ' + cleanDesc);
    const signalCategory = classifyCategory(cleanTitle + ' ' + cleanDesc);
    
    // Boost severity for priority content
    let adjustedSeverity = severity;
    if (priorityRelevance >= 3) {
      adjustedSeverity = severity === 'LOW' ? 'MEDIUM' : severity === 'MEDIUM' ? 'HIGH' : severity;
    }
    
    items.push({
      id: Buffer.from(link || cleanTitle).toString('base64').substring(0, 16),
      title: cleanTitle,
      severity: adjustedSeverity,
      category: signalCategory,
      source: sourceName,
      sourceUrl: link,
      timeAgo: formatTimeAgo(timestamp),
      timestamp,
      summary: cleanDesc,
      region: category,
    } as Signal);
  }
  
  return items;
}

// In-memory cache (Redis would be used in production)
let cache: { signals: Signal[]; timestamp: number; sources: { success: number; failed: number } } | null = null;
const CACHE_TTL = 60 * 1000; // 1 minute

export async function GET(request: Request) {
  // Apply rate limiting
  const rateLimitResponse = applyRateLimit(request);
  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  const { searchParams } = new URL(request.url);
  const filter = searchParams.get('filter');
  const refresh = searchParams.get('refresh') === 'true';
  const category = searchParams.get('category');
  const origin = new URL(request.url).origin;
  
  try {
    // Return cached data if fresh (unless refresh requested)
    if (!refresh && cache && Date.now() - cache.timestamp < CACHE_TTL) {
      let signals = cache.signals;
      if (filter) {
        signals = signals.filter((s: Signal) => 
          s.title.toLowerCase().includes(filter.toLowerCase()) ||
          s.summary?.toLowerCase().includes(filter.toLowerCase())
        );
      }
      if (category) {
        signals = signals.filter((s: Signal) => s.region === category);
      }
      return NextResponse.json({ signals, cached: true, sources: cache.sources });
    }

    // Fetch all feeds in parallel with timeout
    const fetchWithTimeout = async (url: string, timeout = 10000): Promise<string | null> => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);
      try {
        // Handle URL that might be an object (for multi-language feeds)
        let fetchUrl: string = url;
        if (typeof url === 'object') {
          fetchUrl = (url as Record<string, string>)['en'] || Object.values(url as Record<string, string>)[0];
        }
        
        // Convert relative internal URLs to absolute
        if (fetchUrl.startsWith('/')) {
          fetchUrl = `${origin}${fetchUrl}`;
        }
        
        const res = await fetch(fetchUrl, { 
          signal: controller.signal,
          headers: { 
            'User-Agent': 'Mozilla/5.0 (compatible; GlobeNews-Live/2.0; +https://globenews.live)',
            'Accept': 'application/rss+xml, application/xml, text/xml, application/atom+xml',
          },
          next: { revalidate: 60 },
        });
        clearTimeout(timeoutId);
        return res.ok ? await res.text() : null;
      } catch {
        clearTimeout(timeoutId);
        return null;
      }
    };

    let successCount = 0;
    let failCount = 0;

    // Select feeds to fetch (limit to enabled sources for performance)
    const enabledSources = new Set(Object.values(DEFAULT_ENABLED_SOURCES).flat());
    const feedsToFetch = ALL_FEEDS.filter(f => enabledSources.has(f.name)).slice(0, 50);

    const results = await Promise.all(
      feedsToFetch.map(async (feed) => {
        const url = typeof feed.url === 'string' ? feed.url : feed.url['en'] || Object.values(feed.url)[0];
        const xml = await fetchWithTimeout(url);
        if (!xml) {
          failCount++;
          return [];
        }
        successCount++;
        const items = parseRSS(xml, feed.name, feed.category || 'general');
        return items;
      })
    );

    // Merge and sort
    let allSignals = results.flat();
    
    // Deduplication by title similarity
    const seen = new Set<string>();
    allSignals = allSignals.filter(s => {
      const key = s.title.toLowerCase().replace(/[^a-z0-9]/g, '').substring(0, 40);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
    
    // Sort by severity and recency
    const severityOrder: Record<string, number> = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3, INFO: 4 };
    allSignals.sort((a: Signal, b: Signal) => {
      const severityDiff = severityOrder[a.severity] - severityOrder[b.severity];
      if (severityDiff !== 0) return severityDiff;
      return b.timestamp.getTime() - a.timestamp.getTime();
    });

    // Limit to top 100
    const signals = allSignals.slice(0, 100);
    
    // Update cache
    cache = { 
      signals, 
      timestamp: Date.now(),
      sources: { success: successCount, failed: failCount }
    };

    // Apply filters
    let filteredSignals = signals;
    if (filter) {
      filteredSignals = signals.filter((s: Signal) => 
        s.title.toLowerCase().includes(filter.toLowerCase()) ||
        s.summary?.toLowerCase().includes(filter.toLowerCase())
      );
    }
    if (category) {
      filteredSignals = signals.filter((s: Signal) => s.region === category);
    }

    return NextResponse.json({ 
      signals: filteredSignals, 
      cached: false,
      sources: { success: successCount, failed: failCount, total: feedsToFetch.length },
      totalSources: ALL_FEEDS.length,
    });
  } catch (error) {
    console.error('Signals API error:', error);
    // Return fallback data on error
    return NextResponse.json({
      signals: FALLBACK_SIGNALS,
      cached: false,
      sources: { success: 0, failed: 0, total: 0 },
      error: 'Failed to fetch live signals. Showing fallback data.',
    }, { status: 200 });
  }
}
