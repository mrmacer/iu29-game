import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  limit,
  serverTimestamp,
} from 'firebase/firestore';

// Browser-safe web config — these are public keys protected by Firestore Security Rules.
const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
};

export const isConfigured = Object.values(firebaseConfig).every(Boolean);

let db = null;
if (isConfigured) {
  const app = initializeApp(firebaseConfig);
  db = getFirestore(app);
}

const COLLECTION = 'leaderboard';

export async function saveScore({ player_name, score, time_seconds, accuracy, crowns }) {
  if (!db) return { error: 'not_configured' };
  try {
    await addDoc(collection(db, COLLECTION), {
      player_name,
      score,
      game_name:    'IU29 Staff Recognition',
      time_seconds: time_seconds ?? null,
      accuracy:     accuracy     ?? null,
      crowns:       crowns       ?? 0,
      timestamp:    serverTimestamp(),
    });
    return {};
  } catch (error) {
    return { error };
  }
}

export async function getLeaderboard(topN = 10) {
  if (!db) return { data: null, error: 'not_configured' };
  try {
    const q = query(
      collection(db, COLLECTION),
      orderBy('score', 'desc'),
      limit(topN)
    );
    const snap = await getDocs(q);
    const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return { data };
  } catch (error) {
    return { data: null, error };
  }
}

// ── localStorage fallback ─────────────────────────────────────────────────────

const LOCAL_KEY = 'iu29_leaderboard';

export function saveScoreLocal(entry) {
  const existing = JSON.parse(localStorage.getItem(LOCAL_KEY) || '[]');
  existing.push({ ...entry, id: Date.now(), created_at: new Date().toISOString() });
  existing.sort(
    (a, b) =>
      b.score - a.score ||
      (a.time_seconds ?? Infinity) - (b.time_seconds ?? Infinity) ||
      (b.accuracy ?? 0) - (a.accuracy ?? 0)
  );
  localStorage.setItem(LOCAL_KEY, JSON.stringify(existing.slice(0, 50)));
}

export function getLeaderboardLocal() {
  return JSON.parse(localStorage.getItem(LOCAL_KEY) || '[]');
}
