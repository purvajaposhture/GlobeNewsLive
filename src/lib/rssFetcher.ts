export interface RSSItem {
  title: string;
  link: string;
  pubDate: string;
  source: string;
  description?: string;
}

export async function fetchRSSWithFallback(
  urls: string[],
  fallback: RSSItem[],
  maxItems: number = 10
): Promise<RSSItem[]> {
  // In a real implementation, this would fetch RSS feeds
  // For now, return fallback data
  return fallback.slice(0, maxItems);
}
