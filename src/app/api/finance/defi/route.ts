import { NextResponse } from 'next/server';

const DEFI_IDS = 'uniswap,p,mkr,pendle,lido-dao,aave,curve-dao-token,compound-governance-token';

interface CoinGeckoResult {
  [key: string]: { usd?: number; usd_24h_change?: number; usd_7d_change?: number };
}

export async function GET() {
  const headers: Record<string, string> = {};
  if (process.env.COINGECKO_API_KEY) {
    headers['x-cg-demo-api-key'] = process.env.COINGECKO_API_KEY;
  }
  try {
    const res = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${DEFI_IDS}&vs_currencies=usd&include_24hr_change=true&include_7d_change=true`,
      { headers, next: { revalidate: 30 } } as RequestInit & { next?: { revalidate?: number } }
    );
    if (!res.ok) throw new Error('CoinGecko failed');
    const data: CoinGeckoResult = await res.json();

    const map: Record<string, { name: string; ticker: string }> = {
      uniswap: { name: 'Uniswap', ticker: 'UNI' },
      'lido-dao': { name: 'Lido DAO', ticker: 'LDO' },
      aave: { name: 'Aave', ticker: 'AAVE' },
      'curve-dao-token': { name: 'Curve', ticker: 'CRV' },
      'compound-governance-token': { name: 'Compound', ticker: 'COMP' },
      pendle: { name: 'Pendle', ticker: 'PENDLE' },
      mkr: { name: 'Maker', ticker: 'MKR' },
    };

    const tokens = Object.entries(map).map(([id, meta]) => ({
      id,
      name: meta.name,
      ticker: meta.ticker,
      price: data[id]?.usd ?? 0,
      change24h: data[id]?.usd_24h_change ?? 0,
      change7d: data[id]?.usd_7d_change ?? 0,
    }));

    return NextResponse.json({ tokens, timestamp: new Date().toISOString() });
  } catch {
    const fallback = [
      { id: 'uniswap', name: 'Uniswap', ticker: 'UNI', price: 9.45, change24h: 1.2, change7d: -3.4 },
      { id: 'aave', name: 'Aave', ticker: 'AAVE', price: 142.3, change24h: -0.8, change7d: 5.1 },
      { id: 'pendle', name: 'Pendle', ticker: 'PENDLE', price: 3.87, change24h: 2.1, change7d: -1.2 },
      { id: 'mkr', name: 'Maker', ticker: 'MKR', price: 1780.5, change24h: 0.5, change7d: 8.3 },
      { id: 'lido-dao', name: 'Lido DAO', ticker: 'LDO', price: 1.92, change24h: -1.5, change7d: 2.0 },
      { id: 'curve-dao-token', name: 'Curve', ticker: 'CRV', price: 0.42, change24h: 0.3, change7d: -0.5 },
    ];
    return NextResponse.json({ tokens: fallback, timestamp: new Date().toISOString() });
  }
}
