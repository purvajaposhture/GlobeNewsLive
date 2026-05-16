# Globe News Live — Project Document

**Version:** 2.6  
**Last Updated:** May 16, 2026  
**Owner:** Purvaja Poshture  
**Live URL:** https://globenews.live  
**GitHub:** https://github.com/purvajaposhture/GlobeNewsLive  

---

## 1. What Is Globe News Live?

Globe News Live is a **real-time global intelligence dashboard** — like a "war room" for the world. It tracks conflicts, military movements, financial markets, cyber threats, natural disasters, disease outbreaks, and infrastructure — all on an interactive 3D globe.

Think of it as: **Google Earth + Bloomberg Terminal + CNN + FlightRadar24 — all in one screen.**

The app pulls live data from 30+ sources (news wires, satellite feeds, financial APIs, military tracking networks) and displays everything in a single dark-themed dashboard.

---

## 2. Who Uses It?

| User | What They Use It For |
|------|---------------------|
| **Social Media Manager** | Grab screenshots of live conflict zones, market crashes, or natural disasters for Twitter/X posts |
| **Journalists / Researchers** | Monitor multiple conflict zones simultaneously, track breaking news before it hits mainstream |
| **Analysts / Traders** | Watch markets + geopolitical events together — oil spikes when Hormuz shipping gets disrupted |
| **General Public** | See "what's happening in the world right now" in one glance |

---

## 3. The Dashboard — What's On Screen

When you open https://globenews.live, you see:

### Center: 3D Globe
- A spinning Earth you can rotate with your mouse
- **Red dots** = active conflicts / missile strikes
- **Orange dots** = wildfires (NASA satellite data)
- **Yellow dots** = earthquakes (USGS live feed)
- **Purple dots** = cyber attacks
- **Blue dots** = ship positions in chokepoints
- **Green dots** = disease outbreaks
- **White lines** = refugee/displacement flows
- **Aircraft icons** = military planes (ISR drones, tankers, fighters)

### Left Panel: News & Intelligence
- **Signal Feed** — Breaking news from 50+ sources (Reuters, BBC, Al Jazeera, etc.)
- **Conflict Tracker** — Live events from Ukraine, Gaza, Sudan, Yemen, Myanmar, Syria
- **Flight Radar** — Real military aircraft tracking (FORTE drone over Iran, tankers near Taiwan, etc.)
- **Ship Tracker** — Vessels in Strait of Hormuz, Red Sea, Suez Canal
- **Cyber Threats** — Live APT campaigns, ransomware, zero-days
- **DEFCON Status** — Unofficial nuclear threat assessment

### Right Panel: Markets & Economy
- **Live Markets** — S&P 500, NASDAQ, Oil, Gold, Bitcoin, EUR/USD (updates every 30s)
- **Economic Indicators** — Treasury yields, VIX fear index, composite market sentiment score
- **Supply Chain** — Port congestion, chokepoint status (Hormuz delayed? Suez open?)
- **Commodities** — Oil, gas, copper, lithium, rare earth prices

### Bottom Panel: Alerts & Infrastructure
- **Missile Events** — SRBM, drone strikes, artillery, cruise missiles with origin→target arcs
- **Infrastructure** — Nuclear sites, undersea cables, pipelines, AI data centers, spaceports
- **Weather/Climate** — Hurricanes, floods, heatwaves, wildfires + climate anomalies (Arctic temp, sea level)
- **Health Outbreaks** — H5N1, Mpox, Marburg, Ebola, Hantavirus from WHO + CDC
- **Displacement** — Refugee flows and IDP hotspots (UNHCR data)

### Top Bar
- **Live TV Streams** — One-click Al Jazeera, France 24, DW, i24, Press TV, Sky News, TRT, NHK
- **Auto-scrolling ticker** — Latest headlines from 50+ RSS feeds
- **Search** — Find any event, country, or topic instantly

---

## 4. Data Sources (Where Info Comes From)

| Category | Sources | Update Frequency |
|----------|---------|-----------------|
| **News** | Reuters, BBC, AP, Al Jazeera, CNN, 50+ RSS feeds | Every 2 min |
| **Markets** | Yahoo Finance, CoinGecko | Every 30 sec |
| **Aircraft** | OpenSky Network (free ADS-B) | Every 10 sec |
| **Ships** | Simulated (MarineTraffic API ready) | Every 5 min |
| **Earthquakes** | USGS (M4.5+ worldwide) | Every 1 min |
| **Fires** | NASA FIRMS (MODIS/VIIRS satellites) | Every 5 min |
| **Weather** | NOAA, IMD, PAGASA | Every 30 min |
| **Cyber** | CISA, Hacker News, Krebs, BleepingComputer | Every 15 min |
| **Health** | WHO Disease Outbreak News, CDC, Google News RSS | Every 30 min |
| **Conflicts** | GDELT Project, ACLED, curated static data | Every 5 min |
| **Missiles** | ACLED + GDELT + synthetic fallback | Every 1 min |
| **Displacement** | UNHCR, UNRWA, OCHA (static curated) | Daily |
| **Infrastructure** | Static curated datasets | On request |
| **DEFCON** | Manual assessment based on open-source intel | As needed |

**Important:** Some data is simulated/curated (ships, displacement, infrastructure) because real APIs require paid subscriptions. The app marks simulated data with "DEMO" or "SIM" badges.

---

## 5. Key Features for Social Media

