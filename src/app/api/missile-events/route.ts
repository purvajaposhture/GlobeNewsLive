import { NextResponse } from 'next/server';
import { ACTIVE_CONFLICTS } from '@/lib/feeds';
import type { MissileEvent } from '@/types';

export const revalidate = 60;

const SPEED_MAP: Record<MissileEvent['type'], number> = {
  ICBM: 25000,
  MRBM: 15000,
  SRBM: 8000,
  CRUISE: 900,
  DRONE: 200,
  AIRSTRIKE: 500,
  ARTILLERY: 2000,
  INTERCEPTION: 12000,
};

const ALT_MAP: Record<MissileEvent['type'], number> = {
  ICBM: 1200,
  MRBM: 300,
  SRBM: 100,
  CRUISE: 0.05,
  DRONE: 3,
  AIRSTRIKE: 10,
  ARTILLERY: 20,
  INTERCEPTION: 50,
};

const WARHEADS = ['HE', 'FRAG', 'MIRV', 'KE', 'CLUSTER', 'CHEM', 'UNKNOWN'];

function inferType(text: string): MissileEvent['type'] {
  const t = text.toLowerCase();
  if (t.includes('interception') || t.includes('intercept') || t.includes('patriot') || t.includes('iron dome') || t.includes('thaad')) return 'INTERCEPTION';
  if (t.includes('drone') || t.includes('uav') || t.includes('unmanned')) return 'DRONE';
  if (t.includes('icbm') || t.includes('intercontinental')) return 'ICBM';
  if (t.includes('hypersonic') || t.includes('cruise')) return 'CRUISE';
  if (t.includes('airstrike') || t.includes('air strike') || t.includes('air raid')) return 'AIRSTRIKE';
  if (t.includes('artillery') || t.includes('shell') || t.includes('mortar')) return 'ARTILLERY';
  if (t.includes('srbm') || t.includes('short-range')) return 'SRBM';
  if (t.includes('mrbm') || t.includes('medium-range')) return 'MRBM';
  if (t.includes('ballistic')) return 'MRBM';
  return 'SRBM';
}

function inferStatus(text: string): MissileEvent['status'] {
  const t = text.toLowerCase();
  if (t.includes('intercept') || t.includes('shot down') || t.includes('destroyed in air')) return 'intercepted';
  if (t.includes('impact') || t.includes('hit') || t.includes('destroyed') || t.includes('casualties')) return 'impact';
  return 'active';
}

function randomOffset(min: number, max: number): number {
  const val = min + Math.random() * (max - min);
  return Math.random() > 0.5 ? val : -val;
}

function generateId(source: MissileEvent['source'], timestamp: number, idx: number): string {
  return `EVT-${source}-${timestamp}-${idx}`;
}

async function fetchACLED(): Promise<MissileEvent[]> {
  const key = process.env.ACLED_API_KEY;
  const email = process.env.ACLED_EMAIL;
  if (!key || !email) {
    console.log('[missile-events] ACLED: missing API key or email');
    return [];
  }

  try {
    const url = `https://api.acleddata.com/acled/read?event_type=Explosions%2FRemote+violence&limit=100&fields=data_id,event_date,event_type,sub_event_type,actor1,actor2,country,location,latitude,longitude,notes,fatalities&key=${encodeURIComponent(key)}&email=${encodeURIComponent(email)}`;
    const res = await fetch(url, {
      headers: { 'User-Agent': 'GlobeNews-Live/2.0' },
      next: { revalidate: 60 },
    });
    if (!res.ok) {
      console.log('[missile-events] ACLED: HTTP', res.status);
      return [];
    }
    const json = await res.json();
    const data = Array.isArray(json?.data) ? json.data : Array.isArray(json) ? json : [];
    const ts = Date.now();

    return data.slice(0, 50).map((e: any, i: number): MissileEvent => {
      const lat = parseFloat(e.latitude) || 0;
      const lon = parseFloat(e.longitude) || 0;
      const notes = String(e.notes || '');
      const type = inferType(`${notes} ${e.sub_event_type || ''} ${e.event_type || ''}`);
      const status = inferStatus(notes);
      const origin: [number, number] = [lat + randomOffset(0.5, 2), lon + randomOffset(0.5, 2)];
      const target: [number, number] = [lat, lon];

      return {
        id: generateId('ACLED', ts, i),
        type,
        origin,
        target,
        label: `${e.country || 'Unknown'} - ${e.location || 'Unknown'} (${e.actor1 || 'Unknown'})`,
        speed: SPEED_MAP[type],
        altitude: ALT_MAP[type],
        warhead: WARHEADS[Math.floor(Math.random() * WARHEADS.length)],
        status,
        confidence: 75 + Math.floor(Math.random() * 20),
        source: 'ACLED',
        timestamp: new Date(e.event_date || Date.now()).toISOString(),
        region: String(e.country || 'Unknown'),
        fatalities: typeof e.fatalities === 'number' ? e.fatalities : parseInt(e.fatalities, 10) || 0,
      };
    });
  } catch (err) {
    console.error('[missile-events] ACLED error:', err);
    return [];
  }
}

