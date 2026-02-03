
import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import MovieSectionCards from '../components/MovieSectionCards';
import { Movie } from '../types';
import * as movieService from '../services/movieService';
import { COLORS } from '../constants';

interface HomeProps {
  onNavigate: (route: string) => void;
}

const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  const [trending, setTrending] = useState<Movie[]>([]);
  const [newAfro, setNewAfro] = useState<Movie[]>([]);
  const [cheapest, setCheapest] = useState<Movie[]>([]);
  const [lowData, setLowData] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [t, a, c, l] = await Promise.all([
          movieService.getTrendingMovies(),
          movieService.getNewAfroFilms(),
          movieService.getCheapestPicks(),
          movieService.getLowDataPicks()
        ]);
        setTrending(t);
        setNewAfro(a);
        setCheapest(c);
        setLowData(l);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleSearch = (query: string) => {
    onNavigate(`search?q=${encodeURIComponent(query)}`);
  };

  const handleMovieClick = (id: number) => {
    onNavigate(`movie/${id}`);
  };

  return (
    <div className="min-h-screen bg-black pb-20">
      <Header />
      
      <main>
        {/* Hero Section */}
        <div className="px-4 pt-8 pb-12 bg-gradient-to-b from-green-900/10 to-black">
          <div className="max-w-xl">
            <h2 className="text-4xl font-extrabold leading-[1.1] mb-4">
              Watch <span style={{ color: COLORS.primary }}>Correct</span> Movies Legally in Naija.
            </h2>
            <p className="text-gray-400 text-lg mb-8 leading-relaxed">
              Find where to stream, rent or buy. Optimized for low data and high vibes.
            </p>
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-8 h-8 border-2 border-green-400 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs text-gray-500 font-medium uppercase tracking-widest">Loading Vibes...</p>
          </div>
        ) : (
          <div className="space-y-4">
            <MovieSectionCards title="Trending Now" movies={trending} onMovieClick={handleMovieClick} />
            <MovieSectionCards title="Cheapest Picks" movies={cheapest} onMovieClick={handleMovieClick} />
            
            {/* Promo Banner */}
            <div className="px-4 mb-8">
              <div 
                className="rounded-3xl p-6 bg-cover bg-center relative overflow-hidden h-40 flex flex-col justify-end"
                style={{ backgroundImage: `url(https://picsum.photos/seed/promo/800/400)` }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
                <div className="relative">
                  <span className="text-[10px] font-bold text-green-400 uppercase tracking-widest mb-1 block">Editor's Pick</span>
                  <h3 className="text-xl font-bold">New Afro-Futurism Classics</h3>
                  <p className="text-sm text-gray-300">Discover the next wave of cinema.</p>
                </div>
              </div>
            </div>

            <MovieSectionCards title="New Afro Films" movies={newAfro} onMovieClick={handleMovieClick} />
            <MovieSectionCards title="Low Data Picks" movies={lowData} onMovieClick={handleMovieClick} />
          </div>
        )}
      </main>

      {/* Quick Nav Footer (Mobile) */}
      <nav className="fixed bottom-0 left-0 right-0 h-16 bg-black/90 backdrop-blur-lg border-t border-white/10 flex items-center justify-around px-4 md:hidden z-50">
        <button onClick={() => onNavigate('')} className="flex flex-col items-center gap-1 text-green-400">
           <span className="text-xs font-bold">Home</span>
        </button>
        <button onClick={() => onNavigate('search')} className="flex flex-col items-center gap-1 text-gray-400">
           <span className="text-xs font-bold">Browse</span>
        </button>
        <button onClick={() => onNavigate('subscribe')} className="flex flex-col items-center gap-1 text-gray-400">
           <span className="text-xs font-bold">Alerts</span>
        </button>
      </nav>
    </div>
  );
};

export default Home;
