import { NextResponse } from 'next/server';
import { fetchRSSWithFallback } from '@/lib/rssFetcher';
import { NEWS_FALLBACK } from '@/data/newsFallback';

export const revalidate = 60;

const SOURCES = [
  { url: 'https://cointelegraph.com/rss', name: 'Cointelegraph' },
  { url: 'https://coindesk.com/arc/outboundfeeds/rss/', name: 'CoinDesk' },
  { url: 'https://decrypt.co/feed', name: 'Decrypt' },
];

const KEYWORDS = [
  'bitcoin', 'ethereum', 'crypto', 'blockchain', 'DeFi',
  'NFT', 'web3', 'altcoin', 'stablecoin', 'BTC', 'ETH',
  'Binance', 'Coinbase', 'SEC crypto', 'regulation',
  'on-chain', 'halving', 'ETF', 'token', 'wallet',
];

export async function GET() {
  const articles = await fetchRSSWithFallback(SOURCES, KEYWORDS, 'crypto');
  const result = articles.length > 0 ? articles : NEWS_FALLBACK.crypto;

  return NextResponse.json({
    category: 'crypto',
    articles: result.slice(0, 10),
    count: result.length,
    updatedAt: new Date().toISOString(),
  });
}
