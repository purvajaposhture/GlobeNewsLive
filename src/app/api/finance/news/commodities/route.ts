import { NextResponse } from 'next/server';
import { fetchRSSWithFallback } from '@/lib/rssFetcher';
import { NEWS_FALLBACK } from '@/data/newsFallback';

export const revalidate = 60;

const SOURCES = [
  { url: 'https://feeds.reuters.com/reuters/commoditiesNews', name: 'Reuters' },
  { url: 'https://feeds.bbci.co.uk/news/business/rss.xml', name: 'BBC' },
  { url: 'https://www.mining.com/feed/', name: 'Mining.com' },
];

const KEYWORDS = [
  'gold', 'silver', 'oil', 'crude', 'copper', 'platinum',
  'palladium', 'aluminum', 'commodity', 'OPEC', 'energy',
  'pipeline', 'LNG', 'natural gas', 'wheat', 'corn',
  'metals', 'mining', 'iron ore', 'lithium', 'cobalt',
];

export async function GET() {
  const articles = await fetchRSSWithFallback(SOURCES, KEYWORDS, 'commodities');
  const result = articles.length > 0 ? articles : NEWS_FALLBACK.commodities;

  return NextResponse.json({
    category: 'commodities',
    articles: result.slice(0, 10),
    count: result.length,
    updatedAt: new Date().toISOString(),
  });
}
