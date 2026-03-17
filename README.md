# Ossify

Open-source discovery for developers. Find relevant repositories, assess contribution readiness, and track what matters to you.

## Overview

Ossify surfaces open-source repositories based on your skill level and interests. It pulls from the GitHub API to show trending projects, filters by language and experience level, and lets you save repositories you want to return to. The goal is to reduce the friction between "I want to contribute" and finding somewhere worth contributing to.

## Features

- **Trending repositories** — browse by daily, weekly, or monthly activity
- **Skill-level filtering** — beginner, intermediate, and advanced project classifications
- **Language filter** — supports JavaScript, Python, TypeScript, Java, and more
- **Contribution signals** — highlights repos with `good first issue` and `help wanted` labels
- **Saved repositories** — bookmark projects and sync them across sessions via Firestore
- **User preferences** — set default languages, topics, and experience level
- **Responsive layout** — works on desktop, tablet, and mobile

## Tech stack

| Layer | Tools |
|---|---|
| Frontend | Next.js 14 (App Router), Tailwind CSS, Heroicons |
| Backend / APIs | GitHub REST API, Firebase Auth, Firestore |

## Getting started

Clone the repo and install dependencies:
```bash
git clone https://github.com/Shridharrrr/ossify.git
cd ossify
npm install
```

Create a `.env` file at the project root and add your Firebase credentials:
```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=
```

## License

MIT. See `LICENSE` for details.