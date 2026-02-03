
import React from 'react';
import { Movie } from '../types';
import { ICONS, COLORS } from '../constants';

interface MovieCardProps {
  movie: Movie;
  onClick: (id: number) => void;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, onClick }) => {
  return (
    <div 
      onClick={() => onClick(movie.id)}
      className="flex-none w-40 md:w-56 group cursor-pointer"
    >
      <div className="relative aspect-[2/3] overflow-hidden rounded-2xl mb-2 bg-neutral-900 border border-white/5 transition-transform duration-300 group-hover:scale-[1.02]">
        <img 
          src={movie.poster_url} 
          alt={movie.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute top-2 right-2 flex flex-col gap-1 items-end">
          <div className="bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] font-bold border border-white/10">
            {movie.year}
          </div>
          {movie.lowDataFriendly && (
            <div className="bg-green-600/80 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] font-bold text-white uppercase">
              Low Data
            </div>
          )}
        </div>
        <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] font-bold border border-white/10">
          <span className="text-yellow-400"><ICONS.Star /></span>
          {movie.rating}
        </div>
      </div>
      <h3 className="text-sm font-bold line-clamp-1 group-hover:text-green-400 transition-colors">{movie.title}</h3>
      <div className="flex items-center gap-2 mt-1">
        <span className="text-[10px] text-gray-400 font-medium">{movie.genres[0]}</span>
        <span className="w-1 h-1 rounded-full bg-gray-600"></span>
        <span className="text-[10px] text-green-400 font-bold">{movie.platforms[0]?.name}</span>
      </div>
    </div>
  );
};

export default MovieCard;
