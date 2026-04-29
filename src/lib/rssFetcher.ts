export interface Article {
  id: string;
  title: string;
  source: string;
  url: string;
  publishedAt: string;
  timeAgo: string;
  description?: string;
  tags?: string[];
  severity?: string | null;
}

function timeAgo(date: Date): string {
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function parseRSSXML(xml: string, sourceName: string): Article[] {
  const items: Article[] = [];
  const isAtom = xml.includes('<entry>') || xml.includes('<entry ');
  const itemRegex = isAtom
    ? /<entry[^>]*>([\s\S]*?)<\/entry>/gi
    : /<item[^>]*>([\s\S]*?)<\/item>/gi;

  let match;
  let idx = 0;

  while ((match = itemRegex.exec(xml)) !== null && idx < 20) {
    const item = match[1];

    const title = item.match(/<title[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/i)?.[1]?.trim() || '';

    let link = '';
    if (isAtom) {
      const linkMatch = item.match(/<link[^>]*href=["']([^"']+)["'][^>]*\/?>/i);
      link = linkMatch?.[1] || '';
    } else {
      link = item.match(/<link[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/link>/i)?.[1]?.trim() || '';
    }

    const pubDate = isAtom
      ? (item.match(/<updated[^>]*>([\s\S]*?)<\/updated>/i)?.[1]?.trim() ||
         item.match(/<published[^>]*>([\s\S]*?)<\/published>/i)?.[1]?.trim())
      : item.match(/<pubDate[^>]*>([\s\S]*?)<\/pubDate>/i)?.[1]?.trim();

    const description = isAtom
      ? (item.match(/<summary[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/summary>/i)?.[1]?.trim() ||
         item.match(/<content[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/content>/i)?.[1]?.trim() || '')
      : item.match(/<description[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/description>/i)?.[1]?.trim() || '';

    if (!title) continue;

    const cleanTitle = title
      .replace(/<[^>]*>/g, '')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'");

    const timestamp = pubDate ? new Date(pubDate) : new Date();

    items.push({
      id: `${sourceName}-${idx}`,
      title: cleanTitle,
      source: sourceName,
      url: link || '#',
      publishedAt: timestamp.toISOString(),
      timeAgo: timeAgo(timestamp),
      description: description.replace(/<[^>]*>/g, '').substring(0, 200),
      tags: [],
      severity: null,
    });
    idx++;
  }

  return items;
}

export async function fetchRSSWithFallback(
  sources: { url: string; name: string }[],
  filterKeywords: string[],
  feedName: string
): Promise<Article[]> {
  for (const src of sources) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 6000);

      const res = await fetch(src.url, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; GlobeNewsBot/1.0)',
          Accept: 'application/rss+xml, application/xml, text/xml',
        },
      });

      clearTimeout(timeout);

      if (!res.ok) {
        console.warn(`[rss:${feedName}] ${src.url} → HTTP ${res.status}`);
        continue;
      }

      const text = await res.text();
      const articles = parseRSSXML(text, src.name);

      if (articles.length === 0) {
        console.warn(`[rss:${feedName}] ${src.url} → 0 articles parsed`);
        continue;
      }

      const filtered = articles.filter((a) =>
        filterKeywords.some(
          (kw) =>
            a.title.toLowerCase().includes(kw.toLowerCase()) ||
            (a.description ?? '').toLowerCase().includes(kw.toLowerCase())
        )
      );

      return filtered.length > 0 ? filtered : articles.slice(0, 10);
    } catch (err) {
      console.error(`[rss:${feedName}] ${src.url} failed:`, err);
      continue;
    }
  }

  console.error(`[rss:${feedName}] ALL sources failed, using fallback`);
  return [];
}
