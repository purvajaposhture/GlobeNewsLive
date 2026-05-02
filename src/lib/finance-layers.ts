export interface FinanceLocation {
  name: string;
  lat: number;
  lon: number;
  country: string;
  type: string;
  description?: string;
  status?: string;
}

export const STOCK_EXCHANGES: FinanceLocation[] = [
  { name: "NYSE", lat: 40.7061, lon: -74.0087, country: "USA", type: "stock", description: "New York Stock Exchange — world's largest by market cap" },
  { name: "NASDAQ", lat: 40.7414, lon: -73.9896, country: "USA", type: "stock", description: "NASDAQ — tech-heavy exchange" },
  { name: "LSE", lat: 51.5156, lon: -0.0994, country: "UK", type: "stock", description: "London Stock Exchange" },
  { name: "TSE", lat: 35.6812, lon: 139.7747, country: "Japan", type: "stock", description: "Tokyo Stock Exchange — Asia's largest" },
  { name: "SSE", lat: 31.2304, lon: 121.4737, country: "China", type: "stock", description: "Shanghai Stock Exchange" },
  { name: "HKEX", lat: 22.2833, lon: 114.1588, country: "Hong Kong", type: "stock", description: "Hong Kong Stock Exchange" },
  { name: "Euronext", lat: 48.8566, lon: 2.3522, country: "France", type: "stock", description: "Euronext Paris" },
  { name: "Deutsche Börse", lat: 50.1109, lon: 8.6821, country: "Germany", type: "stock", description: "Frankfurt Stock Exchange" },
  { name: "SIX Swiss", lat: 47.3769, lon: 8.5417, country: "Switzerland", type: "stock", description: "Swiss Exchange Zurich" },
  { name: "BSE", lat: 18.9291, lon: 72.8337, country: "India", type: "stock", description: "Bombay Stock Exchange" },
  { name: "NSE India", lat: 19.0607, lon: 72.8634, country: "India", type: "stock", description: "National Stock Exchange of India" },
  { name: "ASX", lat: -33.8688, lon: 151.2093, country: "Australia", type: "stock", description: "Australian Securities Exchange" },
  { name: "BM&F Bovespa", lat: -23.5505, lon: -46.6333, country: "Brazil", type: "stock", description: "São Paulo Stock Exchange" },
  { name: "JSE", lat: -26.2041, lon: 28.0473, country: "South Africa", type: "stock", description: "Johannesburg Stock Exchange" },
  { name: "Bursa Malaysia", lat: 3.139, lon: 101.6869, country: "Malaysia", type: "stock", description: "Kuala Lumpur" },
  { name: "KRX", lat: 37.5665, lon: 126.978, country: "South Korea", type: "stock", description: "Korea Exchange — Seoul" },
];

export const FINANCIAL_CENTERS: FinanceLocation[] = [
  { name: "New York", lat: 40.7128, lon: -74.006, country: "USA", type: "center", description: "Primary global financial center" },
  { name: "London", lat: 51.5074, lon: -0.1278, country: "UK", type: "center", description: "Europe's financial hub" },
  { name: "Hong Kong", lat: 22.3193, lon: 114.1694, country: "China", type: "center", description: "Asia-Pacific gateway" },
  { name: "Singapore", lat: 1.3521, lon: 103.8198, country: "Singapore", type: "center", description: "Southeast Asia hub" },
  { name: "Tokyo", lat: 35.6762, lon: 139.6503, country: "Japan", type: "center", description: "Japan's financial capital" },
  { name: "Zurich", lat: 47.3769, lon: 8.5417, country: "Switzerland", type: "center", description: "Wealth management center" },
  { name: "Dubai", lat: 25.2048, lon: 55.2708, country: "UAE", type: "center", description: "MENA financial hub" },
  { name: "Shanghai", lat: 31.2304, lon: 121.4737, country: "China", type: "center", description: "China's rising financial center" },
  { name: "Sydney", lat: -33.8688, lon: 151.2093, country: "Australia", type: "center", description: "Oceania hub" },
  { name: "Frankfurt", lat: 50.1109, lon: 8.6821, country: "Germany", type: "center", description: "Eurozone banking center" },
  { name: "Paris", lat: 48.8566, lon: 2.3522, country: "France", type: "center", description: "EU financial hub" },
  { name: "Chicago", lat: 41.8781, lon: -87.6298, country: "USA", type: "center", description: "Derivatives & futures hub" },
  { name: "Toronto", lat: 43.6532, lon: -79.3832, country: "Canada", type: "center", description: "North American hub" },
  { name: "São Paulo", lat: -23.5505, lon: -46.6333, country: "Brazil", type: "center", description: "Latin America hub" },
  { name: "Mumbai", lat: 19.076, lon: 72.8777, country: "India", type: "center", description: "India's financial capital" },
];

