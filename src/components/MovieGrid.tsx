import React from 'react';
import MovieCard from './MovieCard';
import type { Movie } from '../hooks/useMovies';

type Props = {
  movies: Movie[];
  isComingSoon?: boolean;
  onOpenTrailer?: (movie: Movie) => void;
};

const MovieGrid: React.FC<Props> = ({ movies, isComingSoon = false, onOpenTrailer }) => {
  return (
    <div className="home-movies-grid">
      {movies.map(movie => (
        <MovieCard
          key={movie.id}
          movie={movie}
          isComingSoon={isComingSoon}
          onOpenTrailer={onOpenTrailer}
        />
      ))}
    </div>
  );
};

export default MovieGrid;