async function fetchGDELT(): Promise<MissileEvent[]> {
  try {
    const url = 'https://api.gdeltproject.org/api/v2/geo/geo?query=missile+drone+strike+interception&mode=artlist&maxrecords=75&format=json';
    const res = await fetch(url, {
      headers: { 'User-Agent': 'GlobeNews-Live/2.0' },
      next: { revalidate: 60 },
    });
    if (!res.ok) {
      console.log('[missile-events] GDELT: HTTP', res.status);
      return [];
    }
    const json = await res.json();
    const features = Array.isArray(json?.features) ? json.features : [];
    const articles = Array.isArray(json?.articles) ? json.articles : [];
    const raw = features.length > 0 ? features : articles;
    const ts = Date.now();

    return raw.slice(0, 50).map((item: any, i: number): MissileEvent => {
      let lat = 0;
      let lon = 0;
      let title = '';
      let seendate = '';

      if (item.geometry?.coordinates) {
        lon = parseFloat(item.geometry.coordinates[0]) || 0;
        lat = parseFloat(item.geometry.coordinates[1]) || 0;
        title = item.properties?.name || item.properties?.title || '';
        seendate = item.properties?.date || '';
      } else {
        lat = parseFloat(item.lat) || parseFloat(item.latitude) || 0;
        lon = parseFloat(item.lon) || parseFloat(item.longitude) || 0;
        title = item.title || item.name || '';
        seendate = item.seendate || item.date || '';
      }

      const type = inferType(title);
      const status = inferStatus(title);
      const origin: [number, number] = [lat + randomOffset(0.5, 2), lon + randomOffset(0.5, 2)];
      const target: [number, number] = [lat, lon];

      let timestamp: string;
      try {
        timestamp = seendate ? new Date(seendate).toISOString() : new Date().toISOString();
      } catch {
        timestamp = new Date().toISOString();
      }

      return {
        id: generateId('GDELT', ts, i),
        type,
        origin,
        target,
        label: title || `GDELT Event ${i + 1}`,
        speed: SPEED_MAP[type],
        altitude: ALT_MAP[type],
        warhead: WARHEADS[Math.floor(Math.random() * WARHEADS.length)],
        status,
        confidence: 50 + Math.floor(Math.random() * 25),
        source: 'GDELT',
        timestamp,
        region: 'Unknown',
        fatalities: 0,
      };
    });
  } catch (err) {
    console.error('[missile-events] GDELT error:', err);
    return [];
  }
}