export const CENTRAL_BANKS: FinanceLocation[] = [
  { name: "Federal Reserve", lat: 38.9072, lon: -77.0369, country: "USA", type: "central-bank", description: "Fed — Washington D.C." },
  { name: "ECB", lat: 50.1109, lon: 8.6821, country: "EU", type: "central-bank", description: "European Central Bank — Frankfurt" },
  { name: "Bank of England", lat: 51.5074, lon: -0.1278, country: "UK", type: "central-bank", description: "BOE — London" },
  { name: "Bank of Japan", lat: 35.6762, lon: 139.6503, country: "Japan", type: "central-bank", description: "BOJ — Tokyo" },
  { name: "People's Bank of China", lat: 39.9042, lon: 116.4074, country: "China", type: "central-bank", description: "PBOC — Beijing" },
  { name: "Swiss National Bank", lat: 47.3769, lon: 8.5417, country: "Switzerland", type: "central-bank", description: "SNB — Zurich" },
  { name: "Bank of Canada", lat: 45.4215, lon: -75.6972, country: "Canada", type: "central-bank", description: "Ottawa" },
  { name: "Reserve Bank of India", lat: 18.9291, lon: 72.8337, country: "India", type: "central-bank", description: "RBI — Mumbai" },
  { name: "Bank of Russia", lat: 55.7558, lon: 37.6173, country: "Russia", type: "central-bank", description: "Moscow" },
  { name: "Saudi Central Bank", lat: 24.7136, lon: 46.6753, country: "Saudi Arabia", type: "central-bank", description: "SAMA — Riyadh" },
  { name: "Central Bank of UAE", lat: 24.4539, lon: 54.3773, country: "UAE", type: "central-bank", description: "Abu Dhabi" },
  { name: "RBA", lat: -33.8688, lon: 151.2093, country: "Australia", type: "central-bank", description: "Reserve Bank of Australia — Sydney" },
];

export const COMMODITY_HUBS: FinanceLocation[] = [
  { name: "Houston Energy Hub", lat: 29.7604, lon: -95.3698, country: "USA", type: "commodity", description: "Oil & gas trading center" },
  { name: "Rotterdam", lat: 51.9244, lon: 4.4777, country: "Netherlands", type: "commodity", description: "Europe's energy & commodities port" },
  { name: "Singapore Commodity Hub", lat: 1.3521, lon: 103.8198, country: "Singapore", type: "commodity", description: "Asia commodities trading" },
  { name: "Dubai DMCC", lat: 25.2048, lon: 55.2708, country: "UAE", type: "commodity", description: "Gold & diamond trading hub" },
  { name: "London Metals Exchange", lat: 51.5074, lon: -0.1278, country: "UK", type: "commodity", description: "LME — metals benchmark" },
  { name: "Chicago Mercantile", lat: 41.8781, lon: -87.6298, country: "USA", type: "commodity", description: "CME Group — futures & options" },
  { name: "Basel", lat: 47.5596, lon: 7.5886, country: "Switzerland", type: "commodity", description: "Precious metals hub" },
  { name: "Antwerp", lat: 51.2194, lon: 4.4025, country: "Belgium", type: "commodity", description: "Diamond trading center" },
];

