
import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import MovieCard from '../components/MovieCard';
import { Movie, SearchFilters } from '../types';
import * as movieService from '../services/movieService';
import { ICONS, PLATFORMS_LIST, PRICE_CATEGORIES } from '../constants';

interface SearchResultsProps {
  initialQuery?: string;
  onNavigate: (route: string) => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({ initialQuery = '', onNavigate }) => {
  const [query, setQuery] = useState(initialQuery);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    lowDataOnly: false
  });

  const fetchResults = async (q: string) => {
    setLoading(true);
    try {
      const results = await movieService.searchMovies(q);
      
      // Apply client-side filters
      const filteredResults = results.filter(m => {
        if (filters.lowDataOnly && !m.lowDataFriendly) return false;
        if (filters.platform && !m.platforms.some(p => p.name === filters.platform)) return false;
        if (filters.priceCategory && m.priceCategory !== filters.priceCategory) return false;
        return true;
      });

      setMovies(filteredResults);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults(query);
  }, [query, filters]);

  const handleMovieClick = (id: number) => {
    onNavigate(`movie/${id}`);
  };

  return (
    <div className="min-h-screen bg-black pb-20">
      <Header />
      
      <div className="px-4 py-6 space-y-6">
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <SearchBar onSearch={(q) => setQuery(q)} initialValue={query} />
          </div>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-all ${showFilters ? 'bg-green-500 border-green-500 text-black' : 'bg-white/5 border-white/10 text-white'}`}
          >
            <ICONS.Filter />
          </button>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-6 animate-in slide-in-from-top duration-300">
            <div>
              <h4 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-3">Platforms</h4>
              <div className="flex flex-wrap gap-2">
                <button 
                  onClick={() => setFilters({ ...filters, platform: undefined })}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold border transition ${!filters.platform ? 'bg-green-500 text-black border-green-500' : 'bg-transparent border-white/10 text-gray-400'}`}
                >
                  All
                </button>
                {PLATFORMS_LIST.map(p => (
                  <button 
                    key={p}
                    onClick={() => setFilters({ ...filters, platform: p })}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold border transition ${filters.platform === p ? 'bg-green-500 text-black border-green-500' : 'bg-transparent border-white/10 text-gray-400'}`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black text-gray-500 uppercase tracking-widest">Low Data Only</h4>
              <button 
                onClick={() => setFilters({ ...filters, lowDataOnly: !filters.lowDataOnly })}
                className={`w-12 h-6 rounded-full relative transition-colors ${filters.lowDataOnly ? 'bg-green-500' : 'bg-neutral-800'}`}
              >
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${filters.lowDataOnly ? 'left-7' : 'left-1'}`}></div>
              </button>
            </div>
            
            <div>
              <h4 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-3">Price Type</h4>
              <div className="flex flex-wrap gap-2">
                <button 
                  onClick={() => setFilters({ ...filters, priceCategory: undefined })}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold border transition ${!filters.priceCategory ? 'bg-green-500 text-black border-green-500' : 'bg-transparent border-white/10 text-gray-400'}`}
                >
                  All
                </button>
                {PRICE_CATEGORIES.map(c => (
                  <button 
                    key={c}
                    onClick={() => setFilters({ ...filters, priceCategory: c })}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold border transition ${filters.priceCategory === c ? 'bg-green-500 text-black border-green-500' : 'bg-transparent border-white/10 text-gray-400'}`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <h2 className="text-xl font-bold">
            {query ? `Results for "${query}"` : 'Browse Movies'}
            <span className="text-sm text-gray-500 ml-2">({movies.length})</span>
          </h2>

          {loading ? (
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="aspect-[2/3] rounded-2xl bg-white/5 animate-pulse"></div>
              ))}
            </div>
          ) : movies.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {movies.map(movie => (
                <div key={movie.id} className="w-full">
                  <MovieCard movie={movie} onClick={handleMovieClick} />
                </div>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center space-y-4">
              <div className="text-4xl">🤔</div>
              <p className="text-gray-500 font-medium">No results found. Try searching for "Nollywood" or "Free".</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
