import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

export const isSupabaseConfigured = !!supabase;

export async function saveScore({ player_name, score, time_seconds, accuracy, crowns }) {
  if (!supabase) return { error: 'not_configured' };
  return supabase
    .from('leaderboard_entries')
    .insert([{ player_name, score, time_seconds, accuracy, crowns }]);
}

export async function getLeaderboard(limit = 20) {
  if (!supabase) return { data: null, error: 'not_configured' };
  return supabase
    .from('leaderboard_entries')
    .select('id, player_name, score, time_seconds, accuracy, crowns, created_at')
    .order('score', { ascending: false })
    .order('time_seconds', { ascending: true })
    .order('accuracy', { ascending: false })
    .limit(limit);
}

// ── localStorage fallback (used when Supabase is not configured) ──

const LOCAL_KEY = 'iu29_leaderboard';

export function saveScoreLocal(entry) {
  const existing = JSON.parse(localStorage.getItem(LOCAL_KEY) || '[]');
  existing.push({ ...entry, id: Date.now(), created_at: new Date().toISOString() });
  existing.sort(
    (a, b) =>
      b.score - a.score ||
      a.time_seconds - b.time_seconds ||
      b.accuracy - a.accuracy
  );
  localStorage.setItem(LOCAL_KEY, JSON.stringify(existing.slice(0, 50)));
}

export function getLeaderboardLocal() {
  return JSON.parse(localStorage.getItem(LOCAL_KEY) || '[]');
}
