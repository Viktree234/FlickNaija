
import React, { useEffect, useState, useRef } from 'react';
import { Movie } from '../types';
import * as movieService from '../services/movieService';
import * as geminiService from '../services/geminiService';
import { ICONS, COLORS } from '../constants';

interface MovieDetailsProps {
  id: number;
  onBack: () => void;
}

const MovieDetails: React.FC<MovieDetailsProps> = ({ id, onBack }) => {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [aiTagline, setAiTagline] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [isSharing, setIsSharing] = useState(false);
  const detailsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadMovie = async () => {
      const data = await movieService.getMovieById(id);
      if (data) {
        setMovie(data);
        const tagline = await geminiService.generateNaijaTagline(data.title, data.description);
        setAiTagline(tagline);
      }
      setLoading(false);
    };
    loadMovie();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      <div className="w-12 h-12 border-4 border-green-400 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (!movie) return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 text-center">
      <h2 className="text-2xl font-bold mb-4">Movie not found</h2>
      <button onClick={onBack} className="text-green-400 font-bold">Go Back Home</button>
    </div>
  );

  const handleShare = () => {
    setIsSharing(true);
    // Simulation of share functionality
    setTimeout(() => {
      const text = `Check out "${movie.title}" on FlickNaija! ${aiTagline} Watch it on ${movie.platforms[0]?.name}.`;
      const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
      window.open(url, '_blank');
      setIsSharing(false);
    }, 1000);
  };

  const trailerEmbed = movieService.toYouTubeEmbed(movie.trailer_url);

  return (
    <div className="min-h-screen bg-black pb-32" ref={detailsRef}>
      {/* Top Navigation */}
      <div className="fixed top-0 left-0 right-0 z-50 p-4 flex items-center justify-between">
        <button 
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white border border-white/10"
        >
          <ICONS.Back />
        </button>
        <button 
          onClick={handleShare}
          className="px-4 py-2 rounded-full bg-green-500 text-black font-bold flex items-center gap-2 shadow-lg shadow-green-500/20"
        >
          <ICONS.Share />
          <span className="text-sm">Share</span>
        </button>
      </div>

      {/* Hero Backdrop */}
      <div className="relative h-[60vh] w-full">
        <img 
          src={movie.backdrop_url || movie.poster_url} 
          alt={movie.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="flex flex-wrap gap-2 mb-3">
            {movie.tags.map(tag => (
              <span key={tag} className="text-[10px] font-bold px-2 py-0.5 rounded bg-white/10 backdrop-blur-md border border-white/10 uppercase tracking-widest">
                {tag}
              </span>
            ))}
          </div>
          <h1 className="text-4xl font-black mb-1 leading-tight">{movie.title}</h1>
          <div className="flex items-center gap-4 text-sm font-medium text-gray-300">
            <span>{movie.year}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
            <span>{movie.genres.join(', ')}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
            <div className="flex items-center gap-1 text-yellow-400">
              <ICONS.Star />
              <span className="font-bold">{movie.rating}</span>
            </div>
          </div>
        </div>
      </div>

      {/* AI Tagline (Gemini Powered) */}
      {aiTagline && (
        <div className="px-6 py-4 bg-green-500/10 border-y border-green-500/20 mb-6">
          <p className="text-green-400 font-bold italic text-center">"{aiTagline}"</p>
        </div>
      )}

      {/* Main Content */}
      <div className="px-6 space-y-8">
        {/* Description */}
        <section>
          <h3 className="text-lg font-bold mb-2">The Story</h3>
          <p className="text-gray-400 leading-relaxed">{movie.description}</p>
        </section>

        {/* Platforms - Where to Watch */}
        <section>
          <h3 className="text-lg font-bold mb-4">Where to Watch in Nigeria</h3>
          <div className="grid grid-cols-1 gap-3">
            {movie.platforms.map((platform, idx) => (
              <a 
                key={idx}
                href={platform.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-black/40 flex items-center justify-center p-2">
                    <img src={platform.logo} alt={platform.name} className="max-w-full max-h-full object-contain" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white group-hover:text-green-400 transition-colors">{platform.name}</h4>
                    <p className="text-xs text-gray-500">{platform.price}</p>
                  </div>
                </div>
                <div className="bg-green-500 text-black px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider">
                  Watch
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* Trailer */}
        <section>
          <h3 className="text-lg font-bold mb-4">Official Trailer</h3>
          {trailerEmbed ? (
            <div className="aspect-video w-full rounded-2xl overflow-hidden bg-neutral-900 border border-white/10">
              <iframe 
                src={trailerEmbed}
                title={`${movie.title} Trailer`}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              ></iframe>
            </div>
          ) : (
            <div className="aspect-video w-full rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-sm text-gray-400">
              Trailer not available yet.
            </div>
          )}
        </section>

        {/* Sharing Card (Visual Representation for Socials) */}
        <section className="pt-4">
          <div className="p-6 rounded-3xl bg-gradient-to-br from-neutral-800 to-black border border-white/10">
            <h4 className="text-xs font-black text-green-400 uppercase tracking-[0.2em] mb-4 text-center">Share This Vibe</h4>
            <div className="flex gap-4">
              <img src={movie.poster_url} className="w-24 rounded-lg shadow-xl" />
              <div className="flex flex-col justify-center">
                <p className="text-lg font-bold leading-tight mb-1">{movie.title}</p>
                <p className="text-xs text-gray-400 line-clamp-2 mb-3">"{aiTagline}"</p>
                <div className="flex items-center gap-2">
                  <span className="text-[8px] bg-green-500 text-black px-2 py-0.5 rounded-full font-black uppercase">FlickNaija Approved</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default MovieDetails;