export const GCC_INVESTMENTS: FinanceLocation[] = [
  { name: "PIF — Riyadh", lat: 24.7136, lon: 46.6753, country: "Saudi Arabia", type: "gcc", description: "Sovereign wealth fund — $925B AUM" },
  { name: "ADIA — Abu Dhabi", lat: 24.4539, lon: 54.3773, country: "UAE", type: "gcc", description: "Abu Dhabi Investment Authority" },
  { name: "QIA — Doha", lat: 25.2854, lon: 51.531, country: "Qatar", type: "gcc", description: "Qatar Investment Authority" },
  { name: "KIA — Kuwait City", lat: 29.3759, lon: 47.9774, country: "Kuwait", type: "gcc", description: "Kuwait Investment Authority" },
  { name: "Mubadala — Abu Dhabi", lat: 24.4539, lon: 54.3773, country: "UAE", type: "gcc", description: "Strategic investment fund" },
  { name: "Dubai Holding", lat: 25.2048, lon: 55.2708, country: "UAE", type: "gcc", description: "Dubai sovereign investment" },
];

export const INTERNET_DISRUPTIONS: FinanceLocation[] = [
  { name: "Red Sea Cable Cut", lat: 19.0, lon: 40.0, country: "Yemen/Red Sea", type: "internet", description: "Multiple subsea cable disruptions", status: "active" },
  { name: "Taiwan Strait Outage", lat: 24.0, lon: 121.0, country: "Taiwan", type: "internet", description: "Subsea cable damage reported", status: "active" },
  { name: "Baltic Cable Sabotage", lat: 55.5, lon: 18.5, country: "Baltic Sea", type: "internet", description: "Investigation ongoing", status: "active" },
];

export const WEATHER_ALERTS: FinanceLocation[] = [
  { name: "North Atlantic Storm", lat: 45.0, lon: -35.0, country: "Atlantic", type: "weather", description: "Severe shipping disruption", status: "warning" },
  { name: "Gulf of Mexico Hurricane", lat: 25.0, lon: -90.0, country: "Gulf of Mexico", type: "weather", description: "Oil platform evacuations", status: "watch" },
  { name: "Indian Ocean Cyclone", lat: -10.0, lon: 85.0, country: "Indian Ocean", type: "weather", description: "Trade route disruption", status: "warning" },
];

export const ECONOMIC_CENTERS: FinanceLocation[] = [
  { name: "Silicon Valley", lat: 37.4419, lon: -122.143, country: "USA", type: "economic", description: "Tech capital — $3T+ market cap" },
  { name: "Shenzhen", lat: 22.5431, lon: 114.0579, country: "China", type: "economic", description: "Manufacturing & tech hub" },
  { name: "Seoul", lat: 37.5665, lon: 126.978, country: "South Korea", type: "economic", description: "Semiconductor & electronics" },
  { name: "Taipei", lat: 25.033, lon: 121.5654, country: "Taiwan", type: "economic", description: "TSMC & chip manufacturing" },
  { name: "Bangalore", lat: 12.9716, lon: 77.5946, country: "India", type: "economic", description: "India's Silicon Valley" },
  { name: "Tel Aviv", lat: 32.0853, lon: 34.7818, country: "Israel", type: "economic", description: "Startup Nation hub" },
];

export const SANCTIONS_TARGETS: FinanceLocation[] = [
  { name: "Iran — Oil Terminals", lat: 27.0, lon: 52.0, country: "Iran", type: "sanctions", description: "Oil export restrictions active" },
  { name: "Russia — Financial Sector", lat: 55.7558, lon: 37.6173, country: "Russia", type: "sanctions", description: "SWIFT sanctions in effect" },
  { name: "North Korea", lat: 39.0392, lon: 125.7625, country: "DPRK", type: "sanctions", description: "Comprehensive UN sanctions" },
  { name: "Venezuela Oil", lat: 10.0, lon: -66.0, country: "Venezuela", type: "sanctions", description: "PDVSA sanctions regime" },
  { name: "Syria", lat: 34.8021, lon: 38.9968, country: "Syria", type: "sanctions", description: "Caesar Act sanctions" },
];

