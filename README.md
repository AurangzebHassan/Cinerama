# 🎬 Cinerama

A full-stack movie discovery web application — built with React, Tailwind CSS, TMDB API, and Appwrite.

---

## 📌 About

Cinerama lets users discover movies, search by title, watch trailers, and browse recommendations — all behind a secure authenticated experience. The app tracks each user's personal search history to surface a personalised trending section.

The app supports two authentication methods — email/password and OAuth (Google) — with email verification enforced for email-based signups.

---

## ✨ Features

- 🔐 **Authentication** — Email/password signup with email verification, plus OAuth (Google) login via Appwrite
- 🔍 **Movie Search** — Debounced search powered by the TMDB API
- 🔥 **Trending Searches** — Personalised trending section based on your own search history (stored in Appwrite)
- 🎥 **Movie Details** — Full detail page with poster, overview, genres, rating, runtime, and official website link
- 📺 **Trailer Playback** — Embedded YouTube trailer on the movie detail page
- 🎞️ **Recommendations** — Related movies shown at the bottom of each detail page
- 📱 **Responsive Design** — Works across desktop and mobile

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, Tailwind CSS |
| Movie Data | TMDB API |
| Backend & Auth | Appwrite |
| Deployment | — |

---

## 🗄️ Database Structure (Appwrite Collections)

| Collection | Purpose |
|---|---|
| `metrics` | Per-user movie search records (searchTerm, count, movie_id, poster_url, userId) |

---

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── MovieCard.jsx
│   ├── Search.jsx
│   └── Spinner.jsx
├── pages/                # Page-level components
│   ├── Login.jsx
│   ├── Signup.jsx
│   ├── VerifyEmail.jsx
│   ├── MoviesPage.jsx
│   └── MovieDescription.jsx
├── appwrite.js           # Appwrite client, auth, and database functions
├── App.jsx               # Root component — routing and ProtectedRoute
└── main.jsx

block-unverified-oauth/   # Appwrite serverless function
├── main.js
└── package.json
```

---

## 🔐 How Authentication Works

The app uses Appwrite for authentication and supports two login methods:

- **Email/Password** — Users must verify their email before accessing the app. Unverified users are redirected to `/verify-email`.
- **OAuth (Google)** — OAuth users skip email verification since Google already verifies the email. Appwrite marks `emailVerification = true` automatically.

Route protection is handled by a `ProtectedRoute` component that wraps all private pages. It checks both session validity and email verification status. The check distinguishes OAuth users from email/password users by inspecting the `identities` array on the Appwrite user object — OAuth users always have at least one identity entry, so they are never incorrectly redirected to `/verify-email`.

Unauthenticated users are redirected to `/login`.

---

## ⚙️ Appwrite Function — `block-unverified-oauth`

An Appwrite serverless function provides a backend-level guard against unverified users linking OAuth providers.

**Trigger:** `account.sessions.oauth2.create`

**What it does:**
1. Receives the session creation event payload.
2. Fetches the full user record using the Admin SDK.
3. If `emailVerification === false` → deletes all sessions for that user, effectively blocking the OAuth login.
4. If the user is verified → allows the session through.

**Required environment variables (set in Appwrite Console):**

| Variable | Description |
|---|---|
| `APPWRITE_API_KEY` | Admin API key (must allow Users read & deleteSessions) |
| `APPWRITE_FUNCTION_API_ENDPOINT` | Appwrite API endpoint (e.g. `https://cloud.appwrite.io/v1`) |
| `APPWRITE_FUNCTION_PROJECT_ID` | Your Appwrite project ID |

**How to deploy:**
1. Zip the `block-unverified-oauth/` folder (`main.js` + `package.json`).
2. Create a new Function in the Appwrite Console (Node.js runtime).
3. Upload the zip and set the entry file to `main.js`.
4. Add the environment variables above.
5. Add the trigger: `account.sessions.oauth2.create`.
6. Deploy and enable.

> ⚠️ Never expose `APPWRITE_API_KEY` to the client.

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or above
- A [TMDB](https://www.themoviedb.org/) account with an API read access token
- An [Appwrite](https://appwrite.io/) account and project set up

### Installation

1. Clone the repository

```bash
git clone <your-repo-url>
cd movie-app-project-AUTH-FIX-FUNC
```

2. Install dependencies

```bash
npm install
```

3. Set up environment variables

Create a `.env.local` file in the root directory:

```env
VITE_TMDB_API_KEY=your_tmdb_bearer_token

VITE_APPWRITE_PROJECT_ID=your_project_id
VITE_APPWRITE_DATABASE_ID=your_database_id
VITE_APPWRITE_TABLE_ID=your_metrics_collection_id
```

> ⚠️ Never commit your actual `.env.local` file. Make sure it is listed in `.gitignore`.

4. Start the development server

```bash
npm run dev
```

The app will be running at `http://localhost:5173`

---

## 👨‍💻 Author

**Aurangzeb Hassan**
- GitHub: [@AurangzebHassan](https://github.com/AurangzebHassan)
- LinkedIn: [@Aurangzeb Hassan](https://www.linkedin.com/in/aurangzeb-hassan-20897b230/)