import { Movie } from '../types';

const API_BASE = process.env.EXPO_PUBLIC_API_BASE || 'http://localhost:5174/api';

const MOCK_MOVIES: Movie[] = [
  {
    id: 1,
    title: 'Anikulapo',
    year: 2022,
    genres: ['Drama', 'Fantasy'],
    rating: 8.5,
    poster_url: 'https://picsum.photos/seed/anikulapo/400/600',
    backdrop_url: 'https://picsum.photos/seed/anikulapo-bg/1200/600',
    trailer_url: 'https://www.youtube.com/embed/5-XQjD5Tz4c',
    description: "After an affair with the king's wife leads to his demise, a traveler encounters a mystical bird with the power to give him another life.",
    lowDataFriendly: true,
    isAfro: true,
    priceCategory: 'Subscription',
    platforms: [
      { name: 'Netflix', link: 'https://netflix.com', price: 'Subscription', logo: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg' }
    ],
    tags: ['Nollywood', 'Epic', 'Cultural']
  }
];

const fetchJson = async <T>(url: string): Promise<T> => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`API request failed: ${res.status}`);
  }
  return res.json() as Promise<T>;
};

export const toYouTubeEmbed = (urlOrKey: string): string => {
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

export const getTrendingMovies = async (): Promise<Movie[]> => {
  try {
    return await fetchJson<Movie[]>(`${API_BASE}/movies/trending`);
  } catch {
    return MOCK_MOVIES;
  }
};

export const getNewAfroFilms = async (): Promise<Movie[]> => {
  try {
    return await fetchJson<Movie[]>(`${API_BASE}/movies/new`);
  } catch {
    return MOCK_MOVIES.filter((m) => m.isAfro);
  }
};

export const getCheapestPicks = async (): Promise<Movie[]> => {
  try {
    return await fetchJson<Movie[]>(`${API_BASE}/movies/cheapest`);
  } catch {
    return MOCK_MOVIES.filter((m) => m.priceCategory === 'Free' || m.priceCategory === 'Subscription');
  }
};

export const getLowDataPicks = async (): Promise<Movie[]> => {
  try {
    return await fetchJson<Movie[]>(`${API_BASE}/movies/low-data`);
  } catch {
    return MOCK_MOVIES.filter((m) => m.lowDataFriendly);
  }
};

export const getMovieById = async (id: number): Promise<Movie | undefined> => {
  try {
    return await fetchJson<Movie>(`${API_BASE}/movies/${id}`);
  } catch {
    return MOCK_MOVIES.find((m) => m.id === id);
  }
};

export const searchMovies = async (query: string): Promise<Movie[]> => {
  if (!query) return [];
  try {
    return await fetchJson<Movie[]>(`${API_BASE}/movies/search?query=${encodeURIComponent(query)}`);
  } catch {
    const q = query.toLowerCase();
    return MOCK_MOVIES.filter((m) => m.title.toLowerCase().includes(q) || m.tags.some((t) => t.toLowerCase().includes(q)));
  }
};
