import React from 'react';
import MovieCard from './MovieCard';
import type { Movie } from '../types/movie';

type Props = {
  movies: Movie[];
  onOpenTrailer?: (movie: Movie) => void;
};

const MovieGrid: React.FC<Props> = ({ movies, onOpenTrailer }) => {
  return (
    <div className="home-movies-grid">
      {movies.map(movie => (
        <MovieCard
          key={movie.id}
          movie={movie}
          onOpenTrailer={onOpenTrailer}
        />
      ))}
    </div>
  );
};

export default MovieGrid;