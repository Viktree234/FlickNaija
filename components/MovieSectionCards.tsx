
import React from 'react';
import { Movie } from '../types';
import MovieCard from './MovieCard';

interface MovieSectionCardsProps {
  title: string;
  movies: Movie[];
  onMovieClick: (id: number) => void;
}

const MovieSectionCards: React.FC<MovieSectionCardsProps> = ({ title, movies, onMovieClick }) => {
  if (movies.length === 0) return null;

  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4 px-4">
        <h2 className="text-xl font-bold tracking-tight">{title}</h2>
        <button className="text-xs font-bold text-green-400 uppercase tracking-widest">View All</button>
      </div>
      <div className="flex overflow-x-auto gap-4 px-4 pb-4 hide-scrollbar">
        {movies.map(movie => (
          <MovieCard key={movie.id} movie={movie} onClick={onMovieClick} />
        ))}
      </div>
    </section>
  );
};

export default MovieSectionCards;
