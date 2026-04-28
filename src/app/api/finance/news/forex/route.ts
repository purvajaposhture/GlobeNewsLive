import { NextResponse } from 'next/server';
import { fetchRSSWithFallback } from '@/lib/rssFetcher';
import { NEWS_FALLBACK } from '@/data/newsFallback';

export const revalidate = 60;

const SOURCES = [
  { url: 'https://feeds.reuters.com/reuters/businessNews', name: 'Reuters' },
  { url: 'https://feeds.bbci.co.uk/news/business/rss.xml', name: 'BBC' },
  { url: 'https://rss.ft.com/rss/time/section/companies', name: 'FT' },
];

const KEYWORDS = [
  'forex', 'currency', 'dollar', 'euro', 'yen', 'yuan',
  'exchange rate', 'FX', 'interest rate', 'inflation',
  'GDP', 'economic', 'trade deficit', 'tariff', 'Fed',
  'ECB', 'BOJ', 'PBOC', 'rate hike', 'rate cut',
  'monetary policy', 'central bank', 'federal reserve',
];

export async function GET() {
  const articles = await fetchRSSWithFallback(SOURCES, KEYWORDS, 'forex');
  const result = articles.length > 0 ? articles : NEWS_FALLBACK.forex;

  return NextResponse.json({
    category: 'forex',
    articles: result.slice(0, 10),
    count: result.length,
    updatedAt: new Date().toISOString(),
  });
}
