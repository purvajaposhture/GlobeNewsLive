import { NextResponse } from 'next/server';
import { fetchRSSWithFallback } from '@/lib/rssFetcher';
import { NEWS_FALLBACK } from '@/data/newsFallback';

export const revalidate = 60;

const SOURCES = [
  { url: 'https://feeds.reuters.com/reuters/businessNews', name: 'Reuters' },
  { url: 'https://feeds.bbci.co.uk/news/business/rss.xml', name: 'BBC' },
  { url: 'https://www.cnbc.com/id/19746125/device/rss/rss.xml', name: 'CNBC' },
];

const KEYWORDS = [
  'bond', 'yield', 'treasury', 'fixed income', 'rate',
  'Fed', 'ECB', 'BOJ', 'basis points', 'sovereign debt',
  'credit rating', 'Moody', 'Fitch', '10-year', '2-year',
  'yield curve', 'inversion', 'spread', 'coupon', 'debt',
];

export async function GET() {
  const articles = await fetchRSSWithFallback(SOURCES, KEYWORDS, 'fixed-income');
  const result = articles.length > 0 ? articles : NEWS_FALLBACK['fixed-income'];

  return NextResponse.json({
    category: 'fixed-income',
    articles: result.slice(0, 10),
    count: result.length,
    updatedAt: new Date().toISOString(),
  });
}
