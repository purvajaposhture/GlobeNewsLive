import { NextResponse } from 'next/server';

interface CoinGeckoCategory {
  id: string;
  name: string;
  market_cap_change_24h?: number;
}

const TARGET_SECTORS = [
  { id: 'artificial-intelligence', name: 'AI' },
  { id: 'meme-token', name: 'Memes' },
  { id: 'gaming', name: 'Gaming' },
  { id: 'privacy-coins', name: 'Privacy' },
  { id: 'infrastructure', name: 'Infra' },
];

export async function GET() {
  const headers: Record<string, string> = {};
  if (process.env.COINGECKO_API_KEY) {
    headers['x-cg-demo-api-key'] = process.env.COINGECKO_API_KEY;
  }
  try {
    const res = await fetch(
      'https://api.coingecko.com/api/v3/coins/categories',
      { headers, next: { revalidate: 300 } } as RequestInit & { next?: { revalidate?: number } }
    );
    if (!res.ok) throw new Error('CoinGecko failed');
    const data: CoinGeckoCategory[] = await res.json();

    const sectors = TARGET_SECTORS.map((ts) => {
      const cat = data.find((c) => c.id === ts.id);
      return {
        id: ts.id,
        name: ts.name,
        change24h: cat?.market_cap_change_24h ?? 0,
      };
    });

    return NextResponse.json({ sectors, timestamp: new Date().toISOString() });
  } catch {
    const fallback = [
      { id: 'artificial-intelligence', name: 'AI', change24h: 4.2 },
      { id: 'meme-token', name: 'Memes', change24h: -2.1 },
      { id: 'gaming', name: 'Gaming', change24h: 1.5 },
      { id: 'privacy-coins', name: 'Privacy', change24h: 0.8 },
      { id: 'infrastructure', name: 'Infra', change24h: -0.5 },
    ];
    return NextResponse.json({ sectors: fallback, timestamp: new Date().toISOString() });
  }
}
