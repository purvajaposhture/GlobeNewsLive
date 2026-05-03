import { NextResponse } from 'next/server';

const METALS = [
  { symbol: 'GC=F', name: 'Gold', display: 'GOLD' },
  { symbol: 'SI=F', name: 'Silver', display: 'SILVER' },
  { symbol: 'HG=F', name: 'Copper', display: 'COPPER' },
  { symbol: 'PL=F', name: 'Platinum', display: 'PLATINUM' },
  { symbol: 'PA=F', name: 'Palladium', display: 'PALLADIUM' },
  { symbol: 'ALI=F', name: 'Aluminum', display: 'ALUMINUM' },
];

interface YahooChartResult {
  chart?: {
    result?: Array<{
      meta: { regularMarketPrice?: number; previousClose?: number; currency?: string };
      timestamp: number[];
      indicators: { quote: Array<{ close: (number | null)[] }> };
    }>;
    error?: string | null;
  };
}

async function fetchYahooChart(symbol: string) {
  const proxy = process.env.YAHOO_FINANCE_PROXY;
  const baseUrl = proxy ? proxy.replace(/\/$/, '') : 'https://query1.finance.yahoo.com';
  const url = `${baseUrl}/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1d&range=5d`;
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; GlobeNewsLive/1.0)' },
      next: { revalidate: 30 },
    } as RequestInit & { next?: { revalidate?: number } });
    if (!res.ok) return null;
    const json: YahooChartResult = await res.json();
    const result = json.chart?.result?.[0];
    if (!result) return null;
    const price = result.meta.regularMarketPrice ?? result.indicators.quote[0].close.filter(Boolean).pop() ?? 0;
    const prev = result.meta.previousClose ?? result.indicators.quote[0].close[0] ?? price;
    const change = prev ? ((price - prev) / prev) * 100 : 0;
    const prices = result.indicators.quote[0].close.filter((p): p is number => p !== null);
    return { price, change, prices, currency: result.meta.currency || 'USD' };
  } catch {
    return null;
  }
}

export async function GET() {
  const results = await Promise.all(
    METALS.map(async (m) => {
      const data = await fetchYahooChart(m.symbol);
      return {
        symbol: m.symbol,
        name: m.name,
        display: m.display,
        price: data?.price ?? 0,
        change: data?.change ?? 0,
        sparkline: data?.prices ?? [],
        currency: data?.currency ?? 'USD',
      };
    })
  );
  return NextResponse.json({ metals: results, timestamp: new Date().toISOString() });
}
