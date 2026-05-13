// ============================================================
// FITTRACK PRO — Supabase Configuration
// ============================================================
// Fill in your Supabase project credentials below to enable
// cross-device sync. Leave as empty strings to use
// localStorage-only mode (works perfectly offline).
//
// How to get these:
//   1. Go to https://supabase.com and create a free account
//   2. Create a new project
//   3. Go to Settings → API
//   4. Copy "Project URL" and "anon / public" key below
//
// Then run this SQL in your Supabase SQL editor:
//   CREATE TABLE IF NOT EXISTS fittrack_logs (
//     profile_id  TEXT NOT NULL,
//     date        TEXT NOT NULL,
//     data        JSONB NOT NULL,
//     updated_at  TIMESTAMPTZ DEFAULT NOW(),
//     PRIMARY KEY (profile_id, date)
//   );
//   CREATE TABLE IF NOT EXISTS fittrack_profiles (
//     id          TEXT PRIMARY KEY,
//     data        JSONB NOT NULL,
//     updated_at  TIMESTAMPTZ DEFAULT NOW()
//   );
//   ALTER TABLE fittrack_logs    ENABLE ROW LEVEL SECURITY;
//   ALTER TABLE fittrack_profiles ENABLE ROW LEVEL SECURITY;
//   CREATE POLICY "allow_all" ON fittrack_logs    FOR ALL USING (true) WITH CHECK (true);
//   CREATE POLICY "allow_all" ON fittrack_profiles FOR ALL USING (true) WITH CHECK (true);
// ============================================================

const SUPABASE_URL  = 'https://pzlwbnoepqjkglyougmj.supabase.co';
const SUPABASE_KEY  = 'sb_publishable_0876vWBUjcAkiYiMIawszQ_b9klTfR0';

// ── Supabase JS client ────────────────────────────────────
const supabaseClient = (window.supabase && window.supabase.createClient)
  ? window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY)
  : null;

const SUPABASE_ENABLED = !!supabaseClient;

// ── Get current auth token for REST calls ─────────────────
async function getAuthToken() {
  if (!supabaseClient) return SUPABASE_KEY;
  try {
    const { data } = await supabaseClient.auth.getSession();
    return data?.session?.access_token || SUPABASE_KEY;
  } catch(e) {
    return SUPABASE_KEY;
  }
}

// ── REST helpers ──────────────────────────────────────────
async function sbFetch(path, method = 'GET', body = null) {
  if (!SUPABASE_ENABLED) return null;
  const token = await getAuthToken();
  const opts = {
    method,
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Prefer': 'resolution=merge-duplicates',
    },
  };
  if (body) opts.body = JSON.stringify(body);
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, opts);
    if (!res.ok) return null;
    const ct = res.headers.get('content-type') || '';
    return ct.includes('json') ? await res.json() : null;
  } catch (e) {
    console.warn('[FitTrack] Supabase sync error:', e.message);
    return null;
  }
}

// ── Public API (called from app.js) ───────────────────────

/** Push a single day's log to Supabase. Profile IDs are already auth-prefixed. */
async function syncLogToCloud(profileId, dateStr, logData) {
  if (!SUPABASE_ENABLED) return;
  await sbFetch('fittrack_logs', 'POST', {
    profile_id: profileId,
    date: dateStr,
    data: logData,
    updated_at: new Date().toISOString(),
  });
}

/** Pull all logs for a profile from Supabase and merge into local */
async function pullLogsFromCloud(profileId) {
  if (!SUPABASE_ENABLED) return null;
  const rows = await sbFetch(`fittrack_logs?profile_id=eq.${encodeURIComponent(profileId)}&select=date,data`);
  if (!Array.isArray(rows)) return null;
  const merged = {};
  rows.forEach(r => { merged[r.date] = r.data; });
  return merged;
}

/** Push profile metadata to Supabase */
async function syncProfileToCloud(profile) {
  if (!SUPABASE_ENABLED) return;
  await sbFetch('fittrack_profiles', 'POST', {
    id: profile.id,
    data: profile,
    updated_at: new Date().toISOString(),
  });
}

/** Pull all profiles from Supabase for a given auth user prefix */
async function pullProfilesFromCloud(authUserId) {
  if (!SUPABASE_ENABLED) return null;
  const prefix = authUserId ? encodeURIComponent(authUserId + '_') : '';
  const filter = prefix ? `id=like.${prefix}*` : '';
  const rows = await sbFetch(`fittrack_profiles?${filter}&select=id,data`);
  if (!Array.isArray(rows)) return null;
  return rows.map(r => r.data);
}
