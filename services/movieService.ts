import { Movie } from '../types';

const API_BASE = import.meta.env.VITE_API_BASE || '/api';

// Mock data simulating a Nigerian-focused response (fallback when API is unavailable)
const MOCK_MOVIES: Movie[] = [
  {
    id: 1,
    title: "Anikulapo",
    year: 2022,
    genres: ["Drama", "Fantasy"],
    rating: 8.5,
    poster_url: "https://picsum.photos/seed/anikulapo/400/600",
    backdrop_url: "https://picsum.photos/seed/anikulapo-bg/1200/600",
    trailer_url: "https://www.youtube.com/embed/5-XQjD5Tz4c",
    description: "After an affair with the king's wife leads to his demise, a traveler encounters a mystical bird with the power to give him another life.",
    lowDataFriendly: true,
    isAfro: true,
    priceCategory: 'Subscription',
    platforms: [
      { name: "Netflix", link: "https://netflix.com", price: "Subscription", logo: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg" }
    ],
    tags: ["Nollywood", "Epic", "Cultural"]
  },
  {
    id: 2,
    title: "The Wedding Party",
    year: 2016,
    genres: ["Comedy", "Romance"],
    rating: 7.9,
    poster_url: "https://picsum.photos/seed/wedding/400/600",
    backdrop_url: "https://picsum.photos/seed/wedding-bg/1200/600",
    trailer_url: "https://www.youtube.com/embed/SAsXmQ-W63c",
    description: "As their big day arrives, a couple's lavish wedding plans turn into a chaotic nightmare.",
    lowDataFriendly: true,
    isAfro: true,
    priceCategory: 'Subscription',
    platforms: [
      { name: "Netflix", link: "https://netflix.com", price: "Subscription", logo: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg" },
      { name: "Showmax", link: "https://showmax.com", price: "₦1,200/mo", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/5/52/Showmax_Logo.svg/1200px-Showmax_Logo.svg.png" }
    ],
    tags: ["Classic", "Party Vibes", "Lagos Life"]
  },
  {
    id: 3,
    title: "King of Boys",
    year: 2018,
    genres: ["Crime", "Drama"],
    rating: 9.1,
    poster_url: "https://picsum.photos/seed/kob/400/600",
    backdrop_url: "https://picsum.photos/seed/kob-bg/1200/600",
    trailer_url: "https://www.youtube.com/embed/k-pY8L3j6o8",
    description: "Eniola Salami, a businesswoman and philanthropist with a checkered past and a promising political future.",
    lowDataFriendly: false,
    isAfro: true,
    priceCategory: 'Subscription',
    platforms: [
      { name: "Netflix", link: "https://netflix.com", price: "Subscription", logo: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg" }
    ],
    tags: ["Must Watch", "Eniola Salami", "Power"]
  },
  {
    id: 4,
    title: "Shanty Town",
    year: 2023,
    genres: ["Action", "Crime"],
    rating: 7.5,
    poster_url: "https://picsum.photos/seed/shanty/400/600",
    backdrop_url: "https://picsum.photos/seed/shanty-bg/1200/600",
    trailer_url: "https://www.youtube.com/embed/abc",
    description: "A group of courtesans attempts to escape the clutches of a notorious kingpin.",
    lowDataFriendly: true,
    isAfro: true,
    priceCategory: 'Subscription',
    platforms: [
      { name: "Netflix", link: "https://netflix.com", price: "Subscription", logo: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg" }
    ],
    tags: ["Action", "Gritty", "Series"]
  },
  {
    id: 5,
    title: "Spider-Man: Across the Spider-Verse",
    year: 2023,
    genres: ["Animation", "Action"],
    rating: 8.9,
    poster_url: "https://picsum.photos/seed/spidey/400/600",
    backdrop_url: "https://picsum.photos/seed/spidey-bg/1200/600",
    trailer_url: "https://www.youtube.com/embed/shW9i6k8cB0",
    description: "Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence.",
    lowDataFriendly: false,
    isAfro: false,
    priceCategory: 'Rent',
    platforms: [
      { name: "Apple TV", link: "https://apple.com", price: "₦2,500", logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Apple_TV_logo.svg/1200px-Apple_TV_logo.svg.png" },
      { name: "Google Play", link: "https://play.google.com", price: "₦1,800", logo: "https://upload.wikimedia.org/wikipedia/commons/d/d0/Google_Play_Arrow_logo.svg" }
    ],
    tags: ["Blockbuster", "Global"]
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
