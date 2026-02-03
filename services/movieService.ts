import { Movie, Platform } from '../types';

const TMDB_BASE = 'https://api.themoviedb.org/3';
const IMG_BASE = 'https://image.tmdb.org/t/p';
const DEFAULT_REGION = 'NG';

const apiKey = import.meta.env.VITE_TMDB_API_KEY || '';
let genreMap: Record<number, string> | null = null;

// Mock data simulating a Nigerian-focused response (fallback when API key is missing)
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
    throw new Error(`TMDB request failed: ${res.status}`);
  }
  return res.json() as Promise<T>;
};

const getGenreMap = async (): Promise<Record<number, string>> => {
  if (genreMap) return genreMap;
  if (!apiKey) return {};
  const data = await fetchJson<{ genres: { id: number; name: string }[] }>(
    `${TMDB_BASE}/genre/movie/list?api_key=${apiKey}&language=en-US`
  );
  genreMap = data.genres.reduce<Record<number, string>>((acc, g) => {
    acc[g.id] = g.name;
    return acc;
  }, {});
  return genreMap;
};

const getGenreNames = async (ids: number[] | undefined): Promise<string[]> => {
  if (!ids || ids.length === 0) return [];
  const map = await getGenreMap();
  return ids.map((id) => map[id]).filter(Boolean);
};

const buildImage = (path: string | null | undefined, size: string): string => {
  if (!path) return '';
  return `${IMG_BASE}/${size}${path}`;
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

const providerCache = new Map<number, Platform[]>();

const getWatchProviders = async (id: number): Promise<Platform[]> => {
  if (!apiKey) return [];
  if (providerCache.has(id)) return providerCache.get(id)!;

  const data = await fetchJson<{ results: Record<string, { flatrate?: any[]; rent?: any[]; buy?: any[]; ads?: any[] }> }>(
    `${TMDB_BASE}/movie/${id}/watch/providers?api_key=${apiKey}`
  );

  const region = data.results?.[DEFAULT_REGION];
  const providers = [
    ...(region?.flatrate || []),
    ...(region?.ads || []),
    ...(region?.rent || []),
    ...(region?.buy || [])
  ];

  const mapped: Platform[] = providers.map((p) => ({
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

const derivePriceCategory = (platforms: Platform[]): Movie['priceCategory'] => {
  if (platforms.some((p) => p.price === 'Free')) return 'Free';
  if (platforms.some((p) => p.price === 'Subscription')) return 'Subscription';
  if (platforms.some((p) => p.price === 'Rent')) return 'Rent';
  if (platforms.some((p) => p.price === 'Buy')) return 'Buy';
  return 'Subscription';
};

const mapMovie = async (item: any): Promise<Movie> => {
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

const hydrateMovieDetails = async (movie: Movie): Promise<Movie> => {
  if (!apiKey) return movie;
  const [details, videos] = await Promise.all([
    fetchJson<any>(`${TMDB_BASE}/movie/${movie.id}?api_key=${apiKey}&language=en-US`),
    fetchJson<any>(`${TMDB_BASE}/movie/${movie.id}/videos?api_key=${apiKey}&language=en-US`)
  ]);

  const trailer = videos.results?.find((v: any) => v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser'));

  return {
    ...movie,
    genres: details.genres?.map((g: any) => g.name) || movie.genres,
    runtime: details.runtime,
    lowDataFriendly: details.runtime ? details.runtime <= 110 : movie.lowDataFriendly,
    isAfro: details.production_countries?.some((c: any) => c.iso_3166_1 === 'NG') || movie.isAfro,
    trailer_url: trailer ? toYouTubeEmbed(trailer.key) : movie.trailer_url
  } as Movie;
};

export const getTrendingMovies = async (): Promise<Movie[]> => {
  if (!apiKey) return MOCK_MOVIES;
  const data = await fetchJson<any>(`${TMDB_BASE}/trending/movie/week?api_key=${apiKey}&region=${DEFAULT_REGION}`);
  return Promise.all((data.results || []).slice(0, 12).map(mapMovie));
};

export const getNewAfroFilms = async (): Promise<Movie[]> => {
  if (!apiKey) return MOCK_MOVIES.filter((m) => m.isAfro);
  const data = await fetchJson<any>(
    `${TMDB_BASE}/discover/movie?api_key=${apiKey}&region=${DEFAULT_REGION}&with_origin_country=NG&sort_by=release_date.desc&include_adult=false`
  );
  return Promise.all((data.results || []).slice(0, 12).map(mapMovie));
};

export const getCheapestPicks = async (): Promise<Movie[]> => {
  if (!apiKey) return MOCK_MOVIES.filter((m) => m.priceCategory === 'Free' || m.priceCategory === 'Subscription');
  const data = await fetchJson<any>(
    `${TMDB_BASE}/discover/movie?api_key=${apiKey}&region=${DEFAULT_REGION}&with_watch_monetization_types=free|ads|flatrate&watch_region=${DEFAULT_REGION}`
  );
  return Promise.all((data.results || []).slice(0, 12).map(mapMovie));
};

export const getLowDataPicks = async (): Promise<Movie[]> => {
  if (!apiKey) return MOCK_MOVIES.filter((m) => m.lowDataFriendly);
  const data = await fetchJson<any>(
    `${TMDB_BASE}/discover/movie?api_key=${apiKey}&region=${DEFAULT_REGION}&with_runtime.lte=110&sort_by=popularity.desc&include_adult=false`
  );
  return Promise.all((data.results || []).slice(0, 12).map(mapMovie));
};

export const getMovieById = async (id: number): Promise<Movie | undefined> => {
  if (!apiKey) return MOCK_MOVIES.find((m) => m.id === id);
  const item = await fetchJson<any>(`${TMDB_BASE}/movie/${id}?api_key=${apiKey}&language=en-US`);
  const providers = await getWatchProviders(item.id);
  const baseMovie: Movie = {
    id: item.id,
    title: item.title || 'Untitled',
    year: item.release_date ? Number(item.release_date.slice(0, 4)) : 0,
    genres: item.genres?.map((g: any) => g.name) || [],
    rating: Number((item.vote_average || 0).toFixed(1)),
    poster_url: buildImage(item.poster_path, 'w500'),
    backdrop_url: buildImage(item.backdrop_path, 'w1280'),
    trailer_url: '',
    description: item.overview || 'No description available.',
    platforms: providers,
    tags: [],
    lowDataFriendly: item.runtime ? item.runtime <= 110 : false,
    isAfro: item.production_countries?.some((c: any) => c.iso_3166_1 === 'NG') || false,
    priceCategory: derivePriceCategory(providers)
  };
  return hydrateMovieDetails(baseMovie);
};

export const searchMovies = async (query: string): Promise<Movie[]> => {
  if (!apiKey) {
    const q = query.toLowerCase();
    return MOCK_MOVIES.filter((m) => m.title.toLowerCase().includes(q) || m.tags.some((t) => t.toLowerCase().includes(q)));
  }
  if (!query) return [];
  const data = await fetchJson<any>(
    `${TMDB_BASE}/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}&include_adult=false&region=${DEFAULT_REGION}`
  );
  const mapped = await Promise.all((data.results || []).slice(0, 20).map(mapMovie));
  return mapped;
};
