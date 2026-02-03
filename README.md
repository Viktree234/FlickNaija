<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/temp/1

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Set the `TMDB_API_KEY` in [.env.local](.env.local) to your TMDB API key
4. Run the API server:
   `npm run server`
5. Run the app:
   `npm run dev`

## Deploy on Render

This repo includes a `render.yaml` that provisions both backend and frontend.

1. Create a new Render Blueprint and point it at this repo.
2. Set backend env vars in Render:
   - `TMDB_API_KEY`
   - `GEMINI_API_KEY`
   - `TMDB_REGION` (optional, defaults to `NG`)
3. The frontend uses `VITE_API_BASE` (set in `render.yaml`) to call the API.
