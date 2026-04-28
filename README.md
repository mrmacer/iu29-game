# IU29 Staff Recognition Game

A React/Vite quiz game where you identify IU29 Schuylkill staff from photos. Scores are saved to a shared Firebase Firestore leaderboard visible to every player on any device.

## Local Development

```bash
npm install
npm run dev
```

The game works without Firebase — scores fall back to `localStorage` automatically when env vars are absent.

## Deployment (Vercel)

| Setting | Value |
|---|---|
| Framework | Vite |
| Build command | `npm run build` |
| Output directory | `dist` |
| Install command | `npm install` |

Add the environment variables below in **Vercel → Project → Settings → Environment Variables**.

## Environment Variables

| Variable | Where to find it |
|---|---|
| `VITE_FIREBASE_API_KEY` | Firebase Console → Project Settings → General → Your apps → Web API key |
| `VITE_FIREBASE_AUTH_DOMAIN` | Same page — `<project-id>.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | Same page — your project ID |
| `VITE_FIREBASE_STORAGE_BUCKET` | Same page — `<project-id>.appspot.com` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Same page — Sender ID |
| `VITE_FIREBASE_APP_ID` | Same page — App ID |

Copy `.env.example` to `.env` for local testing:

```bash
cp .env.example .env
# fill in your values from Firebase Console
```

> **Note:** Firebase web config keys are safe to expose in the browser — they are public identifiers. Access is controlled entirely by Firestore Security Rules, not by keeping the config secret.

## Firebase Setup

### 1. Create the project

1. Go to [console.firebase.google.com](https://console.firebase.google.com)
2. **Add project** → name it (e.g., `iu29-game`) → Continue
3. Disable Google Analytics if not needed → **Create project**

### 2. Enable Firestore

1. In your project: **Build → Firestore Database → Create database**
2. Choose **Start in production mode**
3. Pick a region (e.g., `us-east1`) → **Enable**

### 3. Set Security Rules

In **Firestore → Rules**, replace the default with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /leaderboard/{entry} {
      allow read:   if true;   // anyone can view scores
      allow create: if true;   // anyone can submit a score
      allow update, delete: if false;  // no edits or deletions
    }
  }
}
```

Click **Publish**.

### 4. Register a Web App

1. Project Overview → **Add app → Web (</> icon)**
2. Name it (e.g., `iu29-game-web`) → **Register app**
3. Copy the `firebaseConfig` values into your `.env` / Vercel env vars

## Testing the Shared Leaderboard

1. Add env vars and deploy (or run locally with `.env` filled in)
2. Complete a game and enter your name on the Results screen
3. Open the game on a **different device or browser**
4. Tap **View Leaderboard** from the main menu — your score should appear

Without env vars the leaderboard header shows a **Local** badge and scores are stored only on that device.
