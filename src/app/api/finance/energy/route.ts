import { NextResponse } from 'next/server';
import staticData from '@/data/energyComplex.json';

interface StaticRow {
  rank: number;
  code: string;
  country: string;
  days: number;
  delta: number;
  avgDays: number;
}

interface GieItem {
  code: string;
  name: string;
  gasDayStart: string;
  gasInStorage?: number;
  full?: number;
  trend?: number;
}

// Map GIE country names to our 2-letter codes
const GIE_NAME_MAP: Record<string, string> = {
  Austria: 'AT',
  Belgium: 'BE',
  Bulgaria: 'BG',
  Croatia: 'HR',
  Czechia: 'CZ',
  Denmark: 'DK',
  France: 'FR',
  Germany: 'DE',
  Hungary: 'HU',
  Ireland: 'IE',
  Italy: 'IT',
  Latvia: 'LV',
  Netherlands: 'NL',
  Poland: 'PL',
  Portugal: 'PT',
  Romania: 'RO',
  Slovakia: 'SK',
  Spain: 'ES',
  Sweden: 'SE',
  'United Kingdom': 'GB',
};

function codeToName(code: string): string {
  const row = (staticData as StaticRow[]).find((r) => r.code === code);
  return row?.country || code;
}

export async function GET() {
  const staticRows = staticData as StaticRow[];
  let source = 'static';
  let merged = [...staticRows];

  try {
    const res = await fetch('https://agsi.gie.eu/api?type=EU&size=30', {
      headers: {
        Accept: 'application/json',
        'User-Agent': 'GlobeNewsLive/1.0',
      },
      next: { revalidate: 3600 },
    } as RequestInit & { next?: { revalidate?: number } });

    if (res.ok) {
      const json = await res.json();
      const items: GieItem[] = json.data || [];

      if (items.length > 0) {
        source = 'gie_agsi';
        const liveMap = new Map<string, { days: number; delta: number }>();

        for (const item of items) {
          const code = GIE_NAME_MAP[item.name];
          if (!code) continue;
          const days = Math.round(item.full ?? 0);
          const staticRow = staticRows.find((r) => r.code === code);
          const avgDays = staticRow?.avgDays ?? 0;
          const delta = days - avgDays;
          liveMap.set(code, { days, delta });
        }

        merged = staticRows.map((row) => {
          const live = liveMap.get(row.code);
          if (live) {
            return { ...row, days: live.days, delta: live.delta };
          }
          return row;
        });
      }
    }
  } catch {
    source = 'static_fallback';
  }

  return NextResponse.json({
    rows: merged,
    source,
    timestamp: new Date().toISOString(),
  });
}