async function fetchFIRMS(): Promise<MissileEvent[]> {
  try {
    const url = 'https://firms.modaps.eosdis.nasa.gov/api/area/csv/VIIRS_SNPP_NRT/world/1';
    const res = await fetch(url, {
      headers: { 'User-Agent': 'GlobeNews-Live/2.0' },
      next: { revalidate: 60 },
    });
    if (!res.ok) {
      console.log('[missile-events] FIRMS: HTTP', res.status);
      return [];
    }
    const text = await res.text();
    const lines = text.split('\n').filter(l => l.trim());
    if (lines.length < 2) return [];

    const headers = lines[0].split(',').map(h => h.trim());
    const latIdx = headers.indexOf('latitude');
    const lonIdx = headers.indexOf('longitude');
    const confIdx = headers.indexOf('confidence');
    const dateIdx = headers.indexOf('acq_date');
    const frpIdx = headers.indexOf('frp');

    const ts = Date.now();
    const events: MissileEvent[] = [];

    for (let i = 1; i < Math.min(lines.length, 51); i++) {
      const cols = lines[i].split(',');
      if (cols.length < Math.max(latIdx, lonIdx) + 1) continue;
      const lat = parseFloat(cols[latIdx]);
      const lon = parseFloat(cols[lonIdx]);
      if (Number.isNaN(lat) || Number.isNaN(lon)) continue;

      const conf = confIdx >= 0 ? parseInt(cols[confIdx], 10) : 60;
      const dateStr = dateIdx >= 0 ? cols[dateIdx] : new Date().toISOString().split('T')[0];
      const frp = frpIdx >= 0 ? parseFloat(cols[frpIdx]) : 0;

      const type: MissileEvent['type'] = frp > 50 ? 'AIRSTRIKE' : Math.random() > 0.5 ? 'ARTILLERY' : 'SRBM';
      const origin: [number, number] = [lat + randomOffset(0.5, 2), lon + randomOffset(0.5, 2)];
      const target: [number, number] = [lat, lon];

      events.push({
        id: generateId('FIRMS', ts, i - 1),
        type,
        origin,
        target,
        label: 'Thermal anomaly detected',
        speed: SPEED_MAP[type],
        altitude: ALT_MAP[type],
        warhead: 'HE',
        status: Math.random() > 0.7 ? 'impact' : 'active',
        confidence: Number.isNaN(conf) ? 60 : Math.min(100, Math.max(0, conf)),
        source: 'FIRMS',
        timestamp: new Date(dateStr).toISOString(),
        region: 'Unknown',
        fatalities: 0,
      });
    }
    return events;
  } catch (err) {
    console.error('[missile-events] FIRMS error:', err);
    return [];
  }
}

function generateSyntheticEvents(count: number): MissileEvent[] {
  const ts = Date.now();
  const types: MissileEvent['type'][] = ['ICBM', 'MRBM', 'SRBM', 'CRUISE', 'DRONE', 'AIRSTRIKE', 'ARTILLERY', 'INTERCEPTION'];

  return Array.from({ length: count }, (_, i): MissileEvent => {
    const conflict = ACTIVE_CONFLICTS[Math.floor(Math.random() * ACTIVE_CONFLICTS.length)];
    const type = types[Math.floor(Math.random() * types.length)];
    const lat = conflict.lat;
    const lon = conflict.lon;
    const origin: [number, number] = [lat + randomOffset(0.5, 2), lon + randomOffset(0.5, 2)];
    const target: [number, number] = [lat + randomOffset(0.2, 1.5), lon + randomOffset(0.2, 1.5)];

    return {
      id: generateId('SYNTHETIC', ts, i),
      type,
      origin,
      target,
      label: `${conflict.name} - ${type}`,
      speed: SPEED_MAP[type],
      altitude: ALT_MAP[type],
      warhead: WARHEADS[Math.floor(Math.random() * WARHEADS.length)],
      status: Math.random() > 0.8 ? 'intercepted' : Math.random() > 0.6 ? 'impact' : 'active',
      confidence: 30 + Math.floor(Math.random() * 20),
      source: 'SYNTHETIC',
      timestamp: new Date(Date.now() - Math.random() * 86400000).toISOString(),
      region: conflict.name,
      fatalities: Math.floor(Math.random() * 20),
    };
  });
}

export async function GET() {
  const now = new Date();
  let events: MissileEvent[] = [];
  let source: MissileEvent['source'] = 'SYNTHETIC';

  const acled = await fetchACLED();
  if (acled.length > 0) {
    events = acled;
    source = 'ACLED';
  } else {
    const gdelt = await fetchGDELT();
    if (gdelt.length > 0) {
      events = gdelt;
      source = 'GDELT';
    } else {
      const firms = await fetchFIRMS();
      if (firms.length > 0) {
        events = firms;
        source = 'FIRMS';
      } else {
        events = generateSyntheticEvents(12);
        source = 'SYNTHETIC';
      }
    }
  }

  return NextResponse.json({
    events,
    meta: {
      count: events.length,
      source,
      lastUpdated: now.toISOString(),
    },
  });
}
