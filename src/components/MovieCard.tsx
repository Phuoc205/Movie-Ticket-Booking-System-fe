import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { Movie } from '../types/movie';

const MovieCard: React.FC<{
  movie: Movie;
  onOpenTrailer?: (movie: Movie) => void;
}> = ({ movie, onOpenTrailer }) => {

  const navigate = useNavigate();

  const isComingSoon = movie.status === 'UPCOMING';
  const isClassic = movie.status === 'CLASSIC';
  const isNowShowing = movie.status === 'NOW_SHOWING';
  
  const handleClick = () => {
    if (isComingSoon) {
      onOpenTrailer?.(movie);
      return;
    }

    if (isClassic) {
      navigate(`/movie/${movie.id}`);
      return;
    }

    navigate(`/movie/${movie.id}`);
  };

  return (
    <div onClick={handleClick} className="movie-card group cursor-pointer relative">
      
      <div className="movie-poster-placeholder">
        {movie.poster_url ? (
          <img src={movie.poster_url} className="w-full h-full object-cover" />
        ) : (
          <span>Chưa có poster</span>
        )}

        <div className="movie-poster-overlay"></div>

        <div className="movie-duration-badge">
          {movie.duration} phút
        </div>

        {/* 🟡 Badge */}
        {isComingSoon && (
          <div className="absolute top-2 left-2 bg-yellow-400 text-black px-2 py-1 text-xs rounded">
            Sắp chiếu
          </div>
        )}
      </div>

      <div className="movie-card-content">
        <h3 className="movie-card-title">{movie.title}</h3>
        <div className="movie-card-genre">{movie.genre}</div>
        <p className="movie-card-description">{movie.description}</p>

        <div className="movie-card-footer">
          <span>
            Khởi chiếu: {new Date(movie.release_date).toLocaleDateString('vi-VN')}
          </span>
        </div>

        {/* 👇 text action */}
        <div className="mt-2 text-sm font-semibold">
          {isComingSoon && (
            <span className="text-yellow-400">Xem trailer</span>
          )}

          {isNowShowing && (
            <span className="text-green-400">Đặt vé ngay</span>
          )}

          {isClassic && (
            <span className="text-gray-400">Xem lại</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieCard;