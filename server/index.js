import dotenv from 'dotenv';
import express from 'express';

dotenv.config({ path: '.env.local' });

const app = express();
const PORT = process.env.PORT || 5174;

app.use(express.json());

const TMDB_BASE = 'https://api.themoviedb.org/3';
const IMG_BASE = 'https://image.tmdb.org/t/p';
const REGION = process.env.TMDB_REGION || 'NG';

const TMDB_API_KEY = process.env.TMDB_API_KEY || '';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

const fetchJson = async (url) => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`TMDB request failed: ${res.status}`);
  }
  return res.json();
};

const buildImage = (path, size) => {
  if (!path) return '';
  return `${IMG_BASE}/${size}${path}`;
};

const toYouTubeEmbed = (urlOrKey) => {
  if (!urlOrKey) return '';
  const isKey = /^[a-zA-Z0-9_-]{6,}$/.test(urlOrKey);
  if (isKey) return `https://www.youtube.com/embed/${urlOrKey}`;
  try {
    const url = new URL(urlOrKey);
    if (url.hostname.includes('youtube.com')) {
      const v = url.searchParams.get('v');
      if (v) return `https://www.youtube.com/embed/${v}`;
      if (url.pathname.startsWith('/embed/')) return urlOrKey;
      const parts = url.pathname.split('/');
      const last = parts[parts.length - 1];
      if (last) return `https://www.youtube.com/embed/${last}`;
    }
    if (url.hostname.includes('youtu.be')) {
      const id = url.pathname.replace('/', '');
      if (id) return `https://www.youtube.com/embed/${id}`;
    }
  } catch {
    return '';
  }
  return '';
};

let genreMap = null;
const getGenreMap = async () => {
  if (genreMap) return genreMap;
  if (!TMDB_API_KEY) return {};
  const data = await fetchJson(`${TMDB_BASE}/genre/movie/list?api_key=${TMDB_API_KEY}&language=en-US`);
  genreMap = data.genres.reduce((acc, g) => {
    acc[g.id] = g.name;
    return acc;
  }, {});
  return genreMap;
};

const getGenreNames = async (ids) => {
  if (!ids || ids.length === 0) return [];
  const map = await getGenreMap();
  return ids.map((id) => map[id]).filter(Boolean);
};

const providerCache = new Map();
const getWatchProviders = async (id) => {
  if (!TMDB_API_KEY) return [];
  if (providerCache.has(id)) return providerCache.get(id);

  const data = await fetchJson(`${TMDB_BASE}/movie/${id}/watch/providers?api_key=${TMDB_API_KEY}`);
  const region = data.results?.[REGION];
  const providers = [
    ...(region?.flatrate || []),
    ...(region?.ads || []),
    ...(region?.rent || []),
    ...(region?.buy || [])
  ];

  const mapped = providers.map((p) => ({
    name: p.provider_name,
    link: `https://www.themoviedb.org/movie/${id}/watch`,
    price: region?.rent?.some((r) => r.provider_id === p.provider_id)
      ? 'Rent'
      : region?.buy?.some((b) => b.provider_id === p.provider_id)
      ? 'Buy'
      : region?.ads?.some((a) => a.provider_id === p.provider_id)
      ? 'Free'
      : 'Subscription',
    logo: p.logo_path ? buildImage(p.logo_path, 'w92') : ''
  }));

  providerCache.set(id, mapped);
  return mapped;
};

const derivePriceCategory = (platforms) => {
  if (platforms.some((p) => p.price === 'Free')) return 'Free';
  if (platforms.some((p) => p.price === 'Subscription')) return 'Subscription';
  if (platforms.some((p) => p.price === 'Rent')) return 'Rent';
  if (platforms.some((p) => p.price === 'Buy')) return 'Buy';
  return 'Subscription';
};

const mapMovie = async (item) => {
  const [providers, genres] = await Promise.all([
    getWatchProviders(item.id),
    getGenreNames(item.genre_ids)
  ]);

  return {
    id: item.id,
    title: item.title || item.name || 'Untitled',
    year: item.release_date ? Number(item.release_date.slice(0, 4)) : 0,
    genres,
    rating: Number((item.vote_average || 0).toFixed(1)),
    poster_url: buildImage(item.poster_path, 'w500'),
    backdrop_url: buildImage(item.backdrop_path, 'w1280'),
    trailer_url: '',
    description: item.overview || 'No description available.',
    platforms: providers,
    tags: [],
    lowDataFriendly: false,
    isAfro: false,
    priceCategory: derivePriceCategory(providers)
  };
};

const hydrateMovieDetails = async (movie) => {
  if (!TMDB_API_KEY) return movie;
  const [details, videos] = await Promise.all([
    fetchJson(`${TMDB_BASE}/movie/${movie.id}?api_key=${TMDB_API_KEY}&language=en-US`),
    fetchJson(`${TMDB_BASE}/movie/${movie.id}/videos?api_key=${TMDB_API_KEY}&language=en-US`)
  ]);

  const trailer = videos.results?.find(
    (v) => v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser')
  );

  return {
    ...movie,
    genres: details.genres?.map((g) => g.name) || movie.genres,
    runtime: details.runtime,
    lowDataFriendly: details.runtime ? details.runtime <= 110 : movie.lowDataFriendly,
    isAfro: details.production_countries?.some((c) => c.iso_3166_1 === 'NG') || movie.isAfro,
    trailer_url: trailer ? toYouTubeEmbed(trailer.key) : movie.trailer_url
  };
};

const requireTmdbKey = (res) => {
  if (!TMDB_API_KEY) {
    res.status(400).json({ error: 'TMDB_API_KEY is not configured.' });
    return true;
  }
  return false;
};

app.get('/api/movies/trending', async (req, res) => {
  try {
    if (requireTmdbKey(res)) return;
    const data = await fetchJson(`${TMDB_BASE}/trending/movie/week?api_key=${TMDB_API_KEY}&region=${REGION}`);
    const results = await Promise.all((data.results || []).slice(0, 12).map(mapMovie));
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load trending movies.' });
  }
});

app.get('/api/movies/new', async (req, res) => {
  try {
    if (requireTmdbKey(res)) return;
    const data = await fetchJson(
      `${TMDB_BASE}/discover/movie?api_key=${TMDB_API_KEY}&region=${REGION}&with_origin_country=NG&sort_by=release_date.desc&include_adult=false`
    );
    const results = await Promise.all((data.results || []).slice(0, 12).map(mapMovie));
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load new Afro films.' });
  }
});

app.get('/api/movies/cheapest', async (req, res) => {
  try {
    if (requireTmdbKey(res)) return;
    const data = await fetchJson(
      `${TMDB_BASE}/discover/movie?api_key=${TMDB_API_KEY}&region=${REGION}&with_watch_monetization_types=free|ads|flatrate&watch_region=${REGION}`
    );
    const results = await Promise.all((data.results || []).slice(0, 12).map(mapMovie));
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load cheapest picks.' });
  }
});

app.get('/api/movies/low-data', async (req, res) => {
  try {
    if (requireTmdbKey(res)) return;
    const data = await fetchJson(
      `${TMDB_BASE}/discover/movie?api_key=${TMDB_API_KEY}&region=${REGION}&with_runtime.lte=110&sort_by=popularity.desc&include_adult=false`
    );
    const results = await Promise.all((data.results || []).slice(0, 12).map(mapMovie));
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load low-data picks.' });
  }
});

app.get('/api/movies/search', async (req, res) => {
  try {
    if (requireTmdbKey(res)) return;
    const query = req.query.query || '';
    if (!query) return res.json([]);
    const data = await fetchJson(
      `${TMDB_BASE}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&include_adult=false&region=${REGION}`
    );
    const results = await Promise.all((data.results || []).slice(0, 20).map(mapMovie));
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: 'Failed to search movies.' });
  }
});

app.get('/api/movies/:id', async (req, res) => {
  try {
    if (requireTmdbKey(res)) return;
    const id = req.params.id;
    const item = await fetchJson(`${TMDB_BASE}/movie/${id}?api_key=${TMDB_API_KEY}&language=en-US`);
    const providers = await getWatchProviders(item.id);
    const baseMovie = {
      id: item.id,
      title: item.title || 'Untitled',
      year: item.release_date ? Number(item.release_date.slice(0, 4)) : 0,
      genres: item.genres?.map((g) => g.name) || [],
      rating: Number((item.vote_average || 0).toFixed(1)),
      poster_url: buildImage(item.poster_path, 'w500'),
      backdrop_url: buildImage(item.backdrop_path, 'w1280'),
      trailer_url: '',
      description: item.overview || 'No description available.',
      platforms: providers,
      tags: [],
      lowDataFriendly: item.runtime ? item.runtime <= 110 : false,
      isAfro: item.production_countries?.some((c) => c.iso_3166_1 === 'NG') || false,
      priceCategory: derivePriceCategory(providers)
    };
    const hydrated = await hydrateMovieDetails(baseMovie);
    res.json(hydrated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load movie details.' });
  }
});

app.post('/api/subscribe', (req, res) => {
  const email = req.body?.email || '';
  if (!email) return res.status(400).json({ status: 'invalid' });
  res.json({ status: 'ok' });
});

app.post('/api/generate-tagline', async (req, res) => {
  try {
    const { title, description } = req.body || {};
    if (!title || !description) {
      return res.status(400).json({ tagline: 'A must-watch for the weekend!' });
    }
    if (!GEMINI_API_KEY) {
      return res.json({ tagline: 'A must-watch for the weekend!' });
    }

    const { GoogleGenAI } = await import('@google/genai');
    const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are a savvy Nigerian movie promoter. Generate a short, catchy, and culturally relevant "Naija style" tagline for the movie "${title}". Description: "${description}". Keep it under 60 characters and use a bit of Nigerian Pidgin if appropriate. Output ONLY the tagline text.`
    });

    res.json({ tagline: response.text?.trim() || 'A must-watch for the weekend!' });
  } catch (err) {
    res.status(500).json({ tagline: 'The vibiest movie in Naija right now!' });
  }
});

app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});
