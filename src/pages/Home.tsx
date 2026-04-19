import React, { useState } from 'react';
import { useMovies } from '../hooks/useMovies';
import Hero from '../components/Hero';
import Trailer from '../components/Trailer';
import MovieGrid from '../components/MovieGrid';
import './css/Home.css';

const Home = () => {
  const { movies, comingSoon, loading, searching, searchMovies, fetchMovies } = useMovies();
  const [searchQuery, setSearchQuery] = useState('');
  const [trailerMovie, setTrailerMovie] = useState<Movie | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!searchQuery.trim()) {
      fetchMovies();
      return;
    }

    await searchMovies(searchQuery);
  };

  const getEmbedUrl = (url: string) => {
    try {
      const u = new URL(url);
      const videoId = u.searchParams.get("v") || url.split("/").pop();
      return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    } catch {
      return "";
    }
  };

  return (
    <div className="page-container">

      <Trailer />

      <Hero>
        <div className="z-10 relative">
            <h1 className="page-title mb-3">
              Phim Đang Chiếu
            </h1>
            <p className="text-gray-400 text-lg font-light tracking-wide">Đặt vé ngay để thưởng thức những bộ phim bom tấn</p>
          </div>

          <form onSubmit={handleSearch} className="home-search">
            <input
              type="text"
              placeholder="Tìm kiếm tên phim..."
              className="input-field rounded-r-none w-full !bg-gray-900/80 !backdrop-blur-md"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              type="submit"
              disabled={searching}
              className="btn-primary rounded-l-none !rounded-r-xl min-w-[120px]"
            >
              {searching ? <div className="spinner-small"></div> : 'Tìm Kiếm'}
            </button>
          </form>
      </Hero>

      <div className="max-w-7xl mx-auto px-4 mt-8">
        {loading ? (
          <div className="flex justify-center py-32">
            <div className="spinner" />
          </div>
        ) : movies.length > 0 ? (
          <MovieGrid movies={movies} />
        ) : (
          <div className="text-center py-24 text-gray-400">
            Không tìm thấy phim
          </div>
        )}
      </div>

      {/*PHIM SẮP CHIẾU */}
      <div className="max-w-7xl mx-auto px-4 mt-16 pb-20">
        <h2 className="text-3xl font-bold mb-6 border-l-4 border-yellow-500 pl-4">
          Sắp Chiếu
        </h2>

        {comingSoon.length > 0 ? (
          <MovieGrid 
            movies={comingSoon} 
            isComingSoon 
            onOpenTrailer={setTrailerMovie}
          />
        ) : (
          <div className="text-gray-400 text-center py-10">
            Chưa có phim sắp chiếu
          </div>
        )}
      </div>

      {trailerMovie && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="relative w-[80%] aspect-video">
            <iframe
              className="w-full h-full rounded-xl"
              src={getEmbedUrl(trailerMovie.trailer_url || "")}
              allow="autoplay; encrypted-media"
              allowFullScreen
            />

            <button
              onClick={() => setTrailerMovie(null)}
              className="absolute -top-10 right-0 text-white text-2xl"
            >
              ✕
            </button>
          </div>

          <div
            className="absolute inset-0 -z-10"
            onClick={() => setTrailerMovie(null)}
          />
        </div>
      )}

    </div>
  );
};

export default Home;