export const CYBER_THREATS: FinanceLocation[] = [
  { name: "APT41 — China", lat: 39.9042, lon: 116.4074, country: "China", type: "cyber", description: "Advanced persistent threat group", status: "active" },
  { name: "Lazarus Group — DPRK", lat: 39.0392, lon: 125.7625, country: "North Korea", type: "cyber", description: "State-sponsored crypto theft", status: "active" },
  { name: "Sandworm — Russia", lat: 55.7558, lon: 37.6173, country: "Russia", type: "cyber", description: "Critical infrastructure targeting", status: "active" },
  { name: "Ransomware Hub", lat: 55.0, lon: 37.0, country: "Eastern Europe", type: "cyber", description: "Ransomware-as-a-service network", status: "active" },
];

export const RESILIENCE_INDEX: FinanceLocation[] = [
  { name: "Singapore Strait", lat: 1.2, lon: 103.8, country: "Singapore", type: "resilience", description: "Supply chain resilience: HIGH" },
  { name: "Suez Canal", lat: 30.0, lon: 32.5, country: "Egypt", type: "resilience", description: "Supply chain resilience: MEDIUM" },
  { name: "Panama Canal", lat: 9.0, lon: -79.5, country: "Panama", type: "resilience", description: "Supply chain resilience: MEDIUM" },
  { name: "Strait of Hormuz", lat: 26.5, lon: 56.5, country: "Oman/Iran", type: "resilience", description: "Supply chain resilience: LOW" },
  { name: "Bosporus", lat: 41.0, lon: 29.0, country: "Turkey", type: "resilience", description: "Supply chain resilience: MEDIUM" },
  { name: "Strait of Malacca", lat: 2.0, lon: 102.0, country: "Malaysia", type: "resilience", description: "Supply chain resilience: HIGH" },
];

export const NATURAL_EVENTS: FinanceLocation[] = [
  { name: "Ring of Fire — Pacific", lat: 35.0, lon: 140.0, country: "Pacific Rim", type: "natural", description: "Volcanic & seismic activity zone" },
  { name: "Yellowstone Caldera", lat: 44.428, lon: -110.5885, country: "USA", type: "natural", description: "Supervolcano monitoring" },
  { name: "Iceland Volcanic Zone", lat: 64.9631, lon: -19.0208, country: "Iceland", type: "natural", description: "Active volcanic system" },
  { name: "Cascadia Subduction", lat: 45.0, lon: -125.0, country: "USA/Canada", type: "natural", description: "Megathrust earthquake risk" },
];

export const DAY_NIGHT_CENTERS: FinanceLocation[] = [
  { name: "UTC+0 — London", lat: 51.5074, lon: -0.1278, country: "UK", type: "daynight", description: "Market open: 08:00-16:30 GMT" },
  { name: "UTC+8 — Singapore", lat: 1.3521, lon: 103.8198, country: "Singapore", type: "daynight", description: "Market open: 09:00-17:00 SGT" },
  { name: "UTC+9 — Tokyo", lat: 35.6762, lon: 139.6503, country: "Japan", type: "daynight", description: "Market open: 09:00-15:00 JST" },
  { name: "UTC-5 — New York", lat: 40.7128, lon: -74.006, country: "USA", type: "daynight", description: "Market open: 09:30-16:00 EST" },
  { name: "UTC-3 — São Paulo", lat: -23.5505, lon: -46.6333, country: "Brazil", type: "daynight", description: "Market open: 10:00-17:00 BRT" },
];
