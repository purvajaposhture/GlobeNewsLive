import { NextResponse } from 'next/server';
import { NEWS_FALLBACK } from '@/data/newsFallback';

export const revalidate = 60;

export async function GET() {
  const result = NEWS_FALLBACK['fixed-income'];

  return NextResponse.json({
    category: 'fixed-income',
    articles: result.slice(0, 10),
    count: result.length,
    updatedAt: new Date().toISOString(),
  });
}
