# FlickNaija

Discover where to stream, rent, or buy movies legally in Nigeria. Optimized for low data and high vibes.

## Features
- Find streaming, rental, and purchase options for movies in Nigeria
- AI-powered movie recommendations via Gemini
- Curated sections: Trending, Cheapest Picks, New Afro Films, Low Data Picks
- Mobile-first design for Nigerian audiences

## Tech Used
- React + TypeScript + Vite
- Tailwind CSS
- TMDB API (movie data)
- Gemini API (AI recommendations)
- Express.js (backend server)
- Expo React Native (mobile app in `/APP`)

## Live Demo
https://flicknaija.onrender.com

## Screenshot
![FlickNaija](https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6)

## Getting Started

### Prerequisites
- Node.js
- TMDB API key
- Gemini API key

### Installation
```bash
npm install
```

### Configuration
Create a `.env.local` file with:
```
VITE_TMDB_API_KEY=your_tmdb_api_key
VITE_GEMINI_API_KEY=your_gemini_api_key
```

### Running
```bash
npm run server  # Start backend
npm run dev     # Start frontend
```

### Deploying
This project includes a `render.yaml` for deployment to Render:
1. Create a new Render Blueprint pointing to this repo
2. Set environment variables: `TMDB_API_KEY`, `GEMINI_API_KEY`