
export interface Platform {
  name: string;
  link: string;
  price: string;
  logo: string;
}

export interface Movie {
  id: number;
  title: string;
  year: number;
  genres: string[];
  rating: number;
  poster_url: string;
  backdrop_url?: string;
  trailer_url: string;
  description: string;
  platforms: Platform[];
  tags: string[];
  lowDataFriendly: boolean;
  isAfro: boolean;
  priceCategory: 'Free' | 'Subscription' | 'Rent' | 'Buy';
  runtime?: number;
}

export interface SearchFilters {
  platform?: string;
  priceCategory?: string;
  lowDataOnly: boolean;
}