### Screenshot-Ready Panels
Every panel is designed to look good in screenshots:
- Dark theme with neon accents (cyan, purple, red, orange)
- Clean typography — works at any zoom level
- Emoji icons for quick visual scanning
- Critical alerts pulse/animate to catch attention

### One-Click Sharing
- Click any news item → copy headline + link
- Click any aircraft → get callsign, altitude, speed, coordinates
- Click any market → get price + change percentage
- Click any fire/earthquake → get magnitude, location, depth

### Live TV for Reaction Content
- 12 news channels embedded (Al Jazeera, i24, Press TV, etc.)
- Perfect for "watching live coverage while monitoring data" content

### Auto-Refreshing Headlines
- Top ticker scrolls latest headlines automatically
- Great for "breaking news" reaction videos

---

## 6. How to Use — Quick Guide

### For Social Media Manager:
1. Open https://globenews.live
2. Find interesting event (red dot on globe = conflict, orange = fire, etc.)
3. Click the dot → details panel opens
4. Screenshot the panel + globe view
5. Post to Twitter/X with caption: "Live: [event] — tracking at globenews.live"
6. For breaking news: Check Signal Feed (left panel) for latest headlines
7. For market reactions: Check right panel for oil/gold/bitcoin moves

### For Journalists/Researchers:
1. Use region filters (Middle East, Ukraine, Taiwan, etc.) to focus
2. Click "MILITARY ONLY" in Flight Radar to see just military aircraft
3. Check "CRITICAL ISR ACTIVE" alerts for spy drones (FORTE, HOMER)
4. Use Missile Events panel to see strike origin → target arcs
5. Cross-reference with Live TV streams for ground reporting

### For Traders/Analysts:
1. Watch composite market sentiment score (0-100, green=good, red=bad)
2. Monitor VIX (fear index) — spikes during geopolitical events
3. Check oil prices when Hormuz/Red Sea alerts fire
4. Watch Bitcoin during banking crises or currency devaluations
5. Treasury yields show flight-to-safety during conflicts

---

## 7. Tech Stack (For Developers)

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 16, React, TypeScript, Tailwind CSS |
| **3D Globe** | Three.js + React Three Fiber |
| **Maps** | MapLibre GL (OpenStreetMap) |
| **Backend** | Next.js API Routes (serverless) |
| **Database** | PostgreSQL (via Unix socket, local dev) |
| **Hosting** | Self-hosted on Ubuntu server |
| **Process Manager** | PM2 |
| **Data Fetching** | SWR (stale-while-revalidate) for real-time updates |

---

## 8. API Endpoints (For Power Users)

All data is available via REST API:

| Endpoint | What It Returns |
|----------|----------------|
| `/api/signals` | Breaking news signals |
| `/api/flights?region=middleeast` | Aircraft in region |
| `/api/markets` | Live market data |
| `/api/finance` | Full finance dashboard data |
| `/api/earthquakes` | M4.5+ earthquakes (USGS) |
| `/api/fires` | NASA FIRMS fire detections |
| `/api/weather` | Weather alerts + climate anomalies |
| `/api/cyber` | Cyber threat intelligence |
| `/api/health-outbreaks` | Disease outbreak map data |
| `/api/conflicts` | Active conflict events |
| `/api/missile-events` | Missile/drone strike events |
| `/api/defcon` | Nuclear threat assessment |
| `/api/ships?region=hormuz` | Vessel tracking |
| `/api/supply-chain` | Port/chokepoint status |
| `/api/infrastructure` | Critical infrastructure layers |
| `/api/displacement` | Refugee/IDP data |
| `/api/live-streams` | TV channel URLs |
| `/api/alerts` | Configure notifications |

---

## 9. Alert System

Users can set up notifications:
- **Keyword alerts** — Get Telegram message when "nuclear" or "Hormuz" appears
- **Severity alerts** — All CRITICAL events pushed instantly
- **Region alerts** — Any event in "Ukraine" or "Taiwan"
- **Flight alerts** — When specific aircraft (e.g., FORTE12) appears

Configure at: `POST /api/alerts` (developer feature)

---

## 10. Known Limitations

1. **GitHub Token Expired** — Can't auto-create PRs. Push branches manually.
2. **Some Data Simulated** — Ships, displacement, some cyber threats use curated data (marked with "SIM" or "DEMO")
3. **OpenSky Rate Limits** — Free tier limits requests; falls back to simulated aircraft
4. **YouTube Embeds** — Live TV uses direct HLS streams (more reliable than YouTube embeds)
5. **No User Accounts** — Currently public dashboard only; no login system

---

## 11. Quick Reference Card

| You Want To... | Do This |
|----------------|---------|
| See breaking news | Check Signal Feed (left panel) |
| Track a war zone | Click red dots on globe or use Conflict Tracker |
| Watch oil prices during conflict | Right panel → Markets → Oil WTI |
| Find military aircraft | Left panel → Flight Radar → select region |
| See refugee flows | Bottom panel → Displacement |
| Check if nukes are a threat | Bottom panel → DEFCON Status |
| Watch live news | Top bar → Live TV dropdown |
| Screenshot for social media | Any panel → fullscreen → screenshot |
| Get raw data | Use `/api/[endpoint]` (see section 8) |

---

## 12. Contact & Support

- **Owner:** Purvaja Poshture
- **GitHub:** https://github.com/purvajaposhture/GlobeNewsLive
- **Live Site:** https://globenews.live
- **Local Dev:** http://localhost:3400

---

*This document is maintained by the project owner. For technical deep-dives, see the codebase README and inline code documentation.*
