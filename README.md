# IU29 Staff Recognition Game

A React/Vite quiz game where you identify IU29 Schuylkill staff members from their photos. Scores are saved to a shared Supabase leaderboard visible to all players.

## Local Development

```bash
npm install
npm run dev
```

The game works without Supabase — scores fall back to `localStorage` automatically.

## Deployment (Vercel)

| Setting | Value |
|---|---|
| Framework | Vite |
| Build command | `npm run build` |
| Output directory | `dist` |
| Install command | `npm install` |

Add the environment variables below in **Vercel → Project → Settings → Environment Variables**.

## Environment Variables

| Variable | Description |
|---|---|
| `VITE_SUPABASE_URL` | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anon/public key |

Copy `.env.example` to `.env` for local Supabase testing:
```bash
cp .env.example .env
# fill in your values
```

## Supabase Setup

Run this SQL in your Supabase project (**SQL Editor → New query**):

```sql
-- Create the leaderboard table
create table if not exists leaderboard_entries (
  id           uuid primary key default gen_random_uuid(),
  player_name  text not null,
  score        integer not null,
  time_seconds integer,
  accuracy     integer,
  crowns       integer default 0,
  created_at   timestamptz default now()
);

-- Enable Row Level Security
alter table leaderboard_entries enable row level security;

-- Anyone can read
create policy "public read"
  on leaderboard_entries for select
  using (true);

-- Anyone can insert
create policy "public insert"
  on leaderboard_entries for insert
  with check (true);

-- No public update or delete (omitting those policies)
```

## Testing the Shared Leaderboard

1. Complete a game session and enter your name on the Results screen.
2. Open the game on a different device or browser.
3. Tap **View Leaderboard** from the main menu — your score should appear.
