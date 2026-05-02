import { NextResponse } from 'next/server';

interface EnergyRow {
  rank: number;
  country: string;
  production: number;
  consumption: number;
  reserves: number;
  netExport: number;
}

const energyData: EnergyRow[] = [
  { rank: 1, country: "United States", production: 12900, consumption: 20000, reserves: 68800, netExport: -7100 },
  { rank: 2, country: "Saudi Arabia", production: 10800, consumption: 3200, reserves: 267190, netExport: 7600 },
  { rank: 3, country: "Russia", production: 10500, consumption: 3500, reserves: 107800, netExport: 7000 },
  { rank: 4, country: "Canada", production: 5700, consumption: 2400, reserves: 171500, netExport: 3300 },
  { rank: 5, country: "China", production: 4100, consumption: 15400, reserves: 26200, netExport: -11300 },
  { rank: 6, country: "Iraq", production: 4400, consumption: 800, reserves: 145020, netExport: 3600 },
  { rank: 7, country: "Brazil", production: 3800, consumption: 3200, reserves: 13100, netExport: 600 },
  { rank: 8, country: "UAE", production: 3700, consumption: 900, reserves: 97800, netExport: 2800 },
  { rank: 9, country: "Iran", production: 3600, consumption: 1900, reserves: 208600, netExport: 1700 },
  { rank: 10, country: "Kuwait", production: 2700, consumption: 500, reserves: 101500, netExport: 2200 }
];

export async function GET() {
  return NextResponse.json({
    rows: energyData,
    source: 'static',
    timestamp: new Date().toISOString(),
  });
}
