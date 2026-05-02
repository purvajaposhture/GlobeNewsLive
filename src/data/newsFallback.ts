export interface FallbackArticle {
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

export const NEWS_FALLBACK: Record<string, FallbackArticle[]> = {
  forex: [
    { id: 'fx1', title: 'Dollar strengthens as Fed signals higher-for-longer rates', source: 'Reuters', url: '#', publishedAt: new Date().toISOString(), timeAgo: '2h ago', tags: ['FED', 'USD'] },
    { id: 'fx2', title: 'Euro weakens on disappointing German manufacturing data', source: 'Bloomberg', url: '#', publishedAt: new Date().toISOString(), timeAgo: '4h ago', tags: ['EUR', 'ECB'] },
    { id: 'fx3', title: 'Yen intervention fears rise as USD/JPY approaches 160', source: 'FT', url: '#', publishedAt: new Date().toISOString(), timeAgo: '6h ago', tags: ['JPY', 'BOJ'] },
  ],
  commodities: [
    { id: 'cm1', title: 'Oil prices surge on Middle East supply concerns', source: 'Reuters', url: '#', publishedAt: new Date().toISOString(), timeAgo: '1h ago', tags: ['OIL', 'OPEC'] },
    { id: 'cm2', title: 'Gold hits new highs as safe-haven demand increases', source: 'Bloomberg', url: '#', publishedAt: new Date().toISOString(), timeAgo: '3h ago', tags: ['GOLD'] },
    { id: 'cm3', title: 'Natural gas volatility continues amid storage concerns', source: 'CNBC', url: '#', publishedAt: new Date().toISOString(), timeAgo: '5h ago', tags: ['NATGAS'] },
  ],
  crypto: [
    { id: 'cr1', title: 'Bitcoin ETF inflows reach record weekly high', source: 'CoinDesk', url: '#', publishedAt: new Date().toISOString(), timeAgo: '30m ago', tags: ['BTC', 'ETF'] },
    { id: 'cr2', title: 'Ethereum Layer 2 activity surpasses mainnet transactions', source: 'CoinTelegraph', url: '#', publishedAt: new Date().toISOString(), timeAgo: '2h ago', tags: ['ETH', 'L2'] },
    { id: 'cr3', title: 'DeFi TVL climbs as lending protocols see renewed interest', source: 'The Block', url: '#', publishedAt: new Date().toISOString(), timeAgo: '4h ago', tags: ['DEFI'] },
  ],
  'fixed-income': [
    { id: 'fi1', title: 'Treasury yields climb on stronger-than-expected jobs data', source: 'WSJ', url: '#', publishedAt: new Date().toISOString(), timeAgo: '1h ago', tags: ['TREASURY', 'YIELDS'] },
    { id: 'fi2', title: 'Corporate bond issuance hits monthly record', source: 'Bloomberg', url: '#', publishedAt: new Date().toISOString(), timeAgo: '3h ago', tags: ['CORPORATE'] },
    { id: 'fi3', title: 'Municipal bonds rally as tax-exempt demand rises', source: 'FT', url: '#', publishedAt: new Date().toISOString(), timeAgo: '5h ago', tags: ['MUNI'] },
  ],
